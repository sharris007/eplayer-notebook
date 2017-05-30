import React, { Component } from 'react'; /*Importing the react and component from react library. */
import { ViewerComponent } from '@pearson-incubator/viewer';/* Injecting the viewer component from @pearson-incubator. */
import find from 'lodash/find';/* lodash is a JavaScript utility library delivering modularity, performance and find is method used for searching. */
import WidgetManager from '../../../components/widget-integration/widgetManager';/* */
import Header from '../../../components/Header';/* Importing header for padfPage. */
import './PdfBook.scss';/* Importing the css for PdfBook. */
import {Link, browserHistory } from 'react-router'; /* Import the react-router for routing the react component. */
import CircularProgress from 'material-ui/CircularProgress'; /* Import the CircularProgress for adding the progressBar. */
import _ from 'lodash'; /* lodash is a JavaScript utility library delivering modularity and performance. */
import {languages} from '../../../../locale_config/translations/index';
import { eT1Contants } from '../../../components/common/constants';
/* Defining the variables for sessionStorage. */
var pdfBookUrl,pdfBookUrl,title,authorName,thumbnail,ssoKey,serverDetails,globalbookid,pages,assertUrls;

/* component method for loading the pdfbook. */
export class PdfBookReader extends Component {
  /* constructor and super have used in class based React component, used to pass props for communication with other components. */
  constructor(props) {
    super(props);
   /* Here we have set intial state of following properties. */
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
      highlightList: [],
      assertUrlList: [],
      totalPagesToHit: '',
      executed:false
    };
    this.nodesToUnMount = [];
    /* Adding the eventListener on the attribute and attaching the method. 
    Binding the method like parseDom and navChanged on the attribute like contentLoaded and navChanged. */
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);

  }
 /* componentDidMount() is invoked immediately after a component is mounted. */
  componentDidMount() {
    console.log('PdfBookReader'+this.props.bookshelf.length);
      if(this.props.bookshelf.uPdf === undefined){
        title = sessionStorage.getItem('title');
        authorName = sessionStorage.getItem('authorName');
        thumbnail = sessionStorage.getItem('thumbnail');
        ssoKey = sessionStorage.getItem('ssoKey');
        serverDetails = sessionStorage.getItem('serverDetails');
        globalbookid = sessionStorage.getItem('globalbookid');
        pages = JSON.parse(sessionStorage.getItem('pages'));
        assertUrls = JSON.parse(sessionStorage.getItem('assertUrls'));
    }else{
       /* sessionStorage is used to set the token, get the token and remove the token for session management. */
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
    /* Method for getting the toc details for particular book. */
    this.props.fetchTocAndViewer(this.props.params.bookId,authorName,title,thumbnail,this.props.book.bookinfo.book.bookeditionid,ssoKey,serverDetails,this.props.book.bookinfo.book.hastocflatten,this.props.book.bookinfo.book.roleTypeID);
    const courseId = '0';
    /* Method for getting the bookmarks details which is already in book. */
    this.props.fetchBookmarksUsingReaderApi(this.props.params.bookId,true,courseId,this.props.book.userInfo.userid,this.props.PdfbookMessages.PageMsg);
    this.props.fetchHighlightUsingReaderApi(this.props.book.userInfo.userid, this.props.params.bookId,true,courseId,authorName); 
    const firstPage="firstPage";
    if(sessionStorage.getItem("currentPageOrder")){
       this.goToPageCallback(Number(sessionStorage.getItem("currentPageOrder")));
    }else{
      this.goToPage(firstPage);
   }
  }
  /*  Method for loading the pdfpage for particular book by passing the pageIndex. */
  loadPdfPage = (currentPageIndex) =>
  {
    const currentPage = find(pages, page => page.pageorder == currentPageIndex);
    const pdfPath=currentPage.pdfPath;
     var assertUrl = '';
    const assertUrlListObj = find(assertUrls, url => url.pageOrder == currentPageIndex);
    if(assertUrlListObj !== undefined){
      assertUrl = assertUrlListObj.assertUrl;
    }
    var config = {
    //host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
    host: eT1Contants.FOXIT_HOST_URL,
    //PDFassetURL: this.props.bookshelf.uPdf,
    //PDFassetURL: "http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM31206032/ipadpdfs/"+pdfPath,
    PDFassetURL: serverDetails+"/ebookassets/ebook"+this.props.book.bookinfo.book.globalbookid+"/ipadpdfs/"+pdfPath,
    encpwd: null,
    zip: false,
    callbackOnPageChange : this.pdfBookCallback,
     assertUrl : assertUrl
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
  pdfBookCallback = (pdfEvent) => {
     //this.setState({currPageIndex : currentPageIndex});
     if(pdfEvent === 'pageChanged'){
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
          this.setState({executed : false});
          if(this.state.isFirstPageBeingLoad === true)
          {
           this.setState({isFirstPageBeingLoad:false});
          } 
          this.displayHighlight();
        }
      if(pdfEvent === 'pageLoaded'){
          //this.loadAssetUrl();
      
      if (this.state.executed == false)
     {
           var totalPagesToHit = this.getPageOrdersToGetAssertUrl(this.state.currPageIndex);
           this.props.loadAssertUrl(totalPagesToHit, this.openFile, this.storeAssertUrl, pages , assertUrls);
           this.setState({executed : true});
     }
      
}
   
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
   storeAssertUrl = () => {

   if(assertUrls === undefined){
        assertUrls = this.props.book.bookinfo.assertUrls;
        sessionStorage.setItem('assertUrls',JSON.stringify(assertUrls));
      }else if(assertUrls.length > this.props.book.bookinfo.assertUrls.length){
          assertUrls = assertUrls.concat(this.props.book.bookinfo.assertUrls);
        sessionStorage.setItem('assertUrls',JSON.stringify(assertUrls));
      }else{
        assertUrls = this.props.book.bookinfo.assertUrls;
        sessionStorage.setItem('assertUrls',JSON.stringify(assertUrls));
      }
        
  }

  openFile = (currentPageIndex, pdfpath) =>{
   var host =  eT1Contants.FOXIT_HOST_URL ;
   var  PDFassetURL =  serverDetails+"/ebookassets/ebook"+this.props.book.bookinfo.book.globalbookid+"/ipadpdfs/"+pdfpath;
   var index = host.lastIndexOf("foxit-webpdf-web");
   var baseUrl = host.substr(0,index + 17);
   var assetid="",deviceid="",appversion = "" ,authorization = "",acceptLanguage="";
   var headerParams = {
    assetid:"",
    deviceid:"",
    appversion: "" ,
    authorization: "",
    acceptLanguage:""
   }
   var assertUrl = __pdfInstance.openFileUrl(baseUrl,PDFassetURL,headerParams);
    return assertUrl;
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
     this.setState({totalPagesToHit : totalPagesToHit});
    if(totalPagesToHit!==undefined)
    {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageIndexToLoad,
      totalPagesToHit,
      ssoKey,
      serverDetails,this.loadPdfPage,this.props.book.bookinfo.book.roleTypeID
      ).then(()=> {
        if(pages === undefined )
       { 
          pages = this.props.book.bookinfo.pages;
          sessionStorage.setItem('pages',JSON.stringify(pages));
        }else if(pages.length > this.props.book.bookinfo.pages.length){
          pages = pages.concat(this.props.book.bookinfo.pages);
        sessionStorage.setItem('pages',JSON.stringify(pages));
        }else{
          pages = this.props.book.bookinfo.pages;
          sessionStorage.setItem('pages',JSON.stringify(pages));
        }
        this.loadPdfPage(pageIndexToLoad);
      });
    }
    /*else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }*/
  };
/* Method for loading the page after passing the pagenumber. */
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
     this.setState({totalPagesToHit : totalPagesToHit});
    if(totalPagesToHit!=="")
    {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageNum,
      totalPagesToHit,
      ssoKey,
      serverDetails,this.loadPdfPage,this.props.book.bookinfo.book.roleTypeID
      ).then(()=> {
        if(pages == undefined){
        pages = this.props.book.bookinfo.pages;
        sessionStorage.setItem('pages',JSON.stringify(pages));
          
      }else{
         pages = pages.concat(this.props.book.bookinfo.pages);
        sessionStorage.setItem('pages',JSON.stringify(pages));
           
      }
     this.loadPdfPage(pageNum);   
     
      });
    }
    /*else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }*/
    }
  }
  /* Method for getting the pageorder for calculating the page details 
     and we have defined multiple variables in this method. */
  getPageOrdersToGetPageDetails = (pageOrderToNav) => {
    var prevPageCount=0;
    var nextPageCount=0;
    var totalPagesToHit="";
    var pageOrder=pageOrderToNav;
    var totalPageCount=this.getPageCount();
    while(prevPageCount<=5 && pageOrder>0)
    {
      const currentPage = find(pages, page => page.pageorder == pageOrder);
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
      const currentPage = find(pages, page => page.pageorder == pageOrder);
      if(currentPage===undefined)
      {
        totalPagesToHit=totalPagesToHit+pageOrder+",";
        nextPageCount++;
      }
      pageOrder++;
    }
    return totalPagesToHit;
  }

