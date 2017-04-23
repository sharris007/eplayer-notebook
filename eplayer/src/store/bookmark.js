
const initialData = {
  bookmarksData:[],
  data: {  
    isBookmarked: false 
  }
};
export default (state = initialData, action) => {
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
        bookmarksData: state.bookmarksData.concat(action.data)
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
