import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications'
import Backend from '@/services/backend'
import accounting from 'accounting'

const Container = styled.div`
  word-break: break-all;
`

class Donate extends Component {
  componentDidMount() {
    if (this.props.isRightNetwork) {
      this.setupDonateUpdate()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isRightNetwork && this.props.isRightNetwork) {
      this.setupDonateUpdate()
    }
  }

  componentWillUnmount() {
    this.clearDonateUpdate()
  }

  setupDonateUpdate() {
    this.clearDonateUpdate()

    let backend = Backend()
    if (!backend) {
      return
    }
    backend.on('donate', this.onDonate)
  }

  clearDonateUpdate() {
    let backend = Backend()
    if (!backend) {
      return
    }
    backend.removeListener('donate', this.onDonate)
  }

  onDonate = (event) => {
    let toastManager = this.props.toastManager
    let msg = accounting.formatMoney(
      event.amount,
      {
        symbol: 'DXN',
        format: `Thanks ${event.from} donate %v %s`,
        precision: 4
      },
      2
    )
    if (event.msg) {
      msg += ` with ${event.msg}`
    }
    toastManager.add(
      (<Container>{msg}</Container>), {
      appearance: 'success',
      autoDismiss: true,
    })
  }

  render() {
    return (<div />)
  }
}

const mapStateToProps = (state) => ({
  isRightNetwork: state.getIn(['Wallet', 'isRightNetwork']),
})

const mapDispatchToProps = () => ({
})

export default withToastManager(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Donate))
