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
import React from 'react';
// import ReactDOM from 'react-dom';
import './DashboardHeader.css';


class DashboardHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    /* eslint-disable */
    return (
      <div className="headerContainer">
          <img src={require('./images/ico-pearson-logo.svg')} className="pearson" alt="pearson logo" /> 
      </div>
    );
    /* eslint-enable */
  }
}
export default DashboardHeader;
