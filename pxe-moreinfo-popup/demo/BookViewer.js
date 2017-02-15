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
    axios.get('https://content.openclass.com/eps/pearson-reader/api/item/0c0c9911-1724-41d7-8d05-f1be29193d3c/1/file/qatesting_changing_planet_v2_sjg/changing_planet/OPS/s9ml/chapter02/why_are_age_structures_and_dependency_ratios_important.xhtml')
      .then((response) => {
        this.setState({bookHTML : response.data});     
      });
  }

  componentDidMount() {
    const base = document.createElement('base');
    base.href = 'https://content.openclass.com/eps/pearson-reader/api/item/0c0c9911-1724-41d7-8d05-f1be29193d3c/1/file/qatesting_changing_planet_v2_sjg/changing_planet/OPS/s9ml/chapter02/why_are_age_structures_and_dependency_ratios_important.xhtml';
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
