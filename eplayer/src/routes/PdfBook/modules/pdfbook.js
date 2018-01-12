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
import axios from 'axios'; /* axios is third party library, used to make ajax request. */
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
const envType = domain.getEnvType();/* Importing the client file for framing the complete url, since baseurls are stored in client file. */


// Created Action Constant for BOOKMARKS, TOC, GO_TO_PAGE and so on.
export const REQUEST_BOOKMARKS = 'REQUEST_BOOKMARKS';
export const RECEIVE_BOOKMARKS = 'RECEIVE_BOOKMARKS';
export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';
export const REQUEST_TOC = 'REQUEST_TOC';
export const RECEIVE_TOC = 'RECEIVE_TOC';
export const GO_TO_PAGE = 'GO_TO_PAGE';
export const RECEIVEBOOKINFO_PENDING = 'RECEIVEBOOKINFO_PENDING';
export const RECEIVEBOOKINFO_FAILED = 'RECEIVEBOOKINFO_FAILED';
export const RECEIVEBOOKINFO_SUCCESS = 'RECEIVEBOOKINFO_SUCCESS';
export const RECEIVE_PAGE_INFO = 'RECEIVE_PAGE_INFO';
export const RECEIVE_USER_INFO_PENDING = 'RECEIVE_USER_INFO_PENDING';
export const RECEIVE_USER_INFO_REJECTED = 'RECEIVE_USER_INFO_REJECTED';
export const RECEIVE_USER_INFO_FULFILLED = 'RECEIVE_USER_INFO_FULFILLED';
export const SAVE_HIGHLIGHT = 'SAVE_HIGHLIGHT';
export const REQUEST_HIGHLIGHTS = 'REQUEST_HIGHLIGHTS';
export const RECIEVE_HIGHLIGHTS = 'RECIEVE_HIGHLIGHTS';
export const REMOVE_HIGHLIGHT = 'REMOVE_HIGHLIGHT';
export const EDIT_HIGHLIGHT = 'EDIT_HIGHLIGHT';
export const REQUEST_REGIONS = 'REQUEST_REGIONS';
export const RECEIVE_REGIONS = 'RECEIVE_REGIONS';
export const RECEIVE_BOOK_FEATURES_PENDING= 'RECEIVE_BOOK_FEATURES_PENDING';
export const RECEIVE_BOOK_FEATURES_FULFILLED= 'RECEIVE_BOOK_FEATURES_FULFILLED';
export const RECEIVE_BOOK_FEATURES_REJECTED='RECEIVE_BOOK_FEATURES_REJECTED';
export const RECEIVE_GLOSSARY_TERM= 'RECEIVE_GLOSSARY_TERM';
export const RECEIVE_BASEPATH_PENDING= 'RECEIVE_BASEPATH_PENDING';
export const RECEIVE_BASEPATH_FULFILLED= 'RECEIVE_BASEPATH_FULFILLED';
export const RECEIVE_BASEPATH_REJECTED= 'RECEIVE_BASEPATH_REJECTED';
export const UPDATE_AUTH_KEY= 'UPDATE_AUTH_KEY';
export const LOAD_CURRENT_PAGE= 'LOAD_CURRENT_PAGE';

export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const GET = 'GET';

// ------------------------------------
// Calling Actions creators based on Types. .
// ------------------------------------
export function request(component) {
  switch (component) {
    case 'bookmarks':
      return { type: REQUEST_BOOKMARKS };
    case 'toc':
      return { type: REQUEST_TOC };
    case 'highlights' :
      return { type: REQUEST_HIGHLIGHTS };
    case 'regions' :
      return {type: REQUEST_REGIONS};
    case 'bookInfo' :
      return {type: RECEIVEBOOKINFO_PENDING};
    default:
      return {};
  }
}
function extractTextContent(content) {
  let span= document.createElement('span');
  span.innerHTML= content;
  return span.textContent || span.innerText;
}
function randomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function createAuthorizationToken(relativeURL, method) {
  const qa_credentials = {
    id: 'tArkNWL2dK',
    key: 'Fc0C9w05bZy6U9TB7wN6CBgKyM32yk6Q',
    algorithm: 'sha256'
  };
  const stage_credentials = {
    id: 'tArkNWL2dK',
    key: 'Fc0C9w05bZy6U9TB7wN6CBgKyM32yk6Q',
    algorithm: 'sha256'
  };
  const prod_credentials = {
    id: 'h8wZiP6v1YJn',
    key: 't7hCxYrbAP0HMqpB57ieN0qzFUu9Y3Flb0D3',
    algorithm: 'sha256'
  };
  let credentials;
  if(envType === 'qa')
  {
    credentials = qa_credentials;
  }
  else if(envType === 'stage')
  {
    credentials = stage_credentials;
  }
  else if(envType === 'prod')
  {
    credentials = prod_credentials;
  }
  const baseUrl = clients.readerApi[envType].defaults.baseURL;
  const uri = baseUrl + relativeURL;
  const header = Hawk.client.header(uri, method, { credentials,
    ext: '',
    timestamp: Math.round(Date.now() / 1000),
    nonce: randomString(6) });
  const authorizationVal = header.field;

  const authorizationHeaderVal = authorizationVal.replace('Hawk id=', 'ReaderPlus key=');
  return authorizationHeaderVal;
}

