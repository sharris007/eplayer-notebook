import renderHTML from 'react-render-html';

import {GlossaryPopUpClasses} from '../../const/PopUpClasses';
import PopupApi from '../api/PopupApi';
import PopUpInfo from './PopUpInfo';

export class BindGlossaryCallBacks {
    constructor(props) {
      this.bindGlossaryCallBacks(props);
      this.popUpCollection = [];
    }

    bindGlossaryCallBacks(props) {
      const bookDiv = props.isPxeContent ? props.node.contentDocument.body : document.getElementById(props.bookDiv);
      let glossaryurl = '';
      GlossaryPopUpClasses.some((classes) => {
        if (bookDiv.querySelectorAll(classes).length > 0 ) {
          glossaryurl = bookDiv.querySelectorAll(classes)[0].href ? bookDiv.querySelectorAll(classes)[0].href.split('#')[0] : bookDiv.querySelectorAll(classes)[0].parentElement.href.split('#')[0];
          return true;
        }
      });
      console.log(glossaryurl)
      if (glossaryurl) {
        PopupApi.getData(glossaryurl).then((response) => {
          return response.text();
        }).then((text) => {
          props.divGlossaryRef.innerHTML = text;
          GlossaryPopUpClasses.forEach((classes) => {
            bookDiv.querySelectorAll(classes).forEach((item) => {
              let glossaryNode = '';
              const popOverCollection = {};
              switch (classes) {
              case 'dfn.keyword':
                {
                  glossaryNode = document.getElementById(item.parentElement.hash.replace('#', ''));
                  break;
                }
              case 'a.keyword':
              case 'a.noteref':
                {
                  glossaryNode = document.getElementById(item.hash.replace('#', ''));
                  break;
                }
              case 'dfn.reminder':
                {
                  const id = item.hash ? item.hash.replace('#', '') : item.parentElement.hash.replace('#', '');
                  glossaryNode = document.getElementById(id);
                  break;
                }
              }

              popOverCollection.popOverTitle = glossaryNode ? glossaryNode.getElementsByTagName('dfn')[0].textContent: '';
              popOverCollection.popOverDescription = glossaryNode ? renderHTML(glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML) : '';
              this.popUpCollection.push({'popOverCollection' : popOverCollection, 'item' : item});
              //new PopUps({'popOverCollection' : popOverCollection, 'item' : item, 'bookDiv' : props.bookDiv});
              console.log(item)
            });
          });
          if (props.ParagraphNumeroUno) {
            window.renderCustomPopUp({'popUpCollection' : this.popUpCollection, 'bookId' : props.bookDiv, ParagraphNumeroUno : props.ParagraphNumeroUno});
            /*new CustomPopUp({'popUpCollection' : this.popUpCollection, 'bookId' : props.bookDiv, ParagraphNumeroUno : props.ParagraphNumeroUno});*/
          } else {
            new PopUpInfo({'popUpCollection' : this.popUpCollection, 'bookId' : props.bookDiv, node:props.node});
          }
          
        }).catch((err) => {
          console.debug(err);
        });
      }
    }
}

