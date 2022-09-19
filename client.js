const readline = require('readline')
const net = require('net')
const JsonSocket = require('json-socket')

const nama = process.argv[2] || 'Anonim'


const client = new JsonSocket(new net.Socket())
const x = Math.round(Math.random() * 10)

const dataUser = {
  nama,
  alamat: [
    {
      nama: 'Rumah',
      alamat: 'Pasar Kemis, Tangerang'
    },
    {
      nama: 'Kantor',
      alamat: 'Jl. Juanda no 1, Neglasari'
    }
  ]
}

client.on('connect', () => {
  console.log('Connected to server')
  // kirim()
  const msg = {
    type: 'Perkenalan',
    dataUser
  }
  client.sendMessage(msg)
  askInput()
})

// client.on('data', data => {
//   console.log(data.toString())
// })

client.on('message', msg => {
  if (msg.type == 'Message Biasa') {
    console.log('Pesan baru diterima:')
    console.log(msg.pesan)
  } else if (msg.type == 'private') {
    console.log(`Private message dari ${msg.from}:`)
    console.log(msg.pesan)
  }
})

client.on('error', err => {
  console.log('Terjadi error pada koneksi')
  console.log(err.message)
})

// function kirim() {
//   setInterval(() => {
//   client.write(`Hallo server (dari client ${x})`)
//   }, 2000)
// }

client.connect(40000, 'localhost')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askInput() {
  rl.question('Send Message:', input => {
    if (input == 'exit') return rl.close()
    
    const sendTyp = input.split('>')
    if (sendTyp[0] == 'private') {
      const msg = {
        type: 'private',
        from: nama,
        to: sendTyp[1],
        pesan: sendTyp[2]
      }
      client.sendMessage(msg)
    } else {
      const msg = {
        type: 'Message Biasa',
        pesan: input
      }
      client.sendMessage(msg)
    }
    askInput()
  })
}
