    'use strict';

    /* Controllers */

    angular.module('MiningUseCase')
        .controller('servicecenterController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
            $scope.POOrder = {};
            $scope.OrderID = '';
            $("#divGrid").hide();
            $("#divDetails").show();
            $("#divShowDetails").hide();
            $("#lisPurchaseOrder").hide();
            $("#logistics1").hide();
            $("#logistics2").hide();
            $("#logistics3").hide();
            ShowWait(false);
            var refreshOrders = function () {
                $http.get('/GetConsignmentsServiceCenter/' + $rootScope.id).then(function (response) {
                    $("#divGrid").show();
                    $("#divDetails").hide();
                    $("#divShowDetails").hide();
                    $scope.POOrder = {};
                    $scope.OrderID = '';
                    $scope.OrderList = response.data;
                });
            }
            refreshOrders();
            $scope.EditOrder = function (id, pid) {
                $scope.OrderID = id;
                $("#divGrid").hide();
                $("#divDetails").show();
                $("#divShowDetails").hide();
                $scope.POOrder = {};
                //$scope.POOrder.productid = pid;
                $scope.customers = response.data;
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
                $http.post('SaveServiceCenter/' + $scope.OrderID, $scope.POOrder).then(function (response) {
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

