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
        if (langQuery && langQuery !== '?languageid=1') {
          piSession.logout();
          localStorage.removeItem('secureToken');
          browserHistory.push(`/eplayer/login${langQuery}`);
        } else {
          piSession.logout();
          localStorage.removeItem('secureToken');
          let appPath             = window.location.origin;
          let redirectCourseUrl   = appPath+'/eplayer/bookshelf';
          piSession.login(redirectCourseUrl);
          //browserHistory.push('/eplayer/login');
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
