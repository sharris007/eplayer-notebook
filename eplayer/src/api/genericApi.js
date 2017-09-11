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
/* global fetch */
import { resources, domain } from '../../const/Settings';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const pxeService = resources.links.pxeServiceUrl;
const piService = resources.links.piUserProfileApi;
const envType = domain.getEnvType();
const courseServiceUrl = resources.links.courseServiceUrl;

export const getTotalAnndata = data => fetch(`${pxeService[envType]}/context/${data.context}/annotations`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': data.user
  }
});

export const getAnndata = data => fetch(`${pxeService[envType]}/context/${data.context}/annotations?uri=${data.uri}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': data.user
  }
});// eslint-disable-line

export const postAnnData = data => fetch(`${pxeService[envType]}/context/${data.context}/annotations`, { // eslint-disable-line no-undef
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': data.user
  },
  body: JSON.stringify(data)
});

export const putAnnData = data => fetch(`${pxeService[envType]}/context/${data.context}/annotations/${data.id}`, {// eslint-disable-line no-undef
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': data.user
  },
  body: JSON.stringify(data)
});

export const deleteAnnData = data =>
 fetch(`${pxeService[envType]}/context/${data.context}/annotations/${data.annId}`, {// eslint-disable-line no-undef
   method: 'DELETE',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
     'Identity-Id': data.user
   }
 });

// ----Play list toc----------------------------------

export const getBookDetails = bookDetails =>
 fetch(`${etextService[envType]}/nextext/books/${bookDetails.context}/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=${bookDetails.userName}&courseInfo=true&includeBookData=true`, // eslint-disable-line max-len
   {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       'X-Authorization': bookDetails.piToken
     }
   });

export const getTocDetails = (bookId, tocurl, piToken) => fetch(`${etextService[envType]}/nextext/custom/toc/contextId/${bookId}?provider=${tocurl}`, {  // eslint-disable-line max-len
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
});

export const getPlaylistDetails = (bookId, tocurl, piToken) => fetch(`${etextService[envType]}/nextext/custom/playlist/contextId/${bookId}?provider=${tocurl}&removeDuplicates=true`, {  // eslint-disable-line max-len
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
});

export const getCourseDetails = bookDetails =>
 fetch(`${courseServiceUrl[envType]}/courses/${bookDetails.courseId}/sectionDetails`,
   {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       'X-Authorization': bookDetails.piToken
     }
   });

// Bookmark Api Total GET Call,
export const getTotalBookmarkData = data => fetch(`${pxeService[envType]}/context/${data.context}/identities/${data.user}/bookmarks`, {  // eslint-disable-line max-len
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': data.user
  }
});

// Bookmark Api GET Call,
export const getBookmarkData = data => fetch(`${pxeService[envType]}/context/${data.context}/identities/${data.user}/bookmarks?uri=${data.id}`, {  // eslint-disable-line max-len
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': data.user
  }
});
// Bookmark Api Post Call,

export const postBookmarkData = postData => fetch(`${pxeService[envType]}/context/${postData.context}/identities/${postData.user}/bookmarks`, {  // eslint-disable-line max-len
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id': postData.user
  },
  body: JSON.stringify(postData)
});

// Bookmark Api Delete Call,

export const deleteBookmarkData = deleteData => fetch(`${pxeService[envType]}/context/${deleteData.context}/identities/${deleteData.user}/bookmarks?uri=${deleteData.uri}`, {  // eslint-disable-line max-len
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Go to page Get call
export const getGotoPage = data => fetch(`${pxeService[envType]}/context/${data.context}/navigation/?pageNumber=${data.pagenumber}&provider=${data.baseurl}`, {  // eslint-disable-line max-len
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});


// Pi User Profile
export const getPiUserProfile = data =>fetch(`${etextService[envType]}/nextext/getUsername`, {  // eslint-disable-line max-len
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-Authorization': data.piToken
  }
})
