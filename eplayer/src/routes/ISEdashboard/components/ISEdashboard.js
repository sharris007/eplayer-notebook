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
/* eslint-disable */
import React, { Component } from 'react';
import { HeaderMenuComponent } from '@pearson-incubator/vega-core';
import { MaterialsComponent } from '@pearson-incubator/vega-drawer';

export default class ISEdashboard extends Component {
  constructor(props) {
    super(props);
  }
  OnChange = () => {

  }
  viewTitle = () =>{

  }
  render() {
    const headerTabs = ['scheduled', 'materials', 'notes', 'tools'];
    const title = '';
    const pageSelected = 'materials';
    const inkBarColor = 'teal';
    return (
      <div>
        <HeaderMenuComponent
          title={title}
          onChange={this.onChange}
          page={pageSelected}
          headerTabs={headerTabs}
          inkBarColor={inkBarColor}
        />
         <MaterialsComponent
          viewTitle={this.viewTitle}
          courseData={[]}
          showTitle={'SHOW_TITLE'}
          cardHeader={'CARD_HEADER'}
          cardFooter={'CARD_FOOTER'}
          tocData={[]}
          showCourse={'SHOW_COURSE_IN_MATERIALS'}
        />
      </div>
    )
  }
}