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
import axios from 'axios';
import Hawk from 'hawk';
import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { clients } from '../../../components/common/client';
import { resources, domain } from '../../../../const/Settings';
import { getmd5 } from '../../../components/Utility/Util';
import { eT1Contants } from '../../../components/common/et1constants';

export { fetchPageInfo } from './actions/pagePlayList';
export { getAnnotations, postAnnotation, deleteAnnotation, putAnnotation } from './actions/annotations';
export { getBookmarks, deleteBookmark, postBookmark } from './actions/bookmarks';
export { fetchToc } from './actions/tocActions';
export { fetchRegionsInfo, fetchGlossaryItems } from './actions/regionActions';
export { search } from './actions/searchActions';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();

export const RECEIVE_USER_INFO_PENDING = 'RECEIVE_USER_INFO_PENDING';
export const RECEIVE_USER_INFO_REJECTED = 'RECEIVE_USER_INFO_REJECTED';
export const RECEIVE_USER_INFO_FULFILLED = 'RECEIVE_USER_INFO_FULFILLED';
export const UPDATE_USER_ID = 'UPDATE_USER_ID';
export const UPDATE_AUTH_KEY= 'UPDATE_AUTH_KEY';
export const RECEIVEBOOKINFO_PENDING = 'RECEIVEBOOKINFO_PENDING';
export const RECEIVEBOOKINFO_FAILED = 'RECEIVEBOOKINFO_FAILED';
export const RECEIVEBOOKINFO_SUCCESS = 'RECEIVEBOOKINFO_SUCCESS';
export const RECEIVE_BOOK_FEATURES_PENDING= 'RECEIVE_BOOK_FEATURES_PENDING';
export const RECEIVE_BOOK_FEATURES_FULFILLED= 'RECEIVE_BOOK_FEATURES_FULFILLED';
export const RECEIVE_BOOK_FEATURES_REJECTED='RECEIVE_BOOK_FEATURES_REJECTED';
export const RECEIVE_PAGE_INFO = 'RECEIVE_PAGE_INFO';
export const REQUEST_TOC = 'REQUEST_TOC';
export const RECEIVE_TOC = 'RECEIVE_TOC';
export const REQUEST_BOOKMARKS = 'REQUEST_BOOKMARKS';
export const RECEIVE_BOOKMARKS = 'RECEIVE_BOOKMARKS';
export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const SAVE_ANNOTATION = 'SAVE_ANNOTATION';
export const EDIT_ANNOTATION = 'EDIT_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
export const RESTORE_BOOK_STATE = 'RESTORE_BOOK_STATE';
export const REQUEST_REGIONS = 'REQUEST_REGIONS';
export const RECEIVE_REGIONS = 'RECEIVE_REGIONS';
export const RECEIVE_GLOSSARY_TERM = 'RECEIVE_GLOSSARY_TERM';
export const RECEIVE_BASEPATH_PENDING= 'RECEIVE_BASEPATH_PENDING';
export const RECEIVE_BASEPATH_FULFILLED= 'RECEIVE_BASEPATH_FULFILLED';
export const RECEIVE_BASEPATH_REJECTED= 'RECEIVE_BASEPATH_REJECTED';
export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';

export function request(component) {
  switch (component) {
    case 'bookInfo' :
      return {type: RECEIVEBOOKINFO_PENDING};
    case 'toc':
      return { type: REQUEST_TOC };
    case 'bookmarks':
      return { type: REQUEST_BOOKMARKS };
    case 'highlights':
      return { type: REQUEST_ANNOTATIONS };
    default:
      return {};
  }
}

export function fetchbookDetails(urn, piToken, bookID) {
  const url = `${etextCourseService[envType]}/web/compositeBookShelf`;
  return dispatch =>
     axios.get(url, {
      headers: { 'Content-Type': 'application/json',
        'X-Authorization': piToken }
      }).then((response) => {
      let bookDetails;
      if (response.status >= 400) {
        console.log(`bookshelf error`);
      } else if (response.data) {
        let booksArray = response.data.entries;
        for(let i=0; i<booksArray.length; i++) {
          if(booksArray[i].bookId === bookID) {
            bookDetails = booksArray[i];
            break;
          }
        }
      }
      return bookDetails;
    });
}

