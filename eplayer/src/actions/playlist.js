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
import { getPreferenceCallService } from './preference';
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

export const updateProdType = prodType => ({
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
      debugger;
      data.userName = response.UserName;
      if (!isFromCustomToc) {
        const bookshelfUrl = `${resources.links.authDomainUrl[domain.getEnvType()]}/eplayer`;
        localStorage.setItem('backUrl', bookshelfUrl);
      }
      PlaylistApi.doGetBookDetails(data)
        .then(response => response.json())
        .then((response) => {
          // Changing content urls to secured url
          response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
          response.bookDetail.metadata.toc = Utilities.changeContentUrlToSecured(response.bookDetail.metadata.toc);

          dispatch(getBookDetails(response));
          bookId = response.bookDetail.bookId;
          const bookDetailInfo = response;
          tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);

          if (domain.getEnvType() === 'dev') {
            tocUrl = tocUrl.replace(contentUrl.SecuredUrl.dev, contentUrl.SecuredUrl.qa);
          }

          bookDetails = response.bookDetail.metadata;
          piToken = data.piToken;

          PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken, data).then(response => response.json())
          .then((response) => {
            // Changing content urls to secured url
            response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
            response.provider = Utilities.changeContentUrlToSecured(response.provider);

            const tocResponse = response.content;
            tocResponse.mainTitle = bookDetails.title;
            tocResponse.author = bookDetails.creator;
            tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


            tocResponse.list = [];
            const tocItems = tocResponse.items;
            const listData = tocItems.map((itemObj) => {
              let subItems = [];
              if (itemObj.items) {
                subItems = itemObj.items.map((n) => {
                  let children = [];
                  if (n.items && n.items.length) {
                    children = n.items.map(child => Object.assign(
                      { ...child }, { level: 2, additionalInfo: { key: 'chapterId', chapterId: itemObj.id } }
                      ));
                  }
                  return {
                    urn: n.id,
                    href: n.href,
                    id: n.id,
                    playOrder: n.playOrder,
                    title: n.title,
                    children,
                    level: 1,
                    additionalInfo: { key: 'chapterId', chapterId: itemObj.id }
                  };
                });
              }
              return {
                id: itemObj.id,
                urn: itemObj.id,
                title: itemObj.title,
                coPage: itemObj.coPage,
                playOrder: itemObj.playOrder,
                children: subItems,
                href: itemObj.href,
                level: 0,
                additionalInfo: { key: 'chapterId', chapterId: itemObj.id }
              };
            });
            tocResponse.list = listData;
            delete tocResponse.items;
            const tocFinalModifiedData = { content: tocResponse, bookDetails };
            dispatch(getTocCompleteDetails(tocFinalModifiedData));
            const result = [];
            const resultAttr = ['id', 'title', 'href', 'additionalInfo'];
            const playlistData = {};
            function prepareFlatten(items) {
              _.forEach(items, (item) => {
                if (item.children && item.children.length) {
                  const newItem = {
                    type: 'page'
                  };
                  if (item.level === 0) {
                    newItem.chapterHeading = true;
                  }
                  _.forEach(resultAttr, (attr) => {
                    newItem[attr] = item[attr];
                  });
                  result.push(newItem);
                  prepareFlatten(item.children);
                } else {
                  const newItem = {
                    type: 'page'
                  };
                  _.forEach(resultAttr, (attr) => {
                    newItem[attr] = item[attr];
                  });
                  result.push(newItem);
                }
              });
            }
            prepareFlatten(tocFinalModifiedData.content.list);
            //  Changing content urls to secured url
            playlistData.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
            playlistData.provider = Utilities.changeContentUrlToSecured(response.provider);
            playlistData.content = result;
            dispatch(getPlaylistCompleteDetails(playlistData));
            if (isFromCustomToc) {
              dispatch(getCustomPlaylistCompleteDetails());
            }

            let currentPageInfo = {};
            if (data.pageId) {
              currentPageInfo = find(playlistData.content, list => list.id === data.pageId);
            } else {
              currentPageInfo = (playlistData.content[0].playOrder == 0) ? playlistData.content[1] : playlistData.content[0];
            }
            let bookTitle = '';
            if (courseDetailInfo.userCourseSectionDetail && courseDetailInfo.userCourseSectionDetail.section && courseDetailInfo.userCourseSectionDetail.section.sectionTitle) {
              bookTitle = courseDetailInfo.userCourseSectionDetail.section.sectionTitle;
            }
            const dataLayerObj = {
              eventCategory: 'Chapter',
              event: 'chapterStarted',
              eventAction: 'Chapter Started',
              href: currentPageInfo && currentPageInfo.href ? currentPageInfo.href : '',
              firstSectionEntered: currentPageInfo.title,
              bookTitle,
              playOrder: currentPageInfo && currentPageInfo.playOrder ? currentPageInfo.playOrder : ''
            };
              // Custom dimension for initial Master Play List
            dataLayer.push(dataLayerObj);
          });
        });
    });

