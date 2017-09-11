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
  FOXIT_HOST_URL: 'https://foxit-qa.gls.pearson-intl.com/foxit-webpdf-web/pc/',
  CERT_SITE_ID: '11444',
  PROD_SITE_ID: '15102',
  MD5_SECRET_KEY: 'reactbanana',
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
  ServerUrls : {
    qa : {
            CERT1 : 'https://view.cert1.ebookplus.pearsoncmg.com',
            CERT2 : 'https://view.cert2.ebookplus.pearsoncmg.com',
            CERT3 : 'https://view.cert3.ebookplus.pearsoncmg.com'
         },
    stage : {
            CERT1 : 'https://view.cert1.ebookplus.pearsoncmg.com',
            CERT2 : 'https://view.cert2.ebookplus.pearsoncmg.com',
            CERT3 : 'https://view.cert3.ebookplus.pearsoncmg.com'
         }
  }
};
export default eT1Contants;
