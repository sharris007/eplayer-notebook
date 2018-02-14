import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './PdfPlayer.scss';
import { triggerEvent, registerEvent, Resize, addEventListenersForWebPDF, removeEventListenersForWebPDF } from './webPDFUtil';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { Navigation } from '@pearson-incubator/aquila-js-core';

let docViewerId = 'docViewer';

class PdfPlayer extends Component {

  constructor(props){
    super(props);
    this.state = {
      pageLoaded : false,
      data : {},
      isFirstPageBeingLoad : true,
      currPageIndex : 0
    }
    registerEvent('viewerReady', this.renderPdf.bind(this));
    registerEvent('pageLoaded', this.onPageLoad.bind(this));
  }

  componentDidMount(){
    let pageIndexToLoad;
    if(this.props.coverPage){
      pageIndexToLoad = 'cover';
    }else{
      pageIndexToLoad = 1;
    }
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
          triggerEvent('viewerReady', pageIndexToLoad);
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
        triggerEvent('viewerReady', pageIndexToLoad);
      })
    }
  }

  componentWillUnmount(){
    window.removeEventListener('resize', Resize);
    removeEventListenersForWebPDF();
    eventMap = [];
  }

  renderPdf = (pageIndexToLoad) => {
    let openFileParams = {};
    let currPageIndex;
    if(isNaN(pageIndexToLoad)){
      openFileParams.url = this.props.coverPage.pdfPath;
      currPageIndex = this.props.coverPage.id;
    }else{
      let currPageObj = find(this.props.pageList, page => page.id == pageIndexToLoad);
      openFileParams.url = currPageObj.pdfPath;
      currPageIndex = currPageObj.id;
    }
    WebPDF.ViewerInstance.openFileByUri(openFileParams);
    this.setState({currPageIndex});
   }

  onPageLoad = () => {
    if(this.state.isFirstPageBeingLoad == true){
      this.setState({isFirstPageBeingLoad : false})
    }
    this.setState({pageLoaded : true});
  }

  onPageRequest = (requestedPageObj) => {
    this.setState({pageLoaded : false});
    let requestedPageOrder = requestedPageObj.id;
    this.renderPdf(requestedPageOrder);
  }

  addBookmarkHandler = () => {}
  removeBookmarkHandler = () => {}
  isCurrentPageBookmarked = () => {}

  handleBookshelfClick = () => {}
  handleDrawerkeyselect = () => {}
  handleDrawer = () => {}
  handlePreferenceClick = () => {}
  
/**
 * Function defined to handle the window resize event.
 */
 
  render() {
    let viewerClassName;
    if (this.state.pageLoaded !== true) {
      viewerClassName = 'hideViewerContent';
    } else {
      viewerClassName = '';
    }
    let moreMenuData = {};
    moreMenuData.menuItem = [];
    let moreMenuItem = {
      type : 'menuItem',
      value : 'SignOut',
      text : 'Sign Out',
    }
    moreMenuData.menuItem.push(moreMenuItem);

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
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    let pageList = [...this.props.pageList];
    if(this.props.coverPage){
      pageList.unshift(this.props.coverPage);
    }
    return (
      <div>
      <HeaderComponent
        locale={"en-US"}
        bookshelfClick={this.props.bookCallbacks.handleBookshelfClick}
        drawerClick={this.handleDrawer}
        bookmarkIconData={callbacks}
        handlePreferenceClick={this.handlePreferenceClick}
        handleDrawerkeyselect={this.handleDrawerkeyselect}
        prefOpen={false}
        searchOpen={false}
        hideIcons={hideIcons}
        headerTitleData={headerTitleData}
        moreIconData={moreMenuData} />
      {!this.state.isFirstPageBeingLoad ? 
        <Navigation
          onPageRequest={this.onPageRequest}
          pagePlayList={pageList}
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