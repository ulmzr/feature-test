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
var templatecacheSvg = {};
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
function svgToFragment(content) {
  if (templatecacheSvg[content])
    return templatecacheSvg[content].cloneNode(true);
  let t = document.createElement("template");
  t.innerHTML = "<svg>" + content + "</svg>";
  let result = document.createDocumentFragment();
  let svg = t.content[firstChild];
  while (svg[firstChild])
    result.appendChild(svg[firstChild]);
  templatecacheSvg[content] = result.cloneNode(true);
  return result;
}
function $$removeElements(el, last) {
  let next;
  while (el) {
    next = el.nextSibling;
    el.remove();
    if (el == last)
      break;
    el = next;
  }
}
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
var $onMount = (fn) => current_component._m.push(fn);
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
function $$htmlBlock($cd, tag, fn) {
  let lastElement;
  let create = (html) => {
    let fr;
    if (tag.parentElement instanceof SVGElement)
      fr = svgToFragment(html);
    else
      fr = $$htmlToFragment(html);
    lastElement = fr.lastChild;
    insertAfter(tag, fr);
  };
  let destroy = () => {
    if (!lastElement)
      return;
    let next, el = tag.nextSibling;
    while (el) {
      next = el.nextSibling;
      el.remove();
      if (el == lastElement)
        break;
      el = next;
    }
    lastElement = null;
  };
  $watch($cd, fn, (html) => {
    destroy();
    if (html)
      create(html);
  }, { ro: true });
}
function $$ifBlock($cd, $parentElement, fn, tpl, build, tplElse, buildElse) {
  let childCD;
  let first, last;
  function create(fr, builder) {
    childCD = $cd.new();
    let tpl2 = fr.cloneNode(true);
    builder(childCD, tpl2);
    first = tpl2[firstChild];
    last = tpl2.lastChild;
    insertAfter($parentElement, tpl2);
  }
  function destroy() {
    if (!childCD)
      return;
    childCD.destroy();
    childCD = null;
    $$removeElements(first, last);
    first = last = null;
  }
  $watch($cd, fn, (value) => {
    if (value) {
      destroy();
      create(tpl, build);
    } else {
      destroy();
      if (buildElse)
        create(tplElse, buildElse);
    }
  });
}

// src/App.xht
var App_default = makeComponent(($option, $$apply) => {
  const $component = current_component;
  let data;
  async function onMount() {
    $$apply();
    const res = await fetch("/api/home");
    $$apply();
    data = await res.json();
    $$apply();
    console.log(data);
  }
  {
    let $cd = $component.$cd;
    const $parentElement = $$htmlToFragment(`<main> <p>This site is under heavy construction</p> <h1>WEB UI FRAMEWORK</h1> <p>Meant to be the place where I could share Malina Examples.</p> <p> <small> Created with love using <a href="/api/home">Malina.js</a> . </small> </p> <br/> <> </main>`);
    let el1 = $parentElement[firstChild][childNodes][11];
    $$ifBlock($cd, el1, () => !!data, $$htmlToFragment(` <p>This news, comes from backend.</p> <br/> <p><></p> `), ($cd2, $parentElement2) => {
      let el0 = $parentElement2[childNodes][5][firstChild];
      $$htmlBlock($cd2, el0, () => data.news);
    });
    $onMount(onMount);
    return $parentElement;
  }
}, $base);

// src/main.js
App_default(document.body);
//# sourceMappingURL=main.js.map
