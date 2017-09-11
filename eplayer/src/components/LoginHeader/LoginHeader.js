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
import './LoginHeader.css';


class LoginHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    /* eslint-disable */
    return (
      <div className="App">
        <div className="App-header">
          <img src={require('./images/pearson-logo.png')} className="pearson" alt="pearson logo" /> 
          <img src={require('./images/Always-learning.png')} className="tagline" alt="pearson tagline" />
        </div>
      </div>
    );
    /* eslint-enable */
  }
}
export default LoginHeader;
