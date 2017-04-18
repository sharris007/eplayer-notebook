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
        isLastPage : false
      },
      isET1: 'Y',
      highlightList: []
     
    };
    this.nodesToUnMount = [];
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);

  }
 /* componentWillMount() {
      this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      1,
      this.props.bookshelf.ssoKey,
      this.props.bookshelf.serverDetails,
      this.loadPdfPage
      );

  }*/
  componentDidMount() {
    this.props.fetchTocAndViewer(this.props.params.bookId,this.props.bookshelf.authorName,this.props.bookshelf.title,this.props.bookshelf.thumbnail,this.props.book.bookinfo.book.bookeditionid,this.props.bookshelf.ssoKey,this.props.bookshelf.serverDetails);
    this.props.fetchBookmarks(this.props.params.bookId,this.props.book.bookinfo.userbook.userbookid,this.props.book.bookinfo.book.bookeditionid,this.props.bookshelf.ssoKey,this.props.bookshelf.serverDetails);
    const firstPage="firstPage";
    this.goToPage(firstPage);
    /*var etext_token =this.props.bookshelf.cdnToken;
    var headerParams = {
       'etext-cdn-token' : etext_token 
     }
    var config = {
    //host: "https://foxit-prod.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    //PDFassetURL: "http://www.pdf995.com/samples/pdf.pdf",
    host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    //PDFassetURL: this.props.bookshelf.uPdf,
    PDFassetURL: "http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM31206032/ipadpdfs/4cf24c94c7bedbb93d95696554615058.pdf",
    headerParams: headerParams,
    encpwd: null,
    zip: false,
    callbackOnPageChange : this.pdfBookCallback
  };
    __pdfInstance.createPDFViewer(config);*/
  }
  loadPdfPage = (pdfPath,currentPageIndex) =>
  {
    var etext_token =this.props.bookshelf.cdnToken;
    var headerParams = {
       'etext-cdn-token' : etext_token 
     }
    var config = {
    host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    //PDFassetURL: this.props.bookshelf.uPdf,
    //PDFassetURL: "http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM31206032/ipadpdfs/"+pdfPath,
    PDFassetURL: this.props.bookshelf.serverDetails+"/ebookassets/ebook"+this.props.book.bookinfo.book.globalbookid+"/ipadpdfs/"+pdfPath,
    headerParams: headerParams,
    encpwd: null,
    zip: false,
    callbackOnPageChange : this.pdfBookCallback
  };
    __pdfInstance.createPDFViewer(config);
    this.setState({currPageIndex: currentPageIndex});
  }
  pdfBookCallback = (currentPageIndex) => {
     //this.setState({currPageIndex : currentPageIndex});
     const currentPageOrder=this.state.currPageIndex;
     //const currentPageOrder = 2;
     //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageOrder);
     var data = this.state.data;
     if(currentPageOrder == 1){
      data.isFirstPage =true;
      //this.setState({data : data})
     }else{
       data.isFirstPage =false; 
       //this.setState({data : data})
     }
     if(currentPageOrder == this.getPageCount()){
       data.isLastPage =true;
      //this.setState({data : data})
     }else{
      data.isLastPage =false;
      //this.setState({data : data})
     }
     data.currentPageNo = currentPageOrder;
     this.setState({data : data});
     this.displayHighlight();
   
     // If already page details are in store then we do not hit fetchPageInfo again
     /*if(currentPage===undefined)
     {
      this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      currentPageOrder,
      this.props.bookshelf.ssoKey,
      this.props.bookshelf.serverDetails
      );
   }*/
  }

  goToPage = (navType) =>{
     //var currPageIndex=__pdfInstance.getCurrentPage();
     //this.setState({currPageIndex: currPageIndex});
    var currPageIndex=this.state.currPageIndex;
    var pageIndexToLoad;
    if(navType=="prev"){
       pageIndexToLoad=currPageIndex-1;
      //this.setState({currPageIndex: prevPageIndex});
      //__pdfInstance.gotoPdfPage(prevPageIndex); 
      //currPageIndex=prevPageIndex;
    }
    else if(navType=="next"){
       pageIndexToLoad=currPageIndex+1;
      //this.setState({currPageIndex: nextPageIndex});
      //__pdfInstance.gotoPdfPage(nextPageIndex); 
      //currPageIndex=nextPageIndex;
    }
    else if(navType=="firstPage")
    {
      //this.setState({currPageIndex: 1});
      pageIndexToLoad=1;
    }
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === pageIndexToLoad);
    if(currentPage===undefined)
    {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageIndexToLoad,
      this.props.bookshelf.ssoKey,
      this.props.bookshelf.serverDetails,this.loadPdfPage
      );
    }
    else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }
  };

  goToPageCallback(pageNum)
  {  
    //pageNum=pageNum-1;
    if(pageNum>0)
    {
      //__pdfInstance.gotoPdfPage(pageNum);
      //var currPageIndex=__pdfInstance.getCurrentPage();
      const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === pageNum);
    if(currentPage===undefined)
    {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageNum,
      this.props.bookshelf.ssoKey,
      this.props.bookshelf.serverDetails,this.loadPdfPage
      );
    }
    else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }
    }
  }

  getPageCount = () => {

    //var pagecount = __pdfInstance.getPageCount();
    var pagecount = this.props.book.bookinfo.book.numberOfPages;
    return pagecount;
  }

  getPrevNextPage = (pageType) =>{
    //var currPageIndex=__pdfInstance.getCurrentPage();
    //var currPageNumber=currPageIndex + 1;
    var currPageNumber = this.state.currPageIndex;
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

  /*getCurrentPageIndex = () => {
   var currPageIndex=this.props.book.bookinfo.book.numberOfPages;
   return currPageIndex;
  }*/
  
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
    //const currentPageId=__pdfInstance.getCurrentPage()+1;
    const currentPageId = this.state.currPageIndex; 
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    var currTimeInMillsc = (new Date).getTime();
    const bookmark = {
      id: currentPageId,
      uri:currentPageId,
      createdTimestamp:currTimeInMillsc,
      pageID:currentPage.pageid
    };
    this.props.addBookmark(this.props.params.bookId, bookmark,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,currentPage.pageid,this.props.bookshelf.ssoKey,this.props.book.userInfo.userid,this.props.bookshelf.serverDetails);
  }

  removeBookmarkHandler = (bookmarkId) => {
    let currentPageId;
    if(bookmarkId!==undefined)
    {
      currentPageId=bookmarkId;
    }
    else
    {
      //currentPageId =__pdfInstance.getCurrentPage()+1;
      currentPageId = this.state.currPageIndex;
    }
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    const targetBookmarkId = targetBookmark.uri;
    this.props.removeBookmark(this.props.params.bookId, targetBookmarkId,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,targetBookmark.pageID,this.props.bookshelf.ssoKey,this.props.book.userInfo.userid,this.props.bookshelf.serverDetails);
  };

  /*removeBookmarkHandlerForBookmarkList = (bookmarkId) => {
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === bookmarkId);
    //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === bookmarkId);
    const targetBookmarkId = targetBookmark.uri;
    this.props.removeBookmark(this.props.params.bookId, targetBookmarkId,this.props.book.bookinfo.book.bookeditionid,this.props.book.bookinfo.userbook.userbookid,targetBookmark.pageID,this.props.bookshelf.ssoKey,this.props.book.userInfo.userid,this.props.bookshelf.serverDetails);
  };*/

  isCurrentPageBookmarked = () => {
    //const currentPageId=__pdfInstance.getCurrentPage()+1;
    const currentPageId = this.state.currPageIndex;
    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  };

  setCurrentZoomLevel(level){
    console.log(level);
    __pdfInstance.setCurrentZoomLevel(level);
  }
  saveHighlightHandler = (currentHighlight) => {
    var highlightID = '';
    var highlights = [];
    const currentPageId=this.state.currPageIndex;
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageId);
    var highlightHashes = currentHighlight.highlightHash;
    var highlightHash = highlightHashes.split("@")[0].trim().replace(/(\r\n|\n|\r)/gm,"").replace(/['"]+/g, '');
    console.log("highlightHash "+highlightHash);
    var outerHash = highlightHashes.split("@")[1]; 
    console.log("outerHash "+outerHash);        
    var hId =currentHighlight.id;
    var highLightHashArray = [];
    highLightHashArray = highlightHash.split(":");
    console.log("highLightHashArray "+highLightHashArray);
     for(var j=0 ; j<highLightHashArray.length - 1; j=j+4) {
      var firstValue = highLightHashArray[j+1].split(',')[0];
      console.log("firstValue "+firstValue);
      var secondValue = highLightHashArray[j+2].split(',')[0];
      console.log("secondValue "+secondValue);
      var thirdValue = highLightHashArray[j+3].split(',')[0];
      console.log("thirdValue "+thirdValue);
      var fourthValue = highLightHashArray[j+4].split('}')[0];
      console.log("fourthValue "+fourthValue);
      this.props.saveHighlight(this.props.book.userInfo.userid,this.props.params.bookId, this.props.book.bookinfo.userbook.userbookid, this.props.book.bookinfo.book.bookeditionid, currentPage.pageid, currentPage.pagenumber, firstValue, secondValue, thirdValue, fourthValue, this.props.bookshelf.ssoKey, this.props.bookshelf.serverDetails)
      .then(() => {
        highlightID = this.props.book.highlightID
        currentHighlight.id = highlightID;
        console.log("++++++++++++++++++++++"+currentHighlight.id);
        highlights.push(currentHighlight);
        //__pdfInstance.restoreHighlights(highlights, this.deleteHighlight);
        this.displayHighlight();
      })
    }
   
 
}
  createHighlight(e) {
  var currentHighlight={};
  var highlightList = this.state.highlightList;
  var highlightData = __pdfInstance.createHighlight();
  var highlightsLength = highlightList.length;
  currentHighlight.id = highlightsLength + 1;
  currentHighlight.highlightHash = highlightData.serializedHighlight;
  console.log("======== "+currentHighlight.highlightHash);
  currentHighlight.pageIndex = highlightData.pageInformation.pageNumber;
   this.saveHighlightHandler(currentHighlight);
   highlightList.push(currentHighlight);
   
  }
  displayHighlight = () =>{
    this.props.fetchHighlight(this.props.book.userInfo.userid,this.props.params.bookId, this.props.book.bookinfo.book.bookeditionid, this.state.currPageIndex, this.props.bookshelf.ssoKey, this.props.bookshelf.serverDetails)
    .then(()=> {
     this.setState({highlightList : this.props.book.highlights});
     __pdfInstance.restoreHighlights(this.state.highlightList, this.deleteHighlight);
   })
  }
  deleteHighlight = (id) => {

    this.props.removeHighlight(id, this.props.bookshelf.ssoKey, this.props.bookshelf.serverDetails)

  }

  render() {
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    //callbacks.removeBookmarkHandlerForBookmarkList =this.removeBookmarkHandlerForBookmarkList;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPage = this.goToPage;
    callbacks.goToPageCallback = this.goToPageCallback.bind(this);
    const drawerOpen=true;
    return (
 
    <div className={'add'} >
    <div>
        <Header
          classname={this.state.classname}
          bookData={this.props.book}
          bookCallbacks={callbacks}
          setCurrentZoomLevel={this.setCurrentZoomLevel}
          store={this.context.store}
          goToPage={this.goToPageCallback.bind(this)}
          bookId={this.props.params.bookId}
          globalBookId={this.props.bookshelf.globalBookId}
          ssoKey={this.props.bookshelf.ssoKey}
          title={this.props.bookshelf.title}
          curbookID={this.props.params.bookId}
          isET1='Y'
          serverDetails={this.props.bookshelf.serverDetails}
          drawerOpen={drawerOpen}
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
                    <div id="docViewer"  className="docViewer" onMouseUp={this.createHighlight.bind(this)}></div>
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
