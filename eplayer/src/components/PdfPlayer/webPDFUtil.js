/* global WebPDF, getLanguage, $, Configs, eventMap */
window.eventMap = [];
const docViewerId = 'docViewer';

export function triggerEvent(eventName, eventData) {
  const eventCallback = eventMap[eventName];
  if (eventCallback != null) {
    eventCallback(eventData);
  }
}

export function registerEvent(eventName, callbackMethod) {
  eventMap[eventName] = callbackMethod;
}

function updateLayer() {
  const toolBar = $('#toolbar');
  const inkSignList = $(`#${Configs.InkSignListId}`);
  const docViewerHeight = $(`#${docViewerId}`).height();
  const docViewerWidth = $(`#${docViewerId}`).width();
  const docViewerOffsetLeft = $(`#${docViewerId}`)[0].offsetLeft;

  const width = $(window).width();
  const height = $('#right').height();
  const topOffset = toolBar.is(':visible') ? toolBar.outerHeight() - 2 : 0;
  const rightOffset = inkSignList.is(':visible') ? inkSignList.outerWidth() : 0;

  inkSignList.height(height - topOffset);

  let viewHeight = height - topOffset - 160;
  let viewWidth = width - rightOffset;

  if (!viewHeight) {
    viewHeight = docViewerHeight || $(window).height();
  }

  if (!viewWidth || viewWidth < 0) {
    viewWidth = docViewerWidth ? docViewerWidth + docViewerOffsetLeft : $(window).width();
  }

    // reset the css style value for each visible elements
    // reset the size of viewer object.
  $(`#${docViewerId}`).css({
    'margin-right': rightOffset,
    width: viewWidth,
    height: viewHeight
  });

  if (typeof (WebPDF) === 'undefined' || WebPDF.ViewerInstance === null) { return; }
    // Recalculate the width and height of PDF viewer.
  WebPDF.ViewerInstance.updateLayout(viewWidth, viewHeight);
}

export function resize() {
  const height = $(window).height();

  const headHeight = $('#header').outerHeight();
  const unSupportTipsHeight = $('#notSupportBrowser').outerHeight();


  let rightHeight = height;
  if ($('#header').is(':visible')) {
    rightHeight = height - headHeight;
  }
  if ($('#notSupportBrowser').is(':visible')) {
    rightHeight = height - unSupportTipsHeight;
  }
  $('#right').height(rightHeight);

    // $("#setting .tools").height(height - 130);

  if ($('#homepage').length === 0 || $('#homepage').is(':hidden')) { // show docviewer, homepage is hidden.
    updateLayer();
  }
}

function onDocLoad() {
  WebPDF.ViewerInstance.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
}

function onPageChange() {
  resize();
  triggerEvent('pageChanged');
  window.addEventListener('resize', resize);
}

function onPageLoad() {
  triggerEvent('pageLoaded');
}

function addEventListenersForWebPDF() {
  setInterval(loadAccessibilityContent, 1000);
  /* Document loaded event listener*/
  WebPDF.ViewerInstance.on(WebPDF.EventList.DOCUMENT_LOADED, onDocLoad);
  /* Page change event listener*/
  WebPDF.ViewerInstance.on(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, onPageChange);
  /* Page loaded event listener*/
  WebPDF.ViewerInstance.on(WebPDF.EventList.PAGE_SHOW_COMPLETE, onPageLoad);
}

