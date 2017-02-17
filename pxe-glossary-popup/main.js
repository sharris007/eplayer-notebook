import './main.scss';

import React, {  Component } from 'react';
import ReactDOM from 'react-dom';
import GlossaryPopUp from './src/js/GlossaryPopUp';
import BookViewer from './demo/BookViewer';


export default class GlossaryPopUpComponent extends Component {
  constructor(props) {
    super(props); 
    this.init(props);
  }

  init=(config)=> {
    ReactDOM.render(
      <div>
          
        <div id = "bookDiv">
          <BookViewer bookUrl = "https://content.openclass.com/eps/pearson-reader/api/item/0c0c9911-1724-41d7-8d05-f1be29193d3c/1/file/qatesting_changing_planet_v2_sjg/changing_planet/OPS/s9ml/chapter02/why_are_age_structures_and_dependency_ratios_important.xhtml"/>
        </div>
       
        <GlossaryPopUp glossaryurl = "https://content.openclass.com/eps/pearson-reader/api/item/0c0c9911-1724-41d7-8d05-f1be29193d3c/1/file/qatesting_changing_planet_v2_sjg/changing_planet/OPS/s9ml/glossary.xhtml" bookDiv = "bookDiv"/> 
 
        </div>,
        document.getElementById(config.contentId)
    );
  };  
};

export GlossaryPopUp from './src/js/GlossaryPopUp';
// Listen for client events to initialize a new Bookshelf component
document.body.addEventListener('o.InitAnnotation', e => new GlossaryPopUpComponent(e.detail));
