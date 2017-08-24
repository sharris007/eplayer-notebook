/**
 * Refresh the browser window
 * @param  {Function} done    Function to execute when finished
 */
module.exports = (done) => {
	
    browser.refresh();

    done();
};