import React, {PropTypes} from 'react';
import {intlShape, injectIntl} from 'react-intl';
import {messages} from './defaultMessages';

class ComponentOwner extends React.Component {
  constructor(props) {
    super(props);
  }
  
  renderEmpty() {
    const {formatMessage} = this.props.intl;
    
    return (
      <div className="empty-help" >
          <div className="empty-message" tabindex="0">
            <p>{formatMessage(messages.emptyMessage)}</p>                
          </div>
      </div>         
    ) 
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
              translations={that.props.intl} />        
      );
    });   
  }  
  
  render() {    
    return (
      <div id="bookshelf" role="main">
          <div className="bookshelf-body">             
              {(this.props.books.length === 0) ? this.renderEmpty() : this.renderBooks()}
          </div>
          <div id="books-assert-container" role="alert" aria-live="assertive" class="reader-only"></div>
      </div>           
    )    
  }
}

ComponentOwner.propTypes = {
  intl: intlShape.isRequired,
  locale: PropTypes.string,
  books: PropTypes.array         
};

class Book extends React.Component {  
    constructor(props) {
      super(props);
      
      this.handleBookClick = this.handleBookClick.bind(this);      
      this.handleInfoClick = this.handleInfoClick.bind(this);      
    }  
    
    handleBookClick() {
      location.href='book.html';
    }   
    
    handleInfoClick() {
      alert('book info clicked');
    }

    renderImage(bookCoverExists) {
      if (bookCoverExists) {
        return(
          <img className="image" src={this.props.image} />             
        )  
      }    
      else {
        return (<span className="image"></span>)  
      }
    }
    
    render() { 
      const bookCoverExists = (this.props.image !== '');      
   
      return (
        <div className={`book ${bookCoverExists ? '' : 'no-book-cover'}`}>
            <a href="javascript:void(0);"
               className="container" 
               onClick={this.handleBookClick}
               ui-keypress="{'enter': 'bookCtrl.goToBook(book)'}" 
               tabindex="0">               
                {this.renderImage(bookCoverExists)}
                <p className="title">{this.props.title}</p>               
            </a>
            <a className="info"
               href="javascript:void(0);"
               onClick={this.handleInfoClick}                 
               tabindex="0">               
                <i className="pe-icon--info-circle"></i>               
            </a>
        </div>
      )
    }
  }

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
