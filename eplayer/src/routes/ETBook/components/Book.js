  /* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
import { pageDetails , customAttributes } from '../../../../const/Mocdata'; 
import './Book.scss';
import { browserHistory } from 'react-router';
import { getTotalAnnCallService, getAnnCallService, postAnnCallService, putAnnCallService,deleteAnnCallService } from '../../../actions/annotation';
import { getBookCallService, getPlaylistCallService} from '../../../actions/playlist';
import { getGotoPageCall } from '../../../actions/gotopage';

import { getBookmarkCallService ,postBookmarkCallService ,deleteBookmarkCallService,getTotalBookmarkCallService } from '../../../actions/bookmark';
import { PageViewer } from '@pearson-incubator/pxe-pageviewer';
import { Annotation } from 'pxe-annotation';
import { Wrapper } from 'pxe-wrapper';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {apiConstants} from '../../../../const/Constants'

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
        tocUpdated:false,
        urlParams:{
          context :this.props.params.bookId,
          user:'epluser'
        },
        annAttributes:customAttributes,
        goToTextVal:'',
        gotoCheck:false
      };
      this.divGlossaryRef = '';
      this.wrapper = '';
      this.nodesToUnMount = [];  
      this.bookIndexId = {};
      this.searchUrl = '';
      document.body.addEventListener('contentLoaded', this.parseDom);
      document.body.addEventListener('navChanged', this.navChanged);
  }
  componentWillMount  = () => {
    this.props.dispatch(getTotalBookmarkCallService(this.state.urlParams));
    this.props.dispatch(getBookCallService(this.state.urlParams.context));
    this.props.dispatch(getTotalAnnCallService(this.state.urlParams));
  }
  componentWillUnmount() {
    WidgetManager.navChanged(this.nodesToUnMount);
  }
  parseDom = () => {
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  };
  componentWillReceiveProps(nextProps){
    const playlistData = nextProps.playlistData;
    const pageParameters = this.state.pageDetails;
    if(nextProps.playlistReceived){
       const filteredData = find(playlistData.content, list => list.id === nextProps.params.pageId);
          pageParameters.baseUrl                = playlistData.baseUrl;
        if(pageParameters.currentPageURL === ""){
          pageParameters.currentPageURL =(playlistData.content[0].playOrder==0)?playlistData.content[1]:playlistData.content[0];
        }
        pageParameters.playListURL            = playlistData.content; 
        if(nextProps.params.pageId){
           pageParameters.currentPageURL        =filteredData;
        }

    }
    if(typeof nextProps.tocData === "object" && nextProps.tocData && nextProps.tocData.bookDetails && nextProps.tocData.bookDetails.indexId ) {
      this.bookIndexId = nextProps.tocData.bookDetails.indexId;
      this.searchUrl = `${apiConstants.SEARCHURL}${this.bookIndexId}&q=searchText${apiConstants.SEARCHLIMIT}`;
    } 
    let gotoCheckVal = nextProps.isGoToPageRecived;
    if(nextProps.isGoToPageRecived && !this.state.gotoCheck){
          const goToHref = nextProps.gotoPageObj.page.href.split('#')[0]; 
          const goToArr = [];      
           find(pageParameters.playListURL, function(list) {
             if( list.hasOwnProperty('href')) { 
              if(list.href && list.href.match(goToHref)) {
                list.href = nextProps.gotoPageObj.page.href;
                goToArr.push(list);
               }                 
            }
        });
        pageParameters.currentPageURL =goToArr[0];
        this.goToPageCallback(goToArr[0].id);   
    }
  }
  
  navChanged = () => {
    WidgetManager.navChanged(this.nodesToUnMount);
    this.nodesToUnMount = [];
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  }

  removeAnnotationHandler = (annotationId) => {
    const deleteAnnData = $.extend(this.state.urlParams,{annId:annotationId});
    this.props.dispatch(deleteAnnCallService(deleteAnnData));
  };

  addBookmarkHandler = () => {
    const bMarkData = this.state;
    const bookmark = {
        uri: bMarkData.urlParams.id,
        data: {
          baseUrl: bMarkData.pageDetails.baseUrl
        },
        title: bMarkData.currentPageTitle,
        labels:[bMarkData.currentPageTitle],
        context:bMarkData.urlParams.context,
        user:bMarkData.urlParams.user
    };
    this.props.dispatch(postBookmarkCallService(bookmark));    
  }

  removeBookmarkHandler = (bookmarkId) => {
    this.state.urlParams.uri = (bookmarkId ? bookmarkId : this.state.currentPageDetails.id);
    this.forceUpdate();
    this.props.dispatch(deleteBookmarkCallService(this.state.urlParams));
  };

  onPageChange = (type, data) => {
    const parameters = this.state.urlParams;
    parameters.id    = data.id,
    parameters.uri   = encodeURIComponent(data.href),
    data.uri         = data.href;
    data.label       = data.title;
    this.setState({ 
      currentPageDetails :data,
      currentPageTitle   :data.title, 
      urlParams:parameters
    },function(){
      // eslint-disable-next-line
      this.props.dispatch(getAnnCallService(this.state.urlParams));
      this.props.dispatch(getBookmarkCallService(this.state.urlParams));
      browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${data.id}`);
      setTimeout(()=>{
        this.props.dispatch(getBookmarkCallService(this.state.urlParams));
        this.props.dispatch(getAnnCallService(this.state.urlParams));
      },2000)
    });
  }

  isCurrentPageBookmarked = () => {
    return this.props.isBookmarked;
  };
 
  goToTextChange = (goToTextChangeCallBack) => {
 // this.setState({ goToTextVal: e.target.value });
 } 

 goToPageClick = (getPageNumber) => {
  if(getPageNumber){
  const bookId = this.props.params.bookId;
  const goToPageObj = {
      context : bookId,
      user    :'epluser',
      pagenumber:getPageNumber,
      baseurl: this.state.pageDetails.baseUrl
    }
    this.props.dispatch(getGotoPageCall(goToPageObj));
    }
  }

  viewerContentCallBack = (viewerCallBack) => {
    this.setState({ viewerContent: viewerCallBack });
    if(viewerCallBack==false)
    this.setState({ drawerOpen: true });
  }
  goToPageCallback = (pageId) => {
    const currentData = find(this.state.pageDetails.playListURL, list => list.id === pageId);
    const playpageDetails  = this.state.pageDetails ; 
    playpageDetails.currentPageURL =  currentData;
    playpageDetails.tocUpdated  = true;
    this.setState({
      pageDetails: playpageDetails,
      drawerOpen: false,
      gotoCheck:true
    });
    this.viewerContentCallBack(true);
    browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${pageId}`);
    const self = this;
    setTimeout(function(){
      self.setState({
          gotoCheck:false
      });
    },2000)
  };
  annotationCallBack = (eventType, data) => {
      const receivedAnnotationData    = data;
      receivedAnnotationData.user     = "epluser";
      receivedAnnotationData.context  = this.props.params.bookId;
      receivedAnnotationData.source   = this.state.currentPageDetails;
      receivedAnnotationData.source.baseUrl = this.state.pageDetails.baseUrl;
      // delete receivedAnnotationData.source.href;
      // delete receivedAnnotationData.source.title;
      switch (eventType) {
          case 'annotationCreated': {
            return this.props.dispatch(postAnnCallService(receivedAnnotationData));
          }
          case 'annotationUpdated':{
            return this.props.dispatch(putAnnCallService(receivedAnnotationData));
          }
          case 'annotationDeleted': {
              receivedAnnotationData.annId    = data.id;
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

  goToPage = (pageId) => {
    let bookObj = {};
    this.state.pageDetails.playListURL.forEach( (data) => { 
      if(data.href && data.href.match(pageId.split("OPS")[1]) ) { 
        bookObj = data;
      } 
    });
    this.goToPageCallback(bookObj.id)
  }

  listClick = () => {
    console.log("....** listClick function...")
  }
  

  render() {

    const callbacks = {};
    const { annotationData, annDataloaded ,annotationTotalData ,playlistData, playlistReceived, bookMarkData ,tocData ,tocReceived} = this.props; // eslint-disable-line react/prop-types
    const annData  = annotationData.rows;
    this.props.book.annTotalData  = annotationTotalData;
    this.props.book.toc           = tocData;
    this.props.book.bookmarks     = bookMarkData;
    
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
          indexId = { {'indexId' : this.bookIndexId, 'searchUrl' : this.searchUrl} }
          goToPage = {(pageId) => this.goToPage(pageId)}
          listClick = {() => this.listClick()}
          goToPageClick = {this.goToPageClick}
        />
           
          <div className={this.state.viewerContent ? 'viewerContent' : 'fixedviewerContent'}>
            {!playlistReceived ? <RefreshIndicator size={50} left={650} top={200} status="loading" /> :''}
            {playlistReceived ? <div className="printBlock"><button type="button" onClick={this.printFun} >Print</button> </div>: '' }
            {playlistReceived ? <PageViewer src={this.state.pageDetails} sendPageDetails={this.onPageChange} onBookLoaded = {(bload) => this.onBookLoaded(bload)} /> : ''}
            {playlistReceived ? <Annotation annAttributes = {this.state.annAttributes} shareableAnnotations={this.state.pageDetails.annotationShareable} annotationData={annData} contentId="pxe-viewer"
            annotationEventHandler={this.annotationCallBack.bind(this)} /> : ''}
            {this.state.popUpCollection.length > 0 ? <PopUpInfo popUpCollection = {this.state.popUpCollection} bookId = 'book-container'/> : '' }
            <div id= "divGlossary" ref = {(dom) => { this.divGlossaryryRef = dom }} style = {{ display: 'none' }}>  </div>
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

const mapStateToProps = state => {
 return  { 
    annotationData       : state.annotationReducer.highlightPageData,
    annDataloaded        : state.annotationReducer.annDataloaded, 
    annotationTotalData  : state.annotationReducer.highlightTotalData,  
    annTotalDataLoaded   : state.annotationReducer.annTotalDataLoaded, 
    playlistData         : state.playlistReducer.data,
    playlistReceived     : state.playlistReducer.playlistReceived,
    tocData              : state.playlistReducer.tocdata,
    tocReceived          : state.playlistReducer.tocReceived,
    isBookmarked         : state.bookmarkReducer.data.isBookmarked,
    bookMarkData         : state.bookmarkReducer.bookmarksData,
    gotoPageObj          : state.gotopageReducer.gotoPageObj,
    isGoToPageRecived    : state.gotopageReducer.isGoToPageRecived
  }
};// eslint-disable-line max-len
Book = connect(mapStateToProps)(Book);// eslint-disable-line no-class-assign
export default Book;
