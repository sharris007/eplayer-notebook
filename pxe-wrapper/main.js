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

export default class PxeWrapperComponent {
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
        <ComponentOwner bookUrl = "https://content.stg-openclass.com/eps/pearson-reader/api/item/e460baf9-c83c-4519-b9ff-1de4a387d109/1/file/donatelle_ketchum-ath-15e_v5_SPI_062017/OPS/xhtml/ch10_pg0003.xhtml" isFromComponent = {true}  />
      </IntlProvider>,
        document.getElementById(config.contentId)
    );
  };  
};

export Wrapper from './src/js/Wrapper';
// Listen for client events to initialize a new Wrapper Component
document.body.addEventListener('o.InitWrapper', e => new PxeWrapperComponent(e.detail));

/*
https://content.stg-openclass.com/eps/pearson-reader/api/item/c9cb03c3-d1a4-441e-afa9-a88061ee0076/1/file/donatelle_ketchum-ath-15e_v5_SPI_062017/OPS/xhtml/ch06_pg0010.xhtml ------------- rear note

https://content.stg-openclass.com/eps/pearson-reader/api/item/e460baf9-c83c-4519-b9ff-1de4a387d109/1/file/donatelle_ketchum-ath-15e_v5_SPI_062017/OPS/xhtml/ch10_pg0003.xhtml ------------- rear note

https://content.stg-openclass.com/eps/pearson-reader/api/item/3e6ea386-cd63-43eb-bfa9-de3c2f4e13e8/100/file/Bledsoe_Vol1/OPS/s9ml/chapter01/filep70010122960000000000000000006fc.xhtml ---------- noteref_bibloref

https://content.stg-openclass.com/eps/pearson-reader/api/item/78e0830a-c187-4a9b-b1a7-f728e14f101f/1/file/Blake3-082715-MJ-CM-CSS/OPS/s9ml/chapter01/filep7000496622000000000000000000eb8.xhtml

https://etext.pearson.com/eps/pearson-reader/api/item/41a45147-8f4e-4420-b4d3-961441119580/1/file/HessPGALA12-060216-MJ-DW/OPS/s9ml/imported_files01/filep7001011641000000000000000002c30.xhtml ------------ noteref_footnote

https://content.stg-openclass.com/eps/pearson-reader/api/item/591fb53c-a53a-47d8-b32e-f2b850403061/1/file/nay4_5-25a_post/OPS/s9ml/chapter01/filep7000499443000000000000000000c87.xhtml  ------------------- bibloref

*/
