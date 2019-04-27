angular.module('starter.controllers')
    .controller('ParticipantCtrl', ['$scope', '$stateParams', 'myNote', 'homeService', function ($scope, $stateParams, myNote, homeService) {

        $scope.action = $stateParams.action;

        $scope.userList = [
            {
                userId: 10000,
                password: '123456',
                userAccount: 'hys',
                name: '何玉霜',
                tel: '13812345678',
                qq: '626778249',
                tissue: '长沙理工大学',
                img: 'asset/img/default.png',
                remark:'备注啦啦阿拉'
            },
            {
                userId: 10001,
                password: '123456',
                userAccount: 'CShame',
                name: '王顺',
                tel: '13812345688',
                qq: '1138158134',
                tissue: '海亿达',
                img: 'asset/img/default.png',
                remark:'我的备注就很长啦很长很长的那种哦'
            }
        ]

        $scope.showOrHide = function (data) {
            data.showDetail = !data.showDetail;
        }

    }]);
