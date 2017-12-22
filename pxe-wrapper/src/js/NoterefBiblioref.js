import { NoterefBibliorefClasses } from '../../const/PopUpClasses';
import PopupApi from '../api/PopupApi';

import {BindGlossaryCallBacks} from './BindGlossaryCallBacks';

export class NoterefBiblioref { 
    constructor(props) { 
      this.props = props;
      this.biblorefDoms = [];
      this.biblorefUrl = '';
      this.biblorefCollection = [];

      this.divGlossaryRef = props.divGlossaryRef;
      this.bookDiv = props.bookDiv;
      this.node=props.node;
      this.basePath = props.basePath;

      this.bindNoterefBibliorefCallBacks(props);
    }

    bindNoterefBibliorefCallBacks = (props) => {
      const bookDiv = props.node.contentDocument.body;
      NoterefBibliorefClasses.forEach((classes) => {
        this.biblorefDoms = bookDiv.querySelectorAll(classes);
        console.log(this.biblorefDoms);
        console.log(classes);
      });
      if (this.biblorefDoms && this.biblorefDoms.length > 0) {
        this.biblorefUrl = this.biblorefDoms[0].href ? this.biblorefDoms[0].href.split('#')[0] : '';
      } 

      if (this.biblorefUrl) {
        this.triggerBiblorefService(this.biblorefUrl)
      } else {
        new BindGlossaryCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv, node:this.node, basePath: this.basePath, 'biblorefCollection' : []});
      }
    }

    triggerBiblorefService = (url) => {
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
      for (let i=0; i<this.biblorefDoms.length;i++) {
        const popOverCollection = {};
        const id = this.biblorefDoms[i].href.split('#')[1];
        popOverCollection.popOverDescription = doc.getElementById(id).innerHTML;
        this.biblorefCollection.push({'popOverCollection':popOverCollection, 'item':this.biblorefDoms[i]})
      }
      new BindGlossaryCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv, node:this.node, basePath: this.basePath, 'biblorefCollection' : this.biblorefCollection});
      //window.renderPopUp(this.biblorefCollection);
    }
}
