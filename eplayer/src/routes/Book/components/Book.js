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
/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

 
// import { Viewer } from '@pearson-incubator/viewer';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
// import { BookList } from '../../../../const/MockData';
import { pageDetails } from '../../../../const/Mockdata';// booksdata, tocData

import './Book.scss';

//import { getAnnCallService, postAnnCallService, deleteAnnCallService } from '../../../actions/annotation';
//import { getBookCallService, getPlaylistCallService} from '../../../actions/playlist';

export class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: 'headerBar',
      viewerContent: true,
      currentPageDetails: '',
      pageDetails
    };
    this.onPageChange.bind(this);
    this.nodesToUnMount = [];
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);
  }

  componentDidMount() {
    const bookImageAndTitle = find(this.context.store.getState().bookshelf
      .books.data.bookshelf, bookshelf => bookshelf.manifestId === this.props.params.bookId);
    const tocImageAndTitle = {
      image: bookImageAndTitle ? bookImageAndTitle.thumbnail.src : '',
      title: bookImageAndTitle ? bookImageAndTitle.title : '',
      author: bookImageAndTitle ? bookImageAndTitle.author : ''
    };
    if (this.props.params.pageId) {
      this.props.fetchTocAndViewer(this.props.params.bookId, tocImageAndTitle, this.props.params.pageId);
    } else {
      this.props.fetchTocAndViewer(this.props.params.bookId, tocImageAndTitle);
    }
    this.props.fetchAnnotations(this.props.params.bookId);
    this.props.fetchBookmarks(this.props.params.bookId);
    this.props.fetchPreferences();
    // eslint-disable-next-line
    this.setState({
      currentPageDetails: this.state.pageDetails.playListURL[0]
    });

    // const pageUrl = this.state.currentPageDetails.playOrder;
    // eslint-disable-next-line
    //this.props.dispatch(getAnnCallService(1));
  }

  componentWillUnmount() {
    WidgetManager.navChanged(this.nodesToUnMount);
  }
  componentWillMount(){
    //this.props.dispatch(getBookCallService(this.props.params.bookId));
  }

  parseDom = () => {
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  };

  navChanged = () => {
    WidgetManager.navChanged(this.nodesToUnMount);
    this.nodesToUnMount = [];
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  }

  removeAnnotationHandler = (annotationId) => {
    // TODO: Should not need to look up currentPageId manually; bookmark-component should have currentPageId
    // to be used in its removeBookmarkHandler call
    const currentPageId = this.props.book.viewer.currentPageId;
    const targetAnnotation = find(this.props.book.annotations, annotation => annotation.pageId === currentPageId);
    const targetAnnotationId = annotationId || targetAnnotation.id;
    this.props.removeAnnotation(this.props.params.bookId, targetAnnotationId);
  };

  addBookmarkHandler = () => {
    const currentPageId = this.props.book.viewer.currentPageId;
    const targetPage = find(this.props.book.viewer.pages, pages => pages.id === currentPageId);
    const bookmark = {
      jsonData: {
        uri: currentPageId,
        data: {
          //eslint-disable-next-line
          baseUrl: 'https://content.stg-openclass.com/eps/pearson-reader/api/item/12d4a34c-e9ff-4537-b4b0-c1538ac01af2/1/file/QA_TEST_FILE/'
        },
        title: targetPage.title,
        labels: [targetPage.title]
      },
      createdBy: 'cite_qauser1'
    };
    this.props.addBookmark(this.props.params.bookId, bookmark);
  }

  removeBookmarkHandler = (bookmarkId) => {
    // TODO: Should not need to look up currentPageId manually; bookmark-component should have currentPageId
    // to be used in its removeBookmarkHandler call
    const currentPageId = this.props.book.viewer.currentPageId;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    const targetBookmarkId = bookmarkId || targetBookmark.id;
    this.props.removeBookmark(this.props.params.bookId, targetBookmarkId);
  };

  onPageChange = (type, data) => {
    this.setState({
      currentPageDetails: data
    });
    const pageId = data.playOrder;
    // console.log('currentPage url', pageId);
    // eslint-disable-next-line
    this.props.dispatch(getAnnCallService(pageId));
  }

  isCurrentPageBookmarked = () => {
    const currentPageId = this.props.book.viewer.currentPageId;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  };

  goToPageCallback = (pageId) => {
    const playListData = {
      playListURL: pageDetails.playListURL,
      baseUrl: pageDetails.baseUrl,
      currentPageURL: {
        href: 'OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml',
        playOrder: pageId,
        title: '1.2 Hypothesis Testing'
      }
    };
    this.setState({
      pageDetails: playListData
    });
  };

  viewerContentCallBack = (viewerCallBack) => {
    this.setState({ viewerContent: viewerCallBack });
  }

  annotationCallBack = (eventType, data) => {
    // console.log('data stack', eventType);
    switch (eventType) {
      case 'annotationCreated': {
        //return this.props.dispatch(postAnnCallService(data));
      }
      case 'annotationDeleted': {
        //return this.props.dispatch(deleteAnnCallService(data));
      }
      default : {
        return eventType;
      }
    }
  }
  
  render() {
    const callbacks = {};
    const { annotionData, loading ,playlistData } = this.props;// eslint-disable-line react/prop-types
    /*this.state.pageDetails.baseUrl                = playlistData.baseUrl;
    this.state.pageDetails.currentPageDetails     = playlistData.content[1];*/
    this.state.pageDetails.baseUrl                = 'https://content.openclass.com/eps/pearson-reader/api/item/0c0c9911-1724-41d7-8d05-f1be29193d3c/1/file/qatesting_changing_planet_v2_sjg/changing_planet/';
    this.state.pageDetails.currentPageDetails     = {
      href: 'OPS/s9ml/chapter02/why_are_age_structures_and_dependency_ratios_important.xhtml',
      id: '1',
      playOrder: 1,
      title:"Cover"
    }
    this.state.pageDetails.playListURL            = playlistData.content;

    callbacks.removeAnnotationHandler             = this.removeAnnotationHandler;
    callbacks.addBookmarkHandler                  = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler               = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked             = this.isCurrentPageBookmarked;
    callbacks.goToPageCallback                    = this.goToPageCallback;
    // this.props.book.toc.content = {};
    // this.props.book.toc.content.list = tocData;

    return (
      <div>
        <Header
          classname={this.state.classname}
          bookData={this.props.book}
          bookCallbacks={callbacks}
          store={this.context.store}
          viewerContentCallBack={this.viewerContentCallBack}
        />
        { !this.props.book.isFetching.viewer &&
          this.props.book.viewer.pages &&
          this.props.book.viewer.pages.length > 0 &&
          <div className={this.state.viewerContent ? 'viewerContent' : 'fixedviewerContent'}>
          </div>
        }
      </div>
    );
  }
}


Book.propTypes = {
  fetchTocAndViewer: React.PropTypes.func,
  fetchAnnotations: React.PropTypes.func,
  removeAnnotation: React.PropTypes.func,
  fetchBookmarks: React.PropTypes.func,
  addBookmark: React.PropTypes.func,
  removeBookmark: React.PropTypes.func,
  fetchPreferences: React.PropTypes.func,
  // goToPage: React.PropTypes.func,
  book: React.PropTypes.object,
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func
};

Book.contextTypes = {
  store: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired
};

const mapStateToProps = state => (
      { 
        annotionData: state.annotationReducer.data, 
        loading: state.annotationReducer.loading, 
        playlistData: state.playlistReducer.data
      }
);// eslint-disable-line max-len
Book = connect(mapStateToProps)(Book);// eslint-disable-line no-class-assign
export default Book;
