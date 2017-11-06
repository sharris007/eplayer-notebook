import searchActions from '../../../../src/components/search/modules/searchActions';
import { SEARCH, CLEAR_SEARCH_OBJ } from '../../../../src/components/search/modules/searchActions';
var reducer = require('../../../../src/components/search/modules/searchReducer').default;

describe('Search Actions', ()=>{
	let _globalState
    let _dispatchSpy

	beforeEach(() => {
      		_globalState = {
        	search : reducer(undefined, {})
      		}
     		_dispatchSpy = sinon.spy((action) => {
        	_globalState = {
          	..._globalState,
          	search : reducer(_globalState.search, action)
        	}
      	})
	})
 	let fetch =  searchActions.fetch;
    let clearSearchResults = searchActions.clearSearchResults;

    it('fetch() should be exported as a function', () => {
    	expect(fetch).to.be.a('function');
    })

    it('fetch() should return a function(thunk)', ()=>{
    	let searchText = '1';
    	let paramList = {
    		searchUrl: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/pdfplayer/searchbook?bookid=24369&globalbookid=CM31206032&searchtext=searchText&sortby=1&version=1.0&authkey=886366f1e30ba38e125cc0ab472617c8&hsid=2e9fa4824853626df213784a3bbdb0b3'
    	}
    	expect(fetch(paramList, searchText)).to.be.a('function');
    })

    it('clearSearchResults() should be exported as a function', () => {
    	expect(clearSearchResults).to.be.a('function');
    })

    it('clearSearchResults() should return a function(thunk)', ()=>{
    	expect(clearSearchResults()).to.be.a('function');
    })

    it('clearSearchResults() should dispatch action CLEAR_SEARCH_OBJ exactly once', ()=>{
    	expect(_dispatchSpy.withArgs({ type: CLEAR_SEARCH_OBJ }).calledOnce)
    })

    it('fetch() should dispatch action SEARCH exactly once', ()=>{
    	 let searchState = {
      		searchResult: {
        		results: []
      		}
    	};
    	expect(_dispatchSpy.withArgs({ type: SEARCH, searchState  }).calledOnce)
    })
})