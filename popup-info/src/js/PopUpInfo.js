import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import Popup from 'react-popup';
import '../scss/PopUp.scss';


class PopUpInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      glossaryResponse: ''
    };
    this.popUpArray = [];
    this.bookId = '';
    if (props && props.popUpCollection && props.popUpCollection.length > 0) {
      this.props = props;
      this.bookId = this.props.bookId
      this.props.popUpCollection.forEach((popUpProps, i) => {
        if (!popUpProps.item.getAttribute('rendered')) {
          popUpProps.item.setAttribute('rendered', true);
          this.popUpArray[i] = popUpProps.popOverCollection;
          popUpProps.item.addEventListener('click', this.framePopOver.bind(this, i));
        }     
      });
    }
  }

  framePopOver = (index, event) => {
    event.preventDefault();
    if (event.target.getAttribute('class').indexOf('annotator-hl') > -1 || event.target.classList.contains('annotator-handle')) {
      return false;
    }
    const props = this.props.popUpCollection[index];
    const bookId = document.getElementById(this.bookId);
    if (props.popOverCollection) {
      const bookDivHeight = bookId.clientHeight + 'px';
      document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
      Popup.registerPlugin('popover', function(element) {
        this.create({
          title: props.popOverCollection.popOverTitle ? renderHTML(props.popOverCollection.popOverTitle) : '',
          content: renderHTML(props.popOverCollection.popOverDescription),
          noOverlay: true,
          position: function(box) {
            box.style.top = (element.getBoundingClientRect().top + window.scrollY + element.offsetHeight + 12) + 'px';
            const bookIdRect = bookId.getBoundingClientRect();
            const elementIdRect = element.getBoundingClientRect();
            const pseudoClassProperties = window.getComputedStyle(event.target, ':after');
            let elementOffsetWidth = element.offsetWidth/2;
            if (pseudoClassProperties && pseudoClassProperties.getPropertyValue('content')) {
              elementOffsetWidth = element.offsetWidth-5;
            }
            if (window.innerHeight - element.getBoundingClientRect().top < 135) {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpTopAlign');
              box.style.top = (element.getBoundingClientRect().top + window.scrollY - element.clientHeight - 15 - document.getElementsByClassName('mm-popup__box')[0].clientHeight) + 'px';
              box.style.left = (element.getBoundingClientRect().left-185+(elementOffsetWidth)) + 'px';
            } else if (elementIdRect.left - bookIdRect.left > 350) {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpRightAlign');
              box.style.left = (element.getBoundingClientRect().left - 350 +  elementOffsetWidth) + 'px';
            } 
            else {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign'); 
              box.style.left = (element.getBoundingClientRect().left - 50 +  elementOffsetWidth) + 'px';
            }
            
            box.style.margin = 0;
            box.style.opacity = 1;
          }
        });
      });
      Popup.plugins.popover(event.target);
      if (props.popOverCollection.popOverDescription) {
        this.checkValidURL(props.popOverCollection.popOverDescription);
      }
    }
  }

  checkValidURL = (str) => {
    console.log(str)
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex .test(str)) {      
      document.getElementsByClassName('mm-popup__box')[0].style.width = '400px';
    } else {
      document.getElementsByClassName('mm-popup__box')[0].style.width = '370px';
    }
  }

  closePopUp = () => {
    Popup.close()
  }

  render() {
    return ( < div >
      < Popup / >
      < /div > );
  }

}

export default PopUpInfo;