getPageOrdersToGetAssertUrl = (pageOrderToNav) => {
   var prevPageCount=0;
   var nextPageCount=0;
   var totalPagesToHit="";
   var pageOrder=pageOrderToNav;
   var totalPageCount=this.getPageCount();
   while(prevPageCount<=1 && pageOrder>0)
   {
     const currentPage = find(assertUrls, url => url.pageOrder == pageOrder);
     if(currentPage===undefined)
     {
       totalPagesToHit=totalPagesToHit+pageOrder+",";
       prevPageCount++;
     }
     pageOrder--;
   }
   pageOrder=pageOrderToNav+1;
   while(nextPageCount<1 && pageOrder<=totalPageCount)
   {
     const currentPage = find(assertUrls, url => url.pageOrder == pageOrder);
     if(currentPage===undefined)
     {
       totalPagesToHit=totalPagesToHit+pageOrder+",";
       nextPageCount++;
     }
     pageOrder++;
   }
   return totalPagesToHit;
 }
  /* Method for getting the page count and defined a variable inside method that will store the value of numberOfPages. */  
  getPageCount = () => {

    //var pagecount = __pdfInstance.getPageCount();
    var pagecount = this.props.book.bookinfo.book.numberOfPages;
    return pagecount;
  }

 /* Method for calculating the next and previous pages for the selected book. */
  getPrevNextPage = (pageType) =>{
    
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
    const currentPage = find(pages, page => page.pageorder == pageNo);
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
  
  /*  created a  handleBackClick to navigate to bookshelf from any book, 
     also we have used browserHistory (that is React-Router concept) method for page navigation, here are navigating to bookshelf.*/
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

   /* created addBookmarkHandler method for adding bookmark for selected Page, after clicking on bookmark button. */
  addBookmarkHandler = () => {
    //const currentPageId=__pdfInstance.getCurrentPage()+1;
    const currentPageId = this.state.currPageIndex; 
    const currentPage = find(pages, page => page.pageorder == currentPageId);
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
  /* created removeBookmarkHandler method for removing bookmark for selected Page, after clicking on bookmark button. */
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

  
/* Checking the particular page you are trying to set bookmark already a bookmark or not. */
  isCurrentPageBookmarked = () => {
    
    const currentPageId = this.state.currPageIndex;

    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri == currentPageId);
    
    return !(targetBookmark === undefined);
  };
  /* Method for setting the zoom level selected by user, using passing the selected value. */
  setCurrentZoomLevel(level){
    console.log(level);
    __pdfInstance.setCurrentZoomLevel(level);
  }
 /* Method for creating highLight for selected area by user. */
 createHighlight1(highlightData) {   
  const listValue = highlightData.length;
  var i =listValue - 1;
  const highLightcordinates = {   
      left:highlightData[i].offsetLeft,   
      top:highlightData[i].offsetTop,   
      width:highlightData[i].offsetWidth,   
      height:highlightData[i].offsetHeight    
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
  pdfAnnotatorInstance.showCreateHighlightPopup(currentHighlight,highLightcordinates,this.saveHighlight.bind(this),'docViewer_ViewContainer_PageContainer_0',(languages.translations[this.props.locale]));  
} 
/* Method created for displaying the selected highLights. */  
saveHighlight(currentHighlight,highLightMetadata)   
{   
  var highlightList = this.state.highlightList;   
  const currentPageId=this.state.currPageIndex;   
  const courseId = '0';   
  const note = highLightMetadata.noteText;    
  const meta = {    
   "userroleid" : _.toString(this.props.book.bookinfo.book.roleTypeID),    
   "userbookid" : _.toString(this.props.book.bookinfo.userbook.userbookid),   
   "bookeditionid" : _.toString(this.props.book.bookinfo.book.bookeditionid),   
   "roletypeid" : _.toString(this.props.book.bookinfo.book.roleTypeID),    
   "colorcode" : highLightMetadata.currHighlightColorCode ,
   "author" : authorName  
  }   
  const selectedText = currentHighlight.selection; 
  const isShared = highLightMetadata.isShared;   
  const currentPage = find(pages, page => page.pageorder == currentPageId);    
  this.props.saveHighlightUsingReaderApi(_.toString(this.props.book.userInfo.userid), _.toString(this.props.params.bookId), _.toString(currentPage.pageid), _.toString(currentPage.pagenumber), _.toString(courseId), isShared , currentHighlight.highlightHash, note, selectedText, highLightMetadata.currHighlightColor, meta, _.toString(currentPageId)).then(() => {  
    this.displayHighlight();    
  })    
      
}

editHighlight = (id,highLightMetadata) => {   
    this.props.editHighlightUsingReaderApi(id,highLightMetadata.noteText,highLightMetadata.currHighlightColor,highLightMetadata.isShared).then(() => {        
    this.displayHighlight();        
  })        
}    
/* Method defined for when user click on Highlighted area on the page. */
handleHighlightClick(hId)   
{   
  const highlightClicked = find(this.state.highlightList, highlight => highlight.id == hId);    
  pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,this.editHighlight.bind(this),this.deleteHighlight.bind(this),'docViewer_ViewContainer_PageContainer_0',(languages.translations[this.props.locale]));   
  console.log("Hightlight ID"+hId);   
}

 /* Method for creating the Highlight for selected area by user. */
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
   "userroleid" : _.toString(this.props.book.bookinfo.book.roleTypeID),
   "userbookid" : _.toString(this.props.book.bookinfo.userbook.userbookid),
   "bookeditionid" : _.toString(this.props.book.bookinfo.book.bookeditionid),
   "roletypeid" : _.toString(this.props.book.bookinfo.book.roleTypeID),
   "colorcode" : "32CCFF"

  }
  const selectedText = currentHighlight.selection;
  const currentPage = find(pages, page => page.pageorder == currentPageId);
  this.props.saveHighlightUsingReaderApi(_.toString(this.props.book.userInfo.userid), _.toString(this.props.params.bookId), _.toString(currentPage.pageid), _.toString(currentPage.pagenumber), _.toString(courseId), true, currentHighlight.highlightHash, note, selectedText, 'Blue', meta,_.toString(currentPageId)).then(() => {
    this.setState({highlightList : highlightList});
    this.displayHighlight();
  })
   
  }
  /* Method for displaying the Highlight already stored. */ 
  displayHighlight = () =>{
   const currentPageId=this.state.currPageIndex;
    const currentPage = find(pages, page => page.pageorder == currentPageId);
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
  /* Method for delete Highlight via passing the id of selected area. */
  deleteHighlight = (id) => {
    __pdfInstance.removeHighlightElement(id);
    this.props.removeHighlightUsingReaderApi(id);

  }
  clearSessionStorage  = () => {
    sessionStorage.removeItem('assertUrls');
    sessionStorage.removeItem('pages');
    pages = '';
    assertUrls = '';

  }
/* Method for render the component and any change in store data, reload the changes. */
  render() {
    const callbacks = {};
    const {messages}=languages.translations[this.props.locale];
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.saveHighlightHandler = this.saveHighlight;
    //callbacks.removeBookmarkHandlerForBookmarkList =this.removeBookmarkHandlerForBookmarkList;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPage = this.goToPage;
    callbacks.goToPageCallback = this.goToPageCallback.bind(this);
    callbacks.clearSessionStorage = this.clearSessionStorage;
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
    
    /* Here we are passing data, pages, goToPageCallback, getPrevNextPage method and isET1 flag in ViewerComponent which is defined in @pearson-incubator/viewer . */
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
          messages={messages}
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

/* propTypes used for communication to child Component that which props are present in Parent Component. */
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