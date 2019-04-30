import React from 'react'
import styled from 'styled-components'
import { mapLanguageCodeToLocalName } from '@/utils'
import { BORDER_DIALOG } from '@/constants/colors'

const Switch = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  border: 1px solid ${BORDER_DIALOG};
  border-radius: 12px;
`

const Arrow = styled.div`
  margin-left: 10px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 4px 0 4px;
  border-color: ${BORDER_DIALOG} transparent transparent transparent;
`

const LanguageToggle = ({ locale }) => (
  <Switch>
    {mapLanguageCodeToLocalName(locale)}
    <Arrow />
  </Switch>
)

export default LanguageToggle
