/* global $, WebPDF */
import { triggerEvent } from '../webPDFUtil';
import _ from 'lodash';
let regionListData = [];
let lodashFunctions;
let bookFeatures;

/* Function to get RGBA Color Values from HEX Color Code*/
function convertHexToRgba(hexCode, opacity) {
  let a;
  const hex = hexCode.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (opacity === 0) {
    a = 0;
  } else {
    a = opacity / 100;
  }
  const rgba = `rgba(${r},${g},${b},${a})`;
  return rgba;
}
/* Function to return default icons based on the region type if icons are of type swf*/
function getHotspotType(regionUrl, _) {
  const regiontype = {};
  const regionLink = regionUrl.toLowerCase();
  if (_.endsWith(regionLink, '.doc') === true || _.endsWith(regionLink, '.docx') === true) {
    regiontype.icon = '/hotspot_icons/word.png';
    regiontype.region = 'DOCUMENT';
  }
  if (_.endsWith(regionLink, '.xls') === true || _.endsWith(regionLink, '.xlsx') === true) {
    regiontype.icon = '/hotspot_icons/excel.png';
    regiontype.region = 'DOCUMENT';
  }
  if (_.endsWith(regionLink, '.ppt') === true || _.endsWith(regionLink, '.pptx') === true) {
    regiontype.icon = '/hotspot_icons/ppt.png';
    regiontype.region = 'DOCUMENT';
  }
  if (_.endsWith(regionLink, '.pdf') === true) {
    regiontype.icon = '/hotspot_icons/pdf.png';
    regiontype.region = 'DOCUMENT';
  } else if (_.endsWith(regionLink, '.mp4') === true || _.endsWith(regionLink, '.m4v') === true) {
    regiontype.icon = '/hotspot_icons/video.png';
    regiontype.region = 'VIDEO';
  } else if (_.endsWith(regionLink, '.mp3') === true) {
    regiontype.icon = '/hotspot_icons/audio.png';
    regiontype.region = 'AUDIO';
  } else if (_.endsWith(regionLink, '.jpg') === true || _.endsWith(regionLink, '.jpeg') === true ||
    _.endsWith(regionLink, '.png') === true || _.endsWith(regionLink, '.gif') === true) {
    regiontype.icon = '/hotspot_icons/default.png';
    regiontype.region = 'IMAGE';
  } else {
    regiontype.icon = '/hotspot_icons/default.png';
    regiontype.region = 'URL';
  }
  return regiontype;
}
/* Function to replace swf icons with default icons based on the type of hotspot*/
function resetSwfIcons(hotspot, lodash) {
  let icon = '';
  if (hotspot.linkTypeID === 2) {
    icon = '/hotspot_icons/video.png';
  } else if (hotspot.linkTypeID === 4 || hotspot.linkTypeID === 12) {
    icon = '/hotspot_icons/audio.png';
  } else if (hotspot.linkTypeID === 8) {
    icon = '/hotspot_icons/email.png';
  } else if (hotspot.linkTypeID === 11) {
    icon = '/hotspot_icons/ltilink.png';
  } else if (hotspot.linkTypeID === 13) {
    icon = '/hotspot_icons/video.png';
  } else if (hotspot.linkTypeID === 7) {
    if (hotspot.regionTypeID === 1) {
      icon = '/hotspot_icons/audio.png';
    }
    if (hotspot.regionTypeID === 8 || hotspot.regionTypeID === 11) {
      icon = getHotspotType(hotspot.linkValue, lodash);
    }
    if (hotspot.regionTypeID === 14) {
      icon = '/hotspot_icons/pdf.png';
    }
    if (hotspot.regionTypeID === 15) {
      icon = '/hotspot_icons/word.png';
    }
    if (hotspot.regionTypeID === 13) {
      icon = '/hotspot_icons/excel.png';
    }
    if (hotspot.regionTypeID === 9) {
      icon = '/hotspot_icons/ppt.png';
    }
    if (hotspot.regionTypeID === 12) {
      icon = '/hotspot_icons/video.png';
    }
  } else if (hotspot.linkTypeID === 9) {
    if (hotspot.regionTypeID === 1) {
      icon = '/hotspot_icons/audio.png';
    }
    if (hotspot.regionTypeID === 8 || hotspot.regionTypeID === 11) {
      icon = getHotspotType(hotspot.linkValue, lodash);
    }
    if (hotspot.regionTypeID === 14) {
      icon = '/hotspot_icons/pdf.png';
    }
    if (hotspot.regionTypeID === 15) {
      icon = '/hotspot_icons/word.png';
    }
    if (hotspot.regionTypeID === 13) {
      icon = '/hotspot_icons/excel.png';
    }
    if (hotspot.regionTypeID === 9) {
      icon = '/hotspot_icons/ppt.png';
    }
    if (hotspot.regionTypeID === 12) {
      icon = '/hotspot_icons/video.png';
    }
  } else if (hotspot.linkTypeID === 15) {
    icon = getHotspotType(hotspot.linkValue, lodash);
  } else {
    icon = '/hotspot_icons/default.png';
  }
  return (`/eplayer${icon}`);
}

