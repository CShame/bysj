angular.module('starter.controllers')
    .controller('AttendanceCtrl', ['$scope', '$state', '$stateParams', '$cordovaBeacon', '$rootScope', 'myNote','homeService', function ($scope, $state, $stateParams, $cordovaBeacon, $rootScope, myNote, homeService) {
        //蓝牙定位
        $scope.bleLocation = null;
        $scope.isScanned = false;
        $scope.scanDescribe = '扫描中';

        $scope.action = homeService.getActionById($stateParams.actionId);

        //蓝牙部分
        if (window.cordova) {

            $scope.isScanned = false;

            // var brIdentifier = 'estimote';
            // var brUuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
            var brIdentifier = '微信';
            var brUuid = 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825';
            var brMajor = null;
            var brMinor = null;
            var brNotifyEntryStateOnDisplay = true;
            var beaconRegion = $cordovaBeacon.createBeaconRegion(brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay);

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


            var listener = $rootScope.$on('$cordovaBeacon:didRangeBeaconsInRegion', function (event, data) {
                for (var i = 0; i < data.beacons.length; i++) {
                    console.log(data.beacons);
                    if (data.beacons[i].major == $scope.action.major && data.beacons[i].minor == $scope.action.minor) {
                        myNote.myNotice('找到蓝牙，距离您' + data.beacons[i].accuracy + '米');
                        $scope.isScanned = true;
                        $scope.scanDescribe = '定位成功';
                    }
                }
            });

            $scope.$watch('isScanned', function (newV) {
                if (newV == true) {
                    $cordovaBeacon.stopRangingBeaconsInRegion(beaconRegion).then(function (data) {
                        console.log(data);
                    }, function (e) {
                        console.log(e);
                    })
                }
            });
        }

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


        $scope.punch = function() {
            
        }

    }]);