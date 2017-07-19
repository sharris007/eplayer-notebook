var assert = require('assert');
var request = require('request');
import { LOGIN_NAME, LOGIN_PASSWORD, BOOK_NAME, NOTES_TEXT, SEARCH_TEXT} from './testConstant';
describe('BookShelf', function(){
   /*For Normal Login*/
   
	/*it('should let you log in', function () {  

      browser.url('/eplayer/login');

      browser.setValue('form input[name="loginname"]', LOGIN_NAME);
      browser.setValue('form input[name="password"]', LOGIN_PASSWORD);
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");
      
      browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");

      });*/
     /*For Standalone Bookshelf*/
	it('should let luach the standalone bookshelf',function(){

    	browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");
	});

	it('should refresh the bookshelf', function() {

      browser.refresh();

      browser.waitForExist('#bookshelf', 50000);
      console.log("refresh pass.");


    });


    it('should be able to logout from Bookshelf ', function() {


      browser.click('.signoutBtn>div>button');
      console.log("Clicked on logout button");

      browser.waitForExist('input[id="username"]', 50000);
      console.log("Back to login page");

          
    });

})