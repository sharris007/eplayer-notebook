

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
export const LOGIN_REJECTED = 'LOGIN_REJECTED';
export const LOGIN_DETAILS ='LOGIN_DETAILS';

/**
 * Action Handlers for BOOKS actions.
 *
 * @type {{type}} returns the handler for action type
 */
const ACTION_HANDLERS = {
  [LOGIN_PENDING]: state => ({ ...state, fetching: true, error: null }),

  [LOGIN_FULFILLED]: (state, action) => ({
    ...state,
    fetching: false,
    fetched: true,
    data: action.payload.data,
    error: null }),

  [LOGIN_REJECTED]: (state, action) => ({ ...state, fetching: false, fetched: false, error: action.data }),
  [LOGIN_DETAILS]:(state, action) => ({...state,data:action.data}),
};

const initialState = {
  data: {},
  fetched: false,
  fetching: false,
  error: null
  
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

