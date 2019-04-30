import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import Collection from '@/components/Collection/Desktop'
import { sendPageView } from '@/utils'

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
`

class CollectionContainer extends Component {
  componentDidMount() {
    sendPageView()
  }

  render() {
    return (
      <Container>
        <Collection />
      </Container>
    )
  }
}

export default withRouter(CollectionContainer)
