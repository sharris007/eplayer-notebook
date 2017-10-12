/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  *
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
/* global localStorage*/
import React from 'react';
import AppBar from 'material-ui/AppBar';
// import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import { BookmarkIconComponent } from '@pearson-incubator/bookmark-icon';
import { addLocaleData } from 'react-intl';

import Icon from '../Icon';
import './Header.scss';
import DrawerComponent from './Drawer';
import Search from '../search/containers/searchContainer';
import MoreMenuComponent from '../moreMenu/containers/moreMenuContainer';
import Popup from 'react-popup';
// import { injectReducer } from '../../store/reducers';
// import { languages } from '../../../locale_config/translations/index';
import { resources, domain } from '../../../const/Settings';

const envType = domain.getEnvType();
const consoleUrl = resources.links.consoleUrl;

let locale;
let localisedData;
let messages;

export class Header extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.locale !== undefined) {
      locale = this.props.locale;
      localisedData = locale.split('-')[0];
      addLocaleData((require(`react-intl/locale-data/${localisedData}`))); // eslint-disable-line global-require,import/no-dynamic-require
      messages = this.props.messages;
    }
    this.state = {
      drawerOpen: false,
      prefOpen: false,
      searchOpen: false,
      goToTextVal: '',
      loadingFirstTime: true
    };
  }
  componentDidUpdate(){
    if(this.state.loadingFirstTime === true){
      if( $('.navigation').length){
        $('#frame,.navigation,.moreIcon,h1').on('click', () => {
          this.setState({prefOpen : false})
          this.setState({searchOpen : false})
        })
        $('#frame,.navigation').on('mousedown', () => {
          this.setState({prefOpen : false})
          this.setState({searchOpen : false})
        })
        this.setState({loadingFirstTime : false})
      }
    }
  }

  handleDrawerkeyselect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.setState({ drawerOpen: true });
    }
    this.props.viewerContentCallBack(false);
  }

  handleDrawer = () => {
    try{
      Popup.close();
    }
    catch(e){
    }
    this.setState({ drawerOpen: true });
    this.setState({prefOpen : false})
    this.setState({searchOpen : false})
    this.props.viewerContentCallBack(false);
  }

  hideDrawer = () => {
    if (this.state.drawerOpen) {
      document.getElementsByClassName('drawerIcon')[0].focus();
    }
    this.setState({ drawerOpen: false });
    this.props.viewerContentCallBack(true);
  }

  handleBookshelfClick = () => {
    try{
      Popup.close();
    }
    catch(e){
    }
    if (this.props.bookData.toc.content !== undefined) {
      this.props.bookData.toc.content = {list:[]};
      this.props.bookData.bookmarks = [];
      this.props.bookData.bookinfo = [];
      this.props.bookData.annTotalData = [];
      this.props.bookData.bookFeatures = {};
    }
    if(window.location.pathname.indexOf('/eplayer/Course/')>-1){
      let redirectConsoleUrl   = consoleUrl[envType];
      window.location.href = redirectConsoleUrl;
    }else {
      const langQuery = localStorage.getItem('bookshelfLang');
      if (langQuery && langQuery !== '?languageid=1') {
        browserHistory.push(`/eplayer/bookshelf${langQuery}`);
      } else {
        var bookshelfRoute = '/eplayer/bookshelf';
        piSession.getToken((result, userToken) => {
        if (result === piSession.Success) {

        }
        else if(result === 'unknown' || result === 'notoken' ){
          bookshelfRoute = '/eplayer/bookshelf?invoketype=et1&globaluserid='+this.props.globaluserid;
         }
         browserHistory.push(bookshelfRoute);
        });

      }
    }
    this.setState({ open: false });
  }

  handleBookshelfKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      browserHistory.push('/');
      this.setState({ open: false });
    }
  }
  handlePreferenceClick = () => {
    try{
      Popup.close();
    }
    catch(e){
    }
    if (this.state.prefOpen === true) {
      this.setState({ prefOpen: false });
    } else {
      this.setState({ prefOpen: true });
      this.setState({ searchOpen: false });
    }
  }

  handlePreferenceKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.handlePreferenceClick();
    }
  }
  searchClick = () => {
    try{
      Popup.close();
    }
    catch(e){
    }
    if (this.state.searchOpen === true) {
      this.setState({ searchOpen: false });
    } else {
      this.setState({ searchOpen: true });
      this.setState({ prefOpen: false });
    }
  }
  goToTextChange = (e) => {
    this.setState({ goToTextVal: e.target.value });
  }

  goToPageClick = () => {
    this.props.goToPageClick(this.state.goToTextVal);
  }

  goToPageOnKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.setState({ goToTextVal: e.target.value });
      this.goToPageClick();
    }
  }

  searchKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.searchClick();
    }
    if ((event.which || event.keyCode) === 27) {
      this.searchClick();
    }
  }

  goToPage = (pageId) => {
    this.props.goToPage(pageId);
    this.setState({ searchOpen: false });
  }

  handleHeaderClick = () => {
    try{
      Popup.close();
    }
    catch(e){
    }
    this.setState({prefOpen : false})
    this.setState({searchOpen : false})
  }
  handleMoreMenuClick = () => {
    try{
      Popup.close();
    }
    catch(e){
    }
  }


  render() {
    const style = {
      rightIcons: {
        margin: '0px'
      },
      moreIcons: {
        color: '#ccc'
      },
      leftIcons: {
        margin: '0px'
      },
      bookshelfIcon: {
        margin: '0'
      },
      drawerIcon: {
        margin: '0 0 0 30px',
        height: '16.5px',
        width: '18px'
      },
      prefIcon: {
        margin: '0 0 0 30px'
      },
      searchIcon: {
        margin: '0 30px'
      },
      appBar: {
        paddingLeft: '0px',
        paddingRight: '0px',
        height: 'auto',
        backgroundColor: 'transparent',
        title: {
          fontFamily: 'Open Sans',
          fontSize: '16px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontStretch: 'normal',
          color: '#ffffff',
          textAlign: 'center',
          height: 'auto',
          lineHeight: 'inherit',
          margin: '0 0 0 117px'
        },
        navUp: {
          top: '-84px'
        }
      }
    };

    const bookmarkIconData = {
      addBookmarkHandler: this.props.bookCallbacks.addBookmarkHandler,
      removeBookmarkHandler: this.props.bookCallbacks.removeBookmarkHandler,
      isCurrentPageBookmarked: this.props.bookCallbacks.isCurrentPageBookmarked,
      goToPageClick: this.props.bookCallbacks.goToPageClick,
      goToTextChange: this.props.bookCallbacks.goToTextChange
    };

    // const targetPageId = this.props.bookData.viewer.currentPageId;
    // const currPageObj = find(this.props.bookData.viewer.pages, page => page.id === targetPageId);
    const title = localStorage.getItem('title');
    /* eslint-disable */
    return (
      <div className={`${this.props.classname}`} >
        <AppBar
          title={this.props.isET1 === 'Y' ? this.props.title || title : this.props.pageTitle}
          titleStyle={style.appBar.title}
          style={style.appBar}
          iconStyleLeft={style.leftIcons}
          iconStyleRight={style.rightIcons}
          zDepth={0}
          iconElementLeft={
            <div>
              <div className="back_rec">
              {this.props.isET1 === 'Y' && (!this.props.bookData.bookFeatures.hasbookshelflink || this.props.invoketype === 'et1') ?
                <div className="empty"/> :
                <span
                  className="icon-white "
                  style={style.bookshelfIcon}
                  onClick={this.handleBookshelfClick}
                  onKeyDown={this.handleBookshelfKeySelect}
                  role="button"
                  tabIndex="0"
                >
                  <span className = "tooltiptext"> Bookshelf </span>
                  <Icon name="chevron-back-18" />
                </span>
              }
              </div>
              {this.props.isET1 === 'Y' && !this.props.bookData.bookFeatures.hasdrawerbutton ?
                <div className="empty"/> :
              <span
                className="drawerIcon icon-white"
                style={style.drawerIcon}
                onTouchTap={this.handleDrawer}
                onKeyDown={this.handleDrawerkeyselect}
                role="button"
                tabIndex="0"
              >
                <span className = "tooltiptext"> Drawer </span>
                <Icon name="hamburger-light-18" />
              </span>
            }
            </div>
          }
          iconElementRight={
            <div>
            {this.props.currentPageIndex == 0 || (this.props.isET1 === 'Y' && !this.props.bookData.bookFeatures.hasbookmarkpagebutton) ?
              <div className="empty"/> :
              <div className="bookmarkIcon" onClick={this.handleHeaderClick} role="button" tabIndex="0">
              <span className = "tooltiptext"> Bookmark </span>
                <BookmarkIconComponent data={bookmarkIconData} locale="en"/>
              </div>
            }
            {this.props.isET1 === 'Y' && !this.props.bookData.bookFeatures.haszoominbutton && !this.props.bookData.bookFeatures.haszoomoutbutton ?
              <div className="empty"/> :
              <div
                className="icon-white prefIcon"
                style={style.prefIcon}
                onClick={this.handlePreferenceClick}
                onKeyDown={this.handlePreferenceKeySelect}
                role="button"
                tabIndex="0"
              >
                <span className = "tooltiptext"> Zoom </span>
                <Icon name="font-setting-24" />
              </div>
            }
              {this.props.isET1 ? <div className="preferences-container-eT1">{this.state.prefOpen ? <div className="content"><PreferencesComponent isET1={this.props.isET1} setCurrentZoomLevel={this.props.setCurrentZoomLevel} disableBackgroundColor={this.props.disableBackgroundColor} /></div> : <div className="empty" />} </div>
       : <div className="preferences-container">{this.state.prefOpen ? <div className="content"><PreferencesComponent fetch={this.props.getPreference} preferenceUpdate={this.props.updatePreference}
         disableBackgroundColor={false} locale="en" /></div> : <div className="empty" />} </div>}
         {this.props.isET1 === 'Y' && !this.props.bookData.bookFeatures.hassearchbutton ?
              <div className="empty"/> :
              <div
                className="icon-white searchIcon"
                style={style.searchIcon}
                role="button"
                tabIndex="0"
                onClick={this.searchClick}
                onKeyDown={this.searchKeySelect}
              >
                <span className = "tooltiptext"> Search </span>
                <Icon name="search-lg-18" />
              </div>
            }
              <div className="searchContainer">
                {this.state.searchOpen ? <Search locale={locale} store={this.props.store} ssoKey={this.props.ssoKey} globalBookId={this.props.globalBookId} bookId={this.props.bookId} serverDetails={this.props.serverDetails} goToPage={pageId => this.goToPage(pageId)} indexId={this.props.indexId} listClick={this.props.listClick} isET1="Y" /> : <div className="empty" />}
              </div>
              <div className="moreIcon" onClick={this.handleMoreMenuClick}>
              <span className = "tooltiptext"> LogOut </span>
                <MoreMenuComponent store={this.props.store} userid={this.props.userid} ssoKey={this.props.ssoKey} sceanrio={this.props.currentScenario} serverDetails={this.props.serverDetails} locale={this.props.locale} messages={messages} />
              </div>
            </div>}
        />
        {
          this.props.bookData.toc.content &&
          <DrawerComponent
            locale={locale} messages={messages}
            bookData={this.props.bookData}
            bookCallbacks={this.props.bookCallbacks}
            isOpen={this.props.drawerOpen}
            hideDrawer={this.hideDrawer}
            isET1={this.props.isET1}
            pageId={this.props.currentPageID}
          />
        }


      </div>
    );
    /* eslint-enable */
  }
}

Header.propTypes = {
  classname: React.PropTypes.string,
  bookData: React.PropTypes.object,
  bookCallbacks: React.PropTypes.object,
  store: React.PropTypes.object,
  viewerContentCallBack: React.PropTypes.func,
  goToTextChange: React.PropTypes.func,
  goToPageClick: React.PropTypes.func,
  locale: React.PropTypes.string,
  messages: React.PropTypes.object,
  goToPage: React.PropTypes.func,
  isET1: React.PropTypes.string,
  title: React.PropTypes.string,
  pageTitle: React.PropTypes.string,
  drawerOpen: React.PropTypes.bool
};

export default Header;
