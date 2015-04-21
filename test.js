var test = require('tape')
var stringify = require('./')

// [name, obj0, obj1, cmp]
var cases = [
  [
    '2 differently ordered properties',
    {a: 'bar', b: 'foo'},
    {b: 'foo', a: 'bar'}
  ],
  [
    '3 differenty ordered properties',
    {a: 1, b: 2, c: 3},
    {b: 2, a: 1, c: 3}
  ],
  [
    'mixed data types',
    {a: null, b: 4, c: 'str'},
    {c: 'str', a: null, b: 4}
  ],
  [
    'ignore non primitive (as per node querystring.stringify)',
    {a: {foo: 'bar'}, b: 4},
    {b: 4, a: function () {}}
  ],
  [
    'arrays of values ordered',
    {a: [1, 2, 3, 4, 5]},
    {a: [5, 4, 2, 3, 1]}
  ],
  [
    'arrays of values ordered with multiple primitive types',
    {a: [1, 'two', false]},
    {a: ['two', false, 1]}
  ],
  [
    'multiple arrays of values ordered',
    {a: [1, 2, 3, 4, 5], b: ['one', 'two', 'three'], c: [false, false, true]},
    {a: [5, 4, 2, 3, 1], c: [false, true, false], b: ['three', 'one', 'two']}
  ],
  [
    'custom comparison function',
    {c: 8, b: [6, 5, 4, 7], a: 3},
    {a: 3, c: 8, b: [5, 4, 6, 7]},
    function (a, b) {
      if (a.key == b.key) return a.value < b.value ? 1 : -1
      return a.key < b.key ? 1 : -1
    }
  ]
]

cases.forEach(function (c) {
  test(c[0], function (t) {
    var qs0 = stringify(c[1], c[3])
    var qs1 = stringify(c[2], c[3])

    t.equal(qs0, qs1, JSON.stringify(c[1]) + ' vs ' + JSON.stringify(c[2]))

    t.end()
  })
})
