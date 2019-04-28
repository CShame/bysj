angular.module('starter.services')

    .factory('homeService', ['$q', 'MemoryFactory', 'CacheFactory', function ($q, MemoryFactory, CacheFactory) {

        var actionList = [];
        var typeList = [
            {typeId:0, name: "聚会" },
            {typeId:1, name: "沙龙" },
            {typeId:2, name: "讲座" },
            {typeId:3, name: "峰会" },
            {typeId:4, name: "社交" }
        ];

        function getActionList() {
            actionList = angular.fromJson(CacheFactory.get('actionList')) || [];
            return actionList;
        }

        function addAction(action) {
            action.actionId = new Date().getTime();
            actionList.push(action);
            CacheFactory.save('actionList', actionList);
        }

        function eidtAction(action) {
            for (var i = 0; i < actionList.length; i++) {
                if (action.actionId === actionList[i].actionId) {
                    actionList[i] = action;
                    break;
                }
            }
            CacheFactory.save('actionList', actionList);
        }

        function getActionById(id){
            var action = null;
            for(var i=0; i<actionList.length;i++){
                if(id === actionList[i].actionId){
                    action = actionList[i];
                    break;
                }
            }
            return action;
        }


        function getTypeList() {
            return typeList;
        }

        return {
            getActionList: getActionList,
            addAction: addAction,
            eidtAction: eidtAction,
            getTypeList: getTypeList,
            getActionById: getActionById
        }


    }]);