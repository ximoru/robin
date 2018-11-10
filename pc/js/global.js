/*全站*/

$(function(){
    global.sliderEvent();
    global.sliderButtonEvent();
    global.init()

 // 菜单下拉
    $(".header-nav-main li").hover(function(){
     $(this).find(".classification").slideToggle();    
    },function(){
         $(this).find(".classification").slideToggle();    
    });
});


// 产品动画
var $box= $('.product').find('li');

window.onscroll = function() {
  setEvent();
};
function setEvent(){
  $box.each(function(index,item){
      var obj = $(this);
    if(($(window).scrollTop()) + 800 > obj.offset().top){
        obj.addClass('active');    
    }
    if(obj.offset().top > ($(window).height() + $(window).scrollTop() - 400)){
     $(".animated").css("display","none");      
     obj.removeClass('active');
    }
  });
  
};

// 首页货币兑滚动
var autoInterval;
function ranking(obj){
    var $li = obj.find('li'), self = this, distance = $li.height();
    if(obj.length && $li.length < 7) return;
    obj.css({height:distance*7}).find('ul').css({'position':'relative','left':0,'right':0});
    clearInterval(autoInterval);
    autoInterval = setInterval(function(){self.rankingScroll(obj);},3000);
}
function rankingScroll(obj){
    var $li = obj.find('li'),
        $ul = obj.find('ul'),
        autoTimeout,
        speed = 300,
        distance = $li.height();
    $ul.css({'marginTop':-distance}).addClass('transition');
    clearTimeout(autoTimeout);
    autoTimeout = setTimeout(function(){
        $ul.removeClass('transition').append($ul.find('li:first-child').clone()).css({'marginTop':0}).find('li:first-child').remove ();
    },speed);
}

var global = {};

global.init = function(){

    /*主菜单*/ 
    var $nav =  $('.header-nav-main li'),
        $current = $('.header-nav-main .current a'),
        $line = $('.header-nav-line');
        $line.removeClass('transition');
    if($current.length){
        global.headerNav($current);
    }
    $nav.hover(function(){
        $line.addClass('transition');
        global.headerNav($(this).find('a'));
    },function(){
        if($current.length){
            global.headerNav($current);
        }else{            
            $line.css({left:0,width:0});
        }
    });
    /*主菜单 end*/ 

    /*网站底部固定*/
    // if($('.full-screen').length){
    //   var bottom = $('.footer').outerHeight();
    //   $('.container').css({'padding-bottom':bottom});
    // };
    /*网站底部固定 end*/
};

/*主菜单下划线*/ 
global.headerNav = function(obj){
    var $line = $('.header-nav-line');
    $line.css({left:obj.position().left,width:obj.outerWidth()});
};

/*banner*/
global.sliderEvent = function(){
    var sliderAuto,
          time = 3000,
          speed = 800,
          $box = $('#slider-box'),
          $ban = $('#slider-banner li'),
          $dot = $('#slider-dot');
    clearInterval(sliderAuto);
    if($ban.length < 2) return;
    sliderAuto = setInterval(global.sliderScrollEvent,time);
    $dot.on('mouseover','li',function(){
        clearInterval(sliderAuto);
        $(this).addClass('current').siblings('li').removeClass('current');
        $ban.eq($(this).index()).stop(true,false).fadeIn(speed).siblings('li').stop(true,false).fadeOut(speed);
    });
    $box.on('mouseover',function(){
        clearInterval(sliderAuto);
    });
    $box.on('mouseleave',function(){
        clearInterval(sliderAuto);
        sliderAuto = setInterval(global.sliderScrollEvent,time);
    });
};
global.sliderScrollEvent = function(speed){
    var $ban = $('#slider-banner li'),
          $dot = $('#slider-dot'),
          cur = $dot.find('.current').index() + 1,
          speed = 800;
    if(cur >= $ban.length) cur = 0;
    $dot.find('li').eq(cur).addClass('current').siblings('li').removeClass('current');
    $ban.eq(cur).fadeIn(speed).siblings('li').fadeOut(speed);
};

