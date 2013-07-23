var c = function(m){console.log(m);};
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


var Widget = Class.create(EventsModule, {
  initialize: function(element, setting, classes) {
    this.element = $(element);

    if (!Object.isElement(this.element))
      throw "Element #{e} not found.".interpolate({e: element});

    Object.extend(this.setting, setting || {});
    Object.extend(this.classes, classes || {});

    this.create(this.html);
  },
  create: function(klass) {
    var html = Translator.translate(klass.config);
    return html;
  }
}); 

Widget.prototype.initialize = Widget.prototype.initialize.wrap(
    function(func) {
      this.events = $w('create destroy add remove open close');
      this.setup();
      this.create_events();
      return func.apply(this, $A(arguments).slice(1));
    }
);



























