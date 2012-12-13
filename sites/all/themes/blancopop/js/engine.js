$(document).ready(function(){
  
  var COOKIE_NAME = 'test_cookie';
  var ADDITIONAL_COOKIE_NAME = 'additional';
  var cookie_options = { path: '/', expires: 10 };
  
  $('#suscri_button').click(function() {
    var susc_em = $('#suscri_textf').val();
    $.cookie(COOKIE_NAME, susc_em, cookie_options);
    window.location = "http://www.blancopop.com/suscripcion-al-newsletter";
    return false;
  });
  
  if($('body.page-suscripcion-al-newsletter').length > 0){
    $('#edit-cc-email').val($.cookie(COOKIE_NAME));
    $('.page-suscripcion-al-newsletter #content-top h2.title').html('Suscr&iacute;bete a nuestro Newsletter');
    $('.page-suscripcion-al-newsletter #edit-submit').attr('value', 'Suscribirme');
  }
  
  jQuery.fn.replaceWith = function(replacement) {
    return this.each(function(){
      element = $(this);
      $(this)
        .after(replacement).next()
        .attr('class', element.attr('class')).attr('id',element.attr('id'))
        .html(element.html())
        .prev().remove();
      });
  };
  $('#block-views-big_slideshow-block_1 .item-list').before('<div id="views-cycle-big_slideshow-block_1-nav">&nbsp;</div>');
  $('#block-views-big_slideshow-block_1 ul').cycle({
	timeout: 8000,
	fx: 'scrollUp',
	pager: '#views-cycle-big_slideshow-block_1-nav'
  });
  
  if($('.node-type-video').length > 0 && $('body.front').length == 0){
    $('.swftools object').attr("width", 625);
    $('.swftools object').attr("height", 315);
  }
  if($('.page-seccion-galeria').length > 0 && $('.node-type-galeria').length == 0){
    $('#content-header h1.title').html('galerías');
  }
  
  /*
  if($('.section-categorias-de-contenido').length > 0){
    var cHeight = $('#content').height();
    var sHeight = $('#sidebar-right').height();
    
    if(sHeight > cHeight){
      $('#content').height(sHeight);
    }else{
      if(cHeight > sHeight){
        var exc = cHeight - sHeight;
        var gh = $('#block-views-galerias_front-block_1').height();
        $('#block-views-galerias_front-block_1').height(exc + gh);
      }
    }
  }
  */
  
  $('#player_linkey').popupWindow({
    height: 380, 
    width: 220, 
    top: 50, 
    left: 50
  });
  
  $('#bd_link').popupWindow({
    width: 1024,
    height: 768,
    top: 50,
    left: 50
  });
  
  $('#bt_link').popupWindow({
    width: 1024,
    height: 768,
    top: 50,
    left: 50
  });
  
  $('#facebook_link').click(function(){
    window.open(this.href);
    return false;
  });
  
  $('#twitter_link').click(function(){
    window.open(this.href);
    return false;
  });
  
  if($('.section-seccion .item-list ul.pager li.pager-previous a').length > 0 || $('.section-seccion .item-list ul.pager li.pager-next a').length > 0){
    $('.section-seccion .item-list ul.pager li.pager-previous a').html('&laquo; anterior');
    $('.section-seccion .item-list ul.pager li.pager-next a').html('siguiente &raquo;');
  }
  
  $("#block-views-big_slideshow-block_1 ul").mouseover(function(){
    $(this).children('li').children('.views-field-name').css('display', 'block');
    $(this).children('li').children('.views-field-title').css('display', 'block');
  }).mouseout(function(){
    $(this).children('li').children('.views-field-name').css('display', 'none');
    $(this).children('li').children('.views-field-title').css('display', 'none');
  });
  
  
});