function AccountCtrl($scope,$rootScope,$stateParams, $location,$timeout, xhrService,$anchorScroll) {
    $scope.roles=[
	{name:"Quản lý website",value:0},{name:"Quản lý nhóm căn hộ",value:2},
	{name:"Quản lý nhóm khách hàng",value:3}];
	$scope.leader = new Map();
	$scope.leader.set(2, 4);
	$scope.leader.set(3, 5);
	$scope.emp = new Map();
	$scope.emp.set(4, 2);
	$scope.emp.set(5, 3);
    
	$scope.loadAccount = function(){
		$scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.searchEmp2 = $stateParams.search === undefined ? '' : $stateParams.search;
		xhrService.get("GetListAccount/" + $scope.bigCurrentPage+ "/" + $scope.searchEmp2)
            .then(function (data) {
                $scope.accountList = data.data.data;
	  			$scope.totalItems = data.data.total;
            },
            function (error) {
                console.log(error.statusText);
            });
	}
	  $scope.pageChanged = function() {
	    $location.path("/account").search({ page: $scope.bigCurrentPage, search: $scope.searchEmp2 });	
	  };

	  
	  $scope.loadAccountDetail = function(){
  		$scope.data = {};
  		if ($stateParams.id != "") {
  			xhrService.get("GetAccountDetail/"+$stateParams.id)
		    .then(function (data) {
		        $scope.data = data.data;
		    },
		    function (error) {
		    	
		        console.log(error.statusText);
		    });
  		}else{
  			$scope.data.Role = 0;
  		}
  		
		xhrService.get("GetListLeader")
		    .then(function (data) {
		       $scope.listLeader = data.data;
		       var status1 = true;
		       var status2 = true;
		       for (var i = 0; i < $scope.listLeader.length; i++) {
		       		if($scope.listLeader[i].Role == 3 && status1 && $scope.listLeader[i].Id != $stateParams.id){
		       			$scope.roles.push({name:"Nhân viên nhóm khách hàng",value:5});
		       			status1 = false;
		       		}else if($scope.listLeader[i].Role == 2 && status2 && $scope.listLeader[i].Id != $stateParams.id){
		       			$scope.roles.push({name:"Nhân viên nhóm căn hộ",value:4});
		       			status2 = false;
		       		}
		       }
		    },
		    function (error) {
		    	$scope.data.Role = 0;
		        console.log(error.statusText);
		    });
	  }
	  $scope.saveAccount = function(){
	  	xhrService.post("SaveAccount",$scope.data)
		    .then(function (data) {
		        swal("Thành công!", "", "success")
				.then((value) => {
				  window.location.href = "/account";
				});
		        
		    },
		    function (error) {
		        console.log(error.statusText);
		    });
	  }

	  $scope.deleteAccount = function(item){
	  	 swal({
			  title: "Bạn muốn xóa "+item.Username+" ?",
			  text: "Tài khoản đã xóa không thể khôi phục!",
			  icon: "warning",
			  buttons: [
		        'Không',
		        'Có'
		      ],
			  dangerMode: true,
			})
			.then((willDelete) => {
			  if (willDelete) {
			  	xhrService.delete("DeleteAccount/" + item.Id)
	            .then(function (data) {
	            	$scope.loadAccount();
	                swal("Xóa tài khoản thành công!", {
				      icon: "success",
				    });

	            },
	            function (error) {
	                swal("Xóa tài khoản thất bại!", {
				      icon: "error",
				    });
	            });
			    
			  }
			});
	  }

	  
}
app.controller('AccountCtrl', AccountCtrl);