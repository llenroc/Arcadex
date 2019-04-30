import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications'
import intl from 'react-intl-universal'
import { updateServiceState } from '@/actions/Service'
import {
  BG_RED,
  TEXT_WHITE,
  TEXT_GRAY,
} from '@/constants/colors'
import SVG from '@/components/SVG'
import capsulePNG from '@/assets/capsule.png'
import dekuFamilyPNG from '@/assets/cover-deku-family.png'
import dekuCareerPNG from '@/assets/cover-deku-career.png'
import comingSoonPNG from '@/assets/cover-coming-soon.png'
import Balance from '@/components/Balance'
import Backend from '@/services/backend'
import { loadCapsules } from '@/actions/Machine'
import characters from '@/constants/characters'
import { isHandheld } from '@/utils'
import AddrConfig from '%/config'

const STATUS_POLLING_PERIOD = 1000

// TODO: update from contract?
export const capsules = [
  {
    available: false,
    cover: comingSoonPNG,
    ranks: [{
      title: 'gachapon_coming_soon',
      lineup: [characters.lover],
    }],
  },
  {
    available: true,
    cover: dekuFamilyPNG,
    ranks: [
      {
        title: 'SSR (5%)',
        lineup: [characters.twbear, characters.seal],
      },
      {
        title: 'SR (15%)',
        lineup: [characters.lion, characters.tiger, characters.deer],
      },
      {
        title: 'R (30%)',
        lineup: [characters.pig, characters.bunny, characters.koala],
      },
      {
        title: 'N (50%)',
        lineup: [characters.dekuSan, characters.cat, characters.dog],
      },
    ],
  },
  {
    available: true,
    cover: dekuCareerPNG,
    ranks: [
      {
        title: 'SSR (5%)',
        lineup: [characters.homeless],
      },
      {
        title: 'SR (15%)',
        lineup: [characters.geek, characters.angel],
      },
      {
        title: 'R (30%)',
        lineup: [characters.santa, characters.dancer, characters.surfer],
      },
      {
        title: 'N (50%)',
        lineup: [characters.miner, characters.lover, characters.lazybone],
      },
    ],
  },
]

const Headline = styled.div`
  font-size: ${isHandheld() ? 18 : 24}px;
  font-weight: bold;
  text-align: center;
  display: flex;
  flex-direction: ${isHandheld() ? 'column' : 'row'};
`
const SubHeadline = styled.div`
  margin-top: 6px;
  font-size: ${isHandheld() ? 14 : 18}px;
  color: ${TEXT_GRAY};
`
const CapsuleSVG = styled.img`
  width: ${isHandheld() ? 211 : 265}px;
  height: ${isHandheld() ? 317 : 400}px;
`

const Cover = styled.img`
  position: absolute;
  top: 10%;
  left: 9%;
  width: 82%;
  height: 48%;
`

const Button = styled.button`
  width: 156px;
  height: ${isHandheld() ? 36 : 60}px;
  color: ${TEXT_WHITE};
  font-size: ${isHandheld() ? 14 : 18}px;
  font-weight: bold;
  background: ${props => props.isDisabled ? '#4a4a4a' : BG_RED};
`

const CapsuleContainer = styled.div`
  margin: 35px 0 20px;
  height: 400px;
  width: 100%;
  position: relative;
  ${isHandheld() && `
    margin: 24px 0 29px;
    height: 317px;
  `}
`

const CapsuleMachine = styled(({ cover, ...props }) => (
  <div {...props}>
    <CapsuleSVG src={capsulePNG} />
    <Cover src={cover} />
  </div>
))`
  transition: all 1s;
  position: absolute;
  top: 50%;
  left: ${props => (props.pos + 1) * 50}%;
  transform: translate(-50%, -50%) scale(${props => 1 - Math.abs(props.pos) * 0.3});
`

const Result = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 30px;
`

const ResultSVG = styled(SVG)`
  width: 220px;
  height: 300px;
  display: flex;
  align-items: flex-end;
  > svg {
    width: 100%;
    height: auto;
  }
