import React from 'react';
import AppBar from 'material-ui/AppBar';
import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { Preferences } from '@pearson-incubator/preferences';
import { BookmarkIcon } from '@pearson-incubator/bookmark-icon';
import Icon from '../Icon';
import './Header.scss';
import DrawerComponent from './Drawer';
import Search from '../search/containers/searchContainer';
import MoreMenuComponent from '../moreMenu/containers/moreMenuContainer';
// import { injectReducer } from '../../store/reducers';


export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      prefOpen: false,
      headerExists: false,
      searchOpen: false
    };

  }

  componentWillUnmount() {
    if (this.headerInterval) {
      clearInterval(this.headerInterval);
    }
    this.headerInterval = false;
  }

  componentDidMount() {
    let didScroll = false;
    let lastScrollPosition = 0;
    window.addEventListener('scroll', () => {
      didScroll = true;
    });
    this.headerInterval = setInterval(() => {
      if (didScroll) {
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        const currentScrollPosition = window.pageYOffset;
        const pageEndReached = currentScrollPosition + window.innerHeight === documentHeight;
        // Scrolling down
        if (currentScrollPosition > lastScrollPosition && !pageEndReached) {
          this.setState({
            headerExists: true
          });
        } else {
          this.setState({
            headerExists: false
          });
        }
        lastScrollPosition = currentScrollPosition;
        didScroll = false;
      }
    }, 100);
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
    this.setState({ drawerOpen: false });
    this.props.viewerContentCallBack(true);
  }

  handleBookshelfClick = () => {
    browserHistory.push('/');
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

  searchKeySelect = (event) => {
    if ((event.which || event.keyCode) === 13) {
      this.searchClick();
    }
    if ((event.which || event.keyCode) === 27) {
      this.searchClick();
    }
  }

  render() {
    const style = {
      rightIcons: {
        margin: '15px 15px 0 0'
      },
      moreIcons: {
        color: '#FFFFFF'
      },
      leftIcons: {
        margin: '0px'
      },
      bookshelfIcon: {
        margin: '21px 0 0 20px'
      },
      drawerIcon: {
        margin: '21px 0 0 30px',
        height: '16.5px',
        width: '18px'
      },
      prefIcon: {
        margin: '15px 0 0 0'
      },
      appBar: {
        paddingLeft: '0px',
        minWidth: '480px',
        title: {
          fontFamily: 'Open Sans',
          fontSize: '18px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontStretch: 'normal',
          color: '#ffffff',
          textAlign: 'center'
        },
        navUp: {
          top: '-84px'
        }
      }
    };

    const bookmarkIconData = {
      addBookmarkHandler: this.props.bookCallbacks.addBookmarkHandler,
      removeBookmarkHandler: this.props.bookCallbacks.removeBookmarkHandler,
      isCurrentPageBookmarked: this.props.bookCallbacks.isCurrentPageBookmarked
    };

    const targetPageId = this.props.bookData.viewer.currentPageId;
    const currPageObj = find(this.props.bookData.viewer.pages, page => page.id === targetPageId);

    return (
      <div className={`${this.props.classname} ${this.state.headerExists ? 'nav-up' : ''}`} >
        <AppBar
          title={currPageObj ? currPageObj.title : ''}
          titleStyle={style.appBar.title}
          style={style.appBar}
          iconStyleLeft={style.leftIcons}
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
                className="icon-white"
                style={style.drawerIcon}
                onTouchTap={this.handleDrawer}
                onKeyDown={this.handleDrawerkeyselect}
                role="button"
                tabIndex="0"
              >
                <Icon name="view-list-18" />
              </span>

            </div>
          }
          iconElementRight={
            <div>
              <div className="bookmarkIcon" role="button" tabIndex="0">
                <BookmarkIcon data={bookmarkIconData} />
              </div>
              <span
                className="icon-white prefIcon"
                style={style.prefIcon}
                onClick={this.handlePreferenceClick}
                onKeyDown={this.handlePreferenceKeySelect}
                role="button"
                tabIndex="0"
              >
                <Icon name="font-setting-24" />
              </span>
              <div
                className="icon-white"
                role="button"
                tabIndex="0"
                onClick={this.searchClick}
                onKeyDown={this.searchKeySelect}
              >
                <Icon name="search-lg-18" />
              </div>
              <div className="searchContainer">
                {this.state.searchOpen ? <Search
                  store={this.props.store}
                  listClick={this.searchClick}
                  searchKeySelect={this.searchKeySelect}
                  clickSearchListHandler={this.props.bookCallbacks.goToPageCallback}
                /> : <div className="empty" />}
              </div>
              <div className="moreIcon">
                <MoreMenuComponent store={this.props.store} />
              </div>
            </div>}
        />
        {
          this.state.drawerOpen &&
          <DrawerComponent
            bookData={this.props.bookData}
            bookCallbacks={this.props.bookCallbacks}
            isOpen={this.state.drawerOpen}
            hideDrawer={this.hideDrawer}
          />
        }
        <div className="preferences-container">
          {this.state.prefOpen ? <div className="content"><Preferences /></div> : <div className="empty" />}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  classname: React.PropTypes.string,
  bookData: React.PropTypes.object,
  bookCallbacks: React.PropTypes.object,
  store: React.PropTypes.object,
  viewerContentCallBack: React.PropTypes.func
};

export default Header;
