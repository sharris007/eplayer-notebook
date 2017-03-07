import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';

import MoreInfoPopUp from './MoreInfoPopUp';
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
          <BookViewer bookUrl = {this.props.bookUrl} onBookLoad = {() => this.onBookLoad()} isFromComponent = {true}/>
        </div>  
        <div>     
          {this.state.isBookLoaded ? <MoreInfoPopUp bookDiv = "bookDiv"/> : ''}
        </div>  
        </div>
    )
  }
}

ComponentOwner.PropTypes = {
  bookUrl: PropTypes.string.isRequired
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
