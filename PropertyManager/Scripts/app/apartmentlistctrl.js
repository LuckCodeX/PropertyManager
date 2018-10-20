function ApartmentListCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	var saveCol = true;
    var colOld = {index: 0,type:"asc"};
    $scope.allType = [{ name: "Ảnh chưa xác định", value: -1, maximum: 100 }, { name: "Ảnh Banner", value: 0, maximum: 1 },
    { name: "Ảnh phòng khách", value: 2, maximum: 4 }, { name: "Ảnh phòng tắm", value: 4, maximum: 4 },
    { name: "Ảnh phòng ngủ", value: 3, maximum: 4 }, { name: "Ảnh khác", value: 5, maximum: 4 },
    { name: "Ảnh xác minh", value: 1, maximum: 5 }];
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
	        "colIndex":50,"colHouseAddress":445,
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



    // $scope.loadApartmentDetail = function () {
    //     $scope.statusAddress = true;
    //     $scope.data = {
    //     	Type:1,
    //     	Status:0
    //     };
    //     getAllFacilities();
    //     listToManyList([]);

    //     $scope.editorOptions = {
    //         language: 'vi'
    //     };
    //     // doi tab o view
    //     $(document).ready(function () {
    //         $('ul.tabs li').click(function () {
    //             var tab_id = $(this).attr('data-tab');
    //             $('ul.tabs li').removeClass('current');
    //             $('.tab-content').removeClass('current');
    //             $(this).addClass('current');
    //             $("#" + tab_id).addClass('current');
    //         })

    //     });

    // }
    // function watchImgList() {
    //     var type, length;
    //     for (var j = 0; j < $scope.allType.length; j++) {
    //         $scope.$watchCollection('allImg[' + $scope.allType[j].value + ']', function () {
    //             for (var i = 0; i < $scope.allType.length; i++) {
    //                 type = $scope.allType[i].value;
    //                 length = $scope.allImg[type].length;
    //                 $scope.allImg[type];
    //                 if (length > 0) {
    //                     if ($scope.allImg[type][length - 1].Img_Base64 != undefined || $scope.allImg[type][length - 1].Img != undefined) {
    //                         if (type == -1 && length == 1) {
    //                             $scope.allType.splice(i, 1);
    //                         } else if (length < $scope.allType[i].maximum) {
    //                             $scope.allImg[type].push({ Img: null, Img_Base64: null, Type: type, Id: 0 });
    //                         }
    //                     };
    //                 }

    //             }
    //             return;
    //         });
    //     }

    // }

    // //ham chia imglist thanh cac array khac nhau
    // function listToManyList(list) {
    //     $scope.allImg = {};
    //     //tao array cho moi kieu anh
    //     for (var i = 0; i < $scope.allType.length; i++) {
    //         $scope.allImg[$scope.allType[i].value] = [];
    //     };
    //     //add anh vao cac array tuong ung - theo type
    //     for (var i = 0; i < list.length; i++) {
    //         $scope.allImg[list[i].Type].push(list[i]);
    //     }
    //     for (var i = 0; i < $scope.allType.length; i++) {
    //         if ($scope.allImg[$scope.allType[i].value].length == 0 && $scope.allType[i].value == -1) {
    //             $scope.allType.splice(i, 1);
    //         } else if ($scope.allImg[$scope.allType[i].value].length < $scope.allType[i].maximum) {
    //             $scope.allImg[$scope.allType[i].value].push({ Img: null, Img_Base64: null, Type: $scope.allType[i].value, Id: 0 });
    //         };
    //     };
    //     watchImgList();
    // }

    // function getAllFacilities() {
    //     xhrService.get("GetAllFacilities")
    //         .then(function (data) {
    //             for (var j = 0; j < $scope.facilityList.length; j++) {
    //                 $scope.facilityList[j].Status = false;
    //             };
    //         },
    //             function (error) {
    //                 console.log(error.statusText);
    //             });
    // }
    // $scope.uploadImg = function (event) {
    //     watchImgList();
    // }
    // $scope.changeType = function (type, index, item, newType) {
    //     $scope.allImg[type].splice(index, 1);
    //     if ($scope.allImg[newType][$scope.allImg[newType].length - 1].Img_Base64 == undefined && $scope.allImg[newType][$scope.allImg[newType].length - 1].Img == undefined) {
    //         $scope.allImg[newType][$scope.allImg[newType].length - 1] = item;
    //     }
    //     watchImgList();
    // }
    // $scope.changeAddress = function () {
    //     if ($scope.data.Latitude == undefined ||
    //         $scope.data.Latitude == 0 ||
    //         $scope.data.Longitude == undefined ||
    //         $scope.data.Longitude == 0 ||
    //         $scope.data.Longitude == $scope.oldLong ||
    //         $scope.data.Latitude == $scope.oldLat) {
    //         $scope.statusAddress = false;

    //     } else {
    //         $scope.oldLat = $scope.data.Latitude;
    //         $scope.oldLong = $scope.data.Longitude;
    //         $scope.statusAddress = true;
    //     }
    // }

    // $scope.submitApartment = function () {
    //     $scope.data.ImgList = [];
    //     $scope.data.FacilityList = [];
    //     for (var i = 0; i < $scope.allType.length; i++) {
    //         for (var j = 0; j < $scope.allImg[$scope.allType[i].value].length; j++) {
    //             var item = $scope.allImg[$scope.allType[i].value][j];
    //             if (item.Img_Base64 != undefined || item.Img != undefined) {
    //                 $scope.data.ImgList.push(item);
    //             }
    //         }
    //     };
    //     for (var i = 0; i < $scope.facilityList.length; i++) {
    //         if ($scope.facilityList[i].Status) {
    //             $scope.data.FacilityList.push({
    //                 Id: $scope.facilityList[i].Id,
    //                 ApartmentFacilityId: $scope.facilityList[i].ApartmentFacilityId
    //             });
    //         }
    //     };
    //     xhrService.post("SaveApartment", $scope.data)
    //         .then(function (data) {
    //             swal("Thành công!", "", "success")
    //                 .then((value) => {
    //                     window.location.href = "/apartment";
    //                 });

    //         },
    //             function (error) {
    //                 console.log(error.statusText);
    //             });
    // };
}
app.controller('ApartmentListCtrl', ApartmentListCtrl);