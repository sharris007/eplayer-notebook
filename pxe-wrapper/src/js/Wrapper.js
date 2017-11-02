import {BindGlossaryCallBacks} from './BindGlossaryCallBacks';

export default class Wrapper {
 constructor(props) {
   this.divGlossaryRef = props.divGlossaryRef;
   this.bookDiv = props.bookDiv;
   this.node=props.node;
   this.basePath = props.basePath;
 }

 bindPopUpCallBacks() {
   new BindGlossaryCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv, node:this.node, basePath: this.basePath});
 }
}
