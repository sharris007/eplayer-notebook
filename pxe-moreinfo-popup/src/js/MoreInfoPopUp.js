import React, {  Component } from 'react';
import Popup from 'react-popup';
import renderHTML from 'react-render-html';

import '../scss/moreInfoPopUp.scss';
import { MoreInfoPopUpClasses } from '../../const/MoreInfoPopUpClasses';


class MoreInfoPopUp extends Component {
  constructor(props) {
    super(props); 
    this.bindMoreInfoCallBacks()
  }

  bindMoreInfoCallBacks = () => {
    const bookDiv = document.getElementById(this.props.bookDiv);
    MoreInfoPopUpClasses.forEach((val) => {
      bookDiv.querySelectorAll(val).forEach((item) => {
        console.debug('Item       ', item)
        const obj = {'className' :  val};
        item.addEventListener('click', this.framePopOver.bind(this, obj))
      });
    });
  }

  framePopOver = (args, event) => {
    event.preventDefault();
    const bookDivHeight = document.getElementById(this.props.bookDiv).clientHeight + 'px';
    document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;

    let popOverTitle = '';
    let popOverDescription = '';
    const moreInfoIconDOM = event.target.parentElement;
    let hrefId = '';
    
    switch (args.className) {
    case '.lc_ec_aside' : {
      hrefId =  moreInfoIconDOM.href.split('#')[1];
      popOverTitle = renderHTML(document.getElementById(hrefId).getElementsByTagName('h2')[0].innerHTML);
      popOverDescription = renderHTML(document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML);
      break;
    }
    case 'a.noteref.noteref_footnote' : {
      if (moreInfoIconDOM.href) {
        hrefId = moreInfoIconDOM.href.split('#')[1];
      } else if (moreInfoIconDOM.children[0].href) {
        hrefId = moreInfoIconDOM.children[0].href.split('#')[1];
      } else if (moreInfoIconDOM.querySelector('a')) {
        hrefId = moreInfoIconDOM.querySelector('a').href.split('#')[1];
      } else {
        hrefId = moreInfoIconDOM.parentElement.href.split('#')[1];
      }
      popOverDescription = renderHTML(document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML);
      break;
    }

    case 'a.noteref.noteref_footnote_symboled' : {
      hrefId = moreInfoIconDOM.parentElement.href.split('#')[1];
      popOverDescription = renderHTML(document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML);
      break;
    }

    }

    Popup.registerPlugin('popover', function (element) {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        noOverlay: true,
        position: function (box) {
          box.style.top = (element.getBoundingClientRect().top + window.scrollY + element.offsetHeight + 10) + 'px';
          box.style.left = (element.getBoundingClientRect().left - (document.getElementsByClassName('mm-popup__box__body')[0].clientWidth/2) + element.clientWidth/2) + 'px';
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
              </div>);
  }
  
}

export default MoreInfoPopUp;
