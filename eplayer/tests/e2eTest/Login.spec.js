var assert = require('assert');
var request = require('request');
import { loginConstants } from './testConstant';


describe('LoginPage', function() {

   /*Login #1: Trying to login with incorreact password*/
   it('should not let you log in with correct Username and wrong password', function () {  
            browser.waitForExist('form input[name="loginname"]',loginConstants.WAIT);

            browser.setValue('input[name="loginname"]', loginConstants.LOGIN_NAME);
            browser.setValue('input[name="password"]', 'Pa55word111');
            console.log("Username and password Entered");

            browser.submitForm('input[name="loginname"]');
            console.log("Logging with wrong password");

            browser.waitForExist('.errorClass', loginConstants.WAIT);
            console.log("Invalid Username or Password entered.");


      });
       
      /*Login #2: Trying to login with blank fields*/
      it('should not let you log in with blank Username and password', function () {  

            browser.setValue('input[name="loginname"]', '');
            browser.setValue('input[name="password"]', '');
            console.log("Username and password");

            browser.submitForm('input[name="loginname"]');
            console.log("Logging in with blank credentials");

            browser.waitForExist('.errorClass', loginConstants.WAIT);
            console.log("Invalid Username or Password entered.");

      });
 
      /*Login #3: Trying to login with incorrect credentials*/
      it('should not let you log in with wrong Username and wrong password', function () {  
            browser.setValue('input[name="loginname"]', 'xxxxxxx');
            browser.setValue('input[name="password"]', 'Pa55wordss');
            console.log("Username and password");

            browser.submitForm('input[name="loginname"]');
            console.log("Logged in");

            browser.waitForExist('.errorClass', loginConstants.WAIT);
            console.log("Invalid Username or Password entered.");
      });

      /*Login #4: Trying to login with correct credentials*/
      it('should let you log in with correct Username and correct Password', function () {  

            browser.setValue('form input[name="loginname"]', loginConstants.LOGIN_NAME);
            browser.setValue('form input[name="password"]', loginConstants.LOGIN_PASSWORD);
            console.log("Username and password");

            browser.submitForm('form input[name="loginname"]');
            console.log("Logged in");
    
            browser.waitForExist('#bookshelf', loginConstants.WAIT);
            console.log("Bookshelf Found");

      });
  });

