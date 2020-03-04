//全局定义页面类型
var JumpUrl = "";//默认跳转地址

//全局pcbOrderNoNew，用于pcba和钢网关联pcb添加购物车时直接设置关联 add by  2018-11-17
var pcbOrderNoNew = "";
var _countryId = 0;
var flagcc = 0;
$(function () {
  QC.Init();
  QC.QutoliEv("[name=proCategory][value='aluminumItem']", 2);
  getdt(2);
  setInterval(function () {
    getdt(2)
  }, 1000)
  
  
});

var Pcb = {
  h: function () {
    var w = $("[name=hidLength]").val();
    if (w.length == 0) w == 0;
    return w;
  },
  w: function () {
    var w = $("[name=hidWidth]").val();
    if (w.length == 0) w == 0;
    return w;
  },
  num: function () {
    var w = $("[name=hidNum]").val();
    if (w.length == 0) w == 0;
    return w;
  },
  //板材联动:层数，数量，影响板材
  FrType: function () {
    //板子数量
    var boardLayer = $("[name=hidLayers]:checked").val();
    var num = $("[name=hidNum]").val();
    var boardType = $("[name=boadtype]:checked").val();
    var setnum = num;
    if (boardType == 'Panel PCB as design') {
      var px = $("[name=pinban_x]").val();
      var py = $("[name=pinban_y]").val();
      setnum = setnum * (px * py);
    } else {
      setnum = $("[name=hidNum]").val();
    }
    Pcb.hidLayersSort();
    
  },
  //注册事件
  Register: function () {
    //参数选择点击事件
    Pcb.OptionsItemClick();
    Pcb.PlateNumber();
    
    
    $(".laddercenter ul").on("click", "li", function () {
      var index = $(this).index();
      $(".laddercenter li").removeClass("active");
      $(".laddercenter li").eq(index).addClass("active");
      
      $("#hidNum").val(parseInt($(".laddercenter ul li").eq(index).find(".w1").text()));
      
      Pcb.CalcPrice(index, false);
    })
    
    //锣槽V割
    $("#cao_x,#cao_y").on("change", function () {
      var caoX = $("[name=cao_x]").val();
      var caoY = $("[name=cao_y]").val();
      if (caoX == "") {
        $("[name=cao_x]").val(0);
        caoX = 0;
      }
      if (caoY == "") {
        $("[name=cao_y]").val(0);
        caoY = 0;
      }
      var vcuts = $("[name = VCut] option:selected").val();
      if (vcuts == "luocao") {
        if ((10 >= caoX && caoX >= 2 || caoX == 0) && (10 >= caoY && caoY >= 2 || caoY == 0)) {
          if ((caoX == 0 || caoX == "") && (caoY == 0 || caoY == "")) {
            layer.msg("Vertical groove spacing and horizontal groove spacing cannot be equal to 0 at the same time.");
            return false;
          }
        } else {
          layer.msg("Please enter the number between 2 and 10 for the spacing of gongs and slots");
          return false;
        }
      } else if (vcuts == "vcutluocao") {
        if ((caoX == 0 && (10 >= caoY && caoY >= 2)) || (caoY == 0 && (10 >= caoX && caoX >= 2))) {
        
        } else {
          if ((caoX == 0) && (caoY == 0)) {
            layer.msg("Vertical groove spacing and horizontal groove spacing cannot be equal to 0 at the same time.");
            return false;
          }
          layer.msg("Vertical and horizontal groove spacing should have a number of 0  and another one between 2 and 10.");
          return false;
        }
      }
      
      Pcb.BoardTypeData();
      
      Pcb.CalcPrice();
    })
    
    $("[name='VCut']").on("change", function () {
      var bodType = $("[name=boadtype]:checked").val();
      var vCuts = $("[name=VCut] option:selected").val();
      if (bodType == 'Panel by ALLPCB' && vCuts.indexOf("luocao") != -1) {
        $("#cao_x,#cao_y").val(2);
        $(".luocao-state").show();
        if (vCuts == "vcutluocao") {
          layer.msg("Vertical and horizontal groove spacing should have a number of 0  and another one between 2 and 10.");
          return false;
        }
      } else {
        $("#cao_x,#cao_y").val(0);
        $(".luocao-state").hide();
      }
      Pcb.BoardTypeData();
      
      Pcb.CalcPrice();
      return false;
    })
    $(".pcbonline-options [type=number],.pcbonline-options select").not(".singlayergy,[name=pinban_x],[name=pinban_y]").on("change", function () {
      Pcb.BoardTypeData();
      Pcb.CommonRelation();
      
      
      Pcb.CalcPrice();
      
      return false;
    });
    
    //标品不能选择3miu
    $("[name=ImGoldThinckness]").on("click", function () {
      if ($(".youpin_box").is(".active")) {
        $("[name=ImGoldThinckness][value=3]").parents("li").show()
      } else {
        $("[name=ImGoldThinckness][value=3]").parents("li").hide();
      }
    })
    
    //标品优品切换
    $(".pinzhiul li").on("click", function () {
      
      $(this).addClass("active").siblings().removeClass("active");
      var delieverydate = "";
      
      $("#predictdelievery").text(delieverydate);
      $("#pcbDateTime").val(delieverydate);
      Pcb.CalcPrice();
      if ($(".youpin_box").is(".active")) {
        $(".select-report,.reportcostul").show();
        $(".price-delivery-list .w1 img").hide();
        //$(".DiscountPrice").text($(".youpin_box .fr").text().replace("$", ""));
        delieverydate = $(".ypordermoney").attr("deliverydaysstr");
        $("[name=ImGoldThinckness][value=3]").parents("li").show();
        //$(".select-report-item").addClass("current");
        //$(".select-report-item input").attr("checked", "checked");
        
      } else {
        $(".select-report,.reportcostul").hide();
        $(".price-delivery-list .w1 img").show();
        //$(".DiscountPrice").text($(".biaopin .fr").text().replace("$", ""));
        delieverydate = $(".bpordermoney").attr("deliverydaysstr");
        $("[name=ImGoldThinckness][value=3]").parents("li").hide();
        QC.Checked("ImGoldThinckness", "1")
        
      }
      
      
    });
    
    $("[name=pinban_x],[name=pinban_y],[name=processeEdge_y]").on("change", function () {
      Pcb.BoardTypeData();
      Pcb.FrType();
      Pcb.aluminumArea();
      Pcb.PlateNumber();
      Pcb.CalcPrice();
      return false;
    });
    
    $("#hidLength,#hidWidth").change(function () {
      
      
      Pcb.FrType();
      Pcb.BoardTypeData();
      Pcb.whatFlyingProbe();
      Pcb.Fr4TG();
      Pcb.CommonRelation(this);
      Pcb.PlateNumber();
      Pcb.aluminumArea();
      Pcb.CalcPrice();
      
    });
    $("#BoardHeight,#BoardWidth").change(function () {
      if ($("#BoardHeight").val() > 0 && $("#BoardWidth").val() > 0) {
        Pcb.hasWithlead();
        Pcb.hidLayersSort();
        Pcb.CommonRelation();
        Stencil.IntelligentRecommendation();
      }
    });
    var fnshow = function () {
      
      $("#hidNum").css({border: "1px solid #ff9900", borderBottom: "1px solid #fff"});
      var num = $("[name=hidNum]").val();
      $("[name=countNumer]").prop("checked", false);
      $("[name=countNumer][value=" + num + "]").prop("checked", true);
      
      Pcb.whatFlyingProbe();
      Pcb.Fr4TG();
      Pcb.PlateNumber();
      Pcb.aluminumArea();
      Pcb.CalcPrice();
      
    };
    //$("#hidNum").click(fnshow);
    $("#hidNum,#boardnumber").hover(function () {
      var num = $("[name=hidNum]").val();
      $("[name=countNumer][value='" + num + "']").prop("checked", true);
      if (num > 10000) {
        $("[name=countNumer]").prop("checked", false);
      }
      $("#boardnumber").show();
      
      
    }, function () {
      
      Pcb.CloseSelectNumDiv();
      Pcb.whatFlyingProbe();
      Pcb.Fr4TG();
      Pcb.PlateNumber();
      Pcb.aluminumArea();
      
    });
    
    $("#boardnumber").find("label").each(function (i, dom) {
      $(dom).on("click", function (event) {
        event.stopPropagation()// 阻止冒泡
        //$(dom).parents("li").find("[name='countNumer']").prop("checked", true);
        var num = $(dom).find("[name='countNumer']").val();
        $("[name=countNumer][value='" + num + "']").prop("checked", true);
        $("#hidNum").val(QC.GetCheckedVal("countNumer"));
        $("#hidParmChanged").val("yes");
        $("#txtSelNum").val("");
        Pcb.PlateNumber();
        Pcb.FrType();
        Pcb.BoardTypeData();
        Pcb.CommonRelation($("#hidNum")[0]);
        Pcb.CloseSelectNumDiv();
        Pcb.aluminumArea();
        Pcb.CalcPrice();
        
        return false;
      });
    });
  },
  
  //参数选择点击事件
  OptionsItemClick: function () {
    $(".pcbonline-options .item").each(function (i, dom) {
      $(dom).unbind("click").bind("click", function (e) {
        if ($(this).hasClass("not-selectable")) {
          return false;
        }
        var h = $("[name='hidLength']").val();
        var w = $("[name='hidWidth']").val();
        var num = $("[name='hidNum']").val();
        var boardLayer = $("[name=hidLayers]:checked").val();
        var val = $(this).find("input").val();
        var name = $(this).find("input").attr("name");
        
        
        if (h == 0 || h == null || w == 0 || w == null || num == 0 || num == null) {
          QC.QutoliEv("[name=proCategory][value='aluminumItem']", 2);
          
          //如果点击的是出货类型
          if (name == "boadtype") {
            Pcb.BoardTypeEvent();
            $(this).addClass("ant-btn-clicked"), setTimeout(function () {
              $(".pcbonline-options .item").removeClass("ant-btn-clicked")
            }, 300)
          } else if (name == "proCategory") {
            //产品类别
            Pcb.proCategoryClick();
            $(this).addClass("ant-btn-clicked"), setTimeout(function () {
              $(".pcbonline-options .item").removeClass("ant-btn-clicked")
            }, 300)
          } else if (name == "hidLayers") {
            Pcb.Fr4TG();
            Pcb.FrType();
            Pcb.PlateNumber();
            Pcb.BoardThickness();
            Pcb.hidLayersSort();
            $(this).addClass("ant-btn-clicked"), setTimeout(function () {
              $(".pcbonline-options .item").removeClass("ant-btn-clicked")
            }, 300)
            
          } else {
            layer.msg("Pls input height, width, qty and layers to calculate the price!", {time: 2000});
            return false;
          }
          
          
        } else {
          $(this).addClass("ant-btn-clicked"), setTimeout(function () {
            $(".pcbonline-options .item").removeClass("ant-btn-clicked")
          }, 300)
        }
        
        QC.Checked(name, val);
        
        
        {
          
          //如果点击的是出货类型
          if (name == "boadtype") {
            Pcb.BoardTypeEvent();
          }
          if (name == "proCategory") {
            //产品类别
            Pcb.proCategoryClick();
          }
          if (name == "hidLayers") {
            Pcb.FrType();
            Pcb.Fr4TG();
            Pcb.BoardThickness();
            Pcb.PlateNumber();
            Pcb.hidLayersSort();
            
          }
          if (name == "radPlatingType") {
            Pcb.SurfaceData();
          }
          if (name == "Goldfinger") {
            Pcb.goldFinger();
          }
          if (name == "ImpedanceSize") {
            Pcb.ImpedanceReportData();
          }
          
          
          if (name == "processeEdge_x") {
            Pcb.BoardTypeData();
          }
          //var fr4Type = $("[name=FR4Type]:checked").val();
          if (name == "FR4Type") {
            Pcb.BoardThickness();
            //Pcb.Fr4TG();
            //Pcb.aluminumArea();
            
          }
          //阻焊和文字颜色联动屏蔽处理
          if (name == "radSolderColor") {
            Pcb.SolderColor();
          }
        }
        
        
        Pcb.CommonRelation(this);
        Pcb.CalcPrice();
        
        //长宽为空所有都可点击
        var h = $("[name=hidLength]").val();
        var w = $("[name=hidWidth]").val();
        if (h == 0 || h == null || w == 0 || w == null) {
          $(".pcbonline-options .item").removeClass("not-selectable");
        }
        
        
        QC.QutoliEv("[name=proCategory][value='aluminumItem']", 2);
        
        return false;
        
      });
    });
    
    
  },
  ImpedanceReportData: function () {
  },
  
  
  //产品类别点击事件
  proCategoryClick: function () {
    var proCate = $("[name=proCategory]:checked").val();
    
    
    //最小线宽线距
    QC.QutoliEv("[name=radLineWeight][value='4/4mil']", 0);
    //阻焊颜色
    QC.QutoliEv("[name='radSolderColor'][value='highantiwhiteoil']", 0);
    //板厚比
    $(".thickness_aperture").slideUp(300);
    //阻焊覆盖
    $(".impedance").slideDown(300);
    
    $(".otherban_pic").show();
    $(".lvjiban").hide();
    
    //最小孔径
    $(".min_prosize").slideDown(300);
    if (proCate == "fr4Item") {
      //tg值显示
      $(".fr4-tg").slideDown(300);
      //导热系数
      $("#daorexishu").slideUp(300);
      //耐压值和成型方式
      $("#naiyazhi").slideUp(300);
      $("#chengxinfangshi").slideUp(300);
      
      //板子只支持单双面板，4,6层，默认双层板
      QC.QutoliEv("[name=hidLayers]", 0);
      QC.Checked("hidLayers", "2");
      
      //阻焊颜色和字符颜色默认绿白
      QC.QutoliEv("[name=radSolderColor]", 0);
      QC.QutoliEv("[name=radSolderColor]", 3);
      QC.Checked("radSolderColor", "Green");
      QC.QutoliEv("[name=radFontColor]", 0);
      QC.QutoliEv("[name=radFontColor]", 3);
      QC.QutoliEv("[name=radFontColor][value='Green']", 2);
      QC.Checked("radFontColor", "White");
      QC.QutoliEv("[name='radSolderColor'][value='highantiwhiteoil']", 1);
      
      $(".yp-icon").parents("li").show();
      
      //板材
      Pcb.PlateNumber();
      
    } else {
      //tg值隐藏
      $(".fr4-tg").slideUp(300);
      
      $(".yp-icon").parents("li").hide();
      
      //板子只支持单层
      QC.QutoliEv("[name=hidLayers]", 4);
      QC.Checked("hidLayers", "1");
      
      if (proCate == "cem1Item") {
        //板材CEM-1建滔黄芯
        QC.QutoliEv("[name=FR4Type]", 4);
        QC.Checked("FR4Type", "cem1");
        //导热系数
        $("#daorexishu").slideUp(300);
        //耐压值和成型方式
        $("#naiyazhi").slideUp(300);
        $("#chengxinfangshi").slideUp(300);
        //板子厚度1.0,1.2,1.6
        QC.QutoliEv("[name=BoardThickness]", 4);
        QC.QutoliEv("[name='BoardThickness'][value='1'],[name='BoardThickness'][value='1.2']", 0);
        QC.Checked("BoardThickness", "1.6");
        //外层铜厚1oz
        QC.QutoliEv("[name=radCopperThickness]", 4);
        QC.Checked("radCopperThickness", "1 oz Cu");
        
        //阻焊颜色和字符颜色默认绿白
        QC.QutoliEv("[name=radSolderColor]", 0);
        QC.QutoliEv("[name=radSolderColor]", 3);
        QC.Checked("radSolderColor", "Green");
        QC.QutoliEv("[name=radFontColor]", 0);
        QC.QutoliEv("[name=radFontColor]", 3);
        QC.QutoliEv("[name=radFontColor][value='Green']", 2);
        QC.Checked("radFontColor", "White");
        QC.QutoliEv("[name='radSolderColor'][value='highantiwhiteoil']", 1);
      }
      //铝基板
      if (proCate == "aluminumItem") {
        $(".otherban_pic").hide();
        $(".lvjiban").show();
        //最小孔径
        $(".min_prosize").slideUp(300);
        //板厚比
        $(".thickness_aperture").slideDown(300);
        //导热系数
        $("#daorexishu").slideDown(300);
        $("#naiyazhi").slideDown(300);
        $("#chengxinfangshi").slideDown(300);
        //阻焊覆盖
        $(".impedance").slideUp(300);
        //板材2．广州铝基板、国纪铝基板
        QC.QutoliEv("[name=FR4Type]", 4);
        QC.QutoliEv("[name='FR4Type'][value='gzaluminum']", 0);
        QC.Checked("FR4Type", "Aluminum Board");
        //阻焊颜色和字符颜色默认白黑
        QC.QutoliEv("[name=radSolderColor]", 3);
        QC.Checked("radSolderColor", "White");
        QC.QutoliEv("[name=radFontColor]", 3);
        QC.QutoliEv("[name=radFontColor][value='White']", 2);
        QC.Checked("radFontColor", "Black");
        //外层铜厚0.5,0.75,1,2
        QC.QutoliEv("[name=radCopperThickness]", 0);
        QC.Checked("radCopperThickness", "1");
        //最小线宽线距
        QC.QutoliEv("[name=radLineWeight][value='4/4mil']", 1);
        
        //白黑绿
        QC.QutoliEv("[name=radSolderColor]", 1);
        QC.QutoliEv("[name='radSolderColor'][value='Green'],[name='radSolderColor'][value='Black'],[name='radSolderColor'][value='White'],[name='radSolderColor'][value='highantiwhiteoil']", 0);
        QC.Checked("radSolderColor", "White");
        QC.QutoliEv("[name=radFontColor]", 1);
        QC.QutoliEv("[name='radFontColor'][value='Black'],[name='radFontColor'][value='White']", 0);
        QC.Checked("radFontColor", "Black");
        
        
        Pcb.aluminumArea();
      }
    }
    //最小线宽线距
    QC.Checked("radLineWeight", "8/8mil");
    Pcb.hidLayersSort();
    
  },
  //铝基板事件
  aluminumArea: function () {
    var area = Pcb.CalcArea();
    var boardType = $("[name=boadtype]:checked").val();
    var num = $("[name=hidNum]").val();
    var boardThickness = $("[name=BoardThickness]:checked").val();
    var copperThickness = $("[name=radCopperThickness]:checked").val();
    //导热系数
    var invoice = $("[name=Invoice]:checked").val();
    var proCate = $("[name=proCategory]:checked").val();
    if (proCate == "aluminumItem") {
      var setnum = num;
      if (boardType == 'Panel PCB as design') {
        var px = $("[name=pinban_x]").val();
        var py = $("[name=pinban_y]").val();
        setnum = setnum * (px * py);
      } else {
        setnum = $("[name=hidNum]").val();
      }
      
      //area > 5 &&
      if (setnum > 30) {
        if (area > 5) {
          if ((boardThickness == "1" || boardThickness == "1.2" || boardThickness == "1.6" || boardThickness == "2") && invoice == "1" && copperThickness == "1 oz Cu") {
            QC.QutoliEv("[name=WithstandVoltage]", 3);
          } else {
            QC.QutoliEv("[name='WithstandVoltage'][value='3500'],[name='WithstandVoltage'][value='4000']", 2);
            QC.Checked("WithstandVoltage", "2500")
          }
        } else {
          QC.QutoliEv("[name='WithstandVoltage'][value='3500'],[name='WithstandVoltage'][value='4000']", 2);
          QC.Checked("WithstandVoltage", "2500")
        }
        QC.QutoliEv("[name='radPlatingType'][value='Immersion gold']", 2);
        if ($("[name=radPlatingType]:checked").val() == "Immersion gold") {
          $(".imgoldthincknesszone").hide()
          QC.Checked("radPlatingType", "OSP")
        } else {
        
        }
        
        
        //板子厚度0.8到2.0
        QC.QutoliEv("[name='BoardThickness']", 0);
        QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='2.4']", 1);
        QC.Checked("BoardThickness", "0.8");
        QC.Checked("BoardThickness", "1.6");
        
        //外层铜厚都可选
        QC.QutoliEv("[name='radCopperThickness']", 0);
        QC.QutoliEv("[name='radCopperThickness']", 3);
        QC.Checked("radCopperThickness", "1 oz Cu");
        //国纪、广州都可选,默认广州
        QC.QutoliEv("[name='FR4Type'][value='Aluminum Board']", 3);
        QC.QutoliEv("[name='FR4Type'][value='gzaluminum']", 3);
        QC.Checked("FR4Type", "gzaluminum");
        //成型方式
        QC.QutoliEv("[name='FormingType'][value='mould']", 3);
        //如何板厚1-2，导热系数1，铜厚1,，耐压值3000v和4000v可选
        //if ((boardThickness == "1" || boardThickness == "1.2" || boardThickness == "1.6" || boardThickness == "2") && invoice == "1" && copperThickness == "1 oz Cu") {
        //    QC.QutoliEv("[name=WithstandVoltage]", 3);
        //} else {
        //    QC.QutoliEv("[name='WithstandVoltage'][value='3500'],[name='WithstandVoltage'][value='4000']", 2);
        //    QC.Checked("WithstandVoltage", "2500")
        //}
        QC.QutoliEv("[name='FormingType'][value='laser'],[name='FormingType'][value='module']", 3);
        QC.QutoliEv("[name='radSolderColor'][value='highantiwhiteoil']", 3);
        
      } else {
        QC.QutoliEv("[name='radPlatingType'][value='Immersion gold']", 3);
        
        //板子厚度0.8到2.0
        QC.QutoliEv("[name='BoardThickness']", 0);
        QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='2.4']", 1);
        
        QC.QutoliEv("[name='BoardThickness'][value='0.8']", 2);
        QC.Checked("BoardThickness", "1.6");
        
        //外层铜厚只可选1oz
        QC.QutoliEv("[name='radCopperThickness']", 2);
        QC.QutoliEv("[name='radCopperThickness'][value='1 oz Cu']", 3);
        QC.Checked("radCopperThickness", "1 oz Cu");
        //只可选国际铝基板
        QC.QutoliEv("[name='FR4Type'][value='gzaluminum']", 2);
        QC.QutoliEv("[name='FR4Type'][value='Aluminum Board']", 3);
        QC.Checked("FR4Type", "Aluminum Board");
        QC.QutoliEv("[name='FormingType'][value='mould']", 2);
        QC.Checked("FormingType", "mechanical");
        //耐压值
        //QC.QutoliEv("[name='WithstandVoltage'][value='3500'],[name='WithstandVoltage'][value='4000']", 2);
        //QC.Checked("WithstandVoltage", "2500");
        QC.QutoliEv("[name='FormingType'][value='laser'],[name='FormingType'][value='module']", 2);
        QC.Checked("FormingType", "mechanical");
        QC.QutoliEv("[name='radSolderColor'][value='highantiwhiteoil']", 2);
      }
      
      //铝基5平以上去沉金 5平以下隐藏1.0
      if (area > 5) {
        QC.QutoliEv("[name='radPlatingType'][value='Immersion gold']", 1);
      } else {
        QC.QutoliEv("[name='radPlatingType'][value='Immersion gold']", 0);
        
        //板子厚度0.8到2.0
        QC.QutoliEv("[name='BoardThickness']", 0);
        QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='2.4']", 1);
        
        QC.QutoliEv("[name='BoardThickness'][value='0.8']", 2);
        QC.Checked("BoardThickness", "1.6");
        
        //外层铜厚只可选1oz
        QC.QutoliEv("[name='radCopperThickness']", 2);
        QC.QutoliEv("[name='radCopperThickness'][value='1 oz Cu']", 3);
        QC.Checked("radCopperThickness", "1 oz Cu");
        //QC.QutoliEv("[name='BoardThickness'][value='1']", 1);
      }
      
      
    }
  },
  
  //5平米有铅无铅判断
  hasWithlead: function () {
    var area = Pcb.CalcArea();
    if (area <= 5) {
      $("input[name='radPlatingType']").eq(1).parents("li").hide();
      //只有选中有铅的时候才选中无铅
      if (QC.GetCheckedVal("radPlatingType") == "HASL with lead")
        QC.Checked("radPlatingType", "HASL lead free");
      
      
    } else {
      $("input[name='radPlatingType").eq(1).parents("li").show();
      //QC.Checked("radPlatingType", "HASL with lead");
      
    }
  },
  //测试方式
  whatFlyingProbe: function () {
    var area = Pcb.CalcArea();
    
    //板子数量<=30,飞针测试免费
    var num = $("[name='hidNum']").val();
    if (area > 10) {
      QC.QutoliEv("[name=FlyingProbe]", 1);
      QC.QutoliEv("[name=FlyingProbe][value=full]", 0);
      QC.QutoliEv("[name=FlyingProbe][value=teststand]", 0);
      QC.Checked("FlyingProbe", "full");
    } else if (area > 5 && area < 10) {
      QC.QutoliEv("[name=FlyingProbe][value=full]", 0);
      QC.QutoliEv("[name=FlyingProbe][value=free]", 1);
      QC.QutoliEv("[name=FlyingProbe][value=teststand]", 1);
      var testtype = QC.GetCheckedVal("FlyingProbe");
      if (testtype == "free") {
        QC.Checked("FlyingProbe", "full");
      }
    } else {
      QC.QutoliEv("[name=FlyingProbe][value=teststand]", 1);
      if (num > 30) {
        QC.Checked("FlyingProbe", "full");
        QC.QutoliEv("[name=FlyingProbe][value=free]", 1);
      } else {
        QC.Checked("FlyingProbe", "free");
        QC.QutoliEv("[name=FlyingProbe][value=teststand],[name=FlyingProbe][value=full]", 1);
      }
    }
    
    
  },
  
  //常规参数关联联动
  CommonRelation: function (srcemt) {
    var boardLayer = $("[name=hidLayers]:checked").val();
    /*6层板以上的内层铜厚不能选2oz*/
    if (boardLayer > 6) {
      QC.Checked("InnerCopperThickness", "1");
    }
    
    
    Pcb.DefaultVal("radCopperThickness", "1 oz Cu");
    Pcb.DefaultVal("BoardThickness", "1.6");
    Pcb.DefaultVal("InnerCopperThickness", "1");
    Pcb.DefaultVal("Invoice", "1");
    Pcb.DefaultVal("radPlatingType", "HASL lead free");
    Pcb.DefaultVal("radSolderCover", "Tenting vias");
    
    var boardThickness = $("[name=BoardThickness]:checked").val();
    var num = $("[name=hidNum]").val();
    var area = Pcb.CalcArea();
    var invoice = $("[name=Invoice]:checked").val();
    var copperThickness = $("[name=radCopperThickness]:checked").val();
    var FR4Type = $("[name=FR4Type]:checked").val();
    
    //0.4板厚分割方式不支持V割和V割+锣槽
    var panelSeparatingWayOption = $(".panel-separatingWay option:checked").val();
    if (panelSeparatingWayOption == "vcut" || panelSeparatingWayOption == "vcutluocao") {
      QC.QutoliEv("[name='BoardThickness'][value='0.4']", 2);
      if ($("[name='BoardThickness'][value='" + boardThickness + "']").parent("label").hasClass("not-selectable") || $("[name='BoardThickness'][value='" + boardThickness + "']").parents("li").is(':hidden')) {
        QC.Checked("BoardThickness", '1.6');
      } else {
        QC.Checked("BoardThickness", boardThickness);
      }
      
    } else {
      if (boardLayer == 1 || boardLayer == 2) {
        if (FR4Type == 'Normal FR-4 Board') {
          QC.QutoliEv("[name='BoardThickness'][value='0.4']", 3)
        }
      }
    }
    
    if (area > 5 && num > 30) {
      //板厚1-2，导热系数1，铜厚1,，耐压值3000v和4000v可选
      if ((boardThickness == "1" || boardThickness == "1.2" || boardThickness == "1.6" || boardThickness == "2") && invoice == "1" && copperThickness == "1 oz Cu") {
        QC.QutoliEv("[name=WithstandVoltage]", 3);
      } else {
        QC.QutoliEv("[name='WithstandVoltage'][value='3500'],[name='WithstandVoltage'][value='4000']", 2);
        QC.Checked("WithstandVoltage", "2500")
      }
      
      if (invoice == "3") {
        
        if (boardThickness == "0.8" || boardThickness == "2") {
          QC.QutoliEv("[name='radCopperThickness'][value='2 oz Cu']", 2);
          if (copperThickness == "2 oz Cu") {
            QC.Checked("radCopperThickness", "1 oz Cu")
          }
          
        } else {
          QC.QutoliEv("[name='radCopperThickness']", 3);
        }
      } else {
        QC.QutoliEv("[name='radCopperThickness']", 3);
      }
    } else {
      QC.QutoliEv("[name='WithstandVoltage'][value='3500'],[name='WithstandVoltage'][value='4000']", 2);
      QC.Checked("WithstandVoltage", "2500")
    }
    
    
  },
  //默认值
  DefaultVal: function (name, val) {
    if ($("[name=" + name + "]").parentsUntil("li").parent().find(".choose").length == 0) {
      QC.Checked(name, val);
    }
  },
  
  ///板材TG联动
  Fr4TG: function () {
    var fr4Type = $("[name=FR4Type]:checked").val();
    var layer = $("[name=hidLayers]:checked").val();
    // QC.QutoliEv('[name="FR4Tg"]', 3);
    //当板材为fr4时
    if (fr4Type == "Normal FR-4 Board" || fr4Type == "gj" || fr4Type == "fr4jt") {
      $(".fr4-tg").slideDown(300);
      if (fr4Type == "Normal FR-4 Board") {
        $('#sptg130').text("TG140");
      } else {
        $('#sptg130').text("TG130");
      }
      if (layer <= 2) {
        QC.Checked("FR4Tg", "TG130");
        
      } else if (layer > 2) {
        QC.QutoliEv("[name=FR4Tg][value=TG130]", 2);
        QC.Checked("FR4Tg", "TG150");
        
      }
    } else {
      //$(".fr4-tg").slideUp(300);
      QC.Checked("FR4Tg", "TG130");
    }
    //非生益不出现tg150,170
    if (fr4Type != "Normal FR-4 Board" || layer == 1) {
      QC.QutoliEv("[name=FR4Tg][value=TG150],[name=FR4Tg][value=TG170]", 2);
    }
    
    //if (fr4Type == "Aluminum Board") {
    //    $("#daorexishu").slideDown(300);
    
    //} else {
    //    QC.Checked("Invoice", 1);
    //    $("#daorexishu").slideUp(300);  //隐藏导热系数
    //}
    
    var boardLayer = $("[name=hidLayers]:checked").val();
    var bh = $("[name=BoardThickness]:checked").val();
    var area = Pcb.CalcArea();
    
    //QC.QutoliEv("[name='radCopperThickness']", 3);
    if (boardLayer == 1) QC.QutoliEv("[name='radCopperThickness'][value='2 oz Cu']", 2);
    
    if (area < 5) {
      QC.Checked("FrBrand", "guoji");
      if (boardLayer == 1) {
        if (fr4Type == "Aluminum Board") {
          //铝基板1 1.2导热系数1.0w可选0.5oz
          if ((bh == 1 || bh == 1.2) && bh == 1) {
            QC.QutoliEv("[name='radCopperThickness']", 3);
          } else {
            QC.Checked("radCopperThickness", "1 oz Cu");
          }
          $("#FrBrand").show();
          QC.QutoliEv("[name='radCopperThickness'][value='0.75 oz Cu']", 2);
          QC.QutoliEv("[name='FrBrand'][value='guangzhou']", 2);
          QC.QutoliEv("[name='radCopperThickness'][value='0.5 oz Cu']", 2);
          
        } else {
          QC.Checked("radCopperThickness", "1 oz Cu");
          QC.QutoliEv("[name='radCopperThickness'][value='0.75 oz Cu']", 2);
          QC.QutoliEv("[name='radCopperThickness'][value='0.5 oz Cu']", 2);
          $("#FrBrand").hide();
        }
      } else {
        QC.QutoliEv("[name='radCopperThickness'][value='0.5 oz Cu']", 2);
        QC.QutoliEv("[name='radCopperThickness'][value='0.75 oz Cu']", 2);
        $("#FrBrand").hide();
      }
      
      
    } else {
      QC.QutoliEv("[name='radCopperThickness']", 3);
      QC.Checked("radCopperThickness", "1 oz Cu");
      if (boardLayer == 1 && fr4Type == "Aluminum Board") {
        $("#FrBrand").show();
        QC.QutoliEv("[name='FrBrand'][value='guangzhou']", 3);
        
        QC.Checked("FrBrand", "guangzhou");
        $("[name=FrBrand][value='guoji']").parents("li").find(".item").addClass("not-selectable").removeAttr("click");
        
      } else {
        $("#FrBrand").hide();
        QC.QutoliEv("[name='radCopperThickness'][value='0.75 oz Cu']", 2);
        QC.QutoliEv("[name='radCopperThickness'][value='0.5 oz Cu']", 2);
      }
    }
  },
  
  PlateNumber: function () {
    //板子层数
    var boardLayer = $("[name=hidLayers]:checked").val();
    //板子数量
    var num = $("[name=hidNum]").val();
    // var fr4Type = $("[name=FR4Type]:checked").val();
    //产品类别
    var proCate = $("[name=proCategory]:checked").val();
    if (proCate == "fr4Item") {
      QC.QutoliEv("[name='FR4Type']", 4);
      QC.QutoliEv("[name='FR4Type'][value='Normal FR-4 Board'],[name='FR4Type'][value='fr4jt'],[name='FR4Type'][value='gj']", 0);
      if (boardLayer == 1 || boardLayer == 2) {
        var boardType = $("[name=boadtype]:checked").val();
        var setnum = num;
        if (boardType == 'Panel PCB as design') {
          var px = $("[name=pinban_x]").val();
          var py = $("[name=pinban_y]").val();
          setnum = setnum * (px * py);
        } else {
          setnum = $("[name=hidNum]").val();
        }
        if (setnum <= 30) {
          QC.QutoliEv("[name='FR4Type'][value='gj'],[name='FR4Type'][value='fr4jt']", 2);
          QC.Checked("FR4Type", "Normal FR-4 Board");
        } else {
          QC.QutoliEv("[name='FR4Type'][value='gj'],[name='FR4Type'][value='fr4jt']", 3);
          QC.Checked("FR4Type", "gj");
          
          //30片以上亮灯提醒
          $("[name='FR4Type'][value='gj']").parents(".item").addClass("ant-btn-clicked"), setTimeout(function () {
            $(".pcbonline-options .item").removeClass("ant-btn-clicked")
          }, 300)
        }
      } else {
        QC.QutoliEv("[name='FR4Type'][value='gj'],[name='FR4Type'][value='fr4jt']", 2);
        QC.Checked("FR4Type", "Normal FR-4 Board");
      }
    }
  },
  
  //阻焊颜色联动
  SolderColor: function () {
    var val = $("[name=radSolderColor]:checked").val();
    var duiname = "radFontColor";
    QC.QutoliEv("[name='" + duiname + "']", 3);
    if (val != "None") QC.QutoliEv("[name='" + duiname + "'][value='" + val + "']", 2);
    if (val == 'Green' || val == 'mattegreen') {
      QC.QutoliEv("[name='" + duiname + "'][value='mattegreen'],[name='" + duiname + "'][value='Green']", 2);
      QC.Checked(duiname, "White");
    } else if (val == 'White') {
      QC.Checked(duiname, "Black");
    } else if (val == 'Black' || val == 'matteblack') {
      QC.QutoliEv("[name='" + duiname + "'][value='Black'],[name='" + duiname + "'][value='matteblack'],[name='" + duiname + "'][value='Green'],[name='" + duiname + "'][value='mattegreen'],[name='" + duiname + "'][value='Blue']", 2);
      QC.Checked(duiname, "White");
    } else {
      QC.Checked(duiname, "White");
    }
    
    var proCate = $("[name=proCategory]:checked").val();
    var radSolderColor = $("[name='radSolderColor']:checked").val();
    if (proCate == "fr4Item" || proCate == "cem1Item") {
      QC.QutoliEv("[name='radFontColor']", 3);
      //if (radSolderColor == 'Black' || radSolderColor == 'matteblack') {
      //    QC.QutoliEv("[name='radFontColor'][value='green'],[name='radFontColor'][value='Black'],[name='radFontColor'][value='blue'],[name='radFontColor'][value='matteblack'],[name='radFontColor'][value='mattegreen']", 2);
      //    QC.QutoliEv("[name='radFontColor'][value='White']", 3);
      //   QC.Checked("radFontColor", "White");
      //} else if (radSolderColor == 'White' || radSolderColor == 'Whitehigh') {
      //    QC.QutoliEv("[name='radFontColor'][value='White']", 2);
      //    QC.QutoliEv("[name='radFontColor'][value='Black']", 3);
      //    QC.Checked("radFontColor", "Black");
      //} else if (radSolderColor == 'Green' || radSolderColor == 'mattegreen') {
      //    QC.QutoliEv("[name='radFontColor'][value='green'],[name='radFontColor'][value='mattegreen']", 2);
      //    QC.QutoliEv("[name='radFontColor'][value='White']", 3);
      //   QC.Checked("radFontColor", "White");
      //} else if (radSolderColor == 'yellow') {
      //    QC.QutoliEv("[name='radFontColor'][value='yellow']", 2);
      //   QC.Checked("radFontColor", "White");
      //} else if (radSolderColor == 'red') {
      //    QC.QutoliEv("[name='radFontColor'][value='red']", 2);
      //    QC.Checked("radFontColor", "White");
      //} else if (radSolderColor == 'blue') {
      //    QC.QutoliEv("[name='radFontColor'][value='blue']", 2);
      //    QC.Checked("radFontColor", "White");
      //} else if (radSolderColor == 'none') {
      //    QC.Checked("radFontColor", "White");
      //}
      if (val != "None") QC.QutoliEv("[name='" + duiname + "'][value='" + val + "']", 2);
      if (val == 'Green' || val == 'mattegreen') {
        QC.QutoliEv("[name='" + duiname + "'][value='mattegreen'],[name='" + duiname + "'][value='Green']", 2);
        QC.Checked(duiname, "White");
      } else if (val == 'White') {
        QC.Checked(duiname, "Black");
      } else if (val == 'Black' || val == 'matteblack') {
        QC.QutoliEv("[name='" + duiname + "'][value='Black'],[name='" + duiname + "'][value='matteblack'],[name='" + duiname + "'][value='Green'],[name='" + duiname + "'][value='mattegreen'],[name='" + duiname + "'][value='Blue']", 2);
        QC.Checked(duiname, "White");
      } else {
        QC.Checked(duiname, "White");
      }
    } else {
      if (radSolderColor == 'Black') {
        QC.QutoliEv("[name='radFontColor'][value='Black']", 2);
        QC.Checked("radFontColor", "White");
      } else if (radSolderColor == 'White' || radSolderColor == 'highantiwhiteoil') {
        QC.QutoliEv("[name='radFontColor'][value='White']", 2);
        QC.QutoliEv("[name='radFontColor'][value='Black']", 3);
        QC.Checked("radFontColor", "Black");
      } else if (radSolderColor == 'Green') {
        QC.QutoliEv("[name='radFontColor'][value='Green'],[name='radFontColor'][value='mattegreen']", 2);
        QC.QutoliEv("[name='radFontColor'][value='White']", 3);
        QC.Checked("radFontColor", "White");
      }
    }
  },
  
  ///出货类型事件
  BoardTypeEvent: function () {
    var boardType = $("[name=boadtype]:checked").val();
    var h = $("[name='hidLength']").val();
    var w = $("[name='hidWidth']").val();
    var num = $("[name='hidNum']").val();
    if (boardType == "Single PCB") {
      $("[name=VCut]").val("none");
      $("#acceptCrossedzone").slideUp(300);
      if (h > 0 && w > 0 && num > 0) {
        $("[name=acceptCrossed][value=Yes]").click();
      }
      $("#pinbanzone").slideUp(300);
      $("#unit").text("*pcs");
      $("#unitpricedesc").text("*size of pc");
      //$(".xy-sizepanelpic img").attr("src", "/img/img/pcbonline/demo02.jpg");
    } else {//拼版出货
      $("[name=VCut] option[value=vcut]").prop("selected", true);
      $("#pinbanzone").slideDown(300);
      $("#acceptCrossedzone").slideDown(300);
      $("[for=set]").slideDown(300);
      //锣槽制空消失
      $(".luocao-state").hide();
      $("#cao_x,#cao_y").val(0);
      $(".panel-separatingWay").on("change", function () {
        //if ($(".panel-separatingWay").val() == 'none' || $(".panel-separatingWay").val() == 'vcut') {
        //    $(".luocao-state").hide();
        //}else{
        //    $(".luocao-state").show();
        //}
        Pcb.CommonRelation(this);
      });
      if (boardType == "Panel PCB as design") {
        $("#unitpricedesc").text("*size of panel");
        $("#unit").text("*sets");
        $("[for2=jpset]").slideUp(300);
        $(".imposition-information-example").hide();
        //$(".xy-sizepanelpic img").attr("src", "/img/img/pcbonline/demo03.jpg");
      } else if (boardType == "Panel by ALLPCB") {
        $("#unit").text("*pcs");
        $("#unitpricedesc").text("*size of pc");
        $("[for2=jpset]").slideDown(300);
        $(".imposition-information-example").slideDown(300);
        
        //拼版信息示例
        $(".imposition-information-example").hover(function () {
          $(".imposition-informationExample").css("z-index", "1000");
        }, function () {
          $(".imposition-informationExample").css("z-index", "-10");
        });
        $(".suggest-masklayer").height($(document).height());
        $(".suggest-masklayer").click(function () {
          $("#informationpinban").css("z-index", "-999");
          $(".suggest-masklayer").hide();
        });
      }
      Pcb.BoardTypeData();
      
    }
  },
  ///拼版下的Set转Pcs
  BoardTypeData: function () {
    var num = $("[name=hidNum]").val();
    var pcsCount = num;
    var boardType = $("[name=boadtype]:checked").val();
    if (boardType == "Single PCB") {
      $("[name=pinban_x]").val(1);
      $("[name=pinban_y]").val(1);
      QC.Checked("processeEdge_x", "none");
      $("[name=processeEdge_y]").val("0");
      $("[name=VCut]").val("none");
    } else {
      var l = parseFloat($("[name=hidLength]").val());
      var w = parseFloat($("[name=hidWidth]").val());
      
      if (!(l && w)) return;
      
      
      var px = $("[name=pinban_x]").val();
      var py = $("[name=pinban_y]").val();
      if (QC.GetCheckedVal("processeEdge_x") == "none") {
        $("[name=processeEdge_y]").val(0);
      }
      if (QC.GetCheckedVal("processeEdge_x") != "none" && parseFloat($("[name=processeEdge_y]").val()) < 4) {
        $("[name=processeEdge_y]").val(4);
      }
      var gybx = $("[name=processeEdge_x]:checked").val();
      var gyby = $("[name=processeEdge_y]").val();
      pcsCount = px * py * num;
      var c = l * px;
      var k = w * py;
      if (boardType == "Panel PCB as design") {
        QC.Checked("processeEdge_x", "none");
        $("[name=processeEdge_y]").val("0");
        var html = 'The fab will  process with：<span class="yellow bold pbchoicetype">' + num + ' SET=' + pcsCount + 'PCS boards</span> Shipping as panel.   <span class="undis pbchoicesize" >' + parseFloat(l).toFixed(2) + "X" + parseFloat(w).toFixed(2) + "mm" + '</span>          ';
        $(".imposition-requires-presentation").show();
        $(".tptsinfo").html(html);
      } else if (boardType == 'Panel by ALLPCB') {
        if (gybx == "updown") c += gyby * 2;
        if (gybx == "leftright") k += gyby * 2;
        if (gybx == "both") {
          k += gyby * 2;
          c += gyby * 2;
        }
        
        //拼版信息示例
        Pcb.ImpositionInformationExample();
        $(".imposition-requires-presentation").show();
      }
    }
    Pcb.PlateNumber();
    Pcb.hasWithlead();
  },
  
  ///表面处理沉金
  SurfaceData: function () {
    var ss = $("[name=radPlatingType]:checked").val();
    if (ss == "Immersion gold") {
      $("[name=ImGoldThinckness][value=1]").click();
      $(".imgoldthincknesszone").slideDown(300);
    } else {
      $(".imgoldthincknesszone").slideUp(300);
    }
    if (ss == "Immersion Tin") {
      setTimeout(function () {
        $(".ImmersionTin").show();
      }, 400)
      
    } else {
      $(".ImmersionTin").hide();
      
    }
  },
  //金手指需要时默认沉金
  goldFinger: function () {
    var goldFig = $("[name=Goldfinger]:checked").val();
    if (goldFig == 1) {
      QC.Checked("radPlatingType", "Immersion gold");
      $(".imgoldthincknesszone").slideDown(300);
    }
  },
  //层序
  hidLayersSort: function () {
    var layer = $("[name=hidLayers]:checked").val();
    var fr4Type = $("[name=FR4Type]:checked").val();
    var fr4Tg = $("[name=FR4Tg]:checked").val(); //FR-4 TG值：
    $(".layersort").empty();
    if (layer > 6) {
      QC.QutoliEv("[name='radVias'][value='0.2']", 3);
      $(".select-report").hide()
    } else {
      QC.QutoliEv("[name='radVias'][value='0.2']", 2)
      var radViasval = $("[name=radVias]:checked").val();
      if (radViasval == "0.2") {
        QC.Checked("radVias", "0.25");
      }
      
      
    }
    if (layer > 2 && fr4Type != "Aluminum Board") {
      for (var i = 1; i <= layer; i = i + 1) {
        var l = i;
        if (l == 0) l = 1;
        var html = '<li>L' + l + '<input class="w35 input-default h30 ml5 mr4" style="border:0;border-left:1px solid #e7e7e7" name="layersort" type="text"  value=""></li>';
        $(".layersort").append(html);
      }
      $(".layersortzone").slideDown(300);
      
    } else {
      if (layer == 1) {
        //带优品标识
        $(".yp-icon").find("input").each(function (i, el) {
          if ($(el).prop('checked')) {
            $(".biaopin").show();
            $(".youpin_box").hide();
            $(".select-report").removeClass("undis").show();
            QC.Checked("radPlatingType", "HASL lead free");
            //QC.Checked("radSolderCover", "Tenting vias");
            //Pcb.CommonRelation()
          } else {
          
          }
        })
      } else {
      
      }
      
      
      $(".layersortzone").slideUp(300);
    }
    if (layer > 2) {
      $(".inner-copper").slideDown(300);
    } else {
      QC.Checked("InnerCopperThickness", "1");
      $(".inner-copper").slideUp(300);
      
    }
    
    
    //层数和板材关于tg值板厚，铜厚的联动
    Pcb.fr4BoardRelation();
    
    
  },
  //层序和板材tg值联动
  fr4BoardRelation: function () {
    var layer = $("[name=hidLayers]:checked").val(); //板子层数
    var fr4Type = $("[name=FR4Type]:checked").val();//板材
    var proCate = $("[name=proCategory]:checked").val();
    var boardThickness = $("[name=BoardThickness]:checked").val();
    if (proCate == "fr4Item") {
      
      QC.QutoliEv("[name='BoardThickness']", 0);
      QC.QutoliEv("[name='radCopperThickness'][value='2 oz Cu']", 0);
      QC.QutoliEv("[name='radCopperThickness'][value='0.5 oz Cu'],[name='radCopperThickness'][value='0.75 oz Cu']", 1);
      if (fr4Type == "Normal FR-4 Board") {
        if ($('[name="FR4Tg"][value="TG130"]').prop("checked")) {
          $('[name="FR4Tg"][value="TG130"]').parent().html('<i class="jp-ico subscript-ico"></i><input class="undis" name="FR4Tg" type="radio" value="TG130" checked="checked">TG140')
        } else {
          $('[name="FR4Tg"][value="TG130"]').parent().html('<input class="undis" name="FR4Tg" type="radio" value="TG130" />TG140')
        }
      } else {
        if ($('[name="FR4Tg"][value="TG130"]').prop("checked")) {
          $('[name="FR4Tg"][value="TG130"]').parent().html('<i class="jp-ico subscript-ico"></i><input class="undis" name="FR4Tg" type="radio" value="TG130" checked="checked">TG130')
        } else {
          $('[name="FR4Tg"][value="TG130"]').parent().html('<input class="undis" name="FR4Tg" type="radio" value="TG130" />TG130')
        }
      }
      //1层板只可选tg130
      $('[name="FR4Tg"]').parent().removeClass("not-selectable");
      if (layer == 1) {
        QC.QutoliEv("[name='FR4Tg'][value='TG150'],[name='FR4Tg'][value='TG170']", 2);
        QC.Checked("FR4Tg", "TG130");
        QC.QutoliEv("[name='radCopperThickness'][value='2 oz Cu']", 2);
        if (fr4Type == "Normal FR-4 Board") {
          QC.QutoliEv("[name='BoardThickness']", 3);
          QC.QutoliEv("[name='BoardThickness'][value='2.4']", 2);
          QC.Checked("BoardThickness", '1.6');
        } else if (fr4Type == "fr4jt") {
          QC.QutoliEv("[name='BoardThickness']", 2);
          QC.QutoliEv("[name='BoardThickness'][value='1'],[name='BoardThickness'][value='1.2'],[name='BoardThickness'][value='1.6']", 3);
          
        } else if (fr4Type == "gj") {
          QC.QutoliEv("[name='BoardThickness']", 3);
          QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='0.8'],[name='BoardThickness'][value='2.4']", 2);
        }
        
        
      } else if (layer > 1) {
        QC.QutoliEv("[name='BoardThickness']", 3);
        QC.QutoliEv("[name='radCopperThickness'][value='2 oz Cu']", 3);
        if (layer == 2) {
          if (fr4Type == "Normal FR-4 Board") {
            QC.Checked("FR4Tg", "TG130");
            QC.QutoliEv("[name='BoardThickness']", 3);
            QC.QutoliEv("[name='radCopperThickness'][value='2 oz Cu']", 3);
          } else {
            QC.QutoliEv("[name='FR4Tg'][value='TG150'],[name='FR4Tg'][value='TG170']", 2);
            QC.Checked("FR4Tg", "TG130");
            if (fr4Type == "fr4jt") {
              QC.QutoliEv("[name='BoardThickness']", 3);
              QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='2']", 2);
            } else if (fr4Type == "gj") {
              QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='2.4']", 2);
              QC.QutoliEv("[name='FR4Tg'][value='TG150'],[name='FR4Tg'][value='TG170']", 2);
            }
          }
          
        } else if (layer > 2) {
          QC.QutoliEv("[name='FR4Tg'][value='TG130']", 2);
          QC.Checked("FR4Tg", "TG150");
          QC.QutoliEv("[name='FR4Type'][value='fr4jt'],[name='FR4Type'][value='gj']", 2);
          QC.Checked("FR4Type", "Normal FR-4 Board");
          if (layer == "4") {
            if (fr4Type == "Normal FR-4 Board") {
              QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='2.4']", 2);
            }
          }// else if (layer == "6") {
          else {
            if (fr4Type == "Normal FR-4 Board") {
              QC.QutoliEv("[name='BoardThickness'][value='0.4'],[name='BoardThickness'][value='0.6'],[name='BoardThickness'][value='0.8'],[name='BoardThickness'][value='2.4']", 2);
            }
          }
        }
      }
      QC.Checked("radCopperThickness", '1 oz Cu');
      QC.Checked("BoardThickness", '1.6');
    }
    if ($("[name='BoardThickness'][value='" + boardThickness + "']").parent("label").hasClass("not-selectable") || $("[name='BoardThickness'][value='" + boardThickness + "']").parents("li").is(':hidden')) {
      QC.Checked("BoardThickness", '1.6');
    } else {
      QC.Checked("BoardThickness", boardThickness);
    }
    
  },
  BoardThickness: function () {
    //铝基板 1.0-2.0
    //单面板 0.4-2.0
    //双面板 0.4-2.0
    //4层板  0.8-2.0
    //6层板  1.2-2.0
    var layer = $("[name=hidLayers]:checked").val();
    var fr4Type = $("[name=FR4Type]:checked").val();
    var area = Pcb.CalcArea();
    $("[name=BoardThickness]").each(function (i, dom) {
      var val = parseFloat($(dom).val());
      var isFlag = false;
      
      if (layer == 1) {
        if (fr4Type == "Aluminum Board") {
          
          if (area > 30) {
            if (val < 0.8 || val > 2) {
              isFlag = true;
            }
            //外层铜厚都可选
            QC.QutoliEv("[name='CopperThickness']", 3);
            QC.Checked("CopperThickness", "1");
          } else {
            if (val < 0.8 || val > 2) {
              isFlag = true;
            }
          }
          
        } else if (fr4Type == "cem1") {
          if (val < 1.0 || val > 1.6) {
            isFlag = true;
          }
        } else if (fr4Type == "fr4jt") {
          
          if (val < 1 || val > 1.6) {
            isFlag = true;
          }
        } else if (fr4Type == "gj") {
          
          if (val < 1 || val > 2) {
            isFlag = true;
          }
        } else {
          if (val < 0.4 || val > 2) {
            isFlag = true;
          }
        }
      } else if (layer == 2) {
        
        if (fr4Type == "Normal FR-4 Board") {
          $('[name="FR4Tg"][value="TG130"]').parent().html('<i class="jp-ico subscript-ico"></i><input class="undis" name="FR4Tg" type="radio" value="TG130" checked="checked">TG140')
          QC.QutoliEv("[name=FR4Tg][value=TG150],[name=FR4Tg][value=TG170]", 3);
          if (val < 0.4 || val > 2.4) {
            isFlag = true;
          }
        } else if (fr4Type == "fr4jt") {
          if (val < 0.6 || val > 2.4 || val == 2) {
            isFlag = true;
          }
          $('[name="FR4Tg"][value="TG130"]').parent().html('<i class="jp-ico subscript-ico"></i><input class="undis" name="FR4Tg" type="radio" value="TG130" checked="checked">TG130')
          QC.QutoliEv("[name=FR4Tg][value=TG150],[name=FR4Tg][value=TG170]", 2);
        } else if (fr4Type == "gj") {
          if (val < 0.8 || val > 2) {
            isFlag = true;
          }
          $('[name="FR4Tg"][value="TG130"]').parent().html('<i class="jp-ico subscript-ico"></i><input class="undis" name="FR4Tg" type="radio" value="TG130" checked="checked">TG130')
          QC.QutoliEv("[name=FR4Tg][value=TG150],[name=FR4Tg][value=TG170]", 2);
        }
      } else if (layer == 4) {
        if (val < 0.8 || val > 2) {
          isFlag = true;
        }
      } else {
        if (val < 1 || val > 2) {
          isFlag = true;
        }
      }
      
      if (isFlag) {
        QC.QutoliEv(dom, 2);
        
        
      } else {
        QC.QutoliEv(dom, 3);
      }
      
    });
    
  },
  //计算面积
  CalcArea: function () {
    var l = $("[name=hidLength]").val();
    var w = $("[name=hidWidth]").val();
    var n = $("[name=hidNum]").val();
    var t = QC.GetCheckedVal("boadtype");
    var p1 = $("[name=pinban_x]").val();
    var p2 = $("[name=pinban_y]").val();
    var b1 = $("[name=processeEdge_x]:checked").val();
    var b2 = $("[name=processeEdge_y]").val();
    var vCut = $("[name=VCut] option:selected").val();
    
    var m2 = (l * w * n) / 1000000;
    if (t == "Panel by ALLPCB") {
      var newsets = n / (p1 * p2);
      var caoX = $("[name=cao_y]").val(), caoY = $("[name=cao_y]").val();
      if (vCut.indexOf("luocao") >= 0) {
        caoX = $("[name=cao_x]").val();
        caoY = $("[name=cao_y]").val();
        caoX = parseFloat(caoX).toFixed(1);
        caoY = parseFloat(caoY).toFixed(1);
        
        l = parseFloat(l) * p1 + (p1 - 1) * caoX * 0.1;
        w = parseFloat(w) * p2 + (p2 - 1) * caoY * 0.1;
        
        m2 = (l * w * newsets) / 1000000;
      }
      var sxgyb = 0;
      var zygyb = 0;
      b2 = b2 / 10;
      if (b1 == "updown") {
        sxgyb = b2 * 2;
      }
      if (b1 == "leftright") {
        zygyb = b2 * 2;
      }
      if (b1 == "both") {
        sxgyb = b2 * 2;
        zygyb = b2 * 2;
      }
      var addNum = (sxgyb * w * p2 + zygyb * l * p1) * newsets / 1000000;
      if (vCut.indexOf("luocao") >= 0) {
        addNum = (sxgyb * w + zygyb * l) * newsets / 1000000;
      }
      m2 += addNum;
    }
    return m2;
  },
  SetInputNum: function (srcemt) {
    
    var width = parseFloat($("#hidWidth").val());
    var length = parseFloat($("#hidLength").val());
    if (isNaN(length) || length <= 0) {
      layer.msg('Please fill the length of the board!', {time: 3000});
      return false;
    }
    if (isNaN(width) || width <= 0) {
      layer.msg('Please fill the length of the board!', {time: 3000});
      return false;
    }
    
    var txtSelNum = $("#txtSelNum").val();
    
    if (txtSelNum % 50 != 0) {
      layer.msg('Quantity must be the multiple of 50!', {time: 3000});
      return false;
    }
    $("[name=hidNum]").val($("#txtSelNum").val());
    Pcb.CloseSelectNumDiv();
    
    var num = $("#hidNum").val();
    if (parseInt($("#txtSelNum").val()) > 0) {
      num = parseInt($("#txtSelNum").val());
      if (false) {
        layer.msg('More than 5 square meters, not supported!', {time: 3000});
      } else {
        $("#hidNum").val(num);
        $("#hidNum").blur();
        Pcb.CloseSelectNumDiv();
      }
    } else {
      Pcb.CloseSelectNumDiv();
    }
    Pcb.BoardTypeData();
    Pcb.CommonRelation($("[name=setInputNum]")[0]);
    Pcb.CalcPrice();
    
  },
  CheckWidHei: function (obj) {
    if (parseFloat(obj.val()) < 0.1) {
      layer.msg('Minimum length/Width: 0.1mm.', {time: 2000});
      obj.val("");
      
    } else if (parseFloat(obj.val()) > 650) {
      layer.msg('Maximum length/Width: 650mm.', {time: 2000});
      obj.val("");
      
    }
    
  },
  //参数验证
  ParmValid: function () {
    var flag = true;
    var FR4Typechecked = QC.GetCheckedVal(name = "FR4Type");
    var h = $("#hidLength").val();
    var w = $("#hidWidth").val();
    var boardLayer = $("[name=hidLayers]:checked").val();
    if (Pcb.num() == 0 || Pcb.h() == 0 || Pcb.w() == 0 || boardLayer == null || boardLayer == 0 || boardLayer == undefined) {
      return false;
    }
    
    
    if (Pcb.num() % 5 != 0) {
      layer.msg('The quantity must be a multiple of 5.', {time: 3000});
      return false;
    }
    
    
    var copperThicknessChecked = $("[name=radCopperThickness]:checked").val();
    var LineWeightChecked = $("[name=radLineWeight]:checked").val();
    
    if (QC.GetCheckedVal("radSolderColor") == QC.GetCheckedVal("radFontColor") && QC.GetCheckedVal("radFontColor") != "None") {
      layer.msg('Silk screen and solder resist can not be the same color.', {time: 3000, area: ['400px', '50px']});
      return false;
    }
    
    if (QC.GetCheckedVal("boadtype") == "Panel PCB as design") {
      if ($("#hidWidth").val() > 650) {
        $("#hidWidth").val("650");
      }
      if ($("#hidLength").val() > 650) {
        $("#hidLength").val("650");
      }
      if (FR4Typechecked == "Aluminum Board") {
        if ((!(parseFloat(h) >= 60 && parseFloat(w) >= 60) || (parseFloat(h) > 500 && parseFloat(w) > 500)) && ($("[name=VCut]").val() == "vcut" || $("[name=VCut]").val() == "vcutluocao")) {
          layer.alert("Panel PCB as design,For boards panelized with V-cut,the width and length for the boards should be both no less than 60MM,and no more than 500MM at the same time,Current Dimension " + h + "mm X " + w + "mm");
          return false;
        }
      } else {
        if ((!(parseFloat(h) >= 80 && parseFloat(w) >= 80) || (parseFloat(h) > 500 && parseFloat(w) > 500)) && ($("[name=VCut]").val() == "vcut" || $("[name=VCut]").val() == "vcutluocao")) {
          layer.alert("Panel PCB as design,For boards panelized with V-cut,the width and length for the boards should be both no less than 80MM,and no more than 500MM at the same time,Current Dimension " + h + "mm X " + w + "mm");
          return false;
        }
      }
    }
    if (QC.GetCheckedVal("boadtype") == "Panel by ALLPCB") {
      var px = $("[name=pinban_x]").val();
      var py = $("[name=pinban_y]").val();
      var c = h * px;
      var k = w * py;
      var caoX = $("[name=cao_x]").val();
      var caoY = $("[name=cao_y]").val();
      
      var vcuts = $("[name = VCut] option:selected").val();
      if (vcuts == "luocao") {
        if (caoX < 2 || caoY < 2 || caoX > 10 || caoY > 10) {
          layer.msg("Please enter the number between 2 and 10 for the spacing of gongs and slots");
          return false;
        }
      } else if (vcuts == "vcutluocao") {
        if ((caoX == 0 && (10 >= caoY && caoY >= 2)) || (caoY == 0 && (10 >= caoX && caoX >= 2))) {
        
        } else {
          if ((caoX == 0) && (caoY == 0)) {
            layer.msg("Vertical groove spacing and horizontal groove spacing cannot be equal to 0 at the same time.");
            return false;
          }
          layer.msg("Vertical and horizontal groove spacing should have a number of 0  and another one between 2 and 10.");
          return false;
        }
      }
      if (QC.GetCheckedVal("processeEdge_x") == "none") {
        $("[name=processeEdge_y]").val(0);
      }
      if (QC.GetCheckedVal("processeEdge_x") != "none" && parseFloat($("[name=processeEdge_y]").val()) < 3) {
        $("[name=processeEdge_y]").val(3);
      }
      var gybx = $("[name=processeEdge_x]:checked").val();
      var gyby = $("[name=processeEdge_y]").val();
      if (gybx == "updown") c += gyby * 2;
      if (gybx == "leftright") k += gyby * 2;
      
      if (gybx == "both") {
        k += gyby * 2;
        c += gyby * 2;
      }
      //if ($("[name=VCut]").val() == "luocao" || $("[name=VCut]").val() == "vcutluocao") {
      //    k += (py - 1) * 0.8;
      //    c += (px - 1) * 0.8;
      //}
      if (FR4Typechecked == "Aluminum Board") {
        if ((!(parseFloat(c) >= 60 && parseFloat(k) >= 60) || (parseFloat(c) > 500 && parseFloat(k) > 500)) && ($("[name=VCut]").val() == "vcut" || $("[name=VCut]").val() == "vcutluocao")) {
          layer.alert("Panel by ALLPCB,For boards panelized with V-cut,the width and length for the boards should be both no less than 60MM,and no more than 500MM at the same time,Current Dimension " + c + "mm X " + k + "mm", function () {
            layer.closeAll();
            $('html,body').animate({scrollTop: 0}, 700);
            $("#hidWidth").focus();
          });
          return false;
        }
      } else {
        if ((!(parseFloat(c) >= 80 && parseFloat(k) >= 80) || (parseFloat(c) > 500 && parseFloat(k) > 500)) && ($("[name=VCut]").val() == "vcut" || $("[name=VCut]").val() == "vcutluocao")) {
          layer.alert("Panel by ALLPCB,For boards panelized with V-cut,the width and length for the boards should be both no less than 80MM,and no more than 500MM at the same time,Current Dimension " + c + "mm X " + k + "mm", function () {
            layer.closeAll();
            $('html,body').animate({scrollTop: 0}, 700);
            $("#hidWidth").focus();
            
          });
          return false;
        }
      }
    }
    //if (QC.GetCheckedVal("boadtype") == "Single PCB") {
    //    if (parseFloat(h) < 0.5 && parseFloat(w) < 0.5) {
    //        layer.alert("Single chip shipped, monolithic dimensions can not be less than 5mm");
    //        return false;
    //    }
    //}
    if ($("[name=processeEdge_x]:checked").val() == "none") {
      $("[name=processeEdge_y]").val(0);
    }
    return flag;
  },
  
  //计算价格
  CalcPrice: function (jietili, jietilicount) {
    if (Pcb.ParmValid()) {
      $(".loading").show();
      console.log(Pcb.GetParm())
      
      
    } else {
      QC.SetPriceDetailToZero()
    }
  },
  
  ///获取参数
  GetParm: function () {
    var area = Pcb.CalcArea();
    //板子数量<=30,飞针测试免费
    var num = $("[name='hidNum']").val();
    if ($("[name=processeEdge_x]:checked").val() == "none") {
      $("[name=processeEdge_y]").val(0);
    }
    var parm = $("#fm").serialize();
    parm += "&PinBanType=" + $("[name=pinban_x]").val() + "x" + $("[name=pinban_y]").val();
    parm += "&ProcessEdges=" + $("[name=processeEdge_x]:checked").val() + ":" + $("[name=processeEdge_y]").val();
    var report = ['1', '1', '1', '1', '1'];
    //$(".select-report-option li").each(function (i, dom) {
    //    if ($(dom).hasClass("current"))
    //        report.push("1");
    //    else
    //        report.push("0");
    //});
    var IsHighQuality = 0;
    if ($(".pinzhiul .youpin_box").hasClass("active")) {
      IsHighQuality = 1;
      //if ($(".select-report-option .current").length == 0) {
      //    layer.msg('please choice report!', { time: 2000 });
      //    return false;
      //}
      //$(".select-report-option li").each(function (i, dom) {
      //    if ($(dom).hasClass("current"))
      //        report.push("1");
      //    else
      //        report.push("1");
      //});
    }
    parm += "&IsHighQuality=" + IsHighQuality;
    parm += "&NeedReportList=" + report.toString();
    return Tools.UrlToJsonParams(parm);
  },
  //导出计价表
  ExportQuote: function (type) {
    if (Pcb.ParmValid()) {
      if (type == 2 && ($("#QuotationEmail").val() == null || $("#QuotationEmail").val() == "")) {
        layer.alert("Please input your Email.");
        return false;
      }
      var area = Pcb.CalcArea();
      //板子数量<=30,飞针测试免费
      var num = $("[name='hidNum']").val();
      
      
      if (area > 10) {
        QC.Checked("FlyingProbe", "teststand");
        $("[name=FlyingProbe][value=teststand]").parents("li").find(".item").addClass("choose");
        $("[name=FlyingProbe][value=teststand]").before("<i class='jp-ico subscript-ico'></i>");
        $("[name=FlyingProbe][value=teststand]").prop("checked", true);
        $("[name=FlyingProbe][value=teststand]").parents("li").show();
        $("[name=FlyingProbe][value=free],[name=FlyingProbe][value=full]").parents("li").find(".item").removeClass("choose").find("i").remove();
        $("[name=FlyingProbe][value=free],[name=FlyingProbe][value=full]").prop("checked", false);
        $("[name=FlyingProbe][value=free],[name=FlyingProbe][value=full]").parents("li").hide();
      } else {
        $("[name=FlyingProbe][value=teststand]").parents("li").find(".item").removeClass("choose").find("i").remove();
        $("[name=FlyingProbe][value=teststand]").prop("checked", false);
        $("[name=FlyingProbe][value=teststand]").parents("li").hide();
        if (num > 30) {
          $("[name=FlyingProbe][value=free]").prop("checked", false);
          $("[name=FlyingProbe][value=free]").parents("li").find(".item").removeClass("choose").find("i").remove();
          $("[name=FlyingProbe][value=free]").parents("li").hide();
          $("[name=FlyingProbe][value=full]").parents("li").find(".item").addClass("choose");
          $("[name=FlyingProbe][value=full]").before("<i class='jp-ico subscript-ico'></i>");
          $("[name=FlyingProbe][value=full]").prop("checked", true);
          $("[name=FlyingProbe][value=sampling]").parents("li").show();
          $("[name=FlyingProbe][value=full]").parents("li").show();
        } else {
          $("[name=FlyingProbe][value=sampling]").prop("checked", false);
          $("[name=FlyingProbe][value=sampling]").parents("li").find(".item").removeClass("choose").find("i").remove();
          $("[name=FlyingProbe][value=full]").prop("checked", false);
          $("[name=FlyingProbe][value=full]").parents("li").find(".item").removeClass("choose").find("i").remove();
          $("[name=FlyingProbe][value=sampling]").parents("li").hide();
          $("[name=FlyingProbe][value=full]").parents("li").hide();
          $("[name=FlyingProbe][value=free]").prop("checked", true);
          $("[name=FlyingProbe][value=free]").parents("li").find(".item").addClass("choose");
          $("[name=FlyingProbe][value=free]").before("<i class='jp-ico subscript-ico'></i>");
          $("[name=FlyingProbe][value=free]").parents("li").show();
        }
      }
      
      if ($("[name=processeEdge_x]:checked").val() == "none") {
        $("[name=processeEdge_y]").val(0);
      }
      
      
      var parm = $("#fm").serialize();
      parm += "&PinBanType=" + $("[name=pinban_x]").val() + "x" + $("[name=pinban_y]").val();
      parm += "&ProcessEdges=" + $("[name=processeEdge_x]:checked").val() + ":" + $("[name=processeEdge_y]").val();
      parm += "&Area=" + area;
      
      var url = "";
      if (type == 2) {
        var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (!re.test($("#QuotationEmail").val())) {
          layer.alert("Please input the right E-mail address.");
          return false;
        }
        url = "/ashx/ExportQuotation.ashx?act=ExportQuotionAndSendEmail&Email=" + $("#QuotationEmail").val() + "&";
      } else {
        url = "/ashx/ExportQuotation.ashx?act=ExportQuotionDownloadFilePath&";
      }
     /* $.ajax({
        url: url + parm + "&t=" + new Date(),
        dataType: 'json',
        type: 'post',
        beforeSend: function () {
        },
        success: function (data) {
          if (data.success) {
            if (data.attr.indexOf("http") == 0) {
              window.open(data.attr);
            } else {
              layer.alert(data.attr);
            }
          }
        }
      });*/
     
     
    } else {
      layer.alert("Please Finish the Pcb online calculation first.");
    }
    
  },
  //加入购物车前检测拼版建议
  AddCartCheck: function () {
    var num = $("[name=hidNum]").val();
    var h = $("#hidLength").val();
    var w = $("#hidWidth").val();
    var fr4Type = $("[name=FR4Type]:checked").val();
    var boardLayer = $("[name=hidLayers]:checked").val();
    var boadType = $("[name=boadtype]:checked").val();
    var pinban_x = $("[name=pinban_x]").val();
    var pinban_y = $("[name=pinban_y]").val();
    var boardLayer = $("[name=hidLayers]:checked").val();
    
    var area = Pcb.CalcArea($("[name=hidLength]").val(), $("[name=hidWidth]").val(), $("[name=hidNum]").val());
    if (num == null || num == 0 || h == null || h == 0 || w == null || w == 0 || boardLayer == null || boardLayer == 0 || boardLayer == undefined) {
      layer.msg('Please put quantity, height, width, layers to calculate the price.', {time: 3000, area: ['450px', '50px']});
      return false;
    }
    if (boadType == "Panel PCB as design") {
      num = num * pinban_x * pinban_y;
    }
    if ((fr4Type == "fr4jt" && area <= 1) || (fr4Type == "fr4jt" && boardLayer > 2) || (fr4Type == "fr4jt" && num <= 30)) {
      layer.msg("FR-4 Kingboard is only available for 1-2 layer boards >  1㎡ with qty >  30pcs,pls quote again!", {time: 3000, area: ['636px', '50px']});
      return false;
    }
    if (QC.GetCheckedVal("radSolderColor") == QC.GetCheckedVal("radFontColor") && QC.GetCheckedVal("radFontColor") != "None") {
      layer.msg('Silk screen and solder resist can not be the same color.', {time: 3000});
      return false;
    }
    if (boadType == "Panel by ALLPCB") {
      Pcb.ShowSuggestImpositionInformation();
    } else {
      CartFormSubmit();
    }
  },
  //初始化参数
  InitParm: function () {
    
    if (Pcb.num() != undefined && Pcb.num() != null && Pcb.num() != "") {
      $("[name=countNumer]").prop("checked", false);
      $("[name=countNumer][value=" + Pcb.num() + "]").prop("checked", true);
    }
    
    Pcb.FrType();
    Pcb.BoardThickness();
    Pcb.hidLayersSort();
    Pcb.hasWithlead();
    Pcb.SolderColor();
    Pcb.CommonRelation();
  },
  
  AddCart: function () {
    layer.closeAll();
   
    if (Pcb.ParmValid()) {
      $("#btnAddCart").unbind("click")
      var note = "";
      if ($("#txtNote").val())
        note = "[Orther]:" + $("#txtNote").val().replace("|", "");
      var la = $("[name=hidLayers]:checked").val();
      var ls = [];
      if (la > 2) {
        $("[name=layersort]").each(function (i, dom) {
          var va = $(dom).val();
          if (va != "")
            ls.push(va);
        });
        if (ls.length == 0) {
          layer.msg('please input layer sort!', {time: 2000});
          setTimeout(function () {
            $("#btnAddCart").removeAttr("disabled", "disabled");
          }, 1000)
          return false;
          
        }
      }
      if (ls.length > 0) {
        note += "|[Layer Sort]:" + ls.toString();
      }
      var parm = Pcb.GetParm();
      parm.txtNote = note;
      console.log(parm)
      
    }
  },
  //关闭数量选中的弹出框
  CloseSelectNumDiv: function () {
    $('#boardnumber').hide();
    $("#hidNum").css({border: ""});
  },
  //拼版信息示例
  ImpositionInformationExample: function () {
    var l = $("[name=hidLength]").val();
    var w = $("[name=hidWidth]").val();
    var px = $("[name=pinban_x]").val();
    var py = $("[name=pinban_y]").val();
    var c = l * px;
    var k = w * py;
    if (l > 0 && w > 0 && px > 0 && py > 0) {
      var panelWidth = w * py;
      var panelHeight = l * px;
      var panellistLength = $(".panel-list").length;
      if (panellistLength > 0) {
        $(".panel-list").remove();
      }
      var exampleCreatePanel = ("<ul class='panel-list'>");
      for (var i = 0; i < px; i++) {
        var examplePanelLi = "<li>";
        for (var j = 0; j < py; j++) {
          var examplePanelSpan = ("<span class='item fl'></span>");
          examplePanelLi += examplePanelSpan;
        }
        examplePanelLi += "</li>";
        exampleCreatePanel += examplePanelLi;
      }
      exampleCreatePanel += "</ul>";
      $(".example-createpanel").html(exampleCreatePanel);
      
      var createPanel = ("<ul class='panel-list'>");
      for (var i = 0; i < px; i++) {
        var panelLi = "<li>";
        for (var j = 0; j < py; j++) {
          var panelSpan = ("<span class='item fl'></span>");
          panelLi += panelSpan;
        }
        panelLi += "</li>";
        createPanel += panelLi;
      }
      createPanel += "</ul>";
      $(".createpanel").html(createPanel);
      
      if (panelWidth > panelHeight) {
        var Proportion = parseFloat(200 / panelWidth).toFixed(2);
        var itemWidth = 200 / py;
        var itemHeight = panelHeight * Proportion / px;
      } else {
        var Proportion = parseFloat(200 / panelHeight).toFixed(2);
        var itemHeight = 200 / px;
        var itemWidth = panelWidth * Proportion / py;
      }
      
      $(".imposition-informationExample .proportion").text(Proportion);
      $(".panel-list .item").css({"width": itemWidth, "height": itemHeight});
      
      var panelyWidth = $(".imposition-informationExample .createpanel").width();
      var panelyHeight = $(".imposition-informationExample .createpanel").height();
      var edgerailHeight = panelyHeight;
      
      if (QC.GetCheckedVal("processeEdge_x") != "none" && parseFloat($("[name=processeEdge_y]").val()) < 3) {
        $("[name=processeEdge_y]").val(3);
      }
      var processeEdge_y = $("[name=processeEdge_y]").val();
      
      if (QC.GetCheckedVal("processeEdge_x") == "none") {
        c = l * px;
        k = w * py;
        panelyHeight = $(".imposition-informationExample .createpanel").height();
        $(".imposition-informationExample .edgerailwidth-left").hide();
        $(".imposition-informationExample .edgerailwidth-right").hide();
        $(".imposition-informationExample .edgerailwidth-top").hide();
        $(".imposition-informationExample .edgerailwidth-bottom").hide();
      }
      if (QC.GetCheckedVal("processeEdge_x") == "updown") {
        c += processeEdge_y * 2;
        processeEdge_y = 5;
        panelyHeight = $(".imposition-informationExample .createpanel").height() + (processeEdge_y * 2);
        edgerailHeight = panelyHeight - (processeEdge_y * 2);
        $(".imposition-informationExample .edgerailwidth-left").hide();
        $(".imposition-informationExample .edgerailwidth-right").hide();
        $(".imposition-informationExample .edgerailwidth-top").show();
        $(".imposition-informationExample .edgerailwidth-bottom").show();
      }
      if (QC.GetCheckedVal("processeEdge_x") == "leftright") {
        k += processeEdge_y * 2;
        processeEdge_y = 5;
        panelyWidth = $(".imposition-informationExample .createpanel").width() + (processeEdge_y * 2);
        panelyHeight = $(".imposition-informationExample .createpanel").height();
        edgerailHeight = panelyHeight;
        $(".imposition-informationExample .edgerailwidth-left").show();
        $(".imposition-informationExample .edgerailwidth-right").show();
        $(".imposition-informationExample .edgerailwidth-top").hide();
        $(".imposition-informationExample .edgerailwidth-bottom").hide();
      }
      if (QC.GetCheckedVal("processeEdge_x") == "both") {
        k += processeEdge_y * 2;
        c += processeEdge_y * 2;
        processeEdge_y = 5;
        panelyWidth = $(".imposition-informationExample .createpanel").width() + (processeEdge_y * 2);
        panelyHeight = $(".imposition-informationExample .createpanel").height() + (processeEdge_y * 2);
        edgerailHeight = panelyHeight - (processeEdge_y * 2);
        $(".imposition-informationExample .edgerailwidth-left").show();
        $(".imposition-informationExample .edgerailwidth-right").show();
        $(".imposition-informationExample .edgerailwidth-top").show();
        $(".imposition-informationExample .edgerailwidth-bottom").show();
      }
 
      $(".imposition-informationExample .edgerailwidth-left").css({"width": processeEdge_y, "height": edgerailHeight});
      $(".imposition-informationExample .edgerailwidth-right").css({"width": processeEdge_y, "height": edgerailHeight});
      $(".imposition-informationExample .edgerailwidth-top").css({"width": panelyWidth, "height": processeEdge_y});
      $(".imposition-informationExample .edgerailwidth-bottom").css({"width": panelyWidth, "height": processeEdge_y});
      $(".imposition-informationExample .panel-x").css("width", panelyWidth);
      $(".imposition-informationExample .panel-y .number").css("height", panelyHeight);
      $(".imposition-informationExample .panel-width").text(parseFloat(k).toFixed(2));
      $(".imposition-informationExample .panel-height").text(parseFloat(c).toFixed(2));
      
      
      var vCut = $("[name=VCut] option:selected").val();
      var caoX = $("[name=cao_y]").val(), caoY = $("[name=cao_y]").val();
      if (vCut.indexOf("luocao") != -1) {
        caoX = $("[name=cao_x]").val();
        caoY = $("[name=cao_y]").val();
        caoX = parseFloat(caoX).toFixed(1);
        caoY = parseFloat(caoY).toFixed(1);
        k += (py - 1) * caoY;
        c += (px - 1) * caoX;
        if (QC.GetCheckedVal("processeEdge_x") == "updown") {
          c += caoX * 2;
        }
        if (QC.GetCheckedVal("processeEdge_x") == "leftright") {
          k += caoY * 2;
        }
        if (QC.GetCheckedVal("processeEdge_x") == "both") {
          c += caoX * 2;
          k += caoY * 2;
        }
        $(".imposition-informationExample .panel-width").text(parseFloat(k).toFixed(2));
        $(".imposition-informationExample .panel-height").text(parseFloat(c).toFixed(2));
        
      } else {
        $(".imposition-informationExample .panel-width").text(parseFloat(k).toFixed(2));
        $(".imposition-informationExample .panel-height").text(parseFloat(c).toFixed(2));
      }
    }
    
    var num = $("[name=hidNum]").val();
    var px = $("[name=pinban_x]").val();
    var py = $("[name=pinban_y]").val();
    var sets = Math.round(num / (px * py) * 100) / 100;
    var html = 'Refer to your requirements, Panel dimension is:<span class="yellow bold pbchoicesize" >' + c.toFixed(2) + "X" + k.toFixed(2) + "mm" + '</span>,';
    if (sets % 5 == 0) {
      html += ' Panel Qty  <span class="yellow bold pbchoicetype">' + sets + ' SET=' + num + 'PCS boards</span>Shipping as panel.    ';
    } else {
      html += 'Panel Qty <span class="yellow bold pbchoicetype">' + sets + ' SET=' + num + 'PCS boards</span> ';
      sets = Math.floor(sets / 5) * 5 + 5;
      num = Math.ceil(sets * px * py);
      html += ' The fab will  process with：<span class="yellow bold pbchoicetype">' + sets + ' SET=' + num + 'PCS boards</span>Shipping as panel.          ';
      $("[name=hidNum]").val(num);
      $("[name=countNumer]").prop("checked", false);
      if (num > 100) {
        $("[name=txtSelNum]").val(num);
      } else {
        $("[name=countNumer][value='" + num + "']").prop("checked", true);
      }
    }
    
    //var html = 'Refer to your requirements, Panel dimension is:<span class="yellow bold pbchoicesize" >' + c.toFixed(2) + "X" + k.toFixed(2) + "mm" + '</span>,';
    $(".tptsinfo").html(html);
    
  },
  //建议拼版信息示例
  ShowSuggestImpositionInformation: function () {
    var l = $("[name=hidLength]").val();
    var w = $("[name=hidWidth]").val();
    var px = $("[name=pinban_x]").val();
    var py = $("[name=pinban_y]").val();
    
    var suggestitemX = px;
    var suggestitemY = py;
    if (parseInt(l) > parseInt(w)) {
      if (parseInt(px) > parseInt(py)) {
        suggestitemX = py;
        suggestitemY = px;
      }
    } else if (parseInt(l) == parseInt(w)) {
      suggestitemX = px;
      suggestitemY = py;
    } else {
      if (parseInt(px) < parseInt(py)) {
        suggestitemX = py;
        suggestitemY = px;
      }
    }
    var c = l * suggestitemX;
    var k = w * suggestitemY;
    
    if (l > 0 && w > 0 && px > 0 && py > 0) {
      var panelWidth = k;
      var panelHeight = c;
      var panellistLength = $(".suggest-panel-list").length;
      if (panellistLength > 0) {
        $(".suggest-panel-list").remove();
      }
      var suggestCreatePanel = $("<ul class='suggest-panel-list'>");
      suggestCreatePanel.appendTo($(".suggest-createpanel"));
      for (var i = 0; i < suggestitemX; i++) {
        var panelLi = $("<li></li>");
        panelLi.appendTo(suggestCreatePanel);
        for (var j = 0; j < suggestitemY; j++) {
          var panelSpan = $("<span class='item fl'></span>");
          panelSpan.appendTo(panelLi);
        }
      }
      panelLi.appendTo(suggestCreatePanel);
      $(".suggest-createpanel").appendTo("</ul>");
      if (panelWidth > panelHeight) {
        var Proportion = parseFloat(200 / panelWidth).toFixed(2);
        var itemWidth = 200 / suggestitemY;
        var itemHeight = panelHeight * Proportion / suggestitemX;
      } else {
        var Proportion = parseFloat(200 / panelHeight).toFixed(2);
        var itemHeight = 200 / suggestitemX;
        var itemWidth = panelWidth * Proportion / suggestitemY;
      }
      
      $(".suggest-imposition-information .proportion").text(Proportion);
      $(".suggest-panel-list .item").css({"width": itemWidth, "height": itemHeight});
      
      var panelyWidth = $(".suggest-imposition-information .suggest-createpanel").width();
      var panelyHeight = $(".suggest-imposition-information .suggest-createpanel").height();
      var edgerailHeight = panelyHeight;
      
      if (QC.GetCheckedVal("processeEdge_x") != "none" && parseFloat($("[name=processeEdge_y]").val()) < 3) {
        $("[name=processeEdge_y]").val(3);
      }
      var processeEdge_y = parseFloat($("[name=processeEdge_y]").val());
      if (QC.GetCheckedVal("processeEdge_x") == "none") {
        c = l * suggestitemX;
        k = w * suggestitemY;
        panelyHeight = $(".suggest-imposition-information .suggest-createpanel").height();
        $(".suggest-imposition-information .edgerailwidth-left").hide();
        $(".suggest-imposition-information .edgerailwidth-right").hide();
        $(".suggest-imposition-information .edgerailwidth-top").hide();
        $(".suggest-imposition-information .edgerailwidth-bottom").hide();
        //var suggestEdgerailWidth = "none";
      }
      if ((QC.GetCheckedVal("processeEdge_x") == "updown") || (QC.GetCheckedVal("processeEdge_x") == "leftright")) {
        if (panelWidth > panelHeight) {
          c += processeEdge_y * 2;
          processeEdge_y = 5;
          panelyHeight = $(".suggest-imposition-information .suggest-createpanel").height() + (processeEdge_y * 2);
          var edgerailHeight = panelyHeight - (processeEdge_y * 2);
          $(".suggest-imposition-information .edgerailwidth-left").hide();
          $(".suggest-imposition-information .edgerailwidth-right").hide();
          $(".suggest-imposition-information .edgerailwidth-top").show();
          $(".suggest-imposition-information .edgerailwidth-bottom").show();
          //var suggestEdgerailWidth = "updown";
        } else {
          k += processeEdge_y * 2;
          processeEdge_y = 5;
          panelyWidth = $(".suggest-imposition-information .suggest-createpanel").width() + (processeEdge_y * 2);
          panelyHeight = $(".suggest-imposition-information .suggest-createpanel").height();
          edgerailHeight = panelyHeight;
          $(".suggest-imposition-information .edgerailwidth-left").show();
          $(".suggest-imposition-information .edgerailwidth-right").show();
          $(".suggest-imposition-information .edgerailwidth-top").hide();
          $(".suggest-imposition-information .edgerailwidth-bottom").hide();
          //var suggestEdgerailWidth = "leftright";
        }
      }
      if (QC.GetCheckedVal("processeEdge_x") == "both") {
        k += processeEdge_y * 2;
        c += processeEdge_y * 2;
        processeEdge_y = 5;
        panelyWidth = $(".suggest-imposition-information .suggest-createpanel").width() + (processeEdge_y * 2);
        panelyHeight = $(".suggest-imposition-information .suggest-createpanel").height() + (processeEdge_y * 2);
        edgerailHeight = panelyHeight - (processeEdge_y * 2);
        $(".suggest-imposition-information .edgerailwidth-left").show();
        $(".suggest-imposition-information .edgerailwidth-right").show();
        $(".suggest-imposition-information .edgerailwidth-top").show();
        $(".suggest-imposition-information .edgerailwidth-bottom").show();
      }
     
      $(".suggest-imposition-information .edgerailwidth-left").css({"width": processeEdge_y, "height": edgerailHeight});
      $(".suggest-imposition-information .edgerailwidth-right").css({"width": processeEdge_y, "height": edgerailHeight});
      $(".suggest-imposition-information .edgerailwidth-top").css({"width": panelyWidth, "height": processeEdge_y});
      $(".suggest-imposition-information .edgerailwidth-bottom").css({"width": panelyWidth, "height": processeEdge_y});
      $(".suggest-imposition-information .panel-x").css("width", panelyWidth);
      $(".suggest-imposition-information .panel-y .number").css("height", panelyHeight);
      
      $(".board-height").text(parseFloat(l).toFixed(2));
      $(".board-width").text(parseFloat(w).toFixed(2));
      $(".board-heightPanel").text(suggestitemX);
      $(".board-widthPanel").text(suggestitemY);
      $(".suggest-imposition-information .panel-width,.suggest-panelWidth").text(parseFloat(k).toFixed(2));
      $(".suggest-imposition-information .panel-height,.suggest-panelHeight").text(parseFloat(c).toFixed(2));
      //$(".suggest-edgerailDirection").text(suggestEdgerailWidth);
      //$(".suggest-edgerailWidth").text($("[name=processeEdge_y]").val());
      
      var panelwidthW = parseFloat($("#informationpinban .imposition-informationExample .panel-width").text());
      var panelheightH = parseFloat($("#informationpinban .imposition-informationExample .panel-height").text());
      if (parseFloat(k.toFixed(2)) == panelwidthW && parseFloat(c.toFixed(2)) == panelheightH) {
        $("#informationpinban").addClass("informationpinban-example").removeClass("informationpinban-suggest informationpinban-equal");
        $("#informationpinban .suggest-imposition-information .title").text("Image for required panelization way  ↓ (for reference only)");
        $(".btn-acceptsuggestions").hide();
        $(".btn-again").show();
        $("#informationpinban .btn-addcart").text("Confirm the panelized way and add to the cart");
      } else if (parseFloat(k.toFixed(2)) == panelheightH && parseFloat(c.toFixed(2)) == panelwidthW) {
        $("#informationpinban").addClass("informationpinban-equal").removeClass("informationpinban-example informationpinban-suggest");
        $(".btn-acceptsuggestions").hide();
        $(".btn-again").show();
        $("#informationpinban .btn-addcart").text("Confirm the panelized way and add to the cart");
      } else {
        $("#informationpinban").addClass("informationpinban-suggest").removeClass("informationpinban-example informationpinban-equal");
        $("#informationpinban .suggest-imposition-information .title").text("Image for ALLPCB recommended panelization way ↓ (for reference only)");
        $(".btn-acceptsuggestions").show();
        $(".btn-again").hide();
        $("#informationpinban .btn-addcart").text("Ignore Suggestion, insist to add to cart ");
      }
    }
    var windowHeight = $(window).height();
    var informationpinbanHeight = $("#informationpinban").outerHeight();
    var informationpinbanTop = (windowHeight - informationpinbanHeight) / 2;
    $("#informationpinban").css({"top": informationpinbanTop, "z-index": "99999"});
    $(".suggest-masklayer").show();
    
  },
  AcceptSuggestionsImpositionInformation: function () {
    var boardheightPanelValue = $(".board-heightPanel").text();
    var boardwidthPanelValue = $(".board-widthPanel").text();
    $("[name=pinban_x]").val(boardheightPanelValue);
    $("[name=pinban_y]").val(boardwidthPanelValue);
    var suggestpanelheightValue = $(".suggest-panelHeight").text();
    var suggestpanelwidthValue = $(".suggest-panelWidth").text();
    $(".imposition-requires-presentation .pbchoicesize").text(suggestpanelheightValue + "X" + suggestpanelwidthValue + "cm");
    var edgerailwidthtopDisplay = $(".informationpinban-suggest .suggest-imposition-information .edgerailwidth-top").css("display");
    var edgerailwidthbottomDisplay = $(".informationpinban-suggest .suggest-imposition-information .edgerailwidth-bottom").css("display");
    var edgerailwidthleftDisplay = $(".informationpinban-suggest .suggest-imposition-information .edgerailwidth-left").css("display");
    var edgerailwidthrightDisplay = $(".informationpinban-suggest .suggest-imposition-information .edgerailwidth-right").css("display");
    if (edgerailwidthtopDisplay == "block" && edgerailwidthbottomDisplay == "block") {
      $(".request-item [name=processeEdge_x][value='updown']").prop("checked", true).before("<i class='jp-ico subscript-ico'></i>");
      ;
      $(".request-item [name=processeEdge_x][value='updown']").parents("li").siblings("li").find("[name=processeEdge_x]").prop("checked", false);
      $(".request-item [name=processeEdge_x][value='updown']").parents("label").addClass("choose");
      $(".request-item [name=processeEdge_x][value='updown']").parents("li").siblings("li").find("label").removeClass("choose").find("i").remove();
    }
    if (edgerailwidthleftDisplay == "block" && edgerailwidthrightDisplay == "block") {
      $(".request-item [name=processeEdge_x][value='leftright']").prop("checked", true).before("<i class='jp-ico subscript-ico'></i>");
      ;
      $(".request-item [name=processeEdge_x][value='leftright']").parents("li").siblings("li").find("[name=processeEdge_x]").prop("checked", false);
      $(".request-item [name=processeEdge_x][value='leftright']").parents("label").addClass("choose");
      $(".request-item [name=processeEdge_x][value='leftright']").parents("li").siblings("li").find("label").removeClass("choose").find("i").remove();
    }
    if (edgerailwidthtopDisplay == "block" && edgerailwidthbottomDisplay == "block" && edgerailwidthleftDisplay == "block" && edgerailwidthrightDisplay == "block") {
      $(".request-item [name=processeEdge_x][value='both']").prop("checked", true).before("<i class='jp-ico subscript-ico'></i>");
      ;
      $(".request-item [name=processeEdge_x][value='both']").parents("li").siblings("li").find("[name=processeEdge_x]").prop("checked", false);
      $(".request-item [name=processeEdge_x][value='both']").parents("label").addClass("choose");
      $(".request-item [name=processeEdge_x][value='both']").parents("li").siblings("li").find("label").removeClass("choose").find("i").remove();
    }
    
    $("#informationpinban").css("z-index", "-999");
    $(".suggest-masklayer").hide();
    Pcb.ImpositionInformationExample();
    Pcb.CalcPrice();
    
    return false;
  },
  HideSuggestImpositionInformation: function () {
    $("#informationpinban").css("z-index", "-999");
    $(".suggest-masklayer").hide();
    return false;
  },
  
  ///选种某个报价
  ChoicBatchPrice: function (e) {
    var ordermoney = $(e).attr("data-ordermoney");
    $(".pcbbatchzone ul").removeClass("active");
    $(e).addClass("active");
    
  },
  
  ///批量计价
  BatchQuote: function () {
    var parm = Pcb.GetParm();
   
  },
  
  //毫米英寸切换
  Switchover: function () {
    $("#dvConvertSize").on("click", function () {
      layer.open({
        type: 1,
        title: 'Inch ⇒ mm Conversion',
        area: ['450px', '245px'], //宽高
        content: $(".dvConvertSizebox")
      });
      var inchxL = $("#hidLength").val();
      var inchyW = $("#hidWidth").val();
      if (inchxL == "" || inchxL == "0.00" || inchxL == null || inchxL == "0") {
        $(".inchx").val();
      } else {
        inchxL = (inchxL / 25.4).toFixed(2)
        $(".inchx").val(inchxL);
      }
      if (inchyW == "" || inchyW == "0" || inchyW == null || inchyW == "0.00") {
        $(".inchy").val();
      } else {
        inchyW = (inchyW / 25.4).toFixed(2)
        $(".inchy").val(inchyW);
      }
    })
    
    $("#btnConvert").on("click", function () {
      var inchx = $(".inchx").val();
      var inchy = $(".inchy").val();
      if (inchx == "" || inchx == "0.00" || inchx == null || inchx == "0") {
        $("#hidLength").val("");
      } else {
        inchx = (inchx * 25.4).toFixed(2)
        $("#hidLength").val(inchx);
      }
      
      if (inchy == "" || inchy == "0.00" || inchy == null || inchy == "0") {
        $("#hidWidth").val("");
      } else {
        inchy = (inchy * 25.4).toFixed(2);
        $("#hidWidth").val(inchy);
      }
      layer.closeAll()
      QC.ValidNumberHight();
      QC.ValidNumberWidth();
    })
  },
  
  Init: function () {
    
    Pcb.InitParm();
    Pcb.Register();
    Pcb.CommonRelation();
    Pcb.CalcPrice();
    
    Pcb.Switchover();
    //长宽为空所有都可点击
    if (Pcb.w() == 0 || Pcb.h() == 0) {
      $(".pcbonline-options .item").removeClass("not-selectable");
    }
  }
}


