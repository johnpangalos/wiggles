var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-sqaiDV/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
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
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/compose.js
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
        context.req.routeIndex = i;
      } else {
        handler2 = i === middleware.length && next || void 0;
      }
      if (handler2) {
        try {
          res = await handler2(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError2 = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
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

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/utils/url.js
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
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf(
    "/",
    url.charCodeAt(9) === 58 ? 13 : 8
  );
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
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
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
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
  encoded ??= /[%+]/.test(url);
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
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : void 0;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/utils/html.js
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
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
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

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class {
  static {
    __name(this, "Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler2) => {
          this.#addRoute(method, this.#path, handler2);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers2) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers2.map((handler2) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler2);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers2) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers2.unshift(arg1);
      }
      handlers2.forEach((handler2) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler2);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler2;
      if (app2.errorHandler === errorHandler) {
        handler2 = r.handler;
      } else {
        handler2 = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler2[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler2);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler2) => {
    this.errorHandler = handler2;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name((handler2) => {
    this.#notFoundHandler = handler2;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler2 = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler2);
    return this;
  }
  #addRoute(method, path, handler2) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler: handler2 };
    this.router.add(method, path, [handler2, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
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
var Node = class {
  static {
    __name(this, "Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node2;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node2 = this.#children[regexpStr];
      if (!node2) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node2 = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node2.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node2.#varIndex]);
      }
    } else {
      node2 = this.#children[token];
      if (!node2) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node2 = this.#children[token] = new Node();
      }
    }
    node2.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
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
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
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
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers2] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers2.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
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
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
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
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler2) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
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
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
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
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler2, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
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
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
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
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler2) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler2]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  static {
    __name(this, "Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler2, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler2) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler: handler2, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler2) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler: handler2,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node2, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node2.#methods.length; i < len; i++) {
      const m = node2.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node2 = curNodes[j];
        const nextNode = node2.#children[part];
        if (nextNode) {
          nextNode.#params = node2.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node2.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node2.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node2.#patterns.length; k < len3; k++) {
          const pattern = node2.#patterns[k];
          const params = node2.#params === emptyParams ? {} : { ...node2.#params };
          if (pattern === "*") {
            const astNode = node2.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node2.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node2.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node2.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node2.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node2.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler: handler2, params }) => [handler2, params])];
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler2) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler2);
      }
      return;
    }
    this.#node.insert(method, path, handler2);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process !== void 0 ? "NO_COLOR" in process?.env : false;
  return !isNoColor;
}
__name(getColorEnabled, "getColorEnabled");
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}
__name(getColorEnabledAsync, "getColorEnabledAsync");

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/middleware/logger/index.js
var humanize = /* @__PURE__ */ __name((times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
}, "humanize");
var time = /* @__PURE__ */ __name((start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
}, "time");
var colorStatus = /* @__PURE__ */ __name(async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
}, "colorStatus");
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
__name(log, "log");
var logger = /* @__PURE__ */ __name((fn = console.log) => {
  return /* @__PURE__ */ __name(async function logger22(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path, c.res.status, time(start));
  }, "logger2");
}, "logger");

// ../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
__name(unsafeStringify, "unsafeStringify");

// ../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// ../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = { randomUUID };

