import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import ReactModal from 'react-modal';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const customContentStyle = {
  dialogStyles: {
    width: '80%',
    maxWidth: 'none'
  },
  titleStyles:{
    padding:0,
    textAlign: 'right'
  }
};

class LightBox extends React.Component {
  
  constructor(props) {
    super(props);
  };
  handleLightBoxCloseModal () {
    this.props.lightBoxProps.callback('closeLightBox', 'Close Light Box');
  };

  render() {
    return (
      <Dialog
          title={<div><IconButton onClick={()=>this.handleLightBoxCloseModal()}><NavigationClose /></IconButton></div>}
          actions={[]}
          modal={false}
          open={this.props.lightBoxProps.isOpen}
          onRequestClose={()=>this.handleLightBoxCloseModal()}
          autoScrollBodyContent={true}
          contentStyle={customContentStyle.dialogStyles}
          titleStyle={customContentStyle.titleStyles}
        >
         <div ref = {(el) => { this.componentRef = el; }}>
          <iframe src={this.props.lightBoxProps.url} height="350">
              Sorry your browser does not support inline frames.
          </iframe>
         </div>
        </Dialog>
    );
  }
};

LightBox.PropTypes = {
  lightBoxProps: PropTypes.object.isRequired
};

export default LightBox;
