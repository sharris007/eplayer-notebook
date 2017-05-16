class HighlightText {
  static highlightText = (getProps, htmlText) => {
    if (getProps.props.src.highlightText) {
      htmlText = htmlText.replace(new RegExp( getProps.props.src.highlightText + '(?![^<>]*>)', 'gi'), function(e) {
        return '<span class=\'react-highlighted-text\'>' + e + '</span>';
      });
      return htmlText;
    }
  }
  static highlightSearchText = (getProps, htmlText) => {
    if (getProps.props.src.highlightText) {
      htmlText = htmlText.replace(new RegExp( getProps.props.src.searchText + '(?![^<>]*>)', 'gi'), function(e) {
        return '<span class=\'pxereaderSearchHighlight\'>' + e + '</span>';
      });
      return htmlText;
    }
  }
};

export default HighlightText;	
