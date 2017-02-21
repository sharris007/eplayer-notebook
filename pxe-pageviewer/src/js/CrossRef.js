//Here pageViewerRef refers to "this" of PageViewer.js
const crossRef = (pageViewerRef) => {
  //console.log(pageViewerRef.props);
  const {props}=pageViewerRef;
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
        /*For Image Links */
      e.currentTarget.setAttribute('target', '_blank');
      break;
    case settings.continue:
      e.preventDefault();
        /*For Image Links */
      const url=e.currentTarget.getAttribute('href').split('#')[0];
      const href=url.substring(url.indexOf('/'));
      const currentTargetPlayList= props.src.playListURL.filter((el) => {
        return el.href.indexOf(href)>=0;
      });
      pageViewerRef.getResponse(parseInt(currentTargetPlayList[0].playOrder), true, 'Goto', pageViewerRef.scrollWindowTop);
      break;
    };
  };
  const xrefs=pageViewerRef.bookContainerRef.getElementsByClassName('xref');
  for (const element of xrefs) {
    element.addEventListener('click', hyperLinkEventHandler, false);
  }
};
export default crossRef;
