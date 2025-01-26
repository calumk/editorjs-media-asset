(function(){"use strict";try{if(typeof document<"u"){var o=document.createElement("style");o.appendChild(document.createTextNode('.media-tool{--bg-color: #cdd1e0;--front-color: #388ae5;--border-color: #e8e8eb}.media-tool__media{border-radius:3px;overflow:hidden;margin-bottom:10px}.media-tool__media-picture{max-width:100%;vertical-align:bottom;display:block}.media-tool__media-preloader{width:50px;height:50px;border-radius:50%;background-size:cover;margin:auto;position:relative;background-color:var(--bg-color);background-position:center center}.media-tool__media-preloader:after{content:"";position:absolute;z-index:3;width:60px;height:60px;border-radius:50%;border:2px solid var(--bg-color);border-top-color:var(--front-color);left:50%;top:50%;margin-top:-30px;margin-left:-30px;animation:media-preloader-spin 2s infinite linear;box-sizing:border-box}.media-tool__caption[contentEditable=true][data-placeholder]:before{position:absolute!important;content:attr(data-placeholder);color:#707684;font-weight:400;display:none}.media-tool__caption[contentEditable=true][data-placeholder]:empty:before{display:block}.media-tool__caption[contentEditable=true][data-placeholder]:empty:focus:before{display:none}.media-tool--empty .media-tool__media,.media-tool--empty .media-tool__caption,.media-tool--loading .media-tool__caption{display:none}.media-tool .cdx-button{display:flex;align-items:center;justify-content:center}.media-tool .cdx-button svg{height:auto;margin:0 6px 0 0}.media-tool--filled .cdx-button,.media-tool--filled .media-tool__media-preloader{display:none}.media-tool--loading .media-tool__media{min-height:200px;display:flex;border:1px solid var(--border-color);background-color:#fff}.media-tool--loading .media-tool__media-picture,.media-tool--loading .cdx-button{display:none}.media-tool--failed .media-tool__media{min-height:100px;display:flex;border:1px solid #f00;border-radius:3px;padding:5px}.media-tool--failed .media-tool__media-preloader{display:none}.media-tool--failed .media-tool__media .url{color:red;font-size:12px;margin-top:5px}.media-tool--withBorder .media-tool__media{border:1px solid var(--border-color)}.media-tool--withBackground .media-tool__media{padding:15px;background:var(--bg-color)}.media-tool--withBackground .media-tool__media-picture{max-width:60%;margin:0 auto}.media-tool--stretched .media-tool__media-picture{width:100%}.ck-download-button{display:flex;align-items:center;justify-content:center;border:1px solid var(--border-color);border-radius:3px;cursor:pointer;padding:10px;width:100%}.ck-download-button svg{height:auto;margin:0 6px 0 0}.ck-download-button:hover{background-color:var(--bg-color)}@keyframes media-preloader-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}')),document.head.appendChild(o)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}})();
const D = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.7778 9.33331H13.7867"/></svg>';
function C(k, e = null, i = {}) {
  const s = document.createElement(k);
  Array.isArray(e) ? s.classList.add(...e) : e && s.classList.add(e);
  for (const a in i)
    s[a] = i[a];
  return s;
}
class F {
  /**
   * @param {object} ui - media tool Ui module
   * @param {object} ui.api - Editor.js API
   * @param {MediaConfig} ui.config - user config
   * @param {Function} ui.onSelectFile - callback for clicks on Select file button
   * @param {boolean} ui.readOnly - read-only mode flag
   */
  constructor({ api: e, config: i, onSelectFile: s, readOnly: a }) {
    this.api = e, this.config = i, this.onSelectFile = s, this.readOnly = a, this.nodes = {
      wrapper: C("div", [this.CSS.baseClass, this.CSS.wrapper]),
      mediaContainer: C("div", [this.CSS.mediaContainer]),
      fileButton: this.createFileButton(),
      mediaEl: void 0,
      mediaPreloader: C("div", this.CSS.mediaPreloader),
      caption: C("div", [this.CSS.input, this.CSS.caption], {
        contentEditable: !this.readOnly
      })
    }, this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder, this.nodes.mediaContainer.appendChild(this.nodes.mediaPreloader), this.nodes.wrapper.appendChild(this.nodes.mediaContainer), this.nodes.wrapper.appendChild(this.nodes.caption), this.nodes.wrapper.appendChild(this.nodes.fileButton);
  }
  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,
      /**
       * Tool's classes
       */
      wrapper: "media-tool",
      mediaContainer: "media-tool__media",
      mediaPreloader: "media-tool__media-preloader",
      mediaEl: "media-tool__media-picture",
      caption: "media-tool__caption"
    };
  }
  /**
   * Ui statuses:
   * - empty
   * - uploading
   * - filled
   *
   * @returns {{EMPTY: string, UPLOADING: string, FILLED: string}}
   */
  static get status() {
    return {
      EMPTY: "empty",
      UPLOADING: "loading",
      FILLED: "filled",
      FAILED: "failed"
    };
  }
  /**
   * Renders tool UI
   *
   * @param {MediaToolData} toolData - saved tool data
   * @returns {Element}
   */
  render(e) {
    return !e.file || Object.keys(e.file).length === 0 ? this.toggleStatus(F.status.EMPTY) : this.toggleStatus(F.status.UPLOADING), this.nodes.wrapper;
  }
  /**
   * Creates upload-file button
   *
   * @returns {Element}
   */
  createFileButton() {
    const e = C("div", [this.CSS.button]);
    return e.innerHTML = this.config.buttonContent || `${D} ${this.api.i18n.t("Upload File")}`, e.addEventListener("click", () => {
      this.onSelectFile();
    }), e;
  }
  /**
  * Creates upload-file button
  *
  * @returns {Element}
  */
  createDownloadFileButton(e) {
    const i = C("div", ["ck-download-button"]);
    return i.innerHTML = this.config.buttonContent || `${this.api.i18n.t("Download:")} ${e.split("/").pop()}`, i.addEventListener("click", () => {
      window.open(e, "_blank");
    }), i;
  }
  /**
   * Shows uploading preloader
   *
   * @param {string} src - preview source
   * @returns {void}
   */
  showPreloader(e) {
    this.nodes.mediaPreloader.style.backgroundImage = `url(${e})`, this.toggleStatus(F.status.UPLOADING);
  }
  /**
   * Hide uploading preloader
   *
   * @returns {void}
   */
  hidePreloader() {
    this.nodes.mediaPreloader.style.backgroundImage = "", this.toggleStatus(F.status.EMPTY);
  }
  /**
   * Shows a medium
   *
   * @param {string} url - medium source
   * @returns {void}
   */
  fillMedia(e) {
    let i;
    if (e.endsWith(".mp4") || e.endsWith(".webm") || e.endsWith(".ogg"))
      i = "VIDEO";
    else if (e.endsWith(".mp3") || e.endsWith(".ogg") || e.endsWith(".wav"))
      i = "AUDIO";
    else if (e.endsWith(".pdf") || e.endsWith(".doc") || e.endsWith(".docx") || e.endsWith(".xls") || e.endsWith(".xlsx") || e.endsWith(".ppt") || e.endsWith(".pptx") || e.endsWith(".zip") || e.endsWith(".rar") || e.endsWith(".7z"))
      i = "DOWNLOAD";
    else if (e.endsWith(".jpg") || e.endsWith(".jpeg") || e.endsWith(".png") || e.endsWith(".gif") || e.endsWith(".svg"))
      i = "IMG";
    else
      throw new Error("Unsupported file format");
    const s = {
      src: e
    };
    let a = "load";
    (i === "VIDEO" || i === "AUDIO") && (s.muted = !0, s.playsinline = !0, s.controls = !0, i === "AUDIO" && (s.style = "width: 100%;"), a = "loadeddata"), i === "DOWNLOAD" ? (a = "divLoaded", this.nodes.mediaEl = this.createDownloadFileButton(e)) : this.nodes.mediaEl = C(i, this.CSS.mediaEl, s);
    let o = !1;
    if (this.nodes.mediaEl.addEventListener(a, () => {
      o = !0, requestAnimationFrame(() => {
        this.toggleStatus(F.status.FILLED);
      }), this.nodes.mediaPreloader && (this.nodes.mediaPreloader.style.backgroundImage = "");
    }), this.nodes.mediaContainer.innerHTML = "", this.nodes.mediaContainer.appendChild(this.nodes.mediaEl), i == "DOWNLOAD") {
      const r = new Event("divLoaded");
      this.nodes.mediaEl.dispatchEvent(r);
    }
    setTimeout(() => {
      o || this.toggleStatus(F.status.FAILED);
    }, 4e3);
  }
  /**
   * Shows caption input
   *
   * @param {string} text - caption text
   * @returns {void}
   */
  fillCaption(e) {
    this.nodes.caption && (this.nodes.caption.innerHTML = e);
  }
  /**
   * Changes UI status
   *
   * @param {string} status - see {@link Ui.status} constants
   * @returns {void}
   */
  toggleStatus(e) {
    for (const i in F.status)
      Object.prototype.hasOwnProperty.call(F.status, i) && this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${F.status[i]}`, e === F.status[i]);
    e === F.status.FAILED && (console.log(this), this.nodes.mediaContainer.innerHTML = `<div class="ck-media-error"><b>Error loading Asset</b> <br> <span class="url">${this.nodes.mediaEl.src} </span></div>`);
  }
  /**
   * Apply visual representation of activated tune
   *
   * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
   * @param {boolean} status - true for enable, false for disable
   * @returns {void}
   */
  applyTune(e, i) {
    this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${e}`, i);
  }
}
function x(k) {
  return k && k.__esModule && Object.prototype.hasOwnProperty.call(k, "default") ? k.default : k;
}
var M = { exports: {} };
(function(k, e) {
  (function(i, s) {
    k.exports = s();
  })(window, function() {
    return function(i) {
      var s = {};
      function a(o) {
        if (s[o])
          return s[o].exports;
        var r = s[o] = { i: o, l: !1, exports: {} };
        return i[o].call(r.exports, r, r.exports, a), r.l = !0, r.exports;
      }
      return a.m = i, a.c = s, a.d = function(o, r, c) {
        a.o(o, r) || Object.defineProperty(o, r, { enumerable: !0, get: c });
      }, a.r = function(o) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(o, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(o, "__esModule", { value: !0 });
      }, a.t = function(o, r) {
        if (1 & r && (o = a(o)), 8 & r || 4 & r && typeof o == "object" && o && o.__esModule)
          return o;
        var c = /* @__PURE__ */ Object.create(null);
        if (a.r(c), Object.defineProperty(c, "default", { enumerable: !0, value: o }), 2 & r && typeof o != "string")
          for (var b in o)
            a.d(c, b, (function(d) {
              return o[d];
            }).bind(null, b));
        return c;
      }, a.n = function(o) {
        var r = o && o.__esModule ? function() {
          return o.default;
        } : function() {
          return o;
        };
        return a.d(r, "a", r), r;
      }, a.o = function(o, r) {
        return Object.prototype.hasOwnProperty.call(o, r);
      }, a.p = "", a(a.s = 3);
    }([function(i, s) {
      var a;
      a = function() {
        return this;
      }();
      try {
        a = a || new Function("return this")();
      } catch {
        typeof window == "object" && (a = window);
      }
      i.exports = a;
    }, function(i, s, a) {
      (function(o) {
        var r = a(2), c = setTimeout;
        function b() {
        }
        function d(n) {
          if (!(this instanceof d))
            throw new TypeError("Promises must be constructed via new");
          if (typeof n != "function")
            throw new TypeError("not a function");
          this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], t(n, this);
        }
        function f(n, u) {
          for (; n._state === 3; )
            n = n._value;
          n._state !== 0 ? (n._handled = !0, d._immediateFn(function() {
            var l = n._state === 1 ? u.onFulfilled : u.onRejected;
            if (l !== null) {
              var g;
              try {
                g = l(n._value);
              } catch (m) {
                return void y(u.promise, m);
              }
              p(u.promise, g);
            } else
              (n._state === 1 ? p : y)(u.promise, n._value);
          })) : n._deferreds.push(u);
        }
        function p(n, u) {
          try {
            if (u === n)
              throw new TypeError("A promise cannot be resolved with itself.");
            if (u && (typeof u == "object" || typeof u == "function")) {
              var l = u.then;
              if (u instanceof d)
                return n._state = 3, n._value = u, void v(n);
              if (typeof l == "function")
                return void t((g = l, m = u, function() {
                  g.apply(m, arguments);
                }), n);
            }
            n._state = 1, n._value = u, v(n);
          } catch (h) {
            y(n, h);
          }
          var g, m;
        }
        function y(n, u) {
          n._state = 2, n._value = u, v(n);
        }
        function v(n) {
          n._state === 2 && n._deferreds.length === 0 && d._immediateFn(function() {
            n._handled || d._unhandledRejectionFn(n._value);
          });
          for (var u = 0, l = n._deferreds.length; u < l; u++)
            f(n, n._deferreds[u]);
          n._deferreds = null;
        }
        function w(n, u, l) {
          this.onFulfilled = typeof n == "function" ? n : null, this.onRejected = typeof u == "function" ? u : null, this.promise = l;
        }
        function t(n, u) {
          var l = !1;
          try {
            n(function(g) {
              l || (l = !0, p(u, g));
            }, function(g) {
              l || (l = !0, y(u, g));
            });
          } catch (g) {
            if (l)
              return;
            l = !0, y(u, g);
          }
        }
        d.prototype.catch = function(n) {
          return this.then(null, n);
        }, d.prototype.then = function(n, u) {
          var l = new this.constructor(b);
          return f(this, new w(n, u, l)), l;
        }, d.prototype.finally = r.a, d.all = function(n) {
          return new d(function(u, l) {
            if (!n || n.length === void 0)
              throw new TypeError("Promise.all accepts an array");
            var g = Array.prototype.slice.call(n);
            if (g.length === 0)
              return u([]);
            var m = g.length;
            function h(O, T) {
              try {
                if (T && (typeof T == "object" || typeof T == "function")) {
                  var S = T.then;
                  if (typeof S == "function")
                    return void S.call(T, function(L) {
                      h(O, L);
                    }, l);
                }
                g[O] = T, --m == 0 && u(g);
              } catch (L) {
                l(L);
              }
            }
            for (var E = 0; E < g.length; E++)
              h(E, g[E]);
          });
        }, d.resolve = function(n) {
          return n && typeof n == "object" && n.constructor === d ? n : new d(function(u) {
            u(n);
          });
        }, d.reject = function(n) {
          return new d(function(u, l) {
            l(n);
          });
        }, d.race = function(n) {
          return new d(function(u, l) {
            for (var g = 0, m = n.length; g < m; g++)
              n[g].then(u, l);
          });
        }, d._immediateFn = typeof o == "function" && function(n) {
          o(n);
        } || function(n) {
          c(n, 0);
        }, d._unhandledRejectionFn = function(n) {
          typeof console < "u" && console && console.warn("Possible Unhandled Promise Rejection:", n);
        }, s.a = d;
      }).call(this, a(5).setImmediate);
    }, function(i, s, a) {
      s.a = function(o) {
        var r = this.constructor;
        return this.then(function(c) {
          return r.resolve(o()).then(function() {
            return c;
          });
        }, function(c) {
          return r.resolve(o()).then(function() {
            return r.reject(c);
          });
        });
      };
    }, function(i, s, a) {
      function o(t) {
        return (o = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
          return typeof n;
        } : function(n) {
          return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
        })(t);
      }
      a(4);
      var r, c, b, d, f, p, y, v = a(8), w = (c = function(t) {
        return new Promise(function(n, u) {
          t = d(t), (t = f(t)).beforeSend && t.beforeSend();
          var l = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP");
          l.open(t.method, t.url), l.setRequestHeader("X-Requested-With", "XMLHttpRequest"), Object.keys(t.headers).forEach(function(m) {
            var h = t.headers[m];
            l.setRequestHeader(m, h);
          });
          var g = t.ratio;
          l.upload.addEventListener("progress", function(m) {
            var h = Math.round(m.loaded / m.total * 100), E = Math.ceil(h * g / 100);
            t.progress(Math.min(E, 100));
          }, !1), l.addEventListener("progress", function(m) {
            var h = Math.round(m.loaded / m.total * 100), E = Math.ceil(h * (100 - g) / 100) + g;
            t.progress(Math.min(E, 100));
          }, !1), l.onreadystatechange = function() {
            if (l.readyState === 4) {
              var m = l.response;
              try {
                m = JSON.parse(m);
              } catch {
              }
              var h = v.parseHeaders(l.getAllResponseHeaders()), E = { body: m, code: l.status, headers: h };
              y(l.status) ? n(E) : u(E);
            }
          }, l.send(t.data);
        });
      }, b = function(t) {
        return t.method = "POST", c(t);
      }, d = function() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (t.url && typeof t.url != "string")
          throw new Error("Url must be a string");
        if (t.url = t.url || "", t.method && typeof t.method != "string")
          throw new Error("`method` must be a string or null");
        if (t.method = t.method ? t.method.toUpperCase() : "GET", t.headers && o(t.headers) !== "object")
          throw new Error("`headers` must be an object or null");
        if (t.headers = t.headers || {}, t.type && (typeof t.type != "string" || !Object.values(r).includes(t.type)))
          throw new Error("`type` must be taken from module's «contentType» library");
        if (t.progress && typeof t.progress != "function")
          throw new Error("`progress` must be a function or null");
        if (t.progress = t.progress || function(n) {
        }, t.beforeSend = t.beforeSend || function(n) {
        }, t.ratio && typeof t.ratio != "number")
          throw new Error("`ratio` must be a number");
        if (t.ratio < 0 || t.ratio > 100)
          throw new Error("`ratio` must be in a 0-100 interval");
        if (t.ratio = t.ratio || 90, t.accept && typeof t.accept != "string")
          throw new Error("`accept` must be a string with a list of allowed mime-types");
        if (t.accept = t.accept || "*/*", t.multiple && typeof t.multiple != "boolean")
          throw new Error("`multiple` must be a true or false");
        if (t.multiple = t.multiple || !1, t.fieldName && typeof t.fieldName != "string")
          throw new Error("`fieldName` must be a string");
        return t.fieldName = t.fieldName || "files", t;
      }, f = function(t) {
        switch (t.method) {
          case "GET":
            var n = p(t.data, r.URLENCODED);
            delete t.data, t.url = /\?/.test(t.url) ? t.url + "&" + n : t.url + "?" + n;
            break;
          case "POST":
          case "PUT":
          case "DELETE":
          case "UPDATE":
            var u = function() {
              return (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).type || r.JSON;
            }(t);
            (v.isFormData(t.data) || v.isFormElement(t.data)) && (u = r.FORM), t.data = p(t.data, u), u !== w.contentType.FORM && (t.headers["content-type"] = u);
        }
        return t;
      }, p = function() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        switch (arguments.length > 1 ? arguments[1] : void 0) {
          case r.URLENCODED:
            return v.urlEncode(t);
          case r.JSON:
            return v.jsonEncode(t);
          case r.FORM:
            return v.formEncode(t);
          default:
            return t;
        }
      }, y = function(t) {
        return t >= 200 && t < 300;
      }, { contentType: r = { URLENCODED: "application/x-www-form-urlencoded; charset=utf-8", FORM: "multipart/form-data", JSON: "application/json; charset=utf-8" }, request: c, get: function(t) {
        return t.method = "GET", c(t);
      }, post: b, transport: function(t) {
        return t = d(t), v.selectFiles(t).then(function(n) {
          for (var u = new FormData(), l = 0; l < n.length; l++)
            u.append(t.fieldName, n[l], n[l].name);
          v.isObject(t.data) && Object.keys(t.data).forEach(function(m) {
            var h = t.data[m];
            u.append(m, h);
          });
          var g = t.beforeSend;
          return t.beforeSend = function() {
            return g(n);
          }, t.data = u, b(t);
        });
      }, selectFiles: function(t) {
        return delete (t = d(t)).beforeSend, v.selectFiles(t);
      } });
      i.exports = w;
    }, function(i, s, a) {
      a.r(s);
      var o = a(1);
      window.Promise = window.Promise || o.a;
    }, function(i, s, a) {
      (function(o) {
        var r = o !== void 0 && o || typeof self < "u" && self || window, c = Function.prototype.apply;
        function b(d, f) {
          this._id = d, this._clearFn = f;
        }
        s.setTimeout = function() {
          return new b(c.call(setTimeout, r, arguments), clearTimeout);
        }, s.setInterval = function() {
          return new b(c.call(setInterval, r, arguments), clearInterval);
        }, s.clearTimeout = s.clearInterval = function(d) {
          d && d.close();
        }, b.prototype.unref = b.prototype.ref = function() {
        }, b.prototype.close = function() {
          this._clearFn.call(r, this._id);
        }, s.enroll = function(d, f) {
          clearTimeout(d._idleTimeoutId), d._idleTimeout = f;
        }, s.unenroll = function(d) {
          clearTimeout(d._idleTimeoutId), d._idleTimeout = -1;
        }, s._unrefActive = s.active = function(d) {
          clearTimeout(d._idleTimeoutId);
          var f = d._idleTimeout;
          f >= 0 && (d._idleTimeoutId = setTimeout(function() {
            d._onTimeout && d._onTimeout();
          }, f));
        }, a(6), s.setImmediate = typeof self < "u" && self.setImmediate || o !== void 0 && o.setImmediate || this && this.setImmediate, s.clearImmediate = typeof self < "u" && self.clearImmediate || o !== void 0 && o.clearImmediate || this && this.clearImmediate;
      }).call(this, a(0));
    }, function(i, s, a) {
      (function(o, r) {
        (function(c, b) {
          if (!c.setImmediate) {
            var d, f, p, y, v, w = 1, t = {}, n = !1, u = c.document, l = Object.getPrototypeOf && Object.getPrototypeOf(c);
            l = l && l.setTimeout ? l : c, {}.toString.call(c.process) === "[object process]" ? d = function(h) {
              r.nextTick(function() {
                m(h);
              });
            } : function() {
              if (c.postMessage && !c.importScripts) {
                var h = !0, E = c.onmessage;
                return c.onmessage = function() {
                  h = !1;
                }, c.postMessage("", "*"), c.onmessage = E, h;
              }
            }() ? (y = "setImmediate$" + Math.random() + "$", v = function(h) {
              h.source === c && typeof h.data == "string" && h.data.indexOf(y) === 0 && m(+h.data.slice(y.length));
            }, c.addEventListener ? c.addEventListener("message", v, !1) : c.attachEvent("onmessage", v), d = function(h) {
              c.postMessage(y + h, "*");
            }) : c.MessageChannel ? ((p = new MessageChannel()).port1.onmessage = function(h) {
              m(h.data);
            }, d = function(h) {
              p.port2.postMessage(h);
            }) : u && "onreadystatechange" in u.createElement("script") ? (f = u.documentElement, d = function(h) {
              var E = u.createElement("script");
              E.onreadystatechange = function() {
                m(h), E.onreadystatechange = null, f.removeChild(E), E = null;
              }, f.appendChild(E);
            }) : d = function(h) {
              setTimeout(m, 0, h);
            }, l.setImmediate = function(h) {
              typeof h != "function" && (h = new Function("" + h));
              for (var E = new Array(arguments.length - 1), O = 0; O < E.length; O++)
                E[O] = arguments[O + 1];
              var T = { callback: h, args: E };
              return t[w] = T, d(w), w++;
            }, l.clearImmediate = g;
          }
          function g(h) {
            delete t[h];
          }
          function m(h) {
            if (n)
              setTimeout(m, 0, h);
            else {
              var E = t[h];
              if (E) {
                n = !0;
                try {
                  (function(O) {
                    var T = O.callback, S = O.args;
                    switch (S.length) {
                      case 0:
                        T();
                        break;
                      case 1:
                        T(S[0]);
                        break;
                      case 2:
                        T(S[0], S[1]);
                        break;
                      case 3:
                        T(S[0], S[1], S[2]);
                        break;
                      default:
                        T.apply(b, S);
                    }
                  })(E);
                } finally {
                  g(h), n = !1;
                }
              }
            }
          }
        })(typeof self > "u" ? o === void 0 ? this : o : self);
      }).call(this, a(0), a(7));
    }, function(i, s) {
      var a, o, r = i.exports = {};
      function c() {
        throw new Error("setTimeout has not been defined");
      }
      function b() {
        throw new Error("clearTimeout has not been defined");
      }
      function d(l) {
        if (a === setTimeout)
          return setTimeout(l, 0);
        if ((a === c || !a) && setTimeout)
          return a = setTimeout, setTimeout(l, 0);
        try {
          return a(l, 0);
        } catch {
          try {
            return a.call(null, l, 0);
          } catch {
            return a.call(this, l, 0);
          }
        }
      }
      (function() {
        try {
          a = typeof setTimeout == "function" ? setTimeout : c;
        } catch {
          a = c;
        }
        try {
          o = typeof clearTimeout == "function" ? clearTimeout : b;
        } catch {
          o = b;
        }
      })();
      var f, p = [], y = !1, v = -1;
      function w() {
        y && f && (y = !1, f.length ? p = f.concat(p) : v = -1, p.length && t());
      }
      function t() {
        if (!y) {
          var l = d(w);
          y = !0;
          for (var g = p.length; g; ) {
            for (f = p, p = []; ++v < g; )
              f && f[v].run();
            v = -1, g = p.length;
          }
          f = null, y = !1, function(m) {
            if (o === clearTimeout)
              return clearTimeout(m);
            if ((o === b || !o) && clearTimeout)
              return o = clearTimeout, clearTimeout(m);
            try {
              o(m);
            } catch {
              try {
                return o.call(null, m);
              } catch {
                return o.call(this, m);
              }
            }
          }(l);
        }
      }
      function n(l, g) {
        this.fun = l, this.array = g;
      }
      function u() {
      }
      r.nextTick = function(l) {
        var g = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var m = 1; m < arguments.length; m++)
            g[m - 1] = arguments[m];
        p.push(new n(l, g)), p.length !== 1 || y || d(t);
      }, n.prototype.run = function() {
        this.fun.apply(null, this.array);
      }, r.title = "browser", r.browser = !0, r.env = {}, r.argv = [], r.version = "", r.versions = {}, r.on = u, r.addListener = u, r.once = u, r.off = u, r.removeListener = u, r.removeAllListeners = u, r.emit = u, r.prependListener = u, r.prependOnceListener = u, r.listeners = function(l) {
        return [];
      }, r.binding = function(l) {
        throw new Error("process.binding is not supported");
      }, r.cwd = function() {
        return "/";
      }, r.chdir = function(l) {
        throw new Error("process.chdir is not supported");
      }, r.umask = function() {
        return 0;
      };
    }, function(i, s, a) {
      function o(c, b) {
        for (var d = 0; d < b.length; d++) {
          var f = b[d];
          f.enumerable = f.enumerable || !1, f.configurable = !0, "value" in f && (f.writable = !0), Object.defineProperty(c, f.key, f);
        }
      }
      var r = a(9);
      i.exports = function() {
        function c() {
          (function(p, y) {
            if (!(p instanceof y))
              throw new TypeError("Cannot call a class as a function");
          })(this, c);
        }
        var b, d, f;
        return b = c, f = [{ key: "urlEncode", value: function(p) {
          return r(p);
        } }, { key: "jsonEncode", value: function(p) {
          return JSON.stringify(p);
        } }, { key: "formEncode", value: function(p) {
          if (this.isFormData(p))
            return p;
          if (this.isFormElement(p))
            return new FormData(p);
          if (this.isObject(p)) {
            var y = new FormData();
            return Object.keys(p).forEach(function(v) {
              var w = p[v];
              y.append(v, w);
            }), y;
          }
          throw new Error("`data` must be an instance of Object, FormData or <FORM> HTMLElement");
        } }, { key: "isObject", value: function(p) {
          return Object.prototype.toString.call(p) === "[object Object]";
        } }, { key: "isFormData", value: function(p) {
          return p instanceof FormData;
        } }, { key: "isFormElement", value: function(p) {
          return p instanceof HTMLFormElement;
        } }, { key: "selectFiles", value: function() {
          var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return new Promise(function(y, v) {
            var w = document.createElement("INPUT");
            w.type = "file", p.multiple && w.setAttribute("multiple", "multiple"), p.accept && w.setAttribute("accept", p.accept), w.style.display = "none", document.body.appendChild(w), w.addEventListener("change", function(t) {
              var n = t.target.files;
              y(n), document.body.removeChild(w);
            }, !1), w.click();
          });
        } }, { key: "parseHeaders", value: function(p) {
          var y = p.trim().split(/[\r\n]+/), v = {};
          return y.forEach(function(w) {
            var t = w.split(": "), n = t.shift(), u = t.join(": ");
            n && (v[n] = u);
          }), v;
        } }], (d = null) && o(b.prototype, d), f && o(b, f), c;
      }();
    }, function(i, s) {
      var a = function(r) {
        return encodeURIComponent(r).replace(/[!'()*]/g, escape).replace(/%20/g, "+");
      }, o = function(r, c, b, d) {
        return c = c || null, b = b || "&", d = d || null, r ? function(f) {
          for (var p = new Array(), y = 0; y < f.length; y++)
            f[y] && p.push(f[y]);
          return p;
        }(Object.keys(r).map(function(f) {
          var p, y, v = f;
          if (d && (v = d + "[" + v + "]"), typeof r[f] == "object" && r[f] !== null)
            p = o(r[f], null, b, v);
          else {
            c && (y = v, v = !isNaN(parseFloat(y)) && isFinite(y) ? c + Number(v) : v);
            var w = r[f];
            w = (w = (w = (w = w === !0 ? "1" : w) === !1 ? "0" : w) === 0 ? "0" : w) || "", p = a(v) + "=" + a(w);
          }
          return p;
        })).join(b).replace(/[!'()*]/g, "") : "";
      };
      i.exports = o;
    }]);
  });
})(M);
var I = M.exports;
const j = /* @__PURE__ */ x(I);
function _(k) {
  return k && typeof k.then == "function";
}
class R {
  /**
   * @param {object} params - uploader module params
   * @param {MediaConfig} params.config - media tool config
   * @param {Function} params.onUpload - one callback for all uploading (file, url, d-n-d, pasting)
   * @param {Function} params.onError - callback for uploading errors
   */
  constructor({ config: e, onUpload: i, onError: s }) {
    this.config = e, this.onUpload = i, this.onError = s;
  }
  /**
   * Handle clicks on the upload file button
   * Fires ajax.transport()
   *
   * @param {Function} onPreview - callback fired when preview is ready
   */
  uploadSelectedFile({ onPreview: e }) {
    const i = function(a) {
      const o = new FileReader();
      o.readAsDataURL(a), o.onload = (r) => {
        e(r.target.result);
      };
    };
    let s;
    this.config.uploader && typeof this.config.uploader.uploadByFile == "function" ? s = j.selectFiles({ accept: this.config.types }).then((a) => {
      i(a[0]);
      const o = this.config.uploader.uploadByFile(a[0]);
      return _(o) || console.warn("Custom uploader method uploadByFile should return a Promise"), o;
    }) : s = j.transport({
      url: this.config.endpoints.byFile,
      data: this.config.additionalRequestData,
      accept: this.config.types,
      headers: this.config.additionalRequestHeaders,
      beforeSend: (a) => {
        i(a[0]);
      },
      fieldName: this.config.field
    }).then((a) => a.body), s.then((a) => {
      this.onUpload(a);
    }).catch((a) => {
      this.onError(a);
    });
  }
  /**
   * Handle clicks on the upload file button
   * Fires ajax.post()
   *
   * @param {string} url - media source url
   */
  uploadByUrl(e) {
    let i;
    this.config.uploader && typeof this.config.uploader.uploadByUrl == "function" ? (i = this.config.uploader.uploadByUrl(e), _(i) || console.warn("Custom uploader method uploadByUrl should return a Promise")) : i = j.post({
      url: this.config.endpoints.byUrl,
      data: Object.assign({
        url: e
      }, this.config.additionalRequestData),
      type: j.contentType.JSON,
      headers: this.config.additionalRequestHeaders
    }).then((s) => s.body), i.then((s) => {
      this.onUpload(s);
    }).catch((s) => {
      this.onError(s);
    });
  }
  /**
   * Handle clicks on the upload file button
   * Fires ajax.post()
   *
   * @param {File} file - file pasted by drag-n-drop
   * @param {Function} onPreview - file pasted by drag-n-drop
   */
  uploadByFile(e, { onPreview: i }) {
    const s = new FileReader();
    s.readAsDataURL(e), s.onload = (o) => {
      i(o.target.result);
    };
    let a;
    if (this.config.uploader && typeof this.config.uploader.uploadByFile == "function")
      a = this.config.uploader.uploadByFile(e), _(a) || console.warn("Custom uploader method uploadByFile should return a Promise");
    else {
      const o = new FormData();
      o.append(this.config.field, e), this.config.additionalRequestData && Object.keys(this.config.additionalRequestData).length && Object.entries(this.config.additionalRequestData).forEach(([r, c]) => {
        o.append(r, c);
      }), a = j.post({
        url: this.config.endpoints.byFile,
        data: o,
        type: j.contentType.JSON,
        headers: this.config.additionalRequestHeaders
      }).then((r) => r.body);
    }
    a.then((o) => {
      this.onUpload(o);
    }).catch((o) => {
      this.onError(o);
    });
  }
}
/**
 * Media Asset Tool for the Editor.js
 *
 * @author Calum Knott <calum@calumk.com>
 * @license MIT
 *
 * To developers.
 * To simplify Tool structure, we split it to 4 parts:
 *  1) index.js — main Tool's interface, public API and methods for working with data
 *  2) uploader.js — module that has methods for sending files via AJAX: from device, by URL or File pasting
 *  3) ui.js — module for UI manipulations: render, showing preloader, etc
 *  4) tunes.js — working with Block Tunes: render buttons, handle clicks
 *
 * For debug purposes there is a testing server
 * that can save uploaded files and return a Response {@link UploadResponseFormat}
 *
 *       $ node dev/server.js
 *
 * It will expose 8008 port, so you can pass http://localhost:8008 with the Tools config:
 *
 * media: {
 *   class: MediaAssetTool,
 *   config: {
 *     endpoints: {
 *       byFile: 'http://localhost:8008/uploadFile',
 *       byUrl: 'http://localhost:8008/fetchUrl',
 *     }
 *   },
 * },
 */
