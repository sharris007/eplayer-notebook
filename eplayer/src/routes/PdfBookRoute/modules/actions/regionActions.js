/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  *
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import Hawk from 'hawk';
import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { clients } from '../../../../components/common/client';
import { resources, domain } from '../../../../../const/Settings';
import { getmd5, extractTextContent} from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();/* Importing the client file for framing the complete url, since baseurls are stored in client file. */

/* Created Action creator for getting regions/hotspots. */
export function fetchRegionsInfo(inputParams,pageorder){
  
  let bookid = inputParams.bookId;
  let bookeditionid = inputParams.bookeditionid;
  let platformId = inputParams.platform;
  let scenarioId = inputParams.scenario;
  let roleTypeID = inputParams.roletypeid;
  let sessionKey = inputParams.ssoKey;
  let bookServerURL = inputParams.serverDetails;

  const bookState = {
    regions: [],
    isFetching: {
      regions: true
    }
  };
  return (dispatch) => {
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
      }
      else if(response.data.length)
      {
          for (let i=0;i<response.data[0].regionsList.length;i++)
          {
          response.data.forEach((region) => {
          const regionObj= {};
          if(region.regionsList[i].linkTypeID !== 16)
          {
            regionObj.regionID = region.regionsList[i].regionID;
            regionObj.globalBookID=region.regionsList[i].globalBookID;
            regionObj.regionTypeID=region.regionsList[i].regionTypeID;
            regionObj.guid=region.regionsList[i].guid;
            regionObj.roleTypeID=region.regionsList[i].roleTypeID;
            regionObj.isicon=region.regionsList[i].isicon;
            regionObj.iconTypeID=region.regionsList[i].iconTypeID;
            regionObj.page=region.regionsList[i].page;
            regionObj.x=region.regionsList[i].x;
            regionObj.y=region.regionsList[i].y;
            regionObj.width=region.regionsList[i].width;
            regionObj.height=region.regionsList[i].height;
            regionObj.name=region.regionsList[i].name;
            regionObj.description=region.regionsList[i].description;
            regionObj.note=region.regionsList[i].note;
            regionObj.linkSearch=region.regionsList[i].linkSearch;
            regionObj.linkTypeID=region.regionsList[i].linkTypeID;
            regionObj.linkTypeLocation=region.regionsList[i].linkTypeLocation;
            regionObj.linkValue=region.regionsList[i].linkValue;
            regionObj.linkX=region.regionsList[i].linkX;
            regionObj.linkY=region.regionsList[i].linkY;
            regionObj.linkWidth=region.regionsList[i].linkWidth;
            regionObj.linkHeight=region.regionsList[i].linkHeight;
            regionObj.mediaWidth=region.regionsList[i].mediaWidth;
            regionObj.mediaHeight=region.regionsList[i].mediaHeight;
            regionObj.glossaryEntryID=region.regionsList[i].glossaryEntryID;
            regionObj.imagePath=region.regionsList[i].imagePath;
            regionObj.useCustom=region.regionsList[i].useCustom;
            regionObj.readyToPublish=region.regionsList[i].readyToPublish;
            regionObj.sequenceId=region.regionsList[i].sequenceId;
            regionObj.platformID=region.regionsList[i].platformID;
            regionObj.isIpad=region.regionsList[i].isIpad;
            regionObj.hasPlatformIcon=region.regionsList[i].hasPlatformIcon;
            regionObj.regionType=region.regionsList[i].regionType;
            regionObj.linkType=region.regionsList[i].linkType;
            regionObj.iconType=region.regionsList[i].iconType;
            regionObj.roleType=region.regionsList[i].roleType;
            regionObj.alternateMediaLink=region.regionsList[i].alternateMediaLink;
            regionObj.transparent=region.regionsList[i].transparent;
            regionObj.pearsonSmartPlayer=region.regionsList[i].pearsonSmartPlayer;
            regionObj.downloadable=region.regionsList[i].downloadable;
            regionObj.isBrowserView=region.regionsList[i].isBrowserView;
            regionObj.assetSize=region.regionsList[i].assetSize;
            regionObj.assetLastModifiedDate=region.regionsList[i].assetLastModifiedDate;
            regionObj.downloadURL=region.regionsList[i].downloadURL;
            bookState.regions.push(regionObj);
          }
        });
        }
      }
      bookState.isFetching.regions=false;
      return dispatch({ type: 'RECEIVE_REGIONS',bookState});
    });
    }
  }
/* Created Action creator for getting Glossary Information. */
export function fetchGlossaryItems(inputParams,glossaryentryid) {

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