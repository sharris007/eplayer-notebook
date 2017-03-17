
import {BindGlossaryCallBacks} from './BindGlossaryCallBacks';
import {BindMoreInfoCallBacks} from './BindMoreInfoCallBacks';

export default class Wrapper {
  constructor(props) {
    this.divGlossaryRef = props.divGlossaryRef;
    this.bookDiv = props.bookDiv;
    
  }

  bindPopUpCallBacks() {
    new BindGlossaryCallBacks({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv});
    new BindMoreInfoCallBacks({'bookDiv' : this.bookDiv});
  }
}