//pcba计价
var Smt = {
  Init: function () {
    Smt.Register();
    Smt.CalcPriceProgress();
  },
  //选择工厂和价格变化事件
  Register: function () {
    Smt.OptionsItemClick();
    Smt.showOrhide();
    
    $(".pcba select,.pcba input").on("change", function () {
      Smt.CalcPriceProgress();
    });
  },
  //参数选择点击
  OptionsItemClick: function () {
    $(".smtonline-options .option-choose .item").each(function (i, dom) {
      $(dom).unbind("click").bind("click", function () {
        if (window.event) {//IE下阻止默认事件
          event.returnValue = false;
        } else {
          event.preventDefault();
        }
        //自供或代生产
        var name = $(this).find("input").attr("name");
        var proVal = $(this).find("input").val();
        $(this).find("i").remove()
        $(this).find("input").prop("checked", true);
        $(this).parents("li").siblings().find(".item").removeClass("choose").find("i").remove();
        $(this).parents("li").siblings().find("input").prop("checked", false);
        $(this).addClass("choose");
        $(this).find("input").before("<i class='jp-ico subscript-ico'></i>");
        if (name == 'ProductPCBTypeR') {
          if (proVal == "1") {
            $('#ProductPCBType').val(1);
            $(".no-pcborder").slideDown();
          } else if (proVal == "2") {
            $(".no-pcborder").slideUp();
            $('#ProductPCBType').val(2);
          } else if (proVal == "3") {
            Smt.GetOldPcbInfoList();
            $('#ProductPCBType').val(3);
          }
        }
        if (name == 'FirstSureR') {
          if (proVal == '1') {
            $('#FirstSure').val(1);
            $(".take_photo").show();
          } else {
            $('#FirstSure').val(2);
            $(".take_photo").hide();
          }
        }
        Smt.CalcPriceProgress();
      })
    })
  },
  ///参数变化
  ParmValid: function () {
    var flag = true;
    var proQuantity = $("[name=ProductNum]").val();//生产数量
    if (proQuantity == "" || parseInt(proQuantity) <= 0) {
      $("[name=ProductNum]")[0].focus();
      return false;
    }
    
    var pointnum = $("[name=PointNum]").val();
    if (pointnum == "" || parseInt(pointnum) < 0) {
      $("[name=PointNum]")[0].focus();
      return false;
    }
    //var bomSpecies = $("[name=PatchElementType]").val();//SMT物料种类
    //var smtQuantity = $("[name=PatchElementNum]").val();//单片SMT贴片元器件个数
    var weldMaterials = $("[name=DIPPointNum]").val();//单片插件个数
    if (weldMaterials == "") {
      $("[name=DIPPointNum]")[0].focus();
      return false;
    }
    
    var patchEleType = $("[name=PatchElementType]").val();
    if (patchEleType == "") {
      $("[name=PatchElementType]")[0].focus();
      return false;
    }
    
    var pcbY = $("[name=PcbSizeY]").val();
    if (pcbY == "" || parseInt(pcbY) <= 0) {
      $("[name=PcbSizeY]")[0].focus();
      return false;
    }
    
    var pcbX = $("[name=PcbSizeX]").val();
    if (pcbX == "" || parseInt(pcbX) <= 0) {
      $("[name=PcbSizeX]")[0].focus();
      return false;
    }
    
    //var icQuantity = $("[name=BGANum]").val();
    //var Xray = $("[name=XrayTestNum]").val();
    //var pcbSizeY = $("[name=PcbSizeY]").val();
    //var pcbSizeX = $("[name=PcbSizeX]").val();
    //$("[name=PatchElementNum]").val(Math.abs(smtQuantity));
    //$("[name=DIPNum]").val(Math.abs(weldMaterials));
    //$("[name=BGANum]").val(Math.abs(icQuantity));
    //$("[name=XrayTestNum]").val(Math.abs(Xray));
    if (parseInt(proQuantity) < 0 || proQuantity == "" || pointnum == "" || pointnum == ""
      || parseInt(pointnum) < 0 || parseInt(weldMaterials) < 0
    ) {
      return false;
    }
    
    //if (proQuantity == null || proQuantity == 0 || bomSpecies == "" || bomSpecies == null || smtQuantity == "" || smtQuantity == null || weldMaterials == "" || weldMaterials == "" || weldMaterials == null || icQuantity == "" || icQuantity == null || pcbSizeY == null || pcbSizeY == "" || pcbSizeX == null || pcbSizeX == "") { return false; }
    //if (parseInt(smtQuantity) + parseInt(weldMaterials) < parseInt(bomSpecies)) {
    //    layer.msg("The SMT part quantity and TH part quantity on individual board should be more than or equal to unique parts number");
    //    return false;
    //}
    return flag;
  },
  //展开收起
  showOrhide: function () {
    var _flag = true;
    $(".quotes-more-demand-title").click(function () {
      if (_flag) {
        $(".show-more").removeClass("smt-moreadd").addClass("smt-morereduce");
        $(".show-more").text("-close")
        $(".online-quotes-input-row").slideDown();
        $(this).parents(".quotes-more-demand-box").removeClass("hideCon").addClass("showCon");
        _flag = false;
      } else {
        $(".show-more").removeClass("smt-morereduce").addClass("smt-moreadd");
        $(".show-more").text("+unfold");
        $(this).parents(".quotes-more-demand-box").removeClass("showCon").addClass("hideCon");
        $(".online-quotes-input-row").slideUp();
        _flag = true;
      }
      
    })
  },
  //计价过程
  CalcPriceProgress: function () {
    
    if (!Smt.ParmValid()) {
      return false;
    }
    if ($("[name=ProType][value=5]").prop("checked")) {
      $.getJSON("/ashx/smt.ashx?act=GetDelieveryPrice&t=" + new Date().getTime(), $("#smtorderForm").serialize(), function (data) {
        var list = data.attr;
        $("[for-group='pcba'] .Num").empty();
        $(".price-delivery-list .w1 img").show()
        
        $("[for-group='pcba'] .DiscountPrice").empty();
        $(".pcbonline-results [for-group='pcba'] dd").find("input[name='radPrice']").remove();
        if (list != undefined && list != null && list.length > 0) {
          var item = list[0];
          $(".pcbonline-results [for-group='pcba']").show();
          $("[for-group='pcba'] .DeliveryDaysStr").text(item.DeliveryDaysStr);
          var pcbaNUM = $("[for-group='pcba'] [name='ProductNum']").val();
          $("[for-group='pcba'] .Num").text(pcbaNUM);
          $("[for-group='pcba'] .DiscountPrice").text(item.DiscountPrice);
          $("#stencilFreeTip").show();
        }
        CalcPrices();
      });
    } else {
      $("[for-group='pcba'] .Num").empty();
      $("[for-group='pcba'] .DiscountPrice").empty();
      // $(".pcbonline-results [for-group='pcba'] dd").find("input[name='radPrice']").remove();
      CalcPrices();
    }
  },
  //获取Pcb订单数据 （关联钢网用到）
  GetOldPcbInfoList: function (emt) {
    var jipt = $(emt).prev();
    $.getJSON("/ashx/pcbquote.ashx?act=GetPcbInfoListByStatus&userId=" + $("#userId").val() + "&OrderNo=" + (jipt.val() || ""), function (data) {
      var htmtrs = [];
      if (data.attr) {
        for (var i = 0; i < data.attr.length; i++) {
          var ifno = data.attr[i];
          
          var tr = "<tr><td title='Double-click Get'><div class='order-choose' onclick='Smt.TabPcbInfoListOrderChoose(this)'><input type='radio' name='orderNo' /><a class='color-333 order-NO' href=javascript:void(0)>" + ifno.OrderNO + "</a></div></td><td class='rel'><a class='blue' href='/download.aspx?filename=" + ifno.PcbFilePath + "&realname=" + ifno.PcbFileName + "'>" + ifno.PcbFileName + "</a><input type='submit' class='btn_confirm' value='Confirm' onclick='Smt.FillPcbOrderNo(this)' /></td></tr>";
          htmtrs.push(tr);
        }
      }
      
      
      if (jipt.length == 0) {
        var htm = [
          '<div class="sch" style="height:20px;line-height:20px;padding:5px;">',
          'Order: <input id="StencilOrderNo" name="StencilOrderNo" type="text" value="" style="margin-right:5px;border:1px solid #ccc;border-radius:4px;" />',
          '<a href="javascript:;" onclick="Smt.GetOldPcbInfoList(this)" style="padding:0 5px;border:1px solid #eee;border-radius:4px;background:#fefefe;display:inline-block">Search</a>',
          '</div>',
          '<table id="tabPcbInfoList">',
          '<thead>',
          '<tr>',
          '<th width="25%">PCB order No.</th>',
          '<th width="75%">PCB Gerber file</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          htmtrs.join(''),
          '</tbody>',
          '</table>'
        ];
        
        layer.open({
          type: 1,
          title: 'Please choose a PCB order for the PCB Assembly:',
          skin: 'layui-layer-rim', //加上边框
          area: ['600px', '240px'], //宽高
          content: htm.join('')
        });
      } else {
        jipt.parent().next().find("tbody").html(htmtrs.join(''));
      }
    });
    
  },
  //将pcb订单编号存入隐藏域
  FillPcbOrderNo: function (e) {
    $('input[name="PcbOrderNo"]').val($(e).parents("tr").find(".order-NO").text());
    pcbOrderNoNew = $(e).parents("tr").find(".order-NO").text();
    layer.closeAll();
  },
  
  TabPcbInfoListOrderChoose: function (e) {
    $(e).parents('tr').find('input[type=radio]').attr("checked", false);
    $(e).find('input[type=radio]').prop("checked", true);
    $(e).parents('tr').siblings('tr').find('.btn_confirm').hide();
    $(e).parents('tr').find('.btn_confirm').show();
    
  },
  AddSmtCart: function (relaitonid) {
    var optype = QC.GetOpType();
    if (optype != 4 && !Smt.ParmValid()) {
      return false;
    }
    var userId = $("#userId").val();
    if (parseInt(userId) > 0) {
      var chk = $("input[name='radPrice']:checked");
      
      $("#hidSmtCheckedDay").val($(chk).attr("datadays"));
      $("#hidSmtCheckedFaceKey").val($(chk).attr("datafactoryid"));
      
      
      if (optype == 4 || (optype == 5 && pcbOrderNoNew != "")) {
        $("#PcbOrderNo").val(pcbOrderNoNew);
      }
      
      var s = $("#smtorderForm").serialize() + "&RelationId=" + relaitonid + "&hidCountryId=" + _countryId;
      var requrl = "/ashx/smt.ashx?" + s + "&callback=?&act=AddCart";
      
      
      
/*      $.ajax({
        type: "post",
        async: false,
        url: requrl,
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        beforeSend: function () {
          //加载层-默认风格
          layer.load();
        },
        success: function (d) {
          layer.closeAll('loading');
          setTimeout(function () {
            $("#btnAddCart").removeAttr("disabled", "disabled");
          }, 1000)
          if (d.success) {
            
            QC.RegisterFlyer(this, function () {
              QC.ShowDilogAddCartSuccess(true);
            });
          } else {
            layer.alert(d.message, function () {
              layer.closeAll();
            });
          }
          
        }
        
      });*/
      
    }
  }
}

