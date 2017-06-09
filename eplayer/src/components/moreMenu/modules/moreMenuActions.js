import axios from 'axios';
import { clients } from '../../common/client';

const moreMenuActions = {
  logout() {
    return {
      type: 'LOGOUT',
      payload: clients.search.get('api/cm/search?indexId=90104c7ed4e49497887808b3e8cb7f8c&q=e&s=0&n=100')
    };
  },

  logoutUserSession(userid, sessionKey, serverDetails) {
    return {
      type: 'LOGOUT_USER_SESSION',
      payload: axios.get(`${serverDetails}/ebook/ipad/logout?values=userid::${userid}::sessionid::${sessionKey}::scenario::1::authservice::sso::authkey::${sessionKey}&outputformat=JSON`) // eslint-disable-line
    };
  }

};

export default moreMenuActions;
