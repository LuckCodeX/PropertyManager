function VisitCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	$scope.monthText = ["Tháng một", "Tháng hai", "Tháng ba", "Tháng tư", "Tháng năm", "Tháng sáu", "Tháng bảy", "Tháng tám", "Tháng chín", "Tháng mười", "Tháng mười một", "Tháng mười hai"];
	$scope.loadVisit = function(){
		// $scope.visitList = [];
		// for (var i = 0; i < 20; i++) {
		// 	$scope.visitList.push({
		// 		OwnerName:"Hoang Sang",
		// 		Phone:"091352186",
		// 		Email:"sangbeo@gmail.com",
		// 		CountVist:3,
		// 		CreateAt:"22/09/2018"});
		// }
		$scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.typeStatus = $stateParams.status === undefined ? -1 : $stateParams.status;
		xhrService.get("GetListUserVisit/"+$scope.bigCurrentPage+ "/" + $scope.typeStatus)
            .then(function (data) {
            	$scope.totalItems = data.data.total;
            	$scope.visitList = data.data.data;
                console.log(data);
            },
                function (error) {
                    console.log(error.statusText);
                });
	}

	$scope.objectHistory = function(){
		return {
			"Id":"0",
			"ActualDate":"",
			"ExpectedDate":""
		};
	}

	$scope.addHistory = function(apt){
		// apt.Histories.push({
		// 	"Id":"0",
		// 	"ActualDate":"",
		// 	"ExpectedDate":""
		// });
		// return apt;
	}
	function convertDateToUnixTimeStamp(datestring){
		var date = new Date(datestring);
		return date.getTime()/1000;
	}
	$scope.submitVisit = function(){
		console.log($scope.visit);
		var data= {
			"Id": $scope.visit.Id,
			"Status":$scope.visit.Status,
			"UserProfile":{
				"Id":$scope.visit.UserProfile.Id,
				"Phone":$scope.visit.UserProfile.Phone
			},
			"Items":[]
		};
		for (var i = 0; i < $scope.visit.Items.length; i++) {
			var item = {
				"Id":$scope.visit.Items[i].Id,
				"Status":Number($scope.visit.Items[i].Status),
				"Histories":[]
			};
			for (var j = 0; j < $scope.visit.Items[i].Histories.length; j++) {
				if($scope.visit.Items[i].Histories[j].ActualDate && $scope.visit.Items[i].Histories[j].ExpectedDate){
					var history = {
						"Id":$scope.visit.Items[i].Histories[j].Id,
						"ActualDate":convertDateToUnixTimeStamp($scope.visit.Items[i].Histories[j].ActualDate),
						"ExpectedDate":convertDateToUnixTimeStamp($scope.visit.Items[i].Histories[j].ExpectedDate)
					}
					item.Histories.push(history);
				}
			}
			data.Items.push(item);
		};
		xhrService.post("SaveUserVisit",data)
            .then(function (data) {
            	console.log(data)
            },
            function (error) {
                console.log(error.statusText);
            });
	}
	$scope.pageChanged = function () {
        $location.path("/visit").search({ page: $scope.bigCurrentPage, status: $scope.typeStatus });
    };

    $scope.convertDate = function(timeString){
    	var date = new Date(timeString*1000);
    	var timeConvert = date.getDate() + "/" + Math.ceil(date.getMonth()+1) + "/" +date.getFullYear();
    	return timeConvert;
    }

    $scope.deleteVisit = function(id){
    	swal({
            title: "Bạn có chắc chắn muốn xóa ?",
            text: "Lịch hẹn đã xóa không thể khôi phục!",
            icon: "warning",
            buttons: [
                'Không',
                'Có'
            ],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                xhrService.delete("DeleteUserVisit/"+id)
                .then(function (data) {
                    $scope.loadVisit();
                    swal("Xóa lịch hẹn thành công!",
                        {
                            icon: "success",
                        });

                },
                function (error) {
                    swal("Xóa lịch hẹn thất bại!",
                        {
                            icon: "error",
                        });
                });

            }
        });
    }

	$scope.loadVisitDetail = function(){
		
		xhrService.get("GetUserVisitDetail/" + $stateParams.id)
            .then(function (data) {
            	$scope.itemList = data.data.Items;
            	$scope.visit = data.data;
            	$scope.dateOptions = {
				    formatYear: 'yy',
				    maxDate: new Date(2030, 5, 22),
				    minDate: new Date(),
				    startingDay: 1
				  };
				  $scope.format = 'dd/MM/yyyy';
				for (var i = 0; i < $scope.itemList.length; i++) {
					if($scope.itemList[i].Histories.length == 0){
						$scope.itemList[i].Histories.push({
							"Id":"0",
							"ActualDate":"",
							"ExpectedDate":""
						})
					}
				}
                console.log(data);
            },
                function (error) {
                    console.log(error.statusText);
                });
	}
}
app.controller('VisitCtrl', VisitCtrl);