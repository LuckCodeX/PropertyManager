function ContractCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	$scope.contractList = [];
	// const firstDay = (new Date()).getTime()/1000;
 //    const today = getEndDay(new Date());
	 $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2050, 5, 22),
        minDate: new Date(1900,00,01),
        startingDay: 1
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
    }

    function convertDateToUnixTimeStamp(datestring){
        if (datestring) {
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
	$scope.loadContract = function(){
		for (var i = 0; i < 10; i++) {
			$scope.contractList.push({
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

    $scope.pageChanged = function(){
        $scope.loadContract();
    }

	$scope.addPassport = function(){
		$scope.passportList.push({ownerName:"",passport:""});
	}

    $scope.searchParentContract = function(textSearch){
        $scope.parentContractList = [];
            $scope.parentContractList.push({
                Code:"Đây là hợp đồng gốc",
                value:-1
            });
        xhrService.get("SearchAllParentContract/"+textSearch)
        .then(function (data) {
            let parentContractList = data.data;
            parentContractList.forEach(function(item, index){
                item.value = item.Id;
                $scope.parentContractList.push(item);
            });
        });
    }

	$scope.searchCompany = function(textSearch){
		// $scope.currentCompany = $scope.currentCompany === undefined ? "" : $scope.currentCompany;
		xhrService.get("SearchAllCompany/"+ textSearch)
        .then(function (data) {
            $scope.companyList = data.data;
            $scope.companyList.forEach(function(item, index){
            	item.value = item.Id;
            	item.textSearch = $scope.replaceString(item.Name);
            });
        },
        function (error) {
            console.log(error.statusText);
        });
	}

	$scope.searchEmployee = function(){
		xhrService.get("GetAllSaleAccount")
        .then(function (data) {
            $scope.employeeList = data.data;
            $scope.employeeList.forEach(function(item, index){
            	item.value = item.Id;
            	item.textSearch = $scope.replaceString(item.FullName);
            });
        },
        function (error) {
            console.log(error.statusText);
        });
	}

	$scope.searchApartment = function(textSearch){
		xhrService.get("GetListAllTypeApartment/"+textSearch)
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

	$scope.searchAccount = function(textSearch){
		xhrService.get("GetListUserProfile/"+textSearch)
        .then(function (data) {
            $scope.accountList = data.data;
            $scope.accountList.forEach(function(item, index){
            	item.value = item.Id;
            	item.textSearch = $scope.replaceString(item.FullName);
            });
        },
        function (error) {
            console.log(error.statusText);
        });
	}

	$scope.getAllProject = function(){
		xhrService.get("GetAllProject")
        .then(function (data) {
            $scope.projectList = data.data;
        },
        function (error) {
            console.log(error.statusText);
        });
	}

	$scope.getDetailApartment = function(){
        $scope.apartmentList.forEach(function(item, index){
        	if (item.Id == $scope.currentApartment) {
        		$scope.contract.Apartment.Area = item.Area;
        		$scope.contract.OwnerUserProfile.FullName = item.UserProfileOwner.FullName;
        		$scope.contract.OwnerUserProfile.Phone = item.UserProfileOwner.Phone;
        		$scope.contract.OwnerUserProfile.TaxCode = item.UserProfileOwner.TaxCode;
        		$scope.contract.OwnerUserProfile.Address = item.UserProfileOwner.OwnerAddress;
        		$scope.contract.OwnerUserProfile.BankAccount = item.UserProfileOwner.OwnerBankAccount;
        		$scope.contract.OwnerUserProfile.BankName = item.UserProfileOwner.OwnerBankName;
        		$scope.contract.OwnerUserProfile.BankNumber = item.UserProfileOwner.OwnerBankNumber;
        		$scope.contract.OwnerUserProfile.BankBranch = item.UserProfileOwner.OwnerBankBranch;
                $scope.contract.OwnerUserProfile.Identification = item.UserProfileOwner.Identification;
        		$scope.contract.Apartment.Building = item.Building;
                $scope.contract.Apartment.Id = item.Id;
        		$scope.contract.Apartment.NoApartment = item.NoApartment;
        		$scope.contract.Apartment.ApartmentId = item.Id;
        		$scope.contract.Apartment.PassWifi = item.PassWifi;
        		$scope.contract.Apartment.PassDoor = item.PassDoor;
        		$scope.contract.Apartment.NoBedroom = item.NoBedroom;
        		$scope.contract.Apartment.Address = item.Address;
        		$scope.contract.OwnerUserProfile.Id = item.UserProfileOwner.Id;
        		$scope.apartment.ProjectId = item.ProjectId;
        	}
        });
	}

	$scope.getDetailEmployee = function(){
		$scope.employeeList.forEach(function(item, index){
        	if (item.Id == $scope.contract.AdminId) {
        		$scope.employee.FullName = item.FullName;
        		$scope.employee.Phone = item.Phone;
        		$scope.employee.Email = item.Email;
        		$scope.employee.BankAccount = item.BankAccount;
        		$scope.employee.BankNumber = item.BankNumber;
        		$scope.employee.BankName = item.BankName;
        		$scope.employee.BankBranch = item.BankBranch;
        		// $scope.contract.AdminId = item.Id;
        	}
        });
	}

	$scope.getDetailCompany = function(){
		$scope.companyList.forEach(function(item, index){
        	if (item.Id == $scope.currentCompany) {
        		$scope.contract.Company.Name = item.Name;
        		$scope.contract.Company.Address = item.Address;
        		$scope.contract.Company.TaxCode = item.TaxCode;
        		$scope.contract.Company.BankName = item.BankName;
        		$scope.contract.Company.BankNumber = item.BankNumber;
        		$scope.contract.Company.BankAccount = item.BankAccount;
        		$scope.contract.Company.BankBranch = item.BankBranch;
        		$scope.contract.Company.Id = item.Id;
        	}
        });
	}

	$scope.getDetailAccount = function(){
		$scope.accountList.forEach(function(item, index){
        	if (item.Id == $scope.currentAccount) {
        		$scope.account.Email = item.Email;
        		$scope.contract.UserProfile.FullName = item.FullName;
        		$scope.contract.UserProfile.Phone = item.Phone;
                $scope.contract.UserProfile.Identification = item.Identification;
        		$scope.contract.UserProfile.Id = item.Id;
        	}
        });
	}

	$scope.loadContractDetail = function(){
		$scope.data = {};
		$scope.getAllProject();
		$scope.contractType = [{value:0,name:"Hợp đồng giữa công ty và chủ nhà"}];
		$scope.contract = {
            Apartment:{},
            UserProfile:{},
            OwnerUserProfile:{},
            Company:{},
        };
		$scope.employee = {};
		$scope.apartment = {};
		$scope.account = {};
		$scope.aptModel = {UserProfileOwner:{}};
		$scope.apt = {};
		$scope.cus = {};
		$scope.cusModel = {};
		$scope.company = {};
		$scope.companyModel = {};
		$scope.passportList = [{ownerName:"",passport:""}];
		$scope.contract.StartDate = new Date();
		$scope.contract.EndDate  = new Date();
		$(document).ready(function () {
            $('ul.tabs li').click(function () {
                var tab_id = $(this).attr('data-tab');
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
                $(this).addClass('current');
                $("#" + tab_id).addClass('current');
            });

            // $("#companyInput").on("keydown",".selectize-input input",function(){
            // 	console.log($("#companyInput .selectize-input input").val());
            // 	$scope.searchCompany($("#companyInput .selectize-input input").val());
            // })
        });
        $scope.searchParentContract("");
		$scope.searchCompany("");
		$scope.searchApartment("");
		$scope.searchAccount("");
		$scope.searchEmployee();

        // $scope.apartmentList = [{name:"Royal City1",value:1},
        // 						{name:"Royal City2",value:2},
        // 						{name:"Times City1",value:3},
        // 						{name:"Times City2",value:4},
        // 						{name:"Times City3",value:5}];
        // $scope.employeeList = [{name:"Hoàng Sang",value:1},
        // 						{name:"Bùi Hải",value:2},
        // 						{name:"Tuấn Nghĩa",value:3},
        // 						{name:"Trần Hoàn",value:4},
        // 						{name:"Quang Tuấn",value:5}];
        // $scope.customerList =  [{name:"Hoàng Sang",value:1},
        // 						{name:"Bùi Hải",value:2},
        // 						{name:"Tuấn Nghĩa",value:3},
        // 						{name:"Trần Hoàn",value:4},
        // 						{name:"Quang Tuấn",value:5}];
       	
            // {name: "Daryl", surname: "Rowland",},
            // {name: "Alan", surname: "Partridge"},
            // {name: "Annie", surname: "Rowland"}
        
		// $( "#autocomplete" ).autocomplete({
		// 	source: $scope.apartmentList
		// });
		// $( "#acEmployee" ).autocomplete({
		// 	source: $scope.employeeList
		// });
		// $( "#acCustomer" ).autocomplete({
		// 	source: $scope.customerList
		// });
		$scope.disable = false;
		
	}

	$scope.saveModalAccount = function(){
		xhrService.post("CreateUserProfile/",$scope.accountModel)
        .then(function (data) {
        	// $scope.contract.UserProfile.Id = data.data.Id;
         //    $scope.contract.UserProfile.FullName = data.data.FullName;
         //    $scope.contract.UserProfile.Phone = data.data.Phone;
         //    $scope.contract.UserProfile.Identification = data.data.Identification;
        	$scope.searchAccount("");
        	$scope.currentAccount =  data.data.Id;
            $scope.getDetailAccount();
            $('#accountModal').modal('hide');
        },
        function (error) {
            console.log(error.statusText);
        });
	}

	$scope.saveModalApartment = function(){
		xhrService.post("CreateApartment",$scope.aptModel)
        .then(function (data) {
        	$scope.contract.Address = $scope.aptModel.Address;
        	$scope.contract.Building = $scope.aptModel.Building;
        	$scope.contract.NoApartment = $scope.aptModel.NoApartment;
        	$scope.contract.Area = $scope.aptModel.Area;
        	$scope.contract.NoBedRoom = $scope.aptModel.NoBedRoom;
        	$scope.contract.ProjectId = $scope.aptModel.ProjectId;
        	$scope.contract.OwnerName = $scope.aptModel.UserProfileOwner.FullName;
        	$scope.contract.OwnerPhone = $scope.aptModel.UserProfileOwner.Phone;
            $('#apartmentModal').modal('hide');
        },
        function (error) {
            console.log(error.statusText);
        });
	}
	$scope.saveModalCompany = function(){

		xhrService.post("CreateCompany/",$scope.companyModel)
        .then(function (data) {
        	$scope.contract.Company.BankName = $scope.companyModel.TenantBankName;
			$scope.contract.Company.TaxCode = $scope.companyModel.TenantTaxCode;
			$scope.contract.Company.BankAccount = $scope.companyModel.BankAccount;
			$scope.contract.CompanyBankBranch = $scope.companyModel.BankBranch;
			$scope.contract.CompanyBankNumber = $scope.companyModel.BankNumber;
			$scope.contract.CompanyName = $scope.companyModel.Name;
			$scope.contract.CompanyAddress = $scope.companyModel.Address;
			$scope.searchCompany("");
			$scope.currentCompany = data.data.Id;
            $scope.getDetailCompany();
            $('#accountModal').modal('hide');
        },
        function (error) {
            console.log(error.statusText);
        });
		 $('#companyModal').modal('hide');
	}

	$scope.submitContract = function(){
        if ($scope.contract.ParentId == -1) {$scope.contract.ParentId == null};
		$scope.contract.StartDate = getFirstDay($scope.contract.StartDate);
		$scope.contract.EndDate = getEndDay($scope.contract.EndDate);
		xhrService.post("CreateContract/",$scope.contract)
        .then(function (data) {
        	window.location.href = "/contract";
        },
        function (error) {
            console.log(error.statusText);
        });
	}

	$scope.companyConfig = {
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
        onType: function(value) {
	        setTimeout(function(){$scope.searchCompany(value); }, 300);
	    },
        searchField: ['textSearch']
    };

    $scope.employeeConfig = {
          maxItems: 1,
          labelField: 'FullName',
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
        searchField: ['textSearch'],
        render: {
            option: function(item, escape) {
                var fullName = item.FullName || item.Email;
                var email = item.FullName ? item.Email : null;
                // if(code == 0){
                //     return '<div>' +
                //     '<span class="">'+ escape(firstName) + " " + escape(lastName) + '</span>' +
                // '</div>';
                // }
                return '<div>' +
                    '<span class="">'+escape(fullName)+' - ' + escape(email) + '</span>' +
                '</div>';
            
            },
            item: function(item, escape){
                var fullName = item.FullName || item.Email;
                var email = item.FullName ? item.Email : null;
                // if(code == 0){
                //     return '<div>' +
                //     '<span class="">'+ escape(firstName) + " " + escape(lastName) + '</span>' +
                // '</div>';
                // }
                return '<div>' +
                    '<span class="">'+escape(fullName)+' - ' + escape(email) + '</span>' +
                '</div>';
              },
                
        }
    };

    $scope.accountConfig = {
          maxItems: 1,
          labelField: 'FullName',
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
     //    onType: function(value) {
	    //     setTimeout(function(){$scope.searchAccount(value); }, 300);
	    // },
        searchField: ['textSearch'],
        render: {
            option: function(item, escape) {
                var fullName = item.FullName || item.Email;
                var email = item.FullName ? item.Email : null;
                // if(code == 0){
                //     return '<div>' +
                //     '<span class="">'+ escape(firstName) + " " + escape(lastName) + '</span>' +
                // '</div>';
                // }
                return '<div>' +
                    '<span class="">'+escape(fullName)+' - ' + escape(email) + '</span>' +
                '</div>';
            
            },
            item: function(item, escape){
                var fullName = item.FullName || item.Email;
                var email = item.FullName ? item.Email : null;
                // if(code == 0){
                //     return '<div>' +
                //     '<span class="">'+ escape(firstName) + " " + escape(lastName) + '</span>' +
                // '</div>';
                // }
                return '<div>' +
                    '<span class="">'+escape(fullName)+' - ' + escape(email) + '</span>' +
                '</div>';
              },
                
        }
    };

    $scope.parentContractConfig = {
          maxItems: 1,
          labelField: 'Code',
        onType: function(value) {
            setTimeout(function(){$scope.searchParentContract(value); }, 300);
        },
        searchField: ['Code']
    };

    $scope.apartmentConfig = {
          maxItems: 1,
          labelField: 'Code',
        onType: function(value) {
	        setTimeout(function(){$scope.searchApartment(value); }, 300);
	    },
        searchField: ['Code']
    };

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
}
app.controller('ContractCtrl', ContractCtrl);