Element.addMethods({
    getTagName: function(t) {
        return t.tagName.downcase();
    },
    getId: function(t) {
        return t.id || null;
    },
    classes: function(t) {
        return $w(t.readAttribute("class"));
    },
    getAttributes: function(t, e) {
        for (var i, s, e = e || !1, n = $H(), o = 0, a = t.attributes, h = a.length; h > o; o++) if (s = a.item(o).nodeName, 
        i = a.item(o).nodeValue, e || ("class" == s && (i = $w(i)), !s.startsWith("data-"))) n.set(s, i); else {
            var r = n.getOrBuild("data", $H({})), c = /data-(.+)/.exec(s).second();
            r.set(c, i);
        }
        return n.toJ();
    },
    removeClasses: function(t) {
        var t = $(t);
        return $A(arguments).slice(1).flatten().each(function(e) {
            t.removeClassName(e);
        }), t;
    },
    addClasses: function(t) {
        var t = $(t);
        return $A(arguments).slice(1).flatten().each(function(e) {
            t.addClassName(e);
        }), t;
    }
}), Array.prototype.second = function() {
    return this[1];
}, Array.prototype.isEmpty = function() {
    return 0 == this.length;
}, Array.prototype.diff = function(t) {
    return this.filter(function(e) {
        return !t.include(e);
    });
}, Hash.addMethods({
    toObj: function() {
        if (this.isEmpty()) return {};
        for (var t, e, i = {}, s = 0, n = this.size(); n > s; s++) t = this.keys()[s], e = this.get(t), 
        i[t] = Object.isHash(e) ? e.toObj() : e;
        return i;
    },
    toJ: function() {
        return this.toObj();
    },
    getOrBuild: function(t, e) {
        var i = this.get(t);
        return i ? i : (this.set(t, e), e);
    },
    getOrElse: function(t, e) {
        var i = this.get(t);
        return i ? i : e || {};
    },
    isEmpty: function() {
        return this.keys().isEmpty();
    },
    eachKey: function(t, e) {
        this.keys().each(t, e);
    },
    eachValue: function(t, e) {
        this.values().each(t, e);
    },
    eachPair: function(t, e) {
        this.each(function(i) {
            t.call(e, i.key, i.value);
        });
    },
    updateWith: function(t, e) {
        if (!Object.isFunction(e)) throw new TypeError();
        if (this.isEmpty()) return this.update(t);
        var i = this.keys(), s = new Hash(t).inject(this, function(t, s) {
            var n = i.include(s.key) ? e(this.get(s.key), s.value) : s.value;
            return t.set(s.key, n), t;
        }.bind(this));
        return s;
    },
    mergeWith: function(t, e) {
        return this.clone().updateWith(t, e);
    }
}), String.prototype.isWorld = function() {
    return this.blank() ? !1 : !/[^A-Za-z0-9_-]/.match(this);
}, String.prototype.downcase = function() {
    return this.toLowerCase();
}, String.prototype.exclude = function(t) {
    return !this.include(t);
}, String.prototype.exec = function() {
    var t = /\$(\d+)/, e = [];
    str = this;
    for (var i = 0, s = arguments.length; s > i; i++) e.push(arguments[i]);
    return this.scan(t, function(t) {
        var i = t.first().strip(), s = parseInt(t.second()), n = e[s];
        if (Object.isUndefined(n)) throw new Error("Element with index `$0` not found in [$1]".exec(s, e));
        str = str.gsub(new RegExp("\\" + i), n);
    }), str;
};

