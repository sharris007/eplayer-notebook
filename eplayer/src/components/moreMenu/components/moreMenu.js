import React from 'react';
import { browserHistory } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import reducer from '../modules/moreMenuReducers';
import { injectReducer } from '../../../store/reducers';

class MoreMenuComponent extends React.Component {
  componentWillMount() {
    injectReducer(this.props.store, { key: 'moreMenu', reducer });
  }
  handleClick = () => {
    var langQuery=sessionStorage.getItem('bookshelfLang');
    var i = sessionStorage.length;
    while(i--) {
      var key = sessionStorage.key(i);
      if((key)) {
        sessionStorage.removeItem(key);
      }  
    }
    const storagAarr = [];
    const localStorageLength = localStorage.length;
    for (let i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).indexOf('bookId') == 0 ) {
            storagAarr.push(localStorage.key(i));
        }
    }
    for (let i = 0; i < storagAarr.length; i++) {
      localStorage.removeItem(storagAarr[i]);
    }
    if(langQuery != "?languageid=1")
    {
      browserHistory.push(`/eplayer/login` + langQuery);  
    }
    else
    {
      browserHistory.push(`/eplayer/login`);
    }
    this.props.logoutUserSession(this.props.userid, this.props.ssoKey, this.props.serverDetails);
    //this.props.logout();
  }
  render() {
    const style = {
      moreIcons: {
        color: '#FFFFFF'
      }
    };

    return (<IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      iconStyle={style.moreIcons}
      onItemTouchTap={this.handleClick}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem primaryText={this.props.messages != undefined ? this.props.messages.signOutBtn : 'Sign Out'} />
    </IconMenu>
    );
  }
}
MoreMenuComponent.propTypes = {
  store: React.PropTypes.object,
  logout: React.PropTypes.func.isRequired
};

export default MoreMenuComponent;