'use strict';

angular.module('MiningUseCase')
    .controller('logisticsoneController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
        $("#divDetails").hide();
        $("#divShowDetails").hide();
        $scope.POOrder = {};
        $scope.OrderID = '';
        $("#logistics1").show();
        $("#logistics2").show();
        $("#logistics3").show();
        $("#lisPurchaseOrder").hide();
        ShowWait(false);
        var refreshOrders = function () {
            $http.get('/GetConsignmentsLogisticsOne/').then(function (response) {
                $("#divGrid").show();
                $("#divDetails").hide();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.OrderID = '';
                $scope.OrderList = response.data;
            });
        }
        refreshOrders();
        $scope.EditOrder = function (id, Order) {
            $scope.OrderID = id;
            $http.get('/GetLogisticsOneList').then(function (response) {
                $("#divGrid").hide();
                $("#divDetails").show();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                if(Order.OrderType == 'Custom Product'){$scope.POOrder.productid = Order.productidmill;}
                else{$scope.POOrder.productid = Order.productid;}                
                $scope.warehouse = response.data;
            });
        };
        $scope.CancelOrder = function () {
            $("#divGrid").show();
            $("#divDetails").hide();
            $("#divShowDetails").hide();
            $scope.POOrder = {};
            $scope.OrderID = '';
        };
        $scope.SaveOrder = function () {
            ShowWait(true);
            $http.post('SaveLogisticsOneOrder/' + $scope.OrderID, $scope.POOrder).then(function (response) {
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