export function getlocaluserID(bookServerURL, globaluserid, type) {
  let serviceurl = ''+bookServerURL+'/ebook/ipad/getlocaluserid?globaluserid=' + globaluserid + '&type=' +  type + '&outputformat=JSON';
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return {
    type: 'RECEIVE_USER_INFO',
    payload: axios.get(`${serviceurl}&hsid=${hsid}`),
    timeout: 20000
  };
}

export function updateUserID(userID)
{
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_ID, userID });
  };
}

export function validateUser(userid,scenario,invoketype,bookid,roletypeid,piToken,bookServerURL) {
  let serviceurl = ''+bookServerURL+'/ebook/pdfplayer/validateuser?values=bookid::' + bookid + '::scenario::' +  scenario + '::invoketype::'
                        +invoketype+'::userid::'+userid+'::roletypeid::'+roletypeid+'&key='+piToken+'&outputformat=JSON';
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return dispatch =>
    axios.get(''+serviceurl+'&hsid='+hsid).then((response) => {
      if (response.status >= 400) {
        console.log(`validateuser service error`);
      }
      else if(response.data) {
        const ssoKey = response.data[0].authKey;
        return dispatch({ type: UPDATE_AUTH_KEY, ssoKey });
      }
    });
}

export function fetchBookInfo(bookid, scenario, userid, bookServerURL, roleTypeId, uid, ubd, ubsd, globaluserid, authkey) {
  let roleTypeID = roleTypeId;
  if (roleTypeID === undefined || roleTypeID === null || roleTypeID === '') {
    roleTypeID = eT1Contants.UserRoleType.Student;
  }
  const bookState = {
    bookInfo: {
      userbook : {},
      book: {}
    },
  };
  return (dispatch) => {
    dispatch(request('bookInfo'));
      let serviceurl = `${bookServerURL}/ebook/pdfplayer/getbookinfo?userid=${userid}&bookid=${bookid}&userroleid=${roleTypeID}&scenario=${scenario}&userinfolastmodifieddate=${uid}&userbooklastmodifieddate=${ubd}&userbookscenariolastmodifieddate=${ubsd}&globaluserid=${globaluserid}&authkey=${authkey}&outputformat=JSON`;
    // tempurl is starts with http to create hash key for matching with server
    let tempurl = serviceurl.replace("https","http");
    let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    return axios.get(''+serviceurl+'&hsid='+hsid,
  {
  timeout: 20000
  }).then((response) => {
      if (response.data.code >= 400)
      {
        return dispatch({ type: 'RECEIVEBOOKINFO_FAILED',bookState});
      }
      else if(response.data.length)
      {
        const userbookObj = {};
          const bookObj = {};
          let author = (response.data[0].userBookTOList[0].authorList[0].firstName+' '+response.data[0].userBookTOList[0].authorList[0].lastName);
          let authorListLen = response.data[0].userBookTOList[0].authorList.length;
          for(let i=1; i<authorListLen; i++)
          {
            author += '/ ' + (response.data[0].userBookTOList[0].authorList[i].firstName+' '+response.data[0].userBookTOList[0].authorList[i].lastName);
          }
        userbookObj.userbookid = response.data[0].userBookTOList[0].userBookID,
        bookObj.globalbookid= response.data[0].userBookTOList[0].globalBookID,
        bookObj.numberOfPages= response.data[0].userBookTOList[0].numberOfPages,
        bookObj.bookid= response.data[0].userBookTOList[0].bookID,
        bookObj.bookeditionid= response.data[0].userBookTOList[0].bookEditionID,
        bookObj.hastocflatten= response.data[0].userBookTOList[0].hastocflatten,
        bookObj.languageid= response.data[0].userBookTOList[0].languageID,
        bookObj.roleTypeID= response.data[0].userBookTOList[0].roleTypeID,
        bookObj.activeCourseID= response.data[0].userBookTOList[0].lastAccessedCourseActivityID,
        bookObj.version= response.data[0].userBookTOList[0].version,
        bookObj.author=author,
        bookObj.thumbnailimg = response.data[0].userBookTOList[0].thumbnailArt,
        bookObj.title = response.data[0].userBookTOList[0].title,
        bookObj.pdfCoverArt = response.data[0].userBookTOList[0].pdfCoverArt,
        bookObj.ssoKey= response.data[0].userBookTOList[0].sessionID
        bookState.bookInfo.userbook = userbookObj;
        bookState.bookInfo.book = bookObj;
        bookState.bookInfo.fetching = false;
        bookState.bookInfo.fetched = true;
      return dispatch({ type: 'RECEIVEBOOKINFO_SUCCESS',bookState});
      }
    });
    }
}

