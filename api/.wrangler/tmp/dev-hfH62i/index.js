var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// .wrangler/tmp/bundle-nraO0s/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-nraO0s/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@3.19.0/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@3.19.0/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// .wrangler/tmp/bundle-nraO0s/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-nraO0s/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.ts
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/hono.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/hono-base.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/compose.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/context.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/utils/cookie.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/utils/url.js
init_checked_fetch();
init_modules_watch_stub();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
}, "getPattern");
var getPath = /* @__PURE__ */ __name((request) => {
  const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
  return match ? match[1] : "";
}, "getPath");
var getQueryStrings = /* @__PURE__ */ __name((url) => {
  const queryIndex = url.indexOf("?", 8);
  return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
}, "getQueryStrings");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = /* @__PURE__ */ __name((cookie, name) => {
  const pairs = cookie.trim().split(";");
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      return parsedCookie;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      return parsedCookie;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent_(cookieValue);
    }
    return parsedCookie;
  }, {});
}, "parse");
var _serialize = /* @__PURE__ */ __name((name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain) {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite}`;
  }
  if (opt.partitioned) {
    cookie += "; Partitioned";
  }
  return cookie;
}, "_serialize");
var serialize = /* @__PURE__ */ __name((name, value, opt = {}) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
}, "serialize");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/utils/html.js
init_checked_fetch();
init_modules_watch_stub();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/utils/stream.js
init_checked_fetch();
init_modules_watch_stub();
var StreamingApi = /* @__PURE__ */ __name(class {
  constructor(writable, _readable) {
    this.abortSubscribers = [];
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();
    const reader = _readable.getReader();
    this.responseReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        done ? controller.close() : controller.enqueue(value);
      },
      cancel: () => {
        this.abortSubscribers.forEach((subscriber) => subscriber());
      }
    });
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch (e) {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch (e) {
    }
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
  async onAbort(listener) {
    this.abortSubscribers.push(listener);
  }
}, "StreamingApi");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/context.js
var __accessCheck2 = /* @__PURE__ */ __name((obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}, "__accessCheck");
var __privateGet2 = /* @__PURE__ */ __name((obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}, "__privateGet");
var __privateAdd2 = /* @__PURE__ */ __name((obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}, "__privateAdd");
var __privateSet2 = /* @__PURE__ */ __name((obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}, "__privateSet");
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = /* @__PURE__ */ __name((headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
}, "setHeaders");
var _status;
var _executionCtx;
var _headers;
var _preparedHeaders;
var _res;
var _isFresh;
var Context = /* @__PURE__ */ __name(class {
  constructor(req, options) {
    this.env = {};
    this._var = {};
    this.finalized = false;
    this.error = void 0;
    __privateAdd2(this, _status, 200);
    __privateAdd2(this, _executionCtx, void 0);
    __privateAdd2(this, _headers, void 0);
    __privateAdd2(this, _preparedHeaders, void 0);
    __privateAdd2(this, _res, void 0);
    __privateAdd2(this, _isFresh, true);
    this.renderer = (content) => this.html(content);
    this.notFoundHandler = () => new Response();
    this.render = (...args) => this.renderer(...args);
    this.setRenderer = (renderer) => {
      this.renderer = renderer;
    };
    this.header = (name, value, options2) => {
      if (value === void 0) {
        if (__privateGet2(this, _headers)) {
          __privateGet2(this, _headers).delete(name);
        } else if (__privateGet2(this, _preparedHeaders)) {
          delete __privateGet2(this, _preparedHeaders)[name.toLocaleLowerCase()];
        }
        if (this.finalized) {
          this.res.headers.delete(name);
        }
        return;
      }
      if (options2?.append) {
        if (!__privateGet2(this, _headers)) {
          __privateSet2(this, _isFresh, false);
          __privateSet2(this, _headers, new Headers(__privateGet2(this, _preparedHeaders)));
          __privateSet2(this, _preparedHeaders, {});
        }
        __privateGet2(this, _headers).append(name, value);
      } else {
        if (__privateGet2(this, _headers)) {
          __privateGet2(this, _headers).set(name, value);
        } else {
          __privateGet2(this, _preparedHeaders) ?? __privateSet2(this, _preparedHeaders, {});
          __privateGet2(this, _preparedHeaders)[name.toLowerCase()] = value;
        }
      }
      if (this.finalized) {
        if (options2?.append) {
          this.res.headers.append(name, value);
        } else {
          this.res.headers.set(name, value);
        }
      }
    };
    this.status = (status) => {
      __privateSet2(this, _isFresh, false);
      __privateSet2(this, _status, status);
    };
    this.set = (key, value) => {
      this._var ?? (this._var = {});
      this._var[key] = value;
    };
    this.get = (key) => {
      return this._var ? this._var[key] : void 0;
    };
    this.newResponse = (data, arg, headers) => {
      if (__privateGet2(this, _isFresh) && !headers && !arg && __privateGet2(this, _status) === 200) {
        return new Response(data, {
          headers: __privateGet2(this, _preparedHeaders)
        });
      }
      if (arg && typeof arg !== "number") {
        const headers2 = setHeaders(new Headers(arg.headers), __privateGet2(this, _preparedHeaders));
        return new Response(data, {
          headers: headers2,
          status: arg.status
        });
      }
      const status = typeof arg === "number" ? arg : __privateGet2(this, _status);
      __privateGet2(this, _preparedHeaders) ?? __privateSet2(this, _preparedHeaders, {});
      __privateGet2(this, _headers) ?? __privateSet2(this, _headers, new Headers());
      setHeaders(__privateGet2(this, _headers), __privateGet2(this, _preparedHeaders));
      if (__privateGet2(this, _res)) {
        __privateGet2(this, _res).headers.forEach((v, k) => {
          __privateGet2(this, _headers)?.set(k, v);
        });
        setHeaders(__privateGet2(this, _headers), __privateGet2(this, _preparedHeaders));
      }
      headers ?? (headers = {});
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          __privateGet2(this, _headers).set(k, v);
        } else {
          __privateGet2(this, _headers).delete(k);
          for (const v2 of v) {
            __privateGet2(this, _headers).append(k, v2);
          }
        }
      }
      return new Response(data, {
        status,
        headers: __privateGet2(this, _headers)
      });
    };
    this.body = (data, arg, headers) => {
      return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
    };
    this.text = (text, arg, headers) => {
      if (!__privateGet2(this, _preparedHeaders)) {
        if (__privateGet2(this, _isFresh) && !headers && !arg) {
          return new Response(text);
        }
        __privateSet2(this, _preparedHeaders, {});
      }
      __privateGet2(this, _preparedHeaders)["content-type"] = TEXT_PLAIN;
      return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
    };
    this.json = (object, arg, headers) => {
      const body = JSON.stringify(object);
      __privateGet2(this, _preparedHeaders) ?? __privateSet2(this, _preparedHeaders, {});
      __privateGet2(this, _preparedHeaders)["content-type"] = "application/json; charset=UTF-8";
      return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
    };
    this.jsonT = (object, arg, headers) => {
      return this.json(object, arg, headers);
    };
    this.html = (html, arg, headers) => {
      __privateGet2(this, _preparedHeaders) ?? __privateSet2(this, _preparedHeaders, {});
      __privateGet2(this, _preparedHeaders)["content-type"] = "text/html; charset=UTF-8";
      if (typeof html === "object") {
        if (!(html instanceof Promise)) {
          html = html.toString();
        }
        if (html instanceof Promise) {
          return html.then((html2) => resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {})).then((html2) => {
            return typeof arg === "number" ? this.newResponse(html2, arg, headers) : this.newResponse(html2, arg);
          });
        }
      }
      return typeof arg === "number" ? this.newResponse(html, arg, headers) : this.newResponse(html, arg);
    };
    this.redirect = (location, status = 302) => {
      __privateGet2(this, _headers) ?? __privateSet2(this, _headers, new Headers());
      __privateGet2(this, _headers).set("Location", location);
      return this.newResponse(null, status);
    };
    this.streamText = (cb, arg, headers) => {
      headers ?? (headers = {});
      this.header("content-type", TEXT_PLAIN);
      this.header("x-content-type-options", "nosniff");
      this.header("transfer-encoding", "chunked");
      return this.stream(cb, arg, headers);
    };
    this.stream = (cb, arg, headers) => {
      const { readable, writable } = new TransformStream();
      const stream = new StreamingApi(writable, readable);
      cb(stream).finally(() => stream.close());
      return typeof arg === "number" ? this.newResponse(stream.responseReadable, arg, headers) : this.newResponse(stream.responseReadable, arg);
    };
    this.cookie = (name, value, opt) => {
      const cookie = serialize(name, value, opt);
      this.header("set-cookie", cookie, { append: true });
    };
    this.notFound = () => {
      return this.notFoundHandler(this);
    };
    this.req = req;
    if (options) {
      __privateSet2(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }
  get event() {
    if (__privateGet2(this, _executionCtx) && "respondWith" in __privateGet2(this, _executionCtx)) {
      return __privateGet2(this, _executionCtx);
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (__privateGet2(this, _executionCtx)) {
      return __privateGet2(this, _executionCtx);
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    __privateSet2(this, _isFresh, false);
    return __privateGet2(this, _res) || __privateSet2(this, _res, new Response("404 Not Found", { status: 404 }));
  }
  set res(_res2) {
    __privateSet2(this, _isFresh, false);
    if (__privateGet2(this, _res) && _res2) {
      __privateGet2(this, _res).headers.delete("content-type");
      for (const [k, v] of __privateGet2(this, _res).headers.entries()) {
        if (k === "set-cookie") {
          const cookies = __privateGet2(this, _res).headers.getSetCookie();
          _res2.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res2.headers.append("set-cookie", cookie);
          }
        } else {
          _res2.headers.set(k, v);
        }
      }
    }
    __privateSet2(this, _res, _res2);
    this.finalized = true;
  }
  get var() {
    return { ...this._var };
  }
  get runtime() {
    const global2 = globalThis;
    if (global2?.Deno !== void 0) {
      return "deno";
    }
    if (global2?.Bun !== void 0) {
      return "bun";
    }
    if (typeof global2?.WebSocketPair === "function") {
      return "workerd";
    }
    if (typeof global2?.EdgeRuntime === "string") {
      return "edge-light";
    }
    if (global2?.fastly !== void 0) {
      return "fastly";
    }
    if (global2?.__lagon__ !== void 0) {
      return "lagon";
    }
    if (global2?.process?.release?.name === "node") {
      return "node";
    }
    return "other";
  }
}, "Context");
_status = /* @__PURE__ */ new WeakMap();
_executionCtx = /* @__PURE__ */ new WeakMap();
_headers = /* @__PURE__ */ new WeakMap();
_preparedHeaders = /* @__PURE__ */ new WeakMap();
_res = /* @__PURE__ */ new WeakMap();
_isFresh = /* @__PURE__ */ new WeakMap();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError2 = false;
      let handler2;
      if (middleware[i]) {
        handler2 = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler2 = i === middleware.length && next || void 0;
      }
      if (!handler2) {
        if (context instanceof Context && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler2(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError2 = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError2)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/http-exception.js
init_checked_fetch();
init_modules_watch_stub();
var HTTPException = /* @__PURE__ */ __name(class extends Error {
  constructor(status = 500, options) {
    super(options?.message);
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
}, "HTTPException");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/request.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/utils/body.js
init_checked_fetch();
init_modules_watch_stub();
var parseBody = /* @__PURE__ */ __name(async (request, options = { all: false }) => {
  const contentType = request.headers.get("Content-Type");
  if (isFormDataContent(contentType)) {
    return parseFormData(request, options);
  }
  return {};
}, "parseBody");
function isFormDataContent(contentType) {
  if (contentType === null) {
    return false;
  }
  return contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded");
}
__name(isFormDataContent, "isFormDataContent");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = {};
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] && isArrayField(form[key])) {
    appendToExistingArray(form[key], value);
  } else if (form[key]) {
    convertToNewArray(form, key, value);
  } else {
    form[key] = value;
  }
}, "handleParsingAllValues");
function isArrayField(field) {
  return Array.isArray(field);
}
__name(isArrayField, "isArrayField");
var appendToExistingArray = /* @__PURE__ */ __name((arr, value) => {
  arr.push(value);
}, "appendToExistingArray");
var convertToNewArray = /* @__PURE__ */ __name((form, key, value) => {
  form[key] = [form[key], value];
}, "convertToNewArray");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/request.js
var __accessCheck3 = /* @__PURE__ */ __name((obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}, "__accessCheck");
var __privateGet3 = /* @__PURE__ */ __name((obj, member, getter) => {
  __accessCheck3(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}, "__privateGet");
var __privateAdd3 = /* @__PURE__ */ __name((obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}, "__privateAdd");
var __privateSet3 = /* @__PURE__ */ __name((obj, member, value, setter) => {
  __accessCheck3(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}, "__privateSet");
var _validatedData;
var _matchResult;
var HonoRequest = /* @__PURE__ */ __name(class {
  constructor(request, path = "/", matchResult = [[]]) {
    __privateAdd3(this, _validatedData, void 0);
    __privateAdd3(this, _matchResult, void 0);
    this.routeIndex = 0;
    this.bodyCache = {};
    this.cachedBody = (key) => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      if (bodyCache.arrayBuffer) {
        return (async () => {
          return await new Response(bodyCache.arrayBuffer)[key]();
        })();
      }
      return bodyCache[key] = raw2[key]();
    };
    this.raw = request;
    this.path = path;
    __privateSet3(this, _matchResult, matchResult);
    __privateSet3(this, _validatedData, {});
  }
  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }
  getDecodedParam(key) {
    const paramKey = __privateGet3(this, _matchResult)[0][this.routeIndex][1][key];
    const param = this.getParamValue(paramKey);
    return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : void 0;
  }
  getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(__privateGet3(this, _matchResult)[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.getParamValue(__privateGet3(this, _matchResult)[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }
  getParamValue(paramKey) {
    return __privateGet3(this, _matchResult)[1] ? __privateGet3(this, _matchResult)[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  cookie(key) {
    const cookie = this.raw.headers.get("Cookie");
    if (!cookie) {
      return;
    }
    const obj = parse(cookie);
    if (key) {
      const value = obj[key];
      return value;
    } else {
      return obj;
    }
  }
  async parseBody(options) {
    if (this.bodyCache.parsedBody) {
      return this.bodyCache.parsedBody;
    }
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    __privateGet3(this, _validatedData)[target] = data;
  }
  valid(target) {
    return __privateGet3(this, _validatedData)[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return __privateGet3(this, _matchResult)[0].map(([[, route]]) => route);
  }
  get routePath() {
    return __privateGet3(this, _matchResult)[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
  get headers() {
    return this.raw.headers;
  }
  get body() {
    return this.raw.body;
  }
  get bodyUsed() {
    return this.raw.bodyUsed;
  }
  get integrity() {
    return this.raw.integrity;
  }
  get keepalive() {
    return this.raw.keepalive;
  }
  get referrer() {
    return this.raw.referrer;
  }
  get signal() {
    return this.raw.signal;
  }
}, "HonoRequest");
_validatedData = /* @__PURE__ */ new WeakMap();
_matchResult = /* @__PURE__ */ new WeakMap();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router.js
init_checked_fetch();
init_modules_watch_stub();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = /* @__PURE__ */ __name(class extends Error {
}, "UnsupportedPathError");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/hono-base.js
var __accessCheck4 = /* @__PURE__ */ __name((obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}, "__accessCheck");
var __privateGet4 = /* @__PURE__ */ __name((obj, member, getter) => {
  __accessCheck4(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}, "__privateGet");
var __privateAdd4 = /* @__PURE__ */ __name((obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}, "__privateAdd");
var __privateSet4 = /* @__PURE__ */ __name((obj, member, value, setter) => {
  __accessCheck4(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}, "__privateSet");
var COMPOSED_HANDLER = Symbol("composedHandler");
function defineDynamicClass() {
  return class {
  };
}
__name(defineDynamicClass, "defineDynamicClass");
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  const message = "Internal Server Error";
  return c.text(message, 500);
}, "errorHandler");
var _path;
var _Hono = /* @__PURE__ */ __name(class extends defineDynamicClass() {
  constructor(options = {}) {
    super();
    this._basePath = "/";
    __privateAdd4(this, _path, "/");
    this.routes = [];
    this.notFoundHandler = notFoundHandler;
    this.errorHandler = errorHandler;
    this.onError = (handler2) => {
      this.errorHandler = handler2;
      return this;
    };
    this.notFound = (handler2) => {
      this.notFoundHandler = handler2;
      return this;
    };
    this.head = () => {
      console.warn("`app.head()` is no longer used. `app.get()` implicitly handles the HEAD method.");
      return this;
    };
    this.handleEvent = (event) => {
      return this.dispatch(event.request, event, void 0, event.request.method);
    };
    this.fetch = (request, Env, executionCtx) => {
      return this.dispatch(request, executionCtx, Env, request.method);
    };
    this.request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        if (requestInit !== void 0) {
          input = new Request(input, requestInit);
        }
        return this.fetch(input, Env, executionCtx);
      }
      input = input.toString();
      const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
      const req = new Request(path, requestInit);
      return this.fetch(req, Env, executionCtx);
    };
    this.fire = () => {
      addEventListener("fetch", (event) => {
        event.respondWith(this.dispatch(event.request, event, void 0, event.request.method));
      });
    };
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.map((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          __privateSet4(this, _path, args1);
        } else {
          this.addRoute(method, __privateGet4(this, _path), args1);
        }
        args.map((handler2) => {
          if (typeof handler2 !== "string") {
            this.addRoute(method, __privateGet4(this, _path), handler2);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers2) => {
      if (!method) {
        return this;
      }
      __privateSet4(this, _path, path);
      for (const m of [method].flat()) {
        handlers2.map((handler2) => {
          this.addRoute(m.toUpperCase(), __privateGet4(this, _path), handler2);
        });
      }
      return this;
    };
    this.use = (arg1, ...handlers2) => {
      if (typeof arg1 === "string") {
        __privateSet4(this, _path, arg1);
      } else {
        handlers2.unshift(arg1);
      }
      handlers2.map((handler2) => {
        this.addRoute(METHOD_NAME_ALL, __privateGet4(this, _path), handler2);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  route(path, app2) {
    const subApp = this.basePath(path);
    if (!app2) {
      return subApp;
    }
    app2.routes.map((r) => {
      let handler2;
      if (app2.errorHandler === errorHandler) {
        handler2 = r.handler;
      } else {
        handler2 = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler2[COMPOSED_HANDLER] = r.handler;
      }
      subApp.addRoute(r.method, r.path, handler2);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  showRoutes() {
    const length = 8;
    this.routes.map((route) => {
      console.log(
        `\x1B[32m${route.method}\x1B[0m ${" ".repeat(length - route.method.length)} ${route.path}`
      );
    });
  }
  mount(path, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path);
    const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
    const handler2 = /* @__PURE__ */ __name(async (c, next) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      const options = optionHandler ? optionHandler(c) : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(
        new Request(
          new URL((c.req.path.slice(pathPrefixLength) || "/") + queryStrings, c.req.url),
          c.req.raw
        ),
        ...optionsArray
      );
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler2);
    return this;
  }
  get routerName() {
    this.matchRoute("GET", "/");
    return this.router.name;
  }
  addRoute(method, path, handler2) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler: handler2 };
    this.router.add(method, path, [handler2, r]);
    this.routes.push(r);
  }
  matchRoute(method, path) {
    return this.router.match(method, path);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(new HonoRequest(request, path, matchResult), {
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.notFoundHandler(c))
      ).catch((err) => this.handleError(err, c)) : res;
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. You may forget returning Response object or `await next()`"
          );
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
}, "_Hono");
var Hono = _Hono;
_path = /* @__PURE__ */ new WeakMap();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/reg-exp-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/reg-exp-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/reg-exp-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = /* @__PURE__ */ __name(class {
  constructor() {
    this.children = {};
  }
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node2;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node2 = this.children[regexpStr];
      if (!node2) {
        if (Object.keys(this.children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node2 = this.children[regexpStr] = new Node();
        if (name !== "") {
          node2.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node2.varIndex]);
      }
    } else {
      node2 = this.children[token];
      if (!node2) {
        if (Object.keys(this.children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node2 = this.children[token] = new Node();
      }
    }
    node2.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, "Node");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/reg-exp-router/trie.js
init_checked_fetch();
init_modules_watch_stub();
var Trie = /* @__PURE__ */ __name(class {
  constructor() {
    this.context = { varIndex: 0 };
    this.root = new Node();
  }
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, "Trie");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/reg-exp-router/router.js
var methodNames = [METHOD_NAME_ALL, ...METHODS].map((method) => method.toUpperCase());
var emptyParam = [];
var nullMatcher = [/^$/, [], {}];
var wildcardRegExpCache = {};
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ?? (wildcardRegExpCache[path] = new RegExp(
    path === "*" ? "" : `^${path.replace(/\/\*/, "(?:|/.*)")}$`
  ));
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = {};
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = {};
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers2] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers2.map(([h]) => [h, {}]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers2.map(([h, paramCount]) => {
      const paramIndexMap = {};
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = /* @__PURE__ */ __name(class {
  constructor() {
    this.name = "RegExpRouter";
    this.middleware = { [METHOD_NAME_ALL]: {} };
    this.routes = { [METHOD_NAME_ALL]: {} };
  }
  add(method, path, handler2) {
    var _a;
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (methodNames.indexOf(method) === -1) {
      methodNames.push(method);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = {};
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          var _a2;
          (_a2 = middleware[m])[path] || (_a2[path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
        });
      } else {
        (_a = middleware[method])[path] || (_a[path] = findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler2, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler2, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        var _a2;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a2 = routes[m])[path2] || (_a2[path2] = [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ]);
          routes[m][path2].push([handler2, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  buildAllMatchers() {
    const matchers = {};
    methodNames.forEach((method) => {
      matchers[method] = this.buildMatcher(method) || matchers[METHOD_NAME_ALL];
    });
    this.middleware = this.routes = void 0;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute || (hasOwnRoute = true);
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
}, "RegExpRouter");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/smart-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/smart-router/router.js
init_checked_fetch();
init_modules_watch_stub();
var SmartRouter = /* @__PURE__ */ __name(class {
  constructor(init) {
    this.name = "SmartRouter";
    this.routers = [];
    this.routes = [];
    Object.assign(this, init);
  }
  add(method, path, handler2) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler2]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach((args) => {
          router.add(...args);
        });
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
}, "SmartRouter");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/trie-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/trie-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/trie-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var Node2 = /* @__PURE__ */ __name(class {
  constructor(method, handler2, children) {
    this.order = 0;
    this.params = {};
    this.children = children || {};
    this.methods = [];
    this.name = "";
    if (method && handler2) {
      const m = {};
      m[method] = { handler: handler2, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler2) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    const parentPatterns = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        parentPatterns.push(...curNode.patterns);
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        parentPatterns.push(...curNode.patterns);
        possibleKeys.push(pattern[1]);
      }
      parentPatterns.push(...curNode.patterns);
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = {};
    const handlerSet = {
      handler: handler2,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node2, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node2.methods.length; i < len; i++) {
      const m = node2.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = {};
        handlerSet.possibleKeys.forEach((key) => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.params = {};
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node2 = curNodes[j];
        const nextNode = node2.children[part];
        if (nextNode) {
          nextNode.params = node2.params;
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(...this.gHSets(nextNode.children["*"], method, node2.params, {}));
            }
            handlerSets.push(...this.gHSets(nextNode, method, node2.params, {}));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node2.patterns.length; k < len3; k++) {
          const pattern = node2.patterns[k];
          const params = { ...node2.params };
          if (pattern === "*") {
            const astNode = node2.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node2.params, {}));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node2.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, node2.params, params));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, params, node2.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, params, node2.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler: handler2, params }) => [handler2, params])];
  }
}, "Node");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = /* @__PURE__ */ __name(class {
  constructor() {
    this.name = "TrieRouter";
    this.node = new Node2();
  }
  add(method, path, handler2) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler2);
      }
      return;
    }
    this.node.insert(method, path, handler2);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
}, "TrieRouter");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/hono.js
var Hono2 = /* @__PURE__ */ __name(class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
}, "Hono");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/middleware/logger/index.js
init_checked_fetch();
init_modules_watch_stub();
var humanize = /* @__PURE__ */ __name((times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
}, "humanize");
var time = /* @__PURE__ */ __name((start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
}, "time");
var colorStatus = /* @__PURE__ */ __name((status) => {
  const out = {
    7: `\x1B[35m${status}\x1B[0m`,
    5: `\x1B[31m${status}\x1B[0m`,
    4: `\x1B[33m${status}\x1B[0m`,
    3: `\x1B[36m${status}\x1B[0m`,
    2: `\x1B[32m${status}\x1B[0m`,
    1: `\x1B[32m${status}\x1B[0m`,
    0: `\x1B[33m${status}\x1B[0m`
  };
  const calculateStatus = status / 100 | 0;
  return out[calculateStatus];
}, "colorStatus");
function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `  ${prefix} ${method} ${path}` : `  ${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
  fn(out);
}
__name(log, "log");
var logger = /* @__PURE__ */ __name((fn = console.log) => {
  return /* @__PURE__ */ __name(async function logger22(c, next) {
    const { method } = c.req;
    const path = getPath(c.req.raw);
    log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    log(fn, "-->", method, path, c.res.status, time(start));
  }, "logger2");
}, "logger");

// ../node_modules/.pnpm/hono@3.12.12/node_modules/hono/dist/middleware/cors/index.js
init_checked_fetch();
init_modules_watch_stub();
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      return () => optsOrigin;
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : optsOrigin[0];
    }
  })(opts.origin);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = findAllowOrigin(c.req.header("origin") || "");
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.origin !== "*") {
      set("Vary", "Origin");
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      if (opts.allowMethods?.length) {
        set("Access-Control-Allow-Methods", opts.allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: c.res.statusText
      });
    }
    await next();
  }, "cors2");
}, "cors");

// src/handlers/index.ts
init_checked_fetch();
init_modules_watch_stub();

// src/handlers/posts.ts
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/rng.js
init_checked_fetch();
init_modules_watch_stub();
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/stringify.js
init_checked_fetch();
init_modules_watch_stub();
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/v4.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/native.js
init_checked_fetch();
init_modules_watch_stub();
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// ../node_modules/.pnpm/uuid@9.0.1/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// src/db/index.ts
init_checked_fetch();
init_modules_watch_stub();

// src/db/accounts.ts
init_checked_fetch();
init_modules_watch_stub();

// src/db/posts.ts
init_checked_fetch();
init_modules_watch_stub();

// src/utils/index.ts
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@ssttevee+multipart-parser@0.1.9/node_modules/@ssttevee/multipart-parser/lib/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@ssttevee+streamsearch@0.3.1/node_modules/@ssttevee/streamsearch/lib/index.mjs
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@ssttevee+u8-utils@0.1.7/node_modules/@ssttevee/u8-utils/lib/index.mjs
init_checked_fetch();
init_modules_watch_stub();
function stringToArray(s) {
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}
__name(stringToArray, "stringToArray");
function arrayToString(a) {
  return String.fromCharCode.apply(null, a);
}
__name(arrayToString, "arrayToString");
function mergeArrays(...arrays) {
  const out = new Uint8Array(arrays.reduce((total, arr) => total + arr.length, 0));
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}
__name(mergeArrays, "mergeArrays");
function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
__name(arraysEqual, "arraysEqual");

// ../node_modules/.pnpm/@ssttevee+streamsearch@0.3.1/node_modules/@ssttevee/streamsearch/lib/index.mjs
function coerce(a) {
  if (a instanceof Uint8Array) {
    return (index) => a[index];
  }
  return a;
}
__name(coerce, "coerce");
function jsmemcmp(buf1, pos1, buf2, pos2, len) {
  const fn1 = coerce(buf1);
  const fn2 = coerce(buf2);
  for (var i = 0; i < len; ++i) {
    if (fn1(pos1 + i) !== fn2(pos2 + i)) {
      return false;
    }
  }
  return true;
}
__name(jsmemcmp, "jsmemcmp");
function createOccurenceTable(s) {
  const table = new Array(256).fill(s.length);
  if (s.length > 1) {
    for (let i = 0; i < s.length - 1; i++) {
      table[s[i]] = s.length - 1 - i;
    }
  }
  return table;
}
__name(createOccurenceTable, "createOccurenceTable");
var MATCH = Symbol("Match");
var StreamSearch = class {
  constructor(needle) {
    this._lookbehind = new Uint8Array();
    if (typeof needle === "string") {
      this._needle = needle = stringToArray(needle);
    } else {
      this._needle = needle;
    }
    this._lastChar = needle[needle.length - 1];
    this._occ = createOccurenceTable(needle);
  }
  feed(chunk) {
    let pos = 0;
    let tokens;
    const allTokens = [];
    while (pos !== chunk.length) {
      [pos, ...tokens] = this._feed(chunk, pos);
      allTokens.push(...tokens);
    }
    return allTokens;
  }
  end() {
    const tail = this._lookbehind;
    this._lookbehind = new Uint8Array();
    return tail;
  }
  _feed(data, buf_pos) {
    const tokens = [];
    let pos = -this._lookbehind.length;
    if (pos < 0) {
      while (pos < 0 && pos <= data.length - this._needle.length) {
        const ch = this._charAt(data, pos + this._needle.length - 1);
        if (ch === this._lastChar && this._memcmp(data, pos, this._needle.length - 1)) {
          if (pos > -this._lookbehind.length) {
            tokens.push(this._lookbehind.slice(0, this._lookbehind.length + pos));
          }
          tokens.push(MATCH);
          this._lookbehind = new Uint8Array();
          return [pos + this._needle.length, ...tokens];
        } else {
          pos += this._occ[ch];
        }
      }
      if (pos < 0) {
        while (pos < 0 && !this._memcmp(data, pos, data.length - pos)) {
          pos++;
        }
      }
      if (pos >= 0) {
        tokens.push(this._lookbehind);
        this._lookbehind = new Uint8Array();
      } else {
        const bytesToCutOff = this._lookbehind.length + pos;
        if (bytesToCutOff > 0) {
          tokens.push(this._lookbehind.slice(0, bytesToCutOff));
          this._lookbehind = this._lookbehind.slice(bytesToCutOff);
        }
        this._lookbehind = Uint8Array.from(new Array(this._lookbehind.length + data.length), (_, i) => this._charAt(data, i - this._lookbehind.length));
        return [data.length, ...tokens];
      }
    }
    pos += buf_pos;
    while (pos <= data.length - this._needle.length) {
      const ch = data[pos + this._needle.length - 1];
      if (ch === this._lastChar && data[pos] === this._needle[0] && jsmemcmp(this._needle, 0, data, pos, this._needle.length - 1)) {
        if (pos > buf_pos) {
          tokens.push(data.slice(buf_pos, pos));
        }
        tokens.push(MATCH);
        return [pos + this._needle.length, ...tokens];
      } else {
        pos += this._occ[ch];
      }
    }
    if (pos < data.length) {
      while (pos < data.length && (data[pos] !== this._needle[0] || !jsmemcmp(data, pos, this._needle, 0, data.length - pos))) {
        ++pos;
      }
      if (pos < data.length) {
        this._lookbehind = data.slice(pos);
      }
    }
    if (pos > 0) {
      tokens.push(data.slice(buf_pos, pos < data.length ? pos : data.length));
    }
    return [data.length, ...tokens];
  }
  _charAt(data, pos) {
    if (pos < 0) {
      return this._lookbehind[this._lookbehind.length + pos];
    }
    return data[pos];
  }
  _memcmp(data, pos, len) {
    return jsmemcmp(this._charAt.bind(this, data), pos, this._needle, 0, len);
  }
};
__name(StreamSearch, "StreamSearch");
var ReadableStreamSearch = class {
  constructor(needle, _readableStream) {
    this._readableStream = _readableStream;
    this._search = new StreamSearch(needle);
  }
  async *[Symbol.asyncIterator]() {
    const reader = this._readableStream.getReader();
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) {
          break;
        }
        yield* this._search.feed(result.value);
      }
      const tail = this._search.end();
      if (tail.length) {
        yield tail;
      }
    } finally {
      reader.releaseLock();
    }
  }
};
__name(ReadableStreamSearch, "ReadableStreamSearch");
var EOQ = Symbol("End of Queue");
var QueueableStreamSearch = class {
  constructor(needle) {
    this._chunksQueue = [];
    this._closed = false;
    this._search = new StreamSearch(needle);
  }
  push(...chunks) {
    if (this._closed) {
      throw new Error("cannot call push after close");
    }
    this._chunksQueue.push(...chunks);
    if (this._notify) {
      this._notify();
    }
  }
  close() {
    if (this._closed) {
      throw new Error("close was already called");
    }
    this._closed = true;
    this._chunksQueue.push(EOQ);
    if (this._notify) {
      this._notify();
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      let chunk;
      while (!(chunk = this._chunksQueue.shift())) {
        await new Promise((resolve2) => this._notify = resolve2);
        this._notify = void 0;
      }
      if (chunk === EOQ) {
        break;
      }
      yield* this._search.feed(chunk);
    }
    const tail = this._search.end();
    if (tail.length) {
      yield tail;
    }
  }
};
__name(QueueableStreamSearch, "QueueableStreamSearch");

// ../node_modules/.pnpm/@ssttevee+multipart-parser@0.1.9/node_modules/@ssttevee/multipart-parser/lib/index.js
var mergeArrays2 = Function.prototype.apply.bind(mergeArrays, void 0);
var dash = stringToArray("--");
var CRLF = stringToArray("\r\n");
function splitSemis(str) {
  const result = [];
  let staged = "";
  let quoted = false;
  let escaped = false;
  for (const char of str) {
    if (!escaped) {
      if (char === '"') {
        quoted = !quoted;
      } else if (char === "\\" && quoted) {
        escaped = true;
      } else if (char === ";" && !quoted) {
        result.push(staged);
        staged = "";
        continue;
      }
    } else {
      escaped = false;
    }
    staged += char;
  }
  result.push(staged);
  return result;
}
__name(splitSemis, "splitSemis");
function parseKeyValue(str) {
  const equals = str.indexOf("=");
  if (equals < 0) {
    throw new Error("malformed key-value string: missing value in `" + str + "`");
  }
  const key = str.slice(0, equals);
  const rawValue = str.slice(equals + 1);
  let value = "";
  if (rawValue.startsWith('"')) {
    if (!rawValue.endsWith('"')) {
      throw new Error("malformed key-value string: mismatched quotations in `" + rawValue + "`");
    }
    let escaped = false;
    for (const char of rawValue.slice(1, rawValue.length - 1)) {
      if (char === "\\" && !escaped) {
        escaped = true;
        continue;
      }
      if (escaped) {
        escaped = false;
      }
      value += char;
    }
  } else {
    value = rawValue;
  }
  return [key, value];
}
__name(parseKeyValue, "parseKeyValue");
function parseContentDisposition(header) {
  const parts = splitSemis(header).map((part) => part.trim());
  if (parts.shift() !== "form-data") {
    throw new Error('malformed content-disposition header: missing "form-data" in `' + JSON.stringify(parts) + "`");
  }
  const out = {};
  for (const part of parts) {
    const [name, value] = parseKeyValue(part);
    out[name] = value;
  }
  if (!out.name) {
    throw new Error("malformed content-disposition header: missing field name in `" + header + "`");
  }
  return out;
}
__name(parseContentDisposition, "parseContentDisposition");
function parsePartHeaders(lines) {
  const entries = [];
  let disposition = false;
  let line;
  while (typeof (line = lines.shift()) !== "undefined") {
    const colon = line.indexOf(":");
    if (colon === -1) {
      throw new Error("malformed multipart-form header: missing colon");
    }
    const header = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    switch (header) {
      case "content-disposition":
        disposition = true;
        entries.push(...Object.entries(parseContentDisposition(value)));
        break;
      case "content-type":
        entries.push(["contentType", value]);
    }
  }
  if (!disposition) {
    throw new Error("malformed multipart-form header: missing content-disposition");
  }
  return Object.fromEntries(entries);
}
__name(parsePartHeaders, "parsePartHeaders");
async function readHeaderLines(it, needle) {
  let firstChunk = true;
  let lastTokenWasMatch = false;
  const headerLines = [[]];
  const crlfSearch = new StreamSearch(CRLF);
  for (; ; ) {
    const result = await it.next();
    if (result.done) {
      throw new Error("malformed multipart-form data: unexpected end of stream");
    }
    if (firstChunk && result.value !== MATCH && arraysEqual(result.value.slice(0, 2), dash)) {
      return [void 0, new Uint8Array()];
    }
    let chunk;
    if (result.value !== MATCH) {
      chunk = result.value;
    } else if (!lastTokenWasMatch) {
      chunk = needle;
    } else {
      throw new Error("malformed multipart-form data: unexpected boundary");
    }
    if (!chunk.length) {
      continue;
    }
    if (firstChunk) {
      firstChunk = false;
    }
    const tokens = crlfSearch.feed(chunk);
    for (const [i, token] of tokens.entries()) {
      const isMatch = token === MATCH;
      if (!isMatch && !token.length) {
        continue;
      }
      if (lastTokenWasMatch && isMatch) {
        tokens.push(crlfSearch.end());
        return [
          headerLines.filter((chunks) => chunks.length).map(mergeArrays2).map(arrayToString),
          mergeArrays(...tokens.slice(i + 1).map((token2) => token2 === MATCH ? CRLF : token2))
        ];
      }
      if (lastTokenWasMatch = isMatch) {
        headerLines.push([]);
      } else {
        headerLines[headerLines.length - 1].push(token);
      }
    }
  }
}
__name(readHeaderLines, "readHeaderLines");
async function* streamMultipart(body, boundary) {
  const needle = mergeArrays(dash, stringToArray(boundary));
  const it = new ReadableStreamSearch(needle, body)[Symbol.asyncIterator]();
  for (; ; ) {
    const result = await it.next();
    if (result.done) {
      return;
    }
    if (result.value === MATCH) {
      break;
    }
  }
  const crlfSearch = new StreamSearch(CRLF);
  for (; ; ) {
    let feedChunk = function(chunk) {
      const chunks = [];
      for (const token of crlfSearch.feed(chunk)) {
        if (trailingCRLF) {
          chunks.push(CRLF);
        }
        if (!(trailingCRLF = token === MATCH)) {
          chunks.push(token);
        }
      }
      return mergeArrays(...chunks);
    };
    __name(feedChunk, "feedChunk");
    const [headerLines, tail] = await readHeaderLines(it, needle);
    if (!headerLines) {
      return;
    }
    async function nextToken() {
      const result = await it.next();
      if (result.done) {
        throw new Error("malformed multipart-form data: unexpected end of stream");
      }
      return result;
    }
    __name(nextToken, "nextToken");
    let trailingCRLF = false;
    let done = false;
    async function nextChunk() {
      const result = await nextToken();
      let chunk;
      if (result.value !== MATCH) {
        chunk = result.value;
      } else if (!trailingCRLF) {
        chunk = CRLF;
      } else {
        done = true;
        return { value: crlfSearch.end() };
      }
      return { value: feedChunk(chunk) };
    }
    __name(nextChunk, "nextChunk");
    const bufferedChunks = [{ value: feedChunk(tail) }];
    yield {
      ...parsePartHeaders(headerLines),
      data: {
        [Symbol.asyncIterator]() {
          return this;
        },
        async next() {
          for (; ; ) {
            const result = bufferedChunks.shift();
            if (!result) {
              break;
            }
            if (result.value.length > 0) {
              return result;
            }
          }
          for (; ; ) {
            if (done) {
              return { done, value: void 0 };
            }
            const result = await nextChunk();
            if (result.value.length > 0) {
              return result;
            }
          }
        }
      }
    };
    while (!done) {
      bufferedChunks.push(await nextChunk());
    }
  }
}
__name(streamMultipart, "streamMultipart");
async function* iterateMultipart(body, boundary) {
  for await (const part of streamMultipart(body, boundary)) {
    const chunks = [];
    for await (const chunk of part.data) {
      chunks.push(chunk);
    }
    yield {
      ...part,
      data: mergeArrays(...chunks)
    };
  }
}
__name(iterateMultipart, "iterateMultipart");
async function parseMultipart(body, boundary) {
  const parts = [];
  for await (const part of iterateMultipart(body, boundary)) {
    parts.push(part);
  }
  return parts;
}
__name(parseMultipart, "parseMultipart");

// src/utils/index.ts
var DAY = 60 * 60 * 24;
function unixTime(offset) {
  return Math.floor(Date.now() / 1e3) + offset;
}
__name(unixTime, "unixTime");
var bufferToHex = /* @__PURE__ */ __name((buffer) => [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join(""), "bufferToHex");
async function generateSignedUrl(c, imageId, expiration, size) {
  const url = new URL(
    `https://imagedelivery.net/rU-SUfJIowrXlhOg19NLsQ/${imageId}/${size}`
  );
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(c.env.IMAGES_KEY);
  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expiry = Math.floor(Date.now() / 1e3) + expiration;
  url.searchParams.set("exp", expiry.toString());
  const stringToSign = url.pathname + "?" + url.searchParams.toString();
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(stringToSign)
  );
  const sig = bufferToHex(new Uint8Array(mac).buffer);
  url.searchParams.set("sig", sig);
  return url.toString();
}
__name(generateSignedUrl, "generateSignedUrl");
var RE_MULTIPART = /^multipart\/form-data(?:;\s*boundary=(?:"((?:[^"]|\\")+)"|([^\s;]+)))$/;
var getBoundary = /* @__PURE__ */ __name((request) => {
  const contentType = request.headers.get("Content-Type");
  if (!contentType)
    return;
  const matches = RE_MULTIPART.exec(contentType);
  if (!matches)
    return;
  return matches[1] || matches[2];
}, "getBoundary");
var parseFormDataRequest = /* @__PURE__ */ __name(async (request) => {
  const boundary = getBoundary(request);
  if (!boundary || !request.body)
    return;
  const parts = await parseMultipart(request.body, boundary);
  const formDataList = [];
  for (const { name, data, contentType } of parts) {
    const filename = `${v4_default()}.${contentType?.includes("png") ? "png" : "jpeg"}`;
    const formData = new FormData();
    const file = new File([data], filename, { type: contentType });
    formData.append(name, file, filename);
    formDataList.push(formData);
  }
  return formDataList;
}, "parseFormDataRequest");

// src/db/posts.ts
var MAX = 9999999999999;
async function populatePost(c, post, options) {
  const size = options?.size ? options.size : "WRPost";
  const imageKey = `image-${post.cfImageId}-size-${size}`;
  const urlPromise = (async () => {
    let url2 = await c.env.WIGGLES.get(imageKey);
    if (url2 === null) {
      const expiration = unixTime(DAY);
      url2 = await generateSignedUrl(c, post.cfImageId, expiration, size);
      c.env.WIGGLES.put(imageKey, url2, { expirationTtl: expiration });
    }
    return url2;
  })();
  const accountPromise = (async () => {
    const account2 = await c.env.WIGGLES.get(`account-${post.accountId}`);
    if (account2 === null)
      throw new Error(`Bad post data: ${post.accountId}`);
    return account2;
  })();
  const [url, account] = await Promise.all([urlPromise, accountPromise]);
  return {
    ...post,
    url,
    account: JSON.parse(account),
    orderKey: (MAX - Number.parseInt(post.timestamp)).toString()
  };
}
__name(populatePost, "populatePost");
async function readPosts(c, options) {
  const prefix = options.email ? `post-account-${options.email}` : "post-feed";
  const { keys, cursor } = await c.env.WIGGLES.list({
    prefix,
    limit: options.limit,
    cursor: options.cursor
  });
  const promises = [];
  for (const key of keys) {
    const post = key.metadata;
    if (post === void 0)
      throw new Error("Bad data");
    promises.push(populatePost(c, post, options));
  }
  const posts = await Promise.all(promises);
  return { posts, cursor };
}
__name(readPosts, "readPosts");
async function createPosts(c, postList) {
  const body = postList.reduce((acc, post) => {
    return [
      ...acc,
      {
        key: `post-feed-${MAX - Number.parseInt(post.timestamp)}`,
        value: "",
        metadata: post
      },
      {
        key: `post-account-${post.accountId}-${MAX - Number.parseInt(post.timestamp)}`,
        value: "",
        metadata: post
      }
    ];
  }, []);
  return await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/storage/kv/namespaces/${c.env.WIGGLES_KV_ID}/bulk`,
    {
      method: "PUT",
      headers: {
        "X-Auth-Email": "john@pangalos.dev",
        "X-Auth-Key": c.env.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
}
__name(createPosts, "createPosts");
async function deletePosts(c, orderKeys) {
  const posts = [];
  const keysToDelete = [];
  for (const key of orderKeys) {
    const feedKey = `post-feed-${key}`;
    const { payload } = c.get("JWT");
    const accountKey = `post-account-${payload.email}-${key}`;
    const res = await c.env.WIGGLES.getWithMetadata(feedKey);
    if (res.metadata === null)
      throw new Error(`The id ${feedKey} does not exist.`);
    posts.push(res.metadata);
    keysToDelete.push(accountKey);
    keysToDelete.push(feedKey);
  }
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/storage/kv/namespaces/${c.env.WIGGLES_KV_ID}/bulk`,
    {
      method: "DELETE",
      headers: {
        "X-Auth-Email": "john@pangalos.dev",
        "X-Auth-Key": c.env.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(keysToDelete)
    }
  );
  for (const post of posts) {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${c.env.API_KEY}/images/v1/${post.cfImageId}`,
      {
        method: "DELETE",
        headers: {
          "X-Auth-Email": "john@pangalos.dev",
          "X-Auth-Key": c.env.API_KEY
        }
      }
    );
  }
}
__name(deletePosts, "deletePosts");

// src/handlers/posts.ts
async function GetPosts(c) {
  let size = c.req.query("size");
  if (size === null)
    size = "WRPost";
  if ("WRPost" !== size && "WRThumbnail" !== size)
    throw new Error("Invalid query param.");
  const cursor = c.req.query("cursor");
  let limitStr = c.req.query("limit");
  if (limitStr === void 0)
    limitStr = "10";
  const limit = Number.parseInt(limitStr);
  const email = c.req.query("email");
  return c.json(await readPosts(c, { size, cursor, limit, email }));
}
__name(GetPosts, "GetPosts");
async function PostUpload(c) {
  try {
    const formDataList = await parseFormDataRequest(c.req);
    const promises = formDataList?.map(async (formData) => {
      formData.set("requireSignedURLs", "true");
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/images/v1`,
        {
          method: "POST",
          body: formData,
          headers: {
            "X-Auth-Email": "john@pangalos.dev",
            "X-Auth-Key": c.env.API_KEY
          }
        }
      );
      if (response.status > 300)
        throw new Error(
          `Failed to upload image: ${res.status} ${await res.text()}`
        );
      const {
        result: { id }
      } = await response.json();
      return id;
    });
    if (promises === void 0)
      return c.json({ message: "No content" }, 204);
    const idList = await Promise.all(promises);
    const timestamp = +/* @__PURE__ */ new Date();
    const { payload } = c.get("JWT");
    const email = payload.email;
    const postList = idList.map((id, idx) => ({
      id: v4_default(),
      contentType: "image/*",
      cfImageId: id,
      timestamp: (timestamp + idx).toString(),
      accountId: email
    }));
    const res = await createPosts(c, postList);
    if (res.status > 300)
      throw new Error(
        `Failed to upload post: ${res.status} ${await res.text()}`
      );
    return c.json({ message: "success" });
  } catch (e) {
    if (e instanceof Error)
      console.error(e.message);
    return c.json(
      {
        error: "Could not upload image. Have you completed setup? Is it less than 10 MB? Is it a supported file type (PNG, JPEG, GIF, WebP)?"
      },
      500
    );
  }
}
__name(PostUpload, "PostUpload");
async function DeletePosts(c) {
  const orderKeys = await c.req.json();
  try {
    await deletePosts(c, orderKeys);
    return c.json({ message: "OK" });
  } catch (e) {
    if (e instanceof Error)
      console.error(e.message);
    return c.json(
      {
        error: "Could not delete images..."
      },
      500
    );
  }
}
__name(DeletePosts, "DeletePosts");

// src/handlers/account.ts
init_checked_fetch();
init_modules_watch_stub();
async function GetMe(c) {
  const { payload } = c.get("JWT");
  const email = payload.email;
  const meStr = await c.env.WIGGLES.get(`account-${email}`);
  if (meStr === null)
    return c.json({ message: "Account invalid" }, 422);
  const me = JSON.parse(meStr);
  return c.json(me);
}
__name(GetMe, "GetMe");

// src/middleware/index.ts
init_checked_fetch();
init_modules_watch_stub();

// src/middleware/auth.ts
init_checked_fetch();
init_modules_watch_stub();
var base64URLDecode = /* @__PURE__ */ __name((s) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  return new Uint8Array(
    Array.prototype.map.call(
      atob(s),
      (c) => c.charCodeAt(0)
    )
  );
}, "base64URLDecode");
var asciiToUint8Array = /* @__PURE__ */ __name((s) => {
  const chars = [];
  for (let i = 0; i < s.length; ++i) {
    chars.push(s.charCodeAt(i));
  }
  return new Uint8Array(chars);
}, "asciiToUint8Array");
async function validateGoogleToken(token, clientId) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT does not have three parts.");
  }
  const [header, payload, signature] = parts;
  const textDecoder = new TextDecoder("utf-8");
  const { kid, alg } = JSON.parse(
    textDecoder.decode(base64URLDecode(header))
  );
  if (alg !== "RS256") {
    throw new Error("Unknown JWT type or algorithm.");
  }
  const certsResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/certs",
    {
      cf: {
        cacheTtl: 5 * 60,
        cacheEverything: true
      }
    }
  );
  const { keys } = await certsResponse.json();
  if (!keys) {
    throw new Error("Could not fetch Google signing keys.");
  }
  const jwk = keys.find((key2) => key2.kid === kid);
  if (!jwk) {
    throw new Error("Could not find matching signing key.");
  }
  if (jwk.kty !== "RSA" || jwk.alg !== "RS256") {
    throw new Error("Unknown key type or algorithm.");
  }
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64URLDecode(signature),
    asciiToUint8Array(`${header}.${payload}`)
  );
  if (!verified) {
    throw new Error("Could not verify JWT.");
  }
  const payloadObj = JSON.parse(
    textDecoder.decode(base64URLDecode(payload))
  );
  if (payloadObj.iss !== "https://accounts.google.com" && payloadObj.iss !== "accounts.google.com") {
    throw new Error("JWT issuer is incorrect.");
  }
  if (payloadObj.aud !== clientId) {
    throw new Error("JWT audience is incorrect.");
  }
  const now = Math.floor(Date.now() / 1e3);
  if (payloadObj.exp && now >= payloadObj.exp) {
    throw new Error("JWT has expired.");
  }
  return payloadObj;
}
__name(validateGoogleToken, "validateGoogleToken");
function auth() {
  return async (c, next) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid Authorization header");
      }
      const token = authHeader.slice(7);
      const payload = await validateGoogleToken(token, c.env.GOOGLE_CLIENT_ID);
      c.set("JWT", { payload });
      await next();
      return;
    } catch (e) {
      if (e instanceof Error)
        console.error(e.message);
    }
    return c.json({ message: "Unauthorized", ok: false }, 401);
  };
}
__name(auth, "auth");

