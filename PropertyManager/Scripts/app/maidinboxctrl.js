function MaidInboxCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll, $filter) {

$(document).ready(function() {
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": true,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "3000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        }
  });


$scope.loadMaidInbox = function() {
       $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.filterData = {
            "Page":$scope.bigCurrentPage,
            "Limit":10,        
        };
        
        xhrService.post("GetListMaidInbox",$scope.filterData)
        .then(function(data) {
                $scope.maidinbox=data.data.data;
                $scope.totalItems = data.data.total;
            },
            function(error) {
                console.log(error.statusText);
            });
        
        
    };

    $scope.saveMaidInbox = function(maidinbox){
        let data = {
            "Content":maidinbox.Content,
        };
    	xhrService.post("SaveMaidInbox",data).then(function (data) {
            toastr.success('Thành công!');
                $('#employeeModal').modal('hide');
                $scope.loadMaidInbox();
            
        },
        function (error) {
            console.log(error.statusText);
        });

    };

    $scope.pageChanged = function () {
        $location.path("/maid/inbox")
        .search({ page: $scope.bigCurrentPage, 
                });
    };



}

app.controller('MaidInboxCtrl', MaidInboxCtrl);