var Stencil = {
  ///注册计价页面的事件
  RegisterStencil: function () {
    //变换参数事件
    $(".stencil :radio").parent("p").on("click", function () {
      var inpname = $(this).find("input").attr("name");
      $(".stencil [name=" + inpname + "]").prop("checked", false);
      $(this).find("input").prop("checked", true);
      $(this).siblings().removeClass("on").find("i").remove();
      $(this).addClass("on");
      $(this).find("input").before("<i class='bg_ico'></i>");
      
      if (inpname == "RelationPCB") {
        var chkVal = $(this).find("input").val();
        $(".pcb").hide();
        $(".pcb .chkQutoItem").remove("checked");
        $(".pcbonline-results [for-group='pcb']").hide();
        if (chkVal <= 1) {
          $(".pcb .chkQutoItem").prop("checked", false);
          var tm = $("#stencilForm [name=StencilRemark]").val();
          var oldPcbOrderNo = "PcbOrderNo:" + $("#hidStencilToPcbOrderNo").val();
          if (tm.indexOf(oldPcbOrderNo) > -1) {
            tm = tm.replace(oldPcbOrderNo, "");
            $("#stencilForm [name=StencilRemark]").val(tm.trim());
          }
        }
        if (chkVal == 1) {
          $(".pcb").show();
          $(".pcb .chkQutoItem").prop("checked", true);
          $(".pcb .pcb-cont").show();
          $(".pcbonline-results [for-group='pcb']").show();
          Pcb.CalcPriceProgress();
          ShipCountryChange();
          CalcPrices();
          Pcb.CalcPrice();
        }
        if (chkVal == 2) {
          $(".pcb .chkQutoItem").prop("checked", false);
          Stencil.GetOldPcbInfoList();
        }
        
      }
      Stencil.InitStencilStatusData();
      
      if (name = "StencilFramework") {
        Stencil.IntelligentRecommendation();
      }
      if (name = "StencilSide") {
        Stencil.IntelligentRecommendation();
      }
    });
    //输入数量时
    $(".stencil [name=StencilNum]").on("keyup", function () {
      Stencil.InitStencilPrice();
    });
    $(".stencil [name=StencilNum]").on("change", function () {
      Stencil.InitStencilPrice();
    });
    $(".stencil [name=ProName]").on("change", function () {
      Stencil.InitStencilPrice();
    });
    
    //智能推荐
    //钢网点击出现尺寸
    $(".intelligent-recommendation").on("click", function () {
      $(".intelligent-recommendationPCBSize").slideDown(300);
    });
    //钢网旁边尺寸关闭按钮
    $(".no-recommend").on("click", function () {
      $(".intelligent-recommendationPCBSize").slideUp(300);
      $("#BoardHeight").val("");
      $("#BoardWidth").val("")
      
    });
  },
  //获取Pcb订单数据 （关联钢网用到）
  GetOldPcbInfoList: function (emt) {
    var jipt = $(emt).prev();
    $.getJSON("/ashx/PcbQuote.ashx?act=GetPcbInfoListByStatus&userId=" + $("#userId").val() + "&OrderNo=" + (jipt.val() || ""), function (data) {
      var htmtrs = [];
      if (data.attr) {
        for (var i = 0; i < data.attr.length; i++) {
          var ifno = data.attr[i];
          
          var tr = "<tr><td title='Double-click Get'><div class='order-choose' onclick='Stencil.TabPcbInfoListOrderChoose(this)'><input type='radio' name='orderNo' /><a class='color-333 order-NO' href=javascript:void(0)>" + ifno.OrderNO + "</a></div></td><td class='rel'><a class='blue' href='/file/DownFile?realname=" + ifno.PcbFileName + "&path=" + ifno.PcbFilePath + "'>" + ifno.PcbFileName + "</a><input type='submit' class='btn_confirm' value='Confirm' onclick='Stencil.FillPcbOrderNo(this)' /></td></tr>";
          htmtrs.push(tr);
        }
      }
      
      
      if (jipt.length == 0) {
        var htm = [
          '<div class="sch" style="height:20px;line-height:20px;padding:5px;">',
          'Order: <input id="StencilOrderNo" name="StencilOrderNo" type="text" value="" style="margin-right:5px;border:1px solid #ccc;border-radius:4px;" />',
          '<a href="javascript:;" onclick="Stencil.GetOldPcbInfoList(this)" style="padding:0 5px;border:1px solid #eee;border-radius:4px;background:#fefefe;display:inline-block">Search</a>',
          '</div>',
          '<table id="tabPcbInfoList">',
          '<thead>',
          '<tr>',
          '<th width="25%">PCB order No.</th>',
          '<th width="75%">PCB Gerber file</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          htmtrs.join(''),
          '</tbody>',
          '</table>'
        ];
        
        layer.open({
          type: 1,
          title: 'Please choose a PCB order for the stencil:',
          skin: 'layui-layer-rim', //加上边框
          area: ['600px', '240px'], //宽高
          content: htm.join('')
        });
      } else {
        jipt.parent().next().find("tbody").html(htmtrs.join(''));
      }
    });
    
  },
  //将pcb订单编号填充到备注里
  FillPcbOrderNo: function (e) {
    var tm = $("#stencilForm [name=StencilRemark]").val();
    var oldPcbOrderNo = "PcbOrderNo:" + $("#hidStencilToPcbOrderNo").val();
    if (tm.indexOf(oldPcbOrderNo) > -1) {
      tm = tm.replace(oldPcbOrderNo, "");
    }
    $("#hidStencilToPcbOrderNo").val($(e).parents("tr").find(".order-NO").text())
    $("#stencilForm [name=StencilRemark]").val((tm + " PcbOrderNo:" + $(e).parents("tr").find(".order-NO").text()).trim());
    layer.closeAll();
  },
  
  TabPcbInfoListOrderChoose: function (e) {
    $(e).parents('tr').find('input[type=radio]').attr("checked", false);
    $(e).find('input[type=radio]').prop("checked", true);
    $(e).parents('tr').siblings('tr').find('.btn_confirm').hide();
    $(e).parents('tr').find('.btn_confirm').show();
    
  },
  //获取钢网产品数据
  GetStencilData: function () {
    $.getJSON("/ashx/Stencil.ashx?act=GetStencilProduce", function (data) {
      var list = data.attr;
      var framework = $(".stencil [name=StencilFramework]:checked").val() == "Framework" ? "1" : "0";//有无边框
      var electropolishing = $(".stencil [name=StencilElectropolishing]:checked").val() == "Yes" ? "1" : "0";//抛光
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var PolishedFinish = "";
          var frame = "data-frame='1'";
          if (item.ProName.indexOf("Standard") > -1)
            PolishedFinish = "data-polishedfinish='Standard'";
          if (item.ProName.indexOf("PolishedFinish") > -1)
            PolishedFinish = "data-polishedfinish='PolishedFinish'";
          if (item.ProName.indexOf("CustomSize_") > -1)
            frame = "data-frame='0'";
          var option = "<option style=''  " + frame + PolishedFinish + " value='" + item.Id + "' data-unitweight='" + item.UnitWeight + "' data-jdbmoney='" + item.CostMoney + "' data-unitprice='" + item.UnitPrice + "' data-deliverydays='" + item.DeliveryDays + "' data-TBoardHeight='" + item.TBoardHeight + "' data-TBoardWidth='" + item.TBoardWidth + "'>" + item.ProName.replace("Standard", "").replace("PolishedFinish", "") + "(Valid area " + item.TBoardWidth + "X" + item.TBoardHeight + "mm)</option>";
          $(" #tempdropstencil").append(option);
          $("#sProName").append(option);
        }
      }
      
      Stencil.InitStencilStatusData();
      var tt = $("[name=ProName]").attr("data-defval");
      if (tt) {
        $("[name=ProName]").val(tt);
        Stencil.InitStencilPrice();
      }
      //当参数有StencilFramework=Non-framework，默认选中Non-framework计价
      var uu = location.href;
      if (uu.indexOf('StencilFramework=Non-framework') != "-1") {
        Stencil.InitStencilStatusData();
      }
      
      
    });
  },
  //根据不同选项中初始化钢网产品数据
  InitStencilStatusData: function () {
    var framework = $(".stencil [name=StencilFramework]:checked").val();//有无边框
    var electropolishing = $(".stencil [name=StencilElectropolishing]:checked").val();//抛光
    var boardThickness = $(".stencil [name=StencilBoardThickness]:checked").val();//板厚
    var def = $(".stencil [name=ProName]").val();
    $(".stencil [name=ProName]").empty();
    if (electropolishing == "No")
      $(".stencil [name=ProName]").append($("#tempdropstencil [data-polishedfinish=Standard]").clone());
    else
      $(".stencil [name=ProName]").append($("#tempdropstencil [data-polishedfinish=PolishedFinish]").clone());
    
    if (framework == "Framework")
      $(".stencil [name=ProName]").find("[data-frame=0]").remove();
    else
      $(".stencil [name=ProName]").find("[data-frame=1]").remove();
    
    $(".stencil [name=ProName] option").each(function (i, dom) {
      if ($(dom).val() == def) {
        $(".stencil [name=ProName]").val(def);
        
      }
      
    });
    if ($("#BoardHeight").val() > 0 && $("#BoardWidth").val() > 0) {
      Stencil.IntelligentRecommendation();
    }
    Stencil.InitStencilPrice();
    
  },
  //智能推荐
  IntelligentRecommendation: function () {
    var BoardHeight = $("#BoardHeight").val();
    var BoardWidth = $("#BoardWidth").val();
    var StencilSide = $("[name=StencilSide]").val();
    var StencilSideIndex = $("[name=StencilSide]:checked").attr("data-index");
    var ProNameOption = $(".stencil [name=ProName] option");
    var ProNameArrayHeight = new Array();
    var ProNameArrayWidth = new Array();
    var ProNameArrayDataTBoardHeight = new Array();
    var ProNameArrayDataTBoardWidth = new Array();
    var ConformProNameArrayDataDefval = new Array();
    
    if (BoardHeight > 0 && BoardWidth > 0) {
      if (parseInt(StencilSideIndex) == 3) {
        if (parseFloat(BoardHeight) > parseFloat(BoardWidth)) {
          BoardWidth = parseFloat(BoardWidth) * 2;
        } else {
          BoardHeight = parseFloat(BoardHeight) * 2;
        }
        
      } else {
        BoardHeight = $("#BoardHeight").val();
        BoardWidth = $("#BoardWidth").val();
      }
      for (var i = 0; i < ProNameOption.length; i++) {
        ProNameArrayHeight.push(ProNameOption.eq(i).attr("data-tboardheight"));
        ProNameArrayWidth.push(ProNameOption.eq(i).attr("data-tboardwidth"));
      }
      ProNameArrayHeight = ProNameArrayHeight.sort(sortNumber);
      ProNameArrayWidth = ProNameArrayWidth.sort(sortNumber);
      
      for (var j = 0; j < ProNameArrayWidth.length; j++) {
        var ProNameArrayWidthItem = ProNameArrayWidth[j];
        if (parseFloat(ProNameArrayWidthItem) >= parseFloat(BoardWidth)) {
          ProNameArrayDataTBoardWidth.push(ProNameArrayWidthItem);
        }
      }
      
      for (var k = 0; k < ProNameArrayHeight.length; k++) {
        var ProNameArrayHeightItem = ProNameArrayHeight[k];
        if (parseFloat(ProNameArrayHeightItem) >= parseFloat(BoardHeight)) {
          ProNameArrayDataTBoardHeight.push(ProNameArrayHeightItem);
        }
      }
      var RecommendProNameDataTBoardHeight = ProNameArrayDataTBoardHeight[0];
      var RecommendProNameDataTBoardWidth = ProNameArrayDataTBoardWidth[0];
      for (var m = 0; m < ProNameOption.length; m++) {
        var ProNameDataTBoardHeight = ProNameOption.eq(m).attr("data-tboardheight");
        var ProNameDataTBoardWidth = ProNameOption.eq(m).attr("data-tboardwidth");
        if (parseFloat(ProNameDataTBoardHeight) >= parseFloat(RecommendProNameDataTBoardHeight)) {
          var DataDefval = ProNameOption.eq(m).val();
          ConformProNameArrayDataDefval.push(DataDefval);
        }
        if (parseFloat(ProNameDataTBoardWidth) >= parseFloat(RecommendProNameDataTBoardWidth)) {
          var DataDefval = ProNameOption.eq(m).val();
          ConformProNameArrayDataDefval.push(DataDefval);
        }
      }
      
      var NoRepeatConformProNameArrayDataDefval = new Array();
      for (var n = 0; n < ConformProNameArrayDataDefval.length; n++) {
        var items = ConformProNameArrayDataDefval[n];
        if ($.inArray(items, NoRepeatConformProNameArrayDataDefval) == -1) {
          NoRepeatConformProNameArrayDataDefval.push(items);
        }
      }
      
      var NewConformProNameArrayDataDefval = new Array();
      for (var o = 0; o < NoRepeatConformProNameArrayDataDefval.length; o++) {
        var NewDataDefval = NoRepeatConformProNameArrayDataDefval[o];
        var ProNameOptionChoose = $(".stencil [name=ProName] option[value='" + NewDataDefval + "']");
        var NewProNameDataTBoardHeight = ProNameOptionChoose.attr("data-tboardheight");
        var NewProNameDataTBoardWidth = ProNameOptionChoose.attr("data-tboardwidth");
        if (parseFloat(NewProNameDataTBoardHeight) >= parseFloat(BoardHeight) && parseFloat(NewProNameDataTBoardWidth) >= parseFloat(BoardWidth)) {
          NewConformProNameArrayDataDefval.push(NewDataDefval);
        }
      }
      if (NewConformProNameArrayDataDefval.length == 0) {
        layer.msg('No avaiable stencil could be found ,pls kindly contact your dedicated sales', {time: 2000});
        return false;
      }
      
      var FinallyDataDefvalArray = new Array();
      var ProNameAreaArray = new Array();
      if (NewConformProNameArrayDataDefval.length == 1) {
        var FinallyDataDefval = NewConformProNameArrayDataDefval[0];
        $(".stencil [name=ProName] option").prop("selected", false);
        $(".stencil [name=ProName] option[value='" + FinallyDataDefval + "']").prop("selected", true);
        return false;
      } else {
        for (var p = 0; p < NewConformProNameArrayDataDefval.length; p++) {
          var FinallyDataDefval = NewConformProNameArrayDataDefval[p];
          var NewProNameOptionChoose = $(".stencil [name=ProName] option[value='" + FinallyDataDefval + "']");
          var FinallyProNameDataTBoardHeight = NewProNameOptionChoose.attr("data-tboardheight");
          var FinallyProNameDataTBoardWidth = NewProNameOptionChoose.attr("data-tboardwidth");
          var ProNameArea = FinallyProNameDataTBoardHeight * FinallyProNameDataTBoardWidth;
          FinallyDataDefvalArray.push(FinallyDataDefval);
          ProNameAreaArray.push(ProNameArea);
          var FinallyProNameArea = Math.min.apply(null, ProNameAreaArray);
          var FinallyProNameAreaIndex = $.inArray(FinallyProNameArea, ProNameAreaArray);
          FinallyDataDefval = FinallyDataDefvalArray[FinallyProNameAreaIndex];
          $(".stencil [name=ProName] option[value='" + FinallyDataDefval + "']").prop("selected", true);
        }
      }
    }
  },
  ///初始化选中的钢网产品价格
  InitStencilPrice: function () {
    $("[for-group='stencil'] .Num").empty();
    $("[for-group='stencil'] .DiscountPrice").empty();
    $(".pcbonline-results [for-group='stencil'] dd").find("input[name='radPrice']").remove();
    $("#stencilFreeTip").hide();
    if ($("[name=ProType][value=4]").prop("checked")) {
      var obj = $(".stencil [name=ProName] option:selected");
      var ordermoney = 0;
      var unitprice = $(obj).attr("data-unitprice");
      var unitweight = $(obj).attr("data-unitweight");
      var buynum = $("[name=StencilNum]").val();
      var bh = $("[name=StencilBoardThickness]:checked").val();
      var slide = $("[name=StencilSide]").val();
      if (bh == 0.2) unitprice = parseFloat(unitprice) + 18;
      var slideindex = $("[name=StencilSide]:checked").attr("data-index");
      if (parseInt(slideindex) == 4) {
        buynum = 2;
        $("[name=StencilNum]").val(buynum);
        //   unitprice = parseFloat(unitprice) * 2;
      } else {
        buynum = 1;
        $("[name=StencilNum]").val(buynum);
      }
      var totalordermoney = parseFloat(unitprice) * parseInt(buynum);
      var totalweight = parseFloat(unitweight) * parseInt(buynum);
      var html = "";
      html = "  <input  type=\"radio\"  name=\"radPrice\"  data-totalweight='" + totalweight + "'  jdbmoney='0' datafactoryid='1' datadays='1'  dataprice='" + totalordermoney + "' style='display:none' /> ";
      $(".pcbonline-results [for-group='stencil']").show();
      $(".pcbonline-results [for-group='stencil'] dd").append(html);
      
      var deliveryDaysStr = "1-2 days";
      var isduringdate = IsDuringDate('2020-02-01', '2020-02-10');
      if (isduringdate == true) {
        var daydiff = GetDayDiff('2020/02/11 00:00:00');
        var daydiffend = parseInt(daydiff) + 1;
        deliveryDaysStr = daydiff + "-" + daydiffend.toString() + " days";
      }
      
      $("[for-group='stencil'] .DeliveryDaysStr").text(deliveryDaysStr);
      $("[for-group='stencil'] .Num").text(buynum);
      $("[for-group='stencil'] .DiscountPrice").text(totalordermoney);
    } else {
      $(".pcbonline-results [for-group='stencil']").hide();
    }
    ShipCountryChange(4);
    
    CalcPrices();
    
  },
  
  //添加到购物车
  AddStencilCart: function (relaitonid) {
    
    
    var chk = $(".pcbonline-results [for-group='stencil']").find("[name=radPrice]");
    var parm = "";
    var remark = [];
    var optype = QC.GetOpType();
    parm += "&StencilProId=" + $("#stencilForm").find("[name=ProName]").val();
    parm += "&StencilNum=" + $("#stencilForm").find("[name=StencilNum]").val();
    parm += "&StencilBoardThickness=" + $("#stencilForm [name=StencilBoardThickness]:checked").val();
    parm += "&StencilElectropolishing=" + $("#stencilForm [name=StencilElectropolishing]:checked").val();
    parm += "&StncilFiducials=" + $("#stencilForm [name=StncilFiducials]:checked").val();
    parm += "&StencilFramework=" + $("#stencilForm [name=StencilFramework]:checked").val();
    parm += "&StencilSide=" + $("#stencilForm [name=StencilSide]:checked").val();
    var size = "";
    var stencilFramework = $("#stencilForm [name=StencilFramework]:checked").val();
    
    var hh = $("[name=ProName] option:selected").text();
    size = hh.replace(/\([^\)]*\)/g, "") + "mm";//尺寸
    
    
    remark.push("Stencil type:" + $("#stencilForm [name=StencilFramework]:checked").val() + size);
    
    //抛光
    var electropolishing = $("#stencilForm [name=StencilElectropolishing]:checked").val();
    if (electropolishing != "No")
      remark.push("Electropolishing:" + electropolishing);
    remark.push("Side:" + $("#stencilForm [name=StencilSide]:checked").val());
    remark.push("BoardThickness:" + $("#stencilForm [name=StencilBoardThickness]:checked").val() + "mm");
    var stncilFiducials = $("#stencilForm [name=StncilFiducials]:checked").val();
    if (stncilFiducials != "none")
      remark.push("Fiducials:" + stncilFiducials);
    var tm = $("#stencilForm [name=StencilRemark]").val();
    var oldPcbOrderNo = "PcbOrderNo:" + $("#hidStencilToPcbOrderNo").val();
    if (tm.indexOf(oldPcbOrderNo) > -1) {
      tm = tm.replace(oldPcbOrderNo, "");
    }
    if (optype == 2)//如果是钢网板子的话先清空掉板子编号
      $("#hidStencilToPcbOrderNo").val(pcbOrderNoNew);
    var pcbOrderNo = $("#hidStencilToPcbOrderNo").val();
    if (tm)
      remark.push("Remark:" + tm);
    if (pcbOrderNo) {
      remark.push("PcbOrderNo:" + pcbOrderNo);
    }
    parm += "&PcbOrderNo=" + pcbOrderNo;
    parm += "&StencilRemark=" + remark.toString();
    parm += "&StencilTotalPrice=" + $(".pcbonline-results [for-group='stencil'] dd").find("[name=radPrice]").attr("dataprice");
    parm += "&RelationId=" + relaitonid;
    var requrl = "/ashx/stencil.ashx?" + parm + "&callback=?&act=AddCartStencil";
   /* $.ajax({
      type: "post",
      async: false,
      url: requrl,
      dataType: "jsonp",
      jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
      beforeSend: function () {
        //加载层-默认风格
        layer.load();
      },
      success: function (d) {
        if (d.success) {
          QC.RegisterFlyer(this, function () {
            QC.ShowDilogAddCartSuccess(true);
            $("#btnAddCart").removeAttr("disabled", "disabled");
          });
        } else {
          layer.alert(d.message, function () {
            layer.closeAll();
          });
          $("#btnAddCart").removeAttr("disabled", "disabled");
        }
        
      }
      
    });*/
    
    
  },
  
  Init: function () {
    
    Stencil.GetStencilData();
    Stencil.RegisterStencil();
    var uu = location.href;
    if (uu.indexOf('StencilFramework=Non-framework') != "-1") {
      QC.Checked("StencilFramework", "Non-framework");
    }
  }
  
}

