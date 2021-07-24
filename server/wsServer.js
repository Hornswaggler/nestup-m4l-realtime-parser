const {Server} = require('ws');
var net = require('net');
const { dispatch } = require('./store');

const testPort = async ({port}) => new Promise((resolve, reject) => {
  try{
    const server = net.createServer();

    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        return resolve(false);
      }
      console.error(err);
      return reject(false);
    });
  
    server.once('listening', () => {
      try{
        server.close();
      } catch(e) {
        console.error(e);
        reject(false);
      }
      resolve(true);
    });
  
    server.listen(port);
  } catch (e){
    console.error(e);
    reject(false);
  }
});

const handlers = {
  pattern:  pattern => dispatch('queuePattern', pattern)
}

const socket = {};
const startServer = async (callback) => {
  try {
    let port = 8080;
    let foundPort = false;
    while (!foundPort) {
      try{
        if(!await testPort({port})){
          port += 1;
          continue;
        };

        foundPort = true
      }catch(e){
        console.error(e);
        f
      }
    }

    const connect = async () => {
      const result = new Promise((resolve, reject) => {
        const wss = new Server({ port });
        wss.on('connection', function connection(ws) {
          Object.assign(socket, ws);
          ws.send('something');
          
          ws.on('message', function incoming(message) {
            try{
              const payload = JSON.parse(message);
              Object.keys(payload).map(key => {
                if(!handlers[key]) throw new Error(`Could not find handler: ${key}`);
                handlers[key](payload[key]);
              });
              callback(payload, ws);
            } catch(e) {
              console.error(e);
              reject(e);
            }
          });
        });
        return resolve()
      });
      return result;
    };

    const ws = await connect();
    console.log('ws',ws);
    
    console.log(`Websockets initialized on port: ${port}`);
    return {port};
  } catch(e) {
    console.error(e);
  }
};

module.exports = {
  startServer,
  socket
};