// Dependencies
var CallbackBuffering = require("../lib");

// Create a new callback buffer
var cb = new CallbackBuffering();

/*!
 * getUniqueRandom
 * Callbacks a random number that is unique after doing something async.
 *
 * @name getUniqueRandom
 * @function
 * @param {Number} i The current index.
 * @param {Function} callback The callback function.
 * @return {undefined}
 */
function getUniqueRandom(i, callback) {
    console.log("> Unique random requested " + i + " times.");
    if (cb.isDone) { return cb.done(callback); }
    cb.add(callback);
    if (cb.isWaiting) { return; }
    cb.wait();
    console.log("* Generating unique random");
    var r = Math.random();
    setTimeout(function() {
        cb.callback(r);
    }, 10);
}

// Request unique random multiple times
for (var i = 1; i < 11; ++i) {
    (function (i) {
        getUniqueRandom(i, function (c) {
            console.log("> Unique random is " + c);
        });
    })(i);
}
