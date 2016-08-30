var _ = require('lodash');

Array.prototype.move = function (old_index, new_index) {
    // Shortcut helper to move item to end of array
    if (-1 === new_index) {
        new_index = this.length-1;
    }

    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

_.mixin({
    'sortKeysDeepBy': function (obj, order, options) {
        order = order || ['asc'];
        var keys = _.orderBy(_.keys(obj), [], order);

        if (options && options.orderOverride) {
            var orderOverride = options.orderOverride.slice().reverse();
            orderOverride.forEach(function (key) {
                var index = _.findIndex(keys, function (o) { return o === key; });
                if (-1 !== index) {
                    keys.move(index, 0);
                }
            })
        }

        if (options && options.orderUnderride) {
            var orderUnderride = options.orderUnderride.slice();
            orderUnderride.forEach(function (key) {
                var index = _.findIndex(keys, function (o) { return o === key; });
                if (-1 !== index) {
                    keys.move(index, -1);
                }
            })
        }

        return _.zipObject(keys, _.map(keys, function (key) {
            if (!_.isNumber(obj[key]) && !_.isFunction(obj[key]) && !_.isArray(obj[key]) && _.isObject(obj[key])) {
                obj[key] = _.sortKeysDeepBy(obj[key], order, options);
            }
            return obj[key];
        }));
    }
});