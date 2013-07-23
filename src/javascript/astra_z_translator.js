
var c = function(m){console.log(m)};


var ZElement = Class.create(Delegatable, {
  initialize: function(element, attrs) {
    this.element = new Element(element, attrs || {});
    this.binded  = [];

    this.delegate("element", 
                  "addClassName", 
                  "writeAttribute",
                  "descendants");
  },
  insert: function(z) {
    this.element.insert(z.element);
  }
})
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
        } else {
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
      
      else if (current == "#") {
        if (next.isWorld()) {
          element.writeAttribute({'id': next})
        } else {
          throw "Expected `id attr`, but given `$0`".exec(next);
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
      return root;
    }
  }
};
