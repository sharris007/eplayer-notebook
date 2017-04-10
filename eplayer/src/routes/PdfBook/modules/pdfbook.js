import fetch from 'isomorphic-fetch';
import map from 'lodash/map';
import { clients } from '../../../components/common/client';
import axios from 'axios';

// ------------------------------------
// Constants
// ------------------------------------

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

export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const GET = 'GET';

// ------------------------------------
// Actions
// ------------------------------------
export function request(component) {
  switch (component) {
    case 'bookmarks':
      return { type: REQUEST_BOOKMARKS };
    case 'toc':
      return { type: REQUEST_TOC };
    default:
      return {};
  }
}

export function fetchBookmarks(bookId,userBookId,bookEditionID,sessionKey,bookServerURL) {
  const bookState = {
    bookmarks: [],
    isFetching: {
      bookmarks: true
    }
  };
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return axios.get(''+bookServerURL+'/ebook/ipad/getbookmarkreport?userroleid=2&bookeditionid='+bookEditionID+'&userbookid='+userBookId+'&authkey='+sessionKey+'&outputformat=JSON', 
    {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 20000
    })
    .then((response) => {
      if (response.status >= 400) {
        bookState.isFetching.bookmarks = false;
        return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
      }
      return response.data;
    })
    .then((bookmarkResponse) => {
      if (bookmarkResponse.length) {
        bookmarkResponse.forEach((bookmarkList) => {
          const bookmarks=bookmarkList.bookMarkReportList
        bookmarks.forEach((bookmark) => {
          const bmObj = {
            id: bookmark.pageOrder,
            uri: bookmark.pageOrder,
            title: 'Page '+bookmark.pageOrder,
            pageID: bookmark.pageID,
            createdTimestamp: bookmark.updatedDate
          };
          bookState.bookmarks.push(bmObj);
          });
        });
      }
      bookState.isFetching.bookmarks = false;
      return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
    });
  };
}

export function addBookmark(bookId,bookmarkToAdd,bookEditionID,userbookid,pageId,sessionKey,userid,bookServerURL) {
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return axios.get(''+bookServerURL+'/ebook/ipad/setbookmark?userID='+userid+'&userroleid=3&bookeditionid='+bookEditionID+'&listval='+pageId+'&userbookid='+userbookid+'&authkey='+sessionKey+'&outputformat=JSON', 
    {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 20000
    }).then((response) => {
      if (response.status >= 400) {
        console.log(`Add bookmark error: ${response.statusText}`);
      }
      return response.data;
    }).then((bookmarkResponse) => {
      if (bookmarkResponse.length) {
        bookmarkResponse.forEach((bookmark)=>{
            if(bookmark.setbookmark.pageid==pageId)
            {
              return dispatch({ type: ADD_BOOKMARK, bookmarkToAdd })
            }
        });
      }
    });
  };
}

export function removeBookmark(bookId,bookmarkId,bookEditionID,userbookid,pageId,sessionKey,userid,bookServerURL) {
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return axios.get(''+bookServerURL+'/ebook/ipad/resetbookmark?userID='+userid+'&userroleid=3&bookeditionid='+bookEditionID+'&listval='+pageId+'&userbookid='+userbookid+'&authkey='+sessionKey+'&outputformat=JSON', 
    {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 20000
    }).then((response) => {
      if (response.status >= 400) {
        console.log(`Remove bookmark error: ${response.statusText}`);
      }
      return response.data;
    }).then((bookmarkResponse) => {
      if (bookmarkResponse.length) {
         bookmarkResponse.forEach((bookmark)=>{
            if(bookmark.resetbookmark.pageid==pageId)
            {
              return dispatch({ type: REMOVE_BOOKMARK, bookmarkId })
            }
        });
      }
    });
  };
}

export function fetchTocAndViewer(bookId,authorName,title,thumbnail,bookeditionid,sessionKey,bookServerURL){
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
    return axios.get(''+bookServerURL+'/ebook/ipad/getbaskettocinfo?userroleid=2&bookid='+bookId+'&language=en_US&authkey='+sessionKey+'&bookeditionid='+bookeditionid+'&basket=toc', 
    {
      timeout: 20000
    })
    .then((response) => {
    response.data.forEach((allBaskets) =>{
    const basketData = allBaskets.basketsInfoTOList;
      //bookState.toc.content.bookId = basketData[0].bookID || '';
      bookState.toc.content.id = basketData[0].bookID || '';
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
        bookState.toc.content.list=tocLevel_1_ChildList;
        console.log();
        });
      });
      bookState.isFetching.toc = false;
      dispatch({ type: RECEIVE_TOC, bookState });     
      });
    };
  } 

 function Node() {
   this.id =""
   this.title =""
   this.children =[]
   this.urn =""
 }
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

export function goToPage(pageId) {
  return (dispatch) => {
    dispatch({ type: GO_TO_PAGE, pageId });
  };
}

export function fetchBookInfo(bookid,sessionKey,userid,bookServerURL)
{
  return{
  type: 'RECEIVEBOOKINFO',
  payload: axios.get(''+bookServerURL+'/ebook/ipad/getbookinfo?userid='+userid+'&bookid='+bookid+'&userroleid=2&authkey='+sessionKey+'&outputformat=JSON'),
  timeout: 20000
  };
}
export function fetchPageInfo(userid,userroleid,bookid,bookeditionid,pageOrder,sessionKey,bookServerURL)
 {
    const bookState = {
      bookInfo:{
        pages: []
      }
  };
  return(dispatch)=>{
    return axios.get(''+bookServerURL+'/ebook/ipad/getpagebypageorder?userid='+userid+'&userroleid=3&bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+pageOrder+'&authkey='+sessionKey+'&outputformat=JSON',
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
          bookState.bookInfo.pages.push(pageObj);
        });
      });
    }
    dispatch({ type: 'RECEIVE_PAGE_INFO',bookState});
    });
  };

 }

 export function fetchUserInfo(globaluserid, bookid, uid, ubd, ubsd, sessionKey,bookServerURL)
  {
    return{
    type: 'RECEIVE_USER_INFO',
    payload: axios.get(''+bookServerURL+'/ebook/ipad/synchbookwithbookshelfserverdata?globaluserid='+globaluserid+'&bookid='+bookid+'&uid='+ubd+'&ubd='+ubd+'&ubsd='+ubsd+'&authkey='+sessionKey+''),
    timeout: 20000
    };
  }

 
// ------------------------------------
// Action Handlers
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
        id: action.bookmarkToAdd.id,
        uri: action.bookmarkToAdd.uri,
        title:'Page '+action.bookmarkToAdd.uri,
        pageID: action.bookmarkToAdd.pageID,
        createdTimestamp: action.bookmarkToAdd.createdTimestamp
      }
    ].sort(function(bkm1, bkm2){return bkm1.uri-bkm2.uri}),
    isFetching: {
      ...state.isFetching,
      bookmarks: false
    }
  }),
  [REMOVE_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarks: state.bookmarks.filter(bookmark => bookmark.uri !== action.bookmarkId),
    isFetching: {
      ...state.isFetching,
      bookmarks: false
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
                  bookid: action.payload.data[0].userBookTOList[0].bookID,
                  bookeditionid: action.payload.data[0].userBookTOList[0].bookEditionID
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
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  annotations: [],
  bookmarks: [],
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

export default function book(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
