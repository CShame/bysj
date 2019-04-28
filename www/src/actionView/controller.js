angular.module('starter.controllers')
    .controller('ActionViewCtrl', ['$scope', '$ionicHistory', '$stateParams', 'myNote', 'homeService', function ($scope, $ionicHistory, $stateParams, myNote, homeService) {

        $scope.action = $stateParams.action;

        $scope.callHost = function(tel){
            window.open('tel:' + tel);
        }

    }]);