let A = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M108.71,197.23l-5.11,5.11a46.63,46.63,0,0,1-66-.05h0a46.63,46.63,0,0,1,.06-65.89L72.4,101.66a46.62,46.62,0,0,1,65.94,0h0A46.34,46.34,0,0,1,150.78,124" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M147.29,58.77l5.11-5.11a46.62,46.62,0,0,1,65.94,0h0a46.62,46.62,0,0,1,0,65.94L193.94,144,183.6,154.34a46.63,46.63,0,0,1-66-.05h0A46.46,46.46,0,0,1,105.22,132" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>', U = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="152 32 152 88 208 88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="104 144 128 120 152 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="184" x2="128" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>';
class P {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: U,
      title: "Media Asset"
    };
  }
  /**
   * Available media tools
   *
   * @returns {Array}
   */
  static get tunes() {
    return [
      // {
      //   name: 'withBorder',
      //   icon: IconAddBorder,
      //   title: 'With border',
      //   toggle: true,
      // },
      // {
      //   name: 'stretched',
      //   icon: IconStretch,
      //   title: 'Stretch media',
      //   toggle: true,
      // },
      // {
      //   name: 'withBackground',
      //   icon: IconAddBackground,
      //   title: 'With background',
      //   toggle: true,
      // },
    ];
  }
  /**
   * @param {object} tool - tool properties got from editor.js
   * @param {MediaAssetToolData} tool.data - previously saved data
   * @param {MediaAssetConfig} tool.config - user config for Tool
   * @param {object} tool.api - Editor.js API
   * @param {boolean} tool.readOnly - read-only mode flag
   * @param {BlockAPI|{}} tool.block - current Block API
   */
  constructor({ data: e, config: i, api: s, readOnly: a, block: o }) {
    this.api = s, this.readOnly = a, this.block = o, this.config = {
      endpoints: i.endpoints || "",
      additionalRequestData: i.additionalRequestData || {},
      additionalRequestHeaders: i.additionalRequestHeaders || {},
      field: i.field || "media",
      types: i.types || "image/*,audio/*,video/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/zip,application/x-rar-compressed,application/x-7z-compressed",
      captionPlaceholder: this.api.i18n.t(i.captionPlaceholder || "Caption"),
      buttonContent: i.buttonContent || "",
      uploader: i.uploader || void 0,
      actions: i.actions || []
    }, this.uploader = new R({
      config: this.config,
      onUpload: (r) => this.onUpload(r),
      onError: (r) => this.uploadingFailed(r)
    }), this.ui = new F({
      api: s,
      config: this.config,
      onSelectFile: () => {
        this.uploader.uploadSelectedFile({
          onPreview: (r) => {
            this.ui.showPreloader(r);
          }
        });
      },
      readOnly: a
    }), this._data = {}, this.data = e;
  }
  /**
   * Renders Block content
   *
   * @public
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this.ui.render(this.data);
  }
  /**
   * Validate data: check if Image exists
   *
   * @param {MediaAssetToolData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return e.file && e.file.url;
  }
  /**
   * Return Block data
   *
   * @public
   *
   * @returns {MediaAssetToolData}
   */
  save() {
    const e = this.ui.nodes.caption;
    return this._data.caption = e.innerHTML, this.data;
  }
  /**
   * Returns configuration for block tunes: add background, add border, stretch media
   *
   * @public
   *
   * @returns {Array}
   */
  renderSettings() {
    const e = P.tunes.concat(this.config.actions);
    let i = {
      name: "changeUrl",
      icon: A,
      title: "Change URL",
      action: () => {
        let s = prompt("Change URL", this.data.file.url);
        this.data.file.url = s, this.ui.fillMedia(this.data.file.url);
      }
    };
    return e.push(i), e.map((s) => ({
      icon: s.icon,
      label: this.api.i18n.t(s.title),
      name: s.name,
      toggle: s.toggle,
      isActive: this.data[s.name],
      onActivate: () => {
        if (typeof s.action == "function") {
          s.action(s.name);
          return;
        }
        this.tuneToggled(s.name);
      }
    }));
  }
  /**
   * Fires after clicks on the Toolbox Image Icon
   * Initiates click on the Select File button
   *
   * @public
   */
  appendCallback() {
    this.ui.nodes.fileButton.click();
  }
  /**
   * Specify paste substitutes
   *
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @returns {{tags: string[], patterns: object<string, RegExp>, files: {extensions: string[], mimeTypes: string[]}}}
   */
  static get pasteConfig() {
    return {
      /**
       * Paste HTML into Editor
       */
      tags: [
        {
          img: { src: !0 }
        }
      ],
      /**
       * Paste URL of media into the Editor
       */
      patterns: {
        media: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp|mp3|mp4|wav|ogg|avi|mov|wmv|flv|mkv|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z)(\?[a-z0-9=]*)?$/i
      },
      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["image/*", "audio/*", "video/*", "application/pdf", "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"]
      }
    };
  }
  /**
   * Specify paste handlers
   *
   * @public
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @param {CustomEvent} event - editor.js custom paste event
   *                              {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
   * @returns {void}
   */
  async onPaste(e) {
    switch (e.type) {
      case "tag": {
        const i = e.detail.data;
        if (/^blob:/.test(i.src)) {
          const a = await (await fetch(i.src)).blob();
          this.uploadFile(a);
          break;
        }
        this.uploadUrl(i.src);
        break;
      }
      case "pattern": {
        const i = e.detail.data;
        this.uploadUrl(i);
        break;
      }
      case "file": {
        const i = e.detail.file;
        this.uploadFile(i);
        break;
      }
    }
  }
  /**
   * Private methods
   * ̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿
   */
  /**
   * Stores all Tool's data
   *
   * @private
   *
   * @param {MediaAssetToolData} data - data in Image Tool format
   */
  set data(e) {
    this.media = e.file, this._data.caption = e.caption || "", this.ui.fillCaption(this._data.caption), P.tunes.forEach(({ name: i }) => {
      const s = typeof e[i] < "u" ? e[i] === !0 || e[i] === "true" : !1;
      this.setTune(i, s);
    });
  }
  /**
   * Return Tool data
   *
   * @private
   *
   * @returns {MediaAssetToolData}
   */
  get data() {
    return this._data;
  }
  /**
   * Set new media file
   *
   * @private
   *
   * @param {object} file - uploaded file data
   */
  set media(e) {
    this._data.file = e || {}, e && e.url && this.ui.fillMedia(e.url);
  }
  /**
   * File uploading callback
   *
   * @private
   *
   * @param {UploadResponseFormat} response - uploading server response
   * @returns {void}
   */
  onUpload(e) {
    e.success && e.file ? this.media = e.file : this.uploadingFailed("incorrect response: " + JSON.stringify(e));
  }
  /**
   * Handle uploader errors
   *
   * @private
   * @param {string} errorText - uploading error text
   * @returns {void}
   */
  uploadingFailed(e) {
    console.log("Media Asset Tool: uploading failed because of", e), this.api.notifier.show({
      message: this.api.i18n.t("Couldn’t upload medium. Please try another."),
      style: "error"
    }), this.ui.hidePreloader();
  }
  /**
   * Callback fired when Block Tune is activated
   *
   * @private
   *
   * @param {string} tuneName - tune that has been clicked
   * @returns {void}
   */
  tuneToggled(e) {
    this.setTune(e, !this._data[e]);
  }
  /**
   * Set one tune
   *
   * @param {string} tuneName - {@link Tunes.tunes}
   * @param {boolean} value - tune state
   * @returns {void}
   */
  setTune(e, i) {
    this._data[e] = i, this.ui.applyTune(e, i), e === "stretched" && Promise.resolve().then(() => {
      this.block.stretched = i;
    }).catch((s) => {
      console.error(s);
    });
  }
  /**
   * Show preloader and upload media file
   *
   * @param {File} file - file that is currently uploading (from paste)
   * @returns {void}
   */
  uploadFile(e) {
    this.uploader.uploadByFile(e, {
      onPreview: (i) => {
        this.ui.showPreloader(i);
      }
    });
  }
  /**
   * Show preloader and upload media by target url
   *
   * @param {string} url - url pasted
   * @returns {void}
   */
  uploadUrl(e) {
    this.ui.showPreloader(e), this.uploader.uploadByUrl(e);
  }
}
export {
  P as default
};
