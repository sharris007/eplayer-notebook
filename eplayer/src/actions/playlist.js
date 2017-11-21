/** *****************************************************************************
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
/* global $ */
import PlaylistApi from '../api/playlistApi';
import { resources, domain, typeConstants } from '../../const/Settings';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';
// GET Book Details
export const getPlaylistCompleteDetails = json => ({
  type: typeConstants.GET_PLAYLIST,
  data: json,
  playlistReceived: true
});

const getCustomPlaylistCompleteDetails = () => ({
  type: 'GET_CUSTOM_PLAYLIST',
  customTocPlaylistReceived: true
});
export const gotCustomPlaylistCompleteDetails = () => ({
  type: 'GOT_CUSTOM_PLAYLIST',
  customTocPlaylistReceived: false
});

export const getTocCompleteDetails = json => ({
  type: typeConstants.GET_TOC,
  data: json,
  tocReceived: true
});

export const getBookDetails = json => ({
  type: typeConstants.BOOK_DETAILS,
  data: json,
  bookDetailsRecived: true
});


const updateTocResponse = json => ({
  type: typeConstants.GET_TOC_RESPONSE,
  data: json,
  updatedToc: true
});

const gettingTocResponse = () => ({
  type: 'GETTING_TOC_RESPONSE',
  updatedToc: false
});

const updateProdType = prodType => ({
  type: 'UPDATE_PROD_TYPE',
  prodType
});

let tocUrl = '';
let piToken = '';
let bookId = '';
let bookDetails = '';

function getTocUrlOnResp(resp) {
  let tocUrl;
  if (resp) {
    const tocArr = resp;
    $.each(tocArr, (key, value) => {
      const ext = value.substr(value.lastIndexOf('.') + 1);
      if (ext === 'xhtml') { tocUrl = value; }
    });
    if (!tocUrl) { tocUrl = resp[0]; }
  }
  return tocUrl ? tocUrl.replace('http:', 'https:') : null;
}
export const getBookPlayListCallService = (data, isFromCustomToc) => dispatch =>
  PlaylistApi.doGetPiUserDetails(data).then(response => response.json())
    .then((response) => {
      data.userName = response.UserName;
      if (!isFromCustomToc) {
        const bookshelfUrl = `${resources.links.authDomainUrl[domain.getEnvType()]}/eplayer`;
        localStorage.setItem('backUrl', bookshelfUrl);
      }
      PlaylistApi.doGetBookDetails(data)
        .then(response => response.json())
        .then((response) => {
          dispatch(getBookDetails(response));
          bookId = response.bookDetail.bookId;

          tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);
          bookDetails = response.bookDetail.metadata;
          piToken = data.piToken;
          PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
            .then((response) => {
              dispatch(getPlaylistCompleteDetails(response));
              if (isFromCustomToc) {
                dispatch(getCustomPlaylistCompleteDetails());
              }
            });
        }
        );

    });

export const getBookTocCallService = data => dispatch =>
  PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
    .then((response) => {
      const tocResponse = response.content;
      tocResponse.mainTitle = bookDetails.title;
      tocResponse.author = bookDetails.creator;
      tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


      tocResponse.list = [];
      const tocItems = tocResponse.items;
      let subItems = [];
      const listData = tocItems.map((itemObj) => {
        if (itemObj.items) {
          subItems = itemObj.items.map(n => ({
            urn: n.id,
            href: n.href,
            id: n.id,
            playOrder: n.playOrder,
            title: n.title
          }));
        }
        return {
          id: itemObj.id,
          urn: itemObj.id,
          title: itemObj.title,
          coPage: itemObj.coPage,
          playOrder: itemObj.playOrder,
          children: subItems
        };
      });
      tocResponse.list = listData;
      delete tocResponse.items;
      const tocFinalModifiedData = { content: tocResponse, bookDetails };
      dispatch(getTocCompleteDetails(tocFinalModifiedData));
    });


export const putCustomTocCallService = (data, bookDetailsData) => dispatch =>
   PlaylistApi.doPutCustomTocDetails(data, piToken, bookId).then(response => response.json())
    .then((response) => {
      if (response.status === 'Success') {
        const tocResponse = {};
        tocResponse.mainTitle = bookDetails.title;
        tocResponse.author = bookDetails.creator;
        tocResponse.thumbnail = bookDetails.thumbnailImageUrl;
        tocResponse.list = data.tocContents;
        const tocUpdatedData = { content: tocResponse, bookDetails };
        dispatch(getTocCompleteDetails(tocUpdatedData));
      }
      dispatch(gettingTocResponse());
      dispatch(updateTocResponse(response));
      if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
        dispatch(getCourseCallService(bookDetailsData, true));
      } else {
        dispatch(getBookPlayListCallService(bookDetailsData, true));
      }
    });


