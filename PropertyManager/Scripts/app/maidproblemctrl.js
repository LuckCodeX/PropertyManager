function MaidProblemCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    const firstDay = getFirstDay(new Date());
    const today = getEndDay(new Date());

    $scope.listIssue = [{value:null,name:"Nội bộ phòng maid"},{value:0,name:"Đồ nội thất"},
                        {value:1,name:"Thiết bị thu phát"},{value:2,name:"Đồ điện tử"}
                        ,{value:3,name:"Ánh sáng"},{value:4,name:"Điều hòa nhiệt độ"}
                        ,{value:5,name:"Khu vực bếp"},{value:6,name:"Khu vực phòng tắm"}]

    $(document).ready(function(){
        $('#employeeModal').on('hidden.bs.modal', function () {
            for (var i = 0; i < $scope.currentApartment.notes.length; i++) {
                if ($scope.currentApartment.notes[i].Note == "") {
                    $scope.currentApartment.notes.splice(i, 1);
                    i--;
                }
            }
        });
    });

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

    $scope.datePickerOptions = {
        showMeridian: false
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
            datestring.setSeconds(0);
            datestring.setMilliseconds(0);
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

    // $scope.openNote = function(item,index){
    //     $scope.currentProblem = JSON.parse(JSON.stringify(item));
    //     // $scope.dataTest[$scope.currentApartment.index].textNote = "Không có";
    //     $scope.currentProblem = item;
    //     $scope.currentProblem.index = index;
    // }

    // $scope.addNote = function(){
    //     let datestring = "";
    //     let date = new Date();
    //     datestring = date.getDate()+"/"+Math.ceil(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    //     $scope.currentProblem.notes.push({date:datestring,note:''});
    // }

    // $scope.saveNote = function(){
    //     $scope.problemList[$scope.currentProblem.index].notes = $scope.currentProblem.notes;
    //     var length = $scope.problemList[$scope.currentProblem.index].notes.length;
    //     if(length > 0){
    //         length -= 1;
    //         $scope.problemList[$scope.currentProblem.index].textNote = $scope.problemList[$scope.currentProblem.index].notes[length].note;
    //     }
        
    //     $('#employeeModal').modal('hide');
    // }

    function getAllApartment(){
        xhrService.get("GetListAllTypeApartment")
        .then(function (data) {
            $scope.apartmentList = data.data;
            $scope.apartmentList.forEach(function(item, index){
                item.value = item.Id;
            });
        },
        function (error) {
            console.log(error.statusText);
        });
    }

    $scope.openNote = function(apartment,index){
        $scope.currentApartment = JSON.parse(JSON.stringify(apartment));
        $scope.currentApartment.index = index;
        $scope.currentApartment.deletelist = [];
    }

    $scope.deleteNote = function(id,index){
         if (id == null) {
            $scope.currentApartment.notes.splice(index, 1);
        }else{
            $scope.currentApartment.deletelist.push(id);
            $scope.currentApartment.notes.splice(index, 1);
        }
    }

    $scope.addNote = function(){
        let date = new Date();
        date = date.getTime()/1000;
        $scope.currentApartment.notes.push({CreatedDate:date,Note:''});
    }

    $scope.saveNote = function(){

        delelteNoteList($scope.currentApartment.deletelist);
        addNoteList($scope.currentApartment.notes,$scope.currentApartment.Apartment.Resident.Id);
        $('#employeeModal').modal('hide');
       
        $timeout(function () {
             $scope.loadMaidProblem();
        }, 500);
    }

    $scope.openNoteFix = function(item,index){  
        $scope.currentProblem = JSON.parse(JSON.stringify(item));
        $scope.currentProblem.index = index;
        $scope.currentProblem.deletelist = [];
        $scope.currentProblem.fix.forEach(function(item,index){
            $scope.currentProblem.fix[index].CreatedDate = new Date(item.CreatedDate*1000);
        });
    }

    $scope.changeValue = function(item){
        if(item.IssueId == '') item.IssueId = null;
        xhrService.post("SaveProblem",item)
        .then(function (data) {
            // getProjectList();
        },
        function (error) {
            console.log(error);
        });
    }

    $scope.addNoteFix = function(){
        // let datestring = "";
        // let date = new Date();
        // datestring = date.getDate()+"/"+Math.ceil(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        $scope.currentProblem.fix.push({CreatedDate : new Date(),Content:'',Price:0});
    }

    $scope.deleteFix = function(id,index){
         if (id == null) {
            $scope.currentProblem.fix.splice(index, 1);
        }else{
            $scope.currentProblem.deletelist.push(id);
            $scope.currentProblem.fix.splice(index, 1);
        }
    }

    $scope.openImages = function(item,index){
        $scope.currentProblem = item;
        $scope.currentProblem.index = index;
    }

    $scope.saveImages = function(){
        $scope.problemList[$scope.currentProblem.index].images = $scope.currentProblem.images;
        $scope.changeValue($scope.problemList[$scope.currentProblem.index]);
        $('#imageModal').modal('hide');
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

    $scope.apartmentConfig = {
          maxItems: 1,
          labelField: 'Code',
        onType: function(value) {
            setTimeout(function(){$scope.searchApartment(value); }, 300);
        },
        searchField: ['Code']
    };

    $scope.saveProblem = function(){
        $scope.newProblem.Type=0;
        if($scope.newProblem.IssueId == '') $scope.newProblem.IssueId = null;
        xhrService.post("SaveProblem",$scope.newProblem)
        .then(function (data) {
            $scope.loadMaidProblem();
            $('#newProblemModal').modal('hide');
            toastr.success('Thành công!');
            $scope.newProblem = {};
        },
        function (error) {
            console.log(error);
        });
    }

    $scope.saveNoteFix = function(){

        delelteFixList($scope.currentProblem.deletelist);
        addFixList($scope.currentProblem.fix,$scope.currentProblem.Id);
        $('#fixModal').modal('hide');
       
        $timeout(function () {
             $scope.loadMaidProblem();
        }, 500);

    }

    $scope.loadMaidProblem = function(){
        $scope.problemList = [];
        $scope.newProblem = {};
        $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;
        $scope.currentNoApartment = $stateParams.apartment === undefined ? null : $stateParams.apartment;
        $scope.currentAddress = $stateParams.address === undefined ? null : $stateParams.address;
        $scope.currentBuilding = $stateParams.building === undefined ? null : $stateParams.building;
        $scope.currentProject = $stateParams.projectId === undefined ? -1 : $stateParams.projectId;
        $scope.currentTypeProblem = $stateParams.type === undefined ? -1 : $stateParams.type;
        $scope.fromDatePicker = new Date(Number($scope.fromDate)*1000);
        $scope.toDatePicker = new Date(Number($scope.toDate)*1000);

        $scope.dataFilter = {
            "Page":$scope.bigCurrentPage,
            "Limit":20,
            "FromDate":$scope.fromDate,
            "ToDate":$scope.toDate,
            "Address":$scope.currentAddress,
            "NoApartment":$scope.currentNoApartment,
            "Building":$scope.currentBuilding,
            "ProjectId":$scope.currentProject,
            "Type":$scope.currentTypeProblem
        }

         xhrService.post("GetListMaidProblem",$scope.dataFilter)
        .then(function (data) {
            $scope.totalMaid = data.data.total;
            var dataProblem = data.data.data;
            dataProblem.forEach(function(item, index){
                let problem = item;
                problem.notes = [];
                if (item.Apartment.Resident.NoteList != null) {
                    problem.notes = item.Apartment.Resident.NoteList;
                }
                problem.fix = [];
                if (item.TrackingList != null) {
                    problem.fix = item.TrackingList;
                }
                problem.images = [];  
                if (item.ListImage != null) {
                    problem.images = item.ListImage;
                }   
                $scope.problemList.push(problem);
            });

        },
        function (error) {
            console.log(error);
        });
        getListEmployee();
        getProjectList();
        getAllApartment();
    }

    $scope.deleteMaidProblem = function(id){
        swal({
            title: "Bạn có chắc chắn muốn xóa ?",
            text: "Sự cố đã xóa không thể khôi phục!",
            icon: "warning",
            buttons: [
                'Không',
                'Có'
            ],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                // xhrService.delete("DeleteMaid/"+id)
                // .then(function (data) {
                //     $scope.loadMaidList();
                //     swal("Xóa nhân viên thành công!",
                //         {
                //             icon: "success",
                //         });

                // },
                // function (error) {
                //     swal("Xóa nhân viên thất bại!",
                //         {
                //             icon: "error",
                //         });
                // });

            }
        });
    }

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

    function addNoteList(listAdd,id){
        var status = true;
        listAdd.forEach(function(item, index){
            if (item.Note != "") {
                let dataNote = {
                    "UserProfileId":id,
                    "Note":item.Note
                };
               
                function checkRequest(){
                    return xhrService.post("CreateUserProfileNote",dataNote)
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
            }
            
            
        });
    }

    function delelteNoteList(listDelete){
        listDelete.forEach(function(item, index){
            function checkRequest(){
                return xhrService.delete("DeleteUserProfileNote/"+item)
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

    function addFixList(listAdd,id){
        var status = true;
        listAdd.forEach(function(item, index){
            if (item.Note != "") {
                let dataNote = {
                    "ProblemId":id,
                    "Content":item.Content,
                    "Price":item.Price,
                    "EmployeeId":item.EmployeeId,
                    "CreatedDate":convertDateToUnixTimeStamp(item.CreatedDate)
                };
               
                function checkRequest(){
                    return xhrService.post("CreateProblemTracking",dataNote)
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
            }
            
            
        });
    }

    function delelteFixList(listDelete){
        listDelete.forEach(function(item, index){
            function checkRequest(){
                return xhrService.delete("DeleteProblemTracking/"+item)
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
    }

    $scope.pageChanged = function () {
        $location.path("/maid/problem")
        .search({ page: $scope.bigCurrentPage, 
                fromDate: getFirstDay($scope.fromDatePicker),
                toDate: getEndDay($scope.toDatePicker),
                type: $scope.currentTypeProblem,
                address:$scope.currentAddress,
                apartment:$scope.currentNoApartment,
                building:$scope.currentBuilding,
                projectId:$scope.currentProject });
    };
}
app.controller('MaidProblemCtrl', MaidProblemCtrl);