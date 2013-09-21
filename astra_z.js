Element.addMethods({
  getTagName: function(element) {
    return element.tagName.downcase();
  },
  /** section: Dom, related to: Element
   *  
   *  Element#getId() -> String | null
   *  
   *  Returns `id` for Element, 
   *  when element without `id` return null. 
   *  
   *  #### Example
   *  
   *  <div class="class1"></div> 
   *  <div id="elem" class="class1"></div>
   *
   *  $$("div.class1").map(Element.getId)
   *  // [null, "elem"]
   *
  **/
  getId: function(element) {
    return element.id || null;
  },
  /** section: Dom, related to: Element
   *  
   *  Element#classes(element) -> Array
   *  
   *  Returns Array of classes for Element.
   *
   *  #### Example
   *  
   *  <div id="elem" class="class1 class2 class3"></div> 
   *  
   *  $("elem").classes();
   *  // ["class1", "class2", "class3"]
   *
  **/
  classes: function(element) {
    return $w(element.readAttribute('class'));
  },
  /** section: Dom, related to: Element
   *  
   *  Element#getAttributes(element, obj) -> ?
   *  - element(Element): element for method
   *  - obj(Boolean): when `false` return only object, when `true`
   *  value for `class` will Array with classes, and value for
   *  `data` return in inner Object. Default set in `false`.   
   *
   *  Returns Object wherein keys is attribute and value is attribute value.   
   *
   *  #### Example
   *
   *  <div id="elem" data-first="1" data-second="2" data-more="more"
   *     class="cls1 cls2 cls3"></div> 
   *  
   *  $("elem").getAttributes();
   *  // -> { 
   *          'id'          : "elem", 
   *          'data-first'  : "1",
   *          'data-second' : "2",
   *          'data-more'   : "more",
   *          'class'       : "cls1 cls2 cls3"
   *        }
   *  $("elem").getAttributes(true);  
   *  // -> { 
   *          'id'          : "elem", 
   *          'data'        : 
                { 
                   'first'  : "1",
   *               'second' : "2",
   *               'more'   : "more"
   *            },
   *          'class'       : ["cls1", "cls2", "cls3"]
   *        }
   *
   *
  **/  
  getAttributes: function(element, obj) {
    var obj  = obj || false,
        hash = $H();
    
    for (var i = 0, attrs = element.attributes, 
             length = attrs.length,
             value, key; 
             i < length;
             i++ 
        ) {
      key = attrs.item(i).nodeName;
      value = attrs.item(i).nodeValue;
      
      if (!obj) {
        if (key == 'class')
          value = $w(value);

        if (key.startsWith("data-")) {
          var tmp  = hash.getOrBuild("data", $H({})),  
              name = /data-(.+)/.exec(key).second();
          tmp.set(name, value);
          continue ;
        }
      }  
      hash.set(key, value);
    }
    return hash.toJ();
  },
  /** section: Dom, related to: Element
   *  
   *  Element#removeClasses(element, classes) -> Element
   *  - classes(String | Array): remove `classes` from `element` 
   *  
   *
   *  #### Example
   *  
   *  <div id="elem" class="foo bar baz"></div> 
   *  
   *  $("elem").removeClasses("foo", "bar");
   *  $("elem").classes(); 
   *  // ["baz"]
   *  // or 
   *  $("elem").removeClasses(["foo", "bar"]);
   *  $("elem").classes(); 
   *  // ["baz"]
   *
  **/
  removeClasses: function(element) {
    var element = $(element);
    $A(arguments).slice(1).flatten().each(function(klass) {
      element.removeClassName(klass);
    });
    return element;
  },
  /** section: Dom, related to: Element
   *  
   *  Element#addClasses(element, classes) -> Element
   *  - classes(String | Array): add `classes` to `element` 
   *  
   *
   *  #### Example
   *  
   *  <div id="elem" class=""></div> 
   *  
   *  $("elem").addClasses("foo", "bar");
   *  $("elem").classes(); 
   *  // ["foo", "bar"]
   *  // or 
   *  $("elem").addClasses(["foo", "bar"]);
   *  $("elem").classes(); 
   *  // ["foo", "bar"]
   *
  **/
  addClasses: function(element) {
    var element = $(element);
    $A(arguments).slice(1).flatten().each(function(klass) {
      element.addClassName(klass);
    });
    return element;
  }
});





