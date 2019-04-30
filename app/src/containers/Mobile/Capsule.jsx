import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import {
  BG_PRIMARY,
} from '@/constants/colors'
import CapsuleBoard, { capsules } from '@/components/Capsule/CapsuleBoard'
import Collectibles from '@/components/Capsule/Collectibles'
import Collection from '@/components/Collection/Mobile'
import { sendPageView } from '@/utils'

const Container = styled.div`
  padding: 8px 0;
`

const MainBoard = styled(CapsuleBoard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${BG_PRIMARY};
  padding: 30px 0;
`

const StyledCollectibles = styled(Collectibles)`
  display: flex;
  flex-direction: column;
  background: ${BG_PRIMARY};
  padding: 20px 0;
  margin-top: 10px;
  overflow: hidden;
  transition: max-height .5s;
  max-height: ${p => p.isCollapse ? 60 : 1000}px;
`

const StyledCollection = styled(Collection)`
  padding: 8px;
`

class Capsule extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      currentIndex: 1,
      isCollapse: true,
    }
  }

  componentDidMount() {
    sendPageView()
  }

  onCapsuleClick = (idx) => {
    this.setState({ currentIndex: idx })
  }

  onCollectibleClick = () => {
    this.setState({ isCollapse: !this.state.isCollapse })
  }

  render() {
    const { currentIndex, isCollapse } = this.state
    const { ranks } = capsules[currentIndex]
    return (
      <Container>
        <MainBoard
          currentIndex={currentIndex}
          onChangeIndex={this.onCapsuleClick}
        />
        <StyledCollectibles
          ranks={ranks}
          rewards={[]}
          isCollapse={isCollapse}
          onClick={this.onCollectibleClick}
        />
        <StyledCollection />
      </Container>
    )
  }
}

export default withRouter(Capsule)
