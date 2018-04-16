import { resources, domain, typeConstants } from '../../../../const/Settings';
import message from '../../../defaultMessages';
import { connect } from 'react-redux';
import Utilities from '../../../components/utils';

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
let requestId = '';
let pageResult = '';
let pageContent = '';

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
      if(pageResult){
        searchResults[0].results.unshift(pageResult);
       }

    });
    pushSearchInfoToDataLayer(payLoad.queryString,searchResultLength);
   
    console.log(searchResults);
    return searchResults;
  }
   if(pageResult && (response.length == 0 || response.searchResults.length == 0)) {
      let pageObj = {  
        "category":"", 
        "results":[],           
      };     
      searchResults.push(pageObj);      
      searchResults[0].results.unshift(pageResult);
     
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

function  getPageNumberSearchResult(searchcontent){   
    let content = '';let id='';
    if(pageContent){
      let pageData = pageContent.tocNode.pages.filter(result => result.title.toUpperCase() === searchcontent.value.toUpperCase());
        if(pageData && pageData[0]){                 
          const pageIdData = pageData[0].href.split("#");                  
          let filterResult=
            //playlistData.content.filter(result =>            
          // result.href.split("#")[0] === pageIdData[0]
            //)
          playlistData.content.filter((result) => {
            let findKey = result.href ? result.href.search("#") : '-1'; 
            if((findKey != -1 && result.href.split("#")[0] === pageIdData[0]) || (result.href && result.href === pageIdData[0])){              
              return result;
            }          
          })
          if(filterResult && filterResult.length > 0){                    
            const obj = {
              content: 'Page'+ " " + searchcontent.value+": "+filterResult[0].title,
              id: pageData[0].href 
            };
              pageResult = obj; 
          }
        }
    }        
} 

function fetchSearchInfo(searchcontent, handleResults, payLoad) {
  pageResult =''
  let getbaseUrl = Utilities.secureTochangeContentUrl(playlistData.baseUrl);
  if(pageContent.baseUrl != getbaseUrl){
    pageContent = "";
  }
  if(!pageContent){
    let UrlString = window.location.href.split('/page')[0];
    //splitString
    let contextId = UrlString.substr(UrlString.lastIndexOf('/')+1);
     contextId ? contextId : 'contextid_2';
    let searchUrl = resources.links.pageNumberSearchService[domain.getEnvType()];
    let getContentUrl = Utilities.secureTochangeContentUrl(playlistData.provider);
    fetch(searchUrl+"/services-api/api/context/"+contextId+"/toc/items/root?itemContext=false&metadata=true&provider="+getContentUrl+"&providerType=epub&pageContext=true")     
        .then(response => response.json())
              .then((response) => { 
              pageContent =  response;         
              getPageNumberSearchResult(searchcontent);    
        });  
  } 
  else if(pageContent){
    getPageNumberSearchResult(searchcontent);   
  }

  payLoad.queryString = searchcontent.value;
  payLoad.filter=[];
  payLoad.filter.push("indexid:"+window.localStorage.getItem('searchIndexId'));
  requestId = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
  payLoad.requestId = requestId;
  console.log('requestId ',requestId);
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
     if(response && response.requestId && requestId === response.requestId) {
      handleResults((getSearchFormat(response)));
     } else {
       handleResults((getSearchFormat([])))
     }
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
            pushSearchInfoToDataLayer(searchcontent.value,searchResultLength);
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

const mapStateToProps = state => {
  return {   
    playlistData: state.playlistReducer.data,
    playlistReceived: state.playlistReducer.playlistReceived,
    tocData: state.playlistReducer.tocdata,
    tocResponse: state.playlistReducer.tocresponse
     
  }
};

export default connect(
  mapStateToProps,
  
)(searchActions)