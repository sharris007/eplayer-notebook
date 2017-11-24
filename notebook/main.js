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

export default class NoteBookComponent {
  constructor(config) {
    addLocaleData(frLocaleData);
    this.init(config);
  }

  init=config=>{
    const locale = config.locale ? config.locale : 'en';
    const App = () => (
      <IntlProvider locale={locale}>
        <MuiThemeProvider>
          <ComponentOwner  lists={config.lists} callback={config.callback}/>
        </MuiThemeProvider>
      </IntlProvider>
     );
    ReactDOM.render(
       <App/>, document.getElementById(config.elementId)
    );
  };  
};

export NoteBook from './src/js/NoteBook';
// Listen for client events to initialize a new NoteBook component
document.body.addEventListener('o.InitNoteBook', e => new NoteBookComponent(e.detail));
