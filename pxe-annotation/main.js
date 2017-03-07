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
                    currentPageDetails={config.currentPageDetails} />,
        document.getElementById(config.elementId)
    );
  };  
};

export Annotation from './src/js/Annotation';
// Listen for client events to initialize a new Bookshelf component
document.body.addEventListener('o.InitAnnotation', e => new AnnotationComponent(e.detail));
