/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright ? 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
export const resources = {
  constants: {
    versions       : 'EPLAYER',
    builds         : '2.0',
    TextSearchLimit: 100,
    PiTokenRefreshTimeout:1800,
    secureApi      : true,
    idcDashboardEnabled : true,
    iseEnabled : true,
    zeppelinEnabled     : true,
    isDisableAnnotation : false
  },
  links: {
    legalNotice    : 'https://media.pearsoncmg.com/cmg/NexText/about/legalnotice/index.html',
    privacyPolicy  : 'https://register.pearsoncmg.com/w3c/privacy.htm',
    support        : 'https://media.pearsoncmg.com/cmg/NexText/about/support/index.html',
    permissions    : 'https://media.pearsoncmg.com/cmg/NexText/about/permissions/index.html',
    etextServiceUrl: {
      local        : 'https://etext-dev.pearson.com/api/nextext-api/api',
      dev          : 'https://etext-dev.pearson.com/api/nextext-api/api',
      qa           : 'https://etext-qa-stg.pearson.com/api/nextext-api/api',
      stage        : 'https://etext-stg.pearson.com/api/nextext-api/api',
      prod         : 'https://etext.pearson.com/api/nextext-api/api'
    },
    eTSecureServiceUrl: {
      local        : 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api',
      dev          : 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api',
      qa           : 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api',
      stage        : 'https://etext-stg.pearson.com/api/nextext-api/v1/api',
      prod         : 'https://etext.pearson.com/api/nextext-api/v1/api'
    },
    courseServiceUrl: {
      local        : 'https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot',
      dev          : 'https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot',                          //stpaperapi.dev-prsn.com
      qa           : 'https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot',
      stage        : 'https://stpaperapi.stg-prsn.com/etext/v2/courseboot',
      prod         : 'https://stpaperapi.prd-prsn.com/etext/v2/courseboot'
    },
    etextSearchUrl: {
      local        : 'https://content-service.dev-prsn.com/csg/api/v3/autoComplete',
      dev          : 'https://content-service.dev-prsn.com/csg/api/v3/autoComplete',
      qa           : 'https://content-service-qa.stg-prsn.com/csg/api/v3/autoComplete',
      stage        : 'https://content-service.stg-prsn.com/csg/api/v3/autoComplete',
      prod         : 'https://content-service.prd-prsn.com/csg/api/v3/autoComplete'
    },
    etextSearchMoreResults: {
      local        : 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm',
      dev          : 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm',
      qa           : 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm',
      stage        : 'https://content-service.stg-prsn.com/csg/api/cm',
      prod         : 'https://content-service.prd-prsn.com/csg/api/cm'
    },
    pxeServiceUrl: {
      local        : 'https://pxe-services-dev.pearson.com/services-api/api/3.2',
      dev          : 'https://pxe-services-qa.pearson.com/services-api/api/3.2',
      qa           : 'https://pxe-services-qa-stg.pearson.com/services-api/api/3.2',
      stage        : 'https://pxe-services-stg.pearson.com/services-api/api/3.2',
      prod         : 'https://pxe-services.pearson.com/services-api/api/3.2'
    },
    csgIngestUrl: {
      local        : 'https://dragonfly-qa.stg-openclass.com/pxereader-cm/latest/api/cm',
      qa           : 'https://dragonfly-qa.stg-openclass.com/pxereader-cm/latest/api/cm',
      stage        : 'https://dragonfly.stg-openclass.com/pxereader-cm/latest/api/cm',
      prod         : 'https://dragonfly.openclass.com/pxereader-cm/latest/api/cm'
    },
    piEnvScripts: {
      local        : 'https://tst-piapi.dev-openclass.com/v1/piapi-test/login/js/session.js',
      dev          : 'https://tst-piapi.dev-openclass.com/v1/piapi-test/login/js/session.js',
      qa           : 'https://tst-piapi.dev-openclass.com/v1/piapi-test/login/js/session.js',
      stage        : 'https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js',
      prod         : 'https://pi.pearsoned.com/v1/piapi/login/js/session.js'
    },
    clientId :{
       local       :"I2RJd7eO5F9T6U9TgVK7VxtAgw48u0pU",
      dev          :"I2RJd7eO5F9T6U9TgVK7VxtAgw48u0pU",
      qa           :"I2RJd7eO5F9T6U9TgVK7VxtAgw48u0pU",
      stage        :"I2RJd7eO5F9T6U9TgVK7VxtAgw48u0pU",
      prod         :"mmiGVm0apwEdyZzZieOY5q5su06Ch0kN"
    },
    consoleUrl :{
      local        :"https://console-qa.pearsoned.com",
      dev          :"https://console-qa.pearsoned.com",
      qa           :"https://console-qa.pearsoned.com",
      stage        :"https://console-stg.pearson.com",
      prod         :"https://console.pearson.com",
    },
    piUserProfileApi:{
      local        :"https://pi-tst.pearsoned.com/v1/piapi-test",
      dev          :"https://pi-tst.pearsoned.com/v1/piapi-test",
      qa           :"https://pi-tst.pearsoned.com/v1/piapi-test",
      stage        :"https://int-piapi-internal.stg-openclass.com",
      prod         :"https://piapi-internal.openclass.com",
    },
    authDomainUrl :{
      local        :"https://etext-qa-stg.pearson.com",
      dev          :"https://etext-qa-stg.pearson.com",
      qa           :"https://etext-qa-stg.pearson.com",
      stage        :"https://etext-stg.pearson.com",
      prod         :"https://etext.pearson.com",
    },
    zeppelinUrl : {
      local        :"https://zeppelin-qa.dev-openclass.com/products",
      dev          :"https://zeppelin-qa.dev-openclass.com/products",
      qa           :"https://zeppelin-qa.dev-openclass.com/products",
      stage        :"https://zeppelin.stg-openclass.com/products",
      prod         :"https://product-transaction.openclass.com/products",
    },
    idcUrl : {
      local        :"https://etext-instructor-qa.pearson.com",
      dev          :"https://etext-instructor-qa.pearson.com",
      qa           :"https://etext-instructor-qa.pearson.com",
      stage        :"https://etext-instructor-stg.pearson.com",
      prod         :"https://etext-instructor.pearson.com"
     },
    updateCustomTocUrl : {
      local        :"https://etext-instructor-qa.pearson.com/idc-api/course",
      dev          :"https://etext-instructor-dev.pearson.com/idc-api/course",
      qa           :"https://etext-instructor-qa.pearson.com/idc-api/course",
      stage        :"https://etext-instructor-stg.pearson.com/idc-api/course",
      prod         :"https://etext-instructor.pearson.com/idc-api/course",
    },
    spectrumServiceUrl : {
      local        :"https://spectrum-qa.stg-openclass.com/api/context",
      dev          :"https://spectrum-qa.stg-openclass.com/api/context",
      qa           :"https://spectrum-qa.stg-openclass.com/api/context",
      stage        :"https://spectrum.stg-openclass.com/api/context",
      PERF         :"https://spectrum-ppe.pearsoned.com/api/context",
      prod         :"https://spectrum.openclass.com/api/context"
    },
    iseUrl : {
      local        :"https://etext-ise-qa.pearson.com",
      dev          :"https://etext-ise-qa.pearson.com",
      qa           :"https://etext-ise-qa.pearson.com",
      stage        :"https://etext-ise-stg.pearson.com",
      prod         :"https://etext-ise.pearson.com"
    }
  }
};

