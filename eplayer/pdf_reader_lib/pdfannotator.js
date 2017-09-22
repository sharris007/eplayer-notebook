/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
pdfAnnotatorInstance = function() {

var panel1 = '<div class="annotator-panel-1 annotator-panel-triangle"><div class="annotator-color-container"><input id="color-button-yellow" type="button" class="annotator-color annotator-yellow" value="#FFD232"/><input id="color-button-green" type="button" class="annotator-color annotator-green" value="#55DF49"/><input id="color-button-pink" type="button" class="annotator-color annotator-pink" value="#FC92CF"/></div><div id="deleteIcon" class="annotator-delete-container"></div><div id="editIcon" class="annotator-edit-container"></div></div>'

var panel2 ='<div class="annotator-panel-2"><ul class="annotator-listing"><li class="annotator-item"><textarea maxlength="3000" id="note-text-area" placeholder="Write a note." style="pointer-events: all; opacity: 1; max-height:75px; min-height:75px; resize:none"></textarea></li></ul></div>';

var panel3 ='<div class="annotator-panel-3"><div class="annotator-controls"><div class="ann-share-section"><label id="share-text" class="annotator-share-text">Share</label><div id="ann-share" class="annotator-share"></div></div><div class="ann-cancelsave-section"><a id="cancel-saving" class="annotator-cancel">CANCEL</a><a id="save-annotation" class="annotator-save annotator-focus">SAVE</a></div></div></div>';

var panel4 ='<div class="annotator-panel-4 annotator-panel-triangle"><div class="ann-confirm-section"><label id="label-confirm" class="annotator-confirm">Confirm?</label></div><div class="ann-canceldelete-section"><a id="ann-confirm-cancel" class="annotator-confirm-cancel">CANCEL</a><a id="ann-confirm-del" class="annotator-confirm-delete">DELETE</a></div></div></div>';

var panel5 ='<li class="characters-left" style="visibility:hidden"><span id="letter-count">3000</span id="letter-text"> Characters left<span><span></li>';
        
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
var notesMessages;
var isPopupOpen = false;
var userRoleTypeID = 0;
var userCourseID = 0;
function init()
{
  $("body").mousedown(function(e) {
    if(isPopupOpen)
    {
        if ($(e.target).parents("#root").length
              && $(e.target).parents("#openPopupHighlight").length == 0
              && $('#openPopupHighlight').is(':visible'))
                
        { 
            hide();
        }
    }
  });
  $(document).on('keyup',function(evt) {
    if (evt.keyCode === 27 && $('#openPopupHighlight').is(':visible')) {
        hide();
    }
  });
}

function showCreateHighlightPopup(currHighLightdata,coord,saveHighlightCallback,editHighlightCallback,targetElement,NotesMessages,roleTypeID,courseID)
{
   try{
        document.getElementById('openPopupHighlight').remove();
      }
   catch(e)
      {

      }
   var pageLeft = $("#docViewer_ViewContainer").offset().left;
   var pageWidth = $("#docViewer_ViewContainer").width();
   notesMessages=NotesMessages;
   coord.left = (pageLeft + pageWidth) - ($(".fwr-page").offset().left + 287);
   //coord.left = coord.left + (coord.width * 1.5);
   //coord.top = coord.top + (coord.height * 1.5);
   coord.top = (coord.top + document.getElementsByClassName('headerBar')[0].clientHeight) - 20;
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
   annotatorCallbacks.editHighlightCallback = editHighlightCallback;
   currentHighlight = currHighLightdata;
   isShared = false;
   isEditMode = false;
   isAlignReq = true;
   isPopupOpen = true;
   userRoleTypeID = roleTypeID;
   userCourseID = courseID;
   $("#color-button-yellow, #color-button-green, #color-button-pink").on('click',function(e){
         onColorChange(e);
   });
   $("#note-text-area").on('input',function(e){
         onNoteChange(e);
   });
   $("#note-text-area").on('click',function(e){
        $("#note-text-area").focus();
   });
   $("#deleteIcon").on('click',function(e){
         onDeleteIconClick();
         document.getElementById("label-confirm").innerHTML=notesMessages.messages.confirm;
         document.getElementById("ann-confirm-cancel").innerHTML=notesMessages.messages.cancel;
         document.getElementById("ann-confirm-del").innerHTML=notesMessages.messages.delete;
   });
   $("#editIcon").on('click',function(e){
         onEditClick();
   });
   $("#cancel-saving").on('click',function(e){
         hide();
   });
   $("#save-annotation").on('click',function(e){
         onSaveClick(false);
   });
   $("#ann-share").on('click',function(e){
         onShareClick(e)
   });
   $('.annotator-edit-container').hide();
   textareaHeight = $('#note-text-area')[0].scrollHeight || 40; 
   $(popupElementId).find('.annotator-share-text, .annotator-share').hide();
   document.getElementById("note-text-area").placeholder=notesMessages.messages.writeNote;
   document.getElementById("cancel-saving").innerHTML=notesMessages.messages.cancel;
   document.getElementById("save-annotation").innerHTML=notesMessages.messages.save;
   document.getElementById("share-text").innerHTML=notesMessages.messages.share;
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
   if($( "#annotator-outer-id" ).hasClass("hide-note"))
   {
    saveHighlight();
   }
   else
   {
    onSaveClick(true);
   }
   $(".annotator-editor").removeClass("hide-note");
   $('.annotator-color').removeClass('active');
   $(event.target).addClass('active');
   $(popupElementId).find('.annotator-listing .characters-left').remove();
   //$(popupElementId).find('.annotator-listing').append(panel5);
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
   var formWidth = $(".annotator-widget").width();
   var pdfPageTop = $("#docViewer_ViewContainer_BG_0").offset().top;
   var pdfPageheight = $("#docViewer_ViewContainer_BG_0").height();
   //Reverting changes made for ETEXT-3966
  /* var pdfPageWidth = $("#docViewer_ViewContainer_BG_0").width();
   var containerWidth = $("#docViewer_ViewContainer").width();
   var scrollBarWidth = $(".fwrJspVerticalBar").width();*/
   pdfPageheight = pdfPageheight + pdfPageTop;
   if((formTop+formHeight)>pdfPageheight)
   {
    formTop = pdfPageheight - formHeight;
    $(".annotator-widget").offset({top:formTop,left:formLeft});
    $(".annotator-widget").width(formWidth);
    $(".annotator-widget").height(formHeight);
   }
   //Reverting changes made for ETEXT-3966
   /*if((1.5*formWidth + pdfPageWidth) >= containerWidth){
    if($(".annotator-handle").length > 0){
      $(".annotator-widget").offset({left: $(".annotator-handle").offset().left - formWidth});
    }else{
      $(".annotator-widget").offset({left: $(".fwrJspPane").width() - formWidth});
    }
  }else{
     if($(".annotator-handle").length > 0){
      $(".annotator-widget").offset({left: $(".annotator-handle").offset().left + $(".annotator-handle").width()});
    }
  }*/
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
    $(popupElementId).addClass('hide-note');
    isPopupOpen = false;
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
    if($(popupElementId).find('textarea').val().length && userRoleTypeID == 3 && userCourseID !=-1){
      $(popupElementId).find('.annotator-share-text, .annotator-share').show();
    }
    else {
     $(popupElementId).find('.annotator-share-text, .annotator-share').hide();
    }
    isEditMode = true;
}

function onCancelClick()
{  
    var panel1Sec =  $(popupElementId).find('.annotator-panel-1'), panel2Sec =  $(popupElementId).find('.annotator-panel-2'), panel3Sec =  $(popupElementId).find('.annotator-panel-3'), panel4Sec = $(popupElementId).find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    isPopupOpen = false;
}
function setCurrentHighlight(highLightData)
{
  currentHighlight = highLightData;
}
function saveHighlight()
{
   var noteText = '';
   var highLightMetadata = {
      currHighlightColor:currHighlightColor,
      currHighlightColorCode:currHighlightColorCode,
      noteText:noteText,
      isShared:isShared
   };
   annotatorCallbacks.saveHighlightCallback(currentHighlight,highLightMetadata); 
}
function onSaveClick(isColorIconClkd)
{
    var highLightMetadata = {

    };
    var noteText;
    if(isColorIconClkd)
    {
      if(currHighlightColor!=undefined)
      {
        highLightMetadata.currHighlightColor = currHighlightColor;
      }
    }
    else
    {
      noteText = document.getElementById('note-text-area').value;
      highLightMetadata.currHighlightColor = currHighlightColor;
      highLightMetadata.isShared = isShared;
      highLightMetadata.noteText = noteText;
    }
    annotatorCallbacks.editHighlightCallback(currentHighlight.id,highLightMetadata);
    if(!isColorIconClkd)
    {
      hide();
    }
}

function onNoteChange(event) {
    var characters = 3000;
    if(isEditMode)
    {
      $(popupElementId).addClass('show-edit-options');
      if(userRoleTypeID==3 && userCourseID !=-1) {
        $(popupElementId).find('.annotator-share-text, .annotator-share').show();
      }
      else {
        $(popupElementId).find('.annotator-share-text, .annotator-share').hide();
      }
    }
    else
    {
      if(event.target.value.length){
        $(popupElementId).addClass('show-edit-options');
      }
      else
      {
        $(popupElementId).removeClass('show-edit-options');
      }
      if(userRoleTypeID==3 && userCourseID !=-1 && event.target.value.length) {
        $(popupElementId).find('.annotator-share-text, .annotator-share').show();
      }
      else {
        $(popupElementId).find('.annotator-share-text, .annotator-share').hide();
      }
    }
    /*var charLeft=notesMessages.messages.charactersLeft;
    var inputCharLength = event.currentTarget.value.length, actualChar = characters;
    var remainingCount = actualChar-inputCharLength;
    $(popupElementId).find('#letter-text').text(charLeft);
    $(popupElementId).find('#letter-count').text(remainingCount);
    var selectors = $(popupElementId).find('.annotator-item textarea'); 
    var temp = textareaHeight;
    textareaHeight = $('#note-text-area')[0].scrollHeight;
    if(temp!==textareaHeight) {
      selectors.height(textareaHeight);
      textareaHeight = $('#note-text-area')[0].scrollHeight; 
      var topPosition=($(popupElementId).position().top) + (textareaHeight-temp);
      $(popupElementId).css({top:topPosition});
    }   */ 
 }
 function onShareClick(event)
 {
    if ($(event.target).hasClass('on')) {
      $(event.target).removeClass('on');
      isShared = false;
      $("#color-button-yellow").prop("disabled", false);
      $("#color-button-green").prop("disabled", false);
      $("#color-button-pink").prop("disabled", false);
      $("#color-button-yellow").css({'background':'#ffd232'});
      $("#color-button-green").css({'background':'#55df49'});
      $("#color-button-pink").css({'background':'#fc92cf'});
      $('#color-button-'+currHighlightColor).addClass('active');
    }
    else {
      $(event.target).addClass('on');
      isShared=true;
      $("#color-button-yellow").prop("disabled", true);
      $("#color-button-green").prop("disabled", true);
      $("#color-button-pink").prop("disabled", true);
      $("#color-button-yellow").css({'background':'#fff1c1'});
      $("#color-button-green").css({'background':'#CCF5C8'});
      $("#color-button-pink").css({'background':'#FEDEF0'});
      $('.annotator-color').removeClass('active');
    }
 }
 function showSelectedHighlight(highLightData,editHighlightCallback,deleteHighlightCallback,targetElement,NotesMessages,roleTypeID,cornerFoldedImageTop,courseID)
 {
  var parentHighlightElement = $('#'+highLightData.id);
  /*  var lastChildElementindex = parentHighlightElement[0].children.length - 1
  var childHighlightElement = parentHighlightElement[0].children[lastChildElementindex];*/
  var childHighlightElement = parentHighlightElement[0].children[0];
  var notesMessages=NotesMessages;
  var coord = {
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
   coord.left = (pageLeft + pageWidth) - ($(".fwr-page").offset().left + 287);
   //coord.top = coord.top + (coord.height * 1.5);
   coord.top = (coord.top + document.getElementsByClassName('headerBar')[0].clientHeight) - 20;
   if(cornerFoldedImageTop!==undefined)
   {
     coord.top = (cornerFoldedImageTop + document.getElementsByClassName('headerBar')[0].clientHeight) - 20;
   }
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
   userRoleTypeID = roleTypeID;
   userCourseID = courseID;
   $("#color-button-yellow, #color-button-green, #color-button-pink").on('click',function(e){
         onColorChange(e);
   });
   $("#note-text-area").on('input',function(e){
         onNoteChange(e);
   });
   $("#note-text-area").on('click',function(e){
        $("#note-text-area").focus();
   });
   $("#deleteIcon").on('click',function(e){
         onDeleteIconClick();
         document.getElementById("label-confirm").innerHTML=notesMessages.messages.confirm;
         document.getElementById("ann-confirm-cancel").innerHTML=notesMessages.messages.cancel;
         document.getElementById("ann-confirm-del").innerHTML=notesMessages.messages.delete;
   });
   $("#editIcon").on('click',function(e){
         onEditClick();
         document.getElementById("cancel-saving").innerHTML=notesMessages.messages.cancel;
   });
   $("#cancel-saving").on('click',function(e){
         hide();
   });
   $("#save-annotation").on('click',function(e){
         onSaveClick(false);
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
     $('.annotator-item').prepend('<div class="noteContainer" id = "noteContainer" style="height:100px;"></div>');
  }
  $('.annotator-color').removeClass('active');
  if (!highLightData.shared)
  {
    $('#color-button-'+highLightData.color).addClass('active');
  }
  currHighlightColor = highLightData.color;
  currHighlightColorCode = $('#color-button-'+highLightData.color).val();
  $(popupElementId).find('.annotator-save').addClass(classes.focus);
  $(popupElementId).find('.annotator-listing .characters-left').remove();
  //$(popupElementId).find('.annotator-listing').append(panel5);
  $('#note-text-area').val(highLightData.comment);
  $('#letter-count').text(3000-$(popupElementId).find('textarea').val().length);
  textareaHeight = $('#note-text-area')[0].scrollHeight || 40; 
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
  isPopupOpen = true;
  document.getElementById("share-text").innerHTML=notesMessages.messages.share;
  document.getElementById("save-annotation").innerHTML=notesMessages.messages.save;
  alignPopup();
  $(popupElementId).find('.annotator-share-text, .annotator-share').hide();
  if(userRoleTypeID == 2 && highLightData.shared)
  {
     //$(popupElementId).find('.annotator-panel-1, .annotator-panel-triangle').hide();
     $(popupElementId).removeClass('show-edit-options');
     //$(popupElementId).find('.annotator-share-text, .annotator-share').hide();
     $(popupElementId).find('.characters-left').css({'visibility':'hidden'});
     $("#color-button-yellow").prop("disabled", true);
     $("#color-button-green").prop("disabled", true);
     $("#color-button-pink").prop("disabled", true);
     $("#color-button-yellow").css({'background':'#fff1c1'});
     $("#color-button-green").css({'background':'#CCF5C8'});
     $("#color-button-pink").css({'background':'#FEDEF0'});
     //$("#deleteIcon").prop("disabled", true);
     //$("#editIcon").prop("disabled", true);
     $('.annotator-edit-container').hide();
     $('.annotator-delete-container').hide();
  }
  else if (highLightData.shared)
  {
     $("#color-button-yellow").prop("disabled", true);
     $("#color-button-green").prop("disabled", true);
     $("#color-button-pink").prop("disabled", true);
     $("#color-button-yellow").css({'background':'#fff1c1'});
     $("#color-button-green").css({'background':'#CCF5C8'});
     $("#color-button-pink").css({'background':'#FEDEF0'});
  }
 }
 return {
    showCreateHighlightPopup:showCreateHighlightPopup,
    init:init,
    showSelectedHighlight:showSelectedHighlight,
    setCurrentHighlight:setCurrentHighlight
 }
}();