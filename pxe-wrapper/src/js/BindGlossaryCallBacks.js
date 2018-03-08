import { GlossaryPopUpClasses } from '../../const/PopUpClasses';
import PopupApi from '../api/PopupApi';
import { BindMoreInfoCallBacks } from './BindMoreInfoCallBacks';
import replaceAllRelByAbs from './ConstructUrls';

export class BindGlossaryCallBacks {
  constructor(props) {
    this.glossaryCollection = [];
    this.noteRefCollection = props.noteRefCollection;
    this.glossayStatus = '';
    this.glossaryDoms = [];
    this.glossaryUrlCollection = [];
    this.glossaryurlIndex = 0;
    this.props = props;
    this.bindGlossaryCallBacks(props);
  }

  bindGlossaryCallBacks(props) {
      // console.clear();
    const bookDiv = props.node.contentDocument.body;
    this.glossaryDoms = [];
    this.glossaryUrlCollection = [];
    this.glossaryurlIndex = 0;
    GlossaryPopUpClasses.forEach((classes) => {
      if (bookDiv.querySelectorAll(classes).length > 0) {
          this.glossaryDoms = bookDiv.querySelectorAll(classes);
          for (let i = 0; i < this.glossaryDoms.length; i++) {
            if (bookDiv.querySelectorAll(classes)[i].href) {
              this.glossaryUrlCollection.push(bookDiv.querySelectorAll(classes)[i].href.split('#')[0]);
            } else if (bookDiv.querySelectorAll(classes)[i].parentElement && bookDiv.querySelectorAll(classes)[i].parentElement.href) {
              this.glossaryUrlCollection.push(bookDiv.querySelectorAll(classes)[i].parentElement.href.split('#')[0]);
            } else {
              console.log('Error in glossary URL');
            }
          }
          console.log('this.glossaryDoms : - ', this.glossaryDoms);
        }
    });
    if (this.glossaryUrlCollection.length > 0) {
      this.triggerGlossaryService(this.glossaryUrlCollection[this.glossaryurlIndex]);
    } else {
      new BindMoreInfoCallBacks({ glossaryCollection: this.noteRefCollection, node: props.node });
    }
  }

  triggerGlossaryService = (glossaryurl) => {
    PopupApi.getData(glossaryurl).then((response) => {
      this.glossayStatus = response.status;
      return response.data;
    }).then(this.renderData).catch((err) => {
        console.debug(err);
      });
  }

  renderData = (text) => {
    if (this.glossayStatus && this.glossayStatus === 404) {
      console.log('Error : - ', this.glossaryUrlCollection[this.glossaryurlIndex], 'this.glossaryurlIndex :- ', this.glossaryurlIndex, 'text :-', text);
      this.glossaryurlIndex++;
      this.triggerGlossaryService(this.glossaryUrlCollection[this.glossaryurlIndex]);
    } else {
      console.log('Working : - ', 'this.glossaryurlIndex :- ', this.glossaryurlIndex, this.glossaryUrlCollection[this.glossaryurlIndex]);
      this.glossaryCollection = [];
      const bookDiv = this.props.node.contentDocument.body;
      this.props.divGlossaryRef.innerHTML = replaceAllRelByAbs(text, this.props.basePath.substring(0, this.props.basePath.lastIndexOf('/')));
      GlossaryPopUpClasses.forEach((classes) => {
          const bookDivQuerySelectorClasses = bookDiv.querySelectorAll(classes);
          for (let i = 0; i < bookDivQuerySelectorClasses.length; i++) {
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

            popOverCollection.popOverTitle = glossaryNode ? (glossaryNode.getElementsByTagName('dfn').length > 0 ? glossaryNode.getElementsByTagName('dfn')[0].textContent : '') : '';
            let glossaryDesc = '';
            if (bookDivQuerySelectorClasses[i] && bookDivQuerySelectorClasses[i].className && bookDivQuerySelectorClasses[i].className.indexOf('noteref_opener') === -1) {
                if (glossaryNode && glossaryNode.nextElementSibling && glossaryNode.nextElementSibling.getElementsByTagName('p')[0]) {
                  glossaryDesc = glossaryNode.nextElementSibling.getElementsByTagName('p')[0].innerHTML;
                } else if (glossaryNode && glossaryNode.nextElementSibling) {
                  glossaryDesc = glossaryNode.nextElementSibling.innerHTML;
                } 
            }
            popOverCollection.popOverDescription = glossaryDesc;
            if (popOverCollection.popOverTitle && popOverCollection.popOverDescription) {
              this.glossaryCollection.push({ popOverCollection, item: bookDivQuerySelectorClasses[i] });
            } else {
              popOverCollection.popOverTitle = bookDivQuerySelectorClasses[i].innerHTML;
              popOverCollection.popOverDescription = glossaryDesc || '';
              if(glossaryDesc) {
                this.glossaryCollection.push({ popOverCollection, item: bookDivQuerySelectorClasses[i] });
              }              
            }
          }
        });
       for (let n=0;n<this.noteRefCollection.length > 0; n++) {
        this.glossaryCollection[this.glossaryCollection.length] = this.noteRefCollection[n];
        console.log('this.glossaryCollection[this.glossaryCollection.length] ', this.glossaryCollection[this.glossaryCollection.length]);
       } 
      new BindMoreInfoCallBacks({ glossaryCollection: this.glossaryCollection, node: this.props.node });
    }
  }
}
