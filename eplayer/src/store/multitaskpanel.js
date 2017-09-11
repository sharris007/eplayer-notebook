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

const bootstrapParams = {
  pageDetails: {},
  urlParams: {}
};

export default (state = bootstrapParams, action) => {
  switch (action.type) {
    case 'CREATE_MULTIPANEL_BOOTSTRAP_PARAMS': {
      // return Object.assign({}, state, { pageDetails: action.data.pageDetails, urlParams: action.data.urlParams });
      return {
        ...state,
        pageDetails: action.data.pageDetails,
        urlParams: action.data.urlParams
      };
    }
    default :
      return state;
  }
};
