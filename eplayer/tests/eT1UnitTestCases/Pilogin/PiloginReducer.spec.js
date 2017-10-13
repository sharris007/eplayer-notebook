import book from '../../../src/routes/Book/modules/book';
import {LOGIN_PENDING, LOGIN_FULFILLED, LOGIN_REJECTED, LOGIN_DETAILS} from '../../../src/routes/Pilogin/modules/PiloginReducer';
const reducer = require('../../../src/routes/Pilogin/modules/PiloginReducer').default;
const initialState = {
  data: {},
  fetched: false,
  fetching: false,
  error: false,
  errorMessage: ''
};
describe("Pilogin (Reducer)", () => {
  it("LOGIN_PENDING should be exported as a constant", () => {
		expect(LOGIN_PENDING).to.equal('LOGIN_PENDING')
	})
  it("LOGIN_FULFILLED should be exported as a constant", () => {
		expect(LOGIN_FULFILLED).to.equal('LOGIN_FULFILLED')
	})
  it("LOGIN_REJECTED should be exported as a constant", () => {
		expect(LOGIN_REJECTED).to.equal('LOGIN_REJECTED')
	})
  it("LOGIN_DETAILS should be exported as a constant", () => {
		expect(LOGIN_DETAILS).to.equal('LOGIN_DETAILS')
	})
  it("Reducer should be exported as a function", () => {
		expect(reducer).to.be.a('function')
	})
  it('Should initialize the state with initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState)
  })
  it('Should return the previous state if an action was not matched.',() => {
    let piloginState = Object.assign({},initialState);
    piloginState.fetching = true;
    piloginState.error = null;
    let state = reducer(initialState,{ type : 'LOGIN_PENDING' });
    expect(state).to.deep.equal(piloginState);
    state = reducer(state, { type: '#####' });
    expect(state).to.deep.equal(piloginState);
  })

})
