(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by jer0dh on 5/11/16.
 */
var mainView = require('./views/mainView.js');
var ideasModel = require('./models/ideasModel.js');
var mainController = require('./controllers/mainController.js');

//removeIf(production)
console.log('Initializing App');
//endRemoveIf(production)

//removeIf(production)
console.log('Adding Main View');
//endRemoveIf(production)

jQuery('document').ready(function () {
  ideasModel = ideasModel(jhtIdeas); //initialize model with data from page
  mainController = mainController(ideasModel);
  mainView = mainView(ideasModel, mainController);
  mainView.init();
  //removeIf(production)
  window.ideasModel = ideasModel;
  //endRemoveIf(production)
});

},{"./controllers/mainController.js":2,"./models/ideasModel.js":3,"./views/mainView.js":4}],2:[function(require,module,exports){
/**
 * Created by jer0dh on 5/11/16.
 */

module.exports = function (model) {
    model = model || {};

    api = {
        onClickAdd: function (e, viewmodel) {
            // send request to add to model with success callback and error callback
            // grey out button and spinner until one or other
            console.log(model);
            model.data.posts.push(model.newPost);
        }
    };
    return api;
};

},{}],3:[function(require,module,exports){
/**
 * Created by jer0dh on 5/11/16.
 */

module.exports = function (opt) {

    opt = opt || {};
    data = {};
    data.posts = typeof opt.posts !== 'undefined' ? opt.posts : {}; //we are merely passing reference- in future might be better to clone

    api = {
        data: { posts: data.posts }
    };

    return api;
};

},{}],4:[function(require,module,exports){
/**
 * Created by jer0dh on 5/11/16.
 */
var rivets = require('rivets');

module.exports = function (model, controller) {
    model = model || {};
    model.newPost = {}; //for a new idea before added to posts
    model.newPost.post_title = '';
    controller = controller || {};
    var html = `
<div class="jhtIdeas_container">
   <ul>
    <li rv-each-idea="model.data.posts">
        <h3 rv-text="idea.post_title"></h3>
    </li>
    <li><input rv-value="model.new.post_title" /><button rv-on-click="controller.onClickAdd">Add</button></li>
   </ul>
 </div> 

`;

    var main = document.getElementById('jhtMain');

    var init = function () {

        main.innerHTML = html;

        rivets.bind(main, { model: model, controller: controller });
    };

    api = {
        init: init
    };

    return api;
};

},{"rivets":5}],5:[function(require,module,exports){
// Rivets.js
// version: 0.8.1
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindMethod, unbindMethod, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {
    options: ['prefix', 'templateDelimiters', 'rootInterface', 'preloadData', 'handler'],
    extensions: ['binders', 'formatters', 'components', 'adapters'],
    "public": {
      binders: {},
      components: {},
      formatters: {},
      adapters: {},
      prefix: 'rv',
      templateDelimiters: ['{', '}'],
      rootInterface: '.',
      preloadData: true,
      handler: function(context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      },
      configure: function(options) {
        var descriptor, key, option, value;
        if (options == null) {
          options = {};
        }
        for (option in options) {
          value = options[option];
          if (option === 'binders' || option === 'components' || option === 'formatters' || option === 'adapters') {
            for (key in value) {
              descriptor = value[key];
              Rivets[option][key] = descriptor;
            }
          } else {
            Rivets["public"][option] = value;
          }
        }
      },
      bind: function(el, models, options) {
        var view;
        if (models == null) {
          models = {};
        }
        if (options == null) {
          options = {};
        }
        view = new Rivets.View(el, models, options);
        view.bind();
        return view;
      },
      init: function(component, el, data) {
        var scope, view;
        if (data == null) {
          data = {};
        }
        if (el == null) {
          el = document.createElement('div');
        }
        component = Rivets["public"].components[component];
        el.innerHTML = component.template.call(this, el);
        scope = component.initialize.call(this, el, data);
        view = new Rivets.View(el, scope);
        view.bind();
        return view;
      }
    }
  };

  if (window['jQuery'] || window['$']) {
    _ref = 'on' in jQuery.prototype ? ['on', 'off'] : ['bind', 'unbind'], bindMethod = _ref[0], unbindMethod = _ref[1];
    Rivets.Util = {
      bindEvent: function(el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function(el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function(el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function() {
        if ('addEventListener' in window) {
          return function(el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function() {
        if ('removeEventListener' in window) {
          return function(el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function(el) {
        var o, _i, _len, _results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
        } else {
          return el.value;
        }
      }
    };
  }

  Rivets.TypeParser = (function() {
    function TypeParser() {}

    TypeParser.types = {
      primitive: 0,
      keypath: 1
    };

    TypeParser.parse = function(string) {
      if (/^'.*'$|^".*"$/.test(string)) {
        return {
          type: this.types.primitive,
          value: string.slice(1, -1)
        };
      } else if (string === 'true') {
        return {
          type: this.types.primitive,
          value: true
        };
      } else if (string === 'false') {
        return {
          type: this.types.primitive,
          value: false
        };
      } else if (string === 'null') {
        return {
          type: this.types.primitive,
          value: null
        };
      } else if (string === 'undefined') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (isNaN(Number(string)) === false) {
        return {
          type: this.types.primitive,
          value: Number(string)
        };
      } else {
        return {
          type: this.types.keypath,
          value: string
        };
      }
    };

    return TypeParser;

  })();

  Rivets.TextTemplateParser = (function() {
    function TextTemplateParser() {}

    TextTemplateParser.types = {
      text: 0,
      binding: 1
    };

    TextTemplateParser.parse = function(template, delimiters) {
      var index, lastIndex, lastToken, length, substring, tokens, value;
      tokens = [];
      length = template.length;
      index = 0;
      lastIndex = 0;
      while (lastIndex < length) {
        index = template.indexOf(delimiters[0], lastIndex);
        if (index < 0) {
          tokens.push({
            type: this.types.text,
            value: template.slice(lastIndex)
          });
          break;
        } else {
          if (index > 0 && lastIndex < index) {
            tokens.push({
              type: this.types.text,
              value: template.slice(lastIndex, index)
            });
          }
          lastIndex = index + delimiters[0].length;
          index = template.indexOf(delimiters[1], lastIndex);
          if (index < 0) {
            substring = template.slice(lastIndex - delimiters[1].length);
            lastToken = tokens[tokens.length - 1];
            if ((lastToken != null ? lastToken.type : void 0) === this.types.text) {
              lastToken.value += substring;
            } else {
              tokens.push({
                type: this.types.text,
                value: substring
              });
            }
            break;
          }
          value = template.slice(lastIndex, index).trim();
          tokens.push({
            type: this.types.binding,
            value: value
          });
          lastIndex = index + delimiters[1].length;
        }
      }
      return tokens;
    };

    return TextTemplateParser;

  })();

  Rivets.View = (function() {
    function View(els, models, options) {
      var k, option, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.els = els;
      this.models = models;
      if (options == null) {
        options = {};
      }
      this.update = __bind(this.update, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.select = __bind(this.select, this);
      this.traverse = __bind(this.traverse, this);
      this.build = __bind(this.build, this);
      this.buildBinding = __bind(this.buildBinding, this);
      this.bindingRegExp = __bind(this.bindingRegExp, this);
      this.options = __bind(this.options, this);
      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      _ref1 = Rivets.extensions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this[option] = {};
        if (options[option]) {
          _ref2 = options[option];
          for (k in _ref2) {
            v = _ref2[k];
            this[option][k] = v;
          }
        }
        _ref3 = Rivets["public"][option];
        for (k in _ref3) {
          v = _ref3[k];
          if ((_base = this[option])[k] == null) {
            _base[k] = v;
          }
        }
      }
      _ref4 = Rivets.options;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        option = _ref4[_j];
        this[option] = (_ref5 = options[option]) != null ? _ref5 : Rivets["public"][option];
      }
      this.build();
    }

    View.prototype.options = function() {
      var option, options, _i, _len, _ref1;
      options = {};
      _ref1 = Rivets.extensions.concat(Rivets.options);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        options[option] = this[option];
      }
      return options;
    };

    View.prototype.bindingRegExp = function() {
      return new RegExp("^" + this.prefix + "-");
    };

    View.prototype.buildBinding = function(binding, node, type, declaration) {
      var context, ctx, dependencies, keypath, options, pipe, pipes;
      options = {};
      pipes = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = declaration.split('|');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          pipe = _ref1[_i];
          _results.push(pipe.trim());
        }
        return _results;
      })();
      context = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = pipes.shift().split('<');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ctx = _ref1[_i];
          _results.push(ctx.trim());
        }
        return _results;
      })();
      keypath = context.shift();
      options.formatters = pipes;
      if (dependencies = context.shift()) {
        options.dependencies = dependencies.split(/\s+/);
      }
      return this.bindings.push(new Rivets[binding](this, node, type, keypath, options));
    };

    View.prototype.build = function() {
      var el, parse, _i, _len, _ref1;
      this.bindings = [];
      parse = (function(_this) {
        return function(node) {
          var block, childNode, delimiters, n, parser, text, token, tokens, _i, _j, _len, _len1, _ref1, _results;
          if (node.nodeType === 3) {
            parser = Rivets.TextTemplateParser;
            if (delimiters = _this.templateDelimiters) {
              if ((tokens = parser.parse(node.data, delimiters)).length) {
                if (!(tokens.length === 1 && tokens[0].type === parser.types.text)) {
                  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
                    token = tokens[_i];
                    text = document.createTextNode(token.value);
                    node.parentNode.insertBefore(text, node);
                    if (token.type === 1) {
                      _this.buildBinding('TextBinding', text, null, token.value);
                    }
                  }
                  node.parentNode.removeChild(node);
                }
              }
            }
          } else if (node.nodeType === 1) {
            block = _this.traverse(node);
          }
          if (!block) {
            _ref1 = (function() {
              var _k, _len1, _ref1, _results1;
              _ref1 = node.childNodes;
              _results1 = [];
              for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                n = _ref1[_k];
                _results1.push(n);
              }
              return _results1;
            })();
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              childNode = _ref1[_j];
              _results.push(parse(childNode));
            }
            return _results;
          }
        };
      })(this);
      _ref1 = this.els;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        parse(el);
      }
      this.bindings.sort(function(a, b) {
        var _ref2, _ref3;
        return (((_ref2 = b.binder) != null ? _ref2.priority : void 0) || 0) - (((_ref3 = a.binder) != null ? _ref3.priority : void 0) || 0);
      });
    };

    View.prototype.traverse = function(node) {
      var attribute, attributes, binder, bindingRegExp, block, identifier, regexp, type, value, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      bindingRegExp = this.bindingRegExp();
      block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
      _ref1 = node.attributes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          if (!(binder = this.binders[type])) {
            _ref2 = this.binders;
            for (identifier in _ref2) {
              value = _ref2[identifier];
              if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
                if (regexp.test(type)) {
                  binder = value;
                }
              }
            }
          }
          binder || (binder = this.binders['*']);
          if (binder.block) {
            block = true;
            attributes = [attribute];
          }
        }
      }
      _ref3 = attributes || node.attributes;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        attribute = _ref3[_j];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          this.buildBinding('Binding', node, type, attribute.value);
        }
      }
      if (!block) {
        type = node.nodeName.toLowerCase();
        if (this.components[type] && !node._bound) {
          this.bindings.push(new Rivets.ComponentBinding(this, node, type));
          block = true;
        }
      }
      return block;
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.bind());
      }
      return _results;
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.unbind());
      }
      return _results;
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(typeof binding.sync === "function" ? binding.sync() : void 0);
      }
      return _results;
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.select(function(b) {
        var _ref1;
        return (_ref1 = b.binder) != null ? _ref1.publishes : void 0;
      });
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(binding.publish());
      }
      return _results;
    };

    View.prototype.update = function(models) {
      var binding, key, model, _i, _len, _ref1, _results;
      if (models == null) {
        models = {};
      }
      for (key in models) {
        model = models[key];
        this.models[key] = model;
      }
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        _results.push(typeof binding.update === "function" ? binding.update(models) : void 0);
      }
      return _results;
    };

    return View;

  })();

  Rivets.Binding = (function() {
    function Binding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.getValue = __bind(this.getValue, this);
      this.update = __bind(this.update, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.set = __bind(this.set, this);
      this.eventHandler = __bind(this.eventHandler, this);
      this.formattedValue = __bind(this.formattedValue, this);
      this.parseTarget = __bind(this.parseTarget, this);
      this.observe = __bind(this.observe, this);
      this.setBinder = __bind(this.setBinder, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
      this.model = void 0;
      this.setBinder();
    }

    Binding.prototype.setBinder = function() {
      var identifier, regexp, value, _ref1;
      if (!(this.binder = this.view.binders[this.type])) {
        _ref1 = this.view.binders;
        for (identifier in _ref1) {
          value = _ref1[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
            if (regexp.test(this.type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace(/\*/g, '(.+)')) + "$").exec(this.type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = this.view.binders['*']);
      if (this.binder instanceof Function) {
        return this.binder = {
          routine: this.binder
        };
      }
    };

    Binding.prototype.observe = function(obj, keypath, callback) {
      return Rivets.sightglass(obj, keypath, callback, {
        root: this.view.rootInterface,
        adapters: this.view.adapters
      });
    };

    Binding.prototype.parseTarget = function() {
      var token;
      token = Rivets.TypeParser.parse(this.keypath);
      if (token.type === 0) {
        return this.value = token.value;
      } else {
        this.observer = this.observe(this.view.models, this.keypath, this.sync);
        return this.model = this.observer.target;
      }
    };

    Binding.prototype.formattedValue = function(value) {
      var ai, arg, args, fi, formatter, id, observer, processedArgs, _base, _i, _j, _len, _len1, _ref1;
      _ref1 = this.formatters;
      for (fi = _i = 0, _len = _ref1.length; _i < _len; fi = ++_i) {
        formatter = _ref1[fi];
        args = formatter.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g);
        id = args.shift();
        formatter = this.view.formatters[id];
        args = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
            arg = args[_j];
            _results.push(Rivets.TypeParser.parse(arg));
          }
          return _results;
        })();
        processedArgs = [];
        for (ai = _j = 0, _len1 = args.length; _j < _len1; ai = ++_j) {
          arg = args[ai];
          processedArgs.push(arg.type === 0 ? arg.value : ((_base = this.formatterObservers)[fi] || (_base[fi] = {}), !(observer = this.formatterObservers[fi][ai]) ? (observer = this.observe(this.view.models, arg.value, this.sync), this.formatterObservers[fi][ai] = observer) : void 0, observer.value()));
        }
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = formatter.read.apply(formatter, [value].concat(__slice.call(processedArgs)));
        } else if (formatter instanceof Function) {
          value = formatter.apply(null, [value].concat(__slice.call(processedArgs)));
        }
      }
      return value;
    };

    Binding.prototype.eventHandler = function(fn) {
      var binding, handler;
      handler = (binding = this).view.handler;
      return function(ev) {
        return handler.call(fn, this, ev, binding);
      };
    };

    Binding.prototype.set = function(value) {
      var _ref1;
      value = value instanceof Function && !this.binder["function"] ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      var dependency, observer;
      return this.set((function() {
        var _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        if (this.observer) {
          if (this.model !== this.observer.target) {
            _ref1 = this.dependencies;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              observer = _ref1[_i];
              observer.unobserve();
            }
            this.dependencies = [];
            if (((this.model = this.observer.target) != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
              _ref3 = this.options.dependencies;
              for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                dependency = _ref3[_j];
                observer = this.observe(this.model, dependency, this.sync);
                this.dependencies.push(observer);
              }
            }
          }
          return this.observer.value();
        } else {
          return this.value;
        }
      }).call(this));
    };

    Binding.prototype.publish = function() {
      var args, formatter, id, value, _i, _len, _ref1, _ref2, _ref3;
      if (this.observer) {
        value = this.getValue(this.el);
        _ref1 = this.formatters.slice(0).reverse();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          formatter = _ref1[_i];
          args = formatter.split(/\s+/);
          id = args.shift();
          if ((_ref2 = this.view.formatters[id]) != null ? _ref2.publish : void 0) {
            value = (_ref3 = this.view.formatters[id]).publish.apply(_ref3, [value].concat(__slice.call(args)));
          }
        }
        return this.observer.setValue(value);
      }
    };

    Binding.prototype.bind = function() {
      var dependency, observer, _i, _len, _ref1, _ref2, _ref3;
      this.parseTarget();
      if ((_ref1 = this.binder.bind) != null) {
        _ref1.call(this, this.el);
      }
      if ((this.model != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
        _ref3 = this.options.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          dependency = _ref3[_i];
          observer = this.observe(this.model, dependency, this.sync);
          this.dependencies.push(observer);
        }
      }
      if (this.view.preloadData) {
        return this.sync();
      }
    };

    Binding.prototype.unbind = function() {
      var ai, args, fi, observer, _i, _len, _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.binder.unbind) != null) {
        _ref1.call(this, this.el);
      }
      if ((_ref2 = this.observer) != null) {
        _ref2.unobserve();
      }
      _ref3 = this.dependencies;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        observer = _ref3[_i];
        observer.unobserve();
      }
      this.dependencies = [];
      _ref4 = this.formatterObservers;
      for (fi in _ref4) {
        args = _ref4[fi];
        for (ai in args) {
          observer = args[ai];
          observer.unobserve();
        }
      }
      return this.formatterObservers = {};
    };

    Binding.prototype.update = function(models) {
      var _ref1, _ref2;
      if (models == null) {
        models = {};
      }
      this.model = (_ref1 = this.observer) != null ? _ref1.target : void 0;
      return (_ref2 = this.binder.update) != null ? _ref2.call(this, models) : void 0;
    };

    Binding.prototype.getValue = function(el) {
      if (this.binder && (this.binder.getValue != null)) {
        return this.binder.getValue.call(this, el);
      } else {
        return Rivets.Util.getInputValue(el);
      }
    };

    return Binding;

  })();

  Rivets.ComponentBinding = (function(_super) {
    __extends(ComponentBinding, _super);

    function ComponentBinding(view, el, type) {
      var attribute, bindingRegExp, propertyName, _i, _len, _ref1, _ref2;
      this.view = view;
      this.el = el;
      this.type = type;
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.locals = __bind(this.locals, this);
      this.component = this.view.components[this.type];
      this["static"] = {};
      this.observers = {};
      this.upstreamObservers = {};
      bindingRegExp = view.bindingRegExp();
      _ref1 = this.el.attributes || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (!bindingRegExp.test(attribute.name)) {
          propertyName = this.camelCase(attribute.name);
          if (__indexOf.call((_ref2 = this.component["static"]) != null ? _ref2 : [], propertyName) >= 0) {
            this["static"][propertyName] = attribute.value;
          } else {
            this.observers[propertyName] = attribute.value;
          }
        }
      }
    }

    ComponentBinding.prototype.sync = function() {};

    ComponentBinding.prototype.update = function() {};

    ComponentBinding.prototype.publish = function() {};

    ComponentBinding.prototype.locals = function() {
      var key, observer, result, value, _ref1, _ref2;
      result = {};
      _ref1 = this["static"];
      for (key in _ref1) {
        value = _ref1[key];
        result[key] = value;
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        result[key] = observer.value();
      }
      return result;
    };

    ComponentBinding.prototype.camelCase = function(string) {
      return string.replace(/-([a-z])/g, function(grouped) {
        return grouped[1].toUpperCase();
      });
    };

    ComponentBinding.prototype.bind = function() {
      var k, key, keypath, observer, option, options, scope, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _results;
      if (!this.bound) {
        _ref1 = this.observers;
        for (key in _ref1) {
          keypath = _ref1[key];
          this.observers[key] = this.observe(this.view.models, keypath, ((function(_this) {
            return function(key) {
              return function() {
                return _this.componentView.models[key] = _this.observers[key].value();
              };
            };
          })(this)).call(this, key));
        }
        this.bound = true;
      }
      if (this.componentView != null) {
        return this.componentView.bind();
      } else {
        this.el.innerHTML = this.component.template.call(this);
        scope = this.component.initialize.call(this, this.el, this.locals());
        this.el._bound = true;
        options = {};
        _ref2 = Rivets.extensions;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          option = _ref2[_i];
          options[option] = {};
          if (this.component[option]) {
            _ref3 = this.component[option];
            for (k in _ref3) {
              v = _ref3[k];
              options[option][k] = v;
            }
          }
          _ref4 = this.view[option];
          for (k in _ref4) {
            v = _ref4[k];
            if ((_base = options[option])[k] == null) {
              _base[k] = v;
            }
          }
        }
        _ref5 = Rivets.options;
        for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
          option = _ref5[_j];
          options[option] = (_ref6 = this.component[option]) != null ? _ref6 : this.view[option];
        }
        this.componentView = new Rivets.View(this.el, scope, options);
        this.componentView.bind();
        _ref7 = this.observers;
        _results = [];
        for (key in _ref7) {
          observer = _ref7[key];
          _results.push(this.upstreamObservers[key] = this.observe(this.componentView.models, key, ((function(_this) {
            return function(key, observer) {
              return function() {
                return observer.setValue(_this.componentView.models[key]);
              };
            };
          })(this)).call(this, key, observer)));
        }
        return _results;
      }
    };

    ComponentBinding.prototype.unbind = function() {
      var key, observer, _ref1, _ref2, _ref3;
      _ref1 = this.upstreamObservers;
      for (key in _ref1) {
        observer = _ref1[key];
        observer.unobserve();
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        observer.unobserve();
      }
      return (_ref3 = this.componentView) != null ? _ref3.unbind.call(this) : void 0;
    };

    return ComponentBinding;

  })(Rivets.Binding);

  Rivets.TextBinding = (function(_super) {
    __extends(TextBinding, _super);

    function TextBinding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.sync = __bind(this.sync, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
    }

    TextBinding.prototype.binder = {
      routine: function(node, value) {
        return node.data = value != null ? value : '';
      }
    };

    TextBinding.prototype.sync = function() {
      return TextBinding.__super__.sync.apply(this, arguments);
    };

    return TextBinding;

  })(Rivets.Binding);

  Rivets["public"].binders.text = function(el, value) {
    if (el.textContent != null) {
      return el.textContent = value != null ? value : '';
    } else {
      return el.innerText = value != null ? value : '';
    }
  };

  Rivets["public"].binders.html = function(el, value) {
    return el.innerHTML = value != null ? value : '';
  };

  Rivets["public"].binders.show = function(el, value) {
    return el.style.display = value ? '' : 'none';
  };

  Rivets["public"].binders.hide = function(el, value) {
    return el.style.display = value ? 'none' : '';
  };

  Rivets["public"].binders.enabled = function(el, value) {
    return el.disabled = !value;
  };

  Rivets["public"].binders.disabled = function(el, value) {
    return el.disabled = !!value;
  };

  Rivets["public"].binders.checked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) === (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !!value;
      }
    }
  };

  Rivets["public"].binders.unchecked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) !== (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !value;
      }
    }
  };

  Rivets["public"].binders.value = {
    publishes: true,
    priority: 3000,
    bind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        this.event = el.tagName === 'SELECT' ? 'change' : 'input';
        return Rivets.Util.bindEvent(el, this.event, this.publish);
      }
    },
    unbind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        return Rivets.Util.unbindEvent(el, this.event, this.publish);
      }
    },
    routine: function(el, value) {
      var o, _i, _len, _ref1, _ref2, _ref3, _results;
      if (el.tagName === 'INPUT' && el.type === 'radio') {
        return el.setAttribute('value', value);
      } else if (window.jQuery != null) {
        el = jQuery(el);
        if ((value != null ? value.toString() : void 0) !== ((_ref1 = el.val()) != null ? _ref1.toString() : void 0)) {
          return el.val(value != null ? value : '');
        }
      } else {
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref2 = o.value, __indexOf.call(value, _ref2) >= 0));
            }
            return _results;
          }
        } else if ((value != null ? value.toString() : void 0) !== ((_ref3 = el.value) != null ? _ref3.toString() : void 0)) {
          return el.value = value != null ? value : '';
        }
      }
    }
  };

  Rivets["public"].binders["if"] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, declaration;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        declaration = el.getAttribute(attr);
        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
        this.bound = false;
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function() {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.unbind() : void 0;
    },
    routine: function(el, value) {
      var key, model, models, _ref1;
      if (!!value === !this.bound) {
        if (value) {
          models = {};
          _ref1 = this.view.models;
          for (key in _ref1) {
            model = _ref1[key];
            models[key] = model;
          }
          (this.nested || (this.nested = new Rivets.View(el, models, this.view.options()))).bind();
          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
          return this.bound = true;
        } else {
          el.parentNode.removeChild(el);
          this.nested.unbind();
          return this.bound = false;
        }
      }
    },
    update: function(models) {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
    }
  };

  Rivets["public"].binders.unless = {
    block: true,
    priority: 4000,
    bind: function(el) {
      return Rivets["public"].binders["if"].bind.call(this, el);
    },
    unbind: function() {
      return Rivets["public"].binders["if"].unbind.call(this);
    },
    routine: function(el, value) {
      return Rivets["public"].binders["if"].routine.call(this, el, !value);
    },
    update: function(models) {
      return Rivets["public"].binders["if"].update.call(this, models);
    }
  };

  Rivets["public"].binders['on-*'] = {
    "function": true,
    priority: 1000,
    unbind: function(el) {
      if (this.handler) {
        return Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
    },
    routine: function(el, value) {
      if (this.handler) {
        Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
      return Rivets.Util.bindEvent(el, this.args[0], this.handler = this.eventHandler(value));
    }
  };

  Rivets["public"].binders['each-*'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, view, _i, _len, _ref1;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.bind();
        }
      }
    },
    unbind: function(el) {
      var view, _i, _len, _ref1, _results;
      if (this.iterated != null) {
        _ref1 = this.iterated;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          _results.push(view.unbind());
        }
        return _results;
      }
    },
    routine: function(el, collection) {
      var binding, data, i, index, key, model, modelName, options, previous, template, view, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      modelName = this.args[0];
      collection = collection || [];
      if (this.iterated.length > collection.length) {
        _ref1 = Array(this.iterated.length - collection.length);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        }
      }
      for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
        model = collection[index];
        data = {
          index: index
        };
        data[modelName] = model;
        if (this.iterated[index] == null) {
          _ref2 = this.view.models;
          for (key in _ref2) {
            model = _ref2[key];
            if (data[key] == null) {
              data[key] = model;
            }
          }
          previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
          options = this.view.options();
          options.preloadData = true;
          template = el.cloneNode(true);
          view = new Rivets.View(template, data, options);
          view.bind();
          this.iterated.push(view);
          this.marker.parentNode.insertBefore(template, previous.nextSibling);
        } else if (this.iterated[index].models[modelName] !== model) {
          this.iterated[index].update(data);
        }
      }
      if (el.nodeName === 'OPTION') {
        _ref3 = this.view.bindings;
        _results = [];
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          binding = _ref3[_k];
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            _results.push(binding.sync());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    update: function(models) {
      var data, key, model, view, _i, _len, _ref1, _results;
      data = {};
      for (key in models) {
        model = models[key];
        if (key !== this.args[0]) {
          data[key] = model;
        }
      }
      _ref1 = this.iterated;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        _results.push(view.update(data));
      }
      return _results;
    }
  };

  Rivets["public"].binders['class-*'] = function(el, value) {
    var elClass;
    elClass = " " + el.className + " ";
    if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
      return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
    }
  };

  Rivets["public"].binders['*'] = function(el, value) {
    if (value != null) {
      return el.setAttribute(this.type, value);
    } else {
      return el.removeAttribute(this.type);
    }
  };

  Rivets["public"].adapters['.'] = {
    id: '_rv',
    counter: 0,
    weakmap: {},
    weakReference: function(obj) {
      var id, _base, _name;
      if (!obj.hasOwnProperty(this.id)) {
        id = this.counter++;
        Object.defineProperty(obj, this.id, {
          value: id
        });
      }
      return (_base = this.weakmap)[_name = obj[this.id]] || (_base[_name] = {
        callbacks: {}
      });
    },
    cleanupWeakReference: function(ref, id) {
      if (!Object.keys(ref.callbacks).length) {
        if (!(ref.pointers && Object.keys(ref.pointers).length)) {
          return delete this.weakmap[id];
        }
      }
    },
    stubFunction: function(obj, fn) {
      var map, original, weakmap;
      original = obj[fn];
      map = this.weakReference(obj);
      weakmap = this.weakmap;
      return obj[fn] = function() {
        var callback, k, r, response, _i, _len, _ref1, _ref2, _ref3, _ref4;
        response = original.apply(obj, arguments);
        _ref1 = map.pointers;
        for (r in _ref1) {
          k = _ref1[r];
          _ref4 = (_ref2 = (_ref3 = weakmap[r]) != null ? _ref3.callbacks[k] : void 0) != null ? _ref2 : [];
          for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
            callback = _ref4[_i];
            callback();
          }
        }
        return response;
      };
    },
    observeMutations: function(obj, ref, keypath) {
      var fn, functions, map, _base, _i, _len;
      if (Array.isArray(obj)) {
        map = this.weakReference(obj);
        if (map.pointers == null) {
          map.pointers = {};
          functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
          for (_i = 0, _len = functions.length; _i < _len; _i++) {
            fn = functions[_i];
            this.stubFunction(obj, fn);
          }
        }
        if ((_base = map.pointers)[ref] == null) {
          _base[ref] = [];
        }
        if (__indexOf.call(map.pointers[ref], keypath) < 0) {
          return map.pointers[ref].push(keypath);
        }
      }
    },
    unobserveMutations: function(obj, ref, keypath) {
      var idx, map, pointers;
      if (Array.isArray(obj) && (obj[this.id] != null)) {
        if (map = this.weakmap[obj[this.id]]) {
          if (pointers = map.pointers[ref]) {
            if ((idx = pointers.indexOf(keypath)) >= 0) {
              pointers.splice(idx, 1);
            }
            if (!pointers.length) {
              delete map.pointers[ref];
            }
            return this.cleanupWeakReference(map, obj[this.id]);
          }
        }
      }
    },
    observe: function(obj, keypath, callback) {
      var callbacks, desc, value;
      callbacks = this.weakReference(obj).callbacks;
      if (callbacks[keypath] == null) {
        callbacks[keypath] = [];
        desc = Object.getOwnPropertyDescriptor(obj, keypath);
        if (!((desc != null ? desc.get : void 0) || (desc != null ? desc.set : void 0))) {
          value = obj[keypath];
          Object.defineProperty(obj, keypath, {
            enumerable: true,
            get: function() {
              return value;
            },
            set: (function(_this) {
              return function(newValue) {
                var map, _i, _len, _ref1;
                if (newValue !== value) {
                  _this.unobserveMutations(value, obj[_this.id], keypath);
                  value = newValue;
                  if (map = _this.weakmap[obj[_this.id]]) {
                    callbacks = map.callbacks;
                    if (callbacks[keypath]) {
                      _ref1 = callbacks[keypath].slice();
                      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        callback = _ref1[_i];
                        if (__indexOf.call(callbacks[keypath], callback) >= 0) {
                          callback();
                        }
                      }
                    }
                    return _this.observeMutations(newValue, obj[_this.id], keypath);
                  }
                }
              };
            })(this)
          });
        }
      }
      if (__indexOf.call(callbacks[keypath], callback) < 0) {
        callbacks[keypath].push(callback);
      }
      return this.observeMutations(obj[keypath], obj[this.id], keypath);
    },
    unobserve: function(obj, keypath, callback) {
      var callbacks, idx, map;
      if (map = this.weakmap[obj[this.id]]) {
        if (callbacks = map.callbacks[keypath]) {
          if ((idx = callbacks.indexOf(callback)) >= 0) {
            callbacks.splice(idx, 1);
            if (!callbacks.length) {
              delete map.callbacks[keypath];
            }
          }
          this.unobserveMutations(obj[keypath], obj[this.id], keypath);
          return this.cleanupWeakReference(map, obj[this.id]);
        }
      }
    },
    get: function(obj, keypath) {
      return obj[keypath];
    },
    set: function(obj, keypath, value) {
      return obj[keypath] = value;
    }
  };

  Rivets.factory = function(sightglass) {
    Rivets.sightglass = sightglass;
    Rivets["public"]._ = Rivets;
    return Rivets["public"];
  };

  if (typeof (typeof module !== "undefined" && module !== null ? module.exports : void 0) === 'object') {
    module.exports = Rivets.factory(require('sightglass'));
  } else if (typeof define === 'function' && define.amd) {
    define(['sightglass'], function(sightglass) {
      return this.rivets = Rivets.factory(sightglass);
    });
  } else {
    this.rivets = Rivets.factory(sightglass);
  }

}).call(this);

},{"sightglass":6}],6:[function(require,module,exports){
(function() {
  // Public sightglass interface.
  function sightglass(obj, keypath, callback, options) {
    return new Observer(obj, keypath, callback, options)
  }

  // Batteries not included.
  sightglass.adapters = {}

  // Constructs a new keypath observer and kicks things off.
  function Observer(obj, keypath, callback, options) {
    this.options = options || {}
    this.options.adapters = this.options.adapters || {}
    this.obj = obj
    this.keypath = keypath
    this.callback = callback
    this.objectPath = []
    this.update = this.update.bind(this)
    this.parse()

    if (isObject(this.target = this.realize())) {
      this.set(true, this.key, this.target, this.callback)
    }
  }

  // Tokenizes the provided keypath string into interface + path tokens for the
  // observer to work with.
  Observer.tokenize = function(keypath, interfaces, root) {
    var tokens = []
    var current = {i: root, path: ''}
    var index, chr

    for (index = 0; index < keypath.length; index++) {
      chr = keypath.charAt(index)

      if (!!~interfaces.indexOf(chr)) {
        tokens.push(current)
        current = {i: chr, path: ''}
      } else {
        current.path += chr
      }
    }

    tokens.push(current)
    return tokens
  }

  // Parses the keypath using the interfaces defined on the view. Sets variables
  // for the tokenized keypath as well as the end key.
  Observer.prototype.parse = function() {
    var interfaces = this.interfaces()
    var root, path

    if (!interfaces.length) {
      error('Must define at least one adapter interface.')
    }

    if (!!~interfaces.indexOf(this.keypath[0])) {
      root = this.keypath[0]
      path = this.keypath.substr(1)
    } else {
      if (typeof (root = this.options.root || sightglass.root) === 'undefined') {
        error('Must define a default root adapter.')
      }

      path = this.keypath
    }

    this.tokens = Observer.tokenize(path, interfaces, root)
    this.key = this.tokens.pop()
  }

  // Realizes the full keypath, attaching observers for every key and correcting
  // old observers to any changed objects in the keypath.
  Observer.prototype.realize = function() {
    var current = this.obj
    var unreached = false
    var prev

    this.tokens.forEach(function(token, index) {
      if (isObject(current)) {
        if (typeof this.objectPath[index] !== 'undefined') {
          if (current !== (prev = this.objectPath[index])) {
            this.set(false, token, prev, this.update)
            this.set(true, token, current, this.update)
            this.objectPath[index] = current
          }
        } else {
          this.set(true, token, current, this.update)
          this.objectPath[index] = current
        }

        current = this.get(token, current)
      } else {
        if (unreached === false) {
          unreached = index
        }

        if (prev = this.objectPath[index]) {
          this.set(false, token, prev, this.update)
        }
      }
    }, this)

    if (unreached !== false) {
      this.objectPath.splice(unreached)
    }

    return current
  }

  // Updates the keypath. This is called when any intermediary key is changed.
  Observer.prototype.update = function() {
    var next, oldValue

    if ((next = this.realize()) !== this.target) {
      if (isObject(this.target)) {
        this.set(false, this.key, this.target, this.callback)
      }

      if (isObject(next)) {
        this.set(true, this.key, next, this.callback)
      }

      oldValue = this.value()
      this.target = next

      if (this.value() !== oldValue) this.callback()
    }
  }

  // Reads the current end value of the observed keypath. Returns undefined if
  // the full keypath is unreachable.
  Observer.prototype.value = function() {
    if (isObject(this.target)) {
      return this.get(this.key, this.target)
    }
  }

  // Sets the current end value of the observed keypath. Calling setValue when
  // the full keypath is unreachable is a no-op.
  Observer.prototype.setValue = function(value) {
    if (isObject(this.target)) {
      this.adapter(this.key).set(this.target, this.key.path, value)
    }
  }

  // Gets the provided key on an object.
  Observer.prototype.get = function(key, obj) {
    return this.adapter(key).get(obj, key.path)
  }

  // Observes or unobserves a callback on the object using the provided key.
  Observer.prototype.set = function(active, key, obj, callback) {
    var action = active ? 'observe' : 'unobserve'
    this.adapter(key)[action](obj, key.path, callback)
  }

  // Returns an array of all unique adapter interfaces available.
  Observer.prototype.interfaces = function() {
    var interfaces = Object.keys(this.options.adapters)

    Object.keys(sightglass.adapters).forEach(function(i) {
      if (!~interfaces.indexOf(i)) {
        interfaces.push(i)
      }
    })

    return interfaces
  }

  // Convenience function to grab the adapter for a specific key.
  Observer.prototype.adapter = function(key) {
    return this.options.adapters[key.i] ||
      sightglass.adapters[key.i]
  }

  // Unobserves the entire keypath.
  Observer.prototype.unobserve = function() {
    var obj

    this.tokens.forEach(function(token, index) {
      if (obj = this.objectPath[index]) {
        this.set(false, token, obj, this.update)
      }
    }, this)

    if (isObject(this.target)) {
      this.set(false, this.key, this.target, this.callback)
    }
  }

  // Check if a value is an object than can be observed.
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null
  }

  // Error thrower.
  function error(message) {
    throw new Error('[sightglass] ' + message)
  }

  // Export module for Node and the browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sightglass
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return this.sightglass = sightglass
    })
  } else {
    this.sightglass = sightglass
  }
}).call(this);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqaHRfaWRlYXNfdG9kb3MvanMvc3JjL2FwcC9hcHAuanMiLCJqaHRfaWRlYXNfdG9kb3MvanMvc3JjL2FwcC9jb250cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsImpodF9pZGVhc190b2Rvcy9qcy9zcmMvYXBwL21vZGVscy9pZGVhc01vZGVsLmpzIiwiamh0X2lkZWFzX3RvZG9zL2pzL3NyYy9hcHAvdmlld3MvbWFpblZpZXcuanMiLCJub2RlX21vZHVsZXMvcml2ZXRzL2Rpc3Qvcml2ZXRzLmpzIiwibm9kZV9tb2R1bGVzL3NpZ2h0Z2xhc3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNHQSxJQUFJLFdBQVcsUUFBUSxxQkFBUixDQUFmO0FBQ0EsSUFBSSxhQUFhLFFBQVEsd0JBQVIsQ0FBakI7QUFDQSxJQUFJLGlCQUFpQixRQUFRLGlDQUFSLENBQXJCOzs7QUFHQSxRQUFRLEdBQVIsQ0FBWSxrQkFBWjs7OztBQUtBLFFBQVEsR0FBUixDQUFZLGtCQUFaOzs7QUFHQSxPQUFPLFVBQVAsRUFBbUIsS0FBbkIsQ0FBeUIsWUFBVztBQUNoQyxlQUFhLFdBQVcsUUFBWCxDQUFiLEM7QUFDQSxtQkFBaUIsZUFBZSxVQUFmLENBQWpCO0FBQ0EsYUFBVyxTQUFTLFVBQVQsRUFBcUIsY0FBckIsQ0FBWDtBQUNBLFdBQVMsSUFBVDs7QUFFQSxTQUFPLFVBQVAsR0FBb0IsVUFBcEI7O0FBRUgsQ0FSRDs7Ozs7OztBQ1hBLE9BQU8sT0FBUCxHQUFpQixVQUFTLEtBQVQsRUFBZ0I7QUFDN0IsWUFBUSxTQUFTLEVBQWpCOztBQUVBLFVBQU07QUFDRixvQkFBYSxVQUFTLENBQVQsRUFBWSxTQUFaLEVBQXVCOzs7QUFHaEMsb0JBQVEsR0FBUixDQUFZLEtBQVo7QUFDQSxrQkFBTSxJQUFOLENBQVcsS0FBWCxDQUFpQixJQUFqQixDQUFzQixNQUFNLEdBQTVCO0FBQ0g7QUFOQyxLQUFOO0FBUUEsV0FBTyxHQUFQO0FBQ0gsQ0FaRDs7Ozs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFTLEdBQVQsRUFBYzs7QUFFM0IsVUFBTSxPQUFPLEVBQWI7QUFDQSxXQUFPLEVBQVA7QUFDQSxTQUFLLEtBQUwsR0FBYyxPQUFPLElBQUksS0FBWCxLQUFvQixXQUFyQixHQUFtQyxJQUFJLEtBQXZDLEdBQStDLEVBQTVELEM7O0FBSUEsVUFBSztBQUNGLGNBQU0sRUFBQyxPQUFPLEtBQUssS0FBYjtBQURKLEtBQUw7O0FBSUEsV0FBTyxHQUFQO0FBQ0gsQ0FiRDs7Ozs7O0FDRkEsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFiOztBQUdBLE9BQU8sT0FBUCxHQUFpQixVQUFTLEtBQVQsRUFBZ0IsVUFBaEIsRUFBNEI7QUFDekMsWUFBUSxTQUFTLEVBQWpCO0FBQ0EsVUFBTSxHQUFOLEdBQVksRUFBWixDO0FBQ0EsVUFBTSxHQUFOLENBQVUsVUFBVixHQUF1QixFQUF2QjtBQUNBLGlCQUFhLGNBQWMsRUFBM0I7QUFDRCxRQUFJLE9BQU87Ozs7Ozs7Ozs7QUFBQSxDQUFYOztBQVlDLFFBQUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBWDs7QUFFQSxRQUFJLE9BQU8sWUFBVzs7QUFFbEIsYUFBSyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLGVBQU8sSUFBUCxDQUFZLElBQVosRUFBa0IsRUFBQyxPQUFPLEtBQVIsRUFBZSxZQUFZLFVBQTNCLEVBQWxCO0FBRUgsS0FORDs7QUFRQSxVQUFNO0FBQ0YsY0FBTTtBQURKLEtBQU47O0FBSUEsV0FBTyxHQUFQO0FBQ0gsQ0FoQ0Q7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6MkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBqZXIwZGggb24gNS8xMS8xNi5cbiAqL1xudmFyIG1haW5WaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9tYWluVmlldy5qcycpO1xudmFyIGlkZWFzTW9kZWwgPSByZXF1aXJlKCcuL21vZGVscy9pZGVhc01vZGVsLmpzJyk7XG52YXIgbWFpbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzJyk7XG5cbiAvL3JlbW92ZUlmKHByb2R1Y3Rpb24pXG5jb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIEFwcCcpO1xuIC8vZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuXG4vL3JlbW92ZUlmKHByb2R1Y3Rpb24pXG5jb25zb2xlLmxvZygnQWRkaW5nIE1haW4gVmlldycpO1xuLy9lbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuXG5qUXVlcnkoJ2RvY3VtZW50JykucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgaWRlYXNNb2RlbCA9IGlkZWFzTW9kZWwoamh0SWRlYXMpOyAgLy9pbml0aWFsaXplIG1vZGVsIHdpdGggZGF0YSBmcm9tIHBhZ2VcbiAgICBtYWluQ29udHJvbGxlciA9IG1haW5Db250cm9sbGVyKGlkZWFzTW9kZWwpO1xuICAgIG1haW5WaWV3ID0gbWFpblZpZXcoaWRlYXNNb2RlbCwgbWFpbkNvbnRyb2xsZXIpO1xuICAgIG1haW5WaWV3LmluaXQoKTtcbiAgICAvL3JlbW92ZUlmKHByb2R1Y3Rpb24pXG4gICAgd2luZG93LmlkZWFzTW9kZWwgPSBpZGVhc01vZGVsO1xuLy9lbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamVyMGRoIG9uIDUvMTEvMTYuXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgbW9kZWwgPSBtb2RlbCB8fCB7fTtcblxuICAgIGFwaSA9IHtcbiAgICAgICAgb25DbGlja0FkZCA6IGZ1bmN0aW9uKGUsIHZpZXdtb2RlbCkge1xuICAgICAgICAgIC8vIHNlbmQgcmVxdWVzdCB0byBhZGQgdG8gbW9kZWwgd2l0aCBzdWNjZXNzIGNhbGxiYWNrIGFuZCBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgLy8gZ3JleSBvdXQgYnV0dG9uIGFuZCBzcGlubmVyIHVudGlsIG9uZSBvciBvdGhlclxuICAgICAgICAgICAgY29uc29sZS5sb2cobW9kZWwpO1xuICAgICAgICAgICAgbW9kZWwuZGF0YS5wb3N0cy5wdXNoKG1vZGVsLm5ldyk7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gYXBpO1xufTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgamVyMGRoIG9uIDUvMTEvMTYuXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdCkge1xuXG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIGRhdGEgPSB7fTtcbiAgICBkYXRhLnBvc3RzID0gKHR5cGVvZiBvcHQucG9zdHMgIT09J3VuZGVmaW5lZCcpPyBvcHQucG9zdHMgOiB7fTsgICAvL3dlIGFyZSBtZXJlbHkgcGFzc2luZyByZWZlcmVuY2UtIGluIGZ1dHVyZSBtaWdodCBiZSBiZXR0ZXIgdG8gY2xvbmVcblxuXG5cbiAgICBhcGkgPXtcbiAgICAgICBkYXRhOiB7cG9zdHM6IGRhdGEucG9zdHN9XG4gICAgfTtcblxuICAgIHJldHVybiBhcGk7XG59OyIsIi8qKlxuICogQ3JlYXRlZCBieSBqZXIwZGggb24gNS8xMS8xNi5cbiAqL1xudmFyIHJpdmV0cyA9IHJlcXVpcmUoJ3JpdmV0cycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kZWwsIGNvbnRyb2xsZXIpIHtcbiAgICBtb2RlbCA9IG1vZGVsIHx8IHt9O1xuICAgIG1vZGVsLm5ldyA9IHt9OyAvL2ZvciBhIG5ldyBpZGVhIGJlZm9yZSBhZGRlZCB0byBwb3N0c1xuICAgIG1vZGVsLm5ldy5wb3N0X3RpdGxlID0gJyc7IFxuICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyIHx8IHt9O1xuICAgdmFyIGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwiamh0SWRlYXNfY29udGFpbmVyXCI+XG4gICA8dWw+XG4gICAgPGxpIHJ2LWVhY2gtaWRlYT1cIm1vZGVsLmRhdGEucG9zdHNcIj5cbiAgICAgICAgPGgzIHJ2LXRleHQ9XCJpZGVhLnBvc3RfdGl0bGVcIj48L2gzPlxuICAgIDwvbGk+XG4gICAgPGxpPjxpbnB1dCBydi12YWx1ZT1cIm1vZGVsLm5ldy5wb3N0X3RpdGxlXCIgLz48YnV0dG9uIHJ2LW9uLWNsaWNrPVwiY29udHJvbGxlci5vbkNsaWNrQWRkXCI+QWRkPC9idXR0b24+PC9saT5cbiAgIDwvdWw+XG4gPC9kaXY+IFxuXG5gO1xuXG4gICAgdmFyIG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnamh0TWFpbicpO1xuICAgIFxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbWFpbi5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICByaXZldHMuYmluZChtYWluLCB7bW9kZWw6IG1vZGVsLCBjb250cm9sbGVyOiBjb250cm9sbGVyIH0pO1xuXG4gICAgfTtcbiAgICBcbiAgICBhcGkgPSB7XG4gICAgICAgIGluaXQ6IGluaXRcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBhcGk7XG59O1xuIiwiLy8gUml2ZXRzLmpzXG4vLyB2ZXJzaW9uOiAwLjguMVxuLy8gYXV0aG9yOiBNaWNoYWVsIFJpY2hhcmRzXG4vLyBsaWNlbnNlOiBNSVRcbihmdW5jdGlvbigpIHtcbiAgdmFyIFJpdmV0cywgYmluZE1ldGhvZCwgdW5iaW5kTWV0aG9kLCBfcmVmLFxuICAgIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gIFJpdmV0cyA9IHtcbiAgICBvcHRpb25zOiBbJ3ByZWZpeCcsICd0ZW1wbGF0ZURlbGltaXRlcnMnLCAncm9vdEludGVyZmFjZScsICdwcmVsb2FkRGF0YScsICdoYW5kbGVyJ10sXG4gICAgZXh0ZW5zaW9uczogWydiaW5kZXJzJywgJ2Zvcm1hdHRlcnMnLCAnY29tcG9uZW50cycsICdhZGFwdGVycyddLFxuICAgIFwicHVibGljXCI6IHtcbiAgICAgIGJpbmRlcnM6IHt9LFxuICAgICAgY29tcG9uZW50czoge30sXG4gICAgICBmb3JtYXR0ZXJzOiB7fSxcbiAgICAgIGFkYXB0ZXJzOiB7fSxcbiAgICAgIHByZWZpeDogJ3J2JyxcbiAgICAgIHRlbXBsYXRlRGVsaW1pdGVyczogWyd7JywgJ30nXSxcbiAgICAgIHJvb3RJbnRlcmZhY2U6ICcuJyxcbiAgICAgIHByZWxvYWREYXRhOiB0cnVlLFxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24oY29udGV4dCwgZXYsIGJpbmRpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChjb250ZXh0LCBldiwgYmluZGluZy52aWV3Lm1vZGVscyk7XG4gICAgICB9LFxuICAgICAgY29uZmlndXJlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yLCBrZXksIG9wdGlvbiwgdmFsdWU7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChvcHRpb24gaW4gb3B0aW9ucykge1xuICAgICAgICAgIHZhbHVlID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgIGlmIChvcHRpb24gPT09ICdiaW5kZXJzJyB8fCBvcHRpb24gPT09ICdjb21wb25lbnRzJyB8fCBvcHRpb24gPT09ICdmb3JtYXR0ZXJzJyB8fCBvcHRpb24gPT09ICdhZGFwdGVycycpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSB2YWx1ZVtrZXldO1xuICAgICAgICAgICAgICBSaXZldHNbb3B0aW9uXVtrZXldID0gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUml2ZXRzW1wicHVibGljXCJdW29wdGlvbl0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBiaW5kOiBmdW5jdGlvbihlbCwgbW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB2aWV3O1xuICAgICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZpZXcgPSBuZXcgUml2ZXRzLlZpZXcoZWwsIG1vZGVscywgb3B0aW9ucyk7XG4gICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH0sXG4gICAgICBpbml0OiBmdW5jdGlvbihjb21wb25lbnQsIGVsLCBkYXRhKSB7XG4gICAgICAgIHZhciBzY29wZSwgdmlldztcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50ID0gUml2ZXRzW1wicHVibGljXCJdLmNvbXBvbmVudHNbY29tcG9uZW50XTtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gY29tcG9uZW50LnRlbXBsYXRlLmNhbGwodGhpcywgZWwpO1xuICAgICAgICBzY29wZSA9IGNvbXBvbmVudC5pbml0aWFsaXplLmNhbGwodGhpcywgZWwsIGRhdGEpO1xuICAgICAgICB2aWV3ID0gbmV3IFJpdmV0cy5WaWV3KGVsLCBzY29wZSk7XG4gICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKHdpbmRvd1snalF1ZXJ5J10gfHwgd2luZG93WyckJ10pIHtcbiAgICBfcmVmID0gJ29uJyBpbiBqUXVlcnkucHJvdG90eXBlID8gWydvbicsICdvZmYnXSA6IFsnYmluZCcsICd1bmJpbmQnXSwgYmluZE1ldGhvZCA9IF9yZWZbMF0sIHVuYmluZE1ldGhvZCA9IF9yZWZbMV07XG4gICAgUml2ZXRzLlV0aWwgPSB7XG4gICAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICByZXR1cm4galF1ZXJ5KGVsKVtiaW5kTWV0aG9kXShldmVudCwgaGFuZGxlcik7XG4gICAgICB9LFxuICAgICAgdW5iaW5kRXZlbnQ6IGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICByZXR1cm4galF1ZXJ5KGVsKVt1bmJpbmRNZXRob2RdKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgIH0sXG4gICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgJGVsO1xuICAgICAgICAkZWwgPSBqUXVlcnkoZWwpO1xuICAgICAgICBpZiAoJGVsLmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIHJldHVybiAkZWwuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICRlbC52YWwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgUml2ZXRzLlV0aWwgPSB7XG4gICAgICBiaW5kRXZlbnQ6IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgfSkoKSxcbiAgICAgIHVuYmluZEV2ZW50OiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgncmVtb3ZlRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gZWwuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKCksXG4gICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgbywgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBpZiAoZWwudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIHJldHVybiBlbC5jaGVja2VkO1xuICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVsLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBvID0gZWxbX2ldO1xuICAgICAgICAgICAgaWYgKG8uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChvLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBSaXZldHMuVHlwZVBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBUeXBlUGFyc2VyKCkge31cblxuICAgIFR5cGVQYXJzZXIudHlwZXMgPSB7XG4gICAgICBwcmltaXRpdmU6IDAsXG4gICAgICBrZXlwYXRoOiAxXG4gICAgfTtcblxuICAgIFR5cGVQYXJzZXIucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmICgvXicuKickfF5cIi4qXCIkLy50ZXN0KHN0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogc3RyaW5nLnNsaWNlKDEsIC0xKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICdudWxsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiBudWxsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogdm9pZCAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKGlzTmFOKE51bWJlcihzdHJpbmcpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogTnVtYmVyKHN0cmluZylcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5rZXlwYXRoLFxuICAgICAgICAgIHZhbHVlOiBzdHJpbmdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFR5cGVQYXJzZXI7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuVGV4dFRlbXBsYXRlUGFyc2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFRleHRUZW1wbGF0ZVBhcnNlcigpIHt9XG5cbiAgICBUZXh0VGVtcGxhdGVQYXJzZXIudHlwZXMgPSB7XG4gICAgICB0ZXh0OiAwLFxuICAgICAgYmluZGluZzogMVxuICAgIH07XG5cbiAgICBUZXh0VGVtcGxhdGVQYXJzZXIucGFyc2UgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgZGVsaW1pdGVycykge1xuICAgICAgdmFyIGluZGV4LCBsYXN0SW5kZXgsIGxhc3RUb2tlbiwgbGVuZ3RoLCBzdWJzdHJpbmcsIHRva2VucywgdmFsdWU7XG4gICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIGxlbmd0aCA9IHRlbXBsYXRlLmxlbmd0aDtcbiAgICAgIGluZGV4ID0gMDtcbiAgICAgIGxhc3RJbmRleCA9IDA7XG4gICAgICB3aGlsZSAobGFzdEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZihkZWxpbWl0ZXJzWzBdLCBsYXN0SW5kZXgpO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW5kZXggPiAwICYmIGxhc3RJbmRleCA8IGluZGV4KSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBkZWxpbWl0ZXJzWzBdLmxlbmd0aDtcbiAgICAgICAgICBpbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoZGVsaW1pdGVyc1sxXSwgbGFzdEluZGV4KTtcbiAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICBzdWJzdHJpbmcgPSB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXggLSBkZWxpbWl0ZXJzWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKChsYXN0VG9rZW4gIT0gbnVsbCA/IGxhc3RUb2tlbi50eXBlIDogdm9pZCAwKSA9PT0gdGhpcy50eXBlcy50ZXh0KSB7XG4gICAgICAgICAgICAgIGxhc3RUb2tlbi52YWx1ZSArPSBzdWJzdHJpbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzdWJzdHJpbmdcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgsIGluZGV4KS50cmltKCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5iaW5kaW5nLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBkZWxpbWl0ZXJzWzFdLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRleHRUZW1wbGF0ZVBhcnNlcjtcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5WaWV3ID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFZpZXcoZWxzLCBtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBrLCBvcHRpb24sIHYsIF9iYXNlLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3JlZjU7XG4gICAgICB0aGlzLmVscyA9IGVscztcbiAgICAgIHRoaXMubW9kZWxzID0gbW9kZWxzO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gICAgICB0aGlzLnB1Ymxpc2ggPSBfX2JpbmQodGhpcy5wdWJsaXNoLCB0aGlzKTtcbiAgICAgIHRoaXMuc3luYyA9IF9fYmluZCh0aGlzLnN5bmMsIHRoaXMpO1xuICAgICAgdGhpcy51bmJpbmQgPSBfX2JpbmQodGhpcy51bmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5iaW5kID0gX19iaW5kKHRoaXMuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLnNlbGVjdCA9IF9fYmluZCh0aGlzLnNlbGVjdCwgdGhpcyk7XG4gICAgICB0aGlzLnRyYXZlcnNlID0gX19iaW5kKHRoaXMudHJhdmVyc2UsIHRoaXMpO1xuICAgICAgdGhpcy5idWlsZCA9IF9fYmluZCh0aGlzLmJ1aWxkLCB0aGlzKTtcbiAgICAgIHRoaXMuYnVpbGRCaW5kaW5nID0gX19iaW5kKHRoaXMuYnVpbGRCaW5kaW5nLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZGluZ1JlZ0V4cCA9IF9fYmluZCh0aGlzLmJpbmRpbmdSZWdFeHAsIHRoaXMpO1xuICAgICAgdGhpcy5vcHRpb25zID0gX19iaW5kKHRoaXMub3B0aW9ucywgdGhpcyk7XG4gICAgICBpZiAoISh0aGlzLmVscy5qcXVlcnkgfHwgdGhpcy5lbHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhpcy5lbHMgPSBbdGhpcy5lbHNdO1xuICAgICAgfVxuICAgICAgX3JlZjEgPSBSaXZldHMuZXh0ZW5zaW9ucztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZjFbX2ldO1xuICAgICAgICB0aGlzW29wdGlvbl0gPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnNbb3B0aW9uXSkge1xuICAgICAgICAgIF9yZWYyID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgIGZvciAoayBpbiBfcmVmMikge1xuICAgICAgICAgICAgdiA9IF9yZWYyW2tdO1xuICAgICAgICAgICAgdGhpc1tvcHRpb25dW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JlZjMgPSBSaXZldHNbXCJwdWJsaWNcIl1bb3B0aW9uXTtcbiAgICAgICAgZm9yIChrIGluIF9yZWYzKSB7XG4gICAgICAgICAgdiA9IF9yZWYzW2tdO1xuICAgICAgICAgIGlmICgoX2Jhc2UgPSB0aGlzW29wdGlvbl0pW2tdID09IG51bGwpIHtcbiAgICAgICAgICAgIF9iYXNlW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9yZWY0ID0gUml2ZXRzLm9wdGlvbnM7XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmNC5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZjRbX2pdO1xuICAgICAgICB0aGlzW29wdGlvbl0gPSAoX3JlZjUgPSBvcHRpb25zW29wdGlvbl0pICE9IG51bGwgPyBfcmVmNSA6IFJpdmV0c1tcInB1YmxpY1wiXVtvcHRpb25dO1xuICAgICAgfVxuICAgICAgdGhpcy5idWlsZCgpO1xuICAgIH1cblxuICAgIFZpZXcucHJvdG90eXBlLm9wdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb24sIG9wdGlvbnMsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIF9yZWYxID0gUml2ZXRzLmV4dGVuc2lvbnMuY29uY2F0KFJpdmV0cy5vcHRpb25zKTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZjFbX2ldO1xuICAgICAgICBvcHRpb25zW29wdGlvbl0gPSB0aGlzW29wdGlvbl07XG4gICAgICB9XG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYmluZGluZ1JlZ0V4cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeXCIgKyB0aGlzLnByZWZpeCArIFwiLVwiKTtcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYnVpbGRCaW5kaW5nID0gZnVuY3Rpb24oYmluZGluZywgbm9kZSwgdHlwZSwgZGVjbGFyYXRpb24pIHtcbiAgICAgIHZhciBjb250ZXh0LCBjdHgsIGRlcGVuZGVuY2llcywga2V5cGF0aCwgb3B0aW9ucywgcGlwZSwgcGlwZXM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgICBwaXBlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZWYxID0gZGVjbGFyYXRpb24uc3BsaXQoJ3wnKTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHBpcGUgPSBfcmVmMVtfaV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChwaXBlLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnRleHQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgICBfcmVmMSA9IHBpcGVzLnNoaWZ0KCkuc3BsaXQoJzwnKTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGN0eCA9IF9yZWYxW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGN0eC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pKCk7XG4gICAgICBrZXlwYXRoID0gY29udGV4dC5zaGlmdCgpO1xuICAgICAgb3B0aW9ucy5mb3JtYXR0ZXJzID0gcGlwZXM7XG4gICAgICBpZiAoZGVwZW5kZW5jaWVzID0gY29udGV4dC5zaGlmdCgpKSB7XG4gICAgICAgIG9wdGlvbnMuZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzLnNwbGl0KC9cXHMrLyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncy5wdXNoKG5ldyBSaXZldHNbYmluZGluZ10odGhpcywgbm9kZSwgdHlwZSwga2V5cGF0aCwgb3B0aW9ucykpO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsLCBwYXJzZSwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgICAgcGFyc2UgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICB2YXIgYmxvY2ssIGNoaWxkTm9kZSwgZGVsaW1pdGVycywgbiwgcGFyc2VyLCB0ZXh0LCB0b2tlbiwgdG9rZW5zLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IFJpdmV0cy5UZXh0VGVtcGxhdGVQYXJzZXI7XG4gICAgICAgICAgICBpZiAoZGVsaW1pdGVycyA9IF90aGlzLnRlbXBsYXRlRGVsaW1pdGVycykge1xuICAgICAgICAgICAgICBpZiAoKHRva2VucyA9IHBhcnNlci5wYXJzZShub2RlLmRhdGEsIGRlbGltaXRlcnMpKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISh0b2tlbnMubGVuZ3RoID09PSAxICYmIHRva2Vuc1swXS50eXBlID09PSBwYXJzZXIudHlwZXMudGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gdG9rZW5zLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW19pXTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0ZXh0LCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5idWlsZEJpbmRpbmcoJ1RleHRCaW5kaW5nJywgdGV4dCwgbnVsbCwgdG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICBibG9jayA9IF90aGlzLnRyYXZlcnNlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBfcmVmMSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIF9rLCBfbGVuMSwgX3JlZjEsIF9yZXN1bHRzMTtcbiAgICAgICAgICAgICAgX3JlZjEgPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgIF9yZXN1bHRzMSA9IFtdO1xuICAgICAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjEgPSBfcmVmMS5sZW5ndGg7IF9rIDwgX2xlbjE7IF9rKyspIHtcbiAgICAgICAgICAgICAgICBuID0gX3JlZjFbX2tdO1xuICAgICAgICAgICAgICAgIF9yZXN1bHRzMS5wdXNoKG4pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfcmVzdWx0czE7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBfcmVmMVtfal07XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gocGFyc2UoY2hpbGROb2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBfcmVmMSA9IHRoaXMuZWxzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBlbCA9IF9yZWYxW19pXTtcbiAgICAgICAgcGFyc2UoZWwpO1xuICAgICAgfVxuICAgICAgdGhpcy5iaW5kaW5ncy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgdmFyIF9yZWYyLCBfcmVmMztcbiAgICAgICAgcmV0dXJuICgoKF9yZWYyID0gYi5iaW5kZXIpICE9IG51bGwgPyBfcmVmMi5wcmlvcml0eSA6IHZvaWQgMCkgfHwgMCkgLSAoKChfcmVmMyA9IGEuYmluZGVyKSAhPSBudWxsID8gX3JlZjMucHJpb3JpdHkgOiB2b2lkIDApIHx8IDApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnRyYXZlcnNlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZSwgYXR0cmlidXRlcywgYmluZGVyLCBiaW5kaW5nUmVnRXhwLCBibG9jaywgaWRlbnRpZmllciwgcmVnZXhwLCB0eXBlLCB2YWx1ZSwgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIGJpbmRpbmdSZWdFeHAgPSB0aGlzLmJpbmRpbmdSZWdFeHAoKTtcbiAgICAgIGJsb2NrID0gbm9kZS5ub2RlTmFtZSA9PT0gJ1NDUklQVCcgfHwgbm9kZS5ub2RlTmFtZSA9PT0gJ1NUWUxFJztcbiAgICAgIF9yZWYxID0gbm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmIChiaW5kaW5nUmVnRXhwLnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgICAgdHlwZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoYmluZGluZ1JlZ0V4cCwgJycpO1xuICAgICAgICAgIGlmICghKGJpbmRlciA9IHRoaXMuYmluZGVyc1t0eXBlXSkpIHtcbiAgICAgICAgICAgIF9yZWYyID0gdGhpcy5iaW5kZXJzO1xuICAgICAgICAgICAgZm9yIChpZGVudGlmaWVyIGluIF9yZWYyKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gX3JlZjJbaWRlbnRpZmllcl07XG4gICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyICE9PSAnKicgJiYgaWRlbnRpZmllci5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIChpZGVudGlmaWVyLnJlcGxhY2UoL1xcKi9nLCAnLisnKSkgKyBcIiRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4cC50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICBiaW5kZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYmluZGVyIHx8IChiaW5kZXIgPSB0aGlzLmJpbmRlcnNbJyonXSk7XG4gICAgICAgICAgaWYgKGJpbmRlci5ibG9jaykge1xuICAgICAgICAgICAgYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFthdHRyaWJ1dGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3JlZjMgPSBhdHRyaWJ1dGVzIHx8IG5vZGUuYXR0cmlidXRlcztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmM1tfal07XG4gICAgICAgIGlmIChiaW5kaW5nUmVnRXhwLnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgICAgdHlwZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoYmluZGluZ1JlZ0V4cCwgJycpO1xuICAgICAgICAgIHRoaXMuYnVpbGRCaW5kaW5nKCdCaW5kaW5nJywgbm9kZSwgdHlwZSwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICB0eXBlID0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRzW3R5cGVdICYmICFub2RlLl9ib3VuZCkge1xuICAgICAgICAgIHRoaXMuYmluZGluZ3MucHVzaChuZXcgUml2ZXRzLkNvbXBvbmVudEJpbmRpbmcodGhpcywgbm9kZSwgdHlwZSkpO1xuICAgICAgICAgIGJsb2NrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJsb2NrO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAoZm4oYmluZGluZykpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLmJpbmQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcudW5iaW5kKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIF9yZXN1bHRzLnB1c2godHlwZW9mIGJpbmRpbmcuc3luYyA9PT0gXCJmdW5jdGlvblwiID8gYmluZGluZy5zeW5jKCkgOiB2b2lkIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5zZWxlY3QoZnVuY3Rpb24oYikge1xuICAgICAgICB2YXIgX3JlZjE7XG4gICAgICAgIHJldHVybiAoX3JlZjEgPSBiLmJpbmRlcikgIT0gbnVsbCA/IF9yZWYxLnB1Ymxpc2hlcyA6IHZvaWQgMDtcbiAgICAgIH0pO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLnB1Ymxpc2goKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIGJpbmRpbmcsIGtleSwgbW9kZWwsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgbW9kZWxzID0ge307XG4gICAgICB9XG4gICAgICBmb3IgKGtleSBpbiBtb2RlbHMpIHtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNba2V5XTtcbiAgICAgICAgdGhpcy5tb2RlbHNba2V5XSA9IG1vZGVsO1xuICAgICAgfVxuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh0eXBlb2YgYmluZGluZy51cGRhdGUgPT09IFwiZnVuY3Rpb25cIiA/IGJpbmRpbmcudXBkYXRlKG1vZGVscykgOiB2b2lkIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICByZXR1cm4gVmlldztcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5CaW5kaW5nID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJpbmRpbmcodmlldywgZWwsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmVsID0gZWw7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aDtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fTtcbiAgICAgIHRoaXMuZ2V0VmFsdWUgPSBfX2JpbmQodGhpcy5nZXRWYWx1ZSwgdGhpcyk7XG4gICAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gICAgICB0aGlzLnVuYmluZCA9IF9fYmluZCh0aGlzLnVuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmQgPSBfX2JpbmQodGhpcy5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMucHVibGlzaCA9IF9fYmluZCh0aGlzLnB1Ymxpc2gsIHRoaXMpO1xuICAgICAgdGhpcy5zeW5jID0gX19iaW5kKHRoaXMuc3luYywgdGhpcyk7XG4gICAgICB0aGlzLnNldCA9IF9fYmluZCh0aGlzLnNldCwgdGhpcyk7XG4gICAgICB0aGlzLmV2ZW50SGFuZGxlciA9IF9fYmluZCh0aGlzLmV2ZW50SGFuZGxlciwgdGhpcyk7XG4gICAgICB0aGlzLmZvcm1hdHRlZFZhbHVlID0gX19iaW5kKHRoaXMuZm9ybWF0dGVkVmFsdWUsIHRoaXMpO1xuICAgICAgdGhpcy5wYXJzZVRhcmdldCA9IF9fYmluZCh0aGlzLnBhcnNlVGFyZ2V0LCB0aGlzKTtcbiAgICAgIHRoaXMub2JzZXJ2ZSA9IF9fYmluZCh0aGlzLm9ic2VydmUsIHRoaXMpO1xuICAgICAgdGhpcy5zZXRCaW5kZXIgPSBfX2JpbmQodGhpcy5zZXRCaW5kZXIsIHRoaXMpO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJzID0gdGhpcy5vcHRpb25zLmZvcm1hdHRlcnMgfHwgW107XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnMgPSB7fTtcbiAgICAgIHRoaXMubW9kZWwgPSB2b2lkIDA7XG4gICAgICB0aGlzLnNldEJpbmRlcigpO1xuICAgIH1cblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnNldEJpbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkZW50aWZpZXIsIHJlZ2V4cCwgdmFsdWUsIF9yZWYxO1xuICAgICAgaWYgKCEodGhpcy5iaW5kZXIgPSB0aGlzLnZpZXcuYmluZGVyc1t0aGlzLnR5cGVdKSkge1xuICAgICAgICBfcmVmMSA9IHRoaXMudmlldy5iaW5kZXJzO1xuICAgICAgICBmb3IgKGlkZW50aWZpZXIgaW4gX3JlZjEpIHtcbiAgICAgICAgICB2YWx1ZSA9IF9yZWYxW2lkZW50aWZpZXJdO1xuICAgICAgICAgIGlmIChpZGVudGlmaWVyICE9PSAnKicgJiYgaWRlbnRpZmllci5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgvXFwqL2csICcuKycpKSArIFwiJFwiKTtcbiAgICAgICAgICAgIGlmIChyZWdleHAudGVzdCh0aGlzLnR5cGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZGVyID0gdmFsdWU7XG4gICAgICAgICAgICAgIHRoaXMuYXJncyA9IG5ldyBSZWdFeHAoXCJeXCIgKyAoaWRlbnRpZmllci5yZXBsYWNlKC9cXCovZywgJyguKyknKSkgKyBcIiRcIikuZXhlYyh0aGlzLnR5cGUpO1xuICAgICAgICAgICAgICB0aGlzLmFyZ3Muc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYmluZGVyIHx8ICh0aGlzLmJpbmRlciA9IHRoaXMudmlldy5iaW5kZXJzWycqJ10pO1xuICAgICAgaWYgKHRoaXMuYmluZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmluZGVyID0ge1xuICAgICAgICAgIHJvdXRpbmU6IHRoaXMuYmluZGVyXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLnNpZ2h0Z2xhc3Mob2JqLCBrZXlwYXRoLCBjYWxsYmFjaywge1xuICAgICAgICByb290OiB0aGlzLnZpZXcucm9vdEludGVyZmFjZSxcbiAgICAgICAgYWRhcHRlcnM6IHRoaXMudmlldy5hZGFwdGVyc1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnBhcnNlVGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9rZW47XG4gICAgICB0b2tlbiA9IFJpdmV0cy5UeXBlUGFyc2VyLnBhcnNlKHRoaXMua2V5cGF0aCk7XG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9IHRva2VuLnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IHRoaXMub2JzZXJ2ZSh0aGlzLnZpZXcubW9kZWxzLCB0aGlzLmtleXBhdGgsIHRoaXMuc3luYyk7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsID0gdGhpcy5vYnNlcnZlci50YXJnZXQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhaSwgYXJnLCBhcmdzLCBmaSwgZm9ybWF0dGVyLCBpZCwgb2JzZXJ2ZXIsIHByb2Nlc3NlZEFyZ3MsIF9iYXNlLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMTtcbiAgICAgIF9yZWYxID0gdGhpcy5mb3JtYXR0ZXJzO1xuICAgICAgZm9yIChmaSA9IF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBmaSA9ICsrX2kpIHtcbiAgICAgICAgZm9ybWF0dGVyID0gX3JlZjFbZmldO1xuICAgICAgICBhcmdzID0gZm9ybWF0dGVyLm1hdGNoKC9bXlxccyddK3wnKFteJ118J1teXFxzXSkqJ3xcIihbXlwiXXxcIlteXFxzXSkqXCIvZyk7XG4gICAgICAgIGlkID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBmb3JtYXR0ZXIgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF07XG4gICAgICAgIGFyZ3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9qLCBfbGVuMSwgX3Jlc3VsdHM7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBhcmdzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgYXJnID0gYXJnc1tfal07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKFJpdmV0cy5UeXBlUGFyc2VyLnBhcnNlKGFyZykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHByb2Nlc3NlZEFyZ3MgPSBbXTtcbiAgICAgICAgZm9yIChhaSA9IF9qID0gMCwgX2xlbjEgPSBhcmdzLmxlbmd0aDsgX2ogPCBfbGVuMTsgYWkgPSArK19qKSB7XG4gICAgICAgICAgYXJnID0gYXJnc1thaV07XG4gICAgICAgICAgcHJvY2Vzc2VkQXJncy5wdXNoKGFyZy50eXBlID09PSAwID8gYXJnLnZhbHVlIDogKChfYmFzZSA9IHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzKVtmaV0gfHwgKF9iYXNlW2ZpXSA9IHt9KSwgIShvYnNlcnZlciA9IHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzW2ZpXVthaV0pID8gKG9ic2VydmVyID0gdGhpcy5vYnNlcnZlKHRoaXMudmlldy5tb2RlbHMsIGFyZy52YWx1ZSwgdGhpcy5zeW5jKSwgdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnNbZmldW2FpXSA9IG9ic2VydmVyKSA6IHZvaWQgMCwgb2JzZXJ2ZXIudmFsdWUoKSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoZm9ybWF0dGVyICE9IG51bGwgPyBmb3JtYXR0ZXIucmVhZCA6IHZvaWQgMCkgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHZhbHVlID0gZm9ybWF0dGVyLnJlYWQuYXBwbHkoZm9ybWF0dGVyLCBbdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwocHJvY2Vzc2VkQXJncykpKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHZhbHVlID0gZm9ybWF0dGVyLmFwcGx5KG51bGwsIFt2YWx1ZV0uY29uY2F0KF9fc2xpY2UuY2FsbChwcm9jZXNzZWRBcmdzKSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB2YXIgYmluZGluZywgaGFuZGxlcjtcbiAgICAgIGhhbmRsZXIgPSAoYmluZGluZyA9IHRoaXMpLnZpZXcuaGFuZGxlcjtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldikge1xuICAgICAgICByZXR1cm4gaGFuZGxlci5jYWxsKGZuLCB0aGlzLCBldiwgYmluZGluZyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgdmFsdWUgPSB2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmICF0aGlzLmJpbmRlcltcImZ1bmN0aW9uXCJdID8gdGhpcy5mb3JtYXR0ZWRWYWx1ZSh2YWx1ZS5jYWxsKHRoaXMubW9kZWwpKSA6IHRoaXMuZm9ybWF0dGVkVmFsdWUodmFsdWUpO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMuYmluZGVyLnJvdXRpbmUpICE9IG51bGwgPyBfcmVmMS5jYWxsKHRoaXMsIHRoaXMuZWwsIHZhbHVlKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlcGVuZGVuY3ksIG9ic2VydmVyO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICAgICAgaWYgKHRoaXMubW9kZWwgIT09IHRoaXMub2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgICAgICBfcmVmMSA9IHRoaXMuZGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICBvYnNlcnZlciA9IF9yZWYxW19pXTtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgICAgICAgaWYgKCgodGhpcy5tb2RlbCA9IHRoaXMub2JzZXJ2ZXIudGFyZ2V0KSAhPSBudWxsKSAmJiAoKF9yZWYyID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IF9yZWYyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgX3JlZjMgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5ID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyID0gdGhpcy5vYnNlcnZlKHRoaXMubW9kZWwsIGRlcGVuZGVuY3ksIHRoaXMuc3luYyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucHVzaChvYnNlcnZlcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXIudmFsdWUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSkuY2FsbCh0aGlzKSk7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBmb3JtYXR0ZXIsIGlkLCB2YWx1ZSwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUodGhpcy5lbCk7XG4gICAgICAgIF9yZWYxID0gdGhpcy5mb3JtYXR0ZXJzLnNsaWNlKDApLnJldmVyc2UoKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGZvcm1hdHRlciA9IF9yZWYxW19pXTtcbiAgICAgICAgICBhcmdzID0gZm9ybWF0dGVyLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgaWQgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgaWYgKChfcmVmMiA9IHRoaXMudmlldy5mb3JtYXR0ZXJzW2lkXSkgIT0gbnVsbCA/IF9yZWYyLnB1Ymxpc2ggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gKF9yZWYzID0gdGhpcy52aWV3LmZvcm1hdHRlcnNbaWRdKS5wdWJsaXNoLmFwcGx5KF9yZWYzLCBbdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXIuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVwZW5kZW5jeSwgb2JzZXJ2ZXIsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgdGhpcy5wYXJzZVRhcmdldCgpO1xuICAgICAgaWYgKChfcmVmMSA9IHRoaXMuYmluZGVyLmJpbmQpICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEuY2FsbCh0aGlzLCB0aGlzLmVsKTtcbiAgICAgIH1cbiAgICAgIGlmICgodGhpcy5tb2RlbCAhPSBudWxsKSAmJiAoKF9yZWYyID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IF9yZWYyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgX3JlZjMgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZGVwZW5kZW5jeSA9IF9yZWYzW19pXTtcbiAgICAgICAgICBvYnNlcnZlciA9IHRoaXMub2JzZXJ2ZSh0aGlzLm1vZGVsLCBkZXBlbmRlbmN5LCB0aGlzLnN5bmMpO1xuICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52aWV3LnByZWxvYWREYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWksIGFyZ3MsIGZpLCBvYnNlcnZlciwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgICAgaWYgKChfcmVmMSA9IHRoaXMuYmluZGVyLnVuYmluZCkgIT0gbnVsbCkge1xuICAgICAgICBfcmVmMS5jYWxsKHRoaXMsIHRoaXMuZWwpO1xuICAgICAgfVxuICAgICAgaWYgKChfcmVmMiA9IHRoaXMub2JzZXJ2ZXIpICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjIudW5vYnNlcnZlKCk7XG4gICAgICB9XG4gICAgICBfcmVmMyA9IHRoaXMuZGVwZW5kZW5jaWVzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvYnNlcnZlciA9IF9yZWYzW19pXTtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgX3JlZjQgPSB0aGlzLmZvcm1hdHRlck9ic2VydmVycztcbiAgICAgIGZvciAoZmkgaW4gX3JlZjQpIHtcbiAgICAgICAgYXJncyA9IF9yZWY0W2ZpXTtcbiAgICAgICAgZm9yIChhaSBpbiBhcmdzKSB7XG4gICAgICAgICAgb2JzZXJ2ZXIgPSBhcmdzW2FpXTtcbiAgICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzID0ge307XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIF9yZWYxLCBfcmVmMjtcbiAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMubW9kZWwgPSAoX3JlZjEgPSB0aGlzLm9ic2VydmVyKSAhPSBudWxsID8gX3JlZjEudGFyZ2V0IDogdm9pZCAwO1xuICAgICAgcmV0dXJuIChfcmVmMiA9IHRoaXMuYmluZGVyLnVwZGF0ZSkgIT0gbnVsbCA/IF9yZWYyLmNhbGwodGhpcywgbW9kZWxzKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKHRoaXMuYmluZGVyICYmICh0aGlzLmJpbmRlci5nZXRWYWx1ZSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5iaW5kZXIuZ2V0VmFsdWUuY2FsbCh0aGlzLCBlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUml2ZXRzLlV0aWwuZ2V0SW5wdXRWYWx1ZShlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBCaW5kaW5nO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLkNvbXBvbmVudEJpbmRpbmcgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENvbXBvbmVudEJpbmRpbmcsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBDb21wb25lbnRCaW5kaW5nKHZpZXcsIGVsLCB0eXBlKSB7XG4gICAgICB2YXIgYXR0cmlidXRlLCBiaW5kaW5nUmVnRXhwLCBwcm9wZXJ0eU5hbWUsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjI7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5sb2NhbHMgPSBfX2JpbmQodGhpcy5sb2NhbHMsIHRoaXMpO1xuICAgICAgdGhpcy5jb21wb25lbnQgPSB0aGlzLnZpZXcuY29tcG9uZW50c1t0aGlzLnR5cGVdO1xuICAgICAgdGhpc1tcInN0YXRpY1wiXSA9IHt9O1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcbiAgICAgIHRoaXMudXBzdHJlYW1PYnNlcnZlcnMgPSB7fTtcbiAgICAgIGJpbmRpbmdSZWdFeHAgPSB2aWV3LmJpbmRpbmdSZWdFeHAoKTtcbiAgICAgIF9yZWYxID0gdGhpcy5lbC5hdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmICghYmluZGluZ1JlZ0V4cC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHRoaXMuY2FtZWxDYXNlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwoKF9yZWYyID0gdGhpcy5jb21wb25lbnRbXCJzdGF0aWNcIl0pICE9IG51bGwgPyBfcmVmMiA6IFtdLCBwcm9wZXJ0eU5hbWUpID49IDApIHtcbiAgICAgICAgICAgIHRoaXNbXCJzdGF0aWNcIl1bcHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnNbcHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLmxvY2FscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSwgb2JzZXJ2ZXIsIHJlc3VsdCwgdmFsdWUsIF9yZWYxLCBfcmVmMjtcbiAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgX3JlZjEgPSB0aGlzW1wic3RhdGljXCJdO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgdmFsdWUgPSBfcmVmMVtrZXldO1xuICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSB0aGlzLm9ic2VydmVycztcbiAgICAgIGZvciAoa2V5IGluIF9yZWYyKSB7XG4gICAgICAgIG9ic2VydmVyID0gX3JlZjJba2V5XTtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvYnNlcnZlci52YWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUuY2FtZWxDYXNlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLy0oW2Etel0pL2csIGZ1bmN0aW9uKGdyb3VwZWQpIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwZWRbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaywga2V5LCBrZXlwYXRoLCBvYnNlcnZlciwgb3B0aW9uLCBvcHRpb25zLCBzY29wZSwgdiwgX2Jhc2UsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVmNSwgX3JlZjYsIF9yZWY3LCBfcmVzdWx0cztcbiAgICAgIGlmICghdGhpcy5ib3VuZCkge1xuICAgICAgICBfcmVmMSA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICAgIGtleXBhdGggPSBfcmVmMVtrZXldO1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0gPSB0aGlzLm9ic2VydmUodGhpcy52aWV3Lm1vZGVscywga2V5cGF0aCwgKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmNvbXBvbmVudFZpZXcubW9kZWxzW2tleV0gPSBfdGhpcy5vYnNlcnZlcnNba2V5XS52YWx1ZSgpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKSkuY2FsbCh0aGlzLCBrZXkpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNvbXBvbmVudFZpZXcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRWaWV3LmJpbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5jb21wb25lbnQudGVtcGxhdGUuY2FsbCh0aGlzKTtcbiAgICAgICAgc2NvcGUgPSB0aGlzLmNvbXBvbmVudC5pbml0aWFsaXplLmNhbGwodGhpcywgdGhpcy5lbCwgdGhpcy5sb2NhbHMoKSk7XG4gICAgICAgIHRoaXMuZWwuX2JvdW5kID0gdHJ1ZTtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICBfcmVmMiA9IFJpdmV0cy5leHRlbnNpb25zO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYyLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgb3B0aW9uID0gX3JlZjJbX2ldO1xuICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IHt9O1xuICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFtvcHRpb25dKSB7XG4gICAgICAgICAgICBfcmVmMyA9IHRoaXMuY29tcG9uZW50W29wdGlvbl07XG4gICAgICAgICAgICBmb3IgKGsgaW4gX3JlZjMpIHtcbiAgICAgICAgICAgICAgdiA9IF9yZWYzW2tdO1xuICAgICAgICAgICAgICBvcHRpb25zW29wdGlvbl1ba10gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBfcmVmNCA9IHRoaXMudmlld1tvcHRpb25dO1xuICAgICAgICAgIGZvciAoayBpbiBfcmVmNCkge1xuICAgICAgICAgICAgdiA9IF9yZWY0W2tdO1xuICAgICAgICAgICAgaWYgKChfYmFzZSA9IG9wdGlvbnNbb3B0aW9uXSlba10gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBfYmFzZVtrXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9yZWY1ID0gUml2ZXRzLm9wdGlvbnM7XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWY1Lmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIG9wdGlvbiA9IF9yZWY1W19qXTtcbiAgICAgICAgICBvcHRpb25zW29wdGlvbl0gPSAoX3JlZjYgPSB0aGlzLmNvbXBvbmVudFtvcHRpb25dKSAhPSBudWxsID8gX3JlZjYgOiB0aGlzLnZpZXdbb3B0aW9uXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudFZpZXcgPSBuZXcgUml2ZXRzLlZpZXcodGhpcy5lbCwgc2NvcGUsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFZpZXcuYmluZCgpO1xuICAgICAgICBfcmVmNyA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGtleSBpbiBfcmVmNykge1xuICAgICAgICAgIG9ic2VydmVyID0gX3JlZjdba2V5XTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMudXBzdHJlYW1PYnNlcnZlcnNba2V5XSA9IHRoaXMub2JzZXJ2ZSh0aGlzLmNvbXBvbmVudFZpZXcubW9kZWxzLCBrZXksICgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrZXksIG9ic2VydmVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuc2V0VmFsdWUoX3RoaXMuY29tcG9uZW50Vmlldy5tb2RlbHNba2V5XSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpKS5jYWxsKHRoaXMsIGtleSwgb2JzZXJ2ZXIpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXksIG9ic2VydmVyLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgX3JlZjEgPSB0aGlzLnVwc3RyZWFtT2JzZXJ2ZXJzO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMVtrZXldO1xuICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIF9yZWYyID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICBmb3IgKGtleSBpbiBfcmVmMikge1xuICAgICAgICBvYnNlcnZlciA9IF9yZWYyW2tleV07XG4gICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChfcmVmMyA9IHRoaXMuY29tcG9uZW50VmlldykgIT0gbnVsbCA/IF9yZWYzLnVuYmluZC5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29tcG9uZW50QmluZGluZztcblxuICB9KShSaXZldHMuQmluZGluZyk7XG5cbiAgUml2ZXRzLlRleHRCaW5kaW5nID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUZXh0QmluZGluZywgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIFRleHRCaW5kaW5nKHZpZXcsIGVsLCB0eXBlLCBrZXlwYXRoLCBvcHRpb25zKSB7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMua2V5cGF0aCA9IGtleXBhdGg7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zIDoge307XG4gICAgICB0aGlzLnN5bmMgPSBfX2JpbmQodGhpcy5zeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMuZm9ybWF0dGVycyA9IHRoaXMub3B0aW9ucy5mb3JtYXR0ZXJzIHx8IFtdO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgIHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzID0ge307XG4gICAgfVxuXG4gICAgVGV4dEJpbmRpbmcucHJvdG90eXBlLmJpbmRlciA9IHtcbiAgICAgIHJvdXRpbmU6IGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBub2RlLmRhdGEgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVGV4dEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBUZXh0QmluZGluZy5fX3N1cGVyX18uc3luYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGV4dEJpbmRpbmc7XG5cbiAgfSkoUml2ZXRzLkJpbmRpbmcpO1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnRleHQgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICBpZiAoZWwudGV4dENvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbC5pbm5lclRleHQgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuaHRtbCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5pbm5lckhUTUwgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5zaG93ID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLmhpZGUgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJ25vbmUnIDogJyc7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuZW5hYmxlZCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5kaXNhYmxlZCA9ICF2YWx1ZTtcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5kaXNhYmxlZCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5kaXNhYmxlZCA9ICEhdmFsdWU7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuY2hlY2tlZCA9IHtcbiAgICBwdWJsaXNoZXM6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAoKF9yZWYxID0gZWwudmFsdWUpICE9IG51bGwgPyBfcmVmMS50b1N0cmluZygpIDogdm9pZCAwKSA9PT0gKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gISF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMudW5jaGVja2VkID0ge1xuICAgIHB1Ymxpc2hlczogdHJ1ZSxcbiAgICBwcmlvcml0eTogMjAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICgoX3JlZjEgPSBlbC52YWx1ZSkgIT0gbnVsbCA/IF9yZWYxLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnZhbHVlID0ge1xuICAgIHB1Ymxpc2hlczogdHJ1ZSxcbiAgICBwcmlvcml0eTogMzAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKCEoZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiBlbC50eXBlID09PSAncmFkaW8nKSkge1xuICAgICAgICB0aGlzLmV2ZW50ID0gZWwudGFnTmFtZSA9PT0gJ1NFTEVDVCcgPyAnY2hhbmdlJyA6ICdpbnB1dCc7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsIHRoaXMuZXZlbnQsIHRoaXMucHVibGlzaCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAoIShlbC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsLnR5cGUgPT09ICdyYWRpbycpKSB7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgdGhpcy5ldmVudCwgdGhpcy5wdWJsaXNoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIG8sIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVzdWx0cztcbiAgICAgIGlmIChlbC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgcmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5qUXVlcnkgIT0gbnVsbCkge1xuICAgICAgICBlbCA9IGpRdWVyeShlbCk7XG4gICAgICAgIGlmICgodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAoKF9yZWYxID0gZWwudmFsKCkpICE9IG51bGwgPyBfcmVmMS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBlbC52YWwodmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZWwudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZScpIHtcbiAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWwubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgbyA9IGVsW19pXTtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChvLnNlbGVjdGVkID0gKF9yZWYyID0gby52YWx1ZSwgX19pbmRleE9mLmNhbGwodmFsdWUsIF9yZWYyKSA+PSAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09ICgoX3JlZjMgPSBlbC52YWx1ZSkgIT0gbnVsbCA/IF9yZWYzLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLnZhbHVlID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXSA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIGF0dHIsIGRlY2xhcmF0aW9uO1xuICAgICAgaWYgKHRoaXMubWFya2VyID09IG51bGwpIHtcbiAgICAgICAgYXR0ciA9IFt0aGlzLnZpZXcucHJlZml4LCB0aGlzLnR5cGVdLmpvaW4oJy0nKS5yZXBsYWNlKCctLScsICctJyk7XG4gICAgICAgIGRlY2xhcmF0aW9uID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB0aGlzLm1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCIgcml2ZXRzOiBcIiArIHRoaXMudHlwZSArIFwiIFwiICsgZGVjbGFyYXRpb24gKyBcIiBcIik7XG4gICAgICAgIHRoaXMuYm91bmQgPSBmYWxzZTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLm1hcmtlciwgZWwpO1xuICAgICAgICByZXR1cm4gZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMubmVzdGVkKSAhPSBudWxsID8gX3JlZjEudW5iaW5kKCkgOiB2b2lkIDA7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBrZXksIG1vZGVsLCBtb2RlbHMsIF9yZWYxO1xuICAgICAgaWYgKCEhdmFsdWUgPT09ICF0aGlzLmJvdW5kKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgICAgIF9yZWYxID0gdGhpcy52aWV3Lm1vZGVscztcbiAgICAgICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICAgICAgbW9kZWwgPSBfcmVmMVtrZXldO1xuICAgICAgICAgICAgbW9kZWxzW2tleV0gPSBtb2RlbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgKHRoaXMubmVzdGVkIHx8ICh0aGlzLm5lc3RlZCA9IG5ldyBSaXZldHMuVmlldyhlbCwgbW9kZWxzLCB0aGlzLnZpZXcub3B0aW9ucygpKSkpLmJpbmQoKTtcbiAgICAgICAgICB0aGlzLm1hcmtlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgdGhpcy5tYXJrZXIubmV4dFNpYmxpbmcpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmJvdW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICB0aGlzLm5lc3RlZC51bmJpbmQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ib3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMubmVzdGVkKSAhPSBudWxsID8gX3JlZjEudXBkYXRlKG1vZGVscykgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnVubGVzcyA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0uYmluZC5jYWxsKHRoaXMsIGVsKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXS51bmJpbmQuY2FsbCh0aGlzKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0ucm91dGluZS5jYWxsKHRoaXMsIGVsLCAhdmFsdWUpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHJldHVybiBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1tcImlmXCJdLnVwZGF0ZS5jYWxsKHRoaXMsIG1vZGVscyk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzWydvbi0qJ10gPSB7XG4gICAgXCJmdW5jdGlvblwiOiB0cnVlLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlcik7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyID0gdGhpcy5ldmVudEhhbmRsZXIodmFsdWUpKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbJ2VhY2gtKiddID0ge1xuICAgIGJsb2NrOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYXR0ciwgdmlldywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgaWYgKHRoaXMubWFya2VyID09IG51bGwpIHtcbiAgICAgICAgYXR0ciA9IFt0aGlzLnZpZXcucHJlZml4LCB0aGlzLnR5cGVdLmpvaW4oJy0nKS5yZXBsYWNlKCctLScsICctJyk7XG4gICAgICAgIHRoaXMubWFya2VyID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIiByaXZldHM6IFwiICsgdGhpcy50eXBlICsgXCIgXCIpO1xuICAgICAgICB0aGlzLml0ZXJhdGVkID0gW107XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5tYXJrZXIsIGVsKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfcmVmMSA9IHRoaXMuaXRlcmF0ZWQ7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICB2aWV3ID0gX3JlZjFbX2ldO1xuICAgICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgdmlldywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLml0ZXJhdGVkICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLml0ZXJhdGVkO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgdmlldyA9IF9yZWYxW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZpZXcudW5iaW5kKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCBjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgYmluZGluZywgZGF0YSwgaSwgaW5kZXgsIGtleSwgbW9kZWwsIG1vZGVsTmFtZSwgb3B0aW9ucywgcHJldmlvdXMsIHRlbXBsYXRlLCB2aWV3LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZXN1bHRzO1xuICAgICAgbW9kZWxOYW1lID0gdGhpcy5hcmdzWzBdO1xuICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24gfHwgW107XG4gICAgICBpZiAodGhpcy5pdGVyYXRlZC5sZW5ndGggPiBjb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBfcmVmMSA9IEFycmF5KHRoaXMuaXRlcmF0ZWQubGVuZ3RoIC0gY29sbGVjdGlvbi5sZW5ndGgpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgaSA9IF9yZWYxW19pXTtcbiAgICAgICAgICB2aWV3ID0gdGhpcy5pdGVyYXRlZC5wb3AoKTtcbiAgICAgICAgICB2aWV3LnVuYmluZCgpO1xuICAgICAgICAgIHRoaXMubWFya2VyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodmlldy5lbHNbMF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4ID0gX2ogPSAwLCBfbGVuMSA9IGNvbGxlY3Rpb24ubGVuZ3RoOyBfaiA8IF9sZW4xOyBpbmRleCA9ICsrX2opIHtcbiAgICAgICAgbW9kZWwgPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgfTtcbiAgICAgICAgZGF0YVttb2RlbE5hbWVdID0gbW9kZWw7XG4gICAgICAgIGlmICh0aGlzLml0ZXJhdGVkW2luZGV4XSA9PSBudWxsKSB7XG4gICAgICAgICAgX3JlZjIgPSB0aGlzLnZpZXcubW9kZWxzO1xuICAgICAgICAgIGZvciAoa2V5IGluIF9yZWYyKSB7XG4gICAgICAgICAgICBtb2RlbCA9IF9yZWYyW2tleV07XG4gICAgICAgICAgICBpZiAoZGF0YVtrZXldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgZGF0YVtrZXldID0gbW9kZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByZXZpb3VzID0gdGhpcy5pdGVyYXRlZC5sZW5ndGggPyB0aGlzLml0ZXJhdGVkW3RoaXMuaXRlcmF0ZWQubGVuZ3RoIC0gMV0uZWxzWzBdIDogdGhpcy5tYXJrZXI7XG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMudmlldy5vcHRpb25zKCk7XG4gICAgICAgICAgb3B0aW9ucy5wcmVsb2FkRGF0YSA9IHRydWU7XG4gICAgICAgICAgdGVtcGxhdGUgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgdmlldyA9IG5ldyBSaXZldHMuVmlldyh0ZW1wbGF0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgICAgdmlldy5iaW5kKCk7XG4gICAgICAgICAgdGhpcy5pdGVyYXRlZC5wdXNoKHZpZXcpO1xuICAgICAgICAgIHRoaXMubWFya2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBsYXRlLCBwcmV2aW91cy5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pdGVyYXRlZFtpbmRleF0ubW9kZWxzW21vZGVsTmFtZV0gIT09IG1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5pdGVyYXRlZFtpbmRleF0udXBkYXRlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdPUFRJT04nKSB7XG4gICAgICAgIF9yZWYzID0gdGhpcy52aWV3LmJpbmRpbmdzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmMy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICBiaW5kaW5nID0gX3JlZjNbX2tdO1xuICAgICAgICAgIGlmIChiaW5kaW5nLmVsID09PSB0aGlzLm1hcmtlci5wYXJlbnROb2RlICYmIGJpbmRpbmcudHlwZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLnN5bmMoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBkYXRhLCBrZXksIG1vZGVsLCB2aWV3LCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgZGF0YSA9IHt9O1xuICAgICAgZm9yIChrZXkgaW4gbW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2tleV07XG4gICAgICAgIGlmIChrZXkgIT09IHRoaXMuYXJnc1swXSkge1xuICAgICAgICAgIGRhdGFba2V5XSA9IG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcmVmMSA9IHRoaXMuaXRlcmF0ZWQ7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICB2aWV3ID0gX3JlZjFbX2ldO1xuICAgICAgICBfcmVzdWx0cy5wdXNoKHZpZXcudXBkYXRlKGRhdGEpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbJ2NsYXNzLSonXSA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHZhciBlbENsYXNzO1xuICAgIGVsQ2xhc3MgPSBcIiBcIiArIGVsLmNsYXNzTmFtZSArIFwiIFwiO1xuICAgIGlmICghdmFsdWUgPT09IChlbENsYXNzLmluZGV4T2YoXCIgXCIgKyB0aGlzLmFyZ3NbMF0gKyBcIiBcIikgIT09IC0xKSkge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSA9IHZhbHVlID8gXCJcIiArIGVsLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5hcmdzWzBdIDogZWxDbGFzcy5yZXBsYWNlKFwiIFwiICsgdGhpcy5hcmdzWzBdICsgXCIgXCIsICcgJykudHJpbSgpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1snKiddID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBlbC5zZXRBdHRyaWJ1dGUodGhpcy50eXBlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy50eXBlKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmFkYXB0ZXJzWycuJ10gPSB7XG4gICAgaWQ6ICdfcnYnLFxuICAgIGNvdW50ZXI6IDAsXG4gICAgd2Vha21hcDoge30sXG4gICAgd2Vha1JlZmVyZW5jZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgaWQsIF9iYXNlLCBfbmFtZTtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KHRoaXMuaWQpKSB7XG4gICAgICAgIGlkID0gdGhpcy5jb3VudGVyKys7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHRoaXMuaWQsIHtcbiAgICAgICAgICB2YWx1ZTogaWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKF9iYXNlID0gdGhpcy53ZWFrbWFwKVtfbmFtZSA9IG9ialt0aGlzLmlkXV0gfHwgKF9iYXNlW19uYW1lXSA9IHtcbiAgICAgICAgY2FsbGJhY2tzOiB7fVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjbGVhbnVwV2Vha1JlZmVyZW5jZTogZnVuY3Rpb24ocmVmLCBpZCkge1xuICAgICAgaWYgKCFPYmplY3Qua2V5cyhyZWYuY2FsbGJhY2tzKS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCEocmVmLnBvaW50ZXJzICYmIE9iamVjdC5rZXlzKHJlZi5wb2ludGVycykubGVuZ3RoKSkge1xuICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy53ZWFrbWFwW2lkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3R1YkZ1bmN0aW9uOiBmdW5jdGlvbihvYmosIGZuKSB7XG4gICAgICB2YXIgbWFwLCBvcmlnaW5hbCwgd2Vha21hcDtcbiAgICAgIG9yaWdpbmFsID0gb2JqW2ZuXTtcbiAgICAgIG1hcCA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopO1xuICAgICAgd2Vha21hcCA9IHRoaXMud2Vha21hcDtcbiAgICAgIHJldHVybiBvYmpbZm5dID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYWxsYmFjaywgaywgciwgcmVzcG9uc2UsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcbiAgICAgICAgcmVzcG9uc2UgPSBvcmlnaW5hbC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICAgIF9yZWYxID0gbWFwLnBvaW50ZXJzO1xuICAgICAgICBmb3IgKHIgaW4gX3JlZjEpIHtcbiAgICAgICAgICBrID0gX3JlZjFbcl07XG4gICAgICAgICAgX3JlZjQgPSAoX3JlZjIgPSAoX3JlZjMgPSB3ZWFrbWFwW3JdKSAhPSBudWxsID8gX3JlZjMuY2FsbGJhY2tzW2tdIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZjIgOiBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY0Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IF9yZWY0W19pXTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBvYnNlcnZlTXV0YXRpb25zOiBmdW5jdGlvbihvYmosIHJlZiwga2V5cGF0aCkge1xuICAgICAgdmFyIGZuLCBmdW5jdGlvbnMsIG1hcCwgX2Jhc2UsIF9pLCBfbGVuO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICBtYXAgPSB0aGlzLndlYWtSZWZlcmVuY2Uob2JqKTtcbiAgICAgICAgaWYgKG1hcC5wb2ludGVycyA9PSBudWxsKSB7XG4gICAgICAgICAgbWFwLnBvaW50ZXJzID0ge307XG4gICAgICAgICAgZnVuY3Rpb25zID0gWydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NvcnQnLCAncmV2ZXJzZScsICdzcGxpY2UnXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgZm4gPSBmdW5jdGlvbnNbX2ldO1xuICAgICAgICAgICAgdGhpcy5zdHViRnVuY3Rpb24ob2JqLCBmbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgoX2Jhc2UgPSBtYXAucG9pbnRlcnMpW3JlZl0gPT0gbnVsbCkge1xuICAgICAgICAgIF9iYXNlW3JlZl0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwobWFwLnBvaW50ZXJzW3JlZl0sIGtleXBhdGgpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBtYXAucG9pbnRlcnNbcmVmXS5wdXNoKGtleXBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1bm9ic2VydmVNdXRhdGlvbnM6IGZ1bmN0aW9uKG9iaiwgcmVmLCBrZXlwYXRoKSB7XG4gICAgICB2YXIgaWR4LCBtYXAsIHBvaW50ZXJzO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSAmJiAob2JqW3RoaXMuaWRdICE9IG51bGwpKSB7XG4gICAgICAgIGlmIChtYXAgPSB0aGlzLndlYWttYXBbb2JqW3RoaXMuaWRdXSkge1xuICAgICAgICAgIGlmIChwb2ludGVycyA9IG1hcC5wb2ludGVyc1tyZWZdKSB7XG4gICAgICAgICAgICBpZiAoKGlkeCA9IHBvaW50ZXJzLmluZGV4T2Yoa2V5cGF0aCkpID49IDApIHtcbiAgICAgICAgICAgICAgcG9pbnRlcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBvaW50ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBkZWxldGUgbWFwLnBvaW50ZXJzW3JlZl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbnVwV2Vha1JlZmVyZW5jZShtYXAsIG9ialt0aGlzLmlkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvYnNlcnZlOiBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzLCBkZXNjLCB2YWx1ZTtcbiAgICAgIGNhbGxiYWNrcyA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopLmNhbGxiYWNrcztcbiAgICAgIGlmIChjYWxsYmFja3Nba2V5cGF0aF0gPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFja3Nba2V5cGF0aF0gPSBbXTtcbiAgICAgICAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXlwYXRoKTtcbiAgICAgICAgaWYgKCEoKGRlc2MgIT0gbnVsbCA/IGRlc2MuZ2V0IDogdm9pZCAwKSB8fCAoZGVzYyAhPSBudWxsID8gZGVzYy5zZXQgOiB2b2lkIDApKSkge1xuICAgICAgICAgIHZhbHVlID0gb2JqW2tleXBhdGhdO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleXBhdGgsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hcCwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzLnVub2JzZXJ2ZU11dGF0aW9ucyh2YWx1ZSwgb2JqW190aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgaWYgKG1hcCA9IF90aGlzLndlYWttYXBbb2JqW190aGlzLmlkXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzID0gbWFwLmNhbGxiYWNrcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrc1trZXlwYXRoXSkge1xuICAgICAgICAgICAgICAgICAgICAgIF9yZWYxID0gY2FsbGJhY2tzW2tleXBhdGhdLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBfcmVmMVtfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwoY2FsbGJhY2tzW2tleXBhdGhdLCBjYWxsYmFjaykgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMub2JzZXJ2ZU11dGF0aW9ucyhuZXdWYWx1ZSwgb2JqW190aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKGNhbGxiYWNrc1trZXlwYXRoXSwgY2FsbGJhY2spIDwgMCkge1xuICAgICAgICBjYWxsYmFja3Nba2V5cGF0aF0ucHVzaChjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlTXV0YXRpb25zKG9ialtrZXlwYXRoXSwgb2JqW3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICB9LFxuICAgIHVub2JzZXJ2ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGNhbGxiYWNrcywgaWR4LCBtYXA7XG4gICAgICBpZiAobWFwID0gdGhpcy53ZWFrbWFwW29ialt0aGlzLmlkXV0pIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcyA9IG1hcC5jYWxsYmFja3Nba2V5cGF0aF0pIHtcbiAgICAgICAgICBpZiAoKGlkeCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKSkgPj0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBtYXAuY2FsbGJhY2tzW2tleXBhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnVub2JzZXJ2ZU11dGF0aW9ucyhvYmpba2V5cGF0aF0sIG9ialt0aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW51cFdlYWtSZWZlcmVuY2UobWFwLCBvYmpbdGhpcy5pZF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgcmV0dXJuIG9ialtrZXlwYXRoXTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXlwYXRoXSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuZmFjdG9yeSA9IGZ1bmN0aW9uKHNpZ2h0Z2xhc3MpIHtcbiAgICBSaXZldHMuc2lnaHRnbGFzcyA9IHNpZ2h0Z2xhc3M7XG4gICAgUml2ZXRzW1wicHVibGljXCJdLl8gPSBSaXZldHM7XG4gICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXTtcbiAgfTtcblxuICBpZiAodHlwZW9mICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZSAhPT0gbnVsbCA/IG1vZHVsZS5leHBvcnRzIDogdm9pZCAwKSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJpdmV0cy5mYWN0b3J5KHJlcXVpcmUoJ3NpZ2h0Z2xhc3MnKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnc2lnaHRnbGFzcyddLCBmdW5jdGlvbihzaWdodGdsYXNzKSB7XG4gICAgICByZXR1cm4gdGhpcy5yaXZldHMgPSBSaXZldHMuZmFjdG9yeShzaWdodGdsYXNzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnJpdmV0cyA9IFJpdmV0cy5mYWN0b3J5KHNpZ2h0Z2xhc3MpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIC8vIFB1YmxpYyBzaWdodGdsYXNzIGludGVyZmFjZS5cbiAgZnVuY3Rpb24gc2lnaHRnbGFzcyhvYmosIGtleXBhdGgsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZlcihvYmosIGtleXBhdGgsIGNhbGxiYWNrLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gQmF0dGVyaWVzIG5vdCBpbmNsdWRlZC5cbiAgc2lnaHRnbGFzcy5hZGFwdGVycyA9IHt9XG5cbiAgLy8gQ29uc3RydWN0cyBhIG5ldyBrZXlwYXRoIG9ic2VydmVyIGFuZCBraWNrcyB0aGluZ3Mgb2ZmLlxuICBmdW5jdGlvbiBPYnNlcnZlcihvYmosIGtleXBhdGgsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHRoaXMub3B0aW9ucy5hZGFwdGVycyA9IHRoaXMub3B0aW9ucy5hZGFwdGVycyB8fCB7fVxuICAgIHRoaXMub2JqID0gb2JqXG4gICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aFxuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIHRoaXMub2JqZWN0UGF0aCA9IFtdXG4gICAgdGhpcy51cGRhdGUgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5wYXJzZSgpXG5cbiAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQgPSB0aGlzLnJlYWxpemUoKSkpIHtcbiAgICAgIHRoaXMuc2V0KHRydWUsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICAvLyBUb2tlbml6ZXMgdGhlIHByb3ZpZGVkIGtleXBhdGggc3RyaW5nIGludG8gaW50ZXJmYWNlICsgcGF0aCB0b2tlbnMgZm9yIHRoZVxuICAvLyBvYnNlcnZlciB0byB3b3JrIHdpdGguXG4gIE9ic2VydmVyLnRva2VuaXplID0gZnVuY3Rpb24oa2V5cGF0aCwgaW50ZXJmYWNlcywgcm9vdCkge1xuICAgIHZhciB0b2tlbnMgPSBbXVxuICAgIHZhciBjdXJyZW50ID0ge2k6IHJvb3QsIHBhdGg6ICcnfVxuICAgIHZhciBpbmRleCwgY2hyXG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBrZXlwYXRoLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY2hyID0ga2V5cGF0aC5jaGFyQXQoaW5kZXgpXG5cbiAgICAgIGlmICghIX5pbnRlcmZhY2VzLmluZGV4T2YoY2hyKSkge1xuICAgICAgICB0b2tlbnMucHVzaChjdXJyZW50KVxuICAgICAgICBjdXJyZW50ID0ge2k6IGNociwgcGF0aDogJyd9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50LnBhdGggKz0gY2hyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9rZW5zLnB1c2goY3VycmVudClcbiAgICByZXR1cm4gdG9rZW5zXG4gIH1cblxuICAvLyBQYXJzZXMgdGhlIGtleXBhdGggdXNpbmcgdGhlIGludGVyZmFjZXMgZGVmaW5lZCBvbiB0aGUgdmlldy4gU2V0cyB2YXJpYWJsZXNcbiAgLy8gZm9yIHRoZSB0b2tlbml6ZWQga2V5cGF0aCBhcyB3ZWxsIGFzIHRoZSBlbmQga2V5LlxuICBPYnNlcnZlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW50ZXJmYWNlcyA9IHRoaXMuaW50ZXJmYWNlcygpXG4gICAgdmFyIHJvb3QsIHBhdGhcblxuICAgIGlmICghaW50ZXJmYWNlcy5sZW5ndGgpIHtcbiAgICAgIGVycm9yKCdNdXN0IGRlZmluZSBhdCBsZWFzdCBvbmUgYWRhcHRlciBpbnRlcmZhY2UuJylcbiAgICB9XG5cbiAgICBpZiAoISF+aW50ZXJmYWNlcy5pbmRleE9mKHRoaXMua2V5cGF0aFswXSkpIHtcbiAgICAgIHJvb3QgPSB0aGlzLmtleXBhdGhbMF1cbiAgICAgIHBhdGggPSB0aGlzLmtleXBhdGguc3Vic3RyKDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgKHJvb3QgPSB0aGlzLm9wdGlvbnMucm9vdCB8fCBzaWdodGdsYXNzLnJvb3QpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBlcnJvcignTXVzdCBkZWZpbmUgYSBkZWZhdWx0IHJvb3QgYWRhcHRlci4nKVxuICAgICAgfVxuXG4gICAgICBwYXRoID0gdGhpcy5rZXlwYXRoXG4gICAgfVxuXG4gICAgdGhpcy50b2tlbnMgPSBPYnNlcnZlci50b2tlbml6ZShwYXRoLCBpbnRlcmZhY2VzLCByb290KVxuICAgIHRoaXMua2V5ID0gdGhpcy50b2tlbnMucG9wKClcbiAgfVxuXG4gIC8vIFJlYWxpemVzIHRoZSBmdWxsIGtleXBhdGgsIGF0dGFjaGluZyBvYnNlcnZlcnMgZm9yIGV2ZXJ5IGtleSBhbmQgY29ycmVjdGluZ1xuICAvLyBvbGQgb2JzZXJ2ZXJzIHRvIGFueSBjaGFuZ2VkIG9iamVjdHMgaW4gdGhlIGtleXBhdGguXG4gIE9ic2VydmVyLnByb3RvdHlwZS5yZWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLm9ialxuICAgIHZhciB1bnJlYWNoZWQgPSBmYWxzZVxuICAgIHZhciBwcmV2XG5cbiAgICB0aGlzLnRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKHRva2VuLCBpbmRleCkge1xuICAgICAgaWYgKGlzT2JqZWN0KGN1cnJlbnQpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vYmplY3RQYXRoW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAoY3VycmVudCAhPT0gKHByZXYgPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBwcmV2LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRva2VuLCBjdXJyZW50LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgICAgIHRoaXMub2JqZWN0UGF0aFtpbmRleF0gPSBjdXJyZW50XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRva2VuLCBjdXJyZW50LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgICB0aGlzLm9iamVjdFBhdGhbaW5kZXhdID0gY3VycmVudFxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudCA9IHRoaXMuZ2V0KHRva2VuLCBjdXJyZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHVucmVhY2hlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB1bnJlYWNoZWQgPSBpbmRleFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZXYgPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSB7XG4gICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBwcmV2LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpXG5cbiAgICBpZiAodW5yZWFjaGVkICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vYmplY3RQYXRoLnNwbGljZSh1bnJlYWNoZWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgdGhlIGtleXBhdGguIFRoaXMgaXMgY2FsbGVkIHdoZW4gYW55IGludGVybWVkaWFyeSBrZXkgaXMgY2hhbmdlZC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXh0LCBvbGRWYWx1ZVxuXG4gICAgaWYgKChuZXh0ID0gdGhpcy5yZWFsaXplKCkpICE9PSB0aGlzLnRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLnNldChmYWxzZSwgdGhpcy5rZXksIHRoaXMudGFyZ2V0LCB0aGlzLmNhbGxiYWNrKVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNPYmplY3QobmV4dCkpIHtcbiAgICAgICAgdGhpcy5zZXQodHJ1ZSwgdGhpcy5rZXksIG5leHQsIHRoaXMuY2FsbGJhY2spXG4gICAgICB9XG5cbiAgICAgIG9sZFZhbHVlID0gdGhpcy52YWx1ZSgpXG4gICAgICB0aGlzLnRhcmdldCA9IG5leHRcblxuICAgICAgaWYgKHRoaXMudmFsdWUoKSAhPT0gb2xkVmFsdWUpIHRoaXMuY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlYWRzIHRoZSBjdXJyZW50IGVuZCB2YWx1ZSBvZiB0aGUgb2JzZXJ2ZWQga2V5cGF0aC4gUmV0dXJucyB1bmRlZmluZWQgaWZcbiAgLy8gdGhlIGZ1bGwga2V5cGF0aCBpcyB1bnJlYWNoYWJsZS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMua2V5LCB0aGlzLnRhcmdldClcbiAgICB9XG4gIH1cblxuICAvLyBTZXRzIHRoZSBjdXJyZW50IGVuZCB2YWx1ZSBvZiB0aGUgb2JzZXJ2ZWQga2V5cGF0aC4gQ2FsbGluZyBzZXRWYWx1ZSB3aGVuXG4gIC8vIHRoZSBmdWxsIGtleXBhdGggaXMgdW5yZWFjaGFibGUgaXMgYSBuby1vcC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQpKSB7XG4gICAgICB0aGlzLmFkYXB0ZXIodGhpcy5rZXkpLnNldCh0aGlzLnRhcmdldCwgdGhpcy5rZXkucGF0aCwgdmFsdWUpXG4gICAgfVxuICB9XG5cbiAgLy8gR2V0cyB0aGUgcHJvdmlkZWQga2V5IG9uIGFuIG9iamVjdC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgb2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlcihrZXkpLmdldChvYmosIGtleS5wYXRoKVxuICB9XG5cbiAgLy8gT2JzZXJ2ZXMgb3IgdW5vYnNlcnZlcyBhIGNhbGxiYWNrIG9uIHRoZSBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIGtleS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGFjdGl2ZSwga2V5LCBvYmosIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFjdGlvbiA9IGFjdGl2ZSA/ICdvYnNlcnZlJyA6ICd1bm9ic2VydmUnXG4gICAgdGhpcy5hZGFwdGVyKGtleSlbYWN0aW9uXShvYmosIGtleS5wYXRoLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHVuaXF1ZSBhZGFwdGVyIGludGVyZmFjZXMgYXZhaWxhYmxlLlxuICBPYnNlcnZlci5wcm90b3R5cGUuaW50ZXJmYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnRlcmZhY2VzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmFkYXB0ZXJzKVxuXG4gICAgT2JqZWN0LmtleXMoc2lnaHRnbGFzcy5hZGFwdGVycykuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICBpZiAoIX5pbnRlcmZhY2VzLmluZGV4T2YoaSkpIHtcbiAgICAgICAgaW50ZXJmYWNlcy5wdXNoKGkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBpbnRlcmZhY2VzXG4gIH1cblxuICAvLyBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBncmFiIHRoZSBhZGFwdGVyIGZvciBhIHNwZWNpZmljIGtleS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLmFkYXB0ZXIgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFkYXB0ZXJzW2tleS5pXSB8fFxuICAgICAgc2lnaHRnbGFzcy5hZGFwdGVyc1trZXkuaV1cbiAgfVxuXG4gIC8vIFVub2JzZXJ2ZXMgdGhlIGVudGlyZSBrZXlwYXRoLlxuICBPYnNlcnZlci5wcm90b3R5cGUudW5vYnNlcnZlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9ialxuXG4gICAgdGhpcy50b2tlbnMuZm9yRWFjaChmdW5jdGlvbih0b2tlbiwgaW5kZXgpIHtcbiAgICAgIGlmIChvYmogPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSB7XG4gICAgICAgIHRoaXMuc2V0KGZhbHNlLCB0b2tlbiwgb2JqLCB0aGlzLnVwZGF0ZSlcbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuXG4gICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgdGhpcy5zZXQoZmFsc2UsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICAvLyBDaGVjayBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCB0aGFuIGNhbiBiZSBvYnNlcnZlZC5cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbFxuICB9XG5cbiAgLy8gRXJyb3IgdGhyb3dlci5cbiAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignW3NpZ2h0Z2xhc3NdICcgKyBtZXNzYWdlKVxuICB9XG5cbiAgLy8gRXhwb3J0IG1vZHVsZSBmb3IgTm9kZSBhbmQgdGhlIGJyb3dzZXIuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2lnaHRnbGFzc1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaWdodGdsYXNzID0gc2lnaHRnbGFzc1xuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zaWdodGdsYXNzID0gc2lnaHRnbGFzc1xuICB9XG59KS5jYWxsKHRoaXMpO1xuIl19
