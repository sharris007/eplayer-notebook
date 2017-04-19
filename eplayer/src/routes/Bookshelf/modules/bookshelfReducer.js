// ------------------------------------
// Constants
// ------------------------------------
export const BOOKS_PENDING = 'BOOKS_PENDING';
export const BOOKS_REJECTED = 'BOOKS_REJECTED';
export const BOOKS_FULFILLED = 'BOOKS_FULFILLED';
//export const UPDF = 'UPDF';
//export const SERVERDETAILS = 'SERVERDETAILS';
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
  //[UPDF]: (state, action) => ({ ...state, uPdf:action.uPdf }),
  //[SERVERDETAILS]: (state, action) => ({ ...state, serverDetails:action.serverDetails }),
  [BOOK_DETAILS]: (state, action) => ({ ...state, authorName:action.authorName,title:action.title,thumbnail:action.thumbnail,globalBookId:action.globalBookId,bookeditionid:action.bookeditionid,uPdf:action.uPdf,serverDetails:action.serverDetails,bookId:action.bookId,uid:action.uid,ubd:action.ubd,ubsd:action.ubsd}),
  [BOOKS_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload }),
  [SSO_KEY]: (state, action) => ({ ...state, ssoKey:action.ssoKey }),
   

};

const initialState = {
  books: [],
  fetched: false,
  fetching: false,
  error: null,
  uPdf:"",
  serverDetails: "",
  authorName:"",
  title:"",
  thumbnail:"",
  bookeditionid:0,
  ssoKey: "",
  globalBookId : "",
  bookId : "",
  uid : "",
  ubd : "",
  ubsd : "",
  
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

