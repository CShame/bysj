/**
 * Created by Administrator on 2016/12/21.
 */
angular.module('starter.services')

  .factory('LoginService', ['$q', 'MemoryFactory', function ($q, MemoryFactory) {

    var user = {
      userId: 10000,
      password: '123456',
      userAccount: 'hys',
      name: '何玉霜',
      tel: '13812345678',
      qq: '626778249',
      tissue: '长沙理工大学'
    }


    function Login(name, pwd) {
      var def = $q.defer();

      if (name == user.userAccount && pwd == user.password) {
        MemoryFactory.setCurrentUserInfo(user, { isRoot: true, isCache: true, key: "userInfo" });
        def.resolve(user);
      }
      // HttpXhr.getData(
      //   'AppUserInfoBLL.Login',
      //   {
      //     UserAccount : name,
      //     Password : pwd,
      //     LoginType:loginType
      //   },true
      // ).then(function (data) {
      //   if(data){
      //     MemoryFactory.setCurrentUserInfo(data.data, {isRoot: true, isCache: true, key: "userInfo"});
      //     MemoryFactory.setUserFunctions(data.data.Functions, {isRoot: true, isCache: true, key: "userFunctions"});
      //     def.resolve(data);
      //   }
      // });

      return def.promise;
    }

    function register(user){
      var def = $q.defer();

      MemoryFactory.setCurrentUserInfo(user, { isRoot: true, isCache: true, key: "userInfo" });
      def.resolve('register success');
      return def.promise;
    }


    return {
      Login: Login,
      register: register
    }

  }])

  .factory('focus', function ($timeout, $window) {
    return function (id) {
      $timeout(function () {
        var element = $window.document.getElementById(id);
        if (element)
          element.focus();
      });
    };
  })

  ;
