import book from '../../../src/routes/Book/modules/book';
import {LOGOUT_PENDING, LOGOUT_FULFILLED, LOGOUT_REJECTED, LOGOUT_USER_SESSION_PENDING, LOGOUT_USER_SESSION_FULFILLED, LOGOUT_USER_SESSION_REJECTED} from '../../../src/components/moreMenu/modules/moreMenuReducers';
const reducer = require('../../../src/components/moreMenu/modules/moreMenuReducers').default;
const initialState = {
  data: [],
  loggedout: false,
  loggingout: false,
  error: null,
  data_userSession: [],
  loggedout_userSession: false,
  loggingout_userSession: false,
  error_userSession: null
};
describe("moreMenu (Reducer)", () => {

  it("LOGOUT_PENDING should be exported as a constant", () => {
		expect(LOGOUT_PENDING).to.equal('LOGOUT_PENDING')
	})
  it("LOGOUT_FULFILLED should be exported as a constant", () => {
		expect(LOGOUT_FULFILLED).to.equal('LOGOUT_FULFILLED')
	})
  it("LOGOUT_REJECTED should be exported as a constant", () => {
		expect(LOGOUT_REJECTED).to.equal('LOGOUT_REJECTED')
	})
  it("LOGOUT_USER_SESSION_PENDING should be exported as a constant", () => {
		expect(LOGOUT_USER_SESSION_PENDING).to.equal('LOGOUT_USER_SESSION_PENDING')
	})
  it("LOGOUT_USER_SESSION_FULFILLED should be exported as a constant", () => {
		expect(LOGOUT_USER_SESSION_FULFILLED).to.equal('LOGOUT_USER_SESSION_FULFILLED')
	})
  it("LOGOUT_USER_SESSION_REJECTED should be exported as a constant", () => {
		expect(LOGOUT_USER_SESSION_REJECTED).to.equal('LOGOUT_USER_SESSION_REJECTED')
	})
  it("Reducer should be exported as a function", () => {
		expect(reducer).to.be.a('function')
	})
	it('Should initialize the state with initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState)
  })
  it('Should return the previous state if an action was not matched.',() => {
    let moreMenuState = Object.assign({},initialState);
    moreMenuState.loggingout = true;
    moreMenuState.error = null;
    let state = reducer(initialState,{ type : 'LOGOUT_PENDING' });
    expect(state).to.deep.equal(moreMenuState);
    state = reducer(state, { type: '#####' });
    expect(state).to.deep.equal(moreMenuState);
})
it('Should return the previous state if an action was not matched.',() => {
  let moreMenuState = Object.assign({},initialState);
  moreMenuState.loggingout_userSession = true;
  moreMenuState.error_userSession = null;
  let state = reducer(initialState,{ type : 'LOGOUT_USER_SESSION_PENDING' });
  expect(state).to.deep.equal(moreMenuState);
  state = reducer(state, { type: '#####' });
  expect(state).to.deep.equal(moreMenuState);
})


})
