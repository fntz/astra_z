var c =function(m){ console.log(m);};


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
