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
import React from 'react';/* Importing the react library, for using the react methods and keywords. */

/* Method for loading the bookshelf component. */
export default class DeepLink extends React.Component {
  /* constructor and super have used in class based React component,
   used to pass props for communication with other components. */
  constructor(props) {
    super(props);
    setTimeout(()=>{
      this.props.doTokenLogin();
    },1000)
    
  }

  render() {
    return (
      <div id="bookshelf-page">
        {this.props.DEEPLINK.launcheplayer.data ? this.props.DEEPLINK.launcheplayer.data.json: 'KVYDSGHSDFKJKLJVLKFVBJKLDFJKVYDSGHSDFKJKLJVLKFVBJKLDFJ' }
      </div>
    );
  }
}