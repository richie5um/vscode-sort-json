var vscode = require('vscode');
var sortJSON = require('./sort-json');

function activate(context) {
  var commands = [
    vscode.commands.registerCommand('sortJSON.sortJSON', sortJSON.sortNormal),
    vscode.commands.registerCommand('sortJSON.sortJSONReverse', sortJSON.sortReverse),
    vscode.commands.registerCommand('sortJSON.sortJSONKeyLength', sortJSON.sortKeyLength),
    vscode.commands.registerCommand('sortJSON.sortJSONKeyLengthReverse', sortJSON.sortKeyLengthReverse),
    vscode.commands.registerCommand('sortJSON.sortJSONAlphaNum', sortJSON.sortAlphaNum),
    vscode.commands.registerCommand('sortJSON.sortJSONAlphaNumReverse', sortJSON.sortAlphaNumReverse),
  ];

  commands.forEach(function (command) {
    context.subscriptions.push(command);
  });
}

exports.activate = activate;
