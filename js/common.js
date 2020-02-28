
$(function () {
    var CurrentemuIndex = 0;
    LP.Init();
    Head.Init();
    RegisterTips();
    App.Init();
});



var LP = {
    Init: function () {
        LP.AllChecked();
        LP.WebStat();
        LP.InitLayuiDate();
    },
    OnLoadData: $.Callbacks(),
    //全选/反选
    AllChecked: function (name) {
        if ($("[name=chk_all]").length > 0) {
            $("[name=chk_all]").on("click", function () {
                $("[name=chk_list]").prop("checked", $(this).prop("checked"));
            });
        }
    },
    ///页面统计
    WebStat: function () {
    

    },
    InitLayuiDate: function () {
        //layui-laydate---   1：【年月日】选择器   2：【年月日时分秒】选择器  3：【时分秒】选择器  4：【年月】选择器
        var getLen = $("[layui-laydate]").length;
        if (getLen > 0) {
            $("[layui-laydate]").each(function (i, dom) {
                if ($(this).attr('layui-laydate') == "1") {
                    laydate.render({
                        elem: this
                    });
                }
                else if ($(this).attr('layui-laydate') == "2") {
                    laydate.render({
                        elem: this,
                        type: 'datetime'
                    });
                }
                else if ($(this).attr('layui-laydate') == "3") {
                    laydate.render({
                        elem: this,
                        type: 'time'
                    });
                }
                else if ($(this).attr('layui-laydate') == "4") {
                    laydate.render({
                        elem: this,
                        type: 'month'
                    });
                }
            });
        }
    },
    AjaxPage: function () {
    
    },
    //Layui弹出窗口
    LayerShow: function (htmlid, w, h) {
        layer.open({
            time: 0,
            type: 1,
            title: ['message', 'font-size:18px;'],
            closeBtn: 1,
            area: [w + 'px', h + 'px'],
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            offset: 'auto',
            content: $("#" + htmlid),
            end: function () {
                layer.closeAll();
            },
            success: function (layero, index) {
            }
        });
    },
    LayerShowHaveTitle: function (htmlid, w, h, titles) {
        layer.open({
            type: 1,
            title: [titles, 'font-size:18px;'],
            closeBtn: 1,
            area: [w + 'px', h + 'px'],
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            offset: 'auto',
            content: $("#" + htmlid),
            end: function () {
                layer.closeAll();
            },
            success: function (layero, index) {
            }
        });
    },
    LayerUrlShow: function (Url, w, h, messageInfo) {
        messageInfo = (messageInfo == "" || messageInfo == null) ? "message" : messageInfo;
        //自定页
        var index = layer.open({
            type: 2,
            title: [messageInfo, 'font-size:18px;'],
            closeBtn: 1,
            area: [w + 'px', h + 'px'],
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            offset: 'auto',
            content: Url,
            end: function () {
                layer.closeAll();
            },
            success: function (layero, index) {
            }
        });
        return index;
    },
    Search: function (page) {
        if (page == undefined || page < 1) {
            page = 1;
        }
        var parm = $("#srarchForm").serialize() + "&page=" + page;
        var action = $("#srarchForm").attr("action");
        if (action == undefined || action == null || action == "") {
            action = window.location.pathname;//+ "?" + parm;
        }
        $.ajax({
            url: action,
            data: parm,
            type: 'get',
            dataType: 'html',
            beforeSend: function () {
                $("#listtable").html("");
                layer.msg('loading......', { icon: 16, shade: 0.21 });

            },
            success: function (data) {
                layer.closeAll();
                //if (data.indexOf('系统错误') > -1) {
                //    return;
                //}
                $("#listtable").html(data);
                //  Power.GlobalOperationButtonRegister();
                LP.AjaxPage();
                LP.AllChecked();
                LP.OnLoadData.fire();
                // LP.ShowHisotryEmail();
            }
        });
    },
    //重置
    FormReset: function () {
        document.getElementById("srarchForm").reset();//重置表单作用域
        var parm = $("#srarchForm").serialize();
        var action = $("#srarchForm").attr("action");
        if (action == undefined || action == null || action == "") {
            action = window.location.pathname;// + "?" + parm;
        }
        $.ajax({
            url: action,
            data: parm,
            dataType: 'html',
            beforeSend: function () {
                layer.msg('loading......', { icon: 16, shade: 0.21 });
            },
            success: function (data) {
                layer.closeAll();
                $("#listtable").html(data);
                // Power.GlobalOperationButtonRegister();
                LP.AllChecked();
            }
        });
    },

}
var flag = true;
jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    if (!flag) {
        return;
    }
    flag = false;
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({ position: 'relative' });
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
            .animate({ left: intDistance }, ((intDuration / intShakes) / 2))
            .animate({ left: 0 }, (((intDuration / intShakes) / 4)));
            if (x = intShakes) {
                flag = true;
            }
        }
    });
    return this;
}
///工具类
var Tools = {

    //获取时区
    GetTimeZone: function () {
        var now = new Date();
        var start = new Date();
        //得到一年的开始时间
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);

        var minZone = start.getTimezoneOffset();
        for (var i = 0; i <= 11; i++) {
            var temp = new Date(start.getTime());
            temp.setMonth(i);

            if (minZone < temp.getTimezoneOffset()) {
                minZone = temp.getTimezoneOffset();
            }
        }

        return (minZone / 60) * -1;
    },
    //图片缩放
    DrawImage: function (ImgD, FitWidth, FitHeight) {
        var image = new Image();
        image.src = ImgD.src;
        if (ImgD != undefined && ImgD != null && ImgD.src.length > 0) {
            if (image.width > 0 && image.height > 0) {
                if (image.width / image.height >= FitWidth / FitHeight) {
                    if (image.width > FitWidth) {
                        ImgD.width = FitWidth;
                        ImgD.height = (image.height * FitWidth) / image.width;
                    } else {
                        ImgD.width = image.width;
                        ImgD.height = image.height;
                    }
                } else {
                    if (image.height > FitHeight) {
                        ImgD.height = FitHeight;
                        ImgD.width = (image.width * FitHeight) / image.height;
                    } else {
                        ImgD.width = image.width;
                        ImgD.height = image.height;
                    }
                }
            }
        }
    },

    //单个滚动
    moveH: function (id, type, isstop) {
        //多行应用@Mr.Think
        var _wrap = $("#" + id + ""); //定义滚动区域
        var _interval = 3000; //定义滚动间隙时间
        var _moving; //需要清除的动画
        if (isstop == 0) {
            _wrap.hover(function () {
                clearInterval(_moving); //当鼠标在滚动区域中时,停止滚动
            },
                function () {
                    _moving = setInterval(function () {
                        var _field = _wrap.find('dd:first'); //此变量不可放置于函数起始处,dd:first取值是变化的
                        var _hw;
                        var marginTop;
                        if (type == "h") {
                            _hw = _field.height();
                            if (id == 'share_itemList') {
                                _hw = _field.height() + 40;
                            }
                            marginTop = _hw;
                        }
                        _field.animate({
                            marginTop: -marginTop + 'px'
                        },
                            600,
                            function () { //通过取负margin值,隐藏第一行
                                _field.css('marginTop', 0).appendTo(_wrap); //隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
                            })
                    },
                        _interval) //滚动间隔时间取决于_interval
                }).trigger('mouseleave'); //函数载入时,模拟执行mouseleave,即自动滚动
        } else {
            _moving = setInterval(function () {
                var _field = _wrap.find('dd:first'); //此变量不可放置于函数起始处,dd:first取值是变化的
                var _hw;
                var marginTop;
                if (type == "h") {
                    _hw = _field.height();
                    if (id == 'share_itemList') {
                        _hw = _field.height() + 40;
                    }
                    marginTop = _hw;
                }
                _field.animate({
                    marginTop: -marginTop + 'px'
                },
                    2600,
                    function () { //通过取负margin值,隐藏第一行
                        _field.css('marginTop', 0).appendTo(_wrap); //隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
                    })
            },
                _interval)
        }
    },


    isEmail: function (str) {
        var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        if (myReg.test(str)) return true;
        return false;
    },
    ////设置*
    Setxin: function (str, cnt) {

        var len = str.length;
        var resut = str;
        resut = str.substring(0, 2);
        for (var i = 0; i < cnt; i++) {
            resut += "*";

        }
        resut += str.substring(len - 3, len - 1);

        return resut;
    },
    //HandleOrderDate格式化日期：
    FormatDate: function (dt, isshowtime, format) {
        if (format == undefined || format == null || format == "") {
            format = "-";
        }
        if (isshowtime == undefined || isshowtime == null || isshowtime == "") {
            isshowtime = false;
        }
        var orderdate = new Date(dt);
        var currdate = new Date();
        if (orderdate.toLocaleDateString() == currdate.toLocaleDateString()) {
            return orderdate.getHours() + ":" + orderdate.getMinutes() + ":" + orderdate.getSeconds();
        } else {
            var dt = orderdate.getFullYear() + format + orderdate.getMonth() + format + orderdate.getDay();
            if (isshowtime) {
                dt += + " " + orderdate.getHours() + ":" + orderdate.getMinutes() + ":" + orderdate.getSeconds();
            }
            return dt;
        }

    },

    //json转url参数
    JsonToUrlParams: function (data) {
        try {
            var tempArr = [];
            for (var i in data) {
                var key = encodeURIComponent(i);
                var value = encodeURIComponent(data[i]);
                tempArr.push(key + '=' + value);
            }
            var urlParamsStr = tempArr.join('&');
            return urlParamsStr;
        } catch (err) {
            return '';
        }
    },
    ///URL参数转JSON
    UrlToJsonParams: function (url) {
        try {
            var index = url.indexOf('?');
            if (index > -1) {
                url = url.match(/\?([^#]+)/)[1];
            }
            var obj = {}, arr = url.split('&');
            for (var i = 0; i < arr.length; i++) {
                var subArr = arr[i].split('=');
                var key = decodeURIComponent(subArr[0]);
                var value = decodeURIComponent(subArr[1]);
                obj[key] = value;
            }
            return obj;

        } catch (err) {
            return null;
        }
    },

    ///图片错误的时候
    ImgError: function (e,src) {
        setTimeout(function () {
            var img = $(e);
            if (src != undefined && src != null && src != "")
                 img.src = src;
            else
                img.src = img.src;
        }, 3000);
    }
}

//头部JS

var Head = {

    Init: function () {
        Head.InitMenu();
        Head.ResizeWindow();
        Head.DropDownNav();
        Head.Noticecookie();
        var st = new Date();



        var navoff = true;

    },

    //下拉导航
    DropDownNav: function () {
        $(".dropDownNav").hover(function () {
            $(this).find(".secondNav").show();
            $(this).parents("li").siblings("li#magic-line").hover(function () {
                $(".secondNav").show();
            })
        }, function () {
            $(".secondNav").hide();
        });
    },
    RegisterEvent: function () {
        $(".menu-toggle").on("click", function () {
            if (navoff) {
                $(".menutop").show();
                navoff = false
            } else {
                $(".menutop").hide();
                navoff = true
            }

        });
        $('.header-car').hover(function () {
            $('.item-car').show();
            $('.header .header-car a').css('border-bottom', '0');
        }, function () {
            $('.item-car').hide();
            $('.header .header-car a').css('border-bottom', '1px solid #ddd');
        });
        //my allpcb
        $('.t_user,.t_user_box').mouseover(function () {
            $(this).addClass('on');
            $('.t_user i').css('background-position', '-22px -294px');
            $('.t_user_box').show();
        }).mouseout(function () {
            $(this).removeClass('on');
            $('.t_user i').css('background-position', '-11px -294px');
            $('.t_user_box').hide();
        });
        $('.t_box_tit a').hover(function () {
            $(this).addClass('on').siblings('a').removeClass('on');
        });
        //留言弹出框
        $('.btn-message').click(function () {
            $('.maskLayer,.b-box').show();
        });
        $('.btn-cancle').click(function () {
            $('.maskLayer,.b-box').hide();
        });
        ///?提示信息显示
        $(".Explanation").mouseover(function () {
            $(this).parent().find(".explanationDetails").show();
        }).mouseout(function () {
            $(this).parent().find(".explanationDetails").hide();
        });


    },
    ResizeWindow: function () {
        //显示二级导航
        var timer = null;
        $(".twokhover").hover(function () {
            clearTimeout(timer)
            $(".con-menu").hide()
            $(this).find(".con-menu").show()
        }, function () {
            timer = setTimeout(function () {
                $(".con-menu").hide()
            }, 100)

        })


        if ($(".one-menu>li").length > 0) {

            //header导航条滑块
            $(".one-menu>li").removeClass("current_page_item").eq(CurrentemuIndex).addClass("current_page_item");
            /* Add Magic Line markup via JavaScript, because it ain't gonna work without */
            $("#one-menu").append("<li id='magic-line'></li>");
            // 导航条滑块  _start
            var $el, leftPos, newWidth;
            var $magicLine = $("#magic-line");
            var pos1 = $(".current_page_item .mainNav").position();
            $magicLine
                .width($(".current_page_item").width())
                .css("left", pos1 ? pos1.left : 0)
                .data("origLeft", pos1 ? pos1.left : 0)
                .data("origWidth", $magicLine.width());
            $("#one-menu li").find(".mainNav").hover(function () {
                $el = $(this);
                leftPos = $el.position().left;
                newWidth = $el.parent().width();
                $magicLine.stop().animate({
                    left: leftPos,
                    width: newWidth
                }, 500);
            }, function () {
                $magicLine.stop().animate({
                    left: $magicLine.data("origLeft"),
                    width: $magicLine.data("origWidth")
                }, 200);
            });


        }

    },
    //初始化菜单
    InitMenu: function () {
        var url = window.location.href;
        if (url.toLowerCase().indexOf("online_pcb_quote") > -1) {
            Head.SetMenuActive(1);
        } else if (url.toLowerCase().indexOf("pcba_quote") > -1) {
            Head.SetMenuActive(1);
        } else if (url.toLowerCase().indexOf("smt_stencil_quote") > -1) {
            Head.SetMenuActive(1);
        } else if (url.toLowerCase().indexOf("salesteam") > -1) {
            Head.SetMenuActive(1);
        } else if (url.toLowerCase().indexOf("sponsor") > -1) {
            Head.SetMenuActive(5);
        } else if (url.toLowerCase().indexOf("pcba") > -1) {
            Head.SetMenuActive(2);
        } else if (url.toLowerCase().indexOf("capability") > -1) {
            Head.SetMenuActive(3);
        } else if (url.toLowerCase().indexOf("feedback") > -1) {
            Head.SetMenuActive(4);
        } else if (url.toLowerCase().indexOf("about_us") > -1) {
            Head.SetMenuActive(6);
        } else if (url.toLowerCase().indexOf("why_us") > -1) {
            Head.SetMenuActive(6);
        } else if (url.toLowerCase().indexOf("contact_us") > -1) {
            Head.SetMenuActive(6);
        } else if (url.toLowerCase().indexOf("news") > -1) {
            Head.SetMenuActive(6);
        } else {
            Head.SetMenuActive(0);
        }

        var timer1 = null;
        $(".account").hover(function () {
            $(".accountshowhide").show()
        }, function () {
            timer1 = setTimeout(function () {
                $(".accountshowhide").hide()
            }, 300)
        })
        $(".accountshowhide").hover(function () {
            $(".accountshowhide").show();
            clearTimeout(timer1)
        }, function () {
            $(".accountshowhide").hide()
        })

        //$(document).scroll(function () {
        //    var scroH = $(document).scrollTop();  //滚动高度
        //    var viewH = $(window).height();  //可见高度 
        //    var contentH = $(document).height();  //内容高度

        //    if (scroH > 800) {  //距离顶部大于100px时
        //        $("#gotop-btn").show()
        //    } else {
        //        $("#gotop-btn").hide()
        //    }

        //})

        $("#gotop-btn").on("click", function () {
            $("body,html").animate({ scrollTop: 0 }, 500)
        })
        $(".overnotic").on("click", function () {
            $(".notic").animate({ height: "0px" });
            setTimeout(function () { $(".notic").hide(); }, 1000)
        })

        $(".two-menu").hover(function () {
            $(this).parents("li").find('a').eq("0").css({ "color": "#f90" })
        }, function () {
            $(this).parents("li").find('a').eq("0").css({ "color": "#fff" })
        })

        $(".two-menu li").hover(function () {
            $(this).find(".three-menu").show();
        }, function () {
            $(this).find(".three-menu").hide();
        })


        $(".minone-meun li").unbind('click').click(function (event) {
            if ($(this).is(".acitve1")) {
                $(this).removeClass("acitve1").css({ "color": "#c9c9c9" })
                $(this).find(".mintwo-menu").eq(0).hide();
                $(this).find("img").eq(0).removeClass("rotate12").addClass("rotate11")
            } else {
                $(this).addClass("acitve1").css({ "color": "#f90" })
                $(this).find(".mintwo-menu").eq(0).show();
                $(this).find("img").eq(0).removeClass("rotate11").addClass("rotate12")
            }
            event.stopPropagation(); //  阻止事件冒泡
        })

        $(".mintwo-menu li").on("click", function (event) {
            event.stopPropagation(); //  阻止事件冒泡
            if ($(this).is(".acitve2")) {
                $(this).removeClass("acitve2").css({ "color": "#c9c9c9" })
                $(this).find(".minthree-menu").hide();
                $(this).find("img").removeClass("rotate12").addClass("rotate11")
            } else {
                $(this).addClass("acitve2").css({ "color": "#f90" })
                $(this).find(".minthree-menu").show();
                $(this).find("img").removeClass("rotate11").addClass("rotate12")
            }

        })

        $(".meunswitch").unbind('click').click(function () {
            event.stopPropagation();
            if ($(".min-menu").is(".undis")) {
                $(".min-menu").removeClass("undis")
            } else {
                $(".min-menu").addClass("undis")
            }
            return false;
        })

        $(".one-menu>.twokhover").hover(function () {
            $(this).find(".onejiantou").eq(0).attr("src", "/img/img/index/hoveronejian.png")
        }, function () {
            $(this).find(".onejiantou").eq(0).attr("src", "/img/img/index/onejian.png")
        })

        $(".top-nav .t_user").hover(function () {
            $(".top-nav .t_user_box").show();
        }, function () {
            $(".top-nav .t_user_box").hide();
        })
        $('.suggestions').click(function () {
            $('.maskLayer,.b-box').show();
        });
        $('.btn-cancle').click(function () {
            $('.maskLayer,.b-box').hide();
        });
        $('.b-box').click(function () {
            $(".box-con").shake(4, 5, 200);//次数 距离 时间
        })

        $('.maskLayer').click(function () {
            $(".box-con").shake(4, 5, 200);//次数 距离 时间
        })
        $('.box-con').click(function () {
            event.stopPropagation()
        })

        //底部
        var leftnum = $(window).width();
        if (leftnum < 750) {
            footbtn();
        }
        $(window).resize(function () {
            leftnum = $(window).width();
            if (leftnum < 750) {
                footbtn();
            } else {
                $(".bottom-navigation dt").unbind();
                $(".bottom-navigation dt").siblings("dd").show().find("a").css({ "fontSize": "16px" });
                $(".bottom-navigation dt").find("span").css({ "color": "#fff" });
            }
        })

    },


    ///选中菜单
    SetMenuActive: function (i) {
        CurrentemuIndex = i;
        if ($("#one-menu .mainNav").length > 0) {
            var mnuLeft = $("#one-menu .mainNav").eq(i).parent("li").position().left;
            mnuLeft += 15
            var mnuWidth = $("#one-menu .mainNav").eq(i).parent("li").width();
            $("#magic-line").css({ 'left': mnuLeft, "width": mnuWidth });
        }
    },
    //公告cookie
    Noticecookie: function () {
        if ($(".overnotic").length > 0 && $.cookie != undefined) {
            $(".overnotic").on("click", function () {
              
                $(".notic").animate({ height: "0px" });
                setTimeout(function () { $(".notic").hide(); }, 1000)
            })
            if ($.cookie("isClose") !== "yes") {
                $(".notic").show();
                $(".overnotic").on("click", function () {
                    $.cookie('isClose', 'yes', { expires: 1 / 24 });
                })
            } else {
                $(".notic").hide();
            }
            //$.cookie('isClose', null);清除cookie
        }
    },

    AddMessage: function () {
        var name = $("#name1").val();
        var email = $("#email1").val();
        var tel = $("#tel1").val();
        var message = $("#message1").val();
        if (name == "") {
            layer.msg("Please enter you name");
            $("#name1").focus();
            return false;
        }
        if (email == "") {
            layer.msg("Please enter you email");
            $("#email1").focus();
            return false;
        }
        else {
            if (!Tools.isEmail(email)) {
                layer.msg("Please enter you email");
                $("#email1").focus();
                return false;
            }
        }
        if (message == "") {
            alert("Please enter message", function () {
                $("#message").focus();
            });

            return false;
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            async: true,
            url: '/NewMember/AddMesg',
            data: { name: name, email: email, tel: tel, message: message },
            contentType: "application/x-www-form-urlencoded; charset=utf-8", //解决中文提交乱码问题
            success: function (data) {
                if (data) {
                    layer.msg("Submit successfully,We will solve it as soon as possible!", function () {
                        $('.maskLayer,.b-box').hide();
                    });

                }
            }
        });
    }



}


var App = {
    Init: function () {
        //小屏选泽数量
        $(".minul li").on("click", function () {
            $(".minul li").removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $(".countuls").hide().eq(index).show();
        })

        $("#pcbnumbtn").on("click", function () {
            //iframe层
            layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['320px', '540px'], //宽高
                content: $('#minpcbnun')
            });
        })


        $("#minpcbnun li input").on("click", function () {
            var text = $('input[name="countNumer"]:checked').val();
            $("#pcbnumbtn").val(text)
            layer.closeAll();
        })
    },
    IninWindows: function () {
        if ($(screen).width() <= 768) {
            $(".mobile").show();

        }


    }



}


