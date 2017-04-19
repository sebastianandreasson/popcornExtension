
var connected = false
var socket = io.connect('http://localhost:1337')

socket.on('connect', function (data) {
  connected = true
  chrome.extension.sendRequest({
    response: true,
    function: 'checkConnection',
    connected: connected
  })
})

socket.on('disconnect', function () {
  connected = false
})

chrome.extension.onRequest.addListener(function (msg, sender, respond) {
  switch(msg.function) {
    case 'torrent':
      if (socket && connected) {
        watchTorrent(msg.magnet)
      }
      break
    case 'connect':
      if (!connected) {
        socket = io.connect('http://localhost:1337')
      }
      break
    case 'checkConnection':
      chrome.extension.sendRequest({
        response: true,
        function: 'checkConnection',
        connected: connected
      })
      break;
    default:
        break
  }
})

function watchTorrent (magnet) {
  var data = {
    magnet: magnet
  }
  socket.emit('torrent', JSON.stringify(data))
}
