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

export default class GlossaryPopUpComponent {
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
        <ComponentOwner bookUrl = "https://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/OPS/s9ml/chapter02/filep7000496728000000000000000000cae.xhtml" 
        glossaryurl= "https://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/OPS/s9ml/glossary/filep7000496728000000000000000005a08.xhtml" />
      </IntlProvider>,
        document.getElementById(config.contentId)
    );
  };  
};

export GlossaryPopUp from './src/js/GlossaryPopUp';
// Listen for client events to initialize a new GlossaryPopUp Component
document.body.addEventListener('o.InitGlossaryPopUp', e => new GlossaryPopUpComponent(e.detail));
