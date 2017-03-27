// import { apiConstants } from '../../const/Constants';
import { getBookmarkData } from './genericApi';

class BookmarkApi {
  static doGetBookmark = filterData => getBookmarkData(filterData)
}

export default BookmarkApi;