function footbtn() {
    $(".bottom-navigation dt").unbind('click').click(function (event) {
        if ($(this).is(".acitve1")) {
            $(this).removeClass("acitve1").find("span").css({ "color": "#fff" })
            $(this).siblings("dd").hide();
            $(this).find("img").eq(0).removeClass("rotate12").addClass("rotate11")
        } else {
            $(this).addClass("acitve1").find("span").css({ "color": "#f90" })
            $(this).siblings("dd").show().find("a").css({ "fontSize": "16px" });
            $(this).find("img").eq(0).removeClass("rotate11").addClass("rotate12")
        }
        event.stopPropagation(); //  阻止事件冒泡
    })
}


function SetMenuActive(i) {
    CurrentemuIndex = i;
    if ($("#one-menu .mainNav").length > 0) {

        var mnuLeft = $("#one-menu .mainNav").eq(i).parent("li").position().left;
        mnuLeft += 15
        var mnuWidth = $("#one-menu .mainNav").eq(i).parent("li").width();
        console.log(mnuLeft)
        console.log(mnuWidth)
        $("#magic-line").css({ 'left': mnuLeft, "width": mnuWidth });
    }
}


//图标文字提示   
function RegisterTips() {
    $("[item-tips]").each(function (i, dom) {
        $(dom).on("mouseover", function () {
            var id = $(dom).attr("id");
            if (id == undefined || id == null || id == "") {
                id = "tips" + i;
                $(dom).attr("id", id);
            }
            var tips = $(dom).attr("item-tips");
            $(this).find("[tipshtml]").html(tips);
            $(this).find("[tipshtml]").show();
        });
        $(dom).on("mouseout", function () {
            $("[tipshtml]").html();
            $("[tipshtml]").hide();
        });

    });
}