const initalData = { 
  data: [], 
  playlistReceived: false 
};
export default (state = initalData, action) => {
  switch (action.type) {
    case 'GET_PLAYLIST': {
      return {
        ...state,
        data: action.data,
        playlistReceived: action.playlistReceived
      };
    }
    default :
      return state;
  }
};
