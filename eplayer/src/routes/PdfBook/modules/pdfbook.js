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
export const SAVE_HIGHLIGHT = 'SAVE_HIGHLIGHT';
export const REQUEST_HIGHLIGHTS = 'REQUEST_HIGHLIGHTS';
export const RECIEVE_HIGHLIGHTS = 'RECIEVE_HIGHLIGHTS';
export const REMOVE_HIGHLIGHT = 'REMOVE_HIGHLIGHT';

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
    case 'highlights' :
      return {type: REQUEST_HIGHLIGHTS};
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
    return axios.get(''+bookServerURL+'/ebook/ipad/getbookmark?userroleid=2&bookeditionid='+bookEditionID+'&userbookid='+userBookId+'&authkey='+sessionKey+'&outputformat=JSON', 
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
          const bookmarks=bookmarkList.bookMarkList
        bookmarks.forEach((bookmark) => {
          const bmObj = {
            id: bookmark.pageOrder,
            uri: bookmark.pageOrder,
            title: 'Page '+bookmark.bookPageNumber,
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
export function removeHighlight(highlightID, sessionKey, bookServerURL){
  return (dispatch) => {
    dispatch(request('highlights'));
    axios.get(''+bookServerURL+'/ebook/ipad/deleteuserhighlight?highlightid='+highlightID+'&authkey='+sessionKey+'&outputformat=JSON',
    {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 20000
    }).then((response) => {
          if(response.status >= 400){
            console.log(`Error in remove highlight: ${response.statusText}`)
          }
          return response.data
        }).then((highlightResponse) => {
          if(highlightResponse.length){
            highlightResponse.forEach((highlight) =>{
                console.log('------------------------'+highlightID);
                return dispatch({ type: REMOVE_HIGHLIGHT, highlightID })
              
            })
          }
        })
    }
  }
export function saveHighlight(userid,bookid,userbookid,bookeditionid,pageid,bookpagenumber,xcoord,ycoord,width,height,sso,bookServerURL) {
     const bookState = {
    highlightID : ''
  };
    return (dispatch) => {
    dispatch(request('highlights'));
    return axios.get(''+bookServerURL+'/ebook/ipad/saveuserhighlight?userid='+userid+'&bookid='+bookid+'&userroleid=3&userbookid='+userbookid+'&bookeditionid='+bookeditionid+'&roletypeid=3&pageid='+pageid+'&bookpagenumber='+bookpagenumber+'&shareacrosscourse=Y&xcoord='+xcoord+'&ycoord='+ycoord+'&sharewithstudent=Y&width='+width+'&height='+height+'&colorname=Yellow&authkey='+sso+'&outputformat=JSON', {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
     if (response.status >= 400) {
        console.log(`${response.statusText}`);
      }
      return response.data;

    })
    .then((highlightResponse) => {
      if (highlightResponse.length) {
        highlightResponse.forEach((highlights)=>{
        var highLightList = highlights.highLightList;
        highLightList.forEach((highlight) => {
          bookState.highlightID = highlight.highlightID;
          return dispatch({ type: SAVE_HIGHLIGHT, bookState })
        })    
      });
    }
  });
}
 /* return{
  type: 'SAVE_HIGHLIGHT',
  payload: axios.get(''+bookServerURL+'/ebook/ipad/saveuserhighlight?userid='+userid+'&bookid='+bookid+'&userroleid=3&userbookid='+userbookid+'&bookeditionid='+bookeditionid+'&roletypeid=3&pageid='+pageid+'&bookpagenumber='+bookpagenumber+'&shareacrosscourse=Y&xcoord='+xcoord+'&ycoord='+ycoord+'&sharewithstudent=Y&width='+width+'&height='+height+'&colorname=Yellow&authkey='+sso+'&outputformat=JSON')
  };*/
}
export function fetchHighlight(userid,bookId,bookEditionID,listval,sessionKey,bookServerURL) {
  const bookState = {
   highlights: [],
    isFetching: {
      highlights: true
    }
  };
  return (dispatch) => {
    dispatch(request('highlights'));
    return axios.get(''+bookServerURL+'/ebook/ipad/getuserhighlightbypageorder?userid='+userid+'&userroleid=3&bookid='+bookId+'&bookeditionid='+bookEditionID+'&listval='+listval+'&authkey='+sessionKey+'&outputformat=JSON', {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        bookState.isFetching.highlights = false;
        return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
      }
      return response.data;

    })
    .then((highlightResponse) => {
    if (highlightResponse.length) {
        highlightResponse.forEach((highlights) => {
          var highLightList = highlights.highLightList;
          highLightList.forEach((highlight) => {
           const hlObj = {
            id: highlight.highlightID,
            pageIndex: 1,
            highlightHash: "[{\"left\":\""+ highlight.xcoord + "\",\"top\":\""  + highlight.ycoord + "\",\"right\":\""  + highlight.width + "\",\"bottom\":\"" + highlight.height + "\"}]"
           }
          
          bookState.highlights.push(hlObj);
          
         })
        });
      }
      bookState.isFetching.highlights = false;
      return dispatch({ type: RECIEVE_HIGHLIGHTS, bookState });
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
        //bookState.toc.content.list=tocLevel_1_ChildList;
        bookState.toc.content.list=flatten1(tocLevel_1_ChildList);
        console.log();
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
          var tempList=[];
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
export function fetchPageInfo(userid,userroleid,bookid,bookeditionid,pageIndexToLoad,totalPagesToHit,sessionKey,bookServerURL,loadPdfPageCallback)
 {
    const bookState = {
      bookInfo:{
        pages: []
      }
  };
  return(dispatch)=>{
    return axios.get(''+bookServerURL+'/ebook/ipad/getpagebypageorder?userid='+userid+'&userroleid=3&bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+totalPagesToHit+'&authkey='+sessionKey+'&outputformat=JSON',
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
    loadPdfPageCallback(pageIndexToLoad);
    
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
        title:'Page '+action.bookmarkToAdd.bookPageNumber,
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
  [REQUEST_HIGHLIGHTS]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      highlights: true
    }
  }),
  [RECIEVE_HIGHLIGHTS]: (state, action) => ({
    ...state,
    highlights: action.bookState.highlights,
    isFetching: {
      ...state.isFetching,
      highlights: action.bookState.isFetching.highlights
    }
  }),
  [REMOVE_HIGHLIGHT]: (state, action) => ({
    ...state,
    highlights: state.highlights.filter(highlight => highlight.id !== action.highlightID),
    isFetching: {
      ...state.isFetching,
      highlights: false
    }
  }),
  [SAVE_HIGHLIGHT]: (state, action) => ({
    ...state,
    highlightID: action.bookState.highlightID
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
