/* __________________________________________________________________
		Name: piroBox v.1.1
		Date: february 2009
		Use: just  another gallery.
		Autor: Diego Valobra (http://www.pirolab.it),(http://www.diegovalobra.com)
		Version: 1.1
		Licence: CC-BY-SA http://creativecommons.org/licenses/by-sa/2.5/it/
_______________________________________________________________________________*/

/*_____________________ HTML FOR THE GALLERY _____________________*/

$(document).ready(function(){
  
  jQuery.easing.def = 'easeOutBack';
  
$('body').append(
		'<!-- :::::::: PIROBOX :::::::::: -->'+
		'<div class="pre"></div>'+
		'<div class="bg_thumbs"></div>'+
		'<div class="box_next"><a href="#" class="next" title="next image">next</a></div>'+
		'<div class="box_previous"><a href="#" class="previous" title="previous image">prev</a></div>'+
		'<div id="gallery" class="thumbs">'+
		'<div class="all">'+
		'<div class="t_l"></div>'+
		'<div class="t_r"></div>'+
		'<div class="middle_l"></div>'+
		'<div class="middle_r"></div>'+
		'<div class="t_l_b"></div>'+
		'<div class="t_r_b"></div>'+
		'<div class="img_box" title="close">'+
		'<div class="box_next_in"><a href="#" class="next_in" title="next image">next</a></div>'+
		'<div class="box_previous_in"><a href="#" class="previous_in" title="previous image">prev</a></div>'+
		'</div>'+
		'<span class="thumbs_close" title="close"></span>'+
		'</div>'+
		'</div>'+
		'<!-- :::::::: END PIROBOX :::::::::: -->'
		);
		
		$('.thumbs').piroBox({

      mySpeed: 500,   
      bg_alpha: 0.7,  
      pathLoader : 'url(http://www.blancopop.com/drupal/sites/all/themes/blancopop/js/pirobox/css_pirobox/ajax-loader_w.gif) center center no-repeat;',   
      gallery : '.field-field-fotos .field-item a',   
      gallery_li : '.field-field-fotos .field-item',
      next_class : '.next',  
      previous_class : '.previous'

    });
			
});