/** section: Language, related to: Array
 *  
 *  Array#second -> ?
 *  
 *  #### Example
 *
 *  [1,2,3].second();
 *  // -> 2
 *
**/
Array.prototype.second = function() {
  return this[1];
};

/** section: Language, related to: Array
 *  
 *  Array#isEmpty -> Boolean
 *  
 *  #### Example
 *
 *  [1,2,3].isEmpty();
 *  // -> false
 *  [].isEmpty(); 
 *  // -> true 
 *
**/
Array.prototype.isEmpty = function() {
  return this.length == 0;
};

/** section: Language, related to: Array
 *  
 *  Array#diff(arr) -> Array
 *  - arr (Array): Array for compare 
 *  
 *  Returns new Array from original array, without elements which
 *  contains in arr.  
 *
 *  #### Example
 *
 *  [1,2,3].diff([1]);
 *  // -> [2,3]
 *  [].diff([1]); 
 *  // -> []
 *
**/
Array.prototype.diff = function(arr) {
  return this.filter(function(z){ return !arr.include(z); })
};

/** section: Language, related to: Hash
 *
**/
Hash.addMethods({
  /**
   *  Hash#toObj() -> Object
   *    
   *  Returns Object representation of Hash.
   
   *  ##### Example
   *
   *     var hash = $H({
   *       a: 1,
   *       b: $H({
   *         c: "dsa",
   *         d: $H({
   *           a: 10,
   *           b: $H({
   *             z: 123
   *           })
   *         })
   *       })
   *     }); 
   *    
   *     hash.toObj(); 
   *     // -> {a: 1, b: Object}   
   *     hash.toObject();
   *     // -> {a: 1, b: klass}   
   * 
  **/
  toObj: function() {
    if (this.isEmpty()) 
      return {};

    var o = {};

    for(var i = 0, length = this.size(), key, value; 
        i < length; 
        i ++) {
      
      key = this.keys()[i];
      value = this.get(key)
      
      if (Object.isHash(value)) {
        o[key] = value.toObj();
      } else {
        o[key] = value;
      }
    }

    return o;
  },
  /**
   *  alias for `toObj`
   * 
  **/
  toJ: function() {
    return this.toObj();
  },
  /**
   *  Hash#getOrBuild(key [, set_value]) -> ?
   *  - key (String): key for find
   *  - set_value (?): return when value not found. And added into hash 
   *    
   *  Update hash with `set_value` when `value` with `key` not found.
   * 
   *  ##### Example
   *
   *      var hash = $H({a : 1});
   *      hash.getOrBuild("a", 10); 
   *      // -> 1
   *      hash.getOrBuild("b", 10);
   *      // -> 10
   *      hash.inspect(); 
   *      // #<Hash:{'a': 1, 'b': 10}>
  **/
  getOrBuild: function(key, set_value) {
    var value = this.get(key);
    
    if (!value){
      this.set(key, set_value);
      return set_value;
    }
    return value;
  },
  /**
   *  Hash#getOrElse(key [, default]) -> ?
   *  - key (String): key for find
   *  - default (?): return when value not found
   *
   *  Return `value` from Hash with `key`,
   *  when value not found.
   * 
   *  ##### Example
   *
   *      var hash = $H({a : 1});
   *      hash.getOrEmpty("a"); 
   *      // -> 1
   *      $H({a:1}).getOrElse("b", {b:1});
   *      // -> "#<Hash:{'b': 1}>"
   *      $H({a:1}).getOrElse("b", 10);
   *      // -> 10
   *      $H({a:1}).getOrElse("a", 10);
   *      // -> 1  
  **/
  getOrElse: function(key, object) {
    var value = this.get(key);
    if (!value)
      return object || {};
    
    return value;   
  },
  /**
   *  Hash#isEmpty() -> Boolean
   * 
   *  Return `true` when Hash not contained the elements,
   *  otherwise return `false`.
   * 
   *  ##### Example
   *
   *      var hash = $H({a : 1});
   *      hash.isEmpty(); 
   *      // -> false
   *      $H({}).isEmpty();
   *      // -> true
   * 
  **/
  isEmpty: function() {
    return this.keys().isEmpty();
  },
  /**
   *  Hash#eachKey(iterator[, context]) -> Hash 
   * 
   *  Iterates over the keys in the hash.
   * 
   *  ##### Example
   *
   *      var hash = $H({England: 'London', Poland: 'Warsaw'});
   *
   *      h.eachKey(function(country) {
   *        alert(country);
   *      });
   *      // Alerts: England
   *      // Alerts: Poland
   * 
  **/
  eachKey: function(iterator, context) {
    this.keys().each(iterator, context);
  },
  /**
   *  Hash#eachValue(iterator[, context]) -> Hash 
   * 
   *  Iterates over the values in the hash.
   * 
   *  ##### Example
   *
   *      var hash = $H({England: 'London', Poland: 'Warsaw'});
   *
   *      h.eachValue(function(capital) {
   *        alert(capital);
   *      });
   *      // Alerts: London
   *      // Alerts: Warsaw
  **/ 
  eachValue: function(iterator, context) {
    this.values().each(iterator, context);
  },
  /**
   *  Hash#eachPair(iterator[, context]) -> Hash 
   * 
   *  Iterates over the key/value pairs in the hash.
   *
   *  ##### Example
   *
   *      var hash = $H({England: 'London', Poland: 'Warsaw'});
   *
   *      h.eachPair(function(country, capital) {
   *        alert(capital + "is the capital of " + country);
   *      });
   *      //Alerts: London is the capital of England 
   *      //Alerts: Warsaw is the capital of Poland
   * 
  **/
  eachPair: function(iterator, context) {
    this.each(function(pair) {
      iterator.call(context, pair.key, pair.value);
    });
  },
  /**
   *  Hash#updateWith(object, func) -> Hash
   *  - object (Object | Hash): The object to merge with this hash to produce
   *    the resulting hash.
   *  - func (Function): The function that will be applied to the values of the 
   *    same keys. Takes two arguments. 
   *   
   *  ##### Example
   *      
   *      var hash = $H({a: 1, b: 2, c: 2});
   *      var func = function(v1, v2) { return v1 + v2; };
   *      hash.updateWith({a: 3, b: 4, c: 5, d: 9}, func);
   *      // -> {a: 4, b: 6, c: 7, d: 9} 
   *
   * 
  **/ 
  updateWith: function (object, func) {
    if (!Object.isFunction(func))
      throw new TypeError();

    if (this.isEmpty()) {
      return this.update(object);
    }

    var keys = this.keys();
    var newHash = new Hash(object).inject(this, function(result, pair) {
      var value = keys.include(pair.key)? func(this.get(pair.key), pair.value) : pair.value;
      result.set(pair.key, value);
      return result;
    }.bind(this));
    return newHash;
  },
  /**
   *  Hash#mergeWith(object, func) -> Hash
   *  - object (Object | Hash): The object to merge with this hash to produce
   *    the resulting hash.
   *  - func (Function): The function that will be applied to the values of the 
   *    same keys. Takes two arguments. 
   *   
   *  ##### Example
   *      
   *      var hash1 = $H({a: 1, b: 2, c: 2});
   *      var func = function(v1, v2) { return v1 + v2; };
   *      
   *      var hash2 = hash.mergeWith({a: 3, b: 4, c: 5, d: 9}, func);
   *      // -> {a: 4, b: 6, c: 7, d: 9} 
   *
   * 
  **/ 
  mergeWith: function(object, func) {
    return this.clone().updateWith(object, func);
  }
});

