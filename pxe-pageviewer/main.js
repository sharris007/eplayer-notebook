import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import PageViewer from './src/js/PageViewer';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class PageViewerComponent {
  constructor(config) {
    this.init(config);
  }

  init=config=>{
    const App = () => (
      <MuiThemeProvider>
         <PageViewer src={config}/>
      </MuiThemeProvider>
     );
    ReactDOM.render(
       <App/>, document.getElementById(config.elementId)
    );
  };  
};

export PageViewer from './src/js/PageViewer';
// Listen for client events to initialize a new PageViewer component
document.body.addEventListener('o.InitPageViewer', e => new PageViewerComponent(e.detail));
