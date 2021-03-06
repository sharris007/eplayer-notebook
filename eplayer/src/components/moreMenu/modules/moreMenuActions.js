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
import axios from 'axios';
import { clients } from '../../common/client';
import { getmd5 } from '../../Utility/Util';
import { eT1Contants } from '../../common/et1constants';

const moreMenuActions = {
  logout() {
    return {
      type: 'LOGOUT',
      payload: clients.search.get('api/cm/search?indexId=90104c7ed4e49497887808b3e8cb7f8c&q=e&s=0&n=100')
    };
  },

  logoutUserSession(userid, sessionKey, scenario, serverDetails) {
    var serviceurl = `${serverDetails}/ebook/pdfplayer/logout?values=userid::${userid}::sessionid::${sessionKey}::scenario::${scenario}::authservice::sso::authkey::${sessionKey}&authkey=${sessionKey}`;
    // tempurl is starts with http to create hash key for matching with server
    var tempurl = serviceurl.replace("https","http");
    var hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    return {
      type: 'LOGOUT_USER_SESSION',
      payload: axios.get(`${serviceurl}&hsid=${hsid}`) // eslint-disable-line
    };
  }

};

export default moreMenuActions;