function ToFixed(num) {
  return Math.floor(num * 100) / 100;
}

function ShipCountryChange(e) {
  $("#selShip").val("1")
  var cid = $("#selShipCountry").val();
  $("#selShip option").each(function (i, dom) {
    var ids = $(dom).attr("ids");
    if (ids != undefined && $(dom).attr("ids").indexOf("," + cid + ",") > -1) {
      $(dom).show();
    } else {
      $(dom).hide();
    }
  });
  //if ($("#selShipCountry").val != "") {
  //    $("#selShip").find("option[value='1']").attr("selected", true);
  //}
  QC.InitCountry();
  CalShip();
}

//校验当前时间是否处于某个时间段内
function IsDuringDate(beginDateStr, endDateStr) {
  var curDate = new Date(),
    beginDate = new Date(beginDateStr),
    endDate = new Date(endDateStr);
  if (curDate >= beginDate && curDate <= endDate) {
    return true;
  }
  return false;
}

//获取时间差
function GetDayDiff(endDateStr) {
  var beginDate = new Date();
  var date_ms = new Date(endDateStr).getTime() - beginDate.getTime();//获取时间差的毫秒数
  var date_day = Math.floor(date_ms / (24 * 3600 * 1000));//获取时间差的天数
  return date_day;
}


//计算运费 calcType:产品运费计算类型，1、pcb运费计算，2、钢网运费计算  1:dhl 3:hkpost 4：sf 5：tnt
function CalShip() {
  var optype = QC.GetOpType();
  var sid = $("#selShip").val();
  $(".expresslogo").show();
  var shippic = $("#selShip option:selected").attr("pic");
  if (shippic != undefined)
    $(".expresslogo").attr("src", "/images/pcbonline/" + shippic);
  var x = y = num = Thickness = 0;
  var shipname = $.trim($('#selShip option:selected').text());
  var countryname = $.trim($('#selShipCountry option:selected').text());
  var cid = $("#selShipCountry").val();
  if (sid == 2) {
    $(".HK-post-metion").show();
  } else {
    $(".HK-post-metion").hide();
  }
  var otherWeight = 0;
  var pcbtotal = $("[for-group='pcb'] .DiscountPrice").attr("TotalWeight");
  if (pcbtotal != undefined)
    otherWeight += parseFloat(pcbtotal);
  if (optype == 1 || optype == 2) {
    var untitwei = parseFloat($("#sProName").find("option:selected").attr("data-unitweight"));
    var sNum = $("input[name='StencilNum']").val();
    otherWeight += untitwei * parseFloat(sNum);
  }
  if (sid > 0 && cid > 0) {
  
  } else {
    CalcPrices();
  }
}

