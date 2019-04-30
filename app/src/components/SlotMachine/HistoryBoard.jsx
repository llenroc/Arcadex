import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import styled from 'styled-components'
import { connect } from 'react-redux'
import intl from 'react-intl-universal'
import Slots, { ComboPrices } from '@/constants/slots'
import SVG from '@/components/SVG'
import { withAccount } from '@/components/Account'
import { sleep } from '@/utils'
import config from '@/config'
import {
  BG_RED,
  BG_PRIMARY,
  BG_SECONDARY,
  TEXT_WHITE,
  TEXT_GRAY,
  TEXT_LINK,
 } from '@/constants/colors'
import Backend from '@/services/backend'
import { isHandheld } from '@/utils'

const GLOBAL_PAGE = 'GLOBAL_PAGE'
const SELF_PAGE = 'SELF_PAGE'

const ComboSVG = styled(SVG)`
  width: ${isHandheld() ? 20 : 30}px;
  height: ${isHandheld() ? 20 : 30}px;
  margin: 0 2px;
`

const NavBar = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  a {
    font-size: 18px;
    font-weight: bold;
    text-decoration: none;
  }
`

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  margin: 0 102px 12px 102px;
  line-height: 22px;
  position: relative;
  color: ${TEXT_WHITE};
  ${isHandheld() && `
    margin: 0 32px 12px 32px;
  `}
`

const Indicator = styled.div`
  height: 6px;
  background: ${BG_RED};
  position: absolute;
  bottom: 0;
  transition: left 0.5s, width 0.5s;
`

const Spacer = styled.div`
  height: 7px;
`

const HistoryListContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: stretch;
  flex-direction: column;
`

const HistoryListWrapper = styled.div`
  > div:nth-child(2n) {
    background: ${BG_PRIMARY};
  }
  > div:nth-child(2n+1) {
    background: ${BG_SECONDARY};
  }
`

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-radius: 12px;
  height: 50px;
  color: ${TEXT_GRAY};
  font-size: ${isHandheld() ? 11 : 14}px;
`

const HeaderRow = styled(Row)`
  font-weight: bold;
`

const Col = styled.div`
  width: ${props => props.width || 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${isHandheld() ? 4 : 8}px;
`

const Text = styled.div`
  color: ${TEXT_GRAY};
  font-size: ${isHandheld() ? 11 : 14}px;
`

const Link = styled.a`
  display: block;
  color: ${TEXT_LINK};
  font-size: 11px;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${props => props.monospaced && 'font-family: "Lucida Sans Typewriter","Lucida Console",monaco,"Bitstream Vera Sans Mono",monospace'};
`

const convertEventToHistory = (event) => ({
  priceID: event.returnValues.priceId,
  winner: event.returnValues.winner,
  blockNumber: event.blockNumber,
  transactionHash: event.transactionHash,
  timestamp: event.timestamp,
})

const HistoryRow = ({ priceID, winner, blockNumber, transactionHash, timestamp, machine }) => {
  return (
    <Row>
      <Col width={isHandheld() ? '20%' : '10%'}>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`${config.explorerHost}/block/${blockNumber}`}
        >{blockNumber}</Link>
      </Col>
      <Col width={isHandheld() ? '25%' : '15%'}>
        {moment(timestamp).fromNow()}
      </Col>
      {!isHandheld() && <Col width={'30%'}>
        <Link
          monospaced
          target="_blank"
          rel="noopener noreferrer"
          href={`${config.explorerHost}/transaction/${transactionHash}`}
        >{transactionHash}</Link>
      </Col>}
      <Col width={isHandheld() ? '25%' : '30%'}>
        <Link
          monospaced
          target="_blank"
          rel="noopener noreferrer"
          href={`${config.explorerHost}/address/${winner}`}
        >{winner}</Link>
      </Col>
      <Col width={isHandheld() ? '30%' : '15%'}>
        { machine.prices[priceID].value.amount.isZero()
          ? <Text>{intl.get('slot_machine_no_result')}</Text>
          : Array(3).fill().map((v, i) => (
              <ComboSVG
                key={`combo-${blockNumber}-${i}`}
                src={Slots[ComboPrices[machine.prices[priceID].id]]}
              />
            ))
        }
      </Col>
    </Row>
  )
}

const HistoryList = ({ items, machine }) => {
  return (
    <HistoryListWrapper>
      <HeaderRow>
        <Col width={isHandheld() ? '20%' : '10%'}>{intl.get('slot_machine_block')}</Col>
        <Col width={isHandheld() ? '25%' : '15%'}>{intl.get('slot_machine_time')}</Col>
        {!isHandheld() && <Col width={'30%'}>{intl.get('slot_machine_transaction')}</Col>}
        <Col width={isHandheld() ? '25%' : '30%'}>{intl.get('slot_machine_player')}</Col>
        <Col width={isHandheld() ? '30%' : '15%'}>{intl.get('slot_machine_result')}</Col>
      </HeaderRow>
      {items.map(item => (
        <HistoryRow key={item.transactionHash} machine={machine} {...item} />
      ))}
    </HistoryListWrapper>
  )
}