export const getCourseCallService = (data, isFromCustomToc) => dispatch => PlaylistApi.doGetCourseDetails(data)
  .then(response => response.json())
  .then((response) => {
    if (response.status >= 400) {
      browserHistory.push(`/eplayer/error/${response.status}`);
      return false;
    }

    dispatch(getBookDetails(response));
    const baseUrl = response.userCourseSectionDetail.baseUrl;
    tocUrl = getTocUrlOnResp(response.userCourseSectionDetail.toc);
    bookDetails = response.userCourseSectionDetail;
    piToken = data.piToken;
    bookId = bookDetails.section.sectionId;

    if (!isFromCustomToc) {
      const passportDetails = response.passportPermissionDetail;
      const url = window.location.href;
      const n = url.search('prdType');
      let prdType = '';
      if (n > 0) {
        const urlSplit = url.split('prdType=');
        prdType = urlSplit[1];
      }
      if (!prdType) {
        localStorage.setItem('backUrl', '');
      }
      const studentCheck = resources.constants.zeppelinEnabled;
      const instructorCheck = resources.constants.idcDashboardEnabled;
      if (studentCheck && bookDetails.authgrouptype == 'student' && passportDetails && !passportDetails.access) {
        redirectToZeppelin(bookDetails, passportDetails);
        return false;
      }
      else if (instructorCheck && bookDetails.authgrouptype == 'instructor' && !prdType) {
        const productType = bookDetails.section.extras.metadata.productModel;
        const prodType = productType;
        const courseId = bookId;
        redirectToIDCDashboard(prodType, courseId);
        return false;
      }

      const getsourceUrl = localStorage.getItem('sourceUrl');
      let getOriginUrl = localStorage.getItem('backUrl');
      if (getsourceUrl === 'bookshelf') {
        getOriginUrl = `${resources.links.authDomainUrl[domain.getEnvType()]}/eplayer`;
      }
      else if (getsourceUrl === '' && !prdType) {
        getOriginUrl = resources.links.consoleUrl[domain.getEnvType()];
      }
      localStorage.setItem('sourceUrl', '');
      localStorage.setItem('backUrl', getOriginUrl);
      const checkIDCreturnUrl = url.search('returnurl=');
      if (checkIDCreturnUrl > 0) {
        const IDCreturnUrl = url.split('returnurl=')[1];
        localStorage.setItem('backUrl', decodeURIComponent(IDCreturnUrl));
      }
    }

    PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then((response) => {
        const securl = baseUrl.replace(/^http:\/\//i, 'https://');
        response.baseUrl = securl;
        dispatch(getPlaylistCompleteDetails(response));
        if (isFromCustomToc) {
          dispatch(getCustomPlaylistCompleteDetails());
        }
      });
  }

  );

function redirectToIDCDashboard(prodType, courseId) {
  const idcBaseurl = `${resources.links.idcUrl[domain.getEnvType()]}/idc?`;
  const IdcRelativeURL = `product_type=${prodType}&courseId=${courseId}`;
  const redirectIdcURL = idcBaseurl + IdcRelativeURL;
  dispatch(updateProdType(prodType));
  window.open(redirectIdcURL, '_self');
}

function redirectToZeppelin(bookDetails, passportDetails) {
  let successOriginUrl,
    errOriginUrl;
  const userAccess = {
    userType: bookDetails.authgrouptype,
    institutionId: bookDetails.section.extras.organizationId,
    productId: passportDetails.productId,
    appAccess: passportDetails.access,
    launchUrl: bookDetails.section.extras.metadata.launchUrl
  };
  if (window.location.pathname.indexOf('/eplayer/Course/') > -1) {
    successOriginUrl = resources.links.consoleUrl[domain.getEnvType()];
    errOriginUrl = resources.links.consoleUrl[domain.getEnvType()];
    localStorage.setItem('backUrl', errOriginUrl);
    // successOriginUrl = window.location.href;
    // errOriginUrl= window.location.origin+'/eplayer';

  }
  const productId = userAccess.productId,
    institutionId = userAccess.institutionId,
    courseAccess = userAccess.appAccess,
    successUrl = encodeURIComponent(successOriginUrl),
    failureUrl = encodeURIComponent(errOriginUrl),
    cancelUrl = encodeURIComponent(errOriginUrl),
    zeppelinAccessBassUrl = resources.links.zeppelinUrl[domain.getEnvType()],
    zeppelinRelativeurl = `${productId}?institutionId=${institutionId
      }&failureUrl=${failureUrl}&cancelUrl=${cancelUrl}&successUrl=${successUrl}`;
  const zeppelinRedirect = `${zeppelinAccessBassUrl}/${zeppelinRelativeurl}`;
  window.location = zeppelinRedirect;

}
