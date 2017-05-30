pdfAnnotatorInstance = function() {

var panel1 = '<div class="annotator-panel-1 annotator-panel-triangle"><div class="annotator-color-container"><input id="color-button-yellow" type="button" class="annotator-color annotator-yellow" value="#FFD232"/><input id="color-button-green" type="button" class="annotator-color annotator-green" value="#55DF49"/><input id="color-button-pink" type="button" class="annotator-color annotator-pink" value="#FC92CF"/></div><div id="deleteIcon" class="annotator-delete-container"></div><div id="editIcon" class="annotator-edit-container"></div></div>'

var panel2 ='<div class="annotator-panel-2"><ul class="annotator-listing"><li class="annotator-item"><textarea maxlength="3000" id="annotator-field-0" placeholder="Write a note." style="pointer-events: all; opacity: 1;"></textarea></li></ul></div>';

var panel3 ='<div class="annotator-panel-3"><div class="annotator-controls"><div class="ann-share-section"><label class="annotator-share-text">Share</label><div id="ann-share" class="annotator-share"></div></div><div class="ann-cancelsave-section"><a id="cancel-saving" class="annotator-cancel">CANCEL</a><a id="save-annotation" class="annotator-save annotator-focus">SAVE</a></div></div></div>';

var panel4 ='<div class="annotator-panel-4 annotator-panel-triangle"><div class="ann-confirm-section"><label class="annotator-confirm">Confirm?</label></div><div class="ann-canceldelete-section"><a id="ann-confirm-cancel" class="annotator-confirm-cancel">CANCEL</a><a id="ann-confirm-del" class="annotator-confirm-delete">DELETE</a></div></div></div>';

var panel5 ='<li class="characters-left" style="visibility:hidden"><span id="letter-count">3000</span id="letter-text">  Characters left<span><span></li>';
        
var htmlElements = '<div id="annotator-outer-id" class="annotator-outer annotator-editor hide-note"><form id="highlight-note-form" class="annotator-widget">'+panel1+ panel2+panel3+'</form></div>';

var annotatorCallbacks = {

};
var currentHighlight;
var classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
};
var textareaHeight = null;
var currHighlightColor;
var currHighlightColorCode;
var isShared;
var isEditMode;
var popupElementId = '#openPopupHighlight';
var isAlignReq;

