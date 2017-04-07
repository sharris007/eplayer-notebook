import { clients } from '../../common/client';
import axios from 'axios';
//import { config } from '../../../../config/environments';
//const ROOT_URL = 'http://view.dev2.ebookplus.pearsoncmg.com/ebook/ipad/searchbook?bookid=7443104&globalbookid=CM76820710&sortby=1&version=1.0&authkey=31358503403719696212017&outputformat=JSON';

export const SEARCH = 'SEARCH';

/*const searchActions = {
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
const searchActions = {
 fetch(paramList,searchText)
 {
 	const bookId=paramList.bookId;
 	const globalBookId=paramList.globalBookId;
 	const ssoKey=paramList.ssoKey;
  const serverDetails=paramList.serverDetails;

  const searchState = {
      searchResult:{
        results: []
      }
  };
  return(dispatch)=>{
    return axios.get(''+serverDetails+'/ebook/ipad/searchbook?bookid='+bookId+'&globalbookid='+globalBookId+'&searchtext='+searchText+'&sortby=1&version=1.0&authkey='+ssoKey+'&outputformat=JSON',
    {
      timeout: 20000
    })
    .then((response) => {
      if (response.status >= 400) {
        console.log(`SearchBook info error: ${response.statusText}`);
      } else if(response.data.length) {
        response.data.forEach((jsonData) =>{
          const searchResults =jsonData.searchTextList;
          searchResults.forEach((result,i) =>{
            const resultObj={

            };
          resultObj.id=i;
          resultObj.urn=result.pageOrder;
          resultObj.title=result.chapterName;
          resultObj.pageNo=result.pageOrder;
          resultObj.contentPreview=result.bestTextSnippet;
          searchState.searchResult.results.push(resultObj);
        });
      });
    }
    dispatch({ type: 'SEARCH',searchState});
    });
  };

 }
};
export default searchActions;