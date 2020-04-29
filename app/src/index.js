const express = require('express');

const app = express();
const port = 8080;

const expressWs = require('express-ws')(app);

app.use(express.static('public'));

var aWss = expressWs.getWss('/');

// Render the default page when browsing the root
app.get('/', function(req, res){
    res.sendfile('index.html', { root: __dirname + "/public/index.html" } );
});

// Websockets endpoint for the webui
app.ws('/getLogs', (ws, req) => {
    console.log("Received websocket connection");
    ws.on('message', function(msg) {
        console.log(`${(new Date().toISOString())}: Received pulse`);
        ws.send('Pulse');
    });
});

app.listen(port, () => console.log(`Running on port ${port}!`))
