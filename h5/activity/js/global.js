var wechatOpenId = $('input[name="wechatOpenId"]').val();
var initHeight = $(window).height();
var global = {};

/* 全站右下角菜单
 * 
 * 默认显示，不显示加随意标签加个属性： data-event="plus-dotShow"
 * 隐藏方法 ：global.plus.hide()
 * 显示方法 ：global.plus.show()
 *
*/
var plusAuto,plusHideAuto,plusHideTime = 10000;
    clearTimeout(plusHideAuto);
    plusHideAuto = setTimeout(function(){
        $('.plus-btn').css({right:'-.4rem',opacity:.8});
    },plusHideTime);

/*输入框增加清楚内容按钮*/
global.input = function(){
    $('input[data-event="input-text"]').on('input focus',function(){
        var val = $(this).val();
        var $del = $(this).parent().siblings('.del');
        if(val == null || $.trim(val) == '')
            $del.hide();
        else
            $del.show();
    }).on('blur', function(){
        var $this = $(this);
        setTimeout(function(){
            $this.parent().siblings('.del').hide();
        },300);
    });
    
    $('div[data-event="del-text"]').on('click',function(){
        $(this).hide();
        $(this).siblings('div.text').find('input').val('').focus();
    });
};

/*输入框获得焦点，防止键盘遮挡*/
global.holdup = function(obj){
    var $obj = obj ? $(obj) : $('input[placeholder]');
    $obj.on('focus',function(){
        $('.plus-tab').hide();
        var h = $(window).height();
        setTimeout(function(){
            if(h == $(window).height() && !$('.hold-up').length)
                $('body').append('<div class="hold-up" style="height:2.5rem;"></div>');
        },500);
    });
    $obj.on('blur',function(){
        $('.hold-up').remove();
        $('.plus-tab').show();
    });
};
/*窗口大小改变，延迟调整*/
global.dely = function(callback){
    var dely;
    clearTimeout(dely);
    if(callback instanceof Function)
        dely = setTimeout(function(){callback()},310);
};
global.plusConflict = function(obj){
    if(obj.length){
        $('.plus-list,.plus-btn').css({marginBottom:obj.height()});
        $('.plus-btn').addClass('transition');
    }
};
/*滚动fixed
* $(function(){
*        global.scroll('.scroll-fixed','class');
* });
*/
global.scroll = function(str,klass){
    $('.scroll-fixed-bar').remove();
    $(window).on('scroll',function(){global.scroll.fixed(str,'',klass)});    
};
global.scroll.fixed = function(str,index,klass){
    var index = -1;
    if(index) index = index;
    global.scroll.fixed.event($(str).eq(index),str,index,klass);
};
global.scroll.fixed.event = function(obj,str,index,klass){
    var scrollTop = obj.length ? obj.offset().top : 0,
                top = $(window).scrollTop(),
                klass = klass ? klass : '';
    if(top >= scrollTop && obj.length){
        if(!$('.scroll-fixed-bar').length)
            $('body').append('<div class="scroll-fixed-bar '+klass+'"></div>');
        $('.scroll-fixed-bar').html(obj.find('.int').html());
    }else{
        if(index <= 0)
            $('.scroll-fixed-bar').remove();
    }
    index ++;
    var next = $(str).eq(index);
    if(next.length){
        global.scroll.fixed.event(next,str,index,klass);
    }    
};

/*请稍等*/
global.waiting = function(txt){
    var txt = txt ? txt : '';
    if($('.loading-wait').length){
        $('.loading-wait').attr('data-txt',txt);
    }else{
        $('body').append('<div class="loading-wait" data-txt="'+txt+'"></div>');
    }
};
global.waiting.text = function(txt){
    if(txt && txt != null && $.trim(txt) != ''){
        if($('div.loading-wait').length > 0){
            $('div.loading-wait').attr('data-txt',txt);
        }
    }
};
global.waiting.remove = function(){
    $('.loading-wait').remove();
};

/*加载更多*/
global.loadingMore = function(obj,txt){
    var txt = txt ? txt : '加载中...';
    if(!$(obj).length) obj = 'body';
    if($('.loading-more',$(obj)).length){
        $('.loading-more').attr('data-txt',txt);
    }else{
        $(obj).append('<div class="loading-more" data-txt="'+txt+'"></div>');
    }
};
global.loadingMore.remove = function(obj){
    if(!$(obj).length) obj = 'body';
    $('.loading-more',$(obj)).remove();
};

