
const initialData = {
  bookmarksData: [],
  data: {
    isBookmarked: false
  }
};
export default (state = initialData, action) => {
  switch (action.type) {
    case 'GET_BOOKMARK': {
      return {
        ...state,
        data: action.data

      };
    }
    case 'GET_TOTALBOOKMARK': {
      return {
        ...state,
        bookmarksData: state.bookmarksData.concat(action.data)
      };
    }
    case 'POST_BOOKMARK': {
      const actionData = action.data;
      actionData.isBookmarked = true;
      return {
        ...state,
        data: actionData
      };
    }
    case 'DELETE_BOOKMARK': {
      const pageId = action.data.uri[0];
      const getDeletedbookmark = state.bookmarksData.filter(bookmark => bookmark.uri !== pageId);
      return {
        ...state,
        bookmarksData: getDeletedbookmark,
        data: action.data
      };
    }
    case 'CLEAR_BOOKMARKS': {
      return {
        ...state,
        bookmarksData: []
      };
    }
    default :
      return state;
  }
};
