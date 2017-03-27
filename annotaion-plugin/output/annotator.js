/*
    http://www.JSON.org/json2.js
    2010-11-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;// Generated by CoffeeScript 1.7.1
var $, Util, gettext, _gettext, _ref, _t;

gettext = null;

if (typeof Gettext !== "undefined" && Gettext !== null) {
  _gettext = new Gettext({
    domain: "annotator"
  });
  gettext = function(msgid) {
    return _gettext.gettext(msgid);
  };
} else {
  gettext = function(msgid) {
    return msgid;
  };
}

_t = function(msgid) {
  return gettext(msgid);
};

if (!(typeof jQuery !== "undefined" && jQuery !== null ? (_ref = jQuery.fn) != null ? _ref.jquery : void 0 : void 0)) {
  console.error(_t("Annotator requires jQuery: have you included lib/vendor/jquery.js?"));
}

if (!(JSON && JSON.parse && JSON.stringify)) {
  console.error(_t("Annotator requires a JSON implementation: have you included lib/vendor/json2.js?"));
}

$ = jQuery;

Util = {};

Util.flatten = function(array) {
  var flatten;
  flatten = function(ary) {
    var el, flat, _i, _len;
    flat = [];
    for (_i = 0, _len = ary.length; _i < _len; _i++) {
      el = ary[_i];
      flat = flat.concat(el && $.isArray(el) ? flatten(el) : el);
    }
    return flat;
  };
  return flatten(array);
};

Util.contains = function(parent, child) {
  var node;
  node = child;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

Util.getTextNodes = function(jq) {
  var getTextNodes;
  getTextNodes = function(node) {
    var nodes;
    if (node && node.nodeType !== Node.TEXT_NODE) {
      nodes = [];
      if (node.nodeType !== Node.COMMENT_NODE) {
        node = node.lastChild;
        while (node) {
          nodes.push(getTextNodes(node));
          node = node.previousSibling;
        }
      }
      return nodes.reverse();
    } else {
      return node;
    }
  };
  return jq.map(function() {
    return Util.flatten(getTextNodes(this));
  });
};

Util.getLastTextNodeUpTo = function(n) {
  var result;
  switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n;
    case Node.ELEMENT_NODE:
      if (n.lastChild != null) {
        result = Util.getLastTextNodeUpTo(n.lastChild);
        if (result != null) {
          return result;
        }
      }
      break;
  }
  n = n.previousSibling;
  if (n != null) {
    return Util.getLastTextNodeUpTo(n);
  } else {
    return null;
  }
};

Util.getFirstTextNodeNotBefore = function(n) {
  var result;
  switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n;
    case Node.ELEMENT_NODE:
      if (n.firstChild != null) {
        result = Util.getFirstTextNodeNotBefore(n.firstChild);
        if (result != null) {
          return result;
        }
      }
      break;
  }
  n = n.nextSibling;
  if (n != null) {
    return Util.getFirstTextNodeNotBefore(n);
  } else {
    return null;
  }
};

Util.readRangeViaSelection = function(range) {
  var sel;
  sel = Util.getGlobal().getSelection();
  sel.removeAllRanges();
  sel.addRange(range.toRange());
  return sel.toString();
};

Util.xpathFromNode = function(el, relativeRoot) {
  var exception, result;
  try {
    result = simpleXPathJQuery.call(el, relativeRoot);
  } catch (_error) {
    exception = _error;
    console.log("jQuery-based XPath construction failed! Falling back to manual.");
    result = simpleXPathPure.call(el, relativeRoot);
  }
  return result;
};

Util.nodeFromXPath = function(xp, root) {
  var idx, name, node, step, steps, _i, _len, _ref1;
  steps = xp.substring(1).split("/");
  node = root;
  for (_i = 0, _len = steps.length; _i < _len; _i++) {
    step = steps[_i];
    _ref1 = step.split("["), name = _ref1[0], idx = _ref1[1];
    idx = idx != null ? parseInt((idx != null ? idx.split("]") : void 0)[0]) : 1;
    node = findChild(node, name.toLowerCase(), idx);
  }
  return node;
};

Util.escape = function(html) {
  return html.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

Util.uuid = (function() {
  var counter;
  counter = 0;
  return function() {
    return counter++;
  };
})();

Util.getGlobal = function() {
  return (function() {
    return this;
  })();
};

Util.maxZIndex = function($elements) {
  var all, el;
  all = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = $elements.length; _i < _len; _i++) {
      el = $elements[_i];
      if ($(el).css('position') === 'static') {
        _results.push(-1);
      } else {
        _results.push(parseFloat($(el).css('z-index')) || -1);
      }
    }
    return _results;
  })();
  return Math.max.apply(Math, all);
};

Util.mousePosition = function(e, offsetEl) {
  var offset, _ref1;
  if ((_ref1 = $(offsetEl).css('position')) !== 'absolute' && _ref1 !== 'fixed' && _ref1 !== 'relative') {
    offsetEl = $(offsetEl).offsetParent()[0];
  }
  offset = $(offsetEl).offset();
  return {
    top: e.pageY - offset.top,
    left: e.pageX - offset.left
  };
};

Util.preventEventDefault = function(event) {
  return event != null ? typeof event.preventDefault === "function" ? event.preventDefault() : void 0 : void 0;
};

//# sourceMappingURL=util.map
;// Generated by CoffeeScript 1.7.1
var fn, functions, _i, _j, _len, _len1,
  __slice = [].slice;

functions = ["log", "debug", "info", "warn", "exception", "assert", "dir", "dirxml", "trace", "group", "groupEnd", "groupCollapsed", "time", "timeEnd", "profile", "profileEnd", "count", "clear", "table", "error", "notifyFirebug", "firebug", "userObjects"];

if (typeof console !== "undefined" && console !== null) {
  if (console.group == null) {
    console.group = function(name) {
      return console.log("GROUP: ", name);
    };
  }
  if (console.groupCollapsed == null) {
    console.groupCollapsed = console.group;
  }
  for (_i = 0, _len = functions.length; _i < _len; _i++) {
    fn = functions[_i];
    if (console[fn] == null) {
      console[fn] = function() {
        return console.log(_t("Not implemented:") + (" console." + name));
      };
    }
  }
} else {
  this.console = {};
  for (_j = 0, _len1 = functions.length; _j < _len1; _j++) {
    fn = functions[_j];
    this.console[fn] = function() {};
  }
  this.console['error'] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return alert("ERROR: " + (args.join(', ')));
  };
  this.console['warn'] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return alert("WARNING: " + (args.join(', ')));
  };
}

//# sourceMappingURL=console.map
;// Generated by CoffeeScript 1.7.1
var Delegator,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

Delegator = (function() {
  Delegator.prototype.events = {};

  Delegator.prototype.options = {};

  Delegator.prototype.element = null;

  function Delegator(element, options) {
    this.options = $.extend(true, {}, this.options, options);
    this.element = $(element);
    this._closures = {};
    this.on = this.subscribe;
    this.addEvents();
  }

  Delegator.prototype.destroy = function() {
    return this.removeEvents();
  };

  Delegator.prototype.addEvents = function() {
    var event, _i, _len, _ref, _results;
    _ref = Delegator._parseEvents(this.events);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      _results.push(this._addEvent(event.selector, event.event, event.functionName));
    }
    return _results;
  };

  Delegator.prototype.removeEvents = function() {
    var event, _i, _len, _ref, _results;
    _ref = Delegator._parseEvents(this.events);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      _results.push(this._removeEvent(event.selector, event.event, event.functionName));
    }
    return _results;
  };

  Delegator.prototype._addEvent = function(selector, event, functionName) {
    var closure;
    closure = (function(_this) {
      return function() {
        return _this[functionName].apply(_this, arguments);
      };
    })(this);
    if (selector === '' && Delegator._isCustomEvent(event)) {
      this.subscribe(event, closure);
    } else {
      this.element.delegate(selector, event, closure);
    }
    this._closures["" + selector + "/" + event + "/" + functionName] = closure;
    return this;
  };

  Delegator.prototype._removeEvent = function(selector, event, functionName) {
    var closure;
    closure = this._closures["" + selector + "/" + event + "/" + functionName];
    if (selector === '' && Delegator._isCustomEvent(event)) {
      this.unsubscribe(event, closure);
    } else {
      this.element.undelegate(selector, event, closure);
    }
    delete this._closures["" + selector + "/" + event + "/" + functionName];
    return this;
  };

  Delegator.prototype.publish = function() {
    this.element.triggerHandler.apply(this.element, arguments);
    return this;
  };

  Delegator.prototype.subscribe = function(event, callback) {
    var closure;
    closure = function() {
      return callback.apply(this, [].slice.call(arguments, 1));
    };
    closure.guid = callback.guid = ($.guid += 1);
    this.element.bind(event, closure);
    return this;
  };

  Delegator.prototype.unsubscribe = function() {
    this.element.unbind.apply(this.element, arguments);
    return this;
  };

  return Delegator;

})();

Delegator._parseEvents = function(eventsObj) {
  var event, events, functionName, sel, selector, _i, _ref;
  events = [];
  for (sel in eventsObj) {
    functionName = eventsObj[sel];
    _ref = sel.split(' '), selector = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), event = _ref[_i++];
    events.push({
      selector: selector.join(' '),
      event: event,
      functionName: functionName
    });
  }
  return events;
};

Delegator.natives = (function() {
  var key, specials, val;
  specials = (function() {
    var _ref, _results;
    _ref = jQuery.event.special;
    _results = [];
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      val = _ref[key];
      _results.push(key);
    }
    return _results;
  })();
  return "blur focus focusin focusout load resize scroll unload click dblclick\nmousedown mouseup mousemove mouseover mouseout mouseenter mouseleave\nchange select submit keydown keypress keyup error".split(/[^a-z]+/).concat(specials);
})();

Delegator._isCustomEvent = function(event) {
  event = event.split('.')[0];
  return $.inArray(event, Delegator.natives) === -1;
};

//# sourceMappingURL=class.map
;// Generated by CoffeeScript 1.7.1
var Range,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Range = {};

Range.sniff = function(r) {
  if (r.commonAncestorContainer != null) {
    return new Range.BrowserRange(r);
  } else if (typeof r.start === "string") {
    return new Range.SerializedRange(r);
  } else if (r.start && typeof r.start === "object") {
    return new Range.NormalizedRange(r);
  } else {
    console.error(_t("Could not sniff range type"));
    return false;
  }
};

Range.nodeFromXPath = function(xpath, root) {
  var customResolver, evaluateXPath, namespace, node, segment;
  if (root == null) {
    root = document;
  }
  evaluateXPath = function(xp, nsResolver) {
    var exception;
    if (nsResolver == null) {
      nsResolver = null;
    }
    try {
      return document.evaluate('.' + xp, root, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch (_error) {
      exception = _error;
      console.log("XPath evaluation failed.");
      console.log("Trying fallback...");
      return Util.nodeFromXPath(xp, root);
    }
  };
  if (!$.isXMLDoc(document.documentElement)) {
    return evaluateXPath(xpath);
  } else {
    customResolver = document.createNSResolver(document.ownerDocument === null ? document.documentElement : document.ownerDocument.documentElement);
    node = evaluateXPath(xpath, customResolver);
    if (!node) {
      xpath = ((function() {
        var _i, _len, _ref, _results;
        _ref = xpath.split('/');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          segment = _ref[_i];
          if (segment && segment.indexOf(':') === -1) {
            _results.push(segment.replace(/^([a-z]+)/, 'xhtml:$1'));
          } else {
            _results.push(segment);
          }
        }
        return _results;
      })()).join('/');
      namespace = document.lookupNamespaceURI(null);
      customResolver = function(ns) {
        if (ns === 'xhtml') {
          return namespace;
        } else {
          return document.documentElement.getAttribute('xmlns:' + ns);
        }
      };
      node = evaluateXPath(xpath, customResolver);
    }
    return node;
  }
};

Range.RangeError = (function(_super) {
  __extends(RangeError, _super);

  function RangeError(type, message, parent) {
    this.type = type;
    this.message = message;
    this.parent = parent != null ? parent : null;
    RangeError.__super__.constructor.call(this, this.message);
  }

  return RangeError;

})(Error);

Range.BrowserRange = (function() {
  function BrowserRange(obj) {
    this.commonAncestorContainer = obj.commonAncestorContainer;
    this.startContainer = obj.startContainer;
    this.startOffset = obj.startOffset;
    this.endContainer = obj.endContainer;
    this.endOffset = obj.endOffset;
  }

  BrowserRange.prototype.normalize = function(root) {
    var n, node, nr, r;
    if (this.tainted) {
      console.error(_t("You may only call normalize() once on a BrowserRange!"));
      return false;
    } else {
      this.tainted = true;
    }
    r = {};
    if (this.startContainer.nodeType === Node.ELEMENT_NODE) {
      r.start = Util.getFirstTextNodeNotBefore(this.startContainer.childNodes[this.startOffset]);
      r.startOffset = 0;
    } else {
      r.start = this.startContainer;
      r.startOffset = this.startOffset;
    }
    if (this.endContainer.nodeType === Node.ELEMENT_NODE) {
      node = this.endContainer.childNodes[this.endOffset];
      if (node != null) {
        n = node;
        while ((n != null) && (n.nodeType !== Node.TEXT_NODE)) {
          n = n.firstChild;
        }
        if (n != null) {
          r.end = n;
          r.endOffset = 0;
        }
      }
      if (r.end == null) {
        if (this.endOffset) {
          node = this.endContainer.childNodes[this.endOffset - 1];
        } else {
          node = this.endContainer.previousSibling;
        }
        r.end = Util.getLastTextNodeUpTo(node);
        r.endOffset = r.end.nodeValue.length;
      }
    } else {
      r.end = this.endContainer;
      r.endOffset = this.endOffset;
    }
    nr = {};
    if (r.startOffset > 0) {
      if (r.start.nodeValue.length > r.startOffset) {
        nr.start = r.start.splitText(r.startOffset);
      } else {
        nr.start = r.start.nextSibling;
      }
    } else {
      nr.start = r.start;
    }
    if (r.start === r.end) {
      if (nr.start.nodeValue.length > (r.endOffset - r.startOffset)) {
        nr.start.splitText(r.endOffset - r.startOffset);
      }
      nr.end = nr.start;
    } else {
      if (r.end.nodeValue.length > r.endOffset) {
        r.end.splitText(r.endOffset);
      }
      nr.end = r.end;
    }
    nr.commonAncestor = this.commonAncestorContainer;
    while (nr.commonAncestor.nodeType !== Node.ELEMENT_NODE) {
      nr.commonAncestor = nr.commonAncestor.parentNode;
    }
    return new Range.NormalizedRange(nr);
  };

  BrowserRange.prototype.serialize = function(root, ignoreSelector) {
    return this.normalize(root).serialize(root, ignoreSelector);
  };

  return BrowserRange;

})();

Range.NormalizedRange = (function() {
  function NormalizedRange(obj) {
    this.commonAncestor = obj.commonAncestor;
    this.start = obj.start;
    this.end = obj.end;
  }

  NormalizedRange.prototype.normalize = function(root) {
    return this;
  };

  NormalizedRange.prototype.limit = function(bounds) {
    var nodes, parent, startParents, _i, _len, _ref;
    nodes = $.grep(this.textNodes(), function(node) {
      return node.parentNode === bounds || $.contains(bounds, node.parentNode);
    });
    if (!nodes.length) {
      return null;
    }
    this.start = nodes[0];
    this.end = nodes[nodes.length - 1];
    startParents = $(this.start).parents();
    _ref = $(this.end).parents();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      parent = _ref[_i];
      if (startParents.index(parent) !== -1) {
        this.commonAncestor = parent;
        break;
      }
    }
    return this;
  };

  NormalizedRange.prototype.serialize = function(root, ignoreSelector) {
    var end, serialization, start;
    serialization = function(node, isEnd) {
      var n, nodes, offset, origParent, textNodes, xpath, _i, _len;
      if (ignoreSelector) {
        origParent = $(node).parents(":not(" + ignoreSelector + ")").eq(0);
      } else {
        origParent = $(node).parent();
      }
      xpath = Util.xpathFromNode(origParent, root)[0];
      textNodes = Util.getTextNodes(origParent);
      nodes = textNodes.slice(0, textNodes.index(node));
      offset = 0;
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        offset += n.nodeValue.length;
      }
      if (isEnd) {
        return [xpath, offset + node.nodeValue.length];
      } else {
        return [xpath, offset];
      }
    };
    start = serialization(this.start);
    end = serialization(this.end, true);
    return new Range.SerializedRange({
      start: start[0],
      end: end[0],
      startOffset: start[1],
      endOffset: end[1]
    });
  };

  NormalizedRange.prototype.text = function() {
    var node;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.textNodes();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.nodeValue);
      }
      return _results;
    }).call(this)).join('');
  };

  NormalizedRange.prototype.textNodes = function() {
    var end, start, textNodes, _ref;
    textNodes = Util.getTextNodes($(this.commonAncestor));
    _ref = [textNodes.index(this.start), textNodes.index(this.end)], start = _ref[0], end = _ref[1];
    return $.makeArray(textNodes.slice(start, +end + 1 || 9e9));
  };

  NormalizedRange.prototype.toRange = function() {
    var range;
    range = document.createRange();
    range.setStartBefore(this.start);
    range.setEndAfter(this.end);
    return range;
  };

  return NormalizedRange;

})();

Range.SerializedRange = (function() {
  function SerializedRange(obj) {
    this.start = obj.start;
    this.startOffset = obj.startOffset;
    this.end = obj.end;
    this.endOffset = obj.endOffset;
  }

  SerializedRange.prototype.normalize = function(root) {
    var contains, e, length, node, p, range, targetOffset, tn, _i, _j, _len, _len1, _ref, _ref1;
    range = {};
    _ref = ['start', 'end'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      try {
        node = Range.nodeFromXPath(this[p], root);
      } catch (_error) {
        e = _error;
        throw new Range.RangeError(p, ("Error while finding " + p + " node: " + this[p] + ": ") + e, e);
      }
      if (!node) {
        throw new Range.RangeError(p, "Couldn't find " + p + " node: " + this[p]);
      }
      length = 0;
      targetOffset = this[p + 'Offset'];
      if (p === 'end') {
        targetOffset--;
      }
      _ref1 = Util.getTextNodes($(node));
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tn = _ref1[_j];
        if (length + tn.nodeValue.length > targetOffset) {
          range[p + 'Container'] = tn;
          range[p + 'Offset'] = this[p + 'Offset'] - length;
          break;
        } else {
          length += tn.nodeValue.length;
        }
      }
      if (range[p + 'Offset'] == null) {
        throw new Range.RangeError("" + p + "offset", "Couldn't find offset " + this[p + 'Offset'] + " in element " + this[p]);
      }
    }
    contains = document.compareDocumentPosition == null ? function(a, b) {
      return a.contains(b);
    } : function(a, b) {
      return a.compareDocumentPosition(b) & 16;
    };
    $(range.startContainer).parents().each(function() {
      if (contains(this, range.endContainer)) {
        range.commonAncestorContainer = this;
        return false;
      }
    });
    return new Range.BrowserRange(range).normalize(root);
  };

  SerializedRange.prototype.serialize = function(root, ignoreSelector) {
    return this.normalize(root).serialize(root, ignoreSelector);
  };

  SerializedRange.prototype.toObject = function() {
    return {
      start: this.start,
      startOffset: this.startOffset,
      end: this.end,
      endOffset: this.endOffset
    };
  };

  return SerializedRange;

})();

//# sourceMappingURL=range.map
;// Generated by CoffeeScript 1.7.1
var Annotator, g, _Annotator, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_Annotator = this.Annotator;

Annotator = (function(_super) {
  __extends(Annotator, _super);

  Annotator.prototype.events = {
    ".annotator-adder click": "onAdderClick",
    ".annotator-adder mousedown": "onAdderMousedown",
    // ".annotator-hl mouseover": "onHighlightMouseover",
    ".annotator-hl click": "onHighlightClick"
    // ".annotator-hl mouseout": "startViewerHideTimer"
  };

  Annotator.prototype.html = {
    adder: '<div class="annotator-adder"><button>' + _t('Annotate') + '</button></div>',
    wrapper: '<div class="annotator-wrapper"></div>'
  };

  Annotator.prototype.options = {
    readOnly: false
  };

  Annotator.prototype.plugins = {};

  Annotator.prototype.isShareable = false;

  Annotator.prototype.editor = null;

  Annotator.prototype.viewer = null;

  Annotator.prototype.selectedRanges = null;

  Annotator.prototype.mouseIsDown = false;

  Annotator.prototype.ignoreMouseup = false;

  Annotator.prototype.viewerHideTimer = null;

  function Annotator(element, options) {
    this.onDeleteAnnotation = __bind(this.onDeleteAnnotation, this);
    this.onEditAnnotation = __bind(this.onEditAnnotation, this);
    this.onAdderClick = __bind(this.onAdderClick, this);
    this.onAdderMousedown = __bind(this.onAdderMousedown, this);
    this.onHighlightMouseover = __bind(this.onHighlightMouseover, this);
    this.onHighlightClick = __bind(this.onHighlightClick, this);    
    this.checkForEndSelection = __bind(this.checkForEndSelection, this);
    this.checkForStartSelection = __bind(this.checkForStartSelection, this);
    this.clearViewerHideTimer = __bind(this.clearViewerHideTimer, this);
    this.startViewerHideTimer = __bind(this.startViewerHideTimer, this);
    this.showViewer = __bind(this.showViewer, this);
    this.onEditorSubmit = __bind(this.onEditorSubmit, this);
    this.onEditorHide = __bind(this.onEditorHide, this);
    this.showEditor = __bind(this.showEditor, this);
    Annotator.__super__.constructor.apply(this, arguments);
    this.plugins = {};
    if (!Annotator.supported()) {
      return this;
    }
    if (!this.options.readOnly) {
      this._setupDocumentEvents();
    }
    this._setupWrapper()._setupViewer()._setupEditor();
    this._setupDynamicStyle();
    this.adder = $(this.html.adder).appendTo(this.wrapper).hide();
    Annotator._instances.push(this);
  }

  Annotator.prototype._setupWrapper = function() {
    this.wrapper = $(this.html.wrapper);
    this.element.find('script').remove();
    this.element.wrapInner(this.wrapper);
    this.wrapper = this.element.find('.annotator-wrapper');
    return this;
  };

  Annotator.prototype._setupViewer = function() {
    this.viewer = new Annotator.Viewer({
      readOnly: this.options.readOnly
    });
    this.viewer.hide().on("edit", this.onEditAnnotation).on("delete", this.onDeleteAnnotation).addField({
      load: (function(_this) {
        return function(field, annotation) {
          if (annotation.text) {
            $(field).html(Util.escape(annotation.text));
          } else {
            $(field).html("<i>" + (_t('No Comment')) + "</i>");
          }
          return _this.publish('annotationViewerTextField', [field, annotation]);
        };
      })(this)
    }).element.appendTo(this.wrapper).bind({
      "mouseover": this.clearViewerHideTimer,
      "mouseout": this.startViewerHideTimer
    });
    return this;
  };

  Annotator.prototype._setupEditor = function() {
    this.editor = new Annotator.Editor();
    this.editor.hide().on('hide', this.onEditorHide).on('save', this.onEditorSubmit).addField({
      type: 'textarea',
      label: _t('Write a note.'),
      load: function(field, annotation) {
        return $(field).find('textarea').val(annotation.text || '');
      },
      submit: function(field, annotation) {
        return annotation.text = $(field).find('textarea').val();
      }
    });
    this.editor.element.appendTo(this.wrapper);
    return this;
  };

  Annotator.prototype._setupDocumentEvents = function() {
    $(document).bind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    return this;
  };

  Annotator.prototype._setupDynamicStyle = function() {
    var max, sel, style, x;
    style = $('#annotator-dynamic-style');
    if (!style.length) {
      style = $('<style id="annotator-dynamic-style"></style>').appendTo(document.head);
    }
    sel = '*' + ((function() {
      var _i, _len, _ref, _results;
      _ref = ['adder', 'outer', 'notice', 'filter'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push(":not(.annotator-" + x + ")");
      }
      return _results;
    })()).join('');
    max = Util.maxZIndex($(document.body).find(sel));
    max = Math.max(max, 1000);
    style.text([".annotator-adder, .annotator-outer, .annotator-notice {", "  z-index: " + (max + 20) + ";", "}", ".annotator-filter {", "  z-index: " + (max + 10) + ";", "}"].join("\n"));
    return this;
  };

  Annotator.prototype.destroy = function() {
    var idx, name, plugin, _base, _ref;
    Annotator.__super__.destroy.apply(this, arguments);
    $(document).unbind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    $('#annotator-dynamic-style').remove();
    this.adder.remove();
    this.viewer.destroy();
    this.editor.destroy();
    this.wrapper.find('.annotator-hl').each(function() {
      $(this).contents().insertBefore(this);
      return $(this).remove();
    });
    this.wrapper.contents().insertBefore(this.wrapper);
    this.wrapper.remove();
    this.element.data('annotator', null);
    _ref = this.plugins;
    for (name in _ref) {
      plugin = _ref[name];
      if (typeof (_base = this.plugins[name]).destroy === "function") {
        _base.destroy();
      }
    }
    idx = Annotator._instances.indexOf(this);
    if (idx !== -1) {
      return Annotator._instances.splice(idx, 1);
    }
  };

  Annotator.prototype.getSelectedRanges = function() {
    var browserRange, i, normedRange, r, ranges, rangesToIgnore, selection, _i, _len;
    selection = Util.getGlobal().getSelection();
    ranges = [];
    rangesToIgnore = [];
    if (!selection.isCollapsed) {
      ranges = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = selection.rangeCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          r = selection.getRangeAt(i);
          browserRange = new Range.BrowserRange(r);
          normedRange = browserRange.normalize().limit(this.wrapper[0]);
          if (normedRange === null) {
            rangesToIgnore.push(r);
          }
          _results.push(normedRange);
        }
        return _results;
      }).call(this);
      selection.removeAllRanges();
    }
    for (_i = 0, _len = rangesToIgnore.length; _i < _len; _i++) {
      r = rangesToIgnore[_i];
      selection.addRange(r);
    }
    return $.grep(ranges, function(range) {
      if (range) {
        selection.addRange(range.toRange());
      }
      return range;
    });
  };

  Annotator.prototype.createAnnotation = function() {
    var annotation;
    annotation = {};
    this.publish('beforeAnnotationCreated', [annotation]);
    return annotation;
  };

  Annotator.prototype.setupAnnotation = function(annotation) {
    console.log("plugin---", annotation);
    var e, normed, normedRanges, r, root, _i, _j, _len, _len1, _ref;
    root = this.wrapper[0];
    annotation.ranges || (annotation.ranges = this.selectedRanges);
    normedRanges = [];
    _ref = annotation.ranges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      r = _ref[_i];
      try {
        normedRanges.push(Range.sniff(r).normalize(root));
      } catch (_error) {
        e = _error;
        if (e instanceof Range.RangeError) {
          this.publish('rangeNormalizeFail', [annotation, r, e]);
        } else {
          throw e;
        }
      }
    }
    annotation.quote = [];
    annotation.ranges = [];
    annotation.highlights = [];
    for (_j = 0, _len1 = normedRanges.length; _j < _len1; _j++) {
      normed = normedRanges[_j];
      normed.color=annotation.color;
      normed.note=annotation.text;
      annotation.quote.push($.trim(normed.text()));
      annotation.ranges.push(normed.serialize(this.wrapper[0], '.annotator-hl'));
      $.merge(annotation.highlights, this.highlightRange(normed));
    }
    annotation.quote = annotation.quote.join(' / ');
    $(annotation.highlights).data('annotation', annotation);
    $(annotation.highlights).attr('data-annotation-id', annotation.id);
    $(annotation.highlights).attr('data-ann-id', annotation._id?annotation._id.$oid:null);
    return annotation;
  };

  Annotator.prototype.updateAnnotation = function(annotation) {
    this.publish('beforeAnnotationUpdated', [annotation]);
    $(annotation.highlights).attr('data-annotation-id', annotation.id);
    this.publish('annotationUpdated', [annotation]);
    return annotation;
  };

  Annotator.prototype.deleteAnnotation = function(annotation) {
    var child, h, _i, _len, _ref;
    if (annotation.highlights != null) {
      _ref = annotation.highlights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        if (!(h.parentNode != null)) {
          continue;
        }
        child = h.childNodes[0];
        $(h).replaceWith(h.childNodes);
      }
    }
    this.publish('annotationDeleted', [annotation]);
    return annotation;
  };

  Annotator.prototype.shareAnnotations = function(isShareable) {
    return this.isShareable=isShareable;
  };

  Annotator.prototype.loadAnnotations = function(annotations,isUpdate) {
    var clone, loader;
    if (annotations == null) {
      annotations = [];
    }
    if(isUpdate){   
        this.editor.currentAnnotation=annotations[0];   
    }
    loader = (function(_this) {
      return function(annList) {
        var n, now, _i, _len;
        if (annList == null) {
          annList = [];
        }
        now = annList.splice(0, 10);
        for (_i = 0, _len = now.length; _i < _len; _i++) {
          n = now[_i];
          _this.setupAnnotation(n);
        }
        if (annList.length > 0) {
          return setTimeout((function() {
            return loader(annList);
          }), 10);
        } else {
          return _this.publish('annotationsLoaded', [clone]);
        }
      };
    })(this);
    clone = annotations.slice();
    loader(annotations);
    window.getSelection().removeAllRanges();
    return this;
  };

  Annotator.prototype.dumpAnnotations = function() {
    if (this.plugins['Store']) {
      return this.plugins['Store'].dumpAnnotations();
    } else {
      console.warn(_t("Can't dump annotations without Store plugin."));
      return false;
    }
  };

  Annotator.prototype.highlightRange = function(normedRange, cssClass) {
    var hl, node, white, _i, _len, _ref, _results, handle;
    if (cssClass == null) {
      cssClass = 'annotator-hl';
    }
    if(normedRange.note && normedRange.note.length)
      cssClass+=" highlight-note";
    white = /^\s*$/;
    hl = $("<span class='" + cssClass + "' style=background:" + normedRange.color + "></span>");
    handle=$("<span class='annotator-handle'></span>");
    _ref = normedRange.textNodes();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (!white.test(node.nodeValue)) {
        _results.push($(node).wrapAll(hl).parent().prepend(handle).show()[0]);
      }
    }
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(normedRange.toRange());
    return _results;
  };

  Annotator.prototype.highlightRanges = function(normedRanges, cssClass) {
    var highlights, r, _i, _len;
    if (cssClass == null) {
      cssClass = 'annotator-hl';
    }
    highlights = [];
    for (_i = 0, _len = normedRanges.length; _i < _len; _i++) {
      r = normedRanges[_i];
      $.merge(highlights, this.highlightRange(r, cssClass));
    }
    return highlights;
  };

  Annotator.prototype.addPlugin = function(name, options) {
    var klass, _base;
    if (this.plugins[name]) {
      console.error(_t("You cannot have more than one instance of any plugin."));
    } else {
      klass = Annotator.Plugin[name];
      if (typeof klass === 'function') {
        this.plugins[name] = new klass(this.element[0], options);
        this.plugins[name].annotator = this;
        if (typeof (_base = this.plugins[name]).pluginInit === "function") {
          _base.pluginInit();
        }
      } else {
        console.error(_t("Could not load ") + name + _t(" plugin. Have you included the appropriate <script> tag?"));
      }
    }
    return this;
  };

  Annotator.prototype.showEditor = function(annotation, location, isAdderClick) {
    var position= {
      right:80,
      top:(39+location.top+(!isAdderClick?140:0))
    }
    this.editor.element.css(position);
    this.editor.load(annotation,this.isShareable);
    this.publish('annotationEditorShown', [this.editor, annotation]);
    return this;
  };

  Annotator.prototype.onEditorHide = function() {
    this.publish('annotationEditorHidden', [this.editor]);
    return this.ignoreMouseup = false;
  };

  Annotator.prototype.onEditorSubmit = function(annotation) {
    return this.publish('annotationEditorSubmit', [this.editor, annotation]);
  };

  Annotator.prototype.showViewer = function(annotations, location) {
    this.viewer.element.css(location);
    this.viewer.load(annotations);
    return this.publish('annotationViewerShown', [this.viewer, annotations]);
  };

  Annotator.prototype.startViewerHideTimer = function() {
    if (!this.viewerHideTimer) {
      return this.viewerHideTimer = setTimeout(this.viewer.hide, 250);
    }
  };

  Annotator.prototype.clearViewerHideTimer = function() {
    clearTimeout(this.viewerHideTimer);
    return this.viewerHideTimer = false;
  };

  Annotator.prototype.checkForStartSelection = function(event) {
    if (!(event && this.isAnnotator(event.target))) {
      this.startViewerHideTimer();
    }
    return this.mouseIsDown = true;
  };

  Annotator.prototype.checkForEndSelection = function(event) {
    var container, range, _i, _len, _ref;
    this.mouseIsDown = false;
    this.ignoreMouseup=$(event.target).hasClass('annotator-confirm-delete')?false:this.ignoreMouseup;
    if (this.ignoreMouseup) {
      return;
    }
    this.selectedRanges = this.getSelectedRanges();
    _ref = this.selectedRanges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      container = range.commonAncestor;
      if (this.isAnnotator(container)) {
        return;
      }
    }
    if (event && this.selectedRanges.length) {
      this.onAdderClick(event);
      this.onAdderMousedown();
      return this.adder;
    } else {
      return this.adder.hide();
    }
  };

  Annotator.prototype.isAnnotator = function(element) {
    return !!$(element).parents().addBack().filter('[class^=annotator-]').not('[class^=annotator-hl]').not(this.wrapper).length;
  };

  Annotator.prototype.onHighlightMouseover = function(event) {
    var annotations;
    this.clearViewerHideTimer();
    if (this.mouseIsDown) {
      return false;
    }
    if (this.viewer.isShown()) {
      this.viewer.hide();
    }
    annotations = $(event.target).parents('.annotator-hl').addBack().map(function() {
      return $(this).data("annotation");
    }).toArray();
    return this.showViewer(annotations, Util.mousePosition(event, this.wrapper[0]));
  };

  Annotator.prototype.onHighlightClick = function(event) {
    var annotations = $(event.target).parents('.annotator-hl').addBack().map(function() {
      return $(this).data("annotation");
    }).toArray();
    this.showEditor(annotations[0], Util.mousePosition(event, this.wrapper[0]), false);
  }

  Annotator.prototype.onAdderMousedown = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    return this.ignoreMouseup = true;
  };

  Annotator.prototype.clearTextSelection =function (){
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }

  Annotator.prototype.onAdderClick = function(event) {
    var annotation, cancel, cleanup, position, save;
    if (event != null) {
      event.preventDefault();
    }
    this.adder.hide();
    annotation = this.setupAnnotation(this.createAnnotation());
    event.pageY=$(annotation.highlights).offset().top;
    position = Util.mousePosition(event, this.wrapper[0]);
    // this.clearTextSelection();
    $(annotation.highlights).addClass('annotator-hl-temporary');
    save = (function(_this) {
      return function() {
        cleanup();
        $(annotation.highlights).removeClass('annotator-hl-temporary');
        return _this.publish('annotationCreated', [annotation]);
      };
    })(this);
    cancel = (function(_this) {
      return function() {
        cleanup();
        return _this.deleteAnnotation(annotation);
      };
    })(this);
    cleanup = (function(_this) {
      return function() {
        _this.unsubscribe('annotationEditorHidden', cancel);
        return _this.unsubscribe('annotationEditorSubmit', save);
      };
    })(this);
    this.subscribe('annotationEditorHidden', cancel);
    this.subscribe('annotationEditorSubmit', save);
    return this.showEditor(annotation, position, true);
  };

  Annotator.prototype.onEditAnnotation = function(annotation) {
    var cleanup, offset, update;
    offset = this.viewer.element.position();
    update = (function(_this) {
      return function() {
        cleanup();
        return _this.updateAnnotation(annotation);
      };
    })(this);
    cleanup = (function(_this) {
      return function() {
        _this.unsubscribe('annotationEditorHidden', cleanup);
        return _this.unsubscribe('annotationEditorSubmit', update);
      };
    })(this);
    this.subscribe('annotationEditorHidden', cleanup);
    this.subscribe('annotationEditorSubmit', update);
    this.viewer.hide();
    return this.showEditor(annotation, offset, false);
  };

  Annotator.prototype.onDeleteAnnotation = function(annotation) {
    this.viewer.hide();
    return this.deleteAnnotation(annotation);
  };

  return Annotator;

})(Delegator);

Annotator.Plugin = (function(_super) {
  __extends(Plugin, _super);

  function Plugin(element, options) {
    Plugin.__super__.constructor.apply(this, arguments);
  }

  Plugin.prototype.pluginInit = function() {};

  return Plugin;

})(Delegator);

g = Util.getGlobal();

if (((_ref = g.document) != null ? _ref.evaluate : void 0) == null) {
  $.getScript('http://assets.annotateit.org/vendor/xpath.min.js');
}

if (g.getSelection == null) {
  $.getScript('http://assets.annotateit.org/vendor/ierange.min.js');
}

if (g.JSON == null) {
  $.getScript('http://assets.annotateit.org/vendor/json2.min.js');
}

if (g.Node == null) {
  g.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  };
}

Annotator.$ = $;

Annotator.Delegator = Delegator;

Annotator.Range = Range;

Annotator.Util = Util;

Annotator._instances = [];

Annotator._t = _t;

Annotator.supported = function() {
  return (function() {
    return !!this.getSelection;
  })();
};

Annotator.noConflict = function() {
  Util.getGlobal().Annotator = _Annotator;
  return this;
};

$.fn.annotator = function(options) {
  var args;
  args = Array.prototype.slice.call(arguments, 1);
  return this.each(function() {
    var instance;
    instance = $.data(this, 'annotator');
    if (options === 'destroy') {
      $.removeData(this, 'annotator');
      return instance != null ? instance.destroy(args) : void 0;
    } else if (instance) {
      return options && instance[options].apply(instance, args);
    } else {
      instance = new Annotator(this, options);
      return $.data(this, 'annotator', instance);
    }
  });
};

this.Annotator = Annotator;

//# sourceMappingURL=annotator.map
;// Generated by CoffeeScript 1.7.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Widget = (function(_super) {
  __extends(Widget, _super);

  Widget.prototype.classes = {
    hide: 'annotator-hide',
    invert: {
      x: 'annotator-invert-x',
      y: 'annotator-invert-y'
    }
  };

  function Widget(element, options) {
    Widget.__super__.constructor.apply(this, arguments);
    this.classes = $.extend({}, Annotator.Widget.prototype.classes, this.classes);
  }

  Widget.prototype.destroy = function() {
    this.removeEvents();
    return this.element.remove();
  };

  Widget.prototype.checkOrientation = function() {
    var current, offset, viewport, widget, window;
    this.resetOrientation();
    window = $(Annotator.Util.getGlobal());
    widget = this.element.children(":first");
    offset = widget.offset();
    viewport = {
      top: window.scrollTop(),
      right: window.width() + window.scrollLeft()
    };
    current = {
      top: offset.top,
      right: offset.left + widget.width()
    };
    if ((current.top - viewport.top) < 0) {
      this.invertY();
    }
    if ((current.right - viewport.right) > 0) {
      this.invertX();
    }
    return this;
  };

  Widget.prototype.resetOrientation = function() {
    this.element.removeClass(this.classes.invert.x).removeClass(this.classes.invert.y);
    return this;
  };

  Widget.prototype.invertX = function() {
    this.element.addClass(this.classes.invert.x);
    return this;
  };

  Widget.prototype.invertY = function() {
    this.element.addClass(this.classes.invert.y);
    return this;
  };

  Widget.prototype.isInvertedY = function() {
    return this.element.hasClass(this.classes.invert.y);
  };

  Widget.prototype.isInvertedX = function() {
    return this.element.hasClass(this.classes.invert.x);
  };

  return Widget;

})(Delegator);

//# sourceMappingURL=widget.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Editor = (function(_super) {
  __extends(Editor, _super);

  Editor.prototype.events = {
    "form submit": "submit",
    ".annotator-save click": "submit",
    ".annotator-cancel click": "hide",
    ".annotator-cancel mouseover": "onCancelButtonMouseover",
    "textarea keydown": "processKeypress",
    ".annotator-color click":"onColorChange",
    ".annotator-share click":"onShareClick",
    ".annotator-confirm-delete click":"onDeleteClick",
    ".annotator-edit-container click":"onEditClick",
    ".annotator-listing textarea keyup":"onNoteChange",
    ".annotator-delete-container click":"onDeleteIconClick",
    ".annotator-confirm-cancel click":"onCancelClick"
  };

  Editor.prototype.classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
  };
  
  Editor.prototype.isShareable=null;
  Editor.prototype.textareaHeight=null;
  Editor.prototype.currentAnnotation=null;
  Editor.prototype.const={
    characters :3000
  }

  var panel1 = '<div class="annotator-panel-1 annotator-panel-triangle"><div class="annotator-color-container"><input type="button" class="annotator-color annotator-yellow" value="#FCF37F"/><input type="button" class="annotator-color annotator-green" value="#55DF49"/><input type="button" class="annotator-color annotator-pink" value="#FC92CF"/></div><div class="annotator-delete-container"></div><div class="annotator-edit-container"></div></div>'

  var panel2 ='<div class="annotator-panel-2"><ul class="annotator-listing"></ul></div>';

  var panel3 ='<div class="annotator-panel-3"><div class="annotator-controls"><div class="ann-share-section"><label class="annotator-share-text">Share</label><div class="annotator-share"></div></div><div class="ann-cancelsave-section"><a class="annotator-cancel">' + _t("CANCEL") + '</a><a class="annotator-save annotator-focus">' + _t("SAVE") + '</a></div></div></div>';

 var panel4 ='<div class="annotator-panel-4 annotator-panel-triangle"><div class="ann-confirm-section"><label class="annotator-confirm">Confirm?</label></div><div class="ann-canceldelete-section"><a class="annotator-confirm-cancel">' + _t("CANCEL") + '</a><a class="annotator-confirm-delete">' + _t("DELETE") + '</a></div></div></div>';

 var panel5 ='<li class="characters-left"><span id="letter-count">'+(Editor.prototype.const.characters)+'</span id="letter-text">  Characters left<span><span></li>';

  Editor.prototype.html = '<div class="annotator-outer annotator-editor hide-note"><form class="annotator-widget">'+panel1+ panel2+panel3+'</form></div>';
  
  Editor.prototype.options = {};

  function Editor(options) {
    this.onCancelButtonMouseover = __bind(this.onCancelButtonMouseover, this);
    this.processKeypress = __bind(this.processKeypress, this);
    this.submit = __bind(this.submit, this);
    this.load = __bind(this.load, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.onColorChange=__bind(this.onColorChange, this);
    this.onShareClick=__bind(this.onShareClick, this);
    this.onDeleteClick=__bind(this.onDeleteClick, this);
    this.onDeleteIconClick=__bind(this.onDeleteIconClick, this);
    this.onCancelClick=__bind(this.onCancelClick, this);
    this.onEditClick=__bind(this.onEditClick, this);
    this.onNoteChange=__bind(this.onNoteChange, this);
    Editor.__super__.constructor.call(this, $(this.html)[0], options);
    this.fields = [];
    this.annotation = {};
  }

  Editor.prototype.onShareClick=function(event) {
    var that=this;
    if ($(event.target).hasClass('on')) {
       $(event.target).removeClass('on');
       this.annotation.color=this.annotation.lastColor;
       this.annotation.shareable=false;
       $(this.annotation.highlights).css('background', this.annotation.color);
       $('.annotator-color').removeClass('active');
       $('.annotator-color[value="'+this.annotation.color+'"]').addClass('active');
       $('.annotator-color-container').removeClass('disabled-save');
    }
    else {
       $(event.target).addClass('on');
       this.annotation.color='#ccf5fd';
       this.annotation.shareable=true;
       $('.annotator-color').removeClass('active');
       $(this.annotation.highlights).css('background', '#ccf5fd');
       $('.annotator-color-container').addClass('disabled-save');
    }
    setTimeout(function(){ that.submit(); }, 800);    
  }
  
  Editor.prototype.onDeleteClick=function(event){  
    this.element.addClass(this.classes.hide);
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'),panel3Sec =  this.element.find('.annotator-panel-3'),panel4Sec = this.element.find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    this.element.addClass('hide-note')
    return $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [this.annotation]]);
  }
  Editor.prototype.onDeleteIconClick=function(event){  
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'),panel3Sec =  this.element.find('.annotator-panel-3'),panel4Sec = this.element.find('.annotator-panel-4');
    panel1Sec.addClass('hide-popup').after(panel4);
    panel4Sec.addClass('annotator-panel-triangle');
    panel2Sec.addClass('overlay');
    panel3Sec.addClass('overlay');

  }
  Editor.prototype.onCancelClick=function(event){  
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'),panel3Sec =  this.element.find('.annotator-panel-3'),panel4Sec = this.element.find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
  }
  Editor.prototype.onEditClick=function(event){  
    this.element.addClass('show-edit-options');
    this.element.find('textarea').css({'pointer-events':'all','opacity':'1'});
  }
  
  Editor.prototype.onNoteChange=function(event) {
    this.element[(event.target.value.length)?'addClass':'removeClass']('show-edit-options');
    var inputCharLength = event.currentTarget.value.length, actualChar = this.const.characters;
    var remainingCount = actualChar-inputCharLength;
    this.element.find('#letter-count').text(remainingCount);
    var selectors = this.element.find('.annotator-item textarea'); 
    console.log("pageup",this.textareaHeight);
    var temp = this.textareaHeight;
    selectors.height(1); 
    this.textareaHeight = selectors.prop('scrollHeight');
    selectors.height(this.textareaHeight);
    if(temp && temp!==this.textareaHeight){
      var topPosition=(this.element.position().top-temp) + (this.textareaHeight/2) ;
      this.element.css({top:topPosition});
  }    
  }

  Editor.prototype.onColorChange=function(event) {
    window.getSelection().removeAllRanges();
    this.element.removeClass('hide-note');
    var isTopAlign=(!this.annotation.color)?true:false;
    if(this.annotation._id===undefined && this.currentAnnotation !== null){     
        var curAnn =this.currentAnnotation;   
        Object.assign(this.annotation, curAnn);   
    }
    this.annotation.color=this.annotation.lastColor=event.target.value;
    $('.annotator-color').removeClass('active');
    $(event.target).addClass('active');
    $(this.annotation.highlights).css('background', event.target.value);
    if (isTopAlign) {
      var topPosition=this.element.position().top + this.element.find('form').height()-this.element.find('.annotator-panel-1').height();
      this.element.css({top:topPosition});
    }
    this.publish('save', [this.annotation]);
    // if(isTopAlign)
    //    $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [this.annotation]]);
  }

  Editor.prototype.show = function(event) {
    Annotator.Util.preventEventDefault(event);
    this.element.removeClass(this.classes.hide);
    $(this.annotation.highlights).removeClass('current-annotation');
    if(!this.annotation.text || !this.annotation.text.length) $('.annotator-edit-container').hide();
    this.annotation.color=this.annotation.color||'';
    this.annotation.shareable=(this.annotation.shareable===undefined)?false:this.annotation.shareable;
    if (this.annotation.color||this.annotation.shareable) {
      this.element.removeClass('hide-note');
      var textareaScroll =this.element.find('textarea').prop('scrollHeight'),calPos,actualPos;
      this.element.find('textarea').height(textareaScroll);
      actualPos = this.element.position().top;
      pos  = (textareaScroll/2) + actualPos;

      this.element.css({top:pos});
    } 
    if(this.annotation.shareable) {
      $('.annotator-share').addClass('on');
      $('.annotator-color-container').addClass('disabled-save');
      if(!this.isShareable)
        $('.annotator-panel-1').addClass('disabled-save');
    }
    else {
      $('.annotator-share').removeClass('on');
      $('.annotator-color-container').removeClass('disabled-save'); 
    }
    $('.annotator-color').removeClass('active');
    $('.annotator-color[value="'+this.annotation.color+'"]').addClass('active');
    this.element.find('.annotator-save').addClass(this.classes.focus);
    this.element.find('.annotator-listing .characters-left').remove();
    this.element.find('.annotator-listing').append(panel5);
    $('#letter-count').text(3000-this.element.find('textarea').val().length);
    this.checkOrientation();
    if(this.annotation.text === undefined)
      this.element.find('textarea').css({'pointer-events':'all','opacity':'1'});
    this.element.find(":input:first").focus();
    this.setupDraggables();
    return this.publish('show');
  };

  Editor.prototype.hide = function(event) {
    $(this.annotation.highlights).css('background', this.annotation.color);
    Annotator.Util.preventEventDefault(event);
    this.element.addClass(this.classes.hide);
    this.element.addClass('hide-note').removeClass('show-edit-options');
    $('.annotator-edit-container').show();
    $('.annotator-panel-1').removeClass('disabled-save');
    this.onCancelClick();
    this.element.find('textarea').removeAttr("style"); 
    this.currentAnnotation =null;
    return this.publish('hide');
  };

  Editor.prototype.load = function(annotation, isShareable) {
    this.isShareable=isShareable;
    if(!isShareable)
      this.element.find('.annotator-share-text, .annotator-share').remove();
    var field, _i, _len, _ref;
    this.annotation = annotation;
    this.publish('load', [this.annotation]);
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.load(field.element, this.annotation);
    }
    return this.show();
  };

  Editor.prototype.submit = function(event) {
    var field, _i, _len, _ref;
    Annotator.Util.preventEventDefault(event);
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.submit(field.element, this.annotation);
    }
    $(this.annotation.highlights)[(this.element.find('textarea').val().length)?'addClass':'removeClass']('highlight-note');
    this.publish('save', [this.annotation]);
    return this.hide();
  };

  Editor.prototype.addField = function(options) {
    var element, field, input;
    field = $.extend({
      id: 'annotator-field-' + Annotator.Util.uuid(),
      type: 'input',
      label: '',
      load: function() {},
      submit: function() {}
    }, options);
    input = null;
    element = $('<li class="annotator-item" />');
    field.element = element[0];
    switch (field.type) {
      case 'textarea':
        input = $('<textarea maxlength="3000"/>');
        break;
      case 'input':
      case 'checkbox':
        input = $('<input />');
        break;
      case 'select':
        input = $('<select />');
    }
    element.append(input);
    input.attr({
      id: field.id,
      placeholder: field.label
    });
    if (field.type === 'checkbox') {
      input[0].type = 'checkbox';
      element.addClass('annotator-checkbox');
      element.append($('<label />', {
        "for": field.id,
        html: field.label
      }));
    }
    this.element.find('ul:first').append(element);
    this.fields.push(field);
    return field.element;
  };

  Editor.prototype.checkOrientation = function() {
    var controls, list , panel3;
    Editor.__super__.checkOrientation.apply(this, arguments);
    list = this.element.find('ul');
    panel3 = this.element.find('.annotator-panel-3');
    controls = this.element.find('.annotator-controls');
    if (this.element.hasClass(this.classes.invert.y)) {
      panel3.html(controls);
    } else if (controls.is(':first-child')) {
      panel3.html(controls);
    }
    return this;
  };

  Editor.prototype.processKeypress = function(event) {
    if (event.keyCode === 27) {
      return this.hide();
    } else if (event.keyCode === 13 && !event.shiftKey) {
      return this.submit();
    }
  };

  Editor.prototype.onCancelButtonMouseover = function() {
    return this.element.find('.' + this.classes.focus).removeClass(this.classes.focus);
  };

  Editor.prototype.setupDraggables = function() {
    var classes, controls, cornerItem, editor, mousedown, onMousedown, onMousemove, onMouseup, resize, textarea, throttle;
    this.element.find('.annotator-resize').remove();
    if (this.element.hasClass(this.classes.invert.y)) {
      cornerItem = this.element.find('.annotator-item:last');
    } else {
      cornerItem = this.element.find('.annotator-item:first');
    }
    if (cornerItem) {
      $('<span class="annotator-resize"></span>').appendTo(cornerItem);
    }
    mousedown = null;
    classes = this.classes;
    editor = this.element;
    textarea = null;
    resize = editor.find('.annotator-resize');
    controls = editor.find('.annotator-controls');
    throttle = false;
    onMousedown = function(event) {
      if (event.target === this) {
        mousedown = {
          element: this,
          top: event.pageY,
          left: event.pageX
        };
        textarea = editor.find('textarea:first');
        $(window).bind({
          'mouseup.annotator-editor-resize': onMouseup,
          'mousemove.annotator-editor-resize': onMousemove
        });
        return event.preventDefault();
      }
    };
    onMouseup = function() {
      mousedown = null;
      return $(window).unbind('.annotator-editor-resize');
    };
    onMousemove = (function(_this) {
      return function(event) {
        var diff, directionX, directionY, height, width;
        if (mousedown && throttle === false) {
          diff = {
            top: event.pageY - mousedown.top,
            left: event.pageX - mousedown.left
          };
          if (mousedown.element === resize[0]) {
            height = textarea.height();
            width = textarea.width();
            directionX = editor.hasClass(classes.invert.x) ? -1 : 1;
            directionY = editor.hasClass(classes.invert.y) ? 1 : -1;
            textarea.height(height + (diff.top * directionY));
            textarea.width(width + (diff.left * directionX));
            if (textarea.height() !== height) {
              mousedown.top = event.pageY;
            }
            if (textarea.width() !== width) {
              mousedown.left = event.pageX;
            }
          } else if (mousedown.element === controls[0]) {
            editor.css({
              top: parseInt(editor.css('top'), 10) + diff.top,
              left: parseInt(editor.css('left'), 10) + diff.left
            });
            mousedown.top = event.pageY;
            mousedown.left = event.pageX;
          }
          throttle = true;
          return setTimeout(function() {
            return throttle = false;
          }, 1000 / 60);
        }
      };
    })(this);
    resize.bind('mousedown', onMousedown);
    return controls.bind('mousedown', onMousedown);
  };

  return Editor;

})(Annotator.Widget);

//# sourceMappingURL=editor.map
;// Generated by CoffeeScript 1.7.1
var LinkParser,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Viewer = (function(_super) {
  __extends(Viewer, _super);

  Viewer.prototype.events = {
    ".annotator-edit click": "onEditClick",
    ".annotator-delete click": "onDeleteClick"
  };

  Viewer.prototype.classes = {
    hide: 'annotator-hide',
    showControls: 'annotator-visible'
  };

  Viewer.prototype.html = {
    element: "<div class=\"annotator-outer annotator-viewer\">\n  <ul class=\"annotator-widget annotator-listing\"></ul>\n</div>",
    item: "<li class=\"annotator-annotation annotator-item\">\n  <span class=\"annotator-controls\">\n    <a href=\"#\" title=\"View as webpage\" class=\"annotator-link\">View as webpage</a>\n    <button title=\"Edit\" class=\"annotator-edit\">Edit</button>\n    <button title=\"Delete\" class=\"annotator-delete\">Delete</button>\n  </span>\n</li>"
  };

  Viewer.prototype.options = {
    readOnly: false
  };

  function Viewer(options) {
    this.onDeleteClick = __bind(this.onDeleteClick, this);
    this.onEditClick = __bind(this.onEditClick, this);
    this.load = __bind(this.load, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    Viewer.__super__.constructor.call(this, $(this.html.element)[0], options);
    this.item = $(this.html.item)[0];
    this.fields = [];
    this.annotations = [];
  }

  Viewer.prototype.show = function(event) {
    var controls;
    Annotator.Util.preventEventDefault(event);
    controls = this.element.find('.annotator-controls').addClass(this.classes.showControls);
    setTimeout(((function(_this) {
      return function() {
        return controls.removeClass(_this.classes.showControls);
      };
    })(this)), 500);
    this.element.removeClass(this.classes.hide);
    return this.checkOrientation().publish('show');
  };

  Viewer.prototype.isShown = function() {
    return !this.element.hasClass(this.classes.hide);
  };

  Viewer.prototype.hide = function(event) {
    Annotator.Util.preventEventDefault(event);
    this.element.addClass(this.classes.hide);
    return this.publish('hide');
  };

  Viewer.prototype.load = function(annotations) {
    var annotation, controller, controls, del, edit, element, field, item, link, links, list, _i, _j, _len, _len1, _ref, _ref1;
    this.annotations = annotations || [];
    list = this.element.find('ul:first').empty();
    _ref = this.annotations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      annotation = _ref[_i];
      item = $(this.item).clone().appendTo(list).data('annotation', annotation);
      controls = item.find('.annotator-controls');
      link = controls.find('.annotator-link');
      edit = controls.find('.annotator-edit');
      del = controls.find('.annotator-delete');
      links = new LinkParser(annotation.links || []).get('alternate', {
        'type': 'text/html'
      });
      if (links.length === 0 || (links[0].href == null)) {
        link.remove();
      } else {
        link.attr('href', links[0].href);
      }
      if (this.options.readOnly) {
        edit.remove();
        del.remove();
      } else {
        controller = {
          showEdit: function() {
            return edit.removeAttr('disabled');
          },
          hideEdit: function() {
            return edit.attr('disabled', 'disabled');
          },
          showDelete: function() {
            return del.removeAttr('disabled');
          },
          hideDelete: function() {
            return del.attr('disabled', 'disabled');
          }
        };
      }
      _ref1 = this.fields;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        field = _ref1[_j];
        element = $(field.element).clone().appendTo(item)[0];
        field.load(element, annotation, controller);
      }
    }
    this.publish('load', [this.annotations]);
    return this.show();
  };

  Viewer.prototype.addField = function(options) {
    var field;
    field = $.extend({
      load: function() {}
    }, options);
    field.element = $('<div />')[0];
    this.fields.push(field);
    field.element;
    return this;
  };

  Viewer.prototype.onEditClick = function(event) {
    return this.onButtonClick(event, 'edit');
  };

  Viewer.prototype.onDeleteClick = function(event) {
    return this.onButtonClick(event, 'delete');
  };

  Viewer.prototype.onButtonClick = function(event, type) {
    var item;
    item = $(event.target).parents('.annotator-annotation');
    return this.publish(type, [item.data('annotation')]);
  };

  return Viewer;

})(Annotator.Widget);

LinkParser = (function() {
  function LinkParser(data) {
    this.data = data;
  }

  LinkParser.prototype.get = function(rel, cond) {
    var d, k, keys, match, v, _i, _len, _ref, _results;
    if (cond == null) {
      cond = {};
    }
    cond = $.extend({}, cond, {
      rel: rel
    });
    keys = (function() {
      var _results;
      _results = [];
      for (k in cond) {
        if (!__hasProp.call(cond, k)) continue;
        v = cond[k];
        _results.push(k);
      }
      return _results;
    })();
    _ref = this.data;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      d = _ref[_i];
      match = keys.reduce((function(m, k) {
        return m && (d[k] === cond[k]);
      }), true);
      if (match) {
        _results.push(d);
      } else {
        continue;
      }
    }
    return _results;
  };

  return LinkParser;

})();

//# sourceMappingURL=viewer.map
;// Generated by CoffeeScript 1.7.1
var Annotator,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator = Annotator || {};

Annotator.Notification = (function(_super) {
  __extends(Notification, _super);

  Notification.prototype.events = {
    "click": "hide"
  };

  Notification.prototype.options = {
    html: "<div class='annotator-notice'></div>",
    classes: {
      show: "annotator-notice-show",
      info: "annotator-notice-info",
      success: "annotator-notice-success",
      error: "annotator-notice-error"
    }
  };

  function Notification(options) {
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    Notification.__super__.constructor.call(this, $(this.options.html).appendTo(document.body)[0], options);
  }

  Notification.prototype.show = function(message, status) {
    if (status == null) {
      status = Annotator.Notification.INFO;
    }
    this.currentStatus = status;
    $(this.element).addClass(this.options.classes.show).addClass(this.options.classes[this.currentStatus]).html(Util.escape(message || ""));
    setTimeout(this.hide, 5000);
    return this;
  };

  Notification.prototype.hide = function() {
    if (this.currentStatus == null) {
      this.currentStatus = Annotator.Notification.INFO;
    }
    $(this.element).removeClass(this.options.classes.show).removeClass(this.options.classes[this.currentStatus]);
    return this;
  };

  return Notification;

})(Delegator);

Annotator.Notification.INFO = 'info';

Annotator.Notification.SUCCESS = 'success';

Annotator.Notification.ERROR = 'error';

$(function() {
  var notification;
  notification = new Annotator.Notification;
  Annotator.showNotification = notification.show;
  return Annotator.hideNotification = notification.hide;
});

//# sourceMappingURL=notification.map
;// Generated by CoffeeScript 1.7.1
var findChild, getNodeName, getNodePosition, simpleXPathJQuery, simpleXPathPure;

simpleXPathJQuery = function(relativeRoot) {
  var jq;
  jq = this.map(function() {
    var elem, idx, path, tagName;
    path = '';
    elem = this;
    while ((elem != null ? elem.nodeType : void 0) === Node.ELEMENT_NODE && elem !== relativeRoot) {
      tagName = elem.tagName.replace(":", "\\:");
      idx = $(elem.parentNode).children(tagName).index(elem) + 1;
      idx = "[" + idx + "]";
      path = "/" + elem.tagName.toLowerCase() + idx + path;
      elem = elem.parentNode;
    }
    return path;
  });
  return jq.get();
};

simpleXPathPure = function(relativeRoot) {
  var getPathSegment, getPathTo, jq, rootNode;
  getPathSegment = function(node) {
    var name, pos;
    name = getNodeName(node);
    pos = getNodePosition(node);
    return "" + name + "[" + pos + "]";
  };
  rootNode = relativeRoot;
  getPathTo = function(node) {
    var xpath;
    xpath = '';
    while (node !== rootNode) {
      if (node == null) {
        throw new Error("Called getPathTo on a node which was not a descendant of @rootNode. " + rootNode);
      }
      xpath = (getPathSegment(node)) + '/' + xpath;
      node = node.parentNode;
    }
    xpath = '/' + xpath;
    xpath = xpath.replace(/\/$/, '');
    return xpath;
  };
  jq = this.map(function() {
    var path;
    path = getPathTo(this);
    return path;
  });
  return jq.get();
};

findChild = function(node, type, index) {
  var child, children, found, name, _i, _len;
  if (!node.hasChildNodes()) {
    throw new Error("XPath error: node has no children!");
  }
  children = node.childNodes;
  found = 0;
  for (_i = 0, _len = children.length; _i < _len; _i++) {
    child = children[_i];
    name = getNodeName(child);
    if (name === type) {
      found += 1;
      if (found === index) {
        return child;
      }
    }
  }
  throw new Error("XPath error: wanted child not found.");
};

getNodeName = function(node) {
  var nodeName;
  nodeName = node.nodeName.toLowerCase();
  switch (nodeName) {
    case "#text":
      return "text()";
    case "#comment":
      return "comment()";
    case "#cdata-section":
      return "cdata-section()";
    default:
      return nodeName;
  }
};

getNodePosition = function(node) {
  var pos, tmp;
  pos = 0;
  tmp = node;
  while (tmp) {
    if (tmp.nodeName === node.nodeName) {
      pos++;
    }
    tmp = tmp.previousSibling;
  }
  return pos;
};

//# sourceMappingURL=xpath.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Annotator.Plugin.Store = (function(_super) {
  __extends(Store, _super);

  Store.prototype.events = {
    'annotationCreated': 'annotationCreated',
    'annotationDeleted': 'annotationDeleted',
    'annotationUpdated': 'annotationUpdated'
  };

  Store.prototype.options = {
    annotationData: {},
    emulateHTTP: false,
    loadFromSearch: false,
    prefix: '/store',
    urls: {
      create: '/annotations',
      read: '/annotations/:id',
      update: '/annotations/:id',
      destroy: '/annotations/:id',
      search: '/search'
    }
  };

  function Store(element, options) {
    this._onError = __bind(this._onError, this);
    this._onLoadAnnotationsFromSearch = __bind(this._onLoadAnnotationsFromSearch, this);
    this._onLoadAnnotations = __bind(this._onLoadAnnotations, this);
    this._getAnnotations = __bind(this._getAnnotations, this);
    Store.__super__.constructor.apply(this, arguments);
    this.annotations = [];
  }

  Store.prototype.pluginInit = function() {
    if (!Annotator.supported()) {
      return;
    }
    if (this.annotator.plugins.Auth) {
      return this.annotator.plugins.Auth.withToken(this._getAnnotations);
    } else {
      return this._getAnnotations();
    }
  };

  Store.prototype._getAnnotations = function() {
    if (this.options.loadFromSearch) {
      return this.loadAnnotationsFromSearch(this.options.loadFromSearch);
    } else {
      return this.loadAnnotations();
    }
  };

  Store.prototype.annotationCreated = function(annotation) {
    if (__indexOf.call(this.annotations, annotation) < 0) {
      this.registerAnnotation(annotation);
      return this._apiRequest('create', annotation, (function(_this) {
        return function(data) {
          if (data.id == null) {
            console.warn(Annotator._t("Warning: No ID returned from server for annotation "), annotation);
          }
          return _this.updateAnnotation(annotation, data);
        };
      })(this));
    } else {
      return this.updateAnnotation(annotation, {});
    }
  };

  Store.prototype.annotationUpdated = function(annotation) {
    if (__indexOf.call(this.annotations, annotation) >= 0) {
      return this._apiRequest('update', annotation, ((function(_this) {
        return function(data) {
          return _this.updateAnnotation(annotation, data);
        };
      })(this)));
    }
  };

  Store.prototype.annotationDeleted = function(annotation) {
    if (__indexOf.call(this.annotations, annotation) >= 0) {
      return this._apiRequest('destroy', annotation, ((function(_this) {
        return function() {
          return _this.unregisterAnnotation(annotation);
        };
      })(this)));
    }
  };

  Store.prototype.registerAnnotation = function(annotation) {
    return this.annotations.push(annotation);
  };

  Store.prototype.unregisterAnnotation = function(annotation) {
    return this.annotations.splice(this.annotations.indexOf(annotation), 1);
  };

  Store.prototype.updateAnnotation = function(annotation, data) {
    if (__indexOf.call(this.annotations, annotation) < 0) {
      console.error(Annotator._t("Trying to update unregistered annotation!"));
    } else {
      $.extend(annotation, data);
    }
    return $(annotation.highlights).data('annotation', annotation);
  };

  Store.prototype.loadAnnotations = function() {
    return this._apiRequest('read', null, this._onLoadAnnotations);
  };

  Store.prototype._onLoadAnnotations = function(data) {
    var a, annotation, annotationMap, newData, _i, _j, _len, _len1, _ref;
    if (data == null) {
      data = [];
    }
    annotationMap = {};
    _ref = this.annotations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      annotationMap[a.id] = a;
    }
    newData = [];
    for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
      a = data[_j];
      if (annotationMap[a.id]) {
        annotation = annotationMap[a.id];
        this.updateAnnotation(annotation, a);
      } else {
        newData.push(a);
      }
    }
    this.annotations = this.annotations.concat(newData);
    return this.annotator.loadAnnotations(newData.slice());
  };

  Store.prototype.loadAnnotationsFromSearch = function(searchOptions) {
    return this._apiRequest('search', searchOptions, this._onLoadAnnotationsFromSearch);
  };

  Store.prototype._onLoadAnnotationsFromSearch = function(data) {
    if (data == null) {
      data = {};
    }
    return this._onLoadAnnotations(data.rows || []);
  };

  Store.prototype.dumpAnnotations = function() {
    var ann, _i, _len, _ref, _results;
    _ref = this.annotations;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ann = _ref[_i];
      _results.push(JSON.parse(this._dataFor(ann)));
    }
    return _results;
  };

  Store.prototype._apiRequest = function(action, obj, onSuccess) {
    var id, options, request, url;
    id = obj && obj.id;
    url = this._urlFor(action, id);
    options = this._apiRequestOptions(action, obj, onSuccess);
    request = $.ajax(url, options);
    request._id = id;
    request._action = action;
    return request;
  };

  Store.prototype._apiRequestOptions = function(action, obj, onSuccess) {
    var data, method, opts;
    method = this._methodFor(action);
    opts = {
      type: method,
      headers: this.element.data('annotator:headers'),
      dataType: "json",
      success: onSuccess || function() {},
      error: this._onError
    };
    if (this.options.emulateHTTP && (method === 'PUT' || method === 'DELETE')) {
      opts.headers = $.extend(opts.headers, {
        'X-HTTP-Method-Override': method
      });
      opts.type = 'POST';
    }
    if (action === "search") {
      opts = $.extend(opts, {
        data: obj
      });
      return opts;
    }
    data = obj && this._dataFor(obj);
    if (this.options.emulateJSON) {
      opts.data = {
        json: data
      };
      if (this.options.emulateHTTP) {
        opts.data._method = method;
      }
      return opts;
    }
    opts = $.extend(opts, {
      data: data,
      contentType: "application/json; charset=utf-8"
    });
    return opts;
  };

  Store.prototype._urlFor = function(action, id) {
    var url;
    url = this.options.prefix != null ? this.options.prefix : '';
    url += this.options.urls[action];
    url = url.replace(/\/:id/, id != null ? '/' + id : '');
    url = url.replace(/:id/, id != null ? id : '');
    return url;
  };

  Store.prototype._methodFor = function(action) {
    var table;
    table = {
      'create': 'POST',
      'read': 'GET',
      'update': 'PUT',
      'destroy': 'DELETE',
      'search': 'GET'
    };
    return table[action];
  };

  Store.prototype._dataFor = function(annotation) {
    var data, highlights;
    highlights = annotation.highlights;
    delete annotation.highlights;
    $.extend(annotation, this.options.annotationData);
    data = JSON.stringify(annotation);
    if (highlights) {
      annotation.highlights = highlights;
    }
    return data;
  };

  Store.prototype._onError = function(xhr) {
    var action, message;
    action = xhr._action;
    message = Annotator._t("Sorry we could not ") + action + Annotator._t(" this annotation");
    if (xhr._action === 'search') {
      message = Annotator._t("Sorry we could not search the store for annotations");
    } else if (xhr._action === 'read' && !xhr._id) {
      message = Annotator._t("Sorry we could not ") + action + Annotator._t(" the annotations from the store");
    }
    switch (xhr.status) {
      case 401:
        message = Annotator._t("Sorry you are not allowed to ") + action + Annotator._t(" this annotation");
        break;
      case 404:
        message = Annotator._t("Sorry we could not connect to the annotations store");
        break;
      case 500:
        message = Annotator._t("Sorry something went wrong with the annotation store");
    }
    Annotator.showNotification(message, Annotator.Notification.ERROR);
    return console.error(Annotator._t("API request failed:") + (" '" + xhr.status + "'"));
  };

  return Store;

})(Annotator.Plugin);

//# sourceMappingURL=store.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Permissions = (function(_super) {
  __extends(Permissions, _super);

  Permissions.prototype.events = {
    'beforeAnnotationCreated': 'addFieldsToAnnotation'
  };

  Permissions.prototype.options = {
    showViewPermissionsCheckbox: true,
    showEditPermissionsCheckbox: true,
    userId: function(user) {
      return user;
    },
    userString: function(user) {
      return user;
    },
    userAuthorize: function(action, annotation, user) {
      var token, tokens, _i, _len;
      if (annotation.permissions) {
        tokens = annotation.permissions[action] || [];
        if (tokens.length === 0) {
          return true;
        }
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          if (this.userId(user) === token) {
            return true;
          }
        }
        return false;
      } else if (annotation.user) {
        if (user) {
          return this.userId(user) === this.userId(annotation.user);
        } else {
          return false;
        }
      }
      return true;
    },
    user: '',
    permissions: {
      'read': [],
      'update': [],
      'delete': [],
      'admin': []
    }
  };

  function Permissions(element, options) {
    this._setAuthFromToken = __bind(this._setAuthFromToken, this);
    this.updateViewer = __bind(this.updateViewer, this);
    this.updateAnnotationPermissions = __bind(this.updateAnnotationPermissions, this);
    this.updatePermissionsField = __bind(this.updatePermissionsField, this);
    this.addFieldsToAnnotation = __bind(this.addFieldsToAnnotation, this);
    Permissions.__super__.constructor.apply(this, arguments);
    if (this.options.user) {
      this.setUser(this.options.user);
      delete this.options.user;
    }
  }

  Permissions.prototype.pluginInit = function() {
    var createCallback, self;
    if (!Annotator.supported()) {
      return;
    }
    self = this;
    createCallback = function(method, type) {
      return function(field, annotation) {
        return self[method].call(self, type, field, annotation);
      };
    };
    if (!this.user && this.annotator.plugins.Auth) {
      this.annotator.plugins.Auth.withToken(this._setAuthFromToken);
    }
    if (this.options.showViewPermissionsCheckbox === true) {
      this.annotator.editor.addField({
        type: 'checkbox',
        label: Annotator._t('Allow anyone to <strong>view</strong> this annotation'),
        load: createCallback('updatePermissionsField', 'read'),
        submit: createCallback('updateAnnotationPermissions', 'read')
      });
    }
    if (this.options.showEditPermissionsCheckbox === true) {
      this.annotator.editor.addField({
        type: 'checkbox',
        label: Annotator._t('Allow anyone to <strong>edit</strong> this annotation'),
        load: createCallback('updatePermissionsField', 'update'),
        submit: createCallback('updateAnnotationPermissions', 'update')
      });
    }
    this.annotator.viewer.addField({
      load: this.updateViewer
    });
    if (this.annotator.plugins.Filter) {
      return this.annotator.plugins.Filter.addFilter({
        label: Annotator._t('User'),
        property: 'user',
        isFiltered: (function(_this) {
          return function(input, user) {
            var keyword, _i, _len, _ref;
            user = _this.options.userString(user);
            if (!(input && user)) {
              return false;
            }
            _ref = input.split(/\s*/);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              keyword = _ref[_i];
              if (user.indexOf(keyword) === -1) {
                return false;
              }
            }
            return true;
          };
        })(this)
      });
    }
  };

  Permissions.prototype.setUser = function(user) {
    return this.user = user;
  };

  Permissions.prototype.addFieldsToAnnotation = function(annotation) {
    if (annotation) {
      annotation.permissions = $.extend(true, {}, this.options.permissions);
      if (this.user) {
        return annotation.user = this.user;
      }
    }
  };

  Permissions.prototype.authorize = function(action, annotation, user) {
    if (user === void 0) {
      user = this.user;
    }
    if (this.options.userAuthorize) {
      return this.options.userAuthorize.call(this.options, action, annotation, user);
    } else {
      return true;
    }
  };

  Permissions.prototype.updatePermissionsField = function(action, field, annotation) {
    var input;
    field = $(field).show();
    input = field.find('input').removeAttr('disabled');
    if (!this.authorize('admin', annotation)) {
      field.hide();
    }
    if (this.authorize(action, annotation || {}, null)) {
      return input.attr('checked', 'checked');
    } else {
      return input.removeAttr('checked');
    }
  };

  Permissions.prototype.updateAnnotationPermissions = function(type, field, annotation) {
    var dataKey;
    if (!annotation.permissions) {
      annotation.permissions = $.extend(true, {}, this.options.permissions);
    }
    dataKey = type + '-permissions';
    if ($(field).find('input').is(':checked')) {
      return annotation.permissions[type] = [];
    } else {
      return annotation.permissions[type] = [this.options.userId(this.user)];
    }
  };

  Permissions.prototype.updateViewer = function(field, annotation, controls) {
    var user, username;
    field = $(field);
    username = this.options.userString(annotation.user);
    if (annotation.user && username && typeof username === 'string') {
      user = Annotator.Util.escape(this.options.userString(annotation.user));
      field.html(user).addClass('annotator-user');
    } else {
      field.remove();
    }
    if (controls) {
      if (!this.authorize('update', annotation)) {
        controls.hideEdit();
      }
      if (!this.authorize('delete', annotation)) {
        return controls.hideDelete();
      }
    }
  };

  Permissions.prototype._setAuthFromToken = function(token) {
    return this.setUser(token.userId);
  };

  return Permissions;

})(Annotator.Plugin);

