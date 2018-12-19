function MaidProblemCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    const firstDay = getFirstDay(new Date());
    const today = getEndDay(new Date());

	$scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2050, 5, 22),
        minDate: new Date(1900,00,01),
        startingDay: 1
    };

     function convertDateToUnixTimeStamp(datestring){
        if (datestring) {
            console.log(datestring);
            return datestring.getTime()/1000;
        }else{
            return '';
        }
    }

    function getFirstDay(datestring){
        if (datestring) {
            var date = new Date(datestring);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            return parseInt(date.getTime()/1000);
        }else{
            return '';
        }
    }

    function getEndDay(datestring){
        if (datestring) {
            var date = new Date(datestring);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            return parseInt(date.getTime()/1000);
        }else{
            return '';
        }
    }

    $scope.format = 'dd/MM/yyyy';

    $scope.loadMaidProblem = function(){
        $scope.problemList = [];
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;

        for (var i = 0; i < 10; i++) {
            $scope.problemList.push({
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
}
app.controller('MaidProblemCtrl', MaidProblemCtrl);