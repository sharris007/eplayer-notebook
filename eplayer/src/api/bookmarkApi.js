import { getBookmarkData ,postBookmarkData ,deleteBookmarkData,getTotalBookmarkData } from './genericApi';

class BookmarkApi {
  static doGetBookmark    = filterData => getBookmarkData(filterData)
  static doPostBookmark   = filterData => postBookmarkData(filterData)
  static doDeleteBookmark = deleteData => deleteBookmarkData(deleteData)
  static doTotalBookmark  = data       => getTotalBookmarkData(data)
}

export default BookmarkApi;