export function fetchBookFeatures(bookid, sessionKey, userid, bookServerURL, roleTypeID,scenarioId) {
  let serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getbookfeatures?authkey=' + sessionKey + '&userid=' +  userid + '&bookid=' + bookid + '&userroleid=' + roleTypeID + '&scenario=' + scenarioId + '&outputformat=JSON';
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return {
    type: 'RECEIVE_BOOK_FEATURES',
    payload: axios.get(''+serviceurl+'&hsid='+hsid),
    timeout: 20000
  };
}

/* Created Action creator for getting basepath of relative regions/hotspots. */
export function fetchBasepaths(inputParams,authObj) {

  let bookServerURL = inputParams.serverDetails;
  let sessionKey = inputParams.ssoKey;
  let userid = authObj.userid;
  let bookid = inputParams.bookId;
  let roleTypeID = inputParams.roletypeid;

  let serviceurl = ''+bookServerURL+'/ebook/pdfplayer/launchbook?authkey=' + sessionKey + '&userid=' +  userid + '&bookid=' + bookid + '&userroleid=' + roleTypeID + '&outputformat=JSON';
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return {
    type: 'RECEIVE_BASEPATH',
    payload: axios.get(''+serviceurl+'&hsid='+hsid),
    timeout: 20000
  };
}

export function restoreBookState() {
  let bookState = {
    bookinfo: {
    fetching: false,
    fetched: false
    },
    bookPagesInfo: {
      pages: [],
      fetching: false,
      fetched: false
    },
    bookFeatures: {
      fetching: false,
      fetched: false
    },
    tocData: {
      fetching: false,
      fetched: false
    },
    bookmarkData: {
      fetching: false,
      fetched: false,
      bookmarkList: []
    },
    annotationData: {
      fetching: false,
      fetched: false,
      annotationList: []
    }
  }
  return { type : RESTORE_BOOK_STATE , bookState };
}

