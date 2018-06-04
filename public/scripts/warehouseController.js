'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('warehouseController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
        $("#lisPurchaseOrder").show();
        $("#logistics1").hide();
        $("#logistics2").hide();
        $("#logistics3").hide();
        $("#divDetails").hide();
        $("#divShowDetails").hide();
        $scope.POOrder = {};
        $scope.OrderID = '';
        $scope.type = '';
        ShowWait(false);
        var refreshOrders = function () {
            $http.get('/GetConsignmentsWarehouse/' + $rootScope.id).then(function (response) {
                $("#divGrid").show();
                $("#divDetails").hide();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.OrderID = '';
                $scope.OrderList = response.data;
            });
        }
        refreshOrders();
        $scope.EditOrder = function (id,Order, type) {
            $http.get('/GetConsignmentsWarehouse/' + $rootScope.id).then(function (response) {
                $scope.OrderID = id;
                $scope.type = type;
                $("#divGrid").hide();
                $("#divDetails").show();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                if(Order.OrderType == 'Custom Product'){$scope.POOrder.productid = Order.productidmill;}
                else{$scope.POOrder.productid = Order.productid;}
            });
        };
        $scope.CancelOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
            $scope.POOrder = {};
            $scope.OrderID = '';
            $scope.type = '';
        };
        $scope.SaveOrder = function () {
            ShowWait(true);
            $http.post('SaveWarehouse/' + $scope.OrderID + '/' + $scope.type, $scope.POOrder).then(function (response) {
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
        };
        $scope.CloseOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
        };
    }]);

