/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

var expect = require('chai').expect;
var sorter = require('../../lib/sort-json-utils');

describe("Sort-JSON:", function () {

    describe("JSON to Text:", function () {
        it("JSON", function () {
            var jsonParser = JSON;
            var obj = { c: 3, b: 2, a: 1 };
            var text = sorter.jsonToText(jsonParser, obj);
            expect(text).to.equal("{\"c\":3,\"b\":2,\"a\":1}");
        });

        it("JSON5", function () {
            var jsonParser = require('JSON5');
            var obj = { c: 3, b: 2, a: 1 };
            var text = sorter.jsonToText(jsonParser, obj);
            expect(text).to.equal("{c:3,b:2,a:1}");
        });
    });

    describe("Text to JSON:", function () {
        it("JSON", function () {
            var jsonParser = JSON;
            var text = "{\"c\":3,\"b\":2,\"a\":1}";
            var obj = sorter.textToJSON(jsonParser, text);
            expect(obj).to.deep.equal({ c: 3, b: 2, a: 1 });
        });

        it("JSON5", function () {
            var jsonParser = require('JSON5');
            var text = "{c:3,b:2,a:1}";
            var obj = sorter.textToJSON(jsonParser, text);
            expect(obj).to.deep.equal({ c: 3, b: 2, a: 1 });
        });
    });

    describe("Sort JSON:", function () {
        it("Simple", function () {
            var obj = { c: 3, b: 2, a: 1 };
            var sortedObj = sorter.sortJSON(obj);
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a:1,b:2,c:3}");
        });

        it("Nested", function () {
            var obj = { c: { b: 4, a: 3 }, b: 2, a: 1 };
            var sortedObj = sorter.sortJSON(obj);
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a:1,b:2,c:{a:3,b:4}}");
        });

        it("Array", function () {
            var obj = { c: [ 4, 3 ], b: 2, a: 1 };
            var sortedObj = sorter.sortJSON(obj);
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a:1,b:2,c:[4,3]}");
        });


        it("Reverse Simple", function () {
            var obj = { a: 3, b: 2, c: 1 };
            var sortedObj = sorter.sortJSON(obj, ['desc']);
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{c:1,b:2,a:3}");
        });
    });
});