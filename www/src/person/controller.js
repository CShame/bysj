angular.module('starter.controllers')
    .controller('PersonCtrl', ['$scope', '$state', 'MemoryFactory','CacheFactory', function ($scope, $state, MemoryFactory,CacheFactory) {

        $scope.person = MemoryFactory.getCurrentUserInfo();

        var defaultPhoto = 'asset/img/default.png';


        init();
        function init() {
            if($scope.person.img){
                $scope.personStyle = {
                    imgStyle:{'background-image':'url('+ $scope.person.img +')'},
                }
            } else {
                $scope.personStyle = {
                    imgStyle:{'background-image':'url('+defaultPhoto+')'},
                }
            }
        }

        $scope.exit = function () {
            CacheFactory.removeAll();
            setTimeout(function () {
                ionic.Platform.exitApp();
            }, 100);
        }
    }]);