/*iframe*/
global.iframe = function(url,option){
    if(!url) return;
    global.iframe.remove();
    if(option && option.top){/*用于联动页面，截取它的顶部BAR*/
        $('body').append('<iframe src="'+url+'" class="iframe-dialog" frameborder="0" style="width:'+$(window).width()+'px;height:'+($(window).height()+option.top)+'px;top:-'+option.top+'px"></iframe>');
    }else{
        $('body').append('<iframe src="'+url+'" class="iframe-dialog" frameborder="0" style="width:'+$(window).width()+'px"></iframe>');        
    }
    $('.wrapper').hide();
    if($('body').height() > $(window).height()){
        $(window).scrollTop(0);
        $('body').addClass('relative');
    }
};
/*遮罩 打开站内说明页面
*
* global.iframe.tips('url地址');
* 使用iframe，子页面必须执行：parent.global.iframe.tips.hidden(document.body.scrollHeight);
* 用来设置父级页面的高度，以在手机上操作滚动条
* 
* global.iframe.tips('html内容',{type:'html'});
*
*/
global.iframe.tips = function(content,option){
    if(!content) return;
    global.iframe.remove();
    var wHeight = $(window).height(),
        type = (option && option.type) ? option.type : 'url',
        time = 0,
        $body = $('body');
    if(initHeight > wHeight) time = 300;/*等待展开的键盘收起*/
    setTimeout(function(){
        if(type == 'html'){
            $body.append('<div class="iframe-dialog iframe-dialog-tips" style="width:'+$(window).width()+'px;height:'+$(window).height()+'px">'+content+'</div><div class="iframe-dialog-close"><span></span></div>');
        }else if(type == 'url'){
            $body.append('<iframe src="'+content+'" class="iframe-dialog iframe-dialog-tips" frameborder="0" style="width:'+$(window).width()+'px;height:'+$(window).height()+'px"></iframe><div class="iframe-dialog-close"><span></span></div>');
        }
        if($body.height() > initHeight){
            $body.addClass('relative');
            global.iframe.tips.hidden();
        }
        $body.one('click','.iframe-dialog-close',function(){
            global.iframe.tips.close();
        });
    },time);
};
global.iframe.tips.hidden = function(h){
    var height = (h && h > $(window).height() && h < $('body').height()) ? h : initHeight;
    $('body,html').addClass('hidden').css({height:height});
    if(navigator.userAgent.indexOf('iPhone OS') != '-1'){/*解决在IOS下，当弹窗内容的高度超过父级页面高度时，不能滚动问题*/
        if(h > $(window).height()){
            global.iframe.tips.auto();/*恢复正常状态*/
            if(h < $('body').height()){
                $('body,html').addClass('hidden').css({height:h});
            }           
        }
    }
};
global.iframe.tips.auto = function(){
    $('body,html').css({'height':''}).removeClass('hidden');
};
global.iframe.tips.close = function(){
    global.iframe.remove();
    $('.iframe-dialog-close').remove();
    global.iframe.tips.auto();
};

/*遮罩 打开规则页面*/
global.iframe.tips.rule = function(title,content){
    if(!title || !content) return;
    var rule = '<div class="iframe-dialog-wrap"><div class="iframe-dialog-title">'+title+'</div><div class="iframe-dialog-content g-border g-border-t">'+content+'</div></div>';
    global.iframe.tips(rule,{type:'html'});
};
global.iframe.remove = function(){
    $('.iframe-dialog').remove();
    $('body').removeClass('relative');
    $('.wrapper').show();
    global.waiting.remove();
};


