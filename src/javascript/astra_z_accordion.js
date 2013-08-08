

var Accordion = Class.create(Widget, {
  setup: function() {
    this.setting = {
      first_open : 0,
      all_closed : false,
      on         : "click",
      events     : {},
      config     : "(div.accordion#accordion \
                      (div.accordion-group* \
                        (div.accordion-heading \
                          (a.accordion-toggle!1 (*)) \
                        ) \
                        (div.accordion-body~1.collapse.in (*)) \
                      ) \
                    )"
    };
  },
  create: function($super) {
    var z = $super();
    this.binded = z.binded;
    c(this.binded)
    
  },
  on: function(event) {
    c(event.element())  
  }
});





