/*
 * Initialize the bookmark panel.
 */
var eventMap = [];
function initBookmark(baseUrl,options){

  //_initbmPanel();

  $(window).resize(function(){
    //resizeScrollBar();
  });

  //resize the scroll bar for boomark panel.
  function resizeScrollBar(){
    var width = 200;
    var height = 520;

    $("#docViewer_fxBookmarkPanel").css({
      width: width + "px",
      height :(height - 3*28) + "px"
    });

    if(_bookmarkScroll) {
       _bookmarkScroll.reinitialise();
      }
  }

  function hideAllPanel(){
    $("#docViewer_fxBookmarkPanel").hide();
  }

  WebPDF.ViewerInstance.on(WebPDF.EventList.DOCUMENT_LOADED, function (event, data) {
        WebPDF.ViewerInstance.getBookmark().moveToRoot();
        _initBookmark(baseUrl);
    });

   /*-----begin Bookmark panel----*/
    var $bookmarkPanel  = null;
    var _TOCArray  = [];
    var _bookmarkTree = null;
    var _bookmarkScroll = null;
    var _bookmarkInstance = null;
    var extNodeClass = 'bookmarkNode', extPlusItemClass = 'bookmarkPlusItem';

    /*
     * Initialize the thumbnail panel.
     *
     */
    function _initBookmark(baseUrl) {
        var _scrollApi = null;
        var _root = null;

        var baseImageUrl = baseUrl + "images/reader/dtree/";

        if(_bookmarkScroll)
          _bookmarkScroll = null;

        var icons  = {
            root: '',
            folder: baseImageUrl + 'bookmark.png',
            folderOpen: baseImageUrl + 'bookmark.png',
            node: baseImageUrl + 'bookmark.png',
            nodehot: baseImageUrl + 'bk1.png',
            empty: baseImageUrl + 'empty.gif',
            line: baseImageUrl + 'line_pc.png',
            join: baseImageUrl + 'join_pc.png',
            joinBottom: baseImageUrl + 'joinbottom_pc.png',
            joinTop: baseImageUrl + 'jointop_pc.png',
            joinonly: baseImageUrl + 'joinonly_pc.png',
            plus: baseImageUrl + 'plug_pc.png',
            plusBottom: baseImageUrl + 'plugbottom_pc.png',
            plusTop: baseImageUrl + 'plugtop_pc.png',
            plusOnly: baseImageUrl + 'plugonly_pc.png',
            minus: baseImageUrl + 'minus_pc.png',
            minusBottom: baseImageUrl + 'minusbottom_pc.png',
            minusTop: baseImageUrl + 'minustop_pc.png',
            minusOnly: baseImageUrl + 'minusonly_pc.png',
            nlPlus: baseImageUrl + 'nolines_plus.gif',
            nlMinus: baseImageUrl + 'nolines_minus.gif'
        };
        try{
          _bookmarkTree = new WebPDFTools.dTree('bookmark_', extNodeClass, extPlusItemClass, icons);
          _bookmarkTree.add(0,-1,"");

          if($bookmarkPanel && !_bookmarkScroll){
            $bookmarkPanel.remove();
            $bookmarkPanel = null;
          }

          var bookmarkPanelHtml = "<div id='docViewer_fxBookmarkPanel' class='fwr-bookmark-panel'"
        + "style='display:none;height:100%;overflow: hidden;outline: none;'></div>";
        if($("#tocContainer")){
          $("#tocContainer").append(bookmarkPanelHtml);         
        } else{
          $("#tocContainerPDF").append(bookmarkPanelHtml);         
        } 
        $bookmarkPanel = $("#docViewer_fxBookmarkPanel");
        }catch (ex) {
            console.error(ex);
            return false;
        }
    }

    /**
   * Enumerate the bookmark items.
   *
   * @method _enmuChildNode
   */
    function _enmuChildNode(parentNode){

     if(parentNode){
      var nodeTitle = parentNode.getTitle().toString().replace(/<\/?[^>]+(>|$)/g, "").replace('/[\x00-\x1F\x7F-\x9F]/u', '').split('  ')[0];
      var testNode = document.createElement('div');
       _bookmarkTree.add(parentNode.getNodeID(), parentNode.getParentNodeID(), nodeTitle);
       var tocObject = {
        "NodeID": parentNode.getNodeID(),
        "ParentNodeID" : parentNode.getParentNodeID(),
        "NodeTitle" : nodeTitle
       }
       _TOCArray.push(tocObject);
       if(parentNode.moveToFirstChild()){
         _enmuChildNode(parentNode);
         parentNode.moveToParent();
       }
     }
     while(parentNode.moveToNextSibling()){
       _enmuChildNode(parentNode);
     }
    }

    /**
   * Initialize the bookmark panel and build up the bookmark tree.
   *
   * @method _initbmPanel
   */
    function _initbmPanel(){
      _TOCArray =[];
     if (_bookmarkScroll != null){
         return;
     }
      _bookmarkInstance =   WebPDF.ViewerInstance.getBookmark();
      WebPDF.ViewerInstance.getBookmark().moveToRoot();
      // if(!_bookmarkInstance.isRoot())
      //   return;

      var bHasChild = _bookmarkInstance.moveToFirstChild()
      if(bHasChild)
        _enmuChildNode(_bookmarkInstance);

      var bmHtml = _bookmarkTree.toString();
      $bookmarkPanel.append(_bookmarkTree.toString());
      var width = 300;
      var height = 620;

      $bookmarkPanel.css({
        width: width + "px",
        height :(height - 100) + "px"
      });

      _initbmScroll();
      _bindbmEvents();
      return _TOCArray;
  }

  function _gotoPDFNode(nodeId) {
    try {     
               var  tocInstance =   WebPDF.ViewerInstance.getBookmark();
               tocInstance.moveToRoot();
               // var nodeId = parseInt(event.target.getAttribute("nodeid"));
               var isFind = tocInstance.getNode(nodeId);
               if(isFind){
                 var count = tocInstance.countActions();
                 for(var i = 0; i<count ;i++ ){
                  var action =  tocInstance.getAction(i);
                  var des = action.getDestination();
                  WebPDF.ViewerInstance.gotoPageByDestination(des);
                 }
                 triggerEvent("onpageChange");
                 return des.pageIndex;
               }
            }
            catch (ex) {
               //console.error(ex);
            }
  }

    /**
      * Bind the click event for each bookmark items.
    *
    * @method _bindbmEvents
    */
    function _bindbmEvents() {
        $bookmarkPanel.on('click', '.' + extNodeClass, function (event) {
            try {
               var nodeId = parseInt(event.target.getAttribute("nodeid"));
               var isFind = _bookmarkInstance.getNode(nodeId);
               if(isFind){
                 _bookmarkTree.setCurNode(nodeId);
                 var count = _bookmarkInstance.countActions();
                 for(var i = 0; i<count ;i++ ){
                  var action =  _bookmarkInstance.getAction(i);
                  var des = action.getDestination();
                  WebPDF.ViewerInstance.gotoPageByDestination(des);
                 }
                 triggerEvent("onpageChange");
                 return false;
               }
            }
            catch (ex) {
               //console.error(ex);
            }
        });
        $bookmarkPanel.off('click', '.' + extPlusItemClass).on('click', '.' + extPlusItemClass, function (event) {
            try {
                var nodeId = parseInt(event.target.getAttribute("nodeid"));
                var isFind = _bookmarkInstance.getNode(nodeId);
                if (isFind) {
                    _bookmarkTree.o(nodeId);
                    if(null != _bookmarkScroll) {
                        _bookmarkScroll.reinitialise();
                    }
                    return false;
                }
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }

    /**
   * Initialize the scroll bar of bookmark panel.
   *
   * @method _initbmScroll
   */
    function _initbmScroll() {
        if (_bookmarkScroll != null){
            return;
        }
        var settings = {showArrows: false, animateScroll: false};
        var scrollApiElem = '';
        switch(options.scrollBarType) {
           case WebPDF.PDFView.ScrollBarType.CUSTOM_SCROLL_BAR:
            {
                scrollApiElem = $bookmarkPanel.fwrJScrollPane(settings);
            }break;
            case WebPDF.PDFView.ScrollBarType.NATIVE_SCROLL_BAR:
            {
                scrollApiElem = $bookmarkPanel.WebPDFNativeScroll(settings);
            }break;
            default: {
                $.error("Unsupported type of scroll bar.");
            }break;
        }
        _bookmarkScroll = scrollApiElem.data('jsp');
        return _bookmarkScroll;
    };
    /*-----end Bookmark panel----*/
    return{
       initbmPanel : function(){
         var TOCArray = _initbmPanel();
         return TOCArray;
       },
       gotoPDFNode: function(nodeId){
        return _gotoPDFNode(nodeId);
       }
    };
}

function initToolBar() {
WebPDF.ViewerInstance.on(WebPDF.EventList.DOCUMENT_LOADED, function (event, data) {
$('#fwr-textSelect-context-menu-container').remove();
$('#fwr-annots-context-menu-container').remove();
$('#docViewerFxMenuContainer').remove();

WebPDF.ViewerInstance.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
//WebPDF.ViewerInstance.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND);
/*
To put OnClick Event Listener on the Page once the page is Loaded for the Links annot on the Page.
*/
WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_VISIBLE , _applyEventOnLinkAnnot);

// WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_SHOW_COMPLETE , _applyAnnotEvents);

WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_SHOW_COMPLETE , _applyAnnotEvents);

function _applyAnnotEvents() {
  console.log("_applyAnnotEvents is called");
  setTimeout(_applyEventOnLinkAnnot, 1000);
  // setTimeout(_applyEventOnLinkAnnot, 2000);
  // setTimeout(_applyEventOnLinkAnnot, 3000);
  // setTimeout(_applyEventOnLinkAnnot, 4000);
}

function _applyEventOnLinkAnnot(){
    var linkElements = document.querySelectorAll('.fwr_link_annot');
    try {     
              for(var i=0; i<linkElements.length; i++) {
                linkElements[i].onclick = function() {
                triggerEvent("linkClicked", this);        
          }          
        } 
      }catch(e) {
          console.log("Problem with the Link");
        }       
  }


triggerEvent("pageFitWidth", {});
console.log("Page Loaded. ToolBar initialized");
});

$('#frame').bind('mousedown mouseup dblclick', _handleClick);
$('#frame').bind('click', _blankSelection);

function _blankSelection(){
  var selectedText = WebPDF.ViewerInstance.getCurToolHandler().getTextSelectTool().getSelectedText();
  if(selectedText.toString().trim() !== '') {
  var selection = document.querySelectorAll('.fwr-text-highlight');
    triggerEvent("textSelected", selection);
    //invoke
    highlightText();
    } else{
      try{
        if(event.srcElement.classList.contains("addNotes") || event.srcElement.classList.contains("deleteHighlight")){

        }else {
          triggerEvent("blankSelection", {});
        }
      } catch(e){
      }
    }
}

function _handleClick() {
  var selectedText = WebPDF.ViewerInstance.getCurToolHandler().getTextSelectTool().getSelectedText();
  if(selectedText.toString().trim() !== '') {
  var selection = document.querySelectorAll('.fwr-text-highlight');
    triggerEvent("textSelected", selection);
    } else{
      if(typeof InstallTrigger !== 'undefined'){
        triggerEvent("blankSelection", {});
      }
    }
  }
}
/*-----end Bookmark component----*/
$(window).resize(function(){
    //Resize();
});
/**
 * Get user  watermrk Info form cookie.
 */
function getWatermarkConfigs() {
    if (document.cookie.length > 0) {
        start = document.cookie.indexOf("userWatermark=")
        if (start != -1) {
            start = start + "userWatermark".length + 1
            end = document.cookie.indexOf(";", start)
            if (end == -1)
                end = document.cookie.length
            return $.parseJSON(unescape(document.cookie.substring(start, end)));
        }
    }
    return null;
};

/**
 * Function defined to load WebPDF Viewer module and open a sample PDF file.
 */
var compBaseURL, compBaseOptions, tocObj, toolBar;
function initViewer(config) {
  //initPDFTool();
  var language = "en-US";
  var assetid="",deviceid="",appversion = "" ,authorization = "",acceptLanguage="";
  // get the base url
  var host = config.host; //"http://10.25.168.128:8085/foxit-webpdf-web/pc/";
  var index = host.lastIndexOf("foxit-webpdf-web");
  var baseUrl = host.substr(0,index + 17);
  //PDF asset path
  var openFileUrl = config.PDFassetURL;
  var zip = config.zip;
  var encpwd = config.encpwd;
  var pdfBookCallback = config.callbackOnPageChange;
  var assertUrl = config.assertUrl;
  if(config.requestheaderParams) {
  assetid = config.requestheaderParams.assetid || "";
  deviceid = config.requestheaderParams.deviceid || "";
  appversion = config.requestheaderParams.appversion || "";
  authorization = config.requestheaderParams.token || "";
  acceptLanguage = config.requestheaderParams.acceptLanguage || "";
  }

  var uStr = localStorage.getItem('userInformation');
  var uObj = {};
  if(uStr) 
  {
    uObj = $.parseJSON(uStr);
    $.ajaxSetup({
    beforeSend: function(xhr) {
     xhr.setRequestHeader('token',uObj.userToken);
   }
  });
  }
  //initWebPDFMini()
  // open the sample file
   if(assertUrl === '')
  { assertUrl = openFile(baseUrl,openFileUrl, config.headerParams);}
  if (assertUrl == null) return;
  if(typeof(WebPDF) != 'undefined' && WebPDF.ViewerInstance != null) {
              // open current file
                WebPDF.ViewerInstance.openFile(assertUrl);
               
            }
  seajs.use(['webpdf.mini.js'], function (init) {
    var options = {
        language: language,
        url: assertUrl,
        scrollBarType: 0
    };
    compBaseOptions = options;
    var pos = assertUrl.indexOf("asserts");
    var baseUrl = assertUrl.substr(0, pos);
    compBaseURL = baseUrl;
    WebPDF.createViewer("docViewer", options);
    WebPDF.ViewerInstance.on(WebPDF.EventList.DOCUMENT_LOADED, function (event, data) {
         createPDFEvent('wrdocLoaded');
        
    });
    WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_VISIBLE, function (event, data) {
        createPDFEvent('pageVisible');
    });
    WebPDF.ViewerInstance.on(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, function (event, data) {
        var currentPageIndex = WebPDF.ViewerInstance.getCurPageIndex();
        var pdfImageLoad = document.querySelector("#docViewer_ViewContainer_BG_" + currentPageIndex).className;
        if(pdfImageLoad.indexOf("fwr-hidden") > 1) {
        createPDFEvent('wrpageChanged');
         pdfBookCallback('pageChanged');
        }
    });
    WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function (event, data) {
       createPDFEvent('wrpageLoaded');
       pdfBookCallback('pageLoaded');
    });
    tocObj = initBookmark(compBaseURL,compBaseOptions);
    toolBar = initToolBar();
    //WebPDF.ViewerInstance.setWatermarkInfo(getWatermarkConfigs());
    WebPDF.ViewerInstance.load();
  });
};

