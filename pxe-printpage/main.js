import React from 'react';
import ReactDOM from 'react-dom';
// i18n, set up for French out-of-the-box
import {addLocaleData, IntlProvider} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';

import PrintPage from './src/js/PrintPage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

export default class PrintPageComponent {
  constructor(config) {
    addLocaleData(frLocaleData);
    this.init(config);
  }

  init=config=>{
    const locale = config.locale ? config.locale : 'en';
    const App = () => (
      <IntlProvider locale={locale}>
        <MuiThemeProvider>
          <PrintPage /> 
        </MuiThemeProvider>
      </IntlProvider>
     );
    ReactDOM.render(
       <App/>, document.getElementById(config.elementId)
    );
  };  
};

export PrintPage from './src/js/PrintPage';
// Listen for client events to initialize a Notew PageViewer component
document.body.addEventListener('o.InitPageViewer', e => new PrintPageComponent(e.detail));
