import BookmarkApi from '../api/bookmarkApi';
import { typeConstants } from '../../const/Constants';

// GET call for annotations
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
 