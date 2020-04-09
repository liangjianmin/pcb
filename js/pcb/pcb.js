!function () {
  window.pcbController = {
    formObj: {},
    init: function () {
      this.mounted(this).handleBind(this);
    },
    mounted: function (opt) {
      
      return this;
    },
    handleBind: function (opt) {
      
      //出货方式
      Util.tabs('#pcb_unit ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_unit',
          index: index,
          val: val
        });
        
      })
      
      //拼版规则
      Util.tabs('#pcb_pbtype ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_pbtype',
          index: index,
          val: val
        });
      });
      
      //是否接受打叉板
      Util.tabs('#pcb_pbxout ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_pbxout',
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
  
      //最小孔径
      Util.tabs('#pcb_minholesize ul li', function (index, val) {
        Observer.emit('pcb', {
          type: 'pcb_minholesize',
          index: index,
          val: val
        });
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
      $("#pcb_width").on('input propertychange', function () {
        var val = $(this).val();
        opt.formObj.pcb_width = val;
        
        opt.checkPcb(opt, opt.formObj);
      });
      $("#pcb_length").on('input propertychange', function () {
        var val = $(this).val();
        opt.formObj.pcb_length = val;
        
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
        
        if (e.args.type == 'pcb_unit') {
          console.log(e.args.type)
          if (e.args.index == 0) {
            $("#pcb_pbtype").hide();
            $("#pcb_pbxout").hide();
            
            $("#pcb_pbxy").hide();
            $("#pcb_pbxys").hide();
            $("#pcb_division").hide();
            $("#pcb_slot").hide();
            
          } else if (e.args.index == 1) {
            $("#pcb_pbtype").show();
            $("#pcb_pbxout").show();
          }
        }
        
        
        if (e.args.type == 'pcb_pbtype') {
          if (e.args.index == 0) {
            $("#pcb_pbxy").hide();
            $("#pcb_pbxys").hide();
            $("#pcb_division").hide();
            $("#pcb_slot").hide();
          } else if (e.args.index == 1) {
            $("#pcb_pbxy").show();
            $("#pcb_pbxys").show();
            $("#pcb_division").show();
            $("#pcb_slot").show();
          }
          
        }
        
        
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
      
      var pcbwidth = obj.pcb_width;
      var pcblength = obj.pcb_length;
      
      if (pcbwidth > 120 || pcblength > 120) {
        layer.msg('我司可生产最大长度为120cm,单位为cm,请重新输入!');
        return false;
      }
      
      
      opt.calculation(opt);
      
      
    },
    calculation: function (opt) {
      
      if (this.formObj.pcb_width && this.formObj.pcb_length) {
        $("#showpcb .pcb_wl").text(this.formObj.pcb_width + ' * ' + this.formObj.pcb_length + 'cm');
      }
      
      if (this.formObj.pcb_num) {
        $("#showpcb .pcb_num").text(this.formObj.pcb_num);
      }
      
      
      if(this.formObj.pcb_thickness){
        $("#showpcb .pcb_thickness").text(this.formObj.pcb_thickness+'mm');
      }
      
      
    }
  }, $(function () {
    pcbController.init();
  })
}();