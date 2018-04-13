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

export class ISEdashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: {
        context: this.props.params.bookId,
        user: ''
      },
      piToken: localStorage.getItem('secureToken')
    }
  }
 
  componentWillMount = () => {
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
  }
  goToPageCallback = () => {
    console.log('goToPageCallback called');
  }
  handleTocExpand = () => {
    console.log('handleTocExpand called');
  }
  render() {
     const { annotationData, annDataloaded, annotationTotalData, playlistData, playlistReceived, bookMarkData, tocData, tocReceived, bookdetailsdata, tocResponse, updatedToc } = this.props;
    // eslint-disable-line react/prop-types
    let title = '';
    let tocContent = {};
    let courseData = {
    "id": "5a8ecc4be4b093a7a8ec7fe8",
    "title": "CITE - Financial Management",
    "code": "",
    "bookTitle": "CITE - Financial Management",
    "startDate": 1519295400000,
    "endDate": 1525084200000,
    "schedule": "",
    "source": null,
    "avatar": "https://www.pearsonhighered.com/assets/bigcovers/0/1/3/4/0134640845.jpg",
    "prefix": "https://epspqa.stg-openclass.com/eps/sanvan/api/item/aecd13f0-1fbd-466d-bcda-9574cceaed32/1/file",
    "tocProvider": [
      "https://content.stg-openclass.com/eps/pearson-reader/api/item/a2055aee-a3db-42d8-8183-0c18884ac229/1/file/titman-fmpaa-13e_etext_v6/OPS/toc.ncx",
      "https://content.stg-openclass.com/eps/pearson-reader/api/item/a2055aee-a3db-42d8-8183-0c18884ac229/1/file/titman-fmpaa-13e_etext_v6/OPS/package.opf",
      "https://content.stg-openclass.com/eps/pearson-reader/api/item/a2055aee-a3db-42d8-8183-0c18884ac229/1/file/titman-fmpaa-13e_etext_v6/OPS/xhtml/toc.xhtml"
    ],
    "institutionId": "54dbc7b53004d01c8d3b74c7",
    "launchUrl": "https://etext-stg.pearson.com/eplayer/Course/5a8ecc4be4b093a7a8ec7fe8",
    "authorName": "Sheridan Titman",
    "isStudent": true,
    "passportDetails": {
      "access": true,
      "productId": "x-urn:etext2_pxe:a2055aee-a3db-42d8-8183-0c18884ac229",
      "userId": "x-urn:pi:ffffffff5a34cf7ee4b0c0a61adb00bf"
    },
    "isLoaded": true,
    "indexId": "9cf85af597186c765a0648af50cd44d2",
    "isError": false,
    "contentType": "CITE",
    "productId": "urn:pearson:isbn:9780205956579"
  };
    if(tocReceived){
      title = tocData.bookDetails.title;
      tocContent = tocData.content;
    }
  
    const headerTabs = ['scheduled', 'materials', 'notes', 'tools'];
    const pageSelected = 'materials';
    const inkBarColor = 'teal';
    // courseData = { 'title': 'test', 'courseId': '12345' };

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
ISEdashboard.propTypes = {
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
  ISEdashboard.contextTypes = {
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
ISEdashboard = connect(mapStateToProps)(ISEdashboard); // eslint-disable-line no-class-assign
export default ISEdashboard;