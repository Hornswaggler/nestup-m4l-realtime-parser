require('node-self');

const { sendOnLoad} = require('./server/maxInterface');

require('./server/maxHandler');
sendOnLoad();

