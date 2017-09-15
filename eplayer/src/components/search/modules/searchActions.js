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
/* global fetch ,_ */
// import { clients } from '../../common/client';
// import axios from 'axios';
// import { config } from '../../../../config/environments';
// const ROOT_URL = 'http://view.dev2.ebookplus.pearsoncmg.com/ebook/ipad/searchbook?bookid=7443104&globalbookid=CM76820710&sortby=1&version=1.0&authkey=31358503403719696212017&outputformat=JSON';
import fetch from 'isomorphic-fetch';
import { eT1Contants } from '../../common/et1constants';
import { getmd5 } from '../../Utility/Util';

export const SEARCH = 'SEARCH';
export const CLEAR_SEARCH_OBJ = 'CLEAR_SEARCH_OBJ';
/* const searchActions = {
  fetch(searchText,bookID,globalBookId,ssoKey) {

    const url = 'http://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad/searchbook?bookid='+bookID+'&globalbookid='+globalBookId+'&searchtext='+searchText+'&sortby=1&version=1.0&authkey='+ssoKey+'&outputformat=JSON';

    const request = axios.get(url);

    return {
      type: SEARCH,
      payload: request

    };
  }
};
*/
/*
const searchActions = {
  fetch(searchText,bookID,globalBookId,ssoKey) {
    return {
      type: SEARCH,
      payload: clients.search.get('searchbook?bookid='+bookID+'&globalbookid='+globalBookId+'&searchtext='+searchText+'&sortby=1&version=1.0&authkey='+ssoKey+'&outputformat=JSON')


    };
  }
};*/
// let globalBookId, ssoKey,serverDetails;
const searchActions = {
  fetch(paramList, searchText) {
    const searchState = {
      searchResult: {
        results: []
      }
    };
    var searchServiceURL = paramList.searchUrl.replace('searchText', searchText);
    if(searchServiceURL.indexOf('/ebook/ipad/searchbookv2') !== -1)
    {
      // tempurl is starts with http to create hash key for matching with server
      var tempurl = searchServiceURL.replace("https","http");
      var hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
      searchServiceURL = ''+searchServiceURL+'&hsid='+hsid;
    }
    return dispatch => fetch(searchServiceURL)
      .then(response => response.json())
      .then((response) => {
        if (response && response.hits && response.wordHits.length > 0 && searchText.length >= 4) {
          let possibleSearchTxt = '';
          response.wordHits.forEach((data) => {
            possibleSearchTxt += `${data},`;
          });
          // console.log(possibleSearchTxt, paramList.searchUrl);
          response.hits.forEach((data, i) => {
            const obj = {
              contentPreview: data.contentPreview,
              id: i,
              title: data.title,
              urn: `${data.url}*${possibleSearchTxt}`
            };
            searchState.searchResult.results.push(obj);
          });
          const glossaryCollection = _.find(searchState.searchResult.results, { title: 'Glossary' });
          if (glossaryCollection && glossaryCollection.title) {
            _.remove(searchState.searchResult.results, result => result.title === 'Glossary');
            searchState.searchResult.results.unshift(glossaryCollection);
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
              resultObj.id = i;
              resultObj.urn = result.pageOrder;
              resultObj.title = result.chapterName;
              resultObj.pageNo = result.bookPageNumber;
              resultObj.contentPreview = result.bestTextSnippet;
              searchState.searchResult.results.push(resultObj);
            });
            }
          });
        }
        dispatch({ type: 'SEARCH', searchState });
      });
  },
clearSearchResults() {
    return (dispatch) => {
    dispatch({ type: CLEAR_SEARCH_OBJ });
  };
}
};


export default searchActions;
