import { clients } from '../../common/client';

const moreMenuActions = {
  logout() {
    return {
      type: 'LOGOUT',
      payload: clients.search.get('api/cm/search?indexId=90104c7ed4e49497887808b3e8cb7f8c&q=e&s=0&n=100')
    };
  }

};

export default moreMenuActions;