class HistoryBoard extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      page: GLOBAL_PAGE,
      selfHistory: [],
      globalHistory: [],
      indicatorStyle: {},
    }
    this.linkRefs = {
      [GLOBAL_PAGE]: React.createRef(),
      [SELF_PAGE]: React.createRef(),
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setIndicator)
    this.clearHistoryEventEmitter()
  }

  async onAccountChanged() {
    let { isRightNetwork } = this.props
    let { globalHistory } = this.state
    let backend = Backend()

    this.setState({ selfHistory: [] })

    this.clearHistoryEventEmitter()

    let currentBlockNumber
    if (globalHistory.length === 0) {
      currentBlockNumber = await backend.getBlockNumber()
    } else {
      currentBlockNumber = globalHistory[0].blockNumber
    }

    if (globalHistory.length === 0) {
      await this.resetGlobalHistory(currentBlockNumber)
    }
    if (isRightNetwork) {
      await this.resetSelfHistory(currentBlockNumber)
    }

    this.setupHistoryEventEmitter(currentBlockNumber + 1)
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevState.page !== this.state.page) {
      this.setIndicator()
    }
  }

  componentDidMount() {
    this.setIndicator()
    window.addEventListener('resize', this.setIndicator)
  }

  async resetGlobalHistory(currentBlockNumber) {
    let { machine } = this.props
    let backend = Backend()

    let globalBlockNumber = await backend.getPricePagingBlockNumber(machine)
    let globalHistory = await backend.getEvent(machine, 'GetPrice', {
      fromBlock: globalBlockNumber,
      toBlock: currentBlockNumber,
    })

    let blocks = await backend.getBlocks(globalHistory.map(({ blockNumber }) => blockNumber))
    globalHistory = globalHistory.map((event, i) => ({
      timestamp: blocks[i].timestamp,
      ...event
    }))

    this.setState({
      globalHistory: globalHistory.map(convertEventToHistory).reverse(),
    })
  }

  async resetSelfHistory(currentBlockNumber) {
    let { machine, address } = this.props
    let backend = Backend()

    let selfBlockNumber = await backend.getPricePagingBlockNumber(machine, address)
    let selfHistory = await backend.getEvent(machine, 'GetPrice', {
      fromBlock: selfBlockNumber,
      toBlock: currentBlockNumber,
      filter: { winner: address },
    })

    let blocks = await backend.getBlocks(selfHistory.map(({ blockNumber }) => blockNumber))
    selfHistory = selfHistory.map((event, i) => ({
      timestamp: blocks[i].timestamp,
      ...event
    }))

    this.setState({
      selfHistory: selfHistory.map(convertEventToHistory).reverse(),
    })
  }

  setupHistoryEventEmitter(fromBlock) {
    this.clearHistoryEventEmitter()

    let { machine } = this.props
    let backend = Backend()

    this.historyEventEmitter = backend.getEventEmitter(machine, 'GetPrice', {
      fromBlock,
    })
    this.historyEventEmitter.on('data', this.onHistory)
  }

  clearHistoryEventEmitter() {
    if (this.historyEventEmitter) {
      this.historyEventEmitter.removeAllListeners()
      this.historyEventEmitter = null
    }
  }

  onHistory = async (event) => {
    await sleep(5000)
    let { address } = this.props
    let backend = Backend()
    let history = convertEventToHistory(event)
    history.timestamp = (await backend.getBlock(history.blockNumber)).timestamp

    let globalHistory = [history].concat(this.state.globalHistory)
    let selfHistory = this.state.selfHistory
    if (history.winner === address) {
      selfHistory = [history].concat(selfHistory)
    }
    this.setState({ globalHistory, selfHistory })
  }

  setIndicator = () => {
    let ref = this.linkRefs[this.state.page]
    if (!ref || !ref.current) {
      this.setState({ indicatorStyle: {} })
      return
    }
    let dom = ReactDOM.findDOMNode(ref.current)
    this.setState({
      indicatorStyle: {
        width: dom.clientWidth,
        left: dom.offsetLeft,
      }
    })
  }

  onLinkClick = (page) => {
    this.setState({ page })
  }

  render() {
    let { page, selfHistory, globalHistory, indicatorStyle } = this.state
    let { style, className, machine } = this.props
    return (
      <div style={style} className={className}>
        <NavBar>
          <StyledLink
            ref={this.linkRefs[GLOBAL_PAGE]}
            onClick={() => this.onLinkClick(GLOBAL_PAGE)}>
            {intl.get('slot_machine_all_spins')}
          </StyledLink>
          <StyledLink
            ref={this.linkRefs[SELF_PAGE]}
            onClick={() => this.onLinkClick(SELF_PAGE)}>
            {intl.get('slot_machine_my_spins')}
          </StyledLink>
          <Indicator style={indicatorStyle} />
        </NavBar>
        <Spacer />
        <HistoryListContainer>
          {page === SELF_PAGE ?
            <HistoryList items={selfHistory} machine={machine} /> :
            null
          }
          {page === GLOBAL_PAGE ?
            <HistoryList items={globalHistory} machine={machine} /> :
            null
          }
        </HistoryListContainer>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  machine: state.getIn([ 'Machine', 'slotMachine' ]),
})

const mapDispatchToProps = () => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withAccount(HistoryBoard))
