import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import intl from 'react-intl-universal'
import { BG_RED, TEXT_WHITE, BG_PRIMARY } from '@/constants/colors'
import arcadeSVG from '@/assets/arcades.svg'
import SVG from '@/components/SVG'
import { sendPageView } from '@/utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0 20px 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  background: ${BG_PRIMARY};
  padding: 100px 60px;
`

const Text = styled.div`
  font-size: 48px;
  font-weight: bold;
  white-space: pre;
`

const Button = styled.button`
  width: 200px;
  height: 60px;
  color: ${TEXT_WHITE};
  font-size: 18px;
  background: ${BG_RED};
  margin-top: 28px;
`

const Arcade = styled(SVG)`
  flex: 2;
  > svg {
    width: 100%;
  }
`

const Col = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 60px;
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
            <Button onClick={() => this.props.history.push('/hall')}>
              <b>{intl.get('let_s_play')}</b>
            </Button>
          </Col>
          <Arcade src={arcadeSVG} />
        </Content>
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
