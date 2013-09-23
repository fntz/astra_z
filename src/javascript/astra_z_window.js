/** section: Widget, related to: Window
 *  
 *  Window implemented
 *  
 *  Options: 
 *   - backdrop(Boolean): Create  a modal-backdrop element.
 *   - keyboard(Boolean): close widget on `ESC` press
 *   - show(Boolean): Shows the modal when initialized.
 *   - remote(Boolean|String): Load from `path` and include in `content`.
 *   - on (String): event for open/close elements
 *   - events(Object): callbacks for events
 *   - config(String): html view for widget.
 *
 *  Events:
 *   - on_open 
 *   - on_close
 *  
 *  Open methods:
 *   - show 
 *   - hide
 *
**/

var Window = Class.create(Widget, {
  setup: function() {
    this.setting = {
      backdrop   : true,
      keyboard   : true, 
      on         : "click",
      show       : true,
      remote     : false, //or path 
      events     : {},
      config     : "(div.modal.in.fade          \
                      (div.modal-dialog         \
                        (div.modal-content      \
                          (div.modal-header     \
                            (button.close(*))   \
                            (h4.modal-title(*)) \
                          )                     \
                          (div.modal-body(*))   \
                          (div.modal-footer(*)) \
                        )                       \
                      )                         \
                    )"
    };
    this.events = $w("show hide");
    this._inClass = "fade";
    this._isShow = null;
  },
  create: function($super) {
    var html = $super();
    this.binded = html.binded;
    var element = this.element,
           self = this;

    if (this.setting.keyboard) {
      $(document.body).observe("keyup", function(event) {
        var element = event.element();
        if (event.keyCode == Event.KEY_ESC) {
          self.hide();
        }
      });
    }
      
    if (this.setting.show) {
      element.style.display = "block";
      this._isShow = true;
    } else {
      this._isShow = false;
    }
  },
  on: function(event) {
    var element = event.element(),
        tag     = element.getTagName(),
        classes = element.classes();

    if (tag == "button" && classes.include("close")) {
      this.hide();
    }    

  },
  show: function() {
    this._isShow = true;
    this._modale();

    this.on_show();
  },
  hide: function() {
    this._isShow = false;
    this._modale();

    this.on_hide();
  },
  _modale: function () {
    var id = "$0-$1".exec(this.element.getId(), "modal");
    
    if (this._isShow) { //when show
      this.element.style.display = "block";
      var modal = new Element("div", {"id": id})
      .addClasses("modal-backdrop", "fade", "in");
      $(document.body).insert(modal);
    } else {
      this.element.style.display = "none";
      this.element.removeClassName(this._fadeClass);
      $(id).remove();
    }
  }
});