// src/middleware/sentry.ts
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/toucan-js@3.4.0/node_modules/toucan-js/dist/index.esm.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/is.js
init_checked_fetch();
init_modules_watch_stub();
var objectToString = Object.prototype.toString;
function isError(wat) {
  switch (objectToString.call(wat)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
__name(isError, "isError");
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}
__name(isBuiltin, "isBuiltin");
function isString(wat) {
  return isBuiltin(wat, "String");
}
__name(isString, "isString");
function isParameterizedString(wat) {
  return typeof wat === "object" && wat !== null && "__sentry_template_string__" in wat && "__sentry_template_values__" in wat;
}
__name(isParameterizedString, "isParameterizedString");
function isPrimitive(wat) {
  return wat === null || isParameterizedString(wat) || typeof wat !== "object" && typeof wat !== "function";
}
__name(isPrimitive, "isPrimitive");
function isPlainObject(wat) {
  return isBuiltin(wat, "Object");
}
__name(isPlainObject, "isPlainObject");
function isEvent(wat) {
  return typeof Event !== "undefined" && isInstanceOf(wat, Event);
}
__name(isEvent, "isEvent");
function isElement(wat) {
  return typeof Element !== "undefined" && isInstanceOf(wat, Element);
}
__name(isElement, "isElement");
function isThenable(wat) {
  return Boolean(wat && wat.then && typeof wat.then === "function");
}
__name(isThenable, "isThenable");
function isSyntheticEvent(wat) {
  return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
}
__name(isSyntheticEvent, "isSyntheticEvent");
function isNaN2(wat) {
  return typeof wat === "number" && wat !== wat;
}
__name(isNaN2, "isNaN");
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}
__name(isInstanceOf, "isInstanceOf");
function isVueViewModel(wat) {
  return !!(typeof wat === "object" && wat !== null && (wat.__isVue || wat._isVue));
}
__name(isVueViewModel, "isVueViewModel");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/string.js
init_checked_fetch();
init_modules_watch_stub();
function truncate(str, max = 0) {
  if (typeof str !== "string" || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.slice(0, max)}...`;
}
__name(truncate, "truncate");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/browser.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/worldwide.js
init_checked_fetch();
init_modules_watch_stub();
function isGlobalObj(obj) {
  return obj && obj.Math == Math ? obj : void 0;
}
__name(isGlobalObj, "isGlobalObj");
var GLOBAL_OBJ = typeof globalThis == "object" && isGlobalObj(globalThis) || // eslint-disable-next-line no-restricted-globals
typeof window == "object" && isGlobalObj(window) || typeof self == "object" && isGlobalObj(self) || typeof global == "object" && isGlobalObj(global) || function() {
  return this;
}() || {};
function getGlobalObject() {
  return GLOBAL_OBJ;
}
__name(getGlobalObject, "getGlobalObject");
function getGlobalSingleton(name, creator, obj) {
  const gbl = obj || GLOBAL_OBJ;
  const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
  const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}
__name(getGlobalSingleton, "getGlobalSingleton");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/browser.js
var WINDOW = getGlobalObject();
var DEFAULT_MAX_STRING_LENGTH = 80;
function htmlTreeAsString(elem, options = {}) {
  if (!elem) {
    return "<unknown>";
  }
  try {
    let currentElem = elem;
    const MAX_TRAVERSE_HEIGHT = 5;
    const out = [];
    let height = 0;
    let len = 0;
    const separator = " > ";
    const sepLength = separator.length;
    let nextStr;
    const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
    const maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
    while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      nextStr = _htmlElementAsString(currentElem, keyAttrs);
      if (nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength) {
        break;
      }
      out.push(nextStr);
      len += nextStr.length;
      currentElem = currentElem.parentNode;
    }
    return out.reverse().join(separator);
  } catch (_oO) {
    return "<unknown>";
  }
}
__name(htmlTreeAsString, "htmlTreeAsString");
function _htmlElementAsString(el, keyAttrs) {
  const elem = el;
  const out = [];
  let className;
  let classes;
  let key;
  let attr;
  let i;
  if (!elem || !elem.tagName) {
    return "";
  }
  if (WINDOW.HTMLElement) {
    if (elem instanceof HTMLElement && elem.dataset && elem.dataset["sentryComponent"]) {
      return elem.dataset["sentryComponent"];
    }
  }
  out.push(elem.tagName.toLowerCase());
  const keyAttrPairs = keyAttrs && keyAttrs.length ? keyAttrs.filter((keyAttr) => elem.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, elem.getAttribute(keyAttr)]) : null;
  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach((keyAttrPair) => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
    });
  } else {
    if (elem.id) {
      out.push(`#${elem.id}`);
    }
    className = elem.className;
    if (className && isString(className)) {
      classes = className.split(/\s+/);
      for (i = 0; i < classes.length; i++) {
        out.push(`.${classes[i]}`);
      }
    }
  }
  const allowedAttrs = ["aria-label", "type", "name", "title", "alt"];
  for (i = 0; i < allowedAttrs.length; i++) {
    key = allowedAttrs[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push(`[${key}="${attr}"]`);
    }
  }
  return out.join("");
}
__name(_htmlElementAsString, "_htmlElementAsString");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/dsn.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/debug-build.js
init_checked_fetch();
init_modules_watch_stub();
var DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/logger.js
init_checked_fetch();
init_modules_watch_stub();
var PREFIX = "Sentry Logger ";
var CONSOLE_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
  "log",
  "assert",
  "trace"
];
var originalConsoleMethods = {};
function consoleSandbox(callback) {
  if (!("console" in GLOBAL_OBJ)) {
    return callback();
  }
  const console2 = GLOBAL_OBJ.console;
  const wrappedFuncs = {};
  const wrappedLevels = Object.keys(originalConsoleMethods);
  wrappedLevels.forEach((level) => {
    const originalConsoleMethod = originalConsoleMethods[level];
    wrappedFuncs[level] = console2[level];
    console2[level] = originalConsoleMethod;
  });
  try {
    return callback();
  } finally {
    wrappedLevels.forEach((level) => {
      console2[level] = wrappedFuncs[level];
    });
  }
}
__name(consoleSandbox, "consoleSandbox");
function makeLogger() {
  let enabled = false;
  const logger3 = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
    isEnabled: () => enabled
  };
  if (DEBUG_BUILD) {
    CONSOLE_LEVELS.forEach((name) => {
      logger3[name] = (...args) => {
        if (enabled) {
          consoleSandbox(() => {
            GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach((name) => {
      logger3[name] = () => void 0;
    });
  }
  return logger3;
}
__name(makeLogger, "makeLogger");
var logger2 = makeLogger();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/dsn.js
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
  return protocol === "http" || protocol === "https";
}
__name(isValidProtocol, "isValidProtocol");
function dsnToString(dsn, withPassword = false) {
  const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
  return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
}
__name(dsnToString, "dsnToString");
function dsnFromString(str) {
  const match = DSN_REGEX.exec(str);
  if (!match) {
    consoleSandbox(() => {
      console.error(`Invalid Sentry Dsn: ${str}`);
    });
    return void 0;
  }
  const [protocol, publicKey, pass = "", host, port = "", lastPath] = match.slice(1);
  let path = "";
  let projectId = lastPath;
  const split = projectId.split("/");
  if (split.length > 1) {
    path = split.slice(0, -1).join("/");
    projectId = split.pop();
  }
  if (projectId) {
    const projectMatch = projectId.match(/^\d+/);
    if (projectMatch) {
      projectId = projectMatch[0];
    }
  }
  return dsnFromComponents({ host, pass, path, projectId, port, protocol, publicKey });
}
__name(dsnFromString, "dsnFromString");
function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || "",
    pass: components.pass || "",
    host: components.host,
    port: components.port || "",
    path: components.path || "",
    projectId: components.projectId
  };
}
__name(dsnFromComponents, "dsnFromComponents");
function validateDsn(dsn) {
  if (!DEBUG_BUILD) {
    return true;
  }
  const { port, projectId, protocol } = dsn;
  const requiredComponents = ["protocol", "publicKey", "host", "projectId"];
  const hasMissingRequiredComponent = requiredComponents.find((component) => {
    if (!dsn[component]) {
      logger2.error(`Invalid Sentry Dsn: ${component} missing`);
      return true;
    }
    return false;
  });
  if (hasMissingRequiredComponent) {
    return false;
  }
  if (!projectId.match(/^\d+$/)) {
    logger2.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
    return false;
  }
  if (!isValidProtocol(protocol)) {
    logger2.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
    return false;
  }
  if (port && isNaN(parseInt(port, 10))) {
    logger2.error(`Invalid Sentry Dsn: Invalid port ${port}`);
    return false;
  }
  return true;
}
__name(validateDsn, "validateDsn");
function makeDsn(from) {
  const components = typeof from === "string" ? dsnFromString(from) : dsnFromComponents(from);
  if (!components || !validateDsn(components)) {
    return void 0;
  }
  return components;
}
__name(makeDsn, "makeDsn");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/error.js
init_checked_fetch();
init_modules_watch_stub();
var SentryError = class extends Error {
  /** Display name of this error instance. */
  constructor(message, logLevel = "warn") {
    super(message);
    this.message = message;
    this.name = new.target.prototype.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.logLevel = logLevel;
  }
};
__name(SentryError, "SentryError");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/object.js
init_checked_fetch();
init_modules_watch_stub();
function addNonEnumerableProperty(obj, name, value) {
  try {
    Object.defineProperty(obj, name, {
      // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
      value,
      writable: true,
      configurable: true
    });
  } catch (o_O) {
    DEBUG_BUILD && logger2.log(`Failed to add non-enumerable property "${name}" to object`, obj);
  }
}
__name(addNonEnumerableProperty, "addNonEnumerableProperty");
function urlEncode(object) {
  return Object.keys(object).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join("&");
}
__name(urlEncode, "urlEncode");
function convertToPlainObject(value) {
  if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value)
    };
  } else if (isEvent(value)) {
    const newObj = {
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget),
      ...getOwnProperties(value)
    };
    if (typeof CustomEvent !== "undefined" && isInstanceOf(value, CustomEvent)) {
      newObj.detail = value.detail;
    }
    return newObj;
  } else {
    return value;
  }
}
__name(convertToPlainObject, "convertToPlainObject");
function serializeEventTarget(target) {
  try {
    return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
  } catch (_oO) {
    return "<unknown>";
  }
}
__name(serializeEventTarget, "serializeEventTarget");
function getOwnProperties(obj) {
  if (typeof obj === "object" && obj !== null) {
    const extractedProps = {};
    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        extractedProps[property] = obj[property];
      }
    }
    return extractedProps;
  } else {
    return {};
  }
}
__name(getOwnProperties, "getOwnProperties");
function extractExceptionKeysForMessage(exception, maxLength = 40) {
  const keys = Object.keys(convertToPlainObject(exception));
  keys.sort();
  if (!keys.length) {
    return "[object has no keys]";
  }
  if (keys[0].length >= maxLength) {
    return truncate(keys[0], maxLength);
  }
  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    const serialized = keys.slice(0, includedKeys).join(", ");
    if (serialized.length > maxLength) {
      continue;
    }
    if (includedKeys === keys.length) {
      return serialized;
    }
    return truncate(serialized, maxLength);
  }
  return "";
}
__name(extractExceptionKeysForMessage, "extractExceptionKeysForMessage");
function dropUndefinedKeys(inputValue) {
  const memoizationMap = /* @__PURE__ */ new Map();
  return _dropUndefinedKeys(inputValue, memoizationMap);
}
__name(dropUndefinedKeys, "dropUndefinedKeys");
function _dropUndefinedKeys(inputValue, memoizationMap) {
  if (isPojo(inputValue)) {
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== void 0) {
      return memoVal;
    }
    const returnValue = {};
    memoizationMap.set(inputValue, returnValue);
    for (const key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== "undefined") {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }
    return returnValue;
  }
  if (Array.isArray(inputValue)) {
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== void 0) {
      return memoVal;
    }
    const returnValue = [];
    memoizationMap.set(inputValue, returnValue);
    inputValue.forEach((item) => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });
    return returnValue;
  }
  return inputValue;
}
__name(_dropUndefinedKeys, "_dropUndefinedKeys");
function isPojo(input) {
  if (!isPlainObject(input)) {
    return false;
  }
  try {
    const name = Object.getPrototypeOf(input).constructor.name;
    return !name || name === "Object";
  } catch (e) {
    return true;
  }
}
__name(isPojo, "isPojo");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/instrument/_handlers.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/stacktrace.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/node-stack-trace.js
init_checked_fetch();
init_modules_watch_stub();
function filenameIsInApp(filename, isNative = false) {
  const isInternal = isNative || filename && // It's not internal if it's an absolute linux path
  !filename.startsWith("/") && // It's not internal if it's an absolute windows path
  !filename.match(/^[A-Z]:/) && // It's not internal if the path is starting with a dot
  !filename.startsWith(".") && // It's not internal if the frame has a protocol. In node, this is usually the case if the file got pre-processed with a bundler like webpack
  !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//);
  return !isInternal && filename !== void 0 && !filename.includes("node_modules/");
}
__name(filenameIsInApp, "filenameIsInApp");
function node(getModule2) {
  const FILENAME_MATCH = /^\s*[-]{4,}$/;
  const FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
  return (line) => {
    const lineMatch = line.match(FULL_MATCH);
    if (lineMatch) {
      let object;
      let method;
      let functionName;
      let typeName;
      let methodName;
      if (lineMatch[1]) {
        functionName = lineMatch[1];
        let methodStart = functionName.lastIndexOf(".");
        if (functionName[methodStart - 1] === ".") {
          methodStart--;
        }
        if (methodStart > 0) {
          object = functionName.slice(0, methodStart);
          method = functionName.slice(methodStart + 1);
          const objectEnd = object.indexOf(".Module");
          if (objectEnd > 0) {
            functionName = functionName.slice(objectEnd + 1);
            object = object.slice(0, objectEnd);
          }
        }
        typeName = void 0;
      }
      if (method) {
        typeName = object;
        methodName = method;
      }
      if (method === "<anonymous>") {
        methodName = void 0;
        functionName = void 0;
      }
      if (functionName === void 0) {
        methodName = methodName || "<anonymous>";
        functionName = typeName ? `${typeName}.${methodName}` : methodName;
      }
      let filename = lineMatch[2] && lineMatch[2].startsWith("file://") ? lineMatch[2].slice(7) : lineMatch[2];
      const isNative = lineMatch[5] === "native";
      if (filename && filename.match(/\/[A-Z]:/)) {
        filename = filename.slice(1);
      }
      if (!filename && lineMatch[5] && !isNative) {
        filename = lineMatch[5];
      }
      return {
        filename,
        module: getModule2 ? getModule2(filename) : void 0,
        function: functionName,
        lineno: parseInt(lineMatch[3], 10) || void 0,
        colno: parseInt(lineMatch[4], 10) || void 0,
        in_app: filenameIsInApp(filename, isNative)
      };
    }
    if (line.match(FILENAME_MATCH)) {
      return {
        filename: line
      };
    }
    return void 0;
  };
}
__name(node, "node");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/stacktrace.js
var STACKTRACE_FRAME_LIMIT = 50;
var WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
var STRIP_FRAME_REGEXP = /captureMessage|captureException/;
function createStackParser(...parsers) {
  const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return (stack, skipFirst = 0) => {
    const frames = [];
    const lines = stack.split("\n");
    for (let i = skipFirst; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 1024) {
        continue;
      }
      const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
      if (cleanedLine.match(/\S*Error: /)) {
        continue;
      }
      for (const parser of sortedParsers) {
        const frame = parser(cleanedLine);
        if (frame) {
          frames.push(frame);
          break;
        }
      }
      if (frames.length >= STACKTRACE_FRAME_LIMIT) {
        break;
      }
    }
    return stripSentryFramesAndReverse(frames);
  };
}
__name(createStackParser, "createStackParser");
function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }
  return stackParser;
}
__name(stackParserFromStackParserOptions, "stackParserFromStackParserOptions");
function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }
  const localStack = Array.from(stack);
  if (/sentryWrapped/.test(localStack[localStack.length - 1].function || "")) {
    localStack.pop();
  }
  localStack.reverse();
  if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
    localStack.pop();
    if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
      localStack.pop();
    }
  }
  return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame) => ({
    ...frame,
    filename: frame.filename || localStack[localStack.length - 1].filename,
    function: frame.function || "?"
  }));
}
__name(stripSentryFramesAndReverse, "stripSentryFramesAndReverse");
var defaultFunctionName = "<anonymous>";
function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== "function") {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch (e) {
    return defaultFunctionName;
  }
}
__name(getFunctionName, "getFunctionName");
function nodeStackLineParser(getModule2) {
  return [90, node(getModule2)];
}
__name(nodeStackLineParser, "nodeStackLineParser");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/instrument/_handlers.js
var handlers = {};
var instrumented = {};
function addHandler(type, handler2) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(handler2);
}
__name(addHandler, "addHandler");
function maybeInstrument(type, instrumentFn) {
  if (!instrumented[type]) {
    instrumentFn();
    instrumented[type] = true;
  }
}
__name(maybeInstrument, "maybeInstrument");
function triggerHandlers(type, data) {
  const typeHandlers = type && handlers[type];
  if (!typeHandlers) {
    return;
  }
  for (const handler2 of typeHandlers) {
    try {
      handler2(data);
    } catch (e) {
      DEBUG_BUILD && logger2.error(
        `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler2)}
Error:`,
        e
      );
    }
  }
}
__name(triggerHandlers, "triggerHandlers");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/misc.js
init_checked_fetch();
init_modules_watch_stub();
function uuid4() {
  const gbl = GLOBAL_OBJ;
  const crypto2 = gbl.crypto || gbl.msCrypto;
  let getRandomByte = /* @__PURE__ */ __name(() => Math.random() * 16, "getRandomByte");
  try {
    if (crypto2 && crypto2.randomUUID) {
      return crypto2.randomUUID().replace(/-/g, "");
    }
    if (crypto2 && crypto2.getRandomValues) {
      getRandomByte = /* @__PURE__ */ __name(() => {
        const typedArray = new Uint8Array(1);
        crypto2.getRandomValues(typedArray);
        return typedArray[0];
      }, "getRandomByte");
    }
  } catch (_) {
  }
  return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(
    /[018]/g,
    (c) => (
      // eslint-disable-next-line no-bitwise
      (c ^ (getRandomByte() & 15) >> c / 4).toString(16)
    )
  );
}
__name(uuid4, "uuid4");
function getFirstException(event) {
  return event.exception && event.exception.values ? event.exception.values[0] : void 0;
}
__name(getFirstException, "getFirstException");
function addExceptionTypeValue(event, value, type) {
  const exception = event.exception = event.exception || {};
  const values = exception.values = exception.values || [];
  const firstException = values[0] = values[0] || {};
  if (!firstException.value) {
    firstException.value = value || "";
  }
  if (!firstException.type) {
    firstException.type = type || "Error";
  }
}
__name(addExceptionTypeValue, "addExceptionTypeValue");
function addExceptionMechanism(event, newMechanism) {
  const firstException = getFirstException(event);
  if (!firstException) {
    return;
  }
  const defaultMechanism = { type: "generic", handled: true };
  const currentMechanism = firstException.mechanism;
  firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };
  if (newMechanism && "data" in newMechanism) {
    const mergedData = { ...currentMechanism && currentMechanism.data, ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}
__name(addExceptionMechanism, "addExceptionMechanism");
function checkOrSetAlreadyCaught(exception) {
  if (exception && exception.__sentry_captured__) {
    return true;
  }
  try {
    addNonEnumerableProperty(exception, "__sentry_captured__", true);
  } catch (err) {
  }
  return false;
}
__name(checkOrSetAlreadyCaught, "checkOrSetAlreadyCaught");
function arrayify(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}
__name(arrayify, "arrayify");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/instrument/globalError.js
init_checked_fetch();
init_modules_watch_stub();
var _oldOnErrorHandler = null;
function addGlobalErrorInstrumentationHandler(handler2) {
  const type = "error";
  addHandler(type, handler2);
  maybeInstrument(type, instrumentError);
}
__name(addGlobalErrorInstrumentationHandler, "addGlobalErrorInstrumentationHandler");
function instrumentError() {
  _oldOnErrorHandler = GLOBAL_OBJ.onerror;
  GLOBAL_OBJ.onerror = function(msg, url, line, column, error) {
    const handlerData = {
      column,
      error,
      line,
      msg,
      url
    };
    triggerHandlers("error", handlerData);
    if (_oldOnErrorHandler && !_oldOnErrorHandler.__SENTRY_LOADER__) {
      return _oldOnErrorHandler.apply(this, arguments);
    }
    return false;
  };
  GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = true;
}
__name(instrumentError, "instrumentError");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/instrument/globalUnhandledRejection.js
init_checked_fetch();
init_modules_watch_stub();
var _oldOnUnhandledRejectionHandler = null;
function addGlobalUnhandledRejectionInstrumentationHandler(handler2) {
  const type = "unhandledrejection";
  addHandler(type, handler2);
  maybeInstrument(type, instrumentUnhandledRejection);
}
__name(addGlobalUnhandledRejectionInstrumentationHandler, "addGlobalUnhandledRejectionInstrumentationHandler");
function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = GLOBAL_OBJ.onunhandledrejection;
  GLOBAL_OBJ.onunhandledrejection = function(e) {
    const handlerData = e;
    triggerHandlers("unhandledrejection", handlerData);
    if (_oldOnUnhandledRejectionHandler && !_oldOnUnhandledRejectionHandler.__SENTRY_LOADER__) {
      return _oldOnUnhandledRejectionHandler.apply(this, arguments);
    }
    return true;
  };
  GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}
