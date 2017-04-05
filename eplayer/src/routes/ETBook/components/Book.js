  /* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageViewer } from 'pxe-pageviewer';
import { Annotation } from 'pxe-annotation';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
import { pageDetails } from '../../../../const/Mocdata'; 
import './Book.scss';
import { browserHistory } from 'react-router';
import { getAnnCallService, postAnnCallService, putAnnCallService,deleteAnnCallService } from '../../../actions/annotation';
import { getBookCallService, getPlaylistCallService} from '../../../actions/playlist';

import { getBookmarkCallService} from '../../../actions/bookmark';
import {Wrapper} from 'pxe-wrapper';
import {PopUpInfo} from '@pearson-incubator/popup-info';

export class Book extends Component {
  constructor(props) {
      super(props);
      this.state = {
        classname: 'headerBar',
        viewerContent: true,
        drawerOpen: true,
        currentPageDetails: '',
        pageDetails, 
        bookLoaded : false,
        currentPageTitle:'',
        annAttributes :'',
        popUpCollection:'',
        tocUrl :'',
        tocUpdated:false
      };
      this.divGlossaryRef = '';
      this.wrapper = '';
      // this.onPageChange.bind(this);
      this.nodesToUnMount = [];
      this.popUpCollection = [];

      
      document.body.addEventListener('contentLoaded', this.parseDom);
      document.body.addEventListener('navChanged', this.navChanged);
  }
  componentWillMount(){
    const bookId = this.props.params.bookId;
    const pageId = this.props.params.pageId;
    
    if(this.state.currentPageDetails.href){
      const pageUri = encodeURIComponent(this.state.currentPageDetails.href);
      const queryString = {
        context : bookId,
        uri     : pageUri,
        user    :'epluser'
      }
      this.props.dispatch(getAnnCallService(queryString));
    }
    this.props.dispatch(getBookCallService(this.props.params.bookId));
  }
  componentDidMount() {    
    const customeAttributes ={
        playOrder: 'playOrder',
        href     :'href',
        createdTimestamp:'createdTimestamp',
        updatedTimestamp:'updatedTimestamp',
        text  :'text',
        user:'user',
        context:'context',
        ranges :'ranges',
        quote:'quote',
        shareable:'shareable'
    };
    this.setState({
      annAttributes:customeAttributes
    });
    
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
    
    this.setState({ currentPageDetails: data  });
    const pageId = data.id;
    const bookId = this.props.params.bookId;
    const playOrder = data.playOrder;
    this.setState({ currentPageTitle :data.title  });
    // eslint-disable-next-line
    const pageUri = encodeURIComponent(data.href);
    const queryString = {
      context : bookId,
      uri     : pageUri,
      user    :'epluser'
    }
    this.props.dispatch(getAnnCallService(queryString));
    this.props.dispatch(getBookmarkCallService(queryString));
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
  goToPageCallback = (pageId) => {
    const currentData = find(this.state.pageDetails.playListURL, list => list.id === pageId);
    const playpageDetails  = this.state.pageDetails ; 
    playpageDetails.currentPageURL =  currentData;
    playpageDetails.tocUpdated  = true;
    this.setState({
      pageDetails: playpageDetails
      
    });
    this.setState({ drawerOpen: false });
    this.viewerContentCallBack(true);
  };
  annotationCallBack = (eventType, data) => {
      const receivedAnnotationData    = data;
      receivedAnnotationData.user     = "epluser";
      receivedAnnotationData.context  = this.props.params.bookId;
      receivedAnnotationData.source   = {
          "uri": this.state.currentPageDetails.href,
          "id":  this.state.currentPageDetails.id,
          "label": this.state.currentPageDetails.title,
          "playOrder": this.state.currentPageDetails.playOrder,
          "baseUrl": this.state.currentPageDetails.baseUrl
      }
      switch (eventType) {
          case 'annotationCreated': {
            return this.props.dispatch(postAnnCallService(receivedAnnotationData));
          }
          case 'annotationUpdated':{
            return this.props.dispatch(putAnnCallService(receivedAnnotationData));
          }
          case 'annotationDeleted': {
              return this.props.dispatch(deleteAnnCallService(receivedAnnotationData));
          }
          default : {
              return eventType;
          }
      }
  }
 
  onBookLoaded = (bload) => {
    if(bload) {
      const that = this;  
      window.renderPopUp = function(collection) {
        that.setState({ popUpCollection : collection });
      }
      this.setState({ popUpCollection : [] });
      this.wrapper = new Wrapper({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : 'book-container'});
      this.wrapper.bindPopUpCallBacks();
    }  
   
  }
 
  
  render() {
    const callbacks = {};
    let annData = [];
    const { annotionData, loading ,playlistData, playlistReceived, tocData ,tocReceived} = this.props;// eslint-disable-line react/prop-types
    annData  = annotionData.rows;
    const filteredData = find(playlistData.content, list => list.id === this.props.params.pageId);
    if(Array.isArray(annotionData)==false && annotionData.rows==undefined){
      annData = [];
      annData.push(annotionData);
    }
    
    if(playlistReceived){
        this.state.pageDetails.baseUrl                = playlistData.baseUrl;
        if(this.state.pageDetails.currentPageURL === ""){
          this.state.pageDetails.currentPageURL =playlistData.content[1];
        }
        this.state.pageDetails.playListURL            = playlistData.content; 
        this.state.tocUrl                             = playlistData.provider;
    }
    callbacks.removeAnnotationHandler = this.removeAnnotationHandler;
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPageCallback = this.goToPageCallback;
    return (
      <div>
        <Header
          pxeTocbundle={this.props.tocData}
          classname={this.state.classname}
          pageTitle = {this.state.currentPageTitle}
          bookData={this.props.book}
          bookCallbacks={callbacks}
          store={this.context.store}
          hideDrawer={this.hideDrawer}
          drawerOpen={this.state.drawerOpen}
          viewerContentCallBack={this.viewerContentCallBack}
        />
          <div className={this.state.viewerContent ? 'viewerContent' : 'fixedviewerContent'}>
            {playlistReceived ? <PageViewer src={this.state.pageDetails} sendPageDetails={this.onPageChange} onBookLoaded = {(bload) => this.onBookLoaded(bload)} /> : ''}
            {playlistReceived ? <Annotation annAttributes = {this.state.annAttributes} shareableAnnotations={this.state.pageDetails.annotationShareable} annotationData={annData} contentId="pxe-viewer"
            currentPageDetails={ this.state.pageDetails.currentPageURL} annotationEventHandler={this.annotationCallBack.bind(this)} /> : ''}
            {this.state.popUpCollection.length > 0 ? <PopUpInfo popUpCollection = {this.state.popUpCollection} bookId = 'book-container'/> : '' }
            <div id= "divGlossary" ref = {(dom) => { this.divGlossaryRef = dom }} style = {{ display: 'none' }}>  </div>
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
        playlistReceived :state.playlistReducer.playlistReceived,
        tocData: state.playlistReducer.tocdata,
        tocReceived :state.playlistReducer.tocReceived
      }
);// eslint-disable-line max-len
Book = connect(mapStateToProps)(Book);// eslint-disable-line no-class-assign
export default Book;
