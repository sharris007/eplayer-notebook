export const resources = {
  constants: {
    versions       : 'EPLAYER',
    builds         : '2.0',
    TextSearchLimit: 100,
    PiTokenRefreshTimeout:1800,
    secureApi      : true
  },
  links: {
    legalNotice    : 'https://media.pearsoncmg.com/cmg/NexText/about/legalnotice/index.html',
    privacyPolicy  : 'https://register.pearsoncmg.com/w3c/privacy.htm',
    support        : 'https://media.pearsoncmg.com/cmg/NexText/about/support/index.html',
    permissions    : 'https://media.pearsoncmg.com/cmg/NexText/about/permissions/index.html',
    etextServiceUrl: {
      local        : 'https://etext-qa-stg.pearson.com/api/nextext-api/api',
      dev          : 'https://etext-qa-stg.pearson.com/api/nextext-api/api',
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
      local        : 'https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot/courses',
      dev          : 'https://stpaperapi.dev-prsn.com/etext/v2/courseboot/courses',
      qa           : 'https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot/courses',
      stage        : 'https://stpaperapi.stg-prsn.com/etext/v2/courseboot/courses',
      prod         : 'https://stpaperapi.prsn.com/etext/v2/courseboot/courses'
    },
    etextSearchUrl: {
      local        : 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm',
      dev          : 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm',
      qa           : 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm',
      stage        : 'https://content-service.stg-prsn.com/csg/api/cm',
      prod         : 'https://content-service.prd-prsn.com/csg/api/cm'
    },
    pxeServiceUrl: {
      local        : 'https://pxe-services-dev.pearson.com/services-api/api/3.1',
      dev          : 'https://pxe-services-dev.pearson.com/services-api/api/3.1',
      qa           : 'https://pxe-services-qa-stg.pearson.com/services-api/api/3.1',
      stage        : 'https://pxe-services-stg.pearson.com/services-api/api/3.1',
      prod         : 'https://pxe-services.pearson.com/services-api/api/3.1'
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
      stg          : 'https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js',
      prd          : 'https://pi.pearsoned.com/v1/piapi/login/js/session.js'
    },
    clientId :{
      local        :"vGZ2o5WhK7XTy9ovNwtj1aBZhnOAASYb",
      dev          :"vGZ2o5WhK7XTy9ovNwtj1aBZhnOAASYb",
      qa           :"vGZ2o5WhK7XTy9ovNwtj1aBZhnOAASYb",
      stg          :"vGZ2o5WhK7XTy9ovNwtj1aBZhnOAASYb",
      prd          :"AT8R4irZrJRPstMMUdb8XaqOvbRJpqs4",
    },
    consoleUrl :{
      local        :"https://console-qa.pearsoned.com",
      dev          :"https://console-qa.pearsoned.com",
      qa           :"https://console-qa.pearsoned.com",
      stage        :"https://console-stg.pearson.com",
      prd          :"https://console.pearson.com",
    }

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
  ANNOTATION_DELETED     : 'ANNOTATION_DELETED'
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
          { return 'qa'; }
    else if (locationOrigin.indexOf('etext-qa-stg.pearson.com') !== -1)
          { return 'qa'; }
    else if (locationOrigin.indexOf('etext-stg.pearson.com') !== -1)
          { return 'stage'; }
    else if (locationOrigin.indexOf('etext.pearson.com') !== -1)
          { return 'prod'; }
    return 'qa';
  }
};
