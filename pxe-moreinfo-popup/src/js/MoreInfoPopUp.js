import {  Component } from 'react';
import Popup from 'react-popup';
import '../scss/moreInfoPopUp.scss';


class MoreInfoPopUp extends Component {
  constructor(props) {
    super(props); 
    setTimeout(() => {
      this.fetchMoreInfoData();
    }, 2000) 
    
  }

  fetchMoreInfoData = () => {
    document.getElementById(this.props.bookDiv).querySelectorAll('.lc_ec_aside').forEach((item) => {
      item.addEventListener('click', this.framePopOver);
    });
  }

  framePopOver = (event) => {
    event.preventDefault();
    console.debug(event.target);
    const docBoundingClientRect = document.body.getBoundingClientRect();
    const elementBoundingClientRect = event.target.getBoundingClientRect();
    const elementTopPosition = -(docBoundingClientRect.top) +  elementBoundingClientRect.top + 10;

    const moreInfoIconDOM  = event.target.parentElement;
    const bookDivHeight = document.getElementById(this.props.bookDiv).clientHeight + 'px';
    document.getElementsByClassName('mm-popup')[0].style.height = bookDivHeight;
 
    const popOverTitle = document.getElementById(moreInfoIconDOM.href.split('#')[1]).getElementsByTagName('h2')[0].textContent;
    const popOverDescription = document.getElementById(moreInfoIconDOM.href.split('#')[1]).getElementsByTagName('p')[0].textContent;

    Popup.registerPlugin('popover', function (target) {
      this.create({
        title: popOverTitle,
        content: popOverDescription,
        noOverlay: true,
        position: function (box) {
          box.style.top = elementTopPosition + 'px';
          box.style.left = event.clientX + 'px';
          box.style.margin = 0;
          box.style.opacity = 1;

          console.debug('target.getBoundingClientRect()',  target.getBoundingClientRect())
          console.debug('event.pageX :- ', event.pageX, 'event.pageY :- ', event.pageY )
          console.debug('e.pageX - rect.left :- ', event.pageX - target.getBoundingClientRect().left )
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
