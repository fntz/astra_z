var c =function(m){ console.log(m);};
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
