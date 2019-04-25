
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.config','starter.directive'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
      if(toState.url == "/home" || toState.url == "/create" || toState.url == "/person"){ // 这三个页面不隐藏Tabs
          $rootScope.hideTabs = false;
      } else { // 其他页面英藏Tabs
          $rootScope.hideTabs = true;
      }
  });

  });
})

.config(["$ionicConfigProvider", '$httpProvider', function ($ionicConfigProvider, $httpProvider) {
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (config) {
        if (!!config.mask) {
          $rootScope.$broadcast('loading:show');
        }
        return config;
      },
      response: function (response) {
        if (!!response.config.mask) {
          $rootScope.$broadcast('loading:hide');
        }
        return response;
      }
    }
  });
  //android默认tab样式在顶部，设置为底部
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  //设置navbar上标题的位置
  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  //设置后退文本为空
  $ionicConfigProvider.backButton.text('');
  //根据平台设置返回icon
  // $ionicConfigProvider.platform.ios.backButton.icon('ion-ios-arrow-thin-left');
  // $ionicConfigProvider.platform.android.backButton.icon('ion-ios-arrow-left');
  //是否启用将上一页面的标题作为本页面返回按钮标题
  $ionicConfigProvider.backButton.previousTitleText(false);
  //关闭android端过渡动画效果
  // $ionicConfigProvider.platform.android.views.transition('none');

}])
angular.module('starter.directive', []);
angular.module('starter.controllers', []);
angular.module('starter.config', ['starter.config0']);

