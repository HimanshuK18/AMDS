'use strict';

angular.module('MiningUseCase', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar'
])
.config(['$routeProvider', '$httpProvider','$locationProvider', function ($routeProvider, $httpProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.
        when('/signin', {
            templateUrl: 'partials/signin.html',
            controller: 'SigninController'
        }). 
        when('/homemill', {
            templateUrl: 'partials/homemill.html',
            controller: 'HomeMillController'
        }).
        when('/lc1', {
            templateUrl: 'partials/logisticsone.html',
            controller: 'logisticsoneController'
        }).
        when('/warehouse', {
            templateUrl: 'partials/warehouse.html',
            controller: 'warehouseController'
        }).
        when('/lc2', {
            templateUrl: 'partials/LogisticsCompanyTwo.html',
            controller: 'LogisticsCompanyTwoController'
        }).
        when('/lc3', {
            templateUrl: 'partials/LogisticsCompanyThree.html',
            controller: 'LogisticsCompanyThreeController'
        }).
        when('/sc', {
            templateUrl: 'partials/ServiceCenter.html',
            controller: 'servicecenterController'
        }).
        when('/homecustomer', {
            templateUrl: 'partials/Customer.html',
            controller: 'CustomerController'
        }).
        when('/order', {
            templateUrl: 'partials/homeorder.html',
            controller: 'HomeOrderController'
        }).
        otherwise({
            redirectTo: '/signin'
        });
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
}

])
.run(['$rootScope',function($rootScope){
$rootScope.showflag = false;
$rootScope.baseurl = 'http://localhost:3000';
}
]);
