let bodyParser = require('body-parser');
let express = require('express');
let path = require('path');
let request = require('request');


let app = express();

app.use(bodyParser());
app.use('/', express.static(path.join(__dirname, 'dist/')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.get('/', function(err, res, req) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

app.listen(3000, () => console.log('Listening on 3000 ---'));
