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



























