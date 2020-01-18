const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

const app = express();

// API file for interacting with the scrapper
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular dist output folder
app.use(express.static(path.join(__dirname, 'dist/toolforces')));

// API location
app.use('/api', api);

// Sending all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/toolforces/index.html'));
});

// Setting port
const port = process.env.PORT || 8080;
app.set('port', port);

// Creating a server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});