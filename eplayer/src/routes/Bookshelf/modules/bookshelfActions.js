import axios from 'axios';
import { resources, domain } from '../../../../const/Settings';

const security = (resources.constants.secureApi === true ? 'courseServiceUrl' : 'courseServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();


/* Created a Action creater for Bookshelf, that will check with  type defined in Action Constant
   and called the respective Action Creator and then pass to respective reducer. Also in we have defined Headers and
   piToken that is coming from Login response in order to make Ajax request.*/

export const fetch = (urn, piToken) => {
  // console.log('bookshelf Url '+ etextService[envType] + '/nextext/' + urn);
  if (piToken !== 'dummypiToken') {
    const url = `${etextCourseService[envType]}/compositeBookShelf`;
    return {
      type: 'BOOKS',
      payload: axios.get(url, {
      headers: { 'Content-Type': 'application/json',
        'X-Authorization': piToken } 
      })
    };
  }

  return {
    type: 'BOOKS',
    payload: axios.get(`${urn}`)
  };
};

export const getAuthToken = (piToken) => {
  const url = `${etextService[envType]}/nextext/eps/authtoken`;
  return {
    type: 'AUTH',
    payload: axios.get(url, {
    headers: { 'Content-Type': 'application/json',
      'X-Authorization': piToken } 
    })
  };
   
};
export const gotAuthToken = (status) => {
  const url = `${etextService[envType]}/nextext/eps/authtoken`;
  return {
    type: 'GOTAUTH',
    payload: {
      authFetched : status
    }
  };
   
};

/* Created a Action creater for BOOK_DETAILS, contains all the Book data like, authorName, thumbnail, title and so on.  */

export const storeBookDetails = book => ({
  type: 'BOOK_DETAILS',
  authorName: book.author,
  thumbnail: book.image,
  title: book.title,
  globalBookId: book.globalBookId,
  bookeditionid: book.bookeditionid,
  uPdf: book.updfUrl,
  serverDetails: book.bookServerUrl,
  bookId: book.bookId,
  uid: book.userInfoLastModifiedDate,
  ubd: book.userBookLastModifiedDate,
  ubsd: book.userBookScenarioLastModifiedDate,
  roleTypeID: book.roleTypeID
});

/* Created a Action creater for storing the SsoKey for session management.  */

export const storeSsoKey = ssoKey => ({
  type: 'SSO_KEY',
  ssoKey
});

