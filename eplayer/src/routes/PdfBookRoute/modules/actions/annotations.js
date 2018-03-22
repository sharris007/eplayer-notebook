import _ from 'lodash';
import { eT1Contants } from '../../../../components/common/et1constants';
import { clients } from '../../../../components/common/client';
import { domain } from '../../../../../const/Settings';
import { request } from '../pdfbook';

const envType = domain.getEnvType();

/* bookId, courseId, userid, roletypeid, piSessionKey*/
export const getAnnotations = (authObj, currentBook) => {
  const bookState = {
    annotationData: {
      annotationList: []
    }
  };
  if (!currentBook.bookId || !authObj.userid || !authObj.piToken) {
    bookState.annotationData.fetching = false;
    bookState.annotationData.fetched = false;
    return { type: 'RECEIVE_ANNOTATIONS', bookState };
  }
  let queryString;
  if (currentBook.roletypeid === _.toString(eT1Contants.UserRoleType.Student)) {
    queryString = `/api/context/${currentBook.bookId}/identities/${authObj.userid}/notesX?
    isBookMark=false&withShared=true`;
  } else {
    queryString = `/api/context/${currentBook.bookId}/identities/${authObj.userid}/notesX?isBookMark=false`;
  }
  return (dispatch) => {
    dispatch(request('highlights'));
    return clients.readerApi[envType].get(queryString, {
      headers: {
        'X-Authorization': authObj.piToken
      }
    }).then((response) => {
      if (response.status >= 400) {
        bookState.annotationData.fetching = false;
        bookState.annotationData.fetched = false;
        return dispatch({ type: 'RECEIVE_ANNOTATIONS', bookState });
      }
      return response.data.response;
    }).then((highlightResponseList) => {
      if (highlightResponseList.length) {
        highlightResponseList.forEach((highlight) => {
          const hlObj = {

          };
          const pageid = Number(highlight.pageId);
          hlObj.userId = highlight.userId;
          hlObj.pageId = pageid;
          hlObj.courseId = highlight.subContextId;
          hlObj.shared = highlight.shareable;
          hlObj.highlightHash = highlight.data.highlightHash;
          hlObj.comment = highlight.data.note;
          hlObj.text = highlight.selectedText;
          hlObj.color = highlight.color;
          hlObj.originalColor = highlight.color;
          hlObj.id = highlight.id;
          hlObj.pageNo = highlight.pageNo;
          hlObj.meta = highlight.data;
          hlObj.author = highlight.data.author;
          hlObj.time = highlight.updatedTime;
          if ((currentBook.roletypeid === _.toString(eT1Contants.UserRoleType.Instructor)
            && (_.toString(hlObj.meta.roletypeid) === _.toString(currentBook.roletypeid))
            && (_.toString(hlObj.userId) === _.toString(authObj.userid))
            && hlObj.courseId === currentBook.courseId) ||
            (currentBook.roletypeid === _.toString(eT1Contants.UserRoleType.Student)
            && (_.toString(hlObj.meta.roletypeid) === _.toString(currentBook.roletypeid))
            && (_.toString(hlObj.userId) === _.toString(authObj.userid)))) {
            hlObj.isHighlightOnly = false;
            bookState.annotationData.annotationList.push(hlObj);
          } else if (currentBook.roletypeid === _.toString(eT1Contants.UserRoleType.Student)
            && hlObj.meta.roletypeid === _.toString(eT1Contants.UserRoleType.Instructor)
            && hlObj.courseId === currentBook.courseId) {
            if (hlObj.shared) {
              hlObj.isHighlightOnly = false;
            } else {
              hlObj.isHighlightOnly = true;
            }
            bookState.annotationData.annotationList.push(hlObj);
          }
        });
      }
      bookState.annotationData.annotationList.sort((hl1, hl2) => hl2.time - hl1.time);
      bookState.annotationData.fetching = false;
      bookState.annotationData.fetched = true;
      return dispatch({ type: 'RECEIVE_ANNOTATIONS', bookState });
    });
  };
};
/* userId, bookId, pageNo,courseId, shared, selectedText, color, meta, currentPageId,roleTypeId, piSessionId*/
export const postAnnotation = (authObj, currentBook, currentPage, annotation) => {
  if (!currentBook.bookId || !authObj.userid || !authObj.piToken) {
    return { type: 'SAVE_ANNOTATION' };
  }
  const axiosInstance = clients.readerApi[envType];
  axiosInstance.defaults.headers = { 'X-Authorization': authObj.piToken, 'Content-Type': 'application/json' };
  const data = {
    clientApp: eT1Contants.clientAppNameForSpectrumApi,
    color: annotation.color,
    contextId: currentBook.bookId,
    role: _.toString(currentBook.roletypeid),
    data: annotation.meta,
    isBookMark: false,
    productModel: eT1Contants.productModelForSpectrumApi,
    pageId: _.toString(currentPage.id),
    pageNo: _.toString(currentPage.pagenumber),
    selectedText: annotation.selectedText,
    shareable: annotation.shared,
    subContextId: currentBook.courseId,
    userId: authObj.userid
  };
  return dispatch =>
  axiosInstance.post(`/api/context/${currentBook.bookId}/identities/${authObj.userid}/notesX`, { payload: [data] })
  .then((response) => {
    if (response.status >= 400) {
        // console.log(`error: ${response.statusText}`);
    }
    return response.data.response;
  }).then((highlightResponseList) => {
    const highlightList = [];
    if (highlightResponseList !== undefined) {
      highlightResponseList.forEach((highlight) => {
        const pageid = Number(highlight.pageId);
        const hlObj = {
          userId: highlight.userId,
          pageId: pageid,
          courseId: highlight.subContextId,
          shared: highlight.shareable,
          highlightHash: highlight.data.highlightHash,
          comment: highlight.data.note,
          text: highlight.selectedText,
          color: highlight.color,
          originalColor: highlight.color,
          id: highlight.id,
          pageNo: highlight.pageNo,
          meta: highlight.data,
          author: highlight.data.author,
          time: highlight.updatedTime
        };
        highlightList.push(hlObj);
      });
    }
    dispatch({ type: 'SAVE_ANNOTATION', highlightList });
    return highlightList[0];
  });
};