/*左右点击滑动*/
global.sliderButtonEvent = function(){
    $('.slider-button').each(function(){
        var $slider = $(this),
            $btnl = $slider.find('.btn-lef'),
            $btnr = $slider.find('.btn-rig'),
            $list = $slider.find('.list'),
            $con = $list.find('ul'),
            $item = $con.find('li'),
            len = $item.length,
            width = $list.width(),
            marginl = len ? $item.css('marginLeft') : '0px',
            marginr = len ? $item.css('marginRight') : '0px',
            margin = marginl.substr(0,marginl.length-2)*1 + marginr.substr(0,marginr.length-2)*1,
            num = $slider.width()/($item.outerWidth() + margin);
      if(!len || len <= parseInt(num)){
        $btnl.hide();
        $btnr.hide();
        return;
      }else{
        $btnl.show();
        $btnr.show();
      }
      $(this).removeClass('slider-button');
      $btnr.on('click',function(){
        var left = $con.position().left;
        if($con.width() + left >= 2*width){
          left = left-width;        
        }else if($con.width() + left < 2*width && $con.width() + left > width){
          left = -$con.width() + width;
        }else if(-left == $con.width() - width){
          left = 0;        
        }
        $con.css({left:left});
      });
      $btnl.on('click',function(){
        var left = $con.position().left;
        if(-left >= width) {
          left = left+width;
        }else if(-left > 0 && -left < width){
          left = 0;
        }else if(left == 0){
          left = -$con.width() + width;
        }
        $con.css({left:left});
      });
    });
};

/*图片延迟加载*/
global.lazyload = function(range){
    if(typeof range != "object") range = $('body');
    function lazyload() {
        this.config = {'attrName': 'data-src','nodeName': 'img'};
        this.lazyloader = function() {
            var a = $('img['+this.config.attrName+']',range), len = a.length, node = null;
            if (len == 0) {
                $(window).off('scroll resize touchmove',$.proxy(this.lazyloader,this));
                return;
            }
            var height = $(window).scrollTop() + document.documentElement.clientHeight;
            for (var i = 0; i < len; ++i) {
                node = $(a[i]);
                var nodeTop = node.offset().top;
                if (height >= nodeTop) {
                    var src = node.attr(this.config.attrName);
                    node.attr({'src':src,'data-src':''});
                    node.removeAttr(this.config.attrName);
                }
            }
        };
        this.bindEvent = function() {$(window).on('scroll resize touchmove',$.proxy(this.lazyloader,this));}
    };
    var loader = new lazyload();
    loader.lazyloader();
    loader.bindEvent();
};


