import { clients } from '../../../components/common/client';


/*const bookshelfActions = {
  fetch(urn) {
    return {
      type: 'BOOKS',
      //payload: clients.scapi.get(`content/${urn}`)
      payload: clients.getBookShelf.get(`${urn}`)
    };
  }

};*/

export const fetch = (urn) => {
    return {
      type: 'BOOKS',
      //payload: clients.scapi.get(`content/${urn}`)
      payload: clients.scapi.get(`${urn}`)
    };
};

export const storeUPdfUrl = (uPdf) => {
  return {
    type: 'UPDF',
    uPdf
  }
}

export const storeBookDetails = (author,thumbnail,title,bookeditionid) => {
  return {
    type: 'BOOK_DETAILS',
    authorName:author,
    thumbnail:thumbnail,
    title:title,
    bookeditionid:bookeditionid
  }
}

export const storeSsoKey = (ssoKey) => {
  return {
    type: 'SSO_KEY',
    ssoKey
  }
}

/*export default bookshelfActions;*/
