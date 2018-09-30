function AccountCtrl($scope,$rootScope,$stateParams, $location,$timeout, xhrService,$anchorScroll) {
    $scope.roles=[
	{name:"Quản lý website",value:0},{name:"Quản lý nhóm căn hộ",value:2},
	{name:"Quản lý nhóm khách hàng",value:3},{name:"Nhân viên nhóm căn hộ",value:4},{name:"Nhân viên nhóm khách hàng",value:5}];
    
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
		        loadListLeader();
		    },
		    function (error) {
		    	
		        console.log(error.statusText);
		    });
  		}else{
  			$scope.data.Role = 0;
  			$scope.data.ParentId = '';
  			loadListLeader();
  		}

	  }

	  function loadListLeader(){
	  	xhrService.get("GetListLeader")
		    .then(function (data) {
		       $scope.listLeader = data.data;
		       filterRole();
		       $scope.roleChange();
		    },
		    function (error) {
		    	$scope.data.Role = 0;
		        console.log(error.statusText);
		    });
	  }

	  function filterRole(){
	  	var role1ListTmp = $scope.listLeader.filter((p) => (p.Role == 2 && p.Id != $scope.data.Id));
	  	var role2ListTmp = $scope.listLeader.filter((p) => (p.Role == 3 && p.Id != $scope.data.Id));
	  	$scope.roleListTmp = $scope.roles.filter((p) => ((p.value < 4 ) || (p.value == 4 &&  role1ListTmp.length>0) || (p.value == 5 &&  role2ListTmp.length>0)));
	  }

	  $scope.roleChange = function(){
	  		$scope.leaderListTmp = $scope.listLeader.filter((p) => (((p.Role == 2 && $scope.data.Role == 4) ||(p.Role == 3 && $scope.data.Role == 5)) && p.Id != $scope.data.Id));
	  		
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