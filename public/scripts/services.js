'use strict';

angular.module('MiningUseCase')
    .factory('MiningService', ['$http', '$localStorage', '$location', '$rootScope', function ($http, $localStorage, $location, $rootScope) {
        var baseUrl = "";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }
        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }
        function setBootUpValues(currentUser) {
            $("#lisPurchaseOrder").hide();
            $("#logistics1").hide();
            $("#logistics1").hide();
            $("#logistics1").hide();
            $rootScope.showflag = true;
            $rootScope.message = '';
            $rootScope.id = currentUser.id;
            $rootScope.FullName = currentUser.fullname;
            $rootScope.EMail = currentUser.email;
            $rootScope.usertype = currentUser.UserType;
            $rootScope.blockchainaccount = currentUser.blockchainaccount;
            $rootScope.errorclass = 'rederror';
        }

        return {
            getBaseUrl: function () {
                return baseUrl;
            },
            signin: function (data, callback) {
                $http.post(baseUrl + '/authenticate', data).then(function (response) {
                    if (response.data.message == "Not Ok") {
                        $('#myModal').modal({ show: true });
                        $rootScope.message = "Please enter correct credentials.";
                    }
                    else {
                        if (response.data.token != undefined) {
                            $rootScope.showflag = true;
                            $localStorage.token = response.data.token;
                            var user = getUserFromToken();
                            setBootUpValues(user);
                            if ($rootScope.usertype == "Mill") {
                                $location.path('/homemill');
                            }
                            else if ($rootScope.usertype == "Logistics Company") {
                                $location.path('/lc1');
                            }
                            else if ($rootScope.usertype == "Customer") {
                                $location.path('/homecustomer');
                            }
                            else if ($rootScope.usertype == "Service Center") {
                                $location.path('/sc');
                            }
                            else if ($rootScope.usertype == "Warehouse") {
                                $location.path('/warehouse');
                            }
                            else if ($rootScope.usertype == "order") {
                                $location.path('/order');
                            }
                            else {
                                $location.path('/homeCM');
                            }
                        }
                    }
                }, function (response) {
                    return "Something went wrong";
                }
                );
            },
            getUserFromToken: function (success) {
                var user = getUserFromToken();
                return user;
            },
            setBootUpValues: function (currentUser) {

                setBootUpValues(currentUser);
            },
            logOut: function () {
                $rootScope.showflag = false;
                $rootScope.message = '';
                $rootScope.FullName = '';
                $rootScope.EMail = '';
                $rootScope.usertype = '';
                $rootScope.blockchainaccount = '';
                delete $localStorage.token;
                $location.path('/signin');
            }
        };
    }
    ]);