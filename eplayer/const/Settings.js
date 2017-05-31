export const resources = {
  constants: {
    versions       : 'EPLAYER',
    builds         : '2.0',
    TextSearchLimit: 100,
    secureApi      : false
  },
  links: {
    legalNotice    : 'https://media.pearsoncmg.com/cmg/NexText/about/legalnotice/index.html',
    privacyPolicy  : 'https://register.pearsoncmg.com/w3c/privacy.htm',
    support        : 'https://media.pearsoncmg.com/cmg/NexText/about/support/index.html',
    permissions    : 'https://media.pearsoncmg.com/cmg/NexText/about/permissions/index.html',
    etextServiceUrl: {
      local        : 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
      dev          : 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
      qa           : 'https://etext-qa-stg.pearson.com/api/nextext-api/api/nextext',
      stage        : 'https://etext-stg.pearson.com/api/nextext-api/api',
      prod         : 'https://etext.pearson.com/api/nextext-api/api'
    },
    eTSecureServiceUrl: {
      local        : 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
      dev          : 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
      qa           : 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext',
      stage        : 'https://etext-stg.pearson.com/api/nextext-api/v1/api',
      prod         : 'https://etext.pearson.com/api/nextext-api/v1/api'
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
      local        : 'https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js',
      dev          : 'https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js',
      qa           : 'https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js',
      stg          : 'https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js',
      prd          : 'https://pi.pearsoned.com/v1/piapi/login/js/session.js'
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
    else if (locationOrigin.indexOf('pxe-sdk.dev-openclass.com') !== -1)
          { return 'qa'; }
    else if (locationOrigin.indexOf('pxe-sdk-qa.stg-openclass.com') !== -1)
          { return 'qa'; }
    else if (locationOrigin.indexOf('pxe-sdk.stg-openclass.com') !== -1)
          { return 'stage'; }
    else if (locationOrigin.indexOf('pxe-sdk.pearson.com') !== -1)
          { return 'prod'; }
    return 'local';
  }
};

export const sectionDetails ={"userCourseSectionDetail":{"id":"ffffffff58fdd656e4b0f4a32d3aabcc","status":"active","authgroupid":"a783c9d2-131e-488a-847b-ecf4e9d0031a","authgrouptype":"student","createdDate":1493034171404,"updatedDate":1493034171404,"section":{"sectionId":"58edecc2e4b01da81434fc2d","sectionTitle":"Temple History","sectionCode":null,"sectionStatus":"active","courseId":"58edecc2e4b01da81434fc2c","courseType":"REVEL","startDate":1492079400000,"endDate":1493548200000,"avatarUrl":"https://revel-stg.pearson.com/eps/sanvan/api/item/44a81d40-ea11-11e5-9928-8f65706ce9df/1/file/judge-c-3e_v2_combined_111615/OPS/public/images/catalog.jpg","extras":{"organizationId":"54dbc82a3004d01c8d3b7e8c","metadata":{"externalPairing":false,"productModel":"REVEL","launchUrl":"www.google.com","copyable":true,"brand":{"name":"REVEL","url":"http://www.pearsonhighered.com/revel/students/registration/index.html"}}},"productCodes":["7bfafbbe-9c57-4247-aa1b-779886ee939e"]},"baseUrl":"https://content.stg-openclass.com/eps/pearson-reader/api/item/5a248db3-4564-484b-82b4-40520f2d623b/100/file/ggate30_to_ingest_Mv2/","toc":["https://content.stg-openclass.com/eps/pearson-reader/api/item/5a248db3-4564-484b-82b4-40520f2d623b/100/file/ggate30_to_ingest_Mv2/OPS/toc.ncx","https://content.stg-openclass.com/eps/pearson-reader/api/item/5a248db3-4564-484b-82b4-40520f2d623b/100/file/ggate30_to_ingest_Mv2/OPS/package.opf","https://content.stg-openclass.com/eps/pearson-reader/api/item/5a248db3-4564-484b-82b4-40520f2d623b/100/file/ggate30_to_ingest_Mv2/OPS/xhtml/toc.xhtml"],"authorName":"New book author1484082308685","indexId":"60bd990667de5400753eba86f739f0c8","bookCoverImageUrl":"https://content.stg-openclass.com/eps/pearson-reader/api/item/5a248db3-4564-484b-82b4-40520f2d623b/100/file/ggate30_to_ingest_Mv2/OPS/images/cover.jpg"},"passportPermissionDetail":{"userId":"x-urn:pi:ffffffff58fdd656e4b0f4a32d3aabcc","productId":"x-urn:revel:7bfafbbe-9c57-4247-aa1b-779886ee939e","access":true}}