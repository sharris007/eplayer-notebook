export const LOGOUT_PENDING = 'LOGOUT_PENDING';
export const LOGOUT_FULFILLED = 'LOGOUT_FULFILLED';
export const LOGOUT_REJECTED = 'LOGOUT_REJECTED';

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
    data: [] })
};

const initialState = {
  data: [],
  loggedout: false,
  loggingout: false,
  error: null
};

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
