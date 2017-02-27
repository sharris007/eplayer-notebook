import {  Component } from 'react';
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
    const hrefId = moreInfoIconDOM.href ? moreInfoIconDOM.href.split('#')[1] : moreInfoIconDOM.children[0].href.split('#')[1];
    
    switch (args.className) {
    case '.lc_ec_aside' : {
      popOverTitle = renderHTML(document.getElementById(hrefId).getElementsByTagName('h2')[0].innerHTML);
      popOverDescription = renderHTML(document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML);
      break;
    }
    case 'a.noteref.noteref_footnote' : {
      popOverDescription = renderHTML(document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML);
      break;
    }

    }

    Popup.registerPlugin('popover', function () {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        noOverlay: true,
        position: function (box) {
          box.style.top = event.pageY + 5 + 'px';
          box.style.left = event.pageX + 'px';
          box.style.margin = 0;
          box.style.opacity = 1;
        }
      });
    }); 
    Popup.plugins.popover();
  }
  
  render() {
    return (  <div>
                <Popup />
              </div>);
  }
  
}

export default MoreInfoPopUp;
