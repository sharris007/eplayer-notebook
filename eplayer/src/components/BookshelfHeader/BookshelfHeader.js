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
/* global sessionStorage localStorage */
import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';
import Cookies from 'universal-cookie';
const queryString = require('query-string');

import Icon from '../Icon';
import './BookshelfHeader.scss';

const style = {
  raisedButton: {
    width: '130px',
    height: '36px',
    textAlign: 'left',
    label: {
      height: '18px',
      fontFamily: 'Open Sans',
      fontSize: '13px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#252525',
      textTransform: 'none'
    }
  }
};


export class BookshelfHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSingle: 1
    };
  }

  handleChangeSingle = (event, value) => {
    this.setState({
      valueSingle: value
    });
  };
  onClick = () => {
    sessionStorage.clear();
    const langQuery = localStorage.getItem('bookshelfLang');
    const cookies = new Cookies();
    let i = localStorage.length;
    while (i--) {
      const key = localStorage.key(i);
      if ((key)) {
        localStorage.removeItem(key);
      }
    }
    const storagAarr = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('bookId') === 0) {
        storagAarr.push(localStorage.key(i));
      }
    }
    for (let i = 0; i < storagAarr.length; i++) {
      localStorage.removeItem(storagAarr[i]);
    }
    const parsedQueryStrings = queryString.parse(window.location.search);
    if (langQuery && langQuery !== '?languageid=1') {
      browserHistory.push(`/eplayer/login${langQuery}`);
    } else {
      if(parsedQueryStrings.invoketype === "et1")
      {
        cookies.remove('ReactPlayerCookie',{ path: '/' });
        localStorage.removeItem('secureToken');
        browserHistory.push('/eplayer/');
      }
      else
      {
        try
        {
          piSession.logout();
        }
        catch(e)
        {}
        let appPath             = window.location.origin;
        let redirectCourseUrl   = appPath+'/eplayer/bookshelf';
        redirectCourseUrl       = decodeURIComponent(redirectCourseUrl).replace(/\s/g, "+").replace(/%20/g, "+");
        localStorage.removeItem('secureToken');
        piSession.login(redirectCourseUrl);
        //browserHistory.push('/eplayer/login');
      }
    }
    // this.props.logout();
  }

  render() {
    return (
       /* eslint-disable */
      <div className="bookshelfHeader">
        <div>
          <div className="logo" />
          <span className="rightComp">
            <span className="label">
            {this.props.messages.Welcome}&nbsp;{this.props.firstName && this.props.lastName ?` ${this.props.firstName} ${this.props.lastName}` : null}
            </span>
            <span className="dropdown"><Icon name="dropdown-open-18" /></span>
          </span>
        </div>
        <div className="signoutBtn">
          <RaisedButton
            label={this.props.messages.signOutBtn}
            buttonStyle={style.raisedButton}
            labelStyle={style.raisedButton.label}
            onClick={this.onClick}
          />
        </div>
        <div className="title">{this.props.messages.myBookshelf}</div>
      </div>
      /* eslint-enable */
    );
  }
}
BookshelfHeader.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  messages: PropTypes.object
};
export default BookshelfHeader;
