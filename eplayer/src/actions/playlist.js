import PlaylistApi from '../api/playlistApi';
import { typeConstants } from '../../const/Constants';

// GET Book Details
export const getPlaylistCompleteDetails = json => ({
  type: typeConstants.GET_PLAYLIST,
  data: json,
  playlistReceived: true
});

export const getTocCompleteDetails = json => ({
  type: typeConstants.GET_TOC,
  data: json,
  tocReceived: true
});

function getTocUrlOnResp(resp)
{
    var tocUrl;
    if (resp) {
      var tocArr = resp;
      $.each(tocArr, function(key, value) {
        var ext = value.substr(value.lastIndexOf('.') + 1);
        if (ext === "xhtml")
            tocUrl = value;
        });
        if (!tocUrl)
          tocUrl = resp.toc[0];
     }
    return tocUrl ? tocUrl.replace('http:', 'https:') : null;
}
export const getBookCallService = data => dispatch => PlaylistApi.doGetBookDetails(data)
   .then(response => response.json())
   .then(response => {
      const bookId = response.bookDetail.bookId;
      const tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);
      const bookDetails = response.bookDetail.metadata;
      PlaylistApi.doGetTocDetails(bookId,tocUrl).then(response => response.json())
      .then(response =>{
        response.bookConfig =bookDetails; 
        dispatch(getTocCompleteDetails(response));
      });

      PlaylistApi.doGetPlaylistDetails(bookId,tocUrl).then(response => response.json())
      .then(response =>dispatch(getPlaylistCompleteDetails(response)));
   }
);