//# sourceMappingURL=permissions.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Annotator.Plugin.AnnotateItPermissions = (function(_super) {
  __extends(AnnotateItPermissions, _super);

  function AnnotateItPermissions() {
    this._setAuthFromToken = __bind(this._setAuthFromToken, this);
    this.updateAnnotationPermissions = __bind(this.updateAnnotationPermissions, this);
    this.updatePermissionsField = __bind(this.updatePermissionsField, this);
    this.addFieldsToAnnotation = __bind(this.addFieldsToAnnotation, this);
    return AnnotateItPermissions.__super__.constructor.apply(this, arguments);
  }

  AnnotateItPermissions.prototype.options = {
    showViewPermissionsCheckbox: true,
    showEditPermissionsCheckbox: true,
    groups: {
      world: 'group:__world__',
      authenticated: 'group:__authenticated__',
      consumer: 'group:__consumer__'
    },
    userId: function(user) {
      return user.userId;
    },
    userString: function(user) {
      return user.userId;
    },
    userAuthorize: function(action, annotation, user) {
      var action_field, permissions, _ref, _ref1, _ref2, _ref3;
      permissions = annotation.permissions || {};
      action_field = permissions[action] || [];
      if (_ref = this.groups.world, __indexOf.call(action_field, _ref) >= 0) {
        return true;
      } else if ((user != null) && (user.userId != null) && (user.consumerKey != null)) {
        if (user.userId === annotation.user && user.consumerKey === annotation.consumer) {
          return true;
        } else if (_ref1 = this.groups.authenticated, __indexOf.call(action_field, _ref1) >= 0) {
          return true;
        } else if (user.consumerKey === annotation.consumer && (_ref2 = this.groups.consumer, __indexOf.call(action_field, _ref2) >= 0)) {
          return true;
        } else if (user.consumerKey === annotation.consumer && (_ref3 = user.userId, __indexOf.call(action_field, _ref3) >= 0)) {
          return true;
        } else if (user.consumerKey === annotation.consumer && user.admin) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    permissions: {
      'read': ['group:__world__'],
      'update': [],
      'delete': [],
      'admin': []
    }
  };

  AnnotateItPermissions.prototype.addFieldsToAnnotation = function(annotation) {
    if (annotation) {
      annotation.permissions = this.options.permissions;
      if (this.user) {
        annotation.user = this.user.userId;
        return annotation.consumer = this.user.consumerKey;
      }
    }
  };

  AnnotateItPermissions.prototype.updatePermissionsField = function(action, field, annotation) {
    var input;
    field = $(field).show();
    input = field.find('input').removeAttr('disabled');
    if (!this.authorize('admin', annotation)) {
      field.hide();
    }
    if (this.user && this.authorize(action, annotation || {}, {
      userId: '__nonexistentuser__',
      consumerKey: this.user.consumerKey
    })) {
      return input.attr('checked', 'checked');
    } else {
      return input.removeAttr('checked');
    }
  };

  AnnotateItPermissions.prototype.updateAnnotationPermissions = function(type, field, annotation) {
    var dataKey;
    if (!annotation.permissions) {
      annotation.permissions = this.options.permissions;
    }
    dataKey = type + '-permissions';
    if ($(field).find('input').is(':checked')) {
      return annotation.permissions[type] = [type === 'read' ? this.options.groups.world : this.options.groups.consumer];
    } else {
      return annotation.permissions[type] = [];
    }
  };

  AnnotateItPermissions.prototype._setAuthFromToken = function(token) {
    return this.setUser(token);
  };

  return AnnotateItPermissions;

})(Annotator.Plugin.Permissions);

