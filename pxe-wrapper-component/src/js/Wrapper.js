
import {GlossaryCallback} from './GlossaryCallback';
import {MoreInfoCallback} from './MoreInfoCallback';

export default class Wrapper {
  constructor(props) {
    this.divGlossaryRef = props.divGlossaryRef;
    this.bookDiv = props.bookDiv;
    
  }

  bindPopUpCallBacks() {
    new GlossaryCallback({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : this.bookDiv});
    new MoreInfoCallback({'bookDiv' : this.bookDiv});
  }
}




