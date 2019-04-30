import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as types from '@/types/Wallet'

export default handleActions({
  [types.WALLET_STATE_UPDATE]: (state, { payload }) => {
    let {
      connected,
      address,
      balance,
      isRightNetwork,
    } = payload

    if (connected !== undefined) {
      state = state.set('connected', connected)
    }

    if (address !== undefined) {
      state = state.set('address', address)
    }

    if (balance !== undefined) {
      state = state.set('balance', balance)
    }

    if (isRightNetwork !== undefined) {
      state = state.set('isRightNetwork', isRightNetwork)
    }

    return state
  }
}, Immutable.fromJS({
  connected: false,
  address: '',
  balance: '0',
  isRightNetwork: false,
}))
