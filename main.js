const express = require('express');
const path = require('path');
var compression = require('compression');
const PORT = process.env.PORT || 5000

var app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
