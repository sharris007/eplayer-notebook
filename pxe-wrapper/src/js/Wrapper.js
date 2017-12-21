import {NoterefBiblioref} from './NoterefBiblioref';

export default class Wrapper {
 constructor(props) {
   this.props = props;
 }

 bindPopUpCallBacks() {
   const props = this.props;
   new NoterefBiblioref({'divGlossaryRef' : props.divGlossaryRef, 'bookDiv' : props.bookDiv, node:props.node, basePath: props.basePath});
 }
}
