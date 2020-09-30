!function () {
  window.pcbController = {
    formObj: {},
    init: function () {
      this.mounted(this).handleBind(this).onscrollFn();
    },
    mounted: function (opt) {
      
      $("html,body").animate({
        scrollTop: 118
      }, 500);
      
      $('#pcb_qty').numofboards(function (val) {
        opt.formObj.pcb_num = val;
        opt.calculation(opt);
      });
      
      return this;
    },
    handleBind: function (opt) {
      
      
      //贴片面
      Util.tabs('.stick-slide li', function (index, val) {
      
      });
  
      //工艺要求
      Util.tabs('#technologyRequire ul li', function (index, val) {
    
      });
  
      //确认生产稿
      Util.tabs('#confirmProduction ul li', function (index, val) {
    
      });
  
      //PCBA线路板
      Util.tabs('#PCBA ul li', function (index, val) {
    
      });
      
      //PCBA是否已拼版
      Util.tabs('#PCBAIs ul li', function (index, val) {
    
      });
  
  
      //BOM配件
      Util.tabs('#BOMParts ul li', function (index, val) {
    
      });
  
      //钢网
      Util.tabs('#steelMesh ul li', function (index, val) {
    
      });
  
      
      //刷三防漆
      Util.tabs('#painting ul li', function (index, val) {
    
      });
  
  
  
      //功能测试
      Util.tabs('#test ul li', function (index, val) {
    
      });
  
      //烧录程序
      Util.tabs('#burnRecord ul li', function (index, val) {
    
      });
  
      //PCBA板分板出货
      Util.tabs('#shipment ul li', function (index, val) {
    
      });
  
      //包装选项
      Util.tabs('#packagingOptions ul li', function (index, val) {
    
      });
  
      //包装选项
      Util.tabs('#xray ul li', function (index, val) {
    
      });
      
      //BOM文件
      var upload1 = layui.upload.render({
        elem: '#bomUpload',
        url:  "/oss/upload",
        accept: 'file',
        data: {source: 2, pf: 20},
        done: function (res) {
        
        },
        error: function () {
          //请求异常回调
        }
      });
  
  
      //贴片坐标文件
      var upload2 = layui.upload.render({
        elem: '#patchUpload',
        url:  "/oss/upload",
        accept: 'file',
        data: {source: 2, pf: 20},
        done: function (res) {
      
        },
        error: function () {
          //请求异常回调
        }
      });
  
  
  
  
  
  
      //收缩
      $(document).on('click', '.shrink', function () {
        opt.onscrollFn();
        var statusDom = $(this).find('.arrow-icon');
        
        
        if (statusDom.hasClass('arrow-t')) {
          
          statusDom.addClass('arrow-b').removeClass('arrow-t');
          
          
        } else {
          
          statusDom.addClass('arrow-t').removeClass('arrow-b');
          
        }
      });
      
      
      //PCB参数详情 开关
      $(document).on('click', '.toggle', function () {
        if ($(this).hasClass('curr')) {
          $(this).removeClass('curr');
          $(this).parent().parent().parent().find('.toggle-box').slideUp();
        } else {
          $(this).addClass('curr');
          $(this).parent().parent().parent().find('.toggle-box').slideDown();
        }
        
      });
      
      //PCB参数详情 更多信息
      $(document).on('click', '.pcb-param-more', function () {
        if ($(this).hasClass('curr')) {
          $("#text").text('显示更多信息');
          $(this).removeClass('curr');
          $(".pcb-param .detail-wrap tr:gt(2)").hide();
        } else {
          $("#text").text('隐藏更多信息');
          $(this).addClass('curr');
          $(".pcb-param .detail-wrap tr:gt(2)").show();
        }
        
      });
      
      
      //显示更多物流信息
      $(document).on('click', '.pcb-delivery-more', function () {
        if ($(this).hasClass('curr')) {
          $("#delivery").text('显示更多物流');
          $(this).removeClass('curr');
          $(".pcb-delivery dl dd:gt(1)").hide();
        } else {
          $("#delivery").text('隐藏更多物流');
          $(this).addClass('curr');
          $(".pcb-delivery dl dd:gt(1)").show();
        }
        
      });
      
      
      $(document).on('click', '.board-up-layer .list-wrap li', function () {
        $(".board-up-layer .list-wrap li").find('.circle').removeClass('act');
        $(this).find('.circle').addClass('act');
      });
      $(document).on('click', '.board-up-layer .ok', function () {
        layer.closeAll();
      });
      $(document).on('click', '.board-up-layer .canel', function () {
        layer.closeAll();
      });

      
      
      return this;
    },
    checkPcb: function (opt, obj) {
      
      var pcbwidth = obj.BoardWidth;
      var pcblength = obj.BoardHeight;
      
      if (pcbwidth > 120 || pcblength > 120) {
        layer.msg('我司可生产最大长度为120cm,单位为cm,请重新输入!');
        return false;
      }
      
      
      opt.calculation(opt);
      
      
    },
    calculation: function (opt) {
      if (this.formObj.BoardWidth && this.formObj.BoardHeight) {
        $("#showpcb .pcb_wl").text(this.formObj.BoardWidth + ' * ' + this.formObj.BoardHeight + 'cm');
      }
      
      if (this.formObj.pcb_num) {
        $("#showpcb .pcb_num").text(this.formObj.pcb_num);
      }
      
      
      if (this.formObj.pcb_thickness) {
        $("#showpcb .pcb_thickness").text(this.formObj.pcb_thickness + 'mm');
      }
      
      
    },
    dataShow: function (width, length, widthVal, lengthVal) {
      var arrHtml = [];
      for (var i = 0; i < width; i++) {
        arrHtml.push('<tr>');
        for (var j = 0; j < length; j++) {
          arrHtml.push('<td>' + widthVal + '*' + lengthVal + '</td>');
        }
        arrHtml.push('</tr>');
      }
      
      $(".datalist").empty().html(arrHtml.join(''));
      
    },
    change: function (X, Y, spacingX, spacingY) {
      if (X >= 1 && Y >= 1) {
        
        if (spacingX) {
          for (var i = 0; i < X - 1; i++) {
            for (var j = 0; j < Y; j++) {
              $('.datalist').find('tr').eq(i).find('td').eq(j).css({
                borderBottom: "3px solid #0081D2"
              });
            }
          }
        }
        
        if (spacingY) {
          for (var i = 0; i < X; i++) {
            for (var j = 0; j < Y - 1; j++) {
              $('.datalist').find('tr').eq(i).find('td').eq(j).css({
                borderRight: "3px solid #0081D2"
              });
            }
          }
        }
        
      }
    },
    onscrollFn: function () {
      if ($("#quote-scroll").length > 0) {
        var layout = $("#quote-scroll").offset().top;
        
        $(window).scroll(function () {
          var footOffsetY = $(".pcb-footer").offset().top;
          
          var height = $("#quote-scroll").height();
          
          
          if ($(this).scrollTop() > layout) {
            if ($(this).scrollTop() + height > footOffsetY) {
              $("#quote-scroll").removeClass('onsroll');
            } else {
              $("#quote-scroll").addClass('onsroll');
            }
          } else {
            $("#quote-scroll").removeClass('onsroll');
          }
        })
      }
    }
  }, $(function () {
    pcbController.init();
  })
}();