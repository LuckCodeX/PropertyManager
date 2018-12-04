function MaidCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    $scope.loadMaidList = function(){
        $scope.maidList = [1,2,3,4,5,6,7,8];
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2030, 5, 22),
            minDate: new Date(),
            startingDay: 1
          };
          $scope.format = 'dd/MM/yyyy';
    }
	
}
app.controller('MaidCtrl', MaidCtrl);