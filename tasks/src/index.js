var amelia_js = require('./src-js');
var amelia_css = require('./src-css');
var amelia_html = require('./src-html');
var amelia_icons = require('./src-icons');
// var amelia_markdown = require('./amelia-reload');
// var ameliaDocs = require('./amelia-docs');

function Amelia () {};

Amelia.prototype.js = amelia_js;
Amelia.prototype.css = amelia_css;
Amelia.prototype.html = amelia_html;
Amelia.prototype.icons = amelia_icons;

// Amelia.prototype.docs = ameliaDocs;

var inst = new Amelia();
module.exports = inst;