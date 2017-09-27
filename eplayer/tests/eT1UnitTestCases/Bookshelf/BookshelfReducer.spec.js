import { BOOKS_PENDING, BOOKS_REJECTED, BOOKS_FULFILLED, BOOK_DETAILS, SSO_KEY, AUTH_FULFILLED, GOTAUTH } from '../../../src/routes/Bookshelf/modules/bookshelfReducer';
const reducer = require('../../../src/routes/Bookshelf/modules/bookshelfReducer').default;
const initialState = {
  books: [],
  fetched: false,
  fetching: false,
  error: null,
  uPdf: '',
  serverDetails: '',
  authorName: '',
  title: '',
  thumbnail: '',
  bookeditionid: 0,
  ssoKey: '',
  globalBookId: '',
  bookId: '',
  uid: '',
  ubd: '',
  ubsd: '',
  roleTypeID: '',
  authFetched: false,
  authData:[]
};

describe("Bookshelf (Reducer)", () => {

	it("BOOKS_PENDING should be exported as a constant", () => {
		expect(BOOKS_PENDING).to.equal('BOOKS_PENDING')
	})
	it("BOOKS_REJECTED should be exported as a constant", () => {
		expect(BOOKS_REJECTED).to.equal('BOOKS_REJECTED')
	})
	it("BOOKS_FULFILLED should be exported as a constant", () => {
		expect(BOOKS_FULFILLED).to.equal('BOOKS_FULFILLED')
	})
	it("BOOK_DETAILS should be exported as a constant", () => {
		expect(BOOK_DETAILS).to.equal('BOOK_DETAILS')
	})
	it("SSO_KEY should be exported as a constant", () => {
		expect(SSO_KEY).to.equal('SSO_KEY')
	})
	it("AUTH_FULFILLED should be exported as a constant", () => {
		expect(AUTH_FULFILLED).to.equal('AUTH_FULFILLED')
	})
	it("GOTAUTH should be exported as a constant", () => {
		expect(GOTAUTH).to.equal('GOTAUTH')
	})
	it("Reducer should be exported as a function", () => {
		expect(reducer).to.be.a('function')
	})
	it('Should initialize the state with initial state', () => {
      expect(reducer(undefined, {})).to.deep.equal(initialState)
    })
    it('Should return the previous state if an action was not matched.',() => {
    	let bookshelfState = Object.assign({},initialState);
    	bookshelfState.fetching = true;
    	bookshelfState.error = null;
    	let state = reducer(initialState,{ type : 'BOOKS_PENDING' });
    	expect(state).to.deep.equal(bookshelfState);
    	state = reducer(state, { type: '#####' });
    	expect(state).to.deep.equal(bookshelfState);
	})
})