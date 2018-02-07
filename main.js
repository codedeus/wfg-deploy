const express = require('express');
const path = require('path');
var compression = require('compression');
const PORT = process.env.PORT || 5000

var app = express();
app.use(express.static(path.join(__dirname, '/')));
app.use(compression({filter: shouldCompress}));

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
	// don't compress responses with this request header
	return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
  
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
