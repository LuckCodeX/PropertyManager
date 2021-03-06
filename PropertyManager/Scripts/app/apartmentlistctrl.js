function ApartmentListCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	var saveCol = true;
    var colOld = {index: 0, type: "asc"};
    $scope.allType = [{ name: "Ảnh chưa xác định", value: -1, maximum: 100 }, { name: "Ảnh Banner", value: 0, maximum: 1 },
    { name: "Ảnh phòng khách", value: 2, maximum: 4 }, { name: "Ảnh phòng tắm", value: 4, maximum: 4 },
    { name: "Ảnh phòng ngủ", value: 3, maximum: 4 }, { name: "Ảnh khác", value: 5, maximum: 4 },
    { name: "Ảnh xác minh", value: 1, maximum: 5 }];
	$scope.loadApartmentList = function(){
		$scope.status = false;
        saveCol = true;
        createTable();
	 };
//	    var profileOne = {
//	        "colIndex":50,"colHouseAddress":445,
//	        "colNameOwner":152,"colPhoneNumber":122,
//	        "colEmail":98,"colTaxCode":107,
//	        "colIdNumber":81,"colAddress":118,
//	        "colCountInteractive":125,"colBankId":137,
//	        "colBankName":116,"colPrice":120,
//	        "colEmptyDay":101,"colCallDay":118,
//	        "colNote":100,"colCallPerson":127,
//	        "colProject":89,"colApartment":89,
//	        "colCountHouse":89,"colArea":89,
//	        "colBedroom":89};

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
        }
//	    if (!localStorage.getItem('ngColumnResize.resizeTable.OverflowResizer.one')) {
//	      localStorage.setItem('ngColumnResize.resizeTable.OverflowResizer.one',JSON.stringify(profileOne));
//	    }
	    $("#resizeTable").on('change','tr td input',function(){
	    	$scope.status = true;
	    });

	    $("#resizeTable").on('change','tr td select',function(){
	    	$scope.status = true;
	    });

	    $("#resizeTable tr th.colSort").on("click",function(event){
	    	var scrollPx = $("#resizeTable").parent().scrollLeft();
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
	    	}
	    	if (saveCol) {
	    		if ($(this).hasClass('sorting_asc')) {
	                colOld = {index:index,type: "asc"};
	            }else if($(this).hasClass('sorting_desc')){
	                colOld = [[ index, "desc" ]];
	            }
	            if ($scope.status) {
				      if(currentIndex == index && currentType == "asc"){
				      		$('.js-basic-example').DataTable().destroy();
					        $('.js-basic-example').DataTable( {
					          "order": [[ index, "desc" ]],
					          "pageLength": 50,
	         				  "bLengthChange": false,
					          "language": {
							    "search": "Tìm kiếm:",
							    "info": "Hiện từ _START_ đến _END_ trên tổng _TOTAL_",
							    "paginate": {
							      "previous": "Trước",
							      "next":"Sau"
							    }
							  }
					        });
				        	$('.js-basic-example').DataTable().search(searchText).draw();
				      }else{
				      		$('.js-basic-example').DataTable().destroy();
					        $('.js-basic-example').DataTable( {
					          "order": [[ index, "asc" ]],
					          "pageLength": 50,
	         				  "bLengthChange": false,
					          "language": {
							    "search": "Tìm kiếm:",
							    "info": "Hiện từ _START_ đến _END_ trên tổng _TOTAL_",
							    "paginate": {
							      "previous": "Trước",
							      "next":"Sau"
							    }
							  }
					        });
                          $('.js-basic-example').DataTable().search(searchText).draw();
				      }
                      $("#resizeTable").parent().scrollLeft(scrollPx);
				      $scope.table.update();
			    	  $scope.status = false;
                }
	    	}else{
	    		console.log("wrong!");
	    		event.stopImmediatePropagation();
	    	}
            
            $("#resizeTable").parent().scrollLeft(scrollPx);
	    	saveCol = true;
	    });
    function createTable(){
        $timeout(function() {
            $('.js-basic-example').DataTable().destroy();
             $('.js-basic-example').DataTable({
                "pageLength": 50,
                "bLengthChange": false,
                "language": {
                    "search": "Tìm kiếm:",
                    "info": "Hiện từ _START_ đến _END_ trên tổng _TOTAL_",
                    "paginate": {
                      "previous": "Trước",
                      "next":"Sau"
                    }
                 }
             });
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