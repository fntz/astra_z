

var Accordion = Class.create(Widget, {
	setup: function() {
		this.setting = {
			first_open : 0,
			all_closed : false,
			on         : "click",
			events     : {}
		};
		this.classes = {};
	}
});


<div id="astra-z-accordion">
  <h3 class="header">#1</h1>
  <div class="content">123</div>
  <h3 class="header">#2</h1>
  <div class="content">123</div>     
  <h3 class="header">#3</h1>
  <div class="content">123</div>
</div>  




