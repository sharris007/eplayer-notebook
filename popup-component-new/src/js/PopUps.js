import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import Popup from 'react-popup';
import '../scss/PopUp.scss';


class PopUps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      glossaryResponse: ''
    };
    if (Object.keys(props).length > 0) {
      this.props = props;
      this.props.item.addEventListener('click', this.framePopOver.bind(this));
    }
  }

  framePopOver = (event) => {
    event.preventDefault();
    const props = this.props;
    if (this.props.popOverCollection) {
      const bookDivHeight = document.getElementById(this.props.bookDiv).clientHeight + 'px';
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
      Popup.plugins.popover(event.target);
    }
  }

  render() {
    return ( < div >
      < Popup / >
      < /div > );
  }

}

export default PopUps;
