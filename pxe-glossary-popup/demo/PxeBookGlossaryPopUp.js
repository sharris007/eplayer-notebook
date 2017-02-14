import React, {  Component, PropTypes } from 'react';
import BookViewer from './BookViewer';

class PxeBookGlossaryPopUp extends Component {
  constructor(props) {
    super(props);   
    this.state = {
    	bookHTML : '',
    	hi : false
    };
    this.setState({
    	hi : true
    })
  }

  
  
  render() {
    return (<div> 
    	{this.state.hi ?  <div> yyyyyyyyy </div> : <div> xxxxxxxxxxxxxxx </div>}
    	<div id = 'bookDiv'>
    		  <BookViewer renderGlossary = { this.renderGlossary }/>
        </div>

        
        </div>);
  }
  
}

PxeBookGlossaryPopUp.PropTypes = {
}

export default PxeBookGlossaryPopUp;
