// import { apiConstants } from '../../const/Constants';
import { getBookDetails, getPlaylistDetails } from './genericApi';

class PlaylistApi {
  static doGetBookDetails = bookId => getBookDetails(bookId)
  static doGetPlaylistDetails = (bookId,tocurl) => getPlaylistDetails(bookId,tocurl)
}

export default PlaylistApi;
