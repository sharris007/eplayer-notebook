import { connect } from 'react-redux';
import moreMenuActions from '../modules/moreMenuActions';
import MoreMenuComponent from '../components/moreMenu'; // eslint-disable-line import/no-named-as-default

const mapDispatchToProps = {
  logout: moreMenuActions.logout,
  logoutUserSession: moreMenuActions.logoutUserSession
};

const mapStateToProps = state => ({
  moreMenu: (state.moreMenu ? state.moreMenu : {})

});

export default connect(mapStateToProps, mapDispatchToProps)(MoreMenuComponent);
