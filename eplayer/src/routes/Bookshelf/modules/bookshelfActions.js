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

/*export const storeUPdfUrl = (uPdf) => {
  return {
    type: 'UPDF',
    uPdf
  }
}

export const storeBookServerDetails = (serverDetails) => {
  return {
    type: 'SERVERDETAILS',
    serverDetails
  }
}*/

export const storeBookDetails = (book) => {
  return {
    type: 'BOOK_DETAILS',
    authorName:book.author,
    thumbnail:book.image,
    title:book.title,
    globalBookId:book.globalBookId,
    bookeditionid:book.bookeditionid,
    uPdf:book.updfUrl,
    serverDetails:book.bookServerUrl,
    bookId:book.bookId,
    uid:book.userInfoLastModifiedDate,
    ubd:book.userBookLastModifiedDate,
    ubsd:book.userBookScenarioLastModifiedDate
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
