import PxePlayerComponent from '../main'; // to demo direct API usage

// When available on npm, consumer usage would be similar to:
// import MyComponent from '@pearson-components/[book-container-component]'
//https://content.openclass.com/eps/sanvan/api/item/138acd10-4c63-4eba-aba6-25f70c1626e5/1/file/pearson_bonds_v13-revel-2/OPS/text/bookmatter-02/bkm2_sec_01.xhtml
function init() {
  new PxePlayerComponent({'pageDetails':{
    renderId:'pxeViewer',
    locale: 'en-us',
    copyImages: false,
    copyCharLimit: 10,
    crossRefSettings:'lightbox',
    enablePrintOption: false,
    showPageNo:true,
    orientation: 'horizontal',
    theme:'black',
    pageFontSize:'',
    pageZoom:'', 
    enableGoToPage:true,
    includeMathMLLib: true,
    enableAnnotation: true,
    annotationShareable: true,
    clearSearchHighlights: false,
    elementId: 'demo',
    sendPageDetails:onPageChange,
    pdfSearch:false,
    allowLightboxFullscreen:false,
    contentId: 'pxe-viewer',
    onBookLoaded:()=>{},
    highlightText:'',
    bgColor:'', 
    tocUpdated:false,
    baseUrl: 'https://content.stg-openclass.com/eps/pearson-reader/api/item/9557d0fc-0c6e-47be-96a0-71b9208a70eb/1/file/Belk5wPhys-080615-MJ-CM/', //'https://content.stg-openclass.com/eps/pearson-reader/api/item/542d7ded-e63b-4bc5-9e82-62ccc7c6039c/1/file/LutgensAtm13-071415-MJ-DW/', 
    playListURL:[
      {
        'playOrder': 1,
        'title': 'The Atmosphere: An Introduction to Meteorology',
        'href': 'OPS/s9ml/front_matter/cover.xhtml'
      }, {
        'playOrder': 2,
        'title': 'Temperature and Precipitation Extremes Map',
        'href': 'OPS/s9ml/front_matter/filep7000496728000000000000000000005_01.xhtml#data-uuid-5242a32c29c74f04b63d83a31b6f9a77'
      }, {
        'playOrder': 3,
        'title': 'So Many Options for Your Meteorology Class!',
        'href': 'OPS/s9ml/front_matter/filep7000496728000000000000000000005.xhtml#data-uuid-c37d44d1fa9b4d519d2dbc682d654f97'
      }, {
        'playOrder': 4,
        'title': 'The Perfect Storm of Rich Media & Active Learning Tools',
        'href': 'OPS/s9ml/front_matter/filep7000496728000000000000000000038.xhtml#data-uuid-40f184d6cce64162bc5d474935d04069'
      }, {
        'playOrder': 5,
        'title': 'The Atmosphere 13e',
        'href': 'OPS/s9ml/front_matter/filep700049672800000000000000000e36e.xhtml#data-uuid-5233a60b9d9d47f3ab5222c847891cb7'
      }, {
        'id':'afab597007b81dd25ee588e12856b3db25b309841-f1a0c0e3fc9c4f36a06ea462c6f9fd78',
        'playOrder': 6,
        'title': '1.1 The Process of Science',
        'href': 'OPS/s9ml/chapter01/filep70004957770000000000000000006cf.xhtml#f1a0c0e3fc9c4f36a06ea462c6f9fd78'//'OPS/s9ml/chapter01/filep7000496728000000000000000000a55.xhtml#d65a27090854476e92950ae2685e2ffa'
      }, {
        'playOrder': 7,
        'title': '1.5 Vertical Structure of the Atmosphere',
        'href': 'OPS/s9ml/chapter01/filep7000496728000000000000000000ace.xhtml#c82fa704db4148aaa4e7184733ff2520'
      }, {
        'playOrder': 8,
        'title': 'Chapter 2: Heating Earthâ€™s Surface and Atmosphere',
        'href': 'OPS/s9ml/chapter02/filep7000496728000000000000000000c93.xhtml'
      }, {
        'title': 'Concepts in Review',
        'playOrder': 9,
        'href': 'OPS/s9ml/chapter01/filep7000496728000000000000000000b62.xhtml#e7a18705605b4bf09f2e0258dd4fb74f'
      }, {
        'title': '2.4 What Happens to Incoming Solar Radiation?',
        'playOrder': 10,
        'href': 'OPS/s9ml/chapter02/filep7000496728000000000000000000e71.xhtml#eff7d7ad567942dd97edc7a1bbd4b498'
      }],
    currentPageURL:{
      'id':'afab597007b81dd25ee588e12856b3db25b309841-f1a0c0e3fc9c4f36a06ea462c6f9fd78',
      'playOrder': 6,
      'title': '1.1 The Process of Science',
      'href': 'OPS/s9ml/chapter01/filep70004957770000000000000000006cf.xhtml#f1a0c0e3fc9c4f36a06ea462c6f9fd78' //'OPS/s9ml/appendixe/filep70004967280000000000000000051ac.xhtml'
    },
    endPoints: {
      'services': 'https://pxe-sdk-qa.stg-openclass.com/services-api/api/3.1',
      'search': 'https://content-service.dev-prsn.com/csg',
      'pi': '',
      'ingest': 'http://dragonfly.dev-openclass.com/pxereader-cm/api/cm'
    }
  }, 
  urlParams:{
    'context' :'1Q98UHDD1E1',
    'user':'epluser'
  },
  applnCallback:()=>{console.log('applnCallback');}});
}
function onPageChange(type, data) {
  console.log(type, data);
}
window.onload = init;