/** section: Language, related to: String
 *  
 *  String#isWorld -> Boolean
 *  
 *  Return true when String is world, otherwise - false.
 *  
 *  #### Example
 *  
 *  "world".isWorld();  // -> true  
 *  "".isWorld();       // -> false
 *  "<world>".isWorld() // -> false
 *
 *
**/
String.prototype.isWorld = function() {
  if (this.blank())
    return false;

  return !/[^A-Za-z0-9_-]/.match(this);
};

/** section: Language, related to: String
 *  
 *  String#downcase() -> String
 *  
 *  Convert string value to lower case letters. Only wrap on `toLowerCase` method.
 *  
 *  #### Example
 *  
 *  "HELLO".downcase();  
 *  // -> heelo 
 *  
**/
String.prototype.downcase = function() {
  return this.toLowerCase();
};


/** section: Language, related to: String
 *  
 *  String#exclude(str) -> Boolean
 *  - str (String): string for check  
 *
 *  Return true when String not contain `str`, otherwise - false.
 *  
 *  #### Example
 *  
 *  "hello".exclude("lo");  
 *  // -> false  
 *  "hello".isWorld("ol");       
 *  // -> true
 *
**/
String.prototype.exclude = function(str) {
  return !this.include(str);
};

/** section: Language, related to: String
 *  
 *  String#exec -> String
 *  
 *  Execute string, as interpolate method.
 *  
 *  #### Example
 *  
 *  "a is $0, b is $1, again $0".exec('A', 'B'); 
 *   // -> "a is A, b is B, again A"  
 *  
 *  #### Bugs
 *  
 *  "in \$0".exec("A");
 *  // -> not should exec, but executes
 *  
 *
**/
String.prototype.exec = function() {
  var r    = /\$(\d+)/,
      args = [];
      str  = this;
  
  for(var i = 0, l = arguments.length; i < l; i++)
    args.push(arguments[i]);
  
  this.scan(r, function(x) {
    var f = x.first().strip(),
        s = parseInt(x.second()),
        n = args[s];

    if (Object.isUndefined(n))
      throw new Error("Element with index `$0` not found in [$1]".exec(s, args));

    str = str.gsub(new RegExp("\\"+f), n);   
  })
  return str;
};


