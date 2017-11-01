import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import SwipeableViews from 'react-swipeable-views';
import Drawer from 'material-ui/Drawer';
import { Tabs, Tab } from 'material-ui/Tabs';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { TableOfContentsComponent } from '@pearson-incubator/toc';
import { BookmarkListComponent } from '@pearson-incubator/bookmarks';
import { NoteListComponent } from '@pearson-incubator/notes';
import DrawerComponent from '../../../src/components/Header/Drawer';
import { fetchTocAndViewer, fetchBookmarksUsingReaderApi, addBookmarkUsingReaderApi, removeBookmarkUsingReaderApi,
	fetchBookInfo, fetchPageInfo, goToPage, fetchHighlightUsingReaderApi, saveHighlightUsingReaderApi,
	removeHighlightUsingReaderApi, loadAssertUrl, editHighlightUsingReaderApi, fetchRegionsInfo,
	fetchPagebyPageNumber, fetchUserIcons, fetchBookFeatures, fetchGlossaryItems, fetchBasepaths
	} from '../../../src/routes/PdfBook/modules/pdfbook';

describe('Drawer Component', () => {
	let _component, _props;
	const muiTheme = getMuiTheme();

	beforeEach(() =>{
		_props = {
			bookData : {
				bookFeatures : {
					hasbookshelflink : true
				},
				toc : {
					content : []
				},
				tocReceived : true,
				bookmarks : [],
				annTotalData : [],

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
			isOpen : true,
			hideDrawer : function(){},
			locale : 'en-US',
			messages : {},
			isET1 : true
		}
		_component = shallow(<DrawerComponent {..._props}/>,{context: {muiTheme}})
	})

	it('Should render as material-ui Drawer', () => {
		expect(_component.type()).to.equal(Drawer);
	})

	it('Should render .bookTitleAndTabs only once', () => {
		expect(_component.find('.bookTitleAndTabs')).to.have.length(1);
	})

	it('Should render .tabCompwrapper only once', () => {
		expect(_component.find('.tabCompwrapper')).to.have.length(1);
	})

	it('Should render .drawerWrap only once', () => {
		expect(_component.find('.drawerWrap')).to.have.length(1);
	})

	it('Should render .bookTitleSection only once', () => {
		expect(_component.find('.bookTitleSection')).to.have.length(1);
	})

	it('Should render .title only once', () => {
		expect(_component.find('.title')).to.have.length(1);
	})

	it('Should render .author only once', () => {
		expect(_component.find('.author')).to.have.length(1);
	})

	it('Should render Tabs only once', () => {
		expect(_component.find(Tabs)).to.have.length(1);
	})

	it('Should render Tab only 3 times', () => {
		expect(_component.find(Tab)).to.have.length(3);
	})

	it('Should render #contents only once', () => {
		expect(_component.find('#contents')).to.have.length(1);
	})

	it('Should render #bookmarks only once', () => {
		expect(_component.find('#bookmarks')).to.have.length(1);
	})

	it('Should render #notes only once', () => {
		expect(_component.find('#notes')).to.have.length(1);
	})

	it('Should contain bottomBar div', () => {
		expect(_component.contains(<div className="bottomBar" ref={(bottomBar) => { this.bottomBar = bottomBar; }} />)).to.equal(true);
	})

	it('Should render SwipeableViews once', () =>{
		expect(_component.find(SwipeableViews)).to.have.length(1);
	})

	it('Should render TableOfContentsComponent once', () =>{
		let swipeableViewsComp = _component.find(SwipeableViews);
		expect(swipeableViewsComp.find(TableOfContentsComponent)).to.have.length(1);
	})

	it('Should render BookmarkListComponent once', () =>{
		let swipeableViewsComp = _component.find(SwipeableViews);
		expect(swipeableViewsComp.find(BookmarkListComponent)).to.have.length(1);
	})

	it('Should render NoteListComponent once', () =>{
		let swipeableViewsComp = _component.find(SwipeableViews);
		expect(swipeableViewsComp.find(NoteListComponent)).to.have.length(1);
	})

})