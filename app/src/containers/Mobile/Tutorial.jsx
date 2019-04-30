import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import intl from 'react-intl-universal'
import replace from 'react-string-replace'
import { TEXT_GRAY, TEXT_LINK, BG_PRIMARY } from '@/constants/colors'
import { updateServiceState } from '@/actions/Service'
import { URL_FAUCET } from '@/constants/routes'
import { sendPageView } from '@/utils'

const Container = styled.div`
  padding: 8px;
`

const Block = styled.div`
  padding: 32px 16px;
  margin: 4px 0;
  background: ${BG_PRIMARY};
  display: flex;
  flex-direction: column;
  border-radius: 12px;
`

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`

const Text = styled.div`
  font-size: 14px;
  color: ${TEXT_GRAY};
`

const GreenText = styled.span`
  color: ${TEXT_LINK};
  cursor: pointer;
`

const LinkText = styled.a`
  color: ${TEXT_LINK};
  text-decoration: none;
`

const Disclaimer = styled.div`
  font-size: 14px;
  margin: 10px 0;
`

const Rule = styled.li`
  color: ${TEXT_GRAY};
  margin-bottom: 8px;
`

const DisclaimerTitle = styled.div`
  font-size: 18px;
  margin: 0 8px;
`

const Href = ({ url, children }) => (
  <LinkText target="_blank" rel="noopener noreferrer" href={url} >{children}</LinkText>
)

class Tutorial extends Component {
  componentDidMount() {
    sendPageView()
  }

  render() {
    return (
      <Container>
        <Block>
          <Title>{intl.get('tutorial_step_1')}</Title>
          <Text>
            {replace(
              intl.get('tutorial_step_1_desc'),
              '{here}',
              () => <GreenText onClick={this.props.onDekuSanClick} >{intl.get('tutorial_here')}</GreenText>
            )}
          </Text>
        </Block>
        <Block>
          <Title>{intl.get('tutorial_step_2')}</Title>
          <Text>
            {replace(
              intl.get('tutorial_step_2_desc'),
              '{here}',
              () => <Href url={URL_FAUCET} >{intl.get('tutorial_here')}</Href>
            )}
          </Text>
        </Block>
        <Block>
          <Title>{intl.get('tutorial_step_3')}</Title>
          <Text>
            {intl.get('tutorial_step_3_desc')}
          </Text>
        </Block>
        <Disclaimer>
          <DisclaimerTitle>{intl.get('tutorial_disclaimer')}</DisclaimerTitle>
          <ul>
            <Rule>{intl.get('tutorial_disclaimer_1')}</Rule>
            <Rule>{intl.get('tutorial_disclaimer_2')}</Rule>
            <Rule>{intl.get('tutorial_disclaimer_3')}</Rule>
            <Rule>{intl.get('tutorial_disclaimer_4')}</Rule>
            <Rule>{intl.get('tutorial_disclaimer_5')}</Rule>
            <Rule>{intl.get('tutorial_disclaimer_6')}</Rule>
          </ul>
        </Disclaimer>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onDekuSanClick: () => dispatch(updateServiceState({ hideInstallModal: false }))
})

export default connect(
  null,
  mapDispatchToProps,
)(Tutorial)
