import {BindGlossaryCallBacks} from './BindGlossaryCallBacks';
import {BindMoreInfoCallBacks} from './BindMoreInfoCallBacks';

export class PopupCallBacks {
    constructor(props) {
      console.clear();
      new BindGlossaryCallBacks(props);
      new BindMoreInfoCallBacks(props);
    }    
}
