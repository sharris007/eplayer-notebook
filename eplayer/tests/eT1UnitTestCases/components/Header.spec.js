import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import { BookmarkIconComponent } from '@pearson-incubator/bookmark-icon';
import Icon from '../../../src/components/Icon';
import Header from '../../../src/components/Header/Header';
import DrawerComponent from '../../../src/components/Header/Drawer';
import MoreMenuComponent from '../../../src/components/moreMenu/components/moreMenu';
import { fetchTocAndViewer, fetchBookmarksUsingReaderApi, addBookmarkUsingReaderApi, removeBookmarkUsingReaderApi,
	fetchBookInfo, fetchPageInfo, goToPage, fetchHighlightUsingReaderApi, saveHighlightUsingReaderApi,
	removeHighlightUsingReaderApi, loadAssertUrl, editHighlightUsingReaderApi, fetchRegionsInfo,
	fetchPagebyPageNumber, fetchUserIcons, fetchBookFeatures, fetchGlossaryItems, fetchBasepaths
	} from '../../../src/routes/PdfBook/modules/pdfbook';


describe('Header Component', () => {
	let _props , _component;
	const muiTheme = getMuiTheme();
	beforeEach(function(){
		_props = {
			classname : 'headerBar',
			bookData : {
				bookFeatures : {
					hasbookshelflink : true
				},
				toc : {
					content : []
				}
			},
			bookCallbacks : {
				addBookmarkHandler : addBookmarkUsingReaderApi,
				removeBookmarkHandler : removeBookmarkUsingReaderApi,
				isCurrentPageBookmarked : function(){

				},
				goToPageClick : function(){

				},
				goToTextChange : function(){

				}
			},
			store : {},
			viewerContentCallBack : function (){},
			goToTextChange : function (){},
			goToPageClick: function (){},
			locale : 'en-US',
			messages : {},
			goToPage : function (){},
			isET1 : true,
			title : 'Florida',
			pageTitle : '',
			drawerOpen : true
		}
		_component = shallow(<Header {..._props}/>,{context: {muiTheme}});
	})

	it('Should rendered as a div', () => {
		expect(_component.type()).to.equal('div')
	})

	it('Should have classname headerBar', () => {
		expect(_component.hasClass('headerBar')).to.equal(true);
	})

	it('Should render component DrawerComponent once', () => {
		expect(_component.find(DrawerComponent)).to.have.length(1);
	})

	it('Should render component AppBar once', () => {
		expect(_component.find(AppBar)).to.have.length(1);
	})

	it('Should conatin mehtod named handleDrawerkeyselect',()=>{
		expect(_component.instance().handleDrawerkeyselect).to.be.a('function');
	})

	it('Should conatin mehtod named handleDrawer',()=>{
		expect(_component.instance().handleDrawer).to.be.a('function');
	})

	it('Should conatin mehtod named hideDrawer',()=>{
		expect(_component.instance().hideDrawer).to.be.a('function');
	})

	it('Should conatin mehtod named handleBookshelfClick',()=>{
		expect(_component.instance().handleBookshelfClick).to.be.a('function');
	})

	it('Should conatin mehtod named handleBookshelfKeySelect',()=>{
		expect(_component.instance().handleBookshelfKeySelect).to.be.a('function');
	})

	it('Should conatin mehtod named handlePreferenceKeySelect',()=>{
		expect(_component.instance().handleDrawerkeyselect).to.be.a('function');
	})

	it('Should conatin mehtod named handlePreferenceKeySelect',()=>{
		expect(_component.instance().handleDrawerkeyselect).to.be.a('function');
	})

})