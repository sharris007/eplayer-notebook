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
import { getBookDetails, getPlaylistDetails, getTocDetails, getCourseDetails , getPiUserProfile, putCustomTocDetails, getAuthToken } from './genericApi';

class PlaylistApi {
  static doGetPiUserDetails = piUserDetails => getPiUserProfile(piUserDetails)
  static doGetBookDetails = bookDetails => getBookDetails(bookDetails)
  static doGetPlaylistDetails = (bookId, tocurl, piToken) => getPlaylistDetails(bookId, tocurl, piToken)
  static doGetTocDetails = (bookId, tocurl, piToken) => getTocDetails(bookId, tocurl, piToken)
  static doGetCourseDetails = courseDetails => getCourseDetails(courseDetails)
  static doPutCustomTocDetails = (tocContents, piToken, bookId) => putCustomTocDetails(tocContents, piToken, bookId)
  static doGetAuthToken = (secureToken) => getAuthToken(secureToken)
}

export default PlaylistApi;