var Delegatable = {
    delegate: function(t) {
        var e = this[t], i = this;
        $A(arguments).slice(1).each(function(t) {
            var s = e[t];
            if (!Object.isFunction(s)) throw "Error! Delegate only for methods";
            i[t] = function() {
                return s.apply(e, arguments);
            };
        });
    },
    delegate_alias: function(t, e, i) {
        var e = [ e ].flatten(), i = [ i ].flatten();
        if (e.size() != i.size()) throw "Error alias array must be have size equal with target array";
        for (var s = 0; s < e.size(); s++) {
            var n = this[t][i[s]];
            if (!Object.isFunction(n)) throw "Error! Delegate only for methods";
            this[e[s]] = function() {
                return n.apply(this[t], $A(arguments));
            };
        }
    }
}, ASTRA_Z = {
    VERSION: "0.0.1"
}, EventsModule = {
    create_events: function() {
        var t = this;
        this.events.each(function(e) {
            var i = "on_$0".exec(e);
            t[i] = function() {
                var t = this.setting[i];
                t && Object.isFunction(t) && t.apply(this, arguments);
            };
        });
    }
}, Widget = Class.create(EventsModule, {
    initialize: function(t, e) {
        if (this.element = $(t), !Object.isElement(this.element)) throw "Element #{e} not found.".interpolate({
            e: t
        });
        Object.extend(this.setting, e || {}), this.create(this.html), this.bind_event();
    },
    create: function() {
        var t = Translator.translate(this.setting.config);
        return t;
    },
    bind_event: function() {
        if (this.setting.on) {
            var t = this.on.bind(this);
            Object.isArray(this.setting.on) ? this.setting.on.each(function(e) {
                this.element.observe(e, t);
            }.bind(this)) : this.element.observe(this.setting.on, t);
        }
    },
    on: function() {
        throw "Abstract. You must implement `on` function for events";
    }
});

Widget.prototype.initialize = Widget.prototype.initialize.wrap(function(t) {
    return this.events = $w("create open close"), this.setup(), this.create_events(), 
    t.apply(this, $A(arguments).slice(1));
});