/* Function to render the hotspot icons*/
export function displayRegions(hotspots, hotspotFeatures, lodash) {
  try {
    if (hotspots.length > 0) {
      regionListData = hotspots;
      lodashFunctions = lodash;
      bookFeatures = hotspotFeatures;
      const parentPageElement = document
      .getElementById(`docViewer_ViewContainer_PageContainer_${WebPDF.ViewerInstance.getCurPageIndex()}`);
      let regionType;
      let iconArt;
      let regionElement;
      let iconDiv;
      let tooltip;
      const pageWidth = $(`#docViewer_ViewContainer_BG_${WebPDF.ViewerInstance.getCurPageIndex()}`).width();
      const pageHeight = $(`#docViewer_ViewContainer_BG_${WebPDF.ViewerInstance.getCurPageIndex()}`).height();
      const originalPdfWidth = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageWidth();
      const originalPdfHeight = WebPDF.Tool.readerApp.getPDFDoc().getPage(0).getPageHeight();
      const widthScale = pageWidth / originalPdfWidth;
      const heightScale = pageHeight / originalPdfHeight;
      for (let i = 0; i < hotspots.length; i++) {
        try {
          $(`${'#' + 'region_'}${hotspots[i].regionID}`).remove(); // eslint-disable-line no-useless-concat
          $(`${'#' + 'icon_'}${hotspots[i].regionID}`).remove(); // eslint-disable-line no-useless-concat
        } catch (e) {
          // error
        }
        regionType = hotspots[i].iconTypeID;
        if (regionType !== 1 && (lodash.endsWith(hotspots[i].imagePath, '.swf') === false)) {
          iconArt = hotspots[i].imagePath;
          if (!(/^http:\/\//i.test(iconArt)) && !(/^https:\/\//i.test(iconArt))) {
            iconArt = `https://${hotspots[i].imagePath}`;
          } else if (/^http:\/\//i.test(iconArt)) {
            const link = iconArt.substring(4);
            iconArt = `https${link}`;
          }
        } else {
          iconArt = resetSwfIcons(hotspots[i], lodash);
        }
        regionElement = document.createElement('div');
        regionElement.setAttribute('id', `region_${hotspots[i].regionID}`);
        regionElement.setAttribute('name', hotspots[i].name);
        regionElement.style.left = `${hotspots[i].x * widthScale}px`;
        regionElement.style.top = `${hotspots[i].y * heightScale}px`;
        regionElement.style.width = `${hotspots[i].width * widthScale}px`;
        regionElement.style.height = `${hotspots[i].height * heightScale}px`;
        iconDiv = document.createElement('div');
        if (regionType === 1) {
          if (hotspots[i].transparent === true || hotspotFeatures.isunderlinehotspot === true) {
            regionElement.style.background = convertHexToRgba(hotspotFeatures.hotspotcolor, 0);
            regionElement.onmouseover = (event) => {
              triggerEvent('RegionHovered', event.currentTarget.id);
            };
            regionElement.onmouseout = (event) => {
              triggerEvent('RegionUnhovered', event.currentTarget.id);
            };
          } else {
            regionElement.style.background = convertHexToRgba(hotspotFeatures.hotspotcolor,
              hotspotFeatures.regionhotspotalpha);
          }

          if (hotspotFeatures.isunderlinehotspot === true && hotspots[i].transparent !== true) {
            regionElement.style.borderBottomColor = hotspotFeatures.underlinehotspotcolor;
            regionElement.style.borderBottomWidth = `${hotspotFeatures.underlinehotspotthickness}px`;
            regionElement.style.borderBottomStyle = 'solid';
          } else if (hotspotFeatures.isunderlinehotspot === true && hotspots[i].transparent === true) {
            regionElement.style.borderBottomColor = convertHexToRgba(hotspotFeatures.underlinehotspotcolor, 0);
            regionElement.transparent = true;
          }
        } else {
          iconDiv.setAttribute('id', `icon_${hotspots[i].regionID}`);
          iconDiv.setAttribute('name', `icon_${hotspots[i].name}`);
          iconDiv.style.width = `${hotspots[i].width * widthScale}px`;
          iconDiv.style.height = `${hotspots[i].height * heightScale}px`;
          iconDiv.style.left = `${hotspots[i].x * widthScale}px`;
          iconDiv.style.top = `${hotspots[i].y * heightScale}px`;
          iconDiv.style.backgroundImage = `url(${iconArt})`;
          iconDiv.style.opacity = hotspotFeatures.iconhotspotalpha / 100;
          iconDiv.style.backgroundSize = 'cover';
        }
        regionElement.className = 'hotspot';
        iconDiv.className = 'hotspotIcon';
        tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.innerHTML = hotspots[i].name;
        if (hotspots[i].regionTypeID !== 5) {
          regionElement.onclick = (event) => {
            triggerEvent('regionClicked', event.currentTarget.id);
          };
        }
        regionElement.appendChild(tooltip);
        parentPageElement.appendChild(iconDiv);
        parentPageElement.appendChild(regionElement);
      }
    }
  } catch (e) {
    // error
  }
}

/* Function to handle the clicked region and return the details pertaining to it.*/
export function handleRegionClick(hotspotID, baseUrl) {
  let clickedRegionDetails;
  if (regionListData.length > 0) {
    for (let i = 0; i < regionListData.length; i++) {
      if (hotspotID === (`region_${regionListData[i].regionID}`)) {
        clickedRegionDetails = getRegionDetails(regionListData[i], baseUrl);
        break;
      }
    }
  }
  return clickedRegionDetails;
}

export function getRegionDetails(regionClicked, baseUrl) {
   let basepath;
  let regionData;
  const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/; // eslint-disable-line no-useless-escape,max-len
    let clickedRegionDetails = regionClicked;
    clickedRegionDetails.hotspotType = '';
        if (clickedRegionDetails.linkTypeID === 1) {
          clickedRegionDetails.hotspotType = 'IMAGE';
          if (baseUrl.imagepath !== null && baseUrl.imagepath !== '' && baseUrl.imagepath !== undefined) {
            basepath = baseUrl.imagepath;
          }
        } else if (clickedRegionDetails.linkTypeID === 2) {
          clickedRegionDetails.hotspotType = 'VIDEO';
          if (baseUrl.flvpath !== null && baseUrl.flvpath !== '' && baseUrl.flvpath !== undefined) {
            basepath = baseUrl.flvpath;
          }
        } else if (clickedRegionDetails.linkTypeID === 4 || clickedRegionDetails.linkTypeID === 12) {
          clickedRegionDetails.hotspotType = 'AUDIO';
          if (baseUrl.mp3path !== null && baseUrl.mp3path !== '' && baseUrl.mp3path !== undefined) {
            basepath = baseUrl.mp3path;
          }
        } else if (clickedRegionDetails.linkTypeID === 5) {
          clickedRegionDetails.hotspotType = 'PAGENUMBER';
        } else if (clickedRegionDetails.linkTypeID === 8) {
          clickedRegionDetails.hotspotType = 'EMAIL';
        } else if (clickedRegionDetails.linkTypeID === 11) {
          clickedRegionDetails.hotspotType = 'LTILINK';
        } else if (clickedRegionDetails.linkTypeID === 13) {
          clickedRegionDetails.hotspotType = 'VIDEO';
          if (baseUrl.h264path !== null && baseUrl.h264path !== '' && baseUrl.h264path !== undefined) {
            basepath = baseUrl.h264path;
          }
        } else if (clickedRegionDetails.linkTypeID === 7) {
          if (clickedRegionDetails.regionTypeID === 1) {
            clickedRegionDetails.hotspotType = 'AUDIO';
          }
          if (clickedRegionDetails.regionTypeID === 6) {
            clickedRegionDetails.hotspotType = 'IMAGE';
          }
          if (clickedRegionDetails.regionTypeID === 8 || clickedRegionDetails.regionTypeID === 11) {
            regionData = getHotspotType(clickedRegionDetails.linkValue, _ );
            clickedRegionDetails.hotspotType = regionData.region;
          }
          if (clickedRegionDetails.regionTypeID === 14 || clickedRegionDetails.regionTypeID === 15 ||
                        clickedRegionDetails.regionTypeID === 13 || clickedRegionDetails.regionTypeID === 9) {
            clickedRegionDetails.hotspotType = 'DOCUMENT';
          }
          if (clickedRegionDetails.regionTypeID === 12) {
            clickedRegionDetails.hotspotType = 'VIDEO';
          }
          if (baseUrl.urlpath !== null && baseUrl.urlpath !== '' && baseUrl.urlpath !== undefined) {
            basepath = baseUrl.urlpath;
          }
        } else if (clickedRegionDetails.linkTypeID === 9) {
          if (clickedRegionDetails.regionTypeID === 1) {
            clickedRegionDetails.hotspotType = 'AUDIO';
          }
          if (clickedRegionDetails.regionTypeID === 6) {
            clickedRegionDetails.hotspotType = 'IMAGE';
          }
          if (clickedRegionDetails.regionTypeID === 8 || clickedRegionDetails.regionTypeID === 11) {
            regionData = getHotspotType(clickedRegionDetails.linkValue, _ );
            clickedRegionDetails.hotspotType = regionData.region;
          }
          if (clickedRegionDetails.regionTypeID === 14 || clickedRegionDetails.regionTypeID === 15 ||
                        clickedRegionDetails.regionTypeID === 13 || clickedRegionDetails.regionTypeID === 9) {
            clickedRegionDetails.hotspotType = 'DOCUMENT';
          }
          if (clickedRegionDetails.regionTypeID === 12) {
            clickedRegionDetails.hotspotType = 'VIDEO';
          }
          if (baseUrl.virtuallearningassetpath !== null && baseUrl.virtuallearningassetpath !== ''
            && baseUrl.virtuallearningassetpath !== undefined) {
            basepath = baseUrl.virtuallearningassetpath;
          }
        } else if (clickedRegionDetails.linkTypeID === 15) {
          regionData = getHotspotType(clickedRegionDetails.linkValue, _ );
          clickedRegionDetails.hotspotType = regionData.region;
          if (baseUrl.chromelessurlpath !== null && baseUrl.chromelessurlpath !== ''
            && baseUrl.chromelessurlpath !== undefined) {
            basepath = baseUrl.chromelessurlpath;
          }
        }
        if (clickedRegionDetails.hotspotType !== 'PAGENUMBER' || clickedRegionDetails.hotspotType !== 'EMAIL'
          || clickedRegionDetails.hotspotType !== 'LTILINK') {
          if (!(_.startsWith(clickedRegionDetails.linkValue, 'http'))
            && !(_.startsWith(clickedRegionDetails.linkValue, 'https'))) {
            if (basepath !== undefined) {
              clickedRegionDetails.linkValue = basepath + clickedRegionDetails.linkValue;
            }
          }
          if (_.startsWith(clickedRegionDetails.linkValue, 'https://mediaplayer.pearsoncmg.com/assets') ||
            _.startsWith(clickedRegionDetails.linkValue, 'http://mediaplayer.pearsoncmg.com/assets')) {
            clickedRegionDetails.hotspotType = 'SPPASSET';
          }
          if (clickedRegionDetails.hotspotType === 'URL') {
            if ((clickedRegionDetails.linkValue).indexOf('pearson') === -1) {
              clickedRegionDetails.hotspotType = 'EXTERNALLINK';
            } else if ((clickedRegionDetails.linkValue).indexOf('pearson') !== -1
              && (_.endsWith(clickedRegionDetails.linkValue, '.htm') ||
                _.endsWith(clickedRegionDetails.linkValue, '.html'))) {
              clickedRegionDetails.hotspotType = 'EXTERNALLINK';
            }
            if (youtubeRegex.test(clickedRegionDetails.linkValue)) {
              clickedRegionDetails.hotspotType = 'VIDEO';
            }
          }
        }        
     return clickedRegionDetails;
}

/* Method for removing hotspot content on clicking the close button*/
export function onHotspotClose() {
  try {
    $('#hotspot').empty();
    $('#player-iframesppModalBody').remove();
    $('#sppModal').css('display', 'none');
  } catch (e) {
    // error
  }
}

/* Method to handle mouse hover event for transparent hotsopts*/
export function handleTransparentRegionHover(hotspotID) {
  const transparentRegion = document.getElementById(hotspotID);
  if (bookFeatures.isunderlinehotspot === true && transparentRegion.transparent !== true) {
    transparentRegion.style.borderBottomColor = bookFeatures.underlinehotppothovercolor;
  } else if (bookFeatures.isunderlinehotspot === true && transparentRegion.transparent === true) {
    transparentRegion.style.borderBottomColor = bookFeatures.underlinehotppothovercolor;
    transparentRegion.style.borderBottomWidth = `${bookFeatures.underlinehotspotthickness}px`;
    transparentRegion.style.borderBottomStyle = 'solid';
  } else {
    transparentRegion.style.background = convertHexToRgba(bookFeatures.hotspotcolor, bookFeatures.regionhotspotalpha);
  }
}
/* Method to handle mouse out event for transparent hotsopts*/
export function handleTransparentRegionUnhover(hotspotID) {
  const transparentRegion = document.getElementById(hotspotID);
  if (bookFeatures.isunderlinehotspot === true && transparentRegion.transparent !== true) {
    transparentRegion.style.borderBottomColor = bookFeatures.underlinehotspotcolor;
  } else if (bookFeatures.isunderlinehotspot === true && transparentRegion.transparent === true) {
    transparentRegion.style.borderBottomColor = convertHexToRgba(bookFeatures.underlinehotspotcolor, 0);
    transparentRegion.style.borderBottomWidth = `${0}px`;
    transparentRegion.style.borderBottomStyle = 'none';
  } else {
    transparentRegion.style.background = convertHexToRgba(bookFeatures.hotspotcolor, 0);
  }
}
