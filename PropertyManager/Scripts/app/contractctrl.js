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
		$(document).ready(function () {
            $('ul.tabs li').click(function () {
                var tab_id = $(this).attr('data-tab');
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
                $(this).addClass('current');
                $("#" + tab_id).addClass('current');
            })
        });
        $scope.apartmentList = ["Royal City1","Time City1","Time City2","Time City3","Royal City2"];
        $scope.employeeList = ["Hoàng Sang","Bùi Hải","Tuấn Nghĩa","Trần Hoàn","Quang Tuấn"];
        $scope.customerList =  ["Hoàng Sang","Bùi Hải","Tuấn Nghĩa","Trần Hoàn","Quang Tuấn"];
            // {name: "Daryl", surname: "Rowland",},
            // {name: "Alan", surname: "Partridge"},
            // {name: "Annie", surname: "Rowland"}
        
		$( "#autocomplete" ).autocomplete({
			source: $scope.apartmentList
		});
		$( "#acEmployee" ).autocomplete({
			source: $scope.employeeList
		});
		$( "#acCustomer" ).autocomplete({
			source: $scope.customerList
		});
		
	}
}
app.controller('ContractCtrl', ContractCtrl);