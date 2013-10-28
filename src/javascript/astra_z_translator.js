var ZElement = Class.create(Delegatable, {
  initialize: function(element, attrs) {
    this.element = new Element(element, attrs || {});
    this.elements = [];
    this.binded  = [];
    this.delegate("element", 
                  "addClassName", 
                  "writeAttribute",
                  "readAttribute",
                  "descendants");
  },
  insert: function(z) {
    this.elements.push(z);
    this.element.insert(z.element);
  },
  tagName: function() {
    return this.element.tagName.downcase();
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
   
    var Z = Class.create(Delegatable, {
      initialize: function() {
        this._end_element   = 0;
        this._begin_element = 0;
        this._elements = [];
        this._root = null;
        this._element;

        this.delegate("_elements", "last", "push", "pop");

        var g = {
          star  : "*",
          tilde : "~",
          sharp : "#",
          dot   : ".",
          bang  : "!",
          rb    : ")",
          lb    : "("
        };

        $H(g).eachPair(function(k, v) {
          this[k] = v;
        }.bind(this));
      },
      root: function(root) {
        if (root)
          this._root = root;
        else
          return this._root;
      },
      element: function(e) {
        if (e) 
          this._element = e;
        else
          return this._element;
      },
      end: function() {
        this._end_element++;
      },
      begin: function() {
        this._begin_element++;
      },
      get_begin: function() {
        return this._begin_element;
      },
      get_end: function() {
        return this._end_element;
      }  
    });

    var z = new Z();

    var group_a = [],
        group_b = [],
        element;

    for(var i = 0, n = i+1, p = i - 1, 
            length = tokens.length, 
            prev, current, next, preprev; 
            i < length; 
            i ++, n ++, p ++) {
      
      next    = tokens[n];
      current = tokens[i];
      prev    = tokens[p];
      preprev = tokens[i-2];

      if (current == z.lb) { 
        z.begin();
        if (next.isWorld()) {
          element = new ZElement(next);
          var last = z.last();
          
          if (last) {
            z.last().insert(element);
          }  
          else {
            z.root(element);
          }  
          z.push(element);
        } 
        else if (next == z.star) {
          continue;
        }
        else {
          throw "Expected <tag> or `*` but $0 given".exec(next);  
        }
      }

      else if (current == z.rb) {
        z.end() ;
        if (preprev != z.lb)
          z.pop();
      } 

      else if (current.isWorld()) {
        if (prev.isWorld()) {
          throw "Unexpected `$0`".exec(current);
        } 
        else {
          continue;
        }
      } 
      
      else if (current == z.dot) {
        if (next.isWorld()) {
          element.addClassName(next);
        } else {
          throw "Expected `class name`, but given `$0`".exec(next);
        }
      }

      else if (current == z.tilde) {
        if (prev.isWorld()) {

          var hash = group_a.detect(function(hash) {
            return hash.keys().first() == next; 
          }) || $H();
          var new_hash = $H({});
          if (preprev == z.lb) //when tag
            new_hash.set(next, ["$0".exec(prev)]);
          else 
            new_hash.set(next, ["$0.$1".exec(element.tagName() ,prev)]);
          hash.updateWith(new_hash, function(v1, v2) {
            var v = v1.concat(v2);
            return v;
          });
          group_a.push(hash)
        } else {
          throw "Unexpected `$0` before bind `$1`".exec(prev, current);
        }
      }

      else if (current == z.bang) {
        
        if (prev.isWorld()) {
          var hash = group_b.detect(function(hash) {
            return hash.keys().first() == next; 
          }) || $H();
          var new_hash = $H({});
          
          if (preprev == z.lb) //when tag
            new_hash.set(next, ["$0".exec(prev)]);
          else 
            new_hash.set(next, ["$0.$1".exec(element.tagName() ,prev)]);
          
          hash.updateWith(new_hash, function(v1, v2) {
            var v = v1.concat(v2);
            return v;
          });
          group_b.push(hash)
        } else {
          throw "Unexpected `$0` before bind `$1`".exec(prev, current);
        }
      }    
      
      else if (current == z.sharp) {
        if (next.isWorld()) {
          element.writeAttribute({'id': next})
        } else {
          throw "Expected `id attr`, but given `$0`".exec(next);
        }
      }
      // (*) | (tag*) | (tag.className*)
      else if (current == z.star) {
        if (!element) 
          throw "Element not found";
        
        //(*)
        if (prev == z.lb && next == z.rb) { 
          element.writeAttribute("data-break", "1");
        } 
        //(tag*) | (tag.class*)
        else if (prev.isWorld()) { 
          //when prev is tag data-repeat <tag>
          //when prev is class name data-repeat <tag>.className
          //otherwise error
          var repeat = element.readAttribute("data-repeat") || "";
          
          if (preprev == z.dot)
            if (repeat.blank())   
              repeat = "$0.$1".exec(element.tagName(), prev);
            else
              repeat += ".$0".exec(prev);
          else if (preprev == z.lb)
            repeat = prev;
          else 
            throw "Unexpected $0".exec(current);

          element.writeAttribute("data-repeat", repeat);
        } 
        else {
          throw "Unexpected `$0` between `$1` and `$2`".exec(current, prev, next);
        }
        
      }

      else {
        throw "Unexpected $0".exec(current);
      }
    }
    

    if (z.get_begin() != z.get_end()) { 
      z.root(null);
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
          
          z.root().binded.push(new_hash)
        }
      }     
      return z.root();
    }
  }
};