/** section: Ext, related to: Delegate
 *  
 *  Provides delegate behaviour for methods. 
 *
**/
var Delegatable = {
    /** section: Ext, related to: Delegate
     *  
     *  Delegate#delegate(from, *methods) -> void
     *  - from(String): property 
     *  - *methods(String): methods for delegate `base` class to 
     *  target property `from`   
     *
     *  #### Example
     *
     *  var A = Class.create({
     *    some_method: function() {  
     *       //some code
     *    } 
     *  });    
     *  
     *  //Without delegate
     *  var B = Class.create({
     *    initialize: function() { this.a = new A(); },
     *    some_method: function() {
     *      this.a.some_method();
     *    }
     *  });
     *  //With delegate
     *  var C = Class.create({
     *    initialize: function() {  
     *      this.a = new A();
     *      this.delegate('a', 'some_method'); 
     *    }  
     *  });
     * 
     *
    **/  
    delegate: function(from) {
      var instance = this[from], self = this;
      $A(arguments).slice(1).each(function(method) {
        var func = instance[method];
        if (!Object.isFunction(func))
          throw "Error! Delegate only for methods";
        
        self[method] = function() {
          return func.apply(instance, arguments);
        }; 
      });
    },
    /** section: Ext, related to: Delegate
     *  
     *  Delegate#delegate_alias(from, as, to) -> void
     *  - from(String): property
     *  - as(Array[String]): array of methods which will called on `base` class
     *  - to(Array[String]): array of methods which will called with property
     *
     *  
     * #### Example:
     *
     *  class MyArray(Delegate, {
     *    initialize: function(arr) {
     *      this.array = arr;
     *      this.delegate_alias("array", ["count"], ["size"]);
     *    }
     *  });  
     *
     *  var arr = new MyArray([1,2,3]);
     *  arr.count();   
     *  // -> 3
     *
    **/
    delegate_alias: function(from, as, method) {
      var as = [as].flatten(), 
          method = [method].flatten();
      
      if (as.size() != method.size())
        throw 'Error alias array must be have size equal with target array';

      for (var i=0; i < as.size(); i++) {
        var func = this[from][method[i]];
        if (!Object.isFunction(func))
            throw "Error! Delegate only for methods";
        
        this[as[i]] = function() {
          return func.apply(this[from], $A(arguments));
        }; 
      }  
    }
  }
;
var ASTRA_Z = {

  VERSION : '0.0.1'
}; 


/** section: WidgetModules, related to: EventsModule
 *
 *  Create events for Widgets 
 *
 *
**/

var EventsModule = {
  create_events: function() {
    var self = this;
    this.events.each(function(event) {
      var f = "on_$0".exec(event);
      self[f] = function() {
        var func = this.setting[f]; 
        if (func && Object.isFunction(func)) {
          func.apply(this, arguments);
        }  
      }
    });
  }
};


