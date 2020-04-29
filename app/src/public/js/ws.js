$( document ).ready(function() {

    // Open a websocket to backend to get the logstash output
    connectToBackend();

});


async function connectToBackend() {

    let t;

    try {
        var ws = await new WebSocket("ws://localhost:8080/getLogs");
    } catch (err) {
        console.error("Unable to connect to the backend")
        throw "Unable to connec to the backend";
    }

    ws.onopen = function() {
        $('#websocket-status-button').removeClass('btn-danger').addClass('btn-success').html('Websocket connected');
        t = setInterval(() => {
            $('div#pulse-area')
            .append(`${(new Date().toISOString())}: Sending pulse<br>`);
            ws.send('Pulse');
        }, 2000);
    };

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        $('div#pulse-area')
            .append(`${(new Date().toISOString())}: Received pulse<br>`);
    };

    ws.onerror = function (err) {
        $('#websocket-status-button').removeClass('btn-success').addClass('btn-danger').html('Error connecting to backend');
        ws.close();
    }

    ws.onclose = function() { 
        $('#websocket-status-button').removeClass('btn-success').addClass('btn-danger').html('Backend closed the connection');
        let reconn = setInterval(async () => {
            try {
                await connectToBackend();
                clearInterval(reconn);
            } catch (e) {
                console.error("Reconnect failed");
                throw "Reconnect failed"
            };
        }, 1000);
    };

}
