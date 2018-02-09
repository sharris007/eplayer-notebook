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
import { resources, domain } from '../../../../const/Settings';
import { AudioPlayer,VideoPlayerPreview,ImageViewerPreview} from '@pearson-incubator/aquila-js-media';
import { ExternalLink } from '@pearson-incubator/aquila-js-basics';
import { loadState } from '../../../localStorage';
import Popup from 'react-popup';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import {convertHexToRgba} from '../../../components/Utility/Util';
import { LearningContextProvider } from '@pearson-incubator/vega-viewer';
import { PdfViewer } from '@pearson-incubator/vega-viewer';

const envType = domain.getEnvType();
const foxiturl = eT1Contants.FoxitUrls[envType];
const foxitCdnUrl = eT1Contants.foxitCDNUrl[envType];
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
      classname: 'eT1headerBar',
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
      currZoomLevel: 1,
      showHighlight: true,
      showHotspot: true
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
      globalbookid = this.props.data.book.bookinfo.book.globalbookid;

    /* Method for getting the toc details for particular book. */
    this.props.data.actions.fetchTocAndViewer(this.props.data.location.query.bookid, authorName, title, thumbnail,
      this.props.data.book.bookinfo.book.bookeditionid, ssoKey, serverDetails,
      this.props.data.book.bookinfo.book.hastocflatten, this.props.data.book.bookinfo.book.roleTypeID);
    let courseId = _.toString(this.props.data.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = -1;
    }
    /* Method for getting the bookmarks details which is already in book. */
    this.props.data.actions.fetchBookmarksUsingSpectrumApi(this.props.data.location.query.bookid,
      this.props.data.book.userInfo.userid, this.props.PdfbookMessages.PageMsg, this.props.data.book.bookinfo.book.roleTypeID, courseId, this.getpiSessionKey());
    this.props.data.actions.fetchHighlightUsingSpectrumApi(this.props.data.location.query.bookid,courseId,this.props.data.book.userInfo.userid,this.props.data.book.bookinfo.book.roleTypeID,this.getpiSessionKey());
    this.props.data.actions.fetchBasepaths(this.props.data.location.query.bookid,ssoKey,this.props.data.book.userInfo.userid,serverDetails,this.props.data.book.bookinfo.book.roleTypeID);

    if ((this.props.currentbook.scenario == 1 || this.props.currentbook.scenario == 3
            || this.props.currentbook.scenario == 11)
     && this.props.currentbook.pageNoTolaunch)
    {
      this.goToPageNumber(this.props.currentbook.pageNoTolaunch);
    }
    else if (this.props.currentbook.scenario == 6 || this.props.currentbook.scenario == 88)
    {
      this.props.data.actions.fetchPagebyPageNumber(this.props.data.book.userInfo.userid,
        this.props.data.book.bookinfo.book.roleTypeID,
        this.props.data.location.query.bookid,
        this.props.data.book.bookinfo.book.bookeditionid,
        this.props.currentbook.endpage,
        ssoKey,serverDetails);
      this.goToPageNumber(this.props.currentbook.startpage);
    }
    else if (sessionStorage.getItem('isReloaded') && sessionStorage.getItem('currentPageOrder')) {
      this.goToPage(Number(sessionStorage.getItem('currentPageOrder')));
    } else {
      this.loadCoverPage('cover');
    }
    window.reactContext = this;
    $(window).resize(function(){
      __pdfInstance.onDocviewerResize();
          window.reactContext.displayHighlight();
          if(window.reactContext.props.data.book.regions.length > 0 )
          {
          __pdfInstance.displayRegions(window.reactContext.props.data.book.regions,window.reactContext.props.data.book.bookFeatures,_);
          }
          if(window.reactContext.state.showHotspot !== true)
          {
            try
            {
              $(".hotspot").hide();
              $(".hotspotIcon").hide();
              window.reactContext.setState({showHotspot:false});
            }
            catch(e){}
          }
          window.reactContext.updateGlossary();
      })
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.data != this.props.data){
      window.reactContext = this;
    }
  }
  /* componentWillUnmount() is invoked immediately before a component is going to unmount. */
   componentWillUnmount(){
    sessionStorage.removeItem('isReloaded');
    sessionStorage.removeItem('currentPageOrder');
    localStorage.removeItem('pages');
    pages = null;
    assertUrls = null;
  }
  /*  Method to load the cover page */
   loadCoverPage = (pageIndexToLoad) => {
    let currentPageIndex = 0;
    if(isNaN(pageIndexToLoad)){
     this.goToPage(pageIndexToLoad);
    }
    const PDFassetURL = `${serverDetails}/ebookassets`
                + `/ebook${this.props.data.book.bookinfo.book.globalbookid}${this.props.data.book.bookinfo.book.pdfCoverArt}`;
    this.props.data.actions.loadcurrentPage(this.props.data.location.query.bookid,currentPageIndex,PDFassetURL,'CoverPage');
    this.setState({ currPageIndex: currentPageIndex });
    sessionStorage.setItem("currentPageOrder",currentPageIndex);
    sessionStorage.setItem('isReloaded',true);
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
    const PDFassetURL = `${serverDetails}/ebookassets`
                + `/ebook${this.props.data.book.bookinfo.book.globalbookid}/ipadpdfs/${pdfPath}`;
    let foxitAssetURL;
    if(currentPage.readerPlusID){
      foxitAssetURL = eT1Contants.foxiAssetBaseUrl + currentPage.readerPlusID + '/foxit-assets';
    }else{
      foxitAssetURL = false;
    }
    this.props.data.actions.loadcurrentPage(this.props.data.location.query.bookid,currentPageIndex,PDFassetURL,'BookPage',foxitAssetURL);
    this.setState({ currPageIndex: currentPageIndex });
    sessionStorage.setItem("currentPageOrder",currentPageIndex);
    const data = this.state.data;
    let startpage = find(pages,page => page.pagenumber == this.props.currentbook.startpage);
    let endpage = find(pages,page => page.pagenumber == this.props.currentbook.endpage);
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
          $('#player-iframesppModalBody').remove();
          $('#sppModal').css('display','none');
        }
        catch(e){
        }
        viewer.setState({regionData : null});
      }
    });
  }
  pdfBookCallback = (pdfEvent) => {
    if (pdfEvent === 'pageChanged') {
      sessionStorage.setItem('currentPageOrder', this.state.currPageIndex);
      this.setState({ executed: false });
    }
    if (pdfEvent === 'pageLoaded') {
      this.setState({ pageLoaded: true });
       if (this.state.isFirstPageBeingLoad === true) {
        this.setState({ isFirstPageBeingLoad: false });
      }
      __pdfInstance.setCurrentZoomLevel(this.state.currZoomLevel);
      this.props.data.actions.fetchRegionsInfo(this.props.data.location.query.bookid,this.props.data.book.bookinfo.book.bookeditionid,this.state.currPageIndex,ssoKey,this.props.data.book.bookinfo.book.roleTypeID,serverDetails,this.props.currentbook.scenario,this.props.currentbook.platform).then(() => {
        if(this.props.data.book.regions.length > 0 )
        {
          __pdfInstance.displayRegions(this.props.data.book.regions,this.props.data.book.bookFeatures,_);
          if(this.state.showHotspot !== true)
          {
            try
            {
              $(".hotspot").hide();
              $(".hotspotIcon").hide();
              this.setState({showHotspot:false});
            }
            catch(e){}
          }
          let regionsData = [];
          let glossaryEntryIDsToFetch = '';
          for(let arr=0;arr < this.props.data.book.regions.length ; arr++)
          {
            if(this.props.data.book.regions[arr].regionTypeID == 5 && this.props.data.book.regions[arr].glossaryEntryID !== null)
            {
              glossaryEntryIDsToFetch = glossaryEntryIDsToFetch + "," + this.props.data.book.regions[arr].glossaryEntryID;
              regionsData.push(this.props.data.book.regions[arr]);
            }
          }
          this.props.data.actions.fetchGlossaryItems(this.props.data.location.query.bookid,glossaryEntryIDsToFetch,ssoKey,serverDetails).then(() => {
            let glossaryData = [];
            for(let i=0;i<this.props.data.book.glossaryInfoList.length;i++)
            {
              for(let k=0 ; k < regionsData.length ; k++)
              {
                if((this.props.data.book.glossaryInfoList[i].glossaryEntryID).trim() == (regionsData[k].glossaryEntryID).trim())
                {
                  let glossTerm = {
                    isET1 : 'Y' ,
                    item : document.getElementById('region' + regionsData[k].regionID),
                    popOverCollection : {
                      popOverDescription : this.props.data.book.glossaryInfoList[i].glossaryDefinition,
                      popOverTitle : this.props.data.book.glossaryInfoList[i].glossaryTerm
                    }
                  };
                  glossaryData.push(glossTerm);
                }
              }
            }
          this.setState({glossaryRegions : regionsData, popUpCollection : glossaryData});
          });
        }
      });
      setTimeout(this.displayHighlight, 1000);
    }
  }

  goToPage = (pageno) => {
    try
    {
      Popup.close();
      $("#printFrame").remove();
    }
    catch(e){}
    const currPageIndex = this.state.currPageIndex;
    // If we are navigating to current page then do nothing
    if (pageno !== currPageIndex)
    {
      try{
        $(".fwr-highlight-annot").hide();
      }
      catch(e){}
      let startpage = find(pages,page => page.pagenumber == this.props.currentbook.startpage);
      let endpage = find(pages,page => page.pagenumber == this.props.currentbook.endpage);
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
      this.setState({ drawerOpen: false,pageLoaded: false,regionData: null,
        popUpCollection: [],highlightList: []});
        try
        {
          $('#player-iframesppModalBody').remove();
          $('#sppModal').css('display','none');
        }
        catch(e){}
      const totalPagesToHit = this.getPageOrdersToGetPageDetails(pageIndexToLoad);
      this.setState({ totalPagesToHit });
      if (totalPagesToHit !== undefined || totalPagesToHit !== '' || totalPagesToHit !== null) {
        this.props.data.actions.fetchPageInfo(this.props.data.book.userInfo.userid,
        this.props.data.location.query.bookid,
        this.props.data.book.bookinfo.book.bookeditionid,
        pageIndexToLoad,
        totalPagesToHit,
        ssoKey,
        serverDetails, this.props.data.book.bookinfo.book.roleTypeID
        ).then(() => {
          if (this.props.data.book.bookinfo.pages !== undefined || this.props.data.book.bookinfo.pages !== null
            || this.props.data.book.bookinfo.pages.length !== 0) {
            pages = this.props.data.book.bookinfo.pages;
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

  findPages = (lPages, pageOrder) => find(lPages, page => page.pageorder === pageOrder)
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

  /* Method for getting the page count and defined a letiable inside method that will store the value of numberOfPages. */
  getPageCount = () => {
    const pagecount = this.props.data.book.bookinfo.book.numberOfPages;
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
    let courseId = _.toString(this.props.data.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = -1;
    }
    this.props.data.actions.addBookmarkUsingSpectrumApi(_.toString(this.props.data.book.userInfo.userid),
      _.toString(this.props.data.location.query.bookid), _.toString(currentPage.pageid),
      _.toString(currentPage.pagenumber), _.toString(currentPage.pageorder),
      _.toString(courseId), false, this.props.PdfbookMessages.PageMsg, this.props.data.book.bookinfo.book.roleTypeID, this.getpiSessionKey());
  }
  /* created removeBookmarkHandler method for removing bookmark for selected Page, after clicking on bookmark button. */
  removeBookmarkHandler = (bookmarkId) => {
    let currentPageId;
    if (bookmarkId !== undefined) {
      currentPageId = bookmarkId;
    } else {
      currentPageId = this.state.currPageIndex;
    }
    const targetBookmark = find(this.props.data.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    const targetBookmarkId = targetBookmark.bkmarkId;
    this.props.data.actions.removeBookmarkUsingSpectrumApi(targetBookmarkId,_.toString(this.props.data.book.userInfo.userid)
           ,_.toString(this.props.data.location.query.bookid),this.getpiSessionKey());
  };

/* Checking the particular page you are trying to set bookmark already a bookmark or not. */
  isCurrentPageBookmarked = () => {
    const currentPageId = this.state.currPageIndex;
    const targetBookmark = find(this.props.data.book.bookmarks, bookmark => bookmark.uri === currentPageId);
    return !(targetBookmark === undefined);
  };
  /* Method for setting the zoom level selected by user, using passing the selected value. */
  setCurrentZoomLevel = (level) => {
    let currZoomLevel = this.state.currZoomLevel;
    if(level <= 0.1){
      currZoomLevel = 0.1;
    }else{
      currZoomLevel = level;
    }
    __pdfInstance.setCurrentZoomLevel(currZoomLevel);
    this.displayHighlight();
    if(this.props.data.book.regions.length > 0 )
    {
      __pdfInstance.displayRegions(this.props.data.book.regions,this.props.data.book.bookFeatures,_);
    }
    if(this.state.showHotspot !== true)
    {
      try
      {
        $(".hotspot").hide();
        $(".hotspotIcon").hide();
        this.setState({showHotspot:false});
      }
      catch(e){}
    }
    this.updateGlossary();
    this.setState({currZoomLevel : currZoomLevel});
  }
/*Method for removing hotspot content on clicking the close button*/
  onHotspotClose() {
      try
      {
        $('#hotspot').empty();
        $('#player-iframesppModalBody').remove();
        $('#sppModal').css("display","none");
      }
      catch(e){}
  }
/* Method for checking if a url is starts with http:// and convert it to https:// */
  createHttps = (uri) => {
  if(/^http:\/\//i.test(uri))
  {
    let link=uri.substring(4);
    uri = 'https' + link ;
  }
  return uri;
}
/*Method to navigate to a particular book page number based on bookPageNumber*/
  goToPageNumber = (pageNo) => {
    let currentPage = find(pages,page => page.pagenumber == pageNo)
    if(currentPage == undefined)
    {
        this.props.data.actions.fetchPagebyPageNumber(this.props.data.book.userInfo.userid,
        this.props.data.book.bookinfo.book.roleTypeID,
        this.props.data.location.query.bookid,
        this.props.data.book.bookinfo.book.bookeditionid,
        pageNo,
        ssoKey,serverDetails)
      .then(() => {
          if (pages === undefined) {
            pages = this.props.data.book.bookinfo.pages;
            localStorage.setItem('pages', JSON.stringify(pages));
            currentPage = find(pages,page => page.pagenumber == pageNo)
          } else {
            pages = pages.concat(this.props.data.book.bookinfo.pages);
            localStorage.setItem('pages', JSON.stringify(pages));
            currentPage = find(pages,page => page.pagenumber == pageNo)
          }
          this.goToPage(Number(currentPage.pageorder));
      });
    }
    else
    {
      this.goToPage(Number(currentPage.pageorder));
    }

  }

/*Glossary Updation on changung properties of glossary element*/

  updateGlossary()
  {
    let glossaryDataUpdated = [];
    for(let i=0;i<this.props.data.book.glossaryInfoList.length;i++)
    {
      for(let k=0 ; k < this.state.glossaryRegions.length ; k++)
      {
        if((this.props.data.book.glossaryInfoList[i].glossaryEntryID).trim() == (this.state.glossaryRegions[k].glossaryEntryID).trim())
        {
          let glossTerm = {
            isET1 : 'Y' ,
            item : document.getElementById('region' + this.state.glossaryRegions[k].regionID),
            popOverCollection : {
              popOverDescription : this.props.data.book.glossaryInfoList[i].glossaryDefinition,
              popOverTitle : this.props.data.book.glossaryInfoList[i].glossaryTerm
            }
          };
          glossaryDataUpdated.push(glossTerm);
        }
      }
    }
    if(glossaryDataUpdated.length>0)
    {
      new PopUpInfo({'popUpCollection' : glossaryDataUpdated, 'bookContainerId' : 'docViewer_ViewContainer_PageContainer_0', isET1 : 'Y'});
    }
  }
/*Method to handle mouse hover event for transparent hotsopts*/
  handleTransparentRegionHover(hotspotID)
  {
    let transparentRegion = document.getElementById(hotspotID);
    if(this.props.data.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent !== true)
    {
      transparentRegion.style.borderBottomColor = this.props.data.book.bookFeatures.underlinehotppothovercolor;
    }
    else if(this.props.data.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent == true)
    {
      transparentRegion.style.borderBottomColor = this.props.data.book.bookFeatures.underlinehotppothovercolor;;
      transparentRegion.style.borderBottomWidth = this.props.data.book.bookFeatures.underlinehotspotthickness + 'px';
      transparentRegion.style.borderBottomStyle = 'solid';
    }
    else
    {
      transparentRegion.style.background = convertHexToRgba(this.props.data.book.bookFeatures.hotspotcolor,this.props.data.book.bookFeatures.regionhotspotalpha);
    }
  }
/*Method to handle mouse out event for transparent hotsopts*/
  handleTransparentRegionUnhover(hotspotID)
  {
    let transparentRegion = document.getElementById(hotspotID);
    if(this.props.data.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent !== true)
    {
      transparentRegion.style.borderBottomColor = this.props.data.book.bookFeatures.underlinehotspotcolor;
    }
    else if(this.props.data.book.bookFeatures.isunderlinehotspot == true && transparentRegion.transparent == true)
    {
      transparentRegion.style.borderBottomColor = convertHexToRgba(this.props.data.book.bookFeatures.underlinehotspotcolor,0);
      transparentRegion.style.borderBottomWidth = 0 + 'px';
      transparentRegion.style.borderBottomStyle = 'none';
    }
    else
    {
      transparentRegion.style.background = convertHexToRgba(this.props.data.book.bookFeatures.hotspotcolor,0);
    }
  }
/*Method to check hotspot type on the basis of extension*/
  getHotspotType = (hotspot) => {
    let region = '';
    let regionLink = hotspot.linkValue.toLowerCase();
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
  onHotspotThumbnailClick()
  {
    try
    {
      $('.preview-image').hide();
      $('.poster-play-icon').hide();
      $('.thumb-nail').hide();
      $('.aquila-audio-player').hide();
    }
    catch(e){
    }
  }
  /*Method to render the clicked region component.*/
  renderHotspot = (hotspotDetails) => {
    let regionComponent = " ";
    let hotspotData,source;
    switch(hotspotDetails.hotspotType) {
      case 'AUDIO':
                  source = this.createHttps(hotspotDetails.linkValue);
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
                let email = "mailto:" + hotspotDetails.linkValue
                parent.location = email;
                break;
      case 'IMAGE':
               source = this.createHttps(hotspotDetails.linkValue);
               hotspotData = {
                 alt : hotspotDetails.name,
                 src : source,
                 width : hotspotDetails.mediaWidth,
                 height : hotspotDetails.mediaHeight,
                 title : hotspotDetails.name,
                 items : hotspotDetails
               };
               regionComponent = <ImageViewerPreview data={hotspotData}/>;
               break;
      case 'VIDEO':
               source = this.createHttps(hotspotDetails.linkValue);
               hotspotData = {
                title : hotspotDetails.name,
                src : source,
                caption : hotspotDetails.description || "",
                id : hotspotDetails.regionID,
                thumbnail : {
                  src : "",
               },
               alt : hotspotDetails.name,
               };
               regionComponent = <VideoPlayerPreview data={hotspotData}/>;
               break;
      case 'SPPASSET':
               source = hotspotDetails.linkValue;
               document.getElementById('sppTitle').innerText = hotspotDetails.name;
               var sppHeaderHeight =document.getElementById('sppModalHeader').style.height;
               var sppPlayer = document.getElementById('sppModalBody');
               var lastIndex = source.lastIndexOf("/");
               var assetID = source.slice(lastIndex+1);
               var scriptContent = 'https://mediaplayer.pearsoncmg.com/assets/_embed.sppModalBody/' + assetID;
               var sppScript=document.createElement('SCRIPT');
               sppScript.src = scriptContent;
               sppPlayer.appendChild(sppScript);
               sppPlayer.style.height = (document.documentElement.clientHeight - parseInt(sppHeaderHeight,10)) + 'px';
               sppPlayer.style.width = document.documentElement.clientWidth + 'px';
               document.getElementById('sppCloseBtn').addEventListener('click',this.onHotspotClose);
                try
                {
                  document.getElementById('root').appendChild(document.getElementById('sppModal'));
                  $('#sppModal').css("display","block");
                }
                catch(e){
                }
                break;
      case 'DOCUMENT':
               source=hotspotDetails.linkValue;
               window.open(source,"_blank");
               break;
      case 'URL':
               source = this.createHttps(hotspotDetails.linkValue);
               hotspotData = {
                 title : hotspotDetails.name,
                 src : source
               };
               regionComponent = <ExternalLink title={hotspotData.title} src={hotspotData.src} onClose={this.onHotspotClose}/>;
               break;
      case 'EXTERNALLINK':
               source=hotspotDetails.linkValue;
               window.open(source,"_blank");
               break;
      case 'LTILINK':
               let courseId;
               if (this.props.data.book.bookinfo.book.activeCourseID === undefined || this.props.data.book.bookinfo.book.activeCourseID === '' || this.props.data.book.bookinfo.book.activeCourseID === null)
               {
                courseId = -1;
               }
               else
               {
                courseId = this.props.data.book.bookinfo.book.activeCourseID;
               }
               /*Framing Complete LTI URl*/
               let link = serverDetails + '/ebook/toolLaunch.do?json=' + hotspotDetails.linkValue + '&contextid=' + courseId + '&role=' + this.props.data.book.bookinfo.book.roleTypeID + '&userlogin=' + this.props.data.book.userInfo.userid ;
               /*Converting URL into https*/
               let ltiUrl = this.createHttps(link);
               window.open(ltiUrl,"_blank");
               break;
      default :regionComponent = null;
               break;
    };
    return regionComponent;
  }
/*Method to handle the action to be performed when a region is clicked.*/
handleRegionClick(hotspotID) {
  let regionDetails,basepath;
  var youtubeRegex= /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    if(this.state.regionData)
    {
      this.setState({regionData : null});
    }
    try
    {
      $('player-iframesppModalBody').remove();
      $('#sppModal').css("display","none");
    }
    catch(e){}
    if(this.props.data.book.regions.length > 0 )
    {
      for(let i=0; i < this.props.data.book.regions.length ; i++)
      {
          if(hotspotID == ('region' + this.props.data.book.regions[i].regionID))
          {
            regionDetails = this.props.data.book.regions[i];
            regionDetails.hotspotType = '';
            if(regionDetails.linkTypeID == eT1Contants.LinkType.IMAGE)
            {
              regionDetails.hotspotType = 'IMAGE';
              if(this.props.data.book.basepaths.imagepath !== null && this.props.data.book.basepaths.imagepath !== "" && this.props.data.book.basepaths.imagepath !== undefined)
              {
                basepath = this.props.data.book.basepaths.imagepath;
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.FLV)
            {
              regionDetails.hotspotType = 'VIDEO';
              if(this.props.data.book.basepaths.flvpath !== null && this.props.data.book.basepaths.flvpath !== "" && this.props.data.book.basepaths.flvpath !== undefined)
              {
                basepath = this.props.data.book.basepaths.flvpath;
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.MP3 || regionDetails.linkTypeID == eT1Contants.LinkType.FACELESSAUDIO)
            {
              regionDetails.hotspotType = 'AUDIO';
              if(this.props.data.book.basepaths.mp3path !== null && this.props.data.book.basepaths.mp3path !== "" && this.props.data.book.basepaths.mp3path !== undefined)
              {
                basepath = this.props.data.book.basepaths.mp3path;
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
              if(this.props.data.book.basepaths.h264path !== null && this.props.data.book.basepaths.h264path !== "" && this.props.data.book.basepaths.h264path !== undefined)
              {
                basepath = this.props.data.book.basepaths.h264path;
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
                regionDetails.hotspotType = this.getHotspotType(regionDetails);
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
              if(this.props.data.book.basepaths.urlpath !== null && this.props.data.book.basepaths.urlpath !== "" && this.props.data.book.basepaths.urlpath !== undefined)
              {
                basepath = this.props.data.book.basepaths.urlpath;
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
                regionDetails.hotspotType = this.getHotspotType(regionDetails);
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
              if(this.props.data.book.basepaths.virtuallearningassetpath !== null && this.props.data.book.basepaths.virtuallearningassetpath !== "" && this.props.data.book.basepaths.virtuallearningassetpath !== undefined)
              {
                basepath = this.props.data.book.basepaths.virtuallearningassetpath;
              }
            }
            else if(regionDetails.linkTypeID == eT1Contants.LinkType.CHROMELESS_URL)
            {
              regionDetails.hotspotType = this.getHotspotType(regionDetails);
              if(this.props.data.book.basepaths.chromelessurlpath !== null && this.props.data.book.basepaths.chromelessurlpath !== "" && this.props.data.book.basepaths.chromelessurlpath !== undefined)
              {
                basepath = this.props.data.book.basepaths.chromelessurlpath;
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
              if(_.startsWith(regionDetails.linkValue,eT1Contants.SppBaseUrls.SppDev) || _.startsWith(regionDetails.linkValue,this.createHttps(eT1Contants.SppBaseUrls.SppDev)) ||
                 _.startsWith(regionDetails.linkValue,eT1Contants.SppBaseUrls.SppCert) || _.startsWith(regionDetails.linkValue,this.createHttps(eT1Contants.SppBaseUrls.SppCert)) ||
                 _.startsWith(regionDetails.linkValue,eT1Contants.SppBaseUrls.SppPPE) || _.startsWith(regionDetails.linkValue,this.createHttps(eT1Contants.SppBaseUrls.SppPPE)) ||
                 _.startsWith(regionDetails.linkValue,eT1Contants.SppBaseUrls.SppStage) || _.startsWith(regionDetails.linkValue,this.createHttps(eT1Contants.SppBaseUrls.SppStage)) ||
                 _.startsWith(regionDetails.linkValue,eT1Contants.SppBaseUrls.SppProd) || _.startsWith(regionDetails.linkValue,this.createHttps(eT1Contants.SppBaseUrls.SppProd)))
              {
                regionDetails.hotspotType = 'SPPASSET';
              }
              if(regionDetails.hotspotType == 'URL')
              {
                if((regionDetails.linkValue).indexOf('pearson')== -1)
                {
                  regionDetails.hotspotType = 'EXTERNALLINK';
                }
                else if((regionDetails.linkValue).indexOf('pearson') !== -1 && (_.endsWith(regionDetails.linkValue,".htm") || _.endsWith(regionDetails.linkValue,".html")))
                {
                  regionDetails.hotspotType = 'EXTERNALLINK';
                }
                if(youtubeRegex.test(regionDetails.linkValue))
                {
                  regionDetails.hotspotType = 'VIDEO';
                }
              }
            }
            /*Checking if the clicked hotspot is Image/Video/Audio/URL and open it in MMI Component */
            if(regionDetails.hotspotType == 'IMAGE' || regionDetails.hotspotType == 'VIDEO' || regionDetails.hotspotType == 'AUDIO' || regionDetails.hotspotType == 'URL')
            {
              /*Updating the state to rerender the page with Aquila JS Component*/
              this.setState({regionData : regionDetails});
              if(this.state.regionData.hotspotType == 'IMAGE')
              {
                try
                {
                  $('.preview-image').hide();
                  jQuery(function(){
                   jQuery('.preview-image').click();
                  });
                }
                catch(e){
                }
              }
              else if(this.state.regionData.hotspotType == 'VIDEO')
              {
                try
                {
                  $('.poster-play-icon').hide();
                  $('.thumb-nail').hide();
                  jQuery(function(){
                   jQuery('.poster-play-icon').click();
                  });
                }
                catch(e){
                }
              }
              else if(this.state.regionData.hotspotType == 'URL')
              {
                try
                {
                  let ExternalLinkComponent = document.getElementsByClassName('link-model')[0];
                  ExternalLinkComponent.style.backgroundColor = '#ffffff';
                }
                catch(e){
                }
              }
              else if(this.state.regionData.hotspotType == 'AUDIO' && this.state.regionData.linkTypeID == eT1Contants.LinkType.FACELESSAUDIO)
              {
                try
                {
                 $('.aquila-audio-player').hide();
                  jQuery(function(){
                   jQuery('.play-pause').click();
                  });
                }
                catch(e){
                }
              }
              if(this.state.regionData.hotspotType == 'AUDIO')
              {
                try
                {
                  jQuery(function(){
                   jQuery('.play-pause').click();
                  });
                  $.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js", function()
                  {
                    $( ".aquila-audio-player" ).draggable()
                  });
                }
                catch(e){
                }
              }
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
    let selectedHighlight;
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
            selectedHighlight = highlightList[i];
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
    if (selectedHighlight !== undefined && selectedHighlight.meta.roletypeid == 3 &&
            this.props.data.book.bookinfo.book.roleTypeID == 2)
    {
      return;
    }
    else if (selectedHighlight !== undefined && isExistinghighlightFound) {
      this.handleHighlightClick(selectedHighlight.id);
    } else {
      const highlightsLength = highlightList.length;
      currentHighlight.id = highlightsLength + 1;
      currentHighlight.highlightHash = highlightData1.serializedHighlight;
      currentHighlight.selection = highlightData1.selection;
      currentHighlight.pageIndex = highlightData1.pageInformation.pageNumber;
      pdfAnnotatorInstance.showCreateHighlightPopup(currentHighlight, highLightcordinates,
        this.saveHighlight.bind(this), this.editHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_0',
        (languages.translations[this.props.locale]), this.props.data.book.bookinfo.book.roleTypeID, this.props.data.book.bookinfo.book.activeCourseID);
    }
  }
/* Method created for displaying the selected highLights. */
  saveHighlight(currentHighlight, highLightMetadata) {
    const currentPageId = this.state.currPageIndex;
    let courseId = _.toString(this.props.data.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = -1;
    }
    const note = highLightMetadata.noteText;
    const meta = {
      userroleid: _.toString(this.props.data.book.bookinfo.book.roleTypeID),
      userbookid: _.toString(this.props.data.book.bookinfo.userbook.userbookid),
      bookeditionid: _.toString(this.props.data.book.bookinfo.book.bookeditionid),
      roletypeid: _.toString(this.props.data.book.bookinfo.book.roleTypeID),
      colorcode: highLightMetadata.currHighlightColorCode,
      author: authorName,
      highlightHash: currentHighlight.highlightHash,
      note
    };
    const selectedText = currentHighlight.selection;
    const isShared = highLightMetadata.isShared;
    const currentPage = find(pages, page => page.pageorder === currentPageId);
    this.props.data.actions.saveHighlightUsingSpectrumApi(_.toString(this.props.data.book.userInfo.userid),
      _.toString(this.props.data.location.query.bookid),_.toString(currentPage.pagenumber), _.toString(courseId), isShared,
      selectedText, highLightMetadata.currHighlightColor,
      meta, _.toString(currentPageId),_.toString(this.props.data.book.bookinfo.book.roleTypeID),this.getpiSessionKey()).then((newHighlight) => {
        pdfAnnotatorInstance.setCurrentHighlight(newHighlight);
        this.displayHighlight();
      });
  }

  editHighlight = (id, highLightMetadata) => {
    const currentPageId = this.state.currPageIndex;
    let highlightToEdit = find(this.state.highlightList, highlight => highlight.id === id);
    const note = highLightMetadata.noteText !== undefined ? highLightMetadata.noteText : highlightToEdit.comment;
    const color = highLightMetadata.currHighlightColor !== undefined ? highLightMetadata.currHighlightColor : highlightToEdit.color;
    const isShared = highLightMetadata.isShared !== undefined ? highLightMetadata.isShared : highlightToEdit.shared;
    this.props.data.actions.editHighlightUsingSpectrumApi(id, note,
      color, isShared,_.toString(this.props.data.book.userInfo.userid),
      _.toString(this.props.data.location.query.bookid),_.toString(highlightToEdit.pageNo),
      _.toString(highlightToEdit.courseId),_.toString(highlightToEdit.text),_.toString(this.props.data.book.bookinfo.book.roleTypeID),
      highlightToEdit.meta,currentPageId,
      this.getpiSessionKey()).then(() => {
        this.displayHighlight();
      });
  }
/* Method defined for when user click on Highlighted area on the page. */
  handleHighlightClick(highLightClickedData) {
    let hId;
    let cornerFoldedImageTop;
    if(highLightClickedData.highlightId === undefined)
    {
      hId = highLightClickedData;
    }
    else
    {
      hId = highLightClickedData.highlightId;
      cornerFoldedImageTop = highLightClickedData.cornerFoldedImageTop;
    }
    let highlightClicked = find(this.state.highlightList, highlight => highlight.id === hId);
    if (highlightClicked.shared === true)
    {
      highlightClicked = find(this.props.data.book.annTotalData, highlight => highlight.id === hId);
    }
    highlightClicked.color = highlightClicked.originalColor;
    pdfAnnotatorInstance.showSelectedHighlight(highlightClicked,
      this.editHighlight.bind(this), this.deleteHighlight.bind(this), 'docViewer_ViewContainer_PageContainer_0',
      (languages.translations[this.props.locale]), this.props.data.book.bookinfo.book.roleTypeID,cornerFoldedImageTop, this.props.data.book.bookinfo.book.activeCourseID);
  }

  /* Method for displaying the Highlight already stored. */
  displayHighlight = () => {
    const currentPageId = this.state.currPageIndex;
    const highlightList = [];
    let noteIconsList = [];
    this.props.data.book.annTotalData.forEach((annotation) => {
      if (annotation.pageId === currentPageId) {
        if(annotation.shared){
          annotation.color = '#00a4e0';
          annotation.meta.colorcode = '#00a4e0';
        }
        else{
          annotation.color = annotation.originalColor;
          annotation.meta.colorcode = annotation.originalColor;
        }
        highlightList.push(annotation);
        if(!annotation.isHighlightOnly)
        {
          noteIconsList.push(annotation);
        }
      }
    });
    __pdfInstance.restoreHighlights(highlightList, this.deleteHighlight);
    __pdfInstance.reRenderHighlightCornerImages(noteIconsList);
    this.setState({ highlightList:highlightList });
    if(this.state.showHighlight == false)
    {
      try
      {
        $(".fwr-highlight-annot").css("visibility","hidden");
        this.setState({showHighlight : false});
      }
      catch(e){}
    }
  }
  /* Method for delete Highlight via passing the id of selected area. */
  deleteHighlight = (id) => {
    __pdfInstance.removeHighlightElement(id);
    this.props.data.actions.removeHighlightUsingSpectrumApi(id,_.toString(this.props.data.book.userInfo.userid),
      _.toString(this.props.data.location.query.bookid),this.getpiSessionKey()).then(() => {
      this.displayHighlight();
    });
  }
  /* Method to show or hide hotspots. */
  showHideRegions = () => {
    let regionElementList = document.getElementsByClassName('hotspotIcon');
    if(this.state.showHotspot == true)
    {
      try{
        $(".hotspot").hide();
        $(".hotspotIcon").hide();
        this.setState({showHotspot:false});
      }
      catch(e){}
    }
    else
    {
      try{
        $(".hotspot").show();
        $(".hotspotIcon").show();
        this.setState({showHotspot:true});        
      }
      catch(e){}
    }
  }
  getPreference = () => {
    let isAnnHide = this.state.showHighlight;
    const prefData = {
      'value': {
        theme: 'White',
        orientation: 'horizontal',
        zoom: this.state.currZoomLevel,
        isAnnotationHide: isAnnHide,
        enableShowHide: true
      }
    };
    const promiseVal = Promise.resolve(prefData);
    return promiseVal;
  }
  /* Method show or hide highlights/notes. */
  showHideHighlights = (prefObject) => {
    if(prefObject.isAnnotationHide == false)
    {
      try
      {
        $(".fwr-highlight-annot").css("visibility","hidden");
        this.setState({showHighlight : false});
      }
      catch(e){}
    }
    else
    {
      try
      {
        $(".fwr-highlight-annot").css("visibility","visible");
        this.setState({showHighlight : true});
      }
      catch(e){}
    }
  }
  viewerContentCallBack = (viewerCallBack) => {
    if (viewerCallBack === false) {
      this.setState({ drawerOpen: true });
    } else {
      this.setState({ drawerOpen: false });
    }
  }

printFunc = () => {
    let date = new Date();
    let currDate = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
    date = new Date(this.props.currentbook.expirationDate);
    let expirationDate = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
    let userEmailId = this.props.currentbook.userEmailId ? this.props.currentbook.userEmailId : 'etextqa@pearson.com';
    let copyrightViolationMsg = `Printed by ${this.props.currentbook.firstName} ${this.props.currentbook.firstName} (${userEmailId}) on ${currDate} autorized to use until ${expirationDate}. 
    Use beyond the authorized user or valid subscription date represents copyright violation.`;
    let printWatermark = eT1Contants.printCopyrightInfo; 
    let prtContent = document.getElementById("docViewer_ViewContainer_BG_0");
    let pageSrc = prtContent.currentSrc;
    let printFrame = document.createElement('iframe');
    printFrame.id = "printFrame";
    printFrame.style.display = "none";
    printFrame.style.width = "100px";
    printFrame.style.height = "100px";
    document.body.appendChild(printFrame);
    let frameContentCss = '#watermark{ top:30%; left:2%; position:absolute; transform: rotate(30deg); font-size:50px; font-weight:20px; opacity:0.3; display:none;} #footer{ bottom:0; position:absolute; display:none; font-size:14px}';
    if(this.props.data.book.bookFeatures.printWithFooter && this.props.data.book.bookFeatures.printWithWatermark){
      frameContentCss = frameContentCss + '@media print { @page { size:auto; page-break-after:avoid; margin:0;} img{ max-height: 29cm; max-width: 21cm; margin:0;} #footer{ display:block; } #watermark{ display:block; }}';
    }else if(this.props.data.book.bookFeatures.printWithFooter && !this.props.data.book.bookFeatures.printWithWatermark){
      frameContentCss = frameContentCss + '@media print { @page { size:auto; page-break-after:avoid; margin:0;} img{ max-height: 29cm; max-width: 21cm; margin:0;} #footer{ display:block; }}';
    }else if(!this.props.data.book.bookFeatures.printWithFooter && this.props.data.book.bookFeatures.printWithWatermark){
      frameContentCss = frameContentCss + '@media print { @page { size:auto; page-break-after:avoid; margin:0;} img{ max-height: 29cm; max-width: 21cm; margin:0;} #watermark{ display:block; }}';
    }else if(!this.props.data.book.bookFeatures.printWithFooter && !this.props.data.book.bookFeatures.printWithWatermark){
      frameContentCss = frameContentCss + '@media print { @page { size:auto; page-break-after:avoid; margin:0;} img{ max-height: 29cm; max-width: 21cm; margin:0;}}';
    }
    printFrame.contentWindow.document.open();
    printFrame.contentWindow.document.write('<style type="text/css">'+frameContentCss+'</style>');
    printFrame.contentWindow.document.write('<div><img src="' + pageSrc + '" onload="window.print();"><div id=watermark>'+printWatermark+'</div><div id=footer>'+copyrightViolationMsg+'</div></div>');
    printFrame.contentWindow.document.close();
    window.onafterprint = function(){
      document.body.removeChild(document.getElementById('printFrame'));
    }
  }

  getpiSessionKey = () => {
    let piSessionKey;
    piSession.getToken(function(result, userToken){
          if(result === 'success'){
            piSessionKey = userToken;
          }
    });
    if(piSessionKey === undefined)
    {
      piSessionKey = localStorage.getItem('secureToken');
    }
    return piSessionKey;
  }

/* Method for render the component and any change in store data, reload the changes. */
  render() {
    const callbacks = {};
    const viewerCallBacks = {};
    const { messages } = languages.translations[this.props.locale];
    callbacks.addBookmarkHandler = this.addBookmarkHandler;
    callbacks.removeBookmarkHandler = this.removeBookmarkHandler;
    callbacks.removeAnnotationHandler = this.deleteHighlight;
    callbacks.saveHighlightHandler = this.saveHighlight;
    callbacks.isCurrentPageBookmarked = this.isCurrentPageBookmarked;
    callbacks.goToPage = this.goToPage;
    callbacks.goToPageCallback = this.goToPage;
    callbacks.resetCurrentPageDetails = this.props.data.actions.loadcurrentPage
    viewerCallBacks.handleHighlightClick = this.handleHighlightClick.bind(this);
    viewerCallBacks.createHighlight = this.createHighlight.bind(this);
    viewerCallBacks.handleRegionClick = this.handleRegionClick.bind(this);
    viewerCallBacks.handleTransparentRegionHover = this.handleTransparentRegionHover.bind(this);
    viewerCallBacks.handleTransparentRegionUnhover = this.handleTransparentRegionUnhover.bind(this);
    const searchUrl = `${serverDetails}/ebook/pdfplayer/searchbook?bookid=${this.props.data.location.query.bookid}`
        + `&globalbookid=${globalbookid}&searchtext=searchText&sortby=1&version=${this.props.data.book.bookinfo.book.version}&authkey=${ssoKey}`;
    this.props.data.book.annTotalData.forEach((annotation) => {
      if(annotation.shared){
          annotation.color = 'Instructor';
        }
        else{
          annotation.color = annotation.originalColor;
        }
      });
    if (this.props.data.book.toc.fetched && this.props.data.book.toc.content !== undefined
              && this.props.data.book.toc.content.list !== undefined)
    {
      this.props.data.book.tocReceived = true;
    }
    else
    {
      this.props.data.book.tocReceived = false;
    }
    let productData = {
      metaData : {
        pdfInstance : __pdfInstance,
        pdfRendererUrl : foxiturl,
        pdfRendererCacheUrl : foxitCdnUrl,
        bookFeatures : (this.props.data.book.bookFeatures ? this.props.data.book.bookFeatures : {})
      }
    };
    /*Creating array of objects containing options info for moreMenu*/
    let moreMenuData = [];
    let currPageObj = this.findPages(pages, this.state.currPageIndex);
    let showHideHotspots = {
      type : 'menuItem',
      value : 'showHideHotspots',
      text : this.state.showHotspot ? messages.hideLinks ? messages.hideLinks :'Hide Links'
                  : messages.showLinks ? messages.showLinks : 'Show Links',
      onClick : this.showHideRegions,
      isDisabled : false
    }
    let printData = {
      type : 'menuItem',
      value : 'print',
      text : messages.print ? messages.print : 'Print',
      onClick : this.printFunc,
      isDisabled : currPageObj ? currPageObj.printDisabled ? true : false : false
    }
    let signOutData = {
      type : 'menuItem',
      value : 'signOut',
      text : messages.signOut ? messages.signOut : 'Sign Out',
    }
    // if(this.props.data.book.bookFeatures.hasShowLinksButton == true)
    // {
    //   moreMenuData.push(showHideHotspots);
    //   moreMenuData.push({type : 'divider'});
    // }
    if(this.props.data.book.bookFeatures.hasPrintLink == true && this.state.currPageIndex !== 0)
    {
      moreMenuData.push(printData);
      moreMenuData.push({type : 'divider'});
    }
    moreMenuData.push(signOutData);
    /* Here we are passing data, pages, goToPageCallback,
       getPrevNextPage method and isET1 flag in ViewerComponent
       which is defined in @pearson-incubator/viewer . */
    return (

      <div className={'add'} >
        <div>
          <Header
            locale={this.props.locale}
            classname={this.state.classname}
            bookData={this.props.data.book}
            bookCallbacks={callbacks}
            setCurrentZoomLevel={this.setCurrentZoomLevel}
            store={this.context.store}
            goToPage={this.goToPage}
            bookId={this.props.data.location.query.bookid}
            globalBookId={this.props.currentbook.globalBookId}
            ssoKey={this.props.currentbook.ssoKey}
            title={this.props.currentbook.title}
            curbookID={this.props.data.location.query.bookid}
            isET1="Y"
            disableBackgroundColor="true"
            serverDetails={this.props.currentbook.serverDetails}
            drawerOpen={this.state.drawerOpen}
            indexId={{ searchUrl }}
            userid={this.props.data.book.userInfo.userid}
            messages={messages}
            viewerContentCallBack={this.viewerContentCallBack}
            currentPageIndex={this.state.currPageIndex}
            currentScenario = {this.props.currentbook.scenario}
            globaluserid = {this.props.currentbook.globaluserid}
            invoketype ={this.props.data.location.query.invoketype}
            moreMenuData = {moreMenuData}
            preferenceUpdate = {this.showHideHighlights}
            getPreference = {this.getPreference}
          />

          <div className="eT1viewerContent">
            {this.state.isFirstPageBeingLoad !== true ? <ViewerComponent
              locale={this.props.locale}
              data={this.state.data} pages={this.props.data.book.viewer.pages} goToPageCallback={this.goToPage}
              getPrevNextPage={this.getPrevNextPage} isET1="Y"
            /> : null}
          </div>
        </div>
        <div>
          <div id='sppModal' className='sppModal'>
              <div id='sppModalHeader' className='sppModalHeader' style={{height: 60 + 'px'}}>
                <span id='sppCloseBtn' className='sppCloseBtn'>&times;</span>
                  <p id='sppTitle'></p>
              </div>
              <div id='sppModalBody' className='sppModalBody' />
          </div>
        {this.state.regionData ? <div id="hotspot" className='hotspotContent'>{this.renderHotspot(this.state.regionData)}</div> : null }
        <LearningContextProvider
          contextId = {this.props.data.location.query.bookid}
          contentType = "PDF"
          metadata = {productData.metaData}
        >
        <PdfViewer
          isPageLoaded = {this.state.pageLoaded}
          currentPage = {this.props.data.book.currentPageInfo}
          onPageLoadComplete = {this.pdfBookCallback}
          viewerCallBacks = {viewerCallBacks}
        />
        </LearningContextProvider>
        {this.state.popUpCollection.length ? <PopUpInfo bookContainerId='docViewer_ViewContainer_PageContainer_0' popUpCollection={this.state.popUpCollection} isET1='Y'/> : null }
        </div>
        {this.state.pageLoaded !== true ?
        <div className="centerCircularBar">
        <RefreshIndicator size={50} left={0.48*$(window).width()} top={200} status="loading" />
        </div> : null}
      </div>
    );
  }
}

/* propTypes used for communication to child Component that which props are present in Parent Component. */
PdfBookReader.propTypes = {
  locale: React.PropTypes.string,
  fetchTocAndViewer: React.PropTypes.func,
  addBookmarkUsingSpectrumApi: React.PropTypes.func,
  removeBookmarkUsingSpectrumApi: React.PropTypes.func,
  fetchBookmarksUsingSpectrumApi: React.PropTypes.func,
  fetchHighlightUsingSpectrumApi: React.PropTypes.func,
  saveHighlightUsingSpectrumApi: React.PropTypes.func,
  removeHighlightUsingSpectrumApi: React.PropTypes.func,
  editHighlightUsingSpectrumApi: React.PropTypes.func,
  PdfbookMessages: React.PropTypes.object,
  fetchPageInfo: React.PropTypes.func,
  book: React.PropTypes.object,
  bookshelf: React.PropTypes.object,
  params: React.PropTypes.object
};

PdfBookReader.contextTypes = {
  store: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired
};

export default PdfBookReader;
