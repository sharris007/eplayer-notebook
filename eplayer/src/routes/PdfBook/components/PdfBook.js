import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {PdfBookReader} from './PdfBookReader.js';
export class PdfBook extends Component {

componentWillMount() {
    this.props.fetchBookInfo(this.props.params.bookId,this.props.bookshelf.ssoKey);
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
    					goToPage={this.props.goToPage}
    					book={this.props.book}
    					bookshelf={this.props.bookshelf}
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

