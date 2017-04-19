import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {PdfBookReader} from './PdfBookReader.js';
var identityId,ubd,ubsd,ssoKey,serverDetails,uid;
export class PdfBook extends Component {

async componentWillMount() {
    if(this.props.login.data === undefined || this.props.bookshelf.ssoKey === undefined){
           identityId = sessionStorage.getItem('identityId');
           uid = sessionStorage.getItem('uid');
           ubd = sessionStorage.getItem('ubd');
           ubsd = sessionStorage.getItem('ubsd');
           ssoKey = sessionStorage.getItem('ssoKey');
           serverDetails = sessionStorage.getItem('serverDetails');
        }else{ 
            sessionStorage.setItem('uPdf',this.props.bookshelf.uPdf);
            sessionStorage.setItem('authorName',this.props.bookshelf.authorName);
            sessionStorage.setItem('title',this.props.bookshelf.title);
            sessionStorage.setItem('thumbnail',this.props.bookshelf.thumbnail);
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
    	return(<PdfBookReader 
                        fetchTocAndViewer={this.props.fetchTocAndViewer}
    					fetchBookmarks={this.props.fetchBookmarks}
    					addBookmark={this.props.addBookmark}
    					removeBookmark={this.props.removeBookmark}
    					fetchBookInfo={this.props.fetchBookInfo}
                        fetchPageInfo={this.props.fetchPageInfo}
                        saveHighlight={this.props.saveHighlight}
                        fetchHighlight={this.props.fetchHighlight}
                        removeHighlight={this.props.removeHighlight}
    					goToPage={this.props.goToPage}
    					book={this.props.book}
    					bookshelf={this.props.bookshelf}
                        login={this.props.login}
    					params={this.props.params}
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

