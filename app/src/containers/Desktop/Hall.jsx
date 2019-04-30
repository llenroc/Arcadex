import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import intl from 'react-intl-universal'
import {
  BG_PRIMARY,
  BG_HOVER,
  BG_RED,
  TEXT_WHITE,
} from '@/constants/colors'
import { SLOT_MACHINE_PAGE, CAPSULE_PAGE } from '@/constants/routes'
import capsuleSVG from '@/assets/capsule.svg'
import slotMachineSVG from '@/assets/slot-machine.svg'
import SVG from '@/components/SVG'
import { sendPageView } from '@/utils'

const Container = styled.div`
  display: flex;
  padding: 10px 15px;
`

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 53px 0;
  border-radius: 12px;
  background: ${BG_PRIMARY};
  :hover {
    background: ${BG_HOVER};
    > button {
      background: ${BG_RED};
    }
  }
`

const Spacer = styled.div`
  width: 10px;
`

const Headline = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 25px;
`

const Text = styled.div`
  font-size: 18px;
  margin-top: 10px;
`

const Button = styled.button`
  width: 200px;
  height: 60px;
  color: ${TEXT_WHITE};
  font-size: 18px;
  font-weight: bold;
  margin-top: 40px;
  text-transform: uppercase;
  background: transparent;
`

const Arcade = styled(SVG)`
  flex: 1;
  > svg {
    max-width: 100%;
    max-height: 100%;
  }
`

class Hall extends Component {
  componentDidMount() {
    sendPageView()
  }

  render() {
    const { history } = this.props
    return (
      <Container>
        <Card
          onClick={() => history.push(SLOT_MACHINE_PAGE)}
        >
          <Arcade src={slotMachineSVG} />
          <Headline>{intl.get('slot_machine')}</Headline>
          <Text>{intl.get('slot_machine_slogan')}</Text>
          <Button>{intl.get('let_s_start')}</Button>
        </Card>
        <Spacer />
        <Card
          onClick={() => history.push(CAPSULE_PAGE)}
        >
          <Arcade src={capsuleSVG} />
          <Headline>{intl.get('gachapon')}</Headline>
          <Text>{intl.get('gachapon_slogan')}</Text>
          <Button>{intl.get('let_s_start')}</Button>
        </Card>
      </Container>
    )
  }
}

export default withRouter(Hall)
