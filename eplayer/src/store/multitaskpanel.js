import { pageDetails } from '../../const/Mocdata';

const bootstrapParams = {
  pageDetails: {},
  urlParams: {}
};

export default (state = bootstrapParams, action) => {

  switch (action.type) {
    case 'CREATE_MULTIPANEL_BOOTSTRAP_PARAMS': {
      // return Object.assign({}, state, { pageDetails: action.data.pageDetails, urlParams: action.data.urlParams });
      return {
        ...state,
        pageDetails: action.data.pageDetails,
        urlParams: action.data.urlParams
      };
    }
    default :
      return state;
  }

};
