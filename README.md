# What is it?

Alphabetically sorts the keys in _selected_ JSON objects.

> **Please take care using this** - I've tried to ensure it won't invalidate your JSON. But, as it has to parse > sort > stringify, there is a chance it'll lose something. It should be fine for plain JSON.

> Disclaimer:

> <img src="https://raw.githubusercontent.com/richie5um/vscode-sort-json/master/resources/WorksOnMyMachine.png" width="60" height"60"/>

# Install

* Install via VSCode extensions install

# Usage

* Select a JSON object (note, it uses full lines so ensure the selected lines are a valid JSON object)
* Run the extension (Cmd+Shift+P => Sort JSON)

# Updates

* 1.9.2: Now sorts the whole file if there is no selected text.
* 1.9.0: Now sorts selected JSON text, even if that is embedded in a JSON object - note, doesn't preserve indents.
* 1.8.0: Sorts objects within arrays.

# Example

![Example](resources/usage.gif)

# Settings

* You can override the sort order (note: this applies to all levels and overrides reverse sort too). Add this to your preferences (settings.json):
    * `"sortJSON.orderOverride": ["name", "version", "description"]`
* You can underride the sort order (note: this applies to all levels and underrides reverse sort too). Add this to your preferences (settings.json):
    * `"sortJSON.orderUnderride": ["dependencies", "devDependencies"]`