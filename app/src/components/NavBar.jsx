import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import intl from 'react-intl-universal'
import { Link, withRouter } from 'react-router-dom'
import { withAccount } from '@/components/Account'
import { BG_RED, BG_PRIMARY, TEXT_DARK_GRAY, TEXT_LINK } from '@/constants/colors'
import {
  HOW_TO_PLAY_PAGE,
  GAME_HALL_PAGE,
  MY_COLLECTION_PAGE,
  SLOT_MACHINE_PAGE,
  CAPSULE_PAGE,
  URL_FAUCET,
} from '@/constants/routes'
import logo from '@/assets/logo-arcadex.png'
import Jazzicon from '@/components/Jazzicon'
import { resetServices } from '@/actions/Service'
import Balance from '@/components/Balance'

const Container = styled.div`
  padding: 0 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  background: ${BG_PRIMARY};
  color: ${TEXT_DARK_GRAY};
  a {
    font-size: 14px;
    text-decoration: none;
  }
`

const Logo = styled.img`
  width: 164px;
  height: 65px;
  margin: 13px 0 2px 0;
`

const Indicator = styled.div`
  height: 6px;
  background: ${BG_RED};
  position: absolute;
  bottom: 0;
  transition: left 0.5s, width 0.5s;
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0 30px;
  position: relative;
  color: ${TEXT_DARK_GRAY};
`

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  margin: 0 30px;
  position: relative;
  color: ${TEXT_DARK_GRAY};
`

const Spacer = styled.div`
  width: 120px;
`

const Left = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`

const Text = styled.span`
  padding: 0 16px;
`

const ActionLink = styled.a`
  padding: 0 16px;
  color: ${TEXT_LINK};
`

class NavBar extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      indicatorStyle: {}
    }
    this.linkRefs = {
      [HOW_TO_PLAY_PAGE]: React.createRef(),
      [GAME_HALL_PAGE]: React.createRef(),
      [MY_COLLECTION_PAGE]: React.createRef(),
    }
  }

  componentDidMount() {
    this.setIndicator()
    window.addEventListener('resize', this.setIndicator)
  }

  componentDidUpdate(prevProp) {
    if (prevProp.location.pathname !== this.props.location.pathname) {
      this.setIndicator()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setIndicator)
  }

  setIndicator = () => {
    let pathname = this.props.location.pathname
    let indicator
    if (pathname.startsWith(HOW_TO_PLAY_PAGE)) {
      indicator = HOW_TO_PLAY_PAGE
    } else if (
      pathname.startsWith(GAME_HALL_PAGE) ||
      pathname.startsWith(SLOT_MACHINE_PAGE) ||
      pathname.startsWith(CAPSULE_PAGE)
    ) {
      indicator = GAME_HALL_PAGE
    } else if (pathname.startsWith(MY_COLLECTION_PAGE)) {
      indicator = MY_COLLECTION_PAGE
    }
    let ref = this.linkRefs[indicator]
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

  render() {
    let { address, connected, isRightNetwork, onConnectClick } = this.props
    let { indicatorStyle } = this.state
    return (
      <Container>
        <Left>
          <Link to="/"><Logo src={logo}></Logo></Link>
          <Spacer />
          <StyledLink ref={this.linkRefs[HOW_TO_PLAY_PAGE]} to={HOW_TO_PLAY_PAGE}>
            {intl.get('how_to_play')}
          </StyledLink>
          <StyledLink ref={this.linkRefs[GAME_HALL_PAGE]} to={GAME_HALL_PAGE}>
            {intl.get('game_hall')}
          </StyledLink>
          <StyledLink ref={this.linkRefs[MY_COLLECTION_PAGE]} to={MY_COLLECTION_PAGE}>
            {intl.get('my_collection')}
          </StyledLink>
          <ExternalLink target="_blank" rel="noopener noreferrer" href={URL_FAUCET}>
            {intl.get('faucet')}
          </ExternalLink>
          <Indicator style={indicatorStyle} />
        </Left>
        <Right>
          { isRightNetwork ? (
              <Jazzicon
                seed={parseInt(address.slice(2, 10), 16)}
                diameter={26}
              />
            ) : null
          }
          { isRightNetwork ? (
              <Text><Balance /></Text>
            ) : connected ? (
              <Text>
                {intl.get('connect_to_wrong_network')}
              </Text>
            ) : (
              <ActionLink onClick={onConnectClick}>
                {intl.get('connect_to_wallet')}
              </ActionLink>
            )
          }
        </Right>
      </Container>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({
  onConnectClick: () => dispatch(resetServices())
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withAccount(NavBar)))
