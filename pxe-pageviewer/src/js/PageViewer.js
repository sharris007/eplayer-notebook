import '../scss/pageviewer.scss';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
//import RaisedButton from 'material-ui/RaisedButton';
//import TextField from 'material-ui/TextField';

import renderHTML from 'react-render-html';
import FooterNav from './FooterNav'

class PageViewer extends React.Component {
  //
  // Modify or add prop types to validate the properties passed to this component!
  // This is defined using an ES7 class property (transpiled by Babel Stage 0)
  //
  constructor(props) {
    super(props);
    this.init(props);
    //this.print = this.print.bind(this);
  };
  init = (props) => {
    const initPage=this.props.src.currentPageURL?this.props.src.currentPageURL.playOrder:'';
    this.state = {
      renderSrc:'',
      currentPage:initPage?initPage:1,
      goTo:'',
      pageNoDetails:'',
      isFirstPage:initPage === 1,
      isLastPage: initPage === this.props.src.playListURL[this.props.src.playListURL.length-1].playOrder,
      prevPageTitle:(initPage <= 1)?'':this.props.src.playListURL[initPage-2].title,
      nextPageTitle:(initPage === this.props.src.playListURL[this.props.src.playListURL.length-1].playOrder)?'':this.props.src.playListURL[initPage].title
    };

    this.getResponse(this.state.currentPage, true, 'initPage', this.scrollWindowTop);
  };
  scrollWindowTop = () => {
    window.scroll(0, 0);
  };
  componentWillReceiveProps(newProps) {
    if (parseInt(this.props.src.currentPageURL.playOrder) !== parseInt(newProps.currentPageURL.playOrder)) {
      this.getResponse(parseInt(newProps.currentPageURL.playOrder), true, 'propChanged', this.scrollWindowTop);
    }
  };

  getRequestedPageUrl = (playOrder) => {
    const thisRef=this;
    return thisRef.props.src.playListURL.filter((el) => {
      return el.playOrder === playOrder;
    });
  };

  getResponse = (currentPage, isInitOrGo, goToPage, scrollWindowTopCallBack) => {
    const thisRef=this;
    currentPage=currentPage+(isInitOrGo?0:thisRef.state.currentPage);
    thisRef.props.src.sendPageDetails(goToPage, thisRef.getRequestedPageUrl(currentPage)[0]);
    const url= thisRef.props.src.baseUrl + thisRef.getRequestedPageUrl(currentPage)[0].href;
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
      thisRef.setState({
        renderSrc:text,
        currentPage:currentPage,
        isFirstPage: currentPage <= 1,
        isLastPage: currentPage >= this.props.src.playListURL[this.props.src.playListURL.length-1].playOrder,
        prevPageTitle:(currentPage <= 1)?'':this.props.src.playListURL[currentPage-2].title,
        nextPageTitle:(currentPage === this.props.src.playListURL[this.props.src.playListURL.length-1].playOrder)?'':this.props.src.playListURL[currentPage].title
      });
      //callback
      scrollWindowTopCallBack();
    }).catch((err) => {
      console.log(err);
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
    this.setState({goTo: e.target.value});
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
  enablePageNo  = () => {
    const pageDetails = document.getElementsByClassName('pagebreak');
    for (let j=0; j< pageDetails.length; j++) {
      console.log('page details Hypothesis', pageDetails[j]);
      pageDetails[j].innerHTML=pageDetails[j].title;
      pageDetails[j].style.position = 'absolute';
      pageDetails[j].style.left = '-77px';
      pageDetails[j].style.transform = 'rotate(-90deg)';
    }
  }
  createHtmlBaseTag = () => {
    const base = document.createElement('base');
    base.href = this.props.src.baseUrl + this.getRequestedPageUrl(this.state.currentPage)[0].href;
    document.getElementsByTagName('head')[0].appendChild(base);
  }
  componentDidUpdate() {
    this.enablePageNo();
  };
  componentDidMount() {
    this.createHtmlBaseTag();
  };

  render() {
    return (
      <div id="book-render-component" tabIndex="0"  onKeyUp={this.arrowNavigation}>
        <div className="book-container">{renderHTML(this.state.renderSrc)}</div>
        <FooterNav data={this.state} onClickNextCallBack={this.goToNext} onClickPrevCallBack={this.goToPrev}/>
      </div>
    );
  };
  //<div className="goto-group"> <TextField hintText="Page No" value={this.state.goTo} onChange={(e) => this.updateGoTo(e)} onKeyDown = {(e) => this.goToKeyUp(e)}/><RaisedButton label="Go.." secondary={true} onClick={() => this.handlerGoEvent()}/> </div>
};

PageViewer.PropTypes = {
  src:PropTypes.object.isRequired
};

export default PageViewer;
