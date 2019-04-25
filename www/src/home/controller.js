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
            getActionList();
        }

        function getActionList() {
            $scope.actionList = homeService.getActionList();
        }

        /*管理slide*/
        $scope.changeSlide = function (id) {
            console.log(id);
            $scope.navList.forEach(function (element) {
                if (id == element.id) {
                    element.acticved = true;
                } else {
                    element.acticved = false;
                }
            });
        };


        $scope.goAbout = function () {
            $state.go('tab.about');
        }


    }]);