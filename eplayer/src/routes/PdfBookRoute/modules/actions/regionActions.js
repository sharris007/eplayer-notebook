import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import { getmd5, extractTextContent } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';
import { request } from '../pdfbook';

/* Created Action creator for getting regions/hotspots. */
export function fetchRegionsInfo(inputParams, pageorder) {
  const bookState = {
    regionsData: {
      regions: []
    }
  };
  if (inputParams.bookId === undefined || inputParams.bookeditionid === undefined || inputParams.scenario === undefined
    || inputParams.roletypeid === undefined || inputParams.ssoKey === undefined ||
    inputParams.serverDetails === undefined || pageorder === undefined) {
    bookState.regionsData.fetching = false;
    bookState.regionsData.fetched = false;
    return ({ type: 'RECEIVE_REGIONS', bookState });
  }
  const bookid = inputParams.bookId;
  const bookeditionid = inputParams.bookeditionid;
  const platformId = inputParams.platform;
  const scenarioId = inputParams.scenario;
  const roleTypeID = inputParams.roletypeid;
  const sessionKey = inputParams.ssoKey;
  const bookServerURL = inputParams.serverDetails;
  let isPageFound = false;
  let foundPageId;
  let arrIndex;
  let k;


  return (dispatch) => {
    dispatch(request('regions'));
    let serviceurl;
    if (platformId === undefined || platformId === null || platformId === '') {
      serviceurl = `${bookServerURL}/ebook/pdfplayer/getregionbypageorder?bookid=${bookid}&bookeditionid=` +
      `${bookeditionid}&listval=${pageorder}&scenario=${scenarioId}&userroleid=${roleTypeID}` +
      `&authkey=${sessionKey}&outputformat=JSON`;
    } else {
      serviceurl = `${bookServerURL}/ebook/pdfplayer/getregionbypageorder?bookid=${bookid}&bookeditionid=` +
      `${bookeditionid}&listval=${pageorder}&platformid=${platformId}&scenario=${scenarioId}&userroleid=${roleTypeID}`
      + `&authkey=${sessionKey}&outputformat=JSON`;
    }
    // tempurl is starts with http to create hash key for matching with server
    const tempurl = serviceurl.replace('https', 'http');
    const hsid = getmd5(eT1Contants.MD5_SECRET_KEY + tempurl);
    return axios.get(`${serviceurl}&hsid=${hsid}`,
      {
        timeout: 20000
      }).then((response) => {
        if (response.status >= 400) {
          bookState.regionsData.fetching = false;
          bookState.regionsData.fetched = false;
          return dispatch({ type: 'RECEIVE_REGIONS', bookState });
        } else if (response.data.length) {
          for (arrIndex = 0; arrIndex < response.data[0].regionsList.length; arrIndex++) {
            response.data.forEach((region) => { // eslint-disable-line no-loop-func
              const regionObj = {};
              if (region.regionsList[arrIndex].linkTypeID !== 16) {
                regionObj.regionID = region.regionsList[arrIndex].regionID;
                regionObj.regionTypeID = region.regionsList[arrIndex].regionTypeID;
                regionObj.roleTypeID = region.regionsList[arrIndex].roleTypeID;
                regionObj.iconTypeID = region.regionsList[arrIndex].iconTypeID;
                regionObj.x = region.regionsList[arrIndex].x;
                regionObj.y = region.regionsList[arrIndex].y;
                regionObj.width = region.regionsList[arrIndex].width;
                regionObj.height = region.regionsList[arrIndex].height;
                regionObj.name = region.regionsList[arrIndex].name;
                regionObj.description = region.regionsList[arrIndex].description;
                regionObj.linkTypeID = region.regionsList[arrIndex].linkTypeID;
                regionObj.linkValue = region.regionsList[arrIndex].linkValue;
                regionObj.glossaryEntryID = region.regionsList[arrIndex].glossaryEntryID;
                regionObj.imagePath = region.regionsList[arrIndex].imagePath;
                regionObj.platformID = region.regionsList[arrIndex].platformID;
                regionObj.transparent = region.regionsList[arrIndex].transparent;
                regionObj.pageorder = region.regionsList[arrIndex].pageOrder;
                if (bookState.regionsData.regions.length > 0) {
                  for (k = 0; k < bookState.regionsData.regions.length; k++) {
                    if (bookState.regionsData.regions[k].pageId === regionObj.pageorder) {
                      isPageFound = true;
                      foundPageId = regionObj.pageorder;
                    }
                  }
                }
                if (isPageFound && foundPageId) {
                  for (k = 0; k < bookState.regionsData.regions.length; k++) {
                    if (bookState.regionsData.regions[k].pageId === foundPageId) {
                      bookState.regionsData.regions[k].hotspotList.push(regionObj);
                    }
                  }
                  isPageFound = false;
                } else {
                  const hotspotObj = {};
                  hotspotObj.pageId = regionObj.pageorder;
                  hotspotObj.hotspotList = [];
                  hotspotObj.hotspotList.push(regionObj);
                  bookState.regionsData.regions.push(hotspotObj);
                }
              }
            });
          }
        }
        bookState.regionsData.fetching = false;
        bookState.regionsData.fetched = true;
        return dispatch({ type: 'RECEIVE_REGIONS', bookState });
      });
  };
}
/* Created Action creator for getting Glossary Information. */
export function fetchGlossaryItems(inputParams, glossaryentryid) {
  if (inputParams.serverDetails === undefined || inputParams.bookId === undefined || inputParams.ssoKey === undefined
    || glossaryentryid === undefined) {
    return [];
  }
  const bookServerURL = inputParams.serverDetails;
  const bookid = inputParams.bookId;
  const sessionKey = inputParams.ssoKey;

  const bookState = {
    bookInfo: {
      glossaryInfoList: []
    }
  };
  return (dispatch) => {
    const serviceurl = `${bookServerURL}/ebook/pdfplayer/getglossary?bookid=${bookid}&glossaryentryid=${
    glossaryentryid}&authkey=${sessionKey}&outputformat=JSON`;
    // tempurl is starts with http to create hash key for matching with server
    const tempurl = serviceurl.replace('https', 'http');
    const hsid = getmd5(eT1Contants.MD5_SECRET_KEY + tempurl);
    return axios.get(`${serviceurl}&hsid=${hsid}`,
      {
        timeout: 20000
      }).then((response) => {
        if (response.status >= 400) {
          return dispatch({ type: 'RECEIVE_GLOSSARY_TERM', bookState });
        } else if (response.data.length) {
          for (let arrIndex = 0; arrIndex < response.data[0].glossaryList.length; arrIndex++) {
            response.data.forEach((glossTerm) => {
              const glossaryInfo = {};
              glossaryInfo.glossaryTerm = glossTerm.glossaryList[arrIndex].glossaryTerm;
              glossaryInfo.glossaryDefinition = extractTextContent(glossTerm.glossaryList[arrIndex].glossaryDefinition);
              glossaryInfo.glossaryEntryID = glossTerm.glossaryList[arrIndex].glossaryEntryID;
              bookState.bookInfo.glossaryInfoList.push(glossaryInfo);
            });
          }
          return dispatch({ type: 'RECEIVE_GLOSSARY_TERM', bookState });
        }
        return [];
      });
  };
}

