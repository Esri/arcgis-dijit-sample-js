// http://dojotoolkit.org/reference-guide/1.8/quickstart/writingWidgets.html

define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/on",
    "dojo/dom",



    "dojo/text!./templates/FullScreenMap.html",


    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",



    "dojo/domReady!"
],
function(
    declare, connect,
    _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
    on, dom,
    dijitTemplate,
    domStyle, domClass, domAttr
){
    return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {

        declaredClass: "modules.FullScreenMap",

        templateString: dijitTemplate,

        options: {},

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
            if(!_self.map){
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
                connect.connect(_self.map, "onLoad", function () {
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


            this.set("fullscreen", document.webkitIsFullScreen);


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
            on(_self._mapNode, "webkitfullscreenchange", function () {
                _self.refresh();
            });

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