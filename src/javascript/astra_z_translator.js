
var c = function(m){console.log(m)};


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
  },
  build: function(original) {
    //pending
    /*
    var original = $(original);

    var self = this.element;
    var descendants = [this.element, this.element.descendants()].flatten();
    var orig_descendants = [original, original.descendants()].flatten();


    data_repeat = descendants.findAll(function(e) { 
      return e.hasAttribute("data-repeat");
    });
/*
    var o = [];
    data_repeat.each(function(e) {
      var t0 = $(e.ancestors().first()).getTagName();
      var find = "$0 > $1".exec(t0, e.getTagName());
      

    });
*/
/*    
    var o = [];
    data_repeat.each(function(dr) {
      for(var i = 0, e, l = orig_descendants.size(); i < l; i++) {
        e = orig_descendants[i];


      }
    });  
*/
/*
    var i = 0, j = 0, k = [];
    var e0, e1;
    while(true) {
      e1 = descendants[i]; //self
      e0 = orig_descendants[i];//orig

      if (e1.hasAttribute("data-repeat")) {
        k.push([e1, i]);
      }


      break;
    }
    */
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
          
          if (last) {
            elements.last().insert(element);
          }  
          else {
            root = element;
          }  
          elements.push(element);
        } 
        else if (next == "*") {
          continue;
        }

        else {
          throw "Expected <tag> or `*` but $0 given".exec(next);  
        }
      }

      else if (current == ")") {
        end_element ++ ;
        if (tokens[i-2] != "(")
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
        var preprev = tokens[i-2];
        
        if (prev.isWorld()) {

          var hash = group_a.detect(function(hash) {
            return hash.keys().first() == next; 
          }) || $H();
          var new_hash = $H({});
          if (preprev == "(") //when tag
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

      else if (current == "!") {
        var preprev = tokens[i-2];

        if (prev.isWorld()) {
          var hash = group_b.detect(function(hash) {
            return hash.keys().first() == next; 
          }) || $H();
          var new_hash = $H({});
          
          if (preprev == "(") //when tag
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
      
      else if (current == "#") {
        if (next.isWorld()) {
          element.writeAttribute({'id': next})
        } else {
          throw "Expected `id attr`, but given `$0`".exec(next);
        }
      }
      // (*) | (tag*) | (tag.className*)
      else if (current == "*") {
        if (!element) 
          throw "Element not found";
        
        
        //(*)
        if (prev == "(" && next == ")") { 
          element.writeAttribute("data-break", "1");
        } 
        //(tag*) | (tag.class*)
        else if (prev.isWorld()) { 
          //when prev is tag data-repeat <tag>
          //when prev is class name data-repeat <tag>.className
          //otherwise error
          var repeat = element.readAttribute("data-repeat") || "";
          var preprev = tokens[i-2];

          if (preprev == ".")
            if (repeat.blank())   
              repeat = "$0.$1".exec(element.tagName(), prev);
            else
              repeat += ".$0".exec(prev);
          else if (preprev == "(")
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
