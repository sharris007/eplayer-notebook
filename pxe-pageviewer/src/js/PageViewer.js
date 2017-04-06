import '../scss/pageviewer.scss';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import $ from 'jquery';
// import CircularProgress from 'material-ui/CircularProgress';
// import renderHTML from 'react-render-html';

import FooterNav from './FooterNav';
import crossRef from './CrossRef';
import copyCharLimit from './CopyCharLimit';
import HighlightText from './HighlightText';
import replaceAllRelByAbs from './ConstructUrls';
import { loadMathMLScript, reloadMathMl } from './MathML';

class PageViewer extends React.Component {
  
  constructor(props) {
    super(props);
    this.startTimer=new Date();
  };

  init = (props) => {
    //const thisRef=this;
    const playListURL = this.props.src.playListURL;
    const initPageIndex = this.props.src.currentPageURL ? playListURL.findIndex(el =>{
      return parseInt(el.playOrder)===parseInt(this.props.src.currentPageURL.playOrder); 
    }): '';
    this.state = {
      renderSrc: '',
      currentPage: initPageIndex ? initPageIndex : 0,
      goTo: '',
      pageNoDetails: '',
      /*isFirstPage: initPageIndex === 0,
      isLastPage: initPageIndex === playListURL.length - 1,
      prevPageTitle: (initPageIndex === 0) ? '' : playListURL[initPageIndex - 1].title,
      nextPageTitle: (initPageIndex === playListURL.length - 1) ? '' : playListURL[initPageIndex+1].title,*/
      currentStatePlayListUrl:playListURL[initPageIndex]
    };

    this.getResponse(this.state.currentPage, true, 'initPage', this.scrollWindowTop);
  };

  scrollWindowTop = () => {
    window.scroll(0, 0);
  };

  getRequestedPageUrl = (playOrder) => {
    const thisRef = this;
    return thisRef.props.src.playListURL.filter((el) => {
      return el.playOrder === playOrder;
    });
  };

  getResponse = (currentPage, isInitOrGo, goToPage, scrollWindowTopCallBack, pageFragmentID) => {
    this.props.onBookLoaded(false);
    // this.setState({pageLoading:true});
    const thisRef = this;
    const playListURL = thisRef.props.src.playListURL;
    currentPage = currentPage + (isInitOrGo ? 0 : thisRef.state.currentPage);
    thisRef.props.sendPageDetails(goToPage, playListURL[currentPage]);
    const url = thisRef.props.src.baseUrl + playListURL[currentPage].href;
    const request = new Request(url, {
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
    fetch(request, {
      method: 'get'
    }).then((response) => {
      return response.text();
    }).then((text) => {
      if (this.props.src.highlightText) {
        text=HighlightText.highlightText(this, text);
      }
      //text  = text.replace(/ epub:type\S*\B/g, '').replace('<body', '<body>');
      const currentHref=thisRef.state.currentStatePlayListUrl.href;
      thisRef.setState({
        renderSrc: replaceAllRelByAbs(text, thisRef.props.src.baseUrl+currentHref.substring(0, currentHref.lastIndexOf('/'))),
        currentPage: currentPage,
        isFirstPage: currentPage === 0,
        isLastPage: currentPage >= playListURL.length - 1,
        prevPageTitle: (currentPage === 0) ? '' : playListURL[currentPage - 1].title,
        nextPageTitle: (currentPage === playListURL.length - 1) ? '' : playListURL[currentPage+1].title,
        currentStatePlayListUrl: playListURL[currentPage]
      });
      this.props.onBookLoaded(true);
      // this.setState({pageLoading:false});
      //callback
      if (pageFragmentID && document.getElementById(pageFragmentID)) {
        this.scrollToFragment(pageFragmentID);
      }else  {
        scrollWindowTopCallBack();
      }
    }).catch(() => {//err param
      //console.log(err);
    });
  }

  goToNext = () => {
    this.getResponse(1, false, 'Next', this.scrollWindowTop);
  };

  goToPrev = () => {
    this.getResponse(-1, false, 'Prev', this.scrollWindowTop);
  };

  handlerGoEvent = () => {
    this.getResponse(parseInt(this.state.goTo), true, 'Goto', this.scrollWindowTop);
  };

  updateGoTo = (e) => {
    this.setState({ goTo: e.target.value });
  };

  goToKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.updateGoTo(e);
      this.getResponse(parseInt(this.state.goTo), true, this.scrollWindowTop);
    }
  };

