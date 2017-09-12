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

import './CoreLayout.scss';
import '../../styles/core.scss';
import '../../styles/FxOnlineReader.scss';
import '../../styles/jquery.jscrollpane.scss';
import '../../styles/navigation.scss';
import '../../styles/spectrum.scss';
import '../../styles/toolbar.scss';
import '../../styles/webpdfDemoPC.scss';

export const CoreLayout = ({ children }) => (
  <div>
    <div /* className="text-center"*/>
      <div className="core-layout__viewport">
        {children}
      </div>
    </div>
  </div>
);

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default CoreLayout;
