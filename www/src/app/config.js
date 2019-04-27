/**
 * Created by Administrator on 2016/12/17 0017.
 */

angular.module('starter.config')
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'src/templates/tabs.html'
      })

      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'src/home/home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('tab.help', {
        url: '/help',
        views: {
          'tab-home': {
            templateUrl: 'src/help/help.html',
            controller: 'HelpCtrl'
          }
        }
      })

      .state('tab.actionDetail', {
        url: '/actionDetail',
        params: {
          action: null
        },
        views: {
          'tab-home': {
            templateUrl: 'src/actionDetail/actiondetail.html',
            controller: 'ActionDetailCtrl'
          }
        }
      })

      .state('tab.actionEdit', {
        url: '/actionEdit',
        params: {
          action: null
        },
        views: {
          'tab-home': {
            templateUrl: 'src/actionEdit/actionEdit.html',
            controller: 'ActionEditCtrl'
          }
        }
      })

      .state('tab.actionView', {
        url: '/actionView',
        params: {
          action: null
        },
        views: {
          'tab-home': {
            templateUrl: 'src/actionView/actionView.html',
            controller: 'ActionViewCtrl'
          }
        }
      })

      .state('tab.participant', {
        url: '/participant',
        params: {
          actionId: null
        },
        views: {
          'tab-home': {
            templateUrl: 'src/participant/participant.html',
            controller: 'ParticipantCtrl'
          }
        }
      })

      .state('tab.attendance', {
        url: '/attendance',
        params: {
          actionId: null
        },
        views: {
          'tab-home': {
            templateUrl: 'src/attendance/attendance.html',
            controller: 'AttendanceCtrl'
          }
        }
      })

      .state('tab.table', {
        url: '/table',
        params: {
          actionId: null
        },
        views: {
          'tab-home': {
            templateUrl: 'src/table/table.html',
            controller: 'TableCtrl'
          }
        }
      })

      .state('tab.person', {
        url: '/person',
        views: {
          'tab-person': {
            templateUrl: 'src/person/person.html',
            controller: 'PersonCtrl'
          }
        }
      })

      .state('tab.create', {
        url: '/create',
        views: {
          'tab-create': {
            templateUrl: 'src/actionCreate/create.html',
            controller: 'CreateCtrl'
          }
        }
      })
      ;


    var userInfo = angular.fromJson(window.localStorage.getItem('userInfo'));

    if (userInfo != null) {
      $urlRouterProvider.otherwise('/tab/home');
    } else {
      $urlRouterProvider.otherwise('/login');
    }
  }])
  ;
