require('node-self');

const { sendOnLoad} = require('./server/maxInterface');

// // render();
// render(8080);

require('./server/maxHandler');
sendOnLoad();

