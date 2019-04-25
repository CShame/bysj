/**
 * Created by ws on 2017/2/17.
 */
angular.module('starter.directive')
  .directive('selectBox', ['$ionicModal', '$ionicScrollDelegate', function ($ionicModal, $ionicScrollDelegate) {
    return {
      restrict: 'E',
      templateUrl: 'src/directives/selectBox/selectBox.html',
      scope: {
        options: "=",
        callback: "&"
      },
      link: function (scope) {

        scope.$watch('options.list', function (newV) {
          if (newV && scope.options.notInit) {
            scope.seletedFont = scope.options.title;
          } else if (newV && scope.options.list.length > 0) {
            if (!!scope.options.value) {
              scope.options.index = getIndex(scope.options.list, scope.options.value);
            }
            if (!scope.options.index) {
              scope.options.index = 0;
              scope.options.value = scope.options.list[0];
            }
            if (scope.options.attrName) {
              scope.seletedFont = scope.options.list[scope.options.index][scope.options.attrName];
            } else {
              scope.seletedFont = scope.options.list[scope.options.index];
            }
            scope.selectId = scope.options.index;
          }
        });

        scope.seletedItem = function (index) {
          scope.selectId = index;
          scope.options.index = index;
          scope.options.value = scope.options.list[index];
          if (scope.options.attrName) {
            scope.seletedFont = scope.options.list[index][scope.options.attrName];
          } else {
            scope.seletedFont = scope.options.list[index];
          }
          scope.closeModel();
          if (scope.callback instanceof Function) {
            scope.callback({value: scope.options.list[index]});
          }
        };


        //打开模型
        scope.openModal = function () {
          $ionicModal.fromTemplateUrl(
            'src/directives/selectBox/model.html',
            {
              scope: scope,
              animation: 'fade-in'
            }).then(function (modal) {
            scope.modal = modal;
            scope.modal.show();
            eleScrollTo();
          });
        }


        function eleScrollTo() {
          if (scope.options.index > 7) {
            var top = (scope.options.index - 3) * 40;
            $ionicScrollDelegate.$getByHandle('scorllHandler').scrollTo(0, top, true);
          }
        }

        //关闭模型
        scope.closeModel = function () {
          scope.modal.hide();
          scope.modal.remove();
        }

        //根据value寻找index
        function getIndex(arr, obj) {
          if (obj) {
            for (var i = 0; i < arr.length; i++) {
              if (!!scope.options.attrName) {
                if (arr[i][scope.options.attrName] == obj[scope.options.attrName]) {
                  return i;
                }
              } else {
                if (arr[i] == obj) {
                  return i;
                }
              }
            }
          }
          return 0;
        };

      }
    }
  }])
;