__name(instrumentUnhandledRejection, "instrumentUnhandledRejection");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/memo.js
init_checked_fetch();
init_modules_watch_stub();
function memoBuilder() {
  const hasWeakSet = typeof WeakSet === "function";
  const inner = hasWeakSet ? /* @__PURE__ */ new WeakSet() : [];
  function memoize(obj) {
    if (hasWeakSet) {
      if (inner.has(obj)) {
        return true;
      }
      inner.add(obj);
      return false;
    }
    for (let i = 0; i < inner.length; i++) {
      const value = inner[i];
      if (value === obj) {
        return true;
      }
    }
    inner.push(obj);
    return false;
  }
  __name(memoize, "memoize");
  function unmemoize(obj) {
    if (hasWeakSet) {
      inner.delete(obj);
    } else {
      for (let i = 0; i < inner.length; i++) {
        if (inner[i] === obj) {
          inner.splice(i, 1);
          break;
        }
      }
    }
  }
  __name(unmemoize, "unmemoize");
  return [memoize, unmemoize];
}
__name(memoBuilder, "memoBuilder");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/normalize.js
init_checked_fetch();
init_modules_watch_stub();
function normalize(input, depth = 100, maxProperties = Infinity) {
  try {
    return visit("", input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}
__name(normalize, "normalize");
function normalizeToSize(object, depth = 3, maxSize = 100 * 1024) {
  const normalized = normalize(object, depth);
  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }
  return normalized;
}
__name(normalizeToSize, "normalizeToSize");
function visit(key, value, depth = Infinity, maxProperties = Infinity, memo = memoBuilder()) {
  const [memoize, unmemoize] = memo;
  if (value == null || // this matches null and undefined -> eqeq not eqeqeq
  ["number", "boolean", "string"].includes(typeof value) && !isNaN2(value)) {
    return value;
  }
  const stringified = stringifyValue(key, value);
  if (!stringified.startsWith("[object ")) {
    return stringified;
  }
  if (value["__sentry_skip_normalization__"]) {
    return value;
  }
  const remainingDepth = typeof value["__sentry_override_normalization_depth__"] === "number" ? value["__sentry_override_normalization_depth__"] : depth;
  if (remainingDepth === 0) {
    return stringified.replace("object ", "");
  }
  if (memoize(value)) {
    return "[Circular ~]";
  }
  const valueWithToJSON = value;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
    try {
      const jsonValue = valueWithToJSON.toJSON();
      return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
    } catch (err) {
    }
  }
  const normalized = Array.isArray(value) ? [] : {};
  let numAdded = 0;
  const visitable = convertToPlainObject(value);
  for (const visitKey in visitable) {
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }
    if (numAdded >= maxProperties) {
      normalized[visitKey] = "[MaxProperties ~]";
      break;
    }
    const visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
    numAdded++;
  }
  unmemoize(value);
  return normalized;
}
__name(visit, "visit");
function stringifyValue(key, value) {
  try {
    if (key === "domain" && value && typeof value === "object" && value._events) {
      return "[Domain]";
    }
    if (key === "domainEmitter") {
      return "[DomainEmitter]";
    }
    if (typeof global !== "undefined" && value === global) {
      return "[Global]";
    }
    if (typeof window !== "undefined" && value === window) {
      return "[Window]";
    }
    if (typeof document !== "undefined" && value === document) {
      return "[Document]";
    }
    if (isVueViewModel(value)) {
      return "[VueViewModel]";
    }
    if (isSyntheticEvent(value)) {
      return "[SyntheticEvent]";
    }
    if (typeof value === "number" && value !== value) {
      return "[NaN]";
    }
    if (typeof value === "function") {
      return `[Function: ${getFunctionName(value)}]`;
    }
    if (typeof value === "symbol") {
      return `[${String(value)}]`;
    }
    if (typeof value === "bigint") {
      return `[BigInt: ${String(value)}]`;
    }
    const objName = getConstructorName(value);
    if (/^HTML(\w*)Element$/.test(objName)) {
      return `[HTMLElement: ${objName}]`;
    }
    return `[object ${objName}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}
__name(stringifyValue, "stringifyValue");
function getConstructorName(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype ? prototype.constructor.name : "null prototype";
}
__name(getConstructorName, "getConstructorName");
function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}
__name(utf8Length, "utf8Length");
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}
__name(jsonSize, "jsonSize");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/path.js
init_checked_fetch();
init_modules_watch_stub();
var splitPathRe = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function splitPath2(filename) {
  const truncated = filename.length > 1024 ? `<truncated>${filename.slice(-1024)}` : filename;
  const parts = splitPathRe.exec(truncated);
  return parts ? parts.slice(1) : [];
}
__name(splitPath2, "splitPath");
function basename(path, ext) {
  let f = splitPath2(path)[2];
  if (ext && f.slice(ext.length * -1) === ext) {
    f = f.slice(0, f.length - ext.length);
  }
  return f;
}
__name(basename, "basename");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/promisebuffer.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/syncpromise.js
init_checked_fetch();
init_modules_watch_stub();
var States;
(function(States2) {
  const PENDING = 0;
  States2[States2["PENDING"] = PENDING] = "PENDING";
  const RESOLVED = 1;
  States2[States2["RESOLVED"] = RESOLVED] = "RESOLVED";
  const REJECTED = 2;
  States2[States2["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));
function resolvedSyncPromise(value) {
  return new SyncPromise((resolve2) => {
    resolve2(value);
  });
}
__name(resolvedSyncPromise, "resolvedSyncPromise");
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}
__name(rejectedSyncPromise, "rejectedSyncPromise");
var SyncPromise = class {
  constructor(executor) {
    SyncPromise.prototype.__init.call(this);
    SyncPromise.prototype.__init2.call(this);
    SyncPromise.prototype.__init3.call(this);
    SyncPromise.prototype.__init4.call(this);
    this._state = States.PENDING;
    this._handlers = [];
    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }
  /** JSDoc */
  then(onfulfilled, onrejected) {
    return new SyncPromise((resolve2, reject) => {
      this._handlers.push([
        false,
        (result) => {
          if (!onfulfilled) {
            resolve2(result);
          } else {
            try {
              resolve2(onfulfilled(result));
            } catch (e) {
              reject(e);
            }
          }
        },
        (reason) => {
          if (!onrejected) {
            reject(reason);
          } else {
            try {
              resolve2(onrejected(reason));
            } catch (e) {
              reject(e);
            }
          }
        }
      ]);
      this._executeHandlers();
    });
  }
  /** JSDoc */
  catch(onrejected) {
    return this.then((val) => val, onrejected);
  }
  /** JSDoc */
  finally(onfinally) {
    return new SyncPromise((resolve2, reject) => {
      let val;
      let isRejected;
      return this.then(
        (value) => {
          isRejected = false;
          val = value;
          if (onfinally) {
            onfinally();
          }
        },
        (reason) => {
          isRejected = true;
          val = reason;
          if (onfinally) {
            onfinally();
          }
        }
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }
        resolve2(val);
      });
    });
  }
  /** JSDoc */
  __init() {
    this._resolve = (value) => {
      this._setResult(States.RESOLVED, value);
    };
  }
  /** JSDoc */
  __init2() {
    this._reject = (reason) => {
      this._setResult(States.REJECTED, reason);
    };
  }
  /** JSDoc */
  __init3() {
    this._setResult = (state, value) => {
      if (this._state !== States.PENDING) {
        return;
      }
      if (isThenable(value)) {
        void value.then(this._resolve, this._reject);
        return;
      }
      this._state = state;
      this._value = value;
      this._executeHandlers();
    };
  }
  /** JSDoc */
  __init4() {
    this._executeHandlers = () => {
      if (this._state === States.PENDING) {
        return;
      }
      const cachedHandlers = this._handlers.slice();
      this._handlers = [];
      cachedHandlers.forEach((handler2) => {
        if (handler2[0]) {
          return;
        }
        if (this._state === States.RESOLVED) {
          handler2[1](this._value);
        }
        if (this._state === States.REJECTED) {
          handler2[2](this._value);
        }
        handler2[0] = true;
      });
    };
  }
};
__name(SyncPromise, "SyncPromise");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/promisebuffer.js
function makePromiseBuffer(limit) {
  const buffer = [];
  function isReady() {
    return limit === void 0 || buffer.length < limit;
  }
  __name(isReady, "isReady");
  function remove(task) {
    return buffer.splice(buffer.indexOf(task), 1)[0];
  }
  __name(remove, "remove");
  function add(taskProducer) {
    if (!isReady()) {
      return rejectedSyncPromise(new SentryError("Not adding Promise because buffer limit was reached."));
    }
    const task = taskProducer();
    if (buffer.indexOf(task) === -1) {
      buffer.push(task);
    }
    void task.then(() => remove(task)).then(
      null,
      () => remove(task).then(null, () => {
      })
    );
    return task;
  }
  __name(add, "add");
  function drain(timeout) {
    return new SyncPromise((resolve2, reject) => {
      let counter = buffer.length;
      if (!counter) {
        return resolve2(true);
      }
      const capturedSetTimeout = setTimeout(() => {
        if (timeout && timeout > 0) {
          resolve2(false);
        }
      }, timeout);
      buffer.forEach((item) => {
        void resolvedSyncPromise(item).then(() => {
          if (!--counter) {
            clearTimeout(capturedSetTimeout);
            resolve2(true);
          }
        }, reject);
      });
    });
  }
  __name(drain, "drain");
  return {
    $: buffer,
    add,
    drain
  };
}
__name(makePromiseBuffer, "makePromiseBuffer");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/time.js
init_checked_fetch();
init_modules_watch_stub();
var ONE_SECOND_IN_MS = 1e3;
function dateTimestampInSeconds() {
  return Date.now() / ONE_SECOND_IN_MS;
}
__name(dateTimestampInSeconds, "dateTimestampInSeconds");
function createUnixTimestampInSecondsFunc() {
  const { performance } = GLOBAL_OBJ;
  if (!performance || !performance.now) {
    return dateTimestampInSeconds;
  }
  const approxStartingTimeOrigin = Date.now() - performance.now();
  const timeOrigin = performance.timeOrigin == void 0 ? approxStartingTimeOrigin : performance.timeOrigin;
  return () => {
    return (timeOrigin + performance.now()) / ONE_SECOND_IN_MS;
  };
}
__name(createUnixTimestampInSecondsFunc, "createUnixTimestampInSecondsFunc");
var timestampInSeconds = createUnixTimestampInSecondsFunc();
var _browserPerformanceTimeOriginMode;
var browserPerformanceTimeOrigin = (() => {
  const { performance } = GLOBAL_OBJ;
  if (!performance || !performance.now) {
    _browserPerformanceTimeOriginMode = "none";
    return void 0;
  }
  const threshold = 3600 * 1e3;
  const performanceNow = performance.now();
  const dateNow = Date.now();
  const timeOriginDelta = performance.timeOrigin ? Math.abs(performance.timeOrigin + performanceNow - dateNow) : threshold;
  const timeOriginIsReliable = timeOriginDelta < threshold;
  const navigationStart = performance.timing && performance.timing.navigationStart;
  const hasNavigationStart = typeof navigationStart === "number";
  const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  const navigationStartIsReliable = navigationStartDelta < threshold;
  if (timeOriginIsReliable || navigationStartIsReliable) {
    if (timeOriginDelta <= navigationStartDelta) {
      _browserPerformanceTimeOriginMode = "timeOrigin";
      return performance.timeOrigin;
    } else {
      _browserPerformanceTimeOriginMode = "navigationStart";
      return navigationStart;
    }
  }
  _browserPerformanceTimeOriginMode = "dateNow";
  return dateNow;
})();

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/tracing.js
init_checked_fetch();
init_modules_watch_stub();
var TRACEPARENT_REGEXP = new RegExp(
  "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$"
  // whitespace
);
function generateSentryTraceHeader(traceId = uuid4(), spanId = uuid4().substring(16), sampled) {
  let sampledString = "";
  if (sampled !== void 0) {
    sampledString = sampled ? "-1" : "-0";
  }
  return `${traceId}-${spanId}${sampledString}`;
}
__name(generateSentryTraceHeader, "generateSentryTraceHeader");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/envelope.js
init_checked_fetch();
init_modules_watch_stub();
function createEnvelope(headers, items = []) {
  return [headers, items];
}
__name(createEnvelope, "createEnvelope");
function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]];
}
__name(addItemToEnvelope, "addItemToEnvelope");
function forEachEnvelopeItem(envelope, callback) {
  const envelopeItems = envelope[1];
  for (const envelopeItem of envelopeItems) {
    const envelopeItemType = envelopeItem[0].type;
    const result = callback(envelopeItem, envelopeItemType);
    if (result) {
      return true;
    }
  }
  return false;
}
__name(forEachEnvelopeItem, "forEachEnvelopeItem");
function encodeUTF8(input, textEncoder) {
  const utf8 = textEncoder || new TextEncoder();
  return utf8.encode(input);
}
__name(encodeUTF8, "encodeUTF8");
function serializeEnvelope(envelope, textEncoder) {
  const [envHeaders, items] = envelope;
  let parts = JSON.stringify(envHeaders);
  function append(next) {
    if (typeof parts === "string") {
      parts = typeof next === "string" ? parts + next : [encodeUTF8(parts, textEncoder), next];
    } else {
      parts.push(typeof next === "string" ? encodeUTF8(next, textEncoder) : next);
    }
  }
  __name(append, "append");
  for (const item of items) {
    const [itemHeaders, payload] = item;
    append(`
${JSON.stringify(itemHeaders)}
`);
    if (typeof payload === "string" || payload instanceof Uint8Array) {
      append(payload);
    } else {
      let stringifiedPayload;
      try {
        stringifiedPayload = JSON.stringify(payload);
      } catch (e) {
        stringifiedPayload = JSON.stringify(normalize(payload));
      }
      append(stringifiedPayload);
    }
  }
  return typeof parts === "string" ? parts : concatBuffers(parts);
}
__name(serializeEnvelope, "serializeEnvelope");
function concatBuffers(buffers) {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    merged.set(buffer, offset);
    offset += buffer.length;
  }
  return merged;
}
__name(concatBuffers, "concatBuffers");
function createAttachmentEnvelopeItem(attachment, textEncoder) {
  const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
  return [
    dropUndefinedKeys({
      type: "attachment",
      length: buffer.length,
      filename: attachment.filename,
      content_type: attachment.contentType,
      attachment_type: attachment.attachmentType
    }),
    buffer
  ];
}
__name(createAttachmentEnvelopeItem, "createAttachmentEnvelopeItem");
var ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  feedback: "feedback",
  span: "span",
  statsd: "metric_bucket"
};
function envelopeItemTypeToDataCategory(type) {
  return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
__name(envelopeItemTypeToDataCategory, "envelopeItemTypeToDataCategory");
function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
  if (!metadataOrEvent || !metadataOrEvent.sdk) {
    return;
  }
  const { name, version } = metadataOrEvent.sdk;
  return { name, version };
}
__name(getSdkMetadataForEnvelopeHeader, "getSdkMetadataForEnvelopeHeader");
function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
  const dynamicSamplingContext = event.sdkProcessingMetadata && event.sdkProcessingMetadata.dynamicSamplingContext;
  return {
    event_id: event.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) },
    ...dynamicSamplingContext && {
      trace: dropUndefinedKeys({ ...dynamicSamplingContext })
    }
  };
}
__name(createEventEnvelopeHeaders, "createEventEnvelopeHeaders");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/ratelimit.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_RETRY_AFTER = 60 * 1e3;
function parseRetryAfterHeader(header, now = Date.now()) {
  const headerDelay = parseInt(`${header}`, 10);
  if (!isNaN(headerDelay)) {
    return headerDelay * 1e3;
  }
  const headerDate = Date.parse(`${header}`);
  if (!isNaN(headerDate)) {
    return headerDate - now;
  }
  return DEFAULT_RETRY_AFTER;
}
__name(parseRetryAfterHeader, "parseRetryAfterHeader");
function disabledUntil(limits, dataCategory) {
  return limits[dataCategory] || limits.all || 0;
}
__name(disabledUntil, "disabledUntil");
function isRateLimited(limits, dataCategory, now = Date.now()) {
  return disabledUntil(limits, dataCategory) > now;
}
__name(isRateLimited, "isRateLimited");
function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
  const updatedRateLimits = {
    ...limits
  };
  const rateLimitHeader = headers && headers["x-sentry-rate-limits"];
  const retryAfterHeader = headers && headers["retry-after"];
  if (rateLimitHeader) {
    for (const limit of rateLimitHeader.trim().split(",")) {
      const [retryAfter, categories, , , namespaces] = limit.split(":", 5);
      const headerDelay = parseInt(retryAfter, 10);
      const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1e3;
      if (!categories) {
        updatedRateLimits.all = now + delay;
      } else {
        for (const category of categories.split(";")) {
          if (category === "metric_bucket") {
            if (!namespaces || namespaces.split(";").includes("custom")) {
              updatedRateLimits[category] = now + delay;
            }
          } else {
            updatedRateLimits[category] = now + delay;
          }
        }
      }
    }
  } else if (retryAfterHeader) {
    updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
  } else if (statusCode === 429) {
    updatedRateLimits.all = now + 60 * 1e3;
  }
  return updatedRateLimits;
}
__name(updateRateLimits, "updateRateLimits");

// ../node_modules/.pnpm/@sentry+utils@7.112.2/node_modules/@sentry/utils/esm/eventbuilder.js
init_checked_fetch();
init_modules_watch_stub();
function parseStackFrames(stackParser, error) {
  return stackParser(error.stack || "", 1);
}
__name(parseStackFrames, "parseStackFrames");
function exceptionFromError(stackParser, error) {
  const exception = {
    type: error.name || error.constructor.name,
    value: error.message
  };
  const frames = parseStackFrames(stackParser, error);
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  return exception;
}
__name(exceptionFromError, "exceptionFromError");
function getMessageForObject(exception) {
  if ("name" in exception && typeof exception.name === "string") {
    let message = `'${exception.name}' captured as exception`;
    if ("message" in exception && typeof exception.message === "string") {
      message += ` with message '${exception.message}'`;
    }
    return message;
  } else if ("message" in exception && typeof exception.message === "string") {
    return exception.message;
  } else {
    return `Object captured as exception with keys: ${extractExceptionKeysForMessage(
      exception
    )}`;
  }
}
__name(getMessageForObject, "getMessageForObject");
function eventFromUnknownInput(getHubOrClient, stackParser, exception, hint) {
  const client = typeof getHubOrClient === "function" ? (
    // eslint-disable-next-line deprecation/deprecation
    getHubOrClient().getClient()
  ) : getHubOrClient;
  let ex = exception;
  const providedMechanism = hint && hint.data && hint.data.mechanism;
  const mechanism = providedMechanism || {
    handled: true,
    type: "generic"
  };
  let extras;
  if (!isError(exception)) {
    if (isPlainObject(exception)) {
      const normalizeDepth = client && client.getOptions().normalizeDepth;
      extras = { ["__serialized__"]: normalizeToSize(exception, normalizeDepth) };
      const message = getMessageForObject(exception);
      ex = hint && hint.syntheticException || new Error(message);
      ex.message = message;
    } else {
      ex = hint && hint.syntheticException || new Error(exception);
      ex.message = exception;
    }
    mechanism.synthetic = true;
  }
  const event = {
    exception: {
      values: [exceptionFromError(stackParser, ex)]
    }
  };
  if (extras) {
    event.extra = extras;
  }
  addExceptionTypeValue(event, void 0, void 0);
  addExceptionMechanism(event, mechanism);
  return {
    ...event,
    event_id: hint && hint.event_id
  };
}
__name(eventFromUnknownInput, "eventFromUnknownInput");
function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
  const event = {
    event_id: hint && hint.event_id,
    level
  };
  if (attachStacktrace && hint && hint.syntheticException) {
    const frames = parseStackFrames(stackParser, hint.syntheticException);
    if (frames.length) {
      event.exception = {
        values: [
          {
            value: message,
            stacktrace: { frames }
          }
        ]
      };
    }
  }
  if (isParameterizedString(message)) {
    const { __sentry_template_string__, __sentry_template_values__ } = message;
    event.logentry = {
      message: __sentry_template_string__,
      params: __sentry_template_values__
    };
    return event;
  }
  event.message = message;
  return event;
}
__name(eventFromMessage, "eventFromMessage");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/hubextensions.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/debug-build.js
init_checked_fetch();
init_modules_watch_stub();
var DEBUG_BUILD2 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/hub.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/constants.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_ENVIRONMENT = "production";

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/scope.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/eventProcessors.js
init_checked_fetch();
init_modules_watch_stub();
function getGlobalEventProcessors() {
  return getGlobalSingleton("globalEventProcessors", () => []);
}
__name(getGlobalEventProcessors, "getGlobalEventProcessors");
function addGlobalEventProcessor(callback) {
  getGlobalEventProcessors().push(callback);
}
__name(addGlobalEventProcessor, "addGlobalEventProcessor");
function notifyEventProcessors(processors, event, hint, index = 0) {
  return new SyncPromise((resolve2, reject) => {
    const processor = processors[index];
    if (event === null || typeof processor !== "function") {
      resolve2(event);
    } else {
      const result = processor({ ...event }, hint);
      DEBUG_BUILD2 && processor.id && result === null && logger2.log(`Event processor "${processor.id}" dropped event`);
      if (isThenable(result)) {
        void result.then((final) => notifyEventProcessors(processors, final, hint, index + 1).then(resolve2)).then(null, reject);
      } else {
        void notifyEventProcessors(processors, result, hint, index + 1).then(resolve2).then(null, reject);
      }
    }
  });
}
__name(notifyEventProcessors, "notifyEventProcessors");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/session.js
init_checked_fetch();
init_modules_watch_stub();
function makeSession(context) {
  const startingTime = timestampInSeconds();
  const session = {
    sid: uuid4(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session)
  };
  if (context) {
    updateSession(session, context);
  }
  return session;
}
__name(makeSession, "makeSession");
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }
    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }
  session.timestamp = context.timestamp || timestampInSeconds();
  if (context.abnormal_mechanism) {
    session.abnormal_mechanism = context.abnormal_mechanism;
  }
  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    session.sid = context.sid.length === 32 ? context.sid : uuid4();
  }
  if (context.init !== void 0) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === "number") {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = void 0;
  } else if (typeof context.duration === "number") {
    session.duration = context.duration;
  } else {
    const duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === "number") {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}
__name(updateSession, "updateSession");
function closeSession(session, status) {
  let context = {};
  if (status) {
    context = { status };
  } else if (session.status === "ok") {
    context = { status: "exited" };
  }
  updateSession(session, context);
}
__name(closeSession, "closeSession");
function sessionToJSON(session) {
  return dropUndefinedKeys({
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1e3).toISOString(),
    timestamp: new Date(session.timestamp * 1e3).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === "number" || typeof session.did === "string" ? `${session.did}` : void 0,
    duration: session.duration,
    abnormal_mechanism: session.abnormal_mechanism,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent
    }
  });
}
__name(sessionToJSON, "sessionToJSON");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/applyScopeDataToEvent.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/dynamicSamplingContext.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/exports.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/prepareEvent.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/spanUtils.js
init_checked_fetch();
init_modules_watch_stub();
var TRACE_FLAG_NONE = 0;
var TRACE_FLAG_SAMPLED = 1;
function spanToTraceContext(span) {
  const { spanId: span_id, traceId: trace_id } = span.spanContext();
  const { data, op, parent_span_id, status, tags, origin } = spanToJSON(span);
  return dropUndefinedKeys({
    data,
    op,
    parent_span_id,
    span_id,
    status,
    tags,
    trace_id,
    origin
  });
}
__name(spanToTraceContext, "spanToTraceContext");
function spanToTraceHeader(span) {
  const { traceId, spanId } = span.spanContext();
  const sampled = spanIsSampled(span);
  return generateSentryTraceHeader(traceId, spanId, sampled);
}
__name(spanToTraceHeader, "spanToTraceHeader");
function spanTimeInputToSeconds(input) {
  if (typeof input === "number") {
    return ensureTimestampInSeconds(input);
  }
  if (Array.isArray(input)) {
    return input[0] + input[1] / 1e9;
  }
  if (input instanceof Date) {
    return ensureTimestampInSeconds(input.getTime());
  }
  return timestampInSeconds();
}
__name(spanTimeInputToSeconds, "spanTimeInputToSeconds");
function ensureTimestampInSeconds(timestamp) {
  const isMs = timestamp > 9999999999;
  return isMs ? timestamp / 1e3 : timestamp;
}
__name(ensureTimestampInSeconds, "ensureTimestampInSeconds");
function spanToJSON(span) {
  if (spanIsSpanClass(span)) {
    return span.getSpanJSON();
  }
  if (typeof span.toJSON === "function") {
    return span.toJSON();
  }
  return {};
}
__name(spanToJSON, "spanToJSON");
function spanIsSpanClass(span) {
  return typeof span.getSpanJSON === "function";
}
__name(spanIsSpanClass, "spanIsSpanClass");
function spanIsSampled(span) {
  const { traceFlags } = span.spanContext();
  return Boolean(traceFlags & TRACE_FLAG_SAMPLED);
}
__name(spanIsSampled, "spanIsSampled");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/prepareEvent.js
function prepareEvent(options, event, hint, scope, client, isolationScope) {
  const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options;
  const prepared = {
    ...event,
    event_id: event.event_id || hint.event_id || uuid4(),
    timestamp: event.timestamp || dateTimestampInSeconds()
  };
  const integrations = hint.integrations || options.integrations.map((i) => i.name);
  applyClientOptions(prepared, options);
  applyIntegrationsMetadata(prepared, integrations);
  if (event.type === void 0) {
    applyDebugIds(prepared, options.stackParser);
  }
  const finalScope = getFinalScope(scope, hint.captureContext);
  if (hint.mechanism) {
    addExceptionMechanism(prepared, hint.mechanism);
  }
  const clientEventProcessors = client && client.getEventProcessors ? client.getEventProcessors() : [];
  const data = getGlobalScope().getScopeData();
  if (isolationScope) {
    const isolationData = isolationScope.getScopeData();
    mergeScopeData(data, isolationData);
  }
  if (finalScope) {
    const finalScopeData = finalScope.getScopeData();
    mergeScopeData(data, finalScopeData);
  }
  const attachments = [...hint.attachments || [], ...data.attachments];
  if (attachments.length) {
    hint.attachments = attachments;
  }
  applyScopeDataToEvent(prepared, data);
  const eventProcessors = [
    ...clientEventProcessors,
    // eslint-disable-next-line deprecation/deprecation
    ...getGlobalEventProcessors(),
    // Run scope event processors _after_ all other processors
    ...data.eventProcessors
  ];
  const result = notifyEventProcessors(eventProcessors, prepared, hint);
  return result.then((evt) => {
    if (evt) {
      applyDebugMeta(evt);
    }
    if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
      return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
    }
    return evt;
  });
}
__name(prepareEvent, "prepareEvent");
function applyClientOptions(event, options) {
  const { environment, release, dist, maxValueLength = 250 } = options;
  if (!("environment" in event)) {
    event.environment = "environment" in options ? environment : DEFAULT_ENVIRONMENT;
  }
  if (event.release === void 0 && release !== void 0) {
    event.release = release;
  }
  if (event.dist === void 0 && dist !== void 0) {
    event.dist = dist;
  }
  if (event.message) {
    event.message = truncate(event.message, maxValueLength);
  }
  const exception = event.exception && event.exception.values && event.exception.values[0];
  if (exception && exception.value) {
    exception.value = truncate(exception.value, maxValueLength);
  }
  const request = event.request;
  if (request && request.url) {
    request.url = truncate(request.url, maxValueLength);
  }
}
__name(applyClientOptions, "applyClientOptions");
var debugIdStackParserCache = /* @__PURE__ */ new WeakMap();
function applyDebugIds(event, stackParser) {
  const debugIdMap = GLOBAL_OBJ._sentryDebugIds;
  if (!debugIdMap) {
    return;
  }
  let debugIdStackFramesCache;
  const cachedDebugIdStackFrameCache = debugIdStackParserCache.get(stackParser);
  if (cachedDebugIdStackFrameCache) {
    debugIdStackFramesCache = cachedDebugIdStackFrameCache;
  } else {
    debugIdStackFramesCache = /* @__PURE__ */ new Map();
    debugIdStackParserCache.set(stackParser, debugIdStackFramesCache);
  }
  const filenameDebugIdMap = Object.keys(debugIdMap).reduce((acc, debugIdStackTrace) => {
    let parsedStack;
    const cachedParsedStack = debugIdStackFramesCache.get(debugIdStackTrace);
    if (cachedParsedStack) {
      parsedStack = cachedParsedStack;
    } else {
      parsedStack = stackParser(debugIdStackTrace);
      debugIdStackFramesCache.set(debugIdStackTrace, parsedStack);
    }
    for (let i = parsedStack.length - 1; i >= 0; i--) {
      const stackFrame = parsedStack[i];
      if (stackFrame.filename) {
        acc[stackFrame.filename] = debugIdMap[debugIdStackTrace];
        break;
      }
    }
    return acc;
  }, {});
  try {
    event.exception.values.forEach((exception) => {
      exception.stacktrace.frames.forEach((frame) => {
        if (frame.filename) {
          frame.debug_id = filenameDebugIdMap[frame.filename];
        }
      });
    });
  } catch (e) {
  }
}
__name(applyDebugIds, "applyDebugIds");
function applyDebugMeta(event) {
  const filenameDebugIdMap = {};
  try {
    event.exception.values.forEach((exception) => {
      exception.stacktrace.frames.forEach((frame) => {
        if (frame.debug_id) {
          if (frame.abs_path) {
            filenameDebugIdMap[frame.abs_path] = frame.debug_id;
          } else if (frame.filename) {
            filenameDebugIdMap[frame.filename] = frame.debug_id;
          }
          delete frame.debug_id;
        }
      });
    });
  } catch (e) {
  }
  if (Object.keys(filenameDebugIdMap).length === 0) {
    return;
  }
  event.debug_meta = event.debug_meta || {};
  event.debug_meta.images = event.debug_meta.images || [];
  const images = event.debug_meta.images;
  Object.keys(filenameDebugIdMap).forEach((filename) => {
    images.push({
      type: "sourcemap",
      code_file: filename,
      debug_id: filenameDebugIdMap[filename]
    });
  });
}
__name(applyDebugMeta, "applyDebugMeta");
function applyIntegrationsMetadata(event, integrationNames) {
  if (integrationNames.length > 0) {
    event.sdk = event.sdk || {};
    event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames];
  }
}
__name(applyIntegrationsMetadata, "applyIntegrationsMetadata");
function normalizeEvent(event, depth, maxBreadth) {
  if (!event) {
    return null;
  }
  const normalized = {
    ...event,
    ...event.breadcrumbs && {
      breadcrumbs: event.breadcrumbs.map((b) => ({
        ...b,
        ...b.data && {
          data: normalize(b.data, depth, maxBreadth)
        }
      }))
    },
    ...event.user && {
      user: normalize(event.user, depth, maxBreadth)
    },
    ...event.contexts && {
      contexts: normalize(event.contexts, depth, maxBreadth)
    },
    ...event.extra && {
      extra: normalize(event.extra, depth, maxBreadth)
    }
  };
  if (event.contexts && event.contexts.trace && normalized.contexts) {
    normalized.contexts.trace = event.contexts.trace;
    if (event.contexts.trace.data) {
      normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
    }
  }
  if (event.spans) {
    normalized.spans = event.spans.map((span) => {
      const data = spanToJSON(span).data;
      if (data) {
        span.data = normalize(data, depth, maxBreadth);
      }
      return span;
    });
  }
  return normalized;
}
__name(normalizeEvent, "normalizeEvent");
function getFinalScope(scope, captureContext) {
  if (!captureContext) {
    return scope;
  }
  const finalScope = scope ? scope.clone() : new Scope();
  finalScope.update(captureContext);
  return finalScope;
}
__name(getFinalScope, "getFinalScope");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/exports.js
function getClient() {
  return getCurrentHub().getClient();
}
__name(getClient, "getClient");
function getCurrentScope() {
  return getCurrentHub().getScope();
}
__name(getCurrentScope, "getCurrentScope");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/getRootSpan.js
init_checked_fetch();
init_modules_watch_stub();
function getRootSpan(span) {
  return span.transaction;
}
__name(getRootSpan, "getRootSpan");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/dynamicSamplingContext.js
function getDynamicSamplingContextFromClient(trace_id, client, scope) {
  const options = client.getOptions();
  const { publicKey: public_key } = client.getDsn() || {};
  const { segment: user_segment } = scope && scope.getUser() || {};
  const dsc = dropUndefinedKeys({
    environment: options.environment || DEFAULT_ENVIRONMENT,
    release: options.release,
    user_segment,
    public_key,
    trace_id
  });
  client.emit && client.emit("createDsc", dsc);
  return dsc;
}
__name(getDynamicSamplingContextFromClient, "getDynamicSamplingContextFromClient");
function getDynamicSamplingContextFromSpan(span) {
  const client = getClient();
  if (!client) {
    return {};
  }
  const dsc = getDynamicSamplingContextFromClient(spanToJSON(span).trace_id || "", client, getCurrentScope());
  const txn = getRootSpan(span);
  if (!txn) {
    return dsc;
  }
  const v7FrozenDsc = txn && txn._frozenDynamicSamplingContext;
  if (v7FrozenDsc) {
    return v7FrozenDsc;
  }
  const { sampleRate: maybeSampleRate, source } = txn.metadata;
  if (maybeSampleRate != null) {
    dsc.sample_rate = `${maybeSampleRate}`;
  }
  const jsonSpan = spanToJSON(txn);
  if (source && source !== "url") {
    dsc.transaction = jsonSpan.description;
  }
  dsc.sampled = String(spanIsSampled(txn));
  client.emit && client.emit("createDsc", dsc);
  return dsc;
}
__name(getDynamicSamplingContextFromSpan, "getDynamicSamplingContextFromSpan");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/applyScopeDataToEvent.js
function applyScopeDataToEvent(event, data) {
  const { fingerprint, span, breadcrumbs, sdkProcessingMetadata } = data;
  applyDataToEvent(event, data);
  if (span) {
    applySpanToEvent(event, span);
  }
  applyFingerprintToEvent(event, fingerprint);
  applyBreadcrumbsToEvent(event, breadcrumbs);
  applySdkMetadataToEvent(event, sdkProcessingMetadata);
}
__name(applyScopeDataToEvent, "applyScopeDataToEvent");
function mergeScopeData(data, mergeData) {
  const {
    extra,
    tags,
    user,
    contexts,
    level,
    sdkProcessingMetadata,
    breadcrumbs,
    fingerprint,
    eventProcessors,
    attachments,
    propagationContext,
    // eslint-disable-next-line deprecation/deprecation
    transactionName,
    span
  } = mergeData;
  mergeAndOverwriteScopeData(data, "extra", extra);
  mergeAndOverwriteScopeData(data, "tags", tags);
  mergeAndOverwriteScopeData(data, "user", user);
  mergeAndOverwriteScopeData(data, "contexts", contexts);
  mergeAndOverwriteScopeData(data, "sdkProcessingMetadata", sdkProcessingMetadata);
  if (level) {
    data.level = level;
  }
  if (transactionName) {
    data.transactionName = transactionName;
  }
  if (span) {
    data.span = span;
  }
  if (breadcrumbs.length) {
    data.breadcrumbs = [...data.breadcrumbs, ...breadcrumbs];
  }
  if (fingerprint.length) {
    data.fingerprint = [...data.fingerprint, ...fingerprint];
  }
  if (eventProcessors.length) {
    data.eventProcessors = [...data.eventProcessors, ...eventProcessors];
  }
  if (attachments.length) {
    data.attachments = [...data.attachments, ...attachments];
  }
  data.propagationContext = { ...data.propagationContext, ...propagationContext };
}
__name(mergeScopeData, "mergeScopeData");
function mergeAndOverwriteScopeData(data, prop, mergeVal) {
  if (mergeVal && Object.keys(mergeVal).length) {
    data[prop] = { ...data[prop] };
    for (const key in mergeVal) {
      if (Object.prototype.hasOwnProperty.call(mergeVal, key)) {
        data[prop][key] = mergeVal[key];
      }
    }
  }
}
__name(mergeAndOverwriteScopeData, "mergeAndOverwriteScopeData");
function applyDataToEvent(event, data) {
  const {
    extra,
    tags,
    user,
    contexts,
    level,
    // eslint-disable-next-line deprecation/deprecation
    transactionName
  } = data;
  const cleanedExtra = dropUndefinedKeys(extra);
  if (cleanedExtra && Object.keys(cleanedExtra).length) {
    event.extra = { ...cleanedExtra, ...event.extra };
  }
  const cleanedTags = dropUndefinedKeys(tags);
  if (cleanedTags && Object.keys(cleanedTags).length) {
    event.tags = { ...cleanedTags, ...event.tags };
  }
  const cleanedUser = dropUndefinedKeys(user);
  if (cleanedUser && Object.keys(cleanedUser).length) {
    event.user = { ...cleanedUser, ...event.user };
  }
  const cleanedContexts = dropUndefinedKeys(contexts);
  if (cleanedContexts && Object.keys(cleanedContexts).length) {
    event.contexts = { ...cleanedContexts, ...event.contexts };
  }
  if (level) {
    event.level = level;
  }
  if (transactionName) {
    event.transaction = transactionName;
  }
}
__name(applyDataToEvent, "applyDataToEvent");
function applyBreadcrumbsToEvent(event, breadcrumbs) {
  const mergedBreadcrumbs = [...event.breadcrumbs || [], ...breadcrumbs];
  event.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : void 0;
}
__name(applyBreadcrumbsToEvent, "applyBreadcrumbsToEvent");
function applySdkMetadataToEvent(event, sdkProcessingMetadata) {
  event.sdkProcessingMetadata = {
    ...event.sdkProcessingMetadata,
    ...sdkProcessingMetadata
  };
}
__name(applySdkMetadataToEvent, "applySdkMetadataToEvent");
function applySpanToEvent(event, span) {
  event.contexts = { trace: spanToTraceContext(span), ...event.contexts };
  const rootSpan = getRootSpan(span);
  if (rootSpan) {
    event.sdkProcessingMetadata = {
      dynamicSamplingContext: getDynamicSamplingContextFromSpan(span),
      ...event.sdkProcessingMetadata
    };
    const transactionName = spanToJSON(rootSpan).description;
    if (transactionName) {
      event.tags = { transaction: transactionName, ...event.tags };
    }
  }
}
__name(applySpanToEvent, "applySpanToEvent");
function applyFingerprintToEvent(event, fingerprint) {
  event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];
  if (fingerprint) {
    event.fingerprint = event.fingerprint.concat(fingerprint);
  }
  if (event.fingerprint && !event.fingerprint.length) {
    delete event.fingerprint;
  }
}
__name(applyFingerprintToEvent, "applyFingerprintToEvent");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/scope.js
var DEFAULT_MAX_BREADCRUMBS = 100;
var globalScope;
var Scope = class {
  /** Flag if notifying is happening. */
  /** Callback for client to receive scope changes. */
  /** Callback list that will be called after {@link applyToEvent}. */
  /** Array of breadcrumbs. */
  /** User */
  /** Tags */
  /** Extra */
  /** Contexts */
  /** Attachments */
  /** Propagation Context for distributed tracing */
  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  /** Fingerprint */
  /** Severity */
  // eslint-disable-next-line deprecation/deprecation
  /**
   * Transaction Name
   */
  /** Span */
  /** Session */
  /** Request Mode Session Status */
  /** The client on this scope */
  // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
  constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
    this._propagationContext = generatePropagationContext();
  }
  /**
   * Inherit values from the parent scope.
   * @deprecated Use `scope.clone()` and `new Scope()` instead.
   */
  static clone(scope) {
    return scope ? scope.clone() : new Scope();
  }
  /**
   * Clone this scope instance.
   */
  clone() {
    const newScope = new Scope();
    newScope._breadcrumbs = [...this._breadcrumbs];
    newScope._tags = { ...this._tags };
    newScope._extra = { ...this._extra };
    newScope._contexts = { ...this._contexts };
    newScope._user = this._user;
    newScope._level = this._level;
    newScope._span = this._span;
    newScope._session = this._session;
    newScope._transactionName = this._transactionName;
    newScope._fingerprint = this._fingerprint;
    newScope._eventProcessors = [...this._eventProcessors];
    newScope._requestSession = this._requestSession;
    newScope._attachments = [...this._attachments];
    newScope._sdkProcessingMetadata = { ...this._sdkProcessingMetadata };
    newScope._propagationContext = { ...this._propagationContext };
    newScope._client = this._client;
    return newScope;
  }
  /** Update the client on the scope. */
  setClient(client) {
    this._client = client;
  }
  /**
   * Get the client assigned to this scope.
   *
   * It is generally recommended to use the global function `Sentry.getClient()` instead, unless you know what you are doing.
   */
  getClient() {
    return this._client;
  }
  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */
  addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }
  /**
   * @inheritDoc
   */
  addEventProcessor(callback) {
    this._eventProcessors.push(callback);
    return this;
  }
  /**
   * @inheritDoc
   */
  setUser(user) {
    this._user = user || {
      email: void 0,
      id: void 0,
      ip_address: void 0,
      segment: void 0,
      username: void 0
    };
    if (this._session) {
      updateSession(this._session, { user });
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getUser() {
    return this._user;
  }
  /**
   * @inheritDoc
   */
  getRequestSession() {
    return this._requestSession;
  }
  /**
   * @inheritDoc
   */
  setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }
  /**
   * @inheritDoc
   */
  setTags(tags) {
    this._tags = {
      ...this._tags,
      ...tags
    };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this._tags = { ...this._tags, [key]: value };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setExtras(extras) {
    this._extra = {
      ...this._extra,
      ...extras
    };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setExtra(key, extra) {
    this._extra = { ...this._extra, [key]: extra };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setLevel(level) {
    this._level = level;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * Sets the transaction name on the scope for future events.
   */
  setTransactionName(name) {
    this._transactionName = name;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * Sets the Span on the scope.
   * @param span Span
   * @deprecated Instead of setting a span on a scope, use `startSpan()`/`startSpanManual()` instead.
   */
  setSpan(span) {
    this._span = span;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * Returns the `Span` if there is one.
   * @deprecated Use `getActiveSpan()` instead.
   */
  getSpan() {
    return this._span;
  }
  /**
   * Returns the `Transaction` attached to the scope (if there is one).
   * @deprecated You should not rely on the transaction, but just use `startSpan()` APIs instead.
   */
  getTransaction() {
    const span = this._span;
    return span && span.transaction;
  }
  /**
   * @inheritDoc
   */
  setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getSession() {
    return this._session;
  }
  /**
   * @inheritDoc
   */
  update(captureContext) {
    if (!captureContext) {
      return this;
    }
    const scopeToMerge = typeof captureContext === "function" ? captureContext(this) : captureContext;
    if (scopeToMerge instanceof Scope) {
      const scopeData = scopeToMerge.getScopeData();
      this._tags = { ...this._tags, ...scopeData.tags };
      this._extra = { ...this._extra, ...scopeData.extra };
      this._contexts = { ...this._contexts, ...scopeData.contexts };
      if (scopeData.user && Object.keys(scopeData.user).length) {
        this._user = scopeData.user;
      }
      if (scopeData.level) {
        this._level = scopeData.level;
      }
      if (scopeData.fingerprint.length) {
        this._fingerprint = scopeData.fingerprint;
      }
      if (scopeToMerge.getRequestSession()) {
        this._requestSession = scopeToMerge.getRequestSession();
      }
      if (scopeData.propagationContext) {
        this._propagationContext = scopeData.propagationContext;
      }
    } else if (isPlainObject(scopeToMerge)) {
      const scopeContext = captureContext;
      this._tags = { ...this._tags, ...scopeContext.tags };
      this._extra = { ...this._extra, ...scopeContext.extra };
      this._contexts = { ...this._contexts, ...scopeContext.contexts };
      if (scopeContext.user) {
        this._user = scopeContext.user;
      }
      if (scopeContext.level) {
        this._level = scopeContext.level;
      }
      if (scopeContext.fingerprint) {
        this._fingerprint = scopeContext.fingerprint;
      }
      if (scopeContext.requestSession) {
        this._requestSession = scopeContext.requestSession;
      }
      if (scopeContext.propagationContext) {
        this._propagationContext = scopeContext.propagationContext;
      }
    }
    return this;
  }
  /**
   * @inheritDoc
   */
  clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = void 0;
    this._transactionName = void 0;
    this._fingerprint = void 0;
    this._requestSession = void 0;
    this._span = void 0;
    this._session = void 0;
    this._notifyScopeListeners();
    this._attachments = [];
    this._propagationContext = generatePropagationContext();
    return this;
  }
  /**
   * @inheritDoc
   */
  addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
    if (maxCrumbs <= 0) {
      return this;
    }
    const mergedBreadcrumb = {
      timestamp: dateTimestampInSeconds(),
      ...breadcrumb
    };
    const breadcrumbs = this._breadcrumbs;
    breadcrumbs.push(mergedBreadcrumb);
    this._breadcrumbs = breadcrumbs.length > maxCrumbs ? breadcrumbs.slice(-maxCrumbs) : breadcrumbs;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  /**
   * @inheritDoc
   */
  clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  addAttachment(attachment) {
    this._attachments.push(attachment);
    return this;
  }
  /**
   * @inheritDoc
   * @deprecated Use `getScopeData()` instead.
   */
  getAttachments() {
    const data = this.getScopeData();
    return data.attachments;
  }
  /**
   * @inheritDoc
   */
  clearAttachments() {
    this._attachments = [];
    return this;
  }
  /** @inheritDoc */
  getScopeData() {
    const {
      _breadcrumbs,
      _attachments,
      _contexts,
      _tags,
      _extra,
      _user,
      _level,
      _fingerprint,
      _eventProcessors,
      _propagationContext,
      _sdkProcessingMetadata,
      _transactionName,
      _span
    } = this;
    return {
      breadcrumbs: _breadcrumbs,
      attachments: _attachments,
      contexts: _contexts,
      tags: _tags,
      extra: _extra,
      user: _user,
      level: _level,
      fingerprint: _fingerprint || [],
      eventProcessors: _eventProcessors,
      propagationContext: _propagationContext,
      sdkProcessingMetadata: _sdkProcessingMetadata,
      transactionName: _transactionName,
      span: _span
    };
  }
  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   * @deprecated Use `applyScopeDataToEvent()` directly
   */
  applyToEvent(event, hint = {}, additionalEventProcessors = []) {
    applyScopeDataToEvent(event, this.getScopeData());
    const eventProcessors = [
      ...additionalEventProcessors,
      // eslint-disable-next-line deprecation/deprecation
      ...getGlobalEventProcessors(),
      ...this._eventProcessors
    ];
    return notifyEventProcessors(eventProcessors, event, hint);
  }
  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */
  setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };
    return this;
  }
  /**
   * @inheritDoc
   */
  setPropagationContext(context) {
    this._propagationContext = context;
    return this;
  }
  /**
   * @inheritDoc
   */
  getPropagationContext() {
    return this._propagationContext;
  }
  /**
   * Capture an exception for this scope.
   *
   * @param exception The exception to capture.
   * @param hint Optinal additional data to attach to the Sentry event.
   * @returns the id of the captured Sentry event.
   */
  captureException(exception, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!this._client) {
      logger2.warn("No client configured on scope - will not capture exception!");
      return eventId;
    }
    const syntheticException = new Error("Sentry syntheticException");
    this._client.captureException(
      exception,
      {
        originalException: exception,
        syntheticException,
        ...hint,
        event_id: eventId
      },
      this
    );
    return eventId;
  }
  /**
   * Capture a message for this scope.
   *
   * @param message The message to capture.
   * @param level An optional severity level to report the message with.
   * @param hint Optional additional data to attach to the Sentry event.
   * @returns the id of the captured message.
   */
  captureMessage(message, level, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!this._client) {
      logger2.warn("No client configured on scope - will not capture message!");
      return eventId;
    }
    const syntheticException = new Error(message);
    this._client.captureMessage(
      message,
      level,
      {
        originalException: message,
        syntheticException,
        ...hint,
        event_id: eventId
      },
      this
    );
    return eventId;
  }
  /**
   * Captures a manually created event for this scope and sends it to Sentry.
   *
   * @param exception The event to capture.
   * @param hint Optional additional data to attach to the Sentry event.
   * @returns the id of the captured event.
   */
  captureEvent(event, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!this._client) {
      logger2.warn("No client configured on scope - will not capture event!");
      return eventId;
    }
    this._client.captureEvent(event, { ...hint, event_id: eventId }, this);
    return eventId;
  }
  /**
   * This will be called on every set call.
   */
  _notifyScopeListeners() {
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach((callback) => {
        callback(this);
      });
      this._notifyingListeners = false;
    }
  }
};
__name(Scope, "Scope");
function getGlobalScope() {
  if (!globalScope) {
    globalScope = new Scope();
  }
  return globalScope;
}
__name(getGlobalScope, "getGlobalScope");
function generatePropagationContext() {
  return {
    traceId: uuid4(),
    spanId: uuid4().substring(16)
  };
}
__name(generatePropagationContext, "generatePropagationContext");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/version.js
init_checked_fetch();
init_modules_watch_stub();
var SDK_VERSION = "7.112.2";

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/hub.js
var API_VERSION = parseFloat(SDK_VERSION);
var DEFAULT_BREADCRUMBS = 100;
var Hub = class {
  /** Is a {@link Layer}[] containing the client and scope */
  /** Contains the last event id of a captured event.  */
  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   *
   * @deprecated Instantiation of Hub objects is deprecated and the constructor will be removed in version 8 of the SDK.
   *
   * If you are currently using the Hub for multi-client use like so:
   *
   * ```
   * // OLD
   * const hub = new Hub();
   * hub.bindClient(client);
   * makeMain(hub)
   * ```
   *
   * instead initialize the client as follows:
   *
   * ```
   * // NEW
   * Sentry.withIsolationScope(() => {
   *    Sentry.setCurrentClient(client);
   *    client.init();
   * });
   * ```
   *
   * If you are using the Hub to capture events like so:
   *
   * ```
   * // OLD
   * const client = new Client();
   * const hub = new Hub(client);
   * hub.captureException()
   * ```
   *
   * instead capture isolated events as follows:
   *
   * ```
   * // NEW
   * const client = new Client();
   * const scope = new Scope();
   * scope.setClient(client);
   * scope.captureException();
   * ```
   */
  constructor(client, scope, isolationScope, _version = API_VERSION) {
    this._version = _version;
    let assignedScope;
    if (!scope) {
      assignedScope = new Scope();
      assignedScope.setClient(client);
    } else {
      assignedScope = scope;
    }
    let assignedIsolationScope;
    if (!isolationScope) {
      assignedIsolationScope = new Scope();
      assignedIsolationScope.setClient(client);
    } else {
      assignedIsolationScope = isolationScope;
    }
    this._stack = [{ scope: assignedScope }];
    if (client) {
      this.bindClient(client);
    }
    this._isolationScope = assignedIsolationScope;
  }
  /**
   * Checks if this hub's version is older than the given version.
   *
   * @param version A version number to compare to.
   * @return True if the given version is newer; otherwise false.
   *
   * @deprecated This will be removed in v8.
   */
  isOlderThan(version) {
    return this._version < version;
  }
  /**
   * This binds the given client to the current scope.
   * @param client An SDK client (client) instance.
   *
   * @deprecated Use `initAndBind()` directly, or `setCurrentClient()` and/or `client.init()` instead.
   */
  bindClient(client) {
    const top = this.getStackTop();
    top.client = client;
    top.scope.setClient(client);
    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `withScope` instead.
   */
  pushScope() {
    const scope = this.getScope().clone();
    this.getStack().push({
      // eslint-disable-next-line deprecation/deprecation
      client: this.getClient(),
      scope
    });
    return scope;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `withScope` instead.
   */
  popScope() {
    if (this.getStack().length <= 1)
      return false;
    return !!this.getStack().pop();
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.withScope()` instead.
   */
  withScope(callback) {
    const scope = this.pushScope();
    let maybePromiseResult;
    try {
      maybePromiseResult = callback(scope);
    } catch (e) {
      this.popScope();
      throw e;
    }
    if (isThenable(maybePromiseResult)) {
      return maybePromiseResult.then(
        (res) => {
          this.popScope();
          return res;
        },
        (e) => {
          this.popScope();
          throw e;
        }
      );
    }
    this.popScope();
    return maybePromiseResult;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.getClient()` instead.
   */
  getClient() {
    return this.getStackTop().client;
  }
  /**
   * Returns the scope of the top stack.
   *
   * @deprecated Use `Sentry.getCurrentScope()` instead.
   */
  getScope() {
    return this.getStackTop().scope;
  }
  /**
   * @deprecated Use `Sentry.getIsolationScope()` instead.
   */
  getIsolationScope() {
    return this._isolationScope;
  }
  /**
   * Returns the scope stack for domains or the process.
   * @deprecated This will be removed in v8.
   */
  getStack() {
    return this._stack;
  }
  /**
   * Returns the topmost scope layer in the order domain > local > process.
   * @deprecated This will be removed in v8.
   */
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.captureException()` instead.
   */
  captureException(exception, hint) {
    const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
    const syntheticException = new Error("Sentry syntheticException");
    this.getScope().captureException(exception, {
      originalException: exception,
      syntheticException,
      ...hint,
      event_id: eventId
    });
    return eventId;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use  `Sentry.captureMessage()` instead.
   */
  captureMessage(message, level, hint) {
    const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
    const syntheticException = new Error(message);
    this.getScope().captureMessage(message, level, {
      originalException: message,
      syntheticException,
      ...hint,
      event_id: eventId
    });
    return eventId;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.captureEvent()` instead.
   */
  captureEvent(event, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!event.type) {
      this._lastEventId = eventId;
    }
    this.getScope().captureEvent(event, { ...hint, event_id: eventId });
    return eventId;
  }
  /**
   * @inheritDoc
   *
   * @deprecated This will be removed in v8.
   */
  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.addBreadcrumb()` instead.
   */
  addBreadcrumb(breadcrumb, hint) {
    const { scope, client } = this.getStackTop();
    if (!client)
      return;
    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions && client.getOptions() || {};
    if (maxBreadcrumbs <= 0)
      return;
    const timestamp = dateTimestampInSeconds();
    const mergedBreadcrumb = { timestamp, ...breadcrumb };
    const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
    if (finalBreadcrumb === null)
      return;
    if (client.emit) {
      client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint);
    }
    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.setUser()` instead.
   */
  setUser(user) {
    this.getScope().setUser(user);
    this.getIsolationScope().setUser(user);
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.setTags()` instead.
   */
  setTags(tags) {
    this.getScope().setTags(tags);
    this.getIsolationScope().setTags(tags);
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.setExtras()` instead.
   */
  setExtras(extras) {
    this.getScope().setExtras(extras);
    this.getIsolationScope().setExtras(extras);
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.setTag()` instead.
   */
  setTag(key, value) {
    this.getScope().setTag(key, value);
    this.getIsolationScope().setTag(key, value);
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.setExtra()` instead.
   */
  setExtra(key, extra) {
    this.getScope().setExtra(key, extra);
    this.getIsolationScope().setExtra(key, extra);
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.setContext()` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setContext(name, context) {
    this.getScope().setContext(name, context);
    this.getIsolationScope().setContext(name, context);
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `getScope()` directly.
   */
  configureScope(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(scope);
    }
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line deprecation/deprecation
  run(callback) {
    const oldHub = makeMain(this);
    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }
  /**
   * @inheritDoc
   * @deprecated Use `Sentry.getClient().getIntegrationByName()` instead.
   */
  getIntegration(integration) {
    const client = this.getClient();
    if (!client)
      return null;
    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      DEBUG_BUILD2 && logger2.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
      return null;
    }
  }
  /**
   * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
   *
   * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
   * new child span within the transaction or any span, call the respective `.startChild()` method.
   *
   * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
   *
   * The transaction must be finished with a call to its `.end()` method, at which point the transaction with all its
   * finished child spans will be sent to Sentry.
   *
   * @param context Properties of the new `Transaction`.
   * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
   * default values). See {@link Options.tracesSampler}.
   *
   * @returns The transaction which was just started
   *
   * @deprecated Use `startSpan()`, `startSpanManual()` or `startInactiveSpan()` instead.
   */
  startTransaction(context, customSamplingContext) {
    const result = this._callExtensionMethod("startTransaction", context, customSamplingContext);
    if (DEBUG_BUILD2 && !result) {
      const client = this.getClient();
      if (!client) {
        logger2.warn(
          "Tracing extension 'startTransaction' is missing. You should 'init' the SDK before calling 'startTransaction'"
        );
      } else {
        logger2.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
Sentry.addTracingExtensions();
Sentry.init({...});
`);
      }
    }
    return result;
  }
  /**
   * @inheritDoc
   * @deprecated Use `spanToTraceHeader()` instead.
   */
  traceHeaders() {
    return this._callExtensionMethod("traceHeaders");
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use top level `captureSession` instead.
   */
  captureSession(endSession = false) {
    if (endSession) {
      return this.endSession();
    }
    this._sendSessionUpdate();
  }
  /**
   * @inheritDoc
   * @deprecated Use top level `endSession` instead.
   */
  endSession() {
    const layer = this.getStackTop();
    const scope = layer.scope;
    const session = scope.getSession();
    if (session) {
      closeSession(session);
    }
    this._sendSessionUpdate();
    scope.setSession();
  }
  /**
   * @inheritDoc
   * @deprecated Use top level `startSession` instead.
   */
  startSession(context) {
    const { scope, client } = this.getStackTop();
    const { release, environment = DEFAULT_ENVIRONMENT } = client && client.getOptions() || {};
    const { userAgent } = GLOBAL_OBJ.navigator || {};
    const session = makeSession({
      release,
      environment,
      user: scope.getUser(),
      ...userAgent && { userAgent },
      ...context
    });
    const currentSession = scope.getSession && scope.getSession();
    if (currentSession && currentSession.status === "ok") {
      updateSession(currentSession, { status: "exited" });
    }
    this.endSession();
    scope.setSession(session);
    return session;
  }
  /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   *
   * @deprecated Use top-level `getClient().getOptions().sendDefaultPii` instead. This function
   * only unnecessarily increased API surface but only wrapped accessing the option.
   */
  shouldSendDefaultPii() {
    const client = this.getClient();
    const options = client && client.getOptions();
    return Boolean(options && options.sendDefaultPii);
  }
  /**
   * Sends the current Session on the scope
   */
  _sendSessionUpdate() {
    const { scope, client } = this.getStackTop();
    const session = scope.getSession();
    if (session && client && client.captureSession) {
      client.captureSession(session);
    }
  }
  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-expect-error Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _callExtensionMethod(method, ...args) {
    const carrier = getMainCarrier();
    const sentry2 = carrier.__SENTRY__;
    if (sentry2 && sentry2.extensions && typeof sentry2.extensions[method] === "function") {
      return sentry2.extensions[method].apply(this, args);
    }
    DEBUG_BUILD2 && logger2.warn(`Extension method ${method} couldn't be found, doing nothing.`);
  }
};
__name(Hub, "Hub");
function getMainCarrier() {
  GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
    extensions: {},
    hub: void 0
  };
  return GLOBAL_OBJ;
}
__name(getMainCarrier, "getMainCarrier");
function makeMain(hub) {
  const registry = getMainCarrier();
  const oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}
__name(makeMain, "makeMain");
function getCurrentHub() {
  const registry = getMainCarrier();
  if (registry.__SENTRY__ && registry.__SENTRY__.acs) {
    const hub = registry.__SENTRY__.acs.getCurrentHub();
    if (hub) {
      return hub;
    }
  }
  return getGlobalHub(registry);
}
__name(getCurrentHub, "getCurrentHub");
function getIsolationScope() {
  return getCurrentHub().getIsolationScope();
}
__name(getIsolationScope, "getIsolationScope");
function getGlobalHub(registry = getMainCarrier()) {
  if (!hasHubOnCarrier(registry) || // eslint-disable-next-line deprecation/deprecation
  getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  }
  return getHubFromCarrier(registry);
}
__name(getGlobalHub, "getGlobalHub");
function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
__name(hasHubOnCarrier, "hasHubOnCarrier");
function getHubFromCarrier(carrier) {
  return getGlobalSingleton("hub", () => new Hub(), carrier);
}
__name(getHubFromCarrier, "getHubFromCarrier");
function setHubOnCarrier(carrier, hub) {
  if (!carrier)
    return false;
  const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
  __SENTRY__.hub = hub;
  return true;
}
__name(setHubOnCarrier, "setHubOnCarrier");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/errors.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/utils.js
init_checked_fetch();
init_modules_watch_stub();
function getActiveTransaction(maybeHub) {
  const hub = maybeHub || getCurrentHub();
  const scope = hub.getScope();
  return scope.getTransaction();
}
__name(getActiveTransaction, "getActiveTransaction");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/errors.js
var errorsInstrumented = false;
function registerErrorInstrumentation() {
  if (errorsInstrumented) {
    return;
  }
  errorsInstrumented = true;
  addGlobalErrorInstrumentationHandler(errorCallback);
  addGlobalUnhandledRejectionInstrumentationHandler(errorCallback);
}
__name(registerErrorInstrumentation, "registerErrorInstrumentation");
function errorCallback() {
  const activeTransaction = getActiveTransaction();
  if (activeTransaction) {
    const status = "internal_error";
    DEBUG_BUILD2 && logger2.log(`[Tracing] Transaction: ${status} -> Global error occured`);
    activeTransaction.setStatus(status);
  }
}
__name(errorCallback, "errorCallback");
errorCallback.tag = "sentry_tracingErrorCallback";

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/span.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/metric-summary.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/spanstatus.js
init_checked_fetch();
init_modules_watch_stub();
var SpanStatus;
(function(SpanStatus2) {
  const Ok = "ok";
  SpanStatus2["Ok"] = Ok;
  const DeadlineExceeded = "deadline_exceeded";
  SpanStatus2["DeadlineExceeded"] = DeadlineExceeded;
  const Unauthenticated = "unauthenticated";
  SpanStatus2["Unauthenticated"] = Unauthenticated;
  const PermissionDenied = "permission_denied";
  SpanStatus2["PermissionDenied"] = PermissionDenied;
  const NotFound = "not_found";
  SpanStatus2["NotFound"] = NotFound;
  const ResourceExhausted = "resource_exhausted";
  SpanStatus2["ResourceExhausted"] = ResourceExhausted;
  const InvalidArgument = "invalid_argument";
  SpanStatus2["InvalidArgument"] = InvalidArgument;
  const Unimplemented = "unimplemented";
  SpanStatus2["Unimplemented"] = Unimplemented;
  const Unavailable = "unavailable";
  SpanStatus2["Unavailable"] = Unavailable;
  const InternalError = "internal_error";
  SpanStatus2["InternalError"] = InternalError;
  const UnknownError = "unknown_error";
  SpanStatus2["UnknownError"] = UnknownError;
  const Cancelled = "cancelled";
  SpanStatus2["Cancelled"] = Cancelled;
  const AlreadyExists = "already_exists";
  SpanStatus2["AlreadyExists"] = AlreadyExists;
  const FailedPrecondition = "failed_precondition";
  SpanStatus2["FailedPrecondition"] = FailedPrecondition;
  const Aborted = "aborted";
  SpanStatus2["Aborted"] = Aborted;
  const OutOfRange = "out_of_range";
  SpanStatus2["OutOfRange"] = OutOfRange;
  const DataLoss = "data_loss";
  SpanStatus2["DataLoss"] = DataLoss;
})(SpanStatus || (SpanStatus = {}));
function getSpanStatusFromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return "ok";
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return "unauthenticated";
      case 403:
        return "permission_denied";
      case 404:
        return "not_found";
      case 409:
        return "already_exists";
      case 413:
        return "failed_precondition";
      case 429:
        return "resource_exhausted";
      default:
        return "invalid_argument";
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return "unimplemented";
      case 503:
        return "unavailable";
      case 504:
        return "deadline_exceeded";
      default:
        return "internal_error";
    }
  }
  return "unknown_error";
}
__name(getSpanStatusFromHttpCode, "getSpanStatusFromHttpCode");
function setHttpStatus(span, httpStatus) {
  span.setTag("http.status_code", String(httpStatus));
  span.setData("http.response.status_code", httpStatus);
  const spanStatus = getSpanStatusFromHttpCode(httpStatus);
  if (spanStatus !== "unknown_error") {
    span.setStatus(spanStatus);
  }
}
__name(setHttpStatus, "setHttpStatus");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/trace.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/utils/hasTracingEnabled.js
init_checked_fetch();
init_modules_watch_stub();
function hasTracingEnabled(maybeOptions) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) {
    return false;
  }
  const client = getClient();
  const options = maybeOptions || client && client.getOptions();
  return !!options && (options.enableTracing || "tracesSampleRate" in options || "tracesSampler" in options);
}
__name(hasTracingEnabled, "hasTracingEnabled");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/trace.js
function getActiveSpan() {
  return getCurrentScope().getSpan();
}
__name(getActiveSpan, "getActiveSpan");
var SCOPE_ON_START_SPAN_FIELD = "_sentryScope";
var ISOLATION_SCOPE_ON_START_SPAN_FIELD = "_sentryIsolationScope";
function getCapturedScopesOnSpan(span) {
  return {
    scope: span[SCOPE_ON_START_SPAN_FIELD],
    isolationScope: span[ISOLATION_SCOPE_ON_START_SPAN_FIELD]
  };
}
__name(getCapturedScopesOnSpan, "getCapturedScopesOnSpan");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/metric-summary.js
var SPAN_METRIC_SUMMARY;
function getMetricStorageForSpan(span) {
  return SPAN_METRIC_SUMMARY ? SPAN_METRIC_SUMMARY.get(span) : void 0;
}
__name(getMetricStorageForSpan, "getMetricStorageForSpan");
function getMetricSummaryJsonForSpan(span) {
  const storage = getMetricStorageForSpan(span);
  if (!storage) {
    return void 0;
  }
  const output = {};
  for (const [, [exportKey, summary]] of storage) {
    if (!output[exportKey]) {
      output[exportKey] = [];
    }
    output[exportKey].push(dropUndefinedKeys(summary));
  }
  return output;
}
__name(getMetricSummaryJsonForSpan, "getMetricSummaryJsonForSpan");
function updateMetricSummaryOnActiveSpan(metricType, sanitizedName, value, unit, tags, bucketKey) {
  const span = getActiveSpan();
  if (span) {
    const storage = getMetricStorageForSpan(span) || /* @__PURE__ */ new Map();
    const exportKey = `${metricType}:${sanitizedName}@${unit}`;
    const bucketItem = storage.get(bucketKey);
    if (bucketItem) {
      const [, summary] = bucketItem;
      storage.set(bucketKey, [
        exportKey,
        {
          min: Math.min(summary.min, value),
          max: Math.max(summary.max, value),
          count: summary.count += 1,
          sum: summary.sum += value,
          tags: summary.tags
        }
      ]);
    } else {
      storage.set(bucketKey, [
        exportKey,
        {
          min: value,
          max: value,
          count: 1,
          sum: value,
          tags
        }
      ]);
    }
    if (!SPAN_METRIC_SUMMARY) {
      SPAN_METRIC_SUMMARY = /* @__PURE__ */ new WeakMap();
    }
    SPAN_METRIC_SUMMARY.set(span, storage);
  }
}
__name(updateMetricSummaryOnActiveSpan, "updateMetricSummaryOnActiveSpan");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/semanticAttributes.js
init_checked_fetch();
init_modules_watch_stub();
var SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = "sentry.source";
var SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = "sentry.sample_rate";
var SEMANTIC_ATTRIBUTE_SENTRY_OP = "sentry.op";
var SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = "sentry.origin";
var SEMANTIC_ATTRIBUTE_PROFILE_ID = "profile_id";

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/span.js
var SpanRecorder = class {
  constructor(maxlen = 1e3) {
    this._maxlen = maxlen;
    this.spans = [];
  }
  /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */
  add(span) {
    if (this.spans.length > this._maxlen) {
      span.spanRecorder = void 0;
    } else {
      this.spans.push(span);
    }
  }
};
__name(SpanRecorder, "SpanRecorder");
var Span = class {
  /**
   * Tags for the span.
   * @deprecated Use `spanToJSON(span).atttributes` instead.
   */
  /**
   * Data for the span.
   * @deprecated Use `spanToJSON(span).atttributes` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /**
   * List of spans that were finalized
   *
   * @deprecated This property will no longer be public. Span recording will be handled internally.
   */
  /**
   * @inheritDoc
   * @deprecated Use top level `Sentry.getRootSpan()` instead
   */
  /**
   * The instrumenter that created this span.
   *
   * TODO (v8): This can probably be replaced by an `instanceOf` check of the span class.
   *            the instrumenter can only be sentry or otel so we can check the span instance
   *            to verify which one it is and remove this field entirely.
   *
   * @deprecated This field will be removed.
   */
  /** Epoch timestamp in seconds when the span started. */
  /** Epoch timestamp in seconds when the span ended. */
  /** Internal keeper of the status */
  /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */
  constructor(spanContext = {}) {
    this._traceId = spanContext.traceId || uuid4();
    this._spanId = spanContext.spanId || uuid4().substring(16);
    this._startTime = spanContext.startTimestamp || timestampInSeconds();
    this.tags = spanContext.tags ? { ...spanContext.tags } : {};
    this.data = spanContext.data ? { ...spanContext.data } : {};
    this.instrumenter = spanContext.instrumenter || "sentry";
    this._attributes = {};
    this.setAttributes({
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanContext.origin || "manual",
      [SEMANTIC_ATTRIBUTE_SENTRY_OP]: spanContext.op,
      ...spanContext.attributes
    });
    this._name = spanContext.name || spanContext.description;
    if (spanContext.parentSpanId) {
      this._parentSpanId = spanContext.parentSpanId;
    }
    if ("sampled" in spanContext) {
      this._sampled = spanContext.sampled;
    }
    if (spanContext.status) {
      this._status = spanContext.status;
    }
    if (spanContext.endTimestamp) {
      this._endTime = spanContext.endTimestamp;
    }
    if (spanContext.exclusiveTime !== void 0) {
      this._exclusiveTime = spanContext.exclusiveTime;
    }
    this._measurements = spanContext.measurements ? { ...spanContext.measurements } : {};
  }
  // This rule conflicts with another eslint rule :(
  /* eslint-disable @typescript-eslint/member-ordering */
  /**
   * An alias for `description` of the Span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */
  get name() {
    return this._name || "";
  }
  /**
   * Update the name of the span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */
  set name(name) {
    this.updateName(name);
  }
  /**
   * Get the description of the Span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */
  get description() {
    return this._name;
  }
  /**
   * Get the description of the Span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */
  set description(description) {
    this._name = description;
  }
  /**
   * The ID of the trace.
   * @deprecated Use `spanContext().traceId` instead.
   */
  get traceId() {
    return this._traceId;
  }
  /**
   * The ID of the trace.
   * @deprecated You cannot update the traceId of a span after span creation.
   */
  set traceId(traceId) {
    this._traceId = traceId;
  }
  /**
   * The ID of the span.
   * @deprecated Use `spanContext().spanId` instead.
   */
  get spanId() {
    return this._spanId;
  }
  /**
   * The ID of the span.
   * @deprecated You cannot update the spanId of a span after span creation.
   */
  set spanId(spanId) {
    this._spanId = spanId;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `startSpan` functions instead.
   */
  set parentSpanId(string) {
    this._parentSpanId = string;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `spanToJSON(span).parent_span_id` instead.
   */
  get parentSpanId() {
    return this._parentSpanId;
  }
  /**
   * Was this span chosen to be sent as part of the sample?
   * @deprecated Use `isRecording()` instead.
   */
  get sampled() {
    return this._sampled;
  }
  /**
   * Was this span chosen to be sent as part of the sample?
   * @deprecated You cannot update the sampling decision of a span after span creation.
   */
  set sampled(sampled) {
    this._sampled = sampled;
  }
  /**
   * Attributes for the span.
   * @deprecated Use `spanToJSON(span).atttributes` instead.
   */
  get attributes() {
    return this._attributes;
  }
  /**
   * Attributes for the span.
   * @deprecated Use `setAttributes()` instead.
   */
  set attributes(attributes) {
    this._attributes = attributes;
  }
  /**
   * Timestamp in seconds (epoch time) indicating when the span started.
   * @deprecated Use `spanToJSON()` instead.
   */
  get startTimestamp() {
    return this._startTime;
  }
  /**
   * Timestamp in seconds (epoch time) indicating when the span started.
   * @deprecated In v8, you will not be able to update the span start time after creation.
   */
  set startTimestamp(startTime) {
    this._startTime = startTime;
  }
  /**
   * Timestamp in seconds when the span ended.
   * @deprecated Use `spanToJSON()` instead.
   */
  get endTimestamp() {
    return this._endTime;
  }
  /**
   * Timestamp in seconds when the span ended.
   * @deprecated Set the end time via `span.end()` instead.
   */
  set endTimestamp(endTime) {
    this._endTime = endTime;
  }
  /**
   * The status of the span.
   *
   * @deprecated Use `spanToJSON().status` instead to get the status.
   */
  get status() {
    return this._status;
  }
  /**
   * The status of the span.
   *
   * @deprecated Use `.setStatus()` instead to set or update the status.
   */
  set status(status) {
    this._status = status;
  }
  /**
   * Operation of the span
   *
   * @deprecated Use `spanToJSON().op` to read the op instead.
   */
  get op() {
    return this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP];
  }
  /**
   * Operation of the span
   *
   * @deprecated Use `startSpan()` functions to set or `span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_OP, 'op')
   *             to update the span instead.
   */
  set op(op) {
    this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_OP, op);
  }
  /**
   * The origin of the span, giving context about what created the span.
   *
   * @deprecated Use `spanToJSON().origin` to read the origin instead.
   */
  get origin() {
    return this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN];
  }
  /**
   * The origin of the span, giving context about what created the span.
   *
   * @deprecated Use `startSpan()` functions to set the origin instead.
   */
  set origin(origin) {
    this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, origin);
  }
  /* eslint-enable @typescript-eslint/member-ordering */
  /** @inheritdoc */
  spanContext() {
    const { _spanId: spanId, _traceId: traceId, _sampled: sampled } = this;
    return {
      spanId,
      traceId,
      traceFlags: sampled ? TRACE_FLAG_SAMPLED : TRACE_FLAG_NONE
    };
  }
  /**
   * Creates a new `Span` while setting the current `Span.id` as `parentSpanId`.
   * Also the `sampled` decision will be inherited.
   *
   * @deprecated Use `startSpan()`, `startSpanManual()` or `startInactiveSpan()` instead.
   */
  startChild(spanContext) {
    const childSpan = new Span({
      ...spanContext,
      parentSpanId: this._spanId,
      sampled: this._sampled,
      traceId: this._traceId
    });
    childSpan.spanRecorder = this.spanRecorder;
    if (childSpan.spanRecorder) {
      childSpan.spanRecorder.add(childSpan);
    }
    const rootSpan = getRootSpan(this);
    childSpan.transaction = rootSpan;
    if (DEBUG_BUILD2 && rootSpan) {
      const opStr = spanContext && spanContext.op || "< unknown op >";
      const nameStr = spanToJSON(childSpan).description || "< unknown name >";
      const idStr = rootSpan.spanContext().spanId;
      const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
      logger2.log(logMessage);
      this._logMessage = logMessage;
    }
    return childSpan;
  }
  /**
   * Sets the tag attribute on the current span.
   *
   * Can also be used to unset a tag, by passing `undefined`.
   *
   * @param key Tag key
   * @param value Tag value
   * @deprecated Use `setAttribute()` instead.
   */
  setTag(key, value) {
    this.tags = { ...this.tags, [key]: value };
    return this;
  }
  /**
   * Sets the data attribute on the current span
   * @param key Data key
   * @param value Data value
   * @deprecated Use `setAttribute()` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData(key, value) {
    this.data = { ...this.data, [key]: value };
    return this;
  }
  /** @inheritdoc */
  setAttribute(key, value) {
    if (value === void 0) {
      delete this._attributes[key];
    } else {
      this._attributes[key] = value;
    }
  }
  /** @inheritdoc */
  setAttributes(attributes) {
    Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));
  }
  /**
   * @inheritDoc
   */
  setStatus(value) {
    this._status = value;
    return this;
  }
  /**
   * @inheritDoc
   * @deprecated Use top-level `setHttpStatus()` instead.
   */
  setHttpStatus(httpStatus) {
    setHttpStatus(this, httpStatus);
    return this;
  }
  /**
   * @inheritdoc
   *
   * @deprecated Use `.updateName()` instead.
   */
  setName(name) {
    this.updateName(name);
  }
  /**
   * @inheritDoc
   */
  updateName(name) {
    this._name = name;
    return this;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `spanToJSON(span).status === 'ok'` instead.
   */
  isSuccess() {
    return this._status === "ok";
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `.end()` instead.
   */
  finish(endTimestamp) {
    return this.end(endTimestamp);
  }
  /** @inheritdoc */
  end(endTimestamp) {
    if (this._endTime) {
      return;
    }
    const rootSpan = getRootSpan(this);
    if (DEBUG_BUILD2 && // Don't call this for transactions
    rootSpan && rootSpan.spanContext().spanId !== this._spanId) {
      const logMessage = this._logMessage;
      if (logMessage) {
        logger2.log(logMessage.replace("Starting", "Finishing"));
      }
    }
    this._endTime = spanTimeInputToSeconds(endTimestamp);
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `spanToTraceHeader()` instead.
   */
  toTraceparent() {
    return spanToTraceHeader(this);
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `spanToJSON()` or access the fields directly instead.
   */
  toContext() {
    return dropUndefinedKeys({
      data: this._getData(),
      description: this._name,
      endTimestamp: this._endTime,
      // eslint-disable-next-line deprecation/deprecation
      op: this.op,
      parentSpanId: this._parentSpanId,
      sampled: this._sampled,
      spanId: this._spanId,
      startTimestamp: this._startTime,
      status: this._status,
      // eslint-disable-next-line deprecation/deprecation
      tags: this.tags,
      traceId: this._traceId
    });
  }
  /**
   * @inheritDoc
   *
   * @deprecated Update the fields directly instead.
   */
  updateWithContext(spanContext) {
    this.data = spanContext.data || {};
    this._name = spanContext.name || spanContext.description;
    this._endTime = spanContext.endTimestamp;
    this.op = spanContext.op;
    this._parentSpanId = spanContext.parentSpanId;
    this._sampled = spanContext.sampled;
    this._spanId = spanContext.spanId || this._spanId;
    this._startTime = spanContext.startTimestamp || this._startTime;
    this._status = spanContext.status;
    this.tags = spanContext.tags || {};
    this._traceId = spanContext.traceId || this._traceId;
    return this;
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use `spanToTraceContext()` util function instead.
   */
  getTraceContext() {
    return spanToTraceContext(this);
  }
  /**
   * Get JSON representation of this span.
   *
   * @hidden
   * @internal This method is purely for internal purposes and should not be used outside
   * of SDK code. If you need to get a JSON representation of a span,
   * use `spanToJSON(span)` instead.
   */
  getSpanJSON() {
    return dropUndefinedKeys({
      data: this._getData(),
      description: this._name,
      op: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP],
      parent_span_id: this._parentSpanId,
      span_id: this._spanId,
      start_timestamp: this._startTime,
      status: this._status,
      // eslint-disable-next-line deprecation/deprecation
      tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
      timestamp: this._endTime,
      trace_id: this._traceId,
      origin: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
      _metrics_summary: getMetricSummaryJsonForSpan(this),
      profile_id: this._attributes[SEMANTIC_ATTRIBUTE_PROFILE_ID],
      exclusive_time: this._exclusiveTime,
      measurements: Object.keys(this._measurements).length > 0 ? this._measurements : void 0
    });
  }
  /** @inheritdoc */
  isRecording() {
    return !this._endTime && !!this._sampled;
  }
  /**
   * Convert the object to JSON.
   * @deprecated Use `spanToJSON(span)` instead.
   */
  toJSON() {
    return this.getSpanJSON();
  }
  /**
   * Get the merged data for this span.
   * For now, this combines `data` and `attributes` together,
   * until eventually we can ingest `attributes` directly.
   */
  _getData() {
    const { data, _attributes: attributes } = this;
    const hasData = Object.keys(data).length > 0;
    const hasAttributes = Object.keys(attributes).length > 0;
    if (!hasData && !hasAttributes) {
      return void 0;
    }
    if (hasData && hasAttributes) {
      return {
        ...data,
        ...attributes
      };
    }
    return hasData ? data : attributes;
  }
};
__name(Span, "Span");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/transaction.js
init_checked_fetch();
init_modules_watch_stub();
var Transaction = class extends Span {
  /**
   * The reference to the current hub.
   */
  // eslint-disable-next-line deprecation/deprecation
  // DO NOT yet remove this property, it is used in a hack for v7 backwards compatibility.
  /**
   * This constructor should never be called manually. Those instrumenting tracing should use
   * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
   * @internal
   * @hideconstructor
   * @hidden
   *
   * @deprecated Transactions will be removed in v8. Use spans instead.
   */
  // eslint-disable-next-line deprecation/deprecation
  constructor(transactionContext, hub) {
    super(transactionContext);
    this._contexts = {};
    this._hub = hub || getCurrentHub();
    this._name = transactionContext.name || "";
    this._metadata = {
      // eslint-disable-next-line deprecation/deprecation
      ...transactionContext.metadata
    };
    this._trimEnd = transactionContext.trimEnd;
    this.transaction = this;
    const incomingDynamicSamplingContext = this._metadata.dynamicSamplingContext;
    if (incomingDynamicSamplingContext) {
      this._frozenDynamicSamplingContext = { ...incomingDynamicSamplingContext };
    }
  }
  // This sadly conflicts with the getter/setter ordering :(
  /* eslint-disable @typescript-eslint/member-ordering */
  /**
   * Getter for `name` property.
   * @deprecated Use `spanToJSON(span).description` instead.
   */
  get name() {
    return this._name;
  }
  /**
   * Setter for `name` property, which also sets `source` as custom.
   * @deprecated Use `updateName()` and `setMetadata()` instead.
   */
  set name(newName) {
    this.setName(newName);
  }
  /**
   * Get the metadata for this transaction.
   * @deprecated Use `spanGetMetadata(transaction)` instead.
   */
  get metadata() {
    return {
      // Defaults
      // eslint-disable-next-line deprecation/deprecation
      source: "custom",
      spanMetadata: {},
      // Legacy metadata
      ...this._metadata,
      // From attributes
      ...this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] && {
        source: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]
      },
      ...this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] && {
        sampleRate: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]
      }
    };
  }
  /**
   * Update the metadata for this transaction.
   * @deprecated Use `spanGetMetadata(transaction)` instead.
   */
  set metadata(metadata) {
    this._metadata = metadata;
  }
  /* eslint-enable @typescript-eslint/member-ordering */
  /**
   * Setter for `name` property, which also sets `source` on the metadata.
   *
   * @deprecated Use `.updateName()` and `.setAttribute()` instead.
   */
  setName(name, source = "custom") {
    this._name = name;
    this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, source);
  }
  /** @inheritdoc */
  updateName(name) {
    this._name = name;
    return this;
  }
  /**
   * Attaches SpanRecorder to the span itself
   * @param maxlen maximum number of spans that can be recorded
   */
  initSpanRecorder(maxlen = 1e3) {
    if (!this.spanRecorder) {
      this.spanRecorder = new SpanRecorder(maxlen);
    }
    this.spanRecorder.add(this);
  }
  /**
   * Set the context of a transaction event.
   * @deprecated Use either `.setAttribute()`, or set the context on the scope before creating the transaction.
   */
  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }
  }
  /**
   * @inheritDoc
   *
   * @deprecated Use top-level `setMeasurement()` instead.
   */
  setMeasurement(name, value, unit = "") {
    this._measurements[name] = { value, unit };
  }
  /**
   * Store metadata on this transaction.
   * @deprecated Use attributes or store data on the scope instead.
   */
  setMetadata(newMetadata) {
    this._metadata = { ...this._metadata, ...newMetadata };
  }
  /**
   * @inheritDoc
   */
  end(endTimestamp) {
    const timestampInS = spanTimeInputToSeconds(endTimestamp);
    const transaction = this._finishTransaction(timestampInS);
    if (!transaction) {
      return void 0;
    }
    return this._hub.captureEvent(transaction);
  }
  /**
   * @inheritDoc
   */
  toContext() {
    const spanContext = super.toContext();
    return dropUndefinedKeys({
      ...spanContext,
      name: this._name,
      trimEnd: this._trimEnd
    });
  }
  /**
   * @inheritDoc
   */
  updateWithContext(transactionContext) {
    super.updateWithContext(transactionContext);
    this._name = transactionContext.name || "";
    this._trimEnd = transactionContext.trimEnd;
    return this;
  }
  /**
   * @inheritdoc
   *
   * @experimental
   *
   * @deprecated Use top-level `getDynamicSamplingContextFromSpan` instead.
   */
  getDynamicSamplingContext() {
    return getDynamicSamplingContextFromSpan(this);
  }
  /**
   * Override the current hub with a new one.
   * Used if you want another hub to finish the transaction.
   *
   * @internal
   */
  // eslint-disable-next-line deprecation/deprecation
  setHub(hub) {
    this._hub = hub;
  }
  /**
   * Get the profile id of the transaction.
   */
  getProfileId() {
    if (this._contexts !== void 0 && this._contexts["profile"] !== void 0) {
      return this._contexts["profile"].profile_id;
    }
    return void 0;
  }
  /**
   * Finish the transaction & prepare the event to send to Sentry.
   */
  _finishTransaction(endTimestamp) {
    if (this._endTime !== void 0) {
      return void 0;
    }
    if (!this._name) {
      DEBUG_BUILD2 && logger2.warn("Transaction has no name, falling back to `<unlabeled transaction>`.");
      this._name = "<unlabeled transaction>";
    }
    super.end(endTimestamp);
    const client = this._hub.getClient();
    if (client && client.emit) {
      client.emit("finishTransaction", this);
    }
    if (this._sampled !== true) {
      DEBUG_BUILD2 && logger2.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled.");
      if (client) {
        client.recordDroppedEvent("sample_rate", "transaction");
      }
      return void 0;
    }
    const finishedSpans = this.spanRecorder ? (
      // eslint-disable-next-line deprecation/deprecation
      this.spanRecorder.spans.filter((span) => span !== this && spanToJSON(span).timestamp)
    ) : [];
    if (this._trimEnd && finishedSpans.length > 0) {
      const endTimes = finishedSpans.map((span) => spanToJSON(span).timestamp).filter(Boolean);
      this._endTime = endTimes.reduce((prev, current) => {
        return prev > current ? prev : current;
      });
    }
    const { scope: capturedSpanScope, isolationScope: capturedSpanIsolationScope } = getCapturedScopesOnSpan(this);
    const { metadata } = this;
    const { source } = metadata;
    const transaction = {
      contexts: {
        ...this._contexts,
        // We don't want to override trace context
        trace: spanToTraceContext(this)
      },
      // TODO: Pass spans serialized via `spanToJSON()` here instead in v8.
      spans: finishedSpans,
      start_timestamp: this._startTime,
      // eslint-disable-next-line deprecation/deprecation
      tags: this.tags,
      timestamp: this._endTime,
      transaction: this._name,
      type: "transaction",
      sdkProcessingMetadata: {
        ...metadata,
        capturedSpanScope,
        capturedSpanIsolationScope,
        ...dropUndefinedKeys({
          dynamicSamplingContext: getDynamicSamplingContextFromSpan(this)
        })
      },
      _metrics_summary: getMetricSummaryJsonForSpan(this),
      ...source && {
        transaction_info: {
          source
        }
      }
    };
    const hasMeasurements = Object.keys(this._measurements).length > 0;
    if (hasMeasurements) {
      DEBUG_BUILD2 && logger2.log(
        "[Measurements] Adding measurements to transaction",
        JSON.stringify(this._measurements, void 0, 2)
      );
      transaction.measurements = this._measurements;
    }
    DEBUG_BUILD2 && logger2.log(`[Tracing] Finishing ${this.op} transaction: ${this._name}.`);
    return transaction;
  }
};
__name(Transaction, "Transaction");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/sampling.js
init_checked_fetch();
init_modules_watch_stub();
function sampleTransaction(transaction, options, samplingContext) {
  if (!hasTracingEnabled(options)) {
    transaction.sampled = false;
    return transaction;
  }
  if (transaction.sampled !== void 0) {
    transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(transaction.sampled));
    return transaction;
  }
  let sampleRate;
  if (typeof options.tracesSampler === "function") {
    sampleRate = options.tracesSampler(samplingContext);
    transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(sampleRate));
  } else if (samplingContext.parentSampled !== void 0) {
    sampleRate = samplingContext.parentSampled;
  } else if (typeof options.tracesSampleRate !== "undefined") {
    sampleRate = options.tracesSampleRate;
    transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(sampleRate));
  } else {
    sampleRate = 1;
    transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, sampleRate);
  }
  if (!isValidSampleRate(sampleRate)) {
    DEBUG_BUILD2 && logger2.warn("[Tracing] Discarding transaction because of invalid sample rate.");
    transaction.sampled = false;
    return transaction;
  }
  if (!sampleRate) {
    DEBUG_BUILD2 && logger2.log(
      `[Tracing] Discarding transaction because ${typeof options.tracesSampler === "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`
    );
    transaction.sampled = false;
    return transaction;
  }
  transaction.sampled = Math.random() < sampleRate;
  if (!transaction.sampled) {
    DEBUG_BUILD2 && logger2.log(
      `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
        sampleRate
      )})`
    );
    return transaction;
  }
  DEBUG_BUILD2 && // eslint-disable-next-line deprecation/deprecation
  logger2.log(`[Tracing] starting ${transaction.op} transaction - ${spanToJSON(transaction).description}`);
  return transaction;
}
__name(sampleTransaction, "sampleTransaction");
function isValidSampleRate(rate) {
  if (isNaN2(rate) || !(typeof rate === "number" || typeof rate === "boolean")) {
    DEBUG_BUILD2 && logger2.warn(
      `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        rate
      )} of type ${JSON.stringify(typeof rate)}.`
    );
    return false;
  }
  if (rate < 0 || rate > 1) {
    DEBUG_BUILD2 && logger2.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
    return false;
  }
  return true;
}
__name(isValidSampleRate, "isValidSampleRate");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/tracing/hubextensions.js
function traceHeaders() {
  const scope = this.getScope();
  const span = scope.getSpan();
  return span ? {
    "sentry-trace": spanToTraceHeader(span)
  } : {};
}
__name(traceHeaders, "traceHeaders");
function _startTransaction(transactionContext, customSamplingContext) {
  const client = this.getClient();
  const options = client && client.getOptions() || {};
  const configInstrumenter = options.instrumenter || "sentry";
  const transactionInstrumenter = transactionContext.instrumenter || "sentry";
  if (configInstrumenter !== transactionInstrumenter) {
    DEBUG_BUILD2 && logger2.error(
      `A transaction was started with instrumenter=\`${transactionInstrumenter}\`, but the SDK is configured with the \`${configInstrumenter}\` instrumenter.
The transaction will not be sampled. Please use the ${configInstrumenter} instrumentation to start transactions.`
    );
    transactionContext.sampled = false;
  }
  let transaction = new Transaction(transactionContext, this);
  transaction = sampleTransaction(transaction, options, {
    name: transactionContext.name,
    parentSampled: transactionContext.parentSampled,
    transactionContext,
    attributes: {
      // eslint-disable-next-line deprecation/deprecation
      ...transactionContext.data,
      ...transactionContext.attributes
    },
    ...customSamplingContext
  });
  if (transaction.isRecording()) {
    transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
  }
  if (client && client.emit) {
    client.emit("startTransaction", transaction);
  }
  return transaction;
}
__name(_startTransaction, "_startTransaction");
function addTracingExtensions() {
  const carrier = getMainCarrier();
  if (!carrier.__SENTRY__) {
    return;
  }
  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
  if (!carrier.__SENTRY__.extensions.startTransaction) {
    carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
  }
  if (!carrier.__SENTRY__.extensions.traceHeaders) {
    carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
  }
  registerErrorInstrumentation();
}
__name(addTracingExtensions, "addTracingExtensions");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/envelope.js
init_checked_fetch();
init_modules_watch_stub();
function enhanceEventWithSdkInfo(event, sdkInfo) {
  if (!sdkInfo) {
    return event;
  }
  event.sdk = event.sdk || {};
  event.sdk.name = event.sdk.name || sdkInfo.name;
  event.sdk.version = event.sdk.version || sdkInfo.version;
  event.sdk.integrations = [...event.sdk.integrations || [], ...sdkInfo.integrations || []];
  event.sdk.packages = [...event.sdk.packages || [], ...sdkInfo.packages || []];
  return event;
}
__name(enhanceEventWithSdkInfo, "enhanceEventWithSdkInfo");
function createSessionEnvelope(session, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const envelopeHeaders = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  };
  const envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
  return createEnvelope(envelopeHeaders, [envelopeItem]);
}
__name(createSessionEnvelope, "createSessionEnvelope");
function createEventEnvelope(event, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
  enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
  const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  delete event.sdkProcessingMetadata;
  const eventItem = [{ type: eventType }, event];
  return createEnvelope(envelopeHeaders, [eventItem]);
}
__name(createEventEnvelope, "createEventEnvelope");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/sessionflusher.js
init_checked_fetch();
init_modules_watch_stub();
var SessionFlusher = class {
  // Cast to any so that it can use Node.js timeout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(client, attrs) {
    this._client = client;
    this.flushTimeout = 60;
    this._pendingAggregates = {};
    this._isEnabled = true;
    this._intervalId = setInterval(() => this.flush(), this.flushTimeout * 1e3);
    if (this._intervalId.unref) {
      this._intervalId.unref();
    }
    this._sessionAttrs = attrs;
  }
  /** Checks if `pendingAggregates` has entries, and if it does flushes them by calling `sendSession` */
  flush() {
    const sessionAggregates = this.getSessionAggregates();
    if (sessionAggregates.aggregates.length === 0) {
      return;
    }
    this._pendingAggregates = {};
    this._client.sendSession(sessionAggregates);
  }
  /** Massages the entries in `pendingAggregates` and returns aggregated sessions */
  getSessionAggregates() {
    const aggregates = Object.keys(this._pendingAggregates).map((key) => {
      return this._pendingAggregates[parseInt(key)];
    });
    const sessionAggregates = {
      attrs: this._sessionAttrs,
      aggregates
    };
    return dropUndefinedKeys(sessionAggregates);
  }
  /** JSDoc */
  close() {
    clearInterval(this._intervalId);
    this._isEnabled = false;
    this.flush();
  }
  /**
   * Wrapper function for _incrementSessionStatusCount that checks if the instance of SessionFlusher is enabled then
   * fetches the session status of the request from `Scope.getRequestSession().status` on the scope and passes them to
   * `_incrementSessionStatusCount` along with the start date
   */
  incrementSessionStatusCount() {
    if (!this._isEnabled) {
      return;
    }
    const scope = getCurrentScope();
    const requestSession = scope.getRequestSession();
    if (requestSession && requestSession.status) {
      this._incrementSessionStatusCount(requestSession.status, /* @__PURE__ */ new Date());
      scope.setRequestSession(void 0);
    }
  }
  /**
   * Increments status bucket in pendingAggregates buffer (internal state) corresponding to status of
   * the session received
   */
  _incrementSessionStatusCount(status, date) {
    const sessionStartedTrunc = new Date(date).setSeconds(0, 0);
    this._pendingAggregates[sessionStartedTrunc] = this._pendingAggregates[sessionStartedTrunc] || {};
    const aggregationCounts = this._pendingAggregates[sessionStartedTrunc];
    if (!aggregationCounts.started) {
      aggregationCounts.started = new Date(sessionStartedTrunc).toISOString();
    }
    switch (status) {
      case "errored":
        aggregationCounts.errored = (aggregationCounts.errored || 0) + 1;
        return aggregationCounts.errored;
      case "ok":
        aggregationCounts.exited = (aggregationCounts.exited || 0) + 1;
        return aggregationCounts.exited;
      default:
        aggregationCounts.crashed = (aggregationCounts.crashed || 0) + 1;
        return aggregationCounts.crashed;
    }
  }
};
__name(SessionFlusher, "SessionFlusher");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/api.js
init_checked_fetch();
init_modules_watch_stub();
var SENTRY_API_VERSION = "7";
function getBaseApiEndpoint(dsn) {
  const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
  const port = dsn.port ? `:${dsn.port}` : "";
  return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
__name(getBaseApiEndpoint, "getBaseApiEndpoint");
function _getIngestEndpoint(dsn) {
  return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
__name(_getIngestEndpoint, "_getIngestEndpoint");
function _encodedAuth(dsn, sdkInfo) {
  return urlEncode({
    // We send only the minimum set of required information. See
    // https://github.com/getsentry/sentry-javascript/issues/2572.
    sentry_key: dsn.publicKey,
    sentry_version: SENTRY_API_VERSION,
    ...sdkInfo && { sentry_client: `${sdkInfo.name}/${sdkInfo.version}` }
  });
}
__name(_encodedAuth, "_encodedAuth");
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnelOrOptions = {}) {
  const tunnel = typeof tunnelOrOptions === "string" ? tunnelOrOptions : tunnelOrOptions.tunnel;
  const sdkInfo = typeof tunnelOrOptions === "string" || !tunnelOrOptions._metadata ? void 0 : tunnelOrOptions._metadata.sdk;
  return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}
__name(getEnvelopeEndpointWithUrlEncodedAuth, "getEnvelopeEndpointWithUrlEncodedAuth");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/baseclient.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/integration.js
init_checked_fetch();
init_modules_watch_stub();
var installedIntegrations = [];
function filterDuplicates(integrations) {
  const integrationsByName = {};
  integrations.forEach((currentInstance) => {
    const { name } = currentInstance;
    const existingInstance = integrationsByName[name];
    if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
      return;
    }
    integrationsByName[name] = currentInstance;
  });
  return Object.keys(integrationsByName).map((k) => integrationsByName[k]);
}
__name(filterDuplicates, "filterDuplicates");
function getIntegrationsToSetup(options) {
  const defaultIntegrations = options.defaultIntegrations || [];
  const userIntegrations = options.integrations;
  defaultIntegrations.forEach((integration) => {
    integration.isDefaultInstance = true;
  });
  let integrations;
  if (Array.isArray(userIntegrations)) {
    integrations = [...defaultIntegrations, ...userIntegrations];
  } else if (typeof userIntegrations === "function") {
    integrations = arrayify(userIntegrations(defaultIntegrations));
  } else {
    integrations = defaultIntegrations;
  }
  const finalIntegrations = filterDuplicates(integrations);
  const debugIndex = findIndex(finalIntegrations, (integration) => integration.name === "Debug");
  if (debugIndex !== -1) {
    const [debugInstance] = finalIntegrations.splice(debugIndex, 1);
    finalIntegrations.push(debugInstance);
  }
  return finalIntegrations;
}
__name(getIntegrationsToSetup, "getIntegrationsToSetup");
function setupIntegrations(client, integrations) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    if (integration) {
      setupIntegration(client, integration, integrationIndex);
    }
  });
  return integrationIndex;
}
__name(setupIntegrations, "setupIntegrations");
function afterSetupIntegrations(client, integrations) {
  for (const integration of integrations) {
    if (integration && integration.afterAllSetup) {
      integration.afterAllSetup(client);
    }
  }
}
__name(afterSetupIntegrations, "afterSetupIntegrations");
function setupIntegration(client, integration, integrationIndex) {
  if (integrationIndex[integration.name]) {
    DEBUG_BUILD2 && logger2.log(`Integration skipped because it was already installed: ${integration.name}`);
    return;
  }
  integrationIndex[integration.name] = integration;
  if (installedIntegrations.indexOf(integration.name) === -1) {
    integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
    installedIntegrations.push(integration.name);
  }
  if (integration.setup && typeof integration.setup === "function") {
    integration.setup(client);
  }
  if (client.on && typeof integration.preprocessEvent === "function") {
    const callback = integration.preprocessEvent.bind(integration);
    client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
  }
  if (client.addEventProcessor && typeof integration.processEvent === "function") {
    const callback = integration.processEvent.bind(integration);
    const processor = Object.assign((event, hint) => callback(event, hint, client), {
      id: integration.name
    });
    client.addEventProcessor(processor);
  }
  DEBUG_BUILD2 && logger2.log(`Integration installed: ${integration.name}`);
}
__name(setupIntegration, "setupIntegration");
function findIndex(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i]) === true) {
      return i;
    }
  }
  return -1;
}
__name(findIndex, "findIndex");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/envelope.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/utils.js
init_checked_fetch();
init_modules_watch_stub();
function getBucketKey(metricType, name, unit, tags) {
  const stringifiedTags = Object.entries(dropUndefinedKeys(tags)).sort((a, b) => a[0].localeCompare(b[0]));
  return `${metricType}${name}${unit}${stringifiedTags}`;
}
__name(getBucketKey, "getBucketKey");
function simpleHash(s) {
  let rv = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    rv = (rv << 5) - rv + c;
    rv &= rv;
  }
  return rv >>> 0;
}
__name(simpleHash, "simpleHash");
function serializeMetricBuckets(metricBucketItems) {
  let out = "";
  for (const item of metricBucketItems) {
    const tagEntries = Object.entries(item.tags);
    const maybeTags = tagEntries.length > 0 ? `|#${tagEntries.map(([key, value]) => `${key}:${value}`).join(",")}` : "";
    out += `${item.name}@${item.unit}:${item.metric}|${item.metricType}${maybeTags}|T${item.timestamp}
`;
  }
  return out;
}
__name(serializeMetricBuckets, "serializeMetricBuckets");
function sanitizeUnit(unit) {
  return unit.replace(/[^\w]+/gi, "_");
}
__name(sanitizeUnit, "sanitizeUnit");
function sanitizeMetricKey(key) {
  return key.replace(/[^\w\-.]+/gi, "_");
}
__name(sanitizeMetricKey, "sanitizeMetricKey");
function sanitizeTagKey(key) {
  return key.replace(/[^\w\-./]+/gi, "");
}
__name(sanitizeTagKey, "sanitizeTagKey");
var tagValueReplacements = [
  ["\n", "\\n"],
  ["\r", "\\r"],
  ["	", "\\t"],
  ["\\", "\\\\"],
  ["|", "\\u{7c}"],
  [",", "\\u{2c}"]
];
function getCharOrReplacement(input) {
  for (const [search, replacement] of tagValueReplacements) {
    if (input === search) {
      return replacement;
    }
  }
  return input;
}
__name(getCharOrReplacement, "getCharOrReplacement");
function sanitizeTagValue(value) {
  return [...value].reduce((acc, char) => acc + getCharOrReplacement(char), "");
}
__name(sanitizeTagValue, "sanitizeTagValue");
function sanitizeTags(unsanitizedTags) {
  const tags = {};
  for (const key in unsanitizedTags) {
    if (Object.prototype.hasOwnProperty.call(unsanitizedTags, key)) {
      const sanitizedKey = sanitizeTagKey(key);
      tags[sanitizedKey] = sanitizeTagValue(String(unsanitizedTags[key]));
    }
  }
  return tags;
}
__name(sanitizeTags, "sanitizeTags");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/envelope.js
function createMetricEnvelope(metricBucketItems, dsn, metadata, tunnel) {
  const headers = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (metadata && metadata.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version
    };
  }
  if (!!tunnel && dsn) {
    headers.dsn = dsnToString(dsn);
  }
  const item = createMetricEnvelopeItem(metricBucketItems);
  return createEnvelope(headers, [item]);
}
__name(createMetricEnvelope, "createMetricEnvelope");
function createMetricEnvelopeItem(metricBucketItems) {
  const payload = serializeMetricBuckets(metricBucketItems);
  const metricHeaders = {
    type: "statsd",
    length: payload.length
  };
  return [metricHeaders, payload];
}
__name(createMetricEnvelopeItem, "createMetricEnvelopeItem");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/baseclient.js
var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
var BaseClient = class {
  /**
   * A reference to a metrics aggregator
   *
   * @experimental Note this is alpha API. It may experience breaking changes in the future.
   */
  /** Options passed to the SDK. */
  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  /** Array of set up integrations. */
  /** Indicates whether this client's integrations have been set up. */
  /** Number of calls being processed */
  /** Holds flushable  */
  // eslint-disable-next-line @typescript-eslint/ban-types
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
  constructor(options) {
    this._options = options;
    this._integrations = {};
    this._integrationsInitialized = false;
    this._numProcessing = 0;
    this._outcomes = {};
    this._hooks = {};
    this._eventProcessors = [];
    if (options.dsn) {
      this._dsn = makeDsn(options.dsn);
    } else {
      DEBUG_BUILD2 && logger2.warn("No DSN provided, client will not send events.");
    }
    if (this._dsn) {
      const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
      this._transport = options.transport({
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...options.transportOptions,
        url
      });
    }
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  captureException(exception, hint, scope) {
    if (checkOrSetAlreadyCaught(exception)) {
      DEBUG_BUILD2 && logger2.log(ALREADY_SEEN_ERROR);
      return;
    }
    let eventId = hint && hint.event_id;
    this._process(
      this.eventFromException(exception, hint).then((event) => this._captureEvent(event, hint, scope)).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureMessage(message, level, hint, scope) {
    let eventId = hint && hint.event_id;
    const eventMessage = isParameterizedString(message) ? message : String(message);
    const promisedEvent = isPrimitive(message) ? this.eventFromMessage(eventMessage, level, hint) : this.eventFromException(message, hint);
    this._process(
      promisedEvent.then((event) => this._captureEvent(event, hint, scope)).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint, scope) {
    if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
      DEBUG_BUILD2 && logger2.log(ALREADY_SEEN_ERROR);
      return;
    }
    let eventId = hint && hint.event_id;
    const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
    const capturedSpanScope = sdkProcessingMetadata.capturedSpanScope;
    this._process(
      this._captureEvent(event, hint, capturedSpanScope || scope).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureSession(session) {
    if (!(typeof session.release === "string")) {
      DEBUG_BUILD2 && logger2.warn("Discarded session because of missing or non-string release");
    } else {
      this.sendSession(session);
      updateSession(session, { init: false });
    }
  }
  /**
   * @inheritDoc
   */
  getDsn() {
    return this._dsn;
  }
  /**
   * @inheritDoc
   */
  getOptions() {
    return this._options;
  }
  /**
   * @see SdkMetadata in @sentry/types
   *
   * @return The metadata of the SDK
   */
  getSdkMetadata() {
    return this._options._metadata;
  }
  /**
   * @inheritDoc
   */
  getTransport() {
    return this._transport;
  }
  /**
   * @inheritDoc
   */
  flush(timeout) {
    const transport = this._transport;
    if (transport) {
      if (this.metricsAggregator) {
        this.metricsAggregator.flush();
      }
      return this._isClientDoneProcessing(timeout).then((clientFinished) => {
        return transport.flush(timeout).then((transportFlushed) => clientFinished && transportFlushed);
      });
    } else {
      return resolvedSyncPromise(true);
    }
  }
  /**
   * @inheritDoc
   */
  close(timeout) {
    return this.flush(timeout).then((result) => {
      this.getOptions().enabled = false;
      if (this.metricsAggregator) {
        this.metricsAggregator.close();
      }
      return result;
    });
  }
  /** Get all installed event processors. */
  getEventProcessors() {
    return this._eventProcessors;
  }
  /** @inheritDoc */
  addEventProcessor(eventProcessor) {
    this._eventProcessors.push(eventProcessor);
  }
  /**
   * This is an internal function to setup all integrations that should run on the client.
   * @deprecated Use `client.init()` instead.
   */
  setupIntegrations(forceInitialize) {
    if (forceInitialize && !this._integrationsInitialized || this._isEnabled() && !this._integrationsInitialized) {
      this._setupIntegrations();
    }
  }
  /** @inheritdoc */
  init() {
    if (this._isEnabled()) {
      this._setupIntegrations();
    }
  }
  /**
   * Gets an installed integration by its `id`.
   *
   * @returns The installed integration or `undefined` if no integration with that `id` was installed.
   * @deprecated Use `getIntegrationByName()` instead.
   */
  getIntegrationById(integrationId) {
    return this.getIntegrationByName(integrationId);
  }
  /**
   * Gets an installed integration by its name.
   *
   * @returns The installed integration or `undefined` if no integration with that `name` was installed.
   */
  getIntegrationByName(integrationName) {
    return this._integrations[integrationName];
  }
  /**
   * Returns the client's instance of the given integration class, it any.
   * @deprecated Use `getIntegrationByName()` instead.
   */
  getIntegration(integration) {
    try {
      return this._integrations[integration.id] || null;
    } catch (_oO) {
      DEBUG_BUILD2 && logger2.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
      return null;
    }
  }
  /**
   * @inheritDoc
   */
  addIntegration(integration) {
    const isAlreadyInstalled = this._integrations[integration.name];
    setupIntegration(this, integration, this._integrations);
    if (!isAlreadyInstalled) {
      afterSetupIntegrations(this, [integration]);
    }
  }
  /**
   * @inheritDoc
   */
  sendEvent(event, hint = {}) {
    this.emit("beforeSendEvent", event, hint);
    let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
    for (const attachment of hint.attachments || []) {
      env = addItemToEnvelope(
        env,
        createAttachmentEnvelopeItem(
          attachment,
          this._options.transportOptions && this._options.transportOptions.textEncoder
        )
      );
    }
    const promise = this._sendEnvelope(env);
    if (promise) {
      promise.then((sendResponse) => this.emit("afterSendEvent", event, sendResponse), null);
    }
  }
  /**
   * @inheritDoc
   */
  sendSession(session) {
    const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
    this._sendEnvelope(env);
  }
  /**
   * @inheritDoc
   */
  recordDroppedEvent(reason, category, _event) {
    if (this._options.sendClientReports) {
      const key = `${reason}:${category}`;
      DEBUG_BUILD2 && logger2.log(`Adding outcome: "${key}"`);
      this._outcomes[key] = this._outcomes[key] + 1 || 1;
    }
  }
  /**
   * @inheritDoc
   */
  captureAggregateMetrics(metricBucketItems) {
    DEBUG_BUILD2 && logger2.log(`Flushing aggregated metrics, number of metrics: ${metricBucketItems.length}`);
    const metricsEnvelope = createMetricEnvelope(
      metricBucketItems,
      this._dsn,
      this._options._metadata,
      this._options.tunnel
    );
    this._sendEnvelope(metricsEnvelope);
  }
  // Keep on() & emit() signatures in sync with types' client.ts interface
  /* eslint-disable @typescript-eslint/unified-signatures */
  /** @inheritdoc */
  /** @inheritdoc */
  on(hook, callback) {
    if (!this._hooks[hook]) {
      this._hooks[hook] = [];
    }
    this._hooks[hook].push(callback);
  }
  /** @inheritdoc */
  /** @inheritdoc */
  emit(hook, ...rest) {
    if (this._hooks[hook]) {
      this._hooks[hook].forEach((callback) => callback(...rest));
    }
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  /** Setup integrations for this client. */
  _setupIntegrations() {
    const { integrations } = this._options;
    this._integrations = setupIntegrations(this, integrations);
    afterSetupIntegrations(this, integrations);
    this._integrationsInitialized = true;
  }
  /** Updates existing session based on the provided event */
  _updateSessionFromEvent(session, event) {
    let crashed = false;
    let errored = false;
    const exceptions = event.exception && event.exception.values;
    if (exceptions) {
      errored = true;
      for (const ex of exceptions) {
        const mechanism = ex.mechanism;
        if (mechanism && mechanism.handled === false) {
          crashed = true;
          break;
        }
      }
    }
    const sessionNonTerminal = session.status === "ok";
    const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
    if (shouldUpdateAndSend) {
      updateSession(session, {
        ...crashed && { status: "crashed" },
        errors: session.errors || Number(errored || crashed)
      });
      this.captureSession(session);
    }
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */
  _isClientDoneProcessing(timeout) {
    return new SyncPromise((resolve2) => {
      let ticked = 0;
      const tick = 1;
      const interval = setInterval(() => {
        if (this._numProcessing == 0) {
          clearInterval(interval);
          resolve2(true);
        } else {
          ticked += tick;
          if (timeout && ticked >= timeout) {
            clearInterval(interval);
            resolve2(false);
          }
        }
      }, tick);
    });
  }
  /** Determines whether this SDK is enabled and a transport is present. */
  _isEnabled() {
    return this.getOptions().enabled !== false && this._transport !== void 0;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A new event with more information.
   */
  _prepareEvent(event, hint, scope, isolationScope = getIsolationScope()) {
    const options = this.getOptions();
    const integrations = Object.keys(this._integrations);
    if (!hint.integrations && integrations.length > 0) {
      hint.integrations = integrations;
    }
    this.emit("preprocessEvent", event, hint);
    return prepareEvent(options, event, hint, scope, this, isolationScope).then((evt) => {
      if (evt === null) {
        return evt;
      }
      const propagationContext = {
        ...isolationScope.getPropagationContext(),
        ...scope ? scope.getPropagationContext() : void 0
      };
      const trace = evt.contexts && evt.contexts.trace;
      if (!trace && propagationContext) {
        const { traceId: trace_id, spanId, parentSpanId, dsc } = propagationContext;
        evt.contexts = {
          trace: {
            trace_id,
            span_id: spanId,
            parent_span_id: parentSpanId
          },
          ...evt.contexts
        };
        const dynamicSamplingContext = dsc ? dsc : getDynamicSamplingContextFromClient(trace_id, this, scope);
        evt.sdkProcessingMetadata = {
          dynamicSamplingContext,
          ...evt.sdkProcessingMetadata
        };
      }
      return evt;
    });
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */
  _captureEvent(event, hint = {}, scope) {
    return this._processEvent(event, hint, scope).then(
      (finalEvent) => {
        return finalEvent.event_id;
      },
      (reason) => {
        if (DEBUG_BUILD2) {
          const sentryError = reason;
          if (sentryError.logLevel === "log") {
            logger2.log(sentryError.message);
          } else {
            logger2.warn(sentryError);
          }
        }
        return void 0;
      }
    );
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
  _processEvent(event, hint, scope) {
    const options = this.getOptions();
    const { sampleRate } = options;
    const isTransaction = isTransactionEvent(event);
    const isError2 = isErrorEvent2(event);
    const eventType = event.type || "error";
    const beforeSendLabel = `before send for type \`${eventType}\``;
    if (isError2 && typeof sampleRate === "number" && Math.random() > sampleRate) {
      this.recordDroppedEvent("sample_rate", "error", event);
      return rejectedSyncPromise(
        new SentryError(
          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
          "log"
        )
      );
    }
    const dataCategory = eventType === "replay_event" ? "replay" : eventType;
    const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
    const capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope;
    return this._prepareEvent(event, hint, scope, capturedSpanIsolationScope).then((prepared) => {
      if (prepared === null) {
        this.recordDroppedEvent("event_processor", dataCategory, event);
        throw new SentryError("An event processor returned `null`, will not send event.", "log");
      }
      const isInternalException = hint.data && hint.data.__sentry__ === true;
      if (isInternalException) {
        return prepared;
      }
      const result = processBeforeSend(options, prepared, hint);
      return _validateBeforeSendResult(result, beforeSendLabel);
    }).then((processedEvent) => {
      if (processedEvent === null) {
        this.recordDroppedEvent("before_send", dataCategory, event);
        throw new SentryError(`${beforeSendLabel} returned \`null\`, will not send event.`, "log");
      }
      const session = scope && scope.getSession();
      if (!isTransaction && session) {
        this._updateSessionFromEvent(session, processedEvent);
      }
      const transactionInfo = processedEvent.transaction_info;
      if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
        const source = "custom";
        processedEvent.transaction_info = {
          ...transactionInfo,
          source
        };
      }
      this.sendEvent(processedEvent, hint);
      return processedEvent;
    }).then(null, (reason) => {
      if (reason instanceof SentryError) {
        throw reason;
      }
      this.captureException(reason, {
        data: {
          __sentry__: true
        },
        originalException: reason
      });
      throw new SentryError(
        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`
      );
    });
  }
  /**
   * Occupies the client with processing and event
   */
  _process(promise) {
    this._numProcessing++;
    void promise.then(
      (value) => {
        this._numProcessing--;
        return value;
      },
      (reason) => {
        this._numProcessing--;
        return reason;
      }
    );
  }
  /**
   * @inheritdoc
   */
  _sendEnvelope(envelope) {
    this.emit("beforeEnvelope", envelope);
    if (this._isEnabled() && this._transport) {
      return this._transport.send(envelope).then(null, (reason) => {
        DEBUG_BUILD2 && logger2.error("Error while sending event:", reason);
      });
    } else {
      DEBUG_BUILD2 && logger2.error("Transport disabled");
    }
  }
  /**
   * Clears outcomes on this client and returns them.
   */
  _clearOutcomes() {
    const outcomes = this._outcomes;
    this._outcomes = {};
    return Object.keys(outcomes).map((key) => {
      const [reason, category] = key.split(":");
      return {
        reason,
        category,
        quantity: outcomes[key]
      };
    });
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
};
__name(BaseClient, "BaseClient");
function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
  const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
  if (isThenable(beforeSendResult)) {
    return beforeSendResult.then(
      (event) => {
        if (!isPlainObject(event) && event !== null) {
          throw new SentryError(invalidValueError);
        }
        return event;
      },
      (e) => {
        throw new SentryError(`${beforeSendLabel} rejected with ${e}`);
      }
    );
  } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
    throw new SentryError(invalidValueError);
  }
  return beforeSendResult;
}
__name(_validateBeforeSendResult, "_validateBeforeSendResult");
function processBeforeSend(options, event, hint) {
  const { beforeSend, beforeSendTransaction } = options;
  if (isErrorEvent2(event) && beforeSend) {
    return beforeSend(event, hint);
  }
  if (isTransactionEvent(event) && beforeSendTransaction) {
    return beforeSendTransaction(event, hint);
  }
  return event;
}
__name(processBeforeSend, "processBeforeSend");
function isErrorEvent2(event) {
  return event.type === void 0;
}
__name(isErrorEvent2, "isErrorEvent");
function isTransactionEvent(event) {
  return event.type === "transaction";
}
__name(isTransactionEvent, "isTransactionEvent");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/server-runtime-client.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/checkin.js
init_checked_fetch();
init_modules_watch_stub();
function createCheckInEnvelope(checkIn, dynamicSamplingContext, metadata, tunnel, dsn) {
  const headers = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (metadata && metadata.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version
    };
  }
  if (!!tunnel && !!dsn) {
    headers.dsn = dsnToString(dsn);
  }
  if (dynamicSamplingContext) {
    headers.trace = dropUndefinedKeys(dynamicSamplingContext);
  }
  const item = createCheckInEnvelopeItem(checkIn);
  return createEnvelope(headers, [item]);
}
__name(createCheckInEnvelope, "createCheckInEnvelope");
function createCheckInEnvelopeItem(checkIn) {
  const checkInHeaders = {
    type: "check_in"
  };
  return [checkInHeaders, checkIn];
}
__name(createCheckInEnvelopeItem, "createCheckInEnvelopeItem");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/aggregator.js
init_checked_fetch();
init_modules_watch_stub();

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/constants.js
init_checked_fetch();
init_modules_watch_stub();
var COUNTER_METRIC_TYPE = "c";
var GAUGE_METRIC_TYPE = "g";
var SET_METRIC_TYPE = "s";
var DISTRIBUTION_METRIC_TYPE = "d";
var DEFAULT_FLUSH_INTERVAL = 1e4;
var MAX_WEIGHT = 1e4;

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/instance.js
init_checked_fetch();
init_modules_watch_stub();
var CounterMetric = class {
  constructor(_value) {
    this._value = _value;
  }
  /** @inheritDoc */
  get weight() {
    return 1;
  }
  /** @inheritdoc */
  add(value) {
    this._value += value;
  }
  /** @inheritdoc */
  toString() {
    return `${this._value}`;
  }
};
__name(CounterMetric, "CounterMetric");
var GaugeMetric = class {
  constructor(value) {
    this._last = value;
    this._min = value;
    this._max = value;
    this._sum = value;
    this._count = 1;
  }
  /** @inheritDoc */
  get weight() {
    return 5;
  }
  /** @inheritdoc */
  add(value) {
    this._last = value;
    if (value < this._min) {
      this._min = value;
    }
    if (value > this._max) {
      this._max = value;
    }
    this._sum += value;
    this._count++;
  }
  /** @inheritdoc */
  toString() {
    return `${this._last}:${this._min}:${this._max}:${this._sum}:${this._count}`;
  }
};
__name(GaugeMetric, "GaugeMetric");
var DistributionMetric = class {
  constructor(first) {
    this._value = [first];
  }
  /** @inheritDoc */
  get weight() {
    return this._value.length;
  }
  /** @inheritdoc */
  add(value) {
    this._value.push(value);
  }
  /** @inheritdoc */
  toString() {
    return this._value.join(":");
  }
};
__name(DistributionMetric, "DistributionMetric");
var SetMetric = class {
  constructor(first) {
    this.first = first;
    this._value = /* @__PURE__ */ new Set([first]);
  }
  /** @inheritDoc */
  get weight() {
    return this._value.size;
  }
  /** @inheritdoc */
  add(value) {
    this._value.add(value);
  }
  /** @inheritdoc */
  toString() {
    return Array.from(this._value).map((val) => typeof val === "string" ? simpleHash(val) : val).join(":");
  }
};
__name(SetMetric, "SetMetric");
var METRIC_MAP = {
  [COUNTER_METRIC_TYPE]: CounterMetric,
  [GAUGE_METRIC_TYPE]: GaugeMetric,
  [DISTRIBUTION_METRIC_TYPE]: DistributionMetric,
  [SET_METRIC_TYPE]: SetMetric
};

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/metrics/aggregator.js
var MetricsAggregator = class {
  // TODO(@anonrig): Use FinalizationRegistry to have a proper way of flushing the buckets
  // when the aggregator is garbage collected.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
  // Different metrics have different weights. We use this to limit the number of metrics
  // that we store in memory.
  // Cast to any so that it can use Node.js timeout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // SDKs are required to shift the flush interval by random() * rollup_in_seconds.
  // That shift is determined once per startup to create jittering.
  // An SDK is required to perform force flushing ahead of scheduled time if the memory
  // pressure is too high. There is no rule for this other than that SDKs should be tracking
  // abstract aggregation complexity (eg: a counter only carries a single float, whereas a
  // distribution is a float per emission).
  //
  // Force flush is used on either shutdown, flush() or when we exceed the max weight.
  constructor(_client) {
    this._client = _client;
    this._buckets = /* @__PURE__ */ new Map();
    this._bucketsTotalWeight = 0;
    this._interval = setInterval(() => this._flush(), DEFAULT_FLUSH_INTERVAL);
    if (this._interval.unref) {
      this._interval.unref();
    }
    this._flushShift = Math.floor(Math.random() * DEFAULT_FLUSH_INTERVAL / 1e3);
    this._forceFlush = false;
  }
  /**
   * @inheritDoc
   */
  add(metricType, unsanitizedName, value, unsanitizedUnit = "none", unsanitizedTags = {}, maybeFloatTimestamp = timestampInSeconds()) {
    const timestamp = Math.floor(maybeFloatTimestamp);
    const name = sanitizeMetricKey(unsanitizedName);
    const tags = sanitizeTags(unsanitizedTags);
    const unit = sanitizeUnit(unsanitizedUnit);
    const bucketKey = getBucketKey(metricType, name, unit, tags);
    let bucketItem = this._buckets.get(bucketKey);
    const previousWeight = bucketItem && metricType === SET_METRIC_TYPE ? bucketItem.metric.weight : 0;
    if (bucketItem) {
      bucketItem.metric.add(value);
      if (bucketItem.timestamp < timestamp) {
        bucketItem.timestamp = timestamp;
      }
    } else {
      bucketItem = {
        // @ts-expect-error we don't need to narrow down the type of value here, saves bundle size.
        metric: new METRIC_MAP[metricType](value),
        timestamp,
        metricType,
        name,
        unit,
        tags
      };
      this._buckets.set(bucketKey, bucketItem);
    }
    const val = typeof value === "string" ? bucketItem.metric.weight - previousWeight : value;
    updateMetricSummaryOnActiveSpan(metricType, name, val, unit, unsanitizedTags, bucketKey);
    this._bucketsTotalWeight += bucketItem.metric.weight;
    if (this._bucketsTotalWeight >= MAX_WEIGHT) {
      this.flush();
    }
  }
  /**
   * Flushes the current metrics to the transport via the transport.
   */
  flush() {
    this._forceFlush = true;
    this._flush();
  }
  /**
   * Shuts down metrics aggregator and clears all metrics.
   */
  close() {
    this._forceFlush = true;
    clearInterval(this._interval);
    this._flush();
  }
  /**
   * Flushes the buckets according to the internal state of the aggregator.
   * If it is a force flush, which happens on shutdown, it will flush all buckets.
   * Otherwise, it will only flush buckets that are older than the flush interval,
   * and according to the flush shift.
   *
   * This function mutates `_forceFlush` and `_bucketsTotalWeight` properties.
   */
  _flush() {
    if (this._forceFlush) {
      this._forceFlush = false;
      this._bucketsTotalWeight = 0;
      this._captureMetrics(this._buckets);
      this._buckets.clear();
      return;
    }
    const cutoffSeconds = Math.floor(timestampInSeconds()) - DEFAULT_FLUSH_INTERVAL / 1e3 - this._flushShift;
    const flushedBuckets = /* @__PURE__ */ new Map();
    for (const [key, bucket] of this._buckets) {
      if (bucket.timestamp <= cutoffSeconds) {
        flushedBuckets.set(key, bucket);
        this._bucketsTotalWeight -= bucket.metric.weight;
      }
    }
    for (const [key] of flushedBuckets) {
      this._buckets.delete(key);
    }
    this._captureMetrics(flushedBuckets);
  }
  /**
   * Only captures a subset of the buckets passed to this function.
   * @param flushedBuckets
   */
  _captureMetrics(flushedBuckets) {
    if (flushedBuckets.size > 0 && this._client.captureAggregateMetrics) {
      const buckets = Array.from(flushedBuckets).map(([, bucketItem]) => bucketItem);
      this._client.captureAggregateMetrics(buckets);
    }
  }
};
__name(MetricsAggregator, "MetricsAggregator");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/server-runtime-client.js
var ServerRuntimeClient = class extends BaseClient {
  /**
   * Creates a new Edge SDK instance.
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    addTracingExtensions();
    super(options);
    if (options._experiments && options._experiments["metricsAggregator"]) {
      this.metricsAggregator = new MetricsAggregator(this);
    }
  }
  /**
   * @inheritDoc
   */
  eventFromException(exception, hint) {
    return resolvedSyncPromise(eventFromUnknownInput(getClient(), this._options.stackParser, exception, hint));
  }
  /**
   * @inheritDoc
   */
  eventFromMessage(message, level = "info", hint) {
    return resolvedSyncPromise(
      eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace)
    );
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  captureException(exception, hint, scope) {
    if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
      const requestSession = scope.getRequestSession();
      if (requestSession && requestSession.status === "ok") {
        requestSession.status = "errored";
      }
    }
    return super.captureException(exception, hint, scope);
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint, scope) {
    if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
      const eventType = event.type || "exception";
      const isException = eventType === "exception" && event.exception && event.exception.values && event.exception.values.length > 0;
      if (isException) {
        const requestSession = scope.getRequestSession();
        if (requestSession && requestSession.status === "ok") {
          requestSession.status = "errored";
        }
      }
    }
    return super.captureEvent(event, hint, scope);
  }
  /**
   *
   * @inheritdoc
   */
  close(timeout) {
    if (this._sessionFlusher) {
      this._sessionFlusher.close();
    }
    return super.close(timeout);
  }
  /** Method that initialises an instance of SessionFlusher on Client */
  initSessionFlusher() {
    const { release, environment } = this._options;
    if (!release) {
      DEBUG_BUILD2 && logger2.warn("Cannot initialise an instance of SessionFlusher if no release is provided!");
    } else {
      this._sessionFlusher = new SessionFlusher(this, {
        release,
        environment
      });
    }
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */
  captureCheckIn(checkIn, monitorConfig, scope) {
    const id = "checkInId" in checkIn && checkIn.checkInId ? checkIn.checkInId : uuid4();
    if (!this._isEnabled()) {
      DEBUG_BUILD2 && logger2.warn("SDK not enabled, will not capture checkin.");
      return id;
    }
    const options = this.getOptions();
    const { release, environment, tunnel } = options;
    const serializedCheckIn = {
      check_in_id: id,
      monitor_slug: checkIn.monitorSlug,
      status: checkIn.status,
      release,
      environment
    };
    if ("duration" in checkIn) {
      serializedCheckIn.duration = checkIn.duration;
    }
    if (monitorConfig) {
      serializedCheckIn.monitor_config = {
        schedule: monitorConfig.schedule,
        checkin_margin: monitorConfig.checkinMargin,
        max_runtime: monitorConfig.maxRuntime,
        timezone: monitorConfig.timezone
      };
    }
    const [dynamicSamplingContext, traceContext] = this._getTraceInfoFromScope(scope);
    if (traceContext) {
      serializedCheckIn.contexts = {
        trace: traceContext
      };
    }
    const envelope = createCheckInEnvelope(
      serializedCheckIn,
      dynamicSamplingContext,
      this.getSdkMetadata(),
      tunnel,
      this.getDsn()
    );
    DEBUG_BUILD2 && logger2.info("Sending checkin:", checkIn.monitorSlug, checkIn.status);
    this._sendEnvelope(envelope);
    return id;
  }
  /**
   * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
   * appropriate session aggregates bucket
   */
  _captureRequestSession() {
    if (!this._sessionFlusher) {
      DEBUG_BUILD2 && logger2.warn("Discarded request mode session because autoSessionTracking option was disabled");
    } else {
      this._sessionFlusher.incrementSessionStatusCount();
    }
  }
  /**
   * @inheritDoc
   */
  _prepareEvent(event, hint, scope, isolationScope) {
    if (this._options.platform) {
      event.platform = event.platform || this._options.platform;
    }
    if (this._options.runtime) {
      event.contexts = {
        ...event.contexts,
        runtime: (event.contexts || {}).runtime || this._options.runtime
      };
    }
    if (this._options.serverName) {
      event.server_name = event.server_name || this._options.serverName;
    }
    return super._prepareEvent(event, hint, scope, isolationScope);
  }
  /** Extract trace information from scope */
  _getTraceInfoFromScope(scope) {
    if (!scope) {
      return [void 0, void 0];
    }
    const span = scope.getSpan();
    if (span) {
      const samplingContext = getRootSpan(span) ? getDynamicSamplingContextFromSpan(span) : void 0;
      return [samplingContext, spanToTraceContext(span)];
    }
    const { traceId, spanId, parentSpanId, dsc } = scope.getPropagationContext();
    const traceContext = {
      trace_id: traceId,
      span_id: spanId,
      parent_span_id: parentSpanId
    };
    if (dsc) {
      return [dsc, traceContext];
    }
    return [getDynamicSamplingContextFromClient(traceId, this, scope), traceContext];
  }
};
__name(ServerRuntimeClient, "ServerRuntimeClient");

// ../node_modules/.pnpm/@sentry+core@7.112.2/node_modules/@sentry/core/esm/transports/base.js
init_checked_fetch();
init_modules_watch_stub();
var DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
function createTransport(options, makeRequest, buffer = makePromiseBuffer(
  options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE
)) {
  let rateLimits = {};
  const flush = /* @__PURE__ */ __name((timeout) => buffer.drain(timeout), "flush");
  function send(envelope) {
    const filteredEnvelopeItems = [];
    forEachEnvelopeItem(envelope, (item, type) => {
      const dataCategory = envelopeItemTypeToDataCategory(type);
      if (isRateLimited(rateLimits, dataCategory)) {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent("ratelimit_backoff", dataCategory, event);
      } else {
        filteredEnvelopeItems.push(item);
      }
    });
    if (filteredEnvelopeItems.length === 0) {
      return resolvedSyncPromise();
    }
    const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
    const recordEnvelopeLoss = /* @__PURE__ */ __name((reason) => {
      forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
      });
    }, "recordEnvelopeLoss");
    const requestTask = /* @__PURE__ */ __name(() => makeRequest({ body: serializeEnvelope(filteredEnvelope, options.textEncoder) }).then(
      (response) => {
        if (response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300)) {
          DEBUG_BUILD2 && logger2.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
        }
        rateLimits = updateRateLimits(rateLimits, response);
        return response;
      },
      (error) => {
        recordEnvelopeLoss("network_error");
        throw error;
      }
    ), "requestTask");
    return buffer.add(requestTask).then(
      (result) => result,
      (error) => {
        if (error instanceof SentryError) {
          DEBUG_BUILD2 && logger2.error("Skipped sending event because buffer is full.");
          recordEnvelopeLoss("queue_overflow");
          return resolvedSyncPromise();
        } else {
          throw error;
        }
      }
    );
  }
  __name(send, "send");
  send.__sentry__baseTransport__ = true;
  return {
    send,
    flush
  };
}
__name(createTransport, "createTransport");
function getEventForEnvelopeItem(item, type) {
  if (type !== "event" && type !== "transaction") {
    return void 0;
  }
  return Array.isArray(item) ? item[1] : void 0;
}
__name(getEventForEnvelopeItem, "getEventForEnvelopeItem");

// ../node_modules/.pnpm/toucan-js@3.4.0/node_modules/toucan-js/dist/index.esm.js
function isObject(value) {
  return typeof value === "object" && value !== null;
}
__name(isObject, "isObject");
function isMechanism(value) {
  return isObject(value) && "handled" in value && typeof value.handled === "boolean" && "type" in value && typeof value.type === "string";
}
__name(isMechanism, "isMechanism");
function containsMechanism(value) {
  return isObject(value) && "mechanism" in value && isMechanism(value["mechanism"]);
}
__name(containsMechanism, "containsMechanism");
function getSentryRelease() {
  if (GLOBAL_OBJ.SENTRY_RELEASE && GLOBAL_OBJ.SENTRY_RELEASE.id) {
    return GLOBAL_OBJ.SENTRY_RELEASE.id;
  }
}
__name(getSentryRelease, "getSentryRelease");
function setOnOptional(target, entry) {
  if (target !== void 0) {
    target[entry[0]] = entry[1];
    return target;
  } else {
    return { [entry[0]]: entry[1] };
  }
}
__name(setOnOptional, "setOnOptional");
function parseStackFrames2(stackParser, error) {
  return stackParser(error.stack || "", 1);
}
__name(parseStackFrames2, "parseStackFrames");
function extractMessage(ex) {
  const message = ex && ex.message;
  if (!message) {
    return "No error message";
  }
  if (message.error && typeof message.error.message === "string") {
    return message.error.message;
  }
  return message;
}
__name(extractMessage, "extractMessage");
function exceptionFromError2(stackParser, error) {
  const exception = {
    type: error.name || error.constructor.name,
    value: extractMessage(error)
  };
  const frames = parseStackFrames2(stackParser, error);
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  if (exception.type === void 0 && exception.value === "") {
    exception.value = "Unrecoverable error caught";
  }
  return exception;
}
__name(exceptionFromError2, "exceptionFromError");
function eventFromUnknownInput2(sdk, stackParser, exception, hint) {
  let ex;
  const providedMechanism = hint && hint.data && containsMechanism(hint.data) ? hint.data.mechanism : void 0;
  const mechanism = providedMechanism ?? {
    handled: true,
    type: "generic"
  };
  if (!isError(exception)) {
    if (isPlainObject(exception)) {
      const message = `Non-Error exception captured with keys: ${extractExceptionKeysForMessage(exception)}`;
      const client = sdk?.getClient();
      const normalizeDepth = client && client.getOptions().normalizeDepth;
      sdk?.configureScope((scope) => {
        scope.setExtra("__serialized__", normalizeToSize(exception, normalizeDepth));
      });
      ex = hint && hint.syntheticException || new Error(message);
      ex.message = message;
    } else {
      ex = hint && hint.syntheticException || new Error(exception);
      ex.message = exception;
    }
    mechanism.synthetic = true;
  } else {
    ex = exception;
  }
  const event = {
    exception: {
      values: [exceptionFromError2(stackParser, ex)]
    }
  };
  addExceptionTypeValue(event, void 0, void 0);
  addExceptionMechanism(event, mechanism);
  return {
    ...event,
    event_id: hint && hint.event_id
  };
}
__name(eventFromUnknownInput2, "eventFromUnknownInput");
function eventFromMessage2(stackParser, message, level = "info", hint, attachStacktrace) {
  const event = {
    event_id: hint && hint.event_id,
    level,
    message
  };
  if (attachStacktrace && hint && hint.syntheticException) {
    const frames = parseStackFrames2(stackParser, hint.syntheticException);
    if (frames.length) {
      event.exception = {
        values: [
          {
            value: message,
            stacktrace: { frames }
          }
        ]
      };
    }
  }
  return event;
}
__name(eventFromMessage2, "eventFromMessage");
var DEFAULT_LIMIT = 5;
var _LinkedErrors = class {
  name = _LinkedErrors.id;
  limit;
  constructor(options = {}) {
    this.limit = options.limit || DEFAULT_LIMIT;
  }
  setupOnce(addGlobalEventProcessor2, getCurrentHub2) {
    const client = getCurrentHub2().getClient();
    if (!client) {
      return;
    }
    addGlobalEventProcessor2((event, hint) => {
      const self2 = getCurrentHub2().getIntegration(_LinkedErrors);
      if (!self2) {
        return event;
      }
      return handler(client.getOptions().stackParser, self2.limit, event, hint);
    });
  }
};
var LinkedErrors = _LinkedErrors;
__name(LinkedErrors, "LinkedErrors");
__publicField(LinkedErrors, "id", "LinkedErrors");
function handler(parser, limit, event, hint) {
  if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
    return event;
  }
  const linkedErrors = walkErrorTree(parser, limit, hint.originalException);
  event.exception.values = [...linkedErrors, ...event.exception.values];
  return event;
}
__name(handler, "handler");
function walkErrorTree(parser, limit, error, stack = []) {
  if (!isInstanceOf(error.cause, Error) || stack.length + 1 >= limit) {
    return stack;
  }
  const exception = exceptionFromError2(parser, error.cause);
  return walkErrorTree(parser, limit, error.cause, [
    exception,
    ...stack
  ]);
}
__name(walkErrorTree, "walkErrorTree");
var defaultRequestDataOptions = {
  allowedHeaders: ["CF-RAY", "CF-Worker"]
};
var _options;
var _RequestData = class {
  constructor(options = {}) {
    __publicField(this, "name", _RequestData.id);
    __privateAdd(this, _options, void 0);
    __privateSet(this, _options, { ...defaultRequestDataOptions, ...options });
  }
  setupOnce(addGlobalEventProcessor2, getCurrentHub2) {
    const client = getCurrentHub2().getClient();
    if (!client) {
      return;
    }
    addGlobalEventProcessor2((event) => {
      const { sdkProcessingMetadata } = event;
      const self2 = getCurrentHub2().getIntegration(_RequestData);
      if (!self2 || !sdkProcessingMetadata) {
        return event;
      }
      if ("request" in sdkProcessingMetadata && sdkProcessingMetadata.request instanceof Request) {
        event.request = toEventRequest(sdkProcessingMetadata.request, __privateGet(this, _options));
        event.user = toEventUser(event.user ?? {}, sdkProcessingMetadata.request, __privateGet(this, _options));
      }
      if ("requestData" in sdkProcessingMetadata) {
        if (event.request) {
          event.request.data = sdkProcessingMetadata.requestData;
        } else {
          event.request = {
            data: sdkProcessingMetadata.requestData
          };
        }
      }
      return event;
    });
  }
};
var RequestData = _RequestData;
__name(RequestData, "RequestData");
_options = new WeakMap();
__publicField(RequestData, "id", "RequestData");
function toEventUser(user, request, options) {
  const ip_address = request.headers.get("CF-Connecting-IP");
  const { allowedIps } = options;
  const newUser = { ...user };
  if (!("ip_address" in user) && // If ip_address is already set from explicitly called setUser, we don't want to overwrite it
  ip_address && allowedIps !== void 0 && testAllowlist(ip_address, allowedIps)) {
    newUser.ip_address = ip_address;
  }
  return Object.keys(newUser).length > 0 ? newUser : void 0;
}
__name(toEventUser, "toEventUser");
function toEventRequest(request, options) {
  const cookieString = request.headers.get("cookie");
  let cookies = void 0;
  if (cookieString) {
    try {
      cookies = parseCookie(cookieString);
    } catch (e) {
    }
  }
  const headers = {};
  for (const [k, v] of request.headers.entries()) {
    if (k !== "cookie") {
      headers[k] = v;
    }
  }
  const eventRequest = {
    method: request.method,
    cookies,
    headers
  };
  try {
    const url = new URL(request.url);
    eventRequest.url = `${url.protocol}//${url.hostname}${url.pathname}`;
    eventRequest.query_string = url.search;
  } catch (e) {
    const qi = request.url.indexOf("?");
    if (qi < 0) {
      eventRequest.url = request.url;
    } else {
      eventRequest.url = request.url.substr(0, qi);
      eventRequest.query_string = request.url.substr(qi + 1);
    }
  }
  const { allowedHeaders, allowedCookies, allowedSearchParams } = options;
  if (allowedHeaders !== void 0 && eventRequest.headers) {
    eventRequest.headers = applyAllowlistToObject(eventRequest.headers, allowedHeaders);
    if (Object.keys(eventRequest.headers).length === 0) {
      delete eventRequest.headers;
    }
  } else {
    delete eventRequest.headers;
  }
  if (allowedCookies !== void 0 && eventRequest.cookies) {
    eventRequest.cookies = applyAllowlistToObject(eventRequest.cookies, allowedCookies);
    if (Object.keys(eventRequest.cookies).length === 0) {
      delete eventRequest.cookies;
    }
  } else {
    delete eventRequest.cookies;
  }
  if (allowedSearchParams !== void 0) {
    const params = Object.fromEntries(new URLSearchParams(eventRequest.query_string));
    const allowedParams = new URLSearchParams();
    Object.keys(applyAllowlistToObject(params, allowedSearchParams)).forEach((allowedKey) => {
      allowedParams.set(allowedKey, params[allowedKey]);
    });
    eventRequest.query_string = allowedParams.toString();
  } else {
    delete eventRequest.query_string;
  }
  return eventRequest;
}
__name(toEventRequest, "toEventRequest");
function testAllowlist(target, allowlist) {
  if (typeof allowlist === "boolean") {
    return allowlist;
  } else if (allowlist instanceof RegExp) {
    return allowlist.test(target);
  } else if (Array.isArray(allowlist)) {
    const allowlistLowercased = allowlist.map((item) => item.toLowerCase());
    return allowlistLowercased.includes(target);
  } else {
    return false;
  }
}
__name(testAllowlist, "testAllowlist");
function applyAllowlistToObject(target, allowlist) {
  let predicate = /* @__PURE__ */ __name(() => false, "predicate");
  if (typeof allowlist === "boolean") {
    return allowlist ? target : {};
  } else if (allowlist instanceof RegExp) {
    predicate = /* @__PURE__ */ __name((item) => allowlist.test(item), "predicate");
  } else if (Array.isArray(allowlist)) {
    const allowlistLowercased = allowlist.map((item) => item.toLowerCase());
    predicate = /* @__PURE__ */ __name((item) => allowlistLowercased.includes(item.toLowerCase()), "predicate");
  } else {
    return {};
  }
  return Object.keys(target).filter(predicate).reduce((allowed, key) => {
    allowed[key] = target[key];
    return allowed;
  }, {});
}
__name(applyAllowlistToObject, "applyAllowlistToObject");
function parseCookie(cookieString) {
  if (typeof cookieString !== "string") {
    return {};
  }
  try {
    return cookieString.split(";").map((part) => part.split("=")).reduce((acc, [cookieKey, cookieValue]) => {
      acc[decodeURIComponent(cookieKey.trim())] = decodeURIComponent(cookieValue.trim());
      return acc;
    }, {});
  } catch {
    return {};
  }
}
__name(parseCookie, "parseCookie");
function setupIntegrations2(integrations, sdk) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    integrationIndex[integration.name] = integration;
    integration.setupOnce((callback) => {
      sdk.getScope()?.addEventProcessor(callback);
    }, () => sdk);
  });
  return integrationIndex;
}
__name(setupIntegrations2, "setupIntegrations");
var ToucanClient = class extends ServerRuntimeClient {
  /**
   * Some functions need to access the Hub (Toucan instance) this client is bound to,
   * but calling 'getCurrentHub()' is unsafe because it uses globals.
   * So we store a reference to the Hub after binding to it and provide it to methods that need it.
   */
  #sdk = null;
  /**
   * Creates a new Toucan SDK instance.
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    options._metadata = options._metadata || {};
    options._metadata.sdk = options._metadata.sdk || {
      name: "toucan-js",
      packages: [
        {
          name: "npm:toucan-js",
          version: "3.4.0"
        }
      ],
      version: "3.4.0"
    };
    super(options);
  }
  /**
   * By default, integrations are stored in a global. We want to store them in a local instance because they may have contextual data, such as event request.
   */
  setupIntegrations() {
    if (this._isEnabled() && !this._integrationsInitialized && this.#sdk) {
      this._integrations = setupIntegrations2(this._options.integrations, this.#sdk);
      this._integrationsInitialized = true;
    }
  }
  eventFromException(exception, hint) {
    return resolvedSyncPromise(eventFromUnknownInput2(this.#sdk, this._options.stackParser, exception, hint));
  }
  eventFromMessage(message, level = "info", hint) {
    return resolvedSyncPromise(eventFromMessage2(this._options.stackParser, message, level, hint, this._options.attachStacktrace));
  }
  _prepareEvent(event, hint, scope) {
    event.platform = event.platform || "javascript";
    if (this.getOptions().request) {
      event.sdkProcessingMetadata = setOnOptional(event.sdkProcessingMetadata, [
        "request",
        this.getOptions().request
      ]);
    }
    if (this.getOptions().requestData) {
      event.sdkProcessingMetadata = setOnOptional(event.sdkProcessingMetadata, [
        "requestData",
        this.getOptions().requestData
      ]);
    }
    return super._prepareEvent(event, hint, scope);
  }
  getSdk() {
    return this.#sdk;
  }
  setSdk(sdk) {
    this.#sdk = sdk;
  }
  /**
   * Sets the request body context on all future events.
   *
   * @param body Request body.
   * @example
   * const body = await request.text();
   * toucan.setRequestBody(body);
   */
  setRequestBody(body) {
    this.getOptions().requestData = body;
  }
  /**
   * Enable/disable the SDK.
   *
   * @param enabled
   */
  setEnabled(enabled) {
    this.getOptions().enabled = enabled;
  }
};
__name(ToucanClient, "ToucanClient");
function workersStackLineParser(getModule2) {
  const [arg1, arg2] = nodeStackLineParser(getModule2);
  const fn = /* @__PURE__ */ __name((line) => {
    const result = arg2(line);
    if (result) {
      const filename = result.filename;
      result.abs_path = filename !== void 0 && !filename.startsWith("/") ? `/${filename}` : filename;
      result.in_app = filename !== void 0;
    }
    return result;
  }, "fn");
  return [arg1, fn];
}
__name(workersStackLineParser, "workersStackLineParser");
function getModule(filename) {
  if (!filename) {
    return;
  }
  return basename(filename, ".js");
}
__name(getModule, "getModule");
var defaultStackParser = createStackParser(workersStackLineParser(getModule));
function makeFetchTransport(options) {
  function makeRequest({ body }) {
    try {
      const fetchFn = options.fetcher ?? fetch;
      const request = fetchFn(options.url, {
        method: "POST",
        headers: options.headers,
        body
      }).then((response) => {
        return {
          statusCode: response.status,
          headers: {
            "retry-after": response.headers.get("Retry-After"),
            "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits")
          }
        };
      });
      if (options.context) {
        options.context.waitUntil(request);
      }
      return request;
    } catch (e) {
      return rejectedSyncPromise(e);
    }
  }
  __name(makeRequest, "makeRequest");
  return createTransport(options, makeRequest);
}
__name(makeFetchTransport, "makeFetchTransport");
var Toucan = class extends Hub {
  constructor(options) {
    options.defaultIntegrations = options.defaultIntegrations === false ? [] : [
      ...Array.isArray(options.defaultIntegrations) ? options.defaultIntegrations : [
        new RequestData(options.requestDataOptions),
        new LinkedErrors()
      ]
    ];
    if (options.release === void 0) {
      const detectedRelease = getSentryRelease();
      if (detectedRelease !== void 0) {
        options.release = detectedRelease;
      }
    }
    const client = new ToucanClient({
      ...options,
      transport: makeFetchTransport,
      integrations: getIntegrationsToSetup(options),
      stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
      transportOptions: {
        ...options.transportOptions,
        context: options.context
      }
    });
    super(client);
    client.setSdk(this);
    client.setupIntegrations();
  }
  /**
   * Sets the request body context on all future events.
   *
   * @param body Request body.
   * @example
   * const body = await request.text();
   * toucan.setRequestBody(body);
   */
  setRequestBody(body) {
    this.getClient()?.setRequestBody(body);
  }
  /**
   * Enable/disable the SDK.
   *
   * @param enabled
   */
  setEnabled(enabled) {
    this.getClient()?.setEnabled(enabled);
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */
  captureCheckIn(checkIn, monitorConfig, scope) {
    if (checkIn.status === "in_progress") {
      this.setContext("monitor", { slug: checkIn.monitorSlug });
    }
    const client = this.getClient();
    return client.captureCheckIn(checkIn, monitorConfig, scope);
  }
};
__name(Toucan, "Toucan");

// src/middleware/sentry.ts
function sentry(options) {
  return async (c, next) => {
    if (c.env.ENV !== "production")
      return await next();
    const sentry2 = new Toucan({
      request: c.req.raw,
      context: c.executionCtx,
      release: c.env.RELEASE,
      environment: c.env.ENV,
      ...options
    });
    c.set("sentry", sentry2);
    try {
      await next();
    } catch (error) {
      sentry2.captureException(error);
      throw error;
    }
  };
}
__name(sentry, "sentry");

// src/index.ts
var app = new Hono2();
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"]
  })
);
app.use("/api/*", auth());
app.use("/api/*", logger());
app.use(
  "/api/*",
  sentry({
    dsn: "https://340d03a71aae4b4a99b7d3d36906c21d@o343924.ingest.sentry.io/6779820",
    tracesSampleRate: 1
  })
);
app.get("/api/posts", GetPosts);
app.get("/api/me", GetMe);
app.post("/api/upload", PostUpload);
app.post("/api/bulk-delete", DeletePosts);
var src_default = app;

// ../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@3.19.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// .wrangler/tmp/bundle-nraO0s/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = src_default;

// ../node_modules/.pnpm/wrangler@3.114.17_@cloudflare+workers-types@3.19.0/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-nraO0s/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
