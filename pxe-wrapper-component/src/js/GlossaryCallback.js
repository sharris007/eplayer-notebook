import PopupApi from '../api/PopupApi';
import renderHTML from 'react-render-html';

import {GlossaryPopUpClasses} from '../../const/PopUpClasses';
import PopUps from './PopUps';

export class GlossaryCallback {
    constructor(props) {
      this.props = props;
      this.bindGlossaryCallBacks(props)
    }

    bindGlossaryCallBacks(props) {
      const bookDiv = document.getElementById(props.bookDiv);
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
          props.divGlossaryRef.innerHTML = text;
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
      new PopUps({'popOverCollection' : popOverCollection, 'event' : event, 'bookDiv' : this.props.bookDiv});
    }
}