function createPDFEvent(eventName) {
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  document.querySelector('.docViewer').dispatchEvent(event);
  try{
    document.querySelector('.docViewer').dispatchEvent(event);
  }catch(e){}
  
}

function getIP(baseUrl) {
  var ip = "";
  $.ajax({
    url: baseUrl + "asserts/ip",
    type: "GET",
    async: false,
    success: function(data) {
      ip = data.result;
    },
    error: function() {
      alert("Failed to get IP.");
    }
  });
  return ip;
}

/**
 * Function defined to open a PDF file in WebPDF SDK.
 *
 * @param baseUrl the base url of current web server.
 * @param fileUrl the file url to be opened.
 * @param callback the callback function to implement after open the file.
 */
function openFile(baseUrl,fileUrl,headerParams,callback) {
    fileUrl = fileUrl.replace(/^\s*/g, "").replace(/\s*$/g, ""); // trim string
    // User information can be get from custom user system.
    // It can be set at this place,and also can be set by SPI plugin implement.
    var user = getIP(baseUrl);
    var tempURL = "";
    for(var i in headerParams) {
      tempURL = tempURL + i.toString() + "=" + headerParams[i].toString() + '&';
      // console.log( i + ": " + foo[i] + "<br />");
    }
    // Current SDK only support read only,disable print and disable download user permission control.
     var loadParams = fileUrl + "?"  + tempURL;
        // Set the load type of SPI plugin. HTTP means demo plugin implement to process the document from http protocol.
    var loadType = "com.foxit.readerplus.HttpDocumentPlugin";
    var data = {
        params: loadParams,
        type:loadType
    };
    var url = null;
    // request to access demanded PDF file.
    $.ajax({
        url: baseUrl + "api/file/add",
        type: "POST",
        data: data,
        async:false,
        success: function (data) {
            var curID = data.result;
            if (curID == null) {
                alert(i18n.t("ParseError.ConvertFileFail") + fileUrl);
                return null;
            }
            if (curID == "LicenseInvalid") {
                alert(i18n.t("ParseError.LicenseInvalid"));
                return null;
            }
            if (curID == "LicenseExpired") {
                alert(i18n.t("ParseError.LicenseExpired"));
                return null;
            }
            if (curID == "OutOfFileSizeLimit") {
                alert(i18n.t("ParseError.OutOfFileSizeLimit"));
                return null;
            }

            url = baseUrl + "asserts\/" + curID;
           /* if(typeof(WebPDF) != 'undefined' && WebPDF.ViewerInstance != null) {
              // open current file
                WebPDF.ViewerInstance.openFile(url);
                if(callback != null) {
                    callback();
                }
            }*/

        },
        error: function() {
            alert("FailToOpen:"+ fileUrl);
        }
    });
    return url;
}

