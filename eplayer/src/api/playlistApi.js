import { getBookDetails, getPlaylistDetails, getTocDetails, getCourseDetails , getPiUserProfile } from './genericApi';

class PlaylistApi {
  static doGetPiUserDetails = piUserDetails => getPiUserProfile(piUserDetails)
  static doGetBookDetails = bookDetails => getBookDetails(bookDetails)
  static doGetPlaylistDetails = (bookId, tocurl, piToken) => getPlaylistDetails(bookId, tocurl, piToken)
  static doGetTocDetails = (bookId, tocurl, piToken) => getTocDetails(bookId, tocurl, piToken)
  static doGetCourseDetails = courseDetails => getCourseDetails(courseDetails)
}

export default PlaylistApi;
