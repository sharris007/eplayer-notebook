import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import renderHTML from 'react-render-html';

import Wrapper from './Wrapper';
import PopupApi from '../api/PopupApi';
import BookViewer from '../../demo/BookViewer';
import {PopUpInfo} from '@pearson-incubator/popup-info';



class ComponentOwner extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      isBookLoaded: false,
      bookHTML: '',
      glossaryResponse: '',
      popUpCollection : []
    };  
    this.divGlossaryRef = '';
    this.Wrapper = null;
    this.init();
  }

  init = () => {  
    PopupApi.getData(this.props.bookUrl).then((response) => {
      return response.text();
    }).then((text) => {
      this.setState({bookHTML : text});
    }).catch((err) => {
      console.debug(err);
    });
  }


  componentDidMount() {
    if (this.props.isFromComponent) {
      let base = {}; 
      base = document.createElement('base');
      base.href = this.props.bookUrl;
      document.getElementsByTagName('head')[0].appendChild(base);
    }
  }

  onBookLoad() {
    const that = this;
    window.renderPopUp = function(popUpCollection) {
      that.setState({
        'popUpCollection':popUpCollection
      });
    }
    this.Wrapper = new Wrapper({'divGlossaryRef' : this.divGlossaryRef, 'basePath' : this.props.bookUrl, 'bookDiv' : 'bookDiv', node:this.bookViewerRef.frame});
    this.Wrapper.bindPopUpCallBacks();    
  }

  render() {    
    return (
        <div> 
        <div id = "bookDiv">
          {this.state.bookHTML ? <BookViewer bookHTML = {this.state.bookHTML} onBookLoad = {this.onBookLoad.bind(this)} basePath={this.props.bookUrl} ref={(e)=>{this.bookViewerRef=e;}} /> : ''}
        </div>  
        <div>     
          <div>{(this.state.popUpCollection.length > 0) ? <PopUpInfo popUpCollection = {this.state.popUpCollection} bookId = "bookDiv" node={document.getElementById('contentIframe')}/> : ''}</div>
          <div id= "divGlossary" ref = {(dom) => { this.divGlossaryRef = dom }} style = {{ display: 'none' }}> {renderHTML(this.state.glossaryResponse)} </div>
        </div>  
        </div>
    )
  }
}

ComponentOwner.PropTypes = {
  bookUrl: PropTypes.string.isRequired
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
