import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import PageViewer from './src/js/PageViewer';

export default class PageViewerComponent {
  constructor(config) {
    this.init(config);
  }

  init=config=>{
    ReactDOM.render(
        <PageViewer src={config.urlsJson} sendPageDetails={config.sendPageDetails}/>,
        document.getElementById(config.elementId)
    );
  };  
};

export PageViewer from './src/js/PageViewer';
// Listen for client events to initialize a new PageViewer component
document.body.addEventListener('o.InitPageViewer', e => new PageViewerComponent(e.detail));
