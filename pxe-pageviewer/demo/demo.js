import PageViewerComponent from '../main'; // to demo direct API usage

// When available on npm, consumer usage would be similar to:
// import MyComponent from '@pearson-components/[book-container-component]'

function init() {
  new PageViewerComponent({
    elementId: 'demo',
    sendPageDetails:onPageChange,
    urlsJson:{
      baseUrl:'https://content.stg-openclass.com/eps/pearson-reader/api/item/52a34c8a-b182-4ce5-8afc-7fab6752ded8/1/file/belk5_pr623/',
      playList:[ {'href': 'OPS/s9ml/chapter01/filep700049577700000000000000000067f.xhtml',
                'playOrder': 1, 'title': 'Chapter 1: Can Science Cure the Common Cold?'}, { 'href': 'OPS/s9ml/chapter01/filep70004957770000000000000000006cf.xhtml#f1a0c0e3fc9c4f36a06ea462c6f9fd78', 'playOrder': 2
                , 'title': '1.1 The Process of Science'}, {'href': 'OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml#data-uuid-5a5a532fde8f4544825162098a629684',
                    'playOrder': 3, 'title': '1.2 Hypothesis Testing'
                  }, { 'href': 'OPS/s9ml/chapter01/filep7000495777000000000000000000806.xhtml#data-uuid-bd74d1114c5d448b9ed398a1a2ea2e73',
                    'playOrder': 4, 'title': '1.3 Understanding Statistics'
                  }, { 'href': 'OPS/s9ml/chapter01/filep70004957770000000000000000008ab.xhtml#data-uuid-fe1f61709ece49bcb4ba8cc1a9377204',
                    'playOrder': 5, 'title': '1.4 Evaluating Scientific Information' }]
    },
    currentPlayList:{'href': 'OPS/s9ml/chapter01/filep700049577700000000000000000067f.xhtml', 'playOrder': 1, 'title': 'Chapter 1: Can Science Cure the Common Cold?'}
  });
}
function onPageChange(type, data) {
  console.log(type, data);
}
window.onload = init;
