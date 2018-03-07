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
import axios from 'axios';
import Hawk from 'hawk';
import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { clients } from '../../../../components/common/client';
import { resources, domain } from '../../../../../const/Settings';
import { getmd5 } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';
import fetch from 'isomorphic-fetch';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();

export function search(inputParams,searchText, handleResults) {
  let searchData = [] ;
  let resultData = {};
  let resultsList = [];

  let serverDetails = inputParams.serverDetails;
  let bookid = inputParams.bookId;
  let globalbookid = inputParams.globalBookId;
  let version = inputParams.version;
  let ssoKey = inputParams.ssoKey;

  let searchUrl = `${serverDetails}/ebook/pdfplayer/searchbook?bookid=${bookid}`
        + `&globalbookid=${globalbookid}&searchtext=searchTerm&sortby=1&version=${version}&authkey=${ssoKey}`;
  var searchServiceURL =searchUrl.replace('searchTerm', searchText);
  if(searchServiceURL.indexOf('/ebook/pdfplayer/searchbook') !== -1)
  {
    // tempurl is starts with http to create hash key for matching with server
    var tempurl = searchServiceURL.replace("https","http");
    var hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    searchServiceURL = ''+searchServiceURL+'&hsid='+hsid;
  }
  fetch(searchServiceURL)
    .then(response => response.json())
    .then((response) => {
      if (response && response.hits && response.wordHits.length > 0 && searchText.length >= 4) {
        let possibleSearchTxt = '';
        response.wordHits.forEach((data) => {
          possibleSearchTxt += `${data},`;
        });
        response.hits.forEach((data, i) => {
          const obj = {
            content: data.contentPreview,
            id: data.pageOrder,
            title: data.title,
            urn: `${data.url}*${possibleSearchTxt}`
          };
          resultsList.push(obj);
        });
        const glossaryCollection = _.find(resultsList, { title: 'Glossary' });
        if (glossaryCollection && glossaryCollection.title) {
          _.remove(resultsList, result => result.title === 'Glossary');
          resultsList.unshift(glossaryCollection);
        }
      } else if (response.status >= 400) {
        // console.log(`SearchBook info error: ${response.statusText}`);
      } else if (response.length) {
        response.forEach((jsonData) => {
          if(jsonData.status !== null){
              const searchResults = jsonData.searchTextList;
             searchResults.forEach((result, i) => {
             const resultObj = {

            };
            resultObj.id = result.pageOrder;
            if(result.chapterName == undefined)
            {
              resultObj.content = 'Page ' + result.bookPageNumber + "<br/><br/><hr>";
            }
            else
            {
              resultObj.content = "Page " + result.bookPageNumber +" - <em>" + result.chapterName + "</em><br/><br/>" + result.bestTextSnippet + "<br/><br/><hr>";
            }
            resultObj.type = "Page";
            resultsList.push(resultObj);
          });
          }
        });
      }
    resultData.category = "Search Results";
    resultData.results = resultsList;
    searchData.push(resultData);
    handleResults(searchData);
    }); 
}