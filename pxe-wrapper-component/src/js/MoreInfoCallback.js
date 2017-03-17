
import {MoreInfoPopUpClasses} from '../../const/PopUpClasses';
import PopUps from './PopUps';

export class MoreInfoCallback {
    constructor(props) {
      this.props = props;
      this.bindMoreInfoCallBacks(props)
    }

    bindMoreInfoCallBacks(props) {
      const bookDiv = document.getElementById(props.bookDiv);
      MoreInfoPopUpClasses.forEach((val) => {
        bookDiv.querySelectorAll(val).forEach((item) => {
          console.debug('Item       ', item)
          const obj = {'className' :  val};
          item.addEventListener('click', this.frameMoreInfoPopOver.bind(this, obj))
        });
      });
    }

    frameMoreInfoPopOver(args, event) {
      event.preventDefault();
      const popOverCollection = {};

      const moreInfoIconDOM = event.target.parentElement;
      let hrefId = '';

      switch (args.className) {
      case '.lc_ec_aside' : {
        hrefId =  moreInfoIconDOM.href.split('#')[1];
        popOverCollection.popOverTitle = document.getElementById(hrefId).getElementsByTagName('h2')[0].innerHTML;
        break;
      }
      case 'a.noteref.noteref_footnote' : {
        if (moreInfoIconDOM.href) {
          hrefId = moreInfoIconDOM.href.split('#')[1];
        } else if (moreInfoIconDOM.children[0].href) {
          hrefId = moreInfoIconDOM.children[0].href.split('#')[1];
        } else if (moreInfoIconDOM.querySelector('a')) {
          hrefId = moreInfoIconDOM.querySelector('a').href.split('#')[1];
        } else {
          hrefId = moreInfoIconDOM.parentElement.href.split('#')[1];
        }
        break;
      }

      case 'a.noteref.noteref_footnote_symboled' : {
        hrefId = moreInfoIconDOM.parentElement.href.split('#')[1];
        break;
      }
      }
      if (hrefId) {
        popOverCollection.popOverDescription = document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML;
      }
      console.log(popOverCollection)
      new PopUps({'popOverCollection' : popOverCollection, 'event' : event, 'bookDiv' : this.props.bookDiv});
    }
}

