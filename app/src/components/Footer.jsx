import React from 'react'
import styled from 'styled-components'
import { TEXT_DARK_GRAY } from '@/constants/colors'
import { isHandheld } from '@/utils'
import LanguageSelector from './LanguageSelector'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${isHandheld() ? 'center' : 'space-between'};
  padding: 10px ${isHandheld() ? 0 : 60}px;
  font-size: 12px;
  color: ${TEXT_DARK_GRAY};
`

const Copyright = styled.div`
  text-align: center;
`

const Footer = () => {
  return (
    <Wrapper>
      <Copyright>© Copyright {new Date().getFullYear()} ArcadeX - All Rights Reserved.</Copyright>
      {!isHandheld() && <LanguageSelector />}
    </Wrapper>
  )
}

export default Footer
