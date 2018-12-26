function MaidApartmentCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	 const firstDay = getFirstDay(new Date());
    const today = getEndDay(new Date());
    var currentScroll = 0;

    $scope.datePickerOptions = {
        showMeridian: false
    };

    function convertMinuteToTime(minutes){
        let hour = parseInt(minutes/60);
        let minute = minutes - (hour*60);
        let date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        return date;
    }

    function convertTimeToMinute(date){
        let minutes = 0;
        minutes += (date.getHours()*60);
        minutes += date.getMinutes();
        return minutes;
    }

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

    $scope.submitWorkDay = function(apartment){
        apartment.textDay = $scope.getTextDay(apartment.workdays);
        $scope.changeMaidApartment(apartment);
    }

    $scope.submitWorkTime = function(apartment){
        apartment.textTime = $scope.getTextTime(apartment.timeWork);
        $scope.changeMaidApartment(apartment);
    }

    $scope.changeMaidApartment = function(apartment){
        let data = {
            "Id":apartment.Id,
            "Maid": {
                "Id":"",
                "WorkDate":[],
                "WorkHour":""
            }
        };
        if (apartment.timeWork != null) 
            data.Maid.WorkHour = convertTimeToMinute(apartment.timeWork);
        
        data.Maid.Id = apartment.Maid.Id;

        for (var i = 0; i < apartment.workdays.length; i++) {
            if (apartment.workdays[i].status) {
                data.Maid.WorkDate.push(apartment.workdays[i].number);
            }
        };
        xhrService.post("SaveMaidApartment",data)
        .then(function (data) {
            console.log(data);
        },
        function (error) {
            console.log(error.statusText);
        });
    }

    $scope.checkWorkday = function(days){
        for (var i = 0; i < days.length; i++) {
            if (days[i].status) {
                return false;
            }

        }
        return true;
    }

    $scope.getTextDay = function(days){
        let content = "";
        if($scope.checkWorkday(days)){
            content = "Chọn ngày"
        }else{
            for (var i = 0; i < days.length; i++) {
                if (days[i].status) {
                    content += days[i].shortValue;
                    content += ",";
                    $scope.WorkDate.push(days[i].data);
                }
            }
            if (content != "") {
                content = content.slice(0, content.length-1);
            }
        }
        
        return content;
    }

    $scope.getTextTime = function(times){
        let content = "";
        if(times == null){
            content = "Chọn giờ"
        }else{
            content = times.getHours() + "h" + times.getMinutes()+"'";
        }
        return content;
    }

    function initDropdown(){
    	$(document).ready(function(){
		   $('.dropdown.select-day-dropdown button').on('click', function (event) {
		  	  $(this).parent().toggleClass('open');
			});
            $('.btn-ok').on('click', function (event) {
              $(this).parent().parent().parent().toggleClass('open');
            });
			$('body').on('click', function (e) {
			    if (!$('.dropdown.select-day-dropdown').is(e.target) 
			        && $('.dropdown.select-day-dropdown').has(e.target).length === 0 
			        && $('.open').has(e.target).length === 0
			    ) {
			        $('.dropdown.select-day-dropdown').removeClass('open');
			    }
			});
	    	
		});
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

    function replaceString(str) {
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

    $scope.convertString = function(str){
        
        return str;
    }

    $scope.convertDate = function(timeString){
        var date = new Date(timeString*1000);
        var timeConvert = date.getDate() + "/" + Math.ceil(date.getMonth()+1) + "/" +date.getFullYear();
        return timeConvert;
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

    function convertDateToUnixTimeStamp(datestring){
        if (datestring) {
            datestring = datestring.split("/").reverse().join("/");
            var date = new Date(datestring);
            return date.getTime()/1000;
        }else{
            return '';
        }
    }

    function resetScrollLeft(){
        $(document).ready(function(){
            $('.selectize-input').on('mousedown',function(e){
                currentScroll = $("#tableMaid").scrollLeft();
                setTimeout(function(){ $("#tableMaid").scrollLeft(currentScroll); }, 100);
            });
        });
    }

    // $scope.changFilter = function(){
    //     if($scope.currentEmployee)
    //         $scope.changFilter($scope.pageChanged());
    // }

    $scope.openNote = function(apartment,index){
        // $scope.apartmentList[$scope.currentApartment.index].textNote = "Không có";
        $scope.currentApartment = apartment;
        $scope.currentApartment.index = index;
    }

    $scope.addNote = function(){
        let datestring = "";
        let date = new Date();
        datestring = date.getDate()+"/"+Math.ceil(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        $scope.currentApartment.notes.push({date:datestring,note:''});
    }

    $scope.saveNote = function(){
        $scope.apartmentList[$scope.currentApartment.index].notes = $scope.currentApartment.notes;
        var length = $scope.apartmentList[$scope.currentApartment.index].notes.length;
        if(length > 0){
            length -= 1;
            $scope.apartmentList[$scope.currentApartment.index].textNote = $scope.apartmentList[$scope.currentApartment.index].notes[length].note;
        }
        
        $('#employeeModal').modal('hide');
    }

    $scope.loadMaidApartment = function(){
        $scope.WorkDate = [];
        var empData ={
            Id: -1,
            Code: "0",
            FullName: "Tất cả"
        };
        $scope.currentEmployee = {selected:[]};
        
        if ($stateParams.empID === undefined || $stateParams.empID == -1) {
            $scope.currentEmployee.selected = {
                Id: -1,
                Code: "0",
                FullName: "Tất cả"
            };
        };
        $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;
        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);

        $scope.filterData = {
            "Page":$scope.bigCurrentPage,
            "Limit":20,
            "Id":$stateParams.empID,
            "FromDate":$scope.fromDate,
            "ToDate":$scope.toDate
        }
         xhrService.post("GetListMaidApartment",$scope.filterData)
        .then(function (data) {
            $scope.apartmentList = data.data.data;
            $scope.totalMaid = data.data.total;
            addDayToApartmentList();
            initDropdown();
            resetScrollLeft();
        },
        function (error) {
            console.log(error.statusText);
        });
    	

         xhrService.get("GetAllMaid",$scope.filterData)
        .then(function (data) {
            $scope.employeeList = [];
            $scope.employeeList2 = [];
            $scope.employeeList.push({
                Id: -1,
                Code: "0",
                FullName: "Tất cả"
            });
            var dataEmp = data.data;
            dataEmp.forEach(function(item, index){
                let emp = item;
                emp.FullName = emp.FirstName + " " +emp.LastName;
                $scope.employeeList2.push(emp);          
                $scope.employeeList.push(emp);
                if ($stateParams.empID == item.Id) {
                    $scope.currentEmployee.selected = item;
                };
            });
        },
        function (error) {
            console.log(error.statusText);
        });

        
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(1900,00,01),
            startingDay: 1
        };
        $scope.format = 'dd/MM/yyyy';
          
        
        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);
      
    }

    function addDayToApartmentList(){
        // for (var i = 0; i < 20; i++) {
        //     let data = {
        //         value: i,
        //         // textDay:
        //         workdays: days,
        //         notes:[],
        //         textNote : "Không có"
        //     }
        // };
        $scope.apartmentList.forEach(function(item, index){
            let days = [
                {value: "Thứ 2",shortValue:"2",number:1,status:false},
                {value: "Thứ 3",shortValue:"3",number:2,status:false},
                {value: "Thứ 4",shortValue:"4",number:3,status:false},
                {value: "Thứ 5",shortValue:"5",number:4,status:false},
                {value: "Thứ 6",shortValue:"6",number:5,status:false},
                {value: "Thứ 7",shortValue:"7",number:6,status:false},
                {value: "Chủ nhật",shortValue:"CN",number:0,status:false}
            ];
            if (item.Maid.WorkDate != null) {
                for (var i = 0; i < days.length; i++) {
                    for (var j = 0; j < item.Maid.WorkDate.length; j++) {
                        if (Number(item.Maid.WorkDate[j]) == days[i].number) {
                            days[i].status = true
                        }
                    }
                    
                }
            }
            console.log(days);
            item.value = index;
            item.workdays = days;
            item.notes = [];
            if (item.Maid.WorkHour != null) {
                console.log(convertMinuteToTime(item.Maid.WorkHour));
                item.timeWork = convertMinuteToTime(item.Maid.WorkHour);
            }
            
            // textNote = "Không có";
        });
    }


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

    $scope.pageChanged = function () {
        console.log($scope.currentEmployee);
        $location.path("/maid/apartment")
        .search({ page: $scope.bigCurrentPage, 
                fromDate: getFirstDay($scope.fromDatePicker),
                toDate: getEndDay($scope.toDatePicker),
                empID: $scope.currentEmployee.selected.Id });
    };

	
}

app.controller('MaidApartmentCtrl', MaidApartmentCtrl);