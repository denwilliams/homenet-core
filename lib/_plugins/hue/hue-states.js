var hue = require('node-hue-api');
var lightState = hue.lightState;

// WHITE STATES
var MID = 350;
var WARM = 400;
var X_WARM = 500;
var BRIGHT = 250;

// HUES
var BLOOD_ORANGE = 350;

// BRIGHTNESS
var MAX = 100;
var HIGH = 75;
var MED = 50;
var LOW = 25;
var MIN = 1;

var modes = {

  'bright':   lightState.create().on().white(BRIGHT, MAX),
  'warm':     lightState.create().on().white(X_WARM, MAX),
  'full':     lightState.create().on().white(MID, MAX),
  
  'high':     hue.lightState.create().on().white(WARM, HIGH),
  
  'medium':   hue.lightState.create().on().white(WARM, MED),
  'med':      hue.lightState.create().on().white(WARM, MED),
  
  'low':      hue.lightState.create().on().white(WARM, LOW),
  
  'minimum':  hue.lightState.create().on().white(WARM, MIN),
  'min':      hue.lightState.create().on().white(WARM, MIN),
  
  'off':      lightState.create().off(),

  'movie':    lightState.create().on().hsl(BLOOD_ORANGE, MAX, LOW).transition(3000),
  
  'red':     hue.lightState.create().hsl(0, 100, 100).on(),
  'green':   hue.lightState.create().hsl(145, 100, 100).on(),
  'blue':    hue.lightState.create().hsl(250, 100, 100).on(),
  'purple':  hue.lightState.create().hsl(280, 100, 100).on(),

  'party':    hue.lightState.create().on().hsl(0, 100, 100).effect('colorloop'),

  'test':     hue.lightState.create().on().hsl(300, 100, 60).effect('none').transition(5000),
  'test2':    hue.lightState.create().alert().white(500, 10)
};

// modes.fadelow = modes.low.transition(5000);
// modes.fadeoff = modes.off.transition(20000);
// modes.redalert = modes.red.alert('lselect');
// modes.greenalert = modes.green.alert('lselect');
// modes.bluealert = modes.blue.alert('lselect');
// modes.purplealert = modes.purple.alert('lselect');

module.exports = exports = modes;