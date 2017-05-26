import { getBookDetails, getPlaylistDetails,getTocDetails,getCourseDetails } from './genericApi';

class PlaylistApi {
  static doGetBookDetails = bookDetails => getBookDetails(bookDetails)
  static doGetPlaylistDetails = (bookId,tocurl,piToken) => getPlaylistDetails(bookId,tocurl,piToken)
  static doGetTocDetails = (bookId,tocurl,piToken) => getTocDetails(bookId,tocurl,piToken)
  static doGetCourseDetails = courseDetails => getCourseDetails(courseDetails)
}

export default PlaylistApi;
