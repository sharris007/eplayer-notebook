import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import ReactModal from 'react-modal';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


export const LightBox = (props) => {
  const customContentStyle = {
    dialogStyles: {
      width: '80%',
      maxWidth: 'none',
      transform: 'none'
    },
    titleStyles:{
      padding:0,
      textAlign: 'right'
    }
  };
  return (
      <Dialog
          title={<div><IconButton onClick={()=>props.lightBoxProps.callback()}><NavigationClose /></IconButton></div>}
          actions={[]}
          modal={false}
          open={props.lightBoxProps.isOpen}
          onRequestClose={()=>this.handleLightBoxCloseModal()}
          autoScrollBodyContent={true}
          contentStyle={customContentStyle.dialogStyles}
          titleStyle={customContentStyle.titleStyles}
        >
         <div>
          <iframe src={props.lightBoxProps.url} height="400">
              Sorry your browser does not support inline frames.
          </iframe>
         </div>
        </Dialog>
    );
};

LightBox.PropTypes = {
  lightBoxProps: PropTypes.object.isRequired
};

