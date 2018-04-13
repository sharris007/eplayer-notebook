


/* Action handler for checking the action type and pass the updated state to respective container. */
const initialState = {};
export default function (state = initialState, action) {
  let newState = {};
  switch(action.type) {
    case 'DEEPLINK_TOKEN_LOGIN':
     {
      state=action.data?action.data.data:{};
      break;
     } default : {
      state={...newState};
      break;
     }
  }
  
  return state;
}

