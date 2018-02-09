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
              if(response.data.roles=='USER'||response.data.roles=='LINE_MANAGER'){
                msNavigationService.deleteItem('settings');
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

(function(){
  'use strict';

      config.$inject = ["$stateProvider"];
  angular.module('app.settings.employeelist',[])
      .config(config);

      function config($stateProvider){
          $stateProvider.state('app.employeelist',{
              url:'/employeelist',
              data:{
                  name:'Employee List',
                  roles: ['SUPER_ADMIN', 'TOP_MANAGER','HR']
              },
              views:{
                'content@app':{
                    templateUrl:'app/main/apps/settings/employeelist/employeelist.html',
                    controller:'EmployeeListController as vm'
                }
              }
          });
      }
})();

(function(){
  'use strict';

  angular.module('app.settings.employeelist').
      controller('EmployeeListController',["AppConstants", "$http", "$scope", "$rootScope", "UtilityService", "$mdDialog", function(AppConstants,$http,$scope,$rootScope,UtilityService,$mdDialog){
        var vm = this;

        vm.uploadTemlate = function(){

          $rootScope.processingRequest = true;

          $http.post(AppConstants.baseApiUrl+'users/upload',$rootScope.employeeList).then(function(response){
            $rootScope.employeeList = null;
            if (response.data.length > 0) {

              var parentEl = angular.element(document.querySelector('md-content'));

              alert = $mdDialog.alert({
                  parent: parentEl,
                  //  targetEvent: $event,
                  template: '<md-dialog aria-label="Sample Dialog">' +
                  '  <md-content>' +
                  '    <md-list>' +
                  '      <md-item ng-repeat="item in ctrl.items track by $index">' +
                  '       <p>{{$index+1 +": "+item.comment+" (" + item.email+")"}}</p>' +
                  '      </md-item>' +
                  '    </md-list>' +
                  '  </md-content>' +
                  '  <div class="md-actions">' +
                  '    <md-button ng-click="ctrl.closeDialog()">' +
                  '      Ok Got it.' +
                  '    </md-button>' +
                  '  </div>' +
                  '</md-dialog>',
                  locals: {

                      items: response.data,
                      closeDialog: $scope.closeDialog
                  },
                  bindToController: true,
                  controllerAs: 'ctrl',
                  controller: 'ErrorDialogController'
              }).title("Incomplete/Incorrect Entry");

              $mdDialog
                  .show(alert)
                  .finally(function () {
                      alert = undefined;
                  });
                  $rootScope.processingRequest = false;
              //alert(status);

          }
          else{
            $rootScope.processingRequest = false;
            UtilityService.showAlert('success!','list uploaded sucessfully','Alert Dialog');
          }
          },function(){
            $rootScope.processingRequest = false;
            $rootScope.employeeList = null;
          });
        };

        $scope.closeDialog = function() {
          $mdDialog.cancel();
      };

        vm.templateData = [{
          firstname: '',
          lastname: '',
          email: '',
          lob: '',
          role: ''
      }];

      vm.downloadTemlate = function() {
        UtilityService.exportToExcel('employeelisttemplate', vm.templateData);
      };
    }]).controller('ErrorDialogController',function(){

    });
})();

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
                  roles: ['ADMIN','USER', 'SUPER_ADMIN', 'LINE_MANAGER']
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
              debugger;
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

  config.$inject = ["$stateProvider", "$translatePartialLoaderProvider"];
  angular.module("app.appraisals.manageappraisal", []).config(config)

  function config($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider.state("app.manageappraisal", {
      url: "/manageappraisal",
      data: {
        name: "Manage Appraisal",
        roles: ['ADMIN', 'SUPER_ADMIN', 'LINE_MANAGER', 'TOP_MANAGER','HR']
      },
      views: {
        "content@app": {
          templateUrl:
            "app/main/apps/appraisals/manageappraisal/manageappraisal.html",
          controller: "ManageAppraisalController as vm"
        }
      }
    });

    $translatePartialLoaderProvider.addPart("app/main/apps/appraisals/manageappraisal");
  }
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
      $scope.employees = [];
      vm.loggedInUser = localStorage.getItem('loggedInUser');
      if(vm.loggedInUser!=undefined||vm.loggedInUser!='undefined'){
        vm.loggedInUser = JSON.parse(vm.loggedInUser);
      }

      function getPendingAppraisals(){
        $rootScope.processingRequest = true;
        $http
        .get(AppConstants.baseApiUrl + "appraisal/sub")
        .then(function(response) {
          $rootScope.processingRequest = false;
          $scope.users = response.data;
        },function(){
          $rootScope.processingRequest = false;
          UtilityService.showAlert('error occured!','error occured','Alert Dialog');
        });
      }

      function getReviewdList(){
        $rootScope.processingRequest = true;
        $http
        .get(AppConstants.baseApiUrl + "appraisal/rev")
        .then(function(response) {
          $rootScope.processingRequest = false;
          $scope.users = response.data;
        },function(){
          $rootScope.processingRequest = false;
          UtilityService.showAlert('error occured!','error occured','Alert Dialog');
        });
      }

      function getApprovedList(){
        $http
        .get(AppConstants.baseApiUrl + "appraisal/apv")
        .then(function(response) {
          $rootScope.processingRequest = false;
          $scope.users = response.data;
        },function(){
          $rootScope.processingRequest = false;
          UtilityService.showAlert('error occured!','error occured','Alert Dialog');
        });
      }

      function getRejectedList(){
        $http
        .get(AppConstants.baseApiUrl + "appraisal/rej")
        .then(function(response) {
          $rootScope.processingRequest = false;
          $scope.users = response.data;
        },function(){
          $rootScope.processingRequest = false;
          UtilityService.showAlert('error occured!','error occured','Alert Dialog');
        });
      }

      vm.appraisalStatusChanged = function(status){
        console.log('radio button changed');
        if(status=='pending'){
          getPendingAppraisals();
        }
        if(status=='approved'){
          getApprovedList();
        }
        if(status=='reviewed'){
          getReviewdList();
        }
        if(status=='rejected'){
          getRejectedList();
        }
      };

      if(vm.loggedInUser.roles=='LINE_MANAGER'){
        getPendingAppraisals();
        vm.status = 'pending';
      }



      else if((vm.loggedInUser.roles!='USER'||vm.loggedInUser.roles!='HR')&&vm.status=='reviewd'){

        if(vm.status=='approved'){

        }
        else if(vm.status=='rejected'){

        }
        else if(vm.status == 'reviewed'){

        }
      }


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
      $scope.lineManagerComment = dialogData.lineManagerComment;
      $rootScope.processingRequest = false;

      $scope.loggedInUser = localStorage.getItem('loggedInUser');
      if($scope.loggedInUser!=undefined||$scope.loggedInUser!='undefined'){
        $scope.loggedInUser = JSON.parse($scope.loggedInUser);
      }

      $scope.cancel = function(){
        $mdDialog.cancel();
      };

      $scope.submitReveiw = function(status){
        $scope.processingReveiw = true;
        $scope.review.action = status;

        if($scope.loggedInUser.roles=='LINE_MANAGER'){
          $http.post(AppConstants.baseApiUrl+"appraisal/"+$scope.user.id+"/appraise",$scope.review).then(function(){
            $$scope.processingReveiw = false;

            UtilityService.showAlert('success!','Approval submitted successfully','Alert Dialog');
          },function(){
            $$scope.processingReveiw = false;
            UtilityService.showAlert('error occured!','error occured','Alert Dialog');

          });
        }
        else if($scope.loggedInUser.roles=='TOP_MANAGER'){
          $http.post(AppConstants.baseApiUrl+"appraisal/"+$scope.user.id+"/app_rej",$scope.review).then(function(){
            $$scope.processingReveiw = false;

            UtilityService.showAlert('success!','Final review submitted successfully','Alert Dialog');
          },function(){
            $$scope.processingReveiw = false;
            UtilityService.showAlert('error occured!','error occured','Alert Dialog');

          });
        }
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
              roles: ['ADMIN', 'SUPER_ADMIN', 'LINE_MANAGER', 'TOP_MANAGER','HR','USER']
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

    DashboardController.$inject = ["$http", "AppConstants", "$rootScope", "UtilityService"];
  angular
      .module('app.dashboard')
      .controller('DashboardController', DashboardController);

    function DashboardController($http,AppConstants,$rootScope,UtilityService){
      var vm = this;
      $rootScope.processingRequest = true;
      $http.get(AppConstants.baseApiUrl + 'users/loggedInUser').then(function(response){
        vm.user = response.data;
        $rootScope.processingRequest = false;
      },function(){
        $rootScope.processingRequest = false;
        UtilityService.showAlert('error occured!','error occured','Alert Dialog');
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

    ToolbarController.$inject = ["$rootScope", "$mdSidenav", "$location", "UtilityService", "$translate", "$cookieStore", "$mdToast", "$scope", "$state"];
    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $mdSidenav,$location,UtilityService, $translate,$cookieStore, $mdToast,$scope,$state)
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
            localStorage.removeItem('loggedInUser');
            $cookieStore.remove('loggedInUser');
            window.location.reload();
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
            'md.data.table',

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
            'lfNgMdFileInput'
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
      ResizeBase64Img:ResizeBase64Img,
      showDialog:showDialog,
      showAlert:showAlert,
      importFromExcel: importFromExcel,
      exportToExcel: exportToExcel
    };

    return service;

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

        function importFromExcel(event, filePath, funcName) {
          if (event.target.files.length == 0) {
              return false;
          }
          alasql('SELECT * FROM FILE(?,{headers:true})', [event], function (data) {
              $rootScope.employeeList = data;
          });
        }

        function exportToExcel(fileName, targetData) {

          if (!angular.isArray(targetData)) {
              $log.error('Can not export error type data to excel.');
              return;
          }

          alasql('SELECT * INTO XLSX("'+ fileName + '.xlsx",{headers:true}) FROM ?', [targetData],function (response) {

          });
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

    NavigationController.$inject = ["$scope", "$state", "$location", "$cookieStore"];
    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope,$state,$location,$cookieStore)
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
            //AuthenticationService.ClearCredentials();
            localStorage.removeItem('loggedInUser');
            $cookieStore.remove('loggedInUser');
            window.location.reload();
            $state.go('app.login');
            $location.path('/login');
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

          console.log('index run is called...');
          console.log($state);
          console.log(msNavigationService);
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState){
          console.log('change state fired...');
            // Activate loading indicator

            $rootScope.loadingProgress = true;
            // check if user is logged int(has valid token)
            var loggedInUser = $cookieStore.get('loggedInUser');
			var includes = false;
			if(toState.data.roles){
				includes = toState.data.roles.includes(loggedInUser.roles)
			}
            $rootScope.pageTitle = toState.data.name || "";
            if(loggedInUser==undefined&&toState.url!='/login'&&toState.url!='/register'){
              //if no valid token, send the idiot to the loggin page
              event.preventDefault();
              $location.path('/login');
              $state.go('app.login');
            }
            else if(toState.data.roles && !includes&&toState.url!='/dashboard'){
              event.preventDefault();
              $location.path('/dashboard');
              $state.go('app.dashboard');
            }
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function (){
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
      .module('fuse')
      .directive('draggable', function() {

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
      })
      .directive('confirmPwd', ["$interpolate", "$parse", function($interpolate, $parse) {
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
    }]).directive('importFromExcel', ["UtilityService", function(UtilityService) {
      var directive = {
          restrict: 'A',
          link: linkFunc
      };
      return directive;

      function linkFunc(scope, element) {
        element.change(function (event) {
          UtilityService.importFromExcel(event.originalEvent);
        });
      }
  }]);
})();

(function () {
    'use strict';

    IndexController.$inject = ["fuseTheming", "msNavigationService"];
    var isDlgOpen;

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,msNavigationService) {
        var vm = this;

        vm.themes = fuseTheming.themes;
        console.log('index controller is called...');

        vm.loggedInUser = localStorage.getItem('loggedInUser');
        if(vm.loggedInUser!=undefined||vm.loggedInUser!='undefined'){
          vm.loggedInUser = JSON.parse(vm.loggedInUser);
        }

        if (vm.loggedInUser&&vm.loggedInUser.roles!='USER'&&vm.loggedInUser.roles!='LINE_MANAGER'&&vm.loggedInUser.roles!='SUPER_ADMIN'  ) {
          msNavigationService.deleteItem('appraisals.newappraisal');
        }

        if(vm.loggedInUser&&vm.loggedInUser.roles=='USER'){
          msNavigationService.deleteItem('appraisals.manageappraisal');
        }
        if(vm.loggedInUser&&(vm.loggedInUser.roles=='USER'||vm.loggedInUser.roles=='LINE_MANAGER')){
          msNavigationService.deleteItem('settings');
        }
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

    config.$inject = ["$httpProvider", "$stateProvider"];
    angular
        .module('fuse')
        .config(config);
       // .config(exceptionConfig);

    /** @ngInject */
    function config($httpProvider,$stateProvider){
        // Put your custom configurations here
        console.log($stateProvider);
        console.log('index config is called...');
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
            'app.settings.register',
            'app.settings.employeelist'
        ])
        .config(config);

    function config(msNavigationServiceProvider) {
      var localitem = localStorage.getItem('loggedInUser');
      if(localitem!=undefined||localitem!='undefined'){
        localitem = JSON.parse(localitem);
      }
        msNavigationServiceProvider.saveItem('settings', {
            title: 'Settings',
            weight: 1,
            icon: 'icon-cog'
            // hidden:function(){
            //   return localitem.roles=='USER'||localitem.roles=='LINE_MANAGER';
            // }
        });

        msNavigationServiceProvider.saveItem("settings.employeelist", {
          title: "Employee List",
          state: "app.employeelist"
        });
    }
})();

(function() {
  "use strict";

  config.$inject = ["msNavigationServiceProvider"];
  angular
    .module("app.appraisals", [
      "app.appraisals.newappraisal",
      "app.appraisals.manageappraisal"
    ])
    .config(config);

  function config(msNavigationServiceProvider) {
    var localitem = localStorage.getItem('loggedInUser');
      if(localitem!=undefined||localitem!='undefined'){
        localitem = JSON.parse(localitem);
      }

    msNavigationServiceProvider.saveItem("appraisals", {
      title: "Appraisals",
      weight: 1,
      icon: "icon-cog"
    });

    msNavigationServiceProvider.saveItem("appraisals.newappraisal", {
      title: "New Appraisal",
      state: "app.newappraisal"
      // hidden:function(){
      //   return (localitem.roles!='USER' && localitem.roles!='LINE_MANAGER');
      // }
    });

    msNavigationServiceProvider.saveItem("appraisals.manageappraisal", {
      title: "Manage Appraisal",
      state: "app.manageappraisal"
      // hidden:function(){
      //   return localitem.roles=='USER';
      // }
    });
  }
})();

angular.module("fuse").run(["$templateCache", function($templateCache) {$templateCache.put("app/core/layouts/content-only.html","<div id=\"layout-content-only\" class=\"template-layout\" layout=\"column\" flex><md-content id=\"content\" \nclass=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex></md-content></div>");
$templateCache.put("app/core/layouts/content-with-toolbar.html","<div id=\"layout-content-with-toolbar\" class=\"template-layout\" layout=\"column\" flex><md-content id=\"content\" \nclass=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex></md-content></div>");
$templateCache.put("app/core/layouts/horizontal-navigation.html","<div id=\"layout-horizontal-navigation\" class=\"template-layout\" layout=\"column\" flex><div id=\"horizontal-navigation\" \nclass=\"md-whiteframe-1dp\" ui-view=\"navigation\"></div><div id=\"content-container\" flex layout=\"column\"><md-content \nid=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll ui-view=\"content\" flex></md-content></div></div>");
$templateCache.put("app/core/layouts/vertical-navigation.html","<div id=\"layout-vertical-navigation\" class=\"template-layout\" layout=\"row\" flex><md-sidenav id=\"vertical-navigation\" \nclass=\"md-primary-bg\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\" md-component-id=\"navigation\" ms-scroll \nui-view=\"navigation\"></md-sidenav><div id=\"content\" flex layout=\"column\"><md-toolbar id=\"toolbar\" \nclass=\"md-menu-toolbar\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" \nclass=\"animate-slide-up md-background md-hue-1\" ms-scroll ui-view=\"content\" flex></md-content></div><div \nng-show=\"processingRequest\" id=\"progress-image-loading\"><div class=\"center\"><center><img \nsrc=\"./assets/images/logos/logo-white.png\"></center><div class=\"spinner-wrapper\"><div class=\"spinner\"><div \nclass=\"inner\"><div class=\"gap\"></div><div class=\"left\"><div class=\"half-circle\"></div></div><div class=\"right\"><div \nclass=\"half-circle\"></div></div></div></div></div></div></div></div>");
$templateCache.put("app/core/theme-options/theme-options.html","<div class=\"ms-theme-options-panel\" layout=\"row\" layout-align=\"start start\"><div \nclass=\"ms-theme-options-panel-button md-primary-bg\" ng-click=\"toggleOptionsPanel()\"><md-icon md-font-icon=\"icon-cog\" \nclass=\"white-text\"></md-icon></div><div class=\"ms-theme-options-list\" layout=\"column\"><div class=\"theme-option\"><div \nclass=\"option-title\">Layout Style:</div><md-radio-group layout=\"column\" ng-model=\"vm.layoutStyle\" \nng-change=\"vm.updateLayoutStyle()\"><md-radio-button value=\"verticalNavigation\">Vertical Navigation</md-radio-button>\n<md-radio-button value=\"horizontalNavigation\">Horizontal Navigation</md-radio-button><md-radio-button \nvalue=\"contentOnly\">Content Only</md-radio-button><md-radio-button value=\"contentWithToolbar\">Content with Toolbar\n</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">\nLayout Mode:</div><md-radio-group layout=\"row\" layout-align=\"start center\" ng-model=\"vm.layoutMode\" \nng-change=\"vm.updateLayoutMode()\"><md-radio-button value=\"boxed\">Boxed</md-radio-button><md-radio-button value=\"wide\">\nWide</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div \nclass=\"option-title\">Color Palette:</div><md-menu-item ng-repeat=\"(themeName, theme) in vm.themes.list\" class=\"theme\">\n<md-button class=\"md-raised theme-button\" aria-label=\"{{themeName}}\" ng-click=\"vm.setActiveTheme(themeName)\" \nng-style=\"{\'background-color\': theme.primary.color,\'border-color\': theme.accent.color,\'color\': theme.primary.contrast1}\" \nng-class=\"themeName\"><span><md-icon ng-style=\"{\'color\': theme.primary.contrast1}\" md-font-icon=\"icon-palette\">\n</md-icon><span>{{themeName}}</span></span></md-button></md-menu-item></div></div></div>");
$templateCache.put("app/main/dialogs/appraisalform.html","<div ng-show=\"processingReveiw\" id=\"image-loading\"><div class=\"center\"><center><img \nsrc=\"./assets/images/logos/logo-white.png\"></center><div class=\"spinner-wrapper\"><div class=\"spinner\"><div \nclass=\"inner\"><div class=\"gap\"></div><div class=\"left\"><div class=\"half-circle\"></div></div><div class=\"right\"><div \nclass=\"half-circle\"></div></div></div></div></div></div></div><md-dialog style=\"max-width: 90%; max-height: 90%\" \naria-label=\"Employee Appraisal Form\" flex draggable><md-toolbar style=\"background-color: #fff\"><div \nclass=\"md-toolbar-tools\"><h2 style=\"color: #455a64; font-weight: bold\" class=\"details_heading\">Employee Appraisal Form\n</h2><span flex></span><md-button class=\"md-icon-button\" ng-click=\"cancel()\"><md-icon \nstyle=\"color: #455a64; font-weight: bold\" md-svg-src=\"./assets/icons/svg/close-button.svg\" aria-label=\"Close dialog\">\n</md-icon></md-button></div></md-toolbar><md-dialog-content><div layout=\"column\" class=\"page\" layout-fill><fieldset \nid=\"viewfieldset\"><h3 style=\"padding-left: 10px; margin: 10px 0px; font-weight: bold; color: #263238\">EMPLOYEE PROFILE\n</h3><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div class=\"header\" \nstyle=\"border-radius: 0px\"><h1 style=\"font-weight: bold; font-size:17px\">{{user.firstname+\' \'+user.lastname}}</h1>\n</div><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">\nLine Of Business</p><span>{{user.lob||\'N/A\'}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">\nRecruitment Date</p><span>{{user.personalInfo.recruitmentDate||\"N/A\"}}</span></div><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:15px\">Location/based at</p><span>{{user.personalInfo.location}}</span></div><div \nflex=\"25\"><p style=\"font-weight: bold; font-size:15px\">Year or period covered</p><span>\n{{user.personalInfo.periodCovered}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">\nTime in present position</p><span>{{user.personalInfo.timeInPresentPosition}}</span></div><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:15px\">Length of service</p><span>{{user.personalInfo.lengthOfService}}</span></div>\n<div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">Appraisal date & time</p><span>\n{{user.personalInfo.appraisalVenue}}</span></div><div flex=\"25\"><p style=\"font-weight: bold; font-size:15px\">\nAppraisal venue</p><span>{{user.personalInfo.appraisalVenue}}</span></div><div flex=\"25\"><p \nstyle=\"font-weight: bold; font-size:15px\">Appraiser</p><span>{{user.personalInfo.appraiser}}</span></div></div></div>\n</div></fieldset><fieldset id=\"viewfieldset\" style=\"padding: 10px\"><legend class=\"legend_style\">GOALS & OBJECTIVES\n</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div \nclass=\"details\" layout=\"row\" layout-wrap><div flex=\"25\"><span>{{objectives.objectives}}</span></div></div></div></div>\n</fieldset><fieldset id=\"viewfieldset\" style=\"padding: 10px\"><legend class=\"legend_style\">EMPLOYEE’S SELF- ASSESSMENT\n</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div \nclass=\"visits\" flex><h2 class=\"legend_style2\"><md-icon class=\"icon_padding\" \nmd-svg-src=\"./assets/icons/svg/added/Admit.svg\"></md-icon>Job Summary</h2><div class=\"single-visit\">\n<md-table-container><table md-table ng-model=\"selected\" md-progress=\"promise\"><tbody md-body><tr md-row \nmd-select=\"user\" md-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" ng-repeat=\"summary in jobSummary\"><td \nmd-cell style=\"padding: 10px 20px; width: 40px\">{{$index + 1}}.</td><td md-cell>{{summary.summary}}</td></tr></tbody>\n</table></md-table-container></div></div><div class=\"visits\" flex><h2 class=\"legend_style2\" style=\"margin-top:40px\">\n<md-icon class=\"icon_padding\" md-svg-src=\"./assets/icons/svg/added/Admit.svg\"></md-icon>\nAdjusted Responsibilities/Additional Comments</h2><div><md-table-container><table md-table ng-model=\"selected\" \nmd-progress=\"promise\"><tbody md-body><tr md-row md-select=\"user\" md-on-select=\"logItem\" \nmd-auto-select=\"options.autoSelect\" ng-repeat=\"comment in additionalComments\"><td md-cell \nstyle=\"padding: 10px 20px; width: 40px\">{{$index + 1}}.</td><td md-cell>{{comment.comment}}</td></tr></tbody></table>\n</md-table-container></div></div></div></div></fieldset><fieldset id=\"viewfieldset\" style=\"padding: 10px\"><legend \nclass=\"legend_style\">PERFORMANCE APPRAISAL</legend><div class=\"personal-profile\" layout=\"row\"><div \nclass=\"profile-details\" layout=\"column\" flex><div class=\"details\" layout=\"column\" layout-wrap><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Accomplishment of key responsibilities/deliverables:</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.accomplishment}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Achievement of the goals established during the past year:</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.achievement}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIdentify areas of exceptional performance on your part that should be particularly noted. Provide specific examples.\n</p><span style=\"margin:20px\">{{performanceAppraisal.exceptionalPerformance}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIn your current position, can you share an example where you have demonstrated your leadership? Provide specific examples.\n</p><span style=\"margin:20px\">{{performanceAppraisal.leadership}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIn your current position, can you share an example where you have taken ownership? Provide specific examples.</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.ownership}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nIdentify areas of your performance needing more attention or improvement. Provide specific examples.</p><span \nstyle=\"margin:20px\">{{performanceAppraisal.improvement}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">\nApart from your current role, is there any other role in the organization you will like to function in? Please specify the role, state the reasons for your choice and articulate how you intend to contribute to the goal of the organization by functioning in this role\n</p><span style=\"margin:20px\">{{performanceAppraisal.anyOtherRole}}</span></div></div></div></div></fieldset><fieldset \nid=\"viewfieldset\" style=\"padding: 10px\"><legend class=\"legend_style\">FOUNDING PHILOSOPHY</legend><div \nclass=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><md-table-container><table \nmd-table ng-model=\"selected\" md-progress=\"promise\"><thead md-head><tr md-row><th md-column md-order-by=\"name\"><span \nstyle=\"font-weight: bold; font-size:15px\">Creed </span></th><th md-column md-order-by=\"type\"><span \nstyle=\"font-weight: bold; font-size:15px\">Definitions</span></th><th md-column md-order-by=\"type\"><span \nstyle=\"font-weight: bold; font-size:15px\">Ratings</span></th></tr></thead><tbody md-body><tr md-row md-select=\"user\" \nmd-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" ng-repeat=\"philosophy in foundingPhilosophy\"><td md-cell>\n{{philosophy.name}}</td><td md-cell>{{philosophy.definition}}</td><td md-cell>\n{{philosophy.rating==4?\'Exceptional\':philosophy.rating==3?\'Good\':philosophy.rating==2?\'Below Average\':\'Poor\'}}</td>\n</tr></tbody></table></md-table-container><p></p><div flex><p style=\"font-weight: bold; font-size:15px\">\nKey achievement / client feedback on my performance in relation to the founding philosophy</p><span \nstyle=\"margin:20px\">{{clientFeedback.feedBack}}</span></div><p></p></div></div></fieldset><fieldset id=\"viewfieldset\" \nstyle=\"padding: 10px\"><legend class=\"legend_style\">OVERALL ASSESSMENT</legend><div class=\"personal-profile\" \nlayout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div class=\"details\" layout=\"row\" layout-wrap><div \nflex=\"25\"><span>{{ vm.overallAssessment }}</span></div></div></div></div></fieldset><fieldset id=\"viewfieldset\"><legend\n class=\"legend_style\">DEVELOPMENT PLAN</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" \nlayout=\"column\" flex><div class=\"details\" layout=\"column\" layout-wrap><fieldset><legend class=\"legend_style2\">\n{{developmentPlans[0][\'plan\']}}</legend><div flex><p style=\"font-weight: bold; font-size:15px\">Competences</p><span \nstyle=\"margin:20px\">{{developmentPlans[0][\'competences\']}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Actions</p><span style=\"margin:20px\">{{developmentPlans[0][\'actions\']}}\n</span></div><div flex><p style=\"font-weight: bold; font-size:15px\">Due Date</p><span style=\"margin:20px\">\n{{developmentPlans[0][\'dueDate\']|date}}</span></div></fieldset><fieldset><legend class=\"legend_style2\">\n{{developmentPlans[1][\'plan\']}}</legend><div flex><p style=\"font-weight: bold; font-size:15px\">Competences</p><span \nstyle=\"margin:20px\">{{developmentPlans[1][\'competences\']}}</span></div><div flex><p \nstyle=\"font-weight: bold; font-size:15px\">Actions</p><span style=\"margin:20px\">{{developmentPlans[1][\'actions\']}}\n</span></div><div flex><p style=\"font-weight: bold; font-size:15px\">Due Date</p><span style=\"margin:20px\">\n{{developmentPlans[1][\'dueDate\']|date}}</span></div></fieldset></div></div></div></fieldset><fieldset \nid=\"viewfieldset\" style=\"padding: 10px\" ng-show=\"lineManagerComment\"><legend class=\"legend_style\">\nMANAGER\'S RATING AND COMMENT</legend><div class=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" \nlayout=\"column\" flex><div flex><p style=\"font-weight: bold; font-size:15px\">Final Rating</p><span style=\"margin:20px\">\n{{lineManagerComment.finalRating}}</span></div><div flex><p style=\"font-weight: bold; font-size:15px\">Comment</p><span \nstyle=\"margin:20px\">{{lineManagerComment.comment}}</span></div></div></div></fieldset><fieldset id=\"viewfieldset\">\n<legend class=\"legend_style\">\n{{loggedInUser.roles==\'TOP_MANAGER\' &&lineManagerComment?\"FINAL APPROVAL\":\'SIGN-OFF/APPROVAL\'}}</legend><div \nclass=\"personal-profile\" layout=\"row\"><div class=\"profile-details\" layout=\"column\" flex><div class=\"details\" \nlayout=\"column\" layout-wrap><div layout=\"row\" flex><div flex=\"15\"><label class=\"tiredlabel\"><span class=\"\" \nstyle=\"font-weight: bold; font-size:15px; display: inline; padding: 0px\">*</span> Final Rating:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"80\"><label></label><textarea md-no-asterisk type=\"text\" \nng-model=\"review.finalRating\" required></textarea></md-input-container></div><div layout=\"row\" flex><div flex=\"15\">\n<label class=\"tiredlabel\"><span class=\"\" style=\"font-weight: bold; font-size:15px; display: inline; padding: 0px\">*\n</span> Comment:</label></div><md-input-container class=\"tiredinput\" flex=\"80\"><label></label><textarea md-no-asterisk \ntype=\"text\" ng-model=\"review.comment\" required></textarea></md-input-container></div></div></div></div></fieldset><div \nlayout=\"row\" layout-align=\"center center\" \nng-show=\"loggedInUser.roles==\'TOP_MANAGER\'||loggedInUser.roles==\'LINE_MANAGER\'\"><md-button class=\"md-raised md-accent\" \nng-click=\"submitReveiw(true)\" ng-disabled=\"review.finalRating==null||review.comment==null\" style=\"margin-right:20px\">\nApprove</md-button><md-button class=\"md-raised md-accent\" ng-click=\"submitReveiw(false)\" \nng-disabled=\"review.finalRating==null||review.comment==null\" style=\"margin-right:20px\">Decline</md-button></div></div>\n</md-dialog-content></md-dialog>");
$templateCache.put("app/core/directives/ms-material-color-picker/ms-material-color-picker.html","<md-menu md-position-mode=\"target-right target\"><md-button aria-label=\"Row Color\" md-menu-origin \nng-click=\"$mdOpenMenu($event)\" ng-class=\"selectedColor.class\"><span ng-show=\"selectedColor.palette\">\n{{selectedColor.palette}} {{selectedColor.hue}} </span><span ng-show=\"!selectedColor.palette\">Select Color</span>\n</md-button><md-menu-content class=\"ms-material-color-picker-menu-content\" layout-column><header \nng-class=\"selectedColor.class || \'md-accent-bg\'\" class=\"md-whiteframe-4dp\" layout=\"row\" \nlayout-align=\"space-between center\"><md-button md-prevent-menu-close ng-click=\"activateHueSelection(false,false)\" \nclass=\"md-icon-button\" ng-class=\"{\'hidden\':!selectedPalette}\" aria-label=\"Palette\"><md-icon \nmd-font-icon=\"icon-arrow-left\" class=\"s20\"></md-icon></md-button><span ng-if=\"selectedColor.palette\">\n{{selectedColor.palette}} {{selectedColor.hue}} </span><span ng-if=\"!selectedColor.palette\">Select Color</span>\n<md-button class=\"remove-color-button md-icon-button\" ng-click=\"removeColor()\" aria-label=\"Remove Color\"><md-icon \nmd-font-icon=\"icon-delete\" class=\"s20\"></md-icon></md-button></header><div class=\"colors\" ms-scroll><div \nng-if=\"!selectedPalette\" layout=\"row\" layout-wrap><div class=\"color\" ng-class=\"\'md-\'+palette+\'-500-bg\'\" \nng-repeat=\"(palette, hues) in palettes\" ng-click=\"activateHueSelection(palette,hues)\" layout=\"row\" \nlayout-align=\"start end\" md-prevent-menu-close md-ink-ripple><span class=\"label\">{{palette}}</span></div></div><div \nng-if=\"selectedPalette\" layout=\"row\" layout-wrap><div class=\"color\" ng-class=\"\'md-\'+selectedPalette+\'-\'+hue+\'-bg\'\" \nng-repeat=\"(hue, values) in selectedHues\" ng-click=\"selectColor(selectedPalette,hue)\" layout=\"row\" \nlayout-align=\"start end\" md-ink-ripple><span class=\"label\">{{hue}} </span><i \nng-if=\"selectedPalette == selectedColor.palette && hue == selectedColor.hue\" class=\"s16 icon-check\"></i></div></div>\n</div></md-menu-content></md-menu>");
$templateCache.put("app/core/directives/ms-search-bar/ms-search-bar.html","<div flex layout=\"row\" layout-align=\"start center\"><label for=\"ms-search-bar-input\"><md-icon \nid=\"ms-search-bar-expander\" md-font-icon=\"icon-magnify\" class=\"icon s24\"></md-icon><md-icon \nid=\"ms-search-bar-collapser\" md-font-icon=\"icon-close\" class=\"icon s24\"></md-icon></label><input \nid=\"ms-search-bar-input\" type=\"text\" ng-model=\"global.search\" placeholder=\"Search\" translate \ntranslate-attr-placeholder=\"TOOLBAR.SEARCH\" flex></div>");
$templateCache.put("app/main/apps/dashboard/dashboard.html","<div layout=\"row\" id=\"patient-billing\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card \nclass=\"default header\" layout=\"row\" layout-align=\"center\"><h3></h3></md-card><md-content class=\"body\" layout=\"column\" \nflex layout-margin ms-scroll><fieldset id=\"viewfieldset\"><div class=\"personal-profile\" layout=\"row\"><div \nclass=\"profile-details\" layout=\"column\" flex><div class=\"header\"><h1>{{vm.user.firstname+\' \'+vm.user.lastname}}</h1>\n</div><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"40\"><p style=\"font-weight: bold; font-size:20px\">Email:\n</p><span>{{vm.user.email}}</span></div><div flex=\"40\"><p style=\"font-weight: bold; font-size:20px\">Line Of Business:\n</p><span>{{vm.user.lob}}</span></div></div><div class=\"details\" layout=\"row\" layout-wrap><div flex=\"40\"><p \nstyle=\"font-weight: bold; font-size:20px\">Recruitment Date:</p><span>{{vm.user.personalInfo.recruitmentDate|date}}\n</span></div><div flex=\"40\"><p style=\"font-weight: bold; font-size:20px\">Location/based at:</p><span>\n{{vm.user.personalInfo.location}}</span></div></div></div></div></fieldset></md-content></div></div>");
$templateCache.put("app/navigation/layouts/horizontal-navigation/navigation.html","<div layout=\"row\" layout-align=\"start center\"><ms-navigation-horizontal></ms-navigation-horizontal></div>");
$templateCache.put("app/toolbar/layouts/content-with-toolbar/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"logo\" \nlayout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div>\n<md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" \nmd-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><div \nclass=\"toolbar-separator\"></div><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-menu-bar \nid=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" \naria-label=\"User settings\" translate translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" \nlayout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target class=\"avatar\" \nsrc=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs>\nJohn Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs></md-icon></div></md-button>\n<md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon \nmd-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item \nclass=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox\n</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button \nng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button>\n<md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" \nng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" \nclass=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon \nmd-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-bar><div class=\"toolbar-separator\"></div><md-menu id=\"language-menu\" \nmd-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" \naria-label=\"Language\" md-menu-origin md-menu-align-target><div layout=\"row\" layout-align=\"center center\"><img \nclass=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">\n{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\">\n<md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" \naria-label=\"{{lang.title}}\" translate translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" \nlayout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span \ntranslate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu>\n<div class=\"toolbar-separator\"></div><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" \nng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate \ntranslate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\">\n</md-icon></md-button></div></div>");
$templateCache.put("app/navigation/layouts/vertical-navigation/navigation.html","<md-toolbar class=\"navigation-header md-whiteframe-1dp\" layout=\"row\" layout-align=\"space-between center\"><div \nclass=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\"><img \nsrc=\"./assets/images/logos/logo.png\"></span><md-menu md-position-mode=\"target-left target\" md-offset=\"0 50\"><md-button \nid=\"logoutButton\" aria-label=\"Open demo menu\" class=\"md-icon-button\" ng-click=\"$mdMenu.open($event)\"><md-icon \nmd-svg-icon=\"./assets/icons/svg/more_vert.svg\"></md-icon></md-button><md-menu-content ng-mouseleave=\"$mdMenu.close()\">\n<md-menu-divider></md-menu-divider><md-menu-item data-ui-sref-active=\"active\"><md-button ng-click=\"vm.signOut()\">\n<ng-md-icon icon=\"logout\" md-menu-align-target></ng-md-icon>Sign out</md-button></md-menu-item></md-menu-content>\n</md-menu></div></md-toolbar><ms-navigation class=\"scrollable\" folded=\"vm.folded\" ms-scroll=\"vm.msScrollOptions\">\n</ms-navigation>");
$templateCache.put("app/toolbar/layouts/vertical-navigation/toolbar.html","<div layout=\"row\" class=\"navigation-header\" layout-align=\"start center\" style=\"height: 48px\"><div layout=\"row\" \nlayout-align=\"start center\" flex><md-button id=\"navigation-toggle\" class=\"md-icon-button\" \nng-click=\"vm.toggleSidenav(\'navigation\')\" hide-gt-sm aria-label=\"Toggle navigation\" translate \ntranslate-attr-aria-label=\"TOOLBAR.TOGGLE_NAVIGATION\"><md-icon md-font-icon=\"icon-menu\" class=\"icon\"></md-icon>\n</md-button><div class=\"form-title\" style=\"margin-left: 15px;font-size: 21px\">{{vm.pageTitle}}</div></div><div \nlayout=\"row\" layout-align=\"start center\"><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button\n class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate \ntranslate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div \nclass=\"avatar-wrapper\"><img md-menu-align-target class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon \nmd-font-icon ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\">\n</md-icon></div><span class=\"username\" hide-xs>{{vm.loggedInStaff}}</span><md-icon md-font-icon=\"icon-chevron-down\" \nclass=\"icon s16\" hide-xs></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" \nng-show=\"vm.shiftNumber\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-timetable\" class=\"icon\"></md-icon>\n<span style=\"margin-left: 48px; line-height: 2.9\">{{vm.shiftNumber}}</span></md-menu-item><md-menu-divider>\n</md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button\n ng-click=\"vm.logout()\" translate=\"TOOLBAR.SIGN_OUT\"></md-button></md-menu-item></md-menu-content></md-menu>\n</md-menu-bar><div><md-icon md-font-icon=\"icon-hospital-marker\" ng-show=\"vm.location\" class=\"icon\" \nstyle=\"margin-right: 5px; margin-left: 15px\"></md-icon><span style=\"margin-right: 25px; font-size: 14px\">\n{{vm.location}}</span></div></div></div>");
$templateCache.put("app/toolbar/layouts/horizontal-navigation/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div \nclass=\"navigation-toggle\" hide-gt-sm><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" \naria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><div class=\"logo\" \nlayout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div>\n<md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" \nmd-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><ms-search-bar>\n</ms-search-bar><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" \nng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div \nlayout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target class=\"avatar\" \nsrc=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs>\nJohn Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs></md-icon></div></md-button>\n<md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon \nmd-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item \nclass=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox\n</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon ng-class=\"vm.userStatus.icon\" \nng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button \nng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button>\n<md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" \nng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" \nclass=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon \nmd-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item>\n</md-menu-content></md-menu></md-menu-bar><md-menu id=\"language-menu\" md-offset=\"0 72\" \nmd-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" \naria-label=\"Language\" md-menu-origin md-menu-align-target><div layout=\"row\" layout-align=\"center center\"><img \nclass=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">\n{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\">\n<md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" \naria-label=\"{{lang.title}}\" translate translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" \nlayout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span \ntranslate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu>\n<md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" \naria-label=\"Toggle quick panel\" translate translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon \nmd-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/core/directives/ms-navigation/templates/horizontal.html","<div class=\"navigation-toggle\" hide-gt-sm><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" \naria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><ul \nclass=\"horizontal\"><li ng-repeat=\"node in vm.navigation\" ms-navigation-horizontal-node=\"node\" \nng-class=\"{\'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-horizontal-nested.html\'\"></li></ul><script \ntype=\"text/ng-template\" id=\"navigation-horizontal-nested.html\">\n<div ms-navigation-horizontal-item layout=\"row\" ng-if=\"!vm.isHidden()\">\n\n        <div class=\"ms-navigation-horizontal-button\" ng-if=\"!node.uisref && node.title\"\n             ng-class=\"{\'active md-accent-bg\': vm.isActive}\">\n            <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i>\n            <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\n            <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\n            <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i>\n        </div>\n\n        <a class=\"ms-navigation-horizontal-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\"\n           ng-class=\"{\'active md-accent-bg\': vm.isActive}\"\n           ng-if=\"node.uisref && node.title\">\n            <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i>\n            <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\n            <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\n            <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i>\n        </a>\n\n    </div>\n\n    <ul ng-if=\"vm.hasChildren && !vm.isHidden()\">\n        <li ng-repeat=\"node in node.children\" ms-navigation-horizontal-node=\"node\"\n            ng-class=\"{\'has-children\': vm.hasChildren}\"\n            ng-include=\"\'navigation-horizontal-nested.html\'\"></li>\n    </ul>\n</script>");
$templateCache.put("app/core/directives/ms-navigation/templates/vertical.html","<ul><li ng-repeat=\"node in vm.navigation\" ms-navigation-node=\"node\" \nng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-nested.html\'\"></li></ul>\n<script type=\"text/ng-template\" id=\"navigation-nested.html\">\n<div ms-navigation-item layout=\"row\" ng-if=\"!vm.isHidden()\">\r\n\r\n      <div class=\"ms-navigation-button\" ng-if=\"!node.uisref && node.title\">\r\n          <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i>\r\n          <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\r\n          <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\r\n          <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i>\r\n      </div>\r\n\r\n      <a class=\"ms-navigation-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active activeHover\"\r\n         ng-if=\"node.uisref && node.title\">\r\n          <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i>\r\n          <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span>\r\n          <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span>\r\n          <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i>\r\n      </a>\r\n\r\n  </div>\r\n\r\n  <ul ng-if=\"vm.hasChildren && !vm.isHidden()\">\r\n      <li ng-repeat=\"node in node.children\" ms-navigation-node=\"node\"\r\n          ng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\"\r\n          ng-include=\"\'navigation-nested.html\'\"></li>\r\n  </ul>\n</script>");
$templateCache.put("app/main/apps/appraisals/newappriasal/newappraisal.html","<md-progress-linear class=\"overlay\" ng-show=\"processingRequest\" md-mode=\"indeterminate\" ng-value=\"please\">\n</md-progress-linear><div layout=\"column\"><ms-form-wizard flex><md-tabs md-dynamic-height \nmd-selected=\"msWizard.selectedIndex\" md-center-tabs=\"true\"><md-tab><md-tab-label><span \nclass=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep1.$invalid\">1\n</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep1.$valid\"><i class=\"icon-check s16\"></i>\n </span><span class=\"ms-form-wizard-step-text\">Step 1</span></span></md-tab-label><md-tab-body id=\"supplier-register\" \nclass=\"page\"><form name=\"wizardStep1\" class=\"md-inline-form\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" \nlayout=\"column\" layout-align=\"center\"><h3 class=\"PanelStyle\"><md-icon md-font-icon=\"icon-content-paste\"></md-icon>\nProfile</h3></md-card><fieldset class=\"profile-details-style\"><div layout=\"row\" class=\"Profile-input\"><div flex=\"20\">\n<label class=\"tiredlabel\"><span class=\"\">*</span> Full Name:</label></div><md-input-container class=\"tiredinput\" \nflex=\"70\"><label></label><input md-no-asterisk type=\"text\" required ng-model=\"vm.profiledata.FullName\">\n</md-input-container></div><div layout=\"row\" class=\"Profile-input\"><div flex=\"20\"><label class=\"tiredlabel\"><span \nclass=\"\">*</span> Line of Business:</label></div><md-input-container class=\"tiredinput\" flex=\"25\"><label></label>\n<md-select md-no-asterisk required name=\"lob\" ng-model=\"vm.profiledata.lob\"><md-option ng-repeat=\"lob in vm.lobs\" \nvalue=\"{{lob}}\">{{lob}}</md-option></md-select></md-input-container><div flex=\"20\"><label class=\"tiredlabel\">\nLocation/based at:</label></div><md-input-container class=\"tiredinput\" flex=\"25\"><label></label><md-select \nmd-no-asterisk name=\"location\" ng-model=\"vm.profiledata.location\"><md-option ng-repeat=\"location in vm.locations\" \nvalue=\"{{location.state +\', \'+location.country}}\">{{location.state +\', \'+location.country}}</md-option></md-select>\n</md-input-container></div><div layout=\"row\" class=\"Profile-input\"><div flex=\"20\"><label class=\"tiredlabel\"><span \nclass=\"\">*</span> Year/period covered</label></div><md-input-container class=\"tiredinput\" flex=\"25\"><label></label>\n<input md-no-asterisk required type=\"text\" ng-model=\"vm.profiledata.periodCovered\"></md-input-container><div flex=\"20\">\n<label class=\"tiredlabel\">Time in present position:</label></div><md-input-container class=\"tiredinput\" flex=\"25\">\n<label></label><input md-no-asterisk required type=\"text\" ng-model=\"vm.profiledata.timeInPresentPosition\">\n</md-input-container></div><div layout=\"row\" class=\"Profile-input\"><div flex=\"20\"><label class=\"tiredlabel\">\nRecruitment Date:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label><input md-no-asterisk \nrequired type=\"date\" name=\"dateOfBirth\" ng-model=\"vm.profiledata.recruitmentDate\"></md-input-container></div><div \nlayout=\"row\" class=\"Profile-input\"><div flex=\"20\"><label class=\"tiredlabel\">Length of service:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"70\"><label></label><input md-no-asterisk required type=\"text\" \nng-model=\"vm.profiledata.lengthOfService\"></md-input-container></div><div layout=\"row\" class=\"Profile-input\"><div \nflex=\"20\"><label class=\"tiredlabel\">Appraisal venue:</label></div><md-input-container class=\"tiredinput\" flex=\"70\">\n<label></label><input md-no-asterisk required type=\"text\" ng-model=\"vm.profiledata.appraisalVenue\">\n</md-input-container></div><div layout=\"row\" class=\"Profile-input\"><div flex=\"20\"><label class=\"tiredlabel\">Appraiser:\n</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label><input md-no-asterisk required \ntype=\"text\" ng-model=\"vm.profiledata.appraiser\"></md-input-container></div></fieldset></form></md-tab-body></md-tab>\n<md-tab><md-tab-label><span class=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" \nng-if=\"wizardStep2.$invalid\">2</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep2.$valid\">\n<i class=\"icon-check s16\"></i> </span><span class=\"ms-form-wizard-step-text\">Step 2</span></span></md-tab-label>\n<md-tab-body><form name=\"wizardStep2\" class=\"md-inline-form\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" \nlayout=\"column\" layout-align=\"center\"><h3 class=\"PanelStyle\"><md-icon md-font-icon=\"icon-content-paste\"></md-icon>\nGoals & Objectives</h3></md-card><div class=\"about-section-text\"><p>\nBriefly describe your personal understanding and contributions to the overall objective of the organisation in 2017</p>\n</div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.objective.objectives\" required md-select-on-focus></textarea></md-input-container></div></form>\n</md-tab-body></md-tab><md-tab><md-tab-label><span class=\"ms-form-wizard-step-label\"><span \nclass=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep3.$invalid\">3</span> <span \nclass=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep3.$valid\"><i class=\"icon-check s16\"></i> </span><span \nclass=\"ms-form-wizard-step-text\">Step 3</span></span></md-tab-label><md-tab-body><form name=\"wizardStep3\" \nms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" layout-align=\"center\"><h3 class=\"PanelStyle\">\n<md-icon md-font-icon=\"icon-content-paste\"></md-icon>Self Assessment</h3></md-card><ol><li class=\"number-list-tyle\">\n<div class=\"about-section-text aboutTextStyle\"><p>\nYour Job Summary: Provide a summary of your responsibilities during this period, including significant projects.</p>\n</div><ol class=\"romanStyle\"><li ng-repeat=\"jobsummary in vm.jobsummaries track by $index\"><div layout=\"row\">\n<md-input-container flex=\"70\" class=\"options-style\"><input md-no-asterisk required type=\"text\" \nng-model=\"jobsummary.summary\"></md-input-container><div flex=\"20\"><md-button class=\"delete_button\" \naria-label=\"remove selected jobsummary\" ng-click=\"vm.removeSelectedObject(jobsummary,\'jobsummary\')\"><md-icon \nmd-svg-src=\"./assets/icons/svg/added/Delete.svg\" class=\"deletebutton\"></md-icon></md-button></div></div></li></ol><div \nclass=\"about-section-text\"><md-input-container flex=\"25\"><md-icon ng-click=\"vm.addNewObject(\'jobsummary\')\" \nmd-svg-src=\"./assets/icons/svg/round-add-button.svg\" class=\"button\"></md-icon></md-input-container></div></li><li \nclass=\"number-list-tyle\"><div class=\"about-section-text\"><p>\nAdjusted Responsibilities/Additional Comments: Note any job changes, responsibilities, or projects added since the last update of your job description, plan of work or performance goals/objectives, as well as any special circumstances that provide a context for this performance review.\n</p></div><ol class=\"romanStyle\"><li ng-repeat=\"objective in vm.responsibilities track by $index\"><div layout=\"row\">\n<md-input-container flex=\"70\" class=\"options-style\"><input md-no-asterisk type=\"text\" required \nng-model=\"objective.comment\"></md-input-container><div flex=\"20\"><md-button aria-label=\"remove selected objective\" \nng-click=\"vm.removeSelectedObject(objective,\'responsibility\')\"><md-icon \nmd-svg-src=\"./assets/icons/svg/added/Delete.svg\" class=\"deletebutton\"></md-icon></md-button></div></div></li></ol><div \nclass=\"about-section-text\"><md-input-container flex=\"25\"><md-icon ng-click=\"vm.addNewObject(\'responsibility\')\" \nmd-svg-src=\"./assets/icons/svg/round-add-button.svg\" class=\"button\"></md-icon></md-input-container></div></li><li><div \nclass=\"about-section-text\"><p>\nPerformance Appraisal: Discuss and evaluate your performance against the firm’s objectives. Base your appraisal upon the job summary, adjusted responsibilities/additional comments and your performance goals for the performance cycle.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><ol><li><div class=\"p-appraisal-li\"><p>\nAccomplishment of key responsibilities/deliverables:</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex>\n<md-input-container flex=\"100\"><textarea ng-model=\"vm.performanceAppraisal.accomplishment\" required md-select-on-focus>\n</textarea></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nAchievement of the goals established during the past year:</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex>\n<md-input-container flex=\"100\"><textarea ng-model=\"vm.performanceAppraisal.achievement\" required md-select-on-focus>\n</textarea><div ng-messages=\"wizardStep1.firstname.$error\" role=\"alert\"><div ng-message=\"\"><span>Firstname field is .\n</span></div></div></md-input-container></div></li><li><div class=\"p-appraisal-li\"><p>\nIdentify areas of exceptional performance on your part that should be particularly noted. Provide specific examples.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.exceptionalPerformance\" required md-select-on-focus></textarea></md-input-container>\n</div></li><li><div class=\"p-appraisal-li\"><p>\nIn your current position, can you share an example where you have demonstrated your leadership? Provide specific examples.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.leadership\" required md-select-on-focus></textarea></md-input-container></div></li>\n<li><div class=\"p-appraisal-li\"><p>\nIn your current position, can you share an example where you have taken ownership? Provide specific examples.</p></div>\n<div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.ownership\" required md-select-on-focus></textarea></md-input-container></div></li>\n<li><div class=\"p-appraisal-li\"><p>\nIdentify areas of your performance needing more attention or improvement. Provide specific examples.</p></div><div \nlayout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.improvement\" required md-select-on-focus></textarea></md-input-container></div></li>\n<li><div class=\"p-appraisal-li\"><p>\nApart from your current role, is there any other role in the organization you will like to function in? Please specify the role, state the reasons for your choice and articulate how you intend to contribute to the goal of the organization by functioning in this role.\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea \nng-model=\"vm.performanceAppraisal.anyOtherRole\" required md-select-on-focus></textarea></md-input-container></div></li>\n</ol></div></li></ol></form></md-tab-body></md-tab><md-tab><md-tab-label><span class=\"ms-form-wizard-step-label\"><span \nclass=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep4.$invalid\">4</span> <span \nclass=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep4.$valid\"><i class=\"icon-check s16\"></i> </span><span \nclass=\"ms-form-wizard-step-text\">Step 4</span></span></md-tab-label><md-tab-body><form name=\"wizardStep4\" \nms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" layout-align=\"center\"><h3 class=\"PanelStyle\">\n<md-icon md-font-icon=\"icon-content-paste\"></md-icon>Founding Philosophy</h3></md-card><ol><li \nclass=\"number-list-tyle\"><div class=\"about-section-text\"><p>\nPlease rate your level of understanding of and/or performance against the firm’s founding philosophy using the following metrics:\n</p><span class=\"about-section-text\">(4 = Exceptional 3 = Good 2 = Below Average 1 = Poor)</span></div>\n<md-table-container><table md-table md-row-select=\"options.rowSelection\" multiple=\"{{options.multiSelect}}\" \nng-model=\"selected\" md-progress=\"promise\"><thead ng-if=\"!options.decapitate\" md-head md-order=\"query.order\" \nmd-on-reorder=\"logOrder\"><tr md-row><th md-column md-order-by=\"name\"><span>Creed </span></th><th md-column \nmd-order-by=\"type\"><span>Definitions</span></th><th md-column md-order-by=\"type\"><span>Ratings</span></th></tr></thead>\n<tbody md-body><tr md-row md-select=\"user\" md-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" \nng-repeat=\"philosophy in vm.foundingPhilosophy\"><td md-cell>{{philosophy.name}}</td><td md-cell>\n{{philosophy.definition}}</td><td md-cell><md-radio-group layout=\"row\" layout-align=\"start center\" required \nng-checked=\"vm.collectionTypeChanged()\" ng-model=\"philosophy.rating\"><md-radio-button value=\"4\">4</md-radio-button>\n<md-radio-button value=\"3\">3</md-radio-button><md-radio-button value=\"2\">2</md-radio-button><md-radio-button value=\"1\">\n1</md-radio-button></md-radio-group></td></tr></tbody></table></md-table-container></li><li><div \nclass=\"about-section-text\"><p>\nList below key achievement / client feedback on your performance in relation to the founding philosophy (List the projects, Name of feedback provider (Client), brief description of your contribution)\n</p></div><div layout=\"row\" layout-gt-xs=\"row\" flex><md-input-container flex=\"100\"><textarea ng-model=\"vm.feedBack\" \nrequired md-select-on-focus></textarea></md-input-container></div></li></ol></form></md-tab-body></md-tab><md-tab>\n<md-tab-label><span class=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" \nng-if=\"wizardStep5.$invalid\">5</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep5.$valid\">\n<i class=\"icon-check s16\"></i> </span><span class=\"ms-form-wizard-step-text\">Step 5</span></span></md-tab-label>\n<md-tab-body><form name=\"wizardStep5\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" layout=\"column\" \nlayout-align=\"center\"><h3 class=\"PanelStyle\"><md-icon md-font-icon=\"icon-content-paste\"></md-icon>Overall Assessment\n</h3></md-card><div class=\"about-section-text\"><p>Overall Performance Rating definition (Tick where appropriate)</p>\n</div><div class=\"overall\"><span>\n5 = Exceeds Expectations: Demonstrates this Performance Factor consistently above and beyond expectations</span><br>\n<span>\n4 = Meets Expectations: Effectively demonstrates the Performance Factor, all of the time, in all situations, consistently in line with expectations.\n</span><br><span>\n3 = Partially Meets Expectations: Effectively demonstrates the Performance Factor in many, but not all situations, and/or some improvement is .\n</span><br><span>\n2 = Does Not Meet Expectations: Has difficulty demonstrating this Performance Factor; significant improvement is . \n</span><br><span>\n1 = No Basis: had little opportunity to demonstrate this Performance Factor during the assessment period. </span><br>\n<span>\nN/A = Individual has not been in position long enough (at least three (3) months) to fully demonstrate the competencies for the position. This appraisal is provided for feedback purposes.\n</span><br></div><div layout=\"row\" layout-gt-xs=\"row\" class=\"page\" flex layout-align=\"space-around center\"><md-card \nclass=\"default header\" layout=\"column\" flex layout-align=\"center\"><md-radio-group required layout=\"row\" \nng-checked=\"vm.collectionTypeChanged()\" ng-model=\"vm.assessment.overall\"><div flex=\"20\"><label>5</label>\n<md-radio-button value=\"5\"></md-radio-button></div><div flex=\"20\"><label>4</label><md-radio-button value=\"4\">\n</md-radio-button></div><div flex=\"20\"><label>3</label><md-radio-button value=\"3\"></md-radio-button></div><div \nflex=\"20\"><label>2</label><md-radio-button value=\"2\"></md-radio-button></div><div flex=\"20\"><label>1</label>\n<md-radio-button value=\"1\"></md-radio-button></div><div flex=\"20\"><label>N/A</label><md-radio-button value=\"0\">\n</md-radio-button></div></md-radio-group></md-card></div></form></md-tab-body></md-tab><md-tab><md-tab-label><span \nclass=\"ms-form-wizard-step-label\"><span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep6.$invalid\">6\n</span> <span class=\"ms-form-wizard-step-number md-accent-bg\" ng-if=\"wizardStep6.$valid\"><i class=\"icon-check s16\"></i>\n </span><span class=\"ms-form-wizard-step-text\">Step 6</span></span></md-tab-label><md-tab-body id=\"supplier-register\" \nclass=\"page\"><form name=\"wizardStep6\" class=\"md-inline-form\" ms-form-wizard-form novalidate><md-card id=\"defaultcard\" \nlayout=\"column\" layout-align=\"center\"><h3 class=\"PanelStyle\"><md-icon md-font-icon=\"icon-content-paste\"></md-icon>\nDevelopment Plan</h3></md-card><div class=\"about-section-text\"><p>\nDirections: Identify the areas where you would like to develop (either in terms of your knowledge, skills or performance) – this may relate to either your current position, or a future position (or both). Then describe what specific actions you will take to develop in that area. Finally indicate when you plan to complete this activity.\n</p></div><fieldset><legend>Performance Enhancement (Current Position)</legend><div layout=\"row\"><div flex=\"20\"><label \nclass=\"tiredlabel\"><span class=\"\">*</span> Competences:</label></div><md-input-container class=\"tiredinput\" flex=\"70\">\n<label></label><textarea class=\"form-textarea\" required md-no-asterisk type=\"text\" \nng-model=\"vm.currentPosition.competences\"></textarea></md-input-container></div><div layout=\"row\"><div flex=\"20\"><label\n class=\"tiredlabel\">Actions:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label><textarea \nmd-no-asterisk required type=\"text\" ng-model=\"vm.currentPosition.actions\"></textarea></md-input-container></div><div \nlayout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Due Date:</label></div><md-input-container class=\"tiredinput\" \nflex=\"70\"><label></label><input md-no-asterisk required type=\"date\" name=\"dateOfBirth\" \nng-model=\"vm.currentPosition.dueDate\"></md-input-container></div></fieldset><fieldset><legend>\nCareer Development (Future Positions)</legend><div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\"><span \nclass=\"\">*</span> Competences:</label></div><md-input-container class=\"tiredinput\" flex=\"70\"><label></label><textarea \nmd-no-asterisk required type=\"text\" ng-model=\"vm.futurePosition.competences\"></textarea></md-input-container></div><div\n layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Actions:</label></div><md-input-container class=\"tiredinput\" \nflex=\"70\"><label></label><textarea md-no-asterisk required type=\"text\" ng-model=\"vm.futurePosition.actions\"></textarea>\n</md-input-container></div><div layout=\"row\"><div flex=\"20\"><label class=\"tiredlabel\">Due Date:</label></div>\n<md-input-container class=\"tiredinput\" flex=\"70\"><label></label><input md-no-asterisk required type=\"date\" \nname=\"dateOfBirth\" ng-model=\"vm.futurePosition.dueDate\"></md-input-container></div></fieldset></form></md-tab-body>\n</md-tab></md-tabs><div class=\"navigation\" flex layout=\"row\" layout-align=\"center center\"><md-button \nclass=\"md-raised md-accent\" ng-click=\"msWizard.previousStep()\" ng-disabled=\"msWizard.isFirstStep()\">Previous\n</md-button><div class=\"steps\"><span ng-repeat=\"form in msWizard.forms\" \nng-class=\"{\'selected md-accent-bg\':msWizard.selectedIndex === $index}\"></span></div><md-button \nclass=\"md-raised md-accent\" ng-click=\"msWizard.nextStep()\" ng-hide=\"msWizard.isLastStep()\" \nng-disabled=\"msWizard.currentStepInvalid()||(msWizard.selectedIndex==2&&(vm.jobsummaries.length==0|| vm.responsibilities.length==0))\">\nNext</md-button><md-button class=\"md-raised md-warn\" ng-click=\"vm.sendForm(); msWizard.resetForm();\" \nng-show=\"msWizard.isLastStep()\" \nng-disabled=\"msWizard.formsIncomplete() ||vm.jobsummaries.length==0|| vm.responsibilities.length==0\">Send</md-button>\n</div></ms-form-wizard></div>");
$templateCache.put("app/main/apps/appraisals/manageappraisal/manageappraisal.html","<div layout=\"row\" id=\"users\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card \nclass=\"default header\" layout=\"column\" layout-align=\"center left\"></md-card><fieldset><legend>View</legend>\n<md-radio-group layout=\"row\" ng-change=\"vm.appraisalStatusChanged(vm.status)\" layout-align=\"center space-between\" \nng-model=\"vm.status\"><md-radio-button \nng-show=\"vm.loggedInUser.roles==\'LINE_MANAGER\'||vm.loggedInUser.roles==\'SUPER_ADMIN\'\" value=\"pending\">Pending List\n</md-radio-button><md-radio-button value=\"reviewed\">Reviewed List</md-radio-button><md-radio-button value=\"approved\">\nApproved List</md-radio-button><md-radio-button value=\"rejected\">Rejected List</md-radio-button></md-radio-group>\n</fieldset><div class=\"table\" style=\"margin:25px\"><md-table-container><table md-table \nmd-row-select=\"options.rowSelection\" multiple=\"{{options.multiSelect}}\" ng-model=\"selected\" md-progress=\"promise\">\n<thead ng-if=\"!options.decapitate\" md-head md-order=\"query.order\" md-on-reorder=\"logOrder\"><tr md-row><th md-column>\n<span class=\"table_heading_style\">Full Name</span></th><th md-column><span class=\"table_heading_style\">Email</span>\n</th><th md-column><span class=\"table_heading_style\">Line of Business</span></th><th md-column><span \nclass=\"table_heading_style\">Appraisal Date</span></th></tr></thead><tbody md-body><tr md-row md-select=\"user\" \nmd-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" \nng-repeat=\"user in users | filter: filter.search | orderBy: query.order \"><td md-cell class=\"nameStlye\">\n{{user.firstname}} {{user.lastname}}</td><td md-cell>{{user.email}}</td><td md-cell>{{user.lob}}</td><td md-cell>\n{{user.appraisalDate}}</td><td md-cell><md-icon ng-click=\"vm.getAppraisalDetails(user,$event,\'appraisalform.html\')\" \nmd-svg-src=\"./assets/icons/svg/view-list-button.svg\" class=\"button\">view</md-icon></td></tr></tbody></table>\n<md-table-pagination md-limit=\"query.limit\" md-limit-options=\"limitOptions\" md-page=\"query.page\" \nmd-total=\"{{employees.count}}\" md-page-select=\"options.pageSelect\" md-boundary-links=\"options.boundaryLinks\" \nmd-on-paginate=\"vm.getEmployeeList\"></md-table-pagination></md-table-container></div></div></div>");
$templateCache.put("app/main/apps/settings/employeelist/employeelist.html","<div layout=\"row\" id=\"users\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card \nclass=\"default header\" layout=\"column\" layout-align=\"center left\"><h3></h3></md-card><fieldset><legend>\nDownload Template</legend><div layout=\"row\"><md-button class=\"md-accent md-raised\" ng-click=\"vm.downloadTemlate()\">\nDownload Template</md-button></div></fieldset><fieldset><legend>Upload Template</legend><md-input-container><label \nfor=\"excelFile\"></label><input id=\"excelFileInput\" accept=\".xls,.xlsx\" type=\"file\" import-from-excel>\n</md-input-container><md-button class=\"md-accent md-raised\" id=\"employeelistupload\" ng-click=\"vm.uploadTemlate()\">\nUpload Template</md-button></fieldset><fieldset><legend>Employees</legend><md-table-container><table md-table \nmd-row-select=\"options.rowSelection\" ng-model=\"selected\" md-progress=\"promise\"><thead ng-if=\"!options.decapitate\" \nmd-head md-order=\"query.order\" md-on-reorder=\"logOrder\"><tr md-row><th md-column md-order-by=\"name\"><span>First Name \n</span></th><th md-column md-order-by=\"type\"><span>Last Name</span></th><th md-column md-desc><span>Email</span></th>\n<th md-column><span>Role</span></th><th md-column><span>Line of Business</span></th></tr></thead><tbody md-body><tr \nmd-row md-select=\"user\" md-on-select=\"logItem\" md-auto-select=\"options.autoSelect\" \nng-repeat=\"user in employees | filter: filter.search | orderBy: query.order \"><td md-cell>{{user.firstname}}</td><td \nmd-cell>{{user.lastname}}</td><td md-cell>{{user.email}}</td><td md-cell>{{user.roleName}}</td><td md-cell>{{user.lob}}\n</td></tr></tbody></table></md-table-container></fieldset></div></div>");
$templateCache.put("app/main/apps/settings/passwordchange/passwordchange.html","<div layout=\"row\" id=\"passwordChange\" ng-cloak=\"\" layout-fill><div layout=\"column\" class=\"page\" flex><md-card \nclass=\"default header\" layout=\"column\" layout-align=\"center left\"><h3><md-icon md-font-icon=\"icon-content-paste\">\n</md-icon></h3></md-card><md-content class=\"body\" layout=\"column\" flex layout-padding layout-margin ms-scroll><form \nnovalidate name=\"passwordChange\"><fieldset><div layout=\"row\"><div flex=\"15\"><label class=\"label\">Current Password:\n</label></div><md-input-container flex=\"15\"><label></label><input md-no-asterisk type=\"text\" type=\"password\" \nname=\"oldpassword\" ng-model=\"vm.passwordChange.OldPassword\" required></md-input-container><div flex=\"20\"><label \nclass=\"label\">New Password:</label></div><md-input-container flex=\"15\"><label></label><input md-no-asterisk \ntype=\"password\" name=\"password\" ng-model=\"vm.passwordChange.Password\" required></md-input-container><div flex=\"20\">\n<label class=\"label\">Confirm Password:</label></div><md-input-container flex=\"15\"><label></label><input md-no-asterisk \ntype=\"password\" name=\"password_confirmation\" confirm-pwd=\"vm.passwordChange.Password\" \nng-model=\"vm.passwordChange.ConfirmPassword\" required><div class=\"form-errors\" \nng-messages=\"passwordChange.password_confirmation.$error\" ng-if=\"passwordChange.password_confirmation.$touched\"><span \nclass=\"form-error\" ng-message=\"password\">Password does not match</span></div></md-input-container><md-button \nclass=\"md-raised md-accent\" ng-disabled=\"passwordChange.$invalid || passwordChange.$pristine\" \nng-click=\"vm.changePassword()\" flex=\"10\">Add</md-button></div></fieldset></form></md-content></div></div>");
$templateCache.put("app/main/apps/settings/login/login.html","<md-progress-linear class=\"overlay\" ng-show=\"processingRequest\" md-mode=\"indeterminate\" ng-value=\"please\">\n</md-progress-linear><div id=\"login-v2\" layout=\"row\" layout-align=\"start\"><div id=\"login-v2-intro\" flex hide \nshow-gt-sm><div class=\"title\"><img src=\"./assets/images/logos/logo-white.png\"></div></div><div \nng-show=\"processingRequest\" id=\"image-loading\"><div class=\"center\"><center><img \nsrc=\"./assets/images/logos/logo-white.png\"></center><div class=\"spinner-wrapper\"><div class=\"spinner\"><div \nclass=\"inner\"><div class=\"gap\"></div><div class=\"left\"><div class=\"half-circle\"></div></div><div class=\"right\"><div \nclass=\"half-circle\"></div></div></div></div></div></div></div><div id=\"login-v2-form-wrapper\" \nclass=\"flex-scrollable md-whiteframe-8dp\" ms-scroll><div id=\"login-v2-form\"><div class=\"logo md-accent-bg\" hide-gt-sm>\n<span><img src=\"./assets/images/logos/logo-white.png\"></span></div><div class=\"title\" translate=\"LOGIN_V2.TITLE\"></div>\n<form name=\"loginForm\" novalidate><md-input-container class=\"md-block\" md-no-float><input type=\"text\" \nng-model=\"vm.username\" translate translate-attr-placeholder=\"LOGIN_V2.USERNAME\" autocomplete=\"off\" required>\n</md-input-container><md-input-container class=\"md-block\" md-no-float><input type=\"password\" ng-model=\"vm.password\" \ntranslate translate-attr-placeholder=\"LOGIN_V2.PASSWORD\" required></md-input-container><md-button \nclass=\"md-raised md-accent submit-button\" type=\"submit\" aria-label=\"LOG IN\" ng-readonly=\"processingRequest\" \nng-disabled=\"processingRequest|| loginForm.$invalid || loginForm.$pristine\" ng-click=\"vm.login()\" \ntranslate=\"LOGIN_V2.LOG_IN\" translate-attr-aria-label=\"LOGIN_V2.LOG_IN\"></md-button><md-button ng-show=\"false\" \ntranslate=\"LOGIN_V2.CLEAR_STORAGE\" class=\"md-raised md-accent submit-button\" aria-label=\"LOG IN\" ng-click=\"vm.clear()\">\n</md-button></form></div></div></div>");
$templateCache.put("app/main/apps/settings/register/register.html","<div id=\"register-v2\" layout=\"row\" layout-align=\"start\"><div id=\"register-v2-intro\" flex hide show-gt-sm><div \nclass=\"title\"><img src=\"./assets/images/logos/logo-white.png\"></div></div><div id=\"register-v2-form-wrapper\" \nclass=\"flex-scrollable md-whiteframe-8dp\" layout=\"column\" flex ms-scroll><div id=\"register-v2-form\"><div \nclass=\"logo md-accent-bg\" hide-gt-sm><span>F</span></div><div class=\"title\" translate=\"REGISTER_V2.TITLE\"></div><form \nname=\"registerForm\" novalidate ng-submit=\"vm.registerUser()\"><md-input-container class=\"md-block\" md-no-float><input \nname=\"username\" ng-model=\"vm.form.firstname\" placeholder=\"First Name\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.FIRSTNAME\" required><div ng-messages=\"registerForm.username.$error\" \nrole=\"alert\"><div ng-message=\"required\"><span translate=\"REGISTER_V2.ERRORS.FIRSTNAME_REQUIRED\">\nFirst name field is required</span></div></div></md-input-container><md-input-container class=\"md-block\" md-no-float>\n<input name=\"username\" ng-model=\"vm.form.lastname\" placeholder=\"Last Name\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.LASTNAME\" required><div ng-messages=\"registerForm.username.$error\" \nrole=\"alert\"><div ng-message=\"required\"><span translate=\"REGISTER_V2.ERRORS.LASTNAME_REQUIRED\">\nLast name field is required</span></div></div></md-input-container><md-input-container class=\"md-block\" md-no-float>\n<input type=\"email\" name=\"email\" ng-model=\"vm.form.email\" placeholder=\"Email\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.EMAIL\" ng-pattern=\"/^.+@.+\\..+$/\" required><div \nng-messages=\"registerForm.email.$error\" role=\"alert\" multiple=\"multiple\"><div ng-message=\"required\"><span \ntranslate=\"REGISTER_V2.ERRORS.EMAIL_REQUIRED\">Email field is required</span></div><div ng-message=\"pattern\"><span \ntranslate=\"REGISTER_V2.ERRORS.EMAIL_MUST_VALID\">Email must be a valid e-mail address</span></div></div>\n</md-input-container><md-input-container class=\"md-block\" md-no-float><input type=\"password\" name=\"password\" \nng-model=\"vm.form.password\" placeholder=\"Password\" translate translate-attr-placeholder=\"REGISTER_V2.PASSWORD\" \nrequired><div ng-messages=\"registerForm.password.$error\" role=\"alert\"><div ng-message=\"required\"><span \ntranslate=\"REGISTER_V2.ERRORS.PASSWORD_REQUIRED\">Password field is required</span></div></div></md-input-container>\n<md-input-container class=\"md-block\" md-no-float><input type=\"password\" name=\"passwordConfirm\" \nng-model=\"vm.form.passwordConfirm\" placeholder=\"Password (Confirm)\" confirm-pwd=\"vm.form.password\" translate \ntranslate-attr-placeholder=\"REGISTER_V2.PASSWORD_CONFIRM\" required><div \nng-messages=\"registerForm.passwordConfirm.$error\" role=\"alert\"><div ng-message=\"required\"><span \ntranslate=\"REGISTER_V2.ERRORS.PASSWORD_CONFIRM_REQUIRED\">Password (Confirm) field is required</span></div></div><div \nclass=\"form-errors\" ng-messages=\"registerForm.passwordConfirm.$error\" ng-if=\"registerForm.passwordConfirm.$touched\">\n<span class=\"form-error\" ng-message=\"password\">Password does not match</span></div></md-input-container><div \nclass=\"terms\" layout=\"row\" layout-align=\"center center\"><md-checkbox name=\"terms\" ng-model=\"data.cb1\" \naria-label=\"I read and accept\" required></md-checkbox><div layout=\"row\" layout-sm=\"column\" layout-align=\"start center\">\n<span translate=\"REGISTER_V2.READ_ACCEPT\">I read and accept</span> <a href=\"#\" class=\"md-accent-color\" \ntranslate=\"REGISTER_V2.TERMS_COND\">terms and conditions</a></div></div><md-button type=\"submit\" \nclass=\"md-raised md-accent submit-button\" aria-label=\"CREATE MY ACCOUNT\" \nng-disabled=\"registerForm.$invalid || registerForm.$pristine\" translate=\"REGISTER_V2.CREATE_ACCOUNT\" \ntranslate-attr-aria-label=\"REGISTER_V2.CREATE_ACCOUNT\">CREATE MY ACCOUNT</md-button></form><div class=\"login\" \nlayout=\"row\" layout-sm=\"column\" layout-align=\"center center\"><span class=\"text\" translate=\"REGISTER_V2.ALREADY_HAVE\">\nAlready have an account?</span> <a class=\"link\" ui-sref=\"app.pages_auth_login-v2\" translate=\"REGISTER_V2.LOGIN\">Log in\n</a></div></div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-1/template-1.html","<div class=\"template-1\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" \nng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}\n</div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-2/template-2.html","<div class=\"template-2\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img\n class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div \nclass=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">\n{{card.subtitle}}</div></div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"text p-16\" ng-if=\"card.text\">{{card.text}}\n</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-10/template-10.html","<div class=\"template-10 p-16\"><div class=\"pb-16\" layout=\"row\" layout-align=\"space-between center\"><div class=\"info\">\n<div class=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h2\" \nng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"media ml-16\"><img class=\"image\" \nng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div><div \nclass=\"text\">{{card.text}}</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-3/template-3.html","<div class=\"template-3 p-16 teal-bg white-fg\" layout=\"row\" layout-align=\"space-between\"><div layout=\"column\" \nlayout-align=\"space-between\"><div class=\"info\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div \nclass=\"subtitle h3 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"cta\"><md-button \nclass=\"m-0\">{{card.cta}}</md-button></div></div><div class=\"media pl-16\"><img class=\"image\" \nng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-4/template-4.html","<div class=\"template-4\"><div class=\"info white-fg ph-16 pv-24\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}\n</div><div class=\"text\" ng-if=\"card.text\">{{card.text}}</div></div><div class=\"media\"><img class=\"image\" \nng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-5/template-5.html","<div class=\"template-5 p-16\" layout=\"row\" layout-align=\"space-between start\"><div class=\"info\"><div \nclass=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"event h2\" ng-if=\"card.event\">\n{{card.event}}</div></div><div class=\"media ml-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-6/template-6.html","<div class=\"template-6\"><div class=\"content pv-24 ph-16\"><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">\n{{card.subtitle}}</div><div class=\"title h2\" ng-if=\"card.title\">{{card.title}}</div><div class=\"text pt-8\" \nng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-7/template-7.html","<div class=\"template-7\" layout=\"row\" layout-align=\"space-between\"><div class=\"info\" layout=\"column\" \nlayout-align=\"space-between\" layout-fill flex><div class=\"p-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}\n</div><div class=\"subtitle h4 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"text h4 pt-8\" \nng-if=\"card.text\">{{card.text}}</div></div><div><md-divider></md-divider><div class=\"p-8\" layout=\"row\"><md-icon \nmd-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\">\n</md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" \nclass=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon></div></div></div><div \nclass=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" \nng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-8/template-8.html","<div class=\"template-8\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" \nalt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" \nng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}\n</div><div class=\"buttons pt-16\"><md-button class=\"m-0\">{{card.button1}}</md-button><md-button class=\"m-0 md-accent\">\n{{card.button2}}</md-button></div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-9/template-9.html","<div class=\"template-9\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img\n class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div \nclass=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">\n{{card.subtitle}}</div></div></div><div class=\"text ph-16 pb-16\" ng-if=\"card.text\">{{card.text}}</div><div \nclass=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" \nng-show=\"card.media.image\"></div><div class=\"buttons m-8\"><md-button class=\"md-icon-button mr-16\" \naria-label=\"Favorite\"><md-icon md-font-icon=\"icon-heart-outline\" class=\"s24\"></md-icon></md-button><md-button \nclass=\"md-icon-button\" aria-label=\"Share\"><md-icon md-font-icon=\"icon-share\" class=\"s24\"></md-icon></md-button></div>\n</div>");
$templateCache.put("app/core/directives/ms-stepper/templates/horizontal/horizontal.html","<div class=\"ms-stepper-horizontal\"><div class=\"ms-stepper-navigation-wrapper\"><div class=\"ms-stepper-navigation\" \nlayout=\"row\" layout-align=\"center center\"><md-button class=\"ms-stepper-navigation-item\" \nng-class=\"{\'current\': MsStepper.isStepCurrent(step.stepNumber), \'valid\': MsStepper.isStepValid(step.stepNumber), \'disabled\': MsStepper.isStepDisabled(step.stepNumber), \'optional\': MsStepper.isStepOptional(step.stepNumber)}\" \nng-click=\"MsStepper.gotoStep(step.stepNumber)\" ng-disabled=\"MsStepper.isStepDisabled(step.stepNumber)\" \nng-repeat=\"step in MsStepper.steps\" layout=\"row\" layout-align=\"start center\"><div class=\"step md-accent-bg\" \nlayout=\"row\" layout-align=\"center center\"><span \nng-if=\"!MsStepper.isStepValid(step.stepNumber) || MsStepper.isStepOptional(step.stepNumber)\">{{step.stepNumber}} \n</span><span ng-if=\"MsStepper.isStepValid(step.stepNumber) && !MsStepper.isStepOptional(step.stepNumber)\"><i \nclass=\"icon icon-check s18\"></i></span></div><div layout=\"column\" layout-align=\"start start\"><div class=\"title\">\n{{step.stepTitle|translate}}</div><div class=\"subtitle\" ng-if=\"MsStepper.isStepOptional(step.stepNumber)\">Optional\n</div></div></md-button></div></div><div class=\"ms-stepper-steps\" ng-transclude></div><div class=\"ms-stepper-controls\" \nlayout=\"row\" layout-align=\"center center\"><md-button class=\"md-accent md-raised\" ng-disabled=\"MsStepper.isFirstStep()\" \nng-click=\"MsStepper.gotoPreviousStep()\">Back</md-button><div class=\"ms-stepper-dots\"><span \nng-repeat=\"step in MsStepper.steps\" ng-class=\"{\'selected md-accent-bg\':MsStepper.currentStepNumber === $index + 1}\">\n</span></div><md-button class=\"md-accent md-raised\" ng-if=\"!MsStepper.isLastStep()\" \nng-disabled=\"!MsStepper.isStepValid(MsStepper.currentStepNumber)\" ng-click=\"MsStepper.gotoNextStep()\">Next</md-button>\n<md-button type=\"submit\" class=\"md-accent md-raised\" ng-click=\"MsStepper.resetForm()\" ng-if=\"MsStepper.isLastStep()\" \nng-disabled=\"!MsStepper.isFormValid()\">Submit</md-button></div></div>");}]);
//# sourceMappingURL=../maps/scripts/app-2ffc1747ef.js.map
