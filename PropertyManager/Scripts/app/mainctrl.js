function MainCtrl($scope,$rootScope,$stateParams, $location,$timeout, xhrService,$anchorScroll) {
    $scope.loadLayout = function(){
    	// $scope.leftMenu = [{name:"Tài khoản",value:[{name:"Quản lý tài khoản",link:"account"}]},
    	// 					{name:"Chung cư, căn hộ",value:[{name:"Quản lý chung cư, căn hộ",link:"apartment"}]}];
    	if (!(localStorage && localStorage.getItem('admin'))) {
            window.location.href = "/login";
        };
    	$scope.notifications = [];
    	for (var i = 0; i < 9; i++) {
    		var notification = {
    			avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC",
    			title: "Barack Barbara has assigned a new shift to you on 25/09/2018  8:30pm – 10:00pm at New Ass",
    			time: "19 hours ago"
    		};
    		$scope.notifications.push(notification);
    	}
    	
	    $(document).ready(function(){
	        $('ul.tabs li').click(function(){
	            var tab_id = $(this).attr('data-tab');

	            $('ul.tabs li').removeClass('current');
	            $('.tab-content').removeClass('current');

	            $(this).addClass('current');
	            $("#"+tab_id).addClass('current');
	        })

	    });

	    $scope.employees = [];
	    for (var i = 0; i < 9; i++) {
	    	var employee = {
	    		FirstName:"Bush",
	    		LastName:"Geogre",
	    		Working:"Not working today",
	    		AvatarEmp:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC",
	    		Role:"Ha Noi"
	    	};
	    	$scope.employees.push(employee);
	    }
	    $scope.employees.push({
	    		FirstName:"Bandana",
	    		LastName:"Bardolph",
	    		Working:"Not working today",
	    		AvatarEmp:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC",
	    		Role:"HCM"
	    	});


    }

    $scope.replaceString = function (str) {
        if (!str)
            return null;
        str = str.toLowerCase();
        str = str.replace(/\ /g, "-");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/\”|\“|\"|\[|\]|\?/g, "");
        return str;
    };
}

app.controller('MainCtrl', MainCtrl);