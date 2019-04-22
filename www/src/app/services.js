angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'asset/img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'asset/img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'asset/img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'asset/img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'asset/img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('myNote', ["$ionicLoading", '$ionicPopup', "$timeout", '$compile', '$rootScope', function ($ionicLoading, $ionicPopup, $timeout, $compile, $rootScope) {

  function showNotice(msg) {
    setTimeout(function () {
      var node = document.getElementById('myNoteContainer');
      if (!node) {
        node = document.createElement('div');
        node.setAttribute('id', 'myNoteContainer');
        node.setAttribute('class', 'loading-container visible active');
        document.body.appendChild(node);
      }
      var compileFun = $compile('<div class="loading">' + msg + '</div>');
      var subNode = compileFun($rootScope);
      node.innerHTML = '';
      node.appendChild(subNode[0]);
    });
  }

  function hideNotice() {
    var node = document.getElementById('myNoteContainer');
    if (!!node) {
      document.body.removeChild(node);
    }
  }

  return {
    myNotice: function (msg, timeout, prev, post) {
      //$ionicLoading.show({template: msg});
      showNotice(msg);
      $timeout(function () {
        prev && prev();
        hideNotice();
        //$ionicLoading.hide();
        post && post();
      }, timeout || 1500);
      return false;
    },
    cancel: function () {
      //$ionicLoading.hide();
      hideNotice();
    },
    showPopup: function (title, content, callback) {
      $ionicPopup.alert({
        title: title,
        template: content,
        okText: '我知道了',
        cssClass: 'infoPopup'
      }).then(function () {
        callback && callback();
      });
    }
  }
}])

.factory('CacheFactory', ['$window', function ($window) {
  var save = function (key, value) {
    if (value != null) {
      $window.localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value);
    } else {
      deleteItem(key);
    }
  };
  var get = function (key) {
    return $window.localStorage.getItem(key) || null;
  };
  var removeAll = function () {
    var exclude = ['mode', 'last_update_files', 'last_update_time', 'manifest'];
    for (var item in $window.localStorage) {
      if (exclude.indexOf(item) == -1) {
        deleteItem(item);
      }
    }
  };

  var deleteItem = function (key) {
    $window.localStorage.removeItem(key);
  };

  return {
    save: save,
    get: get,
    deleteItem: deleteItem,
    removeAll: removeAll
  };
}])

.factory('MemoryFactory', ['$rootScope', 'CacheFactory', 'util', function ($rootScope, CacheFactory, util) {
  /*
   1.保存在内存当中的值，在此一一列举，便于查阅和扩展
   2.扩展时必须注意，此参数是否需要挂载到RootScope下，为true表示挂载
   * */
  var memoryInfo = {
    currentUserInfo: null,//当前登录用户
  }

  function emptyMemory() {
    for (var attr in memoryInfo) {
      memoryInfo[attr] = null;
    }
  }


  //是否需要挂载到RootScope
  function addToRoot(isRoot, key, value) {
    if (typeof isRoot === 'boolean' && isRoot === true && typeof key === 'string') {
      $rootScope[key] = value;
    }
  }

  //是否需要存入cache
  function addToCache(isCache, key, value) {
    if (typeof isCache === 'boolean' && isCache === true && typeof key === 'string') {
      CacheFactory.save(key, value);
    }
  }

  function add(value, option) {
    angular.extend(defaultOption, option);
    addToRoot(defaultOption.isRoot, defaultOption.key, value);
    addToCache(defaultOption.isCache, defaultOption.key, value);
    defaultOption = { key: "default", isRoot: false, isCache: false };
  }

  var defaultOption = { key: "default", isRoot: false, isCache: false };

  //设置当前登录用户
  function setCurrentUserInfo(userInfo, option) {
    memoryInfo.currentUserInfo = userInfo;
    add(userInfo, option);
  }

  //当前用户信息
  function getCurrentUserInfo() {
    if (!memoryInfo.currentUserInfo) {
      memoryInfo.currentUserInfo = angular.fromJson(CacheFactory.get('userInfo'));
    }
    return memoryInfo.currentUserInfo;
  }


  return {
    setCurrentUserInfo: setCurrentUserInfo,
    getCurrentUserInfo: getCurrentUserInfo,
  }
}])

.factory('util', [function () {
  function getFromList(list, key, v) {
    if (Array.isArray(list)) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][key] === v) {
          return { item: i, value: list[i] };
        }
      }
    }
    return null;
  }

  /**
   * 获取对象数组中的  符合条件的第一个对象
   * 返回 t*/
  function getitem(list, key, v) {
    if (Array.isArray(list)) {
      return list.find(function (t) {
        return t[key] === v;
      })
    }
    return null;
  }

  /**
   * 获取对象数组中的  符合条件的第一个对象
   * 返回下标*/
  function getindex(list, key, v) {
    if (Array.isArray(list)) {
      return list.findIndex(function (t) {
        return t[key] === v;
      })
    }
    return null;
  }

  /*对象数组根据属性key排序
   * type>0 升序，type<=0 降序*/
  function sort(list, key, type) {
    if (type) {
      return list.sort(function (before, next) {
        return before[key] - next[key];
      })
    } else {

      return list.sort(function (before, next) {
        return next[key] - before[key];
      })
    }

  }

  function checkForm(list) {
    var res = {};
    list.map(function (item) {
      if (item.ControlType === 1 && Array.isArray(item.val)) {
        item.showVal = item.val.join(':');
        if (!!item.showVal) {
          res[item['Key']] = item.showVal;
        }
      } else if (item.ControlType === 3) {
        item.showVal = typeof item.value === 'object' ? item.value.Name : item.value;
        res[item['Key']] = typeof item.value === 'object' ? item.value.Value : item.value;
      }
    });
    return res;
  }

  function isEmptyObject(e) {
    var t;
    for (t in e) {
      return true;
    }
    return false
  }

  function transform(list) {
    var res = {};
    for (var i = 0; i < list.length; i++) {
      res[list[i].key] = list[i].value;
    }
    return res;
  }

  return {
    getFromList: getFromList,
    /*      getindex:getindex,
     getitem:getitem,*/
    isEmptyObject: isEmptyObject,
    checkForm: checkForm,
    transform: transform
  }
}])

.factory('setComponent', [function () {
  var i = 0;

  function getKey() {
    i++;
    return 'key' + i;
  }

  return {
    /*
     * list Array :源数组
     * child Array :需遍历的子属性集合
     * */
    setCp: function (list, child) {
      angular.forEach(list, function (data) {
        data.ComponentID = getKey();
        if (angular.isArray(child)) {
          for (var i = 0; i < child.length; i++) {
            if (!!data[child[i]]) {
              for (var j = 0; j < data[child[i]].length; j++)
                data[child[i]][j].ComponentID = getKey();
            }
          }
        }
      });
      return list;
    },
    getUnique: getKey
  }
}])

;
