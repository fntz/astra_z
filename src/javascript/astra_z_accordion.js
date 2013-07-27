

var Accordion = Class.create(Widget, {
	setup: function() {
		this.setting = {
			first_open : 0,
			all_closed : false,
			on         : "click",
			events     : {},
      config     : "(div.accordion-group \
        (div.accordion-heading(a.accordion-toggle)) \
        (div.accordion-body.collapse.in(div.accordion-inner)) \
        )"
		};
		this.classes = {};
	}
});





