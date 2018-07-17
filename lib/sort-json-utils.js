var _ = require('lodash');
var _sortKeys = require('./lodash-sortkeys');

function textToJSON(jsonParser, text) {
    return jsonParser.parse(text);
}

function jsonToText(jsonParser, json, indent) {
    return jsonParser.stringify(json, undefined, indent);
}

function sortJSON(json, order, options, sortAlgo) {
   return  _.sortKeysDeepBy(json, order, options, sortAlgo);
}

function startsWith(str, search, pos) {
    return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
};

exports.textToJSON = textToJSON;
exports.jsonToText = jsonToText;
exports.sortJSON = sortJSON;
exports.startsWith = startsWith;
