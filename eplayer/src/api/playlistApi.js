// import { apiConstants } from '../../const/Constants';
import { getBookDetails, getPlaylistDetails,getTocDetails } from './genericApi';

class PlaylistApi {
  static doGetBookDetails = bookId => getBookDetails(bookId)
  static doGetPlaylistDetails = (bookId,tocurl) => getPlaylistDetails(bookId,tocurl)
  static doGetTocDetails = (bookId,tocurl) => getTocDetails(bookId,tocurl)
}

export default PlaylistApi;
