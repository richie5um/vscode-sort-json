# VSCode SortJSON

## What is it?

Alphabetically sorts the keys in _selected_ JSON objects.

> **Please take care using this** - I've tried to ensure it won't invalidate your JSON. But, as it has to parse > sort > stringify, there is a chance it'll lose something. It should be fine for plain JSON.

<a target="_blank" href="https://www.buymeacoffee.com/richie5um"><img src="resources/buymeacoffee.png" alt="Buy me a coffee"></a>

## Install

-   Install via VSCode extensions install

## Usage

-   Select a JSON object (note, it uses full lines so ensure the selected lines are a valid JSON object)
-   Run the extension (Cmd+Shift+P => Sort JSON)

### Context Menu

If there are too many entries in the Context Menu, then you can modify which get shown by adding (and editing) this to your VSCode preferences:

    "sortJSON.contextMenu": {
        "sortJSON": false,
        "sortJSONAlphaNum": false,
        "sortJSONAlphaNumReverse": false,
        "sortJSONKeyLength": false,
        "sortJSONKeyLengthReverse": false,
        "sortJSONReverse": false,
        "sortJSONType": false,
        "sortJSONTypeReverse": false,
        "sortJSONValues": false,
        "sortJSONValuesReverse": false
    }

# Updates

-   1.20.0: Finally!, support for JSON with comments (JSONC) content [#4](https://github.com/richie5um/vscode-sort-json/issues/4)..
-   1.19.2: Fixed sort files error [#45](https://github.com/richie5um/vscode-sort-json/issues/45).
-   1.19.1: Enable 'Formatter' - so can do format on save :) (thanks JerryGreen). Excluded Paths (thanks Sri352).
-   1.18.0: Make it more a formatter, than separate command.
-   1.17.0: Sort by type (experimental code).
-   1.16.0: Sort by values (experimental code).
-   1.15.0: Change algorithm to better cope with JSON quirks.
-   1.14.0: Sortable alphanumerically (a2 < a10).
-   1.13.0: Sortable by key length.
-   1.12.0: Improvements to JSONC comment detection (thanks reporter123).
-   1.11.0: Tries to use normal JSON outputter for some known JSON issues.
-   1.10.1: Removes (simple) comment lines from JSON before sorting.
-   1.9.2: Now sorts the whole file if there is no selected text.
-   1.9.0: Now sorts selected JSON text, even if that is embedded in a JSON object - note, doesn't preserve indents.
-   1.8.0: Sorts objects within arrays.

## Example

![Example](resources/usage.gif)

## Settings

-   You can override the sort order (note: this applies to all levels and overrides reverse sort too). Add this to your preferences (settings.json):
    -   `"sortJSON.orderOverride": ["name", "version", "description"]`
-   You can underride the sort order (note: this applies to all levels and underrides reverse sort too). Add this to your preferences (settings.json):
    -   `"sortJSON.orderUnderride": ["dependencies", "devDependencies"]`

### Sort on save

There's a vscode setting for formatters (`settings.json`):

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
```

But you can also selectively enable/disable this formatter with (`settings.json`):

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.sortJSON": true
    }
}
```

Or use a hotkey, if you prefer (`keybindings.json`):

```json
{
    "key": "cmd+shift+a",
    "command": "editor.action.codeAction",
    "args": {
        "kind": "source.fixAll.sortJSON"
    }
}
```
