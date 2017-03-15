const copyCharLimit = (getRef) => {
  //Disable contextmenu based on copyCharlimt and copyImage Props
  const images = getRef.bookContainerRef.getElementsByTagName('img');
  const img_length = images.length;
  if ((getRef.props.src.copyCharLimit < 0 || getRef.props.src.copyCharLimit > 0) && (!getRef.props.src.copyImages)) {
    for (let i = 0; i < img_length ; i++) {
      disableContextMenu(images[i]);
    }
  } 
  else if (getRef.props.src.copyCharLimit === 0 && (!getRef.props.src.copyImages)) {
    disableContextMenu(getRef.bookContainerRef);
  }

  //Check the Text selection onCopy event
  getRef.bookContainerRef.oncopy = () => {
    if (getRef.props.src.copyCharLimit > 0) {
      let selection;
      selection = window.getSelection();
      const copytext = selection.toString().substring(0, getRef.props.src.copyCharLimit);
      const drmdiv = getRef.drmBlockRef;
      drmdiv.innerHTML = copytext.substring(0, getRef.props.src.copyCharLimit);
      selection.selectAllChildren(drmdiv);
      window.setTimeout(function() {
        drmdiv.innerHTML = ' ';
      }, 0);
    } else if (getRef.props.src.copyCharLimit === 0) {
      return false;
    }
  };

  //Apply Zoom size for all the Images
  const pageZoom = getRef.props.src.pageZoom ? getRef.props.src.pageZoom + '%' : '100%';
  for (let j = 0; j < img_length; j++) {
    images[j].style.zoom = pageZoom;
  }
};
//Common function for disable rightclick
const disableContextMenu = (getElem) => {
  getElem.oncontextmenu = () => {
    return false;
  };
};
export default copyCharLimit;
