var Qe = { Stringify: 1 },
  R = (e, t) => {
    const r = new String(e);
    return ((r.isEscaped = !0), (r.callbacks = t), r);
  },
  et = /[&<>'"]/,
  tt = async (e, t) => {
    let r = "";
    t ||= [];
    const n = await Promise.all(e);
    for (let a = n.length - 1; (r += n[a]), a--, !(a < 0); a--) {
      let s = n[a];
      typeof s == "object" && t.push(...(s.callbacks || []));
      const l = s.isEscaped;
      if (
        ((s = await (typeof s == "object" ? s.toString() : s)),
        typeof s == "object" && t.push(...(s.callbacks || [])),
        s.isEscaped ?? l)
      )
        r += s;
      else {
        const c = [r];
        (j(s, c), (r = c[0]));
      }
    }
    return R(r, t);
  },
  j = (e, t) => {
    const r = e.search(et);
    if (r === -1) {
      t[0] += e;
      return;
    }
    let n,
      a,
      s = 0;
    for (a = r; a < e.length; a++) {
      switch (e.charCodeAt(a)) {
        case 34:
          n = "&quot;";
          break;
        case 39:
          n = "&#39;";
          break;
        case 38:
          n = "&amp;";
          break;
        case 60:
          n = "&lt;";
          break;
        case 62:
          n = "&gt;";
          break;
        default:
          continue;
      }
      ((t[0] += e.substring(s, a) + n), (s = a + 1));
    }
    t[0] += e.substring(s, a);
  },
  rt = (e) => {
    const t = e.callbacks;
    if (!t?.length) return e;
    const r = [e],
      n = {};
    return (t.forEach((a) => a({ phase: Qe.Stringify, buffer: r, context: n })), r[0]);
  },
  ie = Symbol("RENDERER"),
  te = Symbol("ERROR_HANDLER"),
  g = Symbol("STASH"),
  Te = Symbol("INTERNAL"),
  nt = Symbol("MEMO"),
  Z = {
    title: [],
    script: ["src"],
    style: ["data-href"],
    link: ["href"],
    meta: ["name", "httpEquiv", "charset", "itemProp"],
  },
  at = {},
  J = "data-precedence",
  st = (e) => (Array.isArray(e) ? e : [e]),
  lt = new Map([
    ["className", "class"],
    ["htmlFor", "for"],
    ["crossOrigin", "crossorigin"],
    ["httpEquiv", "http-equiv"],
    ["itemProp", "itemprop"],
    ["fetchPriority", "fetchpriority"],
    ["noModule", "nomodule"],
    ["formAction", "formaction"],
  ]),
  re = (e) => lt.get(e) || e,
  we = (e, t) => {
    for (const [r, n] of Object.entries(e)) {
      const a =
        r[0] === "-" || !/[A-Z]/.test(r) ? r : r.replace(/[A-Z]/g, (s) => `-${s.toLowerCase()}`);
      t(
        a,
        n == null
          ? null
          : typeof n == "number"
            ? a.match(
                /^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/,
              )
              ? `${n}`
              : `${n}px`
            : n,
      );
    }
  },
  it = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ],
  ot = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "download",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
  ],
  oe = (e, t) => {
    for (let r = 0, n = e.length; r < n; r++) {
      const a = e[r];
      if (typeof a == "string") j(a, t);
      else {
        if (typeof a == "boolean" || a === null || a === void 0) continue;
        a instanceof $e
          ? a.toStringToBuffer(t)
          : typeof a == "number" || a.isEscaped
            ? (t[0] += a)
            : a instanceof Promise
              ? t.unshift("", a)
              : oe(a, t);
      }
    }
  },
  $e = class {
    tag;
    props;
    key;
    children;
    isEscaped = !0;
    localContexts;
    constructor(e, t, r) {
      ((this.tag = e), (this.props = t), (this.children = r));
    }
    get type() {
      return this.tag;
    }
    get ref() {
      return this.props.ref || null;
    }
    toString() {
      const e = [""];
      this.localContexts?.forEach(([t, r]) => {
        t.values.push(r);
      });
      try {
        this.toStringToBuffer(e);
      } finally {
        this.localContexts?.forEach(([t]) => {
          t.values.pop();
        });
      }
      return e.length === 1
        ? "callbacks" in e
          ? rt(R(e[0], e.callbacks)).toString()
          : e[0]
        : tt(e, e.callbacks);
    }
    toStringToBuffer(e) {
      const t = this.tag,
        r = this.props;
      let { children: n } = this;
      e[0] += `<${t}`;
      const a = (s) => re(s);
      for (let [s, l] of Object.entries(r))
        if (((s = a(s)), s !== "children")) {
          if (s === "style" && typeof l == "object") {
            let c = "";
            (we(l, (u, o) => {
              o != null && (c += `${c ? ";" : ""}${u}:${o}`);
            }),
              (e[0] += ' style="'),
              j(c, e),
              (e[0] += '"'));
          } else if (typeof l == "string") ((e[0] += ` ${s}="`), j(l, e), (e[0] += '"'));
          else if (l != null)
            if (typeof l == "number" || l.isEscaped) e[0] += ` ${s}="${l}"`;
            else if (typeof l == "boolean" && ot.includes(s)) l && (e[0] += ` ${s}=""`);
            else if (s === "dangerouslySetInnerHTML") {
              if (n.length > 0)
                throw new Error(
                  "Can only set one of `children` or `props.dangerouslySetInnerHTML`.",
                );
              n = [R(l.__html)];
            } else if (l instanceof Promise) ((e[0] += ` ${s}="`), e.unshift('"', l));
            else if (typeof l == "function") {
              if (!s.startsWith("on") && s !== "ref")
                throw new Error(`Invalid prop '${s}' of type 'function' supplied to '${t}'.`);
            } else ((e[0] += ` ${s}="`), j(l.toString(), e), (e[0] += '"'));
        }
      if (it.includes(t) && n.length === 0) {
        e[0] += "/>";
        return;
      }
      ((e[0] += ">"), oe(n, e), (e[0] += `</${t}>`));
    }
  },
  ct = class extends $e {
    toStringToBuffer(e) {
      oe(this.children, e);
    }
  },
  ve = (e) => ((e[Te] = !0), e),
  xe =
    (e) =>
    ({ value: t, children: r }) => {
      if (!r) return;
      const n = {
        children: [
          {
            tag: ve(() => {
              e.push(t);
            }),
            props: {},
          },
        ],
      };
      (Array.isArray(r) ? n.children.push(...r.flat()) : n.children.push(r),
        n.children.push({
          tag: ve(() => {
            e.pop();
          }),
          props: {},
        }));
      const a = { tag: "", props: n, type: "" };
      return (
        (a[te] = (s) => {
          throw (e.pop(), s);
        }),
        a
      );
    },
  Pe = (e) => {
    const t = [e],
      r = xe(t);
    return ((r.values = t), (r.Provider = r), W.push(r), r);
  },
  W = [],
  ft = (e) => {
    const t = [e],
      r = (n) => {
        t.push(n.value);
        let a;
        try {
          a = n.children
            ? (Array.isArray(n.children) ? new ct("", {}, n.children) : n.children).toString()
            : "";
        } finally {
          t.pop();
        }
        return a instanceof Promise ? a.then((s) => R(s, s.callbacks)) : R(a);
      };
    return ((r.values = t), (r.Provider = r), (r[ie] = xe(t)), W.push(r), r);
  },
  Re = (e) => e.values.at(-1),
  I = "_hp",
  ut = { Change: "Input", DoubleClick: "DblClick" },
  pt = { svg: "2000/svg", math: "1998/Math/MathML" },
  H = [],
  ne = new WeakMap(),
  N = void 0,
  vt = () => N,
  T = (e) => "t" in e,
  V = { onClick: ["click", !1] },
  de = (e) => {
    if (!e.startsWith("on")) return;
    if (V[e]) return V[e];
    const t = e.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);
    if (t) {
      const [, r, n] = t;
      return (V[e] = [(ut[r] || r).toLowerCase(), !!n]);
    }
  },
  he = (e, t) =>
    N &&
    e instanceof SVGElement &&
    /[A-Z]/.test(t) &&
    (t in e.style || t.match(/^(?:o|pai|str|u|ve)/))
      ? t.replace(/([A-Z])/g, "-$1").toLowerCase()
      : t,
  dt = (e, t, r) => {
    t ||= {};
    for (let n in t) {
      const a = t[n];
      if (n !== "children" && (!r || r[n] !== a)) {
        n = re(n);
        const s = de(n);
        if (s) {
          if (r?.[n] !== a && (r && e.removeEventListener(s[0], r[n], s[1]), a != null)) {
            if (typeof a != "function")
              throw new Error(`Event handler for "${n}" is not a function`);
            e.addEventListener(s[0], a, s[1]);
          }
        } else if (n === "dangerouslySetInnerHTML" && a) e.innerHTML = a.__html;
        else if (n === "ref") {
          let l;
          (typeof a == "function"
            ? (l = a(e) || (() => a(null)))
            : a && "current" in a && ((a.current = e), (l = () => (a.current = null))),
            ne.set(e, l));
        } else if (n === "style") {
          const l = e.style;
          typeof a == "string"
            ? (l.cssText = a)
            : ((l.cssText = ""), a != null && we(a, l.setProperty.bind(l)));
        } else {
          if (n === "value") {
            const c = e.nodeName;
            if (c === "INPUT" || c === "TEXTAREA" || c === "SELECT") {
              if (((e.value = a == null || a === !1 ? null : a), c === "TEXTAREA")) {
                e.textContent = a;
                continue;
              } else if (c === "SELECT") {
                e.selectedIndex === -1 && (e.selectedIndex = 0);
                continue;
              }
            }
          } else
            ((n === "checked" && e.nodeName === "INPUT") ||
              (n === "selected" && e.nodeName === "OPTION")) &&
              (e[n] = a);
          const l = he(e, n);
          a == null || a === !1
            ? e.removeAttribute(l)
            : a === !0
              ? e.setAttribute(l, "")
              : typeof a == "string" || typeof a == "number"
                ? e.setAttribute(l, a)
                : e.setAttribute(l, a.toString());
        }
      }
    }
    if (r)
      for (let n in r) {
        const a = r[n];
        if (n !== "children" && !(n in t)) {
          n = re(n);
          const s = de(n);
          s
            ? e.removeEventListener(s[0], a, s[1])
            : n === "ref"
              ? ne.get(e)?.()
              : e.removeAttribute(he(e, n));
        }
      }
  },
  ht = (e, t) => {
    ((t[g][0] = 0), H.push([e, t]));
    const r = t.tag[ie] || t.tag,
      n = r.defaultProps ? { ...r.defaultProps, ...t.props } : t.props;
    try {
      return [r.call(null, n)];
    } finally {
      H.pop();
    }
  },
  Le = (e, t, r, n, a) => {
    (e.vR?.length && (n.push(...e.vR), delete e.vR),
      typeof e.tag == "function" && e[g][1][De]?.forEach((s) => a.push(s)),
      e.vC.forEach((s) => {
        if (T(s)) r.push(s);
        else if (typeof s.tag == "function" || s.tag === "") {
          s.c = t;
          const l = r.length;
          if ((Le(s, t, r, n, a), s.s)) {
            for (let c = l; c < r.length; c++) r[c].s = !0;
            s.s = !1;
          }
        } else (r.push(s), s.vR?.length && (n.push(...s.vR), delete s.vR));
      }));
  },
  mt = (e) => {
    for (; ; e = e.tag === I || !e.vC || !e.pP ? e.nN : e.vC[0]) {
      if (!e) return null;
      if (e.tag !== I && e.e) return e.e;
    }
  },
  Me = (e) => {
    (T(e) ||
      (e[g]?.[1][De]?.forEach((t) => t[2]?.()),
      ne.get(e.e)?.(),
      e.p === 2 && e.vC?.forEach((t) => (t.p = 2)),
      e.vC?.forEach(Me)),
      e.p || (e.e?.remove(), delete e.e),
      typeof e.tag == "function" && (_.delete(e), q.delete(e), delete e[g][3], (e.a = !0)));
  },
  ce = (e, t, r) => {
    ((e.c = t), Oe(e, t, r));
  },
  me = (e, t) => {
    if (t) {
      for (let r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
    }
  },
  ye = Symbol(),
  Oe = (e, t, r) => {
    const n = [],
      a = [],
      s = [];
    (Le(e, t, n, a, s), a.forEach(Me));
    const l = r ? void 0 : t.childNodes;
    let c,
      u = null;
    if (r) c = -1;
    else if (!l.length) c = 0;
    else {
      const o = me(l, mt(e.nN));
      (o !== void 0
        ? ((u = l[o]), (c = o))
        : (c = me(l, n.find((p) => p.tag !== I && p.e)?.e) ?? -1),
        c === -1 && (r = !0));
    }
    for (let o = 0, p = n.length; o < p; o++, c++) {
      const i = n[o];
      let f;
      if (i.s && i.e) ((f = i.e), (i.s = !1));
      else {
        const h = r || !i.e;
        T(i)
          ? (i.e && i.d && (i.e.textContent = i.t),
            (i.d = !1),
            (f = i.e ||= document.createTextNode(i.t)))
          : ((f = i.e ||=
              i.n ? document.createElementNS(i.n, i.tag) : document.createElement(i.tag)),
            dt(f, i.props, i.pP),
            Oe(i, f, h));
      }
      i.tag === I
        ? c--
        : r
          ? f.parentNode || t.appendChild(f)
          : l[c] !== f &&
            l[c - 1] !== f &&
            (l[c + 1] === f ? t.appendChild(l[c]) : t.insertBefore(f, u || l[c] || null));
    }
    if ((e.pP && delete e.pP, s.length)) {
      const o = [],
        p = [];
      (s.forEach(([, i, , f, h]) => {
        (i && o.push(i), f && p.push(f), h?.());
      }),
        o.forEach((i) => i()),
        p.length &&
          requestAnimationFrame(() => {
            p.forEach((i) => i());
          }));
    }
  },
  yt = (e, t) => !!(e && e.length === t.length && e.every((r, n) => r[1] === t[n][1])),
  q = new WeakMap(),
  z = (e, t, r) => {
    const n = !r && t.pC;
    r && (t.pC ||= t.vC);
    let a;
    try {
      ((r ||= typeof t.tag == "function" ? ht(e, t) : st(t.props.children)),
        r[0]?.tag === "" && r[0][te] && ((a = r[0][te]), e[5].push([e, a, t])));
      const s = n ? [...t.pC] : t.vC ? [...t.vC] : void 0,
        l = [];
      let c;
      for (let u = 0; u < r.length; u++) {
        Array.isArray(r[u]) && r.splice(u, 1, ...r[u].flat());
        let o = Ne(r[u]);
        if (o) {
          typeof o.tag == "function" &&
            !o.tag[Te] &&
            (W.length > 0 && (o[g][2] = W.map((i) => [i, i.values.at(-1)])),
            e[5]?.length && (o[g][3] = e[5].at(-1)));
          let p;
          if (s && s.length) {
            const i = s.findIndex(
              T(o)
                ? (f) => T(f)
                : o.key !== void 0
                  ? (f) => f.key === o.key && f.tag === o.tag
                  : (f) => f.tag === o.tag,
            );
            i !== -1 && ((p = s[i]), s.splice(i, 1));
          }
          if (p)
            if (T(o)) (p.t !== o.t && ((p.t = o.t), (p.d = !0)), (o = p));
            else {
              const i = (p.pP = p.props);
              if (((p.props = o.props), (p.f ||= o.f || t.f), typeof o.tag == "function")) {
                const f = p[g][2];
                ((p[g][2] = o[g][2] || []),
                  (p[g][3] = o[g][3]),
                  !p.f &&
                    ((p.o || p) === o.o || p.tag[nt]?.(i, p.props)) &&
                    yt(f, p[g][2]) &&
                    (p.s = !0));
              }
              o = p;
            }
          else if (!T(o) && N) {
            const i = Re(N);
            i && (o.n = i);
          }
          if ((!T(o) && !o.s && (z(e, o), delete o.f), l.push(o), c && !c.s && !o.s))
            for (let i = c; i && !T(i); i = i.vC?.at(-1)) i.nN = o;
          c = o;
        }
      }
      ((t.vR = n ? [...t.vC, ...(s || [])] : s || []), (t.vC = l), n && delete t.pC);
    } catch (s) {
      if (((t.f = !0), s === ye)) {
        if (a) return;
        throw s;
      }
      const [l, c, u] = t[g]?.[3] || [];
      if (c) {
        const o = () => U([0, !1, e[2]], u),
          p = q.get(u) || [];
        (p.push(o), q.set(u, p));
        const i = c(s, () => {
          const f = q.get(u);
          if (f) {
            const h = f.indexOf(o);
            if (h !== -1) return (f.splice(h, 1), o());
          }
        });
        if (i) {
          if (e[0] === 1) e[1] = !0;
          else if ((z(e, u, [i]), (c.length === 1 || e !== l) && u.c)) {
            ce(u, u.c, !1);
            return;
          }
          throw ye;
        }
      }
      throw s;
    } finally {
      a && e[5].pop();
    }
  },
  Ne = (e) => {
    if (!(e == null || typeof e == "boolean")) {
      if (typeof e == "string" || typeof e == "number") return { t: e.toString(), d: !0 };
      if (
        ("vR" in e &&
          (e = {
            tag: e.tag,
            props: e.props,
            key: e.key,
            f: e.f,
            type: e.tag,
            ref: e.props.ref,
            o: e.o || e,
          }),
        typeof e.tag == "function")
      )
        e[g] = [0, []];
      else {
        const t = pt[e.tag];
        t &&
          ((N ||= Pe("")),
          (e.props.children = [
            {
              tag: N,
              props: { value: (e.n = `http://www.w3.org/${t}`), children: e.props.children },
            },
          ]));
      }
      return e;
    }
  },
  _e = (e, t, r) => {
    e.c === t && ((e.c = r), e.vC.forEach((n) => _e(n, t, r)));
  },
  ge = (e, t) => {
    t[g][2]?.forEach(([r, n]) => {
      r.values.push(n);
    });
    try {
      z(e, t, void 0);
    } catch {
      return;
    }
    if (t.a) {
      delete t.a;
      return;
    }
    (t[g][2]?.forEach(([r]) => {
      r.values.pop();
    }),
      (e[0] !== 1 || !e[1]) && ce(t, t.c, !1));
  },
  _ = new WeakMap(),
  Se = [],
  U = async (e, t) => {
    e[5] ||= [];
    const r = _.get(t);
    r && r[0](void 0);
    let n;
    const a = new Promise((s) => (n = s));
    if (
      (_.set(t, [
        n,
        () => {
          e[2]
            ? e[2](e, t, (s) => {
                ge(s, t);
              }).then(() => n(t))
            : (ge(e, t), n(t));
        },
      ]),
      Se.length)
    )
      Se.at(-1).add(t);
    else {
      await Promise.resolve();
      const s = _.get(t);
      s && (_.delete(t), s[1]());
    }
    return a;
  },
  gt = (e, t) => {
    const r = [];
    ((r[5] = []), (r[4] = !0), z(r, e, void 0), (r[4] = !1));
    const n = document.createDocumentFragment();
    (ce(e, n, !0), _e(e, n, t), t.replaceChildren(n));
  },
  St = (e, t) => {
    gt(Ne({ tag: "", props: { children: e } }), t);
  },
  Et = (e, t, r) => ({ tag: I, props: { children: e }, key: r, e: t, p: 1 }),
  bt = 0,
  De = 1,
  Ct = 2,
  kt = 3,
  X = new WeakMap(),
  je = (e, t) => !e || !t || e.length !== t.length || t.some((r, n) => r !== e[n]),
  At = void 0,
  Ee = [],
  D = (e) => {
    const t = () => (typeof e == "function" ? e() : e),
      r = H.at(-1);
    if (!r) return [t(), () => {}];
    const [, n] = r,
      a = (n[g][1][bt] ||= []),
      s = n[g][0]++;
    return (a[s] ||= [
      t(),
      (l) => {
        const c = At,
          u = a[s];
        if ((typeof l == "function" && (l = l(u[0])), !Object.is(l, u[0])))
          if (((u[0] = l), Ee.length)) {
            const [o, p] = Ee.at(-1);
            Promise.all([o === 3 ? n : U([o, !1, c], n), p]).then(([i]) => {
              if (!i || !(o === 2 || o === 3)) return;
              const f = i.vC;
              requestAnimationFrame(() => {
                setTimeout(() => {
                  f === i.vC && U([o === 3 ? 1 : 0, !1, c], i);
                });
              });
            });
          } else U([0, !1, c], n);
      },
    ]);
  },
  fe = (e, t) => {
    const r = H.at(-1);
    if (!r) return e;
    const [, n] = r,
      a = (n[g][1][Ct] ||= []),
      s = n[g][0]++,
      l = a[s];
    return (je(l?.[1], t) ? (a[s] = [e, t]) : (e = a[s][0]), e);
  },
  Tt = (e) => {
    const t = X.get(e);
    if (t) {
      if (t.length === 2) throw t[1];
      return t[0];
    }
    throw (
      e.then(
        (r) => X.set(e, [r]),
        (r) => X.set(e, [void 0, r]),
      ),
      e
    );
  },
  wt = (e, t) => {
    const r = H.at(-1);
    if (!r) return e();
    const [, n] = r,
      a = (n[g][1][kt] ||= []),
      s = n[g][0]++,
      l = a[s];
    return (je(l?.[1], t) && (a[s] = [e(), t]), a[s][0]);
  },
  $t = Pe({ pending: !1, data: null, method: null, action: null }),
  be = new Set(),
  xt = (e) => {
    (be.add(e), e.finally(() => be.delete(e)));
  },
  Pt = () => {
    ((ae = Object.create(null)), (se = Object.create(null)));
  },
  G = (e, t) =>
    wt(
      () => (r) => {
        let n;
        e &&
          (typeof e == "function"
            ? (n =
                e(r) ||
                (() => {
                  e(null);
                }))
            : e &&
              "current" in e &&
              ((e.current = r),
              (n = () => {
                e.current = null;
              })));
        const a = t(r);
        return () => {
          (a?.(), n?.());
        };
      },
      [e],
    ),
  ae = Object.create(null),
  se = Object.create(null),
  B = (e, t, r, n, a) => {
    if (t?.itemProp) return { tag: e, props: t, type: e, ref: t.ref };
    const s = document.head;
    let { onLoad: l, onError: c, precedence: u, blocking: o, ...p } = t,
      i = null,
      f = !1;
    const h = Z[e];
    let k;
    if (h.length > 0) {
      const m = s.querySelectorAll(e);
      e: for (const y of m)
        for (const d of Z[e])
          if (y.getAttribute(d) === t[d]) {
            i = y;
            break e;
          }
      if (!i) {
        const y = h.reduce((d, S) => (t[S] === void 0 ? d : `${d}-${S}-${t[S]}`), e);
        ((f = !se[y]),
          (i = se[y] ||=
            (() => {
              const d = document.createElement(e);
              for (const S of h)
                (t[S] !== void 0 && d.setAttribute(S, t[S]), t.rel && d.setAttribute("rel", t.rel));
              return d;
            })()));
      }
    } else k = s.querySelectorAll(e);
    ((u = n ? (u ?? "") : void 0), n && (p[J] = u));
    const x = fe(
        (m) => {
          if (h.length > 0) {
            let y = !1;
            for (const d of s.querySelectorAll(e)) {
              if (y && d.getAttribute(J) !== u) {
                s.insertBefore(m, d);
                return;
              }
              d.getAttribute(J) === u && (y = !0);
            }
            s.appendChild(m);
          } else if (k) {
            let y = !1;
            for (const d of k)
              if (d === m) {
                y = !0;
                break;
              }
            (y || s.insertBefore(m, s.contains(k[0]) ? k[0] : s.querySelector(e)), (k = void 0));
          }
        },
        [u],
      ),
      O = G(t.ref, (m) => {
        const y = h[0];
        if ((r === 2 && (m.innerHTML = ""), (f || k) && x(m), !c && !l)) return;
        let d = (ae[m.getAttribute(y)] ||= new Promise((S, A) => {
          (m.addEventListener("load", S), m.addEventListener("error", A));
        }));
        (l && (d = d.then(l)), c && (d = d.catch(c)), d.catch(() => {}));
      });
    if (a && o === "render") {
      const m = Z[e][0];
      if (t[m]) {
        const y = t[m],
          d = (ae[y] ||= new Promise((S, A) => {
            (x(i), i.addEventListener("load", S), i.addEventListener("error", A));
          }));
        Tt(d);
      }
    }
    const E = { tag: e, type: e, props: { ...p, ref: O }, ref: O };
    return ((E.p = r), i && (E.e = i), Et(E, s));
  },
  Ie = (e) => {
    const t = vt();
    return (t && Re(t))?.endsWith("svg")
      ? { tag: "title", props: e, type: "title", ref: e.ref }
      : B("title", e, void 0, !1, !1);
  },
  He = (e) =>
    !e || ["src", "async"].some((t) => !e[t])
      ? { tag: "script", props: e, type: "script", ref: e.ref }
      : B("script", e, 1, !1, !0),
  Be = (e) =>
    !e || !["href", "precedence"].every((t) => t in e)
      ? { tag: "style", props: e, type: "style", ref: e.ref }
      : ((e["data-href"] = e.href), delete e.href, B("style", e, 2, !0, !0)),
  Fe = (e) =>
    !e ||
    ["onLoad", "onError"].some((t) => t in e) ||
    (e.rel === "stylesheet" && (!("precedence" in e) || "disabled" in e))
      ? { tag: "link", props: e, type: "link", ref: e.ref }
      : B("link", e, 1, "precedence" in e, !0),
  qe = (e) => B("meta", e, void 0, !1, !1),
  Ue = Symbol(),
  We = (e) => {
    const { action: t, ...r } = e;
    typeof t != "function" && (r.action = t);
    const [n, a] = D([null, !1]),
      s = fe(async (o) => {
        const p = o.isTrusted ? t : o.detail[Ue];
        if (typeof p != "function") return;
        o.preventDefault();
        const i = new FormData(o.target);
        a([i, !0]);
        const f = p(i);
        (f instanceof Promise && (xt(f), await f), a([null, !0]));
      }, []),
      l = G(
        e.ref,
        (o) => (
          o.addEventListener("submit", s),
          () => {
            o.removeEventListener("submit", s);
          }
        ),
      ),
      [c, u] = n;
    return (
      (n[1] = !1),
      {
        tag: $t,
        props: {
          value: { pending: c !== null, data: c, method: c ? "post" : null, action: c ? t : null },
          children: { tag: "form", props: { ...r, ref: l }, type: "form", ref: l },
        },
        f: u,
      }
    );
  },
  ze = (e, { formAction: t, ...r }) => {
    if (typeof t == "function") {
      const n = fe((a) => {
        (a.preventDefault(),
          a.currentTarget.form.dispatchEvent(new CustomEvent("submit", { detail: { [Ue]: t } })));
      }, []);
      r.ref = G(
        r.ref,
        (a) => (
          a.addEventListener("click", n),
          () => {
            a.removeEventListener("click", n);
          }
        ),
      );
    }
    return { tag: e, props: r, type: e, ref: r.ref };
  },
  Ge = (e) => ze("input", e),
  Ke = (e) => ze("button", e);
Object.assign(at, {
  title: Ie,
  script: He,
  style: Be,
  link: Fe,
  meta: qe,
  form: We,
  input: Ge,
  button: Ke,
});
const Ce = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      button: Ke,
      clearCache: Pt,
      composeRef: G,
      form: We,
      input: Ge,
      link: Fe,
      meta: qe,
      script: He,
      style: Be,
      title: Ie,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
var v = (e, t, r) => (
    typeof e == "string" && Ce[e] && (e = Ce[e]), { tag: e, type: e, props: t, key: r, ref: t.ref }
  ),
  Rt = (e) => v("", e, void 0);
ft(null);
new TextEncoder();
var F = ":-hono-global",
  Lt = new RegExp(`^${F}{(.*)}$`),
  Mt = "hono-css",
  L = Symbol(),
  b = Symbol(),
  C = Symbol(),
  $ = Symbol(),
  K = Symbol(),
  ke = Symbol(),
  Ze = (e) => {
    let t = 0,
      r = 11;
    for (; t < e.length; ) r = (101 * r + e.charCodeAt(t++)) >>> 0;
    return "css-" + r;
  },
  Ot = ['"(?:(?:\\\\[\\s\\S]|[^"\\\\])*)"', "'(?:(?:\\\\[\\s\\S]|[^'\\\\])*)'"].join("|"),
  Nt = new RegExp(
    [
      "(" + Ot + ")",
      "(?:" + ["^\\s+", "\\/\\*.*?\\*\\/\\s*", "\\/\\/.*\\n\\s*", "\\s+$"].join("|") + ")",
      "\\s*;\\s*(}|$)\\s*",
      "\\s*([{};:,])\\s*",
      "(\\s)\\s+",
    ].join("|"),
    "g",
  ),
  _t = (e) => e.replace(Nt, (t, r, n, a, s) => r || n || a || s || ""),
  Je = (e, t) => {
    const r = [],
      n = [],
      a = e[0].match(/^\s*\/\*(.*?)\*\//)?.[1] || "";
    let s = "";
    for (let l = 0, c = e.length; l < c; l++) {
      s += e[l];
      let u = t[l];
      if (!(typeof u == "boolean" || u === null || u === void 0)) {
        Array.isArray(u) || (u = [u]);
        for (let o = 0, p = u.length; o < p; o++) {
          let i = u[o];
          if (!(typeof i == "boolean" || i === null || i === void 0))
            if (typeof i == "string")
              /([\\"'\/])/.test(i)
                ? (s += i.replace(new RegExp(`([\\\\"']|(?<=<)\\/)`, "g"), "\\$1"))
                : (s += i);
            else if (typeof i == "number") s += i;
            else if (i[ke]) s += i[ke];
            else if (i[b].startsWith("@keyframes ")) (r.push(i), (s += ` ${i[b].substring(11)} `));
            else {
              if (e[l + 1]?.match(/^\s*{/)) (r.push(i), (i = `.${i[b]}`));
              else {
                (r.push(...i[$]), n.push(...i[K]), (i = i[C]));
                const f = i.length;
                if (f > 0) {
                  const h = i[f - 1];
                  h !== ";" && h !== "}" && (i += ";");
                }
              }
              s += `${i || ""}`;
            }
        }
      }
    }
    return [a, _t(s), r, n];
  },
  le = (e, t) => {
    let [r, n, a, s] = Je(e, t);
    const l = Lt.exec(n);
    l && (n = l[1]);
    const c = (l ? F : "") + Ze(r + n),
      u = (l ? a.map((o) => o[b]) : [c, ...s]).join(" ");
    return { [L]: c, [b]: u, [C]: n, [$]: a, [K]: s };
  },
  Dt = (e) => {
    for (let t = 0, r = e.length; t < r; t++) {
      const n = e[t];
      typeof n == "string" && (e[t] = { [L]: "", [b]: "", [C]: "", [$]: [], [K]: [n] });
    }
    return e;
  },
  jt = (e, ...t) => {
    const [r, n] = Je(e, t);
    return { [L]: "", [b]: `@keyframes ${Ze(r + n)}`, [C]: n, [$]: [], [K]: [] };
  },
  It = 0,
  Ht = (e, t) => {
    e || (e = [`/* h-v-t ${It++} */`]);
    const r = Array.isArray(e) ? le(e, t) : e,
      n = r[b],
      a = le(["view-transition-name:", ""], [n]);
    return (
      (r[b] = F + r[b]),
      (r[C] = r[C].replace(new RegExp("(?<=::view-transition(?:[a-z-]*)\\()(?=\\))", "g"), n)),
      (a[b] = a[L] = n),
      (a[$] = [...r[$], r]),
      a
    );
  },
  Bt = (e) => {
    const t = [];
    let r = 0,
      n = 0;
    for (let a = 0, s = e.length; a < s; a++) {
      const l = e[a];
      if (l === "'" || l === '"') {
        const c = l;
        for (a++; a < s; a++) {
          if (e[a] === "\\") {
            a++;
            continue;
          }
          if (e[a] === c) break;
        }
        continue;
      }
      if (l === "{") {
        n++;
        continue;
      }
      if (l === "}") {
        (n--, n === 0 && (t.push(e.slice(r, a + 1)), (r = a + 1)));
        continue;
      }
    }
    return t;
  },
  Ft = ({ id: e }) => {
    let t;
    const r = () => (
        t || ((t = document.querySelector(`style#${e}`)?.sheet), t && (t.addedStyles = new Set())),
        t ? [t, t.addedStyles] : []
      ),
      n = (l, c) => {
        const [u, o] = r();
        if (!u || !o) {
          Promise.resolve().then(() => {
            if (!r()[0]) throw new Error("style sheet not found");
            n(l, c);
          });
          return;
        }
        o.has(l) ||
          (o.add(l),
          (l.startsWith(F) ? Bt(c) : [`${l[0] === "@" ? "" : "."}${l}{${c}}`]).forEach((p) => {
            u.insertRule(p, u.cssRules.length);
          }));
      };
    return [
      {
        toString() {
          const l = this[L];
          return (
            n(l, this[C]),
            this[$].forEach(({ [b]: c, [C]: u }) => {
              n(c, u);
            }),
            this[b]
          );
        },
      },
      ({ children: l, nonce: c }) => ({
        tag: "style",
        props: { id: e, nonce: c, children: l && (Array.isArray(l) ? l : [l]).map((u) => u[C]) },
      }),
    ];
  },
  qt = ({ id: e }) => {
    const [t, r] = Ft({ id: e }),
      n = new WeakMap(),
      a = new WeakMap(),
      s = new RegExp(`(<style id="${e}"(?: nonce="[^"]*")?>.*?)(</style>)`),
      l = (f) => {
        const h = ({ buffer: E, context: m }) => {
            const [y, d] = n.get(m),
              S = Object.keys(y);
            if (!S.length) return;
            let A = "";
            if (
              (S.forEach((P) => {
                ((d[P] = !0),
                  (A += P.startsWith(F) ? y[P] : `${P[0] === "@" ? "" : "."}${P}{${y[P]}}`));
              }),
              n.set(m, [{}, d]),
              E && s.test(E[0]))
            ) {
              E[0] = E[0].replace(s, (P, Xe, Ye) => `${Xe}${A}${Ye}`);
              return;
            }
            const ue = a.get(m),
              pe = `<script${ue ? ` nonce="${ue}"` : ""}>document.querySelector('#${e}').textContent+=${JSON.stringify(A)}<\/script>`;
            if (E) {
              E[0] = `${pe}${E[0]}`;
              return;
            }
            return Promise.resolve(pe);
          },
          k = ({ context: E }) => {
            n.has(E) || n.set(E, [{}, {}]);
            const [m, y] = n.get(E);
            let d = !0;
            if (
              (y[f[L]] || ((d = !1), (m[f[L]] = f[C])),
              f[$].forEach(({ [b]: S, [C]: A }) => {
                y[S] || ((d = !1), (m[S] = A));
              }),
              !d)
            )
              return Promise.resolve(R("", [h]));
          },
          x = new String(f[b]);
        (Object.assign(x, f), (x.isEscaped = !0), (x.callbacks = [k]));
        const O = Promise.resolve(x);
        return (Object.assign(O, f), (O.toString = t.toString), O);
      },
      c = (f, ...h) => l(le(f, h)),
      u = (...f) => ((f = Dt(f)), c(Array(f.length).fill(""), ...f)),
      o = jt,
      p = (f, ...h) => l(Ht(f, h)),
      i = ({ children: f, nonce: h } = {}) =>
        R(`<style id="${e}"${h ? ` nonce="${h}"` : ""}>${f ? f[C] : ""}</style>`, [
          ({ context: k }) => {
            a.set(k, h);
          },
        ]);
    return ((i[ie] = r), { css: c, cx: u, keyframes: o, viewTransition: p, Style: i });
  },
  Ve = qt({ id: Mt }),
  M = Ve.css,
  Ut = Ve.Style;
const Y = M`
  border: none;
  margin-bottom: 1rem;
`,
  Q = M`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`,
  ee = M`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`,
  w = M`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  color: var(--color-text-muted);
`,
  Wt = M`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-code-bg);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`,
  zt = M`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-code-text);
  font-family: monospace;
  font-size: 0.875rem;
  outline: none;
  
  @media (max-width: 640px) {
    margin-bottom: 0.5rem;
  }
`,
  Gt = M`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
`,
  Kt = () => {
    const [e, t] = D("ical"),
      [r, n] = D("all"),
      [a, s] = D("all"),
      [l, c] = D(!1),
      u = () => {
        const p = window.location.origin,
          i = e === "ical" ? "/schedule.ics" : "/feed.xml",
          f = new URLSearchParams();
        return (
          r !== "all" && f.set("role", r),
          a !== "all" && f.set("status", a),
          f.toString() ? `${p}${i}?${f}` : `${p}${i}`
        );
      },
      o = () => {
        navigator.clipboard.writeText(u()).then(() => {
          (c(!0), setTimeout(() => c(!1), 2e3));
        });
      };
    return v(Rt, {
      children: [
        v(Ut, {}),
        v("fieldset", {
          class: Y,
          children: [
            v("legend", { class: Q, children: "フィード形式" }),
            v("div", {
              class: ee,
              children: [
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "format",
                      value: "ical",
                      checked: e === "ical",
                      onChange: () => t("ical"),
                    }),
                    "iCal",
                  ],
                }),
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "format",
                      value: "rss",
                      checked: e === "rss",
                      onChange: () => t("rss"),
                    }),
                    "RSS",
                  ],
                }),
              ],
            }),
          ],
        }),
        v("fieldset", {
          class: Y,
          children: [
            v("legend", { class: Q, children: "参加種別" }),
            v("div", {
              class: ee,
              children: [
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "role",
                      value: "all",
                      checked: r === "all",
                      onChange: () => n("all"),
                    }),
                    "すべて",
                  ],
                }),
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "role",
                      value: "speaker",
                      checked: r === "speaker",
                      onChange: () => n("speaker"),
                    }),
                    "登壇のみ",
                  ],
                }),
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "role",
                      value: "attendee",
                      checked: r === "attendee",
                      onChange: () => n("attendee"),
                    }),
                    "参加のみ",
                  ],
                }),
              ],
            }),
          ],
        }),
        v("fieldset", {
          class: Y,
          children: [
            v("legend", { class: Q, children: "ステータス" }),
            v("div", {
              class: ee,
              children: [
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "status",
                      value: "all",
                      checked: a === "all",
                      onChange: () => s("all"),
                    }),
                    "すべて",
                  ],
                }),
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "status",
                      value: "confirmed",
                      checked: a === "confirmed",
                      onChange: () => s("confirmed"),
                    }),
                    "確定のみ",
                  ],
                }),
                v("label", {
                  class: w,
                  children: [
                    v("input", {
                      type: "radio",
                      name: "status",
                      value: "tentative",
                      checked: a === "tentative",
                      onChange: () => s("tentative"),
                    }),
                    "仮のみ",
                  ],
                }),
              ],
            }),
          ],
        }),
        v("div", {
          class: Wt,
          children: [
            v("input", { type: "text", class: zt, value: u(), readonly: !0 }),
            v("button", { class: Gt, onClick: o, children: l ? "Copied!" : "Copy" }),
          ],
        }),
      ],
    });
  },
  Ae = document.getElementById("url-builder-root");
Ae && St(v(Kt, {}), Ae);
