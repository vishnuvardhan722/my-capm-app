const cds = require('@sap/cds');
const proxy = require('@sap/cds-odata-v2-adapter-proxy'); // or use @cap-js-community/odata-v2-adapter

cds.on('bootstrap', (app) => {
    app.use(proxy()); // Enable OData V2 support
});

// Start the server
module.exports = cds.server;