/**
 * Function defined to handle the window resize event.
 */
function Resize(){
  var width = $(window).width();
  var height = $(window).height();


  $("#right").css({
      width: width,
      "min-width": width
  });

  $("#right").height(height);

  $("#toolbar").width($("#right").width());
  updateLayer();
}

/**
 * Update the layout when any visible elements of WebPDF has been changed.
 *
 * @method updateLayer
 */
 function updateLayer() {
  var toolBar = $("#toolbar");
  var width = toolBar.outerWidth();
  var height = $("#right").height();;
  var topOffset = toolBar.is(":visible") ? toolBar.outerHeight() - 2 : 0;
  $("#frame").css({
    "margin-top":topOffset
  });

  var viewHeight = height - topOffset;
  var viewWidth  = width;

  // reset the css style value for each visible elements
  // reset the size of viewer object.
  $("#docViewer").css({
      //top: topOffset,
      height: viewHeight,
      width: viewWidth
  });

  if(typeof(WebPDF) =='undefined'  || WebPDF.ViewerInstance == null)
    return;
  // Recalculate the width and height of PDF viewer.
  WebPDF.ViewerInstance.updateLayout(viewWidth, viewHeight);
}

function triggerEvent(eventName, eventData) {
  var eventCallback = eventMap[eventName];
  if (eventCallback != null) {
    eventCallback(eventData);
  }
}

