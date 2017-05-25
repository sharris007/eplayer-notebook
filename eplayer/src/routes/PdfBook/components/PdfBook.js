import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {PdfBookReader} from './PdfBookReader.js';
import { IntlProvider, addLocaleData } from 'react-intl';   
import {languages} from '../../../../locale_config/translations/index';   
import languageName from '../../../../locale_config/configureLanguage';
var identityId,ubd,ubsd,ssoKey,serverDetails,uid,langID;

export class PdfBook extends Component {

async componentWillMount() {
    if(this.props.login.data === undefined || this.props.bookshelf.ssoKey === undefined){
             //alert("if"+sessionStorage.getItem('ubd'));
             identityId = sessionStorage.getItem('identityId');
             //uid = sessionStorage.getItem('uid');
             ubd = sessionStorage.getItem('ubd');
             ubsd = sessionStorage.getItem('ubsd');
             ssoKey = sessionStorage.getItem('ssoKey');
             serverDetails = sessionStorage.getItem('serverDetails');
             if(this.props.bookshelf.uPdf){
              //alert("uPdf");
                  sessionStorage.setItem('authorName',this.props.bookshelf.authorName);
                  sessionStorage.setItem('title',this.props.bookshelf.title);
                  sessionStorage.setItem('thumbnail',this.props.bookshelf.thumbnail);
                  identityId = sessionStorage.getItem('identityId');
                  ubd = this.props.bookshelf.ubd;
                  uid = this.props.bookshelf.uid;
                  ubsd = this.props.bookshelf.ubsd;
                  ssoKey = this.props.bookshelf.ssoKey;
                  serverDetails = this.props.bookshelf.serverDetails;
             }
        }else{ 
            //alert("else");
            sessionStorage.setItem('uPdf',this.props.bookshelf.uPdf);
            sessionStorage.setItem('authorName',this.props.bookshelf.authorName);
            sessionStorage.setItem('title',this.props.bookshelf.title);
            sessionStorage.setItem('thumbnail',this.props.bookshelf.thumbnail);
            sessionStorage.setItem('ubd',this.props.bookshelf.ubd);
            sessionStorage.setItem('ubd',this.props.bookshelf.uid);
            sessionStorage.setItem('ubsd',this.props.bookshelf.ubsd);
            sessionStorage.setItem('ssoKey',this.props.bookshelf.ssoKey);
            sessionStorage.setItem('serverDetails',this.props.bookshelf.serverDetails);
            identityId = this.props.login.data.identityId;
            ubd = this.props.bookshelf.ubd;
            uid = this.props.bookshelf.uid;
            ubsd = this.props.bookshelf.ubsd;
            ssoKey = this.props.bookshelf.ssoKey;
            serverDetails = this.props.bookshelf.serverDetails;
        }
       await this.props.fetchUserInfo(identityId, this.props.params.bookId, ubd, ubd, ubsd, ssoKey, serverDetails);
       await this.props.fetchBookInfo(this.props.params.bookId,ssoKey,this.props.book.userInfo.userid,serverDetails);
}
  render()
  {
    if(this.props.book.bookinfo.fetched)
    {
      langID=this.props.book.bookinfo.book.languageid;
      let locale=languageName(langID);
      let localisedData=locale.split('-')[0];
      addLocaleData((require(`react-intl/locale-data/${localisedData}`)));
      const {messages}=languages.translations[locale];
      const PdfbookMessages={
      PageMsg:messages.page,
    }
      return(
        <PdfBookReader locale={locale}
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
              fetchHighlightUsingReaderApi = {this.props.fetchHighlightUsingReaderApi}
              saveHighlightUsingReaderApi = {this.props.saveHighlightUsingReaderApi}
              removeHighlightUsingReaderApi= {this.props.removeHighlightUsingReaderApi}
              PdfbookMessages={PdfbookMessages}
              loadAssertUrl = {this.props.loadAssertUrl}
                        />);
    }
    else
    {
      return(
      <div className="centerCircularBar">
      <CircularProgress style={{ margin: '40px auto', display: 'block' }} />
      </div>);
    }

  }

}
export default PdfBook;

