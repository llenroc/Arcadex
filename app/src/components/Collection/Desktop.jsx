import React, { Component } from 'react'
import styled from 'styled-components'
import intl from 'react-intl-universal'
import { withRouter } from 'react-router-dom'
import { withAccount } from '@/components/Account'
import {
  BG_HOVER,
  BG_PRIMARY,
  TEXT_DARK_GRAY,
} from '@/constants/colors'
import SVG from '@/components/SVG'
import { dekuFamily, dekuCareer } from './constants'
import Backend from '@/services/backend'
import characters from '@/constants/characters'
import {
  CAPSULE_PAGE,
} from '@/constants/routes'
import AddrConfig from '%/config'
import config from '@/config'

const BALANCE_POLLING_PERIOD = 1000

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, max-content));
  grid-template-rows: auto;
  grid-row-gap: 30px;
  grid-column-gap: 26px;
  justify-content: center;
  margin-bottom: 30px;
`

const Card = styled.a`
  width: 310px;
  height: 386px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 35px;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  background: ${BG_PRIMARY};
  :hover {
    background: ${BG_HOVER};
  }
`

const Text = styled.div`
  font-size: 14px;
  margin-top: 26px;
  color: ${TEXT_DARK_GRAY};
`

const Role = styled(SVG)`
  width: 220px;
  height: auto;
`

class Collection extends Component {
  state = {
    balance: {},
  }

  componentDidMount() {
    if (this.props.isRightNetwork) {
      this.setupBalancePolling()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isRightNetwork && this.props.isRightNetwork) {
      this.setupBalancePolling()
    }
  }

  componentWillUnmount() {
    this.clearBalancePolling()
  }

  clearBalancePolling = () => {
    if (this.balancePollingTimeout) {
      clearTimeout(this.balancePollingTimeout)
    }
    this.balancePollingTimeout = null
  }

  setupBalancePolling = async () => {
    this.clearBalancePolling()

    let balances = await Promise.all(
      Object.keys(characters).map(
        (key) => Backend().getERC721FullBalanceOf(characters[key].name)
      )
    )
    let balance = Object.values(characters)
      .reduce((obj, { name }, idx) => ({ [name]: balances[idx], ...obj }), {})
    this.setState({ balance })
    this.balancePollingTimeout = setTimeout(this.setupBalancePolling, BALANCE_POLLING_PERIOD)
  }

  onAccountChanged() {
    let { isRightNetwork } = this.props
    if (!isRightNetwork) {
      this.setState({ balance: {} })
      return
    }
    this.setupBalancePolling()
  }

  onUnknownClick = () => {
    this.props.history.push(CAPSULE_PAGE)
  }

  renderCard = ({ name, src, maskSrc }) => {
    const { location } = this.props
    const { balance } = this.state
    let amount = 0
    if (balance[name]) {
      amount = balance[name].amount.toNumber()
    }
    const linkProps = (amount > 0
      ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: `${config.explorerHost}/address/${AddrConfig[name]}`,
      } : (
        location.pathname !== CAPSULE_PAGE ? {
          onClick: this.onUnknownClick
        } : {}
      )
    )

    return (
      <Card
        key={name}
        {...linkProps}
      >
        {amount > 0
          ? <Role src={src} />
          : <Role src={maskSrc} />
        }
        {amount > 0
          ? <Text>{name} x {amount}</Text>
          : <Text>{intl.get('my_collection_get_it')}</Text>
        }
      </Card>
    )
  }

  render() {
    return (
      <Container>
        <Cards>
          {dekuFamily.map(this.renderCard)}
        </Cards>
        <Cards>
          {dekuCareer.map(this.renderCard)}
        </Cards>
      </Container>
    )
  }
}

export default withRouter(withAccount(Collection))
