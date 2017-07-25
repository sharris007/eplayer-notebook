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
      goToTextVal: ''
    };
  }

  handleDrawerkeyselect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.setState({ drawerOpen: true });
    }
    this.props.viewerContentCallBack(false);
  }

  handleDrawer = () => {
    this.setState({ drawerOpen: true });
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
    if (this.props.bookData.toc.content !== undefined) {
      this.props.bookData.toc.content = {};
      this.props.bookData.bookmarks = [];
      this.props.bookData.bookinfo = [];
      this.props.bookData.annTotalData = [];
    }
    if(window.location.pathname.indexOf('/eplayer/Course/')>-1){
      let redirectConsoleUrl   = consoleUrl[envType];
      window.location.href = redirectConsoleUrl;
    }else {
      const langQuery = localStorage.getItem('bookshelfLang');
      if (langQuery && langQuery !== '?languageid=1') {
        browserHistory.push(`/eplayer/bookshelf${langQuery}`);
      } else {
        browserHistory.push('/eplayer/bookshelf');
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
                <span
                  className="icon-white "
                  style={style.bookshelfIcon}
                  onClick={this.handleBookshelfClick}
                  onKeyDown={this.handleBookshelfKeySelect}
                  role="button"
                  tabIndex="0"
                >
                  <Icon name="chevron-back-18" />
                </span>
              </div>
              <span
                className="drawerIcon icon-white"
                style={style.drawerIcon}
                onTouchTap={this.handleDrawer}
                onKeyDown={this.handleDrawerkeyselect}
                role="button"
                tabIndex="0"
              >
                <Icon name="hamburger-light-18" />
              </span>

            </div>
          }
          iconElementRight={
            <div>
              <div className="bookmarkIcon" role="button" tabIndex="0">
                <BookmarkIconComponent data={bookmarkIconData} locale="en"/>
              </div>
              <div
                className="icon-white prefIcon"
                style={style.prefIcon}
                onClick={this.handlePreferenceClick}
                onKeyDown={this.handlePreferenceKeySelect}
                role="button"
                tabIndex="0"
              >
                <Icon name="font-setting-24" />
              </div>
              {this.props.isET1 ? <div className="preferences-container-eT1">{this.state.prefOpen ? <div className="content"><PreferencesComponent isET1={this.props.isET1} setCurrentZoomLevel={this.props.setCurrentZoomLevel} disableBackgroundColor={this.props.disableBackgroundColor} /></div> : <div className="empty" />} </div>
       : <div className="preferences-container">{this.state.prefOpen ? <div className="content"><PreferencesComponent fetch={this.props.getPreference} preferenceUpdate={this.props.updatePreference}
         disableBackgroundColor={false} locale="en" /></div> : <div className="empty" />} </div>}

              <div
                className="icon-white searchIcon"
                style={style.searchIcon}
                role="button"
                tabIndex="0"
                onClick={this.searchClick}
                onKeyDown={this.searchKeySelect}
              >
                <Icon name="search-lg-18" />
              </div>
              <div className="searchContainer">
                {this.state.searchOpen ? <Search locale={locale} store={this.props.store} ssoKey={this.props.ssoKey} globalBookId={this.props.globalBookId} bookId={this.props.bookId} serverDetails={this.props.serverDetails} goToPage={pageId => this.goToPage(pageId)} indexId={this.props.indexId} listClick={this.props.listClick} isET1="Y" /> : <div className="empty" />}
              </div>
              <div className="moreIcon">
                <MoreMenuComponent store={this.props.store} userid={this.props.userid} ssoKey={this.props.ssoKey} serverDetails={this.props.serverDetails} locale={this.props.locale} messages={messages} />
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
