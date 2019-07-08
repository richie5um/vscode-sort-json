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
            var obj = { c: [4, 3], b: 2, a: 1 };
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

        it("Overrides", function () {
            var obj = { e: 5, c: 3, f: 6, b: 2, d: 4, a: 1 };
            var sortedObj = sorter.sortJSON(obj, ['asc'], { orderOverride: ['c', 'd'] });
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{c:3,d:4,a:1,b:2,e:5,f:6}");
        });

        it("Reverse Overrides", function () {
            var obj = { e: 5, c: 3, f: 6, b: 2, d: 4, a: 1 };
            var sortedObj = sorter.sortJSON(obj, ['desc'], { orderOverride: ['c', 'd'] });
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{c:3,d:4,f:6,e:5,b:2,a:1}");
        });

        it("Underrides", function () {
            var obj = { e: 5, c: 3, f: 6, b: 2, d: 4, a: 1 };
            var sortedObj = sorter.sortJSON(obj, ['asc'], { orderUnderride: ['c', 'd'] });
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a:1,b:2,e:5,f:6,c:3,d:4}");
        });

        it("Reverse Underrides", function () {
            var obj = { e: 5, c: 3, f: 6, b: 2, d: 4, a: 1 };
            var sortedObj = sorter.sortJSON(obj, ['desc'], { orderUnderride: ['c', 'd'] });
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{f:6,e:5,b:2,a:1,c:3,d:4}");
        });

        it("Array of Objects", function () {
            var obj = { c: [{ e: 5, d: 4 }, { g: 7, f: 6 }], b: 2, a: 1 };
            var sortedObj = sorter.sortJSON(obj);
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a:1,b:2,c:[{d:4,e:5},{f:6,g:7}]}");
        });

    });

    describe("Sort JSON (KeyLength):", function () {
        it("Simple", function () {
            var obj = { cc: 3, bbb: 2, a: 1 };
            var sortedObj = sorter.sortJSON(obj, ['asc'], {}, 'keyLength');
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a:1,cc:3,bbb:2}");
        });

        it("Reverse Simple", function () {
            var obj = { cc: 3, bbb: 2, a: 1 };
            var sortedObj = sorter.sortJSON(obj, ['desc'], {}, 'keyLength');
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{bbb:2,cc:3,a:1}");
        });

    });

    describe("Sort JSON (AlphaNum):", function () {
        it("Simple", function () {
            var obj = { a10: 3, a2: 2, a1: 1, b11: 3, b2: 2, b0: 1 };
            var sortedObj = sorter.sortJSON(obj, ['asc'], {}, 'alphaNum');
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{a1:1,a2:2,a10:3,b0:1,b2:2,b11:3}");
        });

        it("Reverse Simple", function () {
            var obj = { a10: 3, a2: 2, a1: 1, b11: 3, b2: 2, b0: 1 };
            var sortedObj = sorter.sortJSON(obj, ['desc'], {}, 'alphaNum');
            expect(sortedObj).to.deep.equal(obj);

            var jsonParser = require('JSON5');
            var text = sorter.jsonToText(jsonParser, sortedObj);
            expect(text).to.equal("{b11:3,b2:2,b0:1,a10:3,a2:2,a1:1}");
        });

    });
});
