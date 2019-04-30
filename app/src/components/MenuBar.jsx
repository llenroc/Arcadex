import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '@/assets/logo-arcadex.png'
import drawer from '@/assets/ic-drawer.svg'
import SVG from '@/components/SVG'
import { updateServiceState } from '@/actions/Service'
import { BG_PRIMARY, TEXT_WHITE } from '@/constants/colors'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 6px;
  background: ${BG_PRIMARY};
`

const StyledLink = styled(Link)`
  height: 52px;
`

const Logo = styled.img`
  height: 52px;
  margin-left: 10px;
`

const Drawer = styled(SVG)`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg g {
    fill: ${TEXT_WHITE};
  }
`

class MenuBar extends Component {

  handleClickMenu = () => {
    this.props.openMenu()
  }

  render() {
    return (
      <Container {...this.props}>
        <StyledLink to='/'>
          <Logo src={logo} />
        </StyledLink>
        <div onClick={this.handleClickMenu}>
          <Drawer src={drawer} />
        </div>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openMenu: () => dispatch(updateServiceState({
    openMenu: true
  }))
})

export default connect(
  null,
  mapDispatchToProps,
)(MenuBar)