// ../node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// ../node_modules/.pnpm/@ssttevee+u8-utils@0.1.7/node_modules/@ssttevee/u8-utils/lib/index.mjs
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
  static {
    __name(this, "StreamSearch");
  }
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
var ReadableStreamSearch = class {
  static {
    __name(this, "ReadableStreamSearch");
  }
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
var EOQ = Symbol("End of Queue");

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
  if (!contentType) return;
  const matches = RE_MULTIPART.exec(contentType);
  if (!matches) return;
  return matches[1] || matches[2];
}, "getBoundary");
var parseFormDataRequest = /* @__PURE__ */ __name(async (request) => {
  const boundary = getBoundary(request);
  if (!boundary || !request.body) return;
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
    if (account2 === null) throw new Error(`Bad post data: ${post.accountId}`);
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
    if (post === void 0) throw new Error("Bad data");
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
    const access = c.get("JWT");
    const identity = await access.getIdentity();
    if (identity === void 0) throw new Error("Identity not found");
    const accountKey = `post-account-${identity.email}-${key}`;
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
  if (size === null) size = "WRPost";
  if ("WRPost" !== size && "WRThumbnail" !== size)
    throw new Error("Invalid query param.");
  const cursor = c.req.query("cursor");
  let limitStr = c.req.query("limit");
  if (limitStr === void 0) limitStr = "10";
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
    if (promises === void 0) return c.json({ message: "No content" }, 204);
    const idList = await Promise.all(promises);
    const timestamp = +/* @__PURE__ */ new Date();
    const access = c.get("JWT");
    const identity = await access.getIdentity();
    if (identity === void 0) throw new Error("Identity not found");
    const postList = idList.map((id, idx) => ({
      id: v4_default(),
      contentType: "image/*",
      cfImageId: id,
      timestamp: (timestamp + idx).toString(),
      accountId: identity.email
    }));
    const res = await createPosts(c, postList);
    if (res.status > 300)
      throw new Error(
        `Failed to upload post: ${res.status} ${await res.text()}`
      );
    return c.json({ message: "success" });
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
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
    if (e instanceof Error) console.error(e.message);
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
async function GetMe(c) {
  const access = c.get("JWT");
  const identity = await access.getIdentity();
  if (identity === void 0) throw new Error("Identity not found");
  const meStr = await c.env.WIGGLES.get(`account-${identity.email}`);
  if (meStr === null) return c.json({ message: "Account invalid" }, 422);
  const me = JSON.parse(meStr);
  return c.json(me);
}
__name(GetMe, "GetMe");

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = /* @__PURE__ */ __name((cookie, name) => {
  if (name && cookie.indexOf(name) === -1) {
    return {};
  }
  const pairs = cookie.trim().split(";");
  const parsedCookie = {};
  for (let pairStr of pairs) {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      continue;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
      if (name) {
        break;
      }
    }
  }
  return parsedCookie;
}, "parse");

// ../node_modules/.pnpm/hono@4.9.0/node_modules/hono/dist/helper/cookie/index.js
var getCookie = /* @__PURE__ */ __name((c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
}, "getCookie");

// src/middleware/auth.ts
var getIdentity = /* @__PURE__ */ __name(async ({
  jwt,
  domain
}) => {
  const identityURL = new URL("/cdn-cgi/access/get-identity", domain);
  const response = await fetch(identityURL.toString(), {
    headers: { Cookie: `CF_Authorization=${jwt}` }
  });
  if (response.ok) return await response.json();
}, "getIdentity");
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
var generateValidator = /* @__PURE__ */ __name((c) => async () => {
  const jwt = getCookie(c, "CF_Authorization");
  if (jwt === void 0) throw new Error("JWT not on request");
  const parts = jwt.split(".");
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
  const certsURL = new URL("/cdn-cgi/access/certs", c.env.DOMAIN);
  const certsResponse = await fetch(certsURL.toString(), {
    cf: {
      cacheTtl: 5 * 60,
      cacheEverything: true
    }
  });
  const { keys } = await certsResponse.json();
  if (!keys) {
    throw new Error("Could not fetch signing keys.");
  }
  const jwk = keys.find((key2) => key2.kid === kid);
  if (!jwk) {
    throw new Error("Could not find matching signing key.");
  }
  if (jwk.kty !== "RSA" || jwk.alg !== "RS256") {
    throw new Error("Unknown key type of algorithm.");
  }
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const unroundedSecondsSinceEpoch = Date.now() / 1e3;
  const payloadObj = JSON.parse(textDecoder.decode(base64URLDecode(payload)));
  if (payloadObj.iss && payloadObj.iss !== certsURL.origin) {
    throw new Error("JWT issuer is incorrect.");
  }
  if (payloadObj.aud && payloadObj.aud[0] !== c.env.AUDIENCE) {
    throw new Error("JWT audience is incorrect.");
  }
  if (payloadObj.exp && Math.floor(unroundedSecondsSinceEpoch) >= payloadObj.exp) {
    throw new Error("JWT has expired.");
  }
  if (payloadObj.nbf && Math.ceil(unroundedSecondsSinceEpoch) < payloadObj.nbf) {
    throw new Error("JWT is not yet valid.");
  }
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64URLDecode(signature),
    asciiToUint8Array(`${header}.${payload}`)
  );
  if (!verified) {
    throw new Error("Could not verify JWT.");
  }
  return { jwt, payload: payloadObj };
}, "generateValidator");
function auth() {
  return async (c, next) => {
    try {
      const validator = generateValidator(c);
      const { jwt, payload } = await validator();
      c.set("JWT", {
        payload,
        getIdentity: /* @__PURE__ */ __name(() => getIdentity({ jwt, domain: c.env.DOMAIN }), "getIdentity")
      });
      await next();
      return;
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
    return c.json({ message: "Unauthorized", ok: false }, 401);
  };
}
__name(auth, "auth");

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/is.js
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
function isErrorEvent(wat) {
  return isBuiltin(wat, "ErrorEvent");
}
__name(isErrorEvent, "isErrorEvent");
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/string.js
function truncate(str, max = 0) {
  if (typeof str !== "string" || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.slice(0, max)}...`;
}
__name(truncate, "truncate");

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/version.js
var SDK_VERSION = "8.9.2";

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/worldwide.js
var GLOBAL_OBJ = globalThis;
function getGlobalSingleton(name, creator, obj) {
  const gbl = obj || GLOBAL_OBJ;
  const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
  const versionedCarrier = __SENTRY__[SDK_VERSION] = __SENTRY__[SDK_VERSION] || {};
  return versionedCarrier[name] || (versionedCarrier[name] = creator());
}
__name(getGlobalSingleton, "getGlobalSingleton");

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/browser.js
var WINDOW = GLOBAL_OBJ;
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
    if (elem instanceof HTMLElement && elem.dataset) {
      if (elem.dataset["sentryComponent"]) {
        return elem.dataset["sentryComponent"];
      }
      if (elem.dataset["sentryElement"]) {
        return elem.dataset["sentryElement"];
      }
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/debug-build.js
var DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/logger.js
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
    enable: /* @__PURE__ */ __name(() => {
      enabled = true;
    }, "enable"),
    disable: /* @__PURE__ */ __name(() => {
      enabled = false;
    }, "disable"),
    isEnabled: /* @__PURE__ */ __name(() => enabled, "isEnabled")
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/dsn.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/error.js
var SentryError = class extends Error {
  static {
    __name(this, "SentryError");
  }
  /** Display name of this error instance. */
  constructor(message, logLevel = "warn") {
    super(message);
    this.message = message;
    this.name = new.target.prototype.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.logLevel = logLevel;
  }
};

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/object.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/stacktrace.js
var STACKTRACE_FRAME_LIMIT = 50;
var UNKNOWN_FUNCTION = "?";
var WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
var STRIP_FRAME_REGEXP = /captureMessage|captureException/;
function createStackParser(...parsers) {
  const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return (stack, skipFirstLines = 0, framesToPop = 0) => {
    const frames = [];
    const lines = stack.split("\n");
    for (let i = skipFirstLines; i < lines.length; i++) {
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
      if (frames.length >= STACKTRACE_FRAME_LIMIT + framesToPop) {
        break;
      }
    }
    return stripSentryFramesAndReverse(frames.slice(framesToPop));
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
    function: frame.function || UNKNOWN_FUNCTION
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/instrument/handlers.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/time.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/instrument/globalError.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/instrument/globalUnhandledRejection.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/memo.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/misc.js
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
  return ("10000000100040008000" + 1e11).replace(
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/normalize.js
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
  ["number", "boolean", "string"].includes(typeof value) && !Number.isNaN(value)) {
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/path.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/syncpromise.js
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
var SyncPromise = class _SyncPromise {
  static {
    __name(this, "SyncPromise");
  }
  constructor(executor) {
    _SyncPromise.prototype.__init.call(this);
    _SyncPromise.prototype.__init2.call(this);
    _SyncPromise.prototype.__init3.call(this);
    _SyncPromise.prototype.__init4.call(this);
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
    return new _SyncPromise((resolve2, reject) => {
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
    return new _SyncPromise((resolve2, reject) => {
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/promisebuffer.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/node-stack-trace.js
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
        methodName = methodName || UNKNOWN_FUNCTION;
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
function nodeStackLineParser(getModule2) {
  return [90, node(getModule2)];
}
__name(nodeStackLineParser, "nodeStackLineParser");

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/envelope.js
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
function encodeUTF8(input) {
  return GLOBAL_OBJ.__SENTRY__ && GLOBAL_OBJ.__SENTRY__.encodePolyfill ? GLOBAL_OBJ.__SENTRY__.encodePolyfill(input) : new TextEncoder().encode(input);
}
__name(encodeUTF8, "encodeUTF8");
function serializeEnvelope(envelope) {
  const [envHeaders, items] = envelope;
  let parts = JSON.stringify(envHeaders);
  function append(next) {
    if (typeof parts === "string") {
      parts = typeof next === "string" ? parts + next : [encodeUTF8(parts), next];
    } else {
      parts.push(typeof next === "string" ? encodeUTF8(next) : next);
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
function createAttachmentEnvelopeItem(attachment) {
  const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data) : attachment.data;
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
  profile_chunk: "profile",
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/ratelimit.js
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/eventbuilder.js
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
function getErrorPropertyFromObject(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const value = obj[prop];
      if (value instanceof Error) {
        return value;
      }
    }
  }
  return void 0;
}
__name(getErrorPropertyFromObject, "getErrorPropertyFromObject");
function getMessageForObject(exception) {
  if ("name" in exception && typeof exception.name === "string") {
    let message = `'${exception.name}' captured as exception`;
    if ("message" in exception && typeof exception.message === "string") {
      message += ` with message '${exception.message}'`;
    }
    return message;
  } else if ("message" in exception && typeof exception.message === "string") {
    return exception.message;
  }
  const keys = extractExceptionKeysForMessage(exception);
  if (isErrorEvent(exception)) {
    return `Event \`ErrorEvent\` captured as exception with message \`${exception.message}\``;
  }
  const className = getObjectClassName(exception);
  return `${className && className !== "Object" ? `'${className}'` : "Object"} captured as exception with keys: ${keys}`;
}
__name(getMessageForObject, "getMessageForObject");
function getObjectClassName(obj) {
  try {
    const prototype = Object.getPrototypeOf(obj);
    return prototype ? prototype.constructor.name : void 0;
  } catch (e) {
  }
}
__name(getObjectClassName, "getObjectClassName");
function getException(client, mechanism, exception, hint) {
  if (isError(exception)) {
    return [exception, void 0];
  }
  mechanism.synthetic = true;
  if (isPlainObject(exception)) {
    const normalizeDepth = client && client.getOptions().normalizeDepth;
    const extras = { ["__serialized__"]: normalizeToSize(exception, normalizeDepth) };
    const errorFromProp = getErrorPropertyFromObject(exception);
    if (errorFromProp) {
      return [errorFromProp, extras];
    }
    const message = getMessageForObject(exception);
    const ex2 = hint && hint.syntheticException || new Error(message);
    ex2.message = message;
    return [ex2, extras];
  }
  const ex = hint && hint.syntheticException || new Error(exception);
  ex.message = `${exception}`;
  return [ex, void 0];
}
__name(getException, "getException");
function eventFromUnknownInput(client, stackParser, exception, hint) {
  const providedMechanism = hint && hint.data && hint.data.mechanism;
  const mechanism = providedMechanism || {
    handled: true,
    type: "generic"
  };
  const [ex, extras] = getException(client, mechanism, exception, hint);
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

// ../node_modules/.pnpm/@sentry+utils@8.9.2/node_modules/@sentry/utils/esm/propagationContext.js
function generatePropagationContext() {
  return {
    traceId: uuid4(),
    spanId: uuid4().substring(16)
  };
}
__name(generatePropagationContext, "generatePropagationContext");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/debug-build.js
var DEBUG_BUILD2 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/carrier.js
function getMainCarrier() {
  getSentryCarrier(GLOBAL_OBJ);
  return GLOBAL_OBJ;
}
__name(getMainCarrier, "getMainCarrier");
function getSentryCarrier(carrier) {
  const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
  __SENTRY__.version = __SENTRY__.version || SDK_VERSION;
  return __SENTRY__[SDK_VERSION] = __SENTRY__[SDK_VERSION] || {};
}
__name(getSentryCarrier, "getSentryCarrier");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/session.js
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/utils/spanOnScope.js
var SCOPE_SPAN_FIELD = "_sentrySpan";
function _setSpanForScope(scope, span) {
  if (span) {
    addNonEnumerableProperty(scope, SCOPE_SPAN_FIELD, span);
  } else {
    delete scope[SCOPE_SPAN_FIELD];
  }
}
__name(_setSpanForScope, "_setSpanForScope");
function _getSpanForScope(scope) {
  return scope[SCOPE_SPAN_FIELD];
}
__name(_getSpanForScope, "_getSpanForScope");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/scope.js
var DEFAULT_MAX_BREADCRUMBS = 100;
var ScopeClass = class _ScopeClass {
  static {
    __name(this, "ScopeClass");
  }
  /** Flag if notifying is happening. */
  /** Callback for client to receive scope changes. */
  /** Callback list that will be called during event processing. */
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
  /**
   * Transaction Name
   *
   * IMPORTANT: The transaction name on the scope has nothing to do with root spans/transaction objects.
   * It's purpose is to assign a transaction to the scope that's added to non-transaction events.
   */
  /** Session */
  /** Request Mode Session Status */
  /** The client on this scope */
  /** Contains the last event id of a captured event.  */
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
   * @inheritDoc
   */
  clone() {
    const newScope = new _ScopeClass();
    newScope._breadcrumbs = [...this._breadcrumbs];
    newScope._tags = { ...this._tags };
    newScope._extra = { ...this._extra };
    newScope._contexts = { ...this._contexts };
    newScope._user = this._user;
    newScope._level = this._level;
    newScope._session = this._session;
    newScope._transactionName = this._transactionName;
    newScope._fingerprint = this._fingerprint;
    newScope._eventProcessors = [...this._eventProcessors];
    newScope._requestSession = this._requestSession;
    newScope._attachments = [...this._attachments];
    newScope._sdkProcessingMetadata = { ...this._sdkProcessingMetadata };
    newScope._propagationContext = { ...this._propagationContext };
    newScope._client = this._client;
    newScope._lastEventId = this._lastEventId;
    _setSpanForScope(newScope, _getSpanForScope(this));
    return newScope;
  }
  /**
   * @inheritDoc
   */
  setClient(client) {
    this._client = client;
  }
  /**
   * @inheritDoc
   */
  setLastEventId(lastEventId) {
    this._lastEventId = lastEventId;
  }
  /**
   * @inheritDoc
   */
  getClient() {
    return this._client;
  }
  /**
   * @inheritDoc
   */
  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
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
   * @inheritDoc
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
    const [scopeInstance, requestSession] = scopeToMerge instanceof Scope ? [scopeToMerge.getScopeData(), scopeToMerge.getRequestSession()] : isPlainObject(scopeToMerge) ? [captureContext, captureContext.requestSession] : [];
    const { tags, extra, user, contexts, level, fingerprint = [], propagationContext } = scopeInstance || {};
    this._tags = { ...this._tags, ...tags };
    this._extra = { ...this._extra, ...extra };
    this._contexts = { ...this._contexts, ...contexts };
    if (user && Object.keys(user).length) {
      this._user = user;
    }
    if (level) {
      this._level = level;
    }
    if (fingerprint.length) {
      this._fingerprint = fingerprint;
    }
    if (propagationContext) {
      this._propagationContext = propagationContext;
    }
    if (requestSession) {
      this._requestSession = requestSession;
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
    this._session = void 0;
    _setSpanForScope(this, void 0);
    this._attachments = [];
    this._propagationContext = generatePropagationContext();
    this._notifyScopeListeners();
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
   */
  clearAttachments() {
    this._attachments = [];
    return this;
  }
  /** @inheritDoc */
  getScopeData() {
    return {
      breadcrumbs: this._breadcrumbs,
      attachments: this._attachments,
      contexts: this._contexts,
      tags: this._tags,
      extra: this._extra,
      user: this._user,
      level: this._level,
      fingerprint: this._fingerprint || [],
      eventProcessors: this._eventProcessors,
      propagationContext: this._propagationContext,
      sdkProcessingMetadata: this._sdkProcessingMetadata,
      transactionName: this._transactionName,
      span: _getSpanForScope(this)
    };
  }
  /**
   * @inheritDoc
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
   * @inheritDoc
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
   * @inheritDoc
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
   * @inheritDoc
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
var Scope = ScopeClass;

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/defaultScopes.js
function getDefaultCurrentScope() {
  return getGlobalSingleton("defaultCurrentScope", () => new Scope());
}
__name(getDefaultCurrentScope, "getDefaultCurrentScope");
function getDefaultIsolationScope() {
  return getGlobalSingleton("defaultIsolationScope", () => new Scope());
}
__name(getDefaultIsolationScope, "getDefaultIsolationScope");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/asyncContext/stackStrategy.js
var AsyncContextStack = class {
  static {
    __name(this, "AsyncContextStack");
  }
  constructor(scope, isolationScope) {
    let assignedScope;
    if (!scope) {
      assignedScope = new Scope();
    } else {
      assignedScope = scope;
    }
    let assignedIsolationScope;
    if (!isolationScope) {
      assignedIsolationScope = new Scope();
    } else {
      assignedIsolationScope = isolationScope;
    }
    this._stack = [{ scope: assignedScope }];
    this._isolationScope = assignedIsolationScope;
  }
  /**
   * Fork a scope for the stack.
   */
  withScope(callback) {
    const scope = this._pushScope();
    let maybePromiseResult;
    try {
      maybePromiseResult = callback(scope);
    } catch (e) {
      this._popScope();
      throw e;
    }
    if (isThenable(maybePromiseResult)) {
      return maybePromiseResult.then(
        (res) => {
          this._popScope();
          return res;
        },
        (e) => {
          this._popScope();
          throw e;
        }
      );
    }
    this._popScope();
    return maybePromiseResult;
  }
  /**
   * Get the client of the stack.
   */
  getClient() {
    return this.getStackTop().client;
  }
  /**
   * Returns the scope of the top stack.
   */
  getScope() {
    return this.getStackTop().scope;
  }
  /**
   * Get the isolation scope for the stack.
   */
  getIsolationScope() {
    return this._isolationScope;
  }
  /**
   * Returns the scope stack for domains or the process.
   */
  getStack() {
    return this._stack;
  }
  /**
   * Returns the topmost scope layer in the order domain > local > process.
   */
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * Push a scope to the stack.
   */
  _pushScope() {
    const scope = this.getScope().clone();
    this.getStack().push({
      client: this.getClient(),
      scope
    });
    return scope;
  }
  /**
   * Pop a scope from the stack.
   */
  _popScope() {
    if (this.getStack().length <= 1) return false;
    return !!this.getStack().pop();
  }
};
function getAsyncContextStack() {
  const registry = getMainCarrier();
  const sentry2 = getSentryCarrier(registry);
  return sentry2.stack = sentry2.stack || new AsyncContextStack(getDefaultCurrentScope(), getDefaultIsolationScope());
}
__name(getAsyncContextStack, "getAsyncContextStack");
function withScope(callback) {
  return getAsyncContextStack().withScope(callback);
}
__name(withScope, "withScope");
function withSetScope(scope, callback) {
  const stack = getAsyncContextStack();
  return stack.withScope(() => {
    stack.getStackTop().scope = scope;
    return callback(scope);
  });
}
__name(withSetScope, "withSetScope");
function withIsolationScope(callback) {
  return getAsyncContextStack().withScope(() => {
    return callback(getAsyncContextStack().getIsolationScope());
  });
}
__name(withIsolationScope, "withIsolationScope");
function getStackAsyncContextStrategy() {
  return {
    withIsolationScope,
    withScope,
    withSetScope,
    withSetIsolationScope: /* @__PURE__ */ __name((_isolationScope, callback) => {
      return withIsolationScope(callback);
    }, "withSetIsolationScope"),
    getCurrentScope: /* @__PURE__ */ __name(() => getAsyncContextStack().getScope(), "getCurrentScope"),
    getIsolationScope: /* @__PURE__ */ __name(() => getAsyncContextStack().getIsolationScope(), "getIsolationScope")
  };
}
__name(getStackAsyncContextStrategy, "getStackAsyncContextStrategy");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/asyncContext/index.js
function getAsyncContextStrategy(carrier) {
  const sentry2 = getSentryCarrier(carrier);
  if (sentry2.acs) {
    return sentry2.acs;
  }
  return getStackAsyncContextStrategy();
}
__name(getAsyncContextStrategy, "getAsyncContextStrategy");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/currentScopes.js
function getCurrentScope() {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  return acs.getCurrentScope();
}
__name(getCurrentScope, "getCurrentScope");
function getIsolationScope() {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  return acs.getIsolationScope();
}
__name(getIsolationScope, "getIsolationScope");
function getGlobalScope() {
  return getGlobalSingleton("globalScope", () => new Scope());
}
__name(getGlobalScope, "getGlobalScope");
function getClient() {
  return getCurrentScope().getClient();
}
__name(getClient, "getClient");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/metrics/metric-summary.js
var METRICS_SPAN_FIELD = "_sentryMetrics";
function getMetricSummaryJsonForSpan(span) {
  const storage = span[METRICS_SPAN_FIELD];
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/semanticAttributes.js
var SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = "sentry.source";
var SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = "sentry.sample_rate";
var SEMANTIC_ATTRIBUTE_SENTRY_OP = "sentry.op";
var SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = "sentry.origin";

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/tracing/spanstatus.js
var SPAN_STATUS_UNSET = 0;
var SPAN_STATUS_OK = 1;
var SPAN_STATUS_ERROR = 2;

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/utils/spanUtils.js
var TRACE_FLAG_SAMPLED = 1;
function spanToTraceContext(span) {
  const { spanId: span_id, traceId: trace_id } = span.spanContext();
  const { parent_span_id } = spanToJSON(span);
  return dropUndefinedKeys({ parent_span_id, span_id, trace_id });
}
__name(spanToTraceContext, "spanToTraceContext");
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
  if (spanIsSentrySpan(span)) {
    return span.getSpanJSON();
  }
  try {
    const { spanId: span_id, traceId: trace_id } = span.spanContext();
    if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
      const { attributes, startTime, name, endTime, parentSpanId, status } = span;
      return dropUndefinedKeys({
        span_id,
        trace_id,
        data: attributes,
        description: name,
        parent_span_id: parentSpanId,
        start_timestamp: spanTimeInputToSeconds(startTime),
        // This is [0,0] by default in OTEL, in which case we want to interpret this as no end time
        timestamp: spanTimeInputToSeconds(endTime) || void 0,
        status: getStatusMessage(status),
        op: attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP],
        origin: attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
        _metrics_summary: getMetricSummaryJsonForSpan(span)
      });
    }
    return {
      span_id,
      trace_id
    };
  } catch (e) {
    return {};
  }
}
__name(spanToJSON, "spanToJSON");
function spanIsOpenTelemetrySdkTraceBaseSpan(span) {
  const castSpan = span;
  return !!castSpan.attributes && !!castSpan.startTime && !!castSpan.name && !!castSpan.endTime && !!castSpan.status;
}
__name(spanIsOpenTelemetrySdkTraceBaseSpan, "spanIsOpenTelemetrySdkTraceBaseSpan");
function spanIsSentrySpan(span) {
  return typeof span.getSpanJSON === "function";
}
__name(spanIsSentrySpan, "spanIsSentrySpan");
function spanIsSampled(span) {
  const { traceFlags } = span.spanContext();
  return traceFlags === TRACE_FLAG_SAMPLED;
}
__name(spanIsSampled, "spanIsSampled");
function getStatusMessage(status) {
  if (!status || status.code === SPAN_STATUS_UNSET) {
    return void 0;
  }
  if (status.code === SPAN_STATUS_OK) {
    return "ok";
  }
  return status.message || "unknown_error";
}
__name(getStatusMessage, "getStatusMessage");
var ROOT_SPAN_FIELD = "_sentryRootSpan";
function getRootSpan(span) {
  return span[ROOT_SPAN_FIELD] || span;
}
__name(getRootSpan, "getRootSpan");
function getActiveSpan() {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  if (acs.getActiveSpan) {
    return acs.getActiveSpan();
  }
  return _getSpanForScope(getCurrentScope());
}
__name(getActiveSpan, "getActiveSpan");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/tracing/errors.js
var errorsInstrumented = false;
function registerSpanErrorInstrumentation() {
  if (errorsInstrumented) {
    return;
  }
  errorsInstrumented = true;
  addGlobalErrorInstrumentationHandler(errorCallback);
  addGlobalUnhandledRejectionInstrumentationHandler(errorCallback);
}
__name(registerSpanErrorInstrumentation, "registerSpanErrorInstrumentation");
function errorCallback() {
  const activeSpan = getActiveSpan();
  const rootSpan = activeSpan && getRootSpan(activeSpan);
  if (rootSpan) {
    const message = "internal_error";
    DEBUG_BUILD2 && logger2.log(`[Tracing] Root span: ${message} -> Global error occured`);
    rootSpan.setStatus({ code: SPAN_STATUS_ERROR, message });
  }
}
__name(errorCallback, "errorCallback");
errorCallback.tag = "sentry_tracingErrorCallback";

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/constants.js
var DEFAULT_ENVIRONMENT = "production";

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/tracing/dynamicSamplingContext.js
var FROZEN_DSC_FIELD = "_frozenDsc";
function getDynamicSamplingContextFromClient(trace_id, client) {
  const options = client.getOptions();
  const { publicKey: public_key } = client.getDsn() || {};
  const dsc = dropUndefinedKeys({
    environment: options.environment || DEFAULT_ENVIRONMENT,
    release: options.release,
    public_key,
    trace_id
  });
  client.emit("createDsc", dsc);
  return dsc;
}
__name(getDynamicSamplingContextFromClient, "getDynamicSamplingContextFromClient");
function getDynamicSamplingContextFromSpan(span) {
  const client = getClient();
  if (!client) {
    return {};
  }
  const dsc = getDynamicSamplingContextFromClient(spanToJSON(span).trace_id || "", client);
  const rootSpan = getRootSpan(span);
  if (!rootSpan) {
    return dsc;
  }
  const frozenDsc = rootSpan[FROZEN_DSC_FIELD];
  if (frozenDsc) {
    return frozenDsc;
  }
  const jsonSpan = spanToJSON(rootSpan);
  const attributes = jsonSpan.data || {};
  const maybeSampleRate = attributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE];
  if (maybeSampleRate != null) {
    dsc.sample_rate = `${maybeSampleRate}`;
  }
  const source = attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
  if (source && source !== "url") {
    dsc.transaction = jsonSpan.description;
  }
  dsc.sampled = String(spanIsSampled(rootSpan));
  client.emit("createDsc", dsc);
  return dsc;
}
__name(getDynamicSamplingContextFromSpan, "getDynamicSamplingContextFromSpan");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/utils/parseSampleRate.js
function parseSampleRate(sampleRate) {
  if (typeof sampleRate === "boolean") {
    return Number(sampleRate);
  }
  const rate = typeof sampleRate === "string" ? parseFloat(sampleRate) : sampleRate;
  if (typeof rate !== "number" || isNaN(rate) || rate < 0 || rate > 1) {
    DEBUG_BUILD2 && logger2.warn(
      `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        sampleRate
      )} of type ${JSON.stringify(typeof sampleRate)}.`
    );
    return void 0;
  }
  return rate;
}
__name(parseSampleRate, "parseSampleRate");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/envelope.js
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/eventProcessors.js
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/utils/applyScopeDataToEvent.js
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
  const { extra, tags, user, contexts, level, transactionName } = data;
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
  if (transactionName && event.type !== "transaction") {
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
  event.contexts = {
    trace: spanToTraceContext(span),
    ...event.contexts
  };
  event.sdkProcessingMetadata = {
    dynamicSamplingContext: getDynamicSamplingContextFromSpan(span),
    ...event.sdkProcessingMetadata
  };
  const rootSpan = getRootSpan(span);
  const transactionName = spanToJSON(rootSpan).description;
  if (transactionName && !event.transaction && event.type === "transaction") {
    event.transaction = transactionName;
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/utils/prepareEvent.js
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
  const clientEventProcessors = client ? client.getEventProcessors() : [];
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
      return {
        ...span,
        ...span.data && {
          data: normalize(span.data, depth, maxBreadth)
        }
      };
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/sessionflusher.js
var SessionFlusher = class {
  static {
    __name(this, "SessionFlusher");
  }
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
    const isolationScope = getIsolationScope();
    const requestSession = isolationScope.getRequestSession();
    if (requestSession && requestSession.status) {
      this._incrementSessionStatusCount(requestSession.status, /* @__PURE__ */ new Date());
      isolationScope.setRequestSession(void 0);
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/api.js
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
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnel, sdkInfo) {
  return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}
__name(getEnvelopeEndpointWithUrlEncodedAuth, "getEnvelopeEndpointWithUrlEncodedAuth");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/integration.js
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
  if (installedIntegrations.indexOf(integration.name) === -1 && typeof integration.setupOnce === "function") {
    integration.setupOnce();
    installedIntegrations.push(integration.name);
  }
  if (integration.setup && typeof integration.setup === "function") {
    integration.setup(client);
  }
  if (typeof integration.preprocessEvent === "function") {
    const callback = integration.preprocessEvent.bind(integration);
    client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
  }
  if (typeof integration.processEvent === "function") {
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
function defineIntegration(fn) {
  return fn;
}
__name(defineIntegration, "defineIntegration");

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/baseclient.js
var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
var BaseClient = class {
  static {
    __name(this, "BaseClient");
  }
  /** Options passed to the SDK. */
  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  /** Array of set up integrations. */
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
      const url = getEnvelopeEndpointWithUrlEncodedAuth(
        this._dsn,
        options.tunnel,
        options._metadata ? options._metadata.sdk : void 0
      );
      this._transport = options.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...options.transportOptions,
        url
      });
    }
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  captureException(exception, hint, scope) {
    const eventId = uuid4();
    if (checkOrSetAlreadyCaught(exception)) {
      DEBUG_BUILD2 && logger2.log(ALREADY_SEEN_ERROR);
      return eventId;
    }
    const hintWithEventId = {
      event_id: eventId,
      ...hint
    };
    this._process(
      this.eventFromException(exception, hintWithEventId).then(
        (event) => this._captureEvent(event, hintWithEventId, scope)
      )
    );
    return hintWithEventId.event_id;
  }
  /**
   * @inheritDoc
   */
  captureMessage(message, level, hint, currentScope) {
    const hintWithEventId = {
      event_id: uuid4(),
      ...hint
    };
    const eventMessage = isParameterizedString(message) ? message : String(message);
    const promisedEvent = isPrimitive(message) ? this.eventFromMessage(eventMessage, level, hintWithEventId) : this.eventFromException(message, hintWithEventId);
    this._process(promisedEvent.then((event) => this._captureEvent(event, hintWithEventId, currentScope)));
    return hintWithEventId.event_id;
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint, currentScope) {
    const eventId = uuid4();
    if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
      DEBUG_BUILD2 && logger2.log(ALREADY_SEEN_ERROR);
      return eventId;
    }
    const hintWithEventId = {
      event_id: eventId,
      ...hint
    };
    const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
    const capturedSpanScope = sdkProcessingMetadata.capturedSpanScope;
    this._process(this._captureEvent(event, hintWithEventId, capturedSpanScope || currentScope));
    return hintWithEventId.event_id;
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
      this.emit("flush");
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
      this.emit("close");
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
  /** @inheritdoc */
  init() {
    if (this._isEnabled()) {
      this._setupIntegrations();
    }
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
      env = addItemToEnvelope(env, createAttachmentEnvelopeItem(attachment));
    }
    const promise = this.sendEnvelope(env);
    if (promise) {
      promise.then((sendResponse) => this.emit("afterSendEvent", event, sendResponse), null);
    }
  }
  /**
   * @inheritDoc
   */
  sendSession(session) {
    const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(env);
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
  /**
   * @inheritdoc
   */
  sendEnvelope(envelope) {
    this.emit("beforeEnvelope", envelope);
    if (this._isEnabled() && this._transport) {
      return this._transport.send(envelope).then(null, (reason) => {
        DEBUG_BUILD2 && logger2.error("Error while sending event:", reason);
        return reason;
      });
    }
    DEBUG_BUILD2 && logger2.error("Transport disabled");
    return resolvedSyncPromise({});
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  /** Setup integrations for this client. */
  _setupIntegrations() {
    const { integrations } = this._options;
    this._integrations = setupIntegrations(this, integrations);
    afterSetupIntegrations(this, integrations);
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
   * @param currentScope A scope containing event metadata.
   * @returns A new event with more information.
   */
  _prepareEvent(event, hint, currentScope, isolationScope = getIsolationScope()) {
    const options = this.getOptions();
    const integrations = Object.keys(this._integrations);
    if (!hint.integrations && integrations.length > 0) {
      hint.integrations = integrations;
    }
    this.emit("preprocessEvent", event, hint);
    if (!event.type) {
      isolationScope.setLastEventId(event.event_id || hint.event_id);
    }
    return prepareEvent(options, event, hint, currentScope, this, isolationScope).then((evt) => {
      if (evt === null) {
        return evt;
      }
      const propagationContext = {
        ...isolationScope.getPropagationContext(),
        ...currentScope ? currentScope.getPropagationContext() : void 0
      };
      const trace = evt.contexts && evt.contexts.trace;
      if (!trace && propagationContext) {
        const { traceId: trace_id, spanId, parentSpanId, dsc } = propagationContext;
        evt.contexts = {
          trace: dropUndefinedKeys({
            trace_id,
            span_id: spanId,
            parent_span_id: parentSpanId
          }),
          ...evt.contexts
        };
        const dynamicSamplingContext = dsc ? dsc : getDynamicSamplingContextFromClient(trace_id, this);
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
   * @param currentScope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
  _processEvent(event, hint, currentScope) {
    const options = this.getOptions();
    const { sampleRate } = options;
    const isTransaction = isTransactionEvent(event);
    const isError2 = isErrorEvent2(event);
    const eventType = event.type || "error";
    const beforeSendLabel = `before send for type \`${eventType}\``;
    const parsedSampleRate = typeof sampleRate === "undefined" ? void 0 : parseSampleRate(sampleRate);
    if (isError2 && typeof parsedSampleRate === "number" && Math.random() > parsedSampleRate) {
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
    return this._prepareEvent(event, hint, currentScope, capturedSpanIsolationScope).then((prepared) => {
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
      const session = currentScope && currentScope.getSession();
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};
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
  const { beforeSend, beforeSendTransaction, beforeSendSpan } = options;
  if (isErrorEvent2(event) && beforeSend) {
    return beforeSend(event, hint);
  }
  if (isTransactionEvent(event)) {
    if (event.spans && beforeSendSpan) {
      const processedSpans = [];
      for (const span of event.spans) {
        const processedSpan = beforeSendSpan(span);
        if (processedSpan) {
          processedSpans.push(processedSpan);
        }
      }
      event.spans = processedSpans;
    }
    if (beforeSendTransaction) {
      return beforeSendTransaction(event, hint);
    }
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/checkin.js
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

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/server-runtime-client.js
var ServerRuntimeClient = class extends BaseClient {
  static {
    __name(this, "ServerRuntimeClient");
  }
  /**
   * Creates a new Edge SDK instance.
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    registerSpanErrorInstrumentation();
    super(options);
  }
  /**
   * @inheritDoc
   */
  eventFromException(exception, hint) {
    return resolvedSyncPromise(eventFromUnknownInput(this, this._options.stackParser, exception, hint));
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  captureException(exception, hint, scope) {
    if (this._options.autoSessionTracking && this._sessionFlusher) {
      const requestSession = getIsolationScope().getRequestSession();
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
    if (this._options.autoSessionTracking && this._sessionFlusher) {
      const eventType = event.type || "exception";
      const isException = eventType === "exception" && event.exception && event.exception.values && event.exception.values.length > 0;
      if (isException) {
        const requestSession = getIsolationScope().getRequestSession();
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
        timezone: monitorConfig.timezone,
        failure_issue_threshold: monitorConfig.failureIssueThreshold,
        recovery_threshold: monitorConfig.recoveryThreshold
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
    this.sendEnvelope(envelope);
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
    const span = _getSpanForScope(scope);
    if (span) {
      const rootSpan = getRootSpan(span);
      const samplingContext = getDynamicSamplingContextFromSpan(rootSpan);
      return [samplingContext, spanToTraceContext(rootSpan)];
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
    return [getDynamicSamplingContextFromClient(traceId, this), traceContext];
  }
};

// ../node_modules/.pnpm/@sentry+core@8.9.2/node_modules/@sentry/core/esm/transports/base.js
var DEFAULT_TRANSPORT_BUFFER_SIZE = 64;
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
      return resolvedSyncPromise({});
    }
    const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
    const recordEnvelopeLoss = /* @__PURE__ */ __name((reason) => {
      forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
      });
    }, "recordEnvelopeLoss");
    const requestTask = /* @__PURE__ */ __name(() => makeRequest({ body: serializeEnvelope(filteredEnvelope) }).then(
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
          return resolvedSyncPromise({});
        } else {
          throw error;
        }
      }
    );
  }
  __name(send, "send");
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

// ../node_modules/.pnpm/toucan-js@4.1.1/node_modules/toucan-js/dist/index.esm.js
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
      sdk?.setExtra("__serialized__", normalizeToSize(exception, normalizeDepth));
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
var DEFAULT_LIMIT$1 = 5;
var linkedErrorsIntegration = defineIntegration((options = { limit: DEFAULT_LIMIT$1 }) => {
  return {
    name: "LinkedErrors",
    processEvent: /* @__PURE__ */ __name((event, hint, client) => {
      return handler(client.getOptions().stackParser, options.limit, event, hint);
    }, "processEvent")
  };
});
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
var requestDataIntegration = defineIntegration((userOptions = {}) => {
  const options = { ...defaultRequestDataOptions, ...userOptions };
  return {
    name: "RequestData",
    preprocessEvent: /* @__PURE__ */ __name((event) => {
      const { sdkProcessingMetadata } = event;
      if (!sdkProcessingMetadata) {
        return event;
      }
      if ("request" in sdkProcessingMetadata && sdkProcessingMetadata.request instanceof Request) {
        event.request = toEventRequest(sdkProcessingMetadata.request, options);
        event.user = toEventUser(event.user ?? {}, sdkProcessingMetadata.request, options);
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
    }, "preprocessEvent")
  };
});
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
function defineIntegration2(fn) {
  return fn;
}
__name(defineIntegration2, "defineIntegration");
var INTEGRATION_NAME = "ZodErrors";
var DEFAULT_LIMIT = 10;
function originalExceptionIsZodError(originalException) {
  return isError(originalException) && originalException.name === "ZodError" && Array.isArray(originalException.issues);
}
__name(originalExceptionIsZodError, "originalExceptionIsZodError");
function flattenIssue(issue) {
  return {
    ...issue,
    path: "path" in issue && Array.isArray(issue.path) ? issue.path.join(".") : void 0,
    keys: "keys" in issue ? JSON.stringify(issue.keys) : void 0,
    unionErrors: "unionErrors" in issue ? JSON.stringify(issue.unionErrors) : void 0
  };
}
__name(flattenIssue, "flattenIssue");
function flattenIssuePath(path) {
  return path.map((p) => {
    if (typeof p === "number") {
      return "<array>";
    } else {
      return p;
    }
  }).join(".");
}
__name(flattenIssuePath, "flattenIssuePath");
function formatIssueMessage(zodError) {
  const errorKeyMap = /* @__PURE__ */ new Set();
  for (const iss of zodError.issues) {
    const issuePath = flattenIssuePath(iss.path);
    if (issuePath.length > 0) {
      errorKeyMap.add(issuePath);
    }
  }
  const errorKeys = Array.from(errorKeyMap);
  if (errorKeys.length === 0) {
    let rootExpectedType = "variable";
    if (zodError.issues.length > 0) {
      const iss = zodError.issues[0];
      if (iss !== void 0 && "expected" in iss && typeof iss.expected === "string") {
        rootExpectedType = iss.expected;
      }
    }
    return `Failed to validate ${rootExpectedType}`;
  }
  return `Failed to validate keys: ${truncate(errorKeys.join(", "), 100)}`;
}
__name(formatIssueMessage, "formatIssueMessage");
function applyZodErrorsToEvent(limit, event, saveAttachments = false, hint) {
  if (!event.exception?.values || !hint.originalException || !originalExceptionIsZodError(hint.originalException) || hint.originalException.issues.length === 0) {
    return event;
  }
  try {
    const issuesToFlatten = saveAttachments ? hint.originalException.issues : hint.originalException.issues.slice(0, limit);
    const flattenedIssues = issuesToFlatten.map(flattenIssue);
    if (saveAttachments) {
      if (!Array.isArray(hint.attachments)) {
        hint.attachments = [];
      }
      hint.attachments.push({
        filename: "zod_issues.json",
        data: JSON.stringify({
          issues: flattenedIssues
        })
      });
    }
    return {
      ...event,
      exception: {
        ...event.exception,
        values: [
          {
            ...event.exception.values[0],
            value: formatIssueMessage(hint.originalException)
          },
          ...event.exception.values.slice(1)
        ]
      },
      extra: {
        ...event.extra,
        "zoderror.issues": flattenedIssues.slice(0, limit)
      }
    };
  } catch (e) {
    return {
      ...event,
      extra: {
        ...event.extra,
        "zoderrors sentry integration parse error": {
          message: "an exception was thrown while processing ZodError within applyZodErrorsToEvent()",
          error: e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : "unknown"
        }
      }
    };
  }
}
__name(applyZodErrorsToEvent, "applyZodErrorsToEvent");
var zodErrorsIntegration = defineIntegration2((options = {}) => {
  const limit = options.limit ?? DEFAULT_LIMIT;
  return {
    name: INTEGRATION_NAME,
    processEvent(originalEvent, hint) {
      const processedEvent = applyZodErrorsToEvent(limit, originalEvent, options.saveAttachments, hint);
      return processedEvent;
    }
  };
});
function setupIntegrations2(integrations, sdk) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    integrationIndex[integration.name] = integration;
    if (typeof integration.setupOnce === "function") {
      integration.setupOnce();
    }
    const client = sdk.getClient();
    if (!client) {
      return;
    }
    if (typeof integration.setup === "function") {
      integration.setup(client);
    }
    if (typeof integration.preprocessEvent === "function") {
      const callback = integration.preprocessEvent.bind(integration);
      client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
    }
    if (typeof integration.processEvent === "function") {
      const callback = integration.processEvent.bind(integration);
      const processor = Object.assign((event, hint) => callback(event, hint, client), {
        id: integration.name
      });
      client.addEventProcessor(processor);
    }
  });
  return integrationIndex;
}
__name(setupIntegrations2, "setupIntegrations");
var ToucanClient = class extends ServerRuntimeClient {
  static {
    __name(this, "ToucanClient");
  }
  /**
   * Some functions need to access the scope (Toucan instance) this client is bound to,
   * but calling 'getCurrentHub()' is unsafe because it uses globals.
   * So we store a reference to the Hub after binding to it and provide it to methods that need it.
   */
  #sdk = null;
  #integrationsInitialized = false;
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
          version: "4.1.1"
        }
      ],
      version: "4.1.1"
    };
    super(options);
  }
  /**
   * By default, integrations are stored in a global. We want to store them in a local instance because they may have contextual data, such as event request.
   */
  setupIntegrations() {
    if (this._isEnabled() && !this.#integrationsInitialized && this.#sdk) {
      this._integrations = setupIntegrations2(this._options.integrations, this.#sdk);
      this.#integrationsInitialized = true;
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
var Toucan = class _Toucan extends Scope {
  static {
    __name(this, "Toucan");
  }
  #options;
  constructor(options) {
    super();
    options.defaultIntegrations = options.defaultIntegrations === false ? [] : [
      ...Array.isArray(options.defaultIntegrations) ? options.defaultIntegrations : [
        requestDataIntegration(options.requestDataOptions),
        linkedErrorsIntegration(),
        zodErrorsIntegration()
      ]
    ];
    if (options.release === void 0) {
      const detectedRelease = getSentryRelease();
      if (detectedRelease !== void 0) {
        options.release = detectedRelease;
      }
    }
    this.#options = options;
    this.attachNewClient();
  }
  /**
   * Creates new ToucanClient and links it to this instance.
   */
  attachNewClient() {
    const client = new ToucanClient({
      ...this.#options,
      transport: makeFetchTransport,
      integrations: getIntegrationsToSetup(this.#options),
      stackParser: stackParserFromStackParserOptions(this.#options.stackParser || defaultStackParser),
      transportOptions: {
        ...this.#options.transportOptions,
        context: this.#options.context
      }
    });
    this.setClient(client);
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
  /**
   * Add a breadcrumb to the current scope.
   */
  addBreadcrumb(breadcrumb, maxBreadcrumbs = 100) {
    const client = this.getClient();
    const max = client.getOptions().maxBreadcrumbs || maxBreadcrumbs;
    return super.addBreadcrumb(breadcrumb, max);
  }
  /**
   * Clone all data from this instance into a new Toucan instance.
   *
   * @override
   * @returns New Toucan instance.
   */
  clone() {
    const toucan = new _Toucan({ ...this.#options });
    toucan._breadcrumbs = [...this._breadcrumbs];
    toucan._tags = { ...this._tags };
    toucan._extra = { ...this._extra };
    toucan._contexts = { ...this._contexts };
    toucan._user = this._user;
    toucan._level = this._level;
    toucan._session = this._session;
    toucan._transactionName = this._transactionName;
    toucan._fingerprint = this._fingerprint;
    toucan._eventProcessors = [...this._eventProcessors];
    toucan._requestSession = this._requestSession;
    toucan._attachments = [...this._attachments];
    toucan._sdkProcessingMetadata = { ...this._sdkProcessingMetadata };
    toucan._propagationContext = { ...this._propagationContext };
    toucan._lastEventId = this._lastEventId;
    return toucan;
  }
  /**
   * Creates a new scope with and executes the given operation within.
   * The scope is automatically removed once the operation
   * finishes or throws.
   */
  withScope(callback) {
    const toucan = this.clone();
    return callback(toucan);
  }
};

// src/middleware/sentry.ts
function sentry(options) {
  return async (c, next) => {
    if (c.env.ENV !== "production") return await next();
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
app.get("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});
var src_default = app;

// ../node_modules/.pnpm/wrangler@4.28.1_@cloudflare+workers-types@4.20250810.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
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

// .wrangler/tmp/bundle-sqaiDV/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = src_default;

// ../node_modules/.pnpm/wrangler@4.28.1_@cloudflare+workers-types@4.20250810.0/node_modules/wrangler/templates/middleware/common.ts
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

// .wrangler/tmp/bundle-sqaiDV/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
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
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
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
