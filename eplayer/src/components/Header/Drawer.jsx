import React from 'react';
import {ReactDOM} from 'react-dom';
import SwipeableViews from 'react-swipeable-views';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';
import { Tabs, Tab } from 'material-ui/Tabs';
import { TableOfContentsComponent } from '@pearson-incubator/toc';
import { BookmarkListComponent } from '@pearson-incubator/bookmarks';
import { NoteListComponent } from '@pearson-incubator/notes';
import './Drawer.scss';

var locale;
let counter = -1;
let rowCount = 0;
const grey = '#f5f5f5';
const bkgColor = '#FFF';
const drawerColor = '#3e3e3e';
const eighteen = 18;
const fortyNine = 49;
const bcolor = '#005a70';
const four = 4;
const normal = 'normal';
const center = 'center';
class DrawerComponent extends React.Component {
  constructor(props) {
    super(props);
    if(this.props.locale=="en-US-HE")
    {
      locale="en-US";
    }
    else if(this.props.locale=="es-US-CG" || this.props.locale=="es-ES-CS" || this.props.locale=="es-MX-LA")
    {
      locale="es-US";
    }
    else if(this.props.locale=="fr-FR-CG")
    {
      locale="fr";
    }
    else if(this.props.locale=="en-CA-PS" || this.props.locale=="en-CA-ER" )
    {
      locale="en-CA";
    }
    else
    {
      locale=this.props.locale;
    }
    this.state = {
      slideIndex: 0,
      drawerOpen: false,
      tocData:''
    };



  }

  componentDidMount() {
    this.drawerListFocus();
  }
  componentDidUpdate() {
    this.drawerListFocus();
  }

  drawerListFocus = () => {
    if (this.state.slideIndex === 0) {
      this.onActive('contents');
      rowCount = document.getElementsByClassName('toc-parent').length;
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
    if (reqIndex >= 0) {
      if (this.state.slideIndex === 0) {
        document.getElementsByClassName('toc-parent')[reqIndex].focus();
      } else if (this.state.slideIndex === 1) {
        document.getElementsByClassName('o-bookmark-content')[reqIndex].focus();
      } else if (this.state.slideIndex === 2) {
        document.getElementsByClassName('note-link')[reqIndex].focus();
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

  onActive = (tabid) => {
    const tabcontent = document.getElementsByClassName('tablabel');
    for (let i = 0; i < tabcontent.length; i += 1) {
      tabcontent[i].className = tabcontent[i].className.replace(' active', '');
    }
    document.getElementById(tabid).className += ' active';
    document.getElementById(tabid).focus();
  }

  render() {
    
    const drawerTab = {
      tabHeader: {
        backgroundColor: bkgColor,
        color: drawerColor,
        textTransform: 'none',
        fontSize: eighteen,
        fontWeight: normal,
        fontStyle: normal,
        fontStretch: normal,
        textAlign: center,
        paddingTop: fortyNine
        // borderRadius: 10
      },
      inlineinkBarStyle: {
        backgroundColor: bcolor,
        height: four
      }
    };
    const mystyle = {
      overflow: 'hidden',
      backgroundColor: grey
    };
    return (< Drawer
      docked={false}
      width={400}
      open={this.props.isOpen}
      onRequestChange={this.props.hideDrawer}
      className="drawerWrap"
      tabIndex="0"
      role="dialog"
      containerStyle={mystyle}
    >
      < div
        className="tabCompwrapper"
        tabIndex="0"
        role="dialog"
        onKeyUp={this.onArrowKeyPress}
      >
        < Tabs
          inkBarStyle={drawerTab.inlineinkBarStyle}
          className="tabComp"
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          < Tab
            label={this.props.messages !=undefined ? this.props.messages.contents : 'Contents'}
            id="contents"
            style={drawerTab.tabHeader}
            onActive={
                () => this.onActive('contents')
            }
            className="tablabel active"
            onKeyDown={this.keyBoardNavigation}
            value={0}
          /> < Tab
            label={this.props.messages !=undefined ? this.props.messages.bookmarks : 'Bookmarks'} 
            id="bookmarks"
            style={drawerTab.tabHeader}
            onActive={
                () => this.onActive('bookmarks')
            }
            className="tablabel "
            onKeyDown={this.keyBoardNavigation}
            value={1}
          /> < Tab
            label={this.props.messages !=undefined ? this.props.messages.notes : 'Notes'} 
            id="notes"
            style={drawerTab.tabHeader}
            onActive={
                () => this.onActive('notes')
            }
            className="tablabel "
            onKeyDown={this.keyBoardNavigation}
            value={2}
          /> < /Tabs > < SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            className="swipeviewStyle"
          >
            { this.props.bookData.toc.content &&
              < TableOfContentsComponent
                separateToggleIcon
                data={ this.props.bookData.toc}
                showDuplicateTitle
                depth={5}
                childField={'children'}
                clickTocHandler={this.props.bookCallbacks.goToPageCallback}
                locale={locale}
              />
            }
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
          < /SwipeableViews> < /div > < /Drawer>
    );
  }
}

DrawerComponent.propTypes = {
  bookData: React.PropTypes.object.isRequired,
  bookCallbacks: React.PropTypes.object,
  isOpen: React.PropTypes.bool.isRequired,
  hideDrawer: React.PropTypes.func.isRequired
};

export default DrawerComponent;
