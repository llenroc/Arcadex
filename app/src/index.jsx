import React from 'react'
import ReactModal from 'react-modal'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ReactGA from 'react-ga'
import App from '@/containers/App'
import store from '@/store'
import { resetServices } from '@/actions/Service'
import config from '@/config'

document.addEventListener('DOMContentLoaded', async () => {
  store.dispatch(resetServices())
  let div = document.createElement('div')
  div.style.width = '100%'
  div.style.height = '100%'
  div.style.display = 'flex'
  div.style.flexDirection = 'column'

  if (config.ga) {
    ReactGA.initialize(config.ga)
  }

  document.body.appendChild(div)
  ReactModal.setAppElement(div)
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
  div)
})
