import moreMenuActions from '../../../src/components/moreMenu/modules/moreMenuActions';

describe('More Menu Actions', () =>{

	let logout = moreMenuActions.logout;
	let logoutUserSession = moreMenuActions.logoutUserSession;

	it('logout() Should be exported as a function', ()=>{
		expect(logout).to.be.a('function')
	})

	it('logoutUserSession() Should be exported as a function', ()=>{
		expect(logoutUserSession).to.be.a('function')
	})

	it('logoutUserSession() Should return action type LOGOUT_USER_SESSION', ()=>{
		expect(logoutUserSession()).to.have.property('type','LOGOUT_USER_SESSION')
	})
})