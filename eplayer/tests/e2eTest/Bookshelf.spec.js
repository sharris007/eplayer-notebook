var assert = require('assert');
var request = require('request');

describe('BookShelf', function(){
   /*For Normal Login*/
   
	/*it('should let you log in', function () {  

      browser.url('/eplayer/login');

      browser.setValue('form input[name="loginname"]', 'amit_qa_edu2');
      browser.setValue('form input[name="password"]', 'Pa55word');
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");
      
      browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");

      });*/
     /*For Standalone Bookshelf*/
	it('should let luach the standalone bookshelf',function(){

    	browser.url('/eplayer/bookshelf?eT1StandaloneBkshf=Y&sessionid=8753852234725456492016&piToken=dummypiToken&identityId=10315477');
    	browser.waitForExist('#bookshelf', 50000);
        console.log("Bookshelf Found");
	});

	it('should refresh the bookshelf', function() {

      browser.refresh();

      browser.waitForVisible('#bookshelf', 50000);
      console.log("refresh pass.");


    });

    it('should click on any book', function() {

      browser.click('p*=QA Title');
      
      console.log("Clicked on book");

      browser.waitForVisible('#docViewer_ViewContainer_AnnotCanvas', 60000);
      console.log("Book loaded");


    });

    
    it('should click on back button to go bookshelf', function() {

      browser.click('.back_rec');
      console.log("Clicked on back button");

      browser.waitForVisible('#bookshelf', 50000);
      console.log("Bookshelf found");

    });

    it('should be able to logout from Bookshelf ', function() {


      browser.click('.signoutBtn>div>button');
      console.log("Clicked on logout button");

      browser.waitForVisible('input[id="username"]', 50000);
      console.log("Back to login page");

          
    });

})