var fs = require('fs');
var inquirer = require("inquirer");
var _ = require('underscore');
var clc = require('cli-color')

var get_current_components = function() {
  var components = fs.readdirSync('src');
  components = _.filter(components, function(component) {
    if (component[0] === '.') {
      return false;
    }
    return !_.contains(['amelia-ui.js', 'amelia-ui.less'], component);
  });
  return components;
};

// Get name of new component
inquirer.prompt([{
  type: "list",
  name: "name",
  message: "Which component do you want to remove?",
  choices: get_current_components()
}, {
  type: "confirm",
  name: "toDelete",
  message: "Are you sure you want to delete?",
  default: false
}], function(answers) {
  console.log(answers);
});
