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
import { Progress } from '@pearson-incubator/aquila-js-core';
import { pageDetails, customAttributes, pageLoadData, pageUnLoadData, mathJaxVersions, mathJaxCdnVersions } from '../../../../const/Mockdata';
import { browserHistory } from 'react-router';
import { getTotalAnnCallService, getAnnCallService, postAnnCallService, putAnnCallService, deleteAnnCallService, getTotalAnnotationData, deleteAnnotationData, annStructureChange, tagObjCallService } from '../../../actions/annotation';
import { saveGroupService, unGroupService, renameGroupService} from '../../../actions/notebook';
import { getBookPlayListCallService, getPlaylistCallService, getBookTocCallService, getCourseCallService, putCustomTocCallService, gotCustomPlaylistCompleteDetails, tocFlag, getAuthToken, getParameterByName, getCourseCallServiceForRedirect, updateProdType } from '../../../actions/playlist';
import { resources, domain, typeConstants } from '../../../../const/Settings';
import { getGotoPageCall } from '../../../actions/gotopage';
import { getPreferenceCallService, postPreferenceCallService } from '../../../actions/preference';
import { loadPageEvent, unLoadPageEvent } from '../../../api/loadunloadApi';
import { getBookmarkCallService, postBookmarkCallService, deleteBookmarkCallService, getTotalBookmarkCallService } from '../../../actions/bookmark';
import { NoteBook } from '@pearson-incubator/notebook';
import './Dashboard.scss';

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

