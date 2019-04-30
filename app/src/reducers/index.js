import { combineReducers } from 'redux-immutable'
import Service from '@/reducers/Service'
import Wallet from '@/reducers/Wallet'
import Machine from '@/reducers/Machine'
import DekuFamily from '@/reducers/DekuFamily'

export default combineReducers({
  Wallet,
  Service,
  Machine,
  DekuFamily,
})
