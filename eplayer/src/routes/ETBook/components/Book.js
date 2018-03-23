/** *****************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *
 *  *  Copyright ? 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  *
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
/* eslint-disable */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { pageDetails, customAttributes, pageLoadData, pageUnLoadData, mathJaxVersions, mathJaxCdnVersions } from '../../../../const/Mockdata';
import './Book.scss';
import { browserHistory } from 'react-router';
import { getTotalAnnCallService, getAnnCallService, postAnnCallService, putAnnCallService, deleteAnnCallService, getTotalAnnotationData, deleteAnnotationData, annStructureChange } from '../../../actions/annotation';
import { getBookPlayListCallService, getPlaylistCallService, getBookTocCallService, getCourseCallService, putCustomTocCallService, gotCustomPlaylistCompleteDetails, tocFlag, getAuthToken, getParameterByName, getCourseCallServiceForRedirect, updateProdType } from '../../../actions/playlist';
import { getGotoPageCall } from '../../../actions/gotopage';
import { getPreferenceCallService, postPreferenceCallService } from '../../../actions/preference';
import { loadPageEvent, unLoadPageEvent } from '../../../api/loadunloadApi';

import { getBookmarkCallService, postBookmarkCallService, deleteBookmarkCallService, getTotalBookmarkCallService } from '../../../actions/bookmark';
import { DrawerComponent } from '@pearson-incubator/vega-drawer';
import { VegaViewPager } from '@pearson-incubator/vega-viewer';
import { Navigation } from '@pearson-incubator/aquila-js-core';
import { LearningContextProvider } from '@pearson-incubator/vega-viewer';
import axios from 'axios';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import { resources, domain, typeConstants } from '../../../../const/Settings';
import Search from '../../../components/search/containers/searchContainer';
import Utils from '../../../components/utils';
import { StaticAlert } from 'pearson-compounds';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const queryString = require('query-string');

