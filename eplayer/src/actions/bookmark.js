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
import BookmarkApi from '../api/bookmarkApi';
import { typeConstants } from '../../const/Settings';

// GET call for Bookmark
export const getBookmarkData = json => ({
  type: typeConstants.GET_BOOKMARK,
  data: json,
  loading: true
});

export const getBookmarkCallService = filterData => dispatch => BookmarkApi.doGetBookmark(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => {
          let res = (json.response && json.response[0].isBookMark) ? { isBookmarked: true, bookmarkId: json.response[0].id } : { isBookmarked : false };
          dispatch(getBookmarkData(res))
        }
    );


 // POST call for Bookmark
export const postBookmarkData = json => ({
  type: typeConstants.POST_BOOKMARK,
  data: json,
  loading: true
});

// Bookmark Total Get call
export const getTotalBookmarkData = json => ({
  type: typeConstants.GET_TOTALBOOKMARK,
  data: json
});

export const postBookmarkCallService = filterData => dispatch => BookmarkApi.doPostBookmark(filterData)
    .then(response => response.json())
    .then((json) => {
      const resp = json.response
      if (resp && resp.length) {
        resp[0].data.createdTimestamp = resp[0].createdTime;
        resp[0].data.id = resp[0].id;
        dispatch(postBookmarkData(resp[0].data));
        const bookmarks = [];
        bookmarks.push(resp[0].data);
        dispatch(getTotalBookmarkData(bookmarks));
      }
    });

 // DELETE call for Bookmark
export const deleteBookmarkData = (json, currentPageId) => ({
  type: typeConstants.DELETE_BOOKMARK,
  data: json,
  loading: true,
  currentPageId:currentPageId
});

export const deleteBookmarkCallService = filterData => dispatch => BookmarkApi.doDeleteBookmark(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(deleteBookmarkData(json, filterData.currentPageId))
    );

export const getTotalBookmarkCallService = filterData => dispatch =>
    BookmarkApi.doTotalBookmark(filterData)
    .then(response => response.json())
    .then((json) => {
      const modRes = [];
      if (json.response && json.response.length) {
        for (let i = 0; i < json.response.length; i++) {
          json.response[i].data.createdTimestamp = json.response[i].createdTime;
          json.response[i].data.id = json.response[i].id;
          modRes.push(json.response[i].data);
        }
        dispatch(getTotalBookmarkData(modRes));
      }
    }
    );
