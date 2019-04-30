import React from 'react'
import styled from 'styled-components'
import intl from 'react-intl-universal'
import SVG from '@/components/SVG'
import { BG_SECONDARY } from '@/constants/colors'
import { isHandheld } from '@/utils'
import {
  TEXT_GRAY,
} from '@/constants/colors'
import arrow from '@/assets/ic-arrow.svg'

const Headline = styled.div`
  font-size: ${isHandheld() ? 18 : 24}px;
  font-weight: bold;
  text-align: center;
  ${isHandheld() && `
    margin-bottom: 8px;
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

const RankSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${isHandheld() ? 20 : 12}px;
`

const LineupSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  background: ${BG_SECONDARY};
  margin-top: 6px;
  padding: 6px 0;
  ${!isHandheld() && `
    border-radius: 12px;
  `}
`

const Text = styled.div`
  color: ${TEXT_GRAY};
  font-size: 14px;
  text-align: center;
  white-space: pre;
`

const IconSVG = styled(SVG)`
  width: 51px;
  height: 70px;
  display: flex;
  align-items: flex-end;
  > svg {
    width: 100%;
    height: auto;
  }
`

const Rank = ({ rank: { title, lineup } }) => {
  return (
    <RankSection>
      <Text>{intl.get(title).defaultMessage(title)}</Text>
      <LineupSection>
        {lineup.map(({ src }, idx) => <IconSVG key={idx} src={src} />)}
      </LineupSection>
    </RankSection>
  )
}

const Collectibles = ({ ranks, style, className, isCollapse, ...props }) => {
  return (
    <div style={style} className={className} {...props} >
      <Headline>
        <HeadText>
          {intl.get('gachapon_collectibles')}
          {isHandheld() && <Arrow src={arrow} isCollapse={isCollapse} />}
        </HeadText>
      </Headline>
      {ranks.map((rank, idx) => <Rank key={idx} rank={rank} />)}
    </div>
  )
}

export default Collectibles
