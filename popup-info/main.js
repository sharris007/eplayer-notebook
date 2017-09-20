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

export default class PopUpInfoComponent {
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
        <ComponentOwner bookUrl = "https://content.stg-openclass.com/eps/pearson-reader/api/item/9966a550-e4b6-11e5-b24e-c3e4bddda174/1/file/hap10_mathjaxfix_headfoot_071415LS/OPS/s9ml/chapter02/filep7000496138000000000000000000e2b.xhtml" isFromComponent = {true} ParagraphNumeroUno = {config.ParagraphNumeroUno} isPxeContent={config.isPxeContent}/>
      </IntlProvider>,
        document.getElementById(config.contentId)
    );
  };  
};
export CustomPopUp from './src/js/CustomPopUp';
export PopUpInfo from './src/js/PopUpInfo';
// Listen for client events to initialize a new PopUp Component
document.body.addEventListener('o.InitPopUpInfo', e => new PopUpInfoComponent(e.detail));