export const getBookTocCallService = data => dispatch =>
  PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
    .then((response) => {
      // Changing content urls to secured url
      response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
      response.provider = Utilities.changeContentUrlToSecured(response.provider);

      const tocResponse = response.content;
      tocResponse.mainTitle = bookDetails.title;
      tocResponse.author = bookDetails.creator;
      tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


      tocResponse.list = [];
      const tocItems = tocResponse.items;
      const listData = tocItems.map((itemObj) => {
        let subItems = [];
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
      if (window.location.pathname.indexOf('/eplayer/course/') > -1) {
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

export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const getCourseCallServiceForRedirect = data => dispatch => PlaylistApi.doGetCourseDetailsForRedirct(data)
  .then(response => response.json())
  .then((response) => {
    if (response.status >= 400) {
      // dispatch(getBookDetails(response));
      browserHistory.push(`/eplayer/error/${response.status}`);
      return false;
    }
    const getSectionDetails = response.userCourseSectionDetail;
    const getBookId = getSectionDetails.section.sectionId;
    const studentCheck = resources.constants.iseEnabled;
    const instructorCheck = resources.constants.idcDashboardEnabled;
    if (studentCheck && getSectionDetails.authgrouptype == 'student') {
         // redirectToZeppelin(bookDetails, passportDetails);
      redirectToIse(getBookId);
    }
    else if (instructorCheck && getSectionDetails.authgrouptype == 'instructor') {
      const productType = getSectionDetails.section.extras.metadata.productModel;
      const prodType = productType;
      const courseId = getBookId;
      redirectToIDCDashboard(prodType, courseId);
    }
  });

export const getCourseCallService = (data, isFromCustomToc) => dispatch => PlaylistApi.doGetCourseDetails(data)
  .then(response => response.json())
  .then((response) => {
    if (response.status >= 400) {
      dispatch(getBookDetails(response));
      browserHistory.push(`/eplayer/error/${response.status}`);
      return false;
    }
    const courseDetailInfo = response;
     // Changing content urls to secured url
    response.userCourseSectionDetail.baseUrl = Utilities.changeContentUrlToSecured(response.userCourseSectionDetail.baseUrl);
    response.userCourseSectionDetail.bookCoverImageUrl = Utilities.changeContentUrlToSecured(response.userCourseSectionDetail.bookCoverImageUrl);
    response.userCourseSectionDetail.toc = Utilities.changeContentUrlToSecured(response.userCourseSectionDetail.toc);

    dispatch(getBookDetails(response));
    const baseUrl = response.userCourseSectionDetail.baseUrl;
    tocUrl = getTocUrlOnResp(response.userCourseSectionDetail.toc);

    if (domain.getEnvType() === 'dev') {
      tocUrl = tocUrl.replace(contentUrl.SecuredUrl.dev, contentUrl.SecuredUrl.qa);
    }

    bookDetails = response.userCourseSectionDetail;
    piToken = data.piToken;
    bookId = bookDetails.section.sectionId;

    if (!isFromCustomToc) {
      const getPreferenceData = {
        userId: data.userId,
        bookId,
        piToken: localStorage.getItem('secureToken')
      };
      dispatch(getPreferenceCallService(getPreferenceData));
      const passportDetails = response.passportPermissionDetail;
      const url = window.location.href;
      const getsourceUrl = localStorage.getItem('sourceUrl');
      let getOriginUrl = localStorage.getItem('backUrl');
      if (getsourceUrl === 'bookshelf') {
        getOriginUrl = `${resources.links.authDomainUrl[domain.getEnvType()]}/eplayer`;
      }
      else if (!getsourceUrl && !data.prdType) {
        getOriginUrl = resources.links.consoleUrl[domain.getEnvType()];
        const zeppelinCheck = resources.constants.zeppelinEnabled;
        if (zeppelinCheck && bookDetails.authgrouptype == 'student' && passportDetails && !passportDetails.access) {
          redirectToZeppelin(bookDetails, passportDetails, url);
          return false;
        }
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

    PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
    .then((response) => {
      // Changing content urls to secured url
      response.baseUrl = Utilities.changeContentUrlToSecured(response.baseUrl);
      response.provider = Utilities.changeContentUrlToSecured(response.provider);

      const tocResponse = response.content;
      tocResponse.mainTitle = bookDetails.title;
      tocResponse.author = bookDetails.creator;
      tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


      tocResponse.list = [];
      const tocItems = tocResponse.items;
      const listData = tocItems.map((itemObj) => {
        let subItems = [];
        if (itemObj.items) {
          subItems = itemObj.items.map((n) => {
            let children = [];
            if (n.items && n.items.length) {
              children = n.items.map(child => Object.assign(
                { ...child }, { level: 2, additionalInfo: { key: 'chapterId', chapterId: itemObj.id } }
                ));
            }
            return {
              urn: n.id,
              href: n.href,
              id: n.id,
              playOrder: n.playOrder,
              title: n.title,
              children,
              level: 1,
              additionalInfo: { key: 'chapterId', chapterId: itemObj.id }
            };
          });
        }
        return {
          id: itemObj.id,
          urn: itemObj.id,
          title: itemObj.title,
          coPage: itemObj.coPage,
          playOrder: itemObj.playOrder,
          children: subItems,
          href: itemObj.href,
          level: 0,
          additionalInfo: { key: 'chapterId', chapterId: itemObj.id }
        };
      });
      tocResponse.list = listData;
      delete tocResponse.items;
      const tocFinalModifiedData = { content: tocResponse, bookDetails };
      dispatch(getTocCompleteDetails(tocFinalModifiedData));
      const result = [];
      const resultAttr = ['id', 'title', 'href', 'additionalInfo'];
      const playlistData = {};
      function prepareFlatten(items) {
        _.forEach(items, (item) => {
          if (item.children && item.children.length) {
            const newItem = {
              type: 'page'
            };
            if (item.level === 0) {
              newItem.chapterHeading = true;
            }
            _.forEach(resultAttr, (attr) => {
              newItem[attr] = item[attr];
            });
            result.push(newItem);
            prepareFlatten(item.children);
          } else {
            const newItem = {
              type: 'page'
            };
            _.forEach(resultAttr, (attr) => {
              newItem[attr] = item[attr];
            });
            result.push(newItem);
          }
        });
      }
      prepareFlatten(tocFinalModifiedData.content.list);
      const securl = baseUrl.replace(/^http:\/\//i, 'https://');
      playlistData.baseUrl = securl;

        // Changing content urls to secured url
      playlistData.baseUrl = Utilities.changeContentUrlToSecured(playlistData.baseUrl);
      playlistData.provider = Utilities.changeContentUrlToSecured(response.provider);
      playlistData.content = result;
      dispatch(getPlaylistCompleteDetails(playlistData));
      if (isFromCustomToc) {
        dispatch(getCustomPlaylistCompleteDetails());
      }

      let currentPageInfo = {};
      if (data.pageId) {
        currentPageInfo = find(playlistData.content, list => list.id === data.pageId);
      } else {
        currentPageInfo = (playlistData.content[0].playOrder == 0) ? playlistData.content[1] : playlistData.content[0];
      }
      let bookTitle = '';
      if (courseDetailInfo.userCourseSectionDetail && courseDetailInfo.userCourseSectionDetail.section && courseDetailInfo.userCourseSectionDetail.section.sectionTitle) {
        bookTitle = courseDetailInfo.userCourseSectionDetail.section.sectionTitle;
      }
      const dataLayerObj = {
        eventCategory: 'Chapter',
        event: 'chapterStarted',
        eventAction: 'Chapter Started',
        href: currentPageInfo && currentPageInfo.href ? currentPageInfo.href : '',
        firstSectionEntered: currentPageInfo.title,
        bookTitle,
        playOrder: currentPageInfo && currentPageInfo.playOrder ? currentPageInfo.playOrder : ''
      };
        // Custom dimension for initial Master Play List
      dataLayer.push(dataLayerObj);
    });
  });

export const getAuthToken = webToken => dispatch =>
   PlaylistApi.doGetAuthToken(webToken).then(response => response.json())
    .then((response) => {
      if (response.name && response.value) {
        const authToken = `${response.name}=${response.value};path=/`;
        document.cookie = authToken;
          // dispatch(getAuthTokenResponse(authToken));
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

function redirectToZeppelin(bookDetails, passportDetails, url) {
  let successOriginUrl,
    errOriginUrl;
  const userAccess = {
    userType: bookDetails.authgrouptype,
    institutionId: bookDetails.section.extras.organizationId,
    productId: passportDetails.productId,
    appAccess: passportDetails.access,
    launchUrl: bookDetails.section.extras.metadata.launchUrl
  };
  if (window.location.pathname.indexOf('/eplayer/course/') > -1) {
    // successOriginUrl = resources.links.consoleUrl[domain.getEnvType()];
    successOriginUrl = url;
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
