var io = require('socket.io').listen(1337)
var exec = require('child_process').exec
var spawn = require('child_process').spawn

console.log('listening on ' + 1337)
io.sockets.on('connection', (socket) => {
  console.log('new connection')
  socket.on('torrent', function(data){
    var parsedData = JSON.parse(data)
    console.log(parsedData)

    const cute = `node ./app.js "${parsedData.magnet}" --vlc`
    console.log(cute)
    exec(cute, function callback(error, stdout, stderr){
      console.log('started', error, stdout, stderr)
    })
  })
})

exec(`osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e echo hello`, () => {

})
