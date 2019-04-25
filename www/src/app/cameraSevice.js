angular.module('starter.services')
.factory('cameraService', ['MemoryFactory',function (MemoryFactory) {
    return {
      /**
       * options
       *  type: 1 or 2
       *  width:
       *  height:
       */
      modifyAvatar: function (options, success, failure) {
        var pictureSource, destinationType;
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        if (options.type == 1) {
          getLibrary();
        } else {
          getCamera();
        }

        function getCamera() {
          navigator.camera.getPicture(onSuccessPic, failure,
            {
              quality: 100,
              destinationType: destinationType.FILE_URI,
              sourceType: pictureSource.CAMERA,
              allowEdit: true,
              targetWidth: options.width || 360,
              targetHeight: options.height || 360
            }
          );
        }

        function getLibrary() {
          navigator.camera.getPicture(onSuccessPic, failure,
            {
              quality: 100,
              destinationType: destinationType.FILE_URI,
              sourceType: pictureSource.PHOTOLIBRARY,
              allowEdit: true,// todo:看下用户反响
              targetWidth: options.width || 360,
              targetHeight: options.height || 360
            }
          );
        }

        function DateFormat() {
          var date = new Date();
          var res;
          var year = date.getFullYear();
          var Month = date.getMonth() + 1;
          var day = date.getDate();
          var hour = date.getHours() + 1;
          var min = date.getMinutes();

          if (Month < 10) {
            Month = '0' + Month;
          }
          if (day < 10) {
            day = '0' + day;
          }
          if (hour < 10) {
            hour = '0' + hour;
          }
          if (min < 10) {
            min = '' + min;
          }
          res = '' + year + Month + day + hour + min;
          return res;
        }

        /*如果上传失败，优先检测put method 是否被准许*/
        function onSuccessPic(imageURI) {
        //   var user = MemoryFactory.getCurrentUserInfo();
        //   var options = new FileUploadOptions();
        //   options.fileKey = "headPortrait";
        //   options.fileName = (user.UserID || user.UserAccount) + '-' + DateFormat() + '.png';
        //   options.mimeType = "image/jpeg";
        //   options.httpMethod = 'POST';
        //   options.params = {userID : user.UserID};

        //   var ft = new FileTransfer();
        //   var mode = MemoryFactory.getMode();
        //   ft.upload(imageURI, encodeURI(baseUrl[mode]+'AppUserInfoBLL.UpdateUserHeadPortrait'), success, failure,
        //     options);
        success(imageURI);
        }

      }
    }
  }])