import React, { Component } from 'react';
import Book from './Book';
import floor from 'lodash/floor'
import Dimensions from 'react-dimensions'

class Bookshelf extends Component {  
  constructor (props) {
    super(props); 
    this.state = {
      reqMargin: 0
    } 
  }
  componentDidMount() {
    const componentWidth = this.props.containerWidth;
    const bookWidth = 220;
    const booksPerRow = floor(componentWidth / bookWidth);
    const margin = ((componentWidth - (bookWidth * booksPerRow) - 13) / booksPerRow) / 2;
    this.setState({
      reqMargin: margin
    })
  }

  renderBooks() {
    const that = this;
    
    return this.props.books.map(function(book, i) {          
      return (
        <Book key={i}
          id={book.id}
          author={book.author}
          image={book.image}
          title={book.title}
          description={book.description}
          onBookClick={that.props.onBookClick}
          reqMargin ={that.state.reqMargin}
        />
      )
    });
  };  
  
  renderEmpty() {    
    return (
      <div className="empty-help" >
        <div className="empty-message" tabIndex="0" />
      </div>         
    ) 
  }

  render() {    
    return (
      <div id="bookshelf" role="main">
          <div className="bookshelf-body">             
              {(this.props.books.length === 0) ? this.renderEmpty() : this.renderBooks()}
          </div>
          <div id="books-assert-container" role="alert" aria-live="assertive" className="reader-only"></div>
      </div>          
    )    
  }
}

export default Dimensions()(Bookshelf);