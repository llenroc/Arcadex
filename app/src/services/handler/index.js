import { Handler as Base, Tokens, constants } from '@wmin0/web3-extends'

import { SlotMachine, SlotMachinePrice, Capsule } from '@/services/machine'
import AddrConfig from '%/config'
import MachineContract from '#/Machine'
import SlotMachineContract from '#/SlotMachine'
import GachaContract from '#/Gacha'
import DekuFamilyContract from '#/DekuFamily'
import { sleep } from '@/utils'

class Handler extends Base {
  /*
  async waitAndExtractEvent(contract, name, ep) {
    let receipt = await ep
    return receipt.events[name].returnValues
  }
  */

  async waitReceipt(ep) {
    let tx = await new Promise((resolve, reject) => {
      ep.on('transactionHash', resolve)
      ep.on('error', reject)
    })
    let receipt
    while (!receipt) {
      receipt = await this.web3.eth.getTransactionReceipt(tx)
      if (receipt) {
        break
      }
      await sleep(100)
    }
    return receipt
  }

  async waitAndExtractEvent(contract, name, ep) {
    let receipt = await this.waitReceipt(ep)
    let abi = contract.jsonInterface.getEvent(name)
    let eventRaw = receipt.logs.find(
      (event) => event.topics[0] === abi.signature
    )
    return this.web3.eth.abi.decodeLog(
      abi.getInputs(),
      eventRaw.data,
      eventRaw.topics
    )
  }

  async getBlock(blockNumber) {
    return this.web3.eth.getBlock(blockNumber)
  }

  async getBlocks(blockNumbers) {
    return await Promise.all(blockNumbers.map(bn => this.getBlock(bn)))
  }

  async getBlockNumber() {
    return this.web3.eth.getBlockNumber()
  }

  async getNetworkID() {
    return this.web3.eth.net.getId()
  }

  loadContractByType({ type, addr }) {
    switch (type) {
      case '0': {
        return this.loadContract({ raw: SlotMachineContract, addr })
      }
      case '1': {
        return this.loadContract({ raw: GachaContract, addr })
      }
      default: {
        throw `unknown machine type: ${type}, addr: ${addr}`
      }
    }
  }

  async getDekuFamilyValuesByRange(key, start, end) {
    let addr = AddrConfig[key]
    if (!addr) {
      throw `invalid addr config key: ${key}`
    }
    let token = await this.loadToken({ addr, type: Tokens.ERC721Full })
    let accounts = await this.getAccounts()
    let contract = this.loadContract({ raw: DekuFamilyContract, addr })
    let ids = await contract.methods
      .tokenInfoOfOwnerByRange(accounts[0], start, end)
      .call()
    let uris = await Promise.all(ids.map((id) => {
      return token.tokenURI({ web3: this.web3, id })
    }))
    return ids.map((id, idx) => {
      let v = token.valueFromID(id)
      v.uri = uris[idx]
      return v
    })
  }

  async getERC20BalanceOf(key) {
    let addr = AddrConfig[key]
    if (!addr) {
      throw `invalid addr config key: ${key}`
    }
    let token = await this.loadToken({ addr, type: Tokens.ERC20 })
    return this.balanceOf({ token })
  }

  async getERC721FullBalanceOf(key) {
    let addr = AddrConfig[key]
    if (!addr) {
      throw `invalid addr config key: ${key}`
    }
    let token = await this.loadToken({ addr, type: Tokens.ERC721Full })
    return this.balanceOf({ token })
  }

  async getPricePagingBlockNumber(machine, account = constants.ZeroAddress) {
    let contract = this.loadContractByType(machine)
    let info = await contract.methods
      .pricePaging(account)
      .call()
    return info.start
  }

  async getMachine(key) {
    let addr = AddrConfig[key]
    if (!addr) {
      throw `invalid addr config key: ${key}`
    }
    let contract = this.loadContract({ raw: MachineContract, addr })
    let [
      type,
      description,
    ] = await Promise.all([
      contract.methods.getType().call(),
      contract.methods.getDescription().call(),
    ])
    type = type.toString()
    contract = this.loadContractByType({ type, addr })
    switch (type) {
      case '0': {
        let [
          prices,
          priceTokenAddr
        ] = await Promise.all([
          contract.methods.getPrices().call(),
          contract.methods.priceToken().call(),
        ])
        const token = await this.loadToken({
          addr: priceTokenAddr,
          type: Tokens.ERC20,
        })
        let { amount, prob } = prices
        let totalProb = prob.reduce((ret, p) => ret + parseInt(p, 10), 0)
        const sortedAmount = amount.slice()
        sortedAmount.sort((a, b) => token.valueFromAmount(b).amount - token.valueFromAmount(a).amount)
        prices = amount.map((a, idx) => new SlotMachinePrice({
          id: sortedAmount.indexOf(a),
          prob: prob[idx] / totalProb,
          value: token.valueFromAmount(a)
        }))
        return new SlotMachine({
          type,
          addr,
          description,
          prices,
        })
      }
      case '1': {
        return new Capsule({
          type,
          addr,
          description,
        })
      }
      default: {
        throw `unknown machine type: ${type}, addr: ${addr}`
      }
    }
  }

  async getMachineAccountStatus(machine) {
    if (!machine) {
      throw 'invalid machine'
    }

    let contract = this.loadContractByType(machine)
    let accounts = await this.getAccounts()
    let status = await contract.methods
      .accountStatus(accounts[0])
      .call()
    return status
  }

  async insertCoin(machine) {
    if (!machine) {
      throw 'invalid machine'
    }

    let contract = this.loadContractByType(machine)
    let accounts = await this.getAccounts()
    let ep = contract.methods
      .insertCoin()
      .send({ from: accounts[0] })

    let receipt = await this.waitReceipt(ep)
    return receipt
  }

  async drawRewardSlotMachine(machine) {
    if (!machine) {
      throw 'invalid machine'
    }

    let contract = this.loadContract({ raw: SlotMachineContract, addr: machine.addr })
    let accounts = await this.getAccounts()
    let ep = contract.methods
      .drawReward()
      .send({ from: accounts[0] })
    let getPriceEvent = await this.waitAndExtractEvent(contract, 'GetPrice', ep)
    return getPriceEvent.priceId
  }

  async drawRewardCapsule(machine) {
    if (!machine) {
      throw 'invalid machine'
    }

    let contract = this.loadContract({ raw: GachaContract, addr: machine.addr })
    let accounts = await this.getAccounts()
    let ep = contract.methods
      .drawReward()
      .send({ from: accounts[0] })
    let getPriceEvent = await this.waitAndExtractEvent(contract, 'GetPrice', ep)
    let token = await this.loadToken({
      addr: getPriceEvent.tokenContract,
      type: Tokens.ERC721
    })
    return token.valueFromID(getPriceEvent.tokenId)
  }

  async getEvent(machine, event, options) {
    let contract = this.loadContractByType(machine)
    return contract.getPastEvents(event, options)
  }

  getEventEmitter(machine, event, options) {
    let contract = this.loadContractByType(machine)
    return contract.events[event](options)
  }
}

export default Handler
