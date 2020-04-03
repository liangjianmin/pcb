!function () {
  window.payController = {
    init: function () {
      this.mounted(this).handleBind(this);
    },
    mounted: function (opt) {
      
      return this;
    },
    handleBind: function (opt) {
      
      //订单倒计时
      Util.timergo(1585900139000);
      
      return this;
    }
  }, $(function () {
    payController.init();
  })
}();