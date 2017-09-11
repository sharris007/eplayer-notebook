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
import { resources, domain } from '../../const/Settings';

const messagingUrl = resources.links.messagingUrl;
const envType = domain.getEnvType();

export const loadPageEvent = (piToken, loadData) => {
  console.log("load$$$$$" , loadData);
  const header = {
     'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
  fetch(`${messagingUrl[envType]}/messaging/activities`, {  
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(loadData)

  }).then((response) => {
    return response.json();
  }).then((json) => {
    console.log("loadjson", json);
  });
}

export const unLoadPageEvent = (piToken, unLoadData) => {
  console.log("UNLOAD$$$$$" , unLoadData);
  const header = {
     'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
  //${messagingUrl[envType]}/messaging/activities
  fetch(`${messagingUrl[envType]}/messaging/activities`, {  
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(unLoadData)

  }).then((response) => {
    return response.json();
  }).then((json) => {
    console.log("unloadjson", json);
  });
}