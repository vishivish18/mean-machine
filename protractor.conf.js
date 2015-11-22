exports.config = {
    framework: 'mocha',
    specs: [
        'tests/e2e/**/*.spec.js'
    ],
    mochaOpts: {
        enableTimeouts: false
    },
    onPrepare: function() {
        process.env.PORT = 3001
        require('./app')
    }
}
