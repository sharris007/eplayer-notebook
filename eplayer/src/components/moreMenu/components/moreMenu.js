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
    var i = sessionStorage.length;
    while(i--) {
      var key = sessionStorage.key(i);
      if((key)) {
        sessionStorage.removeItem(key);
      }  
    }
    browserHistory.push(`/eplayer`);
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
      <MenuItem primaryText="Sign out" />
    </IconMenu>
    );
  }
}
MoreMenuComponent.propTypes = {
  store: React.PropTypes.object,
  logout: React.PropTypes.func.isRequired
};

export default MoreMenuComponent;

