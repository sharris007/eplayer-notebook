/**
PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *  Copyright Â© 2017 Pearson Education, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 * patent applications, and are protected by trade secret or copyright law.
 * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 * is strictly forbidden unless prior written permission is obtained
 * from Pearson Education, Inc.
**/

import { domain, contentUrl } from '../../const/Settings';

export default class Utilities {
  /**
   * Formats the time in 00:00 format from time in seconds,
   *
   * @param time the time in seconds
   * @returns {string} formatted time
   */
  static sortBookmarkByPage = (bookmarks, pages) => {
    // Sort bookmark based on page ID
    const sortedBookmarkArr = [];
    if (pages && bookmarks) {
      pages.forEach((page) => {
        bookmarks.forEach((bookmark) => {
          if (page.id === bookmark.uri) {
            sortedBookmarkArr.push(bookmark);
          }
        });
      });
    }
    return sortedBookmarkArr;
  }

  static formBookmarkPayload = (reqData) => {
    const bookmarkData = {
      clientApp: "ETEXT_WEB",
      color: "",
      contextId: reqData.context,
      data: reqData,
      isBookMark: true,
      pageId: reqData.uri,
      pageNo: "",
      selectedText: "",
      sharable: "",
      status: "",
      subContextId: "",
      userId: reqData.user
    }
    const reqPayload = {
      payload : [bookmarkData]
    }
    return JSON.stringify(reqPayload);
  }

  /**
   * Checks the cookie with the name exists
   * @param cookie name
   * @returns { true/false }  
  */

  static checkCookie = (cookieName) => {
    let name = cookieName + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return true;
        }
    }
    return false;
  }

  static changeContentUrlToSecured = (urlList) => {
    const updUrlList = [];
    if (typeof(urlList) === "string") {
      return urlList.replace(contentUrl.openClass[domain.getEnvType()],contentUrl.SecuredUrl[domain.getEnvType()]);
    } else if (urlList && urlList.length > 0) {
      urlList.forEach((url) => {
        updUrlList.push(url.replace(contentUrl.openClass[domain.getEnvType()],contentUrl.SecuredUrl[domain.getEnvType()]));
      });
      return updUrlList;
    }
  }
}