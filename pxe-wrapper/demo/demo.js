import PxeWrapperComponent from '../main';
import injectTapEventPlugin from 'react-tap-event-plugin';

// function getParameterByName(name, url) {
//   if (!url) {
//     url = window.location.href;
//   }
//   name = name.replace(/[\[\]]/g, '\\$&');
//   const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
//   const results = regex.exec(url);
//   if (!results) {
//     return null;
//   }
//   if (!results[2]) {
//     return '';
//   }
//   return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }

function init() {
  // Needed for onTouchTap
  // http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin();  

  // Create new instance of PxeWrapperComponent
  new PxeWrapperComponent({
    contentId:'demo-content'
  });  
}

window.onload = init;