/* Method for fetching the bookmarks from Redaer Api by passing the below parameters. */
export function fetchBookmarksUsingSpectrumApi(bookId, userId, Page, roletypeid, courseId, piSessionKey) {
  const bookState = {
    bookmarks: [],
    isFetching: {
      bookmarks: true
    }
  };
  let queryString;
/*  if (roletypeid == 2)
  {
    queryString = `/bookmark?limit=${eT1Contants.readerApiResponseRecordsLimits}&userId=${userId}&bookId=${bookId}`;
  }
  else
  {
    queryString = `/bookmark?limit=${eT1Contants.readerApiResponseRecordsLimits}&userId=${userId}&bookId=${bookId}&courseId=${courseId}`;
  }*/
  queryString = '/api/context/'+bookId+'/identities/'+userId+'/notesX?isBookMark=true';
  // const authorizationHeaderVal = createAuthorizationToken(queryString, 'GET');

  /* Dispatch is part of middleware used to dispatch the action, usually used in Asynchronous Ajax call.*/
  return (dispatch) => {
    dispatch(request('bookmarks'));

    return clients.readerApi[envType].get(queryString, {
        headers: {
        'X-Authorization': piSessionKey,
        'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status >= 400) {
          bookState.isFetching.bookmarks = false;
          return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
        }
        return response.data.response;
      })
    .then((bookmarkResponseList) => {
      if (bookmarkResponseList.length) {
        bookmarkResponseList.forEach((bookmark) => {
          // const date = new Date(bookmark.updatedTime * 1000);
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
          if (roletypeid == 3 && bookmark.subContextId == courseId)
          {
            bookState.bookmarks.push(bmObj);
          }
          else
          {
            bookState.bookmarks.push(bmObj);
          }
        });
      }
      bookState.bookmarks.sort((bkm1, bkm2) => bkm1.uri - bkm2.uri);
      bookState.isFetching.bookmarks = false;
      return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
    });
  };
}


/* Created action creator for addBookmarkUsingSpectrumApi. */
export function addBookmarkUsingSpectrumApi(userId, bookId, pageId, pageNo, externalId, courseId, shared, Page, roleTypeId, piSessionKey) {
  clients.readerApi[envType].defaults.headers =  {'X-Authorization':piSessionKey,'Content-Type': 'application/json'};
  const data = {
    clientApp: eT1Contants.clientAppNameForSpectrumApi,
    isBookMark:true,
    userId,
    data: {
      pageId
    },
    role:roleTypeId,
    contextId: bookId,
    pageId: externalId,
    productModel: eT1Contants.productModelForSpectrumApi,
    pageNo,
    subContextId: courseId,
    shareable: shared
  };

  let bmObj;

  return (dispatch) => {
    dispatch(request('bookmarks'));

    return clients.readerApi[envType].post('/api/context/'+bookId+'/identities/'+userId+'/notesX', {"payload":[data]})
    .then((response) => {
      if (response.status >= 400) {
        // console.log(`Add bookmark error: ${response.statusText}`);
      }
      return response.data.response;
    }).then((bookmarkResponseList) => {
      let bookmarkList = [];
      if (bookmarkResponseList !== undefined) {
        bookmarkResponseList.forEach((bookmark) => {
        // const date = new Date(bookmark.updatedTime * 1000);
        const extID = Number(bookmark.pageId);
        bmObj = {
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
         bookmarkList.push(bmObj);
        })
      }
      return dispatch({ type: ADD_BOOKMARK, bookmarkList });
    });
  };
}


/* Method for deleting the selected bookmark. */
export function removeBookmarkUsingSpectrumApi(bookmarkId, userId, bookId, piSessionKey) {
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return clients.readerApi[envType].delete('/api/context/'+bookId+'/identities/'+userId+'/notesX?isBookMark=true', {
      headers: {
        'X-Authorization': piSessionKey,
        'Content-Type': 'application/json'
      },
      data:{"ids":[bookmarkId]}
    }).then((response) => {
      if (response.status >= 400) {
         // console.log(`Error in remove bookmark: ${response.statusText}`)
      }
      return dispatch({ type: REMOVE_BOOKMARK, bookmarkId });
    });
  };
}

