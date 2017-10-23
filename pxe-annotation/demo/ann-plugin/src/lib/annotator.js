// Generated by CoffeeScript 1.7.1
var Annotator, g, _Annotator, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_Annotator = this.Annotator;
var language = window.annotationLocale || 'en-US';
Annotator = (function(_super) {
  __extends(Annotator, _super);

  Annotator.prototype.events = {
    ".annotator-adder click": "onAdderClick",
    ".annotator-adder mousedown": "onAdderMousedown",
    // ".annotator-hl mouseover": "onHighlightMouseover",
    ".annotator-hl click": "onHighlightClick"
    // ".annotator-hl mouseout": "startViewerHideTimer"
  };

  Annotator.prototype.html = {
    adder: '<div class="annotator-adder"><button>' + _t('Annotate') + '</button></div>',
    wrapper: '<div class="annotator-wrapper"></div>'
  };

  Annotator.prototype.options = {
    readOnly: false
  };

  Annotator.prototype.plugins = {};

  Annotator.prototype.isShareable = false;

  Annotator.prototype.editor = null;

  Annotator.prototype.viewer = null;

  Annotator.prototype.selectedRanges = null;

  Annotator.prototype.mouseIsDown = false;

  Annotator.prototype.selectedAnnArr = [];

  Annotator.prototype.ignoreMouseup = false;

  Annotator.prototype.viewerHideTimer = null;

  function Annotator(element, options) {
    this.onDeleteAnnotation = __bind(this.onDeleteAnnotation, this);
    this.onEditAnnotation = __bind(this.onEditAnnotation, this);
    this.onAdderClick = __bind(this.onAdderClick, this);
    this.onAdderMousedown = __bind(this.onAdderMousedown, this);
    this.onHighlightMouseover = __bind(this.onHighlightMouseover, this);
    this.onHighlightClick = __bind(this.onHighlightClick, this);    
    this.checkForEndSelection = __bind(this.checkForEndSelection, this);
    this.checkForStartSelection = __bind(this.checkForStartSelection, this);
    this.clearViewerHideTimer = __bind(this.clearViewerHideTimer, this);
    this.startViewerHideTimer = __bind(this.startViewerHideTimer, this);
    this.showViewer = __bind(this.showViewer, this);
    this.onEditorSubmit = __bind(this.onEditorSubmit, this);
    this.onEditorHide = __bind(this.onEditorHide, this);
    this.showEditor = __bind(this.showEditor, this);
    this.getSelectedAnnotations = __bind(this.getSelectedAnnotations, this);
    Annotator.__super__.constructor.apply(this, arguments);
    this.plugins = {};
    if (!Annotator.supported()) {
      return this;
    }
    if (!this.options.readOnly) {
      this._setupDocumentEvents();
    }
    this._setupWrapper()._setupViewer()._setupEditor();
    this._setupDynamicStyle();
    this.adder = $(this.html.adder).appendTo(this.wrapper).hide();
    Annotator._instances.push(this);
  }

  Annotator.prototype._setupWrapper = function() {
   // this.wrapper = $('<span class="annotation-wrapper"/>');
    //this.element.find('script').remove();
   this.element.addClass('annotation-wrapper');
   this.wrapper = this.element;
   return this;
  };

  Annotator.prototype._setupViewer = function() {
    this.viewer = new Annotator.Viewer({
      readOnly: this.options.readOnly
    });
    this.viewer.hide().on("edit", this.onEditAnnotation).on("delete", this.onDeleteAnnotation).addField({
      load: (function(_this) {
        return function(field, annotation) {
          if (annotation.text) {
            $(field).html(Util.escape(annotation.text));
          } else {
            $(field).html("<i>" + (_t('No Comment')) + "</i>");
          }
          return _this.publish('annotationViewerTextField', [field, annotation]);
        };
      })(this)
    }).element.appendTo(this.wrapper).bind({
      "mouseover": this.clearViewerHideTimer,
      "mouseout": this.startViewerHideTimer
    });
    return this;
  };

  Annotator.prototype._setupEditor = function() {
    this.editor = new Annotator.Editor();
    this.editor.hide().on('hide', this.onEditorHide).on('save', this.onEditorSubmit).addField({
      type: 'textarea',
      label: locale_data[language]['add_note'],
      load: function(field, annotation) {
        return $(field).find('textarea').val(annotation.text || '');
      },
      submit: function(field, annotation) {
        return annotation.text = $(field).find('textarea').val();
      }
    });
    this.editor.element.appendTo(this.wrapper);
    return this;
  };

  Annotator.prototype._setupDocumentEvents = function() {
    $(document).bind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    return this;
  };

  Annotator.prototype._setupDynamicStyle = function() {
    var max, sel, style, x;
    style = $('#annotator-dynamic-style');
    if (!style.length) {
      style = $('<style id="annotator-dynamic-style"></style>').appendTo(document.head);
    }
    sel = '*' + ((function() {
      var _i, _len, _ref, _results;
      _ref = ['adder', 'outer', 'notice', 'filter'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push(":not(.annotator-" + x + ")");
      }
      return _results;
    })()).join('');
    max = Util.maxZIndex($(document.body).find(sel));
    max = Math.max(max, 1000);
    style.text([".annotator-adder, .annotator-outer, .annotator-notice {", "  z-index: " + (20) + ";", "}", ".annotator-filter {", "  z-index: " + (20) + ";", "}"].join("\n"));
    return this;
  };

  Annotator.prototype.destroy = function() {
    var idx, name, plugin, _base, _ref;
    Annotator.__super__.destroy.apply(this, arguments);
    $(document).unbind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    $('#annotator-dynamic-style').remove();
    this.adder.remove();
    this.viewer.destroy();
    this.editor.destroy();
    this.wrapper.find('.annotator-hl').each(function() {
      $(this).contents().insertBefore(this);
      return $(this).remove();
    });
    this.wrapper.contents().insertBefore(this.wrapper);
    this.wrapper.remove();
    this.element.data('annotator', null);
    _ref = this.plugins;
    for (name in _ref) {
      plugin = _ref[name];
      if (typeof (_base = this.plugins[name]).destroy === "function") {
        _base.destroy();
      }
    }
    idx = Annotator._instances.indexOf(this);
    if (idx !== -1) {
      return Annotator._instances.splice(idx, 1);
    }
  };

  Annotator.prototype.getSelectedRanges = function() {
    var browserRange, i, normedRange, r, ranges, rangesToIgnore, selection, _i, _len;
    selection = Util.getGlobal().getSelection();
    ranges = [];
    rangesToIgnore = [];
    if (!selection.isCollapsed) {
      ranges = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = selection.rangeCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          r = selection.getRangeAt(i);
          browserRange = new Range.BrowserRange(r);
          normedRange = browserRange.normalize().limit(this.wrapper[0]);
          if (normedRange === null) {
            rangesToIgnore.push(r);
          }
          _results.push(normedRange);
        }
        return _results;
      }).call(this);
      selection.removeAllRanges();
    }
    for (_i = 0, _len = rangesToIgnore.length; _i < _len; _i++) {
      r = rangesToIgnore[_i];
      selection.addRange(r);
    }
    return $.grep(ranges, function(range) {
      if (range) {
        selection.addRange(range.toRange());
      }
      return range;
    });
  };

  Annotator.prototype.createAnnotation = function() {
    var annotation;
    annotation = {};
    this.publish('beforeAnnotationCreated', [annotation]);
    return annotation;
  };

  Annotator.prototype.setupAnnotation = function(annotation) {
    var e, normed, normedRanges, r, root, _i, _j, _len, _len1, _ref;
    root = this.wrapper[0];
    annotation.ranges || (annotation.ranges = this.selectedRanges);
    normedRanges = [];
    _ref = annotation.ranges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      r = _ref[_i];
      try {
        normedRanges.push(Range.sniff(r).normalize(root));
      } catch (_error) {
        e = _error;
        if (e instanceof Range.RangeError) {
          this.publish('rangeNormalizeFail', [annotation, r, e]);
        } else {
          throw e;
        }
      }
    }
    annotation.quote = annotation.quote||[];
    annotation.ranges = [];
    annotation.highlights = [];
    for (_j = 0, _len1 = normedRanges.length; _j < _len1; _j++) {
      normed = normedRanges[_j];
      normed.color=annotation.color;
      normed.note=annotation.text;
      if(Array.isArray(annotation.quote))annotation.quote.push($.trim(normed.text()));
      annotation.ranges.push(normed.serialize(this.wrapper[0], '.annotator-hl'));
      $.merge(annotation.highlights, this.highlightRange(normed));
    }
    if(Array.isArray(annotation.quote))annotation.quote = annotation.quote.join(' / ');
    $(annotation.highlights).data('annotation', annotation);
    $(annotation.highlights).attr('data-annotation-id', annotation.id);
    $(annotation.highlights).attr('data-ann-id', annotation.id);
    $(annotation.highlights).attr('shareable', annotation.shareable);
    annotation.createdTimestamp = new Date().toISOString();
    return annotation;
  };

  Annotator.prototype.updateAnnotation = function(annotation) {
    this.publish('beforeAnnotationUpdated', [annotation]);
    $(annotation.highlights).attr('data-annotation-id', annotation.id);
    this.publish('annotationUpdated', [annotation]);
    return annotation;
  };

  Annotator.prototype.deleteAnnotation = function(annotation) {
    var child, h, _i, _len, _ref;
    if (annotation.highlights != null) {
      $(annotation.highlights).find('.annotator-handle').each(function(i) {
        if($(this).closest('.annotator-hl').attr('shareable') != 'true') {
          $(this).remove();
        }
      });
      $('.annotator-handle').css({'margin-top' : '6px'});
      _ref = annotation.highlights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        if (!(h.parentNode != null)) {
          continue;
        }
        child = h.childNodes[0];
        $(h).replaceWith(h.childNodes);
      }
    }
    this.alignMathMlNote();
    this.alignNotes();
    this.publish('annotationDeleted', [annotation]);
    return annotation;
  };

  Annotator.prototype.shareAnnotations = function(isShareable) {
    return this.isShareable=isShareable;
  };

  Annotator.prototype.updateAnnotationId = function (annotation) {
     $('.annotator-hl').each(function() {
      if(Date.parse($(this).data("annotation").createdTimestamp) == annotation.createdTimestamp) {
        $(this).data("annotation").id=annotation.id;
        $(this).attr('data-ann-id', annotation.id);
      }
    })
  };

  Annotator.prototype.loadAnnotations = function(annotations, isUpdate) {
    var clone, loader;
    if (annotations == null) {
      annotations = [];
    }
    if(isUpdate){   
        this.editor.currentAnnotation=annotations[0];   
    }
    loader = (function(_this) {
      return function(annList) {
        var n, now, _i, _len;
        if (annList == null) {
          annList = [];
        }
        now = annList.splice(0, 10);
        for (_i = 0, _len = now.length; _i < _len; _i++) {
          n = now[_i];
          _this.setupAnnotation(n);
        }
        if (annList.length > 0) {
          return setTimeout((function() {
            return loader(annList);
          }), 10);
        } else {
          return _this.publish('annotationsLoaded', [clone]);
        }
      };
    })(this);
    clone = annotations.slice();
    loader(annotations);
    window.getSelection().removeAllRanges();
    var self = this;
    setTimeout(function(){
      self.alignNotes();
      self.alignMathMlNote();
    },1600)
    return this;
  };

  Annotator.prototype.dumpAnnotations = function() {
    if (this.plugins['Store']) {
      return this.plugins['Store'].dumpAnnotations();
    } else {
      console.warn(_t("Can't dump annotations without Store plugin."));
      return false;
    }
  };
  Annotator.prototype.alignMathMlNote =function(){
    
  };
  Annotator.prototype.alignNotes = function() {
    var notes=document.getElementsByClassName('annotator-handle');
    for (var i = 0; i<notes.length - 1; i++) {
      for(var j=i+1;j<notes.length;j++){
        var noteOne=notes[i];
        var noteTwo=notes[j];
        var noteOneBoundaries=notes[i].getBoundingClientRect();
        var noteTwoBoundaries=noteTwo.getBoundingClientRect();
        var overlapped=!(noteOneBoundaries.right < noteTwoBoundaries.left || 
                  noteOneBoundaries.left > noteTwoBoundaries.right || 
                  noteOneBoundaries.bottom < noteTwoBoundaries.top || 
                  noteOneBoundaries.top > noteTwoBoundaries.bottom);
        if(overlapped && $(noteOne).css('visibility')==='visible' && $(noteTwo).css('visibility')==='visible'){
          noteTwo.style.marginTop=parseInt($(noteTwo).css('margin-top'))+30 + 'px';
        }
      }
    }
  };
  
  Annotator.prototype.highlightRange = function(normedRange, cssClass) {
   var hl, node, white, _i, _len, _ref, _results, handle;
   if (cssClass == null) {
    cssClass = 'annotator-hl';
   }
   //if(normedRange.note && normedRange.note.length)
    cssClass+=" highlight-note";
   white = /^\s*$/;
   var annBgColor = '', noteIconBgColor = '', noteText = '';
   if(normedRange.color == '#FFD232') { //Yellow
      annBgColor = 'rgba(255,210,50,0.4)';
      noteIconBgColor = '#ffedad';
      noteText = 'Q';
   } else if (normedRange.color == '#55DF49') { //Green
      annBgColor = noteIconBgColor = '#bbf2b6';
      noteText = 'M';
   } else if (normedRange.color == '#FC92CF') { //Pink
      annBgColor = noteIconBgColor = '#fed3ec';
      noteText = 'O';
   } else if (normedRange.color == '#ccf5fd') { //Share(Blue)
      annBgColor = noteIconBgColor = '#ccf5fd';
      noteText = 'I';
   } else {
      annBgColor = noteIconBgColor = normedRange.color;
   }
   hl = $("<span class='" + cssClass + "' style=background:" + annBgColor + "></span>");
   handle=$("<span class='annotator-handle' style=background-color:" + noteIconBgColor + ">" + noteText +"</span>");
   _ref = normedRange.textNodes();
   _results = [];
   for (_i = 0, _len = _ref.length; _i < _len; _i++) {
     node = _ref[_i];
     if (!white.test(node.nodeValue)) {
      if(!$(node).closest('.annotator-handle').length) {
         _results.push($(node).wrapAll(hl).parent().prepend(handle).show()[0]);
         if($(node).closest('.pxereaderSearchHighlight').length > 0) {
           $(node).parent().find('.annotator-handle').text(noteText).css('background-color', normedRange.color);
         }
         handle='';
      }
     }
   }
   window.getSelection().removeAllRanges();
   window.getSelection().addRange(normedRange.toRange());
   this.alignMathMlNote();
   this.alignNotes();
   return _results;
 };

  Annotator.prototype.highlightRanges = function(normedRanges, cssClass) {
    var highlights, r, _i, _len;
    if (cssClass == null) {
      cssClass = 'annotator-hl';
    }
    highlights = [];
    for (_i = 0, _len = normedRanges.length; _i < _len; _i++) {
      r = normedRanges[_i];
      $.merge(highlights, this.highlightRange(r, cssClass));
    }
    return highlights;
  };

  Annotator.prototype.addPlugin = function(name, options) {
    var klass, _base;
    if (this.plugins[name]) {
      console.error(_t("You cannot have more than one instance of any plugin."));
    } else {
      klass = Annotator.Plugin[name];
      if (typeof klass === 'function') {
        this.plugins[name] = new klass(this.element[0], options);
        this.plugins[name].annotator = this;
        if (typeof (_base = this.plugins[name]).pluginInit === "function") {
          _base.pluginInit();
        }
      } else {
        console.error(_t("Could not load ") + name + _t(" plugin. Have you included the appropriate <script> tag?"));
      }
    }
    return this;
  };

  Annotator.prototype.showEditor = function(annotation, location, isAdderClick, event) {
    var height=0,annId = annotation?annotation.id:'',len;
    //len = $('span[data-ann-id='+annId+']').length;
    var annElement = $('span[data-ann-id='+annId+']')[0];
    if(annElement) {
      var noteIconHght=0;
      if($(annElement).find('.annotator-handle').length>0)
        noteIconHght = isNaN(parseInt($(annElement.innerHTML).css('margin-top')))?0:parseInt($(annElement.innerHTML).css('margin-top'));
      height = $(annElement).offset().top+noteIconHght;
    }
    else
      height = location.top + 30;
    var selctionOverlap = window.getSelection().getRangeAt(0), position;
    var iscolorPanel = $(selctionOverlap.startContainer).hasClass('annotator-color-container');
    if (iscolorPanel && isAdderClick == false && $('.annotator-editor .annotator-panel-2 .annotator-listing').css('display') == 'none')
      isAdderClick = true;
    position = {
      top: height
    }
    
    this.editor.element.css(position);
    this.editor.load(annotation,this.isShareable,height, event);
    this.publish('annotationEditorShown', [this.editor, annotation]);
    if(selctionOverlap.toString()!= '' && ($(selctionOverlap.startContainer).hasClass('annotator-hl') || $(selctionOverlap.endContainer).hasClass('annotator-hl'))) {
      $('.annotator-editor').addClass('overlapingpopup');
    } else {
      $('.annotator-editor').removeClass('overlapingpopup');
    }
    return this;
  };

  Annotator.prototype.onEditorHide = function() {
    window.currAnn = [];
    this.publish('annotationEditorHidden', [this.editor]);
    return this.ignoreMouseup = false;
  };

  Annotator.prototype.onEditorSubmit = function(annotation) {
    this.alignMathMlNote();
    this.alignNotes();
    if(annotation.shareable) {
      return;
    }
    return this.publish('annotationEditorSubmit', [this.editor, annotation]);
  };

  Annotator.prototype.showViewer = function(annotations, location) {
    this.viewer.element.css(location);
    this.viewer.load(annotations);
    return this.publish('annotationViewerShown', [this.viewer, annotations]);
  };

  Annotator.prototype.startViewerHideTimer = function() {
    if (!this.viewerHideTimer) {
      return this.viewerHideTimer = setTimeout(this.viewer.hide, 250);
    }
  };

  Annotator.prototype.clearViewerHideTimer = function() {
    clearTimeout(this.viewerHideTimer);
    return this.viewerHideTimer = false;
  };

  Annotator.prototype.checkForStartSelection = function(event) {
    if (!(event && this.isAnnotator(event.target))) {
      this.startViewerHideTimer();
    }
    return this.mouseIsDown = true;
  };

   Annotator.prototype.getSelectedAnnotations = function() {
    var getHTMLContents = window.getSelection().getRangeAt(0);
    var elementSelection = $(getHTMLContents.cloneContents()).context.children;
    var ancesterContainer = getHTMLContents.commonAncestorContainer;
    var annArray =[];
    if($(elementSelection).hasClass('annotator-editor')) {
      annArray.push(1,2);
      return annArray;
    }
    if(elementSelection.length == 0) {  //Checks overlapping on the same content
      var selectedText = getHTMLContents.cloneContents().textContent;
      elementSelection = [];
      if(selectedText==getHTMLContents.startContainer.innerText 
        && $(getHTMLContents.startContainer).hasClass('annotator-hl'))
        elementSelection.push(getHTMLContents.startContainer)
      else if($(ancesterContainer).hasClass('annotator-hl'))
        elementSelection.push(ancesterContainer);
    }
    if(elementSelection.length>0){  //finds overlapping annotations
      var hlElements,dataAnnId,shrable
        for (var i=0;i<=elementSelection.length;i++){
          hlElements = $(elementSelection[i]).find('.annotator-hl');
          if (hlElements.length>0){
            for(var j=0;j<=hlElements.length;j++){
              dataAnnId = $(hlElements[j]).attr('data-ann-id');
              shrable = $(hlElements[j]).attr('shareable');
              if (dataAnnId !== undefined && $.inArray(dataAnnId,annArray)<0)
                if (!shrable || shrable==='false')
                  annArray.push(dataAnnId);
              }
            }
          if (hlElements.context && hlElements.context.hasAttribute('data-ann-id')) {
              dataAnnId = $(hlElements.context).attr('data-ann-id');
              shrable = $(hlElements.context).attr('shareable');
              if (dataAnnId !== undefined && $.inArray(dataAnnId,annArray)<0)
                if (!shrable || shrable==='false')
                  annArray.push(dataAnnId);
          }
          else if (annArray.length === 0 && $(ancesterContainer).hasClass('annotator-hl')) {
             dataAnnId = $(ancesterContainer).attr('data-ann-id');
             shrable = $(ancesterContainer).attr('shareable');
             if (dataAnnId !== undefined && $.inArray(dataAnnId,annArray)<0)
               if (!shrable || shrable==='false')
                 annArray.push(dataAnnId);
          }
        }
     }
     return annArray;
  };

  Annotator.prototype.checkForEndSelection = function(event) {
    if($(event.target).closest('.aquila-image-viewer, .ReactModalPortal').length)
     return false;
    var container, range, _i, _len, _ref;
    this.mouseIsDown = false;
    this.selectedAnnArr=[];
    this.ignoreMouseup=$(event.target).hasClass('annotator-confirm-delete')?false:this.ignoreMouseup;
    if (this.ignoreMouseup) {
      return;
    }
    this.selectedRanges = this.getSelectedRanges();
    _ref = this.selectedRanges;
    if(_ref.length>0) {
      this.selectedAnnArr = this.getSelectedAnnotations();
      if(this.selectedAnnArr.length > 1) {
        window.getSelection().removeAllRanges();
        return;
      }
    }
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      container = range.commonAncestor;
      if (this.isAnnotator(container)) {
        return;
      }
    }
    if (event && this.selectedRanges.length) {
      this.onAdderClick(event);
      this.onAdderMousedown();
      return this.adder;
    } else {
      return this.adder.hide();
    }
  };

  Annotator.prototype.isAnnotator = function(element) {
    return !!$(element).parents().addBack().filter('[class^=annotator-]').not('[class^=annotator-hl]').not(this.wrapper).length;
  };

  Annotator.prototype.onHighlightMouseover = function(event) {
    var annotations;
    this.clearViewerHideTimer();
    if (this.mouseIsDown) {
      return false;
    }
    if (this.viewer.isShown()) {
      this.viewer.hide();
    }
    annotations = $(event.target).parents('.annotator-hl').addBack().map(function() {
      return $(this).data("annotation");
    }).toArray();
    return this.showViewer(annotations, Util.mousePosition(event, this.wrapper[0]));
  };

  Annotator.prototype.onHighlightClick = function(event) {
    event.stopPropagation();
    this.alignNotes();
    this.alignMathMlNote();
    var currAnnPosition=0,_i;
    if(this.selectedAnnArr.length > 0)
      return false;
    var annotations = $(event.target).closest('.annotator-hl').addBack().map(function() {
      return $(this).data("annotation");
    }).toArray();
    for (_i = 0; _i <annotations.length ; _i++) {
      if($(annotations)[_i].shareable)
        currAnnPosition = _i;
       if(!($(annotations)[_i].id))
        currAnnPosition++;
    };
    this.showEditor(annotations[currAnnPosition], Util.mousePosition(event, this.wrapper[0]), false);
 
  }

  Annotator.prototype.onAdderMousedown = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    return this.ignoreMouseup = true;
  };

  Annotator.prototype.clearTextSelection =function (){
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }

  Annotator.prototype.onAdderClick = function(event) {
    var annArray =[],oldAnnArr=[],annObjElement;
    var annotation, cancel, cleanup, position, save;
    var windowSelection = window.getSelection(), selctionOverlap = windowSelection.getRangeAt(0);
    annArray = this.getSelectedAnnotations();
     if(annArray.length>0) {
      var hlElements = $(event.target).addBack().find('.annotator-hl');
          if(hlElements.length>0){
              for( var j=0;j<=hlElements.length;j++){
                  var dataAnnId = $(hlElements[j]).attr('data-ann-id');
                    if(dataAnnId !== undefined && $.inArray(dataAnnId,annArray)>=0)
                      annObjElement = hlElements[j];
              }
          } else {
            var isstartHl = $(selctionOverlap.startContainer).hasClass('annotator-hl'), isendHl = $(selctionOverlap.endContainer).hasClass('annotator-hl');
            if (isstartHl) {
              if($.inArray($(selctionOverlap.startContainer).attr('data-ann-id'),annArray)>=0)
                      annObjElement = $(selctionOverlap.startContainer);
            }
            if (isendHl) {
              if($.inArray($(selctionOverlap.endContainer).attr('data-ann-id'),annArray)>=0)
                      annObjElement = $(selctionOverlap.endContainer);
            }
          } 
          if(!annObjElement && hlElements.context && hlElements.context.outerHTML.match('.annotator-hl'))
            annObjElement = hlElements.context;
            oldAnnArr = $(annObjElement).parents('.annotator-hl').addBack().map(function() {
                  return $(this).data("annotation");
                  }).toArray();
     }
    if (event != null) {
      event.preventDefault();
    }
    this.adder.hide();
    annotation = this.setupAnnotation(this.createAnnotation());
    event.pageY=$(annotation.highlights).offset().top;
    position = Util.mousePosition(event, this.wrapper[0]);
    // this.clearTextSelection();
    $(annotation.highlights).addClass('annotator-hl-temporary');
    save = (function(_this) {
      return function() {
        cleanup();
        $(annotation.highlights).removeClass('annotator-hl-temporary');
        return _this.publish('annotationCreated', [annotation]);
      };
    })(this);
    cancel = (function(_this) {
      return function() {
        cleanup();
        return _this.deleteAnnotation(annotation);
      };
    })(this);
    cleanup = (function(_this) {
      return function() {
        _this.unsubscribe('annotationEditorHidden', cancel);
        return _this.unsubscribe('annotationEditorSubmit', save);
      };
    })(this);
     if(oldAnnArr.length>0 && annArray.length>0) { //&& !(oldAnnArr[0].shareable)
      $(annotation)[0].text = $(oldAnnArr)[0].text;
      $('.annotator-edit-container').hide();
      window.currAnn = $(oldAnnArr)[0];
    }
    this.subscribe('annotationEditorHidden', cancel);
    this.subscribe('annotationEditorSubmit', save);
    return this.showEditor(annotation, position, true, event);
  };

  Annotator.prototype.onEditAnnotation = function(annotation) {
    var cleanup, offset, update;
    offset = this.viewer.element.position();
    update = (function(_this) {
      return function() {
        cleanup();
        return _this.updateAnnotation(annotation);
      };
    })(this);
    cleanup = (function(_this) {
      return function() {
        _this.unsubscribe('annotationEditorHidden', cleanup);
        return _this.unsubscribe('annotationEditorSubmit', update);
      };
    })(this);
    this.subscribe('annotationEditorHidden', cleanup);
    this.subscribe('annotationEditorSubmit', update);
    this.viewer.hide();
    return this.showEditor(annotation, offset, false);
  };

  Annotator.prototype.onDeleteAnnotation = function(annotation) {
    this.viewer.hide();
    return this.deleteAnnotation(annotation);
  };

  return Annotator;

})(Delegator);

