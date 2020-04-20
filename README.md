# What is it?

Alphabetically sorts the keys in _selected_ JSON objects.

> **Please take care using this** - I've tried to ensure it won't invalidate your JSON. But, as it has to parse > sort > stringify, there is a chance it'll lose something. It should be fine for plain JSON.

<style>.bmc-button img{height: 34px !important;width: 35px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{padding: 7px 10px 7px 10px !important;line-height: 35px !important;height:51px !important;min-width:217px !important;text-decoration: none !important;display:inline-flex !important;color:#ffffff !important;background-color:#FF813F !important;border-radius: 5px !important;border: 1px solid transparent !important;padding: 7px 10px 7px 10px !important;font-size: 20px !important;letter-spacing:-0.08px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Lato', sans-serif !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#ffffff !important;}</style><link href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/richie5um"><img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:15px;font-size:19px !important;">Buy me a coffee</span></a>

# Install

* Install via VSCode extensions install

# Usage

* Select a JSON object (note, it uses full lines so ensure the selected lines are a valid JSON object)
* Run the extension (Cmd+Shift+P => Sort JSON)

# Updates

* 1.17.0: Sort by type (experimental code).
* 1.16.0: Sort by values (experimental code).
* 1.15.0: Change algorithm to better cope with JSON quirks.
* 1.14.0: Sortable alphanumerically (a2 < a10).
* 1.13.0: Sortable by key length.
* 1.12.0: Improvements to JSONC comment detecion - thanks 'reporter123'.
* 1.11.0: Tries to use normal JSON outputter for some known JSON issues.
* 1.10.1: Removes (simple) comment lines from JSON before sorting.
* 1.9.2:  Now sorts the whole file if there is no selected text.
* 1.9.0:  Now sorts selected JSON text, even if that is embedded in a JSON object - note, doesn't preserve indents.
* 1.8.0:  Sorts objects within arrays.

# Example

![Example](resources/usage.gif)

# Settings

* You can override the sort order (note: this applies to all levels and overrides reverse sort too). Add this to your preferences (settings.json):
    * `"sortJSON.orderOverride": ["name", "version", "description"]`
* You can underride the sort order (note: this applies to all levels and underrides reverse sort too). Add this to your preferences (settings.json):
    * `"sortJSON.orderUnderride": ["dependencies", "devDependencies"]`
