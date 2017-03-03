import PlaylistApi from '../api/playlistApi';
import { typeConstants } from '../../const/Constants';

// GET Book Details
export const getPlaylistCompleteDetails = json => ({
  type: typeConstants.GET_PLAYLIST,
  data: json,
  playlistReceived: true
});

export const getBookCallService = data => dispatch => PlaylistApi.doGetBookDetails(data)
   .then(response => response.json())
   .then(response => {
      const bookId = response.bookDetail.bookId;
      const tocUrl = response.bookDetail.metadata.toc[0];
      PlaylistApi.doGetPlaylistDetails(bookId,tocUrl).then(response => response.json()).
      then(response =>dispatch(getPlaylistCompleteDetails(response)));
   }
);