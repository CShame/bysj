/**
 * Created by Administrator on 2016/12/21.
 */
angular.module('starter.controllers')

  .controller('LoginCtrl', ['$scope', 'LoginService', 'CacheFactory', 'myNote', '$state', 'MemoryFactory', '$ionicScrollDelegate', '$ionicModal', 'focus', '$rootScope', '$ionicPopup', '$timeout',
    function ($scope, LoginService, CacheFactory, myNote, $state, MemoryFactory, $ionicScrollDelegate, $ionicModal, focus, $rootScope, $ionicPopup, $timeout) {

      //登录方式（0：账号密码登录，1：短信登录，2：微信登录）
      $scope.loginType = 0;

      $scope.user = {};
      //先渲染界面
      $scope.selectedIndustry = 'others';

      //不同行业登录的样式
      var industryType = {
        "others": { 'color': '#F4964B', 'description': '每天与我同在，安心成就梦想' }
      };

      focusInput();

      $scope.pageStyle = {};

      setStyle($scope.selectedIndustry);

      function setStyle(type) {
        // $scope.pageStyle.bacImgsStyle = { background: industryType[type].color };
        $scope.pageStyle.submitStyle = { color: industryType[type].color };
      }

      var hideKeyboardOpen = angular.element(document.querySelectorAll(".hide-keyboard-open"));

      $scope.showKeyboard = function () {
        hideKeyboardOpen.css({ 'width': '0' });
      };

      window.addEventListener("native.keyboardshow", function (e) {
        hideKeyboardOpen.css({ 'width': '0' });
        $ionicScrollDelegate.$getByHandle('loginScroll').resize();
      });

      window.addEventListener("native.keyboardhide", function (e) {
        $ionicScrollDelegate.$getByHandle('loginScroll').resize();
        hideKeyboardOpen.css({ 'width': '33%' });
      });

      function focusInput() {
        focus('inputname');
      }

      $scope.loginIn = function (valid) {
        console.log(valid,$scope.user);
        if ($scope.user.UserAccount == undefined && $scope.user.Password == undefined) {
          console.log(valid,$scope.user);
          myNote.myNotice("用户名和密码不能为空!");
          return;
        }
        else if ($scope.user.UserAccount == undefined) {
          myNote.myNotice("用户名不能为空!");
          return;
        }
        else if ($scope.user.Password == undefined) {
          myNote.myNotice("密码不能为空!");
          return;
        }

        LoginService.Login($scope.user.UserAccount, $scope.user.Password).then(function (data) {
          console.log(data);
          $state.go('tab.home');
        });
      };

      
      $scope.cancel = function () {
        $scope.modal.hide();
      };


      // 跳转到注册
      $scope.registerUser = function () {
        console.log('register');
        $state.go('register');
      }

    }])


  .controller('registerCtrl', ['$scope', 'LoginService','myNote','$state',
    function ($scope, LoginService, myNote, $state) {
      $scope.user = {
        userId: 10001,
        userAccount: '',
        password: '',
        password2: '',
        name: '',
        tel: '',
        qq: '',
        tissue: ''
      }

      $scope.register = function (valid) {
        console.log(valid,$scope.user);
        if(!$scope.user.userAccount){
          myNote.myNotice('用户名不能为空！');
        } else if(!$scope.user.password){
          myNote.myNotice('密码不能为空');
        } else if($scope.user.password != $scope.user.password2){
          myNote.myNotice('两次输入密码不一致');
        } else if(!$scope.user.name){
          myNote.myNotice('昵称不能为空');
        }  else if(!$scope.user.qq){
          myNote.myNotice('QQ不能为空');
        }  else if(!$scope.user.tel){
          myNote.myNotice('电话不能为空');
        } else if(!isTel($scope.user.tel)){
          myNote.myNotice('电话号码格式不正确');
        } else if(!$scope.user.tissue){
          myNote.myNotice('组织或公司不能为空');
        } else{
          LoginService.register($scope.user).then(function (data) {
            console.log(data);
            myNote.myNotice('您已经成功注册！');
            $state.go('tab.home');
          });
        }

      }

      //正则表达式验证手机号码
      function isTel(Tel) {
        var re = new RegExp(/^1[0-9]{10}$/);
        var retu = re.test(Tel);
        if (retu) {
          return true;
        } else {
          return false;
        }
      }

    }])

  ;
