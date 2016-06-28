var _ = require('lodash');

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.zipObject(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});

_.mixin({
    'sortKeysDeepBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.zipObject(keys, _.map(keys, function (key) {
            if (_.isObject(obj[key])) {
                obj[key] = _.sortKeysDeepBy(obj[key]);
            }
            return obj[key];
        }));
    }
});