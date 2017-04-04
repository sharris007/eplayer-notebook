import React, { Component } from 'react';
import { ViewerComponent } from '@pearson-incubator/viewer';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
import './PdfBook.scss';
import {Link, browserHistory } from 'react-router';

export class PdfBookReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: 'headerBar',
      currPageIndex:'',
      data  : {
        currentPageNo : '',
        isFirstPage : true,
        isLastPage : true
      },
      isET1: 'Y'
     
    };
    this.nodesToUnMount = [];
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);

  }
  componentDidMount() {
    this.props.fetchTocAndViewer(this.props.params.bookId,this.props.bookshelf.authorName,this.props.bookshelf.title,this.props.bookshelf.thumbnail,this.props.book.bookinfo.book.bookeditionid,this.props.bookshelf.ssoKey);
    this.props.fetchBookmarks(this.props.params.bookId,this.props.book.bookinfo.userbook.userbookid,this.props.book.bookinfo.book.bookeditionid,this.props.bookshelf.ssoKey);
    var etext_token =this.props.bookshelf.cdnToken;
    var headerParams = {
       'etext-cdn-token' : etext_token 
     }
    var config = {
    //host: "https://foxit-prod.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    //PDFassetURL: "http://www.pdf995.com/samples/pdf.pdf",
    host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    PDFassetURL: this.props.bookshelf.uPdf,
    headerParams: headerParams,
    encpwd: null,
    zip: false,
    callbackOnPageChange : this.pdfBookCallback
  };
    __pdfInstance.createPDFViewer(config);
  }
  pdfBookCallback = (currentPageIndex) => {
     this.setState({currPageIndex : currentPageIndex});
     const currentPageOrder=currentPageIndex+1;
     const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageOrder);
     var data = this.state.data;
     if(currentPageOrder == 1){
      data.isFirstPage =true;
      this.setState({data : data})
     }else{
       data.isFirstPage =false; 
       this.setState({data : data})
     }

     if(currentPageOrder === this.getPageCount()){
       data.isLastPage =true;
      this.setState({data : data})
     }else{
      data.isLastPage =false;
      this.setState({data : data})
     }
     data.currentPageNo = currentPageOrder;
     this.setState({data : data});
     // If already page details are in store then we do not hit fetchPageInfo again
     if(currentPage===undefined)
     {
     this.props.fetchPageInfo(this.props.params.bookId,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      currentPageOrder,
      this.props.bookshelf.ssoKey
      );
   }
  }

  goToPage = (navType) =>{
     var currPageIndex=__pdfInstance.getCurrentPage();
     this.setState({currPageIndex: currPageIndex});
    if(navType=="prev"){
      var prevPageIndex=currPageIndex-1;
      __pdfInstance.gotoPdfPage(prevPageIndex); 
    }
    else if(navType=="next"){
      var nextPageIndex=currPageIndex+1;
      __pdfInstance.gotoPdfPage(nextPageIndex); 
    }
  };

  goToPageCallback(pageNum)
  {  
    pageNum=pageNum-1;
    if(pageNum>=0)
    {
      __pdfInstance.gotoPdfPage(pageNum);
      var currPageIndex=__pdfInstance.getCurrentPage();
      this.setState({currPageIndex: currPageIndex});
    }
  }

  getPageCount = () => {

    var pagecount = __pdfInstance.getPageCount();
    return pagecount;
  }

  getPrevNextPage = (pageType) =>{
    var currPageIndex=__pdfInstance.getCurrentPage();
    var currPageNumber=currPageIndex + 1;
    var page;
    if(pageType=="prev"){
      page=currPageNumber - 1;
    }
    else if(pageType=="next"){
      page=currPageNumber + 1;
    }
    else if(pageType=="last"){
      page=this.getPageCount();   
    }
    return (page);
  }

  getCurrentPageIndex = () => {
   var currPageIndex=__pdfInstance.getCurrentPage();
   return currPageIndex;
  }
  
  handleBackClick = (bookId) => { 
    browserHistory.push(`/bookshelf`);    
  }
  
  parseDom = () => {
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  };

  navChanged = () => {
    WidgetManager.navChanged(this.nodesToUnMount);
    this.nodesToUnMount = [];
    WidgetManager.loadComponents(this.nodesToUnMount, this.context);
  }

  /*handleScroll = () => {
            var didScroll;
            var lastScrollTop = 0;
            var delta = 5;
            var navbarHeight = $('.headerBar').outerHeight();
            var dbScrolrlNode = ($("div#docViewer_ViewContainer").selector);
            var didScroll = true;
            $(dbScrolrlNode).attr("onMouseEnter", function(){
                console.log("h");
                $('.headerBar').slideUp();
                $('.navigation').slideUp();
           });

            // $(dbScrolrlNode).attr("onMouseLeave",function(){ 
            //      $('.headerBar').show(); 
            //      $('.navigation').css('display','block');
            // });

  }

  leaveScroll = () => {
          $('.headerBar').show(); 
          $('.navigation').css('display','block');
  }*/

  addBookmarkHandler = () => {
    const currentPageId=__pdfInstance.getCurrentPage()+1;
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    var currTimeInMillsc = (new Date).getTime();
    const bookmark = {
      id: currentPageId,
      uri:currentPageId,
      createdTimestamp:currTimeInMillsc,
      pageID:currentPage.pageid
    };
    this.props.addBookmark(this.props.params.bookId, bookmark,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,currentPage.pageid,this.props.bookshelf.ssoKey);
  }

  removeBookmarkHandler = () => {
    const currentPageId=__pdfInstance.getCurrentPage()+1;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    const targetBookmarkId = targetBookmark.uri;
    this.props.removeBookmark(this.props.params.bookId, targetBookmarkId,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,targetBookmark.pageID,this.props.bookshelf.ssoKey);
  };

  removeBookmarkHandlerForBookmarkList = (bookmarkId) => {
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === bookmarkId);
    //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === bookmarkId);
    const targetBookmarkId = targetBookmark.uri;
    this.props.removeBookmark(this.props.params.bookId, targetBookmarkId,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,targetBookmark.pageID,this.props.bookshelf.ssoKey);
  };

  isCurrentPageBookmarked = () => {
    const currentPageId=__pdfInstance.getCurrentPage()+1;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  };

  setCurrentZoomLevel(level){
    console.log(level);
    __pdfInstance.setCurrentZoomLevel(level);
  }

  render() {
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.removeBookmarkHandlerForBookmarkList =this.removeBookmarkHandlerForBookmarkList;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPage = this.goToPage;
    callbacks.goToPageCallback = this.goToPageCallback.bind(this);
    return (
 
    <div className={'add'} >
    <div>
        <Header
          classname={this.state.classname}
          bookData={this.props.book}
          bookCallbacks={callbacks}
          setCurrentZoomLevel={this.setCurrentZoomLevel}
          store={this.context.store}
          goToPage={this.goToPageCallback}
          bookId={this.props.params.bookId}
          globalBookId={this.props.bookshelf.globalBookId}
          ssoKey={this.props.bookshelf.ssoKey}
          title={this.props.bookshelf.title}
          isET1='Y'
        /> 
      
       <div className="viewerContent">
       <ViewerComponent data={this.state.data} pages={this.props.book.viewer.pages} goToPageCallback={this.goToPage} getPrevNextPage={this.getPrevNextPage} isET1='Y'/>
      </div>
      </div>
        <div>
        <div id="main">
            <div id="mainContainer" className="pdf-fwr-pc-main">
                <div id="right" className="pdf-fwr-pc-right">
                 <div id="toolbar" className="pdf-fwr-toolbar"></div>
                  <div id="frame">
                    <div id="docViewer"  className="docViewer" ></div>
                  </div>
                 </div>
                </div>
            </div>
        </div>
        
    </div>
    );
  }
}

PdfBookReader.propTypes = {
  fetchTocAndViewer: React.PropTypes.func,
  fetchBookmarks: React.PropTypes.func,
  addBookmark: React.PropTypes.func,
  removeBookmark: React.PropTypes.func,
  goToPage: React.PropTypes.func,
  fetchBookInfo:React.PropTypes.func,
  fetchPageInfo:React.PropTypes.func,
  book: React.PropTypes.object,
  bookshelf:React.PropTypes.object,
  params: React.PropTypes.object
};

PdfBookReader.contextTypes = {
  store: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired
};

export default PdfBookReader;
