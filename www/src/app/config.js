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
  
    // Each tab has its own nav history stack:
  
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'src/templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })
  
    .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'src/templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'src/templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })
  
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'src/templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
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
    ;


    var userInfo = angular.fromJson(window.localStorage.getItem('userInfo'));

    if (userInfo != null) {
        $urlRouterProvider.otherwise('/tab/home');
    } else {
      $urlRouterProvider.otherwise('/login');
    }
  }])
;
