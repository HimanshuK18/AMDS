'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('CustomerController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
        $scope.POOrder = {};
        $("#divGrid").hide();
        $("#divShowDetails").hide();
        $("#lisPurchaseOrder").hide();
        $("#logistics1").hide();
        $("#logistics2").hide();
        $("#logistics3").hide();
        ShowWait(false);
        var refreshOrders = function () {
            $http.get('/GetConsignmentsCustomer/' + $rootScope.id).then(function (response) {
                $("#divGrid").show();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.OrderList = response.data;
            });
        }
        refreshOrders();
        $scope.ShowOrder = function (address, id) {
            ShowWait(true);
            $http.get('/GetConsignmentMill/' + address).then(function (response) {
                $("#divGrid").hide();
                $("#divShowDetails").show();
                var typeNumber = 4;
                var errorCorrectionLevel = 'L';
                var qr = qrcode(typeNumber, errorCorrectionLevel);
                qr.addData(address);
                qr.make();
                document.getElementById('qrplaceHolder').innerHTML = qr.createImgTag(4, 16);
                $scope.OrderItem = response.data;
                $scope.address = address;
                $scope.id = id;
                ShowWait(false);
            });
        };
        $scope.CloseOrder = function () {
            $("#divGrid").show();
            $("#divShowDetails").hide();
            $scope.address = '';
            $scope.id = '';
        };
        $scope.AcceptOrder = function () {
            $http.post ('/SaveOrderC/' + $scope.id).then(function (response) {
                $("#divGrid").show();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                $scope.OrderList = response.data;
                $('#myModal').modal({ show: true });
                    $rootScope.message = "Order Accepted.";
            });
        }
    }]);

