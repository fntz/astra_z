
var Tooltip = Class.create(Widget, {
  setup: function() {
    this.setting = {
      animation : false, //effects.js depends
      html      : false,
      placement : "top", //"top | bottom | right | left | auto"
      selector  : false, // 
      title     : "tooltip",     
      trigger   : $w("mouseenter mouseleave"), 
      delay     : 0,
      container : false, // or Element
      config    : "(div.tooltip    \
                     (div.tooltip-arrow) \
                     (div.tooltip-inner) \
                   )", 
      events    : {}
    };
    
    this.events = $w("show hide");
    this.setting["on"] = this.setting.trigger;
    
    this._show = false;
    this._complete;
  },
  create: function($super) {
    var html = $super().element;
    this._complete = false;
    this.html = html;
  },
  on: function(event) {
    if (!this._show)
      this.show();
    else
      this.hide();
  }, 
  show: function(element) {
      var html = this.html;

      if (!this._complete) {
        var container = this.setting.container,
            title = this.setting.title;

        if (container) {
          container.insert(html);
        } else {
          this.element.insert({after: html});
        }

        if (this.setting.animation) {
          html.addClassName("fade");
        }

        if (this.setting.html) {
          title = title.unescapeHTML();  
        } 
        html.down(1).insert(title);

        this._set_position(html);  
        html.addClassName(this.setting.placement); 
        this._complete = true;
      }  
      html.addClassName("in");
      this._show = true;
      this.on_show();
  },
  hide: function() {
    this.html.removeClassName("in");
    this._show = false;
    this.on_hide();
  },

  _set_position: function(html) {
    //TODO detect auto
    
    html.setStyle({ top: 0, left: 0, display: 'block' });
    
    var min = 10; //magic constant :)
    var left, top;
    var elem_layout = new Element.Layout(this.element);
    
    var elem_x = elem_layout.get('left') + elem_layout.get('margin-left'),
        elem_y = elem_layout.get('top') + elem_layout.get('margin-top'),
        elem_w = elem_layout.get('width') + elem_layout.get('margin-right'),
        elem_h = elem_layout.get('height') + elem_layout.get('margin-bottom');

    var w0 = elem_layout.get('width'),
        h0 = elem_layout.get('height'),
        w1 = html.getWidth(),
        h1 = html.getHeight();

    switch(this.setting.placement) {
      case "top": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_y - 4*min; //why 4*min ?
        break;

      case "bottom": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_h + elem_y + min;   
        break;

      case "left": 
        top  = elem_y + h0/2 - h1/4;
        left = elem_x - w1; 
        break; 
        

      case "right":
        top  = elem_y + h0/2 - h1/4;
        left = elem_x + w0 + 2.5*min; //?
        break;    
    }
    
    html.setStyle({top: "$0px".exec(top), left: "$0px".exec(left)});
  }
});