//# sourceMappingURL=annotateitpermissions.map
;// Generated by CoffeeScript 1.7.1
var base64Decode, base64UrlDecode, createDateFromISO8601, parseToken,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

createDateFromISO8601 = function(string) {
  var d, date, offset, regexp, time, _ref;
  regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
  d = string.match(new RegExp(regexp));
  offset = 0;
  date = new Date(d[1], 0, 1);
  if (d[3]) {
    date.setMonth(d[3] - 1);
  }
  if (d[5]) {
    date.setDate(d[5]);
  }
  if (d[7]) {
    date.setHours(d[7]);
  }
  if (d[8]) {
    date.setMinutes(d[8]);
  }
  if (d[10]) {
    date.setSeconds(d[10]);
  }
  if (d[12]) {
    date.setMilliseconds(Number("0." + d[12]) * 1000);
  }
  if (d[14]) {
    offset = (Number(d[16]) * 60) + Number(d[17]);
    offset *= (_ref = d[15] === '-') != null ? _ref : {
      1: -1
    };
  }
  offset -= date.getTimezoneOffset();
  time = Number(date) + (offset * 60 * 1000);
  date.setTime(Number(time));
  return date;
};

base64Decode = function(data) {
  var ac, b64, bits, dec, h1, h2, h3, h4, i, o1, o2, o3, tmp_arr;
  if (typeof atob !== "undefined" && atob !== null) {
    return atob(data);
  } else {
    b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    i = 0;
    ac = 0;
    dec = "";
    tmp_arr = [];
    if (!data) {
      return data;
    }
    data += '';
    while (i < data.length) {
      h1 = b64.indexOf(data.charAt(i++));
      h2 = b64.indexOf(data.charAt(i++));
      h3 = b64.indexOf(data.charAt(i++));
      h4 = b64.indexOf(data.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;
      if (h3 === 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 === 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    }
    return tmp_arr.join('');
  }
};

base64UrlDecode = function(data) {
  var i, m, _i, _ref;
  m = data.length % 4;
  if (m !== 0) {
    for (i = _i = 0, _ref = 4 - m; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      data += '=';
    }
  }
  data = data.replace(/-/g, '+');
  data = data.replace(/_/g, '/');
  return base64Decode(data);
};

parseToken = function(token) {
  var head, payload, sig, _ref;
  _ref = token.split('.'), head = _ref[0], payload = _ref[1], sig = _ref[2];
  return JSON.parse(base64UrlDecode(payload));
};

Annotator.Plugin.Auth = (function(_super) {
  __extends(Auth, _super);

  Auth.prototype.options = {
    token: null,
    tokenUrl: '/auth/token',
    autoFetch: true
  };

  function Auth(element, options) {
    Auth.__super__.constructor.apply(this, arguments);
    this.waitingForToken = [];
    if (this.options.token) {
      this.setToken(this.options.token);
    } else {
      this.requestToken();
    }
  }

  Auth.prototype.requestToken = function() {
    this.requestInProgress = true;
    return $.ajax({
      url: this.options.tokenUrl,
      dataType: 'text',
      xhrFields: {
        withCredentials: true
      }
    }).done((function(_this) {
      return function(data, status, xhr) {
        return _this.setToken(data);
      };
    })(this)).fail((function(_this) {
      return function(xhr, status, err) {
        var msg;
        msg = Annotator._t("Couldn't get auth token:");
        console.error("" + msg + " " + err, xhr);
        return Annotator.showNotification("" + msg + " " + xhr.responseText, Annotator.Notification.ERROR);
      };
    })(this)).always((function(_this) {
      return function() {
        return _this.requestInProgress = false;
      };
    })(this));
  };

  Auth.prototype.setToken = function(token) {
    var _results;
    this.token = token;
    this._unsafeToken = parseToken(token);
    if (this.haveValidToken()) {
      if (this.options.autoFetch) {
        this.refreshTimeout = setTimeout(((function(_this) {
          return function() {
            return _this.requestToken();
          };
        })(this)), (this.timeToExpiry() - 2) * 1000);
      }
      this.updateHeaders();
      _results = [];
      while (this.waitingForToken.length > 0) {
        _results.push(this.waitingForToken.pop()(this._unsafeToken));
      }
      return _results;
    } else {
      console.warn(Annotator._t("Didn't get a valid token."));
      if (this.options.autoFetch) {
        console.warn(Annotator._t("Getting a new token in 10s."));
        return setTimeout(((function(_this) {
          return function() {
            return _this.requestToken();
          };
        })(this)), 10 * 1000);
      }
    }
  };

  Auth.prototype.haveValidToken = function() {
    var allFields;
    allFields = this._unsafeToken && this._unsafeToken.issuedAt && this._unsafeToken.ttl && this._unsafeToken.consumerKey;
    if (allFields && this.timeToExpiry() > 0) {
      return true;
    } else {
      return false;
    }
  };

  Auth.prototype.timeToExpiry = function() {
    var expiry, issue, now, timeToExpiry;
    now = new Date().getTime() / 1000;
    issue = createDateFromISO8601(this._unsafeToken.issuedAt).getTime() / 1000;
    expiry = issue + this._unsafeToken.ttl;
    timeToExpiry = expiry - now;
    if (timeToExpiry > 0) {
      return timeToExpiry;
    } else {
      return 0;
    }
  };

  Auth.prototype.updateHeaders = function() {
    var current;
    current = this.element.data('annotator:headers');
    return this.element.data('annotator:headers', $.extend(current, {
      'x-annotator-auth-token': this.token
    }));
  };

  Auth.prototype.withToken = function(callback) {
    if (callback == null) {
      return;
    }
    if (this.haveValidToken()) {
      return callback(this._unsafeToken);
    } else {
      this.waitingForToken.push(callback);
      if (!this.requestInProgress) {
        return this.requestToken();
      }
    }
  };

  return Auth;

})(Annotator.Plugin);

//# sourceMappingURL=auth.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Tags = (function(_super) {
  __extends(Tags, _super);

  function Tags() {
    this.setAnnotationTags = __bind(this.setAnnotationTags, this);
    this.updateField = __bind(this.updateField, this);
    return Tags.__super__.constructor.apply(this, arguments);
  }

  Tags.prototype.options = {
    parseTags: function(string) {
      var tags;
      string = $.trim(string);
      tags = [];
      if (string) {
        tags = string.split(/\s+/);
      }
      return tags;
    },
    stringifyTags: function(array) {
      return array.join(" ");
    }
  };

  Tags.prototype.field = null;

  Tags.prototype.input = null;

  Tags.prototype.pluginInit = function() {
    if (!Annotator.supported()) {
      return;
    }
    this.field = this.annotator.editor.addField({
      label: Annotator._t('Add some tags here') + '\u2026',
      load: this.updateField,
      submit: this.setAnnotationTags
    });
    this.annotator.viewer.addField({
      load: this.updateViewer
    });
    if (this.annotator.plugins.Filter) {
      this.annotator.plugins.Filter.addFilter({
        label: Annotator._t('Tag'),
        property: 'tags',
        isFiltered: Annotator.Plugin.Tags.filterCallback
      });
    }
    return this.input = $(this.field).find(':input');
  };

  Tags.prototype.parseTags = function(string) {
    return this.options.parseTags(string);
  };

  Tags.prototype.stringifyTags = function(array) {
    return this.options.stringifyTags(array);
  };

  Tags.prototype.updateField = function(field, annotation) {
    var value;
    value = '';
    if (annotation.tags) {
      value = this.stringifyTags(annotation.tags);
    }
    return this.input.val(value);
  };

  Tags.prototype.setAnnotationTags = function(field, annotation) {
    return annotation.tags = this.parseTags(this.input.val());
  };

  Tags.prototype.updateViewer = function(field, annotation) {
    field = $(field);
    if (annotation.tags && $.isArray(annotation.tags) && annotation.tags.length) {
      return field.addClass('annotator-tags').html(function() {
        var string;
        return string = $.map(annotation.tags, function(tag) {
          return '<span class="annotator-tag">' + Annotator.Util.escape(tag) + '</span>';
        }).join(' ');
      });
    } else {
      return field.remove();
    }
  };

  return Tags;

})(Annotator.Plugin);