/*对话弹窗*/
(function($){
    global.btnClass = {0:'button-default',1:'button-white',99:'button-disabled'};
    var promptAuto,positionType = 'absolute';
    $.dialogbox = function(data, klass, callback, title){
        $.dialogbox.loading();
        $.dialogbox.reveal(data, klass, callback, title);
        $.dialogbox.callback=callback;
    };

    $.extend($.dialogbox,{
        settings:{
            opacity         : 0.3,
            overlay         : true,
            dialogboxHtml :'\
            <div id="dialogbox" class="dialogbox" style="display:none;">\
                <div class="dialogboxTitle">提示</div>\
                <div class="dialogboxBody"></div>\
                <div class="dialogboxClose"></div>\
            </div>'
        },
        msg:function(data){
            var tipsHtml=btnHtml = '';
            if(data.content){
                tipsHtml = '<div class="dialogTips">'+data.content+'</div>';
            }

            if(data.btn && data.btn instanceof Array){
                btnHtml ='<div class="dialogConfirm">';
                for (var lenBtn = 0; lenBtn < data.btn.length; lenBtn++) {
                    var btnName = data.btn[lenBtn];
                    var btnClcass = global.btnClass.hasOwnProperty(lenBtn)?global.btnClass[lenBtn]:'button-white';
                    if(data.color && data.color instanceof Array && data.color.length>=lenBtn){
                        var btnClassKey = data.color[lenBtn];
                        if(global.btnClass.hasOwnProperty(btnClassKey))
                            btnClcass = global.btnClass[btnClassKey];
                    }
                    btnHtml += '<a class="button '+btnClcass+'">'+btnName+'</a>';
                }
                btnHtml += '</div>';
            }

            if(!$(".dialogbox").length) $('body').append($.dialogbox.settings.dialogboxHtml);
            $(".dialogboxBody").html(tipsHtml + btnHtml);

            if(data.title){
                $('.dialogboxTitle').show().html(data.title);
            }else{
                $('.dialogboxTitle').hide();
            }
            if(data.klass) $('.dialogbox').addClass(data.klass);
            if(data.fixed) positionType = 'fixed';

            $('.dialogbox').on('click','.dialogConfirm a:not(".button-disabled")',function(){
                var aIndex = $(this).index();
                if(data.call && data.call instanceof Array && data.call.length>=aIndex){
                    var callBack = data.call[aIndex];
                    if(callBack instanceof Function)
                        $.dialogbox.callback = callBack;
                }
                $.dialogbox.close();
            });
            
            $(".dialogboxClose").on('click',function(){
                if(data.close && data.close instanceof Function)
                    $.dialogbox.callback = data.close;
                $.dialogbox.close();
            }) ;
            $.dialogbox.showOverlay(data);
            $.dialogbox.position($('.dialogbox'),positionType);
            $.dialogbox.move();
        },
        iframe:function(data){
            var width = data.width > 0 ? data.width : $(window).width() < 1200 ?    $(window).width() - 150 : 1100,
                        height = data.height > 0 ? data.height : $(window).height() - 250,
                        iframeHtml = '<div>'+(data.warnMsg?data.warnMsg:"")+'</div><iframe width="'+width+'" height="'+height+'" src="'+data.url+'" frameborder="no" id="dialogIframe"></iframe>';

            if(!$(".dialogbox").length) $('body').append($.dialogbox.settings.dialogboxHtml);
                $(".dialogboxBody").html(iframeHtml);
            if(data.title){
                $('.dialogboxTitle').html(data.title);
            }
            if(data.klass) $(".dialogbox").addClass(data.klass);
            $(".dialogboxClose").on('click',function(){
                if(data.callback) data.callback();
                $.dialogbox.close();
            }) ;
            $.dialogbox.showOverlay(data);
            $.dialogbox.position($('.dialogbox'),positionType);
            $.dialogbox.move();
        },
        /*子页面调用*/
        parentMsg:function(data){
            $.dialogbox.close();
            $.dialogbox.msg({
                content:data ? data.content : '',
                icon:data.icon,
                btn:['确定'],
                call:[function(){
                    location.reload();
                }]
            });
        },
        /*子页面重设高度*/
        parentHeight:function(height){
            if(height) $('#dialogIframe').attr('height',height);
            $.dialogbox.position($('.dialogbox'),positionType);
        },
        prompt:function(data){
            var content = data ? data.content ? data.content : '' : '',
                time = data ? data.time ? data.time : 2000 : '';
            $(".dialogPrompt").remove();
            $('body').append('<div class="dialogPrompt">'+content+'</div>');
            $('.dialogPrompt').css({marginLeft:($(window).width()    - $('.dialogPrompt').outerWidth())/2}).addClass('dialogPromptIn');
            if(time){
                clearTimeout(promptAuto);
                promptAuto = setTimeout(function(){
                    $('.dialogPrompt').removeClass('dialogPromptIn');
                    setTimeout(function(){
                        $('.dialogPrompt').remove();
                    },500);
                },time);
            }
        },
        /*初始化*/
        init:function(settings){
            $(".dialogbox").remove();
            $('body').append($.dialogbox.settings.dialogboxHtml);
            $('.dialogboxClose').on('click',function(){
                    $.dialogbox.close();
            });
        },
        loading:function(data){
            $.dialogbox.init();
            $.dialogbox.position($('.dialogbox'),positionType);
            $.dialogbox.showOverlay(data);
            $(".dialogboxBody").html('<div class="dialogLoading"></div>');
        },
        reveal:function(data,klass,callback,title){
            $(".dialogboxBody").html(data);
            if(data.title){
                $('.dialogboxTitle').show().html(data.title);
            }else{
                $('.dialogboxTitle').hide();
            }
            if(klass) $(".dialogbox").addClass(klass);
            $.dialogbox.position($('.dialogbox'),positionType);
            $.dialogbox.move();
        },
        close:function(){
                $(".dialogbox").remove();
                $.dialogbox.hideOverlay();
            if($.dialogbox.callback){
                $.dialogbox.callback();
                $.dialogbox.callback = null;
            }
        },    
        /*显示位置*/
        position:function(obj){
            var left = $(window).width() / 2 - ($(obj).outerWidth() / 2) + $(window).scrollLeft();
            var top = $(window).height() / 2 - ($(obj).outerHeight() / 2) + $(window).scrollTop();
            if(top < $(window).scrollTop())
                top= $(window).scrollTop() + 10;
            if(positionType == 'fixed'){
                    top = $(window).height() / 2 - ($(obj).outerHeight() / 2);
            }
            $(obj).css({left:left,top:top,position:positionType}).fadeIn();
            $(".dialogboxOverlay").css('width','').css({height:$(document).height(),width:$(document).width()});
        },
        /*显示遮罩*/
        showOverlay:function(data){
            var overlay = $.dialogbox.settings.opacity;
            if(!$(".dialogboxOverlay").length) $("body").append('<div class="dialogboxOverlay"></div>');
            if(data && data.overlayOpacity)    overlay = data.overlayOpacity;
            $(".dialogboxOverlay").css({'opacity':overlay,height:$(document).height(),width:$(document).width()});
        },        
        /*移除遮罩*/
        hideOverlay:function(){
            $(".dialogboxOverlay").remove();
        },
        /*拖动*/
        move:function(){
            var box = $('.dialogbox'),/*弹窗*/
                handle = $('.dialogboxTitle'),/*拖动对象*/
                isClick = false,/*左键是否按住*/
                defaultX,/*拖动前的x坐标*/
                defaultY,/*拖动前的y坐标*/
                mouseX,/*拖动后的x坐标*/
                mouseY,/*拖动后的y坐标*/
                divTop,/*弹窗拖动前的x坐标*/
                divLeft;/*弹窗拖动前的y坐标*/
            handle.mousedown(function(e){
                isClick = true;
                defaultX = e.pageX;
                defaultY = e.pageY;
                divTop = box.position().top;
                divLeft = box.position().left;
            });
            $(document).mousemove(function(e){
                    e.preventDefault();
                if(!isClick) return;
                mouseX = e.pageX;
                mouseY = e.pageY;
                var left = parseInt(mouseX-defaultX)+divLeft;
                var top = parseInt(mouseY-defaultY)+divTop;
                if(left < 0)/*防止拖动出左边*/
                    left = 0;
                if(top < 0)/*防止拖动出顶部*/
                    top = 0;
                if(left+box.outerWidth() > $(document).width())/*防止拖动出右边*/
                    left = $(document).width() - box.outerWidth();
                if(top+box.outerHeight() > $(document).height())/*防止拖动出底边*/
                    top = $(document).height() - box.outerHeight();
                if(isClick){/*确认鼠标按住*/
                    box.css({top:top,left:left});
                }
            });
            $(document).mouseup(function(e){
                isClick = false;
            });
        }
    });

    $(window).resize(function(){
        $.dialogbox.position($('.dialogbox'),positionType);
    });
    
})(jQuery);