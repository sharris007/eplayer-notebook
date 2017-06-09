import fetch from 'isomorphic-fetch';
import { clients } from '../../../components/common/client';

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS';
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS';
export const ADD_ANNOTATION = 'ADD_ANNOTATION';
export const REMOVE_ANNOTATION = 'REMOVE_ANNOTATION';
export const ANNOTATION_SERVICE_URL = 'https://paperapi-qa.stg-openclass.com/nextext-api/cite/annotations/book/';

export const REQUEST_BOOKMARKS = 'REQUEST_BOOKMARKS';
export const RECEIVE_BOOKMARKS = 'RECEIVE_BOOKMARKS';
export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';
export const BOOKMARK_SERVICE_URL = 'https://paperapi-qa.stg-openclass.com/nextext-api/cite/bookmarks/book/';

export const REQUEST_PREFERENCES = 'REQUEST_PREFERENCES';
export const RECEIVE_PREFERENCES = 'RECEIVE_PREFERENCES';
export const PREFERENCE_SERVICE_URL = 'http://paperapi-qa.stg-openclass.com/nextext-api/api/nextext/users/cite_qauser1/preferences'; // eslint-disable-line

export const REQUEST_TOC = 'REQUEST_TOC';
export const RECEIVE_TOC = 'RECEIVE_TOC';

export const REQUEST_VIEWER = 'REQUEST_VIEWER';
export const RECEIVE_VIEWER = 'RECEIVE_VIEWER';
export const GO_TO_PAGE = 'GO_TO_PAGE';

export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const GET = 'GET';

export const RECEIVE_PLAYLIST = 'RECEIVE_PLAYLIST';
// ------------------------------------
// Actions
// ------------------------------------
export function request(component) {
  switch (component) {
    case 'annotations':
      return { type: REQUEST_ANNOTATIONS };
    case 'bookmarks':
      return { type: REQUEST_BOOKMARKS };
    case 'preferences':
      return { type: REQUEST_PREFERENCES };
    case 'toc':
      return { type: REQUEST_TOC };
    case 'viewer':
      return { type: REQUEST_VIEWER };
    default:
      return {};
  }
}

export function fetchAnnotations(bookId) {
  const bookState = {
    annotations: [],
    isFetching: {
      annotations: true
    }
  };
  return (dispatch) => {
    dispatch(request('annotations'));
    return fetch(ANNOTATION_SERVICE_URL + bookId, {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        bookState.isFetching.annotations = false;
        return dispatch({ type: RECEIVE_ANNOTATIONS, bookState });
      }
      return response.json();
    })
    .then((annotations) => {
      if (annotations.length) {
        annotations.forEach((annotation) => {
          const annObj = {
            id: annotation.id,
            author: annotation.jsonData.author,
            color: annotation.jsonData.color,
            comment: annotation.jsonData.comment,
            text: annotation.jsonData.text,
            pageId: annotation.jsonData.pageId,
            time: parseInt(annotation.createdAt, 10)
          };
          bookState.annotations.push(annObj);
        });
      }
      bookState.isFetching.annotations = false;
      return dispatch({ type: RECEIVE_ANNOTATIONS, bookState });
    });
  };
}

export function addAnnotation(bookId, annotationToAdd) {
  return (dispatch) => {
    dispatch(request('annotations'));
    return fetch(ANNOTATION_SERVICE_URL + bookId, {
      method: POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(annotationToAdd)
    })
    .then((response) => {
      if (response.status >= 400) {
        // TODO: Implement add annotation error
        //eslint-disable-next-line
      }
      return response.json();
    })
    .then(annotation =>
       dispatch({ type: ADD_ANNOTATION, annotation })
    );
  };
}

export function removeAnnotation(bookId, annotationId) {
  return (dispatch) => {
    dispatch(request('annotations'));
    return fetch(`${ANNOTATION_SERVICE_URL + bookId}/annotation/${annotationId}`, {
      method: DELETE
    })
    .then((response) => {
      if (response.status >= 400) {
        // TODO: Implement remove annotation error
        //eslint-disable-next-line
        console.log(`Remove annotation error: ${response.statusText}`);
      }
      return dispatch({ type: REMOVE_ANNOTATION, annotationId });
    });
  };
}

