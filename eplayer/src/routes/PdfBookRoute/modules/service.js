import axios from 'axios';
import { resources, domain } from '../../../../const/Settings';

const etextCourseService = resources.links.courseServiceUrl;
const envType = domain.getEnvType();

export function fetchChapterLevelPdf(bookId, startPage, endPage, globalbookid, bookServerURL) {
  const serviceurl = `${bookServerURL}/ebook/pdfplayer/getchapterpdf?bookid=${bookId}` +
  `&startpageno=${startPage}&endpageno=${endPage}`;
  axios.get(`${serviceurl}`, { timeout: 20000 }).then((response) => {
    if (response.status >= 400) {
      // Nothing doing
      return {};
    } else if (response.data.length) {
      return ({
        startpageno: startPage,
        endpageno: endPage,
        chapterpdf: `${bookServerURL}/ebookassets`
                  + `/ebook${globalbookid}/chapterpdf/${response.data[0].chapterPdfList[0].chapterPdfFileName}`
      });
    }
    return {};
  });
}

export function fetchbookDetails(urn, piToken, bookID) {
  const url = `${etextCourseService[envType]}/web/compositeBookShelf`;
  axios.get(url, {
    headers: { 'Content-Type': 'application/json',
      'X-Authorization': piToken }
  }).then((response) => {
    let bookDetails;
    if (response.status >= 400) {
       // console.log('bookshelf error');
       // bookshelf error
    } else if (response.data) {
      const booksArray = response.data.entries;
      for (let i = 0; i < booksArray.length; i++) {
        if (booksArray[i].bookId === bookID) {
          bookDetails = booksArray[i];
          break;
        }
      }
    }
    return bookDetails;
  });
}

// export default fetchChapterLevelPdf;
