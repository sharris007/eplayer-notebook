
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
      const pageId = action.data.uri[0];
      const  getDeletedbookmark = state.bookmarksData.filter(bookmark => bookmark.uri !== pageId);
      return {
        ...state,
        bookmarksData: getDeletedbookmark,
        data: action.data
      };
    }
    default :
      return state;
  }
};
