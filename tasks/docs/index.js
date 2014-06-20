var html = require('./docs-html');
var css = require('./docs-css');
var js = require('./docs-js');

// var utils = require('../utils');

function Docs() {};

// markdown = utils.add_banner(markdown);

Docs.prototype.html = html;
Docs.prototype.css = css;
Docs.prototype.js = js;

var inst = new Docs();
module.exports = inst;
