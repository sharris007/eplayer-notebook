import { clients } from '../../common/client';

const searchActions = {
  fetch(indexId, term) {
    return {
      type: 'SEARCH',
      payload: clients.search.get(`api/cm/search?indexId=${indexId}&q=${term}&s=0&n=100`) };
  }

};

export default searchActions;
