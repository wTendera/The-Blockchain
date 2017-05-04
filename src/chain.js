const Block = require('./block')

class Chain {
  constructor() {
    //check in local files if something was stored before
    this.genesisBlock = new Block({fingerprint: 'root'}, null)
    this.blocks = {}
    this.blocks[this.genesisBlock.fingerprint] = this.genesisBlock
    this.latestBlock = this.genesisBlock.fingerprint
  }

  addTransaction(transaction) {
    let newBlock = new Block(this.blocks[this.latestBlock], transaction)
    this.blocks[newBlock.fingerprint] = newBlock
    this.latestBlock = newBlock.fingerprint
    // propagate this change to world
  }


  //chain = {}, latestBlockFingerprint = fingerprint
  isValidChain(chain, latestBlockFingerprint) {
    let currentBlockFingerprint = latestBlockFingerprint

    while(currentBlockFingerprint !== this.genesisBlock.fingerprint) {
      if(currentBlockFingerprint == null) {
        return false
      }

      let currentBlock = chain[currentBlockFingerprint]
      let previousBlock = chain[currentBlock.previousBlock]

      if(!isValidBlock(currentBlock, previousBlock)) {
        return false
      }

      currentBlockFingerprint = previousBlock.fingerprint
    }

    return true
  }

  replaceChainIfNecessary(newChain) {
    if(Object.keys(newChain).length > Object.keys(chain) && isValidChain(newChain)) {
      chain = newChain
      return true
    }

    return false
  }

}

module.exports = Chain
