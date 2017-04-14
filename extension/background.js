
var connected = false;
var socket = io.connect('http://localhost:1337', {
    'force new connection': false,
    'reconnect': true,
    'reconnection delay': 1000,
    'max reconnection attempts': 10
});


socket.on('connect', function (data) {
    connected = true;
    console.log('connected!');
    chrome.extension.sendRequest({
        "response": true,
        "function": "checkConnection",
        "connected": connected
    });
});

socket.on('disconnect', function () {
    console.log('disconnected!');
    connected = false;
    socket = null;
});

chrome.extension.onRequest.addListener(function (msg, sender, respond) {
    switch(msg.function) {
        case 'torrent':
            console.log('watch torrent!');
            watchTorrent(msg.magnet);
            break;
        case 'connect':
            console.log('attempt connect');
            socket = io.connect('http://localhost:1337', {
                'force new connection': false,
                'reconnect': true,
                'reconnection delay': 1000,
                'max reconnection attempts': 10
            });
            break;
        case 'checkConnection':
            console.log('check connection');
            chrome.extension.sendRequest({
                "response": true,
                "function": "checkConnection",
                "connected": connected
            });
            break;
        default:
            break;
    };
});

function watchTorrent (magnet) {
    var data = {
        "magnet": magnet
    };
    socket.emit('torrent', JSON.stringify(data));
};
