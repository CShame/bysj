/**
 * Created by Administrator on 2016/12/21.
 */
angular.module('starter.config0',[])
  .config(["$stateProvider",function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'src/login/login.html',
        controller: 'LoginCtrl'
      })

      .state('register',{
        url: '/register',
        templateUrl: 'src/login/register.html',
        controller: 'registerCtrl'
      })
  }])
;
