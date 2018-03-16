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

export function initializeWebPDF(baseUrl, pageToLoad ) {
if(!window.WebPDF){
        let script1 = document.createElement('SCRIPT');
        script1.src = `${baseUrl}scripts/jquery-1.10.2.min.js`;
        script1.async = false;
        let script2 = document.createElement('SCRIPT');
        script2.src = `${baseUrl}scripts/jquery-migrate-1.2.1.js`;
        script2.async = false;
        let script3 = document.createElement('SCRIPT');
        script3.src = `${baseUrl}scripts/jquery-ui.min.js`;
        script3.async = false;
        let script4 = document.createElement('SCRIPT');
        script4.src = `${baseUrl}scripts/jquery.form.min.js`;
        script4.async = false;
        let script5 = document.createElement('SCRIPT');
        script5.src = '/eplayer/pdf/foxit_client_lib/webpdf.tools.mini.js';
        script5.async = false;
        let script6 = document.createElement('SCRIPT');
        script6.src = `${baseUrl}scripts/control/common/common.js`;
        script6.async = false;
        let script7 = document.createElement('SCRIPT');
        script7.src = `${baseUrl}scripts/config/apiConfig.js`;
        script7.async = false;
        let script8 = document.createElement('SCRIPT');
        script8.src = `${baseUrl}scripts/config/config.js`;
        script8.async = false;
        let script9 = document.createElement('SCRIPT');
        script9.src = '/eplayer/pdf/foxit_client_lib/webpdf.mini.js';
        script9.async = false;
        script9.onload = function(){
          let optionsParams = {
          language: getLanguage(),
          serverBaseUrl: baseUrl,
          baseUrl: baseUrl
          };
          WebPDF.ready(docViewerId, optionsParams).then(function(data) {
          addEventListenersForWebPDF();
          triggerEvent('viewerReady', pageToLoad);
         })
        }
        document.body.appendChild(script1);
        document.body.appendChild(script2);
        document.body.appendChild(script3);
        document.body.appendChild(script4);
        document.body.appendChild(script5);
        document.body.appendChild(script6);
        document.body.appendChild(script7);
        document.body.appendChild(script8);
        document.body.appendChild(script9);
      }else{
        let optionsParams = {
          language: getLanguage(),
          serverBaseUrl: baseUrl,
          baseUrl: baseUrl
          };
        WebPDF.ready(docViewerId, optionsParams).then(function(data) {
        addEventListenersForWebPDF();
        triggerEvent('viewerReady', pageToLoad);
      })
    }
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

function addEventListenersForWebPDF() {
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
  triggerEvent('pageChanged');
  window.addEventListener('resize', Resize);
}

function onPageLoad(){
  triggerEvent('pageLoaded');
}