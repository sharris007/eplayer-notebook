import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Popup from 'react-popup';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { Navigation } from '@pearson-incubator/aquila-js-core';
import { DrawerComponent } from '@pearson-incubator/vega-drawer';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import { AudioPlayer,VideoPlayerPreview,ImageViewerPreview} from '@pearson-incubator/aquila-js-media';
import { ExternalLink } from '@pearson-incubator/aquila-js-basics';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import './PdfPlayer.scss';
import { initializeWebPDF, triggerEvent, registerEvent, Resize, removeEventListenersForWebPDF } from './webPDFUtil';
import { getSelectionInfo,restoreHighlights,reRenderHighlightCornerImages, resetHighlightedText } from './pdfUtility/annotaionsUtil';
import { displayRegions,handleRegionClick,onHotspotClose,handleTransparentRegionHover,handleTransparentRegionUnhover} from './pdfUtility/regionsUtil';
import { languages } from '../../../locale_config/translations/index';
import { createHttps } from '../Utility/Util';
import { pdfConstants } from './constants/pdfConstants';

let pdfWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/pdfworker.js');
let fileIdWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/fileidworker.js');

window.fileIdsList = [];

let bookContainerId;

class PdfPlayer extends Component {

  constructor(props){
    super(props);
    this.state = {
      pageLoaded : false,
      data : {},
      isFirstPageBeingLoad : true,
      drawerOpen: false,
      prefOpen: false,
      searchOpen: false,
      currZoomLevel: 1,
      highlightList: [],
      popUpCollection : [],
      chapterPdfFected: false,
      chapterList: [],
      currentChapter: {},
      currentChapterPageChange: false,
      showHighlight: true
    }
    this.currPageIndex = 0;
    this.envType = this.props.envType ? this.props.envType : 'qa';
    registerEvent('viewerReady', this.renderPdf.bind(this));
    registerEvent('pageLoaded', this.onPageLoad.bind(this));
    registerEvent('highlightClicked', this.handleHighlightClick)
    registerEvent('regionClicked', this.fetchClickedRegionData.bind(this));
    registerEvent('RegionHovered',handleTransparentRegionHover);
    registerEvent('RegionUnhovered',handleTransparentRegionUnhover);
    pdfAnnotatorInstance.init(resetHighlightedText);
  }

  componentDidMount(){
    let pageIndexToLaunch;
    if(localStorage.getItem('currPageIndex')){
      pageIndexToLaunch = localStorage.getItem('currPageIndex');
    }else{
      pageIndexToLaunch = this.props.metaData.pageIndexTolaunch ? this.props.metaData.pageIndexTolaunch : 
                            this.props.metaData.startPageNo ? this.props.metaData.startPageNo : 1;
    }
    initializeWebPDF(pdfConstants.foxitBaseUrl[this.envType], pageIndexToLaunch);
    if(this.props.preferences.showAnnotation) {
      $('#frame').on('mouseup mousedown dblclick', this.handleSelection);
    } 
  }

  componentWillUnmount(){
    window.removeEventListener('resize', Resize);
    removeEventListenersForWebPDF();
    eventMap = [];
    window.fileIdsList = [];
    localStorage.removeItem('currPageIndex');
  }

  preLoadPdf = (preFetchPageList,startIndex, endIndex) => {
    if(window.Worker){
        let g = new SparkMD5.ArrayBuffer;
        fileIdWorker.postMessage([preFetchPageList,window.fileIdsList,startIndex,endIndex,WebPDF.AccountInstance.getUserAccount(),
                    WebPDF.AccountInstance.getUserId(),g.end(),pdfConstants.foxitBaseUrl[this.envType]]);
        fileIdWorker.onmessage = function(e){
          window.fileIdsList.push(e.data);
        }
      }
  }
 
  preFetchPages = (pageIndex) => {
    let lowerIndex = pageIndex-5;
    let upperIndex = pageIndex+5;
    let startIndex;
    let endIndex;
    let preFetchPageList = [];
    if((lowerIndex >= 0) && (upperIndex < this.props.pageList.length)){
      startIndex = lowerIndex;
      endIndex = upperIndex;
    }else if((lowerIndex >= 0) && !(upperIndex < this.props.pageList.length)){
      startIndex = lowerIndex;
      endIndex = this.props.pageList.length - 1
    }else if(!(lowerIndex >= 0) && (upperIndex < this.props.pageList.length)){
      startIndex = 0;
      endIndex = upperIndex;
    }
    if(window.fileIdsList.length){
       for(let i=startIndex ; i<=endIndex ; i++){
        let a = this.props.pageList[i].pdfPath;
        let fileIDPresent = false;
        for(let i=0;i<window.fileIdsList.length;i++) {
            let assetObj = fileIdsList[i];
            if(assetObj[a] === undefined) {
                fileIDPresent = false;
            } else {
                fileIDPresent = true;
                break;
            }
        }
        if(fileIDPresent === true)
        {
          continue;
        }else{
          preFetchPageList.push(this.props.pageList[i]);
        }
      }
      this.preLoadPdf(preFetchPageList,0,(preFetchPageList.length - 1));
    }else{
      this.preLoadPdf(this.props.pageList,startIndex,endIndex);
    }
    
  }

