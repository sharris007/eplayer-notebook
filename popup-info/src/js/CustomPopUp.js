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
      console.log(event.target.getBoundingClientRect().top + window.scrollY); 
      //this.title = props.popOverCollection.popOverTitle
      this.title = (props.popOverCollection && props.popOverCollection.popOverTitle) ? renderHTML(props.popOverCollection.popOverTitle) : '';
      this.description = (props.popOverCollection && props.popOverCollection.popOverDescription) ? renderHTML(props.popOverCollection.popOverDescription) : '';
      this.modalStyle = {
        position: 'absolute',
        top: `${event.target.getBoundingClientRect().top + window.scrollY + event.target.offsetHeight}px`,
        left: `${event.target.getBoundingClientRect().left}px`,
        zIndex: '11',
        background: 'white',
        width: '400px',
        border: '2px solid darkcyan'
      }
      this.setState({isModalOpen: true});
    }

    close = (e) => {
      e.preventDefault()
      this.setState({isModalOpen: false});
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
      return (<div> <p className="paragraphNumeroUno" style={this.modalStyle} resource=""><strong>{this.title}</strong><br/>{this.description}</p> <div style={backdropStyle} onClick={e => this.close(e)} /> </div>)
    }

    render() {
      return(
      		<div>
				{this.state.isModalOpen === true ? this.renderPopUp() : <div> </div>}
			</div>
		)
    }
}
