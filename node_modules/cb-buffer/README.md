![cb-buffer - A minimalist NodeJS module for callback buffering.](http://i.imgur.com/UjN9LfL.png)

# Installation
```sh
$ npm install cb-buffer
```

# Example

```js
// Dependencies
var CallbackBuffering = require("cb-buffer");

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
```

# Documentation
## `CbBuffer()`
Creates a new instance of `CbBuffer`.

Example:

```js
var cb = new CbBuffer();
```

### Return
- **Object** The `CbBuffer` instance containing:
 - [`done` (Function)](#doneclb)
 - [`wait` (Function)](#wait)
 - [`callback` (Function)](#callback)
 - [`add` (Function)](#addfunc)
 - `buffer` (Array): An array with functions that will be
   called when the `callback` method is called.
 - `isWaiting` (Boolean): A flag that is `true` after
    calling the `wait` method.

## `done(clb)`
Calls the callback function provided as the first
parameter with cached arguments.

### Params
- **Function** `clb`: The callback function to be called.

### Return
- **Object** The `CbBuffer` instance.

## `wait()`
Sets `isWaiting` flag to `true`.

### Return
- **Object** The `CbBuffer` instance.

## `callback()`
Fires all callbacks from the buffer end empties the it.

### Return
- **Object** The `CbBuffer` instance.

## `add(func)`
Adds functions to the current buffer.

### Params
- **Function** `func`: The function that should be buffered.

### Return
- **Object** The `CbBuffer` instance.

# How to contribute

1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

# Changelog

## `1.0.2`
 - Fixed return values.

## `1.0.1`
 - Updated docs (example, fixes).

## `1.0.0`
 - Initial release.

# License
See the [LICENSE](./LICENSE) file.
