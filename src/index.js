
const request = require('superagent')
const express = require('express')
const bodyParser = require('body-parser');
const _ = require('lodash')
const Chain = require('./chain')


const app = express()

let peers = []

const port = process.env.PORT || 3000
let chain = null



request.post('localhost:3010/register').send({port: port})
    .then(res => {
            console.log("Successfully registered")
        }, err => console.log("Error while registering:", err))

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/peers', function (req, res) {
    peers = _.uniq(peers.concat(req.body))
    console.log("Peers updated:", peers.length)

    if(peers.length <= 1) {
        chain = new Chain()
    } else {
        request.get(`${peers[0]}`).then((res) => {
            let body = res.body || {}
            chain = new Chain(body.blocks, body.latestBlock, body.genesisBlock)
            console.log(`Chain request completed, latest block: ${chain.latestBlock}`)
        }, err => "Something went wrong while requesting chain, try again.")
    }

    res.sendStatus(200)
})

app.get('/', function (req, res) {
    res.send({blocks: (chain || {}).blocks, latestBlock: (chain || {}).latestBlock, genesisBlock: (chain || {}).genesisBlock})
})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})
