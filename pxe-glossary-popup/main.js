import './main.scss';

import React, {  Component } from 'react';
import ReactDOM from 'react-dom';
import GlossaryPopUp from './src/js/GlossaryPopUp';
import BookViewer from './demo/BookViewer';


export default class GlossaryPopUpComponent extends Component {
  constructor(props) {
    super(props); 
  	/*this.state = { renderGlossaryComponent1 : false};
    this.renderGlossary = this.renderGlossary.bind(this);*/
    this.init(props);
  }


  renderGlossary()  {
    /*this.setState({
      renderGlossaryComponent1: !this.state.renderGlossaryComponent1
    });*/
  }

  init=(config)=>{
    ReactDOM.render(
    	<div>
        <div id = "bookDiv">
    		  <BookViewer renderGlossary = {this.renderGlossary} />
        </div>
        <GlossaryPopUp glossaryurl = "https://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/OPS/s9ml/glossary/filep7000496728000000000000000005a08.xhtml#P7000496728000000000000000005DA2" bookDiv = "bookDiv"/> 
        </div>,
        document.getElementById(config.contentId)
    );
  };  
};

export GlossaryPopUp from './src/js/GlossaryPopUp';
// Listen for client events to initialize a new Bookshelf component
document.body.addEventListener('o.InitAnnotation', e => new GlossaryPopUpComponent(e.detail));
