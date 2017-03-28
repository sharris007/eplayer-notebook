import { clients } from '../../../components/common/client';
import axios from 'axios';

/*const bookshelfActions = {
  fetch(urn) {
    return {
      type: 'BOOKS',
      //payload: clients.scapi.get(`content/${urn}`)
      payload: clients.getBookShelf.get(`${urn}`)
    };
  }

};*/
export const fetch = (urn, piToken) => {
    return {
      type: 'BOOKS',
      //payload: clients.scapi.get(`content/${urn}`)
      payload: clients.getBookShelf.get(`${urn}`, {
      headers: { 'Content-Type': 'application/json',
      'X-Authorization': piToken}})
    };
};

/*export const fetch = (urn) => {
    return {
      type: 'BOOKS',
      //payload: clients.scapi.get(`content/${urn}`)
      payload: clients.getBookShelf.get(`${urn}`)
    };
};*/

export const storeUPdfUrl = (uPdf) => {
  return {
    type: 'UPDF',
    uPdf
  }
}

export const storeBookDetails = (author,thumbnail,title,globalBookId,bookeditionid) => {
  return {
    type: 'BOOK_DETAILS',
    authorName:author,
    thumbnail:thumbnail,
    title:title,
    globalBookId:globalBookId,
    bookeditionid:bookeditionid
  }
}

export const storeSsoKey = (ssoKey) => {
  return {
    type: 'SSO_KEY',
    ssoKey
  }
}

export const fetchcdnToken = () => {
  const request = axios.get('https://etext-qa-stg.pearson.com/api/nextext-api/api/nextext/eps/authtoken');
      return{
        type: 'ETEXT_CDN_TOKEN',
        payload: request
      }       
  
};

/*export default bookshelfActions;*/
