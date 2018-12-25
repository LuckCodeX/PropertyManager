function MaidWaterCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {




// $scope.timePickerOptions = {
//         showMeridian: false
//     };
var todayDate = new Date().getMonth();
    $scope.datePickerOptions = {
    
    minMode: 'month',
     formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(new Date().setMonth(todayDate - 2)),
            startingDay: 1,
    };

    $scope.openCalendar = function(e, picker) {
        picker.open = true;
    };

    $scope.buttonBar = {
        show: true,
        now: {
            show: true,
            text: 'Bây giờ'
        },
        today: {
            show: true,
            text: 'Hôm nay'
        },
        clear: {
            show: false,
            text: 'Làm mới'
        },
        date: {
            show: true,
            text: 'Ngày'
        },
        time: {
            show: true,
            text: 'Giờ'
        },
        close: {
            show: true,
            text: 'Đóng'
        },
        cancel: {
            show: false,
            text: 'Quay lại'
        }
    }










}

app.controller('MaidWaterCtrl', MaidWaterCtrl);