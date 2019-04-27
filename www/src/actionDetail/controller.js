angular.module('starter.controllers')
    .controller('ActionDetailCtrl', ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {

        $scope.action = $stateParams.action;


        $scope.goEdit = function () {
            $state.go('tab.actionEdit', { action: $scope.action });
        }

        $scope.goView = function () {
            $state.go('tab.actionView', { action: $scope.action });
        }

        $scope.goParticipant = function () {
            $state.go('tab.participant', { actionId: $scope.action.actionId });
        }

        $scope.goAttendance = function () {
            $state.go('tab.attendance', { actionId: $scope.action.actionId });
        }

        $scope.goTable = function () {
            $state.go('tab.table', { actionId: $scope.action.actionId });
        }

    }]);