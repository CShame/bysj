angular.module('starter.controllers')
    .controller('HomeCtrl', ['$scope','$state', function ($scope, $state) {

        $scope.navList = [
            { id: 0, name: '全部', acticved: 'true' },
            { id: 1, name: '报名中', acticved: 'false' },
            { id: 2, name: '报名结束', acticved: 'false' }
        ]

        $scope.actionList = [
            {name:'测试'}
        ]

        /*管理slide*/
        $scope.changeSlide = function (id) {
            console.log(id);
            $scope.navList.forEach( function(element) {
                if(id == element.id){
                    element.acticved = true;
                } else {
                    element.acticved = false;
                }
            });

        };


        $scope.goAbout = function() {
            $state.go('tab.about');
        }


    }]);