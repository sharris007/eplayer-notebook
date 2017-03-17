import React, { Component, PropTypes } from 'react';
import renderHTML from 'react-render-html';
import Popup from 'react-popup';
import '../scss/PopUp.scss';


class PopUps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      glossaryResponse: ''
    };
    this.framePopOver(props)
  }

  framePopOver = (props) => {
    if (props.popOverCollection) {
      const bookDivHeight = document.getElementById(props.bookDiv).clientHeight + 'px';
      document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
      Popup.registerPlugin('popover', function(element) {
        this.create({
          title: props.popOverCollection.popOverTitle ? renderHTML(props.popOverCollection.popOverTitle) : '',
          content: renderHTML(props.popOverCollection.popOverDescription),
          noOverlay: true,
          position: function(box) {
            if (element.getBoundingClientRect().left < 124) {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpRightAlign');
              box.style.left = (element.getBoundingClientRect().left  + element.clientWidth + 20) + 'px';
              box.style.top = (element.getBoundingClientRect().top + window.scrollY  - 10) + 'px';
            } else if (document.getElementById(props.bookDiv).clientWidth < (element.getBoundingClientRect().left + 124)) {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign');
              box.style.top = (element.getBoundingClientRect().top + window.scrollY + element.offsetHeight - 20) + 'px';
              box.style.left = (element.getBoundingClientRect().left - 248 -15) + 'px';
            } else {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpbottomAlign');
              box.style.top = (element.getBoundingClientRect().top + window.scrollY + element.offsetHeight + 10) + 'px';
              box.style.left = (element.getBoundingClientRect().left - (document.getElementsByClassName('mm-popup__box__body')[0].clientWidth/2) + element.clientWidth/2) + 'px';
            }
            
            box.style.margin = 0;
            box.style.opacity = 1;
          }
        });
      });
      Popup.plugins.popover(props.event.target);
    }
  }

  render() {
    return ( < div >
      < Popup / >
      < /div > );
  }

}

PopUps.PropTypes = {
  glossaryResponse: PropTypes.string.isRequired
}

export default PopUps;
