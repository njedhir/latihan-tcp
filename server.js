const net = require('net')
const JsonSocket = require('json-socket')

const server = net.createServer(socket => {
  const sock = new JsonSocket(socket)
  // socket.on('data', data => {
  //   console.log(data.toString())
  //   socket.write('Halo client! (dari server')
  // })
  socket.on('error', err => {
    console.log('Terjadi error dari client')
    console.log(err.message)
  })
  sock.on('message', msg => {
    if (msg.type == 'Message Biasa') {
      console.log('Pesan dari client:')
      console.log(msg.pesan)
    } else if (msg.type == 'Perkenalan') {
      const nama = msg.dataUser.nama
      console.log(`Client dengan nama ${nama} terkoneksi ke Server`)
    }
  })
})
server.on('listening', () => {
  console.log('Server started on port 40000')
})
server.on('connection', socket => {
  console.log('Client connected')
  console.log(socket.remoteAddress)
})
server.listen(40000)
