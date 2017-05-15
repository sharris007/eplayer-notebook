var assert = require('assert');
var request = require('request');

describe('LoginPage', function() {


   it('should not let you log in with correct Username and wrong password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', 'amit_qa_edu1');
      browser.setValue('input[name="password"]', 'Pa55word111');
      console.log("Username and password Entered");

      browser.submitForm('input[name="loginname"]');
      console.log("Logging with wrong password");

      browser.waitForExist('.errorClass', 50000);
      console.log("Invalid Username or Password entered.");

      browser.pause(5000);

      });

      it('should not let you log in with blank Username and password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', '');
      browser.setValue('input[name="password"]', '');
      console.log("Username and password");

      browser.submitForm('input[name="loginname"]');
      console.log("Logging in with blank credentials");

      browser.waitForExist('.errorClass', 50000);
      console.log("Invalid Username or Password entered.");

      browser.pause(5000);

      });

      it('should not let you log in with blank Username and correct password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', '');
      browser.setValue('input[name="password"]', 'Pa55word');
      console.log("Username and password");

      browser.submitForm('input[name="loginname"]');
      console.log("Logged in");

      browser.waitForExist('.errorClass', 50000);
      console.log("Invalid Username or Password entered.");

      browser.pause(5000);

      });


      it('should not let you log in with wrong Username and wrong password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', 'xxxxxxx');
      browser.setValue('input[name="password"]', 'Pa55wordss');
      console.log("Username and password");

      browser.submitForm('input[name="loginname"]');
      console.log("Logged in");

      browser.waitForExist('.errorClass', 50000);
      console.log("Invalid Username or Password entered.");

      browser.pause(5000);

      });

      
    it('should let you log in with correct Username and correct Password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('form input[name="loginname"]', 'amit_qa_edu1');
      browser.setValue('form input[name="password"]', 'Pa55word');
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");

      browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");

      browser.pause(10000);

      });

    it('should click on book "Activate"', function() {


      browser.click('div[id=bookshelf]>div>div:nth-child(5)>a:nth-child(1)>p');
      console.log("Clicked on book Activate");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 60000);
      console.log("Book loaded");

      browser.pause(5000);

    });


    it('should click on TOC', function() {

      browser.click('div[id=root]>div:nth-child(1)>div>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span>svg');
      console.log("Clicked on TOC");

      browser.waitForVisible('.header-title', 50000);
      console.log("Header title appeared");

      browser.pause(5000);
      

    });

    it('should click on Time to revise 1', function() {


      browser.click('div[id=toc]>ul>li:nth-child(4)');
      console.log("Clicked on Time to revise 1");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Pagw 28 appeared");

      browser.pause(5000);


    });

    it('should click next page', function() {


      browser.click('div[id=viewer]>div:nth-child(1)>div:nth-child(5)>div>div>div');
      console.log("Clicked on next page");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
      console.log("Pagw 29 appeared");

      browser.pause(5000);

    });

    it('should click on Bookmarks', function() {


      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks icon");

      browser.waitForVisible('ul[class=o-bookmark-list]>li:nth-child(3)', 50000);
      console.log("Bookmarks 10 found");

      browser.pause(5000);

    });

    it('should click on Page 10 Bookmarks', function() {


      browser.click('ul[class=o-bookmark-list]>li:nth-child(3)');
      console.log("Clicked on Page 10 bookmarks");

       browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 50000);
       console.log("Page 10 appeared");

       browser.pause(5000);

       browser.click('div[class=drawerWrap]>div:nth-child(1)');
       console.log("Clicked on Book to close the TOC");

       browser.pause(5000);

    });

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

    it('should add bookmark, verify and remove while clicking on bookmark icon', function() {

      //browser.click(".headerBar>div>div>div>.bookmarkIcon");
      browser.click(".bookmarkIcon");
      console.log("Clicked on bookmark icon to add");

      browser.pause(10000);

      browser.click('div[id=root]>div:nth-child(1)>div>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span>svg');
      console.log("Clicked on TOC");

      browser.waitForVisible('.header-title', 50000);
      console.log("Header title appeared");

      browser.pause(5000);

      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks");
      
      browser.pause(5000);

      browser.waitForVisible('ul[class=o-bookmark-list]>li:nth-child(3)', 50000);
      console.log("Bookmarks 6 found");

      browser.click('div[class=drawerWrap]>div:nth-child(1)');
      console.log("Clicked on Book to close the TOC");

      browser.pause(5000);

      browser.click(".bookmarkIcon");
      console.log("Clicked on bookmark icon to remove");

      browser.pause(5000);

      browser.click('div[id=root]>div:nth-child(1)>div>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span>svg');
      console.log("Clicked on TOC");

      browser.waitForVisible('.header-title', 50000);
      console.log("Header title appeared");

      browser.pause(5000);


      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks");
      
      browser.pause(5000);

      browser.waitForVisible('ul[class=o-bookmark-list]>li:nth-child(3)', 50000);
      console.log("Bookmarks 6 has removed");

      browser.click('div[class=drawerWrap]>div:nth-child(1)');
      console.log("Clicked on Book to close the TOC");

      browser.pause(5000);






    });

    /*it('should perform delete bookmark by clicking on delete button', function() {

      browser.click(".bookmarkIcon");
      console.log("Clicked on bookmark icon to add");

      browser.pause(10000);

      browser.click('div[id=root]>div:nth-child(1)>div>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>span>svg');
      console.log("Clicked on TOC");

      browser.waitForVisible('.header-title', 50000);
      console.log("Header title appeared");

      browser.pause(5000);

      browser.click('button[id=bookmarks]');
      console.log("Clicked on bookmarks");
      
      browser.pause(5000);

      browser.waitForVisible('ul[class=o-bookmark-list]>li:nth-child(3)', 50000);
      console.log("Bookmarks 6 found");

      browser.click('.o-bookmark-list>li:nth-child(2)>a:nth-child(2)');
      console.log("Clicked on delete button");

      browser.waitForVisible('.deleteBtn', 50000);
      console.log("Delete pop-up found");

      browser.pause(5000);

      browser.click('.deleteBtn');
      console.log("Clicked on delete link");

      browser.waitForVisible('ul[class=o-bookmark-list]>li:nth-child(2)', 50000);
      console.log("Bookmark page 6 removed");

      browser.pause(5000);


      browser.click('div[class=drawerWrap]>div:nth-child(1)');
      console.log("Clicked on Book to close the TOC");

      browser.pause(5000);

    });*/

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
      console.log("refresh fail pass.");

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

      browser.waitForVisible('input[name="loginname"]', 50000);
      console.log("Back to login page");

       browser.pause(5000);
          
    });






  });

