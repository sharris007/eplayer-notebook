import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { Navigation } from '@pearson-incubator/aquila-js-core';
import { DrawerComponent } from '@pearson-incubator/vega-drawer';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import './PdfPlayer.scss';
import { triggerEvent, registerEvent, Resize, addEventListenersForWebPDF, removeEventListenersForWebPDF } from './webPDFUtil';
import { getSelectionInfo,restoreHighlights,reRenderHighlightCornerImages } from './pdfUtility/annotaionsUtil';
import { languages } from '../../../locale_config/translations/index';

let pdfWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/pdfworker.js');
let fileIdWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/fileidworker.js');

window.fileIdsList = [];

let docViewerId = 'docViewer';
let foxitBaseUrl = 'https://foxit-aws.gls.pearson-intl.com/';

class PdfPlayer extends Component {

  constructor(props){
    super(props);
    this.state = {
      pageLoaded : false,
      data : {},
      isFirstPageBeingLoad : true,
      currPageIndex : 0,
      drawerOpen: false,
      prefOpen: false,
      searchOpen: false,
      currZoomLevel: 1,
      highlightList: []
    }
    registerEvent('viewerReady', this.renderPdf.bind(this));
    registerEvent('pageLoaded', this.onPageLoad.bind(this));
    registerEvent('highlightClicked', this.handleHighlightClick)
    if(window.Worker){
      pdfWorker.postMessage([this.props.pageList,0,0]);
    }
    pdfAnnotatorInstance.init();
  }

  componentDidMount(){
    if(!window.WebPDF){
        let script1 = document.createElement('SCRIPT');
        script1.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/jquery-1.10.2.min.js';
        script1.async = false;
        let script2 = document.createElement('SCRIPT');
        script2.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/jquery-migrate-1.2.1.js';
        script2.async = false;
        let script3 = document.createElement('SCRIPT');
        script3.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/jquery-ui.min.js';
        script3.async = false;
        let script4 = document.createElement('SCRIPT');
        script4.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/jquery.form.min.js';
        script4.async = false;
        let script5 = document.createElement('SCRIPT');
        script5.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/release_websdk/webpdf.tools.mini.js';
        script5.async = false;
        let script6 = document.createElement('SCRIPT');
        script6.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/control/common/common.js';
        script6.async = false;
        let script7 = document.createElement('SCRIPT');
        script7.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/config/apiConfig.js';
        script7.async = false;
        let script8 = document.createElement('SCRIPT');
        script8.src = 'https://foxit-aws.gls.pearson-intl.com/scripts/config/config.js';
        script8.async = false;
        let script9 = document.createElement('SCRIPT');
        script9.src = '/eplayer/pdf/foxit_client_lib/webpdf.mini.js';
        script9.async = false;
        script9.onload = function(){
          let optionsParams = {
          language: getLanguage(),
          serverBaseUrl: 'https://foxit-aws.gls.pearson-intl.com/',
          baseUrl: 'https://foxit-aws.gls.pearson-intl.com/'
          };
          WebPDF.ready(docViewerId, optionsParams).then(function(data) {
          addEventListenersForWebPDF();
          triggerEvent('viewerReady', 0);
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
          serverBaseUrl: 'https://foxit-aws.gls.pearson-intl.com/',
          baseUrl: 'https://foxit-aws.gls.pearson-intl.com/'
          };

        WebPDF.ready(docViewerId, optionsParams).then(function(data) {
        addEventListenersForWebPDF();
        triggerEvent('viewerReady', 0);
      })
    }
    $('#frame').on('mouseup mousedown dblclick', this.handleSelection);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', Resize);
    removeEventListenersForWebPDF();
    eventMap = [];
    window.fileIdsList = [];
  }

  preLoadPdf = (preFetchPageList,startIndex, endIndex) => {
    if(window.Worker){
        let g = new SparkMD5.ArrayBuffer;
        fileIdWorker.postMessage([preFetchPageList,window.fileIdsList,startIndex,endIndex,WebPDF.AccountInstance.getUserAccount(),
                    WebPDF.AccountInstance.getUserId(),g.end(),foxitBaseUrl]);
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
    this.setState({prefOpen : false})
    this.setState({searchOpen : false})
    let openFileParams = {};
    let currPageIndex;
    let index;
    if(_.isObject(requestedPage)){
      openFileParams.url = requestedPage.pdfPath;
      currPageIndex = requestedPage.id;
      index = _.findIndex(this.props.pageList, page => page == requestedPage);
    }else if(requestedPage === 0){
      let requestedPageObj = this.props.pageList[0];
      openFileParams.url = requestedPageObj.pdfPath;
      currPageIndex = requestedPageObj.id;
      index = 0;
    }else{
      index = _.findIndex(this.props.pageList, page => page.id == requestedPage);
      let requestedPageObj = this.props.pageList[index];
      openFileParams.url = requestedPageObj.pdfPath;
      currPageIndex = requestedPageObj.id;
    }
    WebPDF.ViewerInstance.openFileByUri(openFileParams);
    this.setState({currPageIndex});
    this.preFetchPages(index);
   }

  onPageLoad = () => {
    if(this.state.isFirstPageBeingLoad == true){
      this.setState({isFirstPageBeingLoad : false})
      this.props.annotations.load.get(this.props.auth(),this.props.metaData)
    }
    this.setState({pageLoaded : true});
    this.setCurrentZoomLevel(this.state.currZoomLevel);
    setTimeout(this.displayHighlights(), 1000);
  }

  onPageRequest = (requestedPageObj) => {
    this.setState({pageLoaded : false});
    this.renderPdf(requestedPageObj);
  }

  goToPage = (pageNo) => {
    if(pageNo !== this.state.currPageIndex)
    {
      this.setState({pageLoaded : false});
      this.renderPdf(pageNo);
    }
  }

  handleSelection = () => {
    let curToolHandlerName = WebPDF.ViewerInstance.getCurToolHandlerName();
    let selectedText = WebPDF.ViewerInstance.getToolHandlerByName(curToolHandlerName).getTextSelectService().getSelectedText();
    if(selectedText.toString().trim() !== ''){
      let selection = document.querySelectorAll('.fwr-text-highlight');
      let highlight = getSelectionInfo();
      this.createHighlight(selection, highlight);
      }
  }

  createHighlight = (highlightData, highlight) => {
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
            this.props.metaData.roleTypeID == 2)
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
        (languages.translations["en-US"]), this.props.metaData.roleTypeID, this.props.metaData.courseId);
    }
  }

