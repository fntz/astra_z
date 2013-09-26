var MyTabs = Class.create(Widget, {
  setup: function() {
   this.setting = {
     firstOpen: 0, // customize firstly opened tab
     events: {},   // object contatin functions what called when event fired [on_open, on_close] for us.
     on: "click",  // event when widget change state
     //and our dsl
      config: "(div\
                 (div.tabs \
                   (h4.tab~1.tab*(*))) \
                   (div.panels (div.panel!1.panel*(*))\
                 )\
               )"      
    }
       
    this.events = ["open", "close"]; //our events, will be fired when panel open or close
  },

  create : function($super) { //$super for call parent method
    var zElement  = $super(); // we call parent method, which Translate our `config` dsl into `ZElement` object
    
    //firstOpen impl
    this.binded = zElement.binded.first(); //it's return Hash with groups of panels and tabs in our example;
    //binded["to"]   - it's panels;
    //binded["from"] - it's tabs
    
    //firstly close all panels
    var to = this.element.select(this.binded.get("to").first());
    to.invoke("hide");
    //and open specified in the setting
    to[this.setting.firstOpen].show();  
    
    this.to = to;
    this.from = this.element.select(this.binded.get("from").first());
  },

  on: function(event) {
    var element = event.element(); //get element.
    //invoke only clicking in `to` (h4.tab) element 
    if (this.from.include(element)) {
      //find in `binded` our element
      var index = this.from.indexOf(element); 
      var willBeOpened  = this.to[index];
      
      //and now, when it hidden we should open it
      //and close current element
      var current = this.to.detect(Element.visible);
      
      this.close(current);
      this.open(willBeOpened);
    }
  },

  open: function(element) {
    element.show();
    this.on_open(this, element); //automaticly created
  },

  close: function(element) {
    element.hide();
    this.on_close(this, element);
  }
});