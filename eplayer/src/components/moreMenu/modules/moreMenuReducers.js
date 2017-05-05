export const LOGOUT_PENDING = 'LOGOUT_PENDING';
export const LOGOUT_FULFILLED = 'LOGOUT_FULFILLED';
export const LOGOUT_REJECTED = 'LOGOUT_REJECTED';
export const LOGOUT_USER_SESSION_PENDING = 'LOGOUT_USER_SESSION_PENDING';
export const LOGOUT_USER_SESSION_FULFILLED = 'LOGOUT_USER_SESSION_FULFILLED';
export const LOGOUT_USER_SESSION_REJECTED = 'LOGOUT_USER_SESSION_REJECTED';

const ACTION_HANDLERS = {
  [LOGOUT_PENDING]: state => ({ ...state, loggingout: true, error: null }),

  [LOGOUT_FULFILLED]: (state, action) => ({
    ...state,
    data: action.payload,
    loggingout: false,
    loggedout: true,
    error: null }),

  [LOGOUT_REJECTED]: (state, action) => ({
    ...state,
    loggingout: false,
    loggedout: false,
    error: action.payload,
    data: [] }),

  [LOGOUT_USER_SESSION_PENDING]: state => ({ ...state, loggingout_userSession: true, error_userSession: null }),

  [LOGOUT_USER_SESSION_FULFILLED]: (state, action) => ({ 
    ...state,
    data_userSession: action.payload,
    loggingout_userSession: false,
    loggedout_userSession: true,
    error_userSession: null }),

  [LOGOUT_USER_SESSION_REJECTED]: (state, action) => ({
    ...state,
    loggingout_userSession: false,
    loggedout_userSession: false,
    error_userSession: action.payload,
    data_userSession: [] })
};

const initialState = {
  data: [],
  loggedout: false,
  loggingout: false,
  error: null,
  data_userSession: [],
  loggedout_userSession: false,
  loggingout_userSession: false,
  error_userSession: null
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
