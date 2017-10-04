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
/* global  sessionStorage ,localStorage*/
import React from 'react';
import { browserHistory } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import reducer from '../modules/moreMenuReducers';
import { injectReducer } from '../../../store/reducers';
import Cookies from 'universal-cookie';
import { resources, domain } from '../../../../const/Settings';
const queryString = require('query-string');

const envType = domain.getEnvType();
const consoleUrl = resources.links.consoleUrl;

class MoreMenuComponent extends React.Component {
  componentWillMount() {
    injectReducer(this.props.store, { key: 'moreMenu', reducer });
  }
  delete_cookie = (name) => {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
    handleClick = () => {
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
     if(window.location.pathname.indexOf('/eplayer/Course/')>-1){
        piSession.logout();
        localStorage.removeItem('secureToken');
        let redirectCourseUrl   = consoleUrl[envType];
        piSession.login(redirectCourseUrl);
    }else{
        const parsedQueryStrings = queryString.parse(window.location.search);
        if (langQuery && langQuery !== '?languageid=1') {
          if( parsedQueryStrings.invoketype == 'et1')
          {
            cookies.remove('ReactPlayerCookie',{ path: '/' });
            localStorage.removeItem('secureToken');
            browserHistory.push('/eplayer/login');
          }
          else
          {
            if(parsedQueryStrings.invoketype == 'pi')
            {
              piSession.logout();
            }
            localStorage.removeItem('secureToken');
            browserHistory.push(`/eplayer/login${langQuery}`);
          }
        } else {
          if (parsedQueryStrings.invoketype == 'et1')
          {
            cookies.remove('ReactPlayerCookie',{ path: '/' });
            localStorage.removeItem('secureToken');
            browserHistory.push('/eplayer/login');
          }
          else
          {
            if(parsedQueryStrings.invoketype == 'pi')
            {
              piSession.logout();
            }
            localStorage.removeItem('secureToken');
            let appPath             = window.location.origin;
            let redirectCourseUrl   = appPath+'/eplayer/bookshelf';
            piSession.login(redirectCourseUrl);
            //browserHistory.push('/eplayer/login');
          }
        }
    }
    this.props.logoutUserSession(this.props.userid, this.props.ssoKey, this.props.serverDetails); // eslint-disable-line
  }
  render() {
    const style = {
      moreIcons: {
        color: '#6a7070'
      }
    };

    return (<IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      iconStyle={style.moreIcons}
      onItemTouchTap={this.handleClick}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem id="signOutButton" primaryText={this.props.messages !== undefined ? this.props.messages.signOutBtn : 'Sign Out'} />
    </IconMenu>
    );
  }
}
MoreMenuComponent.propTypes = {
  store: React.PropTypes.object,
  logoutUserSession: React.PropTypes.func,
  messages: React.PropTypes.object
};

export default MoreMenuComponent;
