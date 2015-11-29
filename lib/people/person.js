/**
 * Person
 * @constructor
 */
function Person(id, name, presence) {
  this.id = id;
  this.name = name;
  Object.defineProperty(this, 'presence', {
    enumerable: true,
    get: function() { return presence.isPresent; }
  });
  this.bump = presence.bump.bind(presence);
  
  /**
   * @implements Switch#set
   */
  this.set = function(isPresent) {
    if (isPresent) presence.set();
    else presence.clear();
  };
  /**
   * @implements Switch#get
   */
  this.get = function() {
    return presence.isPresent;
  };
}

module.exports = exports = Person;
