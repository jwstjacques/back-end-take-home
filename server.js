const express = require('express');
const db = require('./server/models');
const http = require('http');

const flights = require('./server/routes/api/flights');

const app = express();

app.get('/', (req, res) => res.send('flight-routes'));

// Use routes
app.use('/api/flights', flights);

const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`Server running on port ${port}`));

db.sequelize.sync().then(function() {
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});

module.exports = app;
