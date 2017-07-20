/* global sessionStorage, __pdfInstance, pdfAnnotatorInstance */
import React, { Component } from 'react'; /* Importing the react and component from react library. */
import { ViewerComponent } from '@pearson-incubator/viewer';/* Injecting the viewer component from @pearson-incubator. */
import find from 'lodash/find';/* lodash is a JavaScript utility library delivering modularity, performance and find is method used for searching. */
import { browserHistory } from 'react-router'; /* Import the react-router for routing the react component. */
import CircularProgress from 'material-ui/CircularProgress'; /* Import the CircularProgress for adding the progressBar. */
import _ from 'lodash'; /* lodash is a JavaScript utility library delivering modularity and performance. */
import WidgetManager from '../../../components/widget-integration/widgetManager';/* */
import Header from '../../../components/Header';/* Importing header for padfPage. */
import './PdfBook.scss';/* Importing the css for PdfBook. */
import { languages } from '../../../../locale_config/translations/index';
import { eT1Contants } from '../../../components/common/constants';
import { AudioPlayer,VideoPlayerPreview,ImageViewerPreview} from '@pearson-incubator/aquila-js-media';
import { ExternalLink } from '@pearson-incubator/aquila-js-basics';
/* Defining the variables for sessionStorage. */
let title;
let authorName;
let thumbnail;
let ssoKey;
let serverDetails;
let globalbookid;
let pages;
let assertUrls;

