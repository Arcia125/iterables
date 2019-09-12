/**
 * @typedef {Object} NextReturnObject
 * @property {Boolean} [done] indicates whether the iterator has reached it's end. Returning either undefined or false, will continue iteration
 * @property {any} [value] value from `for await (const value of asyncIterable)`. Not a required value, 
 * @description Object that must be returned from an asyncIterator next function
 */

/**
 * Iterators allow you to define `for (const value of iterable)` loops
 */

/**
 * @returns {NextReturnObject}
 */
function next() {
  const value = this.i++;

  const done = value >= 5;

  return done ? { done } : { value };
}

/**
 * @description Class based iterator
 */
class Iterable {
  constructor() {
    this.i = 0;
    this.next = next.bind(this);
  }

  [Symbol.iterator]() {
    return { next: this.next };
  }
}

/**
 * Async iterators allow native `for await (const value of asyncIterable)` loops in node 10+
 * Symbol.asyncIterator is used to assign a function that returns an object with a next
 * function that should return a promise with value and done properties
 * {Boolean} done signals that the iterable has completed
 * {any} value the value that you will get from `for await (const value of asyncIterable)`
 */

/**
 * @returns {Promise<NextReturnObject>}
 */
function asyncNext() {
  // Preserve current this value
  const boundNext = next.bind(this);

  // Call bound next
  const nextValue = boundNext();

  return Promise.resolve(nextValue);
}

/**
 * @description Class based asyncIterable
 */
class AsyncIterator {
  constructor() {
    this.i = 0;
    this.next = asyncNext.bind(this);
  }

  [Symbol.asyncIterator]() {
    return { next: this.next };
  }
}

const logIndividualInterval = (value, iterableType) =>
  console.log(`current value is ${value} from iterable type ${iterableType}`);

/**
 * @description Logs all values of an async iterable and it's "iterableType"
 */
async function logAsyncIterable(asyncIter, iterableType) {
  console.log(`starting to iterate over ${iterableType}`);
  for await (const value of asyncIter) {
    logIndividualInterval(value, iterableType);
  }
}

/**
 * @description Logs all values of an iterable and it's "iterableType"
 */
function logIterable(iter, iterableType) {
  console.log(`starting to iterate over ${iterableType}`);
  for (const value of iter) {
    logIndividualInterval(value, iterableType);
  }
}


/**
 * @description Object literal based iterator
 */
const iterable = {
  i: 0,
  [Symbol.iterator]() {
    const iterator = {
      next: this.next,
    };

    return iterator;
  },
};

// Force iterable.next to use iterable as it's this value
iterable.next = next.bind(iterable);

/**
 * @description Object literal asyncIterable.
 */
const asyncIterable = {
  i: 0,
  [Symbol.asyncIterator]() {
    return { next: this.next };
  },
};

// Force asyncIterable.next to use asyncIterable as it's this value
asyncIterable.next = asyncNext.bind(asyncIterable);

const classBasedAsyncIterable = new AsyncIterator();

const classBasedIterable = new Iterable();


// Due to these operations being asynchronous and the bottom two being synchronous,
// the log output of these two functions will be last.
logAsyncIterable(asyncIterable, 'async object literal');
logAsyncIterable(classBasedAsyncIterable, 'async class');

// These will log first.
logIterable(iterable, 'object literal');
logIterable(classBasedIterable, 'class');
