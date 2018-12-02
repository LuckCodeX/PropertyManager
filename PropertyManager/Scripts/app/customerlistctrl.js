function CustomerListCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
	var saveCol = true;
    var colOld = {index: 0,type:"asc"};
	$scope.loadApartmentList = function(){
		$scope.status = false;
        saveCol = true;
        createTable();
	};

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
        $scope.items.push({"colIndex":"12","colHouseAddress":"42999",
        "colNameOwner":"14","colPhoneNumber":"13",
        "colEmail":"45","colTaxCode":"44",
        "colIdNumber":"22","colAddress":"15",
        "colCountInteractive":"1","colBankId":"55",
        "colBankName":"16","colPrice":"41",
        "colEmptyDay":"11","colCallDay":"23",
        "colNote":"62","colCallPerson":"73",
        "colProject":"19999","colApartment":"46",
        "colCountHouse":"891","colArea":"81",
        "colBedroom":"894"});
    };
    $("#resizeTable").on('change','tr td input',function(){
        $scope.status = true;
    });

    $("#resizeTable").on('change','tr td select',function(){
        $scope.status = true;
    });

   $("#resizeTable tr th.colSort").on("click",function(event){
        var currentIndex = $('#resizeTable').dataTable().fnSettings().aaSorting[0][0];
        var currentType = $('#resizeTable').dataTable().fnSettings().aaSorting[0][1];
       var scrollPx = $("#resizeTable").parent().scrollLeft();
        var index = $(this).index();
        var searchText = $('#resizeTable_filter input').val();
        if (saveCol) {
            if ($(this).hasClass('sorting_asc')) {
                colOld = {index:index,type: "asc"};
            }else if($(this).hasClass('sorting_desc')){
                colOld = [[ index, "desc" ]];
            };
            if ($scope.status) {
                  if(currentIndex == index && currentType == "asc"){
                        $('#resizeTable').DataTable().destroy();
                        $('#resizeTable').DataTable( {
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
                        $('#resizeTable').DataTable().search(searchText).draw();
                  }else{
                        $('#resizeTable').DataTable().destroy();
                        $('#resizeTable').DataTable( {
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
                        $('#resizeTable').DataTable().search(searchText).draw();
                  }
                $("#resizeTable").parent().scrollLeft(scrollPx);
                  $scope.checkResize();
                  $scope.table.update();
                  $scope.status = false;
            }
        }else{
            event.stopImmediatePropagation();
        }
    });
    function createTable(){
        $timeout(function() {
            $('#resizeTable').DataTable().destroy();
             $('#resizeTable').DataTable({
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
             $("input[type='search']").addClass('form-ctrl');
            $timeout(function() {
                $scope.checkResize();    
            },500);
        }, 500);
    }

    $scope.checkResize = function(){
        var width = 0;
        width += document.getElementById('colIndex').offsetWidth;
        console.log(width);
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