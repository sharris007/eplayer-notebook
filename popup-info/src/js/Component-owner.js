import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import renderHTML from 'react-render-html';

import PopUpInfo from './PopUpInfo';
import PopupApi from '../api/PopupApi';
import BookViewer from '../../demo/BookViewer';
import {PopupCallBacks} from './PopupCallBacks';


class ComponentOwner extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      isBookLoaded: false,
      bookHTML: '',
      glossaryResponse: ''
    };  
    this.divGlossaryRef = '';
    //this.wrapper = ''
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
    this.setState({
      isBookLoaded : true
    });
    new PopupCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : 'bookDiv'});
  }

  render() {    
    return (
        <div> 
        <div id = "bookDiv">
          {this.state.bookHTML ? <BookViewer bookHTML = {this.state.bookHTML} onBookLoad = {this.onBookLoad.bind(this)} /> : ''}
        </div>  
        <div>     
          <div>{this.state.isBookLoaded ? <PopUpInfo/> : ''}</div>
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
