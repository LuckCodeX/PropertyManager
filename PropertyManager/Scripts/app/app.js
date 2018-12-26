var app = angular.module('propertymanager', [
    'ngCookies',
    'ui.router',                    // Routing
    'oc.lazyLoad',                  // ocLazyLoad
    'ui.bootstrap',                 // Ui Bootstrap
    'ui.bootstrap.datetimepicker',
    'ngIdle',  						 // Idle timer
    'imageupload',                    
    //'ui.select',
    'ngSanitize',                   // ngSanitize
    //'ngCsv',
    'ngAnimate',
    'ngCkeditor',
//    'rzTable',
    'ui.utils',
    'selectize',
    'ui.select'
]);

var API = "http://localhost:22918/api/propertymanager/";
//var API = "http://localhost:54105/api/propertymanager/";
//var API = "http://manager.propertyplus.com.vn/api/propertymanager/";