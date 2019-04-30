import React from 'react'
import styled from 'styled-components'
import intl from 'react-intl-universal'
import Slots, { ComboPrices } from '@/constants/slots'
import SVG from '@/components/SVG'
import firstSVG from '@/assets/icon-no-1.svg'
import secondSVG from '@/assets/icon-no-2.svg'
import thirdSVG from '@/assets/icon-no-3.svg'
import arrow from '@/assets/ic-arrow.svg'
import {
  BG_SECONDARY,
  TEXT_GRAY,
} from '@/constants/colors'
import { isHandheld } from '@/utils'

const Headline = styled.div`
  font-size: ${isHandheld() ? 18 : 24}px;
  font-weight: bold;
  ${isHandheld() && `
    margin-bottom: 18px;
  `}
`

const HeadText = styled.span`
  margin: 0 auto;
  position: relative;
`

const Arrow = styled(SVG)`
  width: 20px;
  height: 20px;
  top: 0;
  right: -40px;
  position: absolute;
  ${p => p.isCollapse && `
    transform: rotate(0.5turn);
  `}
  transition: transform .5s;
`

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
`

const HeaderRow = styled(Row)`
  margin: 10px 0 12px 0;
`

const RewardRow = styled(Row)`
  height: 84px;
  background: ${BG_SECONDARY};
  border-radius: 12px;
  margin-bottom: 10px;
`

const Text = styled.div`
  font-size: 14px;
`

const Col = styled.div`
  flex: ${props => props.colSpan || 1};
  display: flex;
  align-items: center;
  justify-content: center;
`

const ColTitle = styled(Text)`
  font-weight: bold;
  color: ${TEXT_GRAY};
`

const RankSVG = styled(SVG)`
  width: 40px;
  height: 50px;
`

const ComboSVG = styled(SVG)`
  width: 30px;
  height: 30px;
`

const renderRankText = (rank) => {
  switch (rank) {
    case 0: {
      return <RankSVG src={firstSVG} />
    }
    case 1: {
      return <RankSVG src={secondSVG} />
    }
    case 2: {
      return <RankSVG src={thirdSVG} />
    }
    default: {
      return rank + 1
    }
  }
}

const RewardBoard = ({ rewards, style, className, isCollapse, ...props }) => {
  return (
    <div style={style} className={className} {...props}>
      <Headline>
        <HeadText>
          {intl.get('slot_machine_reward_board')}
          {isHandheld() && <Arrow src={arrow} isCollapse={isCollapse} />}
        </HeadText>
      </Headline>
      <HeaderRow>
        <Col>
          <ColTitle>{intl.get('slot_machine_rank')}</ColTitle>
        </Col>
        <Col colSpan={2}>
          <ColTitle>{intl.get('slot_machine_combo')}</ColTitle>
        </Col>
        <Col>
          <ColTitle>{intl.get('slot_machine_reward')}</ColTitle>
        </Col>
        <Col>
          <ColTitle>{intl.get('slot_machine_prob')}</ColTitle>
        </Col>
      </HeaderRow>
      {rewards.map(({ value, prob }, idx) => (
        value.amount.isZero()
        ? null
        : <RewardRow key={idx}>
            <Col>
              <Text>{renderRankText(idx)}</Text>
            </Col>
            <Col colSpan={2}>
              {Array(3).fill().map((v, i) => (
                <ComboSVG
                  key={`combo-${idx}-${i}`}
                  src={Slots[ComboPrices[idx]]}
                />
              ))}
            </Col>
            <Col>
              <Text>{value.amount.toString()}</Text>
            </Col>
            <Col>
              <Text>{prob * 100}%</Text>
            </Col>
          </RewardRow>
      ))}
    </div>
  )
}

export default RewardBoard
