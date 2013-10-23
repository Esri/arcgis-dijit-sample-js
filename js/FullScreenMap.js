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
    "dojo/text!./templates/FullScreenMap.html",

    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",

    "esri/map",

    "dojo/domReady!"
],
function (
    Evented,
    declare, lang,
    _WidgetBase, a11yclick, _TemplatedMixin,
    on,
    dijitTemplate,
    dom, domStyle, domClass, domAttr,
    Map
) {
    return declare([_WidgetBase, _TemplatedMixin, Evented], {

        declaredClass: "modules.FullScreenMap",

        templateString: dijitTemplate,

        options: {
            map: null,
            visible: true
        },

        // lifecycle: 1
        constructor: function (options, srcRefNode) {

            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);

            // widget node
            this.domNode = srcRefNode;

            // set map property
            this.set("map", defaults.map);
            this.set("visible", defaults.visible);
            
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
        startup: function () {
        
            this._visible();
        
            // map not defined
            if (!this.get("map")) {
                console.log('map required');
                this.destroy();
                return;
            }

            // map domNode
            this._mapNode = this.map.container;

            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            }
        },


        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            this.inherited(arguments);
        },


        show: function(){
            this.set("visible", true);  
        },
        hide: function(){
            this.set("visible", false);
        },


        /* ---------------- */
        /* Public Functions */
        /* ---------------- */

        toggle: function () {
            this._toggleFullscreen();
        },

        refresh: function () {
            var w, h;
            var center = this.map.extent.getCenter();


            // determine fullscreen state
            var state;
            if (this._mapNode.requestFullscreen) {
                state = document.fullScreen;
            } else if (this._mapNode.mozRequestFullScreen) {
                state = document.mozFullScreen;
            } else if (this._mapNode.webkitRequestFullScreen) {
                state = document.webkitIsFullScreen;
            }


            // set fullscreen status
            this.set("fullscreen", state);


            if (this.get("fullscreen")) {
                w = "100%";
                h = "100%";
                domClass.add(this.buttonNode, "exit");
                domClass.remove(this.buttonNode, "enter");
                domAttr.set(this.buttonNode, "title", "Exit Fullscreen");
            } else {
                w = '';
                h = '';
                domClass.add(this.buttonNode, "enter");
                domClass.remove(this.buttonNode, "exit");
                domAttr.set(this.buttonNode, "title", "Enter Fullscreen");
            }

            domStyle.set(this._mapNode, {
                width: w,
                height: h
            });


            this.map.resize();


            // re-center map
            setTimeout(lang.hitch(this, function () {
                this.map.centerAt(center);
            }), 500);

        },


        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _init: function () {

            // enter/exit fullscreen event
            if (this._mapNode.requestFullscreen) {
                on(document, "fullscreenchange", lang.hitch(this, function () {
                    this.refresh();
                }));
            } else if (this._mapNode.mozRequestFullScreen) {
                on(document, "mozfullscreenchange", lang.hitch(this, function () {
                    this.refresh();
                }));
            } else if (this._mapNode.webkitRequestFullScreen) {
                on(document, "webkitfullscreenchange", lang.hitch(this, function () {
                    this.refresh();
                }));
            }



            this.set("loaded", true);
            
            // emit event
            this.emit("load", {});


        },

        
        _visible: function(){
            if(this.get("visible")){
                domStyle.set(this.domNode, 'display', 'block');
            }
            else{
                domStyle.set(this.domNode, 'display', 'none');
            }
        },


        _toggleFullscreen: function () {
            if (this.get("fullscreen")) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            } else {
                if (this._mapNode.requestFullscreen) {
                    this._mapNode.requestFullscreen();
                } else if (this._mapNode.mozRequestFullScreen) {
                    this._mapNode.mozRequestFullScreen();
                } else if (this._mapNode.webkitRequestFullScreen) {
                    this._mapNode.webkitRequestFullScreen();
                }
            }
        }




    });
});