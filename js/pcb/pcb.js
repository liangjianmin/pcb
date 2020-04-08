!function () {
  window.pcbController = {
    init: function () {
      this.load(this).handleBind(this);
    },
    load: function (opt) {
      
      var app = new Vue({
        el: '#app',
        data: {
          pcb_unit_flag: false,
          pcb_unit_active: 0, //出货方式默认
          pcb_layer_active: 1, //板子层数默认
          pcb_pbtype_active: 0, //拼版规则默认
          pcb_pbxout_active: 1, //是否接受打叉板默认
          
          
          pcb_unit: ['PCS(单片)', 'SET(连片)'],//出货方式
          pcb_unit_data: ['PCS', 'SET'],//出货方式的值对应
          
          pcb_pbtype: ['客户自拼', '工厂代拼'],//拼版规则
          pcb_pbxout: ['接收', '不接受'],//是否接受打叉板
          
          pcb_width: '',//板子尺寸高度
          pcb_length: '',//板子尺寸长度,
          pcb_layer: [1, 2, 4, 6, 8, 10, 12],//板子层数
          formObj: {
            pcb_unit: 'PCS',//出货方式
            pcb_pbtype: '按客户文件拼版出货',//出货方式
            pcb_pbxout: '不接受',//出货方式
            pcb_layer: '1',//出货方式
          }
        },
        watch: {
          formObj: {
            handler: function (val) {
              console.log(val)
            },
            deep: true
          }
        },
        methods: {
          tab: function (index, type) {
            if (type == 'pcb_unit') {
              this.pcb_unit_active = index;
            } else if (type == 'pcb_pbtype') {
              this.pcb_pbtype_active = index;
            } else if (type == 'pcb_pbxout') {
              this.pcb_pbxout_active = index;
            } else if (type == 'pcb_layer') {
              this.pcb_layer_active = index;
            }
            
            this.monitor(type, index)
            
          },
          monitor: function (type, index) {
            
            switch (type) {
              case 'pcb_unit':
                this.formObj.pcb_unit = this.pcb_unit_data[index];
                if (index == 0) {
                  this.pcb_unit_flag = false;
                } else {
                  this.pcb_unit_flag = true;
                }
                break;
              case 'pcb_pbtype':
                this.formObj.pcb_pbtype = this.pcb_pbtype[index];
                break;
              case 'pcb_pbxout':
                this.formObj.pcb_pbxout = this.pcb_pbxout[index];
                break;
              case 'pcb_layer':
                
                break;
              
              default:
            }
          }
        }
      })
      
      
      return this;
    },
    handleBind: function (opt) {
      
      
      return this;
    }
  }, $(function () {
    pcbController.init();
  })
}();

