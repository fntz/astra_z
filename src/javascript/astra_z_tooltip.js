/** section: Widget, related to: Tooltip
 *  
 *  Tooltip implemented
 *  
 *  Options: 
 *    - animation(Boolean) : css animation for show\hide tooltip 
 *    - html(Boolean)      : insert HTML into tooltip
 *    - placement(String)  : Position "top | bottom | right | left | auto"
 *    - selector(Boolean)  : target 
 *    - title(String)      : title for tooltip     
 *    - trigger(Array)     : how tooltip is triggered 
 *    - delay(Number)      : Time for show\hide
 *    - container(String)  : Element for append tooltip
 *    - config(String)     : html view for widget 
 *    - events(Object)     : callbacks for events
 *
 *  Events:
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *  
 *
 *
**/
var Tooltip = Class.create(Widget, {
  setup: function() {
    this.setting = {
      animation : false, 
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

    this.main_class = "tooltip";
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
        html.addClasses(this.setting.placement, this.main_class); 
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
    var arrow = new Element.Layout(this.html.select(".tooltip-arrow").first());
    var html0 = new Element.Layout(this.html);
    
    var arrow_w = arrow.get("width"),
        arrow_h = arrow.get("height"),
        arrow_mx = arrow.get("margin-left");

    var elem_x  = elem_layout.get('left'),
        elem_y  = elem_layout.get('top'),
        elem_mx = elem_layout.get('margin-left'),
        elem_my = elem_layout.get('margin-top'),
        elem_w  = elem_layout.get('width'),
        elem_mw = elem_layout.get('margin-right'),
        elem_h  = elem_layout.get('height'), 
        elem_wh = elem_layout.get('margin-bottom');
    
    var w0 = elem_layout.get('width'),
        h0 = elem_layout.get('height'),
        w1 = html0.get('width'),
        h1 = html0.get('height'),
        ml = html0.get('margin-left'),
        mr = html0.get('margin-right'),
        mt = html0.get('margin-top'),
        mb = html0.get('margin-bottom');

    switch(this.setting.placement) {
      case "top": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_y - 4*min; 
        break;

      case "bottom": 
        left = elem_x + w0/2 - w1/4; 
        top  = elem_h + elem_y + min;   
        break;

      case "left": 
        top  = elem_y + h0/2 - h1/4;
        left = elem_x - w1 - arrow_w - arrow_mx - mr - elem_mx; 
        break; 
        
      case "right":
        top  = elem_y + h0/2 - h1/4;
        left = elem_x + w0 + 2.5*min; 
        break;    
    }
    
    html.setStyle({top: "$0px".exec(top), left: "$0px".exec(left)});
  }
});
