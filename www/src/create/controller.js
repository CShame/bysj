angular.module('starter.controllers')
    .controller('CreateCtrl', ['$scope', '$state', 'homeService', 'cameraService', '$ionicActionSheet','$timeout','myNote',
    function ($scope, $state, homeService, cameraService, $ionicActionSheet,$timeout, myNote) {

        $scope.action = {
            name: '',        // 活动名称
            host: '',        // 主办方
            tel: '',         // 联系电话
            type: '',        // 活动类型
            startTime: '',   // 活动开始时间
            endTime: '',     // 活动结束时间
            position: '',    // 活动地点
            img: 'asset/img/bg.jpg',         // 背景图片
            major: '',       // 蓝牙设置major
            minor: ''        // 蓝牙设置minor
        }

        $scope.typeList = {
            list: [{ name: "聚会" }, { name: "沙龙" }, { name: "讲座" }],
            attrName: "name",
        }

        initAction();
        function initAction(){
            $scope.action = {
                name: '',        // 活动名称
                host: '',        // 主办方
                tel: '',         // 联系电话
                type: '',        // 活动类型
                startTime: '',   // 活动开始时间
                endTime: '',     // 活动结束时间
                position: '',    // 活动地点
                img: 'asset/img/bg.jpg',         // 背景图片
                major: '',       // 蓝牙设置major
                minor: ''        // 蓝牙设置minor
            }
        }


        $scope.changeImg = function () {
            changeImg();
        }

        $scope.save = function () {
            $scope.action.type = $scope.typeList.value.name;
            console.log($scope.action);
            if(!$scope.action.name){
                myNote.myNotice('活动名称不能为空');
            } else if(!$scope.action.host){
                myNote.myNotice('主办方不能为空');
            }else if(!$scope.action.tel){
                myNote.myNotice('电话不能为空');
            }else if(!$scope.action.startTime){
                myNote.myNotice('请选择开始时间');
            }else if(!$scope.action.endTime){
                myNote.myNotice('请选择结束时间');
            }else if(!$scope.action.position){
                myNote.myNotice('活动地点不能为空');
            }else if(!$scope.action.major || !$scope.action.minor){
                myNote.myNotice('蓝牙major和minor不能为空');
            } else{
                homeService.addAction($scope.action);
                initAction();
                $state.go('tab.home');
            }
        }

        function changeImg() {
            $ionicActionSheet.show({
                buttons: [
                    { text: '从相册中选择' },
                    { text: '拍摄照片' }
                ],
                titleText: '设置头像',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        cameraService.modifyAvatar({type:1,width:720,height:360}, success, fail);
                    }
                    else if (index == 1) {
                        cameraService.modifyAvatar({type:2,width:720,height:360}, success, fail)
                    }
                    function success(data) {
                        console.log(data);
                        $timeout(function() {
                            $scope.action.img = data;                            
                        })
                        // data.response 服务器远程图片路径
                        //   if (data.responseCode == 200) {
                        //     myNote.myNotice('图片上传成功！');

                        //     $scope.data.HeadPortrait = data.response;
                        //     MemoryFactory.setCurrentUserInfo($scope.data, {isRoot: true, isCache: true, key: "userInfo"});
                        //     $scope.photo = $scope.data.HeadPortrait;
                        //     $scope.person.headStyle = {'background-image':'url('+$scope.photo+')'};
                        //     $rootScope.$broadcast('userInfoUpdate', {photo: $scope.photo});

                        //     PersonUpdate.downloadImg($scope.data.HeadPortrait, $scope.data.UserID).then(function (data) {
                        //       CacheFactory.save('localHeadPortrait', data);
                        //     });
                        //   } else {
                        //     myNote.myNotice('图片上传失败！');
                        //   }
                    }

                    function fail(err) {
                    }

                    return true;
                }
            });
        }

    }]);