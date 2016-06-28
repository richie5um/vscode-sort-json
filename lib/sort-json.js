var vscode = require('vscode');
var _ = require('lodash');
var _sortKeys = require('./lodash-sortkeys');

function selectionToJSON(textEditor, startLine, endLine) {
    var selectedText = '';
    for (var i = startLine; i <= endLine; ++i) {
        selectedText += textEditor.document.lineAt(i).text;
    }
    return JSON.parse(selectedText);
};

function sortActiveSelection(comparator) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;

    var startLine = selection.start.line;
    var endLine = selection.end.line;

    var selectedJSON = selectionToJSON(textEditor, startLine, endLine);
    var sortedJSON = _.sortKeysDeepBy(selectedJSON);

    textEditor.edit(function (editBuilder) {
        var range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
        editBuilder.replace(range, JSON.stringify(sortedJSON, undefined, 4));
    });
}

function reverseCompare(a, b) {
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, {sensitivity: 'base'});
}

exports.sortNormal = sortActiveSelection.bind(null, undefined, false);
exports.sortReverse = sortActiveSelection.bind(null, reverseCompare, false);
exports.sortCaseInsensitive = sortActiveSelection.bind(null, caseInsensitiveCompare, false);