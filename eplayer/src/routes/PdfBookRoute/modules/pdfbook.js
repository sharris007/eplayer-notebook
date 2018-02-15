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
export const REQUEST_HIGHLIGHTS = 'REQUEST_HIGHLIGHTS';
export const RECIEVE_HIGHLIGHTS = 'RECIEVE_HIGHLIGHTS';
export const RESTORE_BOOK_STATE = 'RESTORE_BOOK_STATE';

export function request(component) {
  switch (component) {
    case 'bookInfo' :
      return {type: RECEIVEBOOKINFO_PENDING};
    case 'toc':
      return { type: REQUEST_TOC };
    case 'bookmarks':
      return { type: REQUEST_BOOKMARKS };
    case 'highlights':
      return { type: REQUEST_HIGHLIGHTS };
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

export function fetchPageInfo(userid, bookid, bookeditionid,
  sessionKey, bookServerURL, roleTypeID, globalbookid) {
  const bookState = {
    bookPagesInfo: {
      pages: []
    }
  };
  let serviceurl = `${bookServerURL}/ebook/pdfplayer/getpagedetails?userid=${userid}&userroleid=${roleTypeID}&bookid=${bookid}&bookeditionid=${bookeditionid}&authkey=${sessionKey}`;
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return dispatch =>
     // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
     axios.get(`${serviceurl}&hsid=${hsid}`,
       {
         timeout: 20000
       })
    .then((response) => {
      if (response.status >= 400) {
        // console.log(`FetchPage info error: ${response.statusText}`);
      } else if (response.data.length) {
        response.data.forEach((jsonData) => {
          const pages = jsonData.pdfPlayerPageInfoTOList;
          pages.forEach((page) => {
            const pageObj = {

            };
            pageObj.pageid = page.pageID;
            pageObj.pagenumber = page.bookPageNumber;
            pageObj.pageorder = page.pageOrder;
            pageObj.chaptername = page.chapterName;
            pageObj.chapterID = page.chapterID
            pageObj.pdfPath = `${bookServerURL}/ebookassets`
                + `/ebook${globalbookid}/ipadpdfs/${page.pdfPath}`;
            pageObj.readerPlusID = page.readerPlusID;
            pageObj.printDisabled = page.printDisabled;
            pageObj.title = 'Page ' + page.bookPageNumber;
            pageObj.id = page.pageOrder;
            bookState.bookPagesInfo.pages.push(pageObj);
          });
        });
      }
      dispatch({ type: 'RECEIVE_PAGE_INFO', bookState });
    });
}

function Node() {
  this.id = '';
  this.title = '';
  this.children = [];
  this.urn = '';
}

function flatten3(input, finalChildlist) {
  let childlist = [];
  let finalChildList = finalChildlist;
  if (input.children !== undefined && input.children.length !== 0) {
    const firstNode = new Node();
    firstNode.id = input.id;
    firstNode.title = input.title;
    firstNode.urn = input.urn;
    childlist.push(firstNode);
    finalChildList = finalChildList.concat(input);
    input.children.forEach((node) => {
      const templist = flatten3(node, finalChildList);
      if (templist instanceof Array) {
        finalChildList = templist;
      } else {
        childlist = childlist.concat(templist);
      }
    });
    let j;
    for (let i = 0; i < finalChildList.length; i++) {
      if (input.id === finalChildList[i].id && input.urn === finalChildList[i].urn
          && input.title === finalChildList[i].title) {
        j = i;
        break;
      }
    }
    finalChildList[j].children = childlist;
  } else {
    const output = new Node();
    output.id = input.id;
    output.title = input.title;
    output.children = input.children;
    output.urn = input.urn;
    return output;
  }
  return finalChildList;
}

function flatten2(input, finalChildList) {
  if (input.children !== undefined && input.children.length !== 0) {
    return flatten3(input, finalChildList);
  }

  return input;
}

function flatten1(input) {
  let finalChildList = [];
  input.forEach((node) => {
    if (node.children.length !== 0) {
      const child1 = [];
      const firstNode = new Node();
      firstNode.id = node.id;
      firstNode.title = node.title;
      firstNode.urn = node.urn;
      child1.push(firstNode);
      finalChildList = finalChildList.concat(node);
      node.children.forEach((kids) => {
        const child = flatten2(kids, finalChildList);
        if (child instanceof Array) {
          finalChildList = child;
        } else {
          child1.push(child);
        }
      });
      let j;
      for (let i = 0; i < finalChildList.length; i++) {
        if (node.id === finalChildList[i].id && node.urn === finalChildList[i].urn
          && node.title === finalChildList[i].title) {
          j = i;
          break;
        }
      }
      finalChildList[j].children = child1;
    } else {
      finalChildList.push(node);
    }
  });
  return finalChildList;
}

/* Method for constructing tree for Toc. */
function constructTree(input) {
  const output = new Node();
  output.id = input.i;
  output.title = input.n;
  if (input.lv !== undefined) {
    output.urn = input.lv.pageorder;
  }
  if (input.be !== undefined) {
    if (input.be.length === undefined) {
      output.children.push(
            constructTree(input.be));
    } else {
      input.be.forEach((node) => {
        output.children.push(
               constructTree(node));
      });
    }
  }
  return output;
}

export function fetchTocAndViewer(bookId, authorName, title,
                                  thumbnail, bookeditionid, sessionKey, bookServerURL,
                                  hastocflatten, roleTypeID) {
  const bookState = {
    tocData: {
      content: {}
    }
  };
  return (dispatch,getState) => {
    dispatch(request('toc'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    let serviceurl = `${bookServerURL}/ebook/pdfplayer/getbaskettocinfo?userroleid=${roleTypeID}&bookid=${bookId}&language=en_US&authkey=${sessionKey}&bookeditionid=${bookeditionid}&basket=toc`;
    // tempurl is starts with http to create hash key for matching with server
    let tempurl = serviceurl.replace("https","http");
    let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    return axios.get(`${serviceurl}&hsid=${hsid}`,
      {
        timeout: 100000
      })
    .then((response) => {
      if(getState().location.query.bookid === bookId){
          response.data.forEach((allBaskets) => {
        const basketData = allBaskets.basketsInfoTOList;
        bookState.tocData.content.id = basketData[0].bookID || '';
        bookState.tocData.content.mainTitle = title ;
        bookState.tocData.content.author = authorName ;
        bookState.tocData.content.thumbnail = thumbnail
        ||
        'http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/'
        + 'ebookCM21254346/assets/1256799653_Iannone_thumbnail.png';
        bookState.tocData.content.list = [];
        basketData.forEach((tocLevel1) => {
          const tocLevel1ChildData = tocLevel1.document;
          const tocLevel1ChildList = [];
          tocLevel1ChildData.forEach((tocLevel2) => {
            const tocLevel2ChildData = tocLevel2.bc.b.be;
            if(tocLevel2ChildData !== undefined)
            {
              if (tocLevel2ChildData.length === undefined) {
                const childList = constructTree(tocLevel2ChildData);
                tocLevel1ChildList.push(childList);
              } else {
                tocLevel2ChildData.forEach((tocLevel3) => {
                  const childList = constructTree(tocLevel3);
                  tocLevel1ChildList.push(childList);
                });
              }
            }
          });
          if (hastocflatten === 'Y' && tocLevel1ChildList.length !== 0) {
            bookState.tocData.content.list = flatten1(tocLevel1ChildList);
          } else {
            bookState.tocData.content.list = tocLevel1ChildList;
          }
        });
      });
      bookState.tocData.fetching = false;
      bookState.tocData.fetched = true;
      dispatch({ type: RECEIVE_TOC, bookState });
      }

    });
  };
}

export function fetchBookmarksUsingSpectrumApi(bookId, userId, Page, roletypeid, courseId, piSessionKey) {
  const bookState = {
    bookmarkData: {
      bookmarkList: []
    }
  };
  let queryString;
  queryString = '/api/context/'+bookId+'/identities/'+userId+'/notesX?isBookMark=true';
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return clients.readerApi[envType].get(queryString, {
        headers: {
        'X-Authorization': piSessionKey,
        'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status >= 400) {
          bookState.bookmarkData.fetching = false;
          bookState.bookmarkData.fetched = false;
          return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
        }
        return response.data.response;
      })
    .then((bookmarkResponseList) => {
      if (bookmarkResponseList.length) {
        bookmarkResponseList.forEach((bookmark) => {
          const extID = Number(bookmark.pageId);
          const bmObj = {
            id: extID,
            bkmarkId: bookmark.id,
            userId: bookmark.userId,
            bookId: bookmark.contextId,
            pageId: bookmark.data.pageId,
            pageNo: bookmark.pageNo,
            roleTypeId: bookmark.role,
            createdTimestamp: bookmark.updatedTime,
            title: `${Page} ${bookmark.pageNo}`,
            uri: extID,
            externalId: extID
          };
          if (roletypeid == eT1Contants.UserRoleType.Instructor && bookmark.subContextId == courseId)
          {
            bookState.bookmarkData.bookmarkList.push(bmObj);
          }
          else if (roletypeid == eT1Contants.UserRoleType.Student)
          {
            bookState.bookmarkData.bookmarkList.push(bmObj);
          }
        });
      }
      bookState.bookmarkData.bookmarkList.sort((bkm1, bkm2) => bkm1.uri - bkm2.uri);
      bookState.bookmarkData.fetching = false;
      bookState.bookmarkData.fetched = true;
      return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
    });
  };
}

export function fetchHighlightUsingSpectrumApi(bookId, courseId, userid, roletypeid, piSessionKey) {
  const bookState = {
    annotationData: {
      annotationList: []
    }
  };
  let queryString;
  if (roletypeid == eT1Contants.UserRoleType.Student)
  {
    queryString = '/api/context/'+bookId+'/identities/'+userid+'/notesX?isBookMark=false&withShared=true';
  }
  else
  {
    queryString = '/api/context/'+bookId+'/identities/'+userid+'/notesX?isBookMark=false';
  }
  return (dispatch) => {
    dispatch(request('highlights'));
    return clients.readerApi[envType].get(queryString, {
        headers: {
          'X-Authorization':piSessionKey
        }
      }).then((response) => {
        if (response.status >= 400) {
          bookState.annotationData.fetching = false;
          bookState.annotationData.fetched = false;
          return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
        }
        return response.data.response;
      }).then((highlightResponseList) => {
        if (highlightResponseList.length) {
          highlightResponseList.forEach((highlight) => {
            const hlObj = {

            };
            const pageid = Number(highlight.pageId);
            hlObj.userId = highlight.userId;
            hlObj.bookId = highlight.contextId;
            hlObj.pageId = pageid;
            hlObj.courseId = highlight.subContextId;
            hlObj.shared = highlight.shareable;
            hlObj.highlightHash = highlight.data.highlightHash;
            hlObj.comment = highlight.data.note;
            hlObj.text = highlight.selectedText;
            hlObj.color = highlight.color;
            hlObj.originalColor = highlight.color;
            hlObj.id = highlight.id;
            hlObj.pageNo = highlight.pageNo;
            hlObj.roleTypeId = highlight.role;
            hlObj.meta = highlight.data;
            hlObj.author = highlight.data.author;
            hlObj.creationTime = highlight.createdTime;
            hlObj.time = highlight.updatedTime;
            hlObj.pageIndex = 1;
            if ((roletypeid == eT1Contants.UserRoleType.Instructor && (_.toString(hlObj.meta.roletypeid) === _.toString(roletypeid))
                  && (_.toString(hlObj.userId) === _.toString(userid)) && hlObj.courseId == courseId)
               ||
               (roletypeid == eT1Contants.UserRoleType.Student && (_.toString(hlObj.meta.roletypeid) === _.toString(roletypeid))
                  && (_.toString(hlObj.userId) === _.toString(userid)))) {
              hlObj.isHighlightOnly = false;
              bookState.annotationData.annotationList.push(hlObj);
            } else if (roletypeid == eT1Contants.UserRoleType.Student && hlObj.meta.roletypeid == eT1Contants.UserRoleType.Instructor && hlObj.courseId == courseId) {
              if(hlObj.shared)
              {
               hlObj.isHighlightOnly = false;
              }
              else
              {
               hlObj.isHighlightOnly = true;
              }
              bookState.annotationData.annotationList.push(hlObj);
            }
          });
        }
        bookState.annotationData.annotationList.sort((hl1, hl2) => hl2.time - hl1.time);
        bookState.annotationData.fetching = false;
        bookState.annotationData.fetched = true;
        return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
      });
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
      fetched: false
    }
  }),
  [RECEIVE_BOOKMARKS]: (state, action) => ({
    ...state,
    bookmarkData: action.bookState.bookmarkData,
  }),
  [REQUEST_HIGHLIGHTS]: state => ({
    ...state,
    annotationData: {
      fetching: true,
      fetched: false
    }
  }),
  [RECIEVE_HIGHLIGHTS]: (state, action) => ({
    ...state,
    annotationData: action.bookState.annotationData
  }),
  [RESTORE_BOOK_STATE]: (state,action) => ({
    ...state,
    bookinfo : action.bookState.bookinfo,
    bookPagesInfo : action.bookState.bookPagesInfo,
    bookFeatures : action.bookState.bookFeatures,
    tocData : action.bookState.tocData,
    bookmarkData: action.bookState.bookmarkData,
    annotationData: action.bookState.annotationData
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
  }
};

export default function book(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}