/** section: Widget, related to: Widget
 *  
 *  Base class for Widgets. All widget is subclasses of this class.
 *  
 *  
**/
var Widget = Class.create(EventsModule, {
  /** 
   *  Widget#initialize(element [, setting])
   *  - element(String|Element): element for widget
   *  - setting(Object): Object with options for widget 
   * 
  **/
  initialize: function(element, setting) {
    this.element = $(element);

    if (!Object.isElement(this.element))
      throw "Element #{e} not found.".interpolate({e: element});

    Object.extend(this.setting, setting || {});
    
    this.create(this.html);
    this.bind_event();
  },
  create: function() { 
    var html = Translator.translate(this.setting.config);
    return html;
  },
  /**
   *  Widget#bind_event
   *  bind `setting.on` event with `on` method  
   *
  **/
  bind_event: function() {
    if (this.setting.on) {
      var handler = this.on.bind(this);
        
      if (Object.isArray(this.setting.on)) {
        this.setting.on.each(function(on) {
          this.element.observe(on, handler);
        }.bind(this));
      } else {
        this.element.observe(this.setting.on, handler);
      }
    }
  },
  /**
   *  Widget#on(event)
   *   
   *  called on `event`.
   *  
  **/
  on: function(event) {
    throw "Abstract. You must implement `on` function for events";
  }
}); 

Widget.prototype.initialize = Widget.prototype.initialize.wrap(
    function(func) {
      this.events = $w('create open close');
      this.setup();
      this.create_events();
      return func.apply(this, $A(arguments).slice(1));
    }
);





























var Accordion = Class.create(Widget, {
  setup: function() {
    this.setting = {
      first_open : 0,
      all_closed : false, //pending
      on         : "click",
      events     : {},
      config     : "(div.accordion#accordion \
                      (div.accordion-group* \
                        (div.accordion-heading \
                          (a.accordion-toggle~1 (*)) \
                        ) \
                        (div.accordion-body!1.collapse.in (*)) \
                      ) \
                    )"
    };
  },
  create: function($super) {
    this.binded = $super().binded;
    
    var element    = this.element,
        width      = this.setting.width,
        first_open = this.setting.first_open;

    this.binded.each(function(hash) {
      hash.get('to').each(function(e) {
        var elems = $$("$0#$1 $2".exec(element.getTagName(), element.getId(), e));
        
        var max_height = "$0px".exec(elems.invoke('getHeight').max());
        
        //hide all and set default height
        elems.invoke('hide').invoke('setStyle', {height: max_height});
        elems[first_open].show(); //show first
      }.bind(this));
    }.bind(this));
    //fire event
    this.on_create();
  },
  on: function(event) {
    var element = event.element(),
        tag     = element.getTagName(),
        classes = element.classes();
      
    this.binded.each(function(hash) {
      var to = hash.get('to');
      hash.get('from').each(function(from, current_index) {
        var tmp  = from.split('.'),
            t0   = tmp.first(),
            c0   = tmp.second();
      
        if ((tag == t0) && classes.include(c0)) {
          var current = element, 
              current_b, 
              index,
              from0 = this.element.select(from),
              to0   = this.element.select(to);
          from0.each(function(e, i) {
            if (e == element) {
              index = i; 
            }
          });
          current_b = $$(to[current_index])[index];

          this.open(current, current_b, from0, to0);
        }
      }.bind(this));  
    }.bind(this));  
  },
  
  //current_element, binded_element, from_group, to_group
  open: function(current, current_b, from, to) { 
    
    if (!current_b.visible()) {
      to.invoke('hide');
      current_b.show();
    }
    
  }
});





/** section: Widget, related to: Tabs
 *  
 *  Tabs implemented
 *  
 *  Options: 
 *   - first_open(Integer): first open element
 *   - on (String): event for open/close elements
 *   - events(Object): callbacks for events
 *   - config(String): html view for widget.
 *
 *  Events:
 *   - on_create
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *  
 *
 *
**/