/*URL拼接*/
global.url = {};
global.url.getParam = function(name,url){
    var reg=new RegExp("(^|&|\\?|#)"+name+"=([^&]*?)(&|#|$)"),
        url=url||location.href,
        tempHash=url.match(/#.*/)?url.match(/#.*/)[0]:"";

    url=url.replace(/#.*/,"");
    if(reg.test(tempHash)){
            return decodeURIComponent(tempHash.match(reg)[2]);
    }else if(reg.test(url)){
            return decodeURIComponent(url.match(reg)[2])
    }else return"";
}

global.url.setParam = function(name,value,url,isHashMode){
    if(typeof name == 'undefined' || typeof value == 'undefined' || typeof url == 'undefined'){
        return url;
    }
    var reg = new RegExp("(^|&|\\?|#)"+name+"=([^&]*?)(&|#|$)"),
        tempHash=url.match(/#.*/)?url.match(/#.*/)[0]:"";

    url=url.replace(/#.*/,"");
    if(isHashMode===true){
        if(reg.test(tempHash)){
            tempHash=tempHash.replace(reg,function(m,r1,r2,r3){return r1+name+"="+encodeURIComponent(value)+r3});
        }else{
            var separator=tempHash.indexOf("#")===-1?"#":"&"; 
            tempHash=tempHash+separator+name+"="+encodeURIComponent(value)}
            tempHash=tempHash.replace(reg,function(m,r1,r2,r3){return r1+name+"="+encodeURIComponent(value)+r3})
    }else if(reg.test(url)){
        url=url.replace(reg,function(m,r1,r2,r3){return r1+name+"="+encodeURIComponent(value)+r3});
    }else{
        var separator=url.indexOf("?")===-1?"?":"&";
        url=url+separator+name+"="+encodeURIComponent(value)
    }
    return url+tempHash
};

/*列表加载更多
 *
 * global.pullDown({
 *    cb:function(){},//滚动到底部开始执行
 *    ready:true//页面加载完执行一次
 * });
 *
 */
global.pullDown = function(option){
    var dh = (option.dh && !isNaN(option.dh) && parseInt(option.dh) > 0) ? option.dh : 50;
    
    if($('.footer').length)
        dh = dh + $('.footer').height();

    function initParams(){
        option = option || {};
        cb = option.cb || function () {};
        ready = option.ready || false;
    };

    function check(){
        if(Math.max(document.documentElement.scrollTop, document.body.scrollTop) + document.documentElement.clientHeight + dh < $(document.documentElement).height()){
                return false;
        }
        return true;
    };

    function getData(){
        if(!check()) return false;
        cb();
    };

    initParams();
    if(ready)
        getData();
    $(window).on('scroll',getData);
}; 

/*图片延迟加载
 * 
 * 标签 <img data-src="" />
 * 初始化执行 global.lazyload(范围对象);
 * 
 * */
global.lazyload = function(range){
    if(typeof range != "object") range = $('body');
    function lazyload() {
        this.config = {'attrName': 'data-src','nodeName': 'img'};
        this.lazyloader = function() {
            var a = $('img['+this.config.attrName+']',range),
                len = a.length,
                node = null;
            if (len == 0) {
                $(window).off('scroll',$.proxy(this.lazyloader,this));
                $(window).off('resize',$.proxy(this.lazyloader,this));
                $(document.body).off('touchmove',$.proxy(this.lazyloader,this));
                return;
            }
            var height = $(document.body).scrollTop() + document.documentElement.clientHeight;
            for (var i = 0; i < len; ++i) {
                node = $(a[i]);
                var nodeTop = node.offset().top;
                if (height >= nodeTop) {
                    var src = node.attr(this.config.attrName);
                    if(src != null && $.trim(src) != ''){
                        node.attr({'src':src,'data-src':''});
                    }
                    node.removeAttr(this.config.attrName);
                }
            }
        };
        this.bindEvent = function() {
            $(window).on('scroll',$.proxy(this.lazyloader,this));
            $(window).on('resize',$.proxy(this.lazyloader,this)); 
            $(document.body).on('touchmove',$.proxy(this.lazyloader,this));
        }
    };

    var loader = new lazyload();
    loader.lazyloader();
    loader.bindEvent();
};
var promptAuto;
(function($){

    $.dialogbox = function(data, klass, callback, title){
            $.dialogbox.loading();
            $.dialogbox.init();
            $.dialogbox.reveal(data, klass, callback, title);
            $.dialogbox.callback=callback;
    };
    $.extend($.dialogbox,{
        settings:{
            dialogboxHtml :'\
            <div id="dialogbox" class="dialogbox">\
                <div class="dialogbox-main">\
                    <div class="dialogbox-wrap">\
                        <div class="dialogbox-body"></div>\
                    </div>\
                </div>\
            </div>'
        },
        msg:function(data,always){
            var tipsHtml = btnHtml = closeHtml = titleHtml = titleImage = '';
            if(data && data.time) {
                setTimeout(function(){
                    $.dialogbox.close();
                },data.time);
            }
            if(data && data.title){
                titleHtml = '<div class="dialogbox-title">'+data.title+'</div>';
            }
            
            if(data && (data.image || data.title == '提示')){
                titleImage = '<div class="relative pb"><div class="dialogbox-figure"></div></div>';
                titleHtml = '';
            }
           
            if(data && data.content){
                tipsHtml = '<div class="dialogbox-tips">'+titleImage+data.content+'</div>';
            }
            if(data && data.btn && data.btn instanceof Array){
                btnHtml ='<div class="dialogbox-btn g-border g-border-t">';
                for (var lenBtn = 0; lenBtn < data.btn.length; lenBtn++) {
                    var btnName = data.btn[lenBtn];
                    btnHtml += '<a class="g-border g-border-l">'+btnName+'</a>';
                }
                btnHtml += '</div>';
            }
            if(data && data.btnClose){
                closeHtml = '<div class="dialogbox-close"><a href="javascript:;" onclick="$.dialogbox.close();"></a></div>';
            }
            if(!$('.dialogbox').length) $('body').append($.dialogbox.settings.dialogboxHtml);
            $(".dialogbox-body").html(titleHtml + tipsHtml + btnHtml + closeHtml);
            $('.dialogbox-btn').on('click','a',function(){
                var aIndex = $(this).index();
                if(data.call && data.call instanceof Array && data.call.length>=aIndex){
                    var callback = data.call[aIndex];
                    if(callback instanceof Function)
                        $.dialogbox.callback = callback;
                }
                $.dialogbox.close(data.keep);
            });            
            if(data && data.klass) $(".dialogbox").addClass(data.klass);
            if(data && data.closeCall instanceof Function){
                $.dialogbox.callback=data.closeCall;
            }
            $.dialogbox.init();
        },
        prompt:function(data){
            var content = data ? data.content ? data.content : '' : '',
                time = data ? data.time ? data.time : 2000 : '';
            $(".dialogPrompt").remove();
            $('body').append('<div class="dialogPrompt">'+content+'</div>');
            $('.dialogPrompt').css({marginLeft:($(window).width()  - $('.dialogPrompt').width())/2}).addClass('dialogPromptIn');
            if(time){
                clearTimeout(promptAuto);
                promptAuto = setTimeout(function(){
                    $('.dialogPrompt').removeClass('dialogPromptIn');
                    if(data && data.closeCall instanceof Function) data.closeCall();
                    setTimeout(function(){
                        $('.dialogPrompt').remove();
                    },500);
                },time);
            }
        },
        mark:function(data){
            var content =''
            if(data && data.content) content = data.content;
            if(!$('.dialogbox').length) $('body').append($.dialogbox.settings.dialogboxHtml);
            $('.dialogbox-wrap').html(content).addClass('dialogbox-wrap-free');
            $('.dialogbox').on('click',function(){
                if(data && data.callback instanceof Function)
                    $.dialogbox.callback = data.callback;
                $.dialogbox.close();
            });
            $.dialogbox.init();
            $('.dialogbox-overlay').css({'background':'rgba(0,0,0,.8)'});
        },
        init:function(){
            if(!$(".dialogbox-overlay").length) $("body").append('<div class="dialogbox-overlay"></div>');
        },
        loading:function(){
            if(!$(".dialogbox").length) $('body').append($.dialogbox.settings.dialogboxHtml);
            $(".dialogbox-body").html('<div class="dialogbox-loading"></div>');
        },
        reveal:function(data,klass,callback,title){
            $(".dialogbox-body").html(data);
            if(title) {
                $('.dialogbox-title').html(title);
            }else{
                $('.dialogbox-title').remove();
            }
            if(klass) $(".dialogbox").addClass(klass);
        },
        close:function(keep){
            if (keep != 1)  $(".dialogbox,.dialogbox-overlay").remove();
            if($.dialogbox.callback){
                $.dialogbox.callback();
                $.dialogbox.callback = null;
            }
        },
        unknown:function(result){
            var data = {};
            data['time'] = 3000;
            var code = result && result.code ? result.code : 99999;
            var content = result && result.message ? result.message : '系统繁忙';
            
            if(code && (code == 10001 || code == 10004)){
                content = '获取用户失败，请重新登录！';
                data['closeCall'] = function(){melon.redirect('/user/login.action');}
            }
            
            data['content'] = '<div class="relative pb"><div class="dialogbox-figure"></div></div>'+content;
            data['btn'] = ['确定'];
            $.dialogbox.msg(data);
        },
        unknownPrompt:function(result){
            var data = {};
            var code = result && result.code ? result.code : 99999;
            var content = result && result.message ? result.message : '系统繁忙';
            
            if(code && code == 10001){
                content = '获取用户失败，请重新登录！';
            }
            
            data['content'] = content;
            $.dialogbox.prompt(data);
        }
    });
})(Zepto);