Annotator.Plugin = (function(_super) {
  __extends(Plugin, _super);

  function Plugin(element, options) {
    Plugin.__super__.constructor.apply(this, arguments);
  }

  Plugin.prototype.pluginInit = function() {};

  return Plugin;

})(Delegator);

g = Util.getGlobal();

if (((_ref = g.document) != null ? _ref.evaluate : void 0) == null) {
  $.getScript('http://assets.annotateit.org/vendor/xpath.min.js');
}

if (g.getSelection == null) {
  $.getScript('http://assets.annotateit.org/vendor/ierange.min.js');
}

if (g.JSON == null) {
  $.getScript('http://assets.annotateit.org/vendor/json2.min.js');
}

if (g.Node == null) {
  g.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  };
}

Annotator.$ = $;

Annotator.Delegator = Delegator;

Annotator.Range = Range;

Annotator.Util = Util;

Annotator._instances = [];

Annotator._t = _t;

Annotator.supported = function() {
  return (function() {
    return !!this.getSelection;
  })();
};

Annotator.noConflict = function() {
  Util.getGlobal().Annotator = _Annotator;
  return this;
};

$.fn.annotator = function(options) {
  var args;
  args = Array.prototype.slice.call(arguments, 1);
  return this.each(function() {
    var instance;
    instance = $.data(this, 'annotator');
    if (options === 'destroy') {
      $.removeData(this, 'annotator');
      return instance != null ? instance.destroy(args) : void 0;
    } else if (instance) {
      return options && instance[options].apply(instance, args);
    } else {
      instance = new Annotator(this, options);
      return $.data(this, 'annotator', instance);
    }
  });
};

this.Annotator = Annotator;

//# sourceMappingURL=annotator.map