'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('HomeMillController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
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
                $scope.id ='';
            });
        }
        refreshOrders();
        $scope.UpdateMill = function (id) {
            $("#divGrid").hide();
            $("#divDetails").show();
            $("#divShowDetails").hide();
            $scope.POOrder = {};
            $scope.id = id;
        };
        $scope.CancelOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
            $scope.POOrder = {};
        };
        $scope.SaveOrder = function () {
            ShowWait(true);
            $scope.POOrder.id = $scope.id;
            $http.post('SaveOrder/', $scope.POOrder).then(function (response) {
                if (response.data.message == "OK") {
                    refreshOrders();
                    ShowWait(false);
                    $('#myModal').modal({ show: true });
                    $rootScope.message = "Saved.";
                }
            });
        };
        $scope.ShowOrder = function (address,status) {
            ShowWait(true);
            if (status == 'With Mill'){
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
        }
        else {
            $http.get('/GetConsignmentMill/' + address).then(function (response) {
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
        }
        };
        $scope.CloseOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
            $scope.id ='';
        };
    }]);

