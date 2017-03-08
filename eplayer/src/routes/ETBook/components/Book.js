/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PageViewer } from 'pxe-pageviewer';
import { Annotation } from 'pxe-annotation';
import { GlossaryPopUp } from 'pxe-glossary-popup';
import { MoreInfoPopUp } from 'pxe-moreinfo-popup';
// import { Annotation } from 'pxe-annotation';
// import { Viewer } from '@pearson-incubator/viewer';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
// import { BookList } from '../../../../const/MockData';
import { pageDetails } from '../../../../const/Mocdata';// booksdata, tocData
import './Book.scss';
import { browserHistory } from 'react-router';
import { getAnnCallService, postAnnCallService, deleteAnnCallService } from '../../../actions/annotation';
import { getBookCallService, getPlaylistCallService} from '../../../actions/playlist';

export class Book extends Component {
  constructor(props) {
      super(props);
      this.state = {
        classname: 'headerBar',
        viewerContent: true,
        currentPageDetails: '',
        pageDetails, 
        bookLoaded : false,
        currentPageTitle:''

      };
      this.onPageChange.bind(this);
      this.nodesToUnMount = [];
      document.body.addEventListener('contentLoaded', this.parseDom);
      document.body.addEventListener('navChanged', this.navChanged);
  }
  componentWillMount(){
    const bookId = this.props.params.bookId;
    const pageId = this.props.params.pageId;
    this.props.dispatch(getBookCallService(this.props.params.bookId));
  }
  componentDidMount() {
   
    // eslint-disable-next-line
    this.setState({
      currentPageDetails: this.state.pageDetails.playListURL[0]
    });
    // eslint-disable-next-line
    this.props.dispatch(getAnnCallService(1));
  }

  componentWillUnmount() {
    WidgetManager.navChanged(this.nodesToUnMount);
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
    const pageId = data.id;
    const bookId = this.props.params.bookId;
    const playOrder = data.playOrder;
    this.setState({
      currentPageTitle :data.title

    });
    // eslint-disable-next-line
    this.props.dispatch(getAnnCallService(playOrder));
    browserHistory.replace(`/eplayer/ETbook/${bookId}/page/${pageId}`);
  }

  isCurrentPageBookmarked = () => {
    const currentPageId = this.props.book.viewer.currentPageId;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  };

  viewerContentCallBack = (viewerCallBack) => {
    this.setState({ viewerContent: viewerCallBack });
  }

  annotationCallBack = (eventType, data) => {
  switch (eventType) {

      case 'annotationCreated': {
        return this.props.dispatch(postAnnCallService(data));
      }
      case 'annotationDeleted': {
        return ((data._id)?this.props.dispatch(deleteAnnCallService(data)):'');
      }
      default : {
        return eventType;
      }
    }
  }
 
  onBookLoaded = (bload) => {
     this.setState({
      bookLoaded : bload
    });

  }
 
  
  render() {
    const callbacks = {};
    let annData = [];
    const { annotionData, loading ,playlistData, playlistReceived} = this.props;// eslint-disable-line react/prop-types
    annData  = annotionData;
    const filteredData = find(playlistData.content, list => list.id === this.props.params.pageId);
    
    if(Array.isArray(annotionData)==false){
      annData = [];
      annData.push(annotionData);
    }
    
    if(playlistReceived){
        this.state.pageDetails.baseUrl                = playlistData.baseUrl;
        this.state.pageDetails.currentPageURL         = playlistData.content[1];
        this.state.pageDetails.playListURL            = playlistData.content; 
        if(this.props.params.pageId){
          // for the first page it is set to current page URL
          this.state.pageDetails.currentPageURL         = filteredData;
        }
    }
    callbacks.removeAnnotationHandler = this.removeAnnotationHandler;
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    // callbacks.goToPageCallback = this.goToPageCallback;
    return (
      <div>
        <Header
          classname={this.state.classname}
          pageTitle = {this.state.currentPageTitle}
          bookData={this.props.book}
          bookCallbacks={callbacks}
          store={this.context.store}
          viewerContentCallBack={this.viewerContentCallBack}
        />
          <div className={this.state.viewerContent ? 'viewerContent' : 'fixedviewerContent'}>
            {playlistReceived ? <PageViewer src={this.state.pageDetails} sendPageDetails={this.onPageChange} onBookLoaded = {(bload) => this.onBookLoaded(bload)} /> : ''}
            {this.state.bookLoaded ? <GlossaryPopUp bookDiv = "book-container" /> : ''}
            {this.state.bookLoaded ? <MoreInfoPopUp bookDiv = "book-container" /> : ''}   
            {playlistReceived ? <Annotation shareableAnnotations={true} annotationData={annData} contentId="pxe-viewer" annotationEventHandler={this.annotationCallBack.bind(this)} currentPageDetails={this.state.currentPageDetails} /> : ''}
          </div>
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
        playlistData: state.playlistReducer.data,
        playlistReceived :state.playlistReducer.playlistReceived
      }
);// eslint-disable-line max-len
Book = connect(mapStateToProps)(Book);// eslint-disable-line no-class-assign
export default Book;
