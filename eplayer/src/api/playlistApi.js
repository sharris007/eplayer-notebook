import { getBookDetails, getPlaylistDetails,getTocDetails } from './genericApi';

class PlaylistApi {
  static doGetBookDetails = bookDetails => getBookDetails(bookDetails)
  static doGetPlaylistDetails = (bookId,tocurl,piToken) => getPlaylistDetails(bookId,tocurl,piToken)
  static doGetTocDetails = (bookId,tocurl,piToken) => getTocDetails(bookId,tocurl,piToken)
}

export default PlaylistApi;
