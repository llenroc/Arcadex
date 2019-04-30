import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import intl from 'react-intl-universal'
import { BG_RED, TEXT_WHITE, BG_PRIMARY } from '@/constants/colors'
import arcadeSVG from '@/assets/arcades.svg'
import SVG from '@/components/SVG'
import Footer from '@/components/Footer'
import { sendPageView } from '@/utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0 0;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${BG_PRIMARY};
  padding: 24px;
`

const Text = styled.div`
  font-size: 32px;
  font-weight: bold;
  white-space: pre;
`

const Button = styled.button`
  width: 200px;
  height: 36px;
  color: ${TEXT_WHITE};
  font-size: 15px;
  background: ${BG_RED};
  margin-top: 58px;
`

const Arcade = styled(SVG)`
  width: 100%;
  display: flex;
  justify-content: center;
  > svg {
    max-width: 327px;
    height: auto;
  }
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 36px 0 60px;
`

class Home extends Component {
  componentDidMount() {
    sendPageView()
  }

  render() {
    return (
      <Container>
        <Content>
          <Col>
            <Text>{intl.get('slogan')}</Text>
          </Col>
          <Arcade src={arcadeSVG} />
          <Button onClick={() => this.props.history.push('/hall')}>
            <b>{intl.get('let_s_play')}</b>
          </Button>
        </Content>
        <Footer />
      </Container>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home))
