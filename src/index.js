const chain = require('./chain')

const Chain = new chain()

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send(`Current Chain: ${JSON.stringify(Chain.blocks)}`)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
