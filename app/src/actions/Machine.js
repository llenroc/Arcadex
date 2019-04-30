import { createAction } from 'redux-actions'
import * as types from '@/types/Machine'
import Backend from '@/services/backend'

export const setMachine = createAction(types.MACHINE_SET)

export const loadSlotMachine = () => {
  return async (dispatch) => {
    let slotMachine = await Backend().getMachine('SlotMachine')
    dispatch(setMachine({ slotMachine }))
  }
}

export const loadCapsules = () => {
  return async (dispatch) => {
    let familyCapsule = await Backend().getMachine('DekuFamily')
    let careerCapsule = await Backend().getMachine('DekuCareer')
    dispatch(setMachine({ familyCapsule, careerCapsule }))
  }
}
