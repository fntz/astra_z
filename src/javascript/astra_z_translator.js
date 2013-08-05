
var c = function(m){console.log(m)};


var ZElement = Class.create(Delegatable, {
  initialize: function(element, attrs) {
    this.element = new Element(element, attrs || {});
    this.elements = [];
    this.binded  = [];

    this.delegate("element", 
                  "addClassName", 
                  "writeAttribute",
                  "descendants");
  },
  insert: function(z) {
    this.elements.push(z);
    this.element.insert(z.element);
  },
  build: function(original) {
    var original = $(original);

    //e1 - original
    //e2 - this
    var diff_attrs = function(original, scheme) {
      var orig = original.getAttributes(),
          self = scheme.getAttributes();

      var keys = Object.keys(self);
      for(var i = 0, l = keys.size(), value, key; i<l;i++) {
        key   = keys[i];
        value = self[key];
        if (key == "data")
          continue;
        if (key == "class") {
          value.each(function(k){ original.addClassName(k); });
        } else {
          original.writeAttribute(key, value);
        }      
      }        
    };

    var need = this.element.descendants();
    var have = original.descendants();

    var i = 0, j = 0, k = [];

    while(true) {
      var current = need[i], 
          orig    = have[j];
      
      if (!orig || !current) {
        break;
      }
    
      if (current.hasAttribute("data-repeat")) {
        k.push(i);
        i = k.pop();
      }
            
      diff_attrs(orig, current)

      i++;
      j++;

      if (current.hasAttribute("data-more")) {
        i = 0;  
      }

      if (i > need.size() || j > have.size()) {
        break;
      }
      
    } 
    

  }
});



/** section Modules  
 *  
 *  Provides base interface for creation elements from String
 *  with given rules.
 *
 *  #### Example
 *  
 *  var z = "(div.class1#id1)";
 *  Translator.translate(z); 
 *  // -> <div class='astra-z-div'> <div class='class1' id='id1'></div></div>  
 *   
**/
var Translator = {

  translate: function(str) {

    var tokens = [];
    
    str.scan(/[a-zA-Z0-9-]+|./, function(s) {
      var t = s.first().strip();
      
      if (!t.blank())
        tokens.push(s.first());
    });
    
    var group_a = [],
        group_b = [];

    var begin_element = 0, 
        end_element = 0,
        elements = [],
        root = null,
        element;

    for(var i = 0, n = i+1, p = i - 1, 
            length = tokens.length, 
            prev, current, next; 
            i < length; 
            i ++, n ++, p ++) {
      
      next    = tokens[n];
      current = tokens[i];
      prev    = tokens[p];

      if (current == "(") { 
        begin_element ++ ;
        
        if (next.isWorld()) {
          element = new ZElement(next);
          var last = elements.last();
          
          if (last)
            elements.last().insert(element);
          else {
            root = element;
          }  
          elements.push(element);
        } 
        else if (next == "*") {
          continue;
        }

        else {
          throw "Expected <tag> but $0 given".exec(next);  
        }
      }

      else if (current == ")") {
        end_element ++ ;
        elements.pop();
      } 

      else if (current.isWorld()) {
        if (prev.isWorld()) {
          throw "Unexpected `$0`".exec(current);
        } 
        else {
          continue;
        }
      } 
      
      else if (current == ".") {
        if (next.isWorld()) {
          element.addClassName(next);
        } else {
          throw "Expected `class name`, but given `$0`".exec(next);
        }
      }

      else if (current == "~") {
        if (prev.isWorld()) {
          var hash = group_a.detect(function(hash) {
            return hash.keys().first() == next; 
          }) || $H();
          var new_hash = $H({});
          new_hash.set(next, [prev]);
          hash.updateWith(new_hash, function(v1, v2) {
            var v = v1.concat(v2);
            return v;
          });
          group_a.push(hash)
        } else {
          throw "Unexpected `$0` before bind `$1`".exec(prev, current);
        }
      }

      else if (current == "!") {
        
        if (prev.isWorld()) {
          var hash = group_b.detect(function(hash) {
            return hash.keys().first() == next; 
          }) || $H();
          var new_hash = $H({});
          new_hash.set(next, [prev]);
          hash.updateWith(new_hash, function(v1, v2) {
            var v = v1.concat(v2);
            return v;
          });
          group_b.push(hash)
        } else {
          throw "Unexpected `$0` before bind `$1`".exec(prev, current);
        }
      }    
      
      else if (current == "#") {
        if (next.isWorld()) {
          element.writeAttribute({'id': next})
        } else {
          throw "Expected `id attr`, but given `$0`".exec(next);
        }
      }
      
      else if (current == "*") {
        if (!element) 
          throw "Element not found";

        //(*)
        if (prev == "(" && next == ")") { 
          element.writeAttribute("data-repeat", "1");
        } 
        //(tag)*
        else if (prev == ")" &&  
          ((next && next.isWorld()) || next == ")" || Object.isUndefined(next))) {
          element.writeAttribute("data-more", "1");
        } 
        else {
          throw "Unexpected `$0` between `$1` and `$2`".exec(current, prev, next);
        }
      }

      else {
        throw "Unexpected $0".exec(current);
      }
    }
    

    if (begin_element != end_element) { 
      root = null;
      throw "Not balance `(` `)`";
    } else {
      var _group_a = group_a.uniq(),
          _group_b = group_b.uniq();
      

      if (!_group_a.isEmpty()){    
        if (_group_a.size() != _group_b.size()) {
          throw "Binded groupd have different size. `$0` and `$1`.\
          Inspect: $2, $3".exec(_group_a.size(), _group_b.size(),
            _group_a.inspect(), _group_b.inspect());
        }
        
        for(var len = _group_a.size(), i = 0, 
                hash, f_value, new_hash, key, value; 
                i < len; i ++) {
          new_hash = new Hash();
          
          key   = _group_a[i].keys().first();
          value = _group_a[i].get(key);
          
          f_value = _group_b.detect(function(hash) {
            return hash.keys().first() == key;
          }).get(key);
          
          new_hash.set("from", value);
          new_hash.set("to", f_value);
          
          root.binded.push(new_hash)
        }
      }    
          
      return root;
    }
  }
};
