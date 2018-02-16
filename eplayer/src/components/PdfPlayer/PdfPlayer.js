import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './PdfPlayer.scss';
import { triggerEvent, registerEvent, Resize, addEventListenersForWebPDF, removeEventListenersForWebPDF } from './webPDFUtil';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { Navigation } from '@pearson-incubator/aquila-js-core';
import { DrawerComponent } from '@pearson-incubator/vega-drawer';
import { PreferencesComponent } from '@pearson-incubator/preferences';

var pdfWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/pdfworker.js');
var fileIdWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/fileidworker.js');

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
      currZoomLevel: 1
    }
    registerEvent('viewerReady', this.renderPdf.bind(this));
    registerEvent('pageLoaded', this.onPageLoad.bind(this));
    if(window.Worker){
      pdfWorker.postMessage([this.props.pageList,0,0]);
    }
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
        var a = this.props.pageList[i].pdfPath;
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
    }
    this.setState({pageLoaded : true});
    this.setCurrentZoomLevel(this.state.currZoomLevel);
  }

  onPageRequest = (requestedPageObj) => {
    this.setState({pageLoaded : false});
    this.renderPdf(requestedPageObj);
  }

  goToPage = (pageNo) => {
    this.setState({pageLoaded : false});
    this.renderPdf(pageNo);
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
        bookId : this.props.currentbook.bookId ? this.props.currentbook.bookId :'12345',
      },
      classname: 'headerBar',
      chapterTitle: this.props.currentbook.title ? this.props.currentbook.title : 'Generic Header',
      pageTitle: this.props.currentbook.title ? this.props.currentbook.title : 'Generic Header',
      isChapterOpener: true
    };

    var bookmarksObj = {
      bookmarksArr : this.props.bookmarkList ? this.props.bookmarkList : []
    };
    var notesObj = {
      notes : this.props.annotationList ? this.props.annotationList : []
    };
    var bookDetails = {
      author : this.props.currentbook.authorName,
      title : this.props.currentbook.title
    };
    var pageIdString = this.state.currPageIndex.toString();
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.removeAnnotationHandler = this.removeAnnotationHandler;
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
      {this.props.isPdfPlayer ? <div className="preferences-container-etext">
        {this.state.prefOpen ? 
          <div className="content">
          <PreferencesComponent isET1={this.props.isPdfPlayer} 
          setCurrentZoomLevel={this.setCurrentZoomLevel}
          disableBackgroundColor={true}
          prefKeySelect = {this.handlePreferenceKeySelect}/></div> : <div className="empty" />} 
          </div> :
          <div className="preferences-container">
        {this.state.prefOpen ? 
          <div className="content">
          <PreferencesComponent fetch={this.props.getPreference} 
          preferenceUpdate={this.props.updatePreference}
          disableBackgroundColor={false} 
          locale="en" />
          </div> : <div className="empty" />} 
      </div>}

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
  currentbook : PropTypes.object,
  bookCallbacks : PropTypes.object,
  coverPage : PropTypes.object
}

PdfPlayer.defaultProps = {
  
}
export default PdfPlayer;