/* Method for creating node in Toc. */
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

/* Method for fetching Toc list by passing following parameters. */
export function fetchTocAndViewer(bookId, authorName, title,
                                  thumbnail, bookeditionid, sessionKey, bookServerURL,
                                  hastocflatten, roleTypeID) {
  const bookState = {
    toc: {
      content: {},
      child: []
    },
    viewer: {},
    isFetching: {
      toc: true,
      viewer: true
    },
    childern: {}
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
      // bookState.toc.content.bookId = basketData[0].bookID || '';
        bookState.toc.content.id = basketData[0].bookID || '';
      // bookState.toc.showDuplicateTitle = true;
        bookState.toc.content.mainTitle = title ;
        bookState.toc.content.author = authorName ;
        bookState.toc.content.thumbnail = thumbnail
        ||
        'http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/'
        + 'ebookCM21254346/assets/1256799653_Iannone_thumbnail.png';
        bookState.toc.content.list = [];
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
        /* let tocLevel_1_Obj = new Node();
        tocLevel_1_Obj.id=tocLevel1.basketID;
        tocLevel_1_Obj.title=tocLevel1.name;
        tocLevel_1_Obj.children=tocLevel1ChildList;*/
          if (hastocflatten === 'Y' && tocLevel1ChildList.length !== 0) {
            bookState.toc.content.list = flatten1(tocLevel1ChildList);
          } else {
            bookState.toc.content.list = tocLevel1ChildList;
          }

        // bookState.toc.content.list=tocLevel1ChildList;
        // bookState.toc.content.list=flatten1(tocLevel1ChildList);
        });
      });
      bookState.toc.fetching = false;
      bookState.toc.fetched = true;
      bookState.isFetching.toc = false;
      dispatch({ type: RECEIVE_TOC, bookState });
      }

    });
  };
}

/* Created Action creator for navigating the different pages from current page. */
export function goToPage(pageId) {
   // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
  return (dispatch) => {
    dispatch({ type: GO_TO_PAGE, pageId });
  };
}

export function updateAuthKey(ssoKey)
{
  return (dispatch) => {
    dispatch({ type: UPDATE_AUTH_KEY, ssoKey });
  };
}

