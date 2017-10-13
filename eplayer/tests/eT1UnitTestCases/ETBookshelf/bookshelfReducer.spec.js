import {BOOKS_PENDING, BOOKS_REJECTED, BOOKS_FULFILLED} from '../../../src/routes/ETBookshelf/modules/bookshelfReducer';
const reducer = require('../../../src/routes/ETBookshelf/modules/bookshelfReducer').default;
const initialState = {
  books: [],
  fetched: false,
  fetching: false,
  error: null
};
describe("bookshelf (Reducer)", () => {

	it("BOOKS_PENDING should be exported as a constant", () => {
		expect(BOOKS_PENDING).to.equal('BOOKS_PENDING')
	})
	it("BOOKS_REJECTED should be exported as a constant", () => {
		expect(BOOKS_REJECTED).to.equal('BOOKS_REJECTED')
	})
	it("BOOKS_FULFILLED should be exported as a constant", () => {
		expect(BOOKS_FULFILLED).to.equal('BOOKS_FULFILLED')
	})
	it("Reducer should be exported as a function", () => {
		expect(reducer).to.be.a('function')
	})
	it('Should initialize the state with initial state', () => {
      expect(reducer(undefined, {})).to.deep.equal(initialState)
    })
    it('Should return the previous state if an action was not matched.',() => {
    	let bookshelfReducerState = Object.assign({},initialState);
    	bookshelfReducerState.fetching = true;
    	bookshelfReducerState.error = null;
    	let state = reducer(initialState,{ type : 'BOOKS_PENDING' });
    	expect(state).to.deep.equal(bookshelfReducerState);
    	state = reducer(state, { type: '#####' });
    	expect(state).to.deep.equal(bookshelfReducerState);
	})

})
