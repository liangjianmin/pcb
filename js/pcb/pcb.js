!function () {
  window.pcbController = {
    formObj: {},
    init: function () {
      this.mounted(this).handleBind(this).onscrollFn();
    },
    mounted: function (opt) {
      
      return this;
    },
    handleBind: function (opt) {
      
      //出货方式
      Util.tabs('#PcbUnit ul li', function (index, val) {
        //拼板方式 是否接受打叉板 代拼板参数
        if (index == 0) {
          $("#PanelWayContentParam").hide(); //代拼板参数
          $("#separatingWay").hide();//分割方式
          $("#pcb_acceptCrossedZone").hide();//是否接受打叉板
          $("#PanelWayContent").hide();  //拼板方式
          
        } else if (index == 1) {
          $("#PanelWayContentParam").hide(); //代拼板参数
          $("#separatingWay").slideDown(); //分割方式
          $("#pcb_acceptCrossedZone").slideDown(); //是否接受打叉板
          $("#PanelWayContent").slideDown();  //拼板方式
          
        } else if (index == 2) {
          $("#separatingWay").hide();   //分割方式
          $("#PanelWayContent").hide();  //拼板方式
          $("#pcb_acceptCrossedZone").slideDown();  //是否接受打叉板
          
          layer.open({
            type: 1,
            title: '<span>PCB工艺信息</span>',
            skin: 'pcb-layer-box',
            area: ['780px', 'auto'],
            shadeClose: true,
            move: false,
            content: $("#pcbHtml").html(),
            success: function (layero, index) {
              layui.form.render();
              
              $('input[name="pcb_num_layer"]').val($('input[name="pcb_num"]').val());
              
              opt.dataShow($("#widthNumberForModal").val(), $('#lengthNumberForModal').val() * 1, $("input[name='pcb_width']").val(), $("input[name='pcb_length']").val());
            }
          });
          
          
        }
      });
      
      
      //PCB工艺信息
      layui.form.on('select(undis)', function (data) {
        
        if (data.value == 0) {
          $(".needHold").addClass('needHoldnone');
          
        } else if (data.value == 1) {
          $(".needHold").find('.left,.right').hide();
          $(".needHold").find('.bottom,.top').show();
          
          $(".needHold").removeClass('needHoldnone');
          $(".needHold").removeClass('needHoldleft');
          $(".needHold").addClass('needHoldtop');
          
        } else if (data.value == 2) {
          $(".needHold").find('.bottom,.top').hide();
          $(".needHold").find('.left,.right').show();
          
          $(".needHold").removeClass('needHoldnone');
          $(".needHold").removeClass('needHoldtop');
          $(".needHold").addClass('needHoldleft');
          
        } else if (data.value == 3) {
          $(".needHold").find('.left,.right').show();
          $(".needHold").find('.bottom,.top').show();
          
          $(".needHold").removeClass('needHoldnone');
          $(".needHold").removeClass('needHoldleft');
          $(".needHold").removeClass('needHoldtop');
        }
      });
      
      
      $(document).on('input propertychange', '#widthNumberForModal', function () {
        var val = $(this).val() * 1;
        if (val) {
          opt.dataShow(val, $('#lengthNumberForModal').val() * 1, $("input[name='pcb_width']").val(), $("input[name='pcb_length']").val());
        }
      });
      
      $(document).on('input propertychange', '#lengthNumberForModal', function () {
        var val = $(this).val() * 1;
        if (val) {
          opt.dataShow($('#widthNumberForModal').val() * 1, val, $("input[name='pcb_width']").val(), $("input[name='pcb_length']").val());
        }
      });
      
      
      //拼版规则
      Util.tabs('#pcb_pbtype ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_pbtype',
          index: index,
          val: val
        });
      });
      
      //是否接受打叉板
      Util.tabs('#pcb_acceptCrossedZone ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_acceptCrossedZone',
          index: index,
          val: val
        });
      });
      
      //板子层数
      Util.tabs('#pcb_layer ul li', function (index, val) {
        
        var layer = val;
        
        //如果板子层数选1
        if (layer == 1) {
          Observer.emit('pcb', {
            type: 'pcb_layer',
            index: index,
            copperThickness: [2],
            val: val
          });
        }
        
        
        //如果板子层数选2层
        if (layer == 1 || layer == 2) {
          Observer.emit('pcb', {
            type: 'pcb_layer',
            index: index,
            val: val
          });
        }
        
        
        //如果板子层数选4层
        if (layer == 4) {
          Observer.emit('pcb', {
            type: 'pcb_layer',
            thickness: [0.4, 0.6, 2.4],
            index: index,
            val: val
          });
        }
        
        //如果板子层数选6层
        if (layer == 6) {
          Observer.emit('pcb', {
            type: 'pcb_layer',
            thickness: [0.4, 0.6, 0.8, 2.4],
            index: index,
            val: val
          });
        }
        
        //如果板子层数选8层
        
        if (layer == 8 || layer == 10 || layer == 12) {
          Observer.emit('pcb', {
            type: 'pcb_layer',
            thickness: [0.4, 0.6, 0.8, 2.4],
            index: index,
            val: val
          });
        }
        
        
      });
      
      //板材类型
      Util.tabs('#BoardType ul li', function (index, val) {
      
      });
      
      //FR4-TG
      Util.tabs('#FrTg ul li', function (index, val) {
      
      });
      
      //板子厚度
      Util.tabs('#pcb_thickness ul li', function (index, val) {
        
        Observer.emit('pcb', {
          type: 'pcb_thickness',
          index: index,
          val: val
        });
        
        
      });
      
      //铜箔厚度
      Util.tabs('#pcb_copperThickness ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_copperThickness',
          index: index,
          val: val
        });
      });
      
      //最小线宽/线距
      Util.tabs('#LineWeight ul li', function (index, val) {
      
      });
      
      //最小孔径
      Util.tabs('#pcb_minholesize ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_minholesize',
          index: index,
          val: val
        });
      });
      
      //阻焊颜色
      Util.tabs('#SolderColor ul li', function (index, val) {
      
      });
      
      //字符颜色
      Util.tabs('#FontColor ul li', function (index, val) {
      
      });
      
      //焊盘喷镀
      Util.tabs('#SurfaceFinish ul li', function (index, val) {
      
      });
      
      //阻焊覆盖
      Util.tabs('#SolderCover ul li', function (index, val) {
      
      });
      
      //沉金厚度
      Util.tabs('#goldThickness ul li', function (index, val) {
      
      });
      
      //测试选项
      Util.tabs('#TestType ul li', function (index, val) {
      
      });
      
      //金(锡)手指
      Util.tabs('#Goldfinger ul li', function (index, val) {
      
      });
      
      //BGA数量
      Util.tabs('#BGANun ul li', function (index, val) {
      
      });
      
      //阻抗
      $(document).on('click', '#ImpedanceSize ul li', function () {
        var index = $(this).index();
        
        if (index == 0) {
          $(this).addClass('curr').siblings('li').removeClass('curr');
          $("#impedancereportzone").hide();
        } else {
          $("#ImpedanceSize ul li.one").removeClass('curr');
          $("#impedancereportzone").show();
          if ($(this).hasClass('curr')) {
            $(this).removeClass('curr');
          } else {
            if ($("#ImpedanceSize ul li.curr").length >= 2) {
              return false;
            }
            $(this).addClass('curr');
          }
        }
        
      });
      
      
      //阻抗报告
      Util.tabs('#impedancereportzone ul li', function (index, val) {
      
      });
      
      //确认生产稿
      Util.tabs('#ProductionDraft ul li', function (index, val) {
      
      });
      
      //收缩
      $(document).on('click', '.shrink', function () {
        opt.onscrollFn();
        if ($(this).text() == '收缩') {
          $(this).text('展开');
          $(this).parents('.pcb-block-slideup').find('.pcb-block').slideUp();
          
          if ($(this).attr('data-type') == 'time') {
            $(this).parents().addClass('timebor');
            $(this).parents().parents().children('.delivery').slideUp();
          }
          
          if ($(this).attr('data-type') == 'logistics') {
            $(this).parents().parents().children('.logistics').slideUp();
          }
          
          if ($(this).attr('data-type') == 'param') {
            $(this).parents().parents().children('.detail').slideUp();
          }
          
          if ($(this).attr('data-type') == 'order') {
            $(this).parents().parents().find('.cost-wrap').slideUp();
          }
          
        } else {
          $(this).text('收缩');
          $(this).parents('.pcb-block-slideup').find('.pcb-block').slideDown();
          
          if ($(this).attr('data-type') == 'time') {
            $(this).parents().removeClass('timebor');
            $(this).parents().parents().children('.delivery').slideDown();
          }
          
          if ($(this).attr('data-type') == 'logistics') {
            $(this).parents().parents().children('.logistics').slideDown();
          }
          
          if ($(this).attr('data-type') == 'param') {
            $(this).parents().parents().children('.detail').slideDown();
          }
          
          if ($(this).attr('data-type') == 'order') {
            $(this).parents().parents().find('.cost-wrap').slideDown();
          }
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
      
      //板子尺寸
      $("#BoardWidth").on('input propertychange', function () {
        var val = $(this).val();
        opt.formObj.BoardWidth = val;
        
        opt.checkPcb(opt, opt.formObj);
      });
      $("#BoardHeight").on('input propertychange', function () {
        var val = $(this).val();
        opt.formObj.BoardHeight = val;
        
        opt.checkPcb(opt, opt.formObj);
      });
      
      
      //板子数量
      $('#pcb_qty .txt-wrap').on('click', function () {
        $("#pcb_qty").children('.selects-qty').toggle();
      });
      $("#pcb_qty").find('.selects-qty > dl > dd').on('click', function () {
        var val = $(this).attr('data-value');
        $(this).addClass('curr').siblings('dd').removeClass('curr');
        $("#pcb_qty").find('.txt-wrap input').val(val)
        $("#pcb_qty").find('.canel').trigger('click');
        opt.formObj.pcb_num = val;
        opt.calculation(opt);
      });
      $("#pcb_qty").find('.ok').on('click', function () {
        var val = parseInt($.trim($("#pcb_num_input").val()));
        $("#pcb_qty").find('.txt-wrap input').val(val)
        $("#pcb_qty").find('.canel').trigger('click');
        opt.formObj.pcb_num = val;
        opt.calculation(opt);
      });
      $("#pcb_qty").find('.canel').on('click', function () {
        $('#pcb_qty .selects-qty').hide();
      });
      
      
      //监听函数
      Observer.on('pcb', function (e) {
        
        //板子层数
        if (e.args.type == 'pcb_layer') {
          
          //请提供多层板层压叠序
          if (e.args.index > 1) {
            layer.open({
              type: 1,
              title: '<span>请提供多层板层压叠序</span>',
              area: ['500px ', 'auto'],
              shadeClose: true,
              move: false,
              content: $("#boardUpHtml").html(),
              success: function (layero, index) {
                var htmlArr = [];
                for (i = 0; i < e.args.val; i++) {
                  htmlArr.push('  <li>' +
                    '                <label class="lineBlock">L' + (i + 1) + '</label>' +
                    '                <input type="text" class="va-m"/>' +
                    '            </li>')
                }
                $(layero).find('.input-group').empty().append(htmlArr.join(''));
              }
            });
            
          }
          
          //层数1
          if (e.args.val == 1) {
            Util.filter('#pcb_thickness ul li', [], true);
            Util.filter('#pcb_copperThickness ul li', e.args.copperThickness);
            $("#pcb_insidethickness").slideUp();
          }
          
          //层数2
          if (e.args.val == 2) {
            Util.filter('#pcb_thickness ul li', [], true);
            Util.filter('#pcb_copperThickness ul li', [], true);
            $("#pcb_insidethickness").slideUp();
          }
          
          //层数4
          if (e.args.val == 4) {
            Util.filter('#pcb_thickness ul li', e.args.thickness);
            Util.filter('#pcb_copperThickness ul li', [], true);
            $("#pcb_insidethickness").slideDown();
          }
          
          //层数6
          if (e.args.val == 6) {
            Util.filter('#pcb_thickness ul li', e.args.thickness);
            Util.filter('#pcb_copperThickness ul li', [], true);
            $("#pcb_insidethickness").slideDown();
          }
          
          
        }
        
        //收集表单数据
        opt.formObj[e.args.type] = e.args.val;
        
        opt.calculation(opt);
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
    onscrollFn: function () {
      if ($("#quote-scroll").length > 0) {
        var layout = $("#quote-scroll").offset().top;
        $(window).scroll(function () {
          if ($(this).scrollTop() > layout) {
            $("#quote-scroll").addClass('onsroll');
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