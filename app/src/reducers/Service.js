import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as types from '@/types/Service'

export default handleActions({
  [types.SERVICE_STATE_UPDATE]: (state, { payload }) => {
    let {
      installed,
      hideInstallModal,
      hideLoadingModal,
      openMenu,
    } = payload

    if (installed !== undefined) {
      state = state.set('installed', installed)
    }

    if (hideInstallModal !== undefined) {
      state = state.set('hideInstallModal', hideInstallModal)
    }

    if (hideLoadingModal !== undefined) {
      state = state.set('hideLoadingModal', hideLoadingModal)
    }

    if (openMenu !== undefined) {
      state = state.set('openMenu', openMenu)
    }

    return state
  }
}, Immutable.fromJS({
  installed: false,
  hideInstallModal: true,
  hideLoadingModal: true,
  openMenu: false,
}))
