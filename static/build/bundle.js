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
  function $watch(cd, fn, callback, w) {
    if (!w)
      w = {};
    w.fn = fn;
    w.cb = callback;
    if (!("value" in w))
      w.value = NaN;
    cd.watchers.push(w);
    return w;
  }
  function $watchReadOnly(cd, fn, callback) {
    return $watch(cd, fn, callback, { ro: true });
  }
  function addEvent(cd, el, event, callback) {
    el.addEventListener(event, callback);
    cd_onDestroy(cd, () => {
      el.removeEventListener(event, callback);
    });
  }
  function cd_onDestroy(cd, fn) {
    if (fn)
      cd._d.push(fn);
  }
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
  function $digest($cd) {
    let loop = 10;
    let w;
    while (loop >= 0) {
      let changes = 0;
      let index = 0;
      let queue = [];
      let i, value, cd = $cd;
      while (cd) {
        for (i = 0; i < cd.prefix.length; i++)
          cd.prefix[i]();
        for (i = 0; i < cd.watchers.length; i++) {
          w = cd.watchers[i];
          value = w.fn();
          if (w.value !== value) {
            if (w.cmp) {
              changes += w.cmp(w, value);
            } else {
              w.value = value;
              if (!w.ro)
                changes++;
              w.cb(w.value);
            }
          }
        }
        if (cd.children.length)
          queue.push.apply(queue, cd.children);
        cd = queue[index++];
      }
      loop--;
      if (!changes)
        break;
    }
    if (loop < 0)
      __app_onerror("Infinity changes: ", w);
  }
  var templatecache = {};
  var $$uniqIndex = 1;
  var childNodes = "childNodes";
  var firstChild = "firstChild";
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
  var _tick_list = [];
  var _tick_planned = {};
  function $tick(fn, uniq) {
    if (uniq) {
      if (_tick_planned[uniq])
        return;
      _tick_planned[uniq] = true;
    }
    _tick_list.push(fn);
    if (_tick_planned.$tick)
      return;
    _tick_planned.$tick = true;
    setTimeout(() => {
      _tick_planned = {};
      let list = _tick_list;
      _tick_list = [];
      list.map(safeCall);
    }, 0);
  }
  var current_component;
  var $context;
  var $onDestroy = (fn) => current_component._d.push(fn);
  var $insertElementByOption = ($label, $option, $element) => {
    if ($option.afterElement) {
      insertAfter($label, $element);
    } else {
      $label.innerHTML = "";
      $label.appendChild($element);
    }
  };
  var $base = {
    a: ($component) => {
      let $cd = new $ChangeDetector();
      $cd.$$ = $component;
      $onDestroy(() => $cd.destroy());
      let id = `a${$$uniqIndex++}`;
      let process;
      let apply = (r) => {
        if (process)
          return r;
        $tick(() => {
          try {
            process = true;
            $digest($cd);
          } finally {
            process = false;
          }
        }, id);
        return r;
      };
      $component.$cd = $cd;
      $component.apply = apply;
      $component.push = apply;
    },
    b: ($component) => {
      $component.apply();
    }
  };
  var makeComponent = (init, $base2) => {
    return ($element, $option = {}) => {
      let prev = current_component;
      $context = $option.context || {};
      let $component = current_component = {
        $option,
        destroy: () => $component._d.map(safeCall),
        context: $context,
        exported: {},
        _d: [],
        _m: []
      };
      $base2.a($component);
      try {
        $insertElementByOption($element, $option, init($option, $component.apply));
        $base2.b($component);
      } finally {
        current_component = prev;
        $context = null;
      }
      $component._d.push(...$component._m.map(safeCall));
      return $component;
    };
  };
  var addStyles = (id, content) => {
    if (document.head.querySelector("style#" + id))
      return;
    let style = document.createElement("style");
    style.id = id;
    style.innerHTML = content;
    document.head.appendChild(style);
  };
  var bindText = (cd, element, fn) => {
    $watchReadOnly(cd, () => "" + fn(), (value) => {
      element.textContent = value;
    });
  };
  var bindStyle = (cd, element, name, fn) => {
    $watchReadOnly(cd, fn, (value) => {
      element.style[name] = value;
    });
  };
  var bindAttributeBase = (element, name, value) => {
    if (value != null)
      element.setAttribute(name, value);
    else
      element.removeAttribute(name);
  };
  var bindAttribute = (cd, element, name, fn) => {
    $watchReadOnly(cd, () => "" + fn(), (value) => bindAttributeBase(element, name, value));
  };
  var bindInput = (cd, element, name, get, set) => {
    let w = $watchReadOnly(cd, name == "checked" ? () => !!get() : get, (value) => {
      element[name] = value == null ? "" : value;
    });
    addEvent(cd, element, "input", () => {
      set(w.value = element[name]);
    });
  };

  // src/client/App.xht
  var App_default = makeComponent(($option, $$apply) => {
    const $component = current_component;
    let name = "world";
    var degrees;
    {
      let $cd = $component.$cd;
      const $parentElement = $$htmlToFragment(`<img src="./malinajs.svg" alt="Malina.js Logo" class="m0qio7k"/> <h1 class="m0qio7k"> </h1> <div class="m0qio7k"><input type="text" class="m0qio7k"/></div><div class="m0qio7k"><a class="m0qio7k">Check backend endpoint</a></div><div class="m0qio7k"> Edit and save files in <code>src</code> directory to reload </div>`);
      let el0 = $parentElement[firstChild];
      let el1 = $parentElement[childNodes][2][firstChild];
      let el3 = $parentElement[childNodes][4][firstChild];
      let el4 = $parentElement[childNodes][5][firstChild];
      bindStyle($cd, el0, "transform", () => `rotate(${degrees}deg)`);
      bindText($cd, el1, () => `Hello................................. ` + name + `!`);
      bindInput($cd, el3, "value", () => name, (a2) => {
        name = a2;
        $$apply();
      });
      $tick(() => {
        let $element = el3;
        $element.focus();
        $$apply();
      });
      bindAttribute($cd, el4, "href", () => `/hello/` + name);
      $cd.prefix.push(() => {
        degrees = (name.length - 5) * 5;
      });
      addStyles("m0qio7k", `img.m0qio7k{display:block;width:200px;margin:60px auto;transition:0.2s}h1.m0qio7k,div.m0qio7k{text-align:center;min-width:300px;margin:40px auto}input.m0qio7k{font-size:24px}a.m0qio7k{color:#009615}`);
      return $parentElement;
    }
  }, $base);

  // src/client/main.js
  App_default(document.body);
})();
//# sourceMappingURL=bundle.js.map
