const net = require('net')
const JsonSocket = require('json-socket')

const clients = []

const server = net.createServer(socket => {
  const sock = new JsonSocket(socket)
  clients.push(sock)
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
      clients.forEach(sckt => {
        if (sckt !== sock)
        sckt.sendMessage(msg)
      })
    } else if (msg.type == 'Perkenalan') {
      const nama = msg.dataUser.nama
      const scktCurrent = clients.find(sckt => sckt == sock)
      if (scktCurrent) scktCurrent.nama = nama
      console.log(`Client dengan nama ${nama} terkoneksi ke Server`)

    } else if (msg.type == 'private') {
      console.log(`Private message untuk ${msg.to}:`)
      console.log(msg.pesan)
      const clientTujuan = clients.find(sckt => sckt.nama == msg.to)
      if (!clientTujuan) return console.log('User tujuan sedang tidak terkoneksi dengan Server')
      clientTujuan.sendMessage(msg)
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
