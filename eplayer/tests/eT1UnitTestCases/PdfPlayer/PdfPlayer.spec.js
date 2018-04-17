import React from 'react';
import { mount, shallow } from 'enzyme';
import ShallowRenderer from 'react-test-renderer/shallow';
import { spy } from 'sinon';
import $ from 'jquery';
import { HeaderComponent } from '@pearson-incubator/vega-core';
import { Navigation } from '@pearson-incubator/aquila-js-core';
import { DrawerComponent } from '@pearson-incubator/vega-drawer';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import PdfPlayer from '../../../src/components/PdfPlayer';

describe('<PdfPlayer/>', () => {

	const _props = {
		preferences : {
			showHeader: true,
            showFooter: true,
            showDrawer: true,
            showAnnotation: true,
            showBookmark: true,
            showHostpot: true,
            locale: 'en-US',
            showBookshelfBack: true
		},
		pagePlayList : [],
		toc : {
			load: {
          		get: () => {}
        	},
			data : {
				data : {
					fetched : true
				}
			}
		},
		metaData : {
			bookFeatures : {
			hasShowLinksButton : true,
			hasPrintLink : true,

			}
		},
		parentType : 'eT1',
		auth : {
			userid : '1234'
		},
		annotations : {
			 load: {
	          get: () => {}
	        },
	        data: {
	        	annotationList :[]
	        },
	        operation: {
	          post: () => {},
	          put: () => {},
	          delete: () => {}
	        }
		},
		bookmarks : {
			load: {
	          get: () => {}
	        },
	        data: {
	        	bookmarkList : []
	        },
	        operation: {
	          post: () => {},
	          delete: () => {}
	        }
		},
		logoutUserSession : () => {},
		bookCallbacks : {
			handleBookshelfClick : () => {}
		}
	}

	before(() => {
		global.pdfAnnotatorInstance = {
			init : () => {},
			showCreateHighlightPopup : () => {},
			showSelectedHighlight : () => {}
		}
		global.$ = $;
	})

	after(() => {
		delete global.pdfAnnotatorInstance;
		delete global.$;
	})

	it('should render as a <div/>', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.type()).to.equal('div');
	})

	it('should contain a <HeaderComponent/> if showHeader prop is true', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		wrapper.setProps({preferences : {..._props, showHeader : false}});
		expect(wrapper.find(HeaderComponent)).to.have.length(0);
		wrapper.setProps({preferences : {..._props, showHeader : true}});
		expect(wrapper.find(HeaderComponent)).to.have.length(1);
	})

	it('should contain a <DrawerComponent/> if showDrawer prop is true', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find(DrawerComponent)).to.have.length(1);
	})

	it('should contain a <PreferencesComponent/> if prefOpen state variable is true', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find(PreferencesComponent)).to.have.length(0);
		wrapper.setState({prefOpen : true});
		expect(wrapper.find(PreferencesComponent)).to.have.length(1);
	})

	it('should contain a <Navigation/> if showFooter prop is passed and is true', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		wrapper.setProps({preferences : {..._props, showFooter : false}});
		expect(wrapper.find(Navigation)).to.have.length(0);
		wrapper.setProps({preferences : {..._props, showFooter : true}});
		wrapper.setState({isFirstPageBeingLoad : false});
		expect(wrapper.find(Navigation)).to.have.length(1);
	})

	it('should contain a main div', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('#main')).to.have.length(1);
	})

	it('should contain a right div', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('#right')).to.have.length(1);
	})

	it('should contain a toolbar div', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('#toolbar')).to.have.length(1);
	})

	it('should contain a frame div', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('#frame')).to.have.length(1);
	})

	it('should contain a docViewer div', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('#docViewer')).to.have.length(1);
	})

	it('should contain a sppModal div and its childrens', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('#sppModal')).to.have.length(1);
		expect(wrapper.find('#sppModalHeader')).to.have.length(1);
		expect(wrapper.find('#sppCloseBtn')).to.have.length(1);
		expect(wrapper.find('#sppTitle')).to.have.length(1);
		expect(wrapper.find('#sppModalBody')).to.have.length(1);
	})

	it('should render a <PopUpInfo/> element if popupCollection is not empty', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find(PopUpInfo)).to.have.length(0);
		wrapper.setState({popUpCollection : [{}]});
		expect(wrapper.find(PopUpInfo)).to.have.length(1);
	})

	it('should render a regionContainer div and its childrens if region data is not undefined', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find('.regionContainer')).to.have.length(0);
		wrapper.setState({regionData:[]});
		expect(wrapper.find('.regionContainer')).to.have.length(1);
		expect(wrapper.find('#regionCloseBtn')).to.have.length(1);
		expect(wrapper.find('#hotspot')).to.have.length(1);
	})

	it('should render <RefreshIndicator/> if page loaded is false', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		wrapper.setState({pageLoaded : false});
		expect(wrapper.find(RefreshIndicator)).to.have.length(1);
	})

	it('should contain a <Dialog/>', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		expect(wrapper.find(Dialog)).to.have.length(1);
	})

	it('should pass the required callbacks (searchCallback, drawerClick, handlePreferenceClick, search, onSearchResultClick, autoComplete) as props to <HeaderComponent>', () => {
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		const headerWrapper = wrapper.find(HeaderComponent);
		expect(headerWrapper.props().bookshelfClick).to.equal(wrapper.instance().props.bookCallbacks.handleBookshelfClick);
		expect(headerWrapper.props().drawerClick).to.equal(wrapper.instance().handleDrawer);
		expect(headerWrapper.props().handlePreferenceClick).to.equal(wrapper.instance().handlePreferenceClick);
		expect(headerWrapper.props().search).to.equal(wrapper.instance().searchCallback);
		expect(headerWrapper.props().onSearchResultClick).to.equal(wrapper.instance().handleSearchResultClick);
		expect(headerWrapper.props().autoComplete).to.equal(wrapper.instance().searchCallback);
	})

	it('should pass props prefOpen, searchOpen, hideIcons as props to <HeaderComponent/>', () => {
		const hideIcons = {
	      backNav: !_props.preferences.showBookshelfBack,
	      hamburger: !_props.preferences.showDrawer,
	      bookmark: !_props.preferences.showBookmark,
	      pref: false,
	      search: false,
	      audio: true,
	      moreIcon: false
	    };
		const wrapper = shallow(<PdfPlayer {..._props}/>);
		const headerWrapper = wrapper.find(HeaderComponent);
		expect(headerWrapper.props().prefOpen).to.equal(wrapper.state().prefOpen);
		expect(headerWrapper.props().searchOpen).to.equal(wrapper.state().searchOpen);
		expect(headerWrapper.props().hideIcons).to.equal(hideIcons);
		
	})

})							