import book, { fetchTocAndViewer, fetchBookmarksUsingReaderApi, addBookmarkUsingReaderApi, removeBookmarkUsingReaderApi,
	fetchBookInfo, fetchPageInfo, goToPage, fetchHighlightUsingReaderApi, saveHighlightUsingReaderApi,
	removeHighlightUsingReaderApi, editHighlightUsingReaderApi, fetchRegionsInfo,
	fetchPagebyPageNumber, fetchUserIcons, fetchBookFeatures, fetchGlossaryItems, fetchBasepaths,fetchUserInfo,
	REQUEST_BOOKMARKS, RECEIVE_BOOKMARKS, ADD_BOOKMARK, REMOVE_BOOKMARK, REQUEST_TOC, RECEIVE_TOC, 
	GO_TO_PAGE, SAVE_HIGHLIGHT, REQUEST_HIGHLIGHTS, RECIEVE_HIGHLIGHTS, REMOVE_HIGHLIGHT, 
	LOAD_ASSERT_URL, EDIT_HIGHLIGHT, REQUEST_REGIONS, RECEIVE_REGIONS, RECEIVE_GLOSSARY_TERM } 
	 from '../../../src/routes/PdfBook/modules/pdfbook';
//import actionCreatorFunctionWithDispatch from '../actionCreatorTestCase'
function request(component) {
  switch (component) {
    case 'bookmarks':
      return { type: REQUEST_BOOKMARKS };
    case 'toc':
      return { type: REQUEST_TOC };
    case 'highlights' :
      return { type: REQUEST_HIGHLIGHTS };
    case 'regions' :
      return {type: REQUEST_REGIONS};
    default:
      return {};
  }
}
function actionCreatorFunctionWithDispatch(actionCreatorName, dispatchArgs, functionName){
	let _globalState
    let _dispatchSpy

	beforeEach(() => {
      		_globalState = {
        	book : book(undefined, {})
      		}
     		_dispatchSpy = sinon.spy((action) => {
        	_globalState = {
          	..._globalState,
          	book : bookReducer(_globalState.book, action)
        	}
      	})
	})
    it(functionName+' should be a function', () => {
		expect(actionCreatorName).to.be.a('function')
	});
    it(functionName+' should return a function(thunk)', () => {
		expect(actionCreatorName()).to.be.a('function')
	});

	let actionType = dispatchArgs.type;
	let bookState = dispatchArgs.bookState;
	it(functionName+' should dispatch action '+actionType+' exactly once', () => {
       	expect(_dispatchSpy.withArgs({ type: actionType, bookState }).calledOnce)
     });
  
}

function actionCreatorFunctionWithoutDispatch(actionCreatorName, actionType, functionName){
	it(functionName+' should be a function', () => {
		expect(actionCreatorName).to.be.a('function');
	});
	it(functionName+' should return action type '+actionType, () => {
		expect(actionCreatorName()).to.have.property('type',actionType);
	});

}

