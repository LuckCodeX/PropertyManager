
function xhrService($q, $http) {
    function getHttpConfig() {
        var token = null;
        if (localStorage.getItem('admin') === null) {

        } else if (localStorage.getItem('admin') !== null ||
            localStorage.getItem('admin') !== undefined) {
            var admin = JSON.parse(Base64.decode(localStorage.getItem('admin')));
            token = admin.Token;
        }
        return {
            headers: {
                Token: token
            },
            cache: false,
            timeout: 5 * 10000
        };
    }
    this.post = function (url, data) {
        var config = getHttpConfig();
        var deferred = $q.defer();
        $http.post(API + url, data, config).then(function (respone) {
            deferred.resolve(respone);
        }, function (msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    };
    this.put = function (url, data) {
        var config = getHttpConfig();
        var deferred = $q.defer();
        $http.put(API + url, data, config).then(function (respone) {
            deferred.resolve(respone);
        }, function (msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    };
    this.get = function (url) {
        var config = getHttpConfig();
        var deferred = $q.defer();
        $http.get(API + url, config).then(function (respone) {
            deferred.resolve(respone);
        }, function (msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    };
    this.delete = function (url) {
        var config = getHttpConfig();
        var deferred = $q.defer();
        $http.delete(API + url, config).then(function (respone) {
            deferred.resolve(respone);
        }, function (msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    }
}

function cityService() {
    this.getListCity = function () {
        return [
            { key: 1, value: "Hà Nội", ship: 30000 },
            { key: 2, value: "Thành Phố Hồ Chí Minh", ship: 30000 },
            { key: 3, value: "Hải Phòng", ship: 30000 },
            { key: 4, value: "Đà Nẵng", ship: 30000 },
            { key: 5, value: "An Giang", ship: 30000 },
            { key: 6, value: "Bà Rịa - Vũng Tàu", ship: 30000 },
            { key: 7, value: "Bắc Giang", ship: 30000 },
            { key: 8, value: "Bắc Kạn", ship: 30000 },
            { key: 9, value: "Bạc Liêu", ship: 30000 },
            { key: 10, value: "Bắc Ninh", ship: 30000 },
            { key: 11, value: "Bến Tre", ship: 30000 },
            { key: 12, value: "Bình Định", ship: 30000 },
            { key: 13, value: "Bình Dương", ship: 30000 },
            { key: 14, value: "Bình Phước", ship: 30000 },
            { key: 15, value: "Bình Thuận", ship: 30000 },
            { key: 16, value: "Cà Mau", ship: 30000 },
            { key: 17, value: "Cao Bằng", ship: 30000 },
            { key: 18, value: "Cần Thơ", ship: 30000 },
            { key: 19, value: "Đắk Lắk", ship: 30000 },
            { key: 20, value: "Đắk Nông", ship: 30000 },
            { key: 21, value: "Điện Biên", ship: 30000 },
            { key: 22, value: "Đồng Nai", ship: 30000 },
            { key: 23, value: "Đồng Tháp", ship: 30000 },
            { key: 24, value: "Gia Lai", ship: 30000 },
            { key: 25, value: "Hà Giang", ship: 30000 },
            { key: 26, value: "Hà Nam", ship: 30000 },
            { key: 27, value: "Hà Tĩnh", ship: 30000 },
            { key: 28, value: "Hải Dương", ship: 30000 },
            { key: 29, value: "Hậu Giang", ship: 30000 },
            { key: 30, value: "Hòa Bình", ship: 30000 },
            { key: 31, value: "Hưng Yên", ship: 30000 },
            { key: 32, value: "Khánh Hòa", ship: 30000 },
            { key: 33, value: "Kiên Giang", ship: 30000 },
            { key: 34, value: "Kon Tum", ship: 30000 },
            { key: 35, value: "Lai Châu", ship: 30000 },
            { key: 36, value: "Lâm Đồng", ship: 30000 },
            { key: 37, value: "Lạng Sơn", ship: 30000 },
            { key: 38, value: "Lào Cai", ship: 30000 },
            { key: 39, value: "Long An", ship: 30000 },
            { key: 40, value: "Nam Định", ship: 30000 },
            { key: 41, value: "Nghệ An", ship: 30000 },
            { key: 42, value: "Ninh Bình", ship: 30000 },
            { key: 43, value: "Ninh Thuận", ship: 30000 },
            { key: 44, value: "Phú Thọ", ship: 30000 },
            { key: 45, value: "Quảng Bình", ship: 30000 },
            { key: 46, value: "Quảng Nam", ship: 30000 },
            { key: 47, value: "Quảng Ngãi", ship: 30000 },
            { key: 48, value: "Quảng Ninh", ship: 30000 },
            { key: 49, value: "Quảng Trị", ship: 30000 },
            { key: 50, value: "Sóc Trăng", ship: 30000 },
            { key: 51, value: "Sơn La", ship: 30000 },
            { key: 52, value: "Tây Ninh", ship: 30000 },
            { key: 53, value: "Thái Bình", ship: 30000 },
            { key: 54, value: "Thái Nguyên", ship: 30000 },
            { key: 55, value: "Thanh Hóa", ship: 30000 },
            { key: 56, value: "Thừa Thiên Huế", ship: 30000 },
            { key: 57, value: "Tiền Giang", ship: 30000 },
            { key: 58, value: "Trà Vinh", ship: 30000 },
            { key: 59, value: "Tuyên Quang", ship: 30000 },
            { key: 60, value: "Vĩnh Long", ship: 30000 },
            { key: 61, value: "Vĩnh Phúc", ship: 30000 },
            { key: 62, value: "Yên Bái", ship: 30000 },
            { key: 63, value: "Phú Yên", ship: 30000 }
        ];
    }

    this.getListPayment = function () {
        return [
            { value: "" },
            { key: 0, value: "Nhận hàng tại cửa hàng" },
            { key: 1, value: "COD" }
        ];
    }
}

app.service('xhrService', xhrService)
    //.service('adminService', adminService)
    .service('cityService', cityService);

app.filter('filterCategory', function () {
    return function (listCategories, cateId) {
        var cate = listCategories.filter((q) => q.id == cateId)[0];
        return cate !== undefined ? cate.name : "";
        //listCategories.forEach(function (obj) {
        //    console.log(obj.categories);
        //    return obj.categories.filter((q) => q.id == cateId)[0].name;
        //});
    }
});

app.filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);