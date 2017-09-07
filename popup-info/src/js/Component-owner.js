import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import renderHTML from 'react-render-html';

import PopUpInfo from './PopUpInfo';
import CustomPopUp from './CustomPopUp';
import PopupApi from '../api/PopupApi';
import BookViewer from '../../demo/BookViewer';
import {PopupCallBacks} from './PopupCallBacks';


class ComponentOwner extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      isBookLoaded: false,
      bookHTML: '',
      glossaryResponse: '',
      popUpCollection : [],
      renderCustomPopUp : false
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
    if (this.props.isFromComponent && !this.props.isPxeContent) {
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
    const that = this;
    window.renderCustomPopUp = function(obj) {
      that.setState({renderCustomPopUp : true, popUpCollection : obj.popUpCollection })
    }
    new PopupCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : 'bookDiv', 'ParagraphNumeroUno': this.props.ParagraphNumeroUno, node:this.bookViewerRef.frame, isPxeContent:this.props.isPxeContent });
  }

  render() {    
    return (
        <div> 
        <div id = "bookDiv">
          {this.state.bookHTML ? <BookViewer bookHTML = {this.state.bookHTML} onBookLoad = {this.onBookLoad.bind(this)} basePath={this.props.bookUrl} ref={(e)=>{this.bookViewerRef=e;}} 
            isPxeContent={this.props.isPxeContent}/> : ''}
        </div>  
        <div>     
          <div>{(this.state.renderCustomPopUp) ? <CustomPopUp divGlossaryRef = {this.divGlossaryRef} bookId = "bookDiv" ParagraphNumeroUno = {this.props.ParagraphNumeroUno} popUpCollection = {this.state.popUpCollection} /> : (this.state.isBookLoaded ? <PopUpInfo /> :  '')}</div>
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
