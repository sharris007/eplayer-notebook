/** *****************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *
 *  *  Copyright Â© 2017 Pearson Education, Inc.
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
import { resources, domain, typeConstants, contentUrl } from '../../const/Settings';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';
import find from 'lodash/find';
import Utilities from '../components/utils';
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
          //Changing content urls to secured url
          response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
          response.bookDetail.metadata.toc = Utilities.changeContentUrlToSecured(response.bookDetail.metadata.toc);
          
          dispatch(getBookDetails(response));
          bookId = response.bookDetail.bookId;
          let bookDetailInfo = response;
          tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);

          if (domain.getEnvType() === 'dev') {
            tocUrl = tocUrl.replace(contentUrl.SecuredUrl['dev'],contentUrl.SecuredUrl['qa']);
          }

          bookDetails = response.bookDetail.metadata;
          piToken = data.piToken;
          PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
            .then((response) => {
              //Changing content urls to secured url
              response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
              response.provider = Utilities.changeContentUrlToSecured(response.provider);

              dispatch(getPlaylistCompleteDetails(response));
              if (isFromCustomToc) {
                dispatch(getCustomPlaylistCompleteDetails());
              }
              let currentPageInfo = {};
              if(data.pageId) {
                currentPageInfo = find(response.content, list => list.id === data.pageId);
              } else {
                currentPageInfo = (response.content[0].playOrder == 0) ? response.content[1] : response.content[0];
              }
              let bookTitle = ''
              if(bookDetailInfo.bookDetail && bookDetailInfo.bookDetail.metadata && bookDetailInfo.bookDetail.metadata.title) {
                bookTitle = bookDetailInfo.bookDetail.metadata.title;
              }
              let dataLayerObj = {
                'eventCategory': 'Chapter',
                'event': 'chapterStarted',
                'eventAction': 'Chapter Started',
                'href': currentPageInfo && currentPageInfo.href ? currentPageInfo.href : '',
                'firstSectionEntered' : currentPageInfo.title,
                'bookTitle': bookTitle,
                'playOrder': currentPageInfo && currentPageInfo.playOrder ? currentPageInfo.playOrder : ''
              }
              /*Custom dimension for initial Master Play List*/
              dataLayer.push(dataLayerObj);
            });
        }
        );

    });

export const getBookTocCallService = data => dispatch =>
  PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
    .then((response) => {
      //Changing content urls to secured url
      response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
      response.provider = Utilities.changeContentUrlToSecured(response.provider);
            
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
          children: subItems,
          href: itemObj.href
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
      return response;
    });


export const tocFlag = () => (dispatch) => {
  dispatch(gettingTocResponse());
  return Promise.resolve();
};

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


