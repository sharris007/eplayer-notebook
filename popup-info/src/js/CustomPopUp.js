import React, { Component } from 'react';
import renderHTML from 'react-render-html';

export default class CustomPopUp extends Component {
    constructor(props) {
      super(props);
      console.log(props);
      this.state = { isModalOpen: false };
      this.popUpArray = [];
      this.bookId = '';
      this.title = ''
      this.description = '';
      this.modalStyle = {};
      this.top = '';
      this.left = '';
      this.popupAlign = 'left';
      this.paragraphNumeroUnoDOM = '';
      if (props && props.popUpCollection && props.popUpCollection.length > 0) {
        this.props = props;
        this.bookId = this.props.bookId;
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
      const props = this.props.popUpCollection[index];
      this.paragraphNumeroUnoDOM = event.target;
      this.title = (props.popOverCollection && props.popOverCollection.popOverTitle) ? renderHTML(props.popOverCollection.popOverTitle) : '';
      this.description = (props.popOverCollection && props.popOverCollection.popOverDescription) ? renderHTML(props.popOverCollection.popOverDescription) : '';      
      this.top = `${this.paragraphNumeroUnoDOM.getBoundingClientRect().top + window.scrollY + this.paragraphNumeroUnoDOM.offsetHeight + 12}px`;
      if (window.innerHeight - this.paragraphNumeroUnoDOM.getBoundingClientRect().top < 135) {
        this.popupAlign = 'center';
        this.top = `${this.paragraphNumeroUnoDOM.getBoundingClientRect().top + window.scrollY - this.paragraphNumeroUnoDOM.clientHeight - 15}px`;
        this.left = (this.paragraphNumeroUnoDOM.getBoundingClientRect().left-185+(this.paragraphNumeroUnoDOM.offsetWidth/2)) + 'px';
      } else if (document.getElementById(this.bookId).offsetWidth - this.paragraphNumeroUnoDOM.getBoundingClientRect().left < 365) {
        this.popupAlign = 'right';
        this.left = `${this.paragraphNumeroUnoDOM.getBoundingClientRect().left - 350 +  this.paragraphNumeroUnoDOM.offsetWidth/2}px`;
      } 
      else {
        this.popupAlign = 'left';
        this.left = (this.paragraphNumeroUnoDOM.getBoundingClientRect().left - 50 +  this.paragraphNumeroUnoDOM.offsetWidth/2) + 'px';
      }

      this.modalStyle = {
        position: 'absolute',
        top: this.top,
        left: this.left,
        zIndex: '11',
        background: 'white',
        width: '400px',
        border: '1px solid #b8c8cc',
        borderRadius: '5px',
        boxShadow: '0 5px 20px 0 rgba(126, 137, 140, 0.2)',
        display: 'none'
      }
      this.setState({isModalOpen: true});
    }

    close = (e) => {
      e.preventDefault()
      this.setState({isModalOpen: false});
    }

    componentDidUpdate() {
      const popUp = document.getElementsByClassName('paragraphNumeroUno');
      if (popUp && popUp[0]) {
        popUp[0].style.display = 'block'
      } else {
        return ''
      }
      if (this.popupAlign === 'left') {
        popUp[0].classList.add('popUpLeftAlign');
      } else if (this.popupAlign === 'right') {
        popUp[0].classList.add('popUpRightAlign');
      } else if (this.popupAlign === 'center') {
        popUp[0].style.top = `${parseInt(popUp[0].style.top.replace('px', '')) - popUp[0].clientHeight}px`
        popUp[0].classList.add('popUpTopAlign');
      }  
    }

    renderPopUp = () => {
      const backdropStyle = {
        position: 'absolute',
        width: '100%',
        height: document.getElementById(this.bookId).clientHeight + 'px',
        top: '0px',
        left: '0px',
        zIndex: '10',
        opacity: 0
      }
      return (<div> <div> <p className="paragraphNumeroUno" style={this.modalStyle} resource=""><strong>{this.title}</strong><br/>{this.description}</p> </div> <div style={backdropStyle} onClick={e => this.close(e)} /> </div>)
    }

    render() {
      return(
      		<div>
				{this.state.isModalOpen === true ? this.renderPopUp() : <div> </div>}
			</div>
		)
    }
}
