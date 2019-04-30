import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import intl from 'react-intl-universal'
import {
  BG_PRIMARY,
  TEXT_WHITE,
} from '@/constants/colors'
import CapsuleBoard, { capsules } from '@/components/Capsule/CapsuleBoard'
import Collectibles from '@/components/Capsule/Collectibles'
import Collection from '@/components/Collection/Desktop'
import { sendPageView } from '@/utils'

const cardStyle = `
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: ${BG_PRIMARY};
  padding: 30px 0;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 12px;
  align-items: center;
  display: flex;
  color: ${TEXT_WHITE};
  flex: none;
  flex-direction: column;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 60px;
`

const GachaponAreaContainer = styled.div`
  display: flex;
  flex: none;
`

const CollectionAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
`

const HSpacer = styled.div`
  height: ${props => props.height}px;
  flex: none;
`

const MainBoard = styled(CapsuleBoard)`
  ${cardStyle}
  flex: 2;
  overflow: hidden;
`

const VSpacer = styled.div`
  width: 22px;
`

const StyledCollectibles = styled(Collectibles)`
  ${cardStyle}
  flex: 1;
  align-items: stretch;
  padding-left: 20px;
  padding-right: 20px;
`

const StyledCollection = styled(Collection)`
  flex: none;
`

class Capsule extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      currentIndex: 1,
    }
  }

  componentDidMount() {
    sendPageView()
  }

  onCapsuleClick = (idx) => {
    this.setState({ currentIndex: idx })
  }

  render() {
    const { currentIndex } = this.state
    const { ranks } = capsules[currentIndex]
    return (
      <Container>
        <GachaponAreaContainer>
          <MainBoard
            currentIndex={currentIndex}
            onChangeIndex={this.onCapsuleClick}
          />
          <VSpacer />
          <StyledCollectibles ranks={ranks} rewards={[]} />
        </GachaponAreaContainer>
        <HSpacer height="50" />
        <CollectionAreaContainer>
          <Title>{intl.get('my_collection')}</Title>
          <HSpacer height="7" />
          <StyledCollection />
        </CollectionAreaContainer>
      </Container>
    )
  }
}

export default withRouter(Capsule)
