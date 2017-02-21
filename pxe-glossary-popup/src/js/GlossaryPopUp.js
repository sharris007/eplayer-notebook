import {  Component, PropTypes } from 'react';
import renderHTML from 'react-render-html';
import Popup from 'react-popup';
import { GlossaryPopUpClasses } from '../../const/GlossaryPopUpClasses';
import '../scss/glossaryPopUp.scss';


class GlossaryPopUp extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      glossaryResponse : ''
    };    
  }

  componentDidMount() {
    this.fetchGlossaryData();
  }

  fetchGlossaryData = () => {
    const request = new Request(this.props.glossaryurl, {
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });

    fetch(request, {
      method: 'get'
    }).then((response) => {
      return response.text();
    }).then((text) => {
      console.clear();
      this.setState({ glossaryResponse : text});
      const bookDiv = document.getElementById(this.props.bookDiv);

      GlossaryPopUpClasses.forEach((val) => {
        bookDiv.querySelectorAll(val).forEach((item) => {
          const obj = {'className' :  val};
          item.addEventListener('click', this.framePopOver.bind(this, obj))
        });
      }); 
    }).catch((err) => {
      console.debug(err);
    });
  }

  framePopOver = (args, event) => {
    event.preventDefault();
    const bookDivHeight = document.getElementById(this.props.bookDiv).clientHeight + 'px';
    document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
    let popOverTitle = '';
    let popOverDescription = '';
    const targetElement = event.target;

    switch (args.className) {
    case 'a.keyword' : {
      const glossaryNode =  document.getElementById(targetElement.hash.replace('#', '')); 
      popOverTitle = glossaryNode.getElementsByTagName('dfn')[0].textContent;
      popOverDescription = renderHTML(glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML);
      break;
    }
    case 'dfn.keyword' : {
      const glossaryNode =  document.getElementById(targetElement.parentElement.hash.replace('#', '')); 
      popOverTitle = glossaryNode.getElementsByTagName('dfn')[0].textContent;
      popOverDescription = renderHTML(glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML);
      break;
    }
    }

    Popup.registerPlugin('popover', function() {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        noOverlay: true,
        position: function (box) {
          box.style.top = event.pageY  + 'px';
          box.style.left = event.clientX + 'px';
          box.style.margin = 0;
          box.style.opacity = 1;
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
