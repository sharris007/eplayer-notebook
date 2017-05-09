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
import { PxePlayer } from 'pxe-player';
import { Annotation } from 'pxe-annotation';
import { Wrapper } from 'pxe-wrapper';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {apiConstants, annotationTypes} from '../../../../const/Constants'

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
        urlParams:{
          context :this.props.params.bookId,
          user:'epluser'
        },
        annAttributes:customAttributes,
        goToTextVal:'',
        pageScrollValue:'',
        isPanelOpen:false
      };
      this.divGlossaryRef = '';
      this.wrapper = '';
      this.nodesToUnMount = [];  
      this.bookIndexId = {};
      this.searchUrl = '';
      this.handleScroll = this.handleScroll.bind(this);
      document.body.addEventListener('contentLoaded', this.parseDom);
      document.body.addEventListener('navChanged', this.navChanged);
      this.state.pageDetails.currentPageURL = '';
       
  }
  componentWillMount  = () => {
    this.props.dispatch(getTotalBookmarkCallService(this.state.urlParams));
    this.props.dispatch(getBookCallService(this.state.urlParams.context));
    this.props.dispatch(getTotalAnnCallService(this.state.urlParams));
  }
  componentWillUnmount() {
    WidgetManager.navChanged(this.nodesToUnMount);
    this.props.dispatch({type: "CLEAR_PLAYLIST"});
    this.props.dispatch({type: "CLEAR_ANNOTATIONS"});
    this.props.dispatch({type: "CLEAR_BOOKMARKS"});
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
    if(nextProps.isGoToPageRecived ){
      if(nextProps.gotoPageObj.page && nextProps.gotoPageObj.page.href){
          const goToHref = nextProps.gotoPageObj.page.href.split('#')[0]; 
          let gotoPageData  = '';   
          const playpageDetails1  = this.state.pageDetails ; 
          const currentData = find(pageParameters.playListURL, list =>{
            if(list.href && list.href.match(goToHref)) {
                  gotoPageData = list;
                  gotoPageData.pageFragmentId = nextProps.gotoPageObj.page.href.split('#')[1];
               }   
          });   
          playpageDetails1.currentPageURL =  gotoPageData;
          browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${gotoPageData.id}`);
          this.props.dispatch({
            type: "GOT_GOTOPAGE",
            data: [],
            isGoToPageRecived: false
          });
        }
      }
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.pageDetails.currentPageURL.pageFragmentId){
      const scrollTopVal = $('#'+prevState.pageDetails.currentPageURL.pageFragmentId).offset().top+80;
        $('html, body').animate({
          scrollTop: scrollTopVal
      }, 1000);
    }
    let pagenumberArr = {};
    const pageBreakClass = $("#book-render-component").find(".pagebreak");
    pageBreakClass.each(function(i,item) {
        var pageno = $(this).attr("title");
        if (pageno) {
            var top = $(this).offset().top;
            pagenumberArr[pageno] = parseInt(top);
        }
    });
    $("#pageNum").val(Object.keys(pagenumberArr)[0]);
    this.state.pageScrollValue  = pagenumberArr; 
  }
   
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  handleScroll(event) {
    let currentScrollVal = $(window).scrollTop()+80;
    let vale = this.getScrollIndex(currentScrollVal);
    if(vale){
      $("#pageNum").val(vale);
    }else{
      $("#pageNum").val(Object.keys(this.state.pageScrollValue)[0]);
    }
    
    
  }
  getScrollIndex = (currentScrollVal) =>{ 
    let num ='';
    $.each(this.state.pageScrollValue, function(index, value) {   
      if(currentScrollVal >= value){
        num = index;
      }   
    });
    return num;
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
    switch(type){
      case 'continue':{
        if(data){
          this.setState({isPanelOpen:true},()=>{
              const pageDetails={...this.state.pageDetails};
              pageDetails.currentPageURL=data;
              this.props.dispatch({
                type: 'CREATE_MULTIPANEL_BOOTSTRAP_PARAMS',
                data: {pageDetails:pageDetails,urlParams:this.state.urlParams}
              });
              browserHistory.replace(`/eplayer/MultiTaskPanel`);
              // window.open(`/eplayer/MultiTaskPanel`, 'panel');
              // window.open(`http://localhost:3000/eplayer/ETbook/1Q98UHDD1E1/page/${data.id}`,'panel');
          });
        }
        break;
      }
      case annotationTypes.ANNOTATION_CREATED:
      case annotationTypes.ANNOTATION_UPDATED:
      case annotationTypes.ANNOTATION_DELETED:{
         // this.props.dispatch(getTotalAnnCallService(this.state.urlParams));
         break;
      }
      default:{
        // other than continue
        if(data){
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
            browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${data.id}`);
            setTimeout(()=>{
              this.props.dispatch(getBookmarkCallService(this.state.urlParams));
              // this.props.dispatch(getAnnCallService(this.state.urlParams));
            },2000)
          });
        }
        break;
      }
    }
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
    this.setState({
      pageDetails: playpageDetails,
      drawerOpen: false
    });
    this.viewerContentCallBack(true);
    browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${pageId}`);
  };
  annotationCallBack = (eventType, data) => {
      const receivedAnnotationData    = data;
      receivedAnnotationData.user     = "epluser";
      receivedAnnotationData.context  = this.props.params.bookId;
      receivedAnnotationData.source   = this.state.currentPageDetails;
      receivedAnnotationData.source.baseUrl = this.state.pageDetails.baseUrl;
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
    // const annData  = annotationData.rows;
    this.props.book.annTotalData  = annotationTotalData;
    this.props.book.toc           = tocData;
    this.props.book.bookmarks     = bookMarkData;
    
    callbacks.removeAnnotationHandler = this.removeAnnotationHandler;
    callbacks.addBookmarkHandler      = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler   = this.removeBookmarkHandler;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPageCallback        = this.goToPageCallback;

    //For Segregating to Wrapper component PxePlayer		
    const bootstrapParams={		
      pageDetails:{...this.state.pageDetails},		
      urlParams:{...this.state.urlParams}		
    }		
    //End of Wrapper PxePlayer
 
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
            {playlistReceived ? <div className="printBlock"><img className="printer-epl" src={"https://cdn1.iconfinder.com/data/icons/nuvola2/128x128/devices/print_printer.png"} onClick={this.printFun} /> </div>: '' }
            {playlistReceived ? <PxePlayer bootstrapParams={bootstrapParams}  applnCallback={this.onPageChange}/> : ''}
          </div>
           {this.state.isPanelOpen?<div>		
            <iframe name="panel" width="500" height="600" ></iframe>
          </div>:''}
      </div>
    );
  }
}


Book.propTypes = {
  fetchTocAndViewer      : React.PropTypes.func,
  fetchAnnotations       : React.PropTypes.func,
  removeAnnotation       : React.PropTypes.func,
  fetchBookmarks         : React.PropTypes.func,
  addBookmark            : React.PropTypes.func,
  removeBookmark         : React.PropTypes.func,
  fetchPreferences       : React.PropTypes.func,
  // goToPage            : React.PropTypes.func,
  book                   : React.PropTypes.object,
  params                 : React.PropTypes.object,
  dispatch               : React.PropTypes.func
};

Book.contextTypes = {
  store                  : React.PropTypes.object.isRequired,
  muiTheme               : React.PropTypes.object.isRequired
};

const mapStateToProps = state => {
 return  { 
    // annotationData       : state.annotationReducer.highlightPageData,
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
