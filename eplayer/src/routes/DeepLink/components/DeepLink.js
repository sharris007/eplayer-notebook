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
/* global piSession ,localStorage */
import React from 'react';
import { browserHistory } from 'react-router';

import deepLinkService from '../modules/deepLinkService';
import { resources } from '../../../../const/Settings';

export default class DeepLink extends React.Component {
  constructor(props) {
    super(props);
    console.clear();
    console.log(">>>>>>>>>>>>>>>>> deeplink Props : ", props);
    this.qparams = [];
    this.redirectURL = ''; 
  }

  componentWillMount = () => {
    console.log(">>>>>>>>>> componentWillMount");
    this.qparams = deepLinkService.getParams();
    const isErrorRoute = deepLinkService.checkErrorNavigation(this.qparams);
    if(isErrorRoute === false) {
      this.authenticateUser(this.qparams);
    }
  }

  componentWillReceiveProps(props) {
    console.log(">>>>>>>>>> componentWillReceiveProps(props) ", props);
    if(resources.constants.authorizationCheck) {
      if(props.deeplinkProps.launcheplayer.idpName === "SMS") {
        piSession.getToken((result, userToken)=> {
          browserHistory.push(this.redirectURL);
        });
      }
    }
  }

  authenticateUser = (qparams) => {
    let queryParams = {
                "token" : qparams.smsTicket ? qparams.smsTicket : '',
                "serviceUrl" : qparams.serviceUrl ? qparams.serviceUrl : '',
                "idpName":  qparams.idpName ? qparams.idpName: '',
                "platforms_id" : qparams.platforms_id ? qparams.platforms_id:'',
                "bookId" : qparams.bookId ? qparams.bookId : '',
                "pageNo" : qparams.pageNo ? qparams.pageNo : '',
                "courseName" : qparams.courseName ? qparams.courseName : '',
                "smsUserId" :qparams.smsUserId ? qparams.smsUserId : '',
                "contextId" : qparams.contextId ? qparams.contextId : '',
                "role" : qparams.role ? qparams.role : ''
              }
    this.redirectURL = deepLinkService.getUrlString(queryParams);
    this.props.doTokenLogin(queryParams);
  }

  render() {
    return (
      <div id="bookshelf-page">
        {this.props.deeplinkProps.launcheplayer.data ? this.props.deeplinkProps.launcheplayer.data.json: 'KVYDSGHSDFKJKLJVLKFVBJKLDFJKVYDSGHSDFKJKLJVLKFVBJKLDFJ' }
      </div>
    );
  }
}