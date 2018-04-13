/* global sessionStorage, localStorage, pdfAnnotatorInstance, piSession, $, fileIdsList, eventMap, SparkMD5, WebPDF, fileIdWorker, jQuery, parent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import { browserHistory } from 'react-router';
import Popup from 'react-popup'; // eslint-disable-line import/no-extraneous-dependencies
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { Navigation } from '@pearson-incubator/aquila-js-core';
import { DrawerComponent } from '@pearson-incubator/vega-drawer';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import { AudioPlayer, VideoPlayerPreview, ImageViewerPreview } from '@pearson-incubator/aquila-js-media';
import { ExternalLink } from '@pearson-incubator/aquila-js-basics';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import './PdfPlayer.scss';
import { initializeWebPDF, registerEvent, resize, removeEventListenersForWebPDF } from './webPDFUtil';
import { getSelectionInfo, restoreHighlights, reRenderHighlightCornerImages, resetHighlightedText }
  from './pdfUtility/annotaionsUtil';
import { displayRegions, handleRegionClick, handleTransparentRegionHover, handleTransparentRegionUnhover, getRegionDetails }
  from './pdfUtility/regionsUtil';
import { languages } from '../../../locale_config/translations/index';
import { createHttps } from '../Utility/Util';
import { pdfConstants } from './constants/pdfConstants';
import { resources } from '../../../const/Settings';

const queryString = require('query-string');

// let pdfWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/pdfworker.js');
// let fileIdWorker = new Worker('/eplayer/pdf/foxit_client_lib/pdfPlayerWorkers/fileidworker.js');

window.fileIdsList = [];

let bookContainerId;
const consoleUrl = resources.links.consoleUrl;

class PdfPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageLoaded: false,
      isFirstPageBeingLoad: true,
      drawerOpen: false,
      prefOpen: false,
      searchOpen: false,
      popUpCollection: [],
      chapterPdfFected: false,
      chapterList: [],
      currentChapter: {},
      currPageObj: {},
      isDialogOpen: false
    };
    this.currPageIndex = 0;
    this.showHighlight = true;
    this.showHotspot = this.props.preferences.showHostpot;
    this.highlightList = [];
    this.currZoomLevel = 1;
    this.envType = this.props.envType ? this.props.envType : 'nonprod';
    this.searchTerm = null;

    registerEvent('viewerReady', this.renderPdf.bind(this));
    registerEvent('pageLoaded', this.onPageLoad.bind(this));
    registerEvent('highlightClicked', this.handleHighlightClick);
    registerEvent('regionClicked', this.fetchClickedRegionData.bind(this));
    registerEvent('RegionHovered', handleTransparentRegionHover);
    registerEvent('RegionUnhovered', handleTransparentRegionUnhover);
    pdfAnnotatorInstance.init(resetHighlightedText);
  }

  componentDidMount() {
    let pageIndexToLaunch;
    if (sessionStorage.getItem('currPageIndex')) {
      pageIndexToLaunch = parseInt(sessionStorage.getItem('currPageIndex'), 10);
      if (isNaN(pageIndexToLaunch)) {
        pageIndexToLaunch = sessionStorage.getItem('currPageIndex');
      }
    } else if (this.props.pagePlayList[0].isCover) {
      pageIndexToLaunch = this.props.metaData.pageIndexTolaunch ? this.props.metaData.pageIndexTolaunch : // eslint-disable-line no-nested-ternary
                            this.props.metaData.startPageNo ? this.props.metaData.startPageNo : 'cover';
    } else {
      pageIndexToLaunch = this.props.metaData.pageIndexTolaunch ? this.props.metaData.pageIndexTolaunch :// eslint-disable-line no-nested-ternary
                            this.props.metaData.startPageNo ? this.props.metaData.startPageNo : 1;
    }
    initializeWebPDF(pdfConstants.foxitBaseUrl[this.envType], pageIndexToLaunch);
    if (this.props.preferences.showAnnotation) {
      $('#frame').on('mouseup mousedown dblclick', this.handleSelection);
    }
    try {
      $('.searchIconBtn').on('click', () => {
        this.setState({ prefOpen: false });
        Popup.close();
      });
      $('.prefIconBtn').on('click', () => {
        Popup.close();
      });
    } catch (e) {
      // error
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', resize);
    removeEventListenersForWebPDF();
    eventMap = []; // eslint-disable-line no-global-assign
    window.fileIdsList = [];
    sessionStorage.removeItem('currPageIndex');
  }

  preLoadPdf = (preFetchPageList, startIndex, endIndex) => {
    if (window.Worker) {
      const g = new SparkMD5.ArrayBuffer();
      fileIdWorker.postMessage([preFetchPageList, window.fileIdsList, startIndex, endIndex,
        WebPDF.AccountInstance.getUserAccount(), WebPDF.AccountInstance.getUserId(), g.end(),
        pdfConstants.foxitBaseUrl[this.envType]]);
      fileIdWorker.onmessage = (e) => {
        window.fileIdsList.push(e.data);
      };
    }
  }

  preFetchPages = (pageIndex) => {
    const lowerIndex = pageIndex - 5;
    const upperIndex = pageIndex + 5;
    let startIndex;
    let endIndex;
    const preFetchPageList = [];
    if ((lowerIndex >= 0) && (upperIndex < this.props.pagePlayList.length)) {
      startIndex = lowerIndex;
      endIndex = upperIndex;
    } else if ((lowerIndex >= 0) && !(upperIndex < this.props.pagePlayList.length)) {
      startIndex = lowerIndex;
      endIndex = this.props.pagePlayList.length - 1;
    } else if (!(lowerIndex >= 0) && (upperIndex < this.props.pagePlayList.length)) {
      startIndex = 0;
      endIndex = upperIndex;
    }
    if (window.fileIdsList.length) {
      for (let i = startIndex; i <= endIndex; i++) {
        const a = this.props.pagePlayList[i].pdfPath;
        let fileIDPresent = false;
        for (let i = 0; i < window.fileIdsList.length; i++) {
          const assetObj = fileIdsList[i];
          if (assetObj[a] === undefined) {
            fileIDPresent = false;
          } else {
            fileIDPresent = true;
            break;
          }
        }
        if (fileIDPresent === true) {
          continue;
        } else {
          preFetchPageList.push(this.props.pagePlayList[i]);
        }
      }
      this.preLoadPdf(preFetchPageList, 0, (preFetchPageList.length - 1));
    } else {
      this.preLoadPdf(this.props.pagePlayList, startIndex, endIndex);
    }
  }

/* Method for removing hotspot content on clicking the close button*/
  onHotspotCloseButton = () => {
    try {
      $('#hotspot').empty();
      $('#player-iframesppModalBody').remove();
      $('.link-model').remove();
      $('#sppModal').css('display', 'none');
      if (this.state.regionData) {
        this.setState({ regionData: null });
      }
      $('.ReactModalPortalAnimated').remove();
      $('.regionContainer').css('display','none');
    } catch (e) {
      // error
    }
  }
  renderPdf = (requestedPage) => {
    this.setState({ drawerOpen: false });
    this.setState({ prefOpen: false });
    this.setState({ searchOpen: false });
    try {
      $('#highlightcornerimages').remove();
      $('.fwr-highlight-annot').remove();
    } catch (e) {
      // error
    }
    sessionStorage.setItem('currPageIndex', requestedPage);
    const multipageConfig = pdfConstants.multipageConfig;
    if (multipageConfig.isMultiPageSupported) {
      const requestedPageObj = _.find(this.props.pagePlayList, page => page.id === requestedPage);
      if (this.state.currentChapter !== undefined && this.state.currentChapter.startpageno &&
          this.state.currentChapter.startpageno <= requestedPage &&
          this.state.currentChapter.endpageno >= requestedPage) {
        const goToPageNo = requestedPage - this.state.currentChapter.startpageno;
        if (goToPageNo >= 0) {
          WebPDF.ViewerInstance.gotoPage(goToPageNo);
          this.setState({ currPageObj: requestedPageObj }, () => {
            this.displayHighlights();
            this.displayHotspots();
          });
        }
      } else {
        let chapterObj;
        this.state.chapterList.forEach((chapter) => {
          if (chapter.startpageno <= requestedPage && chapter.endpageno >= requestedPage) {
            chapterObj = chapter;
          }
        });
        if (chapterObj !== undefined) {
              // <TestCode>
          const d = new Date();
          this.pageLoadStartTime = d.getTime();
              // </TestCode>
          WebPDF.ViewerInstance.openFileByUri({ url: chapterObj.chapterpdf });
          this.pageNoToLoad = requestedPage - chapterObj.startpageno;
          const currChapterList = this.state.chapterList;
          currChapterList.push(chapterObj);
          this.setState({ currPageObj: requestedPageObj,
            chapterList: currChapterList,
            currentChapter: chapterObj,
            chapterPdfFected: false,
            pageLoaded: false });
        } else {
          const pageRangeBucket = Math.ceil(requestedPage / multipageConfig.pagesToDownload);
          let endpageno = pageRangeBucket * multipageConfig.pagesToDownload;
          let startpageno = Math.abs(endpageno - (multipageConfig.pagesToDownload - 1));
          if (endpageno > this.props.metaData.lastPage ||
            this.props.metaData.totalpages <= multipageConfig.pagesToDownload) {
            endpageno = this.props.metaData.lastPage;
          }
          if (startpageno < this.props.metaData.startPageNo) {
            startpageno = this.props.metaData.startPageNo;
          }
          this.props.bookCallbacks.fetchChapterLevelPdf(this.props.metaData.bookId, startpageno, endpageno,
            this.props.metaData.globalBookId, this.props.metaData.serverDetails).then((chapterPdfObj) => {
              WebPDF.ViewerInstance.openFileByUri({ url: chapterPdfObj.chapterpdf });
              // <TestCode>
              const d = new Date();
              this.pageLoadStartTime = d.getTime();
              // </TestCode>
              this.pageNoToLoad = requestedPage - chapterPdfObj.startpageno;
              const currChapterList = this.state.chapterList;
              currChapterList.push(chapterPdfObj);
              this.setState({ currPageObj: requestedPageObj,
                chapterList: currChapterList,
                currentChapter: chapterPdfObj,
                chapterPdfFected: false,
                pageLoaded: false });
            });
        }
      }
    } else {
      this.setState({ pageLoaded: false });
      const index = _.findIndex(this.props.pagePlayList, page => page.id === requestedPage);
      const requestedPageObj = this.props.pagePlayList[index];
      // <TestCode>
      this.currPageNumber = requestedPageObj.pagenumber;
      const d = new Date();
      this.pageLoadStartTime = d.getTime();
      this.isPageLoaded = true;
      // </TestCode>
      this.setState({ currPageObj: requestedPageObj });
      // WebPDF.ViewerInstance.openFileByUri({ url: requestedPageObj.pdfPath });
      WebPDF.ViewerInstance.openFileByUri({ url: requestedPageObj.pageServiceUrl });
    }
    const viewer = this;
    $(document).on('keyup', (evt) => {
      if (evt.keyCode === 27) {
        try {
          Popup.close();
          $('#player-iframesppModalBody').remove();
          $('.link-model').remove();
          $('#sppModal').css('display', 'none');
          viewer.setState({ regionData: null });
          $('.ReactModalPortalAnimated').remove();
          $('.regionContainer').css('display','none');
        } catch (e) {
          // error
        }     
      }
    });
  }

  onPageLoad = () => {
    const multipageConfig = pdfConstants.multipageConfig;
    // <TestCode>
    if (!multipageConfig.isMultiPageSupported && this.isPageLoaded) {
      this.isPageLoaded = false;
      const d = new Date();
      const pageLoadTime = d.getTime() - this.pageLoadStartTime;
      console.log(`Time taken to load the page ${this.currPageNumber} is ${pageLoadTime / 1000} secs`);
      this.pageLoadStartTime = 0;
    } else if (!multipageConfig.isMultiPageSupported && !this.isPageLoaded) {
      return;
    }
    // </TestCode>
    if (multipageConfig.isMultiPageSupported) {
      $('.fwrJspVerticalBar').remove();
    }
    WebPDF.ViewerInstance.setLayoutShowMode(2);
    let pagesToNavigate;
    if (multipageConfig.pagesToNavigate > this.props.metaData.totalpages) {
      pagesToNavigate = this.props.metaData.totalpages;
    } else if (this.state.currentChapter && multipageConfig.pagesToNavigate >
      ((this.state.currentChapter.endpageno - this.state.currentChapter.startpageno) + 1)) {
      pagesToNavigate = (this.state.currentChapter.endpageno - this.state.currentChapter.startpageno) + 1;
    } else {
      pagesToNavigate = multipageConfig.pagesToNavigate;
    }
    let callBackForManualNav = false;
    if (multipageConfig.isMultiPageSupported) {
      const webPdfCurrPageIndex = WebPDF.ViewerInstance.getCurPageIndex();
      if (webPdfCurrPageIndex < (pagesToNavigate - 1) && !this.state.chapterPdfFected) {
        callBackForManualNav = true;
        WebPDF.ViewerInstance.gotoPage(webPdfCurrPageIndex + 1);
      } else if (webPdfCurrPageIndex === (pagesToNavigate - 1) && !this.state.chapterPdfFected) {
        const d = new Date();
        const pageLoadTime = d.getTime() - this.pageLoadStartTime;
        console.log(`Time taken to load first page of current chapter is ${pageLoadTime / 1000} secs`);
        this.pageLoadStartTime = 0;
        WebPDF.ViewerInstance.gotoPage(this.pageNoToLoad);
        this.setState({ chapterPdfFected: true, pageLoaded: true });
        this.setCurrentZoomLevel(this.currZoomLevel);
      }
    }
    if (this.state.isFirstPageBeingLoad === true && !callBackForManualNav) {
      this.setState({ isFirstPageBeingLoad: false, pageLoaded: true });
      $('.moreIconBtn').on('click', this.handleHeaderClick);
      document.getElementById('frame').addEventListener('click', this.handleHeaderClick);
      $('.navigation').on('click', this.handleHeaderClick);
      if (this.props.preferences.showAnnotation) {
        this.props.annotations.load.get(this.props.auth, this.props.metaData).then(() => {
          this.displayHighlights();
        });
      }
      if (this.props.preferences.showDrawer) {
        this.props.toc.load.get(this.props.metaData);
      }
      if (this.props.preferences.showHostpot) {
        this.props.basepaths.load.get(this.props.metaData, this.props.auth).then(() => {
          this.displayHotspots();
        });
      }
      if (this.props.preferences.showBookmark) {
        this.props.bookmarks.load.get(this.props.auth, this.props.metaData);
      }
    } else if (!callBackForManualNav) {
      this.setCurrentZoomLevel(this.currZoomLevel);
      this.setState({ pageLoaded: true });
    }
    if(this.searchTerm){
      this.searchTextFunc(this.searchTerm);
    }
    this.searchTerm = null;
  }

  onPageChange = () => {
    // this method is called when we change the page. Not yet used.
  }

  onPageRequest = (requestedPageObj) => {
    try {
      this.onHotspotCloseButton();
      this.setState({ popUpCollection: [] });
    } catch (e) {
      // error
    }
    if (_.isObject(requestedPageObj)) {
      this.renderPdf(requestedPageObj.id);
    }
    this.searchTerm = null;
  }

  goToPage = (pageNo) => {
    try {
      $('#printFrame').remove();

      this.onHotspotCloseButton();
      this.setState({ popUpCollection: [] });
    } catch (e) {
      // error
    }
    if (pageNo !== this.state.currPageObj.id) {
      this.renderPdf(pageNo);
    } else {
      this.setState({ drawerOpen: false });
      this.setState({ prefOpen: false });
      this.setState({ searchOpen: false });
    }
  }

  goToPageNumber = (pageNo) => {
    let pageToNavigate;
    const pages = this.props.pagePlayList;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].pagenumber === pageNo) {
        pageToNavigate = pages[i];
      }
    }
    if (pageToNavigate !== undefined) {
      this.goToPage(pageToNavigate.id);
    }
    this.searchTerm = null;
  }

  handleSelection = () => {
    try {
      const curToolHandlerName = WebPDF.ViewerInstance.getCurToolHandlerName();
      const selectedText = WebPDF.ViewerInstance.getToolHandlerByName(curToolHandlerName)
      .getTextSelectService().getSelectedText();
      if (selectedText.toString().trim() !== '') {
        const selection = document.querySelectorAll('.fwr-text-highlight');
        const highlight = getSelectionInfo();
        this.createHighlight(selection, highlight);
      }
    } catch (e) {
      // error
    }
  }

  createHighlight = (highlightData, highlight) => {
    try {
      const highLightcordinates = {
        left: highlightData[0].offsetLeft,
        top: highlightData[0].offsetTop,
        width: highlightData[0].offsetWidth,
        height: highlightData[0].offsetHeight
      };
      const currentHighlight = {};
      const highlightList = this.highlightList;
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
      if (selectedHighlight !== undefined && selectedHighlight.meta.roletypeid === _.toString(3) &&
                this.props.metaData.roletypeid === _.toString(2)) {
        return;
      } else if (selectedHighlight !== undefined && isExistinghighlightFound) {
        this.handleHighlightClick(selectedHighlight.id);
      } else {
        const highlightsLength = highlightList.length;
        currentHighlight.id = highlightsLength + 1;
        currentHighlight.highlightHash = highlight.highlightHash;
        currentHighlight.selection = highlight.selection;
        currentHighlight.pageIndex = highlight.pageInformation.pageNumber;
        pdfAnnotatorInstance.showCreateHighlightPopup(currentHighlight, highLightcordinates,
          this.saveHighlight.bind(this), this.editHighlight.bind(this),
          `docViewer_ViewContainer_PageContainer_${WebPDF.ViewerInstance.getCurPageIndex()}`,
          (languages.translations[this.props.preferences.locale]), this.props.metaData.roletypeid,
          this.props.metaData.courseId, this.props.metaData.scenario);
      }
    } catch (e) {
      // error
    }
  }

  handleHighlightClick = (highLightClickedData) => {
    let hId;
    let cornerFoldedImageTop;
    try {
      if (highLightClickedData.highlightId === undefined) {
        hId = highLightClickedData;
      } else {
        hId = highLightClickedData.highlightId;
        cornerFoldedImageTop = highLightClickedData.cornerFoldedImageTop;
      }
      let highlightClicked = _.find(this.highlightList, highlight => highlight.id === hId);
      if (highlightClicked.shared === true) {
        highlightClicked = _.find(this.props.annotations.data.annotationList, highlight => highlight.id === hId);
      }
      highlightClicked.color = highlightClicked.originalColor;
      pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,
        this.editHighlight.bind(this), this.deleteHighlight.bind(this),
        `docViewer_ViewContainer_PageContainer_${WebPDF.ViewerInstance.getCurPageIndex()}`,
        (languages.translations[this.props.preferences.locale]), this.props.metaData.roletypeid,
        cornerFoldedImageTop, this.props.metaData.courseId, this.props.metaData.scenario);
    } catch (e) {
      // error
    }
  }

  deleteHighlight = (id) => {
    try {
      $(`#${id}`).remove();
      $(`#${id}_cornerimg`).remove();
    } catch (e) {
      // error
    }
    this.props.annotations.operation.delete(id, this.props.auth, this.props.metaData).then(() => {
      this.displayHighlights();
    });
  }

  saveHighlight = (currentHighlight, highLightMetadata) => {
    const currentPageId = this.state.currPageObj.id;
    // const courseId = _.toString(this.props.metaData.courseId);
    try {
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
      const currentPage = _.find(this.props.pagePlayList, page => page.id === currentPageId);
      const highlightData = {
        color: highLightMetadata.currHighlightColor,
        note,
        meta,
        selectedText,
        isShared
      };
      this.props.annotations.operation.post(this.props.auth, this.props.metaData, currentPage, highlightData)
      .then((newHighlight) => {
        pdfAnnotatorInstance.setCurrentHighlight(newHighlight);
        this.displayHighlights();
      });
    } catch (e) {
      // error
    }
  }

  editHighlight = (id, highLightMetadata) => {
    const currentPage = this.state.currPageObj.id;
    try {
      const highlightToEdit = _.find(this.highlightList, highlight => highlight.id === id);
      const note = highLightMetadata.noteText !== undefined ? highLightMetadata.noteText : highlightToEdit.comment;
      const color = highLightMetadata.currHighlightColor !== undefined ?
      highLightMetadata.currHighlightColor : highlightToEdit.color;
      const isShared = highLightMetadata.isShared !== undefined ?
      highLightMetadata.isShared : highlightToEdit.shared;
      const meta = highlightToEdit.meta;
      meta.colorcode = color;
      const highlightData = {
        note,
        color,
        isShared,
        meta
      };
      this.props.annotations.operation.put(this.props.auth, this.props.metaData, currentPage, highlightData,
        highlightToEdit).then(() => {
          this.displayHighlights();
        });
    } catch (e) {
      // error
    }
  }

  displayHighlights = () => {
    if (!this.props.preferences.showAnnotation) {
      return;
    }
    const highlightList = [];
    const noteList = [];
    this.props.annotations.data.annotationList.forEach((annotation) => {
      const annotationItem = annotation;
      if (annotationItem.pageId === this.state.currPageObj.id) {
        if (annotationItem.shared) {
          annotationItem.color = '#00a4e0';
          annotationItem.meta.colorcode = '#00a4e0';
        } else {
          annotationItem.color = annotationItem.originalColor;
          annotationItem.meta.colorcode = annotationItem.originalColor;
        }
        highlightList.push(annotationItem);
        if (!annotationItem.isHighlightOnly) {
          noteList.push(annotationItem);
        }
      }
    });
    if (highlightList.length > 0) {
      restoreHighlights(highlightList);
    }
    if (noteList.length > 0) {
      reRenderHighlightCornerImages(noteList);
    }
    this.highlightList = highlightList;
    if (this.showHighlight === false) {
      try {
        $('.fwr-highlight-annot').css('visibility', 'hidden');
        this.showHighlight = false;
      } catch (e) {
        // error
      }
    }
  }

  handleDrawerkeyselect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.setState({ drawerOpen: true, regionData : null });
    }
  }

  handleDrawer = () => {
    this.setState({ drawerOpen: true, regionData : null });
    this.setState({ prefOpen: false });
    this.setState({ searchOpen: false });
    try {
      Popup.close();
    } catch (e) {
      // error
    }
  }

  hideDrawer = () => {
    if (this.state.drawerOpen) {
      try {
        document.getElementsByClassName('drawerIconBtn')[0].focus();
      } catch (e) {
        // error
      }
    }
    this.setState({ drawerOpen: false });
  }

  handlePreferenceClick = () => {
    try {
      const prefIconleft = $('.prefIconBtn').offset().left - 181;
      $('.preferences-container-etext').css('left', prefIconleft);
      Popup.close();
    } catch (e) {
      // error
    }
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
    let currZoomLevel = this.currZoomLevel;
    if (level <= 0.1) {
      currZoomLevel = 0.1;
    } else {
      currZoomLevel = level;
    }
    this.resetCurrentZoomLevel(level);
    this.currZoomLevel = currZoomLevel;
    this.displayHighlights();
    if(this.state.currPageObj.isCover !== true)
    {
      this.displayHotspots();
    }
    if($('.fwr-search-result-highlight').length){
      WebPDF.ViewerInstance.highlightSearchResult();
    }
  }

  resetCurrentZoomLevel = (level) => {
    WebPDF.ViewerInstance.zoomTo(level);
  }

  fetchClickedRegionData(clickedRegion) {
    try {
      Popup.close();
      this.onHotspotCloseButton();
    } catch (e) {
      // error
    }
    let regionhot;
    const that = this;
    if(_.isObject(clickedRegion)){
      regionhot = getRegionDetails(clickedRegion, that.props.basepaths.data);
    }else{
      regionhot = handleRegionClick(clickedRegion, that.props.basepaths.data);
    }
            /* Checking if the clicked hotspot is Image/Video/Audio/URL and open it in MMI Component */
    if (regionhot.hotspotType === 'IMAGE' || regionhot.hotspotType === 'VIDEO' ||
        regionhot.hotspotType === 'AUDIO' || regionhot.hotspotType === 'URL') {
              /* Updating the state to rerender the page with Aquila JS Component*/
      that.setState({ regionData: regionhot } , () => {
          if (that.state.regionData.hotspotType === 'IMAGE') {
          try {
            $('.preview-image').hide();
            jQuery(() => {
              jQuery('.preview-image').click();
            });
          } catch (e) {
            // error
          }
          document.getElementById('hotspot').className = 'hotspotContent';
        } else if (that.state.regionData.hotspotType === 'VIDEO') {
          try {
            $('.poster-play-icon').hide();
            $('.thumb-nail').hide();
            jQuery(() => {
              jQuery('.poster-play-icon').click();
            });
          } catch (e) {
            // error
          }
          document.getElementById('hotspot').className = 'videoContent';
        } else if (that.state.regionData.hotspotType === 'URL') {
          try {

            const ExternalLinkComponent = document.getElementsByClassName('link-model')[0];
            document.getElementById('root').appendChild(ExternalLinkComponent);
            ExternalLinkComponent.style.backgroundColor = '#ffffff';
          } catch (e) {
            // error
          }
        } else if (that.state.regionData.hotspotType === 'AUDIO' &&
          that.state.regionData.linkTypeID === pdfConstants.LinkType.FACELESSAUDIO) {
          try {
            $('.aquila-audio-player').hide();
            jQuery(() => {
              jQuery('.play-pause').click();
            });
          } catch (e) {
            // error
          }
          document.getElementById('hotspot').className = 'hotspotContent';
        }
        if (that.state.regionData.hotspotType === 'AUDIO' &&
          that.state.regionData.linkTypeID !== pdfConstants.LinkType.FACELESSAUDIO) {
          try {
            jQuery(() => {
              jQuery('.play-pause').click();
            });
            $.getScript('https://code.jquery.com/ui/1.12.1/jquery-ui.js', () => {
              $('.regionContainer').draggable();
            });
            $('.regionContainer').css('display','block');
            $('#regionCloseBtn').css('display','block');
          } catch (e) {
            // error
          }
          document.getElementById('hotspot').className = 'hotspotContent';
        }
      });
    } else {
      that.renderHotspot(regionhot);
    }
  }

  renderHotspot = (hotspotDetails) => {
    let regionComponent = ' ';
    let hotspotData;
    let source;
    switch (hotspotDetails.hotspotType) {
      case 'AUDIO': {
        source = createHttps(hotspotDetails.linkValue);
        hotspotData = {
          audioSrc: source,
          audioTitle: hotspotDetails.name
        };
        regionComponent = <AudioPlayer url={hotspotData.audioSrc} title={hotspotData.audioTitle} />;
        break;
      }
      case 'PAGENUMBER': {
        this.goToPageNumber(hotspotDetails.linkValue);
        break;
      }
      case 'EMAIL': {
        const email = `mailto:${hotspotDetails.linkValue}`;
        parent.location = email;
        break;
      }
      case 'IMAGE': {
        source = createHttps(hotspotDetails.linkValue);
        hotspotData = {
          alt: hotspotDetails.name,
          src: source,
          title: hotspotDetails.name,
          items: hotspotDetails
        };
        regionComponent = <ImageViewerPreview data={hotspotData} />;
        break;
      }
      case 'VIDEO': {
        source = createHttps(hotspotDetails.linkValue);
        hotspotData = {
          title: hotspotDetails.name,
          src: source,
          caption: hotspotDetails.description || '',
          id: hotspotDetails.regionID,
          thumbnail: {
            src: ''
          },
          alt: hotspotDetails.name
        };
        regionComponent =
          <VideoPlayerPreview data={hotspotData} embeddedMode={false} onClose={this.onHotspotCloseButton} />;
        break;
      }
      case 'SPPASSET': {
        source = hotspotDetails.linkValue;
        document.getElementById('sppTitle').innerText = hotspotDetails.name;
        const sppHeaderHeight = document.getElementById('sppModalHeader').style.height;
        const sppPlayer = document.getElementById('sppModalBody');
        const lastIndex = source.lastIndexOf('/');
        const assetID = source.slice(lastIndex + 1);
        const scriptContent = `https://mediaplayer.pearsoncmg.com/assets/_embed.sppModalBody/${assetID}`;
        const sppScript = document.createElement('SCRIPT');
        sppScript.src = scriptContent;
        sppPlayer.appendChild(sppScript);
        sppPlayer.style.height = `${document.documentElement.clientHeight - parseInt(sppHeaderHeight, 10)}px`;
        sppPlayer.style.width = `${document.documentElement.clientWidth}px`;
        document.getElementById('sppCloseBtn').addEventListener('click', this.onHotspotCloseButton);
        try {
          document.getElementById('root').appendChild(document.getElementById('sppModal'));
          $('#sppModal').css('display', 'block');
        } catch (e) {
          // error
        }
        break;
      }
      case 'DOCUMENT': {
        source = hotspotDetails.linkValue;
        window.open(source, '_blank');
        break;
      }
      case 'URL': {
        source = createHttps(hotspotDetails.linkValue);
        hotspotData = {
          title: hotspotDetails.name,
          src: source
        };
        regionComponent =
          <ExternalLink title={hotspotData.title} src={hotspotData.src} onClose={this.onHotspotCloseButton} />;
        break;
      }
      case 'EXTERNALLINK': {
        source = hotspotDetails.linkValue;
        window.open(source, '_blank');
        break;
      }
      case 'LTILINK': {
        let courseId;
        if (this.props.metaData.activeCourseID === undefined || this.props.metaData.activeCourseID === '' ||
           this.props.metaData.activeCourseID === null) {
          courseId = -1;
        } else {
          courseId = this.props.metaData.activeCourseID;
        }
        const link = `${this.props.metaData.serverDetails}/ebook/toolLaunch.do?json=${hotspotDetails.linkValue}` +
        `&contextid=${courseId}&role=${this.props.metaData.roletypeid}&userlogin=${this.props.auth.userid}`;
        const ltiUrl = createHttps(link);
        window.open(ltiUrl, '_blank');
        break;
      }
      default : {
        regionComponent = null;
        break;
      }
    }
    return regionComponent;
  }

  displayHotspots = () => {
    if (!this.props.preferences.showHostpot) {
      return;
    }
    try {
      $('.hotspot').remove();
      $('.hotspotIcon').remove();
      $('.tooltiptext').remove();
      Popup.close();
    } catch (e) {
      // error
    }
    const lowerIndex = this.state.currPageObj.id;
    let startIndex;
    let endIndex;
    const lastPage = this.props.pagePlayList.length - 1;
    const lastPageIndex = this.props.pagePlayList[lastPage].id;
    const upperIndex = lowerIndex + 5;
    if ((lowerIndex >= 0) && (upperIndex < lastPageIndex)) {
      startIndex = lowerIndex;
      endIndex = upperIndex;
    } else if ((lowerIndex >= 0) && (upperIndex > lastPageIndex)) {
      startIndex = lowerIndex;
      endIndex = lastPageIndex;
    } else if (lowerIndex < 0) {
      return;
    }
    let pageIdsToFetch;
    if (startIndex && endIndex) {
      for (let arrIndex = startIndex; arrIndex <= endIndex; arrIndex++) {
        if (pageIdsToFetch === null || pageIdsToFetch === undefined || pageIdsToFetch === '') {
          pageIdsToFetch = arrIndex;
        } else if (pageIdsToFetch !== null && pageIdsToFetch !== undefined && pageIdsToFetch !== '') {
          pageIdsToFetch = `${pageIdsToFetch},${arrIndex}`;
        }
      }
    }
    let currentPageRegions;
    if (this.props.hotspots.data.regions.length > 0) {
      for (let k = 0; k < this.props.hotspots.data.regions.length; k++) {
        if (this.state.currPageObj.id === this.props.hotspots.data.regions[k].pageId) {
          currentPageRegions = this.props.hotspots.data.regions[k].hotspotList;
          if (currentPageRegions && currentPageRegions.length > 0) {
            displayRegions(currentPageRegions, this.props.metaData.bookFeatures, _);
            this.renderGlossary(currentPageRegions);
          }
        }
      }
    }
    if (currentPageRegions === null || currentPageRegions === '' || currentPageRegions === undefined) {
      try{
      this.props.hotspots.load.get(this.props.metaData, pageIdsToFetch).then(() => {
        if (this.props.hotspots.data.regions.length > 0) {
          for (let k = 0; k < this.props.hotspots.data.regions.length; k++) {
            if (this.state.currPageObj.id === this.props.hotspots.data.regions[k].pageId) {
              currentPageRegions = this.props.hotspots.data.regions[k].hotspotList;
              if (currentPageRegions && currentPageRegions.length > 0) {
                displayRegions(currentPageRegions, this.props.metaData.bookFeatures, _);
                this.renderGlossary(currentPageRegions);
              }
            }
          }
        }
      });
    }
    catch(e) {
      // error
    }
    }
    if(this.showHotspot !== true) {
      try {
        $(".hotspot").hide();
        $(".hotspotIcon").hide();
        this.showHotspot = false;
      }
      catch (e) {
        // error
      }
    }
  }

  renderGlossary = (currentPageRegions) => {
    this.setState({ popUpCollection: [] });
    let glossaryEntryIDsToFetch = '';
    const glossaryHotspots = [];
    for (let i = 0; i < currentPageRegions.length; i++) {
      if (currentPageRegions[i].regionTypeID === 5 && currentPageRegions[i].glossaryEntryID !== null) {
        glossaryHotspots.push(currentPageRegions[i]);
      }
    }
    const bookContainer = document.getElementById(
      `docViewer_ViewContainer_PageContainer_${WebPDF.ViewerInstance.getCurPageIndex()}`);
    bookContainerId = bookContainer.id;
    if (glossaryHotspots.length > 0) {
      for (let i = 0; i < glossaryHotspots.length; i++) {
        if (glossaryEntryIDsToFetch === '') {
          glossaryEntryIDsToFetch = glossaryHotspots[i].glossaryEntryID;
        } else {
          glossaryEntryIDsToFetch = `${glossaryEntryIDsToFetch},${glossaryHotspots[i].glossaryEntryID}`;
        }
      }
    }
    if (glossaryEntryIDsToFetch !== '') {
      this.props.glossary.load.get(this.props.metaData, glossaryEntryIDsToFetch).then(() => {
        const fetchedGlossaryDetails = [];
        for (let i = 0; i < this.props.glossary.data.length; i++) {
          for (let k = 0; k < glossaryHotspots.length; k++) {
            if ((this.props.glossary.data[i].glossaryEntryID).trim() === (glossaryHotspots[k].glossaryEntryID).trim()) {
              const glossTerm = {
                item: document.getElementById(`region_${glossaryHotspots[k].regionID}`),
                popOverCollection: {
                  popOverDescription: this.props.glossary.data[i].glossaryDefinition,
                  popOverTitle: this.props.glossary.data[i].glossaryTerm
                }
              };
              fetchedGlossaryDetails.push(glossTerm);
            }
          }
        }
        if (fetchedGlossaryDetails.length > 0) {
          this.setState({ popUpCollection: fetchedGlossaryDetails });
        }
      });
    }
  }

  handleSearchResultClick = (pageOrder) => {
    if (this.props.metaData.startPageNo) {
      if (pageOrder >= this.props.metaData.startPageNo
          && pageOrder <= this.props.metaData.lastPage) {
        this.goToPage(pageOrder);
      }else{
        this.setState({isDialogOpen : true})
      }
    } else {
      this.goToPage(pageOrder);
    }
  }

  handleDialogClose = () => {
    this.setState({isDialogOpen : false})
  }

  searchCallback = (searchTerm, handleResults) => {
    const that = this;
    this.props.search.load.get(this.props.metaData, searchTerm, handleResults).then((searchResult) => {
      if (searchResult[0].results.length){
        if (searchTerm.value !== undefined){
          this.searchTextFunc(searchTerm.value);
        } else {
          this.searchTextFunc(searchTerm);
        }
      }else{
        $('.fwr-search-result-highlight').remove();
      }
    });
    if (searchTerm.value !== undefined) {
      that.searchTerm = searchTerm.value;
    } else {
      that.searchTerm = searchTerm;
    }
    
  }

  searchTextFunc = (searchTerm) => {
    $('.fwr-search-result-highlight').remove();
    WebPDF.ViewerInstance.searchAllText(searchTerm,WebPDF.ViewerInstance.getCurPageIndex() + 1);
  }

  addBookmarkHandler = () => {
    const currentPageId = this.state.currPageObj.id;
    const currentPage = _.find(this.props.pagePlayList, page => page.id === currentPageId);
    this.props.bookmarks.operation.post(currentPage, this.props.auth, this.props.metaData);
  }

  removeBookmarkHandler = (bookmarkId) => {
    let currentPageId;
    if (bookmarkId !== undefined) {
      currentPageId = bookmarkId;
    } else {
      currentPageId = this.state.currPageObj.id;
    }
    const targetBookmark = _.find(this.props.bookmarks.data.bookmarkList, bookmark => bookmark.uri === currentPageId);
    const targetBookmarkId = targetBookmark.bkmarkId;
    this.props.bookmarks.operation.delete(targetBookmarkId, this.props.auth, this.props.metaData);
  }

  isCurrentPageBookmarked = () => {
    const currentPageId = this.state.currPageObj.id;
    const targetBookmark = _.find(this.props.bookmarks.data.bookmarkList, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  }

  getPreference = () => {
    const isAnnHide = this.showHighlight;
    const prefData = {
      value: {
        theme: 'White',
        orientation: 'horizontal',
        zoom: this.currZoomLevel,
        isAnnotationHide: isAnnHide,
        enableShowHide: this.state.currPageObj.isCover ? false : this.props.preferences.showAnnotation
      }
    };
    const promiseVal = Promise.resolve(prefData);
    return promiseVal;
  }
/* Method show or hide highlights/notes. */
  showHideHighlights = (prefObject) => {
    if (prefObject.isAnnotationHide === false) {
      try {
        $('.fwr-highlight-annot').css('visibility', 'hidden');
        this.showHighlight = false;
      } catch (e) {
        // error
      }
    } else {
      try {
        $('.fwr-highlight-annot').css('visibility', 'visible');
        this.showHighlight = true;
      } catch (e) {
        // error
      }
    }
  }

/* Method to show or hide hotspots. */
  showHideRegions = () => {
    if(this.showHotspot === true)
    {
      try{
        $(".hotspot").hide();
        $(".hotspotIcon").hide();
        this.showHotspot = false;
      }
      catch(e){}
    }
    else
    {
      try{
        $(".hotspot").show();
        $(".hotspotIcon").show();
        this.showHotspot = true;        
      }
      catch(e) {
        // error
      }
    }
  }


  handleHeaderClick = () => {
    try {
      this.setState({ prefOpen: false });
      this.setState({ searchOpen: false });
    } catch (e) {
      // error
    }
  }

  handleMoreMenuChange = (e) => {
    if (e.target.textContent === 'Print') {
      this.printPage();
    } else if (e.target.textContent === 'Sign Out') {
      this.onSignOutClick();
    } else if (e.target.textContent === 'Hide Links' || e.target.textContent === 'Show Links') {
      this.showHideRegions();
    }
  }
  printPage = () => {
    let date = new Date();
    const currDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    date = new Date(this.props.metaData.expirationDate);
    const expirationDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const userEmailId = this.props.metaData.userEmailId ? this.props.metaData.userEmailId : 'etextqa@pearson.com';
    const copyrightViolationMsg = `Printed by ${this.props.metaData.firstName} ${this.props.metaData.firstName}` +
      ` (${userEmailId}) on ${currDate} autorized to use until ${expirationDate}. 
    Use beyond the authorized user or valid subscription date represents copyright violation.`;
    const printWatermark = pdfConstants.printCopyrightInfo;
    const prtContent = document.getElementById(
      `docViewer_ViewContainer_BG_${WebPDF.ViewerInstance.getCurPageIndex()}`);
    const pageSrc = prtContent.currentSrc;
    const printFrame = document.createElement('iframe');
    printFrame.id = 'printFrame';
    // printFrame.style.display = "none";
    printFrame.style.width = '0px';
    printFrame.style.height = '0px';
    document.body.appendChild(printFrame);
    let frameContentCss = '#watermark{ top:30%; left:2%; position:absolute; transform: rotate(30deg);' +
      'font-size:50px; font-weight:20px; opacity:0.3; display:none;}' +
      '#footer{ bottom:0; position:absolute; display:none; font-size:14px}';
    if (this.props.metaData.bookFeatures.printWithFooter && this.props.metaData.bookFeatures.printWithWatermark) {
      frameContentCss += '@media print { @page { size:auto; page-break-after:avoid; margin:0;}' +
        'img{ max-height: 29cm; max-width: 21cm; margin:0;} #footer{ display:block; } #watermark{ display:block; }}';
    } else if (this.props.metaData.bookFeatures.printWithFooter &&
      !this.props.metaData.bookFeatures.printWithWatermark) {
      frameContentCss += '@media print { @page { size:auto; page-break-after:avoid; margin:0;}' +
        'img{ max-height: 29cm; max-width: 21cm; margin:0;} #footer{ display:block; }}';
    } else if (!this.props.metaData.bookFeatures.printWithFooter &&
      this.props.metaData.bookFeatures.printWithWatermark) {
      frameContentCss += '@media print { @page { size:auto; page-break-after:avoid; margin:0;}' +
        'img{ max-height: 29cm; max-width: 21cm; margin:0;} #watermark{ display:block; }}';
    } else if (!this.props.metaData.bookFeatures.printWithFooter &&
      !this.props.metaData.bookFeatures.printWithWatermark) {
      frameContentCss += '@media print { @page { size:auto; page-break-after:avoid; margin:0;}' +
        'img{ max-height: 29cm; max-width: 21cm; margin:0;}}';
    }
    printFrame.contentWindow.document.open();
    printFrame.contentWindow.document.write(`<style type="text/css">${frameContentCss}</style>`);
    printFrame.contentWindow.document.write(`<div><img src="${pageSrc}" onload="window.print();">` +
      `<div id=watermark>${printWatermark}</div><div id=footer>${copyrightViolationMsg}</div></div>`);
    printFrame.contentWindow.document.close();
    window.onafterprint = () => {
      document.body.removeChild(document.getElementById('printFrame'));
    };
  }

  onSignOutClick = () => {
    sessionStorage.clear();
    const langQuery = localStorage.getItem('bookshelfLang');
    const cookies = new Cookies();
    let i = localStorage.length;
    while (i--) {
      const key = localStorage.key(i);
      if ((key)) {
        localStorage.removeItem(key);
      }
    }
    const storagAarr = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('bookId') === 0) {
        storagAarr.push(localStorage.key(i));
      }
    }
    for (let i = 0; i < storagAarr.length; i++) {
      localStorage.removeItem(storagAarr[i]);
    }
    if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
      piSession.logout();
      localStorage.removeItem('secureToken');
      const redirectCourseUrl = consoleUrl[this.envType];
      piSession.login(redirectCourseUrl);
    } else {
      const parsedQueryStrings = queryString.parse(window.location.search);
      if (langQuery && langQuery !== '?languageid=1') {
        if (parsedQueryStrings.invoketype === 'et1') {
          cookies.remove('ReactPlayerCookie', { path: '/' });
          localStorage.removeItem('secureToken');
          browserHistory.push('/eplayer/');
        } else {
          if (parsedQueryStrings.invoketype === 'pi') {
            try {
              piSession.logout();
            } catch (e) {
              // error
            }
          }
          localStorage.removeItem('secureToken');
          browserHistory.push(`/eplayer/${langQuery}`);
        }
      } else if (parsedQueryStrings.invoketype === 'et1') {
        cookies.remove('ReactPlayerCookie', { path: '/' });
        localStorage.removeItem('secureToken');
        browserHistory.push('/eplayer/');
      } else {
        if (parsedQueryStrings.invoketype === 'pi') {
          try {
            piSession.logout();
          } catch (e) {
            // error
          }
        }
        localStorage.removeItem('secureToken');
        const appPath = window.location.origin;
        const redirectCourseUrl = `${appPath}/eplayer/bookshelf`;
        piSession.login(redirectCourseUrl);
      }
    }
  this.props.logoutUserSession(this.props.metaData, this.props.auth); // eslint-disable-line
  }

  handleBasketGlossaryClick = (glossaryEntryIDsToFetch) => {
    this.setState({drawerOpen : false});
    this.props.glossary.load.get(this.props.metaData, glossaryEntryIDsToFetch).then(() => {
      });
  }

    handleDrawerEntryClick = (requestedEntry) => {
    if(_.isObject(requestedEntry)){
        if(requestedEntry.linkTypeID == pdfConstants.LinkType.PAGE_NUMBER){
          if(requestedEntry.pageorder){
            this.goToPage(requestedEntry.pageorder);
          }else{
            const requestedPage = _.find(this.props.pagePlayList, page => page.pagenumber == requestedEntry.linkValue);
            this.goToPage(requestedPage.id);
          }
        }else if(requestedEntry.linkTypeID == pdfConstants.LinkType.GLOSSARY_TERM){
          this.handleBasketGlossaryClick(requestedEntry.linkValue);
        }else {
          this.setState({drawerOpen : false});
          this.fetchClickedRegionData(requestedEntry);
        }
    }
    else{
      this.goToPage(requestedEntry);
    }
  }

  render() {
    if ($('.backIconBtn') && (this.props.metaData.startPageNo || this.props.metaData.pageIndexTolaunch)) {
      $('.backIconBtn').hide();
    }
    let viewerClassName;
    if (this.state.pageLoaded !== true) {
      viewerClassName = 'hideViewerContent';
    } else {
      viewerClassName = '';
    }
    let notes = [];
    if (this.props.annotations.data.annotationList) {
      notes = this.props.annotations.data.annotationList.map((annot) => {
        const note = Object.assign({}, annot);
        if (note.shared) {
          note.color = 'Instructor';
        } else {
          note.color = note.originalColor;
        }
        return note;
      });
    }
    const moreMenuData = {};
    moreMenuData.menuItem = [];
    const signOutOption = {
      type: 'menuItem',
      value: 'SignOut',
      text: 'Sign Out'
    };
    const printOption = {
      type: 'menuItem',
      value: 'Print',
      text: 'Print'
    };
    let showHideLinksOption = {
      type : 'menuItem',
      value : 'showHideHotspots',
      text : this.showHotspot ? 'Hide Links' : 'Show Links'
    };
    if (this.props.metaData.bookFeatures.hasShowLinksButton)
    {
      moreMenuData.menuItem.push(showHideLinksOption);
      moreMenuData.menuItem.push({ type: 'divider' });     
    }
    if (this.props.metaData.bookFeatures.hasPrintLink && !this.state.currPageObj.printDisabled) {
      moreMenuData.menuItem.push(printOption);
      moreMenuData.menuItem.push({ type: 'divider' });
    }
    moreMenuData.menuItem.push(signOutOption);
    moreMenuData.handleChange = this.handleMoreMenuChange;
    const hideIcons = {
      backNav: !this.props.preferences.showBookshelfBack,
      hamburger: !this.props.preferences.showDrawer,
      bookmark: this.state.currPageObj.isCover ? true : !this.props.preferences.showBookmark,
      pref: false,
      search: false,
      audio: true,
      moreIcon: false
    };
    const headerTitleData = {
      params: {
        pageId: this.state.currPageObj.id ? this.state.currPageObj.id : '1',
        bookId: this.props.metaData.bookId ? this.props.metaData.bookId : '12345'
      },
      classname: 'headerBar',
      chapterTitle: this.props.metaData.title ? this.props.metaData.title : 'Generic Header',
      pageTitle: this.props.metaData.title ? this.props.metaData.title : 'Generic Header',
      isChapterOpener: true
    };

    const bookmarksObj = {
      bookmarksArr: this.props.bookmarks.data.bookmarkList ? this.props.bookmarks.data.bookmarkList : []
    };
    const notesObj = {
      notes
    };
    const bookDetails = {
      author: this.props.metaData.authorName,
      title: this.props.metaData.title
    };
    const pageIdString = this.state.currPageObj.id ? this.state.currPageObj.id.toString() : '0';
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.goToPageCallback = this.handleDrawerEntryClick;

    const dialogActions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleDialogClose}
      />
    ];
    const noAccessDialogText = "This page you have attempted to navigate to is outside of the page range of this eText.";
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
            moreIconData={moreMenuData}
          /> : null}
        {this.props.toc.data.data.fetched && <DrawerComponent
          isDocked={false}
          drawerWidth={400}
          isDraweropen={this.state.drawerOpen}
          hideDrawer={this.hideDrawer}
          bookDetails={bookDetails}
          tocData={this.props.toc.data}
          bookmarkData={bookmarksObj}
          notesData={notesObj}
          currentPageId={pageIdString}
          bookCallbacks={callbacks}
        />}
        <div className="preferences-container-etext">
          {this.state.prefOpen ?
            <div className="content">
              {this.props.parentType === 'eT1' ?
                <PreferencesComponent
                  isET1={'Y'}
                  setCurrentZoomLevel={this.setCurrentZoomLevel}
                  disableBackgroundColor
                  fetch={this.getPreference}
                  preferenceUpdate={this.showHideHighlights}
                  prefKeySelect={this.handlePreferenceKeySelect}
                /> :
                <PreferencesComponent
                  fetch={this.props.getPreference} // eslint-disable-line
                  preferenceUpdate={this.props.updatePreference} // eslint-disable-line
                  disableBackgroundColor={false}
                  locale={this.props.preferences.locale}
                />
            }
            </div> : <div className="empty" />
        }
        </div>

        {!this.state.isFirstPageBeingLoad && this.props.preferences.showFooter ?
          <Navigation
            onPageRequest={this.onPageRequest}
            pagePlayList={this.props.pagePlayList}
            currentPageId={this.state.currPageObj.id}
          /> : null
      }
        {this.state.regionData ?
          <div className='regionContainer'>
            <span id='regionCloseBtn' className='regionCloseBtn' onClick={this.onHotspotCloseButton}>&times;</span>
            <div id="hotspot">{this.renderHotspot(this.state.regionData)}</div>
          </div> : null }
        {this.state.popUpCollection.length ?
          <PopUpInfo bookContainerId={bookContainerId} popUpCollection={this.state.popUpCollection} /> : null }
        <div id="main" className="pdf-fwr-pc-main">
          <div id="right" className="pdf-fwr-pc-right">
            <div id="toolbar" className="pdf-fwr-toolbar" />
            <div id="frame" className={viewerClassName}>
              <div id="docViewer" className="docViewer" />
            </div>
          </div>
        </div>
        <div id="sppModal" className="sppModal">
          <div id="sppModalHeader" className="sppModalHeader" style={{ height: `${60}px` }}>
            <span id="sppCloseBtn" className="sppCloseBtn">&times;</span>
            <p id="sppTitle" />
          </div>
          <div id="sppModalBody" className="sppModalBody" />
        </div>
        <Dialog
          actions={dialogActions}
          modal={false}
          open={this.state.isDialogOpen}
          onRequestClose={this.handleDialogClose}
          contentStyle={{width : '50%'}}
        >
          {noAccessDialogText}
        </Dialog>
        {this.state.pageLoaded !== true ?
          <div className="centerCircularBar">
            <RefreshIndicator size={50} left={0.48 * $(window).width()} top={200} status="loading" />
          </div> : null}
      </div>
    );
  }
}

