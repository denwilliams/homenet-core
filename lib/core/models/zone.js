/// <reference path="../../../interfaces/interfaces.d.ts" />
/**
 * @module i
 */
var Zone = (function () {
    function Zone(presence, zoneConf) {
        var c = zoneConf;
        this.id = c.id;
        this.name = c.name;
        this.faIcon = c.faIcon;
        this.parent = null;
        this.children = [];
        this.parentId = c.parent;
        var parentZone = c.parent ? 'zone.' + c.parent : null;
        this._presence = presence.add('zone.' + c.id, {
            category: 'zone',
            name: c.name,
            timeout: c.timeout || -1,
            parent: parentZone
        });
    }
    Object.defineProperty(Zone.prototype, "presence", {
        get: function () {
            return this._presence.isPresent;
        },
        enumerable: true,
        configurable: true
    });
    return Zone;
})();
module.exports = Zone;
