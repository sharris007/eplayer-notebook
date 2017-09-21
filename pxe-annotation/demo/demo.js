import AnnotationComponent from '../main';
import injectTapEventPlugin from 'react-tap-event-plugin';

function init() {
  injectTapEventPlugin();  
  const customeAttributes ={
    playOrder: 'playOrder',
    href     :'href',
    createdTimestamp:'createdTimestamp',
    updatedTimestamp:'updatedTimestamp',
    text  :'text',
    ranges :'ranges',
    quote:'quote',
    shareable:'shareable'
  };
  const annotationData = [
    {
      'id': '589c882fc2ef162b33d60ccb',
      'playOrder': 1,
      'href': 'OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml',
      'text': 'asdasdas',
      'ranges': [
        {
          'start': '/p[1]',
          'startOffset': 286,
          'end': '/p[1]',
          'endOffset': 368
        }
      ],
      color:'#55DF49',
      lastColor:'#55DF49',
      shareable:true,
      'quote': 'sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum se',
      'highlights': [
        {
          'jQuery17207015872935969321': 10
        }
      ]
    },

    {
      'id': '1504854654178',
      'playOrder': 1,
      'href': 'OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml',
      'text': 'loading annotation on page load',
      'ranges': [
        {
          'start': '/p[1]',
          'startOffset': 492,
          'end': '/p[1]',
          'endOffset': 775
        }
      ],
      color:'#FFD232',
      lastColor:'#55DF49',
      shareable:true,
      'quote': 'sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum se',
      'highlights': [
        {
          'jQuery17207015872935969321': 10
        }
      ]
    },

    {
      'id': '15048546541738',
      'playOrder': 1,
      'href': 'OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml',
      'text': 'loading annotation on page load',
      'ranges': [
        {
          'start': '/p[1]',
          'startOffset': 102,
          'end': '/p[1]',
          'endOffset': 117
        }
      ],
      color:'#FC92CF',
      lastColor:'#55DF49',
      shareable:true,
      'quote': 'sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum se',
      'highlights': [
        {
          'jQuery17207015872935969321': 10
        }
      ]
    }
  ];

  window.annotationLocale = 'en-US';

  window.annotationProps = {
    elementId: 'demo',   
    contentId:'demo-content',
    annotationData:annotationData,
    shareableAnnotations:true,
    currentPageDetails:{},
    annotationEventHandler:annotationEvent,
    annAttributes:customeAttributes
  }

  // Create new instance of bookshelf component
  window.annotationComponent = new AnnotationComponent(window.annotationProps);  
}
function annotationEvent(type, data) {
  console.log(type, data);
  data.id = Date.parse(data.createdTimestamp);
  data.createdTimestamp = Date.parse(data.createdTimestamp);
  window.annotationProps.annotationData = [data]
  if (type === 'annotationCreated') {
    window.annotationComponent.init(window.annotationProps)
  }
}
window.onload = init;
