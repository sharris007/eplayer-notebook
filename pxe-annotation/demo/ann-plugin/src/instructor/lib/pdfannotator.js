pdfAnnotatorInstance = function() {

var panel1 = '<div class="annotator-panel-1 annotator-panel-triangle"><div class="annotator-color-container"><input id="color-button-yellow" type="button" class="annotator-color annotator-yellow" value="#FFD232"/><input id="color-button-green" type="button" class="annotator-color annotator-green" value="#55DF49"/><input id="color-button-pink" type="button" class="annotator-color annotator-pink" value="#FC92CF"/></div><div id="deleteIcon" class="annotator-delete-container"></div><div id="editIcon" class="annotator-edit-container"></div></div>'

var panel2 ='<div class="annotator-panel-2"><ul class="annotator-listing"><li class="annotator-item"><textarea maxlength="3000" id="annotator-field-0" placeholder="Write a note." style="pointer-events: all; opacity: 1;"></textarea></li></ul></div>';

var panel3 ='<div class="annotator-panel-3"><div class="annotator-controls"><div class="ann-share-section"><label class="annotator-share-text">Share</label><div class="annotator-share"></div></div><div class="ann-cancelsave-section"><a id="cancel-saving" class="annotator-cancel">CANCEL</a><a id="save-annotation" class="annotator-save annotator-focus">SAVE</a></div></div></div>';

var panel4 ='<div class="annotator-panel-4 annotator-panel-triangle"><div class="ann-confirm-section"><label class="annotator-confirm">Confirm?</label></div><div class="ann-canceldelete-section"><a id="ann-confirm-cancel" class="annotator-confirm-cancel">CANCEL</a><a id="ann-confirm-del" class="annotator-confirm-delete">DELETE</a></div></div></div>';

var panel5 ='<li class="characters-left"><span id="letter-count">3000</span id="letter-text">  Characters left<span><span></li>';
        
var htmlElements = '<div class="annotator-outer annotator-editor hide-note"><form class="annotator-widget">'+panel1+ panel2+panel3+'</form></div>';

var annotatorCallbacks = {

};
var currentHighlight;
function showCreateHighlightPopup(currHighLightdata,coord,saveHighlightCallback,targetElement)
{
   try{
        document.getElementById('openPopupHighlight').remove();
      }
   catch(e)
      {

      }
   coord.left = coord.left + (coord.width * 1.5);
   coord.top = coord.top + (coord.height * 1.5);
   var id = 'openPopupHighlight';
   var parentElement = document.createElement('div');
   parentElement.setAttribute('id', id);
   parentElement.style.left = coord.left+"px";
   parentElement.style.top = coord.top+"px";
   parentElement.style.width = coord.width+"px";
   parentElement.style.height = coord.height+"px";
   parentElement.style.position = "absolute";
   parentElement.innerHTML  = htmlElements;
   var parentPageElement = document.getElementById(targetElement);  
   parentPageElement.appendChild(parentElement);
   annotatorCallbacks.saveHighlightCallback = saveHighlightCallback;
   currentHighlight = currHighLightdata;
   $("#color-button-yellow, #color-button-green, #color-button-pink").on('click',function(e){
         onColorChange(e);
   });
   $("#annotator-field-0").on('input',function(e){
         onNoteChange(e);
   });
   $("#deleteIcon").on('click',function(e){
         onDeleteIconClick();
   });
   $("#editIcon").on('click',function(e){
         onEditClick();
   });
   $("#cancel-saving").on('click',function(e){
         hide();
   });
   $("#save-annotation").on('click',function(e){
         onSaveClick()
   });
   /*$(document).click(function(e) {
    if ((e.keyCode === 27 ||!$(e.target).closest('.annotator-editor').length) && !$('.annotator-editor').hasClass('annotator-hide')) {
      hide();
    }
   });*/
}
var classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
};
var textareaHeight = null;
var currHighlightColor;
var currHighlightColorCode
function onColorChange(event)
{
   currHighlightColorCode = event.currentTarget.value;
   var colorBtnId = event.currentTarget.id;
   if(colorBtnId=="color-button-pink")
   {
      currHighlightColor = "pink";
   }
   else if(colorBtnId=="color-button-green")
   {
      currHighlightColor = "green";
   }
   else if(colorBtnId=="color-button-yellow")
   {
      currHighlightColor = "yellow";
   }
   $(".annotator-editor").removeClass("hide-note");
   $('.annotator-color').removeClass('active');
   $(event.target).addClass('active');
   $('#openPopupHighlight').find('.annotator-listing .characters-left').remove();
   $('#openPopupHighlight').find('.annotator-listing').append(panel5);
   $('#letter-count').text(3000-$('#openPopupHighlight').find('textarea').val().length);
}

