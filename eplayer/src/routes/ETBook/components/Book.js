  /* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageViewer } from '@pearson-incubator/pxe-pageviewer';
import { Annotation } from 'pxe-annotation';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
import { pageDetails , customAttributes } from '../../../../const/Mocdata'; 
import './Book.scss';
import { browserHistory } from 'react-router';
import { getTotalAnnCallService, getAnnCallService, postAnnCallService, putAnnCallService,deleteAnnCallService } from '../../../actions/annotation';
import { getBookCallService, getPlaylistCallService} from '../../../actions/playlist';

import { getBookmarkCallService ,postBookmarkCallService ,deleteBookmarkCallService,getTotalBookmarkCallService } from '../../../actions/bookmark';
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
        currentPageTitle:'',
        annAttributes :'',
        popUpCollection:'',
        tocUrl :'',
        tocUpdated:false
      };
      this.divGlossaryRef = '';
      this.wrapper = '';
      this.nodesToUnMount = [];  
      document.body.addEventListener('contentLoaded', this.parseDom);
      document.body.addEventListener('navChanged', this.navChanged);
  }
  componentWillMount  = () => {
    const bookId      = this.props.params.bookId;
    const pageId      = this.props.params.pageId;
    const userId      = 'epluser';
    const queryString = {
        context : bookId,
        user    : userId,
        id      : pageId
    }
    this.props.dispatch(getTotalBookmarkCallService(queryString));
    this.props.dispatch(getBookCallService(bookId));
    this.props.dispatch(getTotalAnnCallService(queryString));
  }
  componentDidMount() {   
    this.setState({
      annAttributes:customAttributes
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
    const queryString = {
        context : this.props.params.bookId,
        user    :'epluser',
        id      : annotationId
    }
    this.props.dispatch(deleteAnnCallService(queryString));
  };

  addBookmarkHandler = () => {
    const bookmarkDetails = this.state.currentPageDetails;
    
    const bookmark = {
        uri: bookmarkDetails.id,
        data: {
          baseUrl: this.state.pageDetails.baseUrl
        },
        title: bookmarkDetails.title,
        labels:[bookmarkDetails.title],
        user:'epluser',
        context:this.props.params.bookId
    };
    const queryString = {
      context : this.props.params.bookId,
      uri     : this.props.params.pageId,
      user    :'epluser',
      id      : this.props.params.pageId
    }
    
    this.props.dispatch(postBookmarkCallService(bookmark));
    const that = this;
    setTimeout(function(){
      that.props.dispatch(getTotalBookmarkCallService(queryString));
    },2000)
    
  }

  removeBookmarkHandler = (bookmarkId) => {
    
    if(!bookmarkId){
      bookmarkId = this.state.currentPageDetails.id;
    }
    const bookmarkDetails = this.state.currentPageDetails;
    const pageUri = encodeURIComponent(bookmarkDetails.href);  
    const deleteData = {
      user:'epluser',
      context:this.props.params.bookId,
      uri:bookmarkId
    }  
    this.props.dispatch(deleteBookmarkCallService(deleteData));
    const that = this;
    const queryString = {
      context : this.props.params.bookId,
      uri     : this.props.params.pageId,
      user    :'epluser',
      id      : this.props.params.pageId
    }
    setTimeout(function(){
      that.props.dispatch(getTotalBookmarkCallService(queryString));
    },2000)
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
      user    :'epluser',
      id:pageId
    }
    this.props.dispatch(getAnnCallService(queryString));
    this.props.dispatch(getBookmarkCallService(queryString));
    browserHistory.replace(`/eplayer/ETbook/${bookId}/page/${pageId}`);
  }

  isCurrentPageBookmarked = () => {
    return this.props.isBookmarked;
  };

  viewerContentCallBack = (viewerCallBack) => {
    this.setState({ viewerContent: viewerCallBack });
    if(viewerCallBack==false)
    this.setState({ drawerOpen: true });
  }
  goToPageCallback = (pageId) => {
    const that=this;
    const currentData = find(this.state.pageDetails.playListURL, list => list.id === pageId);
    const playpageDetails  = this.state.pageDetails ; 
    playpageDetails.currentPageURL =  currentData;
    playpageDetails.tocUpdated  = true;
    this.setState({
      pageDetails: playpageDetails      
    });
    this.setState({ drawerOpen: false });
    this.viewerContentCallBack(true);
    const bookId = this.props.params.bookId;
    browserHistory.replace(`/eplayer/ETbook/${bookId}/page/${pageId}`);
  };
  annotationCallBack = (eventType, data) => {
      const that=this;
      const queryString = {
        context : this.props.params.bookId,
        user    :'epluser'
      }
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
  
  printFun = () => {
    const url = this.state.pageDetails.baseUrl + this.state.pageDetails.currentPageURL.href;
    window.open(`/eplayer/Print?${url}`, 'PrintPage', 'scrollbars=yes,toolbar=no,location=no,status=no,titlebar=no,toolbar=no,menubar=no, resizable=no,dependent=no');
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

  preferenceUpdate = (pref) => {
    let pageDetails = this.state.pageDetails;
    pageDetails.bgColor = pref.theme;
    pageDetails.pageFontSize =  pref.fontSize;
    this.setState({pageDetails : pageDetails});
  }

  preferenceBackgroundColor = (theme) => {
    // console.log('theme---',theme);
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

    const bookmarksDataMap = this.props.bookMarkData.bookmarksData.bookmarks;
    if(bookmarksDataMap && bookmarksDataMap.length>0){
      for(let i=0;i<bookmarksDataMap.length;i++){
        bookmarksDataMap[i].id =bookmarksDataMap[i].uri;
      }
    }
    const annListArray = [];
    if(this.props.annotionTotalData){
      const colorArr = {
        '#55DF49':"Green",
        '#FC92CF':"Pink",
        '#FFD232':"Yellow"
      }
      const annTotalList = this.props.annotionTotalData.rows;
      if(annTotalList && annTotalList.length>0){
        for(let i=0;i<annTotalList.length;i++){
          const setArray = {
            pageId: annTotalList[i].source.id,
            id: annTotalList[i].id,
            author: annTotalList[i].user,
            time: annTotalList[i].createdTimestamp,
            text: annTotalList[i].quote,
            comment: annTotalList[i].text||'',
            color: colorArr[annTotalList[i].color]||"Green"
          }
          annListArray.push(setArray);
        }
      }
      this.props.book.annTotalData = annListArray;
    }
    
    this.props.book.toc       = tocData;
    this.props.book.bookmarks = bookmarksDataMap;
    if(playlistReceived){
        this.state.pageDetails.baseUrl                = playlistData.baseUrl;
        if(this.state.pageDetails.currentPageURL === ""){
          this.state.pageDetails.currentPageURL =(playlistData.content[0].playOrder==0)?playlistData.content[1]:playlistData.content[0];
        }
        this.state.pageDetails.playListURL            = playlistData.content; 
        if(this.props.params.pageId){
           this.state.pageDetails.currentPageURL =filteredData;
        }
    }
    callbacks.removeAnnotationHandler = this.removeAnnotationHandler;
    callbacks.addBookmarkHandler      = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler   = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPageCallback        = this.goToPageCallback;
    return (
      <div>
        <Header
          classname={this.state.classname}
          pageTitle = {this.state.currentPageTitle}
          bookData={this.props.book}
          bookCallbacks={callbacks}
          store={this.context.store}
          hideDrawer={this.hideDrawer}
          drawerOpen={this.state.drawerOpen}
          viewerContentCallBack={this.viewerContentCallBack}
          preferenceUpdate = {this.preferenceUpdate}
          preferenceBackgroundColor = {this.preferenceBackgroundColor}
        />
          <div className={this.state.viewerContent ? 'viewerContent' : 'fixedviewerContent'}>
            {playlistReceived ? <div className="printBlock"><button type="button" onClick={this.printFun} >Print</button> </div>: '' }
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
        annotionTotalData: state.annotationReducer.totalAnndata,  
        loading: state.annotationReducer.loading, 
        playlistData: state.playlistReducer.data,
        playlistReceived :state.playlistReducer.playlistReceived,
        tocData: state.playlistReducer.tocdata,
        tocReceived :state.playlistReducer.tocReceived,
        isBookmarked :state.bookmarkReducer.data.isBookmarked,
        bookMarkData : state.bookmarkReducer
      }
);// eslint-disable-line max-len
Book = connect(mapStateToProps)(Book);// eslint-disable-line no-class-assign
export default Book;
