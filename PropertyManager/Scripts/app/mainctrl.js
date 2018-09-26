function MainCtrl($scope,$rootScope,$stateParams, $location,$timeout, xhrService,$anchorScroll) {
    $scope.loadLayout = function(){
    	
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
}

app.controller('MainCtrl', MainCtrl);