Annotator.Plugin.Tags.filterCallback = function(input, tags) {
  var keyword, keywords, matches, tag, _i, _j, _len, _len1;
  if (tags == null) {
    tags = [];
  }
  matches = 0;
  keywords = [];
  if (input) {
    keywords = input.split(/\s+/g);
    for (_i = 0, _len = keywords.length; _i < _len; _i++) {
      keyword = keywords[_i];
      if (tags.length) {
        for (_j = 0, _len1 = tags.length; _j < _len1; _j++) {
          tag = tags[_j];
          if (tag.indexOf(keyword) !== -1) {
            matches += 1;
          }
        }
      }
    }
  }
  return matches === keywords.length;
};

//# sourceMappingURL=tags.map
;// Generated by CoffeeScript 1.7.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Unsupported = (function(_super) {
  __extends(Unsupported, _super);

  function Unsupported() {
    return Unsupported.__super__.constructor.apply(this, arguments);
  }

  Unsupported.prototype.options = {
    message: Annotator._t("Sorry your current browser does not support the Annotator")
  };

  Unsupported.prototype.pluginInit = function() {
    if (!Annotator.supported()) {
      return $((function(_this) {
        return function() {
          Annotator.showNotification(_this.options.message);
          if ((window.XMLHttpRequest === void 0) && (ActiveXObject !== void 0)) {
            return $('html').addClass('ie6');
          }
        };
      })(this));
    }
  };

  return Unsupported;

})(Annotator.Plugin);

