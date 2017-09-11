/**
 * Select the text area of the given element
 * @param  {String}   element  Element selector
 * @param  {String}   startOffsetX        X coordinate to move to
 * @param  {String}   startOffsetY        Y coordinate to move to
 * @param  {String}   endOffsetX          X coordinate to move to
 * @param  {String}   endOffsetY          Y coordinate to move to
 * @param  {Function} done     Function to execute when finished
 */
module.exports = (element, done) => {
	/**
     * X coordinate
     * @type {Int}
     */
    const startX =  100;
    const endX = 500;
	/**
     * Y coordinate
     * @type {Int}
     */
    const startY = 200;
    const endY =  400;

    browser.moveToObject(element,startX,startY);
    browser.buttonDown();
    browser.moveToObject(element,endX,endY);
    browser.buttonUp();

    done();
};