`

class CapsuleBoard extends Component {
  state = {
    isCoinInserted: [],
  }

  componentDidMount() {
    if (!this.props.familyCapsule || !this.props.careerCapsule) {
      this.props.loadMachines()
    }
    if (this.isReady(this.props)) {
      this.setupMachineStatusPolling()
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.isReady(prevProps) && this.isReady(this.props)) {
      this.setupMachineStatusPolling()
    }
  }

  componentWillUnmount() {
    this.clearMachineStatusPolling()
  }

  isReady = ({ isRightNetwork, familyCapsule, careerCapsule }) => {
    return !!isRightNetwork && !!familyCapsule && !!careerCapsule
  }

  clearMachineStatusPolling = () => {
    if (this.machineStatusPollingTimeout) {
      clearTimeout(this.machineStatusPollingTimeout)
    }
    this.machineStatusPollingTimeout = null
  }

  setupMachineStatusPolling = async () => {
    this.clearMachineStatusPolling()

    let [
      familyStatus,
      careerStatus,
    ] = (await Promise.all([
      Backend().getMachineAccountStatus(this.props.familyCapsule),
      Backend().getMachineAccountStatus(this.props.careerCapsule)
    ])).map((v) => v ? !v.isZero() : false)
    this.setState({ isCoinInserted: [ false, familyStatus, careerStatus ] })
    this.machineStatusPollingTimeout = setTimeout(this.setupMachineStatusPolling, STATUS_POLLING_PERIOD)
  }

  toastError = (error) => this.props.toastManager.add(
    error,
    {
      appearance: 'error',
      autoDismiss: true,
    },
  )

  onCapsuleClick = (idx) => {
    this.props.onChangeIndex(idx)
  }

  onGachaClick = async () => {
    const {
      familyCapsule,
      careerCapsule,
      isRightNetwork,
      currentIndex,
    } = this.props
    const { isCoinInserted } = this.state

    if (!isRightNetwork) {
      return this.toastError(intl.get('error_no_wallet'))
    }

    if (!familyCapsule || !careerCapsule) {
      return this.toastError(intl.get('error_gacha_offline'))
    }

    if (!capsules[currentIndex].available) {
      return this.toastError(intl.get('error_gacha_unavailable'))
    }

    // TODO: refine logic
    const machine = (
      currentIndex === 1 ? familyCapsule :
      currentIndex === 2 ? careerCapsule : null
    )

    await this.doConfirm(machine, isCoinInserted[currentIndex])
  }

  doConfirm = async (machine, status) => {
    const {
      toastManager,
      showLoading,
      hideLoading,
    } = this.props

    showLoading()
    this.clearMachineStatusPolling()
    try {
      if (!status) {
        await Backend().insertCoin(machine)
        toastManager.add(
          (
            <Result>
              {intl.get('gachapon_you_can_spin')}
            </Result>
          ), {
          appearance: 'success',
          autoDismiss: true,
        })
      } else {
        const result = await Backend().drawRewardCapsule(machine)
        const name = Object.keys(AddrConfig).find(key => AddrConfig[key] === result.token.addr)
        const character = Object.values(characters).find(({ name: n }) => n === name)

        toastManager.add(
          (
            <Result>
              {intl.get('gachapon_you_got', { name })}
              <ResultSVG src={character.src} />
            </Result>
          ), {
          appearance: 'success',
          autoDismiss: true,
        })
      }
    } catch (e) {
      console.log(`playCapsule error: ${e}`)
      this.toastError(intl.get('error_send_tx_failed'))
    }
    hideLoading()
    this.setupMachineStatusPolling()
  }

  render() {
    const {
      className,
      isRightNetwork,
      currentIndex,
    } = this.props
    const { isCoinInserted } = this.state

    return (
      <div className={className}>
        <Headline>
          {intl.get('gachapon_your_balance')}
          <Balance />
        </Headline>
        <SubHeadline>
          {intl.get('gachapon_collect_your_dekufamily')}
        </SubHeadline>
        <CapsuleContainer>
          {capsules.map(({ cover }, idx) => (
            <CapsuleMachine
              key={idx}
              pos={idx-currentIndex}
              cover={cover}
              onClick={() => this.onCapsuleClick(idx)}
            />
          ))}
        </CapsuleContainer>
        <Button
          isDisabled={!isRightNetwork || !capsules[currentIndex].available}
          onClick={this.onGachaClick}
        >{intl.get(isCoinInserted[currentIndex] ? 'gachapon_spin' : 'gachapon_insert_coin')}</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isRightNetwork: state.getIn(['Wallet', 'isRightNetwork']),
  familyCapsule: state.getIn(['Machine', 'familyCapsule']),
  careerCapsule: state.getIn(['Machine', 'careerCapsule']),
})

const mapDispatchToProps = (dispatch) => ({
  loadMachines: () => dispatch(loadCapsules()),
  showLoading: () => dispatch(updateServiceState({ hideLoadingModal: false })),
  hideLoading: () => dispatch(updateServiceState({ hideLoadingModal: true })),
})

export default withToastManager(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CapsuleBoard))