  renderPdf = (requestedPage) => {
    this.setState({drawerOpen: false });
    this.setState({prefOpen : false});
    this.setState({searchOpen : false});
    let multipageConfig = pdfConstants.multipageConfig;
    if(multipageConfig.isMultiPageSupported) {
        if(this.state.currentChapter !== undefined && this.state.currentChapter.startpageno && 
                  this.state.currentChapter.startpageno <= requestedPage && this.state.currentChapter.endpageno >= requestedPage) {
          let goToPageNo = requestedPage - this.state.currentChapter.startpageno;
          if (goToPageNo >= 0) {
            this.currPageIndex = requestedPage;
            WebPDF.ViewerInstance.gotoPage(goToPageNo);
            this.displayHighlights();
            this.displayHotspots();
          }
        } else {
          let chapterObj;
          this.state.chapterList.forEach((chapter) => {
            if(chapter.startpageno <= requestedPage && chapter.endpageno >= requestedPage) {
              chapterObj = chapter;
            }
          });
          if(chapterObj != undefined) {
              WebPDF.ViewerInstance.openFileByUri({url:chapterObj.chapterpdf});
              this.pageNoToLoad = requestedPage - chapterObj.startpageno;
              let currChapterList = this.state.chapterList;
              currChapterList.push(chapterObj);
              this.currPageIndex = requestedPage;
              this.setState({chapterList:currChapterList,currentChapter:chapterObj,chapterPdfFected:false,pageLoaded:false});
            } else {
            let pageRangeBucket = Math.ceil(requestedPage/multipageConfig.pagesToDownload);
            let endpageno = pageRangeBucket * multipageConfig.pagesToDownload;
            let startpageno = Math.abs(endpageno - (multipageConfig.pagesToDownload - 1));
            if(endpageno > this.props.metaData.lastPage || this.props.metaData.totalpages <= multipageConfig.pagesToDownload) {
              endpageno = this.props.metaData.lastPage;
            }
            if(startpageno < this.props.metaData.startPageNo){
              startpageno = this.props.metaData.startPageNo;
            }
            this.props.bookCallbacks.fetchChapterLevelPdf(this.props.metaData.bookId,startpageno,endpageno,
            this.props.metaData.globalBookId,this.props.metaData.serverDetails).then((chapterPdfObj)=>{
              WebPDF.ViewerInstance.openFileByUri({url:chapterPdfObj.chapterpdf});
              this.pageNoToLoad = requestedPage - chapterPdfObj.startpageno;
              let currChapterList = this.state.chapterList;
              currChapterList.push(chapterPdfObj);
              this.currPageIndex = requestedPage;
              this.setState({chapterList:currChapterList,currentChapter:chapterPdfObj,chapterPdfFected:false,pageLoaded:false});
            });
          }
        }
    } else {
      this.setState({pageLoaded:false});
      let index = _.findIndex(this.props.pageList, page => page.id == requestedPage);
      let requestedPageObj = this.props.pageList[index];
      this.currPageIndex = requestedPageObj.id;
      // <TestCode>
      this.currPageNumber = requestedPageObj.pagenumber;
      let d = new Date();
      this.pageLoadStartTime = d.getTime();
      this.showLog = true;
      // </TestCode>
      WebPDF.ViewerInstance.openFileByUri({url:requestedPageObj.pdfPath});
    }
    const viewer = this;
    $(document).on('keyup',function(evt) {
      if (evt.keyCode === 27 && $('#hotspot'))
      {
        try{
          Popup.close();
          $('#player-iframesppModalBody').remove();
          $('#sppModal').css('display','none');
          Popup.close();
        }
        catch(e){
        }
        viewer.setState({regionData : null});
      }
    });
    localStorage.setItem('currPageIndex',this.currPageIndex);
 }

