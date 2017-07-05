// ------------------------------------
// Constants
// ------------------------------------
export const SEARCH_PENDING = 'SEARCH_PENDING';
export const SEARCH_REJECTED = 'SEARCH_REJECTED';
export const SEARCH = 'SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
/**
 * Action Handlers for Search actions.
 *
 * @type {{type}} returns the handler for action type
 */
const ACTION_HANDLERS = {
  [SEARCH]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    data: action.searchState.searchResult.results,
    error: null }),
  [CLEAR_SEARCH]: state => ({
    ...state,
    data: [],
    fetched: false,
    fetching: false,
    error: null })
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
