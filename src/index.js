const chain = require('./chain')

const Chain = new chain()
const request = require('superagent')
const express = require('express')
const app = express()
const peers = []

const port = process.env.PORT || 3000

request.post('localhost:3010/register').send({port: port}).then(res => {
            console.log("Successfully registered")
            request.get(`localhost:3010/peers`).then(res => {
                console.log(`Successfully saved ${res.body.length} peers`)
                peers.concat(res.body)
            }, err => console.log("Error while requesting peers:", err))
        }, err => console.log("Error while registering:", err)
    )


app.get('/', function (req, res) {
    res.send(`Current Chain: ${JSON.stringify(Chain.blocks)}`)
})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})
