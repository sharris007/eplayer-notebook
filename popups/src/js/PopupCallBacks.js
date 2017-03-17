import {GlossaryPopUpClasses, MoreInfoPopUpClasses} from '../../const/PopUpClasses';
import PopupApi from '../api/PopupApi';
import renderHTML from 'react-render-html';
import PopUps from './PopUps';

export class PopupCallBacks {
    constructor(divGlossaryRef) {
      this.bindGlossaryCallBacks(divGlossaryRef);
      this.bindMoreInfoCallBacks();
    }

    bindGlossaryCallBacks(divGlossaryRef) {
      console.log(divGlossaryRef)
      const bookDiv = document.getElementById('bookDiv');
      let glossaryurl = '';
      GlossaryPopUpClasses.some((classes) => {
        if (bookDiv.querySelectorAll(classes).length > 0 ) {
          glossaryurl = bookDiv.querySelectorAll(classes)[0].href ? bookDiv.querySelectorAll(classes)[0].href.split('#')[0] : bookDiv.querySelectorAll(classes)[0].parentElement.href.split('#')[0];
          return true;
        }
      });

      if (glossaryurl) {
        PopupApi.getData(glossaryurl).then((response) => {
          return response.text();
        }).then((text) => {
          divGlossaryRef.innerHTML = text;
          const bookDiv = document.getElementById('bookDiv');
          GlossaryPopUpClasses.forEach((val) => {
            bookDiv.querySelectorAll(val).forEach((item) => {
              const obj = { 'className': val };
              item.addEventListener('click', this.frameGlossaryPopOver.bind(this, obj))
            });
          });
        }).catch((err) => {
          console.debug(err);
        });
      }
    }

    frameGlossaryPopOver(args, event) {
      event.preventDefault();
      const popOverCollection = {};
      const targetElement = event.target;
      let glossaryNode = '';

      switch (args.className) {
      case 'a.keyword':
      case 'a.noteref':
        {
          glossaryNode = document.getElementById(targetElement.hash.replace('#', ''));
          break;
        }
      case 'dfn.keyword':
        {
          glossaryNode = document.getElementById(targetElement.parentElement.hash.replace('#', ''));
          break;
        }
      case 'dfn.reminder':
        {
          const id = targetElement.hash ? targetElement.hash.replace('#', '') : targetElement.parentElement.hash.replace('#', '');
          glossaryNode = document.getElementById(id);
          break;
        }
      }
      popOverCollection.popOverTitle = glossaryNode ? glossaryNode.getElementsByTagName('dfn')[0].textContent : '';
      popOverCollection.popOverDescription = glossaryNode ? renderHTML(glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML) : '';
      new PopUps({'popOverCollection' : popOverCollection, 'event' : event, 'bookDiv' : 'bookDiv'});
    }

    bindMoreInfoCallBacks() {
      const bookDiv = document.getElementById('bookDiv');
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
      new PopUps({'popOverCollection' : popOverCollection, 'event' : event, 'bookDiv' : 'bookDiv'});

    }

}
