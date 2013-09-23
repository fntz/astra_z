Element.addMethods({
    getTagName:function(t) {
        return t.tagName.downcase();
    },
    getId:function(t) {
        return t.id || null;
    },
    classes:function(t) {
        return $w(t.readAttribute("class"));
    },
    getAttributes:function(t, e) {
        for (var i, n, e = e || !1, s = $H(), a = 0, o = t.attributes, r = o.length; r > a; a++) if (n = o.item(a).nodeName, 
        i = o.item(a).nodeValue, e || ("class" == n && (i = $w(i)), !n.startsWith("data-"))) s.set(n, i); else {
            var h = s.getOrBuild("data", $H({})), l = /data-(.+)/.exec(n).second();
            h.set(l, i);
        }
        return s.toJ();
    },
    removeClasses:function(t) {
        var t = $(t);
        return $A(arguments).slice(1).flatten().each(function(e) {
            t.removeClassName(e);
        }), t;
    },
    addClasses:function(t) {
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
    toObj:function() {
        if (this.isEmpty()) return {};
        for (var t, e, i = {}, n = 0, s = this.size(); s > n; n++) t = this.keys()[n], e = this.get(t), 
        i[t] = Object.isHash(e) ? e.toObj() :e;
        return i;
    },
    toJ:function() {
        return this.toObj();
    },
    getOrBuild:function(t, e) {
        var i = this.get(t);
        return i ? i :(this.set(t, e), e);
    },
    getOrElse:function(t, e) {
        var i = this.get(t);
        return i ? i :e || {};
    },
    isEmpty:function() {
        return this.keys().isEmpty();
    },
    eachKey:function(t, e) {
        this.keys().each(t, e);
    },
    eachValue:function(t, e) {
        this.values().each(t, e);
    },
    eachPair:function(t, e) {
        this.each(function(i) {
            t.call(e, i.key, i.value);
        });
    },
    updateWith:function(t, e) {
        if (!Object.isFunction(e)) throw new TypeError();
        if (this.isEmpty()) return this.update(t);
        var i = this.keys(), n = new Hash(t).inject(this, function(t, n) {
            var s = i.include(n.key) ? e(this.get(n.key), n.value) :n.value;
            return t.set(n.key, s), t;
        }.bind(this));
        return n;
    },
    mergeWith:function(t, e) {
        return this.clone().updateWith(t, e);
    }
}), String.prototype.isWorld = function() {
    return this.blank() ? !1 :!/[^A-Za-z0-9_-]/.match(this);
}, String.prototype.downcase = function() {
    return this.toLowerCase();
}, String.prototype.exclude = function(t) {
    return !this.include(t);
}, String.prototype.exec = function() {
    var t = /\$(\d+)/, e = [];
    str = this;
    for (var i = 0, n = arguments.length; n > i; i++) e.push(arguments[i]);
    return this.scan(t, function(t) {
        var i = t.first().strip(), n = parseInt(t.second()), s = e[n];
        if (Object.isUndefined(s)) throw new Error("Element with index `$0` not found in [$1]".exec(n, e));
        str = str.gsub(new RegExp("\\" + i), s);
    }), str;
};

var Delegatable = {
    delegate:function(t) {
        var e = this[t], i = this;
        $A(arguments).slice(1).each(function(t) {
            var n = e[t];
            if (!Object.isFunction(n)) throw "Error! Delegate only for methods";
            i[t] = function() {
                return n.apply(e, arguments);
            };
        });
    },
    delegate_alias:function(t, e, i) {
        var e = [ e ].flatten(), i = [ i ].flatten();
        if (e.size() != i.size()) throw "Error alias array must be have size equal with target array";
        for (var n = 0; n < e.size(); n++) {
            var s = this[t][i[n]];
            if (!Object.isFunction(s)) throw "Error! Delegate only for methods";
            this[e[n]] = function() {
                return s.apply(this[t], $A(arguments));
            };
        }
    }
}, ASTRA_Z = {
    VERSION:"0.0.1"
}, c = function(t) {
    console.log(t);
}, ZElement = Class.create(Delegatable, {
    initialize:function(t, e) {
        this.element = new Element(t, e || {}), this.elements = [], this.binded = [], this.delegate("element", "addClassName", "writeAttribute", "readAttribute", "descendants");
    },
    insert:function(t) {
        this.elements.push(t), this.element.insert(t.element);
    },
    tagName:function() {
        return this.element.tagName.downcase();
    }
}), Translator = {
    translate:function(t) {
        var e = [];
        t.scan(/[a-zA-Z0-9-]+|./, function(t) {
            var i = t.first().strip();
            i.blank() || e.push(t.first());
        });
        for (var i, n, s, a, o, r = Class.create(Delegatable, {
            initialize:function() {
                this._end_element = 0, this._begin_element = 0, this._elements = [], this._root = null, 
                this._element, this.delegate("_elements", "last", "push", "pop");
                var t = {
                    star:"*",
                    tilde:"~",
                    sharp:"#",
                    dot:".",
                    bang:"!",
                    rb:")",
                    lb:"("
                };
                $H(t).eachPair(function(t, e) {
                    this[t] = e;
                }.bind(this));
            },
            root:function(t) {
                return t ? (this._root = t, void 0) :this._root;
            },
            element:function(t) {
                return t ? (this._element = t, void 0) :this._element;
            },
            end:function() {
                this._end_element++;
            },
            begin:function() {
                this._begin_element++;
            },
            get_begin:function() {
                return this._begin_element;
            },
            get_end:function() {
                return this._end_element;
            }
        }), h = new r(), l = [], c = [], d = 0, u = d + 1, f = d - 1, g = e.length; g > d; d++, 
        u++, f++) if (a = e[u], s = e[d], n = e[f], o = e[d - 2], s == h.lb) {
            if (h.begin(), !a.isWorld()) {
                if (a == h.star) continue;
                throw "Expected <tag> or `*` but $0 given".exec(a);
            }
            i = new ZElement(a);
            var m = h.last();
            m ? h.last().insert(i) :h.root(i), h.push(i);
        } else if (s == h.rb) h.end(), o != h.lb && h.pop(); else {
            if (s.isWorld()) {
                if (n.isWorld()) throw "Unexpected `$0`".exec(s);
                continue;
            }
            if (s == h.dot) {
                if (!a.isWorld()) throw "Expected `class name`, but given `$0`".exec(a);
                i.addClassName(a);
            } else if (s == h.tilde) {
                if (!n.isWorld()) throw "Unexpected `$0` before bind `$1`".exec(n, s);
                var p = l.detect(function(t) {
                    return t.keys().first() == a;
                }) || $H(), v = $H({});
                o == h.lb ? v.set(a, [ "$0".exec(n) ]) :v.set(a, [ "$0.$1".exec(i.tagName(), n) ]), 
                p.updateWith(v, function(t, e) {
                    var i = t.concat(e);
                    return i;
                }), l.push(p);
            } else if (s == h.bang) {
                if (!n.isWorld()) throw "Unexpected `$0` before bind `$1`".exec(n, s);
                var p = c.detect(function(t) {
                    return t.keys().first() == a;
                }) || $H(), v = $H({});
                o == h.lb ? v.set(a, [ "$0".exec(n) ]) :v.set(a, [ "$0.$1".exec(i.tagName(), n) ]), 
                p.updateWith(v, function(t, e) {
                    var i = t.concat(e);
                    return i;
                }), c.push(p);
            } else if (s == h.sharp) {
                if (!a.isWorld()) throw "Expected `id attr`, but given `$0`".exec(a);
                i.writeAttribute({
                    id:a
                });
            } else {
                if (s != h.star) throw "Unexpected $0".exec(s);
                if (!i) throw "Element not found";
                if (n == h.lb && a == h.rb) i.writeAttribute("data-break", "1"); else {
                    if (!n.isWorld()) throw "Unexpected `$0` between `$1` and `$2`".exec(s, n, a);
                    var b = i.readAttribute("data-repeat") || "";
                    if (o == h.dot) b.blank() ? b = "$0.$1".exec(i.tagName(), n) :b += ".$0".exec(n); else {
                        if (o != h.lb) throw "Unexpected $0".exec(s);
                        b = n;
                    }
                    i.writeAttribute("data-repeat", b);
                }
            }
        }
        if (h.get_begin() != h.get_end()) throw h.root(null), "Not balance `(` `)`";
        var w = l.uniq(), _ = c.uniq();
        if (!w.isEmpty()) {
            if (w.size() != _.size()) throw "Binded groupd have different size. `$0` and `$1`.          Inspect: $2, $3".exec(w.size(), _.size(), w.inspect(), _.inspect());
            for (var p, $, v, y, x, C = w.size(), d = 0; C > d; d++) v = new Hash(), y = w[d].keys().first(), 
            x = w[d].get(y), $ = _.detect(function(t) {
                return t.keys().first() == y;
            }).get(y), v.set("from", x), v.set("to", $), h.root().binded.push(v);
        }
        return h.root();
    }
}, EventsModule = {
    create_events:function() {
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
    initialize:function(t, e) {
        if (this.element = $(t), !Object.isElement(this.element)) throw "Element #{e} not found.".interpolate({
            e:t
        });
        Object.extend(this.setting, e || {}), this.create(this.html), this.bind_event();
    },
    create:function() {
        var t = Translator.translate(this.setting.config);
        return t;
    },
    bind_event:function() {
        if (this.setting.on) {
            var t = this.on.bind(this);
            Object.isArray(this.setting.on) ? this.setting.on.each(function(e) {
                this.element.observe(e, t);
            }.bind(this)) :this.element.observe(this.setting.on, t);
        }
    },
    on:function() {
        throw "Abstract. You must implement `on` function for events";
    }
});

Widget.prototype.initialize = Widget.prototype.initialize.wrap(function(t) {
    return this.events = $w("create open close"), this.setup(), this.create_events(), 
    t.apply(this, $A(arguments).slice(1));
});

var Accordion = Class.create(Widget, {
    setup:function() {
        this.setting = {
            first_open:0,
            all_closed:!1,
            on:"click",
            events:{},
            config:"(div.panel-group                       (div.panel*                         (div.panel-heading                           (a.accordion-toggle~1 (*))                         )                         (div.panel-collapse!1.collapse.in (*))                       )                     )"
        }, this._inClass = "in";
    },
    create:function($super) {
        this.binded = $super().binded, this.element, this.setting.width, this.setting.first_open, 
        this.on_create();
    },
    on:function(t) {
        var e = t.element(), i = e.getTagName(), n = e.classes();
        this.binded.each(function(t) {
            var s = t.get("to");
            t.get("from").each(function(t, a) {
                var o = t.split("."), r = o.first(), h = o.second();
                if (i == r && n.include(h)) {
                    var l, c, d = e, u = this.element.select(t), f = this.element.select(s);
                    u.each(function(t, i) {
                        t == e && (c = i);
                    }), l = $$(s[a])[c], this.open(d, l, u, f);
                }
            }.bind(this));
        }.bind(this));
    },
    open:function(t, e, i, n) {
        e.hasClassName(this._inClass) || (n.without(e).invoke("removeClassName", this._inClass), 
        e.addClassName(this._inClass));
    }
}), Tabs = Class.create(Widget, {
    setup:function() {
        this.setting = {
            first_open:0,
            on:"click",
            events:{},
            config:"(div                       (ul.nav.nav-tabs                         (li(a~1(*)))                       )                       (div.tab-content                          (div.tab-pane*.tab-pane!1(*))                       )                      )"
        };
    },
    create:function($super) {
        this.binded = $super().binded;
        var t = this.element, e = (this.setting.width, this.setting.first_open);
        this.binded.each(function(i) {
            i.get("to").each(function(i) {
                var n = $$("$0#$1 $2".exec(t.getTagName(), t.getId(), i));
                n.invoke("hide"), n[e].show();
            }.bind(this));
        }.bind(this)), this.on_create();
    },
    on:function(t) {
        var e = t.element(), i = e.getTagName();
        e.classes(), this.binded.each(function(t) {
            var n = t.get("to");
            t.get("from").each(function(t, s) {
                var a = t.split("."), o = a.first();
                if (a.second(), i == o) {
                    var r, h, l = e, c = this.element.select(t), d = this.element.select(n);
                    c.each(function(t, i) {
                        t == e && (h = i);
                    }), r = $$(n[s])[h], this.open(l, r, c, d);
                }
            }.bind(this));
        }.bind(this));
    },
    open:function(t, e, i, n) {
        if (!e.visible()) {
            var s = t.ancestors().first();
            s.siblings().invoke("removeClassName", "active"), s.addClassName("active"), n.invoke("hide").invoke("removeClassName", "in").invoke("removeClassName", "active"), 
            e.show().addClassName("in").addClassName("active");
        }
    }
}), Window = Class.create(Widget, {
    setup:function() {
        this.setting = {
            backdrop:!0,
            keyboard:!0,
            on:"click",
            show:!0,
            remote:!1,
            events:{},
            config:"(div.modal                                       (div.modal-dialog                                 (div.modal-content                                (div.modal-header                                 (button.close(*))                               (h4.modal-title(*))                           )                                               (div.modal-body(*))                             (div.modal-footer(*))                         )                                             )                                             )"
        }, this.events = $w("show hide"), this._inClass = "fade", this._isShow = null;
    },
    create:function($super) {
        var t = $super();
        this.binded = t.binded;
        var e = this.element, i = this;
        this.setting.keyboard && $(document.body).observe("keyup", function(t) {
            t.element(), t.keyCode == Event.KEY_ESC && i.hide();
        }), this.setting.show ? (e.removeClassName(this._fadeClass), this._isShow = !0) :(e.addClassName(this._fadeClass), 
        this._isShow = !1);
    },
    on:function(t) {
        var e = t.element(), i = e.getTagName(), n = e.classes();
        "button" == i && n.include("close") && this.hide();
    },
    show:function() {
        this._isShow = !0, this._modale(), this.on_show();
    },
    hide:function() {
        this._isShow = !1, this._modale(), this.on_hide();
    },
    _modale:function() {
        "$0-$1".exec(this.element.getId(), "modal"), this._isShow ? this.element.addClasses("in", "fade") :this.element.removeClassName(this._fadeClass);
    }
}), ProgressBar = Class.create(Widget, {
    setup:function() {
        this.setting = {
            width:"60%",
            step:10,
            events:{},
            config:"(div.progress-bar)"
        }, this.events = $w("increment decrement");
    },
    create:function($super) {
        var t = $super();
        this.bar = t.element, this.bar.setStyle({
            width:this.setting.width
        }), this.element.insert(this.bar), this.step = this.element.getWidth() * this.setting.step / 100;
    },
    increment:function() {
        var t = this.bar.getWidth(), e = "$0px".exec(parseInt(this.step + t));
        this.bar.setStyle({
            width:e
        }), this.on_increment(e);
    },
    decrement:function() {
        var t = this.bar.getWidth(), e = "$0px".exec(parseInt(t - this.step));
        this.bar.setStyle({
            width:e
        }), this.on_decrement(e);
    }
}), Tooltip = Class.create(Widget, {
    setup:function() {
        this.setting = {
            animation:!1,
            html:!1,
            placement:"top",
            selector:!1,
            title:"tooltip",
            trigger:$w("mouseenter mouseleave"),
            delay:0,
            container:!1,
            config:"(div.tooltip                         (div.tooltip-arrow)                      (div.tooltip-inner)                    )",
            events:{}
        }, this.main_class = "tooltip", this.events = $w("show hide"), this.setting.on = this.setting.trigger, 
        this._show = !1, this._complete;
    },
    create:function($super) {
        var t = $super().element;
        this._complete = !1, this.html = t;
    },
    on:function() {
        this._show ? this.hide() :this.show();
    },
    show:function() {
        var t = this.html;
        if (!this._complete) {
            var e = this.setting.container, i = this.setting.title;
            e ? e.insert(t) :this.element.insert({
                after:t
            }), this.setting.animation && t.addClassName("fade"), this.setting.html && (i = i.unescapeHTML()), 
            t.down(1).insert(i), this._set_position(t), t.addClasses(this.setting.placement, this.main_class), 
            this._complete = !0;
        }
        t.addClassName("in"), this._show = !0, this.on_show();
    },
    hide:function() {
        this.html.removeClassName("in"), this._show = !1, this.on_hide();
    },
    _set_position:function(t) {
        t.setStyle({
            top:0,
            left:0,
            display:"block"
        });
        var e, i, n = 10, s = new Element.Layout(this.element), a = new Element.Layout(this.html.select(".tooltip-arrow").first()), o = new Element.Layout(this.html), r = a.get("width"), h = (a.get("height"), 
        a.get("margin-left")), l = s.get("left"), c = s.get("top"), d = s.get("margin-left"), u = (s.get("margin-top"), 
        s.get("width"), s.get("margin-right"), s.get("height"));
        s.get("margin-bottom");
        var f = s.get("width"), g = s.get("height"), m = o.get("width"), p = o.get("height"), v = (o.get("margin-left"), 
        o.get("margin-right"));
        switch (o.get("margin-top"), o.get("margin-bottom"), this.setting.placement) {
          case "top":
            e = l + f / 2 - m / 4, i = c - 4 * n;
            break;

          case "bottom":
            e = l + f / 2 - m / 4, i = u + c + n;
            break;

          case "left":
            i = c + g / 2 - p / 4, e = l - m - r - h - v - d;
            break;

          case "right":
            i = c + g / 2 - p / 4, e = l + f + 2.5 * n;
        }
        t.setStyle({
            top:"$0px".exec(i),
            left:"$0px".exec(e)
        });
    }
}), Popover = Class.create(Widget, {
    setup:function() {
        this.setting = {
            animation:!1,
            html:!1,
            placement:"top",
            selector:!1,
            title:"popover",
            trigger:"click",
            delay:0,
            container:!1,
            config:"(div.popover                       (div.arrow)                       (h3.popover-title)                       (div.popover-content)                    )",
            events:{}
        }, this.main_class = "popover", this.events = $w("show hide"), this.setting.on = this.setting.trigger, 
        this._show = !1, this._complete;
    },
    create:function($super) {
        var t = $super().element;
        this._complete = !1, this.html = t;
    },
    on:function() {
        this._show ? this.hide() :this.show();
    },
    show:function() {
        var t = this.html;
        if (!this._complete) {
            var e = this.setting.container, i = this.setting.title;
            e ? e.insert(t) :this.element.insert({
                after:t
            }), this.setting.animation && t.addClassName("fade"), this.setting.html && (i = i.unescapeHTML()), 
            t.down(1).insert(i), this._set_position(t), t.addClasses(this.setting.placement, this.main_class), 
            this._complete = !0;
        }
        t.addClassName("in"), this._show = !0, this.on_show();
    },
    hide:function() {
        this.html.removeClassName("in"), this._show = !1, this.on_hide();
    },
    _set_position:function(t) {
        t.setStyle({
            top:0,
            left:0,
            display:"block"
        });
        var e, i, n = 10, s = new Element.Layout(this.element), a = s.get("left") + s.get("margin-left"), o = s.get("top") + s.get("margin-top"), r = (s.get("width") + s.get("margin-right"), 
        s.get("height") + s.get("margin-bottom")), h = s.get("width"), l = s.get("height"), c = t.getWidth(), d = t.getHeight();
        switch (this.setting.placement) {
          case "top":
            e = a + h / 2 - c / 4, i = o - 6 * n;
            break;

          case "bottom":
            e = a + h / 2 - c / 4, i = r + o + n;
            break;

          case "left":
            i = o + l - d / 2, e = a - c;
            break;

          case "right":
            i = o + l - d / 2, e = a + h + 2.5 * n;
        }
        t.setStyle({
            top:"$0px".exec(i),
            left:"$0px".exec(e)
        });
    }
});