function showCreateHighlightPopup(currHighLightdata,coord,saveHighlightCallback,targetElement)
{
   try{
        document.getElementById('openPopupHighlight').remove();
      }
   catch(e)
      {

      }
   var pageLeft = $("#docViewer_ViewContainer").offset().left;
   var pageWidth = $("#docViewer_ViewContainer").width();
   coord.left = (pageLeft + pageWidth) - (600);
   //coord.left = coord.left + (coord.width * 1.5);
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
   isShared = false;
   isEditMode = false;
   isAlignReq = true;
   $("#color-button-yellow, #color-button-green, #color-button-pink").on('click',function(e){
         onColorChange(e);
   });
   $("#annotator-field-0").on('input',function(e){
         onNoteChange(e);
   });
   $("#annotator-field-0").on('click',function(e){
        $("#annotator-field-0").focus();
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
   $("#ann-share").on('click',function(e){
         onShareClick(e)
   });
   /*$(document).click(function(e) {
    if ((e.keyCode === 27 ||!$(e.target).closest('.annotator-editor').length) && !$('.annotator-editor').hasClass('annotator-hide')) {
      hide();
    }
   });*/
}

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
   $(popupElementId).find('.annotator-listing .characters-left').remove();
   $(popupElementId).find('.annotator-listing').append(panel5);
   $('#letter-count').text(3000-$(popupElementId).find('textarea').val().length);
   if(isAlignReq)
   {
     var topPosition=$('#annotator-outer-id').position().top + $('#annotator-outer-id').find('form').height()-$('#annotator-outer-id').find('.annotator-panel-1').height();
     $('#annotator-outer-id').css({top:topPosition});
     isAlignReq = false;
   }
   alignPopup();
}
function alignPopup()
{
   var formTop = $(".annotator-widget").offset().top;
   var formLeft = $(".annotator-widget").offset().left;
   var formHeight = $(".annotator-widget").height();
   /*var formWidth = $(".annotator-widget").width();
   var navTop = $(".navigation").offset().top;
   var headbarHeight = $(".headerBar").height();
   var pageLeft = $("#docViewer_ViewContainer").offset().left;
   var pageWidth = $("#docViewer_ViewContainer").width();*/
   var pdfPageTop = $("#docViewer_ViewContainer_BG_0").offset().top;
   var pdfPageheight = $("#docViewer_ViewContainer_BG_0").height();
   pdfPageheight = pdfPageheight + pdfPageTop;
   if((formTop+formHeight)>pdfPageheight)
   {
    formTop = pdfPageheight - formHeight;
    $(".annotator-widget").offset({top:formTop,left:formLeft});
   }
   /*if(headbarHeight>formTop)
   {
    formTop = headbarHeight;
   } */
   /*else if((formTop+formHeight)>navTop)
   {
    formTop = navTop - formHeight ;
   }*/
   /*if((pageLeft+pageWidth) < (formLeft+formWidth))
   {
     formLeft = ((pageLeft+pageWidth) - formWidth);
   }
   else if(pageLeft > formLeft)
   {
     formLeft = pageLeft;
   }*/
   /*formLeft = (pageLeft + pageWidth) - (formWidth+5);
   $(".annotator-widget").offset({top:formTop,left:formLeft});
   $(".annotator-widget").width(formWidth);
   $(".annotator-widget").height(formHeight);*/
}

function onDeleteClick()
{  
    if(annotatorCallbacks.deleteHighlightCallback!=undefined) {
        annotatorCallbacks.deleteHighlightCallback(currentHighlight.id);
    }
    $(popupElementId).addClass(classes.hide);
    var panel1Sec =  $(popupElementId).find('.annotator-panel-1'), panel2Sec =  $(popupElementId).find('.annotator-panel-2'), panel3Sec =  $(popupElementId).find('.annotator-panel-3'), panel4Sec = $(popupElementId).find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    $(popupElementId).addClass('hide-note')
}

function onDeleteIconClick()
{  
    var panel1Sec =  $(popupElementId).find('.annotator-panel-1'), panel2Sec =  $(popupElementId).find('.annotator-panel-2'), panel3Sec =  $(popupElementId).find('.annotator-panel-3'), panel4Sec = $(popupElementId).find('.annotator-panel-4');
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
   $(popupElementId).addClass(classes.hide);
   $(popupElementId).addClass('hide-note').removeClass('show-edit-options');
   $('.annotator-edit-container').show();
   $('.annotator-panel-1').removeClass('disabled-save');
   onCancelClick();
}

function onEditClick() 
{  
    $(popupElementId).addClass('show-edit-options');
    $(popupElementId).find('textarea').show();
    $(popupElementId).find('#noteContainer').hide();
    $(popupElementId).find('textarea').css({'pointer-events':'all', 'opacity':'1'});
    $(popupElementId).find('input').css({'pointer-events':'all', 'opacity':'1'});
    isEditMode = true;
}

function onCancelClick()
{  
    var panel1Sec =  $(popupElementId).find('.annotator-panel-1'), panel2Sec =  $(popupElementId).find('.annotator-panel-2'), panel3Sec =  $(popupElementId).find('.annotator-panel-3'), panel4Sec = $(popupElementId).find('.annotator-panel-4') ;
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
      noteText:noteText,
      isShared:isShared
   };
   if(!isEditMode)
   {
    annotatorCallbacks.saveHighlightCallback(currentHighlight,highLightMetadata);
   }
   else
   {
    const highLightMetadata = {

    };
    if(currHighlightColor!=undefined)
    {
      highLightMetadata.currHighlightColor = currHighlightColor;
    }
    highLightMetadata.isShared = isShared;
    highLightMetadata.noteText = noteText;
    annotatorCallbacks.editHighlightCallback(currentHighlight.id,highLightMetadata);
   }
   hide();
}