export function fetchBookmarks(bookId) {
  const bookState = {
    bookmarks: [],
    isFetching: {
      bookmarks: true
    }
  };
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return fetch(BOOKMARK_SERVICE_URL + bookId, {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        bookState.isFetching.bookmarks = false;
        return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
      }
      return response.json();
    })
    .then((bookmarks) => {
      if (bookmarks.length) {
        bookmarks.forEach((bookmark) => {
          const bmObj = {
            id: bookmark.id,
            uri: bookmark.jsonData.uri,
            data: bookmark.jsonData.data,
            createdTimestamp: parseInt(bookmark.createdAt, 10),
            title: bookmark.jsonData.title,
            labels: bookmark.jsonData.title
          };
          bookState.bookmarks.push(bmObj);
        });
      }
      bookState.isFetching.bookmarks = false;
      return dispatch({ type: RECEIVE_BOOKMARKS, bookState });
    });
  };
}

export function addBookmark(bookId, bookmarkToAdd) {
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return fetch(BOOKMARK_SERVICE_URL + bookId, {
      method: POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmarkToAdd)
    })
    .then((response) => {
      if (response.status >= 400) {
        // TODO: Implement add bookmark error
        //eslint-disable-next-line
        console.log(`Add bookmark error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(bookmark =>
       dispatch({ type: ADD_BOOKMARK, bookmark })
    );
  };
}

export function removeBookmark(bookId, bookmarkId) {
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return fetch(`${BOOKMARK_SERVICE_URL + bookId}/bookmark/${bookmarkId}`, {
      method: DELETE
    })
    .then((response) => {
      if (response.status >= 400) {
        // TODO: Implement remove bookmark error
        //eslint-disable-next-line
        console.log(`Remove bookmark error: ${response.statusText}`);
      }
      return dispatch({ type: REMOVE_BOOKMARK, bookmarkId });
    });
  };
}

export function fetchPreferences() {
  const bookState = {
    preferences: [],
    isFetching: {
      preferences: true
    }
  };
  return (dispatch) => {
    dispatch(request('preferences'));
    return fetch(PREFERENCE_SERVICE_URL, {
      method: GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        bookState.isFetching.preferences = false;
        return dispatch({ type: RECEIVE_PREFERENCES, bookState });
      }
      return response.json();
    })
    .then((preferences) => {
      bookState.preferences = {
        fontSize: preferences.fontSize,
        backgroundColor: preferences.theme
      };
      bookState.isFetching.preferences = false;
      return dispatch({ type: RECEIVE_PREFERENCES, bookState });
    });
  };
}

// function orderPages(unorderedPages, bookState, pageId) {
//   const orderedPages = [];
//   const bookSt = bookState;
//   const tocList = map(bookState.toc.content.list[0].children, 'id');
//   tocList.forEach((id) => {
//     unorderedPages.forEach((unorderedPage) => {
//       if (unorderedPage.id === id) {
//         orderedPages.push(unorderedPage);
//       }
//     });
//   });

//   if (pageId) {
//     orderedPages.forEach((obj) => {
//       if (obj.id === pageId) {
//         bookSt.viewer.currentPageId = obj.id;
//       }
//     });
//   } else {
//     bookSt.viewer.currentPageId = orderedPages[0].id;
//   }
//   bookSt.viewer.pages = orderedPages;
//   bookSt.isFetching.viewer = false;
// }

export function fetchTocAndViewer(bookId, tocImageAndTitle, pageId, tocUrl) {
  const bookState = {
    toc: {
      content: {}
    },
    viewer: {},
    isFetching: {
      toc: true,
      viewer: true
    }
  };
  return (dispatch) => {
    dispatch(request('toc'));
    dispatch(request('viewer'));
    return clients.etext.get(`/custom/toc/contextId/${bookId}?provider=${tocUrl}`)
    .then((response) => {
      const tocData = response.data;
      bookState.toc.content.id = 'testid';
      bookState.toc.content.mainTitle = 'Science';
      bookState.toc.content.author = 'Charles Dickens';
      bookState.toc.content.thumbnail = 'http://content.stg-openclass.com/eps/pearson-reader/api/item/4eaf188e-1798-446b-b382-90a0c6da6629/1/file/cover_thumbnail.jpg'; // eslint-disable-line max-len
      bookState.toc.content.list = [];
      const chapterPageObj = tocData.content.items;
      const repl = chapterPageObj.map(obj => ({
        id: obj.id,
        title: obj.title,
        coPage: obj.coPage,
        playOrder: obj.playOrder,
        children: obj.items

      }));

      bookState.toc.content.list = repl;
      bookState.isFetching.toc = false;
      dispatch({ type: RECEIVE_TOC, bookState });
    });
  };
}
export function fetchBookDetails(bookId) {
  return dispatch => clients.etext.get(`/books/${bookId}/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=nextext_smsedupi&courseInfo=true&includeBookData=true`) // eslint-disable-line max-len
    .then((response) => {
      const tocData = response.data;
      return clients.etext.get(`/custom/playlist/contextId/${bookId}?provider=${tocData.bookDetail.metadata.toc[0]}`)
        .then((pageData) => {
          const playlistData = pageData.data;
          dispatch({ type: RECEIVE_PLAYLIST, playlistData });
        });
    });
}

export function goToPage(pageId) {
  return (dispatch) => {
    dispatch({ type: GO_TO_PAGE, pageId });
  };
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_ANNOTATIONS]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      annotations: true
    }
  }),
  [RECEIVE_ANNOTATIONS]: (state, action) => ({
    ...state,
    annotations: action.bookState.annotations,
    isFetching: {
      ...state.isFetching,
      annotations: action.bookState.isFetching.annotations
    }
  }),
  [ADD_ANNOTATION]: (state, action) => ({
    ...state,
    annotations: [
      ...state.annotations,
      {
        id: action.response.id,
        text: action.response.jsonData.text,
        color: action.response.jsonData.color,
        author: action.response.jsonData.author,
        comment: action.response.jsonData.comment,
        time: action.response.jsonData.time,
        pageId: action.response.jsonData.pageId
      }
    ],
    isFetching: {
      ...state.isFetching,
      annotations: false
    }
  }),
  [REMOVE_ANNOTATION]: (state, action) => ({
    ...state,
    annotations: state.annotations.filter(annotation => annotation.id !== action.annotationId),
    isFetching: {
      ...state.isFetching,
      annotations: false
    }
  }),
  [REQUEST_BOOKMARKS]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      bookmarks: true
    }
  }),
  [RECEIVE_BOOKMARKS]: (state, action) => ({
    ...state,
    bookmarks: action.bookState.bookmarks,
    isFetching: {
      ...state.isFetching,
      bookmarks: action.bookState.isFetching.bookmarks
    }
  }),
  [ADD_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarks: [
      ...state.bookmarks,
      {
        id: action.bookmark.id,
        uri: action.bookmark.jsonData.uri,
        data: action.bookmark.jsonData.data,
        createdTimestamp: action.bookmark.createdAt,
        title: action.bookmark.jsonData.title,
        labels: action.bookmark.jsonData.labels
      }
    ],
    isFetching: {
      ...state.isFetching,
      bookmarks: false
    }
  }),
  [REMOVE_BOOKMARK]: (state, action) => ({
    ...state,
    bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.bookmarkId),
    isFetching: {
      ...state.isFetching,
      bookmarks: false
    }
  }),
  [REQUEST_PREFERENCES]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      preferences: true
    }
  }),
  [RECEIVE_PREFERENCES]: (state, action) => ({
    ...state,
    preferences: action.bookState.preferences,
    isFetching: {
      ...state.isFetching,
      preferences: action.bookState.isFetching.preferences
    }
  }),
  [REQUEST_TOC]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      toc: true
    }
  }),
  [RECEIVE_TOC]: (state, action) => ({
    ...state,
    toc: action.bookState.toc,
    isFetching: {
      ...state.isFetching,
      toc: action.bookState.isFetching.toc
    }
  }),
  [REQUEST_VIEWER]: state => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      viewer: true
    }
  }),
  [RECEIVE_VIEWER]: (state, action) => ({
    ...state,
    viewer: action.bookState.viewer,
    isFetching: {
      ...state.isFetching,
      viewer: action.bookState.isFetching.viewer
    }
  }),
  [RECEIVE_PLAYLIST]: (state, action) => ({
    ...state,
    playlist: action.playlistData
  }),
  [GO_TO_PAGE]: (state, action) => ({
    ...state,
    viewer: {
      ...state.viewer,
      currentPageId: action.pageId
    }
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  playlist: [],
  annotations: [],
  bookmarks: [],
  preferences: {},
  toc: {},
  viewer: {},
  isFetching: {
    annotations: false,
    bookmarks: false,
    preferences: false,
    toc: false,
    viewer: false
  },
  error: null
};

export default function book(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
