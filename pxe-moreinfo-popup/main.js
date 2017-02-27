import './main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { addLocaleData, IntlProvider } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import itLocaleData from 'react-intl/locale-data/it';
import nlLocaleData from 'react-intl/locale-data/nl';
import frJson from './translations/fr.json';
import itJson from './translations/it.json';
import nlJson from './translations/nl.json';

import ComponentOwner from './src/js/component-owner';

const translations = {
  'fr' : frJson,
  'it' : itJson,
  'nl' : nlJson
};


export default class MoreInfoPopUpComponent {
  constructor(props) {
    addLocaleData(frLocaleData);
    addLocaleData(itLocaleData);
    addLocaleData(nlLocaleData);
    this.init(props);
  }

  init=(config)=> {
    const locale = config.locale ? config.locale : 'en';
    ReactDOM.render(
    	<IntlProvider locale={locale} messages={translations[locale]}>
        <ComponentOwner bookUrl = "https://eps.openclass.com/eps/sanvan/api/item/cf1b10a1-e24c-4359-8e74-cfeac4d05e56/102/file/kennedy-tlc-1e-rerelease_update_v2_RR1/OPS/xhtml/ch05_sec_04.xhtml"  />
      </IntlProvider>,
        document.getElementById(config.contentId)
    );
  };  
};

export MoreInfoPopUp from './src/js/MoreInfoPopUp';
// Listen for client events to initialize a new MoreInfoPopUp component
document.body.addEventListener('o.InitMoreInfoPopUp', e => new MoreInfoPopUpComponent(e.detail));
