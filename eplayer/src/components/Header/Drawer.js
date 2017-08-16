import React from 'react';
// import {ReactDOM} from 'react-dom';
import SwipeableViews from 'react-swipeable-views';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';
import { Tabs, Tab } from 'material-ui/Tabs';
import { TableOfContentsComponent } from '@pearson-incubator/toc';
import { BookmarkListComponent } from '@pearson-incubator/bookmarks';
import { NoteListComponent } from '@pearson-incubator/notes';
import './Drawer.scss';
import RefreshIndicator from 'material-ui/RefreshIndicator';

let locale;
let counter = -1;
let rowCount = 0;
class DrawerComponent extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.locale === 'en-US-HE') {
      locale = 'en-US';
    } else if (this.props.locale === 'es-US-CG' || this.props.locale === 'es-ES-CS' || this.props.locale === 'es-MX-LA') {  // eslint-disable-line
      locale = 'es-US';
    } else if (this.props.locale === 'fr-FR-CG') {
      locale = 'fr';
    } else if (this.props.locale === 'en-CA-PS' || this.props.locale === 'en-CA-ER') {
      locale = 'en-CA';   
    } else {
      locale = this.props.locale;
    }   
    this.state = {
      slideIndex: 0,
      drawerOpen: false,
      tocData: ''
    };
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.drawerListFocus();
    }
  }
  componentDidUpdate() {
    if (this.props.isOpen) {
      this.drawerListFocus();
    }
  }

  drawerListFocus = () => {
    if (this.state.slideIndex === 0) {
      this.onActive('contents');
      rowCount = document.getElementsByClassName('list-group-item').length;
            // alert(rowCount);
    } else if (this.state.slideIndex === 1) {
      this.onActive('bookmarks');
      rowCount = document.getElementsByClassName('o-bookmark-section').length;
            // alert(rowCount);
    } else if (this.state.slideIndex === 2) {
      this.onActive('notes');
      rowCount = document.getElementsByClassName('note-link').length;
            // alert(rowCount);
    }
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value
    });
  };

  increment = () => {
    if (this.state.slideIndex === 2) {
      this.setState({ slideIndex: 0 });
      this.onActive('contents');
    } else {
      if (this.state.slideIndex === 1) {
        this.onActive('notes');
      } else if (this.state.slideIndex === 0) {
        this.onActive('bookmarks');
      }
      this.setState({ slideIndex: this.state.slideIndex + 1 });
    }
  };

  decrement = () => {
    if (this.state.slideIndex === 0) {
      this.setState({ slideIndex: 2 });
      this.onActive('notes');
    } else {
      this.setState({ slideIndex: this.state.slideIndex - 1 });
      if (this.state.slideIndex === 1) {
        this.onActive('contents');
      } else if (this.state.slideIndex === 2) {
        this.onActive('bookmarks');
      }
    }
  };

  setFocusbyClassName = (reqIndex) => {
    let focusIndex = reqIndex;
    if (focusIndex >= 0) {
      if (this.state.slideIndex === 0) {
        let expanded = 'false';
        if (focusIndex !== 0) {
          if (keyAction === 'keydown') {
            expanded = document.getElementsByClassName('list-group-item')[focusIndex - 1]
            .querySelector('a.content').getAttribute('aria-expanded');
            if (expanded !== 'true') {
              const childLen = document.getElementsByClassName('list-group-item')[focusIndex - 1]
              .getElementsByClassName('list-group-item').length;
              focusIndex += childLen;
              counter = focusIndex;
            }
          } else if (keyAction === 'keyup') {
            const elm = document.getElementsByClassName('list-group-item')[focusIndex];
            expanded = this.findParentBySelector(elm, '.child-list-group');
            if (expanded !== null) {
              const isparentHidden = expanded.getAttribute('aria-hidden');
              if (isparentHidden === 'true') {
                const upchildLen = expanded.getElementsByClassName('list-group-item').length;
                focusIndex -= upchildLen;
                counter = focusIndex;
                this.setFocusbyClassName(focusIndex, 'keyup');
              }
            }
          }
        }
        document.getElementsByClassName('list-group-item')[focusIndex].querySelector('a.content').focus();
      } else if (this.state.slideIndex === 1) {
        document.getElementsByClassName('o-bookmark-content')[focusIndex].focus();
      } else if (this.state.slideIndex === 2) {
        document.getElementsByClassName('note-link')[focusIndex].focus();
      }
    }
  }



  navUpList = (reqIndex) => {
    this.setFocusbyClassName(reqIndex);
  }

  navDownList = (reqIndex) => {
    this.setFocusbyClassName(reqIndex);
  }

  onArrowKeyPress = (event) => {
    if (event.which === 38 || event.keyCode === 38) { // up Arrow key
      event.preventDefault();

      if (counter > 0) {
        counter--;
      }
      if (counter >= 0) {
        this.navUpList(counter);
      }
    } else if (event.which === 40 || event.keyCode === 40) { // down Arrow key
      event.preventDefault();
      if (counter < rowCount - 1) {
        counter++;
      }
      if (counter < rowCount) {
        this.navDownList(counter);
      }
    } else if (event.which === 37 || event.keyCode === 37) {
      event.preventDefault();
      this.decrement();
      counter = -1;
    } else if (event.which === 39 || event.keyCode === 39) {
      event.preventDefault();
      this.increment();
      counter = -1;
    } else if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
            // event.preventDefault();
    }
  }

  keyBoardNavigation = (event) => {
    event.preventDefault();
    if (this.state.slideIndex === 0) {
      if (event.which === 9 || event.keyCode === 9) {
        if (!event.shiftKey) {
          this.setState({ slideIndex: 1 });
          this.onActive('bookmarks');
        } else if (event.shiftKey) {
          this.setState({ slideIndex: 2 });
          this.onActive('notes');
        }
      }
    } else if (this.state.slideIndex === 1) {
      if (event.which === 9 || event.keyCode === 9) {
        if (!event.shiftKey) {
          this.setState({ slideIndex: 2 });
          this.onActive('notes');
        } else if (event.shiftKey) {
          this.setState({ slideIndex: 0 });
          this.onActive('contents');
        }
      }
    } else if (this.state.slideIndex === 2) {
      if (event.which === 9 || event.keyCode === 9) {
        if (!event.shiftKey) {
          this.setState({ slideIndex: 0 });
          this.onActive('contents');
        } else if (event.shiftKey) {
          this.setState({ slideIndex: 1 });
          this.onActive('bookmarks');
        }
      }
    }
  }
  
  fixSwipableHeight = () => {
    if (this.tabCompwrapper) {
      const drawerHeight = this.tabCompwrapper.parentElement.clientHeight;
      const titleSectionHeight = this.titleSection.clientHeight;
      const swipableDiv = document.querySelectorAll('.swipeviewStyle div div[aria-hidden="false"]')[0];
      if (swipableDiv) {
        swipableDiv.style.height = `${drawerHeight - titleSectionHeight}px`;
      }
    }
  }

  onActive = (tabid) => {
    const tabcontent = document.getElementsByClassName('tablabel');
    for (let i = 0; i < tabcontent.length; i += 1) {
      tabcontent[i].className = tabcontent[i].className.replace(' active', '');
    }
    document.getElementById(tabid).className += ' active';
    document.getElementById(tabid).focus();
    const isContentTabActive = document.querySelectorAll('.tablabel.active')[0].classList.contains('contentTab');
    const isBookmarkTabActive = document.querySelectorAll('.tablabel.active')[0].classList.contains('bookmarksTab');
    if (isContentTabActive) {
      this.bottomBar.classList.remove('bookmarksTab', 'notesTab');
      this.bottomBar.classList.add('contentTab');
    } else if (isBookmarkTabActive) {
      this.bottomBar.classList.remove('contentTab', 'notesTab');
      this.bottomBar.classList.add('bookmarksTab');
    } else {
      this.bottomBar.classList.remove('contentTab', 'bookmarksTab');
      this.bottomBar.classList.add('notesTab');
    }
    setTimeout(() => {
     this.fixSwipableHeight();
    }, 100);
  }
  

  render() {
    const drawerTab = {
      inkBarStyle: {
        height: '0px'
      },
      buttonStyle: {
        height: 'auto',
        alignItems: 'left'
      },
      notesButtonStyle: {
        alignItems: 'right',
        height: 'auto'
      },
      tabItemContainerStyle: {
        backgroundColor: 'transparent'
      },
      style: {
        overflow: 'hidden',
        backgroundColor: '#f5f5f5'
      }
    };
    const callbacks = {};
    callbacks.onActive = this.onActive;
    callbacks.changeState = this.changeState;
    const isTocWrapperRequired = false;
    return (<Drawer
      docked={false}
      width={400}
      open={this.props.isOpen}
      onRequestChange={this.props.hideDrawer}
      className="drawerWrap"
      tabIndex="0"
      role="dialog"
      containerStyle={drawerTab.style}
    >{this.props.isOpen &&
      <div
        ref={(tabCompwrapper) => { this.tabCompwrapper = tabCompwrapper; }}
        className="tabCompwrapper"
        tabIndex="0"
        role="dialog"
        onKeyUp={this.onArrowKeyPress}
      >
      <div className="bookTitleAndTabs" ref={(titleSection) => { this.titleSection = titleSection; }}>
        <div className="bookTitleSection">
          <div className="title">{this.props.bookData.toc.content.mainTitle}</div>
          <div className="author">{this.props.bookData.toc.content.author}</div>
        </div>
        <Tabs
          inkBarStyle={drawerTab.inkBarStyle}
          tabItemContainerStyle={drawerTab.tabItemContainerStyle}
          className="tabComp"
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab
            label={this.props.messages !== undefined ? this.props.messages.contents : 'Contents'}
            id="contents"
            style={drawerTab.tabStyle}
            onActive={ () => this.onActive('contents') }
            buttonStyle={drawerTab.buttonStyle}
            className="contentTab tablabel active"
            onKeyDown={this.keyBoardNavigation}
            value={0}
          /> <Tab
            label={this.props.messages !== undefined ? this.props.messages.bookmarks : 'Bookmarks'}
            id="bookmarks"
            style={drawerTab.bookmarks}
            onActive={ () => this.onActive('bookmarks') }
            buttonStyle={drawerTab.buttonStyle}
            className="bookmarksTab tablabel"
            onKeyDown={this.keyBoardNavigation}
            value={1}
          /> <Tab
            label={this.props.messages !== undefined ? this.props.messages.notes : 'Notes'}
            id="notes"
            style={drawerTab.notes}
            buttonStyle={drawerTab.buttonStyle}
            onActive={ () => this.onActive('notes') }
            className="notesTab tablabel"
            onKeyDown={this.keyBoardNavigation}
            value={2}
          /> </Tabs > 
          <div className="bottomBar" ref={(bottomBar) => { this.bottomBar = bottomBar; }} />
        </div>

          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            className="swipeviewStyle"
          >
            
             
              {this.props.bookData.tocReceived ? < TableOfContentsComponent
                separateToggleIcon
                data={this.props.bookData.toc}
                showDuplicateTitle
                depth={5}
                childField={'children'}
                clickTocHandler={this.props.bookCallbacks.goToPageCallback}
                locale={locale}
                isTocWrapperRequired={isTocWrapperRequired}
                currentPageId={this.props.pageId}
              />:<RefreshIndicator size={30} left={150} top={140} status="loading" />}
            
            { this.props.bookData.bookmarks &&
              <BookmarkListComponent
                bookmarksArr={this.props.bookData.bookmarks}
                clickBookmarkHandler={this.props.bookCallbacks.goToPageCallback}
                removeBookmarkHandler={this.props.bookCallbacks.removeBookmarkHandler}
                isET1={this.props.isET1}
                locale={locale}
              />
             }
            { this.props.bookData.annTotalData &&
            < NoteListComponent
              notes={this.props.bookData.annTotalData}
              clickNoteHandler={this.props.bookCallbacks.goToPageCallback}
              removeNoteHandler={this.props.bookCallbacks.removeAnnotationHandler}
              locale={locale}
            />
            }
           
          </SwipeableViews> </div > } </Drawer>
    );
  }
}

DrawerComponent.propTypes = {
  bookData: React.PropTypes.object.isRequired,
  bookCallbacks: React.PropTypes.object,
  isOpen: React.PropTypes.bool.isRequired,
  hideDrawer: React.PropTypes.func.isRequired,
  locale: React.PropTypes.string,
  messages: React.PropTypes.object,
  isET1: React.PropTypes.bool
};

export default DrawerComponent;
