angular.module('starter.controllers')
    .controller('HomeCtrl', ['$scope', '$state', 'homeService', function ($scope, $state, homeService) {

        $scope.navList = [
            { id: 0, name: '全部', acticved: 'true' },
            { id: 1, name: '报名中', acticved: 'false' },
            { id: 2, name: '报名结束', acticved: 'false' }
        ]

        // $scope.actionList = [
        //     { name: '测试', startTime: '2019-04-22 11:47', endTime: '2019-04-22 15:50', position: '山的那边海的那边', type: '聚会', img: '' },
        //     { name: '长沙理工大学考研讲座', startTime: '2019-05-22 09:00', endTime: '2019-05-22 11:00', position: '综合楼A303', type: '讲座', img: '' }
        // ]

        init();
        function init(){
            $scope.actionList = getActionList();
        }

        function getActionList() {
           return homeService.getActionList();
        }

        /*管理slide*/
        $scope.changeSlide = function (id) {
            console.log(id);
            var nowDate = new Date().getTime();
            var list = getActionList();
            $scope.navList.forEach(function (element) {
                if (id == element.id) {
                    element.acticved = true;
                } else {
                    element.acticved = false;
                }
            });

            if(id === 0){           // 全部显示
                $scope.actionList = list;
            } else if(id === 1){    // 显示报名中的
                for(var i=list.length -1; i>=0; i--){
                    if(nowDate > new Date(list[i].endTime).getTime()){
                        list.splice(i,1);
                    }
                }
                $scope.actionList = list;
            } else if(id ===2){     // 显示报名结束的
                for(var i=list.length -1; i>=0; i--){
                    if(nowDate <= new Date(list[i].endTime).getTime()){
                        list.splice(i,1);
                    }
                }
                $scope.actionList = list;
            }
        };

        $scope.goCreate = function(){
            $state.go('tab.create');
        }

        $scope.goHelp = function () {
            $state.go('tab.help');
        }

        $scope.goDetail = function(data) {
            $state.go('tab.actionDetail',{action:data});
        }

    }]);