var vscode = require("vscode");
var sortJSON = require("./sort-json");

function activate(context) {
    var commands = [
        vscode.commands.registerCommand(
            "sortJSON.sortJSON",
            sortJSON.sortNormal
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONReverse",
            sortJSON.sortReverse
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONKeyLength",
            sortJSON.sortKeyLength
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONKeyLengthReverse",
            sortJSON.sortKeyLengthReverse
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONAlphaNum",
            sortJSON.sortAlphaNum
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONAlphaNumReverse",
            sortJSON.sortAlphaNumReverse
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONValues",
            sortJSON.sortValues
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONValuesReverse",
            sortJSON.sortValuesReverse
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONType",
            sortJSON.sortType
        ),
        vscode.commands.registerCommand(
            "sortJSON.sortJSONTypeReverse",
            sortJSON.sortTypeReverse
        )
    ];

    commands.forEach(function (command) {
        context.subscriptions.push(command);
    });

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { language: "json", scheme: "file" },
            new FixAllProvider(),
            FixAllProvider.metadata
        )
    );
}

class FixAllProvider {
    static fixAllCodeActionKind = vscode.CodeActionKind.SourceFixAll.append(
        "sortJSON"
    );

    static metadata = {
        providedCodeActionKinds: [FixAllProvider.fixAllCodeActionKind]
    };

    async provideCodeActions(document, _range, context, _token) {
        if (!context.only) {
            return [];
        }

        if (
            !context.only.contains(FixAllProvider.fixAllCodeActionKind) &&
            !FixAllProvider.fixAllCodeActionKind.contains(context.only)
        ) {
            return [];
        }

        const fixAllAction = await vscode.commands.executeCommand(
            "sortJSON.sortJSON"
        );

        if (!fixAllAction) {
            return [];
        }

        return [
            {
                ...fixAllAction,
                title: "Fix All sortJSON",
                kind: FixAllProvider.fixAllCodeActionKind
            }
        ];
    }
}

exports.activate = activate;
