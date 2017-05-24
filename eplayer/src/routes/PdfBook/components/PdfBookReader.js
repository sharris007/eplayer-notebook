import React, { Component } from 'react';
import { ViewerComponent } from '@pearson-incubator/viewer';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import Header from '../../../components/Header';
import './PdfBook.scss';
import {Link, browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'lodash';
var pdfBookUrl,pdfBookUrl,title,authorName,thumbnail,ssoKey,serverDetails,globalbookid;

export class PdfBookReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: 'headerBar',
      currPageIndex:'',
      pageLoaded: false,
      isFirstPageBeingLoad: true,
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
    console.log('PdfBookReader'+this.props.bookshelf.length);
      if(this.props.bookshelf.uPdf === undefined){
        title = sessionStorage.getItem('title');
        authorName = sessionStorage.getItem('authorName');
        thumbnail = sessionStorage.getItem('thumbnail');
        ssoKey = sessionStorage.getItem('ssoKey');
        serverDetails = sessionStorage.getItem('serverDetails');
        globalbookid = sessionStorage.getItem('globalbookid');
    }else{
        // sessionStorage.setItem('uPdf',this.props.bookshelf.uPdf);
        // sessionStorage.setItem('authorName',this.props.bookshelf.authorName);
        // sessionStorage.setItem('title',this.props.bookshelf.title);
        // sessionStorage.setItem('thumbnail',this.props.bookshelf.thumbnail);
        sessionStorage.setItem('ubd',this.props.bookshelf.ubd);
        sessionStorage.setItem('ubsd',this.props.bookshelf.ubsd);
        sessionStorage.setItem('ssoKey',this.props.bookshelf.ssoKey);
        sessionStorage.setItem('serverDetails',this.props.bookshelf.serverDetails);
        sessionStorage.setItem('globalbookid',this.props.book.bookinfo.book.globalbookid);
        sessionStorage.removeItem('currentPageOrder');
        title = this.props.bookshelf.title;
        authorName = this.props.bookshelf.authorName;
        thumbnail = this.props.bookshelf.thumbnail;
        ssoKey = this.props.bookshelf.ssoKey;
        serverDetails = this.props.bookshelf.serverDetails;
        globalbookid = this.props.book.bookinfo.book.globalbookid;
    }
    this.props.fetchTocAndViewer(this.props.params.bookId,authorName,title,thumbnail,this.props.book.bookinfo.book.bookeditionid,ssoKey,serverDetails,this.props.book.bookinfo.book.hastocflatten);
    const courseId = '0';
    this.props.fetchBookmarksUsingReaderApi(this.props.params.bookId,true,courseId,this.props.book.userInfo.userid,this.props.PdfbookMessages.PageMsg);
    this.props.fetchHighlightUsingReaderApi(this.props.book.userInfo.userid, this.props.params.bookId,true,courseId,authorName)
    //this.props.fetchBookmarks(this.props.params.bookId,this.props.book.bookinfo.userbook.userbookid,this.props.book.bookinfo.book.bookeditionid,ssoKey,serverDetails);
    const firstPage="firstPage";
    //this.goToPage(firstPage);
    if(sessionStorage.getItem("currentPageOrder")){
       this.goToPageCallback(Number(sessionStorage.getItem("currentPageOrder")));
    }else{
      this.goToPage(firstPage);
   }

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
  loadPdfPage = (currentPageIndex) =>
  {
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == currentPageIndex);
    const pdfPath=currentPage.pdfPath;
    var config = {
    //host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    host: "https://foxit-qa.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    //PDFassetURL: this.props.bookshelf.uPdf,
    //PDFassetURL: "http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM31206032/ipadpdfs/"+pdfPath,
    PDFassetURL: serverDetails+"/ebookassets/ebook"+this.props.book.bookinfo.book.globalbookid+"/ipadpdfs/"+pdfPath,
    encpwd: null,
    zip: false,
    callbackOnPageChange : this.pdfBookCallback
    };
    __pdfInstance.registerEvent("textSelected",this.createHighlight1.bind(this));   
    __pdfInstance.registerEvent("highlightClicked",this.handleHighlightClick.bind(this));
    __pdfInstance.createPDFViewer(config);
    this.setState({currPageIndex: currentPageIndex});
    var data = this.state.data;
     if(currentPageIndex == 1){
      data.isFirstPage =true;
     }else{
       data.isFirstPage =false; 
     }
     if(currentPageIndex == this.getPageCount()){
       data.isLastPage =true;
     }else{
      data.isLastPage =false;
     }
     data.currentPageNo = currentPageIndex;
     this.setState({data : data});
  }
  pdfBookCallback = (currentPageIndex) => {
     //this.setState({currPageIndex : currentPageIndex});
     const currentPageOrder=this.state.currPageIndex;
     sessionStorage.setItem("currentPageOrder",this.state.currPageIndex);
     //const currentPageOrder = 2;
     //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageOrder);
     /*var data = this.state.data;
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
     this.setState({data : data});*/
     this.setState({pageLoaded : true});
     if(this.state.isFirstPageBeingLoad === true)
     {
      this.setState({isFirstPageBeingLoad:false});
     } 
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
     this.setState({pageLoaded : false});
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
    //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === pageIndexToLoad);
    const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageIndexToLoad);
    if(totalPagesToHit!==undefined)
    {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageIndexToLoad,
      totalPagesToHit,
      ssoKey,
      serverDetails,this.loadPdfPage
      );
    }
    /*else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }*/
  };

  goToPageCallback(pageNum)
  {  
    this.setState({pageLoaded : false}); 
    //pageNum=pageNum-1;
    if(pageNum>0)
    {
      //__pdfInstance.gotoPdfPage(pageNum);
      //var currPageIndex=__pdfInstance.getCurrentPage();
      //const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === pageNum);
     const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageNum);
    if(totalPagesToHit!=="")
    {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageNum,
      totalPagesToHit,
      ssoKey,
      serverDetails,this.loadPdfPage
      );
    }
    /*else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }*/
    }
  }
  getPageOrdersToGetPageDetails = (pageOrderToNav) => {
    var prevPageCount=0;
    var nextPageCount=0;
    var totalPagesToHit="";
    var pageOrder=pageOrderToNav;
    var totalPageCount=this.getPageCount();
    while(prevPageCount<=5 && pageOrder>0)
    {
      const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == pageOrder);
      if(currentPage===undefined)
      {
        totalPagesToHit=totalPagesToHit+pageOrder+",";
        prevPageCount++;
      }
      pageOrder--;
    }
    pageOrder=pageOrderToNav+1;
    while(nextPageCount<5 && pageOrder<=totalPageCount)
    {
      const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == pageOrder);
      if(currentPage===undefined)
      {
        totalPagesToHit=totalPagesToHit+pageOrder+",";
        nextPageCount++;
      }
      pageOrder++;
    }
    return totalPagesToHit;
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
    var pageNo;
    if(pageType=="prev"){
      pageNo=currPageNumber - 1;
    }
    else if(pageType=="next"){
      pageNo=currPageNumber + 1;
    }
    else if(pageType=="last"){
      pageNo=this.getPageCount();   
    }
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == pageNo);
    if(currentPage===undefined)
    {
      return pageNo;
    }
    else
    {
      return (currentPage.pagenumber);
    }
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
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == currentPageId);
    var currTimeInMillsc = (new Date).getTime();
    const bookmark = {
      id: currentPageId,
      uri:currentPageId,
      createdTimestamp:currTimeInMillsc,
      pageID:currentPage.pageid,
      bookPageNumber:currentPage.pagenumber
    };
    const courseId = '0';
    
    this.props.addBookmarkUsingReaderApi(_.toString(this.props.book.userInfo.userid), _.toString(this.props.params.bookId), _.toString(currentPage.pageid), _.toString(currentPage.pagenumber), _.toString(currentPage.pageorder), courseId, true,this.props.PdfbookMessages.PageMsg);
   
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

    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri == currentPageId);
    const targetBookmarkId = targetBookmark.bkmarkId;

    this.props.removeBookmarkUsingReaderApi(targetBookmarkId);
         
  };

  

  isCurrentPageBookmarked = () => {
    
    const currentPageId = this.state.currPageIndex;

    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri == currentPageId);
    
    return !(targetBookmark === undefined);
  };

  setCurrentZoomLevel(level){
    console.log(level);
    __pdfInstance.setCurrentZoomLevel(level);
  }
 /* saveHighlightHandler = (currentHighlight) => {
    var highlightID = '';
    var highlights = [];
    const currentPageId=this.state.currPageIndex;
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == currentPageId);
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
      this.props.saveHighlight(this.props.book.userInfo.userid,this.props.params.bookId, this.props.book.bookinfo.userbook.userbookid, this.props.book.bookinfo.book.bookeditionid, currentPage.pageid, currentPage.pagenumber, firstValue, secondValue, thirdValue, fourthValue, ssoKey, serverDetails)
      .then(() => {
        highlightID = this.props.book.highlightID
        currentHighlight.id = highlightID;
        console.log("++++++++++++++++++++++"+currentHighlight.id);
        highlights.push(currentHighlight);
        //__pdfInstance.restoreHighlights(highlights, this.deleteHighlight);
        this.displayHighlight();
      })
    }
   
 
}*/
 createHighlight1(highlightData) {   
  const highLightcordinates = {   
      left:highlightData[0].offsetLeft,   
      top:highlightData[0].offsetTop,   
      width:highlightData[0].offsetWidth,   
      height:highlightData[0].offsetHeight    
  };    
  var currentHighlight={};    
  var highlightList = this.state.highlightList;   
  var highlightData = __pdfInstance.createHighlight();    
  var highlightsLength = highlightList.length;    
  currentHighlight.id = highlightsLength + 1;   
  currentHighlight.highlightHash = highlightData.serializedHighlight;   
  currentHighlight.selection = highlightData.selection;   
  console.log("======== "+currentHighlight.highlightHash);    
  currentHighlight.pageIndex = highlightData.pageInformation.pageNumber;    
  pdfAnnotatorInstance.showCreateHighlightPopup(currentHighlight,highLightcordinates,this.saveHighlight.bind(this),'docViewer_ViewContainer_PageContainer_0');    
}   
saveHighlight(currentHighlight,highLightMetadata)   
{   
  var highlightList = this.state.highlightList;   
  const currentPageId=this.state.currPageIndex;   
  const courseId = '0';   
  const note = highLightMetadata.noteText;    
  const meta = {    
   "userroleid" : "2",    
   "userbookid" : _.toString(this.props.book.bookinfo.userbook.userbookid),   
   "bookeditionid" : _.toString(this.props.book.bookinfo.book.bookeditionid),   
   "roletypeid" : "2",    
   "colorcode" : highLightMetadata.currHighlightColorCode ,
   "author" : authorName  
  }   
  const selectedText = currentHighlight.selection;    
  const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == currentPageId);    
  this.props.saveHighlightUsingReaderApi(_.toString(this.props.book.userInfo.userid), _.toString(this.props.params.bookId), _.toString(currentPage.pageid), _.toString(currentPage.pagenumber), _.toString(courseId), true, currentHighlight.highlightHash, note, selectedText, highLightMetadata.currHighlightColor, meta, _.toString(currentPageId)).then(() => {  
    this.displayHighlight();    
  })    
      
}   
handleHighlightClick(hId)   
{   
  const highlightClicked = find(this.state.highlightList, highlight => highlight.id == hId);    
  pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,this.saveHighlight.bind(this),this.deleteHighlight.bind(this),'docViewer_ViewContainer_PageContainer_0');   
  console.log("Hightlight ID"+hId);   
}
  createHighlight(e) {
  var currentHighlight={};
  var highlightList = this.state.highlightList;
  var highlightData = __pdfInstance.createHighlight();
  var highlightsLength = highlightList.length;
  currentHighlight.id = highlightsLength + 1;
  currentHighlight.highlightHash = highlightData.serializedHighlight;
  currentHighlight.selection = highlightData.selection;
  console.log("======== "+currentHighlight.highlightHash);
  currentHighlight.pageIndex = highlightData.pageInformation.pageNumber;
  highlightList.push(currentHighlight);
  const currentPageId=this.state.currPageIndex;
  const courseId = '0';
  const note = '';

  const meta = {
   "userroleid" : "2",
   "userbookid" : _.toString(this.props.book.bookinfo.userbook.userbookid),
   "bookeditionid" : _.toString(this.props.book.bookinfo.book.bookeditionid),
   "roletypeid" : "2",
   "colorcode" : "32CCFF"

  }
  const selectedText = currentHighlight.selection;
  const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == currentPageId);
  this.props.saveHighlightUsingReaderApi(_.toString(this.props.book.userInfo.userid), _.toString(this.props.params.bookId), _.toString(currentPage.pageid), _.toString(currentPage.pagenumber), _.toString(courseId), true, currentHighlight.highlightHash, note, selectedText, 'Blue', meta).then(() => {
    this.setState({highlightList : highlightList});
    this.displayHighlight();
  })
   
  }
  displayHighlight = () =>{
   const currentPageId=this.state.currPageIndex;
    const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder == currentPageId);
    const courseId = '0';
     var highlightList = [];
   this.props.book.annTotalData.forEach((annotation)=>{
      if(annotation.pageId == _.toString(currentPageId))
      {
        highlightList.push(annotation);

      }
      
    })
     this.setState({highlightList : highlightList})
     __pdfInstance.restoreHighlights(this.state.highlightList, this.deleteHighlight);

    
  }
  deleteHighlight = (id) => {
    __pdfInstance.removeHighlightElement(id);
    this.props.removeHighlightUsingReaderApi(id);

  }

  render() {
    const callbacks = {};
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.saveHighlightHandler = this.saveHighlight;
    //callbacks.removeBookmarkHandlerForBookmarkList =this.removeBookmarkHandlerForBookmarkList;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPage = this.goToPage;
    callbacks.goToPageCallback = this.goToPageCallback.bind(this);
    const drawerOpen=true;
    var viewerClassName;
    if(this.state.pageLoaded!==true)
    {
      viewerClassName="hideViewerContent";
    }
    else
    {
      viewerClassName="";
    }
    var searchUrl = ''+serverDetails+'/ebook/ipad/searchbook?bookid='+this.props.params.bookId+'&globalbookid='+globalbookid+'&searchtext=searchText&sortby=1&version=1.0&authkey='+ssoKey+'&outputformat=JSON'
    return (
 
    <div className={'add'} >
    <div>
        <Header locale={this.props.locale}
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
          disableBackgroundColor='true'
          serverDetails={this.props.bookshelf.serverDetails}
          drawerOpen={drawerOpen}
          indexId={ {'searchUrl' : searchUrl} }
          userid={this.props.book.userInfo.userid}
        /> 
      
      <div className="eT1viewerContent">
       {this.state.isFirstPageBeingLoad !== true ? <ViewerComponent locale={this.props.locale} data={this.state.data} pages={this.props.book.viewer.pages} goToPageCallback={this.goToPage} getPrevNextPage={this.getPrevNextPage} isET1='Y'/>:null}
      </div>
      </div>
        <div>
        <div id="main">
            <div id="mainContainer" className="pdf-fwr-pc-main">
                <div id="right" className="pdf-fwr-pc-right">
                 <div id="toolbar" className="pdf-fwr-toolbar"></div>
                  <div id="frame" className={viewerClassName}>
                    <div id="docViewer"  className="docViewer"></div>
                  </div>
                 </div>
                </div>
            </div>
        </div>
         {this.state.pageLoaded !== true ?
                  <div className="centerCircularBar">
                  <CircularProgress style={{ margin: '40px auto', display: 'block' }} />
                  </div> : null}
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