/* Created Action creator for fetching all book detail. */
export function fetchBookInfo(bookid, scenario, userid, bookServerURL, roleTypeId, uid, ubd, ubsd, globaluserid, authkey) {
  let roleTypeID = roleTypeId;
  if (roleTypeID === undefined || roleTypeID === null || roleTypeID === '') {
    roleTypeID = 2;
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
/* Created Action creator for getting page details by page number */
export function fetchPagebyPageNumber(userid, roleTypeID, bookid, bookeditionid,
  pageNo, sessionKey,bookServerURL) {
  const bookState = {
    bookInfo: {
      pages: []
    }
  };
  let serviceurl = `${bookServerURL}/ebook/pdfplayer/getpagebybookpagenumber?userid=${userid}&userroleid=${roleTypeID}&bookid=${bookid}&bookeditionid=${bookeditionid}&bookpagenumbers=${pageNo}&authkey=${sessionKey}&outputformat=JSON`;
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
          const pages = jsonData.viewerPageInfoRestTO;
          pages.forEach((page) => {
            const pageObj = {

            };
            pageObj.pageid = page.pageID;
            pageObj.bookid = page.bookID;
            pageObj.pagenumber = page.bookPageNumber;
            pageObj.thumbnailpath = page.thumbnailFilePath;
            pageObj.pageorder = page.pageOrder;
            pageObj.bookeditionid = page.bookEditionID;
            pageObj.chaptername = page.chapterName;
            pageObj.isbookmark = page.isBookmark;
            pageObj.pdfPath = page.pdfPath;
            pageObj.readerPlusID = page.readerPlusID;
            bookState.bookInfo.pages.push(pageObj);
          });
        });
      }
      dispatch({ type: 'RECEIVE_PAGE_INFO', bookState });
    // loadPdfPageCallback(pageIndexToLoad);
    });
}
/* Created Action creator for getting page details by page order */
export function fetchPageInfo(userid, bookid, bookeditionid,
  pageIndexToLoad, totalPagesToHit, sessionKey, bookServerURL, roleTypeID) {
  const bookState = {
    bookInfo: {
      pages: []
    }
  };
  let serviceurl = `${bookServerURL}/ebook/pdfplayer/getpagebypageorder?userid=${userid}&userroleid=${roleTypeID}&bookid=${bookid}&bookeditionid=${bookeditionid}&listval=${totalPagesToHit}&authkey=${sessionKey}&outputformat=JSON`;
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
          const pages = jsonData.viewerPageInfoRestTO;
          pages.forEach((page) => {
            const pageObj = {

            };
            pageObj.pageid = page.pageID;
            pageObj.bookid = page.bookID;
            pageObj.pagenumber = page.bookPageNumber;
            pageObj.thumbnailpath = page.thumbnailFilePath;
            pageObj.pageorder = page.pageOrder;
            pageObj.bookeditionid = page.bookEditionID;
            pageObj.chaptername = page.chapterName;
            pageObj.isbookmark = page.isBookmark;
            pageObj.pdfPath = page.pdfPath;
            pageObj.readerPlusID = page.readerPlusID;
            bookState.bookInfo.pages.push(pageObj);
          });
        });
      }
      dispatch({ type: 'RECEIVE_PAGE_INFO', bookState });
    // loadPdfPageCallback(pageIndexToLoad);
    });
}
/* Created Action creator for getting regions/hotspots. */
export function fetchRegionsInfo(bookid,bookeditionid,pageorder,sessionKey,roleTypeID,bookServerURL,scenarioId,platformId){
  const bookState = {
    regions: [],
    isFetching: {
      regions: true
    }
  };
  return (dispatch) => {
    dispatch(request('regions'));
    let serviceurl;
    if (platformId == undefined || platformId == null || platformId == "")
    {
      serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getregionbypageorder?bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+pageorder+'&scenario='+scenarioId+'&userroleid='+roleTypeID+'&authkey='+sessionKey+'&outputformat=JSON';
    }
    else
    {
      serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getregionbypageorder?bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+pageorder+'&platformid='+platformId+'&scenario='+scenarioId+'&userroleid='+roleTypeID+'&authkey='+sessionKey+'&outputformat=JSON';
    }
    // tempurl is starts with http to create hash key for matching with server
    let tempurl = serviceurl.replace("https","http");
    let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    return axios.get(''+serviceurl+'&hsid='+hsid,
  {
  timeout: 20000
  }).then((response) => {
      if (response.status >= 400)
      {
        console.log(`fetchRegionsInfo error: ${response.statusText}`);
      }
      else if(response.data.length)
      {
          for (let i=0;i<response.data[0].regionsList.length;i++)
          {
          response.data.forEach((region) => {
          const regionObj= {};
          if(region.regionsList[i].linkTypeID !== 16)
          {
            regionObj.regionID = region.regionsList[i].regionID;
            regionObj.globalBookID=region.regionsList[i].globalBookID;
            regionObj.regionTypeID=region.regionsList[i].regionTypeID;
            regionObj.guid=region.regionsList[i].guid;
            regionObj.roleTypeID=region.regionsList[i].roleTypeID;
            regionObj.isicon=region.regionsList[i].isicon;
            regionObj.iconTypeID=region.regionsList[i].iconTypeID;
            regionObj.page=region.regionsList[i].page;
            regionObj.x=region.regionsList[i].x;
            regionObj.y=region.regionsList[i].y;
            regionObj.width=region.regionsList[i].width;
            regionObj.height=region.regionsList[i].height;
            regionObj.name=region.regionsList[i].name;
            regionObj.description=region.regionsList[i].description;
            regionObj.note=region.regionsList[i].note;
            regionObj.linkSearch=region.regionsList[i].linkSearch;
            regionObj.linkTypeID=region.regionsList[i].linkTypeID;
            regionObj.linkTypeLocation=region.regionsList[i].linkTypeLocation;
            regionObj.linkValue=region.regionsList[i].linkValue;
            regionObj.linkX=region.regionsList[i].linkX;
            regionObj.linkY=region.regionsList[i].linkY;
            regionObj.linkWidth=region.regionsList[i].linkWidth;
            regionObj.linkHeight=region.regionsList[i].linkHeight;
            regionObj.mediaWidth=region.regionsList[i].mediaWidth;
            regionObj.mediaHeight=region.regionsList[i].mediaHeight;
            regionObj.glossaryEntryID=region.regionsList[i].glossaryEntryID;
            regionObj.imagePath=region.regionsList[i].imagePath;
            regionObj.useCustom=region.regionsList[i].useCustom;
            regionObj.readyToPublish=region.regionsList[i].readyToPublish;
            regionObj.sequenceId=region.regionsList[i].sequenceId;
            regionObj.platformID=region.regionsList[i].platformID;
            regionObj.isIpad=region.regionsList[i].isIpad;
            regionObj.hasPlatformIcon=region.regionsList[i].hasPlatformIcon;
            regionObj.regionType=region.regionsList[i].regionType;
            regionObj.linkType=region.regionsList[i].linkType;
            regionObj.iconType=region.regionsList[i].iconType;
            regionObj.roleType=region.regionsList[i].roleType;
            regionObj.alternateMediaLink=region.regionsList[i].alternateMediaLink;
            regionObj.transparent=region.regionsList[i].transparent;
            regionObj.pearsonSmartPlayer=region.regionsList[i].pearsonSmartPlayer;
            regionObj.downloadable=region.regionsList[i].downloadable;
            regionObj.isBrowserView=region.regionsList[i].isBrowserView;
            regionObj.assetSize=region.regionsList[i].assetSize;
            regionObj.assetLastModifiedDate=region.regionsList[i].assetLastModifiedDate;
            regionObj.downloadURL=region.regionsList[i].downloadURL;
            bookState.regions.push(regionObj);
          }
        });
        }
      }
      bookState.isFetching.regions=false;
      return dispatch({ type: RECEIVE_REGIONS,bookState});
    });
    }
  }