var Tabs = Class.create(Widget, {
  setup: function() {
    this.setting = {
      first_open : 0,
      on         : "click",
      events     : {},
      config     : "(div \
                      (ul.nav.nav-tabs \
                        (li(a~1(*))) \
                      ) \
                      (div.tab-content  \
                        (div.tab-pane*.tab-pane!1(*)) \
                      )  \
                    )"
    };
  },
  create: function($super) {
    this.binded = $super().binded;

    var element    = this.element,
        width      = this.setting.width,
        first_open = this.setting.first_open;
    
    this.binded.each(function(hash) {
      hash.get('to').each(function(e) {
        var elems = $$("$0#$1 $2".exec(element.getTagName(), element.getId(), e));
        
        elems.invoke('hide');
        elems[first_open].show();
      }.bind(this));
    }.bind(this));

    this.on_create(); //TODO bind this
  },
  on: function(event) {
    var element = event.element(),
        tag     = element.getTagName(),
        classes = element.classes();
    
    this.binded.each(function(hash) {
      var to = hash.get('to');
      
      hash.get('from').each(function(from, current_index) {
        var tmp  = from.split('.'),
            t0   = tmp.first(),
            c0   = tmp.second();
        
        if ((tag == t0)) { //classes ?
          var current = element, 
              current_b, 
              index,
              from0 = this.element.select(from),
              to0   = this.element.select(to);
          from0.each(function(e, i) {
            if (e == element) {
              index = i; 
            }
          });
          current_b = $$(to[current_index])[index];

          this.open(current, current_b, from0, to0);
        }
      }.bind(this));  
    }.bind(this)); 
  },
  
  //current_element, binded_element, from_group, to_group
  open: function(current, current_b, from, to) { 
    if (!current_b.visible()) {
      var parents_from = current.ancestors().first();
      parents_from.siblings().invoke('removeClassName', 'active');
      parents_from.addClassName('active');
      
      to.invoke('hide')
      .invoke('removeClassName', 'in')
      .invoke('removeClassName', 'active');
      current_b.show().addClassName('in').addClassName('active');
    }
  }
});
/** section: Widget, related to: Window
 *  
 *  Window implemented
 *  
 *  Options: 
 *   - backdrop(Boolean): Create  a modal-backdrop element.
 *   - keyboard(Boolean): close widget on `ESC` press
 *   - show(Boolean): Shows the modal when initialized.
 *   - remote(Boolean|String): Load from `path` and include in `content`.
 *   - on (String): event for open/close elements
 *   - events(Object): callbacks for events
 *   - config(String): html view for widget.
 *
 *  Events:
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *   - show 
 *   - hide
 *
**/


var Window = Class.create(Widget, {
  setup: function() {
    this.setting = {
      backdrop   : true,
      keyboard   : true, 
      on         : "click",
      show       : true,
      remote     : false, //or path 
      events     : {},
      config     : "(div.modal                 \
                      (div.modal-dialog         \
                        (div.modal-content      \
                          (div.modal-header     \
                            (button.close(*))   \
                            (h4.modal-title(*)) \
                          )                     \
                          (div.modal-body(*))   \
                          (div.modal-footer(*)) \
                        )                       \
                      )                         \
                    )"
    };
    this.events = $w("show hide");
    this._fadeClass = "fade";
    this._isShow = null;
  },
  create: function($super) {
    this.binded = $super().binded;
    var element = this.element,
           self = this;

    if (this.setting.keyboard) {
      $(document.body).observe("keyup", function(event) {
        var element = event.element();
        if (event.keyCode == Event.KEY_ESC) {
          self.hide();
        }
      });
    }
      
    if (this.setting.show) {
      element.removeClassName(this._fadeClass);
      this._isShow = true;
    } else {
      element.addClassName(this._fadeClass);
      this._isShow = false;
    }
  },
  on: function(event) {
    var element = event.element(),
        tag     = element.getTagName(),
        classes = element.classes();

    if (tag == "button" && classes.include("close")) {
      this.hide();
    }    

  },
  show: function() {
    this._isShow = true;
    this._modale();

    this.on_show();
  },
  hide: function() {
    this._isShow = false;
    this._modale();

    this.on_hide();
  },
  _modale: function () {
    var id = "$0-$1".exec(this.element.getId(), "modal");
    
    if (this._isShow) { //when show
      this.element.removeClassName(this._fadeClass);
      var modal = new Element("div", {"id": id})
      .addClasses("modal-backdrop", "fade", "in");
      $(document.body).insert(modal);
    } else {
      this.element.addClasses(this._fadeClass);
      $(id).remove();
    }
  }
});







/** section: Widget, related to: ProgressBar
 *  
 *  ProgressBar implementation.
 *
 *  Options:
 *   - width (String): width for progressbar, default: 60%
 *   - step  (Integer): step in percent
 *   - events (Object) : callback for events
 *   - config (String): default config for translate to html.
 *      default: "(div.bar)"   
 *   
 *  Events:
 *   - increment (on_increment)
 *   - decrement (on_decrement)
 *
 *  Open methods:
 *   - increment
 *   - decrements  
 *  
 *  #### Example  
 *    <div id="progress"></div>
 *   
 *    var prb = new ProgressBar("progress");
 *
 *
**/
 
