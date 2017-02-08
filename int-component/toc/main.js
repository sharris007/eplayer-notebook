import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import frJson from './translations/fr.json';
 //import TableOfContents from './src/js/TableOfContents';
import ComponentOwner from './src/js/component-owner';
import './main.scss';

const translations = {
  'fr' : frJson
};

export default class TableOfContentsComponent {
  constructor(config) {
    addLocaleData(frLocaleData);
    this.init(config);
  }

  init(config) {
    const locale = config.locale ? config.locale : 'en';

    ReactDOM.render(
      <IntlProvider locale={locale} messages={translations[locale]}>
        <ComponentOwner data={config} />
      </IntlProvider>,
      document.getElementById(config.elementId)
    );
  }
}

export TableOfContents from './src/js/TableOfContents';

document.body.addEventListener('o.InitToc', e => new TableOfContentsComponent(e.detail));
