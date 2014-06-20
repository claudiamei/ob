var fs = require('fs');
var inquirer = require("inquirer");
var _ = require('underscore');
var clc = require('cli-color')

var get_current_components = function() {
  var components = fs.readdirSync('src');
  return components;
};

var alreadyExists = function(name) {
  return _.contains(get_current_components(), name);
}

// Get name of new component
inquirer.prompt([{
  type: "input",
  name: "name",
  message: "What is the name of your new component?",
  validate: function(component_name) {
    if (alreadyExists(component_name)) {
      return 'A component with the name \"' + clc.red(component_name) + '\" already exists';
    }
    return (true);
  }
}], function(answers) {
  console.log(answers);
});
