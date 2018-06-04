'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('HomeOrderController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
        $scope.POOrder = {};
        $("#lisPurchaseOrder").show();
        $("#logistics1").hide();
        $("#logistics2").hide();
        $("#logistics3").hide();
        ShowWait(false);
        var refreshOrders = function () {
            $http.get('/GetConsignmentsMill').then(function (response) {
                $("#divGrid").show();
                $("#divDetails").hide();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.OrderList = response.data;
            });
        }
        refreshOrders();
        $scope.CreateOrder = function () {
            $http.get('/GetOrderNumber/').then(function (response) {
                $("#divGrid").hide();
                $("#divDetails").show();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.POOrder.orderid = response.data.orderid;
                $http.get('/GetCustomersList/').then(function (response) {
                    $scope.customers = response.data;
                });
            });
        };
        $scope.CancelOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
            $scope.POOrder = {};
        };
        $scope.SaveOrder = function () {
            ShowWait(true);
            $http.post('SaveOrderOrder/', $scope.POOrder).then(function (response) {
                if (response.data.message == "OK") {
                    refreshOrders();
                    ShowWait(false);
                    $('#myModal').modal({ show: true });
                    $rootScope.message = "Saved.";
                }
            });
        };
        $scope.ShowOrder = function (address) {
            ShowWait(true);
            $http.get('/GetConsignmentO/' + address).then(function (response) {
                $("#divGrid").hide();
                $("#divDetails").hide();
                $("#divShowDetails").show();
                var typeNumber = 4;
                var errorCorrectionLevel = 'L';
                var qr = qrcode(typeNumber, errorCorrectionLevel);
                qr.addData(address);
                qr.make();
                document.getElementById('qrplaceHolder').innerHTML = qr.createImgTag(4, 16);
                $scope.OrderItem = response.data;
                ShowWait(false);
            });
        };
        $scope.CloseOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
        };
        $scope.OrderTypeSelected = function()
        {
            if ($scope.POOrder.OrderType == 'Standard Product')
            {$('#ddlsevicecenter').prop("disabled", true);}
            else{$('#ddlsevicecenter').prop("disabled", false);}
        };
    }]);

