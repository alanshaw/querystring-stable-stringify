function stringify (obj, opts) {
  opts = opts || {}

  if (typeof opts == 'function') opts = {cmp: opts}

  var sep = opts.sep || '&'
  var eq = opts.eq || '='

  var encode = encodeURIComponent

  if (typeof opts.encodeURIComponent == 'function') {
    encode = opts.encodeURIComponent
  }

  if (obj !== null && typeof obj == 'object') {
    var keys = objectKeys(obj)
    var len = keys.length
    var flast = len - 1
    var fields = ''

    keys.sort(opts.cmp && keyComparator(obj, opts.cmp))

    for (var i = 0; i < len; ++i) {
      var k = keys[i]
      var v = obj[k]
      var ks = encode(stringifyPrimitive(k)) + eq

      if (isArray(v)) {
        v.sort(opts.cmp && valComparator(k, opts.cmp))

        var vlen = v.length
        var vlast = vlen - 1;
        for (var j = 0; j < vlen; ++j) {
          fields += ks + encode(stringifyPrimitive(v[j]))
          if (j < vlast)
            fields += sep
        }
        if (vlen && i < flast)
          fields += sep
      } else {
        fields += ks + encode(stringifyPrimitive(v))
        if (i < flast)
          fields += sep
      }
    }
    return fields
  }
  return ''
}

function keyComparator (v, cmp) {
  return function (a, b) {
    var aobj = {key: a, value: v[a]}
    var bobj = {key: b, value: v[b]}
    return cmp(aobj, bobj)
  }
}

function valComparator (k, cmp) {
  return function (a, b) {
    var aobj = {key: k, value: a}
    var bobj = {key: k, value: b}
    return cmp(aobj, bobj)
  }
}

function stringifyPrimitive (v) {
  if (typeof v == 'string') return v
  if (typeof v == 'number' && isFinite(v)) return '' + v
  if (typeof v == 'boolean') return v ? 'true' : 'false'
  return ''
}

var isArray = Array.isArray || function (x) {
  return {}.toString.call(x) === '[object Array]'
}

var objectKeys = Object.keys || function (obj) {
  var has = Object.prototype.hasOwnProperty || function () { return true }
  var keys = []
  for (var key in obj) {
    if (has.call(obj, key)) keys.push(key)
  }
  return keys
}

module.exports = stringify
