function CustomerListCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	$scope.loadApartmentList = function(){
		$scope.status = false;
		$scope.tableMode = "OverflowResizer";
	    $scope.profile = 'two';
	    $scope.options = {
	      onResizeEnded: function() {
	        $scope.checkResize();

	      }
	    };
	    var profileOne = {"colIndex":135,"colNameCompany":135,
					    "colFaxCode":135,"colEmail":135,"colTaxCode":135,
					    "colIdNumber":157,"colAddress":135,
					    "colCountInteractive":135,"colBankId":135,
					    "colBankName":135,"colPrice":135,
					    "colEmptyDay":135,"colCallDay":135,
					    "colNote":135,"colCallPerson":135,
					    "colNameOwner":135,"colPhoneNumber":136};

	        $scope.items= [{
	        "colIndex":"1","colHouseAddress":"2",
	        "colNameOwner":"4","colPhoneNumber":"3",
	        "colEmail":"5","colTaxCode":"4",
	        "colIdNumber":"2","colAddress":"5",
	        "colCountInteractive":"1","colBankId":"5",
	        "colBankName":"116","colPrice":"4",
	        "colEmptyDay":"1","colCallDay":"3",
	        "colNote":"6","colCallPerson":"7",
	        "colProject":"9","colApartment":"6",
	        "colCountHouse":"89","colArea":"8",
	        "colBedroom":"89"},
	        {"colIndex":"12","colHouseAddress":"42",
	        "colNameOwner":"14","colPhoneNumber":"13",
	        "colEmail":"45","colTaxCode":"44",
	        "colIdNumber":"22","colAddress":"15",
	        "colCountInteractive":"1","colBankId":"55",
	        "colBankName":"16","colPrice":"41",
	        "colEmptyDay":"11","colCallDay":"23",
	        "colNote":"62","colCallPerson":"73",
	        "colProject":"19","colApartment":"46",
	        "colCountHouse":"891","colArea":"81",
	        "colBedroom":"894"},
	        {"colIndex":"12","colHouseAddress":"42",
	        "colNameOwner":"14","colPhoneNumber":"13",
	        "colEmail":"45","colTaxCode":"44",
	        "colIdNumber":"22","colAddress":"15",
	        "colCountInteractive":"1","colBankId":"55",
	        "colBankName":"16","colPrice":"41",
	        "colEmptyDay":"11","colCallDay":"23",
	        "colNote":"62","colCallPerson":"73",
	        "colProject":"199","colApartment":"46",
	        "colCountHouse":"891","colArea":"81",
	        "colBedroom":"894"}];

	        for (var i = 0; i < 30; i++) {
	        	$scope.items.push({"colIndex":"12","colHouseAddress":"42",
		        "colNameOwner":"14","colPhoneNumber":"13",
		        "colEmail":"45","colTaxCode":"44",
		        "colIdNumber":"22","colAddress":"15",
		        "colCountInteractive":"1","colBankId":"55",
		        "colBankName":"16","colPrice":"41",
		        "colEmptyDay":"11","colCallDay":"23",
		        "colNote":"62","colCallPerson":"73",
		        "colProject":"199","colApartment":"46",
		        "colCountHouse":"891","colArea":"81",
		        "colBedroom":"894"});
		        };
	    if (!localStorage.getItem('ngColumnResize.resizeTable.OverflowResizer.two')) {
	      localStorage.setItem('ngColumnResize.resizeTable.OverflowResizer.two',JSON.stringify(profileOne));
	    }
	    $("#resizeTable").on('change','tr td input',function(){
	    	$scope.status = true;
	    });

	    $("#resizeTable").on('change','tr td select',function(){
	    	$scope.status = true;
	    });

	    $("#resizeTable").on("click",".colSort",function(){
	    	var index = $(this).index();
	    	if ($scope.status) {
			      var searchText = $('#resizeTable_filter input').val();
			      if($(this).hasClass('sorting_asc')){
			        $('.js-basic-example').DataTable().destroy();
			        $('.js-basic-example').DataTable( {
			          "order": [[ index, "asc" ]],
			          paging: false,
			          "language": {
					    "search": "Tìm kiếm:"
					  }
			        });
			        $('.js-basic-example').DataTable().search(searchText).draw();
			       
			      }else if($(this).hasClass('sorting_desc')){
			        $('.js-basic-example').DataTable().destroy();
			        $('.js-basic-example').DataTable( {
			          "order": [[ index, "desc" ]],
			          paging: false,
			          "language": {
					    "search": "Tìm kiếm:"
					  }
			        });
			        $('.js-basic-example').DataTable().search(searchText).draw();
			      }
			    $scope.status = false;
	    	}
	    });

	    

	    $timeout(function() {
	         $('.js-basic-example').DataTable({
	         	paging: false,
	         	"language": {
				    "search": "Tìm kiếm:"
				  }});
	         $scope.checkResize();
	         $("input[type='search']").addClass('form-ctrl');
	    }, 500);
	}
	
    $scope.checkResize = function(){
        var width = 1;
        width += document.getElementById('colIndex').offsetWidth;
        $('.colProject').css("left",width+"px");
        width += document.getElementById('colProject').offsetWidth;
        $('.colApartment').css("left",width+"px");
        width += document.getElementById('colApartment').offsetWidth;
        $('.colCountHouse').css("left",width+"px");
        width += document.getElementById('colCountHouse').offsetWidth;
        $('.colArea').css("left",width+"px");
        width += document.getElementById('colArea').offsetWidth;
        $('.colBedroom').css("left",width+"px");
    };

}
app.controller('CustomerListCtrl', CustomerListCtrl);