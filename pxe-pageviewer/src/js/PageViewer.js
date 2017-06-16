/* global $ */
import '../scss/pageviewer.scss';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import FooterNav from './FooterNav';
import {crossRef} from './CrossRef';
import copyCharLimit from './CopyCharLimit';
import audioWbWHighlight from './AudioWBWHighlight';
import HighlightText from './HighlightText';
import replaceAllRelByAbs from './ConstructUrls';
import { loadMathMLScript, reloadMathMl } from './MathML';
import {LightBox} from './LightBox';

class PageViewer extends React.Component {
  
  constructor(props) {
    super(props);
    this.startTimer=new Date();
    document.addEventListener('scroll', this.handleMove);
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
      completeBookLoad : false,
      pageTopVal:'',
      /*isFirstPage: initPageIndex === 0,
      isLastPage: initPageIndex === playListURL.length - 1,
      prevPageTitle: (initPageIndex === 0) ? '' : playListURL[initPageIndex - 1].title,
      nextPageTitle: (initPageIndex === playListURL.length - 1) ? '' : playListURL[initPageIndex+1].title,*/
      currentStatePlayListUrl:playListURL[initPageIndex],
      lightBoxProps:{
        url:'',
        isOpen:false,
        callback:()=>{
          const lightBoxProps=Object.assign({}, this.state.lightBoxProps, {
            url:'',
            isOpen:false
          });
          this.setState({
            lightBoxProps:lightBoxProps
          });
        }
      }
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
    // if (goToPage !== 'Next' && goToPage !== 'Prev')
    //   { this.props.onBookLoaded(false); }
    // this.setState({pageLoading:true});
    this.props.removePopUp();
    let replacedText = '';
    this.setState({completeBookLoad:false});
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
      if (this.props.src.searchText) {
        text=HighlightText.highlightSearchText(this, text);
      }
      //text  = text.replace(/ epub:type\S*\B/g, '').replace('<body', '<body>');
      const currentHref=thisRef.state.currentStatePlayListUrl.href;
      replacedText = replaceAllRelByAbs(text, thisRef.props.src.baseUrl+currentHref.substring(0, currentHref.lastIndexOf('/')));
      if (replacedText) {
        thisRef.setState({
          renderSrc: replacedText,
          completeBookLoad:true,
          currentPage: currentPage,
          isFirstPage: currentPage === 0,
          isLastPage: currentPage >= playListURL.length - 1,
          prevPageTitle: (currentPage === 0) ? '' : playListURL[currentPage - 1].title,
          nextPageTitle: (currentPage === playListURL.length - 1) ? '' : playListURL[currentPage+1].title,
          currentStatePlayListUrl: playListURL[currentPage]
        }, ()=>{
          if (this.props.src.searchText) {
            setTimeout(() => {
              $('html, body').animate({
                scrollTop: $('.pxereaderSearchHighlight')[0].offsetTop
              }, 2000);
            }, 1000); 
          }
        });
      }
      // this.setState({pageLoading:false});
      //callback
      if (pageFragmentID && document.getElementById(pageFragmentID)) {
        this.scrollToFragment(pageFragmentID);
      }else  {
        scrollWindowTopCallBack();
      }
      if (goToPage !== 'Next' && goToPage !== 'Prev')
        { this.props.onBookLoaded(true); }
    }).catch(() => { // err param
      // console.log(err);
    });
  }

  goToNext = () => {
    this.getResponse(1, false, 'Next', this.scrollWindowTop);
  };

  goToPrev = () => {
    this.getResponse(-1, false, 'Prev', this.scrollWindowTop);
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
      for (let i=0;i<getAllLinkTags.length;i++) {
        const link=getAllLinkTags[i];
        link.disabled = true;
      };
      $('link[title="'+ bgTheme +'"]', document.getElementById('book-container')).removeAttr('disabled');
    }
    else {
      for (let i=0;i<getAllLinkTags.length;i++) {
        const link=getAllLinkTags[i];
        link.disabled = true;
        if ((link.title !== 'sepia') && (link.title !== 'night')) {
          $('link[title="'+ link.title +'"]', document.getElementById('book-container')).removeAttr('disabled');
        }
      };
    }
  };
  componentWillMount = () => {
    this.init(this.props);
    if (this.props.src.includeMathMLLib) {
      loadMathMLScript();
    }
  };

  componentWillReceiveProps(newProps) {
    
    if (parseInt(this.props.src.currentPageURL.playOrder) !== parseInt(newProps.src.currentPageURL.playOrder)) {
      const pageIndex=this.props.src.playListURL.findIndex(el =>{
        return parseInt(el.playOrder)===parseInt(newProps.src.currentPageURL.playOrder); 
      });
      this.getResponse(parseInt(pageIndex), true, 'propChanged', this.scrollWindowTop);
    }
  };
  handleMove = () =>{
    const fixed = $('.headerBar');
    const currentFixedDivPosition = fixed.height() + $(window).scrollTop() +250;
    let elementPos;
    const pageBreakClass = $('#book-render-component').find('.pagebreak');
    elementPos = pageBreakClass[0];
    pageBreakClass.each(function (i, s) {
      if (currentFixedDivPosition > Math.abs($(s).offset().top)) {
        elementPos = s;
      }
    });
    const pageVal = ($(elementPos).attr('title')?$(elementPos).attr('title'):$('#pageNum').val());
    this.props.sendPageDetails('pagescroll', pageVal); 
  }

  componentWillUpdate = (nextProps) => {
    
    if (nextProps.src.currentPageURL.pageFragmentId) {
      const scrollTopVal = $('#'+nextProps.src.currentPageURL.pageFragmentId);
      if (scrollTopVal.length > 0) {
        // const topValue = scrollTopVal.offset().top;
        const pageBreakClass = $('#book-render-component').find('.pagebreak');
        const pagenumberArr = {};
        pageBreakClass.each(function (i, s) {
          pagenumberArr[$(s).attr('title')] = $(s).offset().top-100;             
        });
        // this.props.sendPageDetails("pagescroll",scrollTopVal.attr("title")); 
        setTimeout(()=>{
          $('html, body').animate({
            scrollTop: pagenumberArr[scrollTopVal.attr('title')] 
          }, 1500);
        }, 2000);

        setTimeout(()=>{
          nextProps.src.currentPageURL.pageFragmentId = '';
        }, 6500);
        
      }
    }
  }
   
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
    audioWbWHighlight(this);
    const pageBreakClass = $('#book-render-component').find('.pagebreak');
    if (pageBreakClass.length>0) {
      const initPageNo = $(pageBreakClass[0]).attr('title');
      this.props.sendPageDetails('pagescroll', initPageNo);
    }
  };

  render() {
    const zommLevel = this.props.src.pageZoom ? this.props.src.pageZoom + '%' : '100%';
    const fontSize = this.props.src.pageFontSize ? (this.props.src.pageFontSize/3.5) + 'px' : '0.6px';
    return ( 
      <div id = "book-render-component" ref = {(el) => { this.bookComBlock = el; }} tabIndex = "0" onKeyUp = {this.arrowNavigation} >
        <div id={this.props.src.contentId} className={this.props.src.contentId}>
          <div id = "book-container" className = "book-container" ref = {(el) => { this.bookContainerRef = el; }} style={{zoom : zommLevel, fontSize : fontSize}}>
            {!this.state.completeBookLoad ? <RefreshIndicator size={50} left={-20} top={10} status={'loading'} 
            style={{marginLeft: '50%', marginTop: '25%'}} /> :''}
            {this.state.completeBookLoad ?<div dangerouslySetInnerHTML={{__html: this.state.renderSrc}}></div>:''} 
          </div>
        </div>
        {this.state.completeBookLoad ? <FooterNav data = {this.state}  onClickNextCallBack = {this.goToNext} onClickPrevCallBack = {this.goToPrev}/> : ''}
        <div ref = {(el) => { this.drmBlockRef = el; }}> </div >
        <LightBox lightBoxProps={this.state.lightBoxProps}/>
      </div>
    );
  };
};

PageViewer.PropTypes = {
  src: PropTypes.object.isRequired
};
export default PageViewer;
