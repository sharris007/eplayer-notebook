import { clients } from '../../../components/common/client';


const bookshelfActions = {
  fetch(urn) {
    return {
      type: 'BOOKS',
      payload: clients.etext.get('/users/xlet2edu/bookshelf')
      //payload: clients.etext.get('/users/staging_inst2/bookshelf')
    };
  }

};

export default bookshelfActions;