export const getCourseCallService = (data, isFromCustomToc) => dispatch => PlaylistApi.doGetCourseDetails(data)
  .then(response => response.json())
  .then((response) => {
    if (response.status >= 400) {
      browserHistory.push(`/eplayer/error/${response.status}`);
      return false;
    }
    let courseDetailInfo = response;
     //Changing content urls to secured url
    response.userCourseSectionDetail.baseUrl = Utilities.changeContentUrlToSecured(response.userCourseSectionDetail.baseUrl);
    response.userCourseSectionDetail.bookCoverImageUrl = Utilities.changeContentUrlToSecured(response.userCourseSectionDetail.bookCoverImageUrl);
    response.userCourseSectionDetail.toc = Utilities.changeContentUrlToSecured(response.userCourseSectionDetail.toc);    
    
    dispatch(getBookDetails(response));
    const baseUrl = response.userCourseSectionDetail.baseUrl;
    tocUrl = getTocUrlOnResp(response.userCourseSectionDetail.toc);

    if (domain.getEnvType() === 'dev') {
      tocUrl = tocUrl.replace(contentUrl.SecuredUrl['dev'],contentUrl.SecuredUrl['qa']);
    }

    bookDetails = response.userCourseSectionDetail;
    piToken = data.piToken;
    bookId = bookDetails.section.sectionId;

    if (!isFromCustomToc) {
      const passportDetails = response.passportPermissionDetail;
      const url = window.location.href;
      const n = url.search('prdType');
      let prdType = '';
      let iseSource = '';
      const checkSource = url.search('Source=');
      if (n > 0) {
        const urlSplit = url.split('prdType=');
        prdType = getParameterByName('prdType');
        dispatch(updateProdType(prdType));
      }
      if (checkSource > 0){
        const getIseSource = getParameterByName('Source');
        dispatch(updateProdType(getIseSource));
        iseSource = true;
      }
      if (!prdType && !iseSource) {
        localStorage.setItem('backUrl', '');
      }
      const studentCheck = resources.constants.zeppelinEnabled;
      const instructorCheck = resources.constants.idcDashboardEnabled;
      if (studentCheck && bookDetails.authgrouptype == 'student' && !iseSource) {
         //redirectToZeppelin(bookDetails, passportDetails);
        redirectToIse(bookId);
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
      else if (!getsourceUrl && !prdType && !iseSource) {
        getOriginUrl = resources.links.consoleUrl[domain.getEnvType()];
      }
      localStorage.setItem('sourceUrl', '');
      localStorage.setItem('backUrl', getOriginUrl);
      let checkIDCreturnUrl = url.search('returnurl=');
      if (checkIDCreturnUrl === -1) {
        checkIDCreturnUrl = url.search('returnUrl=');
      }
      if (checkIDCreturnUrl > 0) {
        const IDCreturnUrl = getParameterByName('returnurl') || getParameterByName('returnUrl');
        localStorage.setItem('backUrl', decodeURIComponent(IDCreturnUrl));
      }
    }

    PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then((response) => {
        const securl = baseUrl.replace(/^http:\/\//i, 'https://');
        response.baseUrl = securl;

        //Changing content urls to secured url
        response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
        response.provider = Utilities.changeContentUrlToSecured(response.provider);
                
        dispatch(getPlaylistCompleteDetails(response));
        if (isFromCustomToc) {
          dispatch(getCustomPlaylistCompleteDetails());
        }

        let currentPageInfo = {};
        if(data.pageId) {
          currentPageInfo = find(response.content, list => list.id === data.pageId);
        } else {
          currentPageInfo = (response.content[0].playOrder == 0) ? response.content[1] : response.content[0];
        }
        let bookTitle = ''
        if(courseDetailInfo.userCourseSectionDetail && courseDetailInfo.userCourseSectionDetail.section && courseDetailInfo.userCourseSectionDetail.section.sectionTitle) {
          bookTitle = courseDetailInfo.userCourseSectionDetail.section.sectionTitle;
        }
        let dataLayerObj = {
          'eventCategory': 'Chapter',
          'event': 'chapterStarted',
          'eventAction': 'Chapter Started',
          'href': currentPageInfo && currentPageInfo.href ? currentPageInfo.href : '',
          'firstSectionEntered' : currentPageInfo.title,
          'bookTitle': bookTitle,
          'playOrder': currentPageInfo && currentPageInfo.playOrder ? currentPageInfo.playOrder : ''
        }
        /*Custom dimension for initial Master Play List*/
        dataLayer.push(dataLayerObj);
      });
  }

  );

export const getAuthToken = (webToken) => dispatch =>
   PlaylistApi.doGetAuthToken(webToken).then(response => response.json())
    .then((response) => {
        if(response.name && response.value) {
          const authToken = response.name+"="+response.value+ ";path=/";
          document.cookie = authToken;
          //dispatch(getAuthTokenResponse(authToken));
        }
    });

function redirectToIDCDashboard(prodType, courseId) {
  const idcBaseurl = `${resources.links.idcUrl[domain.getEnvType()]}/idc?`;
  const IdcRelativeURL = `product_type=${prodType}&courseId=${courseId}`;
  const redirectIdcURL = idcBaseurl + IdcRelativeURL;
  window.open(redirectIdcURL, '_self');
}

function redirectToIse(courseId) {
  const iseBaseurl = `${resources.links.iseUrl[domain.getEnvType()]}/courses/${courseId}/materials`;
  console.log('iseBaseurl', iseBaseurl);
  window.open(iseBaseurl, '_self');
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