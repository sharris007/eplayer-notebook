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

       browser.click('p*=Math');
      
      console.log("Clicked on book");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 60000);
      console.log("Book loaded");

      browser.pause(10000);

    });*/

   /* For Standalone Bookshelf*/

    it('should let launch the book from standalone bookshelf',function(){

    	browser.url('/eplayer/bookshelf?eT1StandaloneBkshf=Y&sessionid=8753852234725456492016&piToken=dummypiToken&identityId=10315477');
    	browser.waitForExist('#bookshelf', 50000);
        console.log("Bookshelf Found");

        browser.click('p*=QA Title');
      
        console.log("Clicked on book");

        browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 60000);
        console.log("Book loaded");
  
        browser.pause(10000);


    });

	/*TOC Related Test Cases
*/
  it('should click on TOC', function() {

      browser.click('.icon-white:nth-child(2)');
      console.log("Clicked on TOC");

      browser.waitForVisible('.header-title', 50000);
      console.log("Header title appeared");

      browser.waitForExist(".list-group",10000);
      console.log("TOC content is visible");

      browser.pause(5000);
      

    });

   /* it('should click on first TOC entry', function() {
     
      browser.waitForExist('.list-group-item.toc-parent',1000);
      browser.click('.list-group-item.toc-parent');
      console.log("Clicked on expandable button");

      browser.waitForVisible('.list-group-item.toc-child:nth-child(1)', 50000);

      browser.click('.list-group-item.toc-child:nth-child(1)');
      console.log('Click on TOC child entry');

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Page 2 appeared");

      browser.pause(5000);

    });*/

      it('should click on Bookmarks tab', function() {


      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks tab");

      browser.waitForExist('.o-bookmark-empty-message', 50000);
      console.log("No Bookmark found");
      
      browser.click('.drawerWrap');
      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 10000);

      browser.pause(5000);

    });

      it('should add a Bookmark', function() {

      browser.waitForVisible('.bookmarkIcon',10000);

      browser.click('.unfilled');
      console.log("Clicked on bookmarks icon");

      browser.waitForExist('.filled', 50000);
      console.log("Bookmark has been created");

      browser.pause(5000);

    });


     it('should check for the new bookmark in the drawer ', function(){
        browser.click('.icon-white:nth-child(2)');
        console.log('clicked on the drawer component');
        
        browser.click('button[id=bookmarks]');
        console.log("Clicked on bookmarks tab");

        browser.waitForVisible('.o-bookmark-content' , 50000);
        console.log('Bookmark added successfully');

        browser.pause(5000);

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

      browser.pause(5000);

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

      browser.moveToObject('.o-bookmark-content',0,0);

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

      browser.pause(5000);

    });

   
     it('should click next page', function() {


      browser.click('.nextSection.section');
      console.log("Clicked on next page");

     // browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Page 2 appeared");

      browser.pause(5000);

    });

   /* it('should create an annotation', function() {

       browser.waitForExist('#docViewer_ViewContainer_AnnotCanvas',50000);
       browser.pause(20000);
       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 32.700000,690.600000);
       console.log('First Move to moveToObject');
       browser.buttonDown();
       console.log(' buttonDown');
       browser.moveToObject('div[id=docViewer_ViewContainer_PageContainer_0]>img', 402.400000,590.200000);
       console.log('second Move to moveToObject');
       browser.buttonUp();
        console.log(' buttonUp');
       browser.pause(20000);
       browser.waitForExist('.annotator-panel-1.annotator-panel-triangle',10000);

    });*/

    it('should filter search text and give the result', function() {


      browser.click('div[class=icon-white]');
      console.log("Clicked on Search Icon.");

      browser.pause(5000);

      browser.click('#search__input');
      console.log("Clicked on search area");

      browser.waitForVisible('#search__box', 50000);
      console.log("Search Box found");

      browser.pause(5000);

      browser.setValue('input[id="search__input"]', 'school');
      console.log("Set the value as school");

      browser.waitForVisible('div[class=search__results]>ul>ul>li:nth-child(2)', 50000);
      console.log("Search list appeared");

      browser.pause(10000);

      browser.click('div[class=search__results]>ul>ul>li:nth-child(2)');
      console.log("Clicked on 2nd result");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Result page appeared");

      browser.pause(10000);

    });

    it('should check if Zoom button is clickable', function() {

      browser.click('.icon-white.prefIcon');
      console.log("Clicked on Zoom button");
      
      browser.waitForVisible('.fontPane', 50000);
      console.log("Zoom button appeared");

      //browser.doubleClick('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[2]/div/div/ul/li');
      //console.log("Zoom button appeared");

      browser.pause(5000);
      

    });

     it('should refresh the page', function() {
      browser.refresh();

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("refresh pass.");

      browser.pause(5000);

    });



    it('should click on back button to go bookshelf', function() {

     
       
      browser.click('.back_rec');
      console.log("Clicked on back button");

      browser.waitForVisible('#bookshelf', 50000);
      console.log("Bookshelf found");

      browser.pause(5000);

    });

    it('should click on logout button ', function() {


      browser.click('.signoutBtn>div>button');
      console.log("Clicked on logout button");

      browser.waitForVisible('input[id="username"]', 50000);
      console.log("Back to login page");

       browser.pause(5000);
          
    });

})