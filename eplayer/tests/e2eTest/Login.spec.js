var assert = require('assert');
var request = require('request');
import { LOGIN_NAME, LOGIN_PASSWORD, BOOK_NAME, NOTES_TEXT, SEARCH_TEXT} from './testConstant'


describe('LoginPage', function() {


   it('should not let you log in with correct Username and wrong password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', LOGIN_NAME);
      browser.setValue('input[name="password"]', 'Pa55word111');
      console.log("Username and password Entered");

      browser.submitForm('input[name="loginname"]');
      console.log("Logging with wrong password");

      browser.waitForExist('.errorClass', 50000);
      console.log("Invalid Username or Password entered.");


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

      });

      it('should not let you log in with blank Username and correct password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', '');
      browser.setValue('input[name="password"]', LOGIN_PASSWORD);
      console.log("Username and password");

      browser.submitForm('input[name="loginname"]');
      console.log("Logged in");

      browser.waitForExist('.errorClass', 50000);
      console.log("Invalid Username or Password entered.");


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


      });

     
   it('should let you log in with correct Username and correct Password', function () {  

      browser.url('/eplayer/login');

      browser.setValue('form input[name="loginname"]', LOGIN_NAME);
      browser.setValue('form input[name="password"]', LOGIN_PASSWORD);
      console.log("Username and password");

      browser.submitForm('form input[name="loginname"]');
      console.log("Logged in");
    
      browser.waitForExist('#bookshelf', 50000);
      console.log("Bookshelf Found");

      });
  });