/* component method for loading the pdfbook. */
export class PdfBookReader extends Component {
  /* constructor and super have used in class based React component, used to pass props for communication with other components. */
  constructor(props) {
    super(props);
   /* Here we have set intial state of following properties. */
    this.state = {
      classname: 'headerBar',
      currPageIndex: '',
      pageLoaded: false,
      drawerOpen: false,
      isFirstPageBeingLoad: true,
      data: {
        currentPageNo: '',
        isFirstPage: true,
        isLastPage: false
      },
      isET1: 'Y',
      highlightList: [],
      assertUrlList: [],
      totalPagesToHit: '',
      executed: false
    };
    this.nodesToUnMount = [];
    /* Adding the eventListener on the attribute and attaching the method.
    Binding the method like parseDom and navChanged on the attribute like contentLoaded and navChanged. */
    document.body.addEventListener('contentLoaded', this.parseDom);
    document.body.addEventListener('navChanged', this.navChanged);
    pdfAnnotatorInstance.init();
  }
 /* componentDidMount() is invoked immediately after a component is mounted. */
  componentDidMount() {
    if (this.props.bookshelf.uPdf === undefined) {
      title = sessionStorage.getItem('title');
      authorName = sessionStorage.getItem('authorName');
      thumbnail = sessionStorage.getItem('thumbnail');
      ssoKey = sessionStorage.getItem('ssoKey');
      serverDetails = sessionStorage.getItem('serverDetails');
      globalbookid = sessionStorage.getItem('globalbookid');
      pages = JSON.parse(sessionStorage.getItem('pages'));
      assertUrls = JSON.parse(sessionStorage.getItem('assertUrls'));
    } else {
       /* sessionStorage is used to set the token, get the token and remove the token for session management. */
      sessionStorage.setItem('ubd', this.props.bookshelf.ubd);
      sessionStorage.setItem('ubsd', this.props.bookshelf.ubsd);
      sessionStorage.setItem('ssoKey', this.props.bookshelf.ssoKey);
      sessionStorage.setItem('serverDetails', this.props.bookshelf.serverDetails);
      sessionStorage.setItem('globalbookid', this.props.book.bookinfo.book.globalbookid);
      sessionStorage.removeItem('currentPageOrder');
      title = this.props.bookshelf.title;
      authorName = this.props.bookshelf.authorName;
      thumbnail = this.props.bookshelf.thumbnail;
      ssoKey = this.props.bookshelf.ssoKey;
      serverDetails = this.props.bookshelf.serverDetails;
      globalbookid = this.props.book.bookinfo.book.globalbookid;
    }
    /* Method for getting the toc details for particular book. */
    this.props.fetchTocAndViewer(this.props.params.bookId, authorName, title, thumbnail,
      this.props.book.bookinfo.book.bookeditionid, ssoKey, serverDetails,
      this.props.book.bookinfo.book.hastocflatten, this.props.book.bookinfo.book.roleTypeID);
    let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = 0;
    }
    /* Method for getting the bookmarks details which is already in book. */
    this.props.fetchBookmarksUsingReaderApi(this.props.params.bookId, true, courseId,
      this.props.book.userInfo.userid, this.props.PdfbookMessages.PageMsg);
    this.props.fetchHighlightUsingReaderApi(this.props.book.userInfo.userid,
      this.props.params.bookId, true, courseId, authorName);
    const firstPage = 'firstPage';
    if (sessionStorage.getItem('currentPageOrder')) {
      this.goToPageCallback(Number(sessionStorage.getItem('currentPageOrder')));
    } else {
      this.goToPage(firstPage);
    }
  }
  /*  Method for loading the pdfpage for particular book by passing the pageIndex. */
  loadPdfPage = (currentPageIndex) => {
    const currentPage = find(pages, page => page.pageorder === currentPageIndex);
    const pdfPath = currentPage.pdfPath;
    let assertUrl = '';
    const assertUrlListObj = find(assertUrls, url => url.pageOrder === currentPageIndex);
    if (assertUrlListObj !== undefined) {
      assertUrl = assertUrlListObj.assertUrl;
    }
    const config = {
    // host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
      host: eT1Contants.FOXIT_HOST_URL,
    // PDFassetURL: this.props.bookshelf.uPdf,
    // PDFassetURL: "http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM31206032/ipadpdfs/"+pdfPath,
      PDFassetURL: `${serverDetails}/ebookassets`
                + `/ebook${this.props.book.bookinfo.book.globalbookid}/ipadpdfs/${pdfPath}`,
      encpwd: null,
      zip: false,
      callbackOnPageChange: this.pdfBookCallback,
      assertUrl
    };
    __pdfInstance.registerEvent('textSelected', this.createHighlight1.bind(this));
    __pdfInstance.registerEvent('highlightClicked', this.handleHighlightClick.bind(this));
        __pdfInstance.registerEvent('regionClicked', this.handleRegionClick.bind(this));
    __pdfInstance.createPDFViewer(config);
    this.setState({ currPageIndex: currentPageIndex });
    const data = this.state.data;
    if (currentPageIndex === 1) {
      data.isFirstPage = true;
    } else {
      data.isFirstPage = false;
    }
    if (currentPageIndex === this.getPageCount()) {
      data.isLastPage = true;
    } else {
      data.isLastPage = false;
    }
    data.currentPageNo = currentPageIndex;
    this.setState({ data });
  }
  pdfBookCallback = (pdfEvent) => {
     // this.setState({currPageIndex : currentPageIndex});
    if (pdfEvent === 'pageChanged') {
      sessionStorage.setItem('currentPageOrder', this.state.currPageIndex);
      this.props.fetchRegionsInfo(this.props.params.bookId,this.props.book.bookinfo.book.bookeditionid,this.state.currPageIndex,ssoKey,serverDetails).then(() => {
        if(this.props.book.regions.length > 0 )
        {
          __pdfInstance.displayRegions(this.props.book.regions);
        }
        else
        {
          console.log("None");
        }
      });
          // const currentPageOrder = 2;
          // const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === currentPageOrder);
          /* var data = this.state.data;
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
      this.setState({ pageLoaded: true });
      this.setState({ executed: false });
      if (this.state.isFirstPageBeingLoad === true) {
        this.setState({ isFirstPageBeingLoad: false });
      }
    }
    if (pdfEvent === 'pageLoaded') {
          // this.loadAssetUrl();
      setTimeout(this.displayHighlight, 1000);
      if (this.state.executed === false) {
        const totalPagesToHit = this.getPageOrdersToGetAssertUrl(this.state.currPageIndex);
        this.props.loadAssertUrl(totalPagesToHit, this.openFile, this.storeAssertUrl, pages);
        this.setState({ executed: true });
      }
    }

     // If already page details are in store then we do not hit fetchPageInfo again
     /* if(currentPage===undefined)
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
    if (assertUrls === undefined || assertUrls === null) {
      assertUrls = this.props.book.bookinfo.assertUrls;
      sessionStorage.setItem('assertUrls', JSON.stringify(assertUrls));
    } else if (assertUrls.length > this.props.book.bookinfo.assertUrls.length) {
      assertUrls = assertUrls.concat(this.props.book.bookinfo.assertUrls);
      sessionStorage.setItem('assertUrls', JSON.stringify(assertUrls));
    } else {
      assertUrls = this.props.book.bookinfo.assertUrls;
      sessionStorage.setItem('assertUrls', JSON.stringify(assertUrls));
    }
  }

  openFile = (currentPageIndex, pdfpath) => {
    const host = eT1Contants.FOXIT_HOST_URL;
    const PDFassetURL = `${serverDetails}/ebookassets/`
          + `ebook${this.props.book.bookinfo.book.globalbookid}/ipadpdfs/${pdfpath}`;
    const index = host.lastIndexOf('foxit-webpdf-web');
    const baseUrl = host.substr(0, index + 17);
    const headerParams = {
      assetid: '',
      deviceid: '',
      appversion: '',
      authorization: '',
      acceptLanguage: ''
    };
    const assertUrl = __pdfInstance.openFileUrl(baseUrl, PDFassetURL, headerParams);
    return assertUrl;
  }

  goToPage = (navType) => {
     // var currPageIndex=__pdfInstance.getCurrentPage();
     // this.setState({currPageIndex: currPageIndex});
    __pdfInstance.removeExistingHighlightCornerImages();
    this.setState({ drawerOpen: false });
    this.setState({ pageLoaded: false });
    const currPageIndex = this.state.currPageIndex;
    let pageIndexToLoad;
    if (navType === 'prev') {
      pageIndexToLoad = currPageIndex - 1;
      // this.setState({currPageIndex: prevPageIndex});
      // __pdfInstance.gotoPdfPage(prevPageIndex);
      // currPageIndex=prevPageIndex;
    } else if (navType === 'next') {
      pageIndexToLoad = currPageIndex + 1;
      // this.setState({currPageIndex: nextPageIndex});
      // __pdfInstance.gotoPdfPage(nextPageIndex);
      // currPageIndex=nextPageIndex;
    } else if (navType === 'firstPage') {
      // this.setState({currPageIndex: 1});
      pageIndexToLoad = 1;
    }
    // const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === pageIndexToLoad);
    const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageIndexToLoad);
    this.setState({ totalPagesToHit });
    if (totalPagesToHit !== undefined) {
      this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageIndexToLoad,
      totalPagesToHit,
      ssoKey,
      serverDetails, this.loadPdfPage, this.props.book.bookinfo.book.roleTypeID
      ).then(() => {
        if (pages === undefined || pages === null) {
          pages = this.props.book.bookinfo.pages;
          sessionStorage.setItem('pages', JSON.stringify(pages));
        } else if (pages.length > this.props.book.bookinfo.pages.length) {
          pages = pages.concat(this.props.book.bookinfo.pages);
          sessionStorage.setItem('pages', JSON.stringify(pages));
        } else {
          pages = this.props.book.bookinfo.pages;
          sessionStorage.setItem('pages', JSON.stringify(pages));
        }
        this.loadPdfPage(pageIndexToLoad);
      });
    }
    /* else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }*/
  };
/* Method for loading the page after passing the pagenumber. */
  goToPageCallback = (pageNum) => {
    __pdfInstance.removeExistingHighlightCornerImages();
    this.setState({ drawerOpen: false });
    this.setState({ pageLoaded: false });
    // pageNum=pageNum-1;
    if (pageNum > 0) {
      // __pdfInstance.gotoPdfPage(pageNum);
      // var currPageIndex=__pdfInstance.getCurrentPage();
      // const currentPage = find(this.props.book.bookinfo.pages, page => page.pageorder === pageNum);
      const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageNum);
      this.setState({ totalPagesToHit });
      if (totalPagesToHit !== '') {
        this.props.fetchPageInfo(this.props.book.userInfo.userid,
      this.props.params.bookId,
      this.props.params.bookId,
      this.props.book.bookinfo.book.bookeditionid,
      pageNum,
      totalPagesToHit,
      ssoKey,
      serverDetails, this.loadPdfPage, this.props.book.bookinfo.book.roleTypeID
      ).then(() => {
        if (pages === undefined || pages === null) {
          pages = this.props.book.bookinfo.pages;
          sessionStorage.setItem('pages', JSON.stringify(pages));
        } else {
          pages = pages.concat(this.props.book.bookinfo.pages);
          sessionStorage.setItem('pages', JSON.stringify(pages));
        }
        this.loadPdfPage(pageNum);
      });
      }
    /* else
    {
      this.loadPdfPage(currentPage.pdfPath,currentPage.pageorder);
    }*/
    }
  }

  findPages = (lPages, pageOrder) => find(lPages, page => page.pageorder === pageOrder)
  findAssertUrl = (lassertUrls, pageOrder) => find(lassertUrls, url => url.pageorder === pageOrder)
  /* Method for getting the pageorder for calculating the page details
     and we have defined multiple variables in this method. */
  getPageOrdersToGetPageDetails = (pageOrderToNav) => {
    let prevPageCount = 0;
    let nextPageCount = 0;
    let totalPagesToHit = '';
    let pageOrder = pageOrderToNav;
    const totalPageCount = this.getPageCount();
    while (prevPageCount <= 5 && pageOrder > 0) {
      const currentPage = (pages !== undefined) ? this.findPages(pages, pageOrder) : undefined;
      if (currentPage === undefined) {
        totalPagesToHit = `${totalPagesToHit + pageOrder},`;
        prevPageCount++;
      }
      pageOrder--;
    }
    pageOrder = pageOrderToNav + 1;
    while (nextPageCount < 5 && pageOrder <= totalPageCount) {
      const currentPage = (pages !== undefined) ? this.findPages(pages, pageOrder) : undefined;
      if (currentPage === undefined) {
        totalPagesToHit = `${totalPagesToHit + pageOrder},`;
        nextPageCount++;
      }
      pageOrder++;
    }
    return totalPagesToHit;
  }

  getPageOrdersToGetAssertUrl = (pageOrderToNav) => {
    let prevPageCount = 0;
    let nextPageCount = 0;
    let totalPagesToHit = '';
    let pageOrder = pageOrderToNav;
    const totalPageCount = this.getPageCount();
    while (prevPageCount <= 1 && pageOrder > 0) {
      const currentPage = (assertUrls !== undefined) ? this.findAssertUrl(assertUrls, pageOrder) : undefined;
      if (currentPage === undefined) {
        totalPagesToHit = `${totalPagesToHit + pageOrder},`;
        prevPageCount++;
      }
      pageOrder--;
    }
    pageOrder = pageOrderToNav + 1;
    while (nextPageCount < 1 && pageOrder <= totalPageCount) {
      const currentPage = (assertUrls !== undefined) ? this.findAssertUrl(assertUrls, pageOrder) : undefined;
      if (currentPage === undefined) {
        totalPagesToHit = `${totalPagesToHit + pageOrder},`;
        nextPageCount++;
      }
      pageOrder++;
    }
    return totalPagesToHit;
  }
  /* Method for getting the page count and defined a variable inside method that will store the value of numberOfPages. */
  getPageCount = () => {
    // var pagecount = __pdfInstance.getPageCount();
    const pagecount = this.props.book.bookinfo.book.numberOfPages;
    return pagecount;
  }

 /* Method for calculating the next and previous pages for the selected book. */
  getPrevNextPage = (pageType) => {
    const currPageNumber = this.state.currPageIndex;
    let pageNo;
    if (pageType === 'prev') {
      pageNo = currPageNumber - 1;
    } else if (pageType === 'next') {
      pageNo = currPageNumber + 1;
    } else if (pageType === 'last') {
      pageNo = this.getPageCount();
    }
    const currentPage = find(pages, page => page.pageorder === pageNo);
    if (currentPage === undefined) {
      return pageNo;
    }

    return (currentPage.pagenumber);
  }

  /* getCurrentPageIndex = () => {
   var currPageIndex=this.props.book.bookinfo.book.numberOfPages;
   return currPageIndex;
  }*/

  /*  created a  handleBackClick to navigate to bookshelf from any book,
     also we have used browserHistory (that is React-Router concept) method for page navigation, here are navigating to bookshelf.*/
  handleBackClick = () => {
    browserHistory.push('/bookshelf');
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
    // const currentPageId=__pdfInstance.getCurrentPage()+1;
    const currentPageId = this.state.currPageIndex;
    const currentPage = find(pages, page => page.pageorder === currentPageId);
    // const currTimeInMillsc = (new Date()).getTime();
    let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = 0;
    }

    this.props.addBookmarkUsingReaderApi(_.toString(this.props.book.userInfo.userid),
      _.toString(this.props.params.bookId), _.toString(currentPage.pageid),
      _.toString(currentPage.pagenumber), _.toString(currentPage.pageorder),
      courseId, true, this.props.PdfbookMessages.PageMsg);
  }
  /* created removeBookmarkHandler method for removing bookmark for selected Page, after clicking on bookmark button. */
  removeBookmarkHandler = (bookmarkId) => {
    let currentPageId;
    if (bookmarkId !== undefined) {
      currentPageId = bookmarkId;
    } else {
      // currentPageId =__pdfInstance.getCurrentPage()+1;
      currentPageId = this.state.currPageIndex;
    }

    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    const targetBookmarkId = targetBookmark.bkmarkId;

    this.props.removeBookmarkUsingReaderApi(targetBookmarkId);
  };