  onPageLoad = () => {
    // <TestCode>
    if (this.showLog) {
      let d = new Date();
      let pageLoadTime = d.getTime() - this.pageLoadStartTime;
      console.log("Time taken to load page "+this.currPageNumber+" is "+(pageLoadTime/1000)+" secs");
      this.pageLoadStartTime = 0;
      this.showLog = false;
    // </TestCode>
    WebPDF.ViewerInstance.setLayoutShowMode(2);
    let multipageConfig = pdfConstants.multipageConfig;
    if (multipageConfig.isMultiPageSupported) {
      $(".fwrJspVerticalBar").remove();
    }
    let pagesToNavigate;
    if(multipageConfig.pagesToNavigate > this.props.metaData.totalpages) {
      pagesToNavigate = this.props.metaData.totalpages;
    } else if (this.state.currentChapter && multipageConfig.pagesToNavigate > ((this.state.currentChapter.endpageno - this.state.currentChapter.startpageno) + 1)) {
      pagesToNavigate = (this.state.currentChapter.endpageno - this.state.currentChapter.startpageno) + 1;
    } else {
      pagesToNavigate = multipageConfig.pagesToNavigate;
    }
    let callBackForManualNav = false;
    if (multipageConfig.isMultiPageSupported) {
        let webPdfCurrPageIndex = WebPDF.ViewerInstance.getCurPageIndex();
      if(webPdfCurrPageIndex < (pagesToNavigate-1) && !this.state.chapterPdfFected) {
        callBackForManualNav = true;
        WebPDF.ViewerInstance.gotoPage(webPdfCurrPageIndex+1);
      } else if(webPdfCurrPageIndex == (pagesToNavigate-1) && !this.state.chapterPdfFected) {
         WebPDF.ViewerInstance.gotoPage(this.pageNoToLoad);
         this.setState({chapterPdfFected:true,pageLoaded:true});
         this.setCurrentZoomLevel(this.state.currZoomLevel);
      }
    }
    if(this.state.isFirstPageBeingLoad == true && !callBackForManualNav) {
         this.setState({isFirstPageBeingLoad : false, pageLoaded : true});
         if(this.props.preferences.showAnnotation) {
           this.props.annotations.load.get(this.props.auth,this.props.metaData).then(()=> {
            this.displayHighlights();
           });
         }
         if(this.props.preferences.showDrawer) {
          this.props.tocData.load.get(this.props.metaData);
         }
         if(this.props.preferences.showHostpot) {
           this.props.basepaths.load.get(this.props.metaData,this.props.auth).then(()=> {
            this.displayHotspots();
          });
         }
         if(this.props.preferences.showBookmark) {
          this.props.bookmarks.load.get(this.props.auth,this.props.metaData);   
         }   
    } else if (!callBackForManualNav) {
        this.setCurrentZoomLevel(this.state.currZoomLevel);
        this.setState({pageLoaded:true});
    } 
   }
  }

  onPageChange = () => {
    // this method is called when we change the page. Not yet used.
  }

  onPageRequest = (requestedPageObj) => {
    try
    {
      this.setState({regionData : null});
      this.setState({popUpCollection : []});
    }
    catch(e){}
     if(_.isObject(requestedPageObj)) {
        this.renderPdf(requestedPageObj.id);
    }
  }

  goToPage = (pageNo) => {
    try
    {
      this.setState({regionData : null});
      this.setState({popUpCollection : []});
    }
    catch(e){}
    if(pageNo !== this.currPageIndex) {
      this.renderPdf(pageNo);
    } else {
      this.setState({drawerOpen: false });
      this.setState({prefOpen : false});
      this.setState({searchOpen : false});
    }
  }

  goToPageNumber = (pageNo) => {
    var pageToNavigate;
    var pages = this.props.pageList;
    for(var i=0;i<pages.length;i++)
    {
      if(pages[i].pagenumber == pageNo)
      {
        pageToNavigate = pages[i];
      }
    }
    if(pageToNavigate !== undefined)
    {
     this.goToPage(pageToNavigate.id);
    }
  }

  handleSelection = () => {
    try{
        let curToolHandlerName = WebPDF.ViewerInstance.getCurToolHandlerName();
        let selectedText = WebPDF.ViewerInstance.getToolHandlerByName(curToolHandlerName).getTextSelectService().getSelectedText();
        if(selectedText.toString().trim() !== ''){
          let selection = document.querySelectorAll('.fwr-text-highlight');
          let highlight = getSelectionInfo();
          this.createHighlight(selection, highlight);
        }
      }catch(e){}
  }

  createHighlight = (highlightData, highlight) => {
    try{
        const highLightcordinates = {
          left: highlightData[0].offsetLeft,
          top: highlightData[0].offsetTop,
          width: highlightData[0].offsetWidth,
          height: highlightData[0].offsetHeight
        };
        const currentHighlight = {};
        const highlightList = this.state.highlightList;
        const curHighlightCords = highlight.highlightHash;
        const curHighlightCordsStr = curHighlightCords.replace('@0.000000', '');
        const curHighlightCordsList = JSON.parse(curHighlightCordsStr);
        let selectedHighlight;
        let isExistinghighlightFound = false;
        for (let i = 0; i < highlightList.length; i++) {
          const actSt = highlightList[i].highlightHash;
          const objSt = actSt.replace('@0.000000', '');
          const cordList = JSON.parse(objSt);
          for (let j = 0; j < cordList.length; j++) {
            for (let k = 0; k < curHighlightCordsList.length; k++) {
              if (parseInt(cordList[j].left, 10) <= parseInt(curHighlightCordsList[k].left, 10)
                      && parseInt(cordList[j].top, 10) <= parseInt(curHighlightCordsList[k].top, 10)
                      && parseInt(cordList[j].bottom, 10) >= parseInt(curHighlightCordsList[k].bottom, 10)
                      && parseInt(cordList[j].right, 10) >= parseInt(curHighlightCordsList[k].right, 10)) {
                selectedHighlight = highlightList[i];
                isExistinghighlightFound = true;
              }
              if (isExistinghighlightFound) {
                break;
              }
            }
            if (isExistinghighlightFound) {
              break;
            }
          }
          if (isExistinghighlightFound) {
            break;
          }
        }
        if (selectedHighlight !== undefined && selectedHighlight.meta.roletypeid == 3 &&
                this.props.metaData.roletypeid == 2)
        {
          return;
        }
        else if (selectedHighlight !== undefined && isExistinghighlightFound) {
          this.handleHighlightClick(selectedHighlight.id);
        } else {
          const highlightsLength = highlightList.length;
          currentHighlight.id = highlightsLength + 1;
          currentHighlight.highlightHash = highlight.highlightHash;
          currentHighlight.selection = highlight.selection;
          currentHighlight.pageIndex = highlight.pageInformation.pageNumber;
          pdfAnnotatorInstance.showCreateHighlightPopup(currentHighlight, highLightcordinates,
            this.saveHighlight.bind(this), this.editHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_'+WebPDF.ViewerInstance.getCurPageIndex(),
            (languages.translations[this.props.preferences.locale]), this.props.metaData.roletypeid, this.props.metaData.courseId, this.props.metaData.scenario);
        }
      }catch(e){}
  }

