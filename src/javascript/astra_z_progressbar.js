var ProgressBar = Class.create(Widget, {
  setup: function() {
    this.setting = {
      width  : "60%",      // default width   
      step   : 10,         // in percent
      events : {},         // callbacks for events
      config : "(div.bar)" // default structure
    };
    this.events = $w("increment decrement");
  },
  create: function($super) {
    var html = $super();

    this.bar = html.element;
    
    this.bar.setStyle({'width':this.setting.width});
    this.element.insert(this.bar);
    this.step = this.element.getWidth()*this.setting.step/100;
  },
  increment: function() {
    var w  = this.bar.getWidth();
    var nw = "$0px".exec(parseInt(this.step+w));
    this.bar.setStyle({"width":nw});
    this.on_increment(nw);
  },
  decrement: function() {
    var w  = this.bar.getWidth();
    var nw = "$0px".exec(parseInt(w-this.step));
    this.bar.setStyle({"width":nw});
    this.on_decrement(nw);
  }
});








