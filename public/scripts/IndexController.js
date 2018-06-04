'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('IndexController', ['$rootScope', '$scope', '$location', '$localStorage', 'MiningService', function ($rootScope, $scope, $location, $localStorage, MiningService) {
        var currentUser = MiningService.getUserFromToken();
        if (currentUser.fullname == undefined) {
            $location.path('/signin');
        }
        else {
          MiningService.setBootUpValues(currentUser);
        }
        $scope.LogoutUser = function () {
          MiningService.logOut();
        }
    }]);
