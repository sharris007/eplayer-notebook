import { clients } from '../../../common/client';

const widgetActions = {
  fetch: (urn, type) => ({
    type,
    payload: clients.scapi.get(`/content/${urn}`)
  })
};

export default widgetActions;
