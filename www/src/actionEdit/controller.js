angular.module('starter.controllers')
    .controller('ActionEditCtrl', ['$scope', '$ionicHistory', '$stateParams', 'myNote','homeService', function ($scope, $ionicHistory, $stateParams, myNote, homeService) {

        $scope.action = $stateParams.action;

        $scope.typeList = {
            list: [],
            attrName: "name",
        }

        init();
        function init() {
            getTypeList();
            
        }

        function getTypeList() {
            $scope.typeList.list = homeService.getTypeList();
            for (var i = 0; i < $scope.typeList.list.length; i++) {
                if($scope.action.type == $scope.typeList.list[i].name){
                    $scope.typeList.value = $scope.typeList.list[i];
                }
            }
        }


        $scope.save = function () {
            $scope.action.type = $scope.typeList.value.name;
            console.log($scope.action);
            if (!$scope.action.name) {
                myNote.myNotice('活动名称不能为空');
            } else if (!$scope.action.host) {
                myNote.myNotice('主办方不能为空');
            } else if (!$scope.action.tel) {
                myNote.myNotice('电话不能为空');
            } else if (!$scope.action.startTime) {
                myNote.myNotice('请选择开始时间');
            } else if (!$scope.action.endTime) {
                myNote.myNotice('请选择结束时间');
            } else if (!$scope.action.position) {
                myNote.myNotice('活动地点不能为空');
            } else if (!$scope.action.major || !$scope.action.minor) {
                myNote.myNotice('蓝牙major和minor不能为空');
            } else {
                homeService.eidtAction($scope.action);
                $ionicHistory.goBack();
            }
        }


    }]);