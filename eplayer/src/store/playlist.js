const initalData = { 
  data: [], 
  tocdata: [], 
  playlistReceived: false,
  tocReceived: false 
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
    case 'GET_TOC': {
      return {
        ...state,
        tocdata: action.data,
        tocReceived: action.tocReceived
      };
    }
    default :
      return state;
  }
};
