// http://dojotoolkit.org/reference-guide/1.9/quickstart/writingWidgets.html

define([
    "dojo/_base/declare"
],
function (
    declare
) {
    return declare([], {
        declaredClass: "modules.Test",
        test: function(){
            console.log('YAY!!!!');
        }
    });
});