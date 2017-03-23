import { apiConstants } from '../../const/Constants';

export const getAnndata = data => fetch(`${apiConstants.ANNOTATION}/context/${data.context}/annotations?uri=${data.uri}`,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});// eslint-disable-line

export const postAnnData = data => fetch(`${apiConstants.ANNOTATION}/context/${data.context}/annotations`, { // eslint-disable-line no-undef
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':'epluser'
  },
  body: JSON.stringify(data)
});

export const putAnnData = data => fetch(`${apiConstants.ANNOTATION}/context/${data.context}/annotations/${data.id}`, {// eslint-disable-line no-undef
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':'epluser'
  },
  body: JSON.stringify(data)
});

export const deleteAnnData = annId =>
 fetch(`${apiConstants.ANNOTATION}/context/${data.context}/annotations/${annId}`, {// eslint-disable-line no-undef
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':'epluser'
  }
});

// ----Play list toc----------------------------------

export const getBookDetails = bookId => 
fetch(apiConstants.PAPERBASE+'/books/'+bookId+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=xlet2edu&courseInfo=true&includeBookData=true',
//fetch(apiConstants.PAPERBASE+'/books/'+bookId+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=staging_inst2&courseInfo=true&includeBookData=true',
 {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export const getPlaylistDetails = (bookId,tocurl) => fetch(`${apiConstants.PAPERBASE}`+'/custom/playlist/contextId/'+bookId+'?provider='+tocurl, { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});