class Dashboard extends Component {
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
      expandedTagId: null,
      groupModeFlag : false,
      toolbarMode : {'groupMode' :'DEFAULT',
                    'groupTitle' :null,
                    'groupId' : null},
      coloums : 4,
      notes : [],
      originalNotesList : [],
      tagObject : []
    }
    if (piSession) {
      const userId = piSession.userId();
      this.state.urlParams.user = userId;
    }
    this.callback=this.callback.bind(this);
    this.saveNote=this.saveNote.bind(this);
    this.addNote=this.addNote.bind(this);
    this.deleteNote=this.deleteNote.bind(this);
    this.isDeeplinkBook = window.location.search.match('deeplink');
    this.onChange = this.onChange.bind(this);
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
      pageId: this.props.params.pageId ? this.props.params.pageId :'',
      user: this.state.urlParams.user
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
          // let identityId = localStorage.getItem('identityId');

          this.props.dispatch(getTotalAnnCallService(this.bookDetailsData));
          this.props.dispatch(tagObjCallService(this.bookDetailsData));
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
    if(nextProps.notesList && nextProps.notesList.length > 0 && nextProps.tagAttrFlag){
      this.prepareNotes(nextProps.notesList, nextProps.tagObject);
     }
  }
  
  //form Notelist object
  prepareNotes = (notes, tagAttributes) => {
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
      notes : mapNotesObj,
      originalNotesList: originalNotesList
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
  goToPageCallback = (pageId) => {
    console.log('goToPageCallback called');
    let id = pageId;
     
    if (window.location.pathname.indexOf('/eplayer/view/course/') > -1) {
      if(this.props.prodType === 'idc'){
        this.productType = 'prdType';
      }
      else{
        this.productType = 'Source';
      }
      let url = `/eplayer/course/${bookId}/page/${id}`;
      url+=this.props.prodType?'?'+this.productType+'='+this.props.prodType+'&':'?';
      browserHistory.replace(url+`launchLocale=` + window.annotationLocale);
    } else {
        browserHistory.replace(`/eplayer/book/${bookId}/page/${id}?launchLocale=` + window.annotationLocale);
    }
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
          productId: courseData.productId ? courseData.productId : (courseData.section ? courseData.section.productCodes[0] : null)
        };
    }
    return courseDetail;
  }
  handleBack = () => {

  }
  refreshNotesList = (originalNotesList, tagObject) => {
    const groups = [];
    const notesList = [];

    const mapGroupEle = _.groupBy(originalNotesList, function(i){
      if(i.tags) { 
        return i.tags[0].tagId; 
      }
      else{  return i.id;}})
    const getOrderedArr = _.sortBy(mapGroupEle, function(i){return i[0].outsetSeq * -1});
    const mapNotesObj = [];
    let groupFlag;
    
    _.forEach(getOrderedArr, function(value) { 
    if(value[0].tags){
       value = _.sortBy([...value], function(j) {                   
        return j.tags[0].insetSeq * -1
       });
       value[0].notes=[...value];
       mapNotesObj.push(value[0]);
       groupFlag = true;
      }else{
       _.forEach(value,(item)=>{mapNotesObj.push(item)})
      }
    });

    if(groupFlag) {
      tagObject.map((tag, i) => {
        _.each(mapNotesObj, function (obj, index) {
          if(obj.notes) {
            if (obj.tags && obj.tags[0] && (obj.tags[0].tagId === tag.tagId)) {
              obj.tags[0].tagName = tag.tagName;
            }
          }
          
        });
      });
    }
    
  return mapNotesObj;
  }
  callback  = (msg, data) => {
    console.log("*********", this.bookDetailsData);
    let notesList = [...this.state.notes];
    const originalNotesList = [...this.state.originalNotesList];
    const tagObject = [...this.state.tagObject];
    if (msg === 'ADD') {
      this.addNote(msg, data);
    }
    else if (msg === 'SAVE') {
      this.saveNote(msg, data);
      const noteexist = notesList.find(noteobj => noteobj.id === data.id);
      const original_noteexist = originalNotesList.find(originalobj => originalobj.id === data.id);
      if(noteexist) {
        noteexist.content = data.content;
        noteexist.cardFormat = data.cardFormat;
        if (data.noteType === 'CUSTOM_NOTE')
          noteexist.title = data.title;
      }
      if(original_noteexist) {
        original_noteexist.content = data.content;
        original_noteexist.cardFormat = data.cardFormat;
        if (data.noteType === 'CUSTOM_NOTE')
          original_noteexist.title = data.title;
      }
      this.setState({
          notesList: notesList,
          originalNotesList: originalNotesList
      });
    }
    else if (msg === 'DELETE') {
      this.deleteNote(msg, data);
      _.remove(notesList, {
          id: data.id
      });
      _.remove(originalNotesList, {
          id: data.id
      });
      this.setState({
          notes: notesList,
          originalNotesList: originalNotesList
      });
    }
    else if (msg === "GROUP") {
      notesList.forEach((item, i) => {
        item.keyId = item.id + Date.now();
        if (data === false) {
          item.selected = false;
        }
      });

      let toolbarMode = this.state.toolbarMode;
      toolbarMode.groupMode = 'GROUPSELECT';
      console.log("toolbarMode", toolbarMode);
      this.setState({
        notes: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: data
      });
    } 
    else if (msg === "SELECTED") {

      let toolbarMode = this.state.toolbarMode;
      toolbarMode.groupMode = 'SELECTED'
      toolbarMode.selectedCount = 0;
      const notesList = [...this.state.notes];
      notesList.forEach((item, i) => {
        if (item.id === data.id) {
          item.selected = true;
        }
        if (item.selected) {
          toolbarMode.selectedCount++;
        }
      });


      this.setState({
        notes: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: true
      });
    } else if (msg === "UNSELECTED") {

      let toolbarMode = this.state.toolbarMode;

      //   var newArray = JSON.parse(JSON.stringify(notesList));
      const notesList = [...this.state.notes];
      let selectedCount = 0;
      notesList.forEach((item, i) => {
        if (item.id === data.id) {
          item.selected = false;
        }
        if (item.selected == true) {
          selectedCount++;
        }
      });

      if (selectedCount > 0) {
        toolbarMode.groupMode = 'SELECTED';
        toolbarMode.selectedCount = selectedCount;
      } else {
        toolbarMode.groupMode = 'GROUPSELECT';
        toolbarMode.selectedCount = selectedCount;
      }

      this.setState({
        notes: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: true
      });
    } else if (msg === "SAVEGROUP") {
      let toolbarMode = this.state.toolbarMode;
      toolbarMode.groupMode = 'DEFAULT'
      const notesList = [...this.state.notes];
      const originalNotesList = [...this.state.originalNotesList];
      const tempNotesList = [];
      let tagId = Date.now();
      let tagName = toolbarMode.groupTitle;

      if (data.groupId !== null) {
        tagId = data.groupId;
        tagName = data.groupTitle;
      }

      if (!!!tagName) {
        tagName = 'Untitled Group';
      }
      let filterList = _.cloneDeep(notesList);
      let filterList1 = _.cloneDeep(notesList);
      let filterList2 = _.cloneDeep(notesList);
      let filterList3 = _.cloneDeep(notesList);

      filterList1 = filterList1.filter(notesList => notesList.selected === true);
      filterList2 = filterList2.filter(notesList => notesList.selected === true);
      filterList3 = filterList3.filter(notesList => notesList.selected === false);
      let groupPayload = {
        "tagName": tagName,
        "notes": []
      };
      filterList2.forEach((item, i) => {
        let selectedObj = {
          "id": item.id
        }
        groupPayload.notes.push(selectedObj);
        item.selected = false;
      });
      this.bookDetailsData.payLoad = groupPayload;
      this.props.dispatch(saveGroupService(this.bookDetailsData)).then((json) => {
        debugger;
        if(json && json.response && json.response[0].tags && json.response[0].tags[0] && json.response[0].tags[0].tagId)
          tagId = json.response[0].tags[0].tagId;
        filterList2.forEach((item, i) => {
          const index = _.findIndex(originalNotesList, function (o) { return o.id === item.id; });
          if (index != -1) {
             originalNotesList[index].outsetSeq = json.response[0].outsetSeq;  
            if (originalNotesList[index].tags) {
              originalNotesList[index].tags[0].tagId = tagId;
              originalNotesList[index].tags[0].tagName = tagName;
            } else {
               _.each(json.response, (notes) => {
                 if( originalNotesList[index].id === notes.id){
                    originalNotesList[index].tags = notes.tags;
                 }              
              })     
            }
          }
          //    item.tagId = null;
        });
        let updatedObject = tagObject;
        updatedObject.push({'tagId':tagId, 'tagName':tagName});
        this.setState({
          notes: this.refreshNotesList(originalNotesList, updatedObject),
          originalNotesList: originalNotesList,
          toolbarMode: toolbarMode,
          tagAttributes: updatedObject,
          groupModeFlag: false
        });
      });
      //   filterList2.splice(0, 1);

      filterList1[0].tagId = tagId;
      filterList1[0].tagName = tagName;
      filterList1[0].notes = filterList2;
      filterList1[0].selected = false;

      filterList3.push(filterList1[0]);
    } else if (msg === "UNGROUP NOTES") { // ungroup all notes in a group
      let tagId = data.tags[0].tagId;
      this.ungroupNotes(msg, data);
      const originalNotesList = [...this.state.originalNotesList];

      originalNotesList.map((item, i) => {
        if (item.tags && item.tags[0] && item.tags[0].tagId === tagId) {
          originalNotesList[i].tags= null;
        }
      });

      const index = _.findIndex(tagObject, function (o) { return o.tagId === tagId; });
      if (index != -1) {
        tagObject.splice(index, 1);
      }
      this.setState({
        notes: this.refreshNotesList(originalNotesList, tagObject),
        originalNotesList: originalNotesList,
        tagAttributes: tagObject,
        groupExpanded: false,
        groupModeFlag: false,
        expandedTagName: null,
        expandedTagId: null
      });

    }
    else if (msg === "RENAME") {
      let tagId = (data.tags && data.tags[0].tagId) ? data.tags[0].tagId : '';
      let tagName = (data.tags && data.tags[0].tagName) ? data.tags[0].tagName : '';
      let renamePayLoad = {
        "tagName": tagName,
        "notes": []
      }
      this.bookDetailsData.tagId = tagId;
      this.bookDetailsData.payLoad = payLoad;
      this.props.dispatch(renameGroupService(this.bookDetailsData)).then((json) => {
        let updatedtagObj = tagObject;
        _.each(updatedtagObj, (obj, index) => {
          if (updatedtagObj[index].tagId === tagId) {
            updatedtagObj[index].tagName = tagName;
          }
        });
        this.setState({
          notes: this.refreshNotesList(originalNotesList, updatedtagObj),
          originalNotesList: originalNotesList,
          tagAttributes: updatedtagObj,
          groupExpanded: false,
          groupModeFlag: false,
          expandedTagName: null,
          expandedTagId: null
        });
      });
    }
  }
  saveNote = (msg, data) => {
    let payLoad = {
    'clientApp': 'ETEXT2_WEB',
    'productModel': 'ETEXT_SMS',
    'contextualInfo': [
      {
        'key': '',
        'value': ''
      }
    ],
    'pageId': null,
    'noteType': 'CUSTOM_NOTE',
    'shareable': false,
    'tags': [],
    'data': {
      'quote': data.title ? data.title : '',
      'text': data.content ? data.content : ''
    }
    };
    if (data.noteType && data.noteType !== 'CUSTOM_NOTE') {
      payLoad = {
        'clientApp': 'ETEXT2_WEB',
        'productModel': 'ETEXT_SMS',
        'contextualInfo': [
          {
            'key': 'title',
            'value': data.title ? data.title : '',
          }
        ],
        'pageId': data.pageId ? data.pageId : '',
        'noteType': data.noteType ? data.noteType : '',
        'shareable': false,
        'tags': data.tags ? data.tags : [],
        'data': {
          'quote': data.highLightText ? data.highLightText : '',
          'text': data.content ? data.content : ''
        }
      };
    }

    this.bookDetailsData.payLoad = payLoad;
    this.bookDetailsData.editId = data.id;
    this.props.dispatch(putAnnCallService(this.bookDetailsData));
  }
  addNote = (msg, data) => {
    const payLoad = {
      'payload': [
        {
          'clientApp': 'ETEXT2_WEB',
          'productModel': 'ETEXT_SMS',
          'contextualInfo': [
            {
              'key': '',
              'value': ''
            }
          ],
          'pageId': null,
          'noteType': 'CUSTOM_NOTE',
          'shareable': false,
          'tags': [],
          'data': {
            'quote': data.title ? data.title : '',
            'text': data.content ? data.content : ''
          }
        }
      ]
    };
    this.bookDetailsData.payLoad = payLoad;
    this.props.dispatch(postAnnCallService(this.bookDetailsData)).then(res=>{
      this.props.dispatch(getTotalAnnCallService(this.bookDetailsData));
    });
  };
  deleteNote = (msg, data) => {
    const payLoad = { ids: [data.id] };
    this.bookDetailsData.payLoad = payLoad;
    this.props.dispatch(deleteAnnCallService(this.bookDetailsData));
  };
  ungroupNotes = (msg, data) => {
    let tagId = null;
    let tagName = null;
    data.tags.map((tag, i) => {
      tagId = tag.tagId;
      tagName = tag.tagName;
    });
    const payLoad = {
      'tagName': tagName,
      'notes': []
    };
    this.bookDetailsData.tagId = tagId;
    this.bookDetailsData.payLoad = payLoad;
    this.props.dispatch(unGroupService(this.bookDetailsData)).then((json) => { 
      console.log('Notes successfully ungrouped!');
    });
  }
  handleGroupClick = () => {

  }
  render() {
     const { bookdetailsdata, tocData, tocReceived, notesList, originalTocList } = this.props;
     const { groupExpanded, expandedTagName, tagAttributes, lastUsedFilters, expandedTagId, toolbarMode, groupModeFlag, pageSelected, notes, tagObject, tagAttrFlag} = this.state;
     
    // eslint-disable-line react/prop-types
    let title = '';
    let tocContent = {};
    let courseData = {};
    // const getTocItems = originalTocList;
    console.log("originalTocList", originalTocList);
    if(tocReceived){
      tocContent = tocData.content;
    }else {
      // return (<Progress
      //   color={pearsonLightTheme.progress.material.color}
      //   style={pearsonLightTheme.progress.material.style}
      // />);
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
      depth: 3,
      childField: 'children',
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
      
      </div>) : (<div><NoteBook notesList={notes} groupExpanded={groupExpanded} expandedTagName={expandedTagName} tagAttributes={tagObject} lastUsedFilters={lastUsedFilters} expandedTagId={expandedTagId} handleBack={this.handleBack} toolbarMode={toolbarMode} tocData={originalTocList} groupModeFlag={groupModeFlag} callback={this.callback} handleGroupClick={this.handleGroupClick} coloums={3} /></div>)}
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
    notesList: state.annotationReducer.notesList,
    tagObject: state.annotationReducer.notesList,
    lastUsedFilters: state.annotationReducer.notesList, 
    tagAttrFlag: state.annotationReducer.tagAttrFlag,
    originalTocList: state.playlistReducer.originalTocList
  }
}; // eslint-disable-line max-len
Dashboard = connect(mapStateToProps)(Dashboard); // eslint-disable-line no-class-assign
export default Dashboard;