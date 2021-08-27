var debug = require('debug')('challenge-application');
var app = require('../../src/app');

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function() {
  debug('Server listening on port ' + server.address().port);
});