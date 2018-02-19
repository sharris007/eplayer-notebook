window.eventMap = [];
let docViewerId = 'docViewer';

export function triggerEvent (eventName, eventData) {
    var eventCallback = eventMap[eventName];
    if (eventCallback != null) {
        eventCallback(eventData);
      }
}

export function registerEvent(eventName, callbackMethod) {
          eventMap[eventName] = callbackMethod;
}

export function Resize() {
    let height = $(window).height();

    let headHeight = $('#header').outerHeight();
    let unSupportTipsHeight = $('#notSupportBrowser').outerHeight();


    let rightHeight = height;
    if ($('#header').is(':visible')) {
        rightHeight = height - headHeight;
    }
    if ($('#notSupportBrowser').is(':visible')) {
        rightHeight = height - unSupportTipsHeight;
    }
    $('#right').height(rightHeight);

    //$("#setting .tools").height(height - 130);

    if ($('#homepage').length == 0 || $('#homepage').is(':hidden')) {//show docviewer, homepage is hidden.
        updateLayer();
    }
}

function updateLayer() {
    let toolBar = $("#toolbar");
    let inkSignList = $('#' + Configs.InkSignListId);
    let docViewerHeight= $('#' + docViewerId).height();
    let docViewerWidth = $('#' + docViewerId).width();
    let docViewerOffsetLeft = $('#' + docViewerId)[0].offsetLeft;

    let width = $(window).width();
    let height = $("#right").height();
    let topOffset = toolBar.is(":visible") ? toolBar.outerHeight() - 2 : 0;
    let rightOffset = inkSignList.is(":visible") ? inkSignList.outerWidth() : 0;

    inkSignList.height(height - topOffset);
    
    let viewHeight = height - topOffset - 160;
    let viewWidth = width - rightOffset;

    if(!viewHeight){
        viewHeight = docViewerHeight?docViewerHeight:$(window).height();
    }

    if(!viewWidth || viewWidth < 0){
        viewWidth = docViewerWidth?docViewerWidth + docViewerOffsetLeft:$(window).width();
    }

    // reset the css style value for each visible elements
    // reset the size of viewer object.
    $('#' + docViewerId).css({
        "margin-right" : rightOffset,
        'width': viewWidth,
        'height': viewHeight
    });

    if (typeof (WebPDF) == 'undefined' || WebPDF.ViewerInstance == null)
        return;
    // Recalculate the width and height of PDF viewer.
    WebPDF.ViewerInstance.updateLayout(viewWidth, viewHeight);
}

export function addEventListenersForWebPDF() {
  /*Document loaded event listener*/
  WebPDF.ViewerInstance.on(WebPDF.EventList.DOCUMENT_LOADED, onDocLoad);
  /*Page change event listener*/
  WebPDF.ViewerInstance.on(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, onPageChange)
  /*Page loaded event listener*/
  WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_SHOW_COMPLETE, onPageLoad);
}

export function removeEventListenersForWebPDF() {
 /*Document loaded event listener*/
  WebPDF.ViewerInstance.off(WebPDF.EventList.DOCUMENT_LOADED, onDocLoad);
  /*Page change event listener*/
  WebPDF.ViewerInstance.off(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, onPageChange)
  /*Page loaded event listener*/
  WebPDF.ViewerInstance.off(WebPDF.EventList.PAGE_SHOW_COMPLETE, onPageLoad);
}

function onDocLoad(){
  WebPDF.ViewerInstance.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
}

function onPageChange(){
  Resize();
  window.addEventListener('resize', Resize);
}

function onPageLoad(){
  triggerEvent('pageLoaded');
}