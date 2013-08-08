Element.addMethods({
  isShow: function(element) {
    var e = $(element);
    if (e.style.display != 'none')
      return true;
    return false;
  },
  isHide: function(element) {
    return !element.isShow();
  },
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



var Delegatable = {
    /**
     *  Example
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
      var instance = this[from];
      var self = this;
      $A(arguments).slice(1).each(function(method) {
        var func = instance[method];
        if (!(Object.isUndefined(func) || Object.isFunction(func)))
          throw "Error! Delegate only for methods";
        
        self[method] = function() {
          return func.apply(instance, arguments);
        }; 
      });

    },
    /**
     *  from   - object
     *  as     - Array | String
     *  method - Array | String
     *  Example:
     *     delegate_alias(target, ['a','b','c'], ['x','y','z']); 
    **/
    delegate_alias: function(from, as, method) {
      var as = [as].flatten(),
          method = [method].flatten();
      
      if (as.size() != method.size())
        throw 'Error alias array must be have size equal with target array';

      for (var i=0; i < as.size(); i++) {
        var func = this[from][method[i]];
        if (!(Object.isUndefined(func) || Object.isFunction(func)))
            throw "Error! Delegate only for methods";
        
        this[as[i]] = function() {
          return func.apply(this[from], arguments);
        }; 
      }  
    }
  }
