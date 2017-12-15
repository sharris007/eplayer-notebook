import { resources, domain, typeConstants } from '../../../../const/Settings';
import message from '../../../defaultMessages';

const searchFilters = {
  indexType: 'nextcontent',
  fieldsToReturn: ['chaptertitle', 'pagetitle', 'learningobjectives', 'content', 'type', 'glossary', 'figure'],
  fields: ['chaptertitle', 'glossary.word', 'glossary.text', 'learningobjectives.authoredtext', 'pagetitle'],
  highlightFields: ['chaptertitle', 'glossary.word', 'glossary.text', 'pagetitle', 'learningobjectives.authoredtext', 'content', 'figure.title']
};

const payLoad = { 
  "queryString":"",
  "indexType":"nextcontent",
  "filter":[], 
  "responseSize":50,
  "searchOnMultipleIndexes":"true",
  "searchType":"FACET",
  "groupBy":["_index"]
};

let searchResults = [];
let searchResultLength = 0;

function keyIndex(arr, key) {
  return arr.findIndex(item => (key === item.category));
}
function searchTitle(titles, key) {
  return titles[key].id === key ? titles[key].defaultMessage : key;
}
function getSearchFormat(response) {
  //const response = JSON.parse(localStorage.searchData);
  const titles = message;
  searchResults = [];
  searchResultLength = 0;
  if (response.searchResults && response.searchResults.length > 0) {
    response.searchResults.forEach((result) => {
      let results = [];
      result.productsList.forEach((product) => {
        let boldTxt = ''
        if(product.source && product.source.url) {
          let searchContent = product.matchedFields['term'] || product.matchedFields['chaptertitle'];
          const startPos = searchContent.indexOf('<em>') +4;
          boldTxt = searchContent.substring(startPos, searchContent.indexOf('</em>',startPos));
        }
        let content = '';let id='';
        content = product.matchedFields['term'] || product.matchedFields['chaptertitle'];
        id = product.source && product.source.url ? `${product.source.url.split("OPS")[1]}*${boldTxt}` : '';
        if(result.key === "glossaryTerms" && product.source) {
          if(product.source.meaning) {
            content = content + '<br/>' + product.source.meaning;
          }
          if(product.source.key) {
            id = `${id}*key=${product.source.key}`;
          }
        }
        let obj = {
          content,
          id 
        };
        obj.content = obj.content.replace('[', '').replace(']', '');
        results.push(obj);
        if(obj.content)
          searchResultLength++;
      });
      let searchObj = {
        category : result.key in titles ? searchTitle(titles, result.key) : result.key,
        results
      }
      searchResults.push(searchObj);
    });
    pushSearchInfoToDataLayer(payLoad.queryString,searchResultLength);
    console.log(searchResults);
    return searchResults;
  }
  pushSearchInfoToDataLayer(payLoad.queryString,0);
  return searchResults;
}

function pushSearchInfoToDataLayer(queryString,searchResultslength) {
  let obj = {
      'event': 'searchResult',
      'term': queryString,
      'numberOfResults': searchResultslength
  };
  dataLayer.push(obj);
  console.log(obj);
}

function fetchSearchInfo(searchcontent, handleResults, payLoad) {
  payLoad.queryString = searchcontent;
  payLoad.filter=[];
  payLoad.filter.push("indexid:"+window.localStorage.getItem('searchIndexId'));
  console.log(resources.links.etextSearchUrl[domain.getEnvType()],payLoad);
  fetch(resources.links.etextSearchUrl[domain.getEnvType()], 
    {
      method: 'POST',
      headers: {
        'application-id': 'ereader',
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('secureToken')
      },
      body: JSON.stringify(payLoad)
    }).then(response => response.json())
   .then((response) => {
     handleResults((getSearchFormat(response)));
   });
}

function fetchMoreResults(searchcontent,handleResults) {
  let searchUrl= resources.links.etextSearchMoreResults[domain.getEnvType()] + '/search?indexId=' + window.localStorage.getItem('searchIndexId') + '&q='+searchcontent+'&s=0&n=' + resources.constants.TextSearchLimit;
  fetch(searchUrl)
      .then(response => response.json())
      .then((response) => {
        if(response) {
          let searchObj = {};
          let possibleSearchTxt = '';
          if(response.wordHits) {
            response.wordHits.forEach((data) => {
              possibleSearchTxt += `${data},`;
            });
          }
          if(response.hits.length > 0) {
            let searchMoreResults = [];
            searchObj.category = 'More results'
            response.hits.forEach((data, i) => {
              const obj = {
                content: data.contentPreview,
                id: `${data.url.split("OPS")[1]}##${possibleSearchTxt}`
              };
              searchMoreResults.push(obj);
              searchResultLength++;
            });
            searchObj.results = searchMoreResults;
            searchResults.push(searchObj);
            handleResults(searchResults);
            pushSearchInfoToDataLayer(searchcontent,searchResultLength);
          }
        }   
      });
}

const searchActions = {

  search(searchcontent, handleResults) {    
    fetchMoreResults(searchcontent,handleResults);
  },
  autoComplete(searchcontent, handleResults) {
    payLoad.responseSize = 6;
    fetchSearchInfo(searchcontent, handleResults, payLoad);
  }
};

export default searchActions;