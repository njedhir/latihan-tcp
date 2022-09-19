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

client.on('data', data => {
  console.log(data.toString())
})

client.on('error', err => {
  console.log('Terjadi error pada koneksi')
  console.log(err.message)
})

function kirim() {
  setInterval(() => {
  client.write(`Hallo server (dari client ${x})`)
  }, 2000)
}

client.connect(40000, 'localhost')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askInput() {
  rl.question('Send Message:', input => {
    if (input == 'exit') return rl.close()
    const msg = {
      type: 'Message Biasa',
      pesan: input
    }
    client.sendMessage(msg)
    askInput()
  })
}
