﻿'use strict';
angular.module('starter.directive')
  .service('timePickerService', [function () {
    var _this = this;
    //页面中选择器数量 default : 0
    _this.globalId = 0;
    return _this;
  }])
  /*日期时间选择*/
  .directive('timePicker', [
    '$timeout',
    '$compile', '$ionicScrollDelegate', '$ionicBackdrop', '$q', 'timePickerService',
    function ($timeout, $compile, $ionicScrollDelegate, $ionicBackdrop, $q, timePickerService) {
      return {
        template: '<div>{{selectDateTime.show}}</div>',
        // template: '<input type="text" ng-model="selectDateTime.show">',
        restrict: 'AE',
        replace: true,
        scope: {
          timePickerResult: '=', //双向绑定
          loadDateTime: '=',  // 用于从服务端加载(或其他方式加载时间,反正是延迟的就对了) 初始 时间日期数值  //要配合options 中的loadLazy 属性使用  如果默认时间是从服务端加载回来的
          //要做如下设置  <time-picker  load-date-time="data.dateTime" loadLazy="true" time-picker-result="result"></time-picker>
          //即 loadLazy 设置为true(默认是false)标识时间数据延迟加载  data.dateTime 是从服务端加载回来的时间数据
          resetTime: '='
        },
        link: function (scope, elm, attrs) {
          var globalId = ++timePickerService.globalId;
          var dateTimeNow = new Date();
          var tem = "<div class='pickerContainer datetimeactive'>" +
            "<div class='main'>" +
            "<div  class='header'>{{options.title}}</div>"
            + "<div class='body'>"
            + "<div class='selectedLineYear'></div>"
            // +"<div class='selectedLineMonth'></div>"
            // +"<div class='selectedLineDate'></div>"
            + "<div class='row row-no-padding'>" +
            "<div class='col col-10'></div>" +
            "<div class='col'  ng-if='!options.hideYear' ><ion-scroll  on-scroll='scrollingEvent(\"year\")' delegate-handle='yearScroll_" + globalId + "' scrollbar-y='false' class='yearContent'>" + "<ul>" + "<li ng-class='{\"optionSelected\":year.selected}' ng-click='selectEvent(\"year\",$index)' ng-repeat='year in yearList'>{{year.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
            "<div class='col'  ng-if='!options.hideMonth' ><ion-scroll  on-scroll='scrollingEvent(\"month\")' delegate-handle='monthScroll_" + globalId + "' scrollbar-y='false' class='monthContent'>" + "<ul>" + "<li  ng-class='{\"optionSelected\":month.selected}' ng-click='selectEvent(\"month\",$index)' ng-repeat='month in monthList'>{{month.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
            "<div class='col ' ng-if='!options.hideDate' ><ion-scroll on-scroll='scrollingEvent(\"date\")' delegate-handle='dateScroll_" + globalId + "' scrollbar-y='false' class='dateContent'>" + "<ul>" + "<li  ng-class='{\"optionSelected\":date.selected}' ng-click='selectEvent(\"date\",$index)' ng-repeat='date in dateList'>{{date.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
            "<div class='col ' ng-if='!options.hideTime' ><ion-scroll on-scroll='scrollingEvent(\"time\")' delegate-handle='timeScroll_" + globalId + "' scrollbar-y='false' class='timeContent'>" + "<ul>" + "<li  ng-class='{\"optionSelected\":time.selected}' ng-click='selectEvent(\"time\",$index)' ng-repeat='time in timeList'>{{time.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
            "<div class='col col-10'></div>" +
            "</div>"
            + "<div class='body_center_highlight'></div>" +
            "</div>" +
            "<div class='footer'>" +
            "<span ng-click='cancel()'>取消</span><span ng-click='ok()'>确定</span>" +
            "</div>" +
            "</div>" +
            "</div>";
          // 配置 教程  ！！！！！！！！   time-picker-result 这个选项是必须配置的 用来接收选择结果 其他的可不用 使用默认配置
          //options 中的参数  都可在页面配置  如
          // <time-picker
          // timeSpan="30"
          // DateTime="2012-20-09 10:30"  ！！！注意这里  时间部分的设置 要 和参数中的 timespan 相对应 如 timeSpan 为 15 时 则生成的时间 列表 是 10:00 10:15 10:30 10:45.... 这时就要求 分钟数要相对 如不能设置 为 10:18
          // title="我是程序员"
          // time-picker-result="model.result">
          // </time-picker>
          var options = {
            title: attrs.title || "时间选择",
            height: 60,// 每个滑动 li 的高度 这里如果也配置的话 要修改css文件中的高度的定义
            timeNum: parseInt(attrs.timenum) || 24,//可选时间数量
            yearStart: (attrs.yearstart && parseInt(attrs.yearstart)) || dateTimeNow.getFullYear() - 20,//开始年份
            yearEnd: (attrs.yearend && parseInt(attrs.yearend)) || dateTimeNow.getFullYear() + 20,  //结束年份
            monthStart: 12,//开始月份
            monthEnd: 1,//结束月份
            DateTime: attrs.datetime && new Date(attrs.datetime) || dateTimeNow, //开始时间日期  不给默认是当天
            timeSpan: attrs.timespan && parseInt(attrs.timespan) || 15, //时间间隔 默认 15分钟一个间隔 15/30
            minuteSkip: attrs.minuteskip && parseInt(attrs.minuteskip),//当前时间多少分钟后 可选 15 30  ！！！注意 这个设置会覆盖 datetime中设定的时间部分的值
            loadLazy: attrs.loadlazy || false,  //标识默认的时间数据是否从服务端加载回来的
            hideYear: attrs.hideyear || false, //选择器中隐藏年份选择栏
            hideMoth: attrs.hidemoth || false,//选择器中隐藏月份选择栏
            hideDate: attrs.hidedate || false,//选择器中隐藏日期选择栏
            hideTime: attrs.hidetime && JSON.parse(attrs.hidetime) || false,//选择器中隐藏时间选择栏
            showTimeFirstOff: attrs.attrshowtimefirstoff || true     //一开始是否显示时间
          };
          scope.options = options;
          scope.yearScrollTimer = null; //年份滑动定时器
          scope.monthScrollTimer = null; //月份滑动定时器
          scope.dateScrollTimer = null; //日期滑动定时器
          scope.timeScrollTimer = null; //时间滑动定时器
          scope.dateList = [];
          scope.timeList = [];
          scope.yearList = [];
          scope.monthList = [];
          scope.selectDateTime = {
            year: {item: null, index: 0},
            month: {item: null, index: 0},
            date: {item: null, index: 0},
            time: {item: null, index: 0},
            show: " --请选择时间--"
          };
          scope.specialDateTime = {
            bigMoth: [1, 3, 5, 7, 8, 10, 12],
            isBigMonth: function (month) {
              var length = this.bigMoth.length;
              while (length--) {
                if (this.bigMoth[length] == month) {
                  return true;
                }
              }
              return false;
            },
            isLoopYear: function (year) { //是否是闰年
              return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
            }
          };
          if (options.loadLazy) {
            scope.$watch("loadDateTime", function () {
              if (scope.loadDateTime) {
                var temp = angular.copy(scope.loadDateTime).replace(/-/g, '/');
                options.DateTime = new Date(temp);
                scope.options = options;
                init(options);
              }
            });
          } else {
            scope.options = options;
            init(options);
          }

          scope.$watch('resetTime', function () {
            if (scope.resetTime == true) {
              scope.selectDateTime.show = " --请选择时间--";
              scope.timePickerResult = null;
              scope.resetTime = false;
            }
          });

          elm.on("click", function () {
            show();
            $timeout(function () {
              scrollToElm(scope.yearScroll, scope.yearList[scope.selectDateTime.year.index - 1]);
              scrollToElm(scope.monthScroll, scope.monthList[scope.selectDateTime.month.index - 1]);
              scrollToElm(scope.dateScroll, scope.dateList[scope.selectDateTime.date.index - 1]);
              scrollToElm(scope.timeScroll, scope.timeList[scope.selectDateTime.time.index - 1]);
            }, 300);
          });
          //滑动Event
          scope.scrollingEvent = function (type) {

            var opEntity = getOperateEntity(type);
            //当前存在滑动则取消
            scope[opEntity.scrollTimer] && $timeout.cancel(scope[opEntity.scrollTimer]);
            var posi = scope[opEntity.scrollHandler].getScrollPosition();
            var index = Math.abs(Math.round(posi.top / scope.options.height));
            if (posi.top == index * scope.options.height) {
              updateSelect(index + 1, type);
            } else {
              scope[opEntity.scrollTimer] = $timeout(function () {
                posi.top = index * 60;
                updateSelect(index + 1, type);
                scrollToPosi(scope[opEntity.scrollHandler], posi);
              }, 100);
            }
          }
          //点击Event
          scope.selectEvent = function (type, index) {
            var opEntity = getOperateEntity(type);
            if (index > 0 && index <= scope[opEntity.data].length - 1) {
              scrollToElm(scope[opEntity.scrollHandler], scope[opEntity.data][index - 1]);
            }
          }

          //初始化
          function init(options) {
            // initYear(options);
            // initMoth(options);
            // initDate(options);
            // initTime(options);
            options.hideYear ? null : initYear(options);
            options.hideMoth ? null : initMoth(options);
            options.hideDate ? null : initDate(options);
            options.hideTime ? null : initTime(options);
            tem = angular.element(tem);
            $compile(tem)(scope);
            angular.element(document.body).append(tem);
            // scope.yearScroll = $ionicScrollDelegate.$getByHandle("yearScroll_" + globalId);
            // scope.monthScroll = $ionicScrollDelegate.$getByHandle("monthScroll_" + globalId);
            // scope.dateScroll = $ionicScrollDelegate.$getByHandle("dateScroll_" + globalId);
            // scope.timeScroll = $ionicScrollDelegate.$getByHandle("timeScroll_" + globalId);
            if (options.showTimeFirstOff === true) {
              getSelectDateTime();
              setSelectDateTimeShow();
            }
          }

          //年份初始化
          function initYear(options) {
            scope.yearScroll = $ionicScrollDelegate.$getByHandle("yearScroll_" + globalId);
            var defaultYear = options.DateTime.getFullYear();
            var yearSpan = options.yearEnd - options.yearStart;
            var text, data, top, item, defaultItem, defaultIndex;
            prependLi(scope.yearList, 1, "b")
            for (var i = 0; i <= yearSpan; i++) {
              text = options.yearStart + i;
              data = options.yearStart + i;
              top = options.height + scope.yearList[scope.yearList.length - 1].top;
              item = createDateTimeLi(0, top, data, data == defaultYear, text);
              if (data == defaultYear) {
                defaultItem = item;
                defaultIndex = scope.yearList.length;
              }
              scope.yearList.push(item);
            }
            //设置默认选择
            scope.selectDateTime.year.item = defaultItem;
            scope.selectDateTime.year.index = defaultIndex;
            prependLi(scope.yearList, 1, "e")
          }

          //月份初始化
          function initMoth(options) {
            scope.monthScroll = $ionicScrollDelegate.$getByHandle("monthScroll_" + globalId);
            var defaultMonth = options.DateTime.getMonth() + 1 == 0 ? 12 : prependZero(options.DateTime.getMonth() + 1, 10);
            var text, data, original, top, item, defaultItem, defaultIndex;
            prependLi(scope.monthList, 1, "b")
            for (var i = 1; i <= 12; i++) {
              original = i;
              data = prependZero(i, 10);
              text = prependZero(i, 10) + "";
              top = options.height + scope.monthList[scope.monthList.length - 1].top;
              item = createDateTimeLi(0, top, data, data == defaultMonth, text);
              if (data == defaultMonth) {
                defaultItem = item;
                defaultIndex = scope.monthList.length;
              }
              scope.monthList.push(item);
            }
            //设置默认选择
            scope.selectDateTime.month.item = defaultItem;
            scope.selectDateTime.month.index = defaultIndex;
            prependLi(scope.monthList, 1, "e")
          }

          //日期初始化
          function initDate(options) {
            scope.dateScroll = $ionicScrollDelegate.$getByHandle("dateScroll_" + globalId);
            //开始时间
            var defaultDate = prependZero(options.DateTime.getDate(), 10);
            var text, data, top, item, defaultItem, defaultIndex;
            var dateNum = getDateNum(options.DateTime.getFullYear(), options.DateTime.getMonth() + 1);
            prependLi(scope.dateList, 1, "b");
            for (var i = 1; i <= dateNum; i++) {
              data = prependZero(i, 10);
              text = prependZero(i, 10) + "";
              top = options.height + scope.dateList[scope.dateList.length - 1].top;
              item = createDateTimeLi(0, top, data, data == defaultDate, text);
              if (data == defaultDate) {
                defaultItem = item;
                defaultIndex = scope.dateList.length;
              }
              scope.dateList.push(item);
            }
            //设置默认选择
            scope.selectDateTime.date.item = defaultItem;
            scope.selectDateTime.date.index = defaultIndex;
            prependLi(scope.dateList, 1, "e");
          }

          //时间初始化
          function initTime(options) {
            scope.timeScroll = $ionicScrollDelegate.$getByHandle("timeScroll_" + globalId);
            prependLi(scope.timeList, 1, "b");
            var timeStart = 0  //options.DateTime.getHours();
            for (var i = 0; i < options.timeNum; i++) {
              var t = timeStart + i;
              if (t >= 24) {
                t = t - 24;
                t = prependZero(t, 10);
              } else if (t < 10) {
                t = prependZero(t, 10);
              }
              //按时间间隔来生产时间li
              for (var j = 0; j < 60 / (options.timeSpan); j++) {
                var top = options.height + scope.timeList[scope.timeList.length - 1].top;
                var data = t + ":" + (j * options.timeSpan == 0 ? "00" : j * options.timeSpan);
                scope.timeList.push(createDateTimeLi(0, top, data, false, data));
              }
            }
            prependLi(scope.timeList, 1, "e");
            //获取默认选择时间
            var defaultSelectTime = getDefaultSelectTime(options);
            angular.forEach(scope.timeList, function (item, index) {
              if (item.data == defaultSelectTime) {
                item.selected = true;
                scope.selectDateTime.time.item = item;
                scope.selectDateTime.time.index = index;
                return;
              }
            });
          }

          //计算默认的选择时间
          function getDefaultSelectTime(options) {
            var hour;
            var minu;
            //不设置 或者默认时间 除以 时间间隔的(timeSpan) 不为整数的
            if (options.minuteSkip || parseInt((options.DateTime.getMinutes() / options.timeSpan)) != (options.DateTime.getMinutes() / options.timeSpan)) {
              options.minuteSkip = options.minuteSkip || options.timeSpan;
              var datetimeNow = options.loadLazy ? options.DateTime : new Date();
              hour = datetimeNow.getHours();
              minu = datetimeNow.getMinutes();
              minu = minu + options.minuteSkip;
              var span = minu - 60;
              var spanNum;
              if (span >= 0) {
                hour += 1;
                spanNum = Math.floor(span / options.timeSpan);
              } else {
                spanNum = Math.floor(minu / options.timeSpan);
              }
              switch (spanNum) {
                case 1:
                  minu = options.timeSpan;
                  break;
                case 2:
                  minu = options.timeSpan * 2;
                  break;
                case 3:
                  minu = options.timeSpan * 3;
                  break;
                case 4:
                  minu = options.timeSpan * 4;
                default :
                  minu = 0;
                  break;
              }
              hour += parseInt(minu / 60);
              minu = minu % 60;
            } else {
              hour = options.DateTime.getHours();
              minu = options.DateTime.getMinutes();
            }
            hour == 24 && hour--;
            return prependZero(hour, 10) + ":" + prependZero(minu, 10);
          }

          function prependZero(data, num) {
            return data >= num ? data : "0" + data;
          }

          function createDateTimeLi(left, top, data, selected, text) {
            var li = {left: left, top: top, data: data, selected: selected, text: text};
            return li;
          }

          function prependLi(arr, num, loc) {
            loc = loc || "b";
            switch (loc) {
              case "b":
                for (var i = 0; i < num; i++) {
                  arr.push(createDateTimeLi(0, options.height * i, "", false, ""));
                }
                break;
              case "e":
                //最后那个li元素的 top
                var lastPosiTop = arr[arr.length - 1].top;
                for (var j = 0; j < num; j++) {
                  arr.push(createDateTimeLi(0, (options.height * (i + 1) + lastPosiTop), "", false, ""));
                }
                break;
            }
          }

          //滑动到指定元素
          function scrollToElm(scorllHandler, elm) {
            scorllHandler && scorllHandler.scrollTo(elm.left, elm.top, true);
          }

          //滑动到指定位置
          function scrollToPosi(scorllHandler, posi) {
            scorllHandler && scorllHandler.scrollTo(posi.left, posi.top, true);
          }

          function updateSelect(index, type) {
            switch (type) {
              case "year":

                //强制
                $timeout(function () {
                  scope.selectDateTime.year.item.selected = false;
                  scope.yearList[index].selected = true;
                  scope.selectDateTime.year.item = scope.yearList[index];
                  scope.selectDateTime.year.index = index;
                  resettingDate(scope.selectDateTime.year.item.data, parseInt(scope.selectDateTime.month.item.data));  //年份变化 重置日期栏
                });
                break;
              case "month":

                //强制
                $timeout(function () {
                  scope.selectDateTime.month.item.selected = false;
                  scope.monthList[index].selected = true;
                  scope.selectDateTime.month.item = scope.monthList[index];
                  scope.selectDateTime.month.index = index;
                  resettingDate(scope.selectDateTime.year.item.data, parseInt(scope.selectDateTime.month.item.data));  //月份变化 重置日期栏
                });
                break;
              case "date":
                $timeout(function () {
                  scope.selectDateTime.date.item.selected = false;
                  scope.dateList[index].selected = true;
                  scope.selectDateTime.date.item = scope.dateList[index];
                  scope.selectDateTime.date.index = index;
                });
                break;
              case "time":
                $timeout(function () {
                  scope.selectDateTime.time.item.selected = false;
                  scope.timeList[index].selected = true;
                  scope.selectDateTime.time.item = scope.timeList[index];
                  scope.selectDateTime.time.index = index;
                });
                break;
            }
          }

          //选中时间展示
          function setSelectDateTimeShow() {
            // var yearTxt = scope.selectDateTime.year.item.text;
            // var monthTxt = scope.selectDateTime.month.item.text;
            // var dateTxt = scope.selectDateTime.date.item.text;
            // var timeTxt = scope.selectDateTime.time.item.text;
            // scope.selectDateTime.show = (scope.options.hideYear ? "" : yearTxt + "-" ) + (scope.options.hideMoth ? "" : monthTxt + "-") + (scope.options.hideDate ? "" : dateTxt + " ") + (scope.options.hideTime ? "" : timeTxt);
            scope.selectDateTime.show = (scope.options.hideYear ? "" : scope.selectDateTime.year.item.text + "-" )
              + (scope.options.hideMoth ? "" : scope.selectDateTime.month.item.text + "-")
              + (scope.options.hideDate ? "" : scope.selectDateTime.date.item.text)
              + (scope.options.hideTime ? "" : " " + scope.selectDateTime.time.item.text);

          }

          //获取选中的datetime
          function getSelectDateTime() {
            // var year, month, date, time;
            // for (var i = 0; i < scope.yearList.length; i++) {
            //     if (scope.yearList[i].selected) {
            //         year = scope.yearList[i].data;
            //         scope.selectDateTime.year.item = scope.yearList[i];
            //         scope.selectDateTime.year.index = i;
            //         break;
            //     }
            // }
            // for (var i = 0; i < scope.monthList.length; i++) {
            //     if (scope.monthList[i].selected) {
            //         month = scope.monthList[i].data;
            //         scope.selectDateTime.month.item = scope.monthList[i];
            //         scope.selectDateTime.month.index = i;
            //         break;
            //     }
            // }
            // for (var i = 0; i < scope.dateList.length; i++) {
            //     if (scope.dateList[i].selected) {
            //         date = scope.dateList[i].data;
            //         scope.selectDateTime.date.item = scope.dateList[i];
            //         scope.selectDateTime.date.index = i;
            //         break;
            //     }
            // }
            // for (var j = 0; j < scope.timeList.length; j++) {
            //     if (scope.timeList[j].selected) {
            //         time = scope.timeList[j].data;
            //         scope.selectDateTime.time.item = scope.timeList[j];
            //         scope.selectDateTime.time.index = j;
            //         break;
            //     }
            // }
            // if (!year) {
            //     year = scope.selectDateTime.year.item.data;
            // }
            // if (!month) {
            //     year = scope.selectDateTime.month.item.data;
            // }
            // if (!date) {
            //     date = scope.selectDateTime.date.item.data;
            // }
            // if (!time) {
            //     time = scope.selectDateTime.time.item.data;
            // }
            // var value = year + "-" + month + "-" + date + " " + time;
            // scope.timePickerResult = value;
            // return value;
            console.log(scope.selectDateTime);
            var value = (scope.options.hideYear ? "" : scope.selectDateTime.year.item.data + "-" )
              + (scope.options.hideMoth ? "" : scope.selectDateTime.month.item.data + "-")
              + (scope.options.hideDate ? "" : scope.selectDateTime.date.item.data )
              + (scope.options.hideTime ? "" : " " + scope.selectDateTime.time.item.data);
            scope.timePickerResult = scope.format ? timePickerService.format(new Date(value), scope.format) : value;
            return scope.timePickerResult;
          }

          //根据年份和月份计算日期数量
          function getDateNum(year, month) {
            var dateNum = 30;
            if (scope.specialDateTime.isBigMonth(month)) { //大小月判断
              dateNum++;
            } else {
              if (scope.specialDateTime.isLoopYear(year)) {
                if (month == 2)
                  dateNum--;
              } else {
                if (month == 2)
                  dateNum -= 2;
              }
            }
            return dateNum;
          }

          //重置日期选择栏数据
          function resettingDate(year, month) {
            var dateNum = getDateNum(year, month);
            if (dateNum != scope.dateList.length - 2) { //数量变化 需要进行重置   //6
              var text, data, top, item, defaultItem, defaultIndex;
              var refreshNum = dateNum - (scope.dateList.length - 2)            //6
              if (refreshNum > 0) {//追加日期数量
                var lastData = scope.dateList[scope.dateList.length - 2];     //4
                for (var i = 1; i <= refreshNum; i++) {
                  data = lastData.data + i;
                  text = data + "";
                  top = options.height + scope.dateList[scope.dateList.length - 2].top;  //4
                  item = createDateTimeLi(0, top, data, false, text);
                  scope.dateList.splice(scope.dateList.length - 1, 0, item);            //3
                }
              } else { //移除多余的日期数量
                var refreshNum_ = Math.abs(refreshNum);
                scope.dateList.splice(scope.dateList.length - 2 - refreshNum_ + 1, refreshNum_);              //4 1
                if (scope.selectDateTime.date.item.data > scope.dateList[scope.dateList.length - 2].data) {  //4
                  scope.dateList[scope.dateList.length - 2].selected = true;                               //4
                  scope.selectDateTime.date.item = scope.dateList[scope.dateList.length - 2];               //4
                  scope.selectDateTime.date.item.index = scope.dateList.length - 2;                         //4
                  scrollToElm(scope.dateScroll, scope.dateList[scope.selectDateTime.date.index - 3]);        //3
                }
              }
            }
          }

          function getOperateEntity(type) {
            var entity = new Object();
            var scrollTimer, scrollHandler, data, defaultSelected, selectedItem;
            switch (type) {
              case "year":
                entity.scrollTimer = "yearScrollTimer";
                entity.type = type;
                entity.scrollHandler = "yearScroll";
                entity.data = "yearList";
                entity.defaultSelected = scope.selectDateTime.year.item.data;
                entity.selectedItem = "year";
                break;
              case "month":
                entity.scrollTimer = "monthScrollTimer";
                entity.type = type;
                entity.scrollHandler = "monthScroll";
                entity.data = "monthList";
                entity.defaultSelected = scope.selectDateTime.month.item.data;
                entity.selectedItem = "month";
                break;
              case "date":
                entity.scrollTimer = "dateScrollTimer";
                entity.type = type;
                entity.scrollHandler = "dateScroll";
                entity.data = "dateList";
                entity.defaultSelected = scope.selectDateTime.date.item.data;
                entity.selectedItem = "date";
                break;
              case "time":
                entity.scrollTimer = "timeScrollTimer";
                entity.type = type;
                entity.scrollHandler = "timeScroll";
                entity.data = "timeList";
                entity.defaultSelected = scope.selectDateTime.time.item.data;
                entity.selectedItem = "time";
                break;
            }
            return entity;
          }

          scope.ok = function () {
            var datetime = getSelectDateTime();
            setSelectDateTimeShow();
            hide();
            scope.$emit('timePicked', datetime);
          }
          scope.cancel = function () {
            hide();
          }

          function show() {
            $ionicBackdrop.retain();
            tem.css("display", "block");
          }

          function hide() {
            tem.css("display", "none");
            $ionicBackdrop.release();
          }

          function remove() {
            tem.remove();
          }

          scope.$on("$destroy", function () {
            remove();
          })
        }
      }
    }
  ]);
