import book from '../../../src/routes/Book/modules/book';
import {REQUEST_BOOKMARKS, RECEIVE_BOOKMARKS, ADD_BOOKMARK, REMOVE_BOOKMARK, REQUEST_TOC, 
  RECEIVE_TOC, GO_TO_PAGE, RECEIVEBOOKINFO_PENDING, RECEIVEBOOKINFO_REJECTED, RECEIVEBOOKINFO_FULFILLED, 
  RECEIVE_PAGE_INFO, RECEIVE_USER_INFO_PENDING, RECEIVE_USER_INFO_REJECTED, RECEIVE_USER_INFO_FULFILLED, 
  SAVE_HIGHLIGHT, REQUEST_HIGHLIGHTS, RECIEVE_HIGHLIGHTS, REMOVE_HIGHLIGHT, EDIT_HIGHLIGHT, 
  REQUEST_REGIONS, RECEIVE_REGIONS, RECEIVE_BOOK_FEATURES_PENDING, RECEIVE_BOOK_FEATURES_FULFILLED, 
  RECEIVE_BOOK_FEATURES_REJECTED, RECEIVE_GLOSSARY_TERM, RECEIVE_BASEPATH_PENDING, 
  RECEIVE_BASEPATH_FULFILLED, RECEIVE_BASEPATH_REJECTED, UPDATE_AUTH_KEY, RECEIVEBOOKINFO_FAILED} from '../../../src/routes/PdfBook/modules/pdfbook';
const reducer = require('../../../src/routes/PdfBook/modules/pdfbook').default;
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
  }
};
function test1(actionType,expectedActionType,expectedState,actionObj){
  it(actionType+' Should export as a constant',()=>{
    expect(actionType).to.equal(expectedActionType)
  })
  it('should return the updated state for action type '+actionType,() => {
    let newState = book(initialState, actionObj);
    expect(newState).to.deep.equal(expectedState);
  })
}

