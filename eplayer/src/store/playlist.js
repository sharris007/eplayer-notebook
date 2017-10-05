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
const initalData = {
  data: [],
  bookdetailsdata: [],
  tocdata: { bookDetails: {}, content: { list: [] } },
  playlistReceived: false,
  tocReceived: false,
  bookDetailsRecived: false
};
export default (state = initalData, action) => {
  switch (action.type) {
    case 'GET_PLAYLIST': {
      if (action.data.content[0].playOrder === 0) {
        action.data.content.splice(0, 1);
      }
      if(!action.data.content[0].type) {
        action.data.content.forEach((list) => {
        const item = list;
        item.type = 'page';
      });
      }
      return {
        ...state,
        data: action.data,
        playlistReceived: action.playlistReceived
      };
    }
    case 'CLEAR_PLAYLIST': {
      return {
        ...state,
        data: [],
        playlistReceived: false,
        tocReceived: false
      };
    }
    case 'GET_TOC': {
      return {
        ...state,
        tocdata: action.data,
        tocReceived: action.tocReceived
      };
    }
    case 'BOOK_DETAILS': {
      return {
        ...state,
        bookdetailsdata: action.data,
        bookDetailsRecived: action.bookDetailsRecived
      };
    }
    default :
      return state;
  }
};
