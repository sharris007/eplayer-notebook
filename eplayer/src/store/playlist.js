const initalData = {
  data: [],
  bookdetailsdata: [],
  tocdata: {bookDetails:{},content:{list:[]}},
  playlistReceived: false,
  tocReceived: false,
  bookDetailsRecived: false
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
    case 'BOOK_DETAILS': {
      return {
        ...state,
        bookdetailsdata: action.data,
        bookDetailsRecived: action.bookDetailsRecived
      };
    }
    default :
      return state;
  }
};
