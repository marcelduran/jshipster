/*global JSLINT*/
/*jslint browser: true*/

(function (doc) {
    'use strict';
    var
        // messages
        msg = {
            semicolon: 'Expected ; and instead saw',
            comma: [
                'Unexpected space between ',
                ',.',
                'Expected , at column'
            ],
            tilde: 'Unexpected ~',
            space: [
                'Expected exactly one space between',
                'Missing space between'
            ],
            assign: 'Expected a conditional expression and instead saw an assi',
            condition: 'Weird condition',
            curly: 'Expected { and instead saw',
            ret: 'Expected return',
            expfunc: 'Wrap an immediate function invocation in parentheses',
            coercion: ['Expected ===', 'Expected !==']
        },

        meterURL = 'http://chart.apis.google.com/chart?chs=400x200&cht=gom&' +
        'chco=FF0000,FF8040,FFFF00,006400&chxt=x,y&chls=5%7C15&' +
        'chxl=0:%7C{text}%7C1:%7Csquare%7Cregular%7Chipster&chd=t:{value}',

        // functions
        hip, printResults, check, setMeter,

        // dom elements
        meterImg,
        source = doc.getElementById('source'),
        hipit = doc.getElementById('hipit'),
        output = doc.getElementById('output'),
        results = doc.getElementById('results');

    check = function (reason, what, comma) {
        var i, len, found;

        if (comma) {
            found = (reason.indexOf(what[0]) > -1 &&
                reason.indexOf(what[1]) === reason.length - 2) ||
                reason.indexOf(what[2]) > -1;
        } else {
            what = [].concat(what);

            for (i = 0, len = what.length; !found && i < len; i += 1) {
                found = reason.indexOf(what[i]) > -1;
            }
        }

        return found;
    };

    hip = function () {
        var
            hipster = {
                semicolon: 0,
                comma: 0,
                tilde: 0,
                space: 0,
                assign: 0,
                condition: 0,
                curly: 0,
                ret: 0,
                expfunc: 0,
                coercion: 0
            },
            option = {
                indent: 2
            },
            jslintResult = JSLINT(source.value, option),
            errors = JSLINT.data().errors || [];

        console.log(errors.map(function (err, i) {
            return '[' + i + '] ' + err.line + ': ' +
                err.reason.replace(/[\\']/g, '');
        }));

        errors.forEach(function (err) {
            var i, len, found, key,
                reason = err.reason.replace(/[\\']/g, ''),
                keys = Object.keys(msg);

            for (i = 0, len = keys.length; !found && i < len; i += 1) {
                key = keys[i];
                if (check(reason, msg[key], key === 'comma')) {
                    hipster[key] += 1;
                    found = true;
                }
            }
        });

        printResults(hipster);
    };

    setMeter = function (value) {
        var text;

        if (!meterImg) {
            meterImg = doc.createElement('img');
            doc.getElementById('meter').appendChild(meterImg);
        }

        if (value < 25) {
            text = 'not cool';
        } else if (value < 50) {
            text = 'pretty fly';
        } else if (value < 75) {
            text = 'groovy';
        } else {
            text = 'right on';
        }
        meterImg.src = meterURL.replace('{value}', value)
            .replace('{text}', encodeURIComponent(text));
    };

    printResults = function (hipster) {
        var sum = 0,
            lines = source.value.split(/\r\n?|\n/).length;

        Object.keys(hipster).forEach(function (key) {
            sum += hipster[key];
        });

        setMeter(Math.round(sum / lines * 100));
        results.innerHTML = [
            'missing semicolon: ' + hipster.semicolon,
            'comma at the begin: ' + hipster.comma,
            'clever ~: ' + hipster.tilde,
            'messy space: ' + hipster.space,
            'clever assignment: ' + hipster.assign,
            'clever conditional: ' + hipster.condition,
            'curly braces are for losers: ' + hipster.curly,
            'early return: ' + hipster.ret,
            'clever function expression: ' + hipster.expfunc,
            'type coercion: ' + hipster.coercion,
            '-----',
            'sum: ' + sum,
            'lines: ' + lines,
            'ratio: ' + (sum / lines)
        ].join('<br>');

        output.className = '';
    };

    hipit.addEventListener('click', hip, false);
}(document));
