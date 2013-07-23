var ProgressBar = Class.create(Widget, {
  setup: function() {
    this.setting = {
      width  : "60%", 
      step   : 10, 
      events : {}
    };
  },
  create: function($super) {
    var html = $super(ProgressBar);
    this.bar = html.element;
    
    this.bar.setStyle({'width':this.setting.width});
    this.element.insert(this.bar);
    this.step = this.element.getWidth()*this.setting.step/100;
  },
  increment: function() {
    var w  = this.bar.getWidth();
    var nw = "$0px".exec(parseInt(this.step+w));
    this.bar.setStyle({"width":nw});
  },
  decrement: function() {
    var w  = this.bar.getWidth();
    var nw = "$0px".exec(parseInt(w-this.step));
    this.bar.setStyle({"width":nw});
  }
});
ProgressBar.config = "(div.bar)"







