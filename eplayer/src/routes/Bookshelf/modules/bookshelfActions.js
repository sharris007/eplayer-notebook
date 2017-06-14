import { clients } from '../../../components/common/client'; /* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import axios from 'axios';
import { resources, domain } from '../../../../const/Settings';
const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const envType = domain.getEnvType();


/* Created a Action creater for Bookshelf, that will check with  type defined in Action Constant
   and called the respective Action Creator and then pass to respective reducer. Also in we have defined Headers and
   piToken that is coming from Login response in order to make Ajax request.*/

export const fetch = (urn, piToken) => {
   console.log('bookshelf Url '+ etextService[envType] + '/nextext/' + urn);
  if (piToken !== 'dummypiToken') {
   const url = etextService[envType] + '/nextext/' + urn;
    return {
      type: 'BOOKS',
      payload: axios.get(url , {
        headers: { 'Content-Type': 'application/json',
          'X-Authorization': piToken } })
         
  };
}

  return {
    type: 'BOOKS',
    payload: axios.get(`${urn}`)
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

