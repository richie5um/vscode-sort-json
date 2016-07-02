var _ = require('lodash');
var _sortKeys = require('./lodash-sortkeys');

function textToJSON(jsonParser, text) {
    return jsonParser.parse(text);
}

function jsonToText(jsonParser, json, indent) {
    return jsonParser.stringify(json, undefined, indent);
}

function sortJSON(json, order, options) {
   return  _.sortKeysDeepBy(json, order, options);
}

exports.textToJSON = textToJSON;
exports.jsonToText = jsonToText;
exports.sortJSON = sortJSON;
