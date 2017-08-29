import {resources , domain ,typeConstants} from './Settings';
const pxeServiceUrl = resources.links.pxeServiceUrl[domain.getEnvType()];
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
  pageFontSize: '50%',
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
  endPoints: {
    services: pxeServiceUrl,
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
       "originatingSystemCode": "ETEXT",
       "activities": [{
               "messageTypeCode": "UserLoadsContent",
               "messageVersion": "1.0.0",
               "namespace": "common",
               "payload": {
            "environmentCode":"Dev",
            "messageTypeCode":"UserLoadsContent",
            "originatingSystemCode":"eText",
            "namespaceCode":"Common",
            "messageVersion":"1.0.0",
            "transactionDt":"",
            "messageTransferType":"LiveStream",
            "messageId":"",
            "appId":"ETEXT",
            "accessedUsingAppId":"WebApp",    
            "appActivityAreaCode":"Learning",        
            "personId":"",
            "personIdType":"PI",    
            "personRoleCode":"Instructor",
            "organizationId":"",
            "organizationIdType":"Organization", 
            "courseId":"",
            "courseIdType":"Instructor",     
            "courseSectionId":"",
            "courseSectionIdType":"PI",    
            "timeCategorization": "Learning",
            "contentId":"",  
            "contentIdType":"ETEXT",
            "timeOnTaskUuid":"",    
            "loadDt":"",
            "datetimeSourceCode":"Client",
            "pageUserNavigatedToUrn":"",
            "userAgent":"",
            "deviceType":"Desktop",
            "operatingSystemCode":""
               }
       }]
}

export const pageUnLoadData = {
       "originatingSystemCode": "ETEXT",
       "activities": [{
               "messageTypeCode": "UserUnloadsContent",
               "messageVersion": "1.0.0",
               "namespace": "common",
               "payload": {
            "environmentCode":"Dev",
            "messageTypeCode":"UserUnloadsContent",
            "originatingSystemCode":"eText",
            "namespaceCode":"Common",
            "messageVersion":"1.0.0",
            "transactionDt":"",
            "messageTransferType":"LiveStream",
            "messageId":"",
            "appId":"ETEXT",
            "accessedUsingAppId":"WebApp",    
            "appActivityAreaCode":"Learning",        
            "personId":"",
            "personIdType":"PI",    
            "personRoleCode":"Instructor",
            "organizationId":"",
            "organizationIdType":"Organization", 
            "courseId":"",
            "courseIdType":"Instructor",     
            "courseSectionId":"",
            "courseSectionIdType":"PI",    
            "timeCategorization": "Learning",
            "contentId":"",  
            "contentIdType":"ETEXT",
            "timeOnTaskUuid":"",    
            "unloadDt":"",
            "datetimeSourceCode":"Client",
            "pageUserNavigatedToUrn":"",
            "userAgent":"",
            "deviceType":"Desktop",
            "operatingSystemCode":""
               }
       }]
}