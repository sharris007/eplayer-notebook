import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
// i18n, set up for French out-of-the-box
import {addLocaleData, IntlProvider} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';

import ComponentOwner from './src/js/component-owner';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

export default class PageViewerComponent {
  constructor(config) {
    addLocaleData(frLocaleData);
    this.init(config);
  }

  init=config=>{
    const locale = config.locale ? config.locale : 'en';
    const App = () => (
      <IntlProvider locale={locale}>
        <MuiThemeProvider>
          <ComponentOwner src={config} sendPageDetails={config.sendPageDetails} onBookLoaded={config.onBookLoaded}/>
        </MuiThemeProvider>
      </IntlProvider>
     );
    ReactDOM.render(
       <App/>, document.getElementById(config.elementId)
    );
  };  
};

export PageViewer from './src/js/PageViewer';
// Listen for client events to initialize a new PageViewer component
document.body.addEventListener('o.InitPageViewer', e => new PageViewerComponent(e.detail));
