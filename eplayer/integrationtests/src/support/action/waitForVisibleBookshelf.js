/**
 * Wait for the given element to become visible
 * @param  {String}   elem      Element selector
 * @param  {String}   falseCase Whether or not to expect a visible or hidden
 *                              state
 * @param  {Function} done      Function to execute when finished
 *
 * @todo  merge with waitfor
 */
module.exports = (elem) => {
    /**
     * Maximum number of milliseconds to wait for
     * @type {Int}
     */
     console.log(elem + " "+ done);
    const ms = 60000;
    console.log(browser +" "+ms);
    browser.waitForExist(elem, ms);
    console.log(elem +" "+browser);
};
