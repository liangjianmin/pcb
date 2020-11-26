;!function () {
  window.baseController = {
    init: function () {
      this.mounted(this).handleBind(this);
    },
    getData: function (url, type, param, callback, loading) {
      var index;
      
      if (loading == false) {
        index = null;
      } else {
        index = layer.load(1);
      }
      
      
      var params = $.extend({}, param);
      
      $.ajax({
        type: type,
        url: "/" + url,
        data: params,
        dataType: dataTypeXpx,
        xhrFields: {withCredentials: true},
        success: function (data) {
          typeof callback == 'function' && callback(data);
          layer.close(index);
          return false;
        },
        error: function () {
          layer.close(index);
          layer.msg('网络出现问题，请重试！');
          return false;
        }
      });
    },
    mounted: function (opt) {
      
      Util.imgZoom($(".imgZoomT"), true);
      
      
      if (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 9) {
        $("html").append('<div class="browser">\n' +
          '    <div class="width-1180 tip-wrap">\n' +
          '        <span>当前页面部分功能无法正常使用, 可能因为您当前浏览器版本过低,请更换浏览器或升级后再试.</span>\n' +
          '        <i class="iconfont iconzujiantubiaojiantou10" title="关闭"></i>\n' +
          '    </div>\n' +
          '</div>');
      }
      
      
      return this;
    },
    handleBind: function (opt) {
      
      //scrollTop
      $(window).on('scroll', function () {
        var height = $(window).scrollTop();
        
        if (height > 100) {
          $("#backtop").fadeIn();
        } else {
          $("#backtop").fadeOut();
        }
      });
      
      
      //backtop
      $("#backtop").on('click', function () {
        $('body,html').animate({
          scrollTop: 0
        }, 500);
      });
      
      
      $(document).on('click', '.website-tip .iconfont', function () {
        $(".website-tip").hide();
      });
      
      return this;
    },
  }, $(function () {
    baseController.init();
  })
}();

(function (window) {
  Util = {
    /**
     * 设置cookie
     * @param name
     * @param value
     * @param time
     * @param domain
     * @returns {boolean}
     */
    setCookie: function (name, value, time, domain) {
      domain = domain ? ";domain=" + domain : "";
      var Days = time;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";path=/" + domain;
      return true;
    },
    /**
     * 获取cookie
     * @param name
     * @returns {*}
     */
    getCookie: function (name) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (name == arr[0]) {
          return arr[1];
        }
      }
      return "";
    },
    /**
     * 删除cookie
     * @param name
     */
    delCookie: function (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    /**
     * 获取参数
     * @param value
     * @returns {*}
     */
    getRequest: function (value) {
      if (window.location.pathname == "/s/") {
        var url = unescape(location.search);
      } else {
        var url = decodeURI(location.search);
      }
      var object = {};
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          object[strs[i].split("=")[0]] = strs[i].split("=")[1]
        }
      }
      return object[value];
    },
    /**
     * tab切换
     * @param obj
     * @param callback
     * @param currentClass
     */
    tabs: function (obj, callback, currentClass) {
      if (typeof currentClass == 'undefined') {
        currentClass = 'curr';
      }
      
      $(obj).on('click', function () {
        if ($(this).hasClass("disabled")) {
          return;
        }
        var index = $(this).index();
        var val = $(this).attr('data-value');
        $(obj).removeClass(currentClass);
        $(this).addClass(currentClass);
        
        typeof callback == 'function' && callback(index, val);
      });
    },
    /**
     *
     * @param obj
     */
    filter: function (obj, arr, reset) {
      $(obj).each(function (index, element) {
        if (reset) {
          $(element).removeClass('disabled');
        } else {
          if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
              if ($(element).attr('data-value') == arr[i]) {
                $(element).addClass('disabled');
              }
            }
          }
        }
      });
    },
    /**
     *时分秒倒计时方法
     */
    timergo: function (time) {
      var endTime = new Date(Number(time));
      var ts = endTime - new Date();
      if (ts > 0) {
        var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);
        var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);
        var mm = parseInt(ts / 1000 / 60 % 60, 10);
        var ss = parseInt(ts / 1000 % 60, 10);
        dd = dd < 10 ? ("0" + dd) : dd;   //天
        hh = hh < 10 ? ("0" + hh) : hh;   //时
        mm = mm < 10 ? ("0" + mm) : mm;   //分
        ss = ss < 10 ? ("0" + ss) : ss;   //秒
        
        
        $("#timer_d").text(Number(dd) + '天');
        $("#timer_h").text(Number(dd) * 24 + Number(hh) + '时');
        $("#timer_m").text(mm + '分');
        $("#timer_s").text(ss + '秒');
        
        setTimeout(function () {
          Util.timergo(time);
        }, 1000);
        
      } else {
        $("#timer_d").text(0 + '天');
        $("#timer_h").text(0 + '时');
        $("#timer_m").text(0 + '分');
        $("#timer_s").text(0 + '秒');
      }
    },
    /**
     * 星星评分
     */
    star: function (obj, callback) {
      $(obj).on('click', function () {
        var index = $(this).index();
        
        $("" + obj + ":lt(" + index + 1 + ")").removeClass("default");
        $("" + obj + ":gt(" + index + ")").addClass("default");
        
        typeof callback == 'function' && callback(index + 1);
      });
    },
    imgZoom: function (imgObj, cut) {
      imgObj.each(function () {
        var me = $(this);
        var imgPath = me.attr("src");
        var boxW = me.parent().width();
        var boxH = me.parent().height();
        var rate = boxW / boxH;
        var newImg = new Image();
        newImg.onload = function () {
          var imgW = newImg.width;
          var imgH = newImg.height;
          if (imgW / imgH == rate) {
            me.css({
              width: boxW + "px",
              height: boxH + "px",
              display: "block"
            });
            return;
          }
          if (cut) {
            if (imgW / imgH >= rate) {
              me.css({
                height: "100%",
                width: "auto",
                display: "block"
              });
              me.css({
                marginLeft: (boxW - me.width()) / 2 + "px",
                marginTop: "0px"
              });
            } else {
              me.css({
                width: "100%",
                height: "auto",
                display: "block"
              });
              me.css({
                marginTop: (boxH - me.height()) / 2 + "px",
                marginLeft: "0px"
              });
            }
          } else {
            if (imgW / imgH > rate) {
              me.css({
                width: "100%",
                height: "auto",
                display: "block"
              });
              me.css({
                marginTop: (boxH - me.height()) / 2 + "px",
                marginLeft: "0px"
              });
            } else {
              me.css({
                height: "100%",
                width: "auto",
                display: "block"
              });
              me.css({
                marginLeft: (boxW - me.width()) / 2 + "px",
                marginTop: "0px"
              });
            }
          }
        }
        newImg.src = imgPath;
      });
    }
  };
  if (typeof define === "function" && define.amd) {
    return Util;
  } else {
    window.Util = Util;
  }
})(window);



