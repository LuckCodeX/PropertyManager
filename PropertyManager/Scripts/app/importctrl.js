function ImportCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll, $http) {
    $scope.files = [];
    $scope.uploadFile = function() {
        $http({
                method: 'POST',
                url: API + "PostFile",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("model", angular.toJson(data.model));
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                    return formData;
                },
                data: { files: $scope.files }
            }).
            success(function (data, status, headers, config) {
                alert("success!");
            }).
            error(function (data, status, headers, config) {
                alert("failed!");
            });  
    };

    $scope.$on("seletedFile", function (event, args) {
        $scope.$apply(function () {
            //add the file object to the scope's files collection  
            $scope.files.push(args.file);
        });
    });  
}

app.controller('ImportCtrl', ImportCtrl);