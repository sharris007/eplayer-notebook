var assert = require('assert');
var request = require('request');
import { LOGIN_NAME, LOGIN_PASSWORD, BOOK_NAME, NOTES_TEXT, SEARCH_TEXT} from './testConstant'
import { bookConstants } from './testConstant';
describe('Book',function(){
   /*For Normal Login*/
  /*Book #1: Logging in to the App and lauching the book with some specific title*/
  it('should let you log in and launch the book', function () {  

      browser.waitForExist('form input[name="loginname"]',bookConstants.WAIT);

      browser.setValue('form input[name="loginname"]', bookConstants.LOGIN_NAME);
      browser.setValue('form input[name="password"]', bookConstants.LOGIN_PASSWORD);
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");
      
      browser.waitForExist('#bookshelf', bookConstants.WAIT);
      console.log("Bookshelf Found");

       browser.click(`p*=${bookConstants.BOOK_NAME}`);
      
      console.log("Clicked on book");

      browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas', bookConstants.WAIT);
      console.log("Book loaded");


    });

   /* For Standalone Bookshelf*/
  /*  it('should let launch the book from standalone bookshelf',function(){

      //browser.url('/eplayer/bookshelf?eT1StandaloneBkshf=Y&sessionid=8753852234725456492016&piToken=dummypiToken&identityId=10315477');
      browser.waitForExist('#bookshelf', 50000);
      console.log('testConstant.BOOK_NAME'+BOOK_NAME);
      console.log("Bookshelf Found");

      browser.click(`p*=${BOOK_NAME}`);
      console.log("Clicked on book");

      browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas', 60000);
      console.log("Book loaded");
  

    });*/
    /*Book #2: Checking the TOC content*/
     it('should click on TOC', function() {

      browser.click('.icon-white:nth-child(2)');
      console.log("Clicked on TOC");

      browser.waitForExist('.bookTitleAndTabs', bookConstants.WAIT);
      console.log("Header title appeared");

      browser.waitForExist(".list-group",bookConstants.WAIT);
      console.log("TOC content is visible");

      browser.click('.drawerWrap');
      browser.waitForVisible('div[id=docViewer_ViewContainer_PageContainer_0]>img', bookConstants.WAIT);


    });

    /*it('should click on first TOC entry', function() {
     
      browser.waitForExist('.list-group-item.toc-parent',1000);
      browser.click('.list-group-item.toc-parent');
      console.log("Clicked on expandable button");

      browser.waitForVisible('.list-group-item.toc-child:nth-child(1)', 50000);

      browser.click('.list-group-item.toc-child:nth-child(1)');
      console.log('Click on TOC child entry');

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Page 2 appeared");


    });
*//*
     it('should click on Bookmarks tab', function() {


      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks tab");

      browser.waitForExist('.o-bookmark-empty-message', 50000);
      console.log("No Bookmark found");
      
      browser.click('.drawerWrap');
      browser.waitForVisible('div[id=docViewer_ViewContainer_PageContainer_0]>img', 10000);


    });
*/
    /*Book #3: Creating the bookmark on the first page if it is not bookmarked already*/
    it('should add a Bookmark', function() {

      browser.waitForExist('.bookmarkIcon',bookConstants.WAIT);
      if(browser.isVisible('.unfilled')){

        browser.click('.bookmarkIcon');
        console.log("Clicked on bookmarks icon");
       
      }
       browser.waitForVisible('.filled',bookConstants.WAIT);
       console.log("Bookmark has been created");

    });
      
    /*Book #4: deleting the bookmark on the first page from header*/
    it('should remove the Bookmark from header', function() {

     
      browser.click('.filled');
      console.log("Clicked on bookmarks icon");

      browser.waitForVisible('.unfilled', bookConstants.WAIT);
      console.log("Bookmark has been deleted");

    });

    /*Book #4: deleting the bookmark on the first page from drawer's bookmark panel*/
    it('should remove the Bookmark from drawer component', function() {


      browser.click('.unfilled');
      console.log("Clicked on bookmarks icon");

      browser.waitForVisible('.filled', bookConstants.WAIT);
      console.log("New Bookmark has been created");

      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');
        
      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks tab");

      browser.moveToObject('.o-bookmark-date',0,0);

      browser.waitForVisible('.remove',bookConstants.WAIT);
      browser.click('.remove');
      console.log('clicked on remove icon');

      browser.waitForExist('.deleteBtn',bookConstants.WAIT); 
      browser.click('.deleteBtn');
      console.log('clicked the deleteBtn');
      console.log('Bookmark removed successfully');

      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC');

      browser.waitForVisible('div[id=docViewer_ViewContainer_PageContainer_0]>img',bookConstants.WAIT);

      browser.waitForVisible('.unfilled',bookConstants.WAIT);
      console.log('Bookmark removed');

    });

    /*Book #5: Creating notes*/ 
    it('should create an annotation', function() {

      browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas',bookConstants.WAIT);

      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 
          bookConstants.START_OFFSET_X,bookConstants.START_OFFSET_Y);
      browser.buttonDown();
      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 
          bookConstants.END_OFFSET_X,bookConstants.END_OFFSET_Y);
      browser.buttonUp();
       
      console.log(' Area Selected');

      browser.waitForExist('#highlight-note-form',bookConstants.WAIT);
      browser.click('#color-button-yellow');

      browser.waitForExist('.annotator-panel-2',bookConstants.WAIT);
      browser.click('.annotator-item')
      browser.setValue('#note-text-area',bookConstants.NOTES_TEXT);

      browser.waitForVisible('#save-annotation',bookConstants.WAIT);
      browser.waitForEnabled('#save-annotation',bookConstants.WAIT);
      browser.click('#save-annotation');

      browser.waitForVisible('.annotator-handle',bookConstants.WAIT,true);
      console.log('Note has been created');
       

    });

    /*Book #6: Checking the previoulsy created note in the drawer's notes panel*/ 
    it('should check the note created inside drawer component', function(){
      
      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');

      browser.waitForExist('.bookTitleAndTabs',bookConstants.WAIT);
      browser.click('#notes');
      console.log('clicked on the notes tab');

      browser.waitForVisible(`p*=${bookConstants.NOTES_TEXT}`,bookConstants.WAIT);
      console.log('note created is present in the drawer');
      
      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC');
      browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas',bookConstants.WAIT);

     })
     
    /*Book #7: Deleting the note from the page*/
    it('should delete note from UI', function(){

      /*browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 
          bookConstants.START_OFFSET_X,bookConstants.START_OFFSET_Y);
      browser.buttonDown();
      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 
          bookConstants.END_OFFSET_X,bookConstants.END_OFFSET_Y);
      browser.buttonUp();*/
      browser.click('.annotator-handle')
      browser.waitForExist('#deleteIcon',bookConstants.WAIT);
      browser.click('#deleteIcon');

      browser.waitForExist('#ann-confirm-del',bookConstants.WAIT);
      browser.click('#ann-confirm-del');

      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');

      browser.waitForExist('.bookTitleAndTabs',bookConstants.WAIT);
      browser.click('#notes');
      console.log('clicked on the notes tab');

      browser.waitForVisible(`p*=${bookConstants.NOTES_TEXT}`,bookConstants.WAIT, true);
      console.log('note is deleted');
      
      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC');
       
     });

     /*it('should delete the annotation from drawer',function(){

       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 100,200);
       browser.buttonDown();
       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 500,400);
       browser.buttonUp();
       
       console.log(' Area Selected');

       browser.waitForExist('#highlight-note-form',50000);
       browser.click('#color-button-yellow');
       browser.waitForExist('.annotator-panel-2',10000);
       browser.click('.annotator-item');
       browser.setValue('#note-text-area',NOTES_TEXT);
       browser.waitForEnabled('#save-annotation',20000);
       browser.click('#save-annotation');
       browser.waitForVisible('#highlight-note-form',10000,true);
       console.log('Note has been created');

       browser.click('.icon-white:nth-child(2)');
       console.log('clicked on the drawer component');

       browser.waitForExist('.bookTitleAndTabs',5000);
       browser.click('#notes');
       console.log('clicked on the notes tab');

       browser.waitForVisible('p*=automation test',5000);
       browser.moveToObject('.note-date',0,0);

       browser.waitForVisible('.//a[@aria-label="Remove note"]',10000);
       browser.click('.//a[@aria-label="Remove note"]');
       console.log('clicked on remove icon');

       browser.waitForExist('.deleteBtn',10000); 
       browser.click('.deleteBtn');
       console.log('clicked the deleteBtn');

       browser.waitForExist('p*='+NOTES_TEXT,5000,true);
       browser.click('.drawerWrap');
       console.log('click drawerWrap to close the TOC');

     
      
     });*/
    /*Book #7: Checking the next page navigation*/
    it('should click next page', function() {

      browser.click('.nextSection.section');
      console.log("Clicked on next page");

       browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', bookConstants.WAIT);
      console.log("Next page appeared");


    });

    /*Book #8: Checking the previous page navigation*/
    it('should click previous page', function() {

      browser.click('.prevSection.section');
      console.log("Clicked on previous page");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', bookConstants.WAIT);
      console.log("previous page appeared");


    });

    /*Book #9: Searching for an secific text*/
    it('should filter search text and give the result', function() {


      browser.click('.icon-white.searchIcon');
      console.log("Clicked on Search Icon.");
      
      browser.waitForVisible('.searchCompContainer',bookConstants.WAIT);
      console.log('search container is visible');

      browser.waitForVisible('.search__no-results',bookConstants.WAIT);
      console.log('no result found for empty search');

       browser.click('#search__input');
      console.log("Clicked on search area");

      browser.setValue('input[id="search__input"]', bookConstants.SEARCH_TEXT);
      console.log("Set the value as school");

      browser.waitForVisible('div[class=search__results]>ul>ul>li:nth-child(2)', bookConstants.WAIT);
      console.log("Search list appeared");

    });

    /*Book #10: Checking for zoom button*/
    it('should check if Zoom button is clickable', function() {

      browser.click('.icon-white.prefIcon');
      console.log("Clicked on Zoom button");
      
      browser.waitForVisible('.fontPane', bookConstants.WAIT);
      console.log("Zoom button appeared");

      browser.click('.icon-white.prefIcon');
      console.log('Zoom panel closed');

      //browser.doubleClick('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/ul/li');
      //console.log("Zoom button appeared");

    });

    /*Book #11: Creating a highlight*/
    it('should create a highlight', function() {
       
      browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas',bookConstants.WAIT);

      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 
          bookConstants.START_OFFSET_X,bookConstants.START_OFFSET_Y);
      browser.buttonDown();
      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 
          bookConstants.END_OFFSET_X,bookConstants.END_OFFSET_Y);
      browser.buttonUp();
       
      console.log(' Area Selected');

      browser.waitForExist('#highlight-note-form',bookConstants.WAIT);
      browser.click('#color-button-green');
      browser.waitForExist('.fwr-highlight-annot',bookConstants.WAIT);

       console.log('highlight has been created');
    });

    /*Book #12: Delete the higlight from drawer*/
    it('should delete the highlight from drawer',function(){

       browser.click('.icon-white:nth-child(2)');
       console.log('clicked on the drawer component');

       browser.waitForExist('.bookTitleAndTabs',bookConstants.WAIT);
       browser.click('#notes');
       console.log('clicked on the notes tab'); 
       browser.moveToObject('.note-date',0,0);

       browser.waitForVisible('.//a[@aria-label="Remove note"]',bookConstants.WAIT);
       browser.click('.//a[@aria-label="Remove note"]');
       console.log('clicked on remove icon');

       browser.waitForExist('.deleteBtn',bookConstants.WAIT); 
       browser.click('.deleteBtn');
       console.log('clicked the deleteBtn');

       browser.click('.drawerWrap');
       console.log('click drawerWrap to close the TOC');

       browser.waitForVisible('.fwr-highlight-annot',bookConstants.WAIT,true);
       console.log('highlight has been deleted');

     });

    /*Book #13: Delete the higlight from drawer*/
    it('should refresh the page', function() {
      browser.refresh();
      browser.waitForExist('div[id=docViewer_ViewContainer_PageContainer_0]>img', bookConstants.WAIT);
      console.log("refresh pass.");


    });
    
    /*Book #14: Checking the back button in the header*/
    it('should click on back button to go bookshelf', function() {

      browser.click('.back_rec');
      console.log("Clicked on back button");

      browser.waitForExist('#bookshelf', bookConstants.WAIT);
      console.log("Bookshelf found");

      browser.click(`p*=${bookConstants.BOOK_NAME}`);
      
      console.log("Clicked on book");

      browser.waitForExist('div[id=docViewer_ViewContainer_PageContainer_0]>img', bookConstants.WAIT);
      console.log("Book loaded");

    });
    
    /*Book #15: Logging out of the book*/
    it('should be able to logout from Book',function(){
      browser.waitForVisible('.moreIcon',bookConstants.WAIT);
      browser.click('.moreIcon');
      console.log('Clicked More menu icon');

      browser.waitForExist('div*=Sign Out',bookConstants.WAIT);
      browser.click('div*=Sign Out');
      console.log('Clicked sign out button');

      browser.waitForExist('input[id="username"]', bookConstants.WAIT);
      console.log("Back to login page");
    })



})