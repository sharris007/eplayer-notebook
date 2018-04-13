import _ from 'lodash/find';
import fetch from 'isomorphic-fetch';
import { getmd5 } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';

export function search(inputParams, searchText, handleResults) {
  const searchData = [];
  const resultData = {};
  const resultsList = [];
  if (inputParams.serverDetails === undefined || inputParams.bookId === undefined ||
    inputParams.globalBookId === undefined || inputParams.version === undefined ||
    inputParams.ssoKey === undefined || searchText === undefined || handleResults === undefined) {
    return;
  }
  const serverDetails = inputParams.serverDetails;
  const bookid = inputParams.bookId;
  const globalbookid = inputParams.globalBookId;
  const version = inputParams.version;
  const ssoKey = inputParams.ssoKey;
  var termToSearch;
  if (searchText.value !== undefined) {
    termToSearch = searchText.value;
  } else {
    termToSearch = searchText;
  }
  const searchUrl = `${serverDetails}/ebook/pdfplayer/searchbook?bookid=${bookid}`
        + `&globalbookid=${globalbookid}&searchtext=searchTerm&sortby=1&version=${version}&authkey=${ssoKey}`;
  let searchServiceURL = searchUrl.replace('searchTerm', termToSearch);
  if (searchServiceURL.indexOf('/ebook/pdfplayer/searchbook') !== -1) {
    // tempurl is starts with http to create hash key for matching with server
    const tempurl = searchServiceURL.replace('https', 'http');
    const hsid = getmd5(eT1Contants.MD5_SECRET_KEY + tempurl);
    searchServiceURL = `${searchServiceURL}&hsid=${hsid}`;
  }
  return  fetch(searchServiceURL)
    .then(response => response.json())
    .then((response) => {
      if (response && response.hits && response.wordHits.length > 0 && searchText.length >= 4) {
        let possibleSearchTxt = '';
        response.wordHits.forEach((data) => {
          possibleSearchTxt += `${data},`;
        });
        response.hits.forEach((data) => {
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
          if (jsonData.status !== null) {
            const searchResults = jsonData.searchTextList;
            searchResults.forEach((result) => {
              const resultObj = {

              };
              resultObj.id = result.pageOrder;
              if (result.chapterName === undefined) {
                resultObj.content = `Page ${result.bookPageNumber}<br/><br/><hr>`;
              } else {
                resultObj.content = `Page ${result.bookPageNumber} - <em>${result.chapterName}</em><br/><br/>
                ${result.bestTextSnippet}<br/><br/><hr>`;
              }
              resultObj.type = 'Page';
              resultsList.push(resultObj);
            });
          }
        });
      }
      resultData.category = 'Search Results';
      resultData.results = resultsList;
      if (resultsList.length > 0) {
        searchData.push(resultData);
      }
      if (searchText.requestID !== undefined) {
        handleResults(searchData,searchText.requestID);
      } else {
        handleResults(searchData);
      }
      return searchData;
    });
}

export default search;
