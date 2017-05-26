import fetch from 'isomorphic-fetch'; /* isomorphic-fetch is third party library used for making ajax call like axios. */
import map from 'lodash/map'; /* lodash is a JavaScript utility library delivering modularity, performance and map is method used for iterating the array or object. */
import { clients } from '../../../components/common/client'; /* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import Hawk from 'hawk';
import find from 'lodash/find';

// ------------------------------------
// Constants
// ------------------------------------

// Created Action Constant for BOOKMARKS, TOC, GO_TO_PAGE and so on. 
export const REQUEST_BOOKMARKS = 'REQUEST_BOOKMARKS';
export const RECEIVE_BOOKMARKS = 'RECEIVE_BOOKMARKS';
export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';
export const REQUEST_TOC = 'REQUEST_TOC';
export const RECEIVE_TOC = 'RECEIVE_TOC';
export const GO_TO_PAGE = 'GO_TO_PAGE';
export const RECEIVEBOOKINFO_PENDING = 'RECEIVEBOOKINFO_PENDING';
export const RECEIVEBOOKINFO_REJECTED = 'RECEIVEBOOKINFO_REJECTED';
export const RECEIVEBOOKINFO_FULFILLED = 'RECEIVEBOOKINFO_FULFILLED';
export const RECEIVE_PAGE_INFO = 'RECEIVE_PAGE_INFO';
export const RECEIVE_USER_INFO_PENDING = 'RECEIVE_USER_INFO_PENDING';
export const RECEIVE_USER_INFO_REJECTED = 'RECEIVE_USER_INFO_REJECTED';
export const RECEIVE_USER_INFO_FULFILLED = 'RECEIVE_USER_INFO_FULFILLED';
export const SAVE_HIGHLIGHT = 'SAVE_HIGHLIGHT';
export const REQUEST_HIGHLIGHTS = 'REQUEST_HIGHLIGHTS';
export const RECIEVE_HIGHLIGHTS = 'RECIEVE_HIGHLIGHTS';
export const REMOVE_HIGHLIGHT = 'REMOVE_HIGHLIGHT';
export const LOAD_ASSERT_URL = 'LOAD_ASSERT_URL';
export const EDIT_HIGHLIGHT = 'EDIT_HIGHLIGHT';

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
      return {type: REQUEST_HIGHLIGHTS};
    default:
      return {};
  }
}

/* Method for fetching the bookmarks from Redaer Api by passing the below parameters. */
export function fetchBookmarksUsingReaderApi(bookId,shared,courseId,userId,Page) {
  const bookState = {
    bookmarks: [],
    isFetching: {
      bookmarks: true
    }
  };
  const authorizationHeaderVal = createAuthorizationToken('/bookmark?includeShared='+shared+'&userId='+userId+'&bookId='+bookId+'&courseId='+courseId, 'GET')
  
  /* Dispatch is part of middleware used to dispatch the action, usually used in Asynchronous Ajax call.*/
  return (dispatch) => {
    dispatch(request('bookmarks'));

    return clients.readerApi.get('/bookmark?includeShared='+shared+'&userId='+userId+'&bookId='+bookId+'&courseId='+courseId,{
      headers : {
        'Accept' : 'application/json',
        'Authorization' : authorizationHeaderVal
      }
    }).then((response) => {
      if (response.status >= 400) {
        bookState.isFetching.bookmarks = false;
        return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
      }
      return response.data;
    })
    .then((bookmarkResponse) => {
      if (bookmarkResponse.data.length) {
        bookmarkResponse.data.forEach((bookmark) => {
          var date = new Date(bookmark.updatedTime*1000);
          var extID = Number(bookmark.externalId);
          
          const bmObj={
            id : extID,
            bkmarkId : bookmark.id,
            userId : bookmark.userId,
            bookId : bookmark.bookId,
            pageId : bookmark.pageId,
            pageNo : bookmark.pageNo,
            createdTimestamp : date,
            title: Page + ' ' + bookmark.pageNo,
            uri: extID,
            externalId: extID
        };
        bookState.bookmarks.push(bmObj);
        })
      }
      bookState.bookmarks.sort(function(bkm1,bkm2) {return bkm1.uri - bkm2.uri}); 
      bookState.isFetching.bookmarks = false;
      return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
    });
  };
}

