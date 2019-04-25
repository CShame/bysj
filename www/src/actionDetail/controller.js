angular.module('starter.controllers')
    .controller('ActionDetailCtrl', ['$scope', '$state', '$stateParams', '$cordovaBeacon','$rootScope','myNote', function ($scope, $state, $stateParams, $cordovaBeacon, $rootScope, myNote) {

        //蓝牙定位
        $scope.bleLocation = null;
        $scope.isScanned = false;

        $scope.action = $stateParams.action;


        //蓝牙部分
        if (window.cordova) {

            $scope.isScanned = false;

            var brIdentifier = 'estimote';
            var brUuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
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
                        myNote.myNotice('找到蓝牙');
                        $scope.isScanned = true;
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


    }]);