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
}

/** section: Language, related to: Array
 *  
 *  Array#empty -> bool
 *  
 *  #### Example
 *
 *  [1,2,3].empty();
 *  // -> false
 *  [].empty(); 
 *  // -> true 
 *
**/
Array.prototype.empty = function() {
  return this.length == 0;
}

Hash.addMethods({
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
 *  Return true when String is world, otherwase - false.
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

  return !/\W/.match(this.toString());
}

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
