var assert = require('assert');
var request = require('request');

describe('Book',function(){
   /*For Normal Login*/

  /*it('should let you log in and launch the book', function () {  

      browser.url('/eplayer/login');

      browser.setValue('form input[name="loginname"]', 'amit_qa_edu2');
      browser.setValue('form input[name="password"]', 'Pa55word');
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");
      
      browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");

       browser.click('p*=teacher');
      
      console.log("Clicked on book");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 60000);
      console.log("Book loaded");


    });*/

   /* For Standalone Bookshelf*/

    it('should let launch the book from standalone bookshelf',function(){

      browser.url('/eplayer/bookshelf?eT1StandaloneBkshf=Y&sessionid=8753852234725456492016&piToken=dummypiToken&identityId=10315477');
      browser.waitForExist('#bookshelf', 50000);
        console.log("Bookshelf Found");

        browser.click('p*=Comprehensive Health Insurance');
      
        console.log("Clicked on book");

        browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 60000);
        console.log("Book loaded");
  

    });

     it('should click on TOC', function() {

      browser.click('.icon-white:nth-child(2)');
      console.log("Clicked on TOC");

      browser.waitForVisible('.bookTitleAndTabs', 50000);
      console.log("Header title appeared");

      browser.waitForExist(".list-group",10000);
      console.log("TOC content is visible");

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
*/
     it('should click on Bookmarks tab', function() {


      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks tab");

      browser.waitForExist('.o-bookmark-empty-message', 50000);
      console.log("No Bookmark found");
      
      browser.click('.drawerWrap');
      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 10000);


    });

      it('should add a Bookmark', function() {

      browser.waitForVisible('.bookmarkIcon',10000);

      browser.click('.unfilled');
      console.log("Clicked on bookmarks icon");

      browser.waitForExist('.filled', 50000);
      console.log("Bookmark has been created");

    });


     it('should check for the new bookmark in the drawer ', function(){
        browser.click('.icon-white:nth-child(2)');
        console.log('clicked on the drawer component');
        
        browser.click('button[id=bookmarks]');
        console.log("Clicked on bookmarks tab");

        browser.waitForVisible('.o-bookmark-content' , 50000);
        console.log('Bookmark added successfully');

      });

      it('should remove the Bookmark from header', function() {

      
      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC'); 

      browser.click('.filled');
      console.log("Clicked on bookmarks icon");

      browser.waitForExist('.unfilled', 50000);
      console.log("Bookmark has been deleted");

      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');
        
      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks tab");

      browser.waitForExist('.o-bookmark-empty-message',10000);
      console.log('Bookmark removed successfully');

      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the drawer');

    });

    it('should remove the Bookmark from drawer component', function() {


      browser.click('.unfilled');
      console.log("Clicked on bookmarks icon");

      browser.waitForExist('.filled', 50000);
      console.log("New Bookmark has been created");

      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');
        
      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks tab");

      browser.moveToObject('.o-bookmark-date',0,0);

      browser.waitForExist('.remove',10000);
      browser.click('.remove');
      console.log('clicked on remove icon');

      browser.waitForExist('.deleteBtn',10000); 
      browser.click('.deleteBtn');
      console.log('clicked the deleteBtn');

       browser.waitForExist('.o-bookmark-empty-message',10000);
      console.log('Bookmark removed successfully');

      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC');

      browser.waitForExist('.unfilled',10000);
      console.log('Bookmark removed');

    });


     
     it('should create an annotation', function() {

       browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas',50000);
       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 100,200);
       browser.buttonDown();
       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 500,400);
       browser.buttonUp();
       
       console.log(' Area Selected');

       browser.waitForExist('#highlight-note-form',50000);
       browser.click('#color-button-yellow');
       browser.waitForExist('.annotator-panel-2',10000);
       browser.click('.annotator-item')
       browser.setValue('#note-text-area','automation test');
       browser.waitForVisible('#save-annotation',10000);
       browser.pause(10000);
       browser.click('#save-annotation');
       browser.waitForVisible('#highlight-note-form',10000,true);
       console.log('Note has been created');
       

    });

     it('should check the note created inside drawer component', function(){
      
      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');

      browser.waitForExist('.bookTitleAndTabs',5000);
      browser.click('#notes');
      console.log('clicked on the notes tab');

      browser.waitForVisible('p*=automation test',5000);
      console.log('note created is present in the drawer');
      
      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC');
      browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas',10000);

     })

     it('should delete note from UI', function(){

      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 100,200);
      browser.buttonDown();
      browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 500,400);
      browser.buttonUp();
      browser.waitForExist('#deleteIcon',10000);
      browser.click('#deleteIcon');

      browser.waitForExist('#ann-confirm-del',10000);
      browser.click('#ann-confirm-del');

      browser.click('.icon-white:nth-child(2)');
      console.log('clicked on the drawer component');

      browser.waitForExist('.bookTitleAndTabs',5000);
      browser.click('#notes');
      console.log('clicked on the notes tab');

      browser.waitForVisible('p*=automation test',5000, true);
      console.log('note is deleted');
      
      browser.click('.drawerWrap');
      console.log('click drawerWrap to close the TOC');
       
     });

     it('should delete the annotation from drawer',function(){

       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 100,200);
       browser.buttonDown();
       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 500,400);
       browser.buttonUp();
       
       console.log(' Area Selected');

       browser.waitForExist('#highlight-note-form',50000);
       browser.click('#color-button-yellow');
       browser.waitForExist('.annotator-panel-2',10000);
       browser.click('.annotator-item');
       browser.setValue('#note-text-area','automation test');
       browser.pause(5000);
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

       browser.waitForExist('p*=automation test',5000,true);
       browser.click('.drawerWrap');
       console.log('click drawerWrap to close the TOC');

     
      
     });


    it('should filter search text and give the result', function() {


      browser.click('.icon-white.searchIcon');
      console.log("Clicked on Search Icon.");
      
      browser.waitForVisible('.searchCompContainer',10000);
      console.log('search container is visible');

      browser.waitForVisible('.search__no-results',10000);
      console.log('no result found for empty search');

       browser.click('#search__input');
      console.log("Clicked on search area");

      browser.setValue('input[id="search__input"]', 'school');
      console.log("Set the value as school");

      browser.waitForVisible('div[class=search__results]>ul>ul>li:nth-child(2)', 50000);
      console.log("Search list appeared");

      browser.click('div[class=search__results]>ul>ul>li:nth-child(2)');
      console.log("Clicked on 2nd result");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Result page appeared");


    });

     it('should click next page', function() {

      browser.click('.nextSection.section');
      console.log("Clicked on next page");

       browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Next page appeared");


    });


    it('should check if Zoom button is clickable', function() {

      browser.click('.icon-white.prefIcon');
      console.log("Clicked on Zoom button");
      
      browser.waitForVisible('.fontPane', 50000);
      console.log("Zoom button appeared");

      //browser.doubleClick('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/ul/li');
      //console.log("Zoom button appeared");

    });

     it('should refresh the page', function() {
      browser.refresh();
      browser.waitForVisible('div[id=docViewer_ViewContainer_PageContainer_0]>img', 50000);
      console.log("refresh pass.");


    });

    it('should be able to logout from Book',function(){
        browser.waitForVisible('.moreIcon',10000);
      browser.click('.moreIcon');
      console.log('Clicked More menu icon');

      browser.waitForExist('div*=Sign Out',10000);
      browser.click('div*=Sign Out');
      console.log('Clicked sign out button');

        browser.waitForExist('input[id="username"]', 50000);
        console.log("Back to login page");
    })



})