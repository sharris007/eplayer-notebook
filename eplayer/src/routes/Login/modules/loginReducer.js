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
// Constants for action type.
// ------------------------------------
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
export const LOGIN_REJECTED = 'LOGIN_REJECTED';
export const LOGIN_DETAILS = 'LOGIN_DETAILS';

/**
 * Action Handlers for BOOKS actions.
 *
 * @type {{type}} returns the handler for action type
 */
const ACTION_HANDLERS = {
  /* Action type for pending status for login. */
  [LOGIN_PENDING]: state => ({ ...state, fetching: true, error: null }),
  /* Action type when the login details fetched from Rest Api. */
  [LOGIN_FULFILLED]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    data:
    {
      firstName: action.payload.data.data.firstName,
      lastName: action.payload.data.data.lastName,
      token: action.payload.data.data.token,
      identityId: action.payload.data.data.identityId
    },
    error: null }),
  /* Action type when wrong login username and password passed to Rest Api. */
  [LOGIN_REJECTED]: state => ({
    ...state,
    fetching: false,
    fetched: false,
    error: true,
    errorMessage: '*Invalid Username/Password or you do not have a subscription to this site'
  })
};
/* Defining the initial state for action handler. */
const initialState = {
  data: {},
  fetched: false,
  fetching: false,
  error: false,
  errorMessage: ''
};

/* Method for checking and passing the action for computing the next state. */
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

