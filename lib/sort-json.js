var vscode = require("vscode");
var sorter = require("./sort-json-utils");
var JSON5 = require("json5");
var _ = require("lodash");
const {
    parse,
    stringify
} = require('comment-json');
var JSONC = { parse, stringify };

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

    var wrapBraces = false;
    var parserInput = JSONC;
    var parserOutput = JSONC;

    // returns true if we should try again or not
    function handleError(e) {
        if (!wrapBraces && sorter.startsWith(e.message, "Unexpected token : in JSON at position")) {
            wrapBraces = true;
            return true;
        }

        if (!Object.is(parserInput, JSON)) {
            parserInput = JSON;
            parserOutput = JSON;
            return true;
        }

        var shouldTryJson5 = (
            sorter.startsWith(
                e.message,
                "Unexpected token } in JSON at position"
            ) ||
            sorter.startsWith(
                e.message,
                "Unexpected token / in JSON at position"
            )
        );

        if (!Object.is(parserInput, JSON5) && shouldTryJson5) {
            parserInput = JSON5;
            return true;
        }

        if (!Object.is(parserOutput, JSON5) && shouldTryJson5) {
            parserOutput = JSON5;
            return true;
        }

        return false;
    };

    var lastErr = undefined;
    var tryAgain = true;
    while (tryAgain) {
        try {
            sortActiveSelectionInternal(parserInput, parserOutput, comparator, sortAlgo, wrapBraces);
            return true;
        } catch (e) {
            lastErr = e;
            tryAgain = handleError(e);
        }
    }

    console.log(lastErr);
    return false;
}

function setSelection(
    textEditor,
    startLine,
    startPos,
    endLine,
    endPos,
    sortedText
) {
    textEditor.edit(function (editBuilder) {
        var range = new vscode.Range(startLine, startPos, endLine, endPos);
        editBuilder.replace(range, sortedText);
    });
}

function sortActiveSelectionInternal(
    jsonParserInput,
    jsonParserOutput,
    sortOrder,
    sortAlgo,
    wrapWithBraces,
) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;
    var sortOptions = getConfig();


    // If nothing is selected, then 'select' entire file
    if (selection.isEmpty) {
        //if File is in the excluded list or path don't do anything
        var workspacePath = vscode.workspace.rootPath;
        var filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        var relativeFilePath = filePath.replace(workspacePath, "").substring(1);
        var excludedFiles = sortOptions.excludedFiles;
        var excludedPaths = sortOptions.excludedPaths;

        if (
            excludedFiles.includes(relativeFilePath) ||
            excludedPaths.some((path) => relativeFilePath.index(path) === 0)
        ) {
            throw new Error("This file has been excluded from sortJSON");
        }

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

    var selectedText = getSelection(
        textEditor,
        startLine,
        startPos,
        endLine,
        endPos
    );

    if (wrapWithBraces) {
        // TODO: would it be useful to also try wrapping with `[]`?
        selectedText = "{" + selectedText.trimEnd() + "}";
    }

    var initialJSON = sorter.textToJSON(jsonParserInput, selectedText);
    var sortedJSON = sorter.sortJSON(
        initialJSON,
        sortOrder,
        sortOptions,
        sortAlgo
    );

    var indent = findIndent(textEditor);
    var sortedText = sorter.jsonToText(jsonParserOutput, sortedJSON, indent);

    if (wrapWithBraces) {
        sortedText = sortedText.substring(1, sortedText.length - 1).trimEnd();
        if (selectedText.endsWith(",}")) {
            sortedText += ",";
        }
    }

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
