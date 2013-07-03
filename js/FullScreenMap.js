// http://dojotoolkit.org/reference-guide/1.8/quickstart/writingWidgets.html

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
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
    declare,
    _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
    on,
    dijitTemplate,
    dom, domStyle, domClass, domAttr,
    Map
) {
    return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {

        declaredClass: "modules.FullScreenMap",

        templateString: dijitTemplate,

        options: {
            map: null
        },

        fullscreen: false,

        loaded: false,


        // lifecycle: 1
        constructor: function (options, srcRefNode) {

            // mix in settings and defaults
            declare.safeMixin(this.options, options);

            // widget node
            this.domNode = srcRefNode;

            // local map
            this.map = this.options.map;

        },

        // _TemplatedMixin implements buildRendering() for you. Use this to override
        // buildRendering: function() {},

        // called after buildRendering() is finished
        // postCreate: function() {},


        // start widget. called by user
        startup: function () {
            var _self = this;

            // map not defined
            if (!_self.map) {
                console.log('map required');
                _self.destroy();
                return;
            }

            // map domNode
            this._mapNode = dom.byId(this.map.id);

            // when map is loaded
            if (this.map.loaded) {
                _self._init();
            } else {
                on.once(_self.map, "load", function () {
                    _self._init();
                });
            }
        },


        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            this.inherited(arguments);
        },



        /* ---------------- */
        /* Public Events */
        /* ---------------- */
        onLoad: function () {},



        /* ---------------- */
        /* Public Functions */
        /* ---------------- */

        toggle: function () {
            this._toggleFullscreen();
        },

        refresh: function () {
            var w, h;
            var _self = this;
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
            setTimeout(function () {
                _self.map.centerAt(center);
            }, 500);

        },


        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _init: function () {
            var _self = this;



            // enter/exit fullscreen event
            if (this._mapNode.requestFullscreen) {
                on(document, "fullscreenchange", function () {
                    _self.refresh();
                });
            } else if (this._mapNode.mozRequestFullScreen) {
                on(document, "mozfullscreenchange", function () {
                    _self.refresh();
                });
            } else if (this._mapNode.webkitRequestFullScreen) {
                on(document, "webkitfullscreenchange", function () {
                    _self.refresh();
                });
            }



            this.set("loaded", true);
            this.onLoad();



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