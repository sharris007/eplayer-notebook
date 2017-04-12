// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Editor = (function(_super) {
  __extends(Editor, _super);

  Editor.prototype.events = {
    'form submit': 'submit',
    '.annotator-save click': 'submit',
    '.annotator-cancel click': 'hide',
    '.annotator-cancel mouseover': 'onCancelButtonMouseover',
    'textarea keydown': 'processKeypress',
    '.annotator-color click':'onColorChange',
    '.annotator-share click':'onShareClick',
    '.annotator-confirm-delete click':'onDeleteClick',
    '.annotator-edit-container click':'onEditClick',
    '.annotator-listing textarea keyup':'onNoteChange',
    '.annotator-delete-container click':'onDeleteIconClick',
    '.annotator-confirm-cancel click':'onCancelClick'
  };

  Editor.prototype.classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
  };
  
  Editor.prototype.isShareable=null;
  Editor.prototype.textareaHeight=null;
  Editor.prototype.currentAnnotation=null;
  Editor.prototype.const={
    characters :3000
  }

  var panel1 = '<div class="annotator-panel-1 annotator-panel-triangle"><div class="annotator-color-container"><input type="button" class="annotator-color annotator-yellow" value="#FCF37F"/><input type="button" class="annotator-color annotator-green" value="#55DF49"/><input type="button" class="annotator-color annotator-pink" value="#FC92CF"/></div><div class="annotator-delete-container"></div><div class="annotator-edit-container"></div></div>'

  var panel2 ='<div class="annotator-panel-2"><ul class="annotator-listing"></ul></div>';

  var panel3 ='<div class="annotator-panel-3"><div class="annotator-controls"><div class="ann-share-section"><label class="annotator-share-text">Share</label><div class="annotator-share"></div></div><div class="ann-cancelsave-section"><a class="annotator-cancel">' + _t('CANCEL') + '</a><a class="annotator-save annotator-focus">' + _t('SAVE') + '</a></div></div></div>';

  var panel4 ='<div class="annotator-panel-4 annotator-panel-triangle"><div class="ann-confirm-section"><label class="annotator-confirm">Confirm?</label></div><div class="ann-canceldelete-section"><a class="annotator-confirm-cancel">' + _t('CANCEL') + '</a><a class="annotator-confirm-delete">' + _t('DELETE') + '</a></div></div></div>';

  var panel5 ='<li class="characters-left"><span id="letter-count">'+(Editor.prototype.const.characters)+'</span id="letter-text">  Characters left<span><span></li>';

  Editor.prototype.html = '<div class="annotator-outer annotator-editor hide-note"><form class="annotator-widget">'+panel1+ panel2+panel3+'</form></div>';
  
  Editor.prototype.options = {};

  function Editor(options) {
    this.onCancelButtonMouseover = __bind(this.onCancelButtonMouseover, this);
    this.processKeypress = __bind(this.processKeypress, this);
    this.submit = __bind(this.submit, this);
    this.load = __bind(this.load, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.onColorChange=__bind(this.onColorChange, this);
    this.onShareClick=__bind(this.onShareClick, this);
    this.onDeleteClick=__bind(this.onDeleteClick, this);
    this.onDeleteIconClick=__bind(this.onDeleteIconClick, this);
    this.onCancelClick=__bind(this.onCancelClick, this);
    this.onEditClick=__bind(this.onEditClick, this);
    this.onNoteChange=__bind(this.onNoteChange, this);
    Editor.__super__.constructor.call(this, $(this.html)[0], options);
    this.fields = [];
    this.annotation = {};
  }
  Editor.prototype.unShareAnnotation=function() {
    this.annotation.color=this.annotation.lastColor;
    this.annotation.shareable=false;
    $(this.annotation.highlights).css('background', this.annotation.color);
    $('.annotator-color').removeClass('active');
    $('.annotator-color[value="'+this.annotation.color+'"]').addClass('active');
    $('.annotator-color-container').removeClass('disabled-save');
  }
  Editor.prototype.onShareClick=function(event) {
    var that=this;
    this.fromOnShare=true;
    if ($(event.target).hasClass('on')) {
      $(event.target).removeClass('on');
      this.unShareAnnotation();
    }
    else {
      $(event.target).addClass('on');
      this.annotation.color='#ccf5fd';
      this.annotation.shareable=true;
      $('.annotator-color').removeClass('active');
      $(this.annotation.highlights).css('background', '#ccf5fd');
      $('.annotator-color-container').addClass('disabled-save');
    }
    setTimeout(function(){ that.submit(); }, 800);    
  }
  
  Editor.prototype.onDeleteClick=function(event) {  
    this.element.addClass(this.classes.hide);
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'), panel3Sec =  this.element.find('.annotator-panel-3'), panel4Sec = this.element.find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    this.element.addClass('hide-note')
    return $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [this.annotation]]);
  }
  Editor.prototype.onDeleteIconClick=function(event) {  
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'), panel3Sec =  this.element.find('.annotator-panel-3'), panel4Sec = this.element.find('.annotator-panel-4');
    if($(panel2Sec).find('textarea').val().trim()) {
        panel1Sec.addClass('hide-popup').after(panel4);
        panel4Sec.addClass('annotator-panel-triangle');
        panel2Sec.addClass('overlay');
        panel3Sec.addClass('overlay');
    }
    else {
        this.onDeleteClick(event);
    }
  }
  Editor.prototype.onCancelClick=function(event) {  
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'), panel3Sec =  this.element.find('.annotator-panel-3'), panel4Sec = this.element.find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
  }
  Editor.prototype.onEditClick=function(event) {  
    this.element.addClass('show-edit-options');
    this.element.find('textarea').css({'pointer-events':'all', 'opacity':'1'});
    this.element.find('input').css({'pointer-events':'all', 'opacity':'1'});
  }
  
  Editor.prototype.onNoteChange=function(event) {
    this.element[(event.target.value.length)?'addClass':'removeClass']('show-edit-options');
    if(!event.target.value.length){
      $(this.element).find('.annotator-share-text, .annotator-share').hide();
    }
    var inputCharLength = event.currentTarget.value.length, actualChar = this.const.characters;
    var remainingCount = actualChar-inputCharLength;
    this.element.find('#letter-count').text(remainingCount);
    var selectors = this.element.find('.annotator-item textarea'); 
    var temp = this.textareaHeight;
    this.textareaHeight = $('#annotator-field-0')[0].scrollHeight;
    if(temp!==this.textareaHeight) {
      selectors.height(this.textareaHeight);
      this.textareaHeight = $('#annotator-field-0')[0].scrollHeight; 
      var topPosition=(this.element.position().top) + (this.textareaHeight-temp);
      this.element.css({top:topPosition});
    }    
  }

  Editor.prototype.onColorChange=function(event) {
    window.getSelection().removeAllRanges();
    this.element.removeClass('hide-note');
    var isTopAlign=(!this.annotation.color)?true:false;
    if (this.annotation._id===undefined && this.currentAnnotation !== null) {     
      var curAnn =this.currentAnnotation;   
      Object.assign(this.annotation, curAnn);   
    }
    this.annotation.color=this.annotation.lastColor=event.target.value;
    $('.annotator-color').removeClass('active');
    $(event.target).addClass('active');
    $(this.annotation.highlights).css('background', event.target.value);
    if (isTopAlign) {
      var topPosition=this.element.position().top + this.element.find('form').height()-this.element.find('.annotator-panel-1').height();
      this.element.css({top:topPosition});
    }
    // this.publish('save', [this.annotation]);
    // if(isTopAlign)
    //    $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [this.annotation]]);
  }

  Editor.prototype.show = function(event) {
    Annotator.Util.preventEventDefault(event);
    this.element.removeClass(this.classes.hide);
    $(this.annotation.highlights).removeClass('current-annotation');
    if (!this.annotation.text || !this.annotation.text.length) $('.annotator-edit-container').hide();
    this.annotation.color=this.annotation.color||'';
    this.annotation.shareable=(this.annotation.shareable===undefined)?false:this.annotation.shareable;
    if (this.annotation.color||this.annotation.shareable) {
      this.element.removeClass('hide-note');
      var textareaScroll =this.element.find('textarea').prop('scrollHeight'),calPos,actualPos,oldHeight;
      oldHeight=this.element.find('textarea').height();
      this.element.find('textarea').height(textareaScroll);
      actualPos = this.element.position().top;
      pos  = (textareaScroll-oldHeight) + actualPos;
      this.element.css({top:pos});
    } 
    if (this.annotation.shareable) {
      $('.annotator-share').addClass('on');
      $('.annotator-color-container').addClass('disabled-save');
      if (!this.isShareable)
        $('.annotator-panel-1').addClass('disabled-save');
    }
    else {
      $('.annotator-share').removeClass('on');
      $('.annotator-color-container').removeClass('disabled-save'); 
    }
    $('.annotator-color').removeClass('active');
    $('.annotator-color[value="'+this.annotation.color+'"]').addClass('active');
    this.element.find('.annotator-save').addClass(this.classes.focus);
    this.element.find('.annotator-listing .characters-left').remove();
    this.element.find('.annotator-listing').append(panel5);
    $('#letter-count').text(3000-this.element.find('textarea').val().length);
    this.checkOrientation();
    this.textareaHeight = $('#annotator-field-0')[0].scrollHeight || 40; 
    if(!this.annotation.text || !this.annotation.text.length){
      this.element.find('textarea').css({'pointer-events':'all','opacity':'1'});
      this.element.find('input').css({'pointer-events':'all','opacity':'1'});
    }
    this.element.find(":input:first").focus();
    this.setupDraggables();
    return this.publish('show');
  };

  Editor.prototype.hide = function(event) {
    $(this.annotation.highlights).css('background', this.annotation.color);
    Annotator.Util.preventEventDefault(event);
    this.element.addClass(this.classes.hide);
    this.element.addClass('hide-note').removeClass('show-edit-options');
    $('.annotator-edit-container').show();
    $('.annotator-panel-1').removeClass('disabled-save');
    this.onCancelClick();
    this.element.find('textarea').removeAttr('style');
    this.element.find('input').removeAttr('style'); 
    this.currentAnnotation = this.textareaHeight = null;
    if(this.annotation.color && this.annotation.color.length)
      this.publish('save', [this.annotation]);
    return this.publish('hide');
  };
  Editor.prototype.hasClass=function(element, className) {
    do {
      if (element.classList && element.classList.contains(className)) {
        return true;
      }
      element = element.parentNode;
    } while (element);
    return false;
  }
  Editor.prototype.load = function(annotation, isShareable) {
    this.isShareable=isShareable;
    if (!isShareable || !annotation.id || !annotation.text)
      $('.annotator-share-text, .annotator-share').hide();
    else      
      $('.annotator-share-text, .annotator-share').show();
    if (!$('.annotator-item input').length) {
     $('.annotator-item').prepend('<input placeholder="Add title."/>');
    }
    if(this.hasClass(annotation.highlights[0], 'MathJax_Display')){
      $('.annotator-item input').show();
      if(!annotation.id){
          annotation.quote='';
      }
      $('.annotator-item input').val(annotation.quote);
    }else{
       $('.annotator-item input').hide()
    }
    var field, _i, _len, _ref;
    this.annotation = annotation;
    this.publish('load', [this.annotation]);
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.load(field.element, this.annotation);
    }
    return this.show();
  };

  Editor.prototype.submit = function(event) {
    var field, _i, _len, _ref;
    Annotator.Util.preventEventDefault(event);
    if (this.fromOnShare) {
      this.fromOnShare=false
    }else if (this.annotation.shareable) {
      $('.annotator-share').removeClass('on');
      this.unShareAnnotation();
    }
    this.annotation.quote=$('.annotator-item input').val();
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.submit(field.element, this.annotation);
    }
    $(this.annotation.highlights)[(this.element.find('textarea').val().length)?'addClass':'removeClass']('highlight-note');
    // this.publish('save', [this.annotation]);
    return this.hide();
  };

  Editor.prototype.addField = function(options) {
    var element, field, input;
    field = $.extend({
      id: 'annotator-field-' + Annotator.Util.uuid(),
      type: 'input',
      label: '',
      load: function() {},
      submit: function() {}
    }, options);
    input = null;
    element = $('<li class="annotator-item" />');
    field.element = element[0];
    switch (field.type) {
    case 'textarea':
      input = $('<textarea maxlength="3000"/>');
      break;
    case 'input':
    case 'checkbox':
      input = $('<input />');
      break;
    case 'select':
      input = $('<select />');
    }
    element.append(input);
    input.attr({
      id: field.id,
      placeholder: field.label
    });
    if (field.type === 'checkbox') {
      input[0].type = 'checkbox';
      element.addClass('annotator-checkbox');
      element.append($('<label />', {
        'for': field.id,
        html: field.label
      }));
    }
    this.element.find('ul:first').append(element);
    this.fields.push(field);
    return field.element;
  };

  Editor.prototype.checkOrientation = function() {
    var controls, list, panel3;
    Editor.__super__.checkOrientation.apply(this, arguments);
    list = this.element.find('ul');
    panel3 = this.element.find('.annotator-panel-3');
    controls = this.element.find('.annotator-controls');
    if (this.element.hasClass(this.classes.invert.y)) {
      panel3.html(controls);
    } else if (controls.is(':first-child')) {
      panel3.html(controls);
    }
    return this;
  };

  Editor.prototype.processKeypress = function(event) {
    if (event.keyCode === 27) {
      return this.hide();
    } else if (event.keyCode === 13 && !event.shiftKey) {
      return this.submit();
    }
  };

  Editor.prototype.onCancelButtonMouseover = function() {
    return this.element.find('.' + this.classes.focus).removeClass(this.classes.focus);
  };

  Editor.prototype.setupDraggables = function() {
    var classes, controls, cornerItem, editor, mousedown, onMousedown, onMousemove, onMouseup, resize, textarea, throttle;
    this.element.find('.annotator-resize').remove();
    if (this.element.hasClass(this.classes.invert.y)) {
      cornerItem = this.element.find('.annotator-item:last');
    } else {
      cornerItem = this.element.find('.annotator-item:first');
    }
    if (cornerItem) {
      $('<span class="annotator-resize"></span>').appendTo(cornerItem);
    }
    mousedown = null;
    classes = this.classes;
    editor = this.element;
    textarea = null;
    resize = editor.find('.annotator-resize');
    controls = editor.find('.annotator-controls');
    throttle = false;
    onMousedown = function(event) {
      if (event.target === this) {
        mousedown = {
          element: this,
          top: event.pageY,
          left: event.pageX
        };
        textarea = editor.find('textarea:first');
        $(window).bind({
          'mouseup.annotator-editor-resize': onMouseup,
          'mousemove.annotator-editor-resize': onMousemove
        });
        return event.preventDefault();
      }
    };
    onMouseup = function() {
      mousedown = null;
      return $(window).unbind('.annotator-editor-resize');
    };
    onMousemove = (function(_this) {
      return function(event) {
        var diff, directionX, directionY, height, width;
        if (mousedown && throttle === false) {
          diff = {
            top: event.pageY - mousedown.top,
            left: event.pageX - mousedown.left
          };
          if (mousedown.element === resize[0]) {
            height = textarea.height();
            width = textarea.width();
            directionX = editor.hasClass(classes.invert.x) ? -1 : 1;
            directionY = editor.hasClass(classes.invert.y) ? 1 : -1;
            textarea.height(height + (diff.top * directionY));
            textarea.width(width + (diff.left * directionX));
            if (textarea.height() !== height) {
              mousedown.top = event.pageY;
            }
            if (textarea.width() !== width) {
              mousedown.left = event.pageX;
            }
          } else if (mousedown.element === controls[0]) {
            editor.css({
              top: parseInt(editor.css('top'), 10) + diff.top,
              left: parseInt(editor.css('left'), 10) + diff.left
            });
            mousedown.top = event.pageY;
            mousedown.left = event.pageX;
          }
          throttle = true;
          return setTimeout(function() {
            return throttle = false;
          }, 1000 / 60);
        }
      };
    })(this);
    resize.bind('mousedown', onMousedown);
    return controls.bind('mousedown', onMousedown);
  };

  return Editor;

})(Annotator.Widget);

//# sourceMappingURL=editor.map
