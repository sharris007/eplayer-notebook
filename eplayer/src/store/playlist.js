/** *****************************************************************************
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
import _ from 'lodash';

const initalData = {
  data: [],
  bookdetailsdata: [],
  tocdata: { bookDetails: {}, content: { list: [] } },
  tocresponse: [],
  playlistReceived: false,
  tocReceived: false,
  bookDetailsRecived: false,
  updatedToc: false,
  customTocPlaylistReceived: false,
  prodType: '',
  playListWithOutDuplicates: [],
  backLinkLaunchParams: {}
};
export default (state = initalData, action) => {
  switch (action.type) {
    case 'GET_PLAYLIST': {
      // action.data.baseUrl = action.data.baseUrl.replace("content.stg-openclass.com","etext-dev.pearson.com");
      // action.data.provider = action.data.provider.replace("content.stg-openclass.com","etext-dev.pearson.com");
      if (action.data.content[0].playOrder === 0) {
        action.data.content.splice(0, 1);
      }
      if (!action.data.content[0].type) {
        action.data.content.forEach((list) => {
          const item = list;
          item.type = 'page';
        });
      }
      return {
        ...state,
        data: action.data,
        playListWithOutDuplicates: _.remove([...action.data.content], item => !item.chapterHeading),
        playlistReceived: action.playlistReceived
      };
    }
    case 'CLEAR_PLAYLIST': {
      return {
        ...state,
        data: [],
        playlistReceived: false,
        tocReceived: false,
        prodType: ''
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
    case 'GET_TOC_RESPONSE': {
      return {
        ...state,
        tocresponse: action.data,
        updatedToc: action.updatedToc
      };
    }
    case 'GETTING_TOC_RESPONSE': {
      return {
        ...state,
        updatedToc: action.updatedToc
      };
    }
    case 'GET_CUSTOM_PLAYLIST': {
      return {
        ...state,
        customTocPlaylistReceived: action.customTocPlaylistReceived
      };
    }
    case 'GOT_CUSTOM_PLAYLIST': {
      return {
        ...state,
        customTocPlaylistReceived: action.customTocPlaylistReceived
      };
    }
    case 'UPDATE_PROD_TYPE': {
      return {
        ...state,
        prodType: action.prodType
      };
    }
    case 'GENERATE_LAUNCH_PARAMS': {
      return {
        ...state,
        backLinkLaunchParams: action.data
      };
    }
    default:
      return state;
  }
};
