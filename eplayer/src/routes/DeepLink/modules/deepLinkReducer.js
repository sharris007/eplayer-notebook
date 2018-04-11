


/* Action handler for checking the action type and pass the updated state to respective container. */
const initialState = {};
export default function (state = initialState, action) {
  const newState = action.data?action:{};
  state={...newState}
  return state;
}

