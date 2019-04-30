import backend from '@/services/backend'
import config from '@/config'
import Web3 from 'web3'

let initTS = 0

export default async () => {
  let walletVar = window[config.walletVar]
  if (!walletVar) {
    console.error('no wallet var detected.')
    return {
      backend: backend(),
      connected: false,
      installed: false
    }
  }

  let walletWeb3
  let accounts = []
  let ts = (new Date()).valueOf()
  initTS = ts
  try {
    accounts = await walletVar.enable()
    if (accounts.length === 0) {
      throw 'denied'
    }
    walletWeb3 = new Web3(walletVar)
  } catch (error) {
    console.error(error)
  }

  if (ts !== initTS) {
    throw 'aborted'
  }

  return {
    backend: backend(walletWeb3),
    connected: !!walletWeb3,
    installed: true,
    account: accounts[0],
  }
}
