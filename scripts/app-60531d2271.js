(function() {
  "use strict";

  config.$inject = ["$stateProvider", "$translatePartialLoaderProvider"];
  angular.module("app.appraisals.manageappraisal", []).config(config)

  function config($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider.state("app.manageappraisal", {
      url: "/manageappraisal",
      data: {
        name: "Manage Appraisal",
        role: "manageappraisal"
      },
      views: {
        "content@app": {
          templateUrl:
            "app/main/apps/appraisals/manageappraisal/manageappraisal.html",
          controller: "ManageAppraisalController as vm"
        }
      }
    })

    $translatePartialLoaderProvider.addPart("app/main/apps/appraisals/manageappraisal");
  }
})();

(function() {
  "use strict";

  DeclineAppraisalController.$inject = ["$mdDialog", "selectedMail"];
  angular
    .module("app.appraisals.manageappraisal")
    .controller("DeclineAppraisalController", DeclineAppraisalController)

  /** @ngInject */
  function DeclineAppraisalController($mdDialog, selectedMail) {
    var vm = this;

    // Data
    vm.form = {
      from: "johndoe@creapond.com"
    }

    vm.hiddenCC = true;
    vm.hiddenBCC = true;

    // If replying
    if (angular.isDefined(selectedMail)) {
      vm.form.to = selectedMail.from.email;
      vm.form.subject = "RE: " + selectedMail.subject;
      vm.form.message = "<blockquote>" + selectedMail.message + "</blockquote>";
    }

    // Methods
    vm.closeDialog = closeDialog;

    //////////

    function closeDialog() {
      $mdDialog.hide();
    }
  }
})();

(function() {
  "use strict";

  AcceptAppraisalController.$inject = ["$mdDialog", "selectedMail"];
  angular
    .module("app.appraisals.manageappraisal")
    .controller("AcceptAppraisalController", AcceptAppraisalController)

  /** @ngInject */
  function AcceptAppraisalController($mdDialog, selectedMail) {
    var vm = this;

    // Data
    vm.form = {
      from: "johndoe@creapond.com"
    }

    vm.hiddenCC = true;
    vm.hiddenBCC = true;

    // If replying
    if (angular.isDefined(selectedMail)) {
      vm.form.to = selectedMail.from.email;
      vm.form.subject = "RE: " + selectedMail.subject;
      vm.form.message = "<blockquote>" + selectedMail.message + "</blockquote>";
    }

    // Methods
    vm.closeDialog = closeDialog;

    //////////

    function closeDialog() {
      $mdDialog.hide();
    }
  }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider"];
    angular
        .module('app.settings.register', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider)
    {
        // State
        $stateProvider.state('app.register', {
            url      : '/register',
            data:{
              name:'Registration'
            },
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.register': {
                    templateUrl: 'app/main/apps/settings/register/register.html',
                    controller : 'RegisterController as vm'
                }
            },
            bodyClass: 'register'
        });

        // Translate
        $translatePartialLoaderProvider.addPart('app/main/apps/settings/register');

        // Navigation
        // msNavigationServiceProvider.saveItem('pages.auth.register-v2', {
        //     title : 'Register v2',
        //     state : 'app.pages_auth_register-v2',
        //     weight: 4
        // });
    }

})();

(function (){
    'use strict';

    RegisterController.$inject = ["$http", "$state"];
    angular
        .module('app.settings.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($http, $state){
        // Data
        var vm = this;

        // Methods

        vm.registerUser = function(){
          $http.post("https://murmuring-springs-18419.herokuapp.com/v1/users/register", vm.form).then(function(response){
              $state.go('app.login');
          },function erorFuntion(res){

              console.log(res);
          });
        };
    }
})();

(function(){
    'use strict';

        config.$inject = ["$stateProvider"];
    angular.module('app.settings.passwordchange',[])
        .config(config);

        function config($stateProvider){
            $stateProvider.state('app.passwordchange',{
                url:'/passwordchange',
                data:{
                    name:'Password Change',
                    role:'passwordChange'
                },
                views:{
                    'content@app':{
                        templateUrl:'app/main/apps/settings/passwordchange/passwordchange.html',
                        controller:'PasswordChangeController as vm'
                    }
                }
            });
        }
})();
(function(){
    'use strict';

    angular.module('app.settings.passwordchange').
        controller('PasswordChangeController',["$rootScope", "$mdDialog", "StoreService", function($rootScope,$mdDialog,StoreService){
            var vm = this;
        
            vm.passwordChange = {};

            vm.changePassword = function(){
                
                if(vm.passwordChange.OldPassword!=$rootScope.globals.currentUser.Password){
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .title('Error!!!')
                        .textContent('Old password supplied is wrong')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!'));
                    return;
                }

                vm.passwordChange.Id = $rootScope.globals.currentUser.Id;

                StoreService.UpdateStaffDetail(vm.passwordChange, 'PASSWORD');

                $rootScope.globals.currentUser.Password = vm.passwordChange.Password;
                vm.passwordChange = null;
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .title('success')
                    .textContent('Password Changed successfully')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!'));
            }

        }]).directive('confirmPwd', ["$interpolate", "$parse", function($interpolate, $parse) {
            return {
                require: 'ngModel',
                link: function(scope, elem, attr, ngModelCtrl) {

                    var pwdToMatch = $parse(attr.confirmPwd);
                    var pwdFn = $interpolate(attr.confirmPwd)(scope);

                    scope.$watch(pwdFn, function(newVal) {
                        ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
                    });

                    ngModelCtrl.$validators.password = function(modelValue, viewValue) {
                        var value = modelValue || viewValue;
                        return value == pwdToMatch(scope);
                    };
                }
            }
        }]);
})();
(function (){
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.settings.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider){
        // State
        $stateProvider.state('app.login', {
            url: '/login',
            data:{
                name:'Login'
            },
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.login': {
                    templateUrl: 'app/main/apps/settings/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login'
        });
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/settings/login');
    }
})();

(function() {
    'use strict';

    angular.module("app.settings.login")
      .controller('LoginController', ["$scope", "$rootScope", "$state", "$http", "$cookieStore", "msNavigationService", "$mdDialog", "UtilityService", function($scope, $rootScope, $state,$http,$cookieStore,msNavigationService,$mdDialog,UtilityService) {
        var vm = this;
        $rootScope.globals = $rootScope.globals || {};
        $rootScope.globals.currentUser = $rootScope.globals.currentUser || {};
        localStorage.clear();
        debugger;
        $cookieStore.remove("loggedInUser");
        vm.clear = function() {
            localStorage.clear();
        };

        vm.login = function() {
          $scope.processingRequest = true;
          vm.form = {
            email : vm.username,
            password : vm.password
          };

          $http
          .post("https://murmuring-springs-18419.herokuapp.com/login", vm.form)
          .then(function(response) {
            debugger;
            if (response.data !== "" && response.data != null) {
              $scope.processingRequest = false;
              $http.defaults.headers.common['X-AUTH-TOKEN'] = response.data.token;
              $cookieStore.put("loggedInUser", response.data);
              localStorage.setItem("loggedInUser", JSON.stringify(response.data));
              //log the person in(redirect to dashboard)
              if (response.data.roles!='USER'&&response.data.roles!='LINE_MANAGER') {
                msNavigationService.deleteItem('appraisals.newappraisal');
              }

              if(response.data.roles=='USER'){
                msNavigationService.deleteItem('appraisals.manageappraisal');
              }
              $state.go('app.dashboard');
            }
            else{
              $scope.processingRequest = false;
              UtilityService.showAlert('error!','Invalid Username and or password.','Alert Dialog');

            }
          },function(error){
            $scope.processingRequest = false;
              UtilityService.showAlert('error!','Invalid Username and or password.','Alert Dialog');
          });
        };
    }]);
})();

'use strict';

angular.module('app.settings.login')

.factory('AuthenticationService', ['$cookieStore', '$rootScope', '$mdDialog', '$timeout', 'StoreService', '$location', '$state', 'msNavigationService',
    function($cookieStore, $rootScope, $mdDialog, $timeout, StoreService, $location, $state, msNavigationService) {
        var service = {};

        service.Login = function(username, password, modules) {
            $rootScope.processingRequest = true;
            $rootScope.globals = $rootScope.globals || {};

            $timeout(function() {

                StoreService.VerifyUser(username, password).then(function(data) {
                    if (data.length > 0 && data[0]['StaffMember'] != undefined) {
                        StoreService.GetClientData('TenantId').then(function(tenants) {
                            if (tenants.length < 1) {
                                $location.path('/setup');
                                $state.go('app.setup');
                            } else {
                                data.AllModules = modules;
                                data.TenantId = tenants[0].Value;
                            }
                            if (data[0]['StaffMember'].RoleId) {
                                StoreService.GetAssesibleModules(data[0]['StaffMember'].RoleId).then(function(results) {
                                    data.roles = results.map(function(role) {
                                        var newRoleObj = {};
                                        newRoleObj.Name = role.Name;
                                        newRoleObj.Code = role.Code;
                                        newRoleObj.State = role.State;
                                        newRoleObj.Path = role.Path;
                                        return newRoleObj;
                                    });
                                    service.SetCredentials(data);
                                });
                            } else {
                                service.SetCredentials(data);
                            }
                        });
                    } else {
                        $rootScope.processingRequest = false;
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .title('Error!!!')
                            .textContent('Invalid Username and or password.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!'));
                    }
                });
            });
        };

        service.SetCredentials = function(details) {

        };

        service.ClearCredentials = function(modules, userRoles) {
            delete $rootScope.globals;
            localStorage.removeItem('loggedInUser');
            $cookieStore.remove('loggedInUser');
            $location.path('/login');
        };

        return service;
    }
]);

(function(){
  'use strict';

      config.$inject = ["$stateProvider", "$translatePartialLoaderProvider"];
  angular.module('app.appraisals.newappraisal',[])
      .config(config);

      function config($stateProvider,$translatePartialLoaderProvider){
          $stateProvider.state('app.newappraisal',{
              url:'/newappraisal',
              data:{
                  name:'New Appraisal',
                  role:'newappraisal'
              },
              views:{
                'content@app':{
                    templateUrl:'app/main/apps/appraisals/newappriasal/newappraisal.html',
                    controller:'NewAppraisalController as vm'
                }
              }
          });

          $translatePartialLoaderProvider.addPart('app/main/apps/appraisals/newappriasal');
      }
})();

(function(){
  'use strict';

  angular.module('app.appraisals.newappraisal').
      controller('NewAppraisalController',["AppConstants", "$http", "$scope", "$rootScope", "UtilityService", function(AppConstants,$http,$scope,$rootScope,UtilityService){
          var vm = this;
          vm.responsibilities = [];
          vm.jobsummaries = [];
          vm.objective = {};
          vm.performanceAppraisal = {};
          vm.developmentPlan = [];
          vm.assessment = {};
          vm.profiledata = {};
          vm.lobs = [];
          vm.locations = [];
          $rootScope.processingRequest = false;
          getLineOfBusiness();
          getbusinessLocations();
          function getbusinessLocations(){
            $http.get(AppConstants.baseApiUrl+"util/locations").then(function(locationres){
              vm.locations = locationres.data;
            });
          }
          function getLineOfBusiness(){
            $http.get(AppConstants.baseApiUrl+"util/lob").then(function(lobres){
              vm.lobs = lobres.data;
            });
          }

          vm.currentPosition = {
            plan:"Performance Enhancement (Current Position)"
          };
          vm.futurePosition = {
            plan:"Career Development (Future Positions)"
          };


          vm.foundingPhilosophy = [
            {name:"Our Core",definition:"Your knowledge of our Core Business.",rating:4},
            {name:"Right People",definition:"Your understanding of what we do, your passion for what we do and your capability to do it.",rating:4},
            {name:"Diagnosis",definition:"The degree to which you are consultative in your approach to value creation.",rating:4},
            {name:"Preparation",definition:"The degree to which you engage in rigorous planning and exercising of due diligence with respect to work deliverables.",rating:4},
            {name:"Competence",definition:"The degree to which you demonstrate functional and organisational competence.",rating:4},
            {name:"Work Ethics",definition:"The efforts, commitment and consistency to which you carry out the deliverables.",rating:4},
            {name:"Quality",definition:"The degree to which you consistently go out of your way to deliver top quality solutions, products/services above and beyond what is expected, whatever it takes.",rating:4},
            {name:"Customer Intimacy",definition:"The degree to which you are obsessed with delivering customer value beyond expectation.",rating:4},
            {name:"Follow Through",definition:"Your ability to follow through on projects/deliverables till we get our desired result/outcome.",rating:4}
          ];


          vm.addNewObject = function(type){
            var object = {};
            var currentLength;

            if(type=='jobsummary'){
              currentLength = vm.jobsummaries.length;
              object.id = currentLength+1;
              object.summary = "";
              vm.jobsummaries.push(object);
            }
            else if(type=='responsibility'){
              currentLength = vm.responsibilities.length;
              object.id = currentLength+1;
              object.comment = "";
              vm.responsibilities.push(object);
            }
          };


          vm.removeSelectedObject = function(object,name){
            var index;
            if(name=='responsibility'){
              index = vm.responsibilities.indexOf(object);
              vm.responsibilities.splice(index, 1);
            }
            else if(name=='jobsummary'){
              index = vm.jobsummaries.indexOf(object);
              vm.jobsummaries.splice(index, 1);
            }
          };

          function add(a, b) {
            return a + parseInt(b.rating);
          }

          function successfunction(response){
            $rootScope.processingRequest = false;
          }

          function errorfunction(response){
            console.log(response);
            $rootScope.processingRequest = false;
          }


          vm.sendForm = function(){

            $rootScope.processingRequest = true;
            var sum = vm.foundingPhilosophy.reduce(add, 0);

            var philosophy = {
              creeds:vm.foundingPhilosophy,
              totalRating:sum
            }

            toastr.options = {
              "closeButton": true,
              "debug": false,
              "newestOnTop": false,
              "progressBar": false,
              "positionClass": "toast-top-center",
              "preventDuplicates": false,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": 0,
              "extendedTimeOut": 0,
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut",
              "tapToDismiss": false
            };
            vm.developmentPlan.push(vm.currentPosition);
            vm.developmentPlan.push(vm.futurePosition);


            $http.post(AppConstants.baseApiUrl+"obj",vm.objective).then(function(objresponse){
              console.log(objresponse);
              $rootScope.processingRequest = false;
              $http.post(AppConstants.baseApiUrl+"assessment/summary",vm.jobsummaries).then(function(summaryres){
                console.log(summaryres);

                $http.post(AppConstants.baseApiUrl+"assessment/comment",vm.responsibilities).then(function(responsibilitesres){
                  console.log(responsibilitesres);

                  $http.post(AppConstants.baseApiUrl+"assessment/appraisal",vm.performanceAppraisal).then(function(appraisalres){
                    console.log(appraisalres);

                    $http.post(AppConstants.baseApiUrl+"philosophy",philosophy).then(function(philosophyres){

                      $http.post(AppConstants.baseApiUrl+'philosophy/feedback',{feedBack:vm.feedBack}).then(function(){

                        $http.post(AppConstants.baseApiUrl+"assessment/overall",vm.assessment).then(function(overallres){
                          console.log(overallres);
                          $http.put(AppConstants.baseApiUrl+"users/update-profile",vm.profiledata).then(function(profiledatares){
                            $http.post(AppConstants.baseApiUrl+'plans',vm.developmentPlan).then(function(success){
                              $rootScope.processingRequest = false;
                              UtilityService.showAlert('success!','Appraisal submitted successfully','Alert Dialog');

                            },function(response){
                              console.log(response);
                              $rootScope.processingRequest = false;
                            });
                          },function(response){
                            console.log(response);
                            $rootScope.processingRequest = false;
                          });
                        },function(overallerr){
                          console.log(overallerr);
                          $rootScope.processingRequest = false;
                        });
                      },function(response){
                        console.log(response);
                        $rootScope.processingRequest = false;
                      });
                    },function(response){
                      console.log(response);
                      $rootScope.processingRequest = false;
                    });
                  },function errorfunction(response){
                    console.log(response);
                    $rootScope.processingRequest = false;
                  });
                },function(response){
                  console.log(response);
                  $rootScope.processingRequest = false;
                });
              },function (response){
                console.log(response);
                $rootScope.processingRequest = false;
              });
            },function(response){
              console.log(response);
              $rootScope.processingRequest = false;
            });
          };

      }]);
})();

(function() {
  "use strict";

  angular
    .module("app.appraisals.manageappraisal")
    .controller("ManageAppraisalController", ["$scope", "$mdDialog", "$document", "$http", "AppConstants", "UtilityService", "$rootScope", function(
      $scope,
      $mdDialog,
      $document,
      $http,
      AppConstants,
      UtilityService,
      $rootScope
    ) {
      var vm = this;

      $scope.selected = [];
      $scope.users = [];

      $http
        .get(AppConstants.baseApiUrl + "appraisal/sub")
        .then(function(response) {
          $scope.users = response.data;
        });

      vm.getAppraisalDetails = function(employeeId,ev,templateFile){
        $rootScope.processingRequest = true;
        $http.get(AppConstants.baseApiUrl+'appraisal/'+employeeId.id).then(function(response){

          console.log(response);
         UtilityService.showDialog(ev, templateFile, response.data,'ViewAppraisalController');
        });
      };

    }]).controller('ViewAppraisalController',["dialogData", "$scope", "$mdDialog", "$rootScope", "AppConstants", "UtilityService", "$http", function(dialogData,$scope,$mdDialog,$rootScope,AppConstants,UtilityService,$http){
      var vm = this;
      $scope.review = {};

      $scope.user = dialogData.user;
      $scope.objectives = dialogData.objectives;
      $scope.jobSummary = dialogData.jobSummary;
      $scope.additionalComments = dialogData.additionalComments;
      $scope.performanceAppraisal = dialogData.performanceAppraisal;
      $scope.foundingPhilosophy = dialogData.foundingPhilosophy.creeds;
      $scope.overallAssessment = dialogData.overallAssessment;
      $scope.developmentPlans = dialogData.developmentPlans;
      $scope.clientFeedback = dialogData.clientFeedback;

      $rootScope.processingRequest = false;

      $scope.cancel = function(){
        $mdDialog.cancel();
      };

      $scope.submitReveiw = function(status){
        $scope.processingReveiw = true;
        $scope.review.action = status;
        $http.post(AppConstants.baseApiUrl+"appraisal/"+$scope.user.id+"/appraise",$scope.review).then(function(){
          $$scope.processingReveiw = false;

          UtilityService.showAlert('success!','Appraisal review submitted successfully','Alert Dialog');
        },function(){
          $$scope.processingReveiw = false;
          UtilityService.showAlert('error occured!','error occured','Alert Dialog');

        });
      };
    }]);
})();

(function() {
  'use strict';

  config.$inject = ["$stateProvider", "msNavigationServiceProvider", "$translatePartialLoaderProvider"];
  angular
      .module('app.dashboard', [])
      .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider,$translatePartialLoaderProvider) {
      // Navigation
      msNavigationServiceProvider.saveItem('dashboard', {
          title: 'Dashboard',
          icon: 'icon-dashboard',
          state: 'app.dashboard',
          group: true
         // weight: 1
      });

      $stateProvider.state('app.dashboard', {
          url: '/dashboard',
          data: {
              role: 'dashboard',
              name: 'My Profile'
          },
          views: {
              'content@app': {
                  templateUrl: 'app/main/apps/dashboard/dashboard.html',
                  controller: 'DashboardController as vm'
              }
          }
          // bodyClass: 'emr-patientregistration'
      });

      // Translation
      $translatePartialLoaderProvider.addPart('app/main/apps/dashboard');
  }

})();

(function() {
  'use strict';

    DashboardController.$inject = ["$http", "AppConstants", "$rootScope"];
  angular
      .module('app.dashboard')
      .controller('DashboardController', DashboardController);

    function DashboardController($http,AppConstants,$rootScope){
      var vm = this;
      $rootScope.processingRequest = true;
      $http.get(AppConstants.baseApiUrl + 'users/loggedInUser').then(function(response){
        vm.user = response.data;
        $rootScope.processingRequest = false;
      });
    }

})();



(function ()
{
    'use strict';

    angular
        .module('app.core',
            [
                'ngAnimate',
                'ngAria',
                'ngCookies',
                'ngMessages',
                'ngResource',
                'ngSanitize',
                'ngMaterial',
                'angular-chartist',
                'chart.js',
                'datatables',
                'gridshore.c3js.chart',
                'nvd3',
                'pascalprecht.translate',
                'timer',
                'ui.router',
                // 'uiGmapgoogle-maps',
                'textAngular',
                'ui.sortable',
                'ng-sortable',
                'xeditable',
                'moment-picker'
            ]);
})();

(function ()
{
    'use strict';

    MsWidgetController.$inject = ["$scope", "$element"];
    angular
        .module('app.core')
        .controller('MsWidgetController', MsWidgetController)
        .directive('msWidget', msWidgetDirective)
        .directive('msWidgetFront', msWidgetFrontDirective)
        .directive('msWidgetBack', msWidgetBackDirective);

    /** @ngInject */
    function MsWidgetController($scope, $element)
    {
        var vm = this;

        // Data
        vm.flipped = false;

        // Methods
        vm.flip = flip;

        //////////

        /**
         * Flip the widget
         */
        function flip()
        {
            if ( !isFlippable() )
            {
                return;
            }

            // Toggle flipped status
            vm.flipped = !vm.flipped;

            // Toggle the 'flipped' class
            $element.toggleClass('flipped', vm.flipped);
        }

        /**
         * Check if widget is flippable
         *
         * @returns {boolean}
         */
        function isFlippable()
        {
            return (angular.isDefined($scope.flippable) && $scope.flippable === true);
        }
    }

    /** @ngInject */
    function msWidgetDirective()
    {
        return {
            restrict  : 'E',
            scope     : {
                flippable: '=?'
            },
            controller: 'MsWidgetController',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    //////////
                };
            }
        };
    }

    /** @ngInject */
    function msWidgetFrontDirective()
    {
        return {
            restrict  : 'E',
            require   : '^msWidget',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget-front');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    // Methods
                    scope.flipWidget = MsWidgetCtrl.flip;
                };
            }
        };
    }

    /** @ngInject */
    function msWidgetBackDirective()
    {
        return {
            restrict  : 'E',
            require   : '^msWidget',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget-back');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    // Methods
                    scope.flipWidget = MsWidgetCtrl.flip;
                };
            }
        };
    }

})();
(function ()
{
    'use strict';

    msTimelineItemDirective.$inject = ["$timeout", "$q"];
    angular
        .module('app.core')
        .controller('MsTimelineController', MsTimelineController)
        .directive('msTimeline', msTimelineDirective)
        .directive('msTimelineItem', msTimelineItemDirective);

    /** @ngInject */
    function MsTimelineController()
    {
        var vm = this;

        // Data
        vm.scrollEl = undefined;

        // Methods
        vm.setScrollEl = setScrollEl;
        vm.getScrollEl = getScrollEl;

        //////////

        /**
         * Set scroll element
         *
         * @param scrollEl
         */
        function setScrollEl(scrollEl)
        {
            vm.scrollEl = scrollEl;
        }

        /**
         * Get scroll element
         *
         * @returns {undefined|*}
         */
        function getScrollEl()
        {
            return vm.scrollEl;
        }
    }

    /** @ngInject */
    function msTimelineDirective()
    {
        return {
            scope     : {
                loadMore: '&?msTimelineLoadMore'
            },
            controller: 'MsTimelineController',
            compile   : function (tElement)
            {
                tElement.addClass('ms-timeline');

                return function postLink(scope, iElement, iAttrs, MsTimelineCtrl)
                {
                    // Create an element for triggering the load more action and append it
                    var loadMoreEl = angular.element('<div class="ms-timeline-loader md-accent-bg md-whiteframe-4dp"><span class="spinner animate-rotate"></span></div>');
                    iElement.append(loadMoreEl);

                    // Grab the scrollable element and store it in the controller for general use
                    var scrollEl = angular.element('#content');
                    MsTimelineCtrl.setScrollEl(scrollEl);

                    // Threshold
                    var threshold = 144;

                    // Register onScroll event for the first time
                    registerOnScroll();

                    /**
                     * onScroll Event
                     */
                    function onScroll()
                    {
                        if ( scrollEl.scrollTop() + scrollEl.height() + threshold > loadMoreEl.position().top )
                        {
                            // Show the loader
                            loadMoreEl.addClass('show');

                            // Unregister scroll event to prevent triggering the function over and over again
                            unregisterOnScroll();

                            // Trigger load more event
                            scope.loadMore().then(
                                // Success
                                function ()
                                {
                                    // Hide the loader
                                    loadMoreEl.removeClass('show');

                                    // Register the onScroll event again
                                    registerOnScroll();
                                },

                                // Error
                                function ()
                                {
                                    // Remove the loader completely
                                    loadMoreEl.remove();
                                }
                            );
                        }
                    }

                    /**
                     * onScroll event registerer
                     */
                    function registerOnScroll()
                    {
                        scrollEl.on('scroll', onScroll);
                    }

                    /**
                     * onScroll event unregisterer
                     */
                    function unregisterOnScroll()
                    {
                        scrollEl.off('scroll', onScroll);
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        unregisterOnScroll();
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msTimelineItemDirective($timeout, $q)
    {
        return {
            scope  : true,
            require: '^msTimeline',
            compile: function (tElement)
            {
                tElement.addClass('ms-timeline-item').addClass('hidden');

                return function postLink(scope, iElement, iAttrs, MsTimelineCtrl)
                {
                    var threshold = 72,
                        itemLoaded = false,
                        itemInViewport = false,
                        scrollEl = MsTimelineCtrl.getScrollEl();

                    //////////

                    init();

                    /**
                     * Initialize
                     */
                    function init()
                    {
                        // Check if the timeline item has ms-card
                        if ( iElement.find('ms-card') )
                        {
                            // If the ms-card template loaded...
                            scope.$on('msCard::cardTemplateLoaded', function (event, args)
                            {
                                var cardEl = angular.element(args[0]);

                                // Test the card to see if there is any image on it
                                testForImage(cardEl).then(function ()
                                {
                                    $timeout(function ()
                                    {
                                        itemLoaded = true;
                                    });
                                });
                            });
                        }
                        else
                        {
                            // Test the element to see if there is any image on it
                            testForImage(iElement).then(function ()
                            {
                                $timeout(function ()
                                {
                                    itemLoaded = true;
                                });
                            });
                        }

                        // Check if the loaded element also in the viewport
                        scrollEl.on('scroll', testForVisibility);

                        // Test for visibility for the first time without waiting for the scroll event
                        testForVisibility();
                    }

                    // Item ready watcher
                    var itemReadyWatcher = scope.$watch(
                        function ()
                        {
                            return itemLoaded && itemInViewport;
                        },
                        function (current, old)
                        {
                            if ( angular.equals(current, old) )
                            {
                                return;
                            }

                            if ( current )
                            {
                                iElement.removeClass('hidden').addClass('animate');

                                // Unbind itemReadyWatcher
                                itemReadyWatcher();
                            }
                        }, true);

                    /**
                     * Test the given element for image
                     *
                     * @param element
                     * @returns promise
                     */
                    function testForImage(element)
                    {
                        var deferred = $q.defer(),
                            imgEl = element.find('img');

                        if ( imgEl.length > 0 )
                        {
                            imgEl.on('load', function ()
                            {
                                deferred.resolve('Image is loaded');
                            });
                        }
                        else
                        {
                            deferred.resolve('No images');
                        }

                        return deferred.promise;
                    }

                    /**
                     * Test the element for visibility
                     */
                    function testForVisibility()
                    {
                        if ( scrollEl.scrollTop() + scrollEl.height() > iElement.position().top + threshold )
                        {
                            $timeout(function ()
                            {
                                itemInViewport = true;
                            });

                            // Unbind the scroll event
                            scrollEl.off('scroll', testForVisibility);
                        }
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    MsStepperController.$inject = ["$timeout"];
    angular
        .module('app.core')
        .controller('MsStepperController', MsStepperController)
        .directive('msStepper', msStepperDirective)
        .directive('msStepperStep', msStepperStepDirective);

    /** @ngInject */
    function MsStepperController($timeout)
    {
        var vm = this;

        // Data
        vm.mainForm = undefined;

        vm.steps = [];
        vm.currentStep = undefined;
        vm.currentStepNumber = 1;

        // Methods
        vm.registerMainForm = registerMainForm;
        vm.registerStep = registerStep;
        vm.setupSteps = setupSteps;
        vm.resetForm = resetForm;

        vm.setCurrentStep = setCurrentStep;

        vm.gotoStep = gotoStep;
        vm.gotoPreviousStep = gotoPreviousStep;
        vm.gotoNextStep = gotoNextStep;
        vm.gotoFirstStep = gotoFirstStep;
        vm.gotoLastStep = gotoLastStep;

        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;

        vm.isStepCurrent = isStepCurrent;
        vm.isStepDisabled = isStepDisabled;
        vm.isStepOptional = isStepOptional;
        vm.isStepValid = isStepValid;
        vm.isStepNumberValid = isStepNumberValid;

        vm.isFormValid = isFormValid;

        //////////

        /**
         * Register the main form
         *
         * @param form
         */
        function registerMainForm(form)
        {
            vm.mainForm = form;
        }

        /**
         * Register a step
         *
         * @param element
         * @param scope
         * @param form
         */
        function registerStep(element, scope, form)
        {
            var step = {
                element   : element,
                scope     : scope,
                form      : form,
                stepNumber: scope.step || (vm.steps.length + 1),
                stepTitle : scope.stepTitle
            };

            // Push the step into steps array
            vm.steps.push(step);

            // Sort steps by stepNumber
            vm.steps.sort(function (a, b)
            {
                return a.stepNumber - b.stepNumber;
            });
        }

        /**
         * Setup steps for the first time
         */
        function setupSteps()
        {
            vm.setCurrentStep(vm.currentStepNumber);
        }

        /**
         * Reset steps and the main form
         */
        function resetForm()
        {
            // Timeout is required here because we need to
            // let form model to reset before setting the
            // statuses
            $timeout(function ()
            {
                // Reset all the steps
                for ( var x = 0; x < vm.steps.length; x++ )
                {
                    vm.steps[x].form.$setPristine();
                    vm.steps[x].form.$setUntouched();
                }

                // Reset the main form
                vm.mainForm.$setPristine();
                vm.mainForm.$setUntouched();

                // Go to first step
                gotoFirstStep();
            })
        }

        /**
         * Set current step
         *
         * @param stepNumber
         */
        function setCurrentStep(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return;
            }

            // Update the current step number
            vm.currentStepNumber = stepNumber;

            // Hide all steps
            for ( var i = 0; i < vm.steps.length; i++ )
            {
                vm.steps[i].element.hide();
            }

            // Show the current step
            vm.steps[vm.currentStepNumber - 1].element.show();
        }

        /**
         * Go to a step
         *
         * @param stepNumber
         */
        function gotoStep(stepNumber)
        {
            vm.setCurrentStep(stepNumber);
        }

        /**
         * Go to the previous step
         */
        function gotoPreviousStep()
        {
            vm.setCurrentStep(vm.currentStepNumber - 1);
        }

        /**
         * Go to the next step
         */
        function gotoNextStep()
        {
            vm.setCurrentStep(vm.currentStepNumber + 1);
        }

        /**
         * Go to the first step
         */
        function gotoFirstStep()
        {
            vm.setCurrentStep(1);
        }

        /**
         * Go to the last step
         */
        function gotoLastStep()
        {
            vm.setCurrentStep(vm.steps.length);
        }

        /**
         * Check if the current step is the first step
         *
         * @returns {boolean}
         */
        function isFirstStep()
        {
            return vm.currentStepNumber === 1;
        }

        /**
         * Check if the current step is the last step
         *
         * @returns {boolean}
         */
        function isLastStep()
        {
            return vm.currentStepNumber === vm.steps.length;
        }

        /**
         * Check if the given step is the current one
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepCurrent(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            return vm.currentStepNumber === stepNumber;
        }

        /**
         * Check if the given step should be disabled
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepDisabled(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            var disabled = false;

            for ( var i = 1; i < stepNumber; i++ )
            {
                if ( !isStepValid(i) )
                {
                    disabled = true;
                    break;
                }
            }

            return disabled;
        }

        /**
         * Check if the given step is optional
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepOptional(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            return vm.steps[stepNumber - 1].scope.optionalStep;
        }

        /**
         * Check if the given step is valid
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepValid(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            // If the step is optional, always return true
            if ( isStepOptional(stepNumber) )
            {
                return true;
            }

            return vm.steps[stepNumber - 1].form.$valid;
        }

        /**
         * Check if the given step number is a valid step number
         *
         * @param stepNumber
         * @returns {boolean}
         */
        function isStepNumberValid(stepNumber)
        {
            return !(stepNumber < 1 || stepNumber > vm.steps.length);
        }

        /**
         * Check if the entire form is valid
         *
         * @returns {boolean}
         */
        function isFormValid()
        {
            return vm.mainForm.$valid;
        }
    }

    /** @ngInject */
    function msStepperDirective()
    {
        return {
            restrict        : 'A',
            require         : ['form', 'msStepper'],
            priority        : 1001,
            controller      : 'MsStepperController as MsStepper',
            bindToController: {
                model: '=ngModel'
            },
            transclude      : true,
            templateUrl     : 'app/core/directives/ms-stepper/templates/horizontal/horizontal.html',
            compile         : function (tElement)
            {
                tElement.addClass('ms-stepper');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var FormCtrl = ctrls[0],
                        MsStepperCtrl = ctrls[1];

                    // Register the main form and setup
                    // the steps for the first time
                    MsStepperCtrl.registerMainForm(FormCtrl);
                    MsStepperCtrl.setupSteps();
                };
            }
        }
    }

    /** @ngInject */
    function msStepperStepDirective()
    {
        return {
            restrict: 'E',
            require : ['form', '^msStepper'],
            priority: 1000,
            scope   : {
                step        : '=?',
                stepTitle   : '=?',
                optionalStep: '=?'
            },
            compile : function (tElement)
            {
                tElement.addClass('ms-stepper-step');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var FormCtrl = ctrls[0],
                        MsStepperCtrl = ctrls[1];

                    // Is it an optional step?
                    scope.optionalStep = angular.isDefined(iAttrs.optionalStep);

                    // Register the step
                    MsStepperCtrl.registerStep(iElement, scope, FormCtrl);

                    // Hide the step by default
                    iElement.hide();
                };
            }
        }
    }
})();
(function ()
{
    'use strict';

    msSplashScreenDirective.$inject = ["$animate"];
    angular
        .module('app.core')
        .directive('msSplashScreen', msSplashScreenDirective);

    /** @ngInject */
    function msSplashScreenDirective($animate)
    {
        return {
            restrict: 'E',
            link    : function (scope, iElement)
            {
                var splashScreenRemoveEvent = scope.$on('msSplashScreen::remove', function ()
                {
                    $animate.leave(iElement).then(function ()
                    {
                        // De-register scope event
                        splashScreenRemoveEvent();

                        // Null-ify everything else
                        scope = iElement = null;
                    });
                });
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msSidenavHelper', msSidenavHelperDirective);

    /** @ngInject */
    function msSidenavHelperDirective()
    {
        return {
            restrict: 'A',
            require : '^mdSidenav',
            link    : function (scope, iElement, iAttrs, MdSidenavCtrl)
            {
                // Watch md-sidenav open & locked open statuses
                // and add class to the ".page-layout" if only
                // the sidenav open and NOT locked open
                scope.$watch(function ()
                {
                    return MdSidenavCtrl.isOpen() && !MdSidenavCtrl.isLockedOpen();
                }, function (current)
                {
                    if ( angular.isUndefined(current) )
                    {
                        return;
                    }

                    iElement.parent().toggleClass('full-height', current);
                    angular.element('html').toggleClass('sidenav-open', current);
                });
            }
        };
    }
})();

(function ()
{
    'use strict';

    msSearchBarDirective.$inject = ["$document"];
    angular
        .module('app.core')
        .directive('msSearchBar', msSearchBarDirective);

    /** @ngInject */
    function msSearchBarDirective($document)
    {
        return {
            restrict   : 'E',
            scope      : true,
            templateUrl: 'app/core/directives/ms-search-bar/ms-search-bar.html',
            compile    : function (tElement)
            {
                // Add class
                tElement.addClass('ms-search-bar');

                return function postLink(scope, iElement)
                {
                    var expanderEl,
                        collapserEl;

                    // Initialize
                    init();

                    function init()
                    {
                        expanderEl = iElement.find('#ms-search-bar-expander');
                        collapserEl = iElement.find('#ms-search-bar-collapser');

                        expanderEl.on('click', expand);
                        collapserEl.on('click', collapse);
                    }

                    /**
                     * Expand
                     */
                    function expand()
                    {
                        iElement.addClass('expanded');

                        // Esc key event
                        $document.on('keyup', escKeyEvent);
                    }

                    /**
                     * Collapse
                     */
                    function collapse()
                    {
                        iElement.removeClass('expanded');
                    }

                    /**
                     * Escape key event
                     *
                     * @param e
                     */
                    function escKeyEvent(e)
                    {
                        if ( e.keyCode === 27 )
                        {
                            collapse();
                            $document.off('keyup', escKeyEvent);
                        }
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msScrollDirective.$inject = ["$timeout", "msScrollConfig", "msUtils", "fuseConfig"];
    angular
        .module('app.core')
        .provider('msScrollConfig', msScrollConfigProvider)
        .directive('msScroll', msScrollDirective);

    /** @ngInject */
    function msScrollConfigProvider()
    {
        // Default configuration
        var defaultConfiguration = {
            wheelSpeed            : 1,
            wheelPropagation      : false,
            swipePropagation      : true,
            minScrollbarLength    : null,
            maxScrollbarLength    : null,
            useBothWheelAxes      : false,
            useKeyboard           : true,
            suppressScrollX       : false,
            suppressScrollY       : false,
            scrollXMarginOffset   : 0,
            scrollYMarginOffset   : 0,
            stopPropagationOnClick: true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            defaultConfiguration = angular.extend({}, defaultConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig
            };

            return service;

            //////////

            /**
             * Return the config
             */
            function getConfig()
            {
                return defaultConfiguration;
            }
        };
    }

    /** @ngInject */
    function msScrollDirective($timeout, msScrollConfig, msUtils, fuseConfig)
    {
        return {
            restrict: 'AE',
            compile : function (tElement)
            {
                // Do not replace scrollbars if
                // 'disableCustomScrollbars' config enabled
                if ( fuseConfig.getConfig('disableCustomScrollbars') )
                {
                    return;
                }

                // Do not replace scrollbars on mobile devices
                // if 'disableCustomScrollbarsOnMobile' config enabled
                if ( fuseConfig.getConfig('disableCustomScrollbarsOnMobile') && msUtils.isMobile() )
                {
                    return;
                }

                // Add class
                tElement.addClass('ms-scroll');

                return function postLink(scope, iElement, iAttrs)
                {
                    var options = {};

                    // If options supplied, evaluate the given
                    // value. This is because we don't want to
                    // have an isolated scope but still be able
                    // to use scope variables.
                    // We don't want an isolated scope because
                    // we should be able to use this everywhere
                    // especially with other directives
                    if ( iAttrs.msScroll )
                    {
                        options = scope.$eval(iAttrs.msScroll);
                    }

                    // Extend the given config with the ones from provider
                    options = angular.extend({}, msScrollConfig.getConfig(), options);

                    // Initialize the scrollbar
                    $timeout(function ()
                    {
                        PerfectScrollbar.initialize(iElement[0], options);
                    }, 0);

                    // Update the scrollbar on element mouseenter
                    iElement.on('mouseenter', updateScrollbar);

                    // Watch scrollHeight and update
                    // the scrollbar if it changes
                    scope.$watch(function ()
                    {
                        return iElement.prop('scrollHeight');
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        updateScrollbar();
                    });

                    // Watch scrollWidth and update
                    // the scrollbar if it changes
                    scope.$watch(function ()
                    {
                        return iElement.prop('scrollWidth');
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        updateScrollbar();
                    });

                    /**
                     * Update the scrollbar
                     */
                    function updateScrollbar()
                    {
                        PerfectScrollbar.update(iElement[0]);
                    }

                    // Cleanup on destroy
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('mouseenter');
                        PerfectScrollbar.destroy(iElement[0]);
                    });
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msResponsiveTable', msResponsiveTableDirective);

    /** @ngInject */
    function msResponsiveTableDirective()
    {
        return {
            restrict: 'A',
            link    : function (scope, iElement)
            {
                // Wrap the table
                var wrapper = angular.element('<div class="ms-responsive-table-wrapper"></div>');
                iElement.after(wrapper);
                wrapper.append(iElement);

                //////////
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msRandomClass', msRandomClassDirective);

    /** @ngInject */
    function msRandomClassDirective()
    {
        return {
            restrict: 'A',
            scope   : {
                msRandomClass: '='
            },
            link    : function (scope, iElement)
            {
                var randomClass = scope.msRandomClass[Math.floor(Math.random() * (scope.msRandomClass.length))];
                iElement.addClass(randomClass);
            }
        };
    }
})();
(function ()
{
    'use strict';

        config.$inject = ["$translatePartialLoaderProvider"];
    MsNavigationController.$inject = ["$scope", "msNavigationService"];
    msNavigationDirective.$inject = ["$rootScope", "$timeout", "$mdSidenav", "msNavigationService"];
    MsNavigationNodeController.$inject = ["$scope", "$element", "$rootScope", "$animate", "$state", "msNavigationService"];
    msNavigationHorizontalDirective.$inject = ["msNavigationService"];
    MsNavigationHorizontalNodeController.$inject = ["$scope", "$element", "$rootScope", "$state", "msNavigationService"];
    msNavigationHorizontalItemDirective.$inject = ["$mdMedia"];
    angular
        .module('app.core')
        .provider('msNavigationService', msNavigationServiceProvider)
        .controller('MsNavigationController', MsNavigationController)
        // Vertical
        .directive('msNavigation', msNavigationDirective)
        .controller('MsNavigationNodeController', MsNavigationNodeController)
        .directive('msNavigationNode', msNavigationNodeDirective)
        .directive('msNavigationItem', msNavigationItemDirective)
        //Horizontal
        .directive('msNavigationHorizontal', msNavigationHorizontalDirective)
        .controller('MsNavigationHorizontalNodeController', MsNavigationHorizontalNodeController)
        .directive('msNavigationHorizontalNode', msNavigationHorizontalNodeDirective)
        .directive('msNavigationHorizontalItem', msNavigationHorizontalItemDirective)
        .config(config);
        /** @ngInject */
        function config($translatePartialLoaderProvider)
        {
            $translatePartialLoaderProvider.addPart('app/toolbar');
        }

    /** @ngInject */
    function msNavigationServiceProvider()
    {
        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        // Navigation array
        var navigation = [];

        var service = this;

        // Methods
        service.saveItem = saveItem;
        service.deleteItem = deleteItem;
        service.sortByWeight = sortByWeight;

        //////////

        /**
         * Create or update the navigation item
         *
         * @param path
         * @param item
         */
        function saveItem(path, item)
        {
            if ( !angular.isString(path) )
            {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            var parts = path.split('.');

            // Generate the object id from the parts
            var id = parts[parts.length - 1];

            // Get the parent item from the parts
            var parent = _findOrCreateParent(parts);

            // Decide if we are going to update or create
            var updateItem = false;

            for ( var i = 0; i < parent.length; i++ )
            {
                if ( parent[i]._id === id )
                {
                    updateItem = parent[i];

                    break;
                }
            }

            // Update
            if ( updateItem )
            {
                angular.extend(updateItem, item);

                // Add proper ui-sref
                updateItem.uisref = _getUiSref(updateItem);
            }
            // Create
            else
            {
                // Create an empty children array in the item
                item.children = [];

                // Add the default weight if not provided or if it's not a number
                if ( angular.isUndefined(item.weight) || !angular.isNumber(item.weight) )
                {
                    item.weight = 1;
                }

                // Add the item id
                item._id = id;

                // Add the item path
                item._path = path;

                // Add proper ui-sref
                item.uisref = _getUiSref(item);

                // Push the item into the array
                parent.push(item);
            }
        }

        /**
         * Delete navigation item
         *
         * @param path
         */
        function deleteItem(path)
        {
            if ( !angular.isString(path) )
            {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            // Locate the item by using given path
            var item = navigation,
                parts = path.split('.');

            for ( var p = 0; p < parts.length; p++ )
            {
                var id = parts[p];

                for ( var i = 0; i < item.length; i++ )
                {
                    if ( item[i]._id === id )
                    {
                        // If we have a matching path,
                        // we have found our object:
                        // remove it.
                        if ( item[i]._path === path )
                        {
                            item.splice(i, 1);
                            return true;
                        }

                        // Otherwise grab the children of
                        // the current item and continue
                        item = item[i].children;
                        break;
                    }
                }
            }

            return false;
        }

        /**
         * Sort the navigation items by their weights
         *
         * @param parent
         */
        function sortByWeight(parent)
        {
            // If parent not provided, sort the root items
            if ( !parent )
            {
                parent = navigation;
                parent.sort(_byWeight);
            }

            // Sort the children
            for ( var i = 0; i < parent.length; i++ )
            {
                var children = parent[i].children;

                if ( children.length > 1 )
                {
                    children.sort(_byWeight);
                }

                if ( children.length > 0 )
                {
                    sortByWeight(children);
                }
            }
        }

        /* ----------------- */
        /* Private Functions */
        /* ----------------- */

        /**
         * Find or create parent
         *
         * @param parts
         * @returns {Array|Boolean}
         * @private
         */
        function _findOrCreateParent(parts)
        {
            // Store the main navigation
            var parent = navigation;

            // If it's going to be a root item
            // return the navigation itself
            if ( parts.length === 1 )
            {
                return parent;
            }

            // Remove the last element from the parts as
            // we don't need that to figure out the parent
            parts.pop();

            // Find and return the parent
            for ( var i = 0; i < parts.length; i++ )
            {
                var _id = parts[i],
                    createParent = true;

                for ( var p = 0; p < parent.length; p++ )
                {
                    if ( parent[p]._id === _id )
                    {
                        parent = parent[p].children;
                        createParent = false;

                        break;
                    }
                }

                // If there is no parent found, create one, push
                // it into the current parent and assign it as a
                // new parent
                if ( createParent )
                {
                    var item = {
                        _id     : _id,
                        _path   : parts.join('.'),
                        title   : _id,
                        weight  : 1,
                        children: []
                    };

                    parent.push(item);
                    parent = item.children;
                }
            }

            return parent;
        }

        /**
         * Sort by weight
         *
         * @param x
         * @param y
         * @returns {number}
         * @private
         */
        function _byWeight(x, y)
        {
            return parseInt(x.weight) - parseInt(y.weight);
        }

        /**
         * Setup the ui-sref using state & state parameters
         *
         * @param item
         * @returns {string}
         * @private
         */
        function _getUiSref(item)
        {
            var uisref = '';

            if ( angular.isDefined(item.state) )
            {
                uisref = item.state;

                if ( angular.isDefined(item.stateParams) && angular.isObject(item.stateParams) )
                {
                    uisref = uisref + '(' + angular.toJson(item.stateParams) + ')';
                }
            }

            return uisref;
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */

        this.$get = function ()
        {
            var activeItem = null,
                navigationScope = null,
                folded = null,
                foldedOpen = null;

            var service = {
                saveItem           : saveItem,
                deleteItem         : deleteItem,
                sort               : sortByWeight,
                clearNavigation    : clearNavigation,
                setActiveItem      : setActiveItem,
                getActiveItem      : getActiveItem,
                getNavigationObject: getNavigationObject,
                setNavigationScope : setNavigationScope,
                setFolded          : setFolded,
                getFolded          : getFolded,
                setFoldedOpen      : setFoldedOpen,
                getFoldedOpen      : getFoldedOpen,
                toggleFolded       : toggleFolded
            };

            return service;

            //////////

            /**
             * Clear the entire navigation
             */
            function clearNavigation()
            {
                // Clear the navigation array
                navigation = [];

                // Clear the vm.navigation from main controller
                if ( navigationScope )
                {
                    navigationScope.vm.navigation = [];
                }
            }

            /**
             * Set active item
             *
             * @param node
             * @param scope
             */
            function setActiveItem(node, scope)
            {
                activeItem = {
                    node : node,
                    scope: scope
                };
            }

            /**
             * Return active item
             */
            function getActiveItem()
            {
                return activeItem;
            }

            /**
             * Return navigation object
             *
             * @param root
             * @returns {Array}
             */
            function getNavigationObject(root)
            {
                if ( root )
                {
                    for ( var i = 0; i < navigation.length; i++ )
                    {
                        if ( navigation[i]._id === root )
                        {
                            return [navigation[i]];
                        }
                    }
                }

                return navigation;
            }

            /**
             * Store navigation's scope for later use
             *
             * @param scope
             */
            function setNavigationScope(scope)
            {
                navigationScope = scope;
            }

            /**
             * Set folded status
             *
             * @param status
             */
            function setFolded(status)
            {
                folded = status;
            }

            /**
             * Return folded status
             *
             * @returns {*}
             */
            function getFolded()
            {
                return folded;
            }

            /**
             * Set folded open status
             *
             * @param status
             */
            function setFoldedOpen(status)
            {
                foldedOpen = status;
            }

            /**
             * Return folded open status
             *
             * @returns {*}
             */
            function getFoldedOpen()
            {
                return foldedOpen;
            }


            /**
             * Toggle fold on stored navigation's scope
             */
            function toggleFolded()
            {
                navigationScope.toggleFolded();
            }
        };
    }

    /** @ngInject */
    function MsNavigationController($scope, msNavigationService)
    {
        var vm = this;

        // Data
        if ( $scope.root )
        {
            vm.navigation = msNavigationService.getNavigationObject($scope.root);
        }
        else
        {

            vm.navigation = msNavigationService.getNavigationObject();
        }

        // Methods
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Sort the navigation before doing anything else
            msNavigationService.sort();
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            angular.element('body').toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

    /** @ngInject */
    function msNavigationDirective($rootScope, $timeout, $mdSidenav, msNavigationService)
    {
        return {
            restrict   : 'E',
            scope      : {
                folded: '=',
                root  : '@'
            },
            controller : 'MsNavigationController as vm',
            templateUrl: 'app/core/directives/ms-navigation/templates/vertical.html',
            transclude : true,
            compile    : function (tElement)
            {
                tElement.addClass('ms-navigation');

                return function postLink(scope, iElement)
                {
                    var bodyEl = angular.element('body'),
                        foldExpanderEl = angular.element('<div id="ms-navigation-fold-expander"></div>'),
                        foldCollapserEl = angular.element('<div id="ms-navigation-fold-collapser"></div>'),
                        sidenav = $mdSidenav('navigation');

                    // Store the navigation in the service for public access
                    msNavigationService.setNavigationScope(scope);

                    // Initialize
                    init();

                    /**
                     * Initialize
                     */
                    function init()
                    {
                        // Set the folded status for the first time.
                        // First, we have to check if we have a folded
                        // status available in the service already. This
                        // will prevent navigation to act weird if we already
                        // set the fold status, remove the navigation and
                        // then re-initialize it, which happens if we
                        // change to a view without a navigation and then
                        // come back with history.back() function.

                        // If the service didn't initialize before, set
                        // the folded status from scope, otherwise we
                        // won't touch anything because the folded status
                        // already set in the service...
                        if ( msNavigationService.getFolded() === null )
                        {
                            msNavigationService.setFolded(scope.folded);
                        }

                        if ( msNavigationService.getFolded() )
                        {
                            // Collapse everything.
                            // This must be inside a $timeout because by the
                            // time we call this, the 'msNavigation::collapse'
                            // event listener is not registered yet. $timeout
                            // will ensure that it will be called after it is
                            // registered.
                            $timeout(function ()
                            {
                                $rootScope.$broadcast('msNavigation::collapse');
                            });

                            // Add class to the body
                            bodyEl.addClass('ms-navigation-folded');

                            // Set fold expander
                            setFoldExpander();
                        }
                    }

                    // Sidenav locked open status watcher
                    scope.$watch(function ()
                    {
                        return sidenav.isLockedOpen();
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        var folded = msNavigationService.getFolded();

                        if ( folded )
                        {
                            if ( current )
                            {
                                // Collapse everything
                                $rootScope.$broadcast('msNavigation::collapse');
                            }
                            else
                            {
                                // Expand the active one and its parents
                                var activeItem = msNavigationService.getActiveItem();
                                if ( activeItem )
                                {
                                    activeItem.scope.$emit('msNavigation::stateMatched');
                                }
                            }
                        }
                    });

                    // Folded status watcher
                    scope.$watch('folded', function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        setFolded(current);
                    });

                    /**
                     * Set folded status
                     *
                     * @param folded
                     */
                    function setFolded(folded)
                    {
                        // Store folded status on the service for global access
                        msNavigationService.setFolded(folded);

                        if ( folded )
                        {
                            // Collapse everything
                            $rootScope.$broadcast('msNavigation::collapse');

                            // Add class to the body
                            bodyEl.addClass('ms-navigation-folded');

                            // Set fold expander
                            setFoldExpander();
                        }
                        else
                        {
                            // Expand the active one and its parents
                            var activeItem = msNavigationService.getActiveItem();
                            if ( activeItem )
                            {
                                activeItem.scope.$emit('msNavigation::stateMatched');
                            }

                            // Remove body class
                            bodyEl.removeClass('ms-navigation-folded ms-navigation-folded-open');

                            // Remove fold collapser
                            removeFoldCollapser();
                        }
                    }

                    /**
                     * Set fold expander
                     */
                    function setFoldExpander()
                    {
                        iElement.parent().append(foldExpanderEl);

                        // Let everything settle for a moment
                        // before registering the event listener
                        $timeout(function ()
                        {
                            foldExpanderEl.on('mouseenter touchstart', onFoldExpanderHover);
                        });
                    }

                    /**
                     * Set fold collapser
                     */
                    function setFoldCollapser()
                    {
                        bodyEl.find('#main').append(foldCollapserEl);
                        foldCollapserEl.on('mouseenter touchstart', onFoldCollapserHover);
                    }

                    /**
                     * Remove fold collapser
                     */
                    function removeFoldCollapser()
                    {
                        foldCollapserEl.remove();
                    }

                    /**
                     * onHover event of foldExpander
                     */
                    function onFoldExpanderHover(event)
                    {
                        if ( event )
                        {
                            event.preventDefault();
                        }

                        // Set folded open status
                        msNavigationService.setFoldedOpen(true);

                        // Expand the active one and its parents
                        var activeItem = msNavigationService.getActiveItem();
                        if ( activeItem )
                        {
                            activeItem.scope.$emit('msNavigation::stateMatched');
                        }

                        // Add class to the body
                        bodyEl.addClass('ms-navigation-folded-open');

                        // Remove the fold opener
                        foldExpanderEl.remove();

                        // Set fold collapser
                        setFoldCollapser();
                    }

                    /**
                     * onHover event of foldCollapser
                     */
                    function onFoldCollapserHover(event)
                    {
                        if ( event )
                        {
                            event.preventDefault();
                        }

                        // Set folded open status
                        msNavigationService.setFoldedOpen(false);

                        // Collapse everything
                        $rootScope.$broadcast('msNavigation::collapse');

                        // Remove body class
                        bodyEl.removeClass('ms-navigation-folded-open');

                        // Remove the fold collapser
                        foldCollapserEl.remove();

                        // Set fold expander
                        setFoldExpander();
                    }

                    /**
                     * Public access for toggling folded status externally
                     */
                    scope.toggleFolded = function ()
                    {
                        var folded = msNavigationService.getFolded();

                        setFolded(!folded);
                    };

                    /**
                     * On $stateChangeStart
                     */
                    scope.$on('$stateChangeStart', function ()
                    {
                        // Close the sidenav
                        sidenav.close();

                        // If navigation is folded open, close it
                        if ( msNavigationService.getFolded() )
                        {
                            onFoldCollapserHover();
                        }
                    });

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        foldCollapserEl.off('mouseenter touchstart');
                        foldExpanderEl.off('mouseenter touchstart');
                    });
                };
            }
        };
    }

    /** @ngInject */
    function MsNavigationNodeController($scope, $element, $rootScope, $animate, $state, msNavigationService)
    {
        var vm = this;

        // Data
        vm.element = $element;
        vm.node = $scope.node;
        vm.hasChildren = undefined;
        vm.collapsed = undefined;
        vm.collapsable = undefined;
        vm.group = undefined;
        vm.animateHeightClass = 'animate-height';

        // Methods
        vm.toggleCollapsed = toggleCollapsed;
        vm.collapse = collapse;
        vm.expand = expand;
        vm.getClass = getClass;
        vm.isHidden = isHidden;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Setup the initial values

            // Has children?
            vm.hasChildren = vm.node.children.length > 0;

            // Is group?
            vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

            // Is collapsable?
            if ( !vm.hasChildren || vm.group )
            {
                vm.collapsable = false;
            }
            else
            {
                vm.collapsable = !!(angular.isUndefined(vm.node.collapsable) || typeof vm.node.collapsable !== 'boolean' || vm.node.collapsable === true);
            }

            // Is collapsed?
            if ( !vm.collapsable )
            {
                vm.collapsed = false;
            }
            else
            {
                vm.collapsed = !!(angular.isUndefined(vm.node.collapsed) || typeof vm.node.collapsed !== 'boolean' || vm.node.collapsed === true);
            }

            // Expand all parents if we have a matching state or
            // the current state is a child of the node's state
            if ( vm.node.state === $state.current.name || $state.includes(vm.node.state) )
            {
                // If state params are defined, make sure they are
                // equal, otherwise do not set the active item
                if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                {
                    return;
                }

                $scope.$emit('msNavigation::stateMatched');

                // Also store the current active menu item
                msNavigationService.setActiveItem(vm.node, $scope);
            }

            $scope.$on('msNavigation::stateMatched', function ()
            {
                // Expand if the current scope is collapsable and is collapsed
                if ( vm.collapsable && vm.collapsed )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.collapsed = false;
                    });
                }
            });

            // Listen for collapse event
            $scope.$on('msNavigation::collapse', function (event, path)
            {
                if ( vm.collapsed || !vm.collapsable )
                {
                    return;
                }

                // If there is no path defined, collapse
                if ( angular.isUndefined(path) )
                {
                    vm.collapse();
                }
                // If there is a path defined, do not collapse
                // the items that are inside that path. This will
                // prevent parent items from collapsing
                else
                {
                    var givenPathParts = path.split('.'),
                        activePathParts = [];

                    var activeItem = msNavigationService.getActiveItem();
                    if ( activeItem )
                    {
                        activePathParts = activeItem.node._path.split('.');
                    }

                    // Test for given path
                    if ( givenPathParts.indexOf(vm.node._id) > -1 )
                    {
                        return;
                    }

                    // Test for active path
                    if ( activePathParts.indexOf(vm.node._id) > -1 )
                    {
                        return;
                    }

                    vm.collapse();
                }
            });

            // Listen for $stateChangeSuccess event
            $scope.$on('$stateChangeSuccess', function ()
            {
                if ( vm.node.state === $state.current.name )
                {
                    // If state params are defined, make sure they are
                    // equal, otherwise do not set the active item
                    if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                    {
                        return;
                    }

                    // Update active item on state change
                    msNavigationService.setActiveItem(vm.node, $scope);

                    // Collapse everything except the one we're using
                    $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
                }
            });
        }

        /**
         * Toggle collapsed
         */
        function toggleCollapsed()
        {
            if ( vm.collapsed )
            {
                vm.expand();
            }
            else
            {
                vm.collapse();
            }
        }

        /**
         * Collapse
         */
        function collapse()
        {
            // Grab the element that we are going to collapse
            var collapseEl = vm.element.children('ul');

            // Grab the height
            var height = collapseEl[0].offsetHeight;

            $scope.$evalAsync(function ()
            {
                // Set collapsed status
                vm.collapsed = true;

                // Add collapsing class to the node
                vm.element.addClass('collapsing');

                // Animate the height
                $animate.animate(collapseEl,
                    {
                        'display': 'block',
                        'height' : height + 'px'
                    },
                    {
                        'height': '0px'
                    },
                    vm.animateHeightClass
                ).then(
                    function ()
                    {
                        // Clear the inline styles after animation done
                        collapseEl.css({
                            'display': '',
                            'height' : ''
                        });

                        // Clear collapsing class from the node
                        vm.element.removeClass('collapsing');
                    }
                );

                // Broadcast the collapse event so child items can also be collapsed
                $scope.$broadcast('msNavigation::collapse');
            });
        }

        /**
         * Expand
         */
        function expand()
        {
            // Grab the element that we are going to expand
            var expandEl = vm.element.children('ul');

            // Move the element out of the dom flow and
            // make it block so we can get its height
            expandEl.css({
                'position'  : 'absolute',
                'visibility': 'hidden',
                'display'   : 'block',
                'height'    : 'auto'
            });

            // Grab the height
            var height = expandEl[0].offsetHeight;

            // Reset the style modifications
            expandEl.css({
                'position'  : '',
                'visibility': '',
                'display'   : '',
                'height'    : ''
            });

            $scope.$evalAsync(function ()
            {
                // Set collapsed status
                vm.collapsed = false;

                // Add expanding class to the node
                vm.element.addClass('expanding');

                // Animate the height
                $animate.animate(expandEl,
                    {
                        'display': 'block',
                        'height' : '0px'
                    },
                    {
                        'height': height + 'px'
                    },
                    vm.animateHeightClass
                ).then(
                    function ()
                    {
                        // Clear the inline styles after animation done
                        expandEl.css({
                            'height': ''
                        });

                        // Clear expanding class from the node
                        vm.element.removeClass('expanding');
                    }
                );

                // If item expanded, broadcast the collapse event from rootScope so that the other expanded items
                // can be collapsed. This is necessary for keeping only one parent expanded at any time
                $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
            });
        }

        /**
         * Return the class
         *
         * @returns {*}
         */
        function getClass()
        {
            return vm.node.class;
        }

        /**
         * Check if node should be hidden
         *
         * @returns {boolean}
         */
        function isHidden()
        {
            if ( angular.isDefined(vm.node.hidden) && angular.isFunction(vm.node.hidden) )
            {
                return vm.node.hidden();
            }

            return false;
        }
    }

    /** @ngInject */
    function msNavigationNodeDirective()
    {
        return {
            restrict        : 'A',
            bindToController: {
                node: '=msNavigationNode'
            },
            controller      : 'MsNavigationNodeController as vm',
            compile         : function (tElement)
            {
                tElement.addClass('ms-navigation-node');

                return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl)
                {
                    // Add custom classes
                    iElement.addClass(MsNavigationNodeCtrl.getClass());

                    // Add group class if it's a group
                    if ( MsNavigationNodeCtrl.group )
                    {
                        iElement.addClass('group');
                    }
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationItemDirective()
    {
        return {
            restrict: 'A',
            require : '^msNavigationNode',
            compile : function (tElement)
            {
                tElement.addClass('ms-navigation-item');

                return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl)
                {
                    // If the item is collapsable...
                    if ( MsNavigationNodeCtrl.collapsable )
                    {
                        iElement.on('click', MsNavigationNodeCtrl.toggleCollapsed);
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('click');
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationHorizontalDirective(msNavigationService)
    {
        return {
            restrict   : 'E',
            scope      : {
                root: '@'
            },
            controller : 'MsNavigationController as vm',
            templateUrl: 'app/core/directives/ms-navigation/templates/horizontal.html',
            transclude : true,
            compile    : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal');

                return function postLink(scope)
                {
                    // Store the navigation in the service for public access
                    msNavigationService.setNavigationScope(scope);
                };
            }
        };
    }

    /** @ngInject */
    function MsNavigationHorizontalNodeController($scope, $element, $rootScope, $state, msNavigationService)
    {
        var vm = this;

        // Data
        vm.element = $element;
        vm.node = $scope.node;
        vm.hasChildren = undefined;
        vm.group = undefined;

        // Methods
        vm.getClass = getClass;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Setup the initial values

            // Is active
            vm.isActive = false;

            // Has children?
            vm.hasChildren = vm.node.children.length > 0;

            // Is group?
            vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

            // Mark all parents as active if we have a matching state
            // or the current state is a child of the node's state
            if ( vm.node.state === $state.current.name || $state.includes(vm.node.state) )
            {
                // If state params are defined, make sure they are
                // equal, otherwise do not set the active item
                if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                {
                    return;
                }

                $scope.$emit('msNavigation::stateMatched');

                // Also store the current active menu item
                msNavigationService.setActiveItem(vm.node, $scope);
            }

            $scope.$on('msNavigation::stateMatched', function ()
            {
                // Mark as active if has children
                if ( vm.hasChildren )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = true;
                    });
                }
            });

            // Listen for clearActive event
            $scope.$on('msNavigation::clearActive', function ()
            {
                if ( !vm.hasChildren )
                {
                    return;
                }

                var activePathParts = [];

                var activeItem = msNavigationService.getActiveItem();
                if ( activeItem )
                {
                    activePathParts = activeItem.node._path.split('.');
                }

                // Test for active path
                if ( activePathParts.indexOf(vm.node._id) > -1 )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = true;
                    });
                }
                else
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = false;
                    });
                }

            });

            // Listen for $stateChangeSuccess event
            $scope.$on('$stateChangeSuccess', function ()
            {
                if ( vm.node.state === $state.current.name )
                {
                    // If state params are defined, make sure they are
                    // equal, otherwise do not set the active item
                    if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                    {
                        return;
                    }

                    // Update active item on state change
                    msNavigationService.setActiveItem(vm.node, $scope);

                    // Clear all active states everything except the one we're using
                    $rootScope.$broadcast('msNavigation::clearActive');
                }
            });
        }

        /**
         * Return the class
         *
         * @returns {*}
         */
        function getClass()
        {
            return vm.node.class;
        }
    }

    /** @ngInject */
    function msNavigationHorizontalNodeDirective()
    {
        return {
            restrict        : 'A',
            bindToController: {
                node: '=msNavigationHorizontalNode'
            },
            controller      : 'MsNavigationHorizontalNodeController as vm',
            compile         : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal-node');

                return function postLink(scope, iElement, iAttrs, MsNavigationHorizontalNodeCtrl)
                {
                    // Add custom classes
                    iElement.addClass(MsNavigationHorizontalNodeCtrl.getClass());

                    // Add group class if it's a group
                    if ( MsNavigationHorizontalNodeCtrl.group )
                    {
                        iElement.addClass('group');
                    }
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationHorizontalItemDirective($mdMedia)
    {
        return {
            restrict: 'A',
            require : '^msNavigationHorizontalNode',
            compile : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal-item');

                return function postLink(scope, iElement, iAttrs, MsNavigationHorizontalNodeCtrl)
                {
                    iElement.on('click', onClick);

                    function onClick()
                    {
                        if ( !MsNavigationHorizontalNodeCtrl.hasChildren || $mdMedia('gt-md') )
                        {
                            return;
                        }

                        iElement.toggleClass('expanded');
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('click');
                    });
                };
            }
        };
    }

})();

(function ()
{
    'use strict';

    msNavIsFoldedDirective.$inject = ["$document", "$rootScope", "msNavFoldService"];
    msNavDirective.$inject = ["$rootScope", "$mdComponentRegistry", "msNavFoldService"];
    msNavToggleDirective.$inject = ["$rootScope", "$q", "$animate", "$state"];
    angular
        .module('app.core')
        .factory('msNavFoldService', msNavFoldService)
        .directive('msNavIsFolded', msNavIsFoldedDirective)
        .controller('MsNavController', MsNavController)
        .directive('msNav', msNavDirective)
        .directive('msNavTitle', msNavTitleDirective)
        .directive('msNavButton', msNavButtonDirective)
        .directive('msNavToggle', msNavToggleDirective);

    /** @ngInject */
    function msNavFoldService()
    {
        var foldable = {};

        var service = {
            setFoldable    : setFoldable,
            isNavFoldedOpen: isNavFoldedOpen,
            toggleFold     : toggleFold,
            openFolded     : openFolded,
            closeFolded    : closeFolded
        };

        return service;

        //////////

        /**
         * Set the foldable
         *
         * @param scope
         * @param element
         */
        function setFoldable(scope, element)
        {
            foldable = {
                'scope'  : scope,
                'element': element
            };
        }

        /**
         * Is folded open
         */
        function isNavFoldedOpen()
        {
            return foldable.scope.isNavFoldedOpen();
        }

        /**
         * Toggle fold
         */
        function toggleFold()
        {
            foldable.scope.toggleFold();
        }

        /**
         * Open folded navigation
         */
        function openFolded()
        {
            foldable.scope.openFolded();
        }

        /**
         * Close folded navigation
         */
        function closeFolded()
        {
            foldable.scope.closeFolded();
        }
    }

    /** @ngInject */
    function msNavIsFoldedDirective($document, $rootScope, msNavFoldService)
    {
        return {
            restrict: 'A',
            link    : function (scope, iElement, iAttrs)
            {
                var isFolded = (iAttrs.msNavIsFolded === 'true'),
                    isFoldedOpen = false,
                    body = angular.element($document[0].body),
                    openOverlay = angular.element('<div id="ms-nav-fold-open-overlay"></div>'),
                    closeOverlay = angular.element('<div id="ms-nav-fold-close-overlay"></div>'),
                    sidenavEl = iElement.parent();

                // Initialize the service
                msNavFoldService.setFoldable(scope, iElement, isFolded);

                // Set the fold status for the first time
                if ( isFolded )
                {
                    fold();
                }
                else
                {
                    unfold();
                }

                /**
                 * Is nav folded open
                 */
                function isNavFoldedOpen()
                {
                    return isFoldedOpen;
                }

                /**
                 * Toggle fold
                 */
                function toggleFold()
                {
                    isFolded = !isFolded;

                    if ( isFolded )
                    {
                        fold();
                    }
                    else
                    {
                        unfold();
                    }
                }

                /**
                 * Fold the navigation
                 */
                function fold()
                {
                    // Add classes
                    body.addClass('ms-nav-folded');

                    // Collapse everything and scroll to the top
                    $rootScope.$broadcast('msNav::forceCollapse');
                    iElement.scrollTop(0);

                    // Append the openOverlay to the element
                    sidenavEl.append(openOverlay);

                    // Event listeners
                    openOverlay.on('mouseenter touchstart', function (event)
                    {
                        openFolded(event);
                        isFoldedOpen = true;
                    });
                }

                /**
                 * Open folded navigation
                 */
                function openFolded(event)
                {
                    if ( angular.isDefined(event) )
                    {
                        event.preventDefault();
                    }

                    body.addClass('ms-nav-folded-open');

                    // Update the location
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    // Remove open overlay
                    sidenavEl.find(openOverlay).remove();

                    // Append close overlay and bind its events
                    sidenavEl.parent().append(closeOverlay);
                    closeOverlay.on('mouseenter touchstart', function (event)
                    {
                        closeFolded(event);
                        isFoldedOpen = false;
                    });
                }

                /**
                 * Close folded navigation
                 */
                function closeFolded(event)
                {
                    if ( angular.isDefined(event) )
                    {
                        event.preventDefault();
                    }

                    // Collapse everything and scroll to the top
                    $rootScope.$broadcast('msNav::forceCollapse');
                    iElement.scrollTop(0);

                    body.removeClass('ms-nav-folded-open');

                    // Remove close overlay
                    sidenavEl.parent().find(closeOverlay).remove();

                    // Append open overlay and bind its events
                    sidenavEl.append(openOverlay);
                    openOverlay.on('mouseenter touchstart', function (event)
                    {
                        openFolded(event);
                        isFoldedOpen = true;
                    });
                }

                /**
                 * Unfold the navigation
                 */
                function unfold()
                {
                    body.removeClass('ms-nav-folded ms-nav-folded-open');

                    // Update the location
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    iElement.off('mouseenter mouseleave');
                }

                // Expose functions to the scope
                scope.toggleFold = toggleFold;
                scope.openFolded = openFolded;
                scope.closeFolded = closeFolded;
                scope.isNavFoldedOpen = isNavFoldedOpen;

                // Cleanup
                scope.$on('$destroy', function ()
                {
                    openOverlay.off('mouseenter touchstart');
                    closeOverlay.off('mouseenter touchstart');
                    iElement.off('mouseenter mouseleave');
                });
            }
        };
    }


    /** @ngInject */
    function MsNavController()
    {
        var vm = this,
            disabled = false,
            toggleItems = [],
            lockedItems = [];

        // Data

        // Methods
        vm.isDisabled = isDisabled;
        vm.enable = enable;
        vm.disable = disable;
        vm.setToggleItem = setToggleItem;
        vm.getLockedItems = getLockedItems;
        vm.setLockedItem = setLockedItem;
        vm.clearLockedItems = clearLockedItems;

        //////////

        /**
         * Is navigation disabled
         *
         * @returns {boolean}
         */
        function isDisabled()
        {
            return disabled;
        }

        /**
         * Disable the navigation
         */
        function disable()
        {
            disabled = true;
        }

        /**
         * Enable the navigation
         */
        function enable()
        {
            disabled = false;
        }

        /**
         * Set toggle item
         *
         * @param element
         * @param scope
         */
        function setToggleItem(element, scope)
        {
            toggleItems.push({
                'element': element,
                'scope'  : scope
            });
        }

        /**
         * Get locked items
         *
         * @returns {Array}
         */
        function getLockedItems()
        {
            return lockedItems;
        }

        /**
         * Set locked item
         *
         * @param element
         * @param scope
         */
        function setLockedItem(element, scope)
        {
            lockedItems.push({
                'element': element,
                'scope'  : scope
            });
        }

        /**
         * Clear locked items list
         */
        function clearLockedItems()
        {
            lockedItems = [];
        }
    }

    /** @ngInject */
    function msNavDirective($rootScope, $mdComponentRegistry, msNavFoldService)
    {
        return {
            restrict  : 'E',
            scope     : {},
            controller: 'MsNavController',
            compile   : function (tElement)
            {
                tElement.addClass('ms-nav');

                return function postLink(scope)
                {
                    // Update toggle status according to the ui-router current state
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    // Update toggles on state changes
                    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
                    {
                        $rootScope.$broadcast('msNav::expandMatchingToggles');

                        // Close navigation sidenav on stateChangeSuccess
                        $mdComponentRegistry.when('navigation').then(function (navigation)
                        {
                            navigation.close();

                            if ( msNavFoldService.isNavFoldedOpen() )
                            {
                                msNavFoldService.closeFolded();
                            }
                        });
                    });

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        stateChangeSuccessEvent();
                    })
                };
            }
        };
    }

    /** @ngInject */
    function msNavTitleDirective()
    {
        return {
            restrict: 'A',
            compile : function (tElement)
            {
                tElement.addClass('ms-nav-title');

                return function postLink()
                {

                };
            }
        };
    }

    /** @ngInject */
    function msNavButtonDirective()
    {
        return {
            restrict: 'AE',
            compile : function (tElement)
            {
                tElement.addClass('ms-nav-button');

                return function postLink()
                {

                };
            }
        };
    }

    /** @ngInject */
    function msNavToggleDirective($rootScope, $q, $animate, $state)
    {
        return {
            restrict: 'A',
            require : '^msNav',
            scope   : true,
            compile : function (tElement, tAttrs)
            {
                tElement.addClass('ms-nav-toggle');

                // Add collapsed attr
                if ( angular.isUndefined(tAttrs.collapsed) )
                {
                    tAttrs.collapsed = true;
                }

                tElement.attr('collapsed', tAttrs.collapsed);

                return function postLink(scope, iElement, iAttrs, MsNavCtrl)
                {
                    var classes = {
                        expanded         : 'expanded',
                        expandAnimation  : 'expand-animation',
                        collapseAnimation: 'collapse-animation'
                    };

                    // Store all related states
                    var links = iElement.find('a');
                    var states = [];
                    var regExp = /\(.*\)/g;

                    angular.forEach(links, function (link)
                    {
                        var state = angular.element(link).attr('ui-sref');

                        if ( angular.isUndefined(state) )
                        {
                            return;
                        }

                        // Remove any parameter definition from the state name before storing it
                        state = state.replace(regExp, '');

                        states.push(state);
                    });

                    // Store toggle-able element and its scope in the main nav controller
                    MsNavCtrl.setToggleItem(iElement, scope);

                    // Click handler
                    iElement.children('.ms-nav-button').on('click', toggle);

                    // Toggle function
                    function toggle()
                    {
                        // If navigation is disabled, do nothing...
                        if ( MsNavCtrl.isDisabled() )
                        {
                            return;
                        }

                        // Disable the entire navigation to prevent spamming
                        MsNavCtrl.disable();

                        if ( isCollapsed() )
                        {
                            // Clear the locked items list
                            MsNavCtrl.clearLockedItems();

                            // Emit pushToLockedList event
                            scope.$emit('msNav::pushToLockedList');

                            // Collapse everything but locked items
                            $rootScope.$broadcast('msNav::collapse');

                            // Expand and then...
                            expand().then(function ()
                            {
                                // Enable the entire navigation after animations completed
                                MsNavCtrl.enable();
                            });
                        }
                        else
                        {
                            // Collapse with all children
                            scope.$broadcast('msNav::forceCollapse');
                        }
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.children('.ms-nav-button').off('click');
                    });

                    /*---------------------*/
                    /* Scope Events        */
                    /*---------------------*/

                    /**
                     * Collapse everything but locked items
                     */
                    scope.$on('msNav::collapse', function ()
                    {
                        // Only collapse toggles that are not locked
                        var lockedItems = MsNavCtrl.getLockedItems();
                        var locked = false;

                        angular.forEach(lockedItems, function (lockedItem)
                        {
                            if ( angular.equals(lockedItem.scope, scope) )
                            {
                                locked = true;
                            }
                        });

                        if ( locked )
                        {
                            return;
                        }

                        // Collapse and then...
                        collapse().then(function ()
                        {
                            // Enable the entire navigation after animations completed
                            MsNavCtrl.enable();
                        });
                    });

                    /**
                     * Collapse everything
                     */
                    scope.$on('msNav::forceCollapse', function ()
                    {
                        // Collapse and then...
                        collapse().then(function ()
                        {
                            // Enable the entire navigation after animations completed
                            MsNavCtrl.enable();
                        });
                    });

                    /**
                     * Expand toggles that match with the current states
                     */
                    scope.$on('msNav::expandMatchingToggles', function ()
                    {
                        var currentState = $state.current.name;
                        var shouldExpand = false;

                        angular.forEach(states, function (state)
                        {
                            if ( currentState === state )
                            {
                                shouldExpand = true;
                            }
                        });

                        if ( shouldExpand )
                        {
                            expand();
                        }
                        else
                        {
                            collapse();
                        }
                    });

                    /**
                     * Add toggle to the locked list
                     */
                    scope.$on('msNav::pushToLockedList', function ()
                    {
                        // Set expanded item on main nav controller
                        MsNavCtrl.setLockedItem(iElement, scope);
                    });

                    /*---------------------*/
                    /* Internal functions  */
                    /*---------------------*/

                    /**
                     * Is element collapsed
                     *
                     * @returns {bool}
                     */
                    function isCollapsed()
                    {
                        return iElement.attr('collapsed') === 'true';
                    }

                    /**
                     * Is element expanded
                     *
                     * @returns {bool}
                     */
                    function isExpanded()
                    {
                        return !isCollapsed();
                    }

                    /**
                     * Expand the toggle
                     *
                     * @returns $promise
                     */
                    function expand()
                    {
                        // Create a new deferred object
                        var deferred = $q.defer();

                        // If the menu item is already expanded, do nothing..
                        if ( isExpanded() )
                        {
                            // Reject the deferred object
                            deferred.reject({'error': true});

                            // Return the promise
                            return deferred.promise;
                        }

                        // Set element attr
                        iElement.attr('collapsed', false);

                        // Grab the element to expand
                        var elementToExpand = angular.element(iElement.find('ms-nav-toggle-items')[0]);

                        // Move the element out of the dom flow and
                        // make it block so we can get its height
                        elementToExpand.css({
                            'position'  : 'absolute',
                            'visibility': 'hidden',
                            'display'   : 'block',
                            'height'    : 'auto'
                        });

                        // Grab the height
                        var height = elementToExpand[0].offsetHeight;

                        // Reset the style modifications
                        elementToExpand.css({
                            'position'  : '',
                            'visibility': '',
                            'display'   : '',
                            'height'    : ''
                        });

                        // Animate the height
                        scope.$evalAsync(function ()
                        {
                            $animate.animate(elementToExpand,
                                {
                                    'display': 'block',
                                    'height' : '0px'
                                },
                                {
                                    'height': height + 'px'
                                },
                                classes.expandAnimation
                            ).then(
                                function ()
                                {
                                    // Add expanded class
                                    elementToExpand.addClass(classes.expanded);

                                    // Clear the inline styles after animation done
                                    elementToExpand.css({'height': ''});

                                    // Resolve the deferred object
                                    deferred.resolve({'success': true});
                                }
                            );
                        });

                        // Return the promise
                        return deferred.promise;
                    }

                    /**
                     * Collapse the toggle
                     *
                     * @returns $promise
                     */
                    function collapse()
                    {
                        // Create a new deferred object
                        var deferred = $q.defer();

                        // If the menu item is already collapsed, do nothing..
                        if ( isCollapsed() )
                        {
                            // Reject the deferred object
                            deferred.reject({'error': true});

                            // Return the promise
                            return deferred.promise;
                        }

                        // Set element attr
                        iElement.attr('collapsed', true);

                        // Grab the element to collapse
                        var elementToCollapse = angular.element(iElement.find('ms-nav-toggle-items')[0]);

                        // Grab the height
                        var height = elementToCollapse[0].offsetHeight;

                        // Animate the height
                        scope.$evalAsync(function ()
                        {
                            $animate.animate(elementToCollapse,
                                {
                                    'height': height + 'px'
                                },
                                {
                                    'height': '0px'
                                },
                                classes.collapseAnimation
                            ).then(
                                function ()
                                {
                                    // Remove expanded class
                                    elementToCollapse.removeClass(classes.expanded);

                                    // Clear the inline styles after animation done
                                    elementToCollapse.css({
                                        'display': '',
                                        'height' : ''
                                    });

                                    // Resolve the deferred object
                                    deferred.resolve({'success': true});
                                }
                            );
                        });

                        // Return the promise
                        return deferred.promise;
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msMaterialColorPicker.$inject = ["$mdMenu", "$mdColorPalette", "fuseGenerator"];
    angular
        .module('app.core')
        .directive('msMaterialColorPicker', msMaterialColorPicker);

    /** @ngInject */
    function msMaterialColorPicker($mdMenu, $mdColorPalette, fuseGenerator)
    {
        return {
            require    : 'ngModel',
            restrict   : 'E',
            scope      : {
                ngModel    : '=',
                msModelType: '@?'
            },
            templateUrl: 'app/core/directives/ms-material-color-picker/ms-material-color-picker.html',
            link       : function ($scope, element, attrs, ngModel)
            {
                // Material Color Palette
                $scope.palettes = $mdColorPalette;
                $scope.selectedPalette = false;
                $scope.selectedHues = false;

                /**
                 * ModelType: 'obj', 'class'(default)
                 * @type {string|string}
                 */
                $scope.msModelType = $scope.msModelType || 'class';

                /**
                 * Initialize / Watch model changes
                 */
                $scope.$watch('ngModel', setSelectedColor);

                /**
                 * Activate Hue Selection
                 * @param palette
                 * @param hues
                 */
                $scope.activateHueSelection = function (palette, hues)
                {
                    $scope.selectedPalette = palette;
                    $scope.selectedHues = hues;
                };

                /**
                 * Select Color
                 * @type {selectColor}
                 */
                $scope.selectColor = function (palette, hue)
                {
                    // Update Selected Color
                    updateSelectedColor(palette, hue);

                    // Update Model Value
                    updateModel();

                    // Hide The picker
                    $mdMenu.hide();
                };

                $scope.removeColor = function ()
                {

                    $scope.selectedColor = {
                        palette: '',
                        hue    : '',
                        class  : ''
                    };

                    $scope.activateHueSelection(false, false);

                    updateModel();
                };

                /**
                 * Set SelectedColor by model type
                 */
                function setSelectedColor()
                {
                    if ( !ngModel.$viewValue || ngModel.$viewValue === '' )
                    {
                        return;
                    }

                    var palette, hue;

                    // If ModelType Class
                    if ( $scope.msModelType === 'class' )
                    {
                        var color = ngModel.$viewValue.split('-');
                        if ( color.length >= 5 )
                        {
                            palette = color[1] + '-' + color[2];
                            hue = color[3];
                        }
                        else
                        {
                            palette = color[1];
                            hue = color[2];
                        }
                    }
                    // If ModelType Object
                    else if ( $scope.msModelType === 'obj' )
                    {
                        palette = ngModel.$viewValue.palette;
                        hue = ngModel.$viewValue.hue || 500;
                    }

                    // Update Selected Color
                    updateSelectedColor(palette, hue);
                }


                /**
                 * Update Selected Color
                 * @param palette
                 * @param hue
                 */
                function updateSelectedColor(palette, hue)
                {
                    $scope.selectedColor = {
                        palette     : palette,
                        hue         : hue,
                        class       : 'md-' + palette + '-' + hue + '-bg',
                        bgColorValue: fuseGenerator.rgba($scope.palettes[palette][hue].value),
                        fgColorValue: fuseGenerator.rgba($scope.palettes[palette][hue].contrast)
                    };

                    // If Model object not Equals the selectedColor update it
                    // it can be happen when the model only have pallete and hue values
                    if ( $scope.msModelType === 'obj' && !angular.equals($scope.selectedColor, ngModel.$viewValue) )
                    {
                        // Update Model Value
                        updateModel();
                    }

                    $scope.activateHueSelection(palette, $scope.palettes[palette]);
                }

                /**
                 * Update Model Value by model type
                 */
                function updateModel()
                {
                    if ( $scope.msModelType === 'class' )
                    {
                        ngModel.$setViewValue($scope.selectedColor.class);
                    }
                    else if ( $scope.msModelType === 'obj' )
                    {
                        ngModel.$setViewValue($scope.selectedColor);
                    }
                }
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .controller('MsFormWizardController', MsFormWizardController)
        .directive('msFormWizard', msFormWizardDirective)
        .directive('msFormWizardForm', msFormWizardFormDirective);

    /** @ngInject */
    function MsFormWizardController()
    {
        var vm = this;

        // Data
        vm.forms = [];
        vm.selectedIndex = 0;

        // Methods
        vm.registerForm = registerForm;

        vm.previousStep = previousStep;
        vm.nextStep = nextStep;
        vm.firstStep = firstStep;
        vm.lastStep = lastStep;

        vm.totalSteps = totalSteps;
        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;

        vm.currentStepInvalid = currentStepInvalid;
        vm.previousStepInvalid = previousStepInvalid;
        vm.formsIncomplete = formsIncomplete;
        vm.resetForm = resetForm;

        //////////

        /**
         * Register form
         *
         * @param form
         */
        function registerForm(form)
        {
            vm.forms.push(form);
        }

        /**
         * Go to previous step
         */
        function previousStep()
        {
            if ( isFirstStep() )
            {
                return;
            }

            vm.selectedIndex--;
        }

        /**
         * Go to next step
         */
        function nextStep()
        {
            if ( isLastStep() )
            {
                return;
            }

            vm.selectedIndex++;
        }

        /**
         * Go to first step
         */
        function firstStep()
        {
            vm.selectedIndex = 0;
        }

        /**
         * Go to last step
         */
        function lastStep()
        {
            vm.selectedIndex = totalSteps() - 1;
        }

        /**
         * Return total steps
         *
         * @returns {int}
         */
        function totalSteps()
        {
            return vm.forms.length;
        }

        /**
         * Is first step?
         *
         * @returns {boolean}
         */
        function isFirstStep()
        {
            return vm.selectedIndex === 0;
        }

        /**
         * Is last step?
         *
         * @returns {boolean}
         */
        function isLastStep()
        {
            return vm.selectedIndex === totalSteps() - 1;
        }

        /**
         * Is current step invalid?
         *
         * @returns {boolean}
         */
        function currentStepInvalid()
        {
            return angular.isDefined(vm.forms[vm.selectedIndex]) && vm.forms[vm.selectedIndex].$invalid;
        }

        /**
         * Is previous step invalid?
         *
         * @returns {boolean}
         */
        function previousStepInvalid()
        {
            return vm.selectedIndex > 0 && angular.isDefined(vm.forms[vm.selectedIndex - 1]) && vm.forms[vm.selectedIndex - 1].$invalid;
        }

        /**
         * Check if there is any incomplete forms
         *
         * @returns {boolean}
         */
        function formsIncomplete()
        {
            for ( var x = 0; x < vm.forms.length; x++ )
            {
                if ( vm.forms[x].$invalid )
                {
                    return true;
                }
            }

            return false;
        }

        /**
         * Reset form
         */
        function resetForm()
        {
            // Go back to the first step
            vm.selectedIndex = 0;

            // Make sure all the forms are back in the $pristine & $untouched status
            for ( var x = 0; x < vm.forms.length; x++ )
            {
                vm.forms[x].$setPristine();
                vm.forms[x].$setUntouched();
            }
        }
    }

    /** @ngInject */
    function msFormWizardDirective()
    {
        return {
            restrict  : 'E',
            scope     : true,
            controller: 'MsFormWizardController as msWizard',
            compile   : function (tElement)
            {
                tElement.addClass('ms-form-wizard');

                return function postLink()
                {

                };
            }
        }

    }

    /** @ngInject */
    function msFormWizardFormDirective()
    {
        return {
            restrict: 'A',
            require : ['form', '^msFormWizard'],
            compile : function (tElement)
            {
                tElement.addClass('ms-form-wizard-form');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var formCtrl = ctrls[0],
                        MsFormWizardCtrl = ctrls[1];

                    MsFormWizardCtrl.registerForm(formCtrl);
                }
            }
        }
    }

})();
(function ()
{
    'use strict';

    msDatepickerFix.$inject = ["msDatepickerFixConfig"];
    angular
        .module('app.core')
        .provider('msDatepickerFixConfig', msDatepickerFixConfigProvider)
        .directive('msDatepickerFix', msDatepickerFix);

    /** @ngInject */
    function msDatepickerFixConfigProvider()
    {

        // Default configuration
        var defaultConfiguration = {
            // To view
            formatter: function (val)
            {
                if ( !val )
                {
                    return '';
                }

                return val === '' ? val : new Date(val);
            },
            // To model
            parser   : function (val)
            {
                if ( !val )
                {
                    return '';
                }
                var offset = moment(val).utcOffset();
                var date = new Date(moment(val).add(offset, 'm'));
                return date;
            }
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            defaultConfiguration = angular.extend({}, defaultConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            return defaultConfiguration;
        };
    }

    /** @ngInject */
    function msDatepickerFix(msDatepickerFixConfig)
    {
        return {
            require: 'ngModel',
            link   : function (scope, elem, attrs, ngModel)
            {
                ngModel.$formatters.unshift(msDatepickerFixConfig.formatter); // to view
                ngModel.$parsers.unshift(msDatepickerFixConfig.parser); // to model
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msCard', msCardDirective);

    /** @ngInject */
    function msCardDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                templatePath: '=template',
                card        : '=ngModel',
                vm          : '=viewModel'
            },
            template: '<div class="ms-card-content-wrapper" ng-include="templatePath" onload="cardTemplateLoaded()"></div>',
            compile : function (tElement)
            {
                // Add class
                tElement.addClass('ms-card');

                return function postLink(scope, iElement)
                {
                    // Methods
                    scope.cardTemplateLoaded = cardTemplateLoaded;

                    //////////

                    /**
                     * Emit cardTemplateLoaded event
                     */
                    function cardTemplateLoaded()
                    {
                        scope.$emit('msCard::cardTemplateLoaded', iElement);
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('fuseTheming', fuseThemingProvider);

    /** @ngInject */
    function fuseThemingProvider()
    {
        // Inject Cookies Service
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        var registeredPalettes,
            registeredThemes;

        // Methods
        this.setRegisteredPalettes = setRegisteredPalettes;
        this.setRegisteredThemes = setRegisteredThemes;

        //////////

        /**
         * Set registered palettes
         *
         * @param _registeredPalettes
         */
        function setRegisteredPalettes(_registeredPalettes)
        {
            registeredPalettes = _registeredPalettes;
        }

        /**
         * Set registered themes
         *
         * @param _registeredThemes
         */
        function setRegisteredThemes(_registeredThemes)
        {
            registeredThemes = _registeredThemes;
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getRegisteredPalettes: getRegisteredPalettes,
                getRegisteredThemes  : getRegisteredThemes,
                setActiveTheme       : setActiveTheme,
                setThemesList        : setThemesList,
                themes               : {
                    list  : {},
                    active: {
                        'name' : '',
                        'theme': {}
                    }
                }
            };

            return service;

            //////////

            /**
             * Get registered palettes
             *
             * @returns {*}
             */
            function getRegisteredPalettes()
            {
                return registeredPalettes;
            }

            /**
             * Get registered themes
             *
             * @returns {*}
             */
            function getRegisteredThemes()
            {
                return registeredThemes;
            }

            /**
             * Set active theme
             *
             * @param themeName
             */
            function setActiveTheme(themeName)
            {
                // If theme does not exist, fallback to the default theme
                if ( angular.isUndefined(service.themes.list[themeName]) )
                {
                    // If there is no theme called "default"...
                    if ( angular.isUndefined(service.themes.list.default) )
                    {
                        $log.error('You must have at least one theme named "default"');
                        return;
                    }

                    $log.warn('The theme "' + themeName + '" does not exist! Falling back to the "default" theme.');

                    // Otherwise set theme to default theme
                    service.themes.active.name = 'default';
                    service.themes.active.theme = service.themes.list.default;
                    $cookies.put('selectedTheme', service.themes.active.name);

                    return;
                }

                service.themes.active.name = themeName;
                service.themes.active.theme = service.themes.list[themeName];
                $cookies.put('selectedTheme', themeName);
            }

            /**
             * Set available themes list
             *
             * @param themeList
             */
            function setThemesList(themeList)
            {
                service.themes.list = themeList;
            }
        };
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$mdThemingProvider", "fusePalettes", "fuseThemes", "fuseThemingProvider"];
    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($mdThemingProvider, fusePalettes, fuseThemes, fuseThemingProvider)
    {
        // Inject Cookies Service
        var $cookies;
        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Check if custom theme exist in cookies
        var customTheme = $cookies.getObject('customTheme');
        if ( customTheme )
        {
            fuseThemes['custom'] = customTheme;
        }

        $mdThemingProvider.alwaysWatchTheme(true);

        // Define custom palettes
        angular.forEach(fusePalettes, function (palette)
        {
            $mdThemingProvider.definePalette(palette.name, palette.options);
        });

        // Register custom themes
        angular.forEach(fuseThemes, function (theme, themeName)
        {
            $mdThemingProvider.theme(themeName)
                .primaryPalette(theme.primary.name, theme.primary.hues)
                .accentPalette(theme.accent.name, theme.accent.hues)
                .warnPalette(theme.warn.name, theme.warn.hues)
                .backgroundPalette(theme.background.name, theme.background.hues);
        });

        // Store generated PALETTES and THEMES objects from $mdThemingProvider
        // in our custom provider, so we can inject them into other areas
        fuseThemingProvider.setRegisteredPalettes($mdThemingProvider._PALETTES);
        fuseThemingProvider.setRegisteredThemes($mdThemingProvider._THEMES);
    }

})();
(function ()
{
    'use strict';

    var fuseThemes = {
        'default'  : {
            primary   : {
                name: 'fuse-pale-blue',
                hues: {
                    'default': '700',
                    'hue-1'  : '500',
                    'hue-2'  : '600',
                    'hue-3'  : '400'
                }
            },
            accent    : {
                name: 'light-blue',
                hues: {
                    'default': '600',
                    'hue-1'  : '400',
                    'hue-2'  : '700',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'red'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
        'pink': {
            primary   : {
                name: 'blue-grey',
                hues: {
                    'default': '800',
                    'hue-1'  : '600',
                    'hue-2'  : '400',
                    'hue-3'  : 'A100'
                }
            },
            accent    : {
                name: 'pink',
                hues: {
                    'default': '400',
                    'hue-1'  : '300',
                    'hue-2'  : '600',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'blue'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
        'teal'     : {
            primary   : {
                name: 'fuse-blue',
                hues: {
                    'default': '900',
                    'hue-1'  : '600',
                    'hue-2'  : '500',
                    'hue-3'  : 'A100'
                }
            },
            accent    : {
                name: 'teal',
                hues: {
                    'default': '500',
                    'hue-1'  : '400',
                    'hue-2'  : '600',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'deep-orange'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        }
    };

    angular
        .module('app.core')
        .constant('fuseThemes', fuseThemes);
})();
(function () {
    'use strict';

    var fusePalettes = [
        {
            name: 'fuse-blue',
            options: {
                '50': '#ebf1fa',
                '100': '#c2d4ef',
                '200': '#9ab8e5',
                '300': '#78a0dc',
                '400': '#5688d3',
                '500': '#3470ca',
                '600': '#2e62b1',
                '700': '#275498',
                '800': '#21467e',
                '900': '#1a3865',
                'A100': '#c2d4ef',
                'A200': '#9ab8e5',
                'A400': '#5688d3',
                'A700': '#275498',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
            name: 'fuse-pale-blue',
            options: {
                '50': '#ececee',
                '100': '#c5c6cb',
                '200': '#9ea1a9',
                '300': '#7d818c',
                '400': '#5c616f',
                '500': '#3c4252',
                '600': '#353a48',
                '700': '#2d323e',
                '800': '#262933',
                '900': '#1e2129',
                'A100': '#c5c6cb',
                'A200': '#9ea1a9',
                'A400': '#5c616f',
                'A700': '#2d323e',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        }
    ];

    angular
        .module('app.core')
        .constant('fusePalettes', fusePalettes);
})();
(function ()
{
    'use strict';

    fuseGeneratorService.$inject = ["$cookies", "$log", "fuseTheming"];
    angular
        .module('app.core')
        .factory('fuseGenerator', fuseGeneratorService);

    /** @ngInject */
    function fuseGeneratorService($cookies, $log, fuseTheming)
    {
        // Storage for simplified themes object
        var themes = {};

        var service = {
            generate: generate,
            rgba    : rgba
        };

        return service;

        //////////

        /**
         * Generate less variables for each theme from theme's
         * palette by using material color naming conventions
         */
        function generate()
        {
            var registeredThemes = fuseTheming.getRegisteredThemes();
            var registeredPalettes = fuseTheming.getRegisteredPalettes();

            // First, create a simplified object that stores
            // all registered themes and their colors

            // Iterate through registered themes
            angular.forEach(registeredThemes, function (registeredTheme)
            {
                themes[registeredTheme.name] = {};

                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(registeredTheme.colors, function (colorType, colorTypeName)
                {
                    themes[registeredTheme.name][colorTypeName] = {
                        'name'  : colorType.name,
                        'levels': {
                            'default': {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues.default].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 4)
                            },
                            'hue1'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 4)
                            },
                            'hue2'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 4)
                            },
                            'hue3'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 4)
                            }
                        }
                    };
                });
            });

            // Process themes one more time and then store them in the service for external use
            processAndStoreThemes(themes);

            // Iterate through simplified themes
            // object and create style variables
            var styleVars = {};

            // Iterate through registered themes
            angular.forEach(themes, function (theme, themeName)
            {
                styleVars = {};
                styleVars['@themeName'] = themeName;

                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(theme, function (colorTypes, colorTypeName)
                {
                    // Iterate through color levels (default, hue1, hue2 & hue3)
                    angular.forEach(colorTypes.levels, function (colors, colorLevelName)
                    {
                        // Iterate through color name (color, contrast1, contrast2, contrast3 & contrast4)
                        angular.forEach(colors, function (color, colorName)
                        {
                            styleVars['@' + colorTypeName + ucfirst(colorLevelName) + ucfirst(colorName)] = color;
                        });
                    });
                });

                // Render styles
                render(styleVars);
            });
        }

        // ---------------------------
        //  INTERNAL HELPER FUNCTIONS
        // ---------------------------

        /**
         * Process and store themes for global use
         *
         * @param _themes
         */
        function processAndStoreThemes(_themes)
        {
            // Here we will go through every registered theme one more time
            // and try to simplify their objects as much as possible for
            // easier access to their properties.
            var themes = angular.copy(_themes);

            // Iterate through themes
            angular.forEach(themes, function (theme)
            {
                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(theme, function (colorType, colorTypeName)
                {
                    theme[colorTypeName] = colorType.levels;
                    theme[colorTypeName].color = colorType.levels.default.color;
                    theme[colorTypeName].contrast1 = colorType.levels.default.contrast1;
                    theme[colorTypeName].contrast2 = colorType.levels.default.contrast2;
                    theme[colorTypeName].contrast3 = colorType.levels.default.contrast3;
                    theme[colorTypeName].contrast4 = colorType.levels.default.contrast4;
                    delete theme[colorTypeName].default;
                });
            });

            // Store themes and set selected theme for the first time
            fuseTheming.setThemesList(themes);

            // Remember selected theme.
            var selectedTheme = $cookies.get('selectedTheme');

            if ( selectedTheme )
            {
                fuseTheming.setActiveTheme(selectedTheme);
            }
            else
            {
                fuseTheming.setActiveTheme('default');
            }
        }


        /**
         * Render css files
         *
         * @param styleVars
         */
        function render(styleVars)
        {
            var cssTemplate = '[md-theme="@themeName"] a {\n    color: @accentDefaultColor;\n}\n\n[md-theme="@themeName"] .secondary-text,\n[md-theme="@themeName"] .icon {\n    color: @backgroundDefaultContrast2;\n}\n\n[md-theme="@themeName"] .hint-text,\n[md-theme="@themeName"] .disabled-text {\n    color: @backgroundDefaultContrast3;\n}\n\n[md-theme="@themeName"] .fade-text,\n[md-theme="@themeName"] .divider {\n    color: @backgroundDefaultContrast4;\n}\n\n/* Primary */\n[md-theme="@themeName"] .md-primary-bg {\n    background-color: @primaryDefaultColor;\n    color: @primaryDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg .secondary-text,\n[md-theme="@themeName"] .md-primary-bg .icon {\n    color: @primaryDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg .hint-text,\n[md-theme="@themeName"] .md-primary-bg .disabled-text {\n    color: @primaryDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg .fade-text,\n[md-theme="@themeName"] .md-primary-bg .divider {\n    color: @primaryDefaultContrast4;\n}\n\n/* Primary, Hue-1 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 {\n    background-color: @primaryHue1Color;\n    color: @primaryHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .icon {\n    color: @primaryHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .disabled-text {\n    color: @primaryHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .divider {\n    color: @primaryHue1Contrast4;\n}\n\n/* Primary, Hue-2 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 {\n    background-color: @primaryHue2Color;\n    color: @primaryHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .icon {\n    color: @primaryHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .disabled-text {\n    color: @primaryHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .divider {\n    color: @primaryHue2Contrast4;\n}\n\n/* Primary, Hue-3 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 {\n    background-color: @primaryHue3Color;\n    color: @primaryHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .icon {\n    color: @primaryHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .disabled-text {\n    color: @primaryHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .divider {\n    color: @primaryHue3Contrast4;\n}\n\n/* Primary foreground */\n[md-theme="@themeName"] .md-primary-fg {\n    color: @primaryDefaultColor !important;\n}\n\n/* Primary foreground, Hue-1 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-1 {\n    color: @primaryHue1Color !important;\n}\n\n/* Primary foreground, Hue-2 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-2 {\n    color: @primaryHue2Color !important;\n}\n\n/* Primary foreground, Hue-3 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-3 {\n    color: @primaryHue3Color !important;\n}\n\n\n/* Accent */\n[md-theme="@themeName"] .md-accent-bg {\n    background-color: @accentDefaultColor;\n    color: @accentDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg .secondary-text,\n[md-theme="@themeName"] .md-accent-bg .icon {\n    color: @accentDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg .hint-text,\n[md-theme="@themeName"] .md-accent-bg .disabled-text {\n    color: @accentDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg .fade-text,\n[md-theme="@themeName"] .md-accent-bg .divider {\n    color: @accentDefaultContrast4;\n}\n\n/* Accent, Hue-1 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 {\n    background-color: @accentHue1Color;\n    color: @accentHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .icon {\n    color: @accentHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .disabled-text {\n    color: @accentHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .divider {\n    color: @accentHue1Contrast4;\n}\n\n/* Accent, Hue-2 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 {\n    background-color: @accentHue2Color;\n    color: @accentHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .icon {\n    color: @accentHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .disabled-text {\n    color: @accentHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .divider {\n    color: @accentHue2Contrast4;\n}\n\n/* Accent, Hue-3 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 {\n    background-color: @accentHue3Color;\n    color: @accentHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .icon {\n    color: @accentHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .disabled-text {\n    color: @accentHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .divider {\n    color: @accentHue3Contrast4;\n}\n\n/* Accent foreground */\n[md-theme="@themeName"] .md-accent-fg {\n    color: @accentDefaultColor !important;\n}\n\n/* Accent foreground, Hue-1 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-1 {\n    color: @accentHue1Color !important;\n}\n\n/* Accent foreground, Hue-2 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-2 {\n    color: @accentHue2Color !important;\n}\n\n/* Accent foreground, Hue-3 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-3 {\n    color: @accentHue3Color !important;\n}\n\n\n/* Warn */\n[md-theme="@themeName"] .md-warn-bg {\n    background-color: @warnDefaultColor;\n    color: @warnDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg .secondary-text,\n[md-theme="@themeName"] .md-warn-bg .icon {\n    color: @warnDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg .hint-text,\n[md-theme="@themeName"] .md-warn-bg .disabled-text {\n    color: @warnDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg .fade-text,\n[md-theme="@themeName"] .md-warn-bg .divider {\n    color: @warnDefaultContrast4;\n}\n\n/* Warn, Hue-1 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 {\n    background-color: @warnHue1Color;\n    color: @warnHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .icon {\n    color: @warnHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .disabled-text {\n    color: @warnHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .divider {\n    color: @warnHue1Contrast4;\n}\n\n/* Warn, Hue-2 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 {\n    background-color: @warnHue2Color;\n    color: @warnHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .icon {\n    color: @warnHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .disabled-text {\n    color: @warnHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .divider {\n    color: @warnHue2Contrast4;\n}\n\n/* Warn, Hue-3 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 {\n    background-color: @warnHue3Color;\n    color: @warnHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .icon {\n    color: @warnHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .disabled-text {\n    color: @warnHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .divider {\n    color: @warnHue3Contrast4;\n}\n\n/* Warn foreground */\n[md-theme="@themeName"] .md-warn-fg {\n    color: @warnDefaultColor !important;\n}\n\n/* Warn foreground, Hue-1 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-1 {\n    color: @warnHue1Color !important;\n}\n\n/* Warn foreground, Hue-2 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-2 {\n    color: @warnHue2Color !important;\n}\n\n/* Warn foreground, Hue-3 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-3 {\n    color: @warnHue3Color !important;\n}\n\n/* Background */\n[md-theme="@themeName"] .md-background-bg {\n    background-color: @backgroundDefaultColor;\n    color: @backgroundDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg .secondary-text,\n[md-theme="@themeName"] .md-background-bg .icon {\n    color: @backgroundDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg .hint-text,\n[md-theme="@themeName"] .md-background-bg .disabled-text {\n    color: @backgroundDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg .fade-text,\n[md-theme="@themeName"] .md-background-bg .divider {\n    color: @backgroundDefaultContrast4;\n}\n\n/* Background, Hue-1 */\n[md-theme="@themeName"] .md-background-bg.md-hue-1 {\n    background-color: @backgroundHue1Color;\n    color: @backgroundHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .icon {\n    color: @backgroundHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .disabled-text {\n    color: @backgroundHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .divider {\n    color: @backgroundHue1Contrast4;\n}\n\n/* Background, Hue-2 */\n[md-theme="@themeName"] .md-background-bg.md-hue-2 {\n    background-color: @backgroundHue2Color;\n    color: @backgroundHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .icon {\n    color: @backgroundHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .disabled-text {\n    color: @backgroundHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .divider {\n    color: @backgroundHue2Contrast4;\n}\n\n/* Background, Hue-3 */\n[md-theme="@themeName"] .md-background-bg.md-hue-3 {\n    background-color: @backgroundHue3Color;\n    color: @backgroundHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .icon {\n    color: @backgroundHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .disabled-text {\n    color: @backgroundHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .divider {\n    color: @backgroundHue3Contrast4;\n}\n\n/* Background foreground */\n[md-theme="@themeName"] .md-background-fg {\n    color: @backgroundDefaultColor !important;\n}\n\n/* Background foreground, Hue-1 */\n[md-theme="@themeName"] .md-background-fg.md-hue-1 {\n    color: @backgroundHue1Color !important;\n}\n\n/* Background foreground, Hue-2 */\n[md-theme="@themeName"] .md-background-fg.md-hue-2 {\n    color: @backgroundHue2Color !important;\n}\n\n/* Background foreground, Hue-3 */\n[md-theme="@themeName"] .md-background-fg.md-hue-3 {\n    color: @backgroundHue3Color !important;\n}';

            var regex = new RegExp(Object.keys(styleVars).join('|'), 'gi');
            var css = cssTemplate.replace(regex, function (matched)
            {
                return styleVars[matched];
            });

            var headEl = angular.element('head');
            var styleEl = angular.element('<style type="text/css"></style>');
            styleEl.html(css);
            headEl.append(styleEl);
        }

        /**
         * Convert color array to rgb/rgba
         * Also apply contrasts if needed
         *
         * @param color
         * @param _contrastLevel
         * @returns {string}
         */
        function rgba(color, _contrastLevel)
        {
            var contrastLevel = _contrastLevel || false;

            // Convert 255,255,255,0.XX to 255,255,255
            // According to Google's Material design specs, white primary
            // text must have opacity of 1 and we will fix that here
            // because Angular Material doesn't care about that spec
            if ( color.length === 4 && color[0] === 255 && color[1] === 255 && color[2] === 255 )
            {
                color.splice(3, 4);
            }

            // If contrast level provided, apply it to the current color
            if ( contrastLevel )
            {
                color = applyContrast(color, contrastLevel);
            }

            // Convert color array to color string (rgb/rgba)
            if ( color.length === 3 )
            {
                return 'rgb(' + color.join(',') + ')';
            }
            else if ( color.length === 4 )
            {
                return 'rgba(' + color.join(',') + ')';
            }
            else
            {
                $log.error('Invalid number of arguments supplied in the color array: ' + color.length + '\n' + 'The array must have 3 or 4 colors.');
            }
        }

        /**
         * Apply given contrast level to the given color
         *
         * @param color
         * @param contrastLevel
         */
        function applyContrast(color, contrastLevel)
        {
            var contrastLevels = {
                'white': {
                    '1': '1',
                    '2': '0.7',
                    '3': '0.3',
                    '4': '0.12'
                },
                'black': {
                    '1': '0.87',
                    '2': '0.54',
                    '3': '0.26',
                    '4': '0.12'
                }
            };

            // If white
            if ( color[0] === 255 && color[1] === 255 && color[2] === 255 )
            {
                color[3] = contrastLevels.white[contrastLevel];
            }
            // If black
            else if ( color[0] === 0 && color[1] === 0, color[2] === 0 )
            {
                color[3] = contrastLevels.black[contrastLevel];
            }

            return color;
        }

        /**
         * Uppercase first
         */
        function ucfirst(string)
        {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

})();
(function ()
{
    'use strict';

    MsThemeOptionsController.$inject = ["$cookies", "fuseTheming"];
    angular
        .module('app.core')
        .controller('MsThemeOptionsController', MsThemeOptionsController)
        .directive('msThemeOptions', msThemeOptions);

    /** @ngInject */
    function MsThemeOptionsController($cookies, fuseTheming)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.layoutMode = 'wide';
        vm.layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';

        // Methods
        vm.setActiveTheme = setActiveTheme;
        vm.updateLayoutMode = updateLayoutMode;
        vm.updateLayoutStyle = updateLayoutStyle;

        //////////

        /**
         * Set active theme
         *
         * @param themeName
         */
        function setActiveTheme(themeName)
        {
            // Set active theme
            fuseTheming.setActiveTheme(themeName);
        }

        /**
         * Update layout mode
         */
        function updateLayoutMode()
        {
            var bodyEl = angular.element('body');

            // Update class on body element
            bodyEl.toggleClass('boxed', (vm.layoutMode === 'boxed'));
        }

        /**
         * Update layout style
         */
        function updateLayoutStyle()
        {
            // Update the cookie
            $cookies.put('layoutStyle', vm.layoutStyle);

            // Reload the page to apply the changes
            location.reload();
        }
    }

    /** @ngInject */
    function msThemeOptions()
    {
        return {
            restrict   : 'E',
            scope      : {
                panelOpen: '=?'
            },
            controller : 'MsThemeOptionsController as vm',
            templateUrl: 'app/core/theme-options/theme-options.html',
            compile    : function (tElement)
            {
                tElement.addClass('ms-theme-options');

                return function postLink(scope, iElement)
                {
                    var bodyEl = angular.element('body'),
                        backdropEl = angular.element('<div class="ms-theme-options-backdrop"></div>');

                    // Panel open status
                    scope.panelOpen = scope.panelOpen || false;

                    /**
                     * Toggle options panel
                     */
                    function toggleOptionsPanel()
                    {
                        if ( scope.panelOpen )
                        {
                            closeOptionsPanel();
                        }
                        else
                        {
                            openOptionsPanel();
                        }
                    }

                    function openOptionsPanel()
                    {
                        // Set panelOpen status
                        scope.panelOpen = true;

                        // Add open class
                        iElement.addClass('open');

                        // Append the backdrop
                        bodyEl.append(backdropEl);

                        // Register the event
                        backdropEl.on('click touch', closeOptionsPanel);
                    }

                    /**
                     * Close options panel
                     */
                    function closeOptionsPanel()
                    {
                        // Set panelOpen status
                        scope.panelOpen = false;

                        // Remove open class
                        iElement.removeClass('open');

                        // De-register the event
                        backdropEl.off('click touch', closeOptionsPanel);

                        // Remove the backdrop
                        backdropEl.remove();
                    }

                    // Expose the toggle function
                    scope.toggleOptionsPanel = toggleOptionsPanel;
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msUtils.$inject = ["$window"];
    angular
        .module('app.core')
        .factory('msUtils', msUtils);

    /** @ngInject */
    function msUtils($window)
    {
        // Private variables
        var mobileDetect = new MobileDetect($window.navigator.userAgent),
            browserInfo = null;

        var service = {
            exists       : exists,
            detectBrowser: detectBrowser,
            guidGenerator: guidGenerator,
            isMobile     : isMobile,
            toggleInArray: toggleInArray
        };

        return service;

        //////////

        /**
         * Check if item exists in a list
         *
         * @param item
         * @param list
         * @returns {boolean}
         */
        function exists(item, list)
        {
            return list.indexOf(item) > -1;
        }

        /**
         * Returns browser information
         * from user agent data
         *
         * Found at http://www.quirksmode.org/js/detect.html
         * but modified and updated to fit for our needs
         */
        function detectBrowser()
        {
            // If we already tested, do not test again
            if ( browserInfo )
            {
                return browserInfo;
            }

            var browserData = [
                {
                    string       : $window.navigator.userAgent,
                    subString    : 'Edge',
                    versionSearch: 'Edge',
                    identity     : 'Edge'
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: 'Chrome',
                    identity : 'Chrome'
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : 'OmniWeb',
                    versionSearch: 'OmniWeb/',
                    identity     : 'OmniWeb'
                },
                {
                    string       : $window.navigator.vendor,
                    subString    : 'Apple',
                    versionSearch: 'Version',
                    identity     : 'Safari'
                },
                {
                    prop    : $window.opera,
                    identity: 'Opera'
                },
                {
                    string   : $window.navigator.vendor,
                    subString: 'iCab',
                    identity : 'iCab'
                },
                {
                    string   : $window.navigator.vendor,
                    subString: 'KDE',
                    identity : 'Konqueror'
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: 'Firefox',
                    identity : 'Firefox'
                },
                {
                    string   : $window.navigator.vendor,
                    subString: 'Camino',
                    identity : 'Camino'
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: 'Netscape',
                    identity : 'Netscape'
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : 'MSIE',
                    identity     : 'Explorer',
                    versionSearch: 'MSIE'
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : 'Trident/7',
                    identity     : 'Explorer',
                    versionSearch: 'rv'
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : 'Gecko',
                    identity     : 'Mozilla',
                    versionSearch: 'rv'
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : 'Mozilla',
                    identity     : 'Netscape',
                    versionSearch: 'Mozilla'
                }
            ];

            var osData = [
                {
                    string   : $window.navigator.platform,
                    subString: 'Win',
                    identity : 'Windows'
                },
                {
                    string   : $window.navigator.platform,
                    subString: 'Mac',
                    identity : 'Mac'
                },
                {
                    string   : $window.navigator.platform,
                    subString: 'Linux',
                    identity : 'Linux'
                },
                {
                    string   : $window.navigator.platform,
                    subString: 'iPhone',
                    identity : 'iPhone'
                },
                {
                    string   : $window.navigator.platform,
                    subString: 'iPod',
                    identity : 'iPod'
                },
                {
                    string   : $window.navigator.platform,
                    subString: 'iPad',
                    identity : 'iPad'
                },
                {
                    string   : $window.navigator.platform,
                    subString: 'Android',
                    identity : 'Android'
                }
            ];

            var versionSearchString = '';

            function searchString(data)
            {
                for ( var i = 0; i < data.length; i++ )
                {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;

                    versionSearchString = data[i].versionSearch || data[i].identity;

                    if ( dataString )
                    {
                        if ( dataString.indexOf(data[i].subString) !== -1 )
                        {
                            return data[i].identity;

                        }
                    }
                    else if ( dataProp )
                    {
                        return data[i].identity;
                    }
                }
            }

            function searchVersion(dataString)
            {
                var index = dataString.indexOf(versionSearchString);

                if ( index === -1 )
                {
                    return;
                }

                return parseInt(dataString.substring(index + versionSearchString.length + 1));
            }

            var browser = searchString(browserData) || 'unknown-browser';
            var version = searchVersion($window.navigator.userAgent) || searchVersion($window.navigator.appVersion) || 'unknown-version';
            var os = searchString(osData) || 'unknown-os';

            // Prepare and store the object
            browser = browser.toLowerCase();
            version = browser + '-' + version;
            os = os.toLowerCase();

            browserInfo = {
                browser: browser,
                version: version,
                os     : os
            };

            return browserInfo;
        }

        /**
         * Generates a globally unique id
         *
         * @returns {*}
         */
        function guidGenerator()
        {
            var S4 = function ()
            {
                return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
            };
            return (S4() + S4() + S4() + S4() + S4() + S4());
        }

        /**
         * Return if current device is a
         * mobile device or not
         */
        function isMobile()
        {
            return mobileDetect.mobile();
        }

        /**
         * Toggle in array (push or splice)
         *
         * @param item
         * @param array
         */
        function toggleInArray(item, array)
        {
            if ( array.indexOf(item) === -1 )
            {
                array.push(item);
            }
            else
            {
                array.splice(array.indexOf(item), 1);
            }
        }
    }
}());
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('msApi', msApiProvider);

    /** @ngInject **/
    function msApiProvider()
    {
        /* ----------------- */
        /* Provider          */
        /* ----------------- */
        var provider = this;

        // Inject required services
        var $log = angular.injector(['ng']).get('$log'),
            $resource = angular.injector(['ngResource']).get('$resource');

        // Data
        var baseUrl = '';
        var api = [];

        // Methods
        provider.setBaseUrl = setBaseUrl;
        provider.getBaseUrl = getBaseUrl;
        provider.getApiObject = getApiObject;
        provider.register = register;

        //////////

        /**
         * Set base url for API endpoints
         *
         * @param url {string}
         */
        function setBaseUrl(url)
        {
            baseUrl = url;
        }

        /**
         * Return the base url
         *
         * @returns {string}
         */
        function getBaseUrl()
        {
            return baseUrl;
        }

        /**
         * Return the api object
         *
         * @returns {object}
         */
        function getApiObject()
        {
            return api;
        }

        /**
         * Register API endpoint
         *
         * @param key
         * @param resource
         */
        function register(key, resource)
        {
            if ( !angular.isString(key) )
            {
                $log.error('"path" must be a string (eg. `dashboard.project`)');
                return;
            }

            if ( !angular.isArray(resource) )
            {
                $log.error('"resource" must be an array and it must follow $resource definition');
                return;
            }

            // Prepare the resource object
            var resourceObj = {
                url          : baseUrl + (resource[0] || ''),
                paramDefaults: resource[1] || [],
                actions      : resource[2] || [],
                options      : resource[3] || {}
            };

            // Assign the resource
            api[key] = $resource(resourceObj.url, resourceObj.paramDefaults, resourceObj.actions, resourceObj.options);
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */
        this.$get = ["$q", "$log", function ($q, $log)
        {
            // Data

            // Methods
            var service = {
                setBaseUrl: setBaseUrl,
                getBaseUrl: getBaseUrl,
                register  : register,
                resolve   : resolve,
                request   : request
            };

            return service;

            //////////

            /**
             * Resolve an API endpoint
             *
             * @param action {string}
             * @param parameters {object}
             * @returns {promise|boolean}
             */
            function resolve(action, parameters)
            {
                var actionParts = action.split('@'),
                    resource = actionParts[0],
                    method = actionParts[1],
                    params = parameters || {};

                if ( !resource || !method )
                {
                    $log.error('msApi.resolve requires correct action parameter (resourceName@methodName)');
                    return false;
                }

                // Create a new deferred object
                var deferred = $q.defer();

                // Get the correct resource definition from api object
                var apiObject = api[resource];

                if ( !apiObject )
                {
                    $log.error('Resource "' + resource + '" is not defined in the api service!');
                    deferred.reject('Resource "' + resource + '" is not defined in the api service!');
                }
                else
                {
                    apiObject[method](params,

                        // Success
                        function (response)
                        {
                            deferred.resolve(response);
                        },

                        // Error
                        function (response)
                        {
                            deferred.reject(response);
                        }
                    );
                }

                // Return the promise
                return deferred.promise;
            }

            /**
             * Make a request to an API endpoint
             *
             * @param action {string}
             * @param [parameters] {object}
             * @param [success] {function}
             * @param [error] {function}
             *
             * @returns {promise|boolean}
             */
            function request(action, parameters, success, error)
            {
                var actionParts = action.split('@'),
                    resource = actionParts[0],
                    method = actionParts[1],
                    params = parameters || {};

                if ( !resource || !method )
                {
                    $log.error('msApi.resolve requires correct action parameter (resourceName@methodName)');
                    return false;
                }

                // Create a new deferred object
                var deferred = $q.defer();

                // Get the correct resource definition from api object
                var apiObject = api[resource];

                if ( !apiObject )
                {
                    $log.error('Resource "' + resource + '" is not defined in the api service!');
                    deferred.reject('Resource "' + resource + '" is not defined in the api service!');
                }
                else
                {
                    apiObject[method](params,

                        // SUCCESS
                        function (response)
                        {
                            // Resolve the promise
                            deferred.resolve(response);

                            // Call the success function if there is one
                            if ( angular.isDefined(success) && angular.isFunction(success) )
                            {
                                success(response);
                            }
                        },

                        // ERROR
                        function (response)
                        {
                            // Reject the promise
                            deferred.reject(response);

                            // Call the error function if there is one
                            if ( angular.isDefined(error) && angular.isFunction(error) )
                            {
                                error(response);
                            }
                        }
                    );
                }

                // Return the promise
                return deferred.promise;
            }
        }];
    }
})();
(function ()
{
    'use strict';

    apiResolverService.$inject = ["$q", "$log", "api"];
    angular
        .module('app.core')
        .factory('apiResolver', apiResolverService);

    /** @ngInject */
    function apiResolverService($q, $log, api)
    {
        var service = {
            resolve: resolve
        };

        return service;

        //////////
        /**
         * Resolve api
         * @param action
         * @param parameters
         */
        function resolve(action, parameters)
        {
            var actionParts = action.split('@'),
                resource = actionParts[0],
                method = actionParts[1],
                params = parameters || {};

            if ( !resource || !method )
            {
                $log.error('apiResolver.resolve requires correct action parameter (ResourceName@methodName)');
                return false;
            }

            // Create a new deferred object
            var deferred = $q.defer();

            // Get the correct api object from api service
            var apiObject = getApiObject(resource);

            if ( !apiObject )
            {
                $log.error('Resource "' + resource + '" is not defined in the api service!');
                deferred.reject('Resource "' + resource + '" is not defined in the api service!');
            }
            else
            {
                apiObject[method](params,

                    // Success
                    function (response)
                    {
                        deferred.resolve(response);
                    },

                    // Error
                    function (response)
                    {
                        deferred.reject(response);
                    }
                );
            }

            // Return the promise
            return deferred.promise;
        }

        /**
         * Get correct api object
         *
         * @param resource
         * @returns {*}
         */
        function getApiObject(resource)
        {
            // Split the resource in case if we have a dot notated object
            var resourceParts = resource.split('.'),
                apiObject = api;

            // Loop through the resource parts and go all the way through
            // the api object and return the correct one
            for ( var l = 0; l < resourceParts.length; l++ )
            {
                if ( angular.isUndefined(apiObject[resourceParts[l]]) )
                {
                    $log.error('Resource part "' + resourceParts[l] + '" is not defined!');
                    apiObject = false;
                    break;
                }

                apiObject = apiObject[resourceParts[l]];
            }

            if ( !apiObject )
            {
                return false;
            }

            return apiObject;
        }
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .filter('filterByTags', filterByTags)
        .filter('filterSingleByTags', filterSingleByTags);

    /** @ngInject */
    function filterByTags()
    {
        return function (items, tags)
        {
            if ( items.length === 0 || tags.length === 0 )
            {
                return items;
            }

            var filtered = [];

            items.forEach(function (item)
            {
                var match = tags.every(function (tag)
                {
                    var tagExists = false;

                    item.tags.forEach(function (itemTag)
                    {
                        if ( itemTag.name === tag.name )
                        {
                            tagExists = true;
                            return;
                        }
                    });

                    return tagExists;
                });

                if ( match )
                {
                    filtered.push(item);
                }
            });

            return filtered;
        };
    }

    /** @ngInject */
    function filterSingleByTags()
    {
        return function (itemTags, tags)
        {
            if ( itemTags.length === 0 || tags.length === 0 )
            {
                return;
            }

            if ( itemTags.length < tags.length )
            {
                return [];
            }

            var filtered = [];

            var match = tags.every(function (tag)
            {
                var tagExists = false;

                itemTags.forEach(function (itemTag)
                {
                    if ( itemTag.name === tag.name )
                    {
                        tagExists = true;
                        return;
                    }
                });

                return tagExists;
            });

            if ( match )
            {
                filtered.push(itemTags);
            }

            return filtered;
        };
    }

})();
(function ()
{
    'use strict';

    toTrustedFilter.$inject = ["$sce"];
    angular
        .module('app.core')
        .filter('toTrusted', toTrustedFilter)
        .filter('htmlToPlaintext', htmlToPlainTextFilter)
        .filter('nospace', nospaceFilter)
        .filter('humanizeDoc', humanizeDocFilter);

    /** @ngInject */
    function toTrustedFilter($sce)
    {
        return function (value)
        {
            return $sce.trustAsHtml(value);
        };
    }

    /** @ngInject */
    function htmlToPlainTextFilter()
    {
        return function (text)
        {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }

    /** @ngInject */
    function nospaceFilter()
    {
        return function (value)
        {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    }

    /** @ngInject */
    function humanizeDocFilter()
    {
        return function (doc)
        {
            if ( !doc )
            {
                return;
            }
            if ( doc.type === 'directive' )
            {
                return doc.name.replace(/([A-Z])/g, function ($1)
                {
                    return '-' + $1.toLowerCase();
                });
            }
            return doc.label || doc.name;
        };
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('fuseConfig', fuseConfigProvider);

    /** @ngInject */
    function fuseConfigProvider()
    {
        // Default configuration
        var fuseConfiguration = {
            'disableCustomScrollbars'        : false,
            'disableMdInkRippleOnMobile'     : true,
            'disableCustomScrollbarsOnMobile': true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            fuseConfiguration = angular.extend({}, fuseConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig,
                setConfig: setConfig
            };

            return service;

            //////////

            /**
             * Returns a config value
             */
            function getConfig(configName)
            {
                if ( angular.isUndefined(fuseConfiguration[configName]) )
                {
                    return false;
                }

                return fuseConfiguration[configName];
            }

            /**
             * Creates or updates config object
             *
             * @param configName
             * @param configValue
             */
            function setConfig(configName, configValue)
            {
                fuseConfiguration[configName] = configValue;
            }
        };
    }

})();
(function ()
{
    'use strict';

    hljsDirective.$inject = ["$timeout", "$q", "$interpolate"];
    angular
        .module('app.core')
        .directive('hljs', hljsDirective);

    /** @ngInject */
    function hljsDirective($timeout, $q, $interpolate)
    {
        return {
            restrict: 'EA',
            compile : function (tElement, tAttrs)
            {
                var code;
                //No attribute? code is the content
                if ( !tAttrs.code )
                {
                    code = tElement.html();
                    tElement.empty();
                }

                return function (scope, iElement, iAttrs)
                {
                    if ( iAttrs.code )
                    {
                        // Attribute? code is the evaluation
                        code = scope.$eval(iAttrs.code);
                    }
                    var shouldInterpolate = scope.$eval(iAttrs.shouldInterpolate);

                    $q.when(code).then(function (code)
                    {
                        if ( code )
                        {
                            if ( shouldInterpolate )
                            {
                                code = $interpolate(code)(scope);
                            }

                            var contentParent = angular.element(
                                '<pre><code class="highlight" ng-non-bindable></code></pre>'
                            );

                            iElement.append(contentParent);

                            // Defer highlighting 1-frame to prevent GA interference...
                            $timeout(function ()
                            {
                                render(code, contentParent);
                            }, 34, false);
                        }
                    });

                    function render(contents, parent)
                    {
                        var codeElement = parent.find('code');
                        var lines = contents.split('\n');

                        // Remove empty lines
                        lines = lines.filter(function (line)
                        {
                            return line.trim().length;
                        });

                        // Make it so each line starts at 0 whitespace
                        var firstLineWhitespace = lines[0].match(/^\s*/)[0];
                        var startingWhitespaceRegex = new RegExp('^' + firstLineWhitespace);

                        lines = lines.map(function (line)
                        {
                            return line
                                .replace(startingWhitespaceRegex, '')
                                .replace(/\s+$/, '');
                        });

                        var highlightedCode = hljs.highlight(iAttrs.language || iAttrs.lang, lines.join('\n'), true);
                        highlightedCode.value = highlightedCode.value
                            .replace(/=<span class="hljs-value">""<\/span>/gi, '')
                            .replace('<head>', '')
                            .replace('<head/>', '');
                        codeElement.append(highlightedCode.value).addClass('highlight');
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$translatePartialLoaderProvider"];
    angular
        .module('app.toolbar', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        $translatePartialLoaderProvider.addPart('app/toolbar');
    }
})();


(function (){
    'use strict';

    ToolbarController.$inject = ["$rootScope", "$mdSidenav", "$location", "UtilityService", "$translate", "$mdToast", "$scope", "AuthenticationService", "$state"];
    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $mdSidenav,$location,UtilityService, $translate, $mdToast,$scope,AuthenticationService,$state)
    {
        var vm = this;

        //data
        vm.pageTitle = $rootScope.pageTitle;

        // $scope.page = {
        //   title:'PAGETITLES.'+ vm.pageTitle
        // }

        vm.showShiftMenu = $rootScope.showShiftMenu;
        vm.shiftNumber = $rootScope.shiftNumber;

        vm.loggedInStaff = "";

        $rootScope.pageTitle = null;
        //data change broadcast handler
        $scope.$on('handleBroadcast', function(event, args) {
            vm.pageTitle =  args.pageTitle;
        });

        $rootScope.global = {
            search: ''
        };

        vm.bodyEl = angular.element('body');
        // vm.userStatusOptions = [
        //     {
        //         'title': 'Online',
        //         'icon' : 'icon-checkbox-marked-circle',
        //         'color': '#4CAF50'
        //     },
        //     {
        //         'title': 'Away',
        //         'icon' : 'icon-clock',
        //         'color': '#FFC107'
        //     },
        //     {
        //         'title': 'Do not Disturb',
        //         'icon' : 'icon-minus-circle',
        //         'color': '#F44336'
        //     },
        //     {
        //         'title': 'Invisible',
        //         'icon' : 'icon-checkbox-blank-circle-outline',
        //         'color': '#BDBDBD'
        //     },
        //     {
        //         'title': 'Offline',
        //         'icon' : 'icon-checkbox-blank-circle-outline',
        //         'color': '#616161'
        //     }
        // ];
        vm.languages = {
            en: {
                'title'      : 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code'       : 'en',
                'flag'       : 'us'
            },
            es: {
                'title'      : 'Spanish',
                'translation': 'TOOLBAR.SPANISH',
                'code'       : 'es',
                'flag'       : 'es'
            },
            tr: {
                'title'      : 'Turkish',
                'translation': 'TOOLBAR.TURKISH',
                'code'       : 'tr',
                'flag'       : 'tr'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Select the first status as a default
            //vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status)
        {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout()
        {
            // Do logout here..
            AuthenticationService.ClearCredentials();
            $state.go('app.login');
            $location.path('/login');
        }

        /**
         * Change Language
         */
        function changeLanguage(lang)
        {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            // if ( lang.code !== 'en' )
            // {
            //     var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

            //     $mdToast.show({
            //         template : '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
            //         hideDelay: 7000,
            //         position : 'top right',
            //         parent   : '#content'
            //     });

            //     return;
            // }

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

})();

(function() {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            // Core
            'app.core',
            // Navigation
            'app.navigation',
            // Toolbar
            'app.toolbar',
            // Quick panel
            //'app.quick-panel',
            // Apps

            'app.dashboard',
            'app.appraisals',

            'app.settings',
            'md.data.table'
           //added for components
            // 'ngWebworker',

            //   'worker-app',
            //   'app.paymentmanager',
            //  'app.serviceRegistration',
            //'app.calendar',
            //'app.mail',
            //'app.file-manager',
            //'app.scrumboard',
            //'app.gantt-chart',
            //'app.todo',
            // Pages
            //'app.pages',
            // User Interface
            //'app.ui',
            // Components
            //'app.components'
            //Third-party libraries
        ]);
})();

(function () {
  'use strict';
  angular.module('fuse')
    .factory('StoreService', StoreService);


  StoreService.$inject = ['$http', '$q','AppConstants'];

  function StoreService($http, $q, AppConstants) {

    if (window.JSON && !window.JSON.dateParser) {
      var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
      var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
      JSON.dateParser = function (key, value) {
          if (typeof value === 'string') {
              var a = reISO.exec(value);
              if (a)
                  return new Date(value);
              a = reMsAjax.exec(value);
              if (a) {
                  var b = a[1].split(/[-+,.]/);
                  return new Date(b[0] ? +b[0] : 0 - +b[1]);
              }
          }
          return value;
      };
    }

    var service = {
      SeedTable: SeedTable,
      GetAllRows: GetAllRows,
      AddRows: AddRows,
      GetPatientBySearchText: GetPatientBySearchText,
      UpdatePatient: UpdatePatient,
      SetNumber: SetNumber,
      GetPatientById: GetPatientById,
      GetBillNumberSearchText: GetBillNumberSearchText,
      UpdateGender: UpdateGender,
      DeleteRow: DeleteRow,
      GetDepartmentBySearchText: GetDepartmentBySearchText,
      GetBedsByWardId: GetBedsByWardId,
      GetAllBeds: GetAllBeds,
      UpdateBed: UpdateBed,
      GetShifts: GetShifts,
      GetSellableItemsBySearchText: GetSellableItemsBySearchText,
      DischargePatient: DischargePatient,
      GetBillsByEncounterId: GetBillsByEncounterId,
      UpdateSale: UpdateSale,
      GetDepartmentByDepartmentCode: GetDepartmentByDepartmentCode,
      GetPatientOnAdmission: GetPatientOnAdmission,
      GetRevenueDepartmentBySearchText: GetRevenueDepartmentBySearchText,
      UpdateSaleEntry: UpdateSaleEntry,
      GetBillsByBillId: GetBillsByBillId,
      GetSaleReceiptBySearchText: GetSaleReceiptBySearchText,
      UpdateSaleReceipt: UpdateSaleReceipt,
      VerifyUser: VerifyUser,
      GetAssesibleModules: GetAssesibleModules,
      UpdateStaffDetail: UpdateStaffDetail,
      GetGlobalConstants: GetGlobalConstants,
      GetSchemes: GetSchemes,
      GetSchemeTypes: GetSchemeTypes,
      GetSelectedSchemeType: GetSelectedSchemeType,


      UpdateGlobalConstant: UpdateGlobalConstant,
      GetIndexBySearchText: GetIndexBySearchText,
      GetCodingandIndexing: GetCodingandIndexing,
      UpdateWorkShift: UpdateWorkShift,
      GetShift_SaleRecipt: GetShift_SaleRecipt,
      GetShift_DepositReceipt: GetShift_DepositReceipt,
      GetDepartmentByRevDepartmentCode: GetDepartmentByRevDepartmentCode,
      GetDepositDepartment: GetDepositDepartment,
      GetStaffMemberBySearchText: GetStaffMemberBySearchText,
      GetCompiledShifts: GetCompiledShifts,
      GetShiftsForSurveillanve: GetShiftsForSurveillanve,
      GetPharmacyItems: GetPharmacyItems,
      UpdatePharmacyItem: UpdatePharmacyItem,
      GetSupplierBySearchText: GetSupplierBySearchText,
      UpdateSupplier: UpdateSupplier,
      GetPharamcyItemSuppliers: GetPharamcyItemSuppliers,
      GetPharmacyItemsForReconciliation: GetPharmacyItemsForReconciliation,
      GetPharmacyItemsForIssuanceAndRequisition: GetPharmacyItemsForIssuanceAndRequisition,
      UpdateRequisition: UpdateRequisition,
      UpdateRequisitionEntries: UpdateRequisitionEntries,
      GetDrugRequisitions: GetDrugRequisitions,
      GetDrugRequisitionEntries: GetDrugRequisitionEntries,
      GetSaleEntriessByReceiptId: GetSaleEntriessByReceiptId,
      DispenseDrugs: DispenseDrugs,
      GetRegisteredDrugs: GetRegisteredDrugs,
      GetStockBalancePerOutlet: GetStockBalancePerOutlet,
      GetExpiredDrugNotification: GetExpiredDrugNotification,
      GetDrugIssuanceCodes: GetDrugIssuanceCodes,
      GetDrugIssuanceEntries: GetDrugIssuanceEntries,
      GetDamagedDrugCodes: GetDamagedDrugCodes,
      GetDamagedDrugEntries: GetDamagedDrugEntries,
      GetReceivedItemCodes: GetReceivedItemCodes,
      GetReceivedSupplies: GetReceivedSupplies,
      GetOutletActivityReport: GetOutletActivityReport,
      UpdateObjectId: UpdateObjectId,

      GetNursesWaitingList: GetNursesWaitingList,
      UpdateEncounter: UpdateEncounter,
      GetDoctorsWaitingList: GetDoctorsWaitingList,
      GetPatientDetailsByEncounterId: GetPatientDetailsByEncounterId,
      GetTestParameters: GetTestParameters,
      UpdateParameter: UpdateParameter,
      UpdateSaleEntries: UpdateSaleEntries,
      GetWardDetails: GetWardDetails,
      GetRegisteredPatients: GetRegisteredPatients,
      GetPatientAdmsissionDetails: GetPatientAdmsissionDetails,
      GetStates: GetStates,
      GetSpecimenCollectionStatus: GetSpecimenCollectionStatus,
      SubmitSampleCollection: SubmitSampleCollection,
      GetTemplateAssignment: GetTemplateAssignment,
      EditTemplateAssignment: EditTemplateAssignment,
      GetServiceRequest: GetServiceRequest,
      GetPreparedResult: GetPreparedResult,
      UpdateLabResult: UpdateLabResult,
      UpdateLabResultEntry: UpdateLabResultEntry,
      GetLabResults: GetLabResults,
      GetLabResult: GetLabResult,
      SubmitVerificationData: SubmitVerificationData,
      GetLabResultForView: GetLabResultForView,
      GetDefaultLocation: GetDefaultLocation,
      UpdateWardStay: UpdateWardStay,
      FinalizeAndUnfinalizeBills: FinalizeAndUnfinalizeBills,
      GetHospitalScheme: GetHospitalScheme,
      GetPatientEncounters: GetPatientEncounters,
      GetDrugFlowEntries: GetDrugFlowEntries,
      GetRequestStatus: GetRequestStatus,
      GetPharmacistActivity: GetPharmacistActivity,
      GetDrugWithdrawals: GetDrugWithdrawals,
      GetDrugWithdrawalCodes: GetDrugWithdrawalCodes,
      GetShiftCompilationNumberBySearchText: GetShiftCompilationNumberBySearchText,
      GetPosWorkshiftBySearchText: GetPosWorkshiftBySearchText,
      GetPendingRadiologyRequests: GetPendingRadiologyRequests,
      GetRadiologyRequests: GetRadiologyRequests,
      GetDailyCashReportForServices: GetDailyCashReportForServices,
      CancelReceipt: CancelReceipt,
      GetDepositReceiptBySearchText: GetDepositReceiptBySearchText,
      GetOldPatients: GetOldPatients,
      GetRevisits: GetRevisits,
      GetNewPatients: GetNewPatients,
      GetShiftsForCompilation: GetShiftsForCompilation,
      GetCompiledShifts_DepositCollection: GetCompiledShifts_DepositCollection,
      GetCompiledShifts_SaleCollection: GetCompiledShifts_SaleCollection,
      GetDrugReturnCodes: GetDrugReturnCodes,
      GetPatientDrugReturnEntries: GetPatientDrugReturnEntries,
      UpdateXrayResult: UpdateXrayResult,
      GetPreparedResults: GetPreparedResults,
      GetPreparedRadiologyRequestsByPatientId: GetPreparedRadiologyRequestsByPatientId,
      GetSchemeDiscountUpdates: GetSchemeDiscountUpdates,
      GetReceiptListing: GetReceiptListing,
      GetDepositListing: GetDepositListing,
      GetReceiptDetails: GetReceiptDetails,
      GetWalkinPatientReceiptDetails: GetWalkinPatientReceiptDetails,
      GetDischargedPatients: GetDischargedPatients,
      CheckforSuperadmin: CheckforSuperadmin,
      GetReceiptDetailsByReceiptId: GetReceiptDetailsByReceiptId,
      GetSaleReceiptForDrugItems: GetSaleReceiptForDrugItems,
      GetPatientForAdmission: GetPatientForAdmission,
      GetLabResultBySearchText: GetLabResultBySearchText,
      GetFreeBedsBeds: GetFreeBedsBeds,
      GetAllOpenEncounters: GetAllOpenEncounters,
      GetConsultationTemplates: GetConsultationTemplates,
      GetClientData: GetClientData,
      GetWorkShift: GetWorkShift,
      PingServer: PingServer,
      GetAllReligion:GetAllReligion,
      SaveUpdates:SaveUpdates,
      UpdateClientData:UpdateClientData,
      GetPatientDiagnosis:GetPatientDiagnosis,
      UpdateSellableItem:UpdateSellableItem,
      getPatientBills:getPatientBills,
      backupDb:backupDb,
      restoreDb:restoreDb,
      checkIfPatientIsOnAdmission:checkIfPatientIsOnAdmission
    };

    return service;

    function createGuid() {
      var d = new Date().getTime();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }

    function SeedTable(tableName) {
      var url = "app/data/emr/patientregistration/" + tableName + ".json";

      $http.get(url).then(
        function (response) {

          lovefield.getDB().then(function (db) {
            var table = db.getSchema().table(tableName);

            db.select().from(table).exec().then(
              function (rows) {
                if (rows.length == 0) {

                  var rowz = response.data.map(function (obj) {
                    return table.createRow(obj);
                  });

                  db.insertOrReplace().into(table).values(rowz).exec()
                    .then(function (reply) {
                      console.log(reply);
                    }).catch(function (error) {
                      console.log(error);
                    });
                }
              });
          });
        });
    }

    function GetAllRows(isDrug, tableName, lastUpdated) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);

        var department = db.getSchema().table('Department');

        var query = db.select()
          .from(table)

        if (tableName == 'Patient') {
          var gender = db.getSchema().table('Gender');
          var maritalState = db.getSchema().table('MaritalState');
          var religion = db.getSchema().table('Religion');
          var currentBed = db.getSchema().table('Bed');
          var currentWard = db.getSchema().table('Department');
          var schemeMembership = db.getSchema().table('SchemeMembership');
          var scheme = db.getSchema().table('Scheme');
          var encounter = db.getSchema().table('Encounter');
          var wardStay = db.getSchema().table('WardStayHistory');
          var schemePlansTable = db.getSchema().table('SchemePlans');
          var vitalSignsTable = db.getSchema().table('VitalSigns');

          query = query.innerJoin(gender, table.GenderId.eq(gender.Id)).
            innerJoin(maritalState, table.MaritalStateId.eq(maritalState.Id)).
            leftOuterJoin(encounter, table.Id.eq(encounter.PatientId)).
            leftOuterJoin(wardStay, encounter.Id.eq(wardStay.EncounterId)).
            leftOuterJoin(schemeMembership, table.Id.eq(schemeMembership.PatientId)).
            leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
            leftOuterJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id)).
            leftOuterJoin(currentWard, currentBed.DepartmentId.eq(currentWard.Id)).
            leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
            leftOuterJoin(religion, table.ReligionId.eq(religion.Id)).
            leftOuterJoin(vitalSignsTable,encounter.Id.eq(vitalSignsTable.EncounterId)).
            orderBy(encounter.LocalId, lf.Order.DESC);
        }

        if (tableName == 'Bed') {
          query = query.innerJoin(department, table.DepartmentId.eq(department.Id));
        }

        if (tableName == 'SellableItem') {
          var revenueDepartment = db.getSchema().table('RevenueDepartment');


          query = query.leftOuterJoin(department, table.ServiceDepartmentId.eq(department.Id)).
            leftOuterJoin(revenueDepartment, table.RevenueDepartmentId.eq(revenueDepartment.Id));

          isDrug = isDrug == undefined ? false : isDrug;
          query.where(lf.op.and(table.IsDeleted.eq(false), table.IsDrug.eq(isDrug)))
            .exec()
            .then(
            function (rows) {
              deferred.resolve(rows);
            });
        } else {
          query.where(table.IsDeleted.eq(false))
            .exec()
            .then(
            function (rows) {

              if (tableName == 'Patient') {
                rows = _.uniqBy(rows, 'Patient.LocalId'); //joining with encounter table produces multiple tables.
              }
              deferred.resolve(rows);
            });
        }
      });
      return deferred.promise;
    }

    function GetPatientDiagnosis(encounterId){
      var deferred = $q.defer();
      lovefield.getDB().then(function(db){
      //  var encounterTable = db.getSchema().table('Encounter');
        var consultationTable = db.getSchema().table("Consultations");
        var diagnosisEntriesTable = db.getSchema().table('DiagnosisEntries');

        db.select()
        .from(diagnosisEntriesTable)
        .innerJoin(consultationTable,diagnosisEntriesTable.ConsultationId.eq(consultationTable.Id))
       // .innerJoin(encounterTable,consultationTable)
       .where(
         lf.op.and(
          consultationTable.EncounterId.eq(encounterId),
          diagnosisEntriesTable.IsDeleted.eq(false)
         )
       ).exec().then(function(diagnosis){
          deferred.resolve(diagnosis);
       });
      });
      return deferred.promise;
    }



    function GetPatientForAdmission() {
      var deferred = $q.defer();
      var date = new Date();
      var today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var gender = db.getSchema().table('Gender');
        var maritalState = db.getSchema().table('MaritalState');
        var religion = db.getSchema().table('Religion');
        var encounterTable = db.getSchema().table('Encounter');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var scheme = db.getSchema().table('Scheme');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        var wardStayTable = db.getSchema().table("WardStayHistory");
        var currentBed = db.getSchema().table('Bed');
        //var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(patientTable).

          innerJoin(gender, patientTable.GenderId.eq(gender.Id)).
          innerJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
          leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
          innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
          leftOuterJoin(wardStayTable, encounterTable.Id.eq(wardStayTable.EncounterId)).
          leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
          leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
          leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
          leftOuterJoin(currentBed, wardStayTable.NewBedId.eq(currentBed.Id)).
          orderBy(encounterTable.LocalId, lf.Order.DESC).
          where(
          lf.op.and(
            patientTable.IsDeleted.eq(false),
            encounterTable.StartDate.gte(today),
            lf.op.or(
              currentBed.Id.eq(null),
              currentBed.IsOccupied.eq(false)
            ),

            lf.op.or(
              wardStayTable.Id.eq(null),
              wardStayTable.IsDischarged.eq(true)
            )
          )
          ).exec().then(function (patients) {

            var uniquePatients = _.uniqBy(patients, 'Patient.LocalId');

            deferred.resolve(uniquePatients);
          });
      });
      return deferred.promise;
    }

    function AddRows(rows, tableName, clientId) {
      var deferred = $q.defer();

      //var tempTableId = createGuid();
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);
        rows.IsActive = true;
        rows.IsDeleted = false;
        rows.CreationDate = new Date();
        rows.ObjectName = tableName;
        rows.LastModifiedDate = new Date();
        rows.LastSynchTime = rows.LastSynchTime != null ? new Date(rows.LastSynchTime) : null;
        rows.Id = createGuid();

        var row = table.createRow(rows);

        db.insertOrReplace()
          .into(table)
          .values([row])
          .exec()
          .then(
          function (newEntries) {
            var updatedEntryId = clientId + '0' + newEntries[0].LocalId;

            db.update(table).
              set(table.Id, (updatedEntryId)).
              where(
              table.LocalId.eq(newEntries[0].LocalId)).
              exec().then(function () {
                newEntries[0].Id = updatedEntryId;
                deferred.resolve(newEntries[0]);
              });
          });

      });
      return deferred.promise;
    }

    // function UpdateSchemeMembership(schemeMembership) {

    //     var deferred = $q.defer();

    //     lovefield.getDB().then(function(db) {

    //         var table = db.getSchema().table('SchemeMembership');


    //         db.update(table).
    //         set(table.Percentage, schemeMembership.Percentage).

    //         set(table.SchemePlansId, schemeMembership.SchemePlansId).
    //         set(table.MemberType, schemeMembership.MemberType).
    //         set(table.CardHolderName, schemeMembership.CardHolderName).
    //         set(table.CardHolderInsuranceNumber, schemeMembership.CardHolderInsuranceNumber).
    //         set(table.BeneficiaryName, schemeMembership.BeneficiaryName).
    //         set(table.LastModifiedDate, new Date()).
    //         set(table.RelationshipWithCardHolderId, schemeMembership.RelationshipWithCardHolderId).

    //         where(
    //             table.Id.eq(schemeMembership.Id)).
    //         exec().then(
    //             function() {
    //                 deferred.resolve();
    //             });
    //     });
    //     return deferred.promise;
    // }




    function UpdatePatient(patient) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('Patient');

        db.update(table).
          set(table.PatientCategory, patient.PatientCategory).
          set(table.Surname, patient.Surname).
          set(table.StateId, patient.StateId).
          set(table.OtherNames, patient.OtherNames).
          set(table.PhoneNumber, patient.PhoneNumber).
          set(table.GenderId, patient.GenderId).
          set(table.Email, patient.Email).
          set(table.DateOfBirth, patient.DateOfBirth).
          set(table.NextOfKinName, patient.NextOfKinName).
          set(table.MaritalStateId, patient.MaritalStateId).
          set(table.NextOfKinAddress, patient.NextOfKinAddress).
          set(table.ReligionId, patient.ReligionId).
          set(table.NextOfKinPhoneNumber, patient.NextOfKinPhoneNumber).
          set(table.EthnicGroup, patient.EthnicGroup).
          set(table.ResidentialAddress, patient.ResidentialAddress).
          set(table.RelationshipWithNokId, patient.RelationshipWithNokId).
          set(table.HospitalTransferredFrom, patient.HospitalTransferredFrom).
          set(table.DateOfTransfer, patient.DateOfTransfer).
          set(table.ReferralAuthorizedBy, patient.ReferralAuthorizedBy).
          set(table.ReasonForTransfer, patient.ReasonForTransfer).
          set(table.HighestEducationalQualification, patient.HighestEducationalQualification).
          set(table.Occupation, patient.Occupation).
          set(table.AccomodationType, patient.AccomodationType).
          set(table.HasAccessToTelephone, patient.HasAccessToTelephone).
          set(table.HasAccessToInternet, patient.HasAccessToInternet).
          set(table.HasAccessToElectricity, patient.HasAccessToElectricity).
          set(table.HasAccessToCleanWater, patient.HasAccessToCleanWater).
          set(table.IsLocalityHostile, patient.IsLocalityHostile).
          set(table.IsAParent, patient.IsAParent).
          set(table.HoursSpentWithFamilyPerDay, patient.HoursSpentWithFamilyPerDay).
          set(table.InvolvesSpouseInFamilyDecisionMaking, patient.InvolvesSpouseInFamilyDecisionMaking).
          set(table.FamilyAffectionLevel, patient.FamilyAffectionLevel).
          set(table.HasEverSufferedDomesticViolence, patient.HasEverSufferedDomesticViolence).
          set(table.WasImpregnatedAsATeenager, patient.WasImpregnatedAsATeenager).
          set(table.HasEverBeenInPrison, patient.HasEverBeenInPrison).
          set(table.HasEverBeenAbusedAsAChild, patient.HasEverBeenAbusedAsAChild).
          set(table.HasEverWithdrawnFromSchool, patient.HasEverWithdrawnFromSchool).
          set(table.HasAnyAddiction, patient.HasAnyAddiction).
          set(table.HasEverBeenSexuallyAbused, patient.HasEverBeenSexuallyAbused).
          set(table.DoesExercise, patient.DoesExercise).
          set(table.TakesCoffee, patient.TakesCoffee).
          set(table.TakesSoftDrink, patient.TakesSoftDrink).
          set(table.CurrentlyOnDiet, patient.CurrentlyOnDiet).
          set(table.DietPlan, patient.DietPlan).
          set(table.LastModifiedDate, new Date()).
          set(table.ExerciseMinutesPerDay, patient.ExerciseMinutesPerDay).
          set(table.CoffeeCupsPerDay, patient.CoffeeCupsPerDay).
          set(table.SoftDrinkBottlesPerDay, patient.SoftDrinkBottlesPerDay).
          set(table.EatsHighCholesterolFood, patient.EatsHighCholesterolFood).
          set(table.HoursOfSleepPerDay, patient.HoursOfSleepPerDay).
          set(table.TakesSleepingMedications, patient.TakesSleepingMedications).
          set(table.HasSufferedSleepDisorder, patient.HasSufferedSleepDisorder).
          set(table.SleepDisorderDetails, patient.SleepDisorderDetails).
          set(table.RhesusFactorId, patient.RhesusFactorId).
          set(table.GenotypeId, patient.GenotypeId).
          set(table.BloodTypeId, patient.BloodTypeId).
          where(
          table.Id.eq(patient.Id)).
          exec().then(
          function () {
            deferred.resolve();
          });
      });
      return deferred.promise;
    }

    function SetNumber(row, newNumber, tableName) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);
        db.update(table).
          set(table.Number, (newNumber)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(row.Id)
          ).
          exec();
      });
    }

    function UpdateRequisitionEntries(row, tableName) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);
        db.update(table).
          set(table.Quantity, (row.Quantity)).
          set(table.IssuedBy, (row.IssuedBy)).
          set(table.IsGranted, (row.IsGranted)).
          set(table.IssuanceDate, (new Date())).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(row.Id)
          ).
          exec();
      });
    }

    function UpdateRequisition(row, tableName) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);
        db.update(table).
          set(table.IssuanceNumber, (row.IssuanceNumber)).

          set(table.IsGranted, (row.IsGranted)).
          set(table.IssuanceDate, (new Date())).
          set(table.IssuedBy, (row.IssuedBy)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(row.Id)
          ).
          exec();
      });
    }

    function GetDrugRequisitions(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var drugRequisitionTable = db.getSchema().table('DrugRequisition');

        var requestingStaffTable = db.getSchema().table('StaffMember').as('RequestingStaff');
        var issuingStaffTable = db.getSchema().table('StaffMember').as('IssuingStaff');

        db.select(drugRequisitionTable.Number.as('RequisitionNumber'), drugRequisitionTable.IssuanceNumber.as('IssuanceNumber'),
          requestingStaffTable.Username.as('RaisedBy'), issuingStaffTable.Username.as('IssuedBy'), drugRequisitionTable.RequestDate.as('RequestDate'), drugRequisitionTable.IssuanceDate.as('IssuanceDate'),
          drugRequisitionTable.IsGranted.as('IsGranted'), drugRequisitionTable.Id.as('Id'))
          .from(drugRequisitionTable)

          .leftOuterJoin(requestingStaffTable, drugRequisitionTable.RaisedBy.eq(requestingStaffTable.Id))
          .leftOuterJoin(issuingStaffTable, drugRequisitionTable.IssuedBy.eq(issuingStaffTable.Id))
          .where(
          lf.op.and(
            drugRequisitionTable.IsDeleted.eq(false),
            //  drugRequisitionTable.IssuingOutletId.eq(issuingOutletId),
            //   drugRequisitionTable.IsRequisition.eq(true),
            lf.op.or(
              drugRequisitionTable.RequestDate.between(startDate, endDate),
              drugRequisitionTable.IssuanceDate.between(startDate, endDate)
            )
          )
          ).exec()
          .then(function (requisitions) {
            deferred.resolve(requisitions);
          });
      });
      return deferred.promise;
    }



    function GetPatientBySearchText(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var patientTable = db.getSchema().table('Patient');

        var gender = db.getSchema().table('Gender');
        var maritalState = db.getSchema().table('MaritalState');
        var religion = db.getSchema().table('Religion');
        var encounter = db.getSchema().table('Encounter');
        var wardStay = db.getSchema().table('WardStayHistory');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var scheme = db.getSchema().table('Scheme');
        var currentBed = db.getSchema().table('Bed');
        var oldBed = db.getSchema().table('Bed').as('OldBed');
        var currentWard = db.getSchema().table('Department');
        var oldWard = db.getSchema().table('Department').as('OldWard');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(patientTable).

          innerJoin(gender, patientTable.GenderId.eq(gender.Id)).
          innerJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
          leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
          leftOuterJoin(encounter, patientTable.Id.eq(encounter.PatientId)).
          leftOuterJoin(wardStay, encounter.Id.eq(wardStay.EncounterId)).
          leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
          leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
          leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
          leftOuterJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id)).
          leftOuterJoin(oldBed, wardStay.OldBedId.eq(oldBed.Id)).
          leftOuterJoin(currentWard, currentBed.DepartmentId.eq(currentWard.Id)).
          leftOuterJoin(oldWard, oldBed.DepartmentId.eq(oldWard.Id)).
          orderBy(encounter.LocalId, lf.Order.DESC).
          where(
          lf.op.and(
            patientTable.IsDeleted.eq(false),
            // currentBed.IsOccupied.eq(true),
            lf.op.or(
              patientTable.Number.match(searchTextMatcher),
              patientTable.Surname.match(searchTextMatcher),
              patientTable.OtherNames.match(searchTextMatcher)
              //  currentBed.IsOccupied.eq(true)
            )
          )
          ).exec().
          then(function (patients) {

            var uniquePatients = _.uniqBy(patients, 'Patient.LocalId');
            deferred.resolve(uniquePatients);
          });
      });
      return deferred.promise;
    }

    function GetAllReligion() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var religionTable = db.getSchema().table('Religion');

        db.select().
          from(religionTable).
          where(
            religionTable.IsDeleted.eq(false)
          ).
          exec().
          then(function (religions) {
            deferred.resolve(religions);
          });
      });
      return deferred.promise;
    }


    function GetStaffMemberBySearchText(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var staffMemberTable = db.getSchema().table('StaffMember');
        var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(staffMemberTable).
          where(
          lf.op.and(
            staffMemberTable.IsDeleted.eq(false),
            lf.op.or(
              staffMemberTable.LastName.match(searchTextMatcher),
              staffMemberTable.OtherNames.match(searchTextMatcher),
              staffMemberTable.Username.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (staffMembers) {
            deferred.resolve(staffMembers);
          });
      });
      return deferred.promise;
    }



    function GetDepartmentBySearchText(searchText, category) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var departmentTable = db.getSchema().table('Department');

        var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(departmentTable).
          where(
          lf.op.and(
            departmentTable.IsDeleted.eq(false),
            lf.op.or(
              departmentTable.Name.match(searchTextMatcher),
              departmentTable.Code.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (departments) {
            if (category != '' && category !== null) {
              departments = departments.filter(function (department) { return department.Category === category; });
            }
            deferred.resolve(departments);
          });
      });
      return deferred.promise;
    }

    function GetPharamcyItemSuppliers(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var supplierRegisterTable = db.getSchema().table('SupplierRegister');

        var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(supplierRegisterTable).
          where(
          lf.op.and(
            supplierRegisterTable.IsDeleted.eq(false),
            lf.op.or(
              supplierRegisterTable.SupplierName.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (suppliers) {
            deferred.resolve(suppliers);
          });
      });
      return deferred.promise;
    }

    function GetSupplierBySearchText(searchText) {

      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var supplierRegisterTable = db.getSchema().table('SupplierRegister');


        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(supplierRegisterTable)

          .where(
          lf.op.and(
            supplierRegisterTable.IsDeleted.eq(false),
            supplierRegisterTable.SupplierName.match(searchTextMatcher)
          )
          ).exec().
          then(function (supplier) {
            deferred.resolve(supplier);
          });
      });
      return deferred.promise;
    }

    function GetIndexBySearchText(searchText, tableName) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var indexTable = db.getSchema().table(tableName);
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(indexTable).
          where(
          lf.op.and(
            indexTable.IsDeleted.eq(false),
            lf.op.or(
              indexTable.Name.match(searchTextMatcher),
              indexTable.Code.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (indecies) {
            deferred.resolve(indecies);
          });
      });
      return deferred.promise;
    }


    function GetRevenueDepartmentBySearchText(searchText) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var departmentTable = db.getSchema().table('RevenueDepartment');
        var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(departmentTable).
          where(
          lf.op.and(
            departmentTable.IsDeleted.eq(false),
            lf.op.or(
              departmentTable.Name.match(searchTextMatcher),
              departmentTable.Code.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (departments) {
            deferred.resolve(departments);
          });
      });
      return deferred.promise;
    }

    function GetPharmacyItemsForReconciliation(pharmacyOutletId, searchText) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var departmentTable = db.getSchema().table('Department');
        var sellableItemTable = db.getSchema().table('SellableItem');

        var sellableItemDispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var drugformulationTable = db.getSchema().table('DrugFormulation');

        var searchTextMatcher = new RegExp(searchText, "i");

        db.select()
          .from(sellableItemTable)

          .leftOuterJoin(sellableItemDispatchLogTable, sellableItemTable.Id.eq(sellableItemDispatchLogTable.SellableItemId))
          .leftOuterJoin(departmentTable, sellableItemDispatchLogTable.DepartmentId.eq(departmentTable.Id))

          .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
          .where(
          lf.op.and(
            sellableItemTable.IsDeleted.eq(false),
            sellableItemTable.IsActive.eq(true),
            sellableItemTable.IsDrug.eq(true),
            sellableItemDispatchLogTable.DepartmentId.eq(pharmacyOutletId),
            lf.op.or(
              sellableItemTable.Name.match(searchTextMatcher),
              sellableItemTable.BrandName.match(searchTextMatcher),
              sellableItemTable.Code.match(searchTextMatcher)
            )
          )
          ).exec().then(function (pharmacyItems) {
            deferred.resolve(pharmacyItems);
          });

      });
      return deferred.promise;
    }

    function GetExpiredDrugNotification(startDate, endDate) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {


        var supplyBatchTable = db.getSchema().table('SupplyBatch');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var supplyTable = db.getSchema().table('Supply');

        db.select(supplyBatchTable.ExpiryDate.as('ExpiryDate'), sellableItemTable.Name.as('Name'), sellableItemTable.BrandName.as('BrandName'),
          supplyTable.InvoiceNumber.as('InvoiceNumber'), supplyBatchTable.BatchNumber.as('BatchNumber')).from(supplyBatchTable)

          .innerJoin(sellableItemTable, supplyBatchTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(supplyTable, supplyBatchTable.SupplyId.eq(supplyTable.Id))
          .where(
          lf.op.and(
            supplyBatchTable.IsDeleted.eq(false),
            supplyBatchTable.ExpiryDate.between(startDate, endDate)
          )
          ).exec().then(function (supplyBatch) {
            deferred.resolve(supplyBatch);
          });
      });
      return deferred.promise;
    }

    function GetDrugIssuanceCodes(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        //  var sellableItemTable = db.getSchema().table('SellableItem');
        var drugRequisitionTable = db.getSchema().table('DrugRequisition');
        // var drugRequisitionEntriesTable = db.getSchema().table('DrugRequisitionEntries');
        // var issuingOutletTable = db.getSchema().table('Department').as('IssuingOutlet');
        // var receivingOutletTable = db.getSchema().table('Department').as('ReceivingOutlet');
        // var searchTextMatcher = new RegExp(searchText, "i");

        db.select().from(drugRequisitionTable)

          // .innerJoin(drugRequisitionEntriesTable,drugRequisitionTable.Id.eq(drugRequisitionEntriesTable.DrugRequisitionId))
          // .innerJoin(sellableItemTable,drugRequisitionEntriesTable.SellableItemId.eq(sellableItemTable.Id))
          // .innerJoin(issuingOutletTable,drugRequisitionEntriesTable.IssuingOutletId.eq(issuingOutletTable.Id))
          // .innerJoin(receivingOutletTable,drugRequisitionEntriesTable.ReceivingOutletId.eq(receivingOutletTable.Id))
          .where(
          lf.op.and(
            drugRequisitionTable.IsDeleted.eq(false),
            drugRequisitionTable.IsGranted.eq(true),
            drugRequisitionTable.IssuanceNumber.neq(null),
            drugRequisitionTable.IssuanceDate.between(startDate, endDate)
          )
          ).exec().then(function (drugRequisitions) {
            deferred.resolve(drugRequisitions);
          });
      });
      return deferred.promise;
    }

    function GetDamagedDrugCodes(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {


        var damagedDrugTable = db.getSchema().table('DamagedDrugCapture');
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().from(damagedDrugTable)

          .where(
          lf.op.and(
            damagedDrugTable.IsDeleted.eq(false),
            damagedDrugTable.Number.match(searchTextMatcher)
          )
          ).exec().then(function (damagedDrugs) {
            deferred.resolve(damagedDrugs);
          });
      });
      return deferred.promise;
    }

    function GetDrugReturnCodes(searchText) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {


        var drugReturnTable = db.getSchema().table('DrugReturn');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().from(drugReturnTable)

          .innerJoin(encounterTable, drugReturnTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .where(
          lf.op.and(
            drugReturnTable.IsDeleted.eq(false),
            drugReturnTable.Number.match(searchTextMatcher)
          )
          ).exec().then(function (drugReturns) {

            var uniqueReturns = _.uniqBy(drugReturns, 'DrugReturn.LocalId');
            deferred.resolve(uniqueReturns);
          });
      });
      return deferred.promise;
    }

    function GetReceivedItemCodes(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {


        var supplyTable = db.getSchema().table('Supply');
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().from(supplyTable)

          .where(
          lf.op.and(
            supplyTable.IsDeleted.eq(false),
            supplyTable.Number.match(searchTextMatcher)
          )
          ).exec().then(function (supplies) {
            deferred.resolve(supplies);
          });
      });
      return deferred.promise;
    }


    function GetDamagedDrugEntries(captureCode) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var sellableItemTable = db.getSchema().table('SellableItem');
        var outletTable = db.getSchema().table('Department');
        var staffMemberTable = db.getSchema().table('StaffMember');
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');

        db.select(sellableItemTable.Name.as('Name'), sellableItemTable.BrandName.as('BrandName'), outletTable.Name.as('OutletName'), dispatchLogTable.Number.as('Number'),
          dispatchLogTable.Date.as('Date'), dispatchLogTable.Quantity.as('Quantity'), staffMemberTable.OtherNames.as('OtherNames'), staffMemberTable.LastName.as('LastName'))
          .from(dispatchLogTable)

          .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(outletTable, dispatchLogTable.DepartmentId.eq(outletTable.Id))
          .innerJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))
          .where(
          lf.op.and(
            dispatchLogTable.IsDeleted.eq(false),
            dispatchLogTable.Number.eq(captureCode)
          )
          ).exec().then(function (damageddrugentries) {
            deferred.resolve(damageddrugentries);
          });
      });
      return deferred.promise;
    }

    function GetPatientDrugReturnEntries(returnCode, startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var sellableItemTable = db.getSchema().table('SellableItem');
        var outletTable = db.getSchema().table('Department');
        var staffMemberTable = db.getSchema().table('StaffMember');
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var drugReturnTable = db.getSchema().table('DrugReturn');
        var genderTable = db.getSchema().table('Gender');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        if (returnCode != undefined) {
          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('PatientOtherNames'), patientTable.Number.as('PatientNumber'), patientTable.DateOfBirth.as('DateOfBirth'),
            genderTable.Name.as('GenderName'), dispatchLogTable.ReceiptNumber.as('ReceiptNumber'), drugReturnTable.PerformedAt.as('PerformedAt'), dispatchLogTable.Amount.as('Amount'),
            sellableItemTable.Name.as('Name'), dispatchLogTable.UnitCost.as('Price'), sellableItemTable.BrandName.as('BrandName'), outletTable.Name.as('OutletName'), dispatchLogTable.Number.as('ReturnCode'),
            dispatchLogTable.Date.as('Date'), dispatchLogTable.Quantity.as('ReturnedQuantity'), staffMemberTable.OtherNames.as('OtherNames'), staffMemberTable.LastName.as('LastName'))
            .from(dispatchLogTable)

            .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(outletTable, dispatchLogTable.DepartmentId.eq(outletTable.Id))
            .innerJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))
            .innerJoin(drugReturnTable, dispatchLogTable.Number.eq(drugReturnTable.Number))
            .innerJoin(encounterTable, drugReturnTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
            .where(
            lf.op.and(
              dispatchLogTable.IsDeleted.eq(false),
              dispatchLogTable.Number.eq(returnCode)

            )
            ).exec().then(function (drugReturnEntries) {
              deferred.resolve(drugReturnEntries);
            });
        } else {
          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('PatientOtherNames'), patientTable.Number.as('PatientNumber'), patientTable.DateOfBirth.as('DateOfBirth'),
            genderTable.Name.as('GenderName'), dispatchLogTable.ReceiptNumber.as('ReceiptNumber'), drugReturnTable.PerformedAt.as('PerformedAt'), dispatchLogTable.Amount.as('Amount'),
            sellableItemTable.Name.as('Name'), dispatchLogTable.UnitCost.as('Price'), sellableItemTable.BrandName.as('BrandName'), outletTable.Name.as('OutletName'), dispatchLogTable.Number.as('ReturnCode'),
            dispatchLogTable.Date.as('Date'), dispatchLogTable.Quantity.as('ReturnedQuantity'), staffMemberTable.OtherNames.as('OtherNames'), staffMemberTable.LastName.as('LastName'))
            .from(dispatchLogTable)

            .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(outletTable, dispatchLogTable.DepartmentId.eq(outletTable.Id))
            .innerJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))
            .innerJoin(drugReturnTable, dispatchLogTable.Number.eq(drugReturnTable.Number))
            .innerJoin(encounterTable, drugReturnTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
            .where(
            lf.op.and(
              dispatchLogTable.IsDeleted.eq(false),
              dispatchLogTable.Date.between(startDate, endDate)

            )
            ).exec().then(function (drugReturnEntries) {
              deferred.resolve(drugReturnEntries);
            });
        }

      });
      return deferred.promise;
    }

    function GetReceivedSupplies(supplyId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var sellableItemTable = db.getSchema().table('SellableItem');
        var outletTable = db.getSchema().table('Department');
        var staffMemberTable = db.getSchema().table('StaffMember');
        var supplyBatchTable = db.getSchema().table('SupplyBatch');

        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var supplyTable = db.getSchema().table('Supply');
        var supplierTable = db.getSchema().table('SupplierRegister')
        var departmentTable = db.getSchema().table('Department');

        db.select(sellableItemTable.Name.as('Name'), supplyTable.InvoiceNumber.as('InvoiceNumber'), supplyTable.Number.as('Number'), sellableItemTable.BrandName.as('BrandName'),
          supplyBatchTable.DateReceived.as('Date'), supplyBatchTable.BatchNumber.as('BatchNumber'), supplyBatchTable.ExpiryDate.as('ExpiryDate'), sellableItemTable.CostPrice.as('UnitCost'),
          sellableItemTable.Strength.as('DrugStrength'), drugformulationTable.Name.as('Formulation'), supplyBatchTable.RecievedQuantity.as('Quantity'), departmentTable.Name.as('OutletName'), supplyTable.DeliveredBy.as('SupplierRep'),
          supplierTable.SupplierName.as('SupplierName'), staffMemberTable.OtherNames.as('OtherNames'), staffMemberTable.LastName.as('LastName'))

          .from(supplyBatchTable)

          .innerJoin(sellableItemTable, supplyBatchTable.SellableItemId.eq(sellableItemTable.Id))

          .innerJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
          .innerJoin(staffMemberTable, supplyBatchTable.ReceivedBy.eq(staffMemberTable.Id))
          .innerJoin(supplyTable, supplyBatchTable.SupplyId.eq(supplyTable.Id))
          .innerJoin(supplierTable, supplyTable.SupplierId.eq(supplierTable.Id))
          .innerJoin(departmentTable, supplyBatchTable.DepartmentId.eq(departmentTable.Id))
          .where(
          lf.op.and(
            supplyBatchTable.IsDeleted.eq(false),
            supplyTable.Id.eq(supplyId)
          )
          ).exec().then(function (damageddrugentries) {
            deferred.resolve(damageddrugentries);
          });
      });
      return deferred.promise;
    }

    function GetOutletActivityReport(outletId, startDate, endDate) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var departmentTable = db.getSchema().table('Department');

        var staffMemberTable = db.getSchema().table('StaffMember');
        var sellableItemTable = db.getSchema().table('SellableItem');

        db.select(departmentTable.Name.as('OutletName'), staffMemberTable.LastName.as('LastName'), staffMemberTable.OtherNames.as('OtherNames'), dispatchLogTable.Activity.as('Activity'),
          dispatchLogTable.Quantity.as('Quantity'), dispatchLogTable.Date.as('Date'), sellableItemTable.Name.as('ItemName'), sellableItemTable.BrandName.as('BrandName'), dispatchLogTable.Number.as('TransRef'),
          dispatchLogTable.InitialStockCount.as('InitialQuantity'), dispatchLogTable.FinalStockCount.as('FinalQuantity'), dispatchLogTable.Description.as('Description')).from(dispatchLogTable)

          .innerJoin(departmentTable, dispatchLogTable.DepartmentId.eq(departmentTable.Id))
          .innerJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))
          .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
          .where(
          lf.op.and(
            dispatchLogTable.IsDeleted.eq(false),
            dispatchLogTable.Date.between(startDate, endDate),
            dispatchLogTable.DepartmentId.eq(outletId)
          )
          ).exec().then(function (outletActivities) {
            deferred.resolve(outletActivities);
          });
      });
      return deferred.promise;
    }


    function GetPharmacistActivity(staffId, startDate, endDate) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var departmentTable = db.getSchema().table('Department');

        var staffMemberTable = db.getSchema().table('StaffMember');
        var sellableItemTable = db.getSchema().table('SellableItem');

        db.select(
          departmentTable.Name.as('OutletName'), staffMemberTable.LastName.as('LastName'), staffMemberTable.OtherNames.as('OtherNames'), dispatchLogTable.Activity.as('Activity'),
          dispatchLogTable.Quantity.as('Quantity'), dispatchLogTable.Date.as('Date'), sellableItemTable.Name.as('ItemName'), sellableItemTable.BrandName.as('BrandName'), dispatchLogTable.Number.as('TransRef'),
          dispatchLogTable.InitialStockCount.as('InitialQuantity'), dispatchLogTable.FinalStockCount.as('FinalQuantity'), dispatchLogTable.Description.as('Description')).from(dispatchLogTable)

          .innerJoin(departmentTable, dispatchLogTable.DepartmentId.eq(departmentTable.Id))
          .innerJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))
          .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
          .where(
          lf.op.and(
            dispatchLogTable.IsDeleted.eq(false),
            dispatchLogTable.Date.between(startDate, endDate),
            staffMemberTable.Id.eq(staffId)
          )
          ).exec().then(function (outletActivities) {
            deferred.resolve(outletActivities);
          });
      });
      return deferred.promise;
    }


    function GetDrugIssuanceEntries(issuanceId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var sellableItemTable = db.getSchema().table('SellableItem');
        var drugRequisitionTable = db.getSchema().table('DrugRequisition');
        var drugRequisitionEntriesTable = db.getSchema().table('DrugRequisitionEntries');
        var issuingOutletTable = db.getSchema().table('Department').as('IssuingOutlet');
        var receivingOutletTable = db.getSchema().table('Department').as('ReceivingOutlet');
        var staffMemberTable = db.getSchema().table('StaffMember').as('IssuingStaff');
        var receivingStaffTable = db.getSchema().table('StaffMember').as('ReceivingStaff');

        db.select(sellableItemTable.Name.as('Name'), sellableItemTable.BrandName.as('BrandName'), issuingOutletTable.Name.as('IssuingOutletName'), receivingOutletTable.Name.as('ReceivingOutletName'),
          drugRequisitionTable.IssuanceNumber.as('IssuanceNumber'), drugRequisitionTable.IssuanceDate.as('Date'), drugRequisitionEntriesTable.Quantity.as('Quantity'), receivingStaffTable.OtherNames.as('ReceivingStaffOtherNames'), receivingStaffTable.LastName.as('ReceivingStaffLastName'), staffMemberTable.OtherNames.as('IssuingOtherNames'), staffMemberTable.LastName.as('IssuingLastName')).from(drugRequisitionEntriesTable)

          .innerJoin(drugRequisitionTable, drugRequisitionEntriesTable.DrugRequisitionId.eq(drugRequisitionTable.Id))
          .innerJoin(sellableItemTable, drugRequisitionEntriesTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(issuingOutletTable, drugRequisitionTable.IssuingOutletId.eq(issuingOutletTable.Id))
          .innerJoin(receivingOutletTable, drugRequisitionTable.ReceivingOutletId.eq(receivingOutletTable.Id))
          .innerJoin(staffMemberTable, drugRequisitionTable.IssuedBy.eq(staffMemberTable.Id))
          .innerJoin(receivingStaffTable, drugRequisitionTable.RaisedBy.eq(receivingStaffTable.Id))
          .where(
          lf.op.and(
            drugRequisitionEntriesTable.IsDeleted.eq(false),
            drugRequisitionTable.IsGranted.eq(true),
            drugRequisitionTable.IssuanceNumber.neq(null),
            drugRequisitionTable.Id.eq(issuanceId)
          )
          ).exec().then(function (drugRequisitionsEntries) {
            deferred.resolve(drugRequisitionsEntries);
          });
      });
      return deferred.promise;
    }

    function GetSellableItemsBySearchText(searchText, isDrug, departmentId) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var sellableItemTable = db.getSchema().table('SellableItem');

        var drugclassificationTable = db.getSchema().table('DrugClassification');
        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');

        var departmentTable = db.getSchema().table('Department');
        var searchTextMatcher = new RegExp(searchText, "i");
        if (departmentId != null ) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))

            .leftOuterJoin(dispatchLogTable, sellableItemTable.Id.eq(dispatchLogTable.SellableItemId))
            .leftOuterJoin(departmentTable, sellableItemTable.ServiceDepartmentId.eq(departmentTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false), sellableItemTable.IsActive.eq(true),
              sellableItemTable.IsDrug.eq(isDrug),
              sellableItemTable.ServiceDepartmentId.eq(departmentId),
              lf.op.or(
                sellableItemTable.Name.match(searchTextMatcher),
                sellableItemTable.BrandName.match(searchTextMatcher),
                sellableItemTable.Code.match(searchTextMatcher)

              )
            )
            ).exec().
            then(function (sellableItems) {
              deferred.resolve(sellableItems);
            });
        } else {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))

            .leftOuterJoin(dispatchLogTable, sellableItemTable.Id.eq(dispatchLogTable.SellableItemId))
            .leftOuterJoin(departmentTable, sellableItemTable.ServiceDepartmentId.eq(departmentTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false), sellableItemTable.IsActive.eq(true),
              sellableItemTable.IsDrug.eq(isDrug),
              lf.op.or(
                sellableItemTable.Name.match(searchTextMatcher),
                sellableItemTable.BrandName.match(searchTextMatcher),
                sellableItemTable.Code.match(searchTextMatcher)
              )
            )
            ).exec().
            then(function (sellableItems) {
              deferred.resolve(sellableItems);
            });
        }

      });
      return deferred.promise;
    }

    function GetDrugRequisitionEntries(requisitionId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var sellableItemTable = db.getSchema().table('SellableItem');

        var drugclassificationTable = db.getSchema().table('DrugClassification');
        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var receivingOutletDispatchLogTable = db.getSchema().table('SellableItemDispatchlog').as('ReceivingOutletDispatchLogTable');

        var drugRequisitionTable = db.getSchema().table('DrugRequisition');
        var drugRequisitionEntriesTable = db.getSchema().table('DrugRequisitionEntries')
        var issuingOutletDispatctLogTable = db.getSchema().table('SellableItemDispatchlog').as('IssuingOutletDispatctLogTable');
        var issuingOutlet = db.getSchema().table('Department').as('IssuingOutlet');
        var receivingOutlet = db.getSchema().table('Department').as('ReceivingOutlet');
        // var drugRequisitionTable = db.getSchema().table('DrugRequisition');

        db.select().
          from(drugRequisitionEntriesTable)

          .innerJoin(sellableItemTable, drugRequisitionEntriesTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(drugRequisitionTable, drugRequisitionEntriesTable.DrugRequisitionId.eq(drugRequisitionTable.Id))
          .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
          .leftOuterJoin(receivingOutlet,drugRequisitionTable.ReceivingOutletId.eq(receivingOutlet.Id))
          .leftOuterJoin(issuingOutlet,drugRequisitionTable.IssuingOutletId.eq(issuingOutlet.Id))
          .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))

          .leftOuterJoin(receivingOutletDispatchLogTable, sellableItemTable.Id.eq(receivingOutletDispatchLogTable.SellableItemId))
          .leftOuterJoin(issuingOutletDispatctLogTable, sellableItemTable.Id.eq(issuingOutletDispatctLogTable.SellableItemId))
          .where(
          lf.op.and(
            drugRequisitionEntriesTable.IsDeleted.eq(false), sellableItemTable.IsActive.eq(true),
            sellableItemTable.IsDrug.eq(true),
            drugRequisitionEntriesTable.DrugRequisitionId.eq(requisitionId),
            issuingOutletDispatctLogTable.DepartmentId.eq(drugRequisitionTable.IssuingOutletId),
            receivingOutletDispatchLogTable.DepartmentId.eq(drugRequisitionTable.ReceivingOutletId)
          )
          ).exec().
          then(function (drugRequisitionEntries) {
            deferred.resolve(drugRequisitionEntries);
          });
      });
      return deferred.promise;
    }

    function GetPharmacyItemsForIssuanceAndRequisition(sellableItemId, receivingOutletId, issuingOutletId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var sellableItemTable = db.getSchema().table('SellableItem');

        var drugclassificationTable = db.getSchema().table('DrugClassification');
        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var receivingOutletDispatchLogTable = db.getSchema().table('SellableItemDispatchlog').as('ReceivingOutletDispatchLogTable');

        var issuingOutletDispatctLogTable = db.getSchema().table('SellableItemDispatchlog').as('IssuingOutletDispatctLogTable');
        //  var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(sellableItemTable)

          .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
          .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))

          .leftOuterJoin(receivingOutletDispatchLogTable, sellableItemTable.Id.eq(receivingOutletDispatchLogTable.SellableItemId))
          .leftOuterJoin(issuingOutletDispatctLogTable, sellableItemTable.Id.eq(issuingOutletDispatctLogTable.SellableItemId))
          .where(
          lf.op.and(
            sellableItemTable.IsDeleted.eq(false), sellableItemTable.IsActive.eq(true),
            sellableItemTable.IsDrug.eq(true),
            sellableItemTable.Id.eq(sellableItemId),
            issuingOutletDispatctLogTable.DepartmentId.eq(issuingOutletId),
            receivingOutletDispatchLogTable.DepartmentId.eq(receivingOutletId)
          )
          ).exec().
          then(function (sellableItems) {

            deferred.resolve(sellableItems);
          });
      });
      return deferred.promise;
    }

    function GetPharmacyItems(searchObject) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var sellableItemTable = db.getSchema().table('SellableItem');
        var drugclassificationTable = db.getSchema().table('DrugClassification');
        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var staffMemberTable = db.getSchema().table('StaffMember');

        // var searchTextMatcher = new RegExp(searchText, "i");
        if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined && searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))

            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined && searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),

              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined && searchObject.brandName != undefined &&
          searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),

              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),

              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined && searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined && searchObject.brandName != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined &&
          searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),

              drugclassificationTable.Id.eq(searchObject.drugClassificationId),

              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),

              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined && searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),

              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.brandName != undefined &&
          searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined && searchObject.brandName != undefined &&
          searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.IsDrug.eq(true),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.brandName != undefined &&
          searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.BrandName.eq(searchObject.brandName),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.genericName != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),

              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDated && searchObject.brandName != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined && searchObject.brandName != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.BrandName.eq(searchObject.brandName)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              drugformulationTable.Id.eq(searchObject.drugFormulationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate &&
          searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined &&
          searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName),

              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.brandName != undefined &&
          searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              drugclassificationTable.Id.eq(searchObject.drugClassificationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined &&
          searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.Name.eq(searchObject.genericName),
              sellableItemTable.IsDrug.eq(true),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.brandName != undefined &&
          searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.BrandName.eq(searchObject.brandName),

              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.drugClassificationId != undefined && searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId),
              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.startDate != undefined && searchObject.endDate) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.RegistrationDate.between(searchObject.startDate, searchObject.endDate)

            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.genericName != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),
              sellableItemTable.Name.eq(searchObject.genericName)
            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.brandName != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),
              sellableItemTable.IsDrug.eq(true),

              sellableItemTable.BrandName.eq(searchObject.brandName)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.drugClassificationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              drugclassificationTable.Id.eq(searchObject.drugClassificationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        } else if (searchObject.drugFormulationId != undefined) {
          db.select().
            from(sellableItemTable)

            .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
            .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
            .leftOuterJoin(staffMemberTable,sellableItemTable.RegBy.eq(staffMemberTable.Id))
            .where(
            lf.op.and(
              sellableItemTable.IsDeleted.eq(false),

              sellableItemTable.IsDrug.eq(true),
              drugformulationTable.Id.eq(searchObject.drugFormulationId)


            )
            ).exec().
            then(function (sellableItems) {

              deferred.resolve(sellableItems);
            });
        }
      });
      return deferred.promise;
    }

    function GetSchemes() {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {


        var schemeTable = db.getSchema().table('Scheme');
        var schemePlanTable = db.getSchema().table('SchemePlans');

        db.select().
          from(schemeTable).

          innerJoin(schemePlanTable, schemeTable.Id.eq(schemePlanTable.SchemeId)).
          where(
          lf.op.and(
            schemeTable.IsDeleted.eq(false)
          )
          ).exec().
          then(function (schemes) {
            var uniqueSchemes = _.uniqBy(schemes, 'SchemePlans.LocalId');
            deferred.resolve(uniqueSchemes);
          });
      });
      return deferred.promise;
    }


    function GetBedsByWardId(wardId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var departmentTable = db.getSchema().table('Department');

        var bedTable = db.getSchema().table('Bed');

        db.select().
          from(bedTable).

          innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).
          where(
          lf.op.and(
            bedTable.IsDeleted.eq(false),
            bedTable.DepartmentId.eq(wardId),
            bedTable.Status.eq('Good'),
            bedTable.IsOccupied.eq(false)
          )
          ).exec().
          then(function (beds) {
            deferred.resolve(beds);
          });
      });

      return deferred.promise;
    }

    function GetAllBeds() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var departmentTable = db.getSchema().table('Department');

        var bedTable = db.getSchema().table('Bed');

        db.select().
          from(bedTable).

          innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).
          where(
          lf.op.and(
            bedTable.IsDeleted.eq(false),
            departmentTable.Category.eq('Ward'),
            bedTable.Status.eq('Good')
          )
          ).exec().
          then(function (beds) {
            var uniqueBeds = _.uniqBy(beds, 'Bed.LocalId');
            deferred.resolve(uniqueBeds);
          });
      });

      return deferred.promise;
    }

    function UpdateGender(updatedGender) {

      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('Gender');
        db.update(table).
          set(table.Name, (updatedGender.Name)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updatedGender.Id)).
          exec();
      });
    }

    function UpdateSupplier(updatedSupplier) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('SupplierRegister');
        db.update(table).
          set(table.SupplierName, (updatedSupplier.SupplierName)).
          set(table.OfficeAddress, (updatedSupplier.OfficeAddress)).
          set(table.PostalAddress, (updatedSupplier.PostalAddress)).
          set(table.CompanyRegNumber, (updatedSupplier.CompanyRegNumber)).
          set(table.PhoneNumber, (updatedSupplier.PhoneNumber)).
          set(table.WebsiteAddress, (updatedSupplier.WebsiteAddress)).
          set(table.FaxNumber, updatedSupplier.FaxNumber).
          set(table.Email, updatedSupplier.Email).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updatedSupplier.Id)).
          exec();
      });
    }

    function UpdateSellableItem(updateItem) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('SellableItem');
        db.update(table).
          set(table.CostPrice, (updateItem.CostPrice)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updateItem.Id)).
          exec();
      });
    }


    function UpdateBed(updatedBed) {
      lovefield.getDB().then(function (db) {

        var table = db.getSchema().table('Bed');
        db.update(table).
          set(table.IsOccupied, (updatedBed.IsOccupied)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updatedBed.Id)).
          exec();
      });
    }

    function UpdatePharmacyItem(updatedItem) {

      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('SellableItem');
        db.update(table).
          set(table.IsActive, (updatedItem.state)).
          // set(table.IsDeleted,!(updatedItem.state)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updatedItem.Id)).
          exec();
      });
    }

    function DeleteRow(deletedRowId, tableName) {

      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);
        db.update(table)
          .set(table.IsDeleted, true).
          set(table.LastModifiedDate, new Date()).
          where(table.Id.eq(deletedRowId)).
          exec();
      });
    }

    function GetPatientById(patientId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');

        db.select().
          from(patientTable).
          where(
          patientTable.Id.eq(patientId)
          ).exec().
          then(function (patients) {
            deferred.resolve(patients);
          });
      });
      return deferred.promise;
    }

    function DischargePatient(patientId, dischargeDetails) {
      var deferred = $q.defer();
      dischargeDetails.DischargeDate = dischargeDetails.DischargeDate || new Date();
      lovefield.getDB().then(function (db) {

        var encounterTable = db.getSchema().table('Encounter');
        var wardStayTable = db.getSchema().table('WardStayHistory');

        db.select().
          from(wardStayTable).
          innerJoin(encounterTable, wardStayTable.EncounterId.eq(encounterTable.Id)).
          where(
          lf.op.and(
            encounterTable.PatientId.eq(patientId),
            wardStayTable.Id.neq(null), wardStayTable.IsDischarged.eq(false)
          )
          ).exec().then(function (wardStays) {

            if (wardStays.length == 0) {
              deferred.resolve(0);
            } else {
              console.log(wardStays);
              var lastWardStay = wardStays[wardStays.length - 1];
              UpdateBed({ Id: lastWardStay['WardStayHistory'].NewBedId, IsOccupied: false });

              //deferred.resolve(1);
              wardStays.map(function (wardStay) {
                db.update(wardStayTable)
                  .set(wardStayTable.EndDate, dischargeDetails.DischargeDate)
                  .set(wardStayTable.IsDischarged, true)
                  .set(wardStayTable.LastModifiedDate, new Date())
                  .set(wardStayTable.EndDate, dischargeDetails.DischargeDate)
                  .set(wardStayTable.DischargedByStatus, dischargeDetails.DischargedByStatus)
                  .set(wardStayTable.DischargeStatus, dischargeDetails.DischargeStatus)
                  .set(wardStayTable.DischargedBy, dischargeDetails.DischargedBy)
                  .set(wardStayTable.DischargeDate, dischargeDetails.DischargeDate)
                  .where(wardStayTable.Id.eq(wardStay['WardStayHistory'].Id))
                  .exec().then(function () {
                    deferred.resolve(1);
                  });
              });
            }
          });
      });
      return deferred.promise;
    }

    function GetBillsByBillId(billId, status) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');

        var encouterTable = db.getSchema().table('Encounter');
        var depositTable = db.getSchema().table('Deposit');
        var schemeMembershipTable = db.getSchema().table('SchemeMembership');
        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        //var schemeTable = db.getSchema().table('Scheme');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var drugformulationTable = db.getSchema().table('DrugFormulation');

        db.select().
          from(saleEntryTable).

          innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id)).
          innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id)).
          leftOuterJoin(encouterTable, saleTable.EncounterId.eq(encouterTable.Id)).
          leftOuterJoin(patientTable, encouterTable.PatientId.eq(patientTable.Id)).
          leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id)).
          leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId)).
          leftOuterJoin(depositTable, encouterTable.Id.eq(depositTable.EncounterId)).
          leftOuterJoin(dispatchLogTable, sellableItemTable.Id.eq(dispatchLogTable.SellableItemId)).
          where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleTable.Id.eq(billId),
            saleEntryTable.HasPaid.eq(false)
            //  saleEntryTable.Status.eq(status)
          )
          ).exec().
          then(function (saleEntries) {
            deferred.resolve(saleEntries);
          });
      });
      return deferred.promise;
    }

    function GetBillsByEncounterId(patientId, status) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');

        var encouterTable = db.getSchema().table('Encounter');
        var depositTable = db.getSchema().table('Deposit');
        var schemeMembershipTable = db.getSchema().table('SchemeMembership');
        var schemePlanTable = db.getSchema().table('SchemePlans');
        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');

        var sellableItem = db.getSchema().table('SellableItem');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var discountUpdateTable = db.getSchema().table('SchemeDiscountUpdates');


        if (status != undefined) {
          db.select().
            from(saleEntryTable).

            innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id)).
            innerJoin(encouterTable, saleTable.EncounterId.eq(encouterTable.Id)).
            innerJoin(patientTable, encouterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(discountUpdateTable, saleEntryTable.Id.eq(discountUpdateTable.SaleEntryId)).
            leftOuterJoin(depositTable, encouterTable.Id.eq(depositTable.EncounterId)).
            leftOuterJoin(sellableItem, saleEntryTable.SellableItemId.eq(sellableItem.Id)).
            leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId)).
            where(
            lf.op.and(
              saleEntryTable.IsDeleted.eq(false),
              patientTable.Id.eq(patientId),
              saleEntryTable.HasPaid.eq(false),
              saleEntryTable.Status.eq(status),
              saleTable.EncounterId.neq(null)
            )
            ).exec().
            then(function (saleEntries) {
              deferred.resolve(saleEntries);
            });
        } else if (status == undefined) {
          db.select().
            from(saleEntryTable).

            leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id)).
            innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id)).
            innerJoin(encouterTable, saleTable.EncounterId.eq(encouterTable.Id)).
            innerJoin(patientTable, encouterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(discountUpdateTable, saleEntryTable.Id.eq(discountUpdateTable.SaleEntryId)).
            leftOuterJoin(depositTable, encouterTable.Id.eq(depositTable.EncounterId)).

            leftOuterJoin(sellableItem, saleEntryTable.SellableItemId.eq(sellableItem.Id)).
            leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId)).
            leftOuterJoin(schemePlanTable, schemeMembershipTable.SchemePlansId.eq(schemePlanTable.Id)).
            where(
            lf.op.and(
              saleEntryTable.IsDeleted.eq(false),
              patientTable.Id.eq(patientId),
              saleEntryTable.Status.eq('billed'),
              saleTable.EncounterId.neq(null)
            )
            ).exec().
            then(function (saleEntries) {
              deferred.resolve(saleEntries);
            });
        }
      });
      return deferred.promise;
    }

    function UpdateSale(updatedSale) {
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');


        var saleIds = _.uniq(updatedSale.Services.map(function (service) { return service.SaleId; }));

        for (var i = 0; i < saleIds.length; i++) {
          var saleId = saleIds[i];

          db.select().from(saleTable).where(saleTable.Id.eq(saleId)).exec().then(
            function (sale) {

              var comment = (sale[0].AdjustmentComment + (updatedSale.AdjustmentComment != undefined ?
                ('<br/>New Update : ' + updatedSale.AdjustmentComment) : ''));

              db.update(saleTable).
                set(saleTable.AdjustmentComment, comment).
                set(saleTable.LastModifiedDate, new Date()).
                where(saleTable.Id.eq(saleId)).
                exec();


            });
        }


        for (var i = 0; i < updatedSale.Services.length; i++) {

          db.update(saleEntryTable).
            set(saleEntryTable.Quantity, updatedSale.Services[i].Quantity).
            set(saleEntryTable.LastModifiedDate, new Date()).
            where(saleEntryTable.Id.eq(updatedSale.Services[i].Id)).exec();



        }
      });
    }


    function GetDepartmentByRevDepartmentCode(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var departmentTable = db.getSchema().table('RevenueDepartment');
        //    var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(departmentTable).
          where(
          lf.op.and(
            departmentTable.IsDeleted.eq(false),
            departmentTable.Code.eq(searchText)
          )
          ).exec().
          then(function (departments) {

            deferred.resolve(departments);
          });
      });
      return deferred.promise;
    }


    function GetDepartmentByDepartmentCode(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var departmentTable = db.getSchema().table('Department');
        var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(departmentTable).
          where(
          lf.op.and(
            departmentTable.IsDeleted.eq(false),
            departmentTable.Code.match(searchTextMatcher)
          )
          ).exec().
          then(function (departments) {
            deferred.resolve(departments);
          });
      });
      return deferred.promise;
    }

    function GetPosWorkshiftBySearchText(searchText, isClosed, isReconciled, isCompiled) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');

        //  var searchTextMatcher = new RegExp(searchText, "i");
        if (isClosed == undefined && isReconciled === undefined && isCompiled === undefined) {
          db.select().
            from(posWorkShiftTable)
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),

              posWorkShiftTable.Number.match(searchText)
            )
            ).exec().
            then(function (posWorkShifts) {
              deferred.resolve(posWorkShifts);
            });
        } else {
          db.select().
            from(posWorkShiftTable)
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.IsCompiled.eq(isCompiled),
              posWorkShiftTable.IsReconciled.eq(isReconciled),
              posWorkShiftTable.IsClosed.eq(isClosed),
              posWorkShiftTable.Number.match(searchText)
            )
            ).exec().
            then(function (posWorkShifts) {
              deferred.resolve(posWorkShifts);
            });
        }

      });
      return deferred.promise;
    }

    function GetShiftCompilationNumberBySearchText(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var shiftComplationTable = db.getSchema().table('ShiftCompilation');

        // var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(shiftComplationTable)
          .where(
          lf.op.and(
            shiftComplationTable.IsDeleted.eq(false),
            shiftComplationTable.Number.match(searchText)
          )
          ).exec().
          then(function (shiftCompilations) {
            deferred.resolve(shiftCompilations);
          });
      });
      return deferred.promise;
    }

    function checkIfPatientIsOnAdmission(patientId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var encounter = db.getSchema().table('Encounter');
        var wardStay = db.getSchema().table('WardStayHistory');
        var currentBed = db.getSchema().table('Bed');
        var currentWard = db.getSchema().table('Department');

        db.select().
          from(patientTable).
          innerJoin(encounter, patientTable.Id.eq(encounter.PatientId)).
          innerJoin(wardStay, encounter.Id.eq(wardStay.EncounterId)).
          innerJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id)).
          innerJoin(currentWard, currentBed.DepartmentId.eq(currentWard.Id)).
          orderBy(encounter.LocalId, lf.Order.DESC).
          where(
            lf.op.and(
              patientTable.IsDeleted.eq(false),
              currentBed.IsOccupied.eq(true),
              wardStay.IsDischarged.eq(false),
              wardStay.EndDate.eq(null),
              patientTable.Id.eq(patientId)
            )
          ).exec().
          then(function (patients) {
            deferred.resolve(patients);
          });
      });
      return deferred.promise;
    }


    function GetPatientOnAdmission(searchText) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');

        var gender = db.getSchema().table('Gender');
        var maritalState = db.getSchema().table('MaritalState');
        var religion = db.getSchema().table('Religion');
        var encounter = db.getSchema().table('Encounter');
        var wardStay = db.getSchema().table('WardStayHistory');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var scheme = db.getSchema().table('Scheme');
        var currentBed = db.getSchema().table('Bed');
        var currentWard = db.getSchema().table('Department');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(patientTable).

          innerJoin(gender, patientTable.GenderId.eq(gender.Id)).
          innerJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
          leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
          innerJoin(encounter, patientTable.Id.eq(encounter.PatientId)).
          innerJoin(wardStay, encounter.Id.eq(wardStay.EncounterId)).
          leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
          leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
          leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
          innerJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id)).
          innerJoin(currentWard, currentBed.DepartmentId.eq(currentWard.Id)).
          orderBy(encounter.LocalId, lf.Order.DESC).
          where(
          lf.op.and(
            patientTable.IsDeleted.eq(false),
            currentBed.IsOccupied.eq(true),
            wardStay.IsDischarged.eq(false),
            wardStay.EndDate.eq(null), lf.op.or(
              patientTable.Number.match(searchTextMatcher),
              patientTable.Surname.match(searchTextMatcher),
              patientTable.OtherNames.match(searchTextMatcher)
              //  currentBed.IsOccupied.eq(true)
            )
          )
          ).exec().
          then(function (patients) {

            var uniquePatients = _.uniqBy(patients, 'Patient.LocalId');

            deferred.resolve(uniquePatients);
          });
      });
      return deferred.promise;
    }

    function UpdateSaleEntry(updatedSale, saleReceiptId, posworkShiftId) {
      lovefield.getDB().then(function (db) {
        var saleEntryTable = db.getSchema().table('SaleEntry');
        for (var i = 0; i < updatedSale.length; i++) {
          db.update(saleEntryTable).
            set(saleEntryTable.SalesReceiptId, saleReceiptId).
            set(saleEntryTable.HasPaid, true).
            set(saleEntryTable.PosWorkShiftId, posworkShiftId).
            set(saleEntryTable.LastModifiedDate, new Date()).
            set(saleEntryTable.ReceiptAmount, updatedSale[i].NetAmount).
            where(saleEntryTable.Id.eq(updatedSale[i].Id)).exec();
        }
      });
    }

    function UpdateSaleEntries(updatedSaleEntry) {
      lovefield.getDB().then(function (db) {
        var saleEntryTable = db.getSchema().table('SaleEntry');

        db.update(saleEntryTable).
          set(saleEntryTable.Status, updatedSaleEntry.Status).
          set(saleEntryTable.LastModifiedDate, new Date()).
          set(saleEntryTable.Frequency, updatedSaleEntry.Frequency).
          set(saleEntryTable.Days, updatedSaleEntry.Days).
          set(saleEntryTable.DiscountPercentage, updatedSaleEntry.DiscountPercentage).
          set(saleEntryTable.Dosage, updatedSaleEntry.Dosage).
          set(saleEntryTable.Quantity, updatedSaleEntry.Quantity).
          set(saleEntryTable.TotalReturnedQuantity, updatedSaleEntry.TotalReturnedQuantity).
          where(saleEntryTable.Id.eq(updatedSaleEntry.Id)).exec();
      });
    }

    function DispenseDrugs(isDispensed, saleEntryId) {
      lovefield.getDB().then(function (db) {
        var saleEntryTable = db.getSchema().table('SaleEntry');
        db.update(saleEntryTable).
          set(saleEntryTable.IsDispensed, isDispensed).
          set(saleEntryTable.LastModifiedDate, new Date()).
          where(saleEntryTable.Id.eq(saleEntryId)).exec();
      });
    }



    function GetBillNumberSearchText(searchText, status, isDrug) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');

        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        var scheme = db.getSchema().table('Scheme');
        var gender = db.getSchema().table('Gender');
        var maritalState = db.getSchema().table('MaritalState');
        var religion = db.getSchema().table('Religion');

        var sellableItemTable = db.getSchema().table('SellableItem');
        var searchTextMatcher = new RegExp(searchText, "i");
        if (status == 'billed') {
          db.select().
            from(saleTable).

            innerJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId)).
            leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id)).
            leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(gender, patientTable.GenderId.eq(gender.Id)).
            leftOuterJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
            leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
            leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
            leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
            leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id))
            .where(
            lf.op.and(
              saleTable.IsDeleted.eq(false),
              saleEntryTable.HasPaid.eq(false),
              saleEntryTable.Status.eq(status),
              lf.op.or(
                saleTable.Number.match(searchTextMatcher),
                patientTable.OtherNames.match(searchTextMatcher),
                patientTable.Number.match(searchTextMatcher),
                patientTable.Surname.match(searchTextMatcher)
              )
            )
            ).exec().
            then(function (sales) {

              var uniqueSales = _.uniqBy(sales, 'Sale.LocalId');
              deferred.resolve(uniqueSales);
            });
        }
        if (status != 'billed' && isDrug != undefined) {

          db.select().
            from(saleTable).

            innerJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId)).
            leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id)).
            leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(gender, patientTable.GenderId.eq(gender.Id)).
            leftOuterJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
            leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
            leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
            leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
            leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
            leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .where(
            lf.op.and(
              saleTable.IsDeleted.eq(false),
              saleEntryTable.HasPaid.eq(false),
              saleEntryTable.Status.eq(status),
              sellableItemTable.IsDrug.eq(isDrug),
              lf.op.or(
                saleTable.Number.match(searchTextMatcher)
              )
            )
            ).exec().
            then(function (sales) {

              var uniqueSales = _.uniqBy(sales, 'Sale.LocalId');
              deferred.resolve(uniqueSales);
            });
        }
      });
      return deferred.promise;
    }

    function getPatientBills(patientId,startDate,endDate,status,isDrug) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');

        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        var scheme = db.getSchema().table('Scheme');
        var gender = db.getSchema().table('Gender');
        var maritalState = db.getSchema().table('MaritalState');
        var religion = db.getSchema().table('Religion');

        var sellableItemTable = db.getSchema().table('SellableItem');

        if (status == 'billed') {
          db.select().
            from(saleTable).

            innerJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId)).
            leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id)).
            leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(gender, patientTable.GenderId.eq(gender.Id)).
            leftOuterJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
            leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
            leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
            leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
            leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
            leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id)).
            where(
            lf.op.and(
              saleTable.IsDeleted.eq(false),
              saleEntryTable.HasPaid.eq(false),
              saleEntryTable.Status.eq(status),
              saleTable.RequestDate.between(startDate,endDate),
              patientTable.Id.eq(patientId)
            )
            ).exec().
            then(function (sales) {

              var uniqueSales = _.uniqBy(sales, 'Sale.LocalId');
              deferred.resolve(uniqueSales);
            });
        }
        if (status != 'billed' && isDrug != undefined) {

          db.select().
            from(saleTable).

            innerJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId)).
            leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id)).
            leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(gender, patientTable.GenderId.eq(gender.Id)).
            leftOuterJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
            leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
            leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
            leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
            leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
            leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id)).
            where(
            lf.op.and(
              saleTable.IsDeleted.eq(false),
              saleEntryTable.HasPaid.eq(false),
              saleEntryTable.Status.eq(status),
              sellableItemTable.IsDrug.eq(isDrug),
              saleTable.RequestDate.between(startDate,endDate),
              patientTable.Id.eq(patientId)
            )
            ).exec().
            then(function (sales) {

              var uniqueSales = _.uniqBy(sales, 'Sale.LocalId');
              deferred.resolve(uniqueSales);
            });
        }
      });
      return deferred.promise;
    }


    function UpdateSaleReceipt(updatedReceipt) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('SaleReceipt');
        db.update(table).
          set(table.TotalAmount, (updatedReceipt.TotalAmount)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updatedReceipt.Id)).
          exec();
      });
    }

    function GetRegisteredDrugs(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var sellableItemTable = db.getSchema().table('SellableItem');


        var drugformulationTable = db.getSchema().table('DrugFormulation');
        db.select(sellableItemTable.Code.as('Code'), sellableItemTable.BrandName.as('BrandName'), sellableItemTable.Name.as('Name'),
        sellableItemTable.Strength.as('DrugStrength'), drugformulationTable.Name.as('Formulation'), sellableItemTable.UnitsPerPack.as('UnitsPerPack'), sellableItemTable.PackPerPackingUnit.as('PackPerPackingUnit'),
          sellableItemTable.CostPrice.as('Cost'), sellableItemTable.NormalMarkUpClass.as('MarkupClass'), sellableItemTable.RegularSellingPrice.as('SellingPrice'), sellableItemTable.ReOrderLevel.as('ReOrderLevel'),
          sellableItemTable.RegistrationDate.as('RegistrationDate'))
          .from(sellableItemTable)

          .innerJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
          .where(
          lf.op.and(
            sellableItemTable.IsDeleted.eq(false),
            sellableItemTable.IsDrug.eq(true),
            sellableItemTable.RegistrationDate.between(startDate, endDate)
          )
          ).exec().then(function (sellableItems) {
            deferred.resolve(sellableItems);
          });
      });
      return deferred.promise;
    }

    function GetStockBalancePerOutlet(pharmacyOutletId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var departmentTable = db.getSchema().table('Department');
        var sellableItemTable = db.getSchema().table('SellableItem');

        var sellableItemDispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var drugformulationTable = db.getSchema().table('DrugFormulation');

        //      var searchTextMatcher = new RegExp(searchText, "i");

        db.select()
          .from(sellableItemTable)
          .leftOuterJoin(sellableItemDispatchLogTable, sellableItemTable.Id.eq(sellableItemDispatchLogTable.SellableItemId))
          .leftOuterJoin(departmentTable, sellableItemDispatchLogTable.DepartmentId.eq(departmentTable.Id))

          .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
          .where(
          lf.op.and(
            sellableItemTable.IsDeleted.eq(false),
            sellableItemTable.IsActive.eq(true),
            sellableItemTable.IsDrug.eq(true),
            sellableItemDispatchLogTable.DepartmentId.eq(pharmacyOutletId)
          )
          ).exec().then(function (pharmacyItems) {
            deferred.resolve(pharmacyItems);
          });
      });
      return deferred.promise;
    }

    function GetReceiptDetailsByReceiptId(saleReceiptId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleTable = db.getSchema().table('Sale');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var schemeMembershipTable = db.getSchema().table('SchemeMembership');
        var sellableItemTable = db.getSchema().table('SellableItem');


        db.select().
          from(saleEntryTable)
          .innerJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
          .where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            saleEntryTable.SalesReceiptId.eq(saleReceiptId),
            saleReceiptTable.IsCancelled.eq(false)
          )
          ).exec().
          then(function (saleEntries) {
            deferred.resolve(saleEntries);
          });
      });
      return deferred.promise;
    }

    function GetSaleEntriessByReceiptId(saleReceiptId, isDrug, isDispensed) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleReceiptTable = db.getSchema().table('SaleReceipt');

        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleTable = db.getSchema().table('Sale');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var schemeMembershipTable = db.getSchema().table('SchemeMembership');
        var sellableItemTable = db.getSchema().table('SellableItem');

        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var sellableItemDispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        db.select().
          from(saleEntryTable)

          .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))

          .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
          .leftOuterJoin(sellableItemDispatchLogTable, sellableItemTable.Id.eq(sellableItemDispatchLogTable.SellableItemId))
          .where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            saleReceiptTable.Id.eq(saleReceiptId),
            sellableItemTable.IsDrug.eq(isDrug),
            saleReceiptTable.IsCancelled.eq(false),
            //  sellableItemDispatchLogTable.DepartmentId.eq(locationId),
            saleEntryTable.IsDispensed.eq(isDispensed)
          )
          ).exec().
          then(function (saleEntries) {
            deferred.resolve(saleEntries);
          });
      });
      return deferred.promise;
    }

    function GetReceiptDetails(saleReceiptId) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var staffMemberTable = db.getSchema().table('StaffMember');

        db.select(saleTable.CustomerName.as('Patient Name'), saleTable.CustomerPhone.as('Patient Number'), saleReceiptTable.Id.as('ReceiptId'),
          saleReceiptTable.Number.as('Receipt Number'), saleReceiptTable.ReceiptDate.as('ReceiptDate'),
          saleEntryTable.Name.as('Name'), saleEntryTable.Quantity.as('Quantity'), saleEntryTable.Price.as('Price'),
          saleEntryTable.DepositAmount.as('Deposit'), saleEntryTable.ReceiptAmount.as('ReceiptAmount'), saleEntryTable.WaivedAmount.as('Waived'),
          saleEntryTable.DiscountPercentage.as('DiscountPercentage'), paymentModeTable.Mode.as('PaymentType'), saleEntryTable.Id.as("Id"),
          posWorkShiftTable.Number.as('Shift Number'),staffMemberTable.Username.as('Cashier Username'))
          .from(saleEntryTable)

          .innerJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(paymentModeTable, saleReceiptTable.PaymentModeId.eq(paymentModeTable.Id))
          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(posWorkShiftTable,saleReceiptTable.PosWorkShiftId.eq(posWorkShiftTable.Id))
          .innerJoin(staffMemberTable,posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
          .where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleReceiptTable.Id.eq(saleReceiptId)
          )
          ).exec().then(function (result) {
            var uniqueEntries = _.uniqBy(result, 'Id');
            deferred.resolve(uniqueEntries);
          });
      });
      return deferred.promise;
    }

    function GetSaleReceiptForDrugItems(searchText, isDispensed) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleReceiptTable = db.getSchema().table('SaleReceipt');

        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleTable = db.getSchema().table('Sale');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');

        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(saleReceiptTable)

          .leftOuterJoin(saleEntryTable, saleReceiptTable.Id.eq(saleEntryTable.SalesReceiptId))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .where(
          lf.op.and(
            saleReceiptTable.IsDeleted.eq(false),
            // saleReceiptTable.IsCancelled.eq(false),
            saleEntryTable.HasPaid.eq(true),
            saleReceiptTable.IsCancelled.eq(false),
            sellableItemTable.IsDrug.eq(true),
            saleEntryTable.IsDispensed.eq(isDispensed),
            lf.op.or(
              saleReceiptTable.Number.match(searchTextMatcher),
              patientTable.OtherNames.match(searchTextMatcher),
              patientTable.Number.match(searchTextMatcher),
              patientTable.Surname.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (saleReceipts) {

            var uniqueReceipts = _.uniqBy(saleReceipts, 'SaleReceipt.LocalId');
            deferred.resolve(uniqueReceipts);
          });
      });
      return deferred.promise;
    }

    function GetLabResultBySearchText(searchText, isVerifiedResults) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var testParameterTable = db.getSchema().table('TestParameter');
        var labResultTable = db.getSchema().table('LabResult');
        var labResultEntryTable = db.getSchema().table('LabResultEntries');
        var genderTable = db.getSchema().table('Gender');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table("Patient");
        var maritalStateTable = db.getSchema().table('MaritalState');
        var religionTable = db.getSchema().table('Religion');
        var saleTable = db.getSchema().table('Sale');
        var searchTextMatcher = new RegExp(searchText, "i");
        db.select()
          .from(labResultEntryTable)

          .innerJoin(labResultTable, labResultEntryTable.LabResultId.eq(labResultTable.Id))
          .innerJoin(saleEntryTable, labResultTable.SaleEntryId.eq(saleEntryTable.Id))
          .innerJoin(testParameterTable, labResultEntryTable.TestParameterId.eq(testParameterTable.Id))
          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .where(
          lf.op.and(
            labResultEntryTable.IsDeleted.eq(false),
            labResultTable.IsDeleted.eq(false),
            labResultTable.Number.match(searchTextMatcher),
            labResultTable.IsVerified.eq(isVerifiedResults)
          )
          ).exec().then(function (labresult) {
            deferred.resolve(labresult);
          });
      });
      return deferred.promise;
    }


    function GetSaleReceiptBySearchText(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleReceiptTable = db.getSchema().table('SaleReceipt');

        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleTable = db.getSchema().table('Sale');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var encounterTable = db.getSchema().table('Encounter');
        var wardStayHistoryTable = db.getSchema().table('WardStayHistory');
        var patientTable = db.getSchema().table('Patient');
        var departmentTable = db.getSchema().table('Department');
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(saleReceiptTable)

          .leftOuterJoin(saleEntryTable, saleReceiptTable.Id.eq(saleEntryTable.SalesReceiptId))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(departmentTable, sellableItemTable.ServiceDepartmentId.eq(departmentTable.Id))
          .leftOuterJoin(wardStayHistoryTable,encounterTable.Id.eq(wardStayHistoryTable.EncounterId))
          .where(
          lf.op.and(
            saleReceiptTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            saleReceiptTable.IsCancelled.eq(false),
            //sellableItemTable.IsDrug.eq(isDrug),
            lf.op.or(
              saleReceiptTable.Number.match(searchTextMatcher),
              patientTable.OtherNames.match(searchTextMatcher),
              patientTable.Number.match(searchTextMatcher),
              patientTable.Surname.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (saleReceipts) {

            var uniqueReceipts = _.uniqBy(saleReceipts, 'SaleReceipt.LocalId');
            deferred.resolve(uniqueReceipts);
          });
      });
      return deferred.promise;
    }

    function GetDepositDepartment() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var revenueDepartmentTable = db.getSchema().table('RevenueDepartment');
        db.select().
          from(revenueDepartmentTable).
          where(
          lf.op.and(
            revenueDepartmentTable.IsDeleted.eq(false),
            revenueDepartmentTable.Name.match('Deposit')
          )
          ).exec().
          then(function (revenueDepartment) {
            deferred.resolve(revenueDepartment);
          });
      });
      return deferred.promise;
    }


    function GetShift_DepositReceipt(shiftNumber) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {


        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var locationTable = db.getSchema().table('Department');
        var depositTable = db.getSchema().table('Deposit');
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');

        var revenueDepartentTable = db.getSchema().table('RevenueDepartment');
        db.select(depositTable.ReceiptDate.as('TransactionDate'),depositTable.IsCancelled.as('IsCancelled'), depositTable.Id.as('SaleEntryId'), revenueDepartentTable.Id.as('ServiceDepartmentId'), depositTable.Description.as('ItemId'), depositTable.Id.as('ReceiptId'), depositTable.TotalAmount.as('ItemAmount'), depositTable.Description.as('Item'), depositTable.Number.as('ReceiptNumber'), depositTable.PayerName.as('Payer'),
          patientTable.Number.as('Patient Number'), paymentModeTable.Mode.as('PaymentModeName'), locationTable.Name.as('LocationName'), depositTable.TotalAmount.as('ReceiptAmount'), revenueDepartentTable.Name.as('RevDepartment'), revenueDepartentTable.Name.as('ServiceDepartment')).
          from(depositTable)
          .leftOuterJoin(encounterTable, depositTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(posWorkShiftTable, depositTable.PosWorkShiftId.eq(posWorkShiftTable.Id))
          .leftOuterJoin(paymentModeTable, depositTable.PaymentModeId.eq(paymentModeTable.Id))
          .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
          .innerJoin(revenueDepartentTable, depositTable.RevenueDepartmentId.eq(revenueDepartentTable.Id))
          .where(
          lf.op.and(
            depositTable.IsDeleted.eq(false),
           // depositTable.IsCancelled.eq(false),
            posWorkShiftTable.Number.match(shiftNumber),
            depositTable.Description.match('Deposit Made')
          )
          ).exec().
          then(function (shift) {
            deferred.resolve(shift);
          });
      });
      return deferred.promise;
    }


    function GetShift_SaleRecipt(shiftNumber) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var locationTable = db.getSchema().table('Department').as('LocationTable');
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var saleTable = db.getSchema().table('Sale');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department').as('ServiceDepartmentTable');
        var revenueDepartmentTable = db.getSchema().table('RevenueDepartment');

        db.select(saleEntryTable.Name.as('Item'), saleReceiptTable.Id.as('ReceiptId'), saleEntryTable.Id.as('SaleEntryId'), serviceDepartmentTable.Id.as('ServiceDepartmentId'),
          sellableItemTable.Id.as('ItemId'), saleEntryTable.ReceiptAmount.as('ItemAmount'), saleReceiptTable.ReceiptDate.as('TransactionDate'), saleReceiptTable.Number.as('ReceiptNumber'),
          saleTable.CustomerName.as('Payer'),
          saleTable.CustomerPhone.as('Patient Number'),saleReceiptTable.IsCancelled.as('IsCancelled'), paymentModeTable.Mode.as('PaymentModeName'),
          locationTable.Name.as('LocationName'), revenueDepartmentTable.Name.as('RevDepartment'), serviceDepartmentTable.Name.as('ServiceDepartment'),
          saleReceiptTable.TotalAmount.as('ReceiptAmount')).
          from(saleReceiptTable)
          .leftOuterJoin(saleEntryTable, saleReceiptTable.Id.eq(saleEntryTable.SalesReceiptId))
          .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(posWorkShiftTable, saleEntryTable.PosWorkShiftId.eq(posWorkShiftTable.Id))
          .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
          .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
          .leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(revenueDepartmentTable, sellableItemTable.RevenueDepartmentId.eq(revenueDepartmentTable.Id))
          .leftOuterJoin(serviceDepartmentTable, sellableItemTable.ServiceDepartmentId.eq(serviceDepartmentTable.Id))
          .where(
          lf.op.and(
          //  saleReceiptTable.IsCancelled.eq(false),
            saleReceiptTable.IsDeleted.eq(false),
            posWorkShiftTable.Number.match(shiftNumber),
            sellableItemTable.IsDrug.eq(false)
          )
          ).exec().
          then(function (serviceItems) {
            db.select(saleEntryTable.Name.as('Item'), saleReceiptTable.Id.as('ReceiptId'), saleEntryTable.Id.as('SaleEntryId'), serviceDepartmentTable.Id.as('ServiceDepartmentId'),
              sellableItemTable.Id.as('ItemId'), saleEntryTable.ReceiptAmount.as('ItemAmount'), saleReceiptTable.ReceiptDate.as('TransactionDate'), saleReceiptTable.Number.as('ReceiptNumber'),
              saleTable.CustomerName.as('Payer'),
              saleTable.CustomerPhone.as('Patient Number'),saleReceiptTable.IsCancelled.as('IsCancelled'), paymentModeTable.Mode.as('PaymentModeName'),
              locationTable.Name.as('LocationName'), revenueDepartmentTable.Name.as('RevDepartment'), serviceDepartmentTable.Name.as('ServiceDepartment'),
              saleReceiptTable.TotalAmount.as('ReceiptAmount')).
              from(saleReceiptTable)
              .leftOuterJoin(saleEntryTable, saleReceiptTable.Id.eq(saleEntryTable.SalesReceiptId))
              .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
              .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
              .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
              .leftOuterJoin(posWorkShiftTable, saleEntryTable.PosWorkShiftId.eq(posWorkShiftTable.Id))
              .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
              .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
              .leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
              .leftOuterJoin(revenueDepartmentTable, sellableItemTable.RevenueDepartmentId.eq(revenueDepartmentTable.Id))
              .leftOuterJoin(serviceDepartmentTable, saleEntryTable.BillingOutletId.eq(serviceDepartmentTable.Id))
              .where(
              lf.op.and(
              //  saleReceiptTable.IsCancelled.eq(false),
                saleReceiptTable.IsDeleted.eq(false),
                posWorkShiftTable.Number.match(shiftNumber),
                sellableItemTable.IsDrug.eq(true)
              )
              ).exec().then(function(drugItems){
                debugger;
                if(drugItems.length>0){
                  serviceItems = serviceItems.concat(drugItems);
                }
                deferred.resolve(serviceItems);
              });
          });
      });
      return deferred.promise;
    }

    function GetCompiledShifts(shiftData) {

      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var staffMemberTable = db.getSchema().table('StaffMember');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');

        var depositTable = db.getSchema().table('Deposit');
        var shiftComplationTable = db.getSchema().table('ShiftCompilation')

         if (shiftData.username != undefined &&  shiftData.startDate != undefined && shiftData.endDate != undefined) {
          db.select().
            from(shiftComplationTable)
            .leftOuterJoin(posWorkShiftTable, shiftComplationTable.Id.eq(posWorkShiftTable.ShiftCompilationId))
            .innerJoin(staffMemberTable, shiftComplationTable.StaffMemberId.eq(staffMemberTable.Id))

            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))

            .where(
            lf.op.and(
              shiftComplationTable.IsDeleted.eq(false),
              shiftComplationTable.Date.between(shiftData.startDate, shiftData.endDate),
              staffMemberTable.Username.eq(shiftData.username)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        }

        else if (shiftData.username != undefined) {
          db.select().
            from(shiftComplationTable)
            .leftOuterJoin(posWorkShiftTable, shiftComplationTable.Id.eq(posWorkShiftTable.ShiftCompilationId))
            .innerJoin(staffMemberTable, shiftComplationTable.StaffMemberId.eq(staffMemberTable.Id))

            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))

            .where(
            lf.op.and(
              shiftComplationTable.IsDeleted.eq(false),
              staffMemberTable.Username.eq(shiftData.username)
            )
            )
            .exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        }

        else if (shiftData.compilationNumber != undefined) {

          db.select().
            from(shiftComplationTable)

            .leftOuterJoin(posWorkShiftTable, shiftComplationTable.Id.eq(posWorkShiftTable.ShiftCompilationId))
            .leftOuterJoin(staffMemberTable, shiftComplationTable.StaffMemberId.eq(staffMemberTable.Id))

            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))

            .where(
            lf.op.and(
              shiftComplationTable.IsDeleted.eq(false),

              shiftComplationTable.Number.match(shiftData.compilationNumber)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        }
        else if (shiftData.startDate != undefined && shiftData.endDate != undefined) {
          db.select().
            from(shiftComplationTable)

            .leftOuterJoin(posWorkShiftTable, shiftComplationTable.Id.eq(posWorkShiftTable.ShiftCompilationId))
            .innerJoin(staffMemberTable, shiftComplationTable.StaffMemberId.eq(staffMemberTable.Id))

            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))

            .where(
            lf.op.and(
              shiftComplationTable.IsDeleted.eq(false),
              shiftComplationTable.Date.between(shiftData.startDate, shiftData.endDate)
            )
            ).exec().
            then(function (shiftComplations) {
              deferred.resolve(shiftComplations);
            });
        }

      });
      return deferred.promise;
    }


    function GetShiftsForCompilation(shiftData) {

      var deferred = $q.defer();
      shiftData.shiftNumber = shiftData.shiftNumber != undefined ? new RegExp(shiftData.shiftNumber, "i") : null;

      lovefield.getDB().then(function (db) {

        var staffMemberTable = db.getSchema().table('StaffMember');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var locationTable = db.getSchema().table('Department');
        var depositTable = db.getSchema().table('Deposit');
        var reconciledByStaff = db.getSchema().table('StaffMember').as('ReconciledByStaff');
        var shiftComplationTable = db.getSchema().table('ShiftCompilation');
        // var searchTextMatcher = new RegExp(shiftData.shiftNumber, 'i');

        if (shiftData.username != undefined && shiftData.startDate != undefined && shiftData.endDate != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .leftOuterJoin(reconciledByStaff, posWorkShiftTable.ReconciledBy.eq(reconciledByStaff.Username))
            .leftOuterJoin(shiftComplationTable, posWorkShiftTable.ShiftCompilationId.eq(shiftComplationTable.Id))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate),
              staffMemberTable.Username.eq(shiftData.username),
              posWorkShiftTable.IsReconciled.eq(shiftData.isReconciled),
              posWorkShiftTable.IsCompiled.eq(shiftData.isCompiled), posWorkShiftTable.IsClosed.eq(true)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.username != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(reconciledByStaff, posWorkShiftTable.ReconciledBy.eq(reconciledByStaff.Username))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
            lf.op.and(
              posWorkShiftTable.IsReconciled.eq(shiftData.isReconciled),
              posWorkShiftTable.IsDeleted.eq(false),
              staffMemberTable.Username.eq(shiftData.username),

              posWorkShiftTable.IsCompiled.eq(shiftData.isCompiled), posWorkShiftTable.IsClosed.eq(true)
            )
            )
            .exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.shiftNumber != undefined) {

          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(reconciledByStaff, posWorkShiftTable.ReconciledBy.eq(reconciledByStaff.Username))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),

              posWorkShiftTable.Number.match(shiftData.shiftNumber),
              posWorkShiftTable.IsReconciled.eq(shiftData.isReconciled),
              posWorkShiftTable.IsCompiled.eq(shiftData.isCompiled), posWorkShiftTable.IsClosed.eq(true)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if ((shiftData.startDate != undefined && shiftData.endDate != undefined)) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(reconciledByStaff, posWorkShiftTable.ReconciledBy.eq(reconciledByStaff.Username))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate),
              posWorkShiftTable.IsReconciled.eq(shiftData.isReconciled),
              posWorkShiftTable.IsCompiled.eq(shiftData.isCompiled), posWorkShiftTable.IsClosed.eq(true)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        }

      });
      return deferred.promise;
    }

    function GetShifts(shiftData) {

      var deferred = $q.defer();
      shiftData.shiftNumber = shiftData.shiftNumber != undefined ? new RegExp(shiftData.shiftNumber, "i") : null;
      lovefield.getDB().then(function (db) {

        var staffMemberTable = db.getSchema().table('StaffMember');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var locationTable = db.getSchema().table('Department');
        var depositTable = db.getSchema().table('Deposit');

        if (shiftData.username != undefined && shiftData.shiftNumber == undefined && (shiftData.startDate != undefined && shiftData.endDate != undefined)) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
              lf.op.and(
                posWorkShiftTable.IsDeleted.eq(false),
                staffMemberTable.Username.eq(shiftData.username),
                posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate)
              )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.username != undefined && shiftData.shiftNumber == undefined && (shiftData.startDate == undefined || shiftData.endDate == undefined) ){
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
              lf.op.and(
                posWorkShiftTable.IsDeleted.eq(false),
                staffMemberTable.Username.eq(shiftData.username)
              )
            )
            .exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.username == undefined && shiftData.shiftNumber == undefined && (shiftData.startDate != undefined && shiftData.endDate != undefined)) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.shiftNumber != null) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.Number.match(shiftData.shiftNumber)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        }

      });
      return deferred.promise;
    }


    function GetShiftsForSurveillanve(shiftData) {
      var deferred = $q.defer();

      shiftData.shiftNumber = new RegExp(shiftData.shiftNumber, "i");
      lovefield.getDB().then(function (db) {

        var staffMemberTable = db.getSchema().table('StaffMember');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var locationTable = db.getSchema().table('Department');
        var depositTable = db.getSchema().table('Deposit');
        var shiftComplationTable = db.getSchema().table('ShiftCompilation')
        var reconciledBy = db.getSchema().table('StaffMember').as('ReconciledBy');

        if (shiftData.cashierUsername != undefined && shiftData.startDate != undefined && shiftData.endDate != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .leftOuterJoin(shiftComplationTable, posWorkShiftTable.ShiftCompilationId.eq(shiftComplationTable.Id))
            .leftOuterJoin(reconciledBy, posWorkShiftTable.ReconciledBy.eq(reconciledBy.Username))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate),
              staffMemberTable.Username.eq(shiftData.cashierUsername)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.acknowledgedBy != undefined && shiftData.startDate != undefined && shiftData.endDate != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.Id))
            .leftOuterJoin(shiftComplationTable, posWorkShiftTable.ShiftCompilationId.eq(shiftComplationTable.Id))
            .leftOuterJoin(reconciledBy, posWorkShiftTable.ReconciledBy.eq(reconciledBy.Username))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.ReconciledBy.eq(shiftData.acknowledgedBy),
              posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate)
            )
            ).exec().
            then(function (posWorkShift) {
              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.startDate != undefined && shiftData.endDate != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .leftOuterJoin(shiftComplationTable, posWorkShiftTable.ShiftCompilationId.eq(shiftComplationTable.Id))
            .leftOuterJoin(reconciledBy, posWorkShiftTable.ReconciledBy.eq(reconciledBy.Username))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.StartDate.between(shiftData.startDate, shiftData.endDate)
            )
            )
            .exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.acknowledgedBy != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .leftOuterJoin(reconciledBy, posWorkShiftTable.ReconciledBy.eq(reconciledBy.Username))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.ReconciledBy.match(shiftData.acknowledgedBy)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.cashierUsername != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .leftOuterJoin(reconciledBy, posWorkShiftTable.ReconciledBy.eq(reconciledBy.Username))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              staffMemberTable.Username.eq(shiftData.cashierUsername)
            )
            )
            .exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        } else if (shiftData.shiftNumber != undefined) {
          db.select().
            from(posWorkShiftTable)
            .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
            .leftOuterJoin(locationTable, posWorkShiftTable.LocationId.eq(locationTable.Id))
            .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
            .leftOuterJoin(saleEntryTable, posWorkShiftTable.Id.eq(saleEntryTable.PosWorkShiftId))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .leftOuterJoin(paymentModeTable, posWorkShiftTable.Id.eq(paymentModeTable.PosWorkShiftId))
            .leftOuterJoin(reconciledBy, posWorkShiftTable.ReconciledBy.eq(reconciledBy.Username))
            .where(
            lf.op.and(
              posWorkShiftTable.IsDeleted.eq(false),
              posWorkShiftTable.Number.match(shiftData.shiftNumber)
            )
            ).exec().
            then(function (posWorkShift) {

              deferred.resolve(posWorkShift);
            });
        }
      });
      return deferred.promise;
    }

    function UpdateWorkShift(shift, staff, operation) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('PosWorkShift');
        if (operation == 'To Close') {
          db.update(table).
            set(table.IsClosed, true).
            set(table.LastModifiedDate, new Date()).
            set(table.ClosedBy, staff).
            where(
            table.Id.eq(shift.Id)).
            exec();
        } else if (operation == 'To Reconcile') {
          db.update(table).
            set(table.IsReconciled, true).
            set(table.LastModifiedDate, new Date()).
            set(table.ReconciledBy, staff).
            set(table.ReconciliationDate, new Date()).
            where(
            table.Id.eq(shift.Id)).
            exec();
        } else if (operation == 'To ReverseReconciliation') {
          db.update(table).
            set(table.IsReconciled, false).
            set(table.LastModifiedDate, new Date()).
            set(table.ReconciledBy, null).
            set(table.ReconciliationDate, null).
            where(
            table.Id.eq(shift.Id)).
            exec();
        } else if (operation == 'To Compile') {
          db.update(table).
            set(table.IsCompiled, true).
            set(table.LastModifiedDate, new Date()).
            set(table.CompiledBy, staff).
            set(table.CompilationDate, new Date()).
            where(
            table.Id.eq(shift.Id)).
            exec();
        } else if (operation == 'To ReverseCompilation') {

          db.update(table).
            set(table.IsCompiled, false).
            set(table.LastModifiedDate, new Date()).
            set(table.CompiledBy, null).
            set(table.ShiftCompilationId, null).
            set(table.CompilationDate, null).
            where(
            table.Id.eq(shift.Id)).
            exec();
        }
      });
    }


    function CheckforSuperadmin(username) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var staffMemberTable = db.getSchema().table('StaffMember');
        //  var searchTextMatcher = new RegExp(username,"i");
        db.select().
          from(staffMemberTable)

          .where(
          lf.op.and(
            staffMemberTable.IsDeleted.eq(false),
            staffMemberTable.Username.eq(username),
            staffMemberTable.IsActive.eq(true)
          )
          ).exec().
          then(function (staff) {
            deferred.resolve(staff);
          });
      });
      return deferred.promise;
    }

    function GetWorkShift(staffId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        db.select().
          from(posWorkShiftTable)
          .where(
          lf.op.and(
            posWorkShiftTable.IsDeleted.eq(false),
            posWorkShiftTable.StaffMemberId.eq(staffId),
            posWorkShiftTable.IsClosed.eq(false)
          )
          ).exec().
          then(function (staffMember) {
            deferred.resolve(staffMember);
          });
      });
      return deferred.promise;
    }

    function VerifyUser(username, password) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var staffMemberTable = db.getSchema().table('StaffMember');
        var roleTable = db.getSchema().table('Role');
        var acessibleModule = db.getSchema().table('RoleAccessDefinition');
        var departmentTable = db.getSchema().table('Department');
        // var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var templateAssignmentTable = db.getSchema().table('TemplateAssignments');
        //  var searchTextMatcher = new RegExp(username,"i");
        db.select().
          from(staffMemberTable)
          .leftOuterJoin(roleTable, staffMemberTable.RoleId.eq(roleTable.Id))
          .leftOuterJoin(acessibleModule, roleTable.Id.eq(acessibleModule.RoleId))
          // .leftOuterJoin(posWorkShiftTable, staffMemberTable.Id.eq(posWorkShiftTable.StaffMemberId))
          .leftOuterJoin(departmentTable, staffMemberTable.DepartmentId.eq(departmentTable.Id))
          .leftOuterJoin(templateAssignmentTable, departmentTable.Id.eq(templateAssignmentTable.DepartmentId))
          .where(
          lf.op.and(
            staffMemberTable.IsDeleted.eq(false),
            staffMemberTable.Password.eq(password),
            staffMemberTable.Username.eq(username),
            staffMemberTable.IsActive.eq(true)
          )
          ).exec().
          then(function (staffMember) {
            deferred.resolve(staffMember);
          });
      });
      return deferred.promise;
    }

    function UpdateStaffDetail(updatedStaffDetail, description) {

      lovefield.getDB().then(function (db) {

        var table = db.getSchema().table('StaffMember');

        if (description == 'ROLE') {
          db.update(table).
            set(table.RoleId, updatedStaffDetail.RoleId).
            set(table.LastModifiedDate, new Date()).
            where(
            table.Id.eq(updatedStaffDetail.Id)).
            exec();
        } else if (description == 'DEPARTMENT') {
          db.update(table).
            set(table.DepartmentId, updatedStaffDetail.DepartmentId).
            set(table.LastModifiedDate, new Date()).
            where(
            table.Id.eq(updatedStaffDetail.Id)).
            exec();
        } else if (description == 'PASSWORD') {
          db.update(table).
            set(table.Password, updatedStaffDetail.Password).
            set(table.LastModifiedDate, new Date()).
            where(
            table.Id.eq(updatedStaffDetail.Id)).
            exec();
        } else {
          db.update(table).
            set(table.IsActive, (updatedStaffDetail.IsActive)).
            set(table.LastModifiedDate, new Date()).
            where(
            table.Id.eq(updatedStaffDetail.Id)).
            exec();
        }
      });
    }

    function GetSelectedSchemeType(schemeTypeId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var schemeTypeTable = db.getSchema().table('SchemePlans');
        db.select().
          from(schemeTypeTable).
          where(
          lf.op.and(
            schemeTypeTable.IsDeleted.eq(false),
            schemeTypeTable.Id.eq(schemeTypeId)
          )
          ).exec().
          then(function (schemeType) {
            deferred.resolve(schemeType);
          });
      });
      return deferred.promise;
    }

    function GetSchemeTypes(schemeId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var schemeTypeTable = db.getSchema().table('SchemePlans');
        db.select().
          from(schemeTypeTable).
          where(
          lf.op.and(
            schemeTypeTable.IsDeleted.eq(false),
            schemeTypeTable.SchemeId.eq(schemeId)
          )
          ).exec().
          then(function (schemeTypes) {
            deferred.resolve(schemeTypes);
          });
      });
      return deferred.promise;
    }

    function GetAssesibleModules(roleId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var assesibleTable = db.getSchema().table('RoleAccessDefinition');

        db.select().
          from(assesibleTable)
          .where(
          lf.op.and(
            assesibleTable.IsDeleted.eq(false),
            assesibleTable.RoleId.eq(roleId)
          )
          ).exec().
          then(function (assesibleTables) {
            deferred.resolve(assesibleTables);
          });
      });
      return deferred.promise;
    }

    function GetClientData(key) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var clientDataTable = db.getSchema().table('ClientData');

        db.select().
          from(clientDataTable).

          where(
          lf.op.and(clientDataTable.IsDeleted.eq(false),
            clientDataTable.Key.eq(key)
          )
          ).exec().then(function (clientData) {
            deferred.resolve(clientData);
          });
      });
      return deferred.promise;
    }

    function GetGlobalConstants(key) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var globalConstantTable = db.getSchema().table('GlobalConstants');

        db.select().
          from(globalConstantTable).

          where(
          lf.op.and(globalConstantTable.IsDeleted.eq(false),
            globalConstantTable.Key.eq(key)
          )
          ).exec().then(function (globalConstants) {
            deferred.resolve(globalConstants);
          });
      });
      return deferred.promise;
    }

    function GetCodingandIndexing(startDate, endDate, departmentId, encounterId, status) {
      var deferred = $q.defer();
      //console.log(status);
      lovefield.getDB().then(function (db) {

        var departmentTable = db.getSchema().table('Department');
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var diseaseIndex = db.getSchema().table('DiseaseIndex');
        var diseaseIndicies = db.getSchema().table('DiseaseIndicies');
        var surgeryIndex = db.getSchema().table('SurgeryIndex');
        var surgeryIndicies = db.getSchema().table('SurgicalIndicies');

        if (departmentId != 0 && status != "INDEXED" && status != 'PENDING') {

          db.select().
            from(encounterTable).
            innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id)).
            leftOuterJoin(diseaseIndex, encounterTable.Id.eq(diseaseIndex.EncounterId)).
            leftOuterJoin(diseaseIndicies, diseaseIndex.Id.eq(diseaseIndicies.DiseaseIndexId)).
            leftOuterJoin(surgeryIndex, encounterTable.Id.eq(surgeryIndex.EncounterId)).

            leftOuterJoin(surgeryIndicies, surgeryIndex.Id.eq(surgeryIndicies.SurgeryIndexId)).
            where(
            lf.op.and(
              encounterTable.DepartmentId.eq(departmentId),
              encounterTable.IsDeleted.eq(false)
            )
            ).
            exec().
            then(function (indicies) {
              deferred.resolve(indicies);
            });
        }

        if (encounterId != 0 && status != "INDEXED" && status != 'PENDING') {

          db.select().
            from(encounterTable).
            innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(diseaseIndex, encounterTable.Id.eq(diseaseIndex.EncounterId)).
            innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id)).
            leftOuterJoin(diseaseIndicies, diseaseIndex.Id.eq(diseaseIndicies.DiseaseIndexId)).
            leftOuterJoin(surgeryIndex, encounterTable.Id.eq(surgeryIndex.EncounterId)).
            leftOuterJoin(surgeryIndicies, surgeryIndex.Id.eq(surgeryIndicies.SurgeryIndexId)).
            where(
            lf.op.and(
              encounterTable.Id.eq(encounterId),
              encounterTable.IsDeleted.eq(false)
            )
            ).
            exec().
            then(function (indicies) {
              deferred.resolve(indicies);
            });
        }


        if (departmentId != 0 && status == 'PENDING') {

          db.select().
            from(encounterTable).
            innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id)).
            leftOuterJoin(diseaseIndex, encounterTable.Id.eq(diseaseIndex.EncounterId)).
            leftOuterJoin(diseaseIndicies, diseaseIndex.Id.eq(diseaseIndicies.DiseaseIndexId)).
            leftOuterJoin(surgeryIndex, encounterTable.Id.eq(surgeryIndex.EncounterId)).

            leftOuterJoin(surgeryIndicies, surgeryIndex.Id.eq(surgeryIndicies.SurgeryIndexId)).
            where(
            lf.op.and(
              encounterTable.DepartmentId.eq(departmentId),
              encounterTable.IsDeleted.eq(false),
              diseaseIndicies.Id.eq(null),
              surgeryIndicies.Id.eq(null)
            )
            ).
            exec().
            then(function (indicies) {
              deferred.resolve(indicies);
            });
        }

        if (encounterId != 0 && status == "INDEXED") {

          db.select().
            from(encounterTable).
            innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(diseaseIndex, encounterTable.Id.eq(diseaseIndex.EncounterId)).
            innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id)).
            leftOuterJoin(diseaseIndicies, diseaseIndex.Id.eq(diseaseIndicies.DiseaseIndexId)).
            leftOuterJoin(surgeryIndex, encounterTable.Id.eq(surgeryIndex.EncounterId)).
            leftOuterJoin(surgeryIndicies, surgeryIndex.Id.eq(surgeryIndicies.SurgeryIndexId)).
            where(
            lf.op.and(
              encounterTable.Id.eq(encounterId),
              encounterTable.IsDeleted.eq(false),
              lf.op.or(
                diseaseIndicies.Id.neq(null),
                surgeryIndicies.Id.neq(null)
              )
            )
            ).
            exec().
            then(function (indicies) {
              deferred.resolve(indicies);
            });
        }

        if (departmentId != 0 && status == 'INDEXED') {

          db.select().
            from(encounterTable).
            innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id)).
            leftOuterJoin(diseaseIndex, encounterTable.Id.eq(diseaseIndex.EncounterId)).
            leftOuterJoin(diseaseIndicies, diseaseIndex.Id.eq(diseaseIndicies.DiseaseIndexId)).
            leftOuterJoin(surgeryIndex, encounterTable.Id.eq(surgeryIndex.EncounterId)).
            leftOuterJoin(surgeryIndicies, surgeryIndex.Id.eq(surgeryIndicies.SurgeryIndexId)).
            where(
            lf.op.and(
              encounterTable.DepartmentId.eq(departmentId),
              encounterTable.IsDeleted.eq(false),
              lf.op.or(
                diseaseIndicies.Id.neq(null),
                surgeryIndicies.Id.neq(null)
              )
            )
            ).
            exec().
            then(function (indicies) {
              deferred.resolve(indicies);
            });
        }

        if (encounterId != 0 && status == "PENDING") {

          db.select().
            from(encounterTable).
            innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
            leftOuterJoin(diseaseIndex, encounterTable.Id.eq(diseaseIndex.EncounterId)).
            innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id)).
            leftOuterJoin(diseaseIndicies, diseaseIndex.Id.eq(diseaseIndicies.DiseaseIndexId)).
            leftOuterJoin(surgeryIndex, encounterTable.Id.eq(surgeryIndex.EncounterId)).
            leftOuterJoin(surgeryIndicies, surgeryIndex.Id.eq(surgeryIndicies.SurgeryIndexId)).
            where(
            lf.op.and(
              encounterTable.Id.eq(encounterId),
              encounterTable.IsDeleted.eq(false),
              diseaseIndicies.Id.eq(null),
              surgeryIndicies.Id.eq(null)
            )
            ).
            exec().
            then(function (indicies) {
              deferred.resolve(indicies);
            });
        }
      });
      return deferred.promise;
    }


    function UpdateObjectId(tableName, updatedId, oldId) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table(tableName);
        db.update(table).
          set(table.Id, (updatedId)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(oldId)).
          exec();
      });
    }

    function UpdateGlobalConstant(key, value) {
      //
      var deferred = $q.defer();
      // value = new Date(returnedItem.CreationDate);
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('GlobalConstants');
        db.update(table).
          set(table.Value, (value)).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Key.eq(key)).
          exec().then(function (result) {
            deferred.resolve(result);
          });
      });
      return deferred.promise;
    }

    function GetNursesWaitingList(departmentId, today) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var encounterTable = db.getSchema().table('Encounter');

        var patientTable = db.getSchema().table('Patient');
        var departmentTable = db.getSchema().table('Department');
        var genderTable = db.getSchema().table('Gender');
        var religionTable = db.getSchema().table('Religion');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var currentBed = db.getSchema().table('Bed');

        var wardStay = db.getSchema().table('WardStayHistory');

        db.select()
          .from(encounterTable)

          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .leftOuterJoin(wardStay, encounterTable.Id.eq(wardStay.EncounterId))
          .leftOuterJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id))
         // .leftOuterJoin(currentWard, currentBed.DepartmentId.eq(currentWard.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .orderBy(encounterTable.LocalId, lf.Order.DESC)
          .where(
          lf.op.and(
            encounterTable.DepartmentId.eq(departmentId),
            encounterTable.IsDeleted.eq(false),

            lf.op.or(
              lf.op.and(
                currentBed.IsOccupied.eq(true),
                wardStay.IsDischarged.eq(false),
                wardStay.EndDate.eq(null)
              ),
              lf.op.and(
                encounterTable.StartDate.gte(today)
              )

            )
          )
          ).exec().then(function (encounters) {
            var uniqueList = _.uniqBy(encounters,'Patient.LocalId');
            deferred.resolve(uniqueList);
          });

      });

      return deferred.promise;
    }

    function GetDoctorsWaitingList(physicianId, today) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var encounterTable = db.getSchema().table('Encounter');

        var patientTable = db.getSchema().table('Patient');
        var departmentTable = db.getSchema().table('Department');
        var genderTable = db.getSchema().table('Gender');
        var religionTable = db.getSchema().table('Religion');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var currentBed = db.getSchema().table('Bed');

        var wardStay = db.getSchema().table('WardStayHistory');

        db.select()
          .from(encounterTable)

          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(departmentTable, encounterTable.DepartmentId.eq(departmentTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .leftOuterJoin(wardStay, encounterTable.Id.eq(wardStay.EncounterId))
          .leftOuterJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id))
          .orderBy(encounterTable.LocalId, lf.Order.DESC)
          .where(
            lf.op.and(
              encounterTable.IsDeleted.eq(false),
              encounterTable.AttendingPhysician.eq(physicianId),
              lf.op.or(
                lf.op.and(
                  currentBed.IsOccupied.eq(true),
                  wardStay.IsDischarged.eq(false),
                  wardStay.EndDate.eq(null)
                ),
                lf.op.and(
                  encounterTable.StartDate.gte(today)
                )
              )
            )
            ).exec().then(function (encounters) {
              var uniqueList = _.uniqBy(encounters,'Patient.LocalId');
              deferred.resolve(uniqueList);
          });

      });
      return deferred.promise;
    }

    function UpdateEncounter(encounter) {
      lovefield.getDB().then(function (db) {
        var encounterTable = db.getSchema().table('Encounter');
        db.update(encounterTable).
          set(encounterTable.Situation, (encounter.Situation)).
          set(encounterTable.AttendingPhysician, (encounter.AttendingPhysician)).
          set(encounterTable.EndDate, encounter.EndDate).
          set(encounterTable.Number, encounter.Number).
          set(encounterTable.DepartmentId,encounter.DepartmentId).
          set(encounterTable.LastModifiedDate, new Date()).
          where(
          encounterTable.Id.eq(encounter.Id)).
          exec();
      });
    }

    function GetPatientDetailsByEncounterId(encounterId,patientId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var vitalSignsTable = db.getSchema().table('VitalSigns');
        var consultationTable = db.getSchema().table('Consultations');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var scheme = db.getSchema().table('Scheme');
        var clinicTable = db.getSchema().table('Department').as('ClinicVisited');
        var consultantInchargeTable = db.getSchema().table('StaffMember').as('ConsultantInCharge');
        var requestingDoctorTable = db.getSchema().table('StaffMember').as('RequestingDoctor');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        var religionTable = db.getSchema().table('Religion');
        var diagnosisEntriesTable = db.getSchema().table('DiagnosisEntries');
        var diagnosisByTable = db.getSchema().table('StaffMember').as('DiagnosisBy');
        var genderTable = db.getSchema().table('Gender');
        var rhesusFactorTable = db.getSchema().table('RhesusFactor');
        var bloodTypeTable = db.getSchema().table('BloodType');
        var genotypeTable = db.getSchema().table('Genotype');
        var wardStayTable = db.getSchema().table('WardStayHistory');
        var bedTable = db.getSchema().table('Bed');
        var saleTable = db.getSchema().table('Sale');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var itemDepartment = db.getSchema().table('Department').as('ItemDepartment');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var testParameterTable = db.getSchema().table('TestParameter');
        var wardTable = db.getSchema().table('Department');
        var vitalSignStafTable = db.getSchema().table('StaffMember').as('VitalSignBy');
        var labresultTable = db.getSchema().table('LabResult');
        var labResultEntriesTable = db.getSchema().table('LabResultEntries');
        var radiologyResultTable = db.getSchema().table('RadiologyResult');
        var labResultBy = db.getSchema().table('StaffMember').as('LabResultBy');
        var xrayResultBy = db.getSchema().table('StaffMember').as('XrayResultBy');
        var rshipWithNok = db.getSchema().table('Relationship').as('RelationshipWithNok');
        if(encounterId!=null){
          db.select()
          .from(encounterTable)

          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(consultationTable, encounterTable.Id.eq(consultationTable.EncounterId))
          .leftOuterJoin(requestingDoctorTable, consultationTable.DoctorsId.eq(requestingDoctorTable.Id))
          .leftOuterJoin(vitalSignsTable, encounterTable.Id.eq(vitalSignsTable.EncounterId))
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .leftOuterJoin(rshipWithNok, patientTable.RelationshipWithNokId.eq(rshipWithNok.Id))
          .innerJoin(clinicTable, encounterTable.DepartmentId.eq(clinicTable.Id))
          .leftOuterJoin(rhesusFactorTable, patientTable.RhesusFactorId.eq(rhesusFactorTable.Id))
          .leftOuterJoin(saleTable, encounterTable.Id.eq(saleTable.EncounterId))
          .leftOuterJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId))
          .leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(itemDepartment, saleEntryTable.BillingOutletId.eq(itemDepartment.Id))
          .leftOuterJoin(genotypeTable, patientTable.GenotypeId.eq(genotypeTable.Id))
          .leftOuterJoin(bloodTypeTable, patientTable.BloodTypeId.eq(bloodTypeTable.Id))
          .leftOuterJoin(vitalSignStafTable, vitalSignsTable.TakenBy.eq(vitalSignStafTable.Id))
          .leftOuterJoin(wardStayTable, encounterTable.Id.eq(wardStayTable.EncounterId))
          .leftOuterJoin(bedTable, wardStayTable.NewBedId.eq(bedTable.Id))
          .leftOuterJoin(wardTable, bedTable.DepartmentId.eq(wardTable.Id))
          .leftOuterJoin(consultantInchargeTable, consultationTable.ConsultantInChargeId.eq(consultantInchargeTable.Id))
          .leftOuterJoin(diagnosisEntriesTable, consultationTable.Id.eq(diagnosisEntriesTable.ConsultationId))
          .leftOuterJoin(diagnosisByTable, diagnosisEntriesTable.DiagnosisBy.eq(diagnosisByTable.Id))
          .leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId))
          .leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id))
          .leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id))
          .leftOuterJoin(labresultTable, saleEntryTable.Id.eq(labresultTable.SaleEntryId))
          .leftOuterJoin(labResultEntriesTable, labresultTable.Id.eq(labResultEntriesTable.LabResultId))
          .leftOuterJoin(testParameterTable, labResultEntriesTable.TestParameterId.eq(testParameterTable.Id))
          .leftOuterJoin(labResultBy, labresultTable.EnteredByStaffId.eq(labResultBy.Id))
          .leftOuterJoin(radiologyResultTable, saleEntryTable.Id.eq(radiologyResultTable.SaleEntryId))
          .leftOuterJoin(xrayResultBy, radiologyResultTable.PreparedBy.eq(xrayResultBy.Id))
          .where(
          lf.op.and(
            encounterTable.IsDeleted.eq(false),
            encounterTable.Id.eq(encounterId),
            lf.op.or(
              radiologyResultTable.Id.eq(null), radiologyResultTable.IsSentToDoctor.eq(true)
            ),
            lf.op.or(
              labresultTable.Id.eq(null), labresultTable.HasSentToDoctor.eq(true)
            )
          )
          ).exec().then(function (encounterDetails) {
            deferred.resolve(encounterDetails);
          });
        }
        else if(patientId!=null){
          db.select()
          .from(encounterTable)

          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(consultationTable, encounterTable.Id.eq(consultationTable.EncounterId))
          .leftOuterJoin(requestingDoctorTable, consultationTable.DoctorsId.eq(requestingDoctorTable.Id))
          .leftOuterJoin(vitalSignsTable, encounterTable.Id.eq(vitalSignsTable.EncounterId))
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .leftOuterJoin(rshipWithNok, patientTable.RelationshipWithNokId.eq(rshipWithNok.Id))
          .innerJoin(clinicTable, encounterTable.DepartmentId.eq(clinicTable.Id))
          .leftOuterJoin(rhesusFactorTable, patientTable.RhesusFactorId.eq(rhesusFactorTable.Id))
          .leftOuterJoin(saleTable, encounterTable.Id.eq(saleTable.EncounterId))
          .leftOuterJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId))
          .leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(itemDepartment, saleEntryTable.BillingOutletId.eq(itemDepartment.Id))
          .leftOuterJoin(genotypeTable, patientTable.GenotypeId.eq(genotypeTable.Id))
          .leftOuterJoin(bloodTypeTable, patientTable.BloodTypeId.eq(bloodTypeTable.Id))
          .leftOuterJoin(vitalSignStafTable, vitalSignsTable.TakenBy.eq(vitalSignStafTable.Id))
          .leftOuterJoin(wardStayTable, encounterTable.Id.eq(wardStayTable.EncounterId))
          .leftOuterJoin(bedTable, wardStayTable.NewBedId.eq(bedTable.Id))
          .leftOuterJoin(wardTable, bedTable.DepartmentId.eq(wardTable.Id))
          .leftOuterJoin(consultantInchargeTable, consultationTable.ConsultantInChargeId.eq(consultantInchargeTable.Id))
          .leftOuterJoin(diagnosisEntriesTable, consultationTable.Id.eq(diagnosisEntriesTable.ConsultationId))
          .leftOuterJoin(diagnosisByTable, diagnosisEntriesTable.DiagnosisBy.eq(diagnosisByTable.Id))
          .leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId))
          .leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id))
          .leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id))
          .leftOuterJoin(labresultTable, saleEntryTable.Id.eq(labresultTable.SaleEntryId))
          .leftOuterJoin(labResultEntriesTable, labresultTable.Id.eq(labResultEntriesTable.LabResultId))
          .leftOuterJoin(testParameterTable, labResultEntriesTable.TestParameterId.eq(testParameterTable.Id))
          .leftOuterJoin(labResultBy, labresultTable.EnteredByStaffId.eq(labResultBy.Id))
          .leftOuterJoin(radiologyResultTable, saleEntryTable.Id.eq(radiologyResultTable.SaleEntryId))
          .leftOuterJoin(xrayResultBy, radiologyResultTable.PreparedBy.eq(xrayResultBy.Id))
          .orderBy(encounterTable.LocalId,lf.Order.ASC)
          .where(
          lf.op.and(
            encounterTable.IsDeleted.eq(false),
            encounterTable.PatientId.eq(patientId),
            lf.op.or(
              radiologyResultTable.Id.eq(null), radiologyResultTable.IsSentToDoctor.eq(true)
            ),
            lf.op.or(
              labresultTable.Id.eq(null), labresultTable.HasSentToDoctor.eq(true)
            )
          )
          ).exec().then(function (encounterDetails) {

            deferred.resolve(encounterDetails);
          });
        }

      });
      return deferred.promise;
    }

    function GetTestParameters(sellableItemId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var sellableItemTable = db.getSchema().table('SellableItem')
        var testParameterTable = db.getSchema().table('TestParameter');
        var departmentTable = db.getSchema().table('Department');

        db.select()
          .from(testParameterTable)

          .innerJoin(sellableItemTable, testParameterTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(departmentTable, sellableItemTable.ServiceDepartmentId.eq(departmentTable.Id))
          .where(
          lf.op.and(
            sellableItemTable.IsDrug.eq(false),
            departmentTable.Category.eq('Laboratory'),
            testParameterTable.IsDeleted.eq(false),
            testParameterTable.SellableItemId.eq(sellableItemId)
          )
          ).exec().then(function (parameters) {
            deferred.resolve(parameters);
          });
      });
      return deferred.promise;
    }

    function UpdateParameter(updatedParameter) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('TestParameter');
        db.update(table).
          set(table.Name, (updatedParameter.Name)).
          set(table.Range, updatedParameter.Range).
          set(table.Unit, updatedParameter.Unit).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(updatedParameter.Id)).
          exec();
      });
    }

    function GetWardDetails(startDate, endDate, patientIdentity, wardId) {

      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {


        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var encounterTable = db.getSchema().table('Encounter');
        var wardstayhistoryTable = db.getSchema().table('WardStayHistory');
        var departmentTable = db.getSchema().table('Department');
        var bedTable = db.getSchema().table('Bed');

        if (startDate && endDate != undefined) {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'), patientTable.Number.as('PatientNo'), genderTable.Name.as('GenderName'),
            patientTable.DateOfBirth.as('DateOfBirth'), bedTable.Id.as('Id'), wardstayhistoryTable.NewBedId.as('bedId'), bedTable.DepartmentId.as('wardId'), departmentTable.Id.as('departmentId'), departmentTable.Name.as('CurrentWard'), wardstayhistoryTable.StartDate.as('AdmissionDate'), wardstayhistoryTable.TransferDate.as('TransferDate')).
            from(patientTable).

            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).

            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).
            orderBy(encounterTable.LocalId, lf.Order.DESC).
            where(
            lf.op.and(
              patientTable.IsDeleted.eq(false),
              wardstayhistoryTable.OldBedId.neq(null),
              wardstayhistoryTable.TransferDate.between(startDate, endDate)
            )
            )
            .exec().then(function (patient) {

              deferred.resolve(patient);
            });
        } else if (patientIdentity != undefined) {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'), patientTable.Number.as('PatientNo'), genderTable.Name.as('GenderName'),
            patientTable.DateOfBirth.as('DateOfBirth'), departmentTable.Name.as('CurrentWard'), wardstayhistoryTable.StartDate.as('AdmissionDate'), wardstayhistoryTable.TransferDate.as('TransferDate')).

            from(patientTable).

            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).
            orderBy(encounterTable.LocalId, lf.Order.DESC).
            where(
            lf.op.and(
              patientTable.IsDeleted.eq(false),
              wardstayhistoryTable.OldBedId.neq(null),
              //  patientTable.Id.neq(null),
              patientTable.Id.eq(patientIdentity['Patient'].Id)
            )
            )
            .exec().then(function (patient) {
              deferred.resolve(patient);
            })
        } else {
          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'), patientTable.Number.as('PatientNo'), genderTable.Name.as('GenderName'),
            patientTable.DateOfBirth.as('DateOfBirth'), departmentTable.Name.as('CurrentWard'), wardstayhistoryTable.StartDate.as('AdmissionDate'), wardstayhistoryTable.TransferDate.as('TransferDate')).
            from(patientTable).

            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).
            orderBy(encounterTable.LocalId, lf.Order.DESC).
            where(
            lf.op.and(
              patientTable.IsDeleted.eq(false),
              wardstayhistoryTable.OldBedId.neq(null),
              departmentTable.Id.eq(wardId)
            )
            )
            .exec().then(function (wardDetails) {
              deferred.resolve(wardDetails);
            })
        }
      });
      return deferred.promise;
    }

    function GetRegisteredPatients(startDate, endDate) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var encounterTable = db.getSchema().table('Encounter');
        var departmentTable = db.getSchema().table('Department');

        db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'),
          patientTable.Number.as('PatientNumber'), patientTable.PatientCategory.as('PatientCategory'),
          patientTable.ResidentialAddress.as('ContactAddress'), patientTable.RegistrationDate.as('RegistrationDate'),
          patientTable.DateOfBirth.as('DateOfBirth'), genderTable.Name.as('GenderName')).
          from(patientTable).
          innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).

          where(
          lf.op.and(
            patientTable.IsDeleted.eq(false),
            patientTable.RegistrationDate.between(startDate, endDate)
          )
          )
          .exec().
          then(function (registeredPatients) {
            deferred.resolve(registeredPatients);
          });

      });
      return deferred.promise;
    }

    function GetPatientAdmsissionDetails(startDate, endDate, patientIdentity, wardId, patientCategory) {

      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {
        var bedTable = db.getSchema().table('Bed');
        var wardstayhistoryTable = db.getSchema().table('WardStayHistory');

        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var encounterTable = db.getSchema().table('Encounter');
        var departmentTable = db.getSchema().table('Department');

        if (startDate && endDate != undefined) {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'),
            patientTable.Number.as('PatientNumber'), patientTable.PatientCategory.as('PatientCategory'),
            patientTable.ResidentialAddress.as('ContactAddress'), patientTable.RegistrationDate.as('RegistrationDate'),
            patientTable.DateOfBirth.as('DateOfBirth'), genderTable.Name.as('GenderName'), departmentTable.Name.as('Ward'),
            bedTable.Number.as('BedAssigned'), wardstayhistoryTable.StartDate.as('AdmissionDate')).
            from(patientTable).

            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).

            where(
            lf.op.and(
              bedTable.Id.neq(null),
              patientTable.IsDeleted.eq(false),
              patientTable.RegistrationDate.between(startDate, endDate)
            )
            )
            .exec().
            then(function (patientAdmissionDetails) {
              deferred.resolve(patientAdmissionDetails);
            });
        } else if (patientIdentity != undefined) {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'),
            patientTable.Number.as('PatientNumber'), patientTable.PatientCategory.as('PatientCategory'),
            patientTable.ResidentialAddress.as('ContactAddress'), patientTable.RegistrationDate.as('RegistrationDate'),
            patientTable.DateOfBirth.as('DateOfBirth'), genderTable.Name.as('GenderName'), departmentTable.Name.as('Ward'),
            bedTable.Number.as('BedAssigned'), wardstayhistoryTable.StartDate.as('AdmissionDate')).
            from(patientTable).

            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).

            where(
            lf.op.and(
              bedTable.Id.neq(null),
              patientTable.IsDeleted.eq(false),
              patientTable.Id.eq(patientIdentity['Patient'].Id)
            )
            )
            .exec().
            then(function (patientAdmissionDetails) {
              deferred.resolve(patientAdmissionDetails);
            });
        } else if (wardId != undefined) {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'),
            patientTable.Number.as('PatientNumber'), patientTable.PatientCategory.as('PatientCategory'),
            patientTable.ResidentialAddress.as('ContactAddress'), patientTable.RegistrationDate.as('RegistrationDate'),
            patientTable.DateOfBirth.as('DateOfBirth'), genderTable.Name.as('GenderName'), departmentTable.Name.as('Ward'),
            bedTable.Number.as('BedAssigned'), wardstayhistoryTable.StartDate.as('AdmissionDate')).
            from(patientTable).

            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).

            where(
            lf.op.and(
              bedTable.Id.neq(null),
              patientTable.IsDeleted.eq(false),
              bedTable.DepartmentId.eq(wardId)
            )
            )
            .exec().
            then(function (patientAdmissionDetails) {
              deferred.resolve(patientAdmissionDetails);
            });
        } else if (patientCategory = 'All') {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'),
            patientTable.Number.as('PatientNumber'), patientTable.PatientCategory.as('PatientCategory'),
            patientTable.ResidentialAddress.as('ContactAddress'), patientTable.RegistrationDate.as('RegistrationDate'),
            patientTable.DateOfBirth.as('DateOfBirth'), genderTable.Name.as('GenderName'), departmentTable.Name.as('Ward'),
            bedTable.Number.as('BedAssigned'), wardstayhistoryTable.StartDate.as('AdmissionDate')).
            from(patientTable).

            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).

            where(
            lf.op.and(
              bedTable.Id.neq(null),
              patientTable.IsDeleted.eq(false),
              patientTable.PatientCategory.neq(null)
            )
            )
            .exec().
            then(function (patientAdmissionDetails) {
              deferred.resolve(patientAdmissionDetails);
            });
        } else {

          db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('OtherNames'),
            patientTable.Number.as('PatientNumber'), patientTable.PatientCategory.as('PatientCategory'),
            patientTable.ResidentialAddress.as('ContactAddress'), patientTable.RegistrationDate.as('RegistrationDate'),
            patientTable.DateOfBirth.as('DateOfBirth'), genderTable.Name.as('GenderName'), departmentTable.Name.as('Ward'),
            bedTable.Number.as('BedAssigned'), wardstayhistoryTable.StartDate.as('AdmissionDate')).
            from(patientTable).

            innerJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId)).
            innerJoin(bedTable, wardstayhistoryTable.NewBedId.eq(bedTable.Id)).
            innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id)).
            innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId)).
            innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).

            where(
            lf.op.and(
              bedTable.Id.neq(null),
              patientTable.IsDeleted.eq(false),
              patientTable.PatientCategory.eq(patientCategory)
            )
            )
            .exec().
            then(function (patientAdmissionDetails) {
              deferred.resolve(patientAdmissionDetails);
            });
        }
      })
      return deferred.promise;
    }

    function GetStates(countryId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var stateTable = db.getSchema().table('State');

        db.select().
          from(stateTable).

          where(
          lf.op.and(
            stateTable.IsDeleted.eq(false),
            stateTable.CountryId.eq(countryId)
          )
          ).exec().
          then(function (state) {
            deferred.resolve(state);
          });
      });
      return deferred.promise;
    }

    function GetSpecimenCollectionStatus(patientId, startDate, endDate, isEditCollection) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleTable = db.getSchema().table('Sale');
        var genderTable = db.getSchema().table('Gender');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        if (patientId != undefined) {
          db.select()
            .from(saleEntryTable)

            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .where(
            lf.op.and(
              saleEntryTable.IsDeleted.eq(false),
              patientTable.Id.eq(patientId),
              saleEntryTable.Specimen.neq(null),
              //     saleEntryTable.Specimen.neq(undefined),
              saleEntryTable.SampleCollected.neq(null),
              //         saleEntryTable.SampleCollected.neq(undefined),
              saleEntryTable.SampleCollected.eq(isEditCollection)
            )
            ).exec().then(function (salentry) {
              deferred.resolve(salentry);
            });
        } else if (startDate && endDate != undefined) {
          db.select()
            .from(saleEntryTable)

            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
            .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
            .where(
            lf.op.and(
              saleEntryTable.IsDeleted.eq(false),
              //     patientTable.Id.eq(patientId),
              saleEntryTable.Specimen.neq(null),
              //      saleEntryTable.Specimen.neq(undefined),
              saleEntryTable.SampleCollected.neq(null),
              //      saleEntryTable.SampleCollected.neq(undefined),
              saleEntryTable.SampleCollected.eq(isEditCollection),
              saleEntryTable.TransactionDate.between(startDate, endDate)
            )
            ).exec().then(function (salentry) {
              deferred.resolve(salentry);
            });
        }


      });
      return deferred.promise;
    }

    function SubmitSampleCollection(collection) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('SaleEntry');
        db.update(table).
          set(table.SampleCollected, (collection.SampleCollected)).
          set(table.SampleCollectedBy, collection.LoggedInStaff).
          set(table.DateOfSampleCollection, new Date()).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(collection.Id)).
          exec();
      });
    }

    function GetTemplateAssignment(departmentId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var departmentTable = db.getSchema().table('Department')
        var templateAssignmentTable = db.getSchema().table('TemplateAssignments');

        db.select()
          .from(templateAssignmentTable)

          .innerJoin(departmentTable, templateAssignmentTable.DepartmentId.eq(departmentTable.Id))
          .where(
          lf.op.and(
            templateAssignmentTable.IsDeleted.eq(false),
            departmentTable.Id.eq(departmentId)
          )
          ).exec().then(function (template) {
            deferred.resolve(template);
          });
      });
      return deferred.promise;
    }

    function EditTemplateAssignment(assignment) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('TemplateAssignments');
        db.update(table).
          set(table.Name, (assignment.Name)).
          set(table.AssignedBy, assignment.AssignedBy).
          set(table.DateAssigned, new Date()).
          set(table.LastModifiedDate, new Date()).
          where(
          table.DepartmentId.eq(assignment.DepartmentId)).
          exec();
      });
    }

    // function GetVisitDetails(patientId){
    //     var deferred = $q.defer();
    //     lovefield.getDB().then(function(db){
    //         var diagnosisByTable=db.getSchema().table('DiagnosisEntries');
    //         var consultationTable =db.getSchema().table('Consultations');
    //         var encounterTable = db.getSchema().table('Encounter');
    //         var vitalSignsTable = db.getSchema().table('VitalSigns');

    //         db.select()
    //         .from(diagnosisEntriesTable)
    //         .innerJoin(consultationTable,diagnosisEntriesTable.ConsultationId.eq(consultationTable.Id))
    //         .innerJoin(encounterTable,consultationTable.EncounterId.eq(encounterTable.Id))
    //         .leftOuterJoin(vitalSignsTable,encounterTable.Id.eq(vitalSignsTable.EncounterId))

    //         .where(
    //             lf.op.and(
    //                 encounterTable.PatientId.eq(patientId),
    //                 diagnosisEntriesTable.IsDeleted.eq(false)
    //             )
    //         )
    //     })
    // }

    function GetServiceRequest(departmentId, saleReceiptId, startDate, endDate, isEdit) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleTable = db.getSchema().table('Sale')
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var testParameterTable = db.getSchema().table('TestParameter');
        var genderTable = db.getSchema().table('Gender');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var religionTable = db.getSchema().table('Religion');
        var schemeTable = db.getSchema().table('Scheme');
        var schemePlanTable = db.getSchema().table('SchemePlans')
        var schemeMembershipTable = db.getSchema().table('SchemeMembership');
        // var staffMemberTable = db.getSchema().table('StaffMember');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var labResultTable = db.getSchema().table('LabResult');

        if (isEdit == false) {
          if (saleReceiptId != undefined) {
            db.select()
              .from(saleEntryTable)

              .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
              .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
              .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
              .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
              .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
              .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
              .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
              .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
              .leftOuterJoin(schemePlanTable, schemeMembershipTable.SchemePlansId.eq(schemePlanTable.Id))
              .leftOuterJoin(schemeTable, schemePlanTable.SchemeId.eq(schemeTable.Id))
              .leftOuterJoin(testParameterTable, sellableItemTable.Id.eq(testParameterTable.SellableItemId))
              .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
              .leftOuterJoin(labResultTable, saleEntryTable.Id.eq(labResultTable.SaleEntryId))
              .where(
              lf.op.and(
                saleEntryTable.IsDeleted.eq(false),
                saleReceiptTable.Id.eq(saleReceiptId),
                saleEntryTable.HasPaid.eq(true),
                sellableItemTable.ServiceDepartmentId.eq(departmentId),
                labResultTable.Id.eq(null)
              )
              ).exec().then(function (salentries) {
                deferred.resolve(salentries);
              });
          } else if (startDate && endDate != undefined) {

            db.select()
              .from(saleEntryTable)

              .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
              .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
              .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
              .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
              .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
              .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
              .leftOuterJoin(schemePlanTable, schemeMembershipTable.SchemePlansId.eq(schemePlanTable.Id))
              .leftOuterJoin(schemeTable, schemePlanTable.SchemeId.eq(schemeTable.Id))
              .leftOuterJoin(testParameterTable, sellableItemTable.Id.eq(testParameterTable.SellableItemId))
              .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
              .leftOuterJoin(labResultTable, saleEntryTable.Id.eq(labResultTable.SaleEntryId))
              .where(
              lf.op.and(
                saleEntryTable.IsDeleted.eq(false),
                saleTable.RequestDate.between(startDate, endDate),
                saleEntryTable.HasPaid.eq(true),
                sellableItemTable.ServiceDepartmentId.eq(departmentId),
                labResultTable.Id.eq(null)
              )
              ).exec().then(function (salentries) {
                deferred.resolve(salentries);
              });
          }
        } else if (isEdit == true) {
          if (saleReceiptId != undefined) {
            db.select()
              .from(saleEntryTable)

              .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
              .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
              .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
              .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
              .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
              .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
              .leftOuterJoin(schemePlanTable, schemeMembershipTable.SchemePlansId.eq(schemePlanTable.Id))
              .leftOuterJoin(schemeTable, schemePlanTable.SchemeId.eq(schemeTable.Id))
              .leftOuterJoin(testParameterTable, sellableItemTable.Id.eq(testParameterTable.SellableItemId))
              .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
              .leftOuterJoin(labResultTable, saleEntryTable.Id.eq(labResultTable.SaleEntryId))
              .where(
              lf.op.and(
                saleEntryTable.IsDeleted.eq(false),
                saleReceiptTable.Id.eq(saleReceiptId),
                saleEntryTable.HasPaid.eq(true),
                sellableItemTable.ServiceDepartmentId.eq(departmentId),
                labResultTable.Id.neq(null)
              )
              ).exec().then(function (salentries) {
                deferred.resolve(salentries);
              });
          } else if (startDate && endDate != undefined) {

            db.select()
              .from(saleEntryTable)

              .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
              .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
              .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
              .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
              .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
              .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
              .leftOuterJoin(schemePlanTable, schemeMembershipTable.SchemePlansId.eq(schemePlanTable.Id))
              .leftOuterJoin(schemeTable, schemePlanTable.SchemeId.eq(schemeTable.Id))
              .leftOuterJoin(testParameterTable, sellableItemTable.Id.eq(testParameterTable.SellableItemId))
              .leftOuterJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
              .leftOuterJoin(labResultTable, saleEntryTable.Id.eq(labResultTable.SaleEntryId))
              .where(
              lf.op.and(
                saleEntryTable.IsDeleted.eq(false),
                saleTable.RequestDate.between(startDate, endDate),
                saleEntryTable.HasPaid.eq(true),
                sellableItemTable.ServiceDepartmentId.eq(departmentId),
                labResultTable.Id.neq(null)
              )
              ).exec().then(function (salentries) {
                deferred.resolve(salentries);
              });
          }
        }
      });
      return deferred.promise;
    }

    function GetPreparedResult(saleEntryId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleEntryTable = db.getSchema().table('SaleEntry');

        var testParameterTable = db.getSchema().table('TestParameter');
        var labResultTable = db.getSchema().table('LabResult');
        var labResultEntryTable = db.getSchema().table('LabResultEntries')
        db.select()
          .from(labResultEntryTable)

          .innerJoin(labResultTable, labResultEntryTable.LabResultId.eq(labResultTable.Id))
          .innerJoin(saleEntryTable, labResultTable.SaleEntryId.eq(saleEntryTable.Id))
          .innerJoin(testParameterTable, labResultEntryTable.TestParameterId.eq(testParameterTable.Id))
          .where(
          lf.op.and(
            labResultEntryTable.IsDeleted.eq(false),
            labResultTable.SaleEntryId.eq(saleEntryId),
            saleEntryTable.HasPaid.eq(true)
          )
          ).exec().then(function (labresult) {
            deferred.resolve(labresult);
          });
      });
      return deferred.promise;
    }

    function UpdateLabResult(labResult) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('LabResult');
        db.update(table).
          set(table.Sickling, (labResult.Sickling)).
          set(table.SensitiveTo, labResult.SensitiveTo).
          set(table.ResistantTo, labResult.ResistantTo).
          set(table.NatureOfSpecimen, labResult.NatureOfSpecimen).
          set(table.HasSentToDoctor, (labResult.HasSentToDoctor)).
          set(table.Microscopy, labResult.Microscopy).
          set(table.HbGenotype, labResult.HbGenotype).
          set(table.Gross, labResult.Gross).
          set(table.Culture, (labResult.Culture)).
          set(table.ResultComment, labResult.ResultComment).
          set(table.Appearance, labResult.Appearance).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(labResult.Id)).
          exec();
      });
    }

    function UpdateXrayResult(xrayResult) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('RadiologyResult');
        db.update(table).
          set(table.NumberOfFilms, (xrayResult.NumberOfFilms)).
          set(table.FilmSize, xrayResult.FilmSize).
          set(table.DatePrepared, xrayResult.DatePrepared).
          set(table.PreparedBy, xrayResult.PreparedBy).
          set(table.IsSentToDoctor, (xrayResult.IsSentToDoctor)).
          set(table.Note, xrayResult.Note).
          set(table.VerifiersComment, xrayResult.VerifiersComment).
          set(table.IsVerified, xrayResult.IsVerified).
          set(table.IsVerifiedBy, (xrayResult.IsVerifiedBy)).
          set(table.DateVerified, xrayResult.DateVerified).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(xrayResult.Id)).
          exec();
      });
    }

    function UpdateLabResultEntry(labResultEntry) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('LabResultEntries');
        db.update(table).
          set(table.Result, (labResultEntry.Result)).
          set(table.AntigenH, labResultEntry.AntigenH).
          set(table.AntigenO, labResultEntry.AntigenO).
          set(table.Algorithm, labResultEntry.Algorithm).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(labResultEntry.Id)).
          exec();
      });
    }

    function GetLabResults(startDate, endDate, departmentId, isVerifiedResults) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var labResultTable = db.getSchema().table('LabResult');
        var labResultEntries = db.getSchema().table('LabResultEntries');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var sellableItemId = db.getSchema().table('SellableItem');
        var saleTable = db.getSchema().table('Sale');
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');

        if (departmentId != undefined) {
          db.select()
            .from(labResultTable)

            .leftOuterJoin(labResultEntries, labResultTable.Id.eq(labResultEntries.LabResultId))
            .leftOuterJoin(saleEntryTable, labResultTable.SaleEntryId.eq(saleEntryTable.Id))
            .leftOuterJoin(sellableItemId, saleEntryTable.SellableItemId.eq(sellableItemId.Id))
            .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))

            .where(
            lf.op.and(
              labResultTable.IsDeleted.eq(false),
              labResultTable.DateEntered.between(startDate, endDate),
              sellableItemId.ServiceDepartmentId.eq(departmentId),
              labResultTable.IsVerified.eq(isVerifiedResults)
            )
            ).exec().then(function (labResults) {
              deferred.resolve(labResults);
            });
        } else {
          db.select()
            .from(labResultTable)

            .leftOuterJoin(labResultEntries, labResultTable.Id.eq(labResultEntries.LabResultId))
            .leftOuterJoin(saleEntryTable, labResultTable.SaleEntryId.eq(saleEntryTable.Id))
            .leftOuterJoin(sellableItemId, saleEntryTable.SellableItemId.eq(sellableItemId.Id))
            .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .leftOuterJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))

            .where(
            lf.op.and(
              labResultTable.IsDeleted.eq(false),
              labResultTable.DateEntered.between(startDate, endDate),
              lf.op.or(
                labResultTable.IsVerified.eq(true),
                labResultTable.HasSentToDoctor.eq(true)
              )
            )
            ).exec().then(function (labResults) {
              deferred.resolve(labResults);
            });
        }


      });
      return deferred.promise;
    }

    function GetLabResult(resultId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var labResultTable = db.getSchema().table('LabResult');
        var labResultEntries = db.getSchema().table('LabResultEntries');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var sellableItemId = db.getSchema().table('SellableItem');
        var saleTable = db.getSchema().table('Sale');
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var testParameterTable = db.getSchema().table('TestParameter');

        db.select()
          .from(labResultTable)

          .innerJoin(labResultEntries, labResultTable.Id.eq(labResultEntries.LabResultId))
          .innerJoin(saleEntryTable, labResultTable.SaleEntryId.eq(saleEntryTable.Id))
          .innerJoin(sellableItemId, saleEntryTable.SellableItemId.eq(sellableItemId.Id))
          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(testParameterTable, labResultEntries.TestParameterId.eq(testParameterTable.Id))
          .where(
          lf.op.and(
            labResultTable.IsDeleted.eq(false),
            labResultTable.Id.eq(resultId)
          )
          ).exec().then(function (labResults) {
            deferred.resolve(labResults);
          })
      });
      return deferred.promise;
    }

    function SubmitVerificationData(data) {
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('LabResult');
        db.update(table)
          .set(table.VerificationComment, data.VerificationComment)
          .set(table.DateEntered, new Date())
          .set(table.VerifiedBy, data.VerifiedBy)
          .set(table.IsVerified, data.IsVerified)
          .set(table.LastModifiedDate, new Date())
          .set(table.HasSentToDoctor, data.HasSentToDoctor)
          .where(
          table.Id.eq(data.Id)
          ).exec();
      });
    }

    function GetLabResultForView(resultId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var labResultTable = db.getSchema().table('LabResult');
        var labResultEntries = db.getSchema().table('LabResultEntries');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var departmentTable = db.getSchema().table('Department')
        var sellableItemTable = db.getSchema().table('SellableItem');
        var genderTable = db.getSchema().table('Gender');
        var saleTable = db.getSchema().table('Sale');
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var testParameterTable = db.getSchema().table('TestParameter');


        db.select(departmentTable.Name.as('DepartmentName'), patientTable.OtherNames.as('OtherNames'), patientTable.Number.as('PatientNumber'), patientTable.Surname.as('Surname'), patientTable.DateOfBirth.as('DateOfBirth'),
          saleEntryTable.Specimen.as('Specimen'), genderTable.Name.as('Sex'), labResultTable.Number.as('Result Number'), saleTable.RequestDate.as('RequestDate'), saleEntryTable.DateOfSampleCollection.as('Date of Sample Collection'),
          testParameterTable.Name.as('Parameter'), saleEntryTable.Name.as('Test'), labResultTable.VerificationComment.as('VerifierComment'), saleEntryTable.DateOfSampleCollection.as('DateOfSpecimenCollection'), testParameterTable.Range.as('Range'), labResultEntries.Result.as('Result'), saleTable.Number.as('LabNumber'))
          .from(labResultTable)

          .innerJoin(labResultEntries, labResultTable.Id.eq(labResultEntries.LabResultId))
          .innerJoin(saleEntryTable, labResultTable.SaleEntryId.eq(saleEntryTable.Id))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(departmentTable, sellableItemTable.ServiceDepartmentId.eq(departmentTable.Id))
          .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .innerJoin(testParameterTable, labResultEntries.TestParameterId.eq(testParameterTable.Id))
          .where(
          lf.op.and(
            labResultTable.IsDeleted.eq(false),
            labResultTable.Id.eq(resultId)
          )
          ).exec().then(function (labResults) {
            deferred.resolve(labResults);
          })
      });
      return deferred.promise;
    }

    function GetDefaultLocation() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var locationTable = db.getSchema().table('Department');

        db.select()
          .from(locationTable)
          .where(
          lf.op.and(
            locationTable.IsDeleted.eq(false),
            locationTable.Category.eq('Default')
          )
          ).exec().then(function (location) {
            deferred.resolve(location);
          })
      });
      return deferred.promise;
    }

    function GetHospitalScheme() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var schemeTable = db.getSchema().table('Scheme');
        db.select()
          .from(schemeTable)
          .where(
          lf.op.and(
            schemeTable.IsDeleted.eq(false),
            schemeTable.Name.eq('HOSPITAL SCHEME')
          )
          ).exec().then(function (scheme) {
            deferred.resolve(scheme);
          })
      });
      return deferred.promise;
    }

    function GetPatientEncounters(patientId, startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var patientTable = db.getSchema().table('Patient');

        var gender = db.getSchema().table('Gender');
        var maritalState = db.getSchema().table('MaritalState');
        var religion = db.getSchema().table('Religion');
        var encounterTable = db.getSchema().table('Encounter');
        var wardStay = db.getSchema().table('WardStayHistory');
        var schemeMembership = db.getSchema().table('SchemeMembership');
        var scheme = db.getSchema().table('Scheme');
        var currentBed = db.getSchema().table('Bed');
        var oldBed = db.getSchema().table('Bed').as('OldBed');
        var currentWard = db.getSchema().table('Department');
        var oldWard = db.getSchema().table('Department').as('OldWard');
        var schemePlansTable = db.getSchema().table('SchemePlans');
        //  var searchTextMatcher = new RegExp(searchText, "i");
        db.select().
          from(encounterTable).
          innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id)).
          innerJoin(gender, patientTable.GenderId.eq(gender.Id)).
          innerJoin(maritalState, patientTable.MaritalStateId.eq(maritalState.Id)).
          leftOuterJoin(religion, patientTable.ReligionId.eq(religion.Id)).
          leftOuterJoin(wardStay, encounterTable.Id.eq(wardStay.EncounterId)).
          leftOuterJoin(schemeMembership, patientTable.Id.eq(schemeMembership.PatientId)).
          leftOuterJoin(schemePlansTable, schemeMembership.SchemePlansId.eq(schemePlansTable.Id)).
          leftOuterJoin(scheme, schemePlansTable.SchemeId.eq(scheme.Id)).
          leftOuterJoin(currentBed, wardStay.NewBedId.eq(currentBed.Id)).
          leftOuterJoin(oldBed, wardStay.OldBedId.eq(oldBed.Id)).
          leftOuterJoin(currentWard, currentBed.DepartmentId.eq(currentWard.Id)).
          leftOuterJoin(oldWard, oldBed.DepartmentId.eq(oldWard.Id)).
          orderBy(encounterTable.LocalId, lf.Order.DESC)
          .where(
          lf.op.and(
            encounterTable.IsDeleted.eq(false),
            patientTable.Id.eq(patientId),
            encounterTable.StartDate.between(startDate, endDate)
          )
          ).exec().then(function (encounters) {
            var uniqueEncounters = _.uniqBy(encounters, 'Encounter.LocalId');
            deferred.resolve(uniqueEncounters);
          })
      });
      return deferred.promise;
    }


    function GetFreeBedsBeds() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        //var departmentTable = db.getSchema().table('Department');

        var bedTable = db.getSchema().table('Bed');

        db.select().
          from(bedTable).

          ///innerJoin(departmentTable, bedTable.DepartmentId.eq(departmentTable.Id)).
          where(
          lf.op.and(
            bedTable.Id.neq('301')
          )
          ).exec().
          then(function (beds) {
            // var uniqueBeds = _.uniqBy(beds, 'Bed.LocalId');
            deferred.resolve(beds);
          });
      });

      return deferred.promise;
    }

    function GetAllOpenEncounters() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {


        var wardStayTable = db.getSchema().table('WardStayHistory');

        db.select().
          from(wardStayTable).


          where(
          lf.op.and(
            wardStayTable.Id.neq('3014'),
            wardStayTable.IsDischarged.eq(false)
          )
          ).exec().
          then(function (wardStay) {

            deferred.resolve(wardStay);
          });
      });

      return deferred.promise;
    }




    function UpdateWardStay(wardStay) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var table = db.getSchema().table('WardStayHistory');
        db.update(table)
          .set(table.EndDate, wardStay.DischargeDate)
          .set(table.IsDischarged, wardStay.IsDischarged)
          .set(table.DischargeStatus, wardStay.DischargeStatus)
          .set(table.DischargedByStatus, wardStay.DischargedByStatus)
          .set(table.DischargedBy, wardStay.DischargedBy)
          .set(table.DischargeDate, wardStay.DischargeDate)
          .set(table.LastModifiedDate, new Date())
          .where(
          table.Id.eq(wardStay.Id)
          ).exec().then(function (result) {
            deferred.resolve(result);
          });
      });
      return deferred.promise;
    }

    function FinalizeAndUnfinalizeBills(encounterId, toFinalize) {
      lovefield.getDB().then(function (db) {
        var saleTable = db.getSchema().table('Sale');


        db.select(saleTable.Id.as('Id'))
          .from(saleTable)

          .where(lf.op.and(saleTable.IsDeleted.eq(false), saleTable.IsFinalized.eq(!toFinalize), saleTable.EncounterId.eq(encounterId)))
          .exec().then(function (saleIds) {
            if (saleIds.length > 0) {
              saleIds.map(function (saleId) {
                db.update(saleTable)
                  .set(saleTable.IsFinalized, (toFinalize))
                  .set(saleTable.LastModifiedDate, new Date())
                  .where(saleTable.Id.eq(saleId.Id))
                  .exec().then(function (sale) {
                    //  console.log(sale);
                  });
              });
            }
          });
      });
    }

    function GetDrugFlowEntries(departmentId, sellableItemId, startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var departmentTable = db.getSchema().table('Department');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var staffMemberTable = db.getSchema().table('StaffMember');

        var drugformulationTable = db.getSchema().table('DrugFormulation');
        var drugclassificationTable = db.getSchema().table('DrugClassification');

        db.select(drugclassificationTable.Name.as('Classification'), drugformulationTable.Name.as('Formulation'), staffMemberTable.Username.as('Transaction By'),
          dispatchLogTable.Date.as('Date'), dispatchLogTable.Description.as('Description'), sellableItemTable.Name.as('Name'), sellableItemTable.BrandName.as('BrandName'), dispatchLogTable.Number.as('RefNo'), dispatchLogTable.InvoiceNumber.as('InvoiceNumber'), dispatchLogTable.Quantity.as('Quantity'), dispatchLogTable.FinalStockCount.as('Balance'), dispatchLogTable.InitialStockCount.as('InitialCount'))
          .from(dispatchLogTable)

          .innerJoin(departmentTable, dispatchLogTable.DepartmentId.eq(departmentTable.Id))
          .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))

          .leftOuterJoin(drugformulationTable, sellableItemTable.DrugFormulationId.eq(drugformulationTable.Id))
          .leftOuterJoin(drugclassificationTable, sellableItemTable.DrugClassificationId.eq(drugclassificationTable.Id))
          .orderBy(dispatchLogTable.Date, lf.Order.ASC)
          .where(
          lf.op.and(
            dispatchLogTable.DepartmentId.eq(departmentId),
            dispatchLogTable.SellableItemId.eq(sellableItemId),
            dispatchLogTable.Date.between(startDate, endDate)
          )
          ).exec().then(function (drugFlows) {
            deferred.resolve(drugFlows);
          });
      });
      return deferred.promise;
    }

    function GetRequestStatus(patientId, prefix, startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var labresultTable = db.getSchema().table('LabResult')
        var labResultEntriesTable = db.getSchema().table('LabResultEntries');
        var searchTextMatcher = new RegExp(prefix, "i");
        db.select()
          .from(saleEntryTable)

          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(labresultTable, saleEntryTable.Id.eq(labresultTable.SaleEntryId))
          .leftOuterJoin(labResultEntriesTable, labresultTable.Id.eq(labResultEntriesTable.LabResultId))
          .where(
          lf.op.and(
            patientTable.Id.eq(patientId),
            saleTable.Number.match(searchTextMatcher),
            //   saleEntryTable.TransactionDate.between(startDate, endDate),
            saleEntryTable.IsDeleted.eq(false)
          )
          ).exec().then(function (requests) {
            deferred.resolve(requests)
          });
      });
      return deferred.promise;
    }

    function GetDrugWithdrawalCodes(supplierId, startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var drugWithdrawalTable = db.getSchema().table('DrugWithdrawals');
        var supplierTable = db.getSchema().table('SupplierRegister');

        db.select()
          .from(drugWithdrawalTable)

          .innerJoin(supplierTable, drugWithdrawalTable.SupplierId.eq(supplierTable.Id))
          .where(
          lf.op.and(
            drugWithdrawalTable.IsDeleted.eq(false),
            drugWithdrawalTable.SupplierId.eq(supplierId),
            drugWithdrawalTable.Date.between(startDate, endDate)
          )
          ).exec().then(function (withdrawals) {
            deferred.resolve(withdrawals);
          });
      });
      return deferred.promise;
    }

    function GetDrugWithdrawals(withdrawalNumber) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var drugWithdrawalTable = db.getSchema().table('DrugWithdrawals');
        var supplierTable = db.getSchema().table('SupplierRegister');
        var dispatchLogTable = db.getSchema().table('SellableItemDispatchlog');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var staffMemberTable = db.getSchema().table('StaffMember');
        var departmentTable = db.getSchema().table('Department');
        db.select(dispatchLogTable.Quantity.as('QuantityReturned'), dispatchLogTable.ExpiryDate.as('ExpiryDate'), dispatchLogTable.InvoiceNumber.as('InvoiceNumber'),
          dispatchLogTable.BatchNumber.as('BatchNumber'), dispatchLogTable.Amount.as('Amount'), sellableItemTable.Name.as('ItemName'), sellableItemTable.BrandName.as('ItemBrandName'),
          staffMemberTable.LastName.as('LastName'), staffMemberTable.OtherNames.as('OtherNames'), departmentTable.Name.as('OutletName'), supplierTable.SupplierName.as('CompanyName'),
          dispatchLogTable.Number.as('CaptureCode'), dispatchLogTable.Date.as('Date'))
          .from(dispatchLogTable)

          .innerJoin(drugWithdrawalTable, dispatchLogTable.Number.eq(drugWithdrawalTable.Number))
          .innerJoin(sellableItemTable, dispatchLogTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(supplierTable, drugWithdrawalTable.SupplierId.eq(supplierTable.Id))
          .innerJoin(staffMemberTable, dispatchLogTable.StaffMemberId.eq(staffMemberTable.Id))
          .innerJoin(departmentTable, dispatchLogTable.DepartmentId.eq(departmentTable.Id))
          .where(
          lf.op.and(
            dispatchLogTable.IsDeleted.eq(false),
            drugWithdrawalTable.Number.eq(withdrawalNumber)
          )
          ).exec().then(function (withdrawals) {
            deferred.resolve(withdrawals);
          });
      });
      return deferred.promise;
    }

    function GetPendingRadiologyRequests() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var religionTable = db.getSchema().table('Religion');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var radiologyResultTable = db.getSchema().table('RadiologyResult')
        db.select()
          .from(patientTable)

          .innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId))

          .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .innerJoin(saleTable, encounterTable.Id.eq(saleTable.EncounterId))
          .innerJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(serviceDepartmentTable, sellableItemTable.ServiceDepartmentId.eq(serviceDepartmentTable.Id))
          .leftOuterJoin(radiologyResultTable, saleEntryTable.Id.eq(radiologyResultTable.SaleEntryId))
          .where(
          lf.op.and(
            patientTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            radiologyResultTable.Id.eq(null),
            serviceDepartmentTable.Category.eq('Radiology Unit'),
            saleEntryTable.TransactionDate.between(new Date(new Date().setDate(new Date().getDate() - 30)), new Date())
          )
          ).exec().then(function (requests) {
            var uniqueRequests = _.uniqBy(requests, 'Patient.LocalId');
            deferred.resolve(uniqueRequests);
          });
      });
      return deferred.promise;
    }

    function GetPreparedResults() {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var religionTable = db.getSchema().table('Religion');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var radiologyResultTable = db.getSchema().table('RadiologyResult')
        db.select()
          .from(patientTable)

          .innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId))
          .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .innerJoin(saleTable, encounterTable.Id.eq(saleTable.EncounterId))
          .innerJoin(saleEntryTable, saleTable.Id.eq(saleEntryTable.SaleId))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(serviceDepartmentTable, sellableItemTable.ServiceDepartmentId.eq(serviceDepartmentTable.Id))
          .leftOuterJoin(radiologyResultTable, saleEntryTable.Id.eq(radiologyResultTable.SaleEntryId))
          .where(
          lf.op.and(
            patientTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            radiologyResultTable.Id.neq(null),
            serviceDepartmentTable.Category.eq('Radiology Unit'),
            radiologyResultTable.DatePrepared.between(new Date(new Date().setDate(new Date().getDate() - 30)), new Date())
          )
          ).exec().then(function (results) {
            var uniqueResults = _.uniqBy(results, 'Patient.LocalId');
            deferred.resolve(uniqueResults);
          });
      });
      return deferred.promise;
    }

    function GetPreparedRadiologyRequestsByPatientId(patientId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var radiologyResultTable = db.getSchema().table('RadiologyResult');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var genderTable = db.getSchema().table('Gender');
        var religionTable = db.getSchema().table('Religion');
        db.select()
          .from(saleEntryTable)

          .innerJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(serviceDepartmentTable, sellableItemTable.ServiceDepartmentId.eq(serviceDepartmentTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(radiologyResultTable, saleEntryTable.Id.eq(radiologyResultTable.SaleEntryId))
          .where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            serviceDepartmentTable.Category.eq('Radiology Unit'),
            patientTable.Id.eq(patientId),
            radiologyResultTable.Id.neq(null)
          )
          ).exec().then(function (requests) {
            var uniqueRequests = _.uniqBy(requests, 'SaleEntry.LocalId');
            deferred.resolve(uniqueRequests);
          });
      });
      return deferred.promise;
    }

    function GetRadiologyRequests(patientId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var radiologyResultTable = db.getSchema().table('RadiologyResult');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var genderTable = db.getSchema().table('Gender');
        var religionTable = db.getSchema().table('Religion');
        db.select()
          .from(saleEntryTable)

          .innerJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(serviceDepartmentTable, sellableItemTable.ServiceDepartmentId.eq(serviceDepartmentTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(radiologyResultTable, saleEntryTable.Id.eq(radiologyResultTable.SaleEntryId))
          .where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleEntryTable.HasPaid.eq(true),
            serviceDepartmentTable.Category.eq('Radiology Unit'),
            patientTable.Id.eq(patientId)
          )
          ).exec().then(function (requests) {
            var uniqueRequests = _.uniqBy(requests, 'SaleEntry.LocalId');
            deferred.resolve(uniqueRequests);
          });
      });
      return deferred.promise;
    }

    function GetCompiledShifts_DepositCollection(compilationNumber) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var compilationTable = db.getSchema().table('ShiftCompilation');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var revenueDepartmentTable = db.getSchema().table('RevenueDepartment');
        var depositTable = db.getSchema().table('Deposit');
        var staffMemberTable = db.getSchema().table('StaffMember');

        db.select(revenueDepartmentTable.Name.as('RevName'), revenueDepartmentTable.Id.as('RevId'), depositTable.Id.as('FieldIdentity'), depositTable.TotalAmount.as('Amount'), depositTable.Id.as('DepositId'), posWorkShiftTable.Number.as('ShiftNumber'),
          posWorkShiftTable.StartDate.as('Shift Date'), depositTable.TotalAmount.as('ItemAmount'), staffMemberTable.Username.as('Username'))
          .from(compilationTable)

          .innerJoin(posWorkShiftTable, compilationTable.Id.eq(posWorkShiftTable.ShiftCompilationId))
          .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
          .leftOuterJoin(depositTable, posWorkShiftTable.Id.eq(depositTable.PosWorkShiftId))
          .leftOuterJoin(revenueDepartmentTable, depositTable.RevenueDepartmentId.eq(revenueDepartmentTable.Id))
          .where(
          lf.op.and(
            compilationTable.IsDeleted.eq(false),
            compilationTable.Number.eq(compilationNumber),
            depositTable.Description.eq('Deposit Made'),
            depositTable.IsCancelled.eq(false)
          )
          ).exec().then(function (shifts) {
            deferred.resolve(shifts);
          });
      });
      return deferred.promise;
    }

    function GetCompiledShifts_SaleCollection(compilationNumber) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var compilationTable = db.getSchema().table('ShiftCompilation');
        var posWorkShiftTable = db.getSchema().table('PosWorkShift');
        var revenueDepartmentTable = db.getSchema().table('RevenueDepartment');
        var paymentModeTable = db.getSchema().table('PaymentMode');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var staffMemberTable = db.getSchema().table('StaffMember');

        db.select(revenueDepartmentTable.Name.as('RevName'), revenueDepartmentTable.Id.as('RevId'), saleEntryTable.Id.as('FieldIdentity'), saleReceiptTable.TotalAmount.as('Amount'), saleReceiptTable.Id.as('SaleReceiptId'), saleEntryTable.Id.as('SaleEntryId'), posWorkShiftTable.Number.as('ShiftNumber'),
          posWorkShiftTable.StartDate.as('Shift Date'), saleEntryTable.ReceiptAmount.as('ItemAmount'), staffMemberTable.Username.as('Username'))
          .from(compilationTable)

          .innerJoin(posWorkShiftTable, compilationTable.Id.eq(posWorkShiftTable.ShiftCompilationId))
          .innerJoin(staffMemberTable, posWorkShiftTable.StaffMemberId.eq(staffMemberTable.Id))
          .leftOuterJoin(saleReceiptTable, posWorkShiftTable.Id.eq(saleReceiptTable.PosWorkShiftId))
          .leftOuterJoin(saleEntryTable, saleReceiptTable.Id.eq(saleEntryTable.SalesReceiptId))
          .leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .leftOuterJoin(revenueDepartmentTable, sellableItemTable.RevenueDepartmentId.eq(revenueDepartmentTable.Id))
          .where(
          lf.op.and(
            compilationTable.IsDeleted.eq(false),
            compilationTable.Number.eq(compilationNumber),
            saleReceiptTable.IsCancelled.eq(false)
          )
          ).exec().then(function (shifts) {
            deferred.resolve(shifts);
          });
      });
      return deferred.promise;
    }

    function GetDailyCashReportForServices(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');

        db.select(lf.fn.max(sellableItemTable.Name).as('Service'),
          lf.fn.max(serviceDepartmentTable.Name).as('Department'),
          lf.fn.max(serviceDepartmentTable.Category).as('Category'),
          lf.fn.sum(saleEntryTable.ReceiptAmount).as('Amount'))
          .from(saleEntryTable)
          .innerJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
          .innerJoin(serviceDepartmentTable, saleEntryTable.BillingOutletId.eq(serviceDepartmentTable.Id))
          .groupBy(sellableItemTable.Id)
          .exec()
          .then(function (results) {
            deferred.resolve(results);
          });
      });
      return deferred.promise;
    }

    function CancelReceipt(receipt, isDeposit) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var table = isDeposit ? db.getSchema().table('Deposit') : db.getSchema().table('SaleReceipt');
        db.update(table).
          set(table.IsCancelled, true).
          set(table.LastModifiedDate, new Date()).
          where(
          table.Id.eq(receipt.Id)).
          exec().then(
          function () {
            deferred.resolve();
          });
      });
      return deferred.promise;
    }

    function GetDepositReceiptBySearchText(searchText) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var depositReceiptTable = db.getSchema().table('Deposit');

        var encounterTable = db.getSchema().table('Encounter');
        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var religionTable = db.getSchema().table('Religion');
        var maritalStateTable = db.getSchema().table('MaritalState');
        var searchTextMatcher = new RegExp(searchText, "i");

        db.select().
          from(depositReceiptTable)

          .leftOuterJoin(encounterTable, depositReceiptTable.EncounterId.eq(encounterTable.Id))
          .leftOuterJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .leftOuterJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .leftOuterJoin(maritalStateTable, patientTable.MaritalStateId.eq(maritalStateTable.Id))
          .leftOuterJoin(religionTable, patientTable.ReligionId.eq(religionTable.Id))
          .where(
          lf.op.and(
            depositReceiptTable.IsDeleted.eq(false),
            depositReceiptTable.IsCancelled.eq(false),

            //saleEntryTable.HasPaid.eq(true),
            //sellableItemTable.IsDrug.eq(isDrug),
            lf.op.or(
              depositReceiptTable.Number.match(searchTextMatcher),
              patientTable.OtherNames.match(searchTextMatcher),
              patientTable.Number.match(searchTextMatcher),
              patientTable.Surname.match(searchTextMatcher)
            )
          )
          ).exec().
          then(function (depositReceipts) {

            var uniqueReceipts = _.uniqBy(depositReceipts, 'Deposit.LocalId');
            deferred.resolve(uniqueReceipts);
          });
      });
      return deferred.promise;
    }

    function GetReceiptListing(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        //var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');

        db.select(
          saleTable.CustomerName.as('PatientName'),
          saleTable.CustomerPhone.as('PatientNumber'),
          saleReceiptTable.ReceiptDate.as('Date'),
          saleReceiptTable.TotalAmount.as('Amount'),
          saleReceiptTable.Number.as('ReceiptNumber'),
          saleReceiptTable.LocalId.as('LocalId'),
          saleReceiptTable.Id.as('Id')
        )
          .from(saleReceiptTable)
          .leftOuterJoin(saleEntryTable, saleReceiptTable.Id.eq(saleEntryTable.SalesReceiptId))
          //.leftOuterJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))

          .leftOuterJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .where(
          lf.op.and(saleReceiptTable.ReceiptDate.between(startDate, endDate),
            saleReceiptTable.IsCancelled.eq(false)
          )
          )
          .exec()
          .then(function (saleReceipts) {
            debugger;
            var uniqueReceipts = _.uniqBy(saleReceipts, 'LocalId');
            deferred.resolve(uniqueReceipts);
          });
      });
      return deferred.promise;
    }


    function GetDepositListing(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var serviceDepartmentTable = db.getSchema().table('Department');
        var depositTable = db.getSchema().table('Deposit');

        db.select(
          depositTable.PayerName.as('PatientName'),
          depositTable.PayerNumber.as('PatientNumber'),
          depositTable.ReceiptDate.as('Date'),
          depositTable.TotalAmount.as('Amount'),
          depositTable.Number.as('ReceiptNumber')
        )
          .from(depositTable)
          .where(
          lf.op.and(depositTable.ReceiptDate.between(startDate, endDate),
            depositTable.IsCancelled.eq(false)
          )
          )
          .exec()
          .then(function (depositReceipts) {
            // var uniqueReceipts = _.uniqBy(depositReceipts, 'SaleReceipt.LocalId');
            deferred.resolve(depositReceipts);
          });
      });
      return deferred.promise;
    }

    function GetNewPatients(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');

        db.select(
          patientTable.Surname.as('Surname'),
          patientTable.OtherNames.as('OtherNames'),
          patientTable.Number.as('PatientNumber'),
          patientTable.RegistrationDate.as('Date'),
          patientTable.DateOfBirth.as('DateOfBirth'),
          genderTable.Name.as('GenderName')
        )
          .from(patientTable)
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .where(
          lf.op.and(
            patientTable.RegistrationDate.between(startDate, endDate),
            patientTable.RegistrationMode.eq("New")
          )
          )
          .exec()
          .then(function (patients) {
            deferred.resolve(patients);
          });
      });
      return deferred.promise;
    }

    function GetOldPatients(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('GenderName');

        db.select(
          patientTable.Surname.as('Surname'),
          patientTable.OtherNames.as('OtherNames'),
          patientTable.Number.as('PatientNumber'),
          patientTable.RegistrationDate.as('Date'),
          patientTable.DateOfBirth.as('DateOfBirth'),
          genderTable.Name.as('Gender')
        )
          .from(patientTable)
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .where(
          lf.op.and(
            patientTable.ReceiptDate.between(startDate, endDate),
            patientTable.RegistrationMode.eq("Old")
          )
          )
          .exec()
          .then(function (patients) {
            deferred.resolve(patients);
          });
      });
      return deferred.promise;
    }

    function GetRevisits(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var genderTable = db.getSchema().table('Gender');
        var encounterTable = db.getSchema().table('Encounter');

        db.select(
          patientTable.Surname.as('Surname'),
          patientTable.OtherNames.as('OtherNames'),
          patientTable.Number.as('PatientNumber'),
          encounterTable.StartDate.as('Date'),
          patientTable.DateOfBirth.as('DateOfBirth'),
          genderTable.Name.as('GenderName')
        )
          .from(patientTable)
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))
          .innerJoin(encounterTable, patientTable.Id.eq(encounterTable.PatientId))
          .where(
          encounterTable.StartDate.between(startDate, endDate)
          )
          .exec()
          .then(function (patients) {
            deferred.resolve(patients);
          });
      });
      return deferred.promise;
    }

    function GetSchemeDiscountUpdates(startDate, endDate, forDrugs, drugSearchby, serviceSearchBy, patientId, schemeId, drugId) {
      var deferred = $q.defer();

      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var schemeTable = db.getSchema().table('Scheme');
        var schemeMembershipTable = db.getSchema().table('SchemeMembership');
        var sellableItemTable = db.getSchema().table('SellableItem');
        var discountUpdateTable = db.getSchema().table('SchemeDiscountUpdates');
        var wardstayhistoryTable = db.getSchema().table('WardStayHistory');

        //drugs and searchby is all or services and search by is all
        if ((forDrugs && drugSearchby == 'All') || (!forDrugs && serviceSearchBy == 'All' && schemeId == 'All')) {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs)
            )
            ).exec().then(function (results) {

              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        }
        //drugs and search by is patient OR service and searchby is patient and scheme is all for service
        else if ((forDrugs && drugSearchby == 'patient') || (!forDrugs && serviceSearchBy == 'Specific' && schemeId == 'All')) {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs),
              patientTable.Id.eq(patientId)
            )
            ).exec().then(function (results) {
              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        }

        //drugs and search by is scheme or service and patient filter by is all and a scheme is selected
        else if (((forDrugs && drugSearchby == 'scheme') || (!forDrugs && (serviceSearchBy == 'All'))) && schemeId != 'All') {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs),
              schemeTable.Id.eq(schemeId)
            )
            ).exec().then(function (results) {
              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        } else if (((forDrugs && drugSearchby == 'scheme') || (!forDrugs && (serviceSearchBy == 'All'))) && schemeId == 'All') {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs)
            )
            ).exec().then(function (results) {
              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        }

        //drugs and search by is drugs
        else if (forDrugs && drugSearchby == 'drug' && drugId != null) {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs),
              sellableItemTable.Id.eq(drugId)
            )
            ).exec().then(function (results) {

              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        } else if (!forDrugs && serviceSearchBy == 'Discharged' && schemeId == 'All') {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs),
              wardstayhistoryTable.IsDischarged.eq(true)
            )
            ).exec().then(function (results) {
              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        } else if (!forDrugs && serviceSearchBy == 'Discharged' && schemeId != 'All') {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs),
              wardstayhistoryTable.IsDischarged.eq(true),
              schemeTable.Id.eq(schemeId)
            )
            ).exec().then(function (results) {
              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        } else if (!forDrugs && serviceSearchBy == 'Specific' && schemeId != 'All') {
          db.select(patientTable.Number.as('Patient No'), discountUpdateTable.Id.as('Id'), patientTable.Surname.as('LastName'), patientTable.OtherNames.as('OtherNames'),
            schemeMembershipTable.CardHolderInsuranceNumber.as('Scheme No'), saleEntryTable.Name.as('Item'), saleEntryTable.Price.as('Price'),
            saleEntryTable.Quantity.as('Quantity'), discountUpdateTable.PercentageAdded.as('Discount'), discountUpdateTable.DateOfUpdate.as('Date'), schemeTable.Name.as('Scheme Name'))
            .from(discountUpdateTable)

            .innerJoin(saleEntryTable, discountUpdateTable.SaleEntryId.eq(saleEntryTable.Id))
            .innerJoin(sellableItemTable, saleEntryTable.SellableItemId.eq(sellableItemTable.Id))
            .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
            .innerJoin(encounterTable, saleTable.EncounterId.eq(encounterTable.Id))
            .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
            .innerJoin(schemeTable, discountUpdateTable.SchemeId.eq(schemeTable.Id))
            .leftOuterJoin(wardstayhistoryTable, encounterTable.Id.eq(wardstayhistoryTable.EncounterId))
            .leftOuterJoin(schemeMembershipTable, patientTable.Id.eq(schemeMembershipTable.PatientId))
            .where(
            lf.op.and(
              discountUpdateTable.IsDeleted.eq(false),
              discountUpdateTable.DateOfUpdate.between(startDate, endDate),
              sellableItemTable.IsDrug.eq(forDrugs),
              patientTable.Id.eq(patientId),
              schemeTable.Id.eq(schemeId)
            )
            ).exec().then(function (results) {
              results = _.uniqBy(results, 'Id');
              deferred.resolve(results);
            });
        }
      });
      return deferred.promise;
    }

    function GetWalkinPatientReceiptDetails(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var saleTable = db.getSchema().table('Sale');
        var saleEntryTable = db.getSchema().table('SaleEntry');
        var saleReceiptTable = db.getSchema().table('SaleReceipt');
        var paymentModeTable = db.getSchema().table('PaymentMode');

        db.select(saleTable.CustomerName.as('Customer Name'), saleTable.CustomerPhone.as('Customer Phone'),
          saleEntryTable.Name.as('Item'), saleEntryTable.TransactionDate.as('Date'), saleEntryTable.Quantity.as('Quantity'),
          paymentModeTable.Mode.as('Payment Mode'), saleEntryTable.Price.as('Price'), saleEntryTable.ReceiptAmount.as('Amount Paid'))
          .from(saleEntryTable)

          .innerJoin(saleTable, saleEntryTable.SaleId.eq(saleTable.Id))
          .innerJoin(saleReceiptTable, saleEntryTable.SalesReceiptId.eq(saleReceiptTable.Id))
          .innerJoin(paymentModeTable, saleReceiptTable.PaymentModeId.eq(paymentModeTable.Id))

          .where(
          lf.op.and(
            saleEntryTable.IsDeleted.eq(false),
            saleTable.EncounterId.eq(null),
            saleEntryTable.HasPaid.eq(true),
            saleEntryTable.TransactionDate.between(startDate, endDate)
          )
          ).exec().then(function (result) {
            deferred.resolve(result);
          });
      });
      return deferred.promise;
    }

    function GetDischargedPatients(startDate, endDate) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {

        var patientTable = db.getSchema().table('Patient');
        var encounterTable = db.getSchema().table('Encounter');
        var wardstayhistoryTable = db.getSchema().table('WardStayHistory');
        var staffMemberTable = db.getSchema().table('StaffMember');
        var genderTable = db.getSchema().table('Gender');

        db.select(patientTable.Surname.as('Surname'), patientTable.OtherNames.as('POtherNames'), genderTable.Name.as('Sex'),
          patientTable.DateOfBirth.as('DateOfBirth'), wardstayhistoryTable.StartDate.as('HospitizationDate'), wardstayhistoryTable.EndDate.as('DischargeDate'),
          patientTable.Number.as('Number'), wardstayhistoryTable.DischargeStatus.as('Discharge Status'), staffMemberTable.LastName.as('LastName'), staffMemberTable.OtherNames.as('SOtherNames'))
          .from(wardstayhistoryTable)

          .innerJoin(encounterTable, wardstayhistoryTable.EncounterId.eq(encounterTable.Id))
          .innerJoin(patientTable, encounterTable.PatientId.eq(patientTable.Id))
          .innerJoin(staffMemberTable, wardstayhistoryTable.DischargedBy.eq(staffMemberTable.Id))
          .innerJoin(genderTable, patientTable.GenderId.eq(genderTable.Id))

          .where(
          lf.op.and(
            wardstayhistoryTable.IsDeleted.eq(false),
            wardstayhistoryTable.IsDischarged.eq(true),
            wardstayhistoryTable.EndDate.neq(null),
            wardstayhistoryTable.EndDate.between(startDate, endDate)
          )
          ).exec().then(function (result) {
            deferred.resolve(result);
          });
      });
      return deferred.promise;
    }

    function GetConsultationTemplates(searchText, deskType, doctorsId) {
      var deferred = $q.defer();
      lovefield.getDB().then(function (db) {
        var templateTable = db.getSchema().table('ClerkingTemplates');
        var searchTextMatcher = new RegExp(searchText, 'i');
        db.select()
          .from(templateTable)
          .where(
          lf.op.and(
            templateTable.IsDeleted.eq(false),
            templateTable.ConsultationType.eq(deskType),

            templateTable.TemplateName.match(searchTextMatcher),
            lf.op.or(
              templateTable.DoctorsId.eq(null),
              templateTable.DoctorsId.eq(doctorsId)
            )
          )
          ).exec().then(function (result) {
            deferred.resolve(result);
          });
      });
      return deferred.promise;
    }


    function PingServer(uploadData) {
      return new Promise(function (resolve, reject) {

        var config = {
            headers : {
              "Content-Type": "text/plain;charset=UTF-8"
            }
        }

        lovefield.getDB().then(function (db) {
          var url = HmisConstants.baseApiUrl+"syncentities";
          var method = "POST";
          var postData = uploadData;

          $http.post(url,JSON.stringify(postData),config).then(function(response){
            var payLoad = response.data;

            // console.log('payload');
            var newDateMark = new Date(payLoad.NewEntityDateMark);
            //  console.log(payLoad);
            var downloadedDataCount = 0;
            console.log(payLoad.payload.length);

            if (payLoad.payload.length > 0) {
              payLoad.payload = JSON.parse(JSON.stringify(payLoad.payload),JSON.dateParser)
              payLoad.payload.map(function (returnedItem) {
                returnedItem.LastSynchTime = newDateMark;
                returnedItem.LocalId = null;
                var tableName = returnedItem.ObjectName;
                var id = returnedItem.Id;

                var selectedTable = db.getSchema().table(tableName);
                db.select()
                  .from(selectedTable)
                  .where(lf.op.and(

                    selectedTable.Id.neq(null),
                    selectedTable.Id.eq(id)
                  ))
                  .exec()
                  .then(function (response) {
                    if (response.length > 0) {
                      returnedItem.LocalId = response[0].LocalId;
                      returnedItem.Id = response[0].Id
                    }

                    var table = db.getSchema().table(returnedItem.ObjectName);
                    var row = table.createRow(returnedItem);

                    db.insertOrReplace()
                      .into(table)
                      .values([row])
                      .exec()
                      .then(
                      function (newEntries) {
                        downloadedDataCount++;

                        console.log(downloadedDataCount);
                        if (downloadedDataCount == payLoad.payload.length) {
                          //console.log(downloadedDataCount);
                          resolve(newEntries[0]);
                        }
                      }).catch(function (err) {
                        downloadedDataCount++;
                        console.dir(err);
                        if (downloadedDataCount == payLoad.payload.length) {
                          //console.log(downloadedDataCount);

                          var clientDatatable = db.getSchema().table('ClientData');
                          db.update(clientDatatable).
                            set(clientDatatable.Value, (newDateMark)).
                            set(clientDatatable.LastModifiedDate, new Date()).
                            where(
                            clientDatatable.Key.eq('NewEntityDateMark')).
                            exec();

                          resolve(0);
                        }
                      });
                  });
              });
            }
            else {
              resolve();
            }


          },function(erro){

            console.log("The computer appears to be offline.");
            var returnedItem = {};
            returnedItem.TotalItemCount = 0;
            returnedItem.DownloadCount = 0;
           // returnedItem.newDateMark = newDateMark;
           // self.postMessage(returnedItem);
            resolve();
          });
        });
      });
    }

    function UpdateClientData(key,value){
      lovefield.getDB().then(function (db) {
      var clientDatatable = db.getSchema().table('ClientData');
            db.update(clientDatatable).
              set(clientDatatable.Value, (value)).
              set(clientDatatable.LastModifiedDate, new Date()).
              where(
              clientDatatable.Key.eq(key)).
              exec();
            });
    }


    function SaveUpdates(returnedItem) {
      var tableName = returnedItem.ObjectName;
      var id = returnedItem.Id;

      lovefield.getDB().then(function (db) {
      var table = db.getSchema().table(tableName);
      db.select()
        .from(table)
        .where(lf.op.and(

          table.Id.neq(null),
          table.Id.eq(id)
        ))
        .exec()
        .then(function (response) {
          if (response.length > 0) {
            returnedItem.LocalId = response[0].LocalId;
          }

          var row = table.createRow(returnedItem);

          db.insertOrReplace()
            .into(table)
            .values([row])
            .exec()
            .then(
            function (newEntries) {

            }).catch(function (err) {

              console.dir(err);
            });
        });
      });
    }

    function backupDb(){
      lovefield.getDB().then(function(db){
        db.export().then(function(data) {
          // The data object contains the contents of database

          if ((typeof process !== 'undefined') && (process.release.name.search(/node|io.js/) !== -1)) {
            const fs = require('fs');
            const dir = 'C:\\backUpFiles';
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            var fileName = 'backupData'+createGuid();
           // const content = JSON.stringify(data);
           var bufferedData = new Buffer(data, "base64");
            fs.writeFile('C:\\backUpFiles\\'+fileName+'.json',bufferedData,'utf8', function(err) {
              if (err) throw err;
              console.log('The file has been saved!');
            });
          }
        });
      });
    }

    function restoreDb(data){
      lovefield.getDB().then(function(db){
        data = JSON.parse(JSON.stringify(data),JSON.dateParser);
        db.import(data).then(function(response) {
        });
      });
    }
  }


})();


(function () {
    'use strict';

    angular
      .module('fuse')
      .factory('DataService', DataService);

    DataService.$inject = ['$http', '$log', '$q', '$rootScope', 'StoreService'];

    function DataService($http, $log, $q, $rootScope, StoreService) {
      //var GenderTable_ = null;


      var service = {
        GetAllGenders: GetAllGenders
      };

      return service;


      function GetAllGenders() {
          var deferred = $q.defer();

            StoreService.db_.select()
              .from(StoreService.db_.getSchema().table('Gender'))
              .exec()
              .then(
              function(rows) {
                deferred.resolve(rows);
              });

          return deferred.promise;
        }

    }
})();

(function () {
  'use strict';

  angular
  .module('fuse')
  .factory('UtilityService', UtilityService);

  UtilityService.$inject = ['$http', '$log', '$q', '$rootScope', '$mdDialog'];

  function UtilityService($http, $log, $q, $rootScope, $mdDialog) {
    console.log('Initializing UtilityService...');
    var service = {
      CalculateAge: CalculateAge,
      FormatDate:FormatDate,
      GetStatus:GetStatus,
      ResizeBase64Img:ResizeBase64Img,
      FormatDateTime:FormatDateTime,
      getSetLocation:getSetLocation,
      showDialog:showDialog,
      showAlert:showAlert
    };

    return service;


        function CalculateAge(fromdate, todate){
          if(todate) todate= new Date(todate);
          else todate= new Date();

          var age= [], fromdate= new Date(fromdate),
          y= [todate.getFullYear(), fromdate.getFullYear()],
          ydiff= y[0]-y[1],
          m= [todate.getMonth(), fromdate.getMonth()],
          mdiff= m[0]-m[1],
          d= [todate.getDate(), fromdate.getDate()],
          ddiff= d[0]-d[1];

          if(mdiff < 0 || (mdiff=== 0 && ddiff<0))--ydiff;
          if(mdiff<0) mdiff+= 12;
          if(ddiff<0){
            fromdate.setMonth(m[1]+1, 0);
            ddiff= fromdate.getDate()-d[1]+d[0];
            --mdiff;
          }
          if(ydiff> 0) age.push(ydiff+ 'y'+(ydiff> 1? ' ':''));
          if(mdiff> 0) age.push(mdiff+ 'm'+(mdiff> 1? ' ':''));
          if(ddiff> 0) age.push(ddiff+ 'd'+(ddiff> 1? ' ':''));
          if(age.length>1) age.splice(age.length-1,0,' ');
          return age.join('');
        }

         function FormatDate(date) {
           if(date!=undefined&&date!='N/A'){
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            var month = date.getMonth()+1;
            return date.getDate() + "/" + month + "/" + date.getFullYear();

           }
      }

      function FormatDateTime(date) {
           if(date!=undefined){
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            var month = date.getMonth()+1;
            return date.getDate() + "/" + month + "/" + date.getFullYear() + "  " + strTime;
           }
        }

      function GetStatus( situation,  forNurse){
            var status = "";
            switch (situation)
            {
                case " ":
                    status = "Pending";
                    break;
                case "1":
                    status = forNurse ? "Attending" : "";
                    break;
                case "2":
                    status = forNurse ? "Attended" : "Pending";
                    break;
                case "3":
                    status = forNurse ? "Attended" : "Attended";
                    break;
            }
            return status;
        }

        function ResizeBase64Img(base64, width, height) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext("2d");
            var deferred = $.Deferred();
            $("<img/>").attr("src", "data:image/png;base64," + base64).load(function() {
                context.scale(width/this.width,  height/this.height);
                context.drawImage(this, 0, 0);
                deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
            });
            return deferred.promise();
        }

        function getSetLocation(){
          var location = localStorage.getItem('location');
          if (location !== 'undefined' && location !== undefined) {
              location = JSON.parse(location);
          }
          return location;
        }

        function showDialog(ev, templateFile, dialogData,ctrlr,viewOnly,patient){
          $mdDialog.show({
            controller: ctrlr,
            locals: { dialogData: dialogData, viewOnly: viewOnly, patientDetails: patient },
            templateUrl: 'app/main/dialogs/' + templateFile,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true,
            multiple: true
                //  directive:importFromExcel
          })
          .then(function() {
              //Do nothing for now.
          }, function() {
              //still do nothing
          });
        }

        function showAlert(title,content){
          $mdDialog.show(
            $mdDialog.alert()
            .title(title)
            .textContent(content)
            .ariaLabel('Alert Dialog')
            .ok('Got It!'));
        }
  }
})();

(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('ReportBuilderService', ReportBuilderService);

    ReportBuilderService.$inject = ['$http', '$log', '$q', '$rootScope', 'lovefield'];

    function ReportBuilderService($http, $log, $q, $rootScope,StoreService) {
        var imageUrl;
        var imageString;
        var companyName;
        getLogoAndcompanyName();
        toDataURL('app/ReportLogo/logo.png', function (dataUrl) {
            console.log(dataUrl);
            imageUrl = dataUrl;
        });
        var service = {
            BuildPdfContent: BuildPdfContent,
            buildReportHeader: buildReportHeader,
            BuildPDFText: BuildPDFText,
            buildHtmlToPdfReport: buildHtmlToPdfReport,
            displayOrPrintPdf:displayOrPrintPdf,
            getLogoAndcompanyName:getLogoAndcompanyName
        };

        return service;

        function getReportLogo(){

          StoreService.GetGlobalConstants('ImageUrl').then(function(response){
              if (response.length > 0) {
                imageString = response[0].Value;
              }
          });
        }

        function getReporHeader(){
            StoreService.GetGlobalConstants('ReportHeader').then(function(response){
                if (response.length > 0) {
                  companyName = response[0].Value;
                }
            });
        }

        function getLogoAndcompanyName(){
          getReportLogo();
          getReporHeader();
        }


        function BuildPdfContent(reportObject, marginData, lineSpanLength) {
            var pdfContent = {};
            var content = [];
            var parentGroupHead = {};
            var groupHead = [];
            var allParents = reportObject.parentGroupProperty == undefined ? [{ Title: 'N/A' }] : _.uniq(reportObject.reportData.map(function (reportDataEntry) {
                return reportDataEntry[reportObject.parentGroupProperty];
            }));

            for (var i = 0; i < allParents.length; i++) {
                //TODO: push parent title here... : allParents[i] ONLY if reportObject.parentGroupProperty is defined

                var parentSum; // _.sumBy(dataForParent,reportObject.summingProperty);
                var dataForParent = reportObject.parentGroupProperty == undefined ? reportObject.reportData : _.filter(reportObject.reportData, function (o) { return o[reportObject.parentGroupProperty] == allParents[i]; });
                if (reportObject.parentGroupProperty != undefined) {
                    content.push({ width: "*", text: reportObject.parentGroupProperty + ' ----------- ' + (allParents[i] == undefined ? ' N/A' : allParents[i]), margin: [5, 15, 2, 2] });
                    //   parentSum =  _.sumBy(dataForParent,reportObject.summingProperty);
                }
                //  groupHead = reportObject.parentGroupProperty != undefined?[{width:"*", text: allParents[i]==undefined?'N/A':allParents[i],margin: [45, 2, 2, 2] }]:[""];
                //   var groupName = allParents[i]==undefined?'N/A':allParents[i];
                var allChidren = reportObject.childGroupProperty == undefined ? [{ Title: 'N/A' }] : _.uniq(dataForParent.map(function (reportDataEntry) {
                    return reportDataEntry[reportObject.childGroupProperty];
                }));


                //  var childSum = _.sumBy(dataForChild,reportDataEntry.summingProperty);
                for (var j = 0; j < allChidren.length; j++) {


                    var dataForChild = reportObject.childGroupProperty == undefined ? dataForParent : _.filter(dataForParent, function (o) { return o[reportObject.childGroupProperty] == allChidren[j]; });
                    //TODO: Push child title here...: allChidren[j] ONLY if reportObject.childGroupProperty is defined

                    if (reportObject.childGroupProperty != undefined) {
                        content.push({ width: "*", text: reportObject.childGroupProperty + ' ----------- ' + (allChidren[j] == undefined ? ' N/A' : allChidren[j]), margin: [100, 2, 2, 2] });
                        //   parentSum =  _.sumBy(dataForParent,reportObject.summingProperty);
                    }

                    content.push(buildtable({ data: dataForChild, columns: reportObject.columns, width: reportObject.width, parentGroupProperty: reportObject.parentGroupProperty, parentGroupHead: allParents[i] }, marginData));
                    if (reportObject.childGroupProperty != undefined && reportObject.summingProperty != undefined) {
                        content.push({ width: "*", alignment: 'right', text: allChidren[j] + ' Total -----------' + _.floor(_.sumBy(dataForChild, reportObject.summingProperty)) });
                    }
                }

                if (reportObject.parentGroupProperty != undefined && reportObject.summingProperty != undefined) {

                    var groupName = allParents[i] == undefined ? ' N/A' : allParents[i];
                    content.push({ width: "*", alignment: 'right', text: groupName + ' Total -----------: ' + _.floor(_.sumBy(dataForParent, reportObject.summingProperty), 2) });
                }
            }

            //  var groupHead = {width:"*", text: departmentName==undefined?'N/A':departmentName,margin: [45, 2, 2, 2] };
            pdfContent.content = content
            //    pdfContent.content.push(content);

            return pdfContent;
        }

        function toDataURL(src, callback, outputFormat) {

            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = 40;
                canvas.width = 40;
                ctx.scale(40 / this.naturalWidth, 40 / this.naturalHeight);

                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
            };
            img.src = src;
        }

        function buildReportHeader(reportTitle, lineSpanLength,logoMargin,titleMargin) {
            companyName = companyName || 'WorkForce Group';
            imageString = imageString||imageUrl;
            debugger;
            return [
                {
                    table: {
                        widths: ['auto', lineSpanLength-60],
                        body: [
                            [{
                                image: imageString //'/src/app/ReportLogo/logo.png'
                            },
                            {
                                stack: [{
                                    alignment: 'center',
                                    style: 'h1',
                                    text: companyName,
                                    margin:[0, 13, 0, 0]
                                }]
                            }
                            ]
                        ]
                    },margin: logoMargin|| [0, 5, 0, 0]
                }, { canvas: [{ type: 'line', x1: 0, y1: 5, x2: lineSpanLength, y2: 5, lineWidth: 1 }] ,margin:titleMargin|| [0, 5, 0, 0]},
                {
                    alignment: 'center',
                    style: 'header',
                    text: reportTitle,
                    margin:[0, 8, 0, 0]
                },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: lineSpanLength, y2: 5, lineWidth: 1 }],margin:titleMargin||[0, 5, 0, 0] }
            ];
        }

        function BuildPDFText(text, style, alignment, margin, bold, canvasFormat) {
            return {
                text: text,
                style: style,
                alignment: alignment,
                margin: margin,
                bold: bold,
                canvas: canvasFormat
            }
        }


        function buildtable(tableData, marginData) {
            if (marginData != undefined) { marginData = marginData } else { marginData = [0, 5, 0, 0] }
            for (var i = 0; i < tableData.data.length; i++) {
                return {
                    columns: [
                        //  { width: '*', text: '' },
                        {
                            width: 'auto',
                            table: {
                                widths: tableData.width,
                                headerRows: 1,

                                body: buildTableBody(tableData.data, tableData.columns)
                            },
                            margin: marginData,
                            fontSize: 10
                        },
                        { width: '*', text: '' }

                    ]
                };
            }

        }

        function buildTableBody(data, columns) {
            var body = [];
            body.push(columns);
            data.forEach(function (row) {
                var dataRow = [];
                columns.forEach(function (column) {
                    if (row[column] == undefined) {
                        row[column] = '';
                    }
                    dataRow.push(row[column].toString());
                });
                body.push(dataRow);
            });
            return body;
        }

    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.navigation', [])
        .config(config);

    /** @ngInject */
    function config()
    {
        
    }

})();
(function (){
    'use strict';

    NavigationController.$inject = ["$scope", "AuthenticationService", "$state", "$location"];
    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope,AuthenticationService,$state,$location)
    {
        var vm = this;
        var originatorEv;
        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

      // if ((typeof process !== 'undefined') && (process.release.name.search(/node|io.js/) !== -1)) {

      //   const ipcRenderer = require('electron').ipcRenderer;
      //   ipcRenderer.on('message', function(event, text) {
      //     var container = document.getElementById('messages');
      //     var message = document.createElement('div');
      //     message.innerHTML = text;
      //     container.appendChild(message);
      //   });
      // }
        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        //////////

        /**
         * Toggle folded status
         */
        function toggleMsNavigationFolded()
        {
            vm.folded = !vm.folded;
        }

        vm.signOut = function(){
            AuthenticationService.ClearCredentials();
            $state.go('app.login');
        }

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function ()
        {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });
    }

})();

(function ()
{
    'use strict';

    MainController.$inject = ["$scope", "$rootScope"];
    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope){
        // Data

        //////////

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event){
            if (event.targetScope.$id === $scope.$id){
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
})();
(function ()
{
    'use strict';

    runBlock.$inject = ["msUtils", "fuseGenerator", "fuseConfig"];
    angular
        .module('app.core')
        .run(runBlock);

    /** @ngInject */
    function runBlock(msUtils, fuseGenerator, fuseConfig)
    {
        /**
         * Generate extra classes based on registered themes so we
         * can use same colors with non-angular-material elements
         */
        fuseGenerator.generate();

        /**
         * Disable md-ink-ripple effects on mobile
         * if 'disableMdInkRippleOnMobile' config enabled
         */
        if ( fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile() )
        {
            var bodyEl = angular.element('body');
            bodyEl.attr('md-no-ink', true);
        }

        /**
         * Put isMobile() to the html as a class
         */
        if ( msUtils.isMobile() )
        {
            angular.element('html').addClass('is-mobile');
        }

        /**
         * Put browser information to the html as a class
         */
        var browserInfo = msUtils.detectBrowser();
        if ( browserInfo )
        {
            var htmlClass = browserInfo.browser + ' ' + browserInfo.version + ' ' + browserInfo.os;
            angular.element('html').addClass(htmlClass);
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$ariaProvider", "$logProvider", "msScrollConfigProvider", "$translateProvider", "$translatePartialLoaderProvider", "$provide", "fuseConfigProvider"];
    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, $translateProvider,$translatePartialLoaderProvider, $provide, fuseConfigProvider)
    {
        // Enable debug logging
        $logProvider.debugEnabled(true);

        // toastr configuration
        // toastr.options.timeOut = 3000;
        // toastr.options.positionClass = 'toast-top-right';
        // toastr.options.preventDuplicates = true;
        // toastr.options.progressBar = true;

        // uiGmapgoogle-maps configuration
        // uiGmapGoogleMapApiProvider.configure({
        //     //    key: 'your api key',
        //     v        : '3.exp',
        //     libraries: 'weather,geometry,visualization'
        // });

        // angular-translate configuration
        //$translatePartialLoaderProvider.addPart('app/main/apps/settings/login-v2');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');

        // Text Angular options
        $provide.decorator('taOptions', [
            '$delegate', function (taOptions)
            {
                taOptions.toolbar = [
                    ['bold', 'italics', 'underline', 'ul', 'ol', 'quote']
                ];

                taOptions.classes = {
                    focussed           : 'focussed',
                    toolbar            : 'ta-toolbar',
                    toolbarGroup       : 'ta-group',
                    toolbarButton      : 'md-button',
                    toolbarButtonActive: 'active',
                    disabled           : '',
                    textEditor         : 'form-control',
                    htmlEditor         : 'form-control'
                };

                return taOptions;
            }
        ]);

        // Text Angular tools
        $provide.decorator('taTools', [
            '$delegate', function (taTools)
            {
                taTools.bold.iconclass = 'icon-format-bold';
                taTools.italics.iconclass = 'icon-format-italic';
                taTools.underline.iconclass = 'icon-format-underline';
                taTools.ul.iconclass = 'icon-format-list-bulleted';
                taTools.ol.iconclass = 'icon-format-list-numbers';
                taTools.quote.iconclass = 'icon-format-quote';

                return taTools;
            }
        ]);

        /*eslint-disable */

        // ng-aria configuration
        $ariaProvider.config({
            tabindex: false
        });

        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars'        : false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile'     : true
        });

        // msScroll configuration
        msScrollConfigProvider.config({
            wheelPropagation: true
        });

        /*eslint-enable */
    }
})();

(function() {
    'use strict';

    angular
        .module('fuse')

    /** @ngInject */

    .run(['msNavigationService', '$rootScope', '$timeout', '$cookieStore', '$state', '$location', 'StoreService','$translate',
        function(msNavigationService, $rootScope, $timeout, $cookieStore, $state, $location, StoreService,$translate) {


        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState){
            // Activate loading indicator
            $rootScope.loadingProgress = true;
            // check if user is logged int(has valid token)
            $rootScope.globals = $cookieStore.get('loggedInUser');

            $rootScope.pageTitle = toState.data.name || "";
            if($rootScope.globals===undefined&&$location.path() !== '/login'&& $location.path()!== '/register'){
              //if no valid token, send the idiot to the loggin page
              event.preventDefault();
              $location.path('/login');
              $state.go('app.login');
            }
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
          console.log('change state success');
          $rootScope.$broadcast('handleBroadcast', { pageTitle: $rootScope.pageTitle,showShiftMenu: $rootScope.showShiftMenu,shiftNumber:$rootScope.shiftNumber});
          $rootScope.loadingProgress = false;

        });


        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });

    }]);
})();

(function ()
{
    'use strict';

    routeConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
    angular
        .module('fuse')
    //    .factory(authorization)
        .config(routeConfig);

    /** @ngInject */



    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $urlRouterProvider.otherwise('/dashboard');

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Get active layout
        var layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';

        var layouts = {
            verticalNavigation  : {
                main      : 'app/core/layouts/vertical-navigation.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            },
            horizontalNavigation: {
                main      : 'app/core/layouts/horizontal-navigation.html',
                toolbar   : 'app/toolbar/layouts/horizontal-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/horizontal-navigation/navigation.html'
            },
            contentOnly         : {
                main      : 'app/core/layouts/content-only.html',
                toolbar   : '',
                navigation: ''
            },
            contentWithToolbar  : {
                main      : 'app/core/layouts/content-with-toolbar.html',
                toolbar   : 'app/toolbar/layouts/content-with-toolbar/toolbar.html',
                navigation: ''
            }
        };
        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                // resolve: {
                //     authorize: ['authorization',
                //     function(authorization) {
                //         return authorization.authorize();
                //     }
                //     ]
                // },
                views   : {
                    'main@'         : {
                        templateUrl: layouts[layoutStyle].main,
                        controller : 'MainController as vm',
                    },
                    'toolbar@app'   : {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller : 'NavigationController as vm'
                    }
                    // 'quickPanel@app': {
                    //     templateUrl: 'app/quick-panel/quick-panel.html',
                    //     controller : 'QuickPanelController as vm'
                    // }
                }
            });
    }

})();

(function (){
  'use strict';

  angular
      .module('fuse').directive('draggable', function() {
          return {
              // A = attribute, E = Element, C = Class and M = HTML Comment
              restrict: 'A',
              //The link function is responsible for registering DOM listeners as well as updating the DOM.
              link: function(scope, element, attrs) {
                  element.draggable({
                      stop: function(event, ui) {
                          console.log("dragging me...");
                          event.stopPropagation();
                      }
                  });
              }
          };
      }).directive('confirmPwd', ["$interpolate", "$parse", function($interpolate, $parse) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {

                var pwdToMatch = $parse(attr.confirmPwd);
                var pwdFn = $interpolate(attr.confirmPwd)(scope);

                scope.$watch(pwdFn, function(newVal) {
                    ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
                });

                ngModelCtrl.$validators.password = function(modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    return value == pwdToMatch(scope);
                };
            }
        };
    }]);
})();

(function () {
    'use strict';

    IndexController.$inject = ["fuseTheming"];
    var isDlgOpen;

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming) {
        var vm = this;

        vm.themes = fuseTheming.themes;
    }
})();

(function (){
    'use strict';

    angular
        .module('fuse').constant('AppConstants',{
          baseApiUrl:'https://murmuring-springs-18419.herokuapp.com/v1/'
        });
})();


(function () {
    'use strict';

    config.$inject = ["$httpProvider"];
    angular
        .module('fuse')
        .config(config);
       // .config(exceptionConfig);

    /** @ngInject */
    function config($httpProvider){
        // Put your custom configurations here
        var token = localStorage.getItem('loggedInUser');
        if(token!=null&&token!='undefined'){
          token =   JSON.parse(token);
          token = token.token;
          $httpProvider.defaults.headers.common['X-AUTH-TOKEN'] = token;
        }
    }

    // exceptionConfig.$inject = ['$provide'];

    // function exceptionConfig($provide) {
    //     $provide.decorator('$exceptionHandler', extendExceptionHandler);
    //     //$provide.decorator('$mdDialog',$mdDialog);
    // }
    // extendExceptionHandler.$inject = ['$delegate','$injector'];

    // function extendExceptionHandler($delegate,$injector) {
    //   return function(exception, cause) {
    //     $delegate(exception, cause);
    //     var errorData = {
    //         exception: exception,
    //         cause: cause
    //     };
    //     /**
    //      * Could add the error to a service's collection,
    //      * add errors to $rootScope, log errors to remote web server,
    //      * or log locally. Or throw hard. It is entirely up to you.
    //      * throw exception;
    //      */
    //     if ((typeof process !== 'undefined') && (process.release.name.search(/node|io.js/) !== -1)) {
    //       const fs = require('fs');
    //       const path = require('path');
    //       const os = require('os');

    //       const homeDir = os.homedir();
    //       var logDir = path.join(homeDir,'WorkForceAppraisals','logs');

    //       if (!fs.existsSync(logDir)) {
    //           fs.mkdirSync(logDir);
    //       }
    //       var datetime = new Date();
    //       var fileName = '/log-'+datetime.toDateString()+'.txt';
    //       logDir = path.join(logDir,fileName);

    //       var logger = fs.createWriteStream(logDir, {
    //         flags: 'a' // 'a' means appending (old data will be preserved)
    //       });

    //       logger.write(new Date() +"------- "+exception.stack+"\n \n \n \n");
    //       logger.end();
    //     }

    //     else{
    //       // toastr.options = {
    //       //   "closeButton": true,
    //       //   "positionClass": "toast-top-right",
    //       //   "timeOut": 0,
    //       //   "extendedTimeOut": 0,
    //       //   "tapToDismiss": false
    //       // }
    //       // toastr.error(exception.stack, 'Error Occured!');

    //       toastr.options = {
    //         "closeButton": true,
    //         "debug": false,
    //         "newestOnTop": false,
    //         "progressBar": false,
    //         "positionClass": "toast-bottom-left",
    //         "preventDuplicates": false,
    //         "showDuration": "300",
    //         "hideDuration": "1000",
    //         "timeOut": 0,
    //         "extendedTimeOut": 0,
    //         "showEasing": "swing",
    //         "hideEasing": "linear",
    //         "showMethod": "fadeIn",
    //         "hideMethod": "fadeOut",
    //         "tapToDismiss": false
    //       }
    //       toastr["error"]( "<br"+ exception.message+"/>", "Error Occured")
    //     }
    //   };
    // }

})();

(function ()
{
    'use strict';

    apiService.$inject = ["$resource"];
    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource)
    {
        /**
         * You can use this service to define your API urls. The "api" service
         * is designed to work in parallel with "apiResolver" service which you can
         * find in the "app/core/services/api-resolver.service.js" file.
         *
         * You can structure your API urls whatever the way you want to structure them.
         * You can either use very simple definitions, or you can use multi-dimensional
         * objects.
         *
         * Here's a very simple API url definition example:
         *
         *      api.getBlogList = $resource('http://api.example.com/getBlogList');
         *
         * While this is a perfectly valid $resource definition, most of the time you will
         * find yourself in a more complex situation where you want url parameters:
         *
         *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'});
         *
         * You can also define your custom methods. Custom method definitions allow you to
         * add hardcoded parameters to your API calls that you want to sent every time you
         * make that API call:
         *
         *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'}, {
         *         'getFromHomeCategory' : {method: 'GET', params: {blogCategory: 'home'}}
         *      });
         *
         * In addition to these definitions, you can also create multi-dimensional objects.
         * They are nothing to do with the $resource object, it's just a more convenient
         * way that we have created for you to packing your related API urls together:
         *
         *      api.blog = {
         *                   list     : $resource('http://api.example.com/blog'),
         *                   getById  : $resource('http://api.example.com/blog/:id', {id: '@id'}),
         *                   getByDate: $resource('http://api.example.com/blog/:date', {id: '@date'}, {
         *                       get: {
         *                            method: 'GET',
         *                            params: {
         *                                getByDate: true
         *                            }
         *                       }
         *                   })
         *       }
         *
         * If you look at the last example from above, we overrode the 'get' method to put a
         * hardcoded parameter. Now every time we make the "getByDate" call, the {getByDate: true}
         * object will also be sent along with whatever data we are sending.
         *
         * All the above methods are using standard $resource service. You can learn more about
         * it at: https://docs.angularjs.org/api/ngResource/service/$resource
         *
         * -----
         *
         * After you defined your API urls, you can use them in Controllers, Services and even
         * in the UIRouter state definitions.
         *
         * If we use the last example from above, you can do an API call in your Controllers and
         * Services like this:
         *
         *      function MyController (api)
         *      {
         *          // Get the blog list
         *          api.blog.list.get({},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the id of 3
         *          var id = 3;
         *          api.blog.getById.get({'id': id},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the date by using custom defined method
         *          var date = 112314232132;
         *          api.blog.getByDate.get({'date': date},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *      }
         *
         * Because we are directly using $resource service, all your API calls will return a
         * $promise object.
         *
         * --
         *
         * If you want to do the same calls in your UI Router state definitions, you need to use
         * "apiResolver" service we have prepared for you:
         *
         *      $stateProvider.state('app.blog', {
         *          url      : '/blog',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver)
         *              {
         *                  return apiResolver.resolve('blog.list@get');
         *              }
         *          }
         *      });
         *
         *  You can even use parameters with apiResolver service:
         *
         *      $stateProvider.state('app.blog.show', {
         *          url      : '/blog/:id',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver, $stateParams)
         *              {
         *                  return apiResolver.resolve('blog.getById@get', {'id': $stateParams.id);
         *              }
         *          }
         *      });
         *
         *  And the "Blog" object will be available in your BlogController:
         *
         *      function BlogController(Blog)
         *      {
         *          var vm = this;
         *
         *          // Data
         *          vm.blog = Blog;
         *
         *          ...
         *      }
         */

        var api = {};

        // Base Url
        api.baseUrl = 'app/data/';

        /**
         * Here you can find all the definitions that the Demo Project requires
         *
         * If you wish to use this method, you can create your API definitions
         * in a similar way.
         */

        /*
         api.dashboard = {
         project  : $resource(api.baseUrl + 'dashboard/project/data.json'),
         server   : $resource(api.baseUrl + 'dashboard/server/data.json'),
         analytics: $resource(api.baseUrl + 'dashboard/analytics/data.json')
         };

         api.cards = $resource(api.baseUrl + 'cards/cards.json');

         api.fileManager = {
         documents: $resource(api.baseUrl + 'file-manager/documents.json')
         };

         api.ganttChart = {
         tasks: $resource(api.baseUrl + 'gantt-chart/tasks.json'),
         timespans : $resource(api.baseUrl + 'gantt-chart/timespans.json')
         };

         api.icons = $resource('assets/icons/selection.json');

         api.invoice = $resource(api.baseUrl + 'invoice/invoice.json');

         api.mail = {
         inbox: $resource(api.baseUrl + 'mail/inbox.json')
         };

         api.profile = {
         timeline    : $resource(api.baseUrl + 'profile/timeline.json'),
         about       : $resource(api.baseUrl + 'profile/about.json'),
         photosVideos: $resource(api.baseUrl + 'profile/photos-videos.json')
         } ;

         api.quickPanel = {
         activities: $resource(api.baseUrl + 'quick-panel/activities.json'),
         contacts  : $resource(api.baseUrl + 'quick-panel/contacts.json'),
         events    : $resource(api.baseUrl + 'quick-panel/events.json'),
         notes     : $resource(api.baseUrl + 'quick-panel/notes.json')
         };

         api.search = {
         classic : $resource(api.baseUrl + 'search/classic.json'),
         mails   : $resource(api.baseUrl + 'search/mails.json'),
         users   : $resource(api.baseUrl + 'search/users.json'),
         contacts: $resource(api.baseUrl + 'search/contacts.json')
         };

         api.scrumboard = {
         boardList: $resource(api.baseUrl + 'scrumboard/boardList.json'),
         board    : $resource(api.baseUrl + 'scrumboard/boards/:id.json')
         };

         api.tables = {
         employees   : $resource(api.baseUrl + 'tables/employees.json'),
         employees100: $resource(api.baseUrl + 'tables/employees100.json')
         };

         api.timeline = {
         page1: $resource(api.baseUrl + 'timeline/page-1.json'),
         page2: $resource(api.baseUrl + 'timeline/page-2.json'),
         page3: $resource(api.baseUrl + 'timeline/page-3.json')
         };

         api.todo = {
         tasks: $resource(api.baseUrl + 'todo/tasks.json'),
         tags : $resource(api.baseUrl + 'todo/tags.json')
         };
         */

        return api;
    }

})();

(function() {
    'use strict';

    config.$inject = ["msNavigationServiceProvider"];
    angular.module('app.settings', [
            'app.settings.login',
            'app.settings.register'
        ])
        .config(config);

    function config(msNavigationServiceProvider) {
        // msNavigationServiceProvider.saveItem('apps.settings', {
        //     title: 'Settings',
        //     weight: 1,
        //     icon: 'icon-cog'
        // });
    }
})();

;(function() {
  "use strict"

  config.$inject = ["msNavigationServiceProvider"];
  angular
    .module("app.appraisals", [
      "app.appraisals.newappraisal",
      "app.appraisals.manageappraisal"
    ])
    .config(config)

  function config(msNavigationServiceProvider) {
    msNavigationServiceProvider.saveItem("appraisals", {
      title: "Appraisals",
      weight: 1,
      icon: "icon-cog"
    })

    msNavigationServiceProvider.saveItem("appraisals.newappraisal", {
      title: "New Appraisal",
      state: "app.newappraisal"
    })

    msNavigationServiceProvider.saveItem("appraisals.manageappraisal", {
      title: "Manage Appraisal",
      state: "app.manageappraisal"
    })
  }
})()

angular.module("fuse").run(["$templateCache", function($templateCache) {$templateCache.put("app/core/layouts/content-only.html","<div id=\"layout-content-only\" class=\"template-layout\" layout=\"column\" flex><md-content id=\"content\" \nclass=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex></md-content></div>");
$templateCache.put("app/core/layouts/content-with-toolbar.html","<div id=\"layout-content-with-toolbar\" class=\"template-layout\" layout=\"column\" flex><md-content id=\"content\" \nclass=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex></md-content></div>");
$templateCache.put("app/core/layouts/horizontal-navigation.html","<div id=\"layout-horizontal-navigation\" class=\"template-layout\" layout=\"column\" flex><div id=\"horizontal-navigation\" \nclass=\"md-whiteframe-1dp\" ui-view=\"navigation\"></div><div id=\"content-container\" flex layout=\"column\"><md-content \nid=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll ui-view=\"content\" flex></md-content></div></div>");
$templateCache.put("app/core/layouts/vertical-navigation.html","<div id=\"layout-vertical-navigation\" class=\"template-layout\" layout=\"row\" flex><md-sidenav id=\"vertical-navigation\" \nclass=\"md-primary-bg\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\" md-component-id=\"navigation\" ms-scroll \nui-view=\"navigation\"></md-sidenav><div id=\"content\" flex layout=\"column\"><md-toolbar id=\"toolbar\" \nclass=\"md-menu-toolbar\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" \nclass=\"animate-slide-up md-background md-hue-1\" ms-scroll ui-view=\"content\" flex></md-content></div><div \nng-show=\"processingRequest\" id=\"progress-image-loading\"><div class=\"center\"><center><img \nsrc=\"./assets/images/logos/logo-white.png\"></center><div class=\"spinner-wrapper\"><div class=\"spinner\"><div \nclass=\"inner\"><div class=\"gap\"></div><div class=\"left\"><div class=\"half-circle\"></div></div><div class=\"right\"><div \nclass=\"half-circle\"></div></div></div></div></div></div></div></div>");
$templateCache.put("app/core/theme-options/theme-options.html","<div class=\"ms-theme-options-panel\" layout=\"row\" layout-align=\"start start\"><div \nclass=\"ms-theme-options-panel-button md-primary-bg\" ng-click=\"toggleOptionsPanel()\"><md-icon md-font-icon=\"icon-cog\" \nclass=\"white-text\"></md-icon></div><div class=\"ms-theme-options-list\" layout=\"column\"><div class=\"theme-option\"><div \nclass=\"option-title\">Layout Style:</div><md-radio-group layout=\"column\" ng-model=\"vm.layoutStyle\" \nng-change=\"vm.updateLayoutStyle()\"><md-radio-button value=\"verticalNavigation\">Vertical Navigation</md-radio-button>\n<md-radio-button value=\"horizontalNavigation\">Horizontal Navigation</md-radio-button><md-radio-button \nvalue=\"contentOnly\">Content Only</md-radio-button><md-radio-button value=\"contentWithToolbar\">Content with Toolbar\n</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">\nLayout Mode:</div><md-radio-group layout=\"row\" layout-align=\"start center\" ng-model=\"vm.layoutMode\" \nng-change=\"vm.updateLayoutMode()\"><md-radio-button value=\"boxed\">Boxed</md-radio-button><md-radio-button value=\"wide\">\nWide</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div \nclass=\"option-title\">Color Palette:</div><md-menu-item ng-repeat=\"(themeName, theme) in vm.themes.list\" class=\"theme\">\n<md-button class=\"md-raised theme-button\" aria-label=\"{{themeName}}\" ng-click=\"vm.setActiveTheme(themeName)\" \nng-style=\"{\'background-color\': theme.primary.color,\'border-color\': theme.accent.color,\'color\': theme.primary.contrast1}\" \nng-class=\"themeName\"><span><md-icon ng-style=\"{\'color\': theme.primary.contrast1}\" md-font-icon=\"icon-palette\">\n</md-icon><span>{{themeName}}</span></span></md-button></md-menu-item></div></div></div>");
$templateCache.put("app/main/dialogs/appraisalform.html","<div ng-show=\"processingReveiw\" id=\"image-loading\"><div class=\"center\"><center><img \nsrc=\"./assets/images/logos/logo-white.png\"></center><div class=\"spinner-wrapper\"><div class=\"spinner\"><div \nclass=\"inner\"><div class=\"gap\"></div><div class=\"left\"><div class=\"half-circle\"></div></div><div class=\"right\"><div \nclass=\"half-circle\"></div></div></div></div></div></div></div><md-dialog aria-label=\"Employee Appraisal Form\" \ndraggable><div layout=\"column\" class=\"page\" layout-fill><md-card class=\"default header\" layout=\"column\" \nlayout-align=\"center left\"><h3><md-icon md-font-icon=\"icon-content-paste\"></md-icon>Employee Appraisal Form</h3>\n</md-card><fieldset id=\"viewfieldset\"><legend>EMPLOYEE PROFILE</legend><div class=\"personal-profile\" layout=\"row\"><div \nclass=\"profile-details\" layout=\"column\" flex><div class=\"header\"><h1 style=\"font-weight: bold; font-size:15px\">\n{{user.firstname+\' \'+user.lastname}}</h1></div><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:15px\">Line Of Business</p><span>{{user.personalInfo.lob||\'N/A\'}}</span></div><div \nflex=\"25\"><p style=\"font-weight: bold; font-size:15px\">Recruitment Date</p><span>\n{{user.personalInfo.recruitmentDate||\"N/A\"}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">\nLocation/based at</p><span>{{user.personalInfo.location}}</span></div><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:15px\">Year or period covered</p><span>{{user.personalInfo.periodCovered}}</span>\n</div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">Time in present position</p><span>\n{{user.personalInfo.timeInPresentPosition}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">\nLength of service</p><span>{{user.personalInfo.lengthOfService}}</span></div><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:15px\">Appraisal date & time</p><span>{{user.personalInfo.appraisalVenue}}</span>\n</div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">Appraisal venue</p><span>\n{{user.personalInfo.appraisalVenue}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">Appraiser\n</p><span>{{user.personalInfo.appraiser}}</span></div></div></div></div></fieldset><fieldset id=\"viewfieldset\"><legend>\nGOALS & OBJECTIVES</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" \nflex><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><span>{{objectives.objectives}}</span></div></div>\n</div></div></fieldset><fieldset id=\"viewfieldset\"><legend>EMPLOYEE’S SELF- ASSESSMENT</legend><div \nclass=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div class=\"visits\" flex><h2 \nclass=\"heading\"><md-icon md-svg-src=\"./assets/icons/svg/added/Admit.svg\"></md-icon>Job Summary</h2><div \nclass=\"single-visit\"><md-grid-list md-cols=\"2\" ng-repeat=\"summary in jobSummary\" md-gutter=\"1em\" md-row-height=\"15px\" \nstyle=\"width: 300px\"><md-grid-tile>{{summary.summary}}</md-grid-tile></md-grid-list></div></div><div class=\"visits\" \nflex><h2 class=\"heading\"><md-icon md-svg-src=\"./assets/icons/svg/added/Admit.svg\"></md-icon>\nAdjusted Responsibilities/Additional Comments</h2><div class=\"single-visit\"><md-grid-list md-cols=\"2\" \nng-repeat=\"comment in additionalComments\" md-gutter=\"1em\" md-row-height=\"15px\" style=\"width: 300px\"><md-grid-tile>\n{{comment.comment}}</md-grid-tile></md-grid-list></div></div></div></div></fieldset><fieldset id=\"viewfieldset\">\n<legend>PERFORMANCE APPRAISAL</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" \nlayout=\"column\" flex><div class=\"details\" layout=\"column\" layout-wrap><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Accomplishment of key responsibilities/deliverables:</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.accomplishment}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Achievement of the goals established during the past year:</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.achievement}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIdentify areas of exceptional performance on your part that should be particularly noted. Provide specific examples.\n</p><span style=\"margin:20px\">{{performanceAppraisal.exceptionalPerformance}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIn your current position, can you share an example where you have demonstrated your leadership? Provide specific examples.\n</p><span style=\"margin:20px\">{{performanceAppraisal.leadership}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIn your current position, can you share an example where you have taken ownership? Provide specific examples.</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.ownership}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIdentify areas of your performance needing more attention or improvement. Provide specific examples.</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.improvement}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nApart from your current role, is there any other role in the organization you will like to function in? Please specify the role, state the reasons for your choice and articulate how you intend to contribute to the goal of the organization by functioning in this role\n</p><span style=\"margin:20px\">{{performanceAppraisal.anyOtherRole}}</span></div></div></div></div></fieldset><fieldset \nid=\"viewfieldset\"><legend>FOUNDING PHILOSOPHY</legend><div class=\"personal-profile\" layout=\"row\"><div \nclass=\"profile-details\" layout=\"column\" flex><md-table-container><table md-table ng-model=\"selected\" \nmd-progress=\"promise\"><thead md-head><tr md-row><th md-column md-order-by=\"name\"><span \nstyle=\"font-weight: bold; font-size:15px\">Creed </span></th><th md-column md-order-by=\"type\"><span \nstyle=\"font-weight: bold; font-size:15px\">Definitions</span></th><th md-column md-order-by=\"type\"><span \nstyle=\"font-weight: bold; font-size:15px\">Ratings</span></th></tr></thead><tbody md-body><tr md-row md-select=\"user\" \nmd-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" ng-repeat=\"philosophy in foundingPhilosophy\"><td md-cell>\n{{philosophy.name}}</td><td md-cell>{{philosophy.definition}}</td><td md-cell>\n{{philosophy.rating==4?\'Exceptional\':philosophy.rating==3?\'Good\':philosophy.rating==2?\'Below Average\':\'Poor\'}}</td>\n</tr></tbody></table></md-table-container><p></p><div flex><p style=\"font-weight: bold; font-size:15px\">\nKey achievement / client feedback on my performance in relation to the founding philosophy</p><span \nstyle=\"margin:20px\">{{clientFeedback.feedBack}}</span></div><p></p></div></div></fieldset><fieldset id=\"viewfieldset\">\n<legend>OVERALL ASSESSMENT</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" \nlayout=\"column\" flex><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><span>{{ vm.overallAssessment }}\n</span></div></div></div></div></fieldset><fieldset id=\"viewfieldset\"><legend>DEVELOPMENT PLAN</legend><div \nclass=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div class=\"details\" \nlayout=\"column\" layout-wrap><fieldset><legend>{{developmentPlans[0][\'plan\']}}</legend><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Competences</p><span style=\"margin:20px\">\n{{developmentPlans[0][\'competences\']}}</span></div><div flex><p style=\"font-weight: bold; font-size:15px\">Actions</p>\n<span style=\"margin:20px\">{{developmentPlans[0][\'actions\']}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Due Date</p><span style=\"margin:20px\">{{developmentPlans[0][\'dueDate\']|date}}\n</span></div></fieldset><fieldset><legend>{{developmentPlans[1][\'plan\']}}</legend><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Competences</p><span style=\"margin:20px\">\n{{developmentPlans[1][\'competences\']}}</span></div><div flex><p style=\"font-weight: bold; font-size:15px\">Actions</p>\n<span style=\"margin:20px\">{{developmentPlans[1][\'actions\']}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Due Date</p><span style=\"margin:20px\">{{developmentPlans[1][\'dueDate\']|date}}\n</span></div></fieldset></div></div></div></fieldset><fieldset id=\"viewfieldset\"><legend>APPROVE/DECLINE</legend><div \nclass=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div class=\"details\" \nlayout=\"column\" layout-wrap><div layout=\"row\" flex><div flex=\"15\"><label class=\"tiredlabel\"><span class=\"\" \nstyle=\"font-weight: bold; font-size:15px\">*</span> Final Rating:</label></div><md-input-container class=\"tiredinput\" \nflex=\"80\"><label></label><textarea md-no-asterisk type=\"text\" ng-model=\"review.finalRating\" required></textarea>\n</md-input-container></div><div layout=\"row\" flex><div flex=\"15\"><label class=\"tiredlabel\"><span class=\"\" \nstyle=\"font-weight: bold; font-size:15px\">*</span> Comment:</label></div><md-input-container class=\"tiredinput\" \nflex=\"80\"><label></label><textarea md-no-asterisk type=\"text\" ng-model=\"review.comment\"></textarea>\n</md-input-container></div></div></div></div></fieldset><div layout=\"row\" layout-align=\"center center\"><md-button \nclass=\"md-raised md-accent\" ng-click=\"submitReveiw(true)\" style=\"margin-right:20px\">Approve</md-button><md-button \nclass=\"md-raised md-accent\" ng-click=\"submitReveiw(false)\" style=\"margin-right:20px\">Decline</md-button><md-button \nclass=\"md-raised md-accent\" ng-click=\"cancel()\" style=\"margin-right:20px\">Close</md-button></div></div></md-dialog>");
$templateCache.put("app/core/directives/ms-material-color-picker/ms-material-color-picker.html","<md-menu md-position-mode=\"target-right target\"><md-button aria-label=\"Row Color\" md-menu-origin \nng-click=\"$mdOpenMenu($event)\" ng-class=\"selectedColor.class\"><span ng-show=\"selectedColor.palette\">\n{{selectedColor.palette}} {{selectedColor.hue}} </span><span ng-show=\"!selectedColor.palette\">Select Color</span>\n</md-button><md-menu-content class=\"ms-material-color-picker-menu-content\" layout-column><header \nng-class=\"selectedColor.class || \'md-accent-bg\'\" class=\"md-whiteframe-4dp\" layout=\"row\" \nlayout-align=\"space-between center\"><md-button md-prevent-menu-close ng-click=\"activateHueSelection(false,false)\" \nclass=\"md-icon-button\" ng-class=\"{\'hidden\':!selectedPalette}\" aria-label=\"Palette\"><md-icon \nmd-font-icon=\"icon-arrow-left\" class=\"s20\"></md-icon></md-button><span ng-if=\"selectedColor.palette\">\n{{selectedColor.palette}} {{selectedColor.hue}} </span><span ng-if=\"!selectedColor.palette\">Select Color</span>\n<md-button class=\"remove-color-button md-icon-button\" ng-click=\"removeColor()\" aria-label=\"Remove Color\"><md-icon \nmd-font-icon=\"icon-delete\" class=\"s20\"></md-icon></md-button></header><div class=\"colors\" ms-scroll><div \nng-if=\"!selectedPalette\" layout=\"row\" layout-wrap><div class=\"color\" ng-class=\"\'md-\'+palette+\'-500-bg\'\" \nng-repeat=\"(palette, hues) in palettes\" ng-click=\"activateHueSelection(palette,hues)\" layout=\"row\" \nlayout-align=\"start end\" md-prevent-menu-close md-ink-ripple><span class=\"label\">{{palette}}</span></div></div><div \nng-if=\"selectedPalette\" layout=\"row\" layout-wrap><div class=\"color\" ng-class=\"\'md-\'+selectedPalette+\'-\'+hue+\'-bg\'\" \nng-repeat=\"(hue, values) in selectedHues\" ng-click=\"selectColor(selectedPalette,hue)\" layout=\"row\" \nlayout-align=\"start end\" md-ink-ripple><span class=\"label\">{{hue}} </span><i \nng-if=\"selectedPalette == selectedColor.palette && hue == selectedColor.hue\" class=\"s16 icon-check\"></i></div></div>\n</div></md-menu-content></md-menu>");
$templateCache.put("app/core/directives/ms-search-bar/ms-search-bar.html","<div flex layout=\"row\" layout-align=\"start center\"><label for=\"ms-search-bar-input\"><md-icon \nid=\"ms-search-bar-expander\" md-font-icon=\"icon-magnify\" class=\"icon s24\"></md-icon><md-icon \nid=\"ms-search-bar-collapser\" md-font-icon=\"icon-close\" class=\"icon s24\"></md-icon></label><input \nid=\"ms-search-bar-input\" type=\"text\" ng-model=\"global.search\" placeholder=\"Search\" translate \ntranslate-attr-placeholder=\"TOOLBAR.SEARCH\" flex></div>");
$templateCache.put("app/main/apps/dashboard/dashboard.html","<div layout=\"row\" id=\"patient-billing\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card \nclass=\"default header\" layout=\"row\" layout-align=\"center\"><h3></h3></md-card><md-content class=\"body\" layout=\"column\" \nflex layout-margin ms-scroll><fieldset id=\"viewfieldset\"><div class=\"personal-profile\" layout=\"row\"><div \nclass=\"profile-details\" layout=\"column\" flex><div class=\"header\"><h1>{{vm.user.firstname+\' \'+vm.user.lastname}}</h1>\n</div><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><p style=\"font-weight: bold; font-size:18px\">Email\n</p><span>{{vm.user.email}}</span></div></div><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:18px\">Line Of Business</p><span>{{vm.user.personalInfo.lob}}</span></div><div \nflex=\"25\"><p style=\"font-weight: bold; font-size:18px\">Recruitment Date</p><span>\n{{vm.user.personalInfo.recruitmentDate|date}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:18px\">\nLocation/based at</p><span>{{vm.user.personalInfo.location}}</span></div></div></div></div></fieldset></md-content>\n</div></div>");
$templateCache.put("app/navigation/layouts/vertical-navigation/navigation.html","<md-toolbar class=\"navigation-header md-whiteframe-1dp\" layout=\"row\" layout-align=\"space-between center\"><div \nclass=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\"><img \nsrc=\"./assets/images/logos/logo.png\"> </span><span class=\"logo-text\">Dashboard</span><md-menu \nmd-position-mode=\"target-left target\" md-offset=\"0 50\"><md-button id=\"logoutButton\" aria-label=\"Open demo menu\" \nclass=\"md-icon-button\" ng-click=\"$mdMenu.open($event)\"><md-icon md-svg-icon=\"./assets/icons/svg/more_vert.svg\">\n</md-icon></md-button><md-menu-content ng-mouseleave=\"$mdMenu.close()\"><md-menu-divider></md-menu-divider><md-menu-item\n data-ui-sref-active=\"active\"><md-button ng-click=\"vm.signOut()\"><ng-md-icon icon=\"logout\" md-menu-align-target>\n</ng-md-icon>Sign out</md-button></md-menu-item></md-menu-content></md-menu></div></md-toolbar><ms-navigation \nclass=\"scrollable\" folded=\"vm.folded\" ms-scroll=\"vm.msScrollOptions\"></ms-navigation>");
$templateCache.put("app/navigation/layouts/horizontal-navigation/navigation.html","<div layout=\"row\" layout-align=\"start center\"><ms-navigation-horizontal></ms-navigation-horizontal></div>");
$templateCache.put("app/toolbar/layouts/content-with-toolbar/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"logo\" \nlayout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div>\n<md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" \nmd-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><div \nclass=\"toolbar-separator\"></div><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-menu-bar \nid=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" \naria-label=\"User settings\" translate translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" \nlayout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target class=\"avatar\" \nsrc=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs>\nJohn Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs></md-icon></div></md-button>\n<md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon \nmd-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item \nclass=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox\n</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button \nng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button>\n<md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" \nng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" \nclass=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon \nmd-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-bar><div class=\"toolbar-separator\"></div><md-menu id=\"language-menu\" \nmd-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" \naria-label=\"Language\" md-menu-origin md-menu-align-target><div layout=\"row\" layout-align=\"center center\"><img \nclass=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">\n{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\">\n<md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" \naria-label=\"{{lang.title}}\" translate translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" \nlayout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span \ntranslate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu>\n<div class=\"toolbar-separator\"></div><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" \nng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate \ntranslate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\">\n</md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/horizontal-navigation/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div \nclass=\"navigation-toggle\" hide-gt-sm><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" \naria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><div class=\"logo\" \nlayout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div>\n<md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" \nmd-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><ms-search-bar>\n</ms-search-bar><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" \nng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div \nlayout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target class=\"avatar\" \nsrc=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs>\nJohn Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs></md-icon></div></md-button>\n<md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon \nmd-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item \nclass=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox\n</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button \nng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button>\n<md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" \nng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" \nclass=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon \nmd-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-bar><md-menu id=\"language-menu\" md-offset=\"0 72\" \nmd-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" \naria-label=\"Language\" md-menu-origin md-menu-align-target><div layout=\"row\" layout-align=\"center center\"><img \nclass=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">\n{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\">\n<md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" \naria-label=\"{{lang.title}}\" translate translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" \nlayout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span \ntranslate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu>\n<md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" \naria-label=\"Toggle quick panel\" translate translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon \nmd-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/vertical-navigation/toolbar.html","<div layout=\"row\" class=\"navigation-header\" layout-align=\"start center\" style=\"height: 48px\"><div layout=\"row\" \nlayout-align=\"start center\" flex><md-button id=\"navigation-toggle\" class=\"md-icon-button\" \nng-click=\"vm.toggleSidenav(\'navigation\')\" hide-gt-sm aria-label=\"Toggle navigation\" translate \ntranslate-attr-aria-label=\"TOOLBAR.TOGGLE_NAVIGATION\"><md-icon md-font-icon=\"icon-menu\" class=\"icon\"></md-icon>\n</md-button><div class=\"form-title\" style=\"margin-left: 15px;font-size: 21px\">{{vm.pageTitle}}</div></div><div \nlayout=\"row\" layout-align=\"start center\"><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button\n class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate \ntranslate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div \nclass=\"avatar-wrapper\"><img md-menu-align-target class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon \nmd-font-icon ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\">\n</md-icon></div><span class=\"username\" hide-xs>{{vm.loggedInStaff}}</span><md-icon md-font-icon=\"icon-chevron-down\" \nclass=\"icon s16\" hide-xs></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" \nng-show=\"vm.shiftNumber\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-timetable\" class=\"icon\"></md-icon>\n<span style=\"margin-left: 48px; line-height: 2.9\">{{vm.shiftNumber}}</span></md-menu-item><md-menu-divider>\n</md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button\n ng-click=\"vm.logout()\" translate=\"TOOLBAR.SIGN_OUT\"></md-button></md-menu-item></md-menu-content></md-menu>\n</md-menu-bar><div><md-icon md-font-icon=\"icon-hospital-marker\" ng-show=\"vm.location\" class=\"icon\" \nstyle=\"margin-right: 5px; margin-left: 15px\"></md-icon><span style=\"margin-right: 25px; font-size: 14px\">\n{{vm.location}}</span></div></div></div>");
$templateCache.put("app/core/directives/ms-navigation/templates/horizontal.html","<div class=\"navigation-toggle\" hide-gt-sm><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" \naria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><ul \nclass=\"horizontal\"><li ng-repeat=\"node in vm.navigation\" ms-navigation-horizontal-node=\"node\" \nng-class=\"{\'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-horizontal-nested.html\'\"></li></ul><script \ntype=\"text/ng-template\" id=\"navigation-horizontal-nested.html\">\n<div ms-navigation-horizontal-item layout=\"row\" ng-if=\"!vm.isHidden()\">\n\n        <div class=\"ms-navigation-horizontal-button\" ng-if=\"!node.uisref && node.title\"\n             ng-class=\"{\'active md-accent-bg\': vm.isActive}\">\n            <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i>\n            <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\n            <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\n            <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i>\n        </div>\n\n        <a class=\"ms-navigation-horizontal-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\"\n           ng-class=\"{\'active md-accent-bg\': vm.isActive}\"\n           ng-if=\"node.uisref && node.title\">\n            <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i>\n            <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\n            <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\n            <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i>\n        </a>\n\n    </div>\n\n    <ul ng-if=\"vm.hasChildren && !vm.isHidden()\">\n        <li ng-repeat=\"node in node.children\" ms-navigation-horizontal-node=\"node\"\n            ng-class=\"{\'has-children\': vm.hasChildren}\"\n            ng-include=\"\'navigation-horizontal-nested.html\'\"></li>\n    </ul>\n</script>");
$templateCache.put("app/core/directives/ms-navigation/templates/vertical.html","<ul><li ng-repeat=\"node in vm.navigation\" ms-navigation-node=\"node\" \nng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-nested.html\'\"></li></ul>\n<script type=\"text/ng-template\" id=\"navigation-nested.html\">\n<div ms-navigation-item layout=\"row\" ng-if=\"!vm.isHidden()\">\n\n      <div class=\"ms-navigation-button\" ng-if=\"!node.uisref && node.title\">\n          <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i>\n          <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\n          <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\n          <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i>\n      </div>\n\n      <a class=\"ms-navigation-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\"\n         ng-if=\"node.uisref && node.title\">\n          <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i>\n          <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\n          <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\n          <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i>\n      </a>\n\n  </div>\n\n  <ul ng-if=\"vm.hasChildren && !vm.isHidden()\">\n      <li ng-repeat=\"node in node.children\" ms-navigation-node=\"node\"\n          ng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\"\n          ng-include=\"\'navigation-nested.html\'\"></li>\n  </ul>\n</script>");
$templateCache.put("app/main/apps/appraisals/manageappraisal/manageappraisal.html","<div layout=\"row\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card class=\"default header\" \nlayout=\"row\" layout-align=\"center\"><h3></h3></md-card><md-toolbar class=\"md-table-toolbar md-default\" \nng-hide=\"options.rowSelection && selected.length\"><div class=\"md-toolbar-tools\"><span>Appraisals</span><div flex></div>\n<md-button class=\"md-icon-button\" ng-click=\"getEmployeeList()\"><md-icon aria-label=\"refresh list\" \nmd-font-icon=\"icon-refresh\"></md-icon></md-button></div></md-toolbar><md-toolbar class=\"md-table-toolbar alternate\" \nng-show=\"options.rowSelection && selected.length\"><div class=\"md-toolbar-tools\"><span>\n{{selected.length}} {{selected.length > 1 ? \'Users\' : \'User\'}} selected</span></div></md-toolbar><md-table-container>\n<table md-table md-row-select=\"options.rowSelection\" multiple=\"{{options.multiSelect}}\" ng-model=\"selected\" \nmd-progress=\"promise\"><thead ng-if=\"!options.decapitate\" md-head md-order=\"query.order\" md-on-reorder=\"logOrder\"><tr \nmd-row><th md-column md-order-by=\"name\"><span>Employee Name</span></th><th md-column md-numeric \nmd-order-by=\"fat.value\"><span></span></th></tr></thead><tbody md-body><tr md-row md-select=\"user\" \nmd-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" \nng-repeat=\"user in users | filter: filter.search | orderBy: query.order \"><td md-cell>\n{{user.firstname}} {{user.lastname}}</td><td md-cell><md-icon \nng-click=\"vm.getAppraisalDetails(user,$event,\'appraisalform.html\')\" \nmd-svg-src=\"./assets/icons/svg/round-add-button.svg\" class=\"button\"></md-icon></td></tr></tbody></table>\n</md-table-container><md-table-pagination md-limit=\"query.limit\" md-limit-options=\"limitOptions\" md-page=\"query.page\" \nmd-total=\"{{users.count}}\" md-page-select=\"options.pageSelect\" md-boundary-links=\"options.boundaryLinks\" \nmd-on-paginate=\"vm.getEmployeeList\"></md-table-pagination></div></div>");
$templateCache.put("app/main/apps/appraisals/newappriasal/newappraisal.html","<md-progress-linear class=\"overlay\" ng-show=\"processingRequest\" md-mode=\"indeterminate\" ng-value=\"please\">\n</md-progress-linear><div layout=\"column\"><ms-form-wizard flex><md-tabs md-dynamic-height \nmd-selected=\"msWizard.selectedIndex\" md-center-tabs=\"true\"><md-tab><md-tab-label><span \nclass=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep1.$invalid\">1\n</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep1.$valid\"><i class=\"icon-check s16\"></i>\n </span><span class=\"ms-form-wizard-step-text\">Step 1</span></span></md-tab-label><md-tab-body id=\"supplier-register\" \nclass=\"page\"><form name=\"wizardStep1\" class=\"md-inline-form\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" \nlayout=\"column\" layout-align=\"center\"><h3><md-icon md-font-icon=\"icon-content-paste\"></md-icon>Profile</h3></md-card>\n<fieldset><div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\"><span class=\"\">*</span> Full Name:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"70\"><label></label><textarea md-no-asterisk type=\"text\" \nng-model=\"vm.profiledata.FullName\"></textarea></md-input-container></div><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\"><span class=\"\">*</span> Line of Business:</label></div><md-input-container class=\"tiredinput\" \nflex=\"25\"><label></label><md-select md-no-asterisk name=\"lob\" ng-model=\"vm.profiledata.lob\"><md-option \nng-repeat=\"lob in vm.lobs\" value=\"{{lob}}\">{{lob}}</md-option></md-select></md-input-container><div flex=\"20\"><label \nclass=\"tiredlabel\">Location/based at:</label></div><md-input-container class=\"tiredinput\" flex=\"25\"><label></label>\n<md-select md-no-asterisk name=\"location\" ng-model=\"vm.profiledata.location\"><md-option \nng-repeat=\"location in vm.locations\" value=\"{{location.state +\', \'+location.country}}\">\n{{location.state +\', \'+location.country}}</md-option></md-select></md-input-container></div><div layout=\"row\"><div \nflex=\"20\"><label class=\"tiredlabel\"><span class=\"\">*</span> Year/period covered</label></div><md-input-container \nclass=\"tiredinput\" flex=\"25\"><label></label><input md-no-asterisk type=\"text\" ng-model=\"vm.profiledata.periodCovered\">\n</md-input-container><div flex=\"20\"><label class=\"tiredlabel\">Time in present position:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"25\"><label></label><input md-no-asterisk type=\"text\" \nng-model=\"vm.profiledata.timeInPresentPosition\"></md-input-container></div><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\">Recruitment Date:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label>\n<input md-no-asterisk type=\"date\" name=\"dateOfBirth\" ng-model=\"vm.profiledata.recruitmentDate\"></md-input-container>\n</div><div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Length of service:</label></div><md-input-container \nclass=\"tiredinput\" flex=\"70\"><label></label><textarea md-no-asterisk type=\"text\" \nng-model=\"vm.profiledata.lengthOfService\"></textarea></md-input-container></div><div layout=\"row\"><div flex=\"20\"><label\n class=\"tiredlabel\">Appraisal venue:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label>\n<textarea md-no-asterisk type=\"text\" ng-model=\"vm.profiledata.appraisalVenue\"></textarea></md-input-container></div>\n<div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Appraiser:</label></div><md-input-container \nclass=\"tiredinput\" flex=\"70\"><label></label><textarea md-no-asterisk type=\"text\" ng-model=\"vm.profiledata.appraiser\">\n</textarea></md-input-container></div></fieldset></form></md-tab-body></md-tab><md-tab><md-tab-label><span \nclass=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep2.$invalid\">2\n</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep2.$valid\"><i class=\"icon-check s16\"></i>\n </span><span class=\"ms-form-wizard-step-text\">Step 2</span></span></md-tab-label><md-tab-body><form \nname=\"wizardStep2\" class=\"md-inline-form\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" \nlayout-align=\"center\"><h3><md-icon md-font-icon=\"icon-content-paste\"></md-icon>Goals & Objectives</h3></md-card><div \nclass=\"about-section-text\"><p>\nBriefly describe your personal understanding and contributions to the overall objective of the organisation in 2017</p>\n</div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.objective.objectives\" md-select-on-focus></textarea></md-input-container></div></form></md-tab-body>\n</md-tab><md-tab><md-tab-label><span class=\"ms-form-wizard-step-label\"><span \nclass=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep3.$invalid\">3</span> <span \nclass=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep3.$valid\"><i class=\"icon-check s16\"></i> </span><span \nclass=\"ms-form-wizard-step-text\">Step 3</span></span></md-tab-label><md-tab-body><form name=\"wizardStep3\" \nms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" layout-align=\"center\"><h3><md-icon \nmd-font-icon=\"icon-content-paste\"></md-icon>Self Assessment</h3></md-card><ol><li><div class=\"about-section-text\"><p>\nYour Job Summary: Provide a summary of your responsibilities during this period, including significant projects.</p>\n</div><ol><li ng-repeat=\"jobsummary in vm.jobsummaries track by $index\"><div layout=\"row\"><md-input-container \nflex=\"70\"><input md-no-asterisk type=\"text\" ng-model=\"jobsummary.summary\"></md-input-container><div flex=\"20\">\n<md-button class=\"md-raised md-accent\" aria-label=\"remove selected jobsummary\" \nng-click=\"vm.removeSelectedObject(jobsummary,\'jobsummary\')\"><ng-md-icon icon=\"delete\" md-menu-align-target>\n</ng-md-icon></md-button></div></div></li></ol><div class=\"about-section-text\"><md-input-container flex=\"25\"><md-icon \nng-click=\"vm.addNewObject(\'jobsummary\')\" md-svg-src=\"./assets/icons/svg/round-add-button.svg\" class=\"button\"></md-icon>\n</md-input-container></div></li><li><div class=\"about-section-text\"><p>\nAdjusted Responsibilities/Additional Comments: Note any job changes, responsibilities, or projects added since the last update of your job description, plan of work or performance goals/objectives, as well as any special circumstances that provide a context for this performance review.\n</p></div><ol><li ng-repeat=\"objective in vm.responsibilities track by $index\"><div layout=\"row\"><md-input-container \nflex=\"70\"><input md-no-asterisk type=\"text\" ng-model=\"objective.comment\"></md-input-container><div flex=\"20\"><md-button\n class=\"md-raised md-accent\" aria-label=\"remove selected objective\" \nng-click=\"vm.removeSelectedObject(objective,\'responsibility\')\"><ng-md-icon icon=\"delete\" md-menu-align-target>\n</ng-md-icon></md-button></div></div></li></ol><div class=\"about-section-text\"><md-input-container flex=\"25\"><md-icon \nng-click=\"vm.addNewObject(\'responsibility\')\" md-svg-src=\"./assets/icons/svg/round-add-button.svg\" class=\"button\">\n</md-icon></md-input-container></div></li><li><div class=\"about-section-text\"><p>\nPerformance Appraisal: Discuss and evaluate your performance against the firm’s objectives. Base your appraisal upon the job summary, adjusted responsibilities/additional comments and your performance goals for the performance cycle.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><ol><li><div class=\"p-appraisal-li\"><p>\nAccomplishment of key responsibilities/deliverables:</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex>\n<md-input-container flex=\"100\"><textarea ng-model=\"vm.performanceAppraisal.accomplishment\" md-select-on-focus>\n</textarea></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nAchievement of the goals established during the past year:</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex>\n<md-input-container flex=\"100\"><textarea ng-model=\"vm.performanceAppraisal.achievement\" md-select-on-focus></textarea>\n<div ng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .</span></div>\n</div></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nIdentify areas of exceptional performance on your part that should be particularly noted. Provide specific examples.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.exceptionalPerformance\" md-select-on-focus></textarea><div \nng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .</span></div>\n</div></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nIn your current position, can you share an example where you have demonstrated your leadership? Provide specific examples.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.leadership\" md-select-on-focus></textarea><div \nng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .</span></div>\n</div></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nIn your current position, can you share an example where you have taken ownership? Provide specific examples.</p></div>\n<div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.ownership\" md-select-on-focus></textarea><div \nng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .</span></div>\n</div></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nIdentify areas of your performance needing more attention or improvement. Provide specific examples.</p></div><div \nlayout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.improvement\" md-select-on-focus></textarea><div \nng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .</span></div>\n</div></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nApart from your current role, is there any other role in the organization you will like to function in? Please specify the role, state the reasons for your choice and articulate how you intend to contribute to the goal of the organization by functioning in this role.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.anyOtherRole\" md-select-on-focus></textarea><div \nng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .</span></div>\n</div></md-input-container></div></li></ol></div></li></ol></form></md-tab-body></md-tab><md-tab><md-tab-label><span \nclass=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep4.$invalid\">4\n</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep4.$valid\"><i class=\"icon-check s16\"></i>\n </span><span class=\"ms-form-wizard-step-text\">Step 4</span></span></md-tab-label><md-tab-body><form \nname=\"wizardStep4\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" layout-align=\"center\"><h3>\n<md-icon md-font-icon=\"icon-content-paste\"></md-icon>Founding Philosophy</h3></md-card><ol><li><div \nclass=\"about-section-text\"><p>\nPlease rate your level of understanding of and/or performance against the firm’s founding philosophy using the following metrics:\n</p><span class=\"about-section-text\">(4 = Exceptional 3 = Good 2 = Below Average 1 = Poor)</span></div>\n<md-table-container><table md-table md-row-select=\"options.rowSelection\" multiple=\"{{options.multiSelect}}\" \nng-model=\"selected\" md-progress=\"promise\"><thead ng-if=\"!options.decapitate\" md-head md-order=\"query.order\" \nmd-on-reorder=\"logOrder\"><tr md-row><th md-column md-order-by=\"name\"><span>Creed </span></th><th md-column \nmd-order-by=\"type\"><span>Definitions</span></th><th md-column md-order-by=\"type\"><span>Ratings</span></th></tr></thead>\n<tbody md-body><tr md-row md-select=\"user\" md-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" \nng-repeat=\"philosophy in vm.foundingPhilosophy\"><td md-cell>{{philosophy.name}}</td><td md-cell>\n{{philosophy.definition}}</td><td md-cell><md-radio-group layout=\"row\" layout-align=\"start center\" \nng-checked=\"vm.collectionTypeChanged()\" ng-model=\"philosophy.rating\"><md-radio-button value=\"4\">4</md-radio-button>\n<md-radio-button value=\"3\">3</md-radio-button><md-radio-button value=\"2\">2</md-radio-button><md-radio-button value=\"1\">\n1</md-radio-button></md-radio-group></td></tr></tbody></table></md-table-container></li><li><div \nclass=\"about-section-text\"><p>\nList below key achievement / client feedback on your performance in relation to the founding philosophy (List the projects, Name of feedback provider (Client), brief description of your contribution)\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea ng-model=\"vm.feedBack\" \nmd-select-on-focus></textarea></md-input-container></div></li></ol></form></md-tab-body></md-tab><md-tab><md-tab-label>\n<span class=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" \nng-if=\"wizardStep5.$invalid\">5</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep5.$valid\">\n<i class=\"icon-check s16\"></i> </span><span class=\"ms-form-wizard-step-text\">Step 5</span></span></md-tab-label>\n<md-tab-body><form name=\"wizardStep5\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" \nlayout-align=\"center\"><h3><md-icon md-font-icon=\"icon-content-paste\"></md-icon>Overall Assessment</h3></md-card><div \nclass=\"about-section-text\"><p>Overall Performance Rating definition (Tick where appropriate)</p></div><div \nclass=\"overall\"><span>\n5 = Exceeds Expectations: Demonstrates this Performance Factor consistently above and beyond expectations</span><br>\n<span>\n4 = Meets Expectations: Effectively demonstrates the Performance Factor, all of the time, in all situations, consistently in line with expectations.\n</span><br><span>\n3 = Partially Meets Expectations: Effectively demonstrates the Performance Factor in many, but not all situations, and/or some improvement is .\n</span><br><span>\n2 = Does Not Meet Expectations: Has difficulty demonstrating this Performance Factor; significant improvement is . \n</span><br><span>\n1 = No Basis: had little opportunity to demonstrate this Performance Factor during the assessment period. </span><br>\n<span>\nN/A = Individual has not been in position long enough (at least three (3) months) to fully demonstrate the competencies for the position. This appraisal is provided for feedback purposes.\n</span><br></div><div layout=\"row\" layout-gt-xs=\"row\" class=\"page\" flex layout-align=\"space-around center\"><md-card \nclass=\"default header\" layout=\"column\" flex layout-align=\"center\"><md-radio-group layout=\"row\" \nng-checked=\"vm.collectionTypeChanged()\" ng-model=\"vm.assessment.overall\"><div flex=\"20\"><label>5</label>\n<md-radio-button value=\"5\"></md-radio-button></div><div flex=\"20\"><label>4</label><md-radio-button value=\"4\">\n</md-radio-button></div><div flex=\"20\"><label>3</label><md-radio-button value=\"3\"></md-radio-button></div><div \nflex=\"20\"><label>2</label><md-radio-button value=\"2\"></md-radio-button></div><div flex=\"20\"><label>1</label>\n<md-radio-button value=\"1\"></md-radio-button></div><div flex=\"20\"><label>N/A</label><md-radio-button value=\"0\">\n</md-radio-button></div></md-radio-group></md-card></div></form></md-tab-body></md-tab><md-tab><md-tab-label><span \nclass=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep6.$invalid\">6\n</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep6.$valid\"><i class=\"icon-check s16\"></i>\n </span><span class=\"ms-form-wizard-step-text\">Step 6</span></span></md-tab-label><md-tab-body id=\"supplier-register\" \nclass=\"page\"><form name=\"wizardStep6\" class=\"md-inline-form\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" \nlayout=\"column\" layout-align=\"center\"><h3><md-icon md-font-icon=\"icon-content-paste\"></md-icon>Development Plan</h3>\n</md-card><div class=\"about-section-text\"><p>\nDirections: Identify the areas where you would like to develop (either in terms of your knowledge, skills or performance) – this may relate to either your current position, or a future position (or both). Then describe what specific actions you will take to develop in that area. Finally indicate when you plan to complete this activity.\n</p></div><fieldset><legend>Performance Enhancement (Current Position)</legend><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\"><span class=\"\">*</span> Competences:</label></div><md-input-container class=\"tiredinput\" flex=\"70\">\n<label></label><textarea md-no-asterisk type=\"text\" ng-model=\"vm.currentPosition.competences\"></textarea>\n</md-input-container></div><div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Actions:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"70\"><label></label><textarea md-no-asterisk type=\"text\" \nng-model=\"vm.currentPosition.actions\"></textarea></md-input-container></div><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\">Due Date:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label><input \nmd-no-asterisk type=\"date\" name=\"dateOfBirth\" ng-model=\"vm.currentPosition.dueDate\"></md-input-container></div>\n</fieldset><fieldset><legend>Career Development (Future Positions)</legend><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\"><span class=\"\">*</span> Competences:</label></div><md-input-container class=\"tiredinput\" flex=\"70\">\n<label></label><textarea md-no-asterisk type=\"text\" ng-model=\"vm.futurePosition.competences\"></textarea>\n</md-input-container></div><div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Actions:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"70\"><label></label><textarea md-no-asterisk type=\"text\" \nng-model=\"vm.futurePosition.actions\"></textarea></md-input-container></div><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\">Due Date:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label><input \nmd-no-asterisk type=\"date\" name=\"dateOfBirth\" ng-model=\"vm.futurePosition.dueDate\"></md-input-container></div>\n</fieldset></form></md-tab-body></md-tab></md-tabs><div class=\"navigation\" flex layout=\"row\" \nlayout-align=\"center center\"><md-button class=\"md-raised md-accent\" ng-click=\"msWizard.previousStep()\" \nng-disabled=\"msWizard.isFirstStep()\">Previous</md-button><div class=\"steps\"><span ng-repeat=\"form in msWizard.forms\" \nng-class=\"{\'selected md-accent-bg\':msWizard.selectedIndex === $index}\"></span></div><md-button \nclass=\"md-raised md-accent\" ng-click=\"msWizard.nextStep()\" ng-hide=\"msWizard.isLastStep()\" \nng-disabled=\"msWizard.currentStepInvalid()\">Next</md-button><md-button class=\"md-raised md-warn\" \nng-click=\"vm.sendForm(); msWizard.resetForm();\" ng-show=\"msWizard.isLastStep()\" \nng-disabled=\"msWizard.formsIncomplete()\">Send</md-button></div></ms-form-wizard></div>");
$templateCache.put("app/main/apps/settings/login/login.html","<md-progress-linear class=\"overlay\" ng-show=\"processingRequest\" md-mode=\"indeterminate\" ng-value=\"please\">\n</md-progress-linear><div id=\"login-v2\" layout=\"row\" layout-align=\"start\"><div id=\"login-v2-intro\" flex hide \nshow-gt-sm><div class=\"title\"><img src=\"./assets/images/logos/logo-white.png\"></div></div><div \nng-show=\"processingRequest\" id=\"image-loading\"><div class=\"center\"><center><img \nsrc=\"./assets/images/logos/logo-white.png\"></center><div class=\"spinner-wrapper\"><div class=\"spinner\"><div \nclass=\"inner\"><div class=\"gap\"></div><div class=\"left\"><div class=\"half-circle\"></div></div><div class=\"right\"><div \nclass=\"half-circle\"></div></div></div></div></div></div></div><div id=\"login-v2-form-wrapper\" \nclass=\"flex-scrollable md-whiteframe-8dp\" ms-scroll><div id=\"login-v2-form\"><div class=\"logo md-accent-bg\" hide-gt-sm>\n<span><img src=\"./assets/images/logos/logo-white.png\"></span></div><div class=\"title\" translate=\"LOGIN_V2.TITLE\"></div>\n<form name=\"loginForm\" novalidate><md-input-container class=\"md-block\" md-no-float><input type=\"text\" \nng-model=\"vm.username\" translate translate-attr-placeholder=\"LOGIN_V2.USERNAME\" autocomplete=\"off\" required>\n</md-input-container><md-input-container class=\"md-block\" md-no-float><input type=\"password\" ng-model=\"vm.password\" \ntranslate translate-attr-placeholder=\"LOGIN_V2.PASSWORD\" required></md-input-container><md-button \nclass=\"md-raised md-accent submit-button\" type=\"submit\" aria-label=\"LOG IN\" ng-readonly=\"processingRequest\" \nng-disabled=\"processingRequest|| loginForm.$invalid || loginForm.$pristine\" ng-click=\"vm.login()\" \ntranslate=\"LOGIN_V2.LOG_IN\" translate-attr-aria-label=\"LOGIN_V2.LOG_IN\"></md-button><md-button ng-show=\"false\" \ntranslate=\"LOGIN_V2.CLEAR_STORAGE\" class=\"md-raised md-accent submit-button\" aria-label=\"LOG IN\" ng-click=\"vm.clear()\">\n</md-button></form></div></div></div>");
$templateCache.put("app/main/apps/settings/passwordchange/passwordchange.html","<div layout=\"row\" id=\"passwordChange\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card \nclass=\"default header\" layout=\"column\" layout-align=\"center left\"><h3><md-icon md-font-icon=\"icon-content-paste\">\n</md-icon></h3></md-card><md-content class=\"body\" layout=\"column\" flex layout-padding layout-margin ms-scroll><form \nnovalidate name=\"passwordChange\"><fieldset><div layout=\"row\"><div flex=\"15\"><label class=\"label\">Current Password:\n</label></div><md-input-container flex=\"15\"><label></label><input md-no-asterisk type=\"text\" type=\"password\" \nname=\"oldpassword\" ng-model=\"vm.passwordChange.OldPassword\" required></md-input-container><div flex=\"20\"><label \nclass=\"label\">New Password:</label></div><md-input-container flex=\"15\"><label></label><input md-no-asterisk \ntype=\"password\" name=\"password\" ng-model=\"vm.passwordChange.Password\" required></md-input-container><div flex=\"20\">\n<label class=\"label\">Confirm Password:</label></div><md-input-container flex=\"15\"><label></label><input md-no-asterisk \ntype=\"password\" name=\"password_confirmation\" confirm-pwd=\"vm.passwordChange.Password\" \nng-model=\"vm.passwordChange.ConfirmPassword\" required><div class=\"form-errors\" \nng-messages=\"passwordChange.password_confirmation.$error\" ng-if=\"passwordChange.password_confirmation.$touched\"><span \nclass=\"form-error\" ng-message=\"password\">Password does not match</span></div></md-input-container><md-button \nclass=\"md-raised md-accent\" ng-disabled=\"passwordChange.$invalid || passwordChange.$pristine\" \nng-click=\"vm.changePassword()\" flex=\"10\">Add</md-button></div></fieldset></form></md-content></div></div>");
$templateCache.put("app/main/apps/settings/register/register.html","<div id=\"register-v2\" layout=\"row\" layout-align=\"start\"><div id=\"register-v2-intro\" flex hide show-gt-sm><div \nclass=\"title\"><img src=\"./assets/images/logos/logo-white.png\"></div></div><div id=\"register-v2-form-wrapper\" \nclass=\"flex-scrollable md-whiteframe-8dp\" layout=\"column\" flex ms-scroll><div id=\"register-v2-form\"><div \nclass=\"logo md-accent-bg\" hide-gt-sm><span>F</span></div><div class=\"title\" translate=\"REGISTER_V2.TITLE\"></div><form \nname=\"registerForm\" novalidate ng-submit=\"vm.registerUser()\"><md-input-container class=\"md-block\" md-no-float><input \nname=\"username\" ng-model=\"vm.form.firstname\" placeholder=\"First Name\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.FIRSTNAME\" required><div ng-messages=\"registerForm.username.$error\" \nrole=\"alert\"><div ng-message=\"required\"><span translate=\"REGISTER_V2.ERRORS.FIRSTNAME_REQUIRED\">\nFirst name field is required</span></div></div></md-input-container><md-input-container class=\"md-block\" md-no-float>\n<input name=\"username\" ng-model=\"vm.form.lastname\" placeholder=\"Last Name\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.LASTNAME\" required><div ng-messages=\"registerForm.username.$error\" \nrole=\"alert\"><div ng-message=\"required\"><span translate=\"REGISTER_V2.ERRORS.LASTNAME_REQUIRED\">\nLast name field is required</span></div></div></md-input-container><md-input-container class=\"md-block\" md-no-float>\n<input type=\"email\" name=\"email\" ng-model=\"vm.form.email\" placeholder=\"Email\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.EMAIL\" ng-pattern=\"/^.+@.+\\..+$/\" required><div \nng-messages=\"registerForm.email.$error\" role=\"alert\" multiple=\"multiple\"><div ng-message=\"required\"><span \ntranslate=\"REGISTER_V2.ERRORS.EMAIL_REQUIRED\">Email field is required</span></div><div ng-message=\"pattern\"><span \ntranslate=\"REGISTER_V2.ERRORS.EMAIL_MUST_VALID\">Email must be a valid e-mail address</span></div></div>\n</md-input-container><md-input-container class=\"md-block\" md-no-float><input type=\"password\" name=\"password\" \nng-model=\"vm.form.password\" placeholder=\"Password\" translate translate-attr-placeholder=\"REGISTER_V2.PASSWORD\" \nrequired><div ng-messages=\"registerForm.password.$error\" role=\"alert\"><div ng-message=\"required\"><span \ntranslate=\"REGISTER_V2.ERRORS.PASSWORD_REQUIRED\">Password field is required</span></div></div></md-input-container>\n<md-input-container class=\"md-block\" md-no-float><input type=\"password\" name=\"passwordConfirm\" \nng-model=\"vm.form.passwordConfirm\" placeholder=\"Password (Confirm)\" confirm-pwd=\"vm.form.password\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.PASSWORD_CONFIRM\" required><div \nng-messages=\"registerForm.passwordConfirm.$error\" role=\"alert\"><div ng-message=\"required\"><span \ntranslate=\"REGISTER_V2.ERRORS.PASSWORD_CONFIRM_REQUIRED\">Password (Confirm) field is required</span></div></div><div \nclass=\"form-errors\" ng-messages=\"registerForm.passwordConfirm.$error\" ng-if=\"registerForm.passwordConfirm.$touched\">\n<span class=\"form-error\" ng-message=\"password\">Password does not match</span></div></md-input-container><div \nclass=\"terms\" layout=\"row\" layout-align=\"center center\"><md-checkbox name=\"terms\" ng-model=\"data.cb1\" \naria-label=\"I read and accept\" required></md-checkbox><div layout=\"row\" layout-sm=\"column\" layout-align=\"start center\">\n<span translate=\"REGISTER_V2.READ_ACCEPT\">I read and accept</span> <a href=\"#\" class=\"md-accent-color\" \ntranslate=\"REGISTER_V2.TERMS_COND\">terms and conditions</a></div></div><md-button type=\"submit\" \nclass=\"md-raised md-accent submit-button\" aria-label=\"CREATE MY ACCOUNT\" \nng-disabled=\"registerForm.$invalid || registerForm.$pristine\" translate=\"REGISTER_V2.CREATE_ACCOUNT\" \ntranslate-attr-aria-label=\"REGISTER_V2.CREATE_ACCOUNT\">CREATE MY ACCOUNT</md-button></form><div class=\"login\" \nlayout=\"row\" layout-sm=\"column\" layout-align=\"center center\"><span class=\"text\" translate=\"REGISTER_V2.ALREADY_HAVE\">\nAlready have an account?</span> <a class=\"link\" ui-sref=\"app.pages_auth_login-v2\" translate=\"REGISTER_V2.LOGIN\">Log in\n</a></div></div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-1/template-1.html","<div class=\"template-1\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" \nng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}\n</div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-2/template-2.html","<div class=\"template-2\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img\n class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div \nclass=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">\n{{card.subtitle}}</div></div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"text p-16\" ng-if=\"card.text\">{{card.text}}\n</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-10/template-10.html","<div class=\"template-10 p-16\"><div class=\"pb-16\" layout=\"row\" layout-align=\"space-between center\"><div class=\"info\">\n<div class=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h2\" \nng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"media ml-16\"><img class=\"image\" \nng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div><div \nclass=\"text\">{{card.text}}</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-3/template-3.html","<div class=\"template-3 p-16 teal-bg white-fg\" layout=\"row\" layout-align=\"space-between\"><div layout=\"column\" \nlayout-align=\"space-between\"><div class=\"info\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div \nclass=\"subtitle h3 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"cta\"><md-button \nclass=\"m-0\">{{card.cta}}</md-button></div></div><div class=\"media pl-16\"><img class=\"image\" \nng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-4/template-4.html","<div class=\"template-4\"><div class=\"info white-fg ph-16 pv-24\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}\n</div><div class=\"text\" ng-if=\"card.text\">{{card.text}}</div></div><div class=\"media\"><img class=\"image\" \nng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-6/template-6.html","<div class=\"template-6\"><div class=\"content pv-24 ph-16\"><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">\n{{card.subtitle}}</div><div class=\"title h2\" ng-if=\"card.title\">{{card.title}}</div><div class=\"text pt-8\" \nng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-7/template-7.html","<div class=\"template-7\" layout=\"row\" layout-align=\"space-between\"><div class=\"info\" layout=\"column\" \nlayout-align=\"space-between\" layout-fill flex><div class=\"p-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}\n</div><div class=\"subtitle h4 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"text h4 pt-8\" \nng-if=\"card.text\">{{card.text}}</div></div><div><md-divider></md-divider><div class=\"p-8\" layout=\"row\"><md-icon \nmd-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\">\n</md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" \nclass=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon></div></div></div><div \nclass=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" \nng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-8/template-8.html","<div class=\"template-8\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" \nng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}\n</div><div class=\"buttons pt-16\"><md-button class=\"m-0\">{{card.button1}}</md-button><md-button class=\"m-0 md-accent\">\n{{card.button2}}</md-button></div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-9/template-9.html","<div class=\"template-9\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img\n class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div \nclass=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">\n{{card.subtitle}}</div></div></div><div class=\"text ph-16 pb-16\" ng-if=\"card.text\">{{card.text}}</div><div \nclass=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" \nng-show=\"card.media.image\"></div><div class=\"buttons m-8\"><md-button class=\"md-icon-button mr-16\" \naria-label=\"Favorite\"><md-icon md-font-icon=\"icon-heart-outline\" class=\"s24\"></md-icon></md-button><md-button \nclass=\"md-icon-button\" aria-label=\"Share\"><md-icon md-font-icon=\"icon-share\" class=\"s24\"></md-icon></md-button></div>\n</div>");
$templateCache.put("app/core/directives/ms-stepper/templates/horizontal/horizontal.html","<div class=\"ms-stepper-horizontal\"><div class=\"ms-stepper-navigation-wrapper\"><div class=\"ms-stepper-navigation\" \nlayout=\"row\" layout-align=\"center center\"><md-button class=\"ms-stepper-navigation-item\" \nng-class=\"{\'current\': MsStepper.isStepCurrent(step.stepNumber), \'valid\': MsStepper.isStepValid(step.stepNumber), \'disabled\': MsStepper.isStepDisabled(step.stepNumber), \'optional\': MsStepper.isStepOptional(step.stepNumber)}\" \nng-click=\"MsStepper.gotoStep(step.stepNumber)\" ng-disabled=\"MsStepper.isStepDisabled(step.stepNumber)\" \nng-repeat=\"step in MsStepper.steps\" layout=\"row\" layout-align=\"start center\"><div class=\"step md-accent-bg\" \nlayout=\"row\" layout-align=\"center center\"><span \nng-if=\"!MsStepper.isStepValid(step.stepNumber) || MsStepper.isStepOptional(step.stepNumber)\">{{step.stepNumber}} \n</span><span ng-if=\"MsStepper.isStepValid(step.stepNumber) && !MsStepper.isStepOptional(step.stepNumber)\"><i \nclass=\"icon icon-check s18\"></i></span></div><div layout=\"column\" layout-align=\"start start\"><div class=\"title\">\n{{step.stepTitle|translate}}</div><div class=\"subtitle\" ng-if=\"MsStepper.isStepOptional(step.stepNumber)\">Optional\n</div></div></md-button></div></div><div class=\"ms-stepper-steps\" ng-transclude></div><div class=\"ms-stepper-controls\" \nlayout=\"row\" layout-align=\"center center\"><md-button class=\"md-accent md-raised\" ng-disabled=\"MsStepper.isFirstStep()\" \nng-click=\"MsStepper.gotoPreviousStep()\">Back</md-button><div class=\"ms-stepper-dots\"><span \nng-repeat=\"step in MsStepper.steps\" ng-class=\"{\'selected md-accent-bg\':MsStepper.currentStepNumber === $index + 1}\">\n</span></div><md-button class=\"md-accent md-raised\" ng-if=\"!MsStepper.isLastStep()\" \nng-disabled=\"!MsStepper.isStepValid(MsStepper.currentStepNumber)\" ng-click=\"MsStepper.gotoNextStep()\">Next</md-button>\n<md-button type=\"submit\" class=\"md-accent md-raised\" ng-click=\"MsStepper.resetForm()\" ng-if=\"MsStepper.isLastStep()\" \nng-disabled=\"!MsStepper.isFormValid()\">Submit</md-button></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-5/template-5.html","<div class=\"template-5 p-16\" layout=\"row\" layout-align=\"space-between start\"><div class=\"info\"><div \nclass=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"event h2\" ng-if=\"card.event\">\n{{card.event}}</div></div><div class=\"media ml-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/main/apps/appraisals/manageappraisal/dialogs/declineappraisal/declineappraisal.html","<md-dialog class=\"compose-dialog\" aria-label=\"New Message\"><form class=\"md-inline-form\"><md-toolbar \nclass=\"md-accent md-hue-2\"><div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><span \nclass=\"title\" translate=\"MAIL.NEW_MESSAGE\">New Message</span><md-button class=\"md-icon-button\" \nng-click=\"vm.closeDialog()\" aria-label=\"Close dialog\" tranlate translate-aria-label=\"MAIL.CLOSE_DIALOG\"><md-icon \nmd-font-icon=\"icon-close\"></md-icon></md-button></div></md-toolbar><md-dialog-content ms-scroll><md-input-container \nclass=\"md-block\"><label translate=\"MAIL.FROM\">From</label><input ng-model=\"vm.form.from\" type=\"email\" \ndisabled=\"disabled\"></md-input-container><md-input-container class=\"md-block to\" \nng-class=\"{\'hidden-cc\': vm.hiddenCC, \'hidden-bcc\': vm.hiddenBCC}\"><label translate=\"MAIL.TO\">To</label><input \nng-model=\"vm.form.to\" type=\"email\"><div class=\"cc-bcc\" layout=\"row\" layout-align=\"start center\"><div class=\"show-cc\" \nng-show=\"vm.hiddenCC\" ng-click=\"vm.hiddenCC = false\">CC</div><div class=\"show-bcc\" ng-show=\"vm.hiddenBCC\" \nng-click=\"vm.hiddenBCC = false\">BCC</div></div></md-input-container><md-input-container class=\"md-block\" \nng-hide=\"vm.hiddenCC\"><label translate=\"MAIL.CC\">Cc</label><input ng-model=\"vm.form.cc\" type=\"email\">\n</md-input-container><md-input-container class=\"md-block\" ng-hide=\"vm.hiddenBCC\"><label translate=\"MAIL.BCC\">Bcc\n</label><input ng-model=\"vm.form.bcc\" type=\"t\"></md-input-container><md-input-container class=\"md-block\"><label \ntranslate=\"MAIL.SUBJECT\">Subject</label><input ng-model=\"vm.form.subject\" type=\"text\"></md-input-container>\n<text-angular ng-model=\"vm.form.message\"></text-angular><div class=\"attachment-list\"><div class=\"attachment\" \nlayout=\"row\" layout-align=\"space-between center\"><div><span class=\"filename\">attachment-2.doc</span> <span \nclass=\"size\">(12 Kb)</span></div><md-button class=\"md-icon-button\" aria-label=\"Delete attachment\" translate \ntranslate-attr-aria-label=\"MAIL.DELETE_ATTACHMENT\"><md-icon md-font-icon=\"icon-close\" class=\"s16\"></md-icon>\n</md-button></div><div class=\"attachment\" layout=\"row\" layout-align=\"space-between center\"><div><span class=\"filename\">\nattachment-1.jpg</span> <span class=\"size\">(350 Kb)</span></div><md-button class=\"md-icon-button\" \naria-label=\"Delete attachment\" translate translate-attr-aria-label=\"MAIL.DELETE_ATTACHMENT\"><md-icon \nmd-font-icon=\"icon-close\" class=\"s16\"></md-icon></md-button></div></div></md-dialog-content><md-dialog-actions \nlayout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><md-button \nng-click=\"vm.closeDialog()\" class=\"send-button md-accent md-raised\" aria-label=\"Send\" translate=\"MAIL.SEND\" \ntranslate-attr-aria-label=\"MAIL.SEND\">SEND</md-button><md-button class=\"md-icon-button\" aria-label=\"Attach file\" \ntranslate-attr-aria-label=\"MAIL.ATTACH_FILE\"><md-icon md-font-icon=\"icon-paperclip\"></md-icon><md-tooltip><span \ntranslate=\"MAIL.ATTACH_FILE\"></span></md-tooltip></md-button></div><div layout=\"row\"><md-button class=\"md-icon-button\" \naria-label=\"Delete\" translate-attr-aria-label=\"MAIL.DELETE\"><md-icon md-font-icon=\"icon-delete\"></md-icon><md-tooltip>\n<span translate=\"MAIL.DELETE\"></span></md-tooltip></md-button></div></md-dialog-actions></form></md-dialog>");
$templateCache.put("app/main/apps/appraisals/manageappraisal/dialogs/acceptappraisal/acceptappraisal.html","<md-dialog class=\"compose-dialog\" aria-label=\"New Message\"><form class=\"md-inline-form\"><md-toolbar \nclass=\"md-accent md-hue-2\"><div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><span \nclass=\"title\" translate=\"MAIL.NEW_MESSAGE\">New Message</span><md-button class=\"md-icon-button\" \nng-click=\"vm.closeDialog()\" aria-label=\"Close dialog\" tranlate translate-aria-label=\"MAIL.CLOSE_DIALOG\"><md-icon \nmd-font-icon=\"icon-close\"></md-icon></md-button></div></md-toolbar><md-dialog-content ms-scroll><md-input-container \nclass=\"md-block\"><label translate=\"MAIL.FROM\">From</label><input ng-model=\"vm.form.from\" type=\"email\" \ndisabled=\"disabled\"></md-input-container><md-input-container class=\"md-block to\" \nng-class=\"{\'hidden-cc\': vm.hiddenCC, \'hidden-bcc\': vm.hiddenBCC}\"><label translate=\"MAIL.TO\">To</label><input \nng-model=\"vm.form.to\" type=\"email\"><div class=\"cc-bcc\" layout=\"row\" layout-align=\"start center\"><div class=\"show-cc\" \nng-show=\"vm.hiddenCC\" ng-click=\"vm.hiddenCC = false\">CC</div><div class=\"show-bcc\" ng-show=\"vm.hiddenBCC\" \nng-click=\"vm.hiddenBCC = false\">BCC</div></div></md-input-container><md-input-container class=\"md-block\" \nng-hide=\"vm.hiddenCC\"><label translate=\"MAIL.CC\">Cc</label><input ng-model=\"vm.form.cc\" type=\"email\">\n</md-input-container><md-input-container class=\"md-block\" ng-hide=\"vm.hiddenBCC\"><label translate=\"MAIL.BCC\">Bcc\n</label><input ng-model=\"vm.form.bcc\" type=\"t\"></md-input-container><md-input-container class=\"md-block\"><label \ntranslate=\"MAIL.SUBJECT\">Subject</label><input ng-model=\"vm.form.subject\" type=\"text\"></md-input-container>\n<text-angular ng-model=\"vm.form.message\"></text-angular><div class=\"attachment-list\"><div class=\"attachment\" \nlayout=\"row\" layout-align=\"space-between center\"><div><span class=\"filename\">attachment-2.doc</span> <span \nclass=\"size\">(12 Kb)</span></div><md-button class=\"md-icon-button\" aria-label=\"Delete attachment\" translate \ntranslate-attr-aria-label=\"MAIL.DELETE_ATTACHMENT\"><md-icon md-font-icon=\"icon-close\" class=\"s16\"></md-icon>\n</md-button></div><div class=\"attachment\" layout=\"row\" layout-align=\"space-between center\"><div><span class=\"filename\">\nattachment-1.jpg</span> <span class=\"size\">(350 Kb)</span></div><md-button class=\"md-icon-button\" \naria-label=\"Delete attachment\" translate translate-attr-aria-label=\"MAIL.DELETE_ATTACHMENT\"><md-icon \nmd-font-icon=\"icon-close\" class=\"s16\"></md-icon></md-button></div></div></md-dialog-content><md-dialog-actions \nlayout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><md-button \nng-click=\"vm.closeDialog()\" class=\"send-button md-accent md-raised\" aria-label=\"Send\" translate=\"MAIL.SEND\" \ntranslate-attr-aria-label=\"MAIL.SEND\">SEND</md-button><md-button class=\"md-icon-button\" aria-label=\"Attach file\" \ntranslate-attr-aria-label=\"MAIL.ATTACH_FILE\"><md-icon md-font-icon=\"icon-paperclip\"></md-icon><md-tooltip><span \ntranslate=\"MAIL.ATTACH_FILE\"></span></md-tooltip></md-button></div><div layout=\"row\"><md-button class=\"md-icon-button\" \naria-label=\"Delete\" translate-attr-aria-label=\"MAIL.DELETE\"><md-icon md-font-icon=\"icon-delete\"></md-icon><md-tooltip>\n<span translate=\"MAIL.DELETE\"></span></md-tooltip></md-button></div></md-dialog-actions></form></md-dialog>");}]);
//# sourceMappingURL=../maps/scripts/app-60531d2271.js.map
