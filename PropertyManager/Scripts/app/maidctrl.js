function MaidCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    const firstDay = getFirstDay(new Date());
    const today = getEndDay(new Date());

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
    }

    $scope.replaceString = function (str) {
        if (!str)
            return null;
        str = str.toLowerCase();
        str = str.replace(/\ /g, "-");
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
        str = str.replace(/\ /g, "-");
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

    $scope.openPopup = function(maid){
        $scope.currentMaid = JSON.parse(JSON.stringify(maid));
        $scope.currentMaid.Birthday = new Date($scope.currentMaid.Birthday*1000);
        return;
    }

    $scope.changFilter = function(){
        if($scope.currentEmployee)
            $scope.changFilter($scope.pageChanged());
    }

    $scope.loadMaidList = function(){
        $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;
        $scope.currentEmployee = $stateParams.empID === undefined ? -1 : $stateParams.empID;
        
        $("input#username").on({
          keydown: function(e) {
            if (e.which === 32)
              return false;
          },
          change: function() {
            this.value = this.value.replace(/\s/g, "");
          }
        });
        
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

        $scope.currentMaid = null;
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(1900,00,01),
            startingDay: 1
        };
        $scope.format = 'dd/MM/yyyy';
          
        $scope.filterData = {
            "Page":$scope.bigCurrentPage,
            "Limit":"20",
            "Id":$scope.currentEmployee,
            "FromDate":$scope.fromDate,
            "ToDate":$scope.toDate
        }
        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);
        xhrService.post("GetListMaid",$scope.filterData)
            .then(function (data) {
                console.log(data);
                $scope.totalMaid = data.data.total;
                $scope.maidList = data.data.data;
                $scope.maidList.forEach(function(item, index){
                    item.notes = [];
                    if (item.NoteList != null) {
                        item.notes = item.NoteList;
                    }
                });

            },
            function (error) {
                console.log(error.statusText);
            });
    }
    $scope.myConfig = {
          maxItems: 1,
          labelField: 'FirstName',
           score: function(search) {
            search = search.toLowerCase();
            search = search.replace(/\ /g, "-");
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

    $scope.submitEmployee = function(employee){
        var emp = JSON.parse(JSON.stringify(employee));
        emp.Birthday = convertDateToUnixTimeStamp(emp.Birthday);
        xhrService.post("SaveMaid",emp).then(function (data) {
            swal("Thành công!", "", "success")
            .then((value) => {
                $('#employeeModal').modal('hide');
                $scope.loadMaidList();
            });
        },
        function (error) {
            console.log(error.statusText);
        });
        
    }

    function addNoteList(listAdd,id){
            listAdd.forEach(function(item, index){
            let dataNote = {
                "EmployeeId":id,
                "Note":item.Note
            };
           
            function checkRequest(){
                return xhrService.post("CreateEmployeeNote",dataNote)
                    .then(function (data) {
                        return true;
                    },
                    function (error) {
                        return false;
                    });
            };
            if (item.Id == null) {
                checkRequest();
            }
            
        });
    }

    function delelteNoteList(listDelete){
        console.log(listDelete);
        listDelete.forEach(function(item, index){
            function checkRequest(){
                return xhrService.delete("DeleteEmployeeNote/"+item)
                    .then(function (data) {
                        return true;
                    },
                    function (error) {
                        return false;
                    });
            }
            checkRequest();
           
        });
    }

    $scope.deleteNote = function(id,index){
         if (id == null) {
            $scope.currentNote.notes.splice(index, 1);
        }else{
            $scope.currentNote.deletelist.push(id);
            $scope.currentNote.notes.splice(index, 1);
        }
    }

    $scope.openNote = function(item,index){
        $scope.currentNote = item;
        $scope.currentNote.index = index;
        $scope.currentNote.deletelist = [];
    }

    $scope.addNote = function(){
        let date = new Date();
        date = date.getTime()/1000;
        $scope.currentNote.notes.push({CreatedDate:date,Note:''});
    }

    $scope.saveNote = function(){

        delelteNoteList($scope.currentNote.deletelist);
        addNoteList($scope.currentNote.notes,$scope.currentNote.Id);
        $('#maidModal').modal('hide');
       
        $timeout(function () {
             $scope.loadMaidList();
        }, 500);
        
    }

    $scope.pageChanged = function () {
        $location.path("/maid/list")
        .search({ page: $scope.bigCurrentPage, 
                fromDate: getFirstDay($scope.fromDatePicker),
                toDate: getEndDay($scope.toDatePicker),
                empID: $scope.currentEmployee });
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
                xhrService.delete("DeleteMaid/"+id)
                .then(function (data) {
                    $scope.loadMaidList();
                    swal("Xóa nhân viên thành công!",
                        {
                            icon: "success",
                        });

                },
                function (error) {
                    swal("Xóa nhân viên thất bại!",
                        {
                            icon: "error",
                        });
                });

            }
        });
    };


var todayDate = new Date().getMonth();
	$scope.dateOptions1 = {
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(new Date().setMonth(todayDate - 2)),
            startingDay: 1,
             minMode:"month",
        };
    
}
app.controller('MaidCtrl', MaidCtrl);