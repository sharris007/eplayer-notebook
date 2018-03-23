import axios from 'axios';

export function fetchChapterLevelPdf(bookId, startPage, endPage, globalbookid, bookServerURL) {
  const serviceurl = `${bookServerURL}/ebook/pdfplayer/getchapterpdf?bookid=${bookId}` +
  `&startpageno=${startPage}&endpageno=${endPage}`;
  return axios.get(`${serviceurl}`, { timeout: 20000 }).then((response) => {
    if (response.status >= 400) {
      // Nothing doing
      return;
    } else if (response.data.length) {
      return ({
        startpageno: startPage,
        endpageno: endPage,
        chapterpdf: `${bookServerURL}/ebookassets`
                  + `/ebook${globalbookid}/chapterpdf/${response.data[0].chapterPdfList[0].chapterPdfFileName}`
      });
    }
  });
}

export default fetchChapterLevelPdf;
