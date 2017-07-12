const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const morgan = require('morgan');
const app = express();


const endpoint = require('./service/routes/endpoint');


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false ,limit: '50mb'}));

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));



app.use('/service', endpoint);


// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Start the app by listening on the default
// Heroku port
// Create HTTP server.
const server = http.createServer(app);
// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));