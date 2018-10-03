function ApartmentCtrl($scope, $rootScope, $stateParams, $location, $timeout, xhrService, $anchorScroll) {
    $scope.allType = [{ name: "Ảnh chưa xác định", value: -1, maximum: 100 }, { name: "Ảnh Banner", value: 0, maximum: 1 },
    { name: "Ảnh phòng khách", value: 2, maximum: 4 }, { name: "Ảnh phòng tắm", value: 4, maximum: 4 },
    { name: "Ảnh phòng ngủ", value: 3, maximum: 4 }, { name: "Ảnh khác", value: 5, maximum: 4 },
    { name: "Ảnh xác minh", value: 1, maximum: 5 }];

    $scope.loadApartment = function () {
        $scope.bigCurrentPage = $stateParams.page === undefined ? 1 : $stateParams.page;
        $scope.typeStatus = $stateParams.type === undefined ? 1 : $stateParams.type;
        $scope.searchApm = $stateParams.search === undefined ? '' : $stateParams.search;
        xhrService.get("GetListApartment/" + $scope.bigCurrentPage + "/" + $scope.typeStatus + "/" + $scope.searchApm)
            .then(function (data) {
                $scope.apartmentList = data.data.data;
                $scope.totalItems = data.data.total;
            },
                function (error) {
                    console.log(error.statusText);
                });
    }
    $scope.pageChanged = function () {
        $location.path("/apartment").search({ page: $scope.bigCurrentPage, search: $scope.searchApm, type: $scope.typeStatus });
    };

    $scope.loadApartmentDetail = function () {
        $scope.statusAddress = true;
        $scope.data = {};
        xhrService.get("GetApartmentDetail/" + $stateParams.id)
            .then(function (data) {
                $scope.data = data.data;
                getAllFacilities();
                $scope.FullName = $scope.data.UserProfileOwner.FirstName + $scope.data.UserProfileOwner.LastName;
                listToManyList($scope.data.ImgList);
            },
                function (error) {
                    console.log(error.statusText);
                });

        $scope.editorOptions = {
            language: 'vi'
        };
        // doi tab o view
        $(document).ready(function () {
            $('ul.tabs li').click(function () {
                var tab_id = $(this).attr('data-tab');
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
                $(this).addClass('current');
                $("#" + tab_id).addClass('current');
            })

        });

    }

    $scope.pageChanged = function () {
        $location.path("/apartment").search({ page: $scope.bigCurrentPage, search: $scope.searchApm, type: $scope.typeStatus });
    };

    $scope.loadApartmentDetail = function () {
        $scope.statusAddress = true;
        $scope.data = {};
        xhrService.get("GetApartmentDetail/" + $stateParams.id)
            .then(function (data) {
                $scope.data = data.data;
                getAllFacilities();
                $scope.FullName = $scope.data.UserProfileOwner.FirstName + $scope.data.UserProfileOwner.LastName;
                listToManyList($scope.data.ImgList);
            },
                function (error) {
                    console.log(error.statusText);
                });

        $scope.editorOptions = {
            language: 'vi'
        };
        // doi tab o view
        $(document).ready(function () {
            $('ul.tabs li').click(function () {
                var tab_id = $(this).attr('data-tab');
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
                $(this).addClass('current');
                $("#" + tab_id).addClass('current');
            })

        });

    }
    function watchImgList() {
        var type, length;
        for (var j = 0; j < $scope.allType.length; j++) {
            $scope.$watchCollection('allImg[' + $scope.allType[j].value + ']', function () {
                for (var i = 0; i < $scope.allType.length; i++) {
                    type = $scope.allType[i].value;
                    length = $scope.allImg[type].length;
                    $scope.allImg[type];
                    if (length > 0) {
                        if ($scope.allImg[type][length - 1].Img_Base64 != undefined || $scope.allImg[type][length - 1].Img != undefined) {
                            if (type == -1 && length == 1) {
                                $scope.allType.splice(i, 1);
                            } else if (length < $scope.allType[i].maximum) {
                                $scope.allImg[type].push({ Img: null, Img_Base64: null, Type: type, Id: 0 });
                            }
                        };
                    }

                }
                return;
            });
        }

    }

    //ham chia imglist thanh cac array khac nhau
    function listToManyList(list) {
        $scope.allImg = {};
        //tao array cho moi kieu anh
        for (var i = 0; i < $scope.allType.length; i++) {
            $scope.allImg[$scope.allType[i].value] = [];
        };
        //add anh vao cac array tuong ung - theo type
        for (var i = 0; i < list.length; i++) {
            $scope.allImg[list[i].Type].push(list[i]);
        }
        for (var i = 0; i < $scope.allType.length; i++) {
            if ($scope.allImg[$scope.allType[i].value].length == 0 && $scope.allType[i].value == -1) {
                $scope.allType.splice(i, 1);
            } else if ($scope.allImg[$scope.allType[i].value].length < $scope.allType[i].maximum) {
                $scope.allImg[$scope.allType[i].value].push({ Img: null, Img_Base64: null, Type: $scope.allType[i].value, Id: 0 });
            };
        };
        watchImgList();
    }

    function getAllFacilities() {
        xhrService.get("GetAllFacilities/")
            .then(function (data) {
                $scope.facilityList = data.data;
                for (var j = 0; j < $scope.facilityList.length; j++) {
                    $scope.facilityList[j].Status = false;
                    for (var i = 0; i < $scope.data.FacilityList.length; i++) {
                        if ($scope.facilityList[j].Id == $scope.data.FacilityList[i].Id) {
                            $scope.facilityList[j].Status = true;
                        }
                    }
                };
            },
                function (error) {
                    console.log(error.statusText);
                });
    }
    $scope.uploadImg = function (event) {
        watchImgList();
    }
    $scope.changeType = function (type, index, item, newType) {
        $scope.allImg[type].splice(index, 1);
        if ($scope.allImg[newType][$scope.allImg[newType].length - 1].Img_Base64 == undefined && $scope.allImg[newType][$scope.allImg[newType].length - 1].Img == undefined) {
            $scope.allImg[newType][$scope.allImg[newType].length - 1] = item;
        }
        watchImgList();
    }
    $scope.changeAddress = function () {
        if ($scope.data.Latitude == undefined ||
            $scope.data.Latitude == 0 ||
            $scope.data.Longitude == undefined ||
            $scope.data.Longitude == 0 ||
            $scope.data.Longitude == $scope.oldLong ||
            $scope.data.Latitude == $scope.oldLat) {
            $scope.statusAddress = false;

        } else {
            $scope.oldLat = $scope.data.Latitude;
            $scope.oldLong = $scope.data.Longitude;
            $scope.statusAddress = true;
        }
    }

    $scope.submitApartment = function () {
        $scope.data.ImgList = [];
        $scope.FacilityList = [];
        for (var i = 0; i < $scope.allType.length; i++) {
            for (var j = 0; j < $scope.allImg[$scope.allType[i].value].length; j++) {
                var item = $scope.allImg[$scope.allType[i].value][j];
                if (item.Img_Base64 != undefined || item.Img != undefined) {
                    $scope.data.ImgList.push(item);
                }
            }
        };
        for (var i = 0; i < $scope.facilityList.length; i++) {
            if ($scope.facilityList[i].Status) {
                $scope.data.FacilityList.push({
                    Id: $scope.facilityList[i].Id,
                    ApartmentFacilityId: $scope.facilityList[i].ApartmentFacilityId
                });
            }
        };
        xhrService.put("SaveApartment", $scope.data)
            .then(function (data) {
                swal("Thành công!", "", "success")
                    .then((value) => {
                        window.location.href = "/apartment";
                    });

            },
                function (error) {
                    console.log(error.statusText);
                });
    };

    $scope.deleteApartment = function (item) {
        swal({
            title: "Bạn có chắc chắn muốn xóa ?",
            text: "Chung cư, căn hộ đã xóa không thể khôi phục!",
            icon: "warning",
            buttons: [
                'Không',
                'Có'
            ],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    xhrService.delete("DeleteApartment/" + item.Id)
                        .then(function (data) {
                            $scope.loadAccount();
                            swal("Xóa chung cư, căn hộ thành công!",
                                {
                                    icon: "success",
                                });

                        },
                            function (error) {
                                swal("Xóa chung cư, căn hộ thất bại!",
                                    {
                                        icon: "error",
                                    });
                            });

                }
            });
    };

}
app.controller('ApartmentCtrl', ApartmentCtrl);