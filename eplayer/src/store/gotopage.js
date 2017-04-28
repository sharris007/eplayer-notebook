export default (state = { gotoPageObj: [], isGoToPageRecived : false }, action) => {
  switch (action.type) {
    case 'GET_GOTOPAGE': {
      return {
        ...state,
        gotoPageObj: action.data,
        isGoToPageRecived: true
      };
    }
    case 'GOT_GOTOPAGE': {
      return {
        ...state,
        gotoPageObj: [],
        isGoToPageRecived: false
      };
    }
    default :
      return state;
  }
};
