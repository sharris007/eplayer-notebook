import fetch from 'isomorphic-fetch';
import map from 'lodash/map';
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
        console.log(`Add annotation error: ${response.statusText}`);
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

function orderPages(unorderedPages, bookState, pageId) {
  const orderedPages = [];
  const bookSt = bookState;
  const tocList = map(bookState.toc.content.list[0].children, 'id');
  tocList.forEach((id) => {
    unorderedPages.forEach((unorderedPage) => {
      if (unorderedPage.id === id) {
        orderedPages.push(unorderedPage);
      }
    });
  });

  if (pageId) {
    orderedPages.forEach((obj) => {
      if (obj.id === pageId) {
        bookSt.viewer.currentPageId = obj.id;
      }
    });
  } else {
    bookSt.viewer.currentPageId = orderedPages[0].id;
  }
  bookSt.viewer.pages = orderedPages;
  bookSt.isFetching.viewer = false;
}

export function fetchTocAndViewer(bookId, tocImageAndTitle, pageId) {
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
    return clients.scapi.get('content/urn:pearson:manifestation:55a98cce-067a-4a73-b610-229959548eab')
    .then((response) => {
      const tocData = response.data;
      let nManifestIndex = 0;
      // Get corresponding index from mainifest passing in mainfest id
      for (let n = 0; n < tocData.manifest.length; n += 1) {
        if (tocData.manifest[n].id === bookId) {
          nManifestIndex = n;
        }
      }

      bookState.toc.content.id = tocData.manifest[nManifestIndex].urn || '';
      bookState.toc.content.mainTitle = tocImageAndTitle.title || '';
      bookState.toc.content.author = tocImageAndTitle.author || '';
      bookState.toc.content.thumbnail = tocImageAndTitle.image || '';
      bookState.toc.content.list = [];
      const listObj = {
        id: tocData.manifest[nManifestIndex].urn || '',
        title: tocData.manifest[nManifestIndex].label || '',
        children: []
      };
      bookState.toc.content.list.push(listObj);
      tocData.manifest[nManifestIndex].content.forEach((page) => {
        const chapterPageObj = {
          id: page.urn,
          title: page.label,
          playOrder: ''
        };
        bookState.toc.content.list[0].children.push(chapterPageObj);
      });
      bookState.isFetching.toc = false;
      dispatch({ type: RECEIVE_TOC, bookState });

      const unorderedPages = [];
      tocData.manifest[nManifestIndex].content.forEach((page) => {
        const pageObj = {
          id: page.urn,
          title: page.label
        };
        return clients.scapi.get(`content/${page.urn}`)
        .then((pageData) => {
          pageObj.content = pageData.data;
          unorderedPages.push(pageObj);
          if (unorderedPages.length === bookState.toc.content.list[0].children.length) {
            // On the last API call, order the pages according to TOC
            orderPages(unorderedPages, bookState, pageId);
            dispatch({ type: RECEIVE_VIEWER, bookState });
          }
        });
      });
    });
  };
}
export function fetchBookDetails(bookId) {

   return (dispatch) => {
    return clients.etext.get('/books/'+bookId+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=xlet2edu&courseInfo=true&includeBookData=true')
    .then((response) => {
      const tocData = response.data;
      return clients.etext.get('/custom/playlist/contextId/'+bookId+'?provider='+tocData.bookDetail.metadata.toc[0])
        .then((pageData) => {
          const playlistData = pageData.data;
          dispatch({ type: RECEIVE_PLAYLIST, playlistData});
        });
    });
  };
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
  playlist :[],
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
