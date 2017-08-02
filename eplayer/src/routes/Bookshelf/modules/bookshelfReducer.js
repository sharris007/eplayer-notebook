// ------------------------------------
// Created Action constant for BOOK  and SSO_KEY.
// ------------------------------------
export const BOOKS_PENDING = 'BOOKS_PENDING';
export const BOOKS_REJECTED = 'BOOKS_REJECTED';
export const BOOKS_FULFILLED = 'BOOKS_FULFILLED';
export const BOOK_DETAILS = 'BOOK_DETAILS';
export const SSO_KEY = 'SSO_KEY';
export const AUTH_FULFILLED = 'AUTH_FULFILLED';
export const GOTAUTH = 'GOTAUTH';

/**
 * Action Handlers for BOOKS actions.
 *
 * @type {{type}} returns the handler for action type
 */
const ACTION_HANDLERS = {
  /* Reducers for Books, here is three state, BOOK_PENDING, for when fetching,
     BOOK_FULFILLED, when book date is fetched,
     BOOK_REJECTED, when data did not fetch. */
  [BOOKS_PENDING]: state => ({ ...state, fetching: true, error: null }),

  [BOOKS_FULFILLED]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    books: action.payload,
    error: null }),
  [BOOK_DETAILS]: (state, action) => ({ ...state, authorName: action.authorName, title: action.title, thumbnail: action.thumbnail, globalUserId: action.globalUserId, globalBookId: action.globalBookId, bookeditionid: action.bookeditionid, uPdf: action.uPdf, serverDetails: action.serverDetails, bookId: action.bookId, uid: action.uid, ubd: action.ubd, ubsd: action.ubsd, roleTypeID: action.roleTypeID }),  // eslint-disable-line max-len
  [BOOKS_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),
  [SSO_KEY]: (state, action) => ({ ...state, ssoKey: action.ssoKey }),

  [AUTH_FULFILLED]: (state, action) => ({
    ...state,
    authFetched: true,
    authData: action.payload,
    error: null }),
  [GOTAUTH]: (state, action) => ({
    ...state,
    authFetched: action.payload.authFetched,
    error: null }),
};

/* Initial state for following properties. */

const initialState = {
  books: [],
  fetched: false,
  fetching: false,
  error: null,
  uPdf: '',
  serverDetails: '',
  authorName: '',
  title: '',
  thumbnail: '',
  bookeditionid: 0,
  ssoKey: '',
  globalBookId: '',
  bookId: '',
  uid: '',
  ubd: '',
  ubsd: '',
  roleTypeID: '',
  authFetched: false,
  authData:[]
};

/* Action handler for checking the action type and pass the updated state to respective container. */

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

