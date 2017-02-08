import React from 'react';
import TreeView from './TreeView';

class TableOfContents extends React.Component {
  constructor(props) {
    super(props);   
  }

  render() {
    const style = {
      backgroundImage: 'url(' + this.props.data.content.thumbnail + ')'
    };
    const title = this.props.data.content.mainTitle;
    const author = this.props.data.content.author;
    const maxCharTitle = this.props.data.maxTitleChars|| 55;
    const maxCharAuthor = this.props.data.maxAuthorChars || 60;
    
    return(
      <div id="toc">
        <div className="toc-wrapper">
          <div className="toc-header" style={style}>
            <div className="header-text">
              <h2 className="header-title">{title.length > maxCharTitle ? title.substring(0, this.props.data.maxTitleChars)+'...' : title}</h2>
              <p className="header-author">{author.length > maxCharAuthor ? author.substring(0, this.props.data.maxAuthorChars)+'...' : author}</p>
            </div>
          </div>
        </div>        
          <TreeView 
            separateToggleIcon={this.props.separateToggleIcon} 
            data={this.props.data} 
            depth={this.props.depth} 
            childField={this.props.childField}
            tocClick={this.props.clickTocHandler}
          />       
      </div>
    )
  }
};

export default TableOfContents;