/* id, userId, bookId, authorizationHeaderVal*/
export const deleteAnnotation = (id, authObj, currentBook) => {
  if (!currentBook.bookId || !authObj.userid || !authObj.piToken || !id) {
    return { type: 'DELETE_ANNOTATION' };
  }
  const axiosInstance = clients.readerApi[envType];
  axiosInstance.defaults.headers = { 'X-Authorization': authObj.piToken, 'Content-Type': 'application/json' };
  return dispatch =>
  axiosInstance.delete(`/api/context/${currentBook.bookId}/identities/${authObj.userid}/notesX?isBookMark=false`,
    { data: { ids: [id] } }).then((response) => {
      if (response.status >= 400) {
        // console.log(`Error in remove highlight: ${response.statusText}`)
      }
      return dispatch({ type: 'DELETE_ANNOTATION', id });
    });
};
/* id, note, color, isShared, userId, bookId, pageNo, courseId, selectedText, roleTypeId, meta, currentPageId, authorizationHeaderVal*/
export const putAnnotation = (authObj, currentBook, currentPage, annotationData, annotationToEdit) => {
  if (!currentBook.bookId || !authObj.userid || !authObj.piToken || !annotationToEdit) {
    return { type: 'EDIT_ANNOTATION' };
  }
  const editHightlightURI = `/api/context/${currentBook.bookId}/identities/${authObj.userid}/notesX`;
  const payloadData = {
    id: annotationToEdit.id,
    clientApp: eT1Contants.clientAppNameForSpectrumApi,
    color: annotationData.color,
    contextId: currentBook.bookId,
    data: annotationData.meta,
    isBookMark: false,
    productModel: eT1Contants.productModelForSpectrumApi,
    pageId: _.toString(currentPage),
    pageNo: annotationToEdit.pageNo,
    role: _.toString(currentBook.roletypeid),
    selectedText: annotationToEdit.text,
    shareable: annotationData.isShared,
    subContextId: annotationToEdit.courseId,
    userId: _.toString(authObj.userid)
  };
  if (annotationData.note !== undefined) {
    payloadData.data.note = annotationData.note;
  }

  const axiosInstance = clients.readerApi[envType];
  axiosInstance.defaults.headers = { 'X-Authorization': authObj.piToken, 'Content-Type': 'application/json' };
  // const authorizationHeaderVal = createAuthorizationToken(editHightlightURI, 'PUT');
  return dispatch => axiosInstance.put(editHightlightURI, { payload: [payloadData] }).then((response) => {
    if (response.status >= 400) {
        // console.log(`Error in edit highlight: ${response.statusText}`);
    }
    return response.data.response[0];
  }).then((highlightResponse) => {
    let highlightObj;
    if (highlightResponse !== undefined) {
        // const time = new Date(highlightResponse.updatedTime * 1000);
      const pageid = Number(highlightResponse.pageId);
      highlightObj = {
        userId: highlightResponse.userId,
        pageId: pageid,
        courseId: highlightResponse.subContextId,
        shared: highlightResponse.shareable,
        highlightHash: highlightResponse.data.highlightHash,
        comment: highlightResponse.data.note,
        text: highlightResponse.selectedText,
        color: highlightResponse.color,
        originalColor: highlightResponse.color,
        id: highlightResponse.id,
        pageNo: highlightResponse.pageNo,
        meta: highlightResponse.data,
        author: highlightResponse.data.author,
        time: highlightResponse.updatedTime
      };
    }
    return dispatch({ type: 'EDIT_ANNOTATION', highlightObj });
  });
};
