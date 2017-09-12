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
// import { clients } from '../../../components/common/client'; /* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import { resources, domain } from '../../../../const/Settings';
import {getSiteId} from '../../../components/Utility/Util';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const envType = domain.getEnvType();
/* Defining the Rest Api url. */
const urlLogin = `${etextService[envType]}/account/login?withIdpResponse=true&chk_old=true&is_stand=true`;
// console.log('urlLogin'+urlLogin);
/* Method for fetcing the login details from Rest Api by passing the data username and password. */
export const fetch = (userName, userPassword) => {
  var siteID =  getSiteId(envType);
  const request = axios({
    method: 'post',
    url: urlLogin,
    header: { 'Content-Type': 'application/json' },
    data: {
      contextId: siteID,
      userName,
      password: userPassword
    }
  });
  return {
    type: 'LOGIN',
    payload: request
  };
};
