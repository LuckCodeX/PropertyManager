function IssueCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {

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


	$scope.loadIssue = function() {
       
        
        xhrService.get("GetAllIssue")
        .then(function(data) {
        	console.log(data);
                $scope.issueList = data.data;
            },
            function(error) {
                console.log(error.statusText);
            });
        
        
    };

    	$scope.saveIssue = function () {
        xhrService.post("SaveIssue", $scope.data)
            .then(function (data) {
            	toastr.success('Thành công!');
                setTimeout(function(){ window.location.href = "/system/issue"; }, 1000);

            },
                function (error) {
                	toastr.error('Thất bại!');
                    console.log(error.statusText);
                });
    };

    $scope.deleteIssue = function (item) {
        swal({
            title: "Bạn muốn xóa " + "sự cố" + " " + item.Name + " ?",
            text: "Sự cố đã xóa không thể khôi phục!",
            icon: "warning",
            buttons: [
                'Không',
                'Có'
            ],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    xhrService.delete("DeleteIssue/" + item.Id)
                        .then(function (data) {
                            $scope.loadIssue();
                            toastr.success('Thành công!');
                        },
                            function (error) {
                               toastr.error('Thất bại!');
                            });

                }
            });
    };

   
$scope.loadIssueDetail = function () {
        $scope.data = {};
        if ($stateParams.id !== undefined) {
            xhrService.get("GetIssueDetail/" + $stateParams.id)
                .then(function (data) {
                    $scope.data = data.data;
                   
                },
                    function (error) {
                       
                        console.log(error.statusText);
                    });
        } 

    }



}
app.controller('IssueCtrl', IssueCtrl);