export class Book extends Component {
  constructor(props) {
    super(props);
    let redirectCourseUrl = window.location.href;
    redirectCourseUrl = decodeURIComponent(redirectCourseUrl).replace(/\s/g, "+").replace(/%20/g, "+");
    piSession.getToken(function (result, userToken) {
      if (!userToken) {
        if (window.location.pathname.indexOf('/eplayer/ETbook/') > -1) {
          browserHistory.push('/eplayer/pilogin');
        } else if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
          piSession.login(redirectCourseUrl, 10);
        }
      }
    });
    this.environmentCode = '';
    this.personRoleCode = '';
    this.isTOCUpdated = false;
    this.state = {
      classname: 'headerBar visible',
      viewerContent: true,
      drawerOpen: false,
      showViewer: false,
      currentPageDetails: '',
      pageDetails,
      currentPageTitle: '',
      popUpCollection: '',
      urlParams: {
        context: this.props.params.bookId,
        user: ''
      },
      annAttributes: customAttributes,
      goToTextVal: '',
      isPanelOpen: false,
      asynCallLoaded: false,
      pageLoadData,
      pageUnLoadData,
      userAgent: navigator.userAgent,
      nextPageId: '',
      timeOnTaskUuid: '',
      contentId: '',
      sectionId: '',
      courseId: '',
      piToken: localStorage.getItem('secureToken'),
      pageLoad: false,
      currentPageId: '',
      operatingSystemCode: navigator.platform,
      organizationId: '',
      prefOpen: false,
      searchOpen: false,
      headerExists: false,
      alertOpen:false,
      idc:false,
      publishedToc:false,
      rederPage : true,
      headerDataloaded: false
    };
    this.divGlossaryRef = '';
    this.wrapper = '';
    this.courseBook = false,
      this.annHeaders = {},
      this.nodesToUnMount = [];
    this.bookIndexId = {};
    this.searchUrl = '';
    this.isAnnotationHide = false;
    this.productType = '';
    this.userType = '';
    this.productModel= '';
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);
    this.state.pageDetails.currentPageURL = '';
    if (piSession) {
      const userId = piSession.userId();
      // const queryParams = this.props.location.query;
      const annotationId = queryString.parse(this.props.location.search).annotationId;
      console.log('annotationId: ', annotationId);
      this.state.urlParams.user = userId;
      if (annotationId !== undefined || annotationId !== '') {
        this.state.pageDetails.annId = annotationId;
      }
    }
    this.closeHeaderPopups = this.closeHeaderPopups.bind(this);
    window.isDisableAnnotation = resources.constants.isDisableAnnotation;
    window.iseUrl = resources.links.iseUrl[domain.getEnvType()]+'/courses/'+ this.props.params.bookId +'/notes';
  }
  componentWillMount = () => {
    let isSessionLoaded = false;
    let isAuthToken = false;
    let self = this;
    const IntervalCheck = setInterval(() => {
      // deeper code
      if (!isSessionLoaded) {
        let redirectCourseUrl = window.location.href;
        redirectCourseUrl = decodeURIComponent(redirectCourseUrl).replace(/\s/g, "+").replace(/%20/g, "+");
        if (piSession) {
          isSessionLoaded = true;
           const useridIntervalCheck = setInterval(() => {
            if(!piSession.userId())
            {
              self.state.urlParams.user = piSession.userId();
              clearInterval(useridIntervalCheck);
            }            
          });
          if(piSession.currentToken() !== undefined && piSession.currentToken() !== null)
          {
              localStorage.setItem('secureToken',  piSession.currentToken());
          }
          piSession.getToken(function (result, userToken) {
            if (result === piSession['Success']) {
              localStorage.setItem('secureToken', userToken);
              if (!isAuthToken && !Utils.checkCookie('etext-cdn-token')) {
                isAuthToken = true;
                self.props.dispatch(getAuthToken(userToken));
              }
              self.state.urlParams.user = piSession.userId();
              clearInterval(IntervalCheck);
            }
          });
        }
         
        const getSecureToken = localStorage.getItem('secureToken');
        if (!isAuthToken && !Utils.checkCookie('etext-cdn-token')) {
          self.props.dispatch(getAuthToken(getSecureToken));
          isAuthToken = true;
        }
        this.bookDetailsData = {
          context: this.state.urlParams.context,
          piToken: getSecureToken,
          bookId: this.props.params.bookId,
          pageId: this.props.params.pageId ? this.props.params.pageId :''
        }
        if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
          this.bookDetailsData.courseId = this.props.params.bookId;
            this.courseBook = true;
            const url = window.location.href;
            const n = url.search('prdType');
            let prdType = '';
            let iseSource = '';
            const checkSource = url.search('Source=');
            if (n > 0) {
              const urlSplit = url.split('prdType=');
              prdType = getParameterByName('prdType');
              console.log("prdType", prdType);
              this.bookDetailsData.prdType = prdType;
              this.props.dispatch(updateProdType(prdType));
            }
            if (checkSource > 0){
              const getIseSource = getParameterByName('Source');
              this.bookDetailsData.prdType = getIseSource;
              iseSource = true;
              this.props.dispatch(updateProdType(getIseSource));
            }
            if (!prdType && !iseSource) {
              localStorage.setItem('backUrl', '');
            }
            let checkReturnUrl = url.search('returnurl=');
            if (checkReturnUrl === -1) {
              checkReturnUrl = url.search('returnUrl=');
            }
            if(  ((resources.constants.idcDashboardEnabled && !prdType && !iseSource && (checkReturnUrl > 0)) || ( resources.constants.iseEnabled && !iseSource && !prdType && (checkReturnUrl > 0))) ) {
              this.props.dispatch(getCourseCallServiceForRedirect(this.bookDetailsData));
            }
            else{ this.props.dispatch(getCourseCallService(this.bookDetailsData)); }

          } else {
          this.props.dispatch(getBookPlayListCallService(this.bookDetailsData));
        }
      }
      
    }, 200)
  }
  componentWillUnmount() {
    WidgetManager.navChanged(this.nodesToUnMount);
    this.props.dispatch({ type: "CLEAR_PLAYLIST" });
    this.props.dispatch({ type: "CLEAR_ANNOTATIONS" });
    this.props.dispatch({ type: "CLEAR_BOOKMARKS" });
    this.props.dispatch({ type: "CLEAR_SEARCH" });
    //PLA pageunload Event
    if (this.props.bookdetailsdata && this.props.bookdetailsdata.userCourseSectionDetail && (this.props.bookdetailsdata.userCourseSectionDetail !== undefined)) {
      const unloadPageNxtpageId = this.getNxtPageId(this.state.currentPageId);
      this.mapUnloadData(this.state.currentPageId, unloadPageNxtpageId, '', '', false);
    }
    delete this.state.pageDetails.searchText;
    this.setState({ pageDetails: this.state.pageDetails, asynCallLoaded: false });
  }
  parseDom = () => {
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  };
  componentWillReceiveProps(nextProps) {
    const playlistData = nextProps.playlistData;
    window.playlistData = playlistData;
    if(nextProps.tocData && nextProps.tocData.content) {
      window.tocData = nextProps.tocData.content;
    }
    const pageParameters = this.state.pageDetails;
    if (nextProps.playlistReceived) {
      let filteredData = find(playlistData.content, list => list.id === nextProps.params.pageId);
      pageParameters.baseUrl = playlistData.baseUrl;
      if (pageParameters.currentPageURL === "") {
        pageParameters.currentPageURL = (playlistData.content[0].chapterHeading) ? playlistData.content[1] : playlistData.content[0];
      }
      pageParameters.playListURL = playlistData.content;
      if (nextProps.params.pageId && filteredData) {
        if(!filteredData.chapterHeading){
          pageParameters.currentPageURL = filteredData;
        }else{
          const chapterIndex = playlistData.content.findIndex((ele)=>ele.id === filteredData.id);
          filteredData=playlistData.content[chapterIndex+1];
          pageParameters.currentPageURL = filteredData;
        }
      }

    }
    if (nextProps.customTocPlaylistReceived) {
      pageParameters.currentPageURL = (playlistData.content[0].chapterHeading) ? playlistData.content[1] : playlistData.content[0];
      this.onNavChange(pageParameters.currentPageURL);
    }
    if (typeof nextProps.bookdetailsdata === "object" && nextProps.bookdetailsdata && nextProps.bookdetailsdata.bookDetail && nextProps.bookdetailsdata.bookDetail.metadata && nextProps.bookdetailsdata.bookDetail.metadata.indexId) {
      this.bookIndexId = nextProps.bookdetailsdata.bookDetail.metadata.indexId;
      this.searchUrl = resources.links.etextSearchUrl[domain.getEnvType()] + '/search?indexId=' + this.bookIndexId + '&q=searchText&s=0&n=' + resources.constants.TextSearchLimit;
    } else if (typeof nextProps.bookdetailsdata === "object" && nextProps.bookdetailsdata && nextProps.bookdetailsdata.userCourseSectionDetail && nextProps.bookdetailsdata.userCourseSectionDetail.indexId) {
      this.bookIndexId = nextProps.bookdetailsdata.userCourseSectionDetail.indexId;
      this.searchUrl = resources.links.etextSearchUrl[domain.getEnvType()] + '/search?indexId=' + this.bookIndexId + '&q=searchText&s=0&n=' + resources.constants.TextSearchLimit;
    }
    window.localStorage.setItem('searchIndexId', this.bookIndexId);
    if (nextProps.isGoToPageRecived) {
      if (nextProps.gotoPageObj.page && nextProps.gotoPageObj.page.href) {
        const goToHref = nextProps.gotoPageObj.page.href.split('#')[0];
        let gotoPageData = '';
        const playpageDetails1 = this.state.pageDetails;
        const currentData = find(pageParameters.playListURL, list => {
          if (list.href && list.href.match(goToHref)) {
            gotoPageData = list;
            gotoPageData.pageFragmentId = nextProps.gotoPageObj.page.href.split('#')[1];
          }
        });
        playpageDetails1.currentPageURL = gotoPageData;
        playpageDetails1.tocUpdated = true;
        this.onPageChange("pagescroll", nextProps.gotoPageObj.page.title);
        if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
          if(this.props.prodType === 'idc'){
            this.productType = 'prdType';
          }
          else{
            this.productType = 'Source';
          }
          let url = `/eplayer/Course/${this.props.params.bookId}/page/${gotoPageData.id}`;
          url+=this.props.prodType?'?'+this.productType+'='+this.props.prodType+'&':'?';
          browserHistory.replace(url+'launchLocale=' + window.annotationLocale);
        } else {
          browserHistory.replace('/eplayer/ETbook/${this.props.params.bookId}/page/${gotoPageData.id}?launchLocale=' + window.annotationLocale);
        }
        this.props.dispatch({
          type: "GOT_GOTOPAGE",
          data: [],
          isGoToPageRecived: false
        });
      }
    }
    //this.props.dispatch(gotCustomPlaylistCompleteDetails());
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   // console.log('shouldComponentUpdate');
  //   if(this.resetToc){
  //     this.resetToc=false;
  //     return false;
  //   }
  //   return true;
  // }


  navChanged = () => {
    WidgetManager.navChanged(this.nodesToUnMount);
    this.nodesToUnMount = [];
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  }

  removeAnnotationHandler = (annotationId) => {
    let deleteAnnData = $.extend(this.state.urlParams, { annId: annotationId });
    deleteAnnData.annHeaders = this.annHeaders;
    deleteAnnData.body = { ids: [annotationId] };
    this.props.dispatch(deleteAnnCallService(deleteAnnData));

    let annElement = $('#contentIframe').contents().find('*[data-ann-id=' + annotationId + ']');
    const currentPageAnnLength = annElement.length;
    if (currentPageAnnLength > 0) {
      $('#contentIframe').contents().find('*[data-ann-id=' + annotationId + ']').removeAttr('style');
      const handleAnn = $('#contentIframe').contents().find('*[data-ann-id=' + annotationId + ']').find('.annotator-handle');
      if (handleAnn.length > 0) {
        handleAnn.remove();
      }
    }
    const deletedAnnotationData = find(this.props.book.annTotalData, note => note.id === annotationId);
    let sectionInfo = {};
    let chapterInfo = {};
    let sectionTitle = {};
    this.props.tocData.content.list.forEach((chapter, i)=>{
    //  sectionInfo = find(this.state.pageDetails.playListURL, list => list.id === deletedAnnotationData.pageId);
      sectionInfo = find(this.props.tocData.content.list[i].children, list => list.id === deletedAnnotationData.pageId);
      if(sectionInfo) {
        chapterInfo = chapter;
        sectionTitle = sectionInfo;
      }
    })
    let dataLayerObj = {
      'eventAction': 'Removing Notes',
      'event': 'annotationDelete',
      'eventCategory': 'Notes',
      'selectedText': deletedAnnotationData.text,
      'text': deletedAnnotationData.comment,
      'chapterTitle': chapterInfo.title,
      'sectionTitle': sectionTitle.title
    }
    dataLayer.push(dataLayerObj);
     
  };

  addBookmarkHandler = () => {
    const bMarkData = this.state;
    const bookmark = {
      uri: bMarkData.currentPageDetails.uri,
      id: bMarkData.urlParams.id,
      data: {
        baseUrl: bMarkData.pageDetails.baseUrl
      },
      title: bMarkData.currentPageTitle,
      labels: [bMarkData.currentPageTitle],
      context: bMarkData.urlParams.context,
      user: bMarkData.urlParams.user,
      productModel: this.productModel,
      userType: this.userType == 'instructor' ? 'Instructor' : 'Student',
      xAuth: localStorage.getItem('secureToken')
    };
    this.props.dispatch(postBookmarkCallService(bookmark));
  };

  removeBookmarkHandler = (bookmarkId) => {
    let id = (bookmarkId ? bookmarkId : this.props.bookmarkedData.bookmarkId);
    this.forceUpdate();
    let bookmarksParams = this.state.urlParams;
    bookmarksParams.currentPageId=this.props.params.pageId
    bookmarksParams.xAuth = localStorage.getItem('secureToken');
    bookmarksParams.body = { ids: [id] };
    this.props.dispatch(deleteBookmarkCallService(bookmarksParams));

    const deletedBookmarkData = find(this.props.book.bookmarks, bookmark => bookmark.id === bookmarkId);
    let sectionInfo = {};
    let chapterInfo = {};
    let sectionTitle = {};
    
    this.props.tocData.content.list.forEach((chapter, i)=>{
      sectionInfo = find(this.props.tocData.content.list[i].children, list => list.id === deletedBookmarkData.source.id);
     // sectionInfo = find(this.state.pageDetails.playListURL, list => list.id === deletedBookmarkData.source.id);
     
        if(sectionInfo) {
          chapterInfo = chapter;
          sectionTitle = sectionInfo;         
        }
        
    } )
  
    
    let dataLayerObj = {
      'eventAction': 'Deleting BookMark',
      'event': 'bookmarkDelete',
      'eventCategory': 'Bookmarks',
      'chapterTitle': chapterInfo.title,
      'sectionTitle': sectionTitle.title
    }
    dataLayer.push(dataLayerObj);
    

  };

  onNavChange = (data) => {
    let pageDetails = this.state.pageDetails;
    pageDetails.searchText = [];
    document.title = data.title;
    const parameters = this.state.urlParams;
    parameters.id = data.id,
      parameters.uri = encodeURIComponent(data.href),
      data.uri = data.href;
    data.label = data.title;
    pageDetails = { ...pageDetails };
    this.setState({
      currentPageDetails: data,
      currentPageTitle: data.title,
      urlParams: parameters,
      pageDetails: pageDetails
    }, function () {
      // eslint-disable-next-line
      if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
        if(this.props.prodType === 'idc'){
          this.productType = 'prdType';
        }
        else{
          this.productType = 'Source';
        }
        let url = `/eplayer/Course/${this.props.params.bookId}/page/${data.id}`;
        url+=this.props.prodType?'?'+this.productType+'='+this.props.prodType+'&':'?';
        browserHistory.replace(url+`launchLocale=` + window.annotationLocale);
      } else {
        browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${data.id}?launchLocale=` + window.annotationLocale);
      }
      let bookmarksParams = this.state.urlParams;
      bookmarksParams.xAuth = localStorage.getItem('secureToken');
      this.props.dispatch(getBookmarkCallService(bookmarksParams));
      // this.props.dispatch(getAnnCallService(this.state.urlParams));
    });
    this.state.headerDataloaded = true;
    this.props.dispatch(gotCustomPlaylistCompleteDetails());
  };

  onPageChange = (type, data) => {
    switch (type) {
      case 'continue':
        {
          if (data) {
            document.title = data.title;
            this.setState({ isPanelOpen: true }, () => {
              const pageDetails = { ...this.state.pageDetails };
              pageDetails.currentPageURL = data;
              this.props.dispatch({
                type: 'CREATE_MULTIPANEL_BOOTSTRAP_PARAMS',
                data: { pageDetails: pageDetails, urlParams: this.state.urlParams }
              });
              browserHistory.replace(`/eplayer/MultiTaskPanel`);
              // window.open(`/eplayer/MultiTaskPanel`, 'panel');
              // window.open(`http://localhost:3000/eplayer/ETbook/1Q98UHDD1E1/page/${data.id}`,'panel');
            });
          }
          break;
        }
      case typeConstants.ANNOTATION_CREATED:
        {
          let annList = annStructureChange([data.rows[0]]);
          this.props.dispatch(getTotalAnnotationData(annList));
          break;
        }
      case typeConstants.ANNOTATION_UPDATED:
        {
          let annList = annStructureChange([data.rows[0]]);
          this.props.dispatch(deleteAnnotationData(data.rows[0]));
          this.props.dispatch(getTotalAnnotationData(annList));
          break;
        }
      case typeConstants.ANNOTATION_DELETED:
        { 
          this.props.dispatch(deleteAnnotationData(data.rows));
          break;
        }
      case 'pagescroll':
        $("#pageNum").val(data);
        break;
      default:
        {
          // other than continue
          if (data) {
            this.onNavChange(data);
          }
          break;
        }
    }
  }

  mapLoadData = (cu, nx) => {
    const timeOnTaskUuid = this.getGUID();
    this.setState({
      nextPageId: nx,
      timeOnTaskUuid: this.getGUID(),
      contentId: cu,
      sectionId: this.props.bookdetailsdata.userCourseSectionDetail.section.sectionId,
      courseId: this.props.bookdetailsdata.userCourseSectionDetail.section.courseId,
      organizationId: this.props.bookdetailsdata.userCourseSectionDetail.section.extras.organizationId
    }, function () {
      this.setState({ pageLoad: true });
      this.setState({ currentPageId: cu });
      let updatedPageLoadData = this.state.pageLoadData;
      const messageId = this.getGUID();
      const transactionDt = new Date().toISOString();
      updatedPageLoadData.activities[0].payload.personId = this.state.urlParams.user;
      updatedPageLoadData.activities[0].payload.courseId = this.state.courseId;
      updatedPageLoadData.activities[0].payload.courseSectionId = this.state.sectionId;
      updatedPageLoadData.activities[0].payload.contentId = this.state.contentId;
      updatedPageLoadData.activities[0].payload.messageId = messageId;
      updatedPageLoadData.activities[0].payload.timeOnTaskUuid = this.state.timeOnTaskUuid;
      updatedPageLoadData.activities[0].payload.transactionDt = transactionDt;
      updatedPageLoadData.activities[0].payload.loadDt = transactionDt;
      updatedPageLoadData.activities[0].payload.userAgent = this.state.userAgent;
      updatedPageLoadData.activities[0].payload.operatingSystemCode = this.state.operatingSystemCode;
      updatedPageLoadData.activities[0].payload.organizationId = this.state.organizationId;
      updatedPageLoadData.activities[0].payload.environmentCode = this.environmentCode;
      updatedPageLoadData.activities[0].payload.personRoleCode = this.personRoleCode;
      const getSecureToken = localStorage.getItem('secureToken');
      loadPageEvent(getSecureToken, updatedPageLoadData);

    });
  }

  mapUnloadData = (cu, nx, loadPageid, loadNxtPageId, loadFunCall) => {
    let updatedPageUnLoadData = this.state.pageUnLoadData;
    if (this.state.pageLoadData.activities[0].payload.timeOnTaskUuid === this.state.timeOnTaskUuid) {
      updatedPageUnLoadData.activities[0].payload.timeOnTaskUuid = this.state.pageLoadData.activities[0].payload.timeOnTaskUuid;
      updatedPageUnLoadData.activities[0].payload.loadDt = this.state.pageLoadData.activities[0].payload.loadDt;
    }

    this.setState({
      nextPageId: nx,
      contentId: cu,
      sectionId: this.props.bookdetailsdata.userCourseSectionDetail.section.sectionId,
      courseId: this.props.bookdetailsdata.userCourseSectionDetail.section.courseId,
      organizationId: this.props.bookdetailsdata.userCourseSectionDetail.section.extras.organizationId
    }, function () {
      this.setState({ currentPageId: cu });

      const messageId = this.getGUID();
      const transactionDt = new Date().toISOString();
      updatedPageUnLoadData.activities[0].payload.personId = this.state.urlParams.user;
      updatedPageUnLoadData.activities[0].payload.courseId = this.state.courseId;
      updatedPageUnLoadData.activities[0].payload.courseSectionId = this.state.sectionId;
      updatedPageUnLoadData.activities[0].payload.contentId = this.state.contentId;
      updatedPageUnLoadData.activities[0].payload.messageId = messageId;
      updatedPageUnLoadData.activities[0].payload.transactionDt = transactionDt;
      updatedPageUnLoadData.activities[0].payload.unloadDt = transactionDt;
      updatedPageUnLoadData.activities[0].payload.userAgent = this.state.userAgent;
      updatedPageUnLoadData.activities[0].payload.operatingSystemCode = this.state.operatingSystemCode;
      updatedPageUnLoadData.activities[0].payload.organizationId = this.state.organizationId;
      updatedPageUnLoadData.activities[0].payload.environmentCode = this.environmentCode;
      updatedPageUnLoadData.activities[0].payload.personRoleCode = this.personRoleCode;
      const getSecureToken = localStorage.getItem('secureToken');
      unLoadPageEvent(getSecureToken, updatedPageUnLoadData);
      if (loadFunCall) {
        this.mapLoadData(loadPageid, loadNxtPageId);
      }

    });
  }

  getNxtPageId = (getid) => {
    const playlistLength = this.props.playlistData.content.length;
    const playlist = this.props.playlistData.content;
    for (let i = 0; i < playlistLength; i++) {
      if (playlist[i].id === getid) {
        const nextpageId = playlist[i + 1] ? playlist[i + 1].id : playlist[i].id;
        return nextpageId;
      }
    }
  }

  getGUID = () => {
    this.getId = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return this.getId() + this.getId() + '-' + this.getId() + '-' + this.getId() + '-' +
      this.getId() + '-' + this.getId() + this.getId() + this.getId();
  }

  isCurrentPageBookmarked = () => {
    return this.props.bookmarkedData.isBookmarked;
  };

  goToTextChange = (goToTextChangeCallBack) => {
    // this.setState({ goToTextVal: e.target.value });
  }

  goToPageClick = (getPageNumber) => {

    if (getPageNumber) {
      const bookId = this.props.params.bookId;
      const userId = this.state.urlParams.user
      const goToPageObj = {
        context: bookId,
        user: userId,
        pagenumber: getPageNumber,
        baseurl: this.state.pageDetails.baseUrl
      }
      this.props.dispatch(getGotoPageCall(goToPageObj));
    }
  }

  viewerContentCallBack = (viewerCallBack) => {
    this.setState({ viewerContent: viewerCallBack });
    if (viewerCallBack == false) {
      this.setState({ drawerOpen: true }, function () {
        if (!this.state.asynCallLoaded) {
          let params = this.state.urlParams;
          params.xAuth = localStorage.getItem('secureToken');
          // this.props.dispatch(getBookTocCallService());
          this.props.dispatch(getTotalBookmarkCallService(this.state.urlParams));
          params.annHeaders = this.annHeaders;
          this.props.dispatch(getTotalAnnCallService(params));
          this.state.asynCallLoaded = true;
        }
      });
    } else {
      this.setState({ drawerOpen: false });
    }
  }
  goToPageCallback = (pageId, annId, searchText) => {
    let id = pageId;
    let currentData = find(this.state.pageDetails.playListURL, list => list.id === pageId);
    if (currentData === undefined && pageId.indexOf('-') > -1) {
      id = pageId.substring(0, pageId.indexOf('-'))
      currentData = find(this.state.pageDetails.playListURL, list => list.id === id);
    }
    currentData.uri = currentData.href;
    currentData.label = currentData.title;
    document.title = currentData.title;
    const playpageDetails = this.state.pageDetails;
    playpageDetails.currentPageURL = currentData;
    if (searchText) {
      playpageDetails.searchText = searchText;
    } else if (annId) {
      playpageDetails.annId = annId;
    }
    const parameters = this.state.urlParams;
    parameters.id = currentData.id,
      parameters.uri = encodeURIComponent(currentData.href),
      this.setState({
        currentPageDetails: currentData,
        currentPageTitle: currentData.title,
        urlParams: parameters,
        pageDetails: playpageDetails,
        drawerOpen: false
      }, () => {
        if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
          if(this.props.prodType === 'idc'){
            this.productType = 'prdType';
          }
          else{
            this.productType = 'Source';
          }
          let url = `/eplayer/Course/${this.props.params.bookId}/page/${id}`;
          url+=this.props.prodType?'?'+this.productType+'='+this.props.prodType+'&':'?';
          browserHistory.replace(url+`launchLocale=` + window.annotationLocale);
        } else {
          browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${id}?launchLocale=` + window.annotationLocale);
        }
        let bookmarksParams = this.state.urlParams;
        bookmarksParams.xAuth = localStorage.getItem('secureToken');
        this.props.dispatch(getBookmarkCallService(bookmarksParams));
      }),
      this.viewerContentCallBack(true);
    if (annId) {
      let annElement = $('#contentIframe').contents().find('span[data-ann-id=' + annId + ']');
      if (annElement && annElement[0]) {
        $('html, body').animate({
          scrollTop: annElement[0].getBoundingClientRect().top - 60
        });
      }
    }
  };
  printFun = () => {
    const url = this.state.pageDetails.baseUrl + this.state.pageDetails.currentPageURL.href;
    window.open(`/eplayer/Print?${url}`, 'PrintPage', 'scrollbars=yes,toolbar=no,location=no,status=no,titlebar=no,toolbar=no,menubar=no, resizable=no,dependent=no');
  }
  onBookLoaded = (bload) => {
    if (bload) {
      const that = this;
      window.renderPopUp = function (collection) {
        that.setState({ popUpCollection: collection });
      }
      this.setState({ popUpCollection: [] });
      this.wrapper = new Wrapper({ 'divGlossaryRef': this.divGlossaryRef, 'bookDiv': 'book-container' });
      this.wrapper.bindPopUpCallBacks();

    }
  }

  preferenceUpdate = (pref) => {
    if (typeof (Storage) !== "undefined") {
      if (localStorage.getItem('bookId' + this.props.params.bookId)) {
        this.updatePreference(pref);
      } else {
        localStorage.setItem('bookId' + this.props.params.bookId, (pref.fontSize + "/" + pref.theme));
        this.updatePreference(pref);
      }
    }
  }

  getPreference = () => {
    let getPreferenceDetails = this.props.getPreferenceData;
    const prefTheme = (getPreferenceDetails.theme) ? getPreferenceDetails.theme : 'White', prefFont = (getPreferenceDetails.fontSize) ? getPreferenceDetails.fontSize : '56';
    let isAnnHide = true;
    if (getPreferenceDetails.isAnnotationHide) {
      isAnnHide = (getPreferenceDetails.isAnnotationHide == 'true') ? true : false
    }
    const prefData = {
      'value': {
        theme: prefTheme,
        fontSize: prefFont,
        orientation: 'horizontal',
        zoom: '0',
        isAnnotationHide: isAnnHide,
        enableShowHide: true
      }
    };
    const promiseVal = Promise.resolve(prefData);
    return promiseVal;
  }

  updatePreference = (pref) => {
    let pageDetails = this.state.pageDetails;
    const annHide = pref.isAnnotationHide ? true : false;
    const getStorageObj = {
      fontSize: pref.fontSize,
      theme: pref.theme,
      isAnnotationHide: annHide
    }
    const postPreferenceData = {
      userId: this.state.urlParams.user,
      bookId: this.state.urlParams.context,
      piToken: localStorage.getItem('secureToken'),
      preferenceObj: getStorageObj
    }
    this.props.dispatch(postPreferenceCallService(postPreferenceData));
    pageDetails.pageFontSize = pref.fontSize;
    pageDetails.bgColor = pref.theme;
    pageDetails.isAnnotationHide = annHide;
    this.setState({ pageDetails: pageDetails });
    if(this.isAnnotationHide !== pref.isAnnotationHide) {
      this.isAnnotationHide = pref.isAnnotationHide;
       dataLayer.push({   
       'event':'highlightVisibilityChange',
       'hightlightVisibility':pref.isAnnotationHide
      });
  }
  }

  goToPage = (pageId) => {
    let bookObj = {};
    this.state.pageDetails.playListURL.forEach((data) => {
      if (data.href && data.href.match(pageId.split("OPS")[1].split('*')[0])) {
        bookObj = data;
      }
    });
    this.goToPageCallback(bookObj.id, '', pageId.split("OPS")[1].split('*')[1].split(','))
  }

  listClick = () => {
    console.log("....** listClick function...")
  }

  onPageRequest = (page) => {
    const pageDetails = { ...this.state.pageDetails };
    pageDetails.annId = null;
    this.setState({
      pageDetails
    });
    if (pageDetails.searchText && pageDetails.searchText.length) {
      pageDetails.searchText = [];
      this.setState({ pageDetails });
    }
    this.onNavChange(page);
  };
  onPageLoad = (pageObj) => {
    const currentPage = find(this.state.pageDetails.playListURL, page => page.id === pageObj.id);
    if (currentPage) {
      this.onNavChange(currentPage);
      if (this.props.bookdetailsdata.userCourseSectionDetail !== undefined) {
        const envCode = {
          local: "DEV",
          dev: "QA",
          qa: "QA",
          stage: "STG",
          prod: "PRD"
        }
        this.environmentCode = envCode[domain.getEnvType()];
        let getAuthType = this.props.bookdetailsdata.userCourseSectionDetail.authgrouptype;
        this.personRoleCode = getAuthType.charAt(0).toUpperCase() + getAuthType.slice(1);
        let getnextPageId = '';
        if (!this.state.pageLoad) {
          getnextPageId = this.getNxtPageId(this.state.urlParams.id);
          this.mapLoadData(this.state.urlParams.id, getnextPageId);
        } else {
          getnextPageId = this.getNxtPageId(this.state.currentPageId);
          this.mapUnloadData(this.state.currentPageId, getnextPageId, this.state.urlParams.id, this.getNxtPageId(this.state.urlParams.id), true);
        }
      }
    }
    let getPreferenceDetails = this.props.getPreferenceData;
    const prefTheme = getPreferenceDetails.theme, prefFont = getPreferenceDetails.fontSize;
    let isAnnHide = true;
    if (getPreferenceDetails.isAnnotationHide) {
      isAnnHide = (getPreferenceDetails.isAnnotationHide == 'true') ? true : false
    }
    let pageDetails = this.state.pageDetails;
    pageDetails.pageFontSize = prefFont ? prefFont : pageDetails.pageFontSize;
    pageDetails.bgColor = prefTheme ? prefTheme : pageDetails.bgColor;;
    pageDetails.isAnnotationHide = isAnnHide;
    this.setState({ pageDetails: pageDetails });
  };

  handleDrawerkeyselect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.setState({ drawerOpen: true });
    }
    this.viewerContentCallBack(false);
  }

  handleDrawer = () => {
    this.setState({ drawerOpen: true,idc: false,publishedToc:false});
    this.viewerContentCallBack(false);
  }

  hideDrawer = () => {
    if(!this.isTOCUpdated){
      if (this.state.drawerOpen) {
        document.getElementsByClassName('drawerIconBtn')[0].focus();
      }
      this.setState({ drawerOpen: false });
      this.viewerContentCallBack(true);
    }else{
      this.handleAlertOpen();

    }
  }

  handleBookshelfClick = () => {
    if (this.props.book.toc.content !== undefined) {
      this.props.book.toc.content = { list: [] };
      this.props.book.bookmarks = [];
      this.props.book.bookinfo = [];
      this.props.book.annTotalData = [];
    }
    const getOriginurl = localStorage.getItem('backUrl');
    let _secureToken = null;
    if(piSession)
    {
      if(piSession.currentToken() !== undefined && piSession.currentToken() !== null)
      _secureToken = piSession.currentToken();
    }
    localStorage.setItem('secureToken', _secureToken);
    if (getOriginurl) {
      window.location.href = getOriginurl;
    }
    // if(window.location.pathname.indexOf('/eplayer/Course/')>-1){
    //    let originurl = localStorage.getItem('sourceUrl');       
    //   if(originurl != null)
    //     {
    //       const langQuery = localStorage.getItem('bookshelfLang');
    //       if (langQuery && langQuery !== '?languageid=1') {
    //         browserHistory.push(`/eplayer/bookshelf${langQuery}`);
    //       } else {
    //         browserHistory.push('/eplayer/bookshelf');
    //       }
    //     }
    //     else
    //       {
    //           let redirectConsoleUrl   = resources.links.consoleUrl[domain.getEnvType()];
    //   window.location.href = redirectConsoleUrl;
    //       }  
    // }else {
    //   const langQuery = localStorage.getItem('bookshelfLang');
    //   if (langQuery && langQuery !== '?languageid=1') {
    //     browserHistory.push(`/eplayer/bookshelf${langQuery}`);
    //   } else {
    //     browserHistory.push('/eplayer/bookshelf');
    //   }
    // }
    this.setState({ open: false });
  }

  handleBookshelfKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      browserHistory.push('/');
      this.setState({ open: false });
    }
  }

  handlePreferenceClick = () => {
    let prefIconleft = $('.prefIconBtn').offset().left - 181;
    $('.preferences-container-etext').css('left', prefIconleft);
    if (this.state.prefOpen === true) {
      this.setState({ prefOpen: false });
    } else {
      this.setState({ prefOpen: true});
    }
  }

  handlePreferenceKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.handlePreferenceClick();
    }
  }
  
  goToTextChange = (e) => {
    this.setState({ goToTextVal: e.target.value });
  }

  goToPageClick = () => {
    this.props.goToPageClick(this.state.goToTextVal);
  }

  goToPageOnKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.setState({ goToTextVal: e.target.value });
      this.goToPageClick();
    }
  }

  // Applies the style to the HTML Body content
  getThemeFromPreference = () => (this.props.preferences.fetched ?
    this.props.preferences.data :
    this.defaultPreference
  );

  //Method to retrieve the cdn path of required version
  retrieveMathjax = (v, flag) => {
    const existingVersions = (flag === true) ? mathJaxCdnVersions : mathJaxVersions;
    let cdnUrl;
    if (v === undefined) {
      cdnUrl = existingVersions['2.6.1'];
    } else {
      cdnUrl = existingVersions[v];
      try {
        if (cdnUrl === '') { throw 'Invalid mathjax version'; };
      }
      catch (err) {
        console.log('Error in Loading Mathjax: ', cdnUrl);
      }
    }
    return cdnUrl;
  };

  loadMathjax = () => {
    const pearsonMathjax = this.retrieveMathjax('2.6.1');
    let scriptSrc = (window.location.href.indexOf('https://') > -1) ? 'https:' : 'http:';
    scriptSrc += pearsonMathjax;
    return scriptSrc;
  };
  closeHeaderPopups = (e) => {
    if (!this.state.drawerOpen) {
      const eleSearch = $(e.target).closest('.searchIconBtn');
      const elepref = $(e.target).closest('.prefIconBtn');
      const searchContainer = $(e.target).closest('.searchContainer');
      const prefContainer = $(e.target).closest('.preferences-container-etext');
      if (eleSearch.length === 0 && elepref.length === 0 && prefContainer.length === 0 && searchContainer.length === 0) {
        this.setState({ searchOpen: false, prefOpen: false });
      } else if (eleSearch.length === 0 && searchContainer.length === 0) {
        this.setState({ searchOpen: false });
      } else if (elepref.length === 0 && prefContainer.length === 0) {
        this.setState({ prefOpen: false });
      }
    } 
  };
  handleConfirmMessage = () => {
          this.isTOCUpdated = false;
          this.setState({idc:false});
          if(this.backAlert){
            this.backAlert=false;
            this.setState({drawerOpen: true},
              ()=>{this.setState({alertOpen: false}) });
           }
          else{
            this.setState({drawerOpen: false},
              ()=>{this.setState({alertOpen: false}) });
           }
          
  }

  handleAlertOpen = () => {
    this.setState({idc:true},()=>{
      this.props.dispatch(tocFlag()).then(()=>{
      if(this.isTOCUpdated && !this.props.updatedToc){
        this.setState({alertOpen: true});
      }
      });
    })
  };

  handleAlertClose = () => {
      this.backAlert=false;
      this.setState({alertOpen: false});
  };


  onPageClick = () => {
    this.setState({ searchOpen: true }, () => {
      this.setState({searchOpen : false, prefOpen: false});
    });
  };

  onSearchResultClick = (searchInfo) => {
    this.setState({rederPage:false}, () => {
      this.setState({rederPage:true})
    });
    let bookObj = {};
    let searchHref = ''; let searchCombination = []
    if(searchInfo.split('##')[1]) {
      searchHref = searchInfo.split('##')[0]; // For search SVC
      searchCombination=searchInfo.split('##')[1].split(',')
    } else {
      searchHref = searchInfo.split('*')[0];// For Auto complete search SVC
      if(searchInfo.split('*')[2] && searchInfo.split('*')[2].match('key')) {
        searchCombination = [`${searchInfo.split('*')[1]}*${searchInfo.split('*')[2]}`];
      } else{
        searchCombination = [searchInfo.split('*')[1]];
      }     
    }    
    this.state.pageDetails.playListURL.forEach(function(page, i) {
      if(page.href && page.href.match(searchHref)) {
        bookObj = page;
        console.log("onSearchResultClick : ", page, i);
      }
    });
    //bookObj = this.state.pageDetails.playListURL[306];
    this.goToPageCallback(bookObj.id, '', searchCombination);
    let obj = {};
    obj.event = "searchResultClicked";
    obj.term = searchCombination.toString();
    obj.target = this.state.pageDetails.baseUrl +'OPS'+ searchHref;
    dataLayer.push(obj);
  }

  render() {
    const callbacks = {};
    let annJsPath, annCssPath, productData;
    const { annotationData, annDataloaded, annotationTotalData, playlistData, playlistReceived, bookMarkData, tocData, tocReceived, bookdetailsdata, tocResponse, updatedToc } = this.props;
    // eslint-disable-line react/prop-types
    this.props.book.annTotalData = annotationTotalData;
    this.props.book.toc = tocData;
    this.props.book.tocReceived = tocReceived;
    this.props.book.bookmarks = bookMarkData;

    callbacks.removeAnnotationHandler = this.removeAnnotationHandler.bind(this);
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler.bind(this);
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPageCallback = this.goToPageCallback;

    //For Segregating to Wrapper component PxePlayer    
    const bootstrapParams = {
      pageDetails: { ...this.state.pageDetails },
      urlParams: { ...this.state.urlParams }
    }
    const currentBookId = this.props.params.pageId;
    //End of Wrapper PxePlayer

    const bookmarkIconData = {
      addBookmarkHandler: callbacks.addBookmarkHandler,
      removeBookmarkHandler: callbacks.removeBookmarkHandler,
      isCurrentPageBookmarked: callbacks.isCurrentPageBookmarked
    };
    
    const bookDetails = {
      title: '',
      author: ''
    };
    if (this.props.book.tocReceived) {
      bookDetails.title = this.props.book.toc.content.mainTitle;
      bookDetails.author = this.props.book.toc.content.author;
    }

    if (bookdetailsdata && bookdetailsdata.userCourseSectionDetail) {
      bookDetails.title = bookdetailsdata.userCourseSectionDetail.section.sectionTitle;
      bookDetails.author = bookdetailsdata.userCourseSectionDetail.authorName;
    }

    const tocCompData = {
      separateToggleIcon: true,
      data: this.props.book.toc ? this.props.book.toc : {},
      depth: 2,
      childField: 'children',
      isTocWrapperRequired: false
    };

    let type = '';
    let message = '';

    let configTocData = {
      dropLevelType: 'WITH_IN_SAME_LEVEL',
      tocContents: tocCompData.data.content.list,
      tocLevel: 3,
      dndType: 'TableOfContents',
      tocHeight:300,
      handlePublish: (changedTocContent) => {
        let tocPayload = [];
        let i = 0;
        for (const prop in changedTocContent) {
          if (changedTocContent.hasOwnProperty(prop)) {
            tocPayload[i] = changedTocContent[prop];
            i++;
          }
        }
        const tocItems = tocPayload;
        let subItems = [];
        const listData = tocItems.map((itemObj) => {
          if (itemObj.children) {
            subItems = itemObj.children.map(n => ({
              urn: n.id,
              href: n.href,
              id: n.id,
              playOrder: n.playOrder,
              title: n.title,
              children: n.children
            }));
          }
          return {
            id: itemObj.id,
            urn: itemObj.id,
            title: itemObj.title,
            coPage: itemObj.coPage,
            playOrder: itemObj.playOrder,
            children: subItems,
            href:itemObj.href
          };
        });
        const tocResponseData = { tocContents: listData };
        this.setState({idc:true});
        this.props.dispatch(putCustomTocCallService(tocResponseData, this.bookDetailsData)).then((response)=>{
          //console.log(response);
          if (response) {
            if (response.status === 'Success') {
              this.setState({publishedToc:true})
              this.type = response.status;
              this.message = "The table of contents has been updated!";
              this.isTOCUpdated=false;
              this.setState({
                idc:false
              });
              let obj = {};
              obj.event = "tocPublishSuccess";
              obj.term = 'TOC published sucessfully';
              dataLayer.push(obj);
            }
            else {
              this.type = 'Error';
              this.message = "Your changes didn't get published. Give us a few moments and try again.";
              this.setState({publishedToc:true});
              let obj = {};
              obj.event = "tocPublishError";
              obj.term = 'Error in TOC publish';
              dataLayer.push(obj);
            }
            
          }
        });
      },
      handleDashBoard: () => {
        if (this.props.book.toc.content !== undefined) {
          this.props.book.toc.content = { list: [] };
          this.props.book.bookmarks = [];
          this.props.book.bookinfo = [];
          this.props.book.annTotalData = [];
        }
        const getOriginurl = localStorage.getItem('backUrl');
        if (getOriginurl) {
          window.location.href = getOriginurl;
        }
        this.setState({ open: false });
      },
      onTocChange: (isChanged) =>{
        this.isTOCUpdated = isChanged;
      },
      showModal: ()=> {
        this.backAlert=true;
        this.handleAlertOpen();
      },
      listenBrowserEvents: true
    };

    const pages = bootstrapParams.pageDetails.playListURL || [];
    const bookmarArr = this.props.book.bookmarks ? this.props.book.bookmarks : [];
    const bookmarkCompData = {
      bookmarksArr: this.props.book.bookmarks ? Utils.sortBookmarkByPage(bookmarArr, pages) : []
    };
    const notesCompData = {
      notes: this.props.book.annotations ? this.props.book.annTotalData : []
    };

    const pxeClient = axios.create({
      baseURL: bootstrapParams.pageDetails.baseUrl,
      timeout: 5000,
      headers: {}
    });
    this.annHeaders = this.courseBook ? {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('secureToken')
    } :
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',     //'idpName': 'SMS',
        'X-Authorization': localStorage.getItem('secureToken')
      };
      
    let annotationClient;
    let headerTitleData={ params: '', classname: '', chapterTitle: '', pageTitle: '', isChapterOpener: '' };
    if (this.state.headerDataloaded) {
      headerTitleData = {
      params: this.props.params,
      classname: this.state.classname,
      chapterTitle: this.state.currentPageTitle,
      pageTitle: this.state.currentPageTitle,
      isChapterOpener: true
      };
    }
    if (playlistReceived && bookdetailsdata) {
      const getMathjaxJs = this.loadMathjax();
      let i;
      if (bookdetailsdata.roles === undefined) {
        this.userType = bookdetailsdata.userCourseSectionDetail.authgrouptype;
        this.productModel = 'ETEXT2_PXE';
      }
      else {
        for (i = 0; i < bookdetailsdata.roles.length; i++) {
          if (bookdetailsdata.roles[i].toLowerCase() === 'educator' || bookdetailsdata.roles[i].toLowerCase() === 'instructor')
            this.userType = 'instructor';
        }
         this.productModel = 'ETEXT2_SMS';
      }
      if(piSession){
        this.state.urlParams.user = piSession.userId();
        if(piSession.currentToken() !== undefined && piSession.currentToken() !== null){
          localStorage.setItem('secureToken', piSession.currentToken());
        }
      }
      annotationClient = axios.create({
        baseURL: `${bootstrapParams.pageDetails.endPoints.spectrumServices}/${this.state.urlParams.context}/identities/${this.state.urlParams.user}/notesX`,
        headers: this.annHeaders,
        data: {
          context: this.state.urlParams.context,
          user: this.state.urlParams.user,
          userType: this.userType == 'instructor' ? 'Instructor' : 'Student',
          productModel: this.productModel
        }
      });
      if (this.userType === 'instructor') {
        annJsPath = 'eplayer/annotation-lib/instructor-annotator/instructor-annotator.js';
        annCssPath = 'eplayer/annotation-lib/instructor-annotator/instructor-annotator.css';
      }
      else {
        annJsPath = 'eplayer/annotation-lib/annotator.js';
        annCssPath = 'eplayer/annotation-lib/annotator.css';
      }
      productData = {
        product: 'PXE',
        uuid: '',
        contentStatus: 'published',
        providers: {
          auth: {
            get: function () {
              return {
                id: 'ffffffff55099736e4b0c2dbd412938c',
                token: 'eyJhbGciOiJSUzUxMiIsImtpZCI6ImsxMDY5NDgxOTAifQ.eyJleHAiOjE1MDM1MzI3NTQsInN1YiI6ImZmZmZmZmZmNTUwOTk3MzZlNGIwYzJkYmQ0MTI5MzhjIiwic2Vzc2lkIjoiMTNlZGY3NDI2ZWU3NDc0YTk0ZTNkMTBjMTc3YzY1ODEiLCJoY2MiOiJVUyIsImNsaWVudF9pZCI6IkdzNW5DR3FvcXdkaWNjSlNrVllBaXZISzY1UENiUTBtIiwidHlwZSI6ImF0IiwiaWF0IjoxNTAzNTMwOTUzfQ.Pe5nKOmG_UW9WI3iTxdMncgchLjCOSi3Az5f7eRV57_LLUL1gdGL_rJ7kqi9munP_lR9vvUfVH4ZI1-qi18ssssZN1QqvtKVxhOlacVILvYgkOiv0EcnoNpuKwZn2pRy0HFpQizswCWRjhh4LgJzVjP7vrt9CFYw0jRBas88KDw'
              }
            }
          },
          customPage: {
            get: function (pageDetails) {
              console.log('Page not handled: ', pageDetails);
              return null;
            }
          }
        },
        pxeOptions: {
          script: `${window.location.origin}/eplayer/pxe_scripts/bundle.js`,
          style: `${window.location.origin}/eplayer/pxe_scripts/style.css`,
          scriptsToReplace: [
            {
              old: 'https://revel-content.openclass.com/content/amc/amc-bootstrap.js',
              new: `${window.location.origin}/eplayer/bxix_scripts/brix.js`
            }
          ],
          scriptsToAdd: [`${window.location.origin}/eplayer/annotation-lib/jquery.min.js`,
          `${window.location.origin}/${annJsPath}`,
            getMathjaxJs],
          stylesToAdd: [`${window.location.origin}/${annCssPath}`]
        },
        metaData: {
          brixClient: 'https://grid-static-dev.pearson.com/11-thinclient/0.0.0/js/brixClient-3.6.1-exp.5129.0.js',
          brixCss: `${window.location.origin}/eplayer/bxix_scripts/brix.css`,
          environment: 'LOCAL',
          pxeUserPreference: {
            theme: bootstrapParams.pageDetails.bgColor,
            fontSize: bootstrapParams.pageDetails.pageFontSize,
            isAnnotationHide: bootstrapParams.pageDetails.isAnnotationHide
          },
          searchText: bootstrapParams.pageDetails.searchText
        }
      };
    }
    this.isAnnotationHide = bootstrapParams.pageDetails.isAnnotationHide;
    const isInstructor = this.userType === 'instructor' ? true : false;
    let isconfigTocData = false;
    if (isInstructor) {
      isconfigTocData = true;
    }

     const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleAlertClose.bind(this)}
        key = "1"
      />,
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.handleConfirmMessage.bind(this)}
        key = "2"
      />,
    ];

    const locale = bootstrapParams.pageDetails.locale ? bootstrapParams.pageDetails.locale : 'en';
    const hideIcons = {
      backNav: false,
      hamburger: false,
      bookmark: false,
      pref: false,
      search: false,
      audio: true,
      moreIcon: true
    };
    return (
      <div onClick={this.closeHeaderPopups}>
        {playlistReceived &&
          <LearningContextProvider
            contextId="ddddd"
            contentType={productData.product.toUpperCase()}
            contentStatus={productData.contentStatus}
            providers={productData.providers}
            componentFactory={{ getComponent: function getComponent(pageData) { console.log('Unhandled component!', pageData); return null; } }}
            clients={{ page: pxeClient, annotation: annotationClient }}
            metadata={productData.metaData}
            pxeOptions={productData.pxeOptions}>
            <div>
              <div>
                {!this.state.searchOpen && <HeaderComponent
                  bookshelfClick={this.handleBookshelfClick}
                  drawerClick={this.handleDrawer}
                  bookmarkIconData={bookmarkIconData}
                  handlePreferenceClick={this.handlePreferenceClick}
                  handleDrawerkeyselect={this.handleDrawerkeyselect}
                  locale={locale}
                  headerTitleData={headerTitleData}
                  hideIcons={hideIcons}
                  prefOpen={this.state.prefOpen}
                  searchOpen={this.state.searchOpen}
                  autoComplete={this.props.autoComplete}
                  search={this.props.search}
                  onSearchResultClick={this.onSearchResultClick.bind(this)}
                /> }
                {
                  this.props.book.tocReceived &&
                  <DrawerComponent
                    isDocked={false}
                    drawerWidth={400}
                    isDraweropen={this.state.drawerOpen}
                    hideDrawer={this.hideDrawer}
                    bookDetails={bookDetails}
                    tocData={tocCompData}
                    bookmarkData={bookmarkCompData}
                    notesData={notesCompData}
                    currentPageId={this.state.currentPageId}
                    bookCallbacks={callbacks}
                    intl={this.props.intl}
                    configureTocData={configTocData}
                    isConfigurableToc={isconfigTocData}
                    idcToc={this.state.idc}
                  />
                }


                
                <div className="preferences-container-etext" >
                  {this.state.prefOpen ?
                    <div className="content">
                      <PreferencesComponent
                        fetch={this.getPreference}
                        preferenceUpdate={this.updatePreference}
                        disableBackgroundColor={false}
                        locale={locale}
                      />
                    </div> :
                    <div className="empty" />}
                </div>
              </div>
              {playlistReceived && this.state.rederPage ?
                <div>
                  <VegaViewPager
                    contentType="PXE"
                    pagePlayList={bootstrapParams.pageDetails.playListURL}
                    currentPageId={bootstrapParams.pageDetails.currentPageURL.id}
                    onPageRequest={
                      () => { }
                    }
                    onPageLoad={this.onPageLoad.bind(this)}
                    onPageClick={this.onPageClick}
                    onAnnotationUpdate={this.onPageChange}
                    annSearchId={bootstrapParams.pageDetails.annId}
                    key={bootstrapParams.pageDetails.currentPageURL.id}
                  />
                  <Navigation
                    onPageRequest={this.onPageRequest}
                    pagePlayList={this.props.playListWithOutDuplicates}
                    currentPageId={bootstrapParams.pageDetails.currentPageURL.id}
                  />
                </div> : null
              }
            </div>
          </LearningContextProvider>}
        {
          (updatedToc && this.state.publishedToc) ? <StaticAlert type={this.type} title='' message={this.message} /> : <div></div>
        }
        <div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.alertOpen}
          onRequestClose={this.handleAlertClose}
        >
          Your changes have not been saved. Do you want to proceed?
        </Dialog>
        </div>

         </div>
    );
  }
}


Book.propTypes = {
  fetchTocAndViewer: React.PropTypes.func,
  fetchAnnotations: React.PropTypes.func,
  removeAnnotation: React.PropTypes.func,
  fetchBookmarks: React.PropTypes.func,
  addBookmark: React.PropTypes.func,
  removeBookmark: React.PropTypes.func,
  fetchPreferences: React.PropTypes.func,
  // goToPage            : React.PropTypes.func,
  book: React.PropTypes.object,
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func
};

Book.contextTypes = {
  store: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    //annotationData       : state.annotationReducer.highlightPageData,
    annDataloaded: state.annotationReducer.annDataloaded,
    annotationTotalData: state.annotationReducer.highlightTotalData,
    annTotalDataLoaded: state.annotationReducer.annTotalDataLoaded,
    playlistData: state.playlistReducer.data,
    playlistReceived: state.playlistReducer.playlistReceived,
    tocData: state.playlistReducer.tocdata,
    tocResponse: state.playlistReducer.tocresponse,
    updatedToc: state.playlistReducer.updatedToc,
    tocReceived: state.playlistReducer.tocReceived,
    bookmarkedData: state.bookmarkReducer.data,
    bookMarkData: state.bookmarkReducer.bookmarksData,
    gotoPageObj: state.gotopageReducer.gotoPageObj,
    isGoToPageRecived: state.gotopageReducer.isGoToPageRecived,
    bookdetailsdata: state.playlistReducer.bookdetailsdata,
    getPreferenceData: state.preferenceReducer.preferenceObj,
    customTocPlaylistReceived: state.playlistReducer.customTocPlaylistReceived,
    prodType:state.playlistReducer.prodType  ,
    playListWithOutDuplicates:state.playlistReducer.playListWithOutDuplicates
  }
}; // eslint-disable-line max-len
Book = connect(mapStateToProps)(Book); // eslint-disable-line no-class-assign
export default Book;
