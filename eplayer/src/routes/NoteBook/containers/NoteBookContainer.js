import React from 'react';
import { notes } from '../data/notes';
import { NoteBook } from '@pearson-incubator/notebook';

const NoteBookContainer = () => {
  const lists = [];
  const notesList = [];
  const mapNotes = (notesList, lists, quantity) => {
    notesList.map((item, i) => {
      const index = i % quantity;
      lists[index].cards.push(item);
    });
  };

  const init = (quantity) => {
    // initialize lists
    for (let ic = 0; ic < quantity; ic++) {
      lists.push({
        id: ic,
        name: '',
        cards: []
      });
    }

    for (let ic = 0; ic < notes.total; ic++) {
      const note = notes.rows[ic];
      note.cardFormat = 'note';
      note.title = note.quote;
      note.content = note.text;
      const timeStamp = note.updatedTimestamp ? note.updatedTimestamp : note.createdTimestamp;
      note.changeDate = new Date(parseInt(timeStamp)).toDateString();
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

    mapNotes(notesList, lists, quantity);
  };
  init(5);
  return (<NoteBook lists={lists} />);
};
// class NoteBookContainer extends React.Component {
//   render() {
//     return (<div>NoteBookContainer</div>);
//   }
// }

export default NoteBookContainer;
