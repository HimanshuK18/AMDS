'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('LogisticsCompanyTwoController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
        $scope.POOrder = {};
        $("#logistics1").show();
        $("#logistics2").show();
        $("#logistics3").show();
        $("#lisPurchaseOrder").hide();
        ShowWait(false);
        var refreshOrders = function () {
            $http.get('/GetConsignmentsMill').then(function (response) {
                $("#divGrid").show();
                $("#divDetails").hide();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.OrderID = '';
                $scope.OrderList = response.data;
            });
        }
        refreshOrders();
        $scope.UpdateOrderLC2 = function (id,Order) {
            $("#divGrid").hide();
            $("#divDetails").show();
            $("#divShowDetails").hide();
            $scope.POOrder = {};
            $scope.OrderID = id;
            if(Order.OrderType == 'Custom Product'){$scope.POOrder.productid = Order.productidmill;}
                else{$scope.POOrder.productid = Order.productid;}
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
            $http.post('SaveLogisticsTwoOrder/' + $scope.OrderID, $scope.POOrder).then(function (response) {
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