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

export default class PxePlayerComponent {
  constructor(config) {
    addLocaleData(frLocaleData);
    this.init(config);
  }

  init=config=>{
    const locale = config.pageDetails.locale ? config.pageDetails.locale : 'en';
    const App = () => (
      <IntlProvider locale={locale}>
        <MuiThemeProvider>
          <ComponentOwner bootstrapParams={config} applnCallback={config.applnCallback} />
        </MuiThemeProvider>
      </IntlProvider>
     );
    ReactDOM.render(
       <App/>, document.getElementById(config.pageDetails.elementId)
    );
  };  
};

export PxePlayer from './src/js/PxePlayer';
// Listen for client events to initialize a new PxePlayer component
document.body.addEventListener('o.InitPxePlayer', e => new PxePlayerComponent(e.detail));
