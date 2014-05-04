var fs = require('fs');
var util = require('util');
var Handlebars = require('handlebars');
var crypto = require('crypto');

exports.parseFile = parseFile = function(filePath) {

    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        data = '['+data.split("}{").join("},{")+']';

        parse(data);
    });

}

exports.parse = parse = function(jsonString) {
    data = JSON.parse(jsonString);

    output = [];
    files = {};

    //console.log('<pre>', data);process.exit();

    data.forEach(function(testEvent){
        if(testEvent.event == 'test') {

            //let's work out file
            var parts = testEvent.test.split('::');

            if(files[testEvent.suite] == undefined) {
                files[testEvent.suite] = output.length;
                var testFile = {name: testEvent.suite, tests: [], cssClass: 'success'};
                output.push(testFile)
            } else {
                var testFile = output[files[testEvent.suite]];
            }

            if(testEvent.message.indexOf('Incomplete Test:') != -1) {
                testEvent.status = 'incomplete';
            }

            if(testEvent.message.indexOf('Skipped Test:') != -1) {
                testEvent.status = 'skipped';
            }

            switch(testEvent.status) {
                case 'pass':
                    testEvent.status = 'OK';
                    cssClass = 'success';
                    sortValue = 0;
                    failure = null;
                    break;
                case 'error':
                    testEvent.status = 'Error'
                    cssClass = 'danger';
                    testFile.cssClass = cssClass;
                    sortValue = 3;
                    failure = true;
                    break;
                case 'fail':
                    testEvent.status = 'Failure'
                    cssClass = 'danger';
                    testFile.cssClass = cssClass;
                    sortValue = 2;
                    failure = true;
                    break;
                case 'incomplete':
                    testEvent.status = 'Incomplete'
                    cssClass = 'warning';
                    sortValue = 2;
                    failure = true;
                    break;
                case 'skipped':
                    testEvent.status = 'Skipped'
                    cssClass = 'warning';
                    sortValue = 2;
                    failure = true;
                    break;
                default:
                    console.log('<pre>Unknown result: ', testEvent.status);
                    console.log(testEvent);
                    process.exit(1);
            }

            var ms = (testEvent.time % 1) * 1000;

            if(ms < 1) {
                ms = '< 1'
            } else {
                ms = Math.round(ms);
            }

            var testDesc = {
                time: ms+'ms',
                status: testEvent.status,
                test: parts[1],
                trace: testEvent.trace,
                message: testEvent.message,
                output: testEvent.output,
                cssClass: cssClass,
                sort: sortValue,
                failure: failure
            }

            var shasum = crypto.createHash('sha1');
            shasum.update(JSON.stringify(testDesc));

            testDesc.hash = shasum.digest('hex');

            testFile.tests.push(testDesc);
        }
    });

    //console.log('<pre>', files);process.exit();

    output.sort(function(a, b) {
        var retVal = null;

        a.tests.forEach(function(test){
            if(test.status != 'OK') return retVal = -1;
        });

        if(retVal != null) return retVal;

        b.tests.forEach(function(test){
            if(test.status != 'OK') {
                return retVal = 1;
            }
        });

        if(retVal != null) return retVal;

        return 0;
    });

    output.map(function(val, index, output){
        output[index].tests.sort(function(a,b){
            if(a.sortablesort == b.sort) return 0;

            return a.sort > b.sort ? -1 : 1;
        });
    })


    fs.readFile(__dirname+'/templates/tests.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        var template = Handlebars.compile(data);

        var htmlTests = template({files: output});


        fs.readFile(__dirname+'/templates/index.html', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }

            var template = Handlebars.compile(data, {noEscape: true});

            var out = template({html: {tests: htmlTests}});

            process.stdout.write(out);

        });

    });

}