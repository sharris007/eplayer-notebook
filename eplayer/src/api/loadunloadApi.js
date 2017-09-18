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

const messagingUrl = resources.links.courseServiceUrl;
const envType = domain.getEnvType();

export const loadPageEvent = (piToken, loadData) => {
  const header = {
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
  fetch(`${messagingUrl[envType]}/pla/autobahn/messages/pageLoadUnload`, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(loadData)
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log('loadresponse', json);
  }).catch((err) => { 
      console.log(err);
  });
}

export const unLoadPageEvent = (piToken, unLoadData) => {
  const header = {
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
  //${messagingUrl[envType]}/messaging/activities
  fetch(`${messagingUrl[envType]}/pla/autobahn/messages/pageLoadUnload`, {  
    method: 'POST',
    headers: header,
    body: JSON.stringify(unLoadData)
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log('unloadresponse', json);
  }).catch((err) => { 
      console.log(err);
  });
}