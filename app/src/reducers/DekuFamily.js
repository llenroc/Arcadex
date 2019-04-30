import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as types from '@/types/DekuFamily'

export default handleActions({
  [types.DEKUFAMILY_CLEAR]: (state) => {
    state = state.set('more', false)
    return state.set('items', Immutable.List())
  },
  [types.DEKUFAMILY_LOADED]: (state, { payload }) => {
    let { items, more = false } = payload
    state = state.set('more', more)
    return state.set('items', state.get('items').concat(items))
  }
}, Immutable.fromJS({
  items: [],
  more: false
}))
