import React from 'react';
import { connect } from 'react-redux';
import { NoteBook } from '@pearson-incubator/notebook';
import { getTotalAnnCallService } from '../../../actions/annotation';
import _ from 'lodash';
import { browserHistory } from 'react-router';

class NoteBookContainer extends React.Component {

  constructor(props) {
    super(props);
    const params = {
      context: props.params.bookId,
      user: 'ffffffff59b8c629e4b09efb34405de7', // piSession.userId(),
      xAuth: localStorage.getItem('secureToken'),
      annHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('secureToken')
      }
    };
    props.dispatch(getTotalAnnCallService(params));
    this.state = {
      coloums: 5,
      notesList: [],
      notes: []
    };
  }
  prepareNotes = (notes) => {
    const notesList = [];
    for (let ic = 0; ic < notes.length; ic++) {
      const note = Object.assign({}, notes[ic].data);
      note.id = notes[ic].id;
      note.cardFormat = 'note';
      if (notes[ic].pageId) {
        note.title = note.source.title;
        note.highLightText = note.quote;
        note.pageId = notes[ic].pageId;
      } else {
        note.title = note.quote;
      }
      note.content = note.text;
      const timeStamp = note.updatedTimestamp ? note.updatedTimestamp : note.createdTimestamp;
      note.changeDate = timeStamp;
      if (note.colorCode === '#FFD232') { // Yellow
        note.noteText = 'Q'; // Questions
      } else if (note.colorCode === '#55DF49') { // Green
        note.noteText = 'M'; // Main Idea
      } else if (note.colorCode === '#FC92CF') { // Pink
        note.noteText = 'O'; // Observations
      } else if (note.colorCode === '#ccf5fd') { // Share(Blue)
        note.noteText = 'I'; // From Instructor
      }
      notesList.push(note);
    }
    this.setState({
      notesList
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.notesList);
    this.setState({ notes: nextProps.notesList }, () => { this.prepareNotes(this.state.notes); });
  }
  callback=(msg, data) => {
    const notes = [...this.state.notes];
    const myHeaders = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('secureToken')
    });
    if (msg === 'ADD') {
      console.log(msg, data);
    } else if (msg === 'SAVE') {
      const index = _.findIndex(this.state.notes, note => note.id === data.id);
      const note = this.state.notes[index];
      note.data.quote = data.title;
      note.data.text = data.content;
      note.data.updatedTimestamp = data.changeDate;
      const payload = { payload: [note] };
      const myInit = { method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(payload)
      };
      const url = `https://spectrum-qa.stg-openclass.com/api/context/${this.props.params.bookId}/identities/ffffffff59b8c629e4b09efb34405de7/notesX/`;
      fetch(url, myInit).then(response => response.json()).then((res) => {
        // console.log(res);
        notes.splice(index, 1, res.response[0]);
        this.setState({ notes }, () => { this.prepareNotes(this.state.notes); });
      });
    } else if (msg === 'DELETE') {
      const index = _.findIndex(this.state.notes, note => note.id === data.id);
      const url = `https://spectrum-qa.stg-openclass.com/api/context/${this.props.params.bookId}/identities/ffffffff59b8c629e4b09efb34405de7/notesX/`;
      const payload = { ids: [data.id] };
      const myInit = { method: 'DELETE',
        headers: myHeaders,
        body: JSON.stringify(payload)
      };
      fetch(url, myInit).then(response => response.json()).then((res) => {
        console.log(res);
        notes.splice(index, 1);
        this.setState({ notes }, () => { this.prepareNotes(this.state.notes); });
      });
    } else if (msg === 'NAVIGATE') {
      // console.log('Navigation', data);
      const index = _.findIndex(this.state.notes, note => note.id === data.id);
      const note = this.state.notes[index];
      browserHistory.push(`/eplayer/Course/${this.props.params.bookId}/page/${note.pageId}`);
    }
  }
  render() {
    const notesList = [...this.state.notesList];
    return (
      <div>
        {this.props.notesList.length ? <NoteBook notesList={notesList} callback={this.callback} coloums={this.state.coloums} /> : null}
      </div>
    );
  }
}
// class NoteBookContainer extends React.Component {
//   render() {
//     return (<div>NoteBookContainer</div>);
//   }
// }
NoteBookContainer.propTypes = {
  dispatch: React.PropTypes.func
};
const mapStateToProps = state => ({
  notesList: state.annotationReducer.notesList
});
NoteBookContainer = connect(mapStateToProps)(NoteBookContainer); // eslint-disable-line no-class-assign
export default NoteBookContainer;
