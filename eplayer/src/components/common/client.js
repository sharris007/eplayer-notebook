/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
import contentful from 'contentful';  // eslint-disable-line import/no-extraneous-dependencies
import axios from 'axios';
import eT1Contants from './et1constants';


export const clients = {
  readerApi: {
    qa: axios.create({
      baseURL: eT1Contants.spectrumApiBaseUrls.QA,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    stage: axios.create({
      baseURL: eT1Contants.spectrumApiBaseUrls.STAGE,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    prod: axios.create({
      baseURL: eT1Contants.spectrumApiBaseUrls.PROD,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },

  /* getLogin: axios.create({
    baseURL: 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api',
    timeout: 20000
  }),
*/

  scapi: axios.create({
    baseURL: 'https://scapi-dev-use.pearsoncms.net/sc-api/apis',
    timeout: 5000,
    headers: {
    }
  }),
  etext: axios.create({
   // baseURL: 'https://etext-stg.pearson.com/api/nextext-api/api/nextext',
    baseURL: 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
    timeout: 5000,
    headers: {
    }
  }),

  panera: contentful.createClient({
    space: '415o8j07ef07',
    accessToken: 'f80e9320e96f0eabbb2aac94a71755160a538cb989bdf6a8701cf2c229ce20e6'
  }),
  redlob: contentful.createClient({
    space: '7te8ye58mdt7',
    accessToken: '5d348c4b749eab4dadc7c196bbc48c4095af1686b6a3a545572f25596eba1d76'
  }),
  tokyojoes: contentful.createClient({
    space: 'tbx6i45kvpo5',
    accessToken: 'ddaa1c7c0ebfd27bfacbe8aa5422becf25a444a3bc415cdb0011e06e22f9189a'
  })
};

export default clients.tokyojoes;