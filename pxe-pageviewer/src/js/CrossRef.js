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
      }
      //for outer hyperlinks
      e.currentTarget.setAttribute('target', '_blank');
      break;
    case settings.continue:
      targetUrl=e.currentTarget.getAttribute('href');
      // For other than current page links and TOC links
      if (!(targetUrl.indexOf('#')===0) && targetUrl.includes(props.src.baseUrl)) {
        //in toc play list
        e.preventDefault();
        targetUrl=targetUrl.replace(props.src.baseUrl, '');
        const url=targetUrl.split('#')[0];
        const href=url.substring(url.indexOf('/'));
        const currentTargetPlayListIndex= props.src.playListURL.findIndex((el) => {
          return el.href.indexOf(href)>=0;
        });
        pageViewerRef.getResponse(parseInt(currentTargetPlayListIndex), true, 'Goto', pageViewerRef.scrollWindowTop);
      }
      break;
    };
  };
  const xrefs=pageViewerRef.bookContainerRef.getElementsByClassName('xref');
  for (const element of xrefs) {
    element.addEventListener('click', hyperLinkEventHandler, false);
  }
};
export default crossRef;
