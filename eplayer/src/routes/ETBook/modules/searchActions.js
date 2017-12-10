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

function keyIndex(arr, key) {
  return arr.findIndex(item => (key === item.category));
}
function searchTitle(titles, key) {
  return titles[key].id === key ? titles[key].defaultMessage : key;
}
function getSearchFormat(response) {
  const searchResults = [];
  //const response = JSON.parse(localStorage.searchData);
  const titles = message;
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
        
        let obj = {
          content : product.matchedFields['term'] || product.matchedFields['chaptertitle'],
          id: product.source && product.source.url ? product.source.url.split("OPS")[1] + '*' + boldTxt : '' 
        };
        obj.content = obj.content.replace('[', '').replace(']', '');
        results.push(obj);
      });
      let searchObj = {
        category : result.key in titles ? searchTitle(titles, result.key) : result.key,
        results
      }
      searchResults.push(searchObj);
    });
    return searchResults;
  }
  return searchResults;
}

function fetchSearchInfo(searchcontent, handleResults, payLoad) {
  payLoad.queryString = searchcontent;
  payLoad.filter=[];
  payLoad.filter.push("indexid:"+window.localStorage.getItem('searchIndexId'));
  console.log(resources.links.etextSearchUrl[domain.getEnvType()],payLoad)
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

const searchActions = {

  search(searchcontent, handleResults) {
    payLoad.responseSize = 100;
    fetchSearchInfo(searchcontent, handleResults, payLoad);
  },
  autoComplete(searchcontent, handleResults) {
    payLoad.responseSize = 6;
    fetchSearchInfo(searchcontent, handleResults, payLoad);
  }
};

export default searchActions;