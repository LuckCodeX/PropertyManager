function MaidBusinessCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll, $filter) {
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
            return date.getTime()/1000;
        }else{
            return '';
        }
    }

    $scope.changFilter = function(){
        if($scope.currentEmployee)
            $scope.changFilter($scope.pageChanged());
    }

    $scope.getDayPerWeekDay = function(listDay){
        let result = ""
        for (var i = 0; i < listDay.length; i++) {
            if (listDay[i] == 0) {
                result += "CN ,"
            }else{
                result += (Number(listDay[i])+1)
                result += ","
            }   
        }
        if (result != "") {
            result = result.slice(0, result.length-1);
        }
        return result;
    };


   
    $scope.loadMaidBusiness = function(){
        
       $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;
        $scope.currentNoApartment = $stateParams.apartment === undefined ? null : $stateParams.apartment;
        $scope.currentAddress = $stateParams.address === undefined ? null : $stateParams.address;
        $scope.currentBuilding = $stateParams.building === undefined ? null : $stateParams.building;
        $scope.currentProject = $stateParams.projectId === undefined ? -1 : $stateParams.projectId;
        $scope.currentEmployee = $stateParams.empID === undefined ? -1 : $stateParams.empID;
        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);
        
        $("input#username").on({
          keydown: function(e) {
            if (e.which === 32)
              return false;
          },
          change: function() {
            this.value = this.value.replace(/\s/g, "");
          }
        });

         $scope.filterData = {
            "Page":$scope.bigCurrentPage,
            "Limit":10,        
            "Id":$scope.currentEmployee,
            "FromDate":$scope.fromDate,
            "ToDate":$scope.toDate,
            "Address":$scope.currentAddress,
            "NoApartment":$scope.currentNoApartment,
            "Building":$scope.currentBuilding,
            "ProjectId":$scope.currentProject
        };
        
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
                        LowerFirstName: $scope.replaceString(item.FirstName) + $scope.replaceString(item.LastName),
                        LowerLastName: $scope.replaceString(item.FirstName.toLowerCase()) +  $scope.replaceString(item.LastName.toLowerCase()),
                        Code: item.Code,
                        value: item.Id
                    };
                    $scope.employeeList.push(emp);
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
      

        xhrService.post("GetListMaidIssue",$scope.filterData)
        .then(function (data) {
            $scope.issuemaidList=data.data.data;
           getProjectList();

        },
        function (error) {
            console.log(error.statusText);
        });


        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);
        

            xhrService.get("GetAllIssue")
        .then(function(data) {
                $scope.issueList = data.data;
            },
            function(error) {
                console.log(error.statusText);
            });
    }

function getProjectList(){
        xhrService.get("GetAllProject")
        .then(function (data) {
            $scope.projectList = [];
            $scope.projectList.push({
                Id: -1,
                Name: "Tất cả",
                ValueName: "",             
                value: -1
            });
            var dataEmp = data.data;
            dataEmp.forEach(function(item, index){
                let emp = {
                    Id: item.Id,
                    Name: item.Name,
                    ValueName: $scope.replaceString(item.Name),             
                    value: item.Id
                };
                $scope.projectList.push(emp);
            });

        },
        function (error) {
            console.log(error.statusText);
        });
    };

    $scope.projectConfig = {
          maxItems: 1,
          labelField: 'Name',
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
          searchField: ['ValueName']
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

    
$scope.pageChanged = function () {
        $location.path("/maid/business")
        .search({ page: $scope.bigCurrentPage, 
                fromDate: getFirstDay($scope.fromDatePicker),
                toDate: getEndDay($scope.toDatePicker),
                empID: $scope.currentEmployee,
                address:$scope.currentAddress,
                apartment:$scope.currentNoApartment,
                building:$scope.currentBuilding,
                projectId:$scope.currentProject });
    };





$scope.datePickerOptions = {
        showMeridian: false
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
    };

     $scope.deleteEmployee = function(id){
        swal({
            title: "Bạn có chắc chắn muốn xóa ?",
            text: "Nhân viên đã xóa không thể khôi phục!",
            icon: "warning",
            buttons: [
                'Không',
                'Có'
            ],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                

            }
        });
    };
	
}

app.controller('MaidBusinessCtrl', MaidBusinessCtrl);

app.filter('secondsToDateTime', [function() {
    function padTime(t) {
        return t < 10 ? "0"+t : t;
    }

    return function(_seconds) {
        if (typeof _seconds !== "number" || _seconds < 0)
            return "00:00";

        var hours = Math.floor(_seconds / 3600),
            minutes = Math.floor((_seconds % 3600) / 60),
            seconds = Math.floor(_seconds % 60);

        return padTime(hours) + ":" + padTime(minutes);
    };
}])