/**
 * CbBuffer
 * Creates a new instance of `CbBuffer`.
 *
 * Example:
 *
 * ```js
 * var cb = new CbBuffer();
 * ```
 *
 * @name CbBuffer
 * @function
 * @return {Object} The `CbBuffer` instance containing:
 *
 *  - [`done` (Function)](#doneclb)
 *  - [`wait` (Function)](#wait)
 *  - [`callback` (Function)](#callback)
 *  - [`add` (Function)](#addfunc)
 *  - `buffer` (Array): An array with functions that will be
 *    called when the `callback` method is called.
 *  - `isWaiting` (Boolean): A flag that is `true` after
 *     calling the `wait` method.
 */
module.exports = function () {

    var self = this;

    // Attach the buffer array.
    self.buffer = [];

    // Set the `isWaiting` flat to `false`.
    self.isWaiting = false;

    /**
     * done
     * Calls the callback function provided as the first
     * parameter with cached arguments.
     *
     * @name done
     * @function
     * @param {Function} clb The callback function to be called.
     * @return {Object} The `CbBuffer` instance.
     */
    self.done = function (clb) {
        clb.apply(this, self._args);
        return self;
    };

    /**
     * wait
     * Sets `isWaiting` flag to `true`.
     *
     * @name wait
     * @function
     * @return {Object} The `CbBuffer` instance.
     */
    self.wait = function () {
        self.isWaiting = true;
        return self;
    };

    /**
     * callback
     * Fires all callbacks from the buffer end empties the it.
     *
     * @name callback
     * @function
     * @return {Object} The `CbBuffer` instance.
     */
    self.callback = function () {
        self._args = arguments;
        for (var i = 0; i < self.buffer.length; ++i) {
            self.done.call(this, self.buffer[i]);
        }
        self.buffer = [];
        self.isDone = true;
        self.isWaiting = false;
        return self;
    };

    /**
     * add
     * Adds functions to the current buffer.
     *
     * @name add
     * @function
     * @param {Function} func The function that should be buffered.
     * @return {Object} The `CbBuffer` instance.
     */
    self.add = function (func) {
        self.buffer.push(func);
        return self;
    };
};
