function LoginCtrl($scope,
    $rootScope,
    $stateParams,
    $window,
    $timeout,
    xhrService,
    $anchorScroll) {
    $scope.login = function () {
        xhrService.post("Login", $scope.user).then(function (data) {
            localStorage.setItem('admin', Base64.encode(JSON.stringify(data.data)));
            $scope.admin = data.data;
            if ($scope.admin.Role == 1) {
                $window.location.href = "/dashboard";
            }
        }, function (error) {
            $scope.errorText = "Tài khoản hoặc mật khẩu sai";
        });
    }
}

app.controller('LoginCtrl', LoginCtrl);