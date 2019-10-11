var vscode = require("vscode");
var sorter = require("./sort-json-utils");
var JSON5 = require("json5");
var _ = require("lodash");

function getConfig() {
    return vscode.workspace.getConfiguration("sortJSON");
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

        if (text) {
            selectedLines.push(text);
        }
    }

    return selectedLines.join("\n");
}

function findIndent(textEditor) {
    var indent;
    for (var i = 0; !indent && i < textEditor.document.lineCount; ++i) {
        var line = textEditor.document.lineAt(i).text;
        for (var j = 0; j < line.length && " " === line[j]; ++j) {
            indent = (indent || 0) + 1;
        }
    }
    return indent || 4;
}

function sortActiveSelection(comparator, sortAlgo) {
    sortAlgo = sortAlgo || "alphabetical";

    try {
        sortActiveSelectionInternal(JSON, JSON, comparator, sortAlgo);
        return true;
    } catch (e) {
        // Try to handle minor cases of incorrect JSON.

        // This is when there is a trailing comma at the end of a JSON object
        if (
            sorter.startsWith(
                e.message,
                "Unexpected token } in JSON at position"
            ) ||
            sorter.startsWith(
                e.message,
                "Unexpected token / in JSON at position"
            )
        ) {
            try {
                sortActiveSelectionInternal(JSON5, JSON, comparator, sortAlgo);
                return true;
            } catch (e) {}
        }

        // Nothing else has worked, so lets try the full JSON5 parser and exporter.
        try {
            sortActiveSelectionInternal(JSON5, JSON5, comparator, sortAlgo);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

function setSelection(
    textEditor,
    startLine,
    startPos,
    endLine,
    endPos,
    sortedText
) {
    textEditor.edit(function(editBuilder) {
        var range = new vscode.Range(startLine, startPos, endLine, endPos);
        editBuilder.replace(range, sortedText);
    });
}

function sortActiveSelectionInternal(
    jsonParserInput,
    jsonParserOutput,
    sortOrder,
    sortAlgo
) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;

    // If nothing is selected, then 'select' entire file
    if (selection.isEmpty) {
        var firstLine = textEditor.document.lineAt(0);
        var lastLine = textEditor.document.lineAt(
            textEditor.document.lineCount - 1
        );
        selection = new vscode.Range(
            0,
            firstLine.range.start.character,
            textEditor.document.lineCount - 1,
            lastLine.range.end.character
        );
    }

    var startLine = selection.start.line;
    var startPos = selection.start.character;
    var endLine = selection.end.line;
    var endPos = selection.end.character;

    var sortOptions = getConfig();

    var selectedText = getSelection(
        textEditor,
        startLine,
        startPos,
        endLine,
        endPos
    );
    var initialJSON = sorter.textToJSON(jsonParserInput, selectedText);
    var sortedJSON = sorter.sortJSON(
        initialJSON,
        sortOrder,
        sortOptions,
        sortAlgo
    );

    var indent = findIndent(textEditor);
    var sortedText = sorter.jsonToText(jsonParserOutput, sortedJSON, indent);

    setSelection(textEditor, startLine, startPos, endLine, endPos, sortedText);
}

function reverseCompare(a, b) {
    return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
    return a.localeCompare(b, { sensitivity: "base" });
}

exports.sortNormal = sortActiveSelection.bind(null, ["asc"]);
exports.sortReverse = sortActiveSelection.bind(null, ["desc"]);
exports.sortKeyLength = sortActiveSelection.bind(null, ["asc"], "keyLength");
exports.sortKeyLengthReverse = sortActiveSelection.bind(
    null,
    ["desc"],
    "keyLength"
);
exports.sortAlphaNum = sortActiveSelection.bind(null, ["asc"], "alphaNum");
exports.sortAlphaNumReverse = sortActiveSelection.bind(
    null,
    ["desc"],
    "alphaNum"
);
exports.sortValues = sortActiveSelection.bind(null, ["asc"], "values");
exports.sortValuesReverse = sortActiveSelection.bind(null, ["desc"], "values");
exports.sortType = sortActiveSelection.bind(null, ["asc"], "type");
exports.sortTypeReverse = sortActiveSelection.bind(null, ["desc"], "type");
