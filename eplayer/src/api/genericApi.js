import { apiConstants } from '../../const/Constants';


export const getTotalAnndata = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});

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
fetch(apiConstants.PAPERBASE+'/books/'+bookId+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=nextext_smsedupi&courseInfo=true&includeBookData=true',
//fetch(apiConstants.PAPERBASE+'/books/'+bookId+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=staging_inst2&courseInfo=true&includeBookData=true',
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


// Bookmark Api Total GET Call,
export const getTotalBookmarkData = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/identities/${data.user}/bookmarks`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});

// Bookmark Api GET Call,
export const getBookmarkData = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/identities/${data.user}/bookmarks?uri=${data.id}`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});
// Bookmark Api Post Call,

export const postBookmarkData = postData => fetch(`${apiConstants.PXESERVICE}/context/${postData.context}/identities/${postData.user}/bookmarks`,{
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':postData.user
  },
  body:JSON.stringify(postData)
});

// Bookmark Api Delete Call,

export const deleteBookmarkData = deleteData => fetch(`${apiConstants.PXESERVICE}/context/${deleteData.context}/identities/${deleteData.user}/bookmarks?uri=${deleteData.uri}`,{
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Go to page Get call
export const getGotoPage = data => fetch(`${apiConstants.PXESERVICE}/context/${data.context}/identities/${data.user}/navigation?pageNumber=40&provider=${apiConstants.GOTOPAGEPROVIDER}/ba26dc5c-f1d0-43dd-9d37-e3e30c6c7cca/1/file/LutgensAtm13-071415-MJ-DW`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});