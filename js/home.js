!function () {
  window.homeController = {
    init: function () {
      this.mounted(this).handleBind(this);
    },
    banner1Datas: [1, 2, 3, 4, 5, 2, 2, 2, 2],
    banner2Datas: [1, 2, 3, 4, 5, 6, 6, 6, 6],
    mounted: function (opt) {
      opt.scrollInfo('data-table-body-div', 'data-table-tr', '37', opt);
      opt.bannerDeal(1, opt)
      opt.bannerDeal(2, opt)
      return this;
    },
    handleBind: function (opt) {
      var isClickswitch1 = false, isClickswitch2 = false
      $('.header-form-nav').on('click', function () {
        var i = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.header-form-' + (i + 1)).show().siblings().hide();
      })
      return this;
    },
    scrollInfo: function (parentId, childClass, height, opt) {
      //滚动数据展示模块
      var $notesTxt = $("#" + parentId);
      if ($notesTxt.length > 0) {
        opt.up($notesTxt, childClass, height, opt);
        //鼠标滑入停止动画
        $notesTxt.hover(function () {
          $notesTxt.stop(false, false);
        }, function () {
          opt.up($notesTxt, childClass, height, opt);
        })
      }
    },
    up: function (notesTxt, childClass, height, opt) {
      notesTxt.animate({
        'top': '-' + height + 'px'
      }, 1500, 'linear', function () {
        notesTxt.css({
          'top': '0px'
        }).find('.' + childClass + ':first').appendTo(notesTxt);
        opt.up(notesTxt, childClass, height, opt);
      });
    },
    bannerDeal: function (type, opt) {
      var data = (type == 1 ? opt.banner1Datas : opt.banner2Datas);
      var isClickswitch = false;
      var parentStr = (type == 1 ? '.banner-1-section' : '.banner-2-section');
      var wrapperStr = (type == 1 ? '.banner-1-datas' : '.banner-2-datas');
      var HtmlStr = '';
      if (!data.length) {
        $(parentStr).hide();
        $(parentStr + ' .pre-div').hide();
        $(parentStr + ' .next-div').hide();
      } else {
        if (data.length < 4 || data.length == 4) {
          $(parentStr + ' .pre-div').hide();
          $(parentStr + ' .next-div').hide();
        } else {
          $(parentStr + ' .next-div').show();
        }
      }
      for (var i = 0; i < data.length; i++) {
        HtmlStr += opt.bannerSigleDom(type, data[i]);
        if (type == 1) {
          $('.banner-1-datas').html(HtmlStr)
        } else {
          $('.banner-2-datas').html(HtmlStr)
          
        }
      }
      $('body').on('click', parentStr + ' .pre-div', function () {
        //左滑
        if (!isClickswitch) {
          isClickswitch = true;
          $(parentStr + ' .next-div').show();
          var cssLeft = Number($(wrapperStr).css('left').slice(0, -2));
          $(wrapperStr).animate({
            left: cssLeft + 300 + 'px'
          }, function () {
            var cssLeft = Number($(wrapperStr).css('left').slice(0, -2));
            
            if (cssLeft + 20 == 0) {
              $(parentStr + ' .pre-div').hide();
            } else {
              $(parentStr + ' .pre-div').show();
            }
            isClickswitch = false
          })
        } else {
          return
        }
        
      });
      $('body').on('click', parentStr + ' .next-div', function () {
        //右滑
        if (!isClickswitch) {
          isClickswitch = true;
          $(parentStr + ' .pre-div').show();
          var itemLength = $(wrapperStr + ' .fl').length;
          //允许滑动的总长度
          var totalLength = (itemLength - 4) * 300 + 20;
          //元素滑动的距离
          var cssLeft = Number($(wrapperStr).css('left').slice(0, -2));
          $(wrapperStr).animate({
            left: cssLeft - 300 + 'px'
          }, function () {
            var cssLeft = Number($(wrapperStr).css('left').slice(0, -2));
            if (cssLeft + totalLength == 0) {
              $(parentStr + ' .next-div').hide();
            } else {
              $(parentStr + ' .next-div').show();
            }
            isClickswitch = false
          })
          
        } else {
          return
        }
        
        
      })
      
      
    },
    bannerSigleDom: function (type) {
      if (type == 1) {
        return '<div class="banner-1-data fl"><img src="./images/home/banner-1.png" alt="">' +
          '<div class="banner-1-data-text"> <div class="no-hover boxsiz">  <h3>High Precision Drilling Machine</h3>   </div>' +
          '  <div class="hover"> <h3>High Precision Drilling Machine</h3>  <ul>' +
          '  <li class="lbBox">  <i class="lineBlock va-t"></i> <span class="lineBlock">Imported Dongtai drilling machine with AC servo motor</span></li>' +
          '  <li class="lbBox">  <i class="lineBlock va-t"></i> <span class="lineBlock">Imported Dongtai drilling machine with AC servo motor</span></li>' +
          '  <li class="lbBox">  <i class="lineBlock va-t"></i> <span class="lineBlock">Imported Dongtai drilling machine with AC servo motor</span></li>' +
          ' </ul></div> </div></div>'
      } else {
        return '<div class="banner-2-data fl boxsiz"> <img src="./images/home/banner-2.png" alt="" class="banner-2-data-img">' +
          '<div class="banner-2-data-desc boxsiz">  This is my first project on AllPCB</div>' +
          ' <div class="banner-2-data-bottom">' +
          '  <div class="banner-2-data-bottom-left lbBox lineBlock"> <img src="./images/home/mg.png" alt="" class="lineBlock"> <span class="lineBlock ellipsis">11111111111</span> </div>' +
          ' <div class="banner-2-data-bottom-right lbBox lineBlock"> <span class="lineBlock"></span> <span class="lineBlock"></span> <span class="lineBlock"></span> <span class="lineBlock"></span> <span class="lineBlock"></span></div>' +
          '</div></div>'
      }
    },
  }, $(function () {
    homeController.init();
  })
}();