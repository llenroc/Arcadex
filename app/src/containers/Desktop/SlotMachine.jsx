import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  BG_PRIMARY,
} from '@/constants/colors'
import { loadSlotMachine } from '@/actions/Machine'
import SlotsBoard from '@/components/SlotMachine/SlotsBoard'
import RewardBoard from '@/components/SlotMachine/RewardBoard'
import HistoryBoard from '@/components/SlotMachine/HistoryBoard'
import { sendPageView } from '@/utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 60px;
`

const SlotsAreaContainer = styled.div`
  flex: none;
  display: flex;
`

const HistoryAreaContainer = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;
`

const cardStyle = `
  height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: ${BG_PRIMARY};
  padding: 30px 0 48px 0;
`

const StyledSlotsBoard = styled(SlotsBoard)`
  ${cardStyle}
  flex: 1;
`

const StyledRewardBoard = styled(RewardBoard)`
  ${cardStyle}
  width: 430px;
  padding-left: 20px;
  padding-right: 20px;
`

const StyledHistoryBoard = styled(HistoryBoard)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 12px;
`

const VSpacer = styled.div`
  width: 22px;
`

const HSpacer = styled.div`
  height: 50px;
  flex: none;
`

class SlotMachine extends Component {
  componentDidMount() {
    sendPageView()
    if (!this.props.machine) {
      this.props.loadMachine()
    }
  }

  render() {
    const { machine } = this.props
    let prices = []
    if (machine) {
      prices = machine.prices.slice()
      prices.sort((a, b) => a.id-b.id)
    }

    return (
      <Container>
        <SlotsAreaContainer>
          <StyledSlotsBoard />
          <VSpacer />
          <StyledRewardBoard rewards={prices} />
        </SlotsAreaContainer>
        <HSpacer />
        <HistoryAreaContainer>
          { machine ? <StyledHistoryBoard /> : null }
        </HistoryAreaContainer>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  machine: state.getIn(['Machine', 'slotMachine'])
})

const mapDispatchToProps = (dispatch) => ({
  loadMachine: () => dispatch(loadSlotMachine()),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SlotMachine))
