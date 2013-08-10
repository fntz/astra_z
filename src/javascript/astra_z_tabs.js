

var Tabs = Class.create(Widget, {
  setup: function() {
    this.setting = {
      first_open : 0,
      on         : "click",
      events     : {},
      config     : "(div \
                      (ul.nav.nav-tabs \
                        (li(a~1(*))) \
                      ) \
                      (div.tab-content  \
                        (div.tab-pane*.tab-pane!1(*)) \
                      )  \
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
        
        elems.invoke('hide');
        elems[first_open].show();
      }.bind(this));
    }.bind(this));

    this.on_create(); //TODO bind this
  },
  on: function(event) {
    var element = event.element(),
        tag     = element.getTagName(),
        classes = element.classes();
      c(this.binded)
    this.binded.each(function(hash) {
      var to = hash.get('to');
      
      hash.get('from').each(function(from, current_index) {
        var tmp  = from.split('.'),
            t0   = tmp.first(),
            c0   = tmp.second();
        
        if ((tag == t0)) { //classes ?
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
      var parents_from = current.ancestors().first();
      parents_from.siblings().invoke('removeClassName', 'active');
      parents_from.addClassName('active');
      
      to.invoke('hide')
      .invoke('removeClassName', 'in')
      .invoke('removeClassName', 'active');
      current_b.show().addClassName('in').addClassName('active');
    }
  }
});