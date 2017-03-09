import React, { Component } from 'react';
import { Viewer } from '@pearson-incubator/viewer';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
import './PdfBook.scss';
import pdfwrapper from '../../../../pdf_reader_lib/pdfWrapper';
import Navigation from '@pearson-incubator/viewer/src/js/Navigation';
import {Link, browserHistory } from 'react-router';

export class PdfBookReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: 'headerBar',
      currPageIndex:''
     
    };
    this.nodesToUnMount = [];
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);

  }
  componentDidMount() {
    if (this.props.params.pageId) {
      this.props.fetchTocAndViewer(this.props.params.bookId,this.props.bookshelf.authorName,this.props.bookshelf.title,this.props.bookshelf.thumbnail,this.props.book.bookinfo.book.bookeditionid,this.props.params.pageId,this.props.bookshelf.ssoKey);
    } else {
      this.props.fetchTocAndViewer(this.props.params.bookId,this.props.bookshelf.authorName,this.props.bookshelf.title,this.props.bookshelf.thumbnail,this.props.book.bookinfo.book.bookeditionid,this.props.bookshelf.ssoKey);
    }
    this.props.fetchBookmarks(this.props.params.bookId,this.props.book.bookinfo.userbook.userbookid,this.props.book.bookinfo.book.bookeditionid,this.props.bookshelf.ssoKey);
    var config = {
    host: "https://foxit-prod.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    //PDFassetURL: "http://www.pdf995.com/samples/pdf.pdf",
    //PDFassetURL: "http://epspqa.stg-openclass.com/pearson-reader/api/item/ad6c0891-da60-4285-8c62-68850775c329/1/file/CM76820710_uPDF.pdf",
    PDFassetURL: this.props.bookshelf.uPdf,
    encpwd: null,
    zip: false,
    callbackOnPageChange : this.pdfBookCallback
  },
    pdfInstance = pdfwrapper();
    pdfInstance.createPDFViewer(config);
  }
  pdfBookCallback = (currentPageIndex) => {
     this.setState({currPageIndex : currentPageIndex});
     const currentPageOrder=currentPageIndex+1;
     const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageOrder);
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
     var currPageIndex=pdfwrapper().getCurrentPage();
     this.setState({currPageIndex: currPageIndex});
    if(navType=="prev"){
      var prevPageIndex=currPageIndex-1;
      pdfwrapper().gotoPdfPage(prevPageIndex); 
    }
    else if(navType=="next"){
      var nextPageIndex=currPageIndex+1;
      pdfwrapper().gotoPdfPage(nextPageIndex); 
    }
  };

  goToPageCallback(pageNum)
  {
    pageNum=pageNum-1;
    if(pageNum>=0)
    {
      pdfwrapper().gotoPdfPage(pageNum);
      var currPageIndex=pdfwrapper().getCurrentPage();
      this.setState({currPageIndex: currPageIndex});
    }
  }

  getPageCount = () => {

    var pagecount = pdfwrapper().getPageCount();
    return pagecount;
  }

  getPrevNextPage = (pageType) =>{
    var currPageIndex=pdfwrapper().getCurrentPage();
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
   var currPageIndex=pdfwrapper().getCurrentPage();
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

  handleScroll = () => {
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
  }

  addBookmarkHandler = () => {
    const currentPageId=pdfwrapper().getCurrentPage()+1;
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    const bookmark = {
      id: currentPage.pagenumber,
      uri:currentPageId
    };
    this.props.addBookmark(this.props.params.bookId, bookmark,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,currentPage.pageid,this.props.bookshelf.ssoKey);
  }

  removeBookmarkHandler = (bookmarkId) => {
    const currentPageId=pdfwrapper().getCurrentPage()+1;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    const targetBookmarkId = targetBookmark.uri;
    this.props.removeBookmark(this.props.params.bookId, targetBookmarkId,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,currentPage.pageid,this.props.bookshelf.ssoKey);
  };

  isCurrentPageBookmarked = () => {
    const currentPageId=pdfwrapper().getCurrentPage()+1;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  };

  setCurrentZoomLevel(level){
    console.log(level);
    pdfwrapper().setCurrentZoomLevel(level);
  }

  render() {
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
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
          isET1='Y'
        />
      
       <div className="viewerContent">
      <Navigation data={this.props.book.viewer} pages={this.props.book.viewer.pages} callbackParent={this.goToPage} getPrevNextPage={this.getPrevNextPage} isET1='Y' />
      </div>
      </div>
        <div>
        <div id="main">
            <div id="mainContainer" className="pdf-fwr-pc-main">
                <div id="right" className="pdf-fwr-pc-right">
                 <div id="toolbar" className="pdf-fwr-toolbar"></div>
                  <div id="frame">
                    <div id="docViewer" onHold={this.handleScroll} onMouseLeave={this.leaveScroll}  className="docViewer" ></div>
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
