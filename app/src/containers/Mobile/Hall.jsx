import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import intl from 'react-intl-universal'
import {
  BG_PRIMARY,
  BG_HOVER,
  BG_RED,
} from '@/constants/colors'
import { SLOT_MACHINE_PAGE, CAPSULE_PAGE } from '@/constants/routes'
import capsuleSVG from '@/assets/capsule.svg'
import slotMachineSVG from '@/assets/slot-machine.svg'
import SVG from '@/components/SVG'
import { sendPageView } from '@/utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  overflow: none;
`

const Card = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 4px 0;
  padding: 8px 0;
  min-height: 300px;
  background: ${BG_PRIMARY};
  overflow: hidden;
  :hover {
    background: ${BG_HOVER};
    > button {
      background: ${BG_RED};
    }
  }
`

const Spacer = styled.div`
  flex: none;
  width: 10px;
`

const Headline = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 8px;
`

const Text = styled.div`
  font-size: 11px;
  margin-top: 4px;
`

const Arcade = styled(SVG)`
  width: 120px;
  height: 200px;
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
        </Card>
        <Spacer />
        <Card
          onClick={() => history.push(CAPSULE_PAGE)}
        >
          <Arcade src={capsuleSVG} />
          <Headline>{intl.get('gachapon')}</Headline>
          <Text>{intl.get('gachapon_slogan')}</Text>
        </Card>
      </Container>
    )
  }
}

export default withRouter(Hall)