export const contentUrl = {
  openClass: {
    local        :"content.stg-openclass.com",
    dev          :"content.stg-openclass.com",
    qa           :"content.stg-openclass.com",
    stage        :"content.stg-openclass.com",
    prod         :"content.openclass.com"
  },
  SecuredUrl: {
    local        :"etext-dev.pearson.com",
    dev          :"etext-dev.pearson.com", //etext-dev.pearson.com
    qa           :"etext-qa-stg.pearson.com",  //etext-qa-stg.pearson.com
    stage        :"etext-stg.pearson.com", //etext-qa-stg.pearson.com
    prod         :"content.openclass.com" //etext.pearson.com
  }
};

export const typeConstants = {

  GET_TOTALANNOTATION    : 'GET_TOTALANNOTATION',
  GET_ANNOTATION         : 'GET_ANNOTATION',
  POST_ANNOTATION        : 'POST_ANNOTATION',
  PUT_ANNOTATION         : 'PUT_ANNOTATION',
  DELETE_LISTANNOTATION  : 'DELETE_LISTANNOTATION',
  GET_PLAYLIST           : 'GET_PLAYLIST',
  GET_TOC                : 'GET_TOC',
  GET_BOOKMARK           : 'GET_BOOKMARK',
  POST_BOOKMARK          : 'POST_BOOKMARK',
  DELETE_BOOKMARK        : 'DELETE_BOOKMARK',
  GET_TOTALBOOKMARK      : 'GET_TOTALBOOKMARK',
  GET_GOTOPAGE           : 'GET_GOTOPAGE',
  ANNOTATION_CREATED     : 'ANNOTATION_CREATED',
  ANNOTATION_UPDATED     : 'ANNOTATION_UPDATED',
  ANNOTATION_DELETED     : 'ANNOTATION_DELETED',
  BOOK_DETAILS           : 'BOOK_DETAILS',
  GET_PREFERENCE         : 'GET_PREFERENCE',
  POST_PREFERENCE        : 'POST_PREFERENCE',
  GET_TOC_RESPONSE       : 'GET_TOC_RESPONSE',
  GETTING_TOC_RESPONSE   :'GETTING_TOC_RESPONSE'
};

export const domain = {
  getLocationOrigin() {
    if (!location.origin) {
      location.origin = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
    }
    return location.origin;
  },
  getEnvType() {
    const locationOrigin = this.getLocationOrigin();

    if (locationOrigin.indexOf('localhost') !== -1)
          { return 'qa'; }
    else if (locationOrigin.indexOf('etext-dev.pearson.com') !== -1)
          { return 'dev'; }
    else if (locationOrigin.indexOf('etext-qa-stg.pearson.com') !== -1)
          { return 'qa'; }
    else if (locationOrigin.indexOf('etext-stg.pearson.com') !== -1)
          { return 'stage'; }
    else if (locationOrigin.indexOf('etext.pearson.com') !== -1)
          { return 'prod'; }
    return 'qa';
  }
};
