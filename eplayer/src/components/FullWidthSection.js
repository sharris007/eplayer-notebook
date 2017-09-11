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
import React, { Component, PropTypes } from 'react';
import ClearFix from 'material-ui/internal/ClearFix';
import spacing from 'material-ui/styles/spacing';
import withWidth, { SMALL, LARGE } from 'material-ui/utils/withWidth';

const desktopGutter = spacing.desktopGutter;

class FullWidthSection extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentStyle: PropTypes.object,
    contentType: PropTypes.string,
    style: PropTypes.object,
    useContent: PropTypes.bool,
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    useContent: false,
    contentType: 'div'
  }

  static getStyles() {
    return {
      root: {
        padding: desktopGutter,
        boxSizing: 'border-box'
      },
      content: {
        maxWidth: 1200,
        margin: '0 auto'
      },
      rootWhenSmall: {
        paddingTop: desktopGutter * 2,
        paddingBottom: desktopGutter * 2
      },
      rootWhenLarge: {
        paddingTop: desktopGutter * 3,
        paddingBottom: desktopGutter * 3
      }
    };
  }

  render() {
    const {
      style,
      useContent,
      contentType,
      contentStyle,
      width,
      ...other
    } = this.props;

    const styles = this.getStyles();

    let content;
    if (useContent) {
      content =
        React.createElement(
          contentType,
          { style: Object.assign(styles.content, contentStyle) },
          this.props.children
        );
    } else {
      content = this.props.children;
    }

    return (
      <ClearFix
        {...other}
        style={Object.assign(
          styles.root,
          style,
          width === SMALL && styles.rootWhenSmall,
          width === LARGE && styles.rootWhenLarge)}
      >
        {content}
      </ClearFix>
    );
  }
}

export default withWidth()(FullWidthSection);
