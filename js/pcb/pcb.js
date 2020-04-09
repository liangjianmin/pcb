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
        
        
        
        
        
        
        
        
        //收集表单数据
        opt.formObj[e.args.type] = e.args.val;
        
        
        
        
        
        
      });
      
      
      return this;
    }
  }, $(function () {
    pcbController.init();
  })
}();