/*
function loadLocalAssets(){
    // open the sample file
  // var assertUrl = openFile(baseUrl,openFileUrl, zip, encpwd, assetid, deviceid, appversion, authorization, acceptLanguage);
  var language = "en-US";
  var assertUrl = "";
  if (assertUrl == null) return;
  initWebPDFMini();
  seajs.use(['./webpdf.mini.js'], function (init) {
    var options = {
        language: language,
        url: "testString",
        scrollBarType: 0
    };
    compBaseOptions = options;
    var pos = assertUrl.indexOf("asserts");
    var baseUrl = assertUrl.substr(0, pos);
    compBaseURL = baseUrl;
    WebPDF.createViewer("docViewer", options);
    WebPDF.ViewerInstance.on(WebPDF.EventList.DOCUMENT_LOADED, function (event, data) {
         createPDFEvent('wrdocLoaded');
    });
    WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_VISIBLE, function (event, data) {
        createPDFEvent('pageVisible');
    });
    WebPDF.ViewerInstance.on(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, function (event, data) {
        var currentPageIndex = WebPDF.ViewerInstance.getCurPageIndex();
        var pdfImageLoad = document.querySelector("#docViewer_ViewContainer_BG_" + currentPageIndex).className;
        if(pdfImageLoad.indexOf("fwr-hidden") > 1) {
        createPDFEvent('wrpageChanged');
        }
    });
    WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function (event, data) {
       createPDFEvent('wrpageLoaded');
    });
    tocObj = initBookmark(compBaseURL,compBaseOptions);
    toolBar = initToolBar();
    //WebPDF.ViewerInstance.setWatermarkInfo(getWatermarkConfigs());
    WebPDF.ViewerInstance.load();
  });
}*/

function getAssetURLForPDFDownload(config,cb){
  var language = "en-US";
  var assetid="",deviceid="",appversion = "" ,authorization = "",acceptLanguage="";
  // get the base url
  var host = config.host; //"http://10.25.168.128:8085/foxit-webpdf-web/pc/";
  var index = host.lastIndexOf("foxit-webpdf-web");
  var baseUrl = host.substr(0,index + 17);
  //PDF asset path
  var openFileUrl = config.PDFassetURL;
  var zip = config.zip;
  var encpwd = config.encpwd;
  if(config.requestheaderParams) {
    assetid = config.requestheaderParams.assetid || "";
    deviceid = config.requestheaderParams.deviceid || "";
    appversion = config.requestheaderParams.appversion || "";
    authorization = config.requestheaderParams.token || "";
    acceptLanguage = config.requestheaderParams.acceptLanguage || "";
  }

  var uStr = localStorage.getItem('userInformation');
  var uObj = {};
  if(uStr){
    uObj = $.parseJSON(uStr);
    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader('token',uObj.userToken);
      }
    });
  }
  // open the sample file
  var assertUrl = openFile(baseUrl,openFileUrl, zip, encpwd, assetid, deviceid, appversion, authorization, acceptLanguage);
  var lastIndexOf = assertUrl.lastIndexOf('/');
  var assertUrlLength = assertUrl.length;
  var assertLocationId = assertUrl.substr((lastIndexOf + 1), assertUrlLength);
  cb(assertLocationId);
}

