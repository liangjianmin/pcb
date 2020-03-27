!function () {
  window.homeController = {
    init: function () {
      this.mounted(this).handleBind(this);
    },
    
    mounted: function (opt) {
      opt.scrollInfo('data-table-body-div', 'data-table-tr', '37', opt);
      
      return this;
    },
    handleBind: function (opt) {
      var isClickswitch1 = false, isClickswitch2 = false
      $('.header-form-nav').on('click', function () {
        var i = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.header-form-' + (i + 1)).show().siblings().hide();
      })
      
      //banner
      if ($(".banner-wrap").length > 0) {
        jQuery(".banner-wrap").slide({
          mainCell: ".bd ul",
          titCell: ".hd  li",
          autoPlay: true,
          interTime: 5000
        });
      }
      
      
      //Chinese Ultrafast PCB
      if ($(".banner-1-datas-div .banner-1-datas").find('.banner-1-data').length > 0) {
        jQuery(".banner-1-datas-div").slide({
          mainCell: ".banner-1-datas",
          autoPlay: false,
          prevCell: '.pre-div',
          nextCell: '.next-div',
          effect: "left",
          pnLoop: false,
          vis: 4
        });
      }
      
      //Feedback
      if ($(".banner-2-datas-div .banner-2-datas").find('.banner-2-data').length > 0) {
        jQuery(".banner-2-datas-div").slide({
          mainCell: ".banner-2-datas",
          autoPlay: false,
          prevCell: '.pre-div',
          nextCell: '.next-div',
          effect: "left",
          pnLoop: false,
          vis: 4
        });
      }
      
      
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
    }
  }, $(function () {
    homeController.init();
  })
}();