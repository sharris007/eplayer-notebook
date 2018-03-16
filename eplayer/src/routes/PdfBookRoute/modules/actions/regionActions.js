import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import { clients } from '../../../../components/common/client';
import { resources, domain } from '../../../../../const/Settings';
import { getmd5, extractTextContent} from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';
import { request } from '../pdfbook';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();
/* Created Action creator for getting regions/hotspots. */
export function fetchRegionsInfo(inputParams,pageorder){
  const bookState = {
    regionsData : {
      regions: [],
      }     
  };
  if(inputParams.bookId == undefined || inputParams.bookeditionid == undefined || inputParams.scenario == undefined 
    || inputParams.roletypeid == undefined  || inputParams.ssoKey == undefined || inputParams.serverDetails == undefined
    || pageorder == undefined)
  {
        bookState.regionsData.fetching = false;
        bookState.regionsData.fetched = false;
        return ({ type: 'RECEIVE_REGIONS',bookState});
  }
  let bookid = inputParams.bookId;
  let bookeditionid = inputParams.bookeditionid;
  let platformId = inputParams.platform;
  let scenarioId = inputParams.scenario;
  let roleTypeID = inputParams.roletypeid;
  let sessionKey = inputParams.ssoKey;
  let bookServerURL = inputParams.serverDetails;
  let isPageFound = false;
  let hotspotObj = {};
  let foundPageId;


  return (dispatch) => {
    dispatch(request('regions'));
    let serviceurl;
    if (platformId == undefined || platformId == null || platformId == "")
    {
      serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getregionbypageorder?bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+pageorder+'&scenario='+scenarioId+'&userroleid='+roleTypeID+'&authkey='+sessionKey+'&outputformat=JSON';
    }
    else
    {
      serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getregionbypageorder?bookid='+bookid+'&bookeditionid='+bookeditionid+'&listval='+pageorder+'&platformid='+platformId+'&scenario='+scenarioId+'&userroleid='+roleTypeID+'&authkey='+sessionKey+'&outputformat=JSON';
    }
    // tempurl is starts with http to create hash key for matching with server
    let tempurl = serviceurl.replace("https","http");
    let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    return axios.get(''+serviceurl+'&hsid='+hsid,
  {
  timeout: 20000
  }).then((response) => {
      if (response.status >= 400)
      {
        console.log(`fetchRegionsInfo error: ${response.statusText}`);
        bookState.regionsData.fetching = false;
        bookState.regionsData.fetched = false;
        return dispatch({ type: 'RECEIVE_REGIONS', bookState });
      }
      else if(response.data.length)
      {
          for (let i=0;i<response.data[0].regionsList.length;i++)
          {
          response.data.forEach((region) => {
          var regionObj= {};
          if(region.regionsList[i].linkTypeID !== 16)
          {
            regionObj.regionID = region.regionsList[i].regionID;
            regionObj.regionTypeID=region.regionsList[i].regionTypeID;
            regionObj.roleTypeID=region.regionsList[i].roleTypeID;
            regionObj.iconTypeID=region.regionsList[i].iconTypeID;
            regionObj.x=region.regionsList[i].x;
            regionObj.y=region.regionsList[i].y;
            regionObj.width=region.regionsList[i].width;
            regionObj.height=region.regionsList[i].height;
            regionObj.name=region.regionsList[i].name;
            regionObj.description=region.regionsList[i].description;
            regionObj.linkTypeID=region.regionsList[i].linkTypeID;
            regionObj.linkValue=region.regionsList[i].linkValue;
            regionObj.glossaryEntryID=region.regionsList[i].glossaryEntryID;
            regionObj.imagePath=region.regionsList[i].imagePath;
            regionObj.platformID=region.regionsList[i].platformID;
            regionObj.transparent=region.regionsList[i].transparent;
            regionObj.pageorder = pageorder;
            if(bookState.regionsData.regions.length > 0)
            {
              for(var k=0;k < bookState.regionsData.regions.length; k++)
              {
                if(bookState.regionsData.regions[k].pageId == regionObj.pageorder)
                {
                  isPageFound = true;
                  foundPageId = regionObj.pageorder
                }
              }
            }
            if(isPageFound && foundPageId)
            {
              for(var k=0;k < bookState.regionsData.regions.length; k++)
              {
                if(bookState.regionsData.regions[k].pageId == foundPageId)
                {
                  bookState.regionsData.regions[k].hotspotList.push(regionObj)
                }
              }
            }
            else
            {
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
      return dispatch({ type: 'RECEIVE_REGIONS',bookState});
    });
    }
  }
/* Created Action creator for getting Glossary Information. */
export function fetchGlossaryItems(inputParams, glossaryentryid){
  if(inputParams.serverDetails == undefined || inputParams.bookId == undefined || inputParams.ssoKey == undefined
    || glossaryentryid == undefined)
  {
    return
  }
  let bookServerURL = inputParams.serverDetails;
  let bookid = inputParams.bookId;
  let sessionKey = inputParams.ssoKey;

  const bookState = {
    bookInfo : {
      glossaryInfoList : [],
    }
  };
  let serviceurl = ''+bookServerURL+'/ebook/pdfplayer/getglossary?bookid='+bookid+'&glossaryentryid='+glossaryentryid+'&authkey='+sessionKey+'&outputformat=JSON';
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return dispatch =>
     axios.get(''+serviceurl+'&hsid='+hsid,
       {
         timeout: 20000
       })
    .then((response) => {
      if (response.status >= 400) {
        console.log(`fetch Glossary Items error: ${response.statusText}`);
      } else if (response.data.length) {
          for(let i=0;i<response.data[0].glossaryList.length;i++)
          {
            response.data.forEach((glossTerm) => {
              const glossaryInfo = {};
              glossaryInfo.glossaryTerm = glossTerm.glossaryList[i].glossaryTerm;
              glossaryInfo.glossaryDefinition = extractTextContent(glossTerm.glossaryList[i].glossaryDefinition);
              glossaryInfo.glossaryEntryID = glossTerm.glossaryList[i].glossaryEntryID;
              bookState.bookInfo.glossaryInfoList.push(glossaryInfo);
            });
          }
      }
      dispatch({ type: 'RECEIVE_GLOSSARY_TERM', bookState });
    });
}

