var vscode = require('vscode');
var sorter = require('./sort-json-utils');
var JSON5 = require('json5');

function getConfig() {
    return vscode.workspace.getConfiguration('sortJSON');
}

function getSelection(textEditor, startLine, startPos, endLine, endPos) {
    var selectedLines = [];
    var commentLines = [];
    for (var i = startLine; i <= endLine; ++i) {
        var text = textEditor.document.lineAt(i).text;

        // Slice end first so we don't mess up start position
        if (i === endLine) {
            text = text.slice(0, endPos);
        }
        if (i === startLine) {
            text = text.slice(startPos);
        }

        // Check for commented lines (and don't include them in sortable JSON)
        if ((/^\s+\/\/.*$/.test(text))) {
            // RichS: We don't do anything with these for now.
            commentLines.push(text);
            console.log("Removing comment line from sortable JSON: " + text);
        } else {
            selectedLines.push(text);
        }
    }

    return selectedLines.join('\n');
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

function setSelection(textEditor, startLine, startPos, endLine, endPos, sortedText) {
    textEditor.edit(function (editBuilder) {
        var range = new vscode.Range(startLine, startPos, endLine, endPos);
        editBuilder.replace(range, sortedText);
    });
}

function removeTrailingCommas(input) {
    input = input.replace(/,[ \t\r\n]+}/g, '}');
    input = input.replace(/,[ \t\r\n]+\]/g, ']');
    return input;
}

function sortActiveSelectionInternal(jsonParser, sortOrder) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;

    // If nothing is selected, then 'select' entire file
    if (selection.isEmpty) {
        var firstLine = textEditor.document.lineAt(0);
        var lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
        selection = new vscode.Range(
            0,
            firstLine.range.start.character,
            textEditor.document.lineCount - 1,
            lastLine.range.end.character);
    }

    var startLine = selection.start.line;
    var startPos = selection.start.character;
    var endLine = selection.end.line;
    var endPos = selection.end.character;

    var sortOptions = getConfig();

    var selectedText = getSelection(textEditor, startLine, startPos, endLine, endPos);
    selectedText = removeTrailingCommas(selectedText);
    var initialJSON = sorter.textToJSON(jsonParser, selectedText);
    var sortedJSON = sorter.sortJSON(initialJSON, sortOrder, sortOptions);

    var indent = findIndent(textEditor);
    var sortedText = sorter.jsonToText(jsonParser, sortedJSON, indent);

    setSelection(textEditor, startLine, startPos, endLine, endPos, sortedText);
}

function reverseCompare(a, b) {
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, {sensitivity: 'base'});
}

exports.sortNormal = sortActiveSelection.bind(null, ['asc']);
exports.sortReverse = sortActiveSelection.bind(null, ['desc']);