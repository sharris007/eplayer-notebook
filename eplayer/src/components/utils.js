/**
PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *  Copyright © 2017 Pearson Education, Inc.
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

  static changeBaseUrl = (urlList) => {
    const updUrlList = [];
    if (urlList.length > 0) {
      urlList.forEach((url) => {
        updUrlList.push(url.replace("",""))
      });
    }
  }
}
