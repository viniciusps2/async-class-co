'use strict';
let co = require('co');

/**
 * Wraps static and instance methods whose name ends with Async, or are
 * GeneratorFunctions. Any GeneratorFunction is wrapped with
 * bluebird.coroutine(), and others with bluebird.method(). Accepts an optional
 * array of method names, wrapping only those found in the array, and disabling
 * the Async suffix check. Returns the class.
 *
 * @param   {function} klass         The class to wrap
 * @param   {string[]} [methodNames] Optional array of method names
 * @returns {function} The supplied class
 * @throws  {Error}    If methodNames is provided, but is not an array
 */
function wrap(klass, methodNames) {
  validateMethodNames(methodNames);
  wrapStaticMethods(klass, methodNames);
  wrapInstanceMethods(klass, methodNames);
  return klass;
}

/**
 * Wraps static methods whose name ends with Async or are GeneratorFunctions.
 * Any GeneratorFunction is wrapped with bluebird.coroutine(), and others with
 * bluebird.method(). Accepts an optional array of method names, wrapping only
 * those found in the array, and disabling the Async suffix check. Returns the
 * class.
 *
 * @param   {function} klass         The class to wrap
 * @param   {string[]} [methodNames] Optional array of method names
 * @returns {function} The supplied class
 * @throws  {Error}    If methodNames is provided, but is not an array
 */
function wrapStaticMethods(klass, methodNames) {
  validateMethodNames(methodNames);
  wrapFunctions(klass, methodNames);
  return klass;
}

function getStaticMethods(klass) {
  return getAllFunctions(klass);
}

/**
 * Wraps instance methods whose name ends with Async, or are GeneratorFunctions.
 * Any GeneratorFunction is wrapped with bluebird.coroutine(), and others with
 * bluebird.method(). Accepts an optional array of method names, wrapping only
 * those found in the array, and disabling the Async suffix check. Returns the
 * class.
 *
 * @param   {function} klass         The class to wrap
 * @param   {string[]} [methodNames] Optional array of method names
 * @returns {function} The supplied class
 * @throws  {Error}    If methodNames is provided, but is not an array
 */
function wrapInstanceMethods(klass, methodNames) {
  validateMethodNames(methodNames);
  wrapFunctions(klass.prototype, methodNames);
  return klass;
}

function getInstanceMethods(klass) {
  return getAllFunctions(klass.prototype);
}

/**
 * Helper function that validates the methodNames parameter.
 *
 * @param {string[]} [methodNames] Optional array of method names
 * @throws {Error}   If methodNames is provided, but is not an array
 */
function validateMethodNames(methodNames) {
  if (methodNames && !(methodNames instanceof Array)) {
    throw new Error('Optional methodNames should be an array if provided');
  }
}

function wrapFunctions(target, methodNames) {
  _actualMethodKeys(target).forEach(function(key) {
    let constructor = target[key].constructor.name;

    if (methodNames) {
      if (methodNames.indexOf(key) === -1) return;
    } else if (!key.endsWith('Async') && constructor !== 'GeneratorFunction') {
      return;
    }

    if (target[key].constructor.name === 'GeneratorFunction') {
      target[key] = co.wrap(target[key]);
    } else {
      target[key] = co.wrap(target[key]);
    }
  });
}

function getAllFunctions(target, methodNames) {
  const functions = {};

  _actualMethodKeys(target)
  .map(function(key) {
    let constructor = target[key].constructor.name;

    const isAsyncFunction = key.endsWith('Async') || constructor === 'GeneratorFunction'

    if (methodNames) {
      if (methodNames.indexOf(key) === -1) return;
    } else if (key === 'constructor') {
      return;
    } else if (!isAsyncFunction) {
      functions[key] = target[key];
      return;
    }

    if (target[key].constructor.name === 'GeneratorFunction') {
      functions[key] = co.wrap(target[key]);
      return;
    }
    functions[key] = co.wrap(target[key]);
  })
  return functions;
}

function _actualMethodKeys(target) {
  return Object.getOwnPropertyNames(target)
    .filter(key => {
      var propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
      return !propertyDescriptor.get && !propertyDescriptor.set;
    })
    .filter(key => typeof target[key] === 'function');
}

module.exports = {
  wrap,
  wrapStaticMethods,
  wrapInstanceMethods,
  getStaticMethods,
  getInstanceMethods
};
