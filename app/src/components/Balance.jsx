import React from 'react'
import { connect } from 'react-redux'
import accounting from 'accounting'

const Balance = ({ balance }) => (
  <span>{accounting.formatMoney(balance, { symbol: 'DXN', format: '%v %s', precision: 4 }, 2)}</span>
)

export default connect(
  (state) => ({ balance: state.getIn(['Wallet', 'balance'], 0) }),
  () => ({}),
)(Balance)