  handleHighlightClick = (highLightClickedData) => {
    let hId;
    let cornerFoldedImageTop;
    try{
        if(highLightClickedData.highlightId === undefined)
        {
          hId = highLightClickedData;
        }
        else
        {
          hId = highLightClickedData.highlightId;
          cornerFoldedImageTop = highLightClickedData.cornerFoldedImageTop;
        }
        let highlightClicked = _.find(this.state.highlightList, highlight => highlight.id === hId);
        if (highlightClicked.shared === true)
        {
          highlightClicked = _.find(this.props.annotations.data.annotationList, highlight => highlight.id === hId);
        }
        highlightClicked.color = highlightClicked.originalColor;
        pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,
          this.editHighlight.bind(this), this.deleteHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_'+WebPDF.ViewerInstance.getCurPageIndex(),
          (languages.translations[this.props.preferences.locale]), this.props.metaData.roletypeid,cornerFoldedImageTop, this.props.metaData.courseId, this.props.metaData.scenario);
      }catch(e){}
  }

  deleteHighlight = (id) => {
    try{
        $('#'+id).remove();
        $('#'+id+"_cornerimg").remove();
      }catch(e){}
    this.props.annotations.operation.delete(id,this.props.auth,this.props.metaData).then(() => {
      this.displayHighlights();
    });
  }

  saveHighlight = (currentHighlight,highLightMetadata) => {
    const currentPageId = this.currPageIndex;
    let courseId = _.toString(this.props.metaData.courseId);
    try{
        const note = highLightMetadata.noteText;
        const meta = {
          userroleid: _.toString(this.props.metaData.roletypeid),
          userbookid: _.toString(this.props.metaData.userbookid),
          bookeditionid: _.toString(this.props.metaData.bookeditionid),
          roletypeid: _.toString(this.props.metaData.roletypeid),
          colorcode: highLightMetadata.currHighlightColorCode,
          author: this.props.metaData.authorName,
          highlightHash: currentHighlight.highlightHash,
          note
        };
        const selectedText = currentHighlight.selection;
        const isShared = highLightMetadata.isShared;
        const currentPage = _.find(this.props.pageList, page => page.id === currentPageId);
        const highlightData = {
          color: highLightMetadata.currHighlightColor,
          note,
          meta,
          selectedText,
          isShared
        }
        this.props.annotations.operation.post(this.props.auth,this.props.metaData,currentPage, highlightData).then((newHighlight) => {
           pdfAnnotatorInstance.setCurrentHighlight(newHighlight);
            this.displayHighlights();
        })
      }catch(e){}
  }

  editHighlight = (id, highLightMetadata) => {
    let currentPage = this.currPageIndex;
    try{
        let highlightToEdit = _.find(this.state.highlightList, highlight => highlight.id === id);
        const note = highLightMetadata.noteText !== undefined ? highLightMetadata.noteText : highlightToEdit.comment;
        const color = highLightMetadata.currHighlightColor !== undefined ? highLightMetadata.currHighlightColor : highlightToEdit.color;
        const isShared = highLightMetadata.isShared !== undefined ? highLightMetadata.isShared : highlightToEdit.shared;
        let meta = highlightToEdit.meta;
        meta.colorcode = color;
        let highlightData = {
          note,
          color,
          isShared,
          meta
        }
        this.props.annotations.operation.put(this.props.auth,this.props.metaData,currentPage,highlightData,highlightToEdit).then(()=>{
          this.displayHighlights();
        });
      }catch(e){}
  }

  displayHighlights = () => {
    if(!this.props.preferences.showAnnotation) {
      return;
    }
    let highlightList = [];
    let noteList = [];
    this.props.annotations.data.annotationList.forEach((annotation) => {
      if(annotation.pageId === this.currPageIndex){
        highlightList.push(annotation);
        if(!annotation.isHighlightOnly){
          noteList.push(annotation);
        }
      }
    })
    restoreHighlights(highlightList);
    reRenderHighlightCornerImages(noteList);
    this.setState({highlightList});
    if(this.state.showHighlight == false)
    {
      try
      {
        $(".fwr-highlight-annot").css("visibility","hidden");
        this.setState({showHighlight : false});
      }
      catch(e){}
    }
  }

  handleDrawerkeyselect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.setState({ drawerOpen: true });
    }
  }

  handleDrawer = () => {
    this.setState({drawerOpen: true });
    this.setState({prefOpen : false});
    this.setState({searchOpen : false});
    try{
      Popup.close();
    }
    catch(e){}
  }

  hideDrawer = () => {
    if (this.state.drawerOpen) {
      try{
          document.getElementsByClassName('drawerIconBtn')[0].focus();
        }catch(e){}
    }
    this.setState({ drawerOpen: false });
  }

  handlePreferenceClick = () => {
    try{
      let prefIconleft = $('.prefIconBtn').offset().left - 181;
      $('.preferences-container-etext').css('left', prefIconleft);
    
      Popup.close();
    }
    catch(e){}
    if (this.state.prefOpen === true) {
      this.setState({ prefOpen: false });
    } else {
      this.setState({ prefOpen: true });
      this.setState({ searchOpen: false });
    }
  }

  handlePreferenceKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.handlePreferenceClick();
    }
  }
  setCurrentZoomLevel = (level) => {
    let currZoomLevel = this.state.currZoomLevel;
    if(level <= 0.1){
      currZoomLevel = 0.1;
    }else{
      currZoomLevel = level;
    }
    this.resetCurrentZoomLevel(level);
    this.setState({currZoomLevel : currZoomLevel});
    this.displayHighlights();
    if(this.props.hotspot.data.regions.length > 0 )
    {
      this.displayHotspots();
    }
  }

  resetCurrentZoomLevel = function(level) {
    WebPDF.ViewerInstance.zoomTo(level);
  }

  fetchClickedRegionData(id){
    try
    {
      Popup.close();
      this.setState({regionData : null});
    }
    catch(e){}
    const that = this;
    var regionhot = handleRegionClick(id,that.props.basepaths.data);
            /*Checking if the clicked hotspot is Image/Video/Audio/URL and open it in MMI Component */
            if(regionhot.hotspotType == 'IMAGE' || regionhot.hotspotType == 'VIDEO' || regionhot.hotspotType == 'AUDIO' || regionhot.hotspotType == 'URL')
            {
              /*Updating the state to rerender the page with Aquila JS Component*/
              that.setState({regionData : regionhot});
              if(that.state.regionData.hotspotType == 'IMAGE')
              {
                try
                {
                  $('.preview-image').hide();
                  jQuery(function(){
                   jQuery('.preview-image').click();
                  });
                }
                catch(e){
                }
                document.getElementById('hotspot').className = 'hotspotContent';
              }
              else if(that.state.regionData.hotspotType == 'VIDEO')
              {
                try
                {
                  $('.poster-play-icon').hide();
                  // $('.thumb-nail').hide();
                  jQuery(function(){
                   jQuery('.poster-play-icon').click();
                  });
                }
                catch(e){
                }
                document.getElementById('hotspot').className = 'videoContent';
              }
              else if(that.state.regionData.hotspotType == 'URL')
              {
                try
                {
                  let ExternalLinkComponent = document.getElementsByClassName('link-model')[0];
                  ExternalLinkComponent.style.backgroundColor = '#ffffff';
                }
                catch(e){
                }
              }
              else if(that.state.regionData.hotspotType == 'AUDIO' && that.state.regionData.linkTypeID == pdfConstants.LinkType.FACELESSAUDIO)
              {
                try
                {
                 $('.aquila-audio-player').hide();
                  jQuery(function(){
                   jQuery('.play-pause').click();
                  });
                }
                catch(e){
                }
                document.getElementById('hotspot').className = 'hotspotContent';
              }
              if(that.state.regionData.hotspotType == 'AUDIO')
              {
                try
                {
                  jQuery(function(){
                   jQuery('.play-pause').click();
                  });
                  $.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js", function()
                  {
                    $( ".aquila-audio-player" ).draggable()
                  });
                }
                catch(e){
                }
                document.getElementById('hotspot').className = 'hotspotContent';
              }
            }
            else
            {
              that.renderHotspot(regionhot);
            }
  }

  renderHotspot = (hotspotDetails) => {
    let regionComponent = " ";
    let hotspotData,source;
    switch(hotspotDetails.hotspotType) {
      case 'AUDIO':
                  source = createHttps(hotspotDetails.linkValue);
                  hotspotData = {
                    audioSrc :source,
                    audioTitle :hotspotDetails.name
                  };
                  regionComponent = <AudioPlayer url={hotspotData.audioSrc} title={hotspotData.audioTitle} />;
                  break;
      case 'PAGENUMBER':
                 this.goToPageNumber(hotspotDetails.linkValue);
                 break;
      case 'EMAIL':
                let email = "mailto:" + hotspotDetails.linkValue
                parent.location = email;
                break;
      case 'IMAGE':
               source = createHttps(hotspotDetails.linkValue);
               hotspotData = {
                 alt : hotspotDetails.name,
                 src : source,
                 width : hotspotDetails.mediaWidth,
                 height : hotspotDetails.mediaHeight,
                 title : hotspotDetails.name,
                 items : hotspotDetails
               };
               regionComponent = <ImageViewerPreview data={hotspotData}/>;
               break;
      case 'VIDEO':
               source = createHttps(hotspotDetails.linkValue);
               hotspotData = {
                title : hotspotDetails.name,
                src : source,
                caption : hotspotDetails.description || "",
                id : hotspotDetails.regionID,
                thumbnail : {
                  src : "",
               },
               alt : hotspotDetails.name,
               };
               regionComponent = <VideoPlayerPreview data={hotspotData}/>;
               break;
      case 'SPPASSET':
               source = hotspotDetails.linkValue;
               document.getElementById('sppTitle').innerText = hotspotDetails.name;
               var sppHeaderHeight =document.getElementById('sppModalHeader').style.height;
               var sppPlayer = document.getElementById('sppModalBody');
               var lastIndex = source.lastIndexOf("/");
               var assetID = source.slice(lastIndex+1);
               var scriptContent = 'https://mediaplayer.pearsoncmg.com/assets/_embed.sppModalBody/' + assetID;
               var sppScript=document.createElement('SCRIPT');
               sppScript.src = scriptContent;
               sppPlayer.appendChild(sppScript);
               sppPlayer.style.height = (document.documentElement.clientHeight - parseInt(sppHeaderHeight,10)) + 'px';
               sppPlayer.style.width = document.documentElement.clientWidth + 'px';
               document.getElementById('sppCloseBtn').addEventListener('click',onHotspotClose);
                try
                {
                  document.getElementById('root').appendChild(document.getElementById('sppModal'));
                  $('#sppModal').css("display","block");
                }
                catch(e){
                }
                break;
      case 'DOCUMENT':
               source=hotspotDetails.linkValue;
               window.open(source,"_blank");
               break;
      case 'URL':
               source = createHttps(hotspotDetails.linkValue);
               hotspotData = {
                 title : hotspotDetails.name,
                 src : source
               };
               regionComponent = <ExternalLink title={hotspotData.title} src={hotspotData.src} onClose={onHotspotClose}/>;
               break;
      case 'EXTERNALLINK':
               source=hotspotDetails.linkValue;
               window.open(source,"_blank");
               break;
      case 'LTILINK':
               let courseId;
               if (this.props.metaData.activeCourseID === undefined || this.props.metaData.activeCourseID === '' || this.props.metaData.activeCourseID === null)
               {
                courseId = -1;
               }
               else
               {
                courseId = this.props.metaData.activeCourseID;
               }
               /*Framing Complete LTI URl*/
               let link = this.props.metaData.serverDetails + '/ebook/toolLaunch.do?json=' + hotspotDetails.linkValue + '&contextid=' + courseId + '&role=' + this.props.metaData.roletypeid + '&userlogin=' + this.props.auth.userid ;
               /*Converting URL into https*/
               let ltiUrl = createHttps(link);
               window.open(ltiUrl,"_blank");
               break;
      default :regionComponent = null;
               break;
    };
    return regionComponent;
  }
  
  displayHotspots = () => {
    if(!this.props.preferences.showHostpot)
    {
      return;
    }
    try
    {
      $('.hotspot').remove();
      $('.hotspotIcon').remove();
      $('.tooltiptext').remove();
      Popup.close();
    }
    catch(e){}
    let currentPageRegions;
    if(this.props.hotspot.data.regions.length > 0)
    {
      for(var k=0;k<this.props.hotspot.data.regions.length;k++)
      {
        if(this.currPageIndex == this.props.hotspot.data.regions[k].pageId)
        {
          currentPageRegions = this.props.hotspot.data.regions[k].hotspotList;
          if(currentPageRegions && currentPageRegions.length > 0)
          {
            displayRegions(currentPageRegions,this.props.bookFeatures,_);
            this.renderGlossary(currentPageRegions);  
          } 
        }
      }
    }
    if(currentPageRegions == null ||currentPageRegions == '' || currentPageRegions == undefined)
    {
      this.props.hotspot.load.get(this.props.metaData,this.currPageIndex).then(() => {
        if(this.props.hotspot.data.regions.length > 0 )
        {
          for(var k=0;k<this.props.hotspot.data.regions.length;k++)
          {
            if(this.currPageIndex == this.props.hotspot.data.regions[k].pageId)
            {
              currentPageRegions = this.props.hotspot.data.regions[k].hotspotList;
              if(currentPageRegions && currentPageRegions.length > 0)
              {
                displayRegions(currentPageRegions,this.props.bookFeatures,_);
                this.renderGlossary(currentPageRegions);  
              } 
            }
          }
        }
      });
    }
  }

  renderGlossary = (currentPageRegions) =>
  {
    this.setState({popUpCollection : []});
    let glossaryEntryIDsToFetch ='';
    let glossaryHotspots = [];
    for(var i=0;i < currentPageRegions.length;i++)
    {
      if(currentPageRegions[i].regionTypeID == 5 && currentPageRegions[i].glossaryEntryID !== null)
      {
        glossaryHotspots.push(currentPageRegions[i]);
      }
    }
    let bookContainer = document.getElementById('docViewer_ViewContainer_PageContainer_'+WebPDF.ViewerInstance.getCurPageIndex());
    bookContainerId = bookContainer.id;
    if(glossaryHotspots.length > 0)
    {
      for(var i=0;i<glossaryHotspots.length;i++)
      {
        if(glossaryEntryIDsToFetch == '')
        {
          glossaryEntryIDsToFetch = glossaryHotspots[i].glossaryEntryID;
        }
        else
        {
          glossaryEntryIDsToFetch = glossaryEntryIDsToFetch + "," + glossaryHotspots[i].glossaryEntryID;
        }
      }
    }
    if(glossaryEntryIDsToFetch !== '')
    {
      this.props.glossary.load.get(this.props.metaData,glossaryEntryIDsToFetch).then(() => {
        let fetchedGlossaryDetails = [];
        for(let i=0;i<this.props.glossary.data.length;i++)
            {
              for(let k=0 ; k < glossaryHotspots.length ; k++)
              {
                if((this.props.glossary.data[i].glossaryEntryID).trim() == (glossaryHotspots[k].glossaryEntryID).trim())
                {
                  let glossTerm = {
                    item : document.getElementById('region_' + glossaryHotspots[k].regionID),
                    popOverCollection : {
                      popOverDescription : this.props.glossary.data[i].glossaryDefinition,
                      popOverTitle : this.props.glossary.data[i].glossaryTerm
                    }
                  };
                  fetchedGlossaryDetails.push(glossTerm);
                }
              }
            }
        if(fetchedGlossaryDetails.length > 0)
        {
          this.setState({popUpCollection : fetchedGlossaryDetails});
        }
    });
    }
  }

  handleSearchResultClick = (pageOrder,resultType) =>
  {
    this.goToPage(pageOrder);
  }

  searchCallback = (searchTerm,handleResults) =>
  {
    this.props.search.load.get(this.props.metaData,searchTerm,handleResults);
  }

  addBookmarkHandler = () => {
    const currentPageId = this.currPageIndex;
    const currentPage = _.find(this.props.pageList, page => page.id === currentPageId);
    this.props.bookmarks.operation.post(currentPage,this.props.auth,this.props.metaData);
  }

  removeBookmarkHandler = (bookmarkId) => {
    let currentPageId;
    if (bookmarkId !== undefined) {
      currentPageId = bookmarkId;
    } else {
      currentPageId = this.currPageIndex;
    }
    const targetBookmark = _.find(this.props.bookmarks.data.bookmarkList, bookmark => bookmark.uri === currentPageId);
    const targetBookmarkId = targetBookmark.bkmarkId;
    this.props.bookmarks.operation.delete(targetBookmarkId,this.props.auth,this.props.metaData);
  }

  isCurrentPageBookmarked = () => {
    const currentPageId = this.currPageIndex;
    const targetBookmark = _.find(this.props.bookmarks.data.bookmarkList, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  }

  getPreference = () => {
    let isAnnHide = this.state.showHighlight;
    const prefData = {
      'value': {
        theme: 'White',
        orientation: 'horizontal',
        zoom: this.state.currZoomLevel,
        isAnnotationHide: isAnnHide,
        enableShowHide: this.props.preferences.showAnnotation
      }
    };
    const promiseVal = Promise.resolve(prefData);
    return promiseVal;
  }
  /* Method show or hide highlights/notes. */
  showHideHighlights = (prefObject) => {
    if(prefObject.isAnnotationHide == false)
    {
      try
      {
        $(".fwr-highlight-annot").css("visibility","hidden");
        this.setState({showHighlight : false});
      }
      catch(e){}
    }
    else
    {

      try
      {
        $(".fwr-highlight-annot").css("visibility","visible");
        this.setState({showHighlight : true});
      }
      catch(e){}
    }
  }
  
  render() {
    let viewerClassName;
    if (this.state.pageLoaded !== true) {
      viewerClassName = 'hideViewerContent';
    } else {
      viewerClassName = '';
    }
    let notes = [];
    if(this.props.annotations.data.annotationList){
      notes = this.props.annotations.data.annotationList.map((annot) => {
        let note = Object.assign({}, annot);
        if(note.shared){
          note.color = 'Instructor'
        }else{
          note.color = note.originalColor;
        }
        return note;
      });
    }
    let moreMenuData = {};
    moreMenuData.menuItem = [];
    let signOutOption = {
      type : 'menuItem',
      value : 'SignOut',
      text : 'Sign Out',
    }
    moreMenuData.menuItem.push(signOutOption);
    const hideIcons = {
      backNav: !this.props.preferences.showBookshelfBack,
      hamburger: !this.props.preferences.showDrawer,
      bookmark: !this.props.preferences.showBookmark,
      pref: false,
      search: false,
      audio: true,
      moreIcon: false
    };
    const headerTitleData = {
      params: {
        pageId : this.currPageIndex ? this.currPageIndex :'1',
        bookId : this.props.metaData.bookId ? this.props.metaData.bookId :'12345',
      },
      classname: 'headerBar',
      chapterTitle: this.props.metaData.title ? this.props.metaData.title : 'Generic Header',
      pageTitle: this.props.metaData.title ? this.props.metaData.title : 'Generic Header',
      isChapterOpener: true
    };

    let bookmarksObj = {
      bookmarksArr : this.props.bookmarks.data.bookmarkList ? this.props.bookmarks.data.bookmarkList : []
    };
    let notesObj = {
      notes
    };
    let bookDetails = {
      author : this.props.metaData.authorName,
      title : this.props.metaData.title
    };
    let pageIdString = this.currPageIndex.toString();
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.goToPageCallback = this.goToPage;
    return (
      <div>
      { this.props.preferences.showHeader ? 
      <HeaderComponent
        locale={this.props.preferences.locale}
        bookshelfClick={this.props.bookCallbacks.handleBookshelfClick}
        drawerClick={this.handleDrawer}
        bookmarkIconData={callbacks}
        handlePreferenceClick={this.handlePreferenceClick}
        handleDrawerkeyselect={this.handleDrawerkeyselect}
        prefOpen={this.state.prefOpen}
        searchOpen={this.state.searchOpen}
        hideIcons={hideIcons}
        headerTitleData={headerTitleData}
        search={this.searchCallback}
        onSearchResultClick={this.handleSearchResultClick}
        autoComplete={this.searchCallback}
        moreIconData={moreMenuData} /> : null}
      {this.props.tocData.data.data.fetched && <DrawerComponent
        isDocked={false}
        drawerWidth={400}
        isDraweropen={this.state.drawerOpen}
        hideDrawer={this.hideDrawer}
        bookDetails={bookDetails}
        tocData={this.props.tocData.data}
        bookmarkData={bookmarksObj}
        notesData={notesObj}
        currentPageId={pageIdString}
        bookCallbacks={callbacks}
      />}
      <div className = "preferences-container-etext">
        {this.state.prefOpen ? 
          <div className = "content">
            {this.props.isPdfPlayer ? 
              <PreferencesComponent
                isET1 = {this.props.isPdfPlayer}
                setCurrentZoomLevel = {this.setCurrentZoomLevel}
                disableBackgroundColor = {true}
                fetch={this.getPreference}
                preferenceUpdate = {this.showHideHighlights}
                prefKeySelect = {this.handlePreferenceKeySelect}/> : 
              <PreferencesComponent
                fetch = {this.props.getPreference}
                preferenceUpdate = {this.props.updatePreference}
                disableBackgroundColor = {false}
                locale = {this.props.preferences.locale} />
            }
          </div> : <div className="empty" />
        }
      </div>

      {!this.state.isFirstPageBeingLoad && this.props.preferences.showFooter ? 
        <Navigation
          onPageRequest={this.onPageRequest}
          pagePlayList={this.props.pageList}
          currentPageId={this.currPageIndex}
          /> : null
      }
      {this.state.regionData ? <div id="hotspot">{this.renderHotspot(this.state.regionData)}</div> : null }
      {this.state.popUpCollection.length ? <PopUpInfo bookContainerId={bookContainerId} popUpCollection={this.state.popUpCollection}/> : null }
        <div id="main" className="pdf-fwr-pc-main">
            <div id="right" className="pdf-fwr-pc-right">
              <div id="toolbar" className="pdf-fwr-toolbar" />
              <div id="frame" className = {viewerClassName}>
                <div id="docViewer" className="docViewer" />
              </div>
            </div>
        </div>
        <div id='sppModal' className='sppModal'>
            <div id='sppModalHeader' className='sppModalHeader' style={{height: 60 + 'px'}}>
              <span id='sppCloseBtn' className='sppCloseBtn'>&times;</span>
                <p id='sppTitle'></p>
            </div>
            <div id='sppModalBody' className='sppModalBody' />
        </div>
        
         {this.state.pageLoaded !== true ?
        <div className="centerCircularBar">
        <RefreshIndicator size={50} left={0.48*$(window).width()} top={200} status="loading" />
        </div> : null}
      </div>
    );
  }
}

PdfPlayer.propTypes = {
  pageList : PropTypes.array.isRequired,
  metaData : PropTypes.object,
  bookCallbacks : PropTypes.object,
  coverPage : PropTypes.object
}

PdfPlayer.defaultProps = {
  
}
export default PdfPlayer;