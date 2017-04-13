var assert = require('assert');
var request = require('request');

describe('LoginPage', function() {

      
    it('should let you log in', function () {  

      browser.url('/eplayer/login');

      browser.setValue('input[name="loginname"]', 'amit_qa_edu1');
      browser.setValue('input[name="password"]', 'Pa55word');
      console.log("Username and password");

      browser.submitForm('input[name="loginname"]');
      console.log("Logged in");

      browser.waitForExist('.//*[@id="bookshelf"]/div[1]/div[6]/a[1]/img', 50000);
      console.log("Book Found");
      
      browser.click('.//*[@id="bookshelf"]/div[1]/div[6]/a[1]/img');
      console.log("Clicked on book");

      //
      browser.waitForExist('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[1]/div[2]/div/div[4]/div/button', 50000);
      console.log("Button found");

      browser.click('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div/div');
      console.log("Clicked on back button");

      browser.waitForExist('.//*[@id="bookshelf-page"]/div[1]/div[2]/div/button', 50000);
      console.log("Button found");


      browser.click('.//*[@id="bookshelf-page"]/div[1]/div[2]/div/button');
      console.log("Clicked on logout button");

      browser.waitForExist('.//*[@id="root"]/div/div/div/div/div/div[2]/form/div[2]/input', 50000);
      console.log("Back to login Page");

























  






    });


     /*it('should take to Book when click to Book Activate! B1+ Students', function (){
          browser.url('/eplayer/bookshelf');
          browser.click('html/body/div[1]/div/div/div/div/div/div[2]/div/div[1]/div[6]/a[1]');
          browser.waitForExist('html/body/div[1]/div/div/div/div/div/div[1]/div[1]/div[1]/div[2]/div/div[4]/div/button', 50000);
          //browser.click('html/body/div[1]/div/div/div/div/div/div[1]/div[1]/div[1]/div[2]/div/div[4]/div/button');
          //var title = browser.getTitle();
          //assert.equal(title, 'WebdriverIO - API Docs');
      })*/
     
     /*it('should let you log in', function () {  
      browser.url('/eplayer/login');
      browser.setValue('.//*[@id="root"]/div/div/div/div/div/div[2]/form/div[1]/input', 'amit_qa_edu1');
      browser.setValue('.//*[@id="root"]/div/div/div/div/div/div[2]/form/div[2]/input', 'Pa55word');
      browser.submitForm('.//*[@id="root"]/div/div/div/div/div/div[2]/form/div[1]/input').pause(500);
      var pageUrl = browser.getUrl();
    })
*/
      


    /*it('should take to LoginPage when click to Log Out', function (){
          browser.url('/eplayer/bookshelf');
          browser.click('//p[contains(., "Activate")]');

          //var hasButton = browser.isExisting('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[1]/div[2]/div/div[4]/div/button')
          //assert(hasButton);

          //var title = browser.getTitle();
          //assert.equal(title, 'WebdriverIO - API Docs');
      })*/

   

    //it('should have a Button to it from the Bookshelf Page', function (){
      //    browser.url('/eplayer/bookshelf');
        //  var hasButton = browser.isExisting('html/body/div[1]/div/div/div/div/div/div[1]/div[2]/div/button')
          //assert(hasButton);
          // browser.isExisting('a[href="/api.html"]')
      //})

    

    /*it('should have a book with title Child Health Nursing, 2/e ', function () {
        browser.url('http://localhost:3000/eplayer/bookshelf');
        this.timeout(30000);

        var title = browser.getTitle();
        assert.equal(title, 'E-Player Demo');
    })*/


    /*it('should have the right title My Bookshelf ', function () {
        browser.url('/eplayer/bookshelf');
        this.timeout(30000);

        var title = browser.getTitle();
        assert.equal(title, 'E-Player Demo');
    })*/

    /*it('should take you to the Book Activate! B1+ Students Book', function (){
          browser.url('/eplayer/bookshelf');
          browser.click('.//*[@id="bookshelf"]/div[1]/div[6]/a[1]/p/text()');

          var title = browser.getTitle();
          assert.equal(title, 'WebdriverIO - API Docs');
      })

    it('should have a Button for logout', function (){
          browser.url('eplayer/pdfbook/24369');
          var hasButton = browser.isExisting('.//*[@id="root"]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]')
          assert(hasButton);
          // browser.isExisting('a[href="/api.html"]')
      })

    it('should open a popup when click on logout button', function (){
          browser.url('eplayer/pdfbook/24369');
          var hasPopUp = browser.isExisting('html/body/div[5]/div/div/div/div/div/div/span/div/div')
          assert(hasPopUp);
          // browser.isExisting('a[href="/api.html"]')
      })
*/


    /*it('should logout  while cliking on logout button', function (){
          browser.url('/eplayer/pdfbook/24369');
          browser.click('.//*[@id="bookshelf"]/div[1]/div[6]/a[1]/p/text()');

          var title = browser.getTitle();
          assert.equal(title, 'WebdriverIO - API Docs');
      })

    it('should return to login page when click on logout button', function (){
          browser.url('/eplayer/login');
          //browser.click('.//*[@id="bookshelf"]/div[1]/div[6]/a[1]/p/text()');

          var title = browser.getTitle();
          assert.equal(title, 'WebdriverIO - API Docs');
      })
*/






    

});