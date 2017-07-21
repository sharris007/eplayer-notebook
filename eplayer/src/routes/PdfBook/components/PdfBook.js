/* global sessionStorage */
import React, { Component } from 'react';/* Importing the react and component from react library. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import { addLocaleData } from 'react-intl';
import { PdfBookReader } from './PdfBookReader';
import { languages } from '../../../../locale_config/translations/index';
import languageName from '../../../../locale_config/configureLanguage';
/* Defining the variables for sessionStorage. */
let identityId;
let ubd;
let ubsd;
let ssoKey;
let serverDetails;
let langID;
let roleTypeID;

/* Creating PdfBook component. */
export class PdfBook extends Component {

/* Async keyword used for independent calling the method, componentWillMount is lifecycle method,
used for before mounting occurs. */
  async componentWillMount() {
    if (this.props.login.data === undefined || this.props.bookshelf.ssoKey === undefined) {
             /* sessionStorage is used to store the token, that will be remain in session untill we close the browser or any event action occured.
             React store will keep the token untill we refresh the pages.
             Multiple methods has been used, getItem to retrive the token,
             setItem to set the  token, removeItme to delete the token. */
      identityId = sessionStorage.getItem('identityId');
             // uid = sessionStorage.getItem('uid');
      ubd = sessionStorage.getItem('ubd');
      ubsd = sessionStorage.getItem('ubsd');
      ssoKey = sessionStorage.getItem('ssoKey');
      serverDetails = sessionStorage.getItem('serverDetails');
      if (this.props.bookshelf.uPdf) {
        sessionStorage.setItem('authorName', this.props.bookshelf.authorName);
        sessionStorage.setItem('title', this.props.bookshelf.title);
        sessionStorage.setItem('thumbnail', this.props.bookshelf.thumbnail);
        identityId = sessionStorage.getItem('identityId');
        ubd = this.props.bookshelf.ubd;
        ubsd = this.props.bookshelf.ubsd;
        ssoKey = this.props.bookshelf.ssoKey;
        serverDetails = this.props.bookshelf.serverDetails;
        roleTypeID = this.props.bookshelf.roleTypeID;
      }
    } else {
      sessionStorage.setItem('uPdf', this.props.bookshelf.uPdf);
      sessionStorage.setItem('authorName', this.props.bookshelf.authorName);
      sessionStorage.setItem('title', this.props.bookshelf.title);
      sessionStorage.setItem('thumbnail', this.props.bookshelf.thumbnail);
      sessionStorage.setItem('ubd', this.props.bookshelf.ubd);
      sessionStorage.setItem('ubsd', this.props.bookshelf.ubsd);
      sessionStorage.setItem('ssoKey', this.props.bookshelf.ssoKey);
      sessionStorage.setItem('serverDetails', this.props.bookshelf.serverDetails);
      identityId = this.props.login.data.identityId;
      ubd = this.props.bookshelf.ubd;
      ubsd = this.props.bookshelf.ubsd;
      ssoKey = this.props.bookshelf.ssoKey;
      serverDetails = this.props.bookshelf.serverDetails;
      roleTypeID = this.props.bookshelf.roleTypeID;
    }

       /* Await operator is used to wait for a Promise returned by an async function. */
       /* Method used for fetching the user details and book details. */
    await this.props.fetchUserInfo(identityId, this.props.params.bookId, ubd, ubd, ubsd, ssoKey, serverDetails);
    await this.props.fetchBookInfo(this.props.params.bookId, ssoKey,
              this.props.book.userInfo.userid, serverDetails, roleTypeID);
  }

 /* Multiple methods we have paased in PdfBookReader inside return, fetchTocViewer fot fetching the value of TOC,
   fetchBookmarksUsingReaderApi for fetching the bookmark details, addBookmarkUsingReaderApi is used for adding the bookmark details,
   and so on as methods names are very specific. */
  render() {
    if (this.props.book.bookinfo.fetched) {
      langID = this.props.book.bookinfo.book.languageid;
      const locale = languageName(langID);
      const localisedData = locale.split('-')[0];
      addLocaleData((require(`react-intl/locale-data/${localisedData}`))); // eslint-disable-line global-require,import/no-dynamic-require
      const { messages } = languages.translations[locale];
      const PdfbookMessages = {
        PageMsg: messages.page
      };
      return (
        <PdfBookReader
          locale={locale}
          fetchTocAndViewer={this.props.fetchTocAndViewer}
          fetchBookmarksUsingReaderApi={this.props.fetchBookmarksUsingReaderApi}
          addBookmarkUsingReaderApi={this.props.addBookmarkUsingReaderApi}
          removeBookmarkUsingReaderApi={this.props.removeBookmarkUsingReaderApi}
          fetchBookInfo={this.props.fetchBookInfo}
          fetchPageInfo={this.props.fetchPageInfo}
          goToPage={this.props.goToPage}
          book={this.props.book}
          bookshelf={this.props.bookshelf}
          login={this.props.login}
          params={this.props.params}
          fetchHighlightUsingReaderApi={this.props.fetchHighlightUsingReaderApi}
          saveHighlightUsingReaderApi={this.props.saveHighlightUsingReaderApi}
          removeHighlightUsingReaderApi={this.props.removeHighlightUsingReaderApi}
          PdfbookMessages={PdfbookMessages}
          loadAssertUrl={this.props.loadAssertUrl}
          editHighlightUsingReaderApi={this.props.editHighlightUsingReaderApi}
          fetchRegionsInfo={this.props.fetchRegionsInfo}
          fetchPagebyPageNumber={this.props.fetchPagebyPageNumber}
          fetchUserIcons={this.props.fetchUserIcons}
        />);
    }

    return (
      <div className="centerCircularBar">
        <CircularProgress style={{ margin: '40px auto', display: 'block' }} />
      </div>);
  }

}
PdfBook.propTypes = {
  fetchTocAndViewer: React.PropTypes.func,
  fetchBookmarksUsingReaderApi: React.PropTypes.func,
  addBookmarkUsingReaderApi: React.PropTypes.func,
  removeBookmarkUsingReaderApi: React.PropTypes.func,
  fetchBookInfo: React.PropTypes.func,
  fetchPageInfo: React.PropTypes.func,
  goToPage: React.PropTypes.func,
  book: React.PropTypes.object,
  bookshelf: React.PropTypes.object,
  login: React.PropTypes.object,
  params: React.PropTypes.object,
  fetchHighlightUsingReaderApi: React.PropTypes.func,
  saveHighlightUsingReaderApi: React.PropTypes.func,
  removeHighlightUsingReaderApi: React.PropTypes.func,
  loadAssertUrl: React.PropTypes.func,
  editHighlightUsingReaderApi: React.PropTypes.func
};
export default PdfBook;

