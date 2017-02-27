import {  Component } from 'react';
import Popup from 'react-popup';
import '../scss/moreInfoPopUp.scss';
import { MoreInfoPopUpClasses } from '../../const/MoreInfoPopUpClasses';


class MoreInfoPopUp extends Component {
  constructor(props) {
    super(props); 
    this.bindMoreInfoCallBacks()
  }

  bindMoreInfoCallBacks = () => {
    const bookDiv = document.getElementById(this.props.bookDiv);
    console.log(MoreInfoPopUpClasses)
    MoreInfoPopUpClasses.forEach((val) => {
      bookDiv.querySelectorAll(val).forEach((item) => {
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
    let moreInfoIconDOM = ''
    
    switch (args.className) {
    case '.lc_ec_aside' : {
      moreInfoIconDOM = event.target.parentElement; 
      popOverTitle = document.getElementById(moreInfoIconDOM.href.split('#')[1]).getElementsByTagName('h2')[0].textContent;
      popOverDescription = document.getElementById(moreInfoIconDOM.href.split('#')[1]).getElementsByTagName('p')[0].textContent;
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
