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
    if (props.node) {
      if (props && props.popUpCollection && props.popUpCollection.length > 0) {
        this.props = props;
        this.props.popUpCollection.forEach((popUpProps, i) => {
          if (!popUpProps.item.getAttribute('rendered')) {
            popUpProps.item.setAttribute('rendered', true);
            this.popUpArray[i] = popUpProps.popOverCollection;
            popUpProps.item.addEventListener('click', this.framePopOver.bind(this, i));
          }     
        });
      }
    }
  }

  framePopOver = (index, event) => {
    event.preventDefault();
    if (event.target.classList.value && event.target.getAttribute('class').indexOf('annotator-hl') > -1 || event.target.classList.contains('annotator-handle')) {
      return false;
    }
    const props = this.props.popUpCollection[index];
    const node = this.props.node.contentDocument.body;
    const iframePosition = document.getElementById(this.props.node.id).offsetTop;
    /*console.log("iframePosition ", iframePosition);
    console.log("document.getElementById( 'contentIframe' ) ", document.getElementById( 'contentIframe' ).offsetTop)*/
    if (props.popOverCollection) {
      const bookDivHeight = node.clientHeight + 'px';
      document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
      Popup.registerPlugin('popover', function(element) {
        this.create({
          title: props.popOverCollection.popOverTitle ? renderHTML(props.popOverCollection.popOverTitle) : '',
          content: renderHTML(props.popOverCollection.popOverDescription),
          noOverlay: true,
          position: function(box) {
            //const elementIdRect = element.getBoundingClientRect();
            const pseudoClassProperties = window.getComputedStyle(event.currentTarget, ':after');
            let elementOffsetWidth = element.offsetWidth/2;
            const isWordBroken = element.offsetHeight > 25 ? true : false;
            if (isWordBroken) {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign');
              box.style.top = (element.getBoundingClientRect().top + iframePosition + element.offsetHeight + 15) + 'px';
              box.style.left = (element.getBoundingClientRect().left) + 'px';
            } 
            else {
              if (pseudoClassProperties && pseudoClassProperties.getPropertyValue('content')) {
                elementOffsetWidth = element.offsetWidth-5;
              }
              //if (window.innerHeight - element.getBoundingClientRect().top < 135) {
              if (element.getBoundingClientRect().top - window.scrollY > 500) {
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpTopAlign');
                box.style.top = (element.getBoundingClientRect().top + iframePosition - document.getElementsByClassName('mm-popup__box')[0].clientHeight - 15) + 'px';
                box.style.left = (element.getBoundingClientRect().left-185+(elementOffsetWidth)) + 'px';
              } else if (node.children[0].clientWidth - element.getBoundingClientRect().right < 350) {
                box.style.top = (element.getBoundingClientRect().top + iframePosition + element.offsetHeight + 15) + 'px';
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpRightAlign');
                box.style.left = (element.getBoundingClientRect().left - 350 +  elementOffsetWidth) + 'px';
              } 
              else {
                box.style.top = (element.getBoundingClientRect().top + iframePosition + element.offsetHeight + 15) + 'px';
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign'); 
                box.style.left = (element.getBoundingClientRect().left - 50 +  elementOffsetWidth) + 'px';
              }
            }
            if (!props.popOverCollection.popOverTitle) {
              // To align moreInfo popup
              document.getElementsByClassName('mm-popup__box__body')[0].classList.add('reAlignPopUp');
            }
            box.style.margin = 0;
            box.style.opacity = 1;
          }
        });
      });
      Popup.plugins.popover(event.currentTarget);
      if (props.popOverCollection.popOverDescription) {
        this.checkValidURL(props.popOverCollection.popOverDescription);
      }
    }
  }

  checkValidURL = (str) => {
    //console.log(str)
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
    return ( <div>< Popup / ></div> );
  }

}

export default PopUpInfo;
