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


$(function () {
  
  Util.imgZoom($(".imgZoomT"), true);
  
  $(document).on('click', '.pcbbuy-head .menu', function () {
      $(".menu-box").show();
  });
  $(document).on('click', '.home-had .bar', function () {
    $(".menu-box").show();
  });
  $(document).on('click', '.menu-box', function () {
    $(".menu-box").hide();
  });
});