/* Created action creator for addBookmarkUsingReaderApi. */
export function addBookmarkUsingReaderApi(userId,bookId,pageId,pageNo,externalId,courseId,shared,Page) {

const authorizationHeaderVal = createAuthorizationToken('/bookmark', 'POST')

clients.readerApi.defaults.headers.Authorization = authorizationHeaderVal;

var data = {
      "userId" : userId,
      "bookId" : bookId,
      "pageId" : pageId,
      "pageNo" : pageNo,
      "courseId" : courseId,
      "shared" : shared,
      "externalId" : externalId
  }

var bmObj;

return (dispatch) => {
    dispatch(request('bookmarks'));

    return clients.readerApi.post('/bookmark', data)
    .then((response) => {
      if (response.status >= 400) {
       console.log(`Add bookmark error: ${response.statusText}`);
      }
      return response.data;
    }).then((bookmarkResponse) => {
      if (bookmarkResponse != undefined) {
        
        var date = new Date(bookmarkResponse.updatedTime*1000);
        var extID = Number(bookmarkResponse.externalId);
        
            bmObj={
            id : extID,
            bkmarkId : bookmarkResponse.id,
            userId : bookmarkResponse.userId,
            bookId : bookmarkResponse.bookId,
            pageId : bookmarkResponse.pageId,
            pageNo : bookmarkResponse.pageNo,
            createdTimestamp : date,
            title: Page + ' ' + bookmarkResponse.pageNo,
            uri: extID,
            externalId: extID
        };
      }
      return dispatch({ type: ADD_BOOKMARK, bmObj });
    });
  };
}


/* Method for deleting the selected bookmark. */
export function removeBookmarkUsingReaderApi(bookmarkId) {

const bookState = {
    bookmarks: [],
    isFetching: {
      bookmarks: true
    }
  };

const authorizationHeaderVal = createAuthorizationToken('/bookmark/'+bookmarkId, 'DELETE');

return (dispatch) => {
    dispatch(request('bookmarks'));
    return clients.readerApi.delete('/bookmark/'+bookmarkId,{
      headers : {
        'Authorization' : authorizationHeaderVal
      }
  }).then((response) => {
      if (response.status >= 400) {
        console.log(`Error in remove bookmark: ${response.statusText}`)
      }
      else{
            return dispatch({ type: REMOVE_BOOKMARK, bookmarkId })
          }
    })
  }
}



