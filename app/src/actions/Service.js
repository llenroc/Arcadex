import { createAction } from 'redux-actions'
import * as types from '@/types/Service'
import services from '@/services'
import { updateWalletState } from '@/actions/Wallet'

export const updateServiceState = createAction(types.SERVICE_STATE_UPDATE)

export const resetServices = () => {
  return async (dispatch) => {
    dispatch(updateWalletState({
      connected: false,
      address: '',
      balance: '0',
      isRightNetwork: false,
    }))

    dispatch(updateServiceState({
      installed: false,
    }))

    let ret
    try {
      ret = await services()
    } catch (error) {
      console.error(error)
      return
    }
    let { connected, installed, account, backend } = ret
    let isRightNetwork = false
    if (connected) {
      isRightNetwork = await backend.isRightNetwork()
      backend.on('balance', (value) => dispatch(updateWalletState({
        balance: value.amount.toString()
        })))
      backend.on('account', async (account) => {
        connected = !!account
        isRightNetwork = false
        if (connected) {
          isRightNetwork = await backend.isRightNetwork()
        }
        dispatch(updateWalletState({
          connected,
          isRightNetwork,
          address: account
        }))
      })
      backend.on('network', async () => {
        dispatch(resetServices())
      })
      if (isRightNetwork) {
        backend.setupDonateUpdate()
      }
    }

    dispatch(updateWalletState({
      connected,
      isRightNetwork,
      address: account,
    }))

    dispatch(updateServiceState({
      installed,
      hideInstallModal: installed,
    }))
  }
}
