import {GlossaryPopUpClasses} from '../../const/PopUpClasses';
import PopupApi from '../api/PopupApi';
import {BindMoreInfoCallBacks} from './BindMoreInfoCallBacks';

export class BindGlossaryCallBacks {
    constructor(props) {
      this.bindGlossaryCallBacks(props);
      this.glossaryCollection =[];
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
          this.glossaryCollection = [];
          props.divGlossaryRef.innerHTML = text;
          GlossaryPopUpClasses.forEach((classes) => {
            const bookDivQuerySelectorClasses = bookDiv.querySelectorAll(classes);
            for (let i=0;i<bookDivQuerySelectorClasses.length;i++) {
            //bookDiv.querySelectorAll(classes).forEach((item) => {
              let glossaryNode = '';
              const popOverCollection = {};
              switch (classes) {
              case 'dfn.keyword':
                {
                  glossaryNode = document.getElementById(bookDivQuerySelectorClasses[i].parentElement.hash.replace('#', ''));
                  break;
                }
              case 'a.keyword':
              case 'a.noteref':
                {
                  glossaryNode = document.getElementById(bookDivQuerySelectorClasses[i].hash.replace('#', ''));
                  break;
                }
              case 'dfn.reminder':
                {
                  const id = bookDivQuerySelectorClasses[i].hash ? bookDivQuerySelectorClasses[i].hash.replace('#', '') : bookDivQuerySelectorClasses[i].parentElement.hash.replace('#', '');
                  glossaryNode = document.getElementById(id);
                  break;
                }
              }

              popOverCollection.popOverTitle = glossaryNode ? (glossaryNode.getElementsByTagName('dfn').length > 0 ? glossaryNode.getElementsByTagName('dfn')[0].textContent : ''): '';
              let glossaryDesc = '';
              if (glossaryNode && glossaryNode.nextElementSibling && glossaryNode.nextElementSibling.getElementsByTagName('p')[0]) {
                glossaryDesc = glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML;
              } else if (glossaryNode && glossaryNode.nextElementSibling) {
                glossaryDesc = glossaryNode.nextElementSibling.innerHTML
              }
              popOverCollection.popOverDescription = glossaryDesc;
              if (popOverCollection.popOverTitle && popOverCollection.popOverDescription) {
                this.glossaryCollection.push({'popOverCollection' : popOverCollection, 'item' : bookDivQuerySelectorClasses[i]});
              } else {
                popOverCollection.popOverTitle = bookDivQuerySelectorClasses[i].innerHTML;
                popOverCollection.popOverDescription = '';
                this.glossaryCollection.push({'popOverCollection' : popOverCollection, 'item' : bookDivQuerySelectorClasses[i]});
              }
            }
            //});
          });
          new BindMoreInfoCallBacks({'glossaryCollection':this.glossaryCollection, 'bookDiv' : props.bookDiv});
        }).catch((err) => {
          console.debug(err);
        });
      } else {
        new BindMoreInfoCallBacks({'glossaryCollection':this.glossaryCollection, 'bookDiv' : props.bookDiv});
      }
    }
}