///计算价格：总费用，板子费用
function CalcPrices() {
  var pcbOrderMoney = 0;//pcb销售价
  var smtOrderMoney = 0;//smt销售价
  var stencilOrderMoney = 0;//smt销售价
  var shipMoney = 0;//运费
  var benefitMoney = 0;//优惠
  var TotalOrdermoney = 0;//最终的钱
  //计算pcb的销售价
  var weight = $(".express_weight").attr("data-weight");
  var op = QC.GetOpType();
  if (op == 1 || op == 2) {
    //钢网
    var stenccilfactory = $(".totalpricezone [for-group='stencil']").find(".DiscountPrice");
    if (stenccilfactory.length > 0) {
      var stencilOrderMoney = $(stenccilfactory).text();
      if (stencilOrderMoney == 0 || stencilOrderMoney == "" || stencilOrderMoney == "undefined") {
        $(stenccilfactory).text("0");
      }
      stencilOrderMoney = $(stenccilfactory).text();
    }
  }
  if (op == 3 || op == 4 || op == 2) {
    //板子
    var chkpcbfacory = $(".totalpricezone [for-group='pcb']").find(".DiscountPrice");
    if (chkpcbfacory.length > 0) {
      var pcbOrderMoney = chkpcbfacory.text();
      if (pcbOrderMoney == 0 || pcbOrderMoney == "" || pcbOrderMoney == "undefinded") {
        chkpcbfacory.text("0");
      }
      pcbOrderMoney = (chkpcbfacory.text());
      if (parseFloat(pcbOrderMoney) == 5) {
        $("[for-group='pcb'] .original-price s").text("10.00");
      } else {
        var originalPrice1 = Math.ceil(pcbOrderMoney / 0.8);
        $("[for-group='pcb'] .original-price s").text(originalPrice1.toFixed(2));
      }
      
    }
  }
  if (op == 4 || op == 5) {
    //贴片
    var chksmtfacory = $(".totalpricezone [for-group='pcba']").find(".DiscountPrice");
    if (chksmtfacory.length > 0) {
      var smtOrderMoney = $(chksmtfacory).text();
      if (smtOrderMoney == 0 || smtOrderMoney == "" || smtOrderMoney == "undefinded") {
        $(chksmtfacory).text("0");
      }
      smtOrderMoney = $(chksmtfacory).text();
    }
  }
  shipMoney = $("#hidShipMoney").val().replace("$", "").replace(",", "");
  if (!shipMoney) shipMoney = 0;
  //如果是美国或加拿大免首重
  var cid = $("#selShipCountry").val();
  var shipType = $("#selShip").val();
  if (shipType == 1 || shipType == 3 || shipType == 5) {
    $(".shipmoenyzone").show();
    $(".totalmoenyzone").show();
    var newprice = shipMoney - 0;
    if (newprice > 0) {
      /*$("#spShipMoeny").html("<i style='text-decoration: line-through;color: red;'>$" + (parseFloat(shipMoney) + 25) + "</i>&nbsp;$" + newprice);*/
      $("#spShipMoeny").html("$" + toDecimal2(newprice));
      shipMoney = newprice;
    } else {
      shipMoney = 0;
      $("#spShipMoeny").html("<i style='color: #02b23d;'>-</i>");
    }
    if (weight > 2 && shipType == 3) {
      shipmoney = 0;
      $("#spShipMoeny").html("<i style='color: #02b23d;'>HK Post only supports transportation within 2kg</i>");
    }
  }
  TotalOrdermoney = parseFloat(pcbOrderMoney) + parseFloat(smtOrderMoney) + parseFloat(benefitMoney) + parseFloat(shipMoney) + parseFloat(stencilOrderMoney);
  $(".FinalOrderMoney").html(toDecimal2(TotalOrdermoney));
  //当计价结果不等于5美金的时候显示
  //if ($('.FinalOrderMoney').eq(1).text() == "0.00")
  //    $(".newcustomers").show();
  //else
  //    $(".newcustomers").hide();
}