/* Created Action creator for getting Glossary Information. */
export function fetchGlossaryItems(bookid,glossaryentryid,sessionKey,bookServerURL) {
  const bookState = {
    bookInfo : {
      glossaryInfoList : [],
    }
  };
  let serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getglossary?bookid='+bookid+'&glossaryentryid='+glossaryentryid+'&authkey='+sessionKey+'&outputformat=JSON';
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return dispatch =>
     axios.get(''+serviceurl+'&hsid='+hsid,
       {
         timeout: 20000
       })
    .then((response) => {
      if (response.status >= 400) {
        console.log(`fetch Glossary Items error: ${response.statusText}`);
      } else if (response.data.length) {
          for(let i=0;i<response.data[0].glossaryList.length;i++)
          {
            response.data.forEach((glossTerm) => {
              const glossaryInfo = {};
              glossaryInfo.glossaryTerm = glossTerm.glossaryList[i].glossaryTerm;
              glossaryInfo.glossaryDefinition = extractTextContent(glossTerm.glossaryList[i].glossaryDefinition);
              glossaryInfo.glossaryEntryID = glossTerm.glossaryList[i].glossaryEntryID;
              bookState.bookInfo.glossaryInfoList.push(glossaryInfo);
            });
          }
      }
      dispatch({ type: 'RECEIVE_GLOSSARY_TERM', bookState });
    });
}
 /* Created Action creator for getting basepath of relative regions/hotspots. */