  handleHighlightClick = (highLightClickedData) => {
    let hId;
    let cornerFoldedImageTop;
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
      (languages.translations["en-US"]), this.props.metaData.roleTypeID,cornerFoldedImageTop, this.props.metaData.courseId);
  }

  deleteHighlight = (id) => {
    $('#'+id).remove();
    $('#'+id+"_cornerimg").remove();
    this.props.annotations.operation.delete(id,this.props.auth(),this.props.metaData).then(() => {
      this.displayHighlights();
    });
  }

  saveHighlight = (currentHighlight,highLightMetadata) => {
    const currentPageId = this.state.currPageIndex;
    let courseId = _.toString(this.props.metaData.courseId);
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
    this.props.annotations.operation.post(this.props.auth(),this.props.metaData,currentPage, highlightData).then((newHighlight) => {
       pdfAnnotatorInstance.setCurrentHighlight(newHighlight);
        this.displayHighlights();
    })
  }

  editHighlight = (id, highLightMetadata) => {
    let currentPage = this.state.currPageIndex;
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
    this.props.annotations.operation.put(this.props.auth(),this.props.metaData,currentPage,highlightData,highlightToEdit).then(()=>{
      this.displayHighlights();
    });
  }

  displayHighlights = () => {
    let highlightList = [];
    let noteList = [];
    this.props.annotations.data.annotationList.forEach((annotation) => {
      if(annotation.pageId === this.state.currPageIndex){
        highlightList.push(annotation);
        if(!annotation.isHighlightOnly){
          noteList.push(annotation);
        }
      }
    })
    restoreHighlights(highlightList);
    reRenderHighlightCornerImages(noteList);
     this.setState({highlightList});
  }

  handleDrawerkeyselect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.setState({ drawerOpen: true });
    }
  }

  handleDrawer = () => {
    this.setState({drawerOpen: true });
    this.setState({prefOpen : false})
    this.setState({searchOpen : false})
  }

  hideDrawer = () => {
    if (this.state.drawerOpen) {
      document.getElementsByClassName('drawerIconBtn')[0].focus();
    }
    this.setState({ drawerOpen: false });
  }

  handlePreferenceClick = () => {
    let prefIconleft = $('.prefIconBtn').offset().left - 181;
    $('.preferences-container-etext').css('left', prefIconleft);
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
  }

  resetCurrentZoomLevel = function(level) {
    WebPDF.ViewerInstance.zoomTo(level);
  }

  addBookmarkHandler = () => {}
  removeBookmarkHandler = () => {}
  isCurrentPageBookmarked = () => {}
  removeAnnotationHandler = () => {}
  
  render() {
    let viewerClassName;
    if (this.state.pageLoaded !== true) {
      viewerClassName = 'hideViewerContent';
    } else {
      viewerClassName = '';
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
      backNav: false,
      hamburger: false,
      bookmark: false,
      pref: false,
      search: false,
      audio: true,
      moreIcon: false
    };
    const headerTitleData = {
      params: {
        pageId : this.state.currPageIndex ? this.state.currPageIndex :'1',
        bookId : this.props.metaData.bookId ? this.props.metaData.bookId :'12345',
      },
      classname: 'headerBar',
      chapterTitle: this.props.metaData.title ? this.props.metaData.title : 'Generic Header',
      pageTitle: this.props.metaData.title ? this.props.metaData.title : 'Generic Header',
      isChapterOpener: true
    };

    let bookmarksObj = {
      bookmarksArr : this.props.bookmarkList ? this.props.bookmarkList : []
    };
    let notesObj = {
      notes : this.props.annotations.data.annotationList ? this.props.annotations.data.annotationList : []
    };
    let bookDetails = {
      author : this.props.metaData.authorName,
      title : this.props.metaData.title
    };
    let pageIdString = this.state.currPageIndex.toString();
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.goToPageCallback = this.goToPage;

    return (
      <div>
      <HeaderComponent
        locale={"en-US"}
        bookshelfClick={this.props.bookCallbacks.handleBookshelfClick}
        drawerClick={this.handleDrawer}
        bookmarkIconData={callbacks}
        handlePreferenceClick={this.handlePreferenceClick}
        handleDrawerkeyselect={this.handleDrawerkeyselect}
        prefOpen={this.state.prefOpen}
        searchOpen={this.state.searchOpen}
        hideIcons={hideIcons}
        headerTitleData={headerTitleData}
        moreIconData={moreMenuData} />
      
      {this.props.tocData.data.fetched && <DrawerComponent
        isDocked={false}
        drawerWidth={400}
        isDraweropen={this.state.drawerOpen}
        hideDrawer={this.hideDrawer}
        bookDetails={bookDetails}
        tocData={this.props.tocData}
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
                prefKeySelect = {this.handlePreferenceKeySelect}/> : 
              <PreferencesComponent
                fetch = {this.props.getPreference}
                preferenceUpdate = {this.props.updatePreference}
                disableBackgroundColor = {false}
                locale = {"en-US"} />
            }
          </div> : <div className="empty" />
        }
      </div>

      {!this.state.isFirstPageBeingLoad ? 
        <Navigation
          onPageRequest={this.onPageRequest}
          pagePlayList={this.props.pageList}
          currentPageId={this.state.currPageIndex}
          /> : null
      }

        <div id="main" className="pdf-fwr-pc-main">
            <div id="right" className="pdf-fwr-pc-right">
              <div id="toolbar" className="pdf-fwr-toolbar" />
              <div id="frame" className = {viewerClassName}>
                <div id="docViewer" className="docViewer" />
              </div>
            </div>
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