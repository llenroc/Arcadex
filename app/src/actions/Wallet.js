import { createAction } from 'redux-actions'
import * as types from '@/types/Wallet'

export const updateWalletState = createAction(types.WALLET_STATE_UPDATE)