export function fetchBasepaths(bookid, sessionKey, userid, bookServerURL, roleTypeID) {
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
 /* Created Action creator for getting book features. */
export function fetchBookFeatures(bookid, sessionKey, userid, bookServerURL, roleTypeID,scenarioId) {
    // payload: axios.get(''+bookServerURL+'/ebook/ipad/getbookfeatures?authkey=' + sessionKey + '&userid=' +  userid + '&bookid=' + bookid + '&userroleid=' + roleTypeID + '&outputformat=JSON',
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
 /* Created Action creator for fetching user information. */
export function fetchUserInfo(globaluserid, bookid, uid, ubd, ubsd, sessionKey, bookServerURL) {
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
  let serviceurl = `${bookServerURL}/ebook/ipad/synchbookwithbookshelfserverdata?globaluserid=${globaluserid}&bookid=${bookid}&uid=${ubd}&ubd=${ubd}&ubsd=${ubsd}&authkey=${sessionKey}`;
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return {
    type: 'RECEIVE_USER_INFO',
    payload: axios.get(`${serviceurl}&hsid=${hsid}`),
    timeout: 20000
  };
}

/* Created Action creator for feching highlight details from Reader Api. */
export function fetchHighlightUsingSpectrumApi(bookId, courseId, userid, roletypeid, piSessionKey) {
  const bookState = {
    highlights: [],
    isFetching: {
      highlights: true
    }
  };
  let queryString;
  if (roletypeid == 2)
  {
    queryString = '/api/context/'+bookId+'/identities/'+userid+'/notesX?isBookMark=false&withShared=true';
    // queryString = `/highlight?limit=${eT1Contants.readerApiResponseRecordsLimits}&bookId=${bookId}`;
  }
  else
  {
    queryString = '/api/context/'+bookId+'/identities/'+userid+'/notesX?isBookMark=false';
    // queryString = `/highlight?limit=${eT1Contants.readerApiResponseRecordsLimits}&bookId=${bookId}&courseId=${courseId}&userId=${userid}`;
  }
  return (dispatch) => {
    dispatch(request('highlights'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    return clients.readerApi[envType].get(queryString, {
        headers: {
          'X-Authorization':piSessionKey
        }
      }).then((response) => {
        if (response.status >= 400) {
          bookState.isFetching.highlights = false;
          return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
        }
        return response.data.response;
      }).then((highlightResponseList) => {
        if (highlightResponseList.length) {
          highlightResponseList.forEach((highlight) => {
            const hlObj = {

            };
            // const time = new Date(highlight.updatedTime * 1000);
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
            hlObj.pageIndex = 1;        // For Foxit
            if ((_.toString(hlObj.meta.roletypeid) === _.toString(roletypeid))
                  && (_.toString(hlObj.userId) === _.toString(userid)) && hlObj.courseId == courseId) {
              hlObj.isHighlightOnly = false;
              bookState.highlights.push(hlObj);
            } else if (roletypeid == 2 && hlObj.meta.roletypeid == 3 && hlObj.courseId == courseId) {
              if(hlObj.shared)
              {
               hlObj.isHighlightOnly = false;
              }
              else
              {
               hlObj.isHighlightOnly = true;
              }
              bookState.highlights.push(hlObj);
            }
          });
        }
        bookState.highlights.sort((hl1, hl2) => hl2.time - hl1.time);
        bookState.isFetching.highlights = false;
        return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
      });
  };
}
/* Method for saving the highLight selected by user. */
export function saveHighlightUsingSpectrumApi(userId, bookId, pageNo,
  courseId, shared, selectedText, color, meta, currentPageId,roleTypeId, piSessionId) {
  // const authorizationHeaderVal = createAuthorizationToken('/highlight', 'POST');
  const axiosInstance = clients.readerApi[envType];
  axiosInstance.defaults.headers = {'X-Authorization':piSessionId,'Content-Type': 'application/json'};
  const data = {
    clientApp: eT1Contants.clientAppNameForSpectrumApi,
    color,
    contextId: bookId,
    role:roleTypeId,
    data: meta,
    isBookMark:false,
    productModel: eT1Contants.productModelForSpectrumApi,
    pageId: currentPageId,
    pageNo,
    selectedText,
    shareable: shared,
    subContextId: courseId,
    userId
  };
  return (dispatch) => {
    dispatch(request('highlights'));
    return axiosInstance.post('/api/context/'+bookId+'/identities/'+userId+'/notesX', {"payload":[data]}).then((response) => {
      if (response.status >= 400) {
        // console.log(`error: ${response.statusText}`);
      }
      return response.data.response;
    }).then((highlightResponseList) => {
      let highlightList = []; 
      if (highlightResponseList !== undefined) {
        highlightResponseList.forEach((highlight) => {
        // const time = new Date(highlight.updatedTime * 1000);
        const pageid = Number(highlight.pageId);
        let hlObj = {
          userId: highlight.userId,
          bookId: highlight.contextId,
          pageId: pageid,
          roleTypeId: highlight.role,
          courseId: highlight.subContextId,
          shared: highlight.shareable,
          highlightHash: highlight.data.highlightHash,
          comment: highlight.data.note,
          text: highlight.selectedText,
          color: highlight.color,
          originalColor: highlight.color,
          id: highlight.id,
          pageNo: highlight.pageNo,
          meta: highlight.data,
          author: highlight.data.author,
          creationTime: highlight.createdTime,
          time: highlight.updatedTime,
          pageIndex: 1       // For Foxit
        };
        highlightList.push(hlObj);
       });
      }
      dispatch({ type: 'SAVE_HIGHLIGHT', highlightList });
      return highlightList[0];
    });
  };
}
/* Removing highLight from the page for selected area. */
export function removeHighlightUsingSpectrumApi(id, userId, bookId, authorizationHeaderVal) {
  const axiosInstance = clients.readerApi[envType];
  axiosInstance.defaults.headers = {'X-Authorization':authorizationHeaderVal,'Content-Type': 'application/json'};
  return (dispatch) => {
    dispatch(request('highlights'));
      return axiosInstance.delete('/api/context/'+bookId+'/identities/'+userId+'/notesX?isBookMark=false',
    {data:{"ids":[id]}}).then((response) => {
      if (response.status >= 400) {
        // console.log(`Error in remove highlight: ${response.statusText}`)
      }
      return dispatch({ type: REMOVE_HIGHLIGHT, id });
    });
  };
}

export function editHighlightUsingSpectrumApi(id, note, color, isShared, userId, bookId,
   pageNo, courseId, selectedText, roleTypeId, meta, currentPageId, authorizationHeaderVal) {
  const editHightlightURI = '/api/context/'+bookId+'/identities/'+userId+'/notesX';
  const payloadData = {
    id,
    clientApp: eT1Contants.clientAppNameForSpectrumApi,
    color,
    contextId: bookId,
    data: meta,
    isBookMark:false,
    productModel: eT1Contants.productModelForSpectrumApi,
    pageId: currentPageId,
    pageNo,
    role:roleTypeId,
    selectedText,
    shareable: isShared,
    subContextId: courseId,
    userId
  };
  if (note !== undefined) {
    payloadData.data.note = note;
  }

  const axiosInstance = clients.readerApi[envType];
  axiosInstance.defaults.headers = {'X-Authorization':authorizationHeaderVal,'Content-Type': 'application/json'};
  // const authorizationHeaderVal = createAuthorizationToken(editHightlightURI, 'PUT');
  return (dispatch) => {
    dispatch(request('highlights'));
    return axiosInstance.put(editHightlightURI, {"payload":[payloadData]}).then((response) => {
      if (response.status >= 400) {
        // console.log(`Error in edit highlight: ${response.statusText}`);
      }
      return response.data.response[0];
    }).then((highlightResponse) => {
      let highlightObj;
      if (highlightResponse !== undefined) {
        // const time = new Date(highlightResponse.updatedTime * 1000);
        const pageid = Number(highlightResponse.pageId);
        highlightObj = {
          userId: highlightResponse.userId,
          bookId: highlightResponse.contextId,
          pageId: pageid,
          roleTypeId: highlightResponse.role, 
          courseId: highlightResponse.subContextId,
          shared: highlightResponse.shareable,
          highlightHash: highlightResponse.data.highlightHash,
          comment: highlightResponse.data.note,
          text: highlightResponse.selectedText,
          color: highlightResponse.color,
          originalColor: highlightResponse.color,
          id: highlightResponse.id,
          pageNo: highlightResponse.pageNo,
          meta: highlightResponse.data,
          author: highlightResponse.data.author,
          creationTime: highlightResponse.createdTime,
          time: highlightResponse.updatedTime,
          pageIndex: 1
        };
      }
      return dispatch({ type: EDIT_HIGHLIGHT, highlightObj });
    });
  };
}

export function fetchbookDetails(urn, piToken,bookID)
{
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
           for(let i=0; i<booksArray.length; i++)
        {
          if(booksArray[i].bookId === bookID)
          {
            bookDetails = booksArray[i];
            break;
          }
        }
      }
      return bookDetails;
    });
}

export function validateUser(userid,scenario,invoketype,bookid,roletypeid,piToken,bookServerURL)
{
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
      else if(response.data)
      {
        const ssoKey = response.data[0].authKey;
        return dispatch({ type: UPDATE_AUTH_KEY, ssoKey });
      }
    });
}

