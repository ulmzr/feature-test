(() => {
  // node_modules/malinajs/runtime.js
  var __app_onerror = console.error;
  var isFunction = (fn) => typeof fn == "function";
  var safeCall = (fn) => {
    try {
      return isFunction(fn) && fn();
    } catch (e) {
      __app_onerror(e);
    }
  };
  function $$removeItem(array, item) {
    let i = array.indexOf(item);
    if (i >= 0)
      array.splice(i, 1);
  }
  function $ChangeDetector(parent) {
    this.parent = parent;
    this.children = [];
    this.watchers = [];
    this._d = [];
    this.prefix = [];
    this.$$ = parent?.$$;
  }
  $ChangeDetector.prototype.new = function() {
    var cd = new $ChangeDetector(this);
    this.children.push(cd);
    return cd;
  };
  $ChangeDetector.prototype.destroy = function(option) {
    if (option !== false && this.parent)
      $$removeItem(this.parent.children, this);
    this.watchers.length = 0;
    this.prefix.length = 0;
    this._d.map(safeCall);
    this._d.length = 0;
    this.children.map((cd) => cd.destroy(false));
    this.children.length = 0;
  };
  var isArray = (a) => Array.isArray(a);
  var compareDeep = (a, b, lvl) => {
    if (lvl < 0 || !a || !b)
      return a !== b;
    if (a === b)
      return false;
    let o0 = typeof a == "object";
    let o1 = typeof b == "object";
    if (!(o0 && o1))
      return a !== b;
    let a0 = isArray(a);
    let a1 = isArray(b);
    if (a0 !== a1)
      return true;
    if (a0) {
      if (a.length !== b.length)
        return true;
      for (let i = 0; i < a.length; i++) {
        if (compareDeep(a[i], b[i], lvl - 1))
          return true;
      }
    } else {
      let set = {};
      for (let k in a) {
        if (compareDeep(a[k], b[k], lvl - 1))
          return true;
        set[k] = true;
      }
      for (let k in b) {
        if (set[k])
          continue;
        return true;
      }
    }
    return false;
  };
  function cloneDeep(d, lvl) {
    if (lvl < 0 || !d)
      return d;
    if (typeof d == "object") {
      if (d instanceof Date)
        return d;
      if (d instanceof Element)
        return d;
      if (isArray(d))
        return d.map((i) => cloneDeep(i, lvl - 1));
      let r = {};
      for (let k in d)
        r[k] = cloneDeep(d[k], lvl - 1);
      return r;
    }
    return d;
  }
  function $$deepComparator(depth) {
    return function(w, value) {
      let diff = compareDeep(w.value, value, depth);
      diff && (w.value = cloneDeep(value, depth), !w.idle && w.cb(value));
      w.idle = false;
      return !w.ro && diff ? 1 : 0;
    };
  }
  var $$compareDeep = $$deepComparator(10);
  var templatecache = {};
  var insertAfter = (label, node) => {
    label.parentNode.insertBefore(node, label.nextSibling);
  };
  var $$htmlToFragment = (html) => {
    if (templatecache[html])
      return templatecache[html].cloneNode(true);
    let t = document.createElement("template");
    t.innerHTML = html.replace(/<>/g, "<!---->");
    let result = t.content;
    templatecache[html] = result.cloneNode(true);
    return result;
  };
  var $insertElementByOption = ($label, $option, $element) => {
    if ($option.afterElement) {
      insertAfter($label, $element);
    } else {
      $label.innerHTML = "";
      $label.appendChild($element);
    }
  };
  var addStyles = (id, content) => {
    if (document.head.querySelector("style#" + id))
      return;
    let style = document.createElement("style");
    style.id = id;
    style.innerHTML = content;
    document.head.appendChild(style);
  };

  // src/App.xht
  var App_default = ($element, $option = {}) => {
    {
      const $parentElement = $$htmlToFragment(`<main> <p>This site is under heavy construction</p> <h1> SOFTWARE AND INTERFACE <br/> GARNER </h1> <p>Meant to be the place where I could share talents.</p> <small> <p> Created with Love using <a href="https://malinajs.github.io/docs/">MalinaJS</a> . <br/> The Web UI Framework. </p> </small> </main>`);
      addStyles("mogh5b8", `h1,h2,h3,h4,h5,h6{margin:0 0 0.5em 0;font-weight:400;line-height:1.2}h1{font-size:2em}a{color:inherit;text-decoration:none}a:hover{color:#ff3e00}main{text-align:center;padding:1em;max-width:240px;margin:0 auto}h1{color:#ff3e00;text-transform:uppercase;font-size:4em;font-weight:100}@media (min-width:640px){main{max-width:none}}`);
      $insertElementByOption($element, $option, $parentElement);
    }
  };

  // src/main.js
  App_default(document.body);
})();
