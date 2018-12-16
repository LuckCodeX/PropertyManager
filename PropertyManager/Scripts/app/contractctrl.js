function ContractCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	$scope.contractList = [];
	
	$scope.loadContract = function(){
		for (var i = 0; i < 20; i++) {
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
	$scope.addPassport = function(){
		$scope.passportList.push({ownerName:"",passport:""});
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
            console.log($scope.apartmentList);
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

	$scope.getDetailApartment = function(){
        $scope.apartmentList.forEach(function(item, index){
        	if (item.Id == $scope.currentApartment) {
        		$scope.contract.Area = item.Area;
        		$scope.contract.OwnerName = item.UserProfileOwner.FullName;
        		$scope.contract.OwnerPhone = item.UserProfileOwner.Phone;
        		$scope.contract.OwnerTaxCode = item.UserProfileOwner.TaxCode;
        		$scope.contract.OwnerAddress = item.UserProfileOwner.OwnerAddress;
        		$scope.contract.OwnerBankAccount = item.UserProfileOwner.OwnerBankAccount;
        		$scope.contract.OwnerBankName = item.UserProfileOwner.OwnerBankName;
        		$scope.contract.OwnerBankNumber = item.UserProfileOwner.OwnerBankNumber;
        		$scope.contract.OwnerBankBranch = item.UserProfileOwner.OwnerBankBranch;
        		$scope.contract.Building = item.Building;
        		$scope.contract.NoApartment = item.NoApartment;
        		$scope.contract.ApartmentId = item.Id;
        		$scope.contract.PassWifi = item.PassWifi;
        		$scope.contract.PassDoor = item.PassDoor;
        		$scope.contract.NoBedroom = item.NoBedroom;
        		$scope.contract.Address = item.Address;
        		$scope.contract.OwnerUserProfileId = item.UserProfileOwner.Id;
        	}
        });
	}

	$scope.getDetailEmployee = function(){
		$scope.employeeList.forEach(function(item, index){
        	if (item.Id == $scope.currentEmployee) {
        		$scope.employee.FullName = item.FullName;
        		$scope.employee.Phone = item.Phone;
        		$scope.employee.Email = item.Email;
        		$scope.employee.BankAccount = item.BankAccount;
        		$scope.employee.BankNumber = item.BankNumber;
        		$scope.employee.BankName = item.BankName;
        		$scope.employee.BankBranch = item.BankBranch;
        		$scope.contract.AdminId = item.Id
        	}
        });
	}

	$scope.getDetailCompany = function(){
		$scope.companyList.forEach(function(item, index){
        	if (item.Id == $scope.currentCompany) {
        		console.log(item);
        		$scope.contract.TenantName = item.Name;
        		$scope.contract.TenantAddress = item.Address;
        		$scope.contract.TenantTaxCode = item.TaxCode;
        		$scope.contract.TenantBankName = item.BankName;
        		$scope.contract.TenantBankNumber = item.BankNumber;
        		$scope.contract.TenantBankAccount = item.BankAccount;
        		$scope.contract.TenantBankBranch = item.BankBranch;
        		$scope.contract.CompanyId = item.Id;
        	}
        });
	}

	$scope.getDetailAccount = function(){
		$scope.accountList.forEach(function(item, index){
        	if (item.Id == $scope.currentAccount) {
        		$scope.account.Email = item.Email;
        		$scope.contract.UserProfileId = item.Id;
        	}
        });
	}

	$scope.loadContractDetail = function(){
		$scope.data = {};
		$scope.contractType = [{value:0,name:"Hợp đồng giữa công ty và chủ nhà"}];
		$scope.contract = {};
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
        	$scope.contract.UserProfileId = data.data.Id;
        	$scope.searchAccount("");
        	$scope.currentAccount =  data.data.Id;
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
        	$scope.company.BankName = $scope.companyModel.TenantBankName;
			$scope.company.TaxCode = $scope.companyModel.TenantTaxCode;
			$scope.company.TenantBankAccount = $scope.companyModel.BankAccount;
			$scope.company.TenantBankBranch = $scope.companyModel.BankBranch;
			$scope.company.TenantBankNumber = $scope.companyModel.BankNumber;
			$scope.company.TenantName = $scope.companyModel.Name;
			$scope.company.TenantAddress = $scope.companyModel.Address;
			$scope.searchCompany(data.data.Name);
			$scope.currentCompany = data.data.Id;
            $('#accountModal').modal('hide');
        },
        function (error) {
            console.log(error.statusText);
        });
		 $('#companyModal').modal('hide');
	}

	$scope.submitContract = function(){
		console.log($scope.contract);
		xhrService.post("CreateContract/",$scope.contract)
        .then(function (data) {
        	console.log(data);
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
                    '<span class="">['+escape(fullName)+'] - [' + escape(email) + ']</span>' +
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
                    '<span class="">['+escape(fullName)+'] - [' + escape(email) + ']</span>' +
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
                    '<span class="">['+escape(fullName)+'] - [' + escape(email) + ']</span>' +
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
                    '<span class="">['+escape(fullName)+'] - [' + escape(email) + ']</span>' +
                '</div>';
              },
                
        }
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