//添加到购物车提交事件
function CartFormSubmit(jumpUrl) {
  
  var isFlag = true;
  //提交购物车之前，先验证参数是否合法
  var optype = QC.GetOpType();
  if (optype == 2 || optype == 3 || optype == 4) {
    var num = $("[name=hidNum]").val();
    var h = $("#hidLength").val();
    var w = $("#hidWidth").val();
    var boardLayer = $("[name=hidLayers]:checked").val();
    if (num == null || num == 0 || h == null || h == 0 || w == null || w == 0 || boardLayer == null || boardLayer == 0 || boardLayer == undefined) {
      layer.msg('Please put quantity, height, width, layers to calculate the price.', {time: 3000, area: ['450px', '50px']});
      return false;
    }
    if (!Pcb.ParmValid()) {
      return false;
    }
    var userId = $("#userId").val();
    if ($("#hidErrMessage").val() != "") {
      layer.alert($("#hidErrMessage").val());
      return false;
    }
  }
  if (parseInt($("[name=selShipCountry]").val()) <= 0) {
    layer.msg("please choose country");
    return false;
  }
  if (parseInt($("[name=selShip]").val()) <= 0) {
    layer.msg("please choose ship type");
    return false;
  }
  if (optype == 4 || optype == 5) {
    if (!Smt.ParmValid()) {
      layer.msg("pls fill in required specification ");
      return false;
    }
  }
  
  if (optype == 5) {
    var smtPoint = parseInt($('input[name=PointNum]').val());
    var dipPoint = parseInt($('input[name=DIPPointNum]').val());
    var patchelementtype = parseInt($('input[name=PatchElementType]').val());
    
    if (smtPoint + dipPoint < patchelementtype) {
      layer.msg("The qty of parts kind should be less than the total qty of SMD and DIP solder joints");
      return false;
    }
  }
  if (isFlag) {
    $("#btnAddCart").attr("disabled", "disabled");
   
  }
  
}

