
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
        .state('apartment',
            {
                url: "/apartment?page&type&search",
                templateUrl: "html/apartment.html"
            })
        .state('apartmentdetail',
            {
                url: "/apartment-detail/:id",
                templateUrl: "html/apartmentdetail.html"
            })
        .state('customerlist',
            {
                url: "/customer-list",
                templateUrl: "html/customerlist.html"
            })
        .state('apartmentlist',
            {
                url: "/apartment-list",
                templateUrl: "html/apartmentlist.html"
            })
        .state('contract',
            {
                url: "/contract",
                templateUrl: "html/contract.html"
            })
        .state('contractdetail',
            {
                url: "/contract-detail/:id",
                templateUrl: "html/contractdetail.html"
            })
        .state('visit',
            {
                url: "/visit?page&status",
                templateUrl: "html/visit.html"
            })
        .state('visitdetail',
            {
                url: "/visit-detail/:id",
                templateUrl: "html/visitdetail.html"
            })
        .state('system',
            {
                url: "/system",
                abstract: true,
                templateUrl: "html/system.html",
            })
        .state('system.account',
            {
                url: "/account?page&search",
                templateUrl: "html/account.html"
            })
        .state('system.accountdetail',
            {
                url: "/account-detail/:id",
                templateUrl: "html/accountdetail.html"
            })
        .state('system.issue',
            {
                url: "/issue?page&search",
                templateUrl: "html/issue.html"
            })
        .state('system.issuedetail',
            {
                url: "/issue-detail/:id",
                templateUrl: "html/issuedetail.html"
            })
        .state('system.importcustomer',
            {
                url: "/import-customer",
                templateUrl: "html/importcustomer.html"
            })
        .state('system.importapartment',
            {
                url: "/import-apartment",
                templateUrl: "html/importapartment.html"
            })
        .state('maid',
            {
                url: "/maid",
                abstract: true,
                templateUrl: "html/maid.html",
            })
        .state('maid.list',
            {
                url: "/list?page&empID&fromDate&toDate",
                templateUrl: "html/maidlist.html"
            })
        .state('maid.apartment',
            {
                url: "/apartment?page&empID&fromDate&toDate&apartment&building&address&projectId",
                templateUrl: "html/maidapartment.html"
            })
        .state('maid.business',
            {
                url: "/business?page&search&fromDate&toDate&empID",
                templateUrl: "html/maidbusiness.html"
            })
        .state('maid.problem',
            {
                url: "/problem?page&search",
                templateUrl: "html/maidproblem.html"
        })
            .state('maid.water',
                {
                    url: "/water?page&search",
                    templateUrl: "html/maidwater.html"
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
