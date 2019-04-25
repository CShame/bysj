angular.module('starter.controllers')
    .controller('PersonCtrl', ['$scope','$state','CacheFactory', function ($scope, $state,CacheFactory) {


            $scope.exit = function () {
                CacheFactory.removeAll();
                setTimeout(function(){
                  ionic.Platform.exitApp();
                }, 100);
            }
    }]);