function WinCallBack(url) {
  JumpUrl = url;
  CartFormSubmit();
  
}

///获取参数值
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return (r[2]);
  }
  return null;
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

//排序
function sortNumber(a, b) {
  return a - b;
}


//获取时间
function getdt(format) {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  var time = "";
  //精确到天
  if (format == 1) {
    time = year + "-" + month + "-" + date;
  }
  //精确到分
  else if (format == 2) {
    time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
  }
  $("#CurrentDatetime2,#CurrentDatetime1,#CurrentDatetime").text(time);
}


function calcList(calcListItem, index) {
  if (calcListItem != null || calcListItem != "" && calcListItem.length > 1) {
    $(".UnitPrice-box").show();
    $(".UnitPrice-box ul").html("");
    var html = "";
    for (var i = 0; i < calcListItem.length; i++) {
      html += `<li class="active">
                           <span class="w1">
                           <label class="fl">
                                <input class="undis" type="radio" checked="checked">
                           </label>${calcListItem[i]["Num"]}pcs</span>
                           <span class ="w2">${calcListItem[i]["BoardArea"].toFixed(4)}m²</span>
                           <span class ="w3">$${calcListItem[i]["SinglePrice"]}/pcs</span>
                           <span class ="w4">${calcListItem[i]["DisCount"]}%OFF</span>
                    </li>`
    }
    
    if (index == "undefined" || index == null) {
      index = "0"
    }
    $(".laddercenter ul").append(html);
    $(".laddercenter li").removeClass("active");
    $(".laddercenter li").eq(index).addClass("active");
    
    //去掉不打折的显示
    for (var q = 0; q < $(".laddercenter ul li").length; q++) {
      if ($(".laddercenter ul li").eq(q).find(".w4").text().substring(0, 1) == "0") {
        $(".laddercenter ul li").eq(q).find(".w4").hide()
      }
    }
    
    
  } else {
    $(".UnitPrice-box").hide();
  }
  
}


