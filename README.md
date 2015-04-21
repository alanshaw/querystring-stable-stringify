# querystring-stable-stringify [![Build Status](https://travis-ci.org/alanshaw/querystring-stable-stringify.svg)](https://travis-ci.org/alanshaw/querystring-stable-stringify)

Deterministic `querystring.stringify()`.

## example

Given two objects:

```js
var obj0 = {a: 2, b: ['foo', 6, true], c: 'bar'}
var obj1 = {c: 'bar', a: 2, b: [true, 6, 'foo']}
```

Stringify them as a querystring and receive the _same_ output.

```js
var stringify = require('querystring-stable-stringify')

console.log(stringify(obj0))
console.log(stringify(obj1))

// Output:
// a=2&b=6&b=foo&b=true&c=bar
// a=2&b=6&b=foo&b=true&c=bar
```

## usage

```js
var stringify = require('querystring-stable-stringify')
```

### var str = stringify(obj, opts)

Return a deterministic stringified querystring `str` from the object `obj`.

### options

#### sep
The querystring seperator character (default: `&`)

#### eq
The querysting assignment character (default: `=`)

#### cmp
A custom comparison function for sorting your querystring keys and values. Your function `opts.cmp` is called with these parameters:

```js
opts.cmp({key: akey, value: avalue}, {key: bkey, value: bvalue})
```

**WARNING**: Passing this option _could_ make your stringify undeterministic. For properties in your `obj` whose values are arrays, your comparison function will be called with the _same key_ for different values. Hence, your comparison function should compare values, as well as keys!

e.g. A **bad** comparison function:

```js
var obj0 = {c: 8, b: [6, 5, 4, 7], a: 3}
var obj1 = {a: 3, c: 8, b: [5, 4, 6, 7]}

// Doesn't take into account a.value or b.value!
var cmp = function (a, b) {
  return a.key < b.key ? 1 : -1
}

console.log(stringify(obj0, cmp))
console.log(stringify(obj1, cmp))

// Output:
// c=8&b=6&b=5&b=4&b=7&a=3
// c=8&b=5&b=4&b=6&b=7&a=3
//       ^   ^   ^         Not equal!
```

#### encodeURIComponent
The function to use to encode URI components (default: [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent))

Note the behaviour differs from `querystring.stringify` in node/iojs, which uses [`querystring.escape`](https://nodejs.org/api/querystring.html#querystring_querystring_escape)

