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
  padding: 8px 0;
`

const HistoryAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const cardStyle = `
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${BG_PRIMARY};
`

const StyledSlotsBoard = styled(SlotsBoard)`
  ${cardStyle}
  padding: 42px 8px;
`

const StyledRewardBoard = styled(RewardBoard)`
  ${cardStyle}
  padding: 20px 8px;
  margin: 8px 0;
  overflow: hidden;
  transition: max-height .4s;
  max-height: ${p => p.isCollapse ? 60 : 1000}px;
`

const StyledHistoryBoard = styled(HistoryBoard)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 12px;
  padding-top: 20px;
  background: ${BG_PRIMARY};
`

class SlotMachine extends Component {
  state = {
    isCollapse: true,
  }

  componentDidMount() {
    sendPageView()
    if (!this.props.machine) {
      this.props.loadMachine()
    }
  }

  onRewardClick = () => {
    this.setState({ isCollapse: !this.state.isCollapse })
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
        <StyledSlotsBoard />
        <StyledRewardBoard
          rewards={prices}
          isCollapse={this.state.isCollapse}
          onClick={this.onRewardClick}
        />
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
