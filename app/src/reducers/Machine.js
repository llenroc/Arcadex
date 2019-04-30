import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as types from '@/types/Machine'

export default handleActions({
  [types.MACHINE_SET]: (state, { payload }) => {
    let {
      slotMachine,
      familyCapsule,
      careerCapsule,
    } = payload

    if (slotMachine !== undefined) {
      console.warn('load slotMachine', slotMachine)
      state = state.set('slotMachine', slotMachine)
    }

    if (familyCapsule !== undefined) {
      state = state.set('familyCapsule', familyCapsule)
    }

    if (careerCapsule !== undefined) {
      state = state.set('careerCapsule', careerCapsule)
    }

    return state
  }
}, Immutable.fromJS({
  slotMachine: null
}))