///计价页通用的功能
var QC = {
  Init: function () {
    QC.InitCountry();
    QC.InitUrlParm();
    QC.Register();
    
    QC.AutoStepDatetime($("#sysdatetime").val());
    QC.ExampleDiagram();
    QC.InitQutoItem();
    //计价右边菜单重置弹框
    var num = 1;
    $(".Amount-btn").on("click", function () {
      if (num == 1) {
        num = 2;
        layer.open({
          type: 1,
          title: " ",
          skin: 'yourclass',
          area: ['480px', '320px'], //宽高
          content: $(".Amountbox"),
          end: function () {
            num = 1;
          }
        });
      }
    })
    $("#txtMail").focus(function () {
      $(this).parent("div").css({"border-color": "#f90"})
    });
    $("#txtMail").blur(function () {
      $(this).parent("div").css({"border-color": "#000"})
    });
  },
  
  InitCountry: function () {
    //获取选中的国家
    var the_country = $("#selShipCountry").find(':selected').val();
    if (the_country > 0) {
      //选中，设置cookie
      $.cookie('the_country', the_country, {expires: 7});
      
    } else {
      //未选中国家，而cookie已经选中过
      if ($.cookie('the_country') != undefined && $.cookie('the_country') > 0) {
        $("#selShipCountry").val($.cookie('the_country'));
      }
    }
  },
  ///获取操作类型
  GetOpType: function () {
    var optyepe = 0;
    //板子
    var chkpcbfacory = $("[name=ProType][value=2]:checked").length;
    //贴片
    var chksmtfacory = $("[name=ProType][value=5]:checked").length;
    //钢网
    var chkstencilfacory = $("[name=ProType][value=4]:checked").length;
    if (chkstencilfacory == 1 && chksmtfacory == 0 && chkpcbfacory == 0) optyepe = 1;//只做钢网
    if (chkstencilfacory == 1 && chksmtfacory == 0 && chkpcbfacory == 1) optyepe = 2;//只做钢网+板子
    if (chkstencilfacory == 0 && chksmtfacory == 0 && chkpcbfacory == 1) optyepe = 3;//只做板子
    if (chkstencilfacory == 0 && chksmtfacory == 1 && chkpcbfacory == 1) optyepe = 4;//只做板子+贴片
    if (chkstencilfacory == 0 && chksmtfacory == 1 && chkpcbfacory == 0) optyepe = 5;//只做贴片
    return optyepe;
  },
  //初始化计价项
  InitQutoItem: function () {
    var type = $("#type").val();
    $("[name=ProType]").prop("checked", false);
    $("[name=ProType][value=" + type + "]").prop("checked", true);
    var urlinfo = Tools.UrlToJsonParams(window.location.href);
    $("[name=ProType][value=" + type + "]").parents("h3").unbind();
    if (type == 5) {
      //Pcb入口：默认贴片第一位  Pcb第二位（隐藏） 钢网不出现
      $("[name=ProType][value=5]").attr("disabled", true);
      if ($("#PCBAssemblyService").prop("checked")) {
        $("#predictdelievery").text("Pending");
        $("#predictrecieve").text("Pending");
      }
      CalShip();
      $(".pcba").insertBefore(".pcb");
      $(".pcb-con").hide();
      $(".pcb,[for-group=pcba],.pcba-con").show();
      $("[for-group=stencil],.pcbonline-results [for-group=pcb]").hide();
      
      $(".pcba,.pcbonline-results [for-group=pcba]").show();
      Smt.Init();
      
      
    } else if (type == 4) {
      //Pcb入口：板子，贴片不出现  只有钢网
      $(".stencil").insertBefore(".pcb");
      $("[for-group=stencil],.stencil-con").show();
      $(".pcb-con").hide();
      $("[for-group=pcba],.pcbonline-results [for-group=pcb]").hide();
      Stencil.Init();
      $(".pcb").hide();
      $(".stencil,[for-group=stencil]").show();
      
    } else {
      //Pcb入口：默认板子第一位  贴片第二位（隐藏） 钢网（隐藏）
      $(".pcb").insertBefore(".pcba");
      $(".pcba .pcba-con,.stencil .stencil-con").hide();
      $(".pcba,.stencil").show();
      $(".pcbonline-results [for-group=pcba],.pcbonline-results [for-group=stencil]").hide();
      $(".pcba,.stencil").hide();
      Pcb.Init();
      if (urlinfo.proCategory != undefined && urlinfo.proCategory.length > 0) {
        $("[name=proCategory][value='" + urlinfo.proCategory + "']").click();
        
      }
      
      
      $(".pcb-con,.pcbonline-results [for-group=pcb]").show();
    }
    
  },
  //获取参数选中
  GetCheckedVal: function (name) {
    var data = $("[name=" + name + "]:checked").val();
    if (data == undefined || data == null) {
      data = $("[name=" + name + "][checked=checked]").val()
    }
    return data;
  },
  //初始化url上参数
  InitUrlParm: function () {
    //产品类别
    Pcb.proCategoryClick();
    var parm = window.location.search.replace("?", "").split("&");
    
    if (window.location.search.indexOf("youpin") > -1) {
      $(".biaopin").removeClass("active");
      $(".youpin_box").addClass("active");
    }
    
    if (parm.length > 0) {
      for (var i = 0; i < parm.length; i++) {
        var tt = parm[i].split('=');
        if (tt.length > 1 && tt[1].length > 0) {
          var input = $("[name=" + tt[0] + "]");
          if (input.length > 0) {
            var type = $(input).attr("type");
            if (type == "number" || type == "text") {
              tt[1] = decodeURIComponent(tt[1]);
              $(input).val(tt[1]);
            } else if (type == "radio") {
              tt[1] = decodeURIComponent(tt[1]);
              QC.Checked(tt[0], tt[1]);
            } else if ($(input).prop("tagName").toLowerCase() == "select") {
              tt[1] = decodeURIComponent(tt[1]);
              $(input).find("option[value=" + tt[1] + "]").attr("selected", "selected");
            }
          }
        }
      }
    }
    
  },
  //页面点击事件
  Register: function () {
    //选项说明提示
    //$('[data-toggle="tooltip"]').tooltip();
    //登录后是否发送邮件事件
    $(".sendmail-btn").click(function () {
      $(".send-mail").show();
      $(".download-or-sendmail").css("margin-top", "0")
    });
    
    $("[name=ProType][value=2]").parents("h3").on("click", function () {
      var check = $(this).find("[name=ProType]").prop("checked");
      $(this).find("[name=ProType]").prop("checked", !check);
      if (!check) {//选中
        $("[for-group=pcb],.pcb-con").show();
        Pcb.Init();
      } else {
        $(".pcb-con,.pcbonline-results [for-group=pcb]").hide();
      }
      CalShip();
    });
    $("[name=ProType][value=4]").parents("h3").on("click", function () {
      $(".stencil").insertBefore(".pcba");
      var check = $(this).find("[name=ProType]").prop("checked");
      $(this).find("[name=ProType]").prop("checked", !check);
      $(".pcba-con").hide();
      $(".pcbonline-results [for-group=pcba]").hide();
      if (!check) {//选中
        $("[for-group=stencil],.stencil-con").show();
        Stencil.Init();
      } else {
        $(".stencil-con,.pcbonline-results [for-group=stencil]").hide();
      }
      
      CalShip();
    });
    $("[name=ProType][value=5]").parents("h3").on("click", function () {
      $(".pcba").insertBefore(".stencil");
      var check = $(this).find("[name=ProType]").prop("checked");
      $(this).find("[name=ProType]").prop("checked", !check);
      $(".stencil-con").hide();
      $(".pcbonline-results [for-group=stencil]").hide();
      if (!check) {//选中
        $("[for-group=pcba],.pcba-con").show();
        Smt.Init();
      } else {
        $(".pcba-con,.pcbonline-results [for-group=pcba]").hide();
        
      }
      CalShip();
    });
    
    
  },
  //示例图片
  ExampleDiagram: function () {
    $(".example-diagram").hover(function () {
      $(this).find(".example-diagram-con").show();
    }, function () {
      $(".example-diagram-con").hide();
    });
  },
  //验证输入的数字是否合法
  ValidNumberHight: function (e, num) {
    //长宽限制650以内
    if ($("#hidLength").val() > 650) {
      $("#hidWidth").val("650");
      layer.alert('The maximum is 650', {closeBtn: 0}, function () {
        $("#hidLength").val("650");
        if ($("#hidWidth").val() > 650) {
          $("#hidWidth").val("650");
        }
        layer.closeAll();
        
      });
    } else if ($("#hidLength").val() == "" || $("#hidLength").val() == null) {
      layer.msg('pls input height', {time: 2000});
      $(".FinalOrderMoney").text("0");
      $(".bpordermoney").text("0");
      $(".ypordermoney").text("0");
      $(".DeliveryDaysStr").text("0");
      $(".DiscountPrice").text("0");
      $(".FinalOrderMoney").text("0");
      $(".Num").text("0");
    } else if ($("#hidLength").val() < 1) {
      $("#hidLength").val("1");
      
    }
    
  },
  ValidNumberWidth: function (e, num) {
    
    if ($("#hidWidth").val() > 650) {
      layer.alert('The maximum is 650', {closeBtn: 0}, function () {
        $("#hidWidth").val("650");
        if ($("#hidLength").val() > 650) {
          $("#hidLength").val("650");
        }
        layer.closeAll();
      });
    } else if ($("#hidWidth").val() == "" || $("#hidWidth").val() == null) {
      layer.msg('pls input width', {time: 2000});
      $(".FinalOrderMoney").text("0");
      $(".bpordermoney").text("0");
      $(".ypordermoney").text("0");
      $(".DeliveryDaysStr").text("0");
      $(".DiscountPrice").text("0");
      $(".FinalOrderMoney").text("0");
      $(".Num").text("0");
    } else if ($("#hidWidth").val() < 1) {
      $("#hidWidth").val("1");
      
    }
    //$("#hidWidth").val(parseInt($("#hidWidth").val()))
    
  },
  SetPriceDetailToZero: function () {
    $(".FinalOrderMoney").text("0");
    $(".bpordermoney").text("0");
    $(".ypordermoney").text("0");
    $(".DeliveryDaysStr").text("0");
    $(".DiscountPrice").text("0");
    $(".FinalOrderMoney").text("0");
    $(".Num").text("0");
  },
  //选中样式处理
  Checked: function (name, value) {
    $("[name='" + name + "']").parents("li").siblings().find(".item").removeClass("choose").find("i").remove();
    $("[name='" + name + "']").parents("li").siblings().find("input").prop("checked", false);
    $("[name='" + name + "'][value='" + value + "']").parents(".item").addClass("choose");
    $("[name='" + name + "'][value='" + value + "']").before("<i class='jp-ico subscript-ico'></i>");
    $("[name='" + name + "'][value='" + value + "']").prop("checked", true);
    $("[name='" + name + "'][value='" + value + "']").parents("li").show();
    $("[name='" + name + "'][value='" + value + "']").parents("li").find(".item").removeClass(" not-selectable");
  },
  
  ///计价页的li显示隐藏:0,1显示隐藏，2，3去除点击事件和添加点击事件,4隐藏某name下的所有li
  QutoliEv: function (dom, type) {
    if (type == 0) {
      $(dom).parents("li").show();
    } else if (type == 1) {
      $(dom).parents("li").hide();
      $(dom).parents("li").find(".item").removeClass("choose").find(".subscript-ico").remove();
    } else if (type == 2) {//不可点击
      //  $("[name='radFontColor'][value='Green']")
      //$(dom).parents("li").find(".item").addClass("not-selectable").removeAttr("click");
      
    } else if (type == 3) {//添加点击事件
      $(dom).parents("li").find(".item").attr("click", Pcb.OptionsItemClick()).removeClass("not-selectable");
      //$(dom).parents("li").find(".item").attr("click", Pcb.OptionsItemClick()).removeClass("choose not-selectable").find("i").remove();;
    } else if (type == 4) {//隐藏某name下的所有li
      $(dom).parents("li").find(".item").removeClass("choose").find(".subscript-ico").remove();//移除所有的选中标签
      $(dom).parents("li").hide();//隐藏li
      //如：       $("[name=FR4Type]").parents("li").find(".item").removeClass("choose").find(".subscript-ico").remove();
      //$("[name=FR4Type]").parents("li").hide();
    }
  },
  
  AutoStepDatetime: function (datetime) {
    var ldatetime = new Date();
    var sep = ldatetime.setMilliseconds(1) - new Date(datetime).setMilliseconds(1);
   
    
  },
  //飞入购物车
  RegisterFlyer: function (event, callback) {
    event = window.event || event || e;
    var offset = $("#endTocar").offset();
    
    var pathnameUrl = window.location.pathname;
    
    var flyer = null;
    if (pathnameUrl == "/online_pcb_quote" || pathnameUrl == "/online_pcb_quote.html") {
      flyer = $('<img class="cart-flyer" src="/img/img/pcbonline/producelogo/prologo1.png">');
    } else if (pathnameUrl == "/pcba_quote" || pathnameUrl == "/pcba_quote.html") {
      flyer = $('<img class="cart-flyer" src="/img/img/pcbonline/producelogo/prologo2.png">');
    } else {
      flyer = $('<img class="cart-flyer" src="/img/img/pcbonline/producelogo/prologo2.png">');
    }
    var endtop = parseFloat($(".sidebar-tab-car").css("margin-top").replace("px", "")) + 100;
    flyer.fly({
      start: {
        left: $('#btnAddCart').offset().left + 100,
        top: $('#btnAddCart').offset().top - $(window).scrollTop()
      },
      end: {
        left: $(window).width(),
        top: 300,
        width: 0,
        height: 0
      },
      onEnd: function () {
        var cartflyerLength = $(".cart-flyer").length;
        if (cartflyerLength > 1) {
          $(".cart-flyer").remove();
        }
      }
    });
    
    if (callback != undefined && callback != null) {
      callback();
    }
  },
  ///加入购物车弹窗提示
  ShowDilogAddCartSuccess: function (success) {
    layer.closeAll()
    var html = $(".btnAddCart1").html();
    if (success) {
      html = html.replace("cg", "cg").replace("{1}", "Add to cart successfully!");
      var num = parseInt($(".cartnum").text()) + 1;
      setTimeout(function () {
        $(".cartnum").text(num);
        $(".shoppingnum").text(num);
      }, 0)
      
    } else {
      $(".btnAddCart1 .btnmsg").html("Success fail");
      html = html.replace("cg", "sb").replace("{1}", "submit fail");
      
    }
    var url = "/cart";
    if (JumpUrl.length > 0)
      url = JumpUrl;
    html = html.replace("{jumpurl}", url);
    setTimeout(function () {
      $(".btnAddCart1").html(html);
      layer.open({
        type: 1,
        title: " ",
        area: ['480px', '250px'], //宽高
        content: $(".btnAddCart1")
        
      });
    }, 500)
    
  },
  
}