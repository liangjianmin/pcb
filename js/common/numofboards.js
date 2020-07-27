//数量选择插件
;
(function ($) {
  $.fn.numofboards = function (callback) {
    var parentDom = this;
    var obj = {
      init: function () {
        if ($(parentDom).find('.selects-qty').length) {
          return
        }
        this.createDom.apply(parentDom)
        this.bindFun.apply(parentDom)
        
      },
      createDom: function () {
        var itemArr = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000]
        var str = '<div class="selects-qty">';
        str += '<i class="lineBlock arrow"></i>';
        str += '<dl class="clr">';
        for (var i = 0; i < itemArr.length; i++) {
          str += ' <dd data-value="' + itemArr[i] + '"><i class="arr lineBlock va-m"></i><span class="lineBlock va-m">' + itemArr[i] + '</span></dd>'
        }
        str += '</dl><div class="wrap">';
        str += '<label class="lineBlock va-m" style="width: auto;">其他数量：</label>';
        str += '<input type="number" class="inp va-m pcb_num_input" >';
        str += '<div class="btn lineBlock va-m">';
        str += '<a href="javascript:;" class="lineBlock ok">确认</a>';
        str += '<a href="javascript:;" class="lineBlock canel">取消</a>';
        str += '</div></div></div>';
        $(this).append(str)
      },
      bindFun: function () {
        var me = this;
        //切换选择框下拉
        $(document).find(me).find('input[name="pcb_num"]').on('click', function () {
          $(me).children('.selects-qty').toggle();
        });
        //切换选中
        $(document).find(me).find('.selects-qty > dl > dd').on('click', function () {
          var val = $(this).attr('data-value');
          $(this).addClass('curr').siblings('dd').removeClass('curr');
          $(me).find('input').val(val)
          $(me).find('.canel').trigger('click');
          if (callback) {
            callback(val)
          }
          
        });
        //选择ok
        $(document).find(me).find('.ok').on('click', function () {
          var val = parseInt($.trim($(me).find(".pcb_num_input").val()));
          $(me).find('input').val(val);
          $(me).find('.canel').trigger('click');
          if (callback) {
            callback(val);
          }
        });
        //选中取消
        $(document).find(me).find('.canel').on('click', function () {
          $(me).find('.selects-qty').hide();
        });
      }
    }
    obj.init()
  };
})(jQuery);