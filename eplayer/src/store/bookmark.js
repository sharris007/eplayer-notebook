export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_BOOKMARK': {
      return {
        ...state,
        data: action.data
      };
    }
    default :
      return state;
  }
};