function onNoteChange(event) {
    var characters = 3000;
    $(popupElementId).addClass('show-edit-options');
    if(!event.target.value.length){
      $(popupElementId).find('.annotator-share-text, .annotator-share').hide();
    }
    var inputCharLength = event.currentTarget.value.length, actualChar = characters;
    var remainingCount = actualChar-inputCharLength;
    $(popupElementId).find('#letter-count').text(remainingCount);
    var selectors = $(popupElementId).find('.annotator-item textarea'); 
    var temp = textareaHeight;
    textareaHeight = $('#annotator-field-0')[0].scrollHeight;
    if(temp!==textareaHeight) {
      selectors.height(textareaHeight);
      textareaHeight = $('#annotator-field-0')[0].scrollHeight; 
      var topPosition=($(popupElementId).position().top) + (textareaHeight-temp);
      $(popupElementId).css({top:topPosition});
    }    
 }
 function onShareClick(event)
 {
    if ($(event.target).hasClass('on')) {
      $(event.target).removeClass('on');
      isShared = false;
    }
    else {
      $(event.target).addClass('on');
      isShared=true;
    } 
 }
 function showSelectedHighlight(highLightData,editHighlightCallback,deleteHighlightCallback,targetElement)
 {
  var parentHighlightElement = $('#'+highLightData.id);
  var lastChildElementindex = parentHighlightElement[0].children.length - 1
  var childHighlightElement = parentHighlightElement[0].children[lastChildElementindex];
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
   //coord.left = coord.left + (coord.width * 1.5);
   var pageLeft = $("#docViewer_ViewContainer").offset().left;
   var pageWidth = $("#docViewer_ViewContainer").width();
   coord.left = (pageLeft + pageWidth) - (600);
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
   $("#annotator-field-0").on('click',function(e){
        $("#annotator-field-0").focus();
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
   $("#ann-share").on('click',function(e){
         onShareClick(e)
   });
  $(popupElementId).removeClass(classes.hide);
  if (!highLightData.comment || !highLightData.comment.length) 
  {
      $('.annotator-edit-container').hide();
  }
  if(highLightData.color || highLightData.shared)
  {
    $('.annotator-editor').removeClass('hide-note');
    var textareaScroll = $(popupElementId).find('textarea').prop('scrollHeight'),calPos,actualPos,oldHeight;
    oldHeight=$(popupElementId).find('textarea').height();
    $(popupElementId).find('textarea').height(textareaScroll);
    actualPos = $(popupElementId).position().top;
    pos  = (textareaScroll-oldHeight) + actualPos;
    $(popupElementId).css({top:pos});
  }
  isShared = highLightData.shared;
  isEditMode = false;
  if (highLightData.shared) {
      $('.annotator-share').addClass('on');
    }
    else {
      $('.annotator-share').removeClass('on'); 
    } 
  if (!$('.annotator-item input').length) {
     $('.annotator-item').prepend('<div class="noteContainer" id = "noteContainer"></div>');
  }
  $('.annotator-color').removeClass('active');
  $('#color-button-'+highLightData.color).addClass('active');
  currHighlightColor = highLightData.color;
  currHighlightColorCode = $('#color-button-'+highLightData.color).val();
  $(popupElementId).find('.annotator-save').addClass(classes.focus);
  $(popupElementId).find('.annotator-listing .characters-left').remove();
  $(popupElementId).find('.annotator-listing').append(panel5);
  $('#annotator-field-0').val(highLightData.comment);
  $('#letter-count').text(3000-$(popupElementId).find('textarea').val().length);
  textareaHeight = $('#annotator-field-0')[0].scrollHeight || 40; 
  if(!highLightData.comment || !highLightData.comment.length){
    $(popupElementId).find('textarea').css({'pointer-events':'all','opacity':'1'});
    $(popupElementId).find('input').css({'pointer-events':'all','opacity':'1'});
  }
  $(popupElementId).find(":input:first").focus();
  if($(popupElementId).find('textarea').val().length > 0) {
    $($(popupElementId)).find('#noteContainer').html(linkifyStr($(popupElementId).find('textarea').val()));
    $($(popupElementId).find('textarea')).hide();
    $($(popupElementId)).find('#noteContainer').show();
  } else {
    $($(popupElementId).find('textarea')).show();
    $($(popupElementId)).find('#noteContainer').hide();
  }
  var topPosition=$('#annotator-outer-id').position().top + $('#annotator-outer-id').find('form').height()-$('#annotator-outer-id').find('.annotator-panel-1').height();
  $('#annotator-outer-id').css({top:topPosition});
  isAlignReq = false;
  alignPopup();
 }
 return {
    showCreateHighlightPopup:showCreateHighlightPopup,
    hide:hide,
    showSelectedHighlight:showSelectedHighlight
 }
}();