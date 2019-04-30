import { isProd } from '@/utils'

require.context('./assets/721metadata/', true, /^\.\/.*\.png/)

export default {
  ga: '',
  networkURL: isProd()? 'wss://mainnet-rpc.dexon.org/ws': 'ws://localhost:8545',
  networkID: 237,
  explorerHost: 'https://dexonscan.app',
  walletVar: 'dexon',
}
