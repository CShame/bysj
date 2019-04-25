/**
 * Created by Administrator on 2016/12/21.
 */
angular.module('starter.services')

  .factory('LoginService', ['$q', 'MemoryFactory', 'CacheFactory', function ($q, MemoryFactory, CacheFactory) {

    var user = {
      userId: 10000,
      password: '123456',
      userAccount: 'hys',
      name: '何玉霜',
      tel: '13812345678',
      qq: '626778249',
      tissue: '长沙理工大学'
    }

    var userList = [];


    function Login(name, pwd) {
      var def = $q.defer();
      var flag = false;

      if(!angular.fromJson(CacheFactory.get('userList'))){
        userList = [user];
        CacheFactory.save('userList', userList);
      }else{
        userList = angular.fromJson(CacheFactory.get('userList'));
      }
      for(var i=0;i<userList.length;i++){
        if(name == userList[i].userAccount  &&  pwd == userList[i].password){
          MemoryFactory.setCurrentUserInfo(userList[i], { isRoot: false, isCache: true, key: "userInfo" });
          def.resolve(userList[i]);
          break;
        }
      }

      if(!flag){
        def.reject(false);
      }

      // if (name == user.userAccount && pwd == user.password) {
      //   MemoryFactory.setCurrentUserInfo(user, { isRoot: true, isCache: true, key: "userInfo" });
      //   def.resolve(user);
      // }
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

    function register(user) {
      var def = $q.defer();
      MemoryFactory.setCurrentUserInfo(user, { isRoot: true, isCache: true, key: "userInfo" });
      userList.push(user);
      CacheFactory.save('userList', userList);
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
