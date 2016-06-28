var _ = require('lodash');

_.mixin({
    'sortKeysDeepBy': function (obj, order) {
        var keys = _.orderBy(_.keys(obj), [], order || ['asc'] );

        return _.zipObject(keys, _.map(keys, function (key) {
            if (!_.isNumber(obj[key]) && !_.isFunction(obj[key]) && !_.isArray(obj[key]) && _.isObject(obj[key])) {
                obj[key] = _.sortKeysDeepBy(obj[key]);
            }
            return obj[key];
        }));
    }
});