describe("PdfBook (Reducer)", () => {
  
  //RECEIVE_BOOKMARKS
  let expectedState = Object.assign({},initialState);
  expectedState.bookmarks = [];
  expectedState.isFetching.bookmarks = false;
  let action = {
    type : RECEIVE_BOOKMARKS,
      bookState : {
        bookmarks : [],
        isFetching : {
          bookmarks : false
        }
      }
    }
  test1(RECEIVE_BOOKMARKS,'RECEIVE_BOOKMARKS',expectedState,action);

  //REQUEST_HIGHLIGHTS
  expectedState.isFetching.highlights = true;
  action = {
    type: REQUEST_HIGHLIGHTS,
    isFetching : {
      highlights : true
    }
  }
  test1(REQUEST_HIGHLIGHTS,'REQUEST_HIGHLIGHTS',expectedState,action);

  //RECIEVE_HIGHLIGHTS
  expectedState.isFetching.highlights = [];
  action = {
    type: RECIEVE_HIGHLIGHTS,
  }
  test1(RECIEVE_HIGHLIGHTS,'RECIEVE_HIGHLIGHTS',expectedState,action);

  //REMOVE_BOOKMARK
  expectedState.bookmarks = [];
  expectedState.isFetching.bookmarks = false;
  action = {
    type : REMOVE_BOOKMARK,
    isFetching : {
      bookmarks : false
    }
  }
  test1(REMOVE_BOOKMARK,'REMOVE_BOOKMARK',expectedState,action);

  //REMOVE_HIGHLIGHT
  expectedState.annTotalData = [];
  expectedState.isFetching.highlights = false;
  action = {
    type : REMOVE_HIGHLIGHT,
    isFetching : {
      highlights : []
    }
  }
  test1(REMOVE_HIGHLIGHT,'REMOVE_HIGHLIGHT',expectedState,action);

  //REQUEST_TOC
  expectedState.isFetching.toc = true;
  action = {
    type : REQUEST_TOC,
  }
  test1(REQUEST_TOC,'REQUEST_TOC',expectedState,action);

  //RECEIVEBOOKINFO_PENDING
  expectedState.bookinfo.fetching = true;
  expectedState.bookinfo.fetched = false;
  action = {
    type : RECEIVEBOOKINFO_PENDING,
    bookinfo : {
      fetching : true,
      fetched : false
    }
  }
  test1(RECEIVEBOOKINFO_PENDING,'RECEIVEBOOKINFO_PENDING',expectedState,action);

  //RECEIVEBOOKINFO_FAILED
  expectedState.bookinfo.fetching = false;
  expectedState.bookinfo.fetched = false;
  action = {
    type : RECEIVEBOOKINFO_FAILED
  }
  test1(RECEIVEBOOKINFO_FAILED,'RECEIVEBOOKINFO_FAILED',expectedState,action);

  //UPDATE_AUTH_KEY
  expectedState.sessionInfo.ssoKey = [];
  action = {
    type : UPDATE_AUTH_KEY,
    sessionInfo : {
      ssoKey : []
    }
  }
  test1(UPDATE_AUTH_KEY,'UPDATE_AUTH_KEY',expectedState,action);

  //RECEIVE_USER_INFO_PENDING
  expectedState.userInfo.fetching = true;
  expectedState.userInfo.fetched = false;
  action = {
    type : RECEIVE_USER_INFO_PENDING,
    userInfo : {
      fetching : true,
      fetched : false
    }
  }
  test1(RECEIVE_USER_INFO_PENDING,'RECEIVE_USER_INFO_PENDING',expectedState,action);

  //RECEIVE_USER_INFO_FULFILLED
  expectedState.userInfo.fetching = false;
  expectedState.userInfo.fetched = true;
  expectedState.userInfo.userid = [];
  action = {
    type : RECEIVE_USER_INFO_FULFILLED,
    userInfo : {
      fetching : false,
      fetched : true,
      userid : []
    }
  }
  test1(RECEIVE_USER_INFO_FULFILLED,'RECEIVE_USER_INFO_FULFILLED',expectedState,action);

  //REQUEST_REGIONS
  expectedState.isFetching.regions = true;
  action = {
    type : REQUEST_REGIONS,
    isFetching : {
      regions : true
    }
  }
  test1(REQUEST_REGIONS,'REQUEST_REGIONS',expectedState,action);

  //RECEIVE_REGIONS
  expectedState.regions = [];
  expectedState.isFetching.regions = [];
  action = {
    type : RECEIVE_REGIONS,
    regions : [],
    isFetching : {
      regions : []
    }
  }
  test1(RECEIVE_REGIONS,'RECEIVE_REGIONS',expectedState,action);

  //RECEIVE_BASEPATH_PENDING
  expectedState.basepaths.fetching = true;
  expectedState.basepaths.fetched = false;
  action = {
    type : RECEIVE_BASEPATH_PENDING,
    basepaths : {
      fetching : true,
      fetched : false
    }
  }
  test1(RECEIVE_BASEPATH_PENDING,'RECEIVE_BASEPATH_PENDING',expectedState,action);

  //RECEIVE_BOOK_FEATURES_REJECTED
  expectedState.bookFeatures.fetching = false;
  expectedState.bookFeatures.fetched = false;
  action = {
    type : RECEIVE_BOOK_FEATURES_REJECTED,
    bookFeatures : {
      fetching : false,
      fetched : false
    }
  }
  test1(RECEIVE_BOOK_FEATURES_REJECTED,'RECEIVE_BOOK_FEATURES_REJECTED',expectedState,action);

  //RECEIVE_BASEPATH_REJECTED
  expectedState.basepaths.fetching = false;
  expectedState.basepaths.fetched = false;
  action = {
    type : RECEIVE_BASEPATH_REJECTED,
    basepaths : {
      fetching : false,
      fetched : false
    }
  }
  test1(RECEIVE_BASEPATH_REJECTED,'RECEIVE_BASEPATH_REJECTED',expectedState,action);

  //RECEIVE_PAGE_INFO
  expectedState.bookinfo.pages = [];
  action = {
    type : RECEIVE_PAGE_INFO,
    bookinfo : {
      pages : []
    }
  }
  test1(RECEIVE_PAGE_INFO,'RECEIVE_PAGE_INFO',expectedState,action);

  //RECEIVE_USER_INFO_REJECTED
  expectedState.userInfo.fetching = false;
  expectedState.userInfo.fetched = false;
  action = {
    type : RECEIVE_USER_INFO_REJECTED,
    userInfo : {
      fetching : false,
      fetched : false
    }
  }
  test1(RECEIVE_USER_INFO_REJECTED,'RECEIVE_USER_INFO_REJECTED',expectedState,action);

  //RECEIVE_BOOK_FEATURES_PENDING
  expectedState.bookFeatures.fetching = true;
  expectedState.bookFeatures.fetched = false;
  action = {
    type : RECEIVE_BOOK_FEATURES_PENDING,
    userInfo : {
      fetching : true,
      fetched : false
    }
  }
  test1(RECEIVE_BOOK_FEATURES_PENDING,'RECEIVE_BOOK_FEATURES_PENDING',expectedState,action);

})
