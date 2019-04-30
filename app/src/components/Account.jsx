import React, { Component } from 'react'
import { connect } from 'react-redux'

export const withAccount = (WrappedComponent) => {
  class C extends Component {
    constructor(...args) {
      super(...args)
      this.wrappedComponentRef = React.createRef()
    }
    componentDidMount() {
      this.callAccountChanged()
    }
    componentDidUpdate(prevProp) {
      if (
        (prevProp.address !== this.props.address) ||
        (prevProp.isRightNetwork !== this.props.isRightNetwork)
      ) {
        this.callAccountChanged()
      }
    }
    callAccountChanged() {
      if (this.wrappedComponentRef.current.onAccountChanged) {
        this.wrappedComponentRef.current.onAccountChanged()
      }
    }
    render() {
      return (<WrappedComponent {...this.props} ref={this.wrappedComponentRef} />)
    }
  }
  C.displayName = `withAccount(${WrappedComponent.displayName || WrappedComponent.name})`
  C.WrappedComponent = WrappedComponent
  return connect(
    (state) => ({
      isRightNetwork: state.getIn(['Wallet', 'isRightNetwork']),
      connected: state.getIn(['Wallet', 'connected']),
      address: state.getIn(['Wallet', 'address'])
    })
  )(C)
}
