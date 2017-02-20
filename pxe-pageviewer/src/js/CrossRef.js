const crossRef = (pageViewerRef) => {
  //console.log(pageViewerRef.props);
  const settings={//eslint-disable-line
    lightBox:'lightbox',
    event:'Event',
    newTab:'Newtab',
    continue:'Continue',
    stop:'Stop',
    callback:'callback'
  };
  const hyperLinkEventHandler = (e) => {//eslint-disable-line
    /*switch (pageViewerRef.crossRefSettings) {
            
    };*/
    //console.log(e.target);
  };
  const xrefs=pageViewerRef.bookContainerRef.getElementsByClassName('xref');
  for (const element of xrefs) {
    element.addEventListener('click', hyperLinkEventHandler, false);
  }
};
export default crossRef;
