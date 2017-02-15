import './main.scss';

import React, {  Component } from 'react';
import ReactDOM from 'react-dom';
import MoreInfoPopUp from './src/js/MoreInfoPopUp';
import BookViewer from './demo/BookViewer';


export default class MoreInfoPopUpComponent extends Component {
  constructor(props) {
    super(props); 
    this.init(props);
  }

  init=(config)=> {
    ReactDOM.render(
    	<div>
          
        <div id = "bookDiv">
    		  <BookViewer/>
        </div>
       
        <MoreInfoPopUp  bookDiv = "bookDiv"/> 
 
        </div>,
        document.getElementById(config.contentId)
    );
  };  
};

export MoreInfoPopUp from './src/js/MoreInfoPopUp';
// Listen for client events to initialize a new Bookshelf component
document.body.addEventListener('o.InitAnnotation', e => new MoreInfoPopUpComponent(e.detail));
