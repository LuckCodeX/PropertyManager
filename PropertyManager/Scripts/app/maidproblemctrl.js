function MaidProblemCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    const firstDay = getFirstDay(new Date());
    const today = getEndDay(new Date());

    $scope.convertDateToString = function(date){
        var timeConvert = date.getDate() + "/" + Math.ceil(date.getMonth()+1) + "/" +date.getFullYear();
        return timeConvert;
    }

    $scope.replaceString = function (str) {
        if (!str)
            return null;
        str = str.toLowerCase();
        str = str.replace(/\ /g, " ");
        str = str.replace(/à|á|ạ|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/\”|\“|\"|\[|\]|\?/g, "");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
        return str;
    };

    $scope.myConfig = {
          maxItems: 1,
          labelField: 'FirstName',
           score: function(search) {
            search = search.toLowerCase();
            search = search.replace(/\ /g, " ");
            search = search.replace(/à|á|ạ|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            search = search.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            search = search.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            search = search.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            search = search.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            search = search.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            search = search.replace(/đ/g, "d");
            search = search.replace(/\”|\“|\"|\[|\]|\?/g, "");
            search = search.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
            search = search.replace(/\u02C6|\u0306|\u031B/g, ""); 
            var score = this.getScoreFunction(search);  
            return function(item) {
                return score(item);
            };
        },
          searchField: ['FirstName','LastName','LowerFirstName','LowerLastName'],
          render: {
            option: function(item, escape) {
                var firstName = item.FirstName || item.LastName;
                var lastName = item.FirstName ? item.LastName : null;
                var code = item.FirstName ? item.Code : null;
                if(code == 0){
                    return '<div>' +
                    '<span class="">'+ escape(firstName) + " " + escape(lastName) + '</span>' +
                '</div>';
                }
                return '<div>' +
                    '<span class="">['+escape(code)+'] '+ escape(firstName) + " " + escape(lastName) + '</span>' +
                '</div>';
            
            },
            item: function(item, escape){
                var firstName = item.FirstName || item.LastName;
                var lastName = item.FirstName ? item.LastName : null;
                var code = item.FirstName ? item.Code : null;
                if(code == 0){
                    return '<div>' +
                    '<span class="">'+ escape(firstName) + " " + escape(lastName) + '</span>' +
                '</div>';
                }
                return '<div>' +
                    '<span class="">['+escape(code)+'] '+ escape(firstName) + " " + escape(lastName) + '</span>' +
                '</div>';
              },
                
        }
    };

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

    function getListEmployee(){
         xhrService.get("GetAllMaid",$scope.filterData)
        .then(function (data) {
            $scope.employeeList = [];
            $scope.employeeList.push({
                Id: -1,
                FirstName: 'Tất',
                LastName: "cả",
                Code: "0",
                value: -1
            });
            var dataEmp = data.data;
            dataEmp.forEach(function(item, index){
                let emp = {
                    Id: item.Id,
                    FirstName: item.FirstName,
                    LastName: item.LastName,
                    LowerFirstName: $scope.replaceString(item.FirstName)+ " " +  $scope.replaceString(item.LastName),
                    LowerLastName: $scope.replaceString(item.FirstName.toLowerCase())+ " "+  $scope.replaceString(item.LastName.toLowerCase()),
                    Code: item.Code,
                    value: item.Id
                };        
                $scope.employeeList.push(emp);
            });
        },
        function (error) {
            console.log(error.statusText);
        });
    }

    $scope.format = 'dd/MM/yyyy hh:mm';

    $scope.openNote = function(item,index){
        console.log(item);
        // $scope.dataTest[$scope.currentApartment.index].textNote = "Không có";
        $scope.currentProblem = item;
        $scope.currentProblem.index = index;
    }

    $scope.addNote = function(){
        let datestring = "";
        let date = new Date();
        datestring = date.getDate()+"/"+Math.ceil(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        $scope.currentProblem.notes.push({date:datestring,note:'',images:[]});
    }

    $scope.saveNote = function(){
        $scope.problemList[$scope.currentProblem.index].notes = $scope.currentProblem.notes;
        var length = $scope.problemList[$scope.currentProblem.index].notes.length;
        if(length > 0){
            length -= 1;
            $scope.problemList[$scope.currentProblem.index].textNote = $scope.problemList[$scope.currentProblem.index].notes[length].note;
        }
        
        $('#employeeModal').modal('hide');
    }

    $scope.openNoteFix = function(item,index){
        console.log(item);
        // $scope.dataTest[$scope.currentApartment.index].textNote = "Không có";
        $scope.currentProblem = item;
        $scope.currentProblem.index = index;
    }

    $scope.addNoteFix = function(){
        let datestring = "";
        let date = new Date();
        datestring = date.getDate()+"/"+Math.ceil(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        $scope.currentProblem.fix.push({date: new Date(),note:'',});
    }

   $scope.openCalendar = function(e, picker) {
        console.log(picker);
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

    $scope.saveNoteFix = function(){

        $scope.problemList[$scope.currentProblem.index].notes = $scope.currentProblem.fix;
        var length = $scope.problemList[$scope.currentProblem.index].fix.length;

        if(length > 0){
            length -= 1;
            $scope.problemList[$scope.currentProblem.index].textFix = $scope.convertDateToString($scope.problemList[$scope.currentProblem.index].fix[length].date);
        }


        
        $('#fixModal').modal('hide');
    }

    $scope.loadMaidProblem = function(){
        $scope.problemList = [];
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;

        for (var i = 0; i < 10; i++) {
            $scope.problemList.push({
                notes: [],
                fix:[]        
            });
        };
        getListEmployee();
    }
}
app.controller('MaidProblemCtrl', MaidProblemCtrl);