//# sourceMappingURL=unsupported.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Filter = (function(_super) {
  __extends(Filter, _super);

  Filter.prototype.events = {
    ".annotator-filter-property input focus": "_onFilterFocus",
    ".annotator-filter-property input blur": "_onFilterBlur",
    ".annotator-filter-property input keyup": "_onFilterKeyup",
    ".annotator-filter-previous click": "_onPreviousClick",
    ".annotator-filter-next click": "_onNextClick",
    ".annotator-filter-clear click": "_onClearClick"
  };

  Filter.prototype.classes = {
    active: 'annotator-filter-active',
    hl: {
      hide: 'annotator-hl-filtered',
      active: 'annotator-hl-active'
    }
  };

  Filter.prototype.html = {
    element: "<div class=\"annotator-filter\">\n  <strong>" + Annotator._t('Navigate:') + "</strong>\n<span class=\"annotator-filter-navigation\">\n  <button class=\"annotator-filter-previous\">" + Annotator._t('Previous') + "</button>\n<button class=\"annotator-filter-next\">" + Annotator._t('Next') + "</button>\n</span>\n<strong>" + Annotator._t('Filter by:') + "</strong>\n</div>",
    filter: "<span class=\"annotator-filter-property\">\n  <label></label>\n  <input/>\n  <button class=\"annotator-filter-clear\">" + Annotator._t('Clear') + "</button>\n</span>"
  };

  Filter.prototype.options = {
    appendTo: 'body',
    filters: [],
    addAnnotationFilter: true,
    isFiltered: function(input, property) {
      var keyword, _i, _len, _ref;
      if (!(input && property)) {
        return false;
      }
      _ref = input.split(/\s+/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        keyword = _ref[_i];
        if (property.indexOf(keyword) === -1) {
          return false;
        }
      }
      return true;
    }
  };

  function Filter(element, options) {
    this._onPreviousClick = __bind(this._onPreviousClick, this);
    this._onNextClick = __bind(this._onNextClick, this);
    this._onFilterKeyup = __bind(this._onFilterKeyup, this);
    this._onFilterBlur = __bind(this._onFilterBlur, this);
    this._onFilterFocus = __bind(this._onFilterFocus, this);
    this.updateHighlights = __bind(this.updateHighlights, this);
    var _base;
    element = $(this.html.element).appendTo((options != null ? options.appendTo : void 0) || this.options.appendTo);
    Filter.__super__.constructor.call(this, element, options);
    (_base = this.options).filters || (_base.filters = []);
    this.filter = $(this.html.filter);
    this.filters = [];
    this.current = 0;
  }

  Filter.prototype.pluginInit = function() {
    var filter, _i, _len, _ref;
    _ref = this.options.filters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      filter = _ref[_i];
      this.addFilter(filter);
    }
    this.updateHighlights();
    this._setupListeners()._insertSpacer();
    if (this.options.addAnnotationFilter === true) {
      return this.addFilter({
        label: Annotator._t('Annotation'),
        property: 'text'
      });
    }
  };

  Filter.prototype.destroy = function() {
    var currentMargin, html;
    Filter.__super__.destroy.apply(this, arguments);
    html = $('html');
    currentMargin = parseInt(html.css('padding-top'), 10) || 0;
    html.css('padding-top', currentMargin - this.element.outerHeight());
    return this.element.remove();
  };

  Filter.prototype._insertSpacer = function() {
    var currentMargin, html;
    html = $('html');
    currentMargin = parseInt(html.css('padding-top'), 10) || 0;
    html.css('padding-top', currentMargin + this.element.outerHeight());
    return this;
  };

  Filter.prototype._setupListeners = function() {
    var event, events, _i, _len;
    events = ['annotationsLoaded', 'annotationCreated', 'annotationUpdated', 'annotationDeleted'];
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      this.annotator.subscribe(event, this.updateHighlights);
    }
    return this;
  };

  Filter.prototype.addFilter = function(options) {
    var f, filter;
    filter = $.extend({
      label: '',
      property: '',
      isFiltered: this.options.isFiltered
    }, options);
    if (!((function() {
      var _i, _len, _ref, _results;
      _ref = this.filters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        if (f.property === filter.property) {
          _results.push(f);
        }
      }
      return _results;
    }).call(this)).length) {
      filter.id = 'annotator-filter-' + filter.property;
      filter.annotations = [];
      filter.element = this.filter.clone().appendTo(this.element);
      filter.element.find('label').html(filter.label).attr('for', filter.id);
      filter.element.find('input').attr({
        id: filter.id,
        placeholder: Annotator._t('Filter by ') + filter.label + '\u2026'
      });
      filter.element.find('button').hide();
      filter.element.data('filter', filter);
      this.filters.push(filter);
    }
    return this;
  };

  Filter.prototype.updateFilter = function(filter) {
    var annotation, annotations, input, property, _i, _len, _ref;
    filter.annotations = [];
    this.updateHighlights();
    this.resetHighlights();
    input = $.trim(filter.element.find('input').val());
    if (input) {
      annotations = this.highlights.map(function() {
        return $(this).data('annotation');
      });
      _ref = $.makeArray(annotations);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        annotation = _ref[_i];
        property = annotation[filter.property];
        if (filter.isFiltered(input, property)) {
          filter.annotations.push(annotation);
        }
      }
      return this.filterHighlights();
    }
  };

  Filter.prototype.updateHighlights = function() {
    this.highlights = this.annotator.element.find('.annotator-hl:visible');
    return this.filtered = this.highlights.not(this.classes.hl.hide);
  };

  Filter.prototype.filterHighlights = function() {
    var activeFilters, annotation, annotations, filtered, highlights, index, uniques, _i, _len, _ref;
    activeFilters = $.grep(this.filters, function(filter) {
      return !!filter.annotations.length;
    });
    filtered = ((_ref = activeFilters[0]) != null ? _ref.annotations : void 0) || [];
    if (activeFilters.length > 1) {
      annotations = [];
      $.each(activeFilters, function() {
        return $.merge(annotations, this.annotations);
      });
      uniques = [];
      filtered = [];
      $.each(annotations, function() {
        if ($.inArray(this, uniques) === -1) {
          return uniques.push(this);
        } else {
          return filtered.push(this);
        }
      });
    }
    highlights = this.highlights;
    for (index = _i = 0, _len = filtered.length; _i < _len; index = ++_i) {
      annotation = filtered[index];
      highlights = highlights.not(annotation.highlights);
    }
    highlights.addClass(this.classes.hl.hide);
    this.filtered = this.highlights.not(this.classes.hl.hide);
    return this;
  };

  Filter.prototype.resetHighlights = function() {
    this.highlights.removeClass(this.classes.hl.hide);
    this.filtered = this.highlights;
    return this;
  };

  Filter.prototype._onFilterFocus = function(event) {
    var input;
    input = $(event.target);
    input.parent().addClass(this.classes.active);
    return input.next('button').show();
  };

  Filter.prototype._onFilterBlur = function(event) {
    var input;
    if (!event.target.value) {
      input = $(event.target);
      input.parent().removeClass(this.classes.active);
      return input.next('button').hide();
    }
  };

  Filter.prototype._onFilterKeyup = function(event) {
    var filter;
    filter = $(event.target).parent().data('filter');
    if (filter) {
      return this.updateFilter(filter);
    }
  };

  Filter.prototype._findNextHighlight = function(previous) {
    var active, annotation, current, index, next, offset, operator, resetOffset;
    if (!this.highlights.length) {
      return this;
    }
    offset = previous ? 0 : -1;
    resetOffset = previous ? -1 : 0;
    operator = previous ? 'lt' : 'gt';
    active = this.highlights.not('.' + this.classes.hl.hide);
    current = active.filter('.' + this.classes.hl.active);
    if (!current.length) {
      current = active.eq(offset);
    }
    annotation = current.data('annotation');
    index = active.index(current[0]);
    next = active.filter(":" + operator + "(" + index + ")").not(annotation.highlights).eq(resetOffset);
    if (!next.length) {
      next = active.eq(resetOffset);
    }
    return this._scrollToHighlight(next.data('annotation').highlights);
  };

  Filter.prototype._onNextClick = function(event) {
    return this._findNextHighlight();
  };

  Filter.prototype._onPreviousClick = function(event) {
    return this._findNextHighlight(true);
  };

  Filter.prototype._scrollToHighlight = function(highlight) {
    highlight = $(highlight);
    this.highlights.removeClass(this.classes.hl.active);
    highlight.addClass(this.classes.hl.active);
    return $('html, body').animate({
      scrollTop: highlight.offset().top - (this.element.height() + 20)
    }, 150);
  };

  Filter.prototype._onClearClick = function(event) {
    return $(event.target).prev('input').val('').keyup().blur();
  };

  return Filter;

})(Annotator.Plugin);

//# sourceMappingURL=filter.map
