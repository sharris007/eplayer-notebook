import { clients } from '../../../components/common/client';


const bookshelfActions = {
  fetch(urn) {
    return {
      type: 'BOOKS',
      payload: clients.etext.get('/users/xlet2edu/bookshelf')
    };
  }

};

export default bookshelfActions;