const PROVIDER = PropTypes.shape({
  get: PropTypes.func.isRequired
});

const CLIENT = PropTypes.shape({
  put: PropTypes.func.isRequired,
  post: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
});

PdfPlayer.propTypes = {
  /**
  * pagePlayList is array which contains complete page list for a book
  */
  pagePlayList: PropTypes.array.isRequired,
  /**
  * annotations is object which has load,data & operation object fields
  * load is the PROVIDER object type which holds get method to load the annotations to data field
  * data is the object which holds annotations list and it's status
  * operation is the CLIENT object type which holds put,post,delete methods for annotations CRUD operations
  */
  annotations: PropTypes.shape({
    load: PROVIDER.isRequired,
    data: PropTypes.object.isRequired,
    operation: CLIENT.isRequired
  }),
  /**
  * bookmarks is object which has load,data & operation object fields
  * load is the PROVIDER object type which holds get method to load the bookmarks to data field
  * data is the object which holds bookmarks list and it's status
  * operation is the CLIENT object type which holds put,post,delete methods for bookmarks CRUD operations
  */
  bookmarks: PropTypes.shape({
    load: PROVIDER.isRequired,
    data: PropTypes.object.isRequired,
    operation: CLIENT.isRequired
  }),
  /**
  * hotspots is object which has load,data object fields
  * load is the PROVIDER object type which holds get method to load the hotspots to data field
  * data is the object which holds hotspots list and it's status
  */
  hotspots: PropTypes.shape({
    load: PROVIDER.isRequired,
    data: PropTypes.object.isRequired
  }),
  /**
  * toc is object which has load,data object fields
  * load is the PROVIDER object type which holds get method to load the toc to data field
  * data is the object which holds toc data and it's status
  */
  toc: PropTypes.shape({
    load: PROVIDER.isRequired,
    data: PropTypes.object.isRequired
  }),
  /**
  * metaData is plain object which contains book meta data.
  * It will be passed back to all callback methods from consumer component of this PdfPlayer component
  */
  metaData: PropTypes.object.isRequired,
  /**
  * bookCallbacks is object which contains callback methods from consumer component of this PdfPlayer component
  */
  bookCallbacks: PropTypes.object,
  /**
  * search is object which has load object field
  * load is the PROVIDER object type which holds get method to load the search results
  */
  search: PropTypes.shape({
    load: PROVIDER.isRequired
  }),
  /**
  * parentType is string value which holds parent type value. For ex: parentType is 'eT1' for eText 1 team
  */
  parentType: PropTypes.string.isRequired,
  /**
  * basepaths is object which has load,data object fields
  * load is the PROVIDER object type which holds get method to load base paths to data field
  * data is the object which holds basepaths and it's status
  */
  basepaths: PropTypes.shape({
    load: PROVIDER.isRequired,
    data: PropTypes.object.isRequired
  }),
  /**
  * glossary is object which has load,data object fields
  * load is the PROVIDER object type which holds get method to load glossary information to data field
  * data is the object which holds glossary information and it's status
  */
  glossary: PropTypes.shape({
    load: PROVIDER.isRequired,
    data: PropTypes.array.isRequired
  }),
  /**
  * preferences is object which holds preference details for book.
  */
  preferences: PropTypes.object.isRequired,
  /**
  * auth is object which holds user specific authentication data
  */
  auth: PropTypes.shape({
    userid: PropTypes.number.isRequired,
    sessionId: PropTypes.string, // eslint-disable-line
    piToken: PropTypes.string.isRequired // eslint-disable-line
  }).isRequired,
  /**
  * envType indicates environment type which holds either prod or nonprod
  */
  envType: PropTypes.string,
  /**
  * logoutUserSession is a function to delete the active user session on logout
  */
  logoutUserSession: PropTypes.func.isRequired
};

PdfPlayer.defaultProps = {
  pagePlayList: [],
  metaData: {},
  preferences: {},
  auth: {},
  envType: 'nonprod',
  bookCallbacks: {}
};
export default PdfPlayer;
