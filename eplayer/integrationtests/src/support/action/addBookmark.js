/**
 * Create the Bookmark
 * @param  {Function} done    Function to execute when finished
 */
module.exports = (done) => {
	
    if(browser.isVisible('.unfilled')){

        browser.click('.bookmarkIcon');
        
      }

    done();
};