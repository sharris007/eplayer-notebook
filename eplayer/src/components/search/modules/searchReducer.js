// ------------------------------------
// Constants
// ------------------------------------
export const SEARCH_PENDING = 'SEARCH_PENDING';
export const SEARCH_REJECTED = 'SEARCH_REJECTED';
export const SEARCH_FULFILLED = 'SEARCH_FULFILLED';

/**
 * Action Handlers for Search actions.
 *
 * @type {{type}} returns the handler for action type
 */
const ACTION_HANDLERS = {
  [SEARCH_PENDING]: state => ({ ...state, fetching: true, error: null }),

  [SEARCH_FULFILLED]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    data: action.payload,
    error: null }),

  [SEARCH_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.payload })
};

const initialState = {
  data: [],
  fetched: false,
  fetching: false,
  error: null
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