describe('pdfBook (ActionCreators)', () => {
	let bookState
    let dispatchArgs
  
    //FetchTOCAndViewer
    bookState = {
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
  	dispatchArgs = {
  		type : RECEIVE_TOC,
  		bookState
  	}
    actionCreatorFunctionWithDispatch(fetchTocAndViewer,dispatchArgs,'fetchTocAndViewer');

    //fetchBookmarksUsingReaderApi
    bookState = {
    			bookmarks: [],
    			isFetching: {
      			bookmarks: true
   			}
  		}
  	dispatchArgs = {
  		type : RECEIVE_BOOKMARKS,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchBookmarksUsingReaderApi,dispatchArgs,'fetchBookmarksUsingReaderApi');

  	//addBookmarkUsingReaderApi
  	bookState = {
    			
  		}
  	dispatchArgs = {
  		type : ADD_BOOKMARK,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(addBookmarkUsingReaderApi,dispatchArgs,'addBookmarkUsingReaderApi');

  	//removeBookmarkUsingReaderApi
  	bookState = '59cbab3687f70e75e1183a6f'
  	dispatchArgs = {
  		type : ADD_BOOKMARK,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(removeBookmarkUsingReaderApi,dispatchArgs,'removeBookmarkUsingReaderApi');

  	//fetchPageInfo
  	bookState = {
    		bookInfo: {
      		pages: []
    		}
  		};
  	dispatchArgs = {
  		type : 'RECEIVE_PAGE_INFO',
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchPageInfo,dispatchArgs,'fetchPageInfo');

  	//goToPage
  	bookState = '558023';
  	dispatchArgs = {
  		type : GO_TO_PAGE,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(goToPage,dispatchArgs,'goToPage');

  	//fetchHighlightUsingReaderApi
  	bookState = {
   			highlights: [],
    		isFetching: {
      		highlights: true
    		}
  		};
  	dispatchArgs = {
  		type : RECIEVE_HIGHLIGHTS,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchHighlightUsingReaderApi,dispatchArgs,'fetchHighlightUsingReaderApi');

  	//saveHighlightUsingReaderApi
  	bookState = {
  		};
  	dispatchArgs = {
  		type : SAVE_HIGHLIGHT,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(saveHighlightUsingReaderApi,dispatchArgs,'saveHighlightUsingReaderApi');

  	//removeHighlightUsingReaderApi
  	bookState = '59d5ef3ec41bb676c1b9a25d'
  	dispatchArgs = {
  		type : REMOVE_HIGHLIGHT,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(removeHighlightUsingReaderApi,dispatchArgs,'removeHighlightUsingReaderApi');

  	//editHighlightUsingReaderApi
  	bookState = {}
  	dispatchArgs = {
  		type : REMOVE_HIGHLIGHT,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(editHighlightUsingReaderApi,dispatchArgs,'editHighlightUsingReaderApi');

  	//fetchRegionsInfo
  	bookState = {
    		regions: [],
    		isFetching: {
      		regions: true
    		}
  		};
  	dispatchArgs = {
  		type : RECEIVE_REGIONS,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchRegionsInfo,dispatchArgs,'fetchRegionsInfo');

  	//fetchPagebyPageNumber
  	bookState = {
    		bookInfo: {
      		pages: []
    		}
  		};
  	dispatchArgs = {
  		type : 'RECEIVE_PAGE_INFO',
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchPagebyPageNumber,dispatchArgs,'fetchPagebyPageNumber');

  	//fetchGlossaryItems
  	bookState = {
    		bookInfo : {
      		glossaryInfoList : [],
    		}
  		};
  	dispatchArgs = {
  		type : RECEIVE_GLOSSARY_TERM,
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchGlossaryItems,dispatchArgs,'fetchGlossaryItems');

  	//fetchPagebyPageNumber
  	bookState = {
    		bookInfo: {
      		pages: []
    		}
  		};
  	dispatchArgs = {
  		type : 'RECEIVE_PAGE_INFO',
  		bookState
  	}
  	actionCreatorFunctionWithDispatch(fetchPagebyPageNumber,dispatchArgs,'fetchPagebyPageNumber');

	//fetchBookInfo
	bookState = {
     	bookInfo: {
     	userbook : {},
      	book: {}
     	}
   	};
   	dispatchArgs = {
  		type : 'RECEIVEBOOKINFO_SUCCESS',
  		bookState
  	}
   	actionCreatorFunctionWithDispatch(fetchBookInfo,dispatchArgs,'fetchBookInfo');

   	//fetchBookFeatures
	actionCreatorFunctionWithoutDispatch(fetchBookFeatures,'RECEIVE_BOOK_FEATURES','fetchBookFeatures');

	//fetchBasepaths
	actionCreatorFunctionWithoutDispatch(fetchBasepaths,'RECEIVE_BASEPATH','fetchBasepaths');

	//fetchUserInfo
	actionCreatorFunctionWithoutDispatch(fetchUserInfo,'RECEIVE_USER_INFO','fetchUserInfo');
})
