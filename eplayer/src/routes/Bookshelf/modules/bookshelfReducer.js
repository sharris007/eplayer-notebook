// ------------------------------------
// Constants
// ------------------------------------
export const BOOKS_PENDING = 'BOOKS_PENDING';
export const BOOKS_REJECTED = 'BOOKS_REJECTED';
export const BOOKS_FULFILLED = 'BOOKS_FULFILLED';
export const UPDF = 'UPDF';
export const BOOK_DETAILS = 'BOOK_DETAILS';
export const SSO_KEY = 'SSO_KEY';



/**
 * Action Handlers for BOOKS actions.
 *
 * @type {{type}} returns the handler for action type
 */
const ACTION_HANDLERS = {
  [BOOKS_PENDING]: state => ({ ...state, fetching: true, error: null }),

  [BOOKS_FULFILLED]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    books: action.payload,
    error: null }),
  [UPDF]: (state, action) => ({ ...state, uPdf:action.uPdf }),
  [BOOK_DETAILS]: (state, action) => ({ ...state, authorName:action.authorName,title:action.title,thumbnail:action.thumbnail,bookeditionid:action.bookeditionid}),
  [BOOKS_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),
  [SSO_KEY]: (state, action) => ({ ...state, ssoKey:action.ssoKey }),

};

const initialState = {
  books: [],
  fetched: false,
  fetching: false,
  error: null,
  uPdf:"",
  authorName:"",
  title:"",
  thumbnail:"",
  bookeditionid:0,
  ssoKey: ""
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

