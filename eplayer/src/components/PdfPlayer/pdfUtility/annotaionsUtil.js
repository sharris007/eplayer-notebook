import { triggerEvent } from '../webPDFUtil'

export function getSelectionInfo(){
  var highlightHash = "";
  var highlight = {}
  var curToolHandlerName = WebPDF.ViewerInstance.getCurToolHandlerName();
  var selectedTextRect = WebPDF.ViewerInstance.getToolHandlerByName(curToolHandlerName).getTextSelectService().getSelectedTextRectInfo();
  for(var i=0; i<selectedTextRect.length; i++) {
        highlightHash = "[";
        var selectedRect = selectedTextRect[i].selectedRectArray;
        var pageIndex = selectedTextRect[i].pageIndex;
        for(var j=0; j<selectedRect.length; j++) {
            if(j!==0) {
              highlightHash = highlightHash + ',' ;
            }
                var PDFRect = selectedRect[j];                
               highlightHash = highlightHash + "{\"left\":\""  + parseFloat(PDFRect.left).toFixed(6) + "\",\"top\":\""  + parseFloat(PDFRect.top).toFixed(6) + "\",\"right\":\""  + parseFloat(PDFRect.right).toFixed(6) + "\",\"bottom\":\"" + parseFloat(PDFRect.bottom).toFixed(6) + "\"}";
        }  
        highlightHash = highlightHash + "]" + "@0.000000" ;
    console.log(highlightHash);
        highlight.highlightHash = highlightHash;
        highlight.selection = WebPDF.ViewerInstance.getToolHandlerByName(curToolHandlerName).getTextSelectService().getSelectedText();
        highlight.pageInformation = {
            pageNumber: pageIndex + 1,
            pageId: pageIndex
        }
          WebPDF.ViewerInstance.highlightText(pageIndex, selectedRect);
      }
      /*try{
        document.querySelector('.docViewer').click();  
      }catch(e){}*/
      return highlight
  }

