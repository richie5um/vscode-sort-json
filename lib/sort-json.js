var vscode = require('vscode');
var sorter = require('./sort-json-utils');
var JSON5 = require('json5');

function getConfig() {
    return vscode.workspace.getConfiguration('sortJSON');
}

function getSelection(textEditor, startLine, endLine) {
    var selectedText = '';
    for (var i = startLine; i <= endLine; ++i) {
        selectedText += textEditor.document.lineAt(i).text;
    }
    return selectedText;
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

function setSelection(textEditor, startLine, endLine, sortedText) {
    textEditor.edit(function (editBuilder) {
        var range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
        editBuilder.replace(range, sortedText);
    });
}

function sortActiveSelectionInternal(jsonParser, sortOrder) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;

    var startLine = selection.start.line;
    var endLine = selection.end.line;

    var sortOptions = getConfig();

    var selectedText = getSelection(textEditor, startLine, endLine);
    var initialJSON = sorter.textToJSON(jsonParser, selectedText);
    var sortedJSON = sorter.sortJSON(initialJSON, sortOrder, sortOptions);

    var indent = findIndent(textEditor);
    var sortedText = sorter.jsonToText(jsonParser, sortedJSON, indent);

    setSelection(textEditor, startLine, endLine, sortedText);
}

function reverseCompare(a, b) {
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, {sensitivity: 'base'});
}

exports.sortNormal = sortActiveSelection.bind(null, ['asc']);
exports.sortReverse = sortActiveSelection.bind(null, ['desc']);