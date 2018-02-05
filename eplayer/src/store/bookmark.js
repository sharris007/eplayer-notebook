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

const initialData = {
  bookmarksData: [],
  data: {
    isBookmarked: false,
    bookmarkId: ''
  }
};
export default (state = initialData, action) => {
  switch (action.type) {
    case 'GET_BOOKMARK': {
      return {
        ...state,
        data: action.data

      };
    }
    case 'GET_TOTALBOOKMARK': {
      return {
        ...state,
        bookmarksData: state.bookmarksData.concat(action.data)
      };
    }
    case 'POST_BOOKMARK': {
      const actionData = action.data;
      actionData.isBookmarked = true;
      actionData.bookmarkId = actionData.id;
      return {
        ...state,
        data: actionData
      };
    }
    case 'DELETE_BOOKMARK': {
      const bookmarkId = action.data.successItems ? action.data.successItems[0] : '';
      let deletedBookmarkPageId=null;
      const getDeletedbookmark = state.bookmarksData.filter((bookmark) => {
        deletedBookmarkPageId = deletedBookmarkPageId?deletedBookmarkPageId:(bookmark.id===bookmarkId?bookmark.source.id:null)
        return bookmark.id !== bookmarkId;
      });
      return {
        ...state,
        bookmarksData: getDeletedbookmark,
        data: deletedBookmarkPageId===action.currentPageId ? { isBookmarked: false } : {isBookmarked : state.data.isBookmarked}
      };
    }
    case 'CLEAR_BOOKMARKS': {
      return {
        ...state,
        bookmarksData: []
      };
    }
    default :
      return state;
  }
};
