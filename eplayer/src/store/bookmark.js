
const initalData = {

  bookmarksData:[],
  data: {  
    isBookmarked: false 
  }
};
export default (state = initalData, action) => {
  switch (action.type) {
    case 'GET_BOOKMARK': {
      return {
        ...state,
        data: action.data,

      };
    }
    case 'GET_TOTALBOOKMARK': {

      return {
        ...state,
        bookmarksData: action.data
      };
    }
    case 'POST_BOOKMARK': {
      
      action.data.isBookmarked =true;
      return {
        ...state,
        data: action.data
      };
    }
    case 'DELETE_BOOKMARK': {
      return {
        ...state,
        data: action.data
      };
    }
    default :
      return state;
  }
};
