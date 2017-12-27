import { NoterefClasses } from '../../const/PopUpClasses';
import PopupApi from '../api/PopupApi';

import {BindGlossaryCallBacks} from './BindGlossaryCallBacks';

export class NoterefBiblioref { 
    constructor(props) { 
      this.props = props;
      this.noteRefDoms = [];
      this.noteRefUrl = '';
      this.noteRefCollection = [];

      this.divGlossaryRef = props.divGlossaryRef;
      this.bookDiv = props.bookDiv;
      this.node=props.node;
      this.basePath = props.basePath;

      this.bindNoterefClasses(props);
    }

    bindNoterefClasses = (props) => {
      const bookDiv = props.node.contentDocument.body;
      NoterefClasses.forEach((classes) => {
        if(this.noteRefDoms.length === 0)  {
          this.noteRefDoms = bookDiv.querySelectorAll(classes);
          console.log(this.noteRefDoms);
          console.log(classes);
        } else { console.log("classes : ",classes) }
        
      });
      if (this.noteRefDoms && this.noteRefDoms.length > 0) {
        this.noteRefUrl = this.noteRefDoms[0].href ? this.noteRefDoms[0].href.split('#')[0] : '';
      } 

      if (this.noteRefUrl) {
        this.triggerNoteRefService(this.noteRefUrl)
      } else {
        new BindGlossaryCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv, node:this.node, basePath: this.basePath, 'noteRefCollection' : []});
      }
    }

    triggerNoteRefService = (url) => {
      PopupApi.getData(url).then((response) => {
        return response.text();
      }).then(this.renderData).catch((err) => {
        console.debug(err);
      });
    }

    renderData = (text) => {
      //const bibloref = renderHTML(text);
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');
      for (let i=0; i<this.noteRefDoms.length;i++) {
        const popOverCollection = {};
        const id = this.noteRefDoms[i].href.split('#')[1];
        popOverCollection.popOverDescription = doc.getElementById(id).innerHTML;
        this.noteRefCollection.push({'popOverCollection':popOverCollection, 'item':this.noteRefDoms[i]})
      }
      new BindGlossaryCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv, node:this.node, basePath: this.basePath, 'noteRefCollection' : this.noteRefCollection});
      //window.renderPopUp(this.biblorefCollection);
    }
}
