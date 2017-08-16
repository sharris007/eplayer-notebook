const initalData = {
  data: [],
  tocdata: {bookDetails:{},content:{list:[]}},
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
    case 'CLEAR_PLAYLIST': {
      return {
        ...state,
        data: [],
        playlistReceived: false,
        tocReceived: false
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