//PDF Wrapper component
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD
      define([], factory);
    } else if (typeof exports === 'object') {
      // Node, CommonJS-like
      module.exports = factory();
    } else {
      // Browser globals
      root.pdfWrapper = factory();
    }
  }(this, function() {
    function pdfWrapper() {
      var _this = this;
      _this.removeExistingHighlightElement = function() {
        $('.pdfHighlight').remove();
      }

      _this.removeExistingHighlightCornerImages = function() {
        $('#highlightcornerimages').remove();
      }

      _this.removeHighlightElement = function(id){
        $('#'+id).remove();
      }

      _this.triggerEvent = function(eventName, eventData) {
       var eventCallback = eventMap[eventName];
        if (eventCallback != null) {
            eventCallback(eventData);
          }
        }

      _this.handleHighlightClick = function(event) {
        var hId = this.getAttribute("id");
        // Trigger the event to the client. Should be handled there appropiately.
        _this.triggerEvent("highlightClicked",hId);
        return false;
      }

      _this.loadHighlights = function() {
        //console.log("Highlights Loading ");
        var highlightedNodes = document.querySelectorAll('.fwr-highlight-annot');
        if(highlightedNodes.length > 0) {
          for (var highlightIndex = 0; highlightIndex < highlightedNodes.length; highlightIndex++) {
            highlightedNodes[highlightIndex].addEventListener('click', _this.handleHighlightClick);
          }
        }

        var highlightNodes = document.querySelectorAll('.pdfHighlight');
        for(var highlightIndex = 0; highlightIndex < highlightNodes.length; highlightIndex++) {
          var Id = highlightNodes[highlightIndex].getAttribute('id');
          var currenthighlightNode = $('.pdfHighlight#' + Id);
          if(currenthighlightNode.length > 1) {
            var node = document.querySelector('.pdfHighlight#' + Id);
            document.querySelector('.pdfHighlight#' + Id).parentNode.removeChild(node);
          }
          }
      }

      /*
          Restore Highlights on the Page.
        */
      _this.restoreHighlights = function(highlights) {       
         var scrollPercentage = 0;
        try{
          scrollPercentage = WebPDF.ViewerInstance.getDocView().getScrollApi().getPercentScrolledY();           
        }catch(e){} 
        _this.removeExistingHighlightElement(); 
        var mainDiv = [];     
        for (var i=0; i < highlights.length; i++)
          { 
            try{
            var childDiv = [];
            var highlightHashes = highlights[i].highlightHash;
            var highlightDiv = document.createElement('div');
                highlightDiv.classList.add('pdfHighlight');
             var page = highlights[i].pageIndex || null;
             var highlightHash = highlightHashes.split("@")[0].trim().replace(/(\r\n|\n|\r)/gm,"").replace(/['"]+/g, '');
             var outerHash = highlightHashes.split("@")[1];         
             var hId = highlights[i].id;
             var highlightColor = highlights[i].color;
             var highLightHashArray = [];
              highLightHashArray = highlightHash.split(":");
             if(page != null || page !=undefined)
              {
                var pdfRectArray = [];
            for(var j=0 ; j<highLightHashArray.length - 1; j=j+4) {
              
                childDiv[i] = document.createElement('div');
                childDiv[i].setAttribute("id", hId);
                childDiv[i].setAttribute("page-index", page);
                childDiv[i].classList.add('fwr-highlight-annot');
                var PDFRect = new WebPDF.PDFRect();
                var firstKey =  highLightHashArray[j].split("{")[1].trim();
                var secondKey =   highLightHashArray[j+1].split(",")[1].trim();
                var thirdKey =  highLightHashArray[j+2].split(",")[1].trim();
                var fourthKey =  highLightHashArray[j+3].split(",")[1].trim();
                var firstValue = highLightHashArray[j+1].split(',')[0];
                var secondValue = highLightHashArray[j+2].split(',')[0];
                var thirdValue = highLightHashArray[j+3].split(',')[0];
                var fourthValue = highLightHashArray[j+4].split('}')[0];
                PDFRect[String(firstKey)] = parseFloat(firstValue);
                PDFRect[String(secondKey)] = parseFloat(secondValue);
                PDFRect[String(thirdKey)] = parseFloat(thirdValue);
                PDFRect[String(fourthKey)] = parseFloat(fourthValue);
                  try{
                   pdfRectArray.push(PDFRect);
                 }catch(e) 
                {
                  console.log("Error Populating Highlight");
                }
               }
              try {
                page = childDiv[i].getAttribute("page-index");
                WebPDF.ViewerInstance.highlightText((page -1), pdfRectArray);                
               _this.saveHighlight(page, highlightHashes, hId, highlightColor);
              }catch(e){
                console.log("Error Saving Highlight");
              }
             }
           }catch(e){}
          }
          try{
            if(scrollPercentage == -0) {
              _this.gotoPdfPage(0,0);
            }else{
              WebPDF.ViewerInstance.getDocView().getScrollApi().scrollToPercentY(scrollPercentage);           
            }            
          }catch(e){

          }
      }
  /*Method to handle when a region/hotspot is clicked*/
      _this.handleRegionClick = function(event) {
        var hotspotID=this.getAttribute("id");
        _this.triggerEvent("regionClicked",hotspotID);
        return false;
      }
  /*Method to handle Transparent region on mouse hover*/
      _this.handleTransparentRegionHover = function(event) {
        var hotspotID=this.getAttribute("id");
        _this.triggerEvent("RegionHovered",hotspotID);
        return false;
      }
  /*Method to handle Transparent region on mouse our*/
      _this.handleTransparentRegionUnhover = function(event) {
        var hotspotID=this.getAttribute("id");
        _this.triggerEvent("RegionUnhovered",hotspotID);
        return false;
      }

        var highlightNodes = document.querySelectorAll('.pdfHighlight');
        for(var highlightIndex = 0; highlightIndex < highlightNodes.length; highlightIndex++) {
          var Id = highlightNodes[highlightIndex].getAttribute('id');
          var currenthighlightNode = $('.pdfHighlight#' + Id);
          if(currenthighlightNode.length > 1) {
            var node = document.querySelector('.pdfHighlight#' + Id);
            document.querySelector('.pdfHighlight#' + Id).parentNode.removeChild(node);
          }
      }
/*Function to get RGBA Color Values from HEX Color Code*/
      _this.convertHexToRgba = function(hex,opacity)
      {
        var r,g,b,a;
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
        if(opacity == 0)
        {
          a=0;
        }
        else
        {
          a= opacity/100;
        }
        rgba = 'rgba('+r+','+g+','+b+','+a+')';
        return rgba;
      }
/*Function to render regions/hotspots on the page*/
      displayRegions = function(hotspots,hotspotFeatures) {
       try
       {
        if(hotspots.length>0)
        {
          var parentPageElement = document.getElementById('docViewer_ViewContainer_PageContainer_0');
          var regionType,mySpan,icon,iconArt,regionElement,iconDiv;
          var widthScale,heightScale;
          const pageWidth = $("#docViewer_ViewContainer_BG_0").width();
          const pageHeight = $("#docViewer_ViewContainer_BG_0").height();
          const originalPdfWidth = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageWidth();
          const originalPdfHeight = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageHeight();
          widthScale = pageWidth / originalPdfWidth;
          heightScale = pageHeight / originalPdfHeight;
          for(var i=0;i<hotspots.length;i++)
            {
              try{
              $('#'+ 'region' + hotspots[i].regionID).remove();
              $('#'+ 'icon' + hotspots[i].regionID).remove();
              }
              catch(e){
              }                 
              regionType=hotspots[i].iconTypeID;
              if(regionType !== 1)
              {
                  iconArt = hotspots[i].imagePath;
                  if(!(/^http:\/\//i.test(iconArt)) && !(/^https:\/\//i.test(iconArt)))
                  {
                    iconArt = 'https://' + hotspots[i].imagePath ;
                  }
                  else if(/^http:\/\//i.test(iconArt))
                  {
                    var link=iconArt.substring(4);
                    iconArt = 'https' + link ;                     
                  }
              }
              regionElement=document.createElement('div');
              regionElement.setAttribute('id','region' + hotspots[i].regionID);
              regionElement.setAttribute('name',hotspots[i].name);
              regionElement.style.left= (hotspots[i].x * widthScale)  + 'px';
              regionElement.style.top= (hotspots[i].y * heightScale) + 'px';
              regionElement.style.width=(hotspots[i].width * widthScale) + 'px';
              regionElement.style.height=(hotspots[i].height * heightScale) + 'px';

              iconDiv=document.createElement('div');

              if (regionType == 1)
              {
                if(hotspots[i].transparent == true || hotspotFeatures.isunderlinehotspot == true)
                {
                  regionElement.style.background = convertHexToRgba(hotspotFeatures.hotspotcolor,0);
                  regionElement.onmouseover = function(event){
                    _this.triggerEvent("RegionHovered", event.currentTarget.id);
                  }
                  regionElement.onmouseout = function(event){
                    _this.triggerEvent("RegionUnhovered", event.currentTarget.id);
                  }
                }
                else
                {
                  regionElement.style.background = convertHexToRgba(hotspotFeatures.hotspotcolor,hotspotFeatures.regionhotspotalpha);
                }

                if(hotspotFeatures.isunderlinehotspot == true && hotspots[i].transparent !== true)
                {
                  regionElement.style.borderBottomColor = hotspotFeatures.underlinehotspotcolor;
                  regionElement.style.borderBottomWidth = hotspotFeatures.underlinehotspotthickness + 'px';
                  regionElement.style.borderBottomStyle = 'solid';             
                }
                else if(hotspotFeatures.isunderlinehotspot == true && hotspots[i].transparent == true)
                {
                  regionElement.style.borderBottomColor = convertHexToRgba(hotspotFeatures.underlinehotspotcolor,0);
                  regionElement.transparent = true;
                }
              }
              else
              {
                iconDiv.setAttribute('id','icon' + hotspots[i].regionID);
                iconDiv.setAttribute('name','icon' + hotspots[i].name);
                iconDiv.style.width=(hotspots[i].width * widthScale) + 'px';
                iconDiv.style.height=(hotspots[i].height * heightScale) + 'px';
                iconDiv.style.left= (hotspots[i].x * widthScale)  + 'px';
                iconDiv.style.top= (hotspots[i].y * heightScale) + 'px';
                iconDiv.style.backgroundImage = 'url('+iconArt+')';
                iconDiv.style.opacity = hotspotFeatures.iconhotspotalpha/100;
                iconDiv.style.backgroundSize = 'cover';
              }
              regionElement.className='hotspot';
              iconDiv.style.position='absolute';
              tooltip = document.createElement('span')
              tooltip.className='tooltiptext';
              tooltip.innerHTML = hotspots[i].name;
              if(hotspots[i].regionTypeID !== 5)
              {
                 regionElement.onclick =function(event) { 
                 _this.triggerEvent("regionClicked", event.currentTarget.id);                                  
                 }
              }
              regionElement.appendChild(tooltip);
              parentPageElement.appendChild(iconDiv);
              parentPageElement.appendChild(regionElement);
            }
        }
      }
      catch(e){}
      }


      _this.reRenderHighlightCornerImages = function(highlights) {
        _this.removeExistingHighlightCornerImages();
        var linewiseHighlightList = [];
        try {
          for (var i = 0; i < highlights.length; i++) {
            if (highlights[i].comment !== '') {
                var hId = highlights[i].id;
                var parentHighlightElement = $('#' + hId);
                var highlightHashList = parentHighlightElement[0].children;
                if (linewiseHighlightList.length === 0) {
                    var cordStatusObj = {
                        top: parseInt(highlightHashList[0].offsetTop, 10),
                        bottom: parseInt((highlightHashList[0].offsetHeight + highlightHashList[0].offsetTop), 10),
                        highlightList: [],
                        totalNoOfhighlights: 1
                    };
                    highlights[i].leftpos = highlightHashList[0].offsetLeft;
                    cordStatusObj.highlightList.push(highlights[i]);
                    linewiseHighlightList.push(cordStatusObj);
                } else {
                    var isCurHighlightOnSameLine = false;
                    for (var k = 0; k < linewiseHighlightList.length; k++) {
                        for (var l = 0; l < highlightHashList.length; l++) {
                            if (parseInt(linewiseHighlightList[k].top, 10) >= parseInt(highlightHashList[l].offsetTop, 10) &&
                                parseInt(linewiseHighlightList[k].bottom, 10) <= parseInt((highlightHashList[l].offsetHeight + highlightHashList[l].offsetTop), 10)) {
                                linewiseHighlightList[k].totalNoOfhighlights = linewiseHighlightList[k].totalNoOfhighlights + 1;
                                highlights[i].leftpos = highlightHashList[0].offsetLeft;
                                linewiseHighlightList[k].highlightList.push(highlights[i]);
                                isCurHighlightOnSameLine = true;
                                break;
                            }
                        }
                        if (isCurHighlightOnSameLine === true) {
                            break;
                        }
                    }
                    if (!isCurHighlightOnSameLine) {
                        var cordStatusObj = {
                            top: parseInt(highlightHashList[0].offsetTop, 10),
                            bottom: parseInt((highlightHashList[0].offsetHeight + highlightHashList[0].offsetTop), 10),
                            highlightList: [],
                            totalNoOfhighlights: 1
                        };
                        highlights[i].leftpos = highlightHashList[0].offsetLeft;
                        cordStatusObj.highlightList.push(highlights[i]);
                        linewiseHighlightList.push(cordStatusObj);
                    }
                }
            }
        }
        linewiseHighlightList.sort(function(lh1, lh2){return (lh1.top - lh2.top)});
        var parentElement = document.createElement('div');
        parentElement.setAttribute("id", "highlightcornerimages");
        var finaltop = 0;
        var isOverlap;
        for (var m = 0; m < linewiseHighlightList.length; m++) {
            isOverlap = false;
            if ((finaltop + 32) > linewiseHighlightList[m].top) {
                isOverlap = true;
            }
            var highlightList1 = linewiseHighlightList[m].highlightList;
            highlightList1.sort(function(lh1, lh2){return (lh1.leftpos - lh2.leftpos)});
            for (var n = 0; n < highlightList1.length; n++) {
                finaltop = finaltop + 32;
                var highlightColor = highlightList1[n].color;
                var childElement = document.createElement('span');
                childElement.classList.add('annotator-handle');
                childElement.setAttribute("id",highlightList1[n].id+"_cornerimg");
                var hId = highlightList1[n].id;
                var pageLeft = $("#docViewer_ViewContainer").offset().left;
                var pageWidth = $("#docViewer_ViewContainer").width();
                var parentHighlightElement = $('#' + hId);
                var childHighlightElement = parentHighlightElement[0].children[0];
                if (!isOverlap) {
                    finaltop = childHighlightElement.offsetTop;
                    isOverlap = true;
                }
                var finalleft = (pageLeft + pageWidth) - ($(".fwr-page").offset().left + 287 + 32);
                childElement.style.left = finalleft + "px";
                childElement.style.top = (finaltop - 5) + "px";
                childElement.style.position = "absolute";
                childElement.style.backgroundColor = highlightColor;
                childElement.style.visibility = "visible";
                _this.setClickEvent(childElement, hId, (finaltop + 5));
                parentElement.appendChild(childElement);
            }
        }
        var parentPageElement = document.getElementById('docViewer_ViewContainer_PageContainer_0');
        parentPageElement.appendChild(parentElement);

      } catch (e) {}
    }

    _this.setClickEvent = function(childElement, hId, top) {
        childElement.onclick = function() {
            var data = {
              highlightId: hId,
              cornerFoldedImageTop: top
            }
          _this.triggerEvent("highlightClicked", data);
        }
      }

      _this.getCurrentPage = function() {
         try{
          var currPage = WebPDF.ViewerInstance.getCurPageIndex();
          return currPage;
        } catch(e){return null;}
          
        }
        _this.getPageCount = function(){

         try{
          var pageCount = WebPDF.ViewerInstance.getPageCount();
          return pageCount;
        } catch(e){return null;  
        }
      }
      /*
       This method is used to initiate a Original Foxit PDF object.
      */
      _this.createPDFViewer = function(pdfConfig) {
        initViewer(pdfConfig);
      }

      _this.loadPDFViewer = function(){
        loadLocalAssets();
      }

      /*
       * This method gets asset URL to download PDF as images from Foxit
      */
      _this.createPDFDownloader = function(pdfConfig, cb) {
        getAssetURLForPDFDownload(pdfConfig, cb);
      }
      
      /*
       This method is used to create a TOC content for the loaded asset.
      */
      _this.createTOCContent = function() {
        var TOCArray = tocObj.initbmPanel();
        return TOCArray;
      }

      _this.gotoPDFNode = function(nodeId) {
        return tocObj.gotoPDFNode(nodeId);
      }
      /* This method is called to Download the PDF currently in the Viewer Instance
      */
      _this.downloadPDF = function() {
        try{
          WebPDF.ViewerInstance.downloadPDF();
        }catch(e){

        }
      }
      /*Set Page Navigation */
      _this.setPageNavigation = function(style) {
        try{
          if(style == "horizontal"){
            WebPDF.ViewerInstance.setLayoutShowMode(2);
            document.querySelector('.fwrJspVerticalBar').style.visibility = "hidden";
          }else{
            document.querySelector('.fwrJspVerticalBar').style.visibility = "visible";
          }
        }catch(e){}
      }
      /*
       This method is used create Highlight Element on the Page.
      */
      _this.saveHighlight = function(pageIndex, highlightHash, id, highlightColor) { 
        var highlightElements = document.querySelectorAll('.fwr-search-text-highlight');
        var parentElement = document.createElement('div');
        parentElement.setAttribute('id', id);
        parentElement.setAttribute("highlight-hash", highlightHash);
        parentElement.classList.add('pdfHighlight');
        for(var i=0; i<highlightElements.length; i++) {
          var childElement = document.createElement('div');
          childElement.classList.add('fwr-highlight-annot');
          childElement.setAttribute("page-index", pageIndex);
          childElement.setAttribute('id', id);
          childElement.style.left = highlightElements[i].style.left;
          childElement.style.top = highlightElements[i].style.top;
          childElement.style.width = highlightElements[i].style.width;
          childElement.style.height = highlightElements[i].style.height;
          childElement.style.backgroundColor = highlightColor ;
          childElement.onclick = function() {
            if($("#"+id+"_cornerimg")[0] !== undefined)
            {
              var cornerFoldedImageTop = $("#"+id+"_cornerimg")[0].offsetTop;
              var marginTop = $("#"+id+"_cornerimg").css('marginTop').replace('px', '');
              cornerFoldedImageTop = cornerFoldedImageTop + parseInt(marginTop,10);
              var data = {
                highlightId: id,
                cornerFoldedImageTop: cornerFoldedImageTop
              }
              _this.triggerEvent("highlightClicked", data);
            }
            else
            {
              _this.triggerEvent("highlightClicked", id);
            }
          }
          parentElement.appendChild(childElement);
        }
        var parentPageElement = document.getElementById('docViewer_ViewContainer_PageContainer_' + String(pageIndex - 1));
        parentPageElement.appendChild(parentElement);
        $('.fwr-search-text-highlight').remove();
      }
      /*
       This method is used to create a Highlight for the Selected Text.
      */
      _this.createHighlight = function() {
        var serializedHighlight = "";
        var highlight = {};
        var hId = _this.generateUUID();
        var selectedTextRect = WebPDF.ViewerInstance.getPluginByName( WebPDF.TextSelectPluginName).getSelectedTextRectInfo();
        for(var i=0; i<selectedTextRect.length; i++) {
          serializedHighlight = "[";
          var selectedRect = selectedTextRect[i].selectedRectArray;
          var pageIndex = selectedTextRect[i].pageIndex;
          //var hId = _this.generateUUID();
          for(var j=0; j<selectedRect.length; j++) {
            if(j!==0) {
              serializedHighlight = serializedHighlight + ',' ;
            }
                var PDFRect = selectedRect[j];                
               serializedHighlight = serializedHighlight + "{\"left\":\""  + parseFloat(PDFRect.left).toFixed(6) + "\",\"top\":\""  + parseFloat(PDFRect.top).toFixed(6) + "\",\"right\":\""  + parseFloat(PDFRect.right).toFixed(6) + "\",\"bottom\":\"" + parseFloat(PDFRect.bottom).toFixed(6) + "\"}";
          }  
          serializedHighlight = serializedHighlight + "]" + "@0.000000" ;
          highlight.serializedHighlight = serializedHighlight;
          highlight.selection = WebPDF.ViewerInstance.getCurToolHandler().getTextSelectTool().getSelectedText();
          highlight.pageInformation = {
             pageNumber: pageIndex + 1,
             pageId: pageIndex
            }
          WebPDF.ViewerInstance.highlightText(pageIndex, selectedRect);
          //_this.saveHighlight((pageIndex + 1), serializedHighlight, hId);
        }

        WebPDF.ViewerInstance.getCurToolHandler().getTextSelectTool().clearSelection();
        try{
        document.querySelector('.docViewer').click();  
      }catch(e){}
        
        return highlight ; 
      }
      

      _this.gotoPdfPage = function(pageNumber, top) {
        //console.log("PDF Wrapper Goto : " + pageNumber + " : " + top);
        WebPDF.ViewerInstance.gotoPage(pageNumber, 0 ,  top);

      }
      /* Get Current Zoom Level */  
       _this.getCurrentZoomLevel = function() {
         return WebPDF.ViewerInstance.getCurZoomLevel();
        }
         /*Add navigation track to the Local Storage Stack
      */
      _this.addToNavigationStack = function(currentPage, hrefLocation) {
         var currentStack = [];
         var stackSize = parseInt(_this.getStackSize());
       currentStack = JSON.parse(localStorage.getItem("currentStack")) ? JSON.parse(localStorage.getItem("currentStack")) : [];
       if(currentStack){
          if(currentStack.length == stackSize){
          currentStack.shift();
        }       
      }
      var navObj = {
       "currentPage" : currentPage,
       "hrefLocation" : hrefLocation
      }
      currentStack.push(navObj);
      localStorage.setItem("currentStack", JSON.stringify(currentStack));
      }
        /*This function returns the Stack Size for Back button implementation 
      */
      _this.getStackSize = function() {
        try{
          if(window.localStorage) {
          return window.localStorage.getItem('stackSize') ? window.localStorage.getItem('stackSize') : 1;
          }
        }catch(e){
          return 1;
        }     
      }
       /* Set Current Zoom Level */ 
        _this.setCurrentZoomLevel = function(level) {
          WebPDF.ViewerInstance.zoomTo(level);
        }

      _this.getScrollLocation = function(highlightHash) {
        //console.log("PDF Wrapper Goto : " + pageNumber + " : " + top);
        // WebPDF.ViewerInstance.gotoPage(pageNumber, 0 ,  top);
                var highlightHashRect = highlightHash.split("@")[0];
                var page = highlightHash.split("@")[1].split("$")[1];
                if(page) {
                var highLightHashArray = highlightHashRect.split(":");
                var PDFRect = new WebPDF.PDFRect();
                PDFRect.left = parseFloat(highLightHashArray[1].split(',')[0]);
                PDFRect.top = parseFloat(highLightHashArray[2].split(',')[0]);
                PDFRect.right = parseFloat(highLightHashArray[3].split(',')[0]);
                PDFRect.bottom = parseFloat(highLightHashArray[4].split('}')[0]);
                var a = WebPDF.ViewerInstance.getDocView().getPageView(parseInt(page) - 1);
                var g = WebPDF.RectUtils;
                var n = PDFRect;
                g.normalize(n); 
                n = a.pdfRectToDevice(n, !0);
                var top = parseInt(n.top);
                return top;
               }
      }

       _this.generateUUID = function(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
     }
      _this.openFileUrl = function(baseUrl,fileUrl,headerParams,callback){
        var assertUrl = openFile(baseUrl,fileUrl,headerParams,callback);
        return assertUrl;
      }

      return {

        getScrollLocation: function(highlightHash) {
        var top = _this.getScrollLocation(highlightHash);
        },
        /*
          Triggers a method to call the PDFViewer.
        */
        restoreHighlights: function(highlights) {
          var currPage = _this.restoreHighlights(highlights);
        },

        reRenderHighlightCornerImages: function(highlights) {
         _this.reRenderHighlightCornerImages(highlights);
        },

        removeExistingHighlightCornerImages: function() {
         _this.removeExistingHighlightCornerImages();
        },
        
        removeHighlightElement: function(id)
        {
          _this.removeHighlightElement(id);
        },
        displayRegions:function(hotspots,hotspotFeatures){
          var currPage = displayRegions(hotspots,hotspotFeatures);
        },     
        /*Get the total Number of Pages in the PDF*/    
         getPageCount: function() {
          var pageCount = _this.getPageCount();
          return pageCount;
        },
         /*
          Get the Current Page Index.
        */
        getCurrentPage: function() {
          var currPage = _this.getCurrentPage();
          return currPage;
        },
        /*
          Triggers a method to call the PDFViewer.
        */
        createPDFViewer: function(pdfConfig) {
          _this.createPDFViewer(pdfConfig);
        },

        loadPDFViewer: function(pdfConfig) {
          _this.loadPDFViewer(pdfConfig);
        },

        createPDFDownloader: function(pdfConfig, cb) {
          _this.createPDFDownloader(pdfConfig, cb);
        },
        /*
          Triggers a method to create TOC Content.
        */
        createTOCContent: function() {
          var TOCArray = _this.createTOCContent();
          return TOCArray;
        },
        gotoPDFNode: function(nodeId) {
           var pageIndex = _this.gotoPDFNode(nodeId);
           return pageIndex;
        },
         /* Download the PDF File */
        downloadPDF: function() {
          _this.downloadPDF();
        },
        /*
        This method enables the UI to register for certain book events.
        */
        registerEvent: function(eventName, callbackMethod) {
          eventMap[eventName] = callbackMethod;
        },
        /*Set Navigation Layout (SinglePage/Vartical)
        */
        setPageNavigation: function(style){
          _this.setPageNavigation(style);
        },
         /*
        This method enables the UI to register for certain book events.
        */
        createHighlight: function() {
         var highlight =  _this.createHighlight();
         return highlight;
        },
        enableSelectTool: function(){
          try{
            WebPDF.ViewerInstance.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
          }catch(e){}
        },
        gotoPdfPage: function(pageNumber, top) {
          _this.gotoPdfPage(pageNumber, top);
        },
        getInternalLinkToPageNumber: function(pageNumber, annotID) {
          var toPage = WebPDF.ViewerInstance.getDocView().getPageView(pageNumber).getPDFPage().getAnnotByName(annotID).getAction().actionJSONData.ds.p
          return toPage;
        },
        getCurrentZoomLevel: function() {
          if(WebPDF) {
            var curZoomLevel = _this.getCurrentZoomLevel();
            return curZoomLevel;
        }else {
          return 1;
        }
        },
        getPageForNodeId: function(nodeId) {
           try {     
               var  tocInstance =   WebPDF.ViewerInstance.getBookmark();
               tocInstance.moveToRoot();
               // var nodeId = parseInt(event.target.getAttribute("nodeid"));
               var isFind = tocInstance.getNode(nodeId);
               if(isFind){
                 var count = tocInstance.countActions();
                 for(var i = 0; i<count ;i++ ){
                  var action =  tocInstance.getAction(i);
                  var des = action.getDestination();
                  WebPDF.ViewerInstance.gotoPageByDestination(des);
                 }
                 // triggerEvent("onpageChange");
                 return des.pageIndex;
               }
            }
            catch (ex) {
               //console.error(ex);
            }
        },
        setCurrentZoomLevel: function(level) {
          _this.setCurrentZoomLevel(level);
        },
        openFileUrl : function(baseUrl,fileUrl,headerParams,callback){
          var assertUrl = _this.openFileUrl(baseUrl,fileUrl,headerParams,callback);
          return assertUrl;
        }
      };
    }
    return pdfWrapper;
}));