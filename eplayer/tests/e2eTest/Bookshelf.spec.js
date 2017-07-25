var assert = require('assert');
var request = require('request');
import { bookShelfConstants } from './testConstant';
describe('BookShelf', function() {

   /*For Normal Login*/
  /*Bookshelf #1: Logging in to the App*/
	it('should let you log in', function () {  
      browser.waitForExist('form input[name="loginname"]',bookShelfConstants.WAIT);
      
      browser.setValue('form input[name="loginname"]', bookShelfConstants.LOGIN_NAME);
      browser.setValue('form input[name="password"]', bookShelfConstants.LOGIN_PASSWORD);
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");
      
      browser.waitForExist('#bookshelf', bookShelfConstants.WAIT);
      console.log("Bookshelf Found");

      });
     /*For Standalone Bookshelf*/
	/*it('should let luach the standalone bookshelf',function(){

    	browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");
	});
*/
  /*Bookshelf #2: Checking the session persistence by refreshing the bookshelf*/
	it('should refresh the bookshelf', function() {

      browser.refresh();

      browser.waitForExist('#bookshelf', bookShelfConstants.WAIT);
      console.log("refresh pass.");
    });

    /*Bookshelf #3: Logging out of the bookshelf*/
    it('should be able to logout from Bookshelf ', function() {


      browser.click('.signoutBtn>div>button');
      console.log("Clicked on logout button");

      browser.waitForExist('input[id="username"]', bookShelfConstants.WAIT);
      console.log("Back to login page");

          
    });

})