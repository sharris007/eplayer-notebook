/* global $, WebPDF */
import { triggerEvent } from '../webPDFUtil';

export function getSelectionInfo() {
  let highlightHash = '';
  const highlight = {};
  const curToolHandlerName = WebPDF.ViewerInstance.getCurToolHandlerName();
  const selectedTextRect = WebPDF.ViewerInstance.getToolHandlerByName(curToolHandlerName)
  .getTextSelectService().getSelectedTextRectInfo();
  for (let i = 0; i < selectedTextRect.length; i++) {
    highlightHash = '[';
    const selectedRect = selectedTextRect[i].selectedRectArray;
    const pageIndex = selectedTextRect[i].pageIndex;
    for (let j = 0; j < selectedRect.length; j++) {
      if (j !== 0) {
        highlightHash += ',';
      }
      const PDFRect = selectedRect[j];
      highlightHash = `${highlightHash}{"left":"${parseFloat(PDFRect.left).toFixed(6)}","top":"${parseFloat(PDFRect.top).toFixed(6)}","right":"${parseFloat(PDFRect.right).toFixed(6)}","bottom":"${parseFloat(PDFRect.bottom).toFixed(6)}"}`;
    }
    highlightHash = `${highlightHash}]` + '@0.000000';
    // console.log(highlightHash);
    highlight.highlightHash = highlightHash;
    highlight.selection = WebPDF.ViewerInstance
    .getToolHandlerByName(curToolHandlerName).getTextSelectService().getSelectedText();
    highlight.pageInformation = {
      pageNumber: pageIndex + 1,
      pageId: pageIndex
    };
    WebPDF.ViewerInstance.highlightText(pageIndex, selectedRect);
  }
      /* try{
        document.querySelector('.docViewer').click();
      }catch(e){}*/
  return highlight;
}

function saveHighlight(pageIndex, highlightHash, id, highlightColor, isHighlightOnly) {
  const highlightElements = document.querySelectorAll('.fwr-search-text-highlight');
  const parentElement = document.createElement('div');
  parentElement.setAttribute('id', id);
  parentElement.setAttribute('highlight-hash', highlightHash);
  parentElement.classList.add('pdfHighlight');
  for (let i = 0; i < highlightElements.length; i++) {
    const childElement = document.createElement('div');
    childElement.classList.add('fwr-highlight-annot');
    childElement.setAttribute('page-index', pageIndex);
    childElement.setAttribute('id', id);
    childElement.style.left = highlightElements[i].style.left;
    childElement.style.top = highlightElements[i].style.top;
    childElement.style.width = highlightElements[i].style.width;
    childElement.style.height = highlightElements[i].style.height;
    childElement.style.backgroundColor = highlightColor;
    if (!isHighlightOnly) {
      childElement.onclick = () => {
        if ($(`#${id}_cornerimg`)[0] !== undefined) {
          let cornerFoldedImageTop = $(`#${id}_cornerimg`)[0].offsetTop;
          const marginTop = $(`#${id}_cornerimg`).css('marginTop').replace('px', '');
          cornerFoldedImageTop += parseInt(marginTop, 10);
          const data = {
            highlightId: id,
            cornerFoldedImageTop
          };
          triggerEvent('highlightClicked', data);
        } else {
          triggerEvent('highlightClicked', id);
        }
      };
    }
    parentElement.appendChild(childElement);
  }
  const parentPageElement = document
    .getElementById(`docViewer_ViewContainer_PageContainer_${WebPDF.ViewerInstance.getCurPageIndex()}`);
  parentPageElement.appendChild(parentElement);
  $('.fwr-search-text-highlight').remove();
}

export function restoreHighlights(highlights) {
  // let scrollPercentage = 0;
  // try {
  //   scrollPercentage = WebPDF.ViewerInstance.getDocView().getScrollApi().getPercentScrolledY();
  // } catch (e) {
  //   // error
  // }
  $('.pdfHighlight').remove();
  // const mainDiv = [];
  for (let i = 0; i < highlights.length; i++) {
    try {
      const childDiv = [];
      const highlightHashes = highlights[i].highlightHash;
      const highlightDiv = document.createElement('div');
      highlightDiv.classList.add('pdfHighlight');
      const page = highlights[i].pageId || null;
      const highlightHash = highlightHashes
        .split('@')[0].trim().replace(/(\r\n|\n|\r)/gm, '').replace(/['"]+/g, '');
      // const outerHash = highlightHashes.split('@')[1];
      const hId = highlights[i].id;
      const highlightColor = highlights[i].color;
      let highLightHashArray = [];
      highLightHashArray = highlightHash.split(':');
      if (page !== null || page !== undefined) {
        const pdfRectArray = [];
        for (let j = 0; j < highLightHashArray.length - 1; j += 4) {
          childDiv[i] = document.createElement('div');
          childDiv[i].setAttribute('id', hId);
          childDiv[i].setAttribute('page-index', page);
          childDiv[i].classList.add('fwr-highlight-annot');
          const PDFRect = new WebPDF.PDFRect();
          const firstKey = highLightHashArray[j].split('{')[1].trim();
          const secondKey = highLightHashArray[j + 1].split(',')[1].trim();
          const thirdKey = highLightHashArray[j + 2].split(',')[1].trim();
          const fourthKey = highLightHashArray[j + 3].split(',')[1].trim();
          const firstValue = highLightHashArray[j + 1].split(',')[0];
          const secondValue = highLightHashArray[j + 2].split(',')[0];
          const thirdValue = highLightHashArray[j + 3].split(',')[0];
          const fourthValue = highLightHashArray[j + 4].split('}')[0];
          PDFRect[String(firstKey)] = parseFloat(firstValue);
          PDFRect[String(secondKey)] = parseFloat(secondValue);
          PDFRect[String(thirdKey)] = parseFloat(thirdValue);
          PDFRect[String(fourthKey)] = parseFloat(fourthValue);
          try {
            pdfRectArray.push(PDFRect);
          } catch (e) {
            // error
            // console.log('Error Populating Highlight');
          }
        }
        try {
                // page = childDiv[i].getAttribute("page-index");
          WebPDF.ViewerInstance.highlightText(WebPDF.ViewerInstance.getCurPageIndex(), pdfRectArray);
          saveHighlight(page, highlightHashes, hId, highlightColor, highlights[i].isHighlightOnly);
        } catch (e) {
          // error
          // console.log('Error Saving Highlight');
        }
      }
    } catch (e) {
      // error
    }
  }
         /* try{
            if(scrollPercentage === -0) {
              WebPDF.ViewerInstance.gotoPage(0);
            }else{
              WebPDF.ViewerInstance.getDocView().getScrollApi().scrollToPercentY(scrollPercentage);
            }
          }catch(e){

          }*/
}

function setClickEvent(child, hId, top) {
  const childElement = child;
  childElement.onclick = () => {
    const data = {
      highlightId: hId,
      cornerFoldedImageTop: top
    };
    triggerEvent('highlightClicked', data);
  };
}

function handleNoteIconClick(event) {
  let noteIcon;
  const pageLeft = $('#docViewer_ViewContainer').offset().left;
  const conatinerWidth = $('#docViewer_ViewContainer').width();
  const originalPosition = `${(pageLeft + conatinerWidth) - (($('.fwr-single-page').offset().left) + 271)}px`;
  const noteIconCount = $('.annotator-handle').length;
  const noteIconElementList = $('.annotator-handle');
  for (let i = 0; i < noteIconCount; i++) {
    noteIconElementList[i].style.left = originalPosition;
  }
  if ($(`#${event.currentTarget.id}`).hasClass('pdfHighlight')) {
    noteIcon = document.getElementById(`${event.currentTarget.id}_cornerimg`);
  } else {
    noteIcon = this;
  }
        // noteIcon.style.left = ((pageLeft + conatinerWidth) - (($(".fwr-page").offset().left ) + 287 + 32)) + 'px';
  noteIcon.style.left = `${parseInt(originalPosition, 10) - 48}px`;
  $('body').on('click', (e) => {
    if ($('#openPopupHighlight').is(':hidden') && noteIcon.style.left !== originalPosition) {
      noteIcon.style.left = originalPosition;
    }
  });
}

export function reRenderHighlightCornerImages(highlight) {
  const highlights = highlight;
  $('#highlightcornerimages').remove();
  const linewiseHighlightList = [];
  let cordStatusObj = {};
  let parentHighlightElement;
  try {
    for (let i = 0; i < highlights.length; i++) {
      if (highlights[i].comment !== '') {
        const hId = highlights[i].id;
        parentHighlightElement = $(`#${hId}`);
        const highlightHashList = parentHighlightElement[0].children;
        if (linewiseHighlightList.length === 0) {
          cordStatusObj = {
            top: parseInt(highlightHashList[0].offsetTop, 10),
            bottom: parseInt((highlightHashList[0].offsetHeight + highlightHashList[0].offsetTop), 10),
            highlightList: [],
            totalNoOfhighlights: 1
          };
          highlights[i].leftpos = highlightHashList[0].offsetLeft;
          cordStatusObj.highlightList.push(highlights[i]);
          linewiseHighlightList.push(cordStatusObj);
        } else {
          let isCurHighlightOnSameLine = false;
          for (let k = 0; k < linewiseHighlightList.length; k++) {
            for (let l = 0; l < highlightHashList.length; l++) {
              if (parseInt(linewiseHighlightList[k].top, 10) >= parseInt(highlightHashList[l].offsetTop, 10) &&
                  parseInt(linewiseHighlightList[k].bottom, 10) <= parseInt((highlightHashList[l].offsetHeight
                    + highlightHashList[l].offsetTop), 10)) {
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
            cordStatusObj = {
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
    linewiseHighlightList.sort((lh1, lh2) => (lh1.top - lh2.top));
    const parentElement = document.createElement('div');
    parentElement.setAttribute('id', 'highlightcornerimages');
    const pageWidth = $(`#docViewer_ViewContainer_BG_${WebPDF.ViewerInstance.getCurPageIndex()}`).width();
    const pageHeight = $(`#docViewer_ViewContainer_BG_${WebPDF.ViewerInstance.getCurPageIndex()}`).height();
    const originalPdfWidth = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageWidth();
    const originalPdfHeight = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageHeight();
    const widthScale = pageWidth / originalPdfWidth;
    const heightScale = pageHeight / originalPdfHeight;
    let finaltop = 0;
    const lineDiff = 22 * heightScale;
    let isOverlap;
    for (let m = 0; m < linewiseHighlightList.length; m++) {
      isOverlap = false;
      if ((finaltop + lineDiff) > linewiseHighlightList[m].top) {
        isOverlap = true;
      }
      const highlightList1 = linewiseHighlightList[m].highlightList;
      highlightList1.sort((lh1, lh2) => (lh1.leftpos - lh2.leftpos));
      for (let n = 0; n < highlightList1.length; n++) {
        finaltop += lineDiff;
        const highlightColor = highlightList1[n].color;
        const childElement = document.createElement('span');
        childElement.classList.add('annotator-handle');
        childElement.setAttribute('id', `${highlightList1[n].id}_cornerimg`);
        const hId = highlightList1[n].id;
        const pageLeft = $('#docViewer_ViewContainer').offset().left;
        const conatinerWidth = $('#docViewer_ViewContainer').width();
        parentHighlightElement = $(`#${hId}`);
        const childHighlightElement = parentHighlightElement[0].children[0];
        if (!isOverlap) {
          finaltop = childHighlightElement.offsetTop;
          isOverlap = true;
        }
        const finalleft = (pageLeft + conatinerWidth) - ($('.fwr-single-page').offset().left + 271);
                // var finalleft = 0.9*pageWidth;
        childElement.style.left = `${finalleft}px`;
        childElement.style.top = `${finaltop - 5}px`;
        childElement.style.position = 'absolute';
        childElement.style.backgroundColor = highlightColor;
        childElement.style.visibility = 'visible';
        childElement.style.height = `${15 * heightScale}px`;
        childElement.style.width = `${15 * widthScale}px`;
        const noteHiglightIdElement = document.getElementById(hId);
        childElement.addEventListener('click', handleNoteIconClick);
        noteHiglightIdElement.addEventListener('click', handleNoteIconClick);
        const highlightElementList = $('.fwr-highlight-annot');
        const highlightCount = $('.fwr-highlight-annot').length;
        for (let k = 0; k < highlightCount; k++) {
          highlightElementList[k].addEventListener('click', handleNoteIconClick);
        }
        setClickEvent(childElement, hId, (finaltop + 5));
        parentElement.appendChild(childElement);
      }
    }
    const parentPageElement = document
    .getElementById(`docViewer_ViewContainer_PageContainer_${WebPDF.ViewerInstance.getCurPageIndex()}`);
    parentPageElement.appendChild(parentElement);
  } catch (e) {
    // error
  }
}

export function resetHighlightedText() {
  const selectionElements = document.querySelectorAll('.fwr-search-text-highlight');
  if (selectionElements) {
    $('.fwr-search-text-highlight').addClass('fwr-hidden');
  }
}
