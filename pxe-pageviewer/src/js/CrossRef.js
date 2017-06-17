import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { IntlProvider } from 'react-intl';
import { cyan500 } from 'material-ui/styles/colors';
import { ExternalLinkPreview } from '@pearson-incubator/aquila-js-basics';
import { ImageViewerPreview, VideoPlayerPreview, AudioPlayer } from '@pearson-incubator/aquila-js-media';

// Here pageViewerRef refers to "this" of PageViewer.js
export const crossRef = (pageViewerRef) => {
  // destructuring props and state of PageViewer
  const { props, state } = pageViewerRef;

  const settings = {
    lightBox: 'lightbox',
    event: 'event',
    newTab: 'newtab',
    continue: 'continue',
    stop: 'stop',
    callback: 'callback'
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
  // event handler for cross refs
  const hyperLinkEventHandler = (e) => {
    switch (props.src.crossRefSettings) {
    case settings.stop:
      e.preventDefault();
      break;
    case settings.newTab:
      // For current page links
      let targetUrl = e.currentTarget.getAttribute('href');
      if (targetUrl.indexOf('#') === 0) {
        e.currentTarget.setAttribute('href', props.src.baseUrl + state.currentStatePlayListUrl.href.split('#')[0] + targetUrl);
      } else if (targetUrl.indexOf('file') === 0) {
        // for toc links
        // e.preventDefault();
        const href = targetUrl.split('#')[0];
        const currentTargetPlayListIndex = props.src.playListURL.findIndex((el) => {
          if (el.href) {
            return el.href.indexOf(href) >= 0;
          }
        });
        e.currentTarget.setAttribute('href', props.src.baseUrl + props.src.playListURL[currentTargetPlayListIndex].href.split('#')[0] + (targetUrl.split('#')[1] ? `#${targetUrl.split('#')[1]}` : ''));
      }
      // for outer hyperlinks
      e.currentTarget.setAttribute('target', '_blank');
      break;
    case settings.continue:
      targetUrl = e.currentTarget.getAttribute('href');
      // For other than current page links and TOC links
      if (!(targetUrl.indexOf('#') === 0) && (targetUrl.includes(props.src.baseUrl) || targetUrl.indexOf('file') === 0)) {
        // in toc play list
        e.preventDefault();
        targetUrl = targetUrl.replace(props.src.baseUrl, '');
        const href = targetUrl.split('#')[0];
        const currentTargetPlayListIndex = props.src.playListURL.findIndex((el) => {
          if (el.href) {
            return el.href.indexOf(href) >= 0;
          }
        });
        pageViewerRef.getResponse(parseInt(currentTargetPlayListIndex), true, 'Goto', pageViewerRef.scrollWindowTop);
      } else if (targetUrl.indexOf('#') === 0) {
        // current page hyperlink
        e.preventDefault();
        pageViewerRef.scrollToFragment(targetUrl.slice(1));
      }
      break;
    }
  };
  const contentLightBoxSettings = (element, classList, targetUrl) => {
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
      targetUrl = props.src.baseUrl + props.src.playListURL[currentTargetPlayListIndex].href.split('#')[0] + (targetUrl.split('#')[1] ? `#${targetUrl.split('#')[1]}` : '');
    }
    const externalLinkPreviewProps = {
      title: element.innerText.trim().length ? element.innerText : ' ',
      src: targetUrl,
      type: 'External Links',
      node: element
    };
    const component = (<MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
      <IntlProvider locale="en">
        <ExternalLinkPreview
          title={externalLinkPreviewProps.title}
          src={externalLinkPreviewProps.src}
          type={externalLinkPreviewProps.type}
                        />
      </IntlProvider>
    </MuiThemeProvider>);
    const temp = document.createElement('span');
    // temp.setAttribute('class', classList.join(' '));
    ReactDOM.render(component, temp);
    pageViewerRef.nodesTobeUnmounted.push(temp);
    temp.getElementsByTagName('a')[0].setAttribute('from-external-preview', true);
    temp.getElementsByTagName('a')[0].setAttribute('class-list', [...classList].join(' '));
    temp.getElementsByTagName('a')[0].style.cursor = 'pointer';
    temp.getElementsByTagName('a')[0].innerHTML = element.innerHTML;
    element.parentNode.replaceChild(temp.getElementsByTagName('a')[0], element);
    // element.innerHTML=eleInnerHtml;

  };
  const imageLightBoxSettings = () => {
    try {
      const figures = pageViewerRef.bookContainerRef.getElementsByTagName('figure');
      if (figures.length) {
        for (let i = figures.length - 1; i >= 0; i--) {
          const figure = figures[i];
          const image = figure.getElementsByTagName('img')[0];
          if (!image || image.classList.contains('design-icon')) {
            continue;
          }
          const cloneImg = image.cloneNode(true);
          const replaceImageDOM = document.createElement('div');
          replaceImageDOM.appendChild(cloneImg);
          image.parentNode.replaceChild(replaceImageDOM, image);
          const componentElement = figure.getElementsByTagName('img')[0].parentNode;
          const container = document.createElement('div');
          let wrapper;
          if (componentElement) {
            container.setAttribute('tabindex', 0);
            componentElement.appendChild(container);
            wrapper = container;
            const imageElement = componentElement.getElementsByTagName('img')[0];
            const imageViewerPreviewData = {
              src: imageElement.getAttribute('src'),
              title: imageElement.getAttribute('title') || '',
              alt: imageElement.getAttribute('alt') || '',
              caption: figure.getElementsByTagName('figcaption')[0] ? (figure.getElementsByTagName('figcaption')[0].innerText.trim() || '') : '',
              width: '100%'
            };
            ReactDOM.render(
              <MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
                <IntlProvider locale="en">
                  <ImageViewerPreview data={imageViewerPreviewData}/>
                </IntlProvider>
              </MuiThemeProvider>, wrapper);
            componentElement.replaceChild(wrapper, imageElement);
            pageViewerRef.nodesTobeUnmounted.push(wrapper);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const videoLightBoxSettings = () => {
    try {
      const figures = pageViewerRef.bookContainerRef.getElementsByTagName('figure');
      if (figures.length) {
      // Kindly, don't change the for loop here to high order functions
        for (let i = figures.length - 1; i >= 0; i--) {
          const figure = figures[i];
          const iFrame = figure.getElementsByTagName('iframe');
          if (!figure.classList.contains('video') || !(iFrame && iFrame[0])) {
            continue;
          }
          const componentElement = iFrame[0].parentElement;
          const container = document.createElement('div');
          let wrapper;
        // componentElement.appendChild(container);
          wrapper = container;
          const videoPlayerPreviewData = {
            src: iFrame[0].src.replace('thumbnail', 'pmd').replace('_video', '_pmd').concat('?bitrate=600'),
            thumbnail: { src: iFrame[0].src.replace('thumbnail', 'pmd').replace('_video', '_pmd').concat('?mimeType=jpg') },
            title: figure.getElementsByClassName('title')[0] ? figure.getElementsByClassName('title')[0].innerText : '',
            action: '',
            caption: '',
            alt: ''
          };
          ReactDOM.render(
            <MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
              <IntlProvider locale="en">
                <VideoPlayerPreview data={videoPlayerPreviewData} />
              </IntlProvider>
            </MuiThemeProvider>, wrapper);
          componentElement.replaceChild(wrapper, iFrame[0]);
          pageViewerRef.nodesTobeUnmounted.push(wrapper);
          componentElement.removeAttribute('class');
         // replace button with span so that background changes on hover shouldn't happen
          const buttons = pageViewerRef.bookContainerRef.querySelectorAll('figure.video .video-card-holder .video-page-label button.poster-play-icon');
        // Don't change for loop to higher order function
          for (let i = buttons.length - 1; i >= 0; i--) {
            const button = buttons[i];
            button.outerHTML = button.outerHTML.replace(/button/g, 'span');
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const audioLightBoxSettings = () => {
    try {
      const audioEle = pageViewerRef.bookContainerRef.querySelectorAll('[data-type=audio]');
      const figures = pageViewerRef.bookContainerRef.getElementsByTagName('figure');
      const audioElements = [...audioEle];
      if (figures.length) {
      // Kindly, don't change the for loop here to high order functions
        for (let i = figures.length - 1; i >= 0; i--) {
          const figure = figures[i];
          const iFrame = figure.getElementsByTagName('iframe');
          if (figure.classList.toString().indexOf('audio') === -1 || !iFrame) {
            continue;
          }
          audioElements.push(iFrame[0]);
        }
      }
      if (audioElements.length) {
       // Kindly, don't change the for loop here to high order functions
        for (let i = audioElements.length - 1; i >= 0; i--) {
          const audio = audioElements[i];
          const parentNodeToReplace = audio.parentNode;
          const audioPlayerData = {
            source: parentNodeToReplace.getElementsByTagName('iframe')[0].src.replace('embed', 'pmd').replace('_audio', '_pmd').concat('?mimeType=mp3&bitrate=600'),
            title: parentNodeToReplace.innerText
          };
          const container = document.createElement('div');
          const wrapper = container;
          ReactDOM.render(
            <MuiThemeProvider muiTheme={pageViewerRef.muiTheme}>
              <IntlProvider locale="en">
                <AudioPlayer url={audioPlayerData.source} title={audioPlayerData.title} />
              </IntlProvider>
            </MuiThemeProvider>, wrapper);
          pageViewerRef.nodesTobeUnmounted.push(wrapper);
          parentNodeToReplace.parentNode.replaceChild(wrapper, parentNodeToReplace);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const gadgetClickHandler = (e) => {
    e.preventDefault();
    const lightBoxProps = Object.assign({}, pageViewerRef.state.lightBoxProps, {
      url: e.currentTarget.getAttribute('href'),
      isOpen: true
    });
    pageViewerRef.setState({
      lightBoxProps
    });
  };
  // For lightBox gadget
  const lightBoxGadgetBindEvents = () => {
  // classes 'lightbox' 'lightbox image' 'ls_large-image' 'fx-lightbox' 'fx-lightbox gadget' 'lightbox gadget'
    const gadgetClasses = ['gadget'];
    const lightBoxClasses = ['lightbox', 'ls_large-image', 'fx-lightbox']; // gets all elements of lightbox including gadgets
    gadgetClasses.map((el) => {
      const gadgetElements = pageViewerRef.bookContainerRef.getElementsByClassName(el);
      for (let i = 0; i < gadgetElements.length; i++) {
        if (!gadgetElements[i].getAttribute('added-gadget-lightbox')) {
          gadgetElements[i].addEventListener('click', gadgetClickHandler, false);
          gadgetElements[i].setAttribute('added-gadget-lightbox', true);
        }
      }
    });

    lightBoxClasses.map((className) => {
      const elements = pageViewerRef.bookContainerRef.getElementsByClassName(className);
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (!element.classList.contains('gadget') && element.getAttribute('from-external-preview') !== 'true') {
          const targetUrl = element.getAttribute('href');
          if (!targetUrl) {
            continue;
          }
          contentLightBoxSettings(element, element.classList, targetUrl);
          /* const externalLinkPreviewProps={
            'title': 'Light Box',
            'src':element.getAttribute('href'),
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
          ReactDOM.render(component, temp);
          temp.getElementsByTagName('a')[0].style.cursor = 'pointer';
          temp.getElementsByTagName('a')[0].innerHTML=externalLinkPreviewProps.node.innerHTML;
          element.parentNode.replaceChild(temp.getElementsByTagName('a')[0], element);*/
        }
      }
    });
  };

  const init = () => {
    const allHyperlinks = pageViewerRef.bookContainerRef.getElementsByTagName('a');
    for (let i = 0; i < allHyperlinks.length; i++) {
      // External links should open in new tab
      // set all hyperlinks target to _blank and preventDefault is taken care by rest of functionalities like xref,lighbox,gadget
      allHyperlinks[i].setAttribute('target', '_blank');
    }
    const xrefs = pageViewerRef.bookContainerRef.getElementsByClassName('xref');
    // Kindly, don't change the for loop here to high order functions
    for (let i = xrefs.length - 1; i >= 0; i--) {
      const element = xrefs[i];
      const classList = element.classList;
      if (props.src.crossRefSettings !== settings.lightBox && !element.getAttribute('custom-click-event-added')) {
        element.setAttribute('custom-click-event-added', true);
        element.addEventListener('click', hyperLinkEventHandler, false);
      } else if (props.src.crossRefSettings === settings.lightBox) {
        const targetUrl = element.getAttribute('href');
        if (!targetUrl) {
          continue;
        }
        if (element.getAttribute('from-external-preview') !== 'true') {
          contentLightBoxSettings(element, classList, targetUrl);
        }
      }
    }
    // Adding light box for all images
    imageLightBoxSettings();
    // video light box settings
    videoLightBoxSettings();
    // audio light box settings
    audioLightBoxSettings();
    // for gadgets lightbox
    lightBoxGadgetBindEvents();
    // PlaceHolder

    //
    // adding classes to the added ExternalLinkPreview component
    const externalPreview = pageViewerRef.bookContainerRef.querySelectorAll('[from-external-preview]');
    for (const ele of externalPreview) {
      ele.setAttribute('class', ele.getAttribute('class-list'));
    }
  };

  init();
};