var ProgressBar = Class.create(Widget, {
  setup: function() {
    this.setting = {
      width  : "60%",      // default width   
      step   : 10,         // in percent
      events : {},         // callbacks for events
      config : "(div.bar)" // default structure
    };
    this.events = $w("increment decrement");
  },
  create: function($super) {
    var html = $super();

    this.bar = html.element;
    
    this.bar.setStyle({'width':this.setting.width});
    this.element.insert(this.bar);
    this.step = this.element.getWidth()*this.setting.step/100;
  },
  increment: function() {
    var w  = this.bar.getWidth();
    var nw = "$0px".exec(parseInt(this.step+w));
    this.bar.setStyle({"width":nw});
    this.on_increment(nw);
  },
  decrement: function() {
    var w  = this.bar.getWidth();
    var nw = "$0px".exec(parseInt(w-this.step));
    this.bar.setStyle({"width":nw});
    this.on_decrement(nw);
  }
});
/** section: Widget, related to: Tooltip
 *  
 *  Tooltip implemented
 *  
 *  Options: 
 *    - animation(Boolean) : css animation for show\hide tooltip 
 *    - html(Boolean)      : insert HTML into tooltip
 *    - placement(String)  : Position "top | bottom | right | left | auto"
 *    - selector(Boolean)  : target 
 *    - title(String)      : title for tooltip     
 *    - trigger(Array)     : how tooltip is triggered 
 *    - delay(Number)      : Time for show\hide
 *    - container(String)  : Element for append tooltip
 *    - config(String)     : html view for widget 
 *    - events(Object)     : callbacks for events
 *
 *  Events:
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *  
 *
 *
**/

var Tooltip = Class.create(Widget, {
  setup: function() {
    this.setting = {
      animation : false, 
      html      : false,
      placement : "top", //"top | bottom | right | left | auto"
      selector  : false, // 
      title     : "tooltip",     
      trigger   : $w("mouseenter mouseleave"), 
      delay     : 0,
      container : false, // or Element
      config    : "(div.tooltip    \
                     (div.tooltip-arrow) \
                     (div.tooltip-inner) \
                   )", 
      events    : {}
    };

    this.main_class = "tooltip";
    this.events = $w("show hide");
    this.setting["on"] = this.setting.trigger;
    
    this._show = false;
    this._complete;
  },
  create: function($super) {
    var html = $super().element;
    this._complete = false;
    this.html = html;
  },
  on: function(event) {
    if (!this._show)
      this.show();
    else
      this.hide();
  }, 
  show: function(element) {
      var html = this.html;

      if (!this._complete) {
        var container = this.setting.container,
            title = this.setting.title;

        if (container) {
          container.insert(html);
        } else {
          this.element.insert({after: html});
        }

        if (this.setting.animation) {
          html.addClassName("fade");
        }

        if (this.setting.html) {
          title = title.unescapeHTML();  
        } 
        html.down(1).insert(title);

        this._set_position(html);  
        html.addClasses(this.setting.placement, this.main_class); 
        this._complete = true;
      }  
      html.addClassName("in");
      this._show = true;
      this.on_show();
  },
  hide: function() {
    this.html.removeClassName("in");
    this._show = false;
    this.on_hide();
  },

  _set_position: function(html) {
    //TODO detect auto
    
    html.setStyle({ top: 0, left: 0, display: 'block' });
    
    var min = 10; //magic constant :)
    var left, top;
    var elem_layout = new Element.Layout(this.element);
    var arrow = new Element.Layout(this.html.select(".tooltip-arrow").first());
    var html0 = new Element.Layout(this.html);
    
    var arrow_w = arrow.get("width"),
        arrow_h = arrow.get("height"),
        arrow_mx = arrow.get("margin-left");

    var elem_x  = elem_layout.get('left'),
        elem_y  = elem_layout.get('top'),
        elem_mx = elem_layout.get('margin-left'),
        elem_my = elem_layout.get('margin-top'),
        elem_w  = elem_layout.get('width'),
        elem_mw = elem_layout.get('margin-right'),
        elem_h  = elem_layout.get('height'), 
        elem_wh = elem_layout.get('margin-bottom');
    
    var w0 = elem_layout.get('width'),
        h0 = elem_layout.get('height'),
        w1 = html0.get('width'),
        h1 = html0.get('height'),
        ml = html0.get('margin-left'),
        mr = html0.get('margin-right'),
        mt = html0.get('margin-top'),
        mb = html0.get('margin-bottom');

    switch(this.setting.placement) {
      case "top": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_y - 4*min; 
        break;

      case "bottom": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_h + elem_y + min;   
        break;

      case "left": 
        top  = elem_y + h0/2 - h1/4;
        left = elem_x - w1 - arrow_w - arrow_mx - mr - elem_mx; 
        break; 
        
      case "right":
        top  = elem_y + h0/2 - h1/4;
        left = elem_x + w0 + 2.5*min; 
        break;    
    }
    
    html.setStyle({top: "$0px".exec(top), left: "$0px".exec(left)});
  }
});
/** section: Widget, related to: Popover
 *  
 *  Popover implemented
 *  
 *  Options: 
 *    - animation(Boolean) : css animation for show\hide tooltip 
 *    - html(Boolean)      : insert HTML into tooltip
 *    - placement(String)  : Position "top | bottom | right | left | auto"
 *    - selector(Boolean)  : target 
 *    - title(String)      : title for tooltip     
 *    - trigger(Array)     : how tooltip is triggered 
 *    - delay(Number)      : Time for show\hide
 *    - container(String)  : Element for append tooltip
 *    - config(String)     : html view for widget 
 *    - events(Object)     : callbacks for events
 *
 *  Events:
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *  
 *
 *
**/