function onDeleteClick()
{  
    if(annotatorCallbacks.deleteHighlightCallback!=undefined) {
        annotatorCallbacks.deleteHighlightCallback(currentHighlight.id);
    }
    $('#openPopupHighlight').addClass(classes.hide);
    var panel1Sec =  $('#openPopupHighlight').find('.annotator-panel-1'), panel2Sec =  $('#openPopupHighlight').find('.annotator-panel-2'), panel3Sec =  $('#openPopupHighlight').find('.annotator-panel-3'), panel4Sec = $('#openPopupHighlight').find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    $('#openPopupHighlight').addClass('hide-note')
}

function onDeleteIconClick()
{  
    var panel1Sec =  $('#openPopupHighlight').find('.annotator-panel-1'), panel2Sec =  $('#openPopupHighlight').find('.annotator-panel-2'), panel3Sec =  $('#openPopupHighlight').find('.annotator-panel-3'), panel4Sec = $('#openPopupHighlight').find('.annotator-panel-4');
    if($(panel2Sec).find('textarea').val().trim()) {
        panel1Sec.addClass('hide-popup').after(panel4);
        panel4Sec.addClass('annotator-panel-triangle');
        panel2Sec.addClass('overlay');
        panel3Sec.addClass('overlay');
         $("#ann-confirm-cancel").on('click',function(e){
         onCancelClick();
         });
         $("#ann-confirm-del").on('click',function(e){
         onDeleteClick();
         });
    }
    else {
        onDeleteClick();
    }
}

function hide()
{ 
   $('#openPopupHighlight').addClass(classes.hide);
   $('#openPopupHighlight').addClass('hide-note').removeClass('show-edit-options');
   $('.annotator-edit-container').show();
   $('.annotator-panel-1').removeClass('disabled-save');
   onCancelClick();
}

function onEditClick() 
{  
    $('#openPopupHighlight').addClass('show-edit-options');
    $('#openPopupHighlight').find('textarea').show();
    $('#openPopupHighlight').find('#noteContainer').hide();
    $('#openPopupHighlight').find('textarea').css({'pointer-events':'all', 'opacity':'1'});
    $('#openPopupHighlight').find('input').css({'pointer-events':'all', 'opacity':'1'});
}

function onCancelClick()
{  
    var panel1Sec =  $('#openPopupHighlight').find('.annotator-panel-1'), panel2Sec =  $('#openPopupHighlight').find('.annotator-panel-2'), panel3Sec =  $('#openPopupHighlight').find('.annotator-panel-3'), panel4Sec = $('#openPopupHighlight').find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
}

function onSaveClick()
{
   var noteText = document.getElementById('annotator-field-0').value;
   const highLightMetadata = {
      currHighlightColor:currHighlightColor,
      currHighlightColorCode:currHighlightColorCode,
      noteText:noteText
   };
   annotatorCallbacks.saveHighlightCallback(currentHighlight,highLightMetadata);
   hide();
}