var Accordion = Class.create(Widget, {
    setup: function() {
        this.setting = {
            first_open: 0,
            all_closed: !1,
            on: "click",
            events: {},
            config: "(div.accordion#accordion                       (div.accordion-group*                         (div.accordion-heading                           (a.accordion-toggle~1 (*))                         )                         (div.accordion-body!1.collapse.in (*))                       )                     )"
        };
    },
    create: function($super) {
        this.binded = $super().binded;
        var t = this.element, e = (this.setting.width, this.setting.first_open);
        this.binded.each(function(i) {
            i.get("to").each(function(i) {
                var s = $$("$0#$1 $2".exec(t.getTagName(), t.getId(), i)), n = "$0px".exec(s.invoke("getHeight").max());
                s.invoke("hide").invoke("setStyle", {
                    height: n
                }), s[e].show();
            }.bind(this));
        }.bind(this)), this.on_create();
    },
    on: function(t) {
        var e = t.element(), i = e.getTagName(), s = e.classes();
        this.binded.each(function(t) {
            var n = t.get("to");
            t.get("from").each(function(t, o) {
                var a = t.split("."), h = a.first(), r = a.second();
                if (i == h && s.include(r)) {
                    var c, l, d = e, g = this.element.select(t), u = this.element.select(n);
                    g.each(function(t, i) {
                        t == e && (l = i);
                    }), c = $$(n[o])[l], this.open(d, c, g, u);
                }
            }.bind(this));
        }.bind(this));
    },
    open: function(t, e, i, s) {
        e.visible() || (s.invoke("hide"), e.show());
    }
}), Tabs = Class.create(Widget, {
    setup: function() {
        this.setting = {
            first_open: 0,
            on: "click",
            events: {},
            config: "(div                       (ul.nav.nav-tabs                         (li(a~1(*)))                       )                       (div.tab-content                          (div.tab-pane*.tab-pane!1(*))                       )                      )"
        };
    },
    create: function($super) {
        this.binded = $super().binded;
        var t = this.element, e = (this.setting.width, this.setting.first_open);
        this.binded.each(function(i) {
            i.get("to").each(function(i) {
                var s = $$("$0#$1 $2".exec(t.getTagName(), t.getId(), i));
                s.invoke("hide"), s[e].show();
            }.bind(this));
        }.bind(this)), this.on_create();
    },
    on: function(t) {
        var e = t.element(), i = e.getTagName();
        e.classes(), this.binded.each(function(t) {
            var s = t.get("to");
            t.get("from").each(function(t, n) {
                var o = t.split("."), a = o.first();
                if (o.second(), i == a) {
                    var h, r, c = e, l = this.element.select(t), d = this.element.select(s);
                    l.each(function(t, i) {
                        t == e && (r = i);
                    }), h = $$(s[n])[r], this.open(c, h, l, d);
                }
            }.bind(this));
        }.bind(this));
    },
    open: function(t, e, i, s) {
        if (!e.visible()) {
            var n = t.ancestors().first();
            n.siblings().invoke("removeClassName", "active"), n.addClassName("active"), s.invoke("hide").invoke("removeClassName", "in").invoke("removeClassName", "active"), 
            e.show().addClassName("in").addClassName("active");
        }
    }
}), Window = Class.create(Widget, {
    setup: function() {
        this.setting = {
            backdrop: !0,
            keyboard: !0,
            on: "click",
            show: !0,
            remote: !1,
            events: {},
            config: "(div.modal                                       (div.modal-dialog                                 (div.modal-content                                (div.modal-header                                 (button.close(*))                               (h4.modal-title(*))                           )                                               (div.modal-body(*))                             (div.modal-footer(*))                         )                                             )                                             )"
        }, this.events = $w("show hide"), this._fadeClass = "fade", this._isShow = null;
    },
    create: function($super) {
        this.binded = $super().binded;
        var t = this.element, e = this;
        this.setting.keyboard && $(document.body).observe("keyup", function(t) {
            t.element(), t.keyCode == Event.KEY_ESC && e.hide();
        }), this.setting.show ? (t.removeClassName(this._fadeClass), this._isShow = !0) : (t.addClassName(this._fadeClass), 
        this._isShow = !1);
    },
    on: function(t) {
        var e = t.element(), i = e.getTagName(), s = e.classes();
        "button" == i && s.include("close") && this.hide();
    },
    show: function() {
        this._isShow = !0, this._modale(), this.on_show();
    },
    hide: function() {
        this._isShow = !1, this._modale(), this.on_hide();
    },
    _modale: function() {
        var t = "$0-$1".exec(this.element.getId(), "modal");
        if (this._isShow) {
            this.element.removeClassName(this._fadeClass);
            var e = new Element("div", {
                id: t
            }).addClasses("modal-backdrop", "fade", "in");
            $(document.body).insert(e);
        } else this.element.addClasses(this._fadeClass), $(t).remove();
    }
}), ProgressBar = Class.create(Widget, {
    setup: function() {
        this.setting = {
            width: "60%",
            step: 10,
            events: {},
            config: "(div.bar)"
        }, this.events = $w("increment decrement");
    },
    create: function($super) {
        var t = $super();
        this.bar = t.element, this.bar.setStyle({
            width: this.setting.width
        }), this.element.insert(this.bar), this.step = this.element.getWidth() * this.setting.step / 100;
    },
    increment: function() {
        var t = this.bar.getWidth(), e = "$0px".exec(parseInt(this.step + t));
        this.bar.setStyle({
            width: e
        }), this.on_increment(e);
    },
    decrement: function() {
        var t = this.bar.getWidth(), e = "$0px".exec(parseInt(t - this.step));
        this.bar.setStyle({
            width: e
        }), this.on_decrement(e);
    }
}), Tooltip = Class.create(Widget, {
    setup: function() {
        this.setting = {
            animation: !1,
            html: !1,
            placement: "top",
            selector: !1,
            title: "tooltip",
            trigger: $w("mouseenter mouseleave"),
            delay: 0,
            container: !1,
            config: "(div.tooltip                         (div.tooltip-arrow)                      (div.tooltip-inner)                    )",
            events: {}
        }, this.main_class = "tooltip", this.events = $w("show hide"), this.setting.on = this.setting.trigger, 
        this._show = !1, this._complete;
    },
    create: function($super) {
        var t = $super().element;
        this._complete = !1, this.html = t;
    },
    on: function() {
        this._show ? this.hide() : this.show();
    },
    show: function() {
        var t = this.html;
        if (!this._complete) {
            var e = this.setting.container, i = this.setting.title;
            e ? e.insert(t) : this.element.insert({
                after: t
            }), this.setting.animation && t.addClassName("fade"), this.setting.html && (i = i.unescapeHTML()), 
            t.down(1).insert(i), this._set_position(t), t.addClasses(this.setting.placement, this.main_class), 
            this._complete = !0;
        }
        t.addClassName("in"), this._show = !0, this.on_show();
    },
    hide: function() {
        this.html.removeClassName("in"), this._show = !1, this.on_hide();
    },
    _set_position: function(t) {
        t.setStyle({
            top: 0,
            left: 0,
            display: "block"
        });
        var e, i, s = 10, n = new Element.Layout(this.element), o = new Element.Layout(this.html.select(".tooltip-arrow").first()), a = new Element.Layout(this.html), h = o.get("width"), r = (o.get("height"), 
        o.get("margin-left")), c = n.get("left"), l = n.get("top"), d = n.get("margin-left"), g = (n.get("margin-top"), 
        n.get("width"), n.get("margin-right"), n.get("height"));
        n.get("margin-bottom");
        var u = n.get("width"), m = n.get("height"), f = a.get("width"), v = a.get("height"), p = (a.get("margin-left"), 
        a.get("margin-right"));
        switch (a.get("margin-top"), a.get("margin-bottom"), this.setting.placement) {
          case "top":
            e = c + u / 2 - f / 4, i = l - 4 * s;
            break;

          case "bottom":
            e = c + u / 2 - f / 4, i = g + l + s;
            break;

          case "left":
            i = l + m / 2 - v / 4, e = c - f - h - r - p - d;
            break;

          case "right":
            i = l + m / 2 - v / 4, e = c + u + 2.5 * s;
        }
        t.setStyle({
            top: "$0px".exec(i),
            left: "$0px".exec(e)
        });
    }
}), Popover = Class.create(Widget, {
    setup: function() {
        this.setting = {
            animation: !1,
            html: !1,
            placement: "top",
            selector: !1,
            title: "popover",
            trigger: "click",
            delay: 0,
            container: !1,
            config: "(div.popover                       (div.arrow)                       (h3.popover-title)                       (div.popover-content)                    )",
            events: {}
        }, this.main_class = "popover", this.events = $w("show hide"), this.setting.on = this.setting.trigger, 
        this._show = !1, this._complete;
    },
    create: function($super) {
        var t = $super().element;
        this._complete = !1, this.html = t;
    },
    on: function() {
        this._show ? this.hide() : this.show();
    },
    show: function() {
        var t = this.html;
        if (!this._complete) {
            var e = this.setting.container, i = this.setting.title;
            e ? e.insert(t) : this.element.insert({
                after: t
            }), this.setting.animation && t.addClassName("fade"), this.setting.html && (i = i.unescapeHTML()), 
            t.down(1).insert(i), this._set_position(t), t.addClasses(this.setting.placement, this.main_class), 
            this._complete = !0;
        }
        t.addClassName("in"), this._show = !0, this.on_show();
    },
    hide: function() {
        this.html.removeClassName("in"), this._show = !1, this.on_hide();
    },
    _set_position: function(t) {
        t.setStyle({
            top: 0,
            left: 0,
            display: "block"
        });
        var e, i, s = 10, n = new Element.Layout(this.element), o = n.get("left") + n.get("margin-left"), a = n.get("top") + n.get("margin-top"), h = (n.get("width") + n.get("margin-right"), 
        n.get("height") + n.get("margin-bottom")), r = n.get("width"), c = n.get("height"), l = t.getWidth(), d = t.getHeight();
        switch (this.setting.placement) {
          case "top":
            e = o + r / 2 - l / 4, i = a - 6 * s;
            break;

          case "bottom":
            e = o + r / 2 - l / 4, i = h + a + s;
            break;

          case "left":
            i = a + c - d / 2, e = o - l;
            break;

          case "right":
            i = a + c - d / 2, e = o + r + 2.5 * s;
        }
        t.setStyle({
            top: "$0px".exec(i),
            left: "$0px".exec(e)
        });
    }
});