var Popover = Class.create(Widget, {

  setup: function($super) {
    this.setting = {
      animation : false, 
      html      : false,
      placement : "top", //"top | bottom | right | left | auto"
      selector  : false, // 
      title     : "popover",     
      trigger   : "click", 
      delay     : 0,
      container : false, // or Element
      config    : "(div.popover \
                      (div.arrow) \
                      (h3.popover-title) \
                      (div.popover-content)\
                    )", 
      events    : {}
    };
    this.main_class = "popover";
    this.events = $w("show hide");
    this.setting["on"] = this.setting.trigger;
    
    this._show = false;
    this._complete;
  },
  create: function($super) {
    var html = $super().element;
    this._complete = false;
    this.html = html;
  },
  on: function(event) {
    if (!this._show)
      this.show();
    else
      this.hide();
  }, 
  show: function(element) {
      var html = this.html;

      if (!this._complete) {
        var container = this.setting.container,
            title = this.setting.title;

        if (container) {
          container.insert(html);
        } else {
          this.element.insert({after: html});
        }

        if (this.setting.animation) {
          html.addClassName("fade");
        }

        if (this.setting.html) {
          title = title.unescapeHTML();  
        } 
        html.down(1).insert(title);

        this._set_position(html);  
        html.addClasses(this.setting.placement, this.main_class); 
        this._complete = true;
      }  
      html.addClassName("in");
      this._show = true;
      this.on_show();
  },
  hide: function() {
    this.html.removeClassName("in");
    this._show = false;
    this.on_hide();
  },

  _set_position: function(html) {
    //TODO detect auto
    
    html.setStyle({ top: 0, left: 0, display: 'block' });
    
    var min = 10; //magic constant :)
    var left, top;
    var elem_layout = new Element.Layout(this.element);
    
    var elem_x = elem_layout.get('left') + elem_layout.get('margin-left'),
        elem_y = elem_layout.get('top') + elem_layout.get('margin-top'),
        elem_w = elem_layout.get('width') + elem_layout.get('margin-right'),
        elem_h = elem_layout.get('height') + elem_layout.get('margin-bottom');

    var w0 = elem_layout.get('width'),
        h0 = elem_layout.get('height'),
        w1 = html.getWidth(),
        h1 = html.getHeight();

    switch(this.setting.placement) {
      case "top": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_y - 6*min; 
        break;

      case "bottom": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_h + elem_y + min;   
        break;

      case "left": 
        top  = elem_y + h0 - h1/2;
        left = elem_x - w1; 
        break; 
        

      case "right":
        top  = elem_y + h0 - h1/2;
        left = elem_x + w0 + 2.5*min; //?
        break;    
    }
    
    html.setStyle({top: "$0px".exec(top), left: "$0px".exec(left)});
  }
});










