import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications'
import intl from 'react-intl-universal'
import accounting from 'accounting'
import { SpriteSlots, ComboPrices } from '@/constants/slots'
import { sleep, isHandheld } from '@/utils'
import { updateServiceState } from '@/actions/Service'
import SpinTap from '@/components/SlotMachine/SpinTap'
import Backend from '@/services/backend'
import Balance from '@/components/Balance'
import AddrConfig from '%/config'
import config from '@/config'
import {
  BG_RED,
  TEXT_WHITE,
  TEXT_GRAY,
} from '@/constants/colors'

const BALANCE_POLLING_PERIOD = 1000
const STATUS_POLLING_PERIOD = 1000

const Wrapper = styled.div`
  position: relative;
`

const TapContainer = styled.div`
  display: flex;
  width: ${isHandheld() ? 300 : 600}px;
  height: ${isHandheld() ? 200 : 400}px;
  background: ${TEXT_WHITE};
  border: 1px solid #fff;
  border-radius: 8px;
  overflow: hidden;

  > div:first-child {
    border-right: 1px solid #979797;
    .spintap-shadow {
      border-bottom-left-radius: 8px;
    }
  }
  > div:last-child {
    border-left: 1px solid #979797;
    .spintap-shadow {
      border-bottom-right-radius: 8px;
    }
  }
`

const Headline = styled.div`
  font-size: 24px;
  font-weight: bold;
  ${isHandheld() && `
    font-size: 18px;
    text-align: center;
  `};
`

const SubHeadline = styled.div`
  font-size: 18px;
  color: ${TEXT_GRAY};
  margin: 6px 0 25px;
`

const Button = styled.button`
  width: ${isHandheld() ? 300 : 156}px;
  height: ${isHandheld() ? 36 : 48}px;
  color: ${TEXT_WHITE};
  font-size: ${isHandheld() ? 14 : 18}px;
  font-weight: bold;
  margin-top: 30px;
  text-transform: uppercase;
  background: ${props => props.isDisabled ? '#4a4a4a' : BG_RED};
`

const MessageText = styled.div`
  font-size: 30px;
`

const Link = styled.a`
  color: ${TEXT_WHITE};
`

