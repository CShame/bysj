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

      .state('tab.about', {
        url: '/about',
        views: {
          'tab-home': {
            templateUrl: 'src/about/about.html',
            controller: 'AboutCtrl'
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
            templateUrl: 'src/create/create.html',
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
