function MaidApartmentCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	 const firstDay = getFirstDay(new Date());
    const today = getEndDay(new Date());
    var currentScroll = 0;

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
                }
            }
            if (content != "") {
                content = content.slice(0, content.length-1);
            }
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
        console.log($scope.replaceString('mèo'));
        
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
            console.log(date);
            return date.getTime()/1000;
        }else{
            return '';
        }
    }

    $scope.changFilter = function(){
        if($scope.currentEmployee)
            $scope.changFilter($scope.pageChanged());
    }

    $scope.openNote = function(apartment,index){
        // $scope.dataTest[$scope.currentApartment.index].textNote = "Không có";
        $scope.currentApartment = apartment;
        $scope.currentApartment.index = index;
    }

    $scope.addNote = function(){
        $scope.currentApartment.notes.push({date:null,note:''});
    }

    $scope.saveNote = function(){
        $scope.dataTest[$scope.currentApartment.index].notes = $scope.currentApartment.notes;
        var length = $scope.dataTest[$scope.currentApartment.index].notes.length;
        if(length > 0){
            length -= 1;
            $scope.dataTest[$scope.currentApartment.index].textNote = $scope.dataTest[$scope.currentApartment.index].notes[length].note;
        }
        
        $('#employeeModal').modal('hide');
    }

    $scope.loadMaidApartment = function(){
        
    	initDropdown();
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;
        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);
    	$scope.dataTest = [];

    	for (var i = 0; i < 20; i++) {
            let days = [
                {value: "Thứ 2",shortValue:"2",status:false},
                {value: "Thứ 3",shortValue:"3",status:false},
                {value: "Thứ 4",shortValue:"4",status:false},
                {value: "Thứ 5",shortValue:"5",status:false},
                {value: "Thứ 6",shortValue:"6",status:false},
                {value: "Thứ 7",shortValue:"7",status:false},
                {value: "Chủ nhật",shortValue:"CN",status:false}
            ];
            let data = {
                value: i,
                // textDay:
                workdays: days,
                notes:[],
                textNote : "Không có"
            }
    		$scope.dataTest.push(data);
    	};

        $(document).ready(function(){
            $('.selectize-input').on('mousedown',function(e){
                currentScroll = $("#tableMaid").scrollLeft();
                setTimeout(function(){ $("#tableMaid").scrollLeft(currentScroll); }, 100);
                
            });
            // $("#tableMaid").click(function(){
            //     $("#tableMaid").scrollLeft(currentScroll);
            // })
        });
       
        

         xhrService.get("GetAllMaid",$scope.filterData)
        .then(function (data) {
            $scope.employeeList = [];
            $scope.employeeList2 = [];
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
                $scope.employeeList2.push(emp);          
                $scope.employeeList.push(emp);
            });
            console.log($scope.employeeList);
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

    $scope.pageChanged = function(){};

	
}

app.controller('MaidApartmentCtrl', MaidApartmentCtrl);