(function($) {

	$.fn.piroBox = function(opt) {
		opt = jQuery.extend({
			border: 1, 
			mySpeed: null,
			open_speed : 1000,
			close_speed : 1000,
			bg_alpha: 0.5,
			pathLoader : null, 
			gallery : null, 
			gallery_li : null,
			single : null,
			next_class : null,
			previous_class : null,
			padding: '0',
			gloabal : true
		}, opt);


return this.each(function() {
		
	

		/*___________________ CLOSE FUNCTION ______________________________*/
		function closeIt() {
				$('.pre').hide();
				$('.caption').remove();				
				$('div.begin').remove();
				$('div.end').remove();
				$('.thumbs_close').css('display','none');
				$(opt.next_class+','+opt.previous_class).css({'visibility':'hidden'});
				$((opt.gallery_li)).removeClass('start');
				$((opt.gallery_li)).removeClass('back');
				$('.box_next_in, .box_previous_in,.box_next,.box_previous ').css('display','none');
				$('.loader').fadeTo(300,0);
				$('.loader').queue(function(){
					$('.bg_thumbs').fadeTo(500,0);
					$('.img_box img').remove();
					$('.img_box ').queue(function(){
					$('.all').css({
					'top':'50%',
					'height':'80px',
					'width':'80px',
					'marginLeft':'-45px',
					'marginTop':'-40px',
					'visibility':'hidden',
					'padding':'10px'
					});
					$('.img_box').css({
					'height':'50px',
					'width' : '50px',
					'visibility':'hidden'
					}).removeClass('unloader');
					$('.bg_thumbs').hide().css('visibility','hidden');
					$('.thumbs').hide();
					$('.img_box').dequeue();
					});
				$('.loader').dequeue().remove('<div class="loader"><span style=" background:' + opt.pathLoader + ' "></span></div>');
				});
				$('.img_box img, .thumbs_close').fadeTo(400,0);			
				$('.img_box img').queue(function(){
					$('.img_box').animate({
					height : '50px' ,
					width : '50px' 
					},50).css('visibility','hidden'); 												 
					$('.all').animate({
					top:'50%',
					height : '80px' ,
					width : '80px' , 
					marginLeft : '-45px',
					marginTop : '-40px',
					padding : '10px'
					},(opt.close_speed)); 												     
					$('.img_box img').remove();
					$('.img_box').removeClass('unloader');
					$('.bg_thumbs').fadeTo(500,0);
						$('.all').queue(function(){
							$('.bg_thumbs,.thumbs_close').hide().css('visibility','hidden');
							$('.thumbs').css('display','none');	
						$('.all').css('visibility','hidden').dequeue()
				
						});
				$('.img_box img').dequeue();
				});
		}
		/*___________________	END FUNCTION CLOSE     ________________________*/	

		/*___________________	START PIROBOX	    ________________________*/

			var next_out = $('.box_next').width();
			var idPiro = $(this).attr('id');			
			var b_size = (opt.border)+2;
				  if($.browser.msie && $.browser.version < 7)   {
					$('.img_box').css('padding','2px');
					$('head').append('<!--[if lte IE 6]>'+
					'<style type="text/css">@media screen{* html{overflow-y: hidden;}* html body{width:100%; overflow: auto; position: relative;}} .img_box{position:absolute;margin-top:-2px;margin-left:-2px;width:50px;height:50px;visibility:hidden; overflow:hidden;z-index:1002; left: 6px;} .img_box img{float:left;position:relative; z-index:1100;border:none;padding:0;z-index:1003; cursor:url(http://www.pirolab.it/pirobox/css_pirobox/cursor/close.cur), pointer; left: 6px;} .loader{position:fixed!important;position:absolute;top:50%;left:48%;margin-top:-30px;margin-left:-33px;width:80px;height:80px;display:block;z-index:1007; background:url(bg_loader_w.png) center no-repeat!important; background:url(bg_loader_w.gif) center no-repeat;}</style>'+'<![endif]-->'
									);
					$('body').height($(window).height());
          $('body').width($(window).width());
					} else {
						$('.img_box').css('padding','2px');
						(opt.mySpeed);
					}
					
				$('.bg_thumbs, .thumbs, .thumbs_close ').hide();
			$(window).resize(function(){
				var new_w_bg = $(window).height();
				$('.bg_thumbs').css({'visibility':'visible','height':+ new_w_bg+30 +'px'});				  
			});	
			var w_bg = $(window).height();
			$('.bg_thumbs').css({'visibility':'hidden','height':+ w_bg+30 +'px'});
		/*___________________	LAUNCH GALLERY     ________________________*/
		
			$(opt.gallery).bind('click',function() {
				$(this).parent('div').parent('div').prepend('<div  class="begin"></div>');
				$(this).parent('div').parent('div').append('<div  class="end"></div>');
				$('.pre').append('<div class="loader"><span style=" background:' + opt.pathLoader + ' "></span></div>').hide();
				$('.all').prepend('<div class="caption"><p title="caption"></p></div>');
				$('.caption').css({'opacity':'0','visibility':'hidden'});
				$(opt.next_class+','+opt.previous_class).css({'visibility':'hidden'});
				if($.browser.msie && $.browser.version < 7)   {
          $('html, body').animate({scrollTop:0}, 'slow'); 
        }

		/*___________________SINGLE, NEXT AND PREVIOUS PREPARE    ________________________*/				
						
					if($(this).parent().next('div').is('.end')){
						$((opt.next_class)).css('right','-'+next_out-30+'px');
						$(this).parent().next('div').removeClass('start');
					} else {
						$((opt.next_class)).css('visibility','hidden').css({
						right : '0px'																	  
						});
						$(this).parent().next('div').addClass('start');
					}
					if($(this).parent().prev('div').is('.begin')){
						$((opt.previous_class)).css('left','-'+next_out-30+'px');
						$('.box_next_in, .box_previous_in ').css('display','none');
					} else {
						$((opt.previous_class)).css('visibility','hidden').css({
						left : '0px'																	  
						});
						$(this).parent().prev('div').addClass('back');
					}
					$('.img_box img').remove('img');
					$(window).resize(function(){
						var new_w_bg = $(window).height();
						$('.bg_thumbs').css({'visibility':'visible','height':+ new_w_bg+30 +'px'});
					});
					var w_bg = $(window).height();
					$('.pre').css('visibility','visible').show();
					var pathImg = $(this).attr('href');
					var titleImg = $(this).attr('title');
					var myImg = new Image(); 
					$(myImg).load(function() {
						var imgH = myImg.height;
						var imgW = myImg.width;	
						var w_H = $(window).height();
						var w_W = $(window).width();
						$('#' + idPiro + ' .img_box').append(this);
						
						if(imgH+100 > w_H || imgW+100 > w_W){
								var new_img_W = imgW;
								var new_img_H = imgH;
								var _x = (imgW + 100)/w_W;
								var _y = (imgH + 100)/w_H;

								if ( _y > _x ){
								new_img_W = Math.round(imgW * (0.9/_y));
								new_img_H = Math.round(imgH * (0.9/_y));
								} else {
								new_img_W = Math.round(imgW * (0.9/_x));
								new_img_H = Math.round(imgH * (0.9/_x));
								}
								imgH += new_img_H;
								imgW += new_img_W;
								$('.thumbs').show();
								$('.bg_thumbs').show().css({'opacity':'0','visibility':'visible','height':+ w_bg +'px'}).fadeTo(300,(opt.bg_alpha));
								$('.img_box img').css('visibility','hidden').hide();
								$('.all').css({'visibility':'visible'}).animate({
									height : (new_img_H) + 'px' ,
									width : (new_img_W) + 'px' , 
									marginLeft : '-' +((new_img_W)/2) +'px',
									marginTop : '-' +((new_img_H)/2+20 ) +'px'
								},(opt.open_speed));
								$('.all').queue(function(){
								$('.img_box').css({
									visibility :'visible',
									height : (new_img_H) + 'px' ,
									width : (new_img_W) + 'px' 
								});
								$('.img_box').queue(function(){
									$(myImg).height(new_img_H).width(new_img_W).css('opacity',0);
									$('.img_box img').css('visibility','visible').show().fadeTo(300,1);
									$('.img_box ').addClass('unloader');
									$('.loader').remove('<div class="loader"><span style=" background:'+ opt.pathLoader + ' "></span></div>');
								$('.img_box').dequeue()
									if(titleImg == ""){							
										$('.caption').css('visibility','hidden');
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(200,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});
									}else{
										$('.caption p').html(titleImg);
										var caption_h = $('.caption').height();										
										$('.all').animate({
											height :new_img_H+ (caption_h+10) + 'px'
										},300);
										$('.all').queue(function(){
										$('.caption').css({'visibility':'visible','width':+ new_img_W+'px'}).fadeTo(400,1);
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(200,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});	
										$('.all').dequeue()
										});
									}
								});
									if($(opt.next_class).is('.next_in')){
										$('.box_next_in ,.box_previous_in ').css('display','block');
										$('.box_next,.box_previous ').css('display','none');
										$(opt.next_class +','+ opt.previous_class).css({'visibility':'visible'});
									}else if($(opt.next_class).is('.next')) {
										$('.box_next_in, .box_previous_in ').css('display','none');
										$('.box_next,.box_previous ').css('display','block');
										$(opt.next_class +','+ opt.previous_class).css({'visibility':'visible'});										
									}
								$('.all').dequeue();
								});		
								
						} else {
										
								$('.thumbs').show();
								$('.bg_thumbs').show().css({'opacity':'0','visibility':'visible','height':+ w_bg +'px'}).fadeTo(300,(opt.bg_alpha));
								$('.img_box img').css('visibility','hidden').hide();
								$('.all').css({'visibility':'visible'}).animate({
									height : (imgH)+ 'px' ,
									width : (imgW) + 'px' , 
									marginLeft : '-' +((imgW)/2) +'px',
									marginTop : '-' +((imgH)/2+10) +'px'
								},(opt.open_speed));
								$('.all').queue(function(){
								$('.img_box').css({
									visibility :'visible',
									height : (imgH) + 'px' ,
									width : (imgW) + 'px' 
								});
								$('.img_box').queue(function(){
									$(myImg).height(imgH).width(imgW).css('opacity',0);
									$('.img_box img').css('visibility','visible').show().fadeTo(300,1);
									$('.img_box ').addClass('unloader');
									$('.loader').remove(' <div class="loader"><span style=" background:' + opt.pathLoader + ' "></span></div>');								
								$('.img_box').dequeue()
								
									if(titleImg == ""){							
										$('.caption').css('visibility','hidden');
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(200,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});
									}else{
										$('.caption p').html(titleImg);
										var caption_h = $('.caption').height();										
										$('.all').animate({
											height :imgH+ (caption_h+10) + 'px'
										},300);
										$('.all').queue(function(){
										$('.caption').css({'visibility':'visible','width':+ imgW+'px'}).fadeTo(400,1);
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(200,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});	
										$('.all').dequeue()
										});
									}
		
								});
									if($(opt.next_class).is('.next_in')){
										$('.box_next_in ,.box_previous_in ').css('display','block');
										$('.box_next,.box_previous ').css('display','none');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'visible'});
										}else if($(opt.next_class).is('.next')) {
										$('.box_next_in, .box_previous_in ').css('display','none');
										$('.box_next,.box_previous ').css('display','block');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'visible'});
									}								
								$('.all').dequeue();

								});	
						  }

					});
				$(myImg).attr('src', pathImg);
				return false;
			});
		/*___________________	NEXT    ________________________*/

			$((opt.next_class)).bind('click',function() {	
		
				$('.thumbs_close').css({'opacity':'0','visibility':'hidden'});
				$('.img_box img').remove('img');
				$('.pre').css('visibility','visible').show();
				$('.caption').css({'opacity':'0','visibility':'hidden'});
				$('.pre').append('<div class="loader"><span style=" background:'+ opt.pathLoader +' "></span></div>');				
				var pathImg = $('.start>a').attr('href');
				var titleImg = $('.start>a').attr('title');
				$('.start').next('div').addClass('start');
				$('.start').queue(function(){
					$(this).prev('div').removeAttr('class');
					$((opt.gallery_li)).removeClass('back');
					$('.start').prev('div').prev('div').addClass('back');
					$((opt.previous_class)).animate({left: '0px'},300);
				$('.start').dequeue();
				});
				$((opt.next_class)).css('visibility','hidden');
				$((opt.previous_class)).css('visibility','hidden');
				var myImg = new Image(); 
				$(myImg).load(function() {
					var imgH = myImg.height;
					var imgW = myImg.width;	
					var w_H = $(window).height();
					var w_W = $(window).width();		
						$('#' + idPiro + ' .img_box').append(this);
						
							if(imgH+100 > w_H || imgW+100 > w_W){
								var new_img_W = imgW;
								var new_img_H = imgH;
								var _x = (imgW + 100)/w_W;
								var _y = (imgH + 100)/w_H;
								if ( _y > _x ){
								new_img_W = Math.round(imgW * (0.9/_y));
								new_img_H = Math.round(imgH * (0.9/_y));
								} else {
								new_img_W = Math.round(imgW * (0.9/_x));
								new_img_H = Math.round(imgH * (0.9/_x));
								}
								imgH += new_img_H;
								imgW += new_img_W;
							$('.thumbs').show();
							$('.img_box ').css('visibility','hidden');							
							$('.img_box img').css('visibility','hidden').hide();
								$('.all').css({'visibility':'visible'}).animate({
									height : (new_img_H) + 'px' ,
									width : (new_img_W) + 'px' , 
									marginLeft : '-' +((new_img_W)/2 ) +'px',
									marginTop : '-' +((new_img_H)/2+20 ) +'px'
								},(opt.mySpeed));
								$('.all').queue(function(){
								$('.img_box').css({
									visibility :'visible',
									height : (new_img_H) + 'px' ,
									width : (new_img_W) + 'px' 
								});
							$('.img_box').queue(function(){
								$(myImg).height(new_img_H).width(new_img_W).css('opacity',0);
								$('.img_box img').css('visibility','visible').show().fadeTo(200,1)
								$('div.box_previous_in,div.box_previous').css({'display':'block'});
								$('.img_box ').addClass('unloader');
								$('.loader').remove('<div class="loader"><span style=" background:'+ opt.pathLoader +' "></span></div>');
								$('.img_box').dequeue()
		
									if(titleImg == ""){							
										$('.caption').css('visibility','hidden');
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});
									}else{	
										$('.caption p').html(titleImg);
										$('.caption').css({'width':+ new_img_W+'px'});
										var caption_h = $('.caption').height();
										var caption_w = new_img_W;
										$('.all').animate({
											height :new_img_H+ (caption_h+10) + 'px'
										},300);
										$('.all').queue(function(){
										$('.caption').css({'visibility':'visible'}).fadeTo(600,1);
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});	
										$('.all').dequeue()
										});

									}										
								
							});
									if($(opt.next_class).is('.next_in')){
										$('.box_next_in ,.box_previous_in ').css('display','block');
										$('.box_next,.box_previous ').css('display','none');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'visible'});
										}else if($(opt.next_class).is('.next')) {
										$('.box_next_in, .box_previous_in ').css('display','none');
										$('.box_next,.box_previous ').css('display','block');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'visible'});
									}
									if($('.start ').is('div.end')){
										$((opt.next_class)).css('visibility','hidden');
										$('div.box_next_in,div.box_next').css({'display':'none'});
											$('.end').removeClass('start');
										$(opt.previous_class).css({'visibility':'visible'});
										}else{						
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'visible'});
										}
								$('.all').dequeue();
								});	
								
					} else {
		
							$('.thumbs').show();
							$('.img_box ').css('visibility','hidden');
							$((opt.previous_class)).css('visibility','hidden');
							$('.img_box img').css('visibility','hidden').hide();
								$('.all').css({'visibility':'visible'}).animate({
									height : (imgH) + 'px' ,
									width : (imgW) + 'px' , 
									marginLeft : '-' +((imgW)/2) +'px',
									marginTop : '-' +((imgH)/2+10) +'px'
								},(opt.mySpeed));
								$('.all').queue(function(){
								$('.img_box').css({
									visibility :'visible',
									height : (imgH) + 'px' ,
									width : (imgW) + 'px'
								});
							$('.img_box').queue(function(){
								$(myImg).height(imgH).width(imgW).css('opacity',0);
								$('.img_box img').css('visibility','visible').show().fadeTo(200,1);
								$('div.box_previous_in,div.box_previous').css({'display':'block'});
								$('.img_box ').addClass('unloader');									 
								$('.loader').remove('<div class="loader"><span style=" background:'+opt.pathLoader+' "></span></div>');
							$('.img_box').dequeue()
		
									if(titleImg == ""){							
										$('.caption').css('visibility','hidden');
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});
									}else{	
										$('.caption p').html(titleImg);
										var caption_w = imgW;
										$('.caption').css({'width':+ imgW+'px'});
										var caption_h = $('.caption').height();
										$('.all').animate({
											height :imgH+ (caption_h+10) + 'px'
										},300);
										$('.all').queue(function(){
										$('.caption').css({'visibility':'visible'}).fadeTo(600,1);
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});	
										$('.all').dequeue()
										});
									}	
							});
									if($(opt.next_class).is('.next_in')){
										$('.box_next_in ,.box_previous_in ').css('display','block');
										$('.box_next,.box_previous ').css('display','none');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'hidden'});
										//alert('next_in');
										}else {
										$('.box_next_in, .box_previous_in ').css('display','none');
										$('.box_next,.box_previous ').css('display','block');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'hidden'});
									}
									if($('.start ').is('div.end')){
										$((opt.next_class)).css('visibility','hidden');
										$('div.box_next_in,div.box_next').css({'display':'none'});
											$('.end').removeClass('start');
										$(opt.previous_class).css({'visibility':'visible'});
										
										}else{						
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'visible'});
										}
								$('.all').dequeue();
								});			
						}
					});
					$(myImg).attr('src', pathImg);
					return false;
			});
		/*___________________	PREVIOUS   ________________________*/
		
			$((opt.previous_class)).bind('click',function() {
				$('.thumbs_close').css({'opacity':'0','visibility':'hidden'});
				$('.img_box img').remove('img');
				$('.pre').css('visibility','visible').show();
				$('.caption').css({'opacity':'0','visibility':'hidden'});
				$('.pre').append('<div class="loader"><span style=" background:'+opt.pathLoader+' "></span></div>');							
				var pathImg = $('.back>a').attr('href');							
				var titleImg = $('.back>a').attr('title');		
				$((opt.gallery_li)).removeClass('start');
					$((opt.gallery_li)).queue(function(){
						$('.back').next('div').addClass('start');
					$((opt.gallery_li)).dequeue();
					});
					$('.back').queue(function(){
						$((opt.gallery_li)).removeClass('back');
						$('.start').prev('div').prev('div').addClass('back');
						$((opt.next_class)).animate({right: '0px'},300);
					$('.back').dequeue();
					});
					$((opt.previous_class)).css('visibility','hidden');	
					$((opt.next_class)).css('visibility','hidden');
					var myImg = new Image(); 		
					$(myImg).load(function() {
						var imgH = myImg.height;
						var imgW = myImg.width;	
						var w_H = $(window).height();
						var w_W = $(window).width();		
						$('#' + idPiro + ' .img_box').append(this);
						
							if(imgH+100 > w_H || imgW+100 > w_W){
								var new_img_W = imgW;
								var new_img_H = imgH;
								var _x = (imgW + 100)/w_W;
								var _y = (imgH + 100)/w_H;
								if ( _y > _x ){
								new_img_W = Math.round(imgW * (0.9/_y));
								new_img_H = Math.round(imgH * (0.9/_y));
								} else {
								new_img_W = Math.round(imgW * (0.9/_x));
								new_img_H = Math.round(imgH * (0.9/_x));
								}
								imgH += new_img_H;
								imgW += new_img_W;
								$('.thumbs').show();
							$('.img_box ').css('visibility','hidden');
							$('.img_box img').css('visibility','hidden').hide();
								$('.all').css({'visibility':'visible'}).animate({
									height : (new_img_H) + 'px' ,
									width : (new_img_W) + 'px' , 
									marginLeft : '-' +((new_img_W)/2) +'px',
									marginTop : '-' +((new_img_H)/2+20) +'px'
								},(opt.mySpeed));
								$('.all').queue(function(){
								$('.img_box').css({
									visibility :'visible',
									height : (new_img_H) + 'px' ,
									width : (new_img_W) + 'px'
								});
								$('.img_box').queue(function(){
									$(myImg).height(new_img_H).width(new_img_W).css('opacity',0);
									$('.img_box img').css('visibility','visible').show().fadeTo(200,1)
									$('div.box_next_in,div.box_next').css({'display':'block'});
									$('.img_box ').addClass('unloader');
									$('.loader').remove('<div class="loader"><span style=" background:'+opt.pathLoader+' "></span></div>');
								$('.img_box').dequeue()
		
									if(titleImg == ""){							
										$('.caption').css('visibility','hidden');
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});
									}else{	
										$('.caption p').html(titleImg);
										var caption_w = new_img_W;
										$('.caption').css({'width':+ new_img_W+'px'});
										var caption_h = $('.caption').height();
										$('.all').animate({
											height :new_img_H+ (caption_h+10) + 'px'
										},300);
										$('.all').queue(function(){
										$('.caption').css({'visibility':'visible'}).fadeTo(600,1);
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});	
										$('.all').dequeue()
										});
									}	
								});
									if($(opt.next_class).is('.next_in')){
										$('.box_next_in ,.box_previous_in ').css('display','block');
										$('.box_next,.box_previous ').css('display','none');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'hidden'});
										}else {
										$('.box_next_in, .box_previous_in ').css('display','none');
										$('.box_next,.box_previous ').css('display','block');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'hidden'});
									}
									if($('.back').is('div.begin')){
											$((opt.previous_class)).css('visibility','hidden');
											$((opt.next_class)).css('visibility','visible');
											$('div.box_previous_in,div.box_previous').css({'display':'none'});
											$('.begin').removeClass('back');
											$((opt.gallery_li)).removeClass('start');
											$((opt.gallery_li)).queue(function(){						  
												$('.begin').next('div').next('div').addClass('start');
											$((opt.gallery_li)).dequeue()
											});
										} else{	
										$(opt.next_class + ',' + opt.previous_class).css('visibility','visible');
										}
								$('.all').dequeue();
								});	
								
						} else {
		
							$('.thumbs').show();
							$('.img_box ').css('visibility','hidden');
							$((opt.next_class)).css('visibility','hidden');
							$('.img_box img').css('visibility','hidden').hide();
								$('.all').css({'visibility':'visible'}).animate({
									height : (imgH) + 'px' ,
									width : (imgW) + 'px' , 
									marginLeft : '-' +((imgW)/2) +'px',
									marginTop : '-' +((imgH)/2+10) +'px'
								},(opt.mySpeed));
								$('.all').queue(function(){
								$('.img_box').css({
									visibility :'visible',
									height : (imgH) + 'px' ,
									width : (imgW) + 'px'
								});
							$('.img_box').queue(function(){
								$(myImg).height(imgH).width(imgW).css('opacity',0);					
								$('.img_box img').css('visibility','visible').show().fadeTo(200,1);
								$('div.box_next_in,div.box_next').css({'display':'block'});
								$('.img_box ').addClass('unloader');														 
								$('.loader').remove('<div class="loader"><span style=" background:' + opt.pathLoader + ' "></span></div>');
							$('.img_box').dequeue()
		
									if(titleImg == ""){							
										$('.caption').css('visibility','hidden');
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});
									}else{
										$('.caption p').html(titleImg);
										var caption_w = imgW;
										$('.caption').css({'width':+ imgW+'px'});
										var caption_h = $('.caption').height();
										$('.all').animate({
											height :imgH+ (caption_h+10) + 'px'
										},300);
										$('.all').queue(function(){
										$('.caption').css({'visibility':'visible'}).fadeTo(600,1);
										$('.thumbs_close').show().css({'opacity':'0','visibility':'visible'}).fadeTo(300,1);
										$('.unloader, .thumbs_close').bind('click',function(){closeIt();});	
										$('.all').dequeue()
										});
									}
								
							});
									if($(opt.next_class).is('.next_in')){
										$('.box_next_in ,.box_previous_in ').css('display','block');
										$('.box_next,.box_previous ').css('display','none');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'hidden'});
										}else {
										$('.box_next_in, .box_previous_in ').css('display','none');
										$('.box_next,.box_previous ').css('display','block');
										$(opt.next_class + ',' + opt.previous_class).css({'visibility':'hidden'});
									}	
									if($('.back').is('div.begin')){
											$((opt.previous_class)).css('visibility','hidden');
											$((opt.next_class)).css('visibility','visible');
											$('div.box_previous_in,div.box_previous').css({'display':'none'});
											$('.begin').removeClass('back');
											$((opt.gallery_li)).removeClass('start');
											$((opt.gallery_li)).queue(function(){						  
												$('.begin').next('div').next('div').addClass('start');
											$((opt.gallery_li)).dequeue()
											});
										} else{	
										$(opt.next_class + ',' + opt.previous_class).css('visibility','visible');
										}
								$('.all').dequeue();
								});								
						}
				});
				$(myImg).attr('src', pathImg);
				return false;
			});			
		});
	}   
})(jQuery);

