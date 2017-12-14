import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import ComponentOwner from './src/js/component-owner';

export default class AnnotationComponent {
  constructor(config) {
    this.init(config);
  }

  init=config=>{
    ReactDOM.render(
        <ComponentOwner contentId={config.contentId} annotationData={config.annotationData} 
                    shareableAnnotations={config.shareableAnnotations} annotationEventHandler={config.annotationEventHandler} 
                    currentPageDetails={config.currentPageDetails} annAttributes={config.annAttributes} 
                    bookUrl = "https://content.stg-openclass.com/eps/pearson-reader/api/item/d882cf78-3ccd-4415-99d9-54976c6b993e/1/file/AmermanHAP1-071415-MJ-DW/OPS/s9ml/chapter01/filep700049662800000000000000000d54e.xhtml"
                    isFromComponent = {true}/>,
        document.getElementById(config.elementId)
    );
  };  
};

export Annotation from './src/js/Annotation';
// Listen for client events to initialize a new Annotation component
document.body.addEventListener('o.InitAnnotation', e => new AnnotationComponent(e.detail));