/* Checking the particular page you are trying to set bookmark already a bookmark or not. */
  isCurrentPageBookmarked = () => {
    const currentPageId = this.state.currPageIndex;

    const targetBookmark = find(this.props.book.bookmarks, bookmark => bookmark.uri === currentPageId);

    return !(targetBookmark === undefined);
  };
  /* Method for setting the zoom level selected by user, using passing the selected value. */
  setCurrentZoomLevel = (level) => {
    __pdfInstance.setCurrentZoomLevel(level);
    this.displayHighlight();
  }
  onHotspotClose() {
    if($('#hotspot').length > 0)
    {
      $('#hotspot').empty();
    }
  }
goToPageNumber = (pageNo) => {
  var totalPagesToHit = this.getPageOrdersToGetPageDetails(pageNo);
  var currentPage = find(pages,page => page.pagenumber === pageNo)
  if(currentPage == undefined)
  {
    this.props.fetchPageInfo(this.props.book.userInfo.userid,this.props.params.bookId,this.props.params.bookId, this.props.book.bookinfo.book.bookeditionid,
    pageNo,totalPagesToHit,ssoKey,serverDetails, this.loadPdfPage,this.props.book.bookinfo.book.roleTypeID)
    .then(() => {
      pages = pages.concat(this.props.book.bookinfo.pages);
      sessionStorage.setItem('pages',JSON.stringify(pages));
      currentPage = find(pages,page => page.pagenumber == pageNo);
      this.goToPageCallback(currentPage.pageorder);
    });
  }
  else
  {
    this.goToPageCallback(currentPage.pageorder);
  }
  
}

