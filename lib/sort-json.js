var vscode = require('vscode');

var _ = require('lodash');
var _sortKeys = require('./lodash-sortkeys');
var JSON5 = require('json5');

function selectionToJSON(jsonParser, textEditor, startLine, endLine) {
    var selectedText = '';
    for (var i = startLine; i <= endLine; ++i) {
        selectedText += textEditor.document.lineAt(i).text;
    }
    return jsonParser.parse(selectedText);
};

function findIndent(textEditor) {
    var indent;
    for (var i = 0; !indent && i < textEditor.document.lineCount; ++i) {
        var line = textEditor.document.lineAt(i).text;
        for (var j = 0; j < line.length && ' ' === line[j]; ++j) {
            indent = (indent || 0) + 1;
        }
    }
    return indent || 4;
}

function sortActiveSelection(comparator) {
    try {
        sortActiveSelectionInternal(JSON, comparator);
        return true;
    } catch (e) {
        try {
            sortActiveSelectionInternal(JSON5, comparator);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

function sortActiveSelectionInternal(jsonParser, comparator) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;

    var startLine = selection.start.line;
    var endLine = selection.end.line;

    var selectedJSON = selectionToJSON(jsonParser, textEditor, startLine, endLine);
    var sortedJSON = _.sortKeysDeepBy(selectedJSON);

    textEditor.edit(function (editBuilder) {
        var range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
        editBuilder.replace(range, jsonParser.stringify(sortedJSON, undefined, findIndent(textEditor)));
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