import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  indigo900, indigo700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { IntlProvider, addLocaleData } from 'react-intl';
import throttle from 'lodash';

import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import { languages } from '../locale_config/translations/index';
import languageName from '../locale_config/configureLanguage';
import { saveState, loadState } from './localStorage';

const RedBox = require('redbox-react').default;


//= =======================================================
// Locale Setup
//= =======================================================
let languageid;
const url = window.location.href;
const n = url.search('languageid');
if (n > 0) {
  const urlSplit = url.split('languageid=');
  languageid = Number(urlSplit[1]);
} else {
  languageid = 1;
}
const locale = languageName(languageid);
const { messages } = languages.translations[locale];
const localisedData = locale.split('-')[0];
addLocaleData((require(`react-intl/locale-data/${localisedData}`))); // eslint-disable-line import/no-dynamic-require

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const store = createStore(initialState);
const routes = require('./routes/index').default(store);
/*Subscribed store to listen to state chages and storing them in local storage*/
store.subscribe(() => {
  throttle( saveState({
    login : store.getState().login,
    bookshelf : store.getState().bookshelf,
    book : store.getState().book
  }) , 1000)
 
} );
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const theme = getMuiTheme({
    spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
      primary1Color: '#005a70',
      primary2Color: indigo700,
      primary3Color: grey400,
      accent1Color: pinkA200,
      accent2Color: grey100,
      accent3Color: grey500,
      textColor: darkBlack,
      alternateTextColor: white,
      canvasColor: white,
      borderColor: grey300,
      disabledColor: fade(darkBlack, 0.3),
      pickerHeaderColor: indigo900,
      clockCircleColor: fade(darkBlack, 0.07),
      shadowColor: fullBlack
    }
  });

  ReactDOM.render(
    <MuiThemeProvider muiTheme={theme}>
      <IntlProvider locale={locale} messages={messages}>
        <AppContainer store={store} routes={routes} />
      </IntlProvider>
    </MuiThemeProvider>,
    MOUNT_NODE
  );
};

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEV__) {
  if (window.devToolsExtension) {
    // window.devToolsExtension.open()
  }
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      })
    );
  }
}

// ========================================================
// Go!
// ========================================================
render();
