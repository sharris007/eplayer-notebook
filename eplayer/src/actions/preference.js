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
import PreferenceApi from '../api/preferenceApi';
import { typeConstants } from '../../const/Settings';



// GET call for preferences
export const getPreferenceData = json => ({
  type: typeConstants.GET_PREFERENCE,
  preferenceData: json
});

export const getPreferenceCallService = filterData => dispatch => PreferenceApi.doGetPreference(filterData)
    .then(response => response.json())
    .then((json) => {
      dispatch(getPreferenceData(json));
    });

 // POST call preferences
export const postPreferenceData = json => ({
  type: typeConstants.POST_PREFERENCE,
  preferenceData: json
});

export const postPreferenceCallService = data => dispatch => PreferenceApi.doPostPreference(data)
   .then(response => response.json())
   .then((json) => {
     dispatch(postPreferenceData(json));
   });