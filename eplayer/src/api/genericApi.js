import { apiConstants } from '../../const/Constants';

export const getAnndata = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations?uri=${data.uri}`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});// eslint-disable-line

export const postAnnData = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations`, { // eslint-disable-line no-undef
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  },
  body: JSON.stringify(data)
});

export const putAnnData = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations/${data.id}`, {// eslint-disable-line no-undef
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  },
  body: JSON.stringify(data)
});

export const deleteAnnData = data =>
 fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations/${data.id}`, {// eslint-disable-line no-undef
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});

// ----Play list toc----------------------------------

export const getBookDetails = bookId => 
fetch(apiConstants.PAPERBASE+'/books/'+bookId+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=xlet2edu&courseInfo=true&includeBookData=true',
 {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export const getTocDetails = (bookId,tocurl) => fetch(`${apiConstants.PAPERBASE}`+'/custom/toc/contextId/'+bookId+'?provider='+tocurl, { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export const getPlaylistDetails = (bookId,tocurl) => fetch(`${apiConstants.PAPERBASE}`+'/custom/playlist/contextId/'+bookId+'?provider='+tocurl+'&removeDuplicates=false', { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Bookmark Api Call,
export const getBookmarkData = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/identities/${data.user}/bookmarks?uri=${data.uri}`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});