# async-class-co

Clean ES6 async class wrapper in Node 4.0.0+. A solution to use promises and coroutines with classes without the overhead of babel, or the necessity to adopt unimplemented syntax and features like async/await (until v8/node supports those features).

This package is a fork from the project [async-class](https://github.com/danielstjules/async-class). But implemented with Generators and [Co](https://github.com/tj/co) instead of Bluebird (present in the original async-class project).

[![NPM version][npm-image]][npm-url] 
[![Build Status][travis-image]][travis-url] 
[![Dependency Status][daviddm-image]][daviddm-url] 
[![Coverage percentage][coveralls-image]][coveralls-url]
[![Standard - JavaScript Style Guide][standard-image]][standard-url]

## Installation

```
npm install --save async-class-co
```

## Overview

Using only ES6 features, how would you achieve a class like the following?

``` javascript
'use strict';

class FakeDataStore {
  constructor() {
    this.store = new Map();
  }

  async setAsync(key, value) {
    this.store.set(key, value);
    return await Promise.resolve(key);
  }
}
```

You'd use libraries that offer coroutine functionality like `co`.
However, there's no way to decorate those methods with ES6. Without the ES6
class sugar, we'd like to achieve the following:

``` javascript
'use strict';
let wrap = require('co').wrap;

function FakeDataStore {
  this.store = new Map();
}

FakeDataStore.prototype.setAsync = wrap(function*(key, value) {
  this.store.set(key, value);
  return yield Promise.resolve(key);
};
```

That's where this library comes in. You can simply use it as the following example:

``` javascript
'use strict';
let wrap = require('async-class-co').wrap;

class FakeDataStore {
  constructor() {
    this.store = new Map();
  }

  * setAsync(key, value) {
    this.store.set(key, value);
    return yield Promise.resolve(key);
  }
}

module.exports = wrap(FakeDataStore);
```

Clean ES6 classes and async methods!

## API

#### async-class-co.wrap(klass [, methodNames])

Wraps static and instance methods whose name ends with Async, or are
GeneratorFunctions. Any GeneratorFunction is wrapped with
co.wrap(). Accepts an optional array of method names, wrapping only those 
found in the array, and disabling the Async suffix check. Returns the class.

#### async-class-co.wrapStaticMethods(klass [, methodNames])

Wraps static methods whose name ends with Async or are GeneratorFunctions.
Any GeneratorFunction is wrapped with co.wrap(). Accepts an optional array 
of method names, wrapping only those found in the array, and disabling the
Async suffix check. Returns the class.

#### async-class-co.wrapInstanceMethods(klass [, methodNames])

Wraps instance methods whose name ends with Async, or are GeneratorFunctions.
Any GeneratorFunction is wrapped with co.wrap(). Accepts an optional array of
method names, wrapping only those found in the array, and disabling the Async
suffix check. Returns the class.

[npm-image]: https://badge.fury.io/js/async-class-co.svg
[npm-url]: https://www.npmjs.com/package/async-class-co
[travis-image]: https://travis-ci.org/viniciusps2/async-class-co.svg?branch=master
[travis-url]: https://travis-ci.org/viniciusps2/async-class-co
[daviddm-image]: https://david-dm.org/viniciusps2/async-class-co.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/viniciusps2/async-class-co
[coveralls-image]: https://coveralls.io/repos/viniciusps2/async-class-co/badge.svg
[coveralls-url]: https://coveralls.io/r/viniciusps2/async-class-co
[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard