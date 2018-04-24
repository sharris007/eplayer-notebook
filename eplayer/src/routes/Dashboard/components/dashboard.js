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
import { resources, domain, typeConstants } from '../../../../const/Settings';
import { getGotoPageCall } from '../../../actions/gotopage';
import { getPreferenceCallService, postPreferenceCallService } from '../../../actions/preference';
import { loadPageEvent, unLoadPageEvent } from '../../../api/loadunloadApi';
import { getBookmarkCallService, postBookmarkCallService, deleteBookmarkCallService, getTotalBookmarkCallService } from '../../../actions/bookmark';
import { NoteBookComponenent } from '@pearson-incubator/notebook';
import './dashboard.scss';
import ComponentOwner from './js/component-owner';
import { NoteBook } from '@pearson-incubator/notebook';

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
let getSecureToken = null;

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
     piSession.getToken(function (result, userToken) {
      if (!userToken) {
        if (window.location.pathname.indexOf('/eplayer/view/book/') > -1) {
          browserHistory.push('/eplayer/pilogin');
        }else if (window.location.pathname.indexOf('/eplayer/view/') > -1) {
          browserHistory.push('/eplayer/pilogin');
        }else if (window.location.pathname.indexOf('/eplayer/view/course/') > -1) {
           browserHistory.push('/eplayer/pilogin');
        }
      }
    });
    if(piSession){
        if(piSession.currentToken() !== undefined && piSession.currentToken() !== null)
        {
            localStorage.setItem('secureToken',  piSession.currentToken());
        }
        getSecureToken = localStorage.getItem('secureToken');
    }
    this.state = {
      urlParams: {
        context: this.props.params.bookId,
        user: ''
      },      
      piToken: localStorage.getItem('secureToken'),
      pageSelected: 'materials',
      groupExpanded : false,
      expandedTagName : null,
      tagAttributes : [],
      lastUsedFilters : {},
      expandedTagId: null,
      groupModeFlag : false,
      toolbarMode : {},
      coloums : 4,
      notes : []
    }
    this.isDeeplinkBook = window.location.search.match('deeplink');
  }
 
  componentWillMount = () => {
    if(piSession){
        if(piSession.currentToken() !== undefined && piSession.currentToken() !== null)
        {
            localStorage.setItem('secureToken',  piSession.currentToken());
        }
    }
    getSecureToken = localStorage.getItem('secureToken');
    this.bookDetailsData = {
      context: this.state.urlParams.context,
      piToken: getSecureToken,
      bookId: this.props.params.bookId,
      pageId: this.props.params.pageId ? this.props.params.pageId :''
    }
    if (window.location.pathname.indexOf('/eplayer/view/course/') > -1) {
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
            if(this.isDeeplinkBook) {
              this.bookDetailsData.isDeeplink = true;
            }else {
               this.bookDetailsData.isDeeplink = false;
            }
          this.props.dispatch(getBookPlayListCallService(this.bookDetailsData));
          let identityId = localStorage.getItem('identityId');

          this.props.dispatch(getTotalAnnCallService(this.bookDetailsData));
        }
  }
  componentWillUnmount = () => {
      this.props.dispatch({ type: "CLEAR_PLAYLIST" });
      this.props.dispatch({ type: "CLEAR_ANNOTATIONS" });
      this.props.dispatch({ type: "CLEAR_BOOKMARKS" });
      this.props.dispatch({ type: "CLEAR_SEARCH" });
  }
  componentWillReceiveProps = (nextProps) => {
    console.log("nextProps", nextProps);
    if(nextProps.notesList && nextProps.notesList.length > 0){
      this.prepareNotes(nextProps.notesList);
     }
  }
  
  prepareNotes = (notes) => {
    const notesList = [];
    const originalNotesList = [];
    for (let ic = 0; ic < notes.length; ic++) {
      const noteObj = notes[ic];
      let note = noteObj.data;
      // const groupNote = noteObj.data;
      note.cardFormat = 'note';
      const contextualInfo = noteObj.contextualInfo;
      if (noteObj.pageId) {
        const titleIndex = _.findIndex(contextualInfo, function (obj) { return obj.key === 'title'; });
        note.title = contextualInfo && titleIndex !== -1 ? contextualInfo[titleIndex].value : null;
        note.highLightText = note.quote;
        note.pageId = noteObj.pageId;
      }
      else {
        note.title = note.quote;
      }
      note.content = note.text;
      note.tags = noteObj.tags;
      note.notes = noteObj.notes;
      note.timeStamp = noteObj.updatedTime ? noteObj.updatedTime : noteObj.createdTime;
      note.noteType = noteObj.noteType;
      
      note.id = noteObj.id;
      note.outsetSeq = noteObj.outsetSeq;

      const dupNote = _.cloneDeep(note);

      originalNotesList.push(dupNote);
      notesList.push(note);
    }
    const mapGroupEle = _.groupBy(notesList, function(i) {
      if (i.tags) { 
        return i.tags[0].tagId; 
      }
      else  {  return i.id;}});
    const getOrderedArr = _.sortBy(mapGroupEle, function(i) {return i[0].outsetSeq * -1;});
    const mapNotesObj = [];
    let groupFlag;
    _.forEach(getOrderedArr, function(value) { 
    if(value[0].tags){
       value[0].notes=[...value];
       mapNotesObj.push(value[0]);
       groupFlag = true;
      }else{
       _.forEach(value,(item)=>{mapNotesObj.push(item)})
      }
    });
    this.setState({
      notes : mapNotesObj
    });
  }
  onChange = (pageSelected) => {
    this.setState({ pageSelected: pageSelected });
  }
  viewTitle = () => {
    if (window.location.pathname.indexOf('/eplayer/view/book/') > -1) {
      browserHistory.push(`/eplayer/book/${bookId}`);
    }else if (window.location.pathname.indexOf('/eplayer/view/course/') > -1) {
      browserHistory.push(`/eplayer/course/${bookId}`);
    }
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
          id: courseData.indexId ? courseData.indexId : courseData.indexId,
          title: courseData.title ? courseData.title : courseData.section.sectionTitle,
          code: courseData.code,
          bookTitle: courseData.title ? courseData.title : courseData.section.sectionTitle,
          startDate: courseData.date ? courseData.date : courseData.section.startDate,
          endDate: courseData.expirationDate ? courseData.expirationDate : courseData.section.endDate,
          schedule: '',
          source: null,
          avatar: courseData.coverImageUrl ? courseData.coverImageUrl : courseData.section.avatarUrl,
          prefix: '',
          tocProvider: courseData.toc,
          institutionId: courseData.indexId ? courseData.indexId : courseData.indexId,
          launchUrl: null,
          authorName: courseData.creator,
          isStudent: true,
          passportDetails: {},
          isLoaded: true,
          indexId: courseData.indexId ? courseData.indexId : courseData.indexId,
          isError: false,
          contentType: 'ETEXT',
          productId: courseData.productId ? courseData.productId : courseData.section.productCodes[0]
        };
    }
    return courseDetail;
  }
  handleBack = () => {

  }
  callback  = () => {

  }
  handleGroupClick = () => {

  }
  render() {
     const { bookdetailsdata, tocData, tocReceived, notesList } = this.props;
     const { groupExpanded, expandedTagName, tagAttributes, lastUsedFilters, expandedTagId, toolbarMode, groupModeFlag, pageSelected, notes} = this.state;
     
    // eslint-disable-line react/prop-types
    let title = '';
    let tocContent = {};
    let courseData = {};
    if(tocReceived){
      tocContent = tocData.content;
    }
    if(bookdetailsdata) {
      if(bookdetailsdata.bookDetail){
        title = bookdetailsdata.bookDetail.metadata.title;
        bookId = bookdetailsdata.bookDetail.bookId;
        courseData = this.getCourseData(bookdetailsdata.bookDetail.metadata);
      }else if(bookdetailsdata.userCourseSectionDetail){
         title = bookdetailsdata.userCourseSectionDetail.section.sectionTitle;
         bookId = bookdetailsdata.userCourseSectionDetail.section.sectionId;
         courseData = this.getCourseData(bookdetailsdata.userCourseSectionDetail);
      }
    }
    const headerTabs = ['materials', 'notes'];
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
        {pageSelected === 'materials' ? (<div>
          <MaterialsComponent
          viewTitle={this.viewTitle}
          courseData={courseData}
          showTitle={true}
          cardHeader={true}
          cardFooter={true}
          tocData={this.tocCompData}
          showCourse={false}
        /> 
      
      </div>) : (<div>
        <NoteBook 
        notesList={notes} 
        groupExpanded={groupExpanded} 
        expandedTagName={expandedTagName} 
        tagAttributes={tagAttributes} 
        lastUsedFilters={lastUsedFilters} 
        expandedTagId={expandedTagId} 
        handleBack={this.handleBack} 
        toolbarMode={toolbarMode} 
        tocData={tocContent} 
        groupModeFlag={groupModeFlag} 
        callback={this.callback} 
        handleGroupClick={this.handleGroupClick} coloums={3} /></div>)}
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
    prodType:state.playlistReducer.prodType,
    playListWithOutDuplicates:state.playlistReducer.playListWithOutDuplicates,
    notesList: state.annotationReducer.notesList
  }
}; // eslint-disable-line max-len
Dashboard = connect(mapStateToProps)(Dashboard); // eslint-disable-line no-class-assign
export default Dashboard;