class SlotsBoard extends Component {
  constructor(...props) {
    super(...props)

    this.state = {
      confirming: false,
      spinning: false,
      isCoinInserted: false,
      balanceACDX: 0,
      priceID: ''
    }

    this.tapRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ]
  }

  componentDidMount() {
    if (this.props.machine) {
      this.setupMachineStatusPolling()
    }
    if (this.props.isRightNetwork) {
      this.setupACDXBalancePolling()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.machine && this.props.machine) {
      this.setupMachineStatusPolling()
    }
    if (!prevProps.isRightNetwork && this.props.isRightNetwork) {
      this.setupACDXBalancePolling()
    }
  }

  componentWillUnmount() {
    this.clearMachineStatusPolling()
    this.clearACDXBalancePolling()
  }

  clearMachineStatusPolling = () => {
    if (this.machineStatusPollingTimeout) {
      clearTimeout(this.machineStatusPollingTimeout)
    }
    this.machineStatusPollingTimeout = null
  }

  setupMachineStatusPolling = async () => {
    this.clearMachineStatusPolling()

    let status = await Backend().getMachineAccountStatus(this.props.machine)
    this.setState({ isCoinInserted: !status.isZero() })
    this.machineStatusPollingTimeout = setTimeout(this.setupMachineStatusPolling, STATUS_POLLING_PERIOD)
  }

  clearACDXBalancePolling = () => {
    if (this.acdxBalancePollingTimeout) {
      clearTimeout(this.acdxBalancePollingTimeout)
    }
    this.acdxBalancePollingTimeout = null
  }

  setupACDXBalancePolling = async () => {
    this.clearACDXBalancePolling()

    let value = await Backend().getERC20BalanceOf('Arcadex')
    this.setState({ balanceACDX: value.amount.toString() })
    this.acdxBalancePollingTimeout = setTimeout(this.setupACDXBalancePolling, BALANCE_POLLING_PERIOD)
  }

  toastError = (error) => this.props.toastManager.add(
    error,
    {
      appearance: 'error',
      autoDismiss: true,
    },
  )

  generateMissTargets = () => {
    const targets = []
    targets.push(SpriteSlots[Math.floor(Math.random() * SpriteSlots.length)])
    targets.push(SpriteSlots[Math.floor(Math.random() * SpriteSlots.length)])
    let lastTarget = SpriteSlots[Math.floor(Math.random() * SpriteSlots.length)]
    while (lastTarget === targets[0] && lastTarget === targets[1]) {
      lastTarget = SpriteSlots[Math.floor(Math.random() * SpriteSlots.length)]
    }
    targets.push(lastTarget)
    return targets
  }

  doConfirm = async (promise) => {
    const {
      showLoading,
      hideLoading,
    } = this.props

    let ret = true

    this.setState({ confirming: true })
    showLoading()
    try {
      await promise()
    } catch (e) {
      console.log(`playSlotMachine error: ${e}`)
      this.toastError(intl.get('error_send_tx_failed'))
      ret = false
    }
    this.setState({ confirming: false })
    hideLoading()
    return ret
  }

  doSpin = async () => {
    // wait loading dismiss
    await sleep(300)

    // TODO: use contract price value
    const { priceID } = this.state
    const price = this.props.machine.prices[priceID]
    const targets = price.value.amount.isZero()
      ? this.generateMissTargets()
      : Array(3).fill(ComboPrices[price.id])

    this.tapRefs.forEach(ref => ref.current.start())

    await sleep(1000)
    this.tapRefs[0].current.stop(targets[0])

    await sleep(500)
    this.tapRefs[1].current.stop(targets[1])

    await sleep(500)
    this.tapRefs[2].current.stop(targets[2])
  }

  onSpinStop = (idx) => {
    if (idx !== 2) {
      return
    }

    const { toastManager, machine } = this.props
    const { priceID } = this.state
    const price = machine.prices[priceID]

    const msg = (price.value.amount.isZero())
      ? intl.get('slot_machine_you_lose')
      : intl.get('slot_machine_you_win', { prize: price.value.amount.toString() })

    toastManager.add((<MessageText>{msg}</MessageText>), {
      appearance: 'success',
      autoDismiss: true,
    })
    this.setState({ spinning: false })
    this.setupACDXBalancePolling()
  }

  checkError = () => {
    const { isRightNetwork, machine } = this.props
    const { confirming, spinning } = this.state
    let msg = null
    if (confirming || spinning) {
      msg = 'error_try_again'
    } else if (!isRightNetwork) {
      msg = 'error_no_wallet'
    } else if (!machine) {
      msg = 'error_slot_offline'
    }

    if (msg) {
      this.toastError(intl.get(msg))
      return true
    }
    return false
  }

  onSpinClick = async () => {
    if (this.checkError()) {
      return
    }
    this.clearACDXBalancePolling()
    let succ = await this.doConfirm(async () => {
      let priceID = await Backend().drawRewardSlotMachine(this.props.machine)
      this.setState({ priceID, confirming: false, spinning: true })
    })
    if (succ) {
      await this.doSpin()
    } else {
      this.setupACDXBalancePolling()
    }
  }

  onGoClick = async () => {
    if (this.checkError()) {
      return
    }
    this.clearMachineStatusPolling()
    this.doConfirm(async () => {
      await Backend().insertCoin(this.props.machine)
      this.setState({ confirming: false, isCoinInserted: true })
      this.props.toastManager.add((<MessageText>{intl.get('slot_machine_you_can_spin')}</MessageText>), {
        appearance: 'success',
        autoDismiss: true,
      })
    })
    this.setupMachineStatusPolling()
  }

  render() {
    const { isRightNetwork, machine, style, className } = this.props
    const { confirming, spinning, isCoinInserted, balanceACDX } = this.state
    return (
      <Wrapper style={style} className={className}>
        {isHandheld() ? (
          <Headline>
            <div>{intl.get('slot_machine_your_balance')}</div>
            <div><Balance /></div>
          </Headline>
        ) : (
          <Headline>
            {intl.get('slot_machine_your_balance')}
            <Balance />
          </Headline>
        )}
        <SubHeadline>
          {intl.get('slot_machine_acdx_balance')}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`${config.explorerHost}/address/${AddrConfig['Arcadex']}`}
          >{accounting.formatMoney(balanceACDX, { symbol: 'ACDX', format: '%v %s', precision: 0 }, 2)}</Link>
        </SubHeadline>
        <TapContainer>
          { this.tapRefs.map((ref, idx) =>
            <SpinTap
              ref={ref}
              key={idx}
              onSpinStop={() => this.onSpinStop(idx)}
            />) }
        </TapContainer>
        {isCoinInserted && (
          <Button
            isDisabled={!machine || !isRightNetwork || confirming || spinning}
            onClick={this.onSpinClick}
          >{intl.get('slot_machine_spin')}</Button>
        )}
        {!isCoinInserted && (
          <Button
            isDisabled={!machine || !isRightNetwork || confirming || spinning}
            onClick={this.onGoClick}
          >{intl.get('slot_machine_insert_coin')}</Button>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  isRightNetwork: state.getIn(['Wallet', 'isRightNetwork']),
  machine: state.getIn(['Machine', 'slotMachine'])
})

const mapDispatchToProps = (dispatch) => ({
  showLoading: () => dispatch(updateServiceState({ hideLoadingModal: false })),
  hideLoading: () => dispatch(updateServiceState({ hideLoadingModal: true })),
})

export default withToastManager(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SlotsBoard))
