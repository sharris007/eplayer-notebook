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
    if (props.node || props.bookContainerId) {
      if (props && props.popUpCollection && props.popUpCollection.length > 0) {
        this.props = props;
        this.props.popUpCollection.forEach((popUpProps, i) => {
          if (!popUpProps.item.getAttribute('rendered')) {
            popUpProps.item.setAttribute('rendered', true);
            this.popUpArray[i] = popUpProps.popOverCollection;
            if (this.props.bookContainerId !== null && this.props.bookContainerId !== undefined && this.props.bookContainerId !== '')
            {
              popUpProps.item.addEventListener('click', this.frameGlossPopOver.bind(this, i));
            }
            else
            {
              popUpProps.item.addEventListener('click', this.framePopOver.bind(this, i));
              popUpProps.item.addEventListener('keydown', (e) => {
                if (e.keyCode === 32)
                  { this.framePopOver(i, e); }
              });
            }
          }
        });
      }
    }
  }

  linkHandler =(e) => {
    const ele = e.currentTarget;
    const newTabClasses = ['include', 'termref', 'index-locator', 'ulink', 'webresource'];
    for (let i = 0; i < newTabClasses.length; i++) {
      if (ele.classList.contains(newTabClasses[i])) {
        ele.target = '_blank';
        return;
      }
    }
    e.preventDefault();
    const message = {
      sender: 'GlossaryPopUpInfo',
      type: 'ewl',
      time: Date.now(),
      data: {
        title: ele.innerText,
        src: ele.href,
        type: ele.className
      }
    };
    if (this.props.popUpCallBack) {
      this.props.popUpCallBack(message);
    }
  // this.closePopUp();
  }

  frameGlossPopOver = (index, event) => {
    event.preventDefault();
    const props = this.props.popUpCollection[index];
    const bookContainerId = document.getElementById(this.props.bookContainerId);
    const bookDivHeight = `${bookContainerId.clientHeight}px`;
    document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
    Popup.registerPlugin('popover', function (element) {
      this.create({
        title: props.popOverCollection.popOverTitle ? renderHTML(props.popOverCollection.popOverTitle) : '',
        content: renderHTML(props.popOverCollection.popOverDescription),
        noOverlay: true,
        position(box) {
          const element = document.getElementById(props.item.id);
          const popUpElement = document.getElementsByClassName('mm-popup')[0];
          const popUpTop = parseInt(element.style.top, 10) + parseInt(element.style.height, 10);
          document.getElementsByClassName('mm-popup__box')[0].classList.add('glosspopUp');
          box.style.top = `${popUpTop + 10}px`;
          box.style.left = `${parseInt(element.style.left, 10) - 100}px`;
          bookContainerId.appendChild(popUpElement);
          box.style.margin = 0;
          box.style.opacity = 1;
        }
      });
    });
    Popup.plugins.popover(event.currentTarget);
  }

  fnIsChild=(parentElem, childElem) => {
    let element = childElem;
    do {
      if (element.parentNode === parentElem) {
        return true;
      }
      element = element.parentNode;
    } while (element);
    return false;
  }

  framePopOver = (index, event) => {
    event.preventDefault();
    this.closePopUp();
    const currTarget = event.currentTarget;
    currTarget.setAttribute('aria-describedby', `popup-${currTarget.id}`);
    if (event.target.classList.value && event.target.getAttribute('class').indexOf('annotator-hl') > -1 || event.target.classList.contains('annotator-handle')) {
      return false;
    }

    const props = this.props.popUpCollection[index];
    const node = this.props.node.contentDocument.body;
    const iframe = document.getElementById(this.props.node.id);
    const pageFontFamilyStyle = window.getComputedStyle(iframe.contentDocument.body, null).getPropertyValue('font-family');
    let iframeFreeSpace = 0;
    let popUpRightAlign = false;
    const contentWidth = this.props.contentWidth;
    if (contentWidth) {
      iframeFreeSpace = iframe.clientWidth - contentWidth;
      if ((this.props.contentWidth + iframeFreeSpace / 2) - event.target.getBoundingClientRect().left < 350) {
        popUpRightAlign = true;
      }
    }

    let elementOffsetWidth = event.target.offsetWidth;
    const pseudoClassProperties = window.getComputedStyle(event.currentTarget, ':after');
    if (pseudoClassProperties && pseudoClassProperties.getPropertyValue('content')) {
      elementOffsetWidth -= 5;
    }
    /* console.log("iframePosition ", iframePosition);
    console.log("document.getElementById( 'contentIframe' ) ", document.getElementById( 'contentIframe' ).offsetTop)*/
    if (props.popOverCollection) {
      const bookDivHeight = `${node.clientHeight}px`;
      document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
      const content = renderHTML(props.popOverCollection.popOverDescription);
      Popup.registerPlugin('popover', function (element) {
        this.create({
          title: props.popOverCollection.popOverTitle ? renderHTML(props.popOverCollection.popOverTitle) : '',
          content, // : renderHTML(props.popOverCollection.popOverDescription),
          noOverlay: true,
          position(box) {
            console.log(document.getElementsByClassName('mm-popup__box'));
            // const elementIdRect = element.getBoundingClientRect();

            document.getElementsByClassName('mm-popup__box')[0].setAttribute('id', `popup-${currTarget.id}`);
            const isWordBroken = element.offsetHeight > 25;
            if (isWordBroken) {
              document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign');
              box.style.top = `${element.getBoundingClientRect().top + iframe.offsetTop + element.offsetHeight + 15}px`;
              box.style.left = `${element.getBoundingClientRect().left}px`;
            }
            else {

              // if (window.innerHeight - element.getBoundingClientRect().top < 135) {
              if (element.getBoundingClientRect().top - window.scrollY > 500) {
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpTopAlign');
                box.style.top = `${element.getBoundingClientRect().top + iframe.offsetTop - document.getElementsByClassName('mm-popup__box')[0].clientHeight - 15}px`;
                box.style.left = `${element.getBoundingClientRect().left - 185 + (element.offsetWidth / 2)}px`;
              } else if (popUpRightAlign) {
                box.style.top = `${element.getBoundingClientRect().top + iframe.offsetTop + element.offsetHeight + 15}px`;
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpRightAlign');
                box.style.left = `${element.getBoundingClientRect().left + document.getElementById(iframe.id).offsetLeft + elementOffsetWidth - 350}px`;
              }
              else {
                box.style.top = `${element.getBoundingClientRect().top + iframe.offsetTop + element.offsetHeight + 15}px`;
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign');
                box.style.left = `${element.getBoundingClientRect().left + elementOffsetWidth + document.getElementById(iframe.id).offsetLeft - 50}px`;
              }
            }
            if (!props.popOverCollection.popOverTitle) {
              // To align moreInfo popup
              document.getElementsByClassName('mm-popup__box__body')[0].classList.add('reAlignPopUp');
            }
            document.getElementsByClassName('mm-popup__box')[0].style.fontFamily = pageFontFamilyStyle;
            box.style.margin = 0;
            box.style.opacity = 1;
          }
        });
      });
      Popup.plugins.popover(event.currentTarget);
      if (props.popOverCollection.popOverDescription) {
        this.checkValidURL(props.popOverCollection.popOverDescription);
      }
      document.getElementsByClassName('mm-popup__box')[0].setAttribute('tabindex', 0);
      document.getElementsByClassName('mm-popup__box')[0].focus();
      document.getElementsByClassName('mm-popup__box')[0].style.outline = 'none';
      document.getElementsByClassName('mm-popup__box')[0].addEventListener('blur', (e) => {
        // console.log(e.relatedTarget);
        if (e.relatedTarget && !this.fnIsChild(document.getElementsByClassName('mm-popup__box')[0], e.relatedTarget)) {
          this.closePopUp();
          currTarget.focus();
        }
      });
      document.getElementsByClassName('mm-popup__box')[0].addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          // for esc close popup
          this.closePopUp();
          currTarget.focus();
        }
      });
      // links inside popup
      const popupBox = document.getElementsByClassName('mm-popup__box')[0];
      const links = popupBox.getElementsByTagName('a');
      if (links.length) {
        for (let index = 0; index < links.length; index++) {
          const element = links[index];
          element.addEventListener('click', this.linkHandler);
          if (index === links.length - 1) {
            element.addEventListener('keydown', (e) => {
              if (e.keyCode === 9 && !e.shiftKey) {
                this.closePopUp();
                currTarget.focus();
              }
            });
          }
        }
      }
    }
  }

  checkValidURL = (str) => {
    // console.log(str)
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    console.log(document.getElementsByClassName('mm-popup__box'));
    if (!regex.test(str)) {
      document.getElementsByClassName('mm-popup__box')[0].style.width = '400px';
    } else {
      document.getElementsByClassName('mm-popup__box')[0].style.width = '370px';
    }
  }

  closePopUp = () => {
    Popup.close();
  }

  render() {
    return (<div tabIndex="0" id="glossary-popup">< Popup closeBtn={false} / ></div>);
  }

}

export default PopUpInfo;
