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
export const eT1Contants = {
  CERT_SITE_ID: '11444',
  PROD_SITE_ID: '15102',
  MD5_SECRET_KEY: 'ipadsecuretext',
  DEEPLINK_MD5_SECRET_KEY:'reactbanana',
  BOOKSHELF_MD5_SECRET_KEY:'printbanana',
  RegionType : {
    AUDIO : 1,
    CROSS_REFERENCE : 2,
    EMAIL : 3,
    FLASH : 4,
    GLOSSARY_TERM : 5,
    IMAGE : 6,
    INDEX_LINK : 7,
    MEDIA : 8,
    POWERPOINT : 9,
    TOC_LINK : 10,
    URL : 11,
    VIDEO : 12,
    EXCEL : 13,
    PDF : 14,
    WORD_DOC : 15,
    LTILINK : 16,
    IPADAPP : 17,
    JAZZASSET : 18
  },
  LinkType : {
    IMAGE : 1,
    FLV :2,
    GLOSSARY_TERM : 3,
    MP3 : 4,
    PAGE_NUMBER : 5,
    SWF : 6,
    URL : 7,
    EMAIL : 8,
    VIRTUAL_LEARNING_ASSET : 9,
    AUDIO_TEXT_SYNCH : 10,
    LTILINK : 11,
    FACELESSAUDIO : 12,
    H264 : 13,
    IPADAPP : 14,
    CHROMELESS_URL : 15,
    JAZZASSET : 16
  },
  SCENARIOS : {
    S1 : 1,
    S3 : 3,
    S6 : 6,
    S11 : 11,
    S88 : 88
  },
  FoxitUrls : {
    qa: 'https://foxit-qa.gls.pearson-intl.com/foxit-webpdf-web/pc/',
    stage: 'http://foxit-poc.gls.pearson-intl.com/foxit-webpdf-web/pc/',
    prod: 'https://foxit-prod.gls.pearson-intl.com/foxit-webpdf-web/pc/'
  },
  readerApiBaseUrls : {
    QA : 'https://api-sandbox.readerplatform.pearson-intl.com',
    STAGE : 'https://api-sandbox.readerplatform.pearson-intl.com',
    PROD : 'https://api-prod.readerplatform.pearson-intl.com'
  },
  foxitCDNUrl : {
    qa : "https://drlngevdyobo7.cloudfront.net/foxit-webpdf-web/",
    stage: "https://d205uwuz6t2dy1.cloudfront.net/foxit-webpdf-web/",
    prod : "https://d1ubxfsvhe3rl7.cloudfront.net/foxit-webpdf-web/"
  },
  foxiAssetBaseUrl : "https://d38l3k3yaet8r2.cloudfront.net/resources/products/epubs/generated-qa/",
  readerApiResponseRecordsLimits: 1000,
  ServerUrls : {
    qa : {
            CERT1 : 'https://view.cert1.ebookplus.pearsoncmg.com',
            CERT2 : 'https://view.cert2.ebookplus.pearsoncmg.com',
            CERT3 : 'https://view.cert3.ebookplus.pearsoncmg.com'
         },
    stage : {
            PPE1 : 'https://live.ppe1.ebookplus.pearsoncmg.com',
            PPE2 : 'https://live.ppe2.ebookplus.pearsoncmg.com',
            PPE3 : 'https://live.ppe3.ebookplus.pearsoncmg.com'
         },
    prod  : {
            PROD1 : 'https://view.ebookplus.pearsoncmg.com',
            PROD2 : 'https://view.etext.home2.pearsoncmg.com',
            PROD3 : 'https://view.etext.home3.pearsoncmg.com'
        }
  },
  SMSBookshelfBaseUrls :{
    DEV : 'https://sms.bookshelf.dev1.ebookplus.pearsoncmg.com',
    CERT : 'https://sms.bookshelf.cert1.ebookplus.pearsoncmg.com',
    PPE : 'https://sms.bookshelf.ppe1.ebookplus.pearsoncmg.com',
    PROD : 'https://sms.bookshelf.ebookplus.pearsoncmg.com'
  },
  SMSBaseUrls : {
    CERT : 'https://login.cert.pearsoncmg.com/sso/SSOServlet2',
    PPE : 'https://loginppe.pearsoncmg.com/sso/SSOServlet2',
    PROD : 'https://login.pearsoncmg.com/sso/SSOServlet2'
  },
  SITE_IDs : {
    qa : {
      S1 : '11444',
      S3 : '7171',
      S6 : '10063',
      S11 : '11442',
      S88 : '11442'
    },
    stage : {
      S1 : '15102',
      S3 : '9688',
      S6 : '10402',
      S11 : '15107',
      S88 : '15107'
    },
    prod : {
      S1 : '15102',
      S3 : '9688',
      S6 : '10402',
      S11 : '15107',
      S88 : '15107'
    }
  },
  ErrorCodeMessages : {
    Error_1 :'Either you have entered an incorrect username/password, or you do not have a subscription to this site.',
    Error_2 :'Server error occurred. Please try again later.'
  }
};
export default eT1Contants;