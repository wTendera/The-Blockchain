const sha256 = require('sha256')
class Block {
  constructor(previousBlock, transaction) {
    this.previousBlock = previousBlock.fingerprint,
    this.timestamp = Date.now()
    this.transaction = transaction,
    this.fingerprint = this.calculateHash(previousBlock, this.timestamp, transaction)
  }


  calculateHash(previousBlock, timestamp, transaction) {
    return sha256(previousBlock + timestamp + transaction).toString()
  }


  isValidBlock(newBlock, parentBlock) {
    if(newBlock.previousBlock !== parentBlock.fingerprint) {
      return false
    }

    if(calculateHash(newBlock.index, parentBlock.fingerprint, newBlock.timestamp, newBlock.transaction) !== newBlock.fingerprint) {
      return false
    }

    return true
  }

}

module.exports = Block
