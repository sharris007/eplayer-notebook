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
import {resources , domain ,typeConstants} from './Settings';
const pxeServiceUrl = resources.links.pxeServiceUrl[domain.getEnvType()];
const spectrumServiceUrl = resources.links.spectrumServiceUrl[domain.getEnvType()];
export const pageDetails = {
  renderId: 'pxeViewer',
  locale: 'en-us',
  copyImages: false,
  copyCharLimit: 10,
  crossRefSettings: 'lightbox',
  enablePrintOption: false,
  showPageNo: true,
  orientation: 'horizontal',
  theme: 'black',
  pageFontSize: '56%',
  pageZoom: '',
  enableGoToPage: false,
  includeMathMLLib: true,
  enableAnnotation: true,
  annotationShareable: true,
  clearSearchHighlights: true,
  elementId: 'demo',
  pdfSearch: false,
  allowLightboxFullscreen: false,
  highlightText: 'Deductive reasoning',
  contentId: 'pxe-viewer',
  baseUrl: 'https://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/',
  playListURL: '',
  currentPageURL: '',
  bgColor: 'White',
  isAnnotationHide: false,
  endPoints: {
    services: pxeServiceUrl,
    spectrumServices: spectrumServiceUrl,
    search: 'https://content-service.dev-prsn.com/csg',
    pi: '',
    ingest: 'http://dragonfly.dev-openclass.com/pxereader-cm/api/cm'
  }
};

export const customAttributes = {
  playOrder: 'playOrder',
  href: 'href',
  createdTimestamp: 'createdTimestamp',
  updatedTimestamp: 'updatedTimestamp',
  text: 'text',
  user: 'user',
  context: 'context',
  ranges: 'ranges',
  quote: 'quote',
  shareable: 'shareable'
};

export const pageLoadData = {
  originatingSystemCode: 'ETEXT',
  activities: [{
         'messageTypeCode': 'UserLoadsContent',
         messageVersion: '1.0.0',
         namespace: 'common',
         'payload': {
                 'environmentCode': 'Dev',
                 messageTypeCode: 'UserLoadsContent',
                 'originatingSystemCode': 'ETEXT',
                 'namespaceCode': 'Common',
                 'messageVersion': '1.0.0',
                 transactionDt: '',
                 messageTransferType: 'LiveStream',
                 messageId: '',
                 'appId': 'ETEXT',
                 accessedUsingAppId: 'WebApp',
                 'appActivityAreaCode': 'Learning',
                 'personId': '',
                 'personIdType': 'PI',
                 'personRoleCode': 'Instructor',
                 'organizationId': '',
                 organizationIdType: 'Organization',
                 courseId: '',
                 courseIdType: 'Registrar',
                 courseSectionId: '',
                 'courseSectionIdType': 'Registrar',
                 'timeCategorization': 'Learning',
                 contentId: '',
                 'contentIdType': 'ETEXT',
                 timeOnTaskUuid: '',
                 loadDt: '',
                 datetimeSourceCode: 'Client',
                 'userAgent': '',
                 'deviceType': 'Desktop',
                 'operatingSystemCode': ''
               }
       }]
};

export const pageUnLoadData = {
  originatingSystemCode: 'ETEXT',
  activities: [{
         'messageTypeCode': 'UserUnloadsContent',
         'messageVersion': '1.0.0',
         namespace: 'common',
         'payload': {
                 'environmentCode': 'Dev',
                 'messageTypeCode': 'UserUnloadsContent',
                 originatingSystemCode: 'ETEXT',
                 namespaceCode: 'Common',
                 'messageVersion': '1.0.0',
                 'transactionDt': '',
                 messageTransferType: 'LiveStream',
                 'messageId': '',
                 appId: 'ETEXT',
                 'accessedUsingAppId': 'WebApp',
                 appActivityAreaCode: 'Learning',
                 'personId': '',
                 personIdType: 'PI',
                 'personRoleCode': 'Instructor',
                 'organizationId': '',
                 organizationIdType: 'Organization',
                 'courseId': '',
                 courseIdType: 'Registrar',
                 'courseSectionId': '',
                 courseSectionIdType: 'Registrar',
                 timeCategorization: 'Learning',
                 contentId: '',
                 contentIdType: 'ETEXT',
                 timeOnTaskUuid: '',
                 unloadDt: '',
                 datetimeSourceCode: 'Client',
                 'userAgent': '',
                 deviceType: 'Desktop',
                 'operatingSystemCode': ''
               }
       }]
};

  // CDN from CDNJS Domain
export const mathJaxVersions = {
  '2.4':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.4.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5.1':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5.2':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5.3':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.6':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.6.1':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
};

 //Fallback to Mathjax CDN
export const mathJaxCdnVersions = {
  '2.4':'//cdn.mathjax.org/mathjax/2.4-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5.1':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5.2':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.5.3':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.6':'//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  '2.6.1':'//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
};