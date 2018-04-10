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
    const tocData = {'data':{ 'content' : {'mainTitle' : "Book",'author':'testauthor','list' : [{"id":"ae4508a54575d13ee5c25964b671129ff64199ed6","coPage":"true","urn":"ae4508a54575d13ee5c25964b671129ff64199ed6","title":"Preface","playOrder":1,"items":[{"id":"ae4508a54575d13ee5c25964b671129ff64199ed6-id_toc2","urn":"ae4508a54575d13ee5c25964b671129ff64199ed6-id_toc2","title":"Cover","playOrder":2,"href":"OPS/xhtml/fm01_pg0001.xhtml#id_toc2","hidden":false,"childHidden":false},{"id":"a4c9aca7c1c7b5d32619a28a898667614ba793dad","urn":"a4c9aca7c1c7b5d32619a28a898667614ba793dad","title":"Title","playOrder":6,"href":"OPS/xhtml/fm01_pg0004.xhtml","hidden":false,"childHidden":false},{"id":"ae854594dda7ed30e9c47398bab6de983a2ffe7f6","urn":"ae854594dda7ed30e9c47398bab6de983a2ffe7f6","title":"Copyright","playOrder":7,"href":"OPS/xhtml/fm01_pg0005.xhtml","hidden":false,"childHidden":false},{"id":"ac580ba64b90074e84ecf3fb8d61eea06b69ab8ad","urn":"ac580ba64b90074e84ecf3fb8d61eea06b69ab8ad","title":"Preface","playOrder":8,"href":"OPS/xhtml/fm01_pg0006.xhtml","hidden":false,"childHidden":false},{"id":"a15c65ab484d8e9af486cd015e941680fa3a056d0","urn":"a15c65ab484d8e9af486cd015e941680fa3a056d0","title":"About the Authors","playOrder":9,"href":"OPS/xhtml/fm01_pg0007.xhtml","hidden":false,"childHidden":false},{"id":"a951095f3d2f79914fc76a6db85cb051f8f85620a","urn":"a951095f3d2f79914fc76a6db85cb051f8f85620a","title":"Brief Contents","playOrder":10,"href":"OPS/xhtml/fm01_pg0008.xhtml","hidden":false,"childHidden":false},{"id":"a3cd53921625376d4b2ab6aead89b088c48707963","urn":"a3cd53921625376d4b2ab6aead89b088c48707963","title":"Acknowledgements","playOrder":11,"href":"OPS/xhtml/fm01_pg0009.xhtml","hidden":false,"childHidden":false}],"href":"OPS/xhtml/fm01_pg0001.xhtml","hidden":false,"childHidden":false}]}}}
    const courseData = {'title' : 'test', 'courseId' : '12345'};
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
          courseData={courseData}
          showTitle={'SHOW_TITLE'}
          cardHeader={'CARD_HEADER'}
          cardFooter={'CARD_FOOTER'}
          tocData={tocData}
          showCourse={'SHOW_COURSE_IN_MATERIALS'}
        />
      </div>
    )
  }
}