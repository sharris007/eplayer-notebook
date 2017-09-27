import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BookshelfPage from '../../../src/routes/Bookshelf/components/Bookshelf';
import { fetch, storeBookDetails, storeSsoKey } from '../../../src/routes/Bookshelf/modules/bookshelfActions';
/*let piSession = {
ErrorEvent:"error",
LoginEvent:"login",
LogoutEvent:"logout",
NoSession:"nosession",
NoToken:"notoken",
RefreshEvent:"refresh",
RequiredLifetimeTooLong:"requiredLifetimeTooLong",
SessionStateKnownEvent:"sessionstateknown",
Success:"success",
TimedOut:"timedout",
Unknown:"unknown",
autoimpersonate:function(bf,be){},
autologin:function(bh,bf,be,bg){},
currentLastUserActivityTime:function(){},
currentSessionExpiry:function(){},
currentToken:function(),
currentTokenExpiry:function(){},
doNotUseThisDeprecatedMethod:function(be){},
extendUserSession:function(){},
getHomeCountryCode:function(){},
getToken:function(bi,bh,bf){},
getsmssession:function(bh,be,bg,bf){},
hasValidSession:function(be){},
initialize:function(be,bf){},
isUserEventMonitoringActive:function(){},
login:function(bg,bh,bi){},
logout:function(be){},
monitorUserActivity:function(be){},
off:function(be,bf){},
on:function(be,bf){},
recordUserActivity:function(){},
setOptions:function(be){},
trigger:function(be,bf){},
userId:function(){}
}*/

function shallowRender (component) {
  	const renderer = new ShallowRenderer();
	renderer.render(component)
 	 return renderer.getRenderOutput()
}

function shallowRenderWithProps (props = {}) {
  	return shallowRender(<BookshelfPage {...props}/>)
}

	describe(" Bookshelf ", function(){
		let _props , _component;

		beforeEach(function(){

			_props = {
				bookshelf : {},
				book : {},
				login : {},
				location : {
					query : {
						bookshelftype : ''
					}
				},
				fetch,
				storeBookDetails,
				storeSsoKey, 
			}
			 _component = shallowRenderWithProps(_props);
		})

		it('Should render as a <div>.', function () {
    		expect(_component.type).to.equal('div')
  		})

  		it('Should have id "bookshelf-page"', function() {
  			expect(_component.props.id).to.equal('bookshelf-page')
  		})
	
	})