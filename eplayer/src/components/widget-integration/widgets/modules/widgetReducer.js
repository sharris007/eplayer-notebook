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
// ------------------------------------
// Constants
// ------------------------------------

export const VIDEOS_WIDGET_PENDING = 'VIDEOS_WIDGET_PENDING';
export const VIDEOS_WIDGET_REJECTED = 'VIDEOS_WIDGET_REJECTED';
export const VIDEOS_WIDGET_FULFILLED = 'VIDEOS_WIDGET_FULFILLED';
export const IMAGES_WIDGET_PENDING = 'IMAGES_WIDGET_PENDING';
export const IMAGES_WIDGET_REJECTED = 'IMAGES_WIDGET_REJECTED';
export const IMAGES_WIDGET_FULFILLED = 'IMAGES_WIDGET_FULFILLED';
export const TIMELINE_WIDGET_PENDING = 'TIMELINE_WIDGET_PENDING';
export const TIMELINE_WIDGET_REJECTED = 'TIMELINE_WIDGET_REJECTED';
export const TIMELINE_WIDGET_FULFILLED = 'TIMELINE_WIDGET_FULFILLED';
export const FLASHCARDS_WIDGET_PENDING = 'FLASHCARDS_WIDGET_PENDING';
export const FLASHCARDS_WIDGET_REJECTED = 'FLASHCARDS_WIDGET_REJECTED';
export const FLASHCARDS_WIDGET_FULFILLED = 'FLASHCARDS_WIDGET_FULFILLED';
export const TINYQUIZ_WIDGET_PENDING = 'TINYQUIZ_WIDGET_PENDING';
export const TINYQUIZ_WIDGET_REJECTED = 'TINYQUIZ_WIDGET_REJECTED';
export const TINYQUIZ_WIDGET_FULFILLED = 'TINYQUIZ_WIDGET_FULFILLED';
export const IMAGE_IDENTIFIER_WIDGET_PENDING = 'IMAGE_IDENTIFIER_WIDGET_PENDING';
export const IMAGE_IDENTIFIER_WIDGET_REJECTED = 'IMAGE_IDENTIFIER_WIDGET_REJECTED';
export const IMAGE_IDENTIFIER_WIDGET_FULFILLED = 'IMAGE_IDENTIFIER_WIDGET_FULFILLED';
export const MCQ_WIDGET_PENDING = 'MCQ_WIDGET_PENDING';
export const MCQ_WIDGET_REJECTED = 'MCQ_WIDGET_REJECTED';
export const MCQ_WIDGET_FULFILLED = 'MCQ_WIDGET_FULFILLED';
export const MTI_WIDGET_PENDING = 'MTI_WIDGET_PENDING';
export const MTI_WIDGET_REJECTED = 'MTI_WIDGET_REJECTED';
export const MTI_WIDGET_FULFILLED = 'MTI_WIDGET_FULFILLED';
export const UCA_WIDGET_PENDING = 'UCA_WIDGET_PENDING';
export const UCA_WIDGET_REJECTED = 'UCA_WIDGET_REJECTED';
export const UCA_WIDGET_FULFILLED = 'UCA_WIDGET_FULFILLED';
export const TIA_WIDGET_PENDING = 'TIA_WIDGET_PENDING';
export const TIA_WIDGET_REJECTED = 'TIA_WIDGET_REJECTED';
export const TIA_WIDGET_FULFILLED = 'TIA_WIDGET_FULFILLED';


// ------------------------------------
// ACTION HANDLERS
// ------------------------------------
const ACTION_HANDLERS = {
  [VIDEOS_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [VIDEOS_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, videos: action.payload, error: null
  }),
  [VIDEOS_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),

  [IMAGES_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [IMAGES_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, images: action.payload, error: null
  }),
  [IMAGES_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),

  [TIMELINE_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [TIMELINE_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, timeline: action.payload, error: null
  }),
  [TIMELINE_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),

  [FLASHCARDS_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [FLASHCARDS_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, flashcards: action.payload, error: null
  }),
  [FLASHCARDS_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }), // eslint-disable-line max-len
  [TINYQUIZ_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [TINYQUIZ_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, tinyquiz: action.payload, error: null
  }),
  [TINYQUIZ_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }), // eslint-disable-line max-len
  [IMAGE_IDENTIFIER_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [IMAGE_IDENTIFIER_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, imageIdentifier: action.payload, error: null
  }),
  [IMAGE_IDENTIFIER_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }), // eslint-disable-line max-len
  [MCQ_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [MCQ_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, mcq: action.payload, error: null
  }),
  [MCQ_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),
  [MTI_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [MTI_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, mti: action.payload, error: null
  }),
  [MTI_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),
  [UCA_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [UCA_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, uca: action.payload, error: null
  }),
  [UCA_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),
  [TIA_WIDGET_PENDING]: state => ({ ...state, fetching: true }),

  [TIA_WIDGET_FULFILLED]: (state, action) => ({
    ...state, fetching: false, fetched: true, tia: action.payload, error: null
  }),
  [TIA_WIDGET_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload })
};


const initialState = {
  videos: {},
  images: {},
  timeline: {},
  flashcards: {},
  tinyquiz: {},
  imageIdentifier: {},
  mcq: {},
  mti: {},
  uca: {},
  tia: {},
  fetched: false,
  fetching: false,
  error: null
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
