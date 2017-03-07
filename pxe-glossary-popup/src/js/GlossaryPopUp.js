import React, { Component, PropTypes } from 'react';
import renderHTML from 'react-render-html';
import Popup from 'react-popup';

import { GlossaryPopUpClasses } from '../../const/GlossaryPopUpClasses';
import GlossaryApi from '../api/GlossaryApi'
import '../scss/glossaryPopUp.scss';


class GlossaryPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      glossaryResponse: ''
    };
  }

  componentDidMount() {
    this.fetchGlossaryData();
  }

  fetchGlossaryData = () => {
    const bookDiv = document.getElementById(this.props.bookDiv);
    let glossaryurl = '';

    if (bookDiv.querySelectorAll('a.keyword').length > 0) {
      glossaryurl = bookDiv.querySelectorAll('a.keyword')[0].href.split('#')[0];
    } else if (bookDiv.querySelectorAll('dfn.keyword').length > 0) {
      glossaryurl = bookDiv.querySelectorAll('dfn.keyword')[0].parentElement.href.split('#')[0];
    }
    console.log(glossaryurl);
    GlossaryApi.getData(glossaryurl).then((response) => {
      return response.text();
    }).then((text) => {
      this.setState({ glossaryResponse: text });
      const bookDiv = document.getElementById(this.props.bookDiv);
      GlossaryPopUpClasses.forEach((val) => {
        bookDiv.querySelectorAll(val).forEach((item) => {
          const obj = { 'className': val };
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
    const bookDiv = this.props.bookDiv;
    switch (args.className) {
    case 'a.keyword':
      {
        const glossaryNode = document.getElementById(targetElement.hash.replace('#', ''));
        popOverTitle = glossaryNode ? glossaryNode.getElementsByTagName('dfn')[0].textContent : '';
        popOverDescription = glossaryNode ? renderHTML(glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML) : '';
        break;
      }
    case 'dfn.keyword':
      {
        const glossaryNode = document.getElementById(targetElement.parentElement.hash.replace('#', ''));
        popOverTitle       = glossaryNode ? glossaryNode.getElementsByTagName('dfn')[0].textContent : '';
        popOverDescription = glossaryNode ? renderHTML(glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML) : '';
        break;
      }
    }

    Popup.registerPlugin('popover', function(element) {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        noOverlay: true,
        position: function(box) {
          
          if (element.getBoundingClientRect().left < 124) {
            document.getElementsByClassName('mm-popup__box')[0].classList.add('popUpRightAlign');
            box.style.left = (element.getBoundingClientRect().left  + element.clientWidth + 20) + 'px';
            box.style.top = (element.getBoundingClientRect().top + window.scrollY  - 10) + 'px';
          } else if (document.getElementById(bookDiv).clientWidth < (element.getBoundingClientRect().left + 124)) {
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

  render() {
    return ( < div >
      < Popup / >
      < div id = "divGlossary"
      style = {
        { display: 'none' }
      } > {renderHTML(this.state.glossaryResponse)} < /div> < /div > );
  }

}

GlossaryPopUp.PropTypes = {
  glossaryurl: PropTypes.string.isRequired,
  glossaryResponse: PropTypes.string.isRequired
}

export default GlossaryPopUp;
