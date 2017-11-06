 import { SEARCH_PENDING, SEARCH_REJECTED, SEARCH, CLEAR_SEARCH, CLEAR_SEARCH_OBJ } from '../../../../src/components/search/modules/searchReducer';
 var reducer = require('../../../../src/components/search/modules/searchReducer').default;

 const initialState = {
   data: [],
   fetched: false,
   fetching: false,
   error: null
 };

 describe('Search Reducer', ()=>{

 	it(SEARCH_PENDING+' should be exported as a constant', () => {
 		expect(SEARCH_PENDING).to.equal('SEARCH_PENDING')
 	})

 	it(SEARCH_REJECTED+' should be exported as a constant', () => {
 		expect(SEARCH_REJECTED).to.equal('SEARCH_REJECTED')
 	})

 	it(SEARCH+' should be exported as a constant', () => {
 		expect(SEARCH).to.equal('SEARCH')
	})

 	it(CLEAR_SEARCH+' should be exported as a constant', () => {
 		expect(CLEAR_SEARCH).to.equal('CLEAR_SEARCH')
 	})

 	it(SEARCH_PENDING+' should be exported as a constant', () => {
 		expect(CLEAR_SEARCH_OBJ).to.equal('CLEAR_SEARCH_OBJ')
 	})

 	it('should return the updated state for action type '+SEARCH,() => {
 	let action = {
 		type : SEARCH,
 		searchState : {
 			searchResult: {
 				results: []
 			}
 		}
 	}
 	let expectedState = Object.assign({},initialState);
 	expectedState.fetched = true;
    let newState = reducer(initialState, action);
     expect(newState).to.deep.equal(expectedState);
   })

 	it('should return the updated state for action type '+CLEAR_SEARCH,() => {
     let newState = reducer(initialState, {type:CLEAR_SEARCH});
     expect(newState).to.deep.equal(initialState);
   })

 })