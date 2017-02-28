import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';

import GlossaryPopUp from './GlossaryPopUp';
import BookViewer from '../../demo/BookViewer';


class ComponentOwner extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      isBookLoaded: false
    };   
  }

  onBookLoad() {
    this.setState({
      isBookLoaded : true
    })
  }

  render() {    
    return (
        <div> 
        <div id = "bookDiv">
          <BookViewer bookUrl = {this.props.bookUrl} onBookLoad = {this.onBookLoad.bind(this)}/>
        </div>  
        <div>     
          {this.state.isBookLoaded ? <GlossaryPopUp bookDiv = "bookDiv"/> : ''}
        </div>  
        </div>
    )
  }
}

ComponentOwner.PropTypes = {
  bookUrl: PropTypes.string.isRequired,
  glossaryurl: PropTypes.string.isRequired
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
