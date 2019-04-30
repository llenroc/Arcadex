import { createStore, applyMiddleware } from 'redux'
import reducers from '@/reducers'
import Immutable from 'immutable'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { isProd } from '@/utils'

const middlewares = [
  thunk,
  !isProd() && createLogger({ stateTransformer: state => state.toJS() }),
].filter(Boolean)

export default createStore(
  reducers,
  Immutable.Map(),
  applyMiddleware(...middlewares)
)
