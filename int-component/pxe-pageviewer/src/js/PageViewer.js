import '../scss/pageviewer.scss';
import React, {PropTypes} from 'react';
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

  };
  init = (props) => {
    const initPage=this.props.currentPlayList?this.props.currentPlayList.playOrder:'';
    this.state = {
      renderSrc:'', 
      currentPage:initPage?initPage:1, 
      goTo:'', 
      isFirstPage:initPage === 1,
      isLastPage: initPage === this.props.src.playList[this.props.src.playList.length-1].playOrder,
      prevPageTitle:(initPage <= 1)?'':this.props.src.playList[initPage-2].title,
      nextPageTitle:(initPage === this.props.src.playList[this.props.src.playList.length-1].playOrder)?'':this.props.src.playList[initPage].title
    };
    
    this.getResponse(this.state.currentPage, true);
  };

  componentWillReceiveProps(newProps) {
    if (this.props.currentPlayList.playOrder != parseInt(newProps.currentPlayList.playOrder)) {
      this.getResponse(parseInt(newProps.currentPlayList.playOrder), true);
    }   
    
  };


  getRequestedPageUrl = (playOrder) => {
    const thisRef=this;
    return thisRef.props.src.playList.filter((el) => {
      return el.playOrder === playOrder;
    });
  }; 

  getResponse = (currentPage, isInitOrGo, goToPage) => {
    const thisRef=this;
    currentPage=currentPage+(isInitOrGo?0:thisRef.state.currentPage);
    thisRef.props.sendPageDetails(goToPage, thisRef.getRequestedPageUrl(currentPage)[0]);
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
        isLastPage: currentPage >= this.props.src.playList[this.props.src.playList.length-1].playOrder,
        prevPageTitle:(currentPage <= 1)?'':this.props.src.playList[currentPage-2].title,
        nextPageTitle:(currentPage === this.props.src.playList[this.props.src.playList.length-1].playOrder)?'':this.props.src.playList[currentPage].title
      });
    }).catch((err) => {
      console.log(err);
    });
  }
  
  goToNext = () => {
    this.getResponse(1, false, 'Next');
    //this.props.sendPageDetails('Next', this.props.src.playList[this.state.currentPage]);
  };

  goToPrev = () => {
    this.getResponse(-1, false, 'Prev');
    //this.props.sendPageDetails('Prev', this.props.src.playList[this.state.currentPage-2]);
  };

  handlerGoEvent = () => {
    this.getResponse(parseInt(this.state.goTo), true, 'Goto');
    //this.props.sendPageDetails('Goto', this.props.src.playList[this.state.goTo-1]);
  };

  updateGoTo = (e) => {
    this.setState({goTo: e.target.value});
  };

  goToKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.updateGoTo(e);
      this.getResponse(parseInt(this.state.goTo), true);
      //this.props.sendPageDetails('Goto', this.props.src.playList[this.state.goTo-1]);
    }
  };
  arrowNavigation = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
      if (e.keyCode === 37 && !this.state.isFirstPage) {
        this.goToPrev();
      } else if (!this.state.isLastPage) {
        this.goToNext();
      }
      window.scroll(0, 0);
    }
  }
  render() {
    return (
      <div id="book-render-component" tabIndex="0"  onKeyUp={this.arrowNavigation}>
        <div className="book-container">{renderHTML(this.state.renderSrc)}</div>
        <FooterNav data={this.state} onClickNextCallBack={this.goToNext} onClickPrevCallBack={this.goToPrev}/>
      </div>
    );
  };
  //   <div className="goto-group"> <TextField hintText="Page No" value={this.state.goTo} onChange={(e) => this.updateGoTo(e)} onKeyDown = {(e) => this.goToKeyUp(e)}/><RaisedButton label="Go.." secondary={true} onClick={() => this.handlerGoEvent()}/> </div>
};

PageViewer.PropTypes = {
  src:PropTypes.object.isRequired
};

export default PageViewer;