/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  *
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
var date = new Date();
var dd = date.getDate();
var mm = date.getMonth()+1;
var yyyy = date.getFullYear();
if(dd<10){
    dd='0'+dd;
}
if(mm<10){
    mm='0'+mm;
}
var today = dd+'-'+mm+'-'+yyyy;
exports.config = {
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the
    // directory from which `wdio` was called. Notice that, if you are calling
    // `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script)
    // then the current working directory is where your package.json resides, so
    // `wdio` will be called from there.
    //
    specs: [
        './integrationtests/src/features/login.feature',
        './integrationtests/src/features/bookshelf.feature',
        //'./integrationtests/src/features/Book/hotspotFeature.feature',
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities
    // at the same time. Depending on the number of capabilities, WebdriverIO
    // launches several test sessions. Within your capabilities you can
    // overwrite the spec and exclude options in order to group specific specs
    // to a specific capability.
    //
    // First, you can define how many instances should be started at the same
    // time. Let's say you have 3 different capabilities (Chrome, Firefox, and
    // Safari) and you have set maxInstances to 1; wdio will spawn 3 processes.
    // Therefore, if you have 10 spec files and you set maxInstances to 10, all
    // spec files will get tested at the same time and 30 processes will get
    // spawned. The property handles how many capabilities from the same test
    // should run tests.
    //
    maxInstances: 5,
    //
    // If you have trouble getting all important capabilities together, check
    // out the Sauce Labs platform configurator - a great tool to configure your
    // capabilities: https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [{
        // maxInstances can get overwritten per capability. So if you have an
        // in-house Selenium grid with only 5 firefox instance available you can
        // make sure that not more than 5 instance gets started at a time.
        maxInstances: 5,
        //
        browserName: 'chrome',
         'chromeOptions': {
            'args': ['start-maximized']
  }
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async
    // way e.g. using promises you can set the sync option to false.
    sync: true,
    //
    // Level of logging verbosity: silent | verbose | command | data | result |
    // error
    logLevel: 'error',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',
    //
    // Set a base URL in order to shorten url command calls. If your url
    // parameter starts with "/", then the base url gets prepended.
    baseUrl: 'https://etext-qa-stg.pearson.com',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 50000,

    //protocol: 'https',
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Initialize the browser instance with a WebdriverIO plugin. The object
    // should have the plugin name as key and the desired plugin options as
    // properties. Make sure you have the plugin installed before running any
    // tests. The following plugins are currently available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They
    // enhance your test setup with almost no effort. Unlike plugins, they don't
    // add new commands. Instead, they hook themselves up into the test process.
    //services: ['selenium-standalone'],
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework
    // installed before running any tests.
    framework: 'cucumber',
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: http://webdriver.io/guide/testrunner/reporters.html
    reporters: ['dot','allure'],
     reporterOptions: {
        allure: {
            outputDir: 'allure-results_'+today
        }
    },
    //
    // If you are using Cucumber you need to specify the location of your step
    // definitions.
    cucumberOpts: {
        require: [
            './integrationtests/src/steps/given.js',
            './integrationtests/src/steps/then.js',
            './integrationtests/src/steps/when.js',
        ], // <string[]> (file/dir) require files before executing features
        backtrace: false, // <boolean> show full backtrace for errors
        compiler: [
            'js:babel-register',
        ], // <string[]> ("extension:module") require files with the given
           // EXTENSION after requiring MODULE (repeatable)
        dryRun: false, // <boolean> invoke formatters without executing steps
        failFast: false, // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output
                            // format, optionally supply PATH to redirect
                            // formatter output (repeatable)
        colors: true, // <boolean> disable colors in formatter output
        snippets: true, // <boolean> hide step definition snippets for pending
                        // steps
        source: true, // <boolean> hide source uris
        profile: [], // <string[]> (name) specify the profile to use
        strict: true, // <boolean> fail if there are any undefined or pending
                       // steps
        tags: require('./integrationtests/src/tagProcessor')(process.argv),
        // <string[]> (expression) only execute the features or scenarios with
        // tags matching the expression
        timeout: 50000,     // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to
                                           // treat undefined definitions as
                                           // warnings.
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test
    // process in order to enhance it and to build services around it. You can
    // either apply a single function or an array of methods to it. If one of
    // them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    // Gets executed once before all workers get launched.
    // onPrepare: function onPrepare(config, capabilities) {
    // },
    //
    // Gets executed before test execution begins. At this point you can access
    // all global variables, such as `browser`. It is the perfect place to
    // define custom commands.
    before: function before() {
        /**
         * Setup the Chai assertion framework
         */
        const chai = require('chai');

        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();

      //Launch the site and Login
        browser.url("/eplayer")
        browser.waitForVisible("#username", 5000);
        browser.setValue("#username", "et1_qaautomation_edu2");
        browser.setValue("#password", "Pa55word@123");
        browser.click("#mainButton");
    },
    //
    // Hook that gets executed before the suite starts
    //beforeSuite: function beforeSuite(suite) {
    //    browser.URL('https://etext-qa-stg.pearson.com/eplayer');
    //    setbrowser.username('et1_qaautomation_edu1');
    //    setbrowser.password('Pa55word@123');
    //    browser.mainButton.click();

    //},
    //
    // Hook that gets executed _before_ a hook within the suite starts (e.g.
    // runs before calling beforeEach in Mocha)
    //beforeHook: function beforeHook() {
    //  },
    //
    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs
    // after calling afterEach in Mocha)
    // afterHook: function afterHook() {
    // },
    //
    // Function to be executed before a test (in Mocha/Jasmine) or a step (in
    // Cucumber) starts.
    // beforeTest: function beforeTest(test) {
    // },
    //
    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function beforeCommand(commandName, args) {
    // },
    //
    // Runs after a WebdriverIO command gets executed
    // afterCommand: function afterCommand(commandName, args, result, error) {
    // },
    //
    // Function to be executed after a test (in Mocha/Jasmine) or a step (in
    // Cucumber) starts.
    // afterTest: function afterTest(test) {
    // },
    //
    // Hook that gets executed after the suite has ended
    // afterSuite: function afterSuite(suite) {
    // },
    //
    // Gets executed after all tests are done. You still have access to all
    // global variables from the test.
    // after: function after(result, capabilities, specs) {
    // },
    //
    // Gets executed after all workers got shut down and the process is about to
    // exit. It is not possible to defer the end of the process using a promise.
    // onComplete: function onComplete(exitCode) {
    // }
};
