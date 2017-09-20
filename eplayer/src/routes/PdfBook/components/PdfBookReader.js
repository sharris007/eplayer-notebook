/* global sessionStorage, __pdfInstance, pdfAnnotatorInstance, localStorage */
import React, { Component } from 'react'; /* Importing the react and component from react library. */
import { ViewerComponent } from '@pearson-incubator/viewer';/* Injecting the viewer component from @pearson-incubator. */
import find from 'lodash/find';/* lodash is a JavaScript utility library delivering modularity, performance and find is method used for searching. */
import { browserHistory } from 'react-router'; /* Import the react-router for routing the react component. */
import CircularProgress from 'material-ui/CircularProgress'; /* Import the CircularProgress for adding the progressBar. */
import RefreshIndicator from 'material-ui/RefreshIndicator';
import _ from 'lodash'; /* lodash is a JavaScript utility library delivering modularity and performance. */
import WidgetManager from '../../../components/widget-integration/widgetManager';/* */
import Header from '../../../components/Header';/* Importing header for padfPage. */
import './PdfBook.scss';/* Importing the css for PdfBook. */
import { languages } from '../../../../locale_config/translations/index';
import { eT1Contants } from '../../../components/common/et1constants';
import { AudioPlayer,VideoPlayerPreview,ImageViewerPreview} from '@pearson-incubator/aquila-js-media';
import { ExternalLink } from '@pearson-incubator/aquila-js-basics';
import { loadState } from '../../../localStorage';
import Popup from 'react-popup';
import { PopUpInfo } from '../../../components/GlossaryPopup/PopUpInfo';
import {convertHexToRgba} from '../../../components/Utility/Util';

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
      executed: false,
      popUpCollection : [],
      currZoomLevel: 1
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
      title = this.props.currentbook.title;
      authorName = this.props.currentbook.authorName;
      thumbnail = this.props.currentbook.thumbnail;
      ssoKey = this.props.currentbook.ssoKey;
      serverDetails = this.props.currentbook.serverDetails;
      globalbookid = this.props.book.bookinfo.book.globalbookid;

    /* Method for getting the toc details for particular book. */
    this.props.fetchTocAndViewer(this.props.location.query.bookid, authorName, title, thumbnail,
      this.props.book.bookinfo.book.bookeditionid, ssoKey, serverDetails,
      this.props.book.bookinfo.book.hastocflatten, this.props.book.bookinfo.book.roleTypeID);
    let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = -1;
    }
    /* Method for getting the bookmarks details which is already in book. */
    this.props.fetchBookmarksUsingReaderApi(this.props.location.query.bookid, false, courseId,
      this.props.book.userInfo.userid, this.props.PdfbookMessages.PageMsg);
    this.props.fetchHighlightUsingReaderApi(this.props.book.userInfo.userid,
      this.props.location.query.bookid, true, courseId, authorName);
    this.props.fetchBasepaths(this.props.location.query.bookid,ssoKey,this.props.book.userInfo.userid,serverDetails,this.props.book.bookinfo.book.roleTypeID);

    if ((this.props.currentbook.scenario == 1 || this.props.currentbook.scenario == 3
            || this.props.currentbook.scenario == 11)
     && this.props.currentbook.pageNoTolaunch)
    {
      this.goToPageNumber(this.props.currentbook.pageNoTolaunch);
    }
    else if (this.props.currentbook.scenario == 6 || this.props.currentbook.scenario == 88)
    {
      this.props.fetchPagebyPageNumber(this.props.book.userInfo.userid,
        this.props.book.bookinfo.book.roleTypeID,
        this.props.location.query.bookid,
        this.props.book.bookinfo.book.bookeditionid,
        this.props.currentbook.endpage,
        ssoKey,serverDetails);
      this.goToPageNumber(this.props.currentbook.startpage);
    }
    else if (localStorage.getItem('isReloaded') && localStorage.getItem('currentPageOrder')) {
      this.goToPage(Number(localStorage.getItem('currentPageOrder')));
    } else {
      //this.goToPage(coverPage);
      this.loadCoverPage('cover');
    }
  }
  /* componentWillUnmount() is invoked immediately before a component is going to unmount. */
   componentWillUnmount(){
    localStorage.removeItem('isReloaded');
    localStorage.removeItem('currentPageOrder');
    localStorage.removeItem('pages');
    localStorage.removeItem('assertUrls');
    pages = null;
    assertUrls = null;
  }
  /*  Method to load the cover page */
   loadCoverPage = (pageIndexToLoad) => {
    let currentPageIndex = 0;
    if(isNaN(pageIndexToLoad)){
     this.goToPage(pageIndexToLoad); 
    }
    const config = {
    // host: "https://foxit-sandbox.gls.pearson-intl.com/foxit-webpdf-web/pc/",
      host: eT1Contants.FOXIT_HOST_URL,
    // PDFassetURL: this.props.bookshelf.uPdf,
    // PDFassetURL: "http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM31206032/ipadpdfs/"+pdfPath,
      PDFassetURL: `${serverDetails}/ebookassets`
                + `/ebook${this.props.book.bookinfo.book.globalbookid}${this.props.book.bookinfo.book.pdfCoverArt}`,
      encpwd: null,
      zip: false,
      callbackOnPageChange: this.pdfBookCallback,
      assertUrl: ''
    };
     __pdfInstance.createPDFViewer(config);
    this.setState({ currPageIndex: currentPageIndex });
    localStorage.setItem("currentPageOrder",currentPageIndex);
    localStorage.setItem('isReloaded',true);
    const data = this.state.data;
    data.isFirstPage = true;
    data.isLastPage = false;
    data.currentPageNo = currentPageIndex;
    this.setState({data});
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
    if(this.props.book.bookFeatures.hashighlightingtoolbutton)
    {
      __pdfInstance.registerEvent('textSelected', this.createHighlight.bind(this));
      __pdfInstance.registerEvent('highlightClicked', this.handleHighlightClick.bind(this));
    }
    __pdfInstance.registerEvent('regionClicked', this.handleRegionClick.bind(this));
    __pdfInstance.registerEvent('RegionHovered', this.handleTransparentRegionHover.bind(this));
    __pdfInstance.registerEvent('RegionUnhovered', this.handleTransparentRegionUnhover.bind(this));
    __pdfInstance.createPDFViewer(config);
    this.setState({ currPageIndex: currentPageIndex });
    localStorage.setItem("currentPageOrder",currentPageIndex);
    const data = this.state.data;
    var startpage = find(pages,page => page.pagenumber == this.props.currentbook.startpage);
    var endpage = find(pages,page => page.pagenumber == this.props.currentbook.endpage);
    if (currentPageIndex === 1 || (startpage != undefined && startpage.pageorder == currentPageIndex)) {
      data.isFirstPage = true;
    } else {
      data.isFirstPage = false;
    }
    if (currentPageIndex === this.getPageCount() || (endpage != undefined && endpage.pageorder == currentPageIndex)) {
      data.isLastPage = true;
    } else {
      data.isLastPage = false;
    }
    if(this.props.currentbook.scenario != 6 && this.props.currentbook.scenario != 88)
    {
      data.isFirstPage = false;
    }
    data.currentPageNo = currentPageIndex;
    this.setState({ data });
    const viewer = this;
    $(document).on('keyup',function(evt) {
      if (evt.keyCode === 27 && $('#hotspot'))
      {
        try{
          Popup.close();
        }
        catch(e){
        }
        viewer.setState({regionData : null});
      }
    });
  }
  pdfBookCallback = (pdfEvent) => {
     // this.setState({currPageIndex : currentPageIndex});
    if (pdfEvent === 'pageChanged') {
      localStorage.setItem('currentPageOrder', this.state.currPageIndex);
      __pdfInstance.setCurrentZoomLevel(this.state.currZoomLevel);
      this.props.fetchRegionsInfo(this.props.location.query.bookid,this.props.book.bookinfo.book.bookeditionid,this.state.currPageIndex,ssoKey,this.props.book.bookinfo.book.roleTypeID,serverDetails).then(() => {
        if(this.props.book.regions.length > 0 )
        {
          __pdfInstance.displayRegions(this.props.book.regions,this.props.book.bookFeatures);
          var regionsData = [];
          var glossaryEntryIDsToFetch = '';
          for(var arr=0;arr < this.props.book.regions.length ; arr++)
          {
            if(this.props.book.regions[arr].regionTypeID == 5 && this.props.book.regions[arr].glossaryEntryID !== null)
            {       
              glossaryEntryIDsToFetch = glossaryEntryIDsToFetch + "," + this.props.book.regions[arr].glossaryEntryID;
              regionsData.push(this.props.book.regions[arr]);
            }
          }
          this.props.fetchGlossaryItems(this.props.location.query.bookid,glossaryEntryIDsToFetch,ssoKey,serverDetails).then(() => {
            var glossaryData = [];
            for(var i=0;i<this.props.book.glossaryInfoList.length;i++)
            {
              for(var k=0 ; k < regionsData.length ; k++)
              {
                if((this.props.book.glossaryInfoList[i].glossaryEntryID).trim() == (regionsData[k].glossaryEntryID).trim())
                {
                  var glossTerm = {
                    isET1 : 'Y' ,
                    item : document.getElementById('region' + regionsData[k].regionID),
                    popOverCollection : {
                      popOverDescription : this.props.book.glossaryInfoList[i].glossaryDefinition,
                      popOverTitle : this.props.book.glossaryInfoList[i].glossaryTerm
                    }                
                  };
                  glossaryData.push(glossTerm);                
                }
              }
            }
            this.setState({glossaryRegions : regionsData});
            this.setState({popUpCollection : glossaryData});
          });
        }
      });
      this.setState({ pageLoaded: true });
      this.setState({ executed: false });
      if (this.state.isFirstPageBeingLoad === true) {
        this.setState({ isFirstPageBeingLoad: false });
      }
    }
    if (pdfEvent === 'pageLoaded') {
          // this.loadAssetUrl();
      setTimeout(this.displayHighlight, 1000);
      /*if (this.state.executed === false) {
        const totalPagesToHit = this.getPageOrdersToGetAssertUrl(this.state.currPageIndex);
        this.props.loadAssertUrl(totalPagesToHit, this.openFile, this.storeAssertUrl, pages);
        this.setState({ executed: true });
      }*/
    }
  }
  storeAssertUrl = () => {
    if (assertUrls === undefined || assertUrls === null) {
      assertUrls = this.props.book.bookinfo.assertUrls;
      localStorage.setItem('assertUrls', JSON.stringify(assertUrls));
    } else if (assertUrls.length > this.props.book.bookinfo.assertUrls.length) {
      assertUrls = assertUrls.concat(this.props.book.bookinfo.assertUrls);
      localStorage.setItem('assertUrls', JSON.stringify(assertUrls));
    } else {
      assertUrls = this.props.book.bookinfo.assertUrls;
      localStorage.setItem('assertUrls', JSON.stringify(assertUrls));
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

  goToPage = (pageno) => {
    try
    {
      Popup.close();
    }
    catch(e){
    }
    const currPageIndex = this.state.currPageIndex;
    // If we are navigating to current page then do nothing
    if (pageno !== currPageIndex)
    {
      var startpage = find(pages,page => page.pagenumber == this.props.currentbook.startpage);
      var endpage = find(pages,page => page.pagenumber == this.props.currentbook.endpage);
      // pageIndexToLoad initialized with 1 to avoid loading invalid pages
      let pageIndexToLoad = 1;
      // pageno can be page navigation type like 'prev','next' or exact page order to navigate
      if(isNaN(pageno))
      {
        if (pageno === 'prev') {
          if(currPageIndex === 1){
            pageIndexToLoad = 0;
          }else{
            pageIndexToLoad = currPageIndex - 1;
          }
        } else if (pageno === 'next') {
          pageIndexToLoad = currPageIndex + 1;
        } 
      }
      else
      {
        if (pageno >= 0) {
          pageIndexToLoad = pageno;
        }
      }
      if (startpage != undefined && endpage != undefined &&
                  (startpage.pageorder > pageIndexToLoad || endpage.pageorder < pageIndexToLoad))
      {
        this.setState({ drawerOpen: false });
        return; 
      }
      __pdfInstance.removeExistingHighlightCornerImages();
      this.setState({ drawerOpen: false });
      this.setState({ pageLoaded: false });
      this.setState({ regionData: null});
      this.setState({ popUpCollection: []});
      const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageIndexToLoad);
      this.setState({ totalPagesToHit });
      if (totalPagesToHit !== undefined || totalPagesToHit !== '' || totalPagesToHit !== null) {
        this.props.fetchPageInfo(this.props.book.userInfo.userid,
        this.props.location.query.bookid,
        this.props.book.bookinfo.book.bookeditionid,
        pageIndexToLoad,
        totalPagesToHit,
        ssoKey,
        serverDetails, this.props.book.bookinfo.book.roleTypeID
        ).then(() => {
          if (this.props.book.bookinfo.pages !== undefined || this.props.book.bookinfo.pages !== null
            || this.props.book.bookinfo.pages.length !== 0) {
            pages = this.props.book.bookinfo.pages;
            localStorage.setItem('pages', JSON.stringify(pages));
          }
          if(pageno != 'cover' && pageIndexToLoad !== 0) 
          {this.loadPdfPage(pageIndexToLoad);}
          else if(pageIndexToLoad === 0){
          this.loadCoverPage(pageIndexToLoad);
         }
        });
      }
    }
    else
    {
      this.setState({ drawerOpen: false });
    }
  }
/* Method for loading the page after passing the pagenumber. */
 /* goToPageCallback = (pageNum) => {
    __pdfInstance.removeExistingHighlightCornerImages();
    this.setState({ drawerOpen: false });
    this.setState({ pageLoaded: false });
    this.setState({ popUpCollection: []});
    if (pageNum > 0) {
      const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageNum);
      this.setState({ totalPagesToHit });
      if (totalPagesToHit !== '') {
        this.props.fetchPageInfo(this.props.book.userInfo.userid,
        this.props.location.query.bookid,
        this.props.book.bookinfo.book.bookeditionid,
        pageNum,
        totalPagesToHit,
        ssoKey,
        serverDetails, this.props.book.bookinfo.book.roleTypeID
      ).then(() => {
        if (pages === undefined || pages === null) {
          pages = this.props.book.bookinfo.pages;
          localStorage.setItem('pages', JSON.stringify(pages));
        } else {
          pages = pages.concat(this.props.book.bookinfo.pages);
          localStorage.setItem('pages', JSON.stringify(pages));
        }
        this.loadPdfPage(pageNum);
      });
     }
    }
  }*/

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
    const pagecount = this.props.book.bookinfo.book.numberOfPages;
    return pagecount;
  }

 /* Method for calculating the next and previous pages for the selected book. */
  getPrevNextPage = (pageType) => {
    const currPageNumber = this.state.currPageIndex;
    let pageNo;
    if (pageType === 'prev') {
      if(currPageNumber === 1){
      pageNo = 'Cover';
      return pageNo;
      }else
      {
        pageNo = currPageNumber - 1;
      }
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
    const currentPageId = this.state.currPageIndex;
    const currentPage = find(pages, page => page.pageorder === currentPageId);
    let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = -1;
    }
    this.props.addBookmarkUsingReaderApi(_.toString(this.props.book.userInfo.userid),
      _.toString(this.props.location.query.bookid), _.toString(currentPage.pageid),
      _.toString(currentPage.pagenumber), _.toString(currentPage.pageorder),
      _.toString(courseId), false, this.props.PdfbookMessages.PageMsg);
  }
  /* created removeBookmarkHandler method for removing bookmark for selected Page, after clicking on bookmark button. */
  removeBookmarkHandler = (bookmarkId) => {
    let currentPageId;
    if (bookmarkId !== undefined) {
      currentPageId = bookmarkId;
    } else {
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
    let currZoomLevel = this.state.currZoomLevel;
    if(level == 0){
      currZoomLevel = 0.25;
    }else{
      currZoomLevel = level;
    }
    __pdfInstance.setCurrentZoomLevel(currZoomLevel);
    this.displayHighlight();
    if(this.props.book.regions.length > 0 )
    {
      __pdfInstance.displayRegions(this.props.book.regions,this.props.book.bookFeatures);
    }
    var glossaryDataUpdated = [];
    for(var i=0;i<this.props.book.glossaryInfoList.length;i++)
    {
      for(var k=0 ; k < this.state.glossaryRegions.length ; k++)
      {
        if((this.props.book.glossaryInfoList[i].glossaryEntryID).trim() == (this.state.glossaryRegions[k].glossaryEntryID).trim())
        {
          var glossTerm = {
            isET1 : 'Y' ,
            item : document.getElementById('region' + this.state.glossaryRegions[k].regionID),
            popOverCollection : {
              popOverDescription : this.props.book.glossaryInfoList[i].glossaryDefinition,
              popOverTitle : this.props.book.glossaryInfoList[i].glossaryTerm
            }                
          };
          glossaryDataUpdated.push(glossTerm);                
        }
      }
    }
    if(glossaryDataUpdated.length>0)
    {
      new PopUpInfo({'popUpCollection' : glossaryDataUpdated, 'bookId' : 'docViewer_ViewContainer_PageContainer_0'});
    }
    this.setState({currZoomLevel : currZoomLevel});
  }
/*Method for removing hotspot content on clicking the close button*/
  onHotspotClose() {
    if($('#hotspot').length > 0)
    {
      $('#hotspot').empty();
    }
  }
/* Method for checking if a url is starts with http:// and convert it to https:// */
  createHttps = (uri) => {
  if(/^http:\/\//i.test(uri))
  {
    var link=uri.substring(4);
    uri = 'https' + link ;
  }
  return uri;
}
/*Method to navigate to a particular book page number based on bookPageNumber*/
  goToPageNumber = (pageNo) => {
    var currentPage = find(pages,page => page.pagenumber == pageNo)
    if(currentPage == undefined)
    {
        this.props.fetchPagebyPageNumber(this.props.book.userInfo.userid,
        this.props.book.bookinfo.book.roleTypeID,
        this.props.location.query.bookid,
        this.props.book.bookinfo.book.bookeditionid,
        pageNo,
        ssoKey,serverDetails)
      .then(() => {
          if (pages === undefined) {
            pages = this.props.book.bookinfo.pages;
            localStorage.setItem('pages', JSON.stringify(pages));
            var currentPage = find(pages,page => page.pagenumber == pageNo)
          } else {
            pages = pages.concat(this.props.book.bookinfo.pages);
            localStorage.setItem('pages', JSON.stringify(pages));
            var currentPage = find(pages,page => page.pagenumber == pageNo)
          }
          this.goToPage(Number(currentPage.pageorder));
      });
    }
    else
    {
      this.goToPage(Number(currentPage.pageorder));
    }

  }
/*Method to handle mouse hover event for transparent hotsopts*/
  handleTransparentRegionHover(hotspotID)
  {
    var transparentRegion = document.getElementById(hotspotID);
    if(this.props.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent !== true)
    {
      transparentRegion.style.borderBottomColor = this.props.book.bookFeatures.underlinehotppothovercolor;
    }
    else if(this.props.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent == true)
    {
      transparentRegion.style.borderBottomColor = this.props.book.bookFeatures.underlinehotppothovercolor;;
      transparentRegion.style.borderBottomWidth = this.props.book.bookFeatures.underlinehotspotthickness + 'px';
      transparentRegion.style.borderBottomStyle = 'solid';  
    }
    else
    {
      transparentRegion.style.background = convertHexToRgba(this.props.book.bookFeatures.hotspotcolor,this.props.book.bookFeatures.regionhotspotalpha);
    } 
  }
/*Method to handle mouse out event for transparent hotsopts*/
  handleTransparentRegionUnhover(hotspotID)
  {
    var transparentRegion = document.getElementById(hotspotID);
    if(this.props.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent !== true)
    {
      transparentRegion.style.borderBottomColor = this.props.book.bookFeatures.underlinehotspotcolor;
    }
    else if(this.props.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent == true)
    {
      transparentRegion.style.borderBottomColor = convertHexToRgba(this.props.book.bookFeatures.underlinehotspotcolor,0);
      transparentRegion.style.borderBottomWidth = 0 + 'px';
      transparentRegion.style.borderBottomStyle = 'none';  
    }
    else
    {
      transparentRegion.style.background = convertHexToRgba(this.props.book.bookFeatures.hotspotcolor,0);
    }
  }
/*Method to check hotspot type on the basis of extension*/
  getHotspotType = (regionLink) => {
    var region = '';
    regionLink = regionLink.toLowerCase();
    if(_.endsWith(regionLink,'.doc') == true || _.endsWith(regionLink,'.xls') == true || _.endsWith(regionLink,'.ppt') == true || 
       _.endsWith(regionLink,'.pdf') == true || _.endsWith(regionLink,'.docx') == true || _.endsWith(regionLink,'.xlsx') == true || 
       _.endsWith(regionLink,'.pptx') == true)
    {
      region = 'DOCUMENT';
    }
    else if(_.endsWith(regionLink,'.mp4') == true || _.endsWith(regionLink,'.m4v') == true || _.endsWith(regionLink,'.flv') == true)
    {
      region = 'VIDEO';
    }
    else if(_.endsWith(regionLink,'.mp3') == true)
    {
      region = 'AUDIO';
    }
    else if(_.endsWith(regionLink,'.jpg') == true || _.endsWith(regionLink,'.jpeg') == true || _.endsWith(regionLink,'.png') == true || _.endsWith(regionLink,'.gif') == true)
    {
      region = 'IMAGE';
    }
    else
    {
      region = 'URL';
    }
    return region;
  }
  /*Method to render the clicked region component.*/
  renderHotspot = (hotspotDetails) => {
    var regionComponent = " ";
    var hotspotData,source;
    switch(hotspotDetails.hotspotType) {
      case 'AUDIO':
                  source=hotspotDetails.linkValue;
                  hotspotData = {
                    audioSrc :source,
                    audioTitle :hotspotDetails.name
                  };
                  regionComponent = <AudioPlayer url={hotspotData.audioSrc} title={hotspotData.audioTitle} />;
                  break;
      case 'PAGENUMBER':
                 this.goToPageNumber(hotspotDetails.linkValue);
                 break;
      case 'EMAIL':
                var email = "mailto:" + hotspotDetails.linkValue
                var iframe = document.createElement("iframe");
                iframe.src = email;
                iframe.style = "display:none;";
                document.body.appendChild(iframe);
                setTimeout(function(){
                  document.body.removeChild(iframe);
                }, 1000); 
               break;
      case 'IMAGE':
               source=hotspotDetails.linkValue;
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
      case 'VIDEO':
               source=hotspotDetails.linkValue;
               hotspotData = {
                title : hotspotDetails.name,
                src : source,
                caption : hotspotDetails.description,
                id : hotspotDetails.regionID,
                thumbnail : {
                  src : null,
               },
               alt : hotspotDetails.name,
               };
               regionComponent = <VideoPlayerPreview data={hotspotData} onClose={(this.onHotspotClose)}/>;
               break;
      case 'DOCUMENT':
               source=hotspotDetails.linkValue;
               window.open(source,"_blank");
               break;
      case 'URL':
               source=hotspotDetails.linkValue;
               hotspotData = {
                 title : hotspotDetails.name,
                 src : source
               };
               regionComponent = <ExternalLink title={hotspotData.title} src={hotspotData.src} onClose={(this.onHotspotClose)} />;
               break;
      case 'LTILINK':
               if (this.props.book.bookinfo.book.activeCourseID === undefined || this.props.book.bookinfo.book.activeCourseID === '' || this.props.book.bookinfo.book.activeCourseID === null)
               {
                var courseId = -1;
               }
               else
               {
                var courseId = this.props.book.bookinfo.book.activeCourseID;
               }
               /*Framing Complete LTI URl*/
               var link = serverDetails + 'ebook/toolLaunch.do?json=' + hotspotDetails.linkValue + '&contextid' + courseId + '&role' + this.props.book.bookinfo.book.roleTypeID + '&userlogin' + this.props.book.userInfo.userid ;
               /*Converting URL into https*/
               var ltiUrl = this.createHttps(link);
               window.open(ltiUrl,"_blank");
               break;
      default :regionComponent = null;
               break;
    };
    return regionComponent;
  }
/*Method to handle the action to be performed when a region is clicked.*/
handleRegionClick(hotspotID) {
  var regionDetails,basepath;
    if(this.state.regionData)
    {
      this.setState({regionData : null});
      this.onHotspotClose();
    }
    if(this.props.book.regions.length > 0 )
    {
      for(var i=0; i < this.props.book.regions.length ; i++)
      {
          if(hotspotID == ('region' + this.props.book.regions[i].regionID))
          {
            regionDetails = this.props.book.regions[i];
            regionDetails.hotspotType = '';
            if(regionDetails.linkTypeID !== eT1Contants.LinkType.PAGE_NUMBER || regionDetails.linkTypeID !== eT1Contants.LinkType.EMAIL 
              || regionDetails.linkTypeID !== eT1Contants.LinkType.LTILINK)
            {
              regionDetails.linkValue = this.createHttps(regionDetails.linkValue);
            }
            if(regionDetails.linkTypeID == eT1Contants.LinkType.IMAGE)
            {
              regionDetails.hotspotType = 'IMAGE';
              if(this.props.book.basepaths.imagepath !== null && this.props.book.basepaths.imagepath !== "" && this.props.book.basepaths.imagepath !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.imagepath);
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.FLV)
            {
              regionDetails.hotspotType = 'VIDEO';
              if(this.props.book.basepaths.flvpath !== null && this.props.book.basepaths.flvpath !== "" && this.props.book.basepaths.flvpath !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.flvpath);
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.MP3 || regionDetails.linkTypeID == eT1Contants.LinkType.FACELESSAUDIO)
            {
              regionDetails.hotspotType = 'AUDIO';
              if(this.props.book.basepaths.mp3path !== null && this.props.book.basepaths.mp3path !== "" && this.props.book.basepaths.mp3path !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.mp3path);
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.PAGE_NUMBER)
            {
              regionDetails.hotspotType = 'PAGENUMBER';
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.EMAIL)
            {
              regionDetails.hotspotType = 'EMAIL';
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.LTILINK)
            {
              regionDetails.hotspotType = 'LTILINK';
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.H264)
            {
              regionDetails.hotspotType = 'VIDEO';
              if(this.props.book.basepaths.h264path !== null && this.props.book.basepaths.h264path !== "" && this.props.book.basepaths.h264path !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.h264path);
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.URL)
            {
              if(regionDetails.regionTypeID == eT1Contants.RegionType.AUDIO)
              {
                regionDetails.hotspotType = 'AUDIO';
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.IMAGE)
              {
                regionDetails.hotspotType = 'IMAGE';
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.MEDIA || regionDetails.regionTypeID == eT1Contants.RegionType.URL)
              {
                regionDetails.hotspotType = this.getHotspotType(regionDetails.linkValue);
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.PDF || regionDetails.regionTypeID == eT1Contants.RegionType.WORD_DOC || 
                regionDetails.regionTypeID == eT1Contants.RegionType.EXCEL || regionDetails.regionTypeID == eT1Contants.RegionType.POWERPOINT)
              {
                regionDetails.hotspotType = 'DOCUMENT';
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.VIDEO)
              {
                regionDetails.hotspotType = 'VIDEO';
              }              
              if(this.props.book.basepaths.urlpath !== null && this.props.book.basepaths.urlpath !== "" && this.props.book.basepaths.urlpath !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.urlpath);
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.VIRTUAL_LEARNING_ASSET)
            {
              if(regionDetails.regionTypeID == eT1Contants.RegionType.AUDIO)
              {
                regionDetails.hotspotType = 'AUDIO';
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.IMAGE)
              {
                regionDetails.hotspotType = 'IMAGE';
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.MEDIA || regionDetails.regionTypeID == eT1Contants.RegionType.URL)
              {
                regionDetails.hotspotType = this.getHotspotType(regionDetails.linkValue);
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.PDF || regionDetails.regionTypeID == eT1Contants.RegionType.WORD_DOC || 
                regionDetails.regionTypeID == eT1Contants.RegionType.EXCEL || regionDetails.regionTypeID == eT1Contants.RegionType.POWERPOINT)
              {
                regionDetails.hotspotType = 'DOCUMENT';
              }
              if(regionDetails.regionTypeID == eT1Contants.RegionType.VIDEO)
              {
                regionDetails.hotspotType = 'VIDEO';
              }              
              if(this.props.book.basepaths.virtuallearningassetpath !== null && this.props.book.basepaths.virtuallearningassetpath !== "" && this.props.book.basepaths.virtuallearningassetpath !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.virtuallearningassetpath);
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.CHROMELESS_URL)
            {
              regionDetails.hotspotType = this.getHotspotType(regionDetails.linkValue);  
              if(this.props.book.basepaths.chromelessurlpath !== null && this.props.book.basepaths.chromelessurlpath !== "" && this.props.book.basepaths.chromelessurlpath !== undefined)
              {
                basepath = this.createHttps(this.props.book.basepaths.chromelessurlpath);
              }
            }
            if(regionDetails.hotspotType !== 'PAGENUMBER' || regionDetails.hotspotType !== 'EMAIL' || regionDetails.hotspotType !== 'LTILINK')
            {
              if(!(_.startsWith(regionDetails.linkValue,"http")) && !(_.startsWith(regionDetails.linkValue,"https")))
                {
                  if(basepath !== undefined)
                  {
                    regionDetails.linkValue = basepath + regionDetails.linkValue;
                  }
                } 
            }
            /*Checking if the clicked region is tocLink,indexLink,crossrefernce,ltiLink,word,powerpoint,excel or pdfdocument */
            if(regionDetails.hotspotType == 'IMAGE' || regionDetails.hotspotType == 'VIDEO' || regionDetails.hotspotType == 'AUDIO' || regionDetails.hotspotType == 'URL')
            {
              /*Updating the state to rerender the page with Aquila JS Component*/
              this.setState({regionData : regionDetails});
            }
            else
            {
              this.renderHotspot(regionDetails);              
            }
            break;
          }
      }    
    }    
  }
 /* Method for creating highLight for selected area by user. */
  createHighlight(highlightData) {
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
        (languages.translations[this.props.locale]), this.props.book.bookinfo.book.roleTypeID, this.props.book.bookinfo.book.activeCourseID);
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
      _.toString(this.props.location.query.bookid), _.toString(currentPage.pageid),
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
      hId = highLightClickedData.highlightId;
      cornerFoldedImageTop = highLightClickedData.cornerFoldedImageTop;
    }
    var highlightClicked = find(this.state.highlightList, highlight => highlight.id === hId);
    if (highlightClicked.shared === true)
    {
      highlightClicked = find(this.props.book.annTotalData, highlight => highlight.id === hId);
    }
    highlightClicked.color = highlightClicked.originalColor;
    pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,
      this.editHighlight.bind(this), this.deleteHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_0',
      (languages.translations[this.props.locale]), this.props.book.bookinfo.book.roleTypeID,cornerFoldedImageTop, this.props.book.bookinfo.book.activeCourseID);
  }

  /* Method for displaying the Highlight already stored. */
  displayHighlight = () => {
    const currentPageId = this.state.currPageIndex;
    const highlightList = [];
    this.props.book.annTotalData.forEach((annotation) => {
      if (annotation.pageId === currentPageId) {
        if(annotation.shared){
          annotation.color = '#00a4e0';
          annotation.meta.colorcode = '#00a4e0';
        }
        else{
          annotation.color = annotation.originalColor;
          annotation.meta.colorcode = annotation.originalColor;
        }
        if (_.toString(annotation.meta.roletypeid) === _.toString(this.props.book.bookinfo.book.roleTypeID)) {
          highlightList.push(annotation);
        } else if (this.props.book.bookinfo.book.roleTypeID == 2
          && annotation.meta.roletypeid == 3 && annotation.shared) {
          highlightList.push(annotation);
        }
      }
    });
    __pdfInstance.restoreHighlights(highlightList, this.deleteHighlight);
    __pdfInstance.reRenderHighlightCornerImages(highlightList);
    this.setState({ highlightList });
  }
  /* Method for delete Highlight via passing the id of selected area. */
  deleteHighlight = (id) => {
    __pdfInstance.removeHighlightElement(id);
    this.props.removeHighlightUsingReaderApi(id).then(() => {
      this.displayHighlight();
    });
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
    callbacks.goToPageCallback = this.goToPage;
    // const drawerOpen = true;
    let viewerClassName;
    if (this.state.pageLoaded !== true) {
      viewerClassName = 'hideViewerContent';
    } else {
      viewerClassName = '';
    }
    const searchUrl = `${serverDetails}/ebook/ipad/searchbookv2?bookid=${this.props.location.query.bookid}`
        + `&globalbookid=${globalbookid}&searchtext=searchText&sortby=1&version=${this.props.book.bookinfo.book.version}&authkey=${ssoKey}`;
    this.props.book.annTotalData.forEach((annotation) => {
      if(annotation.shared){
          annotation.color = 'Instructor';
        }
        else{
          annotation.color = annotation.originalColor;
        }
      });
    if (this.props.book.toc.fetched && this.props.book.toc.content !== undefined
              && this.props.book.toc.content.list !== undefined && this.props.book.toc.content.list.length !== 0)
    {
      this.props.book.tocReceived = true;
    }
    else
    {
      this.props.book.tocReceived = false;
    }
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
            goToPage={this.goToPage}
            bookId={this.props.location.query.bookid}
            globalBookId={this.props.currentbook.globalBookId}
            ssoKey={this.props.currentbook.ssoKey}
            title={this.props.currentbook.title}
            curbookID={this.props.location.query.bookid}
            isET1="Y"
            disableBackgroundColor="true"
            serverDetails={this.props.currentbook.serverDetails}
            drawerOpen={this.state.drawerOpen}
            indexId={{ searchUrl }}
            userid={this.props.book.userInfo.userid}
            messages={messages}
            viewerContentCallBack={this.viewerContentCallBack}
            currentPageIndex={this.state.currPageIndex}
            currentScenario = {this.props.currentbook.scenario}
            globaluserid = {this.props.currentbook.globaluserid}
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
                  <div id="docViewer" className="docViewer" >
                    {this.state.popUpCollection.length ? <PopUpInfo bookId='docViewer_ViewContainer_PageContainer_0' popUpCollection={this.state.popUpCollection} /> : null }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.pageLoaded !== true ?
          <div className="centerCircularBar">
          <RefreshIndicator size={50} left={650} top={200} status="loading" />
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
