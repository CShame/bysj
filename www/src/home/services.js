angular.module('starter.services')

    .factory('homeService', ['$q', 'MemoryFactory', 'CacheFactory', function ($q, MemoryFactory, CacheFactory) {

        var actionList = [];
        
        function getActionList() {
             actionList = angular.fromJson(CacheFactory.get('actionList')) || [];
             return actionList;
        }

        function addAction(action) {
            actionList.push(action);
            CacheFactory.save('actionList', actionList);
        }

        return {
            getActionList: getActionList,
            addAction: addAction
        }


    }]);