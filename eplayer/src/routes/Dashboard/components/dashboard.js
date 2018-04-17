/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
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
import { HeaderMenuComponent } from '@pearson-incubator/vega-core';
import { MaterialsComponent } from '@pearson-incubator/vega-drawer';
import languageName from '../../../../locale_config/configureLanguage';
import { languages } from '../../../../locale_config/translations/index';
import DashboardHeader from '../../../components/DashboardHeader';
import { pageDetails, customAttributes, pageLoadData, pageUnLoadData, mathJaxVersions, mathJaxCdnVersions } from '../../../../const/Mockdata';
import { browserHistory } from 'react-router';
import { getTotalAnnCallService, getAnnCallService, postAnnCallService, putAnnCallService, deleteAnnCallService, getTotalAnnotationData, deleteAnnotationData, annStructureChange } from '../../../actions/annotation';
import { getBookPlayListCallService, getPlaylistCallService, getBookTocCallService, getCourseCallService, putCustomTocCallService, gotCustomPlaylistCompleteDetails, tocFlag, getAuthToken, getParameterByName, getCourseCallServiceForRedirect, updateProdType } from '../../../actions/playlist';
import { getGotoPageCall } from '../../../actions/gotopage';
import { getPreferenceCallService, postPreferenceCallService } from '../../../actions/preference';
import { loadPageEvent, unLoadPageEvent } from '../../../api/loadunloadApi';
import { getBookmarkCallService, postBookmarkCallService, deleteBookmarkCallService, getTotalBookmarkCallService } from '../../../actions/bookmark';
import './dashboard.scss';

let languageid;
const url = window.location.href;
const n = url.search('languageid');
if (n > 0) {
  const urlSplit = url.split('languageid=');
  languageid = Number(urlSplit[1]);
} else {
  languageid = 1;
}
const locale = languageName(languageid);
const { messages } = languages.translations[locale];
let bookId =null;

export class Dashboard extends Component {
  constructor(props) {
    super(props);
     piSession.getToken(function (result, userToken) {
      if (!userToken) {
        // if (window.location.pathname.indexOf('/eplayer/ETbook/') > -1) {
        if (window.location.pathname.indexOf('/eplayer/book/') > -1) {
          browserHistory.push('/eplayer/pilogin');
        }else if (window.location.pathname.indexOf('/eplayer/view/') > -1) {
          browserHistory.push('/eplayer/pilogin');
        }else if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
          piSession.login(redirectCourseUrl, 10);
        }
      }
    });
    if(piSession){
        if(piSession.currentToken() !== undefined && piSession.currentToken() !== null)
        {
            localStorage.setItem('secureToken',  piSession.currentToken());
        }
    }
    this.state = {
      urlParams: {
        context: this.props.params.bookId,
        user: ''
      },      
      piToken: localStorage.getItem('secureToken')
    }
  }
 
  componentWillMount = () => {
    if(piSession){
        if(piSession.currentToken() !== undefined && piSession.currentToken() !== null)
        {
            localStorage.setItem('secureToken',  piSession.currentToken());
        }
    }
    const getSecureToken = localStorage.getItem('secureToken');
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
  componentWillUnmount = () => {
      this.props.dispatch({ type: "CLEAR_PLAYLIST" });
      this.props.dispatch({ type: "CLEAR_ANNOTATIONS" });
      this.props.dispatch({ type: "CLEAR_BOOKMARKS" });
      this.props.dispatch({ type: "CLEAR_SEARCH" });
  }
  componentWillReceiveProps = (nextProps) => {
    
  }
  OnChange = () => {
    console.log('OnChange called');
  }
  viewTitle = () => {
    console.log('viewTitle called');
    // browserHistory.push(`/eplayer/ETbook/${bookId}`);
    browserHistory.push(`/eplayer/book/${bookId}`);
  }
  goToPageCallback = () => {
    console.log('goToPageCallback called');
  }
  handleTocExpand = () => {
    console.log('handleTocExpand called');
  }
  getCourseData = (courseData) => {
    let courseDetail = null;
    if(courseData)
    {      
        courseDetail = {
          id: courseData.indexId,
          title: courseData.title,
          code: courseData.code,
          bookTitle: courseData.title ,
          startDate: courseData.date,
          endDate: courseData.expirationDate,
          schedule: '',
          source: null,
          avatar: courseData.coverImageUrl,
          prefix: '',
          tocProvider: courseData.toc,
          institutionId: courseData.indexId,
          launchUrl: null,
          authorName: courseData.creator,
          isStudent: true,
          passportDetails: {},
          isLoaded: true,
          indexId: courseData.indexId,
          isError: false,
          contentType: 'ETEXT',
          productId: courseData.productId
        };
    }
    return courseDetail;
  }
  render() {
     const { bookdetailsdata, tocData, tocReceived } = this.props;
    // eslint-disable-line react/prop-types
    let title = '';
    let tocContent = {};
    let courseData = {};
 
    if(tocReceived){
      title = tocData.bookDetails.title;
      tocContent = tocData.content;
      courseData = this.getCourseData(tocData.bookDetails);
    }
    if(bookdetailsdata) {
      if(bookdetailsdata.bookDetail){
        bookId = bookdetailsdata.bookDetail.bookId;
      }
    }
    const headerTabs = ['materials', 'notes'];
    const pageSelected = 'materials';
    const inkBarColor = 'teal';

    this.tocCompData = {
      separateToggleIcon: true,
      data: {
        content: tocData.content
      },
      depth: 2,
      childField: 'content',
      isTocWrapperRequired: false,
      clickTocHandler: this.goToPageCallback,
      handleTocExpand: this.handleTocExpand
    };
    return (
      <div>
        <DashboardHeader/>
        {tocReceived ? <div>
        <HeaderMenuComponent
          title={title}
          onChange={this.onChange}
          page={pageSelected}
          headerTabs={headerTabs}
          inkBarColor={inkBarColor}
        />
          <MaterialsComponent
          viewTitle={this.viewTitle}
          courseData={courseData}
          showTitle={true}
          cardHeader={true}
          cardFooter={true}
          tocData={this.tocCompData}
          showCourse={false}
        />  
        </div> : null
        }
      </div>
    )
  }
}
Dashboard.propTypes = {
  fetchTocAndViewer: React.PropTypes.func,
  fetchAnnotations: React.PropTypes.func,
  removeAnnotation: React.PropTypes.func,
  fetchBookmarks: React.PropTypes.func,
  addBookmark: React.PropTypes.func,
  removeBookmark: React.PropTypes.func,
  fetchPreferences: React.PropTypes.func,
  book: React.PropTypes.object,
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func
};
  Dashboard.contextTypes = {
  store: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired
};
  const mapStateToProps = state => {
  return {
    playlistData: state.playlistReducer.data,
    playlistReceived: state.playlistReducer.playlistReceived,
    tocData: state.playlistReducer.tocdata,
    tocResponse: state.playlistReducer.tocresponse,
    updatedToc: state.playlistReducer.updatedToc,
    tocReceived: state.playlistReducer.tocReceived,
    bookdetailsdata: state.playlistReducer.bookdetailsdata,
    customTocPlaylistReceived: state.playlistReducer.customTocPlaylistReceived,
    prodType:state.playlistReducer.prodType  ,
    playListWithOutDuplicates:state.playlistReducer.playListWithOutDuplicates
  }
}; // eslint-disable-line max-len
Dashboard = connect(mapStateToProps)(Dashboard); // eslint-disable-line no-class-assign
export default Dashboard;