function onNoteChange(event) {
    var characters = 3000;
    $('#openPopupHighlight').addClass('show-edit-options');
    if(!event.target.value.length){
      $('#openPopupHighlight').find('.annotator-share-text, .annotator-share').hide();
    }
    var inputCharLength = event.currentTarget.value.length, actualChar = characters;
    var remainingCount = actualChar-inputCharLength;
    $('#openPopupHighlight').find('#letter-count').text(remainingCount);
    var selectors = $('#openPopupHighlight').find('.annotator-item textarea'); 
    var temp = textareaHeight;
    textareaHeight = $('#annotator-field-0')[0].scrollHeight;
    if(temp!==textareaHeight) {
      selectors.height(textareaHeight);
      textareaHeight = $('#annotator-field-0')[0].scrollHeight; 
      var topPosition=($('#openPopupHighlight').position().top) + (textareaHeight-temp);
      $('#openPopupHighlight').css({top:topPosition});
    }    
 }

 function showSelectedHighlight(highLightData,editHighlightCallback,deleteHighlightCallback,targetElement)
 {
  var parentHighlightElement = $('#'+highLightData.id);
  var childHighlightElement = parentHighlightElement[0].firstChild;
  const coord = {
    left:childHighlightElement.offsetLeft,
    top:childHighlightElement.offsetTop,
    width:childHighlightElement.offsetWidth,
    height:childHighlightElement.offsetHeight
  };
  try{
      document.getElementById('openPopupHighlight').remove();
  }
  catch(e) {

  }
   coord.left = coord.left + (coord.width * 1.5);
   coord.top = coord.top + (coord.height * 1.5);
   var id = 'openPopupHighlight';
   var parentElement = document.createElement('div');
   parentElement.setAttribute('id', id);
   parentElement.style.left = coord.left+"px";
   parentElement.style.top = coord.top+"px";
   parentElement.style.width = coord.width+"px";
   parentElement.style.height = coord.height+"px";
   parentElement.style.position = "absolute";
   parentElement.innerHTML  = htmlElements;
   var parentPageElement = document.getElementById(targetElement);  
   parentPageElement.appendChild(parentElement);
   annotatorCallbacks.editHighlightCallback = editHighlightCallback;
   annotatorCallbacks.deleteHighlightCallback = deleteHighlightCallback;
   currentHighlight = highLightData;
   $("#color-button-yellow, #color-button-green, #color-button-pink").on('click',function(e){
         onColorChange(e);
   });
   $("#annotator-field-0").on('input',function(e){
         onNoteChange(e);
   });
   $("#deleteIcon").on('click',function(e){
         onDeleteIconClick();
   });
   $("#editIcon").on('click',function(e){
         onEditClick();
   });
   $("#cancel-saving").on('click',function(e){
         hide();
   });
   $("#save-annotation").on('click',function(e){
         onSaveClick()
   });
  //showCreateHighlightPopup(highLightData,highLightcordinates,saveHighlightCallback,targetElement);
  highLightData.shared = true;
  $('#openPopupHighlight').removeClass(classes.hide);
  if (!highLightData.note || !highLightData.note.length) 
  {
      $('.annotator-edit-container').hide();
  }
  if(highLightData.colour || highLightData.shared)
  {
    $('.annotator-editor').removeClass('hide-note');
    var textareaScroll = $('#openPopupHighlight').find('textarea').prop('scrollHeight'),calPos,actualPos,oldHeight;
    oldHeight=$('#openPopupHighlight').find('textarea').height();
    $('#openPopupHighlight').find('textarea').height(textareaScroll);
    actualPos = $('#openPopupHighlight').position().top;
    pos  = (textareaScroll-oldHeight) + actualPos;
    $('#openPopupHighlight').css({top:pos});
  } 
  $('.annotator-color').removeClass('active');
  $('#color-button-'+highLightData.colour).addClass('active');
  $('#openPopupHighlight').find('.annotator-save').addClass(classes.focus);
  $('#openPopupHighlight').find('.annotator-listing .characters-left').remove();
  $('#openPopupHighlight').find('.annotator-listing').append(panel5);
  $('#annotator-field-0').val(highLightData.note);
  $('#letter-count').text(3000-$('#openPopupHighlight').find('textarea').val().length);
  textareaHeight = $('#annotator-field-0')[0].scrollHeight || 40; 
  if(!highLightData.note || !highLightData.note.length){
    $('#openPopupHighlight').find('textarea').css({'pointer-events':'all','opacity':'1'});
    $('#openPopupHighlight').find('input').css({'pointer-events':'all','opacity':'1'});
  }
  $('#openPopupHighlight').find(":input:first").focus();
  /*if($('#openPopupHighlight').find('textarea').val().length > 0) {
    $($('#openPopupHighlight')).find('#noteContainer').html(linkifyStr($('#openPopupHighlight').find('textarea').val()));
    $($('#openPopupHighlight').find('textarea')).hide();
    $($('#openPopupHighlight')).find('#noteContainer').show();
  } else {
    $($('#openPopupHighlight').find('textarea')).show();
    $($('#openPopupHighlight')).find('#noteContainer').hide();
  }*/
  $($('#openPopupHighlight')).find('#noteContainer').html(linkifyStr($('#openPopupHighlight').find('textarea').val()));
  $($('#openPopupHighlight').find('textarea')).show();
  $($('#openPopupHighlight')).find('#noteContainer').show();
 }
 return {
    showCreateHighlightPopup:showCreateHighlightPopup,
    hide:hide,
    showSelectedHighlight:showSelectedHighlight
 }
}();