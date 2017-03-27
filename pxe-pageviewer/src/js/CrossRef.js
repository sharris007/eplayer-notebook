import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan500 } from 'material-ui/styles/colors';
import { ExternalLinkPreview } from '@pearson-incubator/aquila-js-basics';
import { ImageViewerPreview, VideoPlayerPreview, AudioPlayer } from '@pearson-incubator/aquila-js-media';

//Here pageViewerRef refers to "this" of PageViewer.js
const crossRef = (pageViewerRef) => {
  //destructuring props and state of PageViewer
  const {props, state}=pageViewerRef;

  const settings={
    lightBox:'lightbox',
    event:'event',
    newTab:'newtab',
    continue:'continue',
    stop:'stop',
    callback:'callback'
  };
  // This replaces the textColor value on the palette
  // and then update the keys for each component that depends on it.
  // More on Colors: http://www.material-ui.com/#/customization/colors
  pageViewerRef.muiTheme = getMuiTheme({
    palette: {
      textColor: cyan500
    },
    fontFamily: 'OpenSans, sans-serif',
    appBar: {
      height: 50
    }
  });
  //event handler for cross refs
  const hyperLinkEventHandler = (e) => {
    switch (props.src.crossRefSettings) {
    case settings.stop:
      e.preventDefault();
      break;
    case settings.newTab:
      // For current page links
      let targetUrl=e.currentTarget.getAttribute('href');
      if (targetUrl.indexOf('#')===0) {
        e.currentTarget.setAttribute('href', props.src.baseUrl+state.currentStatePlayListUrl.href.split('#')[0]+targetUrl);
      }else if (targetUrl.indexOf('file')===0) {
        //for toc links
        //e.preventDefault();
        const href=targetUrl.split('#')[0];
        const currentTargetPlayListIndex= props.src.playListURL.findIndex((el) => {
          if (el.href) {
            return el.href.indexOf(href)>=0;
          }
        });
        e.currentTarget.setAttribute('href', props.src.baseUrl+ props.src.playListURL[currentTargetPlayListIndex].href.split('#')[0]+(targetUrl.split('#')[1]?'#'+targetUrl.split('#')[1]:''));
      }
      //for outer hyperlinks
      e.currentTarget.setAttribute('target', '_blank');
      break;
    case settings.continue:
      targetUrl=e.currentTarget.getAttribute('href');
      // For other than current page links and TOC links
      if (!(targetUrl.indexOf('#')===0) && (targetUrl.includes(props.src.baseUrl) || targetUrl.indexOf('file')===0)) {
        //in toc play list
        e.preventDefault();
        targetUrl=targetUrl.replace(props.src.baseUrl, '');
        const href=targetUrl.split('#')[0];
        const currentTargetPlayListIndex= props.src.playListURL.findIndex((el) => {
          if (el.href) {
            return el.href.indexOf(href)>=0;
          }
        });
        pageViewerRef.getResponse(parseInt(currentTargetPlayListIndex), true, 'Goto', pageViewerRef.scrollWindowTop);
      }else if (targetUrl.indexOf('#')===0) {
        // current page hyperlink
        e.preventDefault();
        pageViewerRef.scrollToFragment(targetUrl.slice(1));
      }
      break;
    };
  };
  const contentLightBoxSettings = (element, eleInnerHtml, targetUrl) =>{
       // logic for content light box
       // For current page links
    
    if (targetUrl.indexOf('#') === 0) {
      targetUrl = props.src.baseUrl + state.currentStatePlayListUrl.href.split('#')[0] + targetUrl;
    } else if (targetUrl.indexOf('file') === 0) {
        // for toc links
      const href = targetUrl.split('#')[0];
      const currentTargetPlayListIndex = props.src.playListURL.findIndex((el) => {
        if (el.href) {
          return el.href.indexOf(href) >= 0;
        }
      });
      targetUrl = props.src.baseUrl+ props.src.playListURL[currentTargetPlayListIndex].href.split('#')[0]+(targetUrl.split('#')[1]?'#'+targetUrl.split('#')[1]:'');
    }
    const externalLinkPreviewProps={
      'title': element.innerText,
      'src':targetUrl,
      'type': 'External Links',
      'node':element  

    };
    const component=<MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
                        <ExternalLinkPreview 
                          title={externalLinkPreviewProps.title} 
                          src={externalLinkPreviewProps.src} 
                          type={externalLinkPreviewProps.type}
                        />
                      </MuiThemeProvider>;
    const temp = document.createElement('span');
    // temp.setAttribute('class', classList.join(' '));
    ReactDOM.render(component, temp);
    temp.getElementsByTagName('a')[0].setAttribute('from-external-preview', true);
    temp.getElementsByTagName('a')[0].style.cursor = 'pointer';
    temp.getElementsByTagName('a')[0].innerHTML=eleInnerHtml;
    element.parentNode.replaceChild(temp.getElementsByTagName('a')[0], element);
    // element.innerHTML=eleInnerHtml;
      
  };
  const imageLightBoxSettings= () => {
    const figures = document.getElementsByTagName('figure');
    if (figures.length) {
      for (let i=figures.length-1;i>=0;i--) {
        const figure=figures[i];
        const image=figure.getElementsByTagName('img')[0];
        if (!image) {
          continue;
        }
        const cloneImg=image.cloneNode(true); 
        const replaceImageDOM=document.createElement('div');
        replaceImageDOM.appendChild(cloneImg);
        image.parentNode.replaceChild(replaceImageDOM, image);
        const componentElement = figure.getElementsByTagName('img')[0].parentNode;
        const container = document.createElement('div');
        let wrapper;
        if (componentElement) {
          container.setAttribute('tabindex', 0);
          componentElement.appendChild(container);
          wrapper = container;
          const imageElement=componentElement.getElementsByTagName('img')[0];
          const imageViewerPreviewData={
            src : imageElement.getAttribute('src'),
            title : imageElement.getAttribute('title')||'',
            alt : imageElement.getAttribute('alt')||'',
            caption : figure.getElementsByTagName('figcaption')[0]?(figure.getElementsByTagName('figcaption')[0].textContent|| ''):'',
            width : '100%'
          };
          ReactDOM.render(
                  <MuiThemeProvider  muiTheme={pageViewerRef.muiTheme}>
                      <ImageViewerPreview data={imageViewerPreviewData} node={componentElement} />
                  </MuiThemeProvider>, wrapper);
        }  
      }
    }
  };
  const videoLightBoxSettings = () => {
    const figures = document.getElementsByTagName('figure');
    if (figures.length) {
      // Kindly, don't change the for loop here to high order functions
      for (let i=figures.length-1;i>=0;i--) {
        const figure=figures[i];
        const componentElement = figure.getElementsByClassName('lc_ec_videoinner')[0];
        if (!figure.classList.contains('video') || !componentElement) {
          continue;
        }
        const iFrame=componentElement.getElementsByTagName('iframe')[0];
        const container = document.createElement('div');
        let wrapper;
        //componentElement.appendChild(container);
        wrapper = container;
        const videoPlayerPreviewData={
          src:iFrame.src.replace('thumbnail', 'pmd').concat('?bitrate=600'),
          thumbnail:{src:iFrame.src.replace('thumbnail', 'pmd').concat('?mimeType=jpg')},
          title:figure.getElementsByClassName('title')[0]?figure.getElementsByClassName('title')[0].innerText:'',
          action:'',
          caption:'',
          alt:''
        };
        ReactDOM.render(
                  <MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
                      <VideoPlayerPreview data={videoPlayerPreviewData} />
                  </MuiThemeProvider>, wrapper);
        componentElement.replaceChild(wrapper, iFrame);
        if (componentElement.classList.length>1) {
          componentElement.classList.remove('lc_ec_videoinner'); 
        }else  {
          componentElement.removeAttribute('class');
        }
        //replace button with span so that background changes on hover shouldn't happen
        const buttons=pageViewerRef.bookContainerRef.querySelectorAll('figure.video .video-card-holder .video-page-label button.poster-play-icon');
        // Don't change for loop to higher order function
        for (let i=buttons.length-1;i>=0;i--) {
          const button =buttons[i];
          button.outerHTML =button.outerHTML.replace(/button/g, 'span');
        }
      }
    }
  };

  const audioLightBoxSettings = () => {
    const audioElements = pageViewerRef.bookContainerRef.querySelectorAll('[data-type=audio]');
    if (audioElements.length) {
       // Kindly, don't change the for loop here to high order functions
      for (let i=audioElements.length-1;i>=0;i--) {
        const audio=audioElements[i];
        const parentNodeToReplace=audio.parentNode;
        const audioPlayerData={
          source:parentNodeToReplace.getElementsByTagName('iframe')[0].src.replace('embed', 'pmd').concat('?mimeType=mp3&bitrate=600'),
          title:parentNodeToReplace.innerText
        };
        const container = document.createElement('div');
        let wrapper;
        wrapper = container;
        ReactDOM.render(
                  <MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
                       <AudioPlayer url={audioPlayerData.source} title={audioPlayerData.title}/>
                  </MuiThemeProvider>, wrapper);
        parentNodeToReplace.parentNode.replaceChild(wrapper, parentNodeToReplace);
      }
    }
  };

  const init = ()=>{ 
    const xrefs=pageViewerRef.bookContainerRef.getElementsByClassName('xref');
    // Kindly, don't change the for loop here to high order functions
    for (let i=xrefs.length-1;i>=0;i--) {
      const element=xrefs[i];
      // const classList=element.classList;
      const eleInnerHtml=element.innerHTML;
      if (props.src.crossRefSettings!==settings.lightBox && !element.getAttribute('custom-click-event-added')) {
        element.setAttribute('custom-click-event-added', true);
        element.addEventListener('click', hyperLinkEventHandler, false);
      }else if (props.src.crossRefSettings===settings.lightBox) {
        const targetUrl = element.getAttribute('href');
        if (!targetUrl) {
          continue;
        }
        contentLightBoxSettings(element, eleInnerHtml, targetUrl);
      }
    }
   // adding class xref to the added ExternalLinkPreview component
    const externalPreview=pageViewerRef.bookContainerRef.querySelectorAll('[from-external-preview]');
    for (const ele of externalPreview) {
      ele.setAttribute('class', 'xref');
    }

    // Adding light box for all images
    imageLightBoxSettings();
    // video light box settings
    videoLightBoxSettings();
    // audio light box settings
    audioLightBoxSettings();
  };
 
  init();
};
export default crossRef;
