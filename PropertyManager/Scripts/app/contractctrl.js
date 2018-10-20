function ContractCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	$scope.contractList = [];
	$scope.loadContract = function(){
		for (var i = 0; i < 20; i++) {
			$scope.contractList.push({
				"Apartment":{
					Code:"AID_00024_021"
				},
				"UserProfileOwner":{
					"FullName":"Hoang Sang",
					"Phone":"0913521548"
				},
				"Customer":{
					"FullName":"Tuan Nghia",
					"Phone":"091384548"
				}
			});
		}
		
	}

	$scope.loadContractDetail = function(){
		$scope.aptModel = {};
		$scope.apt = {};
		$scope.cus = {};
		$scope.cusModel = {};
		$(document).ready(function () {
            $('ul.tabs li').click(function () {
                var tab_id = $(this).attr('data-tab');
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
                $(this).addClass('current');
                $("#" + tab_id).addClass('current');
            })
        });
        $scope.apartmentList = [{name:"Royal City1",value:1},
        						{name:"Royal City2",value:2},
        						{name:"Times City1",value:3},
        						{name:"Times City2",value:4},
        						{name:"Times City3",value:5}];
        $scope.employeeList = [{name:"Hoàng Sang",value:1},
        						{name:"Bùi Hải",value:2},
        						{name:"Tuấn Nghĩa",value:3},
        						{name:"Trần Hoàn",value:4},
        						{name:"Quang Tuấn",value:5}];
        $scope.customerList =  [{name:"Hoàng Sang",value:1},
        						{name:"Bùi Hải",value:2},
        						{name:"Tuấn Nghĩa",value:3},
        						{name:"Trần Hoàn",value:4},
        						{name:"Quang Tuấn",value:5}];
            // {name: "Daryl", surname: "Rowland",},
            // {name: "Alan", surname: "Partridge"},
            // {name: "Annie", surname: "Rowland"}
        
		// $( "#autocomplete" ).autocomplete({
		// 	source: $scope.apartmentList
		// });
		// $( "#acEmployee" ).autocomplete({
		// 	source: $scope.employeeList
		// });
		// $( "#acCustomer" ).autocomplete({
		// 	source: $scope.customerList
		// });
		$scope.disable = false;
		$scope.myConfig = {
			maxItems: 1,
		  valueField: 'value',
		  labelField: 'name'
		};
	}

	$scope.saveModalCustomer = function(){
		$scope.cus.company = $scope.cusModel.company;
		$scope.cus.address = $scope.cusModel.address;
		$scope.cus.customer = $scope.cusModel.customer;
		$scope.cus.phone = $scope.cusModel.phone;
		$scope.cus.email = $scope.cusModel.email;
		 $('#customerModal').modal('hide');
	}

	$scope.saveModalApartment = function(){
		$scope.apt.project = $scope.aptModel.project;
		$scope.apt.apartment = $scope.aptModel.apartment;
		$scope.apt.countApartment = $scope.aptModel.countApartment;
		$scope.apt.area = $scope.aptModel.area;
		$scope.apt.bedrooms = $scope.aptModel.bedrooms;
		$scope.apt.ownerName = $scope.aptModel.ownerName;
		$scope.apt.phone = $scope.aptModel.phone;
		 $('#apartmentModal').modal('hide');
	}
}
app.controller('ContractCtrl', ContractCtrl);