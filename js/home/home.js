!function () {
  window.homeController = {
    init: function () {
      this.mounted(this).handleBind(this);
    },
    mounted: function (opt) {
      
      return this;
    },
    handleBind: function (opt) {
      
      
      //banner
      if ($(".banner").length > 0) {
        jQuery(".banner").slide({
          mainCell: ".bd ul",
          titCell: ".hd  li",
          autoPlay: true,
          interTime: 5000
        });
      }
      
      return this;
    }
  }, $(function () {
    homeController.init();
  })
}();