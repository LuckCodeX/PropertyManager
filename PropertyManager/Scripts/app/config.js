
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, IdleProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('login',
            {
                url: "/login"
            })
        .state('dashboard',
            {
                url: "/dashboard",
                templateUrl: "html/dashboard.html"
            })
        .state('account',
            {
                url: "/account",
                templateUrl: "html/account.html"
            })
        .state('accountdetail',
            {
                url: "/account-detail/:id",
                templateUrl: "html/accountdetail.html"
            })
        .state('apartment',
            {
                url: "/apartment",
                templateUrl: "html/apartment.html"
            })
        .state('apartmentdetail',
            {
                url: "/apartment-detail/:id",
                templateUrl: "html/apartmentdetail.html"
            })
        ;
}


app.config(config)
    .run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;

        });
    });