/* Method for fetching Toc list by passing following parameters. */
export function fetchTocAndViewer(bookId,authorName,title,thumbnail,bookeditionid,sessionKey,bookServerURL,hastocflatten,roleTypeID){
  const bookState = {
    toc: {
      content: {},
      child:[]
    },
    viewer: {},
    isFetching: {
      toc: true,
      viewer: true
    },
    childern:{}
  };
  return(dispatch) => {
    dispatch(request('toc'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    return axios.get(''+bookServerURL+'/ebook/ipad/getbaskettocinfo?userroleid='+roleTypeID+'&bookid='+bookId+'&language=en_US&authkey='+sessionKey+'&bookeditionid='+bookeditionid+'&basket=toc', 
    {
      timeout: 20000
    })
    .then((response) => {
    response.data.forEach((allBaskets) =>{
    const basketData = allBaskets.basketsInfoTOList;
      //bookState.toc.content.bookId = basketData[0].bookID || '';
      bookState.toc.content.id = basketData[0].bookID || '';
      //bookState.toc.showDuplicateTitle = true;
      bookState.toc.content.mainTitle = title || 'Sample Title';
      bookState.toc.content.author = authorName || 'Saha/Rai/Mahapatra/Pujari';
      bookState.toc.content.thumbnail = thumbnail || 'http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM21254346/assets/1256799653_Iannone_thumbnail.png';
      var output = new Node();
      bookState.toc.content.list = [];
      basketData.forEach((tocLevel_1,i) => {
        const tocLevel_1_ChildData=tocLevel_1.document;
        let tocLevel_1_ChildList=[];
        tocLevel_1_ChildData.forEach((tocLevel_2,j) => {
          const tocLevel_2_ChildData=tocLevel_2.bc.b.be;
          if(tocLevel_2_ChildData.length===undefined)
          {
            var childList = construct_tree(tocLevel_2_ChildData);
            tocLevel_1_ChildList.push(childList);
          }
          else
          {
          tocLevel_2_ChildData.forEach((tocLevel_3,k) =>{
            var childList = construct_tree(tocLevel_3);
            tocLevel_1_ChildList.push(childList);

          });
        }
          });
        /*var tocLevel_1_Obj = new Node();
        tocLevel_1_Obj.id=tocLevel_1.basketID;
        tocLevel_1_Obj.title=tocLevel_1.name;
        tocLevel_1_Obj.children=tocLevel_1_ChildList;*/
        
        if(hastocflatten === "Y")
        {
          bookState.toc.content.list=flatten1(tocLevel_1_ChildList);
        }
        else{
          bookState.toc.content.list=tocLevel_1_ChildList;
        }

        //bookState.toc.content.list=tocLevel_1_ChildList;
        //bookState.toc.content.list=flatten1(tocLevel_1_ChildList);
        
        });
      });
      bookState.isFetching.toc = false;
      dispatch({ type: RECEIVE_TOC, bookState });     
      });
    };
  } 
 function flatten1(input)
  {
    var finalChildList = [];
    input.forEach((node,i) =>{
      if(node.children.length!==0)
        {
          var child1=[];
          var firstNode = new Node();
          firstNode.id =node.id;
          firstNode.title =node.title;
          firstNode.urn =node.urn;
          child1.push(firstNode);
          finalChildList = finalChildList.concat(node);
          node.children.forEach((kids,j) => {
          var child=flatten2(kids,finalChildList);
          if(child instanceof Array)
          {
            finalChildList = child;
          }
          else
          {
            child1.push(child);
          }
        });
        for(var i=0;i<finalChildList.length;i++)
          {
            if(node.id==finalChildList[i].id && node.urn==finalChildList[i].urn && node.title==finalChildList[i].title)
              {
            break;
              }
          }
          finalChildList[i].children = child1;
        }
        else
        {
          finalChildList.push(node);
        }
       });
    return finalChildList;
  }
  function flatten2(input,finalChildList)
  {
   if(input.children!==undefined && input.children.length!==0) 
   {
    return flatten3(input,finalChildList);
   }
   else
   {
    return input;
   }
  }
  function flatten3(input,finalChildList)
  {
    var childlist=[];
    if(input.children!==undefined && input.children.length!==0) 
    {
      var firstNode = new Node();
      firstNode.id =input.id;
      firstNode.title =input.title;
      firstNode.urn =input.urn;
      childlist.push(firstNode);
      finalChildList = finalChildList.concat(input);
      input.children.forEach((node,i) =>{
          var templist = flatten3(node,finalChildList);
          if(templist instanceof Array)
          {
            finalChildList = templist;
          }
          else
          {
            childlist=childlist.concat(templist);
          }
          
       });
      for(var i=0;i<finalChildList.length;i++)
       {
        if(input.id==finalChildList[i].id && input.urn==finalChildList[i].urn && input.title==finalChildList[i].title)
        {
          break;
        }
      }
      finalChildList[i].children = childlist;
    }
    else 
    {
      var output = new Node();
      output.id =input.id;
      output.title =input.title;
      output.children =input.children;
      output.urn =input.urn; 
      return output;
    }
    return finalChildList;
  }
/* Method for creating node in Toc. */
 function Node() {
   this.id =""
   this.title =""
   this.children =[]
   this.urn =""
 }
/* Method for constructing tree for Toc. */ 
 function construct_tree(input){
       var output = new Node();
       output.id = input.i;
       output.title = input.n;
       if(input.lv!==undefined)
       {
        output.urn=input.lv.pageorder;
       }
       if(input.be!==undefined)
       {
       if(input.be.length===undefined)
       {
          output.children.push(
            construct_tree(input.be));
       }
       else
       {
        input.be.forEach((node,i) =>{
          output.children.push(
               construct_tree(node));
       });
       }
     }
    return output;
}
/* Created Action creator for navigating the different pages from current page. */
export function goToPage(pageId) {
   // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
  return (dispatch) => {
    dispatch({ type: GO_TO_PAGE, pageId });
  };
}

/* Created Action creator for fetching all book detail. */
export function fetchBookInfo(bookid,sessionKey,userid,bookServerURL,roleTypeID)
{
  if (roleTypeID === undefined)
  {
      roleTypeID = 2
  }
  
   // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
  return{
  type: 'RECEIVEBOOKINFO',
  payload: axios.get(''+bookServerURL+'/ebook/ipad/getuserbookinfo?userid='+userid+'&bookid='+bookid+'&userroleid='+roleTypeID+'&authkey='+sessionKey+'&outputformat=JSON'),
  timeout: 20000
  };
}
/* Created Action creator for getting page details. */
export function fetchPageInfo(userid,userroleid,bookid,bookeditionid,pageIndexToLoad,totalPagesToHit,sessionKey,bookServerURL,loadPdfPageCallback,roleTypeID)
 {
    const bookState = {
      bookInfo:{
        pages: []
      }
  };
  return(dispatch)=>{
     // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    return axios.get(''+bookServerURL+'/ebook/ipad/getpagebypageorder?userid='+userid+'&userroleid='+roleTypeID+'&bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+totalPagesToHit+'&authkey='+sessionKey+'&outputformat=JSON',
    {
      timeout: 20000
    })
    .then((response) => {
      if (response.status >= 400) {
        console.log(`FetchPage info error: ${response.statusText}`);
      } else if(response.data.length) {
        response.data.forEach((jsonData) =>{
          const pages =jsonData.viewerPageInfoRestTO;
          pages.forEach((page) =>{
            const pageObj={

            };
          pageObj.pageid=page.pageID;
          pageObj.bookid=page.bookID;
          pageObj.pagenumber=page.bookPageNumber;
          pageObj.thumbnailpath=page.thumbnailFilePath;
          pageObj.pageorder=page.pageOrder;
          pageObj.bookeditionid=page.bookEditionID;
          pageObj.chaptername=page.chapterName;
          pageObj.isbookmark=page.isBookmark;
          pageObj.pdfPath=page.pdfPath;
          bookState.bookInfo.pages.push(pageObj);
        });
      });
    }
    dispatch({ type: 'RECEIVE_PAGE_INFO',bookState});
    //loadPdfPageCallback(pageIndexToLoad);
    
    });
  };

 }
 /* Created Action creator for fetching user information. */
 export function fetchUserInfo(globaluserid, bookid, uid, ubd, ubsd, sessionKey,bookServerURL)
  {
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    return{
    type: 'RECEIVE_USER_INFO',
    payload: axios.get(''+bookServerURL+'/ebook/ipad/synchbookwithbookshelfserverdata?globaluserid='+globaluserid+'&bookid='+bookid+'&uid='+ubd+'&ubd='+ubd+'&ubsd='+ubsd+'&authkey='+sessionKey+''),
    timeout: 20000
    };
  }
  function createAuthorizationToken(relativeURL,method){
    const credentials = {
      id: 'tArkNWL2dK',
      key: 'Fc0C9w05bZy6U9TB7wN6CBgKyM32yk6Q',
      algorithm: 'sha256'
    }
 
   var randomString = function(length) {
       var text = "";
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
       for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
       }
       return text;
   }
   var baseUrl = clients.readerApi.defaults.baseURL;
   var uri = baseUrl + relativeURL; 
   const header = Hawk.client.header(uri, method, { credentials: credentials, ext: '', timestamp: Math.round(Date.now()/1000), nonce: randomString(6)});
   const authorizationVal = header.field;

const authorizationHeaderVal = authorizationVal.replace("Hawk id=","ReaderPlus key=");
return authorizationHeaderVal;
}