/*
Convert http urls into https
*/
createHttps = (uri) => {
  if(/^http:\/\//i.test(uri))
  {
    var link=uri.substring(4);
    uri = 'https' + link ;
  }
  return uri;
}
/*Method to render the clicked region*/

  renderHotspot = (hotspotDetails) => {
    var regionComponent = " ";
    var hotspotData,source;
    switch(hotspotDetails.regionTypeID) {
      case 1:   source=this.createHttps(hotspotDetails.linkValue);
                hotspotData = {
                audioSrc :source,
                audioTitle :hotspotDetails.name
              };
              regionComponent = <AudioPlayer url={hotspotData.audioSrc} title={hotspotData.audioTitle} />;
              break;
      case 2:
      case 10: this.goToPageNumber(Number(hotspotDetails.linkValue));
               break;
      case 6: source=this.createHttps(hotspotDetails.linkValue);
              hotspotData = {
                alt : hotspotDetails.name,
                src : source,
                width : hotspotDetails.mediaWidth,
                height : hotspotDetails.mediaHeight,
                title : hotspotDetails.name,
                items : hotspotDetails
              };
              regionComponent = <ImageViewerPreview data={hotspotData} onClose={(this.onHotspotClose)}/>;
              break;
      case 12:  source=this.createHttps(hotspotDetails.linkValue);
                hotspotData = {
                title : hotspotDetails.name,
                // src : hotspotDetails.linkValue,
                 // src: '//mediaplayer.pearsoncmg.com/assets/_pmd.true/hZjJpMwtrENDO2_Y_4PVRSAt5J1rTQTm',
                src : source,
                caption : 'Video is here',
                id : hotspotDetails.regionID,
                thumbnail : {
                  src : null,
                },
                "transcript": [
                {
                  "id": "urn:pearson:text:0166E52D-5ABA-4341-999F-C3ACE48CF27B",
                  "lang": "en",
                  "type": "transcript",
                  "src": "//mediaplayer.pearsoncmg.com/assets/_pmd.true/hZjJpMwtrENDO2_Y_4PVRSAt5J1rTQTm?mimeType=vtt&lang=en"
                }
              ],
                alt : hotspotDetails.name,
              };
              regionComponent = <VideoPlayerPreview data={hotspotData} onClose={(this.onHotspotClose)}/>;
              break;
      case 9:
      case 13:
      case 15: source=this.createHttps(hotspotDetails.linkValue);
               var docLink=source;
               var iframe = document.getElementById('document');
               iframe.src =  docLink;
               break;
      case 11: source=this.createHttps(hotspotDetails.linkValue);
               hotspotData = {
                 title : hotspotDetails.name,
                 src : source
               };
               regionComponent = <ExternalLink title={hotspotData.title} src={hotspotData.src} onClose={(this.onHotspotClose)} />;
               break;
      case 14: source=this.createHttps(hotspotDetails.linkValue);
               window.open(source,"_blank");
               break;
      case 16: var role = this.props.book.bookinfo.book.roleTypeID;
               var courseId =0 ;
               var userId = this.props.book.userInfo.userid;
               var ltiLink = hotspotDetails.linkValue;
               // var ltiUrl = serverDetails + 'ebook/toolLaunch.do?json=' + ltiLink + '&contextid' + courseId + '&role' + role + '&userlogin' + userId ;
               var ltiUrl ="https://view.cert1.ebookplus.pearsoncmg.com/ebook/toolLaunch.do?json=handler_urn:pearson/xl_platform/slink/x-pearson-xl_platform,targetId:assignedhomework&contextid=82299&role=3&userlogin=115314";
               window.open(ltiUrl,"_blank");
               break;
      default :regionComponent = null;
               break;
    };
    return regionComponent;
  }

/*Method to update the state with details of the clicked region*/
  handleRegionClick(hotspotID) {
    if(this.state.regionData)
    {
      this.setState({regionData : null});
    }
    if(this.props.book.regions.length > 0 )
    {
      for(var i=0; i < this.props.book.regions.length ; i++)
      {
          if(hotspotID == this.props.book.regions[i].regionID)
          {
            var regionDetails = this.props.book.regions[i];
            if (regionDetails.regionTypeID == 2 || regionDetails.regionTypeID == 7 || regionDetails.regionTypeID == 10 || regionDetails.regionTypeID == 14)
            {
              this.renderHotspot(regionDetails);
            }
            else if(regionDetails.regionTypeID == 9 || regionDetails.regionTypeID ==13 || regionDetails.regionTypeID ==15)
            {
              var parentPageElement = document.getElementById('docViewer_ViewContainer_PageContainer_0');
              var fileFrame=document.createElement("IFRAME");
              fileFrame.style.display='none';
              fileFrame.setAttribute('id','document');
              parentPageElement.appendChild(fileFrame);
              this.renderHotspot(regionDetails);
            }
            else
            {
              this.setState({regionData : regionDetails});
            }
            break;
          }
      }    
    }    
  }
 /* Method for creating highLight for selected area by user. */
  createHighlight1(highlightData) {
    /* const listValue = highlightData.length;
    const i = listValue - 1;*/
    const highLightcordinates = {
      left: highlightData[0].offsetLeft,
      top: highlightData[0].offsetTop,
      width: highlightData[0].offsetWidth,
      height: highlightData[0].offsetHeight
    };
    const currentHighlight = {};
    const highlightList = this.state.highlightList;
    const highlightData1 = __pdfInstance.createHighlight();
    const curHighlightCords = highlightData1.serializedHighlight;
    const curHighlightCordsStr = curHighlightCords.replace('@0.000000', '');
    const curHighlightCordsList = JSON.parse(curHighlightCordsStr);
    let highLightID;
    let isExistinghighlightFound = false;
    for (let i = 0; i < highlightList.length; i++) {
      const actSt = highlightList[i].highlightHash;
      const objSt = actSt.replace('@0.000000', '');
      const cordList = JSON.parse(objSt);
      for (let j = 0; j < cordList.length; j++) {
        for (let k = 0; k < curHighlightCordsList.length; k++) {
          if (parseInt(cordList[j].left, 10) <= parseInt(curHighlightCordsList[k].left, 10)
                  && parseInt(cordList[j].top, 10) <= parseInt(curHighlightCordsList[k].top, 10)
                  && parseInt(cordList[j].bottom, 10) >= parseInt(curHighlightCordsList[k].bottom, 10)
                  && parseInt(cordList[j].right, 10) >= parseInt(curHighlightCordsList[k].right, 10)) {
            highLightID = highlightList[i].id;
            isExistinghighlightFound = true;
          }
          if (isExistinghighlightFound) {
            break;
          }
        }
        if (isExistinghighlightFound) {
          break;
        }
      }
      if (isExistinghighlightFound) {
        break;
      }
    }

    if (highLightID !== undefined && isExistinghighlightFound) {
      this.handleHighlightClick(highLightID);
    } else {
      const highlightsLength = highlightList.length;
      currentHighlight.id = highlightsLength + 1;
      currentHighlight.highlightHash = highlightData1.serializedHighlight;
      currentHighlight.selection = highlightData1.selection;
      currentHighlight.pageIndex = highlightData1.pageInformation.pageNumber;
      pdfAnnotatorInstance.showCreateHighlightPopup(currentHighlight, highLightcordinates,
        this.saveHighlight.bind(this), this.editHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_0',
        (languages.translations[this.props.locale]), this.props.book.bookinfo.book.roleTypeID);
    }
  }
/* Method created for displaying the selected highLights. */
  saveHighlight(currentHighlight, highLightMetadata) {
    const currentPageId = this.state.currPageIndex;
    let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = 0;
    }
    const note = highLightMetadata.noteText;
    const meta = {
      userroleid: _.toString(this.props.book.bookinfo.book.roleTypeID),
      userbookid: _.toString(this.props.book.bookinfo.userbook.userbookid),
      bookeditionid: _.toString(this.props.book.bookinfo.book.bookeditionid),
      roletypeid: _.toString(this.props.book.bookinfo.book.roleTypeID),
      colorcode: highLightMetadata.currHighlightColorCode,
      author: authorName
    };
    const selectedText = currentHighlight.selection;
    const isShared = highLightMetadata.isShared;
    const currentPage = find(pages, page => page.pageorder === currentPageId);
    this.props.saveHighlightUsingReaderApi(_.toString(this.props.book.userInfo.userid),
      _.toString(this.props.params.bookId), _.toString(currentPage.pageid),
      _.toString(currentPage.pagenumber), _.toString(courseId), isShared, currentHighlight.highlightHash,
      note, selectedText, highLightMetadata.currHighlightColor,
      meta, _.toString(currentPageId)).then((newHighlight) => {
        pdfAnnotatorInstance.setCurrentHighlight(newHighlight);
        this.displayHighlight();
      });
  }

  editHighlight = (id, highLightMetadata) => {
    this.props.editHighlightUsingReaderApi(id, highLightMetadata.noteText,
      highLightMetadata.currHighlightColor, highLightMetadata.isShared).then(() => {
        this.displayHighlight();
      });
  }
