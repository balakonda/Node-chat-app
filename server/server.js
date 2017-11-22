const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;
var app = express();

app.use(express.static(publicPath));

app.listen(PORT, () => {
	console.log('App is running at ' + PORT);
});