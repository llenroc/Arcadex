import Handler from '@/services/handler'
import EventEmitter from 'events'
import config from '@/config'
import Web3 from 'web3'

const BALANCE_POLLING_PERIOD = 10 * 1000

let cachedNetworkVersion
let cachedSelectedAddress

class Backend extends EventEmitter {
  constructor(ethWeb3, walletWeb3) {
    super()

    this.emitChange = this.emitChange.bind(this)
    this.emitDonate = this.emitDonate.bind(this)

    this.setupBalancePolling = this.setupBalancePolling.bind(this)
    this.setupListenUpdate = this.setupListenUpdate.bind(this)
    this.setupDonateUpdate = this.setupDonateUpdate.bind(this)

    this.ethHandler = new Handler({ web3: ethWeb3 })
    if (walletWeb3) {
      this.walletHandler = new Handler({ web3: walletWeb3 })
      // should wait event binding by outside
      setTimeout(() => {
        this.setupBalancePolling()
        this.setupListenUpdate()
      }, 0)
    }
  }

  async getBlock(blockNumber) {
    return this.ethHandler.getBlock(blockNumber)
  }

  async getBlocks(blockNumbers) {
    return this.ethHandler.getBlocks(blockNumbers)
  }

  async getBlockNumber() {
    return this.ethHandler.getBlockNumber()
  }

  async isRightNetwork() {
    if (config.networkID === '*') {
      return true
    }
    let id = await this.getNetworkID()
    return id === config.networkID
  }

  async getNetworkID() {
    return this.walletHandler.getNetworkID()
  }

  async balanceOf({ token }) {
    return this.walletHandler.balanceOf({ token })
  }

  async transfer({ to, value }) {
    return this.walletHandler.transfer({ to, value })
  }

  async getAccounts() {
    return this.walletHandler.getAccounts()
  }

  async getMachineAccountStatus(machine) {
    return this.walletHandler.getMachineAccountStatus(machine)
  }

  async insertCoin(machine) {
    return this.walletHandler.insertCoin(machine)
  }

  async drawRewardSlotMachine(machine) {
    return this.walletHandler.drawRewardSlotMachine(machine)
  }

  async drawRewardCapsule(machine) {
    return this.walletHandler.drawRewardCapsule(machine)
  }

  async getPricePagingBlockNumber(machine, account) {
    return this.ethHandler.getPricePagingBlockNumber(machine, account)
  }

  async setupBalancePolling() {
    this.clearBalancePolling()

    let token = await this.walletHandler.loadToken()
    let balance = await this.balanceOf({ token })
    this.emit('balance', balance)

    this.balancePollingTimeout = setTimeout(this.setupBalancePolling, BALANCE_POLLING_PERIOD)
  }

  clearBalancePolling() {
    if (this.balancePollingTimeout) {
      clearTimeout(this.balancePollingTimeout)
    }
    this.balancePollingTimeout = null
  }

  emitChange(update) {
    this.emitAccount(update)
    this.emitNetwork(update)
  }

  emitAccount({ selectedAddress }) {
    if (selectedAddress === cachedSelectedAddress) {
      return
    }
    cachedSelectedAddress = selectedAddress
    this.clearBalancePolling()
    if (selectedAddress !== '') {
      selectedAddress = this.ethHandler.web3.utils.toChecksumAddress(selectedAddress)
      this.setupBalancePolling()
    }
    this.emit('account', selectedAddress)
  }

  emitNetwork({ networkVersion }) {
    if (networkVersion === cachedNetworkVersion) {
      return
    }
    cachedNetworkVersion = networkVersion
    this.emit('network', this.networkVersion)
  }

  async emitDonate(name, event) {
    console.warn(`receive donate to ${name}`, event)

    let { from, amount, msg } = event.returnValues
    let token = await this.walletHandler.loadToken()
    amount = token.valueFromAmount(amount).amount
    msg = msg || ''
    this.emit('donate', { from, amount, msg })
  }

  async setupListenUpdate() {
    let store = this.walletHandler.web3.currentProvider.connection.publicConfigStore
    if (!store) {
      return
    }
    let { selectedAddress, networkVersion } = store.getState()
    cachedSelectedAddress = selectedAddress
    cachedNetworkVersion = networkVersion
    store.on('update', this.emitChange)
  }

  clearListenUpdate() {
    let store = this.walletHandler.web3.currentProvider.connection.publicConfigStore
    if (!store) {
      return
    }
    store.removeListener('update', this.emitChange)
  }

  async setupDonateUpdate() {
    this.clearDonateUpdate()

    let fromBlock = await this.getBlockNumber() + 1

    let slotMachine = await this.getMachine('SlotMachine')
    let familyCapsule = await this.getMachine('DekuFamily')
    let careerCapsule = await this.getMachine('DekuCareer')

    this.slotMachineDonateEventEmitter = this.getEventEmitter(slotMachine, 'Donation', { fromBlock })
    this.slotMachineDonateEventEmitter.on('data', this.emitDonate.bind(this, 'SlotMachine'))

    this.familyCapsuleDonateEventEmitter = this.getEventEmitter(familyCapsule, 'Donation', { fromBlock })
    this.familyCapsuleDonateEventEmitter.on('data', this.emitDonate.bind(this, 'DekuFamily'))

    this.careerCapsuleDonateEventEmitter = this.getEventEmitter(careerCapsule, 'Donation', { fromBlock })
    this.careerCapsuleDonateEventEmitter.on('data', this.emitDonate.bind(this, 'DekuCareer'))
  }

  clearDonateUpdate() {
    if (this.slotMachineDonateEventEmitter) {
      this.slotMachineDonateEventEmitter.removeAllListeners()
      this.slotMachineDonateEventEmitter = null
    }

    if (this.familyCapsuleDonateEventEmitter) {
      this.familyCapsuleDonateEventEmitter.removeAllListeners()
      this.familyCapsuleDonateEventEmitter = null
    }

    if (this.careerCapsuleDonateEventEmitter) {
      this.careerCapsuleDonateEventEmitter.removeAllListeners()
      this.careerCapsuleDonateEventEmitter = null
    }
  }

  async getMachine(key) {
    return this.ethHandler.getMachine(key)
  }

  async getERC721FullBalanceOf(key) {
    return this.walletHandler.getERC721FullBalanceOf(key)
  }

  async getERC20BalanceOf(key) {
    return this.walletHandler.getERC20BalanceOf(key)
  }

  async getDekuFamilyValuesByRange(key, start, end) {
    return this.walletHandler.getDekuFamilyValuesByRange(key, start, end)
  }

  async getEvent(machine, event, options) {
    return this.ethHandler.getEvent(machine, event, options)
  }

  getEventEmitter(machine, event, options) {
    return this.ethHandler.getEventEmitter(machine, event, options)
  }

  destroy() {
    if (this.walletHandler) {
      this.clearBalancePolling()
      this.clearListenUpdate()
    }
    this.clearDonateUpdate()
    this.removeAllListeners()
  }
}

let ethWeb3 = new Web3(config.networkURL)
let instance = new Backend(ethWeb3)

export default (walletWeb3) => {
  if (!walletWeb3) {
    return instance
  }
  if (instance) {
    instance.destroy()
  }
  instance = new Backend(ethWeb3, walletWeb3)
  return instance
}
