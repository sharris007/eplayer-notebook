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
import GotopageApi from '../api/gotopageApi';
import { typeConstants } from '../../const/Settings';

// GET call for Go to page
export const getGoToPage = json => ({
  type: typeConstants.GET_GOTOPAGE,
  data: json,
  isGoToPageRecived: true
});

export const getGotoPageCall = goToPageObj => dispatch => GotopageApi.doGetGotoPage(goToPageObj)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(getGoToPage(json))
);
