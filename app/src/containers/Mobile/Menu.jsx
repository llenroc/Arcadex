import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Drawer from 'react-motion-drawer'
import styled from 'styled-components'
import intl from 'react-intl-universal'
import {
  BG_PRIMARY
} from '@/constants/colors'
import {
  HOW_TO_PLAY_PAGE,
  GAME_HALL_PAGE,
  MY_COLLECTION_PAGE,
  SLOT_MACHINE_PAGE,
  CAPSULE_PAGE,
  URL_FAUCET,
} from '@/constants/routes'
import { updateServiceState } from '@/actions/Service'
import {
  BG_RED,
  TEXT_WHITE,
} from '@/constants/colors'
import close from '@/assets/ic-close.svg'
import SVG from '@/components/SVG'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  a {
    text-decoration: none;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 6px;
  margin-bottom: 48px;
`

const Close = styled(SVG)`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg path {
    fill: ${TEXT_WHITE};
  }
`

const Item = styled.div`
  padding: 12px 0;
  color: ${TEXT_WHITE};
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const Text = styled.div`
  border-bottom: solid 6px ${props => props.isActive ? BG_RED : 'transparent'};
`

class Menu extends PureComponent {

  handleClick = (link) => {
    const { history, closeMenu } = this.props
    history.push(link)
    closeMenu()
  }

  render() {
    const {
      open,
      location,
      closeMenu
    } = this.props
    const pathname = location.pathname
    const isInHall = pathname && [
      GAME_HALL_PAGE,
      SLOT_MACHINE_PAGE,
      CAPSULE_PAGE,
    ].filter(p => pathname.startsWith(p)).length > 0

    return (
      <Drawer
        open={open}
        width={'100%'}
        drawerStyle={{
          background: BG_PRIMARY,
          display: 'flex',
        }}
        right
      >
        <Container>
          <ButtonWrapper>
            <div onClick={() => closeMenu()}>
              <Close src={close} />
            </div>
          </ButtonWrapper>
          <Item
            onClick={() => this.handleClick(HOW_TO_PLAY_PAGE)}
          >
            <Text isActive={pathname.startsWith(HOW_TO_PLAY_PAGE)}>
              {intl.get('how_to_play')}
            </Text>
          </Item>
          <Item
            onClick={() => this.handleClick(GAME_HALL_PAGE)}
          >
            <Text isActive={isInHall}>
              {intl.get('game_hall')}
            </Text>
          </Item>
          <Item
            onClick={() => this.handleClick(MY_COLLECTION_PAGE)}
          >
            <Text isActive={pathname.startsWith(MY_COLLECTION_PAGE)}>
              {intl.get('my_collection')}
            </Text>
          </Item>
          <a target="_blank" rel="noopener noreferrer" href={URL_FAUCET}>
            <Item>
              {intl.get('faucet')}
            </Item>
          </a>
        </Container>
      </Drawer>
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.getIn(['Service', 'openMenu'])
})

const mapDispatchToProps = (dispatch) => ({
  closeMenu: () => dispatch(updateServiceState({
    openMenu: false
  }))
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu))
