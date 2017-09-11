/**
 * Switch focus to a particular tab
 * @param  {Function} done    Function to execute when finished
 */
module.exports = (done) => {
	
   browser.switchTab();
   
    done();
};