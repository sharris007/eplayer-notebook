import {  Component, PropTypes } from 'react';
import axios from 'axios';
import renderHTML from 'react-render-html';
import Popup from 'react-popup';
import '../scss/glossaryPopUp.scss';


class GlossaryPopUp extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      glossaryResponse : ''
    }; 
    setTimeout(() => {
      this.fetchGlossaryData();
    }, 2000) 
    
  }

  fetchGlossaryData = () => {
    axios.get(this.props.glossaryurl)
      .then((response) => {
        console.clear();
        this.setState({ glossaryResponse : response.data});
        document.getElementById(this.props.bookDiv).querySelectorAll('a.keyword').forEach((item) => {
          item.addEventListener('click', this.framePopOver)
        });
      })
  }

  framePopOver = (event) => {
    event.preventDefault();
    console.clear();

    const bookDivHeight = document.getElementById(this.props.bookDiv).clientHeight + 'px';
    document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;

    const glossaryNode =  document.getElementById(event.target.hash.replace('#', '')); 
    const popOverTitle = glossaryNode.getElementsByTagName('dfn')[0].textContent;
    const popOverDescription = glossaryNode.nextElementSibling.getElementsByTagName('p')[0].textContent;

    Popup.registerPlugin('popover', function (target) {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        noOverlay: true,
        position: function (box) {
          box.style.top = event.pageY + 'px';
          box.style.left = event.clientX + 'px';
          box.style.margin = 0;
          box.style.opacity = 1;

          console.debug('target.getBoundingClientRect()',  target.getBoundingClientRect())
          console.debug('event.pageX :- ', event.pageX, 'event.pageY :- ', event.pageY )
          console.debug('e.pageX - rect.left :- ', event.pageX - target.getBoundingClientRect().left )
        }
      });
    }); 
    Popup.plugins.popover(event.target);
  }
  
  render() {
    return (  <div>
                <Popup />
                <div  id = "divGlossary"
                    style= {{ display : 'none' }}>
                  {renderHTML(this.state.glossaryResponse)}
                </div>
              </div>);
  }
  
}

GlossaryPopUp.PropTypes = {
  glossaryurl: PropTypes.string.isRequired,
  glossaryResponse: PropTypes.string.isRequired
}

export default GlossaryPopUp;
