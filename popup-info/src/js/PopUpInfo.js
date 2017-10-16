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
    this.bookContainerId = '';
    if (props.node || props.isET1 == 'Y') {
      if (props && props.popUpCollection && props.popUpCollection.length > 0) {
        this.props = props;
        if(props.isET1 == 'Y')
        {
          this.bookContainerId = this.props.bookContainerId;
        }
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
    let bookContainerId,bookDivHeight,node,iframe,pageFontFamilyStyle,iframeFreeSpace,popUpRightAlign,contentWidth,elementOffsetWidth,pseudoClassProperties;
    if(props.isET1 == 'Y' || props.isET1 == 'y')
    {
      bookContainerId = document.getElementById(this.bookContainerId);
    }
    else
    {
      node = this.props.node.contentDocument.body;
      iframe = document.getElementById(this.props.node.id);
      pageFontFamilyStyle=window.getComputedStyle(iframe.contentDocument.body, null ).getPropertyValue( 'font-family' );
      iframeFreeSpace = 0;
      popUpRightAlign = false;
      contentWidth = this.props.contentWidth;
      if (contentWidth) {
        iframeFreeSpace = iframe.clientWidth - contentWidth;
        if ((this.props.contentWidth + iframeFreeSpace/2) - event.target.getBoundingClientRect().left < 350) {
          popUpRightAlign = true;
        }
      }

      elementOffsetWidth = event.target.offsetWidth;
      pseudoClassProperties = window.getComputedStyle(event.currentTarget, ':after');
      if (pseudoClassProperties && pseudoClassProperties.getPropertyValue('content')) {
        elementOffsetWidth = elementOffsetWidth-5;
      }
      /*console.log("iframePosition ", iframePosition);
      console.log("document.getElementById( 'contentIframe' ) ", document.getElementById( 'contentIframe' ).offsetTop)*/
    }
    if (props.popOverCollection) {
      if(props.isET1 == 'Y' || props.isET1 == 'y')
      {
        bookDivHeight = bookContainerId.clientHeight + 'px';
      }
      else
      {
        bookDivHeight = node.clientHeight + 'px';
      }
      document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
      Popup.registerPlugin('popover', function(element) {
        this.create({
          title: props.popOverCollection.popOverTitle ? renderHTML(props.popOverCollection.popOverTitle) : '',
          content: renderHTML(props.popOverCollection.popOverDescription),
          noOverlay: true,
          position: function(box) {
            if(props.isET1 == 'Y' || props.isET1 == 'y')
            {
                var popUpElement=document.getElementsByClassName('mm-popup')[0];
                const bookIdRect = bookContainerId.getBoundingClientRect();
                const elementIdRect = element.getBoundingClientRect();
                let elementOffsetWidth = element.offsetWidth/2;
                const elementOffsetTop = elementIdRect.top - bookIdRect.top;
                const elementOffsetLeft  = elementIdRect.left - bookIdRect.left;
                var popUpTop = parseInt(element.style.top,10) + parseInt(element.style.height,10) ;
                document.getElementsByClassName('mm-popup__box')[0].classList.add('et1popUp');
                box.style.top = popUpTop + 10 + 'px';
                box.style.left = (parseInt(element.style.left,10) - 100 )+ 'px';
                bookContainerId.appendChild(popUpElement);
            }
            else
            {
            console.log(document.getElementsByClassName('mm-popup__box'));
              //const elementIdRect = element.getBoundingClientRect();
              const isWordBroken = element.offsetHeight > 25 ? true : false;
              if (isWordBroken) {
                document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign');
                box.style.top = (element.getBoundingClientRect().top + iframe.offsetTop + element.offsetHeight + 15) + 'px';
                box.style.left = (element.getBoundingClientRect().left) + 'px';
              } 
              else {
                
                //if (window.innerHeight - element.getBoundingClientRect().top < 135) {
                if (element.getBoundingClientRect().top - window.scrollY > 500) {
                  document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpTopAlign');
                  box.style.top = (element.getBoundingClientRect().top + iframe.offsetTop - document.getElementsByClassName('mm-popup__box')[0].clientHeight - 15) + 'px';
                  box.style.left = (element.getBoundingClientRect().left-185+(element.offsetWidth/2)) + 'px';
                } else if (popUpRightAlign) {
                  box.style.top = (element.getBoundingClientRect().top + iframe.offsetTop + element.offsetHeight + 15) + 'px';
                  document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpRightAlign');
                  box.style.left = (element.getBoundingClientRect().left + document.getElementById(iframe.id).offsetLeft + elementOffsetWidth - 350) + 'px';
                } 
                else {
                  box.style.top = (element.getBoundingClientRect().top + iframe.offsetTop + element.offsetHeight + 15) + 'px';
                  document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpLeftAlign'); 
                  box.style.left = (element.getBoundingClientRect().left  +  elementOffsetWidth + document.getElementById(iframe.id).offsetLeft - 50) + 'px';
                }
              }
            }
            if (!props.popOverCollection.popOverTitle) {
              // To align moreInfo popup
              document.getElementsByClassName('mm-popup__box__body')[0].classList.add('reAlignPopUp');
            }
            if(!props.isET1)
            {
              document.getElementsByClassName('mm-popup__box')[0].style.fontFamily = pageFontFamilyStyle;
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
    console.log(document.getElementsByClassName('mm-popup__box'));
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
