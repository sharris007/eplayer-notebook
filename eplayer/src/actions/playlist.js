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
/* global $ */
import PlaylistApi from '../api/playlistApi';
import { typeConstants } from '../../const/Settings';

// GET Book Details
export const getPlaylistCompleteDetails = json => ({
  type: typeConstants.GET_PLAYLIST,
  data: json,
  playlistReceived: true
});

export const getTocCompleteDetails = json => ({
  type: typeConstants.GET_TOC,
  data: json,
  tocReceived: true
});

export const getBookDetails = json => ({
  type: typeConstants.BOOK_DETAILS,
  data: json,
  bookDetailsRecived: true
});

 var tocUrl = '';
 var piToken = '';
 var bookId='';
 var bookDetails ='';

function getTocUrlOnResp(resp) {
  let tocUrl;
  if (resp) {
    const tocArr = resp;
    $.each(tocArr, (key, value) => {
      const ext = value.substr(value.lastIndexOf('.') + 1);
      if (ext === 'xhtml') { tocUrl = value; }
    });
    if (!tocUrl) { tocUrl = resp[0]; }
  }
  return tocUrl ? tocUrl.replace('http:', 'https:') : null;
}
export const getBookPlayListCallService = data => dispatch => 
  PlaylistApi.doGetPiUserDetails(data).then(response => response.json())
  .then((response)=>{
      data.userName  = response.UserName;
      PlaylistApi.doGetBookDetails(data)
        .then(response => response.json())
        .then((response) => {
         dispatch(getBookDetails(response));
         bookId = response.bookDetail.bookId;

     tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);
     bookDetails = response.bookDetail.metadata;
     piToken = data.piToken;

     /*PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then((response) => {
        // response.bookConfig = bookDetails;
        const tocResponse = response.content;
        tocResponse.mainTitle = bookDetails.title;
        tocResponse.author = bookDetails.creator;
        tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


        tocResponse.list = [];
        const tocItems = tocResponse.items;
        let subItems = [];
        const listData = tocItems.map((itemObj) => {
          if (itemObj.items) {
            subItems = itemObj.items.map(n => ({
              urn: n.id,
              href: n.href,
              id: n.id,
              playorder: n.playorder,
              title: n.title
            }));
          }
          return {
            id: itemObj.id,
            urn: itemObj.id,
            title: itemObj.title,
            coPage: itemObj.coPage,
            playOrder: itemObj.playOrder,
            children: subItems
          };
        });
        tocResponse.list = listData;
        delete tocResponse.items;
        const tocFinalModifiedData = { content: tocResponse, bookDetails };
        dispatch(getTocCompleteDetails(tocFinalModifiedData));
      });*/

    PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then(response => dispatch(getPlaylistCompleteDetails(response)));
   }
);
 
});

export const getBookTocCallService  = data => dispatch => 
  PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then((response) => {
        // response.bookConfig = bookDetails;
        const tocResponse = response.content;
        tocResponse.mainTitle = bookDetails.title;
        tocResponse.author = bookDetails.creator;
        tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


        tocResponse.list = [];
        const tocItems = tocResponse.items;
        let subItems = [];
        const listData = tocItems.map((itemObj) => {
          if (itemObj.items) {
            subItems = itemObj.items.map(n => ({
              urn: n.id,
              href: n.href,
              id: n.id,
              playorder: n.playorder,
              title: n.title
            }));
          }
          return {
            id: itemObj.id,
            urn: itemObj.id,
            title: itemObj.title,
            coPage: itemObj.coPage,
            playOrder: itemObj.playOrder,
            children: subItems
          };
        });
        tocResponse.list = listData;
        delete tocResponse.items;
        const tocFinalModifiedData = { content: tocResponse, bookDetails };
        dispatch(getTocCompleteDetails(tocFinalModifiedData));
      });


export const getCourseCallService = data => dispatch => PlaylistApi.doGetCourseDetails(data)
   .then(response => response.json())
   .then((response) => {
      // const tocUrl      = getTocUrlOnResp(response.bookDetail.metadata.toc);
      // const bookDetails = response.bookDetail.metadata;
      // const piToken     = data.piToken;
      dispatch(getBookDetails(response));
     const baseUrl      = response.userCourseSectionDetail.baseUrl;
     tocUrl       = getTocUrlOnResp(response.userCourseSectionDetail.toc);
     bookDetails  = response.userCourseSectionDetail;
     piToken      = data.piToken;
     bookId       = bookDetails.section.sectionId;
     /**/

     PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then(response => {
        const securl      = baseUrl.replace(/^http:\/\//i, 'https://');
        response.baseUrl  = securl ;
        dispatch(getPlaylistCompleteDetails(response))
      });
   }
);
