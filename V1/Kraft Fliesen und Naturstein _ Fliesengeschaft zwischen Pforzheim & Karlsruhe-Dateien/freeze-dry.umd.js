;(function (b, J) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? J(exports)
    : typeof define == 'function' && define.amd
      ? define(['exports'], J)
      : ((b = typeof globalThis != 'undefined' ? globalThis : b || self),
        J((b.freezeDry = {})))
})(this, function (b) {
  'use strict'
  function J(n) {
    if (n === null) return ''
    if (
      !n ||
      n.nodeType !== n.DOCUMENT_TYPE_NODE ||
      typeof n.name != 'string' ||
      typeof n.publicId != 'string' ||
      typeof n.systemId != 'string'
    )
      throw new TypeError('Expected a DocumentType')
    return (
      `<!DOCTYPE ${n.name}` +
      (n.publicId ? ` PUBLIC "${n.publicId}"` : '') +
      (n.systemId ? (n.publicId ? '' : ' SYSTEM') + ` "${n.systemId}"` : '') +
      '>'
    )
  }
  function ks(n) {
    if (!n || n.nodeType === void 0 || n.nodeType !== n.DOCUMENT_NODE)
      throw new TypeError('Expected a Document')
    return [...n.childNodes].map((t) => As(t)).join(`
`)
  }
  function As(n) {
    switch (n.nodeType) {
      case n.ELEMENT_NODE:
        return n.outerHTML
      case n.TEXT_NODE:
        return n.textContent
      case n.COMMENT_NODE:
        return `<!--${n.textContent}-->`
      case n.DOCUMENT_TYPE_NODE:
        return J(n)
      default:
        throw new TypeError(`Unexpected node type: ${n.nodeType}`)
    }
  }
  var oe =
    typeof globalThis != 'undefined'
      ? globalThis
      : typeof window != 'undefined'
        ? window
        : typeof global != 'undefined'
          ? global
          : typeof self != 'undefined'
            ? self
            : {}
  function Os(n) {
    return n &&
      n.__esModule &&
      Object.prototype.hasOwnProperty.call(n, 'default')
      ? n.default
      : n
  }
  function bt(n) {
    if (n.__esModule) return n
    var e = Object.defineProperty({}, '__esModule', { value: !0 })
    return (
      Object.keys(n).forEach(function (t) {
        var r = Object.getOwnPropertyDescriptor(n, t)
        Object.defineProperty(
          e,
          t,
          r.get
            ? r
            : {
                enumerable: !0,
                get: function () {
                  return n[t]
                },
              },
        )
      }),
      e
    )
  }
  var vt = xt
  function xt(n, e) {
    if (!!e) {
      if (n.length == 0) return e
      var t = n[0],
        r = e.childNodes[t]
      return xt(n.slice(1), r)
    }
  }
  var Le = { exports: {} }
  ;(function (n, e) {
    Object.defineProperty(e, '__esModule', { value: !0 })
    var t =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (l) {
            return typeof l
          }
        : function (l) {
            return l &&
              typeof Symbol == 'function' &&
              l.constructor === Symbol &&
              l !== Symbol.prototype
              ? 'symbol'
              : typeof l
          }
    e.default = r
    function r(l, a) {
      var o = Object.assign({}, a)
      return (
        l &&
          (typeof l == 'undefined' ? 'undefined' : t(l)) === 'object' &&
          Object.keys(l).forEach(function (c) {
            return i(c, a) && s(c, l, o)
          }),
        o
      )
    }
    function s(l, a, o) {
      a[l] !== void 0 && (o[l] = a[l])
    }
    function i(l, a) {
      if (a && !Object.hasOwnProperty.call(a, l))
        throw new Error('Unknown option: ' + l)
      return !0
    }
    n.exports = e.default
  })(Le, Le.exports)
  var Ts = Os(Le.exports),
    Ct =
      Number.isNaN ||
      function (e) {
        return typeof e == 'number' && e !== e
      }
  function Es(n, e) {
    return !!(n === e || (Ct(n) && Ct(e)))
  }
  function $s(n, e) {
    if (n.length !== e.length) return !1
    for (var t = 0; t < n.length; t++) if (!Es(n[t], e[t])) return !1
    return !0
  }
  function Ps(n, e) {
    e === void 0 && (e = $s)
    var t,
      r = [],
      s,
      i = !1
    function l() {
      for (var a = [], o = 0; o < arguments.length; o++) a[o] = arguments[o]
      return (
        (i && t === this && e(a, r)) ||
          ((s = n.apply(this, a)), (i = !0), (t = this), (r = a)),
        s
      )
    }
    return l
  }
  function le(n) {
    return (typeof n != 'object' && typeof n != 'function') || n === null
  }
  function M() {
    ;((this.childBranches = new WeakMap()),
      (this.primitiveKeys = new Map()),
      (this.hasValue = !1),
      (this.value = void 0))
  }
  ;((M.prototype.has = function (e) {
    var t = le(e) ? this.primitiveKeys.get(e) : e
    return t ? this.childBranches.has(t) : !1
  }),
    (M.prototype.get = function (e) {
      var t = le(e) ? this.primitiveKeys.get(e) : e
      return t ? this.childBranches.get(t) : void 0
    }),
    (M.prototype.resolveBranch = function (e) {
      if (this.has(e)) return this.get(e)
      var t = new M(),
        r = this.createKey(e)
      return (this.childBranches.set(r, t), t)
    }),
    (M.prototype.setValue = function (e) {
      return ((this.hasValue = !0), (this.value = e))
    }),
    (M.prototype.createKey = function (e) {
      if (le(e)) {
        var t = {}
        return (this.primitiveKeys.set(e, t), t)
      }
      return e
    }),
    (M.prototype.clear = function () {
      if (arguments.length === 0)
        ((this.childBranches = new WeakMap()),
          this.primitiveKeys.clear(),
          (this.hasValue = !1),
          (this.value = void 0))
      else if (arguments.length === 1) {
        var e = arguments[0]
        if (le(e)) {
          var t = this.primitiveKeys.get(e)
          t && (this.childBranches.delete(t), this.primitiveKeys.delete(e))
        } else this.childBranches.delete(e)
      } else {
        var r = arguments[0]
        if (this.has(r)) {
          var s = this.get(r)
          s.clear.apply(s, Array.prototype.slice.call(arguments, 1))
        }
      }
    }))
  var _s = function (e) {
      var t = new M()
      function r() {
        var s = Array.prototype.slice.call(arguments),
          i = s.reduce(function (o, c) {
            return o.resolveBranch(c)
          }, t)
        if (i.hasValue) return i.value
        var l = e.apply(null, s)
        return i.setValue(l)
      }
      return ((r.clear = t.clear.bind(t)), r)
    },
    Rs = _s
  function Ds(n) {
    if (Array.isArray(n)) {
      for (var e = 0, t = Array(n.length); e < n.length; e++) t[e] = n[e]
      return t
    } else return Array.from(n)
  }
  var Ns = function (e) {
      var t = void 0,
        r = void 0
      function s(a) {
        if (!(a instanceof Object))
          throw new Error('Target "' + a + '" is not an object')
        r = a
      }
      function i(a) {
        ;(Object.keys(a).forEach(function (o) {
          var c = a[o]
          if (typeof c != 'function')
            throw new Error('Trap "' + o + ': ' + c + '" is not a function')
          if (!Reflect[o])
            throw new Error('Trap "' + o + ': ' + c + '" is not a valid trap')
        }),
          (t = a))
      }
      ;(s(function () {}), e && s(e), i(Reflect))
      var l = new Proxy(
        {},
        {
          get: function (o, c) {
            return function () {
              for (var h = arguments.length, f = Array(h), u = 0; u < h; u++)
                f[u] = arguments[u]
              return t[c].apply(null, [r].concat(Ds(f.slice(1))))
            }
          },
        },
      )
      return {
        setTarget: s,
        setHandler: i,
        getTarget: function () {
          return r
        },
        getHandler: function () {
          return t
        },
        proxy: new Proxy(r, l),
      }
    },
    St = function n(e, t) {
      if (!t) throw new Error('No root node specified.')
      if (e === t) return []
      if (!t.contains(e))
        throw new Error(
          'Cannot determine path. Node is not a descendant of root node.',
        )
      for (var r = 0, s = e; s.previousSibling; ) ((s = s.previousSibling), r++)
      var i = n(e.parentNode, t)
      return (i.push(r), i)
    },
    Be = { exports: {} },
    d = String,
    kt = function () {
      return {
        isColorSupported: !1,
        reset: d,
        bold: d,
        dim: d,
        italic: d,
        underline: d,
        inverse: d,
        hidden: d,
        strikethrough: d,
        black: d,
        red: d,
        green: d,
        yellow: d,
        blue: d,
        magenta: d,
        cyan: d,
        white: d,
        gray: d,
        bgBlack: d,
        bgRed: d,
        bgGreen: d,
        bgYellow: d,
        bgBlue: d,
        bgMagenta: d,
        bgCyan: d,
        bgWhite: d,
        blackBright: d,
        redBright: d,
        greenBright: d,
        yellowBright: d,
        blueBright: d,
        magentaBright: d,
        cyanBright: d,
        whiteBright: d,
        bgBlackBright: d,
        bgRedBright: d,
        bgGreenBright: d,
        bgYellowBright: d,
        bgBlueBright: d,
        bgMagentaBright: d,
        bgCyanBright: d,
        bgWhiteBright: d,
      }
    }
  ;((Be.exports = kt()), (Be.exports.createColors = kt))
  var Ms = {},
    Us = Object.freeze(
      Object.defineProperty(
        { __proto__: null, default: Ms },
        Symbol.toStringTag,
        { value: 'Module' },
      ),
    ),
    T = bt(Us)
  let At = Be.exports,
    Ot = T
  class G extends Error {
    constructor(e, t, r, s, i, l) {
      ;(super(e),
        (this.name = 'CssSyntaxError'),
        (this.reason = e),
        i && (this.file = i),
        s && (this.source = s),
        l && (this.plugin = l),
        typeof t != 'undefined' &&
          typeof r != 'undefined' &&
          (typeof t == 'number'
            ? ((this.line = t), (this.column = r))
            : ((this.line = t.line),
              (this.column = t.column),
              (this.endLine = r.line),
              (this.endColumn = r.column))),
        this.setMessage(),
        Error.captureStackTrace && Error.captureStackTrace(this, G))
    }
    setMessage() {
      ;((this.message = this.plugin ? this.plugin + ': ' : ''),
        (this.message += this.file ? this.file : '<css input>'),
        typeof this.line != 'undefined' &&
          (this.message += ':' + this.line + ':' + this.column),
        (this.message += ': ' + this.reason))
    }
    showSourceCode(e) {
      if (!this.source) return ''
      let t = this.source
      e == null && (e = At.isColorSupported)
      let r = (h) => h,
        s = (h) => h,
        i = (h) => h
      if (e) {
        let { bold: h, gray: f, red: u } = At.createColors(!0)
        ;((s = (m) => h(u(m))), (r = (m) => f(m)), Ot && (i = (m) => Ot(m)))
      }
      let l = t.split(/\r?\n/),
        a = Math.max(this.line - 3, 0),
        o = Math.min(this.line + 2, l.length),
        c = String(o).length
      return l.slice(a, o).map((h, f) => {
        let u = a + 1 + f,
          m = ' ' + (' ' + u).slice(-c) + ' | '
        if (u === this.line) {
          if (h.length > 160) {
            let v = 20,
              p = Math.max(0, this.column - v),
              x = Math.max(this.column + v, this.endColumn + v),
              C = h.slice(p, x),
              D =
                r(m.replace(/\d/g, ' ')) +
                h
                  .slice(0, Math.min(this.column - 1, v - 1))
                  .replace(/[^\t]/g, ' ')
            return (
              s('>') +
              r(m) +
              i(C) +
              `
 ` +
              D +
              s('^')
            )
          }
          let $ =
            r(m.replace(/\d/g, ' ')) +
            h.slice(0, this.column - 1).replace(/[^\t]/g, ' ')
          return (
            s('>') +
            r(m) +
            i(h) +
            `
 ` +
            $ +
            s('^')
          )
        }
        return ' ' + r(m) + i(h)
      }).join(`
`)
    }
    toString() {
      let e = this.showSourceCode()
      return (
        e &&
          (e =
            `

` +
            e +
            `
`),
        this.name + ': ' + this.message + e
      )
    }
  }
  var je = G
  G.default = G
  const Tt = {
    after: `
`,
    beforeClose: `
`,
    beforeComment: `
`,
    beforeDecl: `
`,
    beforeOpen: ' ',
    beforeRule: `
`,
    colon: ': ',
    commentLeft: ' ',
    commentRight: ' ',
    emptyBody: '',
    indent: '    ',
    semicolon: !1,
  }
  function Ls(n) {
    return n[0].toUpperCase() + n.slice(1)
  }
  class Fe {
    constructor(e) {
      this.builder = e
    }
    atrule(e, t) {
      let r = '@' + e.name,
        s = e.params ? this.rawValue(e, 'params') : ''
      if (
        (typeof e.raws.afterName != 'undefined'
          ? (r += e.raws.afterName)
          : s && (r += ' '),
        e.nodes)
      )
        this.block(e, r + s)
      else {
        let i = (e.raws.between || '') + (t ? ';' : '')
        this.builder(r + s + i, e)
      }
    }
    beforeAfter(e, t) {
      let r
      e.type === 'decl'
        ? (r = this.raw(e, null, 'beforeDecl'))
        : e.type === 'comment'
          ? (r = this.raw(e, null, 'beforeComment'))
          : t === 'before'
            ? (r = this.raw(e, null, 'beforeRule'))
            : (r = this.raw(e, null, 'beforeClose'))
      let s = e.parent,
        i = 0
      for (; s && s.type !== 'root'; ) ((i += 1), (s = s.parent))
      if (
        r.includes(`
`)
      ) {
        let l = this.raw(e, null, 'indent')
        if (l.length) for (let a = 0; a < i; a++) r += l
      }
      return r
    }
    block(e, t) {
      let r = this.raw(e, 'between', 'beforeOpen')
      this.builder(t + r + '{', e, 'start')
      let s
      ;(e.nodes && e.nodes.length
        ? (this.body(e), (s = this.raw(e, 'after')))
        : (s = this.raw(e, 'after', 'emptyBody')),
        s && this.builder(s),
        this.builder('}', e, 'end'))
    }
    body(e) {
      let t = e.nodes.length - 1
      for (; t > 0 && e.nodes[t].type === 'comment'; ) t -= 1
      let r = this.raw(e, 'semicolon')
      for (let s = 0; s < e.nodes.length; s++) {
        let i = e.nodes[s],
          l = this.raw(i, 'before')
        ;(l && this.builder(l), this.stringify(i, t !== s || r))
      }
    }
    comment(e) {
      let t = this.raw(e, 'left', 'commentLeft'),
        r = this.raw(e, 'right', 'commentRight')
      this.builder('/*' + t + e.text + r + '*/', e)
    }
    decl(e, t) {
      let r = this.raw(e, 'between', 'colon'),
        s = e.prop + r + this.rawValue(e, 'value')
      ;(e.important && (s += e.raws.important || ' !important'),
        t && (s += ';'),
        this.builder(s, e))
    }
    document(e) {
      this.body(e)
    }
    raw(e, t, r) {
      let s
      if ((r || (r = t), t && ((s = e.raws[t]), typeof s != 'undefined')))
        return s
      let i = e.parent
      if (
        r === 'before' &&
        (!i ||
          (i.type === 'root' && i.first === e) ||
          (i && i.type === 'document'))
      )
        return ''
      if (!i) return Tt[r]
      let l = e.root()
      if (
        (l.rawCache || (l.rawCache = {}), typeof l.rawCache[r] != 'undefined')
      )
        return l.rawCache[r]
      if (r === 'before' || r === 'after') return this.beforeAfter(e, r)
      {
        let a = 'raw' + Ls(r)
        this[a]
          ? (s = this[a](l, e))
          : l.walk((o) => {
              if (((s = o.raws[t]), typeof s != 'undefined')) return !1
            })
      }
      return (typeof s == 'undefined' && (s = Tt[r]), (l.rawCache[r] = s), s)
    }
    rawBeforeClose(e) {
      let t
      return (
        e.walk((r) => {
          if (
            r.nodes &&
            r.nodes.length > 0 &&
            typeof r.raws.after != 'undefined'
          )
            return (
              (t = r.raws.after),
              t.includes(`
`) && (t = t.replace(/[^\n]+$/, '')),
              !1
            )
        }),
        t && (t = t.replace(/\S/g, '')),
        t
      )
    }
    rawBeforeComment(e, t) {
      let r
      return (
        e.walkComments((s) => {
          if (typeof s.raws.before != 'undefined')
            return (
              (r = s.raws.before),
              r.includes(`
`) && (r = r.replace(/[^\n]+$/, '')),
              !1
            )
        }),
        typeof r == 'undefined'
          ? (r = this.raw(t, null, 'beforeDecl'))
          : r && (r = r.replace(/\S/g, '')),
        r
      )
    }
    rawBeforeDecl(e, t) {
      let r
      return (
        e.walkDecls((s) => {
          if (typeof s.raws.before != 'undefined')
            return (
              (r = s.raws.before),
              r.includes(`
`) && (r = r.replace(/[^\n]+$/, '')),
              !1
            )
        }),
        typeof r == 'undefined'
          ? (r = this.raw(t, null, 'beforeRule'))
          : r && (r = r.replace(/\S/g, '')),
        r
      )
    }
    rawBeforeOpen(e) {
      let t
      return (
        e.walk((r) => {
          if (
            r.type !== 'decl' &&
            ((t = r.raws.between), typeof t != 'undefined')
          )
            return !1
        }),
        t
      )
    }
    rawBeforeRule(e) {
      let t
      return (
        e.walk((r) => {
          if (
            r.nodes &&
            (r.parent !== e || e.first !== r) &&
            typeof r.raws.before != 'undefined'
          )
            return (
              (t = r.raws.before),
              t.includes(`
`) && (t = t.replace(/[^\n]+$/, '')),
              !1
            )
        }),
        t && (t = t.replace(/\S/g, '')),
        t
      )
    }
    rawColon(e) {
      let t
      return (
        e.walkDecls((r) => {
          if (typeof r.raws.between != 'undefined')
            return ((t = r.raws.between.replace(/[^\s:]/g, '')), !1)
        }),
        t
      )
    }
    rawEmptyBody(e) {
      let t
      return (
        e.walk((r) => {
          if (
            r.nodes &&
            r.nodes.length === 0 &&
            ((t = r.raws.after), typeof t != 'undefined')
          )
            return !1
        }),
        t
      )
    }
    rawIndent(e) {
      if (e.raws.indent) return e.raws.indent
      let t
      return (
        e.walk((r) => {
          let s = r.parent
          if (
            s &&
            s !== e &&
            s.parent &&
            s.parent === e &&
            typeof r.raws.before != 'undefined'
          ) {
            let i = r.raws.before.split(`
`)
            return ((t = i[i.length - 1]), (t = t.replace(/\S/g, '')), !1)
          }
        }),
        t
      )
    }
    rawSemicolon(e) {
      let t
      return (
        e.walk((r) => {
          if (
            r.nodes &&
            r.nodes.length &&
            r.last.type === 'decl' &&
            ((t = r.raws.semicolon), typeof t != 'undefined')
          )
            return !1
        }),
        t
      )
    }
    rawValue(e, t) {
      let r = e[t],
        s = e.raws[t]
      return s && s.value === r ? s.raw : r
    }
    root(e) {
      ;(this.body(e), e.raws.after && this.builder(e.raws.after))
    }
    rule(e) {
      ;(this.block(e, this.rawValue(e, 'selector')),
        e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, 'end'))
    }
    stringify(e, t) {
      if (!this[e.type])
        throw new Error(
          'Unknown AST node type ' +
            e.type +
            '. Maybe you need to change PostCSS stringifier.',
        )
      this[e.type](e, t)
    }
  }
  var Et = Fe
  Fe.default = Fe
  let Bs = Et
  function ze(n, e) {
    new Bs(e).stringify(n)
  }
  var ae = ze
  ze.default = ze
  var K = {}
  ;((K.isClean = Symbol('isClean')), (K.my = Symbol('my')))
  let js = je,
    Fs = Et,
    zs = ae,
    { isClean: Q, my: Ws } = K
  function We(n, e) {
    let t = new n.constructor()
    for (let r in n) {
      if (!Object.prototype.hasOwnProperty.call(n, r) || r === 'proxyCache')
        continue
      let s = n[r],
        i = typeof s
      r === 'parent' && i === 'object'
        ? e && (t[r] = e)
        : r === 'source'
          ? (t[r] = s)
          : Array.isArray(s)
            ? (t[r] = s.map((l) => We(l, t)))
            : (i === 'object' && s !== null && (s = We(s)), (t[r] = s))
    }
    return t
  }
  function N(n, e) {
    if (e && typeof e.offset != 'undefined') return e.offset
    let t = 1,
      r = 1,
      s = 0
    for (let i = 0; i < n.length; i++) {
      if (r === e.line && t === e.column) {
        s = i
        break
      }
      n[i] ===
      `
`
        ? ((t = 1), (r += 1))
        : (t += 1)
    }
    return s
  }
  class Ie {
    get proxyOf() {
      return this
    }
    constructor(e = {}) {
      ;((this.raws = {}), (this[Q] = !1), (this[Ws] = !0))
      for (let t in e)
        if (t === 'nodes') {
          this.nodes = []
          for (let r of e[t])
            typeof r.clone == 'function'
              ? this.append(r.clone())
              : this.append(r)
        } else this[t] = e[t]
    }
    addToError(e) {
      if (
        ((e.postcssNode = this),
        e.stack && this.source && /\n\s{4}at /.test(e.stack))
      ) {
        let t = this.source
        e.stack = e.stack.replace(
          /\n\s{4}at /,
          `$&${t.input.from}:${t.start.line}:${t.start.column}$&`,
        )
      }
      return e
    }
    after(e) {
      return (this.parent.insertAfter(this, e), this)
    }
    assign(e = {}) {
      for (let t in e) this[t] = e[t]
      return this
    }
    before(e) {
      return (this.parent.insertBefore(this, e), this)
    }
    cleanRaws(e) {
      ;(delete this.raws.before,
        delete this.raws.after,
        e || delete this.raws.between)
    }
    clone(e = {}) {
      let t = We(this)
      for (let r in e) t[r] = e[r]
      return t
    }
    cloneAfter(e = {}) {
      let t = this.clone(e)
      return (this.parent.insertAfter(this, t), t)
    }
    cloneBefore(e = {}) {
      let t = this.clone(e)
      return (this.parent.insertBefore(this, t), t)
    }
    error(e, t = {}) {
      if (this.source) {
        let { end: r, start: s } = this.rangeBy(t)
        return this.source.input.error(
          e,
          { column: s.column, line: s.line },
          { column: r.column, line: r.line },
          t,
        )
      }
      return new js(e)
    }
    getProxyProcessor() {
      return {
        get(e, t) {
          return t === 'proxyOf'
            ? e
            : t === 'root'
              ? () => e.root().toProxy()
              : e[t]
        },
        set(e, t, r) {
          return (
            e[t] === r ||
              ((e[t] = r),
              (t === 'prop' ||
                t === 'value' ||
                t === 'name' ||
                t === 'params' ||
                t === 'important' ||
                t === 'text') &&
                e.markDirty()),
            !0
          )
        },
      }
    }
    markClean() {
      this[Q] = !0
    }
    markDirty() {
      if (this[Q]) {
        this[Q] = !1
        let e = this
        for (; (e = e.parent); ) e[Q] = !1
      }
    }
    next() {
      if (!this.parent) return
      let e = this.parent.index(this)
      return this.parent.nodes[e + 1]
    }
    positionBy(e = {}) {
      let t = this.source.start
      if (e.index) t = this.positionInside(e.index)
      else if (e.word) {
        let r =
            'document' in this.source.input
              ? this.source.input.document
              : this.source.input.css,
          i = r
            .slice(N(r, this.source.start), N(r, this.source.end))
            .indexOf(e.word)
        i !== -1 && (t = this.positionInside(i))
      }
      return t
    }
    positionInside(e) {
      let t = this.source.start.column,
        r = this.source.start.line,
        s =
          'document' in this.source.input
            ? this.source.input.document
            : this.source.input.css,
        i = N(s, this.source.start),
        l = i + e
      for (let a = i; a < l; a++)
        s[a] ===
        `
`
          ? ((t = 1), (r += 1))
          : (t += 1)
      return { column: t, line: r, offset: l }
    }
    prev() {
      if (!this.parent) return
      let e = this.parent.index(this)
      return this.parent.nodes[e - 1]
    }
    rangeBy(e = {}) {
      let t =
          'document' in this.source.input
            ? this.source.input.document
            : this.source.input.css,
        r = {
          column: this.source.start.column,
          line: this.source.start.line,
          offset: N(t, this.source.start),
        },
        s = this.source.end
          ? {
              column: this.source.end.column + 1,
              line: this.source.end.line,
              offset:
                typeof this.source.end.offset == 'number'
                  ? this.source.end.offset
                  : N(t, this.source.end) + 1,
            }
          : { column: r.column + 1, line: r.line, offset: r.offset + 1 }
      if (e.word) {
        let l = t
          .slice(N(t, this.source.start), N(t, this.source.end))
          .indexOf(e.word)
        l !== -1 &&
          ((r = this.positionInside(l)),
          (s = this.positionInside(l + e.word.length)))
      } else
        (e.start
          ? (r = {
              column: e.start.column,
              line: e.start.line,
              offset: N(t, e.start),
            })
          : e.index && (r = this.positionInside(e.index)),
          e.end
            ? (s = {
                column: e.end.column,
                line: e.end.line,
                offset: N(t, e.end),
              })
            : typeof e.endIndex == 'number'
              ? (s = this.positionInside(e.endIndex))
              : e.index && (s = this.positionInside(e.index + 1)))
      return (
        (s.line < r.line || (s.line === r.line && s.column <= r.column)) &&
          (s = { column: r.column + 1, line: r.line, offset: r.offset + 1 }),
        { end: s, start: r }
      )
    }
    raw(e, t) {
      return new Fs().raw(this, e, t)
    }
    remove() {
      return (
        this.parent && this.parent.removeChild(this),
        (this.parent = void 0),
        this
      )
    }
    replaceWith(...e) {
      if (this.parent) {
        let t = this,
          r = !1
        for (let s of e)
          s === this
            ? (r = !0)
            : r
              ? (this.parent.insertAfter(t, s), (t = s))
              : this.parent.insertBefore(t, s)
        r || this.remove()
      }
      return this
    }
    root() {
      let e = this
      for (; e.parent && e.parent.type !== 'document'; ) e = e.parent
      return e
    }
    toJSON(e, t) {
      let r = {},
        s = t == null
      t = t || new Map()
      let i = 0
      for (let l in this) {
        if (
          !Object.prototype.hasOwnProperty.call(this, l) ||
          l === 'parent' ||
          l === 'proxyCache'
        )
          continue
        let a = this[l]
        if (Array.isArray(a))
          r[l] = a.map((o) =>
            typeof o == 'object' && o.toJSON ? o.toJSON(null, t) : o,
          )
        else if (typeof a == 'object' && a.toJSON) r[l] = a.toJSON(null, t)
        else if (l === 'source') {
          if (a == null) continue
          let o = t.get(a.input)
          ;(o == null && ((o = i), t.set(a.input, i), i++),
            (r[l] = { end: a.end, inputId: o, start: a.start }))
        } else r[l] = a
      }
      return (s && (r.inputs = [...t.keys()].map((l) => l.toJSON())), r)
    }
    toProxy() {
      return (
        this.proxyCache ||
          (this.proxyCache = new Proxy(this, this.getProxyProcessor())),
        this.proxyCache
      )
    }
    toString(e = zs) {
      e.stringify && (e = e.stringify)
      let t = ''
      return (
        e(this, (r) => {
          t += r
        }),
        t
      )
    }
    warn(e, t, r = {}) {
      let s = { node: this }
      for (let i in r) s[i] = r[i]
      return e.warn(t, s)
    }
  }
  var ue = Ie
  Ie.default = Ie
  let Is = ue
  class qe extends Is {
    constructor(e) {
      ;(super(e), (this.type = 'comment'))
    }
  }
  var ce = qe
  qe.default = qe
  let qs = ue
  class Ve extends qs {
    get variable() {
      return this.prop.startsWith('--') || this.prop[0] === '$'
    }
    constructor(e) {
      ;(e &&
        typeof e.value != 'undefined' &&
        typeof e.value != 'string' &&
        (e = { ...e, value: String(e.value) }),
        super(e),
        (this.type = 'decl'))
    }
  }
  var he = Ve
  Ve.default = Ve
  let $t = ce,
    Pt = he,
    Vs = ue,
    { isClean: _t, my: Rt } = K,
    He,
    Dt,
    Nt,
    Je
  function Mt(n) {
    return n.map(
      (e) => (e.nodes && (e.nodes = Mt(e.nodes)), delete e.source, e),
    )
  }
  function Ut(n) {
    if (((n[_t] = !1), n.proxyOf.nodes)) for (let e of n.proxyOf.nodes) Ut(e)
  }
  class E extends Vs {
    get first() {
      if (!!this.proxyOf.nodes) return this.proxyOf.nodes[0]
    }
    get last() {
      if (!!this.proxyOf.nodes)
        return this.proxyOf.nodes[this.proxyOf.nodes.length - 1]
    }
    append(...e) {
      for (let t of e) {
        let r = this.normalize(t, this.last)
        for (let s of r) this.proxyOf.nodes.push(s)
      }
      return (this.markDirty(), this)
    }
    cleanRaws(e) {
      if ((super.cleanRaws(e), this.nodes))
        for (let t of this.nodes) t.cleanRaws(e)
    }
    each(e) {
      if (!this.proxyOf.nodes) return
      let t = this.getIterator(),
        r,
        s
      for (
        ;
        this.indexes[t] < this.proxyOf.nodes.length &&
        ((r = this.indexes[t]), (s = e(this.proxyOf.nodes[r], r)), s !== !1);
      )
        this.indexes[t] += 1
      return (delete this.indexes[t], s)
    }
    every(e) {
      return this.nodes.every(e)
    }
    getIterator() {
      ;(this.lastEach || (this.lastEach = 0),
        this.indexes || (this.indexes = {}),
        (this.lastEach += 1))
      let e = this.lastEach
      return ((this.indexes[e] = 0), e)
    }
    getProxyProcessor() {
      return {
        get(e, t) {
          return t === 'proxyOf'
            ? e
            : e[t]
              ? t === 'each' || (typeof t == 'string' && t.startsWith('walk'))
                ? (...r) =>
                    e[t](
                      ...r.map((s) =>
                        typeof s == 'function'
                          ? (i, l) => s(i.toProxy(), l)
                          : s,
                      ),
                    )
                : t === 'every' || t === 'some'
                  ? (r) => e[t]((s, ...i) => r(s.toProxy(), ...i))
                  : t === 'root'
                    ? () => e.root().toProxy()
                    : t === 'nodes'
                      ? e.nodes.map((r) => r.toProxy())
                      : t === 'first' || t === 'last'
                        ? e[t].toProxy()
                        : e[t]
              : e[t]
        },
        set(e, t, r) {
          return (
            e[t] === r ||
              ((e[t] = r),
              (t === 'name' || t === 'params' || t === 'selector') &&
                e.markDirty()),
            !0
          )
        },
      }
    }
    index(e) {
      return typeof e == 'number'
        ? e
        : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e))
    }
    insertAfter(e, t) {
      let r = this.index(e),
        s = this.normalize(t, this.proxyOf.nodes[r]).reverse()
      r = this.index(e)
      for (let l of s) this.proxyOf.nodes.splice(r + 1, 0, l)
      let i
      for (let l in this.indexes)
        ((i = this.indexes[l]), r < i && (this.indexes[l] = i + s.length))
      return (this.markDirty(), this)
    }
    insertBefore(e, t) {
      let r = this.index(e),
        s = r === 0 ? 'prepend' : !1,
        i = this.normalize(t, this.proxyOf.nodes[r], s).reverse()
      r = this.index(e)
      for (let a of i) this.proxyOf.nodes.splice(r, 0, a)
      let l
      for (let a in this.indexes)
        ((l = this.indexes[a]), r <= l && (this.indexes[a] = l + i.length))
      return (this.markDirty(), this)
    }
    normalize(e, t) {
      if (typeof e == 'string') e = Mt(Dt(e).nodes)
      else if (typeof e == 'undefined') e = []
      else if (Array.isArray(e)) {
        e = e.slice(0)
        for (let s of e) s.parent && s.parent.removeChild(s, 'ignore')
      } else if (e.type === 'root' && this.type !== 'document') {
        e = e.nodes.slice(0)
        for (let s of e) s.parent && s.parent.removeChild(s, 'ignore')
      } else if (e.type) e = [e]
      else if (e.prop) {
        if (typeof e.value == 'undefined')
          throw new Error('Value field is missed in node creation')
        ;(typeof e.value != 'string' && (e.value = String(e.value)),
          (e = [new Pt(e)]))
      } else if (e.selector || e.selectors) e = [new Je(e)]
      else if (e.name) e = [new He(e)]
      else if (e.text) e = [new $t(e)]
      else throw new Error('Unknown node type in node creation')
      return e.map(
        (s) => (
          s[Rt] || E.rebuild(s),
          (s = s.proxyOf),
          s.parent && s.parent.removeChild(s),
          s[_t] && Ut(s),
          s.raws || (s.raws = {}),
          typeof s.raws.before == 'undefined' &&
            t &&
            typeof t.raws.before != 'undefined' &&
            (s.raws.before = t.raws.before.replace(/\S/g, '')),
          (s.parent = this.proxyOf),
          s
        ),
      )
    }
    prepend(...e) {
      e = e.reverse()
      for (let t of e) {
        let r = this.normalize(t, this.first, 'prepend').reverse()
        for (let s of r) this.proxyOf.nodes.unshift(s)
        for (let s in this.indexes) this.indexes[s] = this.indexes[s] + r.length
      }
      return (this.markDirty(), this)
    }
    push(e) {
      return ((e.parent = this), this.proxyOf.nodes.push(e), this)
    }
    removeAll() {
      for (let e of this.proxyOf.nodes) e.parent = void 0
      return ((this.proxyOf.nodes = []), this.markDirty(), this)
    }
    removeChild(e) {
      ;((e = this.index(e)),
        (this.proxyOf.nodes[e].parent = void 0),
        this.proxyOf.nodes.splice(e, 1))
      let t
      for (let r in this.indexes)
        ((t = this.indexes[r]), t >= e && (this.indexes[r] = t - 1))
      return (this.markDirty(), this)
    }
    replaceValues(e, t, r) {
      return (
        r || ((r = t), (t = {})),
        this.walkDecls((s) => {
          ;(t.props && !t.props.includes(s.prop)) ||
            (t.fast && !s.value.includes(t.fast)) ||
            (s.value = s.value.replace(e, r))
        }),
        this.markDirty(),
        this
      )
    }
    some(e) {
      return this.nodes.some(e)
    }
    walk(e) {
      return this.each((t, r) => {
        let s
        try {
          s = e(t, r)
        } catch (i) {
          throw t.addToError(i)
        }
        return (s !== !1 && t.walk && (s = t.walk(e)), s)
      })
    }
    walkAtRules(e, t) {
      return t
        ? e instanceof RegExp
          ? this.walk((r, s) => {
              if (r.type === 'atrule' && e.test(r.name)) return t(r, s)
            })
          : this.walk((r, s) => {
              if (r.type === 'atrule' && r.name === e) return t(r, s)
            })
        : ((t = e),
          this.walk((r, s) => {
            if (r.type === 'atrule') return t(r, s)
          }))
    }
    walkComments(e) {
      return this.walk((t, r) => {
        if (t.type === 'comment') return e(t, r)
      })
    }
    walkDecls(e, t) {
      return t
        ? e instanceof RegExp
          ? this.walk((r, s) => {
              if (r.type === 'decl' && e.test(r.prop)) return t(r, s)
            })
          : this.walk((r, s) => {
              if (r.type === 'decl' && r.prop === e) return t(r, s)
            })
        : ((t = e),
          this.walk((r, s) => {
            if (r.type === 'decl') return t(r, s)
          }))
    }
    walkRules(e, t) {
      return t
        ? e instanceof RegExp
          ? this.walk((r, s) => {
              if (r.type === 'rule' && e.test(r.selector)) return t(r, s)
            })
          : this.walk((r, s) => {
              if (r.type === 'rule' && r.selector === e) return t(r, s)
            })
        : ((t = e),
          this.walk((r, s) => {
            if (r.type === 'rule') return t(r, s)
          }))
    }
  }
  ;((E.registerParse = (n) => {
    Dt = n
  }),
    (E.registerRule = (n) => {
      Je = n
    }),
    (E.registerAtRule = (n) => {
      He = n
    }),
    (E.registerRoot = (n) => {
      Nt = n
    }))
  var F = E
  ;((E.default = E),
    (E.rebuild = (n) => {
      ;(n.type === 'atrule'
        ? Object.setPrototypeOf(n, He.prototype)
        : n.type === 'rule'
          ? Object.setPrototypeOf(n, Je.prototype)
          : n.type === 'decl'
            ? Object.setPrototypeOf(n, Pt.prototype)
            : n.type === 'comment'
              ? Object.setPrototypeOf(n, $t.prototype)
              : n.type === 'root' && Object.setPrototypeOf(n, Nt.prototype),
        (n[Rt] = !0),
        n.nodes &&
          n.nodes.forEach((e) => {
            E.rebuild(e)
          }))
    }))
  let Lt = F
  class fe extends Lt {
    constructor(e) {
      ;(super(e), (this.type = 'atrule'))
    }
    append(...e) {
      return (this.proxyOf.nodes || (this.nodes = []), super.append(...e))
    }
    prepend(...e) {
      return (this.proxyOf.nodes || (this.nodes = []), super.prepend(...e))
    }
  }
  var Ge = fe
  ;((fe.default = fe), Lt.registerAtRule(fe))
  let Hs = F,
    Bt,
    jt
  class Y extends Hs {
    constructor(e) {
      ;(super({ type: 'document', ...e }), this.nodes || (this.nodes = []))
    }
    toResult(e = {}) {
      return new Bt(new jt(), this, e).stringify()
    }
  }
  ;((Y.registerLazyResult = (n) => {
    Bt = n
  }),
    (Y.registerProcessor = (n) => {
      jt = n
    }))
  var Ke = Y
  Y.default = Y
  let Js = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
  var Gs = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          nanoid: (n = 21) => {
            let e = '',
              t = n | 0
            for (; t--; ) e += Js[(Math.random() * 64) | 0]
            return e
          },
          customAlphabet:
            (n, e = 21) =>
            (t = e) => {
              let r = '',
                s = t | 0
              for (; s--; ) r += n[(Math.random() * n.length) | 0]
              return r
            },
        },
        Symbol.toStringTag,
        { value: 'Module' },
      ),
    ),
    Ks = bt(Gs)
  let { existsSync: Qs, readFileSync: Ys } = T,
    { dirname: Qe, join: Xs } = T,
    { SourceMapConsumer: Ft, SourceMapGenerator: zt } = T
  function Zs(n) {
    return Buffer ? Buffer.from(n, 'base64').toString() : window.atob(n)
  }
  class Ye {
    constructor(e, t) {
      if (t.map === !1) return
      ;(this.loadAnnotation(e),
        (this.inline = this.startWith(this.annotation, 'data:')))
      let r = t.map ? t.map.prev : void 0,
        s = this.loadMap(t.from, r)
      ;(!this.mapFile && t.from && (this.mapFile = t.from),
        this.mapFile && (this.root = Qe(this.mapFile)),
        s && (this.text = s))
    }
    consumer() {
      return (
        this.consumerCache || (this.consumerCache = new Ft(this.text)),
        this.consumerCache
      )
    }
    decodeInline(e) {
      let t = /^data:application\/json;charset=utf-?8;base64,/,
        r = /^data:application\/json;base64,/,
        s = /^data:application\/json;charset=utf-?8,/,
        i = /^data:application\/json,/,
        l = e.match(s) || e.match(i)
      if (l) return decodeURIComponent(e.substr(l[0].length))
      let a = e.match(t) || e.match(r)
      if (a) return Zs(e.substr(a[0].length))
      let o = e.match(/data:application\/json;([^,]+),/)[1]
      throw new Error('Unsupported source map encoding ' + o)
    }
    getAnnotationURL(e) {
      return e.replace(/^\/\*\s*# sourceMappingURL=/, '').trim()
    }
    isMap(e) {
      return typeof e != 'object'
        ? !1
        : typeof e.mappings == 'string' ||
            typeof e._mappings == 'string' ||
            Array.isArray(e.sections)
    }
    loadAnnotation(e) {
      let t = e.match(/\/\*\s*# sourceMappingURL=/g)
      if (!t) return
      let r = e.lastIndexOf(t.pop()),
        s = e.indexOf('*/', r)
      r > -1 &&
        s > -1 &&
        (this.annotation = this.getAnnotationURL(e.substring(r, s)))
    }
    loadFile(e) {
      if (((this.root = Qe(e)), Qs(e)))
        return ((this.mapFile = e), Ys(e, 'utf-8').toString().trim())
    }
    loadMap(e, t) {
      if (t === !1) return !1
      if (t) {
        if (typeof t == 'string') return t
        if (typeof t == 'function') {
          let r = t(e)
          if (r) {
            let s = this.loadFile(r)
            if (!s)
              throw new Error(
                'Unable to load previous source map: ' + r.toString(),
              )
            return s
          }
        } else {
          if (t instanceof Ft) return zt.fromSourceMap(t).toString()
          if (t instanceof zt) return t.toString()
          if (this.isMap(t)) return JSON.stringify(t)
          throw new Error(
            'Unsupported previous source map format: ' + t.toString(),
          )
        }
      } else {
        if (this.inline) return this.decodeInline(this.annotation)
        if (this.annotation) {
          let r = this.annotation
          return (e && (r = Xs(Qe(e), r)), this.loadFile(r))
        }
      }
    }
    startWith(e, t) {
      return e ? e.substr(0, t.length) === t : !1
    }
    withContent() {
      return !!(
        this.consumer().sourcesContent &&
        this.consumer().sourcesContent.length > 0
      )
    }
  }
  var Wt = Ye
  Ye.default = Ye
  let { nanoid: en } = Ks,
    { isAbsolute: Xe, resolve: Ze } = T,
    { SourceMapConsumer: tn, SourceMapGenerator: rn } = T,
    { fileURLToPath: It, pathToFileURL: pe } = T,
    qt = je,
    sn = Wt,
    et = T,
    tt = Symbol('lineToIndexCache'),
    nn = Boolean(tn && rn),
    Vt = Boolean(Ze && Xe)
  function Ht(n) {
    if (n[tt]) return n[tt]
    let e = n.css.split(`
`),
      t = new Array(e.length),
      r = 0
    for (let s = 0, i = e.length; s < i; s++)
      ((t[s] = r), (r += e[s].length + 1))
    return ((n[tt] = t), t)
  }
  class de {
    get from() {
      return this.file || this.id
    }
    constructor(e, t = {}) {
      if (
        e === null ||
        typeof e == 'undefined' ||
        (typeof e == 'object' && !e.toString)
      )
        throw new Error(`PostCSS received ${e} instead of CSS string`)
      if (
        ((this.css = e.toString()),
        this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE'
          ? ((this.hasBOM = !0), (this.css = this.css.slice(1)))
          : (this.hasBOM = !1),
        (this.document = this.css),
        t.document && (this.document = t.document.toString()),
        t.from &&
          (!Vt || /^\w+:\/\//.test(t.from) || Xe(t.from)
            ? (this.file = t.from)
            : (this.file = Ze(t.from))),
        Vt && nn)
      ) {
        let r = new sn(this.css, t)
        if (r.text) {
          this.map = r
          let s = r.consumer().file
          !this.file && s && (this.file = this.mapResolve(s))
        }
      }
      ;(this.file || (this.id = '<input css ' + en(6) + '>'),
        this.map && (this.map.file = this.from))
    }
    error(e, t, r, s = {}) {
      let i, l, a, o, c
      if (t && typeof t == 'object') {
        let f = t,
          u = r
        if (typeof f.offset == 'number') {
          o = f.offset
          let m = this.fromOffset(o)
          ;((t = m.line), (r = m.col))
        } else
          ((t = f.line), (r = f.column), (o = this.fromLineAndColumn(t, r)))
        if (typeof u.offset == 'number') {
          a = u.offset
          let m = this.fromOffset(a)
          ;((l = m.line), (i = m.col))
        } else
          ((l = u.line),
            (i = u.column),
            (a = this.fromLineAndColumn(u.line, u.column)))
      } else if (r) o = this.fromLineAndColumn(t, r)
      else {
        o = t
        let f = this.fromOffset(o)
        ;((t = f.line), (r = f.col))
      }
      let h = this.origin(t, r, l, i)
      return (
        h
          ? (c = new qt(
              e,
              h.endLine === void 0
                ? h.line
                : { column: h.column, line: h.line },
              h.endLine === void 0
                ? h.column
                : { column: h.endColumn, line: h.endLine },
              h.source,
              h.file,
              s.plugin,
            ))
          : (c = new qt(
              e,
              l === void 0 ? t : { column: r, line: t },
              l === void 0 ? r : { column: i, line: l },
              this.css,
              this.file,
              s.plugin,
            )),
        (c.input = {
          column: r,
          endColumn: i,
          endLine: l,
          endOffset: a,
          line: t,
          offset: o,
          source: this.css,
        }),
        this.file &&
          (pe && (c.input.url = pe(this.file).toString()),
          (c.input.file = this.file)),
        c
      )
    }
    fromLineAndColumn(e, t) {
      return Ht(this)[e - 1] + t - 1
    }
    fromOffset(e) {
      let t = Ht(this),
        r = t[t.length - 1],
        s = 0
      if (e >= r) s = t.length - 1
      else {
        let i = t.length - 2,
          l
        for (; s < i; )
          if (((l = s + ((i - s) >> 1)), e < t[l])) i = l - 1
          else if (e >= t[l + 1]) s = l + 1
          else {
            s = l
            break
          }
      }
      return { col: e - t[s] + 1, line: s + 1 }
    }
    mapResolve(e) {
      return /^\w+:\/\//.test(e)
        ? e
        : Ze(this.map.consumer().sourceRoot || this.map.root || '.', e)
    }
    origin(e, t, r, s) {
      if (!this.map) return !1
      let i = this.map.consumer(),
        l = i.originalPositionFor({ column: t, line: e })
      if (!l.source) return !1
      let a
      typeof r == 'number' &&
        (a = i.originalPositionFor({ column: s, line: r }))
      let o
      Xe(l.source)
        ? (o = pe(l.source))
        : (o = new URL(
            l.source,
            this.map.consumer().sourceRoot || pe(this.map.mapFile),
          ))
      let c = {
        column: l.column,
        endColumn: a && a.column,
        endLine: a && a.line,
        line: l.line,
        url: o.toString(),
      }
      if (o.protocol === 'file:')
        if (It) c.file = It(o)
        else
          throw new Error(
            'file: protocol is not available in this PostCSS build',
          )
      let h = i.sourceContentFor(l.source)
      return (h && (c.source = h), c)
    }
    toJSON() {
      let e = {}
      for (let t of ['hasBOM', 'css', 'file', 'id'])
        this[t] != null && (e[t] = this[t])
      return (
        this.map &&
          ((e.map = { ...this.map }),
          e.map.consumerCache && (e.map.consumerCache = void 0)),
        e
      )
    }
  }
  var me = de
  ;((de.default = de), et && et.registerInput && et.registerInput(de))
  let Jt = F,
    Gt,
    Kt
  class I extends Jt {
    constructor(e) {
      ;(super(e), (this.type = 'root'), this.nodes || (this.nodes = []))
    }
    normalize(e, t, r) {
      let s = super.normalize(e)
      if (t) {
        if (r === 'prepend')
          this.nodes.length > 1
            ? (t.raws.before = this.nodes[1].raws.before)
            : delete t.raws.before
        else if (this.first !== t)
          for (let i of s) i.raws.before = t.raws.before
      }
      return s
    }
    removeChild(e, t) {
      let r = this.index(e)
      return (
        !t &&
          r === 0 &&
          this.nodes.length > 1 &&
          (this.nodes[1].raws.before = this.nodes[r].raws.before),
        super.removeChild(e)
      )
    }
    toResult(e = {}) {
      return new Gt(new Kt(), this, e).stringify()
    }
  }
  ;((I.registerLazyResult = (n) => {
    Gt = n
  }),
    (I.registerProcessor = (n) => {
      Kt = n
    }))
  var X = I
  ;((I.default = I), Jt.registerRoot(I))
  let Z = {
    comma(n) {
      return Z.split(n, [','], !0)
    },
    space(n) {
      let e = [
        ' ',
        `
`,
        '	',
      ]
      return Z.split(n, e)
    },
    split(n, e, t) {
      let r = [],
        s = '',
        i = !1,
        l = 0,
        a = !1,
        o = '',
        c = !1
      for (let h of n)
        (c
          ? (c = !1)
          : h === '\\'
            ? (c = !0)
            : a
              ? h === o && (a = !1)
              : h === '"' || h === "'"
                ? ((a = !0), (o = h))
                : h === '('
                  ? (l += 1)
                  : h === ')'
                    ? l > 0 && (l -= 1)
                    : l === 0 && e.includes(h) && (i = !0),
          i ? (s !== '' && r.push(s.trim()), (s = ''), (i = !1)) : (s += h))
      return ((t || s !== '') && r.push(s.trim()), r)
    },
  }
  var Qt = Z
  Z.default = Z
  let Yt = F,
    on = Qt
  class ge extends Yt {
    get selectors() {
      return on.comma(this.selector)
    }
    set selectors(e) {
      let t = this.selector ? this.selector.match(/,\s*/) : null,
        r = t ? t[0] : ',' + this.raw('between', 'beforeOpen')
      this.selector = e.join(r)
    }
    constructor(e) {
      ;(super(e), (this.type = 'rule'), this.nodes || (this.nodes = []))
    }
  }
  var rt = ge
  ;((ge.default = ge), Yt.registerRule(ge))
  let ln = Ge,
    an = ce,
    un = he,
    cn = me,
    hn = Wt,
    fn = X,
    pn = rt
  function ee(n, e) {
    if (Array.isArray(n)) return n.map((s) => ee(s))
    let { inputs: t, ...r } = n
    if (t) {
      e = []
      for (let s of t) {
        let i = { ...s, __proto__: cn.prototype }
        ;(i.map && (i.map = { ...i.map, __proto__: hn.prototype }), e.push(i))
      }
    }
    if ((r.nodes && (r.nodes = n.nodes.map((s) => ee(s, e))), r.source)) {
      let { inputId: s, ...i } = r.source
      ;((r.source = i), s != null && (r.source.input = e[s]))
    }
    if (r.type === 'root') return new fn(r)
    if (r.type === 'decl') return new un(r)
    if (r.type === 'rule') return new pn(r)
    if (r.type === 'comment') return new an(r)
    if (r.type === 'atrule') return new ln(r)
    throw new Error('Unknown node type: ' + n.type)
  }
  var dn = ee
  ee.default = ee
  let { dirname: ye, relative: Xt, resolve: Zt, sep: er } = T,
    { SourceMapConsumer: tr, SourceMapGenerator: we } = T,
    { pathToFileURL: rr } = T,
    mn = me,
    gn = Boolean(tr && we),
    yn = Boolean(ye && Zt && Xt && er)
  class wn {
    constructor(e, t, r, s) {
      ;((this.stringify = e),
        (this.mapOpts = r.map || {}),
        (this.root = t),
        (this.opts = r),
        (this.css = s),
        (this.originalCSS = s),
        (this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute),
        (this.memoizedFileURLs = new Map()),
        (this.memoizedPaths = new Map()),
        (this.memoizedURLs = new Map()))
    }
    addAnnotation() {
      let e
      this.isInline()
        ? (e =
            'data:application/json;base64,' +
            this.toBase64(this.map.toString()))
        : typeof this.mapOpts.annotation == 'string'
          ? (e = this.mapOpts.annotation)
          : typeof this.mapOpts.annotation == 'function'
            ? (e = this.mapOpts.annotation(this.opts.to, this.root))
            : (e = this.outputFile() + '.map')
      let t = `
`
      ;(this.css.includes(`\r
`) &&
        (t = `\r
`),
        (this.css += t + '/*# sourceMappingURL=' + e + ' */'))
    }
    applyPrevMaps() {
      for (let e of this.previous()) {
        let t = this.toUrl(this.path(e.file)),
          r = e.root || ye(e.file),
          s
        ;(this.mapOpts.sourcesContent === !1
          ? ((s = new tr(e.text)),
            s.sourcesContent && (s.sourcesContent = null))
          : (s = e.consumer()),
          this.map.applySourceMap(s, t, this.toUrl(this.path(r))))
      }
    }
    clearAnnotation() {
      if (this.mapOpts.annotation !== !1)
        if (this.root) {
          let e
          for (let t = this.root.nodes.length - 1; t >= 0; t--)
            ((e = this.root.nodes[t]),
              e.type === 'comment' &&
                e.text.startsWith('# sourceMappingURL=') &&
                this.root.removeChild(t))
        } else
          this.css &&
            (this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, ''))
    }
    generate() {
      if ((this.clearAnnotation(), yn && gn && this.isMap()))
        return this.generateMap()
      {
        let e = ''
        return (
          this.stringify(this.root, (t) => {
            e += t
          }),
          [e]
        )
      }
    }
    generateMap() {
      if (this.root) this.generateString()
      else if (this.previous().length === 1) {
        let e = this.previous()[0].consumer()
        ;((e.file = this.outputFile()),
          (this.map = we.fromSourceMap(e, { ignoreInvalidMapping: !0 })))
      } else
        ((this.map = new we({
          file: this.outputFile(),
          ignoreInvalidMapping: !0,
        })),
          this.map.addMapping({
            generated: { column: 0, line: 1 },
            original: { column: 0, line: 1 },
            source: this.opts.from
              ? this.toUrl(this.path(this.opts.from))
              : '<no source>',
          }))
      return (
        this.isSourcesContent() && this.setSourcesContent(),
        this.root && this.previous().length > 0 && this.applyPrevMaps(),
        this.isAnnotation() && this.addAnnotation(),
        this.isInline() ? [this.css] : [this.css, this.map]
      )
    }
    generateString() {
      ;((this.css = ''),
        (this.map = new we({
          file: this.outputFile(),
          ignoreInvalidMapping: !0,
        })))
      let e = 1,
        t = 1,
        r = '<no source>',
        s = {
          generated: { column: 0, line: 0 },
          original: { column: 0, line: 0 },
          source: '',
        },
        i,
        l
      this.stringify(this.root, (a, o, c) => {
        if (
          ((this.css += a),
          o &&
            c !== 'end' &&
            ((s.generated.line = e),
            (s.generated.column = t - 1),
            o.source && o.source.start
              ? ((s.source = this.sourcePath(o)),
                (s.original.line = o.source.start.line),
                (s.original.column = o.source.start.column - 1),
                this.map.addMapping(s))
              : ((s.source = r),
                (s.original.line = 1),
                (s.original.column = 0),
                this.map.addMapping(s))),
          (l = a.match(/\n/g)),
          l
            ? ((e += l.length),
              (i = a.lastIndexOf(`
`)),
              (t = a.length - i))
            : (t += a.length),
          o && c !== 'start')
        ) {
          let h = o.parent || { raws: {} }
          ;(!(o.type === 'decl' || (o.type === 'atrule' && !o.nodes)) ||
            o !== h.last ||
            h.raws.semicolon) &&
            (o.source && o.source.end
              ? ((s.source = this.sourcePath(o)),
                (s.original.line = o.source.end.line),
                (s.original.column = o.source.end.column - 1),
                (s.generated.line = e),
                (s.generated.column = t - 2),
                this.map.addMapping(s))
              : ((s.source = r),
                (s.original.line = 1),
                (s.original.column = 0),
                (s.generated.line = e),
                (s.generated.column = t - 1),
                this.map.addMapping(s)))
        }
      })
    }
    isAnnotation() {
      return this.isInline()
        ? !0
        : typeof this.mapOpts.annotation != 'undefined'
          ? this.mapOpts.annotation
          : this.previous().length
            ? this.previous().some((e) => e.annotation)
            : !0
    }
    isInline() {
      if (typeof this.mapOpts.inline != 'undefined') return this.mapOpts.inline
      let e = this.mapOpts.annotation
      return typeof e != 'undefined' && e !== !0
        ? !1
        : this.previous().length
          ? this.previous().some((t) => t.inline)
          : !0
    }
    isMap() {
      return typeof this.opts.map != 'undefined'
        ? !!this.opts.map
        : this.previous().length > 0
    }
    isSourcesContent() {
      return typeof this.mapOpts.sourcesContent != 'undefined'
        ? this.mapOpts.sourcesContent
        : this.previous().length
          ? this.previous().some((e) => e.withContent())
          : !0
    }
    outputFile() {
      return this.opts.to
        ? this.path(this.opts.to)
        : this.opts.from
          ? this.path(this.opts.from)
          : 'to.css'
    }
    path(e) {
      if (
        this.mapOpts.absolute ||
        e.charCodeAt(0) === 60 ||
        /^\w+:\/\//.test(e)
      )
        return e
      let t = this.memoizedPaths.get(e)
      if (t) return t
      let r = this.opts.to ? ye(this.opts.to) : '.'
      typeof this.mapOpts.annotation == 'string' &&
        (r = ye(Zt(r, this.mapOpts.annotation)))
      let s = Xt(r, e)
      return (this.memoizedPaths.set(e, s), s)
    }
    previous() {
      if (!this.previousMaps)
        if (((this.previousMaps = []), this.root))
          this.root.walk((e) => {
            if (e.source && e.source.input.map) {
              let t = e.source.input.map
              this.previousMaps.includes(t) || this.previousMaps.push(t)
            }
          })
        else {
          let e = new mn(this.originalCSS, this.opts)
          e.map && this.previousMaps.push(e.map)
        }
      return this.previousMaps
    }
    setSourcesContent() {
      let e = {}
      if (this.root)
        this.root.walk((t) => {
          if (t.source) {
            let r = t.source.input.from
            if (r && !e[r]) {
              e[r] = !0
              let s = this.usesFileUrls
                ? this.toFileUrl(r)
                : this.toUrl(this.path(r))
              this.map.setSourceContent(s, t.source.input.css)
            }
          }
        })
      else if (this.css) {
        let t = this.opts.from
          ? this.toUrl(this.path(this.opts.from))
          : '<no source>'
        this.map.setSourceContent(t, this.css)
      }
    }
    sourcePath(e) {
      return this.mapOpts.from
        ? this.toUrl(this.mapOpts.from)
        : this.usesFileUrls
          ? this.toFileUrl(e.source.input.from)
          : this.toUrl(this.path(e.source.input.from))
    }
    toBase64(e) {
      return Buffer
        ? Buffer.from(e).toString('base64')
        : window.btoa(unescape(encodeURIComponent(e)))
    }
    toFileUrl(e) {
      let t = this.memoizedFileURLs.get(e)
      if (t) return t
      if (rr) {
        let r = rr(e).toString()
        return (this.memoizedFileURLs.set(e, r), r)
      } else
        throw new Error(
          '`map.absolute` option is not available in this PostCSS build',
        )
    }
    toUrl(e) {
      let t = this.memoizedURLs.get(e)
      if (t) return t
      er === '\\' && (e = e.replace(/\\/g, '/'))
      let r = encodeURI(e).replace(/[#?]/g, encodeURIComponent)
      return (this.memoizedURLs.set(e, r), r)
    }
  }
  var sr = wn
  const st = "'".charCodeAt(0),
    nr = '"'.charCodeAt(0),
    be = '\\'.charCodeAt(0),
    ir = '/'.charCodeAt(0),
    ve = `
`.charCodeAt(0),
    te = ' '.charCodeAt(0),
    xe = '\f'.charCodeAt(0),
    Ce = '	'.charCodeAt(0),
    Se = '\r'.charCodeAt(0),
    bn = '['.charCodeAt(0),
    vn = ']'.charCodeAt(0),
    xn = '('.charCodeAt(0),
    Cn = ')'.charCodeAt(0),
    Sn = '{'.charCodeAt(0),
    kn = '}'.charCodeAt(0),
    An = ';'.charCodeAt(0),
    On = '*'.charCodeAt(0),
    Tn = ':'.charCodeAt(0),
    En = '@'.charCodeAt(0),
    ke = /[\t\n\f\r "#'()/;[\\\]{}]/g,
    Ae = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g,
    $n = /.[\r\n"'(/\\]/,
    or = /[\da-f]/i
  var Pn = function (e, t = {}) {
    let r = e.css.valueOf(),
      s = t.ignoreErrors,
      i,
      l,
      a,
      o,
      c,
      h,
      f,
      u,
      m,
      $,
      v = r.length,
      p = 0,
      x = [],
      C = []
    function D() {
      return p
    }
    function W(k) {
      throw e.error('Unclosed ' + k, p)
    }
    function Me() {
      return C.length === 0 && p >= v
    }
    function Ue(k) {
      if (C.length) return C.pop()
      if (p >= v) return
      let H = k ? k.ignoreUnclosed : !1
      switch (((i = r.charCodeAt(p)), i)) {
        case ve:
        case te:
        case Ce:
        case Se:
        case xe: {
          o = p
          do ((o += 1), (i = r.charCodeAt(o)))
          while (i === te || i === ve || i === Ce || i === Se || i === xe)
          ;((h = ['space', r.slice(p, o)]), (p = o - 1))
          break
        }
        case bn:
        case vn:
        case Sn:
        case kn:
        case Tn:
        case An:
        case Cn: {
          let ie = String.fromCharCode(i)
          h = [ie, ie, p]
          break
        }
        case xn: {
          if (
            (($ = x.length ? x.pop()[1] : ''),
            (m = r.charCodeAt(p + 1)),
            $ === 'url' &&
              m !== st &&
              m !== nr &&
              m !== te &&
              m !== ve &&
              m !== Ce &&
              m !== xe &&
              m !== Se)
          ) {
            o = p
            do {
              if (((f = !1), (o = r.indexOf(')', o + 1)), o === -1))
                if (s || H) {
                  o = p
                  break
                } else W('bracket')
              for (u = o; r.charCodeAt(u - 1) === be; ) ((u -= 1), (f = !f))
            } while (f)
            ;((h = ['brackets', r.slice(p, o + 1), p, o]), (p = o))
          } else
            ((o = r.indexOf(')', p + 1)),
              (l = r.slice(p, o + 1)),
              o === -1 || $n.test(l)
                ? (h = ['(', '(', p])
                : ((h = ['brackets', l, p, o]), (p = o)))
          break
        }
        case st:
        case nr: {
          ;((c = i === st ? "'" : '"'), (o = p))
          do {
            if (((f = !1), (o = r.indexOf(c, o + 1)), o === -1))
              if (s || H) {
                o = p + 1
                break
              } else W('string')
            for (u = o; r.charCodeAt(u - 1) === be; ) ((u -= 1), (f = !f))
          } while (f)
          ;((h = ['string', r.slice(p, o + 1), p, o]), (p = o))
          break
        }
        case En: {
          ;((ke.lastIndex = p + 1),
            ke.test(r),
            ke.lastIndex === 0 ? (o = r.length - 1) : (o = ke.lastIndex - 2),
            (h = ['at-word', r.slice(p, o + 1), p, o]),
            (p = o))
          break
        }
        case be: {
          for (o = p, a = !0; r.charCodeAt(o + 1) === be; ) ((o += 1), (a = !a))
          if (
            ((i = r.charCodeAt(o + 1)),
            a &&
              i !== ir &&
              i !== te &&
              i !== ve &&
              i !== Ce &&
              i !== Se &&
              i !== xe &&
              ((o += 1), or.test(r.charAt(o))))
          ) {
            for (; or.test(r.charAt(o + 1)); ) o += 1
            r.charCodeAt(o + 1) === te && (o += 1)
          }
          ;((h = ['word', r.slice(p, o + 1), p, o]), (p = o))
          break
        }
        default: {
          i === ir && r.charCodeAt(p + 1) === On
            ? ((o = r.indexOf('*/', p + 2) + 1),
              o === 0 && (s || H ? (o = r.length) : W('comment')),
              (h = ['comment', r.slice(p, o + 1), p, o]),
              (p = o))
            : ((Ae.lastIndex = p + 1),
              Ae.test(r),
              Ae.lastIndex === 0 ? (o = r.length - 1) : (o = Ae.lastIndex - 2),
              (h = ['word', r.slice(p, o + 1), p, o]),
              x.push(h),
              (p = o))
          break
        }
      }
      return (p++, h)
    }
    function P(k) {
      C.push(k)
    }
    return { back: P, endOfFile: Me, nextToken: Ue, position: D }
  }
  let _n = Ge,
    Rn = ce,
    Dn = he,
    Nn = X,
    lr = rt,
    Mn = Pn
  const ar = { empty: !0, space: !0 }
  function Un(n) {
    for (let e = n.length - 1; e >= 0; e--) {
      let t = n[e],
        r = t[3] || t[2]
      if (r) return r
    }
  }
  class Ln {
    constructor(e) {
      ;((this.input = e),
        (this.root = new Nn()),
        (this.current = this.root),
        (this.spaces = ''),
        (this.semicolon = !1),
        this.createTokenizer(),
        (this.root.source = {
          input: e,
          start: { column: 1, line: 1, offset: 0 },
        }))
    }
    atrule(e) {
      let t = new _n()
      ;((t.name = e[1].slice(1)),
        t.name === '' && this.unnamedAtrule(t, e),
        this.init(t, e[2]))
      let r,
        s,
        i,
        l = !1,
        a = !1,
        o = [],
        c = []
      for (; !this.tokenizer.endOfFile(); ) {
        if (
          ((e = this.tokenizer.nextToken()),
          (r = e[0]),
          r === '(' || r === '['
            ? c.push(r === '(' ? ')' : ']')
            : r === '{' && c.length > 0
              ? c.push('}')
              : r === c[c.length - 1] && c.pop(),
          c.length === 0)
        )
          if (r === ';') {
            ;((t.source.end = this.getPosition(e[2])),
              t.source.end.offset++,
              (this.semicolon = !0))
            break
          } else if (r === '{') {
            a = !0
            break
          } else if (r === '}') {
            if (o.length > 0) {
              for (i = o.length - 1, s = o[i]; s && s[0] === 'space'; )
                s = o[--i]
              s &&
                ((t.source.end = this.getPosition(s[3] || s[2])),
                t.source.end.offset++)
            }
            this.end(e)
            break
          } else o.push(e)
        else o.push(e)
        if (this.tokenizer.endOfFile()) {
          l = !0
          break
        }
      }
      ;((t.raws.between = this.spacesAndCommentsFromEnd(o)),
        o.length
          ? ((t.raws.afterName = this.spacesAndCommentsFromStart(o)),
            this.raw(t, 'params', o),
            l &&
              ((e = o[o.length - 1]),
              (t.source.end = this.getPosition(e[3] || e[2])),
              t.source.end.offset++,
              (this.spaces = t.raws.between),
              (t.raws.between = '')))
          : ((t.raws.afterName = ''), (t.params = '')),
        a && ((t.nodes = []), (this.current = t)))
    }
    checkMissedSemicolon(e) {
      let t = this.colon(e)
      if (t === !1) return
      let r = 0,
        s
      for (
        let i = t - 1;
        i >= 0 && ((s = e[i]), !(s[0] !== 'space' && ((r += 1), r === 2)));
        i--
      );
      throw this.input.error(
        'Missed semicolon',
        s[0] === 'word' ? s[3] + 1 : s[2],
      )
    }
    colon(e) {
      let t = 0,
        r,
        s,
        i
      for (let [l, a] of e.entries()) {
        if (
          ((s = a),
          (i = s[0]),
          i === '(' && (t += 1),
          i === ')' && (t -= 1),
          t === 0 && i === ':')
        )
          if (!r) this.doubleColon(s)
          else {
            if (r[0] === 'word' && r[1] === 'progid') continue
            return l
          }
        r = s
      }
      return !1
    }
    comment(e) {
      let t = new Rn()
      ;(this.init(t, e[2]),
        (t.source.end = this.getPosition(e[3] || e[2])),
        t.source.end.offset++)
      let r = e[1].slice(2, -2)
      if (/^\s*$/.test(r))
        ((t.text = ''), (t.raws.left = r), (t.raws.right = ''))
      else {
        let s = r.match(/^(\s*)([^]*\S)(\s*)$/)
        ;((t.text = s[2]), (t.raws.left = s[1]), (t.raws.right = s[3]))
      }
    }
    createTokenizer() {
      this.tokenizer = Mn(this.input)
    }
    decl(e, t) {
      let r = new Dn()
      this.init(r, e[0][2])
      let s = e[e.length - 1]
      for (
        s[0] === ';' && ((this.semicolon = !0), e.pop()),
          r.source.end = this.getPosition(s[3] || s[2] || Un(e)),
          r.source.end.offset++;
        e[0][0] !== 'word';
      )
        (e.length === 1 && this.unknownWord(e), (r.raws.before += e.shift()[1]))
      for (
        r.source.start = this.getPosition(e[0][2]), r.prop = '';
        e.length;
      ) {
        let c = e[0][0]
        if (c === ':' || c === 'space' || c === 'comment') break
        r.prop += e.shift()[1]
      }
      r.raws.between = ''
      let i
      for (; e.length; )
        if (((i = e.shift()), i[0] === ':')) {
          r.raws.between += i[1]
          break
        } else
          (i[0] === 'word' && /\w/.test(i[1]) && this.unknownWord([i]),
            (r.raws.between += i[1]))
      ;(r.prop[0] === '_' || r.prop[0] === '*') &&
        ((r.raws.before += r.prop[0]), (r.prop = r.prop.slice(1)))
      let l = [],
        a
      for (; e.length && ((a = e[0][0]), !(a !== 'space' && a !== 'comment')); )
        l.push(e.shift())
      this.precheckMissedSemicolon(e)
      for (let c = e.length - 1; c >= 0; c--) {
        if (((i = e[c]), i[1].toLowerCase() === '!important')) {
          r.important = !0
          let h = this.stringFrom(e, c)
          ;((h = this.spacesFromEnd(e) + h),
            h !== ' !important' && (r.raws.important = h))
          break
        } else if (i[1].toLowerCase() === 'important') {
          let h = e.slice(0),
            f = ''
          for (let u = c; u > 0; u--) {
            let m = h[u][0]
            if (f.trim().startsWith('!') && m !== 'space') break
            f = h.pop()[1] + f
          }
          f.trim().startsWith('!') &&
            ((r.important = !0), (r.raws.important = f), (e = h))
        }
        if (i[0] !== 'space' && i[0] !== 'comment') break
      }
      ;(e.some((c) => c[0] !== 'space' && c[0] !== 'comment') &&
        ((r.raws.between += l.map((c) => c[1]).join('')), (l = [])),
        this.raw(r, 'value', l.concat(e), t),
        r.value.includes(':') && !t && this.checkMissedSemicolon(e))
    }
    doubleColon(e) {
      throw this.input.error(
        'Double colon',
        { offset: e[2] },
        { offset: e[2] + e[1].length },
      )
    }
    emptyRule(e) {
      let t = new lr()
      ;(this.init(t, e[2]),
        (t.selector = ''),
        (t.raws.between = ''),
        (this.current = t))
    }
    end(e) {
      ;(this.current.nodes &&
        this.current.nodes.length &&
        (this.current.raws.semicolon = this.semicolon),
        (this.semicolon = !1),
        (this.current.raws.after =
          (this.current.raws.after || '') + this.spaces),
        (this.spaces = ''),
        this.current.parent
          ? ((this.current.source.end = this.getPosition(e[2])),
            this.current.source.end.offset++,
            (this.current = this.current.parent))
          : this.unexpectedClose(e))
    }
    endFile() {
      ;(this.current.parent && this.unclosedBlock(),
        this.current.nodes &&
          this.current.nodes.length &&
          (this.current.raws.semicolon = this.semicolon),
        (this.current.raws.after =
          (this.current.raws.after || '') + this.spaces),
        (this.root.source.end = this.getPosition(this.tokenizer.position())))
    }
    freeSemicolon(e) {
      if (((this.spaces += e[1]), this.current.nodes)) {
        let t = this.current.nodes[this.current.nodes.length - 1]
        t &&
          t.type === 'rule' &&
          !t.raws.ownSemicolon &&
          ((t.raws.ownSemicolon = this.spaces),
          (this.spaces = ''),
          (t.source.end = this.getPosition(e[2])),
          (t.source.end.offset += t.raws.ownSemicolon.length))
      }
    }
    getPosition(e) {
      let t = this.input.fromOffset(e)
      return { column: t.col, line: t.line, offset: e }
    }
    init(e, t) {
      ;(this.current.push(e),
        (e.source = { input: this.input, start: this.getPosition(t) }),
        (e.raws.before = this.spaces),
        (this.spaces = ''),
        e.type !== 'comment' && (this.semicolon = !1))
    }
    other(e) {
      let t = !1,
        r = null,
        s = !1,
        i = null,
        l = [],
        a = e[1].startsWith('--'),
        o = [],
        c = e
      for (; c; ) {
        if (((r = c[0]), o.push(c), r === '(' || r === '['))
          (i || (i = c), l.push(r === '(' ? ')' : ']'))
        else if (a && s && r === '{') (i || (i = c), l.push('}'))
        else if (l.length === 0)
          if (r === ';')
            if (s) {
              this.decl(o, a)
              return
            } else break
          else if (r === '{') {
            this.rule(o)
            return
          } else if (r === '}') {
            ;(this.tokenizer.back(o.pop()), (t = !0))
            break
          } else r === ':' && (s = !0)
        else r === l[l.length - 1] && (l.pop(), l.length === 0 && (i = null))
        c = this.tokenizer.nextToken()
      }
      if (
        (this.tokenizer.endOfFile() && (t = !0),
        l.length > 0 && this.unclosedBracket(i),
        t && s)
      ) {
        if (!a)
          for (
            ;
            o.length &&
            ((c = o[o.length - 1][0]), !(c !== 'space' && c !== 'comment'));
          )
            this.tokenizer.back(o.pop())
        this.decl(o, a)
      } else this.unknownWord(o)
    }
    parse() {
      let e
      for (; !this.tokenizer.endOfFile(); )
        switch (((e = this.tokenizer.nextToken()), e[0])) {
          case 'space':
            this.spaces += e[1]
            break
          case ';':
            this.freeSemicolon(e)
            break
          case '}':
            this.end(e)
            break
          case 'comment':
            this.comment(e)
            break
          case 'at-word':
            this.atrule(e)
            break
          case '{':
            this.emptyRule(e)
            break
          default:
            this.other(e)
            break
        }
      this.endFile()
    }
    precheckMissedSemicolon() {}
    raw(e, t, r, s) {
      let i,
        l,
        a = r.length,
        o = '',
        c = !0,
        h,
        f
      for (let u = 0; u < a; u += 1)
        ((i = r[u]),
          (l = i[0]),
          l === 'space' && u === a - 1 && !s
            ? (c = !1)
            : l === 'comment'
              ? ((f = r[u - 1] ? r[u - 1][0] : 'empty'),
                (h = r[u + 1] ? r[u + 1][0] : 'empty'),
                !ar[f] && !ar[h]
                  ? o.slice(-1) === ','
                    ? (c = !1)
                    : (o += i[1])
                  : (c = !1))
              : (o += i[1]))
      if (!c) {
        let u = r.reduce((m, $) => m + $[1], '')
        e.raws[t] = { raw: u, value: o }
      }
      e[t] = o
    }
    rule(e) {
      e.pop()
      let t = new lr()
      ;(this.init(t, e[0][2]),
        (t.raws.between = this.spacesAndCommentsFromEnd(e)),
        this.raw(t, 'selector', e),
        (this.current = t))
    }
    spacesAndCommentsFromEnd(e) {
      let t,
        r = ''
      for (
        ;
        e.length &&
        ((t = e[e.length - 1][0]), !(t !== 'space' && t !== 'comment'));
      )
        r = e.pop()[1] + r
      return r
    }
    spacesAndCommentsFromStart(e) {
      let t,
        r = ''
      for (; e.length && ((t = e[0][0]), !(t !== 'space' && t !== 'comment')); )
        r += e.shift()[1]
      return r
    }
    spacesFromEnd(e) {
      let t,
        r = ''
      for (; e.length && ((t = e[e.length - 1][0]), t === 'space'); )
        r = e.pop()[1] + r
      return r
    }
    stringFrom(e, t) {
      let r = ''
      for (let s = t; s < e.length; s++) r += e[s][1]
      return (e.splice(t, e.length - t), r)
    }
    unclosedBlock() {
      let e = this.current.source.start
      throw this.input.error('Unclosed block', e.line, e.column)
    }
    unclosedBracket(e) {
      throw this.input.error(
        'Unclosed bracket',
        { offset: e[2] },
        { offset: e[2] + 1 },
      )
    }
    unexpectedClose(e) {
      throw this.input.error(
        'Unexpected }',
        { offset: e[2] },
        { offset: e[2] + 1 },
      )
    }
    unknownWord(e) {
      throw this.input.error(
        'Unknown word ' + e[0][1],
        { offset: e[0][2] },
        { offset: e[0][2] + e[0][1].length },
      )
    }
    unnamedAtrule(e, t) {
      throw this.input.error(
        'At-rule without name',
        { offset: t[2] },
        { offset: t[2] + t[1].length },
      )
    }
  }
  var Bn = Ln
  let jn = F,
    Fn = me,
    zn = Bn
  function Oe(n, e) {
    let t = new Fn(n, e),
      r = new zn(t)
    try {
      r.parse()
    } catch (s) {
      throw s
    }
    return r.root
  }
  var nt = Oe
  ;((Oe.default = Oe), jn.registerParse(Oe))
  class it {
    constructor(e, t = {}) {
      if (((this.type = 'warning'), (this.text = e), t.node && t.node.source)) {
        let r = t.node.rangeBy(t)
        ;((this.line = r.start.line),
          (this.column = r.start.column),
          (this.endLine = r.end.line),
          (this.endColumn = r.end.column))
      }
      for (let r in t) this[r] = t[r]
    }
    toString() {
      return this.node
        ? this.node.error(this.text, {
            index: this.index,
            plugin: this.plugin,
            word: this.word,
          }).message
        : this.plugin
          ? this.plugin + ': ' + this.text
          : this.text
    }
  }
  var ur = it
  it.default = it
  let Wn = ur
  class ot {
    get content() {
      return this.css
    }
    constructor(e, t, r) {
      ;((this.processor = e),
        (this.messages = []),
        (this.root = t),
        (this.opts = r),
        (this.css = ''),
        (this.map = void 0))
    }
    toString() {
      return this.css
    }
    warn(e, t = {}) {
      t.plugin ||
        (this.lastPlugin &&
          this.lastPlugin.postcssPlugin &&
          (t.plugin = this.lastPlugin.postcssPlugin))
      let r = new Wn(e, t)
      return (this.messages.push(r), r)
    }
    warnings() {
      return this.messages.filter((e) => e.type === 'warning')
    }
  }
  var lt = ot
  ot.default = ot
  let In = F,
    qn = Ke,
    Vn = sr,
    Hn = nt,
    cr = lt,
    Jn = X,
    Gn = ae,
    { isClean: _, my: Kn } = K
  const Qn = {
      atrule: 'AtRule',
      comment: 'Comment',
      decl: 'Declaration',
      document: 'Document',
      root: 'Root',
      rule: 'Rule',
    },
    Yn = {
      AtRule: !0,
      AtRuleExit: !0,
      Comment: !0,
      CommentExit: !0,
      Declaration: !0,
      DeclarationExit: !0,
      Document: !0,
      DocumentExit: !0,
      Once: !0,
      OnceExit: !0,
      postcssPlugin: !0,
      prepare: !0,
      Root: !0,
      RootExit: !0,
      Rule: !0,
      RuleExit: !0,
    },
    Xn = { Once: !0, postcssPlugin: !0, prepare: !0 },
    q = 0
  function re(n) {
    return typeof n == 'object' && typeof n.then == 'function'
  }
  function hr(n) {
    let e = !1,
      t = Qn[n.type]
    return (
      n.type === 'decl'
        ? (e = n.prop.toLowerCase())
        : n.type === 'atrule' && (e = n.name.toLowerCase()),
      e && n.append
        ? [t, t + '-' + e, q, t + 'Exit', t + 'Exit-' + e]
        : e
          ? [t, t + '-' + e, t + 'Exit', t + 'Exit-' + e]
          : n.append
            ? [t, q, t + 'Exit']
            : [t, t + 'Exit']
    )
  }
  function fr(n) {
    let e
    return (
      n.type === 'document'
        ? (e = ['Document', q, 'DocumentExit'])
        : n.type === 'root'
          ? (e = ['Root', q, 'RootExit'])
          : (e = hr(n)),
      {
        eventIndex: 0,
        events: e,
        iterator: 0,
        node: n,
        visitorIndex: 0,
        visitors: [],
      }
    )
  }
  function at(n) {
    return ((n[_] = !1), n.nodes && n.nodes.forEach((e) => at(e)), n)
  }
  let ut = {}
  class U {
    get content() {
      return this.stringify().content
    }
    get css() {
      return this.stringify().css
    }
    get map() {
      return this.stringify().map
    }
    get messages() {
      return this.sync().messages
    }
    get opts() {
      return this.result.opts
    }
    get processor() {
      return this.result.processor
    }
    get root() {
      return this.sync().root
    }
    get [Symbol.toStringTag]() {
      return 'LazyResult'
    }
    constructor(e, t, r) {
      ;((this.stringified = !1), (this.processed = !1))
      let s
      if (
        typeof t == 'object' &&
        t !== null &&
        (t.type === 'root' || t.type === 'document')
      )
        s = at(t)
      else if (t instanceof U || t instanceof cr)
        ((s = at(t.root)),
          t.map &&
            (typeof r.map == 'undefined' && (r.map = {}),
            r.map.inline || (r.map.inline = !1),
            (r.map.prev = t.map)))
      else {
        let i = Hn
        ;(r.syntax && (i = r.syntax.parse),
          r.parser && (i = r.parser),
          i.parse && (i = i.parse))
        try {
          s = i(t, r)
        } catch (l) {
          ;((this.processed = !0), (this.error = l))
        }
        s && !s[Kn] && In.rebuild(s)
      }
      ;((this.result = new cr(e, s, r)),
        (this.helpers = { ...ut, postcss: ut, result: this.result }),
        (this.plugins = this.processor.plugins.map((i) =>
          typeof i == 'object' && i.prepare
            ? { ...i, ...i.prepare(this.result) }
            : i,
        )))
    }
    async() {
      return this.error
        ? Promise.reject(this.error)
        : this.processed
          ? Promise.resolve(this.result)
          : (this.processing || (this.processing = this.runAsync()),
            this.processing)
    }
    catch(e) {
      return this.async().catch(e)
    }
    finally(e) {
      return this.async().then(e, e)
    }
    getAsyncError() {
      throw new Error('Use process(css).then(cb) to work with async plugins')
    }
    handleError(e, t) {
      let r = this.result.lastPlugin
      try {
        ;(t && t.addToError(e),
          (this.error = e),
          e.name === 'CssSyntaxError' && !e.plugin
            ? ((e.plugin = r.postcssPlugin), e.setMessage())
            : r.postcssVersion)
      } catch (s) {
        console && console.error && console.error(s)
      }
      return e
    }
    prepareVisitors() {
      this.listeners = {}
      let e = (t, r, s) => {
        ;(this.listeners[r] || (this.listeners[r] = []),
          this.listeners[r].push([t, s]))
      }
      for (let t of this.plugins)
        if (typeof t == 'object')
          for (let r in t) {
            if (!Yn[r] && /^[A-Z]/.test(r))
              throw new Error(
                `Unknown event ${r} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`,
              )
            if (!Xn[r])
              if (typeof t[r] == 'object')
                for (let s in t[r])
                  s === '*'
                    ? e(t, r, t[r][s])
                    : e(t, r + '-' + s.toLowerCase(), t[r][s])
              else typeof t[r] == 'function' && e(t, r, t[r])
          }
      this.hasListener = Object.keys(this.listeners).length > 0
    }
    async runAsync() {
      this.plugin = 0
      for (let e = 0; e < this.plugins.length; e++) {
        let t = this.plugins[e],
          r = this.runOnRoot(t)
        if (re(r))
          try {
            await r
          } catch (s) {
            throw this.handleError(s)
          }
      }
      if ((this.prepareVisitors(), this.hasListener)) {
        let e = this.result.root
        for (; !e[_]; ) {
          e[_] = !0
          let t = [fr(e)]
          for (; t.length > 0; ) {
            let r = this.visitTick(t)
            if (re(r))
              try {
                await r
              } catch (s) {
                let i = t[t.length - 1].node
                throw this.handleError(s, i)
              }
          }
        }
        if (this.listeners.OnceExit)
          for (let [t, r] of this.listeners.OnceExit) {
            this.result.lastPlugin = t
            try {
              if (e.type === 'document') {
                let s = e.nodes.map((i) => r(i, this.helpers))
                await Promise.all(s)
              } else await r(e, this.helpers)
            } catch (s) {
              throw this.handleError(s)
            }
          }
      }
      return ((this.processed = !0), this.stringify())
    }
    runOnRoot(e) {
      this.result.lastPlugin = e
      try {
        if (typeof e == 'object' && e.Once) {
          if (this.result.root.type === 'document') {
            let t = this.result.root.nodes.map((r) => e.Once(r, this.helpers))
            return re(t[0]) ? Promise.all(t) : t
          }
          return e.Once(this.result.root, this.helpers)
        } else if (typeof e == 'function')
          return e(this.result.root, this.result)
      } catch (t) {
        throw this.handleError(t)
      }
    }
    stringify() {
      if (this.error) throw this.error
      if (this.stringified) return this.result
      ;((this.stringified = !0), this.sync())
      let e = this.result.opts,
        t = Gn
      ;(e.syntax && (t = e.syntax.stringify),
        e.stringifier && (t = e.stringifier),
        t.stringify && (t = t.stringify))
      let s = new Vn(t, this.result.root, this.result.opts).generate()
      return ((this.result.css = s[0]), (this.result.map = s[1]), this.result)
    }
    sync() {
      if (this.error) throw this.error
      if (this.processed) return this.result
      if (((this.processed = !0), this.processing)) throw this.getAsyncError()
      for (let e of this.plugins) {
        let t = this.runOnRoot(e)
        if (re(t)) throw this.getAsyncError()
      }
      if ((this.prepareVisitors(), this.hasListener)) {
        let e = this.result.root
        for (; !e[_]; ) ((e[_] = !0), this.walkSync(e))
        if (this.listeners.OnceExit)
          if (e.type === 'document')
            for (let t of e.nodes) this.visitSync(this.listeners.OnceExit, t)
          else this.visitSync(this.listeners.OnceExit, e)
      }
      return this.result
    }
    then(e, t) {
      return this.async().then(e, t)
    }
    toString() {
      return this.css
    }
    visitSync(e, t) {
      for (let [r, s] of e) {
        this.result.lastPlugin = r
        let i
        try {
          i = s(t, this.helpers)
        } catch (l) {
          throw this.handleError(l, t.proxyOf)
        }
        if (t.type !== 'root' && t.type !== 'document' && !t.parent) return !0
        if (re(i)) throw this.getAsyncError()
      }
    }
    visitTick(e) {
      let t = e[e.length - 1],
        { node: r, visitors: s } = t
      if (r.type !== 'root' && r.type !== 'document' && !r.parent) {
        e.pop()
        return
      }
      if (s.length > 0 && t.visitorIndex < s.length) {
        let [l, a] = s[t.visitorIndex]
        ;((t.visitorIndex += 1),
          t.visitorIndex === s.length &&
            ((t.visitors = []), (t.visitorIndex = 0)),
          (this.result.lastPlugin = l))
        try {
          return a(r.toProxy(), this.helpers)
        } catch (o) {
          throw this.handleError(o, r)
        }
      }
      if (t.iterator !== 0) {
        let l = t.iterator,
          a
        for (; (a = r.nodes[r.indexes[l]]); )
          if (((r.indexes[l] += 1), !a[_])) {
            ;((a[_] = !0), e.push(fr(a)))
            return
          }
        ;((t.iterator = 0), delete r.indexes[l])
      }
      let i = t.events
      for (; t.eventIndex < i.length; ) {
        let l = i[t.eventIndex]
        if (((t.eventIndex += 1), l === q)) {
          r.nodes &&
            r.nodes.length &&
            ((r[_] = !0), (t.iterator = r.getIterator()))
          return
        } else if (this.listeners[l]) {
          t.visitors = this.listeners[l]
          return
        }
      }
      e.pop()
    }
    walkSync(e) {
      e[_] = !0
      let t = hr(e)
      for (let r of t)
        if (r === q)
          e.nodes &&
            e.each((s) => {
              s[_] || this.walkSync(s)
            })
        else {
          let s = this.listeners[r]
          if (s && this.visitSync(s, e.toProxy())) return
        }
    }
    warnings() {
      return this.sync().warnings()
    }
  }
  U.registerPostcss = (n) => {
    ut = n
  }
  var pr = U
  ;((U.default = U), Jn.registerLazyResult(U), qn.registerLazyResult(U))
  let Zn = sr,
    ei = nt
  const ti = lt
  let ri = ae
  class ct {
    get content() {
      return this.result.css
    }
    get css() {
      return this.result.css
    }
    get map() {
      return this.result.map
    }
    get messages() {
      return []
    }
    get opts() {
      return this.result.opts
    }
    get processor() {
      return this.result.processor
    }
    get root() {
      if (this._root) return this._root
      let e,
        t = ei
      try {
        e = t(this._css, this._opts)
      } catch (r) {
        this.error = r
      }
      if (this.error) throw this.error
      return ((this._root = e), e)
    }
    get [Symbol.toStringTag]() {
      return 'NoWorkResult'
    }
    constructor(e, t, r) {
      ;((t = t.toString()),
        (this.stringified = !1),
        (this._processor = e),
        (this._css = t),
        (this._opts = r),
        (this._map = void 0))
      let s,
        i = ri
      ;((this.result = new ti(this._processor, s, this._opts)),
        (this.result.css = t))
      let l = this
      Object.defineProperty(this.result, 'root', {
        get() {
          return l.root
        },
      })
      let a = new Zn(i, s, this._opts, t)
      if (a.isMap()) {
        let [o, c] = a.generate()
        ;(o && (this.result.css = o), c && (this.result.map = c))
      } else (a.clearAnnotation(), (this.result.css = a.css))
    }
    async() {
      return this.error
        ? Promise.reject(this.error)
        : Promise.resolve(this.result)
    }
    catch(e) {
      return this.async().catch(e)
    }
    finally(e) {
      return this.async().then(e, e)
    }
    sync() {
      if (this.error) throw this.error
      return this.result
    }
    then(e, t) {
      return this.async().then(e, t)
    }
    toString() {
      return this._css
    }
    warnings() {
      return []
    }
  }
  var si = ct
  ct.default = ct
  let ni = Ke,
    ii = pr,
    oi = si,
    li = X
  class se {
    constructor(e = []) {
      ;((this.version = '8.5.6'), (this.plugins = this.normalize(e)))
    }
    normalize(e) {
      let t = []
      for (let r of e)
        if (
          (r.postcss === !0 ? (r = r()) : r.postcss && (r = r.postcss),
          typeof r == 'object' && Array.isArray(r.plugins))
        )
          t = t.concat(r.plugins)
        else if (typeof r == 'object' && r.postcssPlugin) t.push(r)
        else if (typeof r == 'function') t.push(r)
        else if (!(typeof r == 'object' && (r.parse || r.stringify)))
          throw new Error(r + ' is not a PostCSS plugin')
      return t
    }
    process(e, t = {}) {
      return !this.plugins.length && !t.parser && !t.stringifier && !t.syntax
        ? new oi(this, e, t)
        : new ii(this, e, t)
    }
    use(e) {
      return ((this.plugins = this.plugins.concat(this.normalize([e]))), this)
    }
  }
  var ai = se
  ;((se.default = se), li.registerProcessor(se), ni.registerProcessor(se))
  let dr = Ge,
    mr = ce,
    ui = F,
    ci = je,
    gr = he,
    yr = Ke,
    hi = dn,
    fi = me,
    pi = pr,
    di = Qt,
    mi = ue,
    gi = nt,
    ht = ai,
    yi = lt,
    wr = X,
    br = rt,
    wi = ae,
    bi = ur
  function y(...n) {
    return (n.length === 1 && Array.isArray(n[0]) && (n = n[0]), new ht(n))
  }
  ;((y.plugin = function (e, t) {
    let r = !1
    function s(...l) {
      console &&
        console.warn &&
        !r &&
        ((r = !0),
        console.warn(
          e +
            `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`,
        ),
        {}.LANG &&
          {}.LANG.startsWith('cn') &&
          console.warn(
            e +
              `: \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:
https://www.w3ctech.com/topic/2226`,
          ))
      let a = t(...l)
      return ((a.postcssPlugin = e), (a.postcssVersion = new ht().version), a)
    }
    let i
    return (
      Object.defineProperty(s, 'postcss', {
        get() {
          return (i || (i = s()), i)
        },
      }),
      (s.process = function (l, a, o) {
        return y([s(o)]).process(l, a)
      }),
      s
    )
  }),
    (y.stringify = wi),
    (y.parse = gi),
    (y.fromJSON = hi),
    (y.list = di),
    (y.comment = (n) => new mr(n)),
    (y.atRule = (n) => new dr(n)),
    (y.decl = (n) => new gr(n)),
    (y.rule = (n) => new br(n)),
    (y.root = (n) => new wr(n)),
    (y.document = (n) => new yr(n)),
    (y.CssSyntaxError = ci),
    (y.Declaration = gr),
    (y.Container = ui),
    (y.Processor = ht),
    (y.Document = yr),
    (y.Comment = mr),
    (y.Warning = bi),
    (y.AtRule = dr),
    (y.Result = yi),
    (y.Input = fi),
    (y.Rule = br),
    (y.Root = wr),
    (y.Node = mi),
    pi.registerPostcss(y))
  var w = y
  ;((y.default = y),
    w.stringify,
    w.fromJSON,
    w.plugin,
    w.parse,
    w.list,
    w.document,
    w.comment,
    w.atRule,
    w.rule,
    w.decl,
    w.root,
    w.CssSyntaxError,
    w.Declaration,
    w.Container,
    w.Processor,
    w.Document,
    w.Comment,
    w.Warning,
    w.AtRule,
    w.Result,
    w.Input,
    w.Rule,
    w.Root,
    w.Node)
  let ft = function (n, e) {
    let t = new n.constructor()
    for (let r in n) {
      if (!n.hasOwnProperty(r)) continue
      let s = n[r],
        i = typeof s
      r === 'parent' && i === 'object'
        ? e && (t[r] = e)
        : r === 'source'
          ? (t[r] = s)
          : s instanceof Array
            ? (t[r] = s.map((l) => ft(l, t)))
            : r !== 'before' &&
              r !== 'after' &&
              r !== 'between' &&
              r !== 'semicolon' &&
              (i === 'object' && s !== null && (s = ft(s)), (t[r] = s))
    }
    return t
  }
  var R = class {
    constructor(e) {
      ;((e = e || {}), (this.raws = { before: '', after: '' }))
      for (let t in e) this[t] = e[t]
    }
    remove() {
      return (
        this.parent && this.parent.removeChild(this),
        (this.parent = void 0),
        this
      )
    }
    toString() {
      return [this.raws.before, String(this.value), this.raws.after].join('')
    }
    clone(e) {
      e = e || {}
      let t = ft(this)
      for (let r in e) t[r] = e[r]
      return t
    }
    cloneBefore(e) {
      e = e || {}
      let t = this.clone(e)
      return (this.parent.insertBefore(this, t), t)
    }
    cloneAfter(e) {
      e = e || {}
      let t = this.clone(e)
      return (this.parent.insertAfter(this, t), t)
    }
    replaceWith() {
      let e = Array.prototype.slice.call(arguments)
      if (this.parent) {
        for (let t of e) this.parent.insertBefore(this, t)
        this.remove()
      }
      return this
    }
    moveTo(e) {
      return (
        this.cleanRaws(this.root() === e.root()),
        this.remove(),
        e.append(this),
        this
      )
    }
    moveBefore(e) {
      return (
        this.cleanRaws(this.root() === e.root()),
        this.remove(),
        e.parent.insertBefore(e, this),
        this
      )
    }
    moveAfter(e) {
      return (
        this.cleanRaws(this.root() === e.root()),
        this.remove(),
        e.parent.insertAfter(e, this),
        this
      )
    }
    next() {
      let e = this.parent.index(this)
      return this.parent.nodes[e + 1]
    }
    prev() {
      let e = this.parent.index(this)
      return this.parent.nodes[e - 1]
    }
    toJSON() {
      let e = {}
      for (let t in this) {
        if (!this.hasOwnProperty(t) || t === 'parent') continue
        let r = this[t]
        r instanceof Array
          ? (e[t] = r.map((s) =>
              typeof s == 'object' && s.toJSON ? s.toJSON() : s,
            ))
          : typeof r == 'object' && r.toJSON
            ? (e[t] = r.toJSON())
            : (e[t] = r)
      }
      return e
    }
    root() {
      let e = this
      for (; e.parent; ) e = e.parent
      return e
    }
    cleanRaws(e) {
      ;(delete this.raws.before,
        delete this.raws.after,
        e || delete this.raws.between)
    }
    positionInside(e) {
      let t = this.toString(),
        r = this.source.start.column,
        s = this.source.start.line
      for (let i = 0; i < e; i++)
        t[i] ===
        `
`
          ? ((r = 1), (s += 1))
          : (r += 1)
      return { line: s, column: r }
    }
    positionBy(e) {
      let t = this.source.start
      if (e.index) t = this.positionInside(e.index)
      else if (e.word) {
        let r = this.toString().indexOf(e.word)
        r !== -1 && (t = this.positionInside(r))
      }
      return t
    }
  }
  const vi = R
  class Te extends vi {
    constructor(e) {
      ;(super(e), this.nodes || (this.nodes = []))
    }
    push(e) {
      return ((e.parent = this), this.nodes.push(e), this)
    }
    each(e) {
      ;(this.lastEach || (this.lastEach = 0),
        this.indexes || (this.indexes = {}),
        (this.lastEach += 1))
      let t = this.lastEach,
        r,
        s
      if (((this.indexes[t] = 0), !!this.nodes)) {
        for (
          ;
          this.indexes[t] < this.nodes.length &&
          ((r = this.indexes[t]), (s = e(this.nodes[r], r)), s !== !1);
        )
          this.indexes[t] += 1
        return (delete this.indexes[t], s)
      }
    }
    walk(e) {
      return this.each((t, r) => {
        let s = e(t, r)
        return (s !== !1 && t.walk && (s = t.walk(e)), s)
      })
    }
    walkType(e, t) {
      if (!e || !t)
        throw new Error('Parameters {type} and {callback} are required.')
      return (
        (e = e.name && e.prototype ? e.name : e),
        this.walk((r, s) => {
          if (r.type === e) return t.call(this, r, s)
        })
      )
    }
    append(e) {
      return ((e.parent = this), this.nodes.push(e), this)
    }
    prepend(e) {
      return ((e.parent = this), this.nodes.unshift(e), this)
    }
    cleanRaws(e) {
      if ((super.cleanRaws(e), this.nodes))
        for (let t of this.nodes) t.cleanRaws(e)
    }
    insertAfter(e, t) {
      let r = this.index(e),
        s
      this.nodes.splice(r + 1, 0, t)
      for (let i in this.indexes)
        ((s = this.indexes[i]),
          r <= s && (this.indexes[i] = s + this.nodes.length))
      return this
    }
    insertBefore(e, t) {
      let r = this.index(e),
        s
      this.nodes.splice(r, 0, t)
      for (let i in this.indexes)
        ((s = this.indexes[i]),
          r <= s && (this.indexes[i] = s + this.nodes.length))
      return this
    }
    removeChild(e) {
      ;((e = this.index(e)),
        (this.nodes[e].parent = void 0),
        this.nodes.splice(e, 1))
      let t
      for (let r in this.indexes)
        ((t = this.indexes[r]), t >= e && (this.indexes[r] = t - 1))
      return this
    }
    removeAll() {
      for (let e of this.nodes) e.parent = void 0
      return ((this.nodes = []), this)
    }
    every(e) {
      return this.nodes.every(e)
    }
    some(e) {
      return this.nodes.some(e)
    }
    index(e) {
      return typeof e == 'number' ? e : this.nodes.indexOf(e)
    }
    get first() {
      if (!!this.nodes) return this.nodes[0]
    }
    get last() {
      if (!!this.nodes) return this.nodes[this.nodes.length - 1]
    }
    toString() {
      let e = this.nodes.map(String).join('')
      return (
        this.value && (e = this.value + e),
        this.raws.before && (e = this.raws.before + e),
        this.raws.after && (e += this.raws.after),
        e
      )
    }
  }
  Te.registerWalker = (n) => {
    let e = 'walk' + n.name
    ;(e.lastIndexOf('s') !== e.length - 1 && (e += 's'),
      !Te.prototype[e] &&
        (Te.prototype[e] = function (t) {
          return this.walkType(n, t)
        }))
  }
  var A = Te
  const xi = A
  var Ci = class extends xi {
    constructor(e) {
      ;(super(e), (this.type = 'root'))
    }
  }
  const Si = A
  var vr = class extends Si {
    constructor(e) {
      ;(super(e), (this.type = 'value'), (this.unbalanced = 0))
    }
  }
  const xr = A
  class Cr extends xr {
    constructor(e) {
      ;(super(e), (this.type = 'atword'))
    }
    toString() {
      return (
        this.quoted && this.raws.quote,
        [
          this.raws.before,
          '@',
          String.prototype.toString.call(this.value),
          this.raws.after,
        ].join('')
      )
    }
  }
  xr.registerWalker(Cr)
  var Sr = Cr
  const ki = A,
    Ai = R
  class kr extends Ai {
    constructor(e) {
      ;(super(e), (this.type = 'colon'))
    }
  }
  ki.registerWalker(kr)
  var Ar = kr
  const Oi = A,
    Ti = R
  class Or extends Ti {
    constructor(e) {
      ;(super(e), (this.type = 'comma'))
    }
  }
  Oi.registerWalker(Or)
  var Tr = Or
  const Ei = A,
    $i = R
  class Er extends $i {
    constructor(e) {
      ;(super(e), (this.type = 'comment'), (this.inline = e.inline || !1))
    }
    toString() {
      return [
        this.raws.before,
        this.inline ? '//' : '/*',
        String(this.value),
        this.inline ? '' : '*/',
        this.raws.after,
      ].join('')
    }
  }
  Ei.registerWalker(Er)
  var $r = Er
  const Pr = A
  class _r extends Pr {
    constructor(e) {
      ;(super(e), (this.type = 'func'), (this.unbalanced = -1))
    }
  }
  Pr.registerWalker(_r)
  var Rr = _r
  const Pi = A,
    _i = R
  class Dr extends _i {
    constructor(e) {
      ;(super(e), (this.type = 'number'), (this.unit = e.unit || ''))
    }
    toString() {
      return [
        this.raws.before,
        String(this.value),
        this.unit,
        this.raws.after,
      ].join('')
    }
  }
  Pi.registerWalker(Dr)
  var Nr = Dr
  const Ri = A,
    Di = R
  class Mr extends Di {
    constructor(e) {
      ;(super(e), (this.type = 'operator'))
    }
  }
  Ri.registerWalker(Mr)
  var Ur = Mr
  const Ni = A,
    Mi = R
  class Lr extends Mi {
    constructor(e) {
      ;(super(e), (this.type = 'paren'), (this.parenType = ''))
    }
  }
  Ni.registerWalker(Lr)
  var Br = Lr
  const Ui = A,
    Li = R
  class jr extends Li {
    constructor(e) {
      ;(super(e), (this.type = 'string'))
    }
    toString() {
      let e = this.quoted ? this.raws.quote : ''
      return [this.raws.before, e, this.value + '', e, this.raws.after].join('')
    }
  }
  Ui.registerWalker(jr)
  var Fr = jr
  const Bi = A,
    ji = R
  class zr extends ji {
    constructor(e) {
      ;(super(e), (this.type = 'word'))
    }
  }
  Bi.registerWalker(zr)
  var Wr = zr
  const Fi = A,
    zi = R
  class Ir extends zi {
    constructor(e) {
      ;(super(e), (this.type = 'unicode-range'))
    }
  }
  Fi.registerWalker(Ir)
  var qr = Ir
  class Wi extends Error {
    constructor(e) {
      ;(super(e),
        (this.name = this.constructor.name),
        (this.message = e || 'An error ocurred while tokzenizing.'),
        typeof Error.captureStackTrace == 'function'
          ? Error.captureStackTrace(this, this.constructor)
          : (this.stack = new Error(e).stack))
    }
  }
  var Ii = Wi
  const qi = '{'.charCodeAt(0),
    Vi = '}'.charCodeAt(0),
    Hi = '('.charCodeAt(0),
    Ji = ')'.charCodeAt(0),
    Vr = "'".charCodeAt(0),
    Gi = '"'.charCodeAt(0),
    Hr = '\\'.charCodeAt(0),
    pt = '/'.charCodeAt(0),
    Ki = '.'.charCodeAt(0),
    Qi = ','.charCodeAt(0),
    Yi = ':'.charCodeAt(0),
    dt = '*'.charCodeAt(0),
    Ee = '-'.charCodeAt(0),
    mt = '+'.charCodeAt(0),
    Xi = '#'.charCodeAt(0),
    $e = `
`.charCodeAt(0),
    Jr = ' '.charCodeAt(0),
    Gr = '\f'.charCodeAt(0),
    Kr = '	'.charCodeAt(0),
    Qr = '\r'.charCodeAt(0),
    Zi = '@'.charCodeAt(0),
    eo = 'e'.charCodeAt(0),
    to = 'E'.charCodeAt(0),
    Yr = '0'.charCodeAt(0),
    Xr = '9'.charCodeAt(0),
    ro = 'u'.charCodeAt(0),
    so = 'U'.charCodeAt(0),
    Pe = /[ \n\t\r\{\(\)'"\\;,/]/g,
    no = /[ \n\t\r\(\)\{\}\*:;@!&'"\+\|~>,\[\]\\]|\/(?=\*)/g,
    V = /[ \n\t\r\(\)\{\}\*:;@!&'"\-\+\|~>,\[\]\\]|\//g,
    io = /^[a-z0-9]/i,
    oo = /^[a-f0-9?\-]/i,
    lo = T,
    ao = Ii
  var uo = function (e, t) {
      t = t || {}
      let r = [],
        s = e.valueOf(),
        i = s.length,
        l = -1,
        a = 1,
        o = 0,
        c = 0,
        h = null,
        f,
        u,
        m,
        $,
        v,
        p,
        x,
        C,
        D,
        W,
        Me
      function Ue(P) {
        let k = lo.format(
          'Unclosed %s at line: %d, column: %d, token: %d',
          P,
          a,
          o - l,
          o,
        )
        throw new ao(k)
      }
      for (; o < i; ) {
        switch (((f = s.charCodeAt(o)), f === $e && ((l = o), (a += 1)), f)) {
          case $e:
          case Jr:
          case Kr:
          case Qr:
          case Gr:
            u = o
            do
              ((u += 1), (f = s.charCodeAt(u)), f === $e && ((l = u), (a += 1)))
            while (f === Jr || f === $e || f === Kr || f === Qr || f === Gr)
            ;(r.push(['space', s.slice(o, u), a, o - l, a, u - l, o]),
              (o = u - 1))
            break
          case Yi:
            ;((u = o + 1),
              r.push(['colon', s.slice(o, u), a, o - l, a, u - l, o]),
              (o = u - 1))
            break
          case Qi:
            ;((u = o + 1),
              r.push(['comma', s.slice(o, u), a, o - l, a, u - l, o]),
              (o = u - 1))
            break
          case qi:
            r.push(['{', '{', a, o - l, a, u - l, o])
            break
          case Vi:
            r.push(['}', '}', a, o - l, a, u - l, o])
            break
          case Hi:
            ;(c++,
              (h =
                !h &&
                c === 1 &&
                r.length > 0 &&
                r[r.length - 1][0] === 'word' &&
                r[r.length - 1][1] === 'url'),
              r.push(['(', '(', a, o - l, a, u - l, o]))
            break
          case Ji:
            ;(c--,
              (h = !h && c === 1),
              r.push([')', ')', a, o - l, a, u - l, o]))
            break
          case Vr:
          case Gi:
            ;((m = f === Vr ? "'" : '"'), (u = o))
            do
              for (
                D = !1, u = s.indexOf(m, u + 1), u === -1 && Ue('quote'), W = u;
                s.charCodeAt(W - 1) === Hr;
              )
                ((W -= 1), (D = !D))
            while (D)
            ;(r.push(['string', s.slice(o, u + 1), a, o - l, a, u - l, o]),
              (o = u))
            break
          case Zi:
            ;((Pe.lastIndex = o + 1),
              Pe.test(s),
              Pe.lastIndex === 0 ? (u = s.length - 1) : (u = Pe.lastIndex - 2),
              r.push(['atword', s.slice(o, u + 1), a, o - l, a, u - l, o]),
              (o = u))
            break
          case Hr:
            ;((u = o),
              (f = s.charCodeAt(u + 1)),
              r.push(['word', s.slice(o, u + 1), a, o - l, a, u - l, o]),
              (o = u))
            break
          case mt:
          case Ee:
          case dt:
            if (
              ((u = o + 1),
              (Me = s.slice(o + 1, u + 1)),
              s.slice(o - 1, o),
              f === Ee && Me.charCodeAt(0) === Ee)
            ) {
              ;(u++,
                r.push(['word', s.slice(o, u), a, o - l, a, u - l, o]),
                (o = u - 1))
              break
            }
            ;(r.push(['operator', s.slice(o, u), a, o - l, a, u - l, o]),
              (o = u - 1))
            break
          default:
            if (
              f === pt &&
              (s.charCodeAt(o + 1) === dt ||
                (t.loose && !h && s.charCodeAt(o + 1) === pt))
            ) {
              if (s.charCodeAt(o + 1) === dt)
                ((u = s.indexOf('*/', o + 2) + 1), u === 0 && Ue('comment'))
              else {
                const k = s.indexOf(
                  `
`,
                  o + 2,
                )
                u = k !== -1 ? k - 1 : i
              }
              ;((p = s.slice(o, u + 1)),
                ($ = p.split(`
`)),
                (v = $.length - 1),
                v > 0
                  ? ((x = a + v), (C = u - $[v].length))
                  : ((x = a), (C = l)),
                r.push(['comment', p, a, o - l, x, u - C, o]),
                (l = C),
                (a = x),
                (o = u))
            } else if (f === Xi && !io.test(s.slice(o + 1, o + 2)))
              ((u = o + 1),
                r.push(['#', s.slice(o, u), a, o - l, a, u - l, o]),
                (o = u - 1))
            else if ((f === ro || f === so) && s.charCodeAt(o + 1) === mt) {
              u = o + 2
              do ((u += 1), (f = s.charCodeAt(u)))
              while (u < i && oo.test(s.slice(u, u + 1)))
              ;(r.push(['unicoderange', s.slice(o, u), a, o - l, a, u - l, o]),
                (o = u - 1))
            } else if (f === pt)
              ((u = o + 1),
                r.push(['operator', s.slice(o, u), a, o - l, a, u - l, o]),
                (o = u - 1))
            else {
              let P = no
              if (
                (f >= Yr && f <= Xr && (P = V),
                (P.lastIndex = o + 1),
                P.test(s),
                P.lastIndex === 0 ? (u = s.length - 1) : (u = P.lastIndex - 2),
                P === V || f === Ki)
              ) {
                let k = s.charCodeAt(u),
                  H = s.charCodeAt(u + 1),
                  ie = s.charCodeAt(u + 2)
                ;(k === eo || k === to) &&
                  (H === Ee || H === mt) &&
                  ie >= Yr &&
                  ie <= Xr &&
                  ((V.lastIndex = u + 2),
                  V.test(s),
                  V.lastIndex === 0
                    ? (u = s.length - 1)
                    : (u = V.lastIndex - 2))
              }
              ;(r.push(['word', s.slice(o, u + 1), a, o - l, a, u - l, o]),
                (o = u))
            }
            break
        }
        o++
      }
      return r
    },
    co = function (e, t) {
      if (((t = typeof t == 'number' ? t : 1 / 0), !t))
        return Array.isArray(e)
          ? e.map(function (s) {
              return s
            })
          : e
      return r(e, 1)
      function r(s, i) {
        return s.reduce(function (l, a) {
          return Array.isArray(a) && i < t ? l.concat(r(a, i + 1)) : l.concat(a)
        }, [])
      }
    },
    ho = function (n, e) {
      for (var t = -1, r = []; (t = n.indexOf(e, t + 1)) !== -1; ) r.push(t)
      return r
    }
  function fo(n, e) {
    for (var t = 1, r = n.length, s = n[0], i = n[0], l = 1; l < r; ++l)
      if (((i = s), (s = n[l]), e(s, i))) {
        if (l === t) {
          t++
          continue
        }
        n[t++] = s
      }
    return ((n.length = t), n)
  }
  function po(n) {
    for (var e = 1, t = n.length, r = n[0], s = n[0], i = 1; i < t; ++i, s = r)
      if (((s = r), (r = n[i]), r !== s)) {
        if (i === e) {
          e++
          continue
        }
        n[e++] = r
      }
    return ((n.length = e), n)
  }
  function mo(n, e, t) {
    return n.length === 0
      ? n
      : e
        ? (t || n.sort(e), fo(n, e))
        : (t || n.sort(), po(n))
  }
  var go = mo
  class yo extends Error {
    constructor(e) {
      ;(super(e),
        (this.name = this.constructor.name),
        (this.message = e || 'An error ocurred while parsing.'),
        typeof Error.captureStackTrace == 'function'
          ? Error.captureStackTrace(this, this.constructor)
          : (this.stack = new Error(e).stack))
    }
  }
  var wo = yo
  const bo = Ci,
    vo = vr,
    xo = Sr,
    Co = Ar,
    So = Tr,
    ko = $r,
    Ao = Rr,
    Oo = Nr,
    To = Ur,
    Zr = Br,
    Eo = Fr,
    es = Wr,
    $o = qr,
    Po = uo,
    _o = co,
    Ro = ho,
    Do = go,
    No = wo
  function Mo(n) {
    return n.sort((e, t) => e - t)
  }
  var Uo = class {
    constructor(e, t) {
      const r = { loose: !1 }
      ;((this.cache = []),
        (this.input = e),
        (this.options = Object.assign({}, r, t)),
        (this.position = 0),
        (this.unbalanced = 0),
        (this.root = new bo()))
      let s = new vo()
      ;(this.root.append(s),
        (this.current = s),
        (this.tokens = Po(e, this.options)))
    }
    parse() {
      return this.loop()
    }
    colon() {
      let e = this.currToken
      ;(this.newNode(
        new Co({
          value: e[1],
          source: {
            start: { line: e[2], column: e[3] },
            end: { line: e[4], column: e[5] },
          },
          sourceIndex: e[6],
        }),
      ),
        this.position++)
    }
    comma() {
      let e = this.currToken
      ;(this.newNode(
        new So({
          value: e[1],
          source: {
            start: { line: e[2], column: e[3] },
            end: { line: e[4], column: e[5] },
          },
          sourceIndex: e[6],
        }),
      ),
        this.position++)
    }
    comment() {
      let e = !1,
        t = this.currToken[1].replace(/\/\*|\*\//g, ''),
        r
      ;(this.options.loose &&
        t.startsWith('//') &&
        ((t = t.substring(2)), (e = !0)),
        (r = new ko({
          value: t,
          inline: e,
          source: {
            start: { line: this.currToken[2], column: this.currToken[3] },
            end: { line: this.currToken[4], column: this.currToken[5] },
          },
          sourceIndex: this.currToken[6],
        })),
        this.newNode(r),
        this.position++)
    }
    error(e, t) {
      throw new No(e + ` at line: ${t[2]}, column ${t[3]}`)
    }
    loop() {
      for (; this.position < this.tokens.length; ) this.parseTokens()
      return (
        !this.current.last && this.spaces
          ? (this.current.raws.before += this.spaces)
          : this.spaces && (this.current.last.raws.after += this.spaces),
        (this.spaces = ''),
        this.root
      )
    }
    operator() {
      let e = this.currToken[1],
        t
      if (e === '+' || e === '-') {
        if (
          (this.options.loose ||
            (this.position > 0 &&
              (this.current.type === 'func' && this.current.value === 'calc'
                ? this.prevToken[0] !== 'space' && this.prevToken[0] !== '('
                  ? this.error('Syntax Error', this.currToken)
                  : this.nextToken[0] !== 'space' &&
                      this.nextToken[0] !== 'word'
                    ? this.error('Syntax Error', this.currToken)
                    : this.nextToken[0] === 'word' &&
                      this.current.last.type !== 'operator' &&
                      this.current.last.value !== '(' &&
                      this.error('Syntax Error', this.currToken)
                : (this.nextToken[0] === 'space' ||
                    this.nextToken[0] === 'operator' ||
                    this.prevToken[0] === 'operator') &&
                  this.error('Syntax Error', this.currToken))),
          this.options.loose)
        ) {
          if (
            (!this.current.nodes.length ||
              (this.current.last && this.current.last.type === 'operator')) &&
            this.nextToken[0] === 'word'
          )
            return this.word()
        } else if (this.nextToken[0] === 'word') return this.word()
      }
      return (
        (t = new To({
          value: this.currToken[1],
          source: {
            start: { line: this.currToken[2], column: this.currToken[3] },
            end: { line: this.currToken[2], column: this.currToken[3] },
          },
          sourceIndex: this.currToken[4],
        })),
        this.position++,
        this.newNode(t)
      )
    }
    parseTokens() {
      switch (this.currToken[0]) {
        case 'space':
          this.space()
          break
        case 'colon':
          this.colon()
          break
        case 'comma':
          this.comma()
          break
        case 'comment':
          this.comment()
          break
        case '(':
          this.parenOpen()
          break
        case ')':
          this.parenClose()
          break
        case 'atword':
        case 'word':
          this.word()
          break
        case 'operator':
          this.operator()
          break
        case 'string':
          this.string()
          break
        case 'unicoderange':
          this.unicodeRange()
          break
        default:
          this.word()
          break
      }
    }
    parenOpen() {
      let e = 1,
        t = this.position + 1,
        r = this.currToken,
        s
      for (; t < this.tokens.length && e; ) {
        let i = this.tokens[t]
        ;(i[0] === '(' && e++, i[0] === ')' && e--, t++)
      }
      if (
        (e && this.error('Expected closing parenthesis', r),
        (s = this.current.last),
        s &&
          s.type === 'func' &&
          s.unbalanced < 0 &&
          ((s.unbalanced = 0), (this.current = s)),
        this.current.unbalanced++,
        this.newNode(
          new Zr({
            value: r[1],
            source: {
              start: { line: r[2], column: r[3] },
              end: { line: r[4], column: r[5] },
            },
            sourceIndex: r[6],
          }),
        ),
        this.position++,
        this.current.type === 'func' &&
          this.current.unbalanced &&
          this.current.value === 'url' &&
          this.currToken[0] !== 'string' &&
          this.currToken[0] !== ')' &&
          !this.options.loose)
      ) {
        let i = this.nextToken,
          l = this.currToken[1],
          a = { line: this.currToken[2], column: this.currToken[3] }
        for (; i && i[0] !== ')' && this.current.unbalanced; )
          (this.position++, (l += this.currToken[1]), (i = this.nextToken))
        this.position !== this.tokens.length - 1 &&
          (this.position++,
          this.newNode(
            new es({
              value: l,
              source: {
                start: a,
                end: { line: this.currToken[4], column: this.currToken[5] },
              },
              sourceIndex: this.currToken[6],
            }),
          ))
      }
    }
    parenClose() {
      let e = this.currToken
      ;(this.newNode(
        new Zr({
          value: e[1],
          source: {
            start: { line: e[2], column: e[3] },
            end: { line: e[4], column: e[5] },
          },
          sourceIndex: e[6],
        }),
      ),
        this.position++,
        !(
          this.position >= this.tokens.length - 1 && !this.current.unbalanced
        ) &&
          (this.current.unbalanced--,
          this.current.unbalanced < 0 &&
            this.error('Expected opening parenthesis', e),
          !this.current.unbalanced &&
            this.cache.length &&
            (this.current = this.cache.pop())))
    }
    space() {
      let e = this.currToken
      this.position === this.tokens.length - 1 ||
      this.nextToken[0] === ',' ||
      this.nextToken[0] === ')'
        ? ((this.current.last.raws.after += e[1]), this.position++)
        : ((this.spaces = e[1]), this.position++)
    }
    unicodeRange() {
      let e = this.currToken
      ;(this.newNode(
        new $o({
          value: e[1],
          source: {
            start: { line: e[2], column: e[3] },
            end: { line: e[4], column: e[5] },
          },
          sourceIndex: e[6],
        }),
      ),
        this.position++)
    }
    splitWord() {
      let e = this.nextToken,
        t = this.currToken[1],
        r = /^[\+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][\+\-]?\d+)?/,
        s = /^(?!\#([a-z0-9]+))[\#\{\}]/gi,
        i,
        l
      if (!s.test(t))
        for (; e && e[0] === 'word'; )
          (this.position++, (t += this.currToken[1]), (e = this.nextToken))
      ;((i = Ro(t, '@')),
        (l = Mo(Do(_o([[0], i])))),
        l.forEach((a, o) => {
          let c = l[o + 1] || t.length,
            h = t.slice(a, c),
            f
          if (~i.indexOf(a))
            f = new xo({
              value: h.slice(1),
              source: {
                start: {
                  line: this.currToken[2],
                  column: this.currToken[3] + a,
                },
                end: {
                  line: this.currToken[4],
                  column: this.currToken[3] + (c - 1),
                },
              },
              sourceIndex: this.currToken[6] + l[o],
            })
          else if (r.test(this.currToken[1])) {
            let u = h.replace(r, '')
            f = new Oo({
              value: h.replace(u, ''),
              source: {
                start: {
                  line: this.currToken[2],
                  column: this.currToken[3] + a,
                },
                end: {
                  line: this.currToken[4],
                  column: this.currToken[3] + (c - 1),
                },
              },
              sourceIndex: this.currToken[6] + l[o],
              unit: u,
            })
          } else
            ((f = new (e && e[0] === '(' ? Ao : es)({
              value: h,
              source: {
                start: {
                  line: this.currToken[2],
                  column: this.currToken[3] + a,
                },
                end: {
                  line: this.currToken[4],
                  column: this.currToken[3] + (c - 1),
                },
              },
              sourceIndex: this.currToken[6] + l[o],
            })),
              f.constructor.name === 'Word'
                ? ((f.isHex = /^#(.+)/.test(h)),
                  (f.isColor =
                    /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
                      h,
                    )))
                : this.cache.push(this.current))
          this.newNode(f)
        }),
        this.position++)
    }
    string() {
      let e = this.currToken,
        t = this.currToken[1],
        r = /^(\"|\')/,
        s = r.test(t),
        i = '',
        l
      ;(s && ((i = t.match(r)[0]), (t = t.slice(1, t.length - 1))),
        (l = new Eo({
          value: t,
          source: {
            start: { line: e[2], column: e[3] },
            end: { line: e[4], column: e[5] },
          },
          sourceIndex: e[6],
          quoted: s,
        })),
        (l.raws.quote = i),
        this.newNode(l),
        this.position++)
    }
    word() {
      return this.splitWord()
    }
    newNode(e) {
      return (
        this.spaces && ((e.raws.before += this.spaces), (this.spaces = '')),
        this.current.append(e)
      )
    }
    get currToken() {
      return this.tokens[this.position]
    }
    get nextToken() {
      return this.tokens[this.position + 1]
    }
    get prevToken() {
      return this.tokens[this.position - 1]
    }
  }
  const Lo = Uo,
    Bo = Sr,
    jo = Ar,
    Fo = Tr,
    zo = $r,
    Wo = Rr,
    Io = Nr,
    qo = Ur,
    Vo = Br,
    Ho = Fr,
    Jo = qr,
    Go = vr,
    Ko = Wr
  let O = function (n, e) {
    return new Lo(n, e)
  }
  ;((O.atword = function (n) {
    return new Bo(n)
  }),
    (O.colon = function (n) {
      return ((n.value = n.value || ':'), new jo(n))
    }),
    (O.comma = function (n) {
      return ((n.value = n.value || ','), new Fo(n))
    }),
    (O.comment = function (n) {
      return new zo(n)
    }),
    (O.func = function (n) {
      return new Wo(n)
    }),
    (O.number = function (n) {
      return new Io(n)
    }),
    (O.operator = function (n) {
      return new qo(n)
    }),
    (O.paren = function (n) {
      return ((n.value = n.value || '('), new Vo(n))
    }),
    (O.string = function (n) {
      return ((n.quote = n.quote || "'"), new Ho(n))
    }),
    (O.value = function (n) {
      return new Go(n)
    }),
    (O.word = function (n) {
      return new Ko(n)
    }),
    (O.unicodeRange = function (n) {
      return new Jo(n)
    }))
  var ts = O,
    rs = {},
    L = {}
  ;(Object.defineProperty(L, '__esModule', { value: !0 }),
    (L.removeDotSegmentsOfPath = L.removeDotSegments = L.resolve = void 0))
  function Qo(n, e) {
    e = e || ''
    const t = e.indexOf('#')
    if ((t > 0 && (e = e.substr(0, t)), !n.length)) {
      if (e.indexOf(':') < 0)
        throw new Error(`Found invalid baseIRI '${e}' for value '${n}'`)
      return e
    }
    if (n.startsWith('?')) {
      const c = e.indexOf('?')
      return (c > 0 && (e = e.substr(0, c)), e + n)
    }
    if (n.startsWith('#')) return e + n
    if (!e.length) {
      const c = n.indexOf(':')
      if (c < 0)
        throw new Error(
          `Found invalid relative IRI '${n}' for a missing baseIRI`,
        )
      return z(n, c)
    }
    const r = n.indexOf(':')
    if (r >= 0) return z(n, r)
    const s = e.indexOf(':')
    if (s < 0) throw new Error(`Found invalid baseIRI '${e}' for value '${n}'`)
    const i = e.substr(0, s + 1)
    if (n.indexOf('//') === 0) return i + z(n, r)
    let l
    if (e.indexOf('//', s) === s + 1) {
      if (((l = e.indexOf('/', s + 3)), l < 0))
        return e.length > s + 3 ? e + '/' + z(n, r) : i + z(n, r)
    } else if (((l = e.indexOf('/', s + 1)), l < 0)) return i + z(n, r)
    if (n.indexOf('/') === 0) return e.substr(0, l) + _e(n)
    let a = e.substr(l)
    const o = a.lastIndexOf('/')
    return (
      o >= 0 &&
        o < a.length - 1 &&
        ((a = a.substr(0, o + 1)),
        n[0] === '.' &&
          n[1] !== '.' &&
          n[1] !== '/' &&
          n[2] &&
          (n = n.substr(1))),
      (n = a + n),
      (n = _e(n)),
      e.substr(0, l) + n
    )
  }
  L.resolve = Qo
  function _e(n) {
    const e = []
    let t = 0
    for (; t < n.length; )
      switch (n[t]) {
        case '/':
          if (n[t + 1] === '.')
            if (n[t + 2] === '.') {
              if (!ss(n[t + 3])) {
                ;(e.push([]), t++)
                break
              }
              ;(e.pop(), n[t + 3] || e.push([]), (t += 3))
            } else {
              if (!ss(n[t + 2])) {
                ;(e.push([]), t++)
                break
              }
              ;(n[t + 2] || e.push([]), (t += 2))
            }
          else (e.push([]), t++)
          break
        case '#':
        case '?':
          ;(e.length || e.push([]),
            e[e.length - 1].push(n.substr(t)),
            (t = n.length))
          break
        default:
          ;(e.length || e.push([]), e[e.length - 1].push(n[t]), t++)
          break
      }
    return '/' + e.map((r) => r.join('')).join('/')
  }
  L.removeDotSegments = _e
  function z(n, e) {
    let t = e + 1
    e >= 0
      ? n[e + 1] === '/' && n[e + 2] === '/' && (t = e + 3)
      : n[0] === '/' && n[1] === '/' && (t = 2)
    const r = n.indexOf('/', t)
    if (r < 0) return n
    const s = n.substr(0, r),
      i = n.substr(r)
    return s + _e(i)
  }
  L.removeDotSegmentsOfPath = z
  function ss(n) {
    return !n || n === '#' || n === '?' || n === '/'
  }
  ;(function (n) {
    var e =
        (oe && oe.__createBinding) ||
        (Object.create
          ? function (r, s, i, l) {
              ;(l === void 0 && (l = i),
                Object.defineProperty(r, l, {
                  enumerable: !0,
                  get: function () {
                    return s[i]
                  },
                }))
            }
          : function (r, s, i, l) {
              ;(l === void 0 && (l = i), (r[l] = s[i]))
            }),
      t =
        (oe && oe.__exportStar) ||
        function (r, s) {
          for (var i in r)
            i !== 'default' &&
              !Object.prototype.hasOwnProperty.call(s, i) &&
              e(s, r, i)
        }
    ;(Object.defineProperty(n, '__esModule', { value: !0 }), t(L, n))
  })(rs)
  async function ns(n, e = {}) {
    const t = e.glob || globalThis,
      r = await new Promise((i, l) => {
        const a = new t.FileReader()
        ;((a.onload = () => i(a.result)),
          (a.onerror = () => l(a.error)),
          a.readAsBinaryString(n))
      })
    return `data:${n.type};base64,${t.btoa(r)}`
  }
  async function gt(n, e = {}) {
    return await new Promise((r, s) => {
      const i = e.glob || globalThis,
        l = new i.FileReader()
      ;((l.onload = () => r(l.result)),
        (l.onerror = () => s(l.error)),
        l.readAsText(n))
    })
  }
  function is(n, e = {}) {
    const t = 'documentElement' in n ? n.documentElement : n
    ;(Yo(t), Xo(t), Zo(t, e))
  }
  function Yo(n) {
    Array.from(n.querySelectorAll('script')).forEach((t) => {
      var r
      return (r = t.parentNode) == null ? void 0 : r.removeChild(t)
    })
  }
  function Xo(n) {
    Array.from(n.querySelectorAll('*')).forEach((t) => {
      Array.from(t.attributes)
        .filter((r) => r.name.toLowerCase().startsWith('on'))
        .forEach((r) => {
          t.removeAttribute(r.name)
        })
    })
  }
  function Zo(n, e = {}) {
    const t = e.glob || globalThis
    Array.from(n.querySelectorAll('a, area'))
      .filter((s) => s instanceof t.HTMLElement)
      .filter((s) => s.href.startsWith('javascript:'))
      .forEach((s) => {
        s.setAttribute('href', 'javascript:')
      })
  }
  function os(n, e = {}) {
    ;(is(n, e), ls(n), as(n, e))
  }
  function ls(n) {
    Array.from(n.querySelectorAll('noscript')).forEach((t) => {
      var r
      return (r = t.parentNode) == null ? void 0 : r.removeChild(t)
    })
  }
  function as(n, e = {}) {
    const t = e.glob || globalThis
    Array.from(n.querySelectorAll('*[contenteditable]'))
      .filter((s) => s instanceof t.HTMLElement)
      .forEach((s) => {
        s.contentEditable = 'false'
      })
  }
  function us(n, e) {
    if (!n.head) {
      const r = n.createElement('head')
      n.documentElement.insertBefore(r, n.documentElement.firstChild)
    }
    if (
      (n.head.querySelectorAll('meta[charset]').forEach((r) => {
        var s
        return (s = r.parentNode) == null ? void 0 : s.removeChild(r)
      }),
      e !== null && e !== '')
    ) {
      const r = n.createElement('meta')
      ;(r.setAttribute('charset', e), n.head.insertBefore(r, n.head.firstChild))
    }
  }
  function cs(n, e) {
    const t = el(e)
    if (!n.head) {
      const a = n.createElement('head')
      n.documentElement.insertBefore(a, n.documentElement.firstChild)
    }
    n.head
      .querySelectorAll('meta[http-equiv=Content-Security-Policy i]')
      .forEach((a) => {
        var o
        return (o = a.parentNode) == null ? void 0 : o.removeChild(a)
      })
    const s = n.createElement('meta')
    ;(s.setAttribute('http-equiv', 'Content-Security-Policy'),
      s.setAttribute('content', t),
      n.head.insertBefore(s, n.head.firstChild))
    const i = 'meta[charset], meta[http-equiv=Content-Type i]',
      l = n.head.querySelector(i)
    ;(l && n.head.insertBefore(l, s),
      n.documentElement.removeAttribute('manifest'),
      n.head.removeAttribute('profile'))
  }
  function el(n) {
    if (typeof n == 'string') return n
    function e(t) {
      return t == null ? '' : typeof t == 'string' ? t : t.join(' ')
    }
    return Object.entries(n)
      .map(([t, r]) => `${t} ${e(r)}`)
      .join('; ')
  }
  function hs(n, { originalUrl: e, datetime: t }) {
    if (!n.head) {
      const r = n.createElement('head')
      n.documentElement.insertBefore(r, n.documentElement.firstChild)
    }
    if (e) {
      const r = n.createElement('link')
      ;(r.setAttribute('rel', 'original'),
        r.setAttribute('href', e),
        n.head.insertBefore(r, n.head.firstChild))
    }
    if (t) {
      const r = n.createElement('meta')
      ;(r.setAttribute('http-equiv', 'Memento-Datetime'),
        r.setAttribute('content', tl(t)),
        n.head.insertBefore(r, n.head.firstChild))
    }
  }
  function tl(n) {
    const e = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      t = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      r = (i) => (l) => `${l}`.padStart(i, '0')
    return (
      t[n.getUTCDay()] +
      ', ' +
      r(2)(n.getUTCDate()) +
      ' ' +
      e[n.getUTCMonth()] +
      ' ' +
      r(4)(n.getUTCFullYear()) +
      ' ' +
      r(2)(n.getUTCHours()) +
      ':' +
      r(2)(n.getUTCMinutes()) +
      ':' +
      r(2)(n.getUTCSeconds()) +
      ' GMT'
    )
  }
  function fs(n, e, t = {}) {
    var r
    if (ps(n) && t.rememberOriginalUrls) {
      const s = `data-original-${n.from.attribute}`
      if (!n.from.element.hasAttribute(s)) {
        const i =
          (r = n.from.element.getAttribute(n.from.attribute)) != null ? r : ''
        n.from.element.setAttribute(s, i)
      }
    }
    ;((n.target = e),
      ps(n) &&
        n.from.element.hasAttribute('integrity') &&
        n.from.element.removeAttribute('integrity'))
  }
  function ps(n) {
    const e = n.from
    return e.element !== void 0 && e.attribute !== void 0
  }
  class B {
    get subresourceLinks() {
      return this.links
        .filter((e) => e.isSubresource)
        .filter((e) => B.getResourceClass(e.subresourceType))
    }
    async processSubresources(e) {
      async function t(r) {
        await e(r, t)
      }
      await Promise.all(this.subresourceLinks.map((r) => t(r)))
    }
    dry() {
      this.makeLinksAbsolute()
    }
    makeLinksAbsolute() {
      this.links.forEach((e) => {
        const t = e.absoluteTarget
        if (t === void 0) return
        const r = t.includes('#') ? t.substring(t.indexOf('#')) : void 0,
          s = (i) => i.split('#')[0]
        r && s(t) === s(this.url) ? (e.target = r) : (e.target = t)
      })
    }
    static async fromLink(e, t = {}) {
      if (e.absoluteTarget === void 0)
        throw new Error(`Cannot fetch invalid target: ${e.target}`)
      const r = e.absoluteTarget,
        s = t.glob || globalThis,
        l = await (t.fetchResource || s.fetch)(r, {
          cache: 'force-cache',
          redirect: 'follow',
          signal: t.signal,
        }),
        a = typeof l.blob == 'function' ? await l.blob() : l.blob,
        o = l.url
      return await B.fromBlob({
        blob: a,
        url: o,
        subresourceType: e.subresourceType,
        config: t,
      })
    }
    static async fromBlob({ blob: e, url: t, subresourceType: r, config: s }) {
      const i = this.getResourceClass(r)
      if (i === void 0)
        throw new Error(`Not sure how to interpret resource of type '${r}'`)
      return await i.fromBlob({ blob: e, url: t, config: s })
    }
    static getResourceClass(e) {
      const t = { document: ne, style: vs, image: Ne, video: Ne, font: Ne }
      if (e !== void 0) return t[e]
    }
  }
  function j(n, e) {
    try {
      return rs.resolve(n, e)
    } catch {
      return
    }
  }
  const rl = (n) => (e) => {
      const t = n(e),
        r = [],
        s = []
      let i = 0
      for (const { token: l, index: a, note: o } of t)
        (s.push(e.substring(i, a)),
          r.push({
            token: l,
            get index() {
              return a
            },
            get note() {
              return o
            },
          }),
          (i = a + l.length))
      return (
        s.push(e.substring(i)),
        (r.toString = () => {
          let l = s[0]
          return (
            r.forEach(({ token: a }, o) => {
              l += a + s[o + 1]
            }),
            l
          )
        }),
        r
      )
    },
    sl = ({ parse: n, get: e, set: t }) =>
      ms(
        ds({
          get: e,
          set: t,
          transform: rl(n),
          untransform: (r) => r.toString(),
        }),
      )
  function ds({
    get: n,
    set: e,
    transform: t,
    untransform: r,
    isEqual: s = (i, l) => i === l,
  }) {
    const i = Symbol('uninitialised')
    let l = i,
      a = i
    return {
      get() {
        const o = n()
        return ((l === i || !s(o, l) || a === i) && (a = t(o)), (l = o), a)
      },
      set(o, { trustCache: c = !1 } = {}) {
        const h = r(o),
          f = c ? l : n()
        ;((f === i || !s(h, f)) && e(h), (l = h), (a = o))
      },
    }
  }
  function ms({ get: n, set: e, alwaysSet: t = !1 }) {
    let r
    const s = () => {
        r = n()
      },
      i = () => {
        e(r)
      }
    function l(o, c) {
      const { proxy: h, setTarget: f } = Ns(o)
      return il(
        () => {
          if ((s(), !gs(r)))
            throw new TypeError(
              `Expected get()${c} to be an object, but get() is ${r}.`,
            )
          let v = r
          const p = c.split('.').slice(1)
          for (let x = 0; x < p.length; x++) {
            const C = v[p[x]]
            if (!gs(C)) {
              const D = '.' + p.slice(0, x + 1).join('.')
              throw new TypeError(
                `Expected get()${c} to be an object, but get()${D} is ${C}.`,
              )
            }
            v = C
          }
          f(v)
        },
        t
          ? i
          : (v, p) => {
              nl.includes(v) && i()
            },
      )(h)
    }
    const a = n()
    return ol(l)(a)
  }
  function gs(n) {
    return typeof n == 'object' && n !== null
  }
  const nl = [
    'set',
    'delete',
    'defineProperty',
    'deleteProperty',
    'preventExtensions',
    'setPrototypeOf',
  ]
  function il(n = () => {}, e = () => {}) {
    return (t) => {
      const r = Object.assign(
        {},
        ...Object.getOwnPropertyNames(Reflect).map((s) => ({
          [s](...i) {
            n(s, i)
            const l = Reflect[s].apply(null, i)
            return (e(s, i), l)
          },
        })),
      )
      return new Proxy(t, r)
    }
  }
  function ol(n) {
    let e = (t, r) => {
      const s = n(t, r)
      return new Proxy(s, {
        get(i, l, a) {
          const o = Reflect.get(i, l, a)
          return o instanceof Object &&
            i.hasOwnProperty(l) &&
            typeof l == 'string'
            ? e(o, `${r}.${l}`)
            : o
        },
      })
    }
    return ((e = Rs(e)), (t) => e(t, ''))
  }
  function ys(n, e) {
    const t = []
    return (
      n.walkAtRules('import', (r) => {
        var a
        let s
        try {
          s = ts(r.params).parse()
        } catch {
          return
        }
        let i
        const l = (a = s.nodes[0]) == null ? void 0 : a.nodes[0]
        if (!!l) {
          if (l.type === 'string') i = l
          else if (l.type === 'func' && l.value === 'url') {
            const o = l.nodes[1]
            if (!o) return
            ;(o.type === 'string' || o.type === 'word') && (i = o)
          }
          if (i) {
            const o = i,
              c = {
                get target() {
                  return o.value
                },
                set target(h) {
                  ;((o.value = h), (r.params = s.toString()))
                },
                get absoluteTarget() {
                  return j(this.target, e)
                },
                get isSubresource() {
                  return !0
                },
                get subresourceType() {
                  return 'style'
                },
                get from() {
                  return {}
                },
              }
            t.push(c)
          }
        }
      }),
      n.walkDecls((r) => {
        let s
        try {
          s = ts(r.value).parse()
        } catch {
          return
        }
        s.walk((i) => {
          var o
          if (i.type !== 'func' || i.value !== 'url') return
          let l
          r.prop === 'src' &&
          ((o = r.parent) == null ? void 0 : o.type) === 'atrule' &&
          r.parent.name === 'font-face'
            ? (l = 'font')
            : (l = 'image')
          const a = i.nodes[1]
          if (a !== void 0 && (a.type === 'string' || a.type === 'word')) {
            const c = a,
              h = {
                get target() {
                  return c.value
                },
                set target(f) {
                  ;((c.value = f), (r.value = s.toString()))
                },
                get absoluteTarget() {
                  return j(this.target, e)
                },
                get isSubresource() {
                  return !0
                },
                get subresourceType() {
                  return l
                },
                get from() {
                  return {}
                },
              }
            t.push(h)
          }
        })
      }),
      t
    )
  }
  function ws({ get: n, set: e, baseUrl: t }) {
    const { get: r, set: s } = ds({
        get: n,
        set: e,
        transform: (o) => w.parse(o),
        untransform: (o) => o.toResult().css,
      }),
      i = Ps(ys)
    let l
    return ms({
      get: () => {
        let o
        try {
          o = r()
        } catch {
          return ((l = null), [])
        }
        return ((l = o), i(o, t))
      },
      set: (o) => {
        l !== null && s(l)
      },
    })
  }
  function ll(n, e = n.URL) {
    const t = n.querySelector('base[href]')
    if (t) {
      const r = t.getAttribute('href')
      if (r !== null) {
        const s = j(r, e)
        if (s) return s
      }
    }
    return e
  }
  const yt = (n) => (e) => {
      const t = []
      let r = e,
        s = 0
      for (; r.length > 0; ) {
        const i = r.match(n),
          l = i[1],
          a = i[2]
        a.length > 0 && t.push({ token: a, index: s + l.length })
        const o = i[0].length
        ;((r = r.slice(o)), (s += o))
      }
      return t
    },
    wt = yt(/^(\s*)([^]*?)(\s*)(\s|$)/),
    al = yt(/^(\s*)([^]*?)(\s*)(,|$)/),
    ul = yt(/^(\s*)(\S*)([^]*?)(,|$)/)
  function cl(n, e = (t, r) => r) {
    const t = {}
    for (const r of n)
      for (const [s, i] of Object.entries(r)) t[s] = s in t ? e(t[s], i) : i
    return t
  }
  function hl(n, e) {
    const r = Object.entries(n).filter((s) => !e.includes(s[0]))
    return fl(r)
  }
  function fl(n) {
    return Object.fromEntries(n)
  }
  function pl(n) {
    const e = [],
      t = new Set()
    for (const r of n) t.has(r) || (t.add(r), e.push(r))
    return e
  }
  const g = {
      elements: ['*'],
      parse: (n) => {
        const e = n.trim()
        if (e.length === 0) return []
        const t = n.indexOf(e[0])
        return [{ token: e, index: t }]
      },
      isSubresource: !1,
      subresourceType: void 0,
      makeAbsolute(
        n,
        e,
        t = e.baseURI,
        r = e.ownerDocument !== null ? e.ownerDocument.URL : void 0,
      ) {
        return j(n, t)
      },
    },
    Re = (n, e, ...t) => {
      const r = e.getAttribute('codebase')
      if (r) {
        const [s] = S.codebase.parse(r)
        if (s) {
          const i = s.token,
            l = S.codebase.makeAbsolute(i, e, ...t)
          return j(n, l)
        }
      }
      return g.makeAbsolute(n, e, ...t)
    },
    S = {
      action: { ...g, attribute: 'action', elements: ['form'] },
      applet_archive: {
        ...g,
        attribute: 'archive',
        elements: ['applet'],
        parse: al,
        isSubresource: !0,
        makeAbsolute: Re,
      },
      object_archive: {
        ...g,
        attribute: 'archive',
        elements: ['object'],
        parse: wt,
        isSubresource: !0,
        makeAbsolute: Re,
      },
      background: {
        ...g,
        attribute: 'background',
        elements: ['body'],
        isSubresource: !0,
        subresourceType: 'image',
      },
      cite: {
        ...g,
        attribute: 'cite',
        elements: ['blockquote', 'q', 'del', 'ins'],
      },
      classid: {
        ...g,
        attribute: 'classid',
        elements: ['object'],
        isSubresource: !0,
        makeAbsolute: Re,
      },
      codebase: { ...g, attribute: 'codebase', elements: ['object', 'applet'] },
      data: {
        ...g,
        attribute: 'data',
        elements: ['object'],
        isSubresource: !0,
        subresourceType: 'object',
        makeAbsolute: Re,
      },
      href: {
        ...g,
        attribute: 'href',
        elements: [
          'a',
          'area',
          'base',
          'link:not([rel~=icon i]):not([rel~=stylesheet i])',
        ],
      },
      link_icon_href: {
        ...g,
        attribute: 'href',
        elements: ['link[rel~=icon i]'],
        isSubresource: !0,
        subresourceType: 'image',
      },
      link_stylesheet_href: {
        ...g,
        attribute: 'href',
        elements: ['link[rel~=stylesheet i]'],
        isSubresource: !0,
        subresourceType: 'style',
      },
      longdesc: {
        ...g,
        attribute: 'longdesc',
        elements: ['img', 'frame', 'iframe'],
      },
      profile: { ...g, attribute: 'profile', elements: ['head'] },
      img_src: {
        ...g,
        attribute: 'src',
        elements: ['img', 'input[type=image i]'],
        isSubresource: !0,
        subresourceType: 'image',
      },
      frame_src: {
        ...g,
        attribute: 'src',
        elements: ['frame', 'iframe'],
        isSubresource: !0,
        subresourceType: 'document',
      },
      script_src: {
        ...g,
        attribute: 'src',
        elements: ['script'],
        isSubresource: !0,
        subresourceType: 'script',
      },
      param_ref_value: {
        ...g,
        attribute: 'value',
        elements: ['param[valuetype=ref i]'],
      },
      meta_refresh_content: {
        ...g,
        attribute: 'content',
        elements: ['meta[http-equiv=refresh i]'],
        parse: (n) => {
          const e = n.match(
            /^(\s*[\d.]+\s*[;,\s]\s*(?:url\s*=\s*)?('|")?\s*)(.+)/i,
          )
          if (!e) return []
          const t = e[2]
          let r = e[3]
          t && r.includes(t) && (r = r.slice(0, r.indexOf(t)))
          const s = e[1].length
          return ((r = r.trim()), [{ token: r, index: s }])
        },
      },
    },
    bs = {
      action: S.action,
      cite: S.cite,
      data: { ...S.data, makeAbsolute: g.makeAbsolute },
      formaction: {
        ...g,
        attribute: 'formaction',
        elements: ['button', 'input'],
      },
      href: S.href,
      link_icon_href: S.link_icon_href,
      link_stylesheet_href: S.link_stylesheet_href,
      longdesc: { ...S.longdesc, elements: ['img'] },
      manifest: {
        ...g,
        attribute: 'manifest',
        elements: ['html'],
        isSubresource: !0,
        makeAbsolute(
          n,
          e,
          t,
          r = e.ownerDocument !== null ? e.ownerDocument.URL : void 0,
        ) {
          return j(n, r)
        },
      },
      poster: {
        ...g,
        attribute: 'poster',
        elements: ['video'],
        isSubresource: !0,
        subresourceType: 'image',
      },
      audio_src: {
        ...g,
        attribute: 'src',
        elements: ['audio', 'audio>source'],
        isSubresource: !0,
        subresourceType: 'audio',
      },
      embed_src: {
        ...g,
        attribute: 'src',
        elements: ['embed'],
        isSubresource: !0,
        subresourceType: 'embed',
      },
      frame_src: { ...S.frame_src, elements: ['iframe'] },
      img_src: S.img_src,
      script_src: S.script_src,
      track_src: {
        ...g,
        attribute: 'src',
        elements: ['track'],
        isSubresource: !0,
        subresourceType: 'track',
      },
      video_src: {
        ...g,
        attribute: 'src',
        elements: ['video', 'video>source'],
        isSubresource: !0,
        subresourceType: 'video',
      },
      srcset: {
        ...g,
        attribute: 'srcset',
        elements: ['img', 'picture>source'],
        parse: ul,
        isSubresource: !0,
        subresourceType: 'image',
      },
      meta_refresh_content: S.meta_refresh_content,
    },
    dl = {
      ...hl(bs, ['longdesc']),
      itemprop: {
        ...g,
        attribute: 'itemprop',
        parse: (n) => wt(n).filter(({ token: e }) => e.includes(':')),
        makeAbsolute: (n) => j(n),
      },
      itemtype: {
        ...g,
        attribute: 'itemtype',
        parse: wt,
        makeAbsolute: (n) => j(n),
      },
      itemid: { ...g, attribute: 'itemid' },
      ping: { ...g, attribute: 'ping', elements: ['a', 'area'] },
    },
    ml = cl([dl, bs, S], (n, e) =>
      n === e ? n : { ...n, ...e, elements: pl(n.elements.concat(e.elements)) },
    )
  function gl(n, { docUrl: e = void 0 } = {}) {
    const t = e !== void 0 ? ll(n, e) : void 0,
      r = n.documentElement
    return [
      ...yl({ rootElement: r, baseUrl: t, docUrl: e }),
      ...bl({ rootElement: r, baseUrl: t }),
      ...vl({ rootElement: r, baseUrl: t }),
    ]
  }
  function yl({ rootElement: n, baseUrl: e, docUrl: t }) {
    return Object.values(ml).flatMap((s) => {
      const { attribute: i, elements: l } = s,
        a = l.map((h) => `${h}[${i}]`).join(', ')
      return Array.from(n.querySelectorAll(a)).flatMap((h) =>
        wl({ element: h, attributeInfo: s, baseUrl: e, docUrl: t }),
      )
    })
  }
  function wl({ element: n, attributeInfo: e, baseUrl: t, docUrl: r }) {
    const { attribute: s, parse: i, makeAbsolute: l } = e
    return sl({
      parse: i,
      get: () => n.getAttribute(s) || '',
      set: (c) => {
        n.setAttribute(s, c)
      },
    }).map((c) => ({
      get target() {
        return c.token
      },
      set target(h) {
        c.token = h
      },
      get absoluteTarget() {
        return l(this.target, n, t, r)
      },
      get from() {
        const h = c.index
        return {
          get element() {
            return n
          },
          get attribute() {
            return s
          },
          get rangeWithinAttribute() {
            return [h, h + c.token.length]
          },
        }
      },
      get isSubresource() {
        return e.isSubresource
      },
      get subresourceType() {
        return e.subresourceType
      },
    }))
  }
  function bl({ rootElement: n, baseUrl: e }) {
    const t = '*[style]'
    return Array.from(n.querySelectorAll(t)).flatMap((i) =>
      ws({
        get: () => i.getAttribute('style') || '',
        set: (o) => {
          i.setAttribute('style', o)
        },
        baseUrl: e || i.baseURI,
      }).map((o) =>
        Object.create(o, {
          from: {
            get: () => ({
              get element() {
                return i
              },
              get attribute() {
                return 'style'
              },
              get rangeWithinAttribute() {
                return o.from.range
              },
            }),
          },
        }),
      ),
    )
  }
  function vl({ rootElement: n, baseUrl: e }) {
    const t = 'style[type="text/css" i], style:not([type])'
    return Array.from(n.querySelectorAll(t)).flatMap((i) =>
      ws({
        get: () => i.textContent || '',
        set: (o) => {
          i.textContent = o
        },
        baseUrl: e || i.baseURI,
      }).map((o) =>
        Object.create(o, {
          from: {
            get: () => ({
              get element() {
                return i
              },
              get rangeWithinTextContent() {
                return o.from.range
              },
            }),
          },
        }),
      ),
    )
  }
  class ne extends B {
    constructor(e, t, r = {}) {
      super()
      const s = r.glob || globalThis,
        i =
          typeof e == 'string'
            ? new s.DOMParser().parseFromString(e, 'text/html')
            : e
      ;((this._doc = i),
        (this._url = t),
        (this._config = r),
        (this._linksInDom = gl(i, { docUrl: t })))
      for (const l of this._linksInDom) l.from.resource = this
    }
    get doc() {
      return this._doc
    }
    get url() {
      var e
      return (e = this._url) != null ? e : this._doc.URL
    }
    get blob() {
      const e = this._config.glob || globalThis
      return new e.Blob([this.string], { type: 'text/html' })
    }
    get string() {
      return ks(this._doc)
    }
    get links() {
      return [...this.linksInDom, ...this.iframeSrcDocs.flatMap((t) => t.links)]
    }
    get linksInDom() {
      return this._linksInDom
    }
    get iframeSrcDocs() {
      return Array.from(this.doc.querySelectorAll('iframe[srcdoc]'))
        .map((r) => this.getContentDocOfFrame(r))
        .filter(Cl)
    }
    dry() {
      ;(super.dry(), os(this.doc, this._config), this.updateSrcdocValues())
    }
    updateSrcdocValues() {
      this.doc
        .querySelectorAll('iframe[srcdoc],iframe:not([src])')
        .forEach((e) => {
          const t = this.getContentDocOfFrame(e)
          if (t) {
            const r = t.string
            if (!e.srcdoc && r === '<html><head></head><body></body></html>')
              return
            e.srcdoc = xl(r)
          }
        })
    }
    getContentDocOfFrame(e) {
      const t = e.contentDocument
      return t !== null ? new ne(t, void 0, this._config) : null
    }
    static async fromBlob({ blob: e, url: t, config: r }) {
      const s = await gt(e, r)
      return new this(s, t, r)
    }
  }
  function xl(n) {
    return n.replace(/"/g, '&quot;')
  }
  function Cl(n) {
    return n !== null
  }
  class De extends ne {
    constructor(e, t, r = {}) {
      const s = e.cloneNode(!0)
      ;(super(s, t, r),
        (this._originalDoc = e),
        (this._framesContentDocClones = new Map()))
    }
    get doc() {
      return super.doc
    }
    get originalDoc() {
      return this._originalDoc
    }
    getOriginalNode(e) {
      const t = St(e, this.doc)
      return vt(t, this._originalDoc)
    }
    getClonedNode(e) {
      const t = St(e, this._originalDoc)
      return vt(t, this.doc)
    }
    cloneFramedDocs(e = !1) {
      const t = this._config.glob || globalThis,
        r = Array.from(this.doc.querySelectorAll('frame,iframe')).filter(
          (i) => i instanceof t.HTMLElement,
        ),
        s = this.subresourceLinks.filter(
          (i) => i.subresourceType === 'document',
        )
      for (const i of r) {
        const l = this.getContentDocOfFrame(i)
        if (l !== null) {
          e && l.cloneFramedDocs(!0)
          const a = s.find((o) => o.from.element === i)
          a &&
            (l.url !== 'about:srcdoc' && (a.resource = l),
            (a.from.resource = this))
        }
      }
    }
    getContentDocOfFrame(e) {
      let t, r
      if (e.ownerDocument === this.doc) ((r = e), (t = this.getOriginalNode(e)))
      else if (e.ownerDocument === this._originalDoc)
        ((r = this.getClonedNode(e)), (t = e))
      else
        throw new Error(
          'Argument must be an element of either the original or the cloned document',
        )
      let s = this._framesContentDocClones.get(r)
      return (
        s === void 0 &&
          ((s = this._getContentDocOfFrame(t)),
          this._framesContentDocClones.set(r, s)),
        s
      )
    }
    _getContentDocOfFrame(e) {
      const t = Sl(e)
      return t !== null ? new De(t, void 0, this._config) : null
    }
  }
  function Sl(n) {
    try {
      return n.contentDocument
    } catch {
      return null
    }
  }
  class vs extends B {
    constructor(e, t, r = {}) {
      ;(super(), (this._url = t), (this._config = r))
      try {
        const s = w.parse(e)
        this._links = ys(s, t)
        for (const i of this._links) i.from.resource = this
        this._getString = () => s.toResult().css
      } catch {
        ;((this._links = []), (this._getString = () => e))
      }
    }
    get url() {
      return this._url
    }
    get blob() {
      const e = this._config.glob || globalThis
      return new e.Blob([this.string], { type: 'text/css' })
    }
    get string() {
      return this._getString()
    }
    get links() {
      return this._links
    }
    static async fromBlob({ blob: e, url: t, config: r }) {
      const s = await gt(e, r)
      return new this(s, t, r)
    }
  }
  class Ne extends B {
    constructor(e, t) {
      ;(super(), (this._blob = e), (this._url = t))
    }
    get url() {
      return this._url
    }
    get blob() {
      return this._blob
    }
    get links() {
      return []
    }
    static async fromBlob({ blob: e, url: t }) {
      return new this(e, t)
    }
  }
  async function xs(
    n = (typeof window != 'undefined' && window.document) ||
      Ss('No document given to freeze-dry'),
    e = {},
  ) {
    return (await new Cs(n, e).run()).result.string
  }
  class Cs {
    constructor(e, t = {}) {
      ;((this.original = e),
        (this.config = this.applyDefaultConfig(e, t)),
        (this.abortController = this.initAbortController()),
        (this.result = this.captureDom(e)))
    }
    async run() {
      return (
        await this.crawlSubresources(),
        await this.config.dryResource(this.result, !0),
        this.finaliseSnapshot(),
        this
      )
    }
    captureDom(e) {
      const t = new De(e, this.config.docUrl, { glob: this.config.glob })
      return (t.cloneFramedDocs(!0), t)
    }
    async crawlSubresources() {
      var e
      try {
        await this.result.processSubresources(this.config.processSubresource)
      } catch (t) {
        if (!((e = this.config.signal) != null && e.aborted)) throw t
      }
    }
    async processSubresource(e, t) {
      if (!e.resource)
        try {
          e.resource = await B.fromLink(e, {
            fetchResource: this.config.fetchResource,
            signal: this.signal,
            glob: this.config.glob,
          })
        } catch {
          return
        }
      ;(await e.resource.processSubresources(t),
        await this.config.dryResource(e.resource, !1))
      const r = await this.config.newUrlForResource(e.resource)
      r !== e.target &&
        fs(e, r, { rememberOriginalUrls: this.config.rememberOriginalUrls })
    }
    async newUrlForResource(e) {
      return await ns(e.blob, { glob: this.config.glob })
    }
    dryResource(e, t) {
      e.dry()
    }
    finaliseSnapshot() {
      ;(this.config.addMetadata &&
        hs(this.result.doc, {
          originalUrl: this.result.url,
          datetime: this.config.now,
        }),
        this.config.contentSecurityPolicy !== null &&
          cs(this.result.doc, this.config.contentSecurityPolicy),
        this.config.charsetDeclaration !== void 0 &&
          us(this.result.doc, this.config.charsetDeclaration))
    }
    applyDefaultConfig(e, t) {
      const r = {
        addMetadata: !0,
        rememberOriginalUrls: !0,
        now: new Date(),
        contentSecurityPolicy: {
          'default-src': ["'none'"],
          'img-src': ['data:'],
          'media-src': ['data:'],
          'style-src': ['data:', "'unsafe-inline'"],
          'font-src': ['data:'],
          'frame-src': ['data:'],
        },
        charsetDeclaration: 'utf-8',
        timeout: 1 / 0,
        signal: void 0,
        fetchResource: void 0,
        dryResource: this.dryResource.bind(this),
        newUrlForResource: this.newUrlForResource.bind(this),
        processSubresource: this.processSubresource.bind(this),
        docUrl: void 0,
        glob:
          e.defaultView ||
          (typeof window != 'undefined' ? window : void 0) ||
          Ss('Lacking a global window object'),
      }
      return Ts(t, r)
    }
    initAbortController() {
      const e = this.config.glob || globalThis,
        t = new e.AbortController()
      if (
        (this.config.timeout >= 0 &&
          this.config.timeout < 1 / 0 &&
          e.setTimeout(() => {
            this.abort('Freeze-dry timed out')
          }, this.config.timeout),
        this.config.signal)
      ) {
        const r = this.config.signal
        r.addEventListener('abort', (s) => this.abort(r.reason))
      }
      return t
    }
    async abort(e) {
      this.abortController.abort(e)
    }
    get signal() {
      return this.abortController.signal
    }
  }
  function Ss(n) {
    throw new Error(n)
  }
  ;((b.DomCloneResource = De),
    (b.DomResource = ne),
    (b.FreezeDryer = Cs),
    (b.LeafResource = Ne),
    (b.Resource = B),
    (b.StylesheetResource = vs),
    (b.blobToDataUrl = ns),
    (b.blobToText = gt),
    (b.default = xs),
    (b.freezeDry = xs),
    (b.makeDomStatic = os),
    (b.removeContentEditable = as),
    (b.removeNoscript = ls),
    (b.removeScripts = is),
    (b.setCharsetDeclaration = us),
    (b.setContentSecurityPolicy = cs),
    (b.setLinkTarget = fs),
    (b.setMementoTags = hs),
    Object.defineProperties(b, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: 'Module' },
    }))
})
