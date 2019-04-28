angular.module('starter.controllers')
    .controller('AttendanceCtrl', ['$scope', '$state', '$stateParams', '$cordovaBeacon', '$rootScope', 'myNote', 'homeService', '$ionicPopup', '$filter',
    function ($scope, $state, $stateParams, $cordovaBeacon, $rootScope, myNote, homeService, $ionicPopup, $filter) {
        //蓝牙定位
        var beaconRegion = null;
        var listener = null;
        $scope.isScanned = false;

        $scope.action = homeService.getActionById($stateParams.actionId);

        $scope.attendance = {
            actionId: 0,
            userId: 0,
            time: '',
            distance: null
        }

        /**===================计时器：显示当前时间==================**/
        //时钟
        $scope.clock = {
            now: new Date()
        };

        var updateClock = function () {
            $scope.clock.now = new Date();
        };

        setInterval(function () {
            $scope.$apply(updateClock);
        }, 1000);
        /**========================================================**/

        init();
        function init() {
            if(!$scope.attendance.time){
                scanBluetooth();
            }
        }

        function punch() {
            $scope.attendance.time = $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss");
        }


        //  confirm 对话框
        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: '提示',
                template: '确认现在要签到到吗？'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    punch();
                } else {
                    console.log('You are not sure');
                }
            });
        };


        $scope.reScan = function () {
            $scope.isScanned = false;
            $scope.attendance.distance = null;
            scanBluetooth();
        }


        // 开始扫描蓝牙
        function scanBluetooth() {
            if (window.cordova) {

                $scope.isScanned = false;

                // var brIdentifier = 'estimote';
                // var brUuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
                var brIdentifier = '微信';
                var brUuid = 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825';
                var brMajor = null;
                var brMinor = null;
                var brNotifyEntryStateOnDisplay = true;
                beaconRegion = $cordovaBeacon.createBeaconRegion(brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay);

                $scope.didStartMonitoringForRegionLog = '';
                $scope.didDetermineStateForRegionLog = '';
                $scope.didRangeBeaconsInRegionLog = '';

                $cordovaBeacon.requestAlwaysAuthorization().then(function () {
                    $cordovaBeacon.startRangingBeaconsInRegion(beaconRegion);
                });

                // 蓝牙未打开提示
                if (ionic.Platform.isIOS()) {
                    //console.log(cordova.plugins.BluetoothStatus.hasBT);硬件情况
                    //console.log(cordova.plugins.BluetoothStatus.hasBTLE);
                    //console.log(cordova.plugins.BluetoothStatus.BTenabled);//开启状态
                    //cordova.plugins.BluetoothStatus.iosAuthorized//ios授权状况
                    if (!cordova.plugins.BluetoothStatus.BTenabled) {
                        myNote.myNotice('使用蓝牙定位，需要开启蓝牙哦', 2000);
                    } else if (!cordova.plugins.BluetoothStatus.iosAuthorized) {
                        myNote.myNotice('您未授权使用蓝牙哦', 2000);
                    }
                } else {
                    $cordovaBeacon.isBluetoothEnabled().then(function (isEnabled) {
                        if (!isEnabled) {
                            myNote.myNotice('使用蓝牙定位，需要开启蓝牙哦', 2000);
                        }
                    });
                }


                listener = $rootScope.$on('$cordovaBeacon:didRangeBeaconsInRegion', function (event, data) {
                    for (var i = 0; i < data.beacons.length; i++) {
                        console.log(data.beacons);
                        if (data.beacons[i].major == $scope.action.major && data.beacons[i].minor == $scope.action.minor) {
                            console.log('找到蓝呀',data.beacons[i].accuracy);
                            $scope.attendance.distance = data.beacons[i].accuracy;
                            $scope.isScanned = true;
                        }
                    }
                });

            }
        }

        $scope.$watch('isScanned', function (newV) {
            if (newV == true) {
                $cordovaBeacon.stopRangingBeaconsInRegion(beaconRegion).then(function (data) {
                    console.log(data);
                }, function (e) {
                    console.log(e);
                })
            }
        });

        $scope.$on('$destroy', function () {
            if (window.cordova) {
                // 销毁时停止扫描
                $cordovaBeacon.stopRangingBeaconsInRegion(beaconRegion).then(function (data) {
                    console.log(data);
                }, function (e) {
                    console.log(e);
                });
                listener();
                listener = null;
            }
        });

    }]);