/**
 * Created by Administrator on 2016/12/19.
 */
angular.module('starter.directive')
    .directive('slideList', ['setComponent',function (setComponent) {
        return {
            restrict: "E",
            templateUrl: "src/directives/slideList/slideList.html",
            replace: false,
            scope: {slideList: "=", changeSlide: "&"},
            link: function (scope) {
                scope.currentIndex=0;

                scope.id=setComponent.getUnique();

                scope.tip_line_run = function (index, type) {
                    //确定当前显示页面
                    scope.currentIndex=index;
                    var obj = angular.element(document.querySelector('#'+scope.id));
                    obj.css({"left": (index/scope.slideList.length) * 100 + "%", "transition": "left 0.8s"});
                    //面板显示
                    if (!type) {
                        scope.changeSlide({id: scope.slideList[index].id});
                    }
                };

                scope.$on('slideBarChange', function (ele, data) {
                    scope.tip_line_run(data, 'touch');
                });
            }
        }
    }])
;