export function initializeWebPDF(baseUrl, pageToLoad) {
  if (!window.WebPDF) {
    const script1 = document.createElement('SCRIPT');
    script1.src = `${baseUrl}scripts/jquery-1.10.2.min.js`;
    script1.async = false;
    const script2 = document.createElement('SCRIPT');
    script2.src = `${baseUrl}scripts/jquery-migrate-1.2.1.js`;
    script2.async = false;
    const script3 = document.createElement('SCRIPT');
    script3.src = `${baseUrl}scripts/jquery-ui.min.js`;
    script3.async = false;
    const script4 = document.createElement('SCRIPT');
    script4.src = `${baseUrl}scripts/jquery.form.min.js`;
    script4.async = false;
    const script5 = document.createElement('SCRIPT');
    script5.src = `${baseUrl}scripts/release_websdk/webpdf.tools.mini.js`;
    script5.async = false;
    const script6 = document.createElement('SCRIPT');
    script6.src = `${baseUrl}scripts/control/common/common.js`;
    script6.async = false;
    const script7 = document.createElement('SCRIPT');
    script7.src = `${baseUrl}scripts/config/apiConfig.js`;
    script7.async = false;
    const script8 = document.createElement('SCRIPT');
    script8.src = `${baseUrl}scripts/config/config.js`;
    script8.async = false;
    const script9 = document.createElement('SCRIPT');
    script9.src = '/eplayer/pdf/foxit_client_lib/webpdf.mini.js';
    script9.async = false;
    script9.onload = () => {
      const optionsParams = {
        language: getLanguage(),
        serverBaseUrl: baseUrl,
        baseUrl
      };
      WebPDF.ready(docViewerId, optionsParams).then(() => {
        addEventListenersForWebPDF();
        triggerEvent('viewerReady', pageToLoad);
      });
    };
    document.body.appendChild(script1);
    document.body.appendChild(script2);
    document.body.appendChild(script3);
    document.body.appendChild(script4);
    document.body.appendChild(script5);
    document.body.appendChild(script6);
    document.body.appendChild(script7);
    document.body.appendChild(script8);
    document.body.appendChild(script9);
  } else {
    const optionsParams = {
      language: getLanguage(),
      serverBaseUrl: baseUrl,
      baseUrl
    };
    WebPDF.ready(docViewerId, optionsParams).then(() => {
      addEventListenersForWebPDF();
      triggerEvent('viewerReady', pageToLoad);
    });
  }
}

export function removeEventListenersForWebPDF() {
 clearInterval(loadAccessibilityContent, 1000);
 /* Document loaded event listener*/
  WebPDF.ViewerInstance.off(WebPDF.EventList.DOCUMENT_LOADED, onDocLoad);
  /* Page change event listener*/
  WebPDF.ViewerInstance.off(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, onPageChange);
  /* Page loaded event listener*/
  WebPDF.ViewerInstance.off(WebPDF.EventList.PAGE_SHOW_COMPLETE, onPageLoad);
}

 function loadAccessibilityContent() {
   try {
     const currentPage = WebPDF.ViewerInstance.getCurPageIndex();
     let divElement = $('.screenReaderText');
     if (divElement.length === 0) {
       divElement = document.createElement('div');
       divElement.className = 'screenReaderText';
       divElement.setAttribute('tabindex', 1);
    } else {
       divElement = divElement[0];
     }
     let textForElement = '';
     const currTextPage = WebPDF.ViewerInstance.getToolHandlerByName(WebPDF.ViewerInstance
       .getCurToolHandlerName()).getTextSelectService().getTextPage(currentPage).textPage;
     if (currTextPage) {
       textForElement = currTextPage.getPageAllText();
     }
     if (textForElement !== window.textForElement) {
       try {
         const docViewer = $(`#docViewer_ViewContainer_PageContainer_${currentPage}`);
         const firstElement = docViewer[0];
         firstElement.setAttribute('aria-label', textForElement);
         firstElement.setAttribute('tabindex', '1');
       } catch (e) {
         // error
       }
       divElement.innerText = textForElement;
       const docViewerElement = $('#docViewer');
       const firstChild = docViewerElement[0].firstChild;
       if ($('.screenReaderText').length === 0) {
         docViewerElement[0].insertBefore(divElement, firstChild);
       }
       window.textForElement = textForElement;
     }
   } catch (e) {
     // error
   }
 }
