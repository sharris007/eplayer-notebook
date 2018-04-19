// In React, an owner is the component that sets the props of other components, if desired.
// (see https://facebook.github.io/react/docs/multiple-components.html)
//
// NOTE: If you want to reference another Origami component in this file's JSX below, import
// its src/js/component-owner.js directly from this project's /node_modules.

//import '../scss/component-specific.scss';

import React, {PropTypes} from 'react';
import {injectIntl} from 'react-intl';
import _ from 'lodash';

import NoteBook from './NoteBook';


class ComponentOwner extends React.Component {

  //
  // Modify or add prop types to validate the properties passed to this component!
  // This is defined using an ES7 class property (transpiled by Babel Stage 0)
  //
  static propTypes = {
    notesList:PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state={
      lists:props.lists,
      notesList:props.notesList
    };
  }
  callback=(msg, data)=> {;
    const notesList=[...this.state.notesList];
    if (msg==='ADD') {
      notesList.splice(0, 0, {
        id: 'created'+notesList.length+1,
        title: data.title,
        cardFormat: 'note',
        content: data.content,
        content2: 'this is test data',
        changeDate: data.changeDate
      });
      this.setState({
        notesList:notesList
      });
    }else if (msg==='SAVE') {
      const index = _.findIndex(notesList, function(o) { return o.id === data.id; });
      if (index>-1) {
        notesList.splice(index, 1, data);
        this.setState({
          notesList:notesList
        });
      }
    }else if (msg==='DELETE') {
      const index = _.findIndex(notesList, function(o) { return o.id === data.id; });
      if (index>-1) {
        notesList.splice(index, 1);
        this.setState({
          notesList:notesList
        });
      }
    }else if (msg==='NAVIGATE') {
      console.log('Navigation', data);
    }
  }

  //
  // Note that combining the fat arrow syntax with ES7 class properties (transpiled by Babel Stage 0), we eliminate the
  // need to do manual binding of the 'this' context in event handlers or callbacks. React binds all other contexts
  // as expected.
  //

  render() {
    const { notesList } = this.state;
    return (
      <div>
        <NoteBook notesList={notesList} callback={this.callback} coloums={3}/>
      </div>
    );
  };  
}

export default ComponentOwner; // Inject this.props.intl into the component context
