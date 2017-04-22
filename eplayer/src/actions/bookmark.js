import BookmarkApi from '../api/bookmarkApi';
import { typeConstants } from '../../const/Constants';

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
        json => dispatch(getBookmarkData(json))
    );
 

 // POST call for Bookmark
export const postBookmarkData = json => ({
  type: typeConstants.POST_BOOKMARK,
  data: json,
  loading: true
});

export const postBookmarkCallService = filterData => dispatch => BookmarkApi.doPostBookmark(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(postBookmarkData(json))
    );
 
 // DELETE call for Bookmark
export const deleteBookmarkData = json => ({
  type: typeConstants.DELETE_BOOKMARK,
  data: json,
  loading: true
});

export const deleteBookmarkCallService = filterData => dispatch => BookmarkApi.doDeleteBookmark(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(deleteBookmarkData(json))
    );

//Bookmark Total Get call
export const getTotalBookmarkData = json => ({
  type: typeConstants.GET_TOTALBOOKMARK,
  data: json
});

export const getTotalBookmarkCallService = filterData => dispatch => 
    BookmarkApi.doTotalBookmark(filterData)
    .then(response => response.json())
    .then(json => {
        const bookmarksDataMap = json.bookmarks;
          if(bookmarksDataMap && bookmarksDataMap.length>0){
            for(let i=0;i<bookmarksDataMap.length;i++){
              bookmarksDataMap[i].id =bookmarksDataMap[i].uri;
            }
          }
          dispatch(getTotalBookmarkData(bookmarksDataMap))
        }
    );
 