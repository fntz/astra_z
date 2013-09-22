/** section: Widget, related to: Accordion
 *  
 *  Accordion implemented
 *  
 *  Options: 
 *   - first_open(Integer): first open element
 *   - all_closed(Boolean): All panels can be collapsed
 *   - on (String): event for open/close elements
 *   - events(Object): callbacks for events
 *   - config(String): html view for widget.
 *
 *  Events:
 *   - on_create
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *  
 *
 *
**/

var Accordion = Class.create(Widget, {
  setup: function() {
    this.setting = {
      first_open : 0,
      all_closed : false, //pending
      on         : "click",
      events     : {},
      config     : "(div.accordion#accordion \
                      (div.accordion-group* \
                        (div.accordion-heading \
                          (a.accordion-toggle~1 (*)) \
                        ) \
                        (div.accordion-body!1.collapse.in (*)) \
                      ) \
                    )"
    };
  },
  create: function($super) {
    this.binded = $super().binded;
    
    var element    = this.element,
        width      = this.setting.width,
        first_open = this.setting.first_open;

    this.binded.each(function(hash) {
      hash.get('to').each(function(e) {
        var elems = $$("$0#$1 $2".exec(element.getTagName(), element.getId(), e));
        
        var max_height = "$0px".exec(elems.invoke('getHeight').max());
        
        //hide all and set default height
        elems.invoke('hide').invoke('setStyle', {height: max_height});
        elems[first_open].show(); //show first
      }.bind(this));
    }.bind(this));
    //fire event
    this.on_create();
  },
  on: function(event) {
    var element = event.element(),
        tag     = element.getTagName(),
        classes = element.classes();
      
    this.binded.each(function(hash) {
      var to = hash.get('to');
      hash.get('from').each(function(from, current_index) {
        var tmp  = from.split('.'),
            t0   = tmp.first(),
            c0   = tmp.second();
      
        if ((tag == t0) && classes.include(c0)) {
          var current = element, 
              current_b, 
              index,
              from0 = this.element.select(from),
              to0   = this.element.select(to);
          from0.each(function(e, i) {
            if (e == element) {
              index = i; 
            }
          });
          current_b = $$(to[current_index])[index];

          this.open(current, current_b, from0, to0);
        }
      }.bind(this));  
    }.bind(this));  
  },
  
  //current_element, binded_element, from_group, to_group
  open: function(current, current_b, from, to) { 
    
    if (!current_b.visible()) {
      to.invoke('hide');
      current_b.show();
    }
    
  }
});





