function ApartmentListCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	var saveCol = true;
    var colOld = {index: 0,type:"asc"};
	$scope.loadApartmentList = function(){
		$scope.status = false;
		$scope.tableMode = "OverflowResizer";
	    $scope.profile = 'one';
	    $scope.options = {
	    	onResizeStarted: function(){
	    		saveCol = false;
	    	},
	      onResizeEnded: function() {
	        $scope.checkResize();
	      }
	    };
	    var profileOne = {
	        "colIndex":49,"colHouseAddress":445,
	        "colNameOwner":152,"colPhoneNumber":122,
	        "colEmail":98,"colTaxCode":107,
	        "colIdNumber":81,"colAddress":118,
	        "colCountInteractive":125,"colBankId":137,
	        "colBankName":116,"colPrice":120,
	        "colEmptyDay":101,"colCallDay":118,
	        "colNote":100,"colCallPerson":127,
	        "colProject":89,"colApartment":89,
	        "colCountHouse":89,"colArea":89,
	        "colBedroom":89};

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
	    if (!localStorage.getItem('ngColumnResize.resizeTable.OverflowResizer.one')) {
	      localStorage.setItem('ngColumnResize.resizeTable.OverflowResizer.one',JSON.stringify(profileOne));
	    }
	    $("#resizeTable").on('change','tr td input',function(){
	    	$scope.status = true;
	    });

	    $("#resizeTable").on('change','tr td select',function(){
	    	$scope.status = true;
	    });

	    $("#resizeTable tr th.colSort").on("click",function(event){
	    	console.log($scope.table);
	    	var scrollPx = $("#resizeTable_wrapper > .row:nth-child(2) > .col-sm-12").scrollLeft();
			var currentIndex = $('.js-basic-example').dataTable().fnSettings().aaSorting[0][0];
	    	var currentType = $('.js-basic-example').dataTable().fnSettings().aaSorting[0][1];
	    	var index = $(this).index();
	    	var searchText = $('#resizeTable_filter input').val();
	    	if (index != 0) {
	    		if($(this).hasClass('col2row')){
	    			index += 4;
	    		}else{
	    			index += 1;
	    		}
	    	};
	    	if (saveCol) {
	    		if ($(this).hasClass('sorting_asc')) {
	                colOld = {index:index,type: "asc"};
	            }else if($(this).hasClass('sorting_desc')){
	                colOld = [[ index, "desc" ]];
	            };
	            if ($scope.status) {

	            	event.stopImmediatePropagation();
				      if(currentIndex == index && currentType == "asc"){
				      		$('.js-basic-example').DataTable().destroy();
					        $('.js-basic-example').DataTable( {
					          "order": [[ index, "desc" ]],
					          paging: false,
					          "language": {
							    "search": "Tìm kiếm:"
							  }
					        });
				        	$('.js-basic-example').DataTable().search(searchText).draw();
				      }else{
				      		$('.js-basic-example').DataTable().destroy();
					        $('.js-basic-example').DataTable( {
					          "order": [[ index, "asc" ]],
					          paging: false,
					          "language": {
							    "search": "Tìm kiếm:"
							  }
					        });
				        	$('.js-basic-example').DataTable().search(searchText).draw();
				      }
				      $scope.table.update();
				      $scope.checkResize();
				      $("#resizeTable_wrapper > .row:nth-child(2) > .col-sm-12").scrollLeft(scrollPx);
			    	  $scope.status = false;
		    	}
	    	}else{
	    		console.log("wrong!");
	    		event.stopImmediatePropagation();
	    	}
	    	saveCol = true;
	    });
	    
	    window.onbeforeunload = function(){
		  localStorage.removeItem('ngColumnResize.resizeTable.OverflowResizer.one');
		};

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
        var width = 0;
        width += document.getElementById('colIndex').offsetWidth;
        $('.colProject').css("left",width+"px");
        width += document.getElementById('colProject').offsetWidth;
        $('.colApartment').css("left",width+"px");
        width += document.getElementById('colApartment').offsetWidth;
        $('.colCountHouse').css("left",width+"px");
        width += document.getElementById('colCountHouse').offsetWidth;
        $('.colArea').css("left",width+"px");
        width += document.getElementById('colArea').offsetWidth ;
        $('.colBedroom').css("left",width+"px");
    };

}
app.controller('ApartmentListCtrl', ApartmentListCtrl);