  arrowNavigation = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
      if (e.keyCode === 37 && !this.state.isFirstPage) {
        this.goToPrev();
      } else if (!this.state.isLastPage) {
        this.goToNext();
      }
      //window.scroll(0, 0);
    }
  };

  //prints page no in the page rendered
  enablePageNo = () => {
    const pageDetails = document.getElementsByClassName('pagebreak');
    for (let j = 0; j < pageDetails.length; j++) {
      pageDetails[j].innerHTML = pageDetails[j].title;
      pageDetails[j].style.position = 'absolute';
      pageDetails[j].style.left = '-77px';
      pageDetails[j].style.transform = 'rotate(-90deg)';
      pageDetails[j].style.fontSize = '18px';
    }
  };

  //Common function for disable rightclick
  disableContextMenu = (getElem) => {
    getElem.oncontextmenu = () => {
      return false;
    };
  };
 
  scrollToFragment =(eleID) => {
    const ele=document.getElementById(eleID);
    if (ele) {
      setTimeout(function() {
        //window.scrollTo(ele.offsetLeft, ele.offsetTop);
        ele.scrollIntoView();
      }, 1000);
      // window.scrollTo(ele.offsetLeft, ele.offsetTop);
    }
  };

  loadMultimediaNscrollToFragment =() => {
    let i=0;
    const imagesInPage=document.getElementsByTagName('img');
    const images=[...imagesInPage];
    images.map(ele=>{
      const img = new Image();
      img.onload =  () => {
        i++;
        if (i === images.length) {
          this.scrollToFragment(this.state.currentStatePlayListUrl.href.split('#')[1]);
        }
      };
      img.src = ele.src;
    });
  };
  clearSearchHighlights = (e) => {
    if (!e.target.closest('.book-container')) {
      if (this.props.src.clearSearchHighlights) {
        const span = this.bookContainerRef.getElementsByTagName('span');
        for (let i = 0; i < span.length; i++) {
          if ( span[i].className === 'react-highlighted-text') {
            span[i].className = '';
          }
        }
      }
    }
  };
  setPageTheme = () => {
    const linkEle = 'link[title][rel*="stylesheet"]';
    const getAllLinkTags = this.bookContainerRef.querySelectorAll(linkEle);
    let bgTheme = this.props.src.bgColor;
    if ( bgTheme === 'Akaroa') {
      bgTheme = 'sepia';
    }
    else if ( bgTheme === 'Black') {
      bgTheme = 'night';
    }

    if ( this.bookContainerRef.querySelectorAll('link[title="'+ bgTheme +'"]').length ) {
      getAllLinkTags.forEach (function(link) {
        link.setAttribute('disabled', 'disabled');
      });
      $('link[title="'+ bgTheme +'"]', document.getElementById('book-container')).removeAttr('disabled');
    }
    else {
      getAllLinkTags.forEach (function(link) {
        link.setAttribute('disabled', 'disabled');
        if ( !(link.title !== 'sepia') && (link.title !== 'night')) {
          $('link[title="'+ link.title +'"]', document.getElementById('book-container')).removeAttr('disabled');
        }
      });
    }
  };
  componentWillMount = () => {
    this.init(this.props);
    if (this.props.src.includeMathMLLib) {
      loadMathMLScript();
    }
  };

  componentWillReceiveProps(newProps) {

    if (this.props.src.tocUpdated===true || parseInt(this.props.src.currentPageURL.playOrder) !== parseInt(newProps.src.currentPageURL.playOrder)) {
      const pageIndex=this.props.src.playListURL.findIndex(el =>{
        return parseInt(el.playOrder)===parseInt(newProps.src.currentPageURL.playOrder); 
      });
      this.getResponse(parseInt(pageIndex), true, 'propChanged', this.scrollWindowTop);
      this.props.src.tocUpdated = false;
    }
  };
  
  componentDidUpdate = () => {
    copyCharLimit(this);
    //prints page no in the page rendered
    this.enablePageNo();
    this.loadMultimediaNscrollToFragment();
    crossRef(this);
    document.addEventListener('click', this.clearSearchHighlights);
    if (this.props.src.includeMathMLLib) {
      reloadMathMl(this);
    } 
    this.setPageTheme();
    // const difference_ms = new Date()-this.startTimer;
    // console.log('time took in seconds',  Math.floor(difference_ms % 60));
  };
  getGoToElement = () =>{
    return (
      <div className = "goto-group" >
        < TextField hintText = "Page No" value = {this.state.goTo} onChange = {(e) => this.updateGoTo(e)}  onKeyDown = {(e) => this.goToKeyUp(e)}/><RaisedButton label="Go.." primary={true} onClick={() => this.handlerGoEvent()}/>
      </div>
      );
  };

 
  render() {
    const zommLevel = this.props.src.pageZoom ? this.props.src.pageZoom + '%' : '100%';
    const fontSize = this.props.src.pageFontSize ? this.props.src.pageFontSize + 'px' : '16px';
    return ( 
      <div id = "book-render-component" ref = {(el) => { this.bookComBlock = el; }} tabIndex = "0" onKeyUp = {this.arrowNavigation} >
        <div id={this.props.src.contentId}>
          <div id = "book-container" className = "book-container" ref = {(el) => { this.bookContainerRef = el; }} style={{zoom : zommLevel, fontSize : fontSize}}>
            {this.state.renderSrc ?<div dangerouslySetInnerHTML={{__html: this.state.renderSrc}}></div>:''} 
          </div>
        </div>
        {this.props.src.enableGoToPage ?this.getGoToElement():''} 
        <FooterNav data = {this.state}  onClickNextCallBack = {this.goToNext} onClickPrevCallBack = {this.goToPrev}/> 
        <div ref = {(el) => { this.drmBlockRef = el; }}> </div >
      </div>
    );
  };
};

PageViewer.PropTypes = {
  src: PropTypes.object.isRequired
};
export default PageViewer;
