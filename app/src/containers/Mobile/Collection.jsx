import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import Collection from '@/components/Collection/Mobile'
import { sendPageView } from '@/utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
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
