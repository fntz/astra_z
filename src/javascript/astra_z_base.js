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
    this.bind_event();
  },
  create: function() { //TODO: take config, config from setting
    var html = Translator.translate(this.setting.config);
    return html;
  },
  bind_event: function() {
    if (this.setting.on) {
      var handler = this.on.bind(this);
      this.element.observe(this.setting.on, handler);
    }
  },
  on: function(event) {
    
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



























