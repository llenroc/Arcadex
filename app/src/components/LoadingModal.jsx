import React, { Component }from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Lottie from 'react-lottie'
import animationData from '@/assets/loading.json'
import Modal from '@/components/Modal'
import {
  BORDER_DIALOG,
  BG_PRIMARY
} from '@/constants/colors'
import { isHandheld } from '@/utils'

const Container = styled.div`
  width: ${isHandheld() ? 320 : 620}px;
  height: 300px;
  border-radius: 12px;
  border: 3px solid ${BORDER_DIALOG};
  background-color: ${BG_PRIMARY};
  display: flex;
  justify-content: center;
  align-items: center;
`

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

class LoadingModal extends Component {
  render() {
    let { hide } = this.props
    return (
      <Modal
        isOpen={!hide}
        style={ {
          overlay: {
            background: 'rgba(25, 33, 51, 0.9)'
          },
          content: {
          }
        } }
      >
        <Container>
          <Lottie
            width={93}
            height={93}
            options={defaultOptions}
          />
        </Container>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  hide: state.getIn(['Service', 'hideLoadingModal'])
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingModal)
