/*图片轮播*/ 
var isFaild = false;
$(function(){
  silde.init();
});
var silde={
  init: function(){
    this.sliderEvent();
    this.apmlifImgShow();
  },
  sliderEvent:function(){
    var sliderAuto,
          self = this,
          time = 3000,
          speed = 800,
          $box = $('#slider-box'),
          $ban = $('#slider-banner li'),
          $dot = $('#slider-dot');
    clearInterval(sliderAuto);
    if($ban.length < 2) return;
    sliderAuto = setInterval(self.sliderScrollEvent,time);
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
      sliderAuto = setInterval(self.sliderScrollEvent,time);
    });
  },
  sliderScrollEvent:function(speed){
    var $ban = $('#slider-banner li'),
          $dot = $('#slider-dot'),
          cur = $dot.find('.current').index() + 1,
          speed = 800;
    if(cur >= $ban.length) cur = 0;
    $dot.find('li').eq(cur).addClass('current').siblings('li').removeClass('current');
    $ban.eq(cur).fadeIn(speed).siblings('li').fadeOut(speed);
  },
  sliderButtonEvent:function(){
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
  },
  apmlifImgShow:function(){
   $('.imgAmpCont').click(function(){
      var bigPathList = new Array(),
          index = $(this).index();
      $(this).parent().find('.imgAmpCont').each(function(){
        if($(this).find('img').length)
          bigPathList.push($(this).find('img').attr('src'));
      });
      if(bigPathList.length>0){
        var windowWith=$(document).width() > 1020 ? 1020 : $(document).width();
        var windowHeight=$(document).height() > 600 ? 600 : $(document).height();
        var imgHtml = '<table  style="height:100%;width:100%;"><tr><td><ul style="text-align:center;" id="bigImgShowTd">';
        for (var len = 0; len < bigPathList.length; len++) {
          var obj = bigPathList[len];
          if(len==index)
            imgHtml+='<li class="big-show-li">';
          else
            imgHtml+='<li class="big-show-li hide">';
          imgHtml+='<img src="'+obj+'" style="max-width:'+windowWith+'px;max-height:'+windowHeight+'px;"/></li>';
        }
        imgHtml+='</ul></td></tr></table>';
        var html='<div style="width:'+windowWith+'px;height:'+windowHeight+'px">'+imgHtml+'</div>';
            html+='<div class="dialogboxPrev" title="上一张">&lt;</div>';
            html+='<div class="dialogboxNext" title="下一张">&gt;</div>';
        $.dialogbox(html,'','','图片查看');
        if(bigPathList.length>1){
          $('.dialogboxPrev').click(function(){
            var $show = $('#bigImgShowTd li').not(':hidden');
            $show.addClass('hide');
            if($show.prev('.big-show-li').length>0)
              $show.prev('.big-show-li').removeClass('hide');
            else
              $show.siblings('.big-show-li:last').removeClass('hide');
          });
          $('.dialogboxNext').click(function(){
            var $show = $('#bigImgShowTd li').not(':hidden');
            $show.addClass('hide');
            if($show.next('.big-show-li').length>0)
              $show.next('.big-show-li').removeClass('hide');
            else
              $show.siblings('.big-show-li:first').removeClass('hide');
          });
        }else{
          $('.dialogboxPrev').hide();
          $('.dialogboxNext').hide();
        }
      }
    });
  }
};