const ACTION_HANDLERS = {
  [RECEIVE_USER_INFO_PENDING]: state => ({
    ...state,
    userInfo: {
      fetching: true,
      fetched: false
    }
  }),
  [RECEIVE_USER_INFO_FULFILLED]: (state, action) => ({
    ...state,
    userInfo: {
      fetching: false,
      fetched: true,
      userid: action.payload.data[0]['userinfo localuserid']
    }
  }),
  [RECEIVE_USER_INFO_REJECTED]: state => ({
    ...state,
    userInfo: {
      fetching: false,
      fetched: false
    }
  }),
  [UPDATE_USER_ID]: (state, action) => ({
    ...state,
    userInfo: {
      fetching: false,
      fetched: true,
      userid: action.userID
    }
  }),
  [UPDATE_AUTH_KEY]: (state, action) => ({
    ...state,
    sessionInfo : {
      ssoKey: action.ssoKey
    }
  }),
  [RECEIVEBOOKINFO_PENDING]: state => ({
    ...state,
    bookinfo: {
      fetching: true,
      fetched: false
    }
  }),
  [RECEIVEBOOKINFO_SUCCESS]: (state, action) => ({
    ...state,
    bookinfo: action.bookState.bookInfo,
  }),
  [RECEIVEBOOKINFO_FAILED]: state => ({
    ...state,
    bookinfo: {
      fetching: false,
      fetched: false
    }
  }),
  [RECEIVE_BOOK_FEATURES_PENDING]: state => ({
    ...state,
    bookFeatures: {
      fetching: true,
      fetched: false
    }
  }),
  [RECEIVE_BOOK_FEATURES_FULFILLED]: (state,action) => ({
    ...state,
    bookFeatures: {
      fetching: false,
      fetched: true,
      hotspotcolor : action.payload.data[0].ipadFeaturesTO.hotSpotColor,
      isunderlinehotspot : action.payload.data[0].generalFeaturesTO.isUnderLineHotspot,
      hassearchbutton : action.payload.data[0].generalFeaturesTO.hasSearchButton,
      hasnotesmanager : action.payload.data[0].generalFeaturesTO.hasNotesManager,
      iconhotspotalpha : action.payload.data[0].ipadFeaturesTO.iconHotSpotAlpha,
      regionhotspotalpha : action.payload.data[0].ipadFeaturesTO.regionHotSpotAlpha,
      underlinehotspotcolor : action.payload.data[0].ipadFeaturesTO.underLineHotSpotColor,
      underlinehotspotthickness : action.payload.data[0].ipadFeaturesTO.underLineHotSpotThickness,
      underlinehotppothovercolor : action.payload.data[0].ipadFeaturesTO.underLineHotSpotHoverColor,
      hasbookshelflink: action.payload.data[0].headerFeaturesTO.hasBookshelfLink,
      haslogoutlink: action.payload.data[0].headerFeaturesTO.hasLogoutLink,
      hasprevnavpagebutton: action.payload.data[0].toolBarFeaturesTO.hasPreviousNavigatePageButton,
      hasnextnavpagebutton: action.payload.data[0].toolBarFeaturesTO.hasNextNavigatePageButton,
      haszoomoutbutton: action.payload.data[0].toolBarFeaturesTO.hasZoomOutButton,
      haszoominbutton: action.payload.data[0].toolBarFeaturesTO.hasZoomInButton,
      hashighlightingtoolbutton: action.payload.data[0].toolBarFeaturesTO.hasHighlightingToolButton,
      hasnotetoolbutton: action.payload.data[0].toolBarFeaturesTO.hasNoteToolButton,
      hasbookmarkpagebutton: action.payload.data[0].toolBarFeaturesTO.hasBookMarkPageButton,
      hasdrawerbutton: action.payload.data[0].generalFeaturesTO.hasLeftAccordion,
      hasPrintLink: action.payload.data[0].headerFeaturesTO.hasPrintLink,
      hasShowLinksButton: action.payload.data[0].toolBarFeaturesTO.hasShowLinksButton,
      printWithFooter: action.payload.data[0].generalFeaturesTO.printWithFooter,
      printWithWatermark: action.payload.data[0].generalFeaturesTO.printWithWatermark
    }
  }),
  [RECEIVE_BOOK_FEATURES_REJECTED]: state => ({
    ...state,
    bookFeatures: {
      fetching: false,
      fetched: false
    }
  }),
  [RECEIVE_PAGE_INFO]: (state, action) => ({
    ...state,
    bookPagesInfo: {
      pages: state.bookPagesInfo.pages === undefined ?
        action.bookState.bookPagesInfo.pages : state.bookPagesInfo.pages.concat(action.bookState.bookPagesInfo.pages),
      fetching: false,
      fetched: true
    }
  }),
  [REQUEST_TOC]: state => ({
    ...state,
    tocData : {
      fetching: true,
      fetched: false
    }
  }),
  [RECEIVE_TOC]: (state, action) => ({
    ...state,
    tocData: action.bookState.tocData
  }),
  [REQUEST_BOOKMARKS]: state => ({
    ...state,
    bookmarkData: {
      fetching: true,
      fetched: false,
      bookmarkList: []
    }
  }),
  [RECEIVE_BOOKMARKS]: (state, action) => ({
    ...state,
    bookmarkData: action.bookState.bookmarkData,
  }),
  [ADD_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarkData: { ...state.bookmarkData,
        bookmarkList:[
            ...state.bookmarkData.bookmarkList
        ].concat(action.bookmarkList).sort((bkm1, bkm2) => bkm1.uri - bkm2.uri)
      }
  }),
  [REMOVE_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarkData: { ...state.bookmarkData,
        bookmarkList: state.bookmarkData.bookmarkList.filter(bookmark => bookmark.bkmarkId !== action.bookmarkId)
      }
  }),
  [REQUEST_ANNOTATIONS]: state => ({
    ...state,
    annotationData: {
      fetching: true,
      fetched: false,
      annotationList: []
    }
  }),
  [RECEIVE_ANNOTATIONS]: (state, action) => ({
    ...state,
    annotationData: action.bookState.annotationData
  }),
  [SAVE_ANNOTATION]: (state, action) => ({
    ...state,
    annotationData: {
      ...state.annotationData,
      annotationList :[
        ...state.annotationData.annotationList
      ].concat(action.highlightList).sort((hl1, hl2) => hl2.time - hl1.time)
    }
  }),
  [EDIT_ANNOTATION]: (state, action) => ({
    ...state,
    annotationData: {
      ...state.annotationData,
      annotationList :[
        ...state.annotationData.annotationList.filter(highlight => highlight.id !== action.highlightObj.id),
          {
          userId: action.highlightObj.userId,
          bookId: action.highlightObj.bookId,
          pageId: action.highlightObj.pageId,
          author: action.highlightObj.author,
          courseId: action.highlightObj.courseId,
          shared: action.highlightObj.shared,
          highlightHash: action.highlightObj.highlightHash,
          comment: action.highlightObj.comment,
          text: action.highlightObj.text,
          color: action.highlightObj.color,
          originalColor: action.highlightObj.originalColor,
          id: action.highlightObj.id,
          pageNo: action.highlightObj.pageNo,
          meta: action.highlightObj.meta,
          creationTime: action.highlightObj.creationTime,
          time: action.highlightObj.time,
          pageIndex: action.highlightObj.pageIndex
        }
      ].sort((hl1, hl2) => hl2.time - hl1.time)
    }
  }),
  [DELETE_ANNOTATION]: (state, action) => ({
    ...state,
    annotationData: {
      ...state.annotationData,
      annotationList :state.annotationData.annotationList.filter(highlight => highlight.id !== action.id)
    }
  }),
  [RESTORE_BOOK_STATE]: (state,action) => ({
    ...state,
    bookinfo : action.bookState.bookinfo,
    bookPagesInfo : action.bookState.bookPagesInfo,
    bookFeatures : action.bookState.bookFeatures,
    tocData : action.bookState.tocData,
    bookmarkData: action.bookState.bookmarkData,
    annotationData: action.bookState.annotationData
  }),
  [REQUEST_REGIONS]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      regions: true
    }
  }),
  [RECEIVE_REGIONS]: (state, action) => ({
    ...state,
    regions: action.bookState.regions,
    isFetching: {
      ...state.isFetching,
      regions: action.bookState.isFetching.regions
    }
  }),
  [RECEIVE_GLOSSARY_TERM]: (state,action) => ({
    ...state,
    glossaryInfoList: action.bookState.bookInfo.glossaryInfoList
  }),
  [RECEIVE_BASEPATH_PENDING]: state => ({
    ...state,
    basepaths: {
      fetching: true,
      fetched: false
    }
  }),
  [RECEIVE_BASEPATH_FULFILLED]: (state,action) => ({
    ...state,
    basepaths: {
      fetching: false,
      fetched: true,
      flvpath: action.payload.data[0].booklist.book.flvpath,
      chromelessurlpath: action.payload.data[0].booklist.book.chromelessurlpath,
      urlpath: action.payload.data[0].booklist.book.urlpath,
      swfassetpath: action.payload.data[0].booklist.book.swfassetpath,
      audiotextpath: action.payload.data[0].booklist.book.audiotextpath,
      imagepath: action.payload.data[0].booklist.book.imagepath,
      h264path: action.payload.data[0].booklist.book.h264path,
      mp3path: action.payload.data[0].booklist.book.mp3path,
      virtuallearningassetpath: action.payload.data[0].booklist.book.virtuallearningassetpath
    }
  }),
  [RECEIVE_BASEPATH_REJECTED]: state => ({
    ...state,
    basepaths: {
      fetching: false,
      fetched: false
    }
  })
};

const initialState = {
  userInfo: {
    fetching: false,
    fetched: false,
    userid: ''
  },
  sessionInfo: {
    ssoKey:''
  },
  bookinfo: {
    fetching: false,
    fetched: false
  },
  bookPagesInfo: {
    pages: [],
    fetching: false,
    fetched: false
  },
  bookFeatures: {
    fetching: false,
    fetched: false
  },
  tocData: {
    fetching: false,
    fetched: false
  },
  bookmarkData: {
    fetching: false,
    fetched: false,
    bookmarkList: []
  },
  annotationData: {
    fetching: false,
    fetched: false,
    annotationList: []
  },
  regions:[],
  glossaryInfoList:[],
  basepaths: {
    fetching: false,
    fetched: false
  },
};

export default function book(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}