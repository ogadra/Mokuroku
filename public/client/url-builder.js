var Qe = { Stringify: 1 },
  L = (e, t) => {
    const r = new String(e);
    return ((r.isEscaped = !0), (r.callbacks = t), r);
  },
  et = /[&<>'"]/,
  tt = async (e, t) => {
    let r = "";
    t ||= [];
    const n = await Promise.all(e);
    for (let s = n.length - 1; (r += n[s]), s--, !(s < 0); s--) {
      let a = n[s];
      typeof a == "object" && t.push(...(a.callbacks || []));
      const l = a.isEscaped;
      if (
        ((a = await (typeof a == "object" ? a.toString() : a)),
        typeof a == "object" && t.push(...(a.callbacks || [])),
        a.isEscaped ?? l)
      )
        r += a;
      else {
        const c = [r];
        (j(a, c), (r = c[0]));
      }
    }
    return L(r, t);
  },
  j = (e, t) => {
    const r = e.search(et);
    if (r === -1) {
      t[0] += e;
      return;
    }
    let n,
      s,
      a = 0;
    for (s = r; s < e.length; s++) {
      switch (e.charCodeAt(s)) {
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
      ((t[0] += e.substring(a, s) + n), (a = s + 1));
    }
    t[0] += e.substring(a, s);
  },
  rt = (e) => {
    const t = e.callbacks;
    if (!t?.length) return e;
    const r = [e],
      n = {};
    return (t.forEach((s) => s({ phase: Qe.Stringify, buffer: r, context: n })), r[0]);
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
  st = {},
  J = "data-precedence",
  at = (e) => (Array.isArray(e) ? e : [e]),
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
      const s =
        r[0] === "-" || !/[A-Z]/.test(r) ? r : r.replace(/[A-Z]/g, (a) => `-${a.toLowerCase()}`);
      t(
        s,
        n == null
          ? null
          : typeof n == "number"
            ? s.match(
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
      const s = e[r];
      if (typeof s == "string") j(s, t);
      else {
        if (typeof s == "boolean" || s === null || s === void 0) continue;
        s instanceof $e
          ? s.toStringToBuffer(t)
          : typeof s == "number" || s.isEscaped
            ? (t[0] += s)
            : s instanceof Promise
              ? t.unshift("", s)
              : oe(s, t);
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
          ? rt(L(e[0], e.callbacks)).toString()
          : e[0]
        : tt(e, e.callbacks);
    }
    toStringToBuffer(e) {
      const t = this.tag,
        r = this.props;
      let { children: n } = this;
      e[0] += `<${t}`;
      const s = (a) => re(a);
      for (let [a, l] of Object.entries(r))
        if (((a = s(a)), a !== "children")) {
          if (a === "style" && typeof l == "object") {
            let c = "";
            (we(l, (u, o) => {
              o != null && (c += `${c ? ";" : ""}${u}:${o}`);
            }),
              (e[0] += ' style="'),
              j(c, e),
              (e[0] += '"'));
          } else if (typeof l == "string") ((e[0] += ` ${a}="`), j(l, e), (e[0] += '"'));
          else if (l != null)
            if (typeof l == "number" || l.isEscaped) e[0] += ` ${a}="${l}"`;
            else if (typeof l == "boolean" && ot.includes(a)) l && (e[0] += ` ${a}=""`);
            else if (a === "dangerouslySetInnerHTML") {
              if (n.length > 0)
                throw new Error(
                  "Can only set one of `children` or `props.dangerouslySetInnerHTML`.",
                );
              n = [L(l.__html)];
            } else if (l instanceof Promise) ((e[0] += ` ${a}="`), e.unshift('"', l));
            else if (typeof l == "function") {
              if (!a.startsWith("on") && a !== "ref")
                throw new Error(`Invalid prop '${a}' of type 'function' supplied to '${t}'.`);
            } else ((e[0] += ` ${a}="`), j(l.toString(), e), (e[0] += '"'));
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
  de = (e) => ((e[Te] = !0), e),
  xe =
    (e) =>
    ({ value: t, children: r }) => {
      if (!r) return;
      const n = {
        children: [
          {
            tag: de(() => {
              e.push(t);
            }),
            props: {},
          },
        ],
      };
      (Array.isArray(r) ? n.children.push(...r.flat()) : n.children.push(r),
        n.children.push({
          tag: de(() => {
            e.pop();
          }),
          props: {},
        }));
      const s = { tag: "", props: n, type: "" };
      return (
        (s[te] = (a) => {
          throw (e.pop(), a);
        }),
        s
      );
    },
  Re = (e) => {
    const t = [e],
      r = xe(t);
    return ((r.values = t), (r.Provider = r), W.push(r), r);
  },
  W = [],
  ft = (e) => {
    const t = [e],
      r = (n) => {
        t.push(n.value);
        let s;
        try {
          s = n.children
            ? (Array.isArray(n.children) ? new ct("", {}, n.children) : n.children).toString()
            : "";
        } finally {
          t.pop();
        }
        return s instanceof Promise ? s.then((a) => L(a, a.callbacks)) : L(s);
      };
    return ((r.values = t), (r.Provider = r), (r[ie] = xe(t)), W.push(r), r);
  },
  Pe = (e) => e.values.at(-1),
  I = "_hp",
  ut = { Change: "Input", DoubleClick: "DblClick" },
  pt = { svg: "2000/svg", math: "1998/Math/MathML" },
  F = [],
  ne = new WeakMap(),
  N = void 0,
  dt = () => N,
  T = (e) => "t" in e,
  V = { onClick: ["click", !1] },
  ve = (e) => {
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
  vt = (e, t, r) => {
    t ||= {};
    for (let n in t) {
      const s = t[n];
      if (n !== "children" && (!r || r[n] !== s)) {
        n = re(n);
        const a = ve(n);
        if (a) {
          if (r?.[n] !== s && (r && e.removeEventListener(a[0], r[n], a[1]), s != null)) {
            if (typeof s != "function")
              throw new Error(`Event handler for "${n}" is not a function`);
            e.addEventListener(a[0], s, a[1]);
          }
        } else if (n === "dangerouslySetInnerHTML" && s) e.innerHTML = s.__html;
        else if (n === "ref") {
          let l;
          (typeof s == "function"
            ? (l = s(e) || (() => s(null)))
            : s && "current" in s && ((s.current = e), (l = () => (s.current = null))),
            ne.set(e, l));
        } else if (n === "style") {
          const l = e.style;
          typeof s == "string"
            ? (l.cssText = s)
            : ((l.cssText = ""), s != null && we(s, l.setProperty.bind(l)));
        } else {
          if (n === "value") {
            const c = e.nodeName;
            if (c === "INPUT" || c === "TEXTAREA" || c === "SELECT") {
              if (((e.value = s == null || s === !1 ? null : s), c === "TEXTAREA")) {
                e.textContent = s;
                continue;
              } else if (c === "SELECT") {
                e.selectedIndex === -1 && (e.selectedIndex = 0);
                continue;
              }
            }
          } else
            ((n === "checked" && e.nodeName === "INPUT") ||
              (n === "selected" && e.nodeName === "OPTION")) &&
              (e[n] = s);
          const l = he(e, n);
          s == null || s === !1
            ? e.removeAttribute(l)
            : s === !0
              ? e.setAttribute(l, "")
              : typeof s == "string" || typeof s == "number"
                ? e.setAttribute(l, s)
                : e.setAttribute(l, s.toString());
        }
      }
    }
    if (r)
      for (let n in r) {
        const s = r[n];
        if (n !== "children" && !(n in t)) {
          n = re(n);
          const a = ve(n);
          a
            ? e.removeEventListener(a[0], s, a[1])
            : n === "ref"
              ? ne.get(e)?.()
              : e.removeAttribute(he(e, n));
        }
      }
  },
  ht = (e, t) => {
    ((t[g][0] = 0), F.push([e, t]));
    const r = t.tag[ie] || t.tag,
      n = r.defaultProps ? { ...r.defaultProps, ...t.props } : t.props;
    try {
      return [r.call(null, n)];
    } finally {
      F.pop();
    }
  },
  Le = (e, t, r, n, s) => {
    (e.vR?.length && (n.push(...e.vR), delete e.vR),
      typeof e.tag == "function" && e[g][1][De]?.forEach((a) => s.push(a)),
      e.vC.forEach((a) => {
        if (T(a)) r.push(a);
        else if (typeof a.tag == "function" || a.tag === "") {
          a.c = t;
          const l = r.length;
          if ((Le(a, t, r, n, s), a.s)) {
            for (let c = l; c < r.length; c++) r[c].s = !0;
            a.s = !1;
          }
        } else (r.push(a), a.vR?.length && (n.push(...a.vR), delete a.vR));
      }));
  },
  mt = (e) => {
    for (; ; e = e.tag === I || !e.vC || !e.pP ? e.nN : e.vC[0]) {
      if (!e) return null;
      if (e.tag !== I && e.e) return e.e;
    }
  },
  Oe = (e) => {
    (T(e) ||
      (e[g]?.[1][De]?.forEach((t) => t[2]?.()),
      ne.get(e.e)?.(),
      e.p === 2 && e.vC?.forEach((t) => (t.p = 2)),
      e.vC?.forEach(Oe)),
      e.p || (e.e?.remove(), delete e.e),
      typeof e.tag == "function" && (_.delete(e), U.delete(e), delete e[g][3], (e.a = !0)));
  },
  ce = (e, t, r) => {
    ((e.c = t), Me(e, t, r));
  },
  me = (e, t) => {
    if (t) {
      for (let r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
    }
  },
  ye = Symbol(),
  Me = (e, t, r) => {
    const n = [],
      s = [],
      a = [];
    (Le(e, t, n, s, a), s.forEach(Oe));
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
        const v = r || !i.e;
        T(i)
          ? (i.e && i.d && (i.e.textContent = i.t),
            (i.d = !1),
            (f = i.e ||= document.createTextNode(i.t)))
          : ((f = i.e ||=
              i.n ? document.createElementNS(i.n, i.tag) : document.createElement(i.tag)),
            vt(f, i.props, i.pP),
            Me(i, f, v));
      }
      i.tag === I
        ? c--
        : r
          ? f.parentNode || t.appendChild(f)
          : l[c] !== f &&
            l[c - 1] !== f &&
            (l[c + 1] === f ? t.appendChild(l[c]) : t.insertBefore(f, u || l[c] || null));
    }
    if ((e.pP && delete e.pP, a.length)) {
      const o = [],
        p = [];
      (a.forEach(([, i, , f, v]) => {
        (i && o.push(i), f && p.push(f), v?.());
      }),
        o.forEach((i) => i()),
        p.length &&
          requestAnimationFrame(() => {
            p.forEach((i) => i());
          }));
    }
  },
  yt = (e, t) => !!(e && e.length === t.length && e.every((r, n) => r[1] === t[n][1])),
  U = new WeakMap(),
  z = (e, t, r) => {
    const n = !r && t.pC;
    r && (t.pC ||= t.vC);
    let s;
    try {
      ((r ||= typeof t.tag == "function" ? ht(e, t) : at(t.props.children)),
        r[0]?.tag === "" && r[0][te] && ((s = r[0][te]), e[5].push([e, s, t])));
      const a = n ? [...t.pC] : t.vC ? [...t.vC] : void 0,
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
          if (a && a.length) {
            const i = a.findIndex(
              T(o)
                ? (f) => T(f)
                : o.key !== void 0
                  ? (f) => f.key === o.key && f.tag === o.tag
                  : (f) => f.tag === o.tag,
            );
            i !== -1 && ((p = a[i]), a.splice(i, 1));
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
            const i = Pe(N);
            i && (o.n = i);
          }
          if ((!T(o) && !o.s && (z(e, o), delete o.f), l.push(o), c && !c.s && !o.s))
            for (let i = c; i && !T(i); i = i.vC?.at(-1)) i.nN = o;
          c = o;
        }
      }
      ((t.vR = n ? [...t.vC, ...(a || [])] : a || []), (t.vC = l), n && delete t.pC);
    } catch (a) {
      if (((t.f = !0), a === ye)) {
        if (s) return;
        throw a;
      }
      const [l, c, u] = t[g]?.[3] || [];
      if (c) {
        const o = () => q([0, !1, e[2]], u),
          p = U.get(u) || [];
        (p.push(o), U.set(u, p));
        const i = c(a, () => {
          const f = U.get(u);
          if (f) {
            const v = f.indexOf(o);
            if (v !== -1) return (f.splice(v, 1), o());
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
      throw a;
    } finally {
      s && e[5].pop();
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
          ((N ||= Re("")),
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
  q = async (e, t) => {
    e[5] ||= [];
    const r = _.get(t);
    r && r[0](void 0);
    let n;
    const s = new Promise((a) => (n = a));
    if (
      (_.set(t, [
        n,
        () => {
          e[2]
            ? e[2](e, t, (a) => {
                ge(a, t);
              }).then(() => n(t))
            : (ge(e, t), n(t));
        },
      ]),
      Se.length)
    )
      Se.at(-1).add(t);
    else {
      await Promise.resolve();
      const a = _.get(t);
      a && (_.delete(t), a[1]());
    }
    return s;
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
      r = F.at(-1);
    if (!r) return [t(), () => {}];
    const [, n] = r,
      s = (n[g][1][bt] ||= []),
      a = n[g][0]++;
    return (s[a] ||= [
      t(),
      (l) => {
        const c = At,
          u = s[a];
        if ((typeof l == "function" && (l = l(u[0])), !Object.is(l, u[0])))
          if (((u[0] = l), Ee.length)) {
            const [o, p] = Ee.at(-1);
            Promise.all([o === 3 ? n : q([o, !1, c], n), p]).then(([i]) => {
              if (!i || !(o === 2 || o === 3)) return;
              const f = i.vC;
              requestAnimationFrame(() => {
                setTimeout(() => {
                  f === i.vC && q([o === 3 ? 1 : 0, !1, c], i);
                });
              });
            });
          } else q([0, !1, c], n);
      },
    ]);
  },
  fe = (e, t) => {
    const r = F.at(-1);
    if (!r) return e;
    const [, n] = r,
      s = (n[g][1][Ct] ||= []),
      a = n[g][0]++,
      l = s[a];
    return (je(l?.[1], t) ? (s[a] = [e, t]) : (e = s[a][0]), e);
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
    const r = F.at(-1);
    if (!r) return e();
    const [, n] = r,
      s = (n[g][1][kt] ||= []),
      a = n[g][0]++,
      l = s[a];
    return (je(l?.[1], t) && (s[a] = [e(), t]), s[a][0]);
  },
  $t = Re({ pending: !1, data: null, method: null, action: null }),
  be = new Set(),
  xt = (e) => {
    (be.add(e), e.finally(() => be.delete(e)));
  },
  Rt = () => {
    ((se = Object.create(null)), (ae = Object.create(null)));
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
        const s = t(r);
        return () => {
          (s?.(), n?.());
        };
      },
      [e],
    ),
  se = Object.create(null),
  ae = Object.create(null),
  H = (e, t, r, n, s) => {
    if (t?.itemProp) return { tag: e, props: t, type: e, ref: t.ref };
    const a = document.head;
    let { onLoad: l, onError: c, precedence: u, blocking: o, ...p } = t,
      i = null,
      f = !1;
    const v = Z[e];
    let k;
    if (v.length > 0) {
      const m = a.querySelectorAll(e);
      e: for (const y of m)
        for (const h of Z[e])
          if (y.getAttribute(h) === t[h]) {
            i = y;
            break e;
          }
      if (!i) {
        const y = v.reduce((h, S) => (t[S] === void 0 ? h : `${h}-${S}-${t[S]}`), e);
        ((f = !ae[y]),
          (i = ae[y] ||=
            (() => {
              const h = document.createElement(e);
              for (const S of v)
                (t[S] !== void 0 && h.setAttribute(S, t[S]), t.rel && h.setAttribute("rel", t.rel));
              return h;
            })()));
      }
    } else k = a.querySelectorAll(e);
    ((u = n ? (u ?? "") : void 0), n && (p[J] = u));
    const R = fe(
        (m) => {
          if (v.length > 0) {
            let y = !1;
            for (const h of a.querySelectorAll(e)) {
              if (y && h.getAttribute(J) !== u) {
                a.insertBefore(m, h);
                return;
              }
              h.getAttribute(J) === u && (y = !0);
            }
            a.appendChild(m);
          } else if (k) {
            let y = !1;
            for (const h of k)
              if (h === m) {
                y = !0;
                break;
              }
            (y || a.insertBefore(m, a.contains(k[0]) ? k[0] : a.querySelector(e)), (k = void 0));
          }
        },
        [u],
      ),
      M = G(t.ref, (m) => {
        const y = v[0];
        if ((r === 2 && (m.innerHTML = ""), (f || k) && R(m), !c && !l)) return;
        let h = (se[m.getAttribute(y)] ||= new Promise((S, A) => {
          (m.addEventListener("load", S), m.addEventListener("error", A));
        }));
        (l && (h = h.then(l)), c && (h = h.catch(c)), h.catch(() => {}));
      });
    if (s && o === "render") {
      const m = Z[e][0];
      if (t[m]) {
        const y = t[m],
          h = (se[y] ||= new Promise((S, A) => {
            (R(i), i.addEventListener("load", S), i.addEventListener("error", A));
          }));
        Tt(h);
      }
    }
    const E = { tag: e, type: e, props: { ...p, ref: M }, ref: M };
    return ((E.p = r), i && (E.e = i), Et(E, a));
  },
  Ie = (e) => {
    const t = dt();
    return (t && Pe(t))?.endsWith("svg")
      ? { tag: "title", props: e, type: "title", ref: e.ref }
      : H("title", e, void 0, !1, !1);
  },
  Fe = (e) =>
    !e || ["src", "async"].some((t) => !e[t])
      ? { tag: "script", props: e, type: "script", ref: e.ref }
      : H("script", e, 1, !1, !0),
  He = (e) =>
    !e || !["href", "precedence"].every((t) => t in e)
      ? { tag: "style", props: e, type: "style", ref: e.ref }
      : ((e["data-href"] = e.href), delete e.href, H("style", e, 2, !0, !0)),
  Be = (e) =>
    !e ||
    ["onLoad", "onError"].some((t) => t in e) ||
    (e.rel === "stylesheet" && (!("precedence" in e) || "disabled" in e))
      ? { tag: "link", props: e, type: "link", ref: e.ref }
      : H("link", e, 1, "precedence" in e, !0),
  Ue = (e) => H("meta", e, void 0, !1, !1),
  qe = Symbol(),
  We = (e) => {
    const { action: t, ...r } = e;
    typeof t != "function" && (r.action = t);
    const [n, s] = D([null, !1]),
      a = fe(async (o) => {
        const p = o.isTrusted ? t : o.detail[qe];
        if (typeof p != "function") return;
        o.preventDefault();
        const i = new FormData(o.target);
        s([i, !0]);
        const f = p(i);
        (f instanceof Promise && (xt(f), await f), s([null, !0]));
      }, []),
      l = G(
        e.ref,
        (o) => (
          o.addEventListener("submit", a),
          () => {
            o.removeEventListener("submit", a);
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
      const n = fe((s) => {
        (s.preventDefault(),
          s.currentTarget.form.dispatchEvent(new CustomEvent("submit", { detail: { [qe]: t } })));
      }, []);
      r.ref = G(
        r.ref,
        (s) => (
          s.addEventListener("click", n),
          () => {
            s.removeEventListener("click", n);
          }
        ),
      );
    }
    return { tag: e, props: r, type: e, ref: r.ref };
  },
  Ge = (e) => ze("input", e),
  Ke = (e) => ze("button", e);
Object.assign(st, {
  title: Ie,
  script: Fe,
  style: He,
  link: Be,
  meta: Ue,
  form: We,
  input: Ge,
  button: Ke,
});
const Ce = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      button: Ke,
      clearCache: Rt,
      composeRef: G,
      form: We,
      input: Ge,
      link: Be,
      meta: Ue,
      script: Fe,
      style: He,
      title: Ie,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
var d = (e, t, r) => (
    typeof e == "string" && Ce[e] && (e = Ce[e]), { tag: e, type: e, props: t, key: r, ref: t.ref }
  ),
  Pt = (e) => d("", e, void 0);
ft(null);
new TextEncoder();
var B = ":-hono-global",
  Lt = new RegExp(`^${B}{(.*)}$`),
  Ot = "hono-css",
  O = Symbol(),
  b = Symbol(),
  C = Symbol(),
  x = Symbol(),
  K = Symbol(),
  ke = Symbol(),
  Ze = (e) => {
    let t = 0,
      r = 11;
    for (; t < e.length; ) r = (101 * r + e.charCodeAt(t++)) >>> 0;
    return "css-" + r;
  },
  Mt = ['"(?:(?:\\\\[\\s\\S]|[^"\\\\])*)"', "'(?:(?:\\\\[\\s\\S]|[^'\\\\])*)'"].join("|"),
  Nt = new RegExp(
    [
      "(" + Mt + ")",
      "(?:" + ["^\\s+", "\\/\\*.*?\\*\\/\\s*", "\\/\\/.*\\n\\s*", "\\s+$"].join("|") + ")",
      "\\s*;\\s*(}|$)\\s*",
      "\\s*([{};:,])\\s*",
      "(\\s)\\s+",
    ].join("|"),
    "g",
  ),
  _t = (e) => e.replace(Nt, (t, r, n, s, a) => r || n || s || a || ""),
  Je = (e, t) => {
    const r = [],
      n = [],
      s = e[0].match(/^\s*\/\*(.*?)\*\//)?.[1] || "";
    let a = "";
    for (let l = 0, c = e.length; l < c; l++) {
      a += e[l];
      let u = t[l];
      if (!(typeof u == "boolean" || u === null || u === void 0)) {
        Array.isArray(u) || (u = [u]);
        for (let o = 0, p = u.length; o < p; o++) {
          let i = u[o];
          if (!(typeof i == "boolean" || i === null || i === void 0))
            if (typeof i == "string")
              /([\\"'\/])/.test(i)
                ? (a += i.replace(new RegExp(`([\\\\"']|(?<=<)\\/)`, "g"), "\\$1"))
                : (a += i);
            else if (typeof i == "number") a += i;
            else if (i[ke]) a += i[ke];
            else if (i[b].startsWith("@keyframes ")) (r.push(i), (a += ` ${i[b].substring(11)} `));
            else {
              if (e[l + 1]?.match(/^\s*{/)) (r.push(i), (i = `.${i[b]}`));
              else {
                (r.push(...i[x]), n.push(...i[K]), (i = i[C]));
                const f = i.length;
                if (f > 0) {
                  const v = i[f - 1];
                  v !== ";" && v !== "}" && (i += ";");
                }
              }
              a += `${i || ""}`;
            }
        }
      }
    }
    return [s, _t(a), r, n];
  },
  le = (e, t) => {
    let [r, n, s, a] = Je(e, t);
    const l = Lt.exec(n);
    l && (n = l[1]);
    const c = (l ? B : "") + Ze(r + n),
      u = (l ? s.map((o) => o[b]) : [c, ...a]).join(" ");
    return { [O]: c, [b]: u, [C]: n, [x]: s, [K]: a };
  },
  Dt = (e) => {
    for (let t = 0, r = e.length; t < r; t++) {
      const n = e[t];
      typeof n == "string" && (e[t] = { [O]: "", [b]: "", [C]: "", [x]: [], [K]: [n] });
    }
    return e;
  },
  jt = (e, ...t) => {
    const [r, n] = Je(e, t);
    return { [O]: "", [b]: `@keyframes ${Ze(r + n)}`, [C]: n, [x]: [], [K]: [] };
  },
  It = 0,
  Ft = (e, t) => {
    e || (e = [`/* h-v-t ${It++} */`]);
    const r = Array.isArray(e) ? le(e, t) : e,
      n = r[b],
      s = le(["view-transition-name:", ""], [n]);
    return (
      (r[b] = B + r[b]),
      (r[C] = r[C].replace(new RegExp("(?<=::view-transition(?:[a-z-]*)\\()(?=\\))", "g"), n)),
      (s[b] = s[O] = n),
      (s[x] = [...r[x], r]),
      s
    );
  },
  Ht = (e) => {
    const t = [];
    let r = 0,
      n = 0;
    for (let s = 0, a = e.length; s < a; s++) {
      const l = e[s];
      if (l === "'" || l === '"') {
        const c = l;
        for (s++; s < a; s++) {
          if (e[s] === "\\") {
            s++;
            continue;
          }
          if (e[s] === c) break;
        }
        continue;
      }
      if (l === "{") {
        n++;
        continue;
      }
      if (l === "}") {
        (n--, n === 0 && (t.push(e.slice(r, s + 1)), (r = s + 1)));
        continue;
      }
    }
    return t;
  },
  Bt = ({ id: e }) => {
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
          (l.startsWith(B) ? Ht(c) : [`${l[0] === "@" ? "" : "."}${l}{${c}}`]).forEach((p) => {
            u.insertRule(p, u.cssRules.length);
          }));
      };
    return [
      {
        toString() {
          const l = this[O];
          return (
            n(l, this[C]),
            this[x].forEach(({ [b]: c, [C]: u }) => {
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
  Ut = ({ id: e }) => {
    const [t, r] = Bt({ id: e }),
      n = new WeakMap(),
      s = new WeakMap(),
      a = new RegExp(`(<style id="${e}"(?: nonce="[^"]*")?>.*?)(</style>)`),
      l = (f) => {
        const v = ({ buffer: E, context: m }) => {
            const [y, h] = n.get(m),
              S = Object.keys(y);
            if (!S.length) return;
            let A = "";
            if (
              (S.forEach((P) => {
                ((h[P] = !0),
                  (A += P.startsWith(B) ? y[P] : `${P[0] === "@" ? "" : "."}${P}{${y[P]}}`));
              }),
              n.set(m, [{}, h]),
              E && a.test(E[0]))
            ) {
              E[0] = E[0].replace(a, (P, Xe, Ye) => `${Xe}${A}${Ye}`);
              return;
            }
            const ue = s.get(m),
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
            let h = !0;
            if (
              (y[f[O]] || ((h = !1), (m[f[O]] = f[C])),
              f[x].forEach(({ [b]: S, [C]: A }) => {
                y[S] || ((h = !1), (m[S] = A));
              }),
              !h)
            )
              return Promise.resolve(L("", [v]));
          },
          R = new String(f[b]);
        (Object.assign(R, f), (R.isEscaped = !0), (R.callbacks = [k]));
        const M = Promise.resolve(R);
        return (Object.assign(M, f), (M.toString = t.toString), M);
      },
      c = (f, ...v) => l(le(f, v)),
      u = (...f) => ((f = Dt(f)), c(Array(f.length).fill(""), ...f)),
      o = jt,
      p = (f, ...v) => l(Ft(f, v)),
      i = ({ children: f, nonce: v } = {}) =>
        L(`<style id="${e}"${v ? ` nonce="${v}"` : ""}>${f ? f[C] : ""}</style>`, [
          ({ context: k }) => {
            s.set(k, v);
          },
        ]);
    return ((i[ie] = r), { css: c, cx: u, keyframes: o, viewTransition: p, Style: i });
  },
  Ve = Ut({ id: Ot }),
  w = Ve.css,
  qt = Ve.Style;
const Y = w`
  border: none;
  margin-bottom: 1rem;
`,
  Q = w`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`,
  ee = w`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`,
  $ = w`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  color: var(--color-text-muted);
`,
  Wt = w`
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
  zt = w`
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
  Gt = w`
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
  Kt = w`
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`,
  Zt = w`
  margin: 1rem 0 0 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;

  li {
    margin-bottom: 0.25rem;
  }
`,
  Jt = {
    ical: {
      description: "Google Calendar, Apple Calendar, Outlook などのカレンダーアプリに追加",
      steps: ["カレンダーアプリを開く", "「URLでカレンダーを追加」を選択", "上記URLを貼り付け"],
    },
    rss: {
      description: "Feedly, Inoreader などのRSSリーダーで購読",
      steps: ["RSSリーダーを開く", "「フィードを追加」を選択", "上記URLを貼り付け"],
    },
  },
  Vt = () => {
    const [e, t] = D("ical"),
      [r, n] = D("all"),
      [s, a] = D("all"),
      [l, c] = D(!1),
      u = () => {
        const i = window.location.origin,
          f = e === "ical" ? "/schedule.ics" : "/feed.xml",
          v = new URLSearchParams();
        return (
          r !== "all" && v.set("role", r),
          s !== "all" && v.set("status", s),
          v.toString() ? `${i}${f}?${v}` : `${i}${f}`
        );
      },
      o = () => {
        navigator.clipboard.writeText(u()).then(() => {
          (c(!0), setTimeout(() => c(!1), 2e3));
        });
      },
      p = Jt[e];
    return d(Pt, {
      children: [
        d(qt, {}),
        d("fieldset", {
          class: Y,
          children: [
            d("legend", { class: Q, children: "フィード形式" }),
            d("div", {
              class: ee,
              children: [
                d("label", {
                  class: $,
                  children: [
                    d("input", {
                      type: "radio",
                      name: "format",
                      value: "ical",
                      checked: e === "ical",
                      onChange: () => t("ical"),
                    }),
                    "iCal",
                  ],
                }),
                d("label", {
                  class: $,
                  children: [
                    d("input", {
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
        d("fieldset", {
          class: Y,
          children: [
            d("legend", { class: Q, children: "参加種別" }),
            d("div", {
              class: ee,
              children: [
                d("label", {
                  class: $,
                  children: [
                    d("input", {
                      type: "radio",
                      name: "role",
                      value: "all",
                      checked: r === "all",
                      onChange: () => n("all"),
                    }),
                    "すべて",
                  ],
                }),
                d("label", {
                  class: $,
                  children: [
                    d("input", {
                      type: "radio",
                      name: "role",
                      value: "speaker",
                      checked: r === "speaker",
                      onChange: () => n("speaker"),
                    }),
                    "登壇のみ",
                  ],
                }),
                d("label", {
                  class: $,
                  children: [
                    d("input", {
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
        d("fieldset", {
          class: Y,
          children: [
            d("legend", { class: Q, children: "ステータス" }),
            d("div", {
              class: ee,
              children: [
                d("label", {
                  class: $,
                  children: [
                    d("input", {
                      type: "radio",
                      name: "status",
                      value: "all",
                      checked: s === "all",
                      onChange: () => a("all"),
                    }),
                    "すべて",
                  ],
                }),
                d("label", {
                  class: $,
                  children: [
                    d("input", {
                      type: "radio",
                      name: "status",
                      value: "confirmed",
                      checked: s === "confirmed",
                      onChange: () => a("confirmed"),
                    }),
                    "確定のみ",
                  ],
                }),
                d("label", {
                  class: $,
                  children: [
                    d("input", {
                      type: "radio",
                      name: "status",
                      value: "tentative",
                      checked: s === "tentative",
                      onChange: () => a("tentative"),
                    }),
                    "仮のみ",
                  ],
                }),
              ],
            }),
          ],
        }),
        d("div", {
          class: Wt,
          children: [
            d("input", { type: "text", class: zt, value: u(), readonly: !0 }),
            d("button", { class: Gt, onClick: o, children: l ? "Copied!" : "Copy" }),
          ],
        }),
        d("p", { class: Kt, children: p.description }),
        d("ol", { class: Zt, children: p.steps.map((i) => d("li", { children: i })) }),
      ],
    });
  },
  Ae = document.getElementById("url-builder-root");
Ae && St(d(Vt, {}), Ae);
