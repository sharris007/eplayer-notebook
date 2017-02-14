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
    const glossaryNode =  document.getElementById(event.target.hash.replace('#', '')); 
    const popOverTitle = glossaryNode.getElementsByTagName('dfn')[0].textContent;
    const popOverDescription = glossaryNode.nextElementSibling.getElementsByTagName('p')[0].textContent;
    Popup.registerPlugin('popover', function (target) {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        className: 'popover',
        noOverlay: true,
        position: function (box) {
          /*const bodyRect      = document.body.getBoundingClientRect();
          const btnRect       = target.getBoundingClientRect();
          const btnOffsetTop  = btnRect.top - bodyRect.top;
          const btnOffsetLeft = btnRect.left - bodyRect.left;
          const scroll        = document.documentElement.scrollTop || document.body.scrollTop;*/
          box.style.top = (event.clientY + 10) + 'px';
          box.style.left = event.clientX + 'px';
          /*box.style.top  = (btnOffsetTop - box.offsetHeight - 10) - scroll + 'px';
          box.style.left = (btnOffsetLeft + (target.offsetWidth / 2) - (box.offsetWidth / 2)) + 'px';*/
          box.style.margin = 0;
          box.style.opacity = 1;
          console.debug('document.body.getBoundingClientRect()',  document.body.getBoundingClientRect());
          console.debug('target.getBoundingClientRect()',  target.getBoundingClientRect())
            //console.log("box.style.top :- ", box.style.top, "box.style.left :- ", box.style.left)
        }
      });
    }); 
    Popup.plugins.popover(event.target);
    //console.log('event.target :- ', event.target,  'popOverTitle :- ', popOverTitle, 'popOverDescription :- ', popOverDescription)
  }
  
  render() {
    return (  <div>
                <Popup />
                <div  id = "divGlossary"
                    style= {{ visibility : 'hidden' }}>
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
