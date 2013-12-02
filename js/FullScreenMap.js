// http://dojotoolkit.org/reference-guide/1.9/quickstart/writingWidgets.html
define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/a11yclick",
    "dijit/_TemplatedMixin",
    "dojo/on",
    // load template
    "dojo/text!modules/templates/FullScreenMap.html",
    "dojo/i18n!modules/nls/FullScreenMap",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/domReady!"
],
function (
    Evented,
    declare, lang,
    _WidgetBase, a11yclick, _TemplatedMixin,
    on,
    dijitTemplate,
    i18n,
    domStyle, domClass, domAttr
) {
    return declare([_WidgetBase, _TemplatedMixin, Evented], {
        declaredClass: "modules.FullScreenMap",
        templateString: dijitTemplate,
        options: {
            map: null,
            visible: true,
            container: null
        },
        // lifecycle: 1
        constructor: function(options, srcRefNode) {
            // css classes
            this.css = {
                fs: "fs",
                toggle: "toggle",
                exit: "exit",
                enter: "enter"
            };
            // language
            this._i18n = i18n;
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            // set map property
            this.set("map", defaults.map);
            this.set("visible", defaults.visible);
            this.set("container", defaults.container);
            // watch for changes
            this.watch("visible", this._visible);
        },
        // _TemplatedMixin implements buildRendering() for you. Use this to override
        // buildRendering: function() {},
        // called after buildRendering() is finished
        postCreate: function() {
            this.own(on(this.buttonNode, a11yclick, lang.hitch(this, this._toggleFullscreen)));
        },
        // start widget. called by user
        startup: function() {
            // set visibility
            this._visible();
            // map not defined
            if (!this.get("map")) {
                console.log('map required');
                this.destroy();
                return;
            }
            if (!this.get("container")) {
                this.set("container", this.map.container);
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function() {
                    this._init();
                }));
            }
        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function() {
            this._removeEvents();
            this.inherited(arguments);
        },
        show: function() {
            this.set("visible", true);
        },
        hide: function() {
            this.set("visible", false);
        },
        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        toggle: function() {
            this._toggleFullscreen();
        },
        refresh: function() {
            var w, h;
            var center = this.map.extent.getCenter();
            // determine fullscreen state
            var state;
            if (this.get("container").requestFullscreen) {
                state = document.fullScreen;
            } else if (this.get("container").mozRequestFullScreen) {
                state = document.mozFullScreen;
            } else if (this.get("container").webkitRequestFullScreen) {
                state = document.webkitIsFullScreen;
            }
            // set fullscreen status
            this.set("fullscreen", state);
            // if fullscreen is set
            if (this.get("fullscreen")) {
                w = "100%";
                h = "100%";
                domClass.add(this.buttonNode, this.css.exit);
                domClass.remove(this.buttonNode, this.css.enter);
                domAttr.set(this.buttonNode, "title", this._i18n.exit);
            } else {
                w = '';
                h = '';
                domClass.add(this.buttonNode, this.css.enter);
                domClass.remove(this.buttonNode, this.css.exit);
                domAttr.set(this.buttonNode, "title", this._i18n.enter);
            }
            // set map width and height
            domStyle.set(this.get("container"), {
                width: w,
                height: h
            });
            // resize map
            this.map.resize();
            // clear timeout if it exists
            if(this._timeout){
                clearTimeout(this._timeout);
            }
            // re-center map
            this._timeout = setTimeout(lang.hitch(this, function() {
                this.map.centerAt(center);
            }), 500);
        },
        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _removeEvents: function() {
            // remove any event listeners created
            if (this._events && this._events.length) {
                for (var i = 0; i < this._events.length; i++) {
                    this._events[i].remove();
                }
            }
            this._events = [];
        },
        _init: function() {
            // remove any events
            this._removeEvents();
            // fullscreeen change event
            var changeEvent;
            // enter/exit fullscreen event
            if (this.get("container").requestFullscreen) {
                changeEvent = on(document, "fullscreenchange", lang.hitch(this, function() {
                    this.refresh();
                }));
            } else if (this.get("container").mozRequestFullScreen) {
                changeEvent = on(document, "mozfullscreenchange", lang.hitch(this, function() {
                    this.refresh();
                }));
            } else if (this.get("container").webkitRequestFullScreen) {
                changeEvent = on(document, "webkitfullscreenchange", lang.hitch(this, function() {
                    this.refresh();
                }));
            }
            // if event created
            if(changeEvent){
                // add it to events array
                this._events.push(changeEvent);   
            }
            this.set("loaded", true);
            // emit event
            this.emit("load", {});
        },
        _visible: function() {
            if (this.get("visible")) {
                domStyle.set(this.domNode, 'display', 'block');
            } else {
                domStyle.set(this.domNode, 'display', 'none');
            }
        },
        _toggleFullscreen: function() {
            if (this.get("fullscreen")) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            } else {
                if (this.get("container").requestFullscreen) {
                    this.get("container").requestFullscreen();
                } else if (this.get("container").mozRequestFullScreen) {
                    this.get("container").mozRequestFullScreen();
                } else if (this.get("container").webkitRequestFullScreen) {
                    this.get("container").webkitRequestFullScreen();
                }
            }
        }
    });
});