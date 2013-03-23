define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/on",
    "dojo/dom",
    
    
    
    "dojo/text!./templates/FullScreenMap.html",
    
    
    
    "esri/map",
    ],
function(
    declare, connect,
    _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
    on, dom,
    dijitTemplate,
    Map
) {
    return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {

    
    
        declaredClass: "modules.FullScreenMap",

        
        
        templateString: dijitTemplate,

        
        
        constructor: function(options, srcRefNode) {


            // mix in settings and defaults
            declare.safeMixin(this.options, options);

            // set properties
            //this.set("theme", this.options.theme);
            //this.set("stops", this.options.stops);
            // widget node
            this.domNode = srcRefNode;
            // watch updates of public properties and update the widget accordingly
            this.watch("theme", this._updateTheme);
        },
        
        
        // start widget
        startup: function() {

        },
        
        
        // destroy widget
        destroy: function() {
            this.inherited(arguments);
        },
        
        
        
        /* ---------------- */
        /* Public Events */
        /* ---------------- */
        onLoad: function() {},
        
        
        
        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        doSomething: function(){},
        
        
        
        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _doSomething: function(){}
        
        
        
    });
});