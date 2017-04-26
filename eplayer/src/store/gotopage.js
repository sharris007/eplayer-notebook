export default (state = { gotoPageObj: [], isGoToPageRecived : false }, action) => {
  switch (action.type) {
    case 'GET_GOTOPAGE': {
      return {
        ...state,
        gotoPageObj: action.data,
        isGoToPageRecived: true
      };
    }
    default :
      return state;
  }
};
