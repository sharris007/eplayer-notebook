import PlaylistApi from '../api/playlistApi';
import { typeConstants } from '../../const/Settings';

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
          tocUrl = resp[0];
     }
    return tocUrl ? tocUrl.replace('http:', 'https:') : null;
}
export const getBookCallService = data => dispatch => PlaylistApi.doGetBookDetails(data)
   .then(response => response.json())
   .then(response => {
    console.log("data*****", data);
      const bookId = response.bookDetail.bookId;
      const tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);
      const bookDetails = response.bookDetail.metadata;
      const piToken = data.piToken;
      PlaylistApi.doGetTocDetails(bookId,tocUrl,piToken).then(response => response.json())
      .then(response =>{
        response.bookConfig =bookDetails; 
        const tocResponse = response.content;
        tocResponse.mainTitle = bookDetails.title;
        tocResponse.author    = bookDetails.creator.substring(0,20)+'...';
        tocResponse.thumbnail = bookDetails.coverImageUrl;
        tocResponse.list      = [];
        const tocItems        = tocResponse.items;
        const listData        = tocItems.map(function(itemObj) {
                const subItems= itemObj.items.map(function(n) {
                    return {
                      urn: n.id,
                      href:n.href,
                      id:n.id,
                      playorder:n.playorder,
                      title:n.title
                    }
                });
            return {
                id: itemObj.id,
                title: itemObj.title,
                coPage: itemObj.coPage,
                playOrder: itemObj.playOrder,
                children: subItems
            }
        });
        tocResponse.list = listData;
        delete tocResponse.items;
        const tocFinalModifiedData = {'content':tocResponse,'bookDetails' : bookDetails }
        dispatch(getTocCompleteDetails(tocFinalModifiedData));
      });

      PlaylistApi.doGetPlaylistDetails(bookId,tocUrl,piToken).then(response => response.json())
      .then(response =>dispatch(getPlaylistCompleteDetails(response)));
   }
);