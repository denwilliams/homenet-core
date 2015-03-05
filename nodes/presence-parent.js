module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var presence = global.presence;

    function NodeAdd(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var childId = config.childId;
        var parentId = config.parentId;
        
        var node = this;

        this.on('input', function() {
            presence.addParent(childId, parentId);
        });
    }

    function NodeRemove(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var childId = config.childId;
        var parentId = config.parentId;
        
        var node = this;

        this.on('input', function() {
            presence.removeParent(childId, parentId);
        });
    }

    RED.nodes.registerType("add presence parent",NodeAdd);
    RED.nodes.registerType("remove presence parent",NodeRemove);

};
