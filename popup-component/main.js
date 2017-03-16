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

import ComponentOwner from './src/js/Component-owner';

const translations = {
  'fr' : frJson,
  'it' : itJson,
  'nl' : nlJson
};

export default class PopUpComponent {
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
        <ComponentOwner bookUrl = "https://revel-ilp-stg.pearson.com/eps/sanvan/api/item/a44cb95f-8fd9-4b85-ab9f-c69aa8c9f914/100/file/lynn-tac-7e_v4_Revel/OPS/xhtml/ch07_pg0011.xhtml" isFromComponent = {true}  />
      </IntlProvider>,
        document.getElementById(config.contentId)
    );
  };  
};

export PopUp from './src/js/PopUps';
// Listen for client events to initialize a new PopUp Component
document.body.addEventListener('o.InitPopUp', e => new PopUpComponent(e.detail));
