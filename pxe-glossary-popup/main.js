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
        <ComponentOwner bookUrl = "https://content.openclass.com/eps/pearson-reader/api/item/0c0c9911-1724-41d7-8d05-f1be29193d3c/1/file/qatesting_changing_planet_v2_sjg/changing_planet/OPS/s9ml/chapter02/why_are_age_structures_and_dependency_ratios_important.xhtml"  />
      </IntlProvider>,
        document.getElementById(config.contentId)
    );
  };  
};

export GlossaryPopUp from './src/js/GlossaryPopUp';
// Listen for client events to initialize a new GlossaryPopUp Component
document.body.addEventListener('o.InitGlossaryPopUp', e => new GlossaryPopUpComponent(e.detail));
