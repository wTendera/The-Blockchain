
const request = require('superagent')
const express = require('express')
const bodyParser = require('body-parser');
const _ = require('lodash')
const Chain = require('./chain')
const Block = require('./block')
const port = process.env.PORT || 3000

const app = express()

let peers = []
let chain = null


app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
    res.send({blocks: (chain || {}).blocks, latestBlock: (chain || {}).latestBlock, genesisBlock: (chain || {}).genesisBlock})
})

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


app.post('/block', function (req, res) {

    if(chain.addBlock(req.body)) {
        console.log(`New block added, latest block: ${req.body.fingerprint}`)
        res.sendStatus(200)
    } else {
        res.sendStatus(403)
    }
})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})



request.post('localhost:3010/register').send({port: port})
    .then(res => {
        console.log("Successfully registered")
    }, err => console.log("Error while registering:", err))


setInterval(function(){
    let block = new Block(chain.latestBlock, {from: 'me', to: 'world', kisses: Math.floor((Math.random() * 10) + 1)})
    chain.addBlock(block)
    peers.forEach(peer => {
        if(peer.endsWith(port)) {
            // omit request to yourself
            return
        }
        request.post(`${peer}/block`).send(block).then((res) => {
            let body = res.body || {}
            chain = new Chain(body.blocks, body.latestBlock, body.genesisBlock)
            console.log(`Peer ${peer} accepted transaction ${block.fingerprint}`)
        }, err => `Peer ${peer} didn't accept transaction ${block.fingerprint}`)
    })
}, 3000);



