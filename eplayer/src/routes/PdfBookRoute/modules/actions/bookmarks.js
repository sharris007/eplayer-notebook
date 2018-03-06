import { eT1Contants } from '../../../../components/common/et1constants';
import { clients } from '../../../../components/common/client';
import { languages } from '../../../../../locale_config/translations/index';
import languageName from '../../../../../locale_config/configureLanguage';
import { resources, domain } from '../../../../../const/Settings';
import { request } from '../pdfbook';
import { addLocaleData } from 'react-intl';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();

/*bookId, userId, Page, roletypeid, courseId, piSessionKey*/
export const getBookmarks = (authObj, currentBook) => {
  const bookState = {
    bookmarkData: {
      bookmarkList: []
    }
  };
  let queryString;
  queryString = '/api/context/'+currentBook.bookId+'/identities/'+authObj.userid+'/notesX?isBookMark=true';
  return (dispatch) => {
    dispatch(request('bookmarks'));
    return clients.readerApi[envType].get(queryString, {
        headers: {
        'X-Authorization': authObj.piToken,
        'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status >= 400) {
          bookState.bookmarkData.fetching = false;
          bookState.bookmarkData.fetched = false;
          return dispatch({ type: 'RECEIVE_BOOKMARKS', bookState });
        }
        return response.data.response;
      })
    .then((bookmarkResponseList) => {
      const locale = languageName(currentBook.languageid);
      const localisedData = locale.split('-')[0];
      addLocaleData((require(`react-intl/locale-data/${localisedData}`)));
      const { messages } = languages.translations[locale];
      let Page = messages.page ? messages.page : 'Page';
      if (bookmarkResponseList.length) {
        bookmarkResponseList.forEach((bookmark) => {
          const extID = Number(bookmark.pageId);
          const bmObj = {
            id: extID,
            bkmarkId: bookmark.id,
            userId: bookmark.userId,
            bookId: bookmark.contextId,
            pageId: bookmark.data.pageId,
            pageNo: bookmark.pageNo,
            roleTypeId: bookmark.role,
            createdTimestamp: bookmark.updatedTime,
            title: `${Page} ${bookmark.pageNo}`,
            uri: extID,
            externalId: extID
          };
          if (currentBook.roletypeid == eT1Contants.UserRoleType.Instructor && bookmark.subContextId == currentBook.courseId)
          {
            bookState.bookmarkData.bookmarkList.push(bmObj);
          }
          else if (currentBook.roletypeid == eT1Contants.UserRoleType.Student)
          {
            bookState.bookmarkData.bookmarkList.push(bmObj);
          }
        });
      }
      bookState.bookmarkData.bookmarkList.sort((bkm1, bkm2) => bkm1.uri - bkm2.uri);
      bookState.bookmarkData.fetching = false;
      bookState.bookmarkData.fetched = true;
      return dispatch({ type: 'RECEIVE_BOOKMARKS', bookState });
    });
  };
}

/*bookmarkId, userId, bookId, piSessionKey*/
export const deleteBookmark = (bookmarkId, authObj, currentBook) => {
  return (dispatch) => {
    return clients.readerApi[envType].delete('/api/context/'+currentBook.bookId+'/identities/'+authObj.userid+'/notesX?isBookMark=true', {
      headers: {
        'X-Authorization': authObj.piToken,
        'Content-Type': 'application/json'
      },
      data:{"ids":[bookmarkId]}
    }).then((response) => {
      if (response.status >= 400) {
         // console.log(`Error in remove bookmark: ${response.statusText}`)
      }
      return dispatch({ type: 'REMOVE_BOOKMARK', bookmarkId });
    });
  };
}

/*userId, bookId, pageId, pageNo, externalId, courseId, shared, Page, roleTypeId, piSessionKey*/
export function postBookmark(currentPage, authObj, currentBook) {
  clients.readerApi[envType].defaults.headers =  {'X-Authorization':authObj.piToken,'Content-Type': 'application/json'};
  const data = {
    clientApp: eT1Contants.clientAppNameForSpectrumApi,
    isBookMark:true,
    userId: authObj.userid,
    data: {
      pageId: currentPage.id
    },
    role:currentBook.roletypeid,
    contextId: currentBook.bookId,
    pageId: currentPage.id,
    productModel: eT1Contants.productModelForSpectrumApi,
    pageNo: currentPage.pagenumber,
    subContextId: currentBook.courseId,
    shareable: false
  };
  let bmObj;
  return (dispatch) => {
    return clients.readerApi[envType].post('/api/context/'+currentBook.bookId+'/identities/'+authObj.userId+'/notesX', {"payload":[data]})
    .then((response) => {
      if (response.status >= 400) {
        // console.log(`Add bookmark error: ${response.statusText}`);
      }
      return response.data.response;
    }).then((bookmarkResponseList) => {
      let bookmarkList = [];
      if (bookmarkResponseList !== undefined) {
        const locale = languageName(currentBook.languageid);
        const localisedData = locale.split('-')[0];
        addLocaleData((require(`react-intl/locale-data/${localisedData}`)));
        const { messages } = languages.translations[locale];
        let Page = messages.page ? messages.page : 'Page';
        bookmarkResponseList.forEach((bookmark) => {
        // const date = new Date(bookmark.updatedTime * 1000);
        const extID = Number(bookmark.pageId);
        bmObj = {
          id: extID,
          bkmarkId: bookmark.id,
          userId: bookmark.userId,
          bookId: bookmark.contextId,
          pageId: bookmark.data.pageId,
          pageNo: bookmark.pageNo,
          roleTypeId: bookmark.role,
          createdTimestamp: bookmark.updatedTime,
          title: `${Page} ${bookmark.pageNo}`,
          uri: extID,
          externalId: extID
         };
         bookmarkList.push(bmObj);
        })
      }
      return dispatch({ type: 'ADD_BOOKMARK', bookmarkList });
    });
  };
}