export function getlocaluserID(bookServerURL,globaluserid,type)
{
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

// Load the current page details in redux store
export function loadcurrentPage(bookId,currentPageOrder,pdfpath,pagetype,foxitAssetURL)
{
  let currentPage = {} ;
  if(pdfpath){
    currentPage = {
    bookId,currentPageOrder,pdfpath,pagetype,foxitAssetURL
    };
  }
  return {
    type: LOAD_CURRENT_PAGE,
    payload: currentPage
  };
}

// ------------------------------------
// Action Handlers for every action type which is used above.
// ------------------------------------
const ACTION_HANDLERS = {

  [REQUEST_BOOKMARKS]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      bookmarks: true
    }
  }),
  [RECEIVE_BOOKMARKS]: (state, action) => ({
    ...state,
    bookmarks: action.bookState.bookmarks,
    isFetching: {
      ...state.isFetching,
      bookmarks: action.bookState.isFetching.bookmarks
    }
  }),
  [ADD_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarks: [
      ...state.bookmarks
    ].concat(action.bookmarkList).sort((bkm1, bkm2) => bkm1.uri - bkm2.uri),
    isFetching: {
      ...state.isFetching,
      bookmarks: false
    }
  }),
  [REMOVE_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarks: state.bookmarks.filter(bookmark => bookmark.bkmarkId !== action.bookmarkId),
    isFetching: {
      ...state.isFetching,
      bookmarks: false
    }
  }),
  [REQUEST_HIGHLIGHTS]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      highlights: true
    }
  }),
  [RECIEVE_HIGHLIGHTS]: (state, action) => ({
    ...state,
    annTotalData: action.bookState.highlights,
    isFetching: {
      ...state.isFetching,
      highlights: action.bookState.isFetching.highlights
    }
  }),
  [REMOVE_HIGHLIGHT]: (state, action) => ({
    ...state,
    annTotalData: state.annTotalData.filter(highlight => highlight.id !== action.id),
    isFetching: {
      ...state.isFetching,
      highlights: false
    }
  }),
  [SAVE_HIGHLIGHT]: (state, action) => ({
    ...state,
    annTotalData: [
      ...state.annTotalData
    ].concat(action.highlightList).sort((hl1, hl2) => hl2.time - hl1.time),
    isFetching: {
      ...state.isFetching,
      highlights: false
    }
  }),
  [EDIT_HIGHLIGHT]: (state, action) => ({
    ...state,
    annTotalData: [
      ...state.annTotalData.filter(highlight => highlight.id !== action.highlightObj.id),
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
    ].sort((hl1, hl2) => hl2.time - hl1.time),
    isFetching: {
      ...state.isFetching,
      highlights: false
    }
  }),
  [REQUEST_TOC]: state => ({
    ...state,
    toc : {
      fetching: true,
      fetched: false
    },
    isFetching: {
      ...state.isFetching,
      toc: true
    }
  }),
  [RECEIVE_TOC]: (state, action) => ({
    ...state,
    toc: action.bookState.toc,
    isFetching: {
      ...state.isFetching,
      toc: action.bookState.isFetching.toc
    }
  }),
  [GO_TO_PAGE]: (state, action) => ({
    ...state,
    viewer: {
      ...state.viewer,
      currentPageId: action.pageId
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
  [UPDATE_AUTH_KEY]: (state, action) => ({
    ...state,
    sessionInfo : {
      ssoKey: action.ssoKey
    }
  }),
  [RECEIVE_PAGE_INFO]: (state, action) => ({
    ...state,
    bookinfo: {
      ...state.bookinfo,
      pages: state.bookinfo.pages === undefined ?
        action.bookState.bookInfo.pages : state.bookinfo.pages.concat(action.bookState.bookInfo.pages)
    }
  }),
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
      printWithFooter: action.payload.data[0].generalFeaturesTO.printWithFooter
    }
  }),
  [RECEIVE_BOOK_FEATURES_REJECTED]: state => ({
    ...state,
    bookFeatures: {
      fetching: false,
      fetched: false
    }
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
  }),
  [RECEIVE_GLOSSARY_TERM]: (state,action) => ({
    ...state,
    glossaryInfoList: action.bookState.bookInfo.glossaryInfoList
  }),
  [LOAD_CURRENT_PAGE]: (state,action) => ({
    ...state,
    currentPageInfo : {
      bookId: action.payload.bookId,
      currentPageOrder: action.payload.currentPageOrder,
      pdfpath: { PDFassetURL: action.payload.pdfpath, foxitAssetURL: action.payload.foxitAssetURL},
      pagetype: action.payload.pagetype
    }
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  annotations: [],
  bookmarks: [],
  annTotalData: [],
  regions:[],
  glossaryInfoList:[],
  preferences: {},
  toc: {
    fetching: false,
    fetched: false
  },
  viewer: {},
  isFetching: {
    annotations: false,
    preferences: false,
    bookmarks: false,
    toc: false,
    regions: false,
    viewer: false
  },
  error: null,
  bookFeatures: {
    fetching: false,
    fetched: false
  },
  basepaths: {
    fetching: false,
    fetched: false
  },
  bookinfo: {
    fetching: false,
    fetched: false,
    pages: []
  },
  userInfo: {
    fetching: false,
    fetched: false,
    userid: ''
  },
  sessionInfo: {
    ssoKey:''
  },
  currentPageInfo: {

  }
};

/* Method for calculating the new state for dispatched actions. */
export default function book(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}