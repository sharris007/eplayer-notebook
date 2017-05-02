import React from 'react';
import AppBar from 'material-ui/AppBar';
import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { PreferencesComponent } from '@pearson-incubator/preferences';
import { BookmarkIcon } from '@pearson-incubator/bookmark-icon';
import Icon from '../Icon';
import './Header.scss';
import DrawerComponent from './Drawer';
import Search from '../search/containers/searchContainer';
import MoreMenuComponent from '../moreMenu/containers/moreMenuContainer';
import { injectReducer } from '../../store/reducers';


export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      prefOpen: false,
      headerExists: false,
      searchOpen: false,
      goToTextVal:''
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
    if(this.props.bookData.toc.content!==undefined)
    {
      this.props.bookData.toc.content={};
      this.props.bookData.bookmarks=[];
      this.props.bookData.bookinfo=[];
    }
    browserHistory.push('/eplayer/bookshelf');
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
    //return  this.state.goToTextVal.trim();   
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
      isCurrentPageBookmarked: this.props.bookCallbacks.isCurrentPageBookmarked,
      goToPageClick : this.props.bookCallbacks.goToPageClick,
      goToTextChange : this.props.bookCallbacks.goToTextChange
    };

    const targetPageId = this.props.bookData.viewer.currentPageId;
    const currPageObj = find(this.props.bookData.viewer.pages, page => page.id === targetPageId);
    const title = sessionStorage.getItem('title');
    return (
      <div className={`${this.props.classname} ${this.state.headerExists ? 'nav-up' : ''}`} >
        <AppBar
          title = {this.props.isET1 == 'Y' ?  this.props.title || title :  this.props.pageTitle  }
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
              <div className="gotopage-wrapper">
                <input type="text" id="pageNum" placeholder="Go to page" title="Go to page - Enter a page number, like 34, xii, or A-15. Press enter to submit" onChange={ this.goToTextChange } onKeyDown = {(e) => this.goToPageOnKeyUp(e)}/>
                 <button className="btn btn-link gotopage-button" onClick={this.goToPageClick}>
                 <i className="fa fa-arrow-circle-right" aria-hidden="true"></i>
                </button>
              </div>
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
                {this.state.searchOpen ? <Search store={this.props.store} ssoKey={this.props.ssoKey} globalBookId={this.props.globalBookId} bookId={this.props.bookId} serverDetails={this.props.serverDetails} goToPage={(pageId)=>this.goToPage(pageId)} indexId = {this.props.indexId} listClick = {this.props.listClick} isET1 = 'Y'/> : <div className="empty" />}
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
            isOpen={this.props.drawerOpen}
            hideDrawer={this.hideDrawer}
            isET1={this.props.isET1}
          />
        }
       {this.props.isET1 ? <div className="preferences-container-eT1">  {this.state.prefOpen ? <div className="content"><PreferencesComponent isET1={this.props.isET1} setCurrentZoomLevel={this.props.setCurrentZoomLevel} disableBackgroundColor={this.props.disableBackgroundColor}/></div> : <div className="empty" />} </div>  
       : <div className="preferences-container">  {this.state.prefOpen ? <div className="content"><PreferencesComponent isET1={this.props.isET1} setCurrentZoomLevel={this.props.setCurrentZoomLevel} preferenceUpdate = {this.props.preferenceUpdate} preferenceBackgroundColor  = { this.props.preferenceBackgroundColor }/></div> : <div className="empty" />} </div>} 
     
      </div>
    );
  }
}

Header.propTypes = {
  classname: React.PropTypes.string,
  bookData: React.PropTypes.object,
  bookCallbacks: React.PropTypes.object,
  store: React.PropTypes.object,
  viewerContentCallBack: React.PropTypes.func,
  goToTextChange : React.PropTypes.func,
  goToPageClick : React.PropTypes.func
};

export default Header;
