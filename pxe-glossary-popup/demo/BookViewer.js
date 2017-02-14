import  {  Component, PropTypes } from 'react';
import renderHTML from 'react-render-html';
import axios from 'axios';

class BookViewer extends Component {
  constructor(props) {
    super(props);   
    this.state = {
      bookHTML : ''
    };
    this.init();
  }

  init = () => {
    axios.get('https://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/OPS/s9ml/chapter02/filep7000496728000000000000000000cae.xhtml')
      .then((response) => {
        this.setState({bookHTML : response.data});
        this.props.renderGlossary();      
      });
  }
  componentDidMount() {
    const base = document.createElement('base');
    base.href = 'https://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/OPS/s9ml/chapter02/filep7000496728000000000000000000cae.xhtml';
    document.getElementsByTagName('head')[0].appendChild(base);
  }
  render() {
    return (<div>{renderHTML(this.state.bookHTML)}</div>);
  }
  
}

BookViewer.PropTypes = {
  bookHTML: PropTypes.string.isRequired
}

export default BookViewer;
