import React, { Component } from 'react'
import styled from 'styled-components'
import Modal from '@/components/Modal'
import intl from 'react-intl-universal'
import { updateServiceState } from '@/actions/Service'
import { connect } from 'react-redux'
import {
  BORDER_DIALOG,
  BORDER_BUTTON,
  TEXT_WHITE,
  BG_PRIMARY
} from '@/constants/colors'
import SVG from '@/components/SVG'
import exitSVG from '@/assets/icon-exit.svg'
import chromeSVG from '@/assets/icon-chrome.svg'
import firefoxSVG from '@/assets/icon-firefox.svg'
import dexonWalletSVG from '@/assets/logo-dexon-wallet.svg'
import { isHandheld } from '@/utils'

const BORDER_RADIUS = '12px'

const URL_DEKUSAN_CHROME = 'https://chrome.google.com/webstore/detail/dekusan/anlicggbddjeebblaidciapponbpegoj'
const URL_DEKUSAN_FIREFOX = 'https://addons.mozilla.org/en-US/firefox/addon/dekusan'

const Container = styled.div`
  width: ${isHandheld() ? 330 : 616}px;
  height: 299px;
  overflow: visible;
  border-radius: ${BORDER_RADIUS};
  border: 3px solid ${BORDER_DIALOG};
  background-color: ${BG_PRIMARY};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 0;
`

const DexonWalletLogo = styled(SVG)`
  top: 102px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  z-index: -1;
`
const Close = styled(SVG)`
  width: 66px;
  height: 66px;
`

const Icon = styled(SVG)`
  width: 26px;
  height: 26px;
  display: inline-block;
  margin: 0 10px;
`

const CloseButton = styled.button`
  border-radius: 50%;
  background: transparent;
  position: absolute;
  padding: 0;
  top: -18px;
  right: -18px;
`

const InstallLink = styled.a`
  border: 1px solid ${BORDER_BUTTON};
  border-radius: 22.5px;
  height: 45px;
  width: 240px;
  display: flex;
  align-items: center;
  color: ${TEXT_WHITE};
  text-decoration: none;
  :hover {
    background-color: ${BORDER_BUTTON};
  }
`

const LinkRow = styled.div`
  margin: 0px 0px 20px 0px;
  display: flex;
  justify-content: space-between;
  padding: 0 46px;
`

const Title = styled.div`
  margin-top: 30px;
  font-size: 40px;
  text-align: center;
`

const MobileTitle = styled.div`
  margin-top: 30px;
  font-size: 24px;
  text-align: center;
  padding: 0 30px;
`

const Text = styled.span`
  font-size: 14px;
`

class InstallDekuSanModal extends Component {
  render() {
    let { hide, onCloseClick } = this.props
    return (
      <Modal
        isOpen={!hide}
        style={ {
          content: {
            overflow: 'visible',
            borderRadius: BORDER_RADIUS,
          }
        } }
      >
        <Container>
          <CloseButton onClick={onCloseClick}>
            <Close src={exitSVG} />
          </CloseButton>
          {isHandheld() ? (
            <MobileTitle>{intl.get('install_dekusan')}</MobileTitle>
          ) : (
            <Title>{intl.get('install_dekusan')}</Title>
          )}
          {!isHandheld() && <LinkRow>
            <InstallLink target="_blank" rel="noopener noreferrer" href={URL_DEKUSAN_CHROME}>
              <Icon src={chromeSVG} />
              <Text>{intl.get('download_chrome_ext')}</Text>
            </InstallLink>
            <InstallLink target="_blank" rel="noopener noreferrer" href={URL_DEKUSAN_FIREFOX}>
              <Icon src={firefoxSVG} />
              <Text>{intl.get('download_firefox_ext')}</Text>
            </InstallLink>
          </LinkRow>}
          <DexonWalletLogo src={dexonWalletSVG} />
        </Container>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  hide: state.getIn(['Service', 'hideInstallModal'])
})

const mapDispatchToProps = (dispatch) => ({
  onCloseClick: () => { dispatch(updateServiceState({ hideInstallModal: true })) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InstallDekuSanModal)