/* Created Action creator for feching highlight details from Reader Api. */
export function fetchHighlightUsingReaderApi(userId,bookId,pageId,shared,courseId){

const bookState = {
   highlights: [],
    isFetching: {
      highlights: true
    }
  };

  //var uri = 'https://api-sandbox.readerplatform.pearson-intl.com/highlight?includeShared=true&userId='+userId+'&bookId='+bookId+'&pageId='+pageId;
  const authorizationHeaderVal = createAuthorizationToken('/highlight?includeShared='+shared+'&limit=100&userId='+userId+'&bookId='+bookId+'&courseId='+courseId, 'GET')
  console.log("Authorization : "+ authorizationHeaderVal);
  return (dispatch) => {
    dispatch(request('highlights'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    return clients.readerApi.get('/highlight?includeShared='+shared+'&limit=100&userId='+userId+'&bookId='+bookId+'&courseId='+courseId+'&pageId='+pageId,{
      headers : {
        'Authorization' : authorizationHeaderVal
      }
    }).then((response) =>{
     if (response.status >= 400) {
        bookState.isFetching.highlights = false;
        return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
      }
      return response.data;
   }).then((response) => {
    if(response.data.length){
       response.data.forEach((highlight) => {
        var hlObj={

        }
        var time = new Date(highlight.updatedTime*1000);
        var pageid = Number(highlight.pageId);
        hlObj.userId = highlight.userId;
        hlObj.bookId = highlight.bookId;
        hlObj.pageId = pageid;
        hlObj.courseId = highlight.courseId;
        hlObj.shared = highlight.shared;
        hlObj.highlightHash = highlight.highlightHash;
        hlObj.comment = highlight.note;
        hlObj.text = highlight.selectedText;
        hlObj.color = highlight.colour;
        hlObj.id = highlight.id;
        hlObj.pageNo = highlight.pageNumber;
        hlObj.meta = highlight.meta;
        hlObj.author = highlight.meta.author;
        hlObj.creationTime = highlight.creationTime;
        hlObj.time = time;
        hlObj.pageIndex = 1;        //For Foxit

        bookState.highlights.push(hlObj);
      })
    }
    bookState.highlights.sort(function(hl1,hl2) {return hl2.time - hl1.time});
    bookState.isFetching.highlights = false;
    return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
  })

  }

}
/* Method for saving the highLight selected by user. */
export function saveHighlightUsingReaderApi(userId,bookId,pageId,pageNo,courseId,shared,highlightHash,note,selectedText,colour,meta,currentPageId){
  
  const authorizationHeaderVal = createAuthorizationToken('/highlight', 'POST')
  console.log("Authorization : "+ authorizationHeaderVal);
  var axiosInstance = clients.readerApi;
  axiosInstance.defaults.headers.Authorization = authorizationHeaderVal;
  var data = {
      "userId" : userId,
      "bookId" : bookId,
      "pageId" : currentPageId,
      "pageNo" : pageNo,
      "courseId" : courseId,
      "shared" : shared,
      "highlightHash" : highlightHash,
      "note" : note,
      "selectedText" : selectedText,
      "colour" : colour,
      "meta" : meta,
      "highlightEngine" : "eT1PDFPlayer"
  }
  return (dispatch) => {
    dispatch(request('highlights'));
    return axiosInstance.post(`/highlight`, data).then((response) => {
      if(response.status >= 400){
        console.log(`error: ${response.statusText}`);
      }
      return response.data;
    }).then((highlightResponse) => {
      var hlObj;
       if(highlightResponse !== undefined){
        var time = new Date(highlightResponse.updatedTime*1000);
        var extID = Number(highlightResponse.externalId);
        var pageid = Number(highlightResponse.pageId);
        hlObj = {
        userId : highlightResponse.userId,
        bookId : highlightResponse.bookId,
        pageId : pageid,
        courseId : highlightResponse.courseId,
        shared : highlightResponse.shared,
        highlightHash : highlightResponse.highlightHash,
        comment : highlightResponse.note,
        text : highlightResponse.selectedText,
        color : highlightResponse.colour,
        id : highlightResponse.id,
        pageNo : highlightResponse.pageNo,
        meta : highlightResponse.meta,
        author : highlightResponse.meta.author,
        creationTime : highlightResponse.creationTime,
        time : time,
        pageIndex : 1       //For Foxit
        }
       }
       dispatch({type : 'SAVE_HIGHLIGHT', hlObj});
    })
  }

}
/* Removing highLight from the page for selected area. */
export function removeHighlightUsingReaderApi(id) {
  const authorizationHeaderVal = createAuthorizationToken('/highlight/'+id , 'DELETE');
  console.log("Authorization : "+ authorizationHeaderVal);
  return (dispatch) => {
    dispatch(request('highlights'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
   /* return axios({
      method : 'delete',
      url : 'https://api-sandbox.readerplatform.pearson-intl.com/highlight/'+id,
      headers : {
        Accept : 'application/json',
        Authorization : authorizationHeaderVal 
      }
    })*/return clients.readerApi.delete('/highlight/'+id,{
      headers : {
        'Authorization' : authorizationHeaderVal
      }
    }).then((response) => {
       if(response.status >= 400){
            console.log(`Error in remove highlight: ${response.statusText}`)
          }
          else{
            return dispatch({ type: REMOVE_HIGHLIGHT, id })
          }
    })
  }
}
export function loadAssertUrl(totalPagesToHit, openFile, storeAssertUrl, pages, assertUrls){
  var bookState = {
    bookInfo : {
      assertUrls : []
    }
  }
  return(dispatch) => {
    var pagesToHit  = totalPagesToHit.split(',');
    console.log("totalPagesToHit  "+ pagesToHit );
    for (var i = 0; i < pagesToHit.length; i++){
       var urlObj = {

      }
      if(pagesToHit[i] !== ''){
        const currentPage = find(pages, page => page.pageorder == parseInt(pagesToHit[i]));
       //const assertUrlObj = find(assertUrls, obj => obj.pageOrder == currentPage.pageorder);
        //if(assertUrlObj == undefined)
              // {   
                    urlObj.pageOrder = currentPage.pageorder;
                    urlObj.pageNumber = currentPage.pagenumber;
                    urlObj.assertUrl = openFile(currentPage.pageorder,currentPage.pdfPath);
                    bookState.bookInfo.assertUrls.push(urlObj);
  
               // }
      }
    }
    dispatch({type : 'LOAD_ASSERT_URL', bookState});
    storeAssertUrl();
  }
 }

export function editHighlightUsingReaderApi(id,note,colour,isShared) {
  var editHightlightURI = '/highlight/'+id;
  var data = {

  };
  if(note!=undefined)
  {
    data.note = note;
  }
  if(colour != undefined)
  {
    data.colour = colour;
  }
  if(isShared != undefined)
  {
     data.shared = isShared;
  }
  const authorizationHeaderVal = createAuthorizationToken(editHightlightURI , 'PUT');
  return (dispatch) => {
  dispatch(request('highlights'));
  return clients.readerApi.put(editHightlightURI,data,{
      headers : {
        'Authorization' : authorizationHeaderVal
      }
    }).then((response) => {
       if(response.status >= 400){
            console.log(`Error in edit highlight: ${response.statusText}`)
          }
          return response.data;
    }).then((highlightResponse) => {
            var highlightObj;
            if(highlightResponse !== undefined){
            var time = new Date(highlightResponse.updatedTime*1000);
            var pageid = Number(highlightResponse.pageId);
            highlightObj = {
              userId : highlightResponse.userId,
              bookId : highlightResponse.bookId,
              pageId : pageid,
              courseId : highlightResponse.courseId,
              shared : highlightResponse.shared,
              highlightHash : highlightResponse.highlightHash,
              comment : highlightResponse.note,
              text : highlightResponse.selectedText,
              color : highlightResponse.colour,
              id : highlightResponse.id,
              pageNo : highlightResponse.pageNo,
              meta : highlightResponse.meta,
              author : highlightResponse.meta.author,
              creationTime : highlightResponse.creationTime,
              time : time,
              pageIndex : 1      
              };
            }
            return dispatch({ type: EDIT_HIGHLIGHT, highlightObj });
    });
  }
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
      ...state.bookmarks,
      {
        id: action.bmObj.id,
        uri: action.bmObj.uri,
        title: action.bmObj.title,
        pageID: action.bmObj.pageId,
        createdTimestamp: action.bmObj.createdTimestamp,
        externalId: action.bmObj.externalId,
        bkmarkId: action.bmObj.bkmarkId
      }
    ].sort(function(bkm1, bkm2){return bkm1.uri-bkm2.uri}),
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
      ...state.annTotalData,
      {
        userId : action.hlObj.userId,
        bookId : action.hlObj.bookId,
        pageId : action.hlObj.pageId,
        author : action.hlObj.author,
        courseId : action.hlObj.courseId,
        shared : action.hlObj.shared,
        highlightHash : action.hlObj.highlightHash,
        comment : action.hlObj.comment,
        text : action.hlObj.text,
        color : action.hlObj.color,
        id : action.hlObj.id,
        pageNo : action.hlObj.pageNo,
        meta : action.hlObj.meta,
        creationTime : action.hlObj.creationTime,
        time : action.hlObj.time,
        pageIndex : action.hlObj.pageIndex
      }
    ].sort(function(hl1,hl2) {return hl2.time - hl1.time}),
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
        userId : action.highlightObj.userId,
        bookId : action.highlightObj.bookId,
        pageId : action.highlightObj.pageId,
        author : action.highlightObj.author,
        courseId : action.highlightObj.courseId,
        shared : action.highlightObj.shared,
        highlightHash : action.highlightObj.highlightHash,
        comment : action.highlightObj.comment,
        text : action.highlightObj.text,
        color : action.highlightObj.color,
        id : action.highlightObj.id,
        pageNo : action.highlightObj.pageNo,
        meta : action.highlightObj.meta,
        creationTime : action.highlightObj.creationTime,
        time : action.highlightObj.time,
        pageIndex : action.highlightObj.pageIndex
      }
    ].sort(function(hl1,hl2) {return hl2.time - hl1.time}),
    isFetching: {
      ...state.isFetching,
      highlights: false
    }
  }),
  [REQUEST_TOC]: state => ({
    ...state,
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
  [RECEIVEBOOKINFO_PENDING]: (state, action) => ({
    ...state,
    bookinfo: {
            fetching:true,
            fetched:false
              }
  }),
  [RECEIVEBOOKINFO_FULFILLED]: (state, action) => ({
    ...state,
    bookinfo: {
            fetching:false,
            fetched:true,
             userbook:{
              userbookid: action.payload.data[0].userBookTOList[0].userBookID
                      },
               book:{
                  globalbookid: action.payload.data[0].userBookTOList[0].globalBookID,
                  numberOfPages: action.payload.data[0].userBookTOList[0].numberOfPages,
                  bookid: action.payload.data[0].userBookTOList[0].bookID,
                  bookeditionid: action.payload.data[0].userBookTOList[0].bookEditionID,
                  hastocflatten: action.payload.data[0].userBookTOList[0].hastocflatten,
                  languageid: action.payload.data[0].userBookTOList[0].languageID,
                  roleTypeID: action.payload.data[0].userBookTOList[0].roleTypeID
                  }
              }
  }),
  [RECEIVEBOOKINFO_REJECTED]: (state, action) => ({
    ...state,
    bookinfo: {
            fetching:false,
            fetched:false
              }
  }),
  [RECEIVE_PAGE_INFO]:  (state, action) => ({
    ...state,
    bookinfo: {
            ...state.bookinfo,
            pages: state.bookinfo.pages===undefined ? action.bookState.bookInfo.pages : state.bookinfo.pages.concat(action.bookState.bookInfo.pages)
              }
  }),
  [RECEIVE_USER_INFO_PENDING]: (state, action) => ({
    ...state,
    userInfo: {
            fetching:true,
            fetched:false
              }
  }),
  [RECEIVE_USER_INFO_FULFILLED]:  (state, action) => ({
    ...state,
    userInfo: {
            fetching:false,
            fetched:true,
            //...state.userInfo,
            userid: action.payload.data[0].userid
              }
  }),
  [RECEIVE_USER_INFO_REJECTED]: (state, action) => ({
    ...state,
    userInfo: {
            fetching:false,
            fetched:false
              }
  }),
  [LOAD_ASSERT_URL]:  (state, action) => ({
    ...state,
    bookinfo: {
            ...state.bookinfo,
            assertUrls: state.bookinfo.assertUrls===undefined ? action.bookState.bookInfo.assertUrls : state.bookinfo.assertUrls.concat(action.bookState.bookInfo.assertUrls)
              }
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  annotations: [],
  bookmarks: [],
  annTotalData : [],
  preferences: {},
  toc: {},
  viewer: {},
  isFetching: {
    annotations: false,
    preferences: false,
    bookmarks: false,
    toc: false,   
    viewer: false
  },
  error: null,
  bookinfo: {
    fetching:false,
    fetched:false,
    pages: []
  },
  userInfo: {
    fetching:false,
    fetched:false,
    userid : ""
  }
};

/* Method for calculating the new state for dispatched actions. */
export default function book(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
