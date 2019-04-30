import { createAction } from 'redux-actions'
import * as types from '@/types/DekuFamily'
import Backend from '@/services/backend'

const page = 20

export const clear = createAction(types.DEKUFAMILY_CLEAR)
export const loaded = createAction(types.DEKUFAMILY_LOADED)

export const load = (key, start = 0) => {
  return async (dispatch) => {
    let tokens = await Backend().getDekuFamilyValuesByRange(key, start, start + page)
    dispatch(loaded({ items: tokens, more: tokens.lenght === page }))
  }
}

export const reload = (key) => {
  return async (dispatch) => {
    dispatch(clear())
    dispatch(load(key))
  }
})
