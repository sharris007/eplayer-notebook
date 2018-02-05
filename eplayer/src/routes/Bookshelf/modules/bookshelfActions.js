/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
import axios from 'axios';
import { resources, domain } from '../../../../const/Settings';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();


/* Created a Action creater for Bookshelf, that will check with  type defined in Action Constant
   and called the respective Action Creator and then pass to respective reducer. Also in we have defined Headers and
   piToken that is coming from Login response in order to make Ajax request.*/

export const fetch = (urn, piToken) => {
   
  if (piToken !== 'getuserbookshelf') {
    const url = `${etextCourseService[envType]}/web/compositeBookShelf`;
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
  globalUserId: book.globalUserId,
  bookeditionid: book.bookeditionid,
  uPdf: book.updfUrl,
  serverDetails: book.bookServerUrl,
  bookId: book.bookId,
  uid: book.userInfoLastModifiedDate,
  ubd: book.userBookLastModifiedDate,
  ubsd: book.userBookScenarioLastModifiedDate,
  roleTypeID: book.roleTypeID,
  firstName: book.firstName,
  lastName: book.lastName,
  expirationDate: book.expirationDate,
  userEmailId: book.userEmailId
});

/* Created a Action creater for storing the SsoKey for session management.  */

export const storeSsoKey = ssoKey => ({
  type: 'SSO_KEY',
  ssoKey
});

