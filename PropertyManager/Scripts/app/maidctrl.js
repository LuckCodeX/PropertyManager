function MaidCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    const firstDay = (new Date(2010,00,01)).getTime()/1000;
    const today = getEndDay(new Date());

    $scope.convertDate = function(timeString){
        var date = new Date(timeString*1000);
        var timeConvert = date.getDate() + "/" + Math.ceil(date.getMonth()+1) + "/" +date.getFullYear();
        return timeConvert;
    }

    function getEndDay(datestring){
        if (datestring) {
            var date = new Date(datestring);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            return date.getTime()/1000;
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

    $scope.loadMaidList = function(){
        $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.fromDate = $stateParams.fromDate === undefined ? firstDay : $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate === undefined ? today : $stateParams.toDate;
        $scope.currentEmployee = $stateParams.empID === undefined ? '' : $stateParams.empID;
        
         xhrService.get("GetAllMaid",$scope.filterData)
            .then(function (data) {
                $scope.employeeList = [];
                var dataEmp = data.data;
                dataEmp.forEach(function(item, index){
                    let emp = {
                        Id: item.Id,
                        FirstName: item.FirstName,
                        LastName: item.LastName,
                        Code: item.Code,
                        value: item.Id
                    };
                    $scope.employeeList.push(emp);
                });
                console.log($scope.employeeList);
            },
            function (error) {
                console.log(error.statusText);
            });

        $scope.currentMaid = null;
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(2010,00,01),
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
                $scope.totalMaid = data.data.total;
                $scope.maidList = data.data.data;
            },
            function (error) {
                console.log(error.statusText);
            });
    }
    $scope.myConfig = {
          maxItems: 1,
          labelField: 'FirstName',
          searchField: ['FirstName','LastName'],
          render: {
            option: function(item, escape) {
                var firstName = item.FirstName || item.LastName;
                var lastName = item.FirstName ? item.LastName : null;
                var code = item.FirstName ? item.Code : null;
                return '<div>' +
                    '<span class="">['+escape(code)+'] '+ escape(firstName) + " " + escape(lastName) + '</span>' +
                '</div>';
            
            },
            item: function(item, escape){
                var firstName = item.FirstName || item.LastName;
                var lastName = item.FirstName ? item.LastName : null;
                var code = item.FirstName ? item.Code : null;
                return '<div>' +
                    '<span class="">['+escape(code)+'] '+ escape(firstName) + " " + escape(lastName) + '</span>' +
                '</div>';
              }
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
    $scope.pageChanged = function () {
        $location.path("/maid/list")
        .search({ page: $scope.bigCurrentPage, 
                fromDate: $scope.fromDatePicker.getTime()/1000,
                toDate: getEndDay($scope.toDatePicker),
                empID: $scope.currentEmployee });
    };

    $scope.deleteEmployee = function(id){
        console.log(id);
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
    }
	
}
app.controller('MaidCtrl', MaidCtrl);