export function restoreHighlights(highlights) { 
        let scrollPercentage = 0;
        try{
          scrollPercentage = WebPDF.ViewerInstance.getDocView().getScrollApi().getPercentScrolledY();           
        }catch(e){} 
        $('.pdfHighlight').remove(); 
        let mainDiv = [];     
        for (let i=0; i < highlights.length; i++)
          { 
            try{
            let childDiv = [];
            let highlightHashes = highlights[i].highlightHash;
            let highlightDiv = document.createElement('div');
                highlightDiv.classList.add('pdfHighlight');
             let page = highlights[i].pageId || null;
             let highlightHash = highlightHashes.split("@")[0].trim().replace(/(\r\n|\n|\r)/gm,"").replace(/['"]+/g, '');
             let outerHash = highlightHashes.split("@")[1];         
             let hId = highlights[i].id;
             let highlightColor = highlights[i].color;
             let highLightHashArray = [];
              highLightHashArray = highlightHash.split(":");
             if(page != null || page !=undefined)
              {
                let pdfRectArray = [];
            for(let j=0 ; j<highLightHashArray.length - 1; j=j+4) {
              
                childDiv[i] = document.createElement('div');
                childDiv[i].setAttribute("id", hId);
                childDiv[i].setAttribute("page-index", page);
                childDiv[i].classList.add('fwr-highlight-annot');
                let PDFRect = new WebPDF.PDFRect();
                let firstKey =  highLightHashArray[j].split("{")[1].trim();
                let secondKey =   highLightHashArray[j+1].split(",")[1].trim();
                let thirdKey =  highLightHashArray[j+2].split(",")[1].trim();
                let fourthKey =  highLightHashArray[j+3].split(",")[1].trim();
                let firstValue = highLightHashArray[j+1].split(',')[0];
                let secondValue = highLightHashArray[j+2].split(',')[0];
                let thirdValue = highLightHashArray[j+3].split(',')[0];
                let fourthValue = highLightHashArray[j+4].split('}')[0];
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
                // page = childDiv[i].getAttribute("page-index");
                WebPDF.ViewerInstance.highlightText(WebPDF.ViewerInstance.getCurPageIndex(), pdfRectArray);                
                saveHighlight(page, highlightHashes, hId, highlightColor, highlights[i].isHighlightOnly);
              }catch(e){
                console.log("Error Saving Highlight");
              }
             }
           }catch(e){}
          }
         /* try{
            if(scrollPercentage == -0) {
              WebPDF.ViewerInstance.gotoPage(0);
            }else{
              WebPDF.ViewerInstance.getDocView().getScrollApi().scrollToPercentY(scrollPercentage);           
            }            
          }catch(e){

          }*/
      }
function saveHighlight(pageIndex, highlightHash, id, highlightColor, isHighlightOnly) { 
        let highlightElements = document.querySelectorAll('.fwr-search-text-highlight');
        let parentElement = document.createElement('div');
        parentElement.setAttribute('id', id);
        parentElement.setAttribute("highlight-hash", highlightHash);
        parentElement.classList.add('pdfHighlight');
        for(let i=0; i<highlightElements.length; i++) {
          let childElement = document.createElement('div');
          childElement.classList.add('fwr-highlight-annot');
          childElement.setAttribute("page-index", pageIndex);
          childElement.setAttribute('id', id);
          childElement.style.left = highlightElements[i].style.left;
          childElement.style.top = highlightElements[i].style.top;
          childElement.style.width = highlightElements[i].style.width;
          childElement.style.height = highlightElements[i].style.height;
          childElement.style.backgroundColor = highlightColor ;
          if(!isHighlightOnly)
          {
          childElement.onclick = function() {
            if($("#"+id+"_cornerimg")[0] !== undefined)
            {
              let cornerFoldedImageTop = $("#"+id+"_cornerimg")[0].offsetTop;
              let marginTop = $("#"+id+"_cornerimg").css('marginTop').replace('px', '');
              cornerFoldedImageTop = cornerFoldedImageTop + parseInt(marginTop,10);
              let data = {
                highlightId: id,
                cornerFoldedImageTop: cornerFoldedImageTop
              }
              triggerEvent("highlightClicked",data);
            }
            else
            {
              triggerEvent("highlightClicked",id);
            }
          }
          }
          parentElement.appendChild(childElement);
        }
        let parentPageElement = document.getElementById('docViewer_ViewContainer_PageContainer_' + WebPDF.ViewerInstance.getCurPageIndex());
        parentPageElement.appendChild(parentElement);
        $('.fwr-search-text-highlight').remove();
      }

  export function reRenderHighlightCornerImages(highlights) {
        $('#highlightcornerimages').remove();
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
        var heightScale, widthScale;
        var pageWidth = $("#docViewer_ViewContainer_BG_"+WebPDF.ViewerInstance.getCurPageIndex()).width();
        var pageHeight = $("#docViewer_ViewContainer_BG_"+WebPDF.ViewerInstance.getCurPageIndex()).height();
        var originalPdfWidth = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageWidth();
        var originalPdfHeight = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageHeight();
        widthScale = pageWidth / originalPdfWidth;
        heightScale = pageHeight / originalPdfHeight;
        var finaltop = 0;
        var lineDiff = 22*heightScale;
        var isOverlap;
        for (var m = 0; m < linewiseHighlightList.length; m++) {
            isOverlap = false;
            if ((finaltop + lineDiff) > linewiseHighlightList[m].top) {
                isOverlap = true;
            }
            var highlightList1 = linewiseHighlightList[m].highlightList;
            highlightList1.sort(function(lh1, lh2){return (lh1.leftpos - lh2.leftpos)});
            for (var n = 0; n < highlightList1.length; n++) {
                finaltop = finaltop + lineDiff;
                var highlightColor = highlightList1[n].color;
                var childElement = document.createElement('span');
                childElement.classList.add('annotator-handle');
                childElement.setAttribute("id",highlightList1[n].id+"_cornerimg");
                var hId = highlightList1[n].id;
                var pageLeft = $("#docViewer_ViewContainer").offset().left;
                var conatinerWidth = $("#docViewer_ViewContainer").width();
                var parentHighlightElement = $('#' + hId);
                var childHighlightElement = parentHighlightElement[0].children[0];
                if (!isOverlap) {
                    finaltop = childHighlightElement.offsetTop;
                    isOverlap = true;
                }
                var finalleft = (pageLeft + conatinerWidth) - ($(".fwr-single-page").offset().left + 271);
                //var finalleft = 0.9*pageWidth;
                childElement.style.left = finalleft + "px";
                childElement.style.top = (finaltop - 5) + "px";
                childElement.style.position = "absolute";
                childElement.style.backgroundColor = highlightColor;
                childElement.style.visibility = "visible";
                childElement.style.height = 15*heightScale + "px";
                childElement.style.width = 15*widthScale + "px";
                var noteHiglightIdElement = document.getElementById(hId); 
                childElement.addEventListener("click",handleNoteIconClick);
                noteHiglightIdElement.addEventListener("click",handleNoteIconClick);
                var highlightElementList = $('.fwr-highlight-annot');
                var highlightCount = $('.fwr-highlight-annot').length;
                for(var k=0 ; k <highlightCount ; k ++)
                {
                  highlightElementList[k].addEventListener("click",handleNoteIconClick);
                }
                setClickEvent(childElement, hId, (finaltop + 5));
                parentElement.appendChild(childElement);
            }
        }
        var parentPageElement = document.getElementById('docViewer_ViewContainer_PageContainer_'+WebPDF.ViewerInstance.getCurPageIndex());
        parentPageElement.appendChild(parentElement);
      } catch (e) {}
    }

    function setClickEvent(childElement, hId, top) {
        childElement.onclick = function() {
            var data = {
              highlightId: hId,
              cornerFoldedImageTop: top
            }
          triggerEvent("highlightClicked", data);
        }
      }

    function handleNoteIconClick(event) {
        var noteIcon;
        var pageLeft = $("#docViewer_ViewContainer").offset().left;
        var conatinerWidth = $("#docViewer_ViewContainer").width();
        var originalPosition =((pageLeft + conatinerWidth) - (($(".fwr-single-page").offset().left ) + 271)) + 'px';
        var noteIconCount = $('.annotator-handle').length;
        var noteIconElementList = $('.annotator-handle');
        for (var i=0; i<noteIconCount; i++)
        {
          noteIconElementList[i].style.left = originalPosition;
        }
        if($('#' + event.currentTarget.id).hasClass('pdfHighlight'))
        {
          noteIcon = document.getElementById(event.currentTarget.id + '_cornerimg');
        }
        else
        {
          noteIcon = this;
        }
        // noteIcon.style.left = ((pageLeft + conatinerWidth) - (($(".fwr-page").offset().left ) + 287 + 32)) + 'px';
        noteIcon.style.left = (parseInt(originalPosition,10) - 48) + 'px';
        $("body").on('click',function(e) {
          if($('#openPopupHighlight').is(':hidden') && noteIcon.style.left !== originalPosition)
            {
              noteIcon.style.left = originalPosition;
            }
        });
      }

  export  function resetHighlightedText(){

          var selectionElements = document.querySelectorAll('.fwr-search-text-highlight');
          if(selectionElements){
          $('.fwr-search-text-highlight').addClass('fwr-hidden');
        
        }
      } 