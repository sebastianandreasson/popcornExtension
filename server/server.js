var io = require('socket.io').listen(1337)
var exec = require('child_process').exec
var spawn = require('child_process').spawn
let child

console.log('listening on ' + 1337)
io.sockets.on('connection', (socket) => {
  console.log('new connection')
  socket.on('torrent', function(data){
    var parsedData = JSON.parse(data)

    if (child) {
      child.kill()
      child = null
    }
    const cute = `node ./app.js "${parsedData.magnet}" --vlc`
    console.log(cute)
    child = exec(cute, () => {
      child.stdout.on('data', code => console.log('stdout: ' + code))
      child.stderr.on('data', code => console.log('stdout: ' + code))
      child.on('close', code => console.log('closing code: ' + code))
    })
  })
})