/* Method defined for when user click on Highlighted area on the page. */
  handleHighlightClick(highLightClickedData) {
    var hId;
    var cornerFoldedImageTop;
    if(highLightClickedData.highlightId === undefined)
    {
      hId = highLightClickedData;
    } 
    else
    {
      // Note clicked from corner folded image 
      hId = highLightClickedData.highlightId;
      cornerFoldedImageTop = highLightClickedData.cornerFoldedImageTop;
    }
    var highlightClicked = find(this.state.highlightList, highlight => highlight.id === hId);
    if (highlightClicked.shared === true)
    {
      highlightClicked = find(this.props.book.annTotalData, highlight => highlight.id === hId);
    }
    pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,
      this.editHighlight.bind(this), this.deleteHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_0',
      (languages.translations[this.props.locale]), this.props.book.bookinfo.book.roleTypeID,cornerFoldedImageTop);
  }

 /* Method for creating the Highlight for selected area by user. */
  createHighlight() {
    const currentHighlight = {};
    const highlightList = this.state.highlightList;
    const highlightData = __pdfInstance.createHighlight();
    const highlightsLength = highlightList.length;
    currentHighlight.id = highlightsLength + 1;
    currentHighlight.highlightHash = highlightData.serializedHighlight;
    currentHighlight.selection = highlightData.selection;
    currentHighlight.pageIndex = highlightData.pageInformation.pageNumber;
    highlightList.push(currentHighlight);
    const currentPageId = this.state.currPageIndex;
    const courseId = '0';
    const note = '';

    const meta = {
      userroleid: _.toString(this.props.book.bookinfo.book.roleTypeID),
      userbookid: _.toString(this.props.book.bookinfo.userbook.userbookid),
      bookeditionid: _.toString(this.props.book.bookinfo.book.bookeditionid),
      roletypeid: _.toString(this.props.book.bookinfo.book.roleTypeID),
      colorcode: '32CCFF'

    };
    const selectedText = currentHighlight.selection;
    const currentPage = find(pages, page => page.pageorder === currentPageId);
    this.props.saveHighlightUsingReaderApi(_.toString(this.props.book.userInfo.userid),
      _.toString(this.props.params.bookId), _.toString(currentPage.pageid),
      _.toString(currentPage.pagenumber), _.toString(courseId), true,
      currentHighlight.highlightHash, note, selectedText, 'Blue',
      meta, _.toString(currentPageId)).then(() => {
        this.setState({ highlightList });
        this.displayHighlight();
      });
  }
  /* Method for displaying the Highlight already stored. */
  displayHighlight = () => {
    const currentPageId = this.state.currPageIndex;
    const highlightList = [];
    this.props.book.annTotalData.forEach((annotation) => {
      if (annotation.pageId === currentPageId) {
        if (_.toString(annotation.meta.roletypeid) === _.toString(this.props.book.bookinfo.book.roleTypeID)) {
          highlightList.push(annotation);
        } else if (this.props.book.bookinfo.book.roleTypeID === 2
          && annotation.meta.roletypeid === 3 && annotation.shared) {
          highlightList.push(annotation);
        }
      }
    });
    this.setState({ highlightList });
    var highlightListToRender = JSON.parse(JSON.stringify(highlightList));
    highlightListToRender.forEach((highlight) => {
          if(highlight.shared)
          {
            highlight.color = '#00a4e0';
            highlight.meta.colorcode = '#00a4e0';
          }
    });
    __pdfInstance.restoreHighlights(highlightListToRender, this.deleteHighlight);
    __pdfInstance.reRenderHighlightCornerImages(highlightListToRender);
  }
  /* Method for delete Highlight via passing the id of selected area. */
  deleteHighlight = (id) => {
    __pdfInstance.removeHighlightElement(id);
    this.props.removeHighlightUsingReaderApi(id).then(() => {
      this.displayHighlight();
    });
  }
  clearSessionStorage = () => {
    sessionStorage.removeItem('assertUrls');
    sessionStorage.removeItem('pages');
    sessionStorage.removeItem('currentPageOrder');
    pages = '';
    assertUrls = '';
  }

  viewerContentCallBack = (viewerCallBack) => {
    if (viewerCallBack === false) {
      this.setState({ drawerOpen: true });
    } else {
      this.setState({ drawerOpen: false });
    }
  }

  onPageClick = () => {
    __pdfInstance.enableSelectTool();
  }
