angular.module('MiningUseCase')
    .controller('SigninController', ['$rootScope', '$scope', 'MiningService', function ($rootScope, $scope, MiningService) {
        $("#useDD").hide();
        ShowWait(false);
        $scope.emailid = '';
        $scope.password = '';
        $scope.LoginClick = function (form) {
            ShowWait(true);
            if (form.$valid) {
                var data = {
                    "emailid": $scope.emailid,
                    "password": $scope.password
                };
                MiningService.signin(data);
                $("#useDD").show();
                ShowWait(false);
            }
        }

    }]);


function ShowWait(flag) {
    if (flag) {
        $("#divloading").show();
        $('.loading').css("transform", "rotateY(0deg)");
        var delay = 10;
        setTimeout(function () {
            $('.loading-spinner-large').css("display", "block");
            $('.loading-spinner-small').css("display", "block");
        }, delay);
    }
    else { $("#divloading").hide(); }
}