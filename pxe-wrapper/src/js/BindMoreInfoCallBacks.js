import {MoreInfoPopUpClasses} from '../../const/PopUpClasses';

export class BindMoreInfoCallBacks {
    constructor(props) {
      if (props.glossaryCollection && props.glossaryCollection.length > 0) {
        this.popUpCollection = props.glossaryCollection;
      } else {
        this.popUpCollection = [];
      }
      this.bindMoreInfoCallBacks(props);
    }

    bindMoreInfoCallBacks(props) {
      const bookDiv = document.getElementById(props.bookDiv);
      MoreInfoPopUpClasses.forEach((classes) => {
        bookDiv.querySelectorAll(classes).forEach((item) => {
          const popOverCollection = {};
          const moreInfoIconDOM = item.parentElement;
          let hrefId = '';
          switch (classes) {
          case '.lc_ec_aside' : {
            hrefId =  moreInfoIconDOM.href ? moreInfoIconDOM.href.split('#')[1] : item.href.split('#')[1];
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
            hrefId = moreInfoIconDOM.children[0].href.split('#')[1];
            break;
          }           
          }
          if (hrefId) {
            popOverCollection.popOverDescription = document.getElementById(hrefId).getElementsByTagName('p')[0].innerHTML;
          }
          this.popUpCollection.push({'popOverCollection' : popOverCollection, 'item' : item});
        });
      });
      console.log(this.popUpCollection)
      window.renderPopUp(this.popUpCollection);
    }
}