/* Method for render the component and any change in store data, reload the changes. */
  render() {
    const callbacks = {};
    const { messages } = languages.translations[this.props.locale];
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.saveHighlightHandler = this.saveHighlight;
    // callbacks.removeBookmarkHandlerForBookmarkList =this.removeBookmarkHandlerForBookmarkList;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPage = this.goToPage;
    callbacks.goToPageCallback = this.goToPageCallback;
    callbacks.clearSessionStorage = this.clearSessionStorage;
    // const drawerOpen = true;
    let viewerClassName;
    if (this.state.pageLoaded !== true) {
      viewerClassName = 'hideViewerContent';
    } else {
      viewerClassName = '';
    }
    const searchUrl = `${serverDetails}/ebook/ipad/searchbookpage?bookid=${this.props.params.bookId}`
        + `&globalbookid=${globalbookid}&searchtext=searchText&sortby=1&version=1.0&authkey=${ssoKey}`;

    /* Here we are passing data, pages, goToPageCallback,
       getPrevNextPage method and isET1 flag in ViewerComponent
       which is defined in @pearson-incubator/viewer . */
    return (

      <div className={'add'} >
        <div>
          <Header
            locale={this.props.locale}
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
            curbookID={this.props.params.bookId}
            isET1="Y"
            disableBackgroundColor="true"
            serverDetails={this.props.bookshelf.serverDetails}
            drawerOpen={this.state.drawerOpen}
            indexId={{ searchUrl }}
            userid={this.props.book.userInfo.userid}
            messages={messages}
            viewerContentCallBack={this.viewerContentCallBack}
          />

          <div className="eT1viewerContent">
            {this.state.isFirstPageBeingLoad !== true ? <ViewerComponent
              locale={this.props.locale}
              data={this.state.data} pages={this.props.book.viewer.pages} goToPageCallback={this.goToPage}
              getPrevNextPage={this.getPrevNextPage} isET1="Y"
            /> : null}
          </div>
        </div>
        <div>
        {this.state.regionData ? <div id="hotspot" className='hotspotContent'>{this.renderHotspot(this.state.regionData)}</div> : null }
          <div id="main">
            <div id="mainContainer" className="pdf-fwr-pc-main">
              <div id="right" className="pdf-fwr-pc-right">
                <div id="toolbar" className="pdf-fwr-toolbar" />
                <div id="frame" className={viewerClassName} onClick={this.onPageClick}>
                  <div id="docViewer" className="docViewer" />
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
  locale: React.PropTypes.string,
  fetchTocAndViewer: React.PropTypes.func,
  addBookmarkUsingReaderApi: React.PropTypes.func,
  removeBookmarkUsingReaderApi: React.PropTypes.func,
  fetchBookmarksUsingReaderApi: React.PropTypes.func,
  fetchHighlightUsingReaderApi: React.PropTypes.func,
  saveHighlightUsingReaderApi: React.PropTypes.func,
  removeHighlightUsingReaderApi: React.PropTypes.func,
  editHighlightUsingReaderApi: React.PropTypes.func,
  PdfbookMessages: React.PropTypes.object,
  fetchPageInfo: React.PropTypes.func,
  loadAssertUrl: React.PropTypes.func,
  book: React.PropTypes.object,
  bookshelf: React.PropTypes.object,
  params: React.PropTypes.object
};

PdfBookReader.contextTypes